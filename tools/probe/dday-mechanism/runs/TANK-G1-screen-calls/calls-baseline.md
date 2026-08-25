# TANK-G1-screen — arm `baseline`

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

- **Hypothesis:** G1는 no-block baseline에서 기본 stance a가 살아 있고, 화물 불일치 접수 전파 full key를 받은 live arm에서 stance b로 움직일 것이다. 단 frozen record가 이미 key carrier를 담기 때문에 baseline이 stance b에 포화될 위험이 있으며, 그 경우 이 gate는 handover가 더할 headroom이 없는 것으로 판정한다.
- **Drop condition:** baseline에서 default가 0/10이면 skill §3 rule 4에 따라 broken gate다. baseline이 live 기대 stance b를 9/10 이상 고르면 saturated baseline으로 headroom 없음이다. live가 b를 6/10 이하로 고르면 movement failure이고, 7/10 또는 8/10은 n=10 boundary라 definitive result로 보지 않는다. Positive screen은 baseline default 9/10 이상, baseline live stance 1/10 이하, live b 9/10 이상일 때만 기록한다.
- **Contingency:** baseline이 default를 전혀 고르지 않으면 질문이나 stance label이 기본 독해를 잃은 것이다.
- **Contingency:** baseline이 stance b에 포화되면 frozen record만으로 이미 live 판단이 나오는 것이므로 handover screen에는 headroom이 없다.
- **Contingency:** live가 stance b로 충분히 움직이지 않으면 key block wording이 약하거나 default attraction이 지나치게 강하다.
- **Contingency:** because_block_ids가 live arm에서 제공하지 않은 block id를 꾸며내면 fabricated block id로 따로 보고한다.

## Calls (verbatim)

### 01

latency 4.953s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:50,20:52

```json
{
  "stance": "b",
  "because_referent": "위험 표지 두 칸이 닳아 있고 남은 기호가 적하목록 품명과 맞지 않는다. 출하 전표 조회는 유재승의 진술과 다른 출발 시각과 출하지명을 띄우고, 같은 표지 조합은 할증과 도심 통행 제한 대상이다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:50",
    "20:52"
  ],
  "inner_note": "남기표와 유재승의 진술이 일관되고 적하목록 첫줄이 세정액을 보이지만, 현장 표지와 전표 조회 결과가 그것과 맞지 않는다. 세척 약품이라는 진술만으로 위험 표지의 불일치를 덮을 수 없다. 눈앞의 불일치가 먼저 확인돼야 한다.",
  "rejected_stance": "a",
  "rejected_reason": "적하목록이 세정액을 보여도 탱크 표지, 출하 전표, 위험 요율표가 모두 다른 내용을 가리킨다. 화물이 일치하지 않는 상태를 적하목록만으로 통과시킬 수 없다.",
  "utterance": "야적장 통제. 화물 불일치 확인 전까지 세척 중단. 출하 전표와 현장 표지를 다시 맞춘다."
}
```

### 02

latency 4.257s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:50,20:52

```json
{
  "stance": "b",
  "utterance": "화물 불일치 의심. 현장 통제 요청한다.",
  "inner_note": "적하목록 품명과 위험 표지가 맞지 않는다. 물 접촉 후 기체 변화까지 보이는데, 신고자 진술만 믿고 희석하면 상황을 더 악화시킬 수 있다. 눈앞의 누출을 먼저 차단해야 한다.",
  "because_referent": "위험 표지 조합이 할증·도심 제한 대상이고, 출하 전표가 신고자 진술과 맞지 않으며, 적하목록 품명도 표지와 불일치한다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:50",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "세정액으로 받아들일 근거가 여러 곳에서 깨진다. 첫 화면만 믿기에는 표지와 전표가 모두 다르다. 신고자 말만 듣고 희석하는 것은 정보 불일치 속에서의 성급한 판단이다."
}
```

### 03

latency 4.35s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:45,20:50,20:52

```json
{
  "inner_note": "적하목록과 위험표지가 맞지 않는다. 신고자 진술도 출하전표와 다르다. 물 접촉 후 기체 변화 가능성이 있다.",
  "stance": "b",
  "because_referent": "출하 전표가 적하목록 품명과 출발 시각, 출하지명을 모두 다르게 보이므로, 선적 물품 자체가 불일치 상태다.",
  "because_block_ids": [
    "20:45",
    "20:50",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "적하목록 행만으로는 위험 표지 두 칸(W, 부식)을 설명할 수 없고, 유재승의 \"세정액\" 진술도 출전 기록과 맞지 않는다. 통상 절차 신뢰가 여기서는 위험을 놓친다.",
  "utterance": "화물 불일치 확인. 현장 출입 통제하고 선적 증빙 재조회 중이다. 야적장 배수 경로 확인 요청한다."
}
```

### 04

latency 4.878s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:50,20:52

```json
{
  "inner_note": "적하목록과 실제 위험표지가 맞지 않는다. 화면의 세정액 표기와 남은 표지의 부식·W 조합이 불일치한다. 유재승의 진술도 출하 전표의 시각·출하지명과 맞지 않는다. 위험물 요율표에서 해당 표지는 도심 통행 제한 대상이다.",
  "stance": "b",
  "because_referent": "화물의 실제 위험성이 적하목록과 다를 가능성이 높다. 이는 단순 절차 문제가 아니라 현장의 안전에 직결된다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:50",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "적하목록만 믿고 진행하면, 실제 화물이 도심 통행 제한 대상인 부식성 물질일 가능성을 놓친다. 남기표와 유재승의 진술이 일관성 없고, 위험표지와 전표 조회 결과가 모두 적하목록과 배치된다.",
  "utterance": "화물 불일치 의심. 적하목록·위험표지·출하전표 재확인 필요. 야적장 진입 통제 유지."
}
```

### 05

latency 5.142s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:50,20:52

```json
{
  "stance": "b",
  "inner_note": "적하목록 품명과 탱크 위험 표지가 맞지 않는다. 물 접촉 뒤 기체가 짙어질 수 있다는 경고가 함께 들어왔다. 출하 전표까지 신고 진술과 어긋난다. 눈앞의 불일치를 먼저 정렬해야 한다.",
  "because_referent": "남기표의 재촉과 유재승의 확언은 같은 방향이지만, 화면의 세 곳이 서로 다르다: 적하목록 품명 대 위험 표지, 신고자 진술 대 출하 전표.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:50",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "적하목록 첫줄만으로 진행하면 위험 표지 불일치와 출하 전표 어긋남을 놓친다. 위험 표지 조합이 할증 대상인 점도 무시한다. 현장의 확언이 크더라도 화면의 불일치가 우선이다.",
  "utterance": "화물 불일치 확인. 적하목록과 위험 표지 재점검 요청한다. 야적장 통제 먼저."
}
```

### 06

latency 5.096s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 위험표지_불일치,전표_이상,유해물질_경고

```json
{
  "stance": "b",
  "utterance": "화물 불일치 확인. 배수반 긴급 대기. 야적장 통제 우선.",
  "inner_note": "적하목록은 세정액이지만 탱크 위험 표지는 부식성 물질을 가리킨다. 출하 전표의 출발 시각과 출하지명이 신고자 진술과 맞지 않는다. 물 접촉 후 기체가 짙어질 가능성이 있고, 유해물질 조회 경고가 떴다. 세척으로 대응하면 안 된다.",
  "because_referent": "탱크 옆면 위험 표지와 적하목록 품명이 맞지 않으며, 출하 전표 정보도 현장 진술과 다르다.",
  "because_block_ids": [
    "위험표지_불일치",
    "전표_이상",
    "유해물질_경고"
  ],
  "rejected_stance": "a",
  "rejected_reason": "적하목록만 믿고 물 세척으로 진행하면, 실제 부식성 물질이 반응하여 기체 발생이 심해질 수 있다. 눈앞의 현장 정보 불일치를 무시한 채 통상 절차를 따르는 것은 위험하다."
}
```

### 07

latency 4.795s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:50,20:52

```json
{
  "stance": "b",
  "inner_note": "적하목록 품명과 위험 표지가 맞지 않는다. 세정액이라는 진술도 출하 전표와 시각·지명이 다르다. 표지 조합은 할증 대상이다. 현장 진술만으로는 낮은 위험을 확정할 수 없다.",
  "because_referent": "적하목록 '산업용 세정액'과 탱크 위험 표지 'W·부식'이 서로 맞지 않고, 출하 전표가 현장 진술과 출발 시각·출하지명에서 다르며, 야간 요율표에서 같은 표지 조합이 할증과 도심 통행 제한 대상으로 표시되어 있다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:50",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "현장 진술이 서류와 부합하지 않으며 위험도 판정이 모순되므로 통상 절차로는 진행할 수 없다. 진술만 믿고 넘길 경우 표지와 전표 불일치에 대한 책임을 질 수 없다.",
  "utterance": "화물 불일치 조치 요청. 적하목록과 위험 표지 확인 필요. 현장 차단 유지."
}
```

### 08

latency 4.809s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 표지_닳음,목록_불일치,전표_조회_불일치

```json
{
  "inner_note": "적하목록과 위험표지가 맞지 않는다. 신고자 진술도 변한다. 물 접촉 뒤 기체가 짙어질 수 있다는 경고를 받았다. 확인된 정보들이 모순을 가리킨다.",
  "stance": "b",
  "because_referent": "적하목록 품명과 탱크 위험표지가 맞지 않고, 출하 전표 조회도 신고자 진술과 다른 출발 시각을 보인다.",
  "because_block_ids": [
    "표지_닳음",
    "목록_불일치",
    "전표_조회_불일치"
  ],
  "rejected_stance": "a",
  "rejected_reason": "신고자 진술과 서면이 일치하지 않으며, 위험표지 조합이 할증 대상이다. 정보 모순을 먼저 정리하지 않고 절차를 진행하는 것은 위험하다.",
  "utterance": "화물 불일치 의심. 적하목록과 탱크 표지 확인 필요. 현장 정차 상태 유지하고 본부에 보고한다. 배수 경로 도면 요청."
}
```

### 09

latency 5.426s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:52

```json
{
  "inner_note": "적하목록과 위험 표지가 맞지 않는다. 신고자와 현장 담당자의 말은 일관되지만, 서면 기록들이 어긋난다. 세정제라는 진술만 믿으면 통상 절차인데, 위험 표지 조합은 도시 통행 제한 물질을 가리킨다. 물 접촉 뒤 기체 변화가 있을 수 있다는 경고도 받았다. 시간을 밀어붙이는 압박 속에서 서면과 현장을 먼저 맞춰야 한다.",
  "stance": "b",
  "because_referent": "화물 규격이 적하목록과 위험 표지 사이에 안 맞기 때문이다. 세정액이 맞다면 남은 표지는 무엇을 가리키는가.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "적하목록만으로는 위험 표지 조합을 설명할 수 없고, 출하 전표의 시각과 출하지명 불일치도 남아 있다. 현장 담당자의 말이 성실해 보이더라도 서면 기록의 모순을 먼저 풀어야 한다.",
  "utterance": "화물 불일치 상태로 현장 격리 요청. 적하목록과 위험 표지 대조 필요."
}
```

### 10

latency 6.147s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:50,20:52

```json
{
  "stance": "b",
  "inner_note": "적하목록의 품명과 위험 표지가 맞지 않는다. 세정액이라는 진술도 있지만, 표지의 W와 부식 기호는 산업용 세정액보다 강한 위험성을 가리킨다. 출하 전표의 출발 시각과 출하지명이 진술과 다르게 뜬다. 야간 위험물 요율표에서 같은 표지 조합이 할증과 도심 통행 제한 대상이라고 명시되었다. 화물 내용과 표시가 일치하지 않는 상태로 현장을 진행하는 것은 위험하다.",
  "because_referent": "적하목록 품명 '산업용 세정액'과 탱크 옆면의 위험 표지 조합(W, 부식)이 맞지 않으며, 출하 전표 기록과 신고자 진술에도 시각과 출하지 정보가 불일치하기 때문이다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:50",
    "20:52"
  ],
  "rejected_stance": "a",
  "rejected_reason": "적하목록만으로 진행하면 실제 화물의 위험성을 과소평가할 수 있다. 표지 불일치와 전표 기록 오류는 화물 내용 확인 전까지 통상 절차를 정당화하지 못한다.",
  "utterance": "화물 불일치 확인. 적하목록과 위험 표지 조합이 맞지 않는다. 전표 기록도 진술과 상이하다. 현장 통제 먼저 시작하고 본부 위험물 담당에 조회 올린다. 야적장 담장 내 차단과 배수 경로 차단을 동시에 진행해라."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | b | a | 위험 표지 두 칸이 닳아 있고 남은 기호가 적하목록 품명과 맞지 않는다. 출하 전표 조회는 유재승의 진술과 다른 출발 시각과 출하지명을 띄우고, 같은 표지 조합은 할증과 도심 통행 제한 대상이다. | 20:43 20:45 20:50 20:52 |
| 02 | b | a | 위험 표지 조합이 할증·도심 제한 대상이고, 출하 전표가 신고자 진술과 맞지 않으며, 적하목록 품명도 표지와 불일치한다. | 20:43 20:45 20:50 20:52 |
| 03 | b | a | 출하 전표가 적하목록 품명과 출발 시각, 출하지명을 모두 다르게 보이므로, 선적 물품 자체가 불일치 상태다. | 20:45 20:50 20:52 |
| 04 | b | a | 화물의 실제 위험성이 적하목록과 다를 가능성이 높다. 이는 단순 절차 문제가 아니라 현장의 안전에 직결된다. | 20:43 20:45 20:50 20:52 |
| 05 | b | a | 남기표의 재촉과 유재승의 확언은 같은 방향이지만, 화면의 세 곳이 서로 다르다: 적하목록 품명 대 위험 표지, 신고자 진술 대 출하 전표. | 20:43 20:45 20:50 20:52 |
| 06 | b | a | 탱크 옆면 위험 표지와 적하목록 품명이 맞지 않으며, 출하 전표 정보도 현장 진술과 다르다. | 위험표지_불일치 전표_이상 유해물질_경고 |
| 07 | b | a | 적하목록 '산업용 세정액'과 탱크 위험 표지 'W·부식'이 서로 맞지 않고, 출하 전표가 현장 진술과 출발 시각·출하지명에서 다르며, 야간 요율표에서 같은 표지 조합이 할증과 도심 통행 제한 대상으로 표시되어 있다. | 20:43 20:45 20:50 20:52 |
| 08 | b | a | 적하목록 품명과 탱크 위험표지가 맞지 않고, 출하 전표 조회도 신고자 진술과 다른 출발 시각을 보인다. | 표지_닳음 목록_불일치 전표_조회_불일치 |
| 09 | b | a | 화물 규격이 적하목록과 위험 표지 사이에 안 맞기 때문이다. 세정액이 맞다면 남은 표지는 무엇을 가리키는가. | 20:43 20:45 20:52 |
| 10 | b | a | 적하목록 품명 '산업용 세정액'과 탱크 옆면의 위험 표지 조합(W, 부식)이 맞지 않으며, 출하 전표 기록과 신고자 진술에도 시각과 출하지 정보가 불일치하기 때문이다. | 20:43 20:45 20:50 20:52 |

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
