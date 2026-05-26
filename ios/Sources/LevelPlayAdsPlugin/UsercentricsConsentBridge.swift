import Foundation
import UIKit

#if canImport(UsercentricsUI)
import UsercentricsUI
#endif

#if canImport(Usercentrics)
import Usercentrics
#endif

/// Wrapper around the Usercentrics CMP SDK. Mirrors `InMobiConsentBridge` —
/// everything is conditionally compiled so the package still builds when the
/// pods are absent.
///
/// The SDK is initialized lazily from `LevelPlayAdsImpl.requestConsent()`
/// when the host app's `consentProvider` is `"usercentrics"`.
enum UsercentricsConsentBridge {

    private static var configured = false

    static var isAvailable: Bool {
#if canImport(UsercentricsUI) && canImport(Usercentrics)
        return true
#else
        return false
#endif
    }

    static func settingsIdFromBundle() -> String? {
        return Bundle.main.object(forInfoDictionaryKey: "LevelPlayUsercentricsSettingsId") as? String
    }

    static func rulesetIdFromBundle() -> String? {
        return Bundle.main.object(forInfoDictionaryKey: "LevelPlayUsercentricsRulesetId") as? String
    }

    /// Configure the SDK (once). Returns nil on success, or an error string.
    @discardableResult
    static func configureIfNeeded() -> String? {
#if canImport(Usercentrics)
        if configured { return nil }
        guard let settingsId = settingsIdFromBundle(), !settingsId.isEmpty else {
            return "Usercentrics CMP enabled but LevelPlayUsercentricsSettingsId missing from Info.plist."
        }
        let options = UsercentricsOptions()
        options.settingsId = settingsId
        if let rulesetId = rulesetIdFromBundle(), !rulesetId.isEmpty {
            options.ruleSetId = rulesetId
        }
        options.consentMediation = true
        UsercentricsCore.configure(options: options)
        configured = true
        return nil
#else
        return "Usercentrics SDK not bundled. Run `npx cap sync`."
#endif
    }

    /// Checks if the SDK is ready and whether consent needs to be collected.
    static func isReady(
        onSuccess: @escaping (_ shouldCollect: Bool) -> Void,
        onFailure: @escaping (String) -> Void
    ) {
#if canImport(Usercentrics)
        UsercentricsCore.isReady { status in
            onSuccess(status.shouldCollectConsent)
        } onFailure: { error in
            onFailure(error.localizedDescription)
        }
#else
        onFailure("Usercentrics SDK not bundled.")
#endif
    }

    /// Shows the first-layer (initial) consent banner.
    static func showFirstLayer(
        on viewController: UIViewController,
        completion: @escaping (Bool) -> Void
    ) {
#if canImport(UsercentricsUI)
        DispatchQueue.main.async {
            let banner = UsercentricsBanner()
            banner.showFirstLayer(hostView: viewController) { response in
                let granted = mapInteraction(response)
                if !TcfPrefs.hasDecision() { TcfPrefs.writeStub(granted: granted) }
                completion(granted)
            }
        }
#else
        completion(true)
#endif
    }

    /// Shows the second-layer (detailed) consent banner.
    static func showSecondLayer(
        on viewController: UIViewController,
        completion: @escaping (Bool) -> Void
    ) {
#if canImport(UsercentricsUI)
        DispatchQueue.main.async {
            let banner = UsercentricsBanner()
            banner.showSecondLayer(hostView: viewController) { response in
                let granted = mapInteraction(response)
                if !TcfPrefs.hasDecision() { TcfPrefs.writeStub(granted: granted) }
                completion(granted)
            }
        }
#else
        completion(true)
#endif
    }

    static func reset() {
#if canImport(Usercentrics)
        guard configured else { return }
        configured = false
        UsercentricsCore.shared.clearUserSession(onSuccess: { _ in }, onError: { _ in })
#endif
    }

#if canImport(UsercentricsUI)
    private static func mapInteraction(_ response: UsercentricsConsentUserResponse) -> Bool {
        NSLog("[LevelPlayAds] Usercentrics userInteraction=\(response.userInteraction) controllerId=\(response.controllerId)")
        if response.userInteraction == .denyAll {
            NSLog("[LevelPlayAds] Usercentrics mapped to granted=false (denyAll)")
            return false
        }
        // acceptAll, granular (user confirmed per-service choices), noInteraction
        // all count as consent given. granular means the user actively went through
        // the flow and submitted — Usercentrics writes the real per-purpose TCF
        // string asynchronously, but the decision itself is affirmative.
        NSLog("[LevelPlayAds] Usercentrics mapped to granted=true (\(response.userInteraction))")
        return true
    }
#endif
}
