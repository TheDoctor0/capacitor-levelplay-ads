import type { ConsentDecision } from '../definitions';

/**
 * The toggle state the modal hands back — everything a {@link ConsentDecision}
 * holds except its metadata (revision, time, jurisdiction).
 */
export type ConsentChoice = Pick<
  ConsentDecision,
  'purposeConsents' | 'purposeLegInt' | 'vendorConsents' | 'vendorLegInt' | 'specialFeatures'
>;
