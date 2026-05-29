package com.capacitor.plugins.levelplay.consent;

import android.content.Context;
import android.content.SharedPreferences;

import java.util.Map;

/**
 * Helpers for reading and writing the IAB TCF v2.x keys that every CMP — and
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
    public static final String KEY_CMP_SDK_VERSION = "IABTCF_CmpSdkVersion";
    public static final String KEY_POLICY_VERSION = "IABTCF_PolicyVersion";
    public static final String KEY_PUBLISHER_CC = "IABTCF_PublisherCC";
    public static final String KEY_PURPOSE_ONE_TREATMENT = "IABTCF_PurposeOneTreatment";
    public static final String KEY_USE_NON_STANDARD_TEXTS = "IABTCF_UseNonStandardTexts";
    public static final String KEY_PURPOSE_LI = "IABTCF_PurposeLegitimateInterests";
    public static final String KEY_VENDOR_LI = "IABTCF_VendorLegitimateInterests";
    public static final String KEY_SPECIAL_FEATURES = "IABTCF_SpecialFeaturesOptIns";
    public static final String KEY_ADDTL_CONSENT = "IABTCF_AddtlConsent";
    /** Plugin-private: which service IDs the user left enabled (CSV), for restore. */
    public static final String KEY_CONSENTED_SERVICES = "levelplay_consented_services";

    /** Every key this helper may write, for a clean {@link #clear(Context)}. */
    private static final String[] ALL_KEYS = {
            KEY_TC_STRING, KEY_GDPR_APPLIES, KEY_CMP_SDK_ID, KEY_PURPOSE_CONSENTS,
            KEY_VENDOR_CONSENTS, KEY_CMP_SDK_VERSION, KEY_POLICY_VERSION, KEY_PUBLISHER_CC,
            KEY_PURPOSE_ONE_TREATMENT, KEY_USE_NON_STANDARD_TEXTS, KEY_PURPOSE_LI,
            KEY_VENDOR_LI, KEY_SPECIAL_FEATURES, KEY_ADDTL_CONSENT, KEY_CONSENTED_SERVICES,
    };

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
     * minimal TC string. Used by the legacy custom alert so adapters at least
     * see consistent keys, even though the string isn't a real TCF payload.
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

    /**
     * Writes a TCF v2.3-compatible key map produced by the rich custom modal.
     * Integer values are stored as ints (e.g. {@code IABTCF_gdprApplies}); all
     * others as strings (e.g. the binary {@code IABTCF_PurposeConsents} field).
     */
    public static void writeKeys(Context ctx, Map<String, Object> keys) {
        SharedPreferences.Editor e = prefs(ctx).edit();
        for (Map.Entry<String, Object> entry : keys.entrySet()) {
            Object v = entry.getValue();
            if (v instanceof Integer) {
                e.putInt(entry.getKey(), (Integer) v);
            } else if (v instanceof Number) {
                e.putInt(entry.getKey(), ((Number) v).intValue());
            } else if (v != null) {
                e.putString(entry.getKey(), v.toString());
            }
        }
        e.apply();
    }

    public static void clear(Context ctx) {
        SharedPreferences.Editor e = prefs(ctx).edit();
        for (String key : ALL_KEYS) e.remove(key);
        e.apply();
    }
}
