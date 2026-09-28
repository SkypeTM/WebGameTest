# 039 · 동작 카드 원화와 팩션 NPC 대화

## 목적
캐릭터별 기본 타격/방어 태세/집중 일격 이미지, 고유 성물, 팩션 NPC 및 표정·손동작 대화를 연결합니다.

## 제작 정책
내장 이미지 생성 도구 사용. 생성 성공 파일만 공개 manifest에 등록합니다. 한도로 생성하지 못한 원화는 제작 대기 목록에 남기며 기존 이미지 폴백을 유지합니다. 사용자 요청에 따라 별도 QA는 생략하고 배포 빌드만 수행합니다.

## 적용 내용
- `app/page.tsx`, `app/components/QuestConversation.tsx`, `app/story-conversation.css`: 14개 의뢰를 NPC와 현재 편성 첫 캐릭터의 대화로 연결. 수락 전 브리핑, 완료 후 자동 귀환 대화, 다시 보기, 이전/다음/닫기 제공. 마지막 수락 버튼에서만 기존 서버 액션을 실행.
- `data/story_dialogues.json`: 장별 브리핑·귀환 각 4줄, 총 112줄의 대사.
- `data/story_npcs.json`: 8개 팩션의 전용 NPC 이름·직책·외형·성물 제안 대사. 플레이어블 캐릭터를 NPC로 대신 표시하던 방식 변경.
- `lib/story-art.ts`, `data/story_art_manifest.json`: 중립/설명/결심 포즈 연결. 말하는 사람을 밝게 표시하고 다음 이미지들을 미리 로드. 미생성 표정은 같은 인물 중립 또는 기존 dialogue 자산으로 대체.
- `data/card_character_art.json`: 생성 완료한 타격/방어/집중 일격을 손패·덱·도감 공통으로 적용.
- `lib/game.ts`: 21종 유물의 고유 이미지 경로 연결. 해금·효과·수락·보상·저장 규칙은 유지.
- `scripts/prepare-story-art.mjs`, `scripts/build-story-art.mjs`: 개별 생성 프롬프트와 PNG→WebP 변환/manifest/미완료 목록. 기존 `build-card-art.mjs`도 새 카드 항목을 지우지 않도록 수정.
- `docs/STORY_GUIDE.md`, `docs/STORY_SCRIPT_KO.md`: 시스템 설명·세계관·NPC 명단·전체 대본 제공.

## 이미지 생성 결과
내장 imagegen 사용. 처음에는 한도 오류가 있었으나 갱신 후 재개하여 114장을 확보했습니다. 이후 다시 usage_limit_reached가 발생하여 추가 생성은 중단됐습니다.
- 카드: AR1~AR4, VR1~VR4, BC1~BC4, BK1~BK4, WS1~WS3 각각 3종 = 57장.
- NPC: 8명 × 중립/설명/결심 = 24장.
- 고유 성물: 7지역 × 3종 = 21장.
- 플레이어 대화: AR1~AR4 × 3표정 = 12장.
- 남은 123장: WS4·DS1~4·GO1~4·EF1~4 카드 39장, 비아르켄 캐릭터 대화 84장. `art-source/story-v1/pending.json`이 실제 미완료 목록입니다. 전 캐릭터 이미지 제작 완료로 간주하면 안 됩니다.
- 원본 `art-source/story-v1/`, 게임 파일 `public/assets/story-v1/`. 단순 확대나 기존 파일 복제를 새 생성으로 집계하지 않았습니다.

## 검증 범위
사용자 요청에 따라 별도 QA 및 브라우저 플레이 테스트는 수행하지 않습니다. 배포에 필요한 프로덕션 빌드만 진행합니다.
