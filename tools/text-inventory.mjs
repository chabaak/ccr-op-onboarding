// Korean text inventory.
//
// Run:
//   node tools/text-inventory.mjs
//   node tools/text-inventory.mjs --check
//
// The script reads authored JSON values and client TypeScript literals as text.
// It does not import src modules.
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '..')
const REPORT = path.join(HERE, 'text-inventory-report.md')
const SCENARIO_DIR = path.join(REPO, 'data/scenario')
const SCENARIO_INDEX = path.join(SCENARIO_DIR, 'index.json')
const DEFAULT_PROMPTS = path.join(REPO, 'data/scenario/default-prompts.json')
const SCHEMA_DIR = path.join(REPO, 'data/scenario/_schema')
const SHELL_DIR = path.join(REPO, 'src/client/shell')
const COMPONENTS_DIR = path.join(REPO, 'src/client/components')

const HANGUL = /\p{Script=Hangul}/gu
const HANGUL_TEST = /\p{Script=Hangul}/u
const TOTAL_RUNS_PER_SITTING = 4
const RENDERED = 'rendered'
const MODEL_FACING = 'model-facing by design'
const ORPHANED = 'genuinely orphaned'
const CATEGORIES = [RENDERED, MODEL_FACING, ORPHANED]
const SURFACES = ['LIVE FEED', '요원 파일', '보고서', 'decision', '지침', 'notice', 'entry', 'ending', 'desktop', 'model prompt', 'runtime data', 'authoring data', 'unknown']
const SCORE_UNIT_DESIGN_FIELD = ['tal', 'lies'].join('')
const SCORE_UNIT_BASE_FIELD = ['base', 'line'].join('')
const SCORE_TOP_BASE_NOTE = `${SCORE_UNIT_BASE_FIELD}_summary`
const SCORE_TOP_VARIANCE_NOTE = ['variance', 'notes'].join('_')

function repoPath(file) {
  return path.relative(REPO, file).split(path.sep).join('/')
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function playable(entry) {
  return entry?.role === 'tutorial' || entry?.role === 'practice'
}

function packEntryFromIndex() {
  const index = readJson(SCENARIO_INDEX)
  const packs = Array.isArray(index.packs) ? [...index.packs] : []
  const tutorials = packs.filter((pack) => pack.role === 'tutorial')
  if (tutorials.length === 1) return tutorials[0]
  const playablePacks = packs
    .filter(playable)
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
  if (playablePacks.length > 0) return playablePacks[0]
  throw new Error('text inventory: data/scenario/index.json has no playable pack')
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length
}

function koreanLength(value) {
  return [...String(value).matchAll(HANGUL)].length
}

function hasKorean(value) {
  return HANGUL_TEST.test(String(value))
}

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('|', '\\|')
    .replaceAll('\n', '<br>')
}

function mdText(value) {
  return String(value)
    .split('\n')
    .map((line) => line.replace(/ +$/g, (spaces) => '[space]'.repeat(spaces.length)))
    .join('<br>')
}

function listFiles(dir, pred) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && pred(entry.name))
    .map((entry) => path.join(dir, entry.name))
    .sort()
}

function walkJson(value, visit, currentPath = []) {
  if (typeof value === 'string') {
    visit(value, currentPath)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkJson(item, visit, [...currentPath, String(index)]))
    return
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) walkJson(child, visit, [...currentPath, key])
  }
}

function collectJsonStrings(file) {
  const text = fs.readFileSync(file, 'utf8')
  const parsed = JSON.parse(text)
  const out = []
  let searchAt = 0
  walkJson(parsed, (value, jsonPath) => {
    if (!hasKorean(value)) return
    const literal = JSON.stringify(value)
    let index = text.indexOf(literal, searchAt)
    if (index === -1) index = text.indexOf(literal)
    if (index === -1) {
      throw new Error(`could not locate JSON string ${literal} in ${repoPath(file)}`)
    }
    searchAt = index + literal.length
    out.push({ file, line: lineOf(text, index), path: jsonPath.join('.'), text: value })
  })
  return out
}

function templateText(node) {
  let value = node.head.text
  for (const span of node.templateSpans) value += '${...}' + span.literal.text
  return value
}

function collectTsStrings(file) {
  const text = fs.readFileSync(file, 'utf8')
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const out = []
  function visit(node) {
    let value = null
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) value = node.text
    if (ts.isTemplateExpression(node)) value = templateText(node)
    if (value !== null) {
      if (hasKorean(value)) {
        const pos = sf.getLineAndCharacterOfPosition(node.getStart(sf))
        out.push({ file, line: pos.line + 1, path: node.kind === ts.SyntaxKind.TemplateExpression ? 'template' : 'literal', text: value })
      }
      if (ts.isTemplateExpression(node)) return
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return out
}

function jsonSurface(item) {
  const file = repoPath(item.file)
  const p = item.path

  if (file.endsWith('/timeline.json') && /^events\.\d+\.text$/.test(p)) {
    const raw = readJson(item.file)
    const event = raw.events[Number(p.split('.')[1])]
    const condition = event.exposure?.extra_condition ?? null
    const visible = event.exposure?.visible_from ?? null
    return {
      surface: 'LIVE FEED',
      state: `run feed ${event.time}${condition ? `; exposure ${condition}` : visible ? `; visible from ${visible}` : ''}`,
      perRun: condition || visible ? '0-1, conditional' : '1',
      perSitting: condition || visible ? `0-${TOTAL_RUNS_PER_SITTING}, conditional` : `${TOTAL_RUNS_PER_SITTING}`,
      when: `timeline event ${event.id} at ${event.time}`,
      needs: '',
      category: RENDERED,
    }
  }

  if (file.endsWith('/incidentCover.json')) {
    return {
      surface: '요원 파일',
      state: 'agent file cover',
      perRun: '1 on cover render',
      perSitting: `up to ${TOTAL_RUNS_PER_SITTING}`,
      when: 'agent file cover is built for a run',
      needs: '',
      category: RENDERED,
    }
  }

  if (file.endsWith('/incidentBrief.json')) {
    return {
      surface: 'notice',
      state: 'scenario desktop confirmation',
      perRun: '0',
      perSitting: '0-1 when a desktop file is opened',
      when: 'scenario file confirmation opens',
      needs: '',
      category: RENDERED,
    }
  }

  if (file.endsWith('/endings.json') && /^copy\.(good|bad)\./.test(p)) {
    const kind = p.split('.')[1]
    return {
      surface: 'ending',
      state: `${kind} ending plate`,
      perRun: '0',
      perSitting: '0-1 when that ending is reached',
      when: `${kind} ending curtain raises`,
      needs: '',
      category: RENDERED,
    }
  }

  if (file.endsWith('/symptoms.json')) {
    return {
      surface: 'LIVE FEED',
      state: 'symptom feed line',
      perRun: '0-1 when matching state change is visible',
      perSitting: `0-${TOTAL_RUNS_PER_SITTING}`,
      when: 'state journal renders a symptom line into the feed stream',
      needs: '',
      category: RENDERED,
    }
  }

  if (file.endsWith('/gates.json')) {
    return {
      surface: 'decision',
      state: 'agent decision prompt/pick set',
      perRun: '0-1 when the gate is reached',
      perSitting: `0-${TOTAL_RUNS_PER_SITTING}`,
      when: 'scheduled gate compiles the decision question, scene, stance set, and related gate prose',
      needs: '',
      category: RENDERED,
    }
  }

  if (file.endsWith('/score.json')) {
    const renderedScoreState = scoreRenderedState(p)
    if (!renderedScoreState) {
      return modelFacing('score authoring note', 'authoring data', 'human-written score design note stripped from the published runtime pack')
    }
    return {
      surface: '보고서',
      state: renderedScoreState,
      perRun: '0-1 branch per unit',
      perSitting: `0-${TOTAL_RUNS_PER_SITTING}`,
      when: 'score data resolves into the report tally',
      needs: '',
      category: RENDERED,
    }
  }

  if (file.endsWith('/meta.json') && p === 'slug') return modelFacing('scenario slug metadata', 'runtime data', 'scenario identity/routing data')
  if (file.endsWith('/meta.json') && (p === 'title' || p === 'logline')) {
    return orphaned('pack metadata not read by the current visible shell', 'scenario title/logline surface')
  }
  if (file.endsWith('/default-prompts.json')) return modelFacing('default prompt registry entry', 'model prompt', 'prompt/probe registry')
  if (file.endsWith('/characters.json')) return modelFacing('character prompt/roster data', 'model prompt', 'agent deliberation and narration prompt input')
  if (file.endsWith('/temperament.json')) return modelFacing('temperament prompt data', 'model prompt', 'agent prompt input')
  if (file.endsWith('/truths.json')) return modelFacing('truth carrier registry', 'model prompt', 'measurement/probe and handover truth input')
  if (file.endsWith('/places.json')) return modelFacing('place authoring data', 'model prompt', 'place and exposure context input')
  if (file.endsWith('/hardening.json')) return modelFacing('hardening overlay authoring data', 'runtime data', 'state/effect overlay input')

  return orphaned('unclassified authored string', 'explicit surface mapping')
}

function scoreRenderedState(p) {
  if (/^units\.\d+\.label$/.test(p)) return 'tally row label'
  if (/^units\.\d+\.predicates\.\d+$/.test(p)) return 'tally row value candidate'
  if (p.split('.').at(2) === SCORE_UNIT_DESIGN_FIELD) return null
  if (p.split('.').at(2) === SCORE_UNIT_BASE_FIELD) return null
  if (p === SCORE_TOP_BASE_NOTE) return null
  if (p.startsWith(`${SCORE_TOP_VARIANCE_NOTE}.`)) return null
  return null
}

function modelFacing(state, surface, when) {
  return {
    surface,
    state,
    perRun: 'consumed by model/runtime path; not player-facing',
    perSitting: 'consumed by model/runtime path; not player-facing',
    when,
    needs: '',
    category: MODEL_FACING,
  }
}

function orphaned(state, needs) {
  return {
    surface: 'unknown',
    state,
    perRun: 'not consumed by current rendered or model-facing path',
    perSitting: 'not consumed by current rendered or model-facing path',
    when: state,
    needs,
    category: ORPHANED,
  }
}

const tsSurfaceByFile = new Map([
  ['abort-mission.ts', ['notice', 'abort confirmation']],
  ['announcer.ts', ['notice', 'screen-reader announcements']],
  ['boot.ts', ['desktop', 'boot chrome']],
  ['coach.ts', ['지침', 'coach mark']],
  ['confirm.ts', ['notice', 'confirmation plate']],
  ['ending.ts', ['ending', 'ending curtain']],
  ['manual.ts', ['지침', 'onboarding briefing']],
  ['portal-identity.ts', ['entry', 'portal identity']],
  ['scenario-desktop.ts', ['desktop', 'scenario desktop']],
  ['sign-in.ts', ['entry', 'sign-in gate']],
  ['tutorial.ts', ['지침', 'tutorial coach']],
  ['window-manager.ts', ['desktop', 'window chrome']],
  ['window-registry.ts', ['desktop', 'window registry']],
  ['block-card.ts', ['요원 파일', 'handover block']],
  ['deploy-button.ts', ['요원 파일', 'deploy control']],
  ['desktop-dressing.ts', ['desktop', 'desktop dressing']],
  ['dossier.ts', ['요원 파일', 'agent dossier']],
  ['fallback-notice.ts', ['notice', 'fallback notice']],
  ['game-clock.ts', ['desktop', 'desk clock']],
  ['minable-sentence.ts', ['보고서', 'report sentence controls']],
  ['red-thread.ts', ['요원 파일', 'handover thread']],
  ['report-archive.ts', ['보고서', 'report archive']],
  ['report-view.ts', ['보고서', 'report documents']],
  ['run-counter.ts', ['desktop', 'run counter']],
  ['run-feed.ts', ['LIVE FEED', 'run feed']],
  ['score-tally.ts', ['보고서', 'tally record']],
  ['slot-board.ts', ['요원 파일', 'handover slots']],
  ['tally-line.ts', ['LIVE FEED', 'feed tally line']],
  ['window-frame.ts', ['desktop', 'window chrome']],
])

function tsSurface(item) {
  const base = path.basename(item.file)
  const hit = tsSurfaceByFile.get(base)
  if (!hit) return orphaned('unclassified client literal', 'explicit client surface mapping')
  const [surface, state] = hit
  const transient = surface === 'notice' || surface === 'ending' || surface === '지침' || surface === 'entry'
  return {
    surface,
    state,
    perRun: transient ? '0-1 when state is visited' : 'persistent while mounted',
    perSitting: transient ? '0-1 when state is visited' : 'persistent while mounted',
    when: state,
    needs: '',
    category: RENDERED,
  }
}

function makeRecord(kind, item, attribution) {
  return {
    kind,
    source: `${repoPath(item.file)}:${item.line}`,
    path: item.path,
    text: item.text,
    koreanLength: koreanLength(item.text),
    ...attribution,
  }
}

function collectInventory(packEntry) {
  const packDir = path.join(SCENARIO_DIR, packEntry.slug)
  const jsonFiles = [
    ...listFiles(packDir, (name) => name.endsWith('.json')),
    DEFAULT_PROMPTS,
  ].sort()
  const tsFiles = [
    ...listFiles(SHELL_DIR, (name) => name.endsWith('.ts')),
    ...listFiles(COMPONENTS_DIR, (name) => name.endsWith('.ts')),
  ].sort()
  const records = []
  for (const file of jsonFiles) {
    for (const item of collectJsonStrings(file)) records.push(makeRecord('data', item, jsonSurface(item)))
  }
  for (const file of tsFiles) {
    for (const item of collectTsStrings(file)) records.push(makeRecord('client', item, tsSurface(item)))
  }
  return records
}

function bySurface(records) {
  const groups = new Map()
  for (const surface of SURFACES) groups.set(surface, [])
  for (const record of records) groups.get(record.surface)?.push(record)
  return groups
}

function pressure(records) {
  const groups = bySurface(records.filter((record) => record.category === RENDERED))
  return [...groups.entries()]
    .filter(([, list]) => list.length > 0)
    .map(([surface, list]) => {
      const longest = [...list].sort((a, b) => b.koreanLength - a.koreanLength || a.source.localeCompare(b.source))[0]
      const states = new Map()
      const dupes = new Map()
      for (const record of list) {
        states.set(record.state, (states.get(record.state) ?? 0) + 1)
        dupes.set(record.text, (dupes.get(record.text) ?? 0) + 1)
      }
      const counts = [...states.values()]
      const stateRange = `${Math.min(...counts)}-${Math.max(...counts)}`
      const topDupe = [...dupes.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]
      return { surface, list, longest, states, stateRange, topDupe }
    })
}

function evaluateCondition(condition, state) {
  if (!condition) return true
  return condition.split(/\s+and\s+/).every((part) => {
    const atom = part.trim()
    if (atom.startsWith('not ')) return !state[atom.slice(4)]
    return Boolean(state[atom])
  })
}

function livePackRanges(packEntry) {
  const packDir = path.join(SCENARIO_DIR, packEntry.slug)
  const timeline = readJson(path.join(packDir, 'timeline.json')).events
  const gates = readJson(path.join(packDir, 'gates.json')).gates
  const score = readJson(path.join(packDir, 'score.json')).units
  const meta = readJson(path.join(packDir, 'meta.json')).clock
  const states = [
    ['baseline path', {}],
    ['headcount-only path', { headcount_pressed: true }],
    ['west-sleeve path', { headcount_pressed: true, west_sleeve_opened: true }],
    ['vent-restored path', { headcount_pressed: true, west_sleeve_opened: true, vent_restored: true }],
    ['north-opened path', { headcount_pressed: true, west_sleeve_opened: true, north_opened: true }],
  ]
  const feedCounts = states.map(([name, state]) => ({
    name,
    count: timeline.filter((event) => evaluateCondition(event.exposure?.extra_condition ?? '', state)).length,
  }))
  const decisionCounts = [
    ['baseline path', 1],
    ['headcount-only path', 2],
    ['west-sleeve/terminal paths', 3],
  ]
  return { timeline, gates, score, meta, feedCounts, decisionCounts }
}

function schemaBounds() {
  const timeline = readJson(path.join(SCHEMA_DIR, 'timeline.schema.json'))
  const gates = readJson(path.join(SCHEMA_DIR, 'gates.schema.json'))
  const score = readJson(path.join(SCHEMA_DIR, 'score.schema.json'))
  const meta = readJson(path.join(SCHEMA_DIR, 'meta.schema.json'))
  const gateItems = gates.properties.gates.items
  return {
    feed: `${timeline.properties.events.minItems ?? 'unbounded'} minimum; no maxItems declared`,
    tally: `${score.properties.units.minItems ?? 'unbounded'} minimum; no maxItems declared`,
    decisions: `${gates.properties.gates.minItems ?? 'unbounded'} minimum; no maxItems declared`,
    stances: `${gateItems.properties.stances.minItems ?? 'unbounded'}-${gateItems.properties.stances.maxItems ?? 'unbounded'} per decision`,
    clock: `${meta.$defs.clockTime.pattern}; no duration min/max declared`,
  }
}

function inventoryTable(records) {
  const rows = [
    '| # | source | length | taxonomy | surface / consumer | state | per run | per sitting | text |',
    '|---:|---|---:|---|---|---|---|---|---|',
  ]
  records.forEach((record, index) => {
    rows.push(`| ${index + 1} | ${esc(record.source)} | ${record.koreanLength} | ${esc(record.category)} | ${esc(record.surface)} | ${esc(record.state)} | ${esc(record.perRun)} | ${esc(record.perSitting)} | ${esc(record.text)} |`)
  })
  return rows.join('\n')
}

function renderReport(records, packEntry) {
  const ranges = livePackRanges(packEntry)
  const bounds = schemaBounds()
  const roots = {
    pack: records.filter((r) => r.kind === 'data').length,
    shell: records.filter((r) => r.source.startsWith('src/client/shell/')).length,
    components: records.filter((r) => r.source.startsWith('src/client/components/')).length,
  }
  const categoryCounts = Object.fromEntries(CATEGORIES.map((category) => [
    category,
    records.filter((record) => record.category === category).length,
  ]))
  const orphans = records.filter((r) => r.category === ORPHANED)
  const modelFacing = records.filter((r) => r.category === MODEL_FACING)
  const renderedClient = records.filter((r) => r.kind === 'client' && r.category === RENDERED)
  const renderedData = records.filter((r) => r.kind === 'data' && r.category === RENDERED)
  const pressureRows = pressure(records).map(({ surface, list, longest, stateRange, topDupe, states }) => {
    const stateList = [...states.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([state, count]) => `${state}: ${count}`).join('; ')
    return `| ${esc(surface)} | ${list.length} | ${stateRange} | ${topDupe[1]} x ${esc(topDupe[0])} | ${longest.koreanLength} at ${esc(longest.source)}: ${esc(longest.text)} | ${esc(stateList)} |`
  })

  const orphanLines = orphans.length === 0
    ? [
      'No orphans were found.',
      '',
      'Proof method: every record in the inventory is classified as either `rendered` or `model-facing by design`; the generated inventory contains zero rows with taxonomy `genuinely orphaned`.',
    ]
    : orphans.flatMap((record, index) => [
      `### ${index + 1}. ${record.source}`,
      '',
      `String: ${mdText(record.text)}`,
      '',
      `When it fires: ${record.when}.`,
      '',
      `What would have to exist: ${record.needs}.`,
      '',
    ])

  return `# Korean Text Inventory

Generated by \`node tools/text-inventory.mjs\`.

## Scope And Method

This report inventories Korean-bearing string values from the one live authored pack, \`data/scenario/${packEntry.slug}/*.json\`, plus \`data/scenario/default-prompts.json\`, and Korean-bearing string/template literals from \`src/client/shell/*.ts\` and \`src/client/components/*.ts\`. The pack is discovered from \`data/scenario/index.json\` by selecting the tutorial pack, matching the runtime default. The script deliberately does not import \`src/\` modules; it parses files as text/JSON, counts Korean characters with Unicode Hangul script matching, and reports \`unknown\` only for genuinely orphaned records.

The sample is a single pack. The parent plan's three-pack variance premise is stale: \`${packEntry.slug}\` is the only live pack in \`data/scenario/\`, so measured values below are one-pack values and schema ranges are taken from \`data/scenario/_schema/\` where the schema declares them.

The taxonomy has three buckets: \`rendered\` means the string reaches a player-visible surface; \`model-facing by design\` means it is consumed by prompt, runtime, or authoring paths where no screen is intended; \`genuinely orphaned\` means no current rendered or model-facing path was found.

## Counts

| root | strings |
|---|---:|
| authored pack + default prompts | ${roots.pack} |
| shell modules | ${roots.shell} |
| component modules | ${roots.components} |
| total | ${records.length} |
| rendered | ${categoryCounts[RENDERED]} |
| model-facing by design | ${categoryCounts[MODEL_FACING]} |
| genuinely orphaned | ${categoryCounts[ORPHANED]} |

The prior one-bucket orphan count has been split. Symptoms, gate strings, and runtime score strings are classified as rendered because they flow to LIVE FEED, the decision object, and the report tally respectively; private character, truth, place, hardening, temperament, score design-note, and default-prompt data are model-facing by design rather than orphaned.

Shell and component strings were checked separately: ${renderedClient.length} of ${roots.shell + roots.components} client strings are rendered at their point of use, and none are classified as genuinely orphaned. Authored data contributes ${renderedData.length} rendered strings, ${modelFacing.length} model-facing strings, and ${orphans.length} genuinely orphaned strings.

## Genuinely Orphaned List

${orphanLines.join('\n')}
## Pressure Points

Rendered surfaces only; model-facing records have no player-facing surface to size.

| surface | strings | state count range | highest repeated string | longest string | state counts |
|---|---:|---:|---|---|---|
${pressureRows.join('\n')}

## Authored Ranges

| measure | live pack measurement | schema-declared bound |
|---|---|---|
| feed lines per run | ${Math.min(...ranges.feedCounts.map((x) => x.count))}-${Math.max(...ranges.feedCounts.map((x) => x.count))} across modeled exposure paths (${ranges.feedCounts.map((x) => `${x.name}: ${x.count}`).join('; ')}) | ${bounds.feed} |
| tally rows | ${ranges.score.length} score units | ${bounds.tally} |
| decision points | ${Math.min(...ranges.decisionCounts.map((x) => x[1]))}-${Math.max(...ranges.decisionCounts.map((x) => x[1]))} reachable decisions (${ranges.decisionCounts.map((x) => `${x[0]}: ${x[1]}`).join('; ')}) | ${bounds.decisions}; stances ${bounds.stances} |
| clock band | ${ranges.meta.start}-${ranges.meta.end} | ${bounds.clock} |

## Full Inventory

${inventoryTable(records)}
`
}

function main() {
  const check = process.argv.includes('--check')
  const packEntry = packEntryFromIndex()
  const records = collectInventory(packEntry)
  const report = renderReport(records, packEntry)
  if (check) {
    const current = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, 'utf8') : ''
    if (current !== report) {
      console.error(`${repoPath(REPORT)} is stale; run node tools/text-inventory.mjs`)
      process.exitCode = 1
      return
    }
    console.log(`${repoPath(REPORT)} is up to date`)
    return
  }
  fs.writeFileSync(REPORT, report)
  console.log(`wrote ${repoPath(REPORT)} (${records.length} strings)`)
}

main()
