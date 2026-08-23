import { afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { META_KEY } from '../../src/client/shell/run-state.ts'
import {
  SELECTED_SCENARIO_KEY,
  resetScenarioSession,
  scenarioPackInPlay,
  switchScenarioPack,
} from '../../src/client/shell/pack-session.ts'
import type { ScenarioIndex } from '../../src/client/shell/pack.ts'
import { metaKey, stampKey } from '../../src/runloop/index.ts'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
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
    const chosen = MANIFEST.packs.find((pack) => pack.role !== 'tutorial')!
    storage.setItem(SELECTED_SCENARIO_KEY, chosen.slug)
    expect(scenarioPackInPlay(MANIFEST, { storage }).slug).toBe(chosen.slug)
  })

  it('(c) switching clears shell/run-loop state and asks the host to reload', () => {
    const storage = new FakeStorage()
    const chosen = MANIFEST.packs.find((pack) => pack.role !== 'tutorial')!
    let reloaded = false

    storage.setItem(META_KEY, JSON.stringify({ type: 'meta', run: 3 }))
    for (const pack of MANIFEST.packs) {
      storage.setItem(metaKey(pack.slug), JSON.stringify({ pack_slug: pack.slug, run_count: 2 }))
      storage.setItem(stampKey(pack.slug), 'old-build')
    }

    const entry = switchScenarioPack(MANIFEST, chosen.slug, {
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
    const chosen = MANIFEST.packs.find((pack) => pack.role !== 'tutorial')!
    const reload = vi.fn()
    vi.stubGlobal('location', { reload })

    switchScenarioPack(MANIFEST, chosen.slug, { storage: new FakeStorage() })

    expect(reload).toHaveBeenCalledOnce()
  })
})
