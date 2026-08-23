/**
 * The default prompt — this tier's own contribution to every Call 1.
 *
 * Call contracts §6 assigns `FLAW`, `INCIDENT`, and `PRIORITY_LIST` to "the
 * default prompt authored by the D task", supplied by the proxy. They are
 * therefore NOT accepted from the client: a payload carrying them is ignored,
 * because honouring it would let a client rewrite the agent's character. That
 * is why the lookup below is keyed by the requested pack and not simply passed
 * in — the client may name which agent it wants, never author one.
 *
 * The values are generated from root data and declared prompt sources. This
 * deployed tier does not hand-maintain pack names: request names are
 * fingerprinted before lookup, and the fallback fingerprint is generated from
 * the scenario index's single tutorial role.
 */

import { createHash } from "node:crypto";

import {
  DEFAULT_PROMPTS_BY_KEY,
  FALLBACK_PROMPT_KEY,
  type DefaultPromptSlots,
} from "./default-prompt.generated.js";

export type { DefaultPromptSlots };
export { DEFAULT_PROMPTS_BY_KEY, FALLBACK_PROMPT_KEY };

/**
 * What a request naming no pack — or naming one this deploy has never heard of
 * — is served.
 *
 * It falls back rather than failing, and that is a deliberate trade with a real
 * cost. The two tiers deploy on separate triggers (Pages on merge, SAM by
 * hand), so a client can reach a proxy that predates its slug. Rejecting would
 * turn that window into "every Call 1 fails and every gate takes its default
 * stance" — the game still runs, but it stops being a game. Falling back keeps
 * it playable with the incumbent agent, which is wrong in character and right
 * in shape.
 *
 * What stops that from becoming permanent and invisible is generation plus the
 * root-side coverage test: the generated fallback must be the index-declared
 * tutorial, and every generated prompt must still match the suite that measured
 * it.
 */
export function defaultPromptKeyFor(pack: string): string {
  return createHash("sha256").update(pack.normalize("NFC"), "utf8").digest("hex");
}

function promptForKey(key: string): DefaultPromptSlots {
  const prompt = DEFAULT_PROMPTS_BY_KEY[key];
  if (!prompt) throw new Error("generated default prompt fallback is missing");
  return prompt;
}

/** The incumbent. Kept as a named export — parity tests compose against it. */
export const DEFAULT_PROMPT: DefaultPromptSlots = promptForKey(FALLBACK_PROMPT_KEY);

/** Total: every input yields an agent. See the fallback note above for why. */
export function defaultPromptFor(pack?: string): DefaultPromptSlots {
  if (pack === undefined) return DEFAULT_PROMPT;
  return DEFAULT_PROMPTS_BY_KEY[defaultPromptKeyFor(pack)] ?? DEFAULT_PROMPT;
}
