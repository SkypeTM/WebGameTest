# 005 격리 테스트 환경

## 작업 목적

공유 개발 서버·개발 DB 때문에 브라우저 테스트가 불안정했던 문제를 해결하고 실제 플레이를 반복 실행할 수 있게 했다.

## 변경 파일

- `scripts/e2e-server.ts`
- `playwright.config.ts`
- `package.json`
- `tests/browser/flow.spec.ts`
- `README.md`
- `TEST_RESULTS.md`

## 패치 내용

```diff
+ 테스트 전용 `storage/e2e.sqlite` 초기화
+ Better Auth 및 게임 마이그레이션 자동 실행
+ 포트 3100 전용 Next 개발 서버 자동 시작·종료
+ Playwright webServer에 격리 서버 연결
+ 성장·시장 화면 실제 조작 테스트 추가
+ 전역 pnpm이 없는 환경용 직접 실행 절차 문서화
```

## 주석

E2E는 포트 3000에 이미 실행 중인 서버를 재사용하지 않는다. 테스트마다 계정·세션·SQLite를 새로 생성해 로그인, 저장, 화면 상태를 독립적으로 검증한다.

## 검증 결과

- 브라우저 테스트 3개 통과
- 타입 검사 통과
- 17개 자동 테스트 통과
- 운영 빌드 통과

## 후속 위험

실제 휴대폰 하드웨어, Safari·Firefox, 다중 서버 부하는 별도 검증이 필요하다.
