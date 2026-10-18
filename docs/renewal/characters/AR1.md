# AR1 레오나 — 디자인 시트 v2

상태: 제작 목표. 런타임 원화 변경 완료 아님.

## 데이터
- 팩션: 아르켄 왕국
- 현행: 여, 29세, 왕관형 어깨갑옷과 큰 방패, 짧은 은발
- 목표: 여, 외형 29세, 성숙한 방벽대장
- 체형: 근육형 장신
- 성격/말투: 엄격하지만 동료에게 다정함
- 표정/손동작: 단호한 눈썹, 방패에 얹은 손
- 역할/능력 의도: 수호 / 아군 보호와 방패 반격

## 고정 외형
- 얼굴: 넓은 사각턱, 작은 회색 눈, 곧고 넓은 코
- 피부: 따뜻한 중간 갈색
- 머리/표식: 왼눈썹의 짧은 흉터, 짧은 은색 컬
- 팔레트: 남청·황동·백색
- 의상/장비: 왕관형 어깨갑옷과 큰 방패, 짧은 은발
- 손: 오른손 주무기 / 왼손 보조 장비
- 의상 층: 안쪽 셔츠 또는 보호복 → 팩션 외투 또는 갑옷 → 기존 무기와 대표 장신구

## 참조와 제작
- 정체성 참조: public/assets/fhd/portraits/AR1.webp
- 기존 시트 경로(존재/품질 확인 필요): art/characters/AR1_design_sheet.png
- 카메라: 전신 정면 3/4, 발 기준 (0.5,0.94), 동일 초점거리
- 광원: 좌측 위 부드러운 주광, 약한 차가운 림라이트
- 필수 자산: turnaround-front-side-back, face-expression-sheet, sd-idle, sd-ready, full-idle, full-windup, full-strike, full-recover, full-guard, full-hit, full-skill, dialogue-neutral, dialogue-explain, dialogue-resolve
- 공통 기준: ../CHARACTER_STYLE_BIBLE.md
- 외형 나이 변경 시 연령선·피부·골격을 새 기준 시트에서 함께 검수. 머리색은 나이와 독립적인 정체성 요소로 유지.

## 고정 프롬프트
Original adult female fantasy character, apparent age 29, 성숙한 방벽대장, 근육형 장신, 남청·황동·백색; clean refined anime linework, controlled cel shading, readable silhouette, adult anatomy. Preserve the approved turnaround identity. No text, no UI, no border.

## 검수/버전 기록
- 기준 시트: 미생성
- 파생 포즈: 미생성
- 실제 크기/alpha/hash: 생성 후 manifest 기록
- 현행 자산은 신규 묶음 완성 전 유지

## 052 지원 자세
- guard.png 및 투명 WebP 생성. ready 기반 화풍·장비손 유지. 전용 포즈가 있는 지원 행동만 전신 전환.

## 057 피격 자세
- hit.png / hit.webp 제작. motion-hit에서320ms 피격 전환,780ms ready 복귀. 게임 내 시각 검증 대기.
