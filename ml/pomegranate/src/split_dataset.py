"""Leakage-safe split helpers. Group by source/fruit when metadata is available."""
from sklearn.model_selection import train_test_split


def stratified_split(rows, label_key='label', test_size=0.15, seed=42):
    labels = [row[label_key] for row in rows]
    train, test = train_test_split(rows, test_size=test_size, random_state=seed, stratify=labels)
    return train, test


def validate_no_path_overlap(train_rows, test_rows):
    train_paths = {row['path'] for row in train_rows}
    test_paths = {row['path'] for row in test_rows}
    overlap = train_paths & test_paths
    if overlap:
        raise ValueError(f'Data leakage detected: {len(overlap)} paths overlap.')
