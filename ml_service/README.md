# EDGE ML Service

Separate Python service for burnout prediction using scikit-learn.

## Setup

```bash
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python train.py        # Train model
python app.py          # Start Flask server (port 5001)
```

## Endpoints

- `GET /health` - Service health check
- `POST /predict` - Predict burnout risk from features

## Feature Format

```json
{
  "session_duration": 120,
  "quiz_scores": 85,
  "load_score": 8,
  "activity_frequency": 5,
  "sleep_hours": 6,
  "stress_score": 7,
  "submission_lateness": 0
}
```
