// Issue 133 — the shared notice plate.
//
// This pins the object #135 and #136 are meant to apply: three named bands,
// a lead plus muted lines, signal buttons, and exactly one warning hook for the
// two irreversible notices. It reads CSS and source from disk only.
import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { REPO, STYLES_DIR, read, ruleBodies, scannable } from './css-utils.ts'

const CONFIRM_CSS = path.join(STYLES_DIR, 'confirm.css')
const WIN_MANUAL_CSS = path.join(STYLES_DIR, 'win-manual.css')
const WIN_ENDING_CSS = path.join(STYLES_DIR, 'win-ending.css')
const CONFIRM_TS = path.join(REPO, 'src/client/shell/confirm.ts')
const MANUAL_TS = path.join(REPO, 'src/client/shell/manual.ts')
const ENDING_TS = path.join(REPO, 'src/client/shell/ending.ts')

function decl(cssPath: string, selector: string, prop: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const bodies = ruleBodies(read(cssPath), new RegExp(`^${escaped}$`))
  expect(bodies.length, `${path.basename(cssPath)} has no rule for '${selector}'`).toBeGreaterThan(0)
  const hits = [...bodies.join(';').matchAll(new RegExp(`(?:^|[;{\\s])${prop}\\s*:\\s*([^;}]+)`, 'g'))]
  expect(hits.length, `'${selector}' declares no ${prop}`).toBeGreaterThan(0)
  return hits[hits.length - 1]![1]!.trim()
}

function noticeWarningSelectors(): string[] {
  return [...scannable(read(CONFIRM_CSS)).matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter((m) => m[1]!.includes('notice') && m[2]!.includes('var(--warning)'))
    .map((m) => m[1]!.replace(/\s+/g, ' ').trim())
}

function noticeFootBlock(source: string): string {
  const match = /const foot = el\('div', 'cf-foot notice-foot'\)[\s\S]*?plate\.append/.exec(source)
  expect(match, 'source does not build a notice foot').not.toBeNull()
  return match![0]!
}

describe('[issue 133] the notice object has one reusable class family', () => {
  it('(a) confirm, manual, and ending apply the notice classes while keeping compatibility hooks', () => {
    expect(read(CONFIRM_TS)).toMatch(/cf-plate notice-plate/)
    expect(read(CONFIRM_TS)).toMatch(/cf-plate-hd notice-head/)
    expect(read(CONFIRM_TS)).toMatch(/cf-body notice-body/)
    expect(read(CONFIRM_TS)).toMatch(/cf-ask notice-lead/)
    expect(read(CONFIRM_TS)).toMatch(/cf-note notice-line/)
    expect(read(CONFIRM_TS)).toMatch(/cf-btn cf-yes notice-btn notice-primary/)

    expect(read(MANUAL_TS)).toMatch(/cf-plate notice-plate man-plate/)
    expect(read(MANUAL_TS)).toMatch(/cf-plate-hd notice-head/)
    expect(read(MANUAL_TS)).toMatch(/cf-body notice-body/)
    expect(read(MANUAL_TS)).toMatch(/cf-ask notice-lead/)
    expect(read(MANUAL_TS)).toMatch(/cf-note notice-line/)

    expect(read(ENDING_TS)).toMatch(/cf-plate notice-plate notice-fullscreen end-plate/)
    expect(read(ENDING_TS)).toMatch(/cf-plate-hd notice-head/)
    expect(read(ENDING_TS)).toMatch(/cf-body notice-body/)
    expect(read(ENDING_TS)).toMatch(/cf-ask notice-lead/)
    expect(read(ENDING_TS)).toMatch(/cf-note notice-line/)
    expect(read(ENDING_TS)).toMatch(/cf-btn cf-yes notice-btn notice-primary end-go/)
  })

  it('(b) the plate and its three bands match the Notices prototype geometry', () => {
    expect(decl(CONFIRM_CSS, '.notice-plate', 'width')).toBe('520px')
    expect(decl(CONFIRM_CSS, '.notice-plate.notice-fullscreen', 'width')).toBe('640px')
    expect(decl(CONFIRM_CSS, '.notice-head', 'padding')).toBe(
      'var(--space-11) var(--space-20) var(--space-10)',
    )
    expect(decl(CONFIRM_CSS, '.notice-head', 'border-bottom')).toBe('1px solid var(--ink-line)')
    expect(decl(CONFIRM_CSS, '.notice-body', 'padding')).toBe(
      'var(--space-20) var(--space-20) var(--space-18)',
    )
    expect(decl(CONFIRM_CSS, '.notice-body', 'gap')).toBe('var(--space-12)')
    expect(decl(CONFIRM_CSS, '.notice-foot', 'padding')).toBe('var(--space-7) var(--space-20)')
    expect(decl(CONFIRM_CSS, '.notice-foot', 'border-top')).toBe('1px solid var(--ink-line)')
  })

  it('(c) the body uses the design-lane type tokens, not raw font sizes', () => {
    expect(decl(CONFIRM_CSS, '.notice-lead', 'font-size')).toBe('var(--fs-17)')
    expect(decl(CONFIRM_CSS, '.notice-lead', 'line-height')).toBe('1.5')
    expect(decl(CONFIRM_CSS, '.notice-lead', 'color')).toBe('var(--surface-text)')
    expect(decl(CONFIRM_CSS, '.notice-fullscreen .notice-lead', 'font-size')).toBe('var(--fs-21)')

    expect(decl(CONFIRM_CSS, '.notice-line', 'font-size')).toBe('var(--fs-13)')
    expect(decl(CONFIRM_CSS, '.notice-line', 'line-height')).toBe('1.85')
    expect(decl(CONFIRM_CSS, '.notice-line', 'color')).toBe('var(--surface-muted)')
    expect(decl(WIN_MANUAL_CSS, '.man-plate.notice-plate .notice-line', 'font-size')).toBe('var(--fs-13)')
  })

  it('(d) buttons stay signal-blue; warning is only the irreversible accent hook', () => {
    expect(decl(CONFIRM_CSS, '.notice-btn', 'padding')).toBe('var(--space-6) var(--space-13)')
    expect(decl(CONFIRM_CSS, '.notice-btn', 'font-size')).toBe('var(--fs-10)')
    expect(decl(CONFIRM_CSS, '.notice-btn', 'background')).toBe('var(--signal)')
    expect(decl(CONFIRM_CSS, '.notice-btn', 'border')).toBe('1px solid var(--signal)')
    expect(decl(CONFIRM_CSS, '.notice-secondary', 'background')).toBe('transparent')

    expect(noticeWarningSelectors()).toEqual(['.notice-accent .notice-kind, .notice-accent .notice-meta'])
    expect(read(CONFIRM_TS)).toMatch(/배치 확인/)
    expect(read(CONFIRM_TS)).toMatch(/시행 중단/)
    expect(read(MANUAL_TS)).not.toMatch(/notice-accent/)
    expect(read(ENDING_TS)).not.toMatch(/notice-accent/)
    expect(decl(WIN_ENDING_CSS, '.end-plate .notice-kind', 'color')).toBe('var(--signal)')
    expect(decl(WIN_ENDING_CSS, '.end-plate .notice-meta', 'color')).toBe('var(--surface-muted-2)')
    expect(scannable(read(WIN_ENDING_CSS))).not.toMatch(/var\(--warning|var\(--alert|var\(--good/)
  })

  it('[issue 192] the footer wraps without breaking button labels', () => {
    expect(decl(CONFIRM_CSS, '.notice-foot', 'flex-wrap')).toBe('wrap')
    expect(decl(CONFIRM_CSS, '.notice-foot', 'gap')).toBe('var(--space-7) var(--space-10)')

    expect(decl(CONFIRM_CSS, '.notice-actions', 'flex')).toBe('0 0 auto')

    expect(decl(CONFIRM_CSS, '.notice-btn', 'flex')).toBe('0 0 auto')
    expect(decl(CONFIRM_CSS, '.notice-btn', 'white-space')).toBe('nowrap')
  })

  it('[issue 205] the notice footer has no text-bearing children', () => {
    const offenders: string[] = []
    for (const [family, source] of [
      ['confirm', read(CONFIRM_TS)],
      ['manual', read(MANUAL_TS)],
      ['ending', read(ENDING_TS)],
    ] as const) {
      const foot = noticeFootBlock(source)
      if (/cf-note|notice-line|notice-footnote/.test(foot)) offenders.push(`${family}: notice text node`)
      if (/copy\.note/.test(foot)) offenders.push(`${family}: copy.note`)
    }

    if (/footnote\.textContent/.test(read(ENDING_TS))) offenders.push('ending: changing footer text')
    expect(offenders).toEqual([])
  })
})
