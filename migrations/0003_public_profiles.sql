CREATE TABLE IF NOT EXISTS public_profiles (
  account_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  public_uid TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);
