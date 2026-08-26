// The scenario pack fetch — step 1 of the boot order (spec-client §5.1).
//
// The shell starts with `data/scenario/index.json`: the ordered list of packs
// and the one tutorial designation the portal auto-opens. Then it reads the
// selected pack surfaces it owns: `meta.json` for the chrome/clock band,
// `incidentBrief.json` for the desktop file confirmation and `endings.json` for
// the terminal curtain. Score predicates are read only for the ending trigger
// and preview tally; the ledger itself still comes from the driver seam.
//
// The pack is authored data (frozen this run), so it is parsed defensively:
// the terminal stamp is written `21:04+` there — the trailing `+` marks an
// open-ended close, and the seam's `"HH:MM"` contract has no room for it.

/** The case identity + clock band the chrome renders. */
export interface ScenarioIdentity {
  slug: string
  displayName: string
  /** The callsign series this scenario issues before run numbering is applied. */
  callsignSeries: string
  /** `"HH:MM"` the scenario opens on. */
  start: string
  /** `"HH:MM"` the scenario closes on. */
  end: string
}

export type ScenarioRole = 'tutorial' | 'practice' | 'fixture'

export interface ScenarioPackEntry {
  slug: string
  displayName: string
  role: ScenarioRole
  order: number
  difficulty: string
}

export interface ScenarioIndex {
  packs: readonly ScenarioPackEntry[]
}

export type EndingKindName = 'good' | 'bad'

export interface ScenarioEndingPlateCopy {
  head: string
  lead: string
  body: readonly string[]
}

export interface ScenarioEndings {
  siteOccupants: number
  scoredOutsideSite: readonly string[]
  copy: Record<EndingKindName, readonly ScenarioEndingPlateCopy[]>
}

export interface ScenarioScoreUnit {
  id: string
  label: string
  predicates: readonly string[]
}

export interface ScenarioScore {
  units: readonly ScenarioScoreUnit[]
}

export interface ScenarioIncidentBrief {
  lead: string
  body: readonly string[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

/** `"21:04+"` → `"21:04"`; anything that is not a stamp is a hard failure. */
function stamp(value: unknown, field: string): string {
  if (typeof value === 'string') {
    const match = /^(\d{1,2}:\d{2})\+?$/.exec(value.trim())
    if (match) return match[1].padStart(5, '0')
  }
  throw new Error(`scenario pack: meta.json '${field}' is not an "HH:MM" stamp`)
}

function readIdentity(raw: unknown, entry: Pick<ScenarioPackEntry, 'slug' | 'displayName'>): ScenarioIdentity {
  if (!isRecord(raw) || !isRecord(raw.clock)) {
    throw new Error('scenario pack: meta.json has no clock band')
  }
  const slug = typeof raw.slug === 'string' && raw.slug.length > 0 ? raw.slug : entry.slug
  if (slug !== entry.slug) {
    throw new Error(`scenario pack: meta.json declares slug ${JSON.stringify(slug)}`)
  }
  if (typeof raw.callsign_series !== 'string' || !/^[A-Z]+$/.test(raw.callsign_series)) {
    throw new Error("scenario pack: meta.json 'callsign_series' is not an uppercase callsign series")
  }
  return {
    slug,
    displayName: entry.displayName,
    callsignSeries: raw.callsign_series,
    start: stamp(raw.clock.start, 'clock.start'),
    end: stamp(raw.clock.end, 'clock.end'),
  }
}

function readPackEntry(raw: unknown, field: string): ScenarioPackEntry {
  if (!isRecord(raw)) throw new Error(`scenario index: '${field}' is not a pack entry`)
  const { slug, display_name: displayName, role, order, difficulty } = raw
  if (typeof slug !== 'string' || slug.length === 0) {
    throw new Error(`scenario index: '${field}.slug' is not a string`)
  }
  if (typeof displayName !== 'string' || displayName.length === 0) {
    throw new Error(`scenario index: '${field}.display_name' is not a string`)
  }
  if (role !== 'tutorial' && role !== 'practice' && role !== 'fixture') {
    throw new Error(`scenario index: '${field}.role' is not a known role`)
  }
  if (typeof order !== 'number' || !Number.isInteger(order) || order < 0) {
    throw new Error(`scenario index: '${field}.order' is not a non-negative integer`)
  }
  if (typeof difficulty !== 'string' || difficulty.length === 0) {
    throw new Error(`scenario index: '${field}.difficulty' is not a string`)
  }
  return { slug, displayName, role, order, difficulty }
}

function readScenarioIndex(raw: unknown): ScenarioIndex {
  if (!isRecord(raw) || !Array.isArray(raw.packs) || raw.packs.length === 0) {
    throw new Error('scenario index: no packs listed')
  }
  return { packs: raw.packs.map((pack, index) => readPackEntry(pack, `packs[${index}]`)) }
}

export function sortedScenarioPacks(index: ScenarioIndex): readonly ScenarioPackEntry[] {
  return [...index.packs].sort((left, right) => left.order - right.order)
}

export function isScenarioPlayable(entry: Pick<ScenarioPackEntry, 'role'>): boolean {
  return entry.role === 'tutorial' || entry.role === 'practice'
}

export function tutorialScenarioPack(index: ScenarioIndex): ScenarioPackEntry {
  const tutorials = index.packs.filter((pack) => pack.role === 'tutorial')
  if (tutorials.length !== 1) {
    throw new Error(`scenario index: expected exactly one tutorial pack, found ${tutorials.length}`)
  }
  return tutorials[0]!
}

export function scenarioPackBySlug(index: ScenarioIndex, slug: string): ScenarioPackEntry | null {
  return index.packs.find((pack) => pack.slug === slug) ?? null
}

function readPlateCopy(raw: unknown, field: string): ScenarioEndingPlateCopy {
  if (!isRecord(raw) || typeof raw.head !== 'string' || typeof raw.lead !== 'string' || !isStringArray(raw.body)) {
    throw new Error(`scenario pack: endings.json '${field}' is not a plate`)
  }
  return { head: raw.head, lead: raw.lead, body: raw.body }
}

function readEndingPlateList(raw: unknown, field: string): readonly ScenarioEndingPlateCopy[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error(`scenario pack: endings.json '${field}' is not a non-empty plate list`)
  }
  return raw.map((plate, index) => readPlateCopy(plate, `${field}[${index}]`))
}

function readEndings(raw: unknown): ScenarioEndings {
  if (!isRecord(raw) || !isRecord(raw.copy)) {
    throw new Error('scenario pack: endings.json has no copy block')
  }
  const siteOccupants = raw.site_occupants
  if (typeof siteOccupants !== 'number' || !Number.isInteger(siteOccupants) || siteOccupants < 0) {
    throw new Error("scenario pack: endings.json 'site_occupants' is not a non-negative integer")
  }
  if (!isStringArray(raw.scored_outside_site)) {
    throw new Error("scenario pack: endings.json 'scored_outside_site' is not a string list")
  }
  return {
    siteOccupants,
    scoredOutsideSite: raw.scored_outside_site,
    copy: {
      good: readEndingPlateList(raw.copy.good, 'copy.good'),
      bad: readEndingPlateList(raw.copy.bad, 'copy.bad'),
    },
  }
}

function readScore(raw: unknown): ScenarioScore {
  if (!isRecord(raw) || !Array.isArray(raw.units)) {
    throw new Error('scenario pack: score data has no units')
  }
  return {
    units: raw.units.map((unit, index) => {
      if (!isRecord(unit) || typeof unit.id !== 'string' || typeof unit.label !== 'string' || !isStringArray(unit.predicates)) {
        throw new Error(`scenario pack: score unit ${index} is not readable`)
      }
      return { id: unit.id, label: unit.label, predicates: unit.predicates }
    }),
  }
}

function readIncidentBrief(raw: unknown): ScenarioIncidentBrief {
  if (!isRecord(raw) || typeof raw.lead !== 'string' || !isStringArray(raw.body) || raw.body.length === 0) {
    throw new Error('scenario pack: incidentBrief.json is not a readable brief')
  }
  return { lead: raw.lead, body: raw.body }
}

async function fetchDataJson(path: string): Promise<unknown> {
  const url = new URL(path, document.baseURI)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`scenario pack: ${url.pathname} answered ${response.status}`)
  }
  return response.json()
}

async function fetchScenarioJson(part: string, slug: string): Promise<unknown> {
  return fetchDataJson(`data/scenario/${slug}/${part}.json`)
}

/** Fetches `data/scenario/index.json`, the runtime pack manifest. */
export async function fetchScenarioIndex(): Promise<ScenarioIndex> {
  return readScenarioIndex(await fetchDataJson('data/scenario/index.json'))
}

/** Fetches `data/scenario/<slug>/meta.json` relative to the deployed base. */
export async function fetchScenarioIdentity(entry: Pick<ScenarioPackEntry, 'slug' | 'displayName'>): Promise<ScenarioIdentity> {
  return readIdentity(await fetchScenarioJson('meta', entry.slug), entry)
}

/** Fetches the optional pack-owned ending text and display arithmetic. */
export async function fetchScenarioEndings(slug: string): Promise<ScenarioEndings> {
  return readEndings(await fetchScenarioJson('endings', slug))
}

/** Fetches the score predicates the ending uses for trigger and preview totals. */
export async function fetchScenarioScore(slug: string): Promise<ScenarioScore> {
  return readScore(await fetchScenarioJson('score', slug))
}

/** Fetches the pack-owned brief shown before switching to a desktop scenario. */
export async function fetchScenarioIncidentBrief(slug: string): Promise<ScenarioIncidentBrief> {
  return readIncidentBrief(await fetchScenarioJson('incidentBrief', slug))
}
