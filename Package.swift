// swift-tools-version: 5.9
import PackageDescription

// CocoaPods is the primary, supported integration path for iOS — it pulls in
// the Unity LevelPlay SDK via `s.dependency 'IronSourceSDK'` (see the podspec).
//
// Swift Package Manager is secondary: Unity publishes the SDK as the
// branch-based `Unity-Mediation-iAds-Swift-Package`, which is less mature. If
// you must use SPM, add it to your app and this target's dependencies:
//
//   .package(url: "https://github.com/Unity-Technologies/Unity-Mediation-iAds-Swift-Package.git", branch: "main")
//
// Without it, the plugin still builds — all SDK code is guarded by
// `#if canImport(IronSource)` and degrades to no-ops.
let package = Package(
    name: "CapacitorLevelPlayAds",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapacitorLevelPlayAds",
            targets: ["LevelPlayAdsPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "LevelPlayAdsPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/LevelPlayAdsPlugin"),
        .testTarget(
            name: "LevelPlayAdsPluginTests",
            dependencies: ["LevelPlayAdsPlugin"],
            path: "ios/Tests/LevelPlayAdsPluginTests")
    ]
)
