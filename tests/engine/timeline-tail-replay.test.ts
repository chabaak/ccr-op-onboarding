import { describe, expect, it } from 'vitest'

import { createEngine } from '../../src/engine/index.ts'
import { scriptedRound } from '../driver/engine-fixtures/pack.ts'

describe('timeline-tail replay safety net', () => {
  it('drops only the replay, preserving new entries and the round record', () => {
    const engine = createEngine({ pack: scriptedRound(), run: 1 })
    const replay = '남측 관측소의 신호가 끊겼다는 기록이 남는다.'
    const fresh = '창밖의 경광등이 젖은 유리에 번진다.'

    engine.submitBaseline()
    engine.applyBeatEffects()
    engine.applyNarration({
      event_lines: [{ id: 't1', text: '남측 관측소의 신호가 끊겼다고 기록했다.' }],
      timeline_entries: [replay],
      npc_lines: [],
    })
    expect(engine.advance()).toBe(true)

    engine.applyBeatEffects()
    engine.applyNarration({
      event_lines: [{ id: 't2', text: '실장이 회선을 열었다고 기록했다.' }],
      timeline_entries: [replay, fresh],
      npc_lines: [],
    })

    const current = engine.feed()
    expect(current.map((line) => line.text)).not.toContain(replay)
    const freshLine = current.find((line) => line.text === fresh)
    expect(freshLine?.sentence_id).toBe('b-r1-n02')
    expect(engine.roundView().EXPERIENCED).toEqual(
      expect.arrayContaining(['실장이 회선을 열었다고 기록했다.', fresh]),
    )
    expect(engine.roundView().EXPERIENCED.filter((line) => line === replay)).toHaveLength(1)
  })
})
