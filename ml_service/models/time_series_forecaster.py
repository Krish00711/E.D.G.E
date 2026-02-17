"""
Time-Series Forecasting for Student Risk Prediction
Predicts future risk trends over time
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from scipy import stats

class TimeSeriesForecaster:
    def __init__(self):
        self.model = LinearRegression()
        self.forecast_days = 14  # Default forecast horizon
        
    def prepare_time_series(self, historical_predictions):
        """Convert historical predictions to time series format"""
        if not historical_predictions:
            return None, None
        
        df = pd.DataFrame(historical_predictions)
        df['date'] = pd.to_datetime(df['createdAt'])
        df = df.sort_values('date')
        
        # Create time index (days since first prediction)
        df['days'] = (df['date'] - df['date'].min()).dt.days
        
        return df['days'].values.reshape(-1, 1), df['riskScore'].values
    
    def fit_and_forecast(self, historical_predictions, forecast_days=None):
        """Fit model and generate forecast"""
        if forecast_days:
            self.forecast_days = forecast_days
        
        X, y = self.prepare_time_series(historical_predictions)
        
        if X is None or len(X) < 3:
            return {
                'error': 'Insufficient historical data',
                'min_required': 3,
                'available': len(historical_predictions) if historical_predictions else 0
            }
        
        # Fit linear trend
        self.model.fit(X, y)
        
        # Calculate trend statistics
        slope = self.model.coef_[0]
        r_squared = self.model.score(X, y)
        
        # Generate forecasts
        last_day = X[-1][0]
        future_days = np.array([[last_day + i] for i in range(1, self.forecast_days + 1)])
        forecast_values = self.model.predict(future_days)
        
        # Clip forecasts to valid risk range
        forecast_values = np.clip(forecast_values, 0, 1)
        
        # Calculate confidence intervals
        residuals = y - self.model.predict(X)
        std_error = np.std(residuals)
        
        forecasts = []
        for i, (day, value) in enumerate(zip(future_days.flatten(), forecast_values)):
            date = datetime.now() + timedelta(days=i+1)
            # Confidence interval widens with time
            ci_width = std_error * (1 + 0.1 * i)
            forecasts.append({
                'date': date.isoformat(),
                'days_ahead': i + 1,
                'predicted_risk': float(value),
                'confidence_interval': {
                    'lower': float(max(0, value - 1.96 * ci_width)),
                    'upper': float(min(1, value + 1.96 * ci_width))
                }
            })
        
        # Determine trend
        if abs(slope) < 0.01:
            trend = 'stable'
        elif slope > 0:
            trend = 'increasing'
        else:
            trend = 'decreasing'
        
        # Risk projection
        avg_future_risk = float(np.mean(forecast_values))
        if avg_future_risk > 0.7:
            projection = 'high_risk_ahead'
        elif avg_future_risk > 0.4:
            projection = 'moderate_risk_ahead'
        else:
            projection = 'low_risk_ahead'
        
        return {
            'forecast': forecasts,
            'trend_analysis': {
                'slope': float(slope),
                'direction': trend,
                'r_squared': float(r_squared),
                'projection': projection,
                'avg_predicted_risk': avg_future_risk
            },
            'current_risk': float(y[-1]),
            'historical_count': len(historical_predictions),
            'forecast_horizon_days': self.forecast_days
        }
    
    def detect_trend_changes(self, historical_predictions):
        """Detect significant changes in risk trends"""
        X, y = self.prepare_time_series(historical_predictions)
        
        if X is None or len(X) < 5:
            return None
        
        # Split into recent and older periods
        split_point = len(y) // 2
        recent_trend = np.mean(np.diff(y[split_point:]))
        older_trend = np.mean(np.diff(y[:split_point]))
        
        # Check for significant change
        change_magnitude = abs(recent_trend - older_trend)
        
        if change_magnitude > 0.05:  # Significant change threshold
            return {
                'trend_change_detected': True,
                'recent_trend': 'increasing' if recent_trend > 0 else 'decreasing',
                'older_trend': 'increasing' if older_trend > 0 else 'decreasing',
                'change_magnitude': float(change_magnitude),
                'alert_level': 'high' if change_magnitude > 0.1 else 'moderate'
            }
        
        return {
            'trend_change_detected': False,
            'trend': 'stable'
        }
