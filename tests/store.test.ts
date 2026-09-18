import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
process.env.DATABASE_PATH = join(
  mkdtempSync(join(tmpdir(), "bell-store-")),
  "test.sqlite",
);
const { db, migrateGame } = await import("../lib/db-node");
const { initialGame } = await import("../lib/game");
db.exec(
  "CREATE TABLE user(id TEXT PRIMARY KEY); INSERT INTO user VALUES ('a'),('b');",
);
migrateGame();
const { claimControl, executeAction, getCampaign, getMarket, getMarketHistory } =
  await import("../lib/store-node");
test("atomic receipt replay, conflicting replay, concurrent versions and device control", () => {
  claimControl("a", "device-one");
  const request = {
    requestId: "request-000000001",
    version: 0,
    action: { type: "enter" },
  };
  const first = executeAction("a", "device-one", request);
  assert.deepEqual(executeAction("a", "device-one", request), first);
  assert.equal(getCampaign("a").version, 1);
  assert.throws(() =>
    executeAction("a", "device-one", {
      ...request,
      action: { type: "return" },
    }),
  );
  assert.throws(() =>
    executeAction("a", "device-one", {
      ...request,
      requestId: "request-000000002",
    }),
  );
  claimControl("a", "device-two");
  assert.throws(() =>
    executeAction("a", "device-one", {
      requestId: "request-000000003",
      version: 1,
      action: { type: "move", id: "l1-battle" },
    }),
  );
  const next = executeAction("a", "device-two", {
    requestId: "request-000000003",
    version: 1,
    action: { type: "move", id: "l1-battle" },
  });
  assert.equal(next.run!.mode, "battle");
  assert.deepEqual(JSON.parse(getCampaign("a").state), next);
  assert.equal(getCampaign("b").version, 0);
});
test("failed actions rollback state and receipts", () => {
  const before = getCampaign("a");
  assert.throws(() =>
    executeAction("a", "device-two", {
      requestId: "request-invalid0001",
      version: before.version,
      action: { type: "play", id: "forged", target: "M01" },
    }),
  );
  assert.deepEqual(getCampaign("a"), before);
  assert.equal(
    (
      db
        .prepare("SELECT count(*) n FROM action_receipt WHERE request_id=?")
        .get("request-invalid0001") as { n: number }
    ).n,
    0,
  );
});
test("same card retransmission consumes energy and applies damage only once", async () => {
  const { cardInfo } = await import("../lib/game");
  const row = getCampaign("a");
  const game = JSON.parse(row.state);
  const card = game.run.battle.hand.find(
    (c: Parameters<typeof cardInfo>[0]) => cardInfo(c).target === "enemy",
  );
  const request = {
    requestId: "request-card-replay",
    version: row.version,
    action: { type: "play", id: card.id, target: "M01" },
  };
  const first = executeAction("a", "device-two", request);
  assert.deepEqual(executeAction("a", "device-two", request), first);
  assert.equal(first.run!.battle!.energy, 4 - cardInfo(card).cost);
  assert.deepEqual(JSON.parse(getCampaign("a").state), first);
});
test("market listing and purchase atomically transfer materials and silver", () => {
  const sellerBefore = getCampaign("a");
  const seller = initialGame();
  seller.materials["왕관 파편"] = 2;
  db.prepare("UPDATE campaign SET state=? WHERE account_id=?").run(JSON.stringify(seller), "a");
  const buyerBefore = getCampaign("b");
  const buyer = JSON.parse(buyerBefore.state);
  buyer.gold = 150;
  db.prepare("UPDATE campaign SET state=? WHERE account_id=?").run(JSON.stringify(buyer), "b");
  claimControl("b", "device-b");
  const listed = executeAction("a", "device-two", {
    requestId: "market-list-000001",
    version: sellerBefore.version,
    action: { type: "marketList", item: "왕관 파편", quantity: 2, price: 40 },
  });
  const listing = getMarket()[0];
  assert.equal(listing.quantity, 2);
  const bought = executeAction("b", "device-b", {
    requestId: "market-buy-000001",
    version: buyerBefore.version,
    action: { type: "marketBuy", id: listing.id },
  });
  assert.equal(bought.materials["왕관 파편"], 2);
  assert.equal(bought.gold, 110);
  assert.equal(JSON.parse(getCampaign("a").state).gold, seller.gold + 38);
  assert.equal(getMarket().length, 0);
  assert.deepEqual(
    executeAction("b", "device-b", {
      requestId: "market-buy-000001",
      version: buyerBefore.version,
      action: { type: "marketBuy", id: listing.id },
    }),
    bought,
  );
  void listed;
});
test("expired market listings return materials and create history", () => {
  const row = getCampaign("a");
  const game = JSON.parse(row.state);
  game.materials["만료 재료"] = 1;
  db.prepare("UPDATE campaign SET state=? WHERE account_id=?").run(JSON.stringify(game), "a");
  const listed = executeAction("a", "device-two", {
    requestId: "market-expire-0001",
    version: row.version,
    action: { type: "marketList", item: "만료 재료", quantity: 1, price: 10 },
  });
  const listing = db.prepare("SELECT id FROM market_listing WHERE item=? ORDER BY created_at DESC LIMIT 1").get("만료 재료") as { id: string };
  db.prepare("UPDATE market_listing SET expires_at=? WHERE id=?").run("2000-01-01T00:00:00.000Z", listing.id);
  assert.equal(getMarket().some((item: { id: string }) => item.id === listing.id), false);
  assert.equal(JSON.parse(getCampaign("a").state).materials["만료 재료"], 1);
  assert.ok(getMarketHistory("a").some((item: { item: string; status: string }) => item.item === "만료 재료" && item.status === "expired"));
  void listed;
});
test("state persists in a separately reopened SQLite connection", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const second = new DatabaseSync(process.env.DATABASE_PATH!);
  const saved = second
    .prepare("SELECT state FROM campaign WHERE account_id=?")
    .get("a") as { state: string };
  assert.equal(saved.state, getCampaign("a").state);
  second.close();
});
