"""Cloud dataset audit utilities; run only in Kaggle/Colab."""
from pathlib import Path
from PIL import Image


def audit_images(root: str):
    root_path = Path(root)
    rows = []
    for path in root_path.rglob('*'):
        if path.suffix.lower() not in {'.jpg', '.jpeg', '.png', '.webp'}:
            continue
        try:
            with Image.open(path) as image:
                image.verify()
            with Image.open(path) as image:
                rows.append({'path': str(path), 'width': image.width, 'height': image.height})
        except Exception as exc:
            rows.append({'path': str(path), 'error': str(exc)})
    return rows
