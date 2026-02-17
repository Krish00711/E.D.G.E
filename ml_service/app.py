import os
import joblib
import numpy as np
from flask import Flask, request, jsonify
import traceback
from datetime import datetime
import sys

# Import new ML models
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))
from models.ensemble_predictor import EnsembleRiskPredictor
from models.time_series_forecaster import TimeSeriesForecaster
from models.anomaly_detector import AnomalyDetector
from models.engagement_mental_health import EngagementPredictor, MentalHealthRiskScorer

app = Flask(__name__)

# Load model and scaler
MODEL_PATH = 'models/burnout_model.pkl'
SCALER_PATH = 'models/scaler.pkl'
METADATA_PATH = 'models/model_metadata.json'

model = None
scaler = None
model_metadata = {}
request_count = 0
prediction_history = []

# Initialize new ML models
ensemble_predictor = EnsembleRiskPredictor()
time_series_forecaster = TimeSeriesForecaster()
anomaly_detector = AnomalyDetector()
engagement_predictor = EngagementPredictor()
mental_health_scorer = MentalHealthRiskScorer()

def load_models():
    global model, scaler, model_metadata, ensemble_predictor
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        print("[ML] Models loaded successfully.")
        
        # Load metadata if exists
        if os.path.exists(METADATA_PATH):
            import json
            with open(METADATA_PATH, 'r') as f:
                model_metadata = json.load(f)
            print(f"[ML] Model metadata loaded: {model_metadata.get('version', 'unknown')}")
        else:
            model_metadata = {
                'version': '2.0_enhanced_academic',
                'trained_date': 'unknown',
                'accuracy': 'unknown'
            }
        
        # Try to load ensemble models if they exist
        try:
            if ensemble_predictor.load_models():
                print("[ML] Ensemble models loaded successfully.")
            else:
                print("[ML] Ensemble models will be initialized on first prediction.")
        except Exception as e:
            print(f"[ML] Ensemble models not found (will use defaults): {e}")
    else:
        print("[ML] WARNING: Base models not found. Using default ensemble models only.")
        model_metadata = {
            'version': '2.0_enhanced_academic',
            'trained_date': 'unknown',
            'accuracy': 'unknown'
        }

@app.route('/health', methods=['GET'])
def health():
    global request_count
    model_status = 'loaded' if model is not None else 'not_loaded'
    return {
        'status': 'ok',
        'service': 'edge-ml',
        'model_status': model_status,
        'model_version': model_metadata.get('version', 'unknown'),
        'total_predictions': request_count,
        'uptime': 'active'
    }, 200

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict burnout risk from features with enhanced academic metrics.
    
    Request body (12 features):
    {
      "session_duration": 120,
      "quiz_scores": 85,
      "load_score": 8,
      "activity_frequency": 5,
      "sleep_hours": 6,
      "stress_score": 7,
      "submission_lateness": 0,
      "gpa": 3.2,
      "attendance_rate": 85,
      "assignment_completion_rate": 90,
      "grade_trend": -5,
      "days_since_last_activity": 2
    }
    
    Response:
    {
      "risk_level": "high",
      "risk_score": 0.72,
      "confidence": 0.89,
      "features": {...},
      "dimension_scores": {...},
      "feature_importance": {...},
      "recommendations": [...]
    }
    """
    global request_count, prediction_history
    
    try:
        data = request.get_json()
        
        # Input validation
        required_features = [
            'session_duration', 'quiz_scores', 'load_score', 'activity_frequency',
            'sleep_hours', 'stress_score', 'submission_lateness', 'gpa',
            'attendance_rate', 'assignment_completion_rate', 'grade_trend',
            'days_since_last_activity'
        ]
        
        missing_features = [f for f in required_features if f not in data]
        if missing_features:
            return {
                'error': 'Missing required features',
                'missing': missing_features
            }, 400
        
        # Extract all 12 features in correct order with validation
        try:
            features = np.array([
                max(0, float(data.get('session_duration', 120))),
                max(0, min(100, float(data.get('quiz_scores', 75)))),
                max(0, min(10, float(data.get('load_score', 5)))),
                max(0, float(data.get('activity_frequency', 5))),
                max(0, min(24, float(data.get('sleep_hours', 7)))),
                max(0, min(10, float(data.get('stress_score', 5)))),
                max(0, float(data.get('submission_lateness', 0))),
                max(0, min(4.0, float(data.get('gpa', 3.0)))),
                max(0, min(100, float(data.get('attendance_rate', 80)))),
                max(0, min(100, float(data.get('assignment_completion_rate', 85)))),
                float(data.get('grade_trend', 0)),
                max(0, float(data.get('days_since_last_activity', 3)))
            ]).reshape(1, -1)
        except (ValueError, TypeError) as e:
            return {
                'error': 'Invalid feature values',
                'details': str(e)
            }, 400
        
        # Scale and predict
        features_scaled = scaler.transform(features)
        risk_label = model.predict(features_scaled)[0]
        risk_proba = model.predict_proba(features_scaled)[0]
        
        # Map label to numeric risk score (0-1 scale)
        label_to_score = {
            'low': 0.2,
            'moderate': 0.5,
            'high': 0.8
        }
        risk_score = label_to_score.get(risk_label, 0.5)
        confidence = float(max(risk_proba))
        
        # Derive burnout dimensions (0-1) from features
        def clamp(value, low=0.0, high=1.0):
            return max(low, min(high, value))

        session_duration = float(data.get('session_duration', 120))
        quiz_scores = float(data.get('quiz_scores', 75))
        load_score = float(data.get('load_score', 5))
        activity_frequency = float(data.get('activity_frequency', 5))
        sleep_hours = float(data.get('sleep_hours', 7))
        stress_score = float(data.get('stress_score', 5))
        submission_lateness = float(data.get('submission_lateness', 0))
        gpa = float(data.get('gpa', 3.0))
        attendance_rate = float(data.get('attendance_rate', 80))
        assignment_completion_rate = float(data.get('assignment_completion_rate', 85))
        grade_trend = float(data.get('grade_trend', 0))
        days_since_last_activity = float(data.get('days_since_last_activity', 3))

        exhaustion = (
            (stress_score / 10) * 0.3 +
            (load_score / 10) * 0.25 +
            (1 - min(sleep_hours, 10) / 10) * 0.2 +
            (min(session_duration, 240) / 240) * 0.15 +
            (min(submission_lateness, 10) / 10) * 0.1
        )

        cynicism = (
            (1 - min(activity_frequency, 10) / 10) * 0.35 +
            (max(0, -grade_trend) / 20) * 0.25 +
            (min(days_since_last_activity, 14) / 14) * 0.2 +
            (1 - min(attendance_rate, 100) / 100) * 0.2
        )

        efficacy = (
            (1 - min(gpa, 4.0) / 4.0) * 0.45 +
            (1 - min(quiz_scores, 100) / 100) * 0.3 +
            (1 - min(assignment_completion_rate, 100) / 100) * 0.25
        )

        dimension_scores = {
            'exhaustion': clamp(exhaustion),
            'cynicism': clamp(cynicism),
            'efficacy': clamp(efficacy)
        }
        
        # Calculate feature importance (if available from model)
        feature_importance = {}
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            feature_names = required_features
            feature_importance = {
                name: float(imp)
                for name, imp in zip(feature_names, importances)
            }
        
        # Generate recommendations based on risk factors
        recommendations = []
        if stress_score >= 7:
            recommendations.append("High stress detected - consider stress management resources")
        if sleep_hours < 6:
            recommendations.append("Insufficient sleep - aim for 7-8 hours per night")
        if gpa < 2.5:
            recommendations.append("Academic performance concern - tutoring may help")
        if attendance_rate < 75:
            recommendations.append("Low attendance - regular class attendance is important")
        if assignment_completion_rate < 70:
            recommendations.append("Assignment completion issue - time management support needed")
        
        # Update metrics
        request_count += 1
        prediction_history.append({
            'timestamp': datetime.now().isoformat(),
            'risk_level': risk_label,
            'confidence': confidence
        })
        # Keep only last 100 predictions
        if len(prediction_history) > 100:
            prediction_history = prediction_history[-100:]

        return {
            'risk_level': risk_label,
            'risk_score': float(risk_score),
            'confidence': confidence,
            'dimension_scores': dimension_scores,
            'features': data,
            'feature_importance': feature_importance,
            'recommendations': recommendations,
            'model_version': model_metadata.get('version', '2.0_enhanced_academic'),
            'prediction_id': request_count
        }, 200
    except Exception as e:
        print(f"[ML] Prediction error: {traceback.format_exc()}")
        return {
            'error': 'Prediction failed',
            'message': str(e),
            'type': type(e).__name__
        }, 500

@app.route('/predict/ensemble', methods=['POST'])
def predict_ensemble():
    """
    Enhanced ensemble prediction using multiple ML models
    """
    try:
        data = request.get_json()
        result = ensemble_predictor.predict_ensemble(data)
        return jsonify(result), 200
    except Exception as e:
        print(f"[ML] Ensemble prediction error: {traceback.format_exc()}")
        return jsonify({
            'error': 'Ensemble prediction failed',
            'message': str(e)
        }), 500

@app.route('/predict/explain', methods=['POST'])
def predict_explain():
    """
    Get detailed explanation for risk prediction
    """
    try:
        data = request.get_json()
        result = ensemble_predictor.explain_prediction(data)
        return jsonify(result), 200
    except Exception as e:
        print(f"[ML] Explain prediction error: {traceback.format_exc()}")
        return jsonify({
            'error': 'Explanation failed',
            'message': str(e)
        }), 500

@app.route('/predict/forecast', methods=['POST'])
def predict_forecast():
    """
    Time-series forecast of future risk trends
    Request: { "historical_predictions": [...], "forecast_days": 14 }
    """
    try:
        data = request.get_json()
        historical = data.get('historical_predictions', [])
        forecast_days = data.get('forecast_days', 14)
        
        result = time_series_forecaster.fit_and_forecast(historical, forecast_days)
        return jsonify(result), 200
    except Exception as e:
        print(f"[ML] Forecast error: {traceback.format_exc()}")
        return jsonify({
            'error': 'Forecasting failed',
            'message': str(e)
        }), 500

@app.route('/predict/anomaly', methods=['POST'])
def detect_anomaly():
    """
    Detect anomalous student behavior patterns
    Request: { "student_data": {...} }
    """
    try:
        data = request.get_json()
        student_data = data.get('student_data', {})
        
        result = anomaly_detector.detect_anomalies(student_data)
        return jsonify(result), 200
    except Exception as e:
        print(f"[ML] Anomaly detection error: {traceback.format_exc()}")
        return jsonify({
            'error': 'Anomaly detection failed',
            'message': str(e)
        }), 500

@app.route('/predict/engagement', methods=['POST'])
def predict_engagement():
    """
    Predict future engagement levels
    Request: { "student_data": {...}, "historical_engagement": [...] }
    """
    try:
        data = request.get_json()
        student_data = data.get('student_data', {})
        historical = data.get('historical_engagement', None)
        
        result = engagement_predictor.predict_engagement(student_data, historical)
        return jsonify(result), 200
    except Exception as e:
        print(f"[ML] Engagement prediction error: {traceback.format_exc()}")
        return jsonify({
            'error': 'Engagement prediction failed',
            'message': str(e)
        }), 500

@app.route('/predict/mental-health', methods=['POST'])
def predict_mental_health():
    """
    Assess mental health risk score
    Request: { "student_data": {...} }
    """
    try:
        data = request.get_json()
        student_data = data.get('student_data', {})
        
        result = mental_health_scorer.calculate_risk_score(student_data)
        return jsonify(result), 200
    except Exception as e:
        print(f"[ML] Mental health scoring error: {traceback.format_exc()}")
        return jsonify({
            'error': 'Mental health scoring failed',
            'message': str(e)
        }), 500

@app.route('/models/performance', methods=['GET'])
def model_performance():
    """
    Get performance metrics for all models
    """
    try:
        feature_importance = ensemble_predictor.get_feature_importance()
        
        return jsonify({
            'ensemble_models': {
                'random_forest': {
                    'status': 'active',
                    'weight': ensemble_predictor.model_weights['random_forest']
                },
                'gradient_boosting': {
                    'status': 'active',
                    'weight': ensemble_predictor.model_weights['gradient_boosting']
                },
                'neural_network': {
                    'status': 'active',
                    'weight': ensemble_predictor.model_weights['neural_network']
                }
            },
            'feature_importance': feature_importance,
            'prediction_count': request_count,
            'model_version': model_metadata.get('version', '2.0_enhanced'),
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        print(f"[ML] Performance metrics error: {traceback.format_exc()}")
        return jsonify({
            'error': 'Failed to get performance metrics',
            'message': str(e)
        }), 500

@app.route('/models/feature-importance', methods=['GET'])
def get_feature_importance():
    """
    Get feature importance rankings across all models
    """
    try:
        importance = ensemble_predictor.get_feature_importance()
        return jsonify({
            'feature_importance': importance,
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        print(f"[ML] Feature importance error: {traceback.format_exc()}")
        return jsonify({
            'error': 'Failed to get feature importance',
            'message': str(e)
        }), 500

@app.route('/simulate/what-if', methods=['POST'])
def simulate_what_if():
    """
    Simulate what-if scenarios
    Request: { "baseline": {...}, "changes": {...} }
    """
    try:
        data = request.get_json()
        baseline = data.get('baseline', {})
        changes = data.get('changes', {})
        
        # Get baseline prediction
        baseline_result = ensemble_predictor.predict_ensemble(baseline)
        
        # Apply changes
        modified_data = {**baseline, **changes}
        modified_result = ensemble_predictor.predict_ensemble(modified_data)
        
        # Calculate impact
        risk_change = modified_result['ensemble_prediction']['risk_score'] - baseline_result['ensemble_prediction']['risk_score']
        
        return jsonify({
            'baseline': baseline_result,
            'modified': modified_result,
            'impact': {
                'risk_change': float(risk_change),
                'direction': 'increased' if risk_change > 0 else 'decreased',
                'magnitude': abs(float(risk_change)),
                'significant': abs(risk_change) > 0.1
            },
            'changes_applied': changes,
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        print(f"[ML] What-if simulation error: {traceback.format_exc()}")
        return jsonify({
            'error': 'What-if simulation failed',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    load_models()
    print(f"[ML] E.D.G.E ML Service starting on port 5001...")
    print(f"[ML] Available endpoints:")
    print(f"  - GET  /health - Service health check")
    print(f"  - POST /predict - Basic risk prediction")
    print(f"  - POST /predict/ensemble - Ensemble model prediction")
    print(f"  - POST /predict/explain - Explainable AI prediction")
    print(f"  - POST /predict/forecast - Time-series forecasting")
    print(f"  - POST /predict/anomaly - Anomaly detection")
    print(f"  - POST /predict/engagement - Engagement prediction")
    print(f"  - POST /predict/mental-health - Mental health scoring")
    print(f"  - POST /simulate/what-if - What-if scenario simulation")
    print(f"  - GET  /models/performance - Model performance metrics")
    print(f"  - GET  /models/feature-importance - Feature importance")
    app.run(host='0.0.0.0', port=5001, debug=False)
