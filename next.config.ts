import type { NextConfig } from "next";
const config: NextConfig = {
  images: { unoptimized: true },
  devIndicators: false,
  outputFileTracingExcludes: {
    "/*": ["./storage/**/*", "./test-results/**/*", "./playwright-report/**/*"],
  },
};
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
export default async function nextConfig() {
  await initOpenNextCloudflareForDev();
  return config;
}
