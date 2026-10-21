"use client";
import { useEffect, useRef, useState, useId } from "react";
import "./patch-notes.css";

type Note = { id: string; title: string; body: string; source: string };
export default function PatchNotes() {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.current?.close();
      document.body.style.overflow = previous;
    };
  }, [open]);
  useEffect(() => {
    if (!open || notes.length) return;
    const controller = new AbortController();
    setError(false);
    fetch("/updates/patch-notes.json", {
      signal: controller.signal,
      cache: "no-cache",
    })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data: Note[]) => {
        if (!controller.signal.aborted) {
          setNotes(data);
          setSelected(data[0]?.source || "");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [open, retry, notes.length]);
  const filtered = notes.filter((note) =>
    `${note.title} ${note.body}`.toLowerCase().includes(query.toLowerCase()),
  );
  const active = filtered.find((note) => note.source === selected) || filtered[0];
  return (
    <>
      <button
        type="button"
        className="mini patch-notes-trigger"
        onClick={() => setOpen(true)}
      >
        패치 기록
      </button>
      <dialog
        ref={dialog}
        className="patch-journal"
        aria-labelledby={titleId}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const r = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < r.left ||
              event.clientX > r.right ||
              event.clientY < r.top ||
              event.clientY > r.bottom
            )
              setOpen(false);
          }
        }}
      >
        <header>
          <div>
            <small>침묵의 종 아래 · UPDATE ARCHIVE</small>
            <h2 id={titleId}>패치 기록</h2>
          </div>
          <button
            type="button"
            autoFocus
            onClick={() => setOpen(false)}
            aria-label="패치 기록 닫기"
          >
            닫기 ×
          </button>
        </header>
        <label className="patch-search">
          기록 검색
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="패치 번호 또는 내용"
          />
        </label>
        {error ? (
          <p role="alert">
            기록을 불러오지 못했습니다.{" "}
            <button onClick={() => setRetry(retry + 1)}>다시 시도</button>
          </p>
        ) : !notes.length ? (
          <p role="status">패치 기록을 불러오는 중…</p>
        ) : (
          <div className="patch-journal-body">
            <nav aria-label="이전 패치">
              {filtered.map((note) => (
                <button
                  key={note.source}
                  aria-pressed={active?.source === note.source}
                  onClick={() => setSelected(note.source)}
                >
                  {note.title}
                </button>
              ))}
            </nav>
            <article aria-live="polite">
              {active ? (
                <>
                  <h3>{active.title}</h3>
                  <a
                    href={active.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub 원문 ↗
                  </a>
                  <pre>{active.body}</pre>
                </>
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </article>
          </div>
        )}
      </dialog>
    </>
  );
}
