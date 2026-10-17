# 050 · 기본 파티 전신 자세 확대

## 목적
1~8 리뉴얼의 다음 단계: AR3 마리엔·AR4 에델의 전신 4자세를 공통 액터에 연결한다. 3D는 재개하지 않는다.

## 변경 파일
- art-source/renewal/AR3, AR4: ready/windup/strike/recover 원본 및 생성 기록
- public/assets/renewal/AR3, AR4: 투명 WebP
- scripts/build-renewal-art.mjs, data/renewal_actor_manifest.json
- docs/renewal/README.md, characters/AR3.md, characters/AR4.md

## 내용 및 설계
- 기존 manifest 기반 렌더러를 재사용하여 SD → 전신 공격 → SD 흐름을 확대.
- 에델 ready의 잘린 검과 마리엔 strike의 가방 손 변경을 재생성으로 교정.
- 원본 보존, WebP quality95/alpha100. 캐릭터 ID·저장 데이터·전투 수치는 변경하지 않는다.

## 검증
- 내부 브라우저에서 세린·에델 공격 피해/자원 차감 및 SD 복귀 확인. 마리엔 실제 공격 컷인의 전신 표시 확인.
- 모바일 세로에서 손패와 컷인이 겹치는 것을 발견하여 컷인 발 위치를 상향하고 좌우 음수 여백 제거.
- 생성 원본 8종 1024×1536, alpha 존재 및 투명 픽셀 확인.
- 후속: 변환·타입 검사·내부 브라우저 전투 검사.

## 제한
4개 키 포즈 전환 시제품이다. 연속 리깅, 전용 guard/hit/skill, 전체 32명, 전투/탐사 UI 전면 개편은 미완료. 포즈별 발 높이·장식 연속성 추가 보정 필요. 배포 전 상태.

### 2026-10-17 로컬 확인
- 16종 WebP/manifest 변환, tsc --noEmit 통과.
- Codex 내부 브라우저 QA 계정: 출정→유물→전투→세린 기본타격(18)·에델 기본타격(14)·룬 사슬(16)→다음 턴→마리엔 기본타격/집중일격. 피해·행동력·마나·SD 복귀 확인.
- 마리엔 full-body-actor ready 및 실제 windup 화면 관찰. 모바일 세로 컷인 발 위치 7%→30%로 상향 후 화면 재확인. 가로/태블릿 실기기 성능은 미검증.
- 추가 변경: app/renewal-combat.css.

### 배포
- Cloudflare 빌드 성공, 048~050 배포 완료. Version: 4055e67a-919c-4f1b-85c4-23decd52fa72.
- 라이브 /, /m 및 AR3/AR4 8종 HTTP200, 각 WebP 로컬/원격 바이트 일치.
- 전체 1~8 리뉴얼 완료는 아님. 연속 동작·나머지 캐릭터·전투/탐사 UI는 인계 문서의 후속 항목 유지.

- Codex 내부 라이브 브라우저에서 QA 계정 로비와 레오나 누끼 표시 확인. 증거: docs/renewal/050-live-lobby.png. 라이브 전투 전체 회귀는 이번에 반복하지 않음.
