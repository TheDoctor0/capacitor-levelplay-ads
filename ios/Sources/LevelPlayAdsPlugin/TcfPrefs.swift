import Foundation

/// IAB TCF v2.2 key access in NSUserDefaults. Mirrors the Android
/// `TcfPrefs` helper so both platforms share the read/write contract.
enum TcfPrefs {
    static let tcString = "IABTCF_TCString"
    static let gdprApplies = "IABTCF_gdprApplies"
    static let cmpSdkID = "IABTCF_CmpSdkID"
    static let purposeConsents = "IABTCF_PurposeConsents"
    static let vendorConsents = "IABTCF_VendorConsents"

    /// Every key the helper may write — for a clean ``clear()``.
    static let allKeys = [
        tcString, gdprApplies, cmpSdkID, purposeConsents, vendorConsents,
        "IABTCF_CmpSdkVersion", "IABTCF_PolicyVersion", "IABTCF_PublisherCC",
        "IABTCF_PurposeOneTreatment", "IABTCF_UseNonStandardTexts",
        "IABTCF_PurposeLegitimateInterests", "IABTCF_VendorLegitimateInterests",
        "IABTCF_SpecialFeaturesOptIns", "IABTCF_AddtlConsent", consentedServices,
    ]

    /// Plugin-private: service IDs the user left enabled, for restore on reopen.
    static let consentedServices = "levelplay_consented_services"

    static func hasDecision() -> Bool {
        let d = UserDefaults.standard
        return d.object(forKey: tcString) != nil || d.object(forKey: gdprApplies) != nil
    }

    /// Granted = GDPR doesn't apply, or purpose 1 is consented. Same heuristic
    /// mediation adapters use when picking between personalized and contextual.
    static func isGranted() -> Bool {
        let d = UserDefaults.standard
        let gdprApplies = d.object(forKey: gdprApplies) as? Int
        if gdprApplies == 0 { return true }
        let purposes = d.string(forKey: purposeConsents) ?? ""
        return purposes.first == "1"
    }

    /// Non-TCF-compliant stub: gdprApplies=0 so adapters skip the TCF gate.
    /// The custom modal uses this; real CMPs write a real TC string.
    static func writeStub(granted: Bool) {
        let d = UserDefaults.standard
        d.set(0, forKey: gdprApplies)
        d.set(0, forKey: cmpSdkID)
        d.set(granted ? "1111111111" : "0000000000", forKey: purposeConsents)
        d.set(granted ? "1" : "0", forKey: vendorConsents)
    }

    /// Writes a TCF v2.3-compatible key map produced by the rich custom modal.
    /// Numbers are stored as integers (e.g. `IABTCF_gdprApplies`), everything
    /// else as strings (e.g. the binary `IABTCF_PurposeConsents` field).
    static func writeKeys(_ keys: [String: Any]) {
        let d = UserDefaults.standard
        for (key, value) in keys {
            if let number = value as? NSNumber {
                d.set(number.intValue, forKey: key)
            } else {
                d.set(String(describing: value), forKey: key)
            }
        }
    }

    static func clear() {
        let d = UserDefaults.standard
        allKeys.forEach { d.removeObject(forKey: $0) }
    }
}
