"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Non-modal panel: the map remains available to choose another destination. */
export default function RouteSelectionSheet({
  children,
  onCancel,
}: {
  children: ReactNode;
  onCancel: () => void;
}) {
  const panel = useRef<HTMLElement>(null);
  const cancel = useRef(onCancel);
  cancel.current = onCancel;
  useEffect(() => {
    const source =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    panel.current
      ?.querySelector<HTMLButtonElement>("[data-route-cancel]")
      ?.focus({ preventScroll: true });
    const escape = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.defaultPrevented ||
        document.querySelector("dialog[open]")
      )
        return;
      event.preventDefault();
      cancel.current();
    };
    document.addEventListener("keydown", escape);
    const currentPanel = panel.current;
    return () => {
      document.removeEventListener("keydown", escape);
      // Never steal focus from another destination or a newly opened modal.
      if (
        source?.isConnected &&
        !document.querySelector("dialog[open]") &&
        (document.activeElement === document.body ||
          currentPanel?.contains(document.activeElement))
      ) {
        source.focus({ preventScroll: true });
      }
    };
  }, []);
  return (
    <section
      ref={panel}
      className="route-selection-sheet"
      aria-label="선택 경로 확인"
    >
      {children}
    </section>
  );
}
