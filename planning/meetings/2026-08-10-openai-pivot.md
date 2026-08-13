# 회의록 — OpenAI Game Builders Seoul 참가 결정 · 새 저장소 · 진행 방식

## TL;DR

| 항목 | 내용 |
| --- | --- |
| **일시** | 2026-08-10 (월) |
| **성격** | NHN 제출 완료 직후, 후속 대회 참가를 위한 킥오프. |

- **[OpenAI Game Builders Seoul](https://openaigame2026.com/#main) (08/04–08/31)** Track 1에 `긴급상황대응실 운영자 임용을 축하합니다` 를 개선하여 참가.
- **마감**: 08/26 EOD
- 새 저장소는 **GitHub Organization** 아래에 만든다 → [`chabaak/ccr-op-onboarding`](https://github.com/chabaak/ccr-op-onboarding) 생성 완료.
- 아이디어·버그·논의는 전부 **GitHub Issues**로 남기고, **Discord 웹훅**으로
  서로의 작업을 실시간 추적한다.
- 개발은 **Claude Code → Codex** 로 전환. 서사는 "Claude로 만든 게임을 Codex로
  확장했다".

---

## 1. Overview

### 1-1. Competition Overview

| 항목 | 내용 |
| --- | --- |
| 대회 | OpenAI Game Builders Seoul (OpenAI × Com2uS Holdings) |
| 기간 | 2026-08-04 ~ 08-31 |
| Track 1 제출 마감 | 08/26 |
| 심사 | 08/27 |
| 파이널리스트 발표 | 08/28 ~ 08/30 |
| 팀 규모 | 최대 3인 (우리는 2인) |
| 제출물  | 브라우저 플레이 링크(로그인 없이 공개) · 16:9 썸네일 · 제목 · 200자 설명 |
| 선택 제출물 | 3분 미만 데모 영상 · Codex 활용 설명 |
| 심사 기준 | Playability · Originality · Codex Collaboration · Release Potential (Hive) · Presentation |
| 기존 프로젝트 | 허용. 단 대회 기간 중의 신규 개발이 문서화되어야 한다 |

### 1-2. Schedule

민서 휴가 08/14–22, 윤석 타 프로젝트 마감 ~08/23

| 구간 | 인원 | 성격 | 할 일 |
| --- | --- | --- | --- |
| 08/12–13 | 민서 | 퇴근 후 | **판단**. 구현 아님 |
| 08/14–22 | 민서 | 자투리 시간, 긴 세션 불가 | 잘게 쪼갠 구조 작업 + Codex 습득 + 하우스키핑 |
| 08/24–25 | 민서, 윤석 | 퇴근 후 | 이슈 트리아지 + 게임 감각·마감 작업 + 제출물 제작 |
| 08/26 | — | — | 제출 |

## 2. Repository

1. **원본 저장소(`alstjgg/nhn-game-2026`) 동결**
   - NHN 대회 규정상 갱신 금지.
   - 새 저장소는 클론이며, 이후 원본에는 커밋하지 않는다.
2. **GitHub Organization 아래에 신규 생성** — [`chabaak/ccr-op-onboarding`](https://github.com/chabaak/ccr-op-onboarding)
   - 저장소명은 새 게임 제목 **Central Control Room Operator Onboarding**의 약어다. 즉 제목 변경이 이미 저장소 이름에 반영되어 있다.
     - **제목만 바꾼다. 시설명(`긴급상황대응실`)은 당분간 그대로 둔다.** 두 작업의 비용이 다르기 때문이다 — 전체 제목은 셸에 있는 파일이 하나도 없어(`index.html`의 `<title>`조차 `ERR-2 · 멈춘 회전문 — 운영자 단말`) 문서 수정 수준이지만, 시설명은 28개 파일에 박혀 있고 그중 `proxy/prompts/{reporter,judgment}/*`와 `proxy/src/prompt-bundle.generated.ts`는 **프롬프트 본문**이라 프로브 재측정을 부른다. `data/scenario/멈춘회전문/*`과 `planning/scenario-writer-brief.md`(팩토리)도 같은 어휘로 쓰여 있다.
     - 시설명 변경은 다시 볼 때 `cost:L` · `structural`이며, **새 팩을 쓰기 전에** 결정해야 한다.
   - 개인 계정이 아닌 이유:
     - Issue types 등 신규 Issues/Projects 기능이 조직 단위로 제공된다.
     - 소유자 문제가 사라진다.
     - 심사자에게 보이는 인상도 개인 포크보다 낫다.
   - Clone 이후 E2E Deploy를 실행하여 변경된 Page로 배포가 정상적으로 이루어지는지 확인한다.
   - **(완료 2026-08-12)** main 733커밋 이관 · Pages 배포 성공 · https://chabaak.github.io/ccr-op-onboarding/ 정상. `vite.config.ts`의 `base`가 `/nhn-game-2026/`로 하드코딩되어 있어 함께 옮겼다(그 값을 문자열로 검사하는 `tests/debug/build-flag.test.ts`와 `playwright.config.ts`의 호스트 URL 3개도 같이). 원본의 다른 브랜치 99개와 작업 태그는 가져오지 않았다.
3. **시작 커밋에 `baseline-claude` 태그**
   - Codex 기여분 전체가 `git diff baseline-claude..HEAD` / `git log baseline-claude..HEAD` 로 떨어진다.
   - Codex 활용 문서를 25일 밤에 손으로 재구성하지 않기 위한 장치.
   - 태그 이전은 사전 베이스라인, 이후는 대회 기간 신규 개발로 정리 가능.
4. **신원 규칙**
   - CLAUDE.md의 신원 규칙(개인 계정, 회사 흔적 금지)은 새 저장소의 `AGENTS.md`로 그대로 옮긴다.

## 3. Issue Tracking

### 3-1. GitHub Issues

GitHub Issues로 issue tracking을 한다. Jira 등 별도 서비스는 두지 않는다.

- Issue → PR → Commit이 자동으로 연결되고, 그 연결이 곧 "어떤 기능을 Codex가 구현했는가"의 원자료가 된다.
- **Sub-issues**로 부모-자식 계층을 만든다. 부모당 최대 100개, 8단계까지.
  - `gh issue view` / `gh issue list`가 parent·sub-issue·type·dependency를 JSON 필드로 노출하므로 (**gh v2.94+**) 에이전트가 계층을 읽고 쓸 수 있다. 로컬은 2.90이라 `brew upgrade gh` 선행 필요.
  - 쪼개는 기준은 **lane이 다르거나**(병렬 가능) **되돌릴 수 있는 정도가 다를 때**. 정리를 위해 쪼개지 않는다.
- **`type`은 라벨이 아니라 조직 Issue type이다** — Bug · Feature · Idea · Chore · Deliverable. 생성 시 `gh issue create --type Idea`로 지정한다. 조직을 택한 이유가 정확히 이것이었다. GitHub 기본 `Task` 타입은 Chore와 겹쳐 삭제했다.
- Label 15종: `lane:*`(6) · `cost:*`(3) · `scores:*`(5) + `structural` · `blocked` · `wontfix`. GitHub 기본 라벨 8종과 `type:*`는 삭제했다.

### 3-2. Discord Webhook

Discord를 논의 채널로 유지하되, webhook으로 트래킹 내용을 공유 받는다.

1. Channel webhook URL 끝에 `/github`를 붙여 GitHub 호환 endpoint로 만든다.
2. GitHub 쪽에서 **Issues · Issue comments · Pull requests · Pushes** 를 선택한다.
   - Issue comments를 포함시키는 이유는 판단 과정이 스레드에 쌓이기 때문. 채널이 "무엇을 열었는가"가 아니라 "무엇을 알아내고 있는가"의 피드가 된다.

## 4. Issue Conventions

### 4-1. 원칙

이슈는 작업 큐가 아니라 협업 표면이다.

1. **크든 작든 전부 이슈를 만든다.** 최소 한 줄.
2. 확정된 티켓이 아니라 **아이디어와 논의의 목록**이다. 할지 말지, 어떻게 고칠지, 게임 컨셉을 바꾸는 일인지를 여기서 논의한다.
3. **첫 커밋 전에 자기 자신을 assignee로 지정한다.** 중복 작업을 실제로 막는 것은 이슈가 아니라 이 한 가지 행동이다. Discord webhook이 assigned에서도 울린다.
4. **안 하기로 한 이슈는 이유를 남기고 `wontfix`로 닫는다.** 삭제하지 않는다.
5. 상태는 `open/unowned` → `assigned` → `closed (done)` / `closed (wontfix)`.

### 4-2. Fields

본문은 `want` 한 줄로 고정하고 나머지는 라벨로 단다. **라벨 값을 본문에 다시 쓰지 않는다** — 보드가 필터하는 것은 라벨이므로 본문 사본은 어긋날 두 번째 진실이 된다.

| 필드 | 값 | 성격 |
| --- | --- | --- |
| `want` | 한 문장. 플레이어가 보거나 하게 되는 것 | 본문 |
| `type` | Bug · Feature · Idea · Chore · Deliverable | **Issue type** |
| `lane` | frontend · data · llm · proxy · design · infra | 라벨 |
| `cost` | S (~2h) · M (반나절) · L (하루+) | 라벨 |
| `scores` | playability · originality · codex · release · presentation | 라벨 |

- `lane`은 분류가 아니라 **분담과 파일 비충돌**을 위한 필드다.
- `scores`는 심사 기준 5개와 1:1이다. 대지 못하는 이슈는 아직 정리가 덜 된 것이다. 버그는 면제 — 항상 playability.
- `cost`의 기준선은 **08/24–25가 퇴근 후 두 저녁**이라는 사실. `L`은 슬롯이 아니라 결정이 필요하다는 신호다.

**초안의 `tags`·`status`는 필드로 두지 않는다 — GitHub이 이미 갖고 있기 때문이다.**

- `tags`(BUG · FEEL · FEATURE · CUT · DELIV · CODEX) → **Issue type으로 흡수.** 단 둘은 애초에 작업의 종류가 아니었다: `CODEX`는 이유이므로 `scores:codex`, `CUT`은 결과이므로 `wontfix` 종료. `FEEL`은 `lane:design`이 받는다.
- `status`(raw → in/out) → **open/closed와 assignee가 곧 상태다** (4-1 규칙 5). 본문에 또 적으면 진실이 두 개가 된다.

### 4-3. Issue thread

본문은 무엇을 원하는지, 스레드는 그것을 어떻게 판단했는지를 담는다.

- 버그라면 **왜 일어나는가 · 원인이 어디인가 · 어떻게 고치는가 · 영향 범위는 어디까지인가**. 기능이라면 무엇을 검토했고 무엇을 버렸는가.
- 파일과 줄 번호를 실제로 적는다 (`src/client/shell/ending.ts:69`).
- **막다른 길도 적는다.** 같은 판단을 두 번 하지 않기 위해서다.
- 본문은 늘리지 않는다. 본문이 불어나면 이슈를 훑을 수 없게 되고 트리아지가 깨진다.
- **닫힌 이슈가 곧 기록이다. 별도 지식 문서로 옮기지 않는다.** 아무도 관리하지 않는 문서를 하나 더 만드는 것이 정확히 `DISCOVERY.md`가 죽은 방식이다 (5-1에서 폐기).
- 예외는 **작업 방식을 바꾸는 발견**뿐이며, `AGENTS.md`에 한 줄로 적는다. 매 세션 읽히므로 낡으면 바로 드러난다.

### 4-4. Agent Skill

**`file-issue` 스킬**이 이슈 작성을 맡는다.

- 에이전트와 논의한 뒤 요약 한 번을 더 시키는 것이므로 비용이 거의 없다.
- 열기 전에 **열려 있는 이슈를 먼저 검색해 중복이면 기존 이슈에 코멘트를 제안한다.**
- assignee는 지정하지 않는다. 담당 선언은 사람이 착수 직전에 한다 (4-1 규칙 3).

## 5. Housekeeping

새 저장소에는 `긴급상황대응실 운영자 임용을 축하합니다`에 직접 관련된 파일만 남긴다. 문서 정리가 아니라 코드·프록시·픽스처·테스트 결과·코드 내 언급까지 포함하는 작업이다.

### 5-1. 미사용 컨셉 문서 폐기

대상은 `demos/` 디렉터리만이 아니다. 데모 어휘(`apothecary` · `darkest-context` · `doodle`)는 저장소 전체에 흩어져 있으며, 확인된 것만:

| 위치 | 성격 |
| --- | --- |
| `demos/apothecary` · `demos/darkest-context` | 데모 빌드 본체 |
| `planning/legacy-services/apothecary-llm-layer/` | 사실상 두 번째 코드베이스 |
| `planning/concepts/game-concept-*.md` | 채택되지 않은 컨셉 7종 |
| `planning/handoffs/apothecary-*` · `planning/paper-tests/*` | 데모 시기 산출물 |
| `proxy/src/{provider,config,handler}.ts` · `proxy/README.md` | **코드 내 언급** |
| `assets-manifest.json` · `tests/assets/baseline/manifest-baseline.json` | 베이스라인 재생성 필요 |
| `DISCOVERY.md` · `WORKLINE-*.local.md` · `discovery/u9.md` | 기록 문서 |

**회의록과 리서치 기록은 삭제 대상에서 분리해 따로 판단한다.** 컨셉 문서와 달리 이것들은 프로젝트 이력이며, Codex Collaboration 심사에 불리하게 작용하지 않는다.

### 5-2. 미사용 시나리오 데이터 폐기

`우는다리`·`전구간정상`을 폐기한다. **단 `우는다리`는 디렉터리 삭제가 아니다** — 아래가 그 팩에 물려 있다.

- `tests/acceptance/fixtures/rig.ts:57` — `PACK_SLUG = '우는다리'`. 억셉턴스 리그 전체가 이 팩으로 돌아간다.
- **DEV 모드가 항상 우는다리 픽스처를 재생한다.** 삭제하면 개발 루프가 같이 죽는다.
- `e2e/fonts.spec.ts` — `정착부`를 렌더링 샘플로 쓴다.

**폐기 순서는 강제된다: 새 시나리오 팩을 확보한다 → 리그와 DEV 픽스처를 새 팩으로 옮긴다 → 그 다음에 삭제한다.** 순서가 뒤집히면 새 팩을 검증할 수단이 먼저 사라진다.

### 5-3. Stale 문서 갱신

`README.md` · `docs/status.md` · `CLAUDE.md`(→ `AGENTS.md`) 및 데모 시기 구조를 전제하는 문서를 새 저장소 기준으로 갱신한다.

### 5-4. 작업 목록

각 항목은 이슈 하나로 연다. 크기와 확인된 사실은 새 저장소를 실제로 훑어 붙였다.

| # | 항목 | 확인된 사실 |
| --- | --- | --- |
| 1 | `artifacts/runs/` 제거 | 16K, `우는다리-fixture-r1.json` 한 개뿐. **로컬 API 테스트 구현 완료 후** 제거 |
| 2 | `demos/` 삭제 | 11M. Pages 워크플로의 `demos/*` 루프는 `nullglob`이라 디렉터리가 사라져도 배포는 그대로 통과한다 |
| 3 | `discovery/` · `DISCOVERY.md` 삭제 | 256K + 루트 파일. super-pipeline 산출물이며 유지 대상이 아니다 |
| 4 | `docs/` 취사선택 | 1.8M. **무엇을 남길지 추가 논의 필요** — 스펙은 남고 데모 시기 계획서는 나간다 |
| 5 | `e2e/` 파일별 검증 | 3.9M 중 `e2e/reference-shots/`가 3.4M. 레퍼런스 샷은 폐기 가능 |
| 6 | `planning/` 삭제 | 9.2M. `meetings/`는 당분간 남겼다가 마지막에 정리. **`planning/dday-mechanism`은 코드가 읽는다** — 아래 참조 |
| 7 | `proxy/prompts/` 버전 단일화 | 현재 4계열 **20개 파일**(judgment v0.4–0.5, reporter·narration v0.1–0.4)이 전부 번들에 열거되어 있다 |
| 8 | 루트 파일 정리 | `AGENTS.md`가 `CLAUDE.md`를 가리키는 포인터다. Codex 시대에는 뒤집어야 한다 |
| 9 | `assets` 정리 | `assets-manifest.json` · `tests/assets/baseline/manifest-baseline.json` 재생성 |
| 10 | 이슈 왕창 생성 | 위 전부 |

**6번은 단순 삭제가 아니다.** `planning/dday-mechanism`을 참조하는 것이 문서가 아니라 실행 코드다:
`tools/probe/run.mjs` · `tools/driver/drive-beat.mjs` · `proxy/src/default-prompt.ts` ·
`proxy/tests/prompt-parity.test.ts` · `tests/shared/default-prompt-coverage.test.ts`.
**옮긴 뒤에 삭제한다** — 5-2의 시나리오 팩과 같은 순서 문제다.

**7번도 삭제가 아니라 계약 변경이다.** 20개 버전이 프롬프트 번들에 열거되어 있고
`prompt-parity` 테스트가 그 열거를 검증한다. 어떤 버전이 살아 있는지부터 정하고,
번들·테스트·프로브 증거를 함께 옮겨야 한다.

## 6. Codex migration

- super-pipeline은 이식하지 않음.
- 저장소 루트에 Codex 네이티브 지시 파일 `AGENTS.md` 갱신 필요.
- 설정은 `~/.codex/config.toml` (TOML). MCP는 동일 프로토콜이라 기존 서버가 그대로 옮겨간다. 스킬은 `SKILL.md`로 패키징된다.