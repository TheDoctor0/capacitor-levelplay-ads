import type { PluginListenerHandle } from '@capacitor/core';

/**
 * # Capacitor LevelPlay Ads Plugin
 *
 * Unity LevelPlay (formerly ironSource) mediation SDK for Capacitor.
 *
 * ### CRITICAL: Proper Execution Order
 * To stay compliant with GDPR / CCPA / COPPA, follow this exact order at app start:
 * 1. **Request Consent**: `await LevelPlayAds.requestConsentInfo(...)`
 *    Shows the custom consent modal if the user has not decided yet.
 * 2. **Initialize SDK**: `await LevelPlayAds.initialize(...)`
 *    The SDK boots up using the consent decision gathered in step 1.
 * 3. **Load Ads**: e.g. `await LevelPlayAds.loadInterstitial(...)`
 * 4. **Show Ads**: e.g. `await LevelPlayAds.showInterstitial()`
 *
 * Ad loading is gated: `initialize()` must have run and a consent decision must
 * exist, otherwise load calls reject.
 */
export interface LevelPlayAdsPlugin {
  // ==========================================
  // INITIALIZATION
  // ==========================================

  /**
   * Initializes the LevelPlay mediation SDK.
   * Call after `requestConsentInfo()`.
   */
  initialize(options: InitializeOptions): Promise<InitializeResult>;

  /**
   * Launches the LevelPlay Test Suite for verifying mediation integration.
   * Debug builds only.
   */
  launchTestSuite(): Promise<void>;

  // ==========================================
  // CONSENT & PRIVACY
  // ==========================================

  /**
   * Requests the current consent decision. If none exists, shows the custom
   * consent modal. Must be called before loading ads.
   */
  requestConsentInfo(options?: ConsentOptions): Promise<ConsentData>;

  /**
   * Re-presents the consent modal so the user can change a prior decision.
   * Wire this to a button in your app's settings/privacy screen.
   */
  showPrivacyOptions(options?: ConsentOptions): Promise<ConsentData>;

  /**
   * Returns the persisted consent decision without showing any UI.
   */
  getConsentData(): Promise<ConsentData>;

  /**
   * Clears the stored consent decision so the next `requestConsentInfo()`
   * re-shows the modal. Useful for QA flows and a "reset privacy choice"
   * button in your settings screen.
   */
  resetConsent(): Promise<ConsentData>;

  /**
   * Sets the CCPA "do not sell my personal information" flag.
   */
  setCCPAConsent(options: { doNotSell: boolean }): Promise<void>;

  /**
   * Sets the COPPA child-directed treatment flag.
   */
  setChildDirected(options: { isChildDirected: boolean }): Promise<void>;

  /**
   * iOS only. Prompts the App Tracking Transparency (ATT) dialog.
   * No-op on Android (resolves with status `NOT_APPLICABLE`).
   */
  requestTrackingAuthorization(): Promise<TrackingAuthorizationResult>;

  /**
   * Returns the platform advertising identifier:
   *
   * - **Android** — Google Advertising ID (GAID), via Play Services.
   *   `limited` is the `LimitAdTracking` flag.
   * - **iOS** — IDFA, via `ASIdentifierManager`. The OS returns an all-zero
   *   UUID until the user grants App Tracking Transparency authorization, in
   *   which case `limited` is true and `id` is `"00000000-0000-0000-0000-000000000000"`.
   *
   * Call `requestTrackingAuthorization()` first on iOS to get a real value.
   */
  getAdvertisingId(): Promise<AdvertisingIdResult>;

  /**
   * Sets the dynamic user ID forwarded in server-to-server (S2S) reward
   * callbacks. Call before `showRewarded()` to tag each reward with a
   * verifiable token (e.g. a transaction ID or session nonce).
   *
   * Can be changed between ad shows — the value active at show time is
   * the one included in the S2S callback.
   */
  setDynamicUserId(options: { userId: string }): Promise<void>;

  // ==========================================
  // BANNER ADS
  // ==========================================

  /**
   * Creates and loads a banner ad.
   */
  createBanner(options: BannerOptions): Promise<void>;

  /**
   * Shows a previously created (and hidden) banner.
   */
  showBanner(): Promise<void>;

  /**
   * Temporarily hides the banner without destroying it.
   */
  hideBanner(): Promise<void>;

  /**
   * Destroys the banner and removes it from the view hierarchy.
   */
  destroyBanner(): Promise<void>;

  /**
   * Reposition or restyle the active banner without destroying it.
   * Only the provided fields change; omitted fields keep their current value.
   * `isOverlap` only affects Android — iOS always overlays the WebView.
   */
  updateBannerStyle(options: BannerStyleOptions): Promise<void>;

  // ==========================================
  // INTERSTITIAL ADS
  // ==========================================

  /**
   * Loads an interstitial ad.
   */
  loadInterstitial(options: AdLoadOptions): Promise<void>;

  /**
   * Synchronously checks whether an interstitial ad is loaded and ready.
   */
  isInterstitialReady(): Promise<AdReadyResult>;

  /**
   * Shows the loaded interstitial ad.
   */
  showInterstitial(): Promise<void>;

  // ==========================================
  // REWARDED ADS
  // ==========================================

  /**
   * Loads a rewarded ad.
   */
  loadRewarded(options: AdLoadOptions): Promise<void>;

  /**
   * Synchronously checks whether a rewarded ad is loaded and ready.
   */
  isRewardedReady(): Promise<AdReadyResult>;

  /**
   * Shows the loaded rewarded ad.
   */
  showRewarded(): Promise<void>;

  // ==========================================
  // EVENT LISTENERS
  // ==========================================

  /**
   * Listens for native ad events.
   *
   * ### Interstitial events
   * - `onInterstitialAdLoaded` — `AdInfo`
   * - `onInterstitialAdLoadFailed` — `AdErrorInfo`
   * - `onInterstitialAdDisplayed` — `AdInfo`
   * - `onInterstitialAdDisplayFailed` — `AdErrorInfo`
   * - `onInterstitialAdClicked` — `AdInfo`
   * - `onInterstitialAdClosed` — `AdInfo`
   * - `onInterstitialAdInfoChanged` — `AdInfo`
   *
   * ### Rewarded events
   * - `onRewardedAdLoaded` — `AdInfo`
   * - `onRewardedAdLoadFailed` — `AdErrorInfo`
   * - `onRewardedAdDisplayed` — `AdInfo`
   * - `onRewardedAdDisplayFailed` — `AdErrorInfo`
   * - `onRewardedAdClicked` — `AdInfo`
   * - `onRewardedAdClosed` — `AdInfo`
   * - `onRewardedAdInfoChanged` — `AdInfo`
   * - `onRewardedAdRewarded` — `AdRewardEvent`
   *
   * ### Banner events
   * - `onBannerAdLoaded` — `AdInfo`
   * - `onBannerAdLoadFailed` — `AdErrorInfo`
   * - `onBannerAdDisplayed` — `AdInfo`
   * - `onBannerAdDisplayFailed` — `AdErrorInfo`
   * - `onBannerAdClicked` — `AdInfo`
   * - `onBannerAdExpanded` — `AdInfo`
   * - `onBannerAdCollapsed` — `AdInfo`
   * - `onBannerAdLeftApplication` — `AdInfo`
   *
   * ### Revenue
   * - `onAdRevenue` — `AdRevenueEvent` (impression-level ad revenue / ILRD)
   *
   * ### Consent
   * - `onConsentStatusChanged` — `ConsentData`
   *
   * ### Orientation
   * - `onOrientationChanged` — `OrientationChangedEvent`
   *
   * Prefer the typed `AdEvent` constants (e.g. `AdEvent.InterstitialLoaded`)
   * over raw strings for compile-time safety.
   */
  addListener(eventName: AdEventName | string, listenerFunc: (info: any) => void): Promise<PluginListenerHandle>;
}

/**
 * Typed event-name constants. Prefer `AdEvent.InterstitialLoaded` over the
 * string literal — typos surface at compile time.
 */
export const AdEvent = {
  InterstitialLoaded: 'onInterstitialAdLoaded',
  InterstitialLoadFailed: 'onInterstitialAdLoadFailed',
  InterstitialDisplayed: 'onInterstitialAdDisplayed',
  InterstitialDisplayFailed: 'onInterstitialAdDisplayFailed',
  InterstitialClicked: 'onInterstitialAdClicked',
  InterstitialClosed: 'onInterstitialAdClosed',
  InterstitialInfoChanged: 'onInterstitialAdInfoChanged',

  RewardedLoaded: 'onRewardedAdLoaded',
  RewardedLoadFailed: 'onRewardedAdLoadFailed',
  RewardedDisplayed: 'onRewardedAdDisplayed',
  RewardedDisplayFailed: 'onRewardedAdDisplayFailed',
  RewardedClicked: 'onRewardedAdClicked',
  RewardedClosed: 'onRewardedAdClosed',
  RewardedInfoChanged: 'onRewardedAdInfoChanged',
  RewardedRewarded: 'onRewardedAdRewarded',

  BannerLoaded: 'onBannerAdLoaded',
  BannerLoadFailed: 'onBannerAdLoadFailed',
  BannerDisplayed: 'onBannerAdDisplayed',
  BannerDisplayFailed: 'onBannerAdDisplayFailed',
  BannerClicked: 'onBannerAdClicked',
  BannerExpanded: 'onBannerAdExpanded',
  BannerCollapsed: 'onBannerAdCollapsed',
  BannerLeftApplication: 'onBannerAdLeftApplication',

  AdRevenue: 'onAdRevenue',
  ConsentStatusChanged: 'onConsentStatusChanged',
  OrientationChanged: 'onOrientationChanged',
} as const;

export type AdEventName = (typeof AdEvent)[keyof typeof AdEvent];

/**
 * Emitted on `onOrientationChanged` when the device rotates.
 */
export interface OrientationChangedEvent {
  /** `PORTRAIT` or `LANDSCAPE`. */
  orientation: 'PORTRAIT' | 'LANDSCAPE';
}

// ==========================================
// OPTIONS & RESULTS
// ==========================================

export interface InitializeOptions {
  /**
   * LevelPlay app key from the Unity LevelPlay dashboard. Required.
   */
  appKey: string;

  /**
   * Optional publisher-defined user identifier (used for server-to-server
   * rewarded callbacks and reporting).
   */
  userId?: string;

  /**
   * Enables LevelPlay test/integration mode. Set false before publishing.
   * Default: false
   */
  isTesting?: boolean;
}

export interface InitializeResult {
  /**
   * `INITIALIZED_SUCCESSFULLY` on success.
   */
  status: string;
}

export interface ConsentOptions {
  /**
   * URL opened when the user taps the privacy policy link in the modal.
   * Only used by the `custom` consent provider — ignored under Usercentrics
   * and InMobi (which render their own privacy policy links inside the CMP UI).
   */
  privacyPolicyUrl?: string;

  /**
   * URL opened when the user taps the "Legal Notice" link in the custom modal.
   * `custom` provider only.
   */
  legalNoticeUrl?: string;

  /**
   * Mediation network keys the consent decision should be applied to.
   * When omitted, consent is applied globally.
   */
  networks?: string[];

  // ---------------------------------------------------------------------------
  // Rich custom consent modal (`custom` provider only).
  //
  // When `services` is supplied, `requestConsentInfo` / `showPrivacyOptions`
  // render the polished two-layer DOM modal (summary + Categories/Services
  // tabs) instead of the legacy native alert, and write IAB TCF v2.3-compatible
  // keys. Ignored by the `usercentrics` / `inmobi` providers.
  // ---------------------------------------------------------------------------

  /**
   * Universal, language-neutral definition of the categories and services to
   * display. May be the parsed object or a JSON string. Required to show the
   * rich modal — see {@link ConsentServicesConfig}.
   */
  services?: ConsentServicesConfig | string;

  /**
   * BCP-47 / ISO-639-1 language code for the modal copy. Default `'en'`.
   * Falls back to English for any missing key.
   */
  locale?: string;

  /**
   * Extra or overriding translation bundles, keyed by locale code. Merged over
   * the built-in English bundle. Supply this to localize or to override the
   * default copy / per-service descriptions.
   */
  translations?: Record<string, ConsentLocaleBundle>;

  /**
   * App name shown in the modal title and copy. Default: `'This app'`.
   */
  appName?: string;

  /**
   * URL of the logo shown at the top of the first layer. When omitted, the
   * first letter of `appName` is shown in an accent-colored circle.
   */
  logoUrl?: string;

  /**
   * Accent color (any CSS color) for buttons, switches and active tabs.
   * Default: `'#143cc4'`.
   */
  accentColor?: string;

  /**
   * IAB CMP ID written into the TC string and `IABTCF_CmpSdkID`. Default `0`
   * (non-certified). Set your registered ID once you become an IAB-listed CMP.
   */
  cmpId?: number;

  /**
   * CMP version written into the TC string and `IABTCF_CmpSdkVersion`.
   * Default `1`.
   */
  cmpVersion?: number;

  /**
   * Optional IAB Global Vendor List, as a parsed object or a URL to fetch.
   * Per IAB policy the GVL must not be fetched from `consensu.org` on the
   * client; supply your own server-hosted copy here, or omit to use the
   * version the plugin bundles. Only its `vendorListVersion` affects the
   * encoded TC string today.
   */
  gvl?: GlobalVendorList | string;
}

/**
 * Universal, language-neutral consent configuration passed via
 * {@link ConsentOptions.services}. Every human-readable string is a lookup ID
 * resolved through the active {@link ConsentLocaleBundle} — only proper nouns
 * (company names, addresses), URLs and TCF numbers live here.
 */
export interface ConsentServicesConfig {
  /** GVL version recorded in the encoded TC string. */
  gvlVendorListVersion?: number;
  /** TCF policy version. `5` = TCF v2.3 (the default). */
  tcfPolicyVersion?: number;
  /** Publisher country (ISO-3166-1 alpha-2), e.g. `'PL'`. */
  publisherCC?: string;
  /** Display + toggle metadata for each category. */
  categories: ConsentCategory[];
  /** The services/vendors shown under the categories. */
  services: ConsentService[];
}

export interface ConsentCategory {
  /** Stable key; also the lookup ID for the localized name/description. */
  id: string;
  /** Locked categories are always on and cannot be toggled (e.g. essential). */
  locked?: boolean;
  /** Initial toggle state when unlocked. Default `false`. */
  default?: boolean;
  /** Sort order (ascending). */
  order?: number;
  /** Optional emoji/icon shown on the first-layer summary row. */
  icon?: string;
}

export interface ConsentService {
  /** Stable key; also the lookup ID for an optional localized description. */
  id: string;
  /** Which {@link ConsentCategory.id} this service belongs to. */
  categoryId: string;
  /**
   * LevelPlay mediation network key this service maps to, e.g. `'unityads'`,
   * `'meta'`, `'pangle'`, `'admob'`. When set, the user's toggle for this
   * service is forwarded to LevelPlay as a per-network GDPR consent so the
   * mediated SDK receives the right value. Omit for non-mediation services
   * (sign-in, analytics, CMP, etc.).
   */
  network?: string;
  /** Initial toggle state. Ignored when the category is locked. Default `false`. */
  default?: boolean;
  /** Processing company — proper nouns, language-neutral. */
  company: { name: string; address?: string };
  /**
   * Service description shown in the detail card. A localized
   * `serviceDescriptions[id]` override in a translation bundle takes precedence
   * when present.
   */
  description?: string;
  /** Localized purpose label IDs. */
  purposeIds?: string[];
  /** Localized technology label IDs. */
  technologyIds?: string[];
  /** Localized data-category label IDs. */
  dataCollectedIds?: string[];
  /** Localized legal-basis label IDs. */
  legalBasisIds?: string[];
  /** Processing location ISO-3166 country codes. */
  locationCC?: string[];
  /** Third-country transfer ISO-3166 country codes. */
  transferCC?: string[];
  /** Localized retention-phrasing ID. */
  retentionId?: string;
  /** Data recipient names — proper nouns. */
  recipients?: string[];
  /** Policy URLs. */
  urls?: { privacy?: string; cookie?: string; optOut?: string };
  /** TCF mapping. Omit for vendors not on the IAB Global Vendor List. */
  tcf?: ConsentServiceTcf;
}

export interface ConsentServiceTcf {
  /** IAB GVL vendor ID. */
  vendorId?: number;
  /** Purpose IDs (1–24) this vendor seeks consent for. */
  purposeConsents?: number[];
  /** Purpose IDs (1–24) processed under legitimate interest. */
  purposeLegInt?: number[];
  /** Special-feature IDs (1–12), e.g. `1` = precise geolocation. */
  specialFeatures?: number[];
  /** Google Additional Consent (AC) provider ID, for AdMob/ATP demand. */
  googleAtpId?: number;
}

/**
 * Localized copy for the custom modal. Every section is optional and merged
 * over the built-in English bundle; supply only what you want to translate or
 * override. Keys match the IDs used in {@link ConsentServicesConfig}.
 */
export interface ConsentLocaleBundle {
  /** UI chrome strings (titles, buttons, section headers). Supports `{var}`. */
  ui?: Record<string, string>;
  /** Per-category name + description, keyed by category ID. */
  categories?: Record<string, { name: string; description?: string }>;
  /** Purpose labels, keyed by purpose ID. */
  purposes?: Record<string, string>;
  /** Technology labels, keyed by technology ID. */
  technologies?: Record<string, string>;
  /** Data-category labels, keyed by data-category ID. */
  dataCategories?: Record<string, string>;
  /** Legal-basis labels, keyed by legal-basis ID. */
  legalBases?: Record<string, string>;
  /** Retention-phrasing strings, keyed by retention ID. */
  retention?: Record<string, string>;
  /** Country names, keyed by ISO-3166 code. */
  countries?: Record<string, string>;
  /**
   * Optional localized overrides for per-service descriptions, keyed by service
   * ID. The base text lives in {@link ConsentService.description}; supply this
   * only to translate it.
   */
  serviceDescriptions?: Record<string, string>;
}

/**
 * Minimal IAB Global Vendor List shape. Only `vendorListVersion` is read today.
 */
export interface GlobalVendorList {
  vendorListVersion?: number;
  [key: string]: unknown;
}

/**
 * @internal Bridge payload — the decision the JS modal computed, handed to the
 * native layer to persist as `IABTCF_*` keys and forward to LevelPlay. Not part
 * of the public flow; call `requestConsentInfo` / `showPrivacyOptions` instead.
 */
export interface PersistConsentOptions {
  /** The `IABTCF_*` key → value map to write to the platform key store. */
  keys: Record<string, string | number>;
  /** Global GDPR consent flag forwarded to LevelPlay. */
  granted: boolean;
  /**
   * Per-network GDPR consent, keyed by LevelPlay network key — derived from each
   * service's {@link ConsentService.network} and its toggle state. Forwarded to
   * `LevelPlayPrivacySettings.setGDPRConsents`.
   */
  networkConsents?: Record<string, boolean>;
  /** IDs of the services the user left enabled. */
  consentedServiceIds?: string[];
}

/**
 * Which consent UI the plugin shows. Configured at install time via
 * `levelplay.consentProvider` in the host app's package.json — not via JS.
 *
 * - `usercentrics` (default): IAB TCF v2.3 compliant. Google-certified Gold
 *   tier CMP partner. Requires `levelplay.usercentrics.settingsId` from
 *   https://usercentrics.com/.
 * - `inmobi`: IAB TCF v2.2 compliant. Bundles InMobi Choice CMP.
 *   Requires `levelplay.inmobi.pCode` from https://choice.inmobi.com/.
 * - `custom`: built-in alert dialog. Not TCF compliant; do not ship to EU.
 */
export type ConsentProvider = 'usercentrics' | 'inmobi' | 'custom';

export interface ConsentData {
  /**
   * The recorded consent decision.
   * - `UNKNOWN` — no decision yet (fresh install).
   * - `GRANTED` — user granted consent.
   * - `DENIED` — user denied consent.
   */
  status: 'UNKNOWN' | 'GRANTED' | 'DENIED';

  /**
   * Simplified boolean: true when `status === 'GRANTED'`.
   */
  granted: boolean;

  /**
   * True when ads may be requested (a decision exists, granted or denied).
   */
  canRequestAds: boolean;

  /**
   * Which provider produced this decision: `usercentrics`, `inmobi`, or
   * `custom`. Useful for deciding whether to trust the `tcString` field.
   */
  provider?: ConsentProvider;

  /**
   * IAB TCF consent string. Populated by the `usercentrics` / `inmobi`
   * providers, and by the `custom` provider when the rich modal is used
   * (TCF v2.3-compatible — see {@link ConsentOptions.services}). Undefined for
   * the legacy `custom` alert, which produces no TCF payload.
   */
  tcString?: string;

  /**
   * IDs of the services the user left enabled. Populated only by the rich
   * `custom` modal.
   */
  consentedServiceIds?: string[];
}

export interface AdvertisingIdResult {
  /**
   * The advertising identifier. Empty string when unavailable; on iOS the
   * all-zeros UUID `"00000000-0000-0000-0000-000000000000"` when ATT is not
   * authorized.
   */
  id: string;

  /**
   * True when the user has limited / opted out of ad tracking.
   * Android: `LimitAdTracking` flag. iOS: true when ATT is not authorized.
   */
  limited: boolean;
}

export interface TrackingAuthorizationResult {
  /**
   * iOS ATT status: `AUTHORIZED`, `DENIED`, `RESTRICTED`, `NOT_DETERMINED`,
   * or `NOT_APPLICABLE` (Android).
   */
  status: string;
}

export interface BannerOptions {
  /**
   * LevelPlay banner ad unit ID. Required.
   */
  adUnitId: string;

  /**
   * Banner size. Default: `ADAPTIVE`.
   */
  adSize?: 'BANNER' | 'LARGE' | 'MEDIUM_RECTANGLE' | 'LEADERBOARD' | 'ADAPTIVE';

  /**
   * Banner position on screen. Default: `BOTTOM`.
   */
  position?: BannerPosition;

  /**
   * Show the banner automatically once loaded. Default: true.
   */
  isAutoShow?: boolean;

  /**
   * If true the banner overlaps the webview; if false it pushes the webview.
   * Android only — iOS always overlays the WebView. Default: true.
   */
  isOverlap?: boolean;

  /**
   * Minimum delay between consecutive load() calls, in **milliseconds**.
   * Throttles invalid traffic. Default: 5000 (5 seconds).
   */
  retryInterval?: number;
}

/**
 * Banner placement on screen. `TOP_LEFT` / `TOP_RIGHT` / `BOTTOM_LEFT` /
 * `BOTTOM_RIGHT` anchor the banner to the corresponding screen corner;
 * `CENTER` places it in the middle.
 */
export type BannerPosition =
  | 'TOP'
  | 'BOTTOM'
  | 'TOP_LEFT'
  | 'TOP_RIGHT'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_RIGHT'
  | 'CENTER';

export interface BannerStyleOptions {
  /** New banner position. */
  position?: BannerPosition;
  /** Android-only overlap flag. iOS ignores this. */
  isOverlap?: boolean;
}

export interface AdLoadOptions {
  /**
   * LevelPlay ad unit ID. Required.
   */
  adUnitId: string;

  /**
   * If true, the ad is shown immediately after a successful load. The returned
   * promise then resolves on display (or rejects with "Auto-show failed: …").
   * Default: false.
   */
  autoShow?: boolean;

  /**
   * Minimum delay between consecutive load() calls, in **milliseconds**.
   * Throttles invalid traffic. Default: 5000 (5 seconds).
   */
  retryInterval?: number;
}

export interface AdReadyResult {
  /**
   * True when the ad is loaded and can be shown.
   */
  isReady: boolean;
}

/**
 * Ad metadata reported by LevelPlay for an ad instance.
 */
export interface AdInfo {
  adUnitId?: string;
  adId?: string;
  /** Mediation network that served the ad. */
  adNetwork?: string;
  /** LevelPlay ad format (`INTERSTITIAL`, `REWARDED`, `BANNER`). */
  adFormat?: string;
  /** Placement name configured in the LevelPlay dashboard. */
  placement?: string;
  /** Ad revenue for this instance, in the account currency. */
  revenue?: number;
  /** Currency code of `revenue`, e.g. `USD`. */
  currency?: string;
  /** Reported precision of the revenue value. */
  precision?: string;
  /** Country code of the served impression. */
  countryCode?: string;
}

/**
 * Error details for a failed load or display.
 */
export interface AdErrorInfo {
  errorCode: number;
  errorMessage: string;
  adUnitId?: string;
  adId?: string;
}

/**
 * Emitted on `onRewardedAdRewarded` when the user earns a reward.
 */
export interface AdRewardEvent extends AdInfo {
  /** Reward item name configured in the dashboard. */
  rewardName: string;
  /** Reward amount granted. */
  rewardAmount: number;
}

/**
 * Impression-level ad revenue (ILRD), emitted on `onAdRevenue`.
 */
export interface AdRevenueEvent {
  /** Revenue value in the account currency. */
  revenue: number;
  /** Mediation network that served the impression. */
  adNetwork: string;
  /** Ad unit / instance name. */
  adUnit?: string;
  /** Ad format (`INTERSTITIAL`, `REWARDED`, `BANNER`). */
  adFormat?: string;
  /** Placement name. */
  placement?: string;
  /** Reported precision of the revenue value. */
  precision?: string;
  /** Country code of the impression. */
  country?: string;
  /** Ad network instance name. */
  instanceName?: string;
}
