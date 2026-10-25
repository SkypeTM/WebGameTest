import stories from "../data/companion_stories.json";
import type { Game } from "./game";
export function companionStories(game: Game, hero: string) {
  return stories.filter(s=>s.hero===hero).map(story=>{
    const unlocked = (!story.quest || game.completedQuests.includes(story.quest)) && (game.reputation[hero.slice(0,2)] || 0) >= story.reputation;
    return { id:story.id, title:story.title, unlocked, requirement:story.quest ? `${story.quest} 완료 · 팩션 우호도 ${story.reputation}` : "첫 만남", lines:unlocked ? story.lines : [] };
  });
}
