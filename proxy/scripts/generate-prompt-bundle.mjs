#!/usr/bin/env node
// prompts/runtime-versions.json + prompts/**/*.md  →  src/prompt-bundle.generated.ts
// data/scenario/default-prompts.json + declared slot sources → src/default-prompt.generated.ts
//
//   node scripts/generate-prompt-bundle.mjs           # write
//   node scripts/generate-prompt-bundle.mjs --check   # exit 1 on drift
//
// WHY A GENERATOR AND NOT A FILE READ. SAM builds this function with esbuild,
// which bundles the entry point's *module graph* — the .md files are not in it,
// so a `readFileSync('prompts/…')` that works locally returns ENOENT inside the
// Lambda zip. Inlining them at build time also keeps the handler free of
// filesystem access entirely, which is the same property the engine has for the
// same reason (physical architecture §3.2).
//
// The .md files stay the source of truth for prompt text: they are what an
// author edits and what `tools/probe` reads directly. `runtime-versions.json`
// is the runtime support contract: older files may stay on disk as probe
// evidence without becoming Lambda API surface. This file is a transcription
// with a drift gate, exactly like `src/shared/datapack.ts` (physical §3.1) —
// `--check` runs inside `npm run check`, so a runtime prompt edit without a
// regenerate fails before deploy.

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const REPO = join(ROOT, '..');
const PROMPTS = join(ROOT, 'prompts');
const VERSIONS = join(PROMPTS, 'runtime-versions.json');
const PROMPT_BUNDLE_OUT = join(ROOT, 'src', 'prompt-bundle.generated.ts');
const DEFAULT_PROMPT_MANIFEST = join(REPO, 'data', 'scenario', 'default-prompts.json');
const SCENARIO_INDEX = join(REPO, 'data', 'scenario', 'index.json');
const DEFAULT_PROMPT_OUT = join(ROOT, 'src', 'default-prompt.generated.ts');

const check = process.argv.includes('--check');

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const packKey = (slug) =>
  createHash('sha256').update(slug.normalize('NFC'), 'utf8').digest('hex');

function runtimeVersions() {
  const parsed = JSON.parse(readFileSync(VERSIONS, 'utf8'));
  const entries = Object.entries(parsed);
  if (!entries.length) throw new Error(`no runtime prompt versions found in ${VERSIONS}`);
  for (const [call, version] of entries) {
    if (!/^[a-z]+$/.test(call)) throw new Error(`invalid call key in ${VERSIONS}: ${call}`);
    if (typeof version !== 'string' || !/^v[0-9]+\.[0-9]+$/.test(version)) {
      throw new Error(`invalid prompt version for ${call} in ${VERSIONS}: ${version}`);
    }
  }
  return parsed;
}

/** `<call>/<layer>-<version>` → text. One flat key space; the loader parses it. */
function collect() {
  const entries = [];
  const versions = runtimeVersions();
  for (const call of Object.keys(versions).sort()) {
    const dir = join(PROMPTS, call);
    if (!statSync(dir).isDirectory()) continue;
    for (const layer of ['base', 'user']) {
      const file = `${layer}-${versions[call]}.md`;
      entries.push({
        key: `${call}/${layer}-${versions[call]}`,
        text: readFileSync(join(dir, file), 'utf8'),
      });
    }
  }
  if (!entries.length) throw new Error(`no prompt files found under ${PROMPTS}`);
  return entries;
}

function renderPromptBundle(entries) {
  const body = entries
    .map(({ key, text }) => `  ${JSON.stringify(key)}: ${JSON.stringify(text)},`)
    .join('\n');
  return `/**
 * ⚠ GENERATED FILE — do not edit by hand.
 * Source: \`proxy/prompts/runtime-versions.json\` plus the selected .md files
 * under \`proxy/prompts/\` (normative).
 * Regenerate with \`npm run prompts:bundle\`; \`--check\` fails on drift and runs
 * inside \`npm run check\`. If this file and the .md files disagree, this file is
 * stale — never the other way around.
 *
 * Inlined rather than read at runtime because esbuild bundles the module graph,
 * not the prompts directory. See scripts/generate-prompt-bundle.mjs.
 */

export const PROMPT_BUNDLE: Readonly<Record<string, string>> = Object.freeze({
${body}
});
`;
}

function assertSlots(value, label) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label}: slots must be an object`);
  }
  if (typeof value.FLAW !== 'string') throw new Error(`${label}: FLAW must be a string`);
  if (typeof value.INCIDENT !== 'string') throw new Error(`${label}: INCIDENT must be a string`);
  if (!Array.isArray(value.PRIORITY_LIST) || value.PRIORITY_LIST.some((line) => typeof line !== 'string')) {
    throw new Error(`${label}: PRIORITY_LIST must be an array of strings`);
  }
}

function collectDefaultPrompts() {
  const index = readJson(SCENARIO_INDEX);
  if (!Array.isArray(index.packs)) throw new Error(`${SCENARIO_INDEX}: packs must be an array`);

  const tutorials = index.packs.filter((pack) => pack?.role === 'tutorial');
  if (tutorials.length !== 1) {
    throw new Error(`${SCENARIO_INDEX}: expected exactly one tutorial pack, found ${tutorials.length}`);
  }
  const knownSlugs = new Set(index.packs.map((pack) => pack?.slug).filter((slug) => typeof slug === 'string'));
  const fallbackSlug = tutorials[0].slug;

  const manifest = readJson(DEFAULT_PROMPT_MANIFEST);
  if (!Array.isArray(manifest.prompts)) {
    throw new Error(`${DEFAULT_PROMPT_MANIFEST}: prompts must be an array`);
  }

  const seenSlugs = new Set();
  const seenKeys = new Set();
  const entries = [];
  for (const prompt of manifest.prompts) {
    if (typeof prompt?.slug !== 'string' || !prompt.slug) {
      throw new Error(`${DEFAULT_PROMPT_MANIFEST}: prompt slug must be a non-empty string`);
    }
    if (seenSlugs.has(prompt.slug)) throw new Error(`${DEFAULT_PROMPT_MANIFEST}: duplicate slug`);
    if (!knownSlugs.has(prompt.slug)) {
      throw new Error(`${DEFAULT_PROMPT_MANIFEST}: prompt names a pack not listed in scenario index`);
    }
    seenSlugs.add(prompt.slug);

    const key = packKey(prompt.slug);
    if (seenKeys.has(key)) throw new Error(`${DEFAULT_PROMPT_MANIFEST}: duplicate prompt key`);
    seenKeys.add(key);

    if (typeof prompt.measured_by === 'string' && prompt.measured_by) {
      const suite = readJson(join(REPO, prompt.measured_by));
      assertSlots(suite.slots, prompt.measured_by);
      entries.push({ key, slots: suite.slots });
    } else {
      assertSlots(prompt.frozen_slots, `${DEFAULT_PROMPT_MANIFEST}: frozen_slots`);
      entries.push({ key, slots: prompt.frozen_slots });
    }
  }

  if (!seenSlugs.has(fallbackSlug)) {
    throw new Error(`${DEFAULT_PROMPT_MANIFEST}: tutorial pack has no default prompt entry`);
  }

  return { entries, fallbackKey: packKey(fallbackSlug) };
}

function renderDefaultPrompts({ entries, fallbackKey }) {
  const body = entries
    .map(
      ({ key, slots }) => `  ${JSON.stringify(key)}: freeze({
    FLAW: ${JSON.stringify(slots.FLAW)},
    INCIDENT: ${JSON.stringify(slots.INCIDENT)},
    PRIORITY_LIST: ${JSON.stringify(slots.PRIORITY_LIST)},
  }),`,
    )
    .join('\n');
  return `/**
 * ⚠ GENERATED FILE — do not edit by hand.
 * Source: \`data/scenario/index.json\`, \`data/scenario/default-prompts.json\`,
 * and the slot sources declared there.
 * Regenerate with \`npm run prompts:bundle\`; \`--check\` fails on drift and runs
 * inside \`npm run check\`. Scenario pack names are fingerprinted before they
 * reach this module, so proxy source does not carry pack literals.
 */

export type DefaultPromptSlots = {
  FLAW: string;
  INCIDENT: string;
  PRIORITY_LIST: string[];
};

const freeze = (slots: {
  FLAW: string;
  INCIDENT: string;
  PRIORITY_LIST: string[];
}): DefaultPromptSlots =>
  Object.freeze({
    ...slots,
    PRIORITY_LIST: Object.freeze([...slots.PRIORITY_LIST]) as unknown as string[],
  }) as DefaultPromptSlots;

export const DEFAULT_PROMPTS_BY_KEY: Readonly<Record<string, DefaultPromptSlots>> =
  Object.freeze({
${body}
  });

export const FALLBACK_PROMPT_KEY = ${JSON.stringify(fallbackKey)};
`;
}

const outputs = [
  { file: PROMPT_BUNDLE_OUT, next: renderPromptBundle(collect()) },
  { file: DEFAULT_PROMPT_OUT, next: renderDefaultPrompts(collectDefaultPrompts()) },
];

if (check) {
  const stale = [];
  for (const { file, next } of outputs) {
    let current = '';
    try {
      current = readFileSync(file, 'utf8');
    } catch {
      /* missing counts as drift */
    }
    if (current !== next) stale.push(file);
  }
  if (stale.length) {
    console.error('✗ generated prompt sources are stale — regenerate: npm run prompts:bundle');
    for (const file of stale) console.error(`  ${file}`);
    process.exit(1);
  }
  console.log('✓ prompt bundle matches prompts/');
} else {
  for (const { file, next } of outputs) {
    writeFileSync(file, next);
    console.log(`✓ wrote ${file}`);
  }
}
