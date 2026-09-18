import type { NextConfig } from "next";
const config: NextConfig = {
  images: { unoptimized: true },
  devIndicators: false,
  outputFileTracingExcludes: {
    "/*": ["./storage/**/*", "./test-results/**/*", "./playwright-report/**/*"],
  },
};
export default config;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
