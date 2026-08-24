#!/usr/bin/env node

import { cpSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "..");
const version = JSON.parse(readFileSync(join(repoRoot, "packages/cli/package.json"), "utf8")).version;
const sourceDirectory = join(repoRoot, "apps/android/distribution/whatsnew", version);
const outputIndex = process.argv.indexOf("--output");
const outputDirectory = outputIndex >= 0 ? process.argv[outputIndex + 1] : undefined;

if (outputIndex >= 0 && !outputDirectory) {
  throw new Error("--output requires a directory.");
}

let files;
try {
  files = readdirSync(sourceDirectory).filter((file) => file.endsWith(".txt"));
} catch {
  throw new Error(`Missing Play release notes for ${version}: ${sourceDirectory}`);
}

if (files.length === 0) {
  throw new Error(`No Play release-note translations found in ${sourceDirectory}`);
}

if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
}

for (const file of files) {
  const locale = basename(file, ".txt");
  if (!/^[a-z]{2,3}(?:-[A-Z][a-z]{3})?(?:-[A-Z]{2}|-[0-9]{3})?$/.test(locale)) {
    throw new Error(`Invalid BCP-47 release-note locale filename: ${file}`);
  }
  const source = join(sourceDirectory, file);
  const text = readFileSync(source, "utf8").trim();
  const characterCount = Array.from(text).length;
  if (characterCount === 0) {
    throw new Error(`Play release notes must not be empty: ${source}`);
  }
  if (characterCount > 500) {
    throw new Error(`Play release notes exceed 500 Unicode characters (${characterCount}): ${source}`);
  }
  if (outputDirectory) {
    cpSync(source, join(outputDirectory, `whatsnew-${locale}`));
  }
}

console.log(`Play release notes are ready for ${version}: ${files.join(", ")}`);
