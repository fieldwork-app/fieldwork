#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const projectBuild = read("apps/android/build.gradle.kts");
const appBuild = read("apps/android/app/build.gradle.kts");
const gradleProperties = read("apps/android/gradle.properties");
const gradleWrapper = read("apps/android/gradlew");

const agpVersion = matchVersion(
  projectBuild,
  /id\("com\.android\.application"\) version "([^"]+)"/,
  "Android Gradle plugin",
);
const gradleVersion = matchVersion(gradleWrapper, /gradle_version="([^"]+)"/, "Gradle");

assert(versionAtLeast(agpVersion, 9, 0), `AGP ${agpVersion} does not enable optimized resource shrinking by default`);
assert(versionAtLeast(gradleVersion, 9, 1), `Gradle ${gradleVersion} is too old for AGP ${agpVersion}`);
assert(!projectBuild.includes('id("org.jetbrains.kotlin.android")'), "top-level build still declares kotlin-android");
assert(!appBuild.includes('id("org.jetbrains.kotlin.android")'), "app build still applies kotlin-android instead of AGP built-in Kotlin");
assert(appBuild.includes("isMinifyEnabled = true"), "release code shrinking is not enabled");
assert(appBuild.includes("isShrinkResources = true"), "release resource shrinking is not enabled");
assert(
  appBuild.includes('getDefaultProguardFile("proguard-android-optimize.txt")'),
  "release build is not using Android's optimizing default R8 rules",
);
assert(
  !/^\s*android\.enableR8\.fullMode\s*=\s*false\s*$/m.test(gradleProperties),
  "R8 full mode is explicitly disabled",
);

console.log(
  `Android release optimization verified: AGP ${agpVersion}, Gradle ${gradleVersion}, full R8 code and optimized resource shrinking`,
);

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function matchVersion(contents, pattern, name) {
  const value = contents.match(pattern)?.[1];
  assert(value, `${name} version is not declared in the expected location`);
  return value;
}

function versionAtLeast(version, requiredMajor, requiredMinor) {
  const [major, minor] = version.split(".").map(Number);
  return Number.isInteger(major) && Number.isInteger(minor) &&
    (major > requiredMajor || (major === requiredMajor && minor >= requiredMinor));
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}
