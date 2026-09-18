import test from "node:test";
import assert from "node:assert/strict";
import {
  initialGame,
  reduceGame,
  characters,
  monsters,
  relations,
  cardInfo,
  predictCard,
  heroStats,
  professionFor,
  equipmentAllowed,
  recommendedFormation,
  createExpeditionRoute,
  availableRecruitIds,
  unlockedRegions,
  deckPreview,
  type Game,
  type Action,
} from "../lib/game";
function act(g: Game, a: Action) {
  return reduceGame(g, a, 1234567);
}
function battleStart() {
  return act(act(initialGame(), { type: "enter" }), {
    type: "move",
    id: "l1-battle",
  });
}
export function fight(input: Game) {
  let g = input;
  let limit = 0;
  while (g.run?.mode === "battle" && limit++ < 200) {
    const r = g.run,
      b = r.battle!;
    const cards = b.hand.filter(
      (c) =>
        cardInfo(c).cost <= b.energy &&
        r.heroes.some((h) => h.id === c.owner && h.hp > 0),
    );
    const heal = cards.find(
      (c) =>
        c.kind === "skill" &&
        cardInfo(c).role === "지원" &&
        r.heroes.some((h) => h.hp > 0 && h.hp < h.maxHp - 16),
    );
    const attack = cards.find((c) => cardInfo(c).target === "enemy");
    if (heal) {
      g = act(g, {
        type: "play",
        id: heal.id,
        target: r.heroes.filter((h) => h.hp > 0).sort((a, b) => a.hp - b.hp)[0]
          .id,
      });
    } else if (attack) {
      const enemy =
        b.enemies.find((e) => e.id === "M03" && e.hp > 0) ||
        b.enemies.find((e) => e.hp > 0)!;
      g = act(g, {
        type: "play",
        id: attack.id,
        target: enemy.tower > 0 ? "M08:tower" : enemy.id,
      });
    } else {
      const guard = cards.find((c) => cardInfo(c).target === "ally");
      if (guard) {
        g = act(g, {
          type: "play",
          id: guard.id,
          target: r.heroes
            .filter((h) => h.hp > 0)
            .sort((a, b) => a.hp - b.hp)[0].id,
        });
      } else g = act(g, { type: "endTurn" });
    }
  }
  assert.ok(limit < 200, "battle must terminate");
  return g;
}
test("source data: 32 adults, 30 women, 2 men; 56 unique monsters; 8/map; 24 machines", () => {
  assert.equal(characters.length, 32);
  assert.equal(new Set(characters.map((c) => c.id)).size, 32);
  assert.equal(characters.filter((c) => c.gender === "여").length, 30);
  assert.equal(characters.filter((c) => c.gender === "남").length, 2);
  assert.ok(characters.every((c) => c.age >= 18));
  assert.equal(new Set(monsters.map((m) => m.id)).size, 56);
  for (const map of new Set(monsters.map((m) => m.map)))
    assert.equal(monsters.filter((m) => m.map === map).length, 8);
  assert.equal(
    monsters.filter((m) => m.enemyFaction === "유리톱니 기계군").length,
    24,
  );
});
test("party ownership, 1–4 unique slots, equipment and no hub xp", () => {
  let g = initialGame();
  for (const ids of [
    [],
    ["AR1", "AR1"],
    ["AR1", "AR2", "AR3", "AR4", "VR1"],
    ["VR1"],
  ])
    assert.throws(() => act(g, { type: "party", ids }));
  assert.throws(() => act(g, { type: "recruit", id: "VR1" }));
  g.completedQuests.push("Q01");
  g = act(g, { type: "recruit", id: "VR1" });
  g = act(g, { type: "equip", id: "VR1", choice: "ward" });
  assert.equal(g.roster.at(-1)?.xp, 0);
  assert.equal(g.gold, 80);
  assert.throws(() => act(g, { type: "recruit", id: "VR1" }));
  g = act(g, { type: "party", ids: ["VR1"] });
  assert.equal(g.party.length, 1);
});
test("hub growth upgrades facilities, trains heroes, treats injuries and records achievements", () => {
  let g = initialGame();
  g = act(g, { type: "upgradeFacility", id: "forge" });
  assert.equal(g.facilities.forge, 1);
  assert.equal(g.gold, 70);
  g = act(g, { type: "train", id: "AR1" });
  assert.equal(g.roster.find((h) => h.id === "AR1")!.xp, 10);
  assert.ok(g.achievements.includes("first-training"));
  g.roster[0].injury = true;
  g = act(g, { type: "heal", id: "AR1" });
  assert.equal(g.roster[0].injury, false);
  assert.ok(g.achievements.includes("first-treatment"));
  assert.throws(() => act(g, { type: "heal", id: "AR1" }));
  assert.throws(() => act(g, { type: "upgradeFacility", id: "unknown" }));
});
test("final ending unlocks only after the last return and rebirth keeps selected legacy", () => {
  let g = initialGame();
  g = act(g, { type: "enter" });
  g.run!.room = "final-exit";
  g.run!.mode = "map";
  g.run!.gold = 40;
  g.run!.materials = ["왕관 파편", "녹슨 철심"];
  g = act(g, { type: "return" });
  assert.equal(g.endingUnlocked, true);
  assert.throws(() => act(g, { type: "rebirth", ids: ["왕관 파편"] }));
  g = act(g, { type: "chooseEnding", choice: "kingdom" });
  assert.equal(g.ending, "kingdom");
  g = act(g, { type: "rebirth", ids: ["왕관 파편"] });
  assert.equal(g.rebirths, 1);
  assert.equal(g.materials["왕관 파편"], 1);
  assert.equal(g.ending, null);
  assert.equal(g.facilities.forge, 0);
});
test("legacy saves without growth fields can continue combat", () => {
  const current = battleStart();
  const legacyRecord = structuredClone(current) as unknown as Record<
    string,
    unknown
  >;
  delete legacyRecord.facilities;
  delete legacyRecord.achievements;
  delete legacyRecord.ending;
  delete legacyRecord.endingUnlocked;
  const legacy = legacyRecord as unknown as Game;
  const card = legacy.run!.battle!.hand.find(
    (item) => cardInfo(item).target === "enemy",
  )!;
  const next = act(legacy, { type: "play", id: card.id, target: "M01" });
  assert.equal(typeof next.facilities.forge, "number");
  assert.equal(next.run!.battle!.enemies[0].hp < 30, true);
});
test("battle ends instead of allowing unlimited turn endings", () => {
  let g = battleStart();
  g.run!.battle!.turn = 40;
  g = act(g, { type: "endTurn" });
  assert.equal(g.run!.mode, "defeat");
  assert.equal(g.run!.reward, null);
  assert.throws(() => act(g, { type: "endTurn" }));
});
test("deterministic cards and exact battle JSON restoration", () => {
  const a = battleStart(),
    b = battleStart();
  assert.deepEqual(a, b);
  assert.equal(a.run!.battle!.hand.length, 6);
  assert.equal(a.run!.battle!.deck.length, 10);
  assert.equal(a.run!.battle!.energy, 4);
  const restored = JSON.parse(JSON.stringify(a));
  assert.deepEqual(
    act(restored, { type: "endTurn" }),
    act(a, { type: "endTurn" }),
  );
  assert.deepEqual(a, b, "reducer never mutates original");
});
test("invalid target, duplicate card use, insufficient energy and illegal transition rejected", () => {
  let g = battleStart();
  const c = g.run!.battle!.hand.find((c) => cardInfo(c).target === "enemy")!;
  assert.throws(() => act(g, { type: "play", id: c.id, target: "AR1" }));
  assert.throws(() => act(g, { type: "return" }));
  assert.throws(() => act(g, { type: "enter" }));
  assert.throws(() => act(g, { type: "party", ids: ["AR1"] }));
  g = act(g, { type: "play", id: c.id, target: "M01" });
  assert.throws(() => act(g, { type: "play", id: c.id, target: "M01" }));
  g.run!.battle!.energy = 0;
  assert.throws(() =>
    act(g, { type: "play", id: g.run!.battle!.hand[0].id, target: "M01" }),
  );
});
test("knocked-out owners cannot play and are excluded from next draw", () => {
  let g = battleStart();
  const owner = g.run!.battle!.hand[0].owner;
  g.run!.heroes.find((h) => h.id === owner)!.hp = 0;
  assert.throws(() =>
    act(g, { type: "play", id: g.run!.battle!.hand[0].id, target: "M01" }),
  );
  g = act(g, { type: "endTurn" });
  assert.ok(g.run!.battle!.hand.every((c) => c.owner !== owner));
});
test("one whole branching expedition: combat, merchant, encounter, rest, boss, return", () => {
  let g = fight(battleStart());
  assert.equal(g.run!.mode, "reward");
  g = act(g, { type: "claim" });
  assert.throws(() => act(g, { type: "claim" }));
  assert.throws(() => act(g, { type: "return" }));
  g = act(g, { type: "move", id: "l2-merchant" });
  g = act(g, { type: "merchant", choice: "upgrade", id: "AR1" });
  assert.equal(g.run!.cardMods!.AR1.strikeBonus, 4);
  g = act(g, { type: "merchant", choice: "leave" });
  g = act(g, { type: "move", id: "l3-question" });
  g = act(g, { type: "event", choice: "avoid" });
  g = act(g, { type: "move", id: "l4-rest" });
  g = act(g, { type: "event", choice: "rest" });
  g = fight(act(g, { type: "move", id: "boss" }));
  assert.equal(g.run!.mode, "reward");
  assert.equal(g.run!.cleared, true);
  g = act(g, { type: "claim" });
  g = act(g, { type: "move", id: "victory-rest" });
  g = act(g, { type: "event", choice: "rest" });
  const gold = g.run!.gold;
  g = act(g, { type: "return" });
  assert.equal(g.run, null);
  assert.equal(g.gold, 100 + gold);
  assert.ok(Object.keys(g.materials).length > 0);
  assert.equal(g.runs, 1);
  assert.ok(g.roster.every((h) => h.xp > 0));
  assert.throws(() => act(g, { type: "return" }));
});
test("defeat forfeits only unbanked loot, preserves account and injuries", () => {
  let g = battleStart();
  g.run!.gold = 30;
  g.run!.materials = ["test"];
  g.run!.heroes.forEach((h) => (h.hp = 0));
  g = act(g, { type: "endTurn" });
  assert.equal(g.run!.mode, "defeat");
  g = act(g, { type: "return" });
  assert.equal(g.gold, 100);
  assert.deepEqual(g.materials, {});
  assert.ok(g.roster.every((h) => h.injury));
});
test("faction relationship effects deduplicate pairs and cap", () => {
  assert.equal(relations(["AR1", "AR2", "AR3", "AR4"]).defense, 0.1);
  assert.equal(relations(["AR1", "AR2", "VR1", "VR2"]).stress, 2);
  assert.equal(relations(["AR1", "VR1", "BC1", "BK1"]).stress, 4);
  assert.equal(relations(["AR1", "AR2", "WS1", "WS2"]).shield, 5);
});
test("implemented monster mechanics: shields, countdown, stun, tower and retaliation", () => {
  let g = battleStart();
  g = act(g, { type: "endTurn" });
  assert.equal(g.run!.battle!.enemies[0].shield, 10);
  // Enter the second combat layer, then test the explosive enemy turn.
  g = fight(battleStart());
  g = act(g, { type: "claim" });
  g = act(g, { type: "move", id: "l2-battle" });
  g.run!.battle!.turn = 3;
  const before = g.run!.heroes.map((h) => h.hp);
  g = act(g, { type: "endTurn" });
  assert.ok(g.run!.heroes.every((h, i) => h.hp < before[i]));
  let stunned = battleStart();
  stunned.run!.battle!.enemies.forEach((e) => (e.stun = 1));
  const hp = stunned.run!.heroes.map((h) => h.hp);
  stunned = act(stunned, { type: "endTurn" });
  assert.deepEqual(
    stunned.run!.heroes.map((h) => h.hp),
    hp,
  );
  assert.equal(stunned.run!.battle!.enemies[0].shield, 0);
});

test("selected enemy takes damage; guardian skill counters for its ally", () => {
  let g = battleStart();
  g.run!.battle!.hand = [{ id: "AR1-strike", owner: "AR1", kind: "strike" }];
  g.run!.battle!.enemies[0].shield = 10;
  g.run!.battle!.enemies[1].mark = 4;
  g = act(g, { type: "play", id: "AR1-strike", target: "M02" });
  assert.equal(g.run!.battle!.enemies[0].hp, 30);
  assert.equal(g.run!.battle!.enemies[1].hp, 14);
  assert.equal(g.run!.heroes[0].hp, g.run!.heroes[0].maxHp);
  g = battleStart();
  g.run!.battle!.hand = [{ id: "AR1-skill", owner: "AR1", kind: "skill" }];
  g = act(g, { type: "play", id: "AR1-skill", target: "AR4" });
  g = act(g, { type: "endTurn" });
  assert.equal(g.run!.battle!.enemies[1].hp, 25);
  assert.equal(
    g.run!.heroes.find((h) => h.id === "AR4")!.hp,
    g.run!.heroes.find((h) => h.id === "AR4")!.maxHp,
  );
});

test("card preview uses the same damage and retaliation rules as play", () => {
  let g = battleStart();
  g.run!.battle!.hand = [{ id: "AR1-strike", owner: "AR1", kind: "strike" }];
  g.run!.battle!.enemies[0].shield = 3;
  const before = structuredClone(g);
  const preview = predictCard(g, "AR1-strike", "M01");
  const played = act(g, { type: "play", id: "AR1-strike", target: "M01" });
  assert.equal(preview.valid, true);
  assert.ok(preview.details.includes("보호막 피해 3"));
  assert.ok(
    preview.details.includes(
      `체력 피해 ${before.run!.battle!.enemies[0].hp - played.run!.battle!.enemies[0].hp}`,
    ),
  );
  assert.deepEqual(g, before, "preview does not mutate the saved state");
});

test("loadout stats, visual preview data, statuses and card triggers persist", () => {
  let g = initialGame();
  const base = heroStats(g.roster[1]);
  g = act(g, {
    type: "equip",
    id: "AR2",
    item: "weapon",
    choice: "spear",
  });
  g = act(g, {
    type: "equip",
    id: "AR2",
    item: "armor",
    choice: "plate",
  });
  const equipped = heroStats(g.roster[1]);
  assert.ok(equipped.attack > base.attack);
  assert.ok(equipped.defense > base.defense);

  g = act(g, { type: "enter" });
  g = act(g, { type: "move", id: "l1-battle" });
  g.run!.battle!.hand = [
    { id: "AR1-strike", owner: "AR1", kind: "strike" },
    { id: "AR1-heavy", owner: "AR1", kind: "heavy" },
  ];
  const preview = predictCard(g, "AR1-strike", "M01");
  assert.equal(preview.valid, true);
  assert.equal(preview.target?.hpBefore, 30);
  assert.ok((preview.target?.hpAfter || 30) < 30);
  g = act(g, { type: "play", id: "AR1-strike", target: "M01" });
  assert.equal(g.run!.battle!.enemies[0].statuses.bleed, 2);
  g.run!.battle!.energy = 3;
  g = act(g, { type: "play", id: "AR1-heavy", target: "M02" });
  assert.equal(g.run!.battle!.exhausted.length, 1);
  assert.equal(g.run!.battle!.enemies[1].statuses.vulnerable, 1);
});

test("professions constrain gear, distribute stats and recommend formation", () => {
  const g = initialGame();
  assert.equal(professionFor("AR1").name, "방벽기사");
  assert.equal(professionFor("VR1").name, "추적사수");
  assert.equal(equipmentAllowed("AR1", "armor", "plate"), true);
  assert.equal(equipmentAllowed("AR1", "weapon", "focus"), false);
  assert.throws(() =>
    act(g, {
      type: "equip",
      id: "AR1",
      item: "weapon",
      choice: "focus",
    }),
  );
  const formation = recommendedFormation(["AR3", "AR2", "AR4", "AR1"]);
  assert.deepEqual(formation, ["AR1", "AR2", "AR4", "AR3"]);
  assert.ok(heroStats(g.roster[0]).defense > heroStats(g.roster[1]).defense);
  assert.ok(heroStats(g.roster[2]).spell > heroStats(g.roster[1]).spell);
});
test("branching route contains four layers, required nodes and rest-only return", () => {
  const route = createExpeditionRoute(9, 2);
  assert.deepEqual(new Set(Object.values(route).filter((r) => r.layer && r.layer <= 4).map((r) => r.layer)), new Set([1, 2, 3, 4]));
  for (const kind of ["battle", "merchant", "rest", "question", "boss"])
    assert.ok(Object.values(route).some((room) => room.kind === kind));
  let g = act(initialGame(), { type: "enter" });
  assert.throws(() => act(g, { type: "return" }));
  g = act(g, { type: "move", id: "l1-rest" });
  g = act(g, { type: "event", choice: "rest" });
  g = act(g, { type: "return" });
  assert.equal(g.run, null);
});
test("forge crafts and equips a profession weapon from account materials", () => {
  let g = initialGame();
  g.gold = 200;
  g.materials["녹슨 철심"] = 1;
  g.materials["성문 경첩"] = 1;
  g = act(g, { type: "craft", id: "bastion-blade" });
  assert.ok(g.craftedGear.includes("bastion-blade"));
  g = act(g, { type: "equip", id: "AR1", item: "weapon", choice: "bastion-blade" });
  assert.equal(g.roster[0].loadout.weapon, "bastion-blade");
  assert.throws(() => act(g, { type: "equip", id: "AR2", item: "weapon", choice: "bastion-blade" }));
});
test("story quests unlock recruits, maps and live deck values persist", () => {
  let g = initialGame();
  g = act(g, { type: "quest", id: "Q01", choice: "accept" });
  g = act(g, { type: "enter", choice: "fortress" });
  g.run!.cleared = true;
  g.run!.room = "l1-rest";
  g.run!.mode = "map";
  g = act(g, { type: "return" });
  assert.ok(g.completedQuests.includes("Q01"));
  assert.deepEqual(availableRecruitIds(g.completedQuests), ["VR1", "VR2"]);
  g = act(g, { type: "quest", id: "Q02", choice: "accept" });
  g = act(g, { type: "enter", choice: "fortress" });
  g.run!.cleared = true;
  g.run!.room = "l1-rest";
  g.run!.mode = "map";
  g = act(g, { type: "return" });
  assert.ok(unlockedRegions(g.completedQuests).includes("harbor"));
  g = act(g, { type: "enter", choice: "harbor" });
  assert.equal(g.run!.region, "harbor");
  assert.equal(deckPreview(g).length, 16);
});
