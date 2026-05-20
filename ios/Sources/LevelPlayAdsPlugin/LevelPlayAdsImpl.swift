import Foundation
import UIKit
import AppTrackingTransparency
import AdSupport

#if canImport(IronSource)
import IronSource
#endif

/// Core LevelPlay implementation for iOS — mirrors the Android executors:
/// SDK init, a custom consent modal, the privacy bridge, banner / interstitial
/// / rewarded ads, and the global impression-data (ILRD) listener.
///
/// All SDK-specific code is guarded by `#if canImport(IronSource)` so the
/// package still builds when the `IronSourceSDK` pod is absent.
@objc public class LevelPlayAdsImpl: NSObject {

    /// Emits a Capacitor event. Wired by the plugin to `notifyListeners`.
    var emit: ((String, [String: Any]) -> Void)?

    private let consentKey = "levelplay_consent_status"
    private var initialized = false
    private var initializing = false

#if canImport(IronSource)
    private var interstitialAd: LPMInterstitialAd?
    private var rewardedAd: LPMRewardedAd?
    private var bannerAd: LPMBannerAdView?

    private var interstitialDelegate: InterstitialDelegate?
    private var rewardedDelegate: RewardedDelegate?
    private var bannerDelegate: BannerDelegate?
    private var impressionDelegate: ImpressionDelegate?

    private var pendingInterstitialLoad: ((Bool, String?) -> Void)?
    private var pendingRewardedLoad: ((Bool, String?) -> Void)?
    private var pendingBannerLoad: ((Bool, String?) -> Void)?

    /// Canonical replace-all GDPR map (Risk #1) — `setGDPRConsents` overwrites
    /// the SDK's whole map on every call.
    private var gdprConsents: [String: NSNumber] = [:]
#endif

    // MARK: - Core

    public var isInitialized: Bool { initialized }

    public func initialize(appKey: String, userId: String?, isTesting: Bool,
                           completion: @escaping (Bool, String?) -> Void) {
#if canImport(IronSource)
        if initialized { completion(true, nil); return }
        if initializing { completion(false, "LevelPlay is already initializing."); return }
        initializing = true

        let builder = LPMInitRequestBuilder(appKey: appKey)
        if let userId = userId, !userId.isEmpty {
            builder.set(userId: userId)
        }
        let request = builder.build()

        DispatchQueue.main.async {
            LevelPlay.initWith(request) { [weak self] _, error in
                guard let self = self else { return }
                self.initializing = false
                if let error = error {
                    completion(false, error.localizedDescription)
                } else {
                    self.initialized = true
                    // Register the ILRD listener once init succeeds.
                    if self.impressionDelegate == nil {
                        let impr = ImpressionDelegate(owner: self)
                        self.impressionDelegate = impr
                        LevelPlay.add(impr)
                    }
                    completion(true, nil)
                }
            }
        }
#else
        completion(false, "IronSourceSDK is not available. Add the pod to your app.")
#endif
    }

    public func launchTestSuite(_ viewController: UIViewController) {
#if canImport(IronSource)
        LevelPlay.launchTestSuite(viewController)
#endif
    }

    // MARK: - Consent (custom modal)

    public func consentStatus() -> String {
        return UserDefaults.standard.string(forKey: consentKey) ?? "UNKNOWN"
    }

    public func consentData() -> [String: Any] {
        let status = consentStatus()
        return [
            "status": status,
            "granted": status == "GRANTED",
            "canRequestAds": status != "UNKNOWN"
        ]
    }

    /// Shows the consent modal only if no decision exists yet.
    public func requestConsent(viewController: UIViewController?, options: [String: Any],
                               networks: [String], completion: @escaping (Bool, String?) -> Void) {
        let status = consentStatus()
        if status != "UNKNOWN" {
            applyUserConsent(granted: status == "GRANTED", networks: networks)
            completion(true, nil)
            return
        }
        showConsentModal(viewController: viewController, options: options) { [weak self] granted in
            self?.applyUserConsent(granted: granted, networks: networks)
            completion(true, nil)
        } onError: { error in
            completion(false, error)
        }
    }

    /// Always re-prompts so the user can revise an earlier decision.
    public func showPrivacyOptions(viewController: UIViewController?, options: [String: Any],
                                   networks: [String], completion: @escaping (Bool, String?) -> Void) {
        showConsentModal(viewController: viewController, options: options) { [weak self] granted in
            self?.applyUserConsent(granted: granted, networks: networks)
            completion(true, nil)
        } onError: { error in
            completion(false, error)
        }
    }

    private func showConsentModal(viewController: UIViewController?, options: [String: Any],
                                  onDecision: @escaping (Bool) -> Void,
                                  onError: @escaping (String) -> Void) {
        guard let vc = viewController else {
            onError("No view controller to display the consent modal.")
            return
        }
        let title = options["title"] as? String ?? "We value your privacy"
        let message = options["message"] as? String
            ?? "We and our partners use data to deliver and measure personalized ads. "
             + "You can accept or decline personalized advertising."
        let acceptText = options["acceptButtonText"] as? String ?? "Accept"
        let declineText = options["declineButtonText"] as? String ?? "Decline"
        let privacyUrl = options["privacyPolicyUrl"] as? String

        DispatchQueue.main.async {
            let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: acceptText, style: .default) { [weak self] _ in
                self?.storeConsent(granted: true)
                onDecision(true)
            })
            alert.addAction(UIAlertAction(title: declineText, style: .cancel) { [weak self] _ in
                self?.storeConsent(granted: false)
                onDecision(false)
            })
            if let urlString = privacyUrl, let url = URL(string: urlString) {
                alert.addAction(UIAlertAction(title: "Privacy policy", style: .default) { [weak self] _ in
                    UIApplication.shared.open(url)
                    // The action dismisses the alert; re-prompt so a decision is still required.
                    self?.showConsentModal(viewController: vc, options: options,
                                           onDecision: onDecision, onError: onError)
                })
            }
            vc.present(alert, animated: true)
        }
    }

    private func storeConsent(granted: Bool) {
        UserDefaults.standard.set(granted ? "GRANTED" : "DENIED", forKey: consentKey)
    }

    // MARK: - Privacy bridge

    /// `granted` global GDPR flag + per-network replace-all consent map.
    public func applyUserConsent(granted: Bool, networks: [String]) {
#if canImport(IronSource)
        LevelPlay.setConsent(granted)
        for network in networks where !network.isEmpty {
            gdprConsents[network] = NSNumber(value: granted)
        }
        if !gdprConsents.isEmpty {
            LPMPrivacySettings.setGDPRConsents(gdprConsents)
        }
#endif
    }

    public func setCCPA(_ doNotSell: Bool) {
#if canImport(IronSource)
        LPMPrivacySettings.setCCPA(doNotSell)
#endif
    }

    public func setCOPPA(_ isChildDirected: Bool) {
#if canImport(IronSource)
        LPMPrivacySettings.setCOPPA(isChildDirected)
#endif
    }

    // MARK: - App Tracking Transparency

    public func requestTrackingAuthorization(completion: @escaping (String) -> Void) {
        if #available(iOS 14, *) {
            ATTrackingManager.requestTrackingAuthorization { status in
                let value: String
                switch status {
                case .authorized: value = "AUTHORIZED"
                case .denied: value = "DENIED"
                case .restricted: value = "RESTRICTED"
                case .notDetermined: value = "NOT_DETERMINED"
                @unknown default: value = "NOT_DETERMINED"
                }
                completion(value)
            }
        } else {
            // ATT did not exist before iOS 14 — tracking is implicitly allowed.
            completion("AUTHORIZED")
        }
    }

    // MARK: - Interstitial

    public func loadInterstitial(adUnitId: String, completion: @escaping (Bool, String?) -> Void) {
#if canImport(IronSource)
        DispatchQueue.main.async {
            if self.interstitialAd == nil || self.interstitialAd?.adUnitId != adUnitId {
                let ad = LPMInterstitialAd(adUnitId: adUnitId)
                let delegate = InterstitialDelegate(owner: self)
                ad.setDelegate(delegate)
                self.interstitialAd = ad
                self.interstitialDelegate = delegate
            }
            // A prior load is still in flight — settle it before overwriting.
            self.resolveInterstitialLoad(success: false, error: "Superseded by a new load request.")
            self.pendingInterstitialLoad = completion
            self.interstitialAd?.loadAd()
        }
#else
        completion(false, "IronSourceSDK is not available.")
#endif
    }

    public func isInterstitialReady() -> Bool {
#if canImport(IronSource)
        return interstitialAd?.isAdReady() ?? false
#else
        return false
#endif
    }

    public func showInterstitial(viewController: UIViewController, completion: @escaping (Bool, String?) -> Void) {
#if canImport(IronSource)
        guard let ad = interstitialAd, ad.isAdReady() else {
            completion(false, "The interstitial ad is not ready yet.")
            return
        }
        ad.showAd(viewController: viewController, placementName: nil)
        completion(true, nil)
#else
        completion(false, "IronSourceSDK is not available.")
#endif
    }

    // MARK: - Rewarded

    public func loadRewarded(adUnitId: String, completion: @escaping (Bool, String?) -> Void) {
#if canImport(IronSource)
        DispatchQueue.main.async {
            if self.rewardedAd == nil || self.rewardedAd?.adUnitId != adUnitId {
                let ad = LPMRewardedAd(adUnitId: adUnitId)
                let delegate = RewardedDelegate(owner: self)
                ad.setDelegate(delegate)
                self.rewardedAd = ad
                self.rewardedDelegate = delegate
            }
            // A prior load is still in flight — settle it before overwriting.
            self.resolveRewardedLoad(success: false, error: "Superseded by a new load request.")
            self.pendingRewardedLoad = completion
            self.rewardedAd?.loadAd()
        }
#else
        completion(false, "IronSourceSDK is not available.")
#endif
    }

    public func isRewardedReady() -> Bool {
#if canImport(IronSource)
        return rewardedAd?.isAdReady() ?? false
#else
        return false
#endif
    }

    public func showRewarded(viewController: UIViewController, completion: @escaping (Bool, String?) -> Void) {
#if canImport(IronSource)
        guard let ad = rewardedAd, ad.isAdReady() else {
            completion(false, "The rewarded ad is not ready yet.")
            return
        }
        ad.showAd(viewController: viewController, placementName: nil)
        completion(true, nil)
#else
        completion(false, "IronSourceSDK is not available.")
#endif
    }

    // MARK: - Banner

    public func createBanner(adUnitId: String, sizeStr: String, position: String,
                             viewController: UIViewController, completion: @escaping (Bool, String?) -> Void) {
#if canImport(IronSource)
        DispatchQueue.main.async {
            self.destroyBannerInternal()

            let size = self.bannerSize(for: sizeStr)
            let config = LPMBannerAdViewConfigBuilder().set(adSize: size).build()
            let banner = LPMBannerAdView(adUnitId: adUnitId, config: config)
            let delegate = BannerDelegate(owner: self)
            banner.setDelegate(delegate)

            banner.translatesAutoresizingMaskIntoConstraints = false
            viewController.view.addSubview(banner)
            let guide = viewController.view.safeAreaLayoutGuide
            var constraints = [
                banner.centerXAnchor.constraint(equalTo: guide.centerXAnchor),
                banner.heightAnchor.constraint(equalToConstant: CGFloat(size.height))
            ]
            // An adaptive banner reports width 0 — span the safe area instead of
            // pinning a zero-width constant that would collapse the view.
            if CGFloat(size.width) > 0 {
                constraints.append(banner.widthAnchor.constraint(equalToConstant: CGFloat(size.width)))
            } else {
                constraints.append(banner.leadingAnchor.constraint(equalTo: guide.leadingAnchor))
                constraints.append(banner.trailingAnchor.constraint(equalTo: guide.trailingAnchor))
            }
            if position.uppercased() == "TOP" {
                constraints.append(banner.topAnchor.constraint(equalTo: guide.topAnchor))
            } else {
                constraints.append(banner.bottomAnchor.constraint(equalTo: guide.bottomAnchor))
            }
            NSLayoutConstraint.activate(constraints)

            self.bannerAd = banner
            self.bannerDelegate = delegate
            // A prior load is still in flight — settle it before overwriting.
            self.resolveBannerLoad(success: false, error: "Superseded by a new banner request.")
            self.pendingBannerLoad = completion
            banner.loadAd(with: viewController)
        }
#else
        completion(false, "IronSourceSDK is not available.")
#endif
    }

    public func showBanner() {
#if canImport(IronSource)
        DispatchQueue.main.async { self.bannerAd?.isHidden = false }
#endif
    }

    public func hideBanner() {
#if canImport(IronSource)
        DispatchQueue.main.async { self.bannerAd?.isHidden = true }
#endif
    }

    public func destroyBanner() {
#if canImport(IronSource)
        DispatchQueue.main.async { self.destroyBannerInternal() }
#endif
    }

#if canImport(IronSource)
    private func destroyBannerInternal() {
        bannerAd?.destroy()
        bannerAd?.removeFromSuperview()
        bannerAd = nil
        bannerDelegate = nil
    }

    private func bannerSize(for sizeStr: String) -> LPMAdSize {
        switch sizeStr.uppercased() {
        case "BANNER": return LPMAdSize.banner()
        case "MREC", "MEDIUM_RECTANGLE": return LPMAdSize.mediumRectangle()
        case "LARGE": return LPMAdSize.large()
        default: return LPMAdSize.createAdaptive()
        }
    }

    // MARK: - Load-completion plumbing (called by the delegate classes)

    func resolveInterstitialLoad(success: Bool, error: String?) {
        let cb = pendingInterstitialLoad
        pendingInterstitialLoad = nil
        cb?(success, error)
    }

    func resolveRewardedLoad(success: Bool, error: String?) {
        let cb = pendingRewardedLoad
        pendingRewardedLoad = nil
        cb?(success, error)
    }

    func resolveBannerLoad(success: Bool, error: String?) {
        let cb = pendingBannerLoad
        pendingBannerLoad = nil
        cb?(success, error)
    }

    // MARK: - JSON helpers

    /// NOTE: LPMAdInfo property names follow the LevelPlay 9.4.0 iOS headers —
    /// verify on a macOS build host.
    static func adInfoToJS(_ info: LPMAdInfo) -> [String: Any] {
        return [
            "adUnitId": info.adUnitId ?? "",
            "adFormat": info.adFormat ?? "",
            "adNetwork": info.adNetwork ?? "",
            "instanceName": info.instanceName ?? "",
            "placementName": info.placementName ?? "",
            "country": info.country ?? "",
            "revenue": info.revenue ?? 0,
            "precision": info.precision ?? "",
            "creativeId": info.creativeId ?? "",
            "auctionId": info.auctionId ?? ""
        ]
    }

    static func adErrorToJS(adUnitId: String, error: Error) -> [String: Any] {
        let ns = error as NSError
        return [
            "errorCode": ns.code,
            "errorMessage": error.localizedDescription,
            "adUnitId": adUnitId
        ]
    }

    static func impressionToJS(_ data: LPMImpressionData) -> [String: Any] {
        return [
            "revenue": data.revenue ?? 0,
            "adNetwork": data.adNetwork ?? "",
            "instanceName": data.instanceName ?? "",
            "country": data.country ?? "",
            "precision": data.precision ?? "",
            "placement": data.placement ?? "",
            "auctionId": data.auctionId ?? "",
            "segmentName": data.segmentName ?? "",
            "creativeId": data.creativeId ?? "",
            "adFormat": data.adFormat ?? ""
        ]
    }
#endif
}

#if canImport(IronSource)

// MARK: - Delegate adapters
//
// LevelPlay's interstitial / rewarded / banner delegate protocols share method
// names (`didLoadAd(with:)`, `didClickAd(with:)`, …), so one object cannot
// conform to all three — each ad type gets its own thin adapter.

final class InterstitialDelegate: NSObject, LPMInterstitialAdDelegate {
    private weak var owner: LevelPlayAdsImpl?
    init(owner: LevelPlayAdsImpl) { self.owner = owner }

    func didLoadAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onInterstitialAdLoaded", LevelPlayAdsImpl.adInfoToJS(adInfo))
        owner?.resolveInterstitialLoad(success: true, error: nil)
    }
    func didFailToLoadAd(withAdUnitId adUnitId: String, error: Error) {
        owner?.emit?("onInterstitialAdLoadFailed", LevelPlayAdsImpl.adErrorToJS(adUnitId: adUnitId, error: error))
        owner?.resolveInterstitialLoad(success: false, error: error.localizedDescription)
    }
    func didDisplayAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onInterstitialAdDisplayed", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
    func didFailToDisplayAd(with adInfo: LPMAdInfo, error: Error) {
        owner?.emit?("onInterstitialAdDisplayFailed",
                     LevelPlayAdsImpl.adErrorToJS(adUnitId: adInfo.adUnitId ?? "", error: error))
    }
    func didClickAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onInterstitialAdClicked", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
    func didCloseAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onInterstitialAdClosed", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
    func didChangeAdInfo(_ adInfo: LPMAdInfo) {
        owner?.emit?("onInterstitialAdInfoChanged", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
}

final class RewardedDelegate: NSObject, LPMRewardedAdDelegate {
    private weak var owner: LevelPlayAdsImpl?
    init(owner: LevelPlayAdsImpl) { self.owner = owner }

    func didLoadAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onRewardedAdLoaded", LevelPlayAdsImpl.adInfoToJS(adInfo))
        owner?.resolveRewardedLoad(success: true, error: nil)
    }
    func didFailToLoadAd(withAdUnitId adUnitId: String, error: Error) {
        owner?.emit?("onRewardedAdLoadFailed", LevelPlayAdsImpl.adErrorToJS(adUnitId: adUnitId, error: error))
        owner?.resolveRewardedLoad(success: false, error: error.localizedDescription)
    }
    func didDisplayAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onRewardedAdDisplayed", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
    func didFailToDisplayAd(with adInfo: LPMAdInfo, error: Error) {
        owner?.emit?("onRewardedAdDisplayFailed",
                     LevelPlayAdsImpl.adErrorToJS(adUnitId: adInfo.adUnitId ?? "", error: error))
    }
    func didClickAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onRewardedAdClicked", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
    func didRewardAd(with adInfo: LPMAdInfo, reward: LPMReward) {
        var payload = LevelPlayAdsImpl.adInfoToJS(adInfo)
        payload["rewardName"] = reward.name
        payload["rewardAmount"] = reward.amount
        owner?.emit?("onRewardedAdRewarded", payload)
    }
    func didCloseAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onRewardedAdClosed", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
    func didChangeAdInfo(_ adInfo: LPMAdInfo) {
        owner?.emit?("onRewardedAdInfoChanged", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
}

final class BannerDelegate: NSObject, LPMBannerAdViewDelegate {
    private weak var owner: LevelPlayAdsImpl?
    init(owner: LevelPlayAdsImpl) { self.owner = owner }

    func didLoadAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onBannerAdLoaded", LevelPlayAdsImpl.adInfoToJS(adInfo))
        owner?.resolveBannerLoad(success: true, error: nil)
    }
    func didFailToLoadAd(withAdUnitId adUnitId: String, error: Error) {
        owner?.emit?("onBannerAdLoadFailed", LevelPlayAdsImpl.adErrorToJS(adUnitId: adUnitId, error: error))
        owner?.resolveBannerLoad(success: false, error: error.localizedDescription)
    }
    func didClickAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onBannerAdClicked", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
    func didDisplayAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onBannerAdDisplayed", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
    func didFailToDisplayAd(with adInfo: LPMAdInfo, error: Error) {
        owner?.emit?("onBannerAdDisplayFailed",
                     LevelPlayAdsImpl.adErrorToJS(adUnitId: adInfo.adUnitId ?? "", error: error))
    }
    func didLeaveApp(with adInfo: LPMAdInfo) {
        owner?.emit?("onBannerAdLeftApplication", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
    func didExpandAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onBannerAdExpanded", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
    func didCollapseAd(with adInfo: LPMAdInfo) {
        owner?.emit?("onBannerAdCollapsed", LevelPlayAdsImpl.adInfoToJS(adInfo))
    }
}

final class ImpressionDelegate: NSObject, LPMImpressionDataDelegate {
    private weak var owner: LevelPlayAdsImpl?
    init(owner: LevelPlayAdsImpl) { self.owner = owner }

    func impressionDataDidSucceed(_ impressionData: LPMImpressionData!) {
        guard let data = impressionData else { return }
        owner?.emit?("onAdRevenue", LevelPlayAdsImpl.impressionToJS(data))
    }
}

#endif
