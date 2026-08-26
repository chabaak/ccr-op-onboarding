// Scenario files on the desk after certification.
//
// This is not a select screen. The first sitting still boots the manifest's
// tutorial pack; a GOOD ending unlocks file icons on the same desktop the
// windows used to cover. Opening one asks for confirmation with pack-authored
// incident brief text, then switches pack through the one session reset helper.

import { button, el } from './dom.ts'
import { createCoach } from './coach.ts'
import { openConfirm } from './confirm.ts'
import { PORTAL } from './portal-identity.ts'
import {
  fetchScenarioEndings,
  fetchScenarioIncidentBrief,
  fetchScenarioScore,
  isScenarioPlayable,
  sortedScenarioPacks,
  tutorialScenarioPack,
} from './pack.ts'
import type { ScenarioEndings, ScenarioIndex, ScenarioPackEntry, ScenarioScore } from './pack.ts'
import { resetScenarioSession, returnToScenarioDesktop, switchScenarioPack } from './pack-session.ts'
import type { ScenarioSwitchOptions } from './pack-session.ts'
import type { ConfirmCopy } from './confirm.ts'
import { DEFAULT_TOTAL_RUNS } from '../../runloop/run-loop.ts'

export const UNLOCKED_SCENARIOS_KEY = 'ndsp:scenario:unlocked:v1'
export const SCENARIO_UNLOCK_NOTICE = '다른 사건도 해결해보십시오.'
export const SCENARIO_UNPLAYABLE_NOTICE = '이 사건은 아직 종료 자료가 없어 시작할 수 없습니다.'
export const SCENARIO_ENDING_LOAD_FAILURE_NOTICE = '종료 자료를 확인할 수 없어 이 사건을 시작할 수 없습니다.'
export const SCENARIO_PICKER_NOTE =
  '사건 개요는 배치 후 회선에서만 열람할 수 있습니다. 아래 표시되는 것은 난이도와 시행 횟수뿐입니다. 배치된 사건은 시행을 모두 소진할 때까지 교체할 수 없습니다.'
export const SCENARIO_PICKER_FOOT = '시행을 모두 소진하면 동일 사건으로 재평가가 편성됩니다.'
export const SCENARIO_CONFIRM_NOTE = '배치된 사건은 시행을 모두 소진할 때까지 교체할 수 없습니다.'

interface StoragePort {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface ScenarioDesktopOptions extends ScenarioSwitchOptions {
  localStorage?: StoragePort | null
}

interface ScenarioStartCheckDeps {
  fetchEndings?: (slug: string) => Promise<ScenarioEndings>
  fetchScore?: (slug: string) => Promise<ScenarioScore>
}

export type ScenarioStartCheck =
  | { ok: true }
  | { ok: false; says: string }

export interface ScenarioCardModel {
  readonly code: string
  readonly difficulty: string
  readonly runs: string
  readonly status: string
  readonly enabled: boolean
}

export interface ScenarioDesktopDeps {
  app: HTMLElement
  desktop: HTMLElement
  index: ScenarioIndex
  visible?: boolean
  localStorage?: StoragePort | null
  sessionStorage?: ScenarioSwitchOptions['storage']
  reload?: () => void
}

export interface ScenarioDesktopHandle {
  unlockAll(): readonly string[]
  showUnlockNotice(): Promise<void>
  show(): void
  hide(): void
  restartCurrent(): void
  returnToDesktop(): void
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

function scenarioFileCode(index: number): string {
  return `${PORTAL.portalCode}/SC-${String(index + 1).padStart(2, '0')}`
}

function difficultyGrade(entry: ScenarioPackEntry): string {
  const raw = entry.difficulty.trim()
  if (/^등급\s*\S+/.test(raw)) return raw
  if (/^\d+$/.test(raw)) return `등급 ${raw}`
  return `등급 ${raw.toUpperCase()}`
}

export function scenarioCardModel(
  entry: ScenarioPackEntry,
  index: number,
  unlocked: boolean,
): ScenarioCardModel {
  const enabled = unlocked && isScenarioPlayable(entry)
  return {
    code: scenarioFileCode(index),
    difficulty: difficultyGrade(entry),
    runs: `RUN 01 / ${String(DEFAULT_TOTAL_RUNS).padStart(2, '0')}`,
    status: enabled ? '배치 가능' : unlocked ? '열람 전용' : '미개방',
    enabled,
  }
}

export function readUnlockedScenarioSlugs(
  index: ScenarioIndex,
  storage: StoragePort | null | undefined,
): readonly string[] {
  tutorialScenarioPack(index)
  const sorted = sortedScenarioPacks(index)
  const floor = sorted.filter(isScenarioPlayable).map((pack) => pack.slug)
  const port = storageOf(storage)
  if (port === null) return floor
  const raw = port.getItem(UNLOCKED_SCENARIOS_KEY)
  const known = knownSlugs(index)
  const unlocked = new Set<string>(floor)
  if (raw === null) {
    return sorted.map((pack) => pack.slug).filter((slug) => unlocked.has(slug))
  }
  try {
    const value = JSON.parse(raw)
    if (!Array.isArray(value)) {
      return sorted.map((pack) => pack.slug).filter((slug) => unlocked.has(slug))
    }
    for (const item of value) {
      if (typeof item === 'string' && known.has(item)) unlocked.add(item)
    }
    return sorted.map((pack) => pack.slug).filter((slug) => unlocked.has(slug))
  } catch {
    return sorted.map((pack) => pack.slug).filter((slug) => unlocked.has(slug))
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

export function incidentBriefCopy(entry: ScenarioPackEntry): ConfirmCopy {
  return {
    head: entry.displayName,
    meta: '사건 배치',
    body: `${entry.displayName} 사건을 진행하시겠습니까?`,
    note: SCENARIO_CONFIRM_NOTE,
    yes: '열기',
    no: '취소',
  }
}

export async function scenarioStartCheck(
  entry: ScenarioPackEntry,
  deps: ScenarioStartCheckDeps = {},
): Promise<ScenarioStartCheck> {
  if (!isScenarioPlayable(entry)) return { ok: false, says: SCENARIO_UNPLAYABLE_NOTICE }
  try {
    await Promise.all([
      (deps.fetchEndings ?? fetchScenarioEndings)(entry.slug),
      (deps.fetchScore ?? fetchScenarioScore)(entry.slug),
    ])
    return { ok: true }
  } catch {
    return { ok: false, says: SCENARIO_ENDING_LOAD_FAILURE_NOTICE }
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
  let picker: HTMLElement | null = null
  let grid: HTMLElement | null = null
  let visible = deps.visible === true

  function pickerShell(): HTMLElement {
    if (picker) return picker
    picker = el('div', 'scenario-picker')
    picker.setAttribute('role', 'group')
    picker.setAttribute('aria-labelledby', 'scenario-picker-title')

    const head = el('div', 'scenario-picker-head')
    const title = el('span', undefined, '모의 과정 · 배치 가능 사건')
    title.id = 'scenario-picker-title'
    head.append(
      title,
      el('span', undefined, `${PORTAL.operatorId} ${PORTAL.operator} · 보안 등급 ${PORTAL.clearance}`),
    )

    grid = el('div', 'scenario-grid')
    picker.append(
      head,
      el('p', 'scenario-picker-note', SCENARIO_PICKER_NOTE),
      grid,
      el('div', 'scenario-picker-foot', SCENARIO_PICKER_FOOT),
    )
    return picker
  }

  function syncPickerMount(): void {
    if (picker === null) return
    picker.hidden = !visible
    picker.setAttribute('aria-hidden', visible ? 'false' : 'true')
    if (visible) {
      if (!picker.isConnected) deps.desktop.append(picker)
    } else {
      picker.remove()
    }
  }

  function renderPips(node: HTMLElement, model: ScenarioCardModel): void {
    const pips = el('span', 'scenario-file-pips')
    for (let index = 0; index < DEFAULT_TOTAL_RUNS; index += 1) {
      const pip = el('span')
      if (model.enabled && index === 0) pip.className = 'is-current'
      pips.append(pip)
    }
    node.append(pips)
  }

  function openFile(entry: ScenarioPackEntry, node: HTMLButtonElement): void {
    node.disabled = true
    void (async () => {
      try {
        const startable = await scenarioStartCheck(entry)
        if (!startable.ok) {
          const coach = createCoach(deps.app)
          try {
            await coach.show({
              target: '#desktop',
              says: startable.says,
              side: 'above',
            })
          } finally {
            coach.destroy()
          }
          return
        }
        // Startup check: the brief must be readable, but the confirm plate no longer prints it.
        await fetchScenarioIncidentBrief(entry.slug)
        const confirmed = await openConfirm(deps.app, incidentBriefCopy(entry))
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
    pickerShell()
    for (const [index, pack] of packs.entries()) {
      let node = files.get(pack.slug)
      if (!node) {
        node = button('scenario-file', '', '')
        node.dataset.scenarioSlug = pack.slug
        node.addEventListener('click', () => openFile(pack, node!))
        files.set(pack.slug, node)
      }
      const model = scenarioCardModel(pack, index, unlocked.has(pack.slug))
      node.title = `${model.code} ${model.status}`
      node.setAttribute('aria-label', `${model.code} ${model.status}`)
      node.disabled = !model.enabled
      node.classList.toggle('is-locked', !model.enabled)
      node.classList.toggle('is-open', model.enabled)
      node.replaceChildren(
        el('span', 'scenario-file-top', model.code),
        el('span', 'scenario-file-status', model.status),
        el('span', 'scenario-file-field', '난이도'),
        el('b', undefined, model.difficulty),
        el('span', 'scenario-file-field', '시행'),
        el('i', undefined, model.runs),
      )
      renderPips(node, model)
      if (!node.isConnected) grid?.append(node)
    }
    for (const [slug, node] of files) {
      if (!bySlug.has(slug)) {
        node.remove()
        files.delete(slug)
      }
    }
    syncPickerMount()
  }

  render()

  return {
    unlockAll(): readonly string[] {
      const slugs = unlockAllScenarioFiles(deps.index, localStorage)
      render()
      return slugs
    },
    async showUnlockNotice(): Promise<void> {
      visible = true
      render()
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
    show(): void {
      visible = true
      render()
    },
    hide(): void {
      visible = false
      syncPickerMount()
    },
    restartCurrent(): void {
      restartScenario(deps.index, {
        storage: sessionStorage,
        reload: deps.reload,
      })
    },
    returnToDesktop(): void {
      returnToScenarioDesktop(deps.index, {
        storage: sessionStorage,
        reload: deps.reload,
      })
    },
    render,
  }
}
