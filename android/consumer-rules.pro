# Consumer ProGuard rules shipped with the capacitor-levelplay-ads AAR.
# Applied to any app that depends on this plugin, so R8/minify doesn't
# strip the dynamically-loaded LevelPlay mediation SDK + network adapters.

# LevelPlay / IronSource SDK
-keep class com.ironsource.** { *; }
-dontwarn com.ironsource.**

# Unity SDK + Unity Ads adapter
-keep class com.unity3d.** { *; }
-dontwarn com.unity3d.**

# AdMob / Google Mobile Ads adapter
-keep class com.google.android.gms.ads.** { *; }
-dontwarn com.google.android.gms.ads.**

# Meta Audience Network adapter
-keep class com.facebook.ads.** { *; }
-dontwarn com.facebook.ads.**

# AppLovin adapter
-keep class com.applovin.** { *; }
-dontwarn com.applovin.**

# Vungle / Liftoff adapter
-keep class com.vungle.** { *; }
-dontwarn com.vungle.**

# Mintegral adapter
-keep class com.mbridge.** { *; }
-dontwarn com.mbridge.**

# Pangle / ByteDance adapter
-keep class com.bytedance.** { *; }
-dontwarn com.bytedance.**

# Chartboost adapter
-keep class com.chartboost.** { *; }
-dontwarn com.chartboost.**

# Advertising ID + Google Play Services
-keep class com.google.android.gms.common.** { *; }
-dontwarn com.google.android.gms.common.**

# InMobi Choice CMP
-keep class com.inmobi.cmp.ChoiceCmp {public protected *;}
-keep interface com.inmobi.cmp.ChoiceCmpCallback {public protected *;}
-keep class com.inmobi.cmp.model.ChoiceError {public protected *;}
-keep class com.inmobi.cmp.model.NonIABData {public protected *;}
-keep class com.inmobi.cmp.model.PingReturn {public protected *;}
-keep class com.inmobi.cmp.core.model.ACData {public protected *;}
-keep class com.inmobi.cmp.core.model.GDPRData {public protected *;}
-keep class com.inmobi.cmp.core.model.gbc.GoogleBasicConsents {public protected *;}
-keep class com.inmobi.cmp.core.model.Vector { *;}
-keep class com.inmobi.cmp.core.model.mspa.USRegulationData {public protected *;}
-keep class com.inmobi.cmp.data.model.ChoiceStyle {public protected *;}
-keep class com.inmobi.cmp.data.model.ChoiceColor {public protected *;}
-keep class com.inmobi.cmp.model.DisplayInfo {public protected *;}
-keep class com.inmobi.cmp.model.ActionButton {public protected *;}

# Gson (required by InMobi CMP)
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class * extends com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
-keepclassmembers,allowobfuscation class * {
  @com.google.gson.annotations.SerializedName <fields>;
}
-keep class com.google.gson.reflect.TypeToken
-keep class * extends com.google.gson.reflect.TypeToken
-keep public class * implements java.lang.reflect.Type
