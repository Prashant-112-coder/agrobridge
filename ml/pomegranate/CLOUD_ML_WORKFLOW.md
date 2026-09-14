# AGROBRIDGE Pomegranate Cloud ML Workflow

Heavy datasets, training, and evaluation run in Kaggle or Colab. Raw image datasets must not be committed to this repository or downloaded to the developer laptop.

## Workflow
1. Attach approved datasets to a Kaggle/Colab notebook.
2. Run `notebooks/01_dataset_audit.ipynb`.
3. Record class counts, corrupt files, exact duplicates, dimensions, and source/license metadata.
4. Perform near-duplicate and leakage-safe split checks.
5. Train a lightweight transfer-learning baseline on cloud GPU.
6. Evaluate on an untouched test set using accuracy, precision, recall, F1, confusion matrix, and rejection performance.
7. Promote only models that pass the model-card quality gates.
8. Store promoted weights in cloud model storage; keep datasets and weights out of Git.

## First model scope
Pomegranate fruit image screening for the five classes supported by the Karnataka dataset:
- Healthy
- Bacterial Blight
- Anthracnose
- Cercospora Fruit Spot
- Alternaria Fruit Spot

Unknown/low-confidence images must be rejected rather than forced into a disease class.
