# 110 — 황혼·성단 SD 원화 교체

## 목적
전신 기준 원화에 맞춘 탐사·전투 SD를 팩션별로 교체한다.

## 변경 사항
- DS 4명 SD 새 비율·투명 배경 제작. 전신 비율과 배경이 남은 첫 시안은 적용하지 않는다.
- WS 4명 SD 제작·연결. 전체 SD 적용 24/32명.
- 기존 파일은 보존한다. 사용자 요청에 따라 화면·플레이 QA는 생략한다.

## 파일과 적용 범위
- `public/assets/cartoon-v5-sd/`, `art-source/cartoon-v5-sd/`: DS·WS 8종.
- `data/sd_asset_manifest.json`: 탐사·전투 SD 경로와 원본 크기.
- `data/cartoon_sd_*_batch.json`, `data/cartoon_sd_progress.json`: 생성 기록 및 적용 상태.
- `data/roadmap.json`, 패치 기록: 완료 수량과 미완료 범위 갱신.

## 확인과 후속 작업
- 원화 자체의 얼굴·무기 손·전신 포함·배경 제거를 직접 확인했다. 화면 QA 통과를 의미하지 않는다.
- 남은 GO·EF 8명과 전신 전투 모션·NPC·몬스터·카드·승급 원화는 후속 작업이다.
- 일부 원화의 굽 높이·작은 장식·여백은 최종 정합 단계에서 추가 정리 대상이다.
