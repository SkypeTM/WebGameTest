import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 240000,
  expect: { timeout: 20000 },
  workers: 1,
  webServer: {
    command: process.env.TEST_SERVER_COMMAND || "pnpm test:server",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 120000,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: process.env.TEST_URL || "http://localhost:3100",
    channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
