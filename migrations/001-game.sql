CREATE TABLE IF NOT EXISTS campaign (
 account_id TEXT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE,
 state TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 0,
 controller TEXT, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS action_receipt (
 account_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL, payload TEXT NOT NULL, result TEXT NOT NULL,
 created_at TEXT NOT NULL, PRIMARY KEY(account_id, request_id)
);
CREATE TABLE IF NOT EXISTS market_listing (
 id TEXT PRIMARY KEY,
 seller_account TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
 item TEXT NOT NULL,
 quantity INTEGER NOT NULL CHECK(quantity > 0),
 price INTEGER NOT NULL CHECK(price > 0),
 buyer_account TEXT REFERENCES user(id) ON DELETE SET NULL,
 status TEXT NOT NULL CHECK(status IN ('open', 'sold', 'cancelled')),
 created_at TEXT NOT NULL,
 expires_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS market_history (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 listing_id TEXT NOT NULL,
 seller_account TEXT NOT NULL,
 buyer_account TEXT,
 item TEXT NOT NULL,
 quantity INTEGER NOT NULL,
 price INTEGER NOT NULL,
 fee INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL CHECK(status IN ('sold', 'cancelled', 'expired')),
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS game_migration (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
INSERT OR IGNORE INTO game_migration VALUES(1, datetime('now'));
