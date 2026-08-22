# Agent Work Orchestration

This document describes how agent work is run in this repository during the
current competition phase. It is process documentation, not a product spec:
when it conflicts with `AGENTS.md`, `AGENTS.md` wins.

The current phase and repository move are recorded in
`planning/meetings/2026-08-10-openai-pivot.md`; do not use the previous
competition rulebook as authority for this workflow.

## Seats

### Coordinator

The Coordinator owns the orchestration Run and the task DAG. It decomposes
work into issue-backed tasks, writes the task's explicit out-of-scope list with
the reason for each exclusion, resolves decision gates, and relays review
verdicts between seats.

The Coordinator writes no repository files. Its output is the task brief,
decision text, and review routing.

### Implementer

The Implementer owns every repository change: commits, pushes, PRs, and issue
comments that record implementation reasoning. In this repository, that seat is
Codex.

The Implementer starts from an issue, assigns itself before the first commit,
posts its reasoning into the issue thread before editing, works on a branch, and
opens the PR. If the task is ambiguous or would grow past the issue's declared
touch set, the Implementer reports back instead of widening the diff.

### Reviewer

The Reviewer is a second Codex session in its own worktree. It is review-only:
it never edits files, commits, merges, or fixes the branch it is reviewing.

The Reviewer posts findings on the PR. Findings are ordered by severity and
grounded in file and line references. The Implementer fixes the branch and asks
for re-review until the Reviewer reports no blocking findings.

## Cycle

The normal cycle is:

1. Issue.
2. Task dispatch.
3. Implement.
4. PR.
5. Review.
6. Fix.
7. Re-review.
8. Merge.

The review/fix loop repeats until the Reviewer reports no blocking findings.
Merge happens only after that loop is clean and the branch satisfies the
repository's verification requirements.

## Review Checklist

Review starts with the highest-cost failures, not with style:

1. **Identity and trace scan.** Check added lines, commit messages, and the PR
   body against `AGENTS.md` rule 1. A merged trace is permanent because main
   history is never rewritten.
2. **Scope.** Compare the diff against the issue's declared touch set and
   out-of-scope list.
3. **Correctness.** Check behavior, data flow, tests, and documentation claims
   against the owning spec or issue thread.
4. **Deploy safety.** Check `AGENTS.md` rule 3: `main` must remain deployable,
   and the live Pages build must not be broken by the merge.

## Scope Discipline

Every task carries its out-of-scope list and the reason each item is excluded.
Adjacent fixes are reported, not made, unless the Coordinator explicitly absorbs
them into the current task before implementation.

PR #21 is the live example. It was scoped as the canonical Pages URL task, but
it also updated issue #13's proxy origin scope before that absorption was
recorded. The code change was coherent, but the silent scope expansion damaged
the one-issue-one-PR trail that `git log baseline-claude..HEAD` is read through.
The repair was to update the PR body, close #13 with the rationale, and keep the
absorbed work visible in the issue graph.

## Attribution

Author and committer identity stay the personal identity required by
`AGENTS.md` rule 1. Codex authorship is carried by a real what/why commit body,
because `AGENTS.md` rule 4 makes commit history part of the competition record,
plus this trailer:

```text
Co-Authored-By: Codex <codex@openai.com>
```

The older `[AGENT: ...]` convention mentioned in prior drafts was never used in
any commit and is not a precedent for this repository's current work.
