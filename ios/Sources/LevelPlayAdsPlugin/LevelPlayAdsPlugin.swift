import Foundation
import UIKit
import Capacitor

/// Capacitor bridge for the LevelPlay mediation plugin. Declares the JS-facing
/// methods and forwards them to ``LevelPlayAdsImpl``.
@objc(LevelPlayAdsPlugin)
public class LevelPlayAdsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "LevelPlayAdsPlugin"
    public let jsName = "LevelPlayAds"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "initialize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "launchTestSuite", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestConsentInfo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showPrivacyOptions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getConsentData", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resetConsent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "persistConsent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setCCPAConsent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setChildDirected", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestTrackingAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAdvertisingId", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "createBanner", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showBanner", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "hideBanner", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "destroyBanner", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updateBannerStyle", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadInterstitial", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isInterstitialReady", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showInterstitial", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadRewarded", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isRewardedReady", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showRewarded", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setDynamicUserId", returnType: CAPPluginReturnPromise)
    ]

    private let implementation = LevelPlayAdsImpl()

    public override func load() {
        super.load()
        implementation.emit = { [weak self] event, data in
            self?.notifyListeners(event, data: data)
        }
        UIDevice.current.beginGeneratingDeviceOrientationNotifications()
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(orientationDidChange),
            name: UIDevice.orientationDidChangeNotification,
            object: nil
        )
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
        UIDevice.current.endGeneratingDeviceOrientationNotifications()
    }

    @objc private func orientationDidChange() {
        let orientation: String
        switch UIDevice.current.orientation {
        case .landscapeLeft, .landscapeRight: orientation = "LANDSCAPE"
        case .portrait, .portraitUpsideDown: orientation = "PORTRAIT"
        default: return
        }
        notifyListeners("onOrientationChanged", data: ["orientation": orientation])
    }

    private var viewController: UIViewController? {
        return bridge?.viewController
    }

    private func readNetworks(_ call: CAPPluginCall) -> [String] {
        return call.getArray("networks", String.self) ?? []
    }

    private func ensureReady(_ call: CAPPluginCall) -> Bool {
        if !implementation.isInitialized {
            call.reject("LevelPlay is not initialized. Call initialize() first.")
            return false
        }
        if implementation.consentStatus() == "UNKNOWN" {
            call.reject("Consent decision required. Call requestConsentInfo() before loading ads.")
            return false
        }
        return true
    }

    // MARK: - Core

    @objc func initialize(_ call: CAPPluginCall) {
        guard let appKey = call.getString("appKey"), !appKey.isEmpty else {
            call.reject("appKey is required to initialize LevelPlay.")
            return
        }
        let userId = call.getString("userId")
        let isTesting = call.getBool("isTesting", false)

        implementation.initialize(appKey: appKey, userId: userId, isTesting: isTesting) { success, error in
            if success {
                call.resolve(["status": "INITIALIZED_SUCCESSFULLY"])
            } else {
                call.reject("LevelPlay init failed: \(error ?? "unknown error")")
            }
        }
    }

    @objc func setDynamicUserId(_ call: CAPPluginCall) {
        guard let userId = call.getString("userId"), !userId.isEmpty else {
            call.reject("userId is required.")
            return
        }
        implementation.setDynamicUserId(userId)
        call.resolve()
    }

    @objc func launchTestSuite(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let vc = self.viewController else {
                call.reject("No view controller available.")
                return
            }
            self.implementation.launchTestSuite(vc)
            call.resolve()
        }
    }

    // MARK: - Consent & privacy

    @objc func requestConsentInfo(_ call: CAPPluginCall) {
        let options = call.options as? [String: Any] ?? [:]
        implementation.requestConsent(viewController: viewController, options: options,
                                      networks: readNetworks(call)) { success, error in
            if success {
                let data = self.implementation.consentData()
                self.notifyListeners("onConsentStatusChanged", data: data)
                call.resolve(data)
            } else {
                call.reject(error ?? "Consent request failed.")
            }
        }
    }

    @objc func showPrivacyOptions(_ call: CAPPluginCall) {
        let options = call.options as? [String: Any] ?? [:]
        implementation.showPrivacyOptions(viewController: viewController, options: options,
                                          networks: readNetworks(call)) { success, error in
            if success {
                let data = self.implementation.consentData()
                self.notifyListeners("onConsentStatusChanged", data: data)
                call.resolve(data)
            } else {
                call.reject(error ?? "Privacy options failed.")
            }
        }
    }

    @objc func getConsentData(_ call: CAPPluginCall) {
        call.resolve(implementation.consentData())
    }

    /// Persists a decision produced by the rich custom consent modal (rendered
    /// in the JS layer). Writes the IABTCF_* keys natively and forwards the
    /// decision to LevelPlay, then returns the resulting consent data.
    @objc func persistConsent(_ call: CAPPluginCall) {
        let keys = call.getObject("keys") ?? [:]
        let granted = call.getBool("granted", false)
        var networkConsents: [String: Bool] = [:]
        if let nc = call.getObject("networkConsents") {
            for (key, value) in nc {
                if let flag = value as? Bool { networkConsents[key] = flag }
            }
        }
        implementation.persistConsent(keys: keys, granted: granted, networkConsents: networkConsents)
        let data = implementation.consentData()
        notifyListeners("onConsentStatusChanged", data: data)
        call.resolve(data)
    }

    @objc func resetConsent(_ call: CAPPluginCall) {
        implementation.resetConsent()
        let data = implementation.consentData()
        notifyListeners("onConsentStatusChanged", data: data)
        call.resolve(data)
    }

    @objc func setCCPAConsent(_ call: CAPPluginCall) {
        implementation.setCCPA(call.getBool("doNotSell", false))
        call.resolve()
    }

    @objc func setChildDirected(_ call: CAPPluginCall) {
        implementation.setCOPPA(call.getBool("isChildDirected", false))
        call.resolve()
    }

    @objc func requestTrackingAuthorization(_ call: CAPPluginCall) {
        implementation.requestTrackingAuthorization { status in
            call.resolve(["status": status])
        }
    }

    @objc func getAdvertisingId(_ call: CAPPluginCall) {
        let info = implementation.advertisingId()
        call.resolve(["id": info.id, "limited": info.limited])
    }

    // MARK: - Banner

    @objc func createBanner(_ call: CAPPluginCall) {
        guard ensureReady(call) else { return }
        guard let adUnitId = call.getString("adUnitId"), !adUnitId.isEmpty else {
            call.reject("Ad Unit ID is required.")
            return
        }
        guard let vc = viewController else {
            call.reject("No view controller available.")
            return
        }
        let size = call.getString("adSize", "ADAPTIVE")
        let position = call.getString("position", "BOTTOM")
        implementation.createBanner(adUnitId: adUnitId, sizeStr: size, position: position,
                                    viewController: vc) { success, error in
            if success {
                call.resolve()
            } else {
                call.reject("Banner failed to load: \(error ?? "unknown error")")
            }
        }
    }

    @objc func showBanner(_ call: CAPPluginCall) {
        implementation.showBanner()
        call.resolve()
    }

    @objc func hideBanner(_ call: CAPPluginCall) {
        implementation.hideBanner()
        call.resolve()
    }

    @objc func destroyBanner(_ call: CAPPluginCall) {
        implementation.destroyBanner()
        call.resolve()
    }

    @objc func updateBannerStyle(_ call: CAPPluginCall) {
        let position = call.getString("position")
        let isOverlap = call.options["isOverlap"] as? Bool
        implementation.updateBannerStyle(position: position, isOverlap: isOverlap) { success, error in
            if success { call.resolve() } else { call.reject(error ?? "Update banner style failed.") }
        }
    }

    // MARK: - Interstitial

    @objc func loadInterstitial(_ call: CAPPluginCall) {
        guard ensureReady(call) else { return }
        guard let adUnitId = call.getString("adUnitId"), !adUnitId.isEmpty else {
            call.reject("Ad Unit ID is required.")
            return
        }
        let autoShow = call.getBool("autoShow", false)
        implementation.loadInterstitial(adUnitId: adUnitId) { [weak self] success, error in
            if !success {
                call.reject("Failed: \(error ?? "unknown error")")
                return
            }
            guard autoShow, let self = self else { call.resolve(); return }
            DispatchQueue.main.async {
                guard let vc = self.viewController else {
                    call.reject("No view controller available for auto-show.")
                    return
                }
                self.implementation.showInterstitial(viewController: vc) { ok, err in
                    if ok { call.resolve() } else { call.reject("Auto-show failed: \(err ?? "")") }
                }
            }
        }
    }

    @objc func isInterstitialReady(_ call: CAPPluginCall) {
        call.resolve(["isReady": implementation.isInterstitialReady()])
    }

    @objc func showInterstitial(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let vc = self.viewController else {
                call.reject("No view controller available.")
                return
            }
            self.implementation.showInterstitial(viewController: vc) { success, error in
                if success { call.resolve() } else { call.reject(error ?? "Show failed.") }
            }
        }
    }

    // MARK: - Rewarded

    @objc func loadRewarded(_ call: CAPPluginCall) {
        guard ensureReady(call) else { return }
        guard let adUnitId = call.getString("adUnitId"), !adUnitId.isEmpty else {
            call.reject("Ad Unit ID is required.")
            return
        }
        let autoShow = call.getBool("autoShow", false)
        implementation.loadRewarded(adUnitId: adUnitId) { [weak self] success, error in
            if !success {
                call.reject("Failed to load rewarded ad: \(error ?? "unknown error")")
                return
            }
            guard autoShow, let self = self else { call.resolve(); return }
            DispatchQueue.main.async {
                guard let vc = self.viewController else {
                    call.reject("No view controller available for auto-show.")
                    return
                }
                self.implementation.showRewarded(viewController: vc) { ok, err in
                    if ok { call.resolve() } else { call.reject("Auto-show failed: \(err ?? "")") }
                }
            }
        }
    }

    @objc func isRewardedReady(_ call: CAPPluginCall) {
        call.resolve(["isReady": implementation.isRewardedReady()])
    }

    @objc func showRewarded(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let vc = self.viewController else {
                call.reject("No view controller available.")
                return
            }
            self.implementation.showRewarded(viewController: vc) { success, error in
                if success { call.resolve() } else { call.reject(error ?? "Show failed.") }
            }
        }
    }
}
