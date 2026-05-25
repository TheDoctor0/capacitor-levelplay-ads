import Foundation
import UIKit

#if canImport(InMobiCMP)
import InMobiCMP
#endif

/// Tiny wrapper around the InMobi Choice CMP SDK. The SDK is an opt-in pod
/// pulled in by levelplay-manifest.js only when `levelplay.consentProvider`
/// is "inmobi". Everything is conditionally compiled so the package still
/// builds when the pod is absent.
///
/// Init must happen from `AppDelegate.didFinishLaunchingWithOptions`; that
/// hook is wired in `LevelPlayAdsPlugin.load()` via a notification.
enum InMobiConsentBridge {

    /// True if the InMobi pod was bundled at build time.
    static var isAvailable: Bool {
#if canImport(InMobiCMP)
        return true
#else
        return false
#endif
    }

    /// Reads the host app's Info.plist for the pCode written by the manifest
    /// script. Returns nil when the plugin's consent mode is "custom" or the
    /// integrator forgot to configure it.
    static func pCodeFromBundle() -> String? {
        return Bundle.main.object(forInfoDictionaryKey: "LevelPlayInMobiPCode") as? String
    }

    static func providerFromBundle() -> String {
        let v = Bundle.main.object(forInfoDictionaryKey: "LevelPlayCMPProvider") as? String
        return (v ?? "inmobi").lowercased()
    }

    /// Call once at app launch. Idempotent.
    static func startIfConfigured() {
#if canImport(InMobiCMP)
        guard providerFromBundle() == "inmobi" else { return }
        guard let pCode = pCodeFromBundle(), !pCode.isEmpty else {
            print("[LevelPlay] InMobi CMP enabled but LevelPlayInMobiPCode missing from Info.plist.")
            return
        }
        ChoiceCmp.shared.startChoice(
            pcode: pCode,
            delegate: NoOpChoiceCmpDelegate.shared,
            shouldDisplayIDFA: true
        )
#endif
    }

    /// Re-shows the CMP UI on demand (privacy options button).
    static func forceDisplayUI() {
#if canImport(InMobiCMP)
        ChoiceCmp.shared.forceDisplayUI()
#endif
    }
}

#if canImport(InMobiCMP)
import InMobiCMP

/// No-op delegate — consent read from UserDefaults IABTCF_* keys, not callbacks.
/// Retained as a static singleton (InMobi holds a weak ref to the delegate).
private class NoOpChoiceCmpDelegate: NSObject, ChoiceCmpDelegate {
    static let shared = NoOpChoiceCmpDelegate()
    func cmpDidLoad(info: PingResponse) {}
    func cmpUIStatusChanged(info: DisplayInfo) {}
    func didReceiveIABVendorConsent(gdprData: GDPRData, updated: Bool) {}
    func didReceiveNonIABVendorConsent(nonIabData: NonIABData, updated: Bool) {}
    func didReceiveAdditionalConsent(acData: ACData, updated: Bool) {}
    func cmpDidError(error: Error) {}
    func didReceiveCCPAConsent(string: String) {}
    func didReceiveUSRegulationsConsent(usRegData: USRegulationsData) {}
    func userDidMoveToOtherState() {}
    func didReceiveActionButtonTap(action: ActionButtons) {}
}
#endif
