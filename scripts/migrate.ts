import { getMigrations } from "better-auth/db/migration";
import { auth } from "../lib/auth-node";
import { migrateGame } from "../lib/db-node";
const { runMigrations } = await getMigrations(auth.options);
await runMigrations();
migrateGame();
console.log(
  "인증 + 게임 DB 마이그레이션 완료. 새 계정은 첫 접속에 기본 파티로 시드됩니다.",
);
process.exit(0);
