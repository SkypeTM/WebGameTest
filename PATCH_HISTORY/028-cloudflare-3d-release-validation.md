# 028 — Cloudflare 3D 공개 배포 검증

## 작업 목적

- WebGL 3D 전투 패치를 공개 Cloudflare Workers 환경에 반영하고, CDN 환경에서 실제 게임 흐름을 검증한다.

## 변경 파일

- `tests/browser/flow.spec.ts`: 지연 로드되는 HD 초상화의 실제 로드 완료를 기다리도록 브라우저 검증을 보완했다.
- `PATCH_HISTORY/README.md`: 023~028 패치 인덱스 누락을 복구했다.

## 배포 및 검증

- Cloudflare Workers 배포: `faee91c7-e499-4c3a-b951-62d7f51c9ca0`
- 공개 URL: `https://beneath-the-silent-bell.camp-cough.workers.dev`
- 공개 URL 대상 Playwright 흐름 통과: HD 초상화(1080px), 절차적 경로, WebGL SD 전투 객체, 풀사이즈 3D 공격·피격 컷

## 후속 작업

- 절차적 WebGL 메시를 캐릭터별 리깅 GLB 자산으로 순차 교체한다.
- 기본 파티와 변경 요새 이후의 캐릭터·몬스터 3D 모델 범위를 확장한다.
