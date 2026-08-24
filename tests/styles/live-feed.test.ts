// [issue #130] LIVE FEED row geometry and tag/fallback styling.
import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { STYLES_DIR, TOKENS_CSS, customProps, read, ruleBodies } from './css-utils.ts'

const css = read(path.join(STYLES_DIR, 'win-live-feed.css'))
const tokens = customProps(read(TOKENS_CSS))
const body = (selector: RegExp): string => ruleBodies(css, selector).join(';').replace(/\s+/g, '')

describe('[issue #130] LIVE FEED feed rows', () => {
  it('(a) regular rows use the three-column stamp/tag/sentence grid', () => {
    const fl = body(/^\.fl$/)
    expect(fl).toContain('grid-template-columns:46px52pxminmax(0,1fr)')
    expect(fl).toContain('gap:var(--space-12)')
    expect(fl).toContain('padding:var(--space-9)0')
    expect(fl).toContain('border-bottom:1pxsolidvar(--surface-rule)')
  })

  it('(b) the tag column is visible text, not a content marker on the sentence', () => {
    expect(body(/^\.fl-k$/)).toContain('font-size:var(--fs-10)')
    expect(body(/^\.fl-k$/)).toContain('letter-spacing:.14em')
    expect(css).not.toContain('content:attr(data-mark)')
  })

  it('(c) fallback rows use the notice shape and keep warning on the glyph only', () => {
    expect(tokens.get('--fs-12-5')).toBe('15px')
    expect(body(/^\.fl-fallback$/)).toContain('grid-template-columns:46pxvar(--space-20)minmax(0,1fr)')
    expect(body(/^\.fl-fallback$/)).toContain('gap:var(--space-10)')
    expect(body(/^\.fl-fallback\s+\.fl-k$/)).toContain('color:var(--warning)')
    const content = body(/^\.fl-fallback\s+\.fl-c$/)
    expect(content).toContain('font-size:var(--fs-12-5)')
    expect(content).toContain('color:var(--surface-text)')
    expect(content).not.toContain('var(--warning)')
    expect(content).not.toContain('var(--signal)')
  })
})
