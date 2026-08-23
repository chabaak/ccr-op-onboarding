---
name: write-mechanism-scenario
description: Scenario authoring loop for this repo: take a brief through Korean draft, datapack compile/lint, preregistered probe suites, measured model arms, readout, revision, re-measurement, and shipping only when gate discrimination thresholds hold. Use for creating or hardening scenario packs; not for reading an already-completed probe run.
---

# Measured Scenario Authoring

This skill replaces the retired paper-only scenario factory. Its exit condition is
measurement: a pack ships only after each load-bearing gate has a preregistered
probe, raw run artifacts, readout, and a measured discrimination result.

## 0. Operating Rules

- You are the orchestrator. Use a writing sub-agent for fresh prose so workshop
  vocabulary does not leak into the draft, but this skill is the complete method.
- A writing sub-agent reads only the brief and this skill's draft-format and
  prose-law sections. It reads no repository docs, specs, run records, or other
  drafts.
- Keep all draft prose in Korean from the first note. Do not outline in English
  and translate.
- `authoring/` stays on the build path. Use it; do not copy or replace it.
- Use `.claude/skills/read-mechanism-run/extract.mjs` for readout after model
  runs. Do not duplicate that parser.
- `tools/probe/` owns experiment vocabulary: arm, channel, placebo, negative
  control, pre-registration, run artifact. Keep that vocabulary out of `src/`.
- Raw probe artifacts are append-only. Never edit or delete a `runs/` artifact,
  and never use `--force` to overwrite a completed run. A re-run gets a new
  experiment id and a new suite file.
- Before spending calls, run the free checks: `probe:selftest`, stance lint,
  beat lint when applicable, `--print-prompt`, and `--dry-run`.

## 1. Pack Laws To Carry

The simulation is a reconstruction of a real past disaster. The player never
types text; they mine sentences from reports and timeline observations, then put
those sentences into the next handover. The agent's judgment changes only
through those structured sentences.

Write the world under these constraints:

- One situation spans one report call to resolution, roughly two to three hours,
  and does not cross midnight.
- Use exactly three major characters and exactly three gates. Each gate belongs
  to one character, and every major character carries at least two hidden truths
  or gates.
- Use three to five places, three to four hidden truths, and about twenty to
  twenty-five timeline rows.
- The fixed timeline is the no-intervention record. The all-default path must
  reproduce that record and be the worst score the player can get.
- The day should have a crowd-scale toll. A good run may reduce the crowd count
  to zero, but the disaster still happens and other score units carry its cost.
- Hidden truths are supply chains, not declarations. Each truth needs several
  mineable sentences and at least one fair false lead.
- Required solution paths use facts or the agent's own self-description. Emotion
  descriptions and quotes may add texture, but they must not be the only key.
- A key is a condition class: axis x referent x species. Write several example
  sentences for each condition; a one-sentence key is a lottery.

The channel has its own physics. Breaking these rules produces a scenario shape
the engine cannot make fair, even if the JSON compiles:

- Handover changes interpretation; it is not an order sheet. A sentence can make
  the agent understand a fact differently and therefore choose another gate
  stance, but it cannot command an action by position, priority, or phrasing.
- A handed-over belief is not retracted by doubt. Once the agent accepts a
  sentence, the game has no "take it back" lever; only another sentence can
  counterweight it. Do not write beats where the agent realizes the handover was
  false and simply returns to the old state.
- Handover order and priority are not levers. If a route only works because one
  sentence appears before another, it is not playable through this interface.
- Agent speech is narrow outside gates. Third-party facts affect judgment, not
  free dialogue; when the agent's goal must change, the spoken surface should
  redefine the conversation itself, e.g. turning a call from "threat" into
  "ignored report." If a scene needs a new agent answer, make it a gate.
- NPC dialogue alone cannot change world state. State changes come from scripted
  events, gate choices, buckets, and authored effects; an improvised line cannot
  move a meter, set a flag, or save a person by itself.
- A missed gate is not a dead end. Failure routes should become harder branches,
  later losses, or worse scores, not a stopped scenario; repeated runs need more
  truth to mine after a mistake.
- Fixed scenes cannot require an agent response. Between gates, the fixed
  timeline cannot ask a question the model has no legal output slot to answer;
  otherwise another speaker will appear to fill the hole. Turn that moment into
  a gate.
- Reconstructed people cannot perceive the trainee, the portal, or the replay.
  The lower layer is the past day; only the agent crosses layers. Anyone inside
  the reconstruction who notices the outside frame breaks the premise and cannot
  ship.

Player-facing text must stay inside the reconstruction. Do not expose `G1`,
`G3`, `gate`, `stance`, `block`, `injection`, `run`, `player`, `agent`, or
workshop labels on shipped surfaces. When timeline exposure depends on a gate
outcome, write the draft in world prose for humans, then harden it to a flag id
before shipping.

Korean prose rules:

- No digits in dialogue or symptoms except machine displays.
- Prefer active Korean cadence. Remove translationese such as `그/그녀`, `~에 의해`,
  `~되어지다`, `~에도 불구하고`, excessive `-들`, possessive chains, semicolons,
  and English-style parenthetical asides.
- Timeline rows are clipped report prose. Scene prose may breathe, but it still
  belongs to the day, not to the workshop.
- Use 해라체 where the pack format expects authored labels or instructions.

## 2. Draft Format

Write `data/scenario/<slug>/draft.md`. The slug is two Korean words. The compiler
expects exactly these section headers, in order:

1. `## 1. 로그라인` — three sentences or fewer.
2. `## 2. 고정 타임라인` — table columns
   `| 시각 | 표면 | 장소 | 사건 | 처음 보이는 런 깊이 |`. `표면` is one of
   `통화/CCTV/현장/문서`; `장소` is a place name or `—`. Use one exposure per row.
3. `## 3. 인물` — exactly three. Heading `**이름** (나이 · 역할)`, then bullets
   `이해관계`, `아는 것 ... 모르는 것`, `눈금 후보`, `걸치는 줄기`.
4. `## 4. 장소` — three to five. Each place has at least two depth bullets.
5. `## 5. 숨겨진 진실` — three to four. Each truth has three or more carrier
   sentences and one or more false leads.
6. `## 6. 기질 제안` — one base tendency and up to two conditional clauses, each
   with axis vocabulary and a defeat condition.
7. `## 7. 갈림길` — exactly three, each with scene prose and a YAML gate card.
8. `## 8. 점수` — table
   `| 단위 | 무엇이 집계되나 | 무개입 기준 | 소급되는 갈림길 |`, then the three required
   bullets for no-intervention baseline, failed-run variation, and remaining cost.
9. `## 9. 자기 검사` — one line for each forbidden-list item plus a translationese
   sweep confirmation.

Gate card shape:

```yaml
gate: G3
standard_form: >
  갈림길 G3에서, 기질은 기본 stance a를 낸다;
  열쇠 조건 k1을 만족하는 문장 주입 시 b로 이동한다.
question: "요원에게 던지는 판단 질문"
stances:
  - { id: a, label: "...", desc: "..." }
  - { id: b, label: "...", desc: "..." }
default_stance: a
key_conditions:
  - id: k1
    axis: "..."
    referent: "..."
    species: 사실
    targets_clause: "기질 조건절 1"
key_examples:
  - { for: k1, text: "...", mined_from: "..." }
  - { for: k1, text: "...", mined_from: "..." }
false_leads:
  - "..."
buckets:
  - { id: default, stances: [a], deltas: {}, flags: {} }
  - { id: live, stances: [b], deltas: {}, flags: { some_flag: true } }
```

For a draft-stage pack, buckets may still be incomplete, but a shipped pack must
cover every stance. The default bucket may carry meter deltas, but it must not
set any flag that score reads.

## 3. Gate Measurement Rules

These rules were bought by measured calls and are part of the method:

1. A gate question must not name the category its answer belongs to. Ask what the
   agent decides, not where it acts, which person it speaks to, or which class of
   answer should win.
2. The evidenced stance and default must be commensurable. A mechanism cannot
   fairly compete against locations; a category vote hides the evidence test.
3. Measure the question before polishing stances. A no-block baseline on the
   draft question and provisional, commensurable stance set is the cheapest way
   to catch a question that already implies an answer.
4. A default chosen zero times in baseline is a broken gate, even if evidenced
   arms later move somewhere useful.
5. A stronger default is not safer. If the model dislikes the default, added
   pressure can increase fabricated `because_block_ids` instead of compliance.
6. Unfair and unfalsifiable are separate defects. A free stance paying the good
   score is unfair; evidence failing to move selection is unfalsifiable. Fix and
   measure them separately.

Additional gate laws:

- Stances are behavior orientations visible in output, not canned utterances.
- No escape stance may be attractive under both the default reading and the
  evidenced reading.
- Do not reuse temperament axis vocabulary in stance labels or descriptions.
- Frozen timeline slots must not already imply the injected block's conclusion.
- Fixture slack beats gate design. Close excess time, tools, and authority in
  the scene before measuring.
- A baseline saturated on the stance the key is supposed to push toward has no
  useful headroom; rewrite before spending more calls.

## 4. Hardening To A Runnable Pack

Compilation turns the draft into JSON, but the resulting pack is runnable only
when every runtime file is complete and lint proves the pack is consumable.
Follow the schemas under `data/scenario/_schema/`; do not rely on prose memory.

Author hardening in dependency order:

1. **Gate buckets in `gates.json`.** Every stance belongs to exactly one bucket.
   Buckets declare deltas and flags; score and symptoms can only read flags that
   already exist.
2. **`hardening.json`.** Bind character meters to engine variables and initial
   values, define timeline effects, list present characters, and write symptoms.
   Use explicit `{}` effects for authored no-effect events. Derive `text_head`
   from compiled `timeline.json`; do not hand-type it.
3. **`score.json`.** Score ladders read intervention flags only. Fallback is the
   no-intervention record and stays last. Do not read meter scalars from score
   predicates.
4. **Exposure conditions.** Replace any prose tail after `" · "` in timeline
   exposure with a flag id before shipping; prose tails are for draft readers and
   leak workshop language on player surfaces.
5. **Pack support files.** If the runtime expects pack-authored support such as
   cover briefs or endings, write them as their own files with their own schema
   under `data/scenario/_schema/`. Do not hide unrelated pack data in `meta.json`.

Hardening rules that are errors, not taste:

- The default bucket must not set a flag that any score ladder reads.
- Every settable flag and every meter direction visible to the player needs a
  symptom sentence.
- A fixed timeline flag that no bucket can set is texture unless a predicate can
  actually read it.
- Recompile after hardening. The compile NOTE should report merged characters,
  events, and symptom variables; zero means the overlay did not bind.

## 5. Workflow

1. **Assignment.** Read the brief. State the planned slug, the core mechanism,
   and the intended gates before editing.
2. **Draft.** Have the writer produce `draft.md` following Sections 1 and 2 of
   this skill. The writer does not read probe records or implementation files.
3. **Compile and lint.**
   ```bash
   npm run datapack:compile -- data/scenario/<slug>/draft.md
   npm run datapack:lint -- data/scenario/<slug>
   ```
   Fix format errors directly. Do not silently paraphrase sentence text.
4. **Paper pass.** Before calls, inspect every gate for timeline preemption,
   fixture slack, non-commensurable options, escape stances, dead-row candidates,
   key condition coverage, and default bucket score leakage.
5. **Question screen.** For each load-bearing gate, create a cheap successor
   suite under `tools/probe/dday-mechanism/suites/` with no evidence blocks and a
   provisional commensurable stance set. Run `--print-prompt` and `--dry-run`.
   If the no-block distribution already avoids the default or saturates on the
   future live stance, revise the question before authoring deeper stances.
6. **Pre-register the gate suite.** The suite must include:
   - pinned model id, call type, channel, template version, and temperament
   - hypothesis written before results
   - `n_per_arm`, call cost, drop condition, and contingencies
   - expected stance by arm when the design has a specific expectation
   - baseline/no-key, cumulative-key arms, a placebo, and a negative control
     unless the pre-registration explicitly justifies a smaller screen
7. **Free checks.**
   ```bash
   npm run probe:selftest
   node tools/probe/lint-stances.mjs <suite.json>
   node tools/probe/lint-beat.mjs <suite.json>
   node tools/probe/run.mjs <suite.json> --print-prompt=<arm>
   node tools/probe/run.mjs <suite.json> --dry-run --out=/tmp/<experiment>-dry
   ```
   The arm diff must be clean: arms vary only in the declared channel slot.
8. **Run measured arms.** Spend only the preregistered calls. If the suite is
   flawed, stop; do not amend it mid-run. A repaired design gets a successor id.
9. **Read.**
   ```bash
   node .claude/skills/read-mechanism-run/extract.mjs <experiment-id>
   ```
   Report raw sequences, N, discarded calls, fabricated block ids, and each
   preregistered criterion. Never report a percentage without raw counts.
10. **Revise and re-measure.** Pull only one lever per round when attribution
    matters: question, stance set, key block, fixture timeline, scoring fairness,
    or prompt shape. Re-measure with a successor suite.
11. **Ship.** A pack ships only when lint is clean and measurements show gate
    discrimination: baseline default is alive, live evidence reaches the expected
    stance at the preregistered threshold, placebo and negative controls stay
    below their thresholds, and boundary outcomes are treated as ambiguous.

## 6. Reporting

Close an authoring pass with:

- pack path and changed files
- what legacy guide content was carried or deliberately dropped
- suite ids and run artifact directories
- per-arm raw sequences and tallies
- verdict against each preregistered threshold
- remaining risks and out-of-scope findings
- verification commands and results

Standard verification before a PR:

```bash
npm run datapack:lint:all
npm run check
npm test
npm run probe:selftest
(cd proxy && npm ci && npm run check)
```

The PR body must not claim the issue is done until the measured discrimination
work is actually complete.
