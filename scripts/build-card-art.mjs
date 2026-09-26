import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);
const manifest = [];
for (const id of ["AR1", "AR2", "AR3", "AR4"]) {
  const file = `${id}-skill`;
  await sharp(`art-source/cards-v2/${file}.png`)
    .webp({ quality: 94 })
    .toFile(`public/assets/cards-v2/${file}.webp`);
  manifest.push({ id, kind: "skill", path: `/assets/cards-v2/${file}.webp` });
}
await fs.writeFile(
  "data/card_character_art.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
