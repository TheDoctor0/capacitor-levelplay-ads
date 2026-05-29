import type {
  ConsentData,
  ConsentOptions,
  ConsentServicesConfig,
  GlobalVendorList,
  LevelPlayAdsPlugin,
  PersistConsentOptions,
} from '../definitions';

import { I18n } from './i18n';
import { presentConsentModal } from './overlay';
import { buildTcf, DEFAULT_POLICY_VERSION } from './tcf';

const DEFAULT_ACCENT = '#143cc4';

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
async function resolveGvlVersion(
  gvl: ConsentOptions['gvl'],
  config: ConsentServicesConfig,
): Promise<number> {
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
 * Drives the rich custom consent modal end to end: render the DOM overlay,
 * encode the decision into TCF v2.3-compatible keys, hand them to the native
 * layer to persist + forward to LevelPlay, and return the resulting
 * {@link ConsentData}.
 *
 * When no `services` config is supplied, falls back to the native provider
 * (legacy alert / Usercentrics / InMobi) so existing integrations are
 * unaffected.
 *
 * @param force `true` for `showPrivacyOptions` — always shows the modal,
 *   opening on the Manage screen. `false` for `requestConsentInfo` — reuses a
 *   stored decision when one exists.
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

  const existing = await plugin.getConsentData().catch(() => undefined);
  if (!force && existing?.canRequestAds) return existing;

  const i18n = new I18n(options?.locale ?? 'en', options?.translations);
  const decision = await presentConsentModal(config, i18n, {
    appName: options?.appName ?? 'This app',
    logoUrl: options?.logoUrl,
    accentColor: options?.accentColor ?? DEFAULT_ACCENT,
    privacyPolicyUrl: options?.privacyPolicyUrl,
    legalNoticeUrl: options?.legalNoticeUrl,
    startInManage: force,
    // Seed from the saved decision so re-opening reflects prior choices.
    priorConsentedIds: existing?.canRequestAds ? existing.consentedServiceIds : undefined,
  });

  const vendorListVersion = await resolveGvlVersion(options?.gvl, config);
  const { tcString, keys } = buildTcf(config, decision, {
    cmpId: options?.cmpId ?? 0,
    cmpVersion: options?.cmpVersion ?? 1,
    vendorListVersion,
    policyVersion: config.tcfPolicyVersion ?? DEFAULT_POLICY_VERSION,
    language: (options?.locale ?? 'en').slice(0, 2),
    publisherCC: config.publisherCC ?? 'AA',
    now: Date.now(),
  });

  const consentedServiceIds = Object.keys(decision.services).filter((id) => decision.services[id]);

  // Map each service's toggle to its LevelPlay network key so the mediated SDK
  // gets the matching per-network GDPR consent.
  const networkConsents: Record<string, boolean> = {};
  for (const svc of config.services) {
    if (svc.network) networkConsents[svc.network] = decision.services[svc.id] === true;
  }

  const data = await (plugin as ConsentBridge).persistConsent({
    keys,
    granted: decision.granted,
    networkConsents,
    consentedServiceIds,
  });

  return { ...data, tcString: data.tcString ?? tcString, consentedServiceIds };
}
