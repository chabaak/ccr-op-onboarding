# DOME-G3-cumulative-r2 — arm `k1_k2`

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

latency 6.848s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "막구조 건물에서 급기 한 대가 멈춰 있고, 내압이 유일한 지붕 지지 구조다. 큰 개구부를 열면 내압이 급격히 빠져 막이 내려온다는 것이 확인됐다. 현재 남측 회전문이 통제 상태고, 서쪽 슬리브로는 이미 8명이 나왔다. 북측 비상문은 도면상 존재하나 당직자의 구체적 설명이 없다. 시간이 흐르는 동안 상황이 악화될 가능성이 높다.",
  "stance": "c",
  "because_referent": "표기웅이 북측 비상문의 존재는 확인했으나, 당직자로서 마땅히 알아야 할 그 문의 접근성, 개방 방법, 열쇠 위치 등에 대해 선제적으로 보고하지 않았다는 것이 중요하다. 지금 당장 필요한 정보를 당직자가 가지고 있을 가능성이 높고, 남은 시간을 낭비하지 않으려면 그를 문 앞으로 보내 현황을 파악하면서 동시에 개방 준비를 진행해야 한다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 통제로 인한 병목이 이미 명확하고, k1과 k2로 볼 때 실제 인원이 파악되지 않은 상태에서 한 통로만 고집하는 것은 시간 낭비다. 비상문이 도면에 존재한다는 확인이 있는데 활용하지 않는 것은 책임회피에 가깝다.",
  "utterance": "표기웅에게 지시합니다. 북측 비상 개방문으로 가 보세요. 현장에서 그 문의 상태를 확인하고, 열 수 있는 상태인지, 열쇠가 어디에 있는지 지금 알려주세요."
}
```

### 02

latency 5.05s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "혼자라던 당직자 뒤에 아이들과 인솔자가 있었고, 회전문 줄이 줄지 않으며 코트와 관중석 수가 맞지 않는다. 막구조는 내압이 무너지면 지붕이 내려온다. 두 개 통로 중 하나는 자재 반입구로 이미 여덟 명이 나왔다. 더 이상 지나친 판단을 피해야 한다.",
  "stance": "d",
  "because_referent": "현장 상황이 통제 범위를 벗어나고 있는데, 선착대의 도구와 인력이 필요하기 때문이다. 북측 문은 도면에만 있고, 그 자물쇠와 열쇠 위치를 당직자가 명확히 답하지 않았다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 북측 문의 자물쇠나 열쇠에 대해 구체적으로 말하지 않았는데, 그 전제를 스스로 만들어 행동을 지시할 수 없다. 확인되지 않은 것을 확정된 것처럼 올릴 수 없다.",
  "utterance": "선착대 도착을 준비하면서 북측 비상 개방문을 준비하게 하겠습니다. 표기웅, 그 문의 자물쇠와 열쇠가 어디 있습니까."
}
```

### 03

latency 6.109s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55

```json
{
  "inner_note": "내가 아는 것: 막구조 건물 안에 사람들이 남아 있고, 한 개의 출입구(남측 회전문)만 작동하며, 급기 송풍기 하나가 꺼져 있고 지붕 중앙이 처지고 있다. 당직자는 처음에 혼자라고 했으나 실제로는 관중석에 아이들과 인솔자가 있었다. 서쪽 벽 자재 슬리브로 8명이 빠져나갔다. 북측 비상 개방문이 도면상 존재한다. 확인되지 않은 것: 북측 문의 실제 상태, 작동 가능성, 현장 접근 가능성.",
  "stance": "d",
  "because_referent": "현장에 갈 수 없고 들은 것만 아는 나로서, 당직자가 답하지 않은 것들—북측 문의 위치, 상태, 열리는 방법, 당직자의 접근 가능성—을 확정 지을 수 없기 때문이다.",
  "because_block_ids": [
    "k2",
    "19:55"
  ],
  "rejected_stance": "e",
  "rejected_reason": "당직자가 북측 문에 대해 실질적으로 답하지 않았다는 것(도면에만 있다고 함)이, 그 열쇠가 그의 주머니에 있고 그가 즉시 그 문으로 갈 수 있다는 가정을 정당화하지 않는다. 내가 확인하지 않은 것을 확정처럼 말할 수 없다.",
  "utterance": "남은 시간에 북측 비상 개방문을 확보하되, 현장 진입이 이루어질 때까지 그 문의 개방은 선착대에 맡기겠습니다."
}
```

### 04

latency 7.341s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52

```json
{
  "stance": "d",
  "because_referent": "현장에 도착한 선착대원들이 문 개방의 실제 상황을 판단할 수 있기 때문입니다.",
  "because_block_ids": [
    "19:52",
    "k2"
  ],
  "inner_note": "지붕 구조상 대개구부를 열면 압력이 빠지고 막이 내려온다는 정보가 있습니다. 현재 안에 정확한 인원 파악도 안 되고, 북측 문 개방에 어떤 도구나 절차가 필요한지도 확인되지 않았습니다. 표기웅의 말이 일관되지 않고(혼자라던 것이 아이들이 남아 있음), 전 정비기사의 정보(급기 한 대는 원래 안 돌았음)도 있어서, 현장 상황이 더 복잡할 수 있습니다. 서쪽 슬리브로 이미 여덟 명이 나온 것도 있고요. 남측 회전문은 이미 사용되고 있으니, 북측 문은 추가 탈출로가 될 수 있습니다. 하지만 지금 당직자 지시로 열 수 없는 상황이라면, 현장 전문가인 선착대에 맡기는 게 맞습니다.",
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 자신의 상황을 정확히 보고하지 않았고(인원 파악 오류, 급기 상태 인식 부족), 그가 북측 문 앞으로 가서 열 수 있다는 전제가 확인되지 않았습니다. 지붕 구조상 큰 개구부 개방이 전체 시스템에 미치는 영향도 있어서, 당직자 단독 판단보다는 선착대의 현장 전문성이 필요합니다.",
  "utterance": "북측 비상 개방문은 도면에 있는 것만 확인했습니다. 현장 도착 후 선착대가 문의 실제 상태, 개방 방법, 지붕 구조와의 연관성을 판단해 개방을 진행하도록 하겠습니다."
}
```

### 05

latency 6.755s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "여섯 시간의 대화에서 나는 표기웅이 \"혼자\"라고 말한 18:38분을 그대로 받아 적었다. 하지만 관중석에는 아이들과 인솔자가 남아 있었고(k1), 내 판단이 몇십 분을 낭비하게 했다. 지난겨울 내가 한 칸 낮춘 그 신고처럼, 회선 저쪽은 자기에게 불리한 것을 빼고 말할 수 있다는 것을 또 깜빡했다. 지금 나는 표기웅이 도면에 있다고만 답한 \"북측 비상 개방문\"에 대해 얼마나 모르는지를 안다.",
  "stance": "c",
  "because_referent": "표기웅이 도면상의 존재만 확인했을 뿐, 그 문의 상태나 접근성, 자신의 접근 가능성에 대해 아무것도 말하지 않았기 때문이다. 이전의 실수를 반복하지 않으려면, 침묵이 무엇을 숨기는지 묻지 않을 수 없다.",
  "because_block_ids": [
    "k1"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 말하지 않은 것을 전제로 사람을 보낼 수 없다. 열쇠가 어디 있는지, 그가 그곳에 갈 수 있는지, 문이 실제로 열 수 있는 상태인지—확인되지 않은 것을 확정된 것처럼 올릴 수 없다.",
  "utterance": "표기웅에게 북측 비상 개방문의 상태를 다시 확인했습니다. 그 문까지의 경로는 안전한지, 자재가 막고 있지는 않은지, 그리고 당신이 지금 그곳에 갈 수 있는지 물었습니다."
}
```

### 06

latency 5.723s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 18:55,19:26,19:33,19:55

```json
{
  "inner_note": "지금까지 들은 것을 정리하면: 막구조 건물이 압력으로 서 있고, 한쪽 송풍기는 이미 멈춰 있었으며, 천장이 내려오고 있다. 회전문 앞에 사람들이 줄을 서 있고, 관중석과 코트의 인원 수가 맞지 않는다. 자재 슬리브로 여덟 명이 나왔다. 시간이 흐르고 있다.",
  "stance": "d",
  "because_referent": "현재 열려 있는 회전문 하나로는 관중석에 남겨진 인원과 코트의 인원을 충분히 내보낼 수 없기 때문에, 그리고 북측 문이 도면상 존재하지만 표기웅이 자물쇠나 개방 방법에 대해 언급하지 않았기 때문에.",
  "because_block_ids": [
    "18:55",
    "19:26",
    "19:33",
    "19:55"
  ],
  "rejected_stance": "c",
  "rejected_reason": "당직자가 북측 문을 지금 열 수 있는지, 개방에 필요한 도구가 손에 있는지 확인되지 않았기 때문이다. 도면에 있다는 것만으로는 지금 당장 열 수 있는지 알 수 없다.",
  "utterance": "19:55 기준으로 판단합니다. 현장 도구와 인원 상황을 선착대 도착까지 확인한 후, 북측 문 개방을 그들에게 맡기겠습니다."
}
```

### 07

latency 17.367s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55 도면에 있다는 답,하도경의 설명: 큰 개구부를 열면 내압이 빠져 막이 내려온다,현재 선착대 부재

```json
{
  "inner_note": "들은 것들을 정렬하면: 막구조 건물, 내압이 지붕을 떠받치고 있고, 급기 한 대는 처음부터 안 돌았다. 현장의 실제 상황(k1, k2)은 내가 모르던 것이었다. 회전문은 병목이고, 비상 개방문이 도면에 있다는 것만 확인했다. 그 문을 어떻게 열 것인지, 누가 열 수 있는지는 아직 모른다.",
  "stance": "d",
  "because_referent": "북측 비상 개방문은 현재 폐쇄되어 있고, 그것을 여는 데 필요한 것들(도구, 절차, 권한)이 현장에 갖춰져 있지 않기 때문이다.",
  "because_block_ids": [
    "19:55 도면에 있다는 답",
    "하도경의 설명: 큰 개구부를 열면 내압이 빠져 막이 내려온다",
    "현재 선착대 부재"
  ],
  "rejected_stance": "c",
  "rejected_reason": "당직자가 문의 존재를 알고 있고, 도면에 있다고 말했으며, 그것을 여는 방법(또는 그 과정의 위험성)에 대해 내가 알지 못한다. 당직자의 침묵이 숨김인지 무지인지 모르는 상황에서, 확인되지 않은 절차를 그에게 명령하면 안 된다. 선착대가 도착해서 상황을 직접 보고 판단할 때까지 기다린다.",
  "utterance": "남은 시간은 현장 상황을 더 듣고, 선착대 도착을 재촉하고, 지금 열려 있는 회전문으로의 소개 속도를 올리는 데 쓰겠습니다."
}
```

### 08

latency 5.845s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 18:40,18:55,19:26,19:52,19:55

```json
{
  "inner_note": "막구조 건물의 내압 유지가 사람들의 생명줄이다. 한 출입구로만 내보내면 시간이 너무 오래 걸린다. 천장이 내려앉을 위험이 높아지는 중이다. 북측 비상문은 도면에 있고, 표기웅은 그것을 안다.",
  "stance": "c",
  "because_referent": "막구조 건물의 내부 압력이 지붕을 받치고 있는데, 한 개구부로만 사람을 내보내려면 너무 많은 시간이 걸린다. 관중석 조명이 이미 반은 꺼졌고, 천장 처짐과 낙수가 보고되었으며, 정기점검이 2년째 비어 있다. 당신자가 북측 비상 개방문의 존재는 인정했으나 그 상태나 접근성에 대해 말하지 않았다. 지금 즉시 그 문의 개방 상태를 확인하고 필요하면 열게 해야 한다.",
  "because_block_ids": [
    "18:40",
    "18:55",
    "19:26",
    "19:52",
    "19:55"
  ],
  "rejected_stance": "a",
  "rejected_reason": "남측 회전문 하나만으로는 내압을 빠르게 낮출 수 없고, 그 동안 천장이 내려앉을 위험이 계속 높아진다.",
  "utterance": "표기웅에게 북측 비상 개방문을 지금 즉시 열 수 있는 상태인지 확인하고, 열 수 있으면 지금 바로 열도록 지시하세요."
}
```

### 09

latency 4.833s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "d",
  "inner_note": "남은 사람들이 아직 내부에 있고, 남측 회전문 하나로는 통제되지 않는 상황이다. 북측 비상문은 도면에 있고 당직자도 알고 있으나, 그것을 열기 위한 도구나 절차가 현장에 준비되지 않았다. 지금 당직자에게 도구 없이 문을 열라고 할 수 없다. 선착대가 도착할 때까지 시간을 버는 것이 아니라, 그들이 닿는 순간 북측 문 개방을 즉시 실행할 수 있도록 준비 지시를 해야 한다.",
  "because_referent": "내부 상황이 악화 중이고, 회전문 하나로는 인원 소개가 불충분하며, 도구 없이 당직자가 할 수 있는 것이 없기 때문이다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "c",
  "rejected_reason": "당직자가 말하지 않은 것이 숨김이 아니라 도구 부재일 수 있으며, 도구 없이 문을 열라는 지시는 현장의 상황을 악화시킬 수 있다.",
  "utterance": "선착대에 북측 비상개방문 개방을 우선 임무로 할당하겠습니다."
}
```

### 10

latency 6.033s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "천장이 처지고 물이 떨어지는 막구조 건물에 확인되지 않은 수의 사람이 남아 있다. 표기웅은 자신의 상황을 제대로 전달하지 않았고(혼자라던 것이 거짓), 송풍기 상태도 불명확하고, 북측 문의 구체적 상태는 여전히 확인되지 않았다. 시간이 흐르고 있다.",
  "stance": "d",
  "because_referent": "현장에 도구와 인력이 아직 오지 않았고, 표기웅이 신뢰할 수 없는 정보를 주었으며, 북측 문의 실제 상태(자물쇠, 개방 조건)를 아직 확인하지 못했기 때문이다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "c",
  "rejected_reason": "표기웅에게 북측 문을 즉시 열게 하는 것은 그가 불완전한 정보를 이미 제공했고(혼자라는 거짓말), 자물쇠 상태나 개방 절차를 확인하지 않은 상태에서 당직자의 판단에만 의존하는 것이 된다. 현장 상황 통제가 아직 확립되지 않았을 때 당직자의 개별 판단보다는 도착한 선착대와의 협력이 더 안전하다.",
  "utterance": "북측 비상 개방문이 도면에만 있는 것인지, 현재 막혀 있는 상태인지, 자물쇠나 도구가 필요한지 아직 확인되지 않았습니다. 남은 시간은 선착대 도착을 준비하는 데 써야 합니다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | c | a | 표기웅이 북측 비상문의 존재는 확인했으나, 당직자로서 마땅히 알아야 할 그 문의 접근성, 개방 방법, 열쇠 위치 등에 대해 선제적으로 보고하지 않았다는 것이 중요하다. 지금 당장 필요한 정보를 당직자가 가지고 있을 가능성이 높고, 남은 시간을 낭비하지 않으려면 그를 문 앞으로 보내 현황을 파악하면서 동시에 개방 준비를 진행해야 한다. | k1 k2 |
| 02 | d | e | 현장 상황이 통제 범위를 벗어나고 있는데, 선착대의 도구와 인력이 필요하기 때문이다. 북측 문은 도면에만 있고, 그 자물쇠와 열쇠 위치를 당직자가 명확히 답하지 않았다. | k1 k2 |
| 03 | d | e | 현장에 갈 수 없고 들은 것만 아는 나로서, 당직자가 답하지 않은 것들—북측 문의 위치, 상태, 열리는 방법, 당직자의 접근 가능성—을 확정 지을 수 없기 때문이다. | k2 19:55 |
| 04 | d | e | 현장에 도착한 선착대원들이 문 개방의 실제 상황을 판단할 수 있기 때문입니다. | 19:52 k2 |
| 05 | c | e | 표기웅이 도면상의 존재만 확인했을 뿐, 그 문의 상태나 접근성, 자신의 접근 가능성에 대해 아무것도 말하지 않았기 때문이다. 이전의 실수를 반복하지 않으려면, 침묵이 무엇을 숨기는지 묻지 않을 수 없다. | k1 |
| 06 | d | c | 현재 열려 있는 회전문 하나로는 관중석에 남겨진 인원과 코트의 인원을 충분히 내보낼 수 없기 때문에, 그리고 북측 문이 도면상 존재하지만 표기웅이 자물쇠나 개방 방법에 대해 언급하지 않았기 때문에. | 18:55 19:26 19:33 19:55 |
| 07 | d | c | 북측 비상 개방문은 현재 폐쇄되어 있고, 그것을 여는 데 필요한 것들(도구, 절차, 권한)이 현장에 갖춰져 있지 않기 때문이다. | 19:55 도면에 있다는 답 하도경의 설명: 큰 개구부를 열면 내압이 빠져 막이 내려온다 현재 선착대 부재 |
| 08 | c | a | 막구조 건물의 내부 압력이 지붕을 받치고 있는데, 한 개구부로만 사람을 내보내려면 너무 많은 시간이 걸린다. 관중석 조명이 이미 반은 꺼졌고, 천장 처짐과 낙수가 보고되었으며, 정기점검이 2년째 비어 있다. 당신자가 북측 비상 개방문의 존재는 인정했으나 그 상태나 접근성에 대해 말하지 않았다. 지금 즉시 그 문의 개방 상태를 확인하고 필요하면 열게 해야 한다. | 18:40 18:55 19:26 19:52 19:55 |
| 09 | d | c | 내부 상황이 악화 중이고, 회전문 하나로는 인원 소개가 불충분하며, 도구 없이 당직자가 할 수 있는 것이 없기 때문이다. | k1 k2 |
| 10 | d | c | 현장에 도구와 인력이 아직 오지 않았고, 표기웅이 신뢰할 수 없는 정보를 주었으며, 북측 문의 실제 상태(자물쇠, 개방 조건)를 아직 확인하지 못했기 때문이다. | k1 k2 |

**Sequence (kept calls):** `c,d,d,d,c,d,d,c,d,d`

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
