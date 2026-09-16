# 008 pnpm 없는 환경용 테스트 실행기

## 작업 목적

PowerShell PATH에 `node`, `npm`, `pnpm`이 없는 환경에서도 실제 E2E 테스트를 실행할 수 있게 한다.

## 변경 파일

- `scripts/test-e2e.ps1`
- `playwright.config.ts`
- `README.md`
- `package.json`
- `PATCH_HISTORY/008-no-pnpm-runner.md`

## 패치 내용

```diff
+ `scripts/test-e2e.ps1` 추가
+ PATH에 Node가 없으면 Codex Node 런타임 자동 탐색
+ 로컬 Playwright CLI와 격리 E2E 서버 직접 실행
+ `packageManager: pnpm@11.19.0` 고정
+ pnpm/npm 없는 PowerShell 실행 절차 문서화
```

## 설계 주석

프로젝트가 사용하는 Codex 대체 Node 경로를 우선 찾고, 로컬 Playwright CLI와 `scripts/e2e-server.ts`를 직접 호출한다. 전역 npm·pnpm 설치는 요구하지 않는다.

## 검증 결과

- 프로젝트 자체 PowerShell 실행기 실행 완료
- 격리 테스트 산출물 생성 확인
- 잔류 Node 프로세스 없음 확인
