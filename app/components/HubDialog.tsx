"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Native modal semantics keep background facilities out of keyboard navigation. */
export default function HubDialog({ children, onClose }: {
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const source = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (source?.isConnected && !document.querySelector("dialog[open]")) {
        source.focus({ preventScroll: true });
      }
    };
  }, []);
  return <dialog ref={ref} className="hub-overlay" aria-label="거점 장소 정보"
    onCancel={(event) => { event.preventDefault(); onClose(); }}>
    {children}
  </dialog>;
}
