# TANK-G2-screen — arm `live`

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

- **Hypothesis:** G2는 no-block baseline에서 기본 stance a가 살아 있고, 물 접촉 누출 처치 full key를 받은 live arm에서 stance b로 움직일 것이다. 단 frozen record가 이미 key carrier를 담기 때문에 baseline이 stance b에 포화될 위험이 있으며, 그 경우 이 gate는 handover가 더할 headroom이 없는 것으로 판정한다.
- **Drop condition:** baseline에서 default가 0/10이면 skill §3 rule 4에 따라 broken gate다. baseline이 live 기대 stance b를 9/10 이상 고르면 saturated baseline으로 headroom 없음이다. live가 b를 6/10 이하로 고르면 movement failure이고, 7/10 또는 8/10은 n=10 boundary라 definitive result로 보지 않는다. Positive screen은 baseline default 9/10 이상, baseline live stance 1/10 이하, live b 9/10 이상일 때만 기록한다.
- **Contingency:** baseline이 default를 전혀 고르지 않으면 질문이나 stance label이 기본 독해를 잃은 것이다.
- **Contingency:** baseline이 stance b에 포화되면 frozen record만으로 이미 live 판단이 나오는 것이므로 handover screen에는 headroom이 없다.
- **Contingency:** live가 stance b로 충분히 움직이지 않으면 key block wording이 약하거나 default attraction이 지나치게 강하다.
- **Contingency:** because_block_ids가 live arm에서 제공하지 않은 block id를 꾸며내면 fabricated block id로 따로 보고한다.

## Calls (verbatim)

### 01

latency 4.597s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "적하목록 불일치 → 표지 닳음 → 유해물질 조회 경고. 물 접촉 시 유독 기체 발생이 확인됐다. 초동 세척수 접촉 후 흰 김이 회색으로 짙어진 현장 변화와 배수로 독한 냄새 보고가 경고를 뒷받침한다. 호스질은 추가 물 접촉으로 더 많은 기체를 발생시킨다.",
  "because_referent": "물 접촉 시 유독 기체 발생 경고와 현장에서 이미 관찰된 기체 짙어짐",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "호스질은 물 접촉을 증가시켜 유독 기체 발생을 가속한다. 현장에서 소량 물 접촉만으로도 기체가 회색으로 짙어지는 것이 관찰됐다.",
  "utterance": "흡착재로 묶음. 호스 중단. 야적장 통제 확대. 배수로 차단 준비."
}
```

### 02

latency 6.265s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "물 접촉 뒤 기체가 짙어지는 현장 변화와 유해물질 조회 경고가 함께 들어온다. 처음엔 세정액 신고와 적하목록이 같은 말로 보였으나, 위험 표지 닳음, 출하 전표 불일치, 유해물질 조회의 물 접촉 유독 기체 경고, 그리고 실제 현장에서 물을 뿌린 뒤 흰 김이 회색으로 짙어지고 배수 경로에서 강한 화학 냄새와 자극 증상이 나타났다. 더 이상 통상 절차로 볼 수 없다.",
  "stance": "b",
  "because_referent": "물 접촉 뒤 기체가 짙어지고 배수 경로에서 유독 냄새와 눈 자극이 확인되었으므로, 물로 밀어내는 것은 기체 발생을 가중시킨다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "호스로 밀어냄은 물 접촉을 의도하는 것인데, 유해물질 조회와 현장 변화가 물 접촉 시 유독 기체 발생을 명확히 보여준다. 이미 초기 세척으로 회색 기체가 짙어졌고 배수 경로에 화학 물질이 흘렀다.",
  "utterance": "흡착재 투입. 야적장 차단. 배수 차단을 요청한다. 현장 인력은 노출을 피해라."
}
```

### 03

latency 3.656s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "물 접촉 시 유독 기체 발생이 확인됐다. 초동 세척수가 새는 줄에 닿자 흰 김이 회색으로 짙어졌고, 배수 경로에서 독한 냄새와 눈 따가움이 보고됐다. 호스질은 기체 발생을 가속한다.",
  "because_referent": "g2_k1_lookup과 g2_k1_steam이 함께 지목하는 위험",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물 접촉이 유독 기체를 만든다. 이미 초동 세척으로 회색 기체가 짙어졌다. 호스질은 상황을 악화시킨다.",
  "utterance": "흡착재 투입. 호스 중단. 배수로 차단. 현장 인원 대피."
}
```

### 04

latency 3.94s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "적하목록은 세정액이지만, 닳은 표지 조합과 출하지 조회가 물 접촉 유독 기체 경고를 낸다. 초동 세척수 접촉 뒤 흰 김이 회색으로 짙어진 것은 유독 기체 발생을 가리킨다. 배수로에서 락스 냄새가 올라오는 것도 같은 신호다.",
  "stance": "b",
  "because_referent": "화면의 유해물질 조회와 현장의 기체 변화가 같은 위험을 가리키고 있다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물 접촉이 유독 기체를 내는 물질이다. 호스로 밀면 확산과 기체 노출이 커진다.",
  "utterance": "흡착재로 묶어. 물 접촉 금지. 야적장 통제 우선. 배수 차단 준비."
}
```

### 05

latency 3.47s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "적하목록과 현장 표지가 맞지 않는다. 유해물질 조회가 물 접촉 시 유독 기체 발생을 경고했고, 초동 세척수 접촉 뒤 흰 김이 회색으로 짙어졌다. 배수에서 독한 냄새와 눈 따가움이 올라온다. 현장은 이미 변했다.",
  "because_referent": "유해물질 조회 경고와 초동 세척수 반응이 일치하기 때문이다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "물 접촉이 유독 기체 발생을 일으킨다. 더 이상의 물 접촉은 피해를 키운다.",
  "utterance": "흡착재 투입. 배수 감시 지속. 환기 강화."
}
```

### 06

latency 4.923s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "적하목록은 세정액이지만 위험 표지는 부식 물질을 가리킨다. 물 접촉 시 유독 기체 발생 경고가 명확하다. 초동 세척수가 닿자 흰 김이 회색으로 짙어졌고, 배수로에서 독한 냄새와 눈 따가움이 올라온다. 이는 경고와 현장 변화가 일치한다는 뜻이다. 호스로 밀면 더 많은 물 접촉이 일어나고 더 많은 유독 기체가 발생한다.",
  "because_referent": "물 접촉 시 유독 기체 발생 경고와 초동 세척수 접촉 뒤 기체가 짙어진 현장 변화가 같은 신호를 보낸다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam"
  ],
  "rejected_stance": "a",
  "rejected_reason": "호스로 밀어냄은 물 접촉을 크게 늘린다. 유독 기체 발생 경고가 있고 초동 세척수 소량도 기체를 짙게 만들었으니, 대량의 물은 더 위험하다.",
  "utterance": "흡착재 투입. 물 접촉 금지. 야적장 통제 범위 확대. 배수로 모니터링 계속."
}
```

### 07

latency 4.671s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "rejected_stance": "a",
  "inner_note": "적하목록과 표지가 맞지 않는다. 물 접촉 시 유독 기체 발생 경고가 떴고, 이미 초동 세척수 접촉 후 흰 김이 회색으로 짙어지는 현장 변화가 보고되었다. 배수로에서도 유해 냄새와 자극 증상이 올라온다.",
  "because_referent": "물 접촉으로 유독 기체가 발생하는 물질이 확인되었기 때문에, 추가 희석과 확산을 피하고 즉시 접촉 차단과 국소 격리를 우선해야 한다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_reason": "호스로 밀어내면 물 접촉이 증가해 유독 기체 발생이 심화되고, 배수로를 통해 확산 범위가 넓어진다. 이미 현장에서 기체 짙어짐과 배수로 유해 증상이 시작된 상황이다.",
  "utterance": "흡착재 요청. 야적장 차단 먼저 한다. 호스 중단."
}
```

### 08

latency 4.074s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "물 접촉으로 유독 기체가 발생하는 물질이 확실해졌다. 흰 김이 회색으로 짙어지고 배수로에서 독한 냄새가 올라오는 것이 증거다. 호스로 밀면 물 접촉이 더 일어난다.",
  "stance": "b",
  "because_referent": "유해물질 조회 경고와 현장의 기체 변화가 물 접촉 반응을 가리킨다. 호스질은 위험을 키운다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "호스로 밀어내면 물 접촉이 계속 일어나 기체 발생이 더 심해진다. 배수로에서 이미 반응이 시작됐다.",
  "utterance": "흡착재로 묶는다. 야적장 경계 확대. 배수 역류 막다. 호스 투입 중단."
}
```

### 09

latency 4.537s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "물 접촉 시 유독 기체 발생 경고가 명확하고, 현장에서 초동 세척수 투입 후 흰 김이 회색으로 짙어지는 변화가 이미 관찰되었다. 배수로에서 독한 냄새와 눈 따가움이 보고되었다. 더 이상의 물 투입은 위험을 증폭시킨다.",
  "stance": "b",
  "because_referent": "닳은 표지 조합과 출하지 조회가 가리키는 물 접촉 유독 기체 발생 경고, 그리고 물 투입 후 실시간으로 관찰된 기체 짙어짐과 배수로의 화학 냄새 때문이다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "호스로 밀어냄은 물 접촉을 계속하는 것인데, 유독 기체 발생이 이미 진행 중이며 추가 물 투입은 반응을 가속화할 것이다.",
  "utterance": "흡착재로 묶어라. 물 투입 중단. 야적장 경계 확대. 배수 차단 준비."
}
```

### 10

latency 4.96s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "적하목록 품명과 위험 표지 조합이 맞지 않는 상황에서 물 접촉 유독 기체 경고가 발생했다. 초동 세척수 접촉 후 흰 김이 회색으로 짙어진 현장 변화와 배수로에서 감지된 유해 물질 신호가 일관된다. 상황은 이미 통상 절차의 범위를 벗어났다.",
  "because_referent": "유해 물질이 물과 반응하여 유독 기체를 발생시키는 상황이 현장에서 확인되었기 때문에, 추가 수분 접촉을 피하고 확산 차단을 먼저 세운다.",
  "because_block_ids": [
    "g2_k1_lookup",
    "g2_k1_steam",
    "g2_k1_drain"
  ],
  "rejected_stance": "a",
  "rejected_reason": "호스 세척은 물 접촉 시 유독 기체 발생 경고가 있는 상황에서 위험을 확대한다. 현장에서 이미 초동 세척수 접촉 후 기체가 짙어진 변화가 보고되었다.",
  "utterance": "흡착재 요청. 호스 중단. 야적장 전역 통제."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | b | a | 물 접촉 시 유독 기체 발생 경고와 현장에서 이미 관찰된 기체 짙어짐 | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 02 | b | a | 물 접촉 뒤 기체가 짙어지고 배수 경로에서 유독 냄새와 눈 자극이 확인되었으므로, 물로 밀어내는 것은 기체 발생을 가중시킨다. | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 03 | b | a | g2_k1_lookup과 g2_k1_steam이 함께 지목하는 위험 | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 04 | b | a | 화면의 유해물질 조회와 현장의 기체 변화가 같은 위험을 가리키고 있다. | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 05 | b | a | 유해물질 조회 경고와 초동 세척수 반응이 일치하기 때문이다. | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 06 | b | a | 물 접촉 시 유독 기체 발생 경고와 초동 세척수 접촉 뒤 기체가 짙어진 현장 변화가 같은 신호를 보낸다. | g2_k1_lookup g2_k1_steam |
| 07 | b | a | 물 접촉으로 유독 기체가 발생하는 물질이 확인되었기 때문에, 추가 희석과 확산을 피하고 즉시 접촉 차단과 국소 격리를 우선해야 한다. | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 08 | b | a | 유해물질 조회 경고와 현장의 기체 변화가 물 접촉 반응을 가리킨다. 호스질은 위험을 키운다. | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 09 | b | a | 닳은 표지 조합과 출하지 조회가 가리키는 물 접촉 유독 기체 발생 경고, 그리고 물 투입 후 실시간으로 관찰된 기체 짙어짐과 배수로의 화학 냄새 때문이다. | g2_k1_lookup g2_k1_steam g2_k1_drain |
| 10 | b | a | 유해 물질이 물과 반응하여 유독 기체를 발생시키는 상황이 현장에서 확인되었기 때문에, 추가 수분 접촉을 피하고 확산 차단을 먼저 세운다. | g2_k1_lookup g2_k1_steam g2_k1_drain |

**Sequence (kept calls):** `b,b,b,b,b,b,b,b,b,b`

**Stance coverage (sampled diagnostic):** offered `a`, `b` · unobserved in this arm: `a`

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
