"""
AGROBRIDGE Pomegranate Disease Serving API
FastAPI server for pomegranate fruit disease classification.
Accepts image uploads and returns structured predictions per INFERENCE_CONTRACT.md.

Usage:
    uvicorn serving:app --host 0.0.0.0 --port 8080
"""
import os
import io
import time
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.inference import (
    load_model,
    run_inference,
    validate_image,
    CLASS_LABELS,
    REJECTION_THRESHOLD,
)

app = FastAPI(
    title="AGROBRIDGE Pomegranate Disease API",
    version="1.0.0",
    description="Pomegranate fruit disease screening via EfficientNet-B0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model reference
_model = None
_device = "cpu"
_labels = CLASS_LABELS

MODEL_PATH = os.environ.get("MODEL_PATH", "models/pomegranate-fruit-v1.pth")
CONFIDENCE_THRESHOLD = float(os.environ.get("CONFIDENCE_THRESHOLD", str(REJECTION_THRESHOLD)))
MAX_FILE_SIZE_MB = 10


def get_model():
    """Lazy-load the model on first request."""
    global _model
    if _model is None:
        model_path = Path(MODEL_PATH)
        if not model_path.exists():
            raise RuntimeError(
                f"Model file not found at {MODEL_PATH}. "
                "Train the model using the cloud notebooks and place the weights file here."
            )
        _model = load_model(str(model_path), num_classes=len(_labels), device=_device)
    return _model


@app.get("/")
async def root():
    return {
        "service": "AGROBRIDGE Pomegranate Disease API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health():
    model_exists = Path(MODEL_PATH).exists()
    return {
        "status": "healthy" if model_exists else "model_missing",
        "model_path": MODEL_PATH,
        "model_loaded": _model is not None,
        "model_file_exists": model_exists,
        "labels": _labels,
        "threshold": CONFIDENCE_THRESHOLD,
    }


@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    """
    Upload a pomegranate fruit image for disease screening.
    Returns a structured prediction per INFERENCE_CONTRACT.md.
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG, PNG, WebP)")

    # Read and validate size
    image_bytes = await file.read()
    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"Image too large ({size_mb:.1f} MB). Maximum is {MAX_FILE_SIZE_MB} MB.",
        )

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    # Load model
    try:
        model = get_model()
    except RuntimeError as exc:
        return JSONResponse(
            status_code=503,
            content={
                "success": False,
                "message": str(exc),
                "model_version": "pomegranate-fruit-v1",
                "prediction": None,
            },
        )

    # Run inference
    start = time.time()
    result = run_inference(
        model,
        image_bytes,
        labels=_labels,
        threshold=CONFIDENCE_THRESHOLD,
        device=_device,
    )
    elapsed_ms = round((time.time() - start) * 1000, 1)

    return {
        "success": True,
        **result,
        "inference_time_ms": elapsed_ms,
    }


@app.post("/validate")
async def validate_upload(file: UploadFile = File(...)):
    """Quick validation of an uploaded image without running inference."""
    image_bytes = await file.read()
    quality = validate_image(image_bytes)
    return {"success": True, "image_quality": quality}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
