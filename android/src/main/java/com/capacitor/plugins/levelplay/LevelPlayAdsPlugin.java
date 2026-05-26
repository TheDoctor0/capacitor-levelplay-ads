package com.capacitor.plugins.levelplay;

import android.app.Activity;
import android.app.Application;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowInsets;
import android.view.WindowInsetsController;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.capacitor.plugins.levelplay.banner.BannerExecutor;
import com.capacitor.plugins.levelplay.consent.ConsentCallback;
import com.capacitor.plugins.levelplay.consent.ConsentProvider;
import com.capacitor.plugins.levelplay.consent.ConsentStatus;
import com.capacitor.plugins.levelplay.consent.CustomModalConsentProvider;
import com.capacitor.plugins.levelplay.consent.InMobiConsentProvider;
import com.capacitor.plugins.levelplay.consent.UsercentricsConsentProvider;
import com.capacitor.plugins.levelplay.interstitial.InterstitialExecutor;
import com.capacitor.plugins.levelplay.privacy.PrivacyExecutor;
import com.capacitor.plugins.levelplay.rewarded.RewardedExecutor;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.android.gms.ads.identifier.AdvertisingIdClient;

import com.unity3d.mediation.LevelPlay;
import com.unity3d.mediation.impression.LevelPlayImpressionDataListener;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "LevelPlayAds")
public class LevelPlayAdsPlugin extends Plugin implements LevelPlayPluginBridge {

    private LevelPlayAdsImpl coreImplementation;
    private ConsentProvider consentProvider;
    private PrivacyExecutor privacyExecutor;
    private BannerExecutor bannerExecutor;
    private InterstitialExecutor interstitialExecutor;
    private RewardedExecutor rewardedExecutor;

    private boolean impressionListenerRegistered = false;

    /** Global impression-level revenue listener (ILRD). */
    private final LevelPlayImpressionDataListener impressionListener =
            data -> notifyListeners("onAdRevenue", AdJsonUtil.impressionToJS(data));

    /** Retained so the API-35 callbacks can be unregistered on destroy. */
    private Application registeredApplication;
    private Application.ActivityLifecycleCallbacks api35Callbacks;

    @Override
    public void load() {
        super.load();

        coreImplementation = new LevelPlayAdsImpl();
        consentProvider = buildConsentProvider();
        privacyExecutor = new PrivacyExecutor();
        bannerExecutor = new BannerExecutor(this);
        interstitialExecutor = new InterstitialExecutor(this);
        rewardedExecutor = new RewardedExecutor(this);

        if (getActivity() != null) {
            applyAPI35WorkaroundIfNeeded(getActivity().getApplication());
        }
    }

    /**
     * Picks the consent provider based on the {@code levelplay_cmp_provider}
     * string resource, written by scripts/levelplay-manifest.js from the host
     * app's package.json. Defaults to InMobi when the resource is missing —
     * matches the manifest script's default and gives TCF-compliant behavior
     * out of the box.
     */
    private ConsentProvider buildConsentProvider() {
        int id = getContext().getResources().getIdentifier(
                "levelplay_cmp_provider", "string", getContext().getPackageName());
        String name = id == 0 ? "usercentrics" : getContext().getString(id);
        if ("custom".equalsIgnoreCase(name)) {
            return new CustomModalConsentProvider(getContext());
        }
        if ("inmobi".equalsIgnoreCase(name)) {
            return new InMobiConsentProvider(getContext());
        }
        return new UsercentricsConsentProvider(getContext());
    }

    // --- API-35 edge-to-edge workaround ----------------------------------

    /**
     * On Android 15+ (API 35) fullscreen ad activities can leave the system
     * bars drawn over the creative. The fix is OS-level, so it is applied to
     * any non-Capacitor activity — interstitial and rewarded ads are always
     * fullscreen and the mediated network's activity class varies per network.
     */
    private void applyAPI35WorkaroundIfNeeded(Application application) {
        if (Build.VERSION.SDK_INT < 35) {
            return;
        }
        final String hostActivity = getActivity() != null
                ? getActivity().getClass().getName() : "";

        api35Callbacks = new Application.ActivityLifecycleCallbacks() {
            @Override public void onActivityCreated(@NonNull Activity activity, @Nullable Bundle bundle) {}
            @Override public void onActivityStarted(@NonNull Activity activity) {
                applyAPI35WorkaroundToActivity(activity, hostActivity);
            }
            @Override public void onActivityResumed(@NonNull Activity activity) {
                applyAPI35WorkaroundToActivity(activity, hostActivity);
            }
            @Override public void onActivityPaused(@NonNull Activity activity) {}
            @Override public void onActivityStopped(@NonNull Activity activity) {}
            @Override public void onActivitySaveInstanceState(@NonNull Activity activity, @NonNull Bundle outState) {}
            @Override public void onActivityDestroyed(@NonNull Activity activity) {}
        };
        registeredApplication = application;
        application.registerActivityLifecycleCallbacks(api35Callbacks);
    }

    @RequiresApi(api = Build.VERSION_CODES.R)
    private static void applyAPI35WorkaroundToActivity(Activity activity, String hostActivity) {
        // Leave the Capacitor host activity untouched.
        if (activity.getClass().getName().equals(hostActivity)) {
            return;
        }
        WindowInsetsController controller = activity.getWindow().getInsetsController();
        if (controller != null) {
            controller.hide(WindowInsets.Type.systemBars());
            controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_DEFAULT);
        }
    }

    // --- Core ------------------------------------------------------------

    @PluginMethod
    public void initialize(PluginCall call) {
        String appKey = call.getString("appKey");
        if (appKey == null || appKey.isEmpty()) {
            call.reject("appKey is required to initialize LevelPlay.");
            return;
        }
        String userId = call.getString("userId");
        Boolean isTesting = call.getBoolean("isTesting", false);

        coreImplementation.initialize(
                getContext(), appKey, userId, isTesting != null && isTesting,
                new LevelPlayAdsImpl.InitCallback() {
                    @Override
                    public void onSuccess() {
                        if (!impressionListenerRegistered) {
                            LevelPlay.addImpressionDataListener(impressionListener);
                            impressionListenerRegistered = true;
                        }
                        JSObject ret = new JSObject();
                        ret.put("status", "INITIALIZED_SUCCESSFULLY");
                        call.resolve(ret);
                    }

                    @Override
                    public void onError(String error) {
                        call.reject("LevelPlay init failed: " + error);
                    }
                });
    }

    @PluginMethod
    public void launchTestSuite(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("No foreground activity.");
            return;
        }
        LevelPlay.launchTestSuite(activity);
        call.resolve();
    }

    @PluginMethod
    public void setDynamicUserId(PluginCall call) {
        String userId = call.getString("userId");
        if (userId == null || userId.isEmpty()) {
            call.reject("userId is required.");
            return;
        }
        LevelPlay.setDynamicUserId(userId);
        call.resolve();
    }

    // --- Consent & privacy ----------------------------------------------

    @PluginMethod
    public void requestConsentInfo(PluginCall call) {
        final List<String> networks = readNetworks(call);
        consentProvider.requestConsent(getActivity(), call.getData(), new ConsentCallback() {
            @Override
            public void onDecision(boolean granted) {
                privacyExecutor.setUserConsent(granted, networks);
                JSObject data = consentProvider.getConsentData();
                notifyListeners("onConsentStatusChanged", data);
                call.resolve(data);
            }

            @Override
            public void onError(String error) {
                call.reject(error);
            }
        });
    }

    @PluginMethod
    public void showPrivacyOptions(PluginCall call) {
        final List<String> networks = readNetworks(call);
        consentProvider.showPrivacyOptions(getActivity(), call.getData(), new ConsentCallback() {
            @Override
            public void onDecision(boolean granted) {
                privacyExecutor.setUserConsent(granted, networks);
                JSObject data = consentProvider.getConsentData();
                notifyListeners("onConsentStatusChanged", data);
                call.resolve(data);
            }

            @Override
            public void onError(String error) {
                call.reject(error);
            }
        });
    }

    @PluginMethod
    public void getConsentData(PluginCall call) {
        call.resolve(consentProvider.getConsentData());
    }

    /**
     * Clears the stored consent decision so the next requestConsentInfo() call
     * re-shows the modal. Intended for QA / settings-screen "reset" flows.
     */
    @PluginMethod
    public void resetConsent(PluginCall call) {
        consentProvider.resetConsent();
        JSObject data = consentProvider.getConsentData();
        notifyListeners("onConsentStatusChanged", data);
        call.resolve(data);
    }

    @PluginMethod
    public void setCCPAConsent(PluginCall call) {
        Boolean doNotSell = call.getBoolean("doNotSell", false);
        privacyExecutor.setCCPA(doNotSell != null && doNotSell);
        call.resolve();
    }

    @PluginMethod
    public void setChildDirected(PluginCall call) {
        Boolean isChildDirected = call.getBoolean("isChildDirected", false);
        privacyExecutor.setCOPPA(isChildDirected != null && isChildDirected);
        call.resolve();
    }

    /**
     * iOS App Tracking Transparency has no Android equivalent — resolve with
     * {@code NOT_APPLICABLE} so cross-platform callers can branch uniformly.
     */
    @PluginMethod
    public void requestTrackingAuthorization(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("status", "NOT_APPLICABLE");
        call.resolve(ret);
    }

    /**
     * Returns the Google Advertising ID (GAID) + limit-ad-tracking flag.
     * Runs off the main thread — {@code AdvertisingIdClient} performs a
     * synchronous IPC to Google Play services.
     */
    @PluginMethod
    public void getAdvertisingId(PluginCall call) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AdvertisingIdClient.Info info = AdvertisingIdClient.getAdvertisingIdInfo(getContext());
                JSObject ret = new JSObject();
                ret.put("id", info.getId() != null ? info.getId() : "");
                ret.put("limited", info.isLimitAdTrackingEnabled());
                call.resolve(ret);
            } catch (Exception e) {
                call.reject("Failed to fetch Advertising ID: " + e.getMessage());
            }
        });
    }

    // --- Banner ----------------------------------------------------------

    @PluginMethod
    public void createBanner(PluginCall call) {
        if (!ensureReady(call)) return;
        bannerExecutor.createBanner(call);
    }

    @PluginMethod
    public void showBanner(PluginCall call) {
        bannerExecutor.showBanner(call);
    }

    @PluginMethod
    public void hideBanner(PluginCall call) {
        bannerExecutor.hideBanner(call);
    }

    @PluginMethod
    public void destroyBanner(PluginCall call) {
        bannerExecutor.destroyBanner(call);
    }

    @PluginMethod
    public void updateBannerStyle(PluginCall call) {
        bannerExecutor.updateBannerStyle(call);
    }

    // --- Interstitial ----------------------------------------------------

    @PluginMethod
    public void loadInterstitial(PluginCall call) {
        if (!ensureReady(call)) return;
        final boolean autoShow = Boolean.TRUE.equals(call.getBoolean("autoShow", false));
        interstitialExecutor.load(getActivity(), call, new ActionCallback() {
            @Override public void onSuccess() {
                if (autoShow) {
                    interstitialExecutor.show(getActivity(), new ActionCallback() {
                        @Override public void onSuccess() { call.resolve(); }
                        @Override public void onError(String error) {
                            call.reject("Auto-show failed: " + error);
                        }
                    });
                } else {
                    call.resolve();
                }
            }
            @Override public void onError(String error) { call.reject("Failed: " + error); }
        });
    }

    @PluginMethod
    public void isInterstitialReady(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("isReady", interstitialExecutor.isReady());
        call.resolve(ret);
    }

    @PluginMethod
    public void showInterstitial(PluginCall call) {
        interstitialExecutor.show(getActivity(), new ActionCallback() {
            @Override public void onSuccess() { call.resolve(); }
            @Override public void onError(String error) { call.reject(error); }
        });
    }

    // --- Rewarded --------------------------------------------------------

    @PluginMethod
    public void loadRewarded(PluginCall call) {
        if (!ensureReady(call)) return;
        final boolean autoShow = Boolean.TRUE.equals(call.getBoolean("autoShow", false));
        rewardedExecutor.load(getActivity(), call, new ActionCallback() {
            @Override public void onSuccess() {
                if (autoShow) {
                    rewardedExecutor.show(getActivity(), new ActionCallback() {
                        @Override public void onSuccess() { call.resolve(); }
                        @Override public void onError(String error) {
                            call.reject("Auto-show failed: " + error);
                        }
                    });
                } else {
                    call.resolve();
                }
            }
            @Override public void onError(String error) { call.reject("Failed to load rewarded ad: " + error); }
        });
    }

    @PluginMethod
    public void isRewardedReady(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("isReady", rewardedExecutor.isReady());
        call.resolve(ret);
    }

    @PluginMethod
    public void showRewarded(PluginCall call) {
        rewardedExecutor.show(getActivity(), new ActionCallback() {
            @Override public void onSuccess() { call.resolve(); }
            @Override public void onError(String error) { call.reject(error); }
        });
    }

    // --- Internals -------------------------------------------------------

    /**
     * Gate every load/create call on init + a recorded consent decision.
     * Returns {@code false} (and rejects the call) when not ready.
     */
    private boolean ensureReady(PluginCall call) {
        if (!coreImplementation.isInitialized()) {
            call.reject("LevelPlay is not initialized. Call initialize() first.");
            return false;
        }
        if (consentProvider.getStatus() == ConsentStatus.UNKNOWN) {
            call.reject("Consent decision required. Call requestConsentInfo() before loading ads.");
            return false;
        }
        return true;
    }

    private List<String> readNetworks(PluginCall call) {
        List<String> out = new ArrayList<>();
        try {
            JSArray arr = call.getArray("networks");
            if (arr != null) {
                for (Object o : arr.toList()) {
                    if (o != null) out.add(o.toString());
                }
            }
        } catch (org.json.JSONException ignored) {
            // Malformed networks array — fall back to the global consent flag.
        }
        return out;
    }

    // --- LevelPlayPluginBridge -----------------------------------------

    @Override
    public void fireEvent(String eventName, JSObject data) {
        notifyListeners(eventName, data);
    }

    @Override
    public android.view.View getWebView() {
        return getBridge() != null ? getBridge().getWebView() : null;
    }

    // --- Orientation / configuration changes -----------------------------

    /**
     * Emit {@code onOrientationChanged} on rotation so JS can re-layout
     * ad-adjacent UI. The host AndroidManifest entry must include
     * {@code android:configChanges="orientation|screenSize"} for Capacitor
     * to forward the callback here.
     */
    @Override
    public void handleOnConfigurationChanged(Configuration newConfig) {
        super.handleOnConfigurationChanged(newConfig);
        JSObject data = new JSObject();
        data.put("orientation",
                newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE
                        ? "LANDSCAPE" : "PORTRAIT");
        notifyListeners("onOrientationChanged", data);
    }

    /**
     * Tear down the banner overlay, drop the global impression listener and
     * unregister the API-35 lifecycle callbacks so nothing leaks the activity.
     */
    @Override
    protected void handleOnDestroy() {
        if (bannerExecutor != null) {
            bannerExecutor.destroyBanner(null);
        }
        if (impressionListenerRegistered) {
            LevelPlay.removeImpressionDataListener(impressionListener);
            impressionListenerRegistered = false;
        }
        if (registeredApplication != null && api35Callbacks != null) {
            registeredApplication.unregisterActivityLifecycleCallbacks(api35Callbacks);
            api35Callbacks = null;
            registeredApplication = null;
        }
        super.handleOnDestroy();
    }
}
