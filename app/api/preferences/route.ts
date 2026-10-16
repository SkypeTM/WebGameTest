import { getAuth } from "../../../lib/auth";
import { cloudDatabase } from "../../../lib/cloud";
import {
  defaultAudioPreferences,
  parseAudioPatch,
} from "../../../lib/audio-preferences";
export const dynamic = "force-dynamic";
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
async function read(account: string) {
  const row = await cloudDatabase()
    .prepare("SELECT audio FROM account_preferences WHERE account_id=?")
    .bind(account)
    .first<{ audio: string }>();
  return {
    audio: {
      ...defaultAudioPreferences,
      ...(row ? JSON.parse(row.audio) : {}),
    },
    initialized: Boolean(row),
  };
}
export async function GET(req: Request) {
  const session = await getAuth(req).api.getSession({ headers: req.headers });
  if (!session) return json({ error: "로그인이 필요합니다." }, 401);
  return json(await read(session.user.id));
}
export async function PATCH(req: Request) {
  // Same-origin, authenticated account only; no client-supplied account ID or game-control takeover.
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return json({ error: "허용되지 않은 출처입니다." }, 403);
  const session = await getAuth(req).api.getSession({ headers: req.headers });
  if (!session) return json({ error: "로그인이 필요합니다." }, 401);
  const text = await req.text();
  if (text.length > 1024)
    return json({ error: "설정 요청이 너무 큽니다." }, 413);
  let patch;
  try {
    patch = parseAudioPatch(JSON.parse(text));
  } catch {
    return json({ error: "오디오 설정 형식이 올바르지 않습니다." }, 400);
  }
  // Atomic field merge preserves independent settings edited from another device.
  await cloudDatabase()
    .prepare(
      "INSERT INTO account_preferences(account_id,audio,updated_at) VALUES(?,?,?) ON CONFLICT(account_id) DO UPDATE SET audio=json_patch(account_preferences.audio,excluded.audio),updated_at=excluded.updated_at",
    )
    .bind(session.user.id, JSON.stringify(patch), new Date().toISOString())
    .run();
  return json(await read(session.user.id));
}
