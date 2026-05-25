package com.capacitor.plugins.levelplay.interstitial;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.getcapacitor.PluginCall;
import com.capacitor.plugins.levelplay.ActionCallback;
import com.capacitor.plugins.levelplay.AdJsonUtil;
import com.capacitor.plugins.levelplay.LevelPlayPluginBridge;

import com.unity3d.mediation.LevelPlayAdError;
import com.unity3d.mediation.LevelPlayAdInfo;
import com.unity3d.mediation.interstitial.LevelPlayInterstitialAd;
import com.unity3d.mediation.interstitial.LevelPlayInterstitialAdListener;

/**
 * Wraps a single reusable {@link LevelPlayInterstitialAd}. Flow:
 * {@code load} → {@code isReady} → {@code show}; auto-reloads after close.
 *
 * The {@code load} promise resolves on {@code onAdLoaded}; the {@code show}
 * promise resolves on {@code onAdDisplayed} and rejects on
 * {@code onAdDisplayFailed} — so callers learn the real display outcome.
 */
public class InterstitialExecutor implements LevelPlayInterstitialAdListener {

    private final LevelPlayPluginBridge bridge;
    private LevelPlayInterstitialAd interstitialAd;
    private String currentAdUnitId = "";
    private long lastLoadTime = 0;
    private boolean autoReload = true;

    /** Callback for the in-flight load() call; cleared once fired. */
    private ActionCallback pendingLoad;
    /** Callback for the in-flight show() call; cleared once fired. */
    private ActionCallback pendingShow;

    public InterstitialExecutor(LevelPlayPluginBridge bridge) {
        this.bridge = bridge;
    }

    public void load(Activity activity, PluginCall call, final ActionCallback callback) {
        if (activity == null) {
            callback.onError("No foreground activity.");
            return;
        }
        String adUnitId = call.getString("adUnitId");
        if (adUnitId == null || adUnitId.isEmpty()) {
            callback.onError("Ad Unit ID is required.");
            return;
        }

        Double retryOpt = call.getDouble("retryInterval");
        long minLoadInterval = (retryOpt != null) ? retryOpt.longValue() : 5000L;
        long now = System.currentTimeMillis();
        if ((now - lastLoadTime) < minLoadInterval) {
            callback.onError("Request too fast. Please wait " + minLoadInterval + "ms to prevent invalid traffic.");
            return;
        }
        lastLoadTime = now;

        Boolean autoReloadOpt = call.getBoolean("autoReload", true);
        this.autoReload = autoReloadOpt == null || autoReloadOpt;

        activity.runOnUiThread(() -> {
            if (interstitialAd == null || !currentAdUnitId.equals(adUnitId)) {
                currentAdUnitId = adUnitId;
                interstitialAd = new LevelPlayInterstitialAd(adUnitId);
                interstitialAd.setListener(this);
            }
            // A prior load is still in flight — reject it so its promise settles.
            resolvePendingLoad(false, "Superseded by a new load request.");
            pendingLoad = callback;
            interstitialAd.loadAd();
        });
    }

    /** True when an ad is loaded and ready to show. */
    public boolean isReady() {
        return interstitialAd != null && interstitialAd.isAdReady();
    }

    public void show(Activity activity, final ActionCallback callback) {
        if (activity == null) {
            callback.onError("No foreground activity.");
            return;
        }
        if (interstitialAd == null || !interstitialAd.isAdReady()) {
            callback.onError("The interstitial ad is not ready yet.");
            return;
        }
        activity.runOnUiThread(() -> {
            resolvePendingShow(false, "Superseded by a new show request.");
            pendingShow = callback;
            interstitialAd.showAd(activity);
        });
    }

    private void resolvePendingLoad(boolean success, String error) {
        ActionCallback cb = pendingLoad;
        pendingLoad = null;
        if (cb == null) return;
        if (success) cb.onSuccess();
        else cb.onError(error);
    }

    private void resolvePendingShow(boolean success, String error) {
        ActionCallback cb = pendingShow;
        pendingShow = null;
        if (cb == null) return;
        if (success) cb.onSuccess();
        else cb.onError(error);
    }

    // --- LevelPlayInterstitialAdListener ---------------------------------

    @Override
    public void onAdLoaded(@NonNull LevelPlayAdInfo adInfo) {
        bridge.fireEvent("onInterstitialAdLoaded", AdJsonUtil.adInfoToJS(adInfo));
        resolvePendingLoad(true, null);
    }

    @Override
    public void onAdLoadFailed(@NonNull LevelPlayAdError error) {
        bridge.fireEvent("onInterstitialAdLoadFailed", AdJsonUtil.adErrorToJS(error));
        resolvePendingLoad(false, error.getErrorMessage());
    }

    @Override
    public void onAdDisplayed(@NonNull LevelPlayAdInfo adInfo) {
        bridge.fireEvent("onInterstitialAdDisplayed", AdJsonUtil.adInfoToJS(adInfo));
        resolvePendingShow(true, null);
    }

    @Override
    public void onAdDisplayFailed(@NonNull LevelPlayAdError error, @NonNull LevelPlayAdInfo adInfo) {
        bridge.fireEvent("onInterstitialAdDisplayFailed", AdJsonUtil.adErrorToJS(error));
        resolvePendingShow(false, error.getErrorMessage());
    }

    @Override
    public void onAdClicked(@NonNull LevelPlayAdInfo adInfo) {
        bridge.fireEvent("onInterstitialAdClicked", AdJsonUtil.adInfoToJS(adInfo));
    }

    @Override
    public void onAdClosed(@NonNull LevelPlayAdInfo adInfo) {
        bridge.fireEvent("onInterstitialAdClosed", AdJsonUtil.adInfoToJS(adInfo));
        if (autoReload && interstitialAd != null) {
            interstitialAd.loadAd();
        }
    }

    @Override
    public void onAdInfoChanged(@NonNull LevelPlayAdInfo adInfo) {
        bridge.fireEvent("onInterstitialAdInfoChanged", AdJsonUtil.adInfoToJS(adInfo));
    }
}
