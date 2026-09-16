# Pomegranate Disease Inference Contract

The production API should return structured evidence rather than only a class label.

## Candidate response

```json
{
  "model_version": "pomegranate-fruit-v1",
  "organ": "fruit",
  "prediction": {
    "label": "Anthracnose",
    "confidence": 0.91,
    "status": "possible"
  },
  "alternatives": [],
  "image_quality": {
    "status": "acceptable"
  }
}
```

## Required behavior

1. Validate the uploaded image before inference.
2. Return the model version used for the prediction.
3. Return confidence and a non-diagnostic `possible` status.
4. Support `unknown` / `needs_review` when confidence or image quality is insufficient.
5. Keep disease identification separate from treatment recommendations.
6. The decision engine may combine the image result with weather, soil, satellite and crop-stage evidence after inference.

No fabricated prediction or fallback class should be returned when the model cannot support a known condition.
