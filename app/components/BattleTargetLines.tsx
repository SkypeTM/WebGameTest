"use client";

import { useEffect, useId, useState, type RefObject } from "react";

type Link = { id: string; d: string; highlighted: boolean };

/** Measure the rendered actors, so links follow responsive layouts and real targets. */
export default function BattleTargetLines({
  fieldRef,
  owner,
  targetKind,
  highlighted,
  revision,
}: {
  fieldRef: RefObject<HTMLDivElement | null>;
  owner: string;
  targetKind: "ally" | "enemy";
  highlighted: string;
  revision: number;
}) {
  const markerId = useId().replaceAll(":", "");
  const [geometry, setGeometry] = useState({
    width: 1,
    height: 1,
    links: [] as Link[],
  });
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = field.getBoundingClientRect();
        const units = Array.from(
          field.querySelectorAll<HTMLElement>("[data-card-target]"),
        );
        const source = units.find((unit) => unit.dataset.cardTarget === owner);
        if (!source || !box.width) return;
        const anchor = (unit: HTMLElement) => {
          const rect = (
            unit.querySelector(".battle-sd") || unit
          ).getBoundingClientRect();
          const img = unit.querySelector<HTMLImageElement>(".battle-sd img");
          const aspect = img?.naturalWidth
            ? img.naturalHeight / img.naturalWidth
            : 1;
          const visibleHeight = Math.min(rect.height, rect.width * aspect);
          return {
            x: rect.x + rect.width / 2 - box.x,
            y: rect.bottom - visibleHeight * 0.72 - box.y,
          };
        };
        const start = anchor(source);
        const links = units
          .filter(
            (unit) =>
              unit.dataset.cardKind === targetKind &&
              !unit.hasAttribute("disabled"),
          )
          .map((unit) => {
            const end = anchor(unit);
            const self = unit === source;
            const lift = Math.min(
              110,
              Math.max(45, Math.abs(end.x - start.x) * 0.2),
            );
            return {
              id: unit.dataset.cardTarget!,
              highlighted: unit.dataset.cardTarget === highlighted,
              d: self
                ? `M ${start.x} ${start.y} c -40 -60 40 -60 2 -4`
                : `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${Math.max(8, Math.min(start.y, end.y) - lift)} ${end.x} ${end.y}`,
            };
          });
        setGeometry({ width: box.width, height: box.height, links });
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(field);
    field
      .querySelectorAll(".battle-sd")
      .forEach((unit) => observer.observe(unit));
    window.addEventListener("resize", measure);
    field.addEventListener("load", measure, true);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      field.removeEventListener("load", measure, true);
    };
  }, [fieldRef, owner, targetKind, highlighted, revision]);
  return (
    <svg
      className="battle-target-lines"
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      aria-hidden="true"
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
      {geometry.links.map((link) => (
        <path
          key={link.id}
          data-link-target={link.id}
          className={link.highlighted ? "highlighted" : ""}
          d={link.d}
          markerEnd={`url(#${markerId})`}
        />
      ))}
    </svg>
  );
}
