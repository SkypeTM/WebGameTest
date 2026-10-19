# AR4 에델 생성 기록

- 기준: docs/renewal/characters/AR4.md, CHARACTER_STYLE_BIBLE.md
- ready 참조: public/assets/fhd/characters/AR4/idle.webp
- 후속 포즈 참조: art-source/renewal/AR4/ready.png
- built-in imagegen, transparent_background=true, 2026-10-16~17
- 고정 디자인: 24세 성인 여성, 구릿빛 피부·붉은 땋은 머리·남색/흰색 망토·남색 반바지·황동 정강이 갑옷·룬 검.
- 공통 프롬프트: exact same adult identity/outfit, refined anime linework, full body, complete boots and weapon, transparent background, no text/floor, portrait1024x1536.
- windup: 몸을 낮추고 손/검을 당겨 준비. strike: 화면 오른쪽을 향한 마법/검 공격. recover: 무기/손을 내리고 균형 회복.
- AR3 strike의 좌우 손 전환, AR4 ready 검 잘림을 재생성으로 교정.
- WebP quality95/alpha100, 원본 PNG 보존. 크기/해시: data/renewal_actor_manifest.json.
- 키 포즈 시제품이며 연속 리깅 아님. 장식과 발 기준점의 자세별 차이 보정은 후속.

## 058 hit
- 기준: AR4/ready.png. built-in imagegen, 1024x1536, 투명 배경.
- 지시: 동일 성인 여성의 얼굴/머리/의상/팔레트/무기손 유지, 화면 오른쪽 충격에 상체 뒤로 젖힘·무릎 굽힘·긴장 표정, 전신과 무기 끝 포함, 피/상처/이펙트 없음.
- 원본 hit.png 보존, hit.webp 변환. 단일 키 포즈이며 연속 리깅 아님.

## 059 skill
- 참조: AR4/ready.png. built-in imagegen,1024x1536,투명 배경.
- 동일 성인 여성 정체성·복장·팔레트 유지. AR2: 오른손 창, 왼손 중간 지지, 오른쪽 관통 찌르기. AR4: 오른손 룬검 유지, 왼손 청색 룬 마법진 시전. 전신·무기 끝 포함.
- skill.png 원본 및 skill.webp. 전용 카드만 타격 시점에 사용.

## 064 swing
Built-in imagegen; transparent_background=true; reference windup.png + strike.png. Prompt: ONE 1024x1536 transparent full-body in-between halfway from windup to strike. Exact identity, costume, hand/weapon ownership and style. Entire weapons and boots within frame, stable ground line, no duplicate limbs or background. Right rune greatsword halfway forward, left hand releasing grip.
Saved swing.png and public/assets/renewal/AR4/swing.webp. Not continuous skeletal animation.
