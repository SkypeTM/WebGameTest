import manifest from "../data/audio_manifest_v2.json";
import type { Game } from "./game";
export function soundtrackFor(game: Game | null, dialogue = false) {
  if (!game) return "hamlet";
  if (game.prologue && game.prologue.stage !== "complete")
    return game.prologue.stage === "questions" ? "prologue" : "origin";
  if (dialogue) return "dialogue";
  if (game.ending) return "ending";
  const r = game.run;
  if (!r) return "hamlet";
  if (r.mode === "defeat") return "defeat";
  if (r.mode === "relic") return "relic";
  if (r.mode === "merchant") return "merchant";
  if (r.mode === "battle" || r.mode === "reward")
    return r.room.endsWith("boss") ? "boss" : "battle";
  const room = r.route?.[r.room];
  if (room?.kind === "rest") return "rest";
  if (
    ["entrance", "origin-approach"].includes(r.room) &&
    game.originFaction === "BK"
  )
    return "secret";
  if (
    ["entrance", "origin-approach"].includes(r.room) &&
    game.originFaction === "EF"
  )
    return "refuge";
  return r.region || "fortress";
}
class GameAudio {
  private music: HTMLAudioElement | null = null;
  private sounds = new Set<HTMLAudioElement>();
  private fades = new Map<HTMLAudioElement, ReturnType<typeof setInterval>>();
  private fade(a: HTMLAudioElement, to: number, stop = false) {
    clearInterval(this.fades.get(a));
    const from = a.volume,
      start = performance.now();
    const timer = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / 650);
      a.volume = from + (to - from) * t;
      if (t === 1) {
        clearInterval(timer);
        this.fades.delete(a);
        if (stop) {
          a.pause();
          a.removeAttribute("src");
          a.load();
        }
      }
    }, 30);
    this.fades.set(a, timer);
  }
  setMusic(key: string, volume: number) {
    const path = manifest.music[key as keyof typeof manifest.music]?.path;
    if (!path) return;
    if (this.music?.getAttribute("src") === path) {
      this.fade(this.music, volume);
      return;
    }
    this.stopMusic();
    const a = new Audio(path);
    a.loop = true;
    a.volume = 0;
    this.music = a;
    void a
      .play()
      .then(() => {
        if (this.music === a) this.fade(a, volume);
      })
      .catch(() => {
        if (this.music === a) this.music = null;
      });
  }
  stopMusic() {
    if (this.music) this.fade(this.music, 0, true);
    this.music = null;
  }
  stopSounds() {
    for (const a of this.sounds) {
      a.pause();
      a.removeAttribute("src");
    }
    this.sounds.clear();
  }
  play(key: string, volume: number) {
    if (document.hidden) return;
    const path = manifest.sfx[key as keyof typeof manifest.sfx]?.path;
    if (!path) return;
    if (this.sounds.size >= 8) {
      const first = this.sounds.values().next().value!;
      first.pause();
      this.sounds.delete(first);
    }
    const a = new Audio(path);
    a.volume = Math.max(0, Math.min(1, volume));
    this.sounds.add(a);
    const cleanup = () => this.sounds.delete(a);
    a.addEventListener("ended", cleanup, { once: true });
    a.addEventListener("error", cleanup, { once: true });
    void a.play().catch(cleanup);
  }
}
export const gameAudio = new GameAudio();
