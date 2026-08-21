// [e4#A8] — every call slot in the data contract resolves to exactly one of
// `GateView ∪ BeatView ∪ RoundView ∪ ComposerDeps ∪ PROXY_OWNED_SLOTS`.
//
// The slot list is read from `data/contracts/call-slots.json` rather than
// restated here, so the supplier assertions still have an external denominator. The
// view keys are likewise read from `src/engine/index.ts` on disk, because
// `createEngine` is still a throwing stub.
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  PROXY_OWNED_SLOTS,
  COMPOSER_DEP_SLOTS,
} from '../../../src/engine/feed/index.ts'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const CALL_SLOTS = path.join(REPO, 'data/contracts/call-slots.json')
const ENGINE_INDEX = path.join(REPO, 'src/engine/index.ts')

/** Every live call slot named by the data contract. */
function slotsFromContract(): string[] {
  const contract = JSON.parse(fs.readFileSync(CALL_SLOTS, 'utf8')) as {
    supplierSlots?: unknown
  }
  expect(Array.isArray(contract.supplierSlots), 'call-slots.json has no supplierSlots array').toBe(
    true,
  )
  return (contract.supplierSlots as unknown[]).map((slot) => {
    expect(typeof slot, 'supplierSlots entries must be strings').toBe('string')
    return slot as string
  })
}

/** Keys declared by an `export type <Name> = { ... }` block in engine/index.ts. */
function viewKeys(typeName: string): string[] {
  const source = fs.readFileSync(ENGINE_INDEX, 'utf8')
  const at = source.indexOf(`export type ${typeName} = {`)
  expect(at, `src/engine/index.ts no longer declares ${typeName}`).toBeGreaterThan(-1)
  const body = source.slice(at, source.indexOf('\n}', at))
  return [...body.matchAll(/^\s{2}([A-Z][A-Z0-9_]*)\??:/gm)].map((m) => m[1]!)
}

const CONTRACT_SLOTS = slotsFromContract()

const SUPPLIERS: Record<string, readonly string[]> = {
  GateView: viewKeys('GateView'),
  BeatView: viewKeys('BeatView'),
  RoundView: viewKeys('RoundView'),
  ComposerDeps: COMPOSER_DEP_SLOTS,
  PROXY_OWNED_SLOTS,
}

describe('[e4#A8] call-slot ⟷ supplier closure', () => {
  it('(a) the data contract parsed into a non-trivial slot list', () => {
    expect(CONTRACT_SLOTS.length).toBeGreaterThanOrEqual(12)
    expect(CONTRACT_SLOTS).toContain('TEMPERAMENT')
    expect(CONTRACT_SLOTS).toContain('EXPERIENCED')
    expect(CONTRACT_SLOTS).toContain('AGENT_UTTERANCE')
  })

  it('(b) every call slot has AT LEAST one supplier', () => {
    const unassigned = [...new Set(CONTRACT_SLOTS)].filter(
      (slot) => !Object.values(SUPPLIERS).some((set) => set.includes(slot)),
    )
    expect(unassigned, 'the call-slot contract gained a slot nobody assigned').toEqual([])
  })

  it('(c) no call slot has two suppliers — except TEMPERAMENT, which binds to both calls', () => {
    const doubled: string[] = []
    for (const slot of new Set(CONTRACT_SLOTS)) {
      const owners = Object.entries(SUPPLIERS)
        .filter(([, set]) => set.includes(slot))
        .map(([name]) => name)
      if (owners.length > 1 && slot !== 'TEMPERAMENT') doubled.push(`${slot}: ${owners.join(' + ')}`)
    }
    expect(doubled).toEqual([])
  })

  it('(d) TEMPERAMENT is supplied by exactly GateView and RoundView', () => {
    const owners = Object.entries(SUPPLIERS)
      .filter(([, set]) => set.includes('TEMPERAMENT'))
      .map(([name]) => name)
      .sort()
    expect(owners).toEqual(['GateView', 'RoundView'])
  })

  it('(e) PROXY_OWNED_SLOTS is exactly the default prompt\'s three', () => {
    expect([...PROXY_OWNED_SLOTS].sort()).toEqual(['FLAW', 'INCIDENT', 'PRIORITY_LIST'])
  })

  it('(f) neither non-view set names anything the call-slot contract does not', () => {
    const stray = [...PROXY_OWNED_SLOTS, ...COMPOSER_DEP_SLOTS].filter(
      (s) => !CONTRACT_SLOTS.includes(s),
    )
    expect(stray, 'a slot was assigned that the call-slot contract does not declare').toEqual([])
  })

  it('(g) no view declares a slot the call-slot contract does not (the views do not invent inputs)', () => {
    const stray: string[] = []
    for (const name of ['GateView', 'BeatView', 'RoundView'] as const) {
      for (const key of SUPPLIERS[name]!) {
        if (!CONTRACT_SLOTS.includes(key)) stray.push(`${name}.${key}`)
      }
    }
    expect(stray).toEqual([])
  })
})
