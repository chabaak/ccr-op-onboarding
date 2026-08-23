// Frozen-input guard: nothing this run commits may touch the reference/frozen
// globs (C1/C13/C20).
import { describe, it, expect } from 'vitest'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { runMerge } from './unit-range.ts'

const SELF = fileURLToPath(import.meta.url)
const REPO = path.resolve(path.dirname(SELF), '../..')

function git(args: string[]): string {
  return execFileSync('git', args, { cwd: REPO, encoding: 'utf8' })
}

describe('[u11#c6] frozen inputs stayed frozen (C1 / C13 / C20)', () => {
  // RE-AIMED (C17) at the post-merge reconcile (08-05). The freeze was pipeline
  // discipline — the run must not rewrite its own inputs — and for two paths
  // that premise expired at the run's merge (#110): the client seam
  // revises by its owner's hand post-run (spec-client §9), and
  // `src/shared/species.ts` carried its own deletion order for the duplicate
  // `Species` union. The claim stays asserted where it stayed true — over the
  // run's own merge range, in (m); the live checks keep the still-frozen set.
  //
  // RELEASED again (08-05, the score-predicate hardening):
  // `data/scenario/우는다리/` is the pack, and the pack is the game's content.
  // The freeze said "the run must not rewrite its OWN inputs", which stopped
  // being a live claim the moment that run merged — the same argument that
  // released `spec-client.md` above. Left as it was, the pack could never be
  // hardened: `predicates`, `edge_predicates` and the meter bindings are all
  // authored INTO it, and lint has been reporting them as the hardening
  // worklist (F1–F4) with nowhere to do the work.
  //
  // `data/scenario/_schema/` stays frozen, and the distinction is the point:
  // the pack is content and revises with the scenario; the schemas are the
  // ratified law that content is checked against, and nothing about the run's
  // merge expired that. §3.6's grammar was deliberately sized to fit the
  // already-ratified `string[]` so hardening never needs to touch them.
  //
  // The same release carries a second repair (08-06), on the same expiry: the
  // timeline printed `(갈림길 Gn의 자리)` on six lines of a player surface,
  // against the 08-03 decision log and the client invariant.
  // That leak cannot be repaired anywhere but the authored file — fixing only
  // the compiled `timeline.json` would let the next `datapack:compile` restore
  // it. `_schema/` stays frozen for this one too: the schemas are not what
  // either defect is in.
  // RELEASED a third time (08-09, the scenario-model work). The paragraph above
  // is the one this expires, and it is worth being exact about which half. The
  // freeze's own premise — "the run must not rewrite its own inputs" — died at
  // #110 with the rest. What kept `_schema/` frozen past that was a SECOND
  // claim, made in the last sentence above: §3.6's grammar was sized so that
  // hardening would never need to touch the schemas. That claim held for packs
  // authored the way 우는다리 and 전구간정상 were. It does not hold for a pack
  // authored endings-first: 멈춘회전문's gates open on what the agent believes
  // rather than on a key it holds, so they carry no `key_conditions` and no
  // `key_examples`, and its temperament carries no `clauses` — and all three
  // were in `required`. The schemas were forbidding a legal scenario shape, not
  // guarding a ratified one.
  //
  // Both edits are pure widenings — two fields dropped from a `required` list,
  // one `minItems` from 1 to 0. No property changed type, no grammar changed
  // shape, and both shipped packs still lint at ERROR 0. A pack that validated
  // before this still validates after it.
  const RELEASED = [
    'src/shared/species.ts',
    'data/scenario/우는다리/',
    'data/scenario/_schema/',
  ]
  const FROZEN = [
    'src/shared/segment.ts',
    'tools/tests/segment.golden.mjs',
  ]

  it('(m) this run\'s commits introduced no diff under a frozen path', () => {
    const merge = runMerge()
    const changed = git(['diff', '--name-only', `${merge}^1`, merge, '--'])
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    expect(changed.filter((f) => [...FROZEN, ...RELEASED].some((p) => f.startsWith(p)))).toEqual([])
  })

  it('(m2) work landed since the run introduces no diff under a still-frozen path', () => {
    // `runMerge()..HEAD`, not the merge-base against main — on main the
    // merge-base is HEAD and the guard goes vacuous. See dev-only (e2).
    const changed = git(['diff', '--name-only', `${runMerge()}..HEAD`, '--'])
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    expect(changed.filter((f) => FROZEN.some((p) => f.startsWith(p)))).toEqual([])
  })

  it('(n) the working tree carries no uncommitted edit under a still-frozen path either', () => {
    const dirty = git(['status', '--porcelain', '--', ...FROZEN])
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    expect(dirty).toEqual([])
  })
})
