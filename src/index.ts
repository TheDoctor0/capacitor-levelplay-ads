import { registerPlugin } from '@capacitor/core';

import type { LevelPlayAdsPlugin } from './definitions';

const LevelPlayAds = registerPlugin<LevelPlayAdsPlugin>('LevelPlayAds', {
  web: () => import('./web').then((m) => new m.LevelPlayAdsWeb()),
});

export * from './definitions';
export { LevelPlayAds };
