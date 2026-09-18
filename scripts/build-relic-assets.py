from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "art-source" / "relic-sheet.png"
OUTPUT = ROOT / "public" / "assets" / "fhd" / "relics"
REGIONS = ["fortress", "harbor", "archive", "chapel", "laboratory", "observatory", "palace"]

source = Image.open(SOURCE).convert("RGB")
cell_width = source.width / 7
cell_height = source.height / 3
OUTPUT.mkdir(parents=True, exist_ok=True)

for row in range(3):
    for column, region in enumerate(REGIONS):
        margin = 3
        box = (
            round(column * cell_width) + margin,
            round(row * cell_height) + margin,
            round((column + 1) * cell_width) - margin,
            round((row + 1) * cell_height) - margin,
        )
        icon = source.crop(box)
        icon = ImageOps.fit(icon, (1000, 1000), Image.Resampling.LANCZOS)
        icon = ImageEnhance.Contrast(icon).enhance(1.04)
        icon = icon.filter(ImageFilter.UnsharpMask(radius=1.4, percent=115, threshold=3))
        canvas = Image.new("RGB", (1080, 1080), "#0e1110")
        canvas.paste(icon, (40, 40))
        canvas.save(OUTPUT / f"{region}-{row + 1}.webp", "WEBP", quality=94, method=6)

print(f"relics={len(REGIONS) * 3} size=1080x1080")
