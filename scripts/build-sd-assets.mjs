import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);
const root = path.resolve(import.meta.dirname, "..");
const records = [];
for (const type of ["characters", "monsters"]) {
  const sourceDir = path.join(root, "art-source/sd", type);
  const outDir = path.join(root, "public/assets/sd", type);
  await fs.mkdir(sourceDir, { recursive: true });
  await fs.mkdir(outDir, { recursive: true });
  // Preserve generated originals outside the deployed public asset directory.
  for (const file of await fs.readdir(outDir)) {
    if (file.endsWith(".png"))
      await fs.rename(path.join(outDir, file), path.join(sourceDir, file));
  }
  for (const file of (await fs.readdir(sourceDir))
    .filter((f) => f.endsWith(".png"))
    .sort()) {
    const id = path.basename(file, ".png");
    const source = path.join(sourceDir, file);
    const info = await sharp(source).metadata();
    if (!info.hasAlpha) throw new Error(`${id}: missing transparency`);
    await sharp(source)
      .webp({ quality: 94, alphaQuality: 100, effort: 6 })
      .toFile(path.join(outDir, `${id}.webp`));
    records.push({
      id,
      type,
      path: `/assets/sd/${type}/${id}.webp`,
      source: `art-source/sd/${type}/${file}`,
      width: info.width,
      height: info.height,
    });
  }
}
const dataDir = path.join(root, "data");
const write = (name, data) =>
  fs.writeFile(path.join(dataDir, name), JSON.stringify(data, null, 2) + "\n");
await write("sd_asset_manifest.json", records);
const fixed = new Map(
  records.filter((r) => r.type === "monsters").map((r) => [r.id, r.path]),
);
const monsters = JSON.parse(
  await fs.readFile(path.join(dataDir, "monster_asset_manifest.json"), "utf8"),
);
for (const entry of monsters)
  if (fixed.has(entry.id)) entry.path = fixed.get(entry.id);
await write("monster_asset_manifest.json", monsters);
const rigs = JSON.parse(
  await fs.readFile(path.join(dataDir, "live2d_manifest.json"), "utf8"),
);
for (const rig of rigs)
  if (fixed.has(rig.id))
    for (const state of Object.keys(rig.states))
      rig.states[state] = fixed.get(rig.id);
await write("live2d_manifest.json", rigs);
console.log(
  `Built ${records.length} full-resolution transparent WebP sprites.`,
);
