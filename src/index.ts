import { registerPlugin } from '@capacitor/core';

import { runConsentFlow } from './consent/flow';
import type {
  BannerOptions,
  BannerPosition,
  BannerStyleOptions,
  ConsentData,
  ConsentOptions,
  LevelPlayAdsPlugin,
} from './definitions';

const native = registerPlugin<LevelPlayAdsPlugin>('LevelPlayAds', {
  web: () => import('./web').then((m) => new m.LevelPlayAdsWeb()),
});

/**
 * Canonicalize loose position aliases — `top-left`, `topLeft`, `top_left`
 * all map to `TOP_LEFT`. Unknown values pass through untouched so the
 * native layer can fall back to its default.
 */
function normalizePosition(value: string | undefined): BannerPosition | undefined {
  if (value == null) return undefined;
  return value.replace(/[-\s]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase() as BannerPosition;
}

/**
 * Canonicalize loose size aliases — `mrec` / `mediumRectangle` / `medium-rectangle`
 * all map to `MEDIUM_RECTANGLE`. Unknown values pass through untouched.
 */
function normalizeSize(value: string | undefined): BannerOptions['adSize'] | undefined {
  if (value == null) return undefined;
  const upper = value.replace(/[-\s]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
  if (upper === 'MREC') return 'MEDIUM_RECTANGLE';
  return upper as BannerOptions['adSize'];
}

const LevelPlayAds: LevelPlayAdsPlugin = new Proxy(native, {
  get(target, prop, receiver) {
    if (prop === 'createBanner') {
      return (options: BannerOptions): Promise<void> =>
        target.createBanner({
          ...options,
          position: normalizePosition(options.position) ?? options.position,
          adSize: normalizeSize(options.adSize) ?? options.adSize,
        });
    }
    if (prop === 'updateBannerStyle') {
      return (options: BannerStyleOptions): Promise<void> =>
        target.updateBannerStyle({
          ...options,
          position: normalizePosition(options.position) ?? options.position,
        });
    }
    // When a `services` config is supplied, render the rich DOM consent modal
    // in the web layer (identical on iOS/Android) and persist via native;
    // otherwise these fall through to the native provider unchanged.
    if (prop === 'requestConsentInfo') {
      return (options?: ConsentOptions): Promise<ConsentData> => runConsentFlow(target, options, false);
    }
    if (prop === 'showPrivacyOptions') {
      return (options?: ConsentOptions): Promise<ConsentData> => runConsentFlow(target, options, true);
    }
    return Reflect.get(target, prop, receiver);
  },
});

export * from './definitions';
export { LevelPlayAds };
