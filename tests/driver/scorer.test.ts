// The scorer — `score.json`'s units read against the state a run ended in.
//
// Driven against the REAL pack, because the two things most worth pinning are
// properties of the authored data rather than of the code: that the ledger's
// headline is the 사망 count `score.json` has always claimed, and that a run
// which intervened scores differently from one that did not. A synthetic pack
// would satisfy both by construction and prove nothing.
import { describe, it, expect } from 'vitest'
import {
  baselineState,
  createScorer,
  scoreRecord,
  scoreUnits,
  totalOf,
} from '../../src/driver/scorer.ts'
import type { OutcomePack, ScorePack } from '../../src/driver/scorer.ts'
import type { PredicateState } from '../../src/shared/predicates.ts'
import { tutorialPart } from '../helpers/scenario.ts'

const PACK = tutorialPart<ScorePack>('score')

/**
 * The baseline day — COMPUTED from the pack, not typed out here. It is the
 * fixed timeline's flags and nothing else: those fire on every run whatever
 * anyone chooses, and no gate outcome is guaranteed to any run.
 */
const OUTCOME = {
  timeline: tutorialPart('timeline'),
} as OutcomePack

const UNTOUCHED: PredicateState = baselineState(OUTCOME)

describe('the baseline day scores the pack’s own summary', () => {
  it('(a) the headline is 207 — the sum `baseline_summary` has always claimed', () => {
    // 돔 안 185 · 남측 에어락 통로 21 · 문세라 1. If this drifts, either the
    // pack's prose or its predicates moved without the other.
    const units = scoreUnits(PACK, UNTOUCHED)
    expect(totalOf(units)).toBe(207)

    const summary = (PACK as unknown as { baseline_summary: string }).baseline_summary
    expect(summary, 'the pack no longer states the baseline this guard checks').toContain('총 사망 207명')
  })

  it('(b) every unit resolves — a linted pack leaves none unscored', () => {
    // E-P4 makes a missing fallback an ERROR, so a short ledger here means the
    // pack shipped unlinted rather than that a unit had nothing to say.
    expect(scoreUnits(PACK, UNTOUCHED)).toHaveLength(PACK.units.length)
  })

  it('(c) only deaths sum; outcomes read without counting unless they name a death', () => {
    const byId = new Map(scoreUnits(PACK, UNTOUCHED).map((u) => [u.id, u.value]))
    expect(byId.get('u3')).toBe('사망 · 집결지 실종자 명단')
    expect(byId.get('u4')).toBe('열쇠가 나온 것만 적히고, 누구 것인지는 오르지 않음')
    expect(typeof byId.get('u1')).toBe('number')
  })
})

describe('a run that intervened scores differently', () => {
  it('(d) restoring the vents empties the dome and the headline goes to 0', () => {
    const restored: PredicateState = { ...UNTOUCHED, vent_restored: true }
    const units = scoreUnits(PACK, restored)
    expect(totalOf(units)).toBe(0)
    const byId = new Map(units.map((u) => [u.id, u.value]))
    expect(byId.get('u3')).toBe('생존 · 서쪽 슬리브로 마지막에 걸어 나온다')
  })

  it('(e) opening only the west sleeve is a partial save, not a whole one', () => {
    const capped: PredicateState = { ...UNTOUCHED, west_sleeve_opened: true }
    const byId = new Map(scoreUnits(PACK, capped).map((u) => [u.id, u.value]))
    expect(byId.get('u1')).toBe(9)
    expect(byId.get('u2')).toBe(3)
    expect(totalOf(scoreUnits(PACK, capped))).toBe(12)
  })

  it('(f) the stronger rescue branch beats the earlier headcount branch', () => {
    const counted: PredicateState = { ...UNTOUCHED, headcount_pressed: true }
    const rescued: PredicateState = { ...counted, north_opened: true }
    const idOf = (state: PredicateState): unknown =>
      new Map(scoreUnits(PACK, state).map((u) => [u.id, u.value])).get('u1')
    expect(idOf(rescued)).toBe(0)
    expect(idOf(counted)).toBe(44)
  })
})

describe('the baseline day — §5.2 amendment h', () => {
  it('(j) the computed baseline IS what a run that set no gate flag records', () => {
    // The drift this closes. `score.json`'s authored `baseline` is prose, so
    // nothing could check it against a run — and it went wrong exactly that
    // way: u6 read 3권 전량 파쇄 while the baseline day scored 사본만. Deriving
    // the baseline from the same rules makes the two structurally incapable of
    // disagreeing. The run-record projection is generated here rather than
    // loaded from a committed fixture artifact.
    const recorded = scoreRecord(PACK, UNTOUCHED, UNTOUCHED)
    expect(recorded).not.toBeNull()

    const computed = scoreUnits(PACK, UNTOUCHED, UNTOUCHED)
    expect(computed.map((u) => ({ id: u.id, value: u.value }))).toEqual(recorded!.units)
    expect(totalOf(computed)).toBe(recorded!.total)
  })

  it('(k) `baselineState` carries the fixed timeline and NO gate outcome', () => {
    // The correction this encodes. The baseline used to fold in each gate's
    // `default_stance` bucket, on the reading that a no-injection run falls to
    // its defaults. It does not: `default_stance` is what the engine
    // substitutes when CALL 1 FAILED, so that baseline was "what a network
    // error would have scored". Only the fixed timeline is guaranteed.
    expect(Object.keys(UNTOUCHED)).toEqual([])
    // G1's non-default bucket sets this. It is a gate outcome, so it is not owed.
    expect(UNTOUCHED.headcount_pressed).toBeUndefined()
    expect(UNTOUCHED.west_sleeve_opened).toBeUndefined()
    expect(UNTOUCHED.vent_restored).toBeUndefined()

    // Which leaves every unit on its unconditional rule — the ending
    // `baseline_summary` describes, and the only one no choice can claim.
    const byId = new Map(scoreUnits(PACK, UNTOUCHED, UNTOUCHED).map((u) => [u.id, u.value]))
    expect(byId.get('u4')).toBe('열쇠가 나온 것만 적히고, 누구 것인지는 오르지 않음')
    expect(byId.get('u1')).toBe(185)
  })

  it('(k2) the baseline cannot be moved by re-authoring a gate’s default', () => {
    // The structural half of (k): `baselineState` reads `timeline` only, so a
    // pack whose gates changed wholesale scores the same baseline. Before the
    // correction this number moved with `default_stance`, silently.
    const gatesMoved = baselineState(OUTCOME)
    expect(totalOf(scoreUnits(PACK, gatesMoved, gatesMoved))).toBe(207)
    expect(Object.keys(gatesMoved).sort()).toEqual([])
  })

  it('(l) an intervened run carries the untouched value beside its own', () => {
    const restored: PredicateState = { ...UNTOUCHED, vent_restored: true }
    const scorer = createScorer(PACK, () => restored, UNTOUCHED)
    const ledger = scorer.score()
    expect(ledger.total).toBe(0)
    expect(ledger.baseline_total).toBe(207)
    const dome = ledger.rows[0]!
    expect(dome.value).toBe(0)
    expect(dome.baseline).toBe(185)
  })
})

describe('the two halves the two consumers take', () => {
  it('(g) the port carries labels, the record carries ids — neither has both', () => {
    const port = createScorer(PACK, () => UNTOUCHED, UNTOUCHED).score()
    const record = scoreRecord(PACK, UNTOUCHED)

    expect(port.rows[0]).toEqual({ label: PACK.units[0]!.label, value: 185, baseline: 185 })
    expect(record?.units[0]).toEqual({ id: 'u1', value: 185 })
    expect(port.total).toBe(record?.total)
    // A rendered sheet shows labels and has no use for `u1`; an archive is
    // indexed, and prose labels move when the scenario is edited. That is why
    // the shared step is `scoreUnits` rather than either of these two.
    expect(Object.keys(port.rows[0]!)).toEqual(['label', 'value', 'baseline'])
    expect(Object.keys(record!.units[0]!)).toEqual(['id', 'value'])
  })

  it('(h) the port reads state when ASKED, not when built', () => {
    // The driver calls `score()` at the close of the day. A scorer that captured
    // its state at construction would score the opening beat, every run.
    let state: PredicateState = UNTOUCHED
    const scorer = createScorer(PACK, () => state, UNTOUCHED)
    state = { ...UNTOUCHED, vent_restored: true }
    expect(scorer.score().total).toBe(0)
  })

  it('(i) a pack nothing resolves records `null`, not an empty ledger', () => {
    // `run-record.schema.json` types `score` as `["object","null"]` for this: a
    // run with nothing to score says so, rather than reporting no casualties.
    const empty: ScorePack = { units: [] }
    expect(scoreRecord(empty, UNTOUCHED)).toBeNull()
    expect(createScorer(empty, () => UNTOUCHED, UNTOUCHED).score()).toEqual({
      total: 0,
      baseline_total: 0,
      rows: [],
    })
  })
})

// ── One-person units ────────────────────────────────────────────────────────
//
// The real tutorial pack already has a one-person unit, but this is scorer
// arithmetic rather than scenario coverage. A hand-built score pack states the
// shape directly: one crowd row, one person who may die in prose, one bystander.
const ONE_PERSON: ScorePack = {
  units: [
    { id: 'u1', label: 'crowd', predicates: ['opened => 0', '=> 10'] },
    { id: 'u2', label: 'operator', predicates: ['rescued => 생존 · 집결지', '=> 사망 · 기계실'] },
    { id: 'u3', label: 'witness', predicates: ['named => 생존 · 입건', '=> 사망 · 대기실'] },
  ],
}

describe('a unit that is one person counts as one', () => {
  const RESCUED: PredicateState = { opened: true, named: true }

  it('(m) the day the crowd gets out still counts the person left behind', () => {
    const units = scoreUnits(ONE_PERSON, RESCUED)
    const byId = new Map(units.map((u) => [u.id, u.value]))
    expect(byId.get('u1')).toBe(0)
    expect(byId.get('u2')).toBe('사망 · 기계실')
    expect(byId.get('u3')).toBe('생존 · 입건')
    expect(totalOf(units)).toBe(1)
  })

  it('(n) the branch that saves the person removes that death from the headline', () => {
    const drivenOut: PredicateState = { opened: true, named: true, rescued: true }
    const byId = new Map(scoreUnits(ONE_PERSON, drivenOut).map((u) => [u.id, u.value]))
    expect(byId.get('u2')).toBe('생존 · 집결지')
    expect(totalOf(scoreUnits(ONE_PERSON, drivenOut))).toBe(0)
  })

  it('(o) the untouched day is the crowd plus the two people named by prose', () => {
    const nothing: PredicateState = {}
    expect(totalOf(scoreUnits(ONE_PERSON, nothing))).toBe(10 + 1 + 1)
  })

  it('(p) the crowd axis never counts the named person — their branch is their own', () => {
    const dies: PredicateState = { opened: true }
    const lives: PredicateState = { opened: true, rescued: true }
    const crowd = (s: PredicateState): unknown =>
      new Map(scoreUnits(ONE_PERSON, s).map((u) => [u.id, u.value])).get('u1')

    expect(crowd(dies)).toBe(crowd(lives))
    expect(totalOf(scoreUnits(ONE_PERSON, dies)) - totalOf(scoreUnits(ONE_PERSON, lives))).toBe(1)
  })
})
