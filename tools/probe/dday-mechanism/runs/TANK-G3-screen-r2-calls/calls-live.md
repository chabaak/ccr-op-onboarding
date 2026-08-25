# TANK-G3-screen-r2 — arm `live`

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

latency 5.084s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "물과 닿은 뒤 기체가 회색으로 짙어졌다. 유해물질 조회에서 물 금지 표기가 나왔다. 배수 경로와 맨홀 안개가 같은 아래쪽을 가리킨다. 차량 주변 통제는 필요하지만, 지금 눈앞의 위험은 이미 배수로로 흘러가고 있다.",
  "stance": "b",
  "because_referent": "21:06의 회색 기체 진화와 21:12의 락스 냄새, 21:03의 유해물질 경고가 가리키는 바가 명확하다. 배수 도면과 맨홀 목격, 남기표의 진술이 모두 아래쪽 경로를 가리킨다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 통제도 필요하지만, 21:12 시점에 이미 배수로에서 반응이 감지되었다. 차단에 시간을 쓸 여유가 없다.",
  "utterance": "빌라 지하층 대피 준비. 문 개방 먼저 보낸다. 배수 경로 확인 중."
}
```

### 02

latency 6.528s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "물 접촉 뒤 기체가 회색으로 짙어졌고, 유해물질 조회에서 물 금지와 기체 그림이 함께 떴다. 배수 도면과 맨홀 목격이 아래쪽 경로를 가리킨다. 차량 하부 액체 차단만으로는 부족하다.",
  "stance": "b",
  "because_referent": "유재승이 세척장 임시 출고라 말했고, 야간 요율표 W/부식 조합이 붉은 점을 보였으며, 유해물질 조회에서 같은 출하지 행에 물 금지 기호와 회색 기체가 나타났다. 물접촉 뒤 기체가 짙어진 현장 변화가 이를 뒷받침한다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 하부 액체 차단에 집중하면 배수로를 통해 이미 흐르기 시작한 물질의 흐름을 놓친다. 빗물받이의 락스 냄새와 맨홀의 낮은 안개, 그리고 지속되는 기체 발생이 하단빌라 지하층 거주자의 즉각적 위험을 보인다.",
  "utterance": "본부, 빌라 지하층 대피 신호 보낸다. 대피로 확보하고 현장 문 개방 요청한다. 배수로 차단 병행."
}
```

### 03

latency 6.95s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:12,21:06

```json
{
  "stance": "b",
  "because_referent": "21:03의 유해물질 조회 결과와 21:12 배수현의 독한 냄새 신고, 그리고 21:06의 물과의 반응으로 회색 기체가 짙어지는 현장 변화가 함께 지목하는 것은 이미 배수로를 통해 지하로 침투한 유해물질의 위험이다.",
  "because_block_ids": [
    "21:03",
    "21:12",
    "21:06",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 하부 차단은 필요하지만, 그 사이에도 이미 기체가 배수로를 통해 지하층으로 확산되고 있다는 신호들이 연속으로 들어오고 있다. 잔여 액체 차단만으로는 이미 발생한 기체 노출을 막을 수 없다.",
  "inner_note": "초동에 목록 칸의 \"물결 윗획만 남았다\"는 것을 세정액으로 받아들인 내가의 결함이다. 21:03에서 뒤늦게 표지 조합이 두 칸을 함께 읽혀야 함을 알았다. 그 사이 21:06에 이미 기체가 발생했고, 21:12에 배수로에서 독성 냄새가 올라오고 있다. 지하층 거주자들은 아직 모른다.",
  "utterance": "스탠스 B 확정. 빌라 지하층 긴급 대피 지시. 배수로 가스 확산 경로 차단. 남쪽 맨홀 폐쇄 조치 요청. 119 추가 투입."
}
```

### 04

latency 5.743s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "물 접촉 후 기체가 회색으로 짙어졌다. 유해물질 조회에서 표지 조합과 서해정밀이 같은 행의 물 금지 그림과 회색 기체 그림을 보인다. 배수 도면상 남쪽 경로는 유수분리조 옆을 지나 우수관으로 이어지고, 공사 뒤 맨홀 번호가 바뀌었으며, CCTV에 낮은 안개가 올라오고 있다. 차단과 밸브 봉쇄만으로는 이미 배수로를 통해 흐르고 있는 유해물질을 막을 수 없다.",
  "because_referent": "배수 도면, 반장 진술, 맨홀 목격이 같은 아래쪽 경로를 가리키고 있기 때문이다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차단과 밸브 봉쇄는 현장에서의 추가 확산을 늦출 수 있지만, 이미 배수로를 타고 흘러가는 유해물질의 경로상 주민 피해를 막지 못한다.",
  "utterance": "스탠스 브라보. 지하층 대피와 골목 맨홀 확인을 먼저 보낸다. 유해물질 조회와 기체 변화를 함께 본다."
}
```

### 05

latency 5.974s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "차량 자리 통제와 밸브 봉쇄가 누출 원점을 막는 우선이다. 그러나 배수 도면, 반장 진술, 맨홀 목격이 아래쪽 경로를 가리킨다. 물과 기체의 변화가 함께 들어왔고, 유해물질 조회 화면과 서해정밀 코드가 같은 행에 놓였다. 야적장 안 차단보다 영향권 밖 주민 안전이 더 급하다.",
  "stance": "b",
  "because_referent": "배수 도면의 남쪽 경로와 새로 불린 맨홀 번호, 그리고 하단빌라 맨홀에서 올라오는 안개가 영향권을 가리키고 있기 때문이다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 내 액체 통제도 필요하나, 21:06의 기체 변화와 21:12의 배수구 냄새, 21:16의 거품 확산이 이미 누출이 담장을 넘었음을 보인다. 눈앞의 야적장 통제보다 주민 영향권이 더 긴급하다.",
  "utterance": "빌라 지하층 대피 준비. 문 개방 신호 보낸다. 배수 경로 확인 중."
}
```

### 06

latency 5.838s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "물 접촉 뒤 낮은 안개가 회색으로 짙어졌다. 유해물질 조회에서 물금지 표시와 기체 그림이 붙었고, 배수 현장에서는 락스 냄새와 기침이 나왔다. 눈앞의 차단은 이미 늦은 상태다.",
  "stance": "b",
  "because_referent": "빌라 지하층의 맨홀 틈에서 올라오는 안개는 배수로를 통해 유해기체가 이미 아래로 흘러 내려가고 있다는 신호다.",
  "because_block_ids": [
    "g3_k1_manhole",
    "g3_k1_drawing"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 안의 액체 차단은 통상 절차지만, 21:06 회색 기체 발생과 21:12 배수구 독한 냄새는 물 희석으로 유해기체가 발생해 이미 배수로로 흘러내려가고 있음을 보여준다. 눈앞의 누출 지점 차단만으로는 부족하다.",
  "utterance": "스탠스 브라보. 빌라 지하층 대피 우선. 방재실 배수 차단 신청하고 인력 급파."
}
```

### 07

latency 5.794s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 기체가 짙어졌다. 21:06 흰 김이 회색으로 변했고, 21:03 유해물질 조회에서 물 금지 기호와 회색 기체 그림이 함께 떴다. 21:12 배수현이 독한 락스 냄새를 맡았고, 21:16 작업등 아래로 기체가 밀렸다. 하단빌라 맨홀에서 이미 안개가 올라오고 있다.",
  "because_referent": "하단빌라 지하층 주민들이 물질과 접근하고 있을 위험이 높다. 배수 도면과 맨홀 위치, 공사 뒤 변경된 배수 경로가 모두 아래쪽 주거지로 향한다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 안의 액체 차단도 필요하지만, 이미 배수로로 흘러가 기체 발생이 시작된 상황이다. 차단과 세척 단계에서는 추가 누출을 막기 어렵다.",
  "utterance": "대피 우선. 하단빌라 지하층 개방 지시. 배수로 경로 확인 동시 진행."
}
```

### 08

latency 5.352s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "물과의 접촉 뒤 기체가 회색으로 짙어졌고, 배수현이 유해물질 반응을 보고했으며, 맨홀에서 안개가 올라오는 상황이다. 새 출하지 코드와 배수 도면이 같은 남쪽 경로를 가리킨다. 유수분리조 폐쇄 표시와 함께 물질이 빌라 지하로 흐르고 있는 신호들이 맞아떨어진다.",
  "because_referent": "지하층 주민들이 물질에 노출되는 위험이 현장 확산보다 크다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "탱크 액체 차단도 필요하지만, 이미 누출이 배수로를 타 내려가고 있다는 신호가 여럿이다. 지하 안개와 배수현의 냄새 신고가 차량 자리 통제보다 긴급성이 높다.",
  "utterance": "스탠스 브라보. 빌라 지하층 긴급 대피 요청. 골목 배수구 차단과 현장 밸브 확인. 본부에 보고 준비."
}
```

### 09

latency 5.68s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06

```json
{
  "stance": "b",
  "because_referent": "물 접촉 뒤 기체가 짙어지는 현장 변화와 유해물질 조회 경고가 함께 들어왔고, 배수 도면, 반장 진술, 맨홀 목격이 같은 아래쪽 경로를 가리키고 있다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 내 차단만으로는 이미 배수로를 통해 흘러내린 누출물을 막을 수 없다. 21:12의 락스 냄새와 21:06의 회색 기체 농축이 배수 경로 진입을 이미 나타내고 있다.",
  "inner_note": "물과 반응하는 유해물질이 배수로를 타고 지하로 흘러내리고 있다. 맨홀 안개와 세척수 경로가 일치한다. 지하층 주민이 가장 가까운 피해 대상이다.",
  "utterance": "빌라 지하층 대피 지시. 남쪽 배수로 차단과 문 개방 조치 먼저 출동. 현장에서 추가 세척 중단."
}
```

### 10

latency 4.622s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "물과 접촉한 뒤 기체가 짙어지고, 배수 경로 상 하단빌라 맨홀에서 이미 안개가 올라오고 있다. 세척수 유입으로 기체 발생이 가속되는 중이다.",
  "because_referent": "하단빌라 지하층이 배수 경로 하류에 있고, 유해물질 조회 화면의 경고와 현장의 회색 기체 짙어짐이 수소화합물 반응을 가리킨다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 차단만으로는 이미 배수로를 타고 흐르는 오염수와 기체 발생을 막을 수 없다. 시간이 남지 않았다.",
  "utterance": "빌라 지하층 대피 급히 시작. 문 개방. 배수 경로 확인 중. 기체 발생 가능성 고."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | b | a | 21:06의 회색 기체 진화와 21:12의 락스 냄새, 21:03의 유해물질 경고가 가리키는 바가 명확하다. 배수 도면과 맨홀 목격, 남기표의 진술이 모두 아래쪽 경로를 가리킨다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 02 | b | a | 유재승이 세척장 임시 출고라 말했고, 야간 요율표 W/부식 조합이 붉은 점을 보였으며, 유해물질 조회에서 같은 출하지 행에 물 금지 기호와 회색 기체가 나타났다. 물접촉 뒤 기체가 짙어진 현장 변화가 이를 뒷받침한다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 03 | b | a | 21:03의 유해물질 조회 결과와 21:12 배수현의 독한 냄새 신고, 그리고 21:06의 물과의 반응으로 회색 기체가 짙어지는 현장 변화가 함께 지목하는 것은 이미 배수로를 통해 지하로 침투한 유해물질의 위험이다. | 21:03 21:12 21:06 g3_k1_manhole |
| 04 | b | a | 배수 도면, 반장 진술, 맨홀 목격이 같은 아래쪽 경로를 가리키고 있기 때문이다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 05 | b | a | 배수 도면의 남쪽 경로와 새로 불린 맨홀 번호, 그리고 하단빌라 맨홀에서 올라오는 안개가 영향권을 가리키고 있기 때문이다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 06 | b | a | 빌라 지하층의 맨홀 틈에서 올라오는 안개는 배수로를 통해 유해기체가 이미 아래로 흘러 내려가고 있다는 신호다. | g3_k1_manhole g3_k1_drawing |
| 07 | b | a | 하단빌라 지하층 주민들이 물질과 접근하고 있을 위험이 높다. 배수 도면과 맨홀 위치, 공사 뒤 변경된 배수 경로가 모두 아래쪽 주거지로 향한다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 08 | b | a | 지하층 주민들이 물질에 노출되는 위험이 현장 확산보다 크다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 09 | b | a | 물 접촉 뒤 기체가 짙어지는 현장 변화와 유해물질 조회 경고가 함께 들어왔고, 배수 도면, 반장 진술, 맨홀 목격이 같은 아래쪽 경로를 가리키고 있다. | 21:03 21:06 g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 10 | b | a | 하단빌라 지하층이 배수 경로 하류에 있고, 유해물질 조회 화면의 경고와 현장의 회색 기체 짙어짐이 수소화합물 반응을 가리킨다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |

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
