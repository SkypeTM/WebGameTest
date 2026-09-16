import { randomBytes, randomUUID } from "node:crypto";
import { db, transaction } from "./db";
import {
  initialGame,
  reduceGame,
  RuleError,
  type Action,
  type Game,
} from "./game";
type Row = { state: string; version: number; controller: string | null };
export type MarketListing = {
  id: string;
  seller: string;
  item: string;
  quantity: number;
  price: number;
  status: "open" | "sold" | "cancelled";
  expiresAt: string;
  fee: number;
};
export type MarketHistory = {
  listingId: string;
  seller: string;
  buyer: string | null;
  item: string;
  quantity: number;
  price: number;
  fee: number;
  status: "sold" | "cancelled" | "expired";
  createdAt: string;
};
export function getCampaign(account: string): Row {
  db.prepare(
    "INSERT OR IGNORE INTO campaign(account_id,state,version,updated_at) VALUES(?,?,0,?)",
  ).run(account, JSON.stringify(initialGame()), new Date().toISOString());
  return db
    .prepare("SELECT state,version,controller FROM campaign WHERE account_id=?")
    .get(account) as unknown as Row;
}
export function claimControl(account: string, controller: string) {
  return transaction(() => {
    const row = getCampaign(account);
    db.prepare("UPDATE campaign SET controller=? WHERE account_id=?").run(
      controller,
      account,
    );
    return JSON.parse(row.state) as Game;
  });
}
export function getMarket(): MarketListing[] {
  expireListings(new Date());
  return db.prepare(
    "SELECT id,seller_account seller,item,quantity,price,status,expires_at expiresAt,CAST(price * 0.05 AS INTEGER) fee FROM market_listing WHERE status='open' AND expires_at > ? ORDER BY created_at DESC",
  ).all(new Date().toISOString()) as unknown as MarketListing[];
}
export function getMarketHistory(account: string): MarketHistory[] {
  return db.prepare(
    "SELECT listing_id listingId,seller_account seller,buyer_account buyer,item,quantity,price,fee,status,created_at createdAt FROM market_history WHERE seller_account=? OR buyer_account=? ORDER BY created_at DESC LIMIT 50",
  ).all(account, account) as unknown as MarketHistory[];
}
function expireListings(now: Date) {
  const stamp = now.toISOString();
  const rows = db.prepare("SELECT id,seller_account,item,quantity,price FROM market_listing WHERE status='open' AND expires_at <= ?").all(stamp) as { id: string; seller_account: string; item: string; quantity: number; price: number }[];
  for (const listing of rows) {
    const row = getCampaign(listing.seller_account);
    const game = JSON.parse(row.state) as Game;
    game.materials[listing.item] = (game.materials[listing.item] || 0) + listing.quantity;
    game.version++;
    saveCampaign(listing.seller_account, row.version, game, stamp);
    db.prepare("UPDATE market_listing SET status='cancelled',updated_at=? WHERE id=? AND status='open'").run(stamp, listing.id);
    db.prepare("INSERT INTO market_history(listing_id,seller_account,item,quantity,price,fee,status,created_at) VALUES(?,?,?,?,?,?,?,?)").run(listing.id, listing.seller_account, listing.item, listing.quantity, listing.price, 0, "expired", stamp);
  }
}
export function executeAction(
  account: string,
  controller: string,
  request: { requestId: string; version: number; action: Action },
) {
  return transaction(() => {
    expireListings(new Date());
    const row = getCampaign(account);
    if (row.controller !== controller)
      throw new RuleError(
        "다른 기기가 조작권을 가져갔습니다. 조작권을 다시 가져오세요.",
        423,
      );
    if (
      !/^[\w-]{12,100}$/.test(request.requestId || "") ||
      !Number.isSafeInteger(request.version)
    )
      throw new RuleError("잘못된 요청 형식입니다.");
    const payload = JSON.stringify({
      version: request.version,
      action: request.action,
    });
    const receipt = db
      .prepare(
        "SELECT payload,result FROM action_receipt WHERE account_id=? AND request_id=?",
      )
      .get(account, request.requestId) as
      { payload: string; result: string } | undefined;
    if (receipt) {
      if (receipt.payload !== payload)
        throw new RuleError(
          "동일 요청 ID를 다른 행동에 사용할 수 없습니다.",
          409,
        );
      return JSON.parse(receipt.result) as Game;
    }
    const action = request.action;
    if (["marketList", "marketBuy", "marketCancel"].includes(action.type)) {
      const now = new Date().toISOString();
      const game = JSON.parse(row.state) as Game;
      if (action.type === "marketList") {
        if (game.run) throw new RuleError("탐사 중에는 매물을 등록할 수 없습니다.");
        const item = action.item;
        const quantity = action.quantity;
        const price = action.price;
        if (typeof item !== "string" || !item || typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity < 1 || typeof price !== "number" || !Number.isSafeInteger(price) || price < 1)
          throw new RuleError("매물 정보가 올바르지 않습니다.");
        const listingItem = item;
        const listingQuantity = quantity as number;
        const listingPrice = price as number;
        if ((game.materials[listingItem] || 0) < listingQuantity) throw new RuleError("보유한 재료보다 많이 등록할 수 없습니다.");
        game.materials[listingItem] -= listingQuantity;
        if (!game.materials[listingItem]) delete game.materials[listingItem];
        game.version++;
        const id = randomUUID();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        db.prepare("INSERT INTO market_listing(id,seller_account,item,quantity,price,buyer_account,status,created_at,expires_at,updated_at) VALUES(?,?,?,?,?,NULL,'open',?,?,?)").run(id, account, listingItem, listingQuantity, listingPrice, now, expiresAt, now);
        saveCampaign(account, row.version, game, now);
        saveReceipt(account, request.requestId, payload, game, now);
        return game;
      }
      if (typeof action.id !== "string" || !action.id) throw new RuleError("매물 ID가 올바르지 않습니다.");
      const listing = db.prepare("SELECT * FROM market_listing WHERE id=? AND status='open'").get(action.id) as { id: string; seller_account: string; item: string; quantity: number; price: number } | undefined;
      if (!listing) throw new RuleError("열린 매물을 찾을 수 없습니다.");
      if (action.type === "marketCancel") {
        if (listing.seller_account !== account) throw new RuleError("본인의 매물만 취소할 수 있습니다.");
        if (game.run) throw new RuleError("탐사 중에는 매물을 취소할 수 없습니다.");
        game.materials[listing.item] = (game.materials[listing.item] || 0) + listing.quantity;
        game.version++;
        db.prepare("UPDATE market_listing SET status='cancelled',updated_at=? WHERE id=?").run(now, listing.id);
        db.prepare("INSERT INTO market_history(listing_id,seller_account,item,quantity,price,fee,status,created_at) VALUES(?,?,?,?,?,?,?,?)").run(listing.id, account, listing.item, listing.quantity, listing.price, 0, "cancelled", now);
        saveCampaign(account, row.version, game, now);
        saveReceipt(account, request.requestId, payload, game, now);
        return game;
      }
      if (listing.seller_account === account) throw new RuleError("자신의 매물은 구매할 수 없습니다.");
      if (game.gold < listing.price) throw new RuleError("은화가 부족합니다.");
      const sellerRow = getCampaign(listing.seller_account);
      const seller = JSON.parse(sellerRow.state) as Game;
      game.gold -= listing.price;
      const fee = Math.floor(listing.price * 0.05);
      seller.gold += listing.price - fee;
      game.materials[listing.item] = (game.materials[listing.item] || 0) + listing.quantity;
      game.version++;
      seller.version++;
      db.prepare("UPDATE market_listing SET status='sold',buyer_account=?,updated_at=? WHERE id=?").run(account, now, listing.id);
      db.prepare("INSERT INTO market_history(listing_id,seller_account,buyer_account,item,quantity,price,fee,status,created_at) VALUES(?,?,?,?,?,?,?,?,?)").run(listing.id, listing.seller_account, account, listing.item, listing.quantity, listing.price, fee, "sold", now);
      saveCampaign(listing.seller_account, sellerRow.version, seller, now);
      saveCampaign(account, row.version, game, now);
      saveReceipt(account, request.requestId, payload, game, now);
      return game;
    }
    if (row.version !== request.version)
      throw new RuleError(
        "저장 상태가 변경되었습니다. 최신 상태를 불러오세요.",
        409,
      );
    const next = reduceGame(
      JSON.parse(row.state),
      request.action,
      randomBytes(4).readUInt32LE(),
    );
    const result = JSON.stringify(next);
    db.prepare(
      "UPDATE campaign SET state=?,version=?,updated_at=? WHERE account_id=? AND version=?",
    ).run(result, next.version, new Date().toISOString(), account, row.version);
    db.prepare("INSERT INTO action_receipt VALUES(?,?,?,?,?)").run(
      account,
      request.requestId,
      payload,
      result,
      new Date().toISOString(),
    );
    return next;
  });
}
function saveCampaign(account: string, expectedVersion: number, game: Game, now: string) {
  db.prepare(
    "UPDATE campaign SET state=?,version=?,updated_at=? WHERE account_id=? AND version=?",
  ).run(JSON.stringify(game), game.version, now, account, expectedVersion);
}
function saveReceipt(account: string, requestId: string, payload: string, game: Game, now: string) {
  db.prepare("INSERT INTO action_receipt VALUES(?,?,?,?,?)").run(
    account,
    requestId,
    payload,
    JSON.stringify(game),
    now,
  );
}
