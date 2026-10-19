# AR2 원화 생성 기록

- 기준: docs/renewal/characters/AR2.md, CHARACTER_STYLE_BIBLE.md
- ready 참조: public/assets/fhd/characters/AR2/idle.webp
- 후속 3자세 참조: art-source/renewal/AR2/ready.png
- 생성: built-in imagegen, transparent_background=true, 2026-10-16
- 공통: adult woman age26, tall slender adult anatomy, high black ponytail, navy gold officer coat, white trousers, dark armored boots, same ornate spear, clean anime linework, controlled cel shading. Full body and entire spear inside frame; transparent background, no text.
- windup: torso coiled, knees bent, spear drawn back with right-hand primary grip and left support.
- strike: lunge toward screen right, spear thrust diagonally upward.
- recover: upright recovery, spear toward chest, coat and ponytail settling.
- 원본 PNG 보존, WebP quality95/alpha100 변환. 크기·SHA256은 renewal_actor_manifest.json.
- 전신 및 창 끝 포함 확인. 자세별 발 높이와 장식 차이는 남아 있으며 연속 리깅 완성품으로 간주하지 않는다.

## 058 hit
- 기준: AR2/ready.png. built-in imagegen, 1024x1536, 투명 배경.
- 지시: 동일 성인 여성의 얼굴/머리/의상/팔레트/무기손 유지, 화면 오른쪽 충격에 상체 뒤로 젖힘·무릎 굽힘·긴장 표정, 전신과 무기 끝 포함, 피/상처/이펙트 없음.
- 원본 hit.png 보존, hit.webp 변환. 단일 키 포즈이며 연속 리깅 아님.

## 059 skill
- 참조: AR2/ready.png. built-in imagegen,1024x1536,투명 배경.
- 동일 성인 여성 정체성·복장·팔레트 유지. AR2: 오른손 창, 왼손 중간 지지, 오른쪽 관통 찌르기. AR4: 오른손 룬검 유지, 왼손 청색 룬 마법진 시전. 전신·무기 끝 포함.
- skill.png 원본 및 skill.webp. 전용 카드만 타격 시점에 사용.

## 064 swing
Built-in imagegen; transparent_background=true; reference windup.png + strike.png. Prompt: ONE 1024x1536 transparent full-body in-between halfway from windup to strike. Exact identity, costume, hand/weapon ownership and style. Entire weapons and boots within frame, stable ground line, no duplicate limbs or background. Spear nearly horizontal, elbows half extended.
Saved swing.png and public/assets/renewal/AR2/swing.webp. Not continuous skeletal animation.
