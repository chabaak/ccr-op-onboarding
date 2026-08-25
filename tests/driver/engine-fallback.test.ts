// [e7#A5] — a failed call is an EVENT, and the run keeps going.
//
// Two halves, and both matter:
//
//   1. the seam shape — one `fallback` per failed call, emitted INSIDE that
//      call's `waiting` bracket (spec decision 5), so the client can reword the
//      pause before it clears;
//   2. the recovery — which is the ENGINE's, never the driver's (spec-engine
//      §5). The driver branches once, on `result.ok`, and hands the engine
//      `null`. It does not know what a default stance is, and `gateView()` does
//      not expose one; that asymmetry is the whole argument for where recovery
//      lives.
//
// e6 owns the retry budget (one retry, two attempts), so the driver sees one
// resolved outcome per call and emits at most one `fallback` for it.
import { describe, it, expect } from 'vitest'
import type { ViewEvent } from '../../src/shared/view-driver.ts'
import { UNUSABLE_PAYLOAD_CODE } from '../../src/driver/index.ts'
import {
  createRecorder,
  drain,
  failingTransport,
  feedLines,
  makeRig,
  rawBodyTransport,
  recordEngine,
  sentinelJudgment,
  shape,
  unusableTransport,
} from './engine-fixtures/rig.ts'
import { scriptedRound, twoRounds } from './engine-fixtures/pack.ts'

function fallbacks(events: ViewEvent[]): Extract<ViewEvent, { type: 'fallback' }>[] {
  return events.flatMap((event) => (event.type === 'fallback' ? [event] : []))
}

function authoredFeed(events: ViewEvent[]): { id: string; text: string }[] {
  return feedLines(events)
    .filter((line) => line.kind === 'event' && line.sentence_id?.startsWith('t'))
    .map((line) => ({ id: line.sentence_id!, text: line.text }))
}

function twoEventBeat() {
  const pack = scriptedRound()
  return {
    ...pack,
    timeline: {
      events: pack.timeline.events.map((event) => ({ ...event, time: '09:00' })),
    },
  }
}

describe('[e7#A5] Call 1 fails', () => {
  it('(a) one `fallback{call:1}` lands between the judgment bracket’s two edges', async () => {
    const events = await drain(makeRig({ shaped: true, transport: failingTransport('judgment') }))
    expect(shape(events).slice(0, 4)).toEqual([
      'beat_start',
      'waiting:judgment:on',
      'fallback:1',
      'waiting:judgment:off',
    ])
    expect(fallbacks(events)).toEqual([{ type: 'fallback', call: 1, code: 'LLM_TIMEOUT', beat: 0 }])
  })

  it('(b) the run continues — `step()` still resolves true and the run reaches `run_end`', async () => {
    const rig = makeRig({ shaped: true, transport: failingTransport('judgment') })
    expect(await rig.driver.step()).toBe(true)
    const events = await drain(rig)
    expect(events.filter((event) => event.type === 'run_end').length).toBe(1)
  })

  it('(c) the engine substituted the authored default stance, so no utterance was minted', async () => {
    const events = await drain(makeRig({ shaped: true, transport: failingTransport('judgment') }))
    // The `u` channel is minted from Call 1's utterance and from nothing else;
    // a substituted stance carries no line, so the radio row is absent.
    expect(feedLines(events).filter((line) => line.kind === 'radio')).toEqual([])
    // …and the round still closed, which it could not have without a stance.
    expect(events.filter((event) => event.type === 'report').length).toBe(1)
  })
})

describe('[e7#A5] Call 2 fails', () => {
  it('(a) one `fallback{call:2}` per beat, inside that beat’s narration bracket', async () => {
    const events = await drain(makeRig({ shaped: true, transport: failingTransport('narration') }))
    expect(fallbacks(events).map((event) => event.call)).toEqual([2, 2])
    const beat = shape(events).slice(0, 9)
    expect(beat).toEqual([
      'beat_start',
      'waiting:judgment:on',
      'waiting:judgment:off',
      'feed:radio',
      'feed:symptom',
      'waiting:narration:on',
      'fallback:2',
      'waiting:narration:off',
      'feed:event',
    ])
  })

  it('(b) zero `n`/`q` lines that beat; fallback renders authored `t*` text verbatim', async () => {
    const events = await drain(makeRig({ shaped: true, transport: failingTransport('narration') }))
    const lines = feedLines(events)
    const minted = lines.flatMap((line) => (line.sentence_id ?? '').match(/-([nq])\d+$/) ?? [])
    expect(minted).toEqual([])
    expect(lines.map((line) => line.kind)).toEqual([
      'radio',
      'symptom',
      'event',
      'symptom',
      'event',
    ])
    const fallbackEvents = lines.filter((line) => line.kind === 'event')
    expect(fallbackEvents.map((line) => line.sentence_id)).toEqual(['t1', 't2'])
    expect(fallbackEvents.map((line) => line.text)).toEqual([
      '남측 관측소가 신호를 놓쳤다.',
      '실장이 회선을 열었다.',
    ])
  })
})

describe('[#97] Call 2 repairs imperfect event_lines instead of dropping the beat', () => {
  it('(a) missing event lines render the authored text under the authored id', async () => {
    const events = await drain(
      makeRig({
        shaped: true,
        responses: {
          narration: { event_lines: [], timeline_entries: ['모델이 후속 기록을 남겼다.'], npc_lines: [] },
        },
      }),
    )

    expect(fallbacks(events).filter((event) => event.call === 2)).toEqual([])
    expect(authoredFeed(events)).toEqual([
      { id: 't1', text: '남측 관측소가 신호를 놓쳤다.' },
      { id: 't2', text: '실장이 회선을 열었다.' },
    ])
  })

  it('(b) an extra duplicate entry does not duplicate the rendered authored event', async () => {
    const events = await drain(
      makeRig({
        shaped: true,
        responses: {
          narration: {
            event_lines: [
              { id: 't1', text: '모델이 남측 관측소 신호 이탈을 기록했다.' },
              { id: 't1', text: '중복된 t1 기록은 버려져야 한다.' },
            ],
            timeline_entries: ['모델이 후속 기록을 남겼다.'],
            npc_lines: [],
          },
        },
      }),
    )

    expect(fallbacks(events).filter((event) => event.call === 2)).toEqual([])
    expect(authoredFeed(events)).toEqual([
      { id: 't1', text: '모델이 남측 관측소 신호 이탈을 기록했다.' },
      { id: 't2', text: '실장이 회선을 열었다.' },
    ])
    expect(JSON.stringify(feedLines(events))).not.toContain('중복된 t1 기록')
  })

  it('(c) returned order is ignored; authored order is the rendered order', async () => {
    const events = await drain(
      makeRig({
        shaped: true,
        pack: twoEventBeat(),
        responses: {
          narration: {
            event_lines: [
              { id: 't2', text: '모델이 실장 회선 개방을 먼저 적었다.' },
              { id: 't1', text: '모델이 관측소 신호 이탈을 나중에 적었다.' },
            ],
            timeline_entries: ['모델이 후속 기록을 남겼다.'],
            npc_lines: [],
          },
        },
      }),
    )

    expect(fallbacks(events).filter((event) => event.call === 2)).toEqual([])
    expect(authoredFeed(events)).toEqual([
      { id: 't1', text: '모델이 관측소 신호 이탈을 나중에 적었다.' },
      { id: 't2', text: '모델이 실장 회선 개방을 먼저 적었다.' },
    ])
  })

  it('(d) unknown ids are dropped and the missing authored event is filled from the script', async () => {
    const events = await drain(
      makeRig({
        shaped: true,
        pack: twoEventBeat(),
        responses: {
          narration: {
            event_lines: [
              { id: 't-unknown', text: '없는 사건이 끼어들었다.' },
              { id: 't2', text: '모델이 실장 회선 개방을 기록했다.' },
            ],
            timeline_entries: ['모델이 후속 기록을 남겼다.'],
            npc_lines: [],
          },
        },
      }),
    )

    expect(fallbacks(events).filter((event) => event.call === 2)).toEqual([])
    expect(authoredFeed(events)).toEqual([
      { id: 't1', text: '남측 관측소가 신호를 놓쳤다.' },
      { id: 't2', text: '모델이 실장 회선 개방을 기록했다.' },
    ])
    expect(JSON.stringify(feedLines(events))).not.toContain('없는 사건')
  })

  it('(e) wrong response shape still falls back before the engine repairs content', async () => {
    const events = await drain(
      makeRig({
        shaped: true,
        transport: rawBodyTransport('narration', {
          event_lines: 'not an array',
          timeline_entries: ['모델이 후속 기록을 남겼다.'],
          npc_lines: [],
        }),
      }),
    )

    expect(fallbacks(events).filter((event) => event.call === 2)).toEqual([
      { type: 'fallback', call: 2, code: UNUSABLE_PAYLOAD_CODE, beat: 0 },
      { type: 'fallback', call: 2, code: UNUSABLE_PAYLOAD_CODE, beat: 1 },
    ])
    expect(authoredFeed(events)).toEqual([
      { id: 't1', text: '남측 관측소가 신호를 놓쳤다.' },
      { id: 't2', text: '실장이 회선을 열었다.' },
    ])
  })

  it('(f) a non-object response body still falls back before the engine repairs content', async () => {
    const events = await drain(
      makeRig({
        shaped: true,
        transport: rawBodyTransport('narration', 'not an object'),
      }),
    )

    expect(fallbacks(events).filter((event) => event.call === 2)).toEqual([
      { type: 'fallback', call: 2, code: UNUSABLE_PAYLOAD_CODE, beat: 0 },
      { type: 'fallback', call: 2, code: UNUSABLE_PAYLOAD_CODE, beat: 1 },
    ])
    expect(authoredFeed(events)).toEqual([
      { id: 't1', text: '남측 관측소가 신호를 놓쳤다.' },
      { id: 't2', text: '실장이 회선을 열었다.' },
    ])
  })

  it('(g) repaired narration keeps Call 3 fed without changing reporter scope', async () => {
    const events = await drain(
      makeRig({
        shaped: true,
        responses: {
          narration: { event_lines: [], timeline_entries: ['모델이 후속 기록을 남겼다.'], npc_lines: [] },
        },
      }),
    )
    const reports = events.flatMap((event) => (event.type === 'report' ? [event] : []))

    expect(fallbacks(events).filter((event) => event.call === 3)).toEqual([])
    expect(reports).toHaveLength(1)
    expect(reports[0]!.facts.map((sentence) => sentence.text)).toEqual(
      expect.arrayContaining(['남측 관측소가 신호를 놓쳤다.', '실장이 회선을 열었다.']),
    )
  })
})

describe('[e7#A5] Call 3 fails', () => {
  it('(a) one `fallback{call:3}` per round, inside that round’s report bracket', async () => {
    const events = await drain(makeRig({ shaped: true, pack: twoRounds(), transport: failingTransport('reporter') }))
    expect(fallbacks(events).map((event) => event.call)).toEqual([3, 3])
    const tokens = shape(events)
    const at = tokens.indexOf('fallback:3')
    expect(tokens.slice(at - 1, at + 3)).toEqual([
      'waiting:report:on',
      'fallback:3',
      'waiting:report:off',
      'report',
    ])
  })

  it('(b) the run continues past a failed round report', async () => {
    const rig = makeRig({ shaped: true, pack: twoRounds(), transport: failingTransport('reporter') })
    expect(await rig.driver.step()).toBe(true)
    // Beat 1 closes round 0 and its Call 3 fails; the run must not end there.
    expect(await rig.driver.step()).toBe(true)
  })

  it('(c) `facts` are non-empty from the objective log and `report_body` is the substitute', async () => {
    const events = await drain(makeRig({ shaped: true, transport: failingTransport('reporter') }))
    const reports = events.flatMap((event) => (event.type === 'report' ? [event] : []))
    expect(reports.length).toBe(1)
    const report = reports[0]
    expect(report?.facts.length).toBeGreaterThan(0)
    // The objective log — assembled round events — not model output.
    expect(report?.facts.map((sentence) => sentence.text)).toContain('남측 관측소가 신호를 놓쳤다.')
    expect(report?.report_body.length).toBeGreaterThan(0)
    for (const sentence of report?.report_body ?? []) expect(sentence.text.length).toBeGreaterThan(0)
    // Still engine-minted, on their own channels — a substitute is not an excuse
    // to emit an unminable sentence.
    expect(report?.facts.every((s) => /-f\d+$/.test(s.id))).toBe(true)
    expect(report?.report_body.every((s) => /-b\d+$/.test(s.id))).toBe(true)
  })

  // The objective log is NOT `EXPERIENCED`. §5's Call 3 row and contract §5's
  // input table are two different audiences: the prompt gets the `inner_note`,
  // the player's `f` channel does not (call contracts §6, "never shown to the
  // player directly"). Before this guard, a Call 3 fallback minted the note as
  // `facts` with NO model in the loop at all.
  it('(d) the objective log withholds this round’s `inner_note` — it is not Call 3’s prompt', async () => {
    const events = await drain(
      makeRig({
        shaped: true,
        transport: failingTransport('reporter', 'LLM_TIMEOUT', { judgment: sentinelJudgment() }),
      }),
    )
    const reports = events.flatMap((event) => (event.type === 'report' ? [event] : []))
    expect(reports.length).toBe(1)
    const texts = reports[0]!.facts.map((sentence) => sentence.text)

    expect(texts.filter((text) => text.includes('SENTINEL-INNER-NOTE'))).toEqual([])
    expect(JSON.stringify(events)).not.toContain('SENTINEL-INNER-NOTE')
    // Not vacuous: the SAME Call 1's utterance and the round's script events did
    // reach the log, so this is a withheld line and not an empty assembly.
    expect(texts.some((text) => text.includes('기록을 남긴다.'))).toBe(true)
    expect(texts).toContain('남측 관측소가 신호를 놓쳤다.')
  })
})

// [#116 finding D] — `!result.ok` is not the only way a call fails. A 200 whose
// body is missing the one field the call exists to produce reaches the engine as
// the SAME `null`, and the engine's §5 recovery runs identically — but before
// this, nothing was emitted for it, so the run record's `fallbacks` stayed empty
// and thereby asserted that the model had judged a gate it never judged.
describe('[#116 D] a call that lands unusable is a fallback too', () => {
  it('(a) a 200 judgment with no `stance` emits fallback{call:1} inside the bracket', async () => {
    const events = await drain(makeRig({ shaped: true, transport: unusableTransport('judgment', 'stance') }))
    expect(shape(events).slice(0, 4)).toEqual([
      'beat_start',
      'waiting:judgment:on',
      'fallback:1',
      'waiting:judgment:off',
    ])
    expect(fallbacks(events)).toEqual([
      { type: 'fallback', call: 1, code: UNUSABLE_PAYLOAD_CODE, beat: 0 },
    ])
  })

  it('(b) the engine got `null` AND the stream said so — the two records agree', async () => {
    const recorder = createRecorder()
    const rig = makeRig({
      shaped: true,
      transport: unusableTransport('judgment', 'stance'),
      wrapEngine: (engine) => recordEngine(engine, recorder),
    })
    const events = await drain(rig)
    const submitted = recorder.log
      .filter((entry) => entry.name === 'engine.submitStance')
      .map((entry) => entry.value)

    // The bug was exactly this pair disagreeing: `[null]` with `[]`.
    expect(submitted).toEqual([null])
    expect(fallbacks(events).length).toBe(1)
    // …and the recovery is unchanged: a substituted stance mints no `u` line.
    expect(feedLines(events).filter((line) => line.kind === 'radio')).toEqual([])
  })

  it('(c) the code is the driver’s own, not a status code borrowed from the wire', async () => {
    const events = await drain(makeRig({ shaped: true, transport: unusableTransport('judgment', 'stance') }))
    expect(fallbacks(events).map((event) => event.code)).toEqual([UNUSABLE_PAYLOAD_CODE])
    expect(UNUSABLE_PAYLOAD_CODE).not.toBe('LLM_TIMEOUT')
  })

  it('(d) the same holds for Call 2 — one per beat, and no `n`/`q` lines that beat', async () => {
    const events = await drain(
      makeRig({ shaped: true, transport: unusableTransport('narration', 'timeline_entries') }),
    )
    expect(fallbacks(events).map((event) => event.call)).toEqual([2, 2])
    const minted = feedLines(events).flatMap((line) => (line.sentence_id ?? '').match(/-[nq]\d+$/) ?? [])
    expect(minted).toEqual([])
  })

  it('(e) the same holds for Call 3 — the substitute body, not a silent empty report', async () => {
    const events = await drain(
      makeRig({ shaped: true, transport: unusableTransport('reporter', 'report_body') }),
    )
    expect(fallbacks(events).map((event) => event.call)).toEqual([3])
    const reports = events.flatMap((event) => (event.type === 'report' ? [event] : []))
    expect(reports.length).toBe(1)
    expect(reports[0]!.report_body.length).toBeGreaterThan(0)
  })

  it('(f) a present-but-empty reporter body is still unusable and reaches the engine as null', async () => {
    const recorder = createRecorder()
    const events = await drain(
      makeRig({
        shaped: true,
        transport: rawBodyTransport('reporter', { facts: ['모델이 사실을 남겼다.'], report_body: '' }),
        wrapEngine: (engine) => recordEngine(engine, recorder),
      }),
    )

    expect(
      recorder.log.filter((entry) => entry.name === 'engine.applyReport').map((entry) => entry.value),
    ).toEqual([null])
    expect(fallbacks(events).filter((event) => event.call === 3)).toEqual([
      { type: 'fallback', call: 3, code: UNUSABLE_PAYLOAD_CODE, beat: 1 },
    ])
    const reports = events.flatMap((event) => (event.type === 'report' ? [event] : []))
    expect(reports).toHaveLength(1)
    expect(reports[0]!.report_body.length).toBeGreaterThan(0)
  })

  it('(g) a markdown-only reporter body is judged after segmentation and uses the substitute', async () => {
    const recorder = createRecorder()
    const events = await drain(
      makeRig({
        shaped: true,
        transport: rawBodyTransport('reporter', { facts: ['모델이 사실을 남겼다.'], report_body: '#\n- \n1.   ' }),
        wrapEngine: (engine) => recordEngine(engine, recorder),
      }),
    )

    expect(
      recorder.log.filter((entry) => entry.name === 'engine.applyReport').map((entry) => entry.value),
    ).toEqual([null])
    expect(fallbacks(events).filter((event) => event.call === 3)).toEqual([
      { type: 'fallback', call: 3, code: UNUSABLE_PAYLOAD_CODE, beat: 1 },
    ])
    const reports = events.flatMap((event) => (event.type === 'report' ? [event] : []))
    expect(reports).toHaveLength(1)
    expect(reports[0]!.report_body.length).toBeGreaterThan(0)
  })

  it('(h) a well-formed run emits none of these — the guard is not firing on success', async () => {
    const events = await drain(makeRig({ shaped: true, pack: twoRounds() }))
    expect(fallbacks(events)).toEqual([])
  })

  it('(i) every `waiting` is still paired when the unusable payload arrives', async () => {
    const events = await drain(makeRig({ shaped: true, transport: unusableTransport('judgment', 'stance') }))
    const edges = events.flatMap((e) => (e.type === 'waiting' && e.for === 'judgment' ? [e.active] : []))
    expect(edges).toEqual([true, false])
  })
})

describe('[e7#A5] the bracket survives the failure path (A4 on the fallback path)', () => {
  it('(a) every `waiting` is still paired when every call fails', async () => {
    const events = await drain(makeRig({ shaped: true, pack: twoRounds(), transport: failingTransport() }))
    for (const label of ['judgment', 'narration', 'report'] as const) {
      const edges = events.flatMap((e) => (e.type === 'waiting' && e.for === label ? [e.active] : []))
      expect(edges.length).toBeGreaterThan(0)
      expect(edges).toEqual(edges.map((_, index) => index % 2 === 0))
    }
  })

  it('(b) exactly one `fallback` per call — the retry budget is e6’s, not the driver’s', async () => {
    const transport = failingTransport()
    const events = await drain(makeRig({ pack: twoRounds(), transport }))
    expect(fallbacks(events).length).toBe(transport.sent.length)
  })
})
