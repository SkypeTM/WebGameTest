from __future__ import annotations

import json
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
DATA = ROOT / "data"
FHD = PUBLIC / "assets" / "fhd"


def read(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def save_fhd(source: Path, target: Path, size: tuple[int, int]):
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = image.convert("RGBA")
        scale = min(size[0] / image.width, size[1] / image.height)
        image = image.resize(
            (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
            Image.Resampling.LANCZOS,
        )
        canvas = Image.new("RGBA", size, (0, 0, 0, 0))
        canvas.alpha_composite(image, ((size[0] - image.width) // 2, size[1] - image.height))
        canvas = canvas.filter(ImageFilter.UnsharpMask(radius=1.25, percent=105, threshold=3))
        canvas = ImageEnhance.Contrast(canvas).enhance(1.03)
        canvas.save(target, "WEBP", quality=92, method=3)


def public_path(path: Path):
    return "/" + path.relative_to(PUBLIC).as_posix()


characters = read("character_asset_manifest.json")
for entry in characters:
    source = PUBLIC / "assets" / "generated" / "characters" / entry["id"] / f'{entry["state"]}.png'
    target = FHD / "characters" / entry["id"] / f'{entry["state"]}.webp'
    save_fhd(source, target, (1920, 1920))
    entry["path"] = public_path(target)

for character_id in sorted({entry["id"] for entry in characters}):
    idle = next(entry for entry in characters if entry["id"] == character_id and entry["state"] == "idle")
    source = PUBLIC / idle["path"].lstrip("/")
    target = FHD / "portraits" / f"{character_id}.webp"
    with Image.open(source) as image:
        image = image.convert("RGBA")
        # FHD 전신 원본의 상단 중앙을 초상화 비율로 재구성한다.
        crop = image.crop((350, 80, 1570, 1500))
        crop = crop.resize((1080, 1080), Image.Resampling.LANCZOS)
        crop = crop.filter(ImageFilter.UnsharpMask(radius=1.1, percent=95, threshold=2))
        target.parent.mkdir(parents=True, exist_ok=True)
        crop.save(target, "WEBP", quality=94, method=3)

monsters = read("monster_asset_manifest.json")
for entry in monsters:
    source = PUBLIC / "assets" / "generated" / "monsters" / entry["id"] / f'{entry["state"]}.png'
    target = FHD / "monsters" / entry["id"] / f'{entry["state"]}.webp'
    save_fhd(source, target, (1440, 1920))
    entry["path"] = public_path(target)

items = read("source_asset_manifest.json") if (DATA / "source_asset_manifest.json").exists() else read("generated_assets.json")
for entry in items:
    source = PUBLIC / entry["path"].lstrip("/")
    target = FHD / "items" / f'{entry["id"]}.webp'
    save_fhd(source, target, (1080, 1080))
    entry["path"] = public_path(target)

merchant_source = ROOT / "art-source" / "merchant-sheet.png"
merchant_manifest = []
if merchant_source.exists():
    states = ["idle", "welcome", "rare", "exchange", "surprised", "portrait"]
    with Image.open(merchant_source) as sheet:
        sheet = sheet.convert("RGB")
        cell_w, cell_h = sheet.width // 3, sheet.height // 2
        for index, state in enumerate(states):
            x, y = index % 3, index // 3
            crop = sheet.crop((x * cell_w, y * cell_h, (x + 1) * cell_w, (y + 1) * cell_h))
            target = FHD / "merchant" / f"{state}.webp"
            target.parent.mkdir(parents=True, exist_ok=True)
            crop.resize((1920, 1920), Image.Resampling.LANCZOS).save(
                target, "WEBP", quality=94, method=3
            )
            merchant_manifest.append({"id": "merchant", "state": state, "path": public_path(target)})

live2d = []
for actor_id in sorted({entry["id"] for entry in characters + monsters}):
    source = characters if actor_id.startswith("M") is False else monsters
    states = {entry["state"]: entry["path"] for entry in source if entry["id"] == actor_id}
    live2d.append({"id": actor_id, "type": "character" if not actor_id.startswith("M") else "monster", "states": states})

(DATA / "character_asset_manifest.json").write_text(json.dumps(characters, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(DATA / "monster_asset_manifest.json").write_text(json.dumps(monsters, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(DATA / "generated_assets.json").write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(DATA / "live2d_manifest.json").write_text(json.dumps(live2d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(DATA / "merchant_asset_manifest.json").write_text(json.dumps(merchant_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"characters={len(characters)} monsters={len(monsters)} items={len(items)} live2d={len(live2d)} merchant={len(merchant_manifest)}")
