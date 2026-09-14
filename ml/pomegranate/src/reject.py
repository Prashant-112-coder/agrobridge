"""Confidence rejection policy to avoid forced disease predictions."""


def apply_rejection(probabilities, labels, threshold=0.55):
    if not probabilities:
        return {'label': 'unknown', 'confidence': 0.0, 'accepted': False}
    index = max(range(len(probabilities)), key=probabilities.__getitem__)
    confidence = float(probabilities[index])
    accepted = confidence >= threshold and labels[index] != 'unknown'
    return {
        'label': labels[index] if accepted else 'unknown',
        'confidence': confidence,
        'accepted': accepted,
    }
