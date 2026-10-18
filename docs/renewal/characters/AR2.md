# AR2 세린 — 디자인 시트 v2

상태: 제작 목표. 런타임 원화 변경 완료 아님.

## 데이터
- 팩션: 아르켄 왕국
- 현행: 여, 26세, 긴 남청 군복과 가느다란 창, 검은 포니테일
- 목표: 여, 외형 26세, 과묵한 결투가
- 체형: 슬림 장신
- 성격/말투: 짧고 정확한 말투
- 표정/손동작: 곁눈질, 창을 정렬하는 손
- 역할/능력 의도: 공격 / 표식 대상 관통 공격

## 고정 외형
- 얼굴: 긴 타원형 얼굴, 가는 눈, 긴 콧등
- 피부: 밝은 올리브
- 머리/표식: 높은 검은 포니테일, 한쪽 귀의 작은 커프
- 팔레트: 남청·황동·백색
- 의상/장비: 긴 남청 군복과 가느다란 창, 검은 포니테일
- 손: 오른손 주무기 / 왼손 보조 장비
- 의상 층: 안쪽 셔츠 또는 보호복 → 팩션 외투 또는 갑옷 → 기존 무기와 대표 장신구

## 참조와 제작
- 정체성 참조: public/assets/fhd/portraits/AR2.webp
- 기존 시트 경로(존재/품질 확인 필요): art/characters/AR2_design_sheet.png
- 카메라: 전신 정면 3/4, 발 기준 (0.5,0.94), 동일 초점거리
- 광원: 좌측 위 부드러운 주광, 약한 차가운 림라이트
- 필수 자산: turnaround-front-side-back, face-expression-sheet, sd-idle, sd-ready, full-idle, full-windup, full-strike, full-recover, full-guard, full-hit, full-skill, dialogue-neutral, dialogue-explain, dialogue-resolve
- 공통 기준: ../CHARACTER_STYLE_BIBLE.md
- 외형 나이 변경 시 연령선·피부·골격을 새 기준 시트에서 함께 검수. 머리색은 나이와 독립적인 정체성 요소로 유지.

## 고정 프롬프트
Original adult female fantasy character, apparent age 26, 과묵한 결투가, 슬림 장신, 남청·황동·백색; clean refined anime linework, controlled cel shading, readable silhouette, adult anatomy. Preserve the approved turnaround identity. No text, no UI, no border.

## 검수/버전 기록
- 기준 시트: 미생성
- 파생 포즈: ready/windup/strike/recover 4종 생성, 로컬 연결. art-source/renewal/AR2/GENERATION.md 참조. 전투 연속성 QA 미완료.
- 실제 크기/alpha/hash: 생성 후 manifest 기록
- 현행 자산은 신규 묶음 완성 전 유지

## 058 피격 자세
- hit 원화 추가. 320ms hit→780ms ready 공통 타임라인. 실제 화면 검증 대기.
