# 033 — 모바일 전용 경로와 포터블 셸

## 작업 목적

모바일·태블릿 사용자를 별도 주소와 전용 UI 셸로 안내한다.

## 변경 파일

- `proxy.ts`
- `app/m/page.tsx`
- `app/style.css`

## 패치 내용

- 휴대폰·태블릿 User-Agent의 루트 접속을 `/m`으로 임시 리디렉션한다.
- `/m`은 기존 계정·저장·게임 API를 공유하면서 포터블 레이아웃 셸을 렌더링한다.
- Workers.dev 주소는 임의의 `m.` 하위 도메인을 지원하지 않으므로, 공개 모바일 주소는 `/m` 경로를 사용한다.
- Wrangler에 기존 공개 Worker의 Cloudflare 계정을 고정해 비대화형 배포 대상을 일관되게 선택한다.

## 검증 결과

- iPhone User-Agent의 `/` 요청은 `/m` 307로 이동한다.
- 데스크톱 User-Agent의 `/` 요청은 200으로 유지된다.
- `/m`과 `/?desktop=1` 요청은 200으로 응답한다.
- `pnpm typecheck`, `pnpm build` 통과.
- Cloudflare Worker 버전 `86d76ed3-edd0-4deb-8e40-52b4b904286f` 공개 배포 완료.
- 라이브 iPhone·iPad User-Agent의 `/` 요청은 `/m` 307, 라이브 `/m`은 200 확인.
