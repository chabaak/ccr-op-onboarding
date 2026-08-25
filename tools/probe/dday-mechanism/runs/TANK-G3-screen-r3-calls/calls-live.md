# TANK-G3-screen-r3 — arm `live`

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

latency 5.908s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:06

```json
{
  "inner_note": "물 접촉으로 기체가 회색으로 짙어지고, 배수 경로가 명확하며, 주거지 저지대 경고가 들어왔다. 표지 손상과 유해물질 조회가 같은 행에 놓였고, 물질 반응이 현장에서 이미 시작됐다.",
  "stance": "b",
  "because_referent": "빌라 지하 맨홀에서 이미 낮은 안개가 올라오고 있고, 배수 경로가 주거지로 연결되어 있으며, 물 접촉 뒤 기체 변화가 가시적이다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_manhole",
    "21:06"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 차단은 필요하나, 이미 진행 중인 오염이 주거지 저지대로 내려가는 것을 막는 것이 더 시급하다. 차량 위험보다 주민 노출이 우선이다.",
  "utterance": "빌라 지하층 대피 준비하라. 먼저 보낸다."
}
```

### 02

latency 4.437s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "because_referent": "오염이 주거지 저지대로 내려가고 있기 때문이다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 둘레 차단은 이미 초기 통제인데, 지금은 세척수가 배수로를 타고 저지대로 흘러가고 있는 상황이다. 남쪽 맨홀에서 안개가 올라오고 빌라 지하층이 위험해졌다.",
  "inner_note": "물 접촉 뒤 기체가 회색으로 짙어지는 변화와 유해물질 조회의 물 금지 경고가 함께 들어왔다. 배수 도면과 맨홀 CCTV가 저지대 경로를 가리킨다. 세척반이 물막이판 없이 배수구로 거품을 몰고 있다. 시간이 흐르고 있다.",
  "utterance": "빌라 지하층 대피 먼저. 문 개방 요청."
}
```

### 03

latency 3.69s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "물 접촉 뒤 기체가 짙어졌다. 닳은 표지 조합이 물 금지 물질을 가리킨다. 배수로는 폐쇄 표시가 있지만 세척수는 이미 남쪽으로 흐르고 있다. 맨홀에서 안개가 올라온다.",
  "stance": "b",
  "because_referent": "주거지 저지대 오염 확산이 가장 빠른 피해다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 차단은 재발 방지이지만, 이미 흐른 것을 막지 못한다.",
  "utterance": "빌라 지하층 대피 착수. 문 개방 준비하고 주민 연락 시작해라."
}
```

### 04

latency 4.956s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "물 접촉 후 기체가 흰색에서 회색으로 짙어지는 변화를 봤고, 유해물질 조회에서 물금지와 기체 그림이 나왔다. 배수도면, 반장 진술, 맨홀 CCTV가 모두 남쪽 아래 경로를 가리킨다. 이미 배수구에서 락스 냄새와 안개 징후가 올라오고 있다.",
  "stance": "b",
  "because_referent": "저지대 주거지로 내려가는 오염 경로가 확실해졌기 때문",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 차단은 중요하지만, 이미 유해물질이 배수로를 통해 하단빌라 방향으로 이동 중이라는 징후가 명확하다. 시간을 더 줄 수 없다.",
  "utterance": "지하층 대피 우선. 하단빌라 입주자 안내와 지하층 출입문 개방 즉시 시행. 배수로 차단과 맨홀 감시 병행."
}
```

### 05

latency 5.446s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:03,21:06,21:12

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 기체가 짙어지는 현장 변화와 유해물질 조회 경고가 함께 들어왔다. 배수 도면, 반장 진술, 맨홀 목격이 같은 아래쪽 경로를 가리킨다.",
  "because_referent": "유재승이 차단과 희석을 권했지만, 21:06 물 접촉 뒤 기체가 짙어진 것이 통상 절차가 아닌 신호다. 21:12 배수현의 증언과 맨홀 가스가 함께 지하층 위험을 확인한다.",
  "because_block_ids": [
    "21:03",
    "21:06",
    "21:12",
    "g3_k1_drawing",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 절차는 아직 누출원 확인 직전이다. 이미 흘린 것이 저지대로 내려가는 중이면 차단보다 피난이 급하다.",
  "utterance": "지하층 대피 지시 출발했다. 빌라 남쪽 모든 창문 개방하고 입주자 상향 이동 확인하라."
}
```

### 06

latency 4.137s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 기체가 짙어졌다. 배수 경로가 명확하고, 맨홀에서 이미 기체가 올라오고 있다. 주거지 저지대가 더 급하다.",
  "because_referent": "빌라 지하층이 유해 기체의 최종 목표지이고, 21:12와 21:06의 징후가 이미 배수로를 타고 내려가고 있음을 보인다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 차단도 필요하지만, 시간이 흐르는 동안 기체는 이미 맨홀을 통해 아래쪽으로 내려가고 있다. 저지대 대피가 더 늦으면 안 된다.",
  "utterance": "빌라 지하층 대피 및 문 개방 우선. 배수 경로로 유해 기체가 내려가는 중이다."
}
```

### 07

latency 6.17s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:06,21:16,21:12

```json
{
  "stance": "b",
  "because_referent": "낮은 안개에서 짙어진 회색 기체가 이미 지하 공간에 있고, 물막이 없이 배수구로 거품을 몰아 경로를 확정했으며, 주거지 저지대 대피가 늦으면 취할 수 없다.",
  "because_block_ids": [
    "g3_k1_manhole",
    "21:06",
    "21:16",
    "21:12"
  ],
  "inner_note": "초기에는 적하목록의 세정액 표시를 믿고 희석을 선택했다. 그러나 표지 조합 W/부식의 유해물질 경고, 물 접촉 뒤 기체가 회색으로 짙어진 현장 변화, 그리고 이미 배수로를 타 지하 맨홀까지 내려간 증거가 함께 모였다. 차량과 중간 설비는 아직도 통제 시간이 있지만, 지하층 주민은 기체 노출 중이다.",
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 통제와 밸브 봉쇄는 필요하나, 이미 배수로를 타고 지하까지 내려간 유해 기체 앞에서는 후순위다. 차단의 여유는 아직 있으나 대피의 여유는 없다.",
  "utterance": "지하층 대피 우선. 빌라 관리실 통보, 지하층 문 개방과 상층 대피 지시. 배수로 경로 확정, 주거지 저지대 취급 전환."
}
```

### 08

latency 4.106s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "inner_note": "물 접촉 뒤 기체가 회색으로 짙어졌고, 유해물질 조회에서 물 금지와 기체 그림이 나왔다. 배수 도면과 맨홀 CCTV가 같은 아래쪽 경로를 가리킨다. 현장에서 이미 기침이 나오고 락스 냄새가 올라온다.",
  "stance": "b",
  "because_referent": "아래쪽 주거지가 이미 오염 징후를 보이고 있기 때문이다.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 둘레 차단은 중요하지만, 이미 기체가 배수로를 통해 아래로 흘러가고 있는 상황에서는 주거지 피해를 먼저 막아야 한다.",
  "utterance": "빌라 지하층 대피 요청. 지하 출입구 개방과 환기. 119 구급 대기."
}
```

### 09

latency 5.465s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

```json
{
  "stance": "b",
  "inner_note": "물 접촉 뒤 기체가 회색으로 짙어졌다. 유해물질 조회와 현장 변화가 같은 신호를 보낸다. 배수 도면, 반장 진술, 맨홀 목격이 모두 아래쪽 경로를 가리킨다.",
  "because_referent": "21:06의 흰 김이 회색으로 짙어지는 현상과 21:03의 유해물질 조회 화면의 물 금지 표시, 그리고 아래쪽 배수 경로의 증거들이 함께.",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_foreman",
    "g3_k1_manhole"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 자리 차단도 필요하지만, 21:12에서 이미 배수로로 강산성 물질이 내려가고 있으며 21:06의 기체 변화는 물 반응이 진행 중임을 보여준다. 시간이 흐를수록 지하층 주민의 위험이 커진다.",
  "utterance": "지하층 대피 요청. 빌라 지하 입주자 전원 옥상 이동 지시. 환기구·통풍구·방화문 개방하라."
}
```

### 10

latency 3.824s · stop_reason `tool_use` · schema_retries 0 · foreign_tool_uses 0

problems: because_block_ids unknown: 21:06,21:12

```json
{
  "inner_note": "표지는 부식성과 수반응성을 함께 드러낸다. 물 접촉 뒤 기체가 회색으로 짙어졌고, 배수로는 남쪽 경로로 이어져 있으며, 맨홀에서 이미 안개가 올라오고 있다. 빌라 지하는 이미 노출된 상태다.",
  "stance": "b",
  "because_referent": "오염이 주거지 저지대로 내려가고 있기 때문이다",
  "because_block_ids": [
    "g3_k1_drawing",
    "g3_k1_manhole",
    "21:06",
    "21:12"
  ],
  "rejected_stance": "a",
  "rejected_reason": "차량 둘레 차단만으로는 이미 흘러내린 오염을 막을 수 없다",
  "utterance": "빌라 지하층 대피 요청. 지하 출입문 개방 지시. 배수 경로 차단과 동시 진행."
}
```

## Arm table

| # | stance | rejected_stance | because_referent | because_block_ids |
|---|---|---|---|---|
| 01 | b | a | 빌라 지하 맨홀에서 이미 낮은 안개가 올라오고 있고, 배수 경로가 주거지로 연결되어 있으며, 물 접촉 뒤 기체 변화가 가시적이다. | g3_k1_drawing g3_k1_manhole 21:06 |
| 02 | b | a | 오염이 주거지 저지대로 내려가고 있기 때문이다. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 03 | b | a | 주거지 저지대 오염 확산이 가장 빠른 피해다. | g3_k1_drawing g3_k1_manhole |
| 04 | b | a | 저지대 주거지로 내려가는 오염 경로가 확실해졌기 때문 | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 05 | b | a | 유재승이 차단과 희석을 권했지만, 21:06 물 접촉 뒤 기체가 짙어진 것이 통상 절차가 아닌 신호다. 21:12 배수현의 증언과 맨홀 가스가 함께 지하층 위험을 확인한다. | 21:03 21:06 21:12 g3_k1_drawing g3_k1_manhole |
| 06 | b | a | 빌라 지하층이 유해 기체의 최종 목표지이고, 21:12와 21:06의 징후가 이미 배수로를 타고 내려가고 있음을 보인다. | g3_k1_drawing g3_k1_manhole |
| 07 | b | a | 낮은 안개에서 짙어진 회색 기체가 이미 지하 공간에 있고, 물막이 없이 배수구로 거품을 몰아 경로를 확정했으며, 주거지 저지대 대피가 늦으면 취할 수 없다. | g3_k1_manhole 21:06 21:16 21:12 |
| 08 | b | a | 아래쪽 주거지가 이미 오염 징후를 보이고 있기 때문이다. | g3_k1_drawing g3_k1_manhole |
| 09 | b | a | 21:06의 흰 김이 회색으로 짙어지는 현상과 21:03의 유해물질 조회 화면의 물 금지 표시, 그리고 아래쪽 배수 경로의 증거들이 함께. | g3_k1_drawing g3_k1_foreman g3_k1_manhole |
| 10 | b | a | 오염이 주거지 저지대로 내려가고 있기 때문이다 | g3_k1_drawing g3_k1_manhole 21:06 21:12 |

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
