import { storyArt } from "./story-art";
import environments from "../data/environment_manifest.json";
import preparationArt from "../data/region_preparation_art_v4.json";
export function preparationSceneAsset(region: string) {
  return preparationArt.assets.find(asset => asset.id === region)?.path || sceneAsset(region);
}
export function sceneAsset(region = "fortress") {
  const custom = storyArt(`environment-${region}`);
  if (custom) return custom;
  if (region === "hamlet") return "/assets/environments/last-refuge-hamlet.png";
  const key =
    (
      {
        laboratory: "archive",
        observatory: "tower",
        palace: "fortress",
      } as Record<string, string>
    )[region] || region;
  return environments.find((a) => a.id === key)?.path || environments[0].path;
}
