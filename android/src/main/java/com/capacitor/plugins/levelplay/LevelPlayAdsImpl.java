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
                drainPending(true, null);
            }

            @Override
            public void onInitFailed(LevelPlayInitError error) {
                initializing = false;
                drainPending(false, error.getErrorMessage());
            }
        });
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
