package com.capacitor.plugins.levelplay.consent;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;

import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;
import com.inmobi.cmp.ChoiceCmp;
import com.inmobi.cmp.data.model.ChoiceStyle;
import com.inmobi.cmp.data.model.ThemeMode;

/**
 * ConsentProvider backed by InMobi Choice CMP (IAB TCF v2.2).
 *
 * The SDK is NOT initialized at startup — it boots on the first
 * {@link #requestConsent} call so the CMP only appears when JS explicitly
 * requests it. {@code startChoice()} loads the remote config and auto-shows
 * the CMP UI when no decision exists.
 */
public class InMobiConsentProvider implements ConsentProvider {

    private static final String TAG = "LevelPlayAds";

    private static final long CONFIG_LOAD_TIMEOUT_MS = 15_000;
    private static final long NO_UI_TIMEOUT_MS = 5_000;

    private final Context context;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final NoOpChoiceCmpCallback cmpCallback = new NoOpChoiceCmpCallback();
    private boolean sdkStarted = false;
    private SharedPreferences.OnSharedPreferenceChangeListener pendingListener;
    private Runnable pendingTimeout;
    private Runnable pendingNoUiTimeout;

    public InMobiConsentProvider(Context context) {
        this.context = context.getApplicationContext();
    }

    @Override
    public void requestConsent(Activity activity, JSObject options, ConsentCallback callback) {
        if (TcfPrefs.hasDecision(context)) {
            callback.onDecision(TcfPrefs.isGranted(context));
            return;
        }
        String err = ensureSdkStarted();
        if (err != null) {
            callback.onError(err);
            return;
        }
        waitForTcfDecision(callback);
        cmpCallback.setListener(new NoOpChoiceCmpCallback.Listener() {
            @Override public void onCmpError(String message) {
                Logger.warn(TAG, "InMobi CMP runtime error: " + message);
                cancelWait();
                callback.onError("InMobi CMP error: " + message);
            }
            @Override public void onCmpLoaded() {
                // Config loaded. If no UI appears within 5s, the CMP determined
                // consent is not required — auto-grant and resolve.
                scheduleNoUiTimeout(callback, 5_000);
            }
            @Override public void onUiVisible(boolean visible) {
                if (visible) {
                    // CMP is showing — cancel timeout, wait for user decision.
                    cancelNoUiTimeout();
                }
            }
        });
    }

    @Override
    public void showPrivacyOptions(Activity activity, JSObject options, ConsentCallback callback) {
        if (activity == null) {
            callback.onError("No foreground activity to display the CMP.");
            return;
        }
        String err = ensureSdkStarted();
        if (err != null) {
            callback.onError(err);
            return;
        }
        waitForTcfDecision(callback);
        try {
            ChoiceCmp.INSTANCE.forceDisplayUI(activity);
        } catch (NoClassDefFoundError e) {
            resolveWait(callback, true);
        } catch (Exception e) {
            resolveWait(callback, true);
        }
    }

    /** Returns null on success, or an error message. */
    private String ensureSdkStarted() {
        if (sdkStarted) return null;

        String pCode = readString("levelplay_inmobi_pcode");
        if (pCode == null || pCode.isEmpty()) {
            String msg = "InMobi CMP: levelplay_inmobi_pcode resource missing.";
            Logger.warn(TAG, msg);
            return msg;
        }
        String packageId = readString("levelplay_inmobi_package_id");
        if (packageId == null || packageId.isEmpty()) {
            packageId = context.getPackageName();
        }

        try {
            Application app = (Application) context.getApplicationContext();
            ChoiceStyle style = new ChoiceStyle.Builder()
                    .setThemeMode(ThemeMode.AUTO)
                    .build();
            ChoiceCmp.INSTANCE.startChoice(app, packageId, pCode, cmpCallback, style);
            sdkStarted = true;
            Logger.info(TAG, "InMobi Choice CMP started.");
            return null;
        } catch (NoClassDefFoundError e) {
            String msg = "InMobi CMP not on classpath. Run `npx cap sync`.";
            Logger.error(TAG, msg, e);
            return msg;
        } catch (Exception e) {
            String msg = "InMobi Choice CMP start failed: " + e.getMessage();
            Logger.error(TAG, msg, e);
            return msg;
        }
    }

    private String readString(String name) {
        int id = context.getResources().getIdentifier(name, "string", context.getPackageName());
        if (id == 0) return null;
        return context.getString(id);
    }

    private void waitForTcfDecision(final ConsentCallback callback) {
        final SharedPreferences prefs = TcfPrefs.prefs(context);
        if (pendingListener != null) {
            prefs.unregisterOnSharedPreferenceChangeListener(pendingListener);
            pendingListener = null;
        }
        if (pendingTimeout != null) {
            handler.removeCallbacks(pendingTimeout);
            pendingTimeout = null;
        }
        pendingListener = (sp, key) -> {
            if (TcfPrefs.KEY_TC_STRING.equals(key) || TcfPrefs.KEY_GDPR_APPLIES.equals(key)) {
                resolveWait(callback, TcfPrefs.isGranted(context));
            }
        };
        prefs.registerOnSharedPreferenceChangeListener(pendingListener);

        pendingTimeout = () -> {
            Logger.warn(TAG, "InMobi CMP config load timed out — auto-granting consent.");
            if (!TcfPrefs.hasDecision(context)) {
                TcfPrefs.writeStub(context, true);
            }
            resolveWait(callback, true);
        };
        handler.postDelayed(pendingTimeout, CONFIG_LOAD_TIMEOUT_MS);
    }

    private void scheduleNoUiTimeout(ConsentCallback callback, long delayMs) {
        cancelNoUiTimeout();
        // Cancel the longer config-load timeout since config already loaded.
        if (pendingTimeout != null) {
            handler.removeCallbacks(pendingTimeout);
            pendingTimeout = null;
        }
        pendingNoUiTimeout = () -> {
            Logger.info(TAG, "InMobi CMP loaded but no UI shown — consent not required, auto-granting.");
            if (!TcfPrefs.hasDecision(context)) {
                TcfPrefs.writeStub(context, true);
            }
            resolveWait(callback, true);
        };
        handler.postDelayed(pendingNoUiTimeout, delayMs);
    }

    private void cancelNoUiTimeout() {
        if (pendingNoUiTimeout != null) {
            handler.removeCallbacks(pendingNoUiTimeout);
            pendingNoUiTimeout = null;
        }
    }

    private void cancelWait() {
        if (pendingTimeout != null) {
            handler.removeCallbacks(pendingTimeout);
            pendingTimeout = null;
        }
        cancelNoUiTimeout();
        if (pendingListener != null) {
            TcfPrefs.prefs(context).unregisterOnSharedPreferenceChangeListener(pendingListener);
            pendingListener = null;
        }
        cmpCallback.setListener(null);
    }

    private void resolveWait(ConsentCallback callback, boolean granted) {
        cancelWait();
        callback.onDecision(granted);
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
        data.put("provider", "inmobi");
        return data;
    }

    @Override
    public void resetConsent() {
        TcfPrefs.clear(context);
        sdkStarted = false;
        Logger.info(TAG, "InMobi consent reset. Call requestConsentInfo() to re-prompt.");
    }
}
