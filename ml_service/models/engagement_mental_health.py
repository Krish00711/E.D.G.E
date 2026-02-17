"""
Engagement Prediction and Mental Health Risk Scoring
Specialized models for student wellbeing and participation
"""

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta

class EngagementPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.scaler = StandardScaler()
        
    def prepare_features(self, student_data):
        """Extract features for engagement prediction"""
        features = np.array([[
            student_data.get('recent_logins', 0) / 30,  # Normalized
            student_data.get('forum_posts', 0) / 20,
            student_data.get('assignment_submissions', 0) / 10,
            student_data.get('resource_views', 0) / 50,
            student_data.get('discussion_replies', 0) / 30,
            student_data.get('peer_interactions', 0) / 40,
            student_data.get('avg_session_duration', 0) / 120,  # minutes
            student_data.get('days_since_last_active', 0) / 7
        ]])
        return features
    
    def predict_engagement(self, student_data, historical_engagement=None):
        """Predict future engagement level"""
        features = self.prepare_features(student_data)
        
        # Calculate current engagement score
        current_score = np.mean(features[0]) * 100
        
        # Predict trend
        if historical_engagement and len(historical_engagement) >= 3:
            recent = np.array(historical_engagement[-3:])
            trend = np.polyfit(range(len(recent)), recent, 1)[0]
            predicted_next = current_score + (trend * 7)  # 7-day projection
        else:
            predicted_next = current_score
            trend = 0
        
        # Classify engagement level
        if current_score >= 70:
            level = 'high'
        elif current_score >= 40:
            level = 'moderate'
        else:
            level = 'low'
        
        # Determine trend direction
        if abs(trend) < 1:
            trend_direction = 'stable'
        elif trend > 0:
            trend_direction = 'increasing'
        else:
            trend_direction = 'decreasing'
        
        # Generate recommendations
        recommendations = self._generate_engagement_recommendations(current_score, trend_direction, features[0])
        
        return {
            'current_engagement': {
                'score': float(current_score),
                'level': level,
                'percentile': self._calculate_percentile(current_score)
            },
            'predicted_engagement': {
                'next_week_score': float(np.clip(predicted_next, 0, 100)),
                'trend': trend_direction,
                'trend_rate': float(trend)
            },
            'breakdown': {
                'login_frequency': float(features[0][0] * 100),
                'forum_participation': float(features[0][1] * 100),
                'assignment_activity': float(features[0][2] * 100),
                'resource_usage': float(features[0][3] * 100),
                'peer_interaction': float(features[0][5] * 100)
            },
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_percentile(self, score):
        """Estimate percentile based on score (simplified)"""
        percentile_map = [(20, 10), (40, 30), (60, 50), (70, 70), (85, 85), (100, 95)]
        for threshold, percentile in percentile_map:
            if score <= threshold:
                return percentile
        return 95
    
    def _generate_engagement_recommendations(self, score, trend, features):
        """Generate personalized engagement recommendations"""
        recommendations = []
        
        if score < 40:
            recommendations.append({
                'priority': 'high',
                'action': 'Immediate outreach needed',
                'description': 'Schedule one-on-one meeting to understand barriers to engagement'
            })
        
        if features[0] < 0.3:  # Low logins
            recommendations.append({
                'priority': 'high',
                'action': 'Increase platform access',
                'description': 'Send personalized reminders and relevant content notifications'
            })
        
        if features[1] < 0.2:  # Low forum participation
            recommendations.append({
                'priority': 'moderate',
                'action': 'Encourage forum participation',
                'description': 'Assign discussion-based activities or peer review tasks'
            })
        
        if features[5] < 0.3:  # Low peer interaction
            recommendations.append({
                'priority': 'moderate',
                'action': 'Foster peer connections',
                'description': 'Suggest study groups or collaborative projects'
            })
        
        if trend == 'decreasing':
            recommendations.append({
                'priority': 'high',
                'action': 'Engagement declining',
                'description': 'Investigate recent changes and provide support'
            })
        
        return recommendations[:5]  # Top 5 recommendations


class MentalHealthRiskScorer:
    def __init__(self):
        self.weights = {
            'stress_level': 0.25,
            'sleep_quality': 0.20,
            'cognitive_load': 0.20,
            'social_isolation': 0.15,
            'academic_pressure': 0.15,
            'self_reported_wellbeing': 0.05
        }
        
    def calculate_risk_score(self, student_data):
        """Calculate comprehensive mental health risk score"""
        
        # Extract and normalize metrics
        stress = student_data.get('stress_level', 5) / 10
        sleep = 1 - (student_data.get('sleep_hours_avg', 7) / 10)  # Inverted
        cognitive = student_data.get('cognitive_load_avg', 5) / 10
        social = self._assess_social_isolation(student_data)
        academic = self._assess_academic_pressure(student_data)
        wellbeing = 1 - (student_data.get('self_reported_wellbeing', 5) / 10)  # Inverted
        
        # Weighted risk score
        components = {
            'stress_level': stress,
            'sleep_quality': sleep,
            'cognitive_load': cognitive,
            'social_isolation': social,
            'academic_pressure': academic,
            'self_reported_wellbeing': wellbeing
        }
        
        risk_score = sum(
            components[key] * self.weights[key]
            for key in self.weights.keys()
        )
        
        # Determine risk level
        if risk_score < 0.3:
            risk_level = 'low'
            alert_level = 'none'
        elif risk_score < 0.6:
            risk_level = 'moderate'
            alert_level = 'watch'
        else:
            risk_level = 'high'
            alert_level = 'critical'
        
        # Identify primary concerns
        concerns = self._identify_concerns(components)
        
        # Generate recommendations
        recommendations = self._generate_mental_health_recommendations(components, risk_level)
        
        return {
            'mental_health_risk': {
                'overall_score': float(risk_score),
                'level': risk_level,
                'alert_level': alert_level
            },
            'component_scores': {
                key: float(value) for key, value in components.items()
            },
            'primary_concerns': concerns,
            'recommendations': recommendations,
            'intervention_urgency': self._calculate_urgency(risk_score, concerns),
            'timestamp': datetime.now().isoformat()
        }
    
    def _assess_social_isolation(self, data):
        """Assess social isolation level"""
        peer_interactions = data.get('peer_interaction_score', 0.5)
        forum_participation = data.get('forum_participation', 0)
        days_inactive = data.get('days_since_last_activity', 0)
        
        isolation_score = (
            (1 - peer_interactions) * 0.5 +
            (1 - forum_participation) * 0.3 +
            min(days_inactive / 7, 1) * 0.2
        )
        return isolation_score
    
    def _assess_academic_pressure(self, data):
        """Assess academic pressure level"""
        grade_avg = data.get('avg_grade', 75) / 100
        assignment_delays = data.get('submission_delays', 0) / 10
        completion_rate = data.get('assignment_completion_rate', 0.9)
        
        pressure_score = (
            (1 - grade_avg) * 0.4 +
            assignment_delays * 0.3 +
            (1 - completion_rate) * 0.3
        )
        return pressure_score
    
    def _identify_concerns(self, components):
        """Identify top concerns based on component scores"""
        concerns = []
        
        concern_descriptions = {
            'stress_level': 'Elevated stress levels detected',
            'sleep_quality': 'Poor sleep quality or insufficient rest',
            'cognitive_load': 'High cognitive load and mental fatigue',
            'social_isolation': 'Signs of social isolation',
            'academic_pressure': 'High academic pressure and workload',
            'self_reported_wellbeing': 'Low self-reported wellbeing'
        }
        
        for key, value in sorted(components.items(), key=lambda x: x[1], reverse=True):
            if value > 0.5:
                concerns.append({
                    'factor': key,
                    'description': concern_descriptions[key],
                    'severity': float(value),
                    'level': 'high' if value > 0.7 else 'moderate'
                })
        
        return concerns[:4]  # Top 4 concerns
    
    def _generate_mental_health_recommendations(self, components, risk_level):
        """Generate mental health support recommendations"""
        recommendations = []
        
        if components['stress_level'] > 0.6:
            recommendations.append({
                'category': 'stress_management',
                'priority': 'high',
                'action': 'Stress Management Support',
                'description': 'Recommend stress reduction techniques and counseling services'
            })
        
        if components['sleep_quality'] > 0.5:
            recommendations.append({
                'category': 'sleep_hygiene',
                'priority': 'high',
                'action': 'Sleep Improvement',
                'description': 'Provide sleep hygiene resources and schedule assessment'
            })
        
        if components['social_isolation'] > 0.6:
            recommendations.append({
                'category': 'social_support',
                'priority': 'high',
                'action': 'Social Connection',
                'description': 'Facilitate peer connections and group activities'
            })
        
        if components['cognitive_load'] > 0.7:
            recommendations.append({
                'category': 'workload',
                'priority': 'high',
                'action': 'Workload Assessment',
                'description': 'Review course load and consider extensions or accommodations'
            })
        
        if risk_level == 'high':
            recommendations.insert(0, {
                'category': 'urgent',
                'priority': 'critical',
                'action': 'Immediate Intervention',
                'description': 'Contact student immediately and connect with counseling services'
            })
        
        return recommendations
    
    def _calculate_urgency(self, risk_score, concerns):
        """Calculate intervention urgency"""
        high_concerns = sum(1 for c in concerns if c['level'] == 'high')
        
        if risk_score > 0.75 or high_concerns >= 3:
            return 'immediate'
        elif risk_score > 0.6 or high_concerns >= 2:
            return 'high'
        elif risk_score > 0.4:
            return 'moderate'
        else:
            return 'low'
