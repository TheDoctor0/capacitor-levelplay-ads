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
 * No-op {@link ChoiceCmpCallback}. We read consent from the standard
 * {@code IABTCF_*} SharedPreferences keys (see {@link TcfPrefs}), so the
 * callback methods are intentionally empty.
 */
class NoOpChoiceCmpCallback implements ChoiceCmpCallback {
    @Override public void onCCPAConsentGiven(@NotNull String s) {}
    @Override public void onCmpError(@NotNull ChoiceError e) {}
    @Override public void onCmpLoaded(@NotNull PingReturn p) {}
    @Override public void onCMPUIStatusChanged(@NotNull DisplayInfo d) {}
    @Override public void onGoogleBasicConsentChange(@NotNull GoogleBasicConsents g) {}
    @Override public void onGoogleVendorConsentGiven(@NotNull ACData a) {}
    @Override public void onIABVendorConsentGiven(@NotNull GDPRData g) {}
    @Override public void onNonIABVendorConsentGiven(@NotNull NonIABData n) {}
    @Override public void onReceiveUSRegulationsConsent(@NotNull USRegulationData u) {}
    @Override public void onUserMovedToOtherState() {}
    @Override public void onActionButtonClicked(@NotNull ActionButton a) {}
}
