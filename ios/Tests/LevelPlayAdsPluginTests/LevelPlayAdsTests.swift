import XCTest
@testable import LevelPlayAdsPlugin

class LevelPlayAdsTests: XCTestCase {
    func testNotInitializedByDefault() {
        let implementation = LevelPlayAdsImpl()
        XCTAssertFalse(implementation.isInitialized)
    }

    func testConsentStatusUnknownByDefault() {
        let implementation = LevelPlayAdsImpl()
        // A fresh install has no recorded consent decision.
        let data = implementation.consentData()
        XCTAssertNotNil(data["status"])
    }
}
