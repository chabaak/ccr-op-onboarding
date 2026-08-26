// Runtime scenario choice and the reset that makes a choice clean.
//
// The tutorial/default pack is data, not source: `scenarioPackInPlay()` falls
// back to the manifest's single tutorial entry when no session choice exists.
// A later select screen can call `switchScenarioPack()` and get the same reset
// #60 needs here: run counters, carry-over blocks and the shell's last meta
// projection are cleared before the selected slug is written.

import { clearWebStorageMetaStore } from '../../runloop/index.ts'
import { clearRunState } from './run-state.ts'
import {
  fetchScenarioIdentity,
  fetchScenarioIndex,
  isScenarioPlayable,
  scenarioPackBySlug,
  tutorialScenarioPack,
} from './pack.ts'
import type { ScenarioIdentity, ScenarioIndex, ScenarioPackEntry } from './pack.ts'

interface StoragePort {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface ScenarioSessionOptions {
  storage?: StoragePort | null
}

export interface ScenarioSwitchOptions extends ScenarioSessionOptions {
  reload?: () => void
}

export type EntryState = 'door' | 'select' | 'desk'

export interface EntryStateInput {
  signinFlag: string | null
  webdriver: boolean
  signedIn: boolean
  scenarioPackSelected: boolean
}

export const SELECTED_SCENARIO_KEY = 'ndsp:scenario:selected:v1'
export const SIGNIN_SESSION_KEY = 'ndsp:signin:complete:v1'
export const DESK_MANUAL_PENDING_KEY = 'ndsp:signin:manual-pending:v1'

function defaultStorage(): StoragePort | null {
  try {
    const holder = globalThis as { sessionStorage?: StoragePort }
    return holder.sessionStorage ?? null
  } catch {
    return null
  }
}

function storageOf(options: ScenarioSessionOptions): StoragePort | null {
  return options.storage === undefined ? defaultStorage() : options.storage
}

function defaultReload(): void {
  const holder = globalThis as { location?: { reload?: () => void } }
  holder.location?.reload?.()
}

export function scenarioPackInPlay(
  index: ScenarioIndex,
  options: ScenarioSessionOptions = {},
): ScenarioPackEntry {
  const storage = storageOf(options)
  const selected = storage?.getItem(SELECTED_SCENARIO_KEY) ?? null
  if (selected !== null) {
    const pack = scenarioPackBySlug(index, selected)
    if (pack !== null && isScenarioPlayable(pack)) return pack
  }
  return tutorialScenarioPack(index)
}

export function hasScenarioPackSelection(options: ScenarioSessionOptions = {}): boolean {
  return storageOf(options)?.getItem(SELECTED_SCENARIO_KEY) !== null
}

export function hasSignInSession(options: ScenarioSessionOptions = {}): boolean {
  return storageOf(options)?.getItem(SIGNIN_SESSION_KEY) === '1'
}

export function markSignInComplete(options: ScenarioSessionOptions = {}): void {
  const storage = storageOf(options)
  storage?.setItem(SIGNIN_SESSION_KEY, '1')
  storage?.setItem(DESK_MANUAL_PENDING_KEY, '1')
}

export function consumeDeskManualPending(options: ScenarioSessionOptions = {}): boolean {
  const storage = storageOf(options)
  if (storage?.getItem(DESK_MANUAL_PENDING_KEY) !== '1') return false
  storage.removeItem(DESK_MANUAL_PENDING_KEY)
  return true
}

export function entryStateOf(state: EntryStateInput): EntryState {
  if (state.signinFlag === 'skip') return 'desk'
  if (state.signinFlag === 'show') return 'door'
  if (state.webdriver && !state.signedIn) return 'desk'
  if (!state.signedIn) return 'door'
  if (!state.scenarioPackSelected) return 'select'
  return 'desk'
}

/**
 * Clears all pack-bound session state.
 *
 * Run-loop state is keyed by slug, so every manifest entry is cleared. The
 * shell projection uses one fixed key and is cleared once. The in-memory block
 * and membrane stores are intentionally not reachable here; `switchScenarioPack`
 * reloads the page after clearing persistence, which is the only clean way to
 * drop those live objects without teaching every window about pack selection.
 */
export function resetScenarioSession(
  index: ScenarioIndex,
  options: ScenarioSessionOptions = {},
): void {
  const storage = storageOf(options)
  if (storage === null) return
  clearRunState({ storage: storage as Storage })
  for (const pack of index.packs) clearWebStorageMetaStore(storage, pack.slug)
}

export function switchScenarioPack(
  index: ScenarioIndex,
  slug: string,
  options: ScenarioSwitchOptions = {},
): ScenarioPackEntry {
  const pack = scenarioPackBySlug(index, slug)
  if (pack === null) throw new Error(`scenario index: unknown pack ${JSON.stringify(slug)}`)
  if (!isScenarioPlayable(pack)) throw new Error(`scenario index: pack ${JSON.stringify(slug)} is not playable`)
  const storage = storageOf(options)
  resetScenarioSession(index, { storage })
  storage?.setItem(SELECTED_SCENARIO_KEY, slug)
  if (options.reload === undefined) defaultReload()
  else options.reload()
  return pack
}

export function returnToScenarioDesktop(
  index: ScenarioIndex,
  options: ScenarioSwitchOptions = {},
): void {
  const storage = storageOf(options)
  resetScenarioSession(index, { storage })
  storage?.removeItem(SELECTED_SCENARIO_KEY)
  storage?.setItem(SIGNIN_SESSION_KEY, '1')
  if (options.reload === undefined) defaultReload()
  else options.reload()
}

export async function fetchScenarioInPlay(
  options: ScenarioSessionOptions = {},
): Promise<ScenarioIdentity> {
  const index = await fetchScenarioIndex()
  return fetchScenarioIdentity(scenarioPackInPlay(index, options))
}
