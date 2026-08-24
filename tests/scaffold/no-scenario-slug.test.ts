import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const REPO = path.resolve(import.meta.dirname, '../..')
const SCENARIOS = path.join(REPO, 'data/scenario')
const SCANNED_ROOTS = ['src', 'proxy/src', 'tools']

/**
 * Scenario directory names are runtime data, not source constants.
 *
 * The split is deliberate:
 * - `src/` and `proxy/src/` are absolute. Runtime discovers scenario roles from
 *   `data/scenario/index.json`; naming a current pack there makes that pack a
 *   platform default.
 * - `tools/` is mixed. A tool, lint, library, script, README example, prompt
 *   fixture or generated helper that names a current pack leaks that default to
 *   the next pack. A measurement artifact that names the scenario it measured
 *   is different: it is evidence, and rewriting it would falsify the record.
 *   That includes a generated report when its whole job is to measure the
 *   current scenario by name and stay byte-regenerable from source.
 *
 * Therefore the exemption is a path allowlist, not a file-type rule. File type
 * cannot distinguish executable JSON config from pre-registration evidence, and
 * prose comments leak as readily as code. Keep future exemptions this narrow:
 * only immutable measurement evidence whose scenario name is the measured
 * subject, never an operating default.
 */
const TOOL_EVIDENCE_ALLOWLIST = [
  'tools/probe/dday-mechanism/suites/',
  'tools/probe/dday-mechanism/runs/',
  'tools/text-inventory-report.md',
]

type Finding = { file: string; line: number; slug: string }

function gitLsFiles(paths: string[]): string[] {
  return execFileSync('git', ['ls-files', '-z', '--', ...paths], { cwd: REPO, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean)
}

function currentScenarioSlugs(): string[] {
  return readdirSync(SCENARIOS, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => !slug.startsWith('_'))
    .filter((slug) => existsSync(path.join(SCENARIOS, slug, 'meta.json')))
    .sort((a, b) => a.localeCompare(b))
}

function isAllowlistedEvidence(file: string): boolean {
  return TOOL_EVIDENCE_ALLOWLIST.some((entry) => entry.endsWith('/') ? file.startsWith(entry) : file === entry)
}

function lineFindings(file: string, slugs: string[]): Finding[] {
  const text = readFileSync(path.join(REPO, file), 'utf8')
  if (text.includes('\u0000')) return []

  const findings: Finding[] = []
  const lines = text.split(/\r?\n/)
  lines.forEach((line, index) => {
    for (const slug of slugs) {
      if (line.includes(slug)) findings.push({ file, line: index + 1, slug })
    }
  })
  return findings
}

function scan({ includeAllowlist = false }: { includeAllowlist?: boolean } = {}): Finding[] {
  const slugs = currentScenarioSlugs()
  return gitLsFiles(SCANNED_ROOTS)
    .filter((file) => includeAllowlist || !isAllowlistedEvidence(file))
    .flatMap((file) => lineFindings(file, slugs))
}

function format(findings: Finding[]): string {
  return findings.map((finding) => `${finding.file}:${finding.line} (${finding.slug})`).join('\n')
}

describe('source and tooling carry no current scenario slug defaults', () => {
  it('(a) discovers current scenario directories from data/scenario', () => {
    expect(currentScenarioSlugs(), 'no current scenario directories found').not.toEqual([])
  })

  it('(b) allows current slugs only in retained measurement evidence', () => {
    const findings = scan()
    expect(
      findings,
      [
        'Current scenario directory names must not appear in src/, proxy/src/ or non-evidence tools/.',
        'Runtime discovers pack roles from data; tooling must not hard-code a pack to operate on.',
        'Allowed evidence paths are limited to immutable probe suite/run records that name the subject they measured.',
        format(findings),
      ].join('\n'),
    ).toEqual([])
  })

  it('(c) keeps the probe evidence exemption narrow and load-bearing', () => {
    const allFindings = scan({ includeAllowlist: true })
    const allowlisted = allFindings.filter((finding) => isAllowlistedEvidence(finding.file))
    const outside = allFindings.filter((finding) => !isAllowlistedEvidence(finding.file))

    expect(
      allowlisted.length,
      'allowlisted probe evidence no longer names a measured scenario',
    ).toBeGreaterThan(0)
    expect(outside, `non-evidence slug hit:\n${format(outside)}`).toEqual([])
  })
})
