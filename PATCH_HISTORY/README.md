# 패치 히스토리

이 폴더는 프로젝트 변경을 작업 단위로 기록합니다.

각 패치 파일은 다음 순서를 따릅니다.

1. 작업 목적
2. 변경 파일
3. 패치 내용
4. 코드 주석 및 설계 이유
5. 검증 결과
6. 남은 위험 또는 후속 작업

앞으로의 모든 코드 변경은 편집 전에 다음 번호의 `NNN-*.md` 파일을 만들거나, 작업이 작으면 해당 파일을 먼저 갱신한 뒤 편집합니다. 패치 내용은 전체 원문 diff를 기준으로 작성하고, 불필요한 생성물·빌드 산출물은 기록하지 않습니다.

현재 기록:

- `082-hub-qa-report.md`: 거점·퀘스트·시장·저장 자동 검사 결과 및 상세 로그 저장

- `081-audio-popover-quest-button.md`: 음량 팝업 헤더 늘어짐 및 NPC 버튼 글자 넘침 수정
- `080-localhost-ipv4.md`: IPv4 우선 localhost 실행 및 연결 거부 복구

- `079-hub-dialog-accessibility.md`: 거점 모달·NPC 대화 포커스 복귀와 모바일 퀘스트 간격

- `078-responsive-route-validation.md`: 모바일 지도 노드 겹침·가로 지도 폭 수정 및 실제 이어하기/전투/경로 QA

- `077-local-qa-startup.md`: localhost 호스트 일치·개발 바인딩 초기화 대기 및 화면 QA 결과

- `076-route-selection-accessibility.md`: 경로 확인 포커스·Escape 취소·모바일 안전 여백 보완

- `075-public-patch-journal.md`: 여정의 완료 설명 정리 및 사이트 패치 기록 팝업·검색

- `074-audio-sync-timeout.md`: 계정 오디오 설정 요청 시간 제한·취소·응답 검증 및 자동 테스트

- `034-2d-clash-combat.md`: 2D 합선·컷인·타격 이펙트 전투 연출

- `027-webgl-3d-battle-actors.md`: 기본 파티·변경 요새 몬스터 WebGL 3D 전투 모델
- `026-hd-characters-combat-motion-procedural-map.md`: HD 캐릭터·전투 컷 모션·절차적 지도
- `025-collection-relics-live-deploy.md`: 통합 도감·팩션 유물·무료 라이브 배포
- `024-fhd-live2d-quests-deck.md`: FHD 자산·Live 2D·스토리 퀘스트·덱 미리보기
- `023-branching-expedition-forge-animation.md`: 분기 탐험·직업 무기 제작·전투 연출
- `001-project-scan.md`: 초기 구조 파악과 검증 기준
- `002-growth.md`: 성장·시설·치료·업적
- `003-economy.md`: 시장·팩션 상점·암시장
- `004-content-ending.md`: 7개 맵·엔딩·환생
- `005-test-environment.md`: 격리 E2E 테스트 환경
- `006-current-finalization.md`: 기록 체계 도입과 최종 후속 작업
- `007-market-finalization.md`: 시장 만료·수수료·거래 내역
- `008-no-pnpm-runner.md`: pnpm 없는 환경 실행기
- `009-e2e-selector-fix.md`: 브라우저 선택자 수정
- `010-github-upload-preparation.md`: GitHub 업로드 준비
- `011-legacy-state-normalization.md`: 구버전 저장 상태 호환
- `012-combat-motion-assets.md`: 전투 상한과 모션
- `013-selected-target-damage-fix.md`: 선택 대상 피해 수정
- `014-test-image-assets.md`: test-images 자산 연결
- `015-auto-push-hook.md`: 커밋 후 GitHub 자동 push
- `016-hamlet-tactical-ui.md`: 마을 허브·전술 배치·드래그 카드 예측 UI
- `017-audio-monster-redesign.md`: 사운드·음악·몬스터 리디자인
- `018-cinematic-expedition-combat.md`: 시네마틱 탐사·전투·대화 연출
- `019-character-loadout-status-system.md`: 캐릭터 장비 상세창·전투 상태·카드 트리거
- `020-connected-combat-motion.md`: 연결형 공격·피격 전투 모션
- `021-asset-quality-card-monster-fixes.md`: 캐릭터·아이템·카드·몬스터 자산 표시 개선
- `022-professions-party-formation.md`: 직업·장비 제한·추천 파티 배치
- `023-branching-expedition-forge-animation.md`: 분기 탐사·대장간·전투 애니메이션
- `024-fhd-live2d-quests-deck.md`: FHD 자산·퀘스트·덱 미리보기
- `025-collection-relics-live-deploy.md`: 도감·팩션 유물·라이브 배포
- `026-hd-characters-combat-motion-procedural-map.md`: HD 초상화·절차적 탐사 지도
- `027-webgl-3d-battle-actors.md`: WebGL 3D 전투 캐릭터·변경 요새 몬스터
- `028-cloudflare-3d-release-validation.md`: Cloudflare 3D 공개 배포·라이브 검증
- `029-blender-rigged-character-pipeline.md`: Blender 리깅 GLB 제작·런타임 로더
- `030-arken-party-blender-models.md`: AR1~AR4 Blender 리그·GLB 전투 모델
- `031-restore-2d-actors.md`: 전투 액터 2D 스프라이트 복귀
- `032-landscape-mobile-tablet-layouts.md`: 모바일 가로·태블릿 세로/가로 레이아웃
- `033-mobile-route-and-portable-shell.md`: 모바일·태블릿 전용 `/m` 경로와 자동 이동

- `034-2d-clash-combat.md`: 2D 전투 컷인·타격 이펙트
- `035-sd-horizontal-battle.md`: SD 32명·변경 요새 몬스터 8종·횡배열·실제 대상 연결선
- `036-fan-hand-earned-keywords.md`: 부채꼴 손패·코스트 아이콘·전용 카드 그림·획득형 키워드
- `037-mobile-encounter-story.md`: 모바일 사이드바·팩션 인물 유물 제안·14장 스토리·카드 드롭 안정화
- `038-card-journal-living-backgrounds.md`: 덱·도감 카드 이미지 통일, 좌우 행동 기록 팝업, 움직이는 2D 배경

- `039-character-card-art-story-dialogue.md`: 캐릭터 동작 카드·고유 성물·팩션 NPC·112줄 대화·상반신 표정 원화 (생성 한도로 일부 대기)
- `040-faction-prologue.md`: 서버 저장 프롤로그·8팩션 시작 선택·Q00·탐사 대표 고정
- `041-progression-and-soundtrack.md`: 지역별 진행·신뢰도 동료·프롤로그 및 게임 사운드트랙
- `042-cutout-combat-wallpaper.md`: 탐사 SD 누끼·버프 아이콘·보호막·선택 해제·지역 라이브 배경
- `043-static-shell-resource-limit.md`: 첫 화면 정적 제공으로 Worker 자원 사용 감소
- `044-region-portraits-monster-sprites.md`: 지역별 출발 그림·얼굴 초상화·탐사 역순 대형·후속 지역 몬스터 전신

- `045-merchant-card-art.md`: 암상인 투명 원화 6종 및 EF 기본 카드 10장 완성


- `046-signature-card-art.md`: 전용 스킬 카드 신규 원화 28종 및 배포
- `047-renewal-foundation.md`: 32명 디자인 시트·리뉴얼 인계·계정 음향 동기화·AR1 전신 4자세 시제품
- `048-character-lobby.md`: 캐릭터 중심 로비 구현 (로컬 화면 QA 대기, 라이브 미배포)
- `049-serin-full-body.md`: 세린 전신 4자세·manifest 액터·로비 누끼 (전투 QA/라이브 대기)


- `050-starter-party-fullbody.md`: 마리엔·에델 전신 4자세, 기본 파티 액터 확대

- `051-combat-hud-timing.md`: 행동력·덱 HUD 및 타격음 동기화 (로컬 HUD 검증·배포 완료)

- `052-support-fullbody.md`: 레오나 방어·마리엔 회복 전신 연출

- `053-route-briefing.md`: 탐사 경로별 준비·기회 안내 및 선택/취소 검증.

- `054-route-readability.md`: 지도 연결선 상태 구분·중심 정렬, 로컬 화면 검증 대기.

- 054 검증 후 배포 완료(2026-10-18): 상세 기록과 054-map.png 참조.

- `055-roadmap-qa-bot.md`: 공개 개발 현황과 로컬 기본 플레이 QA 봇.

- `056-mobile-route-sheet.md`: 모바일 경로 선택 패널 구현, 화면 검증 대기.

- `057-fullbody-hit.md`: 로드맵2 우선 진행, AR1 피격 원화·타임라인 연결.

- `058-party-hit-poses.md`: 기본 파티 피격4명 완성, SD 중복 표시 조건 수정(화면 검증 대기).

- `059-signature-skill-poses.md`: 세린·에델 전용 스킬 원화 및 카드별 자세 분기.

- `060-asset-qa-roadmap.md`: 전투 원화 자동 QA 및 배포 현황 정정.

- `061-save-status.md`: 라이브 기본 공격 확인 및 정상 저장 경고 수정.
- `062-animation-preview.md`: 기본 파티 전투 연출·개별 자세 미리보기.
- `063-smooth-combat-motion.md`: 전투 이동·반동·복귀 연속 보간.
- `064-inbetween-preview.md`: 4명 중간 원화 및 느린·반복 재생.
- `065-preview-frame-sampler.md`: 프레임 간격 측정 및 반복 체크박스 정리.
- `066-pose-readiness.md`: 원화 준비 후 미리보기 재생·잔상 단축.
- `067-short-landscape-combat.md`: 낮은 가로 전투의 손패·대상 중첩 수정.
- 068: 태블릿 가로 전투 손패 예약 공간 보정 (`068-tablet-landscape-combat.md`).
- 069: 원화 오류 보정, 지도 여백·숫자 정렬 및 색상 역할 분리 (`069-art-ui-consistency.md`).
- 070: 카드 현재 위력·기본 효과 안내 구분 (`070-card-value-labels.md`).
- 071: 7지역·700개 절차적 지도 연결 자동 검사 (`071-route-qa.md`).
- 072: 방어형 전용 스킬의 회복/보호막 명칭 오류 수정 (`072-skill-value-label.md`).
- 073: 스크린샷에서 확인한 상단 메뉴 줄바꿈·지도 보조 글씨 대비 보정 (`073-header-map-readability.md`).

- `083-achievement-labels.md`: 거점 업적 이름 표시 및 훈련·시장 등록/취소 화면 검증

- `084-estate-development.md`: 영지 구역·지역 선택·파티 퀵슬롯 5개 1차 구현

- `085-profile-achievements.md`: 마이페이지, 등급 업적 알림, 저장형 칭호 선택

- `086-tavern-character-dossier.md`: 주점 상세·성장 경로·기본 파티 개인 이야기 8개 장

- `087-progress-achievements.md`: 누적 진행 업적 10개 및 마이페이지 다음 목표

- `088-estate-release-qa.md`: 영지 개편 화면 QA와 탭 분기·진행도 표시 수정

- `089-public-player-uid.md`: 계정별 공개 UID 저장 및 마이페이지 연결

- `090-estate-art-batch.md`: 영지·세계 지도, 동료 이야기 32개 장, Lv.3 전문화, 카툰 제작 정책과 기준 시트. 자동 QA 59개 통과.
- `091-specialization-release-validation.md`: 전문화의 전투·저장 재개 검사와 090 배포 결과.
- `105-character-cartoon-replacement.md`: 32명 기본 전신 제작·로컬 연결, VR4·GO3 정체성 보정. SD·모션·NPC 및 화면 검증 미완료.
- `106-starting-party-cartoon-sd.md`: 기본 파티 4명 SD 제작·로컬 연결. 나머지 SD와 전신 모션은 후속 작업.
- `107-velora-cartoon-sd.md`: 벨로라 4명 SD 제작·로컬 연결, 누적 8/32명.
- `108-explorer-cartoon-sd.md`: 로웬·미라·오델·피아 SD 연결, 누적 12/32명.
- `109-shadow-cartoon-sd.md`: 베스라·니엘·사브린·루크 SD 연결, 누적 16/32명.
- `110-dusk-snow-cartoon-sd.md`: DS·WS 8명 SD 연결, 누적 24/32명. QA 생략.
