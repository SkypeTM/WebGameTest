import { betterAuth } from "better-auth";
import { cloudEnv } from "./cloud";

export function getAuth(request?: Request) {
  const env = cloudEnv();
  const origin = request ? new URL(request.url).origin : undefined;
  const forwardedHost =
    request?.headers.get("x-forwarded-host") || request?.headers.get("host");
  const forwardedProtocol =
    request?.headers.get("x-forwarded-proto") ||
    (origin ? new URL(origin).protocol.slice(0, -1) : "https");
  const publicOrigin = forwardedHost
    ? `${forwardedProtocol}://${forwardedHost}`
    : origin;
  const baseURL =
    env.BETTER_AUTH_URL || publicOrigin || "http://localhost:3000";
  if (!env.BETTER_AUTH_SECRET)
    throw new Error("BETTER_AUTH_SECRET binding이 필요합니다.");
  return betterAuth({
    database: env.DB as never,
    secret: env.BETTER_AUTH_SECRET,
    baseURL,
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    session: { expiresIn: 60 * 60 * 24 * 7 },
    rateLimit: { enabled: true, window: 60, max: 50 },
    trustedOrigins: Array.from(
      new Set(
        [
          baseURL,
          ...(env.TRUSTED_ORIGINS || "").split(","),
          origin,
          publicOrigin,
        ].filter(Boolean),
      ),
    ) as string[],
  });
}
