// Issue #10: the manifest baseline now describes the submitted game asset set,
// after the demo/reference-shot/planning cleanup landed. This suite freezes that
// refreshed contract instead of preserving the old demo-era rows.
import { describe, it, expect } from 'vitest'
import path from 'node:path'
import crypto from 'node:crypto'
import { MANIFEST, REPO, exists, fontFilesOnDisk, read, readJson, rel, walk } from './font-assets.ts'

interface Entry {
  file?: string
  source?: string
  tool?: string
  license?: string
  license_source?: string
  note?: string
  prompt?: unknown
  [k: string]: unknown
}
interface Manifest {
  '$schema-note'?: string
  assets: Entry[]
  [k: string]: unknown
}
interface Baseline {
  schemaNote: string
  topLevelKeys: string[]
  entryCount: number
  entries: { index: number; file: string; webfont: boolean; sha256: string }[]
}

const sha = (text: string): string => crypto.createHash('sha256').update(text).digest('hex')

const raw = () => read(MANIFEST)
const manifest = () => JSON.parse(raw()) as Manifest
const baseline = () => readJson<Baseline>(path.join(REPO, 'tests/assets/baseline/manifest-baseline.json'))
const entryHash = (entry: Entry): string => sha(JSON.stringify(entry))
const entryTarget = (file: string): string => path.join(REPO, file.replace(/\/$/, ''))
const fileOf = (entry: Entry): string => String(entry.file ?? '')
const SHIPPED_PUBLIC_ASSET = /\.(css|eot|gif|jpe?g|m4a|mp3|ogg|otf|png|svg|ttf|wav|webp|woff2?)$/i

function audioFilesOnDisk(): string[] {
  return walk(path.join(REPO, 'public/assets/audio'))
    .filter((p) => p.endsWith('.m4a'))
    .map(rel)
}

function publicAssetsOnDisk(): string[] {
  return walk(path.join(REPO, 'public'))
    .map(rel)
    .filter((file) => SHIPPED_PUBLIC_ASSET.test(file))
}

function coversFile(target: string, file: string): boolean {
  const clean = target.replace(/\/$/, '')
  return file === clean || file.startsWith(`${clean}/`)
}

describe('[issue #10] the manifest parses and keeps its submitted-game shape', () => {
  it('(a) it is valid JSON with an `assets` array', () => {
    expect(() => manifest()).not.toThrow()
    expect(Array.isArray(manifest().assets)).toBe(true)
  })

  it('(b) the top-level keys and schema note match the refreshed baseline', () => {
    expect(Object.keys(manifest())).toEqual(baseline().topLevelKeys)
    expect(manifest()['$schema-note']).toBe(baseline().schemaNote)
  })

  it('(c) the file keeps 2-space JSON formatting and a trailing newline', () => {
    expect(raw()).toBe(`${JSON.stringify(manifest(), null, 2)}\n`)
  })

  it('(d) every entry is one of the submitted game asset rows', () => {
    const offScope = manifest()
      .assets.map(fileOf)
      .filter(
        (file) =>
          file !== 'public/favicon.svg' &&
          !file.startsWith('public/assets/fonts/') &&
          !file.startsWith('public/assets/audio/'),
      )
    expect(offScope).toEqual([])
  })
})

describe('[issue #10] the refreshed baseline is the manifest guard', () => {
  it('(a) entry count, order, files and hashes match the baseline snapshot', () => {
    const assets = manifest().assets
    const current = assets.map((entry, index) => ({
      index,
      file: fileOf(entry),
      webfont: fileOf(entry).startsWith('public/assets/fonts/'),
      sha256: entryHash(entry),
    }))

    expect(assets.length).toBe(baseline().entryCount)
    expect(current).toEqual(baseline().entries)
  })

  it('(b) every baseline target still exists on disk', () => {
    const missing = baseline()
      .entries.map((entry) => entry.file)
      .filter((file) => !exists(entryTarget(file)))
    expect(missing).toEqual([])
  })
})

describe('[issue #10] every row carries usable attribution', () => {
  it('(a) every entry has origin, license and license source fields', () => {
    const missing = manifest().assets.flatMap((entry, index) => {
      const problems: string[] = []
      const origin = `${entry.source ?? ''}${entry.tool ?? ''}`.trim()
      if (origin === '') problems.push('source/tool')
      if (String(entry.license ?? '').trim() === '') problems.push('license')
      if (String(entry.license_source ?? '').trim() === '') problems.push('license_source')
      return problems.map((problem) => `#${index} ${fileOf(entry)} missing ${problem}`)
    })

    expect(missing).toEqual([])
  })

  it('(b) generated/tool-produced rows explicitly carry a prompt field', () => {
    const missingPromptKey = manifest()
      .assets.filter((entry) => String(entry.tool ?? '').trim() !== '' && !Object.hasOwn(entry, 'prompt'))
      .map(fileOf)
    expect(missingPromptKey).toEqual([])
  })

  it('(c) no removed demo rows remain', () => {
    const stale = manifest()
      .assets.map(fileOf)
      .filter((file) => file.startsWith('demos/'))
    expect(stale).toEqual([])
  })
})

describe('[issue #10] every shipped font binary is covered', () => {
  it('(a) each file under public/assets/fonts is covered by a manifest entry', () => {
    const targets = manifest()
      .assets.map(fileOf)
      .filter((file) => file.startsWith('public/assets/fonts/'))
    const uncovered = fontFilesOnDisk().filter(
      (file) => !targets.some((target) => file === target || file.startsWith(target.replace(/\/?$/, '/'))),
    )
    expect(uncovered.slice(0, 10), `${uncovered.length} font file(s) unmanifested`).toEqual([])
  })

  it('(b) each submitted font family directory is manifested once', () => {
    const targets = manifest()
      .assets.map(fileOf)
      .filter((file) => file.startsWith('public/assets/fonts/') && file.endsWith('/'))
    expect(targets).toEqual([
      'public/assets/fonts/ibm-plex-mono/',
      'public/assets/fonts/nanum-myeongjo/',
      'public/assets/fonts/nanum-gothic-coding/',
    ])
  })
})

describe('[issue #10] every shipped public asset is manifested', () => {
  it('(a) each shippable file under public/ is covered by a manifest row', () => {
    const targets = manifest().assets.map(fileOf)
    const uncovered = publicAssetsOnDisk().filter((file) => !targets.some((target) => coversFile(target, file)))
    expect(uncovered).toEqual([])
  })
})

describe('[issue #10] every shipped audio file is covered', () => {
  it('(a) each public audio file has one manifest row', () => {
    const targets = manifest()
      .assets.map(fileOf)
      .filter((file) => file.startsWith('public/assets/audio/'))
    expect(targets).toEqual(audioFilesOnDisk())
  })

  it('(b) the audio rows are still generated from the current cue table', () => {
    expect(audioFilesOnDisk().length).toBe(39)
  })
})
