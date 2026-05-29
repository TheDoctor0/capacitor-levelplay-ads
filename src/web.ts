import { WebPlugin } from '@capacitor/core';

import type {
  LevelPlayAdsPlugin,
  InitializeOptions,
  InitializeResult,
  ConsentOptions,
  ConsentData,
  PersistConsentOptions,
  TrackingAuthorizationResult,
  AdvertisingIdResult,
  BannerOptions,
  BannerStyleOptions,
  AdLoadOptions,
  AdReadyResult,
} from './definitions';

const WEB_CONSENT_KEY = 'levelplay_consent_web';

/**
 * Web fallback. LevelPlay has no web SDK, so ad methods are no-ops and consent
 * resolves as granted so web builds do not block on the consent gate.
 */
export class LevelPlayAdsWeb extends WebPlugin implements LevelPlayAdsPlugin {
  private readonly grantedConsent: ConsentData = {
    status: 'GRANTED',
    granted: true,
    canRequestAds: true,
    provider: 'custom',
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================
  async initialize(_options: InitializeOptions): Promise<InitializeResult> {
    return { status: 'INITIALIZATION_BYPASSED_ON_WEB' };
  }

  async launchTestSuite(): Promise<void> {
    // No-op for web
  }

  async setDynamicUserId(_options: { userId: string }): Promise<void> {
    // No-op for web
  }

  // ==========================================
  // CONSENT & PRIVACY
  // ==========================================
  async requestConsentInfo(_options?: ConsentOptions): Promise<ConsentData> {
    return this.grantedConsent;
  }

  async showPrivacyOptions(_options?: ConsentOptions): Promise<ConsentData> {
    return this.grantedConsent;
  }

  async getConsentData(): Promise<ConsentData> {
    return this.storedConsent() ?? this.grantedConsent;
  }

  async resetConsent(): Promise<ConsentData> {
    try {
      localStorage.removeItem(WEB_CONSENT_KEY);
    } catch {
      // localStorage unavailable (e.g. private mode) — nothing to clear.
    }
    return this.grantedConsent;
  }

  /**
   * Persists a decision computed by the rich consent modal. On web there is no
   * IAB key store or LevelPlay SDK, so the `IABTCF_*` keys and granted flag are
   * stashed in localStorage purely so the overlay can be exercised in a browser.
   */
  async persistConsent(options: PersistConsentOptions): Promise<ConsentData> {
    const data: ConsentData = {
      status: options.granted ? 'GRANTED' : 'DENIED',
      granted: options.granted,
      canRequestAds: true,
      provider: 'custom',
      tcString: typeof options.keys.IABTCF_TCString === 'string' ? options.keys.IABTCF_TCString : undefined,
      consentedServiceIds: options.consentedServiceIds,
    };
    try {
      localStorage.setItem(WEB_CONSENT_KEY, JSON.stringify(data));
    } catch {
      // Ignore — persistence is best-effort on web.
    }
    return data;
  }

  private storedConsent(): ConsentData | null {
    try {
      const raw = localStorage.getItem(WEB_CONSENT_KEY);
      return raw ? (JSON.parse(raw) as ConsentData) : null;
    } catch {
      return null;
    }
  }

  async setCCPAConsent(_options: { doNotSell: boolean }): Promise<void> {
    // No-op for web
  }

  async setChildDirected(_options: { isChildDirected: boolean }): Promise<void> {
    // No-op for web
  }

  async requestTrackingAuthorization(): Promise<TrackingAuthorizationResult> {
    return { status: 'NOT_APPLICABLE' };
  }

  async getAdvertisingId(): Promise<AdvertisingIdResult> {
    return { id: '', limited: true };
  }

  // ==========================================
  // BANNER
  // ==========================================
  async createBanner(_options: BannerOptions): Promise<void> {
    // No-op for web
  }
  async showBanner(): Promise<void> {
    // No-op for web
  }
  async hideBanner(): Promise<void> {
    // No-op for web
  }
  async destroyBanner(): Promise<void> {
    // No-op for web
  }
  async updateBannerStyle(_options: BannerStyleOptions): Promise<void> {
    // No-op for web
  }

  // ==========================================
  // INTERSTITIAL
  // ==========================================
  async loadInterstitial(_options: AdLoadOptions): Promise<void> {
    // No-op for web
  }
  async isInterstitialReady(): Promise<AdReadyResult> {
    return { isReady: false };
  }
  async showInterstitial(): Promise<void> {
    // No-op for web
  }

  // ==========================================
  // REWARDED
  // ==========================================
  async loadRewarded(_options: AdLoadOptions): Promise<void> {
    // No-op for web
  }
  async isRewardedReady(): Promise<AdReadyResult> {
    return { isReady: false };
  }
  async showRewarded(): Promise<void> {
    // No-op for web
  }
}
