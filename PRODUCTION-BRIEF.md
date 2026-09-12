# 에이전트 기반 업무 방식 발표자료 제작 브리프

## 1. 제작 목적

회사 내부 발표용 자료를 제작한다. 청중은 개발자뿐 아니라 관리자·임원을 포함한다. 발표 시간은 최대 20분이다.

이 발표는 개인 성과를 자랑하거나 조직 도입을 제안하는 자료가 아니다. 발표자가 여러 프로젝트를 관리하며 에이전트 기반 업무 방식을 개인적으로 적용한 사례, 실제 산출물, 배운 점과 한계를 공유한다.

핵심 메시지:

> 여러 프로젝트를 동시에 다뤄야 했고, 에이전트만 늘려서는 해결되지 않았다. 그래서 업무를 표준화하고 역할이 분리된 팀을 만든 뒤, 반복 가능한 작업 공정으로 운영했다.

최종 결론:

> AI는 실행과 증거를 담당하고, 개발자는 서비스의 맥락과 최종 책임을 가진다.

## 2. 반드시 유지할 서사

1. 나는 어떤 일을 하는가
2. 프로젝트가 너무 많았다
3. 프로젝트 수보다 컨텍스트 전환이 문제였다
4. 에이전트를 최대한 활용해야 했다
5. 에이전트만 늘리면 혼란도 늘어났다
6. 업무 방식을 먼저 표준화했다
7. 역할이 다른 Agent Team을 만들었다
8. 같은 Team을 각 Workspace에 투입했다
9. 업무를 반복 가능한 공정으로 만들었다
10. 충돌하지 않는 작업은 Lane과 Worktree로 병렬화했다
11. 결과적으로 여러 프로젝트를 동시에 관리할 수 있었다
12. 높은 토큰 사용량은 이 전체 공정을 운영한 흔적이었다
13. 개발자의 중심 역할은 서비스 이해·계약 설계·최종 판단으로 이동했다

발표자의 관점은 자조 20%, 호기심과 분석 80%다. 토큰 사용량을 자랑하거나 정당화하지 않는다.

## 3. 오프닝 문구

첫 슬라이드 제목:

> 나는 왜 이렇게 토큰을 많이 쓰는 걸까?

부제:

> 여러 프로젝트를 관리하며 시도한 에이전트 기반 업무 방식

오프닝 대본의 핵심:

- 사내 토큰 사용량이 평균보다 10배 이상 높았다.
- 발표자도 비효율적인 사용인지 궁금했다.
- 최근 한 달간 Jira, Spec, Git, 문서, 에이전트 기록을 되짚었다.
- 토큰은 코드 생성뿐 아니라 이해·분해·실행·검증·기록에 사용됐다.
- 오늘은 높은 사용량을 자랑하는 것이 아니라 왜 발생했고 업무 방식을 어떻게 바꿨는지 설명한다.

## 4. 본문 슬라이드 구성

### 슬라이드 1 — 오프닝

제목: `나는 왜 이렇게 토큰을 많이 쓰는 걸까?`

화면 요소:
- `평균 대비 10× 이상`
- 부제 1줄

### 슬라이드 2 — 발표자의 업무

제목: `세 가지 프로젝트 생태계를 함께 관리한다`

화면 요소:
- CryptoWallet: 2 projects
- EXIMPay: 8 projects
- AI·MCP: 3 projects
- 총 13개 프로젝트

프로젝트 구성:
- CryptoWallet: eximbay-crypto, crypto-wallet
- EXIMPay: eximpay-integrated, eximpay-t650p, eximpay-backoffice-api, eximpay-backoffice-web, EXIMPay_SDK, PAY_AT_TABLE, POS_CLIENT, APP_CLIENT
- AI·MCP: AI-Chatbot, mcp-room, jarvis-rag
- AgentManager는 관리 대상에서 제외한다.

관계가 확인되지 않은 프로젝트 사이에 임의의 화살표를 만들지 않는다.

### 슬라이드 3 — 문제

제목: `문제는 프로젝트 수보다 컨텍스트 전환이었다`

화면 요소:
- 서비스 목적
- 프로젝트 규칙
- 현재 작업 상태
- `업무를 바꿀 때마다 다시 복원`

### 슬라이드 4 — 에이전트 활용

제목: `코드 작성뿐 아니라 업무 흐름 전체에 사용했다`

화면 요소:
- 평균 대비 토큰 사용량 `10× 이상`
- 조사 · 계획 · 구현 · 검수 · 기록

정확한 토큰 비율이나 단계별 소비량을 임의로 만들지 않는다.

### 슬라이드 5 — 에이전트만으로는 부족

제목: `역할과 기준이 없으면 혼란도 같이 늘어난다`

화면 요소:
- 범위 확장
- 중복 작업
- 상태 불일치
- 검증 기준 부재

### 슬라이드 6 — 업무 표준화

제목: `공통 규칙과 작업 계약을 먼저 만들었다`

화면 요소:
- Convention — 표준 작업 방식
- project.md — 프로젝트 맥락
- Spec — 작업 계약
- 코드·테스트 — 실행 증거

강조할 내용:
- Spec은 사람과 에이전트 사이의 작업 계약이다.
- Convention은 에이전트 실행의 경계다.
- 문서화는 다음 세션과 다른 역할이 이어받는 외부 기억이다.

### 슬라이드 7 — Agent Team 구성

제목: `업무 공정을 역할별로 분리했다`

화면 요소:
- 개발자가 역할·규칙·도구 권한 설정
- Project Leader — 기획·분해
- Builder — 구현
- Reviewer — 검수
- Tester — 검증

각 역할 카드는 클릭 가능하게 구현한다. 클릭 시 역할 상세 슬라이드로 이동하며, 상세 슬라이드에는 `Back to Team` 링크를 둔다.

#### 숨김 슬라이드 7A — Project Leader

흐름:
`요구사항·현재 상태 → 서비스·코드 조사 → ADR/실행 계획 → Spec·Jira 분해 → 착수 가능한 작업 계약`

자동화:
- Jira 생성·재조회
- Confluence 조회
- Spec–Jira 양방향 연결
- 담당자·제목·분류 검증

#### 숨김 슬라이드 7B — Builder

흐름:
`Jira·Spec 대조 → Workspace GATE → 단계별 구현 → 빌드·테스트 → 변경 결과·작업 일지`

자동화:
- Jira In Progress 전환
- 담당자·시작일 기록
- 상태 재조회
- 로컬 빌드·테스트 실행

#### 숨김 슬라이드 7C — Reviewer

흐름:
`Spec·변경사항 대조 → 5개 관점 검수 → GO/NO GO → 테스트 결과 확인 → 완료 상태 정합화`

5개 관점:
- 정확성
- 가독성
- 구조
- 보안
- 성능

자동화:
- 완료일 기록
- QA 상태 전환
- Spec DONE 처리
- 상태 재조회

#### 숨김 슬라이드 7D — Tester

흐름:
`프로젝트 테스트 규칙 → 실패 재현·범위 격리 → 단위·통합·E2E → 회귀 테스트 → TEST GO/NO GO`

제약:
- Jira·Git 상태를 변경하지 않는다.
- 검증 결과만 Reviewer에게 전달한다.

### 슬라이드 8 — Workspace 투입

제목: `같은 Team이 프로젝트별 규칙을 읽고 다르게 일한다`

화면 요소:
`Global Agent Team → Workspace Context(project.md · Convention · Spec) → CryptoWallet / EXIMPay / AI·MCP`

강조:
- 공통 방법론은 전역에서 재사용
- 프로젝트 사실과 기술 규칙은 로컬에서 로드
- Jira/Spec project key가 현재 Workspace와 다르면 작업 거부

### 슬라이드 9 — 공장화

제목: `개별 요청을 반복 가능한 작업 공정으로 바꿨다`

화면 요소:
`요구사항·Jira → 현황 조사 → ADR·실행 계획 → Spec·착수 조건 → Builder → Reviewer·Tester → Jira·Git·문서 기록`

공장 비유:
- Convention = 표준 작업 절차
- Spec = 작업 지시서
- Agent Team = 역할별 작업 공정
- MCP = 업무 시스템 연결
- Reviewer·Tester = 품질 게이트
- Workspace = 프로젝트별 생산라인
- Jira·Git·문서 = 작업 이력

공장 그림, 컨베이어벨트 일러스트, 로봇 이미지를 사용하지 않는다. 단순 프로세스 선과 박스로 표현한다.

### 슬라이드 10 — Lane과 Worktree

제목: `충돌하지 않는 작업만 병렬화했다`

화면 요소:
`Workspace → Lane A/Worktree A/Spec A · Lane B/Worktree B/Spec B · Lane C/Worktree C/Spec C → stage`

문구:
- Lane 내부는 순차
- Lane 간에는 병렬
- 8 Lanes
- 현재 stage 제외 7개 작업용 Worktree

실제 문서 `specs/PLAN-20260729-parallel-lanes.md`의 Lane 도식 일부를 증빙으로 사용한다.

### 슬라이드 11 — 운영 결과

제목: `반복 가능한 Team과 공정으로 업무 범위를 확장했다`

화면 요소:
- 관리 대상 13개 프로젝트
- 2026년 SBD Jira 전체 약 1,800건
- 담당 이슈 약 900건

각주:
`담당 범위 기준 · 완료 건수와는 다름 · 발표자 제공 근사치`

이 수치를 발표 초반에 과시용으로 배치하지 않는다. 방법론 설명 후 실제 운영 규모를 보여주는 결과 증빙으로 사용한다.

### 슬라이드 12 — 산출물 증빙

제목: `코드뿐 아니라 의사결정과 검증 기록을 축적했다`

화면 요소:
- 8 ADRs
- 4 Plans
- 139 Specs
- 80 Done

하단 보조:
- 135 Jira 연결
- 223 Commits
- 114 Review Rounds
- 78 Test Rounds

각주:
`2026.07.16–08.20 eximbay-crypto 로컬 기록 기준`

숫자 자체를 생산성 점수로 표현하지 않는다. 추적 가능한 산출물이라는 의미로 설명한다.

### 슬라이드 13 — 결론

제목: `토큰은 이 작업 공정을 운영하는 데 사용됐다`

화면 요소:
`이해 │ 분해 │ 실행 │ 검증 │ 기록`

최종 문구:

> AI는 실행과 증거를 담당하고, 개발자는 서비스의 맥락과 최종 책임을 가진다.

효과와 한계를 함께 언급한다.

효과:
- 컨텍스트 복원
- 작업 추적성
- 병렬 작업 통제

비용:
- 중복 컨텍스트
- 문서 유지보수
- 도구 실패·재시도

## 5. 실제 증빙 원본

모든 증빙은 로컬 파일에서 가져오며 내용을 조작하지 않는다.

### 프로젝트 설정 및 생태계
- `/Users/lad/eximbay-crypto/project.md`
- `/Users/lad/crypto-wallet/project.md`
- `/Users/lad/EXIMPay/PAYMENT/eximpay-integrated/project.md`
- `/Users/lad/EXIMPay/PAYMENT/eximpay-t650p/project.md`
- `/Users/lad/EXIMPay/AGENT/PAY_AT_TABLE/project.md`
- `/Users/lad/EXIMPay/BACKOFFICE/eximpay-backoffice-api/project.md`
- `/Users/lad/EXIMPay/BACKOFFICE/eximpay-backoffice-web/project.md`
- `/Users/lad/AI-Chatbot/project.md`
- `/Users/lad/mcp-room/project.md`
- `/Users/lad/jarvis-rag/project.md`

### 현황 조사
- `/Users/lad/eximbay-crypto/docs/현황조사/README.md`
- 요구사항 59개
- 조사 범위 7개
- 관리 산출물 3개

### Lane 계획
- `/Users/lad/eximbay-crypto/specs/PLAN-20260729-parallel-lanes.md`
- 8개 Lane
- Lane 내부 순차, Lane 간 병렬
- 파일 충돌·선행 관계·크리티컬 패스·충돌 이력 포함

### ADR·Plan·Spec
- `/Users/lad/eximbay-crypto/specs/`
- 집계 기준: 2026-07-16~2026-08-20
- ADR 8개
- Plan 4개
- Spec 139개
- DONE 80개
- Jira 연결 135개
- Review rounds 합계 114
- Test rounds 합계 78

### Git
- 같은 기간 작성자 lad, merge 제외 커밋 223개
- 현재 `git worktree list`: stage 포함 8개, 작업용 7개

## 6. 디자인 시스템

### 테마
White & Blue, Eximbay 계열의 담백한 내부 기술 사례 보고서.

### 컬러
- Background: `#FFFFFF`
- Accent: `#2563EB`
- Accent Dark: `#1D4ED8`
- Accent Light: `#EFF6FF`
- Border: `#BFDBFE`
- Text: `#18181B`
- Secondary Text: `#52525B`

### 글꼴
- Pretendard 우선
- 없으면 Apple SD Gothic Neo 또는 Noto Sans KR

### 레이아웃
- 16:9
- 한 슬라이드에 한 메시지
- 본문 최대 3개 항목
- 한 항목 최대 한 줄
- 도식 노드 최대 7개를 기본으로 하되 공정 슬라이드는 예외적으로 8개까지 허용
- 상세 설명은 발표자 노트 또는 별도 대본에 둔다.

### 금지
- AI 보라·분홍 그라데이션
- 로봇·뇌·회로·우주 이미지
- 이모지
- 과도한 둥근 카드
- 의미 없는 아이콘 나열
- 마케팅 문구
- 임의 통계 또는 임의 비율
- 과도한 애니메이션

### 권장
- 실제 문서 일부 캡처
- 단순 선·박스·화살표
- 충분한 여백
- 페이지 번호와 섹션명
- 역할 상세 이동은 PowerPoint 내부 하이퍼링크 사용

## 7. 산출물

아래 파일을 `/Users/lad/agent-methodology-presentation/output/`에 생성한다.

1. `deck-outline.md` — 최종 슬라이드별 화면 구성
2. `speaker-script.md` — 20분 이내 전체 발표 대본
3. `evidence-map.md` — 각 수치와 캡처의 원본 경로 및 마스킹 항목
4. `agent-methodology-presentation.pptx` — 실제 발표자료 초안
5. `deck-source.py` 또는 이에 준하는 재생성 가능한 소스
6. `validation-report.md` — 파일 생성, 슬라이드 수, 링크, 텍스트 오버플로, 발표 시간 검증 결과

PPTX 생성 라이브러리가 이미 설치돼 있으면 사용한다. 새 패키지를 설치하지 않는다. PPTX 생성이 불가능하면 그 이유를 `validation-report.md`에 기록하고, 나머지 산출물과 재생성 가능한 소스를 완성한다.

## 8. 검증 기준

- 메인 슬라이드 13장
- 역할 상세 4장(클릭 이동용)
- 총 슬라이드 17장 내외
- 모든 역할 카드의 내부 링크와 Back 링크 확인
- 메인 발표 대본 예상 시간 17~18분
- AgentManager가 프로젝트 목록에 포함되지 않음
- Jira 약 1,800/900에는 반드시 `약`, `담당 범위`, `완료 건수 아님` 표시
- ADR·Plan·Spec 수치에 날짜와 로컬 기록 기준 표시
- 실제 코드·시크릿·환경변수·토큰·키를 캡처하지 않음
- 화면당 텍스트 과밀 여부 확인
- 발표 톤이 자랑·조직 도입 제안·AI 마케팅으로 흐르지 않음
