CREATE TABLE IF NOT EXISTS account_preferences (
  account_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  audio TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL
);
