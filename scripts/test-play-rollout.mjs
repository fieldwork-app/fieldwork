#!/usr/bin/env node

import assert from "node:assert/strict";
import { createVerify, generateKeyPairSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { getAccessToken, parseRolloutTarget, planProductionTrack } from "./manage-play-rollout.mjs";

const rolloutWorkflow = readFileSync(
  new URL("../.github/workflows/rollout-android.yml", import.meta.url),
  "utf8",
);
assert.match(
  rolloutWorkflow,
  /target:\n(?:[ \t].*\n)*?[ \t]+default: "100"\n(?:[ \t].*\n)*?[ \t]+options:\n[ \t]+- "100"/,
  "Android production rollout must default to 100%",
);

function release(versionCode, status, userFraction) {
  return {
    name: `Shelly ${versionCode}`,
    versionCodes: [String(versionCode)],
    status,
    ...(userFraction == null ? {} : { userFraction }),
    releaseNotes: [{ language: "en-US", text: `Release ${versionCode}` }],
    inAppUpdatePriority: 2,
  };
}

const completedInternal = { track: "internal", releases: [release(1_000_007, "completed")] };
const oldProduction = release(1_000_006, "completed");

{
  const draft = release(1_000_007, "draft");
  delete draft.releaseNotes;
  const plan = planProductionTrack({
    internalTrack: completedInternal,
    productionTrack: { track: "production", releases: [draft, oldProduction] },
    versionCode: 1_000_007,
    target: parseRolloutTarget("10"),
  });
  assert.equal(plan.noOp, false);
  assert.equal(plan.desired.status, "inProgress");
  assert.equal(plan.desired.userFraction, 0.1);
  assert.deepEqual(plan.desired.releaseNotes, completedInternal.releases[0].releaseNotes);
}

{
  const plan = planProductionTrack({
    internalTrack: completedInternal,
    productionTrack: { track: "production", releases: [oldProduction] },
    versionCode: 1_000_007,
    target: parseRolloutTarget("25"),
  });
  assert.equal(plan.track.releases[0].status, "inProgress");
  assert.equal(plan.track.releases[0].userFraction, 0.25);
  assert.equal(plan.track.releases[1].versionCodes[0], "1000006");
}

{
  const current = release(1_000_007, "inProgress", 0.25);
  const plan = planProductionTrack({
    internalTrack: completedInternal,
    productionTrack: { track: "production", releases: [current, oldProduction] },
    versionCode: 1_000_007,
    target: parseRolloutTarget("50"),
  });
  assert.equal(plan.desired.userFraction, 0.5);
  assert.throws(
    () =>
      planProductionTrack({
        internalTrack: completedInternal,
        productionTrack: { track: "production", releases: [current, oldProduction] },
        versionCode: 1_000_007,
        target: parseRolloutTarget("10"),
      }),
    /only increase/,
  );
}

{
  const current = release(1_000_007, "inProgress", 0.5);
  const completed = planProductionTrack({
    internalTrack: completedInternal,
    productionTrack: { track: "production", releases: [current, oldProduction] },
    versionCode: 1_000_007,
    target: parseRolloutTarget("100"),
  });
  assert.equal(completed.desired.status, "completed");
  assert.equal(completed.desired.userFraction, undefined);

  const halted = planProductionTrack({
    internalTrack: completedInternal,
    productionTrack: { track: "production", releases: [current, oldProduction] },
    versionCode: 1_000_007,
    target: parseRolloutTarget("halt"),
  });
  assert.equal(halted.desired.status, "halted");
  assert.equal(halted.desired.userFraction, 0.5);
}

{
  const current = release(1_000_007, "inProgress", 0.25);
  const plan = planProductionTrack({
    internalTrack: completedInternal,
    productionTrack: { track: "production", releases: [current, oldProduction] },
    versionCode: 1_000_007,
    target: parseRolloutTarget("25"),
  });
  assert.equal(plan.noOp, true);
}

assert.throws(
  () =>
    planProductionTrack({
      internalTrack: completedInternal,
      productionTrack: { track: "production", releases: [release(1_000_008, "completed")] },
      versionCode: 1_000_007,
      target: parseRolloutTarget("10"),
    }),
  /Refusing to roll back/,
);

assert.throws(
  () =>
    planProductionTrack({
      internalTrack: completedInternal,
      productionTrack: { track: "production", releases: [release(1_000_007, "draft")] },
      versionCode: 1_000_007,
      target: parseRolloutTarget("10"),
    }),
  /first production release/,
);

assert.throws(
  () =>
    planProductionTrack({
      internalTrack: { track: "internal", releases: [] },
      productionTrack: { track: "production", releases: [release(1_000_007, "draft")] },
      versionCode: 1_000_007,
      target: parseRolloutTarget("100"),
    }),
  /completed on the internal track/,
);

assert.throws(() => parseRolloutTarget("75"), /one of/);

{
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" });
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://oauth2.googleapis.com/token");
    assert.equal(options.method, "POST");
    const form = new URLSearchParams(options.body);
    assert.equal(form.get("grant_type"), "urn:ietf:params:oauth:grant-type:jwt-bearer");
    const assertion = form.get("assertion");
    const [header, claims, signature] = assertion.split(".");
    const parsedClaims = JSON.parse(Buffer.from(claims, "base64url").toString("utf8"));
    assert.equal(parsedClaims.iss, "play@example.test");
    assert.equal(parsedClaims.scope, "https://www.googleapis.com/auth/androidpublisher");
    assert.equal(parsedClaims.aud, "https://oauth2.googleapis.com/token");
    const verifier = createVerify("RSA-SHA256");
    verifier.update(`${header}.${claims}`);
    verifier.end();
    assert.equal(verifier.verify(publicKey, Buffer.from(signature, "base64url")), true);
    return new Response(JSON.stringify({ access_token: "fixture-access-token" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  try {
    const token = await getAccessToken(
      JSON.stringify({ client_email: "play@example.test", private_key: privateKeyPem }),
    );
    assert.equal(token, "fixture-access-token");
  } finally {
    globalThis.fetch = originalFetch;
  }
}

console.log("Play rollout planning tests passed");
