# Development

This guide covers the current source workflow after the custom verifier harness
was removed. Keep checks focused on real build, test, package, and smoke
behavior.

## CI and delivery

Every pull request runs the `CI` workflow and reports one stable required check:
`CI Gate`. A small selector runs only the Core, Android, macOS package,
supply-chain, package metadata, site, Terraform, and workflow checks affected by
the changed paths. The gate itself always runs, so documentation-only changes do
not get stuck waiting for a skipped required workflow.

Android, mobile-core, protocol, dependency-lock, and Android release-workflow
changes select the Android job. It validates versioned Play notes and rollout
planning, runs lint and unit tests, and builds the same minified release bundle
used for delivery. An `android-v*.*.*` tag performs the signed internal-track
upload; production promotion is a separate protected manual workflow.

A green `main` CI run automatically deploys the exact revision to the relay.
The site source remains CI-only until Shelly has a public website; package
release tags must point to a commit on `main` before artifact or npm publication
can proceed.

## Rust

```sh
cargo fmt --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo nextest run --workspace
cargo test --workspace --doc
```

The workspace crates are:

- `shelly-protocol`
- `shelly-daemon`
- `shelly-cli`
- `shelly-relay`
- `shelly-mobile-core`

`shellyd` owns PTY sessions and local persistence. `shelly` talks to the
daemon over the hardened local socket. Mobile clients use the UniFFI-backed
mobile core and MessagePack protocol over iroh.

## Supply Chain

```sh
cargo deny check
cargo audit
```

Run plain `cargo audit`; its time-bounded accepted findings and review dates are
tracked in `.cargo/audit.toml`. Cargo-deny policy remains in `deny.toml`. Treat
any new failing advisory, source, or license finding as a release blocker.

## Local Handoff

```sh
scripts/smoke-local-handoff.sh
```

The smoke starts an isolated daemon, creates CLI-owned `claude`, `bash`, and
`vim` sessions, verifies iroh rejects mismatched protocol versions and
`LocalCli` handshakes, pairs a simulated mobile client through an active local
pairing command, attaches over iroh, sends mobile-originated input, verifies mobile
shell-only session create and kill succeed while mobile agent-state events are
rejected, removes the device, and verifies daemon restart restore.

The simulated mobile client is intentionally feature-gated. The smoke builds
`shelly-cli` with `shelly-cli/test-client`; production CLI builds leave
that feature disabled, so the internal `pair-test` command is not present in
the shipped `shelly` binary.

## npm Packages

```sh
node scripts/test-npm-dispatcher.mjs
node scripts/test-npm-artifact-pack.mjs
node scripts/test-npm-publish-plan.mjs
node scripts/test-bun-install.mjs
npm pack ./packages/cli --dry-run --json
```

The root `shellykit` package is the meta package. It exposes `shelly` and
`shellyd`; platform packages provide native `shelly` and `shellyd`
for:

- `shellykit-darwin-arm64`
- `shellykit-darwin-x64`
- `shellykit-linux-arm64`
- `shellykit-linux-x64`

`scripts/prepare-npm-artifacts.mjs` stages native binaries from release archive
extracts into the platform packages and copies `LICENSE`/`NOTICE`. `scripts/publish-npm-packages.mjs`
publishes platform packages first and the meta package last with npm provenance.

For local macOS staging across all v1 package targets:

```sh
scripts/build-local-npm-artifacts.sh
```

That script builds the Rust binaries, stages package bins, ad-hoc signs Darwin
binaries, verifies Darwin signatures with `codesign`, and runs the publish
readiness check.

After local artifacts are staged, run the install smoke on a supported host:

```sh
node scripts/smoke-npm-local-install.mjs
```

It packs the meta package plus the matching platform package, installs them into
an isolated project, verifies `shelly` and `shellyd` entrypoints,
and checks that Darwin binaries remain signed and unquarantined.

## Open-Source Notices

`docs/open-source-notices.json` is a curated list of bundled third-party
components, not an automated dependency scan; when you add or remove a bundled
component, update the JSON by hand. `node scripts/generate-oss-notices.mjs`
regenerates the Android licenses screen from it, and CI runs the same script
with `--check` to fail when the generated screen is stale.

## Relay

```sh
scripts/smoke-relay-tls-loopback.sh
node scripts/smoke-relay-otlp-loopback.mjs
```

The relay control plane validates daemon signatures, nonce replay windows,
timestamp skew, token ownership, and push payload shape. The OTLP smoke uses a
local collector and asserts terminal/session/token sentinel strings do not appear
in exported telemetry.

The hosted relay rendezvous smoke is operator-only because it needs a live relay
control URL:

```sh
SHELLY_HOSTED_RELAY_CONTROL_URL=https://relay.example.com scripts/smoke-hosted-relay-rendezvous.sh
```

## Android

```sh
apps/android/gradlew --no-daemon bundleRelease
apps/android/gradlew --no-daemon :app:testDebugUnitTest
pnpm check:android-release-optimization
node scripts/prepare-play-release-notes.mjs
node scripts/test-play-rollout.mjs
```

Gradle app tasks depend on `buildRustMobileCore`, which runs
`apps/android/scripts/build-rust.sh` before Kotlin compilation or
native-library merge. `bundleRelease` exercises the release-oriented Android
build path used by the Android release workflow; run the script directly only
when you want an explicit Rust/UniFFI preflight.

The release build uses AGP 9 built-in Kotlin and full-mode R8 with code shrinking,
optimized resource shrinking, and the optimizing Android keep rules. Run
`pnpm check:android-release-optimization` after build-tool or release-config
changes; CI runs the same assertion before it builds an AAB.

The Gradle version-catalog (`libs.versions.toml`) migration is intentionally
deferred; the build keeps explicit dependency coordinates to avoid high-risk,
low-value churn during the v1 release hardening pass.

Emulator handoff testing is direct manual adb work: install the debug APK,
capture screenshots/UI dumps/logcat, pair through the relay or local daemon, and
verify terminal input/output with a second client. The signed internal-track
candidate still requires a physical-device release pass before production
approval; record that sign-off in the production workflow run or its linked
release issue.

## Site

```sh
pnpm --dir site install --ignore-workspace --frozen-lockfile
pnpm check:site
pnpm build:site
```

## Syntax Sweep

For a quick script sanity pass:

```sh
for script in scripts/*.mjs; do node --check "$script"; done
for script in scripts/*.sh apps/android/scripts/*.sh; do bash -n "$script"; done
```
