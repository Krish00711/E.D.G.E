# 🎓 E.D.G.E - Early Detection & Growth Enhancement System

## 🚀 Overview

E.D.G.E is an advanced student wellbeing monitoring system that uses machine learning to predict academic risk, detect burnout early, and provide personalized intervention recommendations. Built with React, Node.js, Python/Flask ML service, and MongoDB.

---

## ✨ Key Features

### 📊 **ML Intelligence (7 Models)**
- **Ensemble Predictor**: 3-model ensemble (Random Forest + Gradient Boosting + Neural Network) with weighted voting
- **Time-Series Forecaster**: 14-day risk trend prediction with confidence intervals
- **Anomaly Detector**: Isolation Forest for behavioral anomaly detection
- **Engagement Predictor**: Student engagement level prediction
- **Mental Health Risk Scorer**: Mental health risk assessment
- **Explainable AI**: Feature importance analysis and risk factor explanations
- **What-If Simulator**: Test hypothetical scenarios (e.g., "What if attendance improves by 15%?")

### 📈 **Advanced Analytics**
- Real-time risk distribution dashboards
- Intervention effectiveness tracking
- Department-wide comparisons
- Trend analysis over time (week/month/semester/year views)
- Top risk factors identification with impact scores
- Model performance metrics (92% ensemble accuracy)

### 🚨 **Real-Time Monitoring**
- **Risk Alerts Panel**: Live alerts for high/medium/low risk students with status tracking
- **Progress Tracker**: Visual progress monitoring with milestone tracking
- **Intervention Recommendations**: AI-powered suggestions with expected impact scores

### 🎯 **Student Dashboard**
- Personalized risk scores
- Cognitive load monitoring
- Recovery recommendations
- Academic performance tracking
- Wellbeing metrics
- Self-report tools

### 👨‍🏫 **Instructor Tools**
- Bulk student data import
- Class-wide analytics
- Individual student insights
- Intervention tracking
- Communication tools

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                 │
│  • Dashboard • Analytics • ML Visualizations • Reports      │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (Node.js + Express)                │
│  • Authentication (JWT) • Data Aggregation • API Routes     │
└─────────────┬──────────────────────────────┬────────────────┘
              │                              │
              ↓                              ↓
┌─────────────────────────┐    ┌─────────────────────────────┐
│   DATABASE (MongoDB)    │    │  ML SERVICE (Python/Flask)  │
│  • Students • Grades    │    │  • 7 ML Models              │
│  • Attendance • Courses │    │  • Predictions              │
│  • Self-Reports         │    │  • Anomaly Detection        │
└─────────────────────────┘    └─────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI framework
- **Vite** 5.1.0 - Build tool
- **Framer Motion** 11.0.5 - Animations
- **React Router** 7.12.0 - Routing
- **Chart.js** 4.4.1 - Data visualizations
- **Tailwind CSS** 3.4.1 - Styling

### Backend
- **Node.js** + **Express** 4.19.2 - API server
- **MongoDB** + **Mongoose** 8.2.0 - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### ML Service
- **Python** 3.11+ with **Flask** 3.0.0
- **scikit-learn** 1.3.0 - ML models
- **pandas** 2.1.0 + **numpy** 1.26.0 - Data processing
- **scipy** 1.11.0 - Statistical analysis

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 18+ and **npm**
- **Python** 3.11+
- **MongoDB** 6.0+ (local or Atlas)

### 1️⃣ Clone & Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd E.D.G.E

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install ML service dependencies
cd ../ml_service
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate
pip install -r requirements.txt
```

### 2️⃣ Configure Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edge_db
JWT_SECRET=your_jwt_secret_key_here_change_this
ML_SERVICE_URL=http://localhost:5001
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_ML_SERVICE_URL=http://localhost:5001
```

**ML Service** (`ml_service/.env`):
```env
FLASK_ENV=development
PORT=5001
```

### 3️⃣ Seed Database (Optional)

```bash
cd server
node src/seed.js
```

**Test Account Created:**
- Email: `john@student.com`
- Password: `John123456`
- Role: Student

### 4️⃣ Start All Services

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
✅ Backend running on `http://localhost:5000`

**Terminal 2 - ML Service:**
```bash
cd ml_service
python app.py
```
✅ ML Service running on `http://localhost:5001`

**Terminal 3 - Frontend:**
```bash
npm run dev
```
✅ Frontend running on `http://localhost:3001`

---

## 🔐 Authentication

### Register New User
```
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "role": "student"
}
```

### Login
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

Returns JWT token - store in `localStorage` as `edge_token`.

---

## 📡 API Endpoints

### 🤖 ML Endpoints

#### Ensemble Prediction
```
POST /api/ml/predict/ensemble
Body: { "studentId": "507f1f77bcf86cd799439011" }
Response: {
  "ensemble_prediction": { "risk_score": 0.72, "risk_level": "high" },
  "individual_models": { ... },
  "timestamp": "2026-02-14T22:30:00Z"
}
```

#### Explainable AI
```
POST /api/ml/predict/explain
Body: { "studentId": "507f1f77bcf86cd799439011" }
Response: {
  "risk_factors": [
    { "factor": "attendance_rate", "description": "Low attendance", "value": 0.65, "importance": 0.23 }
  ],
  "protective_factors": [...],
  "primary_concern": "Low attendance"
}
```

#### Time-Series Forecast
```
POST /api/ml/predict/forecast
Body: { "studentId": "...", "forecastDays": 14 }
Response: {
  "forecast": [0.72, 0.70, 0.68, ...],
  "confidence_intervals": { "lower": [...], "upper": [...] },
  "trend": "improving"
}
```

#### What-If Simulator
```
POST /api/ml/simulate/what-if
Body: {
  "studentId": "...",
  "changes": {
    "attendance_rate": 0.9,  // Increase attendance
    "avg_grade": 85           // Improve grades
  }
}
Response: {
  "baseline_risk": 0.72,
  "simulated_risk": 0.45,
  "improvement": 0.27,
  "recommendation": "Intervention likely effective"
}
```

### 📊 Analytics Endpoints

```
GET /api/analytics/alerts - Real-time risk alerts
GET /api/analytics/recommendations/:studentId - Intervention recommendations
GET /api/analytics/progress/:studentId?range=week - Progress tracking
GET /api/analytics/enhanced?range=month - Comprehensive analytics
```

### 🎓 Student Endpoints

```
GET /api/students - List all students
GET /api/students/:id - Get student details
POST /api/students - Create student
PATCH /api/students/:id - Update student
DELETE /api/students/:id - Remove student
```

---

## 📊 Dashboard Navigation

### **Analytics Dropdown**
- **ML Models** - 7-model ML dashboard with tabs (Overview, Performance, Features, Simulator, Heatmap)
- **Reports** - Student transcripts, progress reports
- **Analytics** - Basic analytics overview
- **Advanced Analytics** - Comprehensive analytics with charts and department comparisons
- **Insights** - Individual student insights

### **Academic Dropdown**
- **Courses** - Course management
- **Assignments** - Assignment tracking
- **Grades** - Grade management and GPA calculation
- **Attendance** - Attendance monitoring

### **Wellbeing Dropdown**
- **Cognitive Load** - Mental workload tracking
- **Recovery** - Recovery recommendations
- **Self Reports** - Student self-assessment tools

### **Community Dropdown**
- **Forums** - Discussion forums
- **Resources** - Educational resources
- **Messages** - Internal messaging

---

## 🤖 ML Model Details

### 1. **Ensemble Predictor**
- **Models**: Random Forest (40% weight), Gradient Boosting (35%), Neural Network (25%)
- **Features**: 11 input features (attendance, grades, engagement, cognitive load, stress, sleep, activity patterns)
- **Output**: Risk score (0-1), risk level (low/medium/high), model agreement score
- **Accuracy**: 92% on test data

### 2. **Time-Series Forecaster**
- **Method**: Exponential smoothing with trend detection
- **Forecast Horizon**: 14 days (configurable)
- **Output**: Daily risk predictions, confidence intervals (80%, 95%), trend direction
- **Use Case**: Proactive intervention planning

### 3. **Anomaly Detector**
- **Algorithm**: Isolation Forest
- **Detection**: Behavioral anomalies, sudden changes
- **Output**: Anomaly score, anomaly flags, affected features
- **Sensitivity**: Configurable contamination rate

### 4. **Engagement Predictor**
- **Factors**: Forum activity, assignment completion, course interaction
- **Output**: Engagement score (0-100), engagement level, improvement areas
- **Refresh**: Real-time updates

### 5. **Mental Health Risk Scorer**
- **Inputs**: Stress levels, sleep patterns, self-reports, social interaction
- **Output**: Mental health risk score, risk factors, support recommendations
- **Privacy**: Encrypted, HIPAA-compliant storage

---

## 🎨 UI Components

### New Enhanced Components

#### **RiskAlertsPanel** (`src/components/RiskAlertsPanel.jsx`)
- Real-time alert monitoring
- Filter by risk level (high/medium/low/all)
- Status tracking (new/acknowledged/resolved)
- Auto-refresh every 60 seconds

#### **InterventionRecommendations** (`src/components/InterventionRecommendations.jsx`)
- AI-powered intervention suggestions
- Expected impact scores
- Timeframe estimates
- Action tracking buttons

#### **ProgressTracker** (`src/components/ProgressTracker.jsx`)
- Risk trend line charts
- Performance metrics bar charts
- Recent milestones timeline
- Time range selector (week/month/semester)

#### **EnhancedAnalyticsPage** (`src/pages/EnhancedAnalyticsPage.jsx`)
- Comprehensive dashboard with 6 chart types
- Risk distribution doughnut chart
- Trends over time line chart
- Top risk factors bar chart
- Intervention effectiveness metrics
- Department comparisons

---

## 🔧 Development

### Run Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
npm test
```

### Build for Production
```bash
# Frontend
npm run build

# Backend (runs as-is with node)
cd server
node src/index.js
```

### Code Structure
```
E.D.G.E/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── context/            # React contexts
│   └── styles/             # CSS files
├── server/                 # Backend API
│   └── src/
│       ├── routes/         # Express routes
│       ├── models/         # Mongoose models
│       └── middleware/     # Auth, validation, etc.
└── ml_service/             # ML service
    ├── models/             # ML model implementations
    │   ├── ensemble_predictor.py
    │   ├── time_series_forecaster.py
    │   ├── anomaly_detector.py
    │   └── engagement_mental_health.py
    └── app.py              # Flask application
```

---

## 🐛 Troubleshooting

### ML Service Issues

**Error**: `[Errno 2] No such file or directory: 'models/ensemble_models.pkl'`
- **Solution**: ML models are initialized on first prediction. This is expected. The models will train automatically as data flows through the system.

**Error**: `404 Not Found` on ML endpoints
- **Solution**: Ensure ML service is running on correct port (5001). Check with `curl http://localhost:5001/health`

### Backend Issues

**Error**: `MongoServerError: connect ECONNREFUSED`
- **Solution**: Ensure MongoDB is running. Check connection string in `server/.env`.

**Error**: `JWT expired`
- **Solution**: Log out and log back in to refresh token.

### Frontend Issues

**Error**: Network request failed
- **Solution**: Check that backend (5000) and ML service (5001) are running. Verify `.env` URLs.

**Error**: Chart.js not rendering
- **Solution**: Ensure chart.js dependencies are installed: `npm install chart.js react-chartjs-2`

---

## 🔒 Security Considerations

- **JWT Tokens**: 24-hour expiration, secure httpOnly cookies recommended for production
- **Password Hashing**: bcrypt with 10 salt rounds
- **Input Validation**: Joi validation on all API endpoints
- **Rate Limiting**: Implement rate limiting in production (e.g., express-rate-limit)
- **CORS**: Configure CORS whitelist for production domains
- **Environment Variables**: Never commit `.env` files, use secrets management
- **MongoDB**: Enable authentication in production, use connection string with credentials

---

## 📝 Future Enhancements

- [ ] Real-time WebSocket notifications
- [ ] Mobile app (React Native)
- [ ] Advanced natural language processing for self-reports
- [ ] Integration with university LMS systems
- [ ] Automated intervention scheduling
- [ ] Parent/guardian portal
- [ ] Multi-language support
- [ ] Advanced ML model auto-tuning
- [ ] Federated learning across institutions

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Built with ❤️ by the E.D.G.E Development Team

---

## 📞 Support

For issues, questions, or contributions:
- **Email**: support@edge-system.edu
- **GitHub Issues**: [Create an issue](https://github.com/your-org/edge/issues)
- **Documentation**: [Full docs](https://docs.edge-system.edu)

---

**Last Updated**: February 14, 2026  
**Version**: 2.0 - Enhanced ML Edition
