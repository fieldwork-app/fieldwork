# Operations

This document covers the current production-facing operations surface after the
local verifier harness was removed. Operator-owned work is handled manually and
through CI workflows, not through repository capture scripts.

## npm Release

The publish flow is npm-only for desktop.

1. Push a matching `v*.*.*` tag whose commit is on `main`; the Rust release
   workflow builds and attests the artifacts.
2. A successful Rust release automatically starts `.github/workflows/release-npm.yml`.
   Each
   npm package trusts the `iamjr15/shelly` GitHub repository and the
   `release-npm.yml` workflow for `npm publish` through OIDC; no npm publishing
   token is stored in GitHub.
3. The workflow downloads release archives, checks `.sha256` files with
   `shasum`, stages platform package binaries with
   `scripts/prepare-npm-artifacts.mjs`, and publishes through
   `scripts/publish-npm-packages.mjs`.

The publish script always publishes in dependency order:

1. `shellykit-darwin-arm64`
2. `shellykit-darwin-x64`
3. `shellykit-linux-arm64`
4. `shellykit-linux-x64`
5. `shellykit`

Use npm registry UI/API checks after publish to confirm the latest dist-tags and
provenance visibility.

## Relay Deployment

The relay infrastructure scaffold lives under `infra/lightsail` and
`infra/relay/ansible`. The active Mumbai relay runs on AWS Lightsail as
`dock-relay` with static IP `3.7.138.203`, behind the DNS A record
`relay.shelly.sh` → `3.7.138.203` (DNS-only, not Cloudflare-proxied, so TLS
terminates on the host).

The committed Ansible defaults describe the production topology:

- Caddy owns TLS. It serves ACME-issued certificates for `relay.shelly.sh` on
  443 (HTTP on 80 for the ACME challenge and captive-portal probe) with ACME
  contact `ops@shelly.sh`, and reverse-proxies `/v1/*` and `/healthz` to the
  control plane, `/metrics` to the control metrics listener, and everything
  else to the iroh relay.
- both relay services are loopback-only backends: the control plane listens on
  `127.0.0.1:8443` plain HTTP (`shelly_relay_control_require_tls` stays
  `false` because it is never exposed directly), and the iroh relay runs with
  `shelly_iroh_relay_http_only: "true"` on `127.0.0.1:8080`.
- `shelly_relay_trust_forwarded_for` defaults to `true` because Caddy fronts
  the control plane and overwrites `X-Forwarded-For`, so rate-limit identity
  uses the real client hop.
- FCM, APNs, and Honeycomb credentials are optional; missing files disable those
  integrations instead of preventing the relay from starting.

**The iroh relay is the sole NodeID rendezvous — there is no n0 fallback — so its
uptime is load-bearing.** The laptop daemon must set
`SHELLY_IROH_RELAY_URL=https://relay.shelly.sh` to use it; with that unset the
daemon runs direct-only (LAN) and cross-network reconnect will not work. Phones
learn the relay URL from the pairing ticket, so re-pair after first enabling the
relay.

Abuse/cost posture: the iroh relay forwards encrypted QUIC for any NodeID —
pairing and identity are enforced end-to-end at the app layer, so an open relay
URL does not weaken authentication; the practical risk is bandwidth/connection
abuse. Bound it at the Lightsail firewall (restrict and monitor inbound on
`80/443`; `7842/udp` matters only if the direct iroh TLS path is ever enabled)
and watch the relay's aggregate metrics on `127.0.0.1:9091`.
Per-client iroh-level rate limits can be added if abuse appears.

`.github/workflows/deploy-relay.yml` deploys every successful `main` CI
revision automatically. Deploying every green revision avoids production drift
when a prior deployment fails and a later, unrelated merge succeeds. It builds
`shelly-relay` on an Ubuntu x64 runner, temporarily opens Lightsail SSH to
that runner's public IPv4 address, runs the Ansible playbook, and closes the
temporary SSH rule in an `always()` cleanup step.

The workflow expects this GitHub repository variable:

- `RELAY_AWS_ROLE_ARN` (`arn:aws:iam::526867055655:role/GitHubActionsDockRelayDeploy`)

The workflow expects these GitHub Secrets:

- `RELAY_SSH_KEY`
- `RELAY_KNOWN_HOSTS` (ssh-keyscan output for the relay hosts; generate with
  `ssh-keyscan -H <relay-host> 2>/dev/null`)

`RELAY_SSH_KEY` is a dedicated deploy key installed in `ubuntu`'s
`authorized_keys` on `dock-relay`; it is not a personal operator SSH key. The
AWS role is assumed through GitHub OIDC and is limited to reading Lightsail
instance state plus opening/closing the temporary SSH ingress rule.

The AWS OIDC trust accepts only the GitHub Actions subject for the
`relay-production` environment, and that environment has a deployment branch
policy allowing only `main`. This keeps AWS role assumption tied to the
release environment instead of any arbitrary workflow or branch in the
repository.

Lightsail host creation is direct Terraform. Run `terraform init` and
`terraform apply` in `infra/lightsail/terraform` with a local, ignored tfvars
file containing operator SSH CIDRs. Existing AWS CLI-created resources must be
imported into Terraform state before the first apply.

For local infrastructure validation:

```sh
scripts/check-infra-terraform.sh
scripts/smoke-relay-tls-loopback.sh
node scripts/smoke-relay-otlp-loopback.mjs
```

Relay-only secrets must stay on the relay host:

- FCM service-account JSON
- Honeycomb API key
- TLS private key

Do not commit those files or copy them into CLI, daemon, npm package, mobile, or
site directories.

Serving the iroh relay's own TLS directly (bypassing Caddy) is not the deployed
model; if it is ever needed, switch `shelly_iroh_relay_http_only` to `false`,
enable Terraform's `enable_iroh_tls_ports` variable, and open 443/tcp and
7842/udp to the relay process instead of Caddy.

APNs credentials and environment are only configured when the deferred iOS
client resumes; Ansible omits the APNs env vars and `apns.p8` credential while
`shelly_relay_apns_team_id` is empty.

`SHELLY_RELAY_TRUST_FORWARDED_FOR` is off in the relay binary's own default,
which keys rate limits on the socket peer address. Only set it — as the Ansible
defaults do — when the relay sits behind a trusted proxy that overwrites
`X-Forwarded-For`.

## Android Release

Android delivery is split deliberately:

- `.github/workflows/release-android.yml` builds one signed artifact and uploads
  an `android-v*.*.*` tag to Play internal testing.
- `.github/workflows/rollout-android.yml` promotes that exact version code to
  production, increases its staged percentage, completes it, or halts it. It
  never rebuilds or re-uploads the AAB.

Configure the `android-internal` GitHub environment with these secrets:

- `ANDROID_GOOGLE_SERVICES_JSON`
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PROPERTIES`
- `SHELLY_RELAY_CONTROL_URL`
- `PLAY_SERVICE_ACCOUNT_JSON`

Configure the separate `android-production` environment with only:

- `PLAY_SERVICE_ACCOUNT_JSON`

Use distinct app-scoped Play service accounts for internal upload and production
promotion when possible, even though both environment secrets use the same name.
The internal account needs testing-track release access; the production account
needs production-release access. Neither needs account administration or
financial permissions.

Do not leave these as repository-level secrets after copying them into their
environments. The repository environments are configured so `android-internal`
accepts only `android-v*.*.*` tags and `android-production` accepts only `main`.
Production requires approval plus a five-minute wait, and administrator bypass
is disabled on both environments. This single-maintainer repository allows
self-approval, but the typed confirmation still protects against an accidental
click.

The internal workflow builds mobile Rust libraries, decodes Firebase/signing
config, verifies that AGP 9 full-mode R8 and optimized resource shrinking remain
enabled, validates versioned Play release notes, runs Android lint and unit tests,
builds the minified release AAB, verifies the JAR signature, checks that the AAB
contains its ProGuard mapping and Rust native debug symbols, uploads it to Play
internal testing, retains the AAB/mapping/notes as a 90-day Actions artifact, and
removes generated secrets in cleanup. Pull requests touching Android or its Rust
dependencies run the corresponding unsigned release build before merge.

For every version, add at least
`apps/android/distribution/whatsnew/VERSION/en-US.txt`. The note validator
enforces BCP-47 locale filenames and Play's 500-Unicode-character limit.

Release sequence:

1. Merge a green revision to `main` and add versioned Play notes.
2. Push the matching `android-vVERSION` tag. Confirm the internal upload and its
   Play pre-launch report.
3. Install from internal testing and complete the physical-device release pass:
   pairing, reconnect, terminal I/O, background/foreground behavior,
   notifications, crash buffer, and upgrade from the prior production version.
4. Run `Roll out Android Production` from `main`. Enter the committed version,
   select the target, and enter `app.shelly.android@VERSION:TARGET` exactly.
5. Monitor Android vitals and product telemetry between stages. Advance later
   updates through `10` → `25` → `50` → `100`; select `halt` if a staged release
   regresses. Google Play requires the first production release to use `100`.

An API commit can still wait for Google review or for an operator to publish it
when Managed Publishing is enabled. Confirm the release is actually serving in
Play Console's Publishing overview and production-track rollout history; a green
Actions job proves the requested edit was committed, not that review has
finished.

The production script refuses percentage decreases, a version older than one
already on production, promotion before a completed internal release, a second
outstanding production release, or a commit that would cancel changes already
under Play review. Re-running an already-applied target is a no-op.

## Website deployment

The public site is a static Astro project in `site/` and is deployed to GitHub
Pages by `.github/workflows/deploy-site.yml`. Automatic deployments run only
when files under `site/` change on `main`; operators can also start the workflow
manually. The custom domain is `shelly.sh`.

Local commands:

```sh
pnpm --dir site install --ignore-workspace --frozen-lockfile
pnpm check:site
pnpm build:site
```

Domain ownership and Cloudflare project setup are operator-owned.

## Manual Release Checklist

Before a public v1 release, manually confirm:

- npm package ownership and trusted-publisher configuration for all five
  packages.
- GitHub Release archives, checksums, and provenance bundles are present.
- macOS npm-installed binaries launch without quarantine issues.
- Relay host uses production DNS/TLS and relay-only credentials.
- Android release AAB is signed with the production keystore.
- Play internal upload succeeds.
- Store privacy labels match `docs/STORE_PRIVACY.md`.
- Physical Android testing has been done on signed release builds.
