import fs from "node:fs";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const characters = read("data/characters.json"),
  npcs = read("data/story_npcs.json");
const style =
  "High resolution polished painterly anime dark fantasy RPG illustration. Fine precise facial features, coherent anatomy, rich restrained colors, brass detailing. No text, no letters, no UI, no border, one subject only.";
const jobs = [];
const add = (key, prompt, transparent = false) =>
  jobs.push({
    key,
    prompt,
    transparent,
    source: `art-source/story-v1/${key}.png`,
    path: `/assets/story-v1/${key}.webp`,
  });
const poses = {
  neutral: "calm attentive expression, relaxed visible hands at waist",
  explain:
    "speaking gently with one open palm gesturing naturally, other hand at waist",
  resolve:
    "determined reassuring expression, one hand held over heart, other open toward listener",
};
for (const [faction, npc] of Object.entries(npcs))
  for (const [pose, gesture] of Object.entries(poses))
    add(
      `npc-${faction}-${pose}`,
      `${style} Visual novel dialogue portrait from head to waist with complete hair, shoulders, elbows and both hands inside canvas. ${npc.design}. ${gesture}. Consistent identity and costume between dialogue expressions. Transparent background.`,
      true,
    );
const relics = {
  fortress: [
    "a square brass seal bearing a carved fortress wall and blue wax",
    "a tall delicate brass hourglass with silver sand and two blue wings",
    "an open ivory and brass brazier with a warm orange living flame",
  ],
  harbor: [
    "a dark iron anchor holding one enormous black pearl",
    "a teal copper folding maritime compass with a ship needle",
    "an elegant deep blue chalice containing luminous seawater",
  ],
  archive: [
    "a silver backward-rune key with an asymmetrical bit",
    "a massive closed brown tome bound with brass chains and a red seal",
    "an ivory circular index wheel with many hanging memory tags",
  ],
  chapel: [
    "a branched white gold candelabrum with pale blue flames",
    "a small engraved silver confession bell with purple ribbon",
    "a black and ivory choir book open to blank golden lined pages",
  ],
  laboratory: [
    "an exposed crystal gear core with interlocking transparent cogwheels",
    "a tiny brass alchemical memory distiller with violet glass tubes",
    "a rectangular black steel shutdown command tablet with red crystal switches",
  ],
  observatory: [
    "a frosted bronze star telescope on a short tripod",
    "one large blue convex north-star lens held inside silver prongs",
    "a spherical stopped celestial globe inside several concentric brass rings",
  ],
  palace: [
    "a jagged charcoal throne shard containing a crimson crystal",
    "a thin open gold dawn crown with orange sun rays",
    "a silver liberation insignia with broken chain and a red enamel wing",
  ],
};
for (const [region, items] of Object.entries(relics))
  items.forEach((item, i) =>
    add(
      `relic-${region}-${i + 1}`,
      `${style} Standalone centered inventory relic product illustration of ${item}. Entire object visible with 15 percent clear margin, sharp silhouette, realistic hand-painted materials, neutral dark atmospheric backdrop. Square composition. This unique object must not resemble other relics.`,
    ),
  );
for (const c of characters)
  for (const [kind, action] of Object.entries({
    strike:
      "BASIC STRIKE: direct fast offensive swing or thrust using their signature weapon, focused expression, clean silver impact trail",
    guard:
      "DEFENSIVE STANCE: visibly braced body and raised protective arm, signature equipment blocking a blow, calm alert expression, blue protective arc",
    heavy:
      "FOCUSED HEAVY STRIKE: powerful two-handed signature weapon or spell release, deep committed swing with full torso twist, fierce determination, concentrated gold impact arc",
  }))
    add(
      `card-${c.id}-${kind}`,
      `${style} Square action card painting. Adult ${c.gender === "여" ? "woman" : "man"} ${c.name}. Identity: ${c.design}; ${c.face}; ${c.skin}; ${c.signature}; palette ${c.palette}. ${action}. Upper body and hands clearly visible, dynamic angle, dark ruined fantasy background. Distinct pose for each card, not an idle portrait.`,
    );
for (const c of characters)
  for (const [pose, gesture] of Object.entries(poses))
    add(
      `hero-${c.id}-${pose}`,
      `${style} Head to waist visual novel portrait, entire hair, shoulders and both hands inside frame. Adult ${c.gender === "여" ? "woman" : "man"} ${c.name}: ${c.design}; ${c.face}; ${c.skin}; ${c.signature}; palette ${c.palette}. ${gesture}. Preserve character identity, elegant natural hands. Transparent background.`,
      true,
    );
fs.writeFileSync(
  "art-source/story-v1/generation-plan.json",
  JSON.stringify(jobs, null, 2) + "\n",
);
console.log(`${jobs.length} independent asset jobs prepared`);
