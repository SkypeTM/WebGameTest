from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "assets" / "generated"
DATA = ROOT / "data" / "generated_assets.json"


def crop_atlas(source: Path, columns: int, rows: int, outputs: list[tuple[str, str, str]]) -> list[dict[str, str]]:
    image = Image.open(source).convert("RGB")
    cell_width, cell_height = image.width / columns, image.height / rows
    records: list[dict[str, str]] = []
    for index, (asset_id, name, relative_path) in enumerate(outputs):
        column, row = index % columns, index // columns
        box = (
            round(column * cell_width),
            round(row * cell_height),
            round((column + 1) * cell_width),
            round((row + 1) * cell_height),
        )
        destination = PUBLIC / relative_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.crop(box).resize((256, 256), Image.Resampling.LANCZOS).save(destination, optimize=True)
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
    records += crop_atlas(Path(sys.argv[1]), 7, 4, loot[:28])
    records += crop_atlas(Path(sys.argv[2]), 7, 4, loot[28:])
    records += crop_atlas(Path(sys.argv[3]), 4, 4, system)
    DATA.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"created {len(records)} assets and {DATA}")


if __name__ == "__main__":
    main()
