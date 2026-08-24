#!/usr/bin/env bash
set -euo pipefail

base_sha="${1:-}"
head_sha="${2:-HEAD}"
output_file="${GITHUB_OUTPUT:-/dev/stdout}"

core=false
macos=false
packaging=false
terraform=false
ansible=false
workflow=false
relay=false
android=false

select_all() {
  core=true
  macos=true
  packaging=true
  terraform=true
  ansible=true
  workflow=true
  relay=true
  android=true
}

if [[ -z "$base_sha" || "$base_sha" =~ ^0+$ ]] || ! git cat-file -e "$base_sha^{commit}" 2>/dev/null; then
  echo "No usable base revision; running every CI area."
  select_all
else
  changed_files="$(git diff --name-only --diff-filter=ACDMRTUXB "$base_sha...$head_sha")"
  echo "Changed files:"
  if [[ -n "$changed_files" ]]; then
    sed 's/^/  /' <<< "$changed_files"
  else
    echo "  (none)"
  fi

  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    case "$path" in
      .github/workflows/ci.yml | scripts/ci-changed-areas.sh)
        select_all
        ;;
      Cargo.toml | Cargo.lock | rust-toolchain.toml | deny.toml | .cargo/audit.toml)
        core=true
        macos=true
        packaging=true
        relay=true
        android=true
        ;;
      crates/*)
        core=true
        macos=true
        packaging=true
        relay=true
        android=true
        ;;
      packages/* | package.json | pnpm-lock.yaml | .changeset/*)
        macos=true
        packaging=true
        android=true
        ;;
      site/*)
        # There is no deployed Shelly website yet.
        ;;
      infra/lightsail/terraform/*)
        terraform=true
        ;;
      infra/relay/ansible/*)
        ansible=true
        relay=true
        ;;
      infra/*)
        terraform=true
        ansible=true
        ;;
      .github/workflows/deploy-relay.yml | scripts/smoke-hosted-relay-rendezvous.sh)
        workflow=true
        relay=true
        ;;
      .github/workflows/release-android.yml | .github/workflows/rollout-android.yml)
        workflow=true
        android=true
        ;;
      .github/workflows/* | .github/dependabot.yml | .pre-commit-config.yaml)
        workflow=true
        ;;
      scripts/smoke-cli-* | scripts/smoke-local-handoff.sh | scripts/smoke-relay-*)
        core=true
        workflow=true
        ;;
      scripts/*npm* | scripts/*bun* | scripts/*release* | scripts/generate-oss-notices.mjs | scripts/build-local-npm-artifacts.sh)
        macos=true
        packaging=true
        workflow=true
        android=true
        ;;
      scripts/check-infra-terraform.sh)
        terraform=true
        workflow=true
        ;;
      scripts/*play* | apps/android/scripts/*)
        workflow=true
        android=true
        ;;
      scripts/*)
        workflow=true
        ;;
      LICENSE | NOTICE | THIRD_PARTY_LICENSES.md | docs/open-source-notices.json)
        packaging=true
        ;;
      apps/android/*)
        android=true
        ;;
      docs/* | *.md | .github/ISSUE_TEMPLATE/* | .github/PULL_REQUEST_TEMPLATE.md | .github/CODEOWNERS)
        # Prose and repository metadata intentionally take only the stable CI gate.
        ;;
      *)
        echo "Unclassified path '$path'; running every CI area conservatively."
        select_all
        ;;
    esac
  done <<< "$changed_files"
fi

{
  printf 'core=%s\n' "$core"
  printf 'macos=%s\n' "$macos"
  printf 'packaging=%s\n' "$packaging"
  printf 'terraform=%s\n' "$terraform"
  printf 'ansible=%s\n' "$ansible"
  printf 'workflow=%s\n' "$workflow"
  printf 'relay=%s\n' "$relay"
  printf 'android=%s\n' "$android"
} | tee -a "$output_file"
