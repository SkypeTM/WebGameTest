import stories from "../data/companion_stories.json";
import type { Game } from "./game";

type CompanionStory = (typeof stories)[number];
type StoryAccess = Pick<Game, "roster" | "completedQuests" | "reputation">;
const storyIds = new Set(stories.map(story => story.id));

export function companionStoryById(id: unknown) {
  return typeof id === "string" ? stories.find(story => story.id === id) : undefined;
}

export function isCompanionStoryUnlocked(game: StoryAccess, story: CompanionStory) {
  return game.roster.some(member => member.id === story.hero)
    && (!story.quest || game.completedQuests.includes(story.quest))
    && (game.reputation[story.hero.slice(0, 2)] || 0) >= story.reputation;
}

/** Old saves start unread; only known, distinct chapter IDs survive normalization. */
export function normalizeCompletedCompanionStories(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === "string" && storyIds.has(id)))];
}
