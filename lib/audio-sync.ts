import { parseAudioPatch, type AudioPreferences } from "./audio-preferences";

/** A stalled request must release the caller's synchronization lock. */
export async function requestAudioPreferences(
  patch: Partial<AudioPreferences>,
  signal: AbortSignal,
  timeoutMs = 10000,
) {
  const writing = Object.keys(patch).length > 0;
  const response = await fetch("/api/preferences", {
    ...(writing
      ? {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        }
      : { cache: "no-store" as const }),
    signal: AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]),
  });
  if (!response.ok) throw new Error("Audio sync failed");
  const data = await response.json();
  if (typeof data?.initialized !== "boolean")
    throw new Error("Invalid audio response");
  return { audio: parseAudioPatch(data.audio), initialized: data.initialized };
}
