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
        CAPPluginMethod(name: "setCCPAConsent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setChildDirected", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestTrackingAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "createBanner", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showBanner", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "hideBanner", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "destroyBanner", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadInterstitial", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isInterstitialReady", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showInterstitial", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadRewarded", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isRewardedReady", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showRewarded", returnType: CAPPluginReturnPromise)
    ]

    private let implementation = LevelPlayAdsImpl()

    public override func load() {
        super.load()
        implementation.emit = { [weak self] event, data in
            self?.notifyListeners(event, data: data)
        }
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

    // MARK: - Interstitial

    @objc func loadInterstitial(_ call: CAPPluginCall) {
        guard ensureReady(call) else { return }
        guard let adUnitId = call.getString("adUnitId"), !adUnitId.isEmpty else {
            call.reject("Ad Unit ID is required.")
            return
        }
        implementation.loadInterstitial(adUnitId: adUnitId) { success, error in
            if success { call.resolve() } else { call.reject("Failed: \(error ?? "unknown error")") }
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
        implementation.loadRewarded(adUnitId: adUnitId) { success, error in
            if success { call.resolve() } else { call.reject("Failed to load rewarded ad: \(error ?? "unknown error")") }
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
