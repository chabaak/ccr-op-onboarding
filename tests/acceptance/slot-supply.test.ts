// [e10] call-slot supplier closure.
//
// A1/A2/A3/A4. The criterion is the one that keeps the contract honest — it has
// to go red the moment the call-slot contract gains a slot nobody assigned, so it is
// written as a test and not left as a review item.
//
// K3 — the supplier side is read from RUNTIME view values (`Object.keys()` of a
// live `gateView()`/`beatView()`/`roundView()`), never from the contract's own
// prose. Contract-vs-contract would stay green while the implementation silently dropped
// a slot.
// K2 — "in both" means engine-side ∩ proxy-owned. `TEMPERAMENT` sits in both
// `GateView` and `RoundView` by requirement; that is one supplier seen
// through two views, not two suppliers.
import { describe, expect, it } from 'vitest'
import {
  DEP_KEY_TO_SLOT,
  PLAYER_SUPPLIED_SLOTS,
  PROXY_SUPPLIER_KEY,
  closure,
  contractSlots,
} from './fixtures/closure.ts'
import type { SupplierMap } from './fixtures/closure.ts'
import { viewKeys } from './fixtures/rig.ts'
import { COMPOSER_DEP_SLOTS, PROXY_OWNED_SLOTS } from '../../src/engine/feed/slots.ts'

/** The call-slot contract as it reads today — the parser's expected output, sorted. */
const CALL_SLOT_CONTRACT = [
  'AGENT_UTTERANCE',
  'BLOCKS',
  'EXPERIENCED',
  'FIXED_NPC_ACTION',
  'FLAW',
  'GATE_QUESTION',
  'INCIDENT',
  'PRESENT_NPCS',
  'PRIORITY_LIST',
  'REPORT_GUIDANCE',
  'SCENE_SYMPTOMS',
  'STANCE_SET',
  'TEMPERAMENT',
  'TIMELINE_EXCERPT',
  'TIMELINE_TAIL',
]

/** A2's floor: a parse that yields fewer rows than this is a broken parse. */
const MIN_SLOT_ROWS = 12

/** The supplier union, with K1's sixth term made explicit rather than papered over. */
function liveSupply(): SupplierMap {
  const keys = viewKeys()
  return {
    GateView: keys.GateView,
    BeatView: keys.BeatView,
    RoundView: keys.RoundView,
    ComposerDeps: [...COMPOSER_DEP_SLOTS],
    PlayerSupplied: [...PLAYER_SUPPLIED_SLOTS],
    [PROXY_SUPPLIER_KEY]: [...PROXY_OWNED_SLOTS],
  }
}

describe('every call slot has exactly one supplier', () => {
  it('the closure over the live views leaves no slot unassigned and none doubled', () => {
    const result = closure(contractSlots(), liveSupply())
    expect(result.unassigned, 'call slots that nobody supplies').toEqual([])
    expect(result.doubled, 'slots supplied by both the engine side and the proxy').toEqual([])
  })

  it('A2 the contract parse yields a real denominator — never a silently-empty one', () => {
    const slots = contractSlots()
    expect(slots.length).toBeGreaterThanOrEqual(MIN_SLOT_ROWS)
    expect([...slots].sort()).toEqual(CALL_SLOT_CONTRACT)
    expect(new Set(slots).size, 'the parser must not emit a slot twice').toBe(slots.length)
  })

  it('A3 an unassigned slot turns the criterion red', () => {
    const result = closure([...contractSlots(), 'FAKE_SLOT'], liveSupply())
    expect(result.unassigned).toEqual(['FAKE_SLOT'])
    expect(result.doubled).toEqual([])
  })

  it('A4 a slot supplied by both the engine side and the proxy turns it red', () => {
    const poisoned: SupplierMap = { ...liveSupply(), GateView: [...viewKeys().GateView, 'FLAW'] }
    const result = closure(contractSlots(), poisoned)
    expect(result.doubled).toContain('FLAW')
  })

  it('K2 TEMPERAMENT in both GateView and RoundView is NOT a double supply', () => {
    const keys = viewKeys()
    expect(keys.GateView).toContain('TEMPERAMENT')
    expect(keys.RoundView).toContain('TEMPERAMENT')
    expect(closure(contractSlots(), liveSupply()).doubled).toEqual([])
  })

  it('K1 BLOCKS is named by two engine-side terms — the logged contract gap, not a double supply', () => {
    expect(PLAYER_SUPPLIED_SLOTS).toEqual(['BLOCKS'])
    expect(COMPOSER_DEP_SLOTS).toContain('BLOCKS')
    expect(closure(contractSlots(), liveSupply()).doubled).toEqual([])
  })

  it('K4 the dependency-key map is one explicit literal covering ComposerDeps exactly', () => {
    const mapped = Object.values(DEP_KEY_TO_SLOT).sort()
    expect(mapped).toEqual([...COMPOSER_DEP_SLOTS].sort())
    for (const key of Object.keys(DEP_KEY_TO_SLOT)) {
      expect(key, 'a SNAKE_CASE key means a regex crept in').not.toMatch(/^[A-Z0-9_]+$/)
    }
  })

  it('A2 the parser reads the contract, not a hard-coded list — an empty contract is an error', () => {
    // A parser that silently returns [] on a contract change would make the closure
    // vacuously green. `closure` must not accept an empty denominator.
    expect(() => closure([], liveSupply())).toThrow()
  })
})
