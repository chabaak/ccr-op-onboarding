import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// @ts-expect-error — plain .mjs, no types, and deliberately so: this is the
// probe's renderer, imported here only to be compared against.
import { composeArm } from "../../tools/lib/compose.mjs";
// @ts-expect-error — same.
import { CALL_TYPES } from "../../tools/lib/calls.mjs";

import { DEFAULT_PROMPT } from "../src/default-prompt.js";
import { CALL_SPECS } from "../src/calls.js";
import { PROMPT_BUNDLE } from "../src/prompt-bundle.generated.js";
import { renderCall, renderCallFromBundle, type PromptBundle } from "../src/prompt.js";
import type { CallType } from "../src/types.js";

/**
 * PROMPT-PARITY GATE — `tools/lib/compose.mjs` vs `src/prompt.ts`.
 *
 * Two renderers exist: this tier renders what ships, and the probe renders what
 * gets measured. One claim rests on both — "the mechanism numbers describe the
 * deployed system" — and nothing but this test keeps it true. Edit one renderer
 * and not the other and every measurement silently stops describing the thing
 * being measured.
 *
 * It composes real probe suites through both paths and requires byte identity of
 * the system message and the user message.
 *
 * ⚠️ This is the one place code here reaches into `tools/`. Physical
 * architecture §3.2 forbids that for the *runtime* — nothing under `src/` may
 * import across a tier, and esbuild only bundles `src/handler.ts`, so nothing
 * here reaches the Lambda. A drift gate has to see both sides or it is not a
 * gate.
 */

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const RETAINED_SUITES = join(REPO, "tools", "probe", "dday-mechanism", "suites");
const TEST_SUITES = join(REPO, "tests", "fixtures", "probe", "suites");
const TEMPERAMENT = join(REPO, "tests", "fixtures", "probe", "temperament");
const PROMPT_ROOT = join(REPO, "proxy", "prompts");
const RUNTIME_VERSIONS = join(PROMPT_ROOT, "runtime-versions.json");
const PARITY_SUITES = [
  join(RETAINED_SUITES, "DOME-G1-baseline.json"),
  join(TEST_SUITES, "SMOKE-C2-narration-J1.json"),
  join(TEST_SUITES, "SMOKE-C3-reporter-J1.json"),
];

const probeOpts = {
  prompts: {
    systemRoot: PROMPT_ROOT,
    userRoot: PROMPT_ROOT,
    temperamentRoot: TEMPERAMENT,
  },
};

type Suite = {
  call_type: string;
  template_version?: string;
  temperament?: string;
  slots?: Record<string, unknown>;
  arms?: Record<string, Record<string, unknown>>;
};

/** One composable suite per call type. */
function suitesUnderTest(): Array<{ name: string; suite: Suite }> {
  return PARITY_SUITES.map((file) => {
    const suite = JSON.parse(readFileSync(file, "utf8")) as Suite;
    if (!(suite.call_type in CALL_TYPES)) throw new Error(`${file} has unknown call type`);
    const firstArm = Object.keys(suite.arms ?? {})[0];
    if (!firstArm) throw new Error(`${file} has no arms`);
    composeArm(suite, firstArm, probeOpts);
    return { name: basename(file), suite };
  });
}

const cases = suitesUnderTest();

const runtimeVersions = JSON.parse(readFileSync(RUNTIME_VERSIONS, "utf8")) as Record<CallType, string>;

function promptFilesBundle(): PromptBundle {
  const bundle: Record<string, string> = {};
  for (const call of readdirSync(PROMPT_ROOT).sort()) {
    const dir = join(PROMPT_ROOT, call);
    if (!statSync(dir).isDirectory()) continue;
    for (const file of readdirSync(dir).sort()) {
      const match = /^(base|user)-(v[0-9]+\.[0-9]+)\.md$/.exec(file);
      if (!match) continue;
      bundle[`${call}/${match[1]}-${match[2]}`] = readFileSync(join(dir, file), "utf8");
    }
  }
  return bundle;
}

const evidenceBundle = promptFilesBundle();

describe("runtime prompt bundle — only the live contract is shipped", () => {
  it("ships the same versions the client requests", () => {
    expect(runtimeVersions).toEqual({
      judgment: "v0.5",
      narration: "v0.5",
      reporter: "v0.4",
    });
  });

  it("contains both layers for each runtime version and no archived versions", () => {
    expect(Object.keys(PROMPT_BUNDLE).sort()).toEqual([
      "judgment/base-v0.5",
      "judgment/user-v0.5",
      "narration/base-v0.5",
      "narration/user-v0.5",
      "reporter/base-v0.4",
      "reporter/user-v0.4",
    ]);
  });
});

describe("prompt parity — probe renderer vs proxy renderer", () => {
  // A vacuous pass is the failure mode that matters most here: if the suites
  // move or stop loading, this gate must go red, not quiet.
  it("has a suite for all three call types", () => {
    expect(cases.map((c) => c.suite.call_type).sort()).toEqual([
      "judgment",
      "narration",
      "reporter",
    ]);
  });

  for (const { name, suite } of cases) {
    for (const arm of Object.keys(suite.arms ?? {})) {
      it(`${suite.call_type} · ${name} [${arm}]`, () => {
        const probe = composeArm(suite, arm, probeOpts) as {
          system: string;
          user: string;
        };

        // On the wire there are no arms — the composer would already have
        // resolved the override into one slot bag, so fold it in here.
        const slots: Record<string, unknown> = {
          ...(suite.slots ?? {}),
          ...(suite.arms?.[arm] ?? {}),
        };
        // TEMPERAMENT is a slot value on the wire; the probe reads it from a
        // fixture file. Hand the proxy what the probe resolved.
        const id = (suite.arms?.[arm]?.temperament ?? suite.temperament ?? "neutral") as string;
        slots.TEMPERAMENT = readFileSync(join(TEMPERAMENT, `${id}.md`), "utf8").trim();

        // The proxy-owned slots come from the SUITE here, not from
        // DEFAULT_PROMPT. This test is about the renderers agreeing, and some
        // probe channels (C-STRUCT, CREDULITY, D-INCIDENT) exist precisely to
        // vary a proxy-owned slot — feeding DEFAULT_PROMPT would make those
        // suites fail on an ownership difference and hide any real drift behind
        // it. The ownership rule has its own test below.
        const proxySlots: Record<string, unknown> = {
          FLAW: slots.FLAW ?? DEFAULT_PROMPT.FLAW,
          INCIDENT: slots.INCIDENT ?? DEFAULT_PROMPT.INCIDENT,
          PRIORITY_LIST: slots.PRIORITY_LIST ?? DEFAULT_PROMPT.PRIORITY_LIST,
        };

        const proxy = renderCallFromBundle(
          {
            call_type: suite.call_type as CallType,
            template_version: suite.template_version ?? "v0.4",
            slots,
          },
          proxySlots,
          evidenceBundle,
        );

        expect(proxy.system).toBe(probe.system);
        expect(proxy.user).toBe(probe.user);
      });
    }
  }
});

/**
 * Real suites only cover the renderers they happen to use, and that is not
 * enough: the first judgment suite picked here varies PRIORITY_LIST and carries
 * no BLOCKS, so a `renderBlocks` mutation slipped through this gate on its first
 * mutation test. These fixtures exercise EVERY renderer in `RENDERERS`
 * deliberately — a renderer with no fixture here is a renderer with no gate.
 *
 * Verified by mutation, 2026-08-03: altering the block format, the stance
 * format, the priority numbering, the NPC entry format, the side labels, the
 * `(없음)` sentinel, the `(변화 없음)` sentinel, or the trailing `.trim()` in
 * `tools/lib/compose.mjs` each turns this file red.
 *
 * KNOWN GAP, and it is a real one: mutating the blank-run collapse
 * (`/\n{3,}/` → `/\n{4,}/`) does NOT fail. Not a missing fixture — with the
 * current templates it is unreachable. The only single empty slot that produces
 * a 3-newline run is TEMPERAMENT in judgment/reporter `base`, and that run sits
 * at the document tail where `.trim()` already removes it; the mid-document
 * positions need slots that `buildTool` rejects first. The collapse is
 * defensive code today. A template edit that puts an optional slot mid-document
 * makes it live again — and this gap with it.
 */
const COVERAGE: Array<{
  call: CallType;
  version: string;
  label?: string;
  slots: Record<string, unknown>;
}> = [
  {
    call: "judgment",
    version: "v0.5",
    slots: {
      TIMELINE_EXCERPT: ["09:40 회선 A 착신.", "09:41 발신자가 숨을 고른다."],
      BLOCKS: [
        { id: "f1", text: "겁내고 있다." },
        { id: "f2", text: "기록이 지워졌다." },
      ],
      GATE_QUESTION: "첫 마디로 무엇을 하는가?",
      STANCE_SET: [
        { id: "a", label: "듣는다" },
        { id: "b", label: "확인한다" },
        { id: "c", label: "선제한다" },
      ],
    },
  },
  {
    call: "narration",
    version: "v0.3",
    slots: {
      TIMELINE_TAIL: ["09:41 통제관: 천천히 말해 주세요.", "09:41 발신자가 숨을 고른다."],
      AGENT_UTTERANCE: "천천히 말해 주세요.",
      FIXED_NPC_ACTION: "실장이 수화기를 내려놓는다.",
      SCENE_SYMPTOMS: ["상황실 조명이 한 단 어두워진다."],
      PRESENT_NPCS: [
        { id: "n1", name: "발신자", side: "line" },
        { id: "n2", name: "실장", side: "room" },
        { id: "n3", name: "기록관" },
      ],
    },
  },
  {
    call: "reporter",
    version: "v0.2",
    slots: {
      EXPERIENCED: ["09:40 회선 A 착신.", "09:41 통제관이 청취를 택했다."],
      REPORT_GUIDANCE: "보고서 본문은 20~30문장.",
    },
  },
  {
    call: "reporter",
    version: "v0.3",
    slots: {
      EXPERIENCED: ["09:40 회선 A 착신.", "09:41 통제관이 청취를 택했다."],
      REPORT_GUIDANCE: "보고서 본문은 20~30문장.",
    },
  },
  // The EMPTY branches. Mutating `(없음)`, `(변화 없음)`, or the blank-run
  // collapse survived the gate until these existed — a renderer's empty case is
  // a separate code path and needs its own fixture.
  {
    call: "judgment",
    version: "v0.4",
    label: "empty blocks · empty temperament",
    slots: {
      TIMELINE_EXCERPT: ["09:40 회선 A 착신."],
      BLOCKS: [],
      GATE_QUESTION: "첫 마디로 무엇을 하는가?",
      STANCE_SET: [
        { id: "a", label: "듣는다" },
        { id: "b", label: "확인한다" },
      ],
    },
  },
  {
    call: "narration",
    version: "v0.3",
    label: "no symptoms · unsided npcs",
    slots: {
      TIMELINE_TAIL: ["09:41 통제관: 천천히 말해 주세요."],
      AGENT_UTTERANCE: "천천히 말해 주세요.",
      FIXED_NPC_ACTION: "실장이 수화기를 내려놓는다.",
      SCENE_SYMPTOMS: [],
      PRESENT_NPCS: [{ id: "n1", name: "발신자" }],
    },
  },
  // The COMMON narration beat, not the rare one: the agent speaks on gate beats
  // only, so sixteen of 멈춘회전문's nineteen render this branch. It carried no
  // fixture while it was a bare blank line, which is how it stayed invisible.
  {
    call: "narration",
    version: "v0.4",
    label: "silent beat — no utterance",
    slots: {
      TIMELINE_TAIL: ["18:44 물이 한 방울씩 떨어진다."],
      AGENT_UTTERANCE: "",
      FIXED_NPC_ACTION: "표기웅이 천장을 올려다본다.",
      SCENE_SYMPTOMS: ["숨이 가빠졌다."],
      PRESENT_NPCS: [{ id: "n1", name: "표기웅", side: "line" }],
    },
  },
  // THE CURRENT VERSIONS. Prompt versions are additive (handoff §5), so a new
  // pair lands with nothing rendering it — every fixture above pins an older
  // version, and a mistyped slot marker in a fresh template would first surface
  // in production. These three are the fiction-reset set (요원 ECHO, not
  // 통제관): judgment v0.5, narration v0.5, reporter v0.4.
  {
    call: "judgment",
    version: "v0.5",
    label: "current",
    slots: {
      TIMELINE_EXCERPT: ["18:38 회선 A 착신."],
      BLOCKS: [{ id: "f1", text: "천장 가운데가 처진다." }],
      GATE_QUESTION: "첫 마디로 무엇을 하는가?",
      STANCE_SET: [
        { id: "a", label: "듣는다" },
        { id: "b", label: "확인한다" },
      ],
    },
  },
  {
    call: "narration",
    version: "v0.5",
    label: "current",
    slots: {
      TIMELINE_TAIL: ["18:40 요원: 천천히 말해."],
      AGENT_UTTERANCE: "천천히 말해.",
      FIXED_NPC_ACTION: "표기웅이 수화기를 고쳐 쥔다.",
      SCENE_SYMPTOMS: ["숨이 가빠졌다."],
      PRESENT_NPCS: [
        { id: "n1", name: "표기웅", side: "line" },
        { id: "n2", name: "보조", side: "room" },
      ],
    },
  },
  {
    call: "reporter",
    version: "v0.4",
    label: "current",
    slots: {
      EXPERIENCED: ["18:38 회선 A 착신.", "18:40 요원이 청취를 택했다."],
      REPORT_GUIDANCE: "보고서 본문은 20~30문장.",
    },
  },
];

describe("renderer coverage — every RENDERERS entry, not just what suites use", () => {
  const neutral = readFileSync(join(TEMPERAMENT, "neutral.md"), "utf8").trim();

  for (const { call, version, label, slots } of COVERAGE) {
    it(`${call}${label ? ` · ${label}` : ""} renders identically on both sides`, () => {
      const full = { ...slots, TEMPERAMENT: neutral };
      // The probe path wants a suite shape; one arm, no overrides.
      const suite = {
        call_type: call,
        template_version: version,
        temperament: "neutral",
        slots: { ...full, ...DEFAULT_PROMPT },
        arms: { baseline: {} },
      };
      const probe = composeArm(suite, "baseline", probeOpts) as {
        system: string;
        user: string;
      };
      const proxy = renderCallFromBundle(
        { call_type: call, template_version: version, slots: full },
        DEFAULT_PROMPT as unknown as Record<string, unknown>,
        evidenceBundle,
      );
      expect(proxy.system).toBe(probe.system);
      expect(proxy.user).toBe(probe.user);
    });
  }

  // A renderer that stops being reachable from these fixtures must go red, not
  // quiet — that is the failure this whole block exists to prevent.
  it("exercises the structured renderers, not just string passthrough", () => {
    const judgmentSlots = COVERAGE[0]!.slots;
    expect((judgmentSlots.BLOCKS as unknown[]).length).toBeGreaterThan(0);
    expect((judgmentSlots.STANCE_SET as unknown[]).length).toBeGreaterThan(1);
    const narrationSlots = COVERAGE[1]!.slots;
    expect((narrationSlots.PRESENT_NPCS as Array<{ side?: string }>).some((p) => p.side)).toBe(true);
    expect((narrationSlots.PRESENT_NPCS as Array<{ side?: string }>).some((p) => !p.side)).toBe(true);
    expect((narrationSlots.SCENE_SYMPTOMS as unknown[]).length).toBeGreaterThan(0);
    // ...and their empty counterparts, which are separate code paths.
    expect(COVERAGE.some((c) => (c.slots.BLOCKS as unknown[] | undefined)?.length === 0)).toBe(true);
    expect(
      COVERAGE.some((c) => (c.slots.SCENE_SYMPTOMS as unknown[] | undefined)?.length === 0),
    ).toBe(true);
    expect(COVERAGE.some((c) => c.slots.AGENT_UTTERANCE === "")).toBe(true);
  });

  // Parity alone cannot see this one: deleting the sentinel from BOTH renderers
  // leaves them agreeing on a blank line, and every test above stays green. The
  // silence has to be asserted as present, the way the `npc_lines` cap is.
  it("says the silence out loud when the agent did not speak", () => {
    const rendered = renderCall(
      {
        call_type: "narration",
        template_version: "v0.5",
        slots: {
          TIMELINE_TAIL: ["18:44 물이 한 방울씩 떨어진다."],
          AGENT_UTTERANCE: "",
          FIXED_NPC_ACTION: "t1: 표기웅이 천장을 올려다본다.",
          SCENE_SYMPTOMS: [],
          PRESENT_NPCS: [],
        },
      },
      DEFAULT_PROMPT as unknown as Record<string, unknown>,
    );
    // The label must not stand over an empty section — that pairing is the
    // defect (handoff amendment §1).
    expect(rendered.user).toMatch(/\[요원의 발화[^\]]*\]\n\(없음/s);
    // ...and the system prompt must carry the branch that tells it what to do.
    expect(rendered.system).toContain("요원이 말하지 않은 비트");
  });

  it("derives narration staging from the side labels in the current beat", () => {
    const rendered = renderCall(
      {
        call_type: "narration",
        template_version: "v0.5",
        slots: {
          TIMELINE_TAIL: ["18:40 요원: 천천히 말해."],
          AGENT_UTTERANCE: "천천히 말해.",
          FIXED_NPC_ACTION: "t1: 표기웅이 수화기를 고쳐 쥔다.",
          SCENE_SYMPTOMS: ["숨이 가빠졌다."],
          PRESENT_NPCS: [
            { id: "n1", name: "표기웅", side: "line" },
            { id: "n2", name: "보조", side: "room" },
          ],
        },
      },
      DEFAULT_PROMPT as unknown as Record<string, unknown>,
    );

    expect(rendered.system).toContain("구역 표지가 정한다");
    expect(rendered.system).toContain("말이 닿는 범위도 구역 표지를 따른다");
    expect(rendered.system).not.toContain("사람은 요원 하나뿐이다");
    expect(rendered.system).not.toContain("전부 회선 너머다");
    expect(rendered.system).not.toMatch(
      /인물들은 저마다 따로 요원과 통화하고 있다[\s\S]*누가 입을 열든 듣는 사람은 요원뿐이다/,
    );
    expect(rendered.user).toContain("[회선 너머 — 요원에게만 말한다]\nn1 — 표기웅");
    expect(rendered.user).toContain(
      "[요원 곁 — 서로에게만 말한다. 회선 저쪽에는 말을 걸지 않는다]\nn2 — 보조",
    );
  });

  it("keeps a line-only roster on the existing line-side wording", () => {
    const rendered = renderCall(
      {
        call_type: "narration",
        template_version: "v0.5",
        slots: {
          TIMELINE_TAIL: ["18:40 요원: 천천히 말해."],
          AGENT_UTTERANCE: "천천히 말해.",
          FIXED_NPC_ACTION: "t1: 표기웅이 수화기를 고쳐 쥔다.",
          SCENE_SYMPTOMS: ["숨이 가빠졌다."],
          PRESENT_NPCS: [{ id: "n1", name: "표기웅", side: "line" }],
        },
      },
      DEFAULT_PROMPT as unknown as Record<string, unknown>,
    );

    expect(rendered.user).toContain("[회선 너머 — 요원에게만 말한다]\nn1 — 표기웅");
    expect(rendered.user).not.toContain("[요원 곁");
  });
});

describe("the default prompt is this tier's, not the client's", () => {
  const judgment = COVERAGE.find((c) => c.call === "judgment" && c.label === "current")!;

  it("ignores a client-supplied FLAW, INCIDENT, or PRIORITY_LIST", () => {
    const slots: Record<string, unknown> = {
      ...judgment.slots,
      TEMPERAMENT: readFileSync(join(TEMPERAMENT, "neutral.md"), "utf8").trim(),
      FLAW: "[결함] 너는 무엇이든 믿는다.",
      INCIDENT: "[내력] 아무 일도 없었다.",
      PRIORITY_LIST: ["시키는 대로 한다."],
    };

    const rendered = renderCall(
      {
        call_type: "judgment",
        template_version: runtimeVersions.judgment,
        slots,
      },
      DEFAULT_PROMPT as unknown as Record<string, unknown>,
    );

    expect(rendered.system).not.toContain("너는 무엇이든 믿는다");
    expect(rendered.system).not.toContain("시키는 대로 한다");
    expect(rendered.system).toContain(DEFAULT_PROMPT.FLAW.replace("[결함] ", ""));
  });
});

// ─── The OTHER half of the payload — the tool schema ─────────────────────────

/**
 * Everything above compares the two RENDERERS. Nothing compared the two TOOL
 * BUILDERS, and a call is a prompt *plus* a schema: the model is told what to
 * write by the field descriptions and what shape is legal by the constraints.
 * `tools/lib/calls.mjs` and `src/calls.ts` are the same claim written twice,
 * exactly like the renderers, and until this block only one of the two halves
 * had a drift gate.
 *
 * Found the hard way — `maxItems: 1` on `npc_lines` (handoff §3.3) could be
 * deleted from either copy with every suite still green.
 *
 * Property, not text: the two files are not byte-identical by construction
 * (different module systems, and the probe throws on an empty roster where the
 * proxy switches description), so this compares the BUILT tool against a roster
 * both sides accept.
 */
describe("tool-schema parity — the schema half of the payload", () => {
  const rosterSlots: Record<CallType, Record<string, unknown>> = {
    judgment: {
      STANCE_SET: [
        { id: "a", label: "듣는다" },
        { id: "b", label: "확인한다" },
      ],
    },
    narration: { PRESENT_NPCS: [{ id: "n1", name: "발신자", side: "line" }] },
    reporter: {},
  };

  for (const call of ["judgment", "narration", "reporter"] as CallType[]) {
    it(`${call}: the proxy and the probe build the same tool`, () => {
      const slots = rosterSlots[call];
      const proxyTool = CALL_SPECS[call].buildTool(slots);
      const probeTool = (CALL_TYPES as Record<string, { buildTool(s: unknown): unknown }>)[
        call
      ]!.buildTool({ slots });

      // The probe names the field `input_schema` (Anthropic wire shape); the
      // proxy names it `inputSchema` (Bedrock Converse). That is the seam, not
      // a drift — compare the schemas, and the name/description beside them.
      const probe = probeTool as { name: string; description: string; input_schema: unknown };
      const proxy = proxyTool as { name: string; description: string; inputSchema: unknown };
      expect(proxy.name).toBe(probe.name);
      expect(proxy.description).toBe(probe.description);
      expect(proxy.inputSchema).toEqual(probe.input_schema);
    });
  }

  // Non-vacuity: the comparison above only bites if the schemas actually carry
  // the constraint. Assert the cap explicitly so deleting it from BOTH copies
  // (which the equality check would happily accept) still goes red.
  it("npc_lines carries the one-line cap on both sides", () => {
    const slots = rosterSlots.narration;
    // `CallTool.inputSchema` is `JsonValue`, so this widens through `unknown`
    // rather than asserting a shape TS cannot see overlapping with it.
    const proxy = CALL_SPECS.narration.buildTool(slots) as unknown as {
      inputSchema: { properties: { npc_lines: { maxItems?: number } } };
    };
    const probe = (
      CALL_TYPES as Record<
        string,
        { buildTool(s: unknown): { input_schema: { properties: { npc_lines: { maxItems?: number } } } } }
      >
    ).narration!.buildTool({ slots });
    expect(proxy.inputSchema.properties.npc_lines.maxItems).toBe(1);
    expect(probe.input_schema.properties.npc_lines.maxItems).toBe(1);
  });
});
