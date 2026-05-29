package com.capacitor.plugins.levelplay.consent;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.text.TextUtils;

import com.getcapacitor.JSObject;

/**
 * Default {@link ConsentProvider}: a native accept/decline dialog whose outcome
 * is persisted in {@link SharedPreferences}. No IAB TCF CMP is involved — the
 * decision is a single boolean forwarded to {@code PrivacyExecutor}.
 */
public class CustomModalConsentProvider implements ConsentProvider {

    private static final String PREFS = "levelplay_consent";
    private static final String KEY_STATUS = "consent_status";

    private final Context context;

    public CustomModalConsentProvider(Context context) {
        this.context = context.getApplicationContext();
    }

    private SharedPreferences prefs() {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    @Override
    public ConsentStatus getStatus() {
        // The rich modal persists its decision via the IABTCF_* keys, which are
        // the source of truth; the legacy alert's boolean is the fallback.
        if (TcfPrefs.hasDecision(context)) {
            return TcfPrefs.isGranted(context) ? ConsentStatus.GRANTED : ConsentStatus.DENIED;
        }
        String s = prefs().getString(KEY_STATUS, null);
        if (ConsentStatus.GRANTED.name().equals(s)) return ConsentStatus.GRANTED;
        if (ConsentStatus.DENIED.name().equals(s)) return ConsentStatus.DENIED;
        return ConsentStatus.UNKNOWN;
    }

    private void store(boolean granted) {
        prefs().edit()
                .putString(KEY_STATUS, (granted ? ConsentStatus.GRANTED : ConsentStatus.DENIED).name())
                .apply();
        // Mirror the decision into the IAB TCF keys so mediation adapters
        // see consistent state even without a real CMP. This is a stub —
        // it sets gdprApplies=0 so adapters fall back to non-GDPR flow.
        TcfPrefs.writeStub(context, granted);
    }

    @Override
    public void requestConsent(Activity activity, JSObject options, ConsentCallback callback) {
        ConsentStatus current = getStatus();
        if (current != ConsentStatus.UNKNOWN) {
            // Honor the existing decision without re-prompting.
            callback.onDecision(current == ConsentStatus.GRANTED);
            return;
        }
        showModal(activity, options, callback);
    }

    @Override
    public void showPrivacyOptions(Activity activity, JSObject options, ConsentCallback callback) {
        // Always re-prompt so the user can revise an earlier decision.
        showModal(activity, options, callback);
    }

    private void showModal(Activity activity, JSObject options, ConsentCallback callback) {
        if (activity == null) {
            callback.onError("No foreground activity to display the consent modal.");
            return;
        }
        final JSObject opts = options != null ? options : new JSObject();
        activity.runOnUiThread(() -> {
            try {
                String title = opts.getString("title", "We value your privacy");
                String message = opts.getString("message",
                        "We and our partners use data to deliver and measure personalized ads. "
                                + "You can accept or decline personalized advertising.");
                String acceptText = opts.getString("acceptButtonText", "Accept");
                String declineText = opts.getString("declineButtonText", "Decline");
                final String privacyUrl = opts.getString("privacyPolicyUrl", null);

                AlertDialog.Builder b = new AlertDialog.Builder(activity);
                b.setTitle(title);
                b.setMessage(message);
                b.setCancelable(false);
                b.setPositiveButton(acceptText, (d, w) -> {
                    store(true);
                    callback.onDecision(true);
                });
                b.setNegativeButton(declineText, (d, w) -> {
                    store(false);
                    callback.onDecision(false);
                });
                if (!TextUtils.isEmpty(privacyUrl)) {
                    b.setNeutralButton("Privacy policy", (d, w) -> {
                        try {
                            activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(privacyUrl)));
                        } catch (Exception ignored) {
                            // Browser unavailable — ignore and re-show the modal.
                        }
                        // The neutral button dismisses the dialog; re-prompt so a
                        // decision is still required.
                        showModal(activity, opts, callback);
                    });
                }
                b.show();
            } catch (Exception e) {
                callback.onError(e.getMessage());
            }
        });
    }

    @Override
    public void resetConsent() {
        prefs().edit().remove(KEY_STATUS).apply();
        TcfPrefs.clear(context);
    }

    @Override
    public JSObject getConsentData() {
        ConsentStatus status = getStatus();
        JSObject data = new JSObject();
        data.put("status", status.name());
        data.put("granted", status == ConsentStatus.GRANTED);
        data.put("canRequestAds", status != ConsentStatus.UNKNOWN);
        data.put("provider", "custom");
        String tc = TcfPrefs.prefs(context).getString(TcfPrefs.KEY_TC_STRING, null);
        if (!TextUtils.isEmpty(tc)) data.put("tcString", tc);
        return data;
    }
}
