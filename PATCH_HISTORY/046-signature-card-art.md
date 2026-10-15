# 046 — 전용 스킬 카드 원화 보완

## 목표
남은 28명(VR/BC/BK/WS/DS/GO/EF)의 전용 스킬을 각 캐릭터 초상화와 능력에 맞는 신규 원화로 교체한다.

## 작업 방식
- 기존 generation-plan.json 프롬프트와 fhd/portraits 인물 참조를 사용한다.
- built-in imagegen으로 개별 생성하고 art-source/story-v1에 원본을 보존한다.
- 기존 build-story-art.mjs로 WebP 및 매핑을 갱신한다. 게임 규칙과 저장 데이터는 변경하지 않는다.
- 생성 결과 및 검증·배포 상태는 완료 후 기록한다.

## 진행 상태
제작 시작. 미완료 대화 자세 84종은 별도 후속 작업이다.

## 완료 및 검증
- 28종 생성·WebP 변환·기존 카드 매핑 연결 완료. 전용 스킬 총 32명 파일 검사 통과.
- story_art_manifest 190개, pending 84개(대화 자세). 원본 해상도는 manifest에 기록.
- 28종 시각 검토, TypeScript 검사 통과. 게임 로직 변경 없음.
- 로컬 내부 브라우저가 이전 연결 실패 페이지에 남아 있어 이번 카드의 로컬 화면 QA는 미완료. 파일·매핑 검사는 완료.
- 변경 파일: art-source/story-v1/card-*-skill.png, pending.json, public/assets/story-v1/card-*-skill.webp, data/story_art_manifest.json, data/card_character_art.json.


## 배포
- GitHub 커밋: 07fa1af (main push 완료).
- Cloudflare: 07a0235b-09db-4db2-b307-06f0097d3d6e.
- production build 통과, 신규 28개 라이브 자산 HTTP 200.

- Codex 내부 라이브 브라우저 도감 카드 탭에서 신규 VR1/VR2 표시 확인. 도감 story-v1 이미지 32개 모두 로드 완료 확인.
