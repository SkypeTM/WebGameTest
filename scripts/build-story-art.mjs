import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);
const jobs = JSON.parse(
  await fs.readFile("art-source/story-v1/generation-plan.json", "utf8"),
);
const cards = JSON.parse(
  await fs.readFile("data/card_character_art.json", "utf8"),
);
const manifest = [],
  pending = [];
await fs.mkdir("public/assets/story-v1", { recursive: true });
for (const job of jobs) {
  try {
    await fs.access(job.source);
  } catch {
    pending.push(job.key);
    continue;
  }
  const out = `public${job.path}`;
  await sharp(job.source).webp({ quality: 95, alphaQuality: 100 }).toFile(out);
  const { width, height } = await sharp(job.source).metadata();
  manifest.push({
    key: job.key,
    path: job.path,
    source: job.source,
    width,
    height,
    generator: "built-in-imagegen",
  });
  const match = job.key.match(/^card-(\w+)-(strike|guard|heavy|skill)$/);
  if (match) {
    const entry = { id: match[1], kind: match[2], path: job.path };
    const at = cards.findIndex(
      (c) => c.id === entry.id && c.kind === entry.kind,
    );
    if (at < 0) cards.push(entry);
    else cards[at] = entry;
  }
}
await fs.writeFile(
  "data/story_art_manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
await fs.writeFile(
  "data/card_character_art.json",
  JSON.stringify(cards, null, 2) + "\n",
);
await fs.writeFile(
  "art-source/story-v1/pending.json",
  JSON.stringify(pending, null, 2) + "\n",
);
console.log(`Published ${manifest.length}; pending ${pending.length}`);
