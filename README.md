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
- **IAB TCF v2.2 consent (default):** Bundles the InMobi Choice CMP for
  GDPR-compliant consent — collects a TCF string and writes the standard
  `IABTCF_*` keys every mediation adapter reads. Swappable for a built-in
  non-TCF modal when shipping outside the EU.
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
    "userTrackingDescription": "This identifier is used to deliver personalized ads to you.",
    "consentProvider": "inmobi",
    "inmobi": {
      "pCode": "YOUR_PCODE_HERE"
    }
  }
}
```
Supported network keys: `admob`, `applovin`, `unityads`, `vungle`, `meta`,
`mintegral`, `pangle`.

### Consent provider

The `consentProvider` key picks how the plugin collects GDPR consent:

| Value | What it does | When to use |
|---|---|---|
| `inmobi` (default) | Bundles InMobi Choice CMP. IAB TCF v2.2 compliant. Auto-shows the CMP on first launch and writes the standard `IABTCF_*` keys to `SharedPreferences` (Android) / `NSUserDefaults` (iOS). | Apps shipped in the EU/EEA. Required for GDPR audit compliance. |
| `custom` | Built-in alert dialog. Writes a permissive `gdprApplies=0` stub. **Not** TCF compliant. | Apps that ship outside the EU only, or where you already integrate a different CMP. |

When `consentProvider: "inmobi"`, set `levelplay.inmobi.pCode` to the pCode from
your [InMobi Choice](https://choice.inmobi.com/) workspace (strip the leading
`p-`). Optionally set `levelplay.inmobi.packageId` to override the property
package id; defaults to the app's `applicationId`/bundle id.

The CMP is initialized lazily when your JS code calls
`LevelPlayAds.requestConsentInfo()`. Under `inmobi` the call resolves once
the user has interacted with the CMP UI; subsequent calls return the stored
decision without re-showing the dialog.

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

### Manual alternative

If you'd rather not run the hook, do the equivalent edits yourself:

**Android** — add the adapters you need to `android/app/build.gradle`:
```gradle
dependencies {
    implementation 'com.unity3d.ads-mediation:admob-adapter:4.3.46'
    implementation 'com.unity3d.ads-mediation:applovin-adapter:4.3.39'
    implementation 'com.unity3d.ads-mediation:unityads-adapter:4.3.44'
    // …one per network from the supported list above
}
```

**iOS** — add the matching pods to `ios/App/Podfile` inside the `App` target:
```ruby
pod 'IronSourceAdMobAdapter'
pod 'IronSourceAppLovinAdapter'
pod 'IronSourceUnityAdsAdapter'
```

**iOS — `ios/App/App/Info.plist`** (required for ATT prompt + attribution):

```xml
<key>NSUserTrackingUsageDescription</key>
<string>This identifier will be used to deliver personalized ads to you.</string>
<key>SKAdNetworkItems</key>
<array>
    <dict><key>SKAdNetworkIdentifier</key><string>su67r6k2v3.skadnetwork</string></dict> <!-- IronSource -->
    <dict><key>SKAdNetworkIdentifier</key><string>cstr6suwn9.skadnetwork</string></dict> <!-- AdMob -->
    <dict><key>SKAdNetworkIdentifier</key><string>ludvb6z3bs.skadnetwork</string></dict> <!-- AppLovin -->
    <dict><key>SKAdNetworkIdentifier</key><string>4dzt52r2t5.skadnetwork</string></dict> <!-- UnityAds -->
    <!-- Vungle: gta9lk7p23.skadnetwork -->
    <!-- Meta: v9wttpbfk9.skadnetwork, n38lu8286q.skadnetwork -->
    <!-- Mintegral: kbd757ywx3.skadnetwork -->
    <!-- Pangle: 238da6jt44.skadnetwork, 22mmun2rn5.skadnetwork -->
</array>
```

Without `NSUserTrackingUsageDescription` Apple **will reject** the build (the
IronSource SDK calls `ATTrackingManager`). Without the matching `SKAdNetwork`
IDs install attribution silently fails and mediation revenue reports go dark.

Adapter versions are pinned in `scripts/levelplay-manifest.js` — check that
file for the current set if you're maintaining the edits by hand.

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

  // 4. Pre-load an interstitial. Use AdEvent constants instead of raw
  //    event-name strings so typos surface at compile time.
  LevelPlayAds.addListener(AdEvent.InterstitialLoaded, () => {
    console.log('Interstitial ready.');
  });
  LevelPlayAds.addListener(AdEvent.InterstitialClosed, () => {
    console.log('Interstitial closed — next ad is auto-reloading.');
  });

  // `autoShow: true` chains show() automatically once the ad loads —
  // the same promise resolves on display or rejects on display failure.
  await LevelPlayAds.loadInterstitial({
    adUnitId: 'YOUR_INTERSTITIAL_AD_UNIT',
    autoShow: false,
  });
}

async function showInterstitial() {
  const { isReady } = await LevelPlayAds.isInterstitialReady();
  if (isReady) {
    await LevelPlayAds.showInterstitial();
  }
}

// Optional: a sticky bottom-right banner that flips to bottom-left on rotation.
async function bannerWithRotation() {
  await LevelPlayAds.createBanner({
    adUnitId: 'YOUR_BANNER_AD_UNIT',
    adSize: 'ADAPTIVE',
    position: 'BOTTOM_RIGHT',
    isOverlap: false, // Android only — pushes the WebView up by banner height
  });

  LevelPlayAds.addListener(AdEvent.OrientationChanged, ({ orientation }) => {
    LevelPlayAds.updateBannerStyle({
      position: orientation === 'LANDSCAPE' ? 'BOTTOM_LEFT' : 'BOTTOM_RIGHT',
    });
  });
}
```

> Import `AdEvent` alongside `LevelPlayAds`:
> ```ts
> import { LevelPlayAds, AdEvent } from 'capacitor-levelplay-ads';
> ```
>
> Position and size strings are case- and separator-insensitive at the JS
> layer — `'top-left'`, `'topLeft'` and `'TOP_LEFT'` all canonicalize to
> `TOP_LEFT` before reaching the native side.

> ⚠️ `initialize` and `requestConsentInfo` must complete **before** any
> `loadInterstitial` / `loadRewarded` / `createBanner` call — ad loads are
> rejected otherwise.

---

## 🔗 Server-to-Server (S2S) Reward Verification

LevelPlay supports server-to-server callbacks for rewarded ads — your backend
receives an HTTP request from LevelPlay's servers whenever a user earns a reward.
Use `setDynamicUserId()` to attach a verifiable token so your server can match
the callback to the right user/session.

```ts
import { LevelPlayAds, AdEvent } from 'capacitor-levelplay-ads';

// Set a user-specific token before showing the rewarded ad.
// This value is included in the S2S callback as the `dynamicUserId` parameter.
await LevelPlayAds.setDynamicUserId({ userId: 'user_12345' });

// You can encode multiple fields if needed:
const payload = btoa(JSON.stringify({ uid: 'user_12345', txn: 'abc-def' }));
await LevelPlayAds.setDynamicUserId({ userId: payload });

// Load and show the rewarded ad — the active userId at show-time is sent in the callback.
await LevelPlayAds.loadRewarded({ adUnitId: 'YOUR_REWARDED_AD_UNIT' });
const { isReady } = await LevelPlayAds.isRewardedReady();
if (isReady) {
  await LevelPlayAds.showRewarded();
}

// Listen for the client-side reward event as a fallback.
LevelPlayAds.addListener(AdEvent.RewardedAdRewarded, (reward) => {
  console.log('Reward earned:', reward);
});
```

### S2S callback flow

1. User watches a rewarded ad.
2. LevelPlay fires an HTTP GET to your configured callback URL with query
   parameters including `dynamicUserId`.
3. Your server decodes the token and credits the user.

Configure your S2S callback URL in the
[LevelPlay dashboard](https://platform.ironsrc.com/) under
**Ad Units → Rewarded → Server-to-Server Callbacks**.

> `setDynamicUserId()` can be called multiple times — the value active when
> `showRewarded()` executes is the one LevelPlay includes in the callback.
> Call it before each ad show if the token changes per session or transaction.

---

## ⚠️ Important Notices

### 1. iOS integration paths
CocoaPods is the primary, supported iOS integration path — it pulls the
IronSource SDK via the podspec. Swift Package Manager is secondary; see
`Package.swift` for details. Without the SDK the plugin still builds: all
native SDK code is guarded and degrades to no-ops.

## API

<docgen-index>

* [`initialize(...)`](#initialize)
* [`launchTestSuite()`](#launchtestsuite)
* [`requestConsentInfo(...)`](#requestconsentinfo)
* [`showPrivacyOptions(...)`](#showprivacyoptions)
* [`getConsentData()`](#getconsentdata)
* [`resetConsent()`](#resetconsent)
* [`setCCPAConsent(...)`](#setccpaconsent)
* [`setChildDirected(...)`](#setchilddirected)
* [`requestTrackingAuthorization()`](#requesttrackingauthorization)
* [`getAdvertisingId()`](#getadvertisingid)
* [`setDynamicUserId(...)`](#setdynamicuserid)
* [`createBanner(...)`](#createbanner)
* [`showBanner()`](#showbanner)
* [`hideBanner()`](#hidebanner)
* [`destroyBanner()`](#destroybanner)
* [`updateBannerStyle(...)`](#updatebannerstyle)
* [`loadInterstitial(...)`](#loadinterstitial)
* [`isInterstitialReady()`](#isinterstitialready)
* [`showInterstitial()`](#showinterstitial)
* [`loadRewarded(...)`](#loadrewarded)
* [`isRewardedReady()`](#isrewardedready)
* [`showRewarded()`](#showrewarded)
* [`addListener(string, ...)`](#addlistenerstring-)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

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


### resetConsent()

```typescript
resetConsent() => Promise<ConsentData>
```

Clears the stored consent decision so the next `requestConsentInfo()`
re-shows the modal. Useful for QA flows and a "reset privacy choice"
button in your settings screen.

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


### getAdvertisingId()

```typescript
getAdvertisingId() => Promise<AdvertisingIdResult>
```

Returns the platform advertising identifier:

- **Android** — Google Advertising ID (GAID), via Play Services.
  `limited` is the `LimitAdTracking` flag.
- **iOS** — IDFA, via `ASIdentifierManager`. The OS returns an all-zero
  UUID until the user grants App Tracking Transparency authorization, in
  which case `limited` is true and `id` is `"00000000-0000-0000-0000-000000000000"`.

Call `requestTrackingAuthorization()` first on iOS to get a real value.

**Returns:** <code>Promise&lt;<a href="#advertisingidresult">AdvertisingIdResult</a>&gt;</code>

--------------------


### setDynamicUserId(...)

```typescript
setDynamicUserId(options: { userId: string; }) => Promise<void>
```

Sets the dynamic user ID forwarded in server-to-server (S2S) reward
callbacks. Call before `showRewarded()` to tag each reward with a
verifiable token (e.g. a transaction ID or session nonce).

Can be changed between ad shows — the value active at show time is
the one included in the S2S callback.

| Param         | Type                             |
| ------------- | -------------------------------- |
| **`options`** | <code>{ userId: string; }</code> |

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


### updateBannerStyle(...)

```typescript
updateBannerStyle(options: BannerStyleOptions) => Promise<void>
```

Reposition or restyle the active banner without destroying it.
Only the provided fields change; omitted fields keep their current value.
`isOverlap` only affects Android — iOS always overlays the WebView.

| Param         | Type                                                              |
| ------------- | ----------------------------------------------------------------- |
| **`options`** | <code><a href="#bannerstyleoptions">BannerStyleOptions</a></code> |

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
addListener(eventName: AdEventName | string, listenerFunc: (info: any) => void) => Promise<PluginListenerHandle>
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
- `onConsentStatusChanged` — `ConsentData`

### Orientation
- `onOrientationChanged` — `OrientationChangedEvent`

Prefer the typed `AdEvent` constants (e.g. `AdEvent.InterstitialLoaded`)
over raw strings for compile-time safety.

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

| Prop                | Type                                                        | Description                                                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`status`**        | <code>'UNKNOWN' \| 'GRANTED' \| 'DENIED'</code>             | The recorded consent decision. - `UNKNOWN` — no decision yet (fresh install). - `GRANTED` — user granted consent. - `DENIED` — user denied consent.                                             |
| **`granted`**       | <code>boolean</code>                                        | Simplified boolean: true when `status === 'GRANTED'`.                                                                                                                                           |
| **`canRequestAds`** | <code>boolean</code>                                        | True when ads may be requested (a decision exists, granted or denied).                                                                                                                          |
| **`provider`**      | <code><a href="#consentprovider">ConsentProvider</a></code> | Which provider produced this decision: `inmobi` or `custom`. Useful for deciding whether to trust the `tcString` field.                                                                         |
| **`tcString`**      | <code>string</code>                                         | IAB TCF v2.2 consent string. Populated only when the `inmobi` provider is active and the user has interacted with the CMP. Undefined under `custom` (which doesn't produce a real TCF payload). |


#### ConsentOptions

| Prop                    | Type                  | Description                                                                                                                                                                                          |
| ----------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`privacyPolicyUrl`**  | <code>string</code>   | URL opened when the user taps the privacy policy link in the modal. Only used by the `custom` consent provider — ignored under InMobi (which renders its own privacy policy link inside the CMP UI). |
| **`title`**             | <code>string</code>   | Custom modal title. `custom` provider only.                                                                                                                                                          |
| **`message`**           | <code>string</code>   | Custom modal body text. `custom` provider only.                                                                                                                                                      |
| **`acceptButtonText`**  | <code>string</code>   | Label for the accept/grant button. `custom` provider only.                                                                                                                                           |
| **`declineButtonText`** | <code>string</code>   | Label for the decline/deny button. `custom` provider only.                                                                                                                                           |
| **`networks`**          | <code>string[]</code> | Mediation network keys the consent decision should be applied to. When omitted, consent is applied globally.                                                                                         |


#### TrackingAuthorizationResult

| Prop         | Type                | Description                                                                                            |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------ |
| **`status`** | <code>string</code> | iOS ATT status: `AUTHORIZED`, `DENIED`, `RESTRICTED`, `NOT_DETERMINED`, or `NOT_APPLICABLE` (Android). |


#### AdvertisingIdResult

| Prop          | Type                 | Description                                                                                                                                               |
| ------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`id`**      | <code>string</code>  | The advertising identifier. Empty string when unavailable; on iOS the all-zeros UUID `"00000000-0000-0000-0000-000000000000"` when ATT is not authorized. |
| **`limited`** | <code>boolean</code> | True when the user has limited / opted out of ad tracking. Android: `LimitAdTracking` flag. iOS: true when ATT is not authorized.                         |


#### BannerOptions

| Prop                | Type                                                                                  | Description                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **`adUnitId`**      | <code>string</code>                                                                   | LevelPlay banner ad unit ID. Required.                                                                                                  |
| **`adSize`**        | <code>'BANNER' \| 'LARGE' \| 'MEDIUM_RECTANGLE' \| 'LEADERBOARD' \| 'ADAPTIVE'</code> | Banner size. Default: `ADAPTIVE`.                                                                                                       |
| **`position`**      | <code><a href="#bannerposition">BannerPosition</a></code>                             | Banner position on screen. Default: `BOTTOM`.                                                                                           |
| **`isAutoShow`**    | <code>boolean</code>                                                                  | Show the banner automatically once loaded. Default: true.                                                                               |
| **`isOverlap`**     | <code>boolean</code>                                                                  | If true the banner overlaps the webview; if false it pushes the webview. Android only — iOS always overlays the WebView. Default: true. |
| **`retryInterval`** | <code>number</code>                                                                   | Minimum delay between consecutive load() calls, in **milliseconds**. Throttles invalid traffic. Default: 5000 (5 seconds).              |


#### BannerStyleOptions

| Prop            | Type                                                      | Description                                  |
| --------------- | --------------------------------------------------------- | -------------------------------------------- |
| **`position`**  | <code><a href="#bannerposition">BannerPosition</a></code> | New banner position.                         |
| **`isOverlap`** | <code>boolean</code>                                      | Android-only overlap flag. iOS ignores this. |


#### AdLoadOptions

| Prop                | Type                 | Description                                                                                                                                                          |
| ------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`adUnitId`**      | <code>string</code>  | LevelPlay ad unit ID. Required.                                                                                                                                      |
| **`autoShow`**      | <code>boolean</code> | If true, the ad is shown immediately after a successful load. The returned promise then resolves on display (or rejects with "Auto-show failed: …"). Default: false. |
| **`retryInterval`** | <code>number</code>  | Minimum delay between consecutive load() calls, in **milliseconds**. Throttles invalid traffic. Default: 5000 (5 seconds).                                           |


#### AdReadyResult

| Prop          | Type                 | Description                                  |
| ------------- | -------------------- | -------------------------------------------- |
| **`isReady`** | <code>boolean</code> | True when the ad is loaded and can be shown. |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### Type Aliases


#### ConsentProvider

Which consent UI the plugin shows. Configured at install time via
`levelplay.consentProvider` in the host app's package.json — not via JS.

- `inmobi` (default): IAB TCF v2.2 compliant. Bundles InMobi Choice CMP.
  Requires `levelplay.inmobi.pCode` from https://choice.inmobi.com/.
- `custom`: built-in alert dialog. Not TCF compliant; do not ship to EU.

<code>'inmobi' | 'custom'</code>


#### BannerPosition

Banner placement on screen. `TOP_LEFT` / `TOP_RIGHT` / `BOTTOM_LEFT` /
`BOTTOM_RIGHT` anchor the banner to the corresponding screen corner;
`CENTER` places it in the middle.

<code>'TOP' | 'BOTTOM' | 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT' | 'CENTER'</code>


#### AdEventName

<code>(typeof AdEvent)[keyof typeof AdEvent]</code>

</docgen-api>
