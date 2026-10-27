"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Native modal semantics keep background facilities out of keyboard navigation. */
export default function HubDialog({ children, onClose, label = "거점 장소 정보" }: {
  children: ReactNode;
  onClose: () => void;
  label?: string;
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
      const remaining = Array.from(document.querySelectorAll<HTMLDialogElement>("dialog[open]")).at(-1);
      if (source?.isConnected && (!remaining || remaining.contains(source))) {
        source.focus({ preventScroll: true });
      }
    };
  }, []);
  return <dialog ref={ref} className="hub-overlay" aria-label={label}
    onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onClose(); }}>
    {children}
  </dialog>;
}
