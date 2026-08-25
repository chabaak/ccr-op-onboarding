# TANK-G2-screen-r3 — arm `baseline`

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

- **Hypothesis:** G2 r3는 no-block baseline에서 default stance a가 살아 있고, 확인되지 않은 반응성 화물이라는 belief를 뒷받침하는 full key를 받은 live arm에서 stance b로 움직일 것이다. r2 결과는 label이 carrier evidence를 직접 이름 붙인 결함을 보였으므로, r3는 stance text를 belief-only grammar로 바꾸고 clock/excerpt 구조는 유지한다.
- **Drop condition:** baseline에서 default a가 0/10이면 skill §3 rule 4에 따라 broken gate다. baseline이 live 기대 stance b를 9/10 이상 고르면 saturated baseline으로 headroom 없음이다. live가 b를 6/10 이하로 고르면 movement failure이고, 7/10 또는 8/10은 n=10 boundary라 definitive result로 보지 않는다. Positive screen은 baseline a가 3/10 이상, baseline b가 1/10 이하, live b가 9/10 이상일 때만 기록한다; 단 baseline b 0/10에서 live b 7/10 이상은 movement evidence로 따로 보고한다.
- **Contingency:** baseline이 a를 전혀 고르지 않으면 belief-only rewrite 뒤에도 기본 독해가 죽은 것이다.
- **Contingency:** baseline이 b에 포화되면 stance b가 여전히 evidence 없이 너무 우세하거나 excerpt가 결론을 제공하는 것이다.
- **Contingency:** baseline이 c에 많이 몰리면 added plausible reading이 default를 훔치는 것이므로 stance c wording을 다시 좁힌다.
- **Contingency:** live가 b로 충분히 움직이지 않으면 key block wording이 belief를 충분히 지지하지 못한 것이다.
- **Contingency:** because_block_ids가 live arm에서 제공하지 않은 block id를 꾸며내면 fabricated block id로 따로 보고한다.

## Calls (verbatim)

### 01

latency 6.589s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43 탱크 옆면 표지,20:52 야간 요율표

```json
{
  "stance": "b",
  "inner_note": "표지 두 칸이 긁혀 있고 물결 모양과 부식 기호가 남아 있다. 적하목록은 세정액이지만, 표지는 물 반응성(W)과 부식성을 동시에 나타낸다. 유재승의 \"물로 밀면 끝\"이라는 말과 남기표의 \"씻기면 된다\"는 촉촉이 일관되어 보이지만, 두 표지 기호가 함께 남아 있다는 것은 단순 세정액이 아닐 가능성을 가리킨다. 출하 전표와 야간 요율표의 `W/부식` 조합 행에 붉은 점이 찍혀 있다는 것은 통상 절차를 벗어난 신호다. 확인되지 않은 반응성이 있는 상황에서 물을 먼저 대는 것은 위험하다.",
  "because_referent": "표지 두 칸에 물결 모양 윗획과 검은 테두리(부식 기호)가 남아 있고, 야간 요율표의 W/부식 조합 행이 붉은 점으로 제한을 표시하고 있다.",
  "because_block_ids": [
    "20:43 탱크 옆면 표지",
    "20:52 야간 요율표"
  ],
  "rejected_stance": "a",
  "rejected_reason": "적하목록과 신고자 진술이 일관되어 보이지만, 물리적 표지(W와 부식 기호)와 요율표의 제한 신호가 이를 뒷받침하지 않는다. 단순 세정액이라는 가정 아래 물을 대는 것은 반응성 화물에 대한 과신이다.",
  "utterance": "마른 재료로 밸브 둘레를 차단한다. 탱크 표지의 부식 기호 확인. 물 접촉 금지. 배수반 대기."
}
```

### 02

latency 5.777s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 접수_화면_표지칸_W와_부식,야간_요율표_W부식_조합_붉은점,탱크_표지_두칸_긁혀있음

```json
{
  "inner_note": "적하목록 '산업용 세정액'과 표지 '부식'이 맞지 않는다. 물 접촉 뒤 기체가 짙어진다는 현장 변화가 경고다. 적하목록만 믿기엔 표지 손상이 크고, 현장이 말하는 것과 화면이 다르다.",
  "stance": "b",
  "because_referent": "탱크 표지 두 칸이 긁혀 있고, 한 칸의 물결 모양과 다른 칸의 부식 기호만 남아 있다는 것은 원래 표시가 더 많았다는 뜻이다. 적하목록의 '세정액'과 표지의 '부식' 조합이 일치하지 않으며, 야간 요율표에서 'W/부식' 칸에 붉은 점이 찍혀 있다.",
  "because_block_ids": [
    "접수_화면_표지칸_W와_부식",
    "야간_요율표_W부식_조합_붉은점",
    "탱크_표지_두칸_긁혀있음"
  ],
  "rejected_stance": "a",
  "rejected_reason": "신고자와 운송사 모두 '세정액'과 '물로 씻기'를 강조하지만, 표지 손상으로 원래 표시를 확인할 수 없고, 적하목록만으로는 물 접촉 뒤 기체 변화를 설명할 수 없다. 확인되지 않은 반응성을 먼저 배제할 근거가 부족하다.",
  "utterance": "물 처치 대기. 건조 격리 진행한다. 표지 사진과 잔여 누출량 확인 요청."
}
```

### 03

latency 4.478s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:52

```json
{
  "inner_note": "표지가 물에 반응한 흔적이다. 물결은 물 위험, 검은 테두리는 부식 위험이었다. 표지 손상 자체가 화물 반응성의 증거다. 세정액이 맞다면 물 접촉 표지가 왜 남아 있는가.",
  "stance": "b",
  "because_referent": "탱크 옆면 표지가 물에 반응한 흔적을 남기고 있다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "신고자와 기사의 증언은 문서상 품명만 맞춘 것이고, 현장 표지 손상이 물 반응을 가리킨다. 물로 처치하면 반응이 심해질 수 있다.",
  "utterance": "야적장 배수 확인. 마른 흡수재 배치. 물 금지. 반응성 화물 가능."
}
```

### 04

latency 4.821s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: sign_damage,hazard_code_w_and_corrosive,vapor_darkening

```json
{
  "stance": "b",
  "inner_note": "문서 표기가 손상됐고, 물 접촉 뒤 기체가 짙어지는 현장 변화가 보고됐다. 반응성 물질일 가능성이 있다.",
  "because_referent": "탱크 표지 두 칸이 긁혀 있고, 한 칸에는 물결 모양 윗획만, 다른 칸에는 검은 테두리만 남아 있다. 적하목록 행에는 W와 부식이 따로 표시돼 있다.",
  "because_block_ids": [
    "sign_damage",
    "hazard_code_w_and_corrosive",
    "vapor_darkening"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물로 희석하라는 진술과 문서는 있지만, 표지 손상으로 실제 물질이 무엇인지 확인되지 않았다. 물 접촉 뒤 기체가 짙어진다는 현장 변화는 반응성을 시사한다. 문서상 세정액이라는 판단만으로는 물 처치를 책임질 수 없다.",
  "utterance": "밸브 둘레를 드라이재로 격리한다. 물 사용 금지. 반응성 확인 대기."
}
```

### 05

latency 4.043s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:52

```json
{
  "inner_note": "적하목록은 세정액이나 표지는 W와 부식이 남아 있다. 물 접촉 후 기체가 짙어질 수 있다는 신호다. 희석 전에 무엇인지 명확히 해야 한다.",
  "stance": "b",
  "because_referent": "탱크 표지의 물결과 부식 기호가 문서와 맞지 않으면, 문서를 먼저 믿되 현장 변화를 무시할 수 없다",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물 접촉 후 기체 변화가 있을 수 있는데 희석부터 하면 반응성 화물이라면 상황이 악화된다",
  "utterance": "배수 차단. 마른 재료로 밸브 둘레 좁혀. 현장에서 표지 상태 다시 확인한다."
}
```

### 06

latency 4.764s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:52

```json
{
  "inner_note": "적하목록은 세정액이지만, 탱크 표지는 긁혀서 반응성을 나타내는 부호까지 남아 있다. 물 접촉 뒤 기체가 짙어질 수 있다는 신호다. 희석이 맞다고 믿기엔 위험이 크다.",
  "stance": "b",
  "because_referent": "탱크 옆면에 남은 부식 표지와 야간 요율표의 W/부식 할증·제한 표시는 반응성 물질을 가리킨다. 문서와 현장이 맞지 않는다.",
  "because_block_ids": [
    "20:43",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "적하목록만 믿고 물을 쓰면, 반응성 화물이 물과 만날 때 기체 발생을 막을 수 없다. 현장 표지와 시스템이 경고하는데 무시할 수 없다.",
  "utterance": "마른 흡수재로 밸브 둘레를 좁혀라. 물 접촉은 금지다. 정원에 마스크 착용 지시를 내렸다."
}
```

### 07

latency 5.34s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:50

```json
{
  "inner_note": "문서와 현장이 맞지 않는다. 적하목록은 세정액이지만 표지는 부식성과 물반응을 모두 보인다. 물 접촉 뒤 기체가 짙어진다는 말은 아직 없지만, 부식 표지가 남아 있다는 것은 물로 희석하는 처치가 위험할 수 있다는 신호다. 지금 내가 할 수 있는 일은 물을 대지 않고 상황을 더 명확히 하는 것이다.",
  "stance": "b",
  "because_referent": "표지 손상으로 실제 물질을 확인할 수 없고, 부식성 표시가 남아 있으며, 출하 기록과 신고자 진술이 일치하지 않는다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:50"
  ],
  "rejected_stance": "a",
  "rejected_reason": "문서만 믿고 물을 대면, 부식성 물질일 경우 반응이 심해질 수 있다. 표지 손상으로 실제 내용물을 확인할 수 없는 상태에서 희석 처치는 위험하다.",
  "utterance": "밸브 둘레 마른 처치로 전환한다. 유재승에게 물질 확인 서류 재조회 요청. 배수반 대기 상태로 유지."
}
```

### 08

latency 4.21s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:52

```json
{
  "stance": "b",
  "inner_note": "적하목록의 세정액과 현장 표지가 맞지 않는다. 물결과 부식 표지가 모두 긁혀 있고, 할증과 제한이 붉은 점으로 표시되어 있다. 물 접촉 후 반응이 생길 가능성을 배제할 수 없다.",
  "because_referent": "탱크 옆면의 물결 모양과 부식 표지가 둘 다 남아 있으며, 야간 요율표의 W/부식 조합이 제한 대상으로 표시되어 있다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "현장 표지와 서류의 일치를 먼저 확인해야 한다. 적하목록만으로는 표지 손상 상태를 설명할 수 없고, 확인되지 않은 반응성을 물로 대면 악화될 수 있다.",
  "utterance": "밸브 주변 건식 격리 착수. 물 대지 말고 마른 흡수재로 확산 차단한다."
}
```

### 09

latency 4.385s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 표지_손상,기체_농도_변화,반응성_의심

```json
{
  "stance": "b",
  "inner_note": "표지 손상으로 품명과 표지 정보가 불일치한다. 물 접촉 후 기체가 짙어지는 현장 변화가 물과의 반응성을 시사한다. 문서상 세정액이라는 정보만으로는 물 희석의 안전성을 확인할 수 없다.",
  "because_referent": "탱크 옆면 표지 손상으로 실제 화물의 위험성을 판단할 수 없고, 물 접촉 후 기체 농도 변화가 물과의 반응 가능성을 나타낸다.",
  "because_block_ids": [
    "표지_손상",
    "기체_농도_변화",
    "반응성_의심"
  ],
  "rejected_stance": "a",
  "rejected_reason": "문서상 품명만으로 물 희석의 안전성을 보장할 수 없다. 표지 손상과 기체 변화는 문서 정보와 현장이 불일치함을 시사한다. 확인되지 않은 반응성에 물을 먼저 대면 상황을 악화시킬 수 있다.",
  "utterance": "마른 재료로 밸브 둘레 차단. 현장 정보 재확인 중."
}
```

### 10

latency 5.312s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:52

```json
{
  "stance": "b",
  "inner_note": "적하목록은 산업용 세정액이지만, 표지 두 칸의 손상으로 실제 화물의 위험 특성이 불명확하다. 물 접촉 뒤 기체가 짙어진다면 수산화반응이 있는 물질일 가능성이 크다. 유재승의 진술과 남기표의 독촉에도 불구하고, 표지 손상과 야간 요율표의 W/부식 할증 붉은 점은 무시할 수 없는 신호다.",
  "because_referent": "탱크 옆면 표지가 물결 모양과 부식 기호로 손상되어 있고, 야간 요율표에서 W/부식 조합에 할증과 통행 제한이 표시되어 있다.",
  "because_block_ids": [
    "20:43",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "문서상 품명이 세정액이고 현장 진술이 일관되더라도, 표지 손상으로 실제 화물의 반응성을 확인할 수 없다. 물을 먼저 대면 예측 불가능한 반응이 일어날 수 있으므로, 확인 없이 희석 처치를 진행할 수 없다.",
  "utterance": "아직 표지가 손상되어 화물 특성이 불명확하다. 물 금지. 마른 재료로 누출 범위를 좁혀라. 확인 중이다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | b | a | 표지 두 칸에 물결 모양 윗획과 검은 테두리(부식 기호)가 남아 있고, 야간 요율표의 W/부식 조합 행이 붉은 점으로 제한을 표시하고 있다. | 20:43 탱크 옆면 표지 20:52 야간 요율표 |
| 02 | b | a | 탱크 표지 두 칸이 긁혀 있고, 한 칸의 물결 모양과 다른 칸의 부식 기호만 남아 있다는 것은 원래 표시가 더 많았다는 뜻이다. 적하목록의 '세정액'과 표지의 '부식' 조합이 일치하지 않으며, 야간 요율표에서 'W/부식' 칸에 붉은 점이 찍혀 있다. | 접수_화면_표지칸_W와_부식 야간_요율표_W부식_조합_붉은점 탱크_표지_두칸_긁혀있음 |
| 03 | b | a | 탱크 옆면 표지가 물에 반응한 흔적을 남기고 있다. | 20:43 20:45 20:52 |
| 04 | b | a | 탱크 표지 두 칸이 긁혀 있고, 한 칸에는 물결 모양 윗획만, 다른 칸에는 검은 테두리만 남아 있다. 적하목록 행에는 W와 부식이 따로 표시돼 있다. | sign_damage hazard_code_w_and_corrosive vapor_darkening |
| 05 | b | a | 탱크 표지의 물결과 부식 기호가 문서와 맞지 않으면, 문서를 먼저 믿되 현장 변화를 무시할 수 없다 | 20:43 20:45 20:52 |
| 06 | b | a | 탱크 옆면에 남은 부식 표지와 야간 요율표의 W/부식 할증·제한 표시는 반응성 물질을 가리킨다. 문서와 현장이 맞지 않는다. | 20:43 20:52 |
| 07 | b | a | 표지 손상으로 실제 물질을 확인할 수 없고, 부식성 표시가 남아 있으며, 출하 기록과 신고자 진술이 일치하지 않는다. | 20:43 20:45 20:50 |
| 08 | b | a | 탱크 옆면의 물결 모양과 부식 표지가 둘 다 남아 있으며, 야간 요율표의 W/부식 조합이 제한 대상으로 표시되어 있다. | 20:43 20:45 20:52 |
| 09 | b | a | 탱크 옆면 표지 손상으로 실제 화물의 위험성을 판단할 수 없고, 물 접촉 후 기체 농도 변화가 물과의 반응 가능성을 나타낸다. | 표지_손상 기체_농도_변화 반응성_의심 |
| 10 | b | a | 탱크 옆면 표지가 물결 모양과 부식 기호로 손상되어 있고, 야간 요율표에서 W/부식 조합에 할증과 통행 제한이 표시되어 있다. | 20:43 20:52 |

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
