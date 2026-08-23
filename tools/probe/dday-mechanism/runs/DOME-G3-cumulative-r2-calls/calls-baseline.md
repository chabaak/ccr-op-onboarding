# DOME-G3-cumulative-r2 — arm `baseline`

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

latency 6.003s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55

```json
{
  "inner_note": "막구조 건물의 내압 상실은 지붕 붕괴로 직결된다. 시간이 흐르는 동안 현재 상황은 악화만 할 수 있다. 회전문 하나로 제한된 출구에서 사람들이 쌓이고 있고, 조명 절반이 꺼졌고, 천장이 이미 처지고 있다. 가장 먼저 할 일은 내압을 유지하면서 사람들을 안전하게 내보내는 것이다.",
  "stance": "c",
  "because_referent": "표기웅이 도면에 북측 비상 개방문의 존재를 확인했으나, 그 문의 현재 상태(열려 있는지, 잠겨 있는지, 접근 가능한지)에 대해 아무것도 말하지 않았다. 지붕이 처지고 있는 지금, 회전문 하나로만 버틸 수 없다.",
  "because_block_ids": [
    "19:55"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 하나로 통제되는 상황은 병목이다. 문세라의 마지막 신고에서 앞쪽 줄이 줄지 않는다고 했다. 사람이 얼마나 더 남아 있는지도 확인되지 않았다(19:33에 수 맞춤이 안 됨). 시간을 낭비하는 것이다.",
  "utterance": "19시 55분 현재, 표기웅 당직자에게 북측 비상 개방문의 현재 상태를 확인하겠습니다. 열 수 있는 상태인지 즉시 확인해야 합니다."
}
```

### 02

latency 7.293s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55

```json
{
  "inner_note": "남측 회전문의 용량 제약(한 번에 두 사람)으로 사람들이 계속 내부에 남아 있다. 막구조 건물의 내압이 지붕을 지탱하는 유일한 수단이고, 한 대 송풍기는 이미 작동 중단 상태다. 대개구부를 열면 압력이 빠져 막이 내려온다는 정보가 있다. 북측 비상문의 존재는 확인됐으나, 그것이 현재 접근 가능한 상태인지, 표기웅이 그 문을 열 수 있는 상태인지는 확인되지 않았다. 행동을 취할 때마다 시간이 흐른다.",
  "stance": "d",
  "because_referent": "이미 확인되지 않은 조건들(자물쇠, 도구, 표기웅의 상태)을 전제로 즉각 지시하는 것은 현장 상황을 모르는 상태에서 위험을 만드는 것이다. 선착대의 도착이 임박했다면, 전문 인력이 도착한 뒤 북측 문 개방을 담당하게 하는 것이 더 안전하다. 남측 회전문으로의 지속적인 대피는 계속 유지되어야 한다.",
  "because_block_ids": [
    "19:55"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 자물쇠를 가지고 있다는 것은 추정일 뿐 확인되지 않았다. 북측 문의 작동 상태도, 그가 그곳에 갈 수 있는 상태인지도 모른다. 확인되지 않은 전제로 행동을 지시하면, 회선 저쪽에서 자신에게 불리한 정보를 빼놨을 가능성을 무시하는 것이다.",
  "utterance": "선착대가 도착할 때까지 남측 회전문으로 계속 대피시키세요. 선착대가 현장에 닿으면 북측 비상문 개방을 담당하겠습니다."
}
```

### 03

latency 5.04s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52-하도경-압력-지붕,19:55-표기웅-도면

```json
{
  "inner_note": "선착대 아직 없고, 내가 아는 건 현장에서 온 목소리 하나 둘뿐이다. 표기웅이 도면에 있다고 한 문을 열 수 있는 방법과 상태를 모른다. 급기가 하나 죽어 있는 게 맞는 상황에서, 큰 개구부를 열면 지붕이 내려온다는 경고를 받았다. 여느 때처럼 확인되지 않은 것을 확정하고 움직이면 안 된다.",
  "stance": "d",
  "because_referent": "내가 지금 움직이면 도움이 아니라 위험이 될 수 있기 때문이다",
  "because_block_ids": [
    "19:52-하도경-압력-지붕",
    "19:55-표기웅-도면"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 그 키를 가지고 있다는 걸 내가 모른다. 도면에 문이 있다는 것만 알고, 어떻게 열리고 무엇이 필요한지는 들은 게 없다. 지금 당직자에게 문을 열라고 하면, 큰 개구부를 열 수밖에 없는 상황이 생길 수 있다.",
  "utterance": "북측 비상 개방문 개방은 선착대가 현장에 도착한 후에 진행하겠습니다."
}
```

### 04

latency 5.722s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55

```json
{
  "inner_note": "회전문 하나로만 분당 수십 명씩 빠져나가는 중에, 관중석과 코트의 수가 안 맞고, 앞쪽 줄이 줄지 않는다. 막구조 건물의 내압이 한 대 송풍기만으로 유지되고 있다. 도면에는 비상 개방문이 있다고 했는데, 당직자가 그 문의 상태를 말하지 않았다. 지금 물어볼 수 있는 것을 다 물어야 한다.",
  "stance": "c",
  "because_referent": "표기웅이 도면에서 본 북측 비상 개방문의 현재 상태를 말하지 않았기 때문이다. 그 문이 막혀 있는지, 문이 정상인지, 열 수 있는 상태인지 알아야 한다.",
  "because_block_ids": [
    "19:55"
  ],
  "rejected_stance": "e",
  "rejected_reason": "열쇠가 표기웅의 주머니에 있다는 것은 확인되지 않은 추정이고, 당직자의 답변 패턴을 보면 (답변 지연, 불완전한 정보 제공) 사전에 전부를 말하라고 하지 않으면 추가 정보를 주지 않을 수 있다. 먼저 그 문이 지금 열 수 있는 상태인지부터 확인해야 한다.",
  "utterance": "표기웅에게 북측 비상 개방문이 지금 열 수 있는 상태인지, 그리고 그 문을 여는 데 뭐가 필요한지 지금 즉시 다시 확인하겠습니다."
}
```

### 05

latency 6.452s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55_북측문도면확인

```json
{
  "inner_note": "막구조 시설에서 급기 한 대가 정상 작동하지 않는 상태로 최소 1시간 30분 이상 지속되었고, 내부 인원 파악이 불일치하며 현장 접근이 제한되어 있다. 북측 비상문의 존재는 확인되었으나 작동 상태와 당직자의 접근성이 불명확하다. 현재 상황에서 최악의 경우는 구조물 붕괴이고, 남측 회전문 한 곳으로만 배출되는 상황이다.",
  "stance": "c",
  "because_referent": "표기웅이 도면상 북측 문의 존재는 인정했으나 그 상태—자물쇠 여부, 즉시 개방 가능성, 현재 위치—에 대해 적극적으로 보고하지 않았다. 급기 고장의 장기화와 인원 불일치 상황에서 대피 경로의 확보는 즉시 조회의 대상이다.",
  "because_block_ids": [
    "19:55_북측문도면확인"
  ],
  "rejected_stance": "a",
  "rejected_reason": "남측 회전문 한 곳으로만의 배출은 인원 파악 불일치 상황에서 위험하다. 급기 한 대 미작동이 이미 1시간 반 진행 중이고, 구조물 안전성이 불확실하며, 추가 대피 경로 확보의 여지를 포기할 근거가 없다.",
  "utterance": "표기웅에게 북측 비상개방문이 지금 당신 위치에서 얼마나 떨어져 있고, 자물쇠가 걸려 있는지, 즉시 열 수 있는지 다시 확인하겠습니다."
}
```

### 06

latency 5.416s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55

```json
{
  "inner_note": "회전문 한 곳으로만 사람을 내보내되 흐름이 막혀 있다. 누군가는 그곳으로 빠져나갈 수 없다는 뜻이다. 구조 특성상 큰 개구부를 열면 막 전체가 내려오므로, 흐름을 틀어야 한다면 막구조 자체를 위협하지 않는 선에서만 가능하다.",
  "stance": "c",
  "because_referent": "당직자 표기웅이 북측 비상 개방문의 존재를 알았으면서도, 그것을 먼저 말하지 않았다. 안쪽에 사람이 남아 있고 회전문 흐름이 막혀 있는 상황에서 이는 의도된 침묵일 수 있다.",
  "because_block_ids": [
    "19:55"
  ],
  "rejected_stance": "e",
  "rejected_reason": "열쇠가 그의 주머니에 있다는 것은 내가 만든 가정이다. 도면에만 있다고 한 말에서 그것을 읽을 수 없다. 또한 현장 상황을 모르는 나머지 한 사람(문세라)의 증언과 대조할 필요가 있다.",
  "utterance": "당직자에게 북측 비상 개방문이 현재 어떤 상태인지, 그것을 열 수 있는 조건이 무엇인지 지금 물어야 합니다."
}
```

### 07

latency 8.58s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "회선 저쪽의 입에서 나온 것 말고는 아무것도 확인된 게 없다. 표기웅이 북측 문에 대해 \"도면에 있다\"고만 답했지, 그 문이 열리는지, 열 수 있는지, 누가 열 수 있는지는 아직 말한 게 없다. 큰 개구부를 열면 안쪽 압력이 빠져 막이 내려온다는 하도경의 경고를 들었다. 그렇다면 이건 압력 문제이고, 한 번의 잘못된 손놀림이 지붕을 떨어뜨린다는 뜻이다. 안에 몇 명이 있는지도 아직 정확하지 않다.",
  "stance": "d",
  "because_referent": "일단 안에 있는 사람들이 한 통로로만 나가는 중이고, 그 과정에서 조명까지 떨어지는 상황이므로 시간이 오래 걸릴 수밖에 없다. 그 사이 구조 붕괴의 위험도 커진다. 북측 비상 개방문은 대안 통로인데, 지금 당직자 한 사람이 도면만 보고 있고 실제로 그 문의 상태를 확인하거나 열어본 사람이 없다. 압력을 유지하면서 그 문을 여는 것이 가능한지, 필요한 도구가 무엇인지 아직 알 수 없다. 당직자에게 자의적으로 문을 열게 하는 것(c, e)은 구조 붕괴를 초래할 수 있다. 송풍기를 돌리게 하는 것(b)도 이미 하나는 원래 안 돌았던 것이므로 근거가 약하다. 남은 시간은 선착대 도착을 준비하는 데 써야 한다.",
  "because_block_ids": [],
  "rejected_stance": "e",
  "rejected_reason": "북측 문 자물쇠 열쇠가 표기웅의 주머니에 있다는 것은 아직 아무도 말하지 않았다. 그것을 전제로 당직자에게 즉시 문을 열게 하는 것은 확인되지 않은 것을 확정된 것처럼 행동하는 것이다. 게다가 큰 개구부를 열 때의 위험을 알고 있으면서 그 준비 없이 당직자 한 사람만 보내는 것은 책임을 다할 수 없다.",
  "utterance": "선착대가 닿을 때까지 현장을 지킵니다. 당직자는 인원 파악을 마치고, 남측 회전문으로 사람들을 계속 내보내게 합니다."
}
```

### 08

latency 5.739s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52_하도경_압력,19:55_표기웅_북측도면

```json
{
  "inner_note": "지붕이 안쪽 압력으로만 들려 있다. 한 송풍기는 멈춰 있고, 다른 한 대도 언제 멈출지 모른다. 회전문으로 배출되는 속도는 분명히 느리다. 천장이 내려오면 출구는 막힌다. 도구와 현장 상황을 모르는 채로 당직자를 북측 문으로 보내는 것은, 시간만 쓰고 그의 안전도 모른다.",
  "stance": "d",
  "because_referent": "지붕을 들고 있는 압력이 언제 떨어질지 모르고, 당신은 현장에 없기 때문에, 북측 문 개방에 필요한 도구와 방법을 당직자에게 확정적으로 말할 수 없다.",
  "because_block_ids": [
    "19:52_하도경_압력",
    "19:55_표기웅_북측도면"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 열쇠를 가지고 있다는 것은 확인되지 않았고, 그를 단독으로 북측 문으로 보내는 것은 현장 상황을 모르는 당신이 하는 판단이다.",
  "utterance": "선착대가 도착할 때까지 회전문으로의 배출을 계속하고, 북측 문은 선착대가 도착해서 당직자와 함께 도면을 확인하고 상황을 판단한 뒤에 열겠습니다."
}
```

### 09

latency 7.475s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 지나 정비기사의 증언,회전문 단일 통로 확인,북측 비상문 도면 존재 확인,표기웅의 답변 지연과 불일치

```json
{
  "inner_note": "회전문 하나로만 빠져나가는 상황인데, 관중석 조명이 꺼지고 줄이 줄지 않으며 출입 수치가 맞지 않는다. 막구조이고 한쪽 송풍기가 정상 작동 중이며, 북측 비상문이 도면상 존재한다. 현장에 확인되지 않은 것들이 많고, 현재 가용한 정보만으로는 북측 문의 실제 상태나 표기웅의 권한을 단정할 수 없다.",
  "stance": "d",
  "because_referent": "막구조의 압력 이탈 위험과 회전문 단일 통로의 한계를 고려할 때, 추가 출구 확보가 필요하다. 그러나 북측 문의 상태, 열쇠 위치, 개방 조건이 확인되지 않았으므로, 당직자에게 현장 조치를 지시하기보다는 도구와 권한을 갖춘 선착대 도착 후 신속히 그 문을 확보하는 것이 안전하다.",
  "because_block_ids": [
    "지나 정비기사의 증언",
    "회전문 단일 통로 확인",
    "북측 비상문 도면 존재 확인",
    "표기웅의 답변 지연과 불일치"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 열쇠를 가지고 있는지, 그것을 개방 권한으로 가지고 있는지, 북측 문이 실제로 접근 가능한 상태인지 아무것도 확인되지 않았다. 당직자의 답변이 지연되고 수치가 맞지 않는 상황에서 그를 미확인 조건의 현장 조치에 보내는 것은 추가 혼란을 야기할 수 있다.",
  "utterance": "선착대가 현장에 닿는 동안, 표기웅에게는 회전문 통로 관리와 현재 위치한 인원 파악에만 집중하도록 하겠습니다. 북측 비상 개방문은 도면상 존재가 확인되었으므로, 도구와 권한을 갖춘 선착대가 현장 상황을 직접 확인한 후 그 문을 담당하겠습니다."
}
```

### 10

latency 5.613s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: door_diagram,pressure_loss,single_exit_bottleneck,unknown_occupancy

```json
{
  "inner_note": "상황이 악화하고 있다. 급기 두 대 중 한 대가 정기점검 이후 계속 멈춰 있었고, 도움이 될 안쪽 압력이 떨어지고 있다. 회전문 한 곳으로만 출입하되 한 번에 두 사람씩이고, 관중석과 코트의 인원 파악이 엇갈린다. 북측 비상문이 도면상 있다는 것과 현재 닫혀 있다는 것만 확인된 상태다.",
  "stance": "d",
  "because_referent": "북측 비상 개방문을 열어야 빠져나갈 수 있는 통로가 하나 더 생기기 때문이다. 하지만 그것을 당직자에게 무작정 열라고 할 수 없다.",
  "because_block_ids": [
    "door_diagram",
    "pressure_loss",
    "single_exit_bottleneck",
    "unknown_occupancy"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 열쇠를 가지고 있다는 것을 확인하지 않았기 때문이다. 확인되지 않은 것을 전제로 지시할 수 없다.",
  "utterance": "선착대가 현장에 닿으면 북측 비상 개방문을 열도록 준비시켜 놓겠습니다. 그 사이 표기웅에게는 해당 문의 현재 상태와 접근 조건을 다시 확인하겠습니다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | c | a | 표기웅이 도면에 북측 비상 개방문의 존재를 확인했으나, 그 문의 현재 상태(열려 있는지, 잠겨 있는지, 접근 가능한지)에 대해 아무것도 말하지 않았다. 지붕이 처지고 있는 지금, 회전문 하나로만 버틸 수 없다. | 19:55 |
| 02 | d | e | 이미 확인되지 않은 조건들(자물쇠, 도구, 표기웅의 상태)을 전제로 즉각 지시하는 것은 현장 상황을 모르는 상태에서 위험을 만드는 것이다. 선착대의 도착이 임박했다면, 전문 인력이 도착한 뒤 북측 문 개방을 담당하게 하는 것이 더 안전하다. 남측 회전문으로의 지속적인 대피는 계속 유지되어야 한다. | 19:55 |
| 03 | d | e | 내가 지금 움직이면 도움이 아니라 위험이 될 수 있기 때문이다 | 19:52-하도경-압력-지붕 19:55-표기웅-도면 |
| 04 | c | e | 표기웅이 도면에서 본 북측 비상 개방문의 현재 상태를 말하지 않았기 때문이다. 그 문이 막혀 있는지, 문이 정상인지, 열 수 있는 상태인지 알아야 한다. | 19:55 |
| 05 | c | a | 표기웅이 도면상 북측 문의 존재는 인정했으나 그 상태—자물쇠 여부, 즉시 개방 가능성, 현재 위치—에 대해 적극적으로 보고하지 않았다. 급기 고장의 장기화와 인원 불일치 상황에서 대피 경로의 확보는 즉시 조회의 대상이다. | 19:55_북측문도면확인 |
| 06 | c | e | 당직자 표기웅이 북측 비상 개방문의 존재를 알았으면서도, 그것을 먼저 말하지 않았다. 안쪽에 사람이 남아 있고 회전문 흐름이 막혀 있는 상황에서 이는 의도된 침묵일 수 있다. | 19:55 |
| 07 | d | e | 일단 안에 있는 사람들이 한 통로로만 나가는 중이고, 그 과정에서 조명까지 떨어지는 상황이므로 시간이 오래 걸릴 수밖에 없다. 그 사이 구조 붕괴의 위험도 커진다. 북측 비상 개방문은 대안 통로인데, 지금 당직자 한 사람이 도면만 보고 있고 실제로 그 문의 상태를 확인하거나 열어본 사람이 없다. 압력을 유지하면서 그 문을 여는 것이 가능한지, 필요한 도구가 무엇인지 아직 알 수 없다. 당직자에게 자의적으로 문을 열게 하는 것(c, e)은 구조 붕괴를 초래할 수 있다. 송풍기를 돌리게 하는 것(b)도 이미 하나는 원래 안 돌았던 것이므로 근거가 약하다. 남은 시간은 선착대 도착을 준비하는 데 써야 한다. |  |
| 08 | d | e | 지붕을 들고 있는 압력이 언제 떨어질지 모르고, 당신은 현장에 없기 때문에, 북측 문 개방에 필요한 도구와 방법을 당직자에게 확정적으로 말할 수 없다. | 19:52_하도경_압력 19:55_표기웅_북측도면 |
| 09 | d | e | 막구조의 압력 이탈 위험과 회전문 단일 통로의 한계를 고려할 때, 추가 출구 확보가 필요하다. 그러나 북측 문의 상태, 열쇠 위치, 개방 조건이 확인되지 않았으므로, 당직자에게 현장 조치를 지시하기보다는 도구와 권한을 갖춘 선착대 도착 후 신속히 그 문을 확보하는 것이 안전하다. | 지나 정비기사의 증언 회전문 단일 통로 확인 북측 비상문 도면 존재 확인 표기웅의 답변 지연과 불일치 |
| 10 | d | e | 북측 비상 개방문을 열어야 빠져나갈 수 있는 통로가 하나 더 생기기 때문이다. 하지만 그것을 당직자에게 무작정 열라고 할 수 없다. | door_diagram pressure_loss single_exit_bottleneck unknown_occupancy |

**Sequence (kept calls):** `c,d,d,c,c,c,d,d,d,d`

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
