package com.capacitor.plugins.levelplay.consent;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

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

    private final Context context;
    private boolean sdkStarted = false;
    private SharedPreferences.OnSharedPreferenceChangeListener pendingListener;

    public InMobiConsentProvider(Context context) {
        this.context = context.getApplicationContext();
    }

    @Override
    public void requestConsent(Activity activity, JSObject options, ConsentCallback callback) {
        if (TcfPrefs.hasDecision(context)) {
            callback.onDecision(TcfPrefs.isGranted(context));
            return;
        }
        waitForTcfDecision(callback);
        ensureSdkStarted();
    }

    @Override
    public void showPrivacyOptions(Activity activity, JSObject options, ConsentCallback callback) {
        if (activity == null) {
            callback.onError("No foreground activity to display the CMP.");
            return;
        }
        ensureSdkStarted();
        waitForTcfDecision(callback);
        try {
            ChoiceCmp.INSTANCE.forceDisplayUI(activity);
        } catch (NoClassDefFoundError e) {
            callback.onError("InMobi Choice SDK not on classpath. Run `npx cap sync`.");
        } catch (Exception e) {
            callback.onError("Failed to show CMP: " + e.getMessage());
        }
    }

    private void ensureSdkStarted() {
        if (sdkStarted) return;

        String pCode = readString("levelplay_inmobi_pcode");
        if (pCode == null || pCode.isEmpty()) {
            Logger.warn(TAG, "InMobi CMP: levelplay_inmobi_pcode resource missing.");
            return;
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
            ChoiceCmp.INSTANCE.startChoice(app, packageId, pCode, new NoOpChoiceCmpCallback(), style);
            sdkStarted = true;
            Logger.info(TAG, "InMobi Choice CMP started.");
        } catch (NoClassDefFoundError e) {
            Logger.error(TAG, "InMobi CMP not on classpath. Run `npx cap sync`.", e);
        } catch (Exception e) {
            Logger.error(TAG, "InMobi Choice CMP start failed: " + e.getMessage(), e);
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
        pendingListener = (sp, key) -> {
            if (TcfPrefs.KEY_TC_STRING.equals(key) || TcfPrefs.KEY_GDPR_APPLIES.equals(key)) {
                sp.unregisterOnSharedPreferenceChangeListener(pendingListener);
                pendingListener = null;
                callback.onDecision(TcfPrefs.isGranted(context));
            }
        };
        prefs.registerOnSharedPreferenceChangeListener(pendingListener);
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
