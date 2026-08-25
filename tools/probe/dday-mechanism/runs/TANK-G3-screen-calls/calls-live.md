# TANK-G3-screen — arm `live`

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

- **Hypothesis:** G3는 no-block baseline에서 기본 stance a가 살아 있고, 하단빌라 대피 배분 full key를 받은 live arm에서 stance b로 움직일 것이다. 단 frozen record가 이미 key carrier를 담기 때문에 baseline이 stance b에 포화될 위험이 있으며, 그 경우 이 gate는 handover가 더할 headroom이 없는 것으로 판정한다.
- **Drop condition:** baseline에서 default가 0/10이면 skill §3 rule 4에 따라 broken gate다. baseline이 live 기대 stance b를 9/10 이상 고르면 saturated baseline으로 headroom 없음이다. live가 b를 6/10 이하로 고르면 movement failure이고, 7/10 또는 8/10은 n=10 boundary라 definitive result로 보지 않는다. Positive screen은 baseline default 9/10 이상, baseline live stance 1/10 이하, live b 9/10 이상일 때만 기록한다.
- **Contingency:** baseline이 default를 전혀 고르지 않으면 질문이나 stance label이 기본 독해를 잃은 것이다.
- **Contingency:** baseline이 stance b에 포화되면 frozen record만으로 이미 live 판단이 나오는 것이므로 handover screen에는 headroom이 없다.
- **Contingency:** live가 stance b로 충분히 움직이지 않으면 key block wording이 약하거나 default attraction이 지나치게 강하다.
- **Contingency:** because_block_ids가 live arm에서 제공하지 않은 block id를 꾸며내면 fabricated block id로 따로 보고한다.

## Calls (verbatim)

### 01

latency 5s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 기체가 짙어지는 현장 변화와 유해물질 조회 경고가 동시에 들어왔다. 배수 도면, 반장 진술, 맨홀 목격이 모두 아래쪽 경로를 가리킨다. 지하층 주민이 이미 노출되어 있다.",
  "because_referent": "유해물질 조회가 물 접촉 시 유독 기체 발생을 경고했고, 현장에서 기체가 짙어지며 하강하는 모습이 목격되었으며, 배수로가 하단빌라로 직결되어 지하 주민들이 이미 영향권 안에 있기 때문이다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 주변 유지는 추가 누출 차단에는 도움이 되지만, 이미 배수로를 통해 하강한 기체로부터 지하층 주민을 보호하지 못한다. 현재 상황에서는 노출된 대상을 먼저 격리하는 것이 우선이다.",
  "utterance": "아랫동네 긴급 통보 준비. 지하층 전주민 대피. 현장 응급차 증차 요청. 보건당국 연락."
}
```

### 02

latency 4.953s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "적하목록과 표지가 맞지 않는다. 유해물질 조회는 물 접촉 시 유독 기체 발생을 경고한다. 초동 세척수 투입 뒤 기체가 흰색에서 회색으로 짙어졌다. 배수로는 폐쇄된 분리조를 우회해 아래쪽으로 내려간다.",
  "stance": "b",
  "because_referent": "탱크 아래 누출이 계속되는 동안 기체가 배수로를 따라 아래쪽으로 흘러 이미 주민이 노출되고 있다",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 주변 통제만으로는 이미 배수로를 통해 아래로 흘러가는 유독 기체를 막을 수 없다. 지하층에 주민이 노출된 상황에서는 탱크 현장의 추가 통제보다 아래쪽 주민 대피가 더 시급하다",
  "utterance": "아랫동네 긴급 대피 요청한다. 지하층부터 우선으로. 구급차 대기 준비하고. 탱크 현장에는 세척 중단 지시하되 기체 방출 차단만 집중한다."
}
```

### 03

latency 6.083s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "적하목록 세정액과 닳은 표지의 불일치. 물 접촉 후 흰 김이 회색으로 짙어지고, 배수구 냄새와 작업자 반응. 맨홀에서 안개가 올라오고 지하층이 이미 영향 아래 있다. 탱크 통제만으로는 하류 피해를 막을 수 없다.",
  "because_referent": "배수 도면과 남기표 진술, 맨홀 목격이 모두 같은 경로를 가리킨다. 유해물질 조회는 물 접촉 시 유독 기체 발생을 명확히 했고, 21:06 현장 변화가 그것을 뒷받침한다. 이미 흐르는 것을 막기보다, 아래쪽에 사람이 있다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 주변만 통제하면 배수로를 타고 내려가는 유독 기체와 액체를 멈출 수 없다. 세척수를 줄여도 이미 흘렀고, 맨홀에서 안개가 올라오고 있다. 지하층 거주자 대피가 더 급하다.",
  "utterance": "아랫동네 대피. 지금 당장. 하단빌라 모든 동 주민 깨워 밖으로 낸다. 통장, 경비, 소방 합동. 가장 낮은 동부터 시작하고 지하층 우선이다."
}
```

### 04

latency 5.807s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "처음엔 낮은 위험의 세정액으로 봤지만, 닳은 위험 표지, 출전 전표 불일치, 물 접촉 시 유독 기체 경고, 현장의 회색 김과 락스 냄새가 모두 같은 방향을 가리킨다. 탱크 주변 통제만으로는 이미 배수로를 타고 내려간 것을 멈출 수 없다.",
  "stance": "b",
  "because_referent": "배수 도면, 남기표 진술, 맨홀 목격이 같은 아래쪽 경로를 가리키고 있으며, 지하층에 잠든 주민들이 노출돼 있기 때문이다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 주변 유지만으로는 이미 배수로를 통해 퍼져나간 유독 기체를 되돌릴 수 없고, 현장의 변화—물과의 반응, 짙어지는 김, 올라오는 냄새—가 물질의 성질을 다시 보여준다.",
  "utterance": "아랫동네 대피 시작. 119와 경찰에 지하층 긴급 신고 접수. 분리조 상태 확인하고 배수구 물막이 설치. 탱크 현장은 호스 중단, 모래로 잔여 액 봉쇄."
}
```

### 05

latency 5.57s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:35,21:39

```json
{
  "inner_note": "처음엔 세정제 신고, 물로 헹군다던 말을 믿었다. 그런데 시간이 흘렀다. 위험 표지 닳은 글자, 출하지 다름, 물 닿자 기체 변색, 배수현의 락스 냄새와 눈따가움, 맨홀 틈의 안개. 모두 같은 말을 한다. 이제 세정액이 아니다. 그리고 지하층 어르신들이 자고 있다.",
  "stance": "b",
  "because_referent": "지하층 거주자들이 유독 기체에 노출 중이고, 배수로를 타 내려가는 물질이 현재진행형 위협이다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_manhole",
    "21:35",
    "21:39"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 주변 통제만으로는 이미 하단부로 흘러내린 물질을 막을 수 없다. 지하 진입로가 이미 유해 공기로 차 있다.",
  "utterance": "아래쪽 지구대에 긴급 신고. 하단빌라 전 가구 긴급 대피. 지하층 우선. 유독 가스 발생 위험. 창문 열고 옥상으로 올린다."
}
```

### 06

latency 6.485s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "20:43부터 적하목록과 위험 표지가 맞지 않았다. 20:50 출하 전표와 진술의 시각 불일치, 20:52 위험물 요율표의 할증 표시, 21:03 유해물질 조회의 물 접촉 경고가 모두 같은 신호를 보냈다. 21:00 물과의 접촉 이후 현장이 변했다. 21:06 흰 김이 회색으로 짙어지는 것, 21:12 독한 락스 냄새, 21:16 거품이 물막이판 없이 배수구로 흘러가는 것, 21:31 맨홀 틈에서 밀려나오는 낮은 안개. 이것들은 더 이상 통상 절차의 문제가 아니다.",
  "because_referent": "하단빌라 지하층 주민들이 자고 있는 와중에 유독 기체가 배수로를 통해 우수관으로 내려가고 있다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 주변 유지는 확산을 늦출 뿐이다. 이미 배수로로 흘러간 것을 탱크 옆에서 붙잡을 수 없다. 시간을 쓸수록 지하층 밀폐 공간의 농도는 높아진다.",
  "utterance": "아랫동네 지하층 긴급 대피 시작해. 시민 보호가 우선이다."
}
```

### 07

latency 5.069s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "적하목록은 산업용 세정액이지만, 닳은 위험 표지와 출하 전표가 맞지 않는다. 물 접촉 시 유독 기체 발생 경고가 명시되었고, 실제 현장에서 물과 만난 뒤 기체가 회색으로 짙어졌다. 배수 경로는 도면, 반장 진술, 맨홀 목격이 모두 같은 아래쪽을 가리킨다. 지하층 주민들이 이미 유독 기체에 노출되는 중이다.",
  "stance": "b",
  "because_referent": "하단빌라 지하층 주민들이 유해물질에 노출되고 있다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 주변 통제만으로는 이미 배수된 유독 기체로부터 지하 주민을 보호할 수 없다. 눈 따가운 공기가 현관까지 차 있는 상황에서 추가 희석이나 세척은 상황을 악화시킬 뿐이다.",
  "utterance": "아랫동네 긴급 대피. 지하층부터 우선 소개. 119에 독성 기체 노출 정보 전달."
}
```

### 08

latency 5.663s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:23,21:27,21:31,21:35

```json
{
  "inner_note": "처음에는 적하목록의 세정액으로 읽었고 통상 절차를 따랐는데, 닳은 표지와 출하 전표 조회, 유해물질 경고가 겹쳤다. 물 접촉 뒤 기체가 회색으로 짙어지고, 배수 도면과 남기표 진술과 맨홀 목격이 모두 같은 아래쪽 경로를 가리킨다. 지하층에 사람이 있다.",
  "stance": "b",
  "because_referent": "현장 변화와 기술 경고, 도면이 모두 아래쪽 위험을 보이고 있다. 지하층 주민이 가장 먼저 닿는 곳이다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:23",
    "21:27",
    "21:31",
    "21:35"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 주변 유지는 세정액으로 먼저 생각했던 통상 판단이지만, 물 접촉 시 유독 기체 발생 경고와 현장의 기체 변화, 배수 도면이 함께 말한다. 탱크 아래를 못 보겠다는 말을 뒤로 미루는 것은 아래쪽 위험을 늦추는 것이다.",
  "utterance": "아랫동네 경보. 지하층 전체 대피 시작. 유수분리조 우회 남쪽 맨홀부터 차단해. 배수현에게 골목 체크와 통장 지원 지시."
}
```

### 09

latency 5.31s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 기체가 회색으로 짙어지고 있다. 유해물질 조회는 물 접촉 시 유독 기체 발생을 명확히 경고했다. 배수 도면, 남기표 진술, 맨홀 목격이 모두 같은 아래쪽 경로를 가리킨다. 지하층에 주민이 있고 이미 눈 따가운 공기가 현관을 차고 있다.",
  "because_referent": "유독 기체가 배수로를 통해 아래 주택으로 진입 중이기 때문에 지하층 주민 대피가 눈앞의 최우선이다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 주변 통제만으로는 이미 흐르기 시작한 유독 기체의 확산을 막을 수 없다. 배수로를 통한 전파는 현재 진행 중이고, 닫힌 지하층 거주자의 노출을 줄이는 것이 더 이상 미룰 수 없는 조치다.",
  "utterance": "아랫동네 긴급 대피. 지하층 우선. 119 추가 투입 요청한다. 택시, 앰뷸런스 출동 준비."
}
```

### 10

latency 5.28s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:23,21:27,21:31,21:35

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 유독 기체 발생 경고와 현장 변화가 일치한다. 배수 도면, 맨홀 목격, 반장 진술이 모두 아래쪽 경로를 가리킨다. 지하층 주민이 이미 기체 노출 중이다.",
  "because_referent": "유해물질 조회 경고와 현장에서 짙어지는 기체, 그리고 아래쪽으로 내려가는 배수 경로가 함께 지시하는 바이다. 지하층 주민 안전이 가장 높은 우선순위다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:23",
    "21:27",
    "21:31",
    "21:35"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 주변 유지는 누출 원인 차단이 먼저라는 명분이지만, 이미 물 접촉 뒤 유독 기체 발생이 시작되었고 배수로를 통해 아래쪽으로 이동 중이다. 눈앞 통제보다 실제 피해가 이미 진행 중인 경로를 차단하는 게 더 급하다.",
  "utterance": "아랫동네 긴급 기상. 지하층 주민 전원 옥외 대피. 119 추가 투입 요청한다."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | b | a | 유해물질 조회가 물 접촉 시 유독 기체 발생을 경고했고, 현장에서 기체가 짙어지며 하강하는 모습이 목격되었으며, 배수로가 하단빌라로 직결되어 지하 주민들이 이미 영향권 안에 있기 때문이다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 02 | b | a | 탱크 아래 누출이 계속되는 동안 기체가 배수로를 따라 아래쪽으로 흘러 이미 주민이 노출되고 있다 | g3_k1_drawing g3_k1_manhole |
| 03 | b | a | 배수 도면과 남기표 진술, 맨홀 목격이 모두 같은 경로를 가리킨다. 유해물질 조회는 물 접촉 시 유독 기체 발생을 명확히 했고, 21:06 현장 변화가 그것을 뒷받침한다. 이미 흐르는 것을 막기보다, 아래쪽에 사람이 있다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 04 | b | a | 배수 도면, 남기표 진술, 맨홀 목격이 같은 아래쪽 경로를 가리키고 있으며, 지하층에 잠든 주민들이 노출돼 있기 때문이다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 05 | b | a | 지하층 거주자들이 유독 기체에 노출 중이고, 배수로를 타 내려가는 물질이 현재진행형 위협이다. | g3_k1_drawing g3_k1_manhole 21:35 21:39 |
| 06 | b | a | 하단빌라 지하층 주민들이 자고 있는 와중에 유독 기체가 배수로를 통해 우수관으로 내려가고 있다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 07 | b | a | 하단빌라 지하층 주민들이 유해물질에 노출되고 있다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 08 | b | a | 현장 변화와 기술 경고, 도면이 모두 아래쪽 위험을 보이고 있다. 지하층 주민이 가장 먼저 닿는 곳이다. | 21:03 21:06 21:23 21:27 21:31 21:35 |
| 09 | b | a | 유독 기체가 배수로를 통해 아래 주택으로 진입 중이기 때문에 지하층 주민 대피가 눈앞의 최우선이다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 10 | b | a | 유해물질 조회 경고와 현장에서 짙어지는 기체, 그리고 아래쪽으로 내려가는 배수 경로가 함께 지시하는 바이다. 지하층 주민 안전이 가장 높은 우선순위다. | 21:03 21:06 21:23 21:27 21:31 21:35 |

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
