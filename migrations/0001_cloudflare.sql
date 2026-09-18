CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" INTEGER NOT NULL,
  "image" TEXT,
  "createdAt" INTEGER NOT NULL,
  "updatedAt" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "expiresAt" INTEGER NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" INTEGER NOT NULL,
  "updatedAt" INTEGER NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("userId");
CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" INTEGER,
  "refreshTokenExpiresAt" INTEGER,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" INTEGER NOT NULL,
  "updatedAt" INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("userId");
CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" INTEGER NOT NULL,
  "createdAt" INTEGER NOT NULL,
  "updatedAt" INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification"("identifier");
CREATE TABLE IF NOT EXISTS campaign (
  account_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  controller TEXT,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS action_receipt (
  account_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY(account_id, request_id)
);
CREATE TABLE IF NOT EXISTS market_listing (
  id TEXT PRIMARY KEY,
  seller_account TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  price INTEGER NOT NULL CHECK(price > 0),
  buyer_account TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK(status IN ('open', 'sold', 'cancelled')),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS market_listing_status_expires_idx ON market_listing(status, expires_at);
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
