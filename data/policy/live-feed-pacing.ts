/**
 * LIVE FEED timing knobs.
 *
 * Data, not renderer logic: the feed pump imports these values and the node tests
 * recompute the shipped day from them so a pacing change stays visible.
 */
export const LIVE_FEED_PACING = {
  rowPauseMs: 700,
  msPerChar: 48,
  gapOpenMs: 260,
  gapMsPerMinute: 24,
  gapMaxMs: 900,
} as const

export interface LiveFeedGapPolicy {
  readonly gapMaxMs: number
}

export const LIVE_FEED_DEFAULT_GAP_POLICY: LiveFeedGapPolicy = {
  gapMaxMs: LIVE_FEED_PACING.gapMaxMs,
}

function minuteOf(stamp: string): number {
  const match = /^(\d{1,2}):(\d{2})\+?$/.exec(stamp)
  if (match === null) throw new Error(`live feed pacing: ${JSON.stringify(stamp)} is not an HH:MM stamp`)
  return Number(match[1]) * 60 + Number(match[2])
}

export function liveFeedGapPolicyFromClocks(clocks: readonly string[]): LiveFeedGapPolicy {
  let maxGapMinutes = 0
  let previous: number | null = null
  for (const clock of clocks) {
    const minute = minuteOf(clock)
    if (previous !== null) maxGapMinutes = Math.max(maxGapMinutes, minute - previous)
    previous = minute
  }
  if (maxGapMinutes <= 0) return LIVE_FEED_DEFAULT_GAP_POLICY
  return {
    gapMaxMs: Math.min(
      LIVE_FEED_PACING.gapMaxMs,
      LIVE_FEED_PACING.gapOpenMs + maxGapMinutes * LIVE_FEED_PACING.gapMsPerMinute,
    ),
  }
}
