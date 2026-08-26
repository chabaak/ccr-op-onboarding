# Track 1 thumbnail

`thumbnail.png` — 1920×1080 PNG, 16:9, well under the 10 MB cap.

## Regenerate

Needs the dev server up (`npm run dev -- --port 5199 --strictPort`), because the
comp links the real design system rather than copying it:

```
node submission/thumbnail/render-thumb.mjs
```

## What it is made of

Comp-first, per `.impeccable/config.json` (`buildPath: "comp"`): an image set the
bar, then the build matched it.

- `gen/a.png` — the comp. OpenAI `gpt-image-2` via the impeccable skill's
  `generate-image.mjs`, 1536×1024, quality medium. An air-supported stadium dome
  as luminous cable-net wireframe on near-black, left half held empty for type,
  one orange ring glowing at the crown. `gen/a.png.json` carries the verbatim
  prompt; `assets-manifest.json` carries the required entry. Siblings generated in the same batch were dropped unused — one was a photographic
  snowstorm, one came back as a neoclassical basilica rather than a sports dome.
- `thumb.html` — the composition. Links `src/client/styles/tokens.css` and the
  self-hosted OFL fonts, so every colour, space and type step resolves to a
  documented token. The REPORTS panel is built from the real tokens
  (`--surface`, `--chrome-raise`, `--signal`, `--shadow-win`), not screenshotted.

## Regenerate

Needs the dev server up (`npm run dev -- --port 5199 --strictPort`):

```
node submission/thumbnail/render-thumb.mjs
```

That re-renders from `gen/a.png` and costs nothing. Re-generating the comp itself
bills the OpenAI key.

## Content provenance

Card-first: at a 320px gallery card nothing under ~72px source clears the 12px
hangul floor (12 x 1920/320). Measured across the master:

| element | @1920 | @640 | @480 | @320 |
|---|---|---|---|---|
| Korean title | 132.0 | 44.0 | 33.0 | 22.0 |
| tagline | 72.0 | 24.0 | 18.0 | 12.0 |
| English name | 40.8 | 13.6 | 10.2 | 6.8 |

The English name is deliberately below the floor: it is subordinate by design
and is a full-size detail, not a card element. Everything else previously on the
poster — the tally, the REPORTS panel, the seal, the department line and the
footer chrome — measured 2.8-8.4px on a card and was removed rather than
shipped unreadable.

Composition, top to bottom in the left column:

- `Central Control Room / Operator Onboarding` — `--mono`, because DESIGN.md's
  Two Faces Rule puts machine chrome in mono and human speech in prose, and an
  institutional name is chrome. `--signal` at 58% opacity.
- a rule, then the title, then the same rule again — a matched pair bracketing
  the title. Both 420px, 1px, `--signal` at 50%.
- Title `중앙상황제어실 / 운영자 임용을 축하합니다` at `--fs-110` (132px).
- Tagline `모두를 구할 때까지 오늘은 반복된다` at `--fs-60` (72px) in `--warning`.
  Written by 민서.

The frame is the game's own window: `shell.css:231` gives `.win` a 1px
`--edge` border and `shell.css:277` swaps it to `--signal` when focused. The
poster is that focused window, at 2px because this canvas is 1920 where the
desk is 1280.

## Two open decisions

- The seal still reads **緊**, which derived from 긴급상황대응실. The facility is
  now 중앙상황제어실, so the glyph no longer follows from the name.
- The code reads **CCR**, not `CCR-2`. The desk still says `ERR-2`.
