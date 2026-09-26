# SD battle assets — patch 035

Generated with the built-in image generation tool, one individual transparent image per actor.

- Originals: `characters/*.png`, `monsters/*.png`.
- Runtime: `public/assets/sd/{characters,monsters}/*.webp` (quality 94, alpha 100; no enlargement).
- Mapping: `data/sd_asset_manifest.json` records original dimensions and source paths.
- Rebuild: `node scripts/build-sd-assets.mjs`.
- QA contact sheets: `qa-0.png`, `qa-20.png`; not used as runtime atlases.

## Prompt specification
Characters: use each record from `data/characters.json` (design, face, signature, skin, palette, equipment), with AR1 as style/proportion reference only. One adult, three-head-tall SD full-body battle sprite, facing right, crisp inked anime cel shading. Entire body, boots and equipment inside canvas; transparent background, no text, floor or additional figures.

Monsters: use each record from `data/monsters.json` for M01–M08. One full-body, left-facing SD fantasy enemy; rounded non-grotesque design, complete appendages and weapons, transparent background and no neighboring subjects. M01/M02 rebuilt from damaged originals. M08 framing revised to include all four legs, castle towers and weapon.

These are individual still sprites animated by runtime transforms/effects, not skeletal animation rigs or generated frame sequences. Remaining maps M09–M56 retain existing assets.
