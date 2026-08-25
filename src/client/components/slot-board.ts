// SlotBoard — §4 인수인계 사항: the membrane the operator actually operates
// (spec-client §6 · §5.2). Ported from docs/design/phase2-ui/app.js
// `buildSlots`/`placeInSlot`/`unslot` (235..291) onto u1's vendored `.slots`
// skin, rewritten against the seam.
//
// Split model → builder (u4 D1): `planOps` is the ONE place a slot/unslot/deploy
// sequence is decided. It is pure — it emits nothing, it only says what would be
// emitted and what the board would then hold — so the DOM half below owns no
// second rule set and neither can u4s (D7: `place`/`clear` are the only mutators).
//
// Every op leaves through `emit()`, which treats a throwing or refusing seam as
// a rejection and keeps the board's state untouched (R4).
import type { MembraneOp, Sentence } from '../driver/index.ts'
import { animationsFrozen, registerAnimation } from '../driver/index.ts'
import { TYPE_START, typeCursor } from './typewriter.ts'
import type { TypePace } from './typewriter.ts'
import { announce } from '../shell/announcer.ts'
import { button, el } from '../shell/dom.ts'
import { blockCardModel, buildBlockCard, pad2, pickedBlockId, setPickedBlockId } from './block-card.ts'

/** spec-client §9 dev value, not a guess. */
export const SLOT_CAP = 4

/** The blank's own copy, printed once in each empty slot row. */
const EMPTY_HINT = '— 비어 있음'
/** …and what the blank says once the file is committed and nothing went in. */
const LOCKED_HINT = '인수인계 사항 없음 — 잠김'

export interface SlotCell {
  slot: number
  blockId: string | null
}

/** Exactly `SLOT_CAP` cells, whatever length the caller hands in. */
export function slotCells(slots: readonly (string | null)[]): SlotCell[] {
  return Array.from({ length: SLOT_CAP }, (_, slot) => ({ slot, blockId: slots[slot] ?? null }))
}

/** The authored ids a board holds, in slot order, deduplicated. */
export function usedIds(slots: readonly (string | null)[]): string[] {
  const ids = slots.filter((id): id is string => typeof id === 'string' && id.length > 0)
  return [...new Set(ids)]
}

export type BoardState = 'empty' | 'partial' | 'full' | 'locked'

/** D11 — the four `.slots[data-state]` values, decided once, here. */
export function boardState(slots: readonly (string | null)[], deployed: boolean): BoardState {
  if (deployed) return 'locked'
  const used = usedIds(slots).length
  if (used === 0) return 'empty'
  return used < SLOT_CAP ? 'partial' : 'full'
}

export type SlotAction =
  | { kind: 'place'; blockId: string; slot: number }
  | { kind: 'clear'; slot: number }
  | { kind: 'deploy' }

/** What the desk says out loud when the membrane accepts an action (PRD §4). */
export function announcementOfAction(action: SlotAction): string {
  // x5b — moved with the chop (`deploy-button.ts`). This line and that stamp
  // report the same instant to two different senses, and an operator driving by
  // ear must not be told 배치 완료 while the paper says 파견 완료.
  if (action.kind === 'deploy') return '파견 완료 — 요원 파일이 잠겼습니다'
  const no = pad2(action.slot + 1)
  return action.kind === 'place' ? `슬롯 ${no} 배치` : `슬롯 ${no} 해제`
}

export interface OpPlan {
  ops: MembraneOp[]
  slots: (string | null)[]
  deployed: boolean
}

/**
 * Pure: what an action would emit and what the board would then hold.
 *
 * A deployed file absorbs everything (spec-client §5.2 — the run is committed),
 * an id never sits in two slots at once, and deploy carries the slotted SET.
 */
export function planOps(
  state: { slots: readonly (string | null)[]; deployed: boolean },
  action: SlotAction,
): OpPlan {
  const slots = slotCells(state.slots).map((cell) => cell.blockId)
  if (state.deployed) return { ops: [], slots, deployed: true }

  const ops: MembraneOp[] = []

  if (action.kind === 'deploy') {
    ops.push({ op: 'deploy', blocks: usedIds(slots) })
    return { ops, slots, deployed: true }
  }

  if (action.slot < 0 || action.slot >= SLOT_CAP) return { ops, slots, deployed: false }

  if (action.kind === 'clear') {
    if (slots[action.slot] === null) return { ops, slots, deployed: false }
    slots[action.slot] = null
    ops.push({ op: 'unslot', slot: action.slot })
    return { ops, slots, deployed: false }
  }

  // place — free the id's old seat, then the target seat's occupant.
  const held = slots.indexOf(action.blockId)
  if (held >= 0 && held !== action.slot) {
    slots[held] = null
    ops.push({ op: 'unslot', slot: held })
  }
  const occupant = slots[action.slot]
  if (occupant !== null && occupant !== action.blockId) {
    ops.push({ op: 'unslot', slot: action.slot })
  }
  slots[action.slot] = action.blockId
  ops.push({ op: 'slot', block_id: action.blockId, slot: action.slot })
  return { ops, slots, deployed: false }
}

/**
 * Pure: does a handover of these sentences TYPE at all?
 *
 * `false` on both of the reveal's early exits — an empty file (there is nothing
 * to type and the page is already correct) and a desk that has asked for no
 * motion (the rows are simply on the page). On neither path does a character
 * ever arrive, so on neither path is anything held: x10's mining gate is the
 * same predicate, and pulling it out here is what lets that be PROVED under
 * node rather than argued from the shape of an `if`. `revealHandover` below
 * has no second copy of the condition — it calls this one.
 *
 * Same split as `planOps`: the rule is pure, the DOM half obeys it (D1).
 */
export function handoverTypes(texts: readonly string[], motionless: boolean): boolean {
  return !motionless && texts.length > 0
}

/* ══ the builder half — the DOM the plan drives ══════════════════════════ */

export interface SlotBoardOptions {
  /** `false` ⇒ the seam refused; the board keeps its state (R4). */
  emit(op: MembraneOp): boolean
  /** The window's id→Sentence index; `null` ⇒ F1's fallback card. */
  resolve(blockId: string): Sentence | null
  /** Fired after a mutation the seam accepted. */
  onChange(slots: (string | null)[], deployed: boolean): void
}

export interface SlotBoard {
  /** The `#slotBoard` host §4 embeds — the board owns it, nothing else writes it. */
  readonly root: HTMLElement
  place(blockId: string, slot: number): void
  clear(slot: number): void
  deploy(): void
  /** The run moved on: the file opens again (D10). */
  unlock(): void
  isLocked(): boolean
  cells(): (string | null)[]
  render(): void
  /**
   * H3 — type the handover onto the page it was handed to, row by row.
   *
   * The board's CONTENT is untouched by this: the handover is already seated
   * (it survives `unlock()`, which is the whole point of the file being handed
   * on rather than rebuilt), so a reveal is a way of DRAWING what is already
   * there. Nothing here places, clears or emits, and the membrane never sees it.
   *
   * `onDone` fires when the last character lands — or immediately, on a desk
   * that has asked for no motion, where the rows are simply on the page.
   */
  revealHandover(onDone?: () => void): void
  /**
   * Is the handover still arriving on the page?
   *
   * DRAWING state, and the answer is a BOOLEAN — never how far it has got. See
   * the note on `reveal` below: how much of the file is painted is nobody's
   * business outside this module, and `cells()` answers the whole handover
   * throughout, so nothing here makes the reveal's progress observable.
   *
   * x10 (민서, 08-10) — it exists because mining must not land while the
   * previous ECHO's 인수인계 사항 is typing itself out. `windows/reports.ts`
   * reads it in `onMine`, beside the `isLocked()` it already reads there: both
   * are the same question — is the board taking a sentence right now — and the
   * board is the one place that can answer either. It is deliberately a READ of
   * `reveal` rather than a flag anybody sets, which is what makes the block
   * impossible to leave switched on: there is no second piece of state to get
   * out of step with the reveal, so the gate lifts in the same expression that
   * ends the typing.
   */
  isRevealing(): boolean
}

/** The reveal's pump registration — one handover typing at a time (D7). */
const REVEAL_PUMP = 'agent-file/handover'

/**
 * The handover's own pace — the desk's reading pace, roughly halved.
 *
 * x10 (민서, 08-10): "let's speed up the type speed of this one" — THIS one, and
 * not the REPORT body replay, which shares the arithmetic and was not asked
 * about. That is why `components/typewriter.ts` takes a `TypePace` now instead
 * of reading two module constants: `components/report-view.ts` passes nothing
 * and keeps 11/130 exactly, and the faster rate lives here, at the caller that
 * wanted it.
 *
 * MEASURED, on the shipped fixture rather than on a guess. A realistic handover
 * is four seated sentences of the length the packs actually carry: the report
 * sentences of `driver/fixtures/woodari-reports.ts` (both panes, runs 01–03) run
 * 13–51 characters, median 34.
 *
 * Four sentences of that median cost 2016 ms at the reading pace (which is
 * 4 × (34 × 11 + 130)) and 1096 ms at this one (4 × (34 × 6 + 70)) — 54% of it,
 * and that is the answer to "roughly half". A real mixed pick off run 03
 * (32/31/49/32 characters) goes 2104 → 1124 ms, the same 54%.
 *
 * Those two totals are pinned to the arithmetic by
 * `tests/windows/agent-file.test.ts`, deliberately: the cover's own note carries
 * the reason at length, having once claimed a quarter-minute for a page that had
 * taken 22.5 s since the day the rates under it moved. A comment that states a
 * total is a function of the constants beside it and goes stale with them.
 *
 * The two numbers moved TOGETHER and by nearly the same fraction, for the reason
 * `windows/agent-file.ts`'s cover note gives about its own pair: the pause
 * between sentences only reads as a pause while it is worth about a dozen
 * characters of the rate beside it. 130/11 is 11.8 characters; 70/6 is 11.7. A
 * halved rate with the pause left at 130 would have turned every row boundary
 * into a stop.
 *
 * 6 rather than 5.5 because a millisecond is the unit the pump measures in, and
 * of the two integers around it 6 is the one that keeps a character visible for
 * more than a frame at 60 Hz (5 ms would put two characters in some frames and
 * one in others, which reads as jitter rather than as speed).
 *
 * Why the handover may be read faster than the feed at all: the feed is a radio
 * transmission arriving, and the operator is reading it as it comes. The
 * handover is a file they have already been handed and are waiting to get their
 * hands on — every millisecond of it is a millisecond before they can work. It
 * is the same eye, but it is not the same job.
 */
const HANDOVER_PACE: TypePace = { msPerChar: 6, msBetween: 70 }

/**
 * Frames the reveal may go without a driver tick before it lands itself.
 *
 * Generous on purpose: a tick is expected every frame, so this only fires when
 * the pump is genuinely not running rather than when it is merely slow. A
 * throttled background tab is the case it must NOT misread — there rAF stops
 * too, so the counter stops with it and the reveal waits, which is right.
 *
 * x10 — it is NOT derived from the reveal's duration, so `HANDOVER_PACE` moving
 * leaves it alone: it counts frames since the last TICK, not frames since the
 * reveal opened, and "the pump is not running" is the same fact at any pace.
 * Twenty frames is ~330 ms at 60 Hz against a reveal that now runs ~1.1 s, so
 * the margin over a merely slow frame is unchanged too — the two numbers are
 * about different things and neither bounds the other.
 */
const WATCHDOG_FRAMES = 20

let mounted: SlotBoard | null = null

/** One desk, one AGENT FILE, one board (D7). */
export function getSlotBoard(): SlotBoard | null {
  return mounted
}

export function createSlotBoard(options: SlotBoardOptions): SlotBoard {
  const root = el('div', 'slots')
  root.id = 'slotBoard'

  let slots: (string | null)[] = slotCells([]).map((cell) => cell.blockId)
  let deployed = false

  function emit(op: MembraneOp): boolean {
    try {
      return options.emit(op)
    } catch (rejection) {
      // R4 — an op the run scripts no response for throws at the seam. A
      // rejected op is a no-op for the file, never a crashed desk.
      void rejection
      return false
    }
  }

  function apply(action: SlotAction): void {
    const plan = planOps({ slots, deployed }, action)
    if (plan.ops.length === 0) return
    for (const op of plan.ops) {
      if (!emit(op)) {
        render()
        return
      }
    }
    slots = plan.slots
    deployed = plan.deployed
    render()
    // The membrane ACCEPTED it. `deploy` and `unslot` have no event echo on the
    // ratified seam, so the op's own answer is the only signal an operator
    // driving by ear ever gets (R2 on index.html:125).
    announce(announcementOfAction(action))
    options.onChange([...slots], deployed)
  }

  /**
   * One seated sentence in one of the four handover slots.
   *
   * Every attribute the membrane census, tests and tutorial reach for survives
   * (`data-slot`, `data-no`, `data-block-id`, `.slot-pin`, `[data-op=unslot]`).
   * The visible number comes from the skin via `data-label`, so the semantic
   * slot number remains stable for callers that already read `data-no`.
   */
  function buildSeat(cell: SlotCell, blockId: string, chars?: number): HTMLElement {
    const node = el('div', 'slot filled')
    const no = pad2(cell.slot + 1)
    node.dataset.slot = String(cell.slot)
    node.dataset.no = no
    node.dataset.label = `칸 ${cell.slot + 1}`
    // I1 (spec-client §3 inv 3): the slot holds an authored ID, and the pin
    // anchor carries the same one for the slot's own controls and tests.
    node.dataset.blockId = blockId
    if (deployed) node.classList.add('locked')

    // H3 — `chars` is the reveal's cursor: the row is mid-type, so it shows
    // that many characters and NOT its release control.
    // A 해제 the operator can press on a sentence that has not finished arriving
    // is a control offered for a thing that is not there yet. The control
    // arrives with the last character (see `render`).
    const typing = chars !== undefined
    const model = blockCardModel(blockId, options.resolve(blockId))
    node.append(
      buildBlockCard(typing ? { ...model, text: model.text.slice(0, chars) } : model, { inSlot: true }),
    )
    if (typing) {
      node.classList.add('typing')
      return node
    }

    if (!deployed) {
      const unset = button('slot-unset', `슬롯 ${no} 해제`, '해제')
      // The `unslot` op's control, marked for the PRD §4 membrane census.
      unset.dataset.op = 'unslot'
      unset.addEventListener('click', (event) => {
        event.stopPropagation()
        apply({ kind: 'clear', slot: cell.slot })
      })
      node.append(unset)
    }

    // The thread's anchor CLOSES the run rather than opening it.
    //
    // It sat between the number and the sentence to begin with, and a paragraph
    // has soft-wrap opportunities the four boxes never did: the line broke
    // between the dot and the first word, leaving `02 ●` stranded on the end of
    // the line ABOVE the sentence it numbers. Last, it can only ever be orphaned
    // from a `해제` — which is invisible, because it is a dot.
    const pin = el('span', 'slot-pin')
    pin.dataset.blockId = blockId
    pin.setAttribute('aria-hidden', 'true')
    node.append(pin)

    return node
  }

  /** One empty slot row. Unlocked blanks are buttons so keyboard slotting remains complete. */
  function buildBlank(cell: SlotCell, inert = false): HTMLElement {
    const node = el('div', 'slot slot-blank')
    const no = pad2(cell.slot + 1)
    node.dataset.slot = String(cell.slot)
    node.dataset.no = no
    node.dataset.label = `칸 ${cell.slot + 1}`

    if (deployed || inert) {
      node.classList.add('locked')
      node.append(el('div', 'slot-empty', deployed ? LOCKED_HINT : EMPTY_HINT))
      return node
    }

    const target = button('slot-empty slot-target', `슬롯 ${no}에 배치`, EMPTY_HINT)
    // The `slot` op's control, marked for the PRD §4 membrane census.
    target.dataset.op = 'slot'
    node.append(target)

    node.addEventListener('click', () => {
      const armed = pickedBlockId()
      if (armed === null) return
      setPickedBlockId(null)
      apply({ kind: 'place', blockId: armed, slot: cell.slot })
    })
    node.addEventListener('dragover', (event) => {
      event.preventDefault()
      node.classList.add('droppable')
    })
    node.addEventListener('dragleave', () => node.classList.remove('droppable'))
    node.addEventListener('drop', (event) => {
      event.preventDefault()
      node.classList.remove('droppable')
      const dropped = event.dataTransfer?.getData('text/plain') ?? ''
      if (dropped.length > 0) apply({ kind: 'place', blockId: dropped, slot: cell.slot })
    })

    return node
  }

  function render(): void {
    root.dataset.state = boardState(slots, deployed)
    const cells = slotCells(slots)
    const filled = cells.flatMap((cell) => (cell.blockId === null ? [] : [{ cell, blockId: cell.blockId }]))
    // H3 — mid-reveal, the page carries the rows that have landed and the one
    // being typed; future handed-over rows keep their slot row but not their
    // sentence yet. `reveal.row` indexes FILLED rows in page order, not slot
    // numbers: two sentences seated in slots 1 and 3 type as row 0 then row 1.
    const visibleFilled = reveal === null ? filled : filled.slice(0, reveal.row + 1)
    const visibleBySlot = new Map(visibleFilled.map(({ cell, blockId }, index) => [cell.slot, { blockId, index }]))

    root.replaceChildren(
      ...cells.map((cell) => {
        if (reveal !== null) {
          const visible = visibleBySlot.get(cell.slot)
          if (visible === undefined) return buildBlank(cell, true)
          return visible.index === reveal.row
            ? buildSeat(cell, visible.blockId, reveal.chars)
            : buildSeat(cell, visible.blockId)
        }
        return cell.blockId === null ? buildBlank(cell) : buildSeat(cell, cell.blockId)
      }),
    )
  }

  /**
   * H3 — the reveal's own state, and it is DRAWING state, never membrane state.
   * `slots` is what the file holds; this is only how much of it is on the page
   * yet. `cells()` therefore answers the whole handover throughout a reveal, so
   * a `deploy` that lands mid-type commits the file the operator was handed and
   * not the fraction that happens to be painted.
   *
   * x10 — `isRevealing()` publishes ONE BIT of it and no more: whether it is
   * null. `row` and `chars` stay in here, so the desk still cannot observe how
   * far the drawing has got, and the DEPLOY control is untouched by the gate for
   * exactly the reason above — the file holds what it holds while it is drawn.
   */
  let reveal: { row: number; chars: number } | null = null
  let stopReveal: (() => void) | null = null

  /** The operator asked for no motion, or the determinism gate is closed. */
  function motionless(): boolean {
    if (animationsFrozen()) return true
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function endReveal(): void {
    if (stopReveal !== null) stopReveal()
    stopReveal = null
    reveal = null
  }

  function revealHandover(onDone?: () => void): void {
    endReveal()
    const texts = slotCells(slots).flatMap((cell) =>
      cell.blockId === null ? [] : [blockCardModel(cell.blockId, options.resolve(cell.blockId)).text],
    )
    // An empty file is handed on empty. There is nothing to type and the page
    // is already correct, so the caller's continuation runs now rather than
    // after a zero-length animation that would still cost it a frame.
    //
    // x10 — the condition is `handoverTypes` above, not a second copy of it,
    // because the mining gate is now this same question. `reveal` stays `null`
    // on this path and `isRevealing()` is that field, so a reveal that never
    // types cannot gate anything — the two facts are one field, not two.
    if (!handoverTypes(texts, motionless())) {
      render()
      onDone?.()
      return
    }

    const lengths = texts.map((text) => text.length)
    let elapsed = 0
    reveal = { row: 0, chars: 0 }
    render()

    const land = (): void => {
      endReveal()
      render()
      onDone?.()
    }

    let sinceTick = 0
    const unregister = registerAnimation(REVEAL_PUMP, (realMs: number) => {
      elapsed += realMs
      sinceTick = 0
      // x10 — at the HANDOVER's pace, which is the one thing this caller varies.
      // `components/report-view.ts` calls the same function three arguments long
      // and keeps the desk's reading pace; see `HANDOVER_PACE` above.
      const cursor = typeCursor(TYPE_START, elapsed, lengths, HANDOVER_PACE)
      if (cursor.done) {
        land()
        return
      }
      reveal = { row: cursor.sentence, chars: cursor.chars }
      render()
    })
    stopReveal = unregister

    // THE WATCHDOG, and it is not belt-and-braces.
    //
    // The pump only ticks while the driver's clock is running or has ENDED
    // (`driver/fixture-driver.ts`), and a reveal that starts on a clock in
    // neither state would strand the handover mid-character — a file the
    // operator is meant to revise, frozen half-written, with no way to finish
    // it. In a played day the clock has ended at the active pack's terminal
    // minute and this never arms; `window.__shell.drain()` is the case that
    // reaches it, because it flushes the stream without ever advancing the
    // clock to the terminal minute.
    //
    // Same shape as `components/run-feed.ts`'s settle watchdog and for the same
    // reason: rides rAF rather than the driver, so it is alive exactly when the
    // driver is not.
    const watch = (): void => {
      if (reveal === null) return
      sinceTick += 1
      if (sinceTick > WATCHDOG_FRAMES) {
        land()
        return
      }
      requestAnimationFrame(watch)
    }
    requestAnimationFrame(watch)
  }

  const board: SlotBoard = {
    root,
    place: (blockId, slot) => apply({ kind: 'place', blockId, slot }),
    clear: (slot) => apply({ kind: 'clear', slot }),
    revealHandover,
    deploy: () => apply({ kind: 'deploy' }),
    unlock: () => {
      if (!deployed) return
      deployed = false
      render()
      options.onChange([...slots], deployed)
    },
    isLocked: () => deployed,
    // x10 — THE MINING GATE, and it is one expression on purpose.
    //
    // Every way a reveal can end runs `endReveal()`, which nulls this field: the
    // last character (`land`), the watchdog (`land` again), and a reveal
    // REPLACED by another — `revealHandover` opens with `endReveal()`, so a page
    // turn, a new run or a second settle re-arms rather than stacks. There is no
    // fourth exit, because there is no fourth writer of `reveal`.
    //
    // A latch here — `revealing = true` on entry, `false` on the way out —
    // would have a fourth exit the moment anyone added one, and a gate stuck ON
    // is worse than no gate at all: it would leave the operator unable to mine
    // for the rest of the sitting, with nothing on the page to explain it. So
    // the release is not an action anybody has to remember to take. It is the
    // absence of the state that was drawing.
    isRevealing: () => reveal !== null,
    cells: () => [...slots],
    render,
  }

  mounted = board
  render()
  return board
}
