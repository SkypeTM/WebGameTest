from __future__ import annotations

import json
import os
import re
import sys
import time
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "assets" / "generated"
DATA = ROOT / "data" / "generated_assets.json"


def crop_atlas(
    source: Path,
    columns: int,
    rows: int,
    outputs: list[tuple[str, str, str]],
    *,
    inset_ratio: float = 0,
    clean_alpha: bool = False,
) -> list[dict[str, str]]:
    # Keep the atlas alpha channel. Converting to RGB baked transparent pixels
    # into black/green fringes around every inventory cutout.
    image = Image.open(source).convert("RGBA")
    cell_width, cell_height = image.width / columns, image.height / rows
    records: list[dict[str, str]] = []
    for index, (asset_id, name, relative_path) in enumerate(outputs):
        column, row = index % columns, index // columns
        box = (
            round((column + inset_ratio) * cell_width),
            round((row + inset_ratio) * cell_height),
            round((column + 1 - inset_ratio) * cell_width),
            round((row + 1 - inset_ratio) * cell_height),
        )
        destination = PUBLIC / relative_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        asset = image.crop(box).resize((256, 256), Image.Resampling.LANCZOS)
        if clean_alpha:
            pixels = []
            for red, green, blue, alpha_value in asset.get_flattened_data():
                matte_spill = (
                    (red > 180 and green < 70 and blue < 70)
                    or (green > 170 and red < 80 and blue < 80)
                    or (blue > 170 and red < 80 and green < 80)
                    or (red > 190 and green > 190 and blue < 45)
                )
                pixels.append(
                    (red, green, blue, 0) if matte_spill else (red, green, blue, alpha_value)
                )
            asset.putdata(pixels)
            # Pull the visible edge two pixels inward, then feather it. This
            # removes the colored matte left by the generated atlas.
            alpha = asset.getchannel("A")
            alpha = alpha.filter(ImageFilter.MinFilter(5)).filter(
                ImageFilter.GaussianBlur(0.55)
            )
            asset.putalpha(alpha)
        temporary = destination.with_name(f".{destination.name}.tmp.png")
        asset.save(temporary, optimize=True)
        for attempt in range(8):
            try:
                os.replace(temporary, destination)
                break
            except PermissionError:
                if attempt == 7:
                    raise
                time.sleep(0.08 * (attempt + 1))
        records.append({"id": asset_id, "name": name, "path": f"/assets/generated/{relative_path}"})
    return records


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("usage: slice-assets.py LOOT_ATLAS_1 LOOT_ATLAS_2 SYSTEM_ATLAS")

    monsters = json.loads((ROOT / "data" / "monsters.json").read_text(encoding="utf-8"))
    loot_names = sorted({monster["loot"] for monster in monsters})
    if len(loot_names) != 56:
        raise RuntimeError(f"expected 56 unique loot items, found {len(loot_names)}")
    loot = [
        (f"loot-{index + 1:02d}", name, f"items/loot-{index + 1:02d}.png")
        for index, name in enumerate(loot_names)
    ]
    system = [
        ("faction-AR", "아르켄 왕국", "factions/AR.png"),
        ("faction-BC", "황동나침반 조합", "factions/BC.png"),
        ("faction-BK", "검은열쇠 결사", "factions/BK.png"),
        ("faction-DS", "깊은별 성회", "factions/DS.png"),
        ("faction-EF", "잿불 해방전선", "factions/EF.png"),
        ("faction-GO", "녹서약 수호회", "factions/GO.png"),
        ("faction-VR", "벨로라 공화연맹", "factions/VR.png"),
        ("faction-WS", "백야성좌 교단", "factions/WS.png"),
        ("equipment-blade", "훈련용 무기", "equipment/blade.png"),
        ("equipment-ward", "호신 부적", "equipment/ward.png"),
        ("sprite-attack", "공격", "sprites/attack.png"),
        ("sprite-guard", "수호", "sprites/guard.png"),
        ("sprite-support", "지원", "sprites/support.png"),
        ("sprite-control", "제어", "sprites/control.png"),
        ("sprite-stress", "스트레스", "sprites/stress.png"),
        ("sprite-injury", "부상", "sprites/injury.png"),
    ]
    records = []
    records += crop_atlas(Path(sys.argv[1]), 7, 4, loot[:28], inset_ratio=0.018)
    records += crop_atlas(Path(sys.argv[2]), 7, 4, loot[28:], inset_ratio=0.018)
    records += crop_atlas(Path(sys.argv[3]), 4, 4, system, clean_alpha=True)
    DATA.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"created {len(records)} assets and {DATA}")


if __name__ == "__main__":
    main()
