// [e2] — run state: variable init from bound meters (§1.1 · §1.1a),
// `applyEffects` (§1.2 · §4.2), and the delta journal entry (§2.1).
//
// The two actuators — a gate bucket's `(gate, stance)` delta and a script
// event's `effects` — carry the *same* `{deltas, flags}` shape by design
// (§1.2), so both run through `applyEffects` and this suite exercises the seam
// once with each actuator's `cause` vocabulary rather than duplicating the
// table.
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import type { Characters, Symptoms } from '../../../src/shared/datapack.ts'
import {
  initState,
  applyEffects,
  renderSymptoms,
  type DeltaEntry,
  type RunState,
} from '../../../src/engine/state/index.ts'
import { TUTORIAL_DIR } from '../../helpers/scenario.ts'

const PACK = TUTORIAL_DIR

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(PACK, file), 'utf8')) as T
}

function characters(): Characters {
  return readJson<Characters>('characters.json')
}

describe('initState — §1.1a variables come from bound meters only', () => {
  it('seeds every scalar whose meter carries a non-null `variable` + `initial`', () => {
    expect(initState(characters()).scalars).toEqual({ defensiveness: 60, trust: 55, avoidance: 70 })
  })

  it('ignores the twelve unbound meters rather than inventing state for them', () => {
    const state = initState(characters())
    expect(Object.keys(state.scalars).sort()).toEqual(['avoidance', 'defensiveness', 'trust'])
  })

  it('binds nothing at all when no meter is bound (a draft-stage pack)', () => {
    const draft: Characters = {
      characters: [
        {
          id: 'c1',
          name: '서지형',
          role: '발신자',
          interest: '살아남는 것',
          knows: [],
          doesnt_know: [],
          meters: [{ id: 'm1', label: '신뢰', variable: null, initial: null }],
          strands: { truth_ids: [], gate_ids: [] },
        },
      ],
    }
    expect(initState(draft).scalars).toEqual({})
  })

  it('starts flags empty, clock at zero, and the route at beat zero with nothing visited', () => {
    const state = initState(characters())
    expect(state.flags).toEqual({})
    expect(state.clock).toBe(0)
    expect(state.route.beat).toBe(0)
    expect(state.route.visited).toEqual([])
  })

  it('returns a fresh state each call — mutating one does not leak into the next', () => {
    const a = initState(characters())
    a.scalars.trust = 999
    a.flags.tip_traced = true
    expect(initState(characters()).scalars.trust).toBe(55)
    expect(initState(characters()).flags).toEqual({})
  })
})

describe('applyEffects — §2.1 journal entry shape', () => {
  let state: RunState

  function fresh(): RunState {
    return initState(characters())
  }

  it('records {variable, before, after, cause} for every scalar delta', () => {
    state = fresh()
    const journal = applyEffects(state, { deltas: { defensiveness: -20, trust: 25 } }, 'G7:c')
    expect(journal).toEqual([
      { variable: 'defensiveness', before: 60, after: 40, cause: 'G7:c' },
      { variable: 'trust', before: 55, after: 80, cause: 'G7:c' },
    ])
  })

  it('writes the delta into the state, not just the journal', () => {
    state = fresh()
    applyEffects(state, { deltas: { defensiveness: -20, trust: 25 } }, 'G7:c')
    expect(state.scalars).toEqual({ defensiveness: 40, trust: 80, avoidance: 70 })
  })

  it('carries `cause` through verbatim — the pack id, never a label', () => {
    state = fresh()
    const [entry] = applyEffects(state, { deltas: { trust: 5 } }, 'event:t12')
    expect(entry.cause).toBe('event:t12')
  })

  it('never emits an entry with an empty cause (§7-2)', () => {
    state = fresh()
    const journal = applyEffects(state, { deltas: { trust: 5 }, flags: { tip_traced: true } }, 'G1:a')
    for (const entry of journal) expect(entry.cause).not.toBe('')
  })

  it('chains across beats — the second entry\'s `before` is the first\'s `after`', () => {
    state = fresh()
    const first = applyEffects(state, { deltas: { trust: -20 } }, 'G1:a')
    const second = applyEffects(state, { deltas: { trust: -5 } }, 'event:t12')
    expect(first[0].after).toBe(35)
    expect(second[0]).toEqual({ variable: 'trust', before: 35, after: 30, cause: 'event:t12' })
  })
})

describe('applyEffects — §1.2 flags, from either actuator', () => {
  it('treats an unseen flag as false before the write', () => {
    const state = initState(characters())
    const journal = applyEffects(state, { flags: { tip_traced: true } }, 'event:t12')
    expect(journal).toEqual([
      { variable: 'tip_traced', before: false, after: true, cause: 'event:t12' },
    ])
    expect(state.flags.tip_traced).toBe(true)
  })

  it('records the true → false transition with the same shape', () => {
    const state = initState(characters())
    applyEffects(state, { flags: { tip_traced: true } }, 'event:t12')
    const journal = applyEffects(state, { flags: { tip_traced: false } }, 'G3:b')
    expect(journal).toEqual([
      { variable: 'tip_traced', before: true, after: false, cause: 'G3:b' },
    ])
  })

  it('does not discriminate by source — a bucket cause and an event cause take the same path', () => {
    const fromBucket = initState(characters())
    const fromEvent = initState(characters())
    const a = applyEffects(fromBucket, { flags: { logs_saved: true } }, 'G5:a')
    const b = applyEffects(fromEvent, { flags: { logs_saved: true } }, 'event:t20')
    expect(fromBucket.flags).toEqual(fromEvent.flags)
    expect({ ...a[0], cause: '' }).toEqual({ ...b[0], cause: '' })
  })
})

describe('applyEffects — §4.2 ordering and the null case', () => {
  it('journals deltas before flags within one effects object', () => {
    const state = initState(characters())
    const journal = applyEffects(
      state,
      { deltas: { trust: 5 }, flags: { tip_traced: true } },
      'G1:a',
    )
    expect(journal.map((e: DeltaEntry) => e.variable)).toEqual(['trust', 'tip_traced'])
  })

  it('journals deltas in the authored key order — the basis of §2.3-3\'s tie-break', () => {
    const state = initState(characters())
    const journal = applyEffects(state, { deltas: { fear: 3, trust: 3 } }, 'G1:a')
    expect(journal.map((e: DeltaEntry) => e.variable)).toEqual(['fear', 'trust'])
  })

  it('returns an empty journal and changes nothing when `effects` is null', () => {
    const state = initState(characters())
    const before = JSON.parse(JSON.stringify(state)) as RunState
    expect(applyEffects(state, null, 'event:t12')).toEqual([])
    expect(state).toEqual(before)
  })

  it('does not mutate the effects object it was handed', () => {
    const state = initState(characters())
    const effects = { deltas: { trust: -20 }, flags: { tip_traced: true } }
    const snapshot = JSON.stringify(effects)
    applyEffects(state, effects, 'G7:c')
    expect(JSON.stringify(effects)).toBe(snapshot)
  })
})

describe('state core end to end — init → applyEffects → renderSymptoms', () => {
  it('turns the shipped pack\'s initial meters and a gate delta into shipped sentences', () => {
    const state = initState(characters())
    const symptoms = readJson<Symptoms>('symptoms.json')
    const journal = applyEffects(state, { deltas: { defensiveness: -20, trust: 25 } }, 'G1:c')

    expect(state.scalars).toEqual({ defensiveness: 40, trust: 80, avoidance: 70 })
    const rendered = renderSymptoms(journal, symptoms)
    expect(rendered).toEqual([
      '문세라가 되묻지 않고 움직였습니다. 발소리가 끊기지 않고 이어졌습니다',
      '표기웅이 묻지 않은 것을 먼저 말했습니다. 자기가 언제 껐는지까지 왔습니다',
    ])
  })

  it('a beat with no effects renders as no change (§4.2 pre-hardening path)', () => {
    const state = initState(characters())
    const symptoms = readJson<Symptoms>('symptoms.json')
    expect(renderSymptoms(applyEffects(state, null, 'event:t01'), symptoms)).toEqual(['(변화 없음)'])
  })
})
