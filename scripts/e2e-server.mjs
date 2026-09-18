import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const port = process.env.TEST_PORT || "3100";
const databasePath = resolve(
  process.env.TEST_DATABASE_PATH || "storage/e2e.sqlite",
);
const env = {
  ...process.env,
  XDG_CONFIG_HOME: resolve(".wrangler-config"),
  DATABASE_PATH: databasePath,
  BETTER_AUTH_URL: `http://localhost:${port}`,
  TRUSTED_ORIGINS: `http://localhost:${port}`,
  NEXT_TELEMETRY_DISABLED: "1",
};

mkdirSync(resolve("storage"), { recursive: true });
rmSync(resolve(".wrangler/state"), { recursive: true, force: true });
for (const suffix of ["", "-shm", "-wal"]) {
  rmSync(`${databasePath}${suffix}`, { force: true });
}

// Keep the original SQLite store covered by unit tests; browser tests exercise
// the same local D1 binding used by the Cloudflare runtime.
const migrate = spawn(
  process.execPath,
  [
    "node_modules/wrangler/bin/wrangler.js",
    "d1",
    "migrations",
    "apply",
    "DB",
    "--local",
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
  const stop = () => {
    if (process.platform === "win32" && server.pid) {
      const killer = spawn(
        "taskkill",
        ["/pid", String(server.pid), "/T", "/F"],
        {
          stdio: "ignore",
        },
      );
      killer.once("exit", () => process.exit(0));
    } else server.kill();
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  server.once("exit", (serverCode) => process.exit(serverCode || 0));
});
