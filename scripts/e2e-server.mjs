import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const port = process.env.TEST_PORT || "3100";
const databasePath = resolve(
  process.env.TEST_DATABASE_PATH || "storage/e2e.sqlite",
);
const env = {
  ...process.env,
  DATABASE_PATH: databasePath,
  BETTER_AUTH_URL: `http://localhost:${port}`,
  TRUSTED_ORIGINS: `http://localhost:${port}`,
  NEXT_TELEMETRY_DISABLED: "1",
};

mkdirSync(resolve("storage"), { recursive: true });
for (const suffix of ["", "-shm", "-wal"]) {
  rmSync(`${databasePath}${suffix}`, { force: true });
}

// Node's test worker preserves the Windows user shim before tsx initializes.
const migrate = spawn(
  process.execPath,
  [
    "--import",
    "./scripts/register-tsx.mjs",
    "--test",
    "scripts/migrate.ts",
  ],
  { cwd: process.cwd(), env, stdio: "inherit" },
);

migrate.once("exit", (code) => {
  if (code !== 0) process.exit(code || 1);
  const server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--hostname",
      "0.0.0.0",
      "--port",
      port,
    ],
    { cwd: process.cwd(), env, stdio: "inherit" },
  );
  const stop = () => server.kill();
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  server.once("exit", (serverCode) => process.exit(serverCode || 0));
});
