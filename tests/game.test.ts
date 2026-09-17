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
  type Game,
  type Action,
} from "../lib/game";
function act(g: Game, a: Action) {
  return reduceGame(g, a, 1234567);
}
function battleStart() {
  return act(act(initialGame(), { type: "enter" }), {
    type: "move",
    id: "gate",
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
test("one whole expedition: combat, reward once, puzzle, faction, boss, return", () => {
  let g = fight(battleStart());
  assert.equal(g.run!.mode, "reward");
  g = act(g, { type: "claim" });
  assert.throws(() => act(g, { type: "claim" }));
  g = act(g, { type: "move", id: "runes" });
  g = act(g, { type: "event", choice: "star" });
  assert.equal(g.run!.mode, "event");
  g = act(g, { type: "event", choice: "bell" });
  assert.throws(() => act(g, { type: "event", choice: "bell" }));
  assert.throws(() => act(g, { type: "move", id: "gate" }));
  g = fight(act(g, { type: "move", id: "yard" }));
  assert.equal(g.run!.mode, "reward");
  g = act(g, { type: "claim" });
  g = act(g, { type: "move", id: "supply" });
  g = act(g, { type: "event", choice: "accept" });
  g = fight(act(g, { type: "move", id: "boss" }));
  assert.equal(g.run!.mode, "reward");
  assert.equal(g.run!.cleared, true);
  g = act(g, { type: "claim" });
  g = act(g, { type: "move", id: "exit" });
  const gold = g.run!.gold;
  g = act(g, { type: "return" });
  assert.equal(g.run, null);
  assert.equal(g.gold, 100 + gold);
  assert.ok(g.materials["빈 왕관 파편"]);
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
  // Use real graph to enter courtyard, then test the saved encounter at its explosive turn.
  g = fight(battleStart());
  g = act(g, { type: "claim" });
  g = act(g, { type: "move", id: "camp" });
  g = act(g, { type: "event", choice: "rest" });
  g = act(g, { type: "move", id: "yard" });
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
  assert.equal(g.run!.heroes[0].hp, 60);
  g = battleStart();
  g.run!.battle!.hand = [{ id: "AR1-skill", owner: "AR1", kind: "skill" }];
  g = act(g, { type: "play", id: "AR1-skill", target: "AR4" });
  g = act(g, { type: "endTurn" });
  assert.equal(g.run!.battle!.enemies[1].hp, 25);
  assert.equal(g.run!.heroes.find((h) => h.id === "AR4")!.hp, 60);
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
