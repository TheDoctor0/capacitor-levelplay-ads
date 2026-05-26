# Consumer ProGuard rules shipped with the capacitor-levelplay-ads AAR.
# Applied to any app that depends on this plugin, so R8/minify doesn't
# strip the dynamically-loaded LevelPlay mediation SDK + network adapters.

# LevelPlay / IronSource SDK
-keep class com.ironsource.** { *; }
-dontwarn com.ironsource.**

# Unity SDK + Unity Ads adapter
-keepattributes JavascriptInterface
-keep class android.webkit.JavascriptInterface { *; }
-keep class com.unity3d.** { *; }
-dontwarn com.unity3d.**
-dontwarn com.google.ar.core.**

# AdMob / Google Mobile Ads adapter
-keep class com.google.android.gms.ads.** { *; }
-dontwarn com.google.android.gms.ads.**

# Meta Audience Network adapter
-keep public class com.facebook.ads.** { public protected *; }
-dontwarn com.facebook.ads.internal.**
-keeppackagenames com.facebook.*

# AppLovin adapter
-keepattributes Signature,InnerClasses,Exceptions,Annotation
-keep public class com.applovin.sdk.AppLovinSdk { *; }
-keep public class com.applovin.sdk.AppLovin* { public protected *; }
-keep public class com.applovin.nativeAds.AppLovin* { public protected *; }
-keep public class com.applovin.adview.* { public protected *; }
-keep public class com.applovin.mediation.* { public protected *; }
-keep public class com.applovin.mediation.ads.* { public protected *; }
-keep class com.applovin.mediation.adapters.** { *; }
-keep class com.applovin.mediation.adapter.** { *; }
-keep class com.applovin.impl.** { public protected *; }
-keepclassmembers class com.applovin.sdk.AppLovinSdkSettings { private java.util.Map localSettings; }
-dontwarn com.applovin.**

# Vungle / Liftoff adapter
-keep class com.vungle.** { *; }
-dontwarn com.vungle.**
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn okio.**
-dontwarn retrofit2.Platform$Java8

# Mintegral adapter
-keep class com.mbridge.** { *; }
-keep interface com.mbridge.** { *; }
-dontwarn com.mbridge.**
-keep class **.R$* { public static final int mbridge*; }
-keep public class com.mbridge.* extends androidx.** { *; }
-keep public class androidx.viewpager.widget.PagerAdapter { *; }
-keep public class androidx.viewpager.widget.ViewPager.OnPageChangeListener { *; }
-keep public class androidx.fragment.app.Fragment { *; }
-keep public class androidx.core.content.FileProvider { *; }
-keep public class androidx.core.app.NotificationCompat { *; }
-keep public class androidx.appcompat.widget.AppCompatImageView { *; }
-keep public class androidx.recyclerview.** { *; }

# Pangle / ByteDance adapter
-keep class com.bytedance.** { *; }
-keep class com.pangle.** { *; }
-dontwarn com.bytedance.**
-dontwarn com.pangle.**

# Chartboost adapter
-keep class com.chartboost.** { *; }
-dontwarn com.chartboost.**

# InMobi (mediation network)
-keep class com.inmobi.** { *; }
-dontwarn com.inmobi.**
-keep class com.squareup.picasso.** { *; }
-dontwarn com.squareup.picasso.**
-dontwarn com.squareup.okhttp.**
-keep class com.moat.** { *; }
-dontwarn com.moat.**
-keep class com.integralads.avid.library.* { *; }

# Fyber / DT Exchange
-keep class com.fyber.** { *; }
-dontwarn com.fyber.**

# Moloco
-keep class com.moloco.** { *; }
-dontwarn com.moloco.**

# Bigo Ads
-keep class com.bigossp.** { *; }
-dontwarn com.bigossp.**

# HyprMX
-keep class com.hyprmx.** { *; }
-dontwarn com.hyprmx.**

# MobileFuse
-keep class com.mobilefuse.** { *; }
-dontwarn com.mobilefuse.**

# Amazon APS
-keep class com.amazon.device.ads.** { *; }
-dontwarn com.amazon.device.ads.**

# BidMachine
-keep class io.bidmachine.** { *; }
-dontwarn io.bidmachine.**

# Smaato
-keep class com.smaato.** { *; }
-dontwarn com.smaato.**

# Verve / PubNative
-keep class net.pubnative.** { *; }
-dontwarn net.pubnative.**

# Ogury
-keep class co.ogury.** { *; }
-dontwarn co.ogury.**

# SuperAwesome
-keep class tv.superawesome.** { *; }
-dontwarn tv.superawesome.**

# Yandex Ads
-keep class com.yandex.mobile.ads.** { *; }
-dontwarn com.yandex.mobile.ads.**

# myTarget
-keep class com.my.target.** { *; }
-dontwarn com.my.target.**

# LINE / FiveAd
-keep class com.five_corp.** { *; }
-dontwarn com.five_corp.**

# PubMatic
-keep class com.pubmatic.** { *; }
-dontwarn com.pubmatic.**

# YSO Network
-keep class com.ysocorp.** { *; }
-dontwarn com.ysocorp.**

# Voodoo / ADN
-keep class io.adn.** { *; }
-dontwarn io.adn.**

# Advertising ID + Google Play Services
-keep class com.google.android.gms.common.** { *; }
-dontwarn com.google.android.gms.common.**
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient { public *; }
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient$Info { public *; }
-keep class com.google.android.gms.internal.** { *; }
-dontwarn com.google.android.gms.ads.identifier.**

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

# Usercentrics CMP
-keep class com.usercentrics.** { *; }
-dontwarn com.usercentrics.**

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
