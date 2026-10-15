import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { cardInfo, predictCard, roomFor } from "../lib/game.ts";

const base = process.env.QA_BASE_URL || "http://localhost:3000";
const live = new URL(base).hostname !== "localhost";
const accountPath = `storage/qa-${live ? "live" : "local"}-account.json`;
const password = "Test-only-Passphrase-472!";
const client = `qa-${randomUUID()}`;
const stopAtMerchant = process.argv.includes("--stop-at-merchant");
let account,
  cookie = "",
  state;
async function request(path, body) {
  const response = await fetch(base + path, {
    method: body ? "POST" : "GET",
    headers: {
      "content-type": "application/json",
      origin: base,
      cookie,
      "x-game-client": client,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  for (const value of response.headers.getSetCookie()) {
    const part = value.split(";")[0];
    cookie = [
      cookie
        .split("; ")
        .filter((x) => x && !x.startsWith(part.split("=")[0] + "="))
        .join("; "),
      part,
    ]
      .filter(Boolean)
      .join("; ");
  }
  const text = await response.text();
  assert.equal(
    response.status,
    200,
    `${path}: ${response.status} ${text.slice(0, 250)}`,
  );
  return JSON.parse(text);
}
if (process.argv.includes("--create")) {
  account = { email: `qa-${Date.now()}@example.com`, password, base };
  await request("/api/auth/sign-up/email", {
    email: account.email,
    password,
    name: "패치044 QA",
  });
  await writeFile(accountPath, JSON.stringify(account));
  console.log(`Created test-only account: ${account.email}`);
  process.exit(0);
}
account = JSON.parse(await readFile(accountPath, "utf8"));
await request("/api/auth/sign-in/email", account);
state = (await request("/api/game", { type: "claim" })).state;
async function act(action) {
  const payload = { requestId: randomUUID(), version: state.version, action };
  const result = await request("/api/game", payload);
  assert.equal(result.state.version, state.version + 1);
  state = result.state;
  return payload;
}
if (state.prologue?.stage !== "complete") {
  for (
    let i = Object.keys(state.prologue.profile.answers).length + 1;
    i <= 7;
    i++
  )
    await act({ type: "prologue", choice: "answer", id: `M${i}`, target: "A" });
  if (state.prologue.stage === "origin")
    await act({ type: "prologue", choice: "origin", id: "AR" });
  if (state.prologue.stage === "q00")
    await act({ type: "prologue", choice: "begin" });
}
if (!state.run) await act({ type: "enter", choice: "fortress" });
let battles = 0,
  actions = 0;
while (state.run && actions++ < 700) {
  const run = state.run;
  if (run.mode === "relic") {
    await act({ type: "chooseRelic", id: run.relicChoices[0] });
    continue;
  }
  if (run.mode === "battle") {
    const options = [];
    for (const card of run.battle.hand) {
      const info = cardInfo(card);
      const targets =
        info.target === "enemy"
          ? run.battle.enemies
              .filter((e) => e.hp > 0)
              .map((e) => (e.tower > 0 ? "M08:tower" : e.id))
          : run.heroes.filter((h) => h.hp > 0).map((h) => h.id);
      for (const target of targets) {
        const preview = predictCard(state, card.id, target);
        if (!preview.valid || !preview.target) continue;
        const t = preview.target;
        const damage = t.hpBefore - t.hpAfter;
        const heal = t.hpAfter - t.hpBefore;
        options.push({
          card,
          target,
          score:
            info.target === "enemy"
              ? 10 + damage
              : heal > 0
                ? heal * 2
                : Math.max(0, t.shieldAfter - t.shieldBefore) / 4,
        });
      }
    }
    options.sort((a, b) => b.score - a.score);
    if (options.length) {
      const choice = options[0];
      const payload = await act({
        type: "play",
        id: choice.card.id,
        target: choice.target,
      });
      if (actions === 2)
        assert.deepEqual(
          (await request("/api/game", payload)).state,
          state,
          "receipt replay",
        );
    } else await act({ type: "endTurn" });
  } else if (run.mode === "reward") {
    assert.ok(run.reward.materials.length > 0);
    battles++;
    await act({ type: "claim" });
  } else if (run.mode === "map") {
    const room = roomFor(run);
    if (
      room.kind === "rest" &&
      (run.cleared ||
        (battles && !process.argv.includes("--full") && !stopAtMerchant))
    ) {
      await act({ type: "return" });
      break;
    }
    const next = room.next;
    const destination =
      (stopAtMerchant
        ? next.find((id) => run.route[id].kind === "merchant")
        : undefined) ||
      (!battles
        ? next.find((id) => run.route[id].kind === "battle")
        : undefined) ||
      next.find((id) => run.route[id].kind === "rest") ||
      next.find((id) => run.route[id].kind === "battle") ||
      next[0];
    assert.ok(destination, `No route out of ${run.room}`);
    await act({ type: "move", id: destination });
  } else if (run.mode === "event") {
    const kind = roomFor(run).kind;
    await act({
      type: "event",
      choice:
        kind === "rest"
          ? "rest"
          : kind === "question"
            ? "investigate"
            : kind === "puzzle"
              ? "bell"
              : "accept",
    });
  } else if (run.mode === "merchant") {
    if (stopAtMerchant) break;
    const wounded = run.heroes.find((h) => h.hp > 0 && h.hp < h.maxHp);
    if (wounded && run.gold >= 20)
      await act({ type: "merchant", choice: "heal", id: wounded.id });
    await act({ type: "merchant", choice: "leave" });
  } else if (run.mode === "defeat") throw new Error("QA party was defeated");
  else throw new Error(`Unhandled QA mode ${run.mode}`);
}
if (stopAtMerchant) assert.equal(state.run?.mode, "merchant");
else assert.ok(!state.run, "return to hub");
assert.ok(battles > 0, "completed combat");
assert.deepEqual(
  (await request("/api/game")).state,
  state,
  "reload persistence",
);
await request("/api/auth/sign-out", {});
cookie = "";
await request("/api/auth/sign-in/email", account);
assert.deepEqual(
  (await request("/api/game")).state,
  state,
  "relogin persistence",
);
console.log(
  JSON.stringify({
    base,
    battles,
    actions,
    version: state.version,
    gold: state.gold,
    materials: state.materials,
    completedQuests: state.completedQuests,
    passed: true,
  }),
);
