import { LevelPlayAds } from 'capacitor-levelplay-ads';
import { SplashScreen } from '@capacitor/splash-screen';

// Unity LevelPlay demo ad units — replace with your own from the dashboard.
const DEMO = {
  appKey: '85460dcd',
  banner: 'thnf3p9ololdz3xy',
  interstitial: 'js2qq3ig4qm5wo7e',
  rewarded: 'p9bzpscwzr7jsj0u',
};

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: block; height: 100vh; width: 100vw; margin: 0; padding: 0;
            overflow: hidden; background-color: #000;
          }
          .app-container {
            display: flex; flex-direction: column; height: 100%;
            background-color: #f4f5f8;
            padding-top: env(safe-area-inset-top, 0px);
            padding-bottom: env(safe-area-inset-bottom, 0px);
            box-sizing: border-box;
          }
          .debug-header, .debug-footer {
            background: repeating-linear-gradient(45deg, #ffc409, #ffc409 10px, #e0ab08 10px, #e0ab08 20px);
            color: #000; text-align: center; font-weight: 900; font-size: 12px; padding: 8px 0;
            text-transform: uppercase; letter-spacing: 2px; flex-shrink: 0; z-index: 10;
          }
          .scroll-area {
            flex: 1; overflow-y: auto; padding: 10px;
            display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-content: start;
          }
          .section {
            background: white; border-radius: 8px; padding: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            display: flex; flex-direction: column; gap: 6px;
          }
          .section.full-width { grid-column: 1 / -1; }
          .section-title { font-size: 13px; font-weight: bold; color: #3880ff; text-align: center; margin: 0 0 4px 0; }
          .controls {
            background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 6px; padding: 6px;
            display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; align-items: center;
          }
          .controls label { display: flex; justify-content: space-between; align-items: center; }
          .controls select, .controls input { padding: 2px; margin: 0; }
          .btn-row { display: flex; gap: 6px; }
          .btn {
            flex: 1; border: none; border-radius: 4px; padding: 8px 4px;
            font-size: 11px; font-weight: bold; color: white; cursor: pointer; text-align: center;
            transition: all 0.2s ease;
          }
          .btn:active { opacity: 0.8; transform: scale(0.98); }
          .btn-sys { background-color: #3880ff; }
          .btn-load { background-color: #eb445a; }
          .btn-show { background-color: #2dd36f; }
          .btn-alt { background-color: #92949c; }
          .btn:disabled {
            background-color: #cccccc !important; color: #888888 !important;
            cursor: not-allowed; transform: none; opacity: 0.7;
          }
          .terminal-wrapper {
            height: 32vh; background-color: #222428;
            display: flex; flex-direction: column; border-top: 2px solid #111;
          }
          .terminal-header {
            background: #1a1b1e; color: #fff; font-size: 10px; padding: 4px 10px; font-weight: bold;
            display: flex; justify-content: space-between;
          }
          .status-badge { color: #eb445a; }
          .status-badge.ready { color: #2dd36f; }
          #terminal {
            flex: 1; overflow-y: auto; padding: 8px 10px;
            color: #2fdf75; font-family: monospace; font-size: 11px; word-wrap: break-word;
          }
          .log-time { color: #888; font-size: 9px; margin-right: 4px; }
        </style>

        <div class="app-container">
          <div class="debug-header">⬆ WEBVIEW TOP ⬆</div>

          <div class="scroll-area">

            <div class="section full-width">
              <h3 class="section-title">1. Consent & Setup</h3>
              <div class="btn-row">
                <button class="btn btn-sys" id="btn-consent">Consent</button>
                <button class="btn btn-sys" id="btn-privacy">Privacy</button>
                <button class="btn btn-sys" id="btn-att">ATT (iOS)</button>
                <button class="btn btn-sys" id="btn-init">Init SDK</button>
              </div>
              <div class="btn-row">
                <button class="btn btn-alt ad-action" id="btn-testsuite" disabled>Test Suite</button>
              </div>
            </div>

            <div class="section full-width">
              <h3 class="section-title">2. Banner Ad</h3>
              <div class="controls">
                <label>Pos: <select id="banner-pos"><option value="BOTTOM">BTM</option><option value="TOP">TOP</option></select></label>
                <label>Size: <select id="banner-size">
                  <option value="ADAPTIVE">ADAPTIVE</option>
                  <option value="BANNER">BANNER</option>
                  <option value="LARGE">LARGE</option>
                  <option value="MEDIUM_RECTANGLE">MREC</option>
                  <option value="LEADERBOARD">LEADER</option>
                </select></label>
                <label>Overlap: <input type="checkbox" id="banner-overlap" checked></label>
                <label>AutoShow: <input type="checkbox" id="banner-auto" checked></label>
              </div>
              <div class="btn-row">
                <button class="btn btn-load ad-action" id="btn-banner-create" disabled>Create</button>
                <button class="btn btn-show ad-action" id="btn-banner-show" disabled>Show</button>
                <button class="btn btn-alt ad-action" id="btn-banner-hide" disabled>Hide</button>
                <button class="btn btn-alt ad-action" id="btn-banner-destroy" disabled>Destroy</button>
              </div>
            </div>

            <div class="section">
              <h3 class="section-title">3. Interstitial</h3>
              <div class="btn-row">
                <button class="btn btn-load ad-action" id="btn-int-load" disabled>Load</button>
                <button class="btn btn-alt ad-action" id="btn-int-ready" disabled>Ready?</button>
                <button class="btn btn-show ad-action" id="btn-int-show" disabled>Show</button>
              </div>
            </div>

            <div class="section">
              <h3 class="section-title">4. Rewarded</h3>
              <div class="btn-row">
                <button class="btn btn-load ad-action" id="btn-rew-load" disabled>Load</button>
                <button class="btn btn-alt ad-action" id="btn-rew-ready" disabled>Ready?</button>
                <button class="btn btn-show ad-action" id="btn-rew-show" disabled>Show</button>
              </div>
            </div>

          </div>

          <div class="terminal-wrapper">
            <div class="terminal-header">
              <span>Real-time Event Log</span>
              <span class="status-badge" id="sdk-status">SDK LOCKED</span>
            </div>
            <div id="terminal"></div>
          </div>

          <div class="debug-footer">⬇ WEBVIEW BOTTOM ⬇</div>
        </div>
      `;

      SplashScreen.hide();

      this.terminal = this.shadowRoot.getElementById('terminal');
      this.sdkStatusBadge = this.shadowRoot.getElementById('sdk-status');
      this.setupEventListeners();
      this.registerPluginEvents();

      this.logToTerminal('App loaded. Run Consent, then Init SDK.', 'SYS');
    }

    logToTerminal(message, type = 'INFO') {
      const now = new Date();
      const timeStr = String(now.getSeconds()).padStart(2, '0') + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const logElement = document.createElement('div');

      let color = '#2fdf75';
      if (type === 'ERROR') color = '#eb445a';
      if (type === 'EVENT') color = '#3dc2ff';
      if (type === 'SYS') color = '#ffce00';
      if (type === 'SUCCESS') color = '#2dd36f';
      if (type === 'REVENUE') color = '#e040fb';

      logElement.innerHTML = `<span class="log-time">[${timeStr}]</span> <span style="color: ${color}">${message}</span>`;
      this.terminal.appendChild(logElement);
      this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    unlockAdButtons() {
      this.shadowRoot.querySelectorAll('.ad-action').forEach((btn) => btn.removeAttribute('disabled'));
      this.sdkStatusBadge.innerText = 'SDK READY';
      this.sdkStatusBadge.classList.add('ready');
      this.logToTerminal('✅ SDK initialized. Ad buttons unlocked.', 'SUCCESS');
    }

    setupEventListeners() {
      const getById = (id) => this.shadowRoot.getElementById(id);

      // 1. CONSENT & SETUP
      getById('btn-consent').addEventListener('click', async () => {
        try {
          this.logToTerminal('Requesting consent info...', 'SYS');
          const result = await LevelPlayAds.requestConsentInfo({
            title: 'We value your privacy',
            message: 'We use ads to keep this app free. Allow personalized ads?',
            privacyPolicyUrl: 'https://example.com/privacy',
          });
          this.logToTerminal(`Consent: status=${result.status}, canRequestAds=${result.canRequestAds}`);
        } catch (error) {
          this.logToTerminal(`Consent error: ${error.message || error}`, 'ERROR');
        }
      });

      getById('btn-privacy').addEventListener('click', async () => {
        try {
          const result = await LevelPlayAds.showPrivacyOptions();
          this.logToTerminal(`Privacy updated: status=${result.status}`);
        } catch (error) {
          this.logToTerminal(`Privacy error: ${error.message || error}`, 'ERROR');
        }
      });

      getById('btn-att').addEventListener('click', async () => {
        try {
          const result = await LevelPlayAds.requestTrackingAuthorization();
          this.logToTerminal(`ATT status: ${result.status}`);
        } catch (error) {
          this.logToTerminal(`ATT error: ${error.message || error}`, 'ERROR');
        }
      });

      getById('btn-init').addEventListener('click', async () => {
        try {
          this.logToTerminal('Initializing LevelPlay...', 'SYS');
          const result = await LevelPlayAds.initialize({
            appKey: DEMO.appKey,
            userId: 'demo-user',
            isTesting: true,
          });
          if (result.status) this.unlockAdButtons();
        } catch (error) {
          this.logToTerminal(`Init error: ${error.message || error}`, 'ERROR');
        }
      });

      getById('btn-testsuite').addEventListener('click', () => LevelPlayAds.launchTestSuite());

      // 2. BANNER
      getById('btn-banner-create').addEventListener('click', async () => {
        try {
          const pos = getById('banner-pos').value;
          const adSize = getById('banner-size').value;
          const isOverlap = getById('banner-overlap').checked;
          const isAutoShow = getById('banner-auto').checked;
          this.logToTerminal(`Creating banner [${adSize}, ${pos}]`, 'SYS');
          await LevelPlayAds.createBanner({
            adUnitId: DEMO.banner,
            position: pos,
            adSize,
            isAutoShow,
            isOverlap,
          });
        } catch (error) {
          this.logToTerminal(`Banner error: ${error.message || error}`, 'ERROR');
        }
      });
      getById('btn-banner-show').addEventListener('click', () => LevelPlayAds.showBanner());
      getById('btn-banner-hide').addEventListener('click', () => LevelPlayAds.hideBanner());
      getById('btn-banner-destroy').addEventListener('click', () => {
        LevelPlayAds.destroyBanner();
        this.logToTerminal('Banner destroyed.', 'SYS');
      });

      // 3. INTERSTITIAL
      getById('btn-int-load').addEventListener('click', async () => {
        try {
          this.logToTerminal('Loading interstitial...', 'SYS');
          await LevelPlayAds.loadInterstitial({ adUnitId: DEMO.interstitial });
        } catch (error) {
          this.logToTerminal(`Interstitial load error: ${error.message || error}`, 'ERROR');
        }
      });
      getById('btn-int-ready').addEventListener('click', async () => {
        const { isReady } = await LevelPlayAds.isInterstitialReady();
        this.logToTerminal(`Interstitial ready: ${isReady}`);
      });
      getById('btn-int-show').addEventListener('click', async () => {
        try {
          await LevelPlayAds.showInterstitial();
        } catch (error) {
          this.logToTerminal(`Interstitial show error: ${error.message || error}`, 'ERROR');
        }
      });

      // 4. REWARDED
      getById('btn-rew-load').addEventListener('click', async () => {
        try {
          this.logToTerminal('Loading rewarded...', 'SYS');
          await LevelPlayAds.loadRewarded({ adUnitId: DEMO.rewarded });
        } catch (error) {
          this.logToTerminal(`Rewarded load error: ${error.message || error}`, 'ERROR');
        }
      });
      getById('btn-rew-ready').addEventListener('click', async () => {
        const { isReady } = await LevelPlayAds.isRewardedReady();
        this.logToTerminal(`Rewarded ready: ${isReady}`);
      });
      getById('btn-rew-show').addEventListener('click', async () => {
        try {
          await LevelPlayAds.showRewarded();
        } catch (error) {
          this.logToTerminal(`Rewarded show error: ${error.message || error}`, 'ERROR');
        }
      });
    }

    registerPluginEvents() {
      const bindEvent = (eventName, customType = 'EVENT') => {
        LevelPlayAds.addListener(eventName, (data) => {
          let extra = data ? JSON.stringify(data) : '';
          if (extra.length > 60) extra = extra.substring(0, 60) + '...}';
          this.logToTerminal(`${eventName} ${extra}`, customType);
        });
      };

      ['onConsentStatusChanged'].forEach((e) => bindEvent(e, 'SYS'));
      ['onBannerAdLoaded', 'onBannerAdLoadFailed', 'onBannerAdClicked',
        'onBannerAdDisplayed', 'onBannerAdDisplayFailed', 'onBannerAdExpanded',
        'onBannerAdCollapsed', 'onBannerAdLeftApplication'].forEach((e) => bindEvent(e));
      ['onInterstitialAdLoaded', 'onInterstitialAdLoadFailed', 'onInterstitialAdDisplayed',
        'onInterstitialAdDisplayFailed', 'onInterstitialAdClicked', 'onInterstitialAdClosed',
        'onInterstitialAdInfoChanged'].forEach((e) => bindEvent(e));
      ['onRewardedAdLoaded', 'onRewardedAdLoadFailed', 'onRewardedAdDisplayed',
        'onRewardedAdDisplayFailed', 'onRewardedAdClicked', 'onRewardedAdClosed',
        'onRewardedAdRewarded', 'onRewardedAdInfoChanged'].forEach((e) => bindEvent(e));
      ['onAdRevenue'].forEach((e) => bindEvent(e, 'REVENUE'));
    }
  },
);
