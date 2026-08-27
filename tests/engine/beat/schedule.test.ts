// [e3] A6 · A7 — the beat schedule (timeline.json × gate clocks) and the round
// boundaries, against the tutorial pack plus D1/D2/D3/D5/D6/D7 fixtures.
import { describe, it, expect } from 'vitest'
import { buildSchedule } from '../../../src/engine/beat/schedule.ts'
import { parseClock } from '../../../src/engine/beat/clock.ts'
import { ClockFormatError, PredicateSyntaxError, BeatPhaseError } from '../../../src/engine/beat/errors.ts'
import type { Timeline, Gates } from '../../../src/shared/datapack.ts'
import { beatAt, driveAll, rig } from './harness.ts'
import { availabilityPack, ev, gate, pack, realPack, trustPack, TRUST_SEED } from './fixtures/packs.ts'

const real = realPack()
const schedule = buildSchedule(real.timeline, real.gates)

/** A7's pinned boundaries — [first clock … last clock] of each round. */
const ROUNDS: Array<{ clocks: string[] }> = [
  { clocks: ['18:38', '18:38+', '18:40', '18:40+', '18:41'] },
  { clocks: ['18:55', '18:55+', '19:26', '19:26+', '19:33', '19:33+', '19:34'] },
  { clocks: ['19:47', '19:48', '19:52', '19:52+', '19:53', '19:55', '19:58'] },
  {
    clocks: [
      '20:04',
      '20:05',
      '20:14',
      '20:15',
      '20:16',
      '20:16+',
      '20:19',
      '20:41',
      '20:41+',
      '21:02',
      '21:35',
      '21:35+',
    ],
  },
]

describe('[e3#D1/D2/D3] one clock tick = one beat; a gate absorbs its co-timed event', () => {
  it('turns the tutorial events and gates into one beat per authored stamp', () => {
    expect(real.timeline.events).toHaveLength(34)
    expect(real.gates.gates).toHaveLength(3)
    expect(schedule).toHaveLength(31)
    expect(schedule.filter((b) => b.kind === 'gate')).toHaveLength(3)
  })

  it('groups the three 19:26 events into one beat, in events[] order (D1)', () => {
    const b = beatAt(schedule, '19:26')
    expect(b.events.map((e) => e.id)).toEqual(['t7', 't8', 't9'])
    expect(schedule.filter((x) => x.clock === '19:26')).toHaveLength(1)
  })

  it('gives G1 at 18:41 a gate-only beat with no events (D3)', () => {
    const b = beatAt(schedule, '18:41')
    expect(b.kind).toBe('gate')
    expect(b.gate?.id).toBe('G1')
    expect(b.events).toEqual([])
  })

  it('all tutorial gates are gate-only beats (D3)', () => {
    for (const clock of ['18:41', '19:34', '19:58']) {
      const b = beatAt(schedule, clock)
      expect(b.kind).toBe('gate')
      expect(b.events).toEqual([])
    }
  })

  it('indexes beats 0..n-1 in clock order', () => {
    expect(schedule.map((b) => b.index)).toEqual(schedule.map((_, i) => i))
    const mins = schedule.map((b) => b.minutes)
    expect(mins).toEqual([...mins].sort((a, b) => a - b))
  })

  it('places every gate clock on a gate beat and nowhere else', () => {
    const gateClocks = real.gates.gates.map((g) => g.clock)
    expect(schedule.filter((b) => b.kind === 'gate').map((b) => b.clock)).toEqual(gateClocks)
  })
})

describe('[e3#D7] clock parsing and the 21:04+ tie-break', () => {
  it('parses HH:MM to minutes', () => {
    expect(parseClock('00:00')).toBe(0)
    expect(parseClock('08:50')).toBe(530)
    expect(parseClock('21:04')).toBe(1264)
  })

  it('gives a trailing + a +0.5 ordering weight', () => {
    expect(parseClock('21:04+')).toBe(1264.5)
    expect(parseClock('21:04+')).toBeGreaterThan(parseClock('21:04'))
  })

  it('throws ClockFormatError on garbage', () => {
    for (const bad of ['', '9:25', '21-04', 'noon', '21:04++', '25:00', '09:60']) {
      expect(() => parseClock(bad), bad).toThrow(ClockFormatError)
    }
  })

  it('sorts 21:35+ after 21:35 in the real schedule', () => {
    const i04 = schedule.findIndex((b) => b.clock === '21:35')
    const iPlus = schedule.findIndex((b) => b.clock === '21:04+')
    const iEndPlus = schedule.findIndex((b) => b.clock === '21:35+')
    expect(i04).toBeGreaterThanOrEqual(0)
    expect(iEndPlus).toBe(i04 + 1)
    expect(iEndPlus).toBe(schedule.length - 1)
    expect(iPlus).toBe(-1)
  })
})

describe('[e3#A6] every beat belongs to a round', () => {
  it('gives the opening beats before G1 roundIndex 0', () => {
    for (const clock of ['18:38', '18:38+', '18:40', '18:40+']) {
      expect(beatAt(schedule, clock).roundIndex).toBe(0)
      expect(beatAt(schedule, clock).isRoundLast).toBe(false)
    }
    expect(beatAt(schedule, '18:38').index).toBe(0)
  })

  it('buildSchedule emits no null roundIndex values', () => {
    expect(schedule.filter((b) => b.roundIndex === null)).toEqual([])
  })

  it('keeps roundView() illegal until the first gate closes round 0', () => {
    const r = rig(real)
    expect(r.driver.current().clock).toBe('18:38')
    expect(() => r.driver.roundView()).toThrow(BeatPhaseError)
    r.driver.applyBeatEffects()
    expect(() => r.driver.roundView()).toThrow(BeatPhaseError)
  })

  it('emits round 0 report at G1, not before it', () => {
    const r = rig(real)
    while (r.driver.current().clock !== '18:41') {
      r.driver.applyBeatEffects()
      expect(r.driver.steps().filter((s) => s.kind === 'report')).toHaveLength(0)
      expect(r.driver.advance()).toBe(true)
    }
    r.driver.submitStance({ stance: r.schedule[r.driver.current().index]!.gate!.defaultStance, utterance: 'u' })
    r.driver.applyBeatEffects()
    expect(r.driver.steps().filter((s) => s.kind === 'report')).toEqual([
      { kind: 'report', beat: beatAt(schedule, '18:41').index, round: 0 },
    ])
  })
})

describe('[e3#A7] round boundary = the gate that judges it', () => {
  it('assigns the pinned tutorial round membership', () => {
    ROUNDS.forEach((round, i) => {
      expect(
        schedule.filter((b) => b.roundIndex === i).map((b) => b.clock),
        `round ${i}`,
      ).toEqual(round.clocks)
    })
    expect(Math.max(...schedule.map((b) => b.roundIndex ?? -1))).toBe(3)
  })

  it('marks exactly one isRoundLast beat per round, at the round s last clock', () => {
    expect(schedule.filter((b) => b.isRoundLast).map((b) => b.clock)).toEqual(
      ROUNDS.map((r) => r.clocks[r.clocks.length - 1]!),
    )
  })

  it('emits one report step per round, immediately after that round s last beat', () => {
    const r = rig(real)
    driveAll(r)
    const reports = r.driver.steps().filter((s) => s.kind === 'report')
    expect(reports).toHaveLength(4)
    expect(reports.map((s) => (s as { round: number }).round)).toEqual([0, 1, 2, 3])
    expect(reports.map((s) => s.beat)).toEqual(
      ROUNDS.map((round) => beatAt(schedule, round.clocks[round.clocks.length - 1]!).index),
    )
  })

  it('emits no report step before the first gate', () => {
    const r = rig(real)
    driveAll(r)
    const firstGateIndex = beatAt(schedule, '18:41').index
    const early = r.driver.steps().filter((s) => s.kind === 'report' && s.beat < firstGateIndex)
    expect(early).toHaveLength(0)
  })

  it('puts each report step after that beat s narration step and before the next beat s steps', () => {
    const r = rig(real)
    driveAll(r)
    const steps = r.driver.steps()
    for (let i = 0; i < steps.length; i += 1) {
      const s = steps[i]!
      if (s.kind !== 'report') continue
      const prev = steps[i - 1]
      expect(prev?.kind).toBe('narration')
      expect(prev?.beat).toBe(s.beat)
      const next = steps[i + 1]
      if (next) expect(next.beat).toBeGreaterThan(s.beat)
    }
  })

  it('emits one judgment step per gate beat ASKED, before that beat s narration step', () => {
    const r = rig(real)
    const asked: number[] = []
    driveAll(r, undefined, (driver) => {
      const cur = driver.current()
      if (cur.kind === 'gate') asked.push(cur.index)
    })
    const steps = r.driver.steps()
    const judgments = steps.filter((s) => s.kind === 'judgment')
    expect(judgments.map((s) => s.beat)).toEqual(asked)
    for (const j of judgments) {
      const narrationIdx = steps.findIndex((s) => s.kind === 'narration' && s.beat === j.beat)
      expect(steps.indexOf(j)).toBeLessThan(narrationIdx)
    }
  })

  it('keeps every scheduled gate but asks only available gates on the no-intervention path', () => {
    const r = rig(real)
    driveAll(r)
    expect(schedule.filter((b) => b.kind === 'gate')).toHaveLength(3)
    expect(r.driver.steps().filter((s) => s.kind === 'judgment')).toHaveLength(1)
  })

  it('emits one narration step per beat (§3.1: script beats run Call 2 without exception)', () => {
    const r = rig(real)
    driveAll(r)
    const narration = r.driver.steps().filter((s) => s.kind === 'narration')
    expect(narration.map((s) => s.beat)).toEqual(schedule.map((b) => b.index))
  })

  it('makes roundView() legal only on the round s last beat', () => {
    const r = rig(real)
    const seen: Array<{ clock: string; ok: boolean }> = []
    driveAll(r, (driver, beat) => {
      let ok = true
      try {
        driver.roundView()
      } catch {
        ok = false
      }
      seen.push({ clock: beat.clock, ok })
    })
    expect(seen.filter((s) => s.ok).map((s) => s.clock)).toEqual(
      ROUNDS.map((round) => round.clocks[round.clocks.length - 1]!),
    )
  })
})

describe('[e3#D5/D6] edge predicates compile at schedule-build time', () => {
  const one = (predicates: string[]): Gates => ({ gates: [gate('G1', '09:00', { edge_predicates: predicates })] })
  const line: Timeline = { events: [ev('x1', '09:00')] }

  it('an empty array compiles to zero edges and routes to null (D5)', () => {
    const s = buildSchedule(line, one([]))
    expect(s[0]!.gate!.edges).toEqual([])
    const r = rig(pack([ev('x1', '09:00')], [gate('G1', '09:00', { edge_predicates: [] })]))
    expect(r.driver.submitStance({ stance: 'a', utterance: 'u' }).nextNode).toBeNull()
  })

  it('all tutorial gates ship empty edge_predicates', () => {
    expect(schedule.filter((b) => b.kind === 'gate').map((b) => b.gate!.edges)).toEqual([[], [], []])
  })

  it('parses the five comparison operators plus <flag> == true', () => {
    const s = buildSchedule(
      line,
      one(['trust >= 55 -> n1', 'trust <= 10 -> n2', 'fear > 3 -> n3', 'fear < 1 -> n4', 'trust == 0 -> n5', 'sealed == true -> n6', 'else -> n7']),
    )
    expect(s[0]!.gate!.edges).toEqual([
      { kind: 'cmp', variable: 'trust', op: '>=', value: 55, node: 'n1' },
      { kind: 'cmp', variable: 'trust', op: '<=', value: 10, node: 'n2' },
      { kind: 'cmp', variable: 'fear', op: '>', value: 3, node: 'n3' },
      { kind: 'cmp', variable: 'fear', op: '<', value: 1, node: 'n4' },
      { kind: 'cmp', variable: 'trust', op: '==', value: 0, node: 'n5' },
      { kind: 'flag', flag: 'sealed', node: 'n6' },
      { kind: 'else', node: 'n7' },
    ])
  })

  it('throws PredicateSyntaxError at build time when else is missing from a non-empty array (D5)', () => {
    expect(() => buildSchedule(line, one(['trust >= 55 -> n1']))).toThrow(PredicateSyntaxError)
  })

  it('throws PredicateSyntaxError at build time on an unparseable line (D6)', () => {
    for (const bad of ['trust >= 55 and fear < 3 -> n1', 'trust ~ 55 -> n1', 'trust >= five -> n1', 'n1']) {
      expect(() => buildSchedule(line, one([bad, 'else -> n2'])), bad).toThrow(PredicateSyntaxError)
    }
  })

  it('rejects an else that is not the last line', () => {
    expect(() => buildSchedule(line, one(['else -> n1', 'trust >= 55 -> n2']))).toThrow(PredicateSyntaxError)
  })

  it('evaluates first-true, top to bottom', () => {
    const p = pack(
      [ev('x1', '09:00')],
      [
        gate('G1', '09:00', {
          buckets: [{ id: 'b1', stances: ['a'], deltas: { trust: 1 }, flags: {} }],
          edge_predicates: ['trust >= 10 -> high', 'trust >= 5 -> mid', 'else -> low'],
        }),
      ],
    )
    expect(rig(p, { trust: 20 }).driver.submitStance({ stance: 'a', utterance: '' }).nextNode).toBe('high')
    expect(rig(p, { trust: 5 }).driver.submitStance({ stance: 'a', utterance: '' }).nextNode).toBe('mid')
    expect(rig(p, { trust: 0 }).driver.submitStance({ stance: 'a', utterance: '' }).nextNode).toBe('low')
  })

  it('throws when the submitted stance resolves to no bucket', () => {
    const r = rig(trustPack(), { ...TRUST_SEED })
    expect(() => r.driver.submitStance({ stance: 'zzz', utterance: '' })).toThrow()
  })
})

/* ══ F4 · `availability` — a gate that is only asked on some branches ═══════ */

describe('[e3#F4] a gate is asked only where its availability holds', () => {
  /** Drives the whole pack, answering each ASKED gate with `stances[G]`. */
  function drive(r: ReturnType<typeof rig>, stances: Record<string, string>): void {
    for (;;) {
      const cur = r.driver.current()
      const g = r.schedule[cur.index]!.gate
      if (cur.kind === 'gate') {
        r.driver.submitStance({ stance: stances[g!.id] ?? g!.defaultStance, utterance: 'u' })
      }
      r.driver.applyBeatEffects()
      if (!r.driver.advance()) break
    }
  }

  it('skips the gate when the predicate does not hold — no Call 1, no stance', () => {
    const r = rig(availabilityPack())
    drive(r, { G1: 'a' }) // `a` leaves `opened` unset
    const judgments = r.driver.steps().filter((s) => s.kind === 'judgment')
    expect(judgments.map((s) => s.beat)).toEqual([0])
  })

  it('asks it on the branch that sets the flag — the gate is gated, not dead', () => {
    const r = rig(availabilityPack())
    drive(r, { G1: 'b' }) // `b` sets `opened`
    const judgments = r.driver.steps().filter((s) => s.kind === 'judgment')
    expect(judgments.map((s) => s.beat)).toEqual([0, 1])
  })

  it('reports the skipped beat as `script` through the cursor — that is what the caller reads', () => {
    const r = rig(availabilityPack())
    r.driver.submitStance({ stance: 'a', utterance: 'u' })
    r.driver.applyBeatEffects()
    r.driver.advance()
    // The SCHEDULE still holds it as a gate beat: round membership is assigned
    // there once, at build time, and a beat that changed kind mid-run would
    // renumber the rounds the reports are owed against.
    expect(r.schedule[1]!.kind).toBe('gate')
    expect(r.driver.current().kind).toBe('script')
    expect(r.driver.phase()).toBe('effects')
    expect(() => r.driver.gateView()).toThrow(BeatPhaseError)
    expect(() => r.driver.submitStance({ stance: 'a', utterance: 'u' })).toThrow(BeatPhaseError)
  })

  it('still owes and emits the skipped gate’s round report', () => {
    const r = rig(availabilityPack())
    drive(r, { G1: 'a' })
    const g2Round = r.schedule[1]!.roundIndex
    expect(g2Round).not.toBeNull()
    expect(r.driver.steps().some((s) => s.kind === 'report' && s.round === g2Round)).toBe(true)
  })

  it('un-hardened PROSE leaves the gate open — F4 is opt-in, and packs still carry it', () => {
    // A prose availability note says 특정 가지에서만. Reading that through `holds()` alone
    // would answer false and delete the gate from every run; `datapack:lint`
    // FLAGs it as hardening work instead, and the engine asks the gate.
    const r = rig(availabilityPack(true))
    drive(r, { G1: 'a' })
    expect(r.driver.steps().filter((s) => s.kind === 'judgment')).toHaveLength(2)
  })

  it('touches the state core only when there IS a predicate to resolve', () => {
    // Keeps §4.1's ordering chain (`ordering.test.ts`) measuring what it says:
    // a pack with no availability adds no read in front of the deltas.
    expect(rig(trustPack(), { ...TRUST_SEED }).state.ops()).toEqual([])
    expect(rig(availabilityPack(true)).state.ops()).toEqual([])
  })
})
