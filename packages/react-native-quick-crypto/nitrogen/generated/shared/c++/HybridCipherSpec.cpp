///
/// HybridCipherSpec.cpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#include "HybridCipherSpec.hpp"

namespace margelo::nitro::crypto {

  void HybridCipherSpec::loadHybridMethods() {
    // load base methods/properties
    HybridObject::loadHybridMethods();
    // load custom methods/properties
    registerHybrids(this, [](Prototype& prototype) {
      prototype.registerHybridMethod("update", &HybridCipherSpec::update);
      prototype.registerHybridMethod("final", &HybridCipherSpec::final);
      prototype.registerHybridMethod("setArgs", &HybridCipherSpec::setArgs);
      prototype.registerHybridMethod("setAAD", &HybridCipherSpec::setAAD);
      prototype.registerHybridMethod("setAutoPadding", &HybridCipherSpec::setAutoPadding);
      prototype.registerHybridMethod("setAuthTag", &HybridCipherSpec::setAuthTag);
      prototype.registerHybridMethod("getAuthTag", &HybridCipherSpec::getAuthTag);
      prototype.registerHybridMethod("getSupportedCiphers", &HybridCipherSpec::getSupportedCiphers);
    });
  }

} // namespace margelo::nitro::crypto
