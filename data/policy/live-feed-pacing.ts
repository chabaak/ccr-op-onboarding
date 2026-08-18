/**
 * LIVE FEED timing knobs.
 *
 * Data, not renderer logic: the feed pump imports these values and the node tests
 * recompute the shipped day from them so a pacing change stays visible.
 */
export const LIVE_FEED_PACING = {
  rowPauseMs: 280,
  msPerChar: 17,
  gapOpenMs: 260,
  gapMsPerMinute: 24,
  gapMaxMs: 900,
} as const
