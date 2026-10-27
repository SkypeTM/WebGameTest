import characters from "../data/characters.json";

type Member = { id: string; level: number; promotion?: number; specialization?: string; combatWins?: number; bossWins?: number };
const chapters: Record<string, [string, string]> = {
  AR: ["Q02", "Q04"], VR: ["Q04", "Q06"], BC: ["Q06", "Q08"],
  BK: ["Q08", "Q10"], WS: ["Q10", "Q12"], DS: ["Q10", "Q12"],
  GO: ["Q12", "Q14"], EF: ["Q12", "Q14"],
};
const vows: Record<string, [string, string]> = {
  수호: ["방패를 맡을 자", "물러서지 않는 맹세"], 공격: ["첫 돌파의 증명", "길을 여는 일격"],
  지원: ["돌아올 길의 등불", "동료를 잇는 서약"], 제어: ["흐름을 읽는 눈", "전장을 묶는 의지"],
};
export function promotionStage(member: Member) { return Math.min(3, Math.max(1, 1 + (member.promotion || 0))); }
export function promotionQuest(member: Member, completed: string[]) {
  const character = characters.find(c => c.id === member.id);
  const stage = promotionStage(member);
  const next = stage === 1 ? 2 : 3;
  const quest = (chapters[member.id.slice(0, 2)] || chapters.AR)[next - 2];
  const level = next === 2 ? 5 : 10;
  const cost = next === 2 ? 80 : 180;
  const requirements = [
    { label: `Lv.${level} 달성`, met: member.level >= level },
    { label: `${quest} 이야기 완료`, met: completed.includes(quest) },
    { label: "자신의 전문화 선택", met: ["assault", "bulwark", "focus"].includes(member.specialization || "") },
    { label: `개인 생존 승리 ${member.combatWins || 0}/${next === 2 ? 3 : 8}`, met: (member.combatWins || 0) >= (next === 2 ? 3 : 8) },
    ...(next === 3 ? [{ label: `보스 생존 승리 ${member.bossWins || 0}/1`, met: (member.bossWins || 0) >= 1 }] : []),
  ];
  return { id: `${member.id}-promotion-${next}`, stage, next, quest, level, cost,
    title: `${character?.name || member.id} · ${(vows[character?.role || ""] || vows.공격)[next - 2]}`,
    requirements, complete: stage >= 3, eligible: stage < 3 && requirements.every(r => r.met) };
}
export function promotionBonus(member: Member) {
  const role = characters.find(c => c.id === member.id)?.role;
  const active = promotionStage(member) === 3;
  return { attack: active && role === "공격" ? 4 : 0,
    defense: active && role === "수호" ? 3 : 0,
    spell: active && (role === "지원" || role === "제어") ? 4 : 0 };
}
