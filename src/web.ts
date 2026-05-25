import { WebPlugin } from '@capacitor/core';

import type {
  LevelPlayAdsPlugin,
  InitializeOptions,
  InitializeResult,
  ConsentOptions,
  ConsentData,
  TrackingAuthorizationResult,
  AdvertisingIdResult,
  BannerOptions,
  BannerStyleOptions,
  AdLoadOptions,
  AdReadyResult,
} from './definitions';

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
    return this.grantedConsent;
  }

  async resetConsent(): Promise<ConsentData> {
    return this.grantedConsent;
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
