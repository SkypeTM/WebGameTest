import type { D1DatabaseLike } from "./cloud";
export async function ensurePublicUid(db: D1DatabaseLike, account: string, createUid = () => `SB-${crypto.randomUUID().replaceAll("-", "").toUpperCase()}`) {
  const read = async () => (await db.prepare("SELECT public_uid FROM public_profiles WHERE account_id=?").bind(account).first<{public_uid:string}>())?.public_uid;
  const existing = await read();
  if (existing) return existing;
  for (let attempt=0;attempt<3;attempt++) {
    await db.prepare("INSERT OR IGNORE INTO public_profiles(account_id,public_uid,created_at) VALUES(?,?,?)").bind(account,createUid(),new Date().toISOString()).run();
    const saved = await read();
    if (saved) return saved;
  }
  throw new Error("공개 UID 발급 실패");
}
