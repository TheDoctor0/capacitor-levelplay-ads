import type { ConsentDecision, ConsentJurisdiction, ConsentService, ConsentServicesConfig } from '../definitions';

import type { ConsentChoice } from './types';

/** IAB purpose 1 — without it no identifier may be stored on the device. */
const STORE_ACCESS_DEVICE_PURPOSE = 1;
const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

const unique = <T>(values: T[]): T[] => [...new Set(values)];

/** Services that need a choice: everything except the essential ones. */
export function optionalServices(config: ConsentServicesConfig): ConsentService[] {
  return config.services.filter((service) => service.category !== 'essential');
}

export function declaredConsentPurposes(config: ConsentServicesConfig): number[] {
  return unique(optionalServices(config).flatMap((service) => service.consentPurposes ?? [])).sort((a, b) => a - b);
}

export function declaredLegIntPurposes(config: ConsentServicesConfig): number[] {
  return unique(optionalServices(config).flatMap((service) => service.legIntPurposes ?? [])).sort((a, b) => a - b);
}

export function declaredSpecialFeatures(config: ConsentServicesConfig): number[] {
  return unique(optionalServices(config).flatMap((service) => service.specialFeatures ?? [])).sort((a, b) => a - b);
}

function legIntServiceIds(config: ConsentServicesConfig): string[] {
  return optionalServices(config)
    .filter((service) => (service.legIntPurposes ?? []).length > 0)
    .map((service) => service.id);
}

export function choiceAcceptingEverything(config: ConsentServicesConfig): ConsentChoice {
  return {
    purposeConsents: declaredConsentPurposes(config),
    purposeLegInt: declaredLegIntPurposes(config),
    vendorConsents: optionalServices(config).map((service) => service.id),
    vendorLegInt: legIntServiceIds(config),
    specialFeatures: declaredSpecialFeatures(config),
  };
}

/**
 * Toggle state the modal opens with. A prior decision wins. Otherwise `opt_in`
 * starts with every consent off (pre-ticked boxes are not valid consent) and
 * legitimate interest on, as Google's consent platform does; `opt_out` / `none`
 * start with everything on.
 */
export function initialChoice(
  config: ConsentServicesConfig,
  jurisdiction: ConsentJurisdiction,
  prior: ConsentDecision | null,
): ConsentChoice {
  if (prior) {
    return {
      purposeConsents: prior.purposeConsents,
      purposeLegInt: prior.purposeLegInt,
      vendorConsents: prior.vendorConsents,
      vendorLegInt: prior.vendorLegInt,
      specialFeatures: prior.specialFeatures,
    };
  }

  if (jurisdiction !== 'opt_in') {
    return choiceAcceptingEverything(config);
  }

  return {
    purposeConsents: [],
    purposeLegInt: declaredLegIntPurposes(config),
    vendorConsents: [],
    vendorLegInt: legIntServiceIds(config),
    specialFeatures: [],
  };
}

/**
 * A service is granted when it is essential, or when its own toggle and every
 * purpose and special feature it declares are on. A service that only relies
 * on legitimate interest is granted unless the user objected to it or to one
 * of its purposes.
 */
export function isServiceGranted(choice: ConsentChoice, service: ConsentService): boolean {
  if (service.category === 'essential') {
    return true;
  }

  const consentPurposes = service.consentPurposes ?? [];
  const legIntPurposes = service.legIntPurposes ?? [];
  const specialFeatures = service.specialFeatures ?? [];
  const specialFeaturesAllowed = specialFeatures.every((feature) => choice.specialFeatures.includes(feature));

  if (consentPurposes.length > 0) {
    return (
      choice.vendorConsents.includes(service.id) &&
      consentPurposes.every((purpose) => choice.purposeConsents.includes(purpose)) &&
      specialFeaturesAllowed
    );
  }

  return (
    legIntPurposes.length > 0 &&
    choice.vendorLegInt.includes(service.id) &&
    legIntPurposes.every((purpose) => choice.purposeLegInt.includes(purpose)) &&
    specialFeaturesAllowed
  );
}

export function grantedServiceIds(config: ConsentServicesConfig, choice: ConsentChoice): string[] {
  return config.services.filter((service) => isServiceGranted(choice, service)).map((service) => service.id);
}

/** Per-network GDPR consent for every service mapped to a LevelPlay network. */
export function networkConsents(config: ConsentServicesConfig, choice: ConsentChoice): Record<string, boolean> {
  return Object.fromEntries(
    config.services
      .filter((service) => service.network)
      .map((service) => [service.network as string, isServiceGranted(choice, service)]),
  );
}

/**
 * Global grant forwarded to LevelPlay: device storage is allowed and at least
 * one ad network is granted.
 */
export function isAdsGranted(config: ConsentServicesConfig, choice: ConsentChoice): boolean {
  const adNetworkGranted = config.services.some((service) => service.network && isServiceGranted(choice, service));

  return choice.purposeConsents.includes(STORE_ACCESS_DEVICE_PURPOSE) && adNetworkGranted;
}

/**
 * LevelPlay's global GDPR consent: the `mediation` service's own grant, or —
 * when no service is marked `mediation` — {@link isAdsGranted}.
 */
export function isMediationGranted(config: ConsentServicesConfig, choice: ConsentChoice): boolean {
  const mediationService = config.services.find((service) => service.mediation);

  return mediationService ? isServiceGranted(choice, mediationService) : isAdsGranted(config, choice);
}

export function toDecision(
  choice: ConsentChoice,
  meta: { revision: string; jurisdiction: ConsentJurisdiction; explicit: boolean; now: number },
): ConsentDecision {
  return {
    revision: meta.revision,
    decidedAt: new Date(meta.now).toISOString(),
    jurisdiction: meta.jurisdiction,
    explicit: meta.explicit,
    purposeConsents: choice.purposeConsents,
    purposeLegInt: choice.purposeLegInt,
    vendorConsents: choice.vendorConsents,
    vendorLegInt: choice.vendorLegInt,
    specialFeatures: choice.specialFeatures,
  };
}

/** Parses a stored decision; `null` when there is none or it cannot be parsed. */
export function readStoredDecision(decisionJson: string | undefined): ConsentDecision | null {
  if (!decisionJson) {
    return null;
  }

  try {
    return JSON.parse(decisionJson) as ConsentDecision;
  } catch {
    return null;
  }
}

/** A decision is current when it was made against `revision` within `lifetimeDays`. */
export function isDecisionCurrent(decision: ConsentDecision, revision: string, lifetimeDays: number, now: number): boolean {
  const ageInDays = (now - Date.parse(decision.decidedAt)) / MILLIS_PER_DAY;

  return decision.revision === revision && ageInDays <= lifetimeDays;
}

/**
 * Builds an explicit refusal for a user who declined in a plugin version that
 * stored no decision JSON: the old `IABTCF_*` status was `DENIED`, or none of
 * the services they left on is an ad network. Returns `null` when the old data
 * shows no refusal.
 */
export function migratedRefusal(
  config: ConsentServicesConfig,
  legacy: { status: string; consentedServiceIds?: string[] },
  meta: { jurisdiction: ConsentJurisdiction; now: number },
): ConsentDecision | null {
  const consentedAdNetwork = config.services.some(
    (service) => service.network && (legacy.consentedServiceIds ?? []).includes(service.id),
  );

  if (legacy.status !== 'DENIED' && consentedAdNetwork) {
    return null;
  }

  return toDecision(
    { purposeConsents: [], purposeLegInt: [], vendorConsents: [], vendorLegInt: [], specialFeatures: [] },
    { revision: config.revision, jurisdiction: meta.jurisdiction, explicit: true, now: meta.now },
  );
}
