"use client";
import { useEffect, useState } from "react";
import poses from "../../data/renewal_actor_manifest.json";
import { COMBAT_PRESENTATION as timing } from "../../lib/combat-presentation";

// First production slice: distinct full-body poses, not a resized SD image.
// Keep this renderer independent of gameplay; the server already resolved the action.
export default function FullBodyActor({ id = "AR1", motion = "" }: { id?: string; motion?: string }) {
  const [pose, setPose] = useState("ready");
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setPose("ready");
    if (reduced) return;
    const support = motion === "motion-guard" ? "guard" : motion === "motion-heal" ? "heal" : null;
    const sequence = support && poses.some(p => p.id === id && p.pose === support)
      ? [[timing.windup, support], [timing.ready, "ready"]]
      : motion.includes("strike") ? [
      [timing.windup, "windup"],
      [timing.impact, "strike"],
      [timing.recover, "recover"],
      [timing.ready, "ready"],
    ] : [];
    const timers = sequence.map(([ms, name]) =>
      window.setTimeout(() => setPose(String(name)), Number(ms)),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [motion, id]);
  return (
    <div className={`full-body-actor ${motion}`} data-pose={pose}>
      {poses.filter(entry => entry.id === id).map(({pose: name, path, width, height}) => (
        <img
          key={name}
          src={path}
          alt={name === pose ? "전신 전투 자세" : ""}
          aria-hidden={name !== pose}
          className={name === pose ? "active" : ""}
          draggable={false}
          width={width}
          height={height}
        />
      ))}
    </div>
  );
}
