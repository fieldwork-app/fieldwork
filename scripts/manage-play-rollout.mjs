#!/usr/bin/env node

import { createSign } from "node:crypto";
import { appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const ANDROID_PUBLISHER_SCOPE = "https://www.googleapis.com/auth/androidpublisher";
const ANDROID_PUBLISHER_BASE = "https://androidpublisher.googleapis.com/androidpublisher/v3";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const ALLOWED_PERCENTAGES = new Set([10, 25, 50, 100]);

function cloneRelease(release) {
  return {
    ...release,
    versionCodes: [...(release.versionCodes ?? [])],
    ...(release.releaseNotes
      ? { releaseNotes: release.releaseNotes.map((note) => ({ ...note })) }
      : {}),
    ...(release.countryTargeting
      ? {
          countryTargeting: {
            ...release.countryTargeting,
            countries: [...(release.countryTargeting.countries ?? [])],
          },
        }
      : {}),
  };
}

function releaseContainsVersion(release, versionCode) {
  return (release.versionCodes ?? []).some((value) => Number(value) === versionCode);
}

function describeRelease(release) {
  if (!release) {
    return "not present";
  }
  const fraction = release.userFraction == null ? "" : ` at ${Math.round(release.userFraction * 100)}%`;
  return `${release.status ?? "unknown"}${fraction}`;
}

export function parseRolloutTarget(value) {
  if (value === "halt") {
    return { kind: "halt" };
  }

  const percentage = Number(value);
  if (!Number.isInteger(percentage) || !ALLOWED_PERCENTAGES.has(percentage)) {
    throw new Error("Rollout target must be one of: 10, 25, 50, 100, halt.");
  }
  return { kind: "rollout", percentage };
}

export function planProductionTrack({ internalTrack, productionTrack, versionCode, target }) {
  if (!Number.isSafeInteger(versionCode) || versionCode <= 0) {
    throw new Error(`Invalid Android version code: ${versionCode}`);
  }

  const internalReleases = internalTrack?.releases ?? [];
  const productionReleases = (productionTrack?.releases ?? []).map(cloneRelease);
  const internalRelease = internalReleases.find((release) => releaseContainsVersion(release, versionCode));
  const productionIndex = productionReleases.findIndex((release) =>
    releaseContainsVersion(release, versionCode),
  );
  const productionRelease = productionIndex >= 0 ? productionReleases[productionIndex] : undefined;

  if (!internalRelease && !productionRelease) {
    throw new Error(
      `Version code ${versionCode} is absent from both the internal and production tracks. Upload it to internal first.`,
    );
  }
  if (target.kind !== "halt" && internalRelease?.status !== "completed") {
    throw new Error(
      `Version code ${versionCode} must be completed on the internal track before production promotion; found ${internalRelease?.status ?? "not present"}.`,
    );
  }

  const newerProductionCodes = productionReleases
    .flatMap((release) => release.versionCodes ?? [])
    .map(Number)
    .filter((candidate) => Number.isSafeInteger(candidate) && candidate > versionCode);
  if (newerProductionCodes.length > 0) {
    throw new Error(
      `Refusing to roll back production: newer version code ${Math.max(...newerProductionCodes)} is already present.`,
    );
  }

  const otherOutstandingRelease = productionReleases.find(
    (release, index) =>
      index !== productionIndex &&
      ["draft", "inProgress", "halted"].includes(release.status ?? ""),
  );
  if (otherOutstandingRelease) {
    throw new Error(
      `Production has another outstanding ${describeRelease(otherOutstandingRelease)} release (${(otherOutstandingRelease.versionCodes ?? []).join(", ")}). Resolve it first.`,
    );
  }

  const sourceRelease = productionRelease ?? internalRelease;
  const releaseNotes =
    productionRelease?.releaseNotes?.length > 0
      ? productionRelease.releaseNotes
      : internalRelease?.releaseNotes;
  const previous = productionRelease ? cloneRelease(productionRelease) : undefined;
  let desiredRelease;

  if (target.kind === "halt") {
    if (!productionRelease) {
      throw new Error(`Version code ${versionCode} is not on production, so it cannot be halted.`);
    }
    if (productionRelease.status === "halted") {
      return {
        noOp: true,
        previous,
        desired: previous,
        track: { track: "production", releases: productionReleases },
      };
    }
    if (productionRelease.status !== "inProgress") {
      throw new Error(
        `Only an in-progress rollout can be halted; version code ${versionCode} is ${describeRelease(productionRelease)}.`,
      );
    }
    desiredRelease = { ...cloneRelease(productionRelease), status: "halted" };
  } else {
    const status = target.percentage === 100 ? "completed" : "inProgress";
    const desiredFraction = target.percentage / 100;
    const hasCompletedProductionRelease = productionReleases.some(
      (release) => release.status === "completed",
    );

    if (
      status === "inProgress" &&
      !hasCompletedProductionRelease &&
      !["inProgress", "halted"].includes(productionRelease?.status ?? "")
    ) {
      throw new Error(
        "Google Play does not support a staged percentage for the first production release; use 100.",
      );
    }

    if (productionRelease?.status === "completed") {
      if (status === "completed") {
        return {
          noOp: true,
          previous,
          desired: previous,
          track: { track: "production", releases: productionReleases },
        };
      }
      throw new Error(`Version code ${versionCode} is already completed on production.`);
    }

    const currentFraction = productionRelease?.userFraction;
    if (
      currentFraction != null &&
      status === "inProgress" &&
      desiredFraction < currentFraction - Number.EPSILON
    ) {
      throw new Error(
        `Rollout percentages may only increase; current=${Math.round(currentFraction * 100)}%, requested=${target.percentage}%.`,
      );
    }
    if (
      productionRelease?.status === "inProgress" &&
      status === "inProgress" &&
      Math.abs((currentFraction ?? 0) - desiredFraction) < Number.EPSILON
    ) {
      return {
        noOp: true,
        previous,
        desired: previous,
        track: { track: "production", releases: productionReleases },
      };
    }

    desiredRelease = {
      ...(sourceRelease.name ? { name: sourceRelease.name } : {}),
      versionCodes: [...sourceRelease.versionCodes],
      ...(releaseNotes
        ? { releaseNotes: releaseNotes.map((note) => ({ ...note })) }
        : {}),
      ...(sourceRelease.inAppUpdatePriority != null
        ? { inAppUpdatePriority: sourceRelease.inAppUpdatePriority }
        : {}),
      status,
      ...(status === "inProgress" ? { userFraction: desiredFraction } : {}),
      ...(status === "inProgress" && productionRelease?.countryTargeting
        ? { countryTargeting: { ...productionRelease.countryTargeting } }
        : {}),
    };
  }

  const releases = [...productionReleases];
  if (productionIndex >= 0) {
    releases[productionIndex] = desiredRelease;
  } else {
    releases.unshift(desiredRelease);
  }

  return {
    noOp: false,
    previous,
    desired: cloneRelease(desiredRelease),
    track: { track: "production", releases },
  };
}

function base64Url(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return buffer.toString("base64url");
}

export async function getAccessToken(serviceAccountJson) {
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error("PLAY_SERVICE_ACCOUNT_JSON is not valid JSON.");
  }
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("PLAY_SERVICE_ACCOUNT_JSON must contain client_email and private_key.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: ANDROID_PUBLISHER_SCOPE,
      aud: GOOGLE_TOKEN_ENDPOINT,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsignedAssertion = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedAssertion);
  signer.end();
  const assertion = `${unsignedAssertion}.${base64Url(signer.sign(serviceAccount.private_key))}`;

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    throw new Error(`Google OAuth token request failed (${response.status}): ${payload.error ?? "unknown error"}`);
  }
  return payload.access_token;
}

async function playRequest(accessToken, method, path, body) {
  const response = await fetch(`${ANDROID_PUBLISHER_BASE}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : undefined;
  } catch {
    payload = undefined;
  }
  if (!response.ok) {
    const message = (payload?.error?.message ?? text.slice(0, 1000)) || "unknown error";
    throw new Error(`Play API ${method} ${path} failed (${response.status}): ${message}`);
  }
  return payload;
}

function parseArguments(argv) {
  const options = { packageName: "app.shelly.android" };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--package-name") {
      options.packageName = argv[++index];
    } else if (argument === "--version-code") {
      options.versionCode = Number(argv[++index]);
    } else if (argument === "--target") {
      options.target = parseRolloutTarget(argv[++index]);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (!options.packageName || !/^[a-zA-Z][a-zA-Z0-9_.]*$/.test(options.packageName)) {
    throw new Error("--package-name must be a valid Android package name.");
  }
  if (!Number.isSafeInteger(options.versionCode) || options.versionCode <= 0) {
    throw new Error("--version-code is required and must be a positive integer.");
  }
  if (!options.target) {
    throw new Error("--target is required.");
  }
  return options;
}

function writeSummary({ packageName, versionCode, plan, target }) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }
  const requested = target.kind === "halt" ? "halt" : `${target.percentage}%`;
  const outcome = plan.noOp ? "No change required" : "Play edit committed";
  appendFileSync(
    summaryPath,
    [
      "### Android production rollout",
      "",
      `- Package: \`${packageName}\``,
      `- Version code: \`${versionCode}\``,
      `- Requested state: \`${requested}\``,
      `- Previous state: \`${describeRelease(plan.previous)}\``,
      `- Result: **${outcome}**`,
      "",
    ].join("\n"),
  );
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const serviceAccountJson = process.env.PLAY_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error("PLAY_SERVICE_ACCOUNT_JSON is required.");
  }

  const accessToken = await getAccessToken(serviceAccountJson);
  const packagePath = encodeURIComponent(options.packageName);
  let editId;

  try {
    const edit = await playRequest(accessToken, "POST", `/applications/${packagePath}/edits`, {});
    editId = edit.id;
    const editPath = `/applications/${packagePath}/edits/${encodeURIComponent(editId)}`;
    const [internalTrack, productionTrack] = await Promise.all([
      playRequest(accessToken, "GET", `${editPath}/tracks/internal`),
      playRequest(accessToken, "GET", `${editPath}/tracks/production`),
    ]);

    const plan = planProductionTrack({
      internalTrack,
      productionTrack,
      versionCode: options.versionCode,
      target: options.target,
    });

    if (!plan.noOp) {
      await playRequest(accessToken, "PUT", `${editPath}/tracks/production`, plan.track);
      await playRequest(
        accessToken,
        "POST",
        `${editPath}:commit?changesInReviewBehavior=ERROR_IF_IN_REVIEW`,
      );
      editId = undefined;
    } else {
      await playRequest(accessToken, "DELETE", editPath);
      editId = undefined;
    }

    writeSummary({
      packageName: options.packageName,
      versionCode: options.versionCode,
      plan,
      target: options.target,
    });
    console.log(
      plan.noOp
        ? `Production is already ${describeRelease(plan.desired)} for version code ${options.versionCode}.`
        : `Production changed from ${describeRelease(plan.previous)} to ${describeRelease(plan.desired)} for version code ${options.versionCode}.`,
    );
  } catch (error) {
    if (editId) {
      const editPath = `/applications/${packagePath}/edits/${encodeURIComponent(editId)}`;
      await playRequest(accessToken, "DELETE", editPath).catch(() => undefined);
    }
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
