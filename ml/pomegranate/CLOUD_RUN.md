# Cloud-only execution

## Kaggle

Attach the approved datasets to a Kaggle notebook, run the audit, preparation, training and evaluation notebooks, and keep generated data in the notebook runtime or external model storage.

## Google Colab

Use the same notebooks in Colab with cloud-mounted/downloaded datasets. Do not copy datasets into the AGROBRIDGE working tree.

## Local machine

The local i3 development machine should only clone the repository, edit source, run lightweight application checks, and deploy. It must not be required to hold the training dataset or execute GPU training.

Production integration starts only after a model passes the registry gates.
