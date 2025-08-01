require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::UI.puts "[QuickCrypto]  💨 crypto just got quicker"

Pod::Spec.new do |s|
  s.name         = "QuickCrypto"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["authors"]

  s.ios.deployment_target = min_ios_version_supported
  s.visionos.deployment_target = 1.0
  s.macos.deployment_target = 10.13
  s.tvos.deployment_target = 13.4

  s.source = { :git => "https://github.com/margelo/react-native-quick-crypto.git", :tag => "#{s.version}" }

  sodium_enabled = ENV['SODIUM_ENABLED'] == '1'
  Pod::UI.puts("[QuickCrypto]  🧂 has libsodium #{sodium_enabled ? "enabled" : "disabled"}!")

  if sodium_enabled
    # cocoapod for Sodium has not been updated for a while, so we need to build it ourselves
    # https://github.com/jedisct1/swift-sodium/issues/264#issuecomment-2864963850
    s.prepare_command = <<-CMD
      # Create ios directory if it doesn't exist
      mkdir -p ios

      # Download libsodium
      curl -L -s -o ios/libsodium.tar.gz https://download.libsodium.org/libsodium/releases/libsodium-1.0.20-stable.tar.gz

      # Clean previous extraction
      rm -rf ios/libsodium-stable

      # Extract the full tarball
      tar -xzf ios/libsodium.tar.gz -C ios

      # Run configure and make to generate all headers including private ones
      cd ios/libsodium-stable && \
      ./configure --disable-shared --enable-static && \
      make -j$(sysctl -n hw.ncpu)

      # Cleanup
      cd ../../
      rm -f ios/libsodium.tar.gz
    CMD
  else
    s.prepare_command = <<-CMD
      # Clean up libsodium files if they exist
      rm -rf ios/libsodium-stable
      rm -f ios/libsodium.tar.gz
    CMD
  end

  base_source_files = [
    # implementation (Swift)
    "ios/**/*.{swift}",
    # ios (Objective-C++)
    "ios/**/*.{h,m,mm}",
    # implementation (C++)
    "cpp/**/*.{hpp,cpp}",
    # dependencies (C++)
    "deps/**/*.{hpp,cpp}",
    # dependencies (C)
    "deps/**/*.{h,c}",
  ]

  if sodium_enabled
    base_source_files += ["ios/libsodium-stable/src/libsodium/**/*.{h,c}"]
  end

  s.source_files = base_source_files

  xcconfig = {
    # C++ compiler flags, mainly for folly.
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) FOLLY_NO_CONFIG FOLLY_CFG_NO_COROUTINES",
    # Set C++ standard to C++20
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++20",
    "CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES" => "YES"
  }

  if sodium_enabled
    sodium_headers = [
      "\"$(PODS_TARGET_SRCROOT)/ios/libsodium-stable/src/libsodium/include\"",
      "\"$(PODS_TARGET_SRCROOT)/ios/libsodium-stable/src/libsodium/include/sodium\"",
      "\"$(PODS_TARGET_SRCROOT)/ios/libsodium-stable\"",
      "\"$(PODS_ROOT)/../../packages/react-native-quick-crypto/ios/libsodium-stable/src/libsodium/include\"",
      "\"$(PODS_ROOT)/../../packages/react-native-quick-crypto/ios/libsodium-stable/src/libsodium/include/sodium\""
    ]
    xcconfig["HEADER_SEARCH_PATHS"] = sodium_headers.join(' ')
    xcconfig["GCC_PREPROCESSOR_DEFINITIONS"] = "$(inherited) BLSALLOC_SODIUM=1"
  end

  s.pod_target_xcconfig = xcconfig

  # Add all files generated by Nitrogen
  load "nitrogen/generated/ios/QuickCrypto+autolinking.rb"
  add_nitrogen_files(s)

  s.dependency "React-jsi"
  s.dependency "React-callinvoker"
  s.dependency "OpenSSL-Universal"
  install_modules_dependencies(s)
end
