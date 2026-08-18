# AGENTS.md — ccr-op-onboarding

Guidance for Codex and other agent sessions working in this repository.

## What this repo is

Competition entry for **OpenAI Game Builders Seoul**, Track 1: `긴급상황대응실 운영자 임용을 축하합니다` (English working title: *Central Control Room Operator Onboarding*). The NHN AI Game Competition build is complete; this phase extends and presents the game for OpenAI Game Builders Seoul. Track 1 submission is due **2026-08-26 EOD**.

`baseline-claude` marks the final pre-competition commit. Everything after that tag is competition-period work and feeds the Codex-utilisation writeup.

## Where are we now?

This file holds permanent rules. `docs/status.md` records mutable project state, but it currently still reflects the NHN phase; read it before work, then verify current facts from the repository and issues.

## Hard rules

1. **Git identity — personal only, and no corporate trace.** Commits must be attributed to personal accounts (repo owner-equivalent: `alstjgg`), never corporate identities. Check `git config user.email` (repo-local) before committing; it should resolve to the `alstjgg` account, such as its GitHub noreply address, not a corporate one. A session may run on a corporate subscription when personal token limits require it. That is a billing fact, and **it must leave no trace in the repo.** No corporate account name, username, email, domain, hostname, machine name, ticket id, or internal-tool reference in any commit message, trailer, document, PR or issue body, or review comment. `gh` must act on `github.com` as `alstjgg`, never through another host. Grep the staged diff before committing: once it is on `main`, rule 2 means it cannot be taken back. Discussing the rule — the word "corporate" itself — is fine; a corporate *identifier* is not.
2. **Never rewrite `main` history.** Commit history is a competition deliverable. No force-push, no rebase of pushed commits, no history rewrites.
3. **`main` stays deployable.** Every merge to `main` triggers the GitHub Pages deploy (`.github/workflows/deploy.yml`). If the live site (https://chabaak.github.io/ccr-op-onboarding/) breaks, fixing it takes priority over everything.
4. **Do not move, delete, or re-point `baseline-claude`.** `git log baseline-claude..HEAD` and `git diff baseline-claude..HEAD` are the source for the Codex-utilisation writeup. Commit messages state what changed and why; judges may read them.
5. **Pin `GH_HOST=github.com` on every `gh` invocation.** Another host may be authenticated on this machine and must never be used for this repository.
6. **`.claude/super/` is gitignored** (super-pipeline runtime state). Never run, edit, or commit anything under it. Treat the rest of `.claude/` as another tool's config and keep it intact.
7. **Every external or AI-generated asset** (image, sound, font, etc.) gets an entry in `assets-manifest.json`: `{file, source/tool, prompt (if generated), license}`. This feeds a mandatory competition document. No exceptions, no "add it later".
8. **No secrets in the repo.** LLM API keys and private credentials live in env vars or deployed infrastructure. `.env.production` is public by design and documented as such; it is not a secret.

## Design constraints that affect code

- **Four roots, four jobs.** `src/` is what the bundle ships; `proxy/` is a separately-deployed tier that may not import `src/`; `tools/` is Node-only and never reachable from `index.html`; `authoring/` runs before any of them exist. Experiment vocabulary (arm, channel, placebo, harness) belongs to `tools/probe/` and nowhere else.
- **Production phase structure:** the selected game is built at the repo root. The demos under `demos/<slug>/` are competition history and are not extended. The root's physical layout (module boundaries under `src/`, where Node-side tools and the proxy live) is bound by `docs/spec-physical-architecture.md`; do not restructure the root ahead of that document.
- **The membrane rule:** the player never types free text to an LLM. All LLM input is composed from structured game elements (blocks/cards/items/telemetry). Do not build text-input UI for AI features. Prompt-injection "combat" is not an exception: those attacks are performed by the **agent the player built**, not by the player typing. The player shapes the agent from structured items, and the agent acts. The membrane holds.
- **Runtime LLM calls** go through the proxy backend, never directly from the client with an embedded key. Latency must hide in natural game pauses (between rounds/waves); never block mid-action gameplay on an LLM response.
- **Balance-as-data:** all tunables (stats, timings, costs, spawn tables) live in `data/` as JSON/TS data, never inline in logic. `data/` holds inputs; `artifacts/` holds measurement outputs.
- **Judge experience is the optimization target:** page must load in about 1s on mediocre wifi; the first 60 seconds of play must carry the game.

## Working through issues

Every change starts from an issue, and the issue is a **coordination surface**, not a queue. The board is read to find out what the other person is touching.
For the seat-level Coordinator / Implementer / Reviewer flow, see [`docs/orchestration.md`](./docs/orchestration.md).

1. **Assign yourself before the first commit.** Always, without exception. This single act is what prevents two people building the same thing; the issue itself prevents nothing. If the work has no issue, open one (`file-issue`) and assign it before editing.
2. **Post your reasoning into the issue thread before implementing.** For a bug: why it happens, where the cause is, how you propose to fix it, and how far the blast radius reaches. For a feature: what you considered and what you discarded. Name real files and line numbers. Dead ends included.
3. **Never open an issue without searching the open issues first.** A duplicate issue is the collision problem wearing a different hat.
4. **An issue declined after discussion is closed with its reasoning** (`wontfix` + a closing comment), never deleted.
5. **The closed issue is the record. Do not copy it into a knowledge document.** There is no `DISCOVERY.md` here and there is not meant to be. The one exception is a finding that changes *how work is done*: that goes into this file as a single line, because this file is read every session and therefore cannot go stale unnoticed.

## Sequencing

Do not batch work into a list and execute the list. Fixing one thing surfaces more things, and building on a shape that is about to change is waste.

- **Under an hour:** just do it. File the issue, do not queue it.
- **Structural** (other work will be built on top): does not go in the queue at all. It is decided and landed *first*, and it is labelled `structural` so its cost is visible as urgency rather than as size.
- **Everything else:** issue, triaged in batch.

## Scenario authoring

The scenario factory (`write-scenario`) is fed a **brief**, and the writing agent's isolation is a hard rule, not a preference:

> **Read no other document in the repository.** No specs, reports, meeting notes, or other drafts. Everything needed is in the brief and the guide.

Technical vocabulary seeps into the prose and the scenario dies. This rule survives every migration and refactor of the skill.

## Deprecating a scenario pack

Packs are load-bearing beyond their own directory. Before deleting one, check what plays it — at minimum the acceptance rig (`tests/acceptance/fixtures/rig.ts`), the DEV-mode fixtures, and the e2e font rendering samples. **Order: produce the replacement pack, repoint every consumer, then delete.** Deleting first removes the means of verifying the replacement.

## Deliverables this repo owes

Track 1 of OpenAI Game Builders Seoul, due **2026-08-26** (target submit 2026-08-25):

- a public browser-playable link, no login
- a 16:9 thumbnail (JPG/PNG, <=10 MB)
- title and a 200-character description
- a demo video under 3 minutes (optional, but Presentation is scored)
- a Codex-utilisation writeup (optional, but Codex Collaboration is scored; treat it as required)

Judged on: Playability, Originality, Codex Collaboration, Release Potential, Presentation. When a change cannot be argued to serve one of those five, that is information about the change.

## Commands

Standard Vite/npm scripts (`dev`, `build`, `preview`, `check`) are in `package.json`. The non-obvious ones:

```bash
npm run datapack:compile -- <draft.md>        # authoring stage 1
npm run datapack:lint -- data/scenario/<slug> # authoring stage 2
npm run probe:selftest                        # probe runner, offline, no key
npm run probe -- <suite.json> --dry-run       # probe runner, no charge
```
