# TANK-G3-screen-r2 — arm `baseline`

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

- **Hypothesis:** G3 r2는 no-block baseline에서 기본 stance a가 의미 있는 수로 살아 있고, 도면 코드·맨홀 번호·골목 안개를 연결한 저지대 경로 full key를 받은 live arm에서 stance b로 움직일 것이다. r1에서 세 gate 모두 baseline b 10/10로 포화됐으므로, r2는 gate clock을 key carriers 앞으로 옮기고 verdict rows를 ingredient rows로 낮추며 binary stance set을 세 개의 plausible readings로 넓힌 뒤 같은 reduced screen을 반복한다.
- **Drop condition:** baseline에서 default a가 0/10이면 skill §3 rule 4에 따라 broken gate다. baseline이 live 기대 stance b를 9/10 이상 고르면 saturated baseline으로 headroom 없음이다. live가 b를 6/10 이하로 고르면 movement failure이고, 7/10 또는 8/10은 n=10 boundary라 definitive result로 보지 않는다. Positive screen은 baseline a가 3/10 이상, baseline b가 1/10 이하, live b가 9/10 이상일 때만 기록한다.
- **Contingency:** baseline이 a를 전혀 고르지 않으면 gate clock 이동 뒤에도 기본 독해가 죽은 것이다.
- **Contingency:** baseline이 b에 포화되면 excerpt가 아직 key conclusion을 제공하거나 live stance wording이 너무 우세한 것이다.
- **Contingency:** baseline이 c에 많이 몰리면 added plausible reading이 default를 훔치는 것이므로 stance c wording을 다시 좁힌다.
- **Contingency:** live가 b로 충분히 움직이지 않으면 key block wording이 later carriers를 결론으로 묶지 못한 것이다.
- **Contingency:** because_block_ids가 live arm에서 제공하지 않은 block id를 꾸며내면 fabricated block id로 따로 보고한다.

## Calls (verbatim)

### 01

latency 5.592s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:12,21:16

```json
{
  "inner_note": "물 접촉 뒤 기체가 짙어졌고 유해물질 조회 경고가 떴다. 배수 도면, 반장 진술, 맨홀 목격이 아래쪽 경로를 가리킨다. 눈앞의 야적장 통제와 잔여 누출 차단을 담장 밖보다 먼저 둔다.",
  "stance": "c",
  "because_referent": "배수현이 빗물받이에서 독한 락스 냄새와 눈 따가움을 보고했고, 세척수가 배수구 쪽으로 흘러가는 상황. 유해물질 조회에서 물 금지 경고가 떠 있는데 이미 물 접촉 뒤 기체가 회색으로 짙어졌다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:12",
    "21:16"
  ],
  "rejected_stance": "b",
  "rejected_reason": "빌라 지하층 대피는 배수 경로와 시설 상황을 먼저 파악한 뒤 판단해야 한다. 지금 현장의 즉각적 위험은 탱크 하부와 배수 흐름을 통제하는 것이 우선이다.",
  "utterance": "방재실 밸브 확인 출발. 유수분리조 상태 점검. 배수 경로 통제 준비."
}
```

### 02

latency 4.703s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:12,21:16

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 기체가 흰 김에서 회색으로 짙어지고, 배수구에서 락스 냄새와 함께 기침 반응이 나왔다. 유해물질 조회의 물낙금지와 회색 기체 기호가 현장 변화와 겹친다. 차단띠 세척이 아니라 화학 반응이 진행 중이다.",
  "because_referent": "새운 서류 코드와 골목 안개 같은 비탈길 경로가 지하층으로 향한다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:12",
    "21:16"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 차단만으로는 이미 배수로 들어간 물질의 확산을 막을 수 없다. 지하층 거주자 노출이 더 긴급하다.",
  "utterance": "대피 요청. b번 대응. 빌라 지하층 전원 대피 시작. 골목 입구 통제. 배수 상단 차단 동시 진행."
}
```

### 03

latency 4.077s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:12

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 흰 김이 회색으로 짙어지고 작업등 아래로 밀렸다. 유해물질 조회의 물방울 금지 표시와 기체 그림, 배수현의 독한 냄새와 눈 자극, 세척반의 기침이 같은 신호다. 차단띠와 희석으로는 막을 수 없는 반응이다.",
  "because_referent": "세척장 임시 출고의 서해정밀 코드와 유해물질 조회의 경고 표시가 같은 물질을 가리킨다",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:12"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 차단만으로는 이미 배수구를 타고 내려간 기체 확산을 막을 수 없다. 시간이 흐르는 중이다.",
  "utterance": "빌라 지하층 대피. 문 개방 우선. 배수 경로 차단 동시 진행."
}
```

### 04

latency 6.046s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:12

```json
{
  "inner_note": "세정액이라고 신고받았으나, 표지 손상으로 실제 품명을 확인할 수 없다. 물 접촉 후 기체가 흰색에서 회색으로 짙어지고, 배수구에서 락스 냄새가 올라온다. 유해물질 조회 화면에서 손상된 표지 조합과 서해정밀이 물 금지·기체 위험 행에 놓였다. 초동 세척은 오염을 확대했다.",
  "stance": "b",
  "because_referent": "물 접촉 후 회색 기체가 짙어지며 배수로로 내려가고, 기침과 눈 따가움이 나타났으므로 담장 아래 거주 지역의 기체 노출 위험이 최우선이다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:12"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 둘레 차단은 필요하나, 이미 세척수가 배수로로 흘러 기체 발생이 시작되었고 하부 지역 대피가 더 급하다. 시간이 남지 않았다.",
  "utterance": "야적장 전체 통제. 빌라 지하층 긴급 대피 신청. 골목 동쪽 출입문 개방. 마스크 착용 하에 배수 추적 시작."
}
```

### 05

latency 5.093s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 20:43,20:45,20:52,21:03,21:06,21:12

```json
{
  "inner_note": "물 접촉 뒤 기체가 짙어졌다. 현장 변화와 유해물질 조회 경고가 함께다. 배수 경로가 아래쪽으로 열려 있고, 이미 냄새와 호흡기 증상이 나온다.",
  "stance": "b",
  "because_referent": "유재승과 남기표가 세정액으로 읽었으나, 표지 조합은 물 접촉 금지를 가리킨다. 21:06에 세척수가 닿자 흰 김이 회색 기체로 짙어졌고, 21:12에 배수구에서 강한 반응이 나왔다.",
  "because_block_ids": [
    "20:43",
    "20:45",
    "20:52",
    "21:03",
    "21:06",
    "21:12"
  ],
  "rejected_stance": "c",
  "rejected_reason": "방재실 밸브와 분리조 확인은 처리 시간을 벌지만, 기체가 이미 골목을 타고 내려가고 있다. 아래쪽 거주 지역 보호가 먼저다.",
  "utterance": "지하층 대피 신청. 골목 입구 문 개방 요청. 유해 기체 경로 확인 중. 배수반 작업 중단."
}
```

### 06

latency 5.442s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:12

```json
{
  "inner_note": "물 접촉 뒤 기체가 짙어지는 현장 변화와 유해물질 조회 경고가 함께 들어왔다. 적하목록 세정액과 현장의 손상 표지·화학 반응이 안 맞는다. 배수현의 화학 냄새와 세척수 접촉 후 회색 기체 진화가 일관된다.",
  "stance": "b",
  "because_referent": "유해물질 조회의 닳은 표지 조합과 서해정밀 행에 물 금지·기체 위험이 함께 표시되었고, 초동 세척 뒤 흰 김이 회색으로 짙어지며 작업등 아래로 밀렸으며, 배수현이 화학 냄새와 눈 자극을 보고했기 때문이다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:12"
  ],
  "rejected_stance": "c",
  "rejected_reason": "분리조 확인은 현장의 기체 진화와 화학 반응을 멈추지 않는다. 아래쪽 배수 경로를 막지 못하면 이미 흐른 것이 담장 밖으로 나간다.",
  "utterance": "대피 우선. 빌라 지하층 거주자 즉시 외출시킨다. 모든 문 개방 지시."
}
```

### 07

latency 5.138s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:06,21:12,21:03,20:52

```json
{
  "inner_note": "물 접촉으로 기체가 회색으로 짙어지고 배수구에서 독한 냄새가 올라오는 현장 변화와 유해물질 조회의 경고 표시가 같은 신호를 보낸다. 적하목록과 표지 칸의 불일치, 그리고 물과의 반응이 세정액 설명과 맞지 않는다. 야간 요율표의 붉은 점과 유해물질 후보표의 금지 그림, 기체 그림이 함께 나타났다. 차량 자리 안의 액체 잔여가 우선이다.",
  "stance": "a",
  "because_referent": "현장에서 물 접촉 뒤 기체가 짙어지는 변화와 배수구에서 올라오는 독한 냄새, 유해물질 조회 화면의 경고 표시가 모두 같은 비탈길을 가리킨다.",
  "because_block_ids": [
    "21:06",
    "21:12",
    "21:03",
    "20:52"
  ],
  "rejected_stance": "b",
  "rejected_reason": "기체 짙어짐과 냄새는 차량 자리 누출의 진행 신호다. 빌라 지하층 대피는 배수 확산을 먼저 막지 않으면 뒤따를 일이다.",
  "utterance": "탱크 하부 액체 잔여 확인. 차량 둘레 차단과 밸브 봉쇄를 우선한다. 배수 추적 준비."
}
```

### 08

latency 5.16s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:06,21:12,21:16

```json
{
  "inner_note": "물 접촉 후 기체가 회색으로 짙어졌고, 서해정밀 출하지와 함께 물방울 금지 및 기체 그림이 나왔다. 닳은 표지는 W와 부식을 가리킨다. 락스 냄새와 눈 자극은 염소 계열을 강하게 시사한다. 적하목록 '산업용 세정액'과 현장 변화가 맞지 않는다.",
  "stance": "b",
  "because_referent": "현장에서 물 접촉 뒤 회색 기체가 짙어지고, 배수 라인을 따라 독한 냄새와 눈 자극이 아래쪽으로 전파되고 있기 때문이다.",
  "because_block_ids": [
    "21:06",
    "21:12",
    "21:16"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 하부 액체 확인이 우선이지만, 이미 세척수가 배수로 흘러 골목 안개가 형성되고 있다. 담장 밖 거주자 노출 시간을 더 줄 수 없다.",
  "utterance": "배수 경로 확인. 빌라 지하층 대피 지시. 문 개방과 환기 선행. 야적장 담장 밖 주민 사항 본부 보고."
}
```

### 09

latency 4.734s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:06,21:12,21:16

```json
{
  "stance": "b",
  "inner_note": "물 접촉 후 기체가 흰색에서 회색으로 짙어졌고, 유해물질 조회에서 물 금지 표시와 기체 그림이 함께 떴다. 배수구에서 락스 냄새, 작업등 아래로 밀려나가는 기체, 기침하는 작업자. 현장 변화가 초기 신고와 맞지 않는다.",
  "because_referent": "기체가 짙어지고 내려가는 방향이 골목과 지하층을 향하고 있다",
  "because_block_ids": [
    "21:06",
    "21:12",
    "21:16"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 하부 액체 차단도 필요하지만, 이미 세척수와 반응한 기체가 발생 중이고 배수로를 통해 아래쪽으로 확산되는 상황이 더 급박하다. 인력이 제한적인 지금 우선순위는 사람 보호다.",
  "utterance": "빌라 지하층 즉시 대피. 문 개방하고 환기. 배수 차단 확인 요청."
}
```

### 10

latency 5.634s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03 유해물질 조회,21:06 초동 세척수 접촉 후 기체 변화,21:12 배수구 냄새와 눈 따가움,21:16 기침과 거품 이동

```json
{
  "stance": "b",
  "inner_note": "물과의 접촉으로 기체가 급격히 짙어지고 있다. 목격된 화학 반응(하얀 물방울 가장자리가 끓어오름, 흰 김이 회색으로 변함)은 단순 세정액이 아닌 반응성 물질을 지목한다. 배수구 냄새, 기침 발생은 이미 기체가 확산 중임을 뜻한다. 새는 줄이 닿은 곳에서 비탈길로 흘러가는 액체는 골목과 지하층 방향이다.",
  "because_referent": "닳은 표지 조합과 서해정밀 출하지가 물 금지 그림 같은 행에 놓여 있고, 초동 물 접촉 뒤 회색 기체가 짙어지며 배수구와 골목 쪽으로 확산 중인 점",
  "because_block_ids": [
    "21:03 유해물질 조회",
    "21:06 초동 세척수 접촉 후 기체 변화",
    "21:12 배수구 냄새와 눈 따가움",
    "21:16 기침과 거품 이동"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 내 차단만으로는 이미 진행 중인 골목 방향 기체 확산과 지하층 침투를 막을 수 없다. 시간이 흐르고 있다.",
  "utterance": "빌라 지하층 대피. 골목 입구 문 개방 지시. 배수 차단은 별도 반이 담당한다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | c | b | 배수현이 빗물받이에서 독한 락스 냄새와 눈 따가움을 보고했고, 세척수가 배수구 쪽으로 흘러가는 상황. 유해물질 조회에서 물 금지 경고가 떠 있는데 이미 물 접촉 뒤 기체가 회색으로 짙어졌다. | 21:03 21:06 21:12 21:16 |
| 02 | b | a | 새운 서류 코드와 골목 안개 같은 비탈길 경로가 지하층으로 향한다. | 21:03 21:06 21:12 21:16 |
| 03 | b | a | 세척장 임시 출고의 서해정밀 코드와 유해물질 조회의 경고 표시가 같은 물질을 가리킨다 | 21:03 21:06 21:12 |
| 04 | b | a | 물 접촉 후 회색 기체가 짙어지며 배수로로 내려가고, 기침과 눈 따가움이 나타났으므로 담장 아래 거주 지역의 기체 노출 위험이 최우선이다. | 21:03 21:06 21:12 |
| 05 | b | c | 유재승과 남기표가 세정액으로 읽었으나, 표지 조합은 물 접촉 금지를 가리킨다. 21:06에 세척수가 닿자 흰 김이 회색 기체로 짙어졌고, 21:12에 배수구에서 강한 반응이 나왔다. | 20:43 20:45 20:52 21:03 21:06 21:12 |
| 06 | b | c | 유해물질 조회의 닳은 표지 조합과 서해정밀 행에 물 금지·기체 위험이 함께 표시되었고, 초동 세척 뒤 흰 김이 회색으로 짙어지며 작업등 아래로 밀렸으며, 배수현이 화학 냄새와 눈 자극을 보고했기 때문이다. | 21:03 21:06 21:12 |
| 07 | a | b | 현장에서 물 접촉 뒤 기체가 짙어지는 변화와 배수구에서 올라오는 독한 냄새, 유해물질 조회 화면의 경고 표시가 모두 같은 비탈길을 가리킨다. | 21:06 21:12 21:03 20:52 |
| 08 | b | a | 현장에서 물 접촉 뒤 회색 기체가 짙어지고, 배수 라인을 따라 독한 냄새와 눈 자극이 아래쪽으로 전파되고 있기 때문이다. | 21:06 21:12 21:16 |
| 09 | b | a | 기체가 짙어지고 내려가는 방향이 골목과 지하층을 향하고 있다 | 21:06 21:12 21:16 |
| 10 | b | a | 닳은 표지 조합과 서해정밀 출하지가 물 금지 그림 같은 행에 놓여 있고, 초동 물 접촉 뒤 회색 기체가 짙어지며 배수구와 골목 쪽으로 확산 중인 점 | 21:03 유해물질 조회 21:06 초동 세척수 접촉 후 기체 변화 21:12 배수구 냄새와 눈 따가움 21:16 기침과 거품 이동 |

**Sequence (kept calls):** `c,b,b,b,b,b,a,b,b,b`

**Stance coverage (sampled diagnostic):** offered `a`, `b`, `c` · unobserved in this arm: none

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
