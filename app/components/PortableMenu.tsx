"use client";
import { useRef, type ReactNode } from "react";

/** Native dialog supplies focus trapping, Escape and focus restoration. */
export default function PortableMenu({ children }: { children: ReactNode }) {
  const panel = useRef<HTMLDialogElement>(null);
  return (
    <div className="portable-tools">
      <button
        className="mini"
        aria-label="탐사 메뉴 열기"
        onClick={() => panel.current?.showModal()}
      >
        ☰ 메뉴
      </button>
      <dialog
        ref={panel}
        className="portable-drawer"
        aria-label="탐사 메뉴"
        onClick={(event) => {
          if (event.target === event.currentTarget) panel.current?.close();
        }}
      >
        <div className="portable-drawer-content">
          <div className="section-heading">
            <h2>탐사 수첩</h2>
            <button autoFocus onClick={() => panel.current?.close()}>
              닫기 ×
            </button>
          </div>
          <p>가로 화면에서는 전장을 더 넓게 볼 수 있습니다.</p>
          <div
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("[data-close-menu]"))
                panel.current?.close();
            }}
          >
            {children}
          </div>
        </div>
      </dialog>
    </div>
  );
}
