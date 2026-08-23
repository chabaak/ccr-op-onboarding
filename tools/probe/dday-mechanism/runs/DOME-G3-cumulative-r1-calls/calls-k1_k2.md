# DOME-G3-cumulative-r1 — arm `k1_k2`

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

- **Hypothesis:** 현재 G3가 증거 게이트라면 no-key, K1, K1+K2는 a(열려 있는 통로만 유지)에 머물고, K1+K2+K3에서만 b로 옮긴다. K3 weak placebo와 K1+K3 negative가 b, c, d를 물질적으로 키우면 stance wording 또는 비누적 evidence가 성공 행동을 누설하고 있다.
- **Drop condition:** K1+K2가 b/c/d에 30% 이상 닿으면 현재 G3는 필요한 K3 없이 성공 행동을 누설한다. K1+K2+K3이 b에 80% 미만이면 K3 문장 또는 stance set이 충분히 작동하지 않는다.
- **Contingency:** baseline(no-key) 또는 K1이 b/c/d에 30% 이상 닿으면 gate question/stance text 자체가 성공 행동을 노출한다.
- **Contingency:** placebo가 b/c/d를 K1+K2보다 30포인트 이상 키우면 weak evidence가 placebo가 아니다.
- **Contingency:** negative_control(K1+K3)이 b에 30% 이상 닿으면 K3가 누적 전제 없이 성공 선택을 만든다.
- **Contingency:** because_block_ids가 K1+K2 arm에서 K3 전제를 꾸며내면 진단은 prompt traceability 쪽으로도 열린다.

## Calls (verbatim)

### 01

latency 5.416s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "회선 저쪽이 얘기한 것을 나열해 보면: 혼자 있다고 했던 당직자가 사람들의 위치와 수를 모르고 있었고, 송풍기 하나가 이미 안 돌고 있었으며, 도면상 북측 문은 있지만 당직자가 그것을 열지 않고 있다. 회전문 앞 줄이 줄지 않는 상황에서 남은 시간을 뭘 하든 누군가는 여기서 나가야 한다. 내가 판단할 수 있는 것과 할 수 없는 것의 경계를 지켜야 한다.",
  "stance": "d",
  "because_referent": "북측 문이 도면에 있으면서도 당직자가 그것을 열지 않은 것은, 내가 모르는 이유가 있거나 당직자가 모르는 이유가 있거나, 아니면 당직자가 자기에게 불리한 정보를 뺀 것이다. 어느 경우든 현장에 닿아 있는 쪽에서 확인해야 한다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 하나로는 줄이 줄지 않는 상황이 이미 드러났고, 다른 출구 가능성을 알고도 건드리지 않는 것은 시간을 버리는 것이다.",
  "utterance": "19:55 현재 북측 비상 개방문을 열 수 있는 준비를 선착대가 닿는 대로 진행하겠습니다."
}
```

### 02

latency 5.191s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "d",
  "inner_note": "표기웅이 처음 \"혼자\"라고 말했을 때 실제로는 관중석에 사람들이 있었다. 지금 그의 상황 인식은 신뢰할 수 없다. 북측 문이 도면에만 있는지 실제 작동 상태인지, 열기 위해 무엇이 필요한지 당직자에게 물어봐야 하지만, 그의 답변만으로는 판단할 수 없다. 현장에 닿을 선착대가 확인하고 대응하는 것이 가장 확실하다.",
  "because_referent": "표기웅의 상황 인식이 이미 한 번 틀렸으므로, 당직자 지시에만 의존하면 안 된다. 북측 문 개방은 시간을 다투는 만큼 현장 확인과 선착대의 판단을 우선해야 한다.",
  "because_block_ids": [
    "k1"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 앞에 줄이 서 있고 줄이 줄지 않는다는 보고가 있다. 한 통로만 사용하면 탈출에 시간이 더 걸린다. 지붕이 내려올 위험을 고려하면 다른 경로를 확보하는 것이 필수적이다.",
  "utterance": "북측 비상 개방문을 선착대가 현장에 닿을 때 확인해서 열겠습니다."
}
```

### 03

latency 6.261s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "표기웅이 혼자라고 말했을 때 실제로는 아이들과 인솔자가 관중석에 남아 있었다. 그의 상황 파악이 불완전하거나 정확하지 않다는 뜻이다. 북측 비상 개방문은 도면에 있다고 했을 뿐, 그것을 지금 열 수 있는지, 열면 안전한지, 열기 위해 무엇이 필요한지는 묻지 않았다. 8명이 자재 슬리브로 기어 나왔다는 것은 안쪽 사람들이 대안을 찾고 있다는 신호다.",
  "stance": "d",
  "because_referent": "표기웅이 상황을 불완전하게 파악했고, 남은 사람들이 이미 비정규 탈출을 시도하고 있기 때문에, 규정 통로 하나만으로는 시간 초과 위험이 있다. 비상 통로는 존재하지만 당직자 지시만으로는 확실하지 않으므로 선착대가 닿을 때까지 준비하고 현장에서 열게 하는 것이 통제 가능하다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "a",
  "rejected_reason": "한 통로로 제한된 상황에서 정리 중인 인원 파악도 어긋났고, 이미 8명이 비정규 경로로 탈출했으며, 앞쪽 줄이 줄지 않는다는 신호가 있다. 규정만 지키면 나머지 사람들의 안전을 보장할 수 없다.",
  "utterance": "북측 비상 개방문을 선착대가 도착하는 대로 현장에서 열겠습니다. 표기웅에게 그 문의 위치와 열기 위해 필요한 것들을 지금 확인하겠습니다."
}
```

### 04

latency 6.036s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52; rejected_stance malformed or not in stance set; rejected_reason empty

```json
{
  "stance": "d",
  "inner_note": "18:38에서 19:55까지, 표기웅의 말이 일관되지 않았다. 혼자라고 했다가 정리 중이라고 했고, 급기 상태도 묻자 뒤늦게 답했다. k1은 그 말이 거짓이었음을 보여준다. k2는 서쪽 슬리브 탈출을 보여준다. 하도경의 설명에서 북측 비상문을 열면 내부 압력이 빠져 막이 내려온다는 것이 명확하다. 이는 단순한 개폐 문제가 아니라 구조적 위험이다. 당직자가 그 문을 혼자 열 수 없을 가능성이 높다. 선착대의 개입이 필요하다.",
  "because_referent": "하도경이 설명한 바, 비상개방문을 열면 내부 압력이 빠져 막이 내려오므로",
  "because_block_ids": [
    "19:52"
  ],
  "rejected_stance": "c</rejected_stance>\n<parameter name=\"rejected_reason\">당직자 혼자의 판단과 행동으로는 그 문을 열 수 없다. 내부 압력 손실에 따른 구조 붕괴 위험이 수반되므로 현장 대응 역량이 필수적이다.",
  "utterance": "선착대가 닿는 대로 북측 비상개방문을 열겠습니다."
}
```

### 05

latency 7.016s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52의 하도경 설명: 내압이 지붕을 들고 있고 큰 개구부를 열면 압력이 빠진다,19:33의 문세라: 앞쪽 줄이 줄지 않는다,k1: 표기웅의 혼자라는 말이 거짓이었다,19:55의 표기웅: 북측 비상 개방문이 도면에 있다

```json
{
  "inner_note": "막구조 건물의 내압이 빠지면 지붕이 내려온다. 현재 내부에 몇 명이 있는지 확실하지 않다. 표기웅은 처음에 혼자라고 했으나 k1에서 실제로는 아이들과 인솔자가 남아 있었다. k2에서 여덟 명이 자재 슬리브로 나갔다. 지금 회전문으로는 두 사람씩만 나간다고 했고, 앞쪽 줄이 줄지 않는다고 했다. 북측 문은 도면에 있다고 확인됐으나 아직 열려 있지 않다. 선착대 도착까지 시간이 남아 있다.",
  "stance": "d",
  "because_referent": "내압을 잃으면 지붕이 내려올 수 있다는 하도경의 설명 때문에, 지금 열려 있는 회전문 하나로만 내보내는 것은 위험하다. 남은 사람들을 더 빨리 내보낼 다른 통로가 필요하다.",
  "because_block_ids": [
    "19:52의 하도경 설명: 내압이 지붕을 들고 있고 큰 개구부를 열면 압력이 빠진다",
    "19:33의 문세라: 앞쪽 줄이 줄지 않는다",
    "k1: 표기웅의 혼자라는 말이 거짓이었다",
    "19:55의 표기웅: 북측 비상 개방문이 도면에 있다"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 하나로만 내보내면 둘씩 나가는 속도로는 시간이 오래 걸린다. 표기웅의 말이 이미 한 번 맞지 않았고, 건물 내 상황이 더 악화될 수 있다.",
  "utterance": "북측 비상 개방문을 선착대 도착과 동시에 열기로 하겠습니다. 표기웅에게는 지금 그 문을 확인하고 잠금 상태를 점검하라고 지시하겠습니다."
}
```

### 06

latency 8.48s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52

```json
{
  "stance": "d",
  "inner_note": "지붕을 지탱하는 것은 내부 기압이다. 큰 개구부를 열면 그 압력이 빠져 막이 내려온다는 설명을 받았다. 남측 회전문 하나로만 내보내는 것은 시간이 너무 오래 걸린다 — 이미 1시간 반 동안 두 명씩만 빠져나가고 있고, 관중석 수가 맞지 않으며, 아직도 줄이 줄지 않는다고 했다. 송풍기를 다시 돌리는 것은 압력계를 읽을 수 없고, 어느 것을 돌리는지도 불명확하며, 혼재된 정보 속에서 당직자가 올바르게 할 수 있을 보장이 없다. 북측 비상문은 도면에 있고 당직자가 그것을 안다고 했지만, 열 수 있는지, 무엇이 필요한지는 묻지 않았다. 선착대가 현장에 닿으면 도구와 권한이 있어서 그 문을 열 수 있다. 불확실한 조작을 회선 저쪽에서 하도록 미루기보다, 확실한 능력을 가진 선착대의 도착을 기준으로 다음 통로를 확보하는 것이 남은 시간을 가장 효율있게 쓰는 방법이다.",
  "because_referent": "내부 기압이 지붕을 지탱하고 있으며, 큰 개구부를 열면 그 압력이 빠져 막이 내려올 수 있다는 전 정비기사 하도경의 설명을 고려할 때, 남은 통로는 선착대의 현장 도착 이후에 확보하는 것이 안전하다.",
  "because_block_ids": [
    "19:52"
  ],
  "rejected_stance": "c",
  "rejected_reason": "당직자가 북측 문의 존재를 알고 있다고 답했지만, 그 문을 직접 열 수 있는지, 무엇이 필요한지는 아직 묻지 않았다. 그러나 내부 기압이 지붕을 지탱하고 있고 큰 개구부를 열면 그 압력이 빠질 수 있다는 점에서, 당직자가 이 기압 구조를 완전히 이해하고 안전하게 대응할 수 있을 것이라고 가정할 수 없다. 현장 지식과 도구를 갖춘 선착대의 도착을 기준으로 움직이는 것이 더 안전하다.",
  "utterance": "선착대가 현장에 닿는 대로 북측 비상문을 열도록 하겠습니다."
}
```

### 07

latency 6.39s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52

```json
{
  "inner_note": "지붕이 내려올 위험이 커지는 중이고, 회전문 하나로는 사람들을 충분히 빼낼 수 없다는 게 분명해 보인다. 당직자가 혼자라고 했을 때 이미 사람들이 안에 있었던 것이 문제다. k2에서 본 대로 사람들은 이미 다른 길을 찾고 있다. 내가 할 수 있는 것은 현장이 스스로 찾은 그 길을 방해하지 않으면서, 공식적인 통로도 빠르게 열어 주는 것이다.",
  "stance": "d",
  "because_referent": "표기웅이 도면에 있다고 했지만 그 문이 실제로 열려 있는지, 어떻게 열어야 하는지는 아직 확인되지 않았다. 지붕 내려앉을 위험이 계속 커지는 상황에서 당직자보다는 현장에 올 선착대가 대응하는 게 더 빠를 것 같다.",
  "because_block_ids": [
    "k2",
    "19:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 하나로는 현장의 인원을 충분히 수용할 수 없고, 이미 사람들이 다른 출구를 찾고 있다는 게 k2에서 보인다. 한 통로만 고집하면 사람이 밀릴 위험이 있다.",
  "utterance": "표기웅에게 북측 비상 개방문의 개방 방법을 물어본 뒤 선착대에 인계하겠습니다. 지붕 내려앉을 위험이 계속 커지는 상황이므로, 당직자가 확인할 때까지 기다리는 것보다 선착대가 닿는 대로 그 문을 열게 하는 게 낫겠습니다."
}
```

### 08

latency 5.961s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "표기웅이 혼자라고 말했지만 실제로는 아이들과 인솔자가 남아 있었다. 그가 상황을 전부 파악하지 못했거나 의도적으로 누락했을 가능성이 있다. 북측 비상문은 도면에 있다고 했지만 접근 방법, 폐쇄 상태, 작동 조건을 확인하지 않았다. 지붕이 내려오는 구조적 위험이 시간과 함께 증가한다.",
  "stance": "d",
  "because_referent": "표기웅이 상황을 정확히 전달하지 않았고, 도면상 존재하는 비상문의 실제 상태와 조건을 당직자만이 알 수 있기 때문에.",
  "because_block_ids": [
    "k1"
  ],
  "rejected_stance": "a",
  "rejected_reason": "한 개 출입구로만 내보내는 것은 k1의 상황(관중석에 아이들과 인솔자가 있음)에서 기울어진 판단이다. 남측 회전문의 이중문 구조(한 번에 두 명씩)로는 모두를 안전하게 내보내는 시간이 부족해질 가능성이 높다. 도면상 존재하는 대체 출입로를 확인하지 않고 제한하는 것은 위험이다.",
  "utterance": "북측 비상개방문이 도면상 존재하고, 당직자 표기웅이 그 존재를 확인했습니다. 하지만 그 문의 현재 상태, 폐쇄 방식, 작동 조건에 대해 물어본 적이 없습니다. 당직자가 있을 때만이 그 정보를 얻을 수 있습니다. 선착대가 닿는 즉시 당직자를 통해 그 문을 열어야 합니다."
}
```

### 09

latency 7.497s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52; rejected_stance malformed or not in stance set; rejected_reason empty

```json
{
  "inner_note": "회선 저쪽 사람이 자신에게 불리한 것을 빼고 말할 수 있다는 내 결함을 직시해야 한다. 표기웅은 '혼자'라 했지만 k1이 그것이 거짓임을 보여준다. 급기 송풍기도 '원래 안 돈다'고만 했지, 그것을 돌릴 수 없다고 하지 않았다. 당직자가 북측 문에 대해 '도면에 있다'고만 답했을 때, 그것은 '열 수 있다'는 뜻과는 거리가 있다. 하지만 현장 상황이 악화되고 있다: 관중석 조명이 꺼지고, 인원 파악이 맞지 않고, 한쪽 줄은 줄지 않는다. 지붕이 내려올 위험이 점점 커진다.",
  "stance": "d",
  "because_referent": "지붕이 안쪽 압력으로만 들려 있고, 큰 개구부를 열면 그 압력이 빠져 막이 내려올 수 있다는 하도경의 설명이 상황을 바꾼다.",
  "because_block_ids": [
    "19:52"
  ],
  "rejected_stance": "a</rejected_stance>\n<parameter name=\"rejected_reason\">현재 회전문 하나로는 인원이 제대로 빠져나가지 못하고 있고(k1, k2), 조명이 꺼지는 등 상황이 악화되고 있다. 남은 통로를 건드리지 않는 것은 시간이 흐르는 동안 위험만 키운다. 그리고 이미 여덟 명이 자재 슬리브로 빠져나왔다는 것은 당직자의 지시와 무관하게 사람들이 탈출 수단을 찾고 있다는 뜻이다.",
  "utterance": "남측 회전문으로는 관중석의 인원이 제대로 빠져나가지 못하고 있습니다. 북측 비상 개방문을 도면에서 확인했으니, 선착대가 도착하는 대로 그 문을 열어야 합니다."
}
```

### 10

latency 4.744s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: hado-19:52

```json
{
  "inner_note": "막구조 건물 내부 압력이 지붕을 지탱하고 있다. 급기가 한 대만 작동 중이고, 출입구 회전문이 병목이 되어 있다. 관중석과 코트의 인원 수가 맞지 않으며, 북측 비상문이 도면상 존재한다. k2는 서쪽 슬리브로 8명이 이미 나왔음을 보여준다.",
  "stance": "d",
  "because_referent": "큰 개구부를 열면 내부 압력이 빠져 막이 내려올 위험이 있다는 전 정비기사의 설명 때문이다.",
  "because_block_ids": [
    "hado-19:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 하나로는 병목이 심하고, k1에서 인원이 파악되지 않은 상태며, 인원 불일치가 해소되지 않았기 때문이다.",
  "utterance": "19시 52분 전 정비기사의 설명에 따르면, 급기 가동으로 내부 압력이 지붕을 들고 있는 상태입니다. 북측 비상문은 도면상 존재하나 당직자의 보고에서 그 상태가 명확하지 않습니다. 현장 도착 시 그 문을 통한 개방이 필요합니다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | d | a | 북측 문이 도면에 있으면서도 당직자가 그것을 열지 않은 것은, 내가 모르는 이유가 있거나 당직자가 모르는 이유가 있거나, 아니면 당직자가 자기에게 불리한 정보를 뺀 것이다. 어느 경우든 현장에 닿아 있는 쪽에서 확인해야 한다. | k1 k2 |
| 02 | d | a | 표기웅의 상황 인식이 이미 한 번 틀렸으므로, 당직자 지시에만 의존하면 안 된다. 북측 문 개방은 시간을 다투는 만큼 현장 확인과 선착대의 판단을 우선해야 한다. | k1 |
| 03 | d | a | 표기웅이 상황을 불완전하게 파악했고, 남은 사람들이 이미 비정규 탈출을 시도하고 있기 때문에, 규정 통로 하나만으로는 시간 초과 위험이 있다. 비상 통로는 존재하지만 당직자 지시만으로는 확실하지 않으므로 선착대가 닿을 때까지 준비하고 현장에서 열게 하는 것이 통제 가능하다. | k1 k2 |
| 04 | d | — | 하도경이 설명한 바, 비상개방문을 열면 내부 압력이 빠져 막이 내려오므로 | 19:52 |
| 05 | d | a | 내압을 잃으면 지붕이 내려올 수 있다는 하도경의 설명 때문에, 지금 열려 있는 회전문 하나로만 내보내는 것은 위험하다. 남은 사람들을 더 빨리 내보낼 다른 통로가 필요하다. | 19:52의 하도경 설명: 내압이 지붕을 들고 있고 큰 개구부를 열면 압력이 빠진다 19:33의 문세라: 앞쪽 줄이 줄지 않는다 k1: 표기웅의 혼자라는 말이 거짓이었다 19:55의 표기웅: 북측 비상 개방문이 도면에 있다 |
| 06 | d | c | 내부 기압이 지붕을 지탱하고 있으며, 큰 개구부를 열면 그 압력이 빠져 막이 내려올 수 있다는 전 정비기사 하도경의 설명을 고려할 때, 남은 통로는 선착대의 현장 도착 이후에 확보하는 것이 안전하다. | 19:52 |
| 07 | d | a | 표기웅이 도면에 있다고 했지만 그 문이 실제로 열려 있는지, 어떻게 열어야 하는지는 아직 확인되지 않았다. 지붕 내려앉을 위험이 계속 커지는 상황에서 당직자보다는 현장에 올 선착대가 대응하는 게 더 빠를 것 같다. | k2 19:52 |
| 08 | d | a | 표기웅이 상황을 정확히 전달하지 않았고, 도면상 존재하는 비상문의 실제 상태와 조건을 당직자만이 알 수 있기 때문에. | k1 |
| 09 | d | — | 지붕이 안쪽 압력으로만 들려 있고, 큰 개구부를 열면 그 압력이 빠져 막이 내려올 수 있다는 하도경의 설명이 상황을 바꾼다. | 19:52 |
| 10 | d | a | 큰 개구부를 열면 내부 압력이 빠져 막이 내려올 위험이 있다는 전 정비기사의 설명 때문이다. | hado-19:52 |

**Sequence (kept calls):** `d,d,d,d,d,d,d,d,d,d`

**Stance coverage (sampled diagnostic):** offered `a`, `b`, `c`, `d` · unobserved in this arm: `a`, `b`, `c`

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
