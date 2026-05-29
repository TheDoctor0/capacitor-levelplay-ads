package com.capacitor.plugins.levelplay.privacy;

import com.unity3d.mediation.LevelPlay;
import com.unity3d.mediation.LevelPlayPrivacySettings;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Forwards privacy signals to LevelPlay only — no mediated network SDK is ever
 * touched directly. LevelPlay propagates GDPR / CCPA / COPPA to every adapter.
 */
public class PrivacyExecutor {

    /**
     * Canonical GDPR consent map. {@link LevelPlayPrivacySettings#setGDPRConsents}
     * replaces the SDK's whole map on every call, so this executor owns the full
     * map and always re-sends it (Risk #1).
     */
    private final Map<String, Boolean> gdprConsents = new HashMap<>();

    /**
     * @param granted  user's GDPR consent decision
     * @param networks per-network keys to scope the consent to; empty applies
     *                 only the global flag
     */
    public void setUserConsent(boolean granted, List<String> networks) {
        // Global GDPR flag — forwarded to LevelPlay core and every adapter.
        LevelPlay.setConsent(granted);

        if (networks != null) {
            for (String network : networks) {
                if (network != null && !network.isEmpty()) {
                    gdprConsents.put(network, granted);
                }
            }
        }
        if (!gdprConsents.isEmpty()) {
            // Re-send the full canonical map — partial maps would wipe the rest.
            LevelPlayPrivacySettings.setGDPRConsents(new HashMap<>(gdprConsents));
        }
    }

    /**
     * Apply a global GDPR flag plus an explicit per-network consent map produced
     * by the rich custom modal. The canonical map is re-sent in full (Risk #1).
     *
     * @param granted         global GDPR consent forwarded to LevelPlay core
     * @param networkConsents per-LevelPlay-network grants, keyed by network key
     */
    public void setUserConsents(boolean granted, Map<String, Boolean> networkConsents) {
        LevelPlay.setConsent(granted);

        if (networkConsents != null) {
            for (Map.Entry<String, Boolean> entry : networkConsents.entrySet()) {
                if (entry.getKey() != null && !entry.getKey().isEmpty() && entry.getValue() != null) {
                    gdprConsents.put(entry.getKey(), entry.getValue());
                }
            }
        }
        if (!gdprConsents.isEmpty()) {
            LevelPlayPrivacySettings.setGDPRConsents(new HashMap<>(gdprConsents));
        }
    }

    public void setCCPA(boolean doNotSell) {
        LevelPlayPrivacySettings.setCCPA(doNotSell);
    }

    public void setCOPPA(boolean isChildDirected) {
        LevelPlayPrivacySettings.setCOPPA(isChildDirected);
    }
}
