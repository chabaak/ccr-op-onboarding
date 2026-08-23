// The deployed agent is the measured agent — asserted, not assumed.
//
// `FLAW` · `INCIDENT` · `PRIORITY_LIST` are the proxy's and refused from the
// client. They are generated from data and measured suites, which gives the
// pair of ways this can silently go wrong, and this file closes both:
//
//   1. the shipped pack has no entry, so it plays with the incumbent's agent —
//      the proxy falls back on purpose (availability beats a dead Call 1), and
//      the fallback is only safe if it is the declared tutorial prompt;
//   2. an entry exists but has drifted from the suite that measured it, so the
//      probe numbers describe a prompt nobody sends any more.
//
// Reading the suite JSON as the expected value is the point of (2) for live
// suites. A retired evidence file is represented by frozen slots in the
// cross-pack manifest instead of by a dangling path.
//
// This reads across the tier boundary, which is allowed in this direction:
// physical §3.3 bars `proxy/**` from importing `src/**`, and says nothing about
// a root test reading the proxy — `tests/shared/temperament.test.ts` already
// reads `proxy/prompts/*.md` for the same reason. `default-prompt.ts` imports
// nothing, so nothing of the proxy's runtime comes with it.
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_PROMPT,
  DEFAULT_PROMPTS_BY_KEY,
  FALLBACK_PROMPT_KEY,
  defaultPromptFor,
  defaultPromptKeyFor,
} from '../../proxy/src/default-prompt.ts'
import type { ScenarioIndex } from '../../src/shared/datapack.ts'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const readJson = (rel: string): unknown => JSON.parse(fs.readFileSync(path.join(REPO, rel), 'utf8'))
const MANIFEST = readJson('data/scenario/index.json') as ScenarioIndex
const TUTORIAL = MANIFEST.packs.find((pack) => pack.role === 'tutorial')!

type Suite = { slots: { FLAW: string; INCIDENT: string; PRIORITY_LIST: string[] } }
type DefaultPromptEntry = {
  slug: string
  measured_by?: string
  frozen_slots?: Suite['slots']
}
type DefaultPromptManifest = { prompts: DefaultPromptEntry[] }

const DEFAULT_PROMPT_MANIFEST = readJson('data/scenario/default-prompts.json') as DefaultPromptManifest
const DEFAULT_PROMPT_SLUGS = DEFAULT_PROMPT_MANIFEST.prompts.map((entry) => entry.slug)

describe('the proxy default prompt covers the shipped pack', () => {
  it('(a) the tutorial pack has its own generated entry and is the fallback', () => {
    expect(DEFAULT_PROMPT_SLUGS).toContain(TUTORIAL.slug)
    expect(FALLBACK_PROMPT_KEY).toBe(defaultPromptKeyFor(TUTORIAL.slug))
    expect(defaultPromptFor(TUTORIAL.slug)).toBe(DEFAULT_PROMPT)
  })

  it('(b) every manifest entry names a pack that exists on disk', () => {
    for (const slug of DEFAULT_PROMPT_SLUGS) {
      const dir = path.join(REPO, 'data', 'scenario', slug)
      expect(fs.existsSync(dir), `default prompt keyed to "${slug}", which is not a pack`).toBe(true)
    }
  })

  it('(c) the fallback is itself a real generated entry', () => {
    expect(Object.keys(DEFAULT_PROMPTS_BY_KEY)).toContain(FALLBACK_PROMPT_KEY)
    expect(defaultPromptFor(undefined)).toBe(DEFAULT_PROMPT)
    expect(defaultPromptFor('a-pack-that-was-never-authored')).toBe(DEFAULT_PROMPT)
  })

  it('(d) every generated entry matches its measured or frozen source, slot for slot', () => {
    const expectedKeys = DEFAULT_PROMPT_SLUGS.map(defaultPromptKeyFor).sort()
    expect(Object.keys(DEFAULT_PROMPTS_BY_KEY).sort()).toEqual(expectedKeys)
    for (const { slug, measured_by: suitePath, frozen_slots: frozenSlots } of DEFAULT_PROMPT_MANIFEST.prompts) {
      const entry = DEFAULT_PROMPTS_BY_KEY[defaultPromptKeyFor(slug)]
      if (!entry) throw new Error(`"${slug}" has no generated default prompt`)
      const expected = suitePath ? (readJson(suitePath) as Suite).slots : frozenSlots
      const source = suitePath ?? 'frozen manifest slots'
      expect(expected, `"${slug}" ships an agent with no measured or frozen source`).toBeDefined()
      expect(entry.FLAW, `${slug} FLAW drifted from ${source}`).toBe(expected!.FLAW)
      expect(entry.INCIDENT, `${slug} INCIDENT drifted from ${source}`).toBe(expected!.INCIDENT)
      expect(entry.PRIORITY_LIST, `${slug} PRIORITY_LIST drifted from ${source}`).toEqual(
        expected!.PRIORITY_LIST,
      )
    }
  })

  it('(e) the tutorial measurement suites agree — the entry stands for all three gates, not one', () => {
    const suites = ['DOME-G1-baseline', 'DOME-G2', 'DOME-G3'].map(
      (name) => readJson(`tools/probe/dday-mechanism/suites/${name}.json`) as Suite,
    )
    for (const suite of suites) {
      expect(suite.slots.FLAW).toBe(suites[0]!.slots.FLAW)
      expect(suite.slots.INCIDENT).toBe(suites[0]!.slots.INCIDENT)
      expect(suite.slots.PRIORITY_LIST).toEqual(suites[0]!.slots.PRIORITY_LIST)
    }
  })

  it('(f) the default-prompt proxy sources do not carry literal pack names', () => {
    const files = ['proxy/src/default-prompt.ts', 'proxy/src/default-prompt.generated.ts']
    for (const file of files) {
      const text = fs.readFileSync(path.join(REPO, file), 'utf8')
      for (const slug of MANIFEST.packs.map((pack) => pack.slug)) {
        expect(text, `${file} contains scenario slug ${slug}`).not.toContain(slug)
      }
    }
  })
})

describe('the shipped pack renders the temperament it was measured with', () => {
  // Word for word, not byte for byte: the fixture is soft-wrapped at ~40
  // columns because it is a `.md` file someone reads, and the pack's
  // `default_disposition` is one JSON string. Collapsing whitespace is the
  // whole of the licence taken here — a changed word, a dropped clause, or a
  // switch back to third person all still fail.
  const collapse = (s: string): string => s.replace(/\s+/g, ' ').trim()

  it('(g) the tutorial pack renders to `dome-base.md`, whitespace aside', async () => {
    const { renderTemperament } = await import('../../src/shared/temperament.ts')
    const pack = readJson('data/scenario/멈춘회전문/temperament.json') as Parameters<
      typeof renderTemperament
    >[0]
    const fixture = fs.readFileSync(
      path.join(REPO, 'tests/fixtures/probe/temperament/dome-base.md'),
      'utf8',
    )
    expect(collapse(renderTemperament(pack))).toBe(collapse(fixture))
  })
})
