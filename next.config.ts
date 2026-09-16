import type { NextConfig } from "next";
const config: NextConfig = {
  serverExternalPackages: ["better-auth"],
  devIndicators: false,
  outputFileTracingExcludes: {
    "/*": ["./storage/**/*", "./test-results/**/*", "./playwright-report/**/*"],
  },
};
export default config;
