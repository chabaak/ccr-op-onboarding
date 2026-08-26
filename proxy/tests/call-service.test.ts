import { describe, expect, it } from "vitest";

import { CallService, FallbackError } from "../src/call-service.js";
import { DEFAULT_PROMPT } from "../src/default-prompt.js";
import { PublicError } from "../src/errors.js";
import { renderCall } from "../src/prompt.js";
import type { CallProvider, ProviderResult } from "../src/provider.js";
import type { CallRequest } from "../src/types.js";
import { judgmentSlots, validConfig } from "./fixtures.js";

const JUDGMENT_OK = {
  inner_note: "숨소리가 걸린다.",
  stance: "a",
  because_referent: "회선 A의 발신자를 두고 판단했다.",
  because_block_ids: [],
  rejected_stance: "b",
  rejected_reason: "확인이 먼저면 끊긴다.",
  utterance: "천천히 말해 주세요.",
};

const request: CallRequest = {
  call_type: "judgment",
  template_version: "v0.5",
  slots: judgmentSlots,
};

const narrationRequest: CallRequest = {
  call_type: "narration",
  template_version: "v0.5",
  slots: {
    TIMELINE_TAIL: ["외래 대기홀의 줄이 임시 처치구역 앞에서 무너진다."],
    AGENT_UTTERANCE: "",
    FIXED_NPC_ACTION: "",
    SCENE_SYMPTOMS: ["복도 끝 연기가 짙어진다."],
    PRESENT_NPCS: [],
  },
};

const NARRATION_OK = {
  event_lines: [],
  timeline_entries: ["창밖의 경광등이 젖은 유리에 번진다."],
  npc_lines: [],
};

const usage = { inputTokens: 10, outputTokens: 5, totalTokens: 15 };

function result(payload: unknown): ProviderResult {
  return { payload, latencyMs: 10, usage };
}

function sequenceProvider(entries: Array<ProviderResult | Error>): CallProvider & { attempts(): number } {
  let attempts = 0;
  return {
    attempts: () => attempts,
    async generate() {
      const entry = entries[attempts] ?? entries.at(-1);
      attempts += 1;
      if (entry instanceof Error) throw entry;
      return entry!;
    },
  };
}

describe("CallService validation retry budget", () => {
  it("passes on the first attempt without retrying", async () => {
    const provider = sequenceProvider([result(JUDGMENT_OK)]);
    const service = new CallService(validConfig, provider);

    const handled = await service.handle(request);

    expect(provider.attempts()).toBe(1);
    expect(handled.telemetry.attempts).toBe(1);
    expect(handled.response).toEqual(JUDGMENT_OK);
  });

  it("retries one validation failure and returns the clean response", async () => {
    const provider = sequenceProvider([
      result({ ...JUDGMENT_OK, stance: "not-offered" }),
      result(JUDGMENT_OK),
    ]);
    const service = new CallService(validConfig, provider);

    const handled = await service.handle(request);

    expect(provider.attempts()).toBe(2);
    expect(handled.telemetry.attempts).toBe(2);
    expect(handled.telemetry.usage).toEqual({ inputTokens: 20, outputTokens: 10, totalTokens: 30 });
    expect(handled.response).toEqual(JUDGMENT_OK);
  });

  it("keeps attempt one byte-identical and gives attempt two its rejection reason", async () => {
    const users: string[] = [];
    const provider: CallProvider = {
      async generate(_request, rendered) {
        users.push(rendered.user);
        return result(
          users.length === 1
            ? {
                ...NARRATION_OK,
                timeline_entries: ["외래 대기홀의 줄이 임시 처치구역 앞에서 무너진다."],
              }
            : NARRATION_OK,
        );
      },
    };
    const service = new CallService(validConfig, provider);

    const handled = await service.handle(narrationRequest);

    expect(handled.telemetry.attempts).toBe(2);
    expect(users[0]).toBe(
      renderCall(narrationRequest, DEFAULT_PROMPT as unknown as Record<string, unknown>).user,
    );
    expect(users[1]).toContain("[재시도 — 직전 응답은 거부되었다]");
    expect(users[1]).toContain("timeline_entries repeats the timeline tail");
  });

  it("falls back with invalid_model_output after all three attempts fail validation", async () => {
    const provider = sequenceProvider([
      result({ ...JUDGMENT_OK, stance: "bad-1" }),
      result({ ...JUDGMENT_OK, stance: "bad-2" }),
      result({ ...JUDGMENT_OK, stance: "bad-3" }),
    ]);
    const service = new CallService(validConfig, provider);

    await expect(service.handle(request)).rejects.toMatchObject({
      status: 502,
      code: "invalid_model_output",
      attempts: 3,
    } satisfies Partial<FallbackError>);
    expect(provider.attempts()).toBe(3);
  });

  it("does not retry a model timeout", async () => {
    const provider = sequenceProvider([
      new PublicError(504, "bedrock_timeout", "too slow"),
      result(JUDGMENT_OK),
    ]);
    const service = new CallService(validConfig, provider);

    await expect(service.handle(request)).rejects.toMatchObject({
      status: 504,
      code: "bedrock_timeout",
      attempts: 1,
    } satisfies Partial<FallbackError>);
    expect(provider.attempts()).toBe(1);
  });

  it("does not retry a validation failure when a full model timeout no longer fits", async () => {
    let now = 0;
    let attempts = 0;
    const provider: CallProvider & { attempts(): number } = {
      attempts: () => attempts,
      async generate() {
        attempts += 1;
        now = 12_000;
        return result({ ...JUDGMENT_OK, stance: "not-offered" });
      },
    };
    const service = new CallService(validConfig, provider, () => now);

    await expect(service.handle(request)).rejects.toMatchObject({
      status: 502,
      code: "invalid_model_output",
      attempts: 1,
    } satisfies Partial<FallbackError>);
    expect(provider.attempts()).toBe(1);
  });
});
