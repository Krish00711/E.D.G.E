import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import os
import json
from datetime import datetime

def generate_synthetic_data(n_samples=1000):
    """Generate synthetic burnout data for training with enhanced academic features."""
    np.random.seed(42)
    
    # Original Features with realistic correlations
    session_duration = np.random.uniform(30, 300, n_samples)  # minutes
    quiz_scores = np.random.uniform(50, 100, n_samples)
    load_score = np.random.uniform(1, 10, n_samples)
    activity_frequency = np.random.uniform(1, 20, n_samples)  # sessions/week
    sleep_hours = np.random.uniform(3, 10, n_samples)
    stress_score = np.random.uniform(1, 10, n_samples)
    submission_lateness = np.random.uniform(0, 7, n_samples)  # days late
    
    # NEW ACADEMIC FEATURES with realistic correlations
    gpa = np.random.uniform(1.5, 4.0, n_samples)  # GPA scale 0-4.0
    # Correlate attendance with GPA and stress
    attendance_rate = np.clip(
        70 + (gpa - 2.5) * 10 - (stress_score - 5) * 2 + np.random.normal(0, 5, n_samples),
        50, 100
    )
    # Correlate assignment completion with GPA
    assignment_completion_rate = np.clip(
        60 + (gpa - 2.5) * 12 + np.random.normal(0, 8, n_samples),
        40, 100
    )
    # Grade trend correlates negatively with stress and positively with sleep
    grade_trend = np.clip(
        (sleep_hours - 6.5) * 3 - (stress_score - 5) * 2 + np.random.normal(0, 3, n_samples),
        -15, 15
    )
    days_since_last_activity = np.random.uniform(0, 14, n_samples)  # days
    
    # Generate labels (synthetic burnout risk) with enhanced formula
    risk_scores = (
        (10 - load_score) * 0.08 +  # lower load = lower risk
        (sleep_hours / 10) * 0.12 +  # more sleep = lower risk
        (stress_score / 10) * 0.20 +  # higher stress = higher risk (increased weight)
        (quiz_scores / 100) * 0.10 +  # higher scores = lower risk
        (submission_lateness / 7) * 0.12 +  # more lateness = higher risk
        (gpa / 4.0) * 0.12 +  # higher GPA = lower risk (increased)
        (attendance_rate / 100) * 0.10 +  # better attendance = lower risk
        (assignment_completion_rate / 100) * 0.08 +  # better completion = lower risk
        (grade_trend / 30) * 0.04 +  # positive trend = lower risk
        (days_since_last_activity / 14) * 0.04  # more recent activity = lower risk
    )
    
    # Clip to 0-1 and categorize with adjusted thresholds
    risk_scores = np.clip(risk_scores, 0, 1)
    risk_labels = np.array([
        'low' if rs < 0.35 else 'moderate' if rs < 0.70 else 'high'
        for rs in risk_scores
    ])
    
    # Create DataFrame with all 12 features
    X = pd.DataFrame({
        'session_duration': session_duration,
        'quiz_scores': quiz_scores,
        'load_score': load_score,
        'activity_frequency': activity_frequency,
        'sleep_hours': sleep_hours,
        'stress_score': stress_score,
        'submission_lateness': submission_lateness,
        'gpa': gpa,
        'attendance_rate': attendance_rate,
        'assignment_completion_rate': assignment_completion_rate,
        'grade_trend': grade_trend,
        'days_since_last_activity': days_since_last_activity
    })
    
    y = risk_labels
    
    return X, y, risk_scores

def train_model():
    """Train and save the burnout prediction model with cross-validation."""
    print("[ML] Generating synthetic data...")
    X, y, risk_scores = generate_synthetic_data(1000)
    
    print(f"[ML] Generated {len(X)} samples with class distribution:")
    print(pd.Series(y).value_counts())
    
    print("[ML] Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("[ML] Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train multiple models and compare
    print("[ML] Training and comparing models...")
    models = {
        'RandomForest': RandomForestClassifier(n_estimators=150, max_depth=12, min_samples_split=4, random_state=42),
        'GradientBoosting': GradientBoostingClassifier(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42)
    }
    
    best_model = None
    best_score = 0
    best_name = ''
    
    for name, model in models.items():
        print(f"\n[ML] Training {name}...")
        model.fit(X_train_scaled, y_train)
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
        print(f"[ML] {name} CV scores: {cv_scores}")
        print(f"[ML] {name} Mean CV accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
        
        # Test evaluation
        train_acc = model.score(X_train_scaled, y_train)
        test_acc = model.score(X_test_scaled, y_test)
        print(f"[ML] {name} Train accuracy: {train_acc:.3f}, Test accuracy: {test_acc:.3f}")
        
        if test_acc > best_score:
            best_score = test_acc
            best_model = model
            best_name = name
    
    print(f"\n[ML] Best model: {best_name} with test accuracy: {best_score:.3f}")
    
    # Detailed evaluation of best model
    y_pred = best_model.predict(X_test_scaled)
    print("\n[ML] Classification Report:")
    print(classification_report(y_test, y_pred))
    
    print("\n[ML] Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Feature importance
    if hasattr(best_model, 'feature_importances_'):
        feature_importance = pd.DataFrame({
            'feature': X.columns,
            'importance': best_model.feature_importances_
        }).sort_values('importance', ascending=False)
        print("\n[ML] Feature Importance:")
        print(feature_importance)
    
    # Save model,scaler, and metadata
    os.makedirs('models', exist_ok=True)
    joblib.dump(best_model, 'models/burnout_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    # Save metadata
    metadata = {
        'version': '2.1_enhanced_academic_validated',
        'trained_date': datetime.now().isoformat(),
        'model_type': best_name,
        'train_accuracy': float(best_model.score(X_train_scaled, y_train)),
        'test_accuracy': float(best_score),
        'cv_mean': float(cross_val_score(best_model, X_train_scaled, y_train, cv=5).mean()),
        'n_samples': len(X),
        'n_features': len(X.columns),
        'feature_names': list(X.columns)
    }
    
    with open('models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("\n[ML] Model, scaler, and metadata saved.")
    print(f"[ML] Model metadata: {metadata}")
    
    return best_model, scaler, metadata

if __name__ == '__main__':
    train_model()
