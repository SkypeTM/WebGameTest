# 052 · 방어와 회복 전신 연출

리뉴얼2항 후속. AR1 방어·AR3 회복 원화를 기준 ready에서 생성하여 전용 포즈가 있는 행동만 전신 컷인에 연결한다. 다른 캐릭터는 기존 SD 연출 유지.

변경: art-source/renewal, public/assets/renewal, renewal_actor_manifest, build-renewal-art, FullBodyActor, page.tsx, renewal-combat.css.

전투 계산/계정/저장 형식은 유지. 지원 연출에 적 피격이나 공격 슬래시를 표시하지 않는다. 자기 자신을 지원할 때 캐릭터가 중복되지 않도록 액터만 표시한다.

검증 및 배포: 진행 중. 키 포즈 전환이며 연속 리깅 아님.

- 18종 alpha/변환·타입 검사 통과. 내부 브라우저 AR1 방어 태세 자기 대상: 전신 guard 표시, 보호막4→21(+17), 행동력4→3, SD 복귀 확인. 증거 docs/renewal/052-guard.png. 회복 표시는 실제 HP 변화와 혼동하지 않도록 회복력으로 표시.

- AR3 응급 회복→AR2 선택: heal 원화와 대상 세린·회복력22 표시, HP68→70 확인. 증거 docs/renewal/052-heal.png. 회복 상한을 적용하는 서버 로직은 변경하지 않음.

## 배포
- 빌드 성공. Cloudflare 버전690c5073-c746-4f02-b295-1c52eeb213c1.
- /, /m, 새 원화2종, JS/CSS HTTP200 및 자산 바이트 일치. 로컬 서버 재시작 완료.
- 전체32명 지원/피격 원화, 연속 모션, 모바일·태블릿 추가 검증은 후속.
