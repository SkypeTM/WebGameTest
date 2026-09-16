# 015 커밋 후 GitHub 자동 push

## 작업 목적

앞으로 로컬 커밋이 생성될 때마다 현재 브랜치를 GitHub `origin`으로 자동 push한다.

## 변경 파일

- `scripts/install-git-hooks.ps1`
- `README.md`
- `PATCH_HISTORY/015-auto-push-hook.md`
- 로컬 `.git/hooks/post-commit` 설치

## 패치 내용

```diff
+ post-commit 훅 설치 스크립트 추가
+ 커밋 성공 후 origin/current-branch 자동 push
+ GitHub 인증·네트워크 실패 시 커밋은 유지하고 오류 표시
+ 설치·해제 방법 README에 기록
```

## 설계 주석

자동 push는 GitHub 인증이 이미 설정된 로컬 환경에서만 성공한다. 훅은 커밋을 되돌리거나 재작성하지 않으며 push 실패가 커밋 자체를 실패시키지 않는다.

## 검증 결과

훅 설치 후 테스트용 커밋으로 실행 여부를 확인하고, 원격 커밋 해시를 확인한다.
