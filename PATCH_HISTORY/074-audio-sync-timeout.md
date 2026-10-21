# 074 — 계정 오디오 동기화 복구

- 목적: 응답이 멈춘 설정 요청이 이후 재시도를 계속 차단하지 않도록 한다.
- 변경: 10초 요청 제한, 계정 변경·화면 종료 시 요청 취소, 서버 응답 형식 검증.
- 변경 파일: `lib/audio-sync.ts`, `app/components/useAccountAudio.ts`, `tests/audio-sync.test.ts`, `data/roadmap.json`.
- 검증: 오디오 테스트 6/6 통과(음소거·음량 0, 계정 분리, 시간 초과 후 재요청, 취소, 잘못된 응답).
- Next.js TypeScript 및 Cloudflare 프로덕션 빌드 통과.
- 실제 기기 간 재생 확인과 브라우저 검증은 별도 필요.
