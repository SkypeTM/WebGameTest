"use client";
import { useEffect, useRef, useState } from "react";
import {
  defaultAudioPreferences,
  parseAudioPatch,
  type AudioPreferences,
} from "../../lib/audio-preferences";

export function useAccountAudio(account: string) {
  const [prefs, setPrefs] = useState(defaultAudioPreferences);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("설정 불러오는 중");
  const pending = useRef<Partial<AudioPreferences>>({});
  const owner = useRef("");
  const revision = useRef(0);
  const sync = useRef<() => Promise<void>>(async () => {});
  useEffect(() => {
    owner.current = account;
    pending.current = {};
    revision.current++;
    setReady(false);
    setPrefs(defaultAudioPreferences);
    if (!account) return;
    let disposed = false,
      running = false;
    let retry: number | undefined;
    const key = `bell-audio-account:${account}`;
    let cached = false;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      if (saved) {
        setPrefs({
          ...defaultAudioPreferences,
          ...parseAudioPatch(saved.audio),
        });
        pending.current = parseAudioPatch(saved.pending || {});
        cached = true;
      }
    } catch {}
    const persist = (audio: AudioPreferences) => {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ audio, pending: pending.current }),
        );
      } catch {}
    };
    const refresh = async () => {
      if (disposed || running) return;
      running = true;
      const patch = { ...pending.current };
      const rev = revision.current;
      try {
        const writing = Object.keys(patch).length > 0;
        const response = await fetch(
          "/api/preferences",
          writing
            ? {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
              }
            : { cache: "no-store" },
        );
        if (!response.ok) throw new Error("sync failed");
        const data = await response.json();
        if (disposed) return;
        if (writing)
          for (const k of Object.keys(patch) as (keyof AudioPreferences)[]) {
            if (pending.current[k] === patch[k]) delete pending.current[k];
          }
        // Import old device preferences only when this account has no server settings.
        if (
          !writing &&
          !data.initialized &&
          !cached &&
          revision.current === rev
        ) {
          try {
            pending.current = parseAudioPatch(
              JSON.parse(localStorage.getItem("bell-audio-v2") || "{}"),
            );
          } catch {}
          cached = true;
        }
        const audio = {
          ...defaultAudioPreferences,
          ...data.audio,
          ...pending.current,
        };
        setPrefs(audio);
        persist(audio);
        cached = true;
        setReady(true);
        setStatus(
          Object.keys(pending.current).length
            ? "설정 저장 중"
            : "계정에 저장됨",
        );
      } catch {
        if (!disposed) {
          setReady(cached);
          setStatus("설정 동기화 대기 · 재시도 중");
        }
      } finally {
        running = false;
        if (!disposed && Object.keys(pending.current).length) {
          window.clearTimeout(retry);
          retry = window.setTimeout(refresh, 1500);
        }
      }
    };
    sync.current = refresh;
    void refresh();
    const interval = window.setInterval(refresh, 30000);
    const focus = () => {
      if (!document.hidden) void refresh();
    };
    window.addEventListener("online", focus);
    window.addEventListener("focus", focus);
    document.addEventListener("visibilitychange", focus);
    return () => {
      disposed = true;
      window.clearTimeout(retry);
      window.clearInterval(interval);
      window.removeEventListener("online", focus);
      window.removeEventListener("focus", focus);
      document.removeEventListener("visibilitychange", focus);
    };
  }, [account]);
  const update = (patch: Partial<AudioPreferences>) => {
    if (!account || owner.current !== account || !ready) return;
    revision.current++;
    pending.current = { ...pending.current, ...patch };
    setPrefs((previous) => {
      const audio = { ...previous, ...patch };
      try {
        localStorage.setItem(
          `bell-audio-account:${account}`,
          JSON.stringify({ audio, pending: pending.current }),
        );
      } catch {}
      return audio;
    });
    setStatus("설정 저장 중");
    void sync.current();
  };
  return {
    prefs,
    update,
    ready: ready && owner.current === account && Boolean(account),
    status,
  };
}
