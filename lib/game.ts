import characters from "../data/characters.json" with { type: "json" };
import monsters from "../data/monsters.json" with { type: "json" };
import balance from "../data/balance.json" with { type: "json" };
import cards from "../data/cards.json" with { type: "json" };
export { characters, monsters, balance };
export const factionCodes = ["AR", "VR", "BC", "BK", "WS", "DS", "GO", "EF"];
export const opposed = [
  ["AR", "VR"],
  ["BC", "BK"],
  ["WS", "DS"],
  ["GO", "EF"],
];
export const friendly = [
  ["AR", "WS"],
  ["VR", "EF"],
  ["BC", "GO"],
  ["BK", "DS"],
];
export const statusDefinitions = {
  poison: {
    name: "중독",
    icon: "☠",
    tone: "toxic",
    description: "턴 종료 시 중첩만큼 피해를 받고 1 감소",
  },
  bleed: {
    name: "출혈",
    icon: "◆",
    tone: "blood",
    description: "턴 종료 시 중첩만큼 피해를 받고 1 감소",
  },
  madness: {
    name: "광기",
    icon: "◉",
    tone: "mind",
    description: "턴 종료 시 스트레스가 증가",
  },
  theft: {
    name: "도벽",
    icon: "♢",
    tone: "gold",
    description: "턴 종료 시 미확보 은화를 잃음",
  },
  weakness: {
    name: "약화",
    icon: "↓",
    tone: "debuff",
    description: "주는 피해 25% 감소",
  },
  target: {
    name: "표적",
    icon: "⌖",
    tone: "danger",
    description: "받는 피해가 중첩만큼 증가",
  },
  critical: {
    name: "치명타",
    icon: "✦",
    tone: "gold",
    description: "다음 공격 피해 50% 증가",
  },
  vulnerable: {
    name: "취약",
    icon: "◇",
    tone: "danger",
    description: "받는 피해 25% 증가",
  },
  thorns: {
    name: "가시",
    icon: "✣",
    tone: "toxic",
    description: "공격한 대상에게 반사 피해",
  },
  fury: {
    name: "격노",
    icon: "▲",
    tone: "fire",
    description: "주는 피해가 중첩만큼 증가",
  },
  stun: {
    name: "기절",
    icon: "✧",
    tone: "shock",
    description: "다음 행동을 건너뜀",
  },
  anger: {
    name: "분노",
    icon: "♨",
    tone: "fire",
    description: "체력이 낮을수록 공격력 증가",
  },
  burn: {
    name: "화상",
    icon: "♨",
    tone: "fire",
    description: "턴 종료 피해, 중첩이 절반으로 감소",
  },
  frost: {
    name: "동상",
    icon: "❄",
    tone: "frost",
    description: "방어력과 회복량 감소",
  },
  shock: {
    name: "감전",
    icon: "ϟ",
    tone: "shock",
    description: "추가 피해를 받고 인접 대상에 전이",
  },
  plague: {
    name: "전염병",
    icon: "☣",
    tone: "toxic",
    description: "턴 종료 피해 후 다른 대상에게 전파",
  },
  counter: {
    name: "반격",
    icon: "↶",
    tone: "gold",
    description: "공격을 받으면 반격",
  },
  block: {
    name: "피해 차단",
    icon: "▣",
    tone: "guard",
    description: "중첩만큼 받는 피해 감소",
  },
  stealth: {
    name: "은신",
    icon: "◌",
    tone: "mind",
    description: "다음 단일 공격을 회피",
  },
  fear: {
    name: "공포",
    icon: "☾",
    tone: "mind",
    description: "턴 종료 시 스트레스와 약화 발생",
  },
} as const;
export type StatusId = keyof typeof statusDefinitions;
export type StatusMap = Partial<Record<StatusId, number>>;
export const cardTriggerDefinitions = {
  copy: {
    name: "복사",
    description: "같은 카드 한 장을 버린 카드 더미에 생성",
  },
  retain: { name: "보존", description: "턴 종료 때 버리지 않고 손에 유지" },
  exhaust: { name: "소멸", description: "사용 후 이번 전투에서 제외" },
  create: { name: "생성", description: "지정된 카드를 새로 생성" },
  discover: { name: "발견", description: "덱에서 카드를 즉시 한 장 뽑음" },
  unplayable: {
    name: "사용불가",
    description: "조건을 해제하기 전까지 사용할 수 없음",
  },
} as const;
export type CardTrigger = keyof typeof cardTriggerDefinitions;
export type ProfessionId =
  | "bulwark"
  | "sentinel"
  | "duelist"
  | "ranger"
  | "medic"
  | "chaplain"
  | "runesmith"
  | "tactician";
export const professionCatalog = {
  bulwark: {
    id: "bulwark",
    name: "방벽기사",
    combatRole: "주 방어 · 도발",
    family: "수호",
    preferredRanks: [1, 2],
    priority: 1,
    hp: 76,
    mana: 2,
    attack: 6,
    defense: 15,
    spell: 2,
    crit: 3,
    trait: "불굴의 성벽",
    traitDescription:
      "전열에서 받는 피해를 버티는 높은 체력과 방어력을 가집니다.",
    skill: "방패 반격",
    skillDescription: "아군에게 보호막 20, 반격 5, 가시 3을 부여합니다.",
    description:
      "가장 앞에서 공격을 받아내며 파티의 붕괴를 막는 중장 수호 직업입니다.",
  },
  sentinel: {
    id: "sentinel",
    name: "파수기사",
    combatRole: "보조 방어 · 감시",
    family: "수호",
    preferredRanks: [1, 2],
    priority: 1.25,
    hp: 70,
    mana: 3,
    attack: 8,
    defense: 12,
    spell: 3,
    crit: 5,
    trait: "경계 태세",
    traitDescription:
      "방어와 공격의 균형이 좋아 1·2열을 모두 안정적으로 지킵니다.",
    skill: "방패 반격",
    skillDescription: "아군에게 보호막 20, 반격 5, 가시 3을 부여합니다.",
    description:
      "적의 움직임을 감시하며 전열의 빈틈을 메우는 균형형 수호 직업입니다.",
  },
  duelist: {
    id: "duelist",
    name: "결투가",
    combatRole: "근접 피해 · 처형",
    family: "공격",
    preferredRanks: [1, 2],
    priority: 1.75,
    hp: 62,
    mana: 3,
    attack: 14,
    defense: 6,
    spell: 3,
    crit: 10,
    trait: "빈틈 추적",
    traitDescription:
      "높은 공격력과 치명타로 표식이 남은 적을 빠르게 마무리합니다.",
    skill: "관통 표식",
    skillDescription: "방어를 관통하는 피해 13과 표적 4, 중독 2를 적용합니다.",
    description:
      "전열에서 한 대상을 집중 공격하는 고위험 근접 공격 직업입니다.",
  },
  ranger: {
    id: "ranger",
    name: "추적사수",
    combatRole: "원거리 피해 · 표식",
    family: "공격",
    preferredRanks: [2, 3],
    priority: 2.25,
    hp: 58,
    mana: 4,
    attack: 12,
    defense: 5,
    spell: 5,
    crit: 12,
    trait: "원거리 조준",
    traitDescription: "2·3열에서 높은 치명타와 표식 연계 피해를 냅니다.",
    skill: "관통 표식",
    skillDescription: "방어를 관통하는 피해 13과 표적 4, 중독 2를 적용합니다.",
    description:
      "안전한 중열에서 표식을 새기고 약점을 노리는 원거리 공격 직업입니다.",
  },
  medic: {
    id: "medic",
    name: "전투의무관",
    combatRole: "회복 · 부상 완화",
    family: "지원",
    preferredRanks: [3, 4],
    priority: 3.25,
    hp: 60,
    mana: 6,
    attack: 4,
    defense: 7,
    spell: 13,
    crit: 4,
    trait: "응급 처치",
    traitDescription:
      "높은 주문력과 마나로 아군의 체력과 스트레스를 관리합니다.",
    skill: "응급 회복",
    skillDescription: "아군 체력을 16 회복하고 스트레스를 2 낮춥니다.",
    description: "후열에서 전투 지속력을 책임지는 치료 중심 지원 직업입니다.",
  },
  chaplain: {
    id: "chaplain",
    name: "성가사제",
    combatRole: "회복 · 강화",
    family: "지원",
    preferredRanks: [3, 4],
    priority: 3.5,
    hp: 56,
    mana: 7,
    attack: 3,
    defense: 6,
    spell: 15,
    crit: 3,
    trait: "고요한 성가",
    traitDescription:
      "가장 높은 주문력과 마나로 후열에서 회복을 오래 유지합니다.",
    skill: "응급 회복",
    skillDescription: "아군 체력을 16 회복하고 스트레스를 2 낮춥니다.",
    description: "마법과 의식으로 파티를 회복시키는 순수 후열 지원 직업입니다.",
  },
  runesmith: {
    id: "runesmith",
    name: "룬술사",
    combatRole: "약화 · 기절",
    family: "제어",
    preferredRanks: [3, 4],
    priority: 3,
    hp: 55,
    mana: 7,
    attack: 4,
    defense: 5,
    spell: 14,
    crit: 5,
    trait: "연쇄 공명",
    traitDescription:
      "높은 주문력으로 감전과 기절 효과를 강화하는 후열 제어 직업입니다.",
    skill: "룬 사슬",
    skillDescription: "피해 6과 기절 1, 감전 2를 적용해 적의 행동을 끊습니다.",
    description:
      "후열에서 룬을 연결해 적의 행동과 상태를 통제하는 주문 직업입니다.",
  },
  tactician: {
    id: "tactician",
    name: "사슬전술가",
    combatRole: "행동 제어 · 보조 피해",
    family: "제어",
    preferredRanks: [2, 3],
    priority: 2.75,
    hp: 61,
    mana: 5,
    attack: 7,
    defense: 7,
    spell: 10,
    crit: 7,
    trait: "전장 계산",
    traitDescription:
      "중열에서 공격과 제어를 번갈아 사용하기 좋은 균형형 능력치를 가집니다.",
    skill: "룬 사슬",
    skillDescription: "피해 6과 기절 1, 감전 2를 적용해 적의 행동을 끊습니다.",
    description:
      "중열에서 적의 의도를 읽고 행동 순서를 무너뜨리는 전술 직업입니다.",
  },
} as const satisfies Record<ProfessionId, Record<string, unknown>>;
const professionByRole = {
  수호: ["bulwark", "sentinel"],
  공격: ["duelist", "ranger"],
  지원: ["medic", "chaplain"],
  제어: ["runesmith", "tactician"],
} as const;
export function professionFor(id: string) {
  const character = characters.find((item) => item.id === id)!;
  const factionIndex = Math.max(0, factionCodes.indexOf(id.slice(0, 2)));
  const variants =
    professionByRole[character.role as keyof typeof professionByRole];
  return professionCatalog[variants[factionIndex % variants.length]];
}
export const equipmentCatalog = {
  weapon: [
    {
      id: "blade",
      name: "훈련용 무기",
      asset: "훈련용 무기",
      attack: 2,
      spell: 0,
      defense: 0,
      professions: ["bulwark", "sentinel", "duelist", "medic"],
    },
    {
      id: "spear",
      name: "절단 창날",
      asset: "절단 검날",
      attack: 4,
      spell: 0,
      defense: 0,
      professions: ["sentinel", "duelist", "ranger", "tactician"],
    },
    {
      id: "focus",
      name: "성좌 촉매",
      asset: "깨진 성좌석",
      attack: 0,
      spell: 4,
      defense: 0,
      professions: ["medic", "chaplain", "runesmith", "tactician"],
    },
    {
      id: "bastion-blade",
      name: "성문 파쇄검",
      asset: "성문 경첩",
      attack: 8,
      spell: 0,
      defense: 3,
      professions: ["bulwark", "sentinel"],
    },
    {
      id: "hunter-edge",
      name: "흑조 추적창",
      asset: "절단 검날",
      attack: 11,
      spell: 0,
      defense: 0,
      professions: ["duelist", "ranger"],
    },
    {
      id: "sacred-focus",
      name: "성가의 등불",
      asset: "성가 청동",
      attack: 1,
      spell: 10,
      defense: 2,
      professions: ["medic", "chaplain"],
    },
    {
      id: "rune-chain",
      name: "역문자 사슬",
      asset: "역문자 수정체",
      attack: 4,
      spell: 9,
      defense: 1,
      professions: ["runesmith", "tactician"],
    },
  ],
  armor: [
    {
      id: "coat",
      name: "탐사 코트",
      asset: "방수 서지",
      attack: 0,
      spell: 0,
      defense: 2,
      professions: ["sentinel", "duelist", "ranger", "medic", "tactician"],
    },
    {
      id: "plate",
      name: "심해 합금갑",
      asset: "심해 합금",
      attack: 0,
      spell: 0,
      defense: 5,
      professions: ["bulwark", "sentinel", "duelist"],
    },
    {
      id: "vestment",
      name: "흑광 예복",
      asset: "흑광 성직포",
      attack: 0,
      spell: 3,
      defense: 1,
      professions: ["medic", "chaplain", "runesmith", "tactician"],
    },
  ],
  trinket: [
    {
      id: "ward",
      name: "호신 부적",
      asset: "호신 부적",
      attack: 0,
      spell: 0,
      defense: 2,
      professions: [
        "bulwark",
        "sentinel",
        "ranger",
        "medic",
        "chaplain",
        "tactician",
      ],
    },
    {
      id: "ember",
      name: "불씨 깃털",
      asset: "불씨 깃털",
      attack: 2,
      spell: 2,
      defense: 0,
      professions: ["duelist", "ranger", "medic", "chaplain", "runesmith"],
    },
    {
      id: "thorn",
      name: "가시뿔 장식",
      asset: "가시뿔",
      attack: 1,
      spell: 0,
      defense: 1,
      professions: ["bulwark", "duelist", "ranger", "runesmith", "tactician"],
    },
  ],
} as const;
export const forgeRecipes = [
  {
    id: "bastion-blade",
    professions: ["bulwark", "sentinel"],
    gold: 55,
    materials: { "녹슨 철심": 1, "성문 경첩": 1 },
  },
  {
    id: "hunter-edge",
    professions: ["duelist", "ranger"],
    gold: 60,
    materials: { "절단 검날": 1, "철익막": 1 },
  },
  {
    id: "sacred-focus",
    professions: ["medic", "chaplain"],
    gold: 60,
    materials: { "성가 청동": 1, "발광 유리": 1 },
  },
  {
    id: "rune-chain",
    professions: ["runesmith", "tactician"],
    gold: 65,
    materials: { "역문자 수정체": 1, "룬 책등": 1 },
  },
] as const;
export const craftedWeaponIds = forgeRecipes.map((recipe) => recipe.id);
export type Loadout = {
  weapon: (typeof equipmentCatalog.weapon)[number]["id"];
  armor: (typeof equipmentCatalog.armor)[number]["id"];
  trinket: (typeof equipmentCatalog.trinket)[number]["id"];
};
const defaultLoadouts: Record<ProfessionId, Loadout> = {
  bulwark: { weapon: "blade", armor: "plate", trinket: "ward" },
  sentinel: { weapon: "spear", armor: "plate", trinket: "ward" },
  duelist: { weapon: "blade", armor: "coat", trinket: "ember" },
  ranger: { weapon: "spear", armor: "coat", trinket: "ward" },
  medic: { weapon: "focus", armor: "coat", trinket: "ward" },
  chaplain: { weapon: "focus", armor: "vestment", trinket: "ward" },
  runesmith: { weapon: "focus", armor: "vestment", trinket: "thorn" },
  tactician: { weapon: "spear", armor: "coat", trinket: "thorn" },
};
export function defaultLoadoutFor(id: string): Loadout {
  return { ...defaultLoadouts[professionFor(id).id] };
}
export function equipmentAllowed(
  id: string,
  slot: keyof Loadout,
  gearId: string,
) {
  const profession = professionFor(id);
  return equipmentCatalog[slot].some(
    (gear) =>
      gear.id === gearId &&
      (gear.professions as readonly ProfessionId[]).includes(profession.id),
  );
}
export function recommendedFormation(ids: string[]) {
  return ids
    .map((id, index) => ({ id, index, profession: professionFor(id) }))
    .sort(
      (a, b) =>
        a.profession.priority - b.profession.priority || a.index - b.index,
    )
    .map(({ id }) => id);
}
export type Hero = {
  id: string;
  hp: number;
  maxHp: number;
  shield: number;
  counter?: number;
  stress: number;
  xp: number;
  level: number;
  injury: boolean;
  equipment: "blade" | "ward";
  mana: number;
  maxMana: number;
  loadout: Loadout;
  statuses: StatusMap;
};
export type Card = {
  id: string;
  owner: string;
  kind: "strike" | "guard" | "skill" | "heavy";
};
export type Enemy = {
  id: string;
  hp: number;
  maxHp: number;
  shield: number;
  stun: number;
  mark: number;
  target: string;
  intent: string;
  tower: number;
  statuses: StatusMap;
};
export type Battle = {
  turn: number;
  energy: number;
  hand: Card[];
  deck: Card[];
  discard: Card[];
  enemies: Enemy[];
  lastActor: string | null;
  exhausted: Card[];
};
export type CombatFx = {
  nonce: number;
  kind:
    "hero-attack" | "hero-guard" | "hero-heal" | "enemy-attack" | "enemy-hit";
  actor: string;
  target: string;
  card?: string;
  amount: number;
};
export type Run = {
  seed: number;
  room: string;
  visited: string[];
  heroes: Hero[];
  battle: Battle | null;
  gold: number;
  materials: string[];
  reward: { gold: number; materials: string[] } | null;
  mode: "map" | "battle" | "event" | "merchant" | "reward" | "defeat";
  cleared: boolean;
  combatFx: CombatFx | null;
  route?: Record<string, RoomDefinition>;
  cardMods?: Record<
    string,
    { strikeBonus: number; removeStrike: boolean; transformStrike: boolean }
  >;
};
export type Game = {
  schema: 1;
  version: number;
  party: string[];
  roster: Hero[];
  gold: number;
  materials: Record<string, number>;
  craftedGear: string[];
  runs: number;
  reputation: Record<string, number>;
  facilities: {
    forge: number;
    training: number;
    infirmary: number;
    canteen: number;
  };
  achievements: string[];
  ending: string | null;
  endingUnlocked: boolean;
  endingHistory: string[];
  rebirths: number;
  legacy: string[];
  run: Run | null;
  log: string[];
  summary: string | null;
};
export type Action = {
  type: string;
  ids?: string[];
  id?: string;
  target?: string;
  choice?: string;
  item?: string;
  quantity?: number;
  price?: number;
};
export type CardPreview = {
  valid: boolean;
  summary: string;
  details: string[];
  target?: {
    hpBefore: number;
    hpAfter: number;
    maxHp: number;
    shieldBefore: number;
    shieldAfter: number;
  };
  retaliation?: {
    hpBefore: number;
    hpAfter: number;
    maxHp: number;
  };
};
export type RoomDefinition = {
  name: string;
  kind: string;
  next: string[];
  enemies?: string[];
  layer?: number;
};
export const rooms: Record<
  string,
  RoomDefinition
> = {
  entrance: { name: "무너진 성문", kind: "entry", next: ["gate"] },
  gate: {
    name: "황색 경계선",
    kind: "battle",
    enemies: ["M01", "M02"],
    next: ["camp", "runes"],
  },
  camp: { name: "버려진 야영지", kind: "rest", next: ["yard"] },
  runes: { name: "세 문양의 봉인", kind: "puzzle", next: ["yard"] },
  yard: {
    name: "화약의 안뜰",
    kind: "battle",
    enemies: ["M03", "M04", "M05"],
    next: ["elite", "supply"],
  },
  elite: {
    name: "팔문의 수문장",
    kind: "battle",
    enemies: ["M06", "M07"],
    next: ["boss"],
  },
  supply: { name: "왕국의 정찰대", kind: "faction", next: ["boss"] },
  boss: {
    name: "왕관 없는 성탑",
    kind: "battle",
    enemies: ["M08"],
    next: ["exit"],
  },
  exit: { name: "귀환의 봉화", kind: "exit", next: ["harbor-entry"] },
  "harbor-entry": {
    name: "심연의 옛 항구",
    kind: "battle",
    enemies: ["M09", "M10"],
    next: ["harbor-yard"],
  },
  "harbor-yard": {
    name: "침몰한 부두",
    kind: "battle",
    enemies: ["M11", "M12", "M13"],
    next: ["harbor-elite", "harbor-supply"],
  },
  "harbor-elite": {
    name: "검은 닻의 관문",
    kind: "battle",
    enemies: ["M14", "M15"],
    next: ["harbor-boss"],
  },
  "harbor-supply": { name: "항구의 잔불", kind: "rest", next: ["harbor-boss"] },
  "harbor-boss": {
    name: "흑조의 부두",
    kind: "battle",
    enemies: ["M16"],
    next: ["archive-entry"],
  },
  "archive-entry": {
    name: "침수된 지하 서고",
    kind: "battle",
    enemies: ["M17", "M18"],
    next: ["archive-yard"],
  },
  "archive-yard": {
    name: "잠긴 열람실",
    kind: "battle",
    enemies: ["M19", "M20", "M21"],
    next: ["archive-elite", "archive-supply"],
  },
  "archive-elite": {
    name: "역문자의 문",
    kind: "battle",
    enemies: ["M22", "M23"],
    next: ["archive-boss"],
  },
  "archive-supply": {
    name: "사서의 휴식처",
    kind: "rest",
    next: ["archive-boss"],
  },
  "archive-boss": {
    name: "가라앉은 문헌고",
    kind: "battle",
    enemies: ["M24"],
    next: ["chapel-entry"],
  },
  "chapel-entry": {
    name: "백야의 지하 예배당",
    kind: "battle",
    enemies: ["M25", "M26"],
    next: ["chapel-yard"],
  },
  "chapel-yard": {
    name: "촛불 없는 회랑",
    kind: "battle",
    enemies: ["M27", "M28", "M29"],
    next: ["chapel-elite", "chapel-supply"],
  },
  "chapel-elite": {
    name: "거꾸로 선 제단",
    kind: "battle",
    enemies: ["M30", "M31"],
    next: ["chapel-boss"],
  },
  "chapel-supply": { name: "고해의 방", kind: "rest", next: ["chapel-boss"] },
  "chapel-boss": {
    name: "백야의 성가대",
    kind: "battle",
    enemies: ["M32"],
    next: ["root-entry"],
  },
  "root-entry": {
    name: "뿌리 성소",
    kind: "battle",
    enemies: ["M33", "M34"],
    next: ["root-yard"],
  },
  "root-yard": {
    name: "수액의 정원",
    kind: "battle",
    enemies: ["M35", "M36", "M37"],
    next: ["root-elite", "root-supply"],
  },
  "root-elite": {
    name: "뒤틀린 문지기",
    kind: "battle",
    enemies: ["M38", "M39"],
    next: ["root-boss"],
  },
  "root-supply": { name: "씨앗의 둥지", kind: "rest", next: ["root-boss"] },
  "root-boss": {
    name: "성소의 심장",
    kind: "battle",
    enemies: ["M40"],
    next: ["village-entry"],
  },
  "village-entry": {
    name: "재가 된 옛 마을",
    kind: "battle",
    enemies: ["M41", "M42"],
    next: ["village-yard"],
  },
  "village-yard": {
    name: "그을린 시장",
    kind: "battle",
    enemies: ["M43", "M44", "M45"],
    next: ["village-elite", "village-supply"],
  },
  "village-elite": {
    name: "재의 종지기",
    kind: "battle",
    enemies: ["M46", "M47"],
    next: ["village-boss"],
  },
  "village-supply": { name: "꺼진 화덕", kind: "rest", next: ["village-boss"] },
  "village-boss": {
    name: "재의 왕좌",
    kind: "battle",
    enemies: ["M48"],
    next: ["tower-entry"],
  },
  "tower-entry": {
    name: "침묵의 종탑",
    kind: "battle",
    enemies: ["M49", "M50"],
    next: ["tower-yard"],
  },
  "tower-yard": {
    name: "무음의 계단",
    kind: "battle",
    enemies: ["M51", "M52", "M53"],
    next: ["tower-elite", "tower-supply"],
  },
  "tower-elite": {
    name: "종 아래의 파수꾼",
    kind: "battle",
    enemies: ["M54", "M55"],
    next: ["tower-boss"],
  },
  "tower-supply": { name: "멈춘 추", kind: "rest", next: ["tower-boss"] },
  "tower-boss": {
    name: "침묵의 종",
    kind: "battle",
    enemies: ["M56"],
    next: ["final-exit"],
  },
  "final-exit": { name: "마지막 귀환의 봉화", kind: "exit", next: [] },
};
const expeditionRegionNames = [
  "변경 요새",
  "심연 항구",
  "침수 서고",
  "백야 예배당",
  "폐쇄 연구동",
  "설원 관측소",
  "침묵 궁전",
];
export function createExpeditionRoute(
  seed: number,
  regionIndex = 0,
): Record<string, RoomDefinition> {
  const region = Math.abs(regionIndex) % expeditionRegionNames.length;
  const firstMonster = region * 8 + 1;
  const monster = (offset: number) =>
    `M${String(firstMonster + Math.min(7, offset)).padStart(2, "0")}`;
  const link = (layer: number) => [
    `l${layer}-battle`,
    `l${layer}-${layer % 2 ? "question" : "merchant"}`,
    `l${layer}-rest`,
  ];
  const route: Record<string, RoomDefinition> = {
    entrance: {
      name: `${expeditionRegionNames[region]} 입구`,
      kind: "entry",
      next: link(1),
      layer: 0,
    },
  };
  for (let layer = 1; layer <= 4; layer++) {
    const next = layer === 4 ? ["boss"] : link(layer + 1);
    route[`l${layer}-battle`] = {
      name: `${layer}계층 전투 구역`,
      kind: "battle",
      next,
      enemies: [monster((layer - 1) * 2), monster((layer - 1) * 2 + 1)],
      layer,
    };
    route[`l${layer}-${layer % 2 ? "question" : "merchant"}`] = {
      name: layer % 2 ? `${layer}계층 미지의 징후` : `${layer}계층 암상인`,
      kind: layer % 2 ? "question" : "merchant",
      next,
      layer,
    };
    route[`l${layer}-rest`] = {
      name: `${layer}계층 귀환 야영지`,
      kind: "rest",
      next,
      layer,
    };
  }
  route.boss = {
    name: `${expeditionRegionNames[region]}의 지배자`,
    kind: "boss",
    next: ["victory-rest"],
    enemies: [monster(7)],
    layer: 5,
  };
  route["victory-rest"] = {
    name: "승전 귀환 야영지",
    kind: "rest",
    next: [],
    layer: 6,
  };
  return route;
}
export function roomFor(run: Pick<Run, "room" | "route">, id = run.room) {
  return run.route?.[id] || rooms[id];
}
export class RuleError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
function check(ok: unknown, msg: string): asserts ok {
  if (!ok) throw new RuleError(msg);
}
export function hero(id: string): Hero {
  const profession = professionFor(id);
  return {
    id,
    hp: profession.hp,
    maxHp: profession.hp,
    shield: 0,
    stress: 0,
    xp: 0,
    level: 1,
    injury: false,
    equipment: "blade",
    mana: profession.mana,
    maxMana: profession.mana,
    loadout: defaultLoadoutFor(id),
    statuses: {},
  };
}
function normalizeHero(saved: Hero): Hero {
  const defaults = hero(saved.id);
  const mergedLoadout = { ...defaults.loadout, ...(saved.loadout || {}) };
  const loadout = (Object.keys(defaults.loadout) as (keyof Loadout)[]).reduce(
    (result, slot) => {
      result[slot] = equipmentAllowed(saved.id, slot, mergedLoadout[slot])
        ? (mergedLoadout[slot] as never)
        : (defaults.loadout[slot] as never);
      return result;
    },
    { ...defaults.loadout },
  );
  const level = saved.level ?? defaults.level;
  const maxHp = professionFor(saved.id).hp + Math.max(0, level - 1) * 4;
  const maxMana = professionFor(saved.id).mana + Math.floor(level / 3);
  const hpRatio = saved.maxHp > 0 ? saved.hp / saved.maxHp : 1;
  return {
    ...defaults,
    ...saved,
    hp: Math.max(0, Math.min(maxHp, Math.round(hpRatio * maxHp))),
    maxHp,
    mana: Math.min(saved.mana ?? maxMana, maxMana),
    maxMana,
    loadout,
    statuses: { ...(saved.statuses || {}) },
  };
}
export function heroStats(h: Hero) {
  const profession = professionFor(h.id);
  const weapon =
    equipmentCatalog.weapon.find((item) => item.id === h.loadout.weapon) ||
    equipmentCatalog.weapon[0];
  const armor =
    equipmentCatalog.armor.find((item) => item.id === h.loadout.armor) ||
    equipmentCatalog.armor[0];
  const trinket =
    equipmentCatalog.trinket.find((item) => item.id === h.loadout.trinket) ||
    equipmentCatalog.trinket[0];
  return {
    maxHp: profession.hp + Math.max(0, h.level - 1) * 4,
    maxMana: profession.mana + Math.floor(h.level / 3),
    attack:
      profession.attack +
      weapon.attack +
      armor.attack +
      trinket.attack +
      h.level,
    defense:
      profession.defense +
      weapon.defense +
      armor.defense +
      trinket.defense +
      Math.floor(h.level / 2),
    spell:
      profession.spell + weapon.spell + armor.spell + trinket.spell + h.level,
    crit: profession.crit + (h.loadout.weapon === "spear" ? 6 : 0),
    trait: profession.trait,
    traitDescription: profession.traitDescription,
    skill: profession.skill,
    skillDescription: profession.skillDescription,
    profession: profession.name,
    combatRole: profession.combatRole,
    preferredRanks: profession.preferredRanks,
  };
}
export function initialGame(): Game {
  return {
    schema: 1,
    version: 0,
    party: ["AR1", "AR2", "AR3", "AR4"],
    roster: ["AR1", "AR2", "AR3", "AR4"].map(hero),
    gold: balance.startingGold,
    materials: {},
    craftedGear: [],
    runs: 0,
    reputation: Object.fromEntries(factionCodes.map((f) => [f, 0])),
    facilities: { forge: 0, training: 0, infirmary: 0, canteen: 0 },
    achievements: [],
    ending: null,
    endingUnlocked: false,
    endingHistory: [],
    rebirths: 0,
    legacy: [],
    run: null,
    log: ["실종된 탐사대의 마지막 기록은 변경 요새에서 끊겼다."],
    summary: null,
  };
}
export function normalizeGame(previous: Game): Game {
  const defaults = initialGame();
  const saved = structuredClone(previous);
  return {
    ...defaults,
    ...saved,
    party: saved.party || defaults.party,
    roster: (saved.roster || defaults.roster).map(normalizeHero),
    materials: saved.materials || {},
    craftedGear: saved.craftedGear || [],
    reputation: { ...defaults.reputation, ...(saved.reputation || {}) },
    facilities: { ...defaults.facilities, ...(saved.facilities || {}) },
    achievements: saved.achievements || [],
    ending: saved.ending ?? null,
    endingUnlocked: saved.endingUnlocked ?? false,
    endingHistory: saved.endingHistory || [],
    rebirths: saved.rebirths || 0,
    legacy: saved.legacy || [],
    log: saved.log || defaults.log,
    run: saved.run
      ? {
          ...saved.run,
          route: saved.run.route || rooms,
          cardMods: saved.run.cardMods || {},
          heroes: saved.run.heroes.map(normalizeHero),
          battle: saved.run.battle
            ? {
                ...saved.run.battle,
                exhausted: saved.run.battle.exhausted || [],
                enemies: saved.run.battle.enemies.map((enemy) => ({
                  ...enemy,
                  statuses: { ...(enemy.statuses || {}) },
                })),
              }
            : null,
          combatFx: saved.run.combatFx ?? null,
        }
      : null,
  };
}
export function relations(ids: string[]) {
  const fs = new Set(ids.map((id) => id.slice(0, 2)));
  const count = Math.max(
    0,
    ...[...fs].map((f) => ids.filter((id) => id.startsWith(f)).length),
  );
  return {
    shield: Math.min(
      balance.friendlyCap,
      friendly.filter((p) => p.every((f) => fs.has(f))).length *
        balance.friendlyShield,
    ),
    stress: Math.min(
      balance.stressCap,
      opposed.filter((p) => p.every((f) => fs.has(f))).length *
        balance.opposedStress,
    ),
    defense: balance.sameFactionDefense[count],
  };
}
function random(r: Run) {
  let x = r.seed;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  r.seed = x >>> 0;
  return r.seed / 4294967296;
}
function shuffle<T>(r: Run, items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random(r) * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
export function cardInfo(c: Card) {
  const role = characters.find((x) => x.id === c.owner)!.role;
  const info =
    cards[(c.kind === "skill" ? role : c.kind) as keyof typeof cards];
  return { ...info, role, triggers: info.triggers as CardTrigger[] };
}
function draw(r: Run) {
  const b = r.battle!;
  while (b.hand.length < balance.hand && b.hand.length < balance.handLimit) {
    if (!b.deck.length) {
      if (!b.discard.length) break;
      b.deck = shuffle(r, b.discard);
      b.discard = [];
    }
    const c = b.deck.shift()!;
    if (r.heroes.some((h) => h.id === c.owner && h.hp > 0)) b.hand.push(c);
  }
}
function intent(r: Run) {
  const b = r.battle!;
  const alive = r.heroes.filter((h) => h.hp > 0);
  for (const e of b.enemies) {
    e.target =
      (e.id === "M02"
        ? alive.at(-1)
        : e.id === "M05"
          ? alive.find((h) => h.id === b.lastActor)
          : null
      )?.id ||
      alive[0]?.id ||
      "";
    e.intent = e.stun
      ? "행동 중단"
      : e.id === "M01"
        ? "방어벽 +10"
        : e.id === "M02"
          ? "후열 관통 6"
          : e.id === "M03"
            ? b.turn % 3 === 0
              ? "전체 폭발 12"
              : `폭발까지 ${3 - (b.turn % 3)}턴`
            : e.id === "M04"
              ? "아군 공격 강화 +3"
              : e.id === "M05"
                ? "마지막 공격자 추적 6"
                : e.id === "M06"
                  ? b.turn % 2
                    ? "반격 태세 6"
                    : "문짝 포격 12"
                  : e.id === "M07"
                    ? "연속 행동에 반격 5"
                    : b.turn % 2
                      ? "성탑 방어 +16"
                      : "왕검 전체 공격 " + (e.tower > 0 ? "18" : "9");
  }
}
function enterBattle(r: Run, ids: string[]) {
  const modifier = relations(r.heroes.map((h) => h.id));
  r.heroes.forEach((h) => {
    h.shield = modifier.shield;
    h.counter = 0;
    h.mana = heroStats(h).maxMana;
  });
  const deck = r.heroes
    .filter((h) => h.hp > 0)
    .flatMap((h) =>
      (["strike", "guard", "skill", "heavy"] as const)
        .filter(
          (kind) => !(kind === "strike" && r.cardMods?.[h.id]?.removeStrike),
        )
        .map((kind) => ({
          id: `${h.id}-${kind}`,
          owner: h.id,
          kind:
            kind === "strike" && r.cardMods?.[h.id]?.transformStrike
              ? ("heavy" as const)
              : kind,
        })),
    );
  r.battle = {
    turn: 1,
    energy: balance.energy,
    hand: [],
    deck: shuffle(r, deck),
    discard: [],
    exhausted: [],
    lastActor: null,
    enemies: ids.map((id) => {
      const m = monsters.find((x) => x.id === id)!;
      return {
        id,
        hp: balance.enemyHP[m.rank as keyof typeof balance.enemyHP],
        maxHp: balance.enemyHP[m.rank as keyof typeof balance.enemyHP],
        shield: 0,
        stun: 0,
        mark: 0,
        target: "",
        intent: "",
        tower: id === "M08" ? 30 : 0,
        statuses: {},
      };
    }),
  };
  r.mode = "battle";
  draw(r);
  intent(r);
}
function log(g: Game, s: string) {
  g.log = [...g.log, s].slice(-24);
}
function achievement(g: Game, id: string, message: string) {
  if (g.achievements.includes(id)) return;
  g.achievements.push(id);
  log(g, `업적 달성: ${message}`);
}
function xp(r: Run, n: number) {
  r.heroes
    .filter((h) => h.hp > 0)
    .forEach((h) => {
      h.xp += n;
      h.level = 1 + Math.floor(h.xp / 50);
    });
}
function addStatus(
  target: { statuses: StatusMap },
  id: StatusId,
  amount: number,
) {
  target.statuses[id] = Math.max(0, (target.statuses[id] || 0) + amount);
}
function reduceStatus(
  target: { statuses: StatusMap },
  id: StatusId,
  amount = 1,
) {
  target.statuses[id] = Math.max(0, (target.statuses[id] || 0) - amount);
}
function hurt(h: Hero, n: number, defense: number) {
  const blocked = h.statuses.block || 0;
  const dmg = Math.max(0, Math.ceil(n * (1 - defense)) - blocked);
  if (blocked) reduceStatus(h, "block", Math.min(blocked, Math.ceil(n)));
  const absorb = Math.min(h.shield, dmg);
  h.shield -= absorb;
  h.hp = Math.max(0, h.hp - (dmg - absorb));
  return dmg - absorb;
}
function victory(g: Game) {
  const r = g.run!,
    b = r.battle!;
  if (!r.heroes.some((h) => h.hp > 0)) {
    r.mode = "defeat";
    r.reward = null;
    r.gold = 0;
    r.materials = [];
    log(g, "탐사대가 쓰러졌다. 미확보 전리품을 잃었다.");
    return;
  }
  if (b.enemies.every((e) => e.hp <= 0)) {
    r.reward = {
      gold:
        b.enemies.length * 18 +
        (roomFor(r).kind === "boss" || r.room.endsWith("-boss") ? 60 : 0),
      materials: b.enemies.map(
        (e) => monsters.find((m) => m.id === e.id)!.loot,
      ),
    };
    r.mode = "reward";
    xp(r, balance.battleXP);
    r.heroes.forEach((h) => (h.stress += relations(g.party).stress));
    if (roomFor(r).kind === "boss" || r.room.endsWith("-boss")) r.cleared = true;
    log(g, "전투 승리. 전리품을 챙기면 다음 경로가 열린다.");
  }
}
export function reduceGame(previous: Game, a: Action, seed = 1): Game {
  const g = normalizeGame(previous),
    r = g.run;
  if (a.type === "party") {
    check(!r, "탐사 중에는 편성을 바꿀 수 없습니다.");
    check(
      Array.isArray(a.ids) &&
        a.ids.length >= 1 &&
        a.ids.length <= 4 &&
        new Set(a.ids).size === a.ids.length,
      "파티는 서로 다른 1~4명입니다.",
    );
    check(
      a.ids.every((id) => g.roster.some((h) => h.id === id)),
      "영입하지 않은 인물입니다.",
    );
    g.party = a.ids;
    log(g, "파티 편성을 저장했다.");
  } else if (a.type === "recruit") {
    check(!r, "거점에서 영입하세요.");
    check(
      characters.some((h) => h.id === a.id),
      "존재하지 않는 인물입니다.",
    );
    check(!g.roster.some((h) => h.id === a.id), "이미 영입했습니다.");
    check(g.gold >= balance.recruitCost, "은화가 부족합니다.");
    g.gold -= balance.recruitCost;
    g.roster.push(hero(a.id!));
    log(g, `${characters.find((h) => h.id === a.id)!.name} 영입 완료.`);
  } else if (a.type === "equip") {
    check(!r, "거점에서 장비를 변경하세요.");
    const h = g.roster.find((h) => h.id === a.id);
    check(h, "소유하지 않은 캐릭터입니다.");
    const slot = (a.item ||
      (a.choice === "ward" ? "trinket" : "weapon")) as keyof Loadout;
    check(
      ["weapon", "armor", "trinket"].includes(slot),
      "알 수 없는 장비 슬롯입니다.",
    );
    const option = equipmentCatalog[slot].find((item) => item.id === a.choice);
    check(option, "알 수 없는 장비입니다.");
    check(
      equipmentAllowed(h.id, slot, option.id),
      `${professionFor(h.id).name}이(가) 착용할 수 없는 장비입니다.`,
    );
    check(
      !craftedWeaponIds.includes(option.id as (typeof craftedWeaponIds)[number]) ||
        g.craftedGear.includes(option.id),
      "대장간에서 먼저 제작해야 합니다.",
    );
    h.loadout[slot] = option.id as never;
    h.equipment =
      h.loadout.weapon === "blade"
        ? "blade"
        : h.loadout.trinket === "ward"
          ? "ward"
          : "blade";
    log(
      g,
      `${characters.find((item) => item.id === h.id)!.name}이(가) ${option.name}을(를) 장착했다.`,
    );
  } else if (a.type === "craft") {
    check(!r, "거점에서 제작하세요.");
    const recipe = forgeRecipes.find((item) => item.id === a.id);
    check(recipe, "알 수 없는 제작 도면입니다.");
    check(!g.craftedGear.includes(recipe.id), "이미 제작한 무기입니다.");
    const cost = Math.max(20, recipe.gold - g.facilities.forge * 10);
    check(g.gold >= cost, "은화가 부족합니다.");
    for (const [material, amount] of Object.entries(recipe.materials))
      check((g.materials[material] || 0) >= amount, `${material}이(가) 부족합니다.`);
    g.gold -= cost;
    for (const [material, amount] of Object.entries(recipe.materials)) {
      g.materials[material] -= amount;
      if (g.materials[material] <= 0) delete g.materials[material];
    }
    g.craftedGear.push(recipe.id);
    const weapon = equipmentCatalog.weapon.find((item) => item.id === recipe.id)!;
    log(g, `${weapon.name} 제작 완료. 해당 직업이 장착할 수 있습니다.`);
  } else if (a.type === "upgradeFacility") {
    check(!r, "탐사 중에는 시설을 업그레이드할 수 없습니다.");
    const id = a.id as keyof Game["facilities"];
    check(
      ["forge", "training", "infirmary", "canteen"].includes(id),
      "알 수 없는 시설입니다.",
    );
    const level = g.facilities[id];
    check(level < 3, "시설이 이미 최고 단계입니다.");
    const cost = balance.facilityUpgradeCost * (level + 1);
    check(g.gold >= cost, "은화가 부족합니다.");
    g.gold -= cost;
    g.facilities[id]++;
    log(g, `${id} 시설을 ${level + 1}단계로 올렸다.`);
  } else if (a.type === "train") {
    check(!r, "탐사 중에는 훈련할 수 없습니다.");
    const h = g.roster.find((hero) => hero.id === a.id);
    check(h, "소유하지 않은 캐릭터입니다.");
    const cost = balance.trainingCost + g.facilities.training * 4;
    check(g.gold >= cost, "은화가 부족합니다.");
    g.gold -= cost;
    h.xp += balance.trainingXP + g.facilities.training * 2;
    h.level = 1 + Math.floor(h.xp / 50);
    achievement(g, "first-training", "첫 훈련");
    if (h.level >= 3) achievement(g, "veteran", "베테랑 동료");
    log(
      g,
      `${characters.find((character) => character.id === h.id)!.name}이 훈련으로 경험치를 얻었다.`,
    );
  } else if (a.type === "heal") {
    check(!r, "탐사 중에는 치료할 수 없습니다.");
    const h = g.roster.find((hero) => hero.id === a.id);
    check(h, "소유하지 않은 캐릭터입니다.");
    check(h.injury, "치료할 부상이 없습니다.");
    const cost = Math.max(1, balance.healingCost - g.facilities.infirmary * 2);
    check(g.gold >= cost, "은화가 부족합니다.");
    g.gold -= cost;
    h.injury = false;
    achievement(g, "first-treatment", "첫 치료");
    log(
      g,
      `${characters.find((character) => character.id === h.id)!.name}의 부상을 치료했다.`,
    );
  } else if (a.type === "factionShop") {
    check(!r, "탐사 중에는 팩션 상점을 이용할 수 없습니다.");
    const faction = a.choice;
    check(
      typeof faction === "string" && factionCodes.includes(faction),
      "알 수 없는 팩션입니다.",
    );
    check(g.reputation[faction] >= 10, "팩션 우호도가 부족합니다.");
    check(g.gold >= 25, "은화가 부족합니다.");
    g.reputation[faction] -= 10;
    g.gold -= 25;
    const item = `${faction} 팩션 보급품`;
    g.materials[item] = (g.materials[item] || 0) + 1;
    log(g, `${faction} 팩션 상점에서 보급품을 구매했다.`);
  } else if (a.type === "darkMarket") {
    check(!r, "탐사 중에는 암시장을 이용할 수 없습니다.");
    check(a.choice === "token", "알 수 없는 암시장 계약입니다.");
    check(
      (g.materials["빈 왕관 파편"] || 0) > 0,
      "교환할 희생 재료가 없습니다.",
    );
    check(g.gold >= 30, "은화가 부족합니다.");
    g.materials["빈 왕관 파편"]--;
    g.materials["암시장 증표"] = (g.materials["암시장 증표"] || 0) + 1;
    g.gold -= 30;
    log(
      g,
      "선택형 암시장 계약을 체결했다. 희생 재료 1개와 은화 30을 지불했다.",
    );
  } else if (a.type === "chooseEnding") {
    check(!r, "탐사 중에는 엔딩을 선택할 수 없습니다.");
    check(
      g.endingUnlocked && g.ending === null,
      "최종 탐사를 완료해야 엔딩을 선택할 수 있습니다.",
    );
    check(
      ["kingdom", "republic", "union", "liberation"].includes(a.choice || ""),
      "알 수 없는 엔딩입니다.",
    );
    g.ending = a.choice!;
    g.endingHistory.push(g.ending);
    achievement(g, `ending-${g.ending}`, `${g.ending} 엔딩`);
    log(g, `${g.ending}의 결말을 기록했다.`);
  } else if (a.type === "rebirth") {
    check(!r && g.ending !== null, "엔딩 이후에만 환생할 수 있습니다.");
    const inheritance = a.ids || [];
    check(
      inheritance.length <= balance.inheritanceLimit,
      "계승 슬롯은 최대 3개입니다.",
    );
    check(
      inheritance.every((item) => g.materials[item] > 0),
      "보유한 재료만 계승할 수 있습니다.",
    );
    g.gold = balance.startingGold;
    g.legacy = [...inheritance];
    g.materials = Object.fromEntries(g.legacy.map((item) => [item, 1]));
    g.reputation = Object.fromEntries(factionCodes.map((f) => [f, 0]));
    g.facilities = { forge: 0, training: 0, infirmary: 0, canteen: 0 };
    g.party = ["AR1", "AR2", "AR3", "AR4"];
    g.roster = g.party.map(hero);
    g.run = null;
    g.ending = null;
    g.endingUnlocked = false;
    g.rebirths++;
    log(g, "새 순환을 시작했다. 선택한 계승품만 남았다.");
  } else if (a.type === "enter") {
    check(!r, "이미 진행 중인 탐사가 있습니다.");
    g.summary = null;
    g.run = {
      seed: seed >>> 0 || 1,
      room: "entrance",
      route: createExpeditionRoute(seed >>> 0 || 1, g.runs),
      cardMods: {},
      visited: ["entrance"],
      heroes: g.party.map((id) => {
        const saved = g.roster.find((h) => h.id === id)!;
        const stats = heroStats(saved);
        return {
          ...saved,
          hp: stats.maxHp,
          maxHp: stats.maxHp,
          mana: stats.maxMana,
          maxMana: stats.maxMana,
          shield: 0,
        };
      }),
      battle: null,
      gold: 0,
      materials: [],
      reward: null,
      mode: "map",
      cleared: false,
      combatFx: null,
    };
    log(g, "변경 요새에 진입했다.");
  } else {
    check(r, "진행 중인 탐사가 없습니다.");
    if (a.type === "move") {
      check(r.mode === "map", "현재 방의 행동을 먼저 완료하세요.");
      check(roomFor(r).next.includes(a.id || ""), "연결되지 않은 방입니다.");
      check(!r.visited.includes(a.id!), "이미 완료한 방입니다.");
      r.room = a.id!;
      r.visited.push(r.room);
      const room = roomFor(r);
      if (room.enemies) enterBattle(r, room.enemies);
      else if (["rest", "puzzle", "faction", "question"].includes(room.kind))
        r.mode = "event";
      else if (room.kind === "merchant") r.mode = "merchant";
      log(g, `${room.name}에 도착했다.`);
    } else if (a.type === "event") {
      check(r.mode === "event", "선택할 사건이 없습니다.");
      const kind = roomFor(r).kind;
      if (kind === "rest") {
        check(a.choice === "rest", "휴식 선택이 필요합니다.");
        r.heroes
          .filter((h) => h.hp > 0)
          .forEach((h) => {
            h.hp = Math.min(h.maxHp, h.hp + 24);
            h.stress = Math.max(0, h.stress - 4);
          });
        log(g, "야영지에서 체력 24와 안정을 되찾았다.");
      } else if (kind === "puzzle") {
        check(
          ["bell", "star", "crown"].includes(a.choice || ""),
          "문양을 선택하세요.",
        );
        if (a.choice !== "bell") {
          log(g, "봉인은 움직이지 않는다. 단서: 소리 없이 시간을 알리는 종.");
          g.version++;
          return g;
        }
        xp(r, balance.puzzleXP);
        r.gold += 25;
        log(g, "종 문양이 봉인을 풀었다. 은화 25와 경험치 8 획득.");
      } else if (kind === "question") {
        check(["investigate", "avoid"].includes(a.choice || ""), "행동을 선택하세요.");
        if (a.choice === "avoid") {
          r.heroes.forEach((h) => (h.stress = Math.max(0, h.stress - 2)));
          log(g, "불길한 징후를 피해 안전하게 통과했다. 스트레스 -2.");
        } else if ((r.seed + r.visited.length) % 2 === 0) {
          const rare = "월광 합금";
          r.gold += 35;
          r.materials.push(rare);
          log(g, `숨은 보관함을 찾았다. 은화 35와 ${rare} 획득.`);
        } else {
          r.heroes.filter((h) => h.hp > 0).forEach((h) => {
            h.hp = Math.max(1, h.hp - 10);
            h.stress += 3;
          });
          log(g, "함정이 작동했다. 생존 동료 체력 -10, 스트레스 +3.");
        }
      } else {
        check(
          ["accept", "leave"].includes(a.choice || ""),
          "제안을 선택하세요.",
        );
        if (a.choice === "accept") {
          g.reputation.AR = Math.min(100, g.reputation.AR + 5);
          r.heroes
            .filter((h) => h.hp > 0)
            .forEach((h) => (h.hp = Math.min(h.maxHp, h.hp + 15)));
          log(g, "왕국 정찰대의 보급을 받았다. 우호도 +5, 체력 +15.");
        }
      }
      r.mode = "map";
    } else if (a.type === "merchant") {
      check(r.mode === "merchant" && roomFor(r).kind === "merchant", "상인이 없습니다.");
      const target = r.heroes.find((h) => h.id === a.id);
      if (a.choice === "leave") {
        r.mode = "map";
        log(g, "암상인과 거래를 마쳤다.");
      } else if (a.choice === "heal") {
        check(target && target.hp > 0, "회복할 동료를 선택하세요.");
        check(r.gold >= 20, "배낭 은화가 부족합니다.");
        r.gold -= 20;
        target.hp = Math.min(target.maxHp, target.hp + 28);
        log(g, `${characters.find((c) => c.id === target.id)!.name} 체력 +28.`);
      } else if (a.choice === "rare") {
        check(r.gold >= 45, "배낭 은화가 부족합니다.");
        r.gold -= 45;
        r.materials.push("월광 합금");
        log(g, "암상인에게서 희귀 재료 월광 합금을 샀다.");
      } else {
        check(target, "카드를 조정할 동료를 선택하세요.");
        const mods = (r.cardMods![target.id] ||= {
          strikeBonus: 0,
          removeStrike: false,
          transformStrike: false,
        });
        const cost = a.choice === "upgrade" ? 30 : a.choice === "remove" ? 40 : 35;
        check(["upgrade", "remove", "transform"].includes(a.choice || ""), "알 수 없는 카드 작업입니다.");
        check(r.gold >= cost, "배낭 은화가 부족합니다.");
        if (a.choice === "upgrade") mods.strikeBonus += 4;
        if (a.choice === "remove") mods.removeStrike = true;
        if (a.choice === "transform") mods.transformStrike = true;
        r.gold -= cost;
        log(g, `${characters.find((c) => c.id === target.id)!.name}의 기본 공격 카드를 조정했다.`);
      }
    } else if (a.type === "play") {
      check(r.mode === "battle" && r.battle, "전투 중이 아닙니다.");
      const b = r.battle,
        c = b.hand.find((c) => c.id === a.id);
      check(c, "손패에 없는 카드입니다.");
      const h = r.heroes.find((h) => h.id === c.owner)!;
      check(h.hp > 0, "전투 불능인 인물입니다.");
      const info = cardInfo(c);
      check(b.energy >= info.cost, "행동 자원이 부족합니다.");
      if (c.kind === "skill") check(h.mana > 0, "마나가 부족합니다.");
      const ally = r.heroes.find((h) => h.id === a.target && h.hp > 0);
      const tower = a.target === "M08:tower";
      const enemy = b.enemies.find(
        (e) => e.id === (tower ? "M08" : a.target) && e.hp > 0,
      );
      check(info.target === "ally" ? ally : enemy, "유효한 대상을 선택하세요.");
      if (tower) check(enemy!.tower > 0, "이미 파괴한 성탑입니다.");
      b.energy -= info.cost;
      if (c.kind === "skill") h.mana--;
      b.hand = b.hand.filter((x) => x.id !== c.id);
      if (info.triggers.includes("exhaust")) b.exhausted.push(c);
      else b.discard.push(c);
      if (info.triggers.includes("copy"))
        b.discard.push({ ...c, id: `${c.id}-copy-${b.turn}-${g.version}` });
      if (info.target === "ally") {
        if (c.kind === "skill" && info.role === "지원") {
          const healing = info.power + Math.floor(heroStats(h).spell / 3);
          ally!.hp = Math.min(ally!.maxHp, ally!.hp + healing);
          ally!.stress = Math.max(0, ally!.stress - 2);
          reduceStatus(ally!, "fear", 2);
          r.combatFx = {
            nonce: g.version + 1,
            kind: "hero-heal",
            actor: h.id,
            target: ally!.id,
            card: c.kind,
            amount: healing,
          };
        } else {
          const shielding = info.power + Math.floor(heroStats(h).defense / 4);
          ally!.shield += shielding;
          addStatus(ally!, "block", c.kind === "guard" ? 2 : 1);
          if (c.kind === "skill") {
            ally!.counter = 5;
            addStatus(ally!, "counter", 5);
            addStatus(ally!, "thorns", 3);
            b.discard.push({
              id: `${h.id}-strike-created-${b.turn}-${g.version}`,
              owner: h.id,
              kind: "strike",
            });
          }
          r.combatFx = {
            nonce: g.version + 1,
            kind: "hero-guard",
            actor: h.id,
            target: ally!.id,
            card: c.kind,
            amount: shielding,
          };
        }
      } else {
        const stats = heroStats(h);
        let dmg =
          info.power +
          (c.kind === "skill"
            ? Math.floor(stats.spell / 3)
            : Math.floor(stats.attack / 4)) +
          g.facilities.forge +
          (c.kind === "strike" ? r.cardMods?.[h.id]?.strikeBonus || 0 : 0) +
          (h.statuses.fury || 0);
        if (h.statuses.weakness) dmg = Math.floor(dmg * 0.75);
        if (h.statuses.anger && h.hp <= h.maxHp / 2)
          dmg += h.statuses.anger * 2;
        const target = enemy!;
        if (!tower) {
          dmg += target.mark + (target.statuses.target || 0);
          if (target.statuses.vulnerable) dmg = Math.ceil(dmg * 1.25);
          if (h.statuses.critical) {
            dmg = Math.ceil(dmg * 1.5);
            reduceStatus(h, "critical");
          }
          if (target.statuses.stealth) {
            reduceStatus(target, "stealth");
            dmg = 0;
          }
        }
        if (tower) enemy!.tower = Math.max(0, enemy!.tower - dmg);
        else {
          if (!(c.kind === "skill" && info.role === "공격")) {
            const blocked = Math.min(target.shield, dmg);
            target.shield -= blocked;
            dmg -= blocked;
          }
          target.hp = Math.max(0, target.hp - dmg);
          if (c.kind === "strike") addStatus(target, "bleed", 2);
          if (c.kind === "heavy") addStatus(target, "vulnerable", 1);
          if (c.kind === "skill" && info.role === "공격") {
            target.mark = 4;
            addStatus(target, "target", 4);
            addStatus(target, "poison", 2);
          }
          if (c.kind === "skill" && info.role === "제어") {
            target.stun = 1;
            addStatus(target, "stun", 1);
            addStatus(target, "shock", 2);
          }
        }
        r.combatFx = {
          nonce: g.version + 1,
          kind: "hero-attack",
          actor: h.id,
          target: target.id,
          card: c.kind,
          amount: dmg,
        };
        if (
          target.hp > 0 &&
          !target.stun &&
          ((target.id === "M06" && b.turn % 2 === 1) ||
            (target.id === "M07" && b.lastActor === h.id))
        )
          hurt(h, target.id === "M06" ? 6 : 5, relations(g.party).defense);
        b.lastActor = h.id;
      }
      if (info.triggers.includes("discover")) draw(r);
      log(g, `${characters.find((x) => x.id === h.id)!.name}의 ${info.name}.`);
      victory(g);
      if (r.mode === "battle") intent(r);
    } else if (a.type === "endTurn") {
      check(r.mode === "battle" && r.battle, "전투 중이 아닙니다.");
      const b = r.battle,
        defense = relations(g.party).defense;
      const buff = b.enemies.some((e) => e.id === "M04" && e.hp > 0 && !e.stun)
        ? 3
        : 0;
      for (const e of b.enemies.filter((e) => e.hp > 0)) {
        if (e.stun) {
          e.stun--;
          continue;
        }
        const hit = (h: Hero, n: number) => {
          if (h.statuses.stealth) {
            reduceStatus(h, "stealth");
            return;
          }
          const guarded = h.shield > 0;
          const received = hurt(
            h,
            n + (e.id === "M04" ? 0 : buff),
            e.id === "M02" ? 0 : defense,
          );
          if (guarded && h.counter) e.hp = Math.max(0, e.hp - h.counter);
          if (received > 0 && h.statuses.thorns)
            e.hp = Math.max(0, e.hp - h.statuses.thorns);
        };
        const target =
          r.heroes.find((h) => h.id === e.target && h.hp > 0) ||
          r.heroes.find((h) => h.hp > 0);
        if (!target) break;
        if (e.id === "M01") e.shield += 10;
        else if (e.id === "M04") continue;
        else if (e.id === "M03") {
          if (b.turn % 3 === 0)
            r.heroes.filter((h) => h.hp > 0).forEach((h) => hit(h, 12));
        } else if (e.id === "M06" && b.turn % 2) continue;
        else if (e.id === "M08") {
          if (b.turn % 2) {
            if (e.tower > 0) e.shield += 16;
          } else
            r.heroes
              .filter((h) => h.hp > 0)
              .forEach((h) => hit(h, e.tower > 0 ? 18 : 9));
        } else {
          const damage = e.id === "M06" || e.id === "M07" ? 12 : 6;
          hit(target, damage);
          r.combatFx = {
            nonce: g.version + 1,
            kind: "enemy-attack",
            actor: e.id,
            target: target.id,
            amount: damage,
          };
        }
      }
      for (const h of r.heroes.filter((hero) => hero.hp > 0)) {
        const damage =
          (h.statuses.poison || 0) +
          (h.statuses.bleed || 0) +
          (h.statuses.burn || 0) +
          (h.statuses.shock || 0) +
          (h.statuses.plague || 0);
        if (damage) h.hp = Math.max(0, h.hp - damage);
        h.stress += (h.statuses.madness || 0) + (h.statuses.fear || 0);
        if (h.statuses.fear) addStatus(h, "weakness", 1);
        if (h.statuses.theft) r.gold = Math.max(0, r.gold - h.statuses.theft!);
        if (h.statuses.plague) {
          const spread = r.heroes.find(
            (other) => other.id !== h.id && other.hp > 0,
          );
          if (spread) addStatus(spread, "plague", 1);
        }
        for (const id of [
          "poison",
          "bleed",
          "burn",
          "shock",
          "fear",
          "weakness",
        ] as StatusId[])
          if (h.statuses[id]) reduceStatus(h, id);
      }
      for (const e of b.enemies.filter((enemy) => enemy.hp > 0)) {
        const damage =
          (e.statuses.poison || 0) +
          (e.statuses.bleed || 0) +
          (e.statuses.burn || 0) +
          (e.statuses.shock || 0) +
          (e.statuses.plague || 0);
        if (damage) e.hp = Math.max(0, e.hp - damage);
        if (e.statuses.plague) {
          const spread = b.enemies.find(
            (other) => other.id !== e.id && other.hp > 0,
          );
          if (spread) addStatus(spread, "plague", 1);
        }
        for (const id of [
          "poison",
          "bleed",
          "burn",
          "shock",
          "vulnerable",
          "target",
        ] as StatusId[])
          if (e.statuses[id]) reduceStatus(e, id);
      }
      victory(g);
      if (r.mode === "battle") {
        if (b.turn >= balance.maxBattleTurns) {
          r.mode = "defeat";
          r.reward = null;
          r.gold = 0;
          r.materials = [];
          log(
            g,
            `전투가 ${balance.maxBattleTurns}턴에 도달해 탐사대가 후퇴했다.`,
          );
        }
      }
      if (r.mode === "battle") {
        r.heroes.forEach((h) => {
          h.shield = h.loadout.trinket === "ward" ? 3 : 0;
          h.counter = 0;
          h.mana = Math.min(heroStats(h).maxMana, h.mana + 1);
        });
        const retained = b.hand.filter(
          (card) =>
            r.heroes.some((hero) => hero.id === card.owner && hero.hp > 0) &&
            cardInfo(card).triggers.includes("retain"),
        );
        b.discard.push(
          ...b.hand.filter(
            (card) => !cardInfo(card).triggers.includes("retain"),
          ),
        );
        b.hand = retained;
        b.turn++;
        b.energy = balance.energy;
        draw(r);
        intent(r);
        log(g, `${b.turn}번째 턴. 적의 예고를 확인하자.`);
      }
    } else if (a.type === "claim") {
      check(r.mode === "reward" && r.reward, "받을 보상이 없습니다.");
      r.gold += r.reward.gold;
      r.materials.push(...r.reward.materials);
      r.reward = null;
      r.battle = null;
      r.mode = "map";
      log(g, "전리품을 배낭에 보관했다. 귀환하면 창고에 저장된다.");
    } else if (a.type === "return") {
      check(
        r.mode === "defeat" ||
          (r.mode === "map" &&
            (roomFor(r).kind === "rest" ||
              (roomFor(r).kind === "exit" && !roomFor(r).layer))),
        "전투·사건·보상 처리를 먼저 완료하세요.",
      );
      const failed = r.mode === "defeat";
      g.gold += r.gold;
      r.materials.forEach((m) => (g.materials[m] = (g.materials[m] || 0) + 1));
      for (const h of r.heroes) {
        const original = g.roster.find((x) => x.id === h.id)!;
        Object.assign(original, h, {
          hp: h.maxHp,
          shield: 0,
          injury: failed || h.hp === 0,
        });
      }
      g.runs++;
      if (r.room === "final-exit") g.endingUnlocked = true;
      if (g.runs === 1) achievement(g, "first-return", "첫 귀환");
      g.summary = failed
        ? "탐사 실패 · 부상을 입고 귀환했습니다. 전리품은 잃었지만 경험치는 유지됩니다."
        : `${r.cleared ? "요새 돌파" : "안전 귀환"} · 은화 ${r.gold} · 재료 ${r.materials.length}개를 창고에 저장했습니다.`;
      g.run = null;
      log(g, g.summary);
    } else throw new RuleError("지원하지 않는 행동입니다.");
  }
  g.version++;
  return g;
}

/** 실제 리듀서를 복제 상태에 적용해 UI 예상치와 서버 판정이 어긋나지 않게 한다. */
export function predictCard(
  game: Game,
  cardId: string,
  targetId: string,
): CardPreview {
  const before = normalizeGame(game);
  const run = before.run;
  const battle = run?.battle;
  const card = battle?.hand.find((item) => item.id === cardId);
  if (!run || !battle || !card)
    return { valid: false, summary: "사용할 수 없는 카드", details: [] };
  try {
    const actorBefore = run.heroes.find((hero) => hero.id === card.owner)!;
    const allyBefore = run.heroes.find((hero) => hero.id === targetId);
    const enemyId = targetId === "M08:tower" ? "M08" : targetId;
    const enemyBefore = battle.enemies.find((enemy) => enemy.id === enemyId);
    const after = reduceGame(before, {
      type: "play",
      id: cardId,
      target: targetId,
    });
    const nextRun = after.run!;
    const actorAfter = nextRun.heroes.find((hero) => hero.id === card.owner)!;
    const allyAfter = nextRun.heroes.find((hero) => hero.id === targetId);
    const enemyAfter = nextRun.battle?.enemies.find(
      (enemy) => enemy.id === enemyId,
    );
    const details: string[] = [];
    let target: CardPreview["target"];
    if (allyBefore && allyAfter) {
      const healing = allyAfter.hp - allyBefore.hp;
      const shielding = allyAfter.shield - allyBefore.shield;
      if (healing > 0) details.push(`체력 +${healing}`);
      if (shielding > 0) details.push(`보호막 +${shielding}`);
      if (allyAfter.stress < allyBefore.stress)
        details.push(`스트레스 ${allyAfter.stress - allyBefore.stress}`);
      if ((allyAfter.counter || 0) > (allyBefore.counter || 0))
        details.push(`반격 ${allyAfter.counter}`);
      target = {
        hpBefore: allyBefore.hp,
        hpAfter: allyAfter.hp,
        maxHp: allyBefore.maxHp,
        shieldBefore: allyBefore.shield,
        shieldAfter: allyAfter.shield,
      };
    }
    if (enemyBefore && enemyAfter) {
      if (targetId === "M08:tower")
        details.push(`성탑 피해 ${enemyBefore.tower - enemyAfter.tower}`);
      else {
        const damage = enemyBefore.hp - enemyAfter.hp;
        const shieldDamage = enemyBefore.shield - enemyAfter.shield;
        if (damage > 0) details.push(`체력 피해 ${damage}`);
        if (shieldDamage > 0) details.push(`보호막 피해 ${shieldDamage}`);
        if (enemyAfter.mark > enemyBefore.mark)
          details.push(`표식 +${enemyAfter.mark - enemyBefore.mark}`);
        if (enemyAfter.stun > enemyBefore.stun) details.push("기절 1턴");
      }
      target = {
        hpBefore: enemyBefore.hp,
        hpAfter: enemyAfter.hp,
        maxHp: enemyBefore.maxHp,
        shieldBefore: enemyBefore.shield,
        shieldAfter: enemyAfter.shield,
      };
    }
    const retaliation = actorBefore.hp - actorAfter.hp;
    if (retaliation > 0) details.push(`반격 피해 ${retaliation}`);
    return {
      valid: true,
      summary: details.join(" · ") || "효과 없음",
      details,
      target,
      retaliation:
        retaliation > 0
          ? {
              hpBefore: actorBefore.hp,
              hpAfter: actorAfter.hp,
              maxHp: actorBefore.maxHp,
            }
          : undefined,
    };
  } catch (error) {
    return {
      valid: false,
      summary: error instanceof Error ? error.message : "사용할 수 없는 대상",
      details: [],
    };
  }
}
