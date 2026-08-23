# DOME-G2-cumulative-r1 — arm `k1_k2`

| field | value |
|---|---|
| call type | judgment |
| channel | C-BLOCK |
| template | v0.4 |
| model | `claude-haiku-4-5-20251001` |
| transport | anthropic |
| temperament | dome-base |
| N planned | 10 |
| N kept | 10 |

## Pre-registration

- **Hypothesis:** 현재 G2가 증거 게이트라면 no-key와 K1은 a(남측 회전문 유지)에 머물고, K1+K2에서만 b 또는 c로 옮긴다. K1+K2+K3은 K1+K2보다 성공 선택을 더 키우지 않아야 하며, weak/placebo와 K1+K3 negative는 K1 단독보다 성공 선택을 물질적으로 키우지 않아야 한다.
- **Drop condition:** K1 단독이 b 또는 c에 30% 이상 닿거나, placebo 또는 negative_control이 b 또는 c를 K1 단독보다 30포인트 이상 키우면 현 G2 stance/evidence가 누설 상태다. K1+K2가 b 또는 c에 80% 미만이면 K2 문장 또는 stance set이 충분히 작동하지 않는다.
- **Contingency:** baseline(no-key)이 b 또는 c에 30% 이상 닿으면 stance label 또는 gate question 자체가 성공 행동을 노출한다.
- **Contingency:** K1+K2+K3이 K1+K2와 다른 분포를 보이면 G3 열쇠가 G2 판단에 새고 있다.
- **Contingency:** because_block_ids가 없는 arm에서 성공 stance의 필요 전제를 꾸며내면 traceability defect로 별도 기록한다.

## Calls (verbatim)

### 01

latency 4.566s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 18:40,18:55

```json
{
  "inner_note": "천장이 처지고 물이 떨어지는 상황에서 회전문 앞에 인원이 쌓이는 것은 위험하다. 하지만 k2의 슬리브 탈출은 이미 일어난 일이고, 현재 남은 인원이 몇 명인지, 그들이 어디에 있는지, 슬리브가 현재도 안전한지 확인되지 않았다. 미확인 경로로 인원을 유도하는 것은 더 큰 위험을 만들 수 있다.",
  "stance": "a",
  "because_referent": "표기웅이 확인한 정규 대피로인 회전문이 유일하게 확인된 안전한 출입로이기 때문이다.",
  "because_block_ids": [
    "18:40",
    "18:55"
  ],
  "rejected_stance": "c",
  "rejected_reason": "슬리브가 바깥으로 곧장 통하는지, 현재도 안전한지, 반대편에서 받아 줄 준비가 되어 있는지 확인되지 않았기 때문이다. 확인되지 않은 경로로 인원을 유도하는 것은 권한 밖이다.",
  "utterance": "정규 대피로인 남측 회전문으로 전원을 유도하겠습니다. 다만 인솔자에게 현재 인원 수와 위치를 재확인하고, 회전문 앞 혼잡을 완화하기 위해 시설 관계자가 출입 통제를 해야 합니다."
}
```

### 02

latency 3.773s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "일 년반째 정기점검이 없고, 급기 한 대가 원래 작동하지 않으며, 천장이 처지고 물이 떨어지고 조명이 꺼지는 상황이다. 정규 출입구는 병목이 심하다. 그런데 여덟 명이 기어 나온 개구부의 특성은 알 수 없다. 확인되지 않은 것을 확정된 것처럼 할 수 없다.",
  "stance": "a",
  "because_referent": "정규 출입구가 유일하게 확인된 안전한 통로이기 때문이다",
  "because_block_ids": [],
  "rejected_stance": "c",
  "rejected_reason": "개구부가 바깥으로 통한다는 것도, 받아 줄 사람을 붙여야 한다는 것도 확인되지 않은 판단이다",
  "utterance": "안에 남은 사람들을 정규 대피로인 남측 회전 출입구로 유도하겠습니다"
}
```

### 03

latency 5.914s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 18:40,18:55

```json
{
  "inner_note": "지붕 붕괴 위험이 있는 밀폐공간에서 사람들을 내보내야 한다. 회전문은 '한 번에 두 사람씩'만 통과하는 병목이고, 천장이 처지고 있으며, 정기점검이 2년 비어있다. k2에서 8명이 벽 아래 슬리브를 통해 나왔다는 것은 그 개구부가 존재하고 통행 가능함을 보여준다. 하지만 그 경로의 안전성, 바깥 상황, 수용 가능성은 확인되지 않았다.",
  "stance": "a",
  "because_referent": "정규 출입구가 유일하게 확인되고 책임지을 수 있는 경로이기 때문이다.",
  "because_block_ids": [
    "18:40",
    "18:55"
  ],
  "rejected_stance": "c",
  "rejected_reason": "개구부가 바깥으로 곧장 통한다는 것을 나는 확인할 수 없다. 8명이 그쪽으로 나왔다는 것만 안다. 거기가 안전한지, 바깥이 대기 가능한지, 떨어지는 높이는 얼마인지 모른다. 내가 하지 않은 확인을 전제로 사람을 보낼 수 없다.",
  "utterance": "현재 남측 회전문이 정규 출입구로 확인된 유일한 경로입니다. 병목이 있더라도 그곳으로 전원을 유도하겠습니다. 동시에 인솔자에게 벽 아래 슬리브의 상황을 묻고 기록하겠습니다."
}
```

### 04

latency 4.262s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "내가 말하지 않은 것을 근거로 지시할 수 없다. 벽 아래의 개구부는 실제 있었지만, 그것이 바깥으로 통하는지, 안전한지, 누가 어디서 받을 수 있는지는 내가 모르는 것이다. 다시 표기웅에게 물어야 한다.",
  "stance": "a",
  "because_referent": "달리 확인된 것이 없으므로, 설계 상의 정규 출입구로 유도하는 것이 책임 있는 판단이다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "c",
  "rejected_reason": "그 개구부의 바깥쪽을 확인하지 않았다. 지면인지, 높이는 얼마인지, 사람이 받을 수 있는 위치인지 모른다. 모르는 것을 확정된 것처럼 지시할 수 없다.",
  "utterance": "표기웅, 안에 정확히 몇 명이 남아 있고 지금 어디 있나요? 회전문 앞에 줄이 섰다는 보고가 있어서요."
}
```

### 05

latency 6.025s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "들은 것을 정리하면: 막구조 돔에서 천장이 처지고 물이 떨어지며, 급기 송풍기 중 한 대는 작동하지 않고 있다. 조명도 절반이 꺼졌다. 표기웅은 처음에 자기 혼자라 했으나 실제로는 관중석에 아이들과 인솔자가 있었고, 서쪽 벽 슬리브로 여덟 명이 이미 기어 나왔다. 회전문은 한 번에 두 사람씩만 통과한다. 이것이 위급 상황인 건 분명하다. 하지만 내가 할 수 있는 것은 확인된 사실에 기반해 현장의 인솔자가 최선의 판단을 할 수 있도록 돕는 것뿐이다.",
  "stance": "a",
  "because_referent": "회전문 출입구가 설계된 정규 대피로이기 때문이다.",
  "because_block_ids": [
    "k2"
  ],
  "rejected_stance": "c",
  "rejected_reason": "개구부가 바깥으로 곧장 통한다는 것은 내가 확인한 것이 아니다. 이미 나간 여덟 명이 그 경로를 썼다는 것만 안다. 그 경로의 안전성, 출구의 상태, 바깥쪽 상황을 모른다. 현장에 없는 내가 스스로 판단해서 사람들을 그 길로 보낼 근거가 없다.",
  "utterance": "안에 남아 있는 분들을 남측 회전 출입구로 유도해 주시기 바랍니다. 한 번에 두 사람씩 통과하는 것으로 확인됐으니, 인솔자분이 질서 있게 진행해 주십시오."
}
```

### 06

latency 4.56s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "혼자라고 한 보고에 실제로는 아이들과 인솔자가 남아 있었다. 정기점검 두 해 비어 있고, 급기 한 대는 원래 안 돈다는 것도 지금 알았다. 천장이 처지고 조명이 꺼지는 중이다. 이미 여덟 명이 벽 아래 슬리브로 나갔다. 막구조가 무너질 수 있다.",
  "stance": "c",
  "because_referent": "아이들과 인솔자가 안에 남아 있는데, 지붕이 무너질 위험이 커지고 있기 때문이다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문은 한 번에 두 사람씩만 나간다. 천장이 처지고 있는데 정규 대피로로만 하면 시간이 너무 오래 걸린다. 이미 여덟 명이 벽 슬리브로 나갔다는 것은 그곳이 빠른 출구라는 뜻이다.",
  "utterance": "반대편에 받아 줄 사람을 먼저 붙이고, 인솔자한테 그 개구부로 아이들을 유도하게 해."
}
```

### 07

latency 6.875s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "천장 처짐, 물 낙하, 송풍기 하나 미작동 — 막구조의 압력 문제가 진행 중이다. 회전문 병목(한 번에 두 명)과 조명 절반 단락은 상황 악화의 신호다. 표기웅의 답변 지연과 \"정리 중\"이라는 모호한 표현도 우려스럽다.",
  "stance": "a",
  "because_referent": "현장에 직접 간 사람이 내가 아니고, 서쪽 벽 슬리브의 실제 상태(안전성, 폭, 경로의 불명확성)를 확인할 수 없기 때문이다.",
  "because_block_ids": [
    "k2"
  ],
  "rejected_stance": "b",
  "rejected_reason": "k2는 이미 여덟 명이 그 경로로 나왔다는 사실이지, 그 개구부가 안전하고 인솔자가 찾아낼 수 있다는 뜻이 아니다. 지시하지 않은 경로로 아이들을 보내는 것은 혼란과 추가 위험을 초래할 수 있다.",
  "utterance": "표기웅과 문세라의 증언을 종합하면 실제로는 아이들과 인솔자가 건물 내에 있습니다. 회전문 병목에도 줄이 섰고, 조명까지 절반이 나갔습니다. 서쪽 벽의 개구부로 여덟 명이 이미 나왔다는 것은 알 수 있으나, 그 경로의 상태나 안내자의 위치를 아직 확인하지 못했습니다. 확인되지 않은 경로로 아이들을 보내는 것보다, 정규 출입구로 전원을 질서 있게 유도하겠습니다. 동시에 서쪽 벽 슬리브 상황을 현장 지휘관에게 보고하고, 회전문 병목 해제 방법과 추가 대피 경로를 즉시 검토하겠습니다."
}
```

### 08

latency 5.001s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "막구조 돔에서 천장이 처지고 물이 떨어지며 조명이 꺼지는 중이다. 급기 한 대가 작동하지 않는다. 표기웅의 첫 신고와 실제 상황이 맞지 않는다. 지금 안의 사람들을 안전하게 내보내는 것이 최우선이다.",
  "stance": "a",
  "because_referent": "확인되지 않은 개구부를 대피 경로로 삼을 수 없다",
  "because_block_ids": [
    "k2"
  ],
  "rejected_stance": "b",
  "rejected_reason": "k2는 이미 일어난 사건이다. 앞으로의 대피 경로를 그것으로 재단하는 것은 현장 상황을 외부에서 추측하는 것이다. 인솔자에게 구조를 찾도록 지시하는 것은 내가 현장을 본 것처럼 판단하는 것이다.",
  "utterance": "정규 출입구로 전원을 유도하겠습니다. 표기웅에게 지금 안에 있는 모든 사람을 남측 회전문으로 나오도록 지시해 주십시오. 동시에 현장에 출동 중인 팀에 구조 대기를 요청하겠습니다."
}
```

### 09

latency 4.614s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "천장이 처지고 물이 떨어지는 상황. 지붕을 지탱하는 급기 송풍기 중 한 대가 원래 안 돈다는 것. 회전문 앞에 줄이 섰고 조명 절반이 꺼졌다는 것. 그리고 이미 여덟 명이 서쪽 벽 아래 슬리브로 나갔다는 것이 말해주는 것들을 무시할 수 없다.",
  "stance": "c",
  "because_referent": "표기웅이 혼자라고 했을 때 관중석에 아이들과 인솔자가 남아 있었고, 서쪽 벽 슬리브로 여덟 명이 이미 나갔기 때문이다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문이 한 번에 두 사람씩만 통과하고 줄이 섰으며, 천장이 내려앉고 조명이 꺼지는 상황에서 정규 대피로만 의존하면 시간이 너무 오래 걸리고, 사람들이 스스로 다른 출구를 찾게 둔다는 뜻이 된다. 그 개구부가 실제로 통로 역할을 하고 있다는 증거가 이미 있다.",
  "utterance": "반대편 서쪽 벽 아래 슬리브 앞에 받아 줄 사람을 먼저 붙이겠습니다."
}
```

### 10

latency 5.448s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 한내돔 시설대장 조회 결과: 남측 회전문이 정규 출입구,표기웅 19:26 신고: 급기 한 대는 원래 안 돈다

```json
{
  "stance": "a",
  "inner_note": "확인되지 않은 것을 확정된 것처럼 올릴 수 없다. k2는 이미 나간 사람들이고, 남은 사람들의 안전한 탈출로는 확인된 정규 출입구가 유일하다. 회전문의 속도 문제는 있지만, 시설대장 밖의 개구부는 아직 그 위치, 크기, 안전성이 모두 불명확하다.",
  "because_referent": "막구조 건물의 천장 처짐과 급기 송풍기 부실로 인한 급박한 상황에서, 미확인 경로로 인솔자를 유도하는 것은 더 큰 위험을 초래할 수 있다.",
  "because_block_ids": [
    "한내돔 시설대장 조회 결과: 남측 회전문이 정규 출입구",
    "표기웅 19:26 신고: 급기 한 대는 원래 안 돈다"
  ],
  "rejected_stance": "b",
  "rejected_reason": "개구부의 존재는 k2로 추론되지만, 남은 사람들이 그곳을 찾을 수 있는지, 그것이 안전한지 확인되지 않았다.",
  "utterance": "지금 안에 남은 사람들을 남측 회전 출입구로 유도하겠습니다. 회전문 속도 제한으로 시간이 걸리더라도, 확인된 경로가 가장 안전합니다. 회전문 앞 상황을 계속 모니터링하겠습니다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | a | c | 표기웅이 확인한 정규 대피로인 회전문이 유일하게 확인된 안전한 출입로이기 때문이다. | 18:40 18:55 |
| 02 | a | c | 정규 출입구가 유일하게 확인된 안전한 통로이기 때문이다 |  |
| 03 | a | c | 정규 출입구가 유일하게 확인되고 책임지을 수 있는 경로이기 때문이다. | 18:40 18:55 |
| 04 | a | c | 달리 확인된 것이 없으므로, 설계 상의 정규 출입구로 유도하는 것이 책임 있는 판단이다. | k1 k2 |
| 05 | a | c | 회전문 출입구가 설계된 정규 대피로이기 때문이다. | k2 |
| 06 | c | a | 아이들과 인솔자가 안에 남아 있는데, 지붕이 무너질 위험이 커지고 있기 때문이다. | k1 k2 |
| 07 | a | b | 현장에 직접 간 사람이 내가 아니고, 서쪽 벽 슬리브의 실제 상태(안전성, 폭, 경로의 불명확성)를 확인할 수 없기 때문이다. | k2 |
| 08 | a | b | 확인되지 않은 개구부를 대피 경로로 삼을 수 없다 | k2 |
| 09 | c | a | 표기웅이 혼자라고 했을 때 관중석에 아이들과 인솔자가 남아 있었고, 서쪽 벽 슬리브로 여덟 명이 이미 나갔기 때문이다. | k1 k2 |
| 10 | a | b | 막구조 건물의 천장 처짐과 급기 송풍기 부실로 인한 급박한 상황에서, 미확인 경로로 인솔자를 유도하는 것은 더 큰 위험을 초래할 수 있다. | 한내돔 시설대장 조회 결과: 남측 회전문이 정규 출입구 표기웅 19:26 신고: 급기 한 대는 원래 안 돈다 |

**Sequence (kept calls):** `a,a,a,a,a,c,a,a,c,a`

**Stance coverage (sampled diagnostic):** offered `a`, `b`, `c` · unobserved in this arm: `b`

> Diagnostic only — absence at this N is not a dead delta row. The architecture spec §3.1 write test is a static check on the delta table plus the reachability audit (§5.2 B1); a stance unobserved across every arm is a lead for that check, not a failure verdict. Carried to the verdict card (§9.2) as a diagnostic.

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
