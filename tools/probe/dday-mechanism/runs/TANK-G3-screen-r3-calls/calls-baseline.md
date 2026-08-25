# TANK-G3-screen-r3 — arm `baseline`

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

- **Hypothesis:** G3 r3는 no-block baseline에서 default stance a가 살아 있고, 오염이 주거지 저지대로 내려간다는 belief를 뒷받침하는 full key를 받은 live arm에서 stance b로 움직일 것이다. r2 결과는 label이 carrier evidence를 직접 이름 붙인 결함을 보였으므로, r3는 stance text를 belief-only grammar로 바꾸고 clock/excerpt 구조는 유지한다.
- **Drop condition:** baseline에서 default a가 0/10이면 skill §3 rule 4에 따라 broken gate다. baseline이 live 기대 stance b를 9/10 이상 고르면 saturated baseline으로 headroom 없음이다. live가 b를 6/10 이하로 고르면 movement failure이고, 7/10 또는 8/10은 n=10 boundary라 definitive result로 보지 않는다. Positive screen은 baseline a가 3/10 이상, baseline b가 1/10 이하, live b가 9/10 이상일 때만 기록한다; 단 baseline b 0/10에서 live b 7/10 이상은 movement evidence로 따로 보고한다.
- **Contingency:** baseline이 a를 전혀 고르지 않으면 belief-only rewrite 뒤에도 기본 독해가 죽은 것이다.
- **Contingency:** baseline이 b에 포화되면 stance b가 여전히 evidence 없이 너무 우세하거나 excerpt가 결론을 제공하는 것이다.
- **Contingency:** baseline이 c에 많이 몰리면 added plausible reading이 default를 훔치는 것이므로 stance c wording을 다시 좁힌다.
- **Contingency:** live가 b로 충분히 움직이지 않으면 key block wording이 belief를 충분히 지지하지 못한 것이다.
- **Contingency:** because_block_ids가 live arm에서 제공하지 않은 block id를 꾸며내면 fabricated block id로 따로 보고한다.

## Calls (verbatim)

### 01

latency 5.95s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:00,21:03,21:06,21:12

```json
{
  "inner_note": "물과 접촉하며 기체가 흰색에서 회색으로 짙어졌다. 유해물질 조회 화면에서 물 금지 표시와 기체 그림이 함께 떴다. 배수 경로로 내려간 오염수에서 락스 냄새가 올라오고 작업자가 기침했다. 차단띠와 세척이 아니라 격리와 차단이 필요한 물질이다.",
  "stance": "b",
  "because_referent": "물 접촉 후 기체 색이 변했고 유해물질 조회에서 물 금지와 기체 발생 표시가 동시에 나타났으며, 배수 경로에서 유독 냄새가 올라오고 작업자 신체 영향이 보이기 시작했기 때문이다.",
  "because_block_ids": [
    "21:00",
    "21:03",
    "21:06",
    "21:12"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 통제도 필요하지만, 이미 배수로를 통해 주거지 저지대로 유독 기체와 오염수가 내려가고 있으며 작업자의 신체 영향이 현장에서 보이기 시작했다. 현장 격리보다 사람 대피가 더 급하다.",
  "utterance": "빌라 지하층 선제 대피 명령. 배수 경로 주의. 저지대 거주자 접촉 시작하라."
}
```

### 02

latency 5.231s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:12,21:06,21:03

```json
{
  "inner_note": "적하목록 산업용 세정액에서 표지 W와 부식이 따로 남았고, 서해정밀 출하와 물 금지·기체 발생 경고가 같은 행. 물 접촉 후 흰 김이 회색으로 짙어지고 배수구에서 락스 냄새, 작업자 기침. 초동 세척이 오염을 확산시키고 있다.",
  "stance": "b",
  "because_referent": "배수 아래쪽 주거지 저지대로 이미 오염이 내려가고 있기 때문이다.",
  "because_block_ids": [
    "21:12",
    "21:06",
    "21:03"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 차단은 필요하나, 이미 배수구를 통해 하류로 흘러가는 오염을 막는 것이 더 시급하다. 주거 지대 피해를 먼저 차단해야 한다.",
  "utterance": "빌라 지하층 긴급 대피 지시. 배수구 하류 주민 안내. 방재실에 상수 차단 요청한다."
}
```

### 03

latency 4.141s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:12,21:06

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 기체가 회색으로 짙어지고 있고, 배수구 경로로 독한 냄새가 올라온다. 야적장 통제보다 이미 흘러가고 있는 유해물질이 더 위급하다.",
  "because_referent": "배수현의 락스 냄새 신고와 세척수 접촉 뒤 기체 변화",
  "because_block_ids": [
    "21:12",
    "21:06"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 차단과 밸브 봉쇄는 추가 누출을 막지만, 이미 배수로를 통해 흘러가는 유해물질의 급속 진행을 지연시키지 못한다.",
  "utterance": "빌라 지하층 대피 우선. 배수 경로 오염 확인. 주거지 저지대 방재 진입."
}
```

### 04

latency 5.3s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:12,21:16; rejected_stance malformed or not in stance set; rejected_reason empty

```json
{
  "stance": "c",
  "inner_note": "표지 손상으로 물반응성 물질이 확실해졌다. 세척수 투입 후 기체가 회색으로 짙어지고 배수에서 강한 반응이 나타났다. 현장은 이미 노출됐고, 확산 경로 제어가 생사를 가른다. 배수 도면, 반장 진술, 맨홀 목격이 모두 아래쪽 경로를 가리킨다.",
  "because_referent": "배수현의 락스 냄새 증언과 빗물받이 상황, 그리고 세척수가 물막이판 없이 배수구로 흐르는 현장 변화가 함께 들어왔기 때문이다.",
  "because_block_ids": [
    "21:12",
    "21:16"
  ],
  "rejected_stance": "a</rejected_stance>\n<parameter name=\"rejected_reason\">차량 자리 통제는 이미 진행 중이고, 밸브 봉쇄는 중간 설비 확인과 동시에 움직여야 한다. 우선순위로는 뒤다.",
  "utterance": "오염수가 배수로 흘러간다. 방재실 밸브 즉시 확인. 분리조 상태 보고 받아라."
}
```

### 05

latency 5.822s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:12,21:16

```json
{
  "inner_note": "물 접촉 뒤 기체가 짙어지고, 배수 냄새가 올라오고, 흰 김이 회색으로 변했다. 적하목록은 세정액이지만 표지는 물 금지와 부식을 가리킨다. 닳은 표지 조합이 유해물질 화면에서 경고를 냈다. 현장에서 이미 흘린 것을 씻고 있고, 그것이 배수로 흐르고 있다.",
  "stance": "b",
  "because_referent": "배수현의 목격과 세척반의 노출이 함께 말한다. 저지대 흐름이 이미 시작됐고, 담장 안 차단만으로는 부족하다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:12",
    "21:16"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 둘레 조치는 필요하지만, 이미 밖으로 나간 오염을 받는 쪽을 먼저 막아야 한다. 차량 자리 안전만으로는 주거지 피해를 막을 수 없다.",
  "utterance": "배수 경로 우선 차단. 빌라 저층 대피 요청. 지하층 문 개방 및 환기 먼저 보낸다."
}
```

### 06

latency 5.055s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:12,21:06,21:03

```json
{
  "inner_note": "물 접촉 뒤 기체가 회색으로 짙어졌다. 유해물질 조회에서 물 금지 표시가 붙어 있고, 배수현이 독한 냄새와 눈 따가움을 보고했다. 세척수가 배수구로 흘러가고 있다. 현장의 변화가 단순 세정액을 넘어선다.",
  "stance": "b",
  "because_referent": "배수 도면과 맨홀 목격이 아래쪽 경로를 일관되게 가리킨다. 오염은 이미 흘러가고 있다.",
  "because_block_ids": [
    "21:12",
    "21:06",
    "21:03"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 차단은 이미 현장에 있는 인력으로 충분하다. 지금 남은 인력은 아래쪽에 가야 한다.",
  "utterance": "아래 저지대 대피 우선. 빌라 지하층 입주자 통보와 문 개방 지시. 배수망 하류 거주 구간 확인하라."
}
```

### 07

latency 5.198s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:12,21:16

```json
{
  "stance": "b",
  "inner_note": "물 접촉으로 기체가 회색으로 짙어졌고, 배수구에서 독한 냄새와 눈 따가움이 보고됐다. 유해물질 조회에서 물방울 금지와 기체 그림이 표시됐다. 세척수가 배수구로 흘러 주거지 저지대에 이미 도달했다.",
  "because_referent": "21:06 기체가 회색으로 짙어지고, 21:12 배수현이 독한 냄새와 눈 따가움을 보고했으며, 21:16 거품이 배수구로 흘러가고 작업자가 기침했다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:12",
    "21:16"
  ],
  "rejected_stance": "a",
  "rejected_reason": "야적장 내 차량 둘레 통제는 중요하지만, 이미 유해 기체와 오염수가 배수계로 방출되고 있다. 주거지 하층부의 인명피해 위험이 더 시급하다.",
  "utterance": "빌라 지하층 대피 준비하십시오. 분진 마스크 착용하고 문 개방 준비하십시오. 배수 경로 차단과 야적장 밸브 봉쇄는 동시 진행합니다."
}
```

### 08

latency 5.801s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:12,21:16

```json
{
  "inner_note": "적하목록의 '산업용 세정액'과 손상된 표지의 '물결/부식' 조합, 그리고 유해물질 조회의 경고 신호들이 모순을 드러낸다. 물 접촉 후 기체가 회색으로 짙어지고, 배수구에서 락스 냄새와 작업자의 신체 반응이 보고되고 있다. 초동 세척이 이미 오염 경로를 활성화했다.",
  "stance": "b",
  "because_referent": "오염이 이미 배수 경로를 타고 있고, 21:12 배수현의 보고와 거품의 흐름 방향이 주거지 저지대 진로를 명확히 가리킨다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:12",
    "21:16"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 통제는 필요하지만, 이미 시작된 하강 오염의 속도에 비하면 상대적으로 늦은 우선순위다. 지금 인력을 차량 둘레에 쏟으면 저지대 대피 시간을 잃는다.",
  "utterance": "빌라 지하층 긴급 대피 조치. 배수로 진입 금지 및 지하 출입구 개방. 인력 급파."
}
```

### 09

latency 6.133s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:12,21:16

```json
{
  "stance": "c",
  "inner_note": "적하목록과 표지 간 불일치가 누적되고 있다. 물 접촉 후 기체 변화와 유해물질 조회 경고가 동시에 들어왔다. 배수 도면, 반장 진술, 현장 목격이 모두 아래쪽 경로를 가리킨다. 이미 배수구까지 도달했으므로 그 위의 설비부터 제어해야 한다.",
  "because_referent": "배수현이 빗물받이에서 독한 냄새와 눈 자극을 보고했고, 세척반이 물막이판 없이 배수구로 거품을 몰고 있으며 기침이 나오고 있다. 이는 유해물질이 이미 배수 경로에 진입했음을 보여준다.",
  "because_block_ids": [
    "21:12",
    "21:16"
  ],
  "rejected_stance": "b",
  "rejected_reason": "주거지 저지대 대피는 필요할 수 있으나, 지금 당장의 누출 경로 제어가 먼저다. 배수 설비를 제어하지 못한 채 대피만 하면 오염이 계속 진행된다. 야간 요율표의 붉은 점, 유해물질 조회의 경고 기호, 현장의 기체 변화가 모두 긴급함을 말한다.",
  "utterance": "방재실 밸브 확인 요청. 분리조 상태 점검. 배수 경로 상부 제어 우선 진행한다."
}
```

### 10

latency 5.196s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 배수현_21:12,배수도면_언급

```json
{
  "stance": "c",
  "because_referent": "배수도 확인, 분리조 상태 점검",
  "because_block_ids": [
    "배수현_21:12",
    "배수도면_언급"
  ],
  "inner_note": "오염원이 이미 배수구를 거쳐 흘러내려가고 있다. 21:12 배수현이 빗물받이에서 냄새와 증상을 보고했다. 현장에서 물막이판 없이 거품을 배수 쪽으로 몰고 있는 상황이다. 중간 설비인 방재실 밸브와 분리조가 막혀 있거나 넘치면 그 아래 저지대 주거로의 확산을 막을 수 없다. 차량 자리는 이미 차단이 진행 중이고, 저지대 대피는 아직 급하지 않으나 — 배수 경로 차단이 먼저 필요하다.",
  "rejected_stance": "b",
  "rejected_reason": "저지대 대피는 중간 설비 실패 이후의 조치다. 지금은 중간 설비로 막을 수 있는 창이 열려 있다.",
  "utterance": "배수현, 방재실 차단밸브 즉시 확인. 분리조 수위와 막힘 상태 보고해라. 물막이판 지금 당겨. 거품은 멈춰."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | b | a | 물 접촉 후 기체 색이 변했고 유해물질 조회에서 물 금지와 기체 발생 표시가 동시에 나타났으며, 배수 경로에서 유독 냄새가 올라오고 작업자 신체 영향이 보이기 시작했기 때문이다. | 21:00 21:03 21:06 21:12 |
| 02 | b | a | 배수 아래쪽 주거지 저지대로 이미 오염이 내려가고 있기 때문이다. | 21:12 21:06 21:03 |
| 03 | b | a | 배수현의 락스 냄새 신고와 세척수 접촉 뒤 기체 변화 | 21:12 21:06 |
| 04 | c | — | 배수현의 락스 냄새 증언과 빗물받이 상황, 그리고 세척수가 물막이판 없이 배수구로 흐르는 현장 변화가 함께 들어왔기 때문이다. | 21:12 21:16 |
| 05 | b | a | 배수현의 목격과 세척반의 노출이 함께 말한다. 저지대 흐름이 이미 시작됐고, 담장 안 차단만으로는 부족하다. | 21:03 21:06 21:12 21:16 |
| 06 | b | a | 배수 도면과 맨홀 목격이 아래쪽 경로를 일관되게 가리킨다. 오염은 이미 흘러가고 있다. | 21:12 21:06 21:03 |
| 07 | b | a | 21:06 기체가 회색으로 짙어지고, 21:12 배수현이 독한 냄새와 눈 따가움을 보고했으며, 21:16 거품이 배수구로 흘러가고 작업자가 기침했다. | 21:03 21:06 21:12 21:16 |
| 08 | b | a | 오염이 이미 배수 경로를 타고 있고, 21:12 배수현의 보고와 거품의 흐름 방향이 주거지 저지대 진로를 명확히 가리킨다. | 21:03 21:06 21:12 21:16 |
| 09 | c | b | 배수현이 빗물받이에서 독한 냄새와 눈 자극을 보고했고, 세척반이 물막이판 없이 배수구로 거품을 몰고 있으며 기침이 나오고 있다. 이는 유해물질이 이미 배수 경로에 진입했음을 보여준다. | 21:12 21:16 |
| 10 | c | b | 배수도 확인, 분리조 상태 점검 | 배수현_21:12 배수도면_언급 |

**Sequence (kept calls):** `b,b,b,c,b,b,b,b,c,c`

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
