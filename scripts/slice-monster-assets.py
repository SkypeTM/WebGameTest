from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "assets" / "generated" / "monsters"
DATA = ROOT / "data" / "monster_asset_manifest.json"
STATES = ["idle", "action", "hit"]


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: slice-monster-assets.py ATLAS_DIRECTORY")
    atlas_directory = Path(sys.argv[1])
    monsters = json.loads((ROOT / "data" / "monsters.json").read_text(encoding="utf-8"))
    records: list[dict[str, str]] = []
    sd_file = ROOT / "data" / "sd_asset_manifest.json"
    repaired = {item["id"]: item["path"] for item in json.loads(sd_file.read_text(encoding="utf-8")) if item["type"] == "monsters"} if sd_file.exists() else {}
    for group in range(7):
        image = Image.open(atlas_directory / f"map-{group + 1}.png").convert("RGB")
        cell_width, cell_height = image.width / 8, image.height / 3
        for column in range(8):
            monster = monsters[group * 8 + column]
            for row, state in enumerate(STATES):
                if monster["id"] in repaired:
                    records.append({"id": monster["id"], "name": monster["name"], "state": state, "path": repaired[monster["id"]]})
                    continue
                box = (
                    round(column * cell_width),
                    round(row * cell_height),
                    round((column + 1) * cell_width),
                    round((row + 1) * cell_height),
                )
                relative_path = Path(monster["id"]) / f"{state}.png"
                destination = PUBLIC / relative_path
                destination.parent.mkdir(parents=True, exist_ok=True)
                image.crop(box).resize((384, 512), Image.Resampling.LANCZOS).save(
                    destination, optimize=True
                )
                records.append(
                    {
                        "id": monster["id"],
                        "name": monster["name"],
                        "state": state,
                        "path": f"/assets/generated/monsters/{relative_path.as_posix()}",
                    }
                )
    DATA.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"created {len(records)} monster assets and {DATA}")


if __name__ == "__main__":
    main()
