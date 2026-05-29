import type { ConsentServicesConfig } from '../definitions';

import type { ConsentDecision } from './types';

/**
 * Self-contained IAB TCF v2 encoder. Produces the websafe-base64 **core** TC
 * string segment and the matching in-app `IABTCF_*` key map that mediation
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

export interface TcfEncodeOptions {
  cmpId: number;
  cmpVersion: number;
  vendorListVersion: number;
  policyVersion: number;
  /** Two-letter language code for the consent UI, e.g. `'EN'`. */
  language: string;
  /** Two-letter publisher country code, e.g. `'PL'`. */
  publisherCC: string;
  /** Millis since epoch for the created/lastUpdated stamps. */
  now: number;
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
  maxVendorId: number;
  googleAtpIds: number[];
}

/** Collapse the enabled services' TCF declarations into the bitfield sets. */
function deriveSets(config: ConsentServicesConfig, decision: ConsentDecision): DerivedSets {
  const sets: DerivedSets = {
    purposeConsents: new Set(),
    purposeLI: new Set(),
    specialFeatures: new Set(),
    vendorConsents: new Set(),
    vendorLI: new Set(),
    maxVendorId: 0,
    googleAtpIds: [],
  };

  for (const service of config.services) {
    const tcf = service.tcf;
    if (!tcf?.vendorId) continue;
    // maxVendorId spans every declared vendor, granted or not (spec: highest ID).
    sets.maxVendorId = Math.max(sets.maxVendorId, tcf.vendorId);
    if (!decision.services[service.id]) continue;

    sets.vendorConsents.add(tcf.vendorId);
    (tcf.purposeConsents ?? []).forEach((p) => sets.purposeConsents.add(p));
    (tcf.specialFeatures ?? []).forEach((f) => sets.specialFeatures.add(f));
    if (tcf.purposeLegInt?.length) {
      tcf.purposeLegInt.forEach((p) => sets.purposeLI.add(p));
      sets.vendorLI.add(tcf.vendorId);
    }
    if (tcf.googleAtpId) sets.googleAtpIds.push(tcf.googleAtpId);
  }
  return sets;
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
export function buildTcf(
  config: ConsentServicesConfig,
  decision: ConsentDecision,
  opts: TcfEncodeOptions,
): TcfResult {
  const sets = deriveSets(config, decision);
  const created = Math.floor(opts.now / 100); // deciseconds since epoch

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

  const tcString = w.encode();

  const keys: Record<string, string | number> = {
    IABTCF_CmpSdkID: opts.cmpId,
    IABTCF_CmpSdkVersion: opts.cmpVersion,
    IABTCF_PolicyVersion: opts.policyVersion,
    IABTCF_gdprApplies: 1,
    IABTCF_PublisherCC: (opts.publisherCC || 'AA').toUpperCase(),
    IABTCF_PurposeOneTreatment: 0,
    IABTCF_UseNonStandardTexts: 0,
    IABTCF_TCString: tcString,
    IABTCF_VendorConsents: binaryString(sets.vendorConsents, sets.maxVendorId),
    IABTCF_VendorLegitimateInterests: binaryString(sets.vendorLI, sets.maxVendorId),
    IABTCF_PurposeConsents: binaryString(sets.purposeConsents, NUM_PURPOSES),
    IABTCF_PurposeLegitimateInterests: binaryString(sets.purposeLI, NUM_PURPOSES),
    IABTCF_SpecialFeaturesOptIns: binaryString(sets.specialFeatures, NUM_SPECIAL_FEATURES),
    // Google Additional Consent (AC) string, version 2, for AdMob / ATP demand.
    IABTCF_AddtlConsent: sets.googleAtpIds.length ? `2~${sets.googleAtpIds.join('.')}` : '2~',
  };

  return { tcString, keys };
}

export { DEFAULT_POLICY_VERSION };
