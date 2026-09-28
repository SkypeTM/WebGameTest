# 침묵의 종 아래 — 팩션 시작/프롤로그 개편 핸드오프

## 목적

이 문서는 다른 Agent가 프롤로그, 시작 팩션, 주점 모집, Story Lead, 환생 연계를 이어서 작업할 때 먼저 읽는 요약 문서다.

## 먼저 읽을 기존 정본

1. `STORY_GUIDE.md`
2. `STORY_SCRIPT_KO.md`
3. 프로젝트 내부에서 가능하면 추가 확인:
   - `lib/game.ts`의 `storyQuests`
   - `data/story_chapters.json`
   - `data/story_dialogues.json`
   - `data/story_npcs.json`
   - 캐릭터 roster/클래스/팩션 소속 데이터

## 이번 설계팩에서 읽을 파일

1. `PROLOGUE_FACTION_AFFINITY_KO.md`
   - 공통 프롤로그 전체 대본
   - 환생 시 프롤로그 처리
   - 결과 UI 문구

2. `PROLOGUE_SCORING_MATRIX.md`
   - 7상황 × 4선택 점수 체계
   - 정규화/동점 처리
   - 저장 구조 제안

3. `prologue_scoring_v1.json`
   - 구현용 기계 판독 점수 데이터

4. `FACTION_START_PARTY_DESIGN_KO.md`
   - 8개 팩션 시작 지역/Q00/초기 파티 역할
   - 주점 모집 규칙
   - 혼합 파티와 Story Lead
   - 비선형 메인 진행 방향

5. `faction_start_design_v1.json`
   - 시작 팩션 설계의 기계 판독 데이터

## 정본과 제안의 경계

### 기존 문서에서 유지해야 하는 것

- 팩션 코드와 명칭:
  - AR 아르켄 왕국
  - VR 벨로라 공화연맹
  - BC 황동나침반 조합
  - BK 검은열쇠 결사
  - WS 백야성좌 교단
  - DS 깊은별 성회
  - GO 녹서약 수호회
  - EF 잿불 해방전선
- Q01~Q14 핵심 사건과 지역
- 기존 퀘스트 ID/저장 필드/보상은 구현 변경 전까지 유지
- 종의 본래 목적은 귀환/구조 신호
- 공명이 기억 편집/명령 전달에 악용됨
- 팩션은 단순 선악으로 표현하지 않음
- 기존 버전의 Q14는 단일 결말이며, 분기 엔딩은 후속 확장 대상으로 취급

### 이번 작업에서 새로 제안한 것

- 공통 선택형 프롤로그
- 팩션 성향 프로필
- 시작 팩션 자유 선택
- 팩션별 Q00
- 팩션별 기본 파티 역할 정체성
- Origin / Reputation / Party / Story Lead 분리
- 탐사 진입 시 Party[0]를 Story Lead로 lock
- 주점의 타 팩션 모집 조건화
- Faction Reputation과 Character Trust 분리
- 환생 후 다시 팩션 선택
- 일부 기억/인연/유물 계승
- 시작 노드가 다른 비선형 메인 진행

따라서 실제 코드나 정본 JSON을 수정하기 전에 위 신규 항목을 별도 feature/schema로 구현하거나 사용자의 승인을 받아야 한다.

## 핵심 게임 루프 목표

```text
NEW GAME / REBIRTH
    ↓
공통 프롤로그
    ↓
8개 팩션 관점 프로필
    ↓
8개 중 자유롭게 Origin 선택
    ↓
팩션별 Q00 + 기본 파티
    ↓
타 팩션 접촉 / 우호도 변화
    ↓
주점에서 혼합 파티 구성
    ↓
탐사 시작 시 Party[0] = Story Lead 고정
    ↓
Story Lead + Origin + Reputation + 과거 선택에 따라
대사 / 버프·디버프 / 던전 루트 / 모집 조건 변화
    ↓
복수의 엔딩
    ↓
현재 세계 계속 플레이 OR 환생
    ↓
일부 기억·인연·유물 계승
    ↓
다른 Origin/Story Lead/엔딩 공략
```

## 다음 Agent가 먼저 해야 할 검증

1. 실제 캐릭터 데이터에서 각 캐릭터의 팩션 소속 확인.
2. 각 팩션에서 실제 초기 파티로 사용할 3~4명을 선정.
3. 기존 `storyQuests`의 보상/해금 의존성을 깨지 않고 시작 순서를 바꿀 수 있는지 확인.
4. Q01~Q12의 선행조건이 코드상 선형으로 하드코딩되어 있는지 확인.
5. 주점 캐릭터 해금 조건과 팩션 우호도 조건의 충돌 여부 확인.
6. 환생 저장 데이터용 별도 `cycle`/`echo` 스키마 설계.
7. 엔딩 분기 스키마를 설계하되 기존 Q14 단일 결말을 즉시 삭제하지 말 것.

## 구현 시 권장 신규 필드(제안)

```ts
cycle: number
originFaction: FactionCode
factionReputation: Record<FactionCode, number>
prologueProfile: PrologueProfile
storyLeadId: string | null
characterTrust: Record<CharacterId, number>
echoMemories: string[]
rebirthCarry: string[]
endingHistory: string[]
```

이 필드들은 아직 기존 정본에 존재한다고 가정하면 안 된다.

## 프롤로그 점수 관련 주의

- 선택 하나 = 팩션 하나로 노골적으로 대응시키지 않는다.
- Primary +2 / Secondary +1.
- 음수는 사용하지 않는다.
- 팩션별 노출량 차이는 정규화한다.
- 결과는 추천/성향이며 강제 배정이 아니다.
- 낮은 팩션은 `가장 거리가 먼 관점`이라고만 표현한다.

## Story Lead 관련 주의

대화 직전에 파티 슬롯을 바꿔 선택지를 악용하지 못하도록:

```text
탐사 시작
→ 현재 Party[0] 저장
→ storyLeadId 고정
→ 귀환/챕터 종료까지 유지
```

전투 편성 UI가 슬롯 이동을 허용하더라도 서사 화자는 고정된 `storyLeadId`를 사용한다.

## 주점 모집 관련 주의

```text
Same faction    → 낮은 조건으로 모집
Friendly faction→ Reputation 조건
Neutral faction → Guest → 개인 이벤트 → Companion
Hostile faction → 일반 모집 불가
                  단 Character Trust / Echo / 개인 퀘스트 예외 가능
```

`Faction Reputation != Character Trust`를 반드시 유지한다.

## 금지되는 단순화

- "AR는 선, EF는 악"처럼 세력을 도덕 점수화하지 말 것.
- 가장 높은 프롤로그 점수로 팩션을 강제 배정하지 말 것.
- 타 팩션 캐릭터를 단순 돈으로 즉시 구매 가능하게 두지 말 것.
- 환생 후 모든 캐릭터/우호도를 그대로 유지해 Origin 선택 의미를 없애지 말 것.
- 파티 1번을 자유롭게 즉시 바꾸는 방식으로 대화 분기를 악용하게 두지 말 것.
- 기존 Q01~Q14의 핵심 반전을 프롤로그에서 정답처럼 스포일러하지 말 것.
