# DOME-G3-cumulative-r2 — arm `k1_k2_k3`

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

latency 5.687s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "19시 55분, 표기웅이 \"도면에 있다\"고 말했을 때 자신이 그 문을 이미 열 수 없거나 열지 못한 상태였을 가능성이 높다. 만약 열 수 있었다면 이미 그렇게 했을 것이다. 2호 송풍기는 k3에서 확인된 대로 대기 상태이고, 표기웅의 말이 정확하지 않았다는 패턴이 여러 번 있었다(혼자라고 했을 때 실제로는 사람들이 남아 있었음).",
  "stance": "d",
  "because_referent": "회선을 유지하면서 확인되지 않은 것을 확정하지 않기 위해.",
  "because_block_ids": [
    "k1",
    "k3"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 그 열쇠를 실제로 가지고 있는지, 혹은 열 수 있는 상태인지 확인되지 않았다. 19시 55분 \"도면에 있다\"는 답변은 자신이 그 문을 열 수 없음을 암시한다. 표기웅의 정보 정확성도 의심된다(k1). 확인되지 않은 전제로 행동할 수 없다.",
  "utterance": "선착대가 현장 도착할 때까지 기다리면서 표기웅과의 회선은 계속 유지하겠습니다. 북측 문은 도면에 있다고 확인됐으므로, 현장 조성원이 도착하면 그들이 맡기겠습니다."
}
```

### 02

latency 6.397s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "회선 너머 사람이 자신에게 불리한 것을 빼고 말할 수 있다는 것을 다시 본다. 표기웅은 '혼자'라고 했지만 관중석에는 아이들과 인솔자가 남아 있었다. 그가 '정리 중'이라고 한 것만으로는 충분하지 않다. 지금 남은 사람들이 어디 있고 몇 명인지, 북측 문이 정말 열릴 수 있는지, 그 문을 열기 위해 무엇이 필요한지 — 내가 모르는 것이 너무 많다.",
  "stance": "c",
  "because_referent": "표기웅이 도면에 북측 비상 개방문이 있다고만 했는데, 그 문을 열 수 있는 상태인지, 어떻게 열어야 하는지, 현재 그곳이 막혀 있지는 않은지 직접 확인한 적이 없기 때문이다. 지금 압력이 떨어지고 있는 상황에서 대체 경로를 찾는 것이 시간을 쓸 가치 있는 일이다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "a",
  "rejected_reason": "회전문 앞에 줄이 섰고 줄이 줄지 않으며, 관중석의 인원과 코트의 인원이 맞지 않는 상황에서 열려 있는 통로 하나만 쓰는 것은 시간을 낭비하는 판단이다. 이미 자재 반입 슬리브 같은 대체 경로가 존재함을 알고 있다.",
  "utterance": "표기웅에게 북측 비상 개방문이 현재 열 수 있는 상태인지, 자물쇠는 어디에 있는지, 문 앞에 장애물은 없는지 확인하겠습니다. 지금 당장."
}
```

### 03

latency 5.592s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "도면에만 있고 당직자가 즉시 조작할 수 있는 북측 문의 상태를 모른다. 송풍기 재가동과 추가 통로 확보는 동시에 진행할 수 있는데, k3의 정보는 현장에서 누구든 할 수 있는 행동이고, 표기웅은 이미 도면을 확인했으므로 북측 문으로 안내할 수 있다. 지금 확인되지 않은 것을 전제로 움직일 수 없다.",
  "stance": "b",
  "because_referent": "당직자 표기웅에게. 혼자라고 한 게 거짓이었고, 급기 상태도 정확히 말하지 않았으며, 북측 문에 대해서도 도면에만 있다고 한 것이 전부다. 지금 북측 문의 실제 개폐 상태나 자물쇠 위치를 모른다.",
  "because_block_ids": [
    "k1",
    "k3"
  ],
  "rejected_stance": "c",
  "rejected_reason": "당직자가 북측 문을 열 수 있는지, 열려 있는지, 자물쇠가 어디 있는지 확인하지 않은 상태에서 즉시 열게 할 수 없다. 도면에 있다는 것만으로는 현장의 실제 상태를 알 수 없다.",
  "utterance": "표기웅, 배전반 B 3번 차단기를 올려서 2호 송풍기를 돌려줄 수 있겠습니까. 동시에 북측 비상 개방문의 실제 상태를 확인해달라 — 자물쇠가 있는지, 지금 열 수 있는지 보고해주십시오."
}
```

### 04

latency 6.783s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 19:52,19:55

```json
{
  "inner_note": "막구조 건물에서 지붕 강도는 송풍기가 유지하는 내압에 달렸다. 한 대는 이미 작동 중단되어 있고, 도면상 비상 개방문이 있다는 것이 알려졌다. 당직자가 혼자라고 말했으나 실제로는 사람이 남아 있었고, 회전문 통로로는 수용할 수 없는 흐름이 생기고 있다. 지금 남은 통로를 고수하면 병목이 심해질 것이고, 큰 개구부를 무분별하게 열면 압력이 빠져 구조물이 무너질 수 있다. 비상 개방문의 존재와 현재 상황 사이에서, 내가 할 수 있는 것과 현장이 할 수 있는 것을 나눔이 필요하다.",
  "stance": "d",
  "because_referent": "지붕이 내압으로 유지되고 있고, 비상 개방문이 도면상에만 있는 상태이며, 현장에는 아직 구조대가 없기 때문이다.",
  "because_block_ids": [
    "19:52",
    "19:55"
  ],
  "rejected_stance": "e",
  "rejected_reason": "당직자가 비상 개방문에 대해 진술한 것은 도면상의 존재뿐이고, 열쇠의 위치나 접근성에 대해서는 확인되지 않았으며, 당직자의 진술 신뢰도가 이미 의문의 여지가 있다.",
  "utterance": "19:55 현황입니다. 북측 비상 개방문이 도면상에 있다는 것만 확인됐습니다. 당신들이 현장에 닿는 시점에 그 문의 위치 확인과 개방을 당신들에게 맡기겠습니다. 지금은 회전문 통로를 유지하고, 당직자에게 다른 출입 경로가 더 있는지 다시 묻겠습니다."
}
```

### 05

latency 6.324s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "확인되지 않은 것을 내 임의로 단정하면 안 된다. 표기웅이 말한 것들—혼자 있다, 급기 한 대는 원래 안 돈다, 북측 문이 도면에 있다—이 모두 불완전하거나 모순되었다. 정보는 회선 저쪽에서 건넬 때까지만 사실이다. 시간은 흐르지만, 잘못된 판단은 돌이킬 수 없다.",
  "stance": "d",
  "because_referent": "현장에는 갈 수 없고, 당직자의 말은 이미 여러 번 맞지 않았으므로, 그를 추가로 판단의 근거로 삼을 수 없다. 북측 문을 여는 데 필요한 것이 무엇인지, 표기웅이 그걸 할 수 있는지 확인하지 않은 채 명령하면 결과를 책임질 수 없다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 혼자라고 말했을 때 실제로는 관중석에 아이들이 남아 있었고, 급기 상태도 잘못 말했다. 그의 말을 근거로 다음 행동을 결정할 수 없다. 열쇠가 그의 주머니에 있다는 것도, 그가 그 문을 열 수 있다는 것도 확인되지 않았다.",
  "utterance": "북측 비상 개방문이 도면에 있다는 것까지는 들었습니다. 그 문을 여는 데 무엇이 필요한지, 당직자가 그걸 지금 할 수 있는지는 아직 모릅니다. 지시부를 통해 선착대 도착 예정을 확인하고, 그들이 현장에 닿으면 그 문을 맡기겠습니다."
}
```

### 06

latency 5.669s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "정기점검이 2년 빠졌고, 급기 한 대는 이미 꺼져 있었다. 지붕을 떠받치는 압력이 빠지면 막이 내려온다. 한내돔 안에 아이들이 있고 줄이 줄지 않는다. 비상 개방문이 도면에만 있고, 표기웅은 그것을 어떻게 여는지 말하지 않았다. 선착대가 올 때까지 기다리면 더 많은 사람이 갇혀 있을 시간이 길어진다.",
  "stance": "c",
  "because_referent": "당직자 표기웅에게, 도면상 있다고 했던 북측 비상 개방문이 실제로는 열 수 있는 상태인지, 지금 확인하고 열 수 있다면 즉시 열도록 해야 한다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅의 주머니에 열쇠가 있다는 것은 확인되지 않은 추측이다. 도면에 있다는 것과 실제로 열 수 있는 상태라는 것은 다르다. 그가 먼저 확인하고 말해야 한다.",
  "utterance": "당직자님, 도면에 있다는 북측 비상 개방문이 지금 현장에서 보이는지, 그리고 그것을 열 수 있는 상태인지 확인해 주시겠어요. 확인되면 즉시 열어 주세요."
}
```

### 07

latency 7.439s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 막구조-압력,개구부-붕괴위험,선착대-미도착

```json
{
  "inner_note": "막구조 건물 내부 압력이 지붕을 지탱하고 있으며, 큰 개구부를 열면 붕괴 위험이 있다. 현재 회전문 한 곳으로만 통제된 배출 중이고, 관중석에 아이들과 인솔자가 남아 있다. 비상개방문의 존재는 확인되었으나 그 상태나 접근성에 대해서는 아직 확인되지 않았다. k2로 보아 다른 경로도 있을 수 있다.",
  "stance": "d",
  "because_referent": "현장에 아직 도착하지 않은 선착대가 북측 비상문 개방에 필요한 도구와 판단을 담당하게 하는 것이 가장 안전하다. 막구조의 압력 붕괴 위험을 고려할 때, 당직자의 판단에만 의존한 조치는 추가 위험을 만들 수 있다.",
  "because_block_ids": [
    "막구조-압력",
    "개구부-붕괴위험",
    "선착대-미도착"
  ],
  "rejected_stance": "e",
  "rejected_reason": "표기웅이 북측 문에 대해 도면상 존재 외에는 말하지 않았다. 자물쇠 위치, 열쇠 소재, 문의 현재 상태를 확인하지 않은 채 그를 그곳으로 보내는 것은 미확인된 것을 확정된 것처럼 행동하는 것이다. 또한 당직자가 혼자 대응하다 추가 위험에 처할 수 있다.",
  "utterance": "북측 비상개방문을 통한 추가 배출 경로 확보는 필요하지만, 그 문의 자물쇠, 열쇠, 현재 접근성에 대해 아직 확인된 게 없습니다. 당직자의 도면 확인만으로는 부족합니다. 선착대가 도착하면 현장 상황을 직접 보고 판단하며 필요한 도구를 가지고 대응하게 하겠습니다. 지금은 회전문 통로 유지와 관중석 인원 상황 재확인에 집중합니다."
}
```

### 08

latency 6.716s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "막구조 건물에서 내압 유지의 핵심인 급기 송풍기 하나가 멈춰 있고, 표기웅의 초기 보고와 현장 상황이 맞지 않으며, 북측 비상문이 도면상 존재하나 당직자가 그것의 상태를 구체적으로 설명하지 못했다. 회전문 한 곳으로만 내보내기에는 남은 인원 규모가 불명확하고 시간이 흐르고 있다.",
  "stance": "d",
  "because_referent": "북측 문은 도면에 있으나 당직자가 도움을 청할 상황이 아닌 데도 구체적인 상태를 말하지 않았고, 현장 상황(물 흐름, 조명 차단, 통로 혼잡)이 악화하고 있으므로, 현장에 도착할 때까지 당직자가 할 수 있는 최선의 준비는 그 문의 위치를 확인해 두는 것이고, 장비 없이 자물�를 따거나 문을 무리하게 열게 하는 것은 판단 누락을 초래한다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "b",
  "rejected_reason": "송풍기를 당직자가 돌리도록 하는 것은, 그것이 고장이 아니라는 확증 없이 중요한 시스템에 관여하게 하는 것이고, 더 중요하게는 내압 구조의 특성상 개구부 개방 없이 송풍기만 돌려서는 안 된다는 전 기사의 설명과 배치되며, 현장 상황을 더 악화시킬 수 있다.",
  "utterance": "표기웅, 북측 비상 개방문이 정확히 어디에 있습니까. 사진을 찍어 보낼 수 있습니까."
}
```

### 09 — DISCARDED

latency 10.059s · stop_reason `max_tokens` · schema_retries 0 · foreign_tool_uses 0

problems: stop_reason=max_tokens; because_referent empty; because_block_ids not an array; utterance empty; rejected_stance malformed or not in stance set; rejected_reason empty

```json
{
  "inner_note": "k1이 결정적이다. 표기웅은 18:38에 자신이 혼자라고 명백히 말했는데, 실제로는 관중석에 아이들과 인솔자가 남아 있었다. 이는 회선 저쪽 사람이 자기에게 불리한 것을 빼고 말할 수 있다는 내 [결함]을 환기한다. \n\n현 상황: 남측 회전문 앞에 줄이 섰고, 막구조 지붕을 떠받치는 내부 기압이 약해지고 있으며(조명 절반 꺼짐, 천장 처짐), 확인되지 않은 인원이 남아 있다. 내가 확실히 아는 것은 도면상 북측 비상 개방문이 존재한다는 것뿐이다.\n\na는 최악이다. 하나의 회전문으로만 내보내면서 다른 통로를 건드리지 않으면, 현재 상황에서 k1의 사실(확인되지 않은 인원)을 외면하는 것이다.\n\nb는 위험하다. 당직자에게 송풍기를 \"지금\" 돌리게 하면, 그것이 고장이 아니고 과거에 일부러 꺼둔 것일 가능성이 있고, 돌려도 효과가 있는지 불명확하다. 시간 낭비.\n\nc는 너무 섣부르다. 표기웅이 \"말하지 않은 것\"을 추측해서 명령하면, 나는 스스로 확인되지 않은 것을 확정된 것처럼 다루게 된다. 내 [우선순위] 2)에 위배.\n\ne는 최악의 도박이다. \"자물쇠 열쇠가 주머니에 있다\"는 전제 자체가 확인되지 않은 것이고, 혼자라고 거짓말한 사람에게 즉시 그것을 하라고 명령하는 것은 판단이 아니라 도박이다.\n\nd가 남는다. 북측 문의 존재는 확인됐다(도면). 그것을 여는 데 필요한 도구는 현장에 없을 가능성이 높다(당직자가 언급하지 않음). 선착대가 닿으면 그들이 상황을 직접 보고 판단할 것이다. 이는 나의 기질과 맞다: 확인되지 않은 것을 스스로 단정하지 않고, 내 권한이 청취와 조회와 요청뿐이라는 것을 알고, 현장에 갈 수 없다는 제약 안에서 다음 단계를 준비하는 것.",
  "stance": "d"
}
```

### 10

latency 6.196s · stop_reason `tool_use` · schema_retries 1 · foreign_tool_uses 0

problems: because_block_ids unknown: pressure_critical,unknown_door_state

```json
{
  "inner_note": "지금 당직자는 상황을 완전히 파악하지 못했다. 혼자라고 했다가 나중에 정리 중이라고 말을 바꿨고, 급기도 한 대는 안 돈다고 뒤늦게 드러났다. 북측 문은 도면에 있다고만 했지, 열 수 있는 상태인지, 자물쇠는 어디에 있는지 아무것도 확인되지 않았다. 지붕은 내부 기압으로만 떠 있고, 큰 개구부를 열면 기압이 빠져 막이 내려온다는 것이 가장 중요한 물리적 사실이다.",
  "stance": "d",
  "because_referent": "막구조 건물에서는 출입구를 열 때 기압이 빠지는 것이 생명을 가르는 변수인데, 북측 문의 현장 상태를 아직 아무도 확인하지 못했기 때문이다.",
  "because_block_ids": [
    "pressure_critical",
    "unknown_door_state"
  ],
  "rejected_stance": "e",
  "rejected_reason": "당직자가 북측 문에 대해 말한 것은 '도면에 있다'는 것뿐이다. 자물쇠가 표기웅의 주머니에 있다는 것은 나의 추정이지, 그가 말한 것이 아니다. 확인되지 않은 것을 전제로 사람을 보낼 수 없다.",
  "utterance": "남은 시간에 북측 비상 개방문을 열기 위한 준비를 한다. 현장 상태를 먼저 확인해야 하고, 문을 열 때 기압이 빠지는 것을 통제할 수 있을 때까지 대기한다."
}
```

### 11

latency 6.435s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "확인되지 않은 것을 단정할 수 없다. 표기웅은 혼자라고 했으나 k1에서 아이들과 인솔자가 남아 있었고, 급기도 하나가 안 돈다고 했으나 k3에서 그것이 고장이 아니었다. 회선 저쪽이 자신에게 불리한 것을 말하지 않을 수 있다는 것을 다시 상기한다. 문세라의 증언으로 회전문 한 곳은 여전히 접근성이 제약되어 있고, k2의 슬리브 탈출을 보면 사람들이 다른 출구를 찾고 있다는 신호다. 시간이 흐르고 있다.",
  "stance": "c",
  "because_referent": "표기웅이 19:55에 '도면에 있다'고만 답했는데, 실제 문의 위치, 잠금 상태, 열 수 있는 방법에 대해서는 아무것도 말하지 않았다. 그가 당직 중 알아야 할 시설이 열려 있지 않은 상태라면, 그것을 열 수 있는 사람은 그뿐이고, 지금이 가장 빠른 시점이다.",
  "because_block_ids": [
    "k1",
    "k2"
  ],
  "rejected_stance": "a",
  "rejected_reason": "한 곳으로만 내보내는 것은 문세라가 보고한 '줄이 줄지 않는' 상황을 방치하는 것이다. k2에서 사람들이 이미 다른 출구를 통해 탈출을 시도하고 있다는 것이 명백하다.",
  "utterance": "표기웅에게 즉시 북측 비상 개방문이 실제로 열 수 있는 상태인지, 어떻게 여는지 확인하겠습니다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | d | e | 회선을 유지하면서 확인되지 않은 것을 확정하지 않기 위해. | k1 k3 |
| 02 | c | a | 표기웅이 도면에 북측 비상 개방문이 있다고만 했는데, 그 문을 열 수 있는 상태인지, 어떻게 열어야 하는지, 현재 그곳이 막혀 있지는 않은지 직접 확인한 적이 없기 때문이다. 지금 압력이 떨어지고 있는 상황에서 대체 경로를 찾는 것이 시간을 쓸 가치 있는 일이다. | k1 k2 |
| 03 | b | c | 당직자 표기웅에게. 혼자라고 한 게 거짓이었고, 급기 상태도 정확히 말하지 않았으며, 북측 문에 대해서도 도면에만 있다고 한 것이 전부다. 지금 북측 문의 실제 개폐 상태나 자물쇠 위치를 모른다. | k1 k3 |
| 04 | d | e | 지붕이 내압으로 유지되고 있고, 비상 개방문이 도면상에만 있는 상태이며, 현장에는 아직 구조대가 없기 때문이다. | 19:52 19:55 |
| 05 | d | e | 현장에는 갈 수 없고, 당직자의 말은 이미 여러 번 맞지 않았으므로, 그를 추가로 판단의 근거로 삼을 수 없다. 북측 문을 여는 데 필요한 것이 무엇인지, 표기웅이 그걸 할 수 있는지 확인하지 않은 채 명령하면 결과를 책임질 수 없다. | k1 k2 |
| 06 | c | e | 당직자 표기웅에게, 도면상 있다고 했던 북측 비상 개방문이 실제로는 열 수 있는 상태인지, 지금 확인하고 열 수 있다면 즉시 열도록 해야 한다. | k1 k2 |
| 07 | d | e | 현장에 아직 도착하지 않은 선착대가 북측 비상문 개방에 필요한 도구와 판단을 담당하게 하는 것이 가장 안전하다. 막구조의 압력 붕괴 위험을 고려할 때, 당직자의 판단에만 의존한 조치는 추가 위험을 만들 수 있다. | 막구조-압력 개구부-붕괴위험 선착대-미도착 |
| 08 | d | b | 북측 문은 도면에 있으나 당직자가 도움을 청할 상황이 아닌 데도 구체적인 상태를 말하지 않았고, 현장 상황(물 흐름, 조명 차단, 통로 혼잡)이 악화하고 있으므로, 현장에 도착할 때까지 당직자가 할 수 있는 최선의 준비는 그 문의 위치를 확인해 두는 것이고, 장비 없이 자물�를 따거나 문을 무리하게 열게 하는 것은 판단 누락을 초래한다. | k1 k2 |
| 09* | — | — | — |  |
| 10 | d | e | 막구조 건물에서는 출입구를 열 때 기압이 빠지는 것이 생명을 가르는 변수인데, 북측 문의 현장 상태를 아직 아무도 확인하지 못했기 때문이다. | pressure_critical unknown_door_state |
| 11 | c | a | 표기웅이 19:55에 '도면에 있다'고만 답했는데, 실제 문의 위치, 잠금 상태, 열 수 있는 방법에 대해서는 아무것도 말하지 않았다. 그가 당직 중 알아야 할 시설이 열려 있지 않은 상태라면, 그것을 열 수 있는 사람은 그뿐이고, 지금이 가장 빠른 시점이다. | k1 k2 |

**Sequence (kept calls):** `d,c,b,d,d,c,d,d,d,c`

**Stance coverage (sampled diagnostic):** offered `a`, `b`, `c`, `d`, `e` · unobserved in this arm: `a`, `e`

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
