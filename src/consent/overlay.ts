import type { ConsentCategory, ConsentService, ConsentServicesConfig } from '../definitions';

import type { I18n } from './i18n';
import { styles } from './styles';
import type { ConsentDecision } from './types';

export interface ModalOptions {
  appName: string;
  logoUrl?: string;
  accentColor: string;
  privacyPolicyUrl?: string;
  legalNoticeUrl?: string;
  /** Open straight on the Manage screen (used by `showPrivacyOptions`). */
  startInManage: boolean;
  /**
   * IDs of services enabled by a prior decision. When set, toggles seed from
   * this instead of the config defaults, so re-opening reflects the saved choice.
   */
  priorConsentedIds?: string[];
}

type Attrs = Record<string, string | number | boolean | ((e: Event) => void)>;

/** Tiny hyperscript helper. `on*` props bind listeners; everything else is an attribute. */
function h(tag: string, attrs: Attrs = {}, children: (Node | string)[] = []): HTMLElement {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (value === true) {
      node.setAttribute(key, '');
    } else if (value !== false) {
      node.setAttribute(key, String(value));
    }
  }
  for (const child of children) node.append(child);
  return node;
}

/**
 * The two-layer consent modal, rendered into an isolated Shadow DOM overlay
 * inside the host WebView. Resolves with the user's decision; never rejects.
 */
class ConsentModal {
  private readonly host: HTMLElement;
  private readonly shadow: ShadowRoot;
  private readonly sortedCategories: ConsentCategory[];
  private readonly servicesByCategory: Map<string, ConsentService[]>;
  private readonly serviceOn: Record<string, boolean> = {};
  private readonly expanded: Record<string, boolean> = {};

  private view: 'first' | 'manage';
  private tab: 'categories' | 'services' = 'categories';
  private prevOverflow = '';
  private scrim?: HTMLElement;

  constructor(
    private readonly config: ConsentServicesConfig,
    private readonly i18n: I18n,
    private readonly opts: ModalOptions,
    private readonly resolve: (decision: ConsentDecision) => void,
  ) {
    this.view = opts.startInManage ? 'manage' : 'first';

    this.sortedCategories = [...config.categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    this.servicesByCategory = new Map();
    for (const cat of this.sortedCategories) this.servicesByCategory.set(cat.id, []);
    for (const svc of config.services) {
      const bucket = this.servicesByCategory.get(svc.categoryId);
      if (bucket) bucket.push(svc);
      this.serviceOn[svc.id] = this.initialState(svc);
    }

    this.host = document.createElement('div');
    this.shadow = this.host.attachShadow({ mode: 'open' });
  }

  /**
   * Initial toggle: locked categories force-on; otherwise a prior saved decision
   * (if any) wins, falling back to the service/category default on first run.
   */
  private initialState(svc: ConsentService): boolean {
    const cat = this.config.categories.find((c) => c.id === svc.categoryId);
    if (cat?.locked) return true;
    if (this.opts.priorConsentedIds) return this.opts.priorConsentedIds.includes(svc.id);
    return svc.default ?? cat?.default ?? false;
  }

  private isLocked(categoryId: string): boolean {
    return this.config.categories.find((c) => c.id === categoryId)?.locked ?? false;
  }

  private categoryOn(categoryId: string): boolean {
    const list = this.servicesByCategory.get(categoryId) ?? [];
    if (list.length === 0) return this.isLocked(categoryId);
    return list.every((s) => this.serviceOn[s.id]);
  }

  mount(): void {
    this.shadow.append(h('style', {}, [styles(this.opts.accentColor)]));
    this.prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.append(this.host);
    // Build the scrim once and keep it mounted — only the card inside is
    // swapped on re-render, so the fade-in animation never replays (no flash).
    this.scrim = h('div', { class: 'scrim' }, [this.buildCard()]);
    this.shadow.append(this.scrim);
  }

  private close(): void {
    document.body.style.overflow = this.prevOverflow;
    this.host.remove();
    this.resolve(this.buildDecision());
  }

  private buildDecision(): ConsentDecision {
    const categories: Record<string, boolean> = {};
    for (const cat of this.config.categories) categories[cat.id] = this.categoryOn(cat.id);
    return {
      granted: categories.marketing === true,
      categories,
      services: { ...this.serviceOn },
    };
  }

  private acceptAll(): void {
    for (const id of Object.keys(this.serviceOn)) this.serviceOn[id] = true;
    this.close();
  }

  // --- rendering -----------------------------------------------------------

  private buildCard(): HTMLElement {
    return this.view === 'first' ? this.renderFirst() : this.renderManage();
  }

  /** Swap only the card inside the persistent scrim, preserving scroll position. */
  private render(): void {
    if (!this.scrim) return;
    const old = this.scrim.querySelector('.card');
    const prevScroll = (old?.querySelector('.scroll') as HTMLElement | null)?.scrollTop ?? 0;
    const card = this.buildCard();
    if (old) this.scrim.replaceChild(card, old);
    else this.scrim.append(card);
    const scroll = card.querySelector('.scroll') as HTMLElement | null;
    if (scroll) scroll.scrollTop = prevScroll;
  }

  private openManage(tab: 'categories' | 'services'): void {
    this.view = 'manage';
    this.tab = tab;
    this.render();
  }

  private renderFirst(): HTMLElement {
    const t = this.i18n;
    const logo = this.opts.logoUrl
      ? h('div', { class: 'logo' }, [h('img', { src: this.opts.logoUrl, alt: '' })])
      : h('div', { class: 'logo' }, [(this.opts.appName[0] ?? '?').toUpperCase()]);

    const rows = this.sortedCategories.map((cat) => {
      const meta = t.category(cat.id);
      return h('div', { class: 'prow' }, [
        h('div', { class: 'pic' }, [cat.icon ?? '•']),
        h('div', { class: 'ptxt' }, [meta.name, h('small', {}, [meta.description ?? ''])]),
      ]);
    });

    const body = h('div', { class: 'body' }, [
      t.ui('firstLayer.body', { appName: this.opts.appName, count: this.config.services.length }) + ' ',
      h('a', { onclick: () => this.openManage('services') }, [t.ui('firstLayer.partners')]),
    ]);

    const legInt = h('div', { class: 'body' }, [t.ui('firstLayer.legInt')]);

    return h('div', { class: 'card' }, [
      h('div', { class: 'scroll' }, [
        logo,
        h('div', { class: 'h1' }, [t.ui('firstLayer.title', { appName: this.opts.appName })]),
        h('div', { class: 'pad' }, [...rows, body, legInt, this.linksRow()]),
      ]),
      h('div', { class: 'btns' }, [
        h('button', { class: 'btn solid', onclick: () => this.acceptAll() }, [t.ui('btn.consent')]),
        h('button', { class: 'btn solid', onclick: () => this.openManage('categories') }, [t.ui('btn.manage')]),
      ]),
    ]);
  }

  private linksRow(): HTMLElement {
    const t = this.i18n;
    const links: Node[] = [];
    if (this.opts.privacyPolicyUrl) {
      links.push(h('a', { href: this.opts.privacyPolicyUrl, target: '_blank', rel: 'noopener' }, [t.ui('link.privacyPolicy')]));
    }
    if (this.opts.legalNoticeUrl) {
      links.push(h('a', { href: this.opts.legalNoticeUrl, target: '_blank', rel: 'noopener' }, [t.ui('link.legalNotice')]));
    }
    return h('div', { class: 'links' }, links);
  }

  private renderManage(): HTMLElement {
    const t = this.i18n;
    const content = this.tab === 'categories' ? this.renderCategories() : this.renderServices();

    return h('div', { class: 'card' }, [
      h('div', { class: 'pad', style: 'padding-bottom:0' }, [
        h('div', { class: 'title' }, [t.ui('manage.title')]),
        h('div', { class: 'subtitle' }, [t.ui('manage.subtitle')]),
      ]),
      h('div', { class: 'tabs' }, [
        h('button', { class: `tab ${this.tab === 'categories' ? 'on' : ''}`, onclick: () => this.setTab('categories') }, [t.ui('tab.categories')]),
        h('button', { class: `tab ${this.tab === 'services' ? 'on' : ''}`, onclick: () => this.setTab('services') }, [t.ui('tab.services')]),
      ]),
      h('div', { class: 'scroll' }, [h('div', { class: 'pad' }, [...content, this.linksRow()])]),
      h('div', { class: 'btns' }, [
        h('button', { class: 'btn solid', onclick: () => this.acceptAll() }, [t.ui('btn.acceptAll')]),
        h('button', { class: 'btn solid', onclick: () => this.close() }, [t.ui('btn.confirm')]),
      ]),
    ]);
  }

  private setTab(tab: 'categories' | 'services'): void {
    this.tab = tab;
    this.render();
  }

  private toggleEl(on: boolean, locked: boolean, onToggle: () => void): HTMLElement {
    // Always capture the click (even when locked) so it never bubbles to the
    // header's expand handler — locked toggles are a no-op, not an expand.
    return h('button', {
      class: `toggle ${on ? '' : 'off'} ${locked ? 'locked' : ''}`,
      onclick: (e: Event) => {
        e.stopPropagation();
        if (!locked) onToggle();
      },
    });
  }

  /** Categories are always-open sections (no border, no master toggle): a header
   *  plus the per-service rows beneath it. */
  private renderCategories(): Node[] {
    const t = this.i18n;
    return this.sortedCategories.map((cat) => {
      const meta = t.category(cat.id);
      const svcRows = (this.servicesByCategory.get(cat.id) ?? []).map((svc) => this.serviceRow(svc, true));
      return h('div', { class: 'section' }, [
        h('div', { class: 'section-h' }, [meta.name]),
        h('div', { class: 'section-d' }, [meta.description ?? '']),
        ...svcRows,
      ]);
    });
  }

  private renderServices(): Node[] {
    return this.config.services.map((svc) => this.serviceRow(svc, false));
  }

  /** A service row. `nested` ones (inside a category) hide their own category label. */
  private serviceRow(svc: ConsentService, nested: boolean): HTMLElement {
    const t = this.i18n;
    const locked = this.isLocked(svc.categoryId);
    const on = this.serviceOn[svc.id];
    const key = `svc:${svc.id}`;
    const open = this.expanded[key];

    const titleBlock: Node[] = [h('div', { class: 'name' }, [brandName(svc.id)])];
    if (!nested) titleBlock.push(h('div', { class: 'cat' }, [t.category(svc.categoryId).name]));

    const head = h('div', { class: 'rowhead', onclick: () => this.toggleExpand(key) }, [
      h('div', {}, titleBlock),
      h('div', { class: 'ctrl' }, [
        this.toggleEl(on, locked, () => this.setService(svc.id, !on)),
        h('span', { class: 'chev' }, [open ? '▲' : '▼']),
      ]),
    ]);

    const children: Node[] = [head];
    if (open) children.push(this.serviceDetail(svc));
    // Nested (under a category section) = plain divided row; standalone (Services
    // tab) = bordered card.
    return h('div', { class: nested ? 'svcrow' : 'row' }, children);
  }

  private serviceDetail(svc: ConsentService): HTMLElement {
    const t = this.i18n;
    const parts: Node[] = [];

    // Localized override wins; otherwise the service's own description.
    const desc = t.serviceDescription(svc.id) || svc.description || '';
    if (desc) {
      parts.push(h('div', { class: 'seclabel' }, [t.ui('section.description')]));
      parts.push(h('div', { class: 'secval' }, [desc]));
    }

    parts.push(h('div', { class: 'seclabel' }, [t.ui('section.company')]));
    parts.push(h('div', { class: 'secval' }, [
      svc.company.name + (svc.company.address ? ` — ${svc.company.address}` : ''),
    ]));

    this.chipSection(parts, 'section.purposes', (svc.purposeIds ?? []).map((id) => t.purpose(id)));
    this.chipSection(parts, 'section.technologies', (svc.technologyIds ?? []).map((id) => t.technology(id)));
    this.chipSection(parts, 'section.dataCollected', (svc.dataCollectedIds ?? []).map((id) => t.dataCategory(id)));
    this.chipSection(parts, 'section.legalBasis', (svc.legalBasisIds ?? []).map((id) => t.legalBasis(id)));

    if (svc.locationCC?.length) {
      parts.push(h('div', { class: 'seclabel' }, [t.ui('section.location')]));
      parts.push(h('div', { class: 'secval' }, [svc.locationCC.map((c) => t.country(c)).join(', ')]));
    }
    if (svc.retentionId) {
      parts.push(h('div', { class: 'seclabel' }, [t.ui('section.retention')]));
      parts.push(h('div', { class: 'secval' }, [t.retention(svc.retentionId)]));
    }
    if (svc.transferCC?.length) {
      this.chipSection(parts, 'section.transfer', svc.transferCC.map((c) => t.country(c)));
    }
    if (svc.recipients?.length) {
      this.chipSection(parts, 'section.recipients', svc.recipients);
    }

    const urlLink = (label: string, url?: string): void => {
      if (!url) return;
      parts.push(h('div', { class: 'secval', style: 'margin-top:10px' }, [
        h('a', { href: url, target: '_blank', rel: 'noopener' }, [label]),
      ]));
    };
    urlLink(t.ui('link.privacyPolicyOf'), svc.urls?.privacy);
    urlLink(t.ui('link.cookiePolicyOf'), svc.urls?.cookie);
    urlLink(t.ui('link.optOutOf'), svc.urls?.optOut);

    return h('div', { class: 'detail' }, parts);
  }

  private chipSection(parts: Node[], labelKey: string, values: string[]): void {
    if (!values.length) return;
    parts.push(h('div', { class: 'seclabel' }, [this.i18n.ui(labelKey)]));
    parts.push(h('div', {}, values.map((v) => h('span', { class: 'chip' }, [v]))));
  }

  // --- state mutations -----------------------------------------------------

  private setService(id: string, on: boolean): void {
    this.serviceOn[id] = on;
    this.render();
  }

  private toggleExpand(key: string): void {
    this.expanded[key] = !this.expanded[key];
    this.render();
  }
}

/**
 * Derive a human brand name from a service id when none is provided. Hyphen and
 * underscore become spaces and words are title-cased — `unity-ads` → `Unity Ads`.
 * Publishers can always override the display by id in their data, but the
 * reference services map cleanly.
 */
const BRAND_OVERRIDES: Record<string, string> = {
  ironsource: 'ironSource',
  'pangle-sdk': 'Pangle SDK',
  'facebook-audience-network': 'Facebook Audience Network',
  'google-firebase-analytics': 'Google Firebase Analytics',
  'usercentrics-cmp': 'Usercentrics Consent Management Platform',
  revenuecat: 'RevenueCat',
};

function brandName(id: string): string {
  if (BRAND_OVERRIDES[id]) return BRAND_OVERRIDES[id];
  return id
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function presentConsentModal(
  config: ConsentServicesConfig,
  i18n: I18n,
  opts: ModalOptions,
): Promise<ConsentDecision> {
  return new Promise((resolve) => {
    new ConsentModal(config, i18n, opts, resolve).mount();
  });
}
