import { CALL_SPECS } from "./calls.js";
import type { RuntimeConfig } from "./config.js";
import { defaultPromptFor } from "./default-prompt.js";
import { errorCode, ProviderOutputError, PublicError } from "./errors.js";
import { renderCall } from "./prompt.js";
import type { CallProvider } from "./provider.js";
import type { CallRequest, CallTelemetry, TokenUsage } from "./types.js";

/**
 * One call, end to end: render → Bedrock → validate.
 *
 * ## This tier does not synthesize fallbacks — it reports failure
 *
 * Engine spec §5 assigns a fallback to each call type, and two of the three need
 * data that only the engine has: Call 1 must proceed with `gates.json`'s
 * authored `default_stance` ("the engine does not choose the default stance" —
 * picking the first of the set would be an undeclared baseline and breaks
 * architecture spec §6.2), and Call 3 must fill `facts` from the engine's own
 * objective log. Only Call 2's fallback (empty arrays) could be produced here.
 *
 * So all three live on the engine side, and this tier's job is to say clearly
 * that the call failed and why: a non-2xx carrying `x-llm-fallback: true` and
 * `x-fallback-code`. Synthesizing Call 2's fallback here and not the other two
 * would scatter one behavior across two tiers to save the engine three lines.
 *
 * That reading of §5's "every response carries x-llm-fallback" is a decision,
 * not a quotation — the spec does not say which side builds the substitute.
 */

export type CallResult = {
  response: unknown;
  telemetry: CallTelemetry;
};

const ROUTE_TIMEOUT_MS = 18_000;
const MAX_ATTEMPTS = 3;

type Clock = () => number;

export class CallService {
  constructor(
    private readonly config: RuntimeConfig,
    private readonly provider: CallProvider,
    private readonly now: Clock = () => performance.now(),
  ) {}

  async handle(request: CallRequest): Promise<CallResult> {
    const spec = CALL_SPECS[request.call_type];
    const startedAt = this.now();

    // Render AND build the tool schema before calling. Both can fail on a bad
    // payload — an unfilled slot, a STANCE_SET with one entry — and finding that
    // out must cost zero tokens. Building the tool inside the provider would
    // also make the failure indistinguishable from a model failure, which is
    // exactly the confusion the fallback headers exist to prevent.
    const rendered = renderCall(
      request,
      defaultPromptFor(request.pack) as unknown as Record<string, unknown>,
    );
    const tool = spec.buildTool(request.slots);

    let attempts = 0;
    let usage = emptyUsage();

    while (attempts < MAX_ATTEMPTS) {
      attempts += 1;
      let result;
      try {
        result = await this.provider.generate(request, rendered, tool);
      } catch (error) {
        throw asFallback(error, {
          attempts,
          latencyMs: Math.round(this.now() - startedAt),
        });
      }

      usage = addUsage(usage, result.usage);
      const problems = spec.validate(result.payload, request.slots);
      if (!problems.length) {
        return {
          response: result.payload,
          telemetry: {
            callType: request.call_type,
            templateVersion: request.template_version,
            modelId: this.config.modelId,
            latencyMs: Math.round(this.now() - startedAt),
            attempts,
            fallback: false,
            usage,
          },
        };
      }

      const error = new ProviderOutputError(
        `Model output failed validation: ${problems.join("; ")}`,
        usage,
      );
      if (attempts >= MAX_ATTEMPTS || !this.canStartAnotherAttempt(startedAt)) {
        throw asFallback(error, {
          attempts,
          latencyMs: Math.round(this.now() - startedAt),
        });
      }
    }

    throw new Error("unreachable call retry loop state");
  }

  private canStartAnotherAttempt(startedAt: number): boolean {
    return this.now() - startedAt + this.config.modelTimeoutMs <= ROUTE_TIMEOUT_MS;
  }
}

/**
 * Anything the model side did wrong becomes a PublicError whose `code` the
 * handler puts in `x-fallback-code`. A caller can then tell "the model failed,
 * apply your authored fallback" apart from "your request was malformed".
 */
export class FallbackError extends PublicError {
  readonly attempts: number | undefined;
  readonly latencyMs: number | undefined;

  constructor(
    status: number,
    code: string,
    message: string,
    telemetry: { attempts?: number; latencyMs?: number } = {},
  ) {
    super(status, code, message);
    this.name = "FallbackError";
    this.attempts = telemetry.attempts;
    this.latencyMs = telemetry.latencyMs;
  }
}

function asFallback(
  error: unknown,
  telemetry: { attempts?: number; latencyMs?: number } = {},
): FallbackError {
  if (error instanceof FallbackError) return error;
  if (error instanceof ProviderOutputError) {
    return new FallbackError(502, "invalid_model_output", error.message, telemetry);
  }
  if (error instanceof PublicError) {
    // A 4xx here is the client's fault, not the model's — pass it through so it
    // does not masquerade as a fallback the engine should absorb.
    if (error.status < 500) throw error;
    return new FallbackError(error.status, error.code, error.message, telemetry);
  }
  return new FallbackError(
    502,
    errorCode(error),
    "The model call did not produce a usable response.",
    telemetry,
  );
}

function emptyUsage(): TokenUsage {
  return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
}

function addUsage(left: TokenUsage, right: TokenUsage): TokenUsage {
  return {
    inputTokens: left.inputTokens + right.inputTokens,
    outputTokens: left.outputTokens + right.outputTokens,
    totalTokens: left.totalTokens + right.totalTokens,
  };
}
