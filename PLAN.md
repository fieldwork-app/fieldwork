# Shelly v1 Plan

**Status**: shipped — 1.0.x is released on npm; this file is the maintained v1
scope contract
**Current boundary**: iOS implementation is deferred; production rollout approval
and physical Android release-device testing remain operator-owned.

This file is the v1 implementation contract. `FUTURE.md` is the boundary for
deferred work. If source behavior and this plan diverge, update the code or this
plan before continuing.

## 1. Product Contract

Shelly gives developers universal terminal handoff. A user can run a real PTY
session on their laptop, attach to the same live session from Android in the
current local target, send input, resize, detach, reconnect, and return to the
laptop without losing process state. iOS source is parked for later resumption.

v1 supports arbitrary PTY commands:

- shells: `bash`, `zsh`, `fish`
- TUIs: `vim`, `htop`, `lazygit`, `tig`, `k9s`
- REPLs: `python`, `node`, `irb`
- AI agents: `claude`, `codex`, and any other terminal command

The default desktop command is the user's shell, not an agent. A Shelly
session is agent-agnostic: users can start Claude, kill it, start Codex, return
to a shell, or run any other TUI/REPL inside the same PTY. Unknown terminal
content still gets only byte-rate `Idle`/`Working` state inference and never
generic content-derived `AwaitingInput` push.

Claude Code and Codex are first-class v1 state-inference targets. OpenCode state
inference, Aider state inference, generic ACP adapter, voice, Live Activities,
Watch app, multi-host, cloud sandbox, teams, billing, native Windows host,
desktop GUI, Homebrew, `curl | sh`, `cargo install`, and self-update are not v1.

Mobile clients may:

- pair
- list sessions
- create a session (shell only — see below)
- kill a session
- attach to a session
- stream terminal output
- send input
- resize
- detach
- register and unregister push tokens

Mobile create is shell-only: the daemon ignores any command, working directory,
or environment a mobile client sends and spawns the user's default shell, so a
paired phone can never launch an arbitrary process at create time. Mobile clients
still must not specify commands or emit agent-state events. Create and kill are
authorized by the paired device identity (the daemon's `require_paired` check on
the iroh transport); the Android biometric prompt is a local UX gate, not a
daemon-trusted boundary. `CreateSession`/`KillSession` reuse the existing wire
messages, so the contract version is unchanged.

## 2. Naming and Distribution

- Product name: `shelly`
- CLI binary: `shelly`
- Daemon binary: `shellyd`
- Relay binary: `shelly-relay`
- npm meta-package: `shellykit`
- npm platform packages:
  - `shellykit-darwin-arm64`
  - `shellykit-darwin-x64`
  - `shellykit-linux-arm64`
  - `shellykit-linux-x64`
- Rust crates: `shelly-protocol`, `shelly-daemon`, `shelly-cli`, `shelly-relay`, `shelly-mobile-core`
- Android package: `app.shelly.android`
- iOS bundle id: `app.shelly.ios`

npm is the only v1 desktop install and update path. The `shellykit` meta-package
uses optional dependencies to pull the matching platform package. Platform
packages include both `shelly` and `shellyd`; the meta-package exposes
`shelly` and `shellyd` bin entrypoints so daemon service workflows can resolve
the colocated daemon binary from the same npm install.

cargo-dist may build archives, but v1 does not ship cargo-dist installers,
Homebrew formulae, curl installers, or a desktop self-updater.

## 3. CLI UX

The short path should match the user's existing terminal habit:

- `shelly pair` opens QR and typed-code pairing.
- `shelly` creates and attaches a new Shelly session running the user's shell.
- `shelly <name>` attaches an existing named session or creates a new shell-backed
  Shelly session with that name.
- `shelly new <command...>` creates a session for the requested command.
- `shelly attach <session-id-or-name>` attaches explicitly.
- `shelly kill <session-id-or-name>` stops one Shelly session.
- `shelly kill-all` stops all current Shelly sessions.

When the user does not supply a name, the daemon generates a one-word memorable
session name. The name appears in the local CLI and mobile session dashboard.

## 4. Architecture

Shelly streams raw PTY bytes, not terminal cell-grid diffs.

The daemon owns:

- PTY process lifecycle through `portable-pty`
- session registry and generated names
- per-session byte rings
- terminal state used for synthetic ANSI snapshots
- state inference
- local Unix socket IPC
- iroh endpoint and mobile transport
- device registry and pairing
- encrypted local persistence

The CLI owns local user commands and talks to the daemon over the Unix socket.
Mobile clients talk to the daemon over iroh using the mobile protocol. The relay
supports rendezvous, iroh relay fallback, and generic push delivery.

Protocol rules:

- `CONTRACT_VERSION = 4`
- version mismatches are rejected
- Unix socket IPC is length-prefixed bincode
- mobile transport uses length-prefixed MessagePack
- IDs are UUIDv7 where the protocol needs ordered IDs
- timestamps are UTC milliseconds
- each session has a 256 KB PTY byte ring buffer
- each PTY byte chunk has a monotonic byte-offset `seq`
- warm reconnect replays from `last_seen_seq`
- cold or stale attach uses a synthetic ANSI snapshot from daemon terminal state
- multiple clients can attach to one session simultaneously
- input from any attached client writes directly to the PTY
- resize uses the minimum attached viewport and is debounced
- subscriber overflow emits one `Lag` event and forces resync

## 5. Pairing and Device Auth

Pairing uses a short user-facing code and a compact QR ticket. The QR ticket
carries daemon reachability and the pairing code. Typed-code pairing resolves
reachability through the relay when a relay control URL is configured.
The desktop CLI only prints the terminal QR when it fits the current pane; small
panes keep the typed code visible instead of showing a cropped QR.

Pairing invariants:

- code TTL is 5 minutes and the desktop CLI shows the countdown
- active pairing code is single-use
- pairing requires an active local `shelly pair` command, which authorizes one valid request
- wrong in-band attempts are capped
- long-lived auth uses device Ed25519 keys
- there is no password fallback
- lost devices are revoked with `shelly devices remove`

The original 32-byte base32 pair-token design was replaced before release by
the shorter code plus compact ticket flow, which bumped the protocol contract
to version 2; adding `UnregisterPushToken` later bumped it to the current
version 4.

## 6. Security and Privacy

Core invariants:

- the Unix socket path lives under a user-owned `0700` directory
- the socket itself is `0600`
- the daemon rejects symlinked socket parents
- local persistence is encrypted at rest with an OS-keychain-held key unless the
  user explicitly opts out
- daemon telemetry is opt-in
- relay telemetry is aggregate-only and documented
- FCM service-account JSON lives only on the relay
- push payloads contain only opaque hashes and fixed enum-derived text
- push payloads never include terminal content, commands, paths, session names,
  or last terminal lines
- relay requests validate schemas with `garde`
- relay push paths verify daemon signatures, token ownership, nonce replay
  windows, and timestamp skew
- Android BiometricPrompt gates app resume and stale input

Honeycomb is the only v1 observability backend. Crash-reporting SDKs are not
part of v1.

## 7. State Inference

State inference lives under `crates/daemon/src/state_infer/`.

v1 modules:

- `claude`: byte-rate baseline, prompt detection, and Claude Code Stop-hook
  integration through the local hook socket.
- `codex`: structured Codex events accepted through the local Codex event hook
  path.
- `unknown`: byte-rate baseline only.

Fixture-based tests should cover captured Claude and Codex sessions as fixtures
are added. Unknown commands must never infer `AwaitingInput` from content. Local
Claude/Codex hook events may still update a generic shell-backed Shelly
session through `SHELLY_SESSION_ID`, because agents can be started and
replaced inside the same PTY.

## 8. Relay

The relay provides:

- iroh relay fallback
- typed-code rendezvous
- relay version endpoint
- daemon registration
- push token registration and unregistration
- generic push dispatch
- aggregate metrics

The relay does not terminate or inspect terminal byte streams. iroh relay traffic
is encrypted transport data. The relay control plane sees only the minimum
metadata needed for rendezvous and push.

Production relay credentials and hosting remain an operator gate. Local relay
smokes are acceptable substitutes until production credentials and infrastructure
are available.

## 9. Mobile

Android is the active mobile target for v1. It must
pair, list sessions, create (shell only) and kill sessions, attach, send input,
resize, detach, register push tokens, restore after process restart, and pass
Android build/unit checks. Emulator
handoff validation should be done directly with `adb`, screenshots, UI dumps,
and logcat rather than repo-owned wrapper scripts.

iOS is deferred for v1. Keep the parked source tree, but do not
keep active iOS prereq helpers, release workflows, or CI checks in the current
production/dev surface until iOS work is explicitly resumed.

Mobile includes a shell-only create surface and a kill surface. It must not allow
arbitrary-command creation (the daemon forces a default shell for mobile) or
agent-state injection.

## 10. Current Script Surface

The root `package.json` intentionally exposes only real build, smoke, package,
relay, site, and Android commands:

- `build:local-npm-artifacts`
- `build:site`
- `check:infra-terraform`
- `check:site`
- `generate:oss-notices`
- `publish:npm`
- `render:demo-video`
- Android unit checks under `test:android-unit`
- npm package commands under `test:npm-*`
- Bun optional-dependency compatibility under `test:bun-install`
- relay smoke commands under `test:relay-*`
- CLI/local smoke commands under `test:cli-*`, `test:local-handoff`,
  `test:hosted-relay`, and `test:macos-daemon-launchd`

Dev-only release-readiness harnesses, generated handoff packs, scripted Android
emulator wrappers, isolated debug-instance helpers, and custom one-off audit
commands are not part of the production command surface.

Operator infrastructure provisioning uses direct Terraform/Ansible commands.
The relay host scaffold targets AWS Lightsail; cloud capacity and bundle changes
stay operator-owned.

`test:local-handoff` and `test:hosted-relay` build the CLI with the
`shelly-cli/test-client` Cargo feature so they can run the internal
simulated-phone `pair-test` harness. Normal production CLI builds do not enable
that feature, so `pair-test` is not compiled into the shipped `shelly` binary.
`test:hosted-relay` is an operator smoke and requires an explicit relay
control URL via `SHELLY_HOSTED_RELAY_CONTROL_URL`,
`SHELLY_RELAY_CONTROL_URL`, or a first positional argument.

## 11. Required Local Checks

Run the relevant subset before ending a milestone:

```sh
cargo fmt --check
cargo clippy --workspace -- -D warnings
cargo nextest run --workspace
cargo test --doc
cargo deny check
cargo audit
pnpm build:local-npm-artifacts
pnpm test:npm-dispatcher
pnpm test:npm-publish-plan
pnpm test:npm-artifacts
pnpm test:npm-local-install
pnpm test:bun-install
pnpm test:local-handoff
pnpm test:macos-daemon-launchd
pnpm test:relay-tls
pnpm test:relay-otlp
pnpm check:play-release-notes
pnpm test:play-rollout
pnpm check:site
apps/android/scripts/build-rust.sh
apps/android/gradlew --no-daemon bundleRelease
pnpm test:android-unit
```

Android Gradle app tasks depend on `buildRustMobileCore`, which invokes
`apps/android/scripts/build-rust.sh` before Kotlin compilation or native-library
merge. The standalone script remains a useful explicit preflight, but CI and
release workflows rely on the Gradle dependency so generated UniFFI bindings and
JNI libraries cannot be skipped accidentally.

When touching shell or Node scripts, also run syntax checks:

```sh
find scripts apps/android/scripts -name '*.sh' -print0 | xargs -0 -n1 bash -n
find scripts -name '*.mjs' -print0 | xargs -0 -n1 node --check
```

When touching Android behavior, run the closest available emulator smoke with
direct `adb` screenshots/logcat inspection where needed.

## 12. Manual Release Gates

Each release still involves deliberate maintainer steps outside CI:

- npm publish of `shellykit` through the release workflows
- npm provenance confirmation
- GitHub release finalization
- production relay credential deployment
- FCM real-device delivery
- signed Android internal-track device pass
- protected Play production rollout approval and post-rollout monitoring

The codebase should make these steps straightforward, but the final approval,
account, credential, and physical-device steps are operator-owned.
