# 059 · 기본 파티 전용 스킬 연출

AR2 관통 표식·AR4 룬 사슬 전용 skill 원화를 생성한다. AR1 방패 반격/AR3 응급 회복은 기존 guard/heal 전용 자세를 유지한다.
서버 combatFx.card가 skill인 공격에만 새 자세를 사용하고 기본 공격은 기존 strike를 유지한다. 수치 계산 및 저장 형식 변경 없음.
기본 플레이 봇·타입·alpha 검사 후 기록. 실제 화면 검증 전 배포 보류.

공격 컷인에 전용 스킬명 표시. motion-strike motion-skill에서 전용 skill 자세가 있으면 타격 시점에 사용하고, 없으면 기존 strike fallback. AR1 guard·AR3 heal 경로 유지.

검증: 생성2종 원화 육안 확인,24종 alpha/변환 통과, QA 봇3/3 및 타입 검사 통과. 게임 내 스킬 연출 시각 확인은 미실시. 라이브055 유지.
