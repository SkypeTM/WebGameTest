from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "assets" / "generated" / "characters"
DATA = ROOT / "data" / "character_asset_manifest.json"
FACTIONS = ["AR", "BC", "BK", "DS", "EF", "GO", "VR", "WS"]
STATES = ["idle", "attack", "hit", "skill", "dialogue", "promotion"]


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: slice-character-assets.py ATLAS_DIRECTORY")
    atlas_directory = Path(sys.argv[1])
    characters = {
        character["id"]: character
        for character in json.loads(
            (ROOT / "data" / "characters.json").read_text(encoding="utf-8")
        )
    }
    records: list[dict[str, str]] = []
    for faction in FACTIONS:
        image = Image.open(atlas_directory / f"{faction}.png").convert("RGB")
        cell_width, cell_height = image.width / 6, image.height / 4
        for row in range(4):
            character_id = f"{faction}{row + 1}"
            for column, state in enumerate(STATES):
                box = (
                    round(column * cell_width),
                    round(row * cell_height),
                    round((column + 1) * cell_width),
                    round((row + 1) * cell_height),
                )
                relative_path = Path(character_id) / f"{state}.png"
                destination = PUBLIC / relative_path
                destination.parent.mkdir(parents=True, exist_ok=True)
                image.crop(box).resize((384, 384), Image.Resampling.LANCZOS).save(
                    destination, optimize=True
                )
                records.append(
                    {
                        "id": character_id,
                        "name": characters[character_id]["name"],
                        "state": state,
                        "path": f"/assets/generated/characters/{relative_path.as_posix()}",
                    }
                )
    DATA.write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"created {len(records)} character assets and {DATA}")


if __name__ == "__main__":
    main()
