import { storyQuests } from "./game";
import { progressAchievements } from "./progress-achievements";
export function achievementInfo(id: string) {
  const milestone = progressAchievements.find(item=>item.id===id);
  if (milestone) return {name:milestone.name,tier:milestone.tier};
  const base: Record<string, [string, string]> = {
    "first-return": ["첫 귀환", "브론즈"],
    "first-training": ["첫 훈련", "브론즈"],
    "first-treatment": ["생명의 불씨", "브론즈"],
    veteran: ["베테랑 동료", "실버"],
  };
  const quest = storyQuests.find(q => `quest-${q.id}` === id);
  const entry = base[id] || (quest ? [`${quest.title} 완료`, "골드"] : id.startsWith("ending-") ? [`${id.slice(7)} 엔딩`, "전설"] : ["탐사의 발자취", "브론즈"]);
  return { name: entry[0], tier: entry[1] };
}
