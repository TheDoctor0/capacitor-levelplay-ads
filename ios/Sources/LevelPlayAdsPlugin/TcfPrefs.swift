import Foundation

/// IAB TCF v2.2 key access in NSUserDefaults. Mirrors the Android
/// `TcfPrefs` helper so both platforms share the read/write contract.
enum TcfPrefs {
    static let tcString = "IABTCF_TCString"
    static let gdprApplies = "IABTCF_gdprApplies"
    static let cmpSdkID = "IABTCF_CmpSdkID"
    static let purposeConsents = "IABTCF_PurposeConsents"
    static let vendorConsents = "IABTCF_VendorConsents"

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

    static func clear() {
        let d = UserDefaults.standard
        [tcString, gdprApplies, cmpSdkID, purposeConsents, vendorConsents].forEach { d.removeObject(forKey: $0) }
    }
}
