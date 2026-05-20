package com.emi.plugins.levelplay.consent;

/** Tri-state outcome of the consent flow. */
public enum ConsentStatus {
    /** No decision recorded yet — ad calls are gated until this changes. */
    UNKNOWN,
    /** User accepted personalized advertising. */
    GRANTED,
    /** User declined personalized advertising. */
    DENIED
}
