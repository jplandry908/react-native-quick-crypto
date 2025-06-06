///
/// CipherArgs.hpp
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

// Forward declaration of `ArrayBuffer` to properly resolve imports.
namespace NitroModules { class ArrayBuffer; }

#include <string>
#include <NitroModules/ArrayBuffer.hpp>
#include <optional>

namespace margelo::nitro::crypto {

  /**
   * A struct which can be represented as a JavaScript object (CipherArgs).
   */
  struct CipherArgs {
  public:
    bool isCipher     SWIFT_PRIVATE;
    std::string cipherType     SWIFT_PRIVATE;
    std::shared_ptr<ArrayBuffer> cipherKey     SWIFT_PRIVATE;
    std::shared_ptr<ArrayBuffer> iv     SWIFT_PRIVATE;
    std::optional<double> authTagLen     SWIFT_PRIVATE;

  public:
    CipherArgs() = default;
    explicit CipherArgs(bool isCipher, std::string cipherType, std::shared_ptr<ArrayBuffer> cipherKey, std::shared_ptr<ArrayBuffer> iv, std::optional<double> authTagLen): isCipher(isCipher), cipherType(cipherType), cipherKey(cipherKey), iv(iv), authTagLen(authTagLen) {}
  };

} // namespace margelo::nitro::crypto

namespace margelo::nitro {

  using namespace margelo::nitro::crypto;

  // C++ CipherArgs <> JS CipherArgs (object)
  template <>
  struct JSIConverter<CipherArgs> final {
    static inline CipherArgs fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return CipherArgs(
        JSIConverter<bool>::fromJSI(runtime, obj.getProperty(runtime, "isCipher")),
        JSIConverter<std::string>::fromJSI(runtime, obj.getProperty(runtime, "cipherType")),
        JSIConverter<std::shared_ptr<ArrayBuffer>>::fromJSI(runtime, obj.getProperty(runtime, "cipherKey")),
        JSIConverter<std::shared_ptr<ArrayBuffer>>::fromJSI(runtime, obj.getProperty(runtime, "iv")),
        JSIConverter<std::optional<double>>::fromJSI(runtime, obj.getProperty(runtime, "authTagLen"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const CipherArgs& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "isCipher", JSIConverter<bool>::toJSI(runtime, arg.isCipher));
      obj.setProperty(runtime, "cipherType", JSIConverter<std::string>::toJSI(runtime, arg.cipherType));
      obj.setProperty(runtime, "cipherKey", JSIConverter<std::shared_ptr<ArrayBuffer>>::toJSI(runtime, arg.cipherKey));
      obj.setProperty(runtime, "iv", JSIConverter<std::shared_ptr<ArrayBuffer>>::toJSI(runtime, arg.iv));
      obj.setProperty(runtime, "authTagLen", JSIConverter<std::optional<double>>::toJSI(runtime, arg.authTagLen));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<bool>::canConvert(runtime, obj.getProperty(runtime, "isCipher"))) return false;
      if (!JSIConverter<std::string>::canConvert(runtime, obj.getProperty(runtime, "cipherType"))) return false;
      if (!JSIConverter<std::shared_ptr<ArrayBuffer>>::canConvert(runtime, obj.getProperty(runtime, "cipherKey"))) return false;
      if (!JSIConverter<std::shared_ptr<ArrayBuffer>>::canConvert(runtime, obj.getProperty(runtime, "iv"))) return false;
      if (!JSIConverter<std::optional<double>>::canConvert(runtime, obj.getProperty(runtime, "authTagLen"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
