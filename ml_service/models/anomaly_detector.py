"""
Anomaly Detection for Student Behavior
Identifies unusual patterns that may indicate problems
"""

import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from scipy import stats

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(
            contamination=0.1,  # Expect 10% anomalies
            random_state=42,
            n_estimators=100
        )
        self.scaler = StandardScaler()
        self.feature_names = [
            'attendance_rate',
            'assignment_completion',
            'grade_avg',
            'activity_level',
            'forum_participation',
            'cognitive_load',
            'stress_level'
        ]
        
    def prepare_features(self, student_metrics):
        """Extract features for anomaly detection"""
        features = []
        for metric in student_metrics:
            features.append([
                metric.get('attendance_rate', 0.85),
                metric.get('assignment_completion', 0.9),
                metric.get('grade_avg', 0.75),
                metric.get('activity_level', 50) / 100,
                metric.get('forum_participation', 0),
                metric.get('cognitive_load', 5) / 10,
                metric.get('stress_level', 5) / 10
            ])
        return np.array(features)
    
    def fit(self, student_metrics_list):
        """Train anomaly detector on cohort data"""
        X = self.prepare_features(student_metrics_list)
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled)
        return True
    
    def detect_anomalies(self, student_data):
        """Detect if student behavior is anomalous"""
        features = self.prepare_features([student_data])
        features_scaled = self.scaler.transform(features)
        
        # Predict anomaly (-1 = anomaly, 1 = normal)
        prediction = self.model.predict(features_scaled)[0]
        anomaly_score = self.model.score_samples(features_scaled)[0]
        
        is_anomaly = prediction == -1
        
        # Identify which features are anomalous
        z_scores = np.abs(stats.zscore(features[0]))
        anomalous_features = []
        
        for i, (feature_name, z_score) in enumerate(zip(self.feature_names, z_scores)):
            if z_score > 2:  # More than 2 standard deviations
                anomalous_features.append({
                    'feature': feature_name,
                    'z_score': float(z_score),
                    'value': float(features[0][i]),
                    'severity': 'high' if z_score > 3 else 'moderate'
                })
        
        return {
            'is_anomaly': bool(is_anomaly),
            'anomaly_score': float(anomaly_score),
            'severity': self._get_severity(anomaly_score),
            'anomalous_features': sorted(anomalous_features, key=lambda x: x['z_score'], reverse=True),
            'recommendation': self._get_recommendation(is_anomaly, anomalous_features),
            'confidence': float(abs(anomaly_score))
        }
    
    def _get_severity(self, score):
        """Determine severity level of anomaly"""
        if score > -0.3:
            return 'low'
        elif score > -0.5:
            return 'moderate'
        else:
            return 'high'
    
    def _get_recommendation(self, is_anomaly, anomalous_features):
        """Generate recommendation based on anomaly type"""
        if not is_anomaly:
            return "Student behavior is within normal range"
        
        if not anomalous_features:
            return "Unusual pattern detected. Monitor closely."
        
        top_feature = anomalous_features[0]['feature']
        
        recommendations = {
            'attendance_rate': "Check for attendance issues. Consider reaching out to discuss barriers.",
            'assignment_completion': "Low assignment completion detected. Offer academic support.",
            'grade_avg': "Grade drop detected. Schedule meeting to discuss academic challenges.",
            'activity_level': "Significant change in activity. Check student engagement and wellbeing.",
            'forum_participation': "Forum participation anomaly. Encourage peer interaction.",
            'cognitive_load': "Unusual cognitive load pattern. Assess workload and stress levels.",
            'stress_level': "Stress level anomaly detected. Provide mental health resources."
        }
        
        return recommendations.get(top_feature, "Anomalous behavior detected. Follow up required.")
    
    def batch_detect(self, students_data):
        """Detect anomalies for multiple students"""
        results = []
        
        for student in students_data:
            detection = self.detect_anomalies(student['metrics'])
            if detection['is_anomaly']:
                results.append({
                    'student_id': student['id'],
                    'student_name': student.get('name', 'Unknown'),
                    **detection
                })
        
        # Sort by severity and confidence
        results.sort(key=lambda x: (
            {'high': 3, 'moderate': 2, 'low': 1}[x['severity']],
            x['confidence']
        ), reverse=True)
        
        return {
            'anomalies_detected': len(results),
            'total_analyzed': len(students_data),
            'anomaly_rate': len(results) / len(students_data) if students_data else 0,
            'students': results
        }
