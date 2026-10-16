import fs from "node:fs/promises";
const roster = JSON.parse(await fs.readFile("data/characters.json", "utf8"));
const concepts = [
  [
    29,
    "성숙한 방벽대장",
    "근육형 장신",
    "엄격하지만 동료에게 다정함",
    "단호한 눈썹, 방패에 얹은 손",
  ],
  [
    26,
    "과묵한 결투가",
    "슬림 장신",
    "짧고 정확한 말투",
    "곁눈질, 창을 정렬하는 손",
  ],
  [
    34,
    "안경 의무관",
    "아담한 성인 체형",
    "친절하지만 치료 지시에는 단호함",
    "부드러운 미소, 약함을 여는 손",
  ],
  [
    24,
    "장난꾸러기 룬술사",
    "운동형",
    "여유로운 농담 뒤에 치밀한 계산",
    "한쪽 눈썹을 들고 사슬을 돌림",
  ],
  [
    31,
    "냉정한 추적사수",
    "탄탄한 장신",
    "타인을 신뢰하기까지 오래 걸림",
    "집중한 눈, 활시위를 확인",
  ],
  [
    27,
    "안경 공구 수집가",
    "아담한 성인 체형",
    "도구 얘기에는 말이 빨라짐",
    "안경을 밀어 올리고 도구를 제시",
  ],
  [
    35,
    "든든한 방벽공",
    "건장한 체형",
    "직설적이며 실무 중심",
    "호탕한 미소, 접이식 방벽을 펼침",
  ],
  [
    30,
    "우아한 여성 지휘관",
    "장신 슬림",
    "격식 있는 존댓말과 절제된 자신감",
    "가벼운 미소, 펼친 손으로 진로 지시",
  ],
  [
    23,
    "쾌활한 탐사꾼",
    "민첩한 체형",
    "발견을 숨기지 못하는 호기심",
    "밝은 눈, 석궁을 안전하게 내림",
  ],
  [
    35,
    "차분한 등불 안내자",
    "균형형",
    "상대 말을 끝까지 듣는 상담자",
    "편안한 미소, 등불을 들어 길 안내",
  ],
  [
    33,
    "무뚝뚝한 구조대장",
    "운동형 장신",
    "설명보다 먼저 행동",
    "단단한 시선, 동료에게 손 내밈",
  ],
  [
    25,
    "장난기 있는 측량사",
    "슬림",
    "빠른 말투와 소소한 허세",
    "윙크 대신 장난스런 미소, 렌즈 조절",
  ],
  [
    30,
    "냉미녀 암살자",
    "슬림 장신",
    "작은 목소리로 단정히 말함",
    "가늘어진 눈, 단검을 뒤로 감춤",
  ],
  [
    24,
    "도도한 도적",
    "슬림",
    "상대 반응을 시험하는 가벼운 놀림",
    "턱을 살짝 들고 열쇠를 회전",
  ],
  [
    35,
    "성숙한 협상가",
    "풍만한 성인 체형",
    "다정한 말투와 냉철한 판단",
    "절제된 미소, 약병을 들어 설명",
  ],
  [
    36,
    "과묵한 남성 호위",
    "건장한 장신",
    "필요한 말만 하고 약속을 지킴",
    "낮은 눈썹, 팔보호대를 정돈",
  ],
  [
    33,
    "온화한 성녀",
    "균형형",
    "따뜻하지만 신념은 분명함",
    "평온한 눈, 향로를 조심히 들어 올림",
  ],
  [
    27,
    "원칙적인 성창기사",
    "운동형",
    "서툰 칭찬에도 쉽게 얼굴이 붉어짐",
    "굳은 표정 뒤 작은 미소, 성창을 세움",
  ],
  [
    35,
    "성숙한 성당 수호자",
    "건장한 체형",
    "모두를 챙기는 리더",
    "침착한 눈, 방패 앞 열린 손",
  ],
  [
    25,
    "내향적인 수녀 기록관",
    "슬림",
    "대화는 서툴지만 기록 설명은 명확함",
    "눈을 잠시 피함, 책장을 잡은 손",
  ],
  [
    30,
    "신비로운 관측자",
    "슬림 장신",
    "비유를 즐기되 핵심은 놓치지 않음",
    "차분한 눈, 고리를 정렬",
  ],
  [
    26,
    "사교 서투른 곡검술사",
    "운동형",
    "낮은 혼잣말 후 용기 내서 대답",
    "경계하는 눈, 손가락으로 스카프 정돈",
  ],
  [
    35,
    "음침한 기억 연구자",
    "균형형",
    "어두운 농담과 탐구심",
    "희미한 미소, 구슬에 시선 고정",
  ],
  [
    29,
    "무표정한 반달수호자",
    "운동형",
    "감정을 말보다 행동으로 표현",
    "작은 고개 끄덕임, 방패 안쪽 손",
  ],
  [
    32,
    "자신감 있는 숲 사냥꾼",
    "운동형 장신",
    "솔직하고 경쟁을 즐김",
    "밝고 단호한 눈, 화살을 고름",
  ],
  [
    28,
    "안경 약초사",
    "아담한 성인 체형",
    "약초 지식에는 수다스럽고 낯은 가림",
    "따뜻한 미소, 잎을 가리킴",
  ],
  [
    35,
    "늠름한 숲 수호자",
    "건장한 장신",
    "후배를 기다려주는 인내",
    "편안하고 굳센 눈, 나무 방패를 짚음",
  ],
  [
    21,
    "짓궂은 덩굴 정찰병",
    "슬림 성인 체형",
    "쾌활한 경쟁심과 선을 지키는 농담",
    "활기찬 미소, 채찍을 접어 듦",
  ],
  [
    34,
    "호방한 도끼 용병",
    "근육형",
    "큰 웃음과 책임감",
    "자신감 있는 미소, 도끼를 어깨에",
  ],
  [
    26,
    "소심한 야전 치료사",
    "균형형",
    "긴장하면 말끝이 흐려지지만 치료는 정확함",
    "걱정스러운 눈, 붕대를 내밈",
  ],
  [
    32,
    "든든한 철갑 언니",
    "건장한 체형",
    "동료 실수를 조용히 감싸줌",
    "신뢰감을 주는 눈, 방패끈을 조임",
  ],
  [
    23,
    "무심한 신호공학자",
    "슬림 성인 체형",
    "사회적 눈치보다 문제 해결에 집중",
    "졸린 듯 집중한 눈, 고글을 올림",
  ],
];
await fs.mkdir("docs/renewal/characters", { recursive: true });
const sheets = roster.map((c, i) => {
  const [age, archetype, silhouette, personality, expression] = concepts[i];
  return {
    id: c.id,
    name: c.name,
    faction: c.faction,
    styleVersion: "silent-bell-anime-v2",
    status: "design-target-not-generated",
    current: { gender: c.gender, age: c.age, design: c.design },
    target: {
      gender: c.id === "VR4" ? "여" : c.gender,
      apparentAge: age,
      archetype,
      silhouette,
      personality,
      expression,
      design:
        c.id === "VR4"
          ? "청록 견장 지휘복, 검은 긴 로우 포니테일, 수염 없는 성인 여성 얼굴, 지도 두루마리와 지휘검"
          : c.design,
    },
    fixedIdentity: {
      palette: c.palette,
      face:
        c.id === "VR4"
          ? "성인 여성의 긴 타원형 얼굴, 날카로운 눈, 곧은 코"
          : c.face,
      skin: c.skin,
      hairAndMarks:
        c.id === "VR4"
          ? "검은 로우 포니테일, 왼귀 황동 나침반 귀걸이"
          : c.signature,
      weaponHand: "오른손 주무기 / 왼손 보조 장비",
      costumeLayers: [
        "안쪽 셔츠 또는 보호복",
        "팩션 외투 또는 갑옷",
        "기존 무기와 대표 장신구",
      ],
    },
    gameplay: {
      currentRole: c.role,
      abilityIntent: c.cards,
      balancePolicy:
        "기존 game.ts 계산 유지, 새 직업명과 효과 수치는 별도 밸런스 작업",
    },
    references: {
      portrait: `public/assets/fhd/portraits/${c.id}.webp`,
      sd: `data/sd_asset_manifest.json#${c.id}`,
      turnaround: c.sheet,
    },
    production: {
      required: [
        "turnaround-front-side-back",
        "face-expression-sheet",
        "sd-idle",
        "sd-ready",
        "full-idle",
        "full-windup",
        "full-strike",
        "full-recover",
        "full-guard",
        "full-hit",
        "full-skill",
        "dialogue-neutral",
        "dialogue-explain",
        "dialogue-resolve",
      ],
      camera: "전신 정면 3/4, 발 기준 (0.5,0.94), 동일 초점거리",
      lighting: "좌측 위 부드러운 주광, 약한 차가운 림라이트",
      prompt: `Original adult ${c.id === "BK4" ? "male" : "female"} fantasy character, apparent age ${age}, ${archetype}, ${silhouette}, ${c.palette}; clean refined anime linework, controlled cel shading, readable silhouette, adult anatomy. Preserve the approved turnaround identity. No text, no UI, no border.`,
      blockedUntil: "v2 기준 시트 생성 및 정체성 검수",
    },
  };
});
await fs.writeFile(
  "data/character_design_v2.json",
  JSON.stringify(sheets, null, 2) + "\n",
);
for (const s of sheets)
  await fs.writeFile(
    `docs/renewal/characters/${s.id}.md`,
    `# ${s.id} ${s.name} — 디자인 시트 v2\n\n상태: 제작 목표. 런타임 원화 변경 완료 아님.\n\n## 데이터\n- 팩션: ${s.faction}\n- 현행: ${s.current.gender}, ${s.current.age}세, ${s.current.design}\n- 목표: ${s.target.gender}, 외형 ${s.target.apparentAge}세, ${s.target.archetype}\n- 체형: ${s.target.silhouette}\n- 성격/말투: ${s.target.personality}\n- 표정/손동작: ${s.target.expression}\n- 역할/능력 의도: ${s.gameplay.currentRole} / ${s.gameplay.abilityIntent}\n\n## 고정 외형\n- 얼굴: ${s.fixedIdentity.face}\n- 피부: ${s.fixedIdentity.skin}\n- 머리/표식: ${s.fixedIdentity.hairAndMarks}\n- 팔레트: ${s.fixedIdentity.palette}\n- 의상/장비: ${s.target.design}\n- 손: ${s.fixedIdentity.weaponHand}\n- 의상 층: ${s.fixedIdentity.costumeLayers.join(" → ")}\n\n## 참조와 제작\n- 정체성 참조: ${s.references.portrait}\n- 기존 시트 경로(존재/품질 확인 필요): ${s.references.turnaround}\n- 카메라: ${s.production.camera}\n- 광원: ${s.production.lighting}\n- 필수 자산: ${s.production.required.join(", ")}\n- 공통 기준: ../CHARACTER_STYLE_BIBLE.md\n- 외형 나이 변경 시 연령선·피부·골격을 새 기준 시트에서 함께 검수. 머리색은 나이와 독립적인 정체성 요소로 유지.\n\n## 고정 프롬프트\n${s.production.prompt}\n\n## 검수/버전 기록\n- 기준 시트: 미생성\n- 파생 포즈: 미생성\n- 실제 크기/alpha/hash: 생성 후 manifest 기록\n- 현행 자산은 신규 묶음 완성 전 유지\n`,
  );
console.log(
  `Wrote ${sheets.length} design sheets; target women ${sheets.filter((s) => s.target.gender === "여").length}`,
);
