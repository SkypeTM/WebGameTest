"use client";
import { useState, useId } from "react";
import { createPortal } from "react-dom";
export default function StatusIcon({
  icon,
  name,
  value,
  description,
  tone = "neutral",
}: {
  icon: string;
  name: string;
  value: number;
  description: string;
  tone?: string;
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
      null,
    ),
    id = useId();
  const show = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setPosition({
      x: Math.max(12, Math.min(window.innerWidth - 252, r.left - 100)),
      y: Math.max(12, Math.min(window.innerHeight - 130, r.top - 112)),
    });
  };
  return (
    <>
      <span
        className={`status-icon tone-${tone}`}
        tabIndex={0}
        role="button"
        aria-label={`${name} ${value}: ${description}`}
        aria-describedby={position ? id : undefined}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") show(e.currentTarget);
        }}
        onPointerLeave={() => setPosition(null)}
        onFocus={(e) => show(e.currentTarget)}
        onBlur={() => setPosition(null)}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          if (position) setPosition(null);
          else show(e.currentTarget);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setPosition(null);
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            show(e.currentTarget);
          }
        }}
      >
        <b aria-hidden="true">{icon}</b>
        <sup>{value}</sup>
      </span>
      {position &&
        createPortal(
          <div
            id={id}
            className="combat-status-tooltip"
            role="tooltip"
            style={{ left: position.x, top: position.y }}
          >
            <strong>
              {name} · {value}
            </strong>
            <p>{description}</p>
          </div>,
          document.body,
        )}
    </>
  );
}
