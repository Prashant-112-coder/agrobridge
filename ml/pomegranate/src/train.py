"""Cloud GPU training entry point. No local dataset download is expected."""
import json
from pathlib import Path


def load_config(path='ml/pomegranate/configs/fruit_v1.json'):
    return json.loads(Path(path).read_text())


def main():
    config = load_config()
    print('Training configuration loaded:', config)
    print('Run this entry point inside Kaggle or Colab after dataset audit.')


if __name__ == '__main__':
    main()
