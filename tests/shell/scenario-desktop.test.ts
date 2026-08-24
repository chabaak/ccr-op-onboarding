import { describe, expect, it, vi } from 'vitest'

import { META_KEY } from '../../src/client/shell/run-state.ts'
import {
  SCENARIO_PICKER_NOTE,
  SCENARIO_UNLOCK_NOTICE,
  SCENARIO_ENDING_LOAD_FAILURE_NOTICE,
  SCENARIO_UNPLAYABLE_NOTICE,
  UNLOCKED_SCENARIOS_KEY,
  incidentBriefCopy,
  readUnlockedScenarioSlugs,
  restartScenario,
  scenarioCardModel,
  scenarioStartCheck,
  unlockAllScenarioFiles,
} from '../../src/client/shell/scenario-desktop.ts'
import type {
  ScenarioEndings,
  ScenarioIncidentBrief,
  ScenarioIndex,
  ScenarioPackEntry,
  ScenarioScore,
} from '../../src/client/shell/pack.ts'
import { sortedScenarioPacks } from '../../src/client/shell/pack.ts'
import { metaKey, stampKey } from '../../src/runloop/index.ts'
import { DEFAULT_TOTAL_RUNS } from '../../src/runloop/run-loop.ts'

const MANIFEST: ScenarioIndex = {
  packs: [
    { slug: 'tutorial-pack', displayName: 'Tutorial Pack', role: 'tutorial', order: 0, difficulty: 'tutorial' },
    { slug: 'practice-a', displayName: 'Practice A', role: 'practice', order: 10, difficulty: 'standard' },
    { slug: 'fixture-pack', displayName: 'Fixture Pack', role: 'fixture', order: 20, difficulty: 'fixture' },
  ],
}
const ENDINGS: ScenarioEndings = {
  siteOccupants: 1,
  scoredOutsideSite: [],
  copy: {
    good: [{ head: 'good', lead: 'lead', body: ['body'] }],
    bad: [{ head: 'bad', lead: 'lead', body: ['body'] }],
  },
}
const SCORE: ScenarioScore = { units: [] }

const packEntry = (role: ScenarioPackEntry['role']): ScenarioPackEntry => ({
  slug: `${role}-pack`,
  displayName: `${role} pack`,
  role,
  order: 1,
  difficulty: 'test',
})

class FakeStorage {
  readonly held = new Map<string, string>()

  getItem(key: string): string | null {
    return this.held.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.held.set(key, value)
  }

  removeItem(key: string): void {
    this.held.delete(key)
  }

  keys(): string[] {
    return [...this.held.keys()].sort()
  }
}

describe('scenario desktop replay files', () => {
  it('(a) the unlock notice is portal copy owned by source', () => {
    expect(SCENARIO_UNLOCK_NOTICE).toBe('다른 사건도 해결해보십시오.')
  })

  it('(b) unlocked scenario files come from the manifest, ordered and filtered', () => {
    const storage = new FakeStorage()
    const sorted = sortedScenarioPacks(MANIFEST)
    storage.setItem(
      UNLOCKED_SCENARIOS_KEY,
      JSON.stringify([sorted[2]!.slug, 'missing-pack', sorted[0]!.slug, sorted[2]!.slug]),
    )

    expect(readUnlockedScenarioSlugs(MANIFEST, storage)).toEqual([
      sorted[0]!.slug,
      sorted[2]!.slug,
    ])
  })

  it('(c) a malformed unlock list fails closed instead of showing no-name files', () => {
    const storage = new FakeStorage()
    storage.setItem(UNLOCKED_SCENARIOS_KEY, '{')

    expect(readUnlockedScenarioSlugs(MANIFEST, storage)).toEqual([])
  })

  it('(d) a good ending unlocks every completed scenario as replayable', () => {
    const storage = new FakeStorage()
    const expected = sortedScenarioPacks(MANIFEST).map((pack) => pack.slug)

    expect(unlockAllScenarioFiles(MANIFEST, storage)).toEqual(expected)
    expect(JSON.parse(storage.getItem(UNLOCKED_SCENARIOS_KEY) ?? 'null')).toEqual(expected)
  })

  it('(e) the case brief uses pack prose only for the case-specific lines', () => {
    const entry = sortedScenarioPacks(MANIFEST)[0]!
    const brief: ScenarioIncidentBrief = {
      lead: '사건 장소와 출발 상황.',
      body: ['첫 번째 팩 전용 문장.', '두 번째 팩 전용 문장.'],
    }

    expect(incidentBriefCopy(entry, brief)).toEqual({
      head: entry.displayName,
      meta: '사건 개요',
      body: brief.lead,
      note: brief.body.join('\n'),
      yes: '열기',
      no: '취소',
    })
  })

  it('(f) picker cards carry only assignment metadata before deployment', () => {
    const entry = sortedScenarioPacks(MANIFEST)[0]!
    const model = scenarioCardModel(entry, 0, true)

    expect(Object.keys(model)).toEqual(['code', 'difficulty', 'runs', 'status', 'enabled'])
    expect(model).toEqual({
      code: 'ERR-2/SC-01',
      difficulty: '등급 TUTORIAL',
      runs: `RUN 01 / ${String(DEFAULT_TOTAL_RUNS).padStart(2, '0')}`,
      status: '배치 가능',
      enabled: true,
    })
    expect(Object.values(model).join(' ')).not.toContain(entry.displayName)
    expect(SCENARIO_PICKER_NOTE).toContain('사건 개요는 배치 후 회선에서만 열람')
  })

  it('(g) locked picker cards expose status without becoming playable', () => {
    const entry = sortedScenarioPacks(MANIFEST)[1]!

    expect(scenarioCardModel(entry, 1, false)).toEqual({
      code: 'ERR-2/SC-02',
      difficulty: '등급 STANDARD',
      runs: `RUN 01 / ${String(DEFAULT_TOTAL_RUNS).padStart(2, '0')}`,
      status: '미개방',
      enabled: false,
    })
  })

  it('(h) fixture picker cards stay visible as read-only material when unlocked', () => {
    const entry = sortedScenarioPacks(MANIFEST)[2]!

    expect(scenarioCardModel(entry, 2, true)).toEqual({
      code: 'ERR-2/SC-03',
      difficulty: '등급 FIXTURE',
      runs: `RUN 01 / ${String(DEFAULT_TOTAL_RUNS).padStart(2, '0')}`,
      status: '열람 전용',
      enabled: false,
    })
  })

  it('(i) a bad ending restart reuses the shared session reset and reloads', () => {
    const storage = new FakeStorage()
    let reloaded = false

    storage.setItem(META_KEY, 'stale')
    for (const pack of MANIFEST.packs) {
      storage.setItem(metaKey(pack.slug), 'stale')
      storage.setItem(stampKey(pack.slug), 'stale')
    }

    restartScenario(MANIFEST, {
      storage,
      reload: () => {
        reloaded = true
      },
    })

    expect(storage.keys()).toEqual([])
    expect(reloaded).toBe(true)
  })

  it('(j) a playable pack must prove its ending sidecars before selection can continue', async () => {
    await expect(
      scenarioStartCheck(packEntry('practice'), {
        fetchEndings: async () => ENDINGS,
        fetchScore: async () => SCORE,
      }),
    ).resolves.toEqual({ ok: true })
  })

  it('(k) a missing ending sidecar becomes operator-facing copy before the run starts', async () => {
    await expect(
      scenarioStartCheck(packEntry('practice'), {
        fetchEndings: async () => {
          throw new Error('missing')
        },
        fetchScore: async () => SCORE,
      }),
    ).resolves.toEqual({ ok: false, says: SCENARIO_ENDING_LOAD_FAILURE_NOTICE })
  })

  it('(l) fixture packs are visible archive files, not startable runs', async () => {
    const fetchEndings = vi.fn(async () => ENDINGS)
    const fetchScore = vi.fn(async () => SCORE)

    await expect(
      scenarioStartCheck(packEntry('fixture'), {
        fetchEndings,
        fetchScore,
      }),
    ).resolves.toEqual({ ok: false, says: SCENARIO_UNPLAYABLE_NOTICE })
    expect(fetchEndings).not.toHaveBeenCalled()
    expect(fetchScore).not.toHaveBeenCalled()
  })
})
