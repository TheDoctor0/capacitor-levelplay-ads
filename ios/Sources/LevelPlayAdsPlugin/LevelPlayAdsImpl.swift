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

    /// "usercentrics" → Usercentrics CMP (IAB TCF v2.3, default).
    /// "inmobi" → InMobi Choice CMP (IAB TCF v2.2).
    /// "custom" → plugin's built-in modal (boolean + TCF stub).
    private var consentMode: String {
        let v = Bundle.main.object(forInfoDictionaryKey: "LevelPlayCMPProvider") as? String
        return (v ?? "usercentrics").lowercased()
    }
    private var useInMobi: Bool { consentMode == "inmobi" }
    private var useUsercentrics: Bool { consentMode == "usercentrics" }

    /// Stored callback for the in-flight CMP UI dismissal.
    private var inmobiPendingCallback: ((Bool, String?) -> Void)?
    private var inmobiObserver: NSObjectProtocol?

#if canImport(IronSource)
    private var interstitialAd: LPMInterstitialAd?
    private var currentInterstitialAdUnitId: String?
    private var rewardedAd: LPMRewardedAd?
    private var currentRewardedAdUnitId: String?
    private var bannerAd: LPMBannerAdView?
    private var bannerPosition: String = "BOTTOM"
    private var bannerPositionConstraints: [NSLayoutConstraint] = []
    private var bannerAdaptiveWidth: Bool = false
    private weak var bannerHostViewController: UIViewController?

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
            builder.withUserId(userId)
        }
        let request = builder.build()

        // The integration test suite is gated behind a metadata flag that
        // must be set *before* init — otherwise launchTestSuite() opens
        // nothing.
        if isTesting {
            LevelPlay.setMetaDataWithKey("is_test_suite", value: "enable")
        }

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

    public func setDynamicUserId(_ userId: String) {
#if canImport(IronSource)
        LevelPlay.setDynamicUserId(userId)
#endif
    }

    public func launchTestSuite(_ viewController: UIViewController) {
#if canImport(IronSource)
        LevelPlay.launchTestSuite(viewController)
#endif
    }

    // MARK: - Consent (custom modal)

    public func consentStatus() -> String {
        if useUsercentrics || useInMobi {
            if !TcfPrefs.hasDecision() { return "UNKNOWN" }
            return TcfPrefs.isGranted() ? "GRANTED" : "DENIED"
        }
        // custom: the rich modal writes the IABTCF_* keys (source of truth);
        // the legacy alert writes the boolean consentKey.
        if TcfPrefs.hasDecision() {
            return TcfPrefs.isGranted() ? "GRANTED" : "DENIED"
        }
        return UserDefaults.standard.string(forKey: consentKey) ?? "UNKNOWN"
    }

    public func consentData() -> [String: Any] {
        let status = consentStatus()
        var data: [String: Any] = [
            "status": status,
            "granted": status == "GRANTED",
            "canRequestAds": status != "UNKNOWN",
            "provider": consentMode
        ]
        if let tc = UserDefaults.standard.string(forKey: TcfPrefs.tcString) {
            data["tcString"] = tc
        }
        return data
    }

    /// Persists a decision produced by the rich custom modal (rendered in JS):
    /// write the IABTCF_* key map to UserDefaults and forward the global +
    /// per-network GDPR consent to LevelPlay before the JS promise resolves.
    public func persistConsent(keys: [String: Any], granted: Bool, networkConsents: [String: Bool]) {
        TcfPrefs.writeKeys(keys)
        applyNetworkConsents(granted: granted, networkConsents: networkConsents)
    }

    /// Per-network replace-all GDPR map from the rich modal's toggles. Falls back
    /// to a single global `all` grant when no service declared a network.
    public func applyNetworkConsents(granted: Bool, networkConsents: [String: Bool]) {
#if canImport(IronSource)
        for (network, value) in networkConsents where !network.isEmpty {
            gdprConsents[network] = NSNumber(value: value)
        }
        if gdprConsents.isEmpty {
            gdprConsents["all"] = NSNumber(value: granted)
        }
        LPMPrivacySettings.setGDPRConsents(gdprConsents)
#endif
    }

    /// Shows the consent modal only if no decision exists yet.
    public func requestConsent(viewController: UIViewController?, options: [String: Any],
                               networks: [String], completion: @escaping (Bool, String?) -> Void) {
        if useUsercentrics {
            if TcfPrefs.hasDecision() {
                applyUserConsent(granted: TcfPrefs.isGranted(), networks: networks)
                completion(true, nil)
                return
            }
            if let err = UsercentricsConsentBridge.configureIfNeeded() {
                completion(false, err)
                return
            }
            let timeout = DispatchWorkItem { [weak self] in
                guard let self = self else { return }
                if !TcfPrefs.hasDecision() { TcfPrefs.writeStub(granted: true) }
                self.applyUserConsent(granted: true, networks: networks)
                completion(true, nil)
            }
            usercentricsTimeoutWork = timeout
            DispatchQueue.main.asyncAfter(deadline: .now() + 15, execute: timeout)

            UsercentricsConsentBridge.isReady(onSuccess: { [weak self] shouldCollect in
                timeout.cancel()
                guard let self = self else { return }
                if shouldCollect {
                    guard let vc = viewController else {
                        completion(false, "No view controller to display the CMP.")
                        return
                    }
                    UsercentricsConsentBridge.showFirstLayer(on: vc) { granted in
                        self.applyUserConsent(granted: granted, networks: networks)
                        completion(true, nil)
                    }
                } else {
                    if !TcfPrefs.hasDecision() { TcfPrefs.writeStub(granted: true) }
                    self.applyUserConsent(granted: true, networks: networks)
                    completion(true, nil)
                }
            }, onFailure: { errMsg in
                timeout.cancel()
                completion(false, "Usercentrics CMP error: \(errMsg)")
            })
            return
        }
        if useInMobi {
            if TcfPrefs.hasDecision() {
                applyUserConsent(granted: TcfPrefs.isGranted(), networks: networks)
                completion(true, nil)
                return
            }
            waitForTcfDecision(networks: networks, completion: completion)
            InMobiConsentBridge.onError = { [weak self] msg in
                guard let self = self else { return }
                self.cancelInMobiWait()
                completion(false, "InMobi CMP error: \(msg)")
            }
            InMobiConsentBridge.onLoaded = { [weak self] in
                // Config loaded. If no UI appears within 5s, CMP determined
                // consent is not required — auto-grant.
                self?.scheduleNoUiTimeout(networks: networks)
            }
            InMobiConsentBridge.onUiVisible = { [weak self] visible in
                if visible {
                    // CMP is showing — cancel timeout, wait for user decision.
                    self?.inmobiNoUiTimeout?.cancel()
                    self?.inmobiNoUiTimeout = nil
                }
            }
            if let err = InMobiConsentBridge.startIfConfigured() {
                cancelInMobiWait()
                completion(false, err)
            }
            return
        }
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
        if useUsercentrics {
            guard let vc = viewController else {
                completion(false, "No view controller to display the CMP.")
                return
            }
            if let err = UsercentricsConsentBridge.configureIfNeeded() {
                completion(false, err)
                return
            }
            UsercentricsConsentBridge.isReady(onSuccess: { [weak self] _ in
                UsercentricsConsentBridge.showSecondLayer(on: vc) { granted in
                    self?.applyUserConsent(granted: granted, networks: networks)
                    completion(true, nil)
                }
            }, onFailure: { errMsg in
                completion(false, "Usercentrics CMP error: \(errMsg)")
            })
            return
        }
        if useInMobi {
            InMobiConsentBridge.forceDisplayUI()
            waitForTcfDecision(networks: networks, completion: completion)
            return
        }
        showConsentModal(viewController: viewController, options: options) { [weak self] granted in
            self?.applyUserConsent(granted: granted, networks: networks)
            completion(true, nil)
        } onError: { error in
            completion(false, error)
        }
    }

    private var usercentricsTimeoutWork: DispatchWorkItem?
    private var inmobiTimeoutWork: DispatchWorkItem?
    private var inmobiNoUiTimeout: DispatchWorkItem?

    /// Waits for the InMobi SDK to write IABTCF_TCString to UserDefaults.
    /// Config-load timeout (15s) catches network failures. Once config loads,
    /// a separate no-UI timeout (5s) catches the non-GDPR silent path.
    /// If CMP UI is shown, both timeouts are cancelled — waits for user.
    private func waitForTcfDecision(networks: [String],
                                    completion: @escaping (Bool, String?) -> Void) {
        if let prev = inmobiObserver {
            NotificationCenter.default.removeObserver(prev)
            inmobiObserver = nil
        }
        inmobiTimeoutWork?.cancel()
        inmobiNoUiTimeout?.cancel()
        inmobiPendingCallback = completion

        let timeout = DispatchWorkItem { [weak self] in
            self?.resolveInMobiWait(granted: true, networks: networks)
        }
        inmobiTimeoutWork = timeout
        DispatchQueue.main.asyncAfter(deadline: .now() + 15, execute: timeout)

        inmobiObserver = NotificationCenter.default.addObserver(
            forName: UserDefaults.didChangeNotification,
            object: nil, queue: .main
        ) { [weak self] _ in
            guard let self = self, TcfPrefs.hasDecision() else { return }
            self.resolveInMobiWait(granted: TcfPrefs.isGranted(), networks: networks)
        }
    }

    private func scheduleNoUiTimeout(networks: [String]) {
        inmobiNoUiTimeout?.cancel()
        inmobiTimeoutWork?.cancel()
        inmobiTimeoutWork = nil

        let work = DispatchWorkItem { [weak self] in
            self?.resolveInMobiWait(granted: true, networks: networks)
        }
        inmobiNoUiTimeout = work
        DispatchQueue.main.asyncAfter(deadline: .now() + 5, execute: work)
    }

    private func cancelInMobiWait() {
        inmobiTimeoutWork?.cancel()
        inmobiTimeoutWork = nil
        inmobiNoUiTimeout?.cancel()
        inmobiNoUiTimeout = nil
        if let obs = inmobiObserver {
            NotificationCenter.default.removeObserver(obs)
            inmobiObserver = nil
        }
        InMobiConsentBridge.onError = nil
        InMobiConsentBridge.onLoaded = nil
        InMobiConsentBridge.onUiVisible = nil
        inmobiPendingCallback = nil
    }

    private func resolveInMobiWait(granted: Bool, networks: [String]) {
        inmobiTimeoutWork?.cancel()
        inmobiTimeoutWork = nil
        inmobiNoUiTimeout?.cancel()
        inmobiNoUiTimeout = nil
        if let obs = inmobiObserver {
            NotificationCenter.default.removeObserver(obs)
            inmobiObserver = nil
        }
        InMobiConsentBridge.onError = nil
        InMobiConsentBridge.onLoaded = nil
        InMobiConsentBridge.onUiVisible = nil
        guard let cb = inmobiPendingCallback else { return }
        inmobiPendingCallback = nil
        if !TcfPrefs.hasDecision() {
            TcfPrefs.writeStub(granted: granted)
        }
        applyUserConsent(granted: granted, networks: networks)
        cb(true, nil)
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
        // Mirror to TCF stub so mediation adapters see consistent state.
        TcfPrefs.writeStub(granted: granted)
    }

    /// Clears the stored decision so the next requestConsent() re-prompts.
    public func resetConsent() {
        UserDefaults.standard.removeObject(forKey: consentKey)
        TcfPrefs.clear()
        if useUsercentrics {
            UsercentricsConsentBridge.reset()
        }
    }

    // MARK: - Privacy bridge

    /// `granted` global GDPR flag + per-network replace-all consent map.
    public func applyUserConsent(granted: Bool, networks: [String]) {
#if canImport(IronSource)
        for network in networks where !network.isEmpty {
            gdprConsents[network] = NSNumber(value: granted)
        }
        if gdprConsents.isEmpty {
            gdprConsents["all"] = NSNumber(value: granted)
        }
        LPMPrivacySettings.setGDPRConsents(gdprConsents)
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

    /// IDFA + a "zeroed" flag (true when ATT not authorized — the OS returns
    /// `00000000-0000-0000-0000-000000000000` in that case).
    public func advertisingId() -> (id: String, limited: Bool) {
        let uuid = ASIdentifierManager.shared().advertisingIdentifier
        let id = uuid.uuidString
        let limited = uuid == UUID(uuidString: "00000000-0000-0000-0000-000000000000")
        return (id, limited)
    }

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
            if self.interstitialAd == nil || self.currentInterstitialAdUnitId != adUnitId {
                let ad = LPMInterstitialAd(adUnitId: adUnitId)
                let delegate = InterstitialDelegate(owner: self)
                ad.setDelegate(delegate)
                self.interstitialAd = ad
                self.currentInterstitialAdUnitId = adUnitId
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
            if self.rewardedAd == nil || self.currentRewardedAdUnitId != adUnitId {
                let ad = LPMRewardedAd(adUnitId: adUnitId)
                let delegate = RewardedDelegate(owner: self)
                ad.setDelegate(delegate)
                self.rewardedAd = ad
                self.currentRewardedAdUnitId = adUnitId
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
            var sizeConstraints: [NSLayoutConstraint] = [
                banner.heightAnchor.constraint(equalToConstant: CGFloat(size.height))
            ]
            // An adaptive banner reports width 0 — span the safe area instead of
            // pinning a zero-width constant that would collapse the view.
            if CGFloat(size.width) > 0 {
                sizeConstraints.append(banner.widthAnchor.constraint(equalToConstant: CGFloat(size.width)))
            }
            NSLayoutConstraint.activate(sizeConstraints)

            self.bannerAd = banner
            self.bannerDelegate = delegate
            self.bannerHostViewController = viewController
            self.bannerPosition = position.uppercased()
            self.bannerAdaptiveWidth = CGFloat(size.width) <= 0
            self.applyBannerPositionConstraints()
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

    /// Reposition the existing banner. {@code isOverlap} is accepted for API
    /// parity but iOS always overlays the WKWebView.
    public func updateBannerStyle(position: String?, isOverlap _: Bool?,
                                  completion: @escaping (Bool, String?) -> Void) {
#if canImport(IronSource)
        DispatchQueue.main.async {
            guard self.bannerAd != nil, self.bannerHostViewController != nil else {
                completion(false, "Banner not created yet.")
                return
            }
            if let pos = position, !pos.isEmpty {
                self.bannerPosition = pos.uppercased()
            }
            self.applyBannerPositionConstraints()
            completion(true, nil)
        }
#else
        completion(false, "IronSourceSDK is not available.")
#endif
    }

#if canImport(IronSource)
    /// Activate position/horizontal constraints for {@code bannerPosition}.
    /// Deactivates any previously activated set so callers can swap positions
    /// without destroying the banner.
    private func applyBannerPositionConstraints() {
        let adaptiveWidth = bannerAdaptiveWidth
        guard let banner = bannerAd, let host = bannerHostViewController else { return }
        if !bannerPositionConstraints.isEmpty {
            NSLayoutConstraint.deactivate(bannerPositionConstraints)
            bannerPositionConstraints.removeAll()
        }
        let guide = host.view.safeAreaLayoutGuide
        var c: [NSLayoutConstraint] = []
        switch bannerPosition {
        case "TOP":
            c.append(banner.topAnchor.constraint(equalTo: guide.topAnchor))
            c.append(banner.centerXAnchor.constraint(equalTo: guide.centerXAnchor))
        case "TOP_LEFT":
            c.append(banner.topAnchor.constraint(equalTo: guide.topAnchor))
            c.append(banner.leadingAnchor.constraint(equalTo: guide.leadingAnchor))
        case "TOP_RIGHT":
            c.append(banner.topAnchor.constraint(equalTo: guide.topAnchor))
            c.append(banner.trailingAnchor.constraint(equalTo: guide.trailingAnchor))
        case "CENTER":
            c.append(banner.centerYAnchor.constraint(equalTo: guide.centerYAnchor))
            c.append(banner.centerXAnchor.constraint(equalTo: guide.centerXAnchor))
        case "BOTTOM_LEFT":
            c.append(banner.bottomAnchor.constraint(equalTo: guide.bottomAnchor))
            c.append(banner.leadingAnchor.constraint(equalTo: guide.leadingAnchor))
        case "BOTTOM_RIGHT":
            c.append(banner.bottomAnchor.constraint(equalTo: guide.bottomAnchor))
            c.append(banner.trailingAnchor.constraint(equalTo: guide.trailingAnchor))
        default: // BOTTOM
            c.append(banner.bottomAnchor.constraint(equalTo: guide.bottomAnchor))
            c.append(banner.centerXAnchor.constraint(equalTo: guide.centerXAnchor))
        }
        // Adaptive banners report width 0 — stretch only when the position is
        // centered (TOP/BOTTOM/CENTER); leave side-anchored variants intrinsic.
        if adaptiveWidth && (bannerPosition == "TOP" || bannerPosition == "BOTTOM" || bannerPosition == "CENTER") {
            c.append(banner.leadingAnchor.constraint(equalTo: guide.leadingAnchor))
            c.append(banner.trailingAnchor.constraint(equalTo: guide.trailingAnchor))
        }
        NSLayoutConstraint.activate(c)
        bannerPositionConstraints = c
    }

    private func destroyBannerInternal() {
        if !bannerPositionConstraints.isEmpty {
            NSLayoutConstraint.deactivate(bannerPositionConstraints)
            bannerPositionConstraints.removeAll()
        }
        bannerAd?.destroy()
        bannerAd?.removeFromSuperview()
        bannerAd = nil
        bannerDelegate = nil
        bannerHostViewController = nil
    }

    private func bannerSize(for sizeStr: String) -> LPMAdSize {
        switch sizeStr.uppercased() {
        case "BANNER": return LPMAdSize.banner()
        case "MREC", "MEDIUM_RECTANGLE": return LPMAdSize.mediumRectangle()
        case "LARGE": return LPMAdSize.large()
        default: return LPMAdSize.createAdaptive() ?? LPMAdSize.banner()
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
            "adUnitId": info.adUnitId,
            "adFormat": info.adFormat,
            "adNetwork": info.adNetwork,
            "instanceName": info.instanceName,
            "placementName": info.placementName ?? "",
            "country": info.country,
            "revenue": info.revenue,
            "precision": info.precision,
            "creativeId": info.creativeId,
            "auctionId": info.auctionId
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
                     LevelPlayAdsImpl.adErrorToJS(adUnitId: adInfo.adUnitId, error: error))
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
                     LevelPlayAdsImpl.adErrorToJS(adUnitId: adInfo.adUnitId, error: error))
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
                     LevelPlayAdsImpl.adErrorToJS(adUnitId: adInfo.adUnitId, error: error))
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
