// [#171] — Call 3 output that segments to no report-body sentences is the same
// recovery path as a missing Call 3 response.
import { describe, expect, it } from 'vitest'
import { createEngine, SUBSTITUTE_REPORT_BODY } from '../../src/engine/index.ts'
import { segmentReportBody } from '../../src/shared/segment.ts'
import { scriptedRound } from '../driver/engine-fixtures/pack.ts'

function engineAtReportBoundary() {
  const engine = createEngine({ pack: scriptedRound(), run: 1 })

  engine.submitStance(null)
  engine.applyBeatEffects()
  engine.applyNarration(null)

  return engine
}

describe('[#171] engine reporter recovery', () => {
  it.each([
    ['empty', ''],
    ['markdown-only', '#\n- \n1.   '],
  ])('(%s) uses objective facts and the substitute body when report_body segments to nothing', (_label, reportBody) => {
    const report = engineAtReportBoundary().applyReport({
      facts: ['모델이 남긴 사실은 쓰지 않는다.'],
      report_body: reportBody,
    })

    expect(report.facts.map((sentence) => sentence.text)).toContain('남측 관측소가 신호를 놓쳤다.')
    expect(report.facts.map((sentence) => sentence.text)).not.toContain('모델이 남긴 사실은 쓰지 않는다.')
    expect(report.report_body.map((sentence) => sentence.text)).toEqual(segmentReportBody(SUBSTITUTE_REPORT_BODY))
  })
})
