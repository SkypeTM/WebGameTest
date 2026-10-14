import test from "node:test";
import assert from "node:assert/strict";
import { initialGame, reduceGame, normalizeGame } from "../lib/game";

test("new campaigns enforce ordered memories before gameplay", () => {
  const g = initialGame();
  assert.throws(() => reduceGame(g, { type: "enter" }));
  assert.throws(() =>
    reduceGame(g, {
      type: "prologue",
      choice: "answer",
      id: "M2",
      target: "A",
    }),
  );
  assert.equal(g.prologue?.stage, "questions");
});

for (const faction of ["AR", "VR", "BC", "BK", "WS", "DS", "GO", "EF"]) {
  test(`${faction}: complete prologue, preserve party and enter origin region`, () => {
    let g = initialGame();
    for (let i = 1; i <= 7; i++)
      g = reduceGame(g, {
        type: "prologue",
        choice: "answer",
        id: `M${i}`,
        target: "A",
      });
    assert.equal(g.prologue?.stage, "origin");
    g = reduceGame(g, { type: "prologue", choice: "origin", id: faction });
    assert.equal(g.party.length, 4);
    assert.ok(g.party.every((id) => id.startsWith(faction)));
    g = reduceGame(g, { type: "prologue", choice: "begin", target: "harbor" });
    assert.equal(g.prologue?.stage, "complete");
    assert.ok(g.activeQuest);
    const restored = normalizeGame(JSON.parse(JSON.stringify(g)));
    assert.deepEqual(restored.party, g.party);
    assert.deepEqual(restored.prologue, g.prologue);
    const region = (
      {
        AR: "fortress",
        VR: "harbor",
        BC: "archive",
        BK: "archive",
        WS: "chapel",
        DS: "laboratory",
        GO: "observatory",
        EF: "harbor",
      } as const
    )[faction as "AR"];
    g = reduceGame(restored, { type: "enter", choice: region }, 42);
    assert.equal(g.run?.region, region);
  });
}
