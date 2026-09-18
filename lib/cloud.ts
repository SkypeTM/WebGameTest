import { getCloudflareContext } from "@opennextjs/cloudflare";

export type D1Statement = {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{
    results: T[];
    success: boolean;
  }>;
  run(): Promise<{ success: boolean; meta: { changes?: number } }>;
};

export type D1DatabaseLike = {
  prepare(query: string): D1Statement;
  batch<T = unknown>(statements: D1Statement[]): Promise<T[]>;
};

export type CloudflareEnv = {
  DB: D1DatabaseLike;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL?: string;
  TRUSTED_ORIGINS?: string;
};

export function cloudEnv() {
  return getCloudflareContext().env as unknown as CloudflareEnv;
}

export function cloudDatabase() {
  const database = cloudEnv().DB;
  if (!database) throw new Error("Cloudflare D1 DB binding이 필요합니다.");
  return database;
}
