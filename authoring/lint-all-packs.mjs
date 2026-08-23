#!/usr/bin/env node
// Lints EVERY pack under `data/scenario/`, and exists because the alternative
// rots. `check` used to name one slug, so the day a second pack landed it had
// no gate at all: its predicates could name a flag nothing sets and the suite
// would stay green. Naming the second slug too would only move that hole to
// the third pack — enumeration is what closes it for good.
//
// The `_`-prefix skip is the same rule `vite.config.ts` `packSlugs()` applies,
// and for the same reason: `_schema/` is the contract, not a pack.
//
// `readdirSync` rather than a shell glob is deliberate. Pack directories carry
// Korean names, and macOS hands them back NFD where git and the shell disagree
// about normalization — `tests/fixtures/fixture-utils.ts` normalizes for that
// reason. Reading the directory and passing the entry straight through never
// makes a round trip that could re-normalize the name.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const SCENARIO_DIR = join(process.cwd(), 'data', 'scenario')
const LINTER = join('authoring', 'lint-datapack.mjs')
const MANIFEST = join(SCENARIO_DIR, 'index.json')
const MANIFEST_SCHEMA = join(SCENARIO_DIR, '_schema', 'index.schema.json')
const DEFAULT_PROMPTS = join(SCENARIO_DIR, 'default-prompts.json')
const DEFAULT_PROMPTS_SCHEMA = join(SCENARIO_DIR, '_schema', 'default-prompts.schema.json')

const errors = []

const KNOWN_KEYWORDS = new Set([
  '$schema', '$id', '$ref', '$defs', 'title', 'description',
  'type', 'enum', 'pattern', 'minLength', 'minimum', 'maximum',
  'minItems', 'maxItems', 'items', 'required', 'properties',
  'additionalProperties', 'anyOf',
])
const PLAYABLE_ROLES = new Set(['tutorial', 'practice'])

function validate(schema, data, path, root) {
  for (const k of Object.keys(schema)) {
    if (!KNOWN_KEYWORDS.has(k)) {
      errors.push(`${path}: schema keyword "${k}" is not implemented by this validator — the rule it states was NOT checked`)
    }
  }
  if (schema.$ref) {
    const ref = schema.$ref.replace('#/$defs/', '')
    return validate(root.$defs[ref], data, path, root)
  }
  if (schema.anyOf) {
    const saved = errors.length
    for (const branch of schema.anyOf) {
      validate(branch, data, path, root)
      if (errors.length === saved) return
      errors.length = saved
    }
    errors.push(`${path}: matches no anyOf branch`)
    return
  }
  const types = Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : null
  if (types) {
    const t = data === null ? 'null'
      : Array.isArray(data) ? 'array'
      : Number.isInteger(data) ? 'integer'
      : typeof data
    const ok = types.some((want) =>
      want === t || (want === 'number' && t === 'integer') || (want === 'integer' && t === 'integer'))
    if (!ok) {
      errors.push(`${path}: expected ${types.join('|')}, got ${t}`)
      return
    }
  }
  if (schema.enum && !schema.enum.includes(data)) {
    errors.push(`${path}: ${JSON.stringify(data)} not in enum [${schema.enum.join(', ')}]`)
  }
  if (typeof data === 'number') {
    if (schema.minimum != null && data < schema.minimum) errors.push(`${path}: ${data} < minimum ${schema.minimum}`)
    if (schema.maximum != null && data > schema.maximum) errors.push(`${path}: ${data} > maximum ${schema.maximum}`)
  }
  if (typeof data === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern).test(data)) errors.push(`${path}: fails pattern ${schema.pattern}`)
    if (schema.minLength != null && data.length < schema.minLength) errors.push(`${path}: shorter than minLength ${schema.minLength}`)
  }
  if (Array.isArray(data)) {
    if (schema.minItems != null && data.length < schema.minItems) errors.push(`${path}: ${data.length} items < minItems ${schema.minItems}`)
    if (schema.maxItems != null && data.length > schema.maxItems) errors.push(`${path}: ${data.length} items > maxItems ${schema.maxItems}`)
    if (schema.items) data.forEach((v, i) => validate(schema.items, v, `${path}[${i}]`, root))
  }
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    for (const req of schema.required ?? []) {
      if (!(req in data)) errors.push(`${path}: missing required field "${req}"`)
    }
    for (const [k, v] of Object.entries(data)) {
      if (schema.properties && k in schema.properties) validate(schema.properties[k], v, `${path}.${k}`, root)
      else if (schema.additionalProperties === false) errors.push(`${path}: unknown field "${k}"`)
      else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
        validate(schema.additionalProperties, v, `${path}.${k}`, root)
      }
    }
  }
}

const slugs = readdirSync(SCENARIO_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
  .map((entry) => entry.name)
  .sort()

let manifest = null
try {
  manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
  const schema = JSON.parse(readFileSync(MANIFEST_SCHEMA, 'utf8'))
  validate(schema, manifest, 'index', schema)
} catch (cause) {
  errors.push(`index.json: cannot read/parse — ${cause.message}`)
}

let defaultPrompts = null
try {
  defaultPrompts = JSON.parse(readFileSync(DEFAULT_PROMPTS, 'utf8'))
  const schema = JSON.parse(readFileSync(DEFAULT_PROMPTS_SCHEMA, 'utf8'))
  validate(schema, defaultPrompts, 'default-prompts', schema)
} catch (cause) {
  errors.push(`default-prompts.json: cannot read/parse — ${cause.message}`)
}

// An empty `data/scenario/` means the enumeration silently linted nothing,
// which is the failure this script was written to prevent — so it is an error.
if (!slugs.length) {
  console.error(`✗ no packs under ${SCENARIO_DIR} — nothing was linted`)
  process.exit(1)
}

if (manifest !== null && typeof manifest === 'object' && Array.isArray(manifest.packs)) {
  const listed = manifest.packs.map((pack) => pack?.slug).filter((slug) => typeof slug === 'string')
  const seen = new Set()
  for (const slug of listed) {
    if (seen.has(slug)) errors.push(`index.packs: duplicate slug "${slug}"`)
    seen.add(slug)
  }
  const listedSet = new Set(listed)
  for (const slug of slugs) {
    if (!listedSet.has(slug)) errors.push(`index.packs: missing pack directory "${slug}"`)
  }
  for (const slug of listed) {
    if (!slugs.includes(slug)) errors.push(`index.packs: slug "${slug}" has no pack directory`)
  }
  const tutorials = manifest.packs.filter((pack) => pack?.role === 'tutorial')
  if (tutorials.length !== 1) errors.push(`index.packs: expected exactly one tutorial pack, found ${tutorials.length}`)
  const orders = new Set()
  for (const pack of manifest.packs) {
    if (typeof pack?.order !== 'number') continue
    if (orders.has(pack.order)) errors.push(`index.packs: duplicate order ${pack.order}`)
    orders.add(pack.order)
  }
  for (const pack of manifest.packs) {
    if (!PLAYABLE_ROLES.has(pack?.role)) continue
    if (typeof pack?.slug !== 'string') continue
    if (!existsSync(join(SCENARIO_DIR, pack.slug, 'endings.json'))) {
      errors.push(`index.packs: playable pack "${pack.slug}" (${pack.role}) has no endings.json`)
    }
  }
}

if (defaultPrompts !== null && typeof defaultPrompts === 'object' && Array.isArray(defaultPrompts.prompts)) {
  const listedSet = new Set(
    manifest !== null && typeof manifest === 'object' && Array.isArray(manifest.packs)
      ? manifest.packs.map((pack) => pack?.slug).filter((slug) => typeof slug === 'string')
      : [],
  )
  const seen = new Set()
  for (const prompt of defaultPrompts.prompts) {
    if (typeof prompt?.slug !== 'string') continue
    if (seen.has(prompt.slug)) errors.push(`default-prompts.prompts: duplicate slug "${prompt.slug}"`)
    seen.add(prompt.slug)
    if (listedSet.size && !listedSet.has(prompt.slug)) {
      errors.push(`default-prompts.prompts: slug "${prompt.slug}" is not listed in index.packs`)
    }
  }
}

if (errors.length) {
  console.error('\n── scenario manifests ───────────────────────────────────────────')
  for (const error of errors) console.error(`✗ ${error}`)
  process.exit(1)
}

const failed = []
for (const slug of slugs) {
  console.log(`\n── ${slug} ${'─'.repeat(Math.max(0, 60 - slug.length))}`)
  const result = spawnSync(
    process.execPath,
    ['--experimental-strip-types', LINTER, join('data', 'scenario', slug)],
    { stdio: 'inherit' },
  )
  if (result.status !== 0) failed.push(slug)
}

console.log(`\n${'═'.repeat(64)}`)
if (failed.length) {
  console.error(`✗ ${failed.length} of ${slugs.length} pack(s) not consumable: ${failed.join(', ')}`)
  process.exit(1)
}
console.log(`✓ ${slugs.length} pack(s) consumable: ${slugs.join(' · ')}`)
