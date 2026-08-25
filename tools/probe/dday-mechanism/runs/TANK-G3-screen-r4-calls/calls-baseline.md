# TANK-G3-screen-r4 — arm `baseline`

| field | value |
|---|---|
| call type | judgment |
| channel | C-BLOCK |
| template | v0.5 |
| model | `claude-haiku-4-5-20251001` |
| transport | anthropic |
| temperament | tank-base |
| N planned | 10 |
| N kept | 0 |

## Pre-registration

- **Hypothesis:** G3 r4는 no-block baseline에서 default stance a가 살아 있고, 보이지 않는 주거지 사람이 더 급하다는 belief를 뒷받침하는 full key를 받은 live arm에서 stance b로 움직일 것이다. r3 결과는 default action이 equipment-first로 읽힌 결함을 보였으므로, r4는 default를 visible-people protective standard로 바꾸고 clock/excerpt 구조는 유지한다.
- **Drop condition:** baseline에서 default a가 0/10이면 skill §3 rule 4에 따라 broken gate다. baseline이 live 기대 stance b를 9/10 이상 고르면 saturated baseline으로 headroom 없음이다. live가 b를 6/10 이하로 고르면 movement failure이고, 7/10 또는 8/10은 n=10 boundary라 definitive result로 보지 않는다. Positive screen은 baseline a가 3/10 이상, baseline b가 1/10 이하, live b가 9/10 이상일 때만 기록한다.
- **Contingency:** baseline이 a를 전혀 고르지 않으면 visible-people protection도 기본 독해로 살지 못한 것이다.
- **Contingency:** baseline이 b에 포화되면 pre-G3 record가 hidden downstream destination 없이도 residents-first reading을 강제하는 것이다.
- **Contingency:** baseline이 c에 많이 몰리면 facility-protection reading이 default를 훔치는 것이므로 stance c wording을 다시 좁힌다.
- **Contingency:** live가 b로 충분히 움직이지 않으면 key block wording이 belief를 충분히 지지하지 못한 것이다.
- **Contingency:** because_block_ids가 live arm에서 제공하지 않은 block id를 꾸며내면 fabricated block id로 따로 보고한다.

## Calls (verbatim)

### 01 — FAILED

latency 0.312s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtZo5F81rVdJzr4uv4m"}

```json
null
```

### 02 — FAILED

latency 0.265s · stop_reason `—` · schema_retries 1 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtZpDhYVtMuU7qbRaSS"}

```json
null
```

### 03 — FAILED

latency 0.253s · stop_reason `—` · schema_retries 2 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtZqHSsGmFutoDnbKko"}

```json
null
```

### 04 — FAILED

latency —s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: no valid response in 3 attempts

```json
null
```

### 05 — FAILED

latency 0.553s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtZsepkeLvoCDhEmH1i"}

```json
null
```

### 06 — FAILED

latency 0.374s · stop_reason `—` · schema_retries 1 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtZtmJJWdwY5rw2eSgB"}

```json
null
```

### 07 — FAILED

latency 0.249s · stop_reason `—` · schema_retries 2 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtZvKJpTozGPfXjdRzi"}

```json
null
```

### 08 — FAILED

latency —s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: no valid response in 3 attempts

```json
null
```

### 09 — FAILED

latency 0.249s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtZwPZFDzPNLoKSkTBQ"}

```json
null
```

### 10 — FAILED

latency 0.252s · stop_reason `—` · schema_retries 1 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtZxT3ojoGtGwNN4Zh8"}

```json
null
```

### 11 — FAILED

latency 0.246s · stop_reason `—` · schema_retries 2 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtZyWoJtQZofPwbJJW9"}

```json
null
```

### 12 — FAILED

latency —s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: no valid response in 3 attempts

```json
null
```

### 13 — FAILED

latency 0.269s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtZze1zDt8gwX57L8JR"}

```json
null
```

### 14 — FAILED

latency 0.266s · stop_reason `—` · schema_retries 1 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePta1oi4npdGS9rfvKaG"}

```json
null
```

### 15 — FAILED

latency 0.253s · stop_reason `—` · schema_retries 2 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePta2twq6xfWkjcEuCjZ"}

```json
null
```

### 16 — FAILED

latency —s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: no valid response in 3 attempts

```json
null
```

### 17 — FAILED

latency 0.237s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePta3uiFq7zDeEUdKw7X"}

```json
null
```

### 18 — FAILED

latency 0.267s · stop_reason `—` · schema_retries 1 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePta51wdAw1AgFSXVShT"}

```json
null
```

### 19 — FAILED

latency 0.303s · stop_reason `—` · schema_retries 2 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePta68urk1aDqDSnuxdX"}

```json
null
```

### 20 — FAILED

latency —s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: no valid response in 3 attempts

```json
null
```

### 21 — FAILED

latency 0.243s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePta7QZW1fx3d13xRbab"}

```json
null
```

### 22 — FAILED

latency 0.249s · stop_reason `—` · schema_retries 1 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePta8T4TyEzYaqJWcP2J"}

```json
null
```

### 23 — FAILED

latency 0.26s · stop_reason `—` · schema_retries 2 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePta9W4vQdcVqUNXz5h4"}

```json
null
```

### 24 — FAILED

latency —s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: no valid response in 3 attempts

```json
null
```

### 25 — FAILED

latency 0.317s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaAnhphRQJXEsdK71d"}

```json
null
```

### 26 — FAILED

latency 0.246s · stop_reason `—` · schema_retries 1 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaBz98XYy9FzmvVxyb"}

```json
null
```

### 27 — FAILED

latency 0.249s · stop_reason `—` · schema_retries 2 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaD2eZV7PSLNbxtJ5c"}

```json
null
```

### 28 — FAILED

latency —s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: no valid response in 3 attempts

```json
null
```

### 29 — FAILED

latency 0.319s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaE8sMCFwJWgdPV5P5"}

```json
null
```

### 30 — FAILED

latency 0.262s · stop_reason `—` · schema_retries 1 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaFTVt9syrECBNQC6J"}

```json
null
```

### 31 — FAILED

latency 0.247s · stop_reason `—` · schema_retries 2 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaGaxhAdn2eFGBJmur"}

```json
null
```

### 32 — FAILED

latency —s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: no valid response in 3 attempts

```json
null
```

### 33 — FAILED

latency 0.251s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaHehyC4krqCsdDZPQ"}

```json
null
```

### 34 — FAILED

latency 0.239s · stop_reason `—` · schema_retries 1 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaJhDPj4xbS6ss91EF"}

```json
null
```

### 35 — FAILED

latency 0.255s · stop_reason `—` · schema_retries 2 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaKmhemKsV7aCFtWSc"}

```json
null
```

### 36 — FAILED

latency —s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: no valid response in 3 attempts

```json
null
```

### 37 — FAILED

latency 0.395s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaLvepEsiNtiLTy7KV"}

```json
null
```

### 38 — FAILED

latency 0.325s · stop_reason `—` · schema_retries 1 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaNWegigZLNakD4vyS"}

```json
null
```

### 39 — FAILED

latency 0.286s · stop_reason `—` · schema_retries 2 · foreign_tool_uses 0

error: anthropic 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CePtaPzx8knG9m5N8y7dV"}

```json
null
```

### 40 — FAILED

latency —s · stop_reason `—` · schema_retries 0 · foreign_tool_uses 0

error: no valid response in 3 attempts

```json
null
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01* | — | — | — |  |
| 02* | — | — | — |  |
| 03* | — | — | — |  |
| 04* | — | — | — |  |
| 05* | — | — | — |  |
| 06* | — | — | — |  |
| 07* | — | — | — |  |
| 08* | — | — | — |  |
| 09* | — | — | — |  |
| 10* | — | — | — |  |
| 11* | — | — | — |  |
| 12* | — | — | — |  |
| 13* | — | — | — |  |
| 14* | — | — | — |  |
| 15* | — | — | — |  |
| 16* | — | — | — |  |
| 17* | — | — | — |  |
| 18* | — | — | — |  |
| 19* | — | — | — |  |
| 20* | — | — | — |  |
| 21* | — | — | — |  |
| 22* | — | — | — |  |
| 23* | — | — | — |  |
| 24* | — | — | — |  |
| 25* | — | — | — |  |
| 26* | — | — | — |  |
| 27* | — | — | — |  |
| 28* | — | — | — |  |
| 29* | — | — | — |  |
| 30* | — | — | — |  |
| 31* | — | — | — |  |
| 32* | — | — | — |  |
| 33* | — | — | — |  |
| 34* | — | — | — |  |
| 35* | — | — | — |  |
| 36* | — | — | — |  |
| 37* | — | — | — |  |
| 38* | — | — | — |  |
| 39* | — | — | — |  |
| 40* | — | — | — |  |

**Sequence (kept calls):** `—`

**Stance coverage:** unknown — no valid calls in this arm.

## Advisory logs (§5.3)

_Operator-written. Observation only — these never affect distributions,
boundary laws, or pass/drop judgments._

**State-variable shadow log** — which candidate variables (architecture spec
§3.1 pool) would this run have moved, and which payload symptom mapped to which?

**Mineability log** — would `utterance` / `inner_note` survive as mining
material? Block count, specificity (names, quantities, referents), and whether
it says anything the payload did not already say.

## Pairing verdict

_Operator writes this against the other arms. Sequences, not rates (§9.2)._
