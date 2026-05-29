import type { ConsentLocaleBundle } from '../definitions';

import { en } from './locales/en';

const regionCache: Record<string, Record<string, string>> = {};

/**
 * Localized region name via the platform's `Intl.DisplayNames`, cached per
 * locale. Returns `undefined` when the API or code is unavailable so callers
 * can fall back. Covers all ISO-3166 codes without bundling a country list.
 */
function regionName(code: string, locale: string): string | undefined {
  try {
    const cache = (regionCache[locale] ??= {});
    if (code in cache) return cache[code];
    const dn = new Intl.DisplayNames([locale, 'en'], { type: 'region' });
    const name = dn.of(code.toUpperCase());
    const resolved = name && name !== code ? name : undefined;
    cache[code] = resolved as string;
    return resolved;
  } catch {
    return undefined;
  }
}

/** Replace `{name}` tokens in a template with values from `vars`. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match,
  );
}

/**
 * Resolves localized strings for the consent modal. The active locale is layered
 * over the built-in English bundle, which is itself the final fallback — so a
 * missing key in a translation never blanks the UI, and an unknown ID degrades
 * to the ID itself rather than throwing.
 */
export class I18n {
  private readonly active: ConsentLocaleBundle;
  private readonly locale: string;

  constructor(locale = 'en', extra?: Record<string, ConsentLocaleBundle>) {
    const bundles: Record<string, ConsentLocaleBundle> = { en, ...(extra ?? {}) };
    this.active = bundles[locale] ?? bundles.en ?? en;
    this.locale = locale;
  }

  /** UI chrome string with `{var}` interpolation. */
  ui(key: string, vars?: Record<string, string | number>): string {
    const value = this.active.ui?.[key] ?? en.ui?.[key] ?? key;
    return interpolate(value, vars);
  }

  category(id: string): { name: string; description?: string } {
    return this.active.categories?.[id] ?? en.categories?.[id] ?? { name: id };
  }

  purpose(id: string): string {
    return this.active.purposes?.[id] ?? en.purposes?.[id] ?? id;
  }

  technology(id: string): string {
    return this.active.technologies?.[id] ?? en.technologies?.[id] ?? id;
  }

  dataCategory(id: string): string {
    return this.active.dataCategories?.[id] ?? en.dataCategories?.[id] ?? id;
  }

  legalBasis(id: string): string {
    return this.active.legalBases?.[id] ?? en.legalBases?.[id] ?? id;
  }

  retention(id: string): string {
    return this.active.retention?.[id] ?? en.retention?.[id] ?? id;
  }

  /**
   * Country name for an ISO-3166 code. Explicit bundle entries win (so "EU" and
   * any publisher overrides resolve), then the platform's `Intl.DisplayNames`
   * covers every real region code, and the raw code is the final fallback.
   */
  country(code: string): string {
    const override = this.active.countries?.[code] ?? en.countries?.[code];
    if (override) return override;
    return regionName(code, this.locale) ?? code;
  }

  serviceDescription(id: string): string {
    return this.active.serviceDescriptions?.[id] ?? en.serviceDescriptions?.[id] ?? '';
  }
}
