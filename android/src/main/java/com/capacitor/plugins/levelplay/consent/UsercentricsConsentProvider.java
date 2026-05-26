package com.capacitor.plugins.levelplay.consent;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;

import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;

/**
 * ConsentProvider backed by the Usercentrics CMP SDK (IAB TCF v2.3).
 *
 * The SDK is initialized lazily on the first {@link #requestConsent} call.
 * Usercentrics writes standard {@code IABTCF_*} SharedPreferences keys, so
 * {@link TcfPrefs} works identically to the InMobi provider.
 *
 * All Usercentrics classes are accessed via reflection-safe try/catch so the
 * plugin compiles even when the SDK is absent ({@code compileOnly}).
 */
public class UsercentricsConsentProvider implements ConsentProvider {

    private static final String TAG = "LevelPlayAds";
    private static final long READY_TIMEOUT_MS = 15_000;

    private final Context context;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private boolean sdkInitialized = false;
    private Runnable pendingTimeout;

    public UsercentricsConsentProvider(Context context) {
        this.context = context.getApplicationContext();
    }

    @Override
    public void requestConsent(Activity activity, JSObject options, ConsentCallback callback) {
        if (TcfPrefs.hasDecision(context)) {
            callback.onDecision(TcfPrefs.isGranted(context));
            return;
        }
        String err = ensureSdkInitialized();
        if (err != null) {
            callback.onError(err);
            return;
        }
        scheduleReadyTimeout(callback);
        try {
            com.usercentrics.sdk.Usercentrics.isReady(
                    status -> {
                        cancelTimeout();
                        Logger.info(TAG, "Usercentrics isReady: shouldCollectConsent=" + status.getShouldCollectConsent());
                        if (status.getShouldCollectConsent()) {
                            showFirstLayer(activity, callback);
                        } else {
                            Logger.info(TAG, "Usercentrics: consent not required for this region/config — auto-granting.");
                            if (!TcfPrefs.hasDecision(context)) {
                                TcfPrefs.writeStub(context, true);
                            }
                            callback.onDecision(true);
                        }
                        return null;
                    },
                    error -> {
                        cancelTimeout();
                        Logger.warn(TAG, "Usercentrics isReady failed: " + error.getMessage());
                        callback.onError("Usercentrics CMP error: " + error.getMessage());
                        return null;
                    }
            );
        } catch (NoClassDefFoundError e) {
            cancelTimeout();
            callback.onError("Usercentrics SDK not on classpath. Run `npx cap sync`.");
        } catch (Exception e) {
            cancelTimeout();
            callback.onError("Usercentrics isReady failed: " + e.getMessage());
        }
    }

    @Override
    public void showPrivacyOptions(Activity activity, JSObject options, ConsentCallback callback) {
        if (activity == null) {
            callback.onError("No foreground activity to display the CMP.");
            return;
        }
        String err = ensureSdkInitialized();
        if (err != null) {
            callback.onError(err);
            return;
        }
        try {
            com.usercentrics.sdk.Usercentrics.isReady(
                    status -> {
                        showSecondLayer(activity, callback);
                        return null;
                    },
                    error -> {
                        Logger.warn(TAG, "Usercentrics isReady failed: " + error.getMessage());
                        callback.onError("Usercentrics CMP error: " + error.getMessage());
                        return null;
                    }
            );
        } catch (NoClassDefFoundError e) {
            callback.onError("Usercentrics SDK not on classpath. Run `npx cap sync`.");
        } catch (Exception e) {
            callback.onError("Usercentrics showPrivacyOptions failed: " + e.getMessage());
        }
    }

    private String ensureSdkInitialized() {
        if (sdkInitialized) return null;

        String settingsId = readString("levelplay_usercentrics_settings_id");
        if (settingsId == null || settingsId.isEmpty()) {
            String msg = "Usercentrics CMP: levelplay_usercentrics_settings_id resource missing.";
            Logger.warn(TAG, msg);
            return msg;
        }

        try {
            com.usercentrics.sdk.UsercentricsOptions options =
                    new com.usercentrics.sdk.UsercentricsOptions(settingsId);
            String rulesetId = readString("levelplay_usercentrics_ruleset_id");
            if (rulesetId != null && !rulesetId.isEmpty()) {
                options.setRuleSetId(rulesetId);
            }
            options.setConsentMediation(true);
            com.usercentrics.sdk.Usercentrics.initialize(context, options);
            sdkInitialized = true;
            Logger.info(TAG, "Usercentrics CMP initialized.");
            return null;
        } catch (NoClassDefFoundError e) {
            String msg = "Usercentrics SDK not on classpath. Run `npx cap sync`.";
            Logger.error(TAG, msg, e);
            return msg;
        } catch (Exception e) {
            String msg = "Usercentrics CMP init failed: " + e.getMessage();
            Logger.error(TAG, msg, e);
            return msg;
        }
    }

    private void showFirstLayer(Activity activity, ConsentCallback callback) {
        if (activity == null) {
            callback.onError("No foreground activity to display the CMP.");
            return;
        }
        try {
            handler.post(() -> {
                com.usercentrics.sdk.UsercentricsBanner banner =
                        new com.usercentrics.sdk.UsercentricsBanner(activity, null);
                banner.showFirstLayer(response -> {
                    boolean granted = mapInteraction(response);
                    if (!TcfPrefs.hasDecision(context)) {
                        TcfPrefs.writeStub(context, granted);
                    }
                    callback.onDecision(granted);
                    return null;
                });
            });
        } catch (NoClassDefFoundError e) {
            if (!TcfPrefs.hasDecision(context)) TcfPrefs.writeStub(context, true);
            callback.onDecision(true);
        } catch (Exception e) {
            callback.onError("Usercentrics showFirstLayer failed: " + e.getMessage());
        }
    }

    private void showSecondLayer(Activity activity, ConsentCallback callback) {
        try {
            handler.post(() -> {
                com.usercentrics.sdk.UsercentricsBanner banner =
                        new com.usercentrics.sdk.UsercentricsBanner(activity, null);
                banner.showSecondLayer(response -> {
                    boolean granted = mapInteraction(response);
                    if (!TcfPrefs.hasDecision(context)) {
                        TcfPrefs.writeStub(context, granted);
                    }
                    callback.onDecision(granted);
                    return null;
                });
            });
        } catch (NoClassDefFoundError e) {
            if (!TcfPrefs.hasDecision(context)) TcfPrefs.writeStub(context, true);
            callback.onDecision(true);
        } catch (Exception e) {
            callback.onError("Usercentrics showSecondLayer failed: " + e.getMessage());
        }
    }

    private boolean mapInteraction(com.usercentrics.sdk.UsercentricsConsentUserResponse response) {
        com.usercentrics.sdk.UsercentricsUserInteraction interaction = response.getUserInteraction();
        Logger.info(TAG, "Usercentrics userInteraction=" + interaction + " controllerId=" + response.getControllerId());
        if (interaction == com.usercentrics.sdk.UsercentricsUserInteraction.DENY_ALL) {
            Logger.info(TAG, "Usercentrics mapped to granted=false (DENY_ALL)");
            return false;
        }
        // ACCEPT_ALL, GRANULAR (user confirmed per-service choices), NO_INTERACTION
        // all count as consent given. GRANULAR means the user actively went through
        // the flow and submitted — Usercentrics writes the real per-purpose TCF
        // string asynchronously, but the decision itself is affirmative.
        Logger.info(TAG, "Usercentrics mapped to granted=true (" + interaction + ")");
        return true;
    }

    private String readString(String name) {
        int id = context.getResources().getIdentifier(name, "string", context.getPackageName());
        if (id == 0) return null;
        return context.getString(id);
    }

    private void scheduleReadyTimeout(ConsentCallback callback) {
        cancelTimeout();
        pendingTimeout = () -> {
            Logger.warn(TAG, "Usercentrics isReady timed out — auto-granting consent.");
            if (!TcfPrefs.hasDecision(context)) {
                TcfPrefs.writeStub(context, true);
            }
            callback.onDecision(true);
        };
        handler.postDelayed(pendingTimeout, READY_TIMEOUT_MS);
    }

    private void cancelTimeout() {
        if (pendingTimeout != null) {
            handler.removeCallbacks(pendingTimeout);
            pendingTimeout = null;
        }
    }

    @Override
    public ConsentStatus getStatus() {
        if (!TcfPrefs.hasDecision(context)) return ConsentStatus.UNKNOWN;
        return TcfPrefs.isGranted(context) ? ConsentStatus.GRANTED : ConsentStatus.DENIED;
    }

    @Override
    public JSObject getConsentData() {
        ConsentStatus status = getStatus();
        JSObject data = new JSObject();
        data.put("status", status.name());
        data.put("granted", status == ConsentStatus.GRANTED);
        data.put("canRequestAds", status != ConsentStatus.UNKNOWN);
        data.put("tcString", TcfPrefs.prefs(context).getString(TcfPrefs.KEY_TC_STRING, null));
        data.put("provider", "usercentrics");
        return data;
    }

    @Override
    public void resetConsent() {
        TcfPrefs.clear(context);
        sdkInitialized = false;
        try {
            com.usercentrics.sdk.Usercentrics.getInstance().clearUserSession(
                    status -> null,
                    error -> null
            );
        } catch (NoClassDefFoundError | Exception ignored) {
            // SDK not present or not initialized — clearing TcfPrefs is enough.
        }
        Logger.info(TAG, "Usercentrics consent reset. Call requestConsentInfo() to re-prompt.");
    }
}
