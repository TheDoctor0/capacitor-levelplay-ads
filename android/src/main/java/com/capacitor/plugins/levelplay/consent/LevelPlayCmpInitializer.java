package com.capacitor.plugins.levelplay.consent;

import android.app.Application;
import android.content.Context;

import com.getcapacitor.Logger;
import com.inmobi.cmp.ChoiceCmp;
import com.inmobi.cmp.data.model.ChoiceStyle;
import com.inmobi.cmp.data.model.ThemeMode;

/**
 * Initializes the InMobi Choice CMP SDK. Called from
 * {@code LevelPlayAdsPlugin.load()} which runs inside the main Activity —
 * the SDK gets an Activity context and can auto-show the CMP UI when needed.
 */
public final class LevelPlayCmpInitializer {

    private static final String TAG = "LevelPlayAds";
    private static boolean initialized = false;

    private LevelPlayCmpInitializer() {}

    public static void initIfNeeded(Context context) {
        if (initialized) return;

        String provider = readString(context, "levelplay_cmp_provider");
        if (!"inmobi".equalsIgnoreCase(provider)) return;

        String pCode = readString(context, "levelplay_inmobi_pcode");
        if (pCode == null || pCode.isEmpty()) {
            Logger.warn(TAG, "InMobi CMP enabled but levelplay_inmobi_pcode resource is missing.");
            return;
        }
        String packageId = readString(context, "levelplay_inmobi_package_id");
        if (packageId == null || packageId.isEmpty()) {
            packageId = context.getPackageName();
        }

        try {
            Application app = (Application) context.getApplicationContext();
            ChoiceStyle style = new ChoiceStyle.Builder()
                    .setThemeMode(ThemeMode.AUTO)
                    .build();
            ChoiceCmp.INSTANCE.startChoice(app, packageId, pCode, new NoOpChoiceCmpCallback(), style);
            initialized = true;
            Logger.info(TAG, "InMobi Choice CMP initialized for package " + packageId + ".");
        } catch (NoClassDefFoundError e) {
            Logger.error(TAG, "InMobi CMP not on classpath. Run `npx cap sync`.", e);
        } catch (Exception e) {
            Logger.error(TAG, "InMobi Choice CMP init failed: " + e.getMessage(), e);
        }
    }

    private static String readString(Context ctx, String name) {
        int id = ctx.getResources().getIdentifier(name, "string", ctx.getPackageName());
        if (id == 0) return null;
        return ctx.getString(id);
    }
}
