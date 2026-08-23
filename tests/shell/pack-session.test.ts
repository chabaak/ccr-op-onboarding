import { afterEach, describe, expect, it, vi } from 'vitest'

import { META_KEY } from '../../src/client/shell/run-state.ts'
import {
  SCENARIO_DESKTOP_RETURN_KEY,
  SELECTED_SCENARIO_KEY,
  consumeScenarioDesktopReturn,
  resetScenarioSession,
  returnToScenarioDesktop,
  scenarioPackInPlay,
  switchScenarioPack,
} from '../../src/client/shell/pack-session.ts'
import type { ScenarioIndex, ScenarioPackEntry } from '../../src/client/shell/pack.ts'
import { metaKey, stampKey } from '../../src/runloop/index.ts'

const MANIFEST: ScenarioIndex = {
  packs: [
    { slug: 'tutorial-pack', displayName: 'Tutorial Pack', role: 'tutorial', order: 0, difficulty: 'tutorial' },
    { slug: 'practice-pack', displayName: 'Practice Pack', role: 'practice', order: 10, difficulty: 'standard' },
    { slug: 'fixture-pack', displayName: 'Fixture Pack', role: 'fixture', order: 20, difficulty: 'fixture' },
  ],
}
const PLAYABLE_MANIFEST: ScenarioIndex = {
  packs: MANIFEST.packs.filter((pack): pack is ScenarioPackEntry => pack.role !== 'fixture'),
}

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

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('runtime scenario pack selection', () => {
  it('(a) no session choice means the manifest tutorial pack is in play', () => {
    const tutorial = MANIFEST.packs.find((pack) => pack.role === 'tutorial')!
    expect(scenarioPackInPlay(MANIFEST, { storage: new FakeStorage() }).slug).toBe(tutorial.slug)
  })

  it('(b) a valid session choice selects that pack without a source edit', () => {
    const storage = new FakeStorage()
    const chosen = PLAYABLE_MANIFEST.packs.find((pack) => pack.role === 'practice')!
    storage.setItem(SELECTED_SCENARIO_KEY, chosen.slug)
    expect(scenarioPackInPlay(PLAYABLE_MANIFEST, { storage }).slug).toBe(chosen.slug)
  })

  it('(c) switching clears shell/run-loop state and asks the host to reload', () => {
    const storage = new FakeStorage()
    const chosen = PLAYABLE_MANIFEST.packs.find((pack) => pack.role === 'practice')!
    let reloaded = false

    storage.setItem(META_KEY, JSON.stringify({ type: 'meta', run: 3 }))
    for (const pack of PLAYABLE_MANIFEST.packs) {
      storage.setItem(metaKey(pack.slug), JSON.stringify({ pack_slug: pack.slug, run_count: 2 }))
      storage.setItem(stampKey(pack.slug), 'old-build')
    }

    const entry = switchScenarioPack(PLAYABLE_MANIFEST, chosen.slug, {
      storage,
      reload: () => {
        reloaded = true
      },
    })

    expect(entry.slug).toBe(chosen.slug)
    expect(reloaded).toBe(true)
    expect(storage.getItem(SELECTED_SCENARIO_KEY)).toBe(chosen.slug)
    expect(storage.keys()).toEqual([SELECTED_SCENARIO_KEY])
  })

  it('(d) the reset itself is reusable without selecting a new pack', () => {
    const storage = new FakeStorage()
    storage.setItem(META_KEY, 'stale')
    for (const pack of MANIFEST.packs) storage.setItem(metaKey(pack.slug), 'stale')

    resetScenarioSession(MANIFEST, { storage })

    expect(storage.keys()).toEqual([])
  })

  it('(e) switching reloads the page by default', () => {
    const chosen = PLAYABLE_MANIFEST.packs.find((pack) => pack.role === 'practice')!
    const reload = vi.fn()
    vi.stubGlobal('location', { reload })

    switchScenarioPack(PLAYABLE_MANIFEST, chosen.slug, { storage: new FakeStorage() })

    expect(reload).toHaveBeenCalledOnce()
  })

  it('(f) a persisted fixture choice falls back to the playable tutorial pack', () => {
    const storage = new FakeStorage()
    const fixture = MANIFEST.packs.find((pack) => pack.role === 'fixture')!
    const tutorial = MANIFEST.packs.find((pack) => pack.role === 'tutorial')!

    storage.setItem(SELECTED_SCENARIO_KEY, fixture.slug)

    expect(scenarioPackInPlay(MANIFEST, { storage }).slug).toBe(tutorial.slug)
  })

  it('(g) switching refuses fixture packs before they can boot without endings', () => {
    const fixture = MANIFEST.packs.find((pack) => pack.role === 'fixture')!

    expect(() => switchScenarioPack(MANIFEST, fixture.slug, { storage: new FakeStorage() })).toThrow(
      /not playable/,
    )
  })

  it('(h) abort return clears the selected pack through the shared reset and marks one desktop reload', () => {
    const storage = new FakeStorage()
    let reloaded = false
    const chosen = PLAYABLE_MANIFEST.packs.find((pack) => pack.role === 'practice')!

    storage.setItem(SELECTED_SCENARIO_KEY, chosen.slug)
    storage.setItem(META_KEY, JSON.stringify({ type: 'meta', run: 3 }))
    for (const pack of PLAYABLE_MANIFEST.packs) {
      storage.setItem(metaKey(pack.slug), JSON.stringify({ pack_slug: pack.slug, run_count: 2 }))
      storage.setItem(stampKey(pack.slug), 'old-build')
    }

    returnToScenarioDesktop(PLAYABLE_MANIFEST, {
      storage,
      reload: () => {
        reloaded = true
      },
    })

    expect(reloaded).toBe(true)
    expect(storage.getItem(SELECTED_SCENARIO_KEY)).toBeNull()
    expect(storage.keys()).toEqual([SCENARIO_DESKTOP_RETURN_KEY])
    expect(consumeScenarioDesktopReturn({ storage })).toBe(true)
    expect(storage.keys()).toEqual([])
  })
})
