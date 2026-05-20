# capacitor-levelplay-ads

[![Android](https://img.shields.io/badge/Platform-Android-green?logo=android)](https://www.android.com)
[![iOS](https://img.shields.io/badge/Platform-iOS-lightgrey?logo=apple)](https://www.apple.com/ios)
[![LevelPlay](https://img.shields.io/badge/SDK-Unity%20LevelPlay-blue)](https://unity.com/products/unity-levelplay)
[![NPM version](https://img.shields.io/npm/v/capacitor-levelplay-ads.svg)](https://www.npmjs.com/package/capacitor-levelplay-ads)
[![Downloads](https://img.shields.io/npm/dm/capacitor-levelplay-ads.svg)](https://www.npmjs.com/package/capacitor-levelplay-ads)
[![License](https://img.shields.io/npm/l/capacitor-levelplay-ads.svg)](https://github.com/TheDoctor0/capacitor-levelplay-ads/blob/master/LICENSE)

**Unity LevelPlay mediation for Capacitor.**

This plugin integrates the Unity LevelPlay mediation SDK (formerly ironSource) into Capacitor.

Banner, interstitial and rewarded ads are supported.

Ads can be served across every mediated demand source from a single, modular API with zero mandatory native configuration.

---

### 📦 SDK Versions

| Component | Platform | Version |
| :--- | :--- | :--- |
| **LevelPlay Mediation SDK** | Android | `com.unity3d.ads-mediation:mediation-sdk:9.4.0` |
| **IronSource SDK** | iOS | `IronSourceSDK` (CocoaPods) |

---

## ✨ Key Features

- **Mediation-first:** One LevelPlay app key fans out to every network you
  enable — AdMob, AppLovin, Unity Ads, Vungle, Meta, Mintegral, Pangle.
- **Custom consent gate:** A built-in consent modal (no IAB TCF CMP required)
  records a GDPR decision, persists it, and gates ad loading until a decision
  exists. Decisions are pushed to LevelPlay globally and per-network.
- **CCPA & COPPA:** First-class `setCCPAConsent()` and `setChildDirected()`.
- **App Tracking Transparency:** `requestTrackingAuthorization()` prompts ATT
  on iOS and is a safe no-op on Android.
- **Impression-level revenue (ILRD):** Subscribe to `onAdRevenue` for
  per-impression revenue across all networks.
- **Android 15 edge-to-edge ready:** Automated lifecycle workaround so
  fullscreen ad close buttons are never hidden behind the system bars.
- **Anti-spam rate limiting:** Built-in per-ad load throttling protects your
  account from invalid-traffic penalties.
- **Opt-in network injection:** Mediation adapter pods/gradle deps are injected
  at sync time from a single `levelplay.networks` key — no manual XML edits.

---

## ⚠️ Important Notices

### 1. Built from scratch
This is **not** a fork of any existing Capacitor plugin. It is generated with
the official [@capacitor/plugin](https://github.com/ionic-team/create-capacitor-plugin)
generator. The core monetization logic inherits years of proven optimizations
from the author's Cordova AdMob implementations.

### 2. iOS integration paths
CocoaPods is the primary, supported iOS integration path — it pulls the
IronSource SDK via the podspec. Swift Package Manager is secondary; see
`Package.swift` for details. Without the SDK the plugin still builds: all
native SDK code is guarded and degrades to no-ops.

---

## 📦 Installation

```bash
npm install capacitor-levelplay-ads
npx cap sync
```

## ⚙️ Configuration (Mediation Networks)

Mediation network adapters are **opt-in**. The plugin bundles only the core
LevelPlay SDK; each demand source you want is wired in by a Capacitor CLI hook.

1. Add a `levelplay` block to your app's root `package.json`:
```json
{
  "name": "your-app-name",
  "levelplay": {
    "networks": ["admob", "applovin", "unityads"],
    "userTrackingDescription": "This identifier is used to deliver personalized ads to you."
  }
}
```
Supported network keys: `admob`, `applovin`, `unityads`, `vungle`, `meta`,
`mintegral`, `pangle`.

2. Register the hook in the `scripts` section of your `package.json`:
```json
{
  "scripts": {
    "capacitor:sync:after": "node node_modules/capacitor-levelplay-ads/scripts/levelplay-manifest.js"
  }
}
```

On every `npx cap sync` the hook injects, for each selected network:
- Android adapter `implementation` lines into `android/app/build.gradle`
- iOS adapter pods into `ios/App/Podfile`
- `NSUserTrackingUsageDescription` + per-network `SKAdNetwork` IDs into `Info.plist`

*Transparency note: the injection script is strictly OPT-IN and only runs if
you explicitly declare the hook above.*

---

## Install

To use npm:

```bash
npm install capacitor-levelplay-ads
```

To use yarn:

```bash
yarn add capacitor-levelplay-ads
```

Sync native files:

```bash
npx cap sync
```

## 🚀 Quick Setup

A minimal flow: initialize the SDK, ask for consent, then load and show an interstitial.

```ts
import { LevelPlayAds } from 'capacitor-levelplay-ads';

async function bootstrapAds() {
  // 1. Initialize the LevelPlay SDK with your app key.
  await LevelPlayAds.initialize({
    appKey: 'YOUR_LEVELPLAY_APP_KEY',
    isTesting: true, // remove or set to false in production
  });

  // 2. Request a GDPR / consent decision. The plugin shows a custom modal
  //    on first run and reuses the stored decision afterwards.
  const consent = await LevelPlayAds.requestConsentInfo({
    privacyPolicyUrl: 'https://example.com/privacy',
    networks: ['admob', 'meta'], // optional — must match your levelplay.networks
  });

  if (!consent.canRequestAds) {
    console.log('User declined personalised ads.');
  }

  // 3. (iOS only) Ask for App Tracking Transparency. Resolves with
  //    "NOT_APPLICABLE" on Android, so the same call works cross-platform.
  await LevelPlayAds.requestTrackingAuthorization();

  // 4. Pre-load an interstitial. Listen for load + display events.
  LevelPlayAds.addListener('onInterstitialAdLoaded', () => {
    console.log('Interstitial ready.');
  });
  LevelPlayAds.addListener('onInterstitialAdClosed', () => {
    console.log('Interstitial closed — next ad is auto-reloading.');
  });

  await LevelPlayAds.loadInterstitial({ adUnitId: 'YOUR_INTERSTITIAL_AD_UNIT' });
}

async function showInterstitial() {
  const { isReady } = await LevelPlayAds.isInterstitialReady();
  if (isReady) {
    await LevelPlayAds.showInterstitial();
  }
}
```

> ⚠️ `initialize` and `requestConsentInfo` must complete **before** any
> `loadInterstitial` / `loadRewarded` / `createBanner` call — ad loads are
> rejected otherwise.

## API

<docgen-index>

* [`initialize(...)`](#initialize)
* [`launchTestSuite()`](#launchtestsuite)
* [`requestConsentInfo(...)`](#requestconsentinfo)
* [`showPrivacyOptions(...)`](#showprivacyoptions)
* [`getConsentData()`](#getconsentdata)
* [`setCCPAConsent(...)`](#setccpaconsent)
* [`setChildDirected(...)`](#setchilddirected)
* [`requestTrackingAuthorization()`](#requesttrackingauthorization)
* [`createBanner(...)`](#createbanner)
* [`showBanner()`](#showbanner)
* [`hideBanner()`](#hidebanner)
* [`destroyBanner()`](#destroybanner)
* [`loadInterstitial(...)`](#loadinterstitial)
* [`isInterstitialReady()`](#isinterstitialready)
* [`showInterstitial()`](#showinterstitial)
* [`loadRewarded(...)`](#loadrewarded)
* [`isRewardedReady()`](#isrewardedready)
* [`showRewarded()`](#showrewarded)
* [`addListener(string, ...)`](#addlistenerstring-)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

# Capacitor LevelPlay Ads Plugin

Unity LevelPlay (formerly ironSource) mediation SDK for Capacitor.

### CRITICAL: Proper Execution Order
To stay compliant with GDPR / CCPA / COPPA, follow this exact order at app start:
1. **Request Consent**: `await LevelPlayAds.requestConsentInfo(...)`
   Shows the custom consent modal if the user has not decided yet.
2. **Initialize SDK**: `await LevelPlayAds.initialize(...)`
   The SDK boots up using the consent decision gathered in step 1.
3. **Load Ads**: e.g. `await LevelPlayAds.loadInterstitial(...)`
4. **Show Ads**: e.g. `await LevelPlayAds.showInterstitial()`

Ad loading is gated: `initialize()` must have run and a consent decision must
exist, otherwise load calls reject.

### initialize(...)

```typescript
initialize(options: InitializeOptions) => Promise<InitializeResult>
```

Initializes the LevelPlay mediation SDK.
Call after `requestConsentInfo()`.

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`options`** | <code><a href="#initializeoptions">InitializeOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#initializeresult">InitializeResult</a>&gt;</code>

--------------------


### launchTestSuite()

```typescript
launchTestSuite() => Promise<void>
```

Launches the LevelPlay Test Suite for verifying mediation integration.
Debug builds only.

--------------------


### requestConsentInfo(...)

```typescript
requestConsentInfo(options?: ConsentOptions | undefined) => Promise<ConsentData>
```

Requests the current consent decision. If none exists, shows the custom
consent modal. Must be called before loading ads.

| Param         | Type                                                      |
| ------------- | --------------------------------------------------------- |
| **`options`** | <code><a href="#consentoptions">ConsentOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#consentdata">ConsentData</a>&gt;</code>

--------------------


### showPrivacyOptions(...)

```typescript
showPrivacyOptions(options?: ConsentOptions | undefined) => Promise<ConsentData>
```

Re-presents the consent modal so the user can change a prior decision.
Wire this to a button in your app's settings/privacy screen.

| Param         | Type                                                      |
| ------------- | --------------------------------------------------------- |
| **`options`** | <code><a href="#consentoptions">ConsentOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#consentdata">ConsentData</a>&gt;</code>

--------------------


### getConsentData()

```typescript
getConsentData() => Promise<ConsentData>
```

Returns the persisted consent decision without showing any UI.

**Returns:** <code>Promise&lt;<a href="#consentdata">ConsentData</a>&gt;</code>

--------------------


### setCCPAConsent(...)

```typescript
setCCPAConsent(options: { doNotSell: boolean; }) => Promise<void>
```

Sets the CCPA "do not sell my personal information" flag.

| Param         | Type                                 |
| ------------- | ------------------------------------ |
| **`options`** | <code>{ doNotSell: boolean; }</code> |

--------------------


### setChildDirected(...)

```typescript
setChildDirected(options: { isChildDirected: boolean; }) => Promise<void>
```

Sets the COPPA child-directed treatment flag.

| Param         | Type                                       |
| ------------- | ------------------------------------------ |
| **`options`** | <code>{ isChildDirected: boolean; }</code> |

--------------------


### requestTrackingAuthorization()

```typescript
requestTrackingAuthorization() => Promise<TrackingAuthorizationResult>
```

iOS only. Prompts the App Tracking Transparency (ATT) dialog.
No-op on Android (resolves with status `NOT_APPLICABLE`).

**Returns:** <code>Promise&lt;<a href="#trackingauthorizationresult">TrackingAuthorizationResult</a>&gt;</code>

--------------------


### createBanner(...)

```typescript
createBanner(options: BannerOptions) => Promise<void>
```

Creates and loads a banner ad.

| Param         | Type                                                    |
| ------------- | ------------------------------------------------------- |
| **`options`** | <code><a href="#banneroptions">BannerOptions</a></code> |

--------------------


### showBanner()

```typescript
showBanner() => Promise<void>
```

Shows a previously created (and hidden) banner.

--------------------


### hideBanner()

```typescript
hideBanner() => Promise<void>
```

Temporarily hides the banner without destroying it.

--------------------


### destroyBanner()

```typescript
destroyBanner() => Promise<void>
```

Destroys the banner and removes it from the view hierarchy.

--------------------


### loadInterstitial(...)

```typescript
loadInterstitial(options: AdLoadOptions) => Promise<void>
```

Loads an interstitial ad.

| Param         | Type                                                    |
| ------------- | ------------------------------------------------------- |
| **`options`** | <code><a href="#adloadoptions">AdLoadOptions</a></code> |

--------------------


### isInterstitialReady()

```typescript
isInterstitialReady() => Promise<AdReadyResult>
```

Synchronously checks whether an interstitial ad is loaded and ready.

**Returns:** <code>Promise&lt;<a href="#adreadyresult">AdReadyResult</a>&gt;</code>

--------------------


### showInterstitial()

```typescript
showInterstitial() => Promise<void>
```

Shows the loaded interstitial ad.

--------------------


### loadRewarded(...)

```typescript
loadRewarded(options: AdLoadOptions) => Promise<void>
```

Loads a rewarded ad.

| Param         | Type                                                    |
| ------------- | ------------------------------------------------------- |
| **`options`** | <code><a href="#adloadoptions">AdLoadOptions</a></code> |

--------------------


### isRewardedReady()

```typescript
isRewardedReady() => Promise<AdReadyResult>
```

Synchronously checks whether a rewarded ad is loaded and ready.

**Returns:** <code>Promise&lt;<a href="#adreadyresult">AdReadyResult</a>&gt;</code>

--------------------


### showRewarded()

```typescript
showRewarded() => Promise<void>
```

Shows the loaded rewarded ad.

--------------------


### addListener(string, ...)

```typescript
addListener(eventName: string, listenerFunc: (info: any) => void) => Promise<PluginListenerHandle>
```

Listens for native ad events.

### Interstitial events
- `onInterstitialAdLoaded` — `AdInfo`
- `onInterstitialAdLoadFailed` — `AdErrorInfo`
- `onInterstitialAdDisplayed` — `AdInfo`
- `onInterstitialAdDisplayFailed` — `AdErrorInfo`
- `onInterstitialAdClicked` — `AdInfo`
- `onInterstitialAdClosed` — `AdInfo`
- `onInterstitialAdInfoChanged` — `AdInfo`

### Rewarded events
- `onRewardedAdLoaded` — `AdInfo`
- `onRewardedAdLoadFailed` — `AdErrorInfo`
- `onRewardedAdDisplayed` — `AdInfo`
- `onRewardedAdDisplayFailed` — `AdErrorInfo`
- `onRewardedAdClicked` — `AdInfo`
- `onRewardedAdClosed` — `AdInfo`
- `onRewardedAdInfoChanged` — `AdInfo`
- `onRewardedAdRewarded` — `AdRewardEvent`

### Banner events
- `onBannerAdLoaded` — `AdInfo`
- `onBannerAdLoadFailed` — `AdErrorInfo`
- `onBannerAdDisplayed` — `AdInfo`
- `onBannerAdDisplayFailed` — `AdErrorInfo`
- `onBannerAdClicked` — `AdInfo`
- `onBannerAdExpanded` — `AdInfo`
- `onBannerAdCollapsed` — `AdInfo`
- `onBannerAdLeftApplication` — `AdInfo`

### Revenue
- `onAdRevenue` — `AdRevenueEvent` (impression-level ad revenue / ILRD)

### Consent
- `onConsentStatusChanged` — <a href="#consentdata">`ConsentData`</a>

| Param              | Type                                |
| ------------------ | ----------------------------------- |
| **`eventName`**    | <code>string</code>                 |
| **`listenerFunc`** | <code>(info: any) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### Interfaces


#### InitializeResult

| Prop         | Type                | Description                            |
| ------------ | ------------------- | -------------------------------------- |
| **`status`** | <code>string</code> | `INITIALIZED_SUCCESSFULLY` on success. |


#### InitializeOptions

| Prop            | Type                 | Description                                                                                              |
| --------------- | -------------------- | -------------------------------------------------------------------------------------------------------- |
| **`appKey`**    | <code>string</code>  | LevelPlay app key from the Unity LevelPlay dashboard. Required.                                          |
| **`userId`**    | <code>string</code>  | Optional publisher-defined user identifier (used for server-to-server rewarded callbacks and reporting). |
| **`isTesting`** | <code>boolean</code> | Enables LevelPlay test/integration mode. Set false before publishing. Default: false                     |


#### ConsentData

| Prop                | Type                                            | Description                                                                                                                                         |
| ------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`status`**        | <code>'UNKNOWN' \| 'GRANTED' \| 'DENIED'</code> | The recorded consent decision. - `UNKNOWN` — no decision yet (fresh install). - `GRANTED` — user granted consent. - `DENIED` — user denied consent. |
| **`granted`**       | <code>boolean</code>                            | Simplified boolean: true when `status === 'GRANTED'`.                                                                                               |
| **`canRequestAds`** | <code>boolean</code>                            | True when ads may be requested (a decision exists, granted or denied).                                                                              |


#### ConsentOptions

| Prop                    | Type                  | Description                                                                                                  |
| ----------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------ |
| **`privacyPolicyUrl`**  | <code>string</code>   | URL opened when the user taps the privacy policy link in the modal.                                          |
| **`title`**             | <code>string</code>   | Custom modal title.                                                                                          |
| **`message`**           | <code>string</code>   | Custom modal body text.                                                                                      |
| **`acceptButtonText`**  | <code>string</code>   | Label for the accept/grant button.                                                                           |
| **`declineButtonText`** | <code>string</code>   | Label for the decline/deny button.                                                                           |
| **`networks`**          | <code>string[]</code> | Mediation network keys the consent decision should be applied to. When omitted, consent is applied globally. |


#### TrackingAuthorizationResult

| Prop         | Type                | Description                                                                                            |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------ |
| **`status`** | <code>string</code> | iOS ATT status: `AUTHORIZED`, `DENIED`, `RESTRICTED`, `NOT_DETERMINED`, or `NOT_APPLICABLE` (Android). |


#### BannerOptions

| Prop             | Type                                                                                  | Description                                                                             |
| ---------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **`adUnitId`**   | <code>string</code>                                                                   | LevelPlay banner ad unit ID. Required.                                                  |
| **`adSize`**     | <code>'BANNER' \| 'LARGE' \| 'MEDIUM_RECTANGLE' \| 'LEADERBOARD' \| 'ADAPTIVE'</code> | Banner size. Default: `ADAPTIVE`.                                                       |
| **`position`**   | <code>'TOP' \| 'BOTTOM'</code>                                                        | Banner position on screen. Default: `BOTTOM`.                                           |
| **`isAutoShow`** | <code>boolean</code>                                                                  | Show the banner automatically once loaded. Default: true.                               |
| **`isOverlap`**  | <code>boolean</code>                                                                  | If true the banner overlaps the webview; if false it pushes the webview. Default: true. |


#### AdLoadOptions

| Prop           | Type                | Description                     |
| -------------- | ------------------- | ------------------------------- |
| **`adUnitId`** | <code>string</code> | LevelPlay ad unit ID. Required. |


#### AdReadyResult

| Prop          | Type                 | Description                                  |
| ------------- | -------------------- | -------------------------------------------- |
| **`isReady`** | <code>boolean</code> | True when the ad is loaded and can be shown. |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |

</docgen-api>
