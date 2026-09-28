# 팩션 프롤로그 구현 인계 · 040

## 구현됨
- 7개 기억 × 4답변. 선택 즉시 기존 계정 저장/API와 버전 충돌 보호를 사용한다.
- Primary 2 / Secondary 1, 팩션별 최대점수 정규화. 동률은 주 선택 횟수 → M7 관련성 → 공동 표시.
- 성향 점수는 우호도와 독립. 결과가 낮아도 모든 팩션 선택 가능.
- 선택한 실제 팩션의 1~4 캐릭터로 시작한다. 세린·마리엔·에델을 다른 팩션에 임의 재배정하지 않는다.
- Q00는 NPC와 대표의 도입 대화 완료 표식이며 전투 보상을 주지 않는다. 기존 Q01~Q14 보상/ID 유지.
- AR/VR/BC/BK/WS/DS/GO는 각각 요새/항구/서고/서고/예배당/연구동/관측소에서 첫 지역 2개 퀘스트를 먼저 진행한다. EF는 요새/항구 선택.
- 이후 기존 본편 순서로 미완료 퀘스트를 진행한다. 왕궁은 Q02,Q06,Q08,Q12 증언 확보 필요.
- 탐사 진입 시 Party[0]을 storyLeadId로 저장하고 귀환 대화까지 사용한다.
- 옛 세이브는 프롤로그 필드가 없으면 재시작시키지 않는다. 새 게임과 다음 환생부터 적용.
- 환생에서 재답변·이전 답 재사용·건너뛰기 선택 가능.
- 환생은 퀘스트·제작·파티·우호도를 초기화한다. 도감/엔딩 기록은 유지하며 기존 재료 계승 규칙 적용.

## 아직 설계 단계
- 완전한 자유 지역 그래프, BK/EF 신규 소지역, 팩션별 고유 전투 효과.
- Guest→Companion, 개인 신뢰/혼성 파티 갈등, 증언 기반 분기 엔딩.

- 고위 지역 출신 초반 전투 난이도 별도 조정은 미완료. 기존 지역 난이도 사용.

## 파일
- 원본 7개: docs/design/faction-prologue-v1/ (제안 원문 그대로)
- 런타임: data/prologue_scenes.json, data/prologue_scoring_v1.json, data/faction_start_design_v1.json
- 연산: lib/prologue.ts; 상태/진행: lib/game.ts; 화면: app/components/FactionPrologue.tsx
- 본편 대사: data/story_dialogues.json, docs/STORY_SCRIPT_KO.md
- 이미지: art-source/story-v1/, public/assets/story-v1/, data/story_art_manifest.json
- 현재 이미지114장 적용, 추가123장은 이미지 생성 한도로 대기. 기존 이미지 fallback 유지.

사용자 지시로 QA/브라우저 플레이 미실시. 배포 컴파일은 별도 수행.
