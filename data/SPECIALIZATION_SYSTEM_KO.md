# 성장 전문화 시스템

2026-11-01 / 기존 전문화 유지, 패치120 심화 분기 구현. 화면 검증은 사용자 요청으로 생략.

- 훈련장에서 Lv.3 이상 보유 동료마다 맹공(공격 +3), 수비(방어 +2), 집중(주문 +3) 중 하나 선택.
- 거점에서 무료 변경. 탐사 중 변경 금지. 별도 스킬 포인트나 재화 소모 없음.
- Hero.specialization에 저장. 기존 저장의 미선택은 보정 없음. 잘못된 값은 정규화 시 제거.
- heroStats의 기존 능력치 계산에 단일 보정 적용. 교체 시 이전 보정 제거, 중첩 없음.
- 기존 레벨 키워드 및 상위 전직은 유지. 파티 퀵슬롯은 편성·장비만 저장하며 전문화는 동료 자체 성장 상태.
- 주점 상세에서 현재 전문화 확인 가능.
- 기존 검증 기록: 전문화 테스트 2개, 기존 게임/카드 키워드 테스트 30개 및 TypeScript 통과. 이 기록은 새 심화 분기를 검증한 결과가 아니다.

## Lv.7 심화 분기 — 패치120

기존 Lv.3 전문화 아래에 각각 두 가지 심화를 둔다. 전체32명 공통 구조이며 기존 직업·고유 특성·전용 스킬은 유지한다.

| 부모 전문화 | 심화 ID | 이름 | 추가 보정 |
|---|---|---|---|
| assault | assault-power | 강타 | 공격 +2 |
| assault | assault-precision | 정밀 | 치명타 +4%p |
| bulwark | bulwark-fortress | 철벽 | 방어 +2 |
| bulwark | bulwark-reprisal | 반격 준비 | 공격 +1 · 방어 +1 |
| focus | focus-mastery | 주문 숙련 | 주문 +2 |
| focus | focus-composure | 안정 | 주문 +1 · 방어 +1 |

- 모두 Lv.7 이상, 해당 전문화 선택, 보유 동료, 거점 상태일 때 선택한다. 거점에서 무료로 교체할 수 있다.
- 반격 준비는 능력치 보정의 이름이다. 별도 반격 행동이나 상태를 생성하지 않는다.
- 한 명당 심화 하나만 활성화한다. 기존 전문화 효과와 심화 효과를 각각 한 번만 더한다.
- 전문화를 바꾸면 부모가 다른 심화는 해제한다. 그 전문화로 돌아와도 예전 심화를 자동 복구하지 않는다.
- Lv.3 방어 카드 보존·Lv.5 전용 스킬 발견·2단계 승급 생성·3단계 승급 역할 보정은 유지한다.

## 구현 계약

- `lib/skill-tree.ts`: `SpecializationId`, `MasteryId`, `SkillBonuses`, `SkillTreeMember` 및 분기 정의. 게임 모듈을 가져오지 않아 서버·화면이 공통 사용 가능하다.
- `specializations`: 기존 세 전문화의 `id/name/minLevel/bonuses/description`.
- `masteries`: 여섯 심화의 `id/name/parent/minLevel/bonuses/description`. 모든 `minLevel`은7.
- `getSpecialization(unknown)`, `getMastery(unknown)`: 저장값을 안전하게 조회하며 유효하지 않으면 `undefined`.
- `activeMastery(member)`: 레벨 및 부모 전문화까지 충족한 심화만 반환한다.
- `masteryBonus(member)`: 항상 `attack/defense/spell/crit` 네 수치를 반환한다. 미선택·잘못된 ID·부모 불일치·레벨 미달은 모두0. 기존 전문화 보정은 이 함수에 포함하지 않는다.
- `CharacterSkillTree`: `member`, `characterName?`, `editable?`(기본 false), `locked?`, `onSpecialize?(SpecializationId)`, `onMaster?(MasteryId)`. 훈련장은 선택형, 주점은 열람형으로 연결한다. 콜백이 없는 종류는 열람형이다.
- 서버 행동: `act({type:"mastery", id:hero.id, choice:masteryId})`. 서버에서 보유·거점·레벨·부모 분기를 다시 검증한다.

## 저장 호환과 범위

- `Hero.mastery?: MasteryId`에 선택한 ID 하나를 저장한다. 기존 저장의 누락은 미선택으로 유지하며 자동 배분하지 않는다.
- 정규화 시 잘못된 값, 부모 불일치, Lv.7 미달 값을 제거한다. 정상적인 기존 전문화·승급은 유지한다.
- 캠페인 JSON 저장에 포함하며 별도 DB 테이블·마이그레이션은 추가하지 않는다.
- 파티 퀵슬롯은 편성·장비만 유지한다. 전문화와 심화는 캐릭터 영구 성장이다.
- 새로운 원화·음성·전투 스킬·스킬 포인트·분기별 퀘스트는 이번 범위가 아니다.
- 패치120 화면·플레이·자동 QA는 미실행. 초기 수치의 실전 밸런스 검증은 후속이며 배포 상태와 별도로 기록한다.
