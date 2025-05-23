///
/// KeyDetail.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#if __has_include(<NitroModules/JSIConverter.hpp>)
#include <NitroModules/JSIConverter.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif
#if __has_include(<NitroModules/NitroDefines.hpp>)
#include <NitroModules/NitroDefines.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif



#include <optional>
#include <string>

namespace margelo::nitro::crypto {

  /**
   * A struct which can be represented as a JavaScript object (KeyDetail).
   */
  struct KeyDetail {
  public:
    std::optional<double> length     SWIFT_PRIVATE;
    std::optional<double> publicExponent     SWIFT_PRIVATE;
    std::optional<double> modulusLength     SWIFT_PRIVATE;
    std::optional<std::string> hashAlgorithm     SWIFT_PRIVATE;
    std::optional<std::string> mgf1HashAlgorithm     SWIFT_PRIVATE;
    std::optional<double> saltLength     SWIFT_PRIVATE;
    std::optional<std::string> namedCurve     SWIFT_PRIVATE;

  public:
    KeyDetail() = default;
    explicit KeyDetail(std::optional<double> length, std::optional<double> publicExponent, std::optional<double> modulusLength, std::optional<std::string> hashAlgorithm, std::optional<std::string> mgf1HashAlgorithm, std::optional<double> saltLength, std::optional<std::string> namedCurve): length(length), publicExponent(publicExponent), modulusLength(modulusLength), hashAlgorithm(hashAlgorithm), mgf1HashAlgorithm(mgf1HashAlgorithm), saltLength(saltLength), namedCurve(namedCurve) {}
  };

} // namespace margelo::nitro::crypto

namespace margelo::nitro {

  using namespace margelo::nitro::crypto;

  // C++ KeyDetail <> JS KeyDetail (object)
  template <>
  struct JSIConverter<KeyDetail> final {
    static inline KeyDetail fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return KeyDetail(
        JSIConverter<std::optional<double>>::fromJSI(runtime, obj.getProperty(runtime, "length")),
        JSIConverter<std::optional<double>>::fromJSI(runtime, obj.getProperty(runtime, "publicExponent")),
        JSIConverter<std::optional<double>>::fromJSI(runtime, obj.getProperty(runtime, "modulusLength")),
        JSIConverter<std::optional<std::string>>::fromJSI(runtime, obj.getProperty(runtime, "hashAlgorithm")),
        JSIConverter<std::optional<std::string>>::fromJSI(runtime, obj.getProperty(runtime, "mgf1HashAlgorithm")),
        JSIConverter<std::optional<double>>::fromJSI(runtime, obj.getProperty(runtime, "saltLength")),
        JSIConverter<std::optional<std::string>>::fromJSI(runtime, obj.getProperty(runtime, "namedCurve"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const KeyDetail& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "length", JSIConverter<std::optional<double>>::toJSI(runtime, arg.length));
      obj.setProperty(runtime, "publicExponent", JSIConverter<std::optional<double>>::toJSI(runtime, arg.publicExponent));
      obj.setProperty(runtime, "modulusLength", JSIConverter<std::optional<double>>::toJSI(runtime, arg.modulusLength));
      obj.setProperty(runtime, "hashAlgorithm", JSIConverter<std::optional<std::string>>::toJSI(runtime, arg.hashAlgorithm));
      obj.setProperty(runtime, "mgf1HashAlgorithm", JSIConverter<std::optional<std::string>>::toJSI(runtime, arg.mgf1HashAlgorithm));
      obj.setProperty(runtime, "saltLength", JSIConverter<std::optional<double>>::toJSI(runtime, arg.saltLength));
      obj.setProperty(runtime, "namedCurve", JSIConverter<std::optional<std::string>>::toJSI(runtime, arg.namedCurve));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<std::optional<double>>::canConvert(runtime, obj.getProperty(runtime, "length"))) return false;
      if (!JSIConverter<std::optional<double>>::canConvert(runtime, obj.getProperty(runtime, "publicExponent"))) return false;
      if (!JSIConverter<std::optional<double>>::canConvert(runtime, obj.getProperty(runtime, "modulusLength"))) return false;
      if (!JSIConverter<std::optional<std::string>>::canConvert(runtime, obj.getProperty(runtime, "hashAlgorithm"))) return false;
      if (!JSIConverter<std::optional<std::string>>::canConvert(runtime, obj.getProperty(runtime, "mgf1HashAlgorithm"))) return false;
      if (!JSIConverter<std::optional<double>>::canConvert(runtime, obj.getProperty(runtime, "saltLength"))) return false;
      if (!JSIConverter<std::optional<std::string>>::canConvert(runtime, obj.getProperty(runtime, "namedCurve"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
