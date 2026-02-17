"""
Advanced Ensemble ML Predictor for E.D.G.E System
Combines multiple models for accurate student risk prediction
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
from datetime import datetime
import json

class EnsembleRiskPredictor:
    def __init__(self):
        self.models = {
            'random_forest': RandomForestClassifier(
                n_estimators=100,
                max_depth=15,
                min_samples_split=5,
                random_state=42
            ),
            'gradient_boosting': GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=5,
                random_state=42
            ),
            'neural_network': MLPClassifier(
                hidden_layer_sizes=(64, 32, 16),
                activation='relu',
                max_iter=1000,
                random_state=42
            )
        }
        self.scaler = StandardScaler()
        self.feature_columns = [
            'attendance_rate',
            'avg_grade',
            'assignment_completion_rate',
            'forum_participation',
            'cognitive_load_avg',
            'stress_level',
            'sleep_hours_avg',
            'days_since_last_activity',
            'total_activities',
            'submission_delays',
            'peer_interaction_score'
        ]
        self.feature_importance = {}
        self.model_weights = {
            'random_forest': 0.4,
            'gradient_boosting': 0.35,
            'neural_network': 0.25
        }
        
    def prepare_features(self, student_data):
        """Extract and prepare features from student data"""
        features = pd.DataFrame([{
            'attendance_rate': student_data.get('attendance_rate', 0.85),
            'avg_grade': student_data.get('avg_grade', 75) / 100,
            'assignment_completion_rate': student_data.get('assignment_completion_rate', 0.9),
            'forum_participation': student_data.get('forum_participation', 0),
            'cognitive_load_avg': student_data.get('cognitive_load_avg', 5) / 10,
            'stress_level': student_data.get('stress_level', 5) / 10,
            'sleep_hours_avg': student_data.get('sleep_hours_avg', 7) / 12,
            'days_since_last_activity': min(student_data.get('days_since_last_activity', 0), 30) / 30,
            'total_activities': min(student_data.get('total_activities', 0), 100) / 100,
            'submission_delays': min(student_data.get('submission_delays', 0), 10) / 10,
            'peer_interaction_score': student_data.get('peer_interaction_score', 0.5)
        }])
        return features
    
    def train(self, X_train, y_train):
        """Train all ensemble models"""
        X_scaled = self.scaler.fit_transform(X_train)
        
        training_results = {}
        for name, model in self.models.items():
            print(f"Training {name}...")
            model.fit(X_scaled, y_train)
            training_results[name] = {
                'score': model.score(X_scaled, y_train),
                'trained_at': datetime.now().isoformat()
            }
            
            # Calculate feature importance for tree-based models
            if hasattr(model, 'feature_importances_'):
                self.feature_importance[name] = dict(
                    zip(self.feature_columns, model.feature_importances_.tolist())
                )
        
        return training_results
    
    def predict_ensemble(self, student_data):
        """Make ensemble prediction combining all models"""
        features = self.prepare_features(student_data)
        X_scaled = self.scaler.transform(features)
        
        predictions = {}
        probabilities = {}
        
        for name, model in self.models.items():
            pred = model.predict(X_scaled)[0]
            proba = model.predict_proba(X_scaled)[0]
            predictions[name] = {
                'prediction': int(pred),
                'probability': float(proba[1]),  # Probability of high risk
                'confidence': float(max(proba))
            }
            probabilities[name] = proba[1]
        
        # Weighted ensemble prediction
        weighted_prob = sum(
            probabilities[name] * self.model_weights[name]
            for name in self.models.keys()
        )
        
        # Determine risk level
        if weighted_prob < 0.3:
            risk_level = 'low'
        elif weighted_prob < 0.6:
            risk_level = 'moderate'
        else:
            risk_level = 'high'
        
        return {
            'ensemble_prediction': {
                'risk_score': float(weighted_prob),
                'risk_level': risk_level,
                'confidence': float(np.std(list(probabilities.values())) < 0.15)  # Low variance = high confidence
            },
            'individual_models': predictions,
            'feature_values': features.to_dict('records')[0],
            'timestamp': datetime.now().isoformat()
        }
    
    def get_feature_importance(self):
        """Get aggregated feature importance across all models"""
        if not self.feature_importance:
            return {}
        
        # Average importance across models
        all_features = set()
        for model_imp in self.feature_importance.values():
            all_features.update(model_imp.keys())
        
        aggregated = {}
        for feature in all_features:
            importances = [
                self.feature_importance[model].get(feature, 0)
                for model in self.feature_importance.keys()
            ]
            aggregated[feature] = float(np.mean(importances))
        
        # Sort by importance
        return dict(sorted(aggregated.items(), key=lambda x: x[1], reverse=True))
    
    def explain_prediction(self, student_data):
        """Generate explanation for prediction"""
        result = self.predict_ensemble(student_data)
        feature_values = result['feature_values']
        importance = self.get_feature_importance()
        
        # Identify contributing factors
        risk_factors = []
        protective_factors = []
        
        thresholds = {
            'attendance_rate': (0.8, 'low', 'Attendance below 80%'),
            'avg_grade': (0.7, 'low', 'Average grade below 70%'),
            'assignment_completion_rate': (0.85, 'low', 'Assignment completion below 85%'),
            'cognitive_load_avg': (0.7, 'high', 'High cognitive load'),
            'stress_level': (0.6, 'high', 'Elevated stress levels'),
            'sleep_hours_avg': (0.5, 'low', 'Insufficient sleep'),
            'days_since_last_activity': (0.3, 'high', 'Low recent activity'),
            'submission_delays': (0.3, 'high', 'Frequent submission delays')
        }
        
        for feature, (threshold, direction, description) in thresholds.items():
            value = feature_values.get(feature, 0)
            if direction == 'low' and value < threshold:
                risk_factors.append({
                    'factor': feature,
                    'description': description,
                    'value': float(value),
                    'importance': importance.get(feature, 0)
                })
            elif direction == 'high' and value > threshold:
                risk_factors.append({
                    'factor': feature,
                    'description': description,
                    'value': float(value),
                    'importance': importance.get(feature, 0)
                })
            elif direction == 'low' and value >= threshold:
                protective_factors.append({
                    'factor': feature,
                    'description': f"Good {feature.replace('_', ' ')}",
                    'value': float(value)
                })
        
        # Sort by importance
        risk_factors.sort(key=lambda x: x['importance'], reverse=True)
        
        return {
            **result,
            'explanation': {
                'risk_factors': risk_factors[:5],  # Top 5
                'protective_factors': protective_factors[:3],
                'primary_concern': risk_factors[0]['description'] if risk_factors else None,
                'model_agreement': len([
                    p for p in result['individual_models'].values()
                    if abs(p['probability'] - result['ensemble_prediction']['risk_score']) < 0.15
                ]) / len(self.models)
            }
        }
    
    def save_models(self, path='models/ensemble'):
        """Save trained models"""
        joblib.dump(self.models, f'{path}_models.pkl')
        joblib.dump(self.scaler, f'{path}_scaler.pkl')
        joblib.dump(self.feature_importance, f'{path}_importance.pkl')
        return True
    
    def load_models(self, path='models/ensemble'):
        """Load trained models"""
        try:
            self.models = joblib.load(f'{path}_models.pkl')
            self.scaler = joblib.load(f'{path}_scaler.pkl')
            self.feature_importance = joblib.load(f'{path}_importance.pkl')
            return True
        except Exception as e:
            print(f"Error loading models: {e}")
            return False
