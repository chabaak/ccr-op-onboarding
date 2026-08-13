---
name: file-issue
description: Turn the discussion that just happened into a GitHub issue — or into a comment on the issue that already exists. Use after investigating a bug, shaping a feature, or deciding an idea is worth recording. Searches open issues for a duplicate before opening anything. Args - `dup-check` (search and report only, open nothing) · an issue number (skip the search, comment on that issue).
---

# file-issue

The issue is not a ticket that will definitely be built. It is **a record of an
idea and the discussion around it**, and the board is read to find out what the
other person is touching. Both of those jobs fail the same way: a board nobody
can scan.

So the body is one sentence, everything else is a label, and it never grows —
the reasoning goes in the thread.

## 0. Before anything: do not duplicate

**Search open issues first, every time.** A duplicate issue is the collision
problem wearing a different hat — it is precisely the failure this board exists
to prevent.

```bash
gh issue list --state open --limit 100 --json number,title,labels,assignees,body
```

Match on the *thing being changed*, not on wording — same file, same window,
same pack, same mechanic. If a plausible match exists:

1. Say which issue and why you think it is the same.
2. **Offer to comment on it instead of opening a new one**, and default to that.
3. Only open a new issue if the human says they are different.

Skip this section when an issue number was passed as an argument.

## 1. The issue body

**One line. Nothing else in the body, ever.**

```markdown
**Want:** <one sentence, in terms of what the player sees or does>
```

`type` is a native **issue type**; `lane`, `cost` and `scores` are **labels**
(§2). Neither goes in the body: those fields are what the board filters on, so a
body copy is a second truth that will drift from the first.

- **Want** is player-facing. "Extract `SITE_OCCUPANTS` to pack data" is not a
  want, it is a task; the want is "the ending arithmetic is right on every
  case". If the issue genuinely has no player-facing surface (a migration, a
  test), say so plainly and use the `Chore` type.
- **Cost** — `S` under ~2h · `M` about half a day · `L` a day or more. The
  yardstick is that the joint window is two evenings after work, so `L` is a
  signal that the issue needs a decision before it needs a slot.
- **Lane** decides who picks it up and whether two issues can run at once. When
  an issue spans lanes, that is usually a sign it should be a parent with
  sub-issues (§3).
- **Scores** must name one of the five judging criteria. **An issue that cannot
  name one is not ready** — say so rather than inventing a plausible label.
  Bugs are exempt: a bug is always playability.
- **Status is not a field.** open/closed plus the assignee is the state; a
  `wontfix` closure is the record of a decision not to build. Never write status
  into the body.

## 2. Type, labels, assignment

Set the **issue type** at creation — `--type Bug` · `Feature` · `Idea` · `Chore`
· `Deliverable`. It is an organization field, not a label, so there is no
`type:*` label to apply and inventing one is wrong.

```bash
gh issue create --title "<t>" --body-file <f> --type Idea --label "lane:design,cost:S,scores:originality"
```

Apply `lane:*`, `cost:*` and `scores:*` as labels. Add `structural` when other
work will be built on top of this one — those are decided early and landed
early, never queued.

**Do not assign anyone.** Assignment is a claim, and the human makes it right
before they start. (The rule the board runs on: assign yourself before the first
commit.)

## 3. Big issues get sub-issues

When the work has independent pieces, open a parent and attach children rather
than writing a checklist in the body — sub-issues carry their own lane, cost and
assignee, which a checkbox cannot.

```bash
gh issue create --title "<parent>" --body-file <file> --label ...
gh issue create --title "<child>"  --body-file <file> --label ...
gh issue edit <child> --parent <parent>         # gh 2.94+; the flag is --parent
gh issue list --json number,title,parent        # verify the hierarchy took
```

Verified on gh 2.97.0. `--remove-parent` detaches a child.

Split a parent when the pieces differ in **lane** (they can run in parallel) or
in **reversibility** (one is structural, the rest are not). Do not split for
tidiness — a parent with one child is noise.

## 4. The first comment carries the reasoning

The body says what is wanted. The thread says how it was judged. Everything from
the second category goes in a **comment**, never in the body.

For a bug, the thread answers four questions:

- **why is this happening** — the mechanism, not the symptom
- **where is the cause** — a file and a line, not a subsystem
- **how do we fix it** — and what else was considered
- **what is the blast radius** — what else touches this

For a feature or an idea, the same shape: what was examined, what was discarded,
and why. **Dead ends are the most valuable part** — they are what stops the same
conclusion being reached twice.

```bash
gh issue comment <n> --body-file <file>
```

Name real paths with line numbers (`src/client/shell/ending.ts:69`) so the next
reader lands on the code instead of searching for it.

**The closed issue is the record.** Do not copy findings into a separate
knowledge document when the work lands — there is no `DISCOVERY.md` in this
repository and there is not meant to be. The single exception is a finding that
changes *how work is done*; that belongs in `AGENTS.md` as one line, because
that file is read every session and cannot go stale unnoticed.

## 5. Writing

Issues and comments are written in **Korean**, matching the rest of the planning
material. Code identifiers, paths and label names stay as they are.

Use `--body-file` rather than `--body`: GitHub renders single newlines as `<br>`
in issue bodies, so hard-wrapped paragraphs come out broken. **One line per
paragraph.**

## 6. Report back

Print the issue URL and the four fields as filed, so the human can see what was
recorded without opening a browser. If you declined to open an issue — duplicate
found, or no `Scores` could be named — say which, and stop.
