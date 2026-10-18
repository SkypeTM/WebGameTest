import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }));
const manifest = JSON.parse(await fs.readFile('data/renewal_actor_manifest.json', 'utf8'));
const results = [];
const seen = new Set();
for (const entry of manifest) {
  const key = `${entry.id}/${entry.pose}`;
  try {
    assert.ok(!seen.has(key), 'duplicate pose');
    seen.add(key);
    assert.match(entry.path, /^\/assets\/renewal\/[A-Z0-9]+\/[a-z]+\.webp$/);
    assert.match(entry.source, /^art-source\/renewal\/[A-Z0-9]+\/[a-z]+\.png$/);
    const source = await fs.readFile(entry.source);
    assert.equal(createHash('sha256').update(source).digest('hex'), entry.sha256, 'source changed without conversion');
    const image = sharp(await fs.readFile(`public${entry.path}`));
    const meta = await image.metadata();
    assert.equal(meta.width, entry.width, 'width mismatch');
    assert.equal(meta.height, entry.height, 'height mismatch');
    assert.equal(meta.format, 'webp');
    assert.ok(meta.hasAlpha, 'missing alpha');
    const stats = await image.stats();
    assert.equal(stats.channels[3].min, 0, 'missing transparent background');
    assert.ok(stats.channels[3].max >= 250, 'missing near-opaque character');
    results.push({ key, passed: true });
  } catch (error) {
    results.push({ key, passed: false, error: error.message });
  }
}
for (const [id, special] of Object.entries({ AR1: 'guard', AR2: 'skill', AR3: 'heal', AR4: 'skill' })) {
  for (const pose of ['ready', 'windup', 'strike', 'recover', 'hit', special]) {
    if (!seen.has(`${id}/${pose}`)) results.push({ key: `${id}/${pose}`, passed: false, error: 'required pose missing' });
  }
}
const passed = results.every(r => r.passed);
await fs.mkdir('storage/qa-bot', { recursive: true });
await fs.writeFile('storage/qa-bot/assets.json', JSON.stringify({ createdAt: new Date().toISOString(), passed, results }, null, 2));
console.log(`${passed ? 'PASS' : 'FAIL'}: actor assets ${results.filter(r => r.passed).length}/${results.length}. storage/qa-bot/assets.json`);
for (const r of results.filter(r => !r.passed)) console.error(`${r.key}: ${r.error}`);
if (!passed) process.exitCode = 1;

