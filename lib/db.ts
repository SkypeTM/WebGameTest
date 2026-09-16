import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
const path = resolve(
  /* turbopackIgnore: true */ process.env.DATABASE_PATH ||
    "storage/game.sqlite",
);
mkdirSync(dirname(path), { recursive: true });
const globalDB = globalThis as unknown as { gameDB?: DatabaseSync };
export const db = globalDB.gameDB ?? new DatabaseSync(path);
globalDB.gameDB = db;
db.exec(
  "PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;",
);
export function migrateGame() {
  db.exec(readFileSync(resolve("migrations/001-game.sql"), "utf8"));
  try {
    db.exec("ALTER TABLE market_listing ADD COLUMN expires_at TEXT NOT NULL DEFAULT ''");
  } catch {
    // Existing databases already have the compatibility column.
  }
  db.exec("UPDATE market_listing SET expires_at=created_at WHERE expires_at=''");
}
export function transaction<T>(fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
