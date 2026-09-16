# 010 GitHub 업로드 준비

## 작업 목적

로컬 프로젝트와 패치 히스토리를 GitHub 저장소에 안전하게 올릴 수 있도록 원격 설정과 추적 대상 파일을 정리한다.

## 변경 예정 파일

- `.gitignore`
- `PATCH_HISTORY/010-github-upload-preparation.md`

## 패치 내용

```diff
+ origin 예시 URL을 실제 GitHub 저장소 URL로 교체
+ 원격 main 브랜치 확인 및 병합 준비
+ `.pnpm-store/`와 생성된 테스트 이미지 추적 제외
+ 소스·문서·패치 히스토리만 커밋 대상으로 유지
```

## 설계 주석

의존성 캐시와 테스트 산출물은 코드 확인에 필요하지 않고 저장소를 불필요하게 크게 만든다. `test-results/`와 `playwright-report/`에 이어 `.pnpm-store/`와 `test-images/`도 무시한다.

## 검증 결과

원격 fetch, 로컬 커밋, 병합, push 결과를 기록한다.
