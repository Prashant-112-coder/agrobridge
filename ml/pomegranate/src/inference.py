"""
AGROBRIDGE Pomegranate Disease Inference Module
Handles image preprocessing, model loading, and prediction with rejection.
Designed for use in the FastAPI serving layer or direct import.
"""
import io
import json
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import models, transforms

# Default 5-class taxonomy from training_v1.yaml
CLASS_LABELS = ["Healthy", "Anthracnose", "Bacterial_Blight", "Alternaria", "Cercospora"]

# Confidence threshold below which predictions are rejected
REJECTION_THRESHOLD = 0.55

# Image preprocessing pipeline matching training augmentation
INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def validate_image(image_bytes: bytes) -> dict:
    """Validate that the uploaded bytes form a valid, usable image."""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()
        # Re-open after verify (verify closes the image)
        image = Image.open(io.BytesIO(image_bytes))
        width, height = image.size

        if width < 64 or height < 64:
            return {"status": "rejected", "reason": "Image too small (minimum 64x64 pixels)"}
        if width > 8192 or height > 8192:
            return {"status": "rejected", "reason": "Image too large (maximum 8192x8192 pixels)"}
        if image.mode not in ("RGB", "RGBA", "L"):
            return {"status": "rejected", "reason": f"Unsupported color mode: {image.mode}"}

        return {
            "status": "acceptable",
            "width": width,
            "height": height,
            "mode": image.mode,
        }
    except Exception as exc:
        return {"status": "rejected", "reason": f"Invalid image: {str(exc)}"}


def load_model(weights_path: str, num_classes: int = 5, device: str = "cpu"):
    """Load a trained EfficientNet-B0 model from a checkpoint."""
    model = models.efficientnet_b0(weights=None)
    model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, num_classes)
    state = torch.load(weights_path, map_location=device, weights_only=True)
    if "model_state_dict" in state:
        model.load_state_dict(state["model_state_dict"])
    else:
        model.load_state_dict(state)
    model.eval()
    model.to(device)
    return model


def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    """Convert raw image bytes to a preprocessed tensor."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = INFERENCE_TRANSFORM(image)
    return tensor.unsqueeze(0)  # Add batch dimension


def predict(model, image_tensor: torch.Tensor, labels: list = None,
            threshold: float = REJECTION_THRESHOLD, device: str = "cpu") -> dict:
    """
    Run inference and return a structured prediction with rejection policy.
    Follows the INFERENCE_CONTRACT.md specification.
    """
    if labels is None:
        labels = CLASS_LABELS

    image_tensor = image_tensor.to(device)

    with torch.no_grad():
        logits = model(image_tensor)
        probabilities = F.softmax(logits, dim=1).squeeze(0)

    probs_list = probabilities.cpu().numpy().tolist()
    top_index = int(np.argmax(probs_list))
    top_confidence = float(probs_list[top_index])
    top_label = labels[top_index]

    # Rejection policy: low confidence → unknown
    accepted = top_confidence >= threshold
    if not accepted:
        status = "needs_review"
        prediction_label = "Unknown"
    else:
        status = "possible"
        prediction_label = top_label

    # Build alternatives (top-3 excluding the primary)
    sorted_indices = np.argsort(probs_list)[::-1]
    alternatives = []
    for idx in sorted_indices[1:4]:
        alternatives.append({
            "label": labels[idx],
            "confidence": round(float(probs_list[idx]), 4),
        })

    return {
        "model_version": "pomegranate-fruit-v1",
        "organ": "fruit",
        "prediction": {
            "label": prediction_label,
            "confidence": round(top_confidence, 4),
            "status": status,
        },
        "alternatives": alternatives,
        "all_probabilities": {
            labels[i]: round(float(probs_list[i]), 4) for i in range(len(labels))
        },
    }


def run_inference(model, image_bytes: bytes, labels: list = None,
                  threshold: float = REJECTION_THRESHOLD, device: str = "cpu") -> dict:
    """
    Full inference pipeline: validate → preprocess → predict.
    Returns the structured response per INFERENCE_CONTRACT.md.
    """
    # Step 1: Validate
    quality = validate_image(image_bytes)
    if quality["status"] == "rejected":
        return {
            "model_version": "pomegranate-fruit-v1",
            "organ": "fruit",
            "prediction": {
                "label": "Unknown",
                "confidence": 0.0,
                "status": "rejected",
            },
            "alternatives": [],
            "image_quality": quality,
        }

    # Step 2: Preprocess
    tensor = preprocess_image(image_bytes)

    # Step 3: Predict
    result = predict(model, tensor, labels=labels, threshold=threshold, device=device)
    result["image_quality"] = quality

    return result
