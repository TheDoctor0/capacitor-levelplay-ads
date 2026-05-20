package com.emi.plugins.levelplay.consent;

/** Async result of a consent request. */
public interface ConsentCallback {
    void onDecision(boolean granted);
    void onError(String error);
}
