type Species = 'fact' | 'selfnarr' | 'emotion' | 'quote';
interface Sentence { id: string; text: string; species: Species; axis?: string }

type FeedKind = 'event' | 'radio' | 'npc' | 'symptom' | 'wait' | 'fallback' | 'mark';
interface FeedLine { kind: FeedKind; clock: string /* "HH:MM" */; text: string;
                     speaker?: string; sentence_id?: string /* set ⇢ minable */;
                     cited_slots?: number[] /* U5.4 — slot numbers, driver-resolved */ }

type ViewEvent =
  | { type: 'beat_start' | 'beat_end'; beat: number; clock: string }
  | { type: 'feed';     line: FeedLine }
  | { type: 'waiting';  active: boolean; for: 'judgment' | 'narration' | 'report' }
  | { type: 'fallback'; call: 1 | 2 | 3; code: string; beat: number }
  | { type: 'report';   round: number; facts: Sentence[]; report_body: Sentence[];
                        judged?: { stance_id: string; desc: string; cited_ids: string[] } }
  | { type: 'score';    total: number; baseline_total: number;
                        rows: { label: string; value: string | number;
                                baseline: string | number | null }[] }
  | { type: 'run_end';  run: number }
  | { type: 'meta';     run: number; runs_left: number; carried: string[];
                        archive: { run: number; label: string }[] };

type MembraneOp =
  | { op: 'slot';    block_id: string; slot: number }
  | { op: 'unslot';  slot: number }
  | { op: 'mine';    sentence_id: string }
  | { op: 'deploy';  blocks: string[] }
  | { op: 'new_run' };
