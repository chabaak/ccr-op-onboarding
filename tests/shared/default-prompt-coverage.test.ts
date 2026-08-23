// The deployed agent is the measured agent — asserted, not assumed.
//
// `FLAW` · `INCIDENT` · `PRIORITY_LIST` are the proxy's, refused from the
// client, and now keyed by datapack slug. That gives the pair of ways this can
// silently go wrong, and this file closes both:
//
//   1. the shipped pack has no entry, so it plays with the incumbent's agent —
//      the proxy falls back on purpose (availability beats a dead Call 1), and
//      the fallback is only safe if something fails at merge instead;
//   2. an entry exists but has drifted from the suite that measured it, so the
//      probe numbers describe a prompt nobody sends any more.
//
// Reading the suite JSON as the expected value is the point of (2) for live
// suites. The fallback pack keeps an inline frozen copy because the
// proof-of-concept suite that measured it has been retired.
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
import { DEFAULT_PROMPTS, defaultPromptFor, FALLBACK_PACK } from '../../proxy/src/default-prompt.ts'
import type { ScenarioIndex } from '../../src/shared/datapack.ts'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const readJson = (rel: string): unknown => JSON.parse(fs.readFileSync(path.join(REPO, rel), 'utf8'))
const MANIFEST = readJson('data/scenario/index.json') as ScenarioIndex
const TUTORIAL = MANIFEST.packs.find((pack) => pack.role === 'tutorial')!

type Suite = { slots: { FLAW: string; INCIDENT: string; PRIORITY_LIST: string[] } }

/**
 * Which suite measured which pack. One line per entry in `DEFAULT_PROMPTS`, and
 * the test below fails if an entry appears without one — an agent nobody
 * measured is exactly what this file exists to catch.
 */
const MEASURED_BY: Readonly<Record<string, string | null>> = {
  전구간정상: null,
  멈춘회전문: 'tools/probe/dday-mechanism/suites/DOME-G1-baseline.json',
}

const FROZEN_LEGACY_SLOTS: Readonly<Record<string, Suite['slots']>> = {
  전구간정상: {
    FLAW: "[결함] 너는 잘못된 정보에 속을 수 있다.",
    INCIDENT: "[내력] 삼 년 전 겨울, 네가 서둘러 내린 판단 하나가 아직 남아 있다.",
    PRIORITY_LIST: [
      "확인되지 않은 주장에 따라 잘못 움직일 위험을 먼저 줄인다.",
      "대응이 늦어져 피해가 커질 위험을 먼저 줄인다.",
      "판단을 마친 뒤 근거를 시간순으로 정리한다.",
      "외부에 공유하기 전 사건 시각을 명확히 남긴다.",
    ],
  },
}

describe('the proxy default prompt covers the shipped pack', () => {
  it('(a) the tutorial pack has its own entry — it never plays on the fallback', () => {
    expect(
      Object.keys(DEFAULT_PROMPTS),
      `the deploy ships "${TUTORIAL.slug}", which has no default prompt — it would play as ${FALLBACK_PACK}`,
    ).toContain(TUTORIAL.slug)
  })

  it('(b) every entry names a pack that exists on disk', () => {
    for (const slug of Object.keys(DEFAULT_PROMPTS)) {
      const dir = path.join(REPO, 'data', 'scenario', slug)
      expect(fs.existsSync(dir), `default prompt keyed to "${slug}", which is not a pack`).toBe(true)
    }
  })

  it('(c) the fallback is itself a real entry', () => {
    expect(Object.keys(DEFAULT_PROMPTS)).toContain(FALLBACK_PACK)
    expect(defaultPromptFor(undefined)).toBe(DEFAULT_PROMPTS[FALLBACK_PACK])
    expect(defaultPromptFor('a-pack-that-was-never-authored')).toBe(DEFAULT_PROMPTS[FALLBACK_PACK])
  })

  it('(d) every entry matches its measured or frozen source, slot for slot', () => {
    for (const [slug, entry] of Object.entries(DEFAULT_PROMPTS)) {
      const suitePath = MEASURED_BY[slug]
      const expected = suitePath
        ? (readJson(suitePath) as Suite).slots
        : FROZEN_LEGACY_SLOTS[slug]
      const source = suitePath ?? 'frozen legacy slots'
      expect(expected, `"${slug}" ships an agent with no measured or frozen source`).toBeDefined()
      expect(entry.FLAW, `${slug} FLAW drifted from ${source}`).toBe(expected!.FLAW)
      expect(entry.INCIDENT, `${slug} INCIDENT drifted from ${source}`).toBe(expected!.INCIDENT)
      expect(entry.PRIORITY_LIST, `${slug} PRIORITY_LIST drifted from ${source}`).toEqual(
        expected!.PRIORITY_LIST,
      )
    }
  })

  it('(e) 멈춘회전문 三 suites agree — the entry stands for all three gates, not one', () => {
    const suites = ['DOME-G1-baseline', 'DOME-G2', 'DOME-G3'].map(
      (name) => readJson(`tools/probe/dday-mechanism/suites/${name}.json`) as Suite,
    )
    for (const suite of suites) {
      expect(suite.slots.FLAW).toBe(suites[0]!.slots.FLAW)
      expect(suite.slots.INCIDENT).toBe(suites[0]!.slots.INCIDENT)
      expect(suite.slots.PRIORITY_LIST).toEqual(suites[0]!.slots.PRIORITY_LIST)
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

  it('(f) 멈춘회전문 renders to `dome-base.md`, whitespace aside', async () => {
    const { renderTemperament } = await import('../../src/shared/temperament.ts')
    const pack = readJson('data/scenario/멈춘회전문/temperament.json') as Parameters<
      typeof renderTemperament
    >[0]
    const fixture = fs.readFileSync(
      path.join(REPO, 'tools/probe/fixtures/temperament/dome-base.md'),
      'utf8',
    )
    expect(collapse(renderTemperament(pack))).toBe(collapse(fixture))
  })
})
