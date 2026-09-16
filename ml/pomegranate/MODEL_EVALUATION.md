# Pomegranate Disease V1 — Evaluation Protocol

A model is not promoted to production from accuracy alone.

## Required test outputs

- Overall test accuracy
- Macro precision, recall and F1
- Per-class precision, recall and F1
- Confusion matrix
- Class support
- Confidence distribution
- Low-confidence rejection results

## Promotion checks

The candidate should meet the configured quality gate in `configs/training_v1.yaml` and receive a manual review of the confusion matrix. Any severe class-specific weakness must be investigated before deployment.

## Leakage caution

The initial dataset split is stratified at image-path level. Exact SHA-256 duplicates were audited and none were found. A perceptual near-duplicate audit was not completed because the first implementation was too slow. Therefore, results must not be described as fully leakage-proof until capture-session or near-duplicate grouping is addressed.

## Production interpretation

The model output is a **possible condition**, not a definitive field diagnosis. The serving layer must expose confidence and support an `Unknown / Needs Review` outcome when evidence is insufficient.
