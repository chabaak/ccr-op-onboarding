# TANK-G2-screen-r2 — arm `baseline`

| field | value |
|---|---|
| call type | judgment |
| channel | C-BLOCK |
| template | v0.5 |
| model | `claude-haiku-4-5-20251001` |
| transport | anthropic |
| temperament | tank-base |
| N planned | 10 |
| N kept | 10 |

## Pre-registration

- **Hypothesis:** G2 r2는 no-block baseline에서 기본 stance a가 의미 있는 수로 살아 있고, 물방울 금지 그림·김 색 변화·빗물받이 증상을 연결한 물 반응 full key를 받은 live arm에서 stance b로 움직일 것이다. r1에서 세 gate 모두 baseline b 10/10로 포화됐으므로, r2는 gate clock을 key carriers 앞으로 옮기고 verdict rows를 ingredient rows로 낮추며 binary stance set을 세 개의 plausible readings로 넓힌 뒤 같은 reduced screen을 반복한다.
- **Drop condition:** baseline에서 default a가 0/10이면 skill §3 rule 4에 따라 broken gate다. baseline이 live 기대 stance b를 9/10 이상 고르면 saturated baseline으로 headroom 없음이다. live가 b를 6/10 이하로 고르면 movement failure이고, 7/10 또는 8/10은 n=10 boundary라 definitive result로 보지 않는다. Positive screen은 baseline a가 3/10 이상, baseline b가 1/10 이하, live b가 9/10 이상일 때만 기록한다.
- **Contingency:** baseline이 a를 전혀 고르지 않으면 gate clock 이동 뒤에도 기본 독해가 죽은 것이다.
- **Contingency:** baseline이 b에 포화되면 excerpt가 아직 key conclusion을 제공하거나 live stance wording이 너무 우세한 것이다.
- **Contingency:** baseline이 c에 많이 몰리면 added plausible reading이 default를 훔치는 것이므로 stance c wording을 다시 좁힌다.
- **Contingency:** live가 b로 충분히 움직이지 않으면 key block wording이 later carriers를 결론으로 묶지 못한 것이다.
- **Contingency:** because_block_ids가 live arm에서 제공하지 않은 block id를 꾸며내면 fabricated block id로 따로 보고한다.

## Calls (verbatim)

### 01

latency 4.695s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:52

```json
{
  "inner_note": "표지 손상과 물 접촉 후 짙어진 기체가 신호다. 적하목록 세정액과 반응이 맞지 않는다. 물금지 표지와 부식 표시가 함께 있고, 할증과 제한이 붉게 표시된 것을 먼저 봐야 한다.",
  "stance": "b",
  "because_referent": "탱크 옆면 표지에서 물방울 금지 그림과 부식 표시가 같이 손상된 채 남아 있고, 물 접촉 후 기체가 짙어지는 현장 변화가 보인다. 야간 요율표의 W/부식 조합에 붉은 점이 함께 찍혀 있다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "적하목록만 믿고 물 세척을 먼저 하면, 기체 반응이 일어나는 상황을 더 키울 수 있다. 표지 손상과 현장 변화를 무시하고 통상 절차를 따르는 것은 위험하다.",
  "utterance": "물접촉 금지. 호스 철수. 모래와 흡착재로 밸브 주변 격리. 배수 경로 차단 확인."
}
```

### 02

latency 5.05s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:52

```json
{
  "inner_note": "적하목록은 산업용 세정액이고 표지는 W·부식을 보인다. 물 접촉 금지와 부식성이 동시에 있다는 신호다. 20:52의 할증과 제한 표시는 이 조합이 단순 세정액이 아님을 확인해준다. 남기표의 재촉은 절차 믿음에서 나왔지만, 화면 정보가 그것을 벗어난다.",
  "stance": "b",
  "because_referent": "표지 두 칸 중 하나에 물결 모양 윗획이 남아 있고, 20:52 요율표에서 W/부식 조합이 할증과 제한 표시를 받았으므로, 물 접촉이 위험을 키우는 물질이다.",
  "because_block_ids": [
    "20:43",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물로 밀기는 물 접촉 금지 표지와 20:52의 제한 표시를 무시하는 선택이다. 바닥 확산 우려보다 물 반응 위험이 크다.",
  "utterance": "호스 준비. 모래 배수. 현장 밸브 주변 좁혀 흡착 시작."
}
```

### 03

latency 3.989s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:52

```json
{
  "inner_note": "물방울 금지 기호와 물 접촉 후 기체가 짙어지는 현장 변화가 함께 신호한다. 적하목록의 '산업용 세정액'과 표지의 W/부식 조합, 그리고 요율표의 붉은 점은 같은 물질을 가리킨다. 단순 세정액 희석이 아니라 물 반응성 물질로 봐야 한다.",
  "stance": "b",
  "because_referent": "물방울 금지 그림과 짙어진 김이 같은 반응을 뜻한다",
  "because_block_ids": [
    "20:43",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "세정액으로만 보고 물로 희석하면 반응이 심해질 수 있다. 물방울 금지 표지가 있는데 물줄기는 위험하다.",
  "utterance": "밸브 주변 모래 및 흡착재 배치 요청. 호스 금지. 현장 사진 확보 후 처치 재결정."
}
```

### 04

latency 3.992s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:52

```json
{
  "inner_note": "표지 두 칸이 모두 손상되었다. 남은 것은 `W`와 `부식`이다. 적하목록은 `산업용 세정액`이지만, 표지 칸에는 두 개의 위험 표시가 있다. 야간 요율표에서 `W/부식` 조합은 할증과 통행 제한이 모두 표시되어 있다. 물 접촉 후 김이 짙어졌다는 현장 변화가 있다.",
  "stance": "b",
  "because_referent": "표지 손상 상태와 야간 요율표의 위험 표시",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물줄기는 `W/부식` 조합 액체와의 접촉을 더 늘린다. 적하목록 품명만으로 표지 손상을 설명할 수 없다.",
  "utterance": "호스 물리고. 모래, 흡착재 배치 요청. 야적장 경계 확대. 남기표와 유재승은 담장 밖으로."
}
```

### 05

latency 5.291s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:52

```json
{
  "inner_note": "탱크 표지의 두 칸이 긁혀 있다는 것이 핵심이다. 적하목록은 '산업용 세정액'을 보이지만, 표지판 손상으로 원래 품목이 불명확해졌다. 물 접촉 뒤 '김이 짙어진다'는 변화는 세정액의 희석 반응이 아니라 다른 물질의 신호다. 유재승의 말과 남기표의 재촉은 통상 절차를 따르게 하려는 것이지만, 현장의 물리적 증거들이 일치하지 않는다.",
  "stance": "b",
  "because_referent": "물방울 금지 표지와 물 접촉 뒤 기체가 짙어지는 변화가 같은 신호를 가리킨다.",
  "because_block_ids": [
    "20:43",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "세정액이라는 적하목록 기록만으로 통상 절차를 따르면, 표지판의 물방울 금지 그림과 물 접촉 뒤 변화를 외면하는 것이 된다. 희석은 낮은 위험의 원칙이지만, 현장 증거가 그렇지 않을 때는 먼저 안전 쪽을 택해야 한다.",
  "utterance": "모래와 흡착재로 처치한다. 호스 금지. 재해 유해물질팀 요청."
}
```

### 06

latency 4.847s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:52

```json
{
  "stance": "b",
  "inner_note": "적하목록의 세정액 표기와 현장의 물결 기호 손상이 일치하지 않는다. 표지의 부식 기호까지 남아있다는 것은 유해물질 조합을 뜻한다. 물 접촉 후 기체가 짙어진다는 변화가 저 추정을 뒷받침한다.",
  "because_referent": "물방울 금지 기호와 짙어진 김이 가리키는 것은 물 반응성이다. 야간 요율표의 W/부식 조합과 규제 표시가 그것을 확인한다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "세정액이라는 진술을 화면 정보와 먼저 맞추려다 보면, 물로 씻는 것이 희석으로 보인다. 하지만 현장의 기체 변화는 물 접촉이 위험을 높인다는 신호다. 희석보다 차단이 맞다.",
  "utterance": "배수 차단. 모래와 흡착재로 밸브 주변을 좁힌다. 호스는 준비하되 물리지 않는다."
}
```

### 07 — DISCARDED

latency 4.89s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_referent empty; because_block_ids not an array; rejected_stance malformed or not in stance set; rejected_reason empty

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 기체가 짙어진다는 현장 변화와 표지의 물결 모양(W: 물 반응), 부식 마크가 함께 있다. 이것은 낮은 위험 통상 절차로는 볼 수 없는 신호다. 확산보다 밸브 주변 차단을 먼저 세운다.</inner_note>\n<parameter name=\"because_referent\">20:50의 출하 전표가 서해정밀이고, 20:48의 유재승 진술과 20:50 동안 시간 간격이 있으며, 20:52 요율표에 W/부식 조합에 붉은 점이 있기 때문이다.</inner_note>\n<parameter name=\"because_block_ids\">[\"20:43\", \"20:52\"]",
  "rejected_stance": "a</rejected_stance>\n<parameter name=\"rejected_reason\">물과의 반응(기체 짙어짐, W 표지)이 확인된 뒤 희석으로 진행하는 것은 현장 변화를 무시하는 것이다.",
  "utterance": "모래와 흡착재로 밸브 주변을 차단한다. 호스 준비. 배수반 요청."
}
```

### 08

latency 5.645s · stop_reason `tool_use` · schema_retries 1 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:50의 표지 불일치,20:52의 요율표 붉은 점

```json
{
  "inner_note": "적하목록 품명은 '산업용 세정액'이고 표지 W/부식이 일치한다. 그러나 탱크 옆면의 표지 두 칸이 긁혀 있어 원래 표기가 불명확하다. 물 접촉 후 짙어진 김이 발생했고, 야간 요율표에서 W/부식 조합에 붉은 점이 찍혀 있다는 것은 이 조합이 통상적이지 않음을 시사한다. 물반응성 물질이 물로 씻겨질 때 열과 기체를 발생시킬 수 있다. 현장 변화(짙어진 김)와 시스템 경고(요율표 표시)가 함께 나타났으므로, 낮은 위험의 통상 절차보다는 주의깊은 확인이 필요하다.",
  "stance": "b",
  "because_referent": "물방울 금지 표지와 물 접촉 후 짙어진 김이 함께 나타난 현장 변화가 물반응성을 시사한다.",
  "because_block_ids": [
    "20:43",
    "20:50의 표지 불일치",
    "20:52의 요율표 붉은 점"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물로 씻는 것이 낮은 위험의 통상 절차로 보이지만, 물 접촉 후 기체가 짙어지는 현장 변화와 요율표의 경고 표시가 함께 있어 물로의 희석이 위험할 수 있다.",
  "utterance": "호스 중단. 모래와 흡착재로 밸브 주변 좁혀. 차단 기준 확인 중."
}
```

### 09

latency 6.269s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:52

```json
{
  "inner_note": "화면에 뜬 적하목록은 \"산업용 세정액\"이고, 표지는 W와 부식이 따로 남아 있다. 이는 물 접촉 위험과 부식성을 함께 가리킨다. 신고자 남기표와 유재승이 일반 세정액으로 말하지만, 야간 요율표에서 W/부식 조합은 할증과 통행 제한 조건을 띄우고 있다. 물을 접촉한 뒤 기체가 짙어진다는 현장 변화가 핵심이다.",
  "stance": "b",
  "because_referent": "적하목록의 W 표지와 야간 요율표의 W/부식 조합 행이 물 접촉 금지를 나타내고, 현장에서 물 접촉 뒤 기체가 짙어진 변화가 그 위험을 입증하기 때문이다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "신고자들이 \"물로 밀면 끝난다\"고 말하고 적하목록만 보면 통상적 세정액으로 보이지만, 표지 칸의 W 기호와 현장에서 물 접촉 뒤 기체가 짙어진 반응이 물 희석을 금지하는 신호다. 낮은 위험의 통상 절차를 선호하는 기질이 있으나, 화면의 경고와 현장 변화가 일치한다면 그것을 우선한다.",
  "utterance": "모래와 흡착재로 밸브 주변 차단. 호스 준비. 현장에서 가스 농도 계측 필요하다."
}
```

### 10

latency 3.988s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:52

```json
{
  "stance": "b",
  "inner_note": "표지 손상과 물 반응 신호가 겹친다. 적하목록 \"세정액\"과 현장 표지 \"W/부식\"의 불일치가 크다. 물 접촉 후 김이 짙어진 변화를 무시할 수 없다.",
  "because_referent": "밸브 밑을 씻는 것은 확산을 초래한다. 물 반응과 할증 제한이 모두 위험 신호다.",
  "because_block_ids": [
    "20:43",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "세척장 설명과 목록이 일치해 보이지만, 표지 손상 시점과 물 접촉 후 기체 변화가 세정액만으로는 설명되지 않는다. 세척으로 확산하면 성분 파악이 늦어진다.",
  "utterance": "호스 차단. 모래와 흡착재로 밸브 주변 처리. 확산 금지."
}
```

### 11

latency 4.339s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:52

```json
{
  "stance": "b",
  "inner_note": "표지 두 칸이 긁혀 있는데 한 칸은 물결 모양 윗획만, 다른 칸은 검은 테두리만 남았다. 야간 요율표에서 W/부식 조합이 붉은 점으로 표시되어 있다. 물 접촉 뒤 기체가 짙어지는 현장 변화가 들어왔다. 이것은 단순 세정액이 아니다.",
  "because_referent": "물 반응을 일으키는 물질이 탱크에 남아 있고, 현장에서 이미 기화가 보이고 있다.",
  "because_block_ids": [
    "20:43",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물로 씻으면 반응이 더 심해진다. 현장 기체 농도가 이미 짙어졌는데 희석을 하면 접촉 면적과 증발만 늘어난다.",
  "utterance": "배수 대신 모래·흡착재로 밸브 주변 차단. 호스 물리지 않는다. 확인했다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | b | a | 탱크 옆면 표지에서 물방울 금지 그림과 부식 표시가 같이 손상된 채 남아 있고, 물 접촉 후 기체가 짙어지는 현장 변화가 보인다. 야간 요율표의 W/부식 조합에 붉은 점이 함께 찍혀 있다. | 20:43 20:45 20:52 |
| 02 | b | a | 표지 두 칸 중 하나에 물결 모양 윗획이 남아 있고, 20:52 요율표에서 W/부식 조합이 할증과 제한 표시를 받았으므로, 물 접촉이 위험을 키우는 물질이다. | 20:43 20:52 |
| 03 | b | a | 물방울 금지 그림과 짙어진 김이 같은 반응을 뜻한다 | 20:43 20:52 |
| 04 | b | a | 표지 손상 상태와 야간 요율표의 위험 표시 | 20:43 20:45 20:52 |
| 05 | b | a | 물방울 금지 표지와 물 접촉 뒤 기체가 짙어지는 변화가 같은 신호를 가리킨다. | 20:43 20:52 |
| 06 | b | a | 물방울 금지 기호와 짙어진 김이 가리키는 것은 물 반응성이다. 야간 요율표의 W/부식 조합과 규제 표시가 그것을 확인한다. | 20:43 20:45 20:52 |
| 07* | — | — | — |  |
| 08 | b | a | 물방울 금지 표지와 물 접촉 후 짙어진 김이 함께 나타난 현장 변화가 물반응성을 시사한다. | 20:43 20:50의 표지 불일치 20:52의 요율표 붉은 점 |
| 09 | b | a | 적하목록의 W 표지와 야간 요율표의 W/부식 조합 행이 물 접촉 금지를 나타내고, 현장에서 물 접촉 뒤 기체가 짙어진 변화가 그 위험을 입증하기 때문이다. | 20:43 20:45 20:52 |
| 10 | b | a | 밸브 밑을 씻는 것은 확산을 초래한다. 물 반응과 할증 제한이 모두 위험 신호다. | 20:43 20:52 |
| 11 | b | a | 물 반응을 일으키는 물질이 탱크에 남아 있고, 현장에서 이미 기화가 보이고 있다. | 20:43 20:52 |

**Sequence (kept calls):** `b,b,b,b,b,b,b,b,b,b`

**Stance coverage (sampled diagnostic):** offered `a`, `b`, `c` · unobserved in this arm: `a`, `c`

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
