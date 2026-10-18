# AR4 에델 — 디자인 시트 v2

상태: 제작 목표. 런타임 원화 변경 완료 아님.

## 데이터
- 팩션: 아르켄 왕국
- 현행: 여, 24세, 짧은 케이프와 룬 사슬검, 붉은 땋은 머리
- 목표: 여, 외형 24세, 장난꾸러기 룬술사
- 체형: 운동형
- 성격/말투: 여유로운 농담 뒤에 치밀한 계산
- 표정/손동작: 한쪽 눈썹을 들고 사슬을 돌림
- 역할/능력 의도: 제어 / 적 행동 지연

## 고정 외형
- 얼굴: 하트형 얼굴, 올라간 눈꼬리, 각진 눈썹
- 피부: 구릿빛
- 머리/표식: 굵은 붉은 외갈래 땋은 머리
- 팔레트: 남청·황동·백색
- 의상/장비: 짧은 케이프와 룬 사슬검, 붉은 땋은 머리
- 손: 오른손 주무기 / 왼손 보조 장비
- 의상 층: 안쪽 셔츠 또는 보호복 → 팩션 외투 또는 갑옷 → 기존 무기와 대표 장신구

## 참조와 제작
- 정체성 참조: public/assets/fhd/portraits/AR4.webp
- 기존 시트 경로(존재/품질 확인 필요): art/characters/AR4_design_sheet.png
- 카메라: 전신 정면 3/4, 발 기준 (0.5,0.94), 동일 초점거리
- 광원: 좌측 위 부드러운 주광, 약한 차가운 림라이트
- 필수 자산: turnaround-front-side-back, face-expression-sheet, sd-idle, sd-ready, full-idle, full-windup, full-strike, full-recover, full-guard, full-hit, full-skill, dialogue-neutral, dialogue-explain, dialogue-resolve
- 공통 기준: ../CHARACTER_STYLE_BIBLE.md
- 외형 나이 변경 시 연령선·피부·골격을 새 기준 시트에서 함께 검수. 머리색은 나이와 독립적인 정체성 요소로 유지.

## 고정 프롬프트
Original adult female fantasy character, apparent age 24, 장난꾸러기 룬술사, 운동형, 남청·황동·백색; clean refined anime linework, controlled cel shading, readable silhouette, adult anatomy. Preserve the approved turnaround identity. No text, no UI, no border.

## 검수/버전 기록
- 기준 시트: 미생성
- 파생 포즈: 미생성
- 실제 크기/alpha/hash: 생성 후 manifest 기록
- 현행 자산은 신규 묶음 완성 전 유지

## 050 제작 체크포인트 (2026-10-17)
- 전신 ready/windup/strike/recover PNG 및 투명 WebP 생성, 공통 액터 manifest 연결.
- 경로: art-source/renewal/AR4, public/assets/renewal/AR4.
- 4자세 시제품. guard/hit/skill, 연속 모션·발 기준 정합은 후속.

## 058 피격 자세
- hit 원화 추가. 320ms hit→780ms ready 공통 타임라인. 실제 화면 검증 대기.

## 059 전용 스킬
- skill 원화 및 전용 공격 타임라인 연결. 실제 화면 QA 대기.
