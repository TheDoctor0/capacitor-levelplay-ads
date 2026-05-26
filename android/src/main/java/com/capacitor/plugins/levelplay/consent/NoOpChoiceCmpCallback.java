package com.capacitor.plugins.levelplay.consent;

import com.inmobi.cmp.ChoiceCmpCallback;
import com.inmobi.cmp.core.model.ACData;
import com.inmobi.cmp.core.model.GDPRData;
import com.inmobi.cmp.core.model.gbc.GoogleBasicConsents;
import com.inmobi.cmp.core.model.mspa.USRegulationData;
import com.inmobi.cmp.model.ActionButton;
import com.inmobi.cmp.model.ChoiceError;
import com.inmobi.cmp.model.DisplayInfo;
import com.inmobi.cmp.model.NonIABData;
import com.inmobi.cmp.model.PingReturn;

import org.jetbrains.annotations.NotNull;

/**
 * {@link ChoiceCmpCallback} that forwards CMP errors to a registered listener.
 * All other callbacks are no-ops — consent is read from the standard
 * {@code IABTCF_*} SharedPreferences keys (see {@link TcfPrefs}).
 */
class NoOpChoiceCmpCallback implements ChoiceCmpCallback {

    interface Listener {
        void onCmpError(String message);
        void onCmpLoaded();
        void onUiVisible(boolean visible);
    }

    private volatile Listener listener;

    void setListener(Listener l) {
        this.listener = l;
    }

    @Override public void onCmpError(@NotNull ChoiceError e) {
        Listener l = listener;
        if (l != null) l.onCmpError(e.toString());
    }
    @Override public void onCmpLoaded(@NotNull PingReturn p) {
        Listener l = listener;
        if (l != null) l.onCmpLoaded();
    }
    @Override public void onCMPUIStatusChanged(@NotNull DisplayInfo d) {
        Listener l = listener;
        if (l != null) l.onUiVisible(d.getDisplayStatus() == com.inmobi.cmp.core.cmpapi.status.DisplayStatus.VISIBLE);
    }
    @Override public void onCCPAConsentGiven(@NotNull String s) {}
    @Override public void onGoogleBasicConsentChange(@NotNull GoogleBasicConsents g) {}
    @Override public void onGoogleVendorConsentGiven(@NotNull ACData a) {}
    @Override public void onIABVendorConsentGiven(@NotNull GDPRData g) {}
    @Override public void onNonIABVendorConsentGiven(@NotNull NonIABData n) {}
    @Override public void onReceiveUSRegulationsConsent(@NotNull USRegulationData u) {}
    @Override public void onUserMovedToOtherState() {}
    @Override public void onActionButtonClicked(@NotNull ActionButton a) {}
}
