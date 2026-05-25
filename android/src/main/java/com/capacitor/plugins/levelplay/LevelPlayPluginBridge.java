package com.capacitor.plugins.levelplay;

import android.app.Activity;
import android.view.View;

import com.getcapacitor.JSObject;

/**
 * Thin contract the ad executors need from the hosting plugin.
 *
 * Decoupling executors from {@link LevelPlayAdsPlugin} lets each one be
 * exercised in isolation (Robolectric, fakes) without standing up a full
 * Capacitor bridge.
 */
public interface LevelPlayPluginBridge {

    /** Fire a Capacitor event to JS listeners. */
    void fireEvent(String eventName, JSObject data);

    /** Current foreground activity, or {@code null} if the app is backgrounded. */
    Activity getActivity();

    /** The Capacitor WebView (used by the banner to manage margins). */
    View getWebView();
}
