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
};
export type Battle = {
  turn: number;
  energy: number;
  hand: Card[];
  deck: Card[];
  discard: Card[];
  enemies: Enemy[];
  lastActor: string | null;
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
  mode: "map" | "battle" | "event" | "reward" | "defeat";
  cleared: boolean;
};
export type Game = {
  schema: 1;
  version: number;
  party: string[];
  roster: Hero[];
  gold: number;
  materials: Record<string, number>;
  runs: number;
  reputation: Record<string, number>;
  facilities: { forge: number; training: number; infirmary: number; canteen: number };
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
export const rooms: Record<
  string,
  { name: string; kind: string; next: string[]; enemies?: string[] }
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
  "harbor-entry": { name: "심연의 옛 항구", kind: "battle", enemies: ["M09", "M10"], next: ["harbor-yard"] },
  "harbor-yard": { name: "침몰한 부두", kind: "battle", enemies: ["M11", "M12", "M13"], next: ["harbor-elite", "harbor-supply"] },
  "harbor-elite": { name: "검은 닻의 관문", kind: "battle", enemies: ["M14", "M15"], next: ["harbor-boss"] },
  "harbor-supply": { name: "항구의 잔불", kind: "rest", next: ["harbor-boss"] },
  "harbor-boss": { name: "흑조의 부두", kind: "battle", enemies: ["M16"], next: ["archive-entry"] },
  "archive-entry": { name: "침수된 지하 서고", kind: "battle", enemies: ["M17", "M18"], next: ["archive-yard"] },
  "archive-yard": { name: "잠긴 열람실", kind: "battle", enemies: ["M19", "M20", "M21"], next: ["archive-elite", "archive-supply"] },
  "archive-elite": { name: "역문자의 문", kind: "battle", enemies: ["M22", "M23"], next: ["archive-boss"] },
  "archive-supply": { name: "사서의 휴식처", kind: "rest", next: ["archive-boss"] },
  "archive-boss": { name: "가라앉은 문헌고", kind: "battle", enemies: ["M24"], next: ["chapel-entry"] },
  "chapel-entry": { name: "백야의 지하 예배당", kind: "battle", enemies: ["M25", "M26"], next: ["chapel-yard"] },
  "chapel-yard": { name: "촛불 없는 회랑", kind: "battle", enemies: ["M27", "M28", "M29"], next: ["chapel-elite", "chapel-supply"] },
  "chapel-elite": { name: "거꾸로 선 제단", kind: "battle", enemies: ["M30", "M31"], next: ["chapel-boss"] },
  "chapel-supply": { name: "고해의 방", kind: "rest", next: ["chapel-boss"] },
  "chapel-boss": { name: "백야의 성가대", kind: "battle", enemies: ["M32"], next: ["root-entry"] },
  "root-entry": { name: "뿌리 성소", kind: "battle", enemies: ["M33", "M34"], next: ["root-yard"] },
  "root-yard": { name: "수액의 정원", kind: "battle", enemies: ["M35", "M36", "M37"], next: ["root-elite", "root-supply"] },
  "root-elite": { name: "뒤틀린 문지기", kind: "battle", enemies: ["M38", "M39"], next: ["root-boss"] },
  "root-supply": { name: "씨앗의 둥지", kind: "rest", next: ["root-boss"] },
  "root-boss": { name: "성소의 심장", kind: "battle", enemies: ["M40"], next: ["village-entry"] },
  "village-entry": { name: "재가 된 옛 마을", kind: "battle", enemies: ["M41", "M42"], next: ["village-yard"] },
  "village-yard": { name: "그을린 시장", kind: "battle", enemies: ["M43", "M44", "M45"], next: ["village-elite", "village-supply"] },
  "village-elite": { name: "재의 종지기", kind: "battle", enemies: ["M46", "M47"], next: ["village-boss"] },
  "village-supply": { name: "꺼진 화덕", kind: "rest", next: ["village-boss"] },
  "village-boss": { name: "재의 왕좌", kind: "battle", enemies: ["M48"], next: ["tower-entry"] },
  "tower-entry": { name: "침묵의 종탑", kind: "battle", enemies: ["M49", "M50"], next: ["tower-yard"] },
  "tower-yard": { name: "무음의 계단", kind: "battle", enemies: ["M51", "M52", "M53"], next: ["tower-elite", "tower-supply"] },
  "tower-elite": { name: "종 아래의 파수꾼", kind: "battle", enemies: ["M54", "M55"], next: ["tower-boss"] },
  "tower-supply": { name: "멈춘 추", kind: "rest", next: ["tower-boss"] },
  "tower-boss": { name: "침묵의 종", kind: "battle", enemies: ["M56"], next: ["final-exit"] },
  "final-exit": { name: "마지막 귀환의 봉화", kind: "exit", next: [] },
};
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
  return {
    id,
    hp: balance.heroHP,
    maxHp: balance.heroHP,
    shield: 0,
    stress: 0,
    xp: 0,
    level: 1,
    injury: false,
    equipment: "blade",
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
  return {
    ...cards[(c.kind === "skill" ? role : c.kind) as keyof typeof cards],
    role,
  };
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
  });
  const deck = r.heroes
    .filter((h) => h.hp > 0)
    .flatMap((h) =>
      (["strike", "guard", "skill", "heavy"] as const).map((kind) => ({
        id: `${h.id}-${kind}`,
        owner: h.id,
        kind,
      })),
    );
  r.battle = {
    turn: 1,
    energy: balance.energy,
    hand: [],
    deck: shuffle(r, deck),
    discard: [],
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
function hurt(h: Hero, n: number, defense: number) {
  const dmg = Math.ceil(n * (1 - defense));
  const absorb = Math.min(h.shield, dmg);
  h.shield -= absorb;
  h.hp = Math.max(0, h.hp - (dmg - absorb));
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
      gold: b.enemies.length * 18 + (r.room === "boss" || r.room.endsWith("-boss") ? 60 : 0),
      materials: b.enemies.map(
        (e) => monsters.find((m) => m.id === e.id)!.loot,
      ),
    };
    r.mode = "reward";
    xp(r, balance.battleXP);
    r.heroes.forEach((h) => (h.stress += relations(g.party).stress));
    if (r.room === "boss" || r.room.endsWith("-boss")) r.cleared = true;
    log(g, "전투 승리. 전리품을 챙기면 다음 경로가 열린다.");
  }
}
export function reduceGame(previous: Game, a: Action, seed = 1): Game {
  const g = structuredClone(previous),
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
    check(
      a.choice === "blade" || a.choice === "ward",
      "알 수 없는 장비입니다.",
    );
    h.equipment = a.choice;
  } else if (a.type === "upgradeFacility") {
    check(!r, "탐사 중에는 시설을 업그레이드할 수 없습니다.");
    const id = a.id as keyof Game["facilities"];
    check(["forge", "training", "infirmary", "canteen"].includes(id), "알 수 없는 시설입니다.");
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
    log(g, `${characters.find((character) => character.id === h.id)!.name}이 훈련으로 경험치를 얻었다.`);
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
    log(g, `${characters.find((character) => character.id === h.id)!.name}의 부상을 치료했다.`);
  } else if (a.type === "factionShop") {
    check(!r, "탐사 중에는 팩션 상점을 이용할 수 없습니다.");
    const faction = a.choice;
    check(typeof faction === "string" && factionCodes.includes(faction), "알 수 없는 팩션입니다.");
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
    check((g.materials["빈 왕관 파편"] || 0) > 0, "교환할 희생 재료가 없습니다.");
    check(g.gold >= 30, "은화가 부족합니다.");
    g.materials["빈 왕관 파편"]--;
    g.materials["암시장 증표"] = (g.materials["암시장 증표"] || 0) + 1;
    g.gold -= 30;
    log(g, "선택형 암시장 계약을 체결했다. 희생 재료 1개와 은화 30을 지불했다.");
  } else if (a.type === "chooseEnding") {
    check(!r, "탐사 중에는 엔딩을 선택할 수 없습니다.");
    check(g.endingUnlocked && g.ending === null, "최종 탐사를 완료해야 엔딩을 선택할 수 있습니다.");
    check(["kingdom", "republic", "union", "liberation"].includes(a.choice || ""), "알 수 없는 엔딩입니다.");
    g.ending = a.choice!;
    g.endingHistory.push(g.ending);
    achievement(g, `ending-${g.ending}`, `${g.ending} 엔딩`);
    log(g, `${g.ending}의 결말을 기록했다.`);
  } else if (a.type === "rebirth") {
    check(!r && g.ending !== null, "엔딩 이후에만 환생할 수 있습니다.");
    const inheritance = a.ids || [];
    check(inheritance.length <= balance.inheritanceLimit, "계승 슬롯은 최대 3개입니다.");
    check(inheritance.every((item) => g.materials[item] > 0), "보유한 재료만 계승할 수 있습니다.");
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
      visited: ["entrance"],
      heroes: g.party.map((id) => ({
        ...g.roster.find((h) => h.id === id)!,
        hp: balance.heroHP,
        shield: 0,
      })),
      battle: null,
      gold: 0,
      materials: [],
      reward: null,
      mode: "map",
      cleared: false,
    };
    log(g, "변경 요새에 진입했다.");
  } else {
    check(r, "진행 중인 탐사가 없습니다.");
    if (a.type === "move") {
      check(r.mode === "map", "현재 방의 행동을 먼저 완료하세요.");
      check(rooms[r.room].next.includes(a.id || ""), "연결되지 않은 방입니다.");
      check(!r.visited.includes(a.id!), "이미 완료한 방입니다.");
      r.room = a.id!;
      r.visited.push(r.room);
      const room = rooms[r.room];
      if (room.enemies) enterBattle(r, room.enemies);
      else if (["rest", "puzzle", "faction"].includes(room.kind))
        r.mode = "event";
      log(g, `${room.name}에 도착했다.`);
    } else if (a.type === "event") {
      check(r.mode === "event", "선택할 사건이 없습니다.");
      const kind = rooms[r.room].kind;
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
    } else if (a.type === "play") {
      check(r.mode === "battle" && r.battle, "전투 중이 아닙니다.");
      const b = r.battle,
        c = b.hand.find((c) => c.id === a.id);
      check(c, "손패에 없는 카드입니다.");
      const h = r.heroes.find((h) => h.id === c.owner)!;
      check(h.hp > 0, "전투 불능인 인물입니다.");
      const info = cardInfo(c);
      check(b.energy >= info.cost, "행동 자원이 부족합니다.");
      const ally = r.heroes.find((h) => h.id === a.target && h.hp > 0);
      const tower = a.target === "M08:tower";
      const enemy = b.enemies.find(
        (e) => e.id === (tower ? "M08" : a.target) && e.hp > 0,
      );
      check(info.target === "ally" ? ally : enemy, "유효한 대상을 선택하세요.");
      if (tower) check(enemy!.tower > 0, "이미 파괴한 성탑입니다.");
      b.energy -= info.cost;
      b.hand = b.hand.filter((x) => x.id !== c.id);
      b.discard.push(c);
      if (info.target === "ally") {
        if (c.kind === "skill" && info.role === "지원") {
          ally!.hp = Math.min(ally!.maxHp, ally!.hp + info.power);
          ally!.stress = Math.max(0, ally!.stress - 2);
        } else {
          ally!.shield += info.power;
          if (c.kind === "skill") ally!.counter = 5;
        }
      } else {
        let dmg =
          info.power +
          (h.equipment === "blade" ? 2 + g.facilities.forge : 0) +
          Math.max(0, h.level - 1);
        const guard = b.enemies.find(
          (e) => e.id === "M01" && e.hp > 0 && e.shield > 0,
        );
        const target = guard && enemy !== guard && !tower ? guard : enemy!;
        if (!tower) dmg += target.mark;
        if (tower) enemy!.tower = Math.max(0, enemy!.tower - dmg);
        else {
          if (!(c.kind === "skill" && info.role === "공격")) {
            const blocked = Math.min(target.shield, dmg);
            target.shield -= blocked;
            dmg -= blocked;
          }
          target.hp = Math.max(0, target.hp - dmg);
          if (c.kind === "skill" && info.role === "공격") target.mark = 4;
          if (c.kind === "skill" && info.role === "제어") target.stun = 1;
        }
        if (
          target.hp > 0 &&
          !target.stun &&
          ((target.id === "M06" && b.turn % 2 === 1) ||
            (target.id === "M07" && b.lastActor === h.id))
        )
          hurt(h, target.id === "M06" ? 6 : 5, relations(g.party).defense);
        b.lastActor = h.id;
      }
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
          const guarded = h.shield > 0;
          hurt(
            h,
            n + (e.id === "M04" ? 0 : buff),
            e.id === "M02" ? 0 : defense,
          );
          if (guarded && h.counter) e.hp = Math.max(0, e.hp - h.counter);
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
        } else hit(target, e.id === "M06" || e.id === "M07" ? 12 : 6);
      }
      victory(g);
      if (r.mode === "battle") {
        r.heroes.forEach((h) => {
          h.shield = h.equipment === "ward" ? 3 : 0;
          h.counter = 0;
        });
        b.discard.push(...b.hand);
        b.hand = [];
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
        ["map", "defeat"].includes(r.mode),
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
