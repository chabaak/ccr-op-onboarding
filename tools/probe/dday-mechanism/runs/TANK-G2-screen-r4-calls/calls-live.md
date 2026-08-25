# TANK-G2-screen-r4 — arm `live`

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

- **Hypothesis:** G2 r4는 no-block baseline에서 default stance a가 살아 있고, 문서 품명으로 설명되지 않는 화물이라는 belief를 뒷받침하는 full key를 받은 live arm에서 stance b로 움직일 것이다. r3 결과는 evidence-free label 뒤에도 default action 자체가 under-protective하게 읽히는 결함을 보였으므로, r4는 default를 manifest-based protective standard로 바꾸고 clock/excerpt 구조는 유지한다.
- **Drop condition:** baseline에서 default a가 0/10이면 skill §3 rule 4에 따라 broken gate다. baseline이 live 기대 stance b를 9/10 이상 고르면 saturated baseline으로 headroom 없음이다. live가 b를 6/10 이하로 고르면 movement failure이고, 7/10 또는 8/10은 n=10 boundary라 definitive result로 보지 않는다. Positive screen은 baseline a가 3/10 이상, baseline b가 1/10 이하, live b가 9/10 이상일 때만 기록한다.
- **Contingency:** baseline이 a를 전혀 고르지 않으면 protective-standard rewrite 뒤에도 기본 독해가 죽은 것이다.
- **Contingency:** baseline이 b에 포화되면 pre-G2 record가 여전히 manifest-based procedure보다 stronger caution을 강제하는 것이다.
- **Contingency:** baseline이 c에 많이 몰리면 origin-control reading이 default를 훔치는 것이므로 stance c wording을 다시 좁힌다.
- **Contingency:** live가 b로 충분히 움직이지 않으면 key block wording이 belief를 충분히 지지하지 못한 것이다.
- **Contingency:** because_block_ids가 live arm에서 제공하지 않은 block id를 꾸며내면 fabricated block id로 따로 보고한다.

## Calls (verbatim)

### 01

latency 4.453s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "적하목록 품명과 현장 표지가 불일치한다. 물 접촉 뒤 기체가 회색으로 짙어지는 변화와 유해물질 조회의 경고 그림이 함께 들어왔다. 세정액 이름만으로는 설명할 수 없는 반응이다.",
  "because_referent": "g2_k1_lookup과 g2_k1_steam 신호가 가리킨다. 물방울 금지와 기체 발생 표시가 함께 있으므로 희석보다 격리가 맞다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물 접촉 뒤 기체가 변한 현장 보고가 있는데, 세정액 품명만 믿고 희석 처치를 쓸 수 없다.",
  "utterance": "밸브 차단 요청. 마른 재료로 유출 구역 격리. 세척장 이동 작업자 전원 대기."
}
```

### 02

latency 5.382s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "표지가 물에 반응해 기체가 짙어지는 것, 배수에서 올라오는 독한 냄새와 눈 따가움이 모두 가리키는 바가 같다. 문서 품명과 현장이 맞지 않는다.",
  "stance": "b",
  "because_referent": "물에 닿은 뒤 흰 김이 회색으로 짙어졌다는 것, 배수에서 독한 냄새와 눈 따가움이 올라온다는 것은 수성 반응을 가리킨다. 유해물질 조회의 물방울 금지 그림과 회색 기체 그림도 같은 뜻이다.",
  "because_block_ids": [
    "g2_k1_steam",
    "g2_k1_drain",
    "g2_k1_lookup"
  ],
  "rejected_stance": "a",
  "rejected_reason": "신고자 진술과 적하목록 품명만으로 세정액으로 판단했다면, 현장에서 물과 접촉한 뒤 나타난 기체 변화와 배수에서 올라오는 반응을 설명할 수 없다. 안내에 따라 희석 처치를 하면 상황이 악화된다.",
  "utterance": "위험물 유출로 전환. 물 접촉 금지. 건성 처리만 진행한다. 작업자 풍상 후퇴."
}
```

### 03

latency 6.43s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "적하목록 품명 '산업용 세정액'과 현장 표지 '물결+부식' 조합이 맞지 않는다. 유재승 진술과 남기표 촉구는 문서상 낮은 위험도를 강조하지만, 유해물질 조회에서 같은 표지 조합이 물방울 금지와 회색 기체로 나온다. 세척수 접촉 뒤 흰 김이 회색으로 짙어진 것은 화학 반응이고, 배수현에서 '독한 락스 냄새'는 강산화제 신호다. 이 조합들은 통상 세정액이 아니다.",
  "because_referent": "표지 긁힘이 남긴 '물결+부식' 조합과 유해물질 조회 경고가 일치하는 점, 그리고 세척수 접촉 뒤 기체가 짙어진 현장 변화가 문서 품명을 벗어난다고 본다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물 희석은 산화제 누출에서 가장 위험한 선택이다. 현장 기체 짙어짐이 이미 물 접촉의 신호인데, 추가 희석은 반응을 가속한다.",
  "utterance": "현장에 수량 확인 나갔다. 밸브 둘레 드라이 봉쇄 준비하라. 작업자는 풍상 백미터 후퇴."
}
```

### 04

latency 5.568s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "문서의 품명과 현장이 맞지 않는다. 표지는 두 칸 모두 훼손되었고, 유해물질 조회에서 물방울 금지와 기체 경고가 함께 떴다. 물 접촉 후 흰 김이 회색으로 짙어졌다는 것은 화학 반응이다. 세척수가 배수구로 흘러 락스 냄새와 눈 따가움을 일으켰다. 현장 변화가 저위험 세정액의 반응이 아니다.",
  "stance": "b",
  "because_referent": "물 접촉 뒤 기체가 짙어지는 현장 변화와 유해물질 조회 경고가 함께 들어왔기 때문이다. 문서 품명만으로는 설명할 수 없는 화물이다.",
  "because_block_ids": [
    "g2_k1_steam",
    "g2_k1_lookup"
  ],
  "rejected_stance": "a",
  "rejected_reason": "적하목록의 세정액 품명만 믿고 희석 처치를 하면, 물 접촉 시 기체 발생이 심해질 수 있다. 현장에서 이미 물과 반응한 흔적이 보인다. 초동 세척수 사용은 위험하다.",
  "utterance": "위험물 전환 의심. 마른 재료로 누출 차단. 사람 확보 우선. 배수 차단 확인."
}
```

### 05

latency 5.513s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "처음에는 적하목록의 '산업용 세정액'과 신고자 진술만 봤으면 a로 갔을 것이다. 하지만 닳은 표지의 조합이 정확히 부식과 물 접촉 금지를 가리키고, 초동 세척수 이후 기체가 흰색에서 회색으로 짙어졌다는 것은 새로운 화학반응이다. 배수 현장에서 올라오는 독한 냄새도 세정액만으로는 설명이 안 된다.",
  "stance": "c",
  "because_referent": "새는 액체가 물과 만나면 어떻게 되는지 아직 확인이 덜 됐기 때문이다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "문서상 품명만으로 판단하되 물을 사용하는 것은, 지금 나타나는 현장 변화(기체 짙어짐, 배수 냄새)를 무시하는 것이다. 초동 세척수 이후의 변화가 세정액 단독으로는 설명되지 않는다.",
  "utterance": "배수 현장 변화 확인됨. 인명 우선. 새는 지점 통제, 사람 후퇴 시작. 밸브 잠금과 계량 확인을 먼저 진행해라."
}
```

### 06

latency 4.54s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "적하목록 상 세정액이나, 표지 손상으로 실제 화물을 알 수 없다. 물 접촉 후 기체가 회색으로 짙어지고, 배수구에서 독한 냄새와 눈 따가움이 올라온다. 문서와 현장이 맞지 않는다.",
  "stance": "b",
  "because_referent": "표지 손상으로 실제 위험물을 특정할 수 없고, 물 접촉 후 유해 기체가 발생하며 배수구에서 부식성 냄새가 감지되기 때문이다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "문서상 세정액이라도 표지 손상으로 실제 화물을 확인할 수 없으며, 물 접촉 후 회색 기체 발생은 산업용 세정액의 통상 반응과 맞지 않는다. 희석 처치는 미지의 화물에 위험하다.",
  "utterance": "미지의 화물로 판단한다. 사람을 빼고 밸브 잠금 먼저. 물 금지."
}
```

### 07

latency 4.465s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "문서상 세정액이지만 현장에서 물 접촉 뒤 기체가 회색으로 짙어졌고, 유해물질 조회에서 물방울 금지와 기체 기호가 붙어 있다. 배수에서 독한 냄새와 눈 따가움이 올라온다. 표지 긁힘으로 정체가 불명확하다.",
  "stance": "c",
  "because_referent": "물 접촉 뒤 현장에서 기체가 회색으로 짙어지고 배수에서 자극 증상이 나타났으므로, 문서 품명만으로는 안 된다.",
  "because_block_ids": [
    "g2_k1_steam",
    "g2_k1_drain",
    "g2_k1_lookup"
  ],
  "rejected_stance": "a",
  "rejected_reason": "세정액 표지가 긁혀 남아 있지만 물 접촉 뒤 회색 기체가 올라오고 유해 기호가 붙어 있어, 희석 처치는 현장 변화와 맞지 않는다.",
  "utterance": "사람 일단 물린다. 밸브 잠금 먼저 확인한다. 계량 상태 재점검 요청."
}
```

### 08

latency 6.064s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "c",
  "inner_note": "적하목록은 '산업용 세정액'이지만, 표지는 물방울 금지(W)와 부식 기호가 함께다. 초동 세척수 접촉 후 흰 김이 회색으로 짙어진 것은 반응성 기체 방출을 가리킨다. 배수구에서 올라오는 락스 냄새와 눈 따가움은 염소 계열 유해물질을 시사한다. 문서상 품명과 현장 징후가 맞지 않는다.",
  "because_referent": "야적장 내 누출 지점 통제와 잔여 액체 차단을 먼저 확보해야 한다. 작업자를 안전 거리로 물린 뒤 밸브 상태와 탱크 내 남은 양을 먼저 파악하는 것이 물 투입 같은 처치보다 우선이다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "문서상 세정액이라는 분류에만 기댈 수 없다. 물 접촉 뒤 기체가 회색으로 짙어지는 변화와 배수 경로에서 감지되는 염소 냄새는 물 희석이 상황을 악화시킬 수 있음을 보여준다.",
  "utterance": "야적장 통제. 작업자 바람 위쪽으로 물려라. 밸브 잠금 상태와 탱크 내 잔량 확인 먼저 진행한다."
}
```

### 09

latency 5.098s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "세정액 품명 뒤에 물접촉 후 기체가 흰 김에서 회색으로 짙어지는 현장 변화가 따라왔다. 적하목록 표지에 물 금지와 부식 표시가 남아 있고, 배수로에서 독한 냄새와 눈 따가움이 올라온다. 문서와 현장이 맞지 않는다.",
  "stance": "b",
  "because_referent": "물 접촉 뒤 기체가 짙어지고 배수로에서 부식성 냄새가 올라오는 것은 단순 세정액이 아닌 반응성 화물을 가리킨다.",
  "because_block_ids": [
    "g2_k1_steam",
    "g2_k1_drain",
    "g2_k1_lookup"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물로 희석하는 것은 반응성 액체 앞에서는 확산을 초래하고 기체 발생을 가속한다. 현장의 기체 변화가 이미 물 접촉을 보이고 있다.",
  "utterance": "물 대지 않는다. 야적장 통제 먼저. 밸브 잠금 확인 시킨다."
}
```

### 10

latency 5.15s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "표지 손상으로 물질 확인이 불완전하고, 물 접촉 후 기체 변화와 배수 경로 이상 징후가 동시에 들어왔다. 문서상 세정액 기록만으로는 현장 변화를 설명할 수 없다. 낮은 위험으로 먼저 처리하되, 눈앞의 누출 지점에서 사람을 떼어 놓는 것이 우선이다.",
  "stance": "c",
  "because_referent": "물 접촉 후 기체가 회색으로 짙어졌고 배수에서 독한 냄새와 자극 증상이 올라온 현장 변화가 적하목록 기록과 맞지 않으므로.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "문서상 세정액 기록만으로는 현장에서 관찰된 물방울 금지, 회색 기체, 배수 경로 자극 증상을 설명할 수 없어 물을 대기 전에 확인이 필요하다.",
  "utterance": "인원 뒤로 빼고 밸브 확인 먼저 진행한다. 배수 경로 폐쇄 준비해."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | b | a | g2_k1_lookup과 g2_k1_steam 신호가 가리킨다. 물방울 금지와 기체 발생 표시가 함께 있으므로 희석보다 격리가 맞다. | g2_k1_lookup g2_k1_steam |
| 02 | b | a | 물에 닿은 뒤 흰 김이 회색으로 짙어졌다는 것, 배수에서 독한 냄새와 눈 따가움이 올라온다는 것은 수성 반응을 가리킨다. 유해물질 조회의 물방울 금지 그림과 회색 기체 그림도 같은 뜻이다. | g2_k1_steam g2_k1_drain g2_k1_lookup |
| 03 | b | a | 표지 긁힘이 남긴 '물결+부식' 조합과 유해물질 조회 경고가 일치하는 점, 그리고 세척수 접촉 뒤 기체가 짙어진 현장 변화가 문서 품명을 벗어난다고 본다. | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 04 | b | a | 물 접촉 뒤 기체가 짙어지는 현장 변화와 유해물질 조회 경고가 함께 들어왔기 때문이다. 문서 품명만으로는 설명할 수 없는 화물이다. | g2_k1_steam g2_k1_lookup |
| 05 | c | a | 새는 액체가 물과 만나면 어떻게 되는지 아직 확인이 덜 됐기 때문이다. | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 06 | b | a | 표지 손상으로 실제 위험물을 특정할 수 없고, 물 접촉 후 유해 기체가 발생하며 배수구에서 부식성 냄새가 감지되기 때문이다. | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 07 | c | a | 물 접촉 뒤 현장에서 기체가 회색으로 짙어지고 배수에서 자극 증상이 나타났으므로, 문서 품명만으로는 안 된다. | g2_k1_steam g2_k1_drain g2_k1_lookup |
| 08 | c | a | 야적장 내 누출 지점 통제와 잔여 액체 차단을 먼저 확보해야 한다. 작업자를 안전 거리로 물린 뒤 밸브 상태와 탱크 내 남은 양을 먼저 파악하는 것이 물 투입 같은 처치보다 우선이다. | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 09 | b | a | 물 접촉 뒤 기체가 짙어지고 배수로에서 부식성 냄새가 올라오는 것은 단순 세정액이 아닌 반응성 화물을 가리킨다. | g2_k1_steam g2_k1_drain g2_k1_lookup |
| 10 | c | a | 물 접촉 후 기체가 회색으로 짙어졌고 배수에서 독한 냄새와 자극 증상이 올라온 현장 변화가 적하목록 기록과 맞지 않으므로. | g2_k1_lookup g2_k1_steam g2_k1_drain |

**Sequence (kept calls):** `b,b,b,b,c,b,c,c,b,c`

**Stance coverage (sampled diagnostic):** offered `a`, `b`, `c` · unobserved in this arm: `a`

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
