# 080 — localhost IPv4 연결 거부 복구

- 사용자 ERR_CONNECTION_REFUSED 신고 후 수신 주소 확인: ::1:3000만 LISTEN, 127.0.0.1:3000은 REFUSED.
- Node의 DNS 결과를 IPv4 우선으로 지정하고 Next hostname은 localhost 유지.
- 서버를 외부 인터페이스에 공개하거나 출처 검사/인증을 완화하지 않음.
- 재실행 후 127.0.0.1:3000 LISTEN 및 Next Ready 확인.
- 브라우저 연결 실패 화면은 data: URL 정책으로 차단됨. 사용자 새로고침 후 로그인·이어하기 재검증 대기.
- 사용자 새로고침 후 세 번째 Codex 탭에서 로그인 상태·이어하기·저장 v22 확인 완료.
