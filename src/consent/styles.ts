/**
 * Stylesheet for the consent modal, injected into the component's Shadow DOM so
 * it never collides with the host app's CSS. Modelled on Google's consent
 * platform; `accent` themes buttons, links and switches.
 */
export function styles(accent: string): string {
  return `
:host { all: initial; }
* { box-sizing: border-box; margin: 0; padding: 0; }
.scrim {
  position: fixed; inset: 0; z-index: 2147483647;
  background: rgba(0,0,0,.6);
  display: flex; align-items: center; justify-content: center;
  padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
  font-family: Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  animation: fade .18s ease;
}
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }
.card {
  width: 100%; max-width: 480px; max-height: 100%;
  background: #fff; color: #202124; border-radius: 8px;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,.4);
}
.scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; flex: 1; }
.pad { padding: 20px 20px 8px; }
.pad.first { padding-top: 24px; }
button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; text-align: left; }

.topbar { position: relative; display: flex; align-items: center; justify-content: center;
  min-height: 52px; padding: 0 56px; border-bottom: 1px solid #e8eaed; }
.back { position: absolute; left: 8px; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #5f6368; }
.back-icon { display: flex; }
.topbar-title { font-size: 14px; color: #5f6368; }

.logo { width: 64px; height: 64px; border-radius: 50%; background: ${accent}; color: #fff;
  font-weight: 700; font-size: 28px; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; overflow: hidden; }
.logo img { width: 100%; height: 100%; object-fit: cover; }

.title { font-size: 20px; font-weight: 500; line-height: 1.35; margin: 4px 0 12px; }
.title.center { text-align: center; }
.lead { font-size: 15px; line-height: 1.5; color: #5f6368; margin-bottom: 16px; }
.lead.how { margin: 20px 0 12px; }

.prow { display: flex; gap: 16px; align-items: center; width: 100%; padding: 8px 0; }
.pic { width: 40px; height: 40px; border-radius: 50%; background: #d2e3fc; color: #1967d2; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; }
.pic.outline { background: #fff; border: 1px solid #dadce0; color: #5f6368; transition: transform .15s; }
.pic.outline.open { transform: rotate(180deg); }
.ptxt { font-size: 15px; font-weight: 500; line-height: 1.4; }
.learn-more-list { margin: 4px 0 8px 56px; font-size: 14px; line-height: 1.6; color: #3c4043; }
.body { font-size: 14px; line-height: 1.55; color: #5f6368; margin-top: 12px; }
.divider { border: none; border-top: 1px solid #dadce0; margin: 16px 12px 4px; }

.band { background: #f1f3f4; color: #3c4043; font-size: 13px; padding: 10px 16px; margin: 4px 0 12px; }
.item { border: 1px solid #dadce0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
.item-title { font-size: 15px; font-weight: 500; line-height: 1.4; margin-bottom: 8px; }
.item-desc { font-size: 14px; line-height: 1.5; color: #5f6368; }
.clamp-2, .clamp-3 { display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
.clamp-2 { -webkit-line-clamp: 2; }
.clamp-3 { -webkit-line-clamp: 3; }

.item.vendor { padding: 0; }
.vendor-head { padding: 16px; border-bottom: 1px solid #e8eaed; }
.vendor-body { padding: 8px 16px 12px; }
.links { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 8px 0; font-size: 14px; }
.links.spaced { margin-bottom: 8px; }
.sep { color: #9aa0a6; }

.link { color: ${accent}; font-size: 14px; padding: 8px 0; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; }
.link.inline { display: inline; padding: 0; color: #202124; text-decoration: underline; font-size: inherit; }
.link.center-link { display: block; width: 100%; text-align: center; font-weight: 500; font-size: 15px; padding: 20px 0 16px; }
.external { display: inline-flex; }

.switch-row { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  font-size: 14px; color: #3c4043; padding: 10px 0; }
.switch { position: relative; width: 40px; height: 24px; border-radius: 12px; background: #80868b; flex-shrink: 0; transition: background .15s; }
.switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: transform .15s; }
.switch.on { background: ${accent}; }
.switch.on::after { transform: translateX(16px); }
.switch:focus-visible, .btn:focus-visible, .link:focus-visible, .back:focus-visible { outline: 2px solid ${accent}; outline-offset: 2px; }

.bullets { margin: 0 0 16px 20px; font-size: 14px; line-height: 1.55; color: #3c4043; }
.bullets li { margin-bottom: 8px; }
.plain-list { list-style: none; margin-bottom: 16px; font-size: 14px; color: #3c4043; }
.plain-list li { padding: 12px 0; border-bottom: 1px solid #e8eaed; }

.btns { display: flex; flex-direction: column; gap: 12px; padding: 16px 20px 20px; border-top: 1px solid #e8eaed; background: #fff; }
.btn { background: ${accent}; color: #fff; text-align: center; font-weight: 500; font-size: 16px;
  padding: 14px 0; border-radius: 24px; }
.btn:active { filter: brightness(.92); }
`;
}
