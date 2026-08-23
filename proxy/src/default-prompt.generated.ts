/**
 * ⚠ GENERATED FILE — do not edit by hand.
 * Source: `data/scenario/index.json`, `data/scenario/default-prompts.json`,
 * and the slot sources declared there.
 * Regenerate with `npm run prompts:bundle`; `--check` fails on drift and runs
 * inside `npm run check`. Scenario pack names are fingerprinted before they
 * reach this module, so proxy source does not carry pack literals.
 */

export type DefaultPromptSlots = {
  FLAW: string;
  INCIDENT: string;
  PRIORITY_LIST: string[];
};

const freeze = (slots: {
  FLAW: string;
  INCIDENT: string;
  PRIORITY_LIST: string[];
}): DefaultPromptSlots =>
  Object.freeze({
    ...slots,
    PRIORITY_LIST: Object.freeze([...slots.PRIORITY_LIST]) as unknown as string[],
  }) as DefaultPromptSlots;

export const DEFAULT_PROMPTS_BY_KEY: Readonly<Record<string, DefaultPromptSlots>> =
  Object.freeze({
  "24803c10ec8d7c3f42ce7242c6efe9c00d83dce2831b3b0782789ae1d5021f3b": freeze({
    FLAW: "[결함] 너는 회선 저쪽 사람이 자기에게 불리한 것을 빼고 말할 수 있다는 것을 자주 잊는다.",
    INCIDENT: "[내력] 지난겨울, 네가 접수 분류를 한 칸 낮춰 적은 신고가 하나 있었다.",
    PRIORITY_LIST: ["회선을 유지한다 — 끊기면 아무것도 알 수 없다","확인되지 않은 것을 확정된 것처럼 올리지 않는다"],
  }),
  });

export const FALLBACK_PROMPT_KEY = "24803c10ec8d7c3f42ce7242c6efe9c00d83dce2831b3b0782789ae1d5021f3b";
