"use client";
import { useRef } from "react";
import { characters, monsters } from "../../lib/game";

function entrySide(text: string) {
  if (text.startsWith("[적]")) return "enemy";
  if (text.startsWith("[아군]")) return "ally";
  // Legacy string logs remain readable without migrating saved accounts.
  if (characters.some((c) => text.startsWith(`${c.name}의 `))) return "ally";
  if (monsters.some((m) => text.startsWith(`${m.name}의 `))) return "enemy";
  return "world";
}

export default function ActionJournal({ entries }: { entries: string[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  return (
    <>
      <button
        className="mini journal-trigger"
        onClick={() => {
          dialog.current?.showModal();
          if (feed.current) feed.current.scrollTop = feed.current.scrollHeight;
        }}
      >
        ▥ 최근 기록
      </button>
      <dialog
        className="action-journal"
        ref={dialog}
        aria-label="최근 행동 기록"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <header>
          <div>
            <small>EXPEDITION CHRONICLE</small>
            <h2>최근 기록</h2>
          </div>
          <button autoFocus onClick={() => dialog.current?.close()}>
            닫기 ×
          </button>
        </header>
        <div className="journal-legend">
          <span>◀ 아군 행동</span>
          <span>적 행동 ▶</span>
        </div>
        <div className="journal-feed" ref={feed}>
          {entries.length === 0 && <p>아직 기록된 행동이 없습니다.</p>}
          {entries.map((text, index) => {
            const side = entrySide(text);
            return (
              <article
                className={`journal-event journal-${side}`}
                key={`${index}-${text}`}
              >
                <small>
                  {side === "ally"
                    ? "⚔ 탐사대"
                    : side === "enemy"
                      ? "◆ 적"
                      : "✧ 탐사 기록"}{" "}
                  · {index + 1}
                </small>
                <p>{text.replace(/^\[(적|아군)\]\s*/, "")}</p>
              </article>
            );
          })}
        </div>
      </dialog>
    </>
  );
}
