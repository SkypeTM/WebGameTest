import { cloudDatabase, type D1Statement } from "./cloud";
import {
  initialGame,
  normalizeGame,
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

export async function getCampaign(account: string): Promise<Row> {
  const db = cloudDatabase();
  await db
    .prepare(
      "INSERT OR IGNORE INTO campaign(account_id,state,version,updated_at) VALUES(?,?,0,?)",
    )
    .bind(account, JSON.stringify(initialGame()), new Date().toISOString())
    .run();
  const row = await db
    .prepare("SELECT state,version,controller FROM campaign WHERE account_id=?")
    .bind(account)
    .first<Row>();
  if (!row) throw new RuleError("저장 상태를 불러오지 못했습니다.", 500);
  return {
    ...row,
    state: JSON.stringify(normalizeGame(JSON.parse(row.state) as Game)),
  };
}

export async function claimControl(account: string, controller: string) {
  const row = await getCampaign(account);
  await cloudDatabase()
    .prepare("UPDATE campaign SET controller=? WHERE account_id=?")
    .bind(controller, account)
    .run();
  return JSON.parse(row.state) as Game;
}

export async function getMarket(): Promise<MarketListing[]> {
  await expireListings(new Date());
  const found = await cloudDatabase()
    .prepare(
      "SELECT id,seller_account seller,item,quantity,price,status,expires_at expiresAt,CAST(price * 0.05 AS INTEGER) fee FROM market_listing WHERE status='open' AND expires_at > ? ORDER BY created_at DESC",
    )
    .bind(new Date().toISOString())
    .all<MarketListing>();
  return found.results;
}

export async function getMarketHistory(
  account: string,
): Promise<MarketHistory[]> {
  const found = await cloudDatabase()
    .prepare(
      "SELECT listing_id listingId,seller_account seller,buyer_account buyer,item,quantity,price,fee,status,created_at createdAt FROM market_history WHERE seller_account=? OR buyer_account=? ORDER BY created_at DESC LIMIT 50",
    )
    .bind(account, account)
    .all<MarketHistory>();
  return found.results;
}

async function expireListings(now: Date) {
  const db = cloudDatabase();
  const stamp = now.toISOString();
  const found = await db
    .prepare(
      "SELECT id,seller_account,item,quantity,price FROM market_listing WHERE status='open' AND expires_at <= ?",
    )
    .bind(stamp)
    .all<{
      id: string;
      seller_account: string;
      item: string;
      quantity: number;
      price: number;
    }>();
  for (const listing of found.results) {
    const row = await getCampaign(listing.seller_account);
    const game = JSON.parse(row.state) as Game;
    game.materials[listing.item] =
      (game.materials[listing.item] || 0) + listing.quantity;
    game.version++;
    await db.batch([
      saveCampaignStatement(listing.seller_account, row.version, game, stamp),
      db
        .prepare(
          "UPDATE market_listing SET status='cancelled',updated_at=? WHERE id=? AND status='open'",
        )
        .bind(stamp, listing.id),
      db
        .prepare(
          "INSERT INTO market_history(listing_id,seller_account,item,quantity,price,fee,status,created_at) VALUES(?,?,?,?,?,?,?,?)",
        )
        .bind(
          listing.id,
          listing.seller_account,
          listing.item,
          listing.quantity,
          listing.price,
          0,
          "expired",
          stamp,
        ),
    ]);
  }
}

export async function executeAction(
  account: string,
  controller: string,
  request: { requestId: string; version: number; action: Action },
) {
  const db = cloudDatabase();
  await expireListings(new Date());
  const row = await getCampaign(account);
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
  const receipt = await db
    .prepare(
      "SELECT payload,result FROM action_receipt WHERE account_id=? AND request_id=?",
    )
    .bind(account, request.requestId)
    .first<{ payload: string; result: string }>();
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
    return executeMarketAction(account, row, request, payload);
  }
  if (row.version !== request.version)
    throw new RuleError(
      "저장 상태가 변경되었습니다. 최신 상태를 불러오세요.",
      409,
    );
  const next = reduceGame(
    JSON.parse(row.state),
    action,
    crypto.getRandomValues(new Uint32Array(1))[0],
  );
  const now = new Date().toISOString();
  try {
    await db.batch([
      saveCampaignStatement(account, row.version, next, now),
      saveReceiptStatement(account, request.requestId, payload, next, now),
    ]);
  } catch (error) {
    const replay = await db
      .prepare(
        "SELECT payload,result FROM action_receipt WHERE account_id=? AND request_id=?",
      )
      .bind(account, request.requestId)
      .first<{ payload: string; result: string }>();
    if (replay?.payload === payload) return JSON.parse(replay.result) as Game;
    throw error;
  }
  return next;
}

async function executeMarketAction(
  account: string,
  row: Row,
  request: { requestId: string; version: number; action: Action },
  payload: string,
) {
  const db = cloudDatabase();
  const action = request.action;
  const now = new Date().toISOString();
  const game = JSON.parse(row.state) as Game;
  if (action.type === "marketList") {
    if (game.run) throw new RuleError("탐사 중에는 매물을 등록할 수 없습니다.");
    const { item, quantity, price } = action;
    if (
      typeof item !== "string" ||
      !item ||
      typeof quantity !== "number" ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      typeof price !== "number" ||
      !Number.isSafeInteger(price) ||
      price < 1
    )
      throw new RuleError("매물 정보가 올바르지 않습니다.");
    if ((game.materials[item] || 0) < quantity)
      throw new RuleError("보유한 재료보다 많이 등록할 수 없습니다.");
    game.materials[item] -= quantity;
    if (!game.materials[item]) delete game.materials[item];
    game.version++;
    const id = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 86400000).toISOString();
    await db.batch([
      db
        .prepare(
          "INSERT INTO market_listing(id,seller_account,item,quantity,price,buyer_account,status,created_at,expires_at,updated_at) VALUES(?,?,?,?,?,NULL,'open',?,?,?)",
        )
        .bind(id, account, item, quantity, price, now, expiresAt, now),
      saveCampaignStatement(account, row.version, game, now),
      saveReceiptStatement(account, request.requestId, payload, game, now),
    ]);
    return game;
  }
  if (action.type !== "marketBuy" && action.type !== "marketCancel")
    throw new RuleError("지원하지 않는 시장 행동입니다.");
  if (typeof action.id !== "string" || !action.id)
    throw new RuleError("매물 ID가 올바르지 않습니다.");
  const listing = await db
    .prepare(
      "SELECT id,seller_account,item,quantity,price FROM market_listing WHERE id=? AND status='open'",
    )
    .bind(action.id)
    .first<{
      id: string;
      seller_account: string;
      item: string;
      quantity: number;
      price: number;
    }>();
  if (!listing) throw new RuleError("열린 매물을 찾을 수 없습니다.");
  if (action.type === "marketCancel") {
    if (listing.seller_account !== account)
      throw new RuleError("본인의 매물만 취소할 수 있습니다.");
    if (game.run) throw new RuleError("탐사 중에는 매물을 취소할 수 없습니다.");
    game.materials[listing.item] =
      (game.materials[listing.item] || 0) + listing.quantity;
    game.version++;
    await db.batch([
      db
        .prepare(
          "UPDATE market_listing SET status='cancelled',updated_at=? WHERE id=?",
        )
        .bind(now, listing.id),
      db
        .prepare(
          "INSERT INTO market_history(listing_id,seller_account,item,quantity,price,fee,status,created_at) VALUES(?,?,?,?,?,?,?,?)",
        )
        .bind(
          listing.id,
          account,
          listing.item,
          listing.quantity,
          listing.price,
          0,
          "cancelled",
          now,
        ),
      saveCampaignStatement(account, row.version, game, now),
      saveReceiptStatement(account, request.requestId, payload, game, now),
    ]);
    return game;
  }
  if (listing.seller_account === account)
    throw new RuleError("자신의 매물은 구매할 수 없습니다.");
  if (game.gold < listing.price) throw new RuleError("은화가 부족합니다.");
  const sellerRow = await getCampaign(listing.seller_account);
  const seller = JSON.parse(sellerRow.state) as Game;
  const fee = Math.floor(listing.price * 0.05);
  game.gold -= listing.price;
  seller.gold += listing.price - fee;
  game.materials[listing.item] =
    (game.materials[listing.item] || 0) + listing.quantity;
  game.version++;
  seller.version++;
  await db.batch([
    db
      .prepare(
        "UPDATE market_listing SET status='sold',buyer_account=?,updated_at=? WHERE id=? AND status='open'",
      )
      .bind(account, now, listing.id),
    db
      .prepare(
        "INSERT INTO market_history(listing_id,seller_account,buyer_account,item,quantity,price,fee,status,created_at) VALUES(?,?,?,?,?,?,?,?,?)",
      )
      .bind(
        listing.id,
        listing.seller_account,
        account,
        listing.item,
        listing.quantity,
        listing.price,
        fee,
        "sold",
        now,
      ),
    saveCampaignStatement(
      listing.seller_account,
      sellerRow.version,
      seller,
      now,
    ),
    saveCampaignStatement(account, row.version, game, now),
    saveReceiptStatement(account, request.requestId, payload, game, now),
  ]);
  return game;
}

function saveCampaignStatement(
  account: string,
  expectedVersion: number,
  game: Game,
  now: string,
): D1Statement {
  return cloudDatabase()
    .prepare(
      "UPDATE campaign SET state=?,version=?,updated_at=? WHERE account_id=? AND version=?",
    )
    .bind(JSON.stringify(game), game.version, now, account, expectedVersion);
}

function saveReceiptStatement(
  account: string,
  requestId: string,
  payload: string,
  game: Game,
  now: string,
): D1Statement {
  return cloudDatabase()
    .prepare("INSERT INTO action_receipt VALUES(?,?,?,?,?)")
    .bind(account, requestId, payload, JSON.stringify(game), now);
}
