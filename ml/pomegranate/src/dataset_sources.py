from pathlib import Path

DATA_ROOT = Path('/kaggle/input')

DATASET_SOURCES = {
    'mendeley-fruit-v1': 'b6s2rkpmvh/1',
    'halabja-fruit-v1': 'zenodo/15856012',
}


def require_cloud_dataset(path: Path) -> Path:
    """Fail fast if a notebook is accidentally pointed at local project data."""
    resolved = path.resolve()
    if '/kaggle/input' not in str(resolved) and '/content' not in str(resolved):
        raise RuntimeError('Pomegranate training data must remain in a cloud runtime.')
    return resolved
