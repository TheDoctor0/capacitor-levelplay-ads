package com.emi.plugins.levelplay.banner;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.emi.plugins.levelplay.AdJsonUtil;
import com.emi.plugins.levelplay.LevelPlayAdsPlugin;

import com.unity3d.mediation.LevelPlayAdError;
import com.unity3d.mediation.LevelPlayAdInfo;
import com.unity3d.mediation.LevelPlayAdSize;
import com.unity3d.mediation.banner.LevelPlayBannerAdView;
import com.unity3d.mediation.banner.LevelPlayBannerAdViewListener;

/**
 * Hosts a {@link LevelPlayBannerAdView} in an overlay {@link FrameLayout} added
 * to the decorView, and offsets the Capacitor WebView so the banner does not
 * cover content (unless overlap mode is requested).
 */
public class BannerExecutor {

    private final LevelPlayAdsPlugin plugin;

    private LevelPlayBannerAdView bannerView;
    private FrameLayout capacitorAdLayout;

    private String currentAdUnitId = "";
    private String currentPosition = "BOTTOM";

    private boolean isBannerVisible = false;
    private boolean isLoading = false;
    private boolean isOverlapping = true;
    private boolean isAutoShow = true;

    private int lastAdHeight = 0;
    private int systemSafeTop = 0;
    private int systemSafeBottom = 0;

    private String lastSizeStr = "";
    private String lastPosition = "BOTTOM";
    private long lastLoadTime = 0;

    public BannerExecutor(LevelPlayAdsPlugin plugin) {
        this.plugin = plugin;
    }

    public void createBanner(final PluginCall call) {
        String adUnitId = call.getString("adUnitId");
        if (adUnitId == null || adUnitId.isEmpty()) {
            call.reject("Ad Unit ID is required", "ERR_MISSING_ID");
            return;
        }

        final Activity activity = plugin.getActivity();
        if (activity == null) {
            call.reject("No foreground activity.");
            return;
        }

        activity.runOnUiThread(() -> {
            if (isLoading) {
                call.reject("A banner is already loading.");
                return;
            }

            Boolean autoShowOpt = call.getBoolean("isAutoShow", true);
            boolean requestAutoShow = autoShowOpt == null || autoShowOpt;

            String posOpt = call.getString("position", "BOTTOM");
            String requestPosition = (posOpt != null) ? posOpt.toUpperCase() : "BOTTOM";

            Boolean overlapOpt = call.getBoolean("isOverlap", true);
            this.isOverlapping = overlapOpt == null || overlapOpt;

            String requestSizeStr = call.getString("adSize", "ADAPTIVE");
            if (requestSizeStr == null) requestSizeStr = "ADAPTIVE";

            Double retryOpt = call.getDouble("retryInterval");
            long minLoadInterval = (retryOpt != null) ? retryOpt.longValue() : 5000L;
            long now = System.currentTimeMillis();

            boolean isSameId = currentAdUnitId.equals(adUnitId);
            boolean isSameSize = lastSizeStr.equals(requestSizeStr);
            boolean isSamePos = lastPosition.equals(requestPosition);

            // Reuse a cached banner of the same unit + size — just re-show/hide/move.
            if (bannerView != null && isSameId && isSameSize) {
                this.currentPosition = requestPosition;
                this.isAutoShow = requestAutoShow;
                if (this.isAutoShow) {
                    if (!isBannerVisible) {
                        showBanner(null);
                        call.resolve(message("Banner Shown (Cached)"));
                    } else if (!isSamePos) {
                        updateBannerLayout();
                        updateWebViewMargins();
                        call.resolve(message("Banner Repositioned"));
                    } else {
                        call.resolve(message("Banner Already Visible"));
                    }
                } else {
                    hideBanner(null);
                    call.resolve(message("Banner Hidden (Cached)"));
                }
                this.lastPosition = this.currentPosition;
                return;
            }

            if ((now - lastLoadTime) < minLoadInterval) {
                call.reject("Request too fast. Please wait " + minLoadInterval + "ms to prevent invalid traffic.");
                return;
            }

            this.currentAdUnitId = adUnitId;
            this.currentPosition = requestPosition;
            this.lastPosition = requestPosition;
            this.isAutoShow = requestAutoShow;
            this.lastSizeStr = requestSizeStr;
            this.lastLoadTime = now;
            this.isLoading = true;

            ensureOverlay(activity);

            final LevelPlayAdSize adSize = getAdSize(activity, requestSizeStr);
            LevelPlayBannerAdView.Config config = new LevelPlayBannerAdView.Config.Builder()
                    .setAdSize(adSize)
                    .build();
            final LevelPlayBannerAdView pendingView = new LevelPlayBannerAdView(activity, adUnitId, config);

            // Add off-screen-sized + invisible until the load succeeds.
            capacitorAdLayout.addView(pendingView, new FrameLayout.LayoutParams(1, 1));
            pendingView.setVisibility(View.INVISIBLE);

            DisplayMetrics dm = activity.getResources().getDisplayMetrics();
            final int adHeightPx = Math.round(adSize.getHeight() * dm.density);

            pendingView.setBannerListener(new LevelPlayBannerAdViewListener() {
                @Override
                public void onAdLoaded(@NonNull LevelPlayAdInfo adInfo) {
                    activity.runOnUiThread(() -> {
                        isLoading = false;

                        if (bannerView != null) {
                            if (bannerView.getParent() != null) {
                                ((ViewGroup) bannerView.getParent()).removeView(bannerView);
                            }
                            bannerView.destroy();
                        }

                        bannerView = pendingView;
                        lastAdHeight = adHeightPx;

                        if (isAutoShow) {
                            isBannerVisible = true;
                            updateBannerLayout();
                            updateWebViewMargins();
                            bannerView.setVisibility(View.VISIBLE);
                            capacitorAdLayout.bringToFront();
                        } else {
                            isBannerVisible = false;
                            bannerView.setVisibility(View.GONE);
                        }

                        JSObject ret = AdJsonUtil.adInfoToJS(adInfo);
                        ret.put("width", adSize.getWidth());
                        ret.put("height", adSize.getHeight());
                        plugin.notifyPluginListeners("onBannerAdLoaded", ret);
                        call.resolve(ret);
                    });
                }

                @Override
                public void onAdLoadFailed(@NonNull LevelPlayAdError error) {
                    activity.runOnUiThread(() -> {
                        isLoading = false;
                        if (pendingView.getParent() != null) {
                            ((ViewGroup) pendingView.getParent()).removeView(pendingView);
                        }
                        pendingView.destroy();
                        plugin.notifyPluginListeners("onBannerAdLoadFailed", AdJsonUtil.adErrorToJS(error));
                        call.reject("Banner failed to load: " + error.getErrorMessage());
                    });
                }

                @Override
                public void onAdDisplayed(@NonNull LevelPlayAdInfo adInfo) {
                    plugin.notifyPluginListeners("onBannerAdDisplayed", AdJsonUtil.adInfoToJS(adInfo));
                }

                @Override
                public void onAdDisplayFailed(@NonNull LevelPlayAdInfo adInfo, @NonNull LevelPlayAdError error) {
                    plugin.notifyPluginListeners("onBannerAdDisplayFailed", AdJsonUtil.adErrorToJS(error));
                }

                @Override
                public void onAdClicked(@NonNull LevelPlayAdInfo adInfo) {
                    plugin.notifyPluginListeners("onBannerAdClicked", AdJsonUtil.adInfoToJS(adInfo));
                }

                @Override
                public void onAdExpanded(@NonNull LevelPlayAdInfo adInfo) {
                    plugin.notifyPluginListeners("onBannerAdExpanded", AdJsonUtil.adInfoToJS(adInfo));
                }

                @Override
                public void onAdCollapsed(@NonNull LevelPlayAdInfo adInfo) {
                    plugin.notifyPluginListeners("onBannerAdCollapsed", AdJsonUtil.adInfoToJS(adInfo));
                }

                @Override
                public void onAdLeftApplication(@NonNull LevelPlayAdInfo adInfo) {
                    plugin.notifyPluginListeners("onBannerAdLeftApplication", AdJsonUtil.adInfoToJS(adInfo));
                }
            });

            pendingView.loadAd();
        });
    }

    private void ensureOverlay(Activity activity) {
        if (capacitorAdLayout != null) return;

        capacitorAdLayout = new FrameLayout(activity);
        capacitorAdLayout.setTag("emi_banner_layout");
        capacitorAdLayout.setBackgroundColor(Color.TRANSPARENT);

        ViewGroup decorView = (ViewGroup) activity.getWindow().getDecorView();
        decorView.addView(capacitorAdLayout, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));

        capacitorAdLayout.setOnApplyWindowInsetsListener((v, insets) -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                android.graphics.Insets sysInsets = insets.getInsets(android.view.WindowInsets.Type.systemBars());
                systemSafeTop = sysInsets.top;
                systemSafeBottom = sysInsets.bottom;
            } else {
                systemSafeTop = insets.getSystemWindowInsetTop();
                systemSafeBottom = insets.getSystemWindowInsetBottom();
            }
            if (isBannerVisible) {
                updateBannerLayout();
                updateWebViewMargins();
            }
            return insets;
        });
        capacitorAdLayout.requestApplyInsets();
    }

    private void updateBannerLayout() {
        if (bannerView == null || capacitorAdLayout == null) return;

        FrameLayout.LayoutParams bannerParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT);

        if ("TOP".equals(currentPosition)) {
            bannerParams.gravity = Gravity.TOP | Gravity.CENTER_HORIZONTAL;
            bannerParams.setMargins(0, systemSafeTop, 0, 0);
        } else {
            bannerParams.gravity = Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL;
            bannerParams.setMargins(0, 0, 0, systemSafeBottom);
        }

        bannerView.setLayoutParams(bannerParams);
        capacitorAdLayout.requestLayout();
    }

    private void updateWebViewMargins() {
        View webViewView = plugin.getBridge().getWebView();
        if (webViewView == null) return;

        ViewGroup.LayoutParams lp = webViewView.getLayoutParams();
        if (!(lp instanceof ViewGroup.MarginLayoutParams)) return;

        ViewGroup.MarginLayoutParams params = (ViewGroup.MarginLayoutParams) lp;
        if (!isBannerVisible || isOverlapping) {
            params.topMargin = 0;
            params.bottomMargin = 0;
        } else if ("TOP".equals(currentPosition)) {
            params.topMargin = lastAdHeight;
            params.bottomMargin = 0;
        } else {
            params.topMargin = 0;
            params.bottomMargin = lastAdHeight;
        }
        params.height = ViewGroup.LayoutParams.MATCH_PARENT;

        webViewView.setLayoutParams(params);
        webViewView.requestLayout();
    }

    public void showBanner(final PluginCall call) {
        final Activity activity = plugin.getActivity();
        if (activity == null) {
            if (call != null) call.reject("No foreground activity.");
            return;
        }
        activity.runOnUiThread(() -> {
            if (bannerView == null) {
                if (call != null) call.reject("Banner not created yet.");
                return;
            }
            isBannerVisible = true;
            updateBannerLayout();
            updateWebViewMargins();
            bannerView.setVisibility(View.VISIBLE);
            if (capacitorAdLayout != null) {
                capacitorAdLayout.setVisibility(View.VISIBLE);
                capacitorAdLayout.bringToFront();
            }
            if (call != null) call.resolve();
        });
    }

    public void hideBanner(final PluginCall call) {
        final Activity activity = plugin.getActivity();
        if (activity == null) {
            if (call != null) call.reject("No foreground activity.");
            return;
        }
        activity.runOnUiThread(() -> {
            isBannerVisible = false;
            if (bannerView != null) bannerView.setVisibility(View.GONE);
            if (capacitorAdLayout != null) capacitorAdLayout.setVisibility(View.GONE);
            updateWebViewMargins();
            if (call != null) call.resolve();
        });
    }

    public void destroyBanner(final PluginCall call) {
        final Activity activity = plugin.getActivity();
        if (activity == null) {
            if (call != null) call.reject("No foreground activity.");
            return;
        }
        activity.runOnUiThread(() -> {
            isBannerVisible = false;
            updateWebViewMargins();

            if (bannerView != null) {
                if (bannerView.getParent() != null) {
                    ((ViewGroup) bannerView.getParent()).removeView(bannerView);
                }
                bannerView.destroy();
                bannerView = null;
            }
            if (capacitorAdLayout != null) {
                if (capacitorAdLayout.getParent() != null) {
                    ((ViewGroup) capacitorAdLayout.getParent()).removeView(capacitorAdLayout);
                }
                capacitorAdLayout = null;
            }
            currentAdUnitId = "";
            lastSizeStr = "";
            if (call != null) call.resolve();
        });
    }

    private JSObject message(String msg) {
        JSObject ret = new JSObject();
        ret.put("message", msg);
        return ret;
    }

    /** Maps the plugin's size string to a LevelPlay ad size. */
    private LevelPlayAdSize getAdSize(Activity activity, String sizeStr) {
        switch (sizeStr.toUpperCase()) {
            case "BANNER":
                return LevelPlayAdSize.BANNER;
            case "MREC":
            case "MEDIUM_RECTANGLE":
                return LevelPlayAdSize.MEDIUM_RECTANGLE;
            case "LEADERBOARD":
                return LevelPlayAdSize.LEADERBOARD;
            case "LARGE":
                return LevelPlayAdSize.LARGE;
            default:
                LevelPlayAdSize adaptive = LevelPlayAdSize.createAdaptiveAdSize(activity);
                return adaptive != null ? adaptive : LevelPlayAdSize.BANNER;
        }
    }
}
