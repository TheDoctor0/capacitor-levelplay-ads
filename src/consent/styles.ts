/**
 * Stylesheet for the consent modal, injected into the component's Shadow DOM so
 * it never collides with the host app's CSS. `accent` themes buttons, switches
 * and active tabs.
 */
export function styles(accent: string): string {
  return `
:host { all: initial; }
* { box-sizing: border-box; margin: 0; padding: 0; }
.scrim {
  position: fixed; inset: 0; z-index: 2147483647;
  background: rgba(0,0,0,.55);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  animation: fade .18s ease;
}
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }
.card {
  width: 100%; max-width: 460px; max-height: 92vh;
  background: #fff; color: #141413; border-radius: 16px;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 18px 50px rgba(0,0,0,.45);
}
.scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; flex: 1; }
.pad { padding: 18px; }

.logo {
  width: 56px; height: 56px; border-radius: 50%; background: ${accent};
  color: #fff; font-weight: 800; font-size: 24px;
  display: flex; align-items: center; justify-content: center;
  margin: 22px auto 6px; overflow: hidden;
}
.logo img { width: 100%; height: 100%; object-fit: cover; }

.h1 { font-weight: 800; font-size: 19px; line-height: 1.3; text-align: center; padding: 8px 22px 6px; }
.title { font-weight: 800; font-size: 21px; padding: 4px 0 2px; }
.subtitle { color: #3d3d3a; font-size: 14px; padding: 2px 0 10px; }

.links { font-weight: 800; font-size: 13px; padding: 4px 0 14px; }
.links a { color: #141413; text-decoration: none; margin-right: 16px; cursor: pointer; }
.links a:hover { text-decoration: underline; }

.prow { display: flex; gap: 14px; align-items: center; padding: 11px 0; }
.pic { width: 40px; height: 40px; border-radius: 50%; background: #eef2fd; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 19px; }
.ptxt { font-size: 14px; font-weight: 700; line-height: 1.3; }
.ptxt small { display: block; font-weight: 400; color: #3d3d3a; font-size: 12.5px; margin-top: 2px; }

.body { color: #3d3d3a; font-size: 13.5px; line-height: 1.45; padding: 8px 0; }
.body a { color: #141413; font-weight: 700; cursor: pointer; }

.btns { display: flex; flex-direction: column; gap: 11px; padding: 14px 18px 18px;
  border-top: 1px solid #eceae2; background: #fff; }
.btn { text-align: center; font-weight: 800; font-size: 15px; padding: 14px 0; border-radius: 28px;
  border: none; cursor: pointer; font-family: inherit; }
.btn.solid { background: ${accent}; color: #fff; }
.btn.solid:active { filter: brightness(.92); }

.tabs { display: flex; border-bottom: 1.5px solid #d1cfc5; }
.tab { flex: 1; text-align: center; padding: 14px 0; font-weight: 800; font-size: 15px;
  color: #87867f; background: none; border: none; cursor: pointer; font-family: inherit; }
.tab.on { color: ${accent}; box-shadow: inset 0 -3px 0 ${accent}; }

.row { border: 1.5px solid #d1cfc5; border-radius: 10px; padding: 13px 14px; margin-bottom: 11px; }
.rowhead { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; cursor: pointer; }
.name { font-weight: 800; font-size: 15px; }
.cat { color: #3d3d3a; font-size: 12px; margin-top: 2px; }
.desc { color: #3d3d3a; font-size: 12.5px; margin-top: 8px; line-height: 1.4; }

/* Categories tab: always-open sections (no card border) with plain service rows */
.section { margin: 2px 0 20px; }
.section-h { font-weight: 800; font-size: 17px; margin: 6px 0 2px; }
.section-d { color: #3d3d3a; font-size: 12.5px; margin-bottom: 4px; line-height: 1.4; }
.svcrow { padding: 12px 2px; border-bottom: 1px solid #eceae2; }
.svcrow:last-child { border-bottom: none; }
.ctrl { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

.toggle { width: 46px; height: 26px; border-radius: 13px; background: ${accent}; position: relative;
  border: none; cursor: pointer; flex-shrink: 0; transition: background .15s; padding: 0; }
.toggle.off { background: #c9c7bf; }
.toggle.locked { opacity: .6; cursor: default; }
.toggle::after { content: ''; position: absolute; width: 20px; height: 20px; border-radius: 50%;
  background: #fff; top: 3px; right: 3px; box-shadow: 0 2px 4px rgba(0,0,0,.35); transition: all .15s; }
.toggle.off::after { right: auto; left: 3px; }

.chev { color: #87867f; font-size: 15px; line-height: 1; background: none; border: none; cursor: pointer; }

.detail { border-top: 1px solid #d1cfc5; margin-top: 11px; padding-top: 4px; }
.detail.hidden { display: none; }
.seclabel { font-size: 11px; color: #87867f; margin: 11px 0 4px; font-weight: 600; }
.secval { font-size: 13px; line-height: 1.4; }
.secval a { color: ${accent}; word-break: break-all; }
.chip { display: inline-block; border: 1px solid #d1cfc5; border-radius: 7px; padding: 5px 9px;
  font-size: 11.5px; color: #3d3d3a; margin: 3px 4px 3px 0; }

.view.hidden { display: none; }
`;
}
