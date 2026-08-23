# Central Control Room Operator Onboarding

*긴급상황대응실 운영자 임용을 축하합니다*

> A concept document. What the game is about, what the player does, and what it
> should feel like — carrying as few constraints as the concept can survive
> with. The interface is being redesigned from scratch and this is the input to
> that, not a description of what exists today.

## The premise

A disaster already happened. You were not there.

You are a newly appointed operator at an emergency response centre. Before you
are allowed near a live line, the institution sits you at a training terminal
and replays the worst night in its recent history — a real incident,
reconstructed from the radio logs of the field agent who was there — and asks
you to do better.

You cannot go to the scene. Operators never do. What you can do is dispatch a
field agent into that night and listen to their radio.

And then, when the night is over and the count is in, you can do the only thing
this job actually consists of: **write a handover for the next agent.**

## What the player does

Four beats, and the player's hands are only on the fourth.

**1 · Watch.** The night runs. The agent's radio comes in — what they see, what
they're told, what they decide, and the small physical tells of a person under
pressure. Events land on their own clock. You cannot intervene, you cannot pause
the world into submission, you cannot tell the agent they are about to make a
mistake. You watch them make it.

**2 · Count.** The ledger prints. It is a body count, and it is specific — not a
score out of a hundred, but how many of the people inside did not come out,
broken down by where they were found and who they were. The untouched night's
numbers sit next to yours, so you always know what your interference was worth.

**3 · Read both truths.** Two documents arrive. One is the objective record —
what happened, no interpretation. The other is the agent's own report — what
*they* thought was happening, in their own voice.

They do not agree. That gap is the game. The record says the night duty officer
took a beat too long to answer; the agent's report says he was cooperative.
Something in that person made them read it that way, and you are never told what.

**4 · Write the handover.** You mine sentences out of both documents — not
paraphrase them, not summarise them, *take them* — and place a few into the
handover section of the next agent's file. Then you commit it, irreversibly.

A different agent walks into the same night carrying the sentences you chose.
You have a finite number of agents. Then the terminal grades you.

## You never control anyone. You only change what someone believes.

The agent is not an avatar and not a unit. They are a person with a way of
judging things that you cannot see, cannot read, cannot edit, and are never told
about. There is no stat block, no portrait and no character sheet anywhere in
this game — the two reports are the only channel through which a person is
knowable. Two agents given the same night and the same handover will not
necessarily do the same thing, because they are not the same person.

So the sentences are not commands. They are *beliefs you are installing*. And a
belief only bites if it lands on the axis that particular person is already
watching. Telling an agent "the voice on the phone is a hired reader, not a
threat" does nothing for an agent whose instinct trips on fear rather than on
threat — you have to tell them the caller is *frightened*. The same fact, aimed
differently, and one of them is worth eleven lives.

You learn this the way you learn anything here: you get it wrong, you read the
report, and you see the sentence you chose quoted back at you as the reason for
a decision you did not want.

## The three cruelties

The design lives or dies on three specific unpleasant feelings.

**Helplessness while it runs.** The night is not interactive. There is nothing
to press. The urge to reach into the screen and say *ask him how many people are
in there* is the entire motor of the game, and it has to be frustrated
completely. Any control that appears during a run — even a comforting one —
drains it.

**Complicity in the count.** The number is people, and the game says so in
words, not in a bar. The player is meant to feel that the difference between the
two numbers went through their handful of sentences.

**The politeness of the institution.** Everything is phrased as personnel
administration. You are *congratulated on your appointment*. Your performance
becomes *part of your personnel record*. The disaster is a *training exercise*.
The terminal is unfailingly courteous about a night that killed people, and it
never once raises its voice. The horror is bureaucratic, not gothic.

## Tone

Late-shift, institutional, unglamorous. A government emergency-response bureau,
a numbered terminal, a badge, a clearance grade. The disasters are domestic and
mundane in their causes — a fan somebody switched off to save a bearing, an
emergency exit chained shut after a theft, and nobody counting the people inside.

**There is no spectacle to draw.** No map, no site plan, no character portraits,
no cutaway of the collapsing roof. The entire game is documents, a radio and a
tally — a deliberate choice, not a budget. This is a text detective story
wearing the clothes of a workplace tool, and the art direction is typography and
document craft or it is nothing.

Content is Korean prose, and Latin equipment codes, callsigns and clock stamps
sit inside nearly every sentence. **There is no line in this game that is purely
one script.** A single line of it looks like this:

> 한내돔은 공기 압력으로 지붕을 띄우는 막구조이며, 급기 송풍기는 두 대, 출입구는 남측 회전문 한 곳으로 확인했다. 정기점검 확인란이 두 해째 비어 있다.

## What the player is looking at

**Three working surfaces, and the player needs all three at the same time.**

That is not a layout preference, it is the loop. Mining is a *movement* — a
sentence leaves the record and lands in the file — so the record and the file
have to be in view together. And the night is deliberately still printing its
last minutes when the report and the count land on top of it, so the night and
the record are co-visible by design.

Whether they are draggable windows, fixed panes, or something with no precedent
is entirely open. That there are three of them, at once, is not.

**1 · The night, as it happens.** Lines arrive one at a time, typed, over a
minute or two — full Korean sentences, some of them long. Time-stamped,
unresponsive, the one surface with nothing to press. Half a dozen kinds of line
have to be tellable apart at a glance: the world, the agent, a named voice, the
agent's own body, a stall on the line, a system failure. Today they are nearly
uniform, and that is the most-cited defect in the shipped build. The agent's
decisions are generated live, so the waiting has to sit inside reading time and
inside the fiction of a radio line — never as a spinner on an empty screen.

**2 · The record, and what you take out of it.** Two documents read against each
other: a terse objective one of two or three sentences, and the agent's own
report, a few hundred characters of hedged prose. Every sentence in both is an
individually selectable target, and taken ones stay visibly taken. Taking one
should feel like tearing paper, not like ticking a checkbox — it is the game's
one tactile pleasure. Previous runs stay reachable. The count lands here too
when the night closes, several rows of it, and a row's value may be a number or
a whole phrase — 「생존 · 발목이 부러진 채 북측으로 걸어 나온다」 — set against
what the untouched night did on the same axis. It waits for the night to finish
printing the beats it is about: nothing may show a result above a surface still
printing its cause. This is where the game is actually played, and currently the
least designed surface in it.

**3 · The file you are writing.** The next agent's identity, the fixed briefing
they carry, and the handover slots — a small fixed number, four today, each
holding a **whole sentence** of a hundred-odd Korean characters. Not a label,
not a tag. The commit lives here, with its confirmation and its point of no
return. Between committing and the next report arriving the file is locked — the
only surface in the game that goes dead, and the design should say something
about that rather than leave it merely disabled.

**Nothing on any of these surfaces is a text field.** Every input in this game is
a press on something the game itself printed. No search box, no note, no chat,
no rename, nowhere. It is the premise made mechanical — you are outside the
simulation and you cannot speak into it — and it is the one thing a designer can
break without noticing.

**Nothing should be sized to one incident.** The scenarios differ from each
other more than you would expect: a night is three hours or twelve, has three
decision points or seven, ends in a four-row ledger or a nine-row one. More are
being written.

## Around the three

1. **A way in that establishes who you are.** The player arrives as a person
   with a badge at an institution with a name, before they see any game.
2. **A way for the institution to speak.** Briefings, instructions, warnings,
   verdicts, and the guidance that teaches the loop. The same voice throughout,
   recognisably the same object each time — the document that hands you the
   terminal is the document that takes it back.
3. **State the player can always read:** which incident, who they are, where in
   the night they are, and how much of their allotment is left.
4. **A way to choose the incident.** *(Not built yet.)* Several scenarios at
   graded difficulty, picked without being spoiled on them.
5. **A way to walk away from a night in progress.** *(Not built yet.)*
6. **A way for the system to admit failure.** The agent's judgement is a live
   model call. When it fails, the game says so in its own voice rather than
   breaking.

## Anti-goals

- Not a chatbot, not a prompt sandbox, not a "write the system prompt" toy.
- Not a puzzle with a lookup-table answer. The same sentences are not guaranteed
  to produce the same night.
- Not disaster spectacle. Nothing burns on screen.
- Not a dashboard. It is paperwork with a body count, and the density is the
  point — but density is not the same as clutter, and the current build has
  confused the two.
