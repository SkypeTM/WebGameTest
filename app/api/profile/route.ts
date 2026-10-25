import { getAuth } from "../../../lib/auth";
import { cloudDatabase } from "../../../lib/cloud";
import { ensurePublicUid } from "../../../lib/public-profile";
export const dynamic = "force-dynamic";
export async function GET(req:Request) {
  const headers={"Cache-Control":"no-store"};
  try {
    const session=await getAuth(req).api.getSession({headers:req.headers});
    if(!session) return Response.json({error:"로그인이 필요합니다."},{status:401,headers});
    const uid=await ensurePublicUid(cloudDatabase(),session.user.id);
    return Response.json({uid},{headers});
  } catch {
    return Response.json({error:"공개 UID를 불러오지 못했습니다. 잠시 후 다시 시도하세요."},{status:503,headers});
  }
}
