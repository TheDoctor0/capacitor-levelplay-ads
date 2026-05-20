require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'CapacitorLevelPlayAds'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = package['repository']['url']
  s.author = package['author']
  s.source = { :git => package['repository']['url'], :tag => s.version.to_s }
  s.source_files = 'ios/Sources/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.ios.deployment_target = '15.0'
  s.dependency 'Capacitor'
  # Unity LevelPlay mediation SDK (formerly ironSource).
  s.dependency 'IronSourceSDK'
  # Mediation network adapter pods are NOT declared here. They are opt-in and
  # injected into the consuming app's Podfile by scripts/levelplay-manifest.js
  # based on the `levelplay.networks` key in its package.json.
  s.swift_version = '5.1'
end
