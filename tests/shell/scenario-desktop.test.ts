import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import { META_KEY } from '../../src/client/shell/run-state.ts'
import {
  SCENARIO_UNLOCK_NOTICE,
  UNLOCKED_SCENARIOS_KEY,
  incidentBriefCopy,
  readUnlockedScenarioSlugs,
  restartScenario,
  unlockAllScenarioFiles,
} from '../../src/client/shell/scenario-desktop.ts'
import type { ScenarioIncidentBrief, ScenarioIndex } from '../../src/client/shell/pack.ts'
import { sortedScenarioPacks } from '../../src/client/shell/pack.ts'
import { metaKey, stampKey } from '../../src/runloop/index.ts'

const REPO = path.resolve(import.meta.dirname, '../..')
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(REPO, 'data/scenario/index.json'), 'utf8'),
) as ScenarioIndex

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

  it('(f) a bad ending restart reuses the shared session reset and reloads', () => {
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
})
