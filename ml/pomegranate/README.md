# Pomegranate Cloud ML

AGROBRIDGE keeps heavy pomegranate datasets and model training in cloud notebooks. Local machines only use the source code and API.

## Pipeline

1. Audit datasets in cloud
2. Verify licenses and provenance
3. Normalize taxonomy
4. Split without leakage
5. Train on cloud GPU
6. Evaluate on a held-out test set
7. Publish only the verified model artifact

## Current cloud-only target

Start with the 5-class fruit screening model. Add a reject/unknown path and do not force low-confidence images into a disease class.

No raw dataset files belong in this repository.
