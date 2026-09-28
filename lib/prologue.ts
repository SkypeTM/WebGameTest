import scoring from "../data/prologue_scoring_v1.json";
export type PrologueProfile = {
  answers: Record<string, string>;
  raw: Record<string, number>;
  affinity: Record<string, number>;
  closest: string[];
  farthest: string[];
  cycle: number;
};
export const originRegions: Record<string, string> = {
  AR: "fortress",
  VR: "harbor",
  BC: "archive",
  BK: "archive",
  WS: "chapel",
  DS: "laboratory",
  GO: "observatory",
  EF: "fortress",
};
export function scorePrologue(
  answers: Record<string, string>,
  cycle: number,
): PrologueProfile {
  const factions = Object.keys(scoring.max_raw_by_faction);
  const raw = Object.fromEntries(factions.map((f) => [f, 0]));
  const hits = { ...raw };
  const last = { ...raw };
  for (const q of scoring.questions) {
    const c = q.choices[answers[q.id] as keyof typeof q.choices];
    if (!c) continue;
    raw[c.primary] += 2;
    raw[c.secondary] += 1;
    hits[c.primary]++;
    if (q.id === "M7") {
      last[c.primary] = 2;
      last[c.secondary] = 1;
    }
  }
  const affinity = Object.fromEntries(
    factions.map((f) => [
      f,
      (raw[f] /
        scoring.max_raw_by_faction[
          f as keyof typeof scoring.max_raw_by_faction
        ]) *
        100,
    ]),
  );
  const order = [...factions].sort(
    (a, b) =>
      affinity[b] - affinity[a] || hits[b] - hits[a] || last[b] - last[a],
  );
  const tied = (f: string, g: string) =>
    Math.abs(affinity[f] - affinity[g]) < 1e-9 &&
    hits[f] === hits[g] &&
    last[f] === last[g];
  return {
    answers: { ...answers },
    raw,
    affinity,
    closest: order.filter((f) => tied(f, order[0])),
    farthest: order.filter((f) => tied(f, order.at(-1)!)),
    cycle,
  };
}
