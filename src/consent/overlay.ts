import type { ConsentService, ConsentServiceCategory, ConsentServicesConfig } from '../definitions';

import {
  choiceAcceptingEverything,
  declaredConsentPurposes,
  declaredLegIntPurposes,
  declaredSpecialFeatures,
  optionalServices,
} from './decision';
import type { I18n } from './i18n';
import { STACK_PURPOSES } from './stacks';
import { styles } from './styles';
import type { ConsentChoice } from './types';

const VENDOR_CATEGORIES: ConsentServiceCategory[] = ['marketing', 'functional', 'essential'];

/** IAB purpose 1 — always shown as its own first-layer row. */
const STORE_ACCESS_DEVICE_PURPOSE = 1;
/** IAB special feature 1 — triggers the geolocation sentence on the first layer. */
const PRECISE_GEOLOCATION_FEATURE = 1;

export interface ModalOptions {
  appName: string;
  logoUrl?: string;
  accentColor: string;
  decisionLifetimeDays: number;
  /** `'first'` for the initial prompt, `'manage'` when re-opened from settings. */
  startView: 'first' | 'manage';
  initialChoice: ConsentChoice;
}

type View =
  | { kind: 'first' }
  | { kind: 'manage' }
  | { kind: 'vendors' }
  | { kind: 'purpose'; id: number }
  | { kind: 'specialFeature'; id: number }
  | { kind: 'vendor'; id: string };

type ChoiceList = keyof ConsentChoice;

/** Tiny hyperscript helper. `on*` props bind listeners; everything else is an attribute. */
function h(tag: string, attrs: Record<string, unknown> = {}, children: (Node | string)[] = []): HTMLElement {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (value === true) {
      node.setAttribute(key, '');
    } else if (value !== false && value !== undefined && value !== null) {
      node.setAttribute(key, String(value));
    }
  }
  for (const child of children) node.append(child);
  return node;
}

const ICON = {
  back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  person:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  devices:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="14" height="11" rx="1"/><rect x="17" y="8" width="5" height="11" rx="1"/><path d="M6 19h8"/></svg>',
  chevron:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
  external:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
};

function icon(svg: string, className: string): HTMLElement {
  const wrapper = h('span', { class: className, 'aria-hidden': 'true' });
  wrapper.innerHTML = svg;
  return wrapper;
}

/**
 * The consent modal, rendered into an isolated Shadow DOM overlay inside the
 * host WebView. Layout follows Google's consent platform: a first layer, a
 * "Manage your data" layer with one card per IAB purpose, a "Vendor
 * preferences" layer, and detail screens. Resolves with the user's choice;
 * never rejects.
 */
class ConsentModal {
  private readonly host: HTMLElement;
  private readonly shadow: ShadowRoot;
  private scrim?: HTMLElement;
  private readonly choice: Record<ChoiceList, Set<number | string>>;
  private readonly viewStack: View[];
  private learnMoreOpen = false;
  private previousOverflow = '';

  constructor(
    private readonly config: ConsentServicesConfig,
    private readonly i18n: I18n,
    private readonly opts: ModalOptions,
    private readonly resolve: (choice: ConsentChoice) => void,
  ) {
    this.choice = {
      purposeConsents: new Set(opts.initialChoice.purposeConsents),
      purposeLegInt: new Set(opts.initialChoice.purposeLegInt),
      vendorConsents: new Set(opts.initialChoice.vendorConsents),
      vendorLegInt: new Set(opts.initialChoice.vendorLegInt),
      specialFeatures: new Set(opts.initialChoice.specialFeatures),
    };
    this.viewStack = [{ kind: opts.startView }];
    this.host = document.createElement('div');
    this.shadow = this.host.attachShadow({ mode: 'open' });
  }

  mount(): void {
    this.shadow.append(h('style', {}, [styles(this.opts.accentColor)]));
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.append(this.host);
    this.scrim = h('div', { class: 'scrim' }, [this.buildCard()]);
    this.shadow.append(this.scrim);
  }

  private get currentView(): View {
    return this.viewStack[this.viewStack.length - 1];
  }

  private finish(choice: ConsentChoice): void {
    document.body.style.overflow = this.previousOverflow;
    this.host.remove();
    this.resolve(choice);
  }

  private acceptAll(): void {
    this.finish(choiceAcceptingEverything(this.config));
  }

  private confirm(): void {
    this.finish({
      purposeConsents: [...this.choice.purposeConsents] as number[],
      purposeLegInt: [...this.choice.purposeLegInt] as number[],
      vendorConsents: [...this.choice.vendorConsents] as string[],
      vendorLegInt: [...this.choice.vendorLegInt] as string[],
      specialFeatures: [...this.choice.specialFeatures] as number[],
    });
  }

  private open(view: View): void {
    this.viewStack.push(view);
    this.render(true);
  }

  private back(): void {
    this.viewStack.pop();
    if (this.viewStack.length === 0) this.viewStack.push({ kind: 'first' });
    this.render(true);
  }

  private toggle(list: ChoiceList, value: number | string): void {
    const set = this.choice[list];
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
      this.cascadeSwitchedOn(list, value);
    }
    this.render(false);
  }

  /**
   * Switching a purpose (or special feature) on also switches on the vendors
   * that declare it; switching a vendor on also switches on what it needs.
   * One level only, so a single switch never enables everything.
   */
  private cascadeSwitchedOn(list: ChoiceList, value: number | string): void {
    const services = optionalServices(this.config);
    const addAll = (target: ChoiceList, values: (number | string)[]): void =>
      values.forEach((item) => this.choice[target].add(item));
    const idsDeclaring = (declared: (service: ConsentService) => number[]): string[] =>
      services.filter((service) => declared(service).includes(value as number)).map((service) => service.id);
    const service = services.find((candidate) => candidate.id === value);

    switch (list) {
      case 'purposeConsents':
        addAll('vendorConsents', idsDeclaring((candidate) => candidate.consentPurposes ?? []));
        break;
      case 'purposeLegInt':
        addAll('vendorLegInt', idsDeclaring((candidate) => candidate.legIntPurposes ?? []));
        break;
      case 'specialFeatures':
        addAll('vendorConsents', idsDeclaring((candidate) => candidate.specialFeatures ?? []));
        break;
      case 'vendorConsents':
        addAll('purposeConsents', service?.consentPurposes ?? []);
        addAll('specialFeatures', service?.specialFeatures ?? []);
        break;
      case 'vendorLegInt':
        addAll('purposeLegInt', service?.legIntPurposes ?? []);
        break;
    }
  }

  /** Swap only the card inside the persistent scrim; keep scroll unless the view changed. */
  private render(viewChanged: boolean): void {
    if (!this.scrim) return;
    const old = this.scrim.querySelector('.card');
    const previousScroll = old?.querySelector('.scroll')?.scrollTop ?? 0;
    const card = this.buildCard();
    if (old) this.scrim.replaceChild(card, old);
    else this.scrim.append(card);
    const scroll = card.querySelector('.scroll');
    if (scroll) scroll.scrollTop = viewChanged ? 0 : previousScroll;
    if (viewChanged) (card.querySelector('button') as HTMLElement | null)?.focus();
  }

  private buildCard(): HTMLElement {
    const view = this.currentView;
    switch (view.kind) {
      case 'first':
        return this.renderFirst();
      case 'manage':
        return this.renderManage();
      case 'vendors':
        return this.renderVendors();
      case 'purpose':
        return this.renderPurposeDetails(view.id);
      case 'specialFeature':
        return this.renderSpecialFeatureDetails(view.id);
      case 'vendor':
        return this.renderVendorDetails(view.id);
    }
  }

  // ---------------------------------------------------------------------------
  // Shared building blocks
  // ---------------------------------------------------------------------------

  private card(children: HTMLElement[]): HTMLElement {
    return h(
      'div',
      { class: 'card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'consent-title' },
      children,
    );
  }

  private topBar(title: string): HTMLElement {
    const backButton = h(
      'button',
      { class: 'back', 'aria-label': this.i18n.ui('btn.back'), onclick: () => this.back() },
      [icon(ICON.back, 'back-icon')],
    );
    return h('div', { class: 'topbar' }, [backButton, h('span', { class: 'topbar-title' }, [title])]);
  }

  private footer(primary: [string, () => void], secondary: [string, () => void]): HTMLElement {
    return h('div', { class: 'btns' }, [
      h('button', { class: 'btn', onclick: primary[1] }, [primary[0]]),
      h('button', { class: 'btn', onclick: secondary[1] }, [secondary[0]]),
    ]);
  }

  private choicesFooter(): HTMLElement {
    return this.footer(
      [this.i18n.ui('btn.confirm'), () => this.confirm()],
      [this.i18n.ui('btn.acceptAll'), () => this.acceptAll()],
    );
  }

  private band(label: string): HTMLElement {
    return h('div', { class: 'band' }, [label]);
  }

  private switchRow(label: string, list: ChoiceList, value: number | string): HTMLElement {
    const on = this.choice[list].has(value);
    return h('div', { class: 'switch-row' }, [
      h('span', {}, [label]),
      h('button', {
        class: `switch ${on ? 'on' : ''}`,
        role: 'switch',
        'aria-checked': String(on),
        'aria-label': label,
        onclick: () => this.toggle(list, value),
      }),
    ]);
  }

  private link(label: string, onClick: () => void, extraClass = ''): HTMLElement {
    return h('button', { class: `link ${extraClass}`, onclick: onClick }, [label]);
  }

  private externalLink(label: string, url: string): HTMLElement {
    return h('a', { class: 'link', href: url, target: '_blank', rel: 'noopener' }, [
      label,
      icon(ICON.external, 'external'),
    ]);
  }

  private servicesDeclaring(predicate: (service: ConsentService) => boolean): ConsentService[] {
    return optionalServices(this.config).filter(predicate);
  }

  private consentVendorsFor(purpose: number): ConsentService[] {
    return this.servicesDeclaring((service) => (service.consentPurposes ?? []).includes(purpose));
  }

  private legIntVendorsFor(purpose: number): ConsentService[] {
    return this.servicesDeclaring((service) => (service.legIntPurposes ?? []).includes(purpose));
  }

  private specialFeatureVendorsFor(feature: number): ConsentService[] {
    return this.servicesDeclaring((service) => (service.specialFeatures ?? []).includes(feature));
  }

  private hasTcfVendors(): boolean {
    return this.config.services.some((service) => service.tcf);
  }

  /** IAB stack whose purposes match the declared ones exactly, else the smallest covering stack. */
  private summaryText(): string {
    const declared = new Set(
      [...declaredConsentPurposes(this.config), ...declaredLegIntPurposes(this.config)].filter(
        (purpose) => purpose !== STORE_ACCESS_DEVICE_PURPOSE,
      ),
    );
    const covering = Object.entries(STACK_PURPOSES)
      .filter(([, purposes]) => [...declared].every((purpose) => purposes.includes(purpose)))
      .sort(([, a], [, b]) => a.length - b.length);
    const stackName = covering.length ? this.i18n.stackSummary(covering[0][0]) : undefined;
    return stackName ?? [...declared].map((purpose) => this.i18n.purposeShortName(purpose)).join(', ');
  }

  // ---------------------------------------------------------------------------
  // First layer
  // ---------------------------------------------------------------------------

  private renderFirst(): HTMLElement {
    const t = this.i18n;
    const logo = this.opts.logoUrl
      ? h('div', { class: 'logo' }, [h('img', { src: this.opts.logoUrl, alt: '' })])
      : h('div', { class: 'logo' }, [(this.opts.appName[0] ?? '?').toUpperCase()]);

    const learnMoreItems = [
      ...declaredConsentPurposes(this.config),
      ...declaredLegIntPurposes(this.config).filter(
        (purpose) => !declaredConsentPurposes(this.config).includes(purpose),
      ),
    ]
      .sort((a, b) => a - b)
      .map((purpose) => h('li', {}, [t.purposeShortName(purpose)]));
    declaredSpecialFeatures(this.config).forEach((feature) =>
      learnMoreItems.push(h('li', {}, [t.specialFeature(feature).name])),
    );

    const body = h('p', { class: 'body' }, [
      t.ui('firstLayer.body', { count: optionalServices(this.config).length }) + ' ',
      ...(declaredSpecialFeatures(this.config).includes(PRECISE_GEOLOCATION_FEATURE)
        ? [t.ui('firstLayer.geolocation') + ' ']
        : []),
      this.link(t.ui('firstLayer.partners'), () => this.open({ kind: 'vendors' }), 'inline'),
    ]);

    return this.card([
      h('div', { class: 'scroll' }, [
        h('div', { class: 'pad first' }, [
          logo,
          h('h1', { id: 'consent-title', class: 'title center' }, [
            t.ui('firstLayer.title', { appName: this.opts.appName }),
          ]),
          h('div', { class: 'prow' }, [icon(ICON.person, 'pic'), h('span', { class: 'ptxt' }, [this.summaryText()])]),
          h('div', { class: 'prow' }, [
            icon(ICON.devices, 'pic'),
            h('span', { class: 'ptxt' }, [t.purposeShortName(STORE_ACCESS_DEVICE_PURPOSE)]),
          ]),
          h(
            'button',
            {
              class: 'prow learn-more',
              'aria-expanded': String(this.learnMoreOpen),
              onclick: () => {
                this.learnMoreOpen = !this.learnMoreOpen;
                this.render(false);
              },
            },
            [
              icon(ICON.chevron, `pic outline ${this.learnMoreOpen ? 'open' : ''}`),
              h('span', { class: 'ptxt' }, [t.ui('firstLayer.learnMore')]),
            ],
          ),
          ...(this.learnMoreOpen ? [h('ul', { class: 'learn-more-list' }, learnMoreItems)] : []),
          body,
          ...(declaredLegIntPurposes(this.config).length
            ? [h('p', { class: 'body' }, [t.ui('firstLayer.legInt')])]
            : []),
          h('hr', { class: 'divider' }),
        ]),
      ]),
      this.footer(
        [t.ui('btn.consent'), () => this.acceptAll()],
        [t.ui('btn.manage'), () => this.open({ kind: 'manage' })],
      ),
    ]);
  }

  // ---------------------------------------------------------------------------
  // Manage your data
  // ---------------------------------------------------------------------------

  private purposeCard(purpose: number): HTMLElement {
    const t = this.i18n;
    const text = t.purpose(purpose);
    const consentVendors = this.consentVendorsFor(purpose);
    const legIntVendors = this.legIntVendorsFor(purpose);
    return h('div', { class: 'item' }, [
      h('h2', { class: 'item-title' }, [text.name]),
      h('p', { class: 'item-desc clamp-3' }, [text.description]),
      this.link(t.ui('manage.viewDetails'), () => this.open({ kind: 'purpose', id: purpose })),
      ...(consentVendors.length
        ? [
            this.switchRow(
              t.plural('manage.consentWithCount', consentVendors.length),
              'purposeConsents',
              purpose,
            ),
          ]
        : []),
      ...(legIntVendors.length
        ? [this.switchRow(t.plural('manage.legIntWithCount', legIntVendors.length), 'purposeLegInt', purpose)]
        : []),
    ]);
  }

  private specialFeatureCard(feature: number): HTMLElement {
    const t = this.i18n;
    const text = t.specialFeature(feature);
    return h('div', { class: 'item' }, [
      h('h2', { class: 'item-title' }, [text.name]),
      h('p', { class: 'item-desc clamp-3' }, [text.description]),
      this.link(t.ui('manage.viewDetails'), () => this.open({ kind: 'specialFeature', id: feature })),
      this.switchRow(
        t.plural('manage.consentWithCount', this.specialFeatureVendorsFor(feature).length),
        'specialFeatures',
        feature,
      ),
    ]);
  }

  private renderManage(): HTMLElement {
    const t = this.i18n;
    const purposes = [
      ...new Set([...declaredConsentPurposes(this.config), ...declaredLegIntPurposes(this.config)]),
    ].sort((a, b) => a - b);
    const specialFeatures = declaredSpecialFeatures(this.config);

    return this.card([
      this.topBar(t.ui('manage.header')),
      h('div', { class: 'scroll' }, [
        h('div', { class: 'pad' }, [
          h('h1', { id: 'consent-title', class: 'title center' }, [t.ui('manage.title')]),
          h('p', { class: 'lead' }, [t.ui('manage.subtitle')]),
          this.band(this.hasTcfVendors() ? t.ui('manage.tcfVendors') : t.ui('details.vendors')),
          ...purposes.map((purpose) => this.purposeCard(purpose)),
          ...(specialFeatures.length
            ? [
                this.band(t.ui('manage.specialFeatures')),
                ...specialFeatures.map((feature) => this.specialFeatureCard(feature)),
              ]
            : []),
          h('p', { class: 'lead how' }, [t.ui('manage.howItWorks')]),
          this.band(t.ui('manage.cmpChoices')),
          h('div', { class: 'item' }, [
            h('h2', { class: 'item-title' }, [t.ui('manage.storageTitle')]),
            h('p', { class: 'item-desc' }, [t.ui('manage.storageBody', { days: this.opts.decisionLifetimeDays })]),
          ]),
          this.link(t.ui('manage.vendorPreferences'), () => this.open({ kind: 'vendors' }), 'center-link'),
        ]),
      ]),
      this.choicesFooter(),
    ]);
  }

  // ---------------------------------------------------------------------------
  // Vendor preferences
  // ---------------------------------------------------------------------------

  private vendorCard(service: ConsentService): HTMLElement {
    const t = this.i18n;
    const meta: string[] = [];
    if (service.retentionDays) meta.push(t.ui('vendors.retention', { days: service.retentionDays }));
    if (service.dataCategories?.length) {
      meta.push(
        `${t.ui('vendors.dataCollected')} ${service.dataCategories.map((id) => t.dataCategory(id)).join(', ')}`,
      );
    }

    const links: (Node | string)[] = [
      this.link(t.ui('manage.viewDetails'), () => this.open({ kind: 'vendor', id: service.id })),
    ];
    if (service.urls?.privacy) {
      links.push(
        h('span', { class: 'sep' }, ['|']),
        this.externalLink(t.ui('vendors.privacyPolicy'), service.urls.privacy),
      );
    }

    const controls: HTMLElement[] = [];
    if (service.category === 'essential') {
      controls.push(h('div', { class: 'switch-row' }, [h('span', {}, [t.ui('vendors.alwaysActive')])]));
    } else {
      if (service.consentPurposes?.length)
        controls.push(this.switchRow(t.ui('vendors.consent'), 'vendorConsents', service.id));
      if (service.legIntPurposes?.length)
        controls.push(this.switchRow(t.ui('vendors.legInt'), 'vendorLegInt', service.id));
    }

    return h('div', { class: 'item vendor' }, [
      h('div', { class: 'vendor-head' }, [
        h('h2', { class: 'item-title' }, [service.name]),
        ...meta.map((line, index) =>
          h('p', { class: `item-desc ${index === meta.length - 1 ? 'clamp-2' : ''}` }, [line]),
        ),
      ]),
      h('div', { class: 'vendor-body' }, [h('div', { class: 'links' }, links), ...controls]),
    ]);
  }

  /** Category headings when the config declares categories, else "TCF vendors" / "Other vendors". */
  private vendorGroups(): { label: string; services: ConsentService[] }[] {
    const t = this.i18n;
    const services = this.config.services;

    if (services.some((service) => service.category)) {
      return VENDOR_CATEGORIES.map((category) => ({
        label: t.ui(`vendors.category.${category}`),
        services: services
          .filter((service) => (service.category ?? 'marketing') === category)
          .sort((a, b) => Number(Boolean(b.tcf)) - Number(Boolean(a.tcf))),
      }));
    }

    return [
      { label: t.ui('vendors.tcfVendors'), services: services.filter((service) => service.tcf) },
      { label: t.ui('vendors.otherVendors'), services: services.filter((service) => !service.tcf) },
    ];
  }

  private renderVendors(): HTMLElement {
    const t = this.i18n;
    const groups = this.vendorGroups().filter((group) => group.services.length > 0);

    return this.card([
      this.topBar(t.ui('vendors.header')),
      h('div', { class: 'scroll' }, [
        h('div', { class: 'pad' }, [
          h('h1', { id: 'consent-title', class: 'title center' }, [t.ui('vendors.title')]),
          h('p', { class: 'lead' }, [t.ui('vendors.subtitle')]),
          ...groups.flatMap((group) => [this.band(group.label), ...group.services.map((service) => this.vendorCard(service))]),
        ]),
      ]),
      this.choicesFooter(),
    ]);
  }

  // ---------------------------------------------------------------------------
  // Detail screens
  // ---------------------------------------------------------------------------

  private detailsScreen(topBarTitle: string, content: HTMLElement[]): HTMLElement {
    return this.card([
      this.topBar(topBarTitle),
      h('div', { class: 'scroll' }, [h('div', { class: 'pad' }, content)]),
      this.choicesFooter(),
    ]);
  }

  private nameList(names: string[]): HTMLElement {
    return h(
      'ul',
      { class: 'plain-list' },
      names.map((name) => h('li', {}, [name])),
    );
  }

  private renderPurposeDetails(purpose: number): HTMLElement {
    const t = this.i18n;
    const text = t.purpose(purpose);
    const consentVendors = this.consentVendorsFor(purpose);
    const legIntVendors = this.legIntVendorsFor(purpose);
    const vendorNames = [...new Set([...consentVendors, ...legIntVendors].map((service) => service.name))];
    const toggles: HTMLElement[] = [];
    if (consentVendors.length) {
      toggles.push(
        this.switchRow(t.plural('manage.consentWithCount', consentVendors.length), 'purposeConsents', purpose),
      );
    }
    if (legIntVendors.length) {
      toggles.push(
        this.switchRow(t.plural('manage.legIntWithCount', legIntVendors.length), 'purposeLegInt', purpose),
      );
    }

    return this.detailsScreen(t.ui('manage.header'), [
      h('h1', { id: 'consent-title', class: 'title' }, [text.name]),
      h('p', { class: 'lead' }, [text.description]),
      ...(text.illustrations?.length
        ? [
            this.band(t.ui('details.examples')),
            h(
              'ul',
              { class: 'bullets' },
              text.illustrations.map((line) => h('li', {}, [line])),
            ),
          ]
        : []),
      this.band(t.ui('details.vendors')),
      this.nameList(vendorNames),
      h('div', { class: 'item' }, toggles),
    ]);
  }

  private renderSpecialFeatureDetails(feature: number): HTMLElement {
    const t = this.i18n;
    const text = t.specialFeature(feature);
    const vendors = this.specialFeatureVendorsFor(feature);

    return this.detailsScreen(t.ui('manage.header'), [
      h('h1', { id: 'consent-title', class: 'title' }, [text.name]),
      h('p', { class: 'lead' }, [text.description]),
      this.band(t.ui('details.vendors')),
      this.nameList(vendors.map((service) => service.name)),
      h('div', { class: 'item' }, [
        this.switchRow(t.plural('manage.consentWithCount', vendors.length), 'specialFeatures', feature),
      ]),
    ]);
  }

  private renderVendorDetails(serviceId: string): HTMLElement {
    const t = this.i18n;
    const service = this.config.services.find((candidate) => candidate.id === serviceId) as ConsentService;
    const section = (label: string, names: string[]): HTMLElement[] =>
      names.length
        ? [
            this.band(label),
            h(
              'ul',
              { class: 'bullets' },
              names.map((name) => h('li', {}, [name])),
            ),
          ]
        : [];
    const company = service.company.address
      ? `${service.company.name}, ${service.company.address}`
      : service.company.name;
    const controls: HTMLElement[] = service.category === 'essential'
      ? [h('div', { class: 'switch-row' }, [h('span', {}, [t.ui('vendors.alwaysActive')])])]
      : [
          ...(service.consentPurposes?.length
            ? [this.switchRow(t.ui('vendors.consent'), 'vendorConsents', service.id)]
            : []),
          ...(service.legIntPurposes?.length
            ? [this.switchRow(t.ui('vendors.legInt'), 'vendorLegInt', service.id)]
            : []),
        ];

    return this.detailsScreen(t.ui('vendors.header'), [
      h('h1', { id: 'consent-title', class: 'title' }, [service.name]),
      h('p', { class: 'lead' }, [`${t.ui('vendors.company')} ${company}`]),
      ...section(
        t.ui('vendors.purposes'),
        (service.consentPurposes ?? []).map((id) => t.purpose(id).name),
      ),
      ...section(
        t.ui('vendors.legIntPurposes'),
        (service.legIntPurposes ?? []).map((id) => t.purpose(id).name),
      ),
      ...section(
        t.ui('vendors.specialFeatures'),
        (service.specialFeatures ?? []).map((id) => t.specialFeature(id).name),
      ),
      ...section(
        t.ui('vendors.dataCollected'),
        (service.dataCategories ?? []).map((id) => t.dataCategory(id)),
      ),
      ...section(
        t.ui('vendors.location'),
        (service.locationCC ?? []).map((code) => t.country(code)),
      ),
      ...(service.retentionDays
        ? [h('p', { class: 'item-desc' }, [t.ui('vendors.retention', { days: service.retentionDays })])]
        : []),
      ...(service.urls?.privacy
        ? [
            h('div', { class: 'links spaced' }, [
              this.externalLink(t.ui('vendors.privacyPolicy'), service.urls.privacy),
            ]),
          ]
        : []),
      h('div', { class: 'item' }, controls),
    ]);
  }
}

export function presentConsentModal(
  config: ConsentServicesConfig,
  i18n: I18n,
  opts: ModalOptions,
): Promise<ConsentChoice> {
  return new Promise((resolve) => {
    new ConsentModal(config, i18n, opts, resolve).mount();
  });
}
