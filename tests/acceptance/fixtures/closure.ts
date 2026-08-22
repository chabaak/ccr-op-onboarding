// [e10] slot-supplier closure, and the contract parser it runs over.
//
// The criterion is "every call slot has exactly one supplier".
// Two halves, and both have to be real for the test to mean anything:
//
// - the **denominator** is read from `data/contracts/call-slots.json`, so a
//   new live slot is picked up without anyone editing this file;
// - the **numerator** is the live supplier sets. Three of them are the runtime
//   view key sets (`fixtures/rig.ts`'s `viewKeys()`), and the other three are
//   the two constants `src/engine/feed/slots.ts` already declares plus
//   `PLAYER_SUPPLIED_SLOTS` below.
//
// `PLAYER_SUPPLIED_SLOTS` names `BLOCKS` as supplied by the player. The composer
// reaches it through a dependency (`ComposerDeps`) rather than a view, and
// naming the player explicitly keeps the union honest instead of quietly leaning
// on the composer's dependency list to cover a slot the composer does not author.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ComposerRuntimeDeps } from '../../../src/composer/compose.ts'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '../../..')
const CALL_SLOTS = path.join(REPO, 'data', 'contracts', 'call-slots.json')

/** A supplier set, by the name §8-1 calls it. */
export type SupplierMap = Record<string, readonly string[]>

/**
 * The one key of a `SupplierMap` that is NOT engine-side. Kept as a constant so
 * `closure` and its callers cannot disagree about which set is the proxy's —
 * the doubling rule is defined entirely by that split.
 */
export const PROXY_SUPPLIER_KEY = 'Proxy'

/**
 * `BLOCKS` is supplied by the player, mined from generated text.
 * Neither a view nor the proxy authors it, so §8-1's union needs this sixth
 * term.
 */
export const PLAYER_SUPPLIED_SLOTS: readonly string[] = ['BLOCKS']

/**
 * Which `ComposerDeps` key carries which call slot, as one explicit literal.
 * Typed on `keyof ComposerRuntimeDeps`, so a new composer dependency is a
 * compile error here rather than a silently unmapped slot.
 *
 * `pack` is excluded, and the exclusion is the claim: it carries no call slot. It
 * is a SELECTOR, not a supplier — it names which of the proxy's per-scenario
 * default prompts answers the call, and the proxy stays the supplier of
 * `FLAW` · `INCIDENT` · `PRIORITY_LIST`. Mapping it to one
 * of those three would claim the composer supplies a value it never sees.
 * Excluding one named key keeps the compile-error property for every other:
 * a new dependency still has to appear here.
 */
export const DEP_KEY_TO_SLOT: Readonly<
  Record<Exclude<keyof ComposerRuntimeDeps, 'pack'>, string>
> = {
  blocks: 'BLOCKS',
  reportGuidance: 'REPORT_GUIDANCE',
}

export type ClosureResult = {
  /** Call slots no supplier set claims. */
  unassigned: string[]
  /** Call slots claimed by the engine side AND by the proxy. */
  doubled: string[]
}

/**
 * Every live call slot named by the data contract, in table order.
 */
export function contractSlots(): string[] {
  const contract = JSON.parse(fs.readFileSync(CALL_SLOTS, 'utf8')) as {
    supplierSlots?: unknown
  }
  if (!Array.isArray(contract.supplierSlots)) {
    throw new Error('call-slots.json has no supplierSlots array — the parser is stale')
  }
  return contract.supplierSlots.map((slot) => {
    if (typeof slot !== 'string') {
      throw new Error('call-slots.json supplierSlots entries must be strings')
    }
    return slot
  })
}

/**
 * Slot closure, executable. `unassigned` is the criterion's own failure mode; `doubled`
 * is the other half — a slot the engine side supplies that the proxy's default
 * prompt also owns means the client can rewrite the agent's character.
 *
 * Two supplier sets naming the same slot on the SAME side is not doubling:
 * `TEMPERAMENT` sits in `GateView` and `RoundView` by requirement (§8-6), and
 * `BLOCKS` is named by both `PlayerSupplied` and `ComposerDeps` (K1). Those are
 * one supplier seen twice, which is why the split is engine-side vs proxy and
 * not set-vs-set.
 *
 * @throws when the slot list is empty — a parser that silently returned `[]`
 * would make the criterion vacuously green, which is the one failure this test
 * exists to prevent.
 */
export function closure(slots: readonly string[], suppliers: SupplierMap): ClosureResult {
  if (slots.length === 0) {
    throw new Error('the call-slot contract parsed to zero slots — refusing a vacuous closure')
  }

  const proxy = new Set(suppliers[PROXY_SUPPLIER_KEY] ?? [])
  const engineSide = new Set<string>()
  for (const [name, supplied] of Object.entries(suppliers)) {
    if (name === PROXY_SUPPLIER_KEY) continue
    for (const slot of supplied) engineSide.add(slot)
  }

  return {
    unassigned: slots.filter((slot) => !engineSide.has(slot) && !proxy.has(slot)),
    doubled: slots.filter((slot) => engineSide.has(slot) && proxy.has(slot)),
  }
}
