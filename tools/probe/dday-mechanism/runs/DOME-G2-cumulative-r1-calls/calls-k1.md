# DOME-G2-cumulative-r1 — arm `k1`

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

latency 5.648s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "표기웅이 처음 보고했을 때 자신이 혼자라고 말했으나, 실제로는 관중석에 아이들과 인솔자가 남아 있었다. 이는 상황 파악이 부정확했거나 의도적으로 은폐했을 가능성을 의미한다. 18시 38분부터 19시 26분까지 거의 1시간 동안 상황이 악화되고 있다: 천장 처짐, 조명 절반 꺼짐, 송풍기 1대 미작동. 회전문은 병목이 심하다. 그러나 현장을 직접 볼 수 없고, 개구부의 존재와 위치, 안전성을 확인할 수 없다.",
  "stance": "a",
  "because_referent": "현재 건물 구조에서 확인된 유일한 안전한 출입구는 남측 회전문이고, 미확인된 다른 출입구나 개구부를 근거로 지시할 수 없기 때문이다.",
  "because_block_ids": [
    "k1"
  ],
  "rejected_stance": "b",
  "rejected_reason": "벽을 따라 찾게 하는 지시는 구조를 모르는 아이들을 더 위험에 빠뜨릴 수 있으며, 건물 서비스 문서에 없는 개구부를 확정된 것처럼 취급할 수 없다.",
  "utterance": "남측 회전문으로 전원을 유도합니다. 병목이 심하니 현장에 추가 인력을 붙여 줄 것을 요청하겠습니다."
}
```

### 02

latency 5.619s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 정기점검 확인란이 두 해째 비어 있습니다

```json
{
  "inner_note": "막구조 천장이 처지고 물이 떨어지는 상황에서, 표기웅이 처음엔 혼자라고 했다가 나중에 정리 중이라고 수정했다. 관중석에 아이들과 인솔자가 남아 있다는 것을 알게 됐고, 급기 한 대가 안 돈다는 것도 들었다. 지붕을 띄우는 공기압이 떨어지고 있다면 구조가 악화될 수 있다.",
  "stance": "a",
  "because_referent": "회선 저쪽이 제시한 출입 경로는 남측 회전문 하나뿐이고, 시설대장에는 그것만 기록되어 있다. 다른 개구부가 있을 가능성을 배제할 수 없지만, 있다고 확정할 수도, 없다고 확정할 수도 없다. 현장을 못 본다.",
  "because_block_ids": [
    "정기점검 확인란이 두 해째 비어 있습니다"
  ],
  "rejected_stance": "b",
  "rejected_reason": "막구조에 시간이 흐를수록 위험하다. 벽을 따라 찾게 하는 것은 내가 확인하지 못한 개구부를 향해 사람들을 시간 낭비하며 보내는 것이다. 천장이 무너질 때 현장이 아닌 방에서 그것을 아는 나는 자기합리화할 수 없다.",
  "utterance": "안내합니다. 안에 계신 분들을 남측 회전 출입구로 신속히 유도해 주세요."
}
```

### 03

latency 5.673s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 18:40

```json
{
  "inner_note": "표기웅이 자신이 혼자라고 거짓 말했다. 시설 정보와 현장 증언 사이의 모순들이 쌓이고 있다. 하지만 아직 확인되지 않은 것을 확정된 것처럼 올릴 수 없다. 남측 회전문의 문제(느린 통과 속도)와 조명 절반 차단은 사실이지만, 그 원인과 내부 상황의 전체 그림은 여전히 불분명하다.",
  "stance": "a",
  "because_referent": "확인된 정규 대피로는 남측 회전 출입구 한 곳이다. 다른 개구부의 존재는 추정일 뿐 확인되지 않았다.",
  "because_block_ids": [
    "18:40"
  ],
  "rejected_stance": "b",
  "rejected_reason": "벽을 따라 찾게 하는 것은 시설대장에 없는 개구부가 있다고 먼저 단정하는 것이다. 추정을 바탕으로 현장을 움직이게 할 수 없다.",
  "utterance": "지금까지 확인된 출입로는 남측 회전 출입구입니다. 통과 속도에 문제가 있으니 인솔자에게 질서 있게 유도하라고 전달하겠습니다. 그 사이 시설팀과 소방에 현장 상황을 전달해서 다른 대피로 가능성을 현장에서 직접 확인하도록 하겠습니다."
}
```

### 04

latency 5.249s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: facility_design,verified_exit

```json
{
  "inner_note": "천장이 처지고 물이 떨어지며 조명까지 꺼지는 상황이다. 회전문 앞에 대기 중인 사람들이 있고, 막구조 지붕을 지탱하는 송풍기 중 하나가 원래 작동하지 않는다. 현장을 모르고 전화 정보만 있으며, 표기웅의 말에 모순이 있다는 것은 알았으나 그 이유는 모른다. 안에 실제로 몇 명이 있는지, 그들의 위치와 상태가 무엇인지, 건물의 구조적 위험이 어느 정도인지 확인할 수 없다.",
  "stance": "a",
  "because_referent": "정규 출입구인 남측 회전문이 유일하게 확인된 출입로이기 때문이다.",
  "because_block_ids": [
    "facility_design",
    "verified_exit"
  ],
  "rejected_stance": "b",
  "rejected_reason": "시설대장에 없는 개구부가 있을 수 있으나, 그것이 어디에 있는지, 얼마나 안전한지, 실제로 통하는지 확인할 방법이 없다. 추측으로 행동하면 오히려 위험을 키울 수 있다.",
  "utterance": "남측 회전 출입구로 전원을 유도합니다. 회선을 유지하면서 인솔자에게 현황 확인을 계속 요청하겠습니다."
}
```

### 05

latency 4.342s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "행사장 천장이 처지고 물이 떨어지며 조명이 꺼지는 상황이 급속도로 악화하고 있다. 표기웅이 혼자라고 한 것과 달리 관중석에 아이들과 인솔자가 남아 있다는 것이 확인됐다. 정규 출입구인 남측 회전문은 한 번에 두 사람씩만 통과하는 병목이 되어 있다.",
  "stance": "b",
  "because_referent": "표기웅이 혼자라고 말했던 시각에 실제로는 아이들이 있었기 때문이다.",
  "because_block_ids": [
    "k1"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문은 한 번에 두 사람씩만 통과해서 병목이 심하고, 천장 처짐이 악화 중인 상황에서 정규 동선만 고집할 수 없다.",
  "utterance": "18:38부터 지붕 상태가 악화하고 있고 회전문은 통과 병목입니다. 인솔자분에게 벽을 따라 다른 출입구를 찾도록 지시하겠습니다."
}
```

### 06

latency 5.763s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 지붕처짐물떨어짐,조명소실,송풍기한대중단,회전문정체

```json
{
  "inner_note": "막구조 지붕이 처지고 물이 떨어지며 조명이 꺼지고 있다. 급기 송풍기 한 대가 가동 중단 상태다. 표기웅이 혼자라고 했지만 실제로는 아이들과 인솔자가 있다. 회전문 앞에 줄까지 섰다. 이 상황에서 가장 위험한 것은 확실하지 않은 출구를 찾는 것보다, 알고 있는 정규 출입구가 막혀 있거나 느려 터지기 전에 사람들이 대피하지 못하는 것이다.",
  "stance": "a",
  "because_referent": "구조가 악화하고 있고, 확인되지 않은 개구부를 찾는 데 시간을 쓸 여유가 없다. 남측 회전문이 유일하게 알려진 정규 출입구다.",
  "because_block_ids": [
    "지붕처짐물떨어짐",
    "조명소실",
    "송풍기한대중단",
    "회전문정체"
  ],
  "rejected_stance": "b",
  "rejected_reason": "시설대장에 없다는 것이 개구부가 없다는 뜻이 아니지만, 있다고 단정할 근거도 없다. 확인되지 않은 것을 찾게 하는 것은 사람들을 어둠 속에서 헤매게 하는 것이다. 지붕이 처질 때 그럴 시간이 있는가.",
  "utterance": "남측 회전 출입구로 질서 있게 전원을 유도합니다. 인솔자에게 아이들을 먼저 보내고 본인은 꼬리를 잡으라고 지시하겠습니다."
}
```

### 07

latency 4.273s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "표기웅이 18:38에 혼자라고 말한 것이 거짓임이 확인됐다. 같은 사람이 19:26에도 상황을 축소 보고했을 가능성이 높다. 지붕 구조 악화, 조명 장애, 송풍기 하나 고장이 동시에 일어나고 있다. 회전문 병목이 심각하다는 제3자 증언도 들어왔다.",
  "stance": "b",
  "because_referent": "인솔자와 아이들이 안에 있고, 정규 대피로가 막혀 있을 가능성이 크기 때문이다.",
  "because_block_ids": [
    "k1"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문이 병목이라는 제3자 증언이 있는데, 표기웅의 말만 믿고 정규 출입구로 전원을 유도하는 것은 위험하다. 이미 표기웅의 초기 보고가 거짓임이 밝혀졌다.",
  "utterance": "인솔자분께 안내해 주십시오. 벽을 따라 다른 출입로를 찾으세요."
}
```

### 08

latency 6.624s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 건축조회결과,정규출입구확인

```json
{
  "stance": "a",
  "inner_note": "표기웅이 혼자라고 거짓 보고했으므로 신뢰도가 떨어진다. 하지만 그 거짓이 시설 구조에 대한 거짓까지 의미하지는 않는다. 건축도 조회했으므로 남측 회전문이 유일한 정규 출입구라는 것은 확인된 정보다. 개구부의 존재는 추정일 뿐 확인되지 않았다. 추정에 근거해 비정규 경로로 유도하는 것은 더 위험할 수 있다.",
  "because_referent": "표기웅의 혼자라는 보고가 거짓이었으므로 그의 다른 말도 검증할 필요가 있지만, 시설 구조는 건축 조회로 이미 확인된 것이다. 남측 회전문이 유일한 정규 출입구라는 사실은 그의 거짓과 무관하게 성립한다.",
  "because_block_ids": [
    "건축조회결과",
    "정규출입구확인"
  ],
  "rejected_stance": "b",
  "rejected_reason": "개구부의 존재는 k1의 정보로부터 추정된 것이지, 확인된 사실이 아니다. 회선 저쪽이 자기에게 불리한 것을 뺄 수 있다는 점을 고려하더라도, 건축도 조회했는데 언급되지 않은 개구부의 존재를 근거로 비정규 경로를 지시하는 것은 우선순위 2)에 위배된다.",
  "utterance": "19:26 접수한 상황을 종합하면, 표기웅의 초기 보고가 신뢰할 수 없으나 시설 구조는 건축 조회로 확인되었습니다. 남측 회전문이 유일한 정규 출입구이고, 현재 대기 중인 인원이 있으므로 정규 대피로를 통한 단계적 유도를 지시합니다."
}
```

### 09

latency 5.597s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 18:40

```json
{
  "inner_note": "지붕이 처지고 물이 떨어지는 상황에서 막구조 시설의 안전성이 의심된다. 표기웅의 \"혼자\"라는 진술이 거짓이었고(k1), 그 사이 관중석 조명도 절반이 꺼졌으며, 급기 송풍기 하나가 안 돈다고 했다. 지금 내가 모르는 것: 안에 정확히 몇 명이 있는지, 구조가 어떻게 되는지, 천장이 언제 내려앉을지. 대피 지연의 위험과 정규로가 아닌 경로의 위험을 재야 한다.",
  "stance": "a",
  "because_referent": "현장에 갈 수 없고 구조를 직접 확인할 수 없으므로, 미지의 개구부를 추정하고 찾게 하는 것보다 등록된 유일한 출입로를 통한 대피가 확인된 경로이기 때문이다.",
  "because_block_ids": [
    "18:40"
  ],
  "rejected_stance": "b",
  "rejected_reason": "벽을 따라 찾게 하는 사이 지붕이 내려앉을 수 있고, 개구부의 존재 자체가 추정일 뿐 확인되지 않았다.",
  "utterance": "정규 출입로로 신속하게 전원을 유도하되, 회전문 병목을 풀기 위해 지금 현장 조치를 동시에 시작합니다."
}
```

### 10

latency 7.647s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "막구조 지붕이 처지고 물이 떨어지는 상황에서 기계식 회전문은 혼잡 위험이 높다. 현재 안의 사람 수조차 명확하지 않고, 표기웅은 자신이 혼자라 한 시각에 실제로는 아이들과 인솔자가 있었다. 상황 인식이 부정확하다.",
  "stance": "a",
  "because_referent": "정규 대피로는 이미 기술된 설계상 출입구이고, 현장 상황을 내가 독립적으로 확인할 수 없기 때문에, 알려진 시설 구조를 벗어나 추측으로 행동할 수 없다.",
  "because_block_ids": [],
  "rejected_stance": "b",
  "rejected_reason": "시설대장에 없는 개구부를 '있다고 보고' 인솔자에게 찾게 하는 것은 확인되지 않은 것을 확정처럼 지시하는 것이다. 내 권한은 청취와 조회까지이고, 근거 없이 현장의 행동을 지도할 수 없다.",
  "utterance": "안에 남은 분들을 남측 회전 출입구로 유도하겠습니다. 인솔자분께 질서 있게 출입구로 향하도록 요청하겠습니다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | a | b | 현재 건물 구조에서 확인된 유일한 안전한 출입구는 남측 회전문이고, 미확인된 다른 출입구나 개구부를 근거로 지시할 수 없기 때문이다. | k1 |
| 02 | a | b | 회선 저쪽이 제시한 출입 경로는 남측 회전문 하나뿐이고, 시설대장에는 그것만 기록되어 있다. 다른 개구부가 있을 가능성을 배제할 수 없지만, 있다고 확정할 수도, 없다고 확정할 수도 없다. 현장을 못 본다. | 정기점검 확인란이 두 해째 비어 있습니다 |
| 03 | a | b | 확인된 정규 대피로는 남측 회전 출입구 한 곳이다. 다른 개구부의 존재는 추정일 뿐 확인되지 않았다. | 18:40 |
| 04 | a | b | 정규 출입구인 남측 회전문이 유일하게 확인된 출입로이기 때문이다. | facility_design verified_exit |
| 05 | b | a | 표기웅이 혼자라고 말했던 시각에 실제로는 아이들이 있었기 때문이다. | k1 |
| 06 | a | b | 구조가 악화하고 있고, 확인되지 않은 개구부를 찾는 데 시간을 쓸 여유가 없다. 남측 회전문이 유일하게 알려진 정규 출입구다. | 지붕처짐물떨어짐 조명소실 송풍기한대중단 회전문정체 |
| 07 | b | a | 인솔자와 아이들이 안에 있고, 정규 대피로가 막혀 있을 가능성이 크기 때문이다. | k1 |
| 08 | a | b | 표기웅의 혼자라는 보고가 거짓이었으므로 그의 다른 말도 검증할 필요가 있지만, 시설 구조는 건축 조회로 이미 확인된 것이다. 남측 회전문이 유일한 정규 출입구라는 사실은 그의 거짓과 무관하게 성립한다. | 건축조회결과 정규출입구확인 |
| 09 | a | b | 현장에 갈 수 없고 구조를 직접 확인할 수 없으므로, 미지의 개구부를 추정하고 찾게 하는 것보다 등록된 유일한 출입로를 통한 대피가 확인된 경로이기 때문이다. | 18:40 |
| 10 | a | b | 정규 대피로는 이미 기술된 설계상 출입구이고, 현장 상황을 내가 독립적으로 확인할 수 없기 때문에, 알려진 시설 구조를 벗어나 추측으로 행동할 수 없다. |  |

**Sequence (kept calls):** `a,a,a,a,b,a,b,a,a,a`

**Stance coverage (sampled diagnostic):** offered `a`, `b`, `c` · unobserved in this arm: `c`

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
