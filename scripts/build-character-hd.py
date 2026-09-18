from pathlib import Path
from shutil import copyfile

from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SHEETS = ROOT / "art-source" / "characters-hd"
OUT = ROOT / "public" / "assets" / "fhd"
STATES = ("idle", "attack", "hit", "skill", "dialogue", "promotion")


def high_detail(image: Image.Image) -> Image.Image:
    image = image.filter(ImageFilter.UnsharpMask(radius=0.75, percent=115, threshold=2))
    return ImageEnhance.Sharpness(image).enhance(1.05)


for sheet_path in sorted(SHEETS.glob("*.png")):
    faction = sheet_path.stem
    with Image.open(sheet_path) as source:
        source = source.convert("RGB")
        boundaries = [round(source.width * i / 4) for i in range(5)]
        for index in range(4):
            left = boundaries[index] + (2 if index else 0)
            right = boundaries[index + 1] - (2 if index < 3 else 0)
            panel = source.crop((left, 0, right, source.height))
            character_id = f"{faction}{index + 1}"

            # Preserve the complete silhouette on a true 1920px master canvas.
            scale = min(1760 / panel.width, 1880 / panel.height)
            full = panel.resize(
                (round(panel.width * scale), round(panel.height * scale)),
                Image.Resampling.LANCZOS,
            )
            canvas = Image.new("RGB", (1920, 1920), panel.getpixel((8, 8)))
            canvas.paste(full, ((1920 - full.width) // 2, 1920 - full.height))
            canvas = high_detail(canvas)
            state_dir = OUT / "characters" / character_id
            state_dir.mkdir(parents=True, exist_ok=True)
            idle_path = state_dir / "idle.webp"
            idle_path.unlink(missing_ok=True)
            canvas.save(idle_path, "WEBP", quality=94, method=4)
            for state in STATES[1:]:
                state_path = state_dir / f"{state}.webp"
                state_path.unlink(missing_ok=True)
                copyfile(idle_path, state_path)

            # A dedicated head-and-shoulders crop makes small formation slots readable.
            portrait_size = min(panel.width, round(panel.height * 0.52))
            x0 = max(0, (panel.width - portrait_size) // 2)
            y0 = max(0, round(panel.height * 0.015))
            portrait = panel.crop((x0, y0, x0 + portrait_size, y0 + portrait_size))
            portrait = high_detail(
                portrait.resize((1080, 1080), Image.Resampling.LANCZOS)
            )
            portrait_dir = OUT / "portraits"
            portrait_dir.mkdir(parents=True, exist_ok=True)
            portrait_path = portrait_dir / f"{character_id}.webp"
            portrait_path.unlink(missing_ok=True)
            portrait.save(
                portrait_path, "WEBP", quality=95, method=4
            )

print("built 32 character masters, 192 state images, and 32 portraits")
