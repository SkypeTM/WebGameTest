import { defineConfig } from "@playwright/test";
const testUrl = process.env.TEST_URL || "http://localhost:3100";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 240000,
  expect: { timeout: 20000 },
  workers: 1,
  webServer: {
    command: process.env.TEST_SERVER_COMMAND || "pnpm test:server",
    url: testUrl,
    reuseExistingServer: process.env.TEST_REUSE_SERVER === "1",
    timeout: 120000,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: testUrl,
    channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
