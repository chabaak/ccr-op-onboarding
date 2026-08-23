// The LIVE FEED's closing 집계 line — and the disagreement it exists to close.
//
// Driven against the REAL pack, on the same reasoning as `tests/driver/
// scorer.test.ts`: the property worth pinning is that two SURFACES report one
// run identically, and a synthetic ledger would satisfy that by construction.
//
// DOM-free by design (vitest runs `environment: 'node'`): `tallyLineText` is
// pure, and the rendering half — that the line lands in the fanfold on `score`
// — is `e2e/run-loop.spec.ts`'s.
import { describe, expect, it } from 'vitest'
import { tallyLineText } from '../../src/client/components/tally-line.ts'
import { baselineState, createScorer } from '../../src/driver/scorer.ts'
import { deathsOf } from '../../src/shared/predicates.ts'
import type { OutcomePack, ScorePack } from '../../src/driver/scorer.ts'
import type { PredicateState } from '../../src/shared/predicates.ts'
import type { ViewEvent } from '../../src/shared/view-driver.ts'
import { tutorialPart } from '../helpers/scenario.ts'

const PACK = tutorialPart<ScorePack>('score')
const TIMELINE = tutorialPart<{
  events: { id: string; time: string; text: string }[]
}>('timeline')
const BASELINE: PredicateState = baselineState({ timeline: TIMELINE } as unknown as OutcomePack)

/** The `score` event a run ending in `state` puts on the seam. */
const ledgerOf = (state: PredicateState): Extract<ViewEvent, { type: 'score' }> => {
  const scored = createScorer(PACK, () => state, BASELINE).score()
  return { type: 'score', ...scored }
}

/** Representative days the tutorial pack can score. */
const DAYS: Record<string, PredicateState> = {
  baseline: BASELINE,
  counted: { ...BASELINE, headcount_pressed: true },
  west: { ...BASELINE, west_sleeve_opened: true },
  restored: { ...BASELINE, vent_restored: true },
}

describe('the feed’s 집계 line and the ledger report ONE run', () => {
  it('(a) the headline in the line is the ledger’s own total, on every day', () => {
    // The defect this closes. `timeline.json`'s t19 printed 사망 26 on all four
    // of these, because a fixed event is printed without reading state; the
    // The authored timeline is fixed prose, while the ledger reads the run's
    // predicate state. Same clock, different possible numbers.
    for (const [day, state] of Object.entries(DAYS)) {
      const ledger = ledgerOf(state)
      expect(tallyLineText(ledger), `${day}: the line dropped the ledger's total`).toContain(
        `사망 ${ledger.total}`,
      )
    }
  })

  it('(b) the four days really do score differently — else (a) proves nothing', () => {
    const totals = Object.fromEntries(
      Object.entries(DAYS).map(([day, state]) => [day, ledgerOf(state).total]),
    )
    expect(totals).toEqual({ baseline: 207, counted: 57, west: 12, restored: 0 })
  })

  it('(c) the breakdown names the counting axes, and only those', () => {
    const ledger = ledgerOf(BASELINE)
    const line = tallyLineText(ledger)
    // 185 + 21 + 1. `표기웅` resolves to prose that does not count, so it is the
    // ledger's row and never one of the headline's parts.
    expect(line).toBe('집계. 사망 207(돔 안에 있던 사람 185 · 남측 에어락 통로에 갇힌 사람 21 · 문세라 1).')
    expect(line).not.toContain('표기웅')
  })

  it('(d) the parts sum to the headline — the line never does its own arithmetic', () => {
    // Summed by `deathsOf`, the rule the scorer totalled with: numeric rows
    // count themselves, and a person-unit prose death counts one.
    for (const state of Object.values(DAYS)) {
      const ledger = ledgerOf(state)
      const summed = ledger.rows.map((row) => deathsOf(row.value)).reduce((a, b) => a + b, 0)
      expect(summed).toBe(ledger.total)
    }
  })

  it('(d2) a named person the day killed is one of the parts, printed as its count', () => {
    // A one-person rescue day, as it reaches the feed: the crowd is out and
    // the headline is the named person alone. Before `deathsOf` this line read
    // 집계. 사망 0.
    const rescued: Extract<ViewEvent, { type: 'score' }> = {
      type: 'score',
      total: 1,
      baseline_total: 139,
      rows: [
        { label: '터널에서 나오지 못한 사람', value: 0, baseline: 137 },
        { label: '오세라', value: '사망 · 아홉 번째 문 안쪽', baseline: '사망 · 아홉 번째 문 앞' },
        { label: '차우진', value: '생존 · 입건', baseline: '사망 · 하행 사점이 킬로 갓길' },
      ],
    }
    // The words stay the ledger's row; the brackets are the headline's
    // arithmetic, so the part is a number like every other part.
    expect(tallyLineText(rescued)).toBe('집계. 사망 1(터널에서 나오지 못한 사람 0 · 오세라 1).')
  })

  it('(e) a ledger with nothing to count prints the headline alone', () => {
    const empty: Extract<ViewEvent, { type: 'score' }> = {
      type: 'score',
      total: 0,
      baseline_total: 0,
      rows: [{ label: '결말', value: '미확인', baseline: null }],
    }
    expect(tallyLineText(empty)).toBe('집계. 사망 0.')
  })
})

describe('what the authored timeline still claims — NOT asserted, recorded', () => {
  it('(f) a fixed event states a count, and that count is the BASELINE, not the run’s', () => {
    // Deliberately not a guard: the scenario is being rewritten, so this asserts
    // nothing about its content. It pins the RELATIONSHIP that makes the derived
    // line necessary — `scriptLinesOf` prints every event verbatim with no state
    // read, so a count authored into one is the same number on every run, and
    // the only run it is true of is the one where nothing moved.
    const stated = TIMELINE.events.filter((event) => /(사망|부상)\s*\d/.test(event.text))
    if (stated.length === 0) return // the rewrite dropped them; nothing to relate
    const baseline = ledgerOf(BASELINE)
    for (const event of stated) {
      const numbers = [...event.text.matchAll(/사망\s*(\d+)/g)].map((m) => Number(m[1]))
      for (const n of numbers) {
        expect(
          n,
          `${event.id} states 사망 ${n}, which is neither the baseline (${baseline.baseline_total}) ` +
            'nor anything the ledger can produce — the two surfaces would disagree by construction',
        ).toBe(baseline.baseline_total)
      }
    }
  })
})
