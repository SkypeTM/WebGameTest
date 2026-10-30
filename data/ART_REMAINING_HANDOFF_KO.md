# 카툰 원화 전환 인계

갱신: 2026-10-30. 이 문서는 작업 범위 설명이며 실제 적용 경로는 아래 manifest를 우선한다.

## 현재 적용
- 기본 전신32명: `data/character_cartoon_manifest.json`. 주점 상세·초상·동료 모집에 사용한다. 기본 전신 원화가 전투 동작을 대체하지 않는다.
- 탐사/전투 SD32명: `data/sd_asset_manifest.json`, `data/cartoon_sd_progress.json`. 패치111까지 GitHub/Cloudflare 배포 완료.
- 레오나·세린 전신 각7자세: `data/renewal_actor_manifest.json`, `data/cartoon_motion_progress.json`. 패치112 배포 완료, 113 세린 작업 단위.
- 현재 QA 생략 요청이 있으므로 원화 자체 확인과 실제 화면/플레이 검증을 구분한다. 라이브 배포 성공은 화면 검증 통과가 아니다.

## 이어서 할 일
1. AR3·AR4 전신7자세를 동일 기준에서 생성하고 세트 단위로 연결한다. 한 캐릭터의 신구 화풍을 섞지 않는다.
2. 나머지28명의 전신 행동 세트. 현재 `FullBodyActor`는 `renewal_actor_manifest.json`에 있는 인물만 지원하고, 다른 인물은 SD 확대가 호환 경로다.
3. 대화 표정·손동작, 3단계 승급 단독 원화, NPC·상인, 몬스터, 카드의 캐릭터 원화.
4. 발 기준·얼굴 크기·의상 구조·무기 손·굽·여백을 자세 간 일치시킨다. 현재 프레임 전환은 연속 리깅이 아니다.
5. 사용자가 QA를 재개하면 전투 진입→기본 공격→전용 스킬→피격→SD 복귀와 터치 화면을 검증한다.

## 연결 지점
- `app/page.tsx`의 `BattleActor`: SD 및 전신 전환. 현재 파티 원화만 선로딩.
- `app/components/FullBodyActor.tsx`: 준비/타격/회수 타이밍. `lib/combat-presentation.ts`는 연출만 다루며 서버 전투 결과를 변경하지 않는다.
- `app/animation-preview/preview.tsx`: 기본 파티 원화별 보기. 같은 전신 manifest를 사용한다.
- `scripts/qa-actor-assets.mjs`: 다음 QA 때 구 WebP와 카툰 PNG를 각각 검증한다. 이번 작업에서는 실행하지 않는다.

## 생성과 배포 규칙
- `CARTOON_ART_DIRECTION_KO.md`, `art_generation_policy.json`, 인물별 `character_design_v2.json` 정체성 유지.
- 내장 image_gen을 사용하고 로컬 참조를 먼저 본다. 배경이 남거나 칼끝이 잘린 시안은 연결하지 않는다.
- 새 원본은 `art-source/cartoon-v5-motion/ID/`, 웹용은 `public/assets/cartoon-v5-motion/ID/`에 둔다. 구 경로는 삭제하지 않는다.
- `RELEASE_WORKFLOW_KO.md`에 따라 완료한 묶음마다 GitHub push와 배포를 수행한다. 관련 없는 음원/Blender 수정은 섞지 않는다.
