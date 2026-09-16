# 011 구버전 저장 상태 호환

## 작업 목적

성장 시스템 도입 전에 생성된 캠페인 저장 상태에 `facilities` 등 신규 필드가 없어 전투 행동이 500 오류로 실패하는 문제를 해결한다.

## 변경 파일

- `lib/game.ts`
- `lib/store.ts`
- `tests/game.test.ts`
- `PATCH_HISTORY/011-legacy-state-normalization.md`

## 패치 내용

```diff
+ `normalizeGame` 추가
+ facilities, achievements, ending, 환생 필드를 구버전 상태에 기본값으로 보충
+ reducer 진입점에서 항상 정규화
+ 캠페인 조회 응답에서도 정규화해 성장 UI 접근을 안전하게 처리
+ 신규 성장 필드가 없는 전투 저장 상태 회귀 테스트 추가
```

## 설계 주석

정규화는 reducer 진입점에서 수행해 API, 저장소, 테스트 어느 경로로 상태 전이가 호출되어도 동일하게 적용한다. 기존 캐릭터·탐사·버전 값은 유지하고 새 필드만 초기 기본값으로 보충한다.

## 검증 결과

- TypeScript 검사 실행 완료
- 구버전 저장 상태 전투 회귀 테스트 실행 완료
- 기존 DB를 삭제하지 않고 기존 캠페인을 계속할 수 있는 경로 추가
