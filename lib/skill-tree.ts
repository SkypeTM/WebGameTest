/** Shared growth definitions. Keep independent of game.ts to avoid import cycles. */
export type SpecializationId = "assault" | "bulwark" | "focus";
export type MasteryId =
  | "assault-power"
  | "assault-precision"
  | "bulwark-fortress"
  | "bulwark-reprisal"
  | "focus-mastery"
  | "focus-composure";

export type SkillBonuses = Readonly<{
  attack: number;
  defense: number;
  spell: number;
  /** Additive percentage points, matching heroStats.crit. */
  crit: number;
}>;

export type SpecializationDefinition = Readonly<{
  id: SpecializationId;
  name: string;
  minLevel: number;
  bonuses: SkillBonuses;
  description: string;
}>;

export type MasteryDefinition = Readonly<{
  id: MasteryId;
  name: string;
  parent: SpecializationId;
  minLevel: number;
  bonuses: SkillBonuses;
  description: string;
}>;

/** Accept strings so normalization can safely inspect old or invalid saves. */
export type SkillTreeMember = {
  id?: string;
  level: number;
  specialization?: string;
  mastery?: string;
};

const noBonuses: SkillBonuses = { attack: 0, defense: 0, spell: 0, crit: 0 };

export const specializations: readonly SpecializationDefinition[] = [
  { id: "assault", name: "맹공", minLevel: 3, bonuses: { ...noBonuses, attack: 3 }, description: "공격에 힘을 싣는 전문화" },
  { id: "bulwark", name: "수비", minLevel: 3, bonuses: { ...noBonuses, defense: 2 }, description: "방어를 단단히 다지는 전문화" },
  { id: "focus", name: "집중", minLevel: 3, bonuses: { ...noBonuses, spell: 3 }, description: "주문의 힘을 높이는 전문화" },
];

export const masteries: readonly MasteryDefinition[] = [
  { id: "assault-power", name: "강타", parent: "assault", minLevel: 7, bonuses: { ...noBonuses, attack: 2 }, description: "공격력을 더 높입니다." },
  { id: "assault-precision", name: "정밀", parent: "assault", minLevel: 7, bonuses: { ...noBonuses, crit: 4 }, description: "치명타 확률을 더 높입니다." },
  { id: "bulwark-fortress", name: "철벽", parent: "bulwark", minLevel: 7, bonuses: { ...noBonuses, defense: 2 }, description: "방어력을 더 높입니다." },
  { id: "bulwark-reprisal", name: "반격 준비", parent: "bulwark", minLevel: 7, bonuses: { ...noBonuses, attack: 1, defense: 1 }, description: "공격과 방어를 함께 높입니다." },
  { id: "focus-mastery", name: "주문 숙련", parent: "focus", minLevel: 7, bonuses: { ...noBonuses, spell: 2 }, description: "주문력을 더 높입니다." },
  { id: "focus-composure", name: "안정", parent: "focus", minLevel: 7, bonuses: { ...noBonuses, spell: 1, defense: 1 }, description: "주문과 방어를 함께 높입니다." },
];

export function getSpecialization(id: unknown): SpecializationDefinition | undefined {
  return typeof id === "string" ? specializations.find(branch => branch.id === id) : undefined;
}

export function getMastery(id: unknown): MasteryDefinition | undefined {
  return typeof id === "string" ? masteries.find(node => node.id === id) : undefined;
}

/** A stored choice cannot grant a bonus without its level and parent specialization. */
export function activeMastery(member: SkillTreeMember): MasteryDefinition | undefined {
  const mastery = getMastery(member.mastery);
  if (!mastery || !Number.isFinite(member.level) || member.level < mastery.minLevel || member.specialization !== mastery.parent) return undefined;
  return mastery;
}

/** Only mastery bonuses: existing specialization and promotion bonuses stay separate. */
export function masteryBonus(member: SkillTreeMember): SkillBonuses {
  return { ...(activeMastery(member)?.bonuses || noBonuses) };
}

export function formatSkillBonuses(bonuses: SkillBonuses): string {
  return [
    bonuses.attack ? `공격 +${bonuses.attack}` : "",
    bonuses.defense ? `방어 +${bonuses.defense}` : "",
    bonuses.spell ? `주문 +${bonuses.spell}` : "",
    bonuses.crit ? `치명타 +${bonuses.crit}%p` : "",
  ].filter(Boolean).join(" · ");
}
