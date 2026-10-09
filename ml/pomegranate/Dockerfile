FROM python:3.11-slim

WORKDIR /app

COPY requirements-serving.txt .
RUN pip install --no-cache-dir -r requirements-serving.txt

COPY src/ src/
COPY serving.py .
COPY models/ models/

ENV MODEL_PATH=models/pomegranate-fruit-v1.pth
ENV CONFIDENCE_THRESHOLD=0.55
ENV PORT=8080

EXPOSE 8080

CMD ["uvicorn", "serving:app", "--host", "0.0.0.0", "--port", "8080"]
