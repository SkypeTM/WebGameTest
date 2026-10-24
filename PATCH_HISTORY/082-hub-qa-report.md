# 082 — 거점·진행 자동 검사 보고서

## 목적
- 제작·훈련·퀘스트·시장·저장 검사를 실행하고 짧은 결과와 상세 로그를 로컬에 저장하여 반복 QA 비용을 줄입니다.

## 변경
- scripts/qa-hub-report.mjs: 기존 game/store 검사를 실행하고 storage/qa/hub-latest.json 및 hub-latest.log 저장.
- package.json: qa:hub 명령 추가.
- data/roadmap.json: 자동 검사와 미완료 화면 검증을 구분.

## 검증
- 기존 game/store 검사 28/28 통과. 보고서 실행 결과는 작업 후 기록.
- 화면 검증은 localhost 연결 실패 페이지에 대한 브라우저 정책 차단으로 대기 중. 자동 검사는 화면 검증을 대체하지 않습니다.

- qa:hub 보고서 실행: 28/28 통과, 종료 코드 0. 임시 SQLite DB 사용으로 사용자 저장과 라이브 서버는 변경하지 않음.
- 사용자 외출로 화면 검증을 보류하고 독립 자동 검사 작업을 진행함.
