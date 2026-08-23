// Scenario files on the desk after certification.
//
// This is not a select screen. The first sitting still boots the manifest's
// tutorial pack; a GOOD ending unlocks file icons on the same desktop the
// windows used to cover. Opening one asks for confirmation with pack-authored
// incident brief text, then switches pack through the one session reset helper.

import { button, el } from './dom.ts'
import { createCoach } from './coach.ts'
import { openConfirm } from './confirm.ts'
import {
  fetchScenarioIncidentBrief,
  sortedScenarioPacks,
} from './pack.ts'
import type { ScenarioIncidentBrief, ScenarioIndex, ScenarioPackEntry } from './pack.ts'
import { resetScenarioSession, switchScenarioPack } from './pack-session.ts'
import type { ScenarioSwitchOptions } from './pack-session.ts'
import type { ConfirmCopy } from './confirm.ts'

export const UNLOCKED_SCENARIOS_KEY = 'ndsp:scenario:unlocked:v1'
export const SCENARIO_UNLOCK_NOTICE = '다른 사건도 해결해보십시오.'

interface StoragePort {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface ScenarioDesktopOptions extends ScenarioSwitchOptions {
  localStorage?: StoragePort | null
}

export interface ScenarioDesktopDeps {
  app: HTMLElement
  desktop: HTMLElement
  index: ScenarioIndex
  localStorage?: StoragePort | null
  sessionStorage?: ScenarioSwitchOptions['storage']
  reload?: () => void
}

export interface ScenarioDesktopHandle {
  unlockAll(): readonly string[]
  showUnlockNotice(): Promise<void>
  restartCurrent(): void
  render(): void
}

function storageOf(port: StoragePort | null | undefined): StoragePort | null {
  if (port !== undefined) return port
  try {
    const holder = globalThis as { localStorage?: StoragePort }
    return holder.localStorage ?? null
  } catch {
    return null
  }
}

function knownSlugs(index: ScenarioIndex): Set<string> {
  return new Set(index.packs.map((pack) => pack.slug))
}

export function readUnlockedScenarioSlugs(
  index: ScenarioIndex,
  storage: StoragePort | null | undefined,
): readonly string[] {
  const port = storageOf(storage)
  if (port === null) return []
  const raw = port.getItem(UNLOCKED_SCENARIOS_KEY)
  if (raw === null) return []
  try {
    const value = JSON.parse(raw)
    if (!Array.isArray(value)) return []
    const known = knownSlugs(index)
    const unlocked = new Set<string>()
    for (const item of value) {
      if (typeof item === 'string' && known.has(item)) unlocked.add(item)
    }
    return sortedScenarioPacks(index)
      .map((pack) => pack.slug)
      .filter((slug) => unlocked.has(slug))
  } catch {
    return []
  }
}

export function unlockAllScenarioFiles(
  index: ScenarioIndex,
  storage: StoragePort | null | undefined,
): readonly string[] {
  const slugs = sortedScenarioPacks(index).map((pack) => pack.slug)
  const port = storageOf(storage)
  port?.setItem(UNLOCKED_SCENARIOS_KEY, JSON.stringify(slugs))
  return slugs
}

export function incidentBriefCopy(
  entry: ScenarioPackEntry,
  brief: ScenarioIncidentBrief,
): ConfirmCopy {
  return {
    head: entry.displayName,
    meta: '사건 개요',
    body: brief.lead,
    note: brief.body.join('\n'),
    yes: '열기',
    no: '취소',
  }
}

export function restartScenario(
  index: ScenarioIndex,
  options: ScenarioSwitchOptions = {},
): void {
  resetScenarioSession(index, { storage: options.storage })
  if (options.reload === undefined) {
    const holder = globalThis as { location?: { reload?: () => void } }
    holder.location?.reload?.()
    return
  }
  options.reload()
}

export function installScenarioDesktop(deps: ScenarioDesktopDeps): ScenarioDesktopHandle {
  const localStorage = storageOf(deps.localStorage)
  const sessionStorage = deps.sessionStorage
  const packs = sortedScenarioPacks(deps.index)
  const bySlug = new Map(packs.map((pack) => [pack.slug, pack]))
  const files = new Map<string, HTMLButtonElement>()

  function place(node: HTMLElement, index: number): void {
    const column = index % 2
    const row = Math.floor(index / 2)
    node.style.setProperty('--file-x', `${32 + column * 150}px`)
    node.style.setProperty('--file-y', `${156 + row * 122}px`)
  }

  function openFile(entry: ScenarioPackEntry, node: HTMLButtonElement): void {
    node.disabled = true
    void (async () => {
      try {
        const brief = await fetchScenarioIncidentBrief(entry.slug)
        const confirmed = await openConfirm(deps.app, incidentBriefCopy(entry, brief))
        if (confirmed) {
          switchScenarioPack(deps.index, entry.slug, {
            storage: sessionStorage,
            reload: deps.reload,
          })
          return
        }
      } finally {
        node.disabled = false
      }
    })()
  }

  function render(): void {
    const unlocked = new Set(readUnlockedScenarioSlugs(deps.index, localStorage))
    let visible = 0
    for (const pack of packs) {
      let node = files.get(pack.slug)
      if (!node) {
        node = button('scenario-file', `${pack.displayName} 사건 개요 열기`, '')
        node.dataset.scenarioSlug = pack.slug
        node.setAttribute('aria-label', `${pack.displayName} 사건 개요 열기`)
        node.append(
          el('span', 'scenario-file-icon', 'FILE'),
          el('b', undefined, pack.displayName),
          el('i', undefined, pack.difficulty),
        )
        node.addEventListener('click', () => openFile(pack, node!))
        files.set(pack.slug, node)
      }
      if (unlocked.has(pack.slug)) {
        place(node, visible)
        if (!node.isConnected) deps.desktop.append(node)
        visible += 1
      } else {
        node.remove()
      }
    }
    for (const [slug, node] of files) {
      if (!bySlug.has(slug)) {
        node.remove()
        files.delete(slug)
      }
    }
  }

  render()

  return {
    unlockAll(): readonly string[] {
      const slugs = unlockAllScenarioFiles(deps.index, localStorage)
      render()
      return slugs
    },
    async showUnlockNotice(): Promise<void> {
      const coach = createCoach(deps.app)
      try {
        await coach.show({
          target: '#desktop',
          says: SCENARIO_UNLOCK_NOTICE,
          side: 'above',
        })
      } finally {
        coach.destroy()
      }
    },
    restartCurrent(): void {
      restartScenario(deps.index, {
        storage: sessionStorage,
        reload: deps.reload,
      })
    },
    render,
  }
}
