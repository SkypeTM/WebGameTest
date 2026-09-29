import type { Game } from "./game";
export const regionNeighbors: Record<string, string[]> = {
  fortress: ["harbor", "archive"],
  harbor: ["fortress", "archive", "laboratory"],
  archive: ["fortress", "chapel", "observatory"],
  chapel: ["archive", "laboratory"],
  laboratory: ["harbor", "chapel", "observatory"],
  observatory: ["archive", "laboratory"],
};
export const regionFactions: Record<string, string[]> = {
  fortress: ["AR", "EF"],
  harbor: ["VR"],
  archive: ["BC", "BK"],
  chapel: ["WS"],
  laboratory: ["DS"],
  observatory: ["GO"],
  palace: ["AR", "VR", "BC", "BK", "WS", "DS", "GO", "EF"],
};
export const testimonyIds = ["Q02", "Q06", "Q08", "Q12"];
export const policies = {
  accountable: "책임 있는 공동 명령",
  open: "모두에게 열린 기록",
  care: "피해자와 기억의 보호",
  distributed: "권한의 분산",
};
export type Policy = keyof typeof policies;
export const endingPolicies: Record<string, Policy> = {
  kingdom: "accountable",
  republic: "open",
  union: "care",
  liberation: "distributed",
};
export const endingTexts: Record<string, string> = {
  kingdom:
    "봉화의 명령에는 이제 이름이 붙는다. 왕국은 네 증언을 공개 재판에 맡기고, 구조 명령을 거부한 책임을 심판한다. 탐사대는 새 수문의 첫 교대를 지켜본다.",
  republic:
    "항구의 장부와 서고의 원본이 같은 광장에 놓인다. 누구나 계약을 읽고 이의를 제기할 수 있다. 돌아오지 않은 배의 비용은 마침내 계약을 승인했던 사람들에게 돌아간다.",
  union:
    "멈춘 장치의 기억은 소유물이 아니라 증언으로 보관된다. 치료사와 기록관은 이름을 지우지 않고 고통을 돌보는 법을 함께 배운다. 종 아래에는 돌아올 자리가 남는다.",
  liberation:
    "왕좌의 열쇠는 여러 마을에 나뉘어 보관된다. 누구도 혼자 종을 울릴 수 없다. 피난로는 국경을 잇는 귀환로가 되고, 탐사대는 새로운 길의 첫 표식을 세운다.",
};
export function endingEligible(g: Game, id: string) {
  return (
    !g.originFaction ||
    (testimonyIds.every((q) => g.completedQuests.includes(q)) &&
      Object.values(g.testimonyChoices || {}).includes(endingPolicies[id]))
  );
}
const friendly = [
    ["AR", "WS"],
    ["VR", "EF"],
    ["BC", "GO"],
    ["BK", "DS"],
  ],
  opposed = [
    ["AR", "VR"],
    ["BC", "BK"],
    ["WS", "DS"],
    ["GO", "EF"],
  ];
export function recruitment(g: Game, id: string) {
  const faction = id.slice(0, 2),
    origin = g.originFaction || "AR",
    trust = g.characterTrust?.[id] || 0,
    member = g.roster.some((h) => h.id === id),
    guest = g.guestIds?.includes(id);
  if (member && !guest) return { mode: "owned", reason: "정식 동료", trust };
  if (guest)
    return {
      mode: trust >= 20 ? "recruit" : "locked",
      reason:
        trust >= 20
          ? "정식 합류 가능"
          : `객원 · 개인 신뢰 ${trust}/20 · 함께 탐사`,
      trust,
    };
  if (!g.originFaction)
    return { mode: "recruit", reason: "기존 회차 영입", trust };
  if (faction === origin)
    return { mode: "recruit", reason: "동일 팩션", trust };
  if (opposed.some((p) => p.includes(origin) && p.includes(faction)))
    return {
      mode: trust >= 40 || g.echoMemories?.includes(id) ? "recruit" : "locked",
      reason:
        trust >= 40
          ? "개인 신뢰로 합류"
          : g.echoMemories?.includes(id)
            ? "인연의 잔향"
            : `경계 중 · 개인 신뢰 ${trust}/40 (해당 지역 조사로 증가)`,
      trust,
    };
  if (friendly.some((p) => p.includes(origin) && p.includes(faction)))
    return {
      mode: (g.reputation[faction] || 0) >= 20 ? "recruit" : "locked",
      reason: `우호 팩션 · 우호도 ${g.reputation[faction] || 0}/20`,
      trust,
    };
  return {
    mode: "guest",
    reason: "객원 합류 → 함께 탐사 → 신뢰 20 → 정식 동료",
    trust,
  };
}
export const originBenefits: Record<
  string,
  {
    label: string;
    shield?: number;
    mana?: number;
    mark?: number;
    heal?: number;
    gold?: number;
  }
> = {
  AR: { label: "왕국의 호위: 전투 시작 보호막 +4", shield: 4 },
  VR: { label: "항로 계약: 승리 은화 +5", gold: 5 },
  BC: { label: "약점 색인: 전투 시작 첫 적 표적 +2", mark: 2 },
  BK: { label: "기습 증언: 첫 적 표적 +3", mark: 3 },
  WS: { label: "성가의 위로: 전투 시작 생존 동료 체력 +3", heal: 3 },
  DS: { label: "기억 축전: 전투 시작 마나 +1", mana: 1 },
  GO: { label: "관측자의 준비: 보호막 +2, 첫 적 표적 +1", shield: 2, mark: 1 },
  EF: {
    label: "구조 신호: 전투 시작 생존 동료 체력 +2, 보호막 +1",
    heal: 2,
    shield: 1,
  },
};
export function partyBondKey(ids: string[]) {
  return [...new Set(ids.map((id) => id.slice(0, 2)))].sort().join("-");
}
