#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
out_dir="$repo_root/apps/android/generated"
jni_libs_dir="$repo_root/apps/android/app/src/main/jniLibs"
cargo_target_dir="${CARGO_TARGET_DIR:-$repo_root/target}"
required_ndk_revision="${SHELLY_ANDROID_NDK_VERSION:-27.1.12297006}"
if [[ "$cargo_target_dir" != /* ]]; then
  cargo_target_dir="$repo_root/$cargo_target_dir"
fi

command -v cargo-ndk >/dev/null

if [[ -z "${ANDROID_HOME:-}" ]]; then
  if [[ -d "$HOME/Library/Android/sdk" ]]; then
    export ANDROID_HOME="$HOME/Library/Android/sdk"
  elif [[ -d "$HOME/Android/Sdk" ]]; then
    export ANDROID_HOME="$HOME/Android/Sdk"
  fi
fi

if [[ -z "${ANDROID_NDK_HOME:-}" && -n "${ANDROID_HOME:-}" ]]; then
  pinned_ndk="$ANDROID_HOME/ndk/$required_ndk_revision"
  if [[ -d "$pinned_ndk" ]]; then
    export ANDROID_NDK_HOME="$pinned_ndk"
  fi
fi

if [[ -z "${ANDROID_HOME:-}" || ! -d "${ANDROID_HOME:-}" ]]; then
  echo "ANDROID_HOME is not set and no default Android SDK directory was found." >&2
  exit 1
fi

if [[ -z "${ANDROID_NDK_HOME:-}" || ! -d "${ANDROID_NDK_HOME:-}" ]]; then
  echo "ANDROID_NDK_HOME is not set and no NDK was found under $ANDROID_HOME/ndk." >&2
  exit 1
fi

ndk_source_properties="$ANDROID_NDK_HOME/source.properties"
ndk_revision=""
if [[ -f "$ndk_source_properties" ]]; then
  ndk_revision="$(sed -n 's/^Pkg\.Revision[[:space:]]*=[[:space:]]*//p' "$ndk_source_properties" | head -n 1)"
fi
ndk_major="${ndk_revision%%.*}"
if [[ "$ndk_revision" != "$required_ndk_revision" ]]; then
  echo "Android NDK $required_ndk_revision is required; found '${ndk_revision:-unknown}' at $ANDROID_NDK_HOME." >&2
  exit 1
fi

rustup target add aarch64-linux-android x86_64-linux-android

rm -rf "$jni_libs_dir"
android_rustflags="${RUSTFLAGS:-}"
if [[ -n "$android_rustflags" ]]; then
  android_rustflags+=" "
fi
android_rustflags+="-C link-arg=-Wl,-z,max-page-size=16384"
RUSTFLAGS="$android_rustflags" cargo ndk \
  --manifest-path "$repo_root/Cargo.toml" \
  -t arm64-v8a \
  -t x86_64 \
  -o "$jni_libs_dir" \
  build --locked -p shelly-mobile-core --release

find "$jni_libs_dir" -name '*.so' ! -name 'libshelly_mobile_core.so' -delete

rm -rf "$out_dir"
mkdir -p "$out_dir"
cargo run --locked -p shelly-mobile-core --bin uniffi-bindgen -- generate \
  --library "$cargo_target_dir/aarch64-linux-android/release/libshelly_mobile_core.so" \
  --language kotlin \
  --out-dir "$out_dir"
