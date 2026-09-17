# 021 — 캐릭터·아이템·카드·몬스터 자산 표시 개선

## 작업 목적

- 캐릭터 상세 이미지의 저화질 확대, 장비·아이템 누끼 테두리, 전용 스킬 카드 이미지, 몬스터 피격 잘림을 수정한다.

## 변경 파일

- `app/page.tsx`
- `app/style.css`
- `scripts/slice-assets.py`
- `public/assets/generated/items/*.png`
- `public/assets/generated/equipment/*.png`
- `public/assets/generated/factions/*.png`
- `public/assets/generated/sprites/*.png`
- `PATCH_HISTORY/README.md`
- `PATCH_HISTORY/021-asset-quality-card-monster-fixes.md`

## 패치 내용

- 캐릭터 상세창 이미지를 세로 영역에 강제 확대·절단하지 않고 원본 비율로 맞춰 표시해 흐려짐과 얼굴·장비 잘림을 줄였다.
- 투명 PNG 아틀라스를 RGB로 변환하던 절단 스크립트를 RGBA 기반으로 수정했다.
- 장비·팩션·상태 아이콘의 색 번짐 매트를 제거하고 가장자리를 부드럽게 정리했다.
- 아이템 아틀라스의 셀 경계선을 제외해 다시 절단하고, UI에서 `contain`과 둥근 테두리로 표시한다.
- 전용 스킬 카드는 공용 문양 대신 카드 소유 캐릭터의 `skill.png` 장면과 캐릭터명을 표시한다.
- 몬스터 이미지를 `cover`가 아닌 `contain`으로 표시한다. 피격 때 잘린 `hit` 셀로 교체하지 않고 온전한 `idle` 스프라이트에 피격 모션을 적용한다.
- 자산 재생성은 임시 파일 후 원자적으로 교체해 개발 서버가 파일을 읽는 중에도 안전하게 완료된다.

## 검증 결과

- `npm run typecheck` 통과
- `npm test` 통과: 22개
- `python -m py_compile scripts/slice-assets.py` 통과
- `npm run build` 통과
- `npm run test:e2e` 통과: PC→모바일 전체 원정 포함 3개
- 실제 브라우저에서 상세 캐릭터와 장비 아이콘 합성 상태 확인

## 남은 작업

- 아이템 원본 아틀라스 자체에 그려진 어두운 배경 질감은 유지된다. 완전한 개별 누끼가 필요한 항목은 원본을 다시 생성해야 한다.
