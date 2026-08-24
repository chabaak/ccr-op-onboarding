// The two ways the sitting ends — the curtain the portal drops on a day that
// closed for good.
//
// WHAT IT IS. The same plate the briefing uses, walked three times, on the far
// side of the shift instead of the near one: `shell/manual.ts` opens the
// sitting with 임용 → 시뮬레이션 대상 → 파견과 재시도, and this closes it with
// 시뮬레이션 종료 → 훈련 강평 → 임용 확정 (or 평가 보류). Reusing that plate is
// not economy — it is the portal keeping its word. The document that issued the
// terminal is the document that takes it back, so the operator recognises the
// hardware of the last screen from the first one, and the only thing that has
// changed between them is what it says.
//
// TWO ENDINGS, ONE TRIGGER EACH. GOOD is the day whose `score` closes on the
// best death total derivable from the pack's own scoring predicates. BAD is the
// day that closes with no runs left to spend. GOOD WINS when both land on the
// same day: an operator who reaches the best outcome on their last try has
// passed, and the counter is not the thing being judged.
//
// IT IS AN OBSERVER, exactly like `shell/tutorial.ts` and `audio/index.ts`. It
// reads the §5.2 stream and the DOM, sends no op, mounts no control on the
// desk, and nothing imports it but one call at the bottom of `bootShell`. It
// does not touch `windows/reports.ts` or `components/score-tally.ts` — the
// ledger's landing is read off the `data-tally-state` attribute those modules
// already write, the way the ear reads it. Delete this module and the desk
// plays identically; it simply never stops.
//
// THE HELD BEAT is why the curtain does not ride the `score` event directly.
// The record takes some nine seconds to print itself out and roll its headline
// to the day's number, and a veil that rose on the event would rise across that
// count — the operator would be reading a plate about a number they never got
// to see. So the walk waits for the ledger to reach `final`, holds two more
// seconds with the finished number sitting alone on the desk, and only then
// covers it.
//
// AND THE TAIL IS PART OF THE SAME PATIENCE (x11, 민서 08-10). The record is not
// the only thing still writing itself when a day closes: the LIVE FEED prints
// through a paced reveal queue and the day's last minutes are its most crowded,
// so at `score` the fanfold is still some way behind the run. It used to be made
// to catch up in one frame — `run-feed.ts` dumped its whole queue on `run_end` —
// which is why the veil could come down at a fixed distance from the ledger and
// be sure the paper had stopped. The dump is gone, so the distance is no longer
// fixed and the walk asks instead: `shell/feed-drain.ts` publishes what the feed
// still owes and this waits for it to reach zero. 민서: "If the tail is still
// typing, nothing should stop it, not even the ending."
//
// ONCE PER PAGE LOAD, and the guard is a module-level flag rather than anything
// persisted: a judge who reloads gets a fresh sitting (H2, `run-state.ts`), and
// a sitting that can end is a sitting that can end again.
//
// Import-safe (u3 / inv 12): no DOM at module scope, no stylesheet import,
// nothing from engine or composer. The three-plate rendering and the arithmetic
// under it are pure functions, so the whole of what this module SAYS is
// testable without a desk to say it on.
import type { FixtureDriver, ViewEvent } from '../driver/index.ts'
import { deathsOf, identifiers, resolve } from '../../shared/predicates.ts'
import type { PredicateState, PredicateValue } from '../../shared/predicates.ts'
import type { ScenarioEndings, ScenarioScore } from './pack.ts'
import { button, el, must } from './dom.ts'
import { feedDrained } from './feed-drain.ts'

/** The one control's two labels: the plates that advance, and the one that continues from the ending. */
export const ENDING_NEXT = '다음'
export const ENDING_CLOSE = '확인'
export const ENDING_WINDOW_CLOSE = ENDING_CLOSE

/** The pause between the ledger's last number and the veil. See the header. */
export const HELD_BEAT_MS = 2000

/* ── what a day earns ────────────────────────────────────────────────────── */

export type EndingKind = 'good' | 'bad'

export interface EndingNumbers {
  walkedOut: number
  deaths: number
}

/** One plate of the ending — the briefing's `ManualStep` plus its own counter. */
export interface EndingPlate {
  /** The plate's own title, left of the head. */
  head: string
  /** `1 / 3` — the head's meta slot, where the briefing keeps the same reading. */
  corner: string
  /** The one line set in white: what this plate is actually saying. */
  lead: string
  /** The lines under it, in the head's own grey. One paragraph each. */
  body: readonly string[]
}

/**
 * Which ending a CLOSED day earns, or `null` when the sitting simply continues.
 *
 * `runsLeft` is the trap here. `src/runloop/run-loop.ts` publishes it as
 * `max(0, totalRuns - run_count)`, which means it already reads 0 for the WHOLE
 * of the last run and not merely at its end — so the honest question is never
 * "did the counter just hit zero", it is "did a day close with the counter at
 * zero". That is why this takes the numbers of a day that has already closed
 * and nothing else: the caller does the waiting, this only judges.
 *
 * GOOD WINS. Both conditions are true of the day where the operator empties the
 * tunnel on their last attempt, and that day is a pass.
 */
export function endingKindOf(
  input: { total: number; runsLeft: number },
  score: ScenarioScore,
): EndingKind | null {
  if (input.total === rescueTotalOf(score)) return 'good'
  // `<= 0` rather than `=== 0` — the seam clamps at zero already, and an
  // ending that failed to fire because a counter went one past it would be a
  // silent loss of the only screen this module owns.
  if (input.runsLeft <= 0) return 'bad'
  return null
}

/** One row of the closing tally, as §5.2's `score` event carries it. */
export interface ScoredRow {
  label: string
  value: string | number
}

/**
 * The two numbers the bad ending prints, from the day's own tally and pack
 * ending config.
 *
 * `deaths` is the seam's `total` UNCHANGED — the headline the operator watched
 * the ledger roll to seconds earlier. An ending that quietly printed a
 * different toll than the record it is closing would be the one lie on it.
 *
 * `walkedOut` is the pack's site-occupant count minus deaths that happened
 * inside that site. Packs with scored units outside the site name those labels
 * in `endings.json`, so this rule stays general without hard-coding a case.
 *
 * `deathsOf` is the pack's own rule, borrowed rather than restated
 * (`shared/predicates.ts`, and `components/tally-line.ts` reads the same tally
 * through it): a value counts one death when its outcome word is 사망, so
 * `사망 · 집결지 세 번째 명단` counts and `생존 · 발목이 부러진 채 북측으로 걸어
 * 나온다` does not. Writing a second copy of that test here is how the desk's
 * two readings of one row would eventually disagree.
 *
 * Clamped at both ends: the arithmetic is the ending's, not the seam's, and
 * neither a negative crowd nor a negative toll is a sentence the plate may
 * print.
 */
export function numbersOf(
  ending: Pick<ScenarioEndings, 'siteOccupants' | 'scoredOutsideSite'>,
  score: { total: number; rows: readonly ScoredRow[] },
): EndingNumbers {
  let outside = 0
  for (const row of score.rows) {
    if (ending.scoredOutsideSite.includes(row.label)) outside += deathsOf(row.value)
  }
  const inside = Math.max(0, score.total - outside)
  return { walkedOut: Math.max(0, ending.siteOccupants - inside), deaths: score.total }
}

/* ── score-derived values ───────────────────────────────────────────────── */

function scoredRowsOf(score: ScenarioScore, state: PredicateState): readonly ScoredRow[] {
  const rows: ScoredRow[] = []
  for (const unit of score.units) {
    const value = resolve(unit.predicates, state)
    if (value !== null) rows.push({ label: unit.label, value })
  }
  return rows
}

function totalOfRows(rows: readonly { value: PredicateValue }[]): number {
  return rows.reduce((sum, row) => sum + deathsOf(row.value), 0)
}

/**
 * The best death total the pack's score predicates can produce.
 *
 * This derives the good-ending threshold from authored score branches instead
 * of restating it in source. Each conditional score branch contributes one
 * candidate state made from the identifiers it names; the score reader then
 * resolves every unit exactly as the ledger does. The empty state is included
 * so a pack whose best day is also its baseline still has a defined threshold.
 */
export function rescueTotalOf(score: ScenarioScore): number {
  const states: PredicateState[] = [{}]
  for (const unit of score.units) {
    for (const predicate of unit.predicates) {
      const head = predicate.slice(0, Math.max(0, predicate.indexOf('=>'))).trim()
      if (head === '') continue
      const state: PredicateState = {}
      for (const id of identifiers(head)) state[id] = true
      states.push(state)
    }
  }
  return Math.min(...states.map((state) => totalOfRows(scoredRowsOf(score, state))))
}

export function previewScoreOf(score: ScenarioScore): { total: number; rows: readonly ScoredRow[] } {
  const rows = scoredRowsOf(score, {})
  return { total: totalOfRows(rows), rows }
}

/* ── the copy ────────────────────────────────────────────────────────────── */

/** The two slots any line may carry, and nothing else — an unknown one is left alone. */
const SLOT = /\{(walkedOut|deaths)\}/g

function fill(line: string, numbers: EndingNumbers): string {
  return line.replace(SLOT, (_match: string, key: string) =>
    String(key === 'deaths' ? numbers.deaths : numbers.walkedOut),
  )
}

/**
 * The three plates of one ending, counters written and numbers put in.
 *
 * Pure, and the whole of the ending's text: a test can read every sentence this
 * module will ever print without mounting anything. The counter is NOT in the
 * copy above — it rides the head's meta slot, the same slot the briefing and
 * the deploy confirmation both use, so it lands in one fixed column across all
 * three plates and reads as progress rather than as part of a title.
 */
export function endingPlates(
  kind: EndingKind,
  numbers: EndingNumbers,
  ending: Pick<ScenarioEndings, 'copy'>,
): readonly EndingPlate[] {
  const copy = ending.copy[kind]
  return copy.map((plate, index) => ({
    head: plate.head,
    corner: `${index + 1} / ${copy.length}`,
    lead: fill(plate.lead, numbers),
    body: plate.body.map((line) => fill(line, numbers)),
  }))
}

/* ── who gets an ending ──────────────────────────────────────────────────── */

/**
 * `?ending=skip` forces it off, `?ending=good|bad` forces that walk on, and the
 * e2e lane is off by default.
 *
 * The default is the same one `shell/tutorial.ts` and `shell/sign-in.ts` argue
 * for, and it matters more here than in either: `navigator.webdriver` is every
 * spec under `e2e/`, those specs run days to their close, and this layer covers
 * the whole viewport and never lifts. The suite's contract is the desk — it
 * must never meet a curtain.
 */
export function endingSkipped(host: Window): boolean {
  const flag = new URLSearchParams(host.location.search).get('ending')
  if (flag === 'skip') return true
  if (flag === 'good' || flag === 'bad') return false
  return host.navigator.webdriver === true
}

/**
 * The ending a lane demands by name, or `null` to let the day decide.
 *
 * This is how a human reviews the work. Both endings sit behind a full sitting
 * — one of them behind a sitting that has to be WON — so a reviewer who had to
 * earn them would see each screen once an hour. Named here, the walk opens on
 * the hand-over with the preview toll in it and no score is waited on at all.
 */
export function endingForced(host: Window): EndingKind | null {
  const flag = new URLSearchParams(host.location.search).get('ending')
  if (flag === 'good' || flag === 'bad') return flag
  return null
}

/* ── the plate ───────────────────────────────────────────────────────────── */

/** The chrome the ending holds: the top bar and the desk under it. */
function holdChrome(on: boolean): void {
  for (const sel of ['#topbar', '#desktop']) {
    const node = document.querySelector(sel)
    if (!node) continue
    if (on) node.setAttribute('inert', '')
    else node.removeAttribute('inert')
  }
}

/**
 * Walks the three plates and resolves the moment the last one is answered.
 *
 * It resolves as the final action goes on, after releasing the held chrome:
 * GOOD unlocks the desktop files and BAD starts the same pack over, both in
 * `bootShell`, because this observer still owns no scenario state.
 *
 * NOT DISMISSIBLE, and there is no Escape here — which is the one place this
 * departs from `shell/manual.ts`. Escape skips the BRIEFING because a keyboard
 * user must never be trapped in front of three paragraphs and because there is
 * a desk behind that plate to be let onto. Behind this one is only a scored
 * sitting: readable and inert in both cases. So the walk
 * stays fully keyboard-operable the only way it can be -- the control takes
 * focus once and keeps it across all three steps, so Enter three times is the
 * whole ending -- and no key is bound to a shortcut that would have to invent an
 * exit of its own.
 *
 * The plate is built ONCE and repainted in place, for the reasons `manual.ts`
 * gives: remounting would replay the entrance three times and would drop focus
 * off the control being pressed.
 */
export function openEnding(
  app: HTMLElement,
  kind: EndingKind,
  numbers: EndingNumbers,
  ending: Pick<ScenarioEndings, 'copy'>,
): Promise<void> {
  const plates = endingPlates(kind, numbers, ending)

  // The desk goes inert for the walk. It is released before this resolves so
  // the caller can either reveal the desktop files or reload into a clean run.
  holdChrome(true)

  const root = el('div', kind === 'good' ? 'end-good' : 'end-bad')
  root.id = 'ending'
  root.setAttribute('role', 'dialog')
  root.setAttribute('aria-modal', 'true')
  root.setAttribute('aria-labelledby', 'end-head')
  root.setAttribute('aria-describedby', 'end-body')

  const plate = el('section', 'cf-plate notice-plate notice-fullscreen end-plate')

  const headLabel = el('b', 'notice-kind')
  headLabel.id = 'end-head'
  const counter = el('i', 'notice-meta')
  const head = el('div', 'cf-plate-hd notice-head')
  head.append(headLabel, counter)

  const body = el('div', 'cf-body notice-body end-body end-step')
  body.id = 'end-body'
  // The step changes under a reader who is not looking at the head, so the
  // region announces itself. `aria-describedby` above names this container
  // rather than one paragraph inside it, so the description follows the walk
  // instead of going stale on the first lead.
  body.setAttribute('aria-live', 'polite')

  const go = button('cf-btn cf-yes notice-btn notice-primary end-go', ENDING_NEXT, ENDING_NEXT)
  go.id = 'endingGo'
  const footnote = el('span', 'notice-footnote')
  const actions = el('span', 'notice-actions')
  actions.append(go)
  const foot = el('div', 'cf-foot notice-foot')
  foot.append(footnote, actions)

  const pips = el('div', 'end-pips')
  pips.setAttribute('aria-hidden', 'true')
  for (let index = 0; index < plates.length; index += 1) pips.append(el('span'))

  plate.append(head, body, foot)
  root.append(plate)
  root.append(pips)
  app.append(root)

  let at = 0

  function paint(): void {
    const step = plates[at]
    if (step === undefined) return
    const last = at === plates.length - 1

    headLabel.textContent = step.head
    counter.textContent = step.corner
    footnote.textContent = step.corner
    body.replaceChildren(
      el('p', 'cf-ask notice-lead', step.lead),
      ...step.body.map((line) => el('p', 'cf-note notice-line', line)),
    )
    for (const [index, pip] of [...pips.children].entries()) {
      pip.classList.toggle('is-current', index === at)
    }

    go.textContent = last ? ENDING_CLOSE : ENDING_NEXT
    go.title = last ? ENDING_CLOSE : ENDING_NEXT
    // The op the press performs, so the walk is legible to a test and to the
    // reader of a DOM dump: three presses, and only the last one ends the
    // session.
    go.dataset.step = String(at + 1)
    go.dataset.op = last ? 'continue' : 'next'

    // Re-trigger the step animation. Removing the class and reading a layout
    // property is what makes the SAME animation run again on an element that
    // was never detached — the plate persists across steps by design, so there
    // is no remount to restart it for us.
    body.classList.remove('end-step')
    void body.offsetWidth
    body.classList.add('end-step')
  }

  paint()
  requestAnimationFrame(() => go.focus())

  return new Promise<void>((resolve) => {
    let answered = false
    const advance = (): void => {
      if (answered) return
      if (at < plates.length - 1) {
        at += 1
        paint()
        return
      }
      answered = true
      root.remove()
      holdChrome(false)
      resolve()
    }
    go.addEventListener('click', advance)
  })
}

/* ── waiting for the day to be over ──────────────────────────────────────── */

const sleep = (host: Window, ms: number): Promise<void> =>
  new Promise((resolve) => {
    host.setTimeout(resolve, ms)
  })

/**
 * Resolves on the first CLOSED day that earns an ending, with its numbers.
 *
 * Both halves of the judgement come off the §5.2 stream and neither is derived
 * here: `runs_left` is copied from the last `meta` (the client mirrors no state
 * and does no arithmetic on the authority's numbers — §5.3), and the toll is
 * the `score` event's own `total`. A day that earns nothing is simply not
 * resolved on: the sitting continues and the next `score` is judged the same
 * way.
 *
 * IT IS SEEDED FROM THE FRAME, and that is not belt-and-braces — it is the only
 * way this reads run 1 correctly. `subscribe` does not replay, and the opening
 * `meta` is emitted at `bootShell` step 5 (`driver.advance(0)`), while this
 * module is not installed until step 8 — on the far side of the door and the
 * briefing, which the boot awaits and an operator can sit in front of for
 * minutes. A listener bound there has already missed the only `meta` the first
 * day will ever send: the next one arrives with the SECOND day. So a `runsLeft`
 * that started at 0 and waited for the stream to correct it would still be 0
 * when day 1 closed, and every first day that did not empty the tunnel would
 * end the sitting on the spot. `frame().events` is the emitted stream to date
 * (`driver/fixture-driver.ts`), so the last `meta` in it is this day's.
 *
 * `null` until a `meta` has been seen at all, and a `null` never earns the bad
 * ending: a desk with no run loop behind it (the placeholder boot) has not spent
 * an allotment, it never had one.
 */
function earned(
  driver: FixtureDriver,
  ending: Pick<ScenarioEndings, 'siteOccupants' | 'scoredOutsideSite'>,
  score: ScenarioScore,
): Promise<{ kind: EndingKind; numbers: EndingNumbers }> {
  return new Promise((resolve) => {
    let runsLeft: number | null = null
    for (const event of driver.frame().events) {
      if (event.type === 'meta') runsLeft = event.runs_left
    }
    let done = false
    driver.subscribe((event: ViewEvent) => {
      if (done) return
      if (event.type === 'meta') {
        runsLeft = event.runs_left
        return
      }
      if (event.type !== 'score') return
      const kind = endingKindOf(
        { total: event.total, runsLeft: runsLeft ?? Number.POSITIVE_INFINITY },
        score,
      )
      if (kind === null) return
      done = true
      // The whole event, not just its total: `numbersOf` has to see which of
      // the scored units was standing outside the crowd to begin with.
      resolve({ kind, numbers: numbersOf(ending, { total: event.total, rows: event.rows }) })
    })
  })
}

/**
 * Resolves when the ledger lands — `data-tally-state="final"` on the record
 * root, which `components/score-tally.ts` sets at the end of its own cadence.
 *
 * Observed rather than timed, exactly as `audio/index.ts` observes the same
 * attribute for the same moment: nothing here needs to know what ~9 s means,
 * and a module that hard-coded the ledger's pacing would go quietly out of step
 * the first time that pacing was tuned. `attributeFilter` keeps the callback
 * off every other mutation the desk makes, which at this point in a day is most
 * of them.
 *
 * Deliberately no synchronous first look. The record for the day that just
 * closed has only just been mounted and is still `pending`; any element already
 * reading `final` when this is armed belongs to an earlier day, and an ending
 * that fired off a stale attribute would skip the count it exists to protect.
 */
function ledgerLanded(): Promise<void> {
  return new Promise((resolve) => {
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const node = record.target
        if (!(node instanceof HTMLElement)) continue
        if (node.dataset.tallyState !== 'final') continue
        observer.disconnect()
        resolve()
        return
      }
    })
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-tally-state'],
    })
  })
}

/* ── the walk ────────────────────────────────────────────────────────────── */

export interface EndingPorts {
  driver: FixtureDriver
  /** Resolves at the hand-over, when the desk is what the operator is looking at. */
  deskReady: Promise<void>
  endings: ScenarioEndings
  score: ScenarioScore
  onGoodEnding?: () => Promise<void> | void
  onBadEnding?: () => Promise<void> | void
}

/**
 * ONCE PER PAGE LOAD, ever.
 *
 * Module scope rather than a closure, so it holds even if `installEnding` is
 * called twice, and it is set at the moment the veil is raised rather than at
 * install time so a lane that installs and never earns an ending is not
 * counted as having spent it.
 */
let raised = false

async function continueAfter(kind: EndingKind, ports: EndingPorts): Promise<void> {
  if (kind === 'good') await ports.onGoodEnding?.()
  else await ports.onBadEnding?.()
}

/** Stops the portal, drops the veil, and then hands off to the shell. */
async function raise(
  driver: FixtureDriver,
  kind: EndingKind,
  numbers: EndingNumbers,
  ending: Pick<ScenarioEndings, 'copy'>,
): Promise<void> {
  if (raised) return
  raised = true
  // The portal stops: the desk under the veil should be as still as the plate
  // says it is, and nothing may release another minute behind it.
  //
  // x11 (08-10) — WHAT THIS DOES NOT STOP is the reveal pump, and the note here
  // used to read as though it did ("a rate left running keeps the pump feeding a
  // stream that is over"). `driver/fixture-driver.ts` ticks the animation
  // channel while `clock.running || clock.ended`, deliberately — R4: the run
  // closes at 21:04 in the same frame its terminal batch is released, so a pump
  // that stopped with the clock would paint the day's last report and the day's
  // last lines in one frame. The rate has never been what holds the paper.
  //
  // Which is what makes the wait below this call in `walkEnding` the only thing
  // protecting the tail, and what makes it SAFE to keep this line where it is:
  // on the earned lane the clock has already halted itself at `end` before the
  // `score` that started the walk, so this changes nothing the feed rides on. It
  // bites on the forced lane alone, where it is stopping a day that is genuinely
  // still running (and there `run-feed.ts`'s own settle watchdog is what lands
  // whatever is left, exactly as it does for any other pause).
  driver.clock.setRate(0)
  await openEnding(must('#app'), kind, numbers, ending)
}

/**
 * The whole of the ending, from the hand-over to the exit.
 *
 * The forced lane short-circuits everything: it waits for the desk to exist and
 * then raises the named walk on the preview toll, because a reviewer opening
 * `?ending=bad` is reviewing the PLATE and should not have to lose a tunnel
 * three times first.
 *
 * x11 — AND THE DRAIN IS NOT ADDED BACK TO IT (민서, 08-10). Every wait this
 * lane skips — the `score`, the ledger, the held beat — is skipped for one
 * reason: there is no day behind this plate. The drain is a wait of exactly that
 * family. What it protects is a RECORD ENDING — the last lines of a day the
 * operator played, which must not be covered mid-sentence — and the forced lane
 * has no such lines: it interrupts a day that is still running, or one that has
 * not been started at all, and it does so on purpose. Making the preview queue
 * behind the fanfold's pacing would be the review lane waiting on the very thing
 * it exists not to wait for. (In practice a reviewer opens it at the hand-over,
 * where the desk is held at rate 0 with nothing queued and `feedDrained()` would
 * resolve on the spot — but "it is usually free" is not the reason it is absent.)
 */
async function walkEnding(host: Window, ports: EndingPorts): Promise<void> {
  const { driver, deskReady, endings, score } = ports

  const forced = endingForced(host)
  if (forced !== null) {
    await deskReady
    await raise(driver, forced, numbersOf(endings, previewScoreOf(score)), endings)
    await continueAfter(forced, ports)
    return
  }

  // Armed BEFORE the hand-over is awaited — see `earned()`.
  const day = earned(driver, endings, score)
  await deskReady
  const { kind, numbers } = await day

  // The day is scored; now let the record say so before covering it.
  //
  // THE ORDER OF THESE THREE IS LOAD-BEARING, and each line is where it is for
  // its own reason.
  //
  // `ledgerLanded()` stays FIRST because it is the only one of the three that
  // can go stale. It is a `MutationObserver` with no synchronous first look (see
  // there — a `final` already on the DOM belongs to an earlier day), so it has
  // to be armed while the record it is watching is still `pending`. Put any wait
  // in front of it and a drain that outlasted the ledger's ~9 s count would arm
  // the observer onto an attribute that had already reached its last value: the
  // ending would then wait for a mutation that is never coming, and hang for the
  // rest of the sitting. The two waits are not interchangeable, however alike
  // they look on the page.
  //
  // `feedDrained()` goes SECOND, between the ledger and the beat, and the beat
  // is what decides it. HELD_BEAT_MS is not a delay, it is a held frame: two
  // seconds of the finished number sitting alone on a desk that has stopped
  // moving. Spent while the fanfold was still printing, it would be two seconds
  // of paper scrolling under a number nobody was being given time to read, and
  // the veil would then land on the very frame the last line arrived in — the
  // beat consumed by the drain and no stillness left anywhere. Waiting here
  // keeps the beat's meaning by widening what "finished" covers: the record has
  // landed, the paper has caught up, and only then does the desk get its pause.
  //
  // The feed's own 집계 line is inside this wait, which is the neatest statement
  // of why it exists — the ledger's headline and the fanfold's closing line are
  // two printings of one count, and covering the paper before the second one
  // lands would tear the day's last sentence in half.
  //
  // NO CEILING on it, and that is a decision rather than an oversight. A timeout
  // could only fire by covering a tail that was still typing, which is the exact
  // failure this whole change removes; and the count's only writer is the pump
  // that empties it, so "it never reaches zero" is a defect in the feed to be
  // fixed there. `tests/shell/feed-drain.test.ts` is what stands over that.
  await ledgerLanded()
  await feedDrained()
  await sleep(host, HELD_BEAT_MS)
  await raise(driver, kind, numbers, endings)
  await continueAfter(kind, ports)
}

/**
 * Mounts the ending, unless this lane is not getting one.
 *
 * Fire-and-forget, and its failure is swallowed: this layer waits out an entire
 * sitting before it does anything at all, and an exception on the way to the
 * curtain must not take the desk that sitting is being played on. Nothing
 * downstream of this call depends on it having run — `bootShell` is finished by
 * the time it does.
 */
export function installEnding(host: Window, ports: EndingPorts): void {
  if (endingSkipped(host)) return
  void walkEnding(host, ports).catch((cause) => {
    console.error('the ending never arrived', cause)
  })
}
