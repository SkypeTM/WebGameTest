from __future__ import annotations

import math
import random
import wave
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "public" / "assets" / "audio"
RATE = 22050


def save(path: Path, samples: list[float], stereo: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    peak = max(1.0, max(abs(value) for value in samples))
    pcm = bytearray()
    for value in samples:
        sample = int(max(-1, min(1, value / peak)) * 32767)
        pcm += sample.to_bytes(2, "little", signed=True)
        if stereo:
            pcm += sample.to_bytes(2, "little", signed=True)
    with wave.open(str(path), "wb") as output:
        output.setnchannels(2 if stereo else 1)
        output.setsampwidth(2)
        output.setframerate(RATE)
        output.writeframes(pcm)


def tone(duration: float, notes: list[tuple[float, float, float]], noise: float = 0) -> list[float]:
    rng = random.Random(617)
    result = []
    for index in range(int(duration * RATE)):
        t = index / RATE
        attack = min(1.0, t / 0.018)
        release = min(1.0, (duration - t) / max(0.04, duration * 0.3))
        envelope = max(0.0, min(attack, release))
        value = sum(amplitude * math.sin(2 * math.pi * frequency * t) for frequency, amplitude, _ in notes)
        value += noise * (rng.random() * 2 - 1)
        result.append(value * envelope)
    return result


def music(duration: float, tempo: int, progression: list[list[float]], pulse: bool) -> list[float]:
    rng = random.Random(tempo)
    result = [0.0] * int(duration * RATE)
    beat = 60 / tempo
    for index in range(len(result)):
        t = index / RATE
        chord_index = int(t / (beat * 4)) % len(progression)
        chord = progression[chord_index]
        value = 0.0
        for note_index, frequency in enumerate(chord):
            value += 0.08 * math.sin(2 * math.pi * frequency * t + note_index * 0.8)
            value += 0.025 * math.sin(2 * math.pi * frequency * 0.5 * t)
        step = int(t / (beat / 2))
        arp = chord[step % len(chord)] * (2 if step % 4 == 3 else 1)
        local = t % (beat / 2)
        value += 0.11 * math.sin(2 * math.pi * arp * t) * math.exp(-local * 8)
        if pulse:
            pulse_local = t % beat
            value += 0.10 * math.sin(2 * math.pi * 55 * t) * math.exp(-pulse_local * 18)
        value += (rng.random() * 2 - 1) * 0.008
        edge = min(1.0, t / 1.2, (duration - t) / 1.2)
        result[index] = value * max(0.0, edge)
    return result


def main() -> None:
    sfx = AUDIO / "sfx"
    save(sfx / "ui-click.wav", tone(0.09, [(880, 0.25, 0), (1320, 0.12, 0)]))
    save(sfx / "card-select.wav", tone(0.16, [(440, 0.18, 0), (660, 0.18, 0)]))
    save(sfx / "card-play.wav", tone(0.30, [(220, 0.18, 0), (880, 0.16, 0)], 0.05))
    save(sfx / "hit.wav", tone(0.24, [(92, 0.32, 0), (138, 0.16, 0)], 0.16))
    save(sfx / "skill.wav", tone(0.55, [(330, 0.12, 0), (495, 0.12, 0), (742, 0.10, 0)]))
    save(sfx / "route.wav", tone(0.34, [(294, 0.16, 0), (440, 0.14, 0)]))
    save(sfx / "reward.wav", tone(0.80, [(392, 0.12, 0), (494, 0.12, 0), (659, 0.14, 0)]))
    save(sfx / "victory.wav", tone(1.50, [(262, 0.11, 0), (392, 0.12, 0), (523, 0.14, 0)]))
    save(sfx / "defeat.wav", tone(1.20, [(147, 0.17, 0), (220, 0.08, 0)], 0.025))
    tracks = AUDIO / "music"
    save(tracks / "hamlet.wav", music(24, 72, [[220, 262, 330], [196, 247, 294], [175, 220, 262], [196, 247, 330]], False), True)
    save(tracks / "exploration.wav", music(24, 84, [[165, 196, 247], [147, 185, 220], [131, 165, 196], [147, 196, 247]], False), True)
    save(tracks / "battle.wav", music(24, 112, [[110, 131, 165], [98, 123, 147], [110, 147, 175], [123, 147, 196]], True), True)
    print("created 9 sound effects and 3 original loopable music tracks")


if __name__ == "__main__":
    main()
