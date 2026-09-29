import { readFile, copyFile } from 'node:fs/promises';

// Only publish explicitly public, permanently prerendered shells. APIs stay server-side.
const manifest = JSON.parse(await readFile('.next/prerender-manifest.json', 'utf8'));
for (const [route, file] of [['/', 'index'], ['/m', 'm']]) {
  const entry = manifest.routes[route];
  if (!entry || entry.initialRevalidateSeconds !== false)
    throw new Error(`Refusing to publish non-static shell: ${route}`);
  await copyFile(`.next/server/app/${file}.html`, `.open-next/assets/${file}.html`);
}
console.log('Published public desktop/mobile shells as static assets.');
