import { betterAuth } from "better-auth";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { db } from "./db-node";
function secret() {
  if (process.env.BETTER_AUTH_SECRET) return process.env.BETTER_AUTH_SECRET;
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  )
    throw new Error("운영 실행에는 BETTER_AUTH_SECRET이 필요합니다.");
  mkdirSync("storage", { recursive: true });
  const path = "storage/development-secret";
  if (!existsSync(path))
    writeFileSync(path, randomBytes(48).toString("base64url"), { mode: 0o600 });
  return readFileSync(path, "utf8");
}
export const auth = betterAuth({
  database: db,
  secret: secret(),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  session: { expiresIn: 60 * 60 * 24 * 7 },
  rateLimit: { enabled: true, window: 60, max: 50 },
  trustedOrigins: (
    process.env.TRUSTED_ORIGINS || "http://localhost:3000"
  ).split(","),
});
