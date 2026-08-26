// [u6] ReportView — spec-client §4 REPORTS row, §3 inv 5, latency rule 4.
//
// One tagged record column: objective facts and the agent's own report share
// one scroll surface, with their former document titles rendered as row tags.
// Ported from
// docs/design/phase2-ui/index.html lines 176..218 and app.js `renderReport()` /
// `typewrite()` (lines 505, 523). (x6 — the ledger rule the reference drew down
// the report side is gone; see `win-reports.css`.)
//
// THE TYPEWRITER IS A REPLAY, NOT A STREAM. The `report` event arrives whole —
// one event, already complete — and this module replays it sentence by
// sentence for the operator's benefit. Two consequences, both load-bearing:
//
//   • it owns no timer and no socket. The cursor is a pure function of elapsed
//     milliseconds, and the milliseconds come from the DRIVER's animation pump
//     (`registerAnimation`), which is exactly the surface `freezeAnimations()`
//     gates. Frozen animations ⇒ the whole body is present on the first paint.
//   • nothing here waits on the network to know what the document says.
import { animationsFrozen, registerAnimation } from '../driver/index.ts'
import type { Sentence } from '../driver/index.ts'
import { el } from '../shell/dom.ts'
import { callsignOf } from './dossier.ts'
import type { MarkSets, MinableState } from './minable-sentence.ts'
import { applyState, isMineKey, sentenceNode, sentenceState } from './minable-sentence.ts'

/** The `report` event as this window holds it (§5.2). */
export interface ReportModel {
  round: number
  facts: Sentence[]
  report_body: Sentence[]
  rounds?: readonly ReportRoundModel[]
  /**
   * R1 — ids in `report_body` that open a round after the sitting's first. The
   * record breaks a line before each. Absent on a single-round document.
   */
  opens?: string[]
}

export interface ReportRoundModel {
  round: number
  facts: readonly Sentence[]
  report_body: readonly Sentence[]
}

// H3 (08-09) — the typewriter itself moved to `components/typewriter.ts`. It
// was this module's outright while REPORTS was the only surface that typed;
// the AGENT FILE's handover now reveals at the same pace, and one desk may not
// have two typewriters running at two speeds. Re-exported here because
// `TypeState` and `TYPE_START` are part of this module's own published surface
// (`tests/windows/reports.test.ts` and the frozen-animation paths read them),
// and moving a definition is not a reason to move its callers.
import { REPORT_PACE, TYPE_START, typeCursor } from './typewriter.ts'
import type { TypeState } from './typewriter.ts'
export type { TypeState }
export { REPORT_PACE, TYPE_START, typeCursor }

/** The pump registration name — one replay at a time, per window. */
const PUMP = 'reports/typewriter'

/* x13 — THE 검인 CHOP IS GONE (민서, 08-10). `ChopState` and `chopDown()` stood
   here: the rule that weighed `sealed` (the day's `score` had landed), `received`
   (the sitting had filed something) and `typed` (the replay had run out), so a
   receipt went on the sheet when the transmission had actually been received.

   The rule was never the hard part; WHEN it first came true was. x5 stamped at
   the end of the round that had just typed itself out, which is the whole
   document only in a stream that files one report a day. x6 widened it to the
   sitting. x11 made the LIVE FEED type, x12 held REPORTS until the paper reached
   the round — and each of those moved the moment the three facts first stood
   together. The chop landed twice, then once but early. Three rules, three wrong
   moments, and no reproduction that survived a probe.

   So it is removed rather than re-timed. What it carried — "this transmission
   arrived" — is said by the transmission being on the page, and by the terminal
   record under it. The signature line `.sig-line` stays; it names who was on
   duty, which nothing else says. */

/** How many of the active report's sentences are mined — both panes, by id. */
export function minedCount(model: ReportModel, marks: MarkSets): number {
  return [...model.facts, ...model.report_body].filter((s) => marks.mined.has(s.id)).length
}

/**
 * W2 — a sitting plus one more round. Pure, and the ONE place the growth rule
 * lives: both panes append in arrival order and the model's `round` becomes
 * the latest one filed. `held === null` is the sitting's first round.
 *
 * Kept here rather than in `windows/reports.ts` because it is the only part of
 * "one sitting, one record" that can be proved under vitest's node
 * environment — the window itself needs a DOM.
 */
export function accumulated(held: ReportModel | null, slice: ReportModel): ReportModel {
  const round = {
    round: slice.round,
    facts: [...slice.facts],
    report_body: [...slice.report_body],
  }
  if (held === null) {
    return {
      round: slice.round,
      facts: [...slice.facts],
      report_body: [...slice.report_body],
      rounds: [round],
    }
  }
  // R1 — the id that OPENS this round, remembered so a redraw can break before
  // it. Omitted on the first round rather than set empty: the document a
  // sitting starts with is the slice itself, and `(a)` in the `[w2]` block
  // asserts exactly that identity.
  const opening = slice.report_body[0]
  const opens = held.opens ?? []
  return {
    round: slice.round,
    facts: [...held.facts, ...slice.facts],
    report_body: [...held.report_body, ...slice.report_body],
    rounds: [...(held.rounds ?? [{ round: held.round, facts: held.facts, report_body: held.report_body }]), round],
    opens: opening === undefined ? [...opens] : [...opens, opening.id],
  }
}

/* ── the DOM side ────────────────────────────────────────────────────────── */

export interface RenderOptions {
  /**
   * Whether this render is the document's FIRST arrival, and so the one the
   * replay belongs to. A re-render caused by anything else — the archive rail
   * gaining an entry when the next day opens, a re-selection on the rail —
   * repaints the document whole (R4 on windows/reports.ts:90). Defaults to
   * `true`: a caller that says nothing gets the arrival behaviour.
   */
  replay?: boolean
  /**
   * Whether this draw is a new arrival and should keep a reader already at the
   * tail with the sheet. Archive rereads do not move the scroll position.
   */
  follow?: boolean
}

export interface ReportView {
  /**
   * W2 — appends one round to the sitting already on the page. `slice` is the
   * new round alone (it is what replays); `whole` is the sitting including it,
   * which becomes the model the mined tally counts.
   */
  append(slice: ReportModel, whole: ReportModel, marks: MarkSets): void
  /** Draws a sitting's tagged record rows from scratch, replaying on first arrival. */
  render(model: ReportModel, marks: MarkSets, options?: RenderOptions): void
  /** Repaints every anchor's state and the mined tally, in place. */
  refresh(marks: MarkSets): void
  /** Plays the tear flash on one anchor, keyed by its authored id. */
  tear(id: string): void
  /** W3 — nudge one sentence: the action was refused, and the desk says so. */
  flash(id: string): void
  /** The round currently on the page, or `null` before the first report. */
  round(): number | null
  /** Re-brands the callsign surface under the tagged record rows. */
  brand(callsign: string): void
}

export interface ReportViewOptions {
  /** The window body the shell built — `.win-body.surface`. */
  host: HTMLElement
  /** The archive rail, built by `report-archive.ts` and mounted above the grid. */
  rail: HTMLElement
  /** Callsign series issued by the active pack. */
  callsignSeries: string
  /** Called with the authored id when the operator tears a sentence out. */
  onMine(id: string): void
}

interface Anchor {
  sentence: Sentence
  node: HTMLElement
  row: HTMLElement
}

interface ReplayTarget extends Anchor {}

interface ActiveReplay {
  unregister: () => void
  targets: ReplayTarget[]
  lengths: number[]
}

function reportRounds(model: ReportModel): readonly ReportRoundModel[] {
  return model.rounds ?? [{ round: model.round, facts: model.facts, report_body: model.report_body }]
}

/** The former document titles, now rendered as row tags. */
const FACTS_TITLE = '현장 기록'
const BODY_TITLE = '무전 기록'

/**
 * The window's own standing instruction, at the foot of both panes.
 *
 * x5 — was '문장을 누르면 뜯어내 요원 파일의 빈 칸에 앉힙니다', which described the
 * GESTURE. The gesture is discoverable (every sentence lights under the cursor
 * and the AGENT FILE's blank says where they land); what the operator has no
 * way to work out from the desk is that choosing well is the job. So the line
 * says the job.
 */
const FOOT_LEAD = '기록 중 주요 사항을 선정하여 다음 요원에게 인수인계 하십시오 · '
const FOOT_TAIL = '건 채굴됨'

const ROW_STATE_CLASSES = ['is-mined', 'is-slotted', 'is-carried'] as const
const FOLLOW_SLACK_MAX_PX = 32
const FOLLOW_SLACK_MIN_PX = 4
const FOLLOW_SLACK_RATIO = 0.25

function rowStateClass(state: MinableState): (typeof ROW_STATE_CLASSES)[number] | null {
  if (state === 'mined') return 'is-mined'
  if (state === 'slotted') return 'is-slotted'
  if (state === 'carried') return 'is-carried'
  return null
}

function applyRowState(row: HTMLElement, state: MinableState): void {
  row.classList.remove(...ROW_STATE_CLASSES)
  const cls = rowStateClass(state)
  if (cls !== null) row.classList.add(cls)
}

export function createReportView(options: ReportViewOptions): ReportView {
  const rows = el('section', 'rep-rounds')
  // Legacy mount target for the terminal record. Sentence rows are grouped by
  // round above it, so tutorial anchors land on the first source groups.
  const recordMount = el('article', 'doc-facts')

  const sig = el('div', 'sig')
  sig.setAttribute('aria-hidden', 'true')
  // x7 — the signature opens on `callsignOf(1)`, not on a literal `'ECHO-1'`.
  //
  // `brand()` is the real writer and it runs first thing in `drawDocument()`
  // (`windows/reports.ts`), so every document that reaches this sheet arrives
  // already signed and nothing below is ever read off a drawn page. What stands
  // here is the BLANK sheet's signature — the window mounts before the first
  // sitting is active and `drawDocument` returns early until it is — so it is
  // seen, briefly, at boot.
  //
  // Either way it may not be minted here. A second place that spells a callsign
  // by hand is a second place that can disagree with the AGENT FILE about who
  // the operator is watching, and the series has been renumbered under exactly
  // that assumption once already (see `components/dossier.ts`). The name has one
  // owner (D4 — the pack carries none); this window borrows it, unsigned sheet
  // included.
  const sigLine = el('span', 'sig-line', callsignOf(1, options.callsignSeries))
  sig.append(sigLine)

  const grid = el('div', 'rep-grid')
  grid.append(rows, recordMount, sig)

  const count = el('b', undefined, '0')
  count.id = 'minedCount'
  const foot = el('footer', 'rep-foot')
  foot.append(
    document.createTextNode(FOOT_LEAD),
    count,
    document.createTextNode(FOOT_TAIL),
  )

  options.host.append(options.rail, grid, foot)

  let anchors: Anchor[] = []
  let current: ReportModel | null = null
  let activeReplay: ActiveReplay | null = null
  const caret = el('span', 'caret')
  caret.setAttribute('aria-hidden', 'true')
  let attached = true
  let scrolledSincePin = false

  /** One tagged report row: [source tag] [sentence]. */
  function reportRow(sentence: Sentence, tag: string, marks: MarkSets): { row: HTMLElement; node: HTMLElement } | null {
    if (sentence.text.trim().length === 0) return null
    const state = sentenceState(sentence.id, marks)
    const node = sentenceNode(sentence, state)
    node.addEventListener('click', () => {
      options.onMine(sentence.id)
    })
    node.addEventListener('keydown', (event: KeyboardEvent) => {
      if (!isMineKey(event.key)) return
      event.preventDefault()
      options.onMine(sentence.id)
    })
    const row = el('div', 'rep-row')
    applyRowState(row, state)
    row.addEventListener('click', (event: MouseEvent) => {
      const target = event.target
      if (target instanceof Node && node.contains(target)) return
      options.onMine(sentence.id)
    })
    const cell = el('span', 'rep-s')
    cell.append(node)
    row.append(el('span', 'rep-stamp', tag), cell)
    anchors.push({ sentence, node, row })
    return { row, node }
  }

  /**
   * The operator asked for no motion, or the determinism gate is closed — in
   * both the document is already whole on paper.
   *
   * The third case used to be "the driver's pump has stopped", which is what
   * killed the beat: the run's own report is released in the same frame the
   * clock reaches the active pack's end stamp, so the ONE report a player
   * actually sees was the one that never wrote itself out (R4 on
   * windows/reports.ts:55). The pump now outlives the run
   * (`driver/fixture-driver.ts`), so there is no stopped-pump case left to
   * special-case.
   */
  function motionless(): boolean {
    if (animationsFrozen()) return true
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const followSlack = (): number =>
    Math.max(
      FOLLOW_SLACK_MIN_PX,
      Math.min(FOLLOW_SLACK_MAX_PX, grid.clientHeight * FOLLOW_SLACK_RATIO),
    )

  const atTail = (): boolean =>
    grid.scrollHeight - grid.scrollTop - grid.clientHeight <= followSlack()

  const rereadAttachment = (): void => {
    const tail = atTail()
    if (tail === attached) return
    if (!tail && !scrolledSincePin) return
    attached = tail
  }

  const followSheet = (behavior: ScrollBehavior): void => {
    if (!attached) return
    grid.scrollTo({ top: grid.scrollHeight, behavior })
    scrolledSincePin = false
  }

  grid.addEventListener(
    'scroll',
    () => {
      scrolledSincePin = true
      rereadAttachment()
    },
    { passive: true },
  )

  function paint(cursor: TypeState, targets: ReplayTarget[], follow = false): void {
    targets.forEach(({ sentence, node, row }, i) => {
      const current = i === cursor.sentence
      const visible = cursor.done || i < cursor.sentence || (current && cursor.chars > 0)
      row.hidden = !visible
      if (cursor.done || i < cursor.sentence) node.textContent = sentence.text
      else if (current) node.textContent = sentence.text.slice(0, cursor.chars)
      else node.textContent = ''
    })
    if (follow) followSheet(motionless() ? 'instant' : 'smooth')
    if (cursor.done || cursor.sentence >= targets.length) {
      caret.remove()
      return
    }
    targets[cursor.sentence]?.node.after(caret)
  }

  function finishReplay(): void {
    if (activeReplay === null) return
    const replay = activeReplay
    replay.unregister()
    activeReplay = null
    paint({ sentence: replay.lengths.length, chars: 0, done: true }, replay.targets)
  }

  function replay(targets: ReplayTarget[], animate: boolean, follow: boolean): void {
    const lengths = targets.map(({ sentence }) => sentence.text.length)
    // An empty document is not an unstamped one that will get there — it is a
    // sitting that has filed nothing, and there is no transmission to certify.
    //
    // Read off the SITTING (`current`), not off `sentences`: what replays here
    // is one round, and `append()` replays round 7 of a document that already
    // carries six. Both callers set `current` to the whole sitting first.
    if (follow) rereadAttachment()
    if (!animate || motionless()) {
      paint({ sentence: lengths.length, chars: 0, done: true }, targets)
      if (follow) followSheet('instant')
      // The frozen-animation / reduced-motion sheet is whole on its first paint,
      // so it is TYPED the moment it is painted — but it is not certified until
      // the sitting has closed. The seal rule is the same on both paths.
      return
    }
    paint(TYPE_START, targets, follow)
    let elapsed = 0
    const unregister = registerAnimation(PUMP, (realMs: number) => {
      elapsed += realMs
      const cursor = typeCursor(TYPE_START, elapsed, lengths, REPORT_PACE)
      paint(cursor, targets, follow)
      if (!cursor.done) return
      unregister()
      if (activeReplay?.unregister === unregister) activeReplay = null
    })
    activeReplay = { unregister, targets, lengths }
  }

  function tally(marks: MarkSets): void {
    count.textContent = current === null ? '0' : String(minedCount(current, marks))
  }

  function renderRound(
    round: ReportRoundModel,
    marks: MarkSets,
    options: { breakBefore: boolean; factsAnchor: boolean; bodyAnchor: boolean },
  ): ReplayTarget[] {
    if (options.breakBefore) rows.append(el('div', 'rep-break'))
    const group = el('section', 'rep-round')
    const facts = el('div', 'rep-group rep-facts')
    if (options.factsAnchor) facts.id = 'factsList'
    const targets: ReplayTarget[] = []
    for (const sentence of round.facts) {
      const built = reportRow(sentence, FACTS_TITLE, marks)
      if (built === null) continue
      const { row, node } = built
      facts.append(row)
      targets.push({ sentence, row, node })
    }

    const body = el('div', 'rep-group rep-body')
    if (options.bodyAnchor) body.id = 'bodyList'
    for (const sentence of round.report_body) {
      const built = reportRow(sentence, BODY_TITLE, marks)
      if (built === null) continue
      const { row, node } = built
      body.append(row)
      targets.push({ sentence, row, node })
    }

    group.append(facts, body)
    rows.append(group)
    return targets
  }

  return {
    append(slice: ReportModel, whole: ReportModel, marks: MarkSets): void {
      // W2 — the sitting grows. The document already on the page is NOT
      // redrawn: the new round's rows are appended, `anchors` accumulates (so
      // `refresh` still repaints every sentence the day has filed), `current`
      // becomes the WHOLE sitting (so the mined tally counts all of it), and
      // the replay runs over the new slice alone.
      finishReplay()
      caret.remove()
      current = whole
      const grown = renderRound(slice, marks, {
        breakBefore: rows.childElementCount > 0,
        factsAnchor: rows.querySelector('#factsList') === null,
        bodyAnchor: rows.querySelector('#bodyList') === null,
      })

      tally(marks)
      replay(grown, true, true)
    },

    render(model: ReportModel, marks: MarkSets, options?: RenderOptions): void {
      finishReplay()
      caret.remove()
      anchors = []
      current = model

      rows.replaceChildren()
      const replayTargets: ReplayTarget[] = []
      let factsAnchor = true
      let bodyAnchor = true
      reportRounds(model).forEach((round, index) => {
        replayTargets.push(...renderRound(round, marks, { breakBefore: index > 0, factsAnchor, bodyAnchor }))
        factsAnchor = false
        bodyAnchor = false
      })

      tally(marks)
      replay(replayTargets, options?.replay ?? true, options?.follow ?? false)
    },

    refresh(marks: MarkSets): void {
      for (const anchor of anchors) {
        const state = sentenceState(anchor.sentence.id, marks)
        applyState(anchor.node, state)
        applyRowState(anchor.row, state)
      }
      tally(marks)
    },

    tear(id: string): void {
      const anchor = anchors.find((a) => a.sentence.id === id)
      if (anchor === undefined) return
      const node = anchor.node
      node.classList.add('tear')
      node.addEventListener(
        'animationend',
        () => {
          node.classList.remove('tear')
        },
        { once: true },
      )
    },

    flash(id: string): void {
      const anchor = anchors.find((a) => a.sentence.id === id)
      if (anchor === undefined) return
      anchor.node.classList.remove('refused')
      void anchor.node.offsetWidth
      anchor.node.classList.add('refused')
    },

    round(): number | null {
      return current === null ? null : current.round
    },

    brand(callsign: string): void {
      sigLine.textContent = callsign
    },
  }
}
