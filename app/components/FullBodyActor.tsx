"use client";
import { useEffect, useState } from "react";

// First production slice: distinct full-body poses, not a resized SD image.
// Keep this renderer independent of gameplay; the server already resolved the action.
export default function FullBodyActor({ motion = "" }: { motion?: string }) {
  const [pose, setPose] = useState("ready");
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setPose("ready");
    if (!motion.includes("strike") || reduced) return;
    const timers = [
      [120, "windup"],
      [320, "strike"],
      [560, "recover"],
      [780, "ready"],
    ].map(([ms, name]) =>
      window.setTimeout(() => setPose(String(name)), Number(ms)),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [motion]);
  return (
    <div className={`full-body-actor ${motion}`} data-pose={pose}>
      {["ready", "windup", "strike", "recover"].map((name) => (
        <img
          key={name}
          src={`/assets/renewal/AR1/${name}.webp`}
          alt={name === pose ? "레오나 전신 전투 자세" : ""}
          aria-hidden={name !== pose}
          className={name === pose ? "active" : ""}
          draggable={false}
          width={1024}
          height={1536}
        />
      ))}
    </div>
  );
}
