package com.capacitor.plugins.levelplay.consent;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Helpers for reading and writing the IAB TCF v2.2 keys that every CMP — and
 * every LevelPlay mediation adapter — agrees on. The TCF keys live in the
 * app's default SharedPreferences (not a CMP-specific file), so any reader
 * with a Context can find them.
 */
public final class TcfPrefs {

    public static final String KEY_TC_STRING = "IABTCF_TCString";
    public static final String KEY_GDPR_APPLIES = "IABTCF_gdprApplies";
    public static final String KEY_CMP_SDK_ID = "IABTCF_CmpSdkID";
    public static final String KEY_PURPOSE_CONSENTS = "IABTCF_PurposeConsents";
    public static final String KEY_VENDOR_CONSENTS = "IABTCF_VendorConsents";

    private TcfPrefs() {}

    public static SharedPreferences prefs(Context ctx) {
        Context app = ctx.getApplicationContext();
        // Same file PreferenceManager.getDefaultSharedPreferences() uses,
        // resolved manually so we don't pull in androidx.preference.
        return app.getSharedPreferences(app.getPackageName() + "_preferences", Context.MODE_PRIVATE);
    }

    /**
     * Returns true if the user has granted consent for personalized ads under
     * TCF. Heuristic: GDPR doesn't apply OR purpose 1 (store/access info) is
     * consented. Mediation adapters use similar logic.
     */
    public static boolean isGranted(Context ctx) {
        SharedPreferences p = prefs(ctx);
        int gdprApplies = p.getInt(KEY_GDPR_APPLIES, -1);
        if (gdprApplies == 0) return true;
        String purposes = p.getString(KEY_PURPOSE_CONSENTS, "");
        return purposes != null && purposes.length() > 0 && purposes.charAt(0) == '1';
    }

    public static boolean hasDecision(Context ctx) {
        SharedPreferences p = prefs(ctx);
        return p.contains(KEY_TC_STRING) || p.contains(KEY_GDPR_APPLIES);
    }

    /**
     * Writes a permissive non-TCF-compliant stub: GDPR-does-not-apply + a
     * minimal TC string. Used by the custom modal so adapters at least see
     * consistent keys, even though the string isn't a real TCF v2.2 payload.
     */
    public static void writeStub(Context ctx, boolean granted) {
        SharedPreferences.Editor e = prefs(ctx).edit();
        // gdprApplies=0 → adapters skip TCF gate, fall back to whatever
        // setConsent(true/false) already told them.
        e.putInt(KEY_GDPR_APPLIES, 0);
        e.putInt(KEY_CMP_SDK_ID, 0);
        e.putString(KEY_PURPOSE_CONSENTS, granted ? "1111111111" : "0000000000");
        e.putString(KEY_VENDOR_CONSENTS, granted ? "1" : "0");
        // Leave KEY_TC_STRING absent — a fake string is worse than no string.
        e.apply();
    }

    public static void clear(Context ctx) {
        prefs(ctx).edit()
                .remove(KEY_TC_STRING)
                .remove(KEY_GDPR_APPLIES)
                .remove(KEY_CMP_SDK_ID)
                .remove(KEY_PURPOSE_CONSENTS)
                .remove(KEY_VENDOR_CONSENTS)
                .apply();
    }
}
