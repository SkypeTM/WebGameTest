import { auth } from "../../../lib/auth";
import { getCampaign, getMarket, getMarketHistory, claimControl, executeAction } from "../../../lib/store";
import { RuleError } from "../../../lib/game";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function response(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
async function session(req: Request) {
  const s = await auth.api.getSession({ headers: req.headers });
  if (!s) throw new RuleError("로그인이 필요합니다.", 401);
  const client = req.headers.get("x-game-client");
  if (!client || !/^[\w-]{12,100}$/.test(client))
    throw new RuleError("기기 ID가 올바르지 않습니다.");
  return {
    account: s.user.id,
    controller: `${s.session.id}:${client}`,
    name: s.user.name,
  };
}
export async function GET(req: Request) {
  try {
    const s = await session(req),
      row = getCampaign(s.account);
    return response({
      state: JSON.parse(row.state),
      control: row.controller === s.controller,
      name: s.name,
      account: s.account,
      market: getMarket(),
      marketHistory: getMarketHistory(s.account),
    });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");
    const allowed = (
      process.env.TRUSTED_ORIGINS || "http://localhost:3000"
    ).split(",");
    if (!origin || !allowed.includes(origin))
      throw new RuleError("허용되지 않은 출처입니다.", 403);
    if (Number(req.headers.get("content-length") || 0) > 12000)
      throw new RuleError("요청이 너무 큽니다.", 413);
    const s = await session(req);
    const body = await req.json();
    if (body.type === "claim")
      return response({
        state: claimControl(s.account, s.controller),
        control: true,
        name: s.name,
        account: s.account,
        market: getMarket(),
        marketHistory: getMarketHistory(s.account),
      });
    if (!body.action || typeof body.action.type !== "string")
      throw new RuleError("행동을 지정하세요.");
    return response({
      state: executeAction(s.account, s.controller, body),
      control: true,
      name: s.name,
      account: s.account,
      market: getMarket(),
      marketHistory: getMarketHistory(s.account),
    });
  } catch (e) {
    return fail(e);
  }
}
function fail(e: unknown) {
  if (e instanceof RuleError) return response({ error: e.message }, e.status);
  console.error(e);
  return response(
    { error: "서버 처리에 실패했습니다. 마지막 저장 상태를 다시 불러오세요." },
    500,
  );
}
