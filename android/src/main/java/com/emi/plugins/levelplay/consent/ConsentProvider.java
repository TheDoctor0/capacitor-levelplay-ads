package com.emi.plugins.levelplay.consent;

import android.app.Activity;

import com.getcapacitor.JSObject;

/**
 * Pluggable consent strategy. The default {@link CustomModalConsentProvider}
 * shows a native dialog; integrators that need an IAB TCF CMP can supply their
 * own implementation.
 */
public interface ConsentProvider {

    /** Request a consent decision, prompting the user only if none exists. */
    void requestConsent(Activity activity, JSObject options, ConsentCallback callback);

    /** Re-prompt so the user can change a previously made decision. */
    void showPrivacyOptions(Activity activity, JSObject options, ConsentCallback callback);

    /** Current recorded decision. */
    ConsentStatus getStatus();

    /** Snapshot of the consent state for the JS layer. */
    JSObject getConsentData();
}
