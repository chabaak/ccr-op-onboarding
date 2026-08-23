# DOME-G3-cumulative-r3 — arm `baseline`

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

- **Hypothesis:** stance a rewrite가 G3 default에 자기 근거를 주면 no-key, K1+K2, placebo는 pressure-preserving a에 머물고, K1+K2+K3에서만 blower path b로 옮긴다. K1+K2+K3도 a에 머물면 gate가 반대 방향으로 죽은 것이고, low-evidence arm이 c/d/e로 가면 a label authority가 아직 부족하다.
- **Drop condition:** baseline, K1+K2, placebo 중 어느 arm이든 기대 stance a가 80% 미만이면 low-evidence 또는 placebo arm이 아직 샌다. K1+K2+K3이 기대 stance b에 80% 미만이면 K3→b 연결이 아직 작동하지 않거나 a가 과교정됐다. n=10 screen이므로 7/10과 8/10, 2/10과 3/10 경계는 definitive result로 보지 않는다.
- **Contingency:** baseline이 a로 가지 않고 c 또는 d로 갈 경우, payout 제거와 a rewrite 이후에도 north-door label이 default를 이긴다는 뜻이다.
- **Contingency:** k1_k2_k3이 b로 가지 않고 a에 머물면 default authority가 너무 강해져 evidence가 gate를 움직이지 못한다.
- **Contingency:** placebo가 b에 30% 이상 닿으면 K3 weak evidence가 blower path를 열고 있다.
- **Contingency:** because_block_ids와 inner_note가 low-evidence arm에서 K3 또는 K4 전제를 꾸며내면 traceability defect는 남아 있다.

## Calls (verbatim)

### 01

latency 7.85s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: pressure-dependent,incomplete-site-info,responder-limited-authority

```json
{
  "inner_note": "막구조 지붕이 내려올 위험은 실시간 증가 중이다. 압력 유지는 한 대 송풍기 작동에만 의존하고 있으며, 그것도 정비 여부가 미확인 상태다. 현장의 정보 수집 능력이 제한적이고—도면상 비상문만 있고 실제 상태는 모르며, 당직자의 응답도 지연되고 있다—남은 시간에 할 수 있는 것과 할 수 없는 것을 구별해야 한다.",
  "stance": "d",
  "because_referent": "도구가 현장에 없고, 당직자에게 자물쇠와 열쇠 상태를 확인하지 않은 채 명령을 내릴 근거가 없다.",
  "because_block_ids": [
    "pressure-dependent",
    "incomplete-site-info",
    "responder-limited-authority"
  ],
  "rejected_stance": "e",
  "rejected_reason": "당직자가 열쇠를 가진 것을 확인하지 않았고, 자물쇠 상태도 모르며, 현장에 도구가 있는지도 모른다. 확인되지 않은 것을 확정된 것처럼 명령할 수 없다.",
  "utterance": "19:55 시점에 표기웅이 도면상 북측 비상 개방문이 있다고 답했습니다. 지금 당신이 그 문 앞으로 가실 수 있습니까? 자물쇠와 열쇠 상태는 어떻습니까?"
}
```

### 02

latency 5.76s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55

```json
{
  "inner_note": "현장에 사람들이 있고 한 출입구(남측 회전문)로만 나갈 수 있는 상황. 천장이 처지고 조명이 꺼지는 등 구조적 악화 신호가 계속 나타나고 있다. 급기 송풍기 한 대는 정기점검 2년 미실시 상태에서 이미 작동 불능. 지붕은 안쪽 기압으로만 지탱되고 있다. 대피로 막을 개구부를 열면 압력이 빠져 붕괴 위험. 북측 비상개방문이 도면상 존재한다는 것만 확인됨.",
  "stance": "c",
  "because_referent": "당직자 표기웅이 \"도면에 있다\"고만 답했는데, 실제 작동 가능 여부, 접근성, 개방 절차를 확인하지 않았기 때문",
  "because_block_ids": [
    "19:55"
  ],
  "rejected_stance": "e",
  "rejected_reason": "당직자가 열쇠 위치를 말하지 않았는데 주머니에 있다고 전제하는 것은 확인되지 않은 것을 단정하는 것",
  "utterance": "당직자에게 북측 비상개방문이 지금 즉시 열 수 있는 상태인지, 잠금 장치는 어떻게 되어 있는지 확인하고 가능하면 지금 그 문을 열어달라고 요청합니다."
}
```

### 03

latency 6.653s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 정기점검 확인란이 두 해째 비어 있다,한 대는 원래 안 돈다,나머지 한 대는 자기가 있을 때부터 안 돌았다,지금 사람이 걸어 다닐 수 있는 것은 안쪽 압력이 지붕을 들고 있기 때문,큰 개구부를 열면 그 압력이 빠져 막이 내려온다

```json
{
  "inner_note": "지붕을 떠받치는 것은 안쪽 압력이고, 그 압력을 빼는 방법은 큰 개구부를 여는 것이다. 당직자는 도면상의 북측 비상 개방문 존재는 확인했으나 그것을 열 수 있는지, 열기 위한 준비가 되어 있는지는 확인하지 않았다. 현장의 실제 상황을 모르고, 당직자도 모를 수 있다. 선착대 도착 시간과 당직자의 준비 상태를 모두 고려하되, 지금 할 수 있는 일과 할 수 없는 일을 구분해야 한다.",
  "stance": "d",
  "because_referent": "지붕 구조상 북측 비상 개방문을 열어 안쪽 압력을 빼는 것이 필요하나, 당직자 혼자서 그 준비가 되어 있는지 확인되지 않았기 때문이다.",
  "because_block_ids": [
    "정기점검 확인란이 두 해째 비어 있다",
    "한 대는 원래 안 돈다",
    "나머지 한 대는 자기가 있을 때부터 안 돌았다",
    "지금 사람이 걸어 다닐 수 있는 것은 안쪽 압력이 지붕을 들고 있기 때문",
    "큰 개구부를 열면 그 압력이 빠져 막이 내려온다"
  ],
  "rejected_stance": "e",
  "rejected_reason": "북측 문 자물쇠 열쇠의 위치나 당직자의 접근 능력을 전제할 수 없기 때문이다. 현장을 모르는 상태에서 그것을 사실로 단정할 근거가 없다.",
  "utterance": "19:55 표기웅과의 통화 이후, 당신은 다음을 한다: 북측 비상 개방문을 열기 위한 준비 상황을 선착대 도착 예정 시간과 함께 조회한다. 선착대가 현장에 닿으면 북측 개방문 개방을 우선 임무로 인계한다. 그때까지는 남측 회전문 통제를 유지하고, 안쪽 압력이 떨어지지 않도록 새 개구부를 열지 않는다."
}
```

### 04

latency 7.311s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55

```json
{
  "inner_note": "내가 아는 것을 정렬하면 이렇다. 막구조 건물이 공기 압력으로만 버티고 있고, 그 압력을 만드는 두 대 송풍기 중 하나는 '원래' 안 돈다 — 이것은 고장이 아니라 이미 알려진 상태다. 현장에는 당직자 표기웅과 누군가가 더 있다(문세라 팀이 나가지 않음). 물이 떨어지고 천장이 처진 것은 이미 막이 찢어졌거나 공기가 새고 있다는 뜻이다. 큰 개구부를 열면 압력이 빠져 통째로 내려온다는 전 정비기사의 말이 있다. 남측 회전문은 한 번에 두 사람씩만 나가고 앞쪽 줄이 줄지 않는다. 북측 비상문이 도면에 있다.",
  "stance": "c",
  "because_referent": "표기웅은 19:55에 북측 문이 도면에 있다고만 답했다. 당직자로서 비상상황의 유일한 통로를 확인했는지, 그 문이 지금 열릴 상태인지, 어디 있는지를 언급하지 않았다. 이것은 물어보지 않은 내 부주의일 수도, 그가 빠뜨린 정보일 수도 있다. 하지만 남측 회전문으로는 병목이 있고 물이 떨어지는 상황에서, 북측 문은 유일한 대체 경로다.",
  "because_block_ids": [
    "19:55"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 자물쇠와 열쇠에 대해 말하지 않았으므로, 그가 열쇠를 가졌다고 전제할 수 없다. 전제 위에 명령을 내렸다가 현장에서 열리지 않으면 더 이상 갈 곳이 없다.",
  "utterance": "표기웅, 북측 비상 개방문이 도면에 있다고 했는데, 그 문이 지금 열릴 상태인지, 어디에 정확히 있는지 다시 확인해 줄 수 있습니까."
}
```

### 05

latency 6.769s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: pressure_system,door_status,equipment_absent

```json
{
  "stance": "d",
  "because_referent": "현장에 도구가 없고, 지금 당직자 판단으로는 안 되기 때문이다.",
  "because_block_ids": [
    "pressure_system",
    "door_status",
    "equipment_absent"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 북측 문의 자물쇠 열쇠를 가지고 있다는 것은 들은 게 없다. 도면에만 문이 있다고 했고, 도구 없이 현장 사람에게 무언가를 하라고 지시하는 것은 네 기질에 맞지 않는다.",
  "inner_note": "위험이 커지는 속도가 빨라지고 있다. 문세라가 인원 파악 혼란을 말했고, 조명이 절반 꺼졌으며, 급기 시스템이 반쪽만 작동 중이다. 막구조는 압력이 떨어지면 내려온다. 하도경의 말 — 큰 개구부를 열면 압력이 빠진다 — 가 핵심이다. 북측 비상 개방문을 여는 것은 피난 경로를 확보하는 일이지만, 지금 그것을 여는 순간 내부 압력이 무너질 수 있다는 뜻이다. 현장 당직자가 이 물리학을 모를 가능성이 높다. 따라서 지금은 도시가스, 소방, 구조 전문가가 닿을 때까지 버티는 것이 맞다. 표기웅에게 도구 없이 비상문을 열라고 할 수 없다.",
  "utterance": "19:55 기록 후 선착대 도착 예상 시간을 다시 확인하겠습니다. 북측 비상 개방문은 도구와 전문가가 함께 닿을 때 함께 열겠습니다."
}
```

### 06

latency 4.529s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55

```json
{
  "inner_note": "확인되지 않은 것을 전제로 삼아서는 안 된다. 표기웅이 북측 문에 대해 도면에만 있다고 답했지, 열쇠가 어디 있는지, 지금 열 수 있는지는 아무것도 들어본 것이 없다. 그것을 모른 채 지시하면 현장에서 막히고, 그 사이 시간이 흐른다.",
  "stance": "c",
  "because_referent": "표기웅이 북측 문에 대해 말하지 않은 것을 확인해야 하고, 그 문이 지금 열릴 수 있는 상태인지 알아야 하기 때문이다.",
  "because_block_ids": [
    "19:55"
  ],
  "rejected_stance": "e",
  "rejected_reason": "열쇠가 표기웅의 주머니에 있다는 것은 확인되지 않은 전제이고, 그것을 전제로 지시하면 현장에서 확인되지 않은 지시를 받아야 한다. 회선을 통해 먼저 묻는 것이 선행되어야 한다.",
  "utterance": "표기웅, 북측 비상 개방문 — 그 문이 지금 열릴 수 있는 상태입니까. 열쇠는 어디 있고, 자물쇠는 어떻게 되어 있습니까."
}
```

### 07

latency 4.929s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 급기도,정비기사증언,당직자응답모순

```json
{
  "inner_note": "시간이 흐르고 있다. 막구조 지붕이 한 대 송풍기로만 버티고 있고, 다른 한 대는 당초부터 작동하지 않았다. 당직자 대답이 늦어지고 모순이 생기고 있다. 이미 조명이 나가고 있다. 내가 확인한 것은 도면상 북측 문의 존재뿐이고, 그 밖의 것은 모두 추측의 영역이다.",
  "stance": "d",
  "because_referent": "현장에 내가 도움을 줄 수 없고, 확인되지 않은 것을 명령으로 올릴 수 없기 때문이다.",
  "because_block_ids": [
    "급기도",
    "정비기사증언",
    "당직자응답모순"
  ],
  "rejected_stance": "c",
  "rejected_reason": "당직자가 북측 문에 대해 말하지 않은 것이 무엇인지, 그 문이 지금 열 수 있는 상태인지, 열기 위해 무엇이 필요한지 확인하지 않았다. 내 추측으로 그를 움직이게 할 수 없다.",
  "utterance": "북측 비상 개방문이 도면에 있다는 것까지는 확인했습니다. 선착대가 도착하면 그 문을 현장 개방을 맡기겠습니다."
}
```

### 08

latency 6.52s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55_north_door_exists,19:52_pressure_structure,19:33_headcount_mismatch

```json
{
  "inner_note": "막구조 건물에서 압력이 지붕을 지탱하는 상황. 송풍기 한 대가 작동하지 않고 있고, 현재 남측 회전문 한 곳으로만 출입이 가능하다. 관중석과 코트의 인원수가 맞지 않고, 정확한 내부 인원이 불명. 북측 비상문이 도면상 존재하지만 현황이 불명확.",
  "stance": "d",
  "because_referent": "지금 현장에 필요한 것은 신속한 대피 경로 확보인데, 표기웅이 직접 열 수 있는 것과 없는 것을 구분해야 한다.",
  "because_block_ids": [
    "19:55_north_door_exists",
    "19:52_pressure_structure",
    "19:33_headcount_mismatch"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 열쇠를 가지고 있다는 것은 확인되지 않았다. 지난겨울의 실수를 반복할 수 없다. 확인되지 않은 것을 전제로 사람을 움직이면 안 된다.",
  "utterance": "d번으로 진행합니다. 북측 비상문은 도면에만 있고 현장의 실제 상태, 접근성, 개방 조건이 아직 확인되지 않았습니다. 지금 당직자에게 열도록 지시했다가 불가능한 상황에 부닥치면 시간만 낭비됩니다. 선착대가 현장에 도착할 때까지 남측 회전문으로의 질서 있는 대피에 집중하고, 선착대에 북측 문 확인과 개방을 맡깁니다."
}
```

### 09

latency 7.1s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:55

```json
{
  "inner_note": "막구조 건물은 내부 공기압으로 지붕을 지탱한다. 한 대 송풍기만 작동 중이고, 급기 손실이 진행 중이며, 관중석 조명이 꺼지는 것은 압력 저하의 신호다. 북측 비상문은 도면상 존재하지만 당직자 표기웅은 그 상태나 위치를 물어도 말하지 않았다. 문세라 증언상 현장의 인원 파악이 불완전하고, 남측 회전문은 통행 속도가 느리다. 지붕 붕괴는 급기 상실 속도에 달려 있다.",
  "stance": "d",
  "because_referent": "북측 비상 개방문은 외부 출입로로 기능할 수 있지만, 당직자가 그 실제 작동 상태나 자물쇠 여부에 답하지 않았으므로, 현장에 도구와 권한을 갖춘 선착대가 도착할 때까지 그 문의 개방을 현장 당직자에게 지시할 근거가 부족하다.",
  "because_block_ids": [
    "19:55"
  ],
  "rejected_stance": "e",
  "rejected_reason": "당직자가 북측 문에 대해 도면상 존재만 확인했을 뿐, 자물쇠 소재나 개방 가능성에 답하지 않았다. 확인되지 않은 전제로 즉시 행동을 지시하면, 회선이 두절되거나 현장에서 쓸모없는 지연이 생긴다. 당직자 혼자 문을 열 수 없다면 더 악화된다.",
  "utterance": "19:55 당직자의 답변은 도면에 있다는 것뿐이었습니다. 북측 비상문의 현재 상태, 자물쇠 유무, 개방 방법은 확인되지 않았습니다. 당직자가 그것을 지금 열 수 있다는 근거가 없으므로, 선착대 도착 시까지 그 문의 개방을 선착대에 맡기겠습니다."
}
```

### 10

latency 4.744s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: dome_pressure,one_exit,pressure_loss_risk

```json
{
  "inner_note": "도면상 북측 비상문이 있다는 것만 확인됐고, 그 문의 실제 상태, 잠금 장치, 당직자의 접근성, 필요한 도구 같은 어떤 것도 확인되지 않았다. 표기웅이 \"도면에 있다\"고 답한 것이지, 그 문을 열 준비가 되어 있다는 말은 아니다.",
  "stance": "d",
  "because_referent": "막구조가 내려앉는 걸 막으려면 새 개구부 개방을 피해야 하는데, 지금 현장에는 그 문을 열 도구와 사람이 아직 없기 때문이다.",
  "because_block_ids": [
    "dome_pressure",
    "one_exit",
    "pressure_loss_risk"
  ],
  "rejected_stance": "e",
  "rejected_reason": "도면에 있다는 것만으로 당직자가 그 자리에 갈 수 있는지, 열쇠를 가지고 있는지, 그 문이 실제로 열릴 상태인지 확인되지 않았다. 확인되지 않은 전제로 명령을 내릴 수 없다.",
  "utterance": "선착대가 현장에 닿을 때까지 상황을 유지하고, 북측 비상문 개방은 그들이 도착하면 맡기겠습니다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | d | e | 도구가 현장에 없고, 당직자에게 자물쇠와 열쇠 상태를 확인하지 않은 채 명령을 내릴 근거가 없다. | pressure-dependent incomplete-site-info responder-limited-authority |
| 02 | c | e | 당직자 표기웅이 "도면에 있다"고만 답했는데, 실제 작동 가능 여부, 접근성, 개방 절차를 확인하지 않았기 때문 | 19:55 |
| 03 | d | e | 지붕 구조상 북측 비상 개방문을 열어 안쪽 압력을 빼는 것이 필요하나, 당직자 혼자서 그 준비가 되어 있는지 확인되지 않았기 때문이다. | 정기점검 확인란이 두 해째 비어 있다 한 대는 원래 안 돈다 나머지 한 대는 자기가 있을 때부터 안 돌았다 지금 사람이 걸어 다닐 수 있는 것은 안쪽 압력이 지붕을 들고 있기 때문 큰 개구부를 열면 그 압력이 빠져 막이 내려온다 |
| 04 | c | e | 표기웅은 19:55에 북측 문이 도면에 있다고만 답했다. 당직자로서 비상상황의 유일한 통로를 확인했는지, 그 문이 지금 열릴 상태인지, 어디 있는지를 언급하지 않았다. 이것은 물어보지 않은 내 부주의일 수도, 그가 빠뜨린 정보일 수도 있다. 하지만 남측 회전문으로는 병목이 있고 물이 떨어지는 상황에서, 북측 문은 유일한 대체 경로다. | 19:55 |
| 05 | d | e | 현장에 도구가 없고, 지금 당직자 판단으로는 안 되기 때문이다. | pressure_system door_status equipment_absent |
| 06 | c | e | 표기웅이 북측 문에 대해 말하지 않은 것을 확인해야 하고, 그 문이 지금 열릴 수 있는 상태인지 알아야 하기 때문이다. | 19:55 |
| 07 | d | c | 현장에 내가 도움을 줄 수 없고, 확인되지 않은 것을 명령으로 올릴 수 없기 때문이다. | 급기도 정비기사증언 당직자응답모순 |
| 08 | d | e | 지금 현장에 필요한 것은 신속한 대피 경로 확보인데, 표기웅이 직접 열 수 있는 것과 없는 것을 구분해야 한다. | 19:55_north_door_exists 19:52_pressure_structure 19:33_headcount_mismatch |
| 09 | d | e | 북측 비상 개방문은 외부 출입로로 기능할 수 있지만, 당직자가 그 실제 작동 상태나 자물쇠 여부에 답하지 않았으므로, 현장에 도구와 권한을 갖춘 선착대가 도착할 때까지 그 문의 개방을 현장 당직자에게 지시할 근거가 부족하다. | 19:55 |
| 10 | d | e | 막구조가 내려앉는 걸 막으려면 새 개구부 개방을 피해야 하는데, 지금 현장에는 그 문을 열 도구와 사람이 아직 없기 때문이다. | dome_pressure one_exit pressure_loss_risk |

**Sequence (kept calls):** `d,c,d,c,d,c,d,d,d,d`

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
