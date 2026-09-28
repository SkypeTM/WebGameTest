"use client";
import { useEffect, useState, type CSSProperties } from "react";

/** Lightweight layered 2D scenery, independent of gameplay and pointer targets. */
export default function LivingBackdrop({
  region = "fortress",
  enabled = true,
}: {
  region?: string;
  enabled?: boolean;
}) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const changed = () => setHidden(document.hidden);
    changed();
    document.addEventListener("visibilitychange", changed);
    return () => document.removeEventListener("visibilitychange", changed);
  }, []);
  const fortress =
    region === "fortress" || region === "hamlet" || region === "palace";
  const water = region === "harbor" || region === "archive";
  const outdoors = fortress || water || region === "observatory";
  return (
    <div
      className={`living-backdrop scenery-${region} ${hidden || !enabled ? "scenery-paused" : ""}`}
      aria-hidden="true"
    >
      <div className="scenery-mist" />
      {outdoors && (
        <div
          className={region === "observatory" ? "scenery-snow" : "scenery-rain"}
        />
      )}
      {fortress && (
        <>
          {[22, 76].map((left, i) => (
            <svg
              key={left}
              className="scenery-flag"
              style={{ left: `${left}%`, animationDelay: `-${i * 1.3}s` }}
              viewBox="0 0 60 90"
            >
              <path className="flag-pole" d="M4 88V3" />
              <g>
                <path
                  fill="#243b49"
                  stroke="#ad915c"
                  d="M6 6Q26 0 51 12L42 34Q24 23 6 31Z"
                />
                <path
                  fill="#c1a468"
                  d="m24 9 3 7 7 1-5 5 1 8-7-4-6 3 2-8-5-5 7-1Z"
                />
              </g>
            </svg>
          ))}
          <div className="scenery-rampart">
            <svg className="scenery-patrol" viewBox="0 0 28 48">
              <path
                fill="#151d20"
                d="M9 5 13 1 18 5 18 12 9 12ZM8 14 20 14 23 29 6 29Z"
              />
              <path
                className="patrol-leg leg-a"
                stroke="#172124"
                strokeWidth="5"
                d="M11 28 9 43"
              />
              <path
                className="patrol-leg leg-b"
                stroke="#172124"
                strokeWidth="5"
                d="M17 28 20 43"
              />
              <path stroke="#a9956a" strokeWidth="1.5" d="M25 3V39" />
            </svg>
          </div>
        </>
      )}
      {water && (
        <>
          <div className="scenery-waterfall" />
          <div className="scenery-ripples" />
        </>
      )}
      {[12, 63, 89].map((left, i) => (
        <i
          key={left}
          className="scenery-lantern"
          style={{
            left: `${left}%`,
            top: `${48 + i * 9}%`,
            animationDelay: `-${i * 0.8}s`,
          }}
        />
      ))}
      {!water &&
        region !== "laboratory" &&
        Array.from({ length: 6 }, (_, i) => (
          <i
            key={i}
            className="scenery-leaf"
            style={
              {
                "--leaf-x": `${i * 18}%`,
                "--leaf-delay": `${-i * 2.7}s`,
                "--leaf-duration": `${12 + i * 2}s`,
              } as CSSProperties
            }
          />
        ))}
    </div>
  );
}
