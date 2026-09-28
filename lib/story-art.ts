import assets from "../data/story_art_manifest.json";
import characterAssets from "../data/character_asset_manifest.json";
export type DialoguePose = "neutral" | "explain" | "resolve";
type ArtEntry = { key: string; path: string };
export function storyArt(key: string) {
  return (assets as ArtEntry[]).find((a) => a.key === key)?.path;
}
export function dialogueArt(id: string, pose: DialoguePose, npc = false) {
  return (
    storyArt(`${npc ? "npc" : "hero"}-${id}-${pose}`) ||
    storyArt(`${npc ? "npc" : "hero"}-${id}-neutral`) ||
    (!npc
      ? characterAssets.find((a) => a.id === id && a.state === "dialogue")?.path
      : undefined)
  );
}
