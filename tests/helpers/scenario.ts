import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ScenarioIndex } from '../../src/shared/datapack.ts'

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export function readJson<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(REPO, rel), 'utf8')) as T
}

export const MANIFEST = readJson<ScenarioIndex>('data/scenario/index.json')
export const TUTORIAL_PACK = MANIFEST.packs.find((pack) => pack.role === 'tutorial')

if (!TUTORIAL_PACK) {
  throw new Error('scenario index has no tutorial pack')
}

export const TUTORIAL_SLUG = TUTORIAL_PACK.slug
export const TUTORIAL_DIR = path.join(REPO, 'data', 'scenario', TUTORIAL_SLUG)

export function tutorialPart<T>(name: string): T {
  return readJson<T>(`data/scenario/${TUTORIAL_SLUG}/${name}.json`)
}
