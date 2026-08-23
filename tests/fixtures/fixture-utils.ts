// [u2f] shared readers for the fixture suite.
//
// Structural idiom of this repo (see tests/driver/import-direction.test.ts):
// tests read the repo from disk with `node:fs` and import product modules only
// through their public specifier. Nothing here imports a `woodari-*` module —
// each test file does that itself, so a missing module fails the test that
// depends on it rather than the whole suite's helpers.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { FeedLine, Sentence, ViewEvent } from '../../src/shared/view-driver.ts'

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const FIXTURE_DIR = path.join(REPO, 'src/client/driver/fixtures')

export const nfc = (s: string): string => s.normalize('NFC')

export const HANGUL = /[가-힣ᄀ-ᇿ㄰-㆏]/

/* --- unit sources ---------------------------------------------------------- */

/** Pre-existing fixture modules this unit must not be measured against (C3). */
export const PRE_EXISTING = new Set(['types.ts', 'minimal.ts'])

export interface UnitSource {
  rel: string
  base: string
  text: string
}

/** Every fixture module this unit introduces (`woodari-*`, `mint`, `index`). */
export function unitSources(): UnitSource[] {
  if (!fs.existsSync(FIXTURE_DIR)) return []
  return fs
    .readdirSync(FIXTURE_DIR)
    .filter((e) => e.endsWith('.ts') && !PRE_EXISTING.has(e))
    .sort()
    .map((base) => ({
      base,
      rel: `src/client/driver/fixtures/${base}`,
      text: fs.readFileSync(path.join(FIXTURE_DIR, base), 'utf8'),
    }))
}

const LITERAL_RE = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g

/** String literals of a TS source, with escapes decoded. Comments stripped. */
export function stringLiterals(source: string): string[] {
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
  const out: string[] = []
  for (const m of code.matchAll(LITERAL_RE)) {
    const raw = m[1] ?? m[2] ?? m[3]
    if (raw === undefined) continue
    out.push(
      raw
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\`/g, '`')
        .replace(/\\\\/g, '\\'),
    )
  }
  return out
}

/* --- stream readers -------------------------------------------------------- */

export const minutes = (clock: string): number => {
  const m = /^(\d{2}):(\d{2})$/.exec(clock)
  if (!m) throw new Error(`not an HH:MM clock: ${JSON.stringify(clock)}`)
  return Number(m[1]) * 60 + Number(m[2])
}

export const feedLines = (events: readonly ViewEvent[]): FeedLine[] =>
  events.flatMap((e) => (e.type === 'feed' ? [e.line] : []))

export interface BeatSlice {
  beat: number
  start: string
  end: string
  lines: FeedLine[]
}

/** Fold the stream into beats. Throws on an unpaired / nested beat marker. */
export function beatsOf(events: readonly ViewEvent[]): BeatSlice[] {
  const out: BeatSlice[] = []
  let open: BeatSlice | null = null
  for (const e of events) {
    if (e.type === 'beat_start') {
      if (open) throw new Error(`beat ${e.beat} opened while beat ${open.beat} is still open`)
      open = { beat: e.beat, start: e.clock, end: '', lines: [] }
    } else if (e.type === 'beat_end') {
      if (!open) throw new Error(`beat_end ${e.beat} with no open beat`)
      if (open.beat !== e.beat) throw new Error(`beat_end ${e.beat} closes beat ${open.beat}`)
      open.end = e.clock
      out.push(open)
      open = null
    } else if (e.type === 'feed' && open) {
      open.lines.push(e.line)
    }
  }
  if (open) throw new Error(`beat ${open.beat} never closed`)
  return out
}

/** Feed events that are not inside a beat. */
export function orphanFeedLines(events: readonly ViewEvent[]): FeedLine[] {
  const out: FeedLine[] = []
  let depth = 0
  for (const e of events) {
    if (e.type === 'beat_start') depth += 1
    else if (e.type === 'beat_end') depth -= 1
    else if (e.type === 'feed' && depth === 0) out.push(e.line)
  }
  return out
}

export interface IdentifiedText {
  id: string
  text: string
  where: string
}

/** Every `Sentence` the stream carries, tagged with where it was found. */
export function streamSentences(events: readonly ViewEvent[]): (Sentence & { where: string })[] {
  const out: (Sentence & { where: string })[] = []
  for (const e of events) {
    if (e.type !== 'report') continue
    for (const s of e.facts) out.push({ ...s, where: `report(round ${e.round}).facts` })
    for (const s of e.report_body) out.push({ ...s, where: `report(round ${e.round}).report_body` })
  }
  return out
}

/** Every minable feed line: `sentence_id` set ⇢ minable (view-driver seam). */
export function minableLines(events: readonly ViewEvent[]): IdentifiedText[] {
  return feedLines(events)
    .filter((l) => typeof l.sentence_id === 'string' && l.sentence_id.length > 0)
    .map((l) => ({ id: l.sentence_id as string, text: l.text, where: `feed ${l.kind} ${l.clock}` }))
}

/** Every human-visible string the stream renders. */
export function streamTexts(events: readonly ViewEvent[]): string[] {
  const out: string[] = []
  for (const e of events) {
    switch (e.type) {
      case 'feed':
        out.push(e.line.text)
        if (e.line.speaker) out.push(e.line.speaker)
        break
      case 'report':
        for (const s of [...e.facts, ...e.report_body]) {
          out.push(s.text)
          if (s.axis) out.push(s.axis)
        }
        break
      case 'score':
        for (const r of e.rows) out.push(r.label)
        break
      case 'meta':
        for (const a of e.archive) out.push(a.label)
        break
      default:
        break
    }
  }
  return out
}
