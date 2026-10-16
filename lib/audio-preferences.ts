export type AudioPreferences = {
  music: boolean;
  sfx: boolean;
  musicVolume: number;
  sfxVolume: number;
};
export const defaultAudioPreferences: AudioPreferences = {
  music: true,
  sfx: true,
  musicVolume: 0.24,
  sfxVolume: 0.75,
};
export function parseAudioPatch(value: unknown): Partial<AudioPreferences> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("설정 형식이 올바르지 않습니다.");
  const patch: Record<string, boolean | number> = {};
  for (const [key, v] of Object.entries(value)) {
    if (key === "music" || key === "sfx") {
      if (typeof v !== "boolean")
        throw new Error("켜짐 설정은 참/거짓이어야 합니다.");
    } else if (key === "musicVolume" || key === "sfxVolume") {
      if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 1)
        throw new Error("음량은 0~1이어야 합니다.");
    } else throw new Error("알 수 없는 설정입니다.");
    patch[key] = v;
  }
  return patch;
}
