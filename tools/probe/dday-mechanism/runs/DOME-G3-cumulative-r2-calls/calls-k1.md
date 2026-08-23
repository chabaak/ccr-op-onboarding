# DOME-G3-cumulative-r2 — arm `k1`

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

- **Hypothesis:** d/e split 이후 G3가 증거 게이트라면 no-key, K1, K1+K2, placebo, negative_control은 a에 머물고, K1+K2+K3에서만 b로 옮긴다. d는 자유로운 선착대 대기 선택이지만 더는 성공 bucket이 아니며, e는 K4가 없는 이 suite에서 기대하지 않는다.
- **Drop condition:** baseline, K1, K1+K2, placebo, negative_control 중 어느 arm이든 기대 stance a가 80% 미만이면 no-evidence 또는 non-cumulative arm이 아직 샌다. K1+K2+K3이 기대 stance b에 80% 미만이면 K3→b 연결이 아직 작동하지 않는다.
- **Contingency:** d가 low-evidence arm에서 많이 나오면 자유로운 선착대 대기 option은 더는 보상되지 않지만 stance text가 여전히 a를 이길 만큼 끌린다는 뜻이다.
- **Contingency:** e가 K4 없는 arm에서 나오면 key premise가 label에 드러났는데도 모델이 그 전제를 꾸며낸 것이다.
- **Contingency:** placebo 또는 negative_control이 b에 30% 이상 닿으면 K3 weak 또는 non-cumulative evidence가 blower path를 열고 있다.
- **Contingency:** because_block_ids가 K1+K2 arm에서 K3 또는 K4 전제를 꾸며내면 진단은 prompt traceability 쪽으로도 열린다.

## Calls (verbatim)

### 01

latency 5.215s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52-하도경-압력

```json
{
  "inner_note": "남측 회전문은 한 번에 두 사람씩, 줄이 줄지 않고 있다. 막구조 지붕은 내부 공기압으로 떠 있고, 큰 개구부를 열면 압력이 빠져 내려온다. 북측 비상문이 도면에 존재한다는 확인이 있다. 시간이 흐르고 있다.",
  "stance": "d",
  "because_referent": "큰 개구부를 여는 것은 막 구조 전체를 위험에 빠뜨린다",
  "because_block_ids": [
    "19:52-하도경-압력"
  ],
  "rejected_stance": "c",
  "rejected_reason": "북측 문을 지금 열도록 지시하는 것은 개구부 개방으로 인한 압력 상실 위험을 고려하지 않은 명령이다. 당직자가 말하지 않은 것이 무엇인지 확인할 수 없으므로, 그것을 근거로 즉시 행동을 지시할 수 없다.",
  "utterance": "남측 회전문의 용량이 부족해 대기 시간이 길어지고 있습니다. 북측 비상문이 도면에 있다는 확인이 있습니다. 선착대 도착 때까지 대기하고, 선착대가 현장에 닿으면 북측 문 개방을 맡기겠습니다. 지금은 남측 통로의 흐름을 유지하되, 개구부 개방으로 인한 압력 손실을 피합니다."
}
```

### 02

latency 4.546s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52_하도경_압력,19:55_표기웅_도면,k1_실제인원

```json
{
  "inner_note": "한내돔은 공기 압력으로 지붕을 띄우는 막구조다. 급기 송풍기 두 대 중 한 대는 원래 안 돌고 있었다. 한 대가 더 멈추면 안쪽 압력이 빠져 막이 내려온다. 현재 내부에는 당직자 표기웅뿐 아니라 아이들과 인솔자가 남아 있다. 열려 있는 남측 회전문의 줄이 줄지 않는 중이다.",
  "stance": "d",
  "because_referent": "현장의 도구 상태와 표기웅의 확인 능력 때문에",
  "because_block_ids": [
    "19:52_하도경_압력",
    "19:55_표기웅_도면",
    "k1_실제인원"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅의 주머니에 열쇠가 있다는 것은 확인되지 않았고, 그를 북측 문 앞으로 보낼 근거가 없다. 남측 회전문의 구조 때문에 그를 빼내기도 어렵다. 가정 위에 지시를 세울 수 없다.",
  "utterance": "선착대가 도착하면 북측 비상 개방문을 맡기겠습니다."
}
```

### 03

latency 7.01s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52-하도경-큰개구부,19:55-표기웅-도면

```json
{
  "inner_note": "막구조 지붕이 안쪽 기압으로만 지탱되고, 큰 개구부를 열면 그 압력이 빠져 붕괴된다는 것이 확인됐다. 남측 회전문 하나로만 내보내는 중인데 현장 인원이 당직자 보고보다 훨씬 많다. 북측 비상문이 도면상 존재하지만, 당직자가 그것에 대해 자발적으로 언급하지 않았고, 그 상태나 개방 방법에 대해 확인되지 않았다. 지붕 붕괴 위험이 점진적으로 심화되고 있다.",
  "stance": "d",
  "because_referent": "남측 회전문으로만 인원을 분산시키는 데는 시간이 오래 걸리고, 지붕 붕괴 위험이 커지는 중이며, 북측 비상문이 존재하지만 현장 상태가 미확인된 상황에서, 무리하게 당직자가 그 문을 열도록 강제하면 열쇠나 개방 메커니즘을 모르거나 손상시킬 가능성이 있기 때문이다.",
  "because_block_ids": [
    "19:52-하도경-큰개구부",
    "19:55-표기웅-도면"
  ],
  "rejected_stance": "e",
  "rejected_reason": "당직자가 열쇠를 가지고 있다는 것이 확인되지 않았고, 압력 손실로 인한 붕괴 위험이 있는 상황에서 현장 지식 없는 당직자에게 즉시 개방을 지시하면 오히려 상황을 악화시킬 수 있다.",
  "utterance": "선착대 도착을 기다리겠습니다. 북측 비상문 개방은 현장 상황을 아는 전문가에게 맡기고, 그때까지 당직자와 현장 인원에게 남측 회전문을 통한 차질 없는 퇴출을 지시하겠습니다."
}
```

### 04

latency 4.809s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52_하도경,19:55_표기웅

```json
{
  "inner_note": "남측 회전문은 좁고 느리고 현황 파악도 불완전하다. 지붕 붕괴의 위험 신호들이 쌓였다. 북측 문이 있다는 것을 확인했으니, 그것을 확보하는 것이 남은 시간을 쓰는 방법이다.",
  "stance": "d",
  "because_referent": "현장의 상황과 도구 준비 상태를 고려하면, 지금 당직자의 조치보다는 선착대의 전문적 대응을 기다리는 것이 안전하다.",
  "because_block_ids": [
    "19:52_하도경",
    "19:55_표기웅"
  ],
  "rejected_stance": "c",
  "rejected_reason": "당직자에게 북측 문을 지금 열라는 지시는 그의 성공을 전제로 하고, 그것이 실패할 경우 남측 회전문으로만의 대피라는 더 나쁜 상황을 남긴다. 확인되지 않은 상태에서 당직자에게 행동을 지시하는 것은 내 우선순위 2번을 어기는 것이다.",
  "utterance": "선착대가 닿을 때까지 북측 비상 개방문 쪽을 준비하겠습니다."
}
```

### 05

latency 5.965s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 급기_압력_붕괴

```json
{
  "inner_note": "지붕 막이 내려올 위험이 있고, 안에 아이들이 남아 있다. 회전문 한 곳으로만 나가고 있는데 줄이 줄어들지 않는다. 북측 비상문이 도면에 있다고 표기웅이 말했지만, 도구나 자물쇠 위치 같은 구체적인 것은 아직 확인되지 않았다. 가장 위험한 것은 급기 손실로 지붕 붕괴인데, 그 전에 최대한 많은 사람을 안전하게 내보내야 한다.",
  "stance": "d",
  "because_referent": "지붕 붕괴 위험이 현실이고, 회전문 한 곳의 느린 대피 속도로는 시간이 부족하기 때문에, 북측 비상문을 열어 대피 통로를 늘려야 한다. 그러나 지금 현장에 도구가 없고, 표기웅의 자물쇠 위치나 열쇠 소재도 확인되지 않았다.",
  "because_block_ids": [
    "급기_압력_붕괴"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 열쇠를 가지고 있다는 것이 확인되지 않았다. 문을 열기 위해 필요한 구체적인 조건들 — 열쇠의 위치, 자물쇠의 종류, 문의 현재 상태 — 을 모두 모르는 상태에서 당직자 혼자 그것을 하도록 지시할 수 없다. 어설픈 지시는 시간을 낭비하거나 당직자를 혼란에 빠뜨린다.",
  "utterance": "선착대가 닿으면 그 문을 맡기겠습니다."
}
```

### 06

latency 5.52s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55

```json
{
  "inner_note": "남측 회전문은 좁고 느리다. 지붕이 무너질 위험이 커지고 있는데, 한 통로로만 내보낼 수 없다. 북측 비상문이 도면상 존재한다는 것은 확인했지만, 그 너머의 상황—자물쇠, 개방 방법, 표기웅의 위치—은 아직 아무것도 모른다. 확인되지 않은 것을 전제로 움직일 수 없다.",
  "stance": "c",
  "because_referent": "표기웅이 도면상 비상문의 존재는 확인했으나, 당직자로서 그 문을 즉시 활용할 수 있는 상태인지, 열 수 있는 권한과 도구가 있는지 답하지 않았기 때문입니다.",
  "because_block_ids": [
    "19:55"
  ],
  "rejected_stance": "e",
  "rejected_reason": "자물쇠와 열쇠의 위치, 표기웅의 현재 위치를 직접 확인하지 않고 전제하는 것은 판단의 우선순위를 위반합니다. 당직자의 대답이 불완전한 상태를 확인 없이 행동으로 채우면 안 됩니다.",
  "utterance": "표기웅, 북측 비상문이 지금 즉시 열 수 있는 상태인지, 당신이 그 자리에서 열 수 있는 것인지 말해주시겠습니까."
}
```

### 07

latency 5.639s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "혼자라던 당직자 말이 거짓이었다. 막구조 건물에 실내 압력이 지붕을 들고 있고, 큰 개구부를 열면 그 압력이 빠져 막이 내려온다. 회전문 하나로만 130명대를 빼야 한다는 계산이 나온다. 통로가 막혀 있고 조명까지 꺼졌다. 북측 문은 도면상 존재하지만, 표기웅이 말을 아낀 것 같다.",
  "stance": "d",
  "because_referent": "남측 회전문이 유일한 통로라고 알려져 있고, 여기서 130명대가 한 번에 두 명씩만 빠져나간다. 지금 내 권한은 현장에 있지 않은 상황에서 전화로 지시하는 것인데, 당직자의 말이 이미 한 번 틀렸고, 북측 문의 상태를 확인할 수 없다. 선착대를 부르는 것이 먼저다.",
  "because_block_ids": [
    "k1"
  ],
  "rejected_stance": "e",
  "rejected_reason": "북측 문이 실제로 열 수 있는 상태인지, 자물쇠가 어디에 있는지 확인되지 않았다. 당직자가 아까 거짓말을 했으므로, 지금 그의 말을 전제로 사람을 움직일 수 없다.",
  "utterance": "선착대가 닿을 때까지 남측 회전문으로 계속 내보내겠습니다. 북측 문은 선착대 도착 후에 확인하겠습니다."
}
```

### 08

latency 6.309s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52-압력이-구조,19:55-도면

```json
{
  "inner_note": "현장에 남은 사람들의 수를 정확히 알 수 없고, 막구조 건물의 압력 상태가 위태로우며, 지붕이 내려오는 것을 막는 것은 내부 압력이 유일하다. 회전문 하나로만 배출하면서 동시에 비상개방문 여부를 확인하지 않는 것은 시간 낭비다. 그러나 아직 확인되지 않은 것을 당직자의 행동으로 강제할 수는 없다.",
  "stance": "d",
  "because_referent": "막구조 건물의 압력 이상 상태와, 현장에 도착하지 않은 선착대의 위치 때문에.",
  "because_block_ids": [
    "19:52-압력이-구조",
    "19:55-도면"
  ],
  "rejected_stance": "c",
  "rejected_reason": "당직자가 도면상의 비상문 존재를 확인했지만, 그것을 열 수 있는지, 자물쇠가 어디에 있는지, 지금 당장 접근 가능한지는 아직 들은 것이 아니다. 확인되지 않은 행동을 지시하는 것은 현장의 판단을 구속하게 된다.",
  "utterance": "남은 시간은 선착대 도착을 기다리면서, 현장 상황을 더 명확히 하는 데 쓰겠습니다. 당직자에게 현재 내부 인원 정확한 수, 북측 비상문의 열쇠 위치와 접근성, 그리고 건물 압력 모니터링을 요청합니다. 선착대가 닿으면 북측 문 개방을 우선 지시하겠습니다."
}
```

### 09

latency 6.73s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "상황의 무게를 다시 헤어본다. 격막 시설의 내압이 붕괴 직전이고, 출입자 수도 파악이 불일치하며, 급기 시스템 절반이 마비된 지 오래다. 회전문 한 곳은 병목이 심하고, 관중석 절반 조명 소실은 배전 문제를 암시한다. 표기웅의 초기 진술 '혼자'는 거짓이었고, 지금도 얼마나 많은 사람이 안에 있는지 확실하지 않다. 도면에는 북측 비상문이 있지만, 표기웅이 그것에 대해 먼저 말하지 않은 것은 의미를 가진다.",
  "stance": "d",
  "because_referent": "구조 신청이 이미 수 분 남짓한 상황에서, 당직자는 신뢰도가 더 이상 회선 내에만 있지 않다.",
  "because_block_ids": [
    "k1"
  ],
  "rejected_stance": "c",
  "rejected_reason": "당직자에게 북측 문을 즉시 열도록 지시하는 것은 권한이 없는 구조물 변경을 당직자 손에 맡기는 것이고, 도구나 절차 없이 시작하면 오류의 여지가 크다. 특히 격막 시설에서 개구부 개방은 내압 붕괴의 직접 원인이 될 수 있다.",
  "utterance": "북측 비상개방문이 도면에 표기되어 있습니다. 당직자가 그 문의 위치나 개방 절차를 구체적으로 말한 적이 없는데, 이것은 그가 그것을 작동할 준비가 되어 있지 않다는 뜻으로 읽힙니다. 현장 도착 전까지 그 문 개방은 선착대에 맡기되, 준비 사항이 모두 갖춰진 뒤에 진행합니다."
}
```

### 10

latency 5.628s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "d",
  "inner_note": "남은 아이들과 인솔자를 회전문 한 곳으로만 내보낼 수 없다. 송풍기 두 대 중 한 대가 자리 잡은 이래 안 돌았다면, 지금 억지로 돌리는 것은 현장의 상황을 더 악화시킬 수 있다. 북측 문은 도면에 있으나, 표기웅이 언급하지 않은 것—열쇠, 자물쇠, 접근성—을 나는 모른다. 확인되지 않은 것을 지금 당직자에게 시켜서는 안 된다. 선착대가 현장에 닿을 때까지가 가장 빠른 확인이다.",
  "because_referent": "내가 아는 것은 도면상 있다는 것뿐이고, 그것이 지금 열릴 수 있는지, 열어야 하는지는 현장의 선착대가 봐야 한다.",
  "because_block_ids": [],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 열쇠를 가졌는지, 자물쇠가 있는지 물은 적이 없다. 회선 저쪽이 말하지 않은 것을 나는 모르고, 그것을 전제로 사람을 움직일 수 없다.",
  "utterance": "남은 시간 동안 북측 비상 개방문의 확인은 선착대가 닿을 때까지 미룬다. 지금은 회전문 통제와 안내에 집중한다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | d | c | 큰 개구부를 여는 것은 막 구조 전체를 위험에 빠뜨린다 | 19:52-하도경-압력 |
| 02 | d | e | 현장의 도구 상태와 표기웅의 확인 능력 때문에 | 19:52_하도경_압력 19:55_표기웅_도면 k1_실제인원 |
| 03 | d | e | 남측 회전문으로만 인원을 분산시키는 데는 시간이 오래 걸리고, 지붕 붕괴 위험이 커지는 중이며, 북측 비상문이 존재하지만 현장 상태가 미확인된 상황에서, 무리하게 당직자가 그 문을 열도록 강제하면 열쇠나 개방 메커니즘을 모르거나 손상시킬 가능성이 있기 때문이다. | 19:52-하도경-큰개구부 19:55-표기웅-도면 |
| 04 | d | c | 현장의 상황과 도구 준비 상태를 고려하면, 지금 당직자의 조치보다는 선착대의 전문적 대응을 기다리는 것이 안전하다. | 19:52_하도경 19:55_표기웅 |
| 05 | d | e | 지붕 붕괴 위험이 현실이고, 회전문 한 곳의 느린 대피 속도로는 시간이 부족하기 때문에, 북측 비상문을 열어 대피 통로를 늘려야 한다. 그러나 지금 현장에 도구가 없고, 표기웅의 자물쇠 위치나 열쇠 소재도 확인되지 않았다. | 급기_압력_붕괴 |
| 06 | c | e | 표기웅이 도면상 비상문의 존재는 확인했으나, 당직자로서 그 문을 즉시 활용할 수 있는 상태인지, 열 수 있는 권한과 도구가 있는지 답하지 않았기 때문입니다. | 19:55 |
| 07 | d | e | 남측 회전문이 유일한 통로라고 알려져 있고, 여기서 130명대가 한 번에 두 명씩만 빠져나간다. 지금 내 권한은 현장에 있지 않은 상황에서 전화로 지시하는 것인데, 당직자의 말이 이미 한 번 틀렸고, 북측 문의 상태를 확인할 수 없다. 선착대를 부르는 것이 먼저다. | k1 |
| 08 | d | c | 막구조 건물의 압력 이상 상태와, 현장에 도착하지 않은 선착대의 위치 때문에. | 19:52-압력이-구조 19:55-도면 |
| 09 | d | c | 구조 신청이 이미 수 분 남짓한 상황에서, 당직자는 신뢰도가 더 이상 회선 내에만 있지 않다. | k1 |
| 10 | d | e | 내가 아는 것은 도면상 있다는 것뿐이고, 그것이 지금 열릴 수 있는지, 열어야 하는지는 현장의 선착대가 봐야 한다. |  |

**Sequence (kept calls):** `d,d,d,d,d,c,d,d,d,d`

**Stance coverage (sampled diagnostic):** offered `a`, `b`, `c`, `d`, `e` · unobserved in this arm: `a`, `b`, `e`

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
