import test from "node:test";
import assert from "node:assert/strict";
import {
  initialGame,
  reduceGame,
  normalizeGame,
  deckPreview,
  cardInfo,
  earnedCardTriggers,
  type Game,
} from "../lib/game";
function run() {
  return reduceGame(initialGame(), { type: "enter" }, 42);
}
test("base cards have no automatic keywords and old saves normalize safely", () => {
  let g = run();
  g = reduceGame(g, { type: "move", id: "l1-battle" });
  assert.ok(
    g.run!.battle!.hand.every((c) => cardInfo(c).triggers.length === 0),
  );
  const saved = JSON.parse(JSON.stringify(g));
  delete saved.run.keywordGrants;
  saved.run.battle.hand[0].triggers = ["copy"];
  assert.deepEqual(
    cardInfo(normalizeGame(saved).run!.battle!.hand[0]).triggers,
    [],
  );
});
test("merchant keyword costs once, persists and reaches next battle", () => {
  let g = run();
  g.run!.room = "l2-merchant";
  g.run!.mode = "merchant";
  g.run!.gold = 100;
  g = reduceGame(g, { type: "merchant", choice: "keyword", id: "AR1" });
  assert.equal(g.run!.gold, 70);
  assert.throws(() =>
    reduceGame(g, { type: "merchant", choice: "keyword", id: "AR1" }),
  );
  g = normalizeGame(JSON.parse(JSON.stringify(g)));
  assert.deepEqual(
    deckPreview(g).find(
      (x) => x.card.owner === "AR1" && x.card.kind === "heavy",
    )!.card.triggers,
    ["retain"],
  );
  assert.equal(g.run!.keywordGrants![0].source, "merchant");
});
test("level and promotion keywords survive normalization; promotion is validated", () => {
  let g = initialGame();
  assert.throws(() => reduceGame(g, { type: "promote", id: "AR1" }));
  g.roster[0].xp = 200;
  g.roster[0].level = 5;
  g.gold = 100;
  assert.deepEqual(earnedCardTriggers(g.roster[0], "guard"), ["retain"]);
  g = reduceGame(g, { type: "promote", id: "AR1" });
  assert.equal(g.gold, 20);
  assert.deepEqual(earnedCardTriggers(normalizeGame(g).roster[0], "skill"), [
    "discover",
    "create",
  ]);
  assert.throws(() => reduceGame(g, { type: "promote", id: "AR1" }));
});
test("relic grants copy and exhaust to heavy and resolves both in combat", () => {
  let g = run();
  g.run!.relic = "fortress-1";
  g = reduceGame(g, { type: "move", id: "l1-battle" });
  const b = g.run!.battle!;
  b.hand = [{ id: "test", owner: "AR1", kind: "heavy" }];
  b.enemies[0].hp = 500;
  b.enemies[0].maxHp = 500;
  g = reduceGame(g, { type: "play", id: "test", target: "M01" });
  assert.equal(g.run!.battle!.exhausted.length, 1);
  assert.equal(
    g.run!.battle!.discard.filter((c) => c.id.includes("copy")).length,
    1,
  );
  const noRelic: Game = structuredClone(g);
  noRelic.run!.relic = null;
  assert.deepEqual(
    deckPreview(noRelic).find((c) => c.card.kind === "heavy")!.card.triggers,
    [],
  );
});
test("positive dungeon event awards a run-only keyword", () => {
  let g = run();
  g.run!.room = "l1-question";
  g.run!.mode = "event";
  g.run!.seed = g.run!.visited.length % 2 ? 3 : 2;
  g = reduceGame(g, { type: "event", choice: "investigate" });
  assert.ok(
    g.run!.keywordGrants?.some(
      (k) => k.source === "event" && k.trigger === "retain",
    ),
  );
  assert.deepEqual(earnedCardTriggers(g.roster[0], "strike"), []);
});
