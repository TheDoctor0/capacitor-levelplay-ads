import type {
  ConsentData,
  ConsentDecision,
  ConsentOptions,
  ConsentServicesConfig,
  GlobalVendorList,
  LevelPlayAdsPlugin,
  PersistConsentOptions,
} from '../definitions';

import {
  choiceAcceptingEverything,
  grantedServiceIds,
  initialChoice,
  isAdsGranted,
  isDecisionCurrent,
  migratedRefusal,
  networkConsents,
  readStoredDecision,
  toDecision,
} from './decision';
import { I18n } from './i18n';
import { presentConsentModal } from './overlay';
import { buildTcf, DEFAULT_POLICY_VERSION } from './tcf';

const DEFAULT_ACCENT = '#1a73e8';
const DEFAULT_DECISION_LIFETIME_DAYS = 365;

/** Returned when the stored state could not be read: no decision, no ads. */
const UNDECIDED: ConsentData = { status: 'UNKNOWN', granted: false, canRequestAds: false, provider: 'custom' };

/**
 * Native plus the internal `persistConsent` bridge method. Kept out of the
 * public {@link LevelPlayAdsPlugin} surface (and the generated README) since it
 * is only ever called by this orchestrator.
 */
type ConsentBridge = LevelPlayAdsPlugin & {
  persistConsent(options: PersistConsentOptions): Promise<ConsentData>;
};

function parseServices(input: ConsentOptions['services']): ConsentServicesConfig | null {
  if (!input) return null;
  if (typeof input === 'string') {
    try {
      return JSON.parse(input) as ConsentServicesConfig;
    } catch {
      return null;
    }
  }
  return input;
}

/**
 * Resolve the GVL version recorded in the TC string. Reads it from a supplied
 * GVL object, or fetches a *publisher-hosted* URL (never consensu.org — IAB
 * disallows client-side fetch of the canonical list), falling back to the
 * version declared in the services config.
 */
async function resolveGvlVersion(gvl: ConsentOptions['gvl'], config: ConsentServicesConfig): Promise<number> {
  const fallback = config.gvlVendorListVersion ?? 0;
  if (gvl && typeof gvl === 'object') {
    return (gvl as GlobalVendorList).vendorListVersion ?? fallback;
  }
  if (typeof gvl === 'string') {
    try {
      const res = await fetch(gvl);
      const json = (await res.json()) as GlobalVendorList;
      return json.vendorListVersion ?? fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

/**
 * Writes a decision natively and forwards it to LevelPlay: `IABTCF_*` keys
 * (with `gdprApplies` set from the jurisdiction), per-network GDPR consent in
 * `opt_in`, and the CCPA "do not sell" flag in `opt_out`. Called after every
 * modal and on every launch, because LevelPlay keeps privacy flags in memory
 * only.
 */
async function applyDecision(
  bridge: ConsentBridge,
  config: ConsentServicesConfig,
  options: ConsentOptions | undefined,
  decision: ConsentDecision,
): Promise<ConsentData> {
  const gdprApplies = decision.jurisdiction === 'opt_in' ? 1 : 0;
  const granted = isAdsGranted(config, decision);
  const { tcString, keys } = buildTcf(config, decision, {
    cmpId: options?.cmpId ?? 0,
    cmpVersion: options?.cmpVersion ?? 1,
    vendorListVersion: await resolveGvlVersion(options?.gvl, config),
    policyVersion: config.tcfPolicyVersion ?? DEFAULT_POLICY_VERSION,
    language: (options?.locale ?? 'en').slice(0, 2),
    publisherCC: config.publisherCC ?? 'AA',
    now: Date.parse(decision.decidedAt),
    gdprApplies,
  });
  const consentedServiceIds = grantedServiceIds(config, decision);

  if (decision.jurisdiction === 'opt_out') {
    await bridge.setCCPAConsent({ doNotSell: !granted });
  }

  const data = await bridge.persistConsent({
    keys,
    granted,
    networkConsents: gdprApplies ? networkConsents(config, decision) : {},
    consentedServiceIds,
    decisionJson: JSON.stringify(decision),
  });

  return {
    ...data,
    status: granted ? 'GRANTED' : 'DENIED',
    granted,
    canRequestAds: true,
    tcString: data.tcString ?? tcString,
    consentedServiceIds,
    decision,
  };
}

/**
 * Drives the custom consent modal end to end.
 *
 * - `requestConsentInfo` (`force = false`): re-applies a valid stored decision;
 *   otherwise shows the modal in `opt_in`, or stores an automatic "everything
 *   allowed" default in `opt_out` / `none` without any UI. In `opt_out` an
 *   explicit decision is kept regardless of revision or age, a refusal from a
 *   plugin version without decision JSON is migrated, and nothing is written
 *   when the stored state cannot be read.
 * - `showPrivacyOptions` (`force = true`): always shows the modal, opening on
 *   "Manage your data" with the current choices.
 *
 * When no `services` config is supplied, falls back to the native provider
 * (legacy alert / Usercentrics / InMobi) so existing integrations are
 * unaffected.
 */
export async function runConsentFlow(
  plugin: LevelPlayAdsPlugin,
  options: ConsentOptions | undefined,
  force: boolean,
): Promise<ConsentData> {
  const config = parseServices(options?.services);
  if (!config) {
    return force ? plugin.showPrivacyOptions(options) : plugin.requestConsentInfo(options);
  }

  const bridge = plugin as ConsentBridge;
  const jurisdiction = options?.jurisdiction ?? 'opt_in';
  const decisionLifetimeDays = options?.decisionLifetimeDays ?? DEFAULT_DECISION_LIFETIME_DAYS;
  const now = Date.now();
  let existing: ConsentData | undefined;

  try {
    existing = await plugin.getConsentData();
  } catch {
    // US: never overwrite a possible "do not sell" opt-out we could not read.
    if (jurisdiction === 'opt_out') {
      return UNDECIDED;
    }
  }

  const storedAnyAge = readStoredDecision(existing?.decisionJson);
  const stored =
    storedAnyAge && isDecisionCurrent(storedAnyAge, config.revision, decisionLifetimeDays, now) ? storedAnyAge : null;
  // US opt-outs must be honoured indefinitely: an explicit choice survives revision bumps and expiry.
  const keptExplicitly =
    jurisdiction === 'opt_out' && storedAnyAge?.explicit ? storedAnyAge : stored?.explicit ? stored : null;
  const migrated =
    jurisdiction === 'opt_out' && !storedAnyAge && existing?.consentedServiceIds
      ? migratedRefusal(config, existing, { jurisdiction, now })
      : null;
  const storedExplicitly = keptExplicitly ?? migrated;

  if (!force && storedExplicitly) {
    return applyDecision(bridge, config, options, storedExplicitly);
  }

  if (!force && jurisdiction !== 'opt_in') {
    const automaticDefault = toDecision(choiceAcceptingEverything(config), {
      revision: config.revision,
      jurisdiction,
      explicit: false,
      now: stored?.decidedAt ? Date.parse(stored.decidedAt) : now,
    });
    return applyDecision(bridge, config, options, automaticDefault);
  }

  const i18n = await I18n.load(options?.locale ?? 'en', options?.translations);
  const prior = storedExplicitly ?? (jurisdiction !== 'opt_in' ? stored : null);
  const choice = await presentConsentModal(config, i18n, {
    appName: options?.appName ?? 'This app',
    logoUrl: options?.logoUrl,
    accentColor: options?.accentColor ?? DEFAULT_ACCENT,
    decisionLifetimeDays,
    startView: force ? 'manage' : 'first',
    initialChoice: initialChoice(config, jurisdiction, prior),
  });

  const decision = toDecision(choice, { revision: config.revision, jurisdiction, explicit: true, now: Date.now() });
  return applyDecision(bridge, config, options, decision);
}
