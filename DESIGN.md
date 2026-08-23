# Design System

This is the design system of record for `긴급상황대응실 운영자 임용을
축하합니다`. It describes the terminal the player reads and operates. Prototype
HTML, screenshots, and handoff files are references only; production code uses
the existing TypeScript DOM helpers and CSS files.

## Principles

- The product is a training terminal, not a dashboard and not a chatbot.
- The horror is bureaucratic: calm documents, precise counts, no spectacle.
- Every player action is a press on printed terminal material. There are no text
  inputs.
- Dense does not mean noisy. Separate surfaces with spacing, rules, type, and
  hierarchy before adding decoration.
- Use the source copy already authored in the app and data pack. The design
  system decides layout, typography, colour, and state treatment; it does not
  paraphrase shipped prose.

## Colour

Use flat colour only. There are **no gradients** anywhere.

There is one signal colour, `#8fd0ff`. Do not create secondary blues or status
variants. The warning colour, `#e88a6a`, appears only in two contexts:
irreversible actions and system failure.

| Token | Value | Use |
| --- | --- | --- |
| 바탕 | `#05070c` | Desktop ground and the deepest inset surfaces |
| 판 | `#080b12` | Windows, notices, and main plates |
| 판 (안쪽) | `#05070c` | Briefing wells and pressed-in content areas |
| 테두리 | `#1b2534` | Window and notice outlines, header rules |
| 테두리 (강) | `#2c3d57` | Filled handover slots and irreversible notice emphasis |
| 규칙선 | `#131b27` | Row dividers and low-emphasis separators |
| 글 | `#dfe9ff` | Primary body text |
| 글 (약) | `#93a6c6` | Secondary prose and explanatory text |
| 글 (더 약) | `#6b7c99` | Labels, stamps, quiet metadata |
| 글 (비활성 1) | `#33415c` | Disabled text |
| 글 (비활성 2) | `#2b3750` | Deeper disabled text and unavailable items |
| 신호 | `#8fd0ff` | Active clocks, kind labels, selected states, enabled commit |
| 신호 위 글 | `#04070e` | Text printed on signal-colour filled controls |
| 경고 | `#e88a6a` | Irreversible actions and system failure only |
| 채굴된 행 | `#0a0e16` | Mined report row background |
| 슬롯 채움 | `#0c1119` | Filled handover slot background |
| 슬롯 빈칸 테두리 | `#18222f` | Empty handover slot border |

## Typography

Use the repository's bundled font delivery, but keep this authored stack and
metric intent:

- Body and headings: **IBM Plex Sans KR**, weights 400 and 600.
- Stamps, labels, counters, and buttons: **IBM Plex Mono**, weight 400.
- Mono tracking: `0.16em` to `0.28em`; the widest tracking is for portal marks
  and major buttons.
- Do not use colour alone to create hierarchy. Pair colour with size, weight,
  spacing, or rules.

| Context | Size / Leading | Notes |
| --- | --- | --- |
| Notice lead | `17px / 1.5` | Full-screen notices may use `21px / 1.5` |
| Notice body | `13px / 1.85` | Quiet institutional prose |
| Feed line | `13px / 1.65` | 신체 and 정체 use `12px`; 계통 uses `11.5px` mono |
| Record row | `13px / 1.7` | One sentence per row |
| Handover slot | `12px / 1.6` | Minimum slot height `42px` |
| Tally row | `11px`; value `11.5px` | Compact, consequence-level data |
| Stamps and labels | `9.5px` to `10px` | Mono, tracked |

## Feed Line Kinds

The six feed line kinds are separated by **weight and size, never colour alone**.
The kind is determined by source, not by arbitrary style assignment.

| Kind | Label | Text Treatment | Label Colour |
| --- | --- | --- | --- |
| 세계 | `세계` / `문서` | `13px` 400, `#dfe9ff` | `#6b7c99` |
| 회선 | Speaker name | `13px` 400, `#dfe9ff`, quoted speech | `#8fd0ff` |
| 요원 | `요원` | `13px` 600, `#dfe9ff` | `#dfe9ff` |
| 신체 | `신체` | `12px`, `#6b7c99` | `#6b7c99` |
| 정체 | `정체` | `12px`, `#6b7c99` | `#6b7c99` |
| 계통 | `계통` | `11.5px` mono, `letter-spacing: 0.08em`, `#8fd0ff` | `#8fd0ff` |

## Layout Constants

The 1280x800 terminal layout uses:

| Constant | Value |
| --- | --- |
| `GUTTER` | `14px` |
| `GAP` | `16px` |
| `COL_LEFT_RATIO` | `0.5` |
| `ROW_TOP_RATIO` | `0.3` |
| Pane padding | `20px` |
| Header band | `13px 20px 11px` |
| Notice footer | `7px 20px` |
| Button padding | `6px 13px` |
| Stack gap | `8px` to `12px` |
| Border radius | `0` |

Window geometry at 1280x800:

| Window | x | y | w | h |
| --- | ---: | ---: | ---: | ---: |
| LIVE FEED | 14 | 14 | 640 | 772 |
| REPORTS | 670 | 14 | 596 | 227 |
| AGENT FILE | 670 | 257 | 596 | 529 |

The intended terminal arrangement puts LIVE FEED full-height on the left,
REPORTS top-right, and AGENT FILE bottom-right. When this layout is implemented,
row-major keyboard order must follow the visual order.

## Window Shell

All three main surfaces share the same shell:

- `1px solid #1b2534`
- `background: #080b12`
- no radius
- header band `13px 20px 11px`
- header bottom rule `1px solid #1b2534`
- left header label: mono `10px`, `letter-spacing: 0.24em`, `#6b7c99`
- right header live value: `#8fd0ff`

Only LIVE FEED scrolls while a run is active.

## LIVE FEED

Rows use `grid-template-columns: 46px 52px 1fr`, `gap: 12px`, `padding: 9px 0`,
and `border-bottom: 1px solid #131b27`.

Columns:

1. time stamp: mono `11px`, `#6b7c99`
2. kind tag: mono `10px`, `letter-spacing: 0.14em`
3. sentence text following the six-kind table

Nothing in LIVE FEED is pressable.

## REPORTS

Reports are sentence rows, not cards.

- row grid: `98px 1fr`
- row padding: `10px 12px`
- row divider: `1px solid #1b2534`
- hover: `rgba(143,208,255,0.07)`
- left stamp: `시각 · 종`, mono `9.5px`, `letter-spacing: 0.1em`,
  `white-space: nowrap`, `#8fd0ff`
- sentence: `13px / 1.7`

Mined rows stay in place. Use `background: #0a0e16`, text `#6b7c99`,
`text-decoration: line-through #8fd0ff`, and add `· 이관됨` to the stamp.

## AGENT FILE

Inside order:

1. header
2. scrolling body with briefing and four handover slots
3. fixed commit row
4. tally

Briefing:

- `1px solid #131b27`
- `background: #05070c`

Handover slots:

- stack gap `8px`
- `min-height: 42px`
- `padding: 8px 12px`
- filled: `background: #0c1119`, `border: 1px solid #2c3d57`
- empty: `background: #080b12`, `border: 1px solid #18222f`
- locked: filled content at `opacity: 0.6`, rows unpressable, status text says
  the file is sealed for the run

Commit row:

- counter: mono `10px`, `#6b7c99`
- DEPLOY button: `flex: 1`, `padding: 11px`, mono `11px`,
  `letter-spacing: 0.24em`
- enabled button: signal fill `#8fd0ff`, text `#04070e`

The handover cap is four. The counter is a reading, not a gate; empty deployment
is allowed when the product copy says it is allowed.

## Notices

Notices share one object:

- width `520px`; full-screen notice width `640px`
- outer border `1px solid #1b2534`
- background `#080b12`
- header band `11px 20px 10px`, bottom rule
- body `20px 20px 18px`, `gap: 12px`
- lead `17px / 1.5`, `#dfe9ff`
- body lines `13px / 1.85`, `#93a6c6`
- footer `7px 20px`, top rule
- footer note left, buttons right
- button padding `6px 13px`, mono `10px`

The five plate notices are 신규 운영자 안내, 모의 과정 안내, 배치 확인, 시행 중단,
and 훈련 강평. A judgement-call failure is not a plate: it prints as a `※` feed
line and the run continues.

Use warning treatment only for 배치 확인, 시행 중단, and the system-failure feed
line.

## Entry

The authentication screen establishes the institution before play:

- 74px ringed `緊` seal
- 27px portal name
- mono `EMERGENCY RESPONSE ROOM`, `letter-spacing: 0.4em`
- 300x1px rule
- terminal line `ERR-2 · 운영자 단말 접속`
- two printed credential wells, not inputs
- well label column `84px`
- well border `1px solid #2c3d57`, background `#05070c`
- well value mono `13px`, `letter-spacing: 0.22em`
- footer status `인증 대기` and dead `LOGIN`
- four corner marks

Scenario selection shows incident cards with difficulty grade, run allotment,
and status only. The picker must not spoil the scenario.

## Coach Mark

The coach mark is one line, not a modal document:

- no header, no title
- sentence at `13.5px`
- controls: `▶▶` for skip and `✓` for confirm
- skip is first in DOM and visual order
- plate border `1px solid #2c3d57`
- plate background `#080b12`
- plate padding `12px 14px`
- scrim `rgba(3,5,9,0.74)` with one even-odd hole
- target stays full brightness
- hole edge `1px solid #8fd0ff`
- straight leader line to the plate
- scrim and leader use `pointer-events: none`

The desk remains operable under the coach mark.

## Ending

Ending uses three plates in sequence over the sealed terminal:

- veil `rgba(3,5,9,0.86)`
- plate width `640px`
- heads: 시뮬레이션 종료, 훈련 강평, 모의 과정 완료
- counters: `1 / 3`, `2 / 3`, `3 / 3`
- three pips, each `26px x 2px`, at the foot

Good and bad paths come from pack-authored ending data. 배정 소진 folds into the
third plate rather than receiving a separate screen.

## Interaction Rules

- Mining toggles a report row into or out of the next free handover slot.
- Mined rows remain visible in REPORTS.
- Cap handover slots at four.
- Deploy is always available unless the file is already locked.
- Deploy opens 배치 확인; 파견 commits and locks; 취소 returns.
- A locked file is visually quieter and no longer pressable.
- Fallback is a `※` feed line, never a modal.
- No text input is allowed anywhere.

## Open Checks For Implementation

- REPORTS at `227px` is tight for long records; reassess only when implementing
  the layout, not in the design-system file.
- Scenario packs vary in feed length, decision count, and tally rows. Avoid
  hard-coding row counts.
- When implementing the LIVE FEED / REPORTS column swap, update focus order with
  the visual order.
