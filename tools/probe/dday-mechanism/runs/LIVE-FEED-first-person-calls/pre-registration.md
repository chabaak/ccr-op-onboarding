# LIVE FEED First-Person Narration Arm

## Arm

One full run of `멈춘회전문`, measured only at Call 2. The run uses the active
narration template `v0.5` after the LIVE FEED voice rule was added: rendered
`event_lines` and `timeline_entries` are the agent's own record, so the agent is
the writer and never the subject of those lines.

The shipped pack has 31 beats. The engine contract emits one narration call per
beat, so this arm spends exactly 31 live Call 2 requests. Gate judgment and
reporter calls are not measured in this arm.

## Metric

For each accepted Call 2 payload, count rendered `event_lines[].text` and
`timeline_entries[]` rows in which the agent is the grammatical subject.

The pre-registered detector flags the following forms in rendered feed rows:

- `요원은`
- `요원이`
- `요원의`
- `요원을`
- `나는`
- `내가`
- `나의`
- `나를`

The count is the total number of flagged rendered rows across the 31-call arm.
`npc_lines` are not part of this metric because they are dialogue, not LIVE FEED
event/reaction rows.

## Acceptance Threshold

Acceptance threshold: `0` flagged rendered rows.

## Refutation

The fix is refuted if this single pre-registered arm produces `1` or more
rendered `event_lines` or `timeline_entries` rows where the agent is the
grammatical subject under the detector above.

If that happens, stop and report the result. Do not retry the arm, widen the
prompt, or discard the transcript.

## Baseline Position

This is a single-arm post-change measurement with no pre-change comparison. A
clean result can support only this claim: narration `v0.5` with the new rule
produced zero flagged third-person or first-person agent-subject LIVE FEED rows
in this 31-call shipped-pack run.

It cannot by itself attribute causation to the new rule, estimate the pre-change
rate, or prove the defect impossible.
