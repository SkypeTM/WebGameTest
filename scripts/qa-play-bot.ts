import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import {
  initialGame,
  reduceGame,
  cardInfo,
  predictCard,
  roomFor,
  type Action,
} from "../lib/game";
import scoring from "../data/prologue_scoring_v1.json";

// No account, database, network mutation or production endpoint is used.
const seeds = [1234567, 42, 20261018];
const results: {
  seed: number;
  passed: boolean;
  actions: number;
  coverage: string[];
  error?: string;
  trace: unknown[];
}[] = [];
for (const seed of seeds) {
  let game = initialGame();
  const trace: unknown[] = [];
  const coverage = new Set<string>();
  let count = 0;
  const act = (action: Action) => {
    assert.ok(++count <= 400, "플레이 행동 제한 초과");
    const version = game.version;
    trace.push({ step: count, mode: game.run?.mode || "lobby", action });
    game = reduceGame(game, action, seed);
    assert.ok(game.version > version, "저장 버전 증가 실패");
    assert.ok(Number.isFinite(game.gold) && game.gold >= 0, "은화 범위 오류");
    for (const h of game.run?.heroes || [])
      assert.ok(h.hp >= 0 && h.hp <= h.maxHp, "체력 범위 오류");
    // Exercise serialization after every action, like save/load.
    game = JSON.parse(JSON.stringify(game));
    coverage.add(action.type);
  };
  try {
    for (const q of scoring.questions)
      act({ type: "prologue", choice: "answer", id: q.id, target: "A" });
    act({ type: "prologue", choice: "origin", id: "AR" });
    act({ type: "prologue", choice: "begin" });
    assert.equal(game.prologue?.stage, "complete");
    act({ type: "enter", choice: "fortress" });
    const beforeInvalidMove = JSON.stringify(game);
    assert.throws(
      () => reduceGame(game, { type: "move", id: "qa-unconnected-node" }, seed),
      /연결되지 않은 방/,
    );
    assert.equal(
      JSON.stringify(game),
      beforeInvalidMove,
      "실패한 행동이 저장 상태를 변경함",
    );
    coverage.add("invalid-move-rejected");
    act({ type: "move", id: "l1-battle" });
    let victories = 0;
    while (game.run) {
      const run = game.run;
      if (run.mode === "battle") {
        const b = run.battle!;
        const allies = run.heroes
          .filter((h) => h.hp > 0)
          .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
        const enemies = b.enemies
          .filter((e) => e.hp > 0)
          .sort((a, b) => a.hp - b.hp);
        // Prefer healing only when useful, then damage, then defense.
        const ordered = [...b.hand].sort((a, b) => {
          const priority = (c: typeof a) =>
            cardInfo(c).target === "enemy"
              ? 1
              : c.kind === "skill" &&
                  cardInfo(c).role === "지원" &&
                  allies[0]?.hp < allies[0]?.maxHp - 16
                ? 0
                : 2;
          return priority(a) - priority(b);
        });
        let chosen: Action | undefined;
        for (const card of ordered) {
          const targets =
            cardInfo(card).target === "enemy"
              ? enemies.map((e) => (e.tower > 0 ? "M08:tower" : e.id))
              : allies.map((h) => h.id);
          const target = targets.find(
            (id) => predictCard(game, card.id, id).valid,
          );
          if (target) {
            chosen = { type: "play", id: card.id, target };
            break;
          }
        }
        act(chosen || { type: "endTurn" });
      } else if (run.mode === "reward") {
        assert.ok(run.reward, "전투 보상 누락");
        victories++;
        act({ type: "claim" });
      } else if (run.mode === "map") {
        if (roomFor(run).kind === "rest") {
          act({ type: "return" });
          break;
        }
        const next = roomFor(run).next;
        assert.ok(next.length, "진행 가능한 경로 없음");
        const id =
          next.find((id) => roomFor(run, id).kind === "rest") ||
          next.find((id) => roomFor(run, id).kind === "merchant") ||
          next[0];
        act({ type: "move", id });
      } else if (run.mode === "event") {
        const kind = roomFor(run).kind;
        act({
          type: "event",
          choice:
            kind === "rest"
              ? "rest"
              : kind === "question"
                ? "avoid"
                : kind === "puzzle"
                  ? "bell"
                  : "accept",
        });
      } else if (run.mode === "merchant")
        act({ type: "merchant", choice: "leave" });
      else throw new Error(`예상하지 않은 종료 상태: ${run.mode}`);
    }
    assert.ok(victories > 0, "승리한 전투 없음");
    assert.ok(!game.run && coverage.has("return"), "귀환 미완료");
    results.push({
      seed,
      passed: true,
      actions: count,
      coverage: [...coverage],
      trace,
    });
  } catch (error) {
    results.push({
      seed,
      passed: false,
      actions: count,
      coverage: [...coverage],
      error: error instanceof Error ? error.message : String(error),
      trace,
    });
  }
}
const passed = results.every((r) => r.passed);
const report = {
  createdAt: new Date().toISOString(),
  scope: "격리된 실제 게임 reducer 플레이. UI·음향·HTTP·계정 저장 미검증",
  passed,
  results,
};
await mkdir("storage/qa-bot", { recursive: true });
await writeFile("storage/qa-bot/latest.json", JSON.stringify(report, null, 2));
await writeFile(
  "storage/qa-bot/latest.md",
  `# QA 플레이 봇: ${passed ? "PASS" : "FAIL"}\n\n${report.scope}\n\n` +
    results
      .map(
        (r) =>
          `- seed ${r.seed}: ${r.passed ? "PASS" : "FAIL"} · ${r.actions}행동${r.error ? ` · ${r.error}` : ""}`,
      )
      .join("\n"),
);
console.log(
  `${passed ? "PASS" : "FAIL"}: ${results.filter((r) => r.passed).length}/${results.length} 시나리오. 결과: storage/qa-bot/latest.md`,
);
for (const r of results.filter((r) => !r.passed))
  console.error(`seed ${r.seed}: ${r.error}`);
if (!passed) process.exitCode = 1;
