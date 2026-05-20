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
   */
  addListener(eventName: string, listenerFunc: (info: any) => void): Promise<PluginListenerHandle>;
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
   */
  privacyPolicyUrl?: string;

  /**
   * Custom modal title.
   */
  title?: string;

  /**
   * Custom modal body text.
   */
  message?: string;

  /**
   * Label for the accept/grant button.
   */
  acceptButtonText?: string;

  /**
   * Label for the decline/deny button.
   */
  declineButtonText?: string;

  /**
   * Mediation network keys the consent decision should be applied to.
   * When omitted, consent is applied globally.
   */
  networks?: string[];
}

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
  position?: 'TOP' | 'BOTTOM';

  /**
   * Show the banner automatically once loaded. Default: true.
   */
  isAutoShow?: boolean;

  /**
   * If true the banner overlaps the webview; if false it pushes the webview.
   * Default: true.
   */
  isOverlap?: boolean;
}

export interface AdLoadOptions {
  /**
   * LevelPlay ad unit ID. Required.
   */
  adUnitId: string;
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
