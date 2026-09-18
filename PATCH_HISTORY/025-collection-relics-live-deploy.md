# 025 — 통합 도감·팩션 유물·무료 라이브 배포

## 작업 목적

- 플레이 행동에 따라 캐릭터·아이템·몬스터·카드·유물이 계정 도감에 해금되도록 한다.
- 스토리와 팩션 우호도를 충족하면 지역 입구에서 탐사 전용 유물 3개 중 하나를 선택하게 한다.
- 계정 저장을 유지하는 무료 공개 서버에 배포하고 접속 주소를 기록한다.

## 변경 파일

- `lib/game.ts`, `app/page.tsx`, `app/style.css`: 계정 도감, 해금 조건, 유물 선택·효과, 전역 오버레이 UI
- `public/assets/fhd/relics/*`: 7개 팩션 × 3종 유물 1080px WebP 21개
- `lib/auth.ts`, `lib/store.ts`, `lib/cloud.ts`: Cloudflare D1 기반 계정 인증·게임 저장·시장 저장
- `migrations/0001_cloudflare.sql`, `wrangler.jsonc`, `open-next.config.ts`: 무료 Workers + D1 배포 구성
- `scripts/build-relic-assets.py`, `scripts/patch-opennext-windows.mjs`: 에셋 생성과 Windows 배포 빌드 호환
- `tests/game.test.ts`, `tests/browser/flow.spec.ts`: 도감·유물·D1 동시 요청·UI 흐름 검증

## 패치 내용

- 맵 탐사, 퀘스트, 랜덤 사건, 대장간 제작, 암상인 카드 변환에 해금 이벤트를 연결했다.
- 캐릭터·아이템·몬스터·카드·유물 전체를 잠금 힌트와 함께 보여주는 도감을 던전 안팎 공통 헤더에 추가했다.
- 퀘스트와 팩션 우호도 조건을 만족한 지역 입구에서 3개 유물 중 하나를 선택하며, 공격력·보호막·최대 체력·에너지·회복·드로우·획득 은화 효과가 해당 탐사에만 적용된다.
- 생성형 원본 시트를 바탕으로 유물 21종을 1080×1080 WebP로 분리해 적용했다.
- 로컬 파일 DB에 의존하던 공개 서버 경로를 Cloudflare D1로 전환하고 Better Auth, 캠페인, 행동 영수증, 시장을 영구 저장하도록 구성했다.
- 동일 요청 동시 전송 시 D1 영수증을 다시 읽어 결과를 한 번만 적용한다.

## 검증 결과

- `pnpm test`: 27/27 통과
- `pnpm typecheck`: 통과
- `pnpm build`: 통과
- OpenNext Cloudflare Workers 번들 생성: 통과
- Playwright: 핵심 전체 플레이, 동시 요청/CSRF, 도감·거점·시장 흐름을 각각 통과 확인

## 배포 결과

- 무료 Cloudflare Workers + D1 배포 번들과 마이그레이션을 준비했다.
- 공개 업로드는 자동 승인 검토가 Cloudflare 목적지의 명시적 승인을 요구해 대기 중이다.

## 남은 작업

- Cloudflare 임시 계정 공개 업로드, D1 원격 마이그레이션, 실제 URL 회원가입·저장 복원 검증
- 임시 계정을 60분 안에 사용자 Cloudflare 계정으로 귀속해야 영구 유지된다.
