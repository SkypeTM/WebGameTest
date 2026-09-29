import fs from "node:fs";
// Original score. Deterministic additive/subtractive synthesis; no sampled music.
const SR = 32000,
  TAU = 2 * Math.PI,
  out = "public/assets/audio/v2";
fs.mkdirSync(out, { recursive: true });
let seed = 411;
const noise = () => {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return (seed >>> 0) / 2147483648 - 1;
};
const hz = (n) => 440 * 2 ** ((n - 69) / 12);
function buffer(seconds) {
  return [
    new Float32Array(Math.round(seconds * SR)),
    new Float32Array(Math.round(seconds * SR)),
  ];
}
function note(b, start, duration, midi, voice, level, pan = 0, loop = true) {
  const f = hz(midi),
    n = Math.floor(duration * SR),
    offset = Math.floor(start * SR),
    N = b[0].length;
  for (let i = 0; i < n; i++) {
    const t = i / SR,
      phase = TAU * f * t,
      attack = Math.min(1, t / (voice === "pad" ? 0.25 : 0.012));
    const tail = Math.min(1, (duration - t) / (voice === "pad" ? 0.45 : 0.08));
    let v = 0;
    if (voice === "bell")
      v =
        Math.sin(phase) * Math.exp(-t * 2.3) +
        0.37 * Math.sin(phase * 2.76) * Math.exp(-t * 4) +
        0.14 * Math.sin(phase * 5.4) * Math.exp(-t * 6);
    if (voice === "pluck")
      v =
        (Math.sin(phase) +
          0.34 * Math.sin(phase * 2) +
          0.15 * Math.sin(phase * 3)) *
        Math.exp(-t * 4.6);
    if (voice === "flute")
      v =
        (Math.sin(phase + 0.025 * Math.sin(TAU * 4.8 * t)) +
          0.12 * Math.sin(phase * 2) +
          noise() * 0.015) *
        Math.sin(Math.PI * Math.min(1, t / duration)) ** 0.35;
    if (voice === "pad")
      v =
        (Math.sin(phase) +
          0.23 * Math.sin(phase * 1.002) +
          0.17 * Math.sin(phase * 2) +
          0.06 * Math.sin(phase * 3)) *
        0.6;
    if (voice === "bass")
      v = (Math.sin(phase) + 0.2 * Math.sin(phase * 2)) * Math.exp(-t * 1.7);
    if (voice === "drum")
      v =
        Math.sin(TAU * (f * t + (38 * (1 - Math.exp(-t * 18))) / 18)) *
          Math.exp(-t * 13) +
        noise() * 0.2 * Math.exp(-t * 30);
    if (voice === "brush") v = noise() * Math.exp(-t * 25) * 0.5;
    const j = loop ? (offset + i) % N : offset + i;
    if (j >= N) break;
    const sample = v * attack * tail * level;
    b[0][j] += sample * Math.sqrt((1 - pan) / 2);
    b[1][j] += sample * Math.sqrt((1 + pan) / 2);
  }
}
function reverb(b, loop) {
  const dry = b.map((a) => a.slice());
  for (const [delay, gain] of [
    [0.113, 0.16],
    [0.227, 0.12],
    [0.371, 0.075],
  ]) {
    const d = Math.round(delay * SR);
    for (let c = 0; c < 2; c++)
      for (let i = 0; i < b[c].length; i++) {
        const j = i - d;
        if (j >= 0 || loop)
          b[c][i] += dry[1 - c][(j + b[c].length) % b[c].length] * gain;
      }
  }
}
const manifest = {
  version: 2,
  generator: "scripts/compose-soundtrack.mjs",
  license:
    "Original procedural compositions and synthesis; no external recordings",
  sampleRate: SR,
  music: {},
  sfx: {},
};
function save(key, b, loop, meta, group) {
  reverb(b, loop);
  let peak = 0,
    sum = 0;
  for (const a of b)
    for (const x of a) {
      peak = Math.max(peak, Math.abs(x));
      sum += x * x;
    }
  const rms = Math.sqrt(sum / (b[0].length * 2));
  const gain = Math.min(0.85 / (peak || 1), 0.14 / (rms || 1));
  const bytes = Buffer.alloc(44 + b[0].length * 4);
  bytes.write("RIFF");
  bytes.writeUInt32LE(bytes.length - 8, 4);
  bytes.write("WAVEfmt ", 8);
  bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20);
  bytes.writeUInt16LE(2, 22);
  bytes.writeUInt32LE(SR, 24);
  bytes.writeUInt32LE(SR * 4, 28);
  bytes.writeUInt16LE(4, 32);
  bytes.writeUInt16LE(16, 34);
  bytes.write("data", 36);
  bytes.writeUInt32LE(bytes.length - 44, 40);
  for (let i = 0; i < b[0].length; i++)
    for (let c = 0; c < 2; c++)
      bytes.writeInt16LE(
        Math.round(Math.max(-1, Math.min(1, b[c][i] * gain)) * 32767),
        44 + i * 4 + c * 2,
      );
  fs.writeFileSync(`${out}/${group}-${key}.wav`, bytes);
  manifest[group][key] = {
    path: `/assets/audio/v2/${group}-${key}.wav`,
    loop,
    seconds: b[0].length / SR,
    ...meta,
  };
}
const scores = [
  ["prologue", "두 번째 종은 울리지 않았다", 66, 50, "bell", 0],
  ["origin", "여덟 갈래의 새벽", 76, 55, "flute", 0],
  ["dialogue", "남겨진 목소리", 72, 57, "pluck", 0],
  ["hamlet", "귀환자의 등불", 84, 55, "flute", 0],
  ["fortress", "사흘째 봉화", 88, 50, "bell", 1],
  ["harbor", "파도 아래의 계약", 80, 53, "pluck", 0],
  ["archive", "젖은 종이의 이름", 72, 57, "bell", 0],
  ["chapel", "대답 없는 성가", 64, 55, "pad", 0],
  ["laboratory", "유리 속의 메아리", 96, 54, "bell", 1],
  ["observatory", "움직이는 북쪽 별", 70, 62, "flute", 0],
  ["palace", "비어 있는 왕좌", 82, 48, "pad", 1],
  ["battle", "끊어진 명령", 120, 50, "pluck", 2],
  ["boss", "종탑의 마지막 심장", 136, 48, "bell", 3],
  ["merchant", "황동 저울", 100, 57, "pluck", 1],
  ["rest", "재 속에 남은 불", 68, 55, "flute", 0],
  ["relic", "손에서 손으로", 78, 60, "bell", 0],
  ["ending", "아직 돌아올 자리", 76, 57, "flute", 0],
  ["defeat", "꺼지지 않은 기억", 60, 50, "pad", 0],
  ["secret", "잠긴 증언", 74, 54, "pluck", 0],
  ["refuge", "비워 둔 자리", 82, 57, "flute", 0],
];
for (const [key, title, bpm, root, voice, drive] of scores) {
  const beat = 60 / bpm,
    b = buffer(beat * 64);
  seed = key.split("").reduce((n, c) => n * 31 + c.charCodeAt(0), 41) | 0;
  const progression = [0, 5, 3, 7, 0, 8, 5, 7],
    motif = [0, 7, 10, 7, 3, 5, 2, 0];
  for (let bar = 0; bar < 16; bar++) {
    const start = bar * 4 * beat,
      r = root + progression[bar % 8],
      chord = [r, r + 3, r + 7];
    chord.forEach((n, j) =>
      note(b, start, beat * 4.2, n, "pad", 0.085, (j - 1) * 0.55),
    );
    for (let k = 0; k < 4; k++)
      note(
        b,
        start + k * beat,
        beat * 0.9,
        r - 12,
        "bass",
        drive ? 0.19 : 0.08,
        -0.1,
      );
    for (let k = 0; k < 8; k++) {
      if (!drive && k % 3 === 2) continue;
      const pitch =
        root + 12 + motif[(k + bar * 2) % 8] + (bar >= 8 && k === 6 ? 12 : 0);
      note(
        b,
        start + (k * beat) / 2,
        beat * (voice === "bell" ? 2.7 : 1.3),
        pitch,
        voice,
        bar % 4 === 3 ? 0.12 : 0.18,
        k % 2 ? 0.3 : -0.3,
      );
      if (drive)
        note(
          b,
          start + (k * beat) / 2,
          0.14,
          70,
          "brush",
          drive * 0.035,
          k % 2 ? 0.7 : -0.7,
        );
    }
    if (drive)
      for (const k of [0, 2, ...(drive > 1 ? [1.5, 3.5] : [])])
        note(b, start + k * beat, 0.45, 34, "drum", 0.13 + drive * 0.035, 0);
    if (bar % 4 === 0) note(b, start, 3, root + 24, "bell", 0.09, -0.45);
  }
  save(key, b, true, { title, bpm, bars: 16 }, "music");
}
const effects = {
  "ui-click": [[0, 0.09, 81, "pluck", 0.6]],
  "card-select": [
    [0, 0.2, 69, "pluck", 0.5],
    [0.05, 0.2, 76, "pluck", 0.3],
  ],
  "card-play": [
    [0, 0.22, 38, "brush", 0.5],
    [0.04, 0.3, 57, "pluck", 0.5],
  ],
  hit: [
    [0, 0.3, 28, "drum", 0.9],
    [0.02, 0.14, 65, "brush", 0.6],
  ],
  skill: [
    [0, 0.7, 69, "bell", 0.4],
    [0.08, 0.7, 76, "bell", 0.4],
    [0.16, 0.8, 81, "bell", 0.3],
  ],
  route: [
    [0, 0.23, 50, "pluck", 0.4],
    [0.1, 0.3, 57, "pluck", 0.4],
  ],
  reward: [
    [0, 0.8, 72, "bell", 0.4],
    [0.1, 0.8, 76, "bell", 0.4],
    [0.2, 1, 79, "bell", 0.4],
  ],
  victory: [
    [0, 1.2, 62, "flute", 0.5],
    [0.25, 1.2, 69, "flute", 0.4],
    [0.5, 1.4, 74, "bell", 0.5],
  ],
  defeat: [
    [0, 1.8, 50, "pad", 0.5],
    [0.15, 1.7, 51, "bell", 0.25],
  ],
  "memory-choice": [
    [0, 1.4, 62, "bell", 0.4],
    [0.12, 1.2, 69, "bell", 0.2],
  ],
  "origin-confirm": [
    [0, 2, 55, "bell", 0.5],
    [0.15, 1.8, 62, "bell", 0.4],
    [0.3, 1.8, 67, "flute", 0.35],
  ],
  "dialogue-next": [[0, 0.1, 74, "pluck", 0.25]],
  "quest-accept": [
    [0, 0.5, 62, "pluck", 0.4],
    [0.1, 0.6, 69, "bell", 0.4],
  ],
  "quest-complete": [
    [0, 1, 67, "bell", 0.4],
    [0.15, 1, 71, "bell", 0.4],
    [0.3, 1.2, 74, "bell", 0.4],
  ],
  heal: [
    [0, 0.8, 74, "flute", 0.4],
    [0.16, 1, 81, "bell", 0.3],
  ],
  guard: [
    [0, 0.25, 45, "drum", 0.5],
    [0.03, 0.5, 81, "bell", 0.45],
  ],
  craft: [
    [0, 0.25, 33, "drum", 0.7],
    [0.1, 0.4, 86, "bell", 0.5],
    [0.36, 0.25, 33, "drum", 0.7],
    [0.46, 0.5, 91, "bell", 0.4],
  ],
  purchase: [
    [0, 0.25, 88, "bell", 0.4],
    [0.08, 0.4, 93, "bell", 0.3],
  ],
  recruit: [
    [0, 0.5, 60, "pluck", 0.4],
    [0.15, 0.6, 67, "flute", 0.4],
  ],
  "relic-select": [
    [0, 1.7, 60, "bell", 0.4],
    [0.1, 1.5, 72, "bell", 0.4],
    [0.2, 1.7, 79, "bell", 0.3],
  ],
  "camp-return": [
    [0, 0.7, 62, "flute", 0.4],
    [0.2, 0.9, 57, "flute", 0.3],
  ],
  "boss-enter": [
    [0, 1.6, 26, "pad", 0.4],
    [0, 0.5, 30, "drum", 0.6],
    [0.3, 1.7, 50, "bell", 0.45],
  ],
  stress: [
    [0, 0.7, 74, "pad", 0.2],
    [0, 0.7, 75, "pad", 0.2],
  ],
  poison: [
    [0, 0.22, 42, "brush", 0.5],
    [0.1, 0.3, 54, "pluck", 0.25],
  ],
  burn: [
    [0, 0.6, 50, "brush", 0.6],
    [0.05, 0.5, 38, "drum", 0.3],
  ],
  frost: [
    [0, 0.8, 91, "bell", 0.3],
    [0.15, 0.7, 98, "bell", 0.2],
  ],
  shock: [
    [0, 0.12, 65, "brush", 0.6],
    [0.04, 0.12, 76, "brush", 0.5],
  ],
  rebirth: [
    [0, 2, 57, "pad", 0.4],
    [0.3, 2, 69, "bell", 0.4],
  ],
};
for (const [key, events] of Object.entries(effects)) {
  const b = buffer(Math.max(...events.map((e) => e[0] + e[1])) + 0.4);
  for (const e of events) note(b, ...e, 0, false);
  save(key, b, false, { title: key }, "sfx");
}
fs.writeFileSync(
  "data/audio_manifest_v2.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Created ${scores.length} music loops and ${Object.keys(effects).length} sound effects.`,
);
