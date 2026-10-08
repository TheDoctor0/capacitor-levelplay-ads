import type { ConsentService, ConsentServicesConfig } from '../definitions';

import { isServiceGranted } from './decision';
import type { ConsentChoice } from './types';

/**
 * Self-contained IAB TCF v2 encoder. Produces the websafe-base64 TC string
 * (core segment + the Disclosed Vendors segment TCF v2.3 makes mandatory) and the matching in-app `IABTCF_*` key map that mediation
 * adapters read from the platform key store.
 *
 * This is "TCF-compatible" output: the bit layout follows the spec so adapters
 * decode it correctly, but the plugin is not an IAB-registered CMP — `cmpId`
 * defaults to 0 (non-certified). No external dependency: a hand-rolled
 * `BitWriter` avoids pulling `@iabtcf/core` (and three Rollup plugins) into the
 * distributed bundle.
 */

const BASE64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/** TCF policy version 5 corresponds to TCF v2.3. */
const DEFAULT_POLICY_VERSION = 5;
const TC_VERSION = 2;
const NUM_PURPOSES = 24;
const NUM_SPECIAL_FEATURES = 12;
const DISCLOSED_VENDORS_SEGMENT_TYPE = 1;
const DECISECONDS_PER_MILLISECOND = 1 / 100;

export interface TcfEncodeOptions {
  cmpId: number;
  cmpVersion: number;
  vendorListVersion: number;
  policyVersion: number;
  /** Two-letter language code for the consent UI, e.g. `'EN'`. */
  language: string;
  /** Two-letter publisher country code, e.g. `'PL'`. */
  publisherCC: string;
  /** Millis since epoch; the created/lastUpdated stamps use its UTC day (spec: day-level timestamp). */
  now: number;
  /** `1` when GDPR applies (the `opt_in` jurisdiction), `0` otherwise. */
  gdprApplies: 0 | 1;
}

export interface TcfResult {
  tcString: string;
  /** `IABTCF_*` key → value map to persist natively. */
  keys: Record<string, string | number>;
}

/** Appends fixed-width unsigned integers, bitfields and 6-bit chars. */
class BitWriter {
  private bits = '';

  /** Big-endian, `length` bits. Safe for values up to 2^53 (e.g. 36-bit time). */
  int(value: number, length: number): void {
    let v = Math.floor(value);
    let out = '';
    for (let i = 0; i < length; i++) {
      out = (v % 2) + out;
      v = Math.floor(v / 2);
    }
    this.bits += out;
  }

  bool(value: boolean): void {
    this.bits += value ? '1' : '0';
  }

  /** A `length`-bit field where bit (i-1) is set when `set` contains `i`. */
  bitfield(set: Set<number>, length: number): void {
    for (let i = 1; i <= length; i++) this.bits += set.has(i) ? '1' : '0';
  }

  /** Two 6-bit chars (A=0..Z=25) from a 2-letter code. */
  code(value: string): void {
    const upper = (value || 'AA').toUpperCase().padEnd(2, 'A');
    this.int(upper.charCodeAt(0) - 65, 6);
    this.int(upper.charCodeAt(1) - 65, 6);
  }

  /** Right-pad to a multiple of 6 and map each group to websafe base64. */
  encode(): string {
    const padded = this.bits.padEnd(Math.ceil(this.bits.length / 6) * 6, '0');
    let out = '';
    for (let i = 0; i < padded.length; i += 6) {
      out += BASE64URL[parseInt(padded.slice(i, i + 6), 2)];
    }
    return out;
  }
}

interface DerivedSets {
  purposeConsents: Set<number>;
  purposeLI: Set<number>;
  specialFeatures: Set<number>;
  vendorConsents: Set<number>;
  vendorLI: Set<number>;
  /** Every GVL vendor shown to the user, granted or not (Disclosed Vendors segment). */
  disclosedVendors: Set<number>;
  maxVendorId: number;
  /** Google ATP IDs the user consented to. */
  googleAtpIds: number[];
  /** Google ATP IDs shown to the user but not consented to. */
  disclosedGoogleAtpIds: number[];
}

/**
 * Turn the user's choice into the TCF bitfields. Purpose, legitimate-interest
 * and special-feature bits mirror the toggles; vendor bits mirror each GVL
 * vendor's own toggles.
 */
function deriveSets(config: ConsentServicesConfig, choice: ConsentChoice): DerivedSets {
  const tcfServices = config.services.filter((service) => service.tcf?.vendorId);
  const atpServices = config.services.filter((service) => service.tcf?.googleAtpId);
  const atpIdOf = (service: ConsentService): number => service.tcf?.googleAtpId as number;
  const vendorIdsOf = (serviceIds: string[]): Set<number> =>
    new Set(
      tcfServices
        .filter((service) => serviceIds.includes(service.id))
        .map((service) => service.tcf?.vendorId as number),
    );

  return {
    purposeConsents: new Set(choice.purposeConsents),
    purposeLI: new Set(choice.purposeLegInt),
    specialFeatures: new Set(choice.specialFeatures),
    vendorConsents: vendorIdsOf(choice.vendorConsents),
    vendorLI: vendorIdsOf(choice.vendorLegInt),
    disclosedVendors: new Set(tcfServices.map((service) => service.tcf?.vendorId as number)),
    // Spec: highest vendor ID declared, granted or not.
    maxVendorId: Math.max(0, ...tcfServices.map((service) => service.tcf?.vendorId as number)),
    googleAtpIds: atpServices.filter((service) => isServiceGranted(choice, service)).map(atpIdOf),
    disclosedGoogleAtpIds: atpServices.filter((service) => !isServiceGranted(choice, service)).map(atpIdOf),
  };
}

/** Midnight UTC of the day containing `millis`, in deciseconds (TCF day-level Created/LastUpdated). */
function startOfUtcDayInDeciseconds(millis: number): number {
  const day = new Date(millis);

  return Math.round(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()) * DECISECONDS_PER_MILLISECOND);
}

/** Disclosed Vendors segment: SegmentType 1, then a bitfield of every vendor shown to the user. */
function encodeDisclosedVendors(sets: DerivedSets): string {
  const w = new BitWriter();
  w.int(DISCLOSED_VENDORS_SEGMENT_TYPE, 3);
  w.int(sets.maxVendorId, 16);
  w.bool(false); // isRangeEncoding
  w.bitfield(sets.disclosedVendors, sets.maxVendorId);

  return w.encode();
}

/** A `length`-char `'0'`/`'1'` string for the in-app key format. */
function binaryString(set: Set<number>, length: number): string {
  let out = '';
  for (let i = 1; i <= length; i++) out += set.has(i) ? '1' : '0';
  return out;
}

/**
 * Encode the decision into a TC string + the `IABTCF_*` key map.
 */
export function buildTcf(config: ConsentServicesConfig, choice: ConsentChoice, opts: TcfEncodeOptions): TcfResult {
  const sets = deriveSets(config, choice);
  const created = startOfUtcDayInDeciseconds(opts.now);

  const w = new BitWriter();
  w.int(TC_VERSION, 6);
  w.int(created, 36);
  w.int(created, 36);
  w.int(opts.cmpId, 12);
  w.int(opts.cmpVersion, 12);
  w.int(0, 6); // consent screen
  w.code(opts.language);
  w.int(opts.vendorListVersion, 12);
  w.int(opts.policyVersion, 6);
  w.bool(true); // isServiceSpecific
  w.bool(false); // useNonStandardTexts
  w.bitfield(sets.specialFeatures, NUM_SPECIAL_FEATURES);
  w.bitfield(sets.purposeConsents, NUM_PURPOSES);
  w.bitfield(sets.purposeLI, NUM_PURPOSES);
  w.bool(false); // purposeOneTreatment
  w.code(opts.publisherCC);

  // Vendor consents — bitfield encoding (isRangeEncoding = 0).
  w.int(sets.maxVendorId, 16);
  w.bool(false);
  w.bitfield(sets.vendorConsents, sets.maxVendorId);

  // Vendor legitimate interests — bitfield encoding.
  w.int(sets.maxVendorId, 16);
  w.bool(false);
  w.bitfield(sets.vendorLI, sets.maxVendorId);

  w.int(0, 12); // numPubRestrictions

  const tcString = `${w.encode()}.${encodeDisclosedVendors(sets)}`;

  const keys: Record<string, string | number> = {
    IABTCF_CmpSdkID: opts.cmpId,
    IABTCF_CmpSdkVersion: opts.cmpVersion,
    IABTCF_PolicyVersion: opts.policyVersion,
    IABTCF_gdprApplies: opts.gdprApplies,
    IABTCF_PublisherCC: (opts.publisherCC || 'AA').toUpperCase(),
    IABTCF_PurposeOneTreatment: 0,
    IABTCF_UseNonStandardTexts: 0,
    IABTCF_TCString: tcString,
    IABTCF_VendorConsents: binaryString(sets.vendorConsents, sets.maxVendorId),
    IABTCF_VendorLegitimateInterests: binaryString(sets.vendorLI, sets.maxVendorId),
    IABTCF_PurposeConsents: binaryString(sets.purposeConsents, NUM_PURPOSES),
    IABTCF_PurposeLegitimateInterests: binaryString(sets.purposeLI, NUM_PURPOSES),
    IABTCF_SpecialFeaturesOptIns: binaryString(sets.specialFeatures, NUM_SPECIAL_FEATURES),
    // Google Additional Consent (AC) string, version 2: consented ATPs, then
    // `dv.` with the ATPs that were disclosed but not consented.
    IABTCF_AddtlConsent: `2~${sets.googleAtpIds.join('.')}~dv.${sets.disclosedGoogleAtpIds.join('.')}`,
  };

  return { tcString, keys };
}

export { DEFAULT_POLICY_VERSION };
