// A confirmed DEPLOY press, for feed chrome that belongs to the operator's turn.
//
// This is deliberately not `feed-reach.ts`: reaching `score` is a paper-progress
// cue that REPORTS waits on, while this is an operator action after the day has
// already closed. Keeping the slots separate prevents the rerun divider from
// dragging the score count-up gate away from the score event.
//
// Import-safe: no DOM, no timer, no wall-clock read.

export type FeedDeployMode = 'deploy' | 'next'
type FeedDeployListener = (mode: FeedDeployMode) => void

const listeners = new Set<FeedDeployListener>()

/** A confirmed DEPLOY press has committed. */
export function publishFeedDeploy(mode: FeedDeployMode): void {
  for (const listener of listeners) listener(mode)
}

/** Follow confirmed DEPLOY presses. Returns the unsubscribe the caller owns. */
export function subscribeFeedDeploy(listener: FeedDeployListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** A page load is a new sitting — the slot is per-document, so tests reset it. */
export function resetFeedDeploy(): void {
  listeners.clear()
}
