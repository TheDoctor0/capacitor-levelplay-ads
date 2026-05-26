require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'CapacitorLevelplayAds'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = package['repository']['url']
  s.author = package['author']
  s.source = { :git => package['repository']['url'], :tag => s.version.to_s }
  s.ios.deployment_target = '15.0'
  s.static_framework = true
  s.swift_version = '5.1'

  # All source files live in Core. CMP subspecs only add a dependency so
  # `#if canImport(...)` resolves at compile time. The manifest script
  # rewrites the Podfile pod line to include the selected CMP subspec.
  s.default_subspecs = 'Core'

  s.subspec 'Core' do |core|
    core.source_files = 'ios/Sources/**/*.{swift,h,m,c,cc,mm,cpp}'
    core.dependency 'Capacitor'
    core.dependency 'IronSourceSDK'
  end

  s.subspec 'Usercentrics' do |uc|
    uc.dependency 'CapacitorLevelplayAds/Core'
    uc.dependency 'UsercentricsUI'
  end

  s.subspec 'InMobi' do |im|
    im.dependency 'CapacitorLevelplayAds/Core'
    im.dependency 'InMobiCMP'
  end

  # Mediation network adapter pods are NOT declared here. They are opt-in and
  # injected into the consuming app's Podfile by scripts/levelplay-manifest.js
  # based on the `levelplay.networks` key in its package.json.
end
