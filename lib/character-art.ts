import manifest from "../data/character_cartoon_manifest.json";

/** Reviewed base illustration only; never substitute this for an animated pose. */
export function characterBaseArt(id: string) {
  return manifest.assets.find(entry => entry.id === id && entry.runtimeApplied)?.path;
}
