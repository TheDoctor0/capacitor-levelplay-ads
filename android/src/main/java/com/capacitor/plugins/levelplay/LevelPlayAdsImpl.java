package com.capacitor.plugins.levelplay;

import android.content.Context;

import com.getcapacitor.Logger;
import com.unity3d.mediation.LevelPlay;
import com.unity3d.mediation.LevelPlayConfiguration;
import com.unity3d.mediation.LevelPlayInitError;
import com.unity3d.mediation.LevelPlayInitListener;
import com.unity3d.mediation.LevelPlayInitRequest;

import java.util.ArrayList;
import java.util.List;

/**
 * Core LevelPlay lifecycle: SDK initialization and init-state tracking. Ad
 * requests are gated on {@link #isInitialized()} by the plugin class.
 */
public class LevelPlayAdsImpl {

    private static final String TAG = "LevelPlayAds";

    private volatile boolean initialized = false;
    private volatile boolean initializing = false;

    /**
     * Callers that arrived while a previous init() was in flight. All get
     * notified with the same outcome when the SDK reports back, so duplicate
     * calls (StrictMode, hot reload, parallel page loads) don't reject.
     */
    private final List<InitCallback> pendingCallbacks = new ArrayList<>();

    public boolean isInitialized() {
        return initialized;
    }

    public interface InitCallback {
        void onSuccess();
        void onError(String error);
    }

    public void initialize(Context context, String appKey, String userId, boolean isTesting,
                           final InitCallback callback) {
        synchronized (pendingCallbacks) {
            if (initialized) {
                callback.onSuccess();
                return;
            }
            if (initializing) {
                // Piggyback on the in-flight init instead of rejecting.
                pendingCallbacks.add(callback);
                return;
            }
            initializing = true;
            pendingCallbacks.add(callback);
        }

        // Verbose adapter logging is only useful for integration testing.
        LevelPlay.setAdaptersDebug(isTesting);

        // The integration test suite is gated behind a metadata flag that
        // must be set *before* init() — otherwise launchTestSuite() opens
        // nothing.
        if (isTesting) {
            LevelPlay.setMetaData("is_test_suite", "enable");
        }

        LevelPlayInitRequest.Builder builder = new LevelPlayInitRequest.Builder(appKey);
        if (userId != null && !userId.isEmpty()) {
            builder.withUserId(userId);
        }

        LevelPlay.init(context, builder.build(), new LevelPlayInitListener() {
            @Override
            public void onInitSuccess(LevelPlayConfiguration configuration) {
                initialized = true;
                initializing = false;
                Logger.info(TAG, "LevelPlay SDK initialized (v" + LevelPlay.getSdkVersion() + ").");
                if (isTesting) {
                    logAdapterDiscovery();
                }
                drainPending(true, null);
            }

            @Override
            public void onInitFailed(LevelPlayInitError error) {
                initializing = false;
                drainPending(false, error.getErrorMessage());
            }
        });
    }

    private void logAdapterDiscovery() {
        String[][] checks = {
            // { label, adapter class, sdk class }
            {"AdMob", "com.ironsource.adapters.admob.AdMobAdapter", "com.google.android.gms.ads.MobileAds"},
            {"AppLovin", "com.ironsource.adapters.applovin.AppLovinAdapter", "com.applovin.sdk.AppLovinSdk"},
            {"UnityAds", "com.ironsource.adapters.unityads.UnityAdsAdapter", "com.unity3d.ads.UnityAds"},
            {"Vungle", "com.ironsource.adapters.vungle.VungleAdapter", "com.vungle.ads.VungleAds"},
            {"Meta", "com.ironsource.adapters.facebook.FacebookAdapter", "com.facebook.ads.AdSettings"},
            {"Pangle", "com.ironsource.adapters.pangle.PangleAdapter", "com.bytedance.sdk.openadsdk.api.init.PAGSdk"},
            {"InMobi", "com.ironsource.adapters.inmobi.InMobiAdapter", "com.inmobi.sdk.InMobiSdk"},
            {"Mintegral", "com.ironsource.adapters.mintegral.MintegralAdapter", "com.mbridge.msdk.MBridgeSDK"},
            {"Chartboost", "com.ironsource.adapters.chartboost.ChartboostAdapter", "com.chartboost.sdk.Chartboost"},
            {"Moloco", "com.ironsource.adapters.moloco.MolocoAdapter", "com.moloco.sdk.publisher.MolocoAd"},
            {"Bigo", "com.ironsource.adapters.bigo.BigoAdapter", "com.bigossp.ads.BigoAdSdk"},
        };
        for (String[] entry : checks) {
            String label = entry[0];
            boolean adapterOk = classExists(entry[1]);
            boolean sdkOk = classExists(entry[2]);
            if (adapterOk && sdkOk) {
                Logger.info(TAG, label + ": adapter ✓  sdk ✓");
            } else if (adapterOk) {
                Logger.warn(TAG, label + ": adapter ✓  sdk ✗ (missing " + entry[2] + ")");
            } else if (sdkOk) {
                Logger.warn(TAG, label + ": adapter ✗  sdk ✓ (missing " + entry[1] + ")");
            }
        }
    }

    private static boolean classExists(String name) {
        try { Class.forName(name); return true; } catch (ClassNotFoundException e) { return false; }
    }

    private void drainPending(boolean success, String error) {
        List<InitCallback> toNotify;
        synchronized (pendingCallbacks) {
            toNotify = new ArrayList<>(pendingCallbacks);
            pendingCallbacks.clear();
        }
        for (InitCallback cb : toNotify) {
            if (success) cb.onSuccess();
            else cb.onError(error);
        }
    }
}
