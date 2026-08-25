// [u1#c2] spec-client §8 porting rule + design-system surface contract.
//
// This test used to preserve five literal paper stocks. That concept is gone:
// the terminal has one shared window surface, and style-as-data still requires
// every surface, text tier, rule and accent to be declared in `tokens.css`.
import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { STYLES_DIR, TOKENS_CSS, customProps, read, ruleBodies } from './css-utils.ts'

const tokens = customProps(read(TOKENS_CSS))
const norm = (v: string): string => v.toLowerCase().replace(/\s+/g, '')
const unquote = (v: string): string => v.replace(/['"]/g, '').toLowerCase()

const SURFACE_TOKENS = [
  '--surface',
  '--surface-inset',
  '--surface-border',
  '--surface-rule',
]

const SURFACE_TEXT_TOKENS = [
  '--surface-text',
  '--surface-text-strong',
  '--surface-muted',
  '--surface-muted-2',
  '--surface-text-max',
  '--surface-text-heading',
  '--surface-text-1',
  '--surface-text-2',
  '--surface-text-3',
  '--surface-text-4',
  '--surface-text-5',
]

const ACCENT_TOKENS = [
  '--signal',
  '--warning',
  '--warning-strong',
  '--warning-wash',
]

const OLD_STOCK_TOKENS = [
  '--kraft',
  '--kraft-2',
  '--fanfold',
  '--fanfold-bar',
  '--bond',
  '--bond-2',
  '--ledger',
  '--card',
]

const OLD_STOCK_CLASSES = ['kraft', 'fanfold', 'bond', 'ledger', 'card-stock']
const FACE_TOKENS = ['--mono', '--prose']

function valueOf(name: string): string {
  return tokens.get(name) ?? ''
}

function declared(names: readonly string[]): string[] {
  return names.filter((name) => !tokens.has(name))
}

describe('[issue #107] shared surface tokens replace paper stocks', () => {
  it('(a) the new surface, rule, text and accent tokens are declared', () => {
    expect(declared([...SURFACE_TOKENS, ...SURFACE_TEXT_TOKENS, ...ACCENT_TOKENS])).toEqual([])
  })

  it('(b) retired paper stock tokens are not declared', () => {
    expect(OLD_STOCK_TOKENS.filter((name) => tokens.has(name))).toEqual([])
  })

  it('(c) paper.css owns one shared surface class and no stock classes', () => {
    const css = read(path.join(STYLES_DIR, 'paper.css'))
    expect(ruleBodies(css, /\.surface(?![\w-])/).length).toBeGreaterThan(0)
    const surviving = OLD_STOCK_CLASSES.filter(
      (cls) => ruleBodies(css, new RegExp(`\\.${cls}(?![\\w-])`)).length > 0,
    )
    expect(surviving).toEqual([])
  })

  it('(d) the shared surface class paints only through the surface token family', () => {
    const css = read(path.join(STYLES_DIR, 'paper.css'))
    const body = ruleBodies(css, /\.surface(?![\w-])/).join(';')
    expect(body).toContain('background:var(--surface)')
    expect(body).toContain('color:var(--surface-text)')
  })

  it('(e) the window registry no longer carries a stock field or stock values', () => {
    const src = read(path.join(path.dirname(STYLES_DIR), 'shell/window-registry.ts'))
    expect(src).not.toMatch(/\bstock\b/)
    expect(src).not.toMatch(/\b(kraft|fanfold|bond|ledger|card-stock)\b/)
  })

  it('(f) the window frame always installs the shared surface class', () => {
    const src = read(path.join(path.dirname(STYLES_DIR), 'components/window-frame.ts'))
    expect(src).toContain("'win-body surface'")
    expect(src).not.toMatch(/def\.stock/)
  })
})

describe('[issue #107] accents are named for terminal roles, not paper marks', () => {
  it('(a) signal and warning are separate token slots', () => {
    expect(tokens.has('--signal')).toBe(true)
    expect(tokens.has('--warning')).toBe(true)
    expect(norm(valueOf('--signal'))).not.toBe(norm(valueOf('--warning')))
  })

  it('(b) warning colours remain tokenized', () => {
    for (const name of ['--warning', '--warning-strong', '--warning-wash']) {
      expect(valueOf(name), `${name} is empty`).not.toBe('')
    }
  })
})

describe('[u1#c2] the two-face type system survives', () => {
  it.each(FACE_TOKENS)('(a) %s is declared in tokens.css', (name) => {
    expect(tokens.has(name)).toBe(true)
  })

  it('(b) each face token keeps its family stack', () => {
    expect(unquote(valueOf('--mono'))).toContain('ibm plex mono')
    expect(unquote(valueOf('--mono'))).toContain('nanum gothic coding')
    expect(unquote(valueOf('--prose'))).toContain('ibm plex sans kr')
  })

  it('(c) each face token ends in a generic fallback family', () => {
    const bad = FACE_TOKENS.filter((name) => !/(monospace|serif|sans-serif)\s*$/.test(valueOf(name)))
    expect(bad).toEqual([])
  })
})
