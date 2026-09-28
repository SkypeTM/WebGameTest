import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);
// Preserve generated basic-card art when rebuilding the older skill-card set.
const manifest = JSON.parse(
  await fs.readFile("data/card_character_art.json", "utf8"),
);
for (const id of ["AR1", "AR2", "AR3", "AR4"]) {
  const file = `${id}-skill`;
  await sharp(`art-source/cards-v2/${file}.png`)
    .webp({ quality: 94 })
    .toFile(`public/assets/cards-v2/${file}.webp`);
  const entry = { id, kind: "skill", path: `/assets/cards-v2/${file}.webp` };
  const index = manifest.findIndex(
    (asset) => asset.id === id && asset.kind === "skill",
  );
  if (index < 0) manifest.push(entry);
  else manifest[index] = entry;
}
await fs.writeFile(
  "data/card_character_art.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
