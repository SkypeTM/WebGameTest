# 029 — Blender 리깅 캐릭터 파이프라인

## 작업 내용

- 첨부 원화 시트의 BC2(미라) 작업본에서 별도 버전의 Blender 리깅 파일을 생성했다.
- `BC2_rigged.glb`에 Armature 1개와 Idle·Attack·Hit·Death 애니메이션 클립을 포함했다.
- Blender 5 저장 시 미사용 액션이 제거되지 않도록 각 클립을 보존 처리했다.
- 게임의 `Actor3D`가 GLB를 우선 로드하고, 자산을 읽지 못할 때 기존 WebGL 메시로 안전하게 대체하도록 했다.

## 생성 자산

- `3D_Build/BC2/bc2_rigged_v011.blend`
- `public/assets/models/BC2/BC2_rigged.glb`
- `scripts/blender/build_bc2_production.py`

## 검증

- Blender GLB 재가져오기: 8,200 폴리곤, Armature 1개, 애니메이션 4개 확인
- `pnpm typecheck` 통과
- `pnpm build:cloudflare` 통과

## 품질 기준 후속 작업

- 현 GLB는 원화와 리깅 연결을 검증하는 제작 초안이다. MMD급 공개 자산으로 승격하기 전 의상 리토폴로지, UV 언랩, PBR 텍스처, 머리카락 카드, 표정 셰이프키와 물리 본을 완성한다.
- 같은 제작 기준으로 기본 파티 4명과 첫 지역 몬스터를 개별 제작한다.
