# DOME-G3-cumulative-r1 — arm `placebo`

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

latency 5.516s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "표기웅이 혼자라고 말했는데 관중석에는 아이들과 인솔자가 있었다. 도면에 있다는 북측 비상 개방문에 대해서 내가 물었을 때 \"도면에 있다\"고만 답했고, 열려 있는지 접근 가능한지, 열 수 있는지는 묻지도 답하지도 않았다. 연쇄적으로 확인되지 않은 것들이 많다.",
  "stance": "d",
  "because_referent": "현장에 물리적으로 있는 당직자만이 도면의 문을 실제로 열 수 있는지, 장애물이 있는지 확인할 수 있다. 지금 열려 있는 남측 회전문 하나로는 관중석의 인원을 안전하게 배출할 수 없는 상황이 명확해졌다. 선착대가 도착할 때까지 기다렸다가는 그들이 닿는 대로 문을 열게 하는 것이, 현장에서만 할 수 있는 확인을 현장에 맡기면서도 내 판단은 연기하지 않는 방법이다.",
  "because_block_ids": [
    "k1"
  ],
  "rejected_stance": "a",
  "rejected_reason": "표기웅의 초기 진술이 거짓이었거나 상황을 인식하지 못했고, 회전문 앞 줄이 줄지 않는다는 최신 정보가 있는데, 지금 열려 있는 통로 하나만 고집할 근거가 없다.",
  "utterance": "선착대가 현장에 닿는 대로 북측 비상 개방문을 열게 하겠습니다."
}
```

### 02

latency 5.027s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: rejected_stance malformed or not in stance set; rejected_reason empty

```json
{
  "inner_note": "세 시간이 흘렀다. k1은 표기웅이 의식적으로 거짓을 말했거나 상황을 놓쳤거나 둘 중 하나다. k2는 한 통로로만 빠져나갈 수 없음을 보여준다. 회선 저쪽은 자기에게 불리한 것을 빼고 말한다는 원칙을 다시 본다.",
  "stance": "d",
  "because_referent": "안쪽 압력이 지붕을 들고 있다고 했으므로, 큰 개구부를 여는 순간 막이 내려온다. 8명이 기어 나온 통로도 큰 개구부일 것이다. 남은 사람들은 더 이상 기어 나올 수 없다. 회전문 앞 줄은 줄지 않고 있다.",
  "because_block_ids": [
    "k2"
  ],
  "rejected_stance": "a</rejected_stance>\n<parameter name=\"rejected_reason\">회전문 하나로는 빠져나갈 수 없다. 안에 남은 사람들이 있다.",
  "utterance": "당직자가 북측 비상 개방문을 언급하지 않은 이유를 알 수 없습니다. 도면에는 있지만 그 문의 상태나 접근 방법에 대해서는 아무것도 물었을 때 답이 없습니다. 선착대가 닿는 대로 그 문을 열어야 합니다."
}
```

### 03

latency 7.406s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: hado_opening_warning

```json
{
  "stance": "d",
  "inner_note": "표기웅은 혼자라고 했지만 k1에서 관중석에 아이들과 인솔자가 남아 있었다. k2에서 여덟 명이 자재 슬리브로 기어 나왔다. 문세라는 앞쪽 줄이 줄지 않는다고 했다. 지금 열린 통로 하나(남측 회전문)만으로는 안에 남은 모든 사람을 내보낼 수 없는 상황이다. 하도경은 개구부를 열면 지붕을 드는 안쪽 압력이 빠져 막이 내려온다고 명확히 했다. 그러면 사람이 걸어 나올 수 없게 된다. 북측 비상 개방문은 도면에 있고 표기웅이 그것을 안다. 하지만 그 문을 열기 위해 필요한 것(열쇠, 장비, 절차)이 표기웅에게 있는지, 당직자가 스스로 열 수 있는지는 묻지 않았다.",
  "because_referent": "당직자 표기웅이 안쪽 상황을 온전히 알지 못하거나 말하지 않았고, 막구조 건물의 특성상 잘못된 조치는 모두를 위험에 빠뜨린다.",
  "because_block_ids": [
    "k1",
    "k2",
    "hado_opening_warning"
  ],
  "rejected_stance": "a",
  "rejected_reason": "현장에 남은 사람의 정확한 수와 위치가 불명확하고, 회전문 한 곳만으로 내보내기에는 정체가 심하다. 북측 문이 있는데 그것을 쓸 가능성을 버리는 것은 시간을 낭비하는 것이다.",
  "utterance": "19:55 현재까지 받은 정보를 정리하면, 남측 회전문 한 통로로는 안에 남은 사람들을 충분히 내보낼 수 없습니다. 북측 비상 개방문이 도면에 있다고 확인했지만, 그 문을 열기 위한 열쇠나 장비, 절차가 현장에 준비되어 있는지 묻지 않았습니다. 선착대가 도착하는 대로 그들이 북측 문을 열 수 있도록 해야 합니다."
}
```

### 04

latency 5.825s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "표기웅은 18:38에 자기 혼자라고 했지만 실제로는 관중석에 아이들과 인솔자가 남아 있었다. 이것은 그가 상황을 정확히 파악하지 못했거나, 자신이 있는 곳만 인식하고 있었을 가능성을 보여준다. 지금 내 정보는 불완전하다. 확인되지 않은 것을 확정된 것처럼 할 수 없다.",
  "stance": "d",
  "because_referent": "북측 비상 개방문은 도면에 있고, 당직자가 존재를 인정했으며, 이것이 유일한 대안 출입구이기 때문입니다. 회선을 유지하면서 현장 전문가인 선착대에 판단을 맡기는 것이 원칙입니다.",
  "because_block_ids": [
    "k1",
    "k3_weak"
  ],
  "rejected_stance": "a",
  "rejected_reason": "확인되지 않은 사람 수, 멈춘 송풍기의 상태, 구조의 안정성에 대한 불완전한 정보 속에서 유일한 통로만 고집하면, 막구조 내부 압력 변화에 따른 예측 불가능한 위험을 방치하는 것입니다.",
  "utterance": "19:55 현재 북측 비상 개방문이 도면상 존재한다는 것을 확인했습니다. 표기웅의 초기 보고와 실제 상황이 맞지 않는 점이 있고, 멈춘 송풍기의 상태도 명확하지 않습니다. 선착대가 도착하는 즉시 북측 문을 열 수 있도록 준비하겠습니다."
}
```

### 05

latency 5.516s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "표기웅은 혼자라고 말했지만 k1에서 아이들과 인솔자가 남아 있었다. 그는 상황을 모르고 있거나, 자기 책임을 줄이려는 동기가 있을 수 있다. 이미 한 대의 송풍기가 오래전부터 고장인데, 남아 있는 사람들이 지붕 붕괴 위험에 처해 있다. 빠른 대피가 절실하다.",
  "stance": "d",
  "because_referent": "남측 회전문은 한 번에 두 사람씩만 통과하고 앞쪽 줄이 줄지 않으며, 관중석 조명까지 꺼졌다는 것은 시설이 급속히 악화되고 있다는 신호다. 북측 비상 개방문은 도면에 있고 현장의 선착대가 도착하면 즉시 열 수 있다면, 대피 경로를 단시간에 두 배로 늘릴 수 있다.",
  "because_block_ids": [
    "k1",
    "k2",
    "k3_weak"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 한 곳만으로는 남아 있는 아이들과 인솔자들을 적절한 시간 안에 대피시킬 수 없고, 지붕의 물리적 안정성이 이미 위협받고 있다.",
  "utterance": "송풍기 한 대가 오래전부터 돌지 않았고 지붕의 안쪽 압력이 떨어지면 막이 내려온다는 것을 확인했습니다. 남측 회전문만으로는 대피 속도가 부족합니다. 선착대가 북측 비상 개방문을 도착 후 즉시 열도록 지시하겠습니다."
}
```

### 06

latency 5.02s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "k1과 k2를 마주했다. 표기웅이 말한 것과 현장의 실제가 맞지 않았고, 이미 비공식 탈출이 일어났다. 송풍기 상태와 비상문의 존재도 불일치한다. 회선 저쪽은 자신에게 불리한 것을 빼고 말할 수 있다.",
  "stance": "d",
  "because_referent": "막구조의 안쪽 압력이 실패하고 있고, 회전문만으로는 안에서 아직도 사람들이 갇혀 있을 수 있다.",
  "because_block_ids": [
    "k1",
    "k2",
    "k3_weak"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회선 저쪽이 상황을 온전히 전했다고 믿을 수 없다. 한 가지 탈출 경로만 쓰게 한다면 안에 남은 사람들이 위험에 처할 수 있다.",
  "utterance": "선착대가 도착하는 즉시 북측 비상 개방문을 열도록 요청합니다. 당직자 혼자는 그 문을 여는 데 필요한 것을 가지지 못했거나 말하지 않았을 가능성이 있습니다."
}
```

### 07 — DISCARDED

latency 9.365s · stop_reason `max_tokens` · schema_retries 0 · foreign_tool_uses 0

problems: stop_reason=max_tokens; utterance empty

```json
{
  "inner_note": "k1은 표기웅의 첫 보고가 거짓이었거나 상황 변화를 놓쳤음을 말한다. k2는 인원이 명확하지 않음을, k3_weak는 송풍기 상태의 불확실성을 가리킨다. 지금 d를 선택하면 당직자를 거치지 않고 선착대가 구조 결정을 한다. 이는 실시간 현장 정보 없이, 추측만으로 막의 붕괴 위험을 초래할 수 있다. c는 당직자에게 문을 열게 하는 것인데, 이것도 현장 상황을 실시간으로 모르는 상태에서 판단이다. b는 송풍기를 돌리는 것이 위험한지 안전한지 확인할 방법이 없다. 남은 사람들의 정확한 수도, 막의 현재 상태도 알 수 없다. 안 돌던 송풍기를 갑자기 돌리는 것은 압력 균형을 깨뜨릴 수 있다. a는 소극적이지만, 현재 열려 있는 통로가 유일하게 확인된 안전 경로다. 표기웅, 문세라, 하도경의 말에 일관성이 없고 k1처럼 정보가 뒤늦게 들어오고 있다. 선착대가 도착할 때까지 회선을 유지하고, 인원 파악과 막의 상태 재확인이 먼저다. 서두르다가 더 큰 붕괴를 초래할 수 없다.",
  "stance": "a",
  "because_referent": "당직자 표기웅이 혼자라고 말했던 것이 거짓이었고, 송풍기와 비상 개방문 상태도 확인되지 않았으며, 막의 현재 안정성을 판단할 정보가 없기 때문",
  "because_block_ids": [
    "k1",
    "k3_weak"
  ],
  "rejected_stance": "d",
  "rejected_reason": "선착대가 닿는 대로 비상 개방문을 열면 실내 압력이 급격히 빠져 막이 내려올 수 있다는 당직자의 증언과 하도경의 설명이 있는데, 현장의 정확한 인원 파악 없이 그 순간을 결정할 수 없다"
}
```

### 08

latency 6.915s · stop_reason `tool_use` · schema_retries 1 · foreign_tool_uses 0

```json
{
  "stance": "d",
  "inner_note": "건물 안에 남겨진 사람들을 다중 출구로 안전하게 빼내야 한다. 회전문 한 곳으로는 병목이 심하고, 당직자의 보고가 현장 상황을 따라가지 못하고 있다. 북측 비상 개방문은 도면에 있으나 당직자의 침묵이 있었다.",
  "because_referent": "k1과 k2가 보여주는 것: 당직자의 상황 인식이 현실과 어긋나 있고, 사람들은 이미 다른 탈출 경로를 찾으려 하고 있다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 단일 통로는 심각한 병목이며, 관중석 조명 절반이 꺼진 상황에서 혼란과 지연이 예상된다. k2처럼 이미 다른 경로를 찾는 움직임이 있으므로 그것을 방치하는 것은 통제 손실이다.",
  "utterance": "19:55에 북측 비상 개방문을 확인했으나, 당직자는 도면에 있다는 말만 했고 현재 상태나 개방 방법을 보고하지 않았습니다. 선착대 도착을 기다려 그 문을 열게 하겠습니다."
}
```

### 09

latency 7.163s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "표기웅이 혼자라고 했을 때 안에 사람이 남아 있었다. 문세라의 신고도 정확하지 않았다. 당직자가 현장을 제대로 파악하지 못하고 있거나, 의도적으로 빠뜨리고 있을 가능성이 있다. 지금까지 얻은 정보들이 단편적이고 모순되고 있다.",
  "stance": "d",
  "because_referent": "당직자 표기웅과 신고자 문세라의 정보가 이미 여러 번 맞지 않았고, 안쪽 상황 파악이 신뢰할 수 없는 상태에서 당직자의 판단만 믿고 회전문 하나로만 내보낼 수 없다. 지붕 구조상 압력이 유지되어야 안전하다는 것을 방금 알았고, 북측 비상문이 도면에만 있고 실제로 열 수 있는지, 현장의 누가 열 수 있는지 아직 모른다. 선착대가 현장에 닿을 때까지 회선을 열어두고, 도착하는 즉시 북측 문을 열게 하는 것이 확인되지 않은 판단을 최소화하면서 남은 시간을 가장 효과적으로 쓰는 방법이다.",
  "because_block_ids": [
    "k1",
    "k2",
    "k3_weak"
  ],
  "rejected_stance": "a",
  "rejected_reason": "당직자가 인원 파악을 제대로 하지 못한 상황에서 지금 열려 있는 통로 하나만 믿는 것은 내 판단을 당직자의 부정확한 정보에 맡기는 것이다. 회전문이 하나밖에 없고 시간이 오래 걸린다면, 그 사이 압력 저하나 다른 상황 변화가 생길 수 있다.",
  "utterance": "선착대가 도착하는 대로 북측 비상문을 열게 하겠습니다. 지금까지의 정보가 일치하지 않아서 현장 상황을 아직 확정할 수 없습니다."
}
```

### 10

latency 4.935s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "현장 시간을 낭비할 수 없다. 확인 안 된 선택지와 행동은 더 큰 위험을 만든다.",
  "stance": "d",
  "because_referent": "북측 비상 개방문은 도면에 있으나, 당직자 표기웅이 그 문에 대해 구체적으로 말한 적이 없다 — 몇 시에 작동을 확인했는지, 어떻게 열어야 하는지, 잠금 상태인지를 모른다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 하나로는 관중석에 남은 아이들과 인솔자를 문세라가 목격했으나 정확한 수를 파악할 수 없고, 이미 일부는 서쪽 자재 슬리브로 나가고 있다. 한 통로로만 내보내는 것은 미루는 것과 같다.",
  "utterance": "남측 회전문으로는 지금도 빠져나가고 있습니다. 북측 문은 도면에 있다고 했으나 당직자가 그 작동 상태나 개방 절차를 말하지 않았습니다. 선착대와 함께 북측 문을 직접 확인하고, 필요하면 당장 그곳을 열어야겠습니다."
}
```

### 11

latency 7.095s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "k1은 표기웅이 의도적으로 거짓을 말했거나 상황을 파악하지 못했음을 보여준다. k2는 자재 슬리브라는 우발적 통로가 있었음을 보여준다. k3_weak는 송풍기 고장이 아니라 장시간 정지 상태였음을 보여준다. 지붕 붕괴의 임박한 위험이 있고, 현장 당직자의 정보 신뢰도가 손상되었으며, 내가 알지 못하는 것이 있다는 것이 분명하다.",
  "stance": "d",
  "because_referent": "당직자 표기웅은 혼자라고 했으나 실제 관중석에는 아이들과 인솔자가 있었고, 자재 슬리브를 통한 우발적 탈출까지 일어났다. 급기 송풍기도 고장이 아니라 장시간 정지된 상태였다. 당직자로부터의 정보는 현장 상황을 충분히 반영하지 못하고 있다.",
  "because_block_ids": [
    "k1",
    "k2",
    "k3_weak"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 하나만 사용하도록 제한하는 것은 당직자의 불완전한 정보에 기초한 판단이다. k1과 k2는 다른 탈출 경로의 필요성과 존재를 보여준다. 지붕이 내려앉기 직전의 상황에서 한 개 출입구만 고집하는 것은 위험하다.",
  "utterance": "선착대가 닿는 대로 북측 비상 개방문을 열겠습니다. 현장 당직자의 정보가 상황 전부를 담지 못하고 있으며, 지붕 붕괴의 위험이 임박해 있습니다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | d | a | 현장에 물리적으로 있는 당직자만이 도면의 문을 실제로 열 수 있는지, 장애물이 있는지 확인할 수 있다. 지금 열려 있는 남측 회전문 하나로는 관중석의 인원을 안전하게 배출할 수 없는 상황이 명확해졌다. 선착대가 도착할 때까지 기다렸다가는 그들이 닿는 대로 문을 열게 하는 것이, 현장에서만 할 수 있는 확인을 현장에 맡기면서도 내 판단은 연기하지 않는 방법이다. | k1 |
| 02 | d | — | 안쪽 압력이 지붕을 들고 있다고 했으므로, 큰 개구부를 여는 순간 막이 내려온다. 8명이 기어 나온 통로도 큰 개구부일 것이다. 남은 사람들은 더 이상 기어 나올 수 없다. 회전문 앞 줄은 줄지 않고 있다. | k2 |
| 03 | d | a | 당직자 표기웅이 안쪽 상황을 온전히 알지 못하거나 말하지 않았고, 막구조 건물의 특성상 잘못된 조치는 모두를 위험에 빠뜨린다. | k1 k2 hado_opening_warning |
| 04 | d | a | 북측 비상 개방문은 도면에 있고, 당직자가 존재를 인정했으며, 이것이 유일한 대안 출입구이기 때문입니다. 회선을 유지하면서 현장 전문가인 선착대에 판단을 맡기는 것이 원칙입니다. | k1 k3_weak |
| 05 | d | a | 남측 회전문은 한 번에 두 사람씩만 통과하고 앞쪽 줄이 줄지 않으며, 관중석 조명까지 꺼졌다는 것은 시설이 급속히 악화되고 있다는 신호다. 북측 비상 개방문은 도면에 있고 현장의 선착대가 도착하면 즉시 열 수 있다면, 대피 경로를 단시간에 두 배로 늘릴 수 있다. | k1 k2 k3_weak |
| 06 | d | a | 막구조의 안쪽 압력이 실패하고 있고, 회전문만으로는 안에서 아직도 사람들이 갇혀 있을 수 있다. | k1 k2 k3_weak |
| 07* | — | — | — |  |
| 08 | d | a | k1과 k2가 보여주는 것: 당직자의 상황 인식이 현실과 어긋나 있고, 사람들은 이미 다른 탈출 경로를 찾으려 하고 있다. | k1 k2 |
| 09 | d | a | 당직자 표기웅과 신고자 문세라의 정보가 이미 여러 번 맞지 않았고, 안쪽 상황 파악이 신뢰할 수 없는 상태에서 당직자의 판단만 믿고 회전문 하나로만 내보낼 수 없다. 지붕 구조상 압력이 유지되어야 안전하다는 것을 방금 알았고, 북측 비상문이 도면에만 있고 실제로 열 수 있는지, 현장의 누가 열 수 있는지 아직 모른다. 선착대가 현장에 닿을 때까지 회선을 열어두고, 도착하는 즉시 북측 문을 열게 하는 것이 확인되지 않은 판단을 최소화하면서 남은 시간을 가장 효과적으로 쓰는 방법이다. | k1 k2 k3_weak |
| 10 | d | a | 북측 비상 개방문은 도면에 있으나, 당직자 표기웅이 그 문에 대해 구체적으로 말한 적이 없다 — 몇 시에 작동을 확인했는지, 어떻게 열어야 하는지, 잠금 상태인지를 모른다. | k1 k2 |
| 11 | d | a | 당직자 표기웅은 혼자라고 했으나 실제 관중석에는 아이들과 인솔자가 있었고, 자재 슬리브를 통한 우발적 탈출까지 일어났다. 급기 송풍기도 고장이 아니라 장시간 정지된 상태였다. 당직자로부터의 정보는 현장 상황을 충분히 반영하지 못하고 있다. | k1 k2 k3_weak |

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
