# AR1 전신 전투 시제품

생성기: built-in imagegen. 원본 1024×1536 목표, 실제 크기/hash는 data/renewal_actor_manifest.json.
정체성 참조: public/assets/fhd/portraits/AR1.webp. ready 기준으로 windup/strike/recover 파생.
프롬프트 공통: adult woman knight Leona AR1, apparent age29, warm medium-brown skin, strong square jaw, narrow grey eyes, short curly silver hair, small left eyebrow scar, tall muscular adult, navy/brass crown armor, white tabard, LEFT shield RIGHT sword, clean refined anime ink/cel shading, 7-head adult body, full body actual alpha, no background/text, all boots/head/weapons visible.
- ready: feet apart, shield close, sword diagonally down. Camera 3/4 gaze right.
- windup: bent knees, torso back, right sword behind shoulder, left shield chest.
- strike: forward sword slash; initial blade tip clipped, regenerated with pulled-back camera and entire blade tip visible.
- recover: sword diagonal down right, shield returning upright, weight settling.

현재 4포즈 교체형 연출이며 연속 프레임/스켈레탈 리깅 완성은 아니다. 정면/측면/후면 정식 턴어라운드와 guard/hit/skill 추가 필요. 동작 간 발 위치·무기 크기 미세 차이는 후속 프레임 정합 작업 대상.

## 052 / guard
- 2026-10-17 built-in imagegen, transparent_background=true.
- 참조: art-source/renewal/AR1/ready.png.
- 포즈: 동일한 왼팔 방패를 앞으로 들어 방어, 오른손 검은 아래로.
- exact same adult identity/costume, fullbody, complete boots/props, transparent cutout, no floor/text. 원본1024x1536. WebP95/alpha100.

## 057 hit
- 참조: ready.png. built-in imagegen, 투명 배경, 1024x1536.
- 프롬프트: 동일29세 성인 여성 방벽기사, 갈색 피부/짧은 은발 컬/남청 금장 갑옷/백색 타바드 유지. 오른손 검·왼팔 왕관 방패. 화면 오른쪽에서 받은 충격에 상체가 뒤로 젖혀지고 무릎이 굽혀짐. 전신/무기 끝 여백, 피/상처/이펙트 없음.
- 출력: hit.png. 기존 ready와 별도 원본 보존. 키 포즈이며 연속 리깅 아님.

## 064 swing
Built-in imagegen; transparent_background=true; reference windup.png + strike.png. Prompt: ONE 1024x1536 transparent full-body in-between halfway from windup to strike. Exact identity, costume, hand/weapon ownership and style. Entire weapons and boots within frame, stable ground line, no duplicate limbs or background. Right sword elbow unfolds halfway from overhead, left shield guarding.
Saved swing.png and public/assets/renewal/AR1/swing.webp. Not continuous skeletal animation.
