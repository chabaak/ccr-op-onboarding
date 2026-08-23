# Product Context

## What This Is

`긴급상황대응실 운영자 임용을 축하합니다` is a text-first training terminal game.
The player is a newly appointed emergency response operator replaying a past
disaster before being allowed near a live line.

The player never enters the scene. They dispatch a field agent into a
reconstructed night, read what the agent hears and decides, and later write a
handover for the next agent by selecting whole sentences from the record.

## Core Loop

1. **Watch.** The night runs on its own clock. Radio lines, observations,
   decisions, and physical tells arrive without player intervention.
2. **Count.** The ledger prints a specific body count and compares the run
   against the untouched night.
3. **Read both truths.** The objective record and the agent's own report arrive.
   They do not fully agree, and that gap is the game.
4. **Write the handover.** The player mines sentences from the record and report,
   seats a small number into the next agent's file, and commits them
   irreversibly.

The handover is not a command channel. It changes what a future agent believes,
and it only matters if the chosen sentence lands on the axis that agent is
already watching.

## Product Pillars

- **Helplessness while the night runs.** During a run, the player watches. Any
  control that looks like direct intervention weakens the premise.
- **Complicity in the count.** The result is people, named by where they were
  found and what happened to them, not an abstract score.
- **Institutional politeness.** The terminal speaks in personnel and training
  language around a night that killed people.
- **Documents as the interface.** There is no map, portrait, spectacle, or chat
  box. The game is radio, records, a handover file, and a tally.
- **No free text.** Every input is a press on something the terminal printed.

## Required Surfaces

- **The night.** A time-stamped feed of the reconstructed incident as it happens.
  This is the only surface with no direct action.
- **The record.** Sentences from the objective record and agent report, each
  individually selectable for mining.
- **The agent file.** The next agent's identity, fixed briefing, handover slots,
  commit control, and eventual tally.
- **Institutional notices.** Briefings, instructions, confirmations, warnings,
  guidance, and verdicts all need one recognisable institutional voice.
- **Entry and scenario selection.** The player arrives as a credentialed operator
  and can choose incidents without being spoiled on their solutions.
- **System failure.** Live model failures must be admitted in the terminal's own
  voice without breaking the run.

## Content Shape

The primary content is Korean prose mixed with Latin equipment names, callsigns,
and clock stamps. Lines are often long, and no line should be assumed to be
single-script. The interface must support dense reading without becoming a
dashboard.

Scenarios vary in duration, number of decision points, report length, and tally
size. The design must not be sized to one incident.
