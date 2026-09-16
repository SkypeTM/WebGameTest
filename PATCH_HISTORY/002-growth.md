# 002 성장·관계 시스템

## 작업 목적

거점에서 시설을 강화하고 동료를 훈련·치료하며 업적을 저장할 수 있게 했다.

## 변경 파일

- `data/balance.json`
- `lib/game.ts`
- `app/page.tsx`
- `tests/game.test.ts`

## 패치 내용

```diff
+ Game.facilities: forge, training, infirmary, canteen
+ Game.achievements 추가
+ facilityUpgradeCost, trainingCost, healingCost, trainingXP 추가
+ `upgradeFacility` 행동 추가
+ `train` 행동 추가
+ `heal` 행동 추가
+ 시설 레벨에 따른 비용·피해·경험치·치료비 적용
+ 거점 성장 탭과 동료별 행동 버튼 추가
+ 성장 전용 테스트 추가
```

## 주석

성장 행동은 `reduceGame`에서 탐사 중 실행을 거절하고 은화·소유권·부상 상태를 검증한다. 클라이언트는 버튼을 제공할 뿐 비용이나 결과를 신뢰하지 않는다.

## 검증 결과

- 자동 테스트 15개 통과
- 타입 검사 통과

## 후속 위험

진화·룬·진급·복합 우호도 의뢰와 식당 효과는 아직 단순화되어 있다.
