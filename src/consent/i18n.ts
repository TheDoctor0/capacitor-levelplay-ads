import type { ConsentLocaleBundle, ConsentPurposeText } from '../definitions';

import { en } from './locales/en';

type LocaleLoader = () => Promise<ConsentLocaleBundle>;

/** Built-in bundles, loaded on demand so an app only pulls the language it shows. */
const LOCALE_LOADERS: Record<string, LocaleLoader> = {
  de: () => import('./locales/de').then((module) => module.de),
  es: () => import('./locales/es').then((module) => module.es),
  fr: () => import('./locales/fr').then((module) => module.fr),
  hr: () => import('./locales/hr').then((module) => module.hr),
  it: () => import('./locales/it').then((module) => module.it),
  nl: () => import('./locales/nl').then((module) => module.nl),
  pl: () => import('./locales/pl').then((module) => module.pl),
  pt: () => import('./locales/pt').then((module) => module.pt),
  ro: () => import('./locales/ro').then((module) => module.ro),
  ru: () => import('./locales/ru').then((module) => module.ru),
  sk: () => import('./locales/sk').then((module) => module.sk),
  tr: () => import('./locales/tr').then((module) => module.tr),
};

const regionCache: Record<string, Record<string, string | undefined>> = {};

/**
 * Localized region name via the platform's `Intl.DisplayNames`, cached per
 * locale. Returns `undefined` when the API or code is unavailable.
 */
function regionName(code: string, locale: string): string | undefined {
  try {
    const cache = (regionCache[locale] ??= {});
    if (code in cache) return cache[code];
    const displayNames = new Intl.DisplayNames([locale, 'en'], { type: 'region' });
    const name = displayNames.of(code.toUpperCase());
    cache[code] = name && name !== code ? name : undefined;
    return cache[code];
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

/** `'pt-BR'` → `'pt'`, `'pl_PL'` → `'pl'`. */
function languageOf(locale: string): string {
  return locale.toLowerCase().split(/[-_]/)[0];
}

function mergeBundles(base: ConsentLocaleBundle, override?: ConsentLocaleBundle): ConsentLocaleBundle {
  if (!override) return base;
  return {
    ui: { ...base.ui, ...override.ui },
    purposes: { ...base.purposes, ...override.purposes },
    specialFeatures: { ...base.specialFeatures, ...override.specialFeatures },
    dataCategories: { ...base.dataCategories, ...override.dataCategories },
    stacks: { ...base.stacks, ...override.stacks },
    stackSummaries: { ...base.stackSummaries, ...override.stackSummaries },
    countries: { ...base.countries, ...override.countries },
  };
}

/**
 * Resolves localized strings for the consent modal. The active locale is layered
 * over the built-in English bundle, so a missing key never blanks the UI.
 */
export class I18n {
  private constructor(
    private readonly active: ConsentLocaleBundle,
    private readonly locale: string,
  ) {}

  /** Loads the built-in bundle for `locale` (if any) and applies `extra` overrides. */
  static async load(locale = 'en', extra?: Record<string, ConsentLocaleBundle>): Promise<I18n> {
    const language = languageOf(locale);
    const loader = LOCALE_LOADERS[language];
    const builtIn = loader ? await loader().catch(() => en) : en;
    const active = mergeBundles(mergeBundles(en, builtIn), extra?.[locale] ?? extra?.[language]);
    return new I18n(active, locale);
  }

  /** UI chrome string with `{var}` interpolation. */
  ui(key: string, vars?: Record<string, string | number>): string {
    return interpolate(this.active.ui?.[key] ?? en.ui?.[key] ?? key, vars);
  }

  /**
   * Plural-aware UI string: picks `key.<category>` for the locale's plural
   * category of `count` (`one`, `few`, `many`, …), falling back to `key.other`.
   */
  plural(key: string, count: number): string {
    const category = new Intl.PluralRules(this.locale).select(count);
    const template =
      this.active.ui?.[`${key}.${category}`] ?? this.active.ui?.[`${key}.other`] ?? en.ui?.[`${key}.other`] ?? key;
    return interpolate(template, { count });
  }

  purpose(id: number): ConsentPurposeText {
    return this.active.purposes?.[id] ?? en.purposes?.[id] ?? { name: String(id), description: '' };
  }

  specialFeature(id: number): ConsentPurposeText {
    return this.active.specialFeatures?.[id] ?? en.specialFeatures?.[id] ?? { name: String(id), description: '' };
  }

  dataCategory(id: number): string {
    return this.active.dataCategories?.[id] ?? en.dataCategories?.[id] ?? String(id);
  }

  stack(id: string): string | undefined {
    return this.active.stacks?.[id] ?? en.stacks?.[id];
  }

  /** First-layer summary for a stack: the plain-language one, else the official stack name. */
  stackSummary(id: string): string | undefined {
    return this.active.stackSummaries?.[id] ?? this.stack(id);
  }

  /** First-layer label for a purpose: its short name, else the official name. */
  purposeShortName(id: number): string {
    const purpose = this.purpose(id);

    return purpose.shortName ?? purpose.name;
  }

  /** Country name: explicit bundle entry, then `Intl.DisplayNames`, then the raw code. */
  country(code: string): string {
    return this.active.countries?.[code] ?? en.countries?.[code] ?? regionName(code, this.locale) ?? code;
  }
}
