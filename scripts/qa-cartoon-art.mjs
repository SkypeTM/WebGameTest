import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }));
const manifest = JSON.parse(await fs.readFile('data/character_cartoon_manifest.json', 'utf8'));
const characters = JSON.parse(await fs.readFile('data/character_design_v2.json', 'utf8'));
assert.deepEqual(manifest.assets.map(a => a.id).sort(), characters.map(a => a.id).sort());
for (const entry of manifest.assets) {
  assert.match(entry.path, /^\/assets\/cartoon-v5\/[A-Z]{2}[1-4]\.png$/);
  assert.ok(entry.generation.prompt && entry.generation.tool);
  if (entry.runtimeApplied) assert.equal(entry.status, 'base-art-reviewed');
  const image = sharp(await fs.readFile(`public${entry.path}`));
  const meta = await image.metadata();
  assert.ok(meta.hasAlpha, `${entry.id}: missing alpha`);
  const stats = await image.stats();
  assert.equal(stats.channels[3].min, 0, `${entry.id}: no transparent pixels`);
  assert.ok(stats.channels[3].max >= 250, `${entry.id}: no near-opaque pixels`);
}
console.log(`PASS: ${manifest.assets.length} character images; ${manifest.assets.filter(a => a.runtimeApplied).length} enabled; identity coverage, paths and alpha verified. Visual review remains separate.`);
