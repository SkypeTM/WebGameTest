# 045 — 암상인 투명 원화 및 미완료 카드

## 목표
기존 불투명 암상인 fallback을 고해상도 투명 원화로 교체하고 미완료 EF 기본 카드 원화를 보완한다. 원본 생성 및 검증 후 기존 manifest 방식으로 연결한다.

## 진행
- built-in imagegen 사용. 원본/프롬프트: art-source/story-v1.
- 상태별 암상인 생성, EF 카드 생성, 자산 빌드, 제한된 UI QA 및 배포 순서.

## 생성 명세와 저장 위치
- built-in imagegen 사용. 원본: `art-source/story-v1/merchant-*.png`, `card-EF*-*.png`.
- 카드 기본 프롬프트: `art-source/story-v1/generation-plan.json`. 해당 EF 인물의 `public/assets/fhd/portraits/EF*.webp`를 참조하고 얼굴·머리·복장 유지, 선명한 정사각형 액션 구도를 추가 지시.
- 암상인은 기존 idle.webp를 참조하여 같은 얼굴·수염·녹색 스카프·황동 장식·가죽 코트를 유지. idle을 기준으로 welcome(손바닥 환영), rare(푸른 유물 소개), exchange(동전과 포장 물품 교환), surprised(손을 가슴에 대고 놀란 표정), portrait(상반신 대화) 생성.
- 전신은 머리와 발이 포함된 하나의 연속된 인물, 실제 알파 배경, 텍스트/프레임 없음. 원본 1024×1536(암상인), 카드 원본 크기는 manifest에 기록. 단순 확대를 FHD 신규 생성으로 표기하지 않음.
- 기존 MerchantLive2D 상태 매핑과 카드 아트 매핑에 연결. 실제 Cubism 리깅이 아니라 자세별 이미지와 기존 호흡 애니메이션 방식.

## 검증과 남은 자산
- 암상인 6종 실제 alpha 확인. 로컬 Codex 내부 브라우저에서 누끼 전신·환영 자세, 동료 선택과 회복 거래 확인.
- 카드 32명 × 타격/방어/집중 일격 = 96개 매핑 및 파일 존재 검사 통과.
- TypeScript 검사 통과. 게임 로직 변경 없음.
- 스토리 아트 manifest 162개, pending 112개. 남은 것은 다른 팩션 대화 표정 84개와 전용 스킬 신규 원화 28개이며 기존 fallback은 유지한다. 전체 작업 완료로 집계하지 않는다.

## 배포 기록
- GitHub: 3c24733. Cloudflare: 9037ee53-8b07-46d4-b8ad-f921f8547824.
- 라이브 암상인 도달·재로그인 저장 확인, 자산 18개 HTTP 200 확인.
