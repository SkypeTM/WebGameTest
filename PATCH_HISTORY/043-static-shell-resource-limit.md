# 043 — 첫 화면 Worker 자원 사용 감소

- 사용자 보고: 루트 페이지에서 간헐적 Cloudflare 1102. 확인 시 다시 HTTP 200으로 응답하여 해당 실패 요청의 CPU/메모리 세부 원인은 재현하지 못함.
- `/`, `/m`의 공개 빌드 HTML을 정적 자산으로 발행하고 가벼운 Worker에서 제공. 첫 화면 요청에서 Next 서버 초기화/미들웨어를 우회.
- 모바일 자동 이동, desktop=1 예외 유지. API와 RSC 요청은 기존 OpenNext 서버 처리 유지. 계정/DB/결제 요금제 변경 없음.
- 동적/재검증 페이지를 잘못 발행하지 않도록 prerender manifest를 빌드 시 검사.
- typecheck 및 Cloudflare 빌드 통과. 전체 게임 QA 생략. API의 무료 CPU 한도 초과 가능성까지 제거한 것은 아님.
