"""Evaluation contract for the pomegranate classifier."""
from sklearn.metrics import classification_report, confusion_matrix


def evaluate_predictions(y_true, y_pred, labels):
    report = classification_report(y_true, y_pred, labels=labels, output_dict=True, zero_division=0)
    matrix = confusion_matrix(y_true, y_pred, labels=labels).tolist()
    return {'classification_report': report, 'confusion_matrix': matrix}
