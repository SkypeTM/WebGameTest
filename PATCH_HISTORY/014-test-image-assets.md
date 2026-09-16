# 014 test-images 자산 적용

## 작업 목적

작업 폴더의 test-images에 있는 캐릭터·몬스터 콘셉트 시트를 확인하고 게임 화면에서 실제 자산으로 연결한다.

## 변경 파일

- `public/assets/*`
- `data/asset_manifest.json`
- `app/page.tsx`
- `app/style.css`
- `PATCH_HISTORY/014-test-image-assets.md`

## 설계 주석

test-images는 ID가 표기된 콘셉트 시트이며 투명 스프라이트가 아니다. 우선 시트 원본을 보존하고, 이미지 표시 실패 시 기존 실루엣으로 복귀한다. 시트 원본을 최종 개별 스프라이트로 과장하지 않는다.

## 패치 내용

```diff
+ test-images에서 ID 표기 시트 확인
+ AR1, AR4, BC1, BC2 캐릭터 시트 연결
+ M17, M25, M33, M41 몬스터 시트 연결
+ public/assets/concept-sheets에 원본 시트 보존
+ manifest 상태를 concept-sheet로 표시
+ 시트 주 인물·첫 몬스터 영역을 CSS object-position으로 표시
+ 자산 문서에 콘셉트 시트와 최종 스프라이트의 차이 기록
```

## 검증 결과

- 이미지 파일 직접 확인
- manifest 경로 연결
- 이미지 로딩 실패 시 기존 SVG 실루엣 fallback 유지

## 남은 위험

시트 안의 여러 ID를 모두 개별 파일로 자른 것은 아니다. 나머지 캐릭터·몬스터는 기존 실루엣을 유지한다.
