import stories from "../data/companion_stories.json";
import { storyQuests, type Game } from "./game";
import { isCompanionStoryUnlocked } from "./companion-story-progress";
export function companionStories(game: Game, hero: string) {
  return stories.filter(s=>s.hero===hero).map(story=>{
    const unlocked = isCompanionStoryUnlocked(game, story);
    const quest = storyQuests.find(q => q.id === story.quest);
    return { id:story.id, title:story.title, unlocked, completed:game.completedCompanionStories?.includes(story.id) ?? false, requirement:story.quest ? `「${quest?.title || story.quest}」 완료 · 팩션 우호도 ${story.reputation}` : "첫 만남", lines:unlocked ? story.lines : [] };
  });
}
