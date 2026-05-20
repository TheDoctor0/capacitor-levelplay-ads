package com.emi.plugins.levelplay;

import android.content.Context;

import com.getcapacitor.Logger;
import com.unity3d.mediation.LevelPlay;
import com.unity3d.mediation.LevelPlayConfiguration;
import com.unity3d.mediation.LevelPlayInitError;
import com.unity3d.mediation.LevelPlayInitListener;
import com.unity3d.mediation.LevelPlayInitRequest;

/**
 * Core LevelPlay lifecycle: SDK initialization and init-state tracking. Ad
 * requests are gated on {@link #isInitialized()} by the plugin class.
 */
public class LevelPlayAdsImpl {

    private static final String TAG = "LevelPlayAds";

    private volatile boolean initialized = false;
    private volatile boolean initializing = false;

    public boolean isInitialized() {
        return initialized;
    }

    public interface InitCallback {
        void onSuccess();
        void onError(String error);
    }

    public void initialize(Context context, String appKey, String userId, boolean isTesting,
                           final InitCallback callback) {
        if (initialized) {
            callback.onSuccess();
            return;
        }
        if (initializing) {
            callback.onError("LevelPlay is already initializing.");
            return;
        }
        initializing = true;

        // Verbose adapter logging is only useful for integration testing.
        LevelPlay.setAdaptersDebug(isTesting);

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
                callback.onSuccess();
            }

            @Override
            public void onInitFailed(LevelPlayInitError error) {
                initializing = false;
                callback.onError(error.getErrorMessage());
            }
        });
    }
}
