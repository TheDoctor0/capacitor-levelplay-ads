package com.emi.plugins.levelplay;

import com.getcapacitor.JSObject;
import com.unity3d.mediation.LevelPlayAdError;
import com.unity3d.mediation.LevelPlayAdInfo;
import com.unity3d.mediation.impression.LevelPlayImpressionData;

/**
 * Converts LevelPlay SDK value objects into Capacitor {@link JSObject}s.
 */
public final class AdJsonUtil {

    private AdJsonUtil() {}

    public static JSObject adInfoToJS(LevelPlayAdInfo info) {
        JSObject o = new JSObject();
        if (info == null) return o;
        o.put("adUnitId", info.getAdUnitId());
        o.put("adUnitName", info.getAdUnitName());
        o.put("adFormat", info.getAdFormat());
        o.put("adNetwork", info.getAdNetwork());
        o.put("instanceName", info.getInstanceName());
        o.put("placementName", info.getPlacementName());
        o.put("country", info.getCountry());
        o.put("revenue", info.getRevenue());
        o.put("precision", info.getPrecision());
        o.put("creativeId", info.getCreativeId());
        o.put("auctionId", info.getAuctionId());
        o.put("adId", info.getAdId());
        return o;
    }

    public static JSObject adErrorToJS(LevelPlayAdError error) {
        JSObject o = new JSObject();
        if (error == null) return o;
        o.put("errorCode", error.getErrorCode());
        o.put("errorMessage", error.getErrorMessage());
        o.put("adUnitId", error.getAdUnitId());
        o.put("adId", error.getAdId());
        return o;
    }

    public static JSObject impressionToJS(LevelPlayImpressionData data) {
        JSObject o = new JSObject();
        if (data == null) return o;
        o.put("revenue", data.getRevenue());
        o.put("adNetwork", data.getAdNetwork());
        o.put("adUnitName", data.getMediationAdUnitName());
        o.put("adUnitId", data.getMediationAdUnitId());
        o.put("adFormat", data.getAdFormat());
        o.put("instanceName", data.getInstanceName());
        o.put("placement", data.getPlacement());
        o.put("country", data.getCountry());
        o.put("precision", data.getPrecision());
        o.put("auctionId", data.getAuctionId());
        o.put("creativeId", data.getCreativeId());
        o.put("segmentName", data.getSegmentName());
        return o;
    }
}
