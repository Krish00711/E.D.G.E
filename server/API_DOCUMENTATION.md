# E.D.G.E Backend - Complete API Documentation

## Base URL: `http://localhost:5000/api`

---

## **🔐 Authentication**

### Register
- **POST** `/auth/register`
- **Body**: `{ name, email, password, role: 'student'|'mentor'|'admin' }`
- **Response**: `{ id, email, role }`

### Login
- **POST** `/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ token, sub (user_id), role, email }`

---

## **👥 Students**

### List Students
- **GET** `/students` (paginated)
- **Query**: `?cohortId=...&page=1&limit=20`

### Get Student
- **GET** `/students/:id`

### Create Student
- **POST** `/students`
- **Body**: `{ name, email, cohortId, password }`

---

## **📊 ANALYTICS** (NEW)

### Cohort Overview
- **GET** `/analytics/cohort/:cohortId/overview`
- Returns: Total students, avg risk, risk distribution, active alerts/interventions

### Risk Distribution
- **GET** `/analytics/cohort/:cohortId/risk-distribution`
- Returns: Count of low/moderate/high risk students

### Cohort Trends (14+ days)
- **GET** `/analytics/cohort/:cohortId/trends?days=14`
- Returns: Daily average risk, distribution over time

### Student Trajectory
- **GET** `/analytics/student/:studentId/trajectory`
- Returns: Individual risk predictions over time, trend (rising/falling)

### Student Profile
- **GET** `/analytics/student/:studentId/profile`
- Returns: Full student profile, current risk, active interventions, recommendations

### Compare Students
- **GET** `/analytics/compare?studentIds=id1,id2,id3`
- Returns: Side-by-side comparison of multiple students

### Cohort Performance
- **GET** `/analytics/cohort/:cohortId/performance`
- Returns: Intervention effectiveness, recommendation adoption, metrics

---

## **👨‍💼 ADMIN DASHBOARD** (NEW)

### Get All Students (Filtered)
- **GET** `/admin/students?risk=high&cohort=...&page=1&limit=20&search=...`
- Returns: Paginated list with risk levels, alerts

### Get Critical Students
- **GET** `/admin/students/critical`
- Returns: High-risk students requiring immediate attention

### Get Student Detail
- **GET** `/admin/students/:id`
- Returns: Full history (predictions, alerts, interventions)

### Get Critical Alerts
- **GET** `/admin/alerts/critical`
- Returns: All active critical alerts

### Get All Alerts
- **GET** `/admin/alerts?page=1&limit=20&severity=critical`
- Returns: Paginated alerts with filters

### Get All Cohorts
- **GET** `/admin/cohorts`
- Returns: All cohorts with student counts, avg risk, high-risk counts

### Dashboard Overview
- **GET** `/admin/dashboard/overview`
- Returns: Summary metrics (total students, alerts, interventions, risk distribution)

---

## **🛠️ INTERVENTIONS** (NEW)

### Create Intervention
- **POST** `/interventions`
- **Body**: `{ studentId, type, title, description, actionItems[], priority, severity, targetDate }`
- **Types**: `counseling|schedule-break|support-group|course-adjustment|workload-reduction|mentoring`

### List Interventions
- **GET** `/interventions?studentId=...&cohortId=...&status=in-progress&page=1&limit=20`
- Returns: Paginated interventions

### Get Intervention
- **GET** `/interventions/:id`
- Returns: Full intervention detail with notes

### Update Intervention
- **PATCH** `/interventions/:id`
- **Body**: `{ status, outcome, effectiveness, riskAfter, notes }`

### Update Status
- **PATCH** `/interventions/:id/status`
- **Body**: `{ status: 'planned'|'in-progress'|'completed'|'paused'|'cancelled' }`

### Add Note
- **POST** `/interventions/:id/notes`
- **Body**: `{ text }`

### Get Effectiveness
- **GET** `/interventions/:id/effectiveness`
- Returns: Risk reduction %, duration, outcome

### Get Student Interventions
- **GET** `/interventions/student/:studentId`
- Returns: All interventions for a student

### Create Batch Interventions
- **POST** `/interventions/batch/create` (Admin only)
- **Body**: `{ interventions: [{ studentId, type, title, ... }] }`

### Interventions Summary
- **GET** `/interventions/stats/summary` (Admin only)
- Returns: Total, by status, by priority, effectiveness metrics

---

## **📄 REPORTS & EXPORT** (NEW)

### Student Report
- **GET** `/reports/student/:studentId`
- Returns: Full student report with all data

### Cohort Report
- **GET** `/reports/cohort/:cohortId`
- Returns: Cohort-level summary with student breakdowns

### Export Students to CSV
- **GET** `/reports/export/students/csv?cohortId=...`
- Returns: CSV file with all student data

### Export Predictions to CSV
- **GET** `/reports/export/predictions/csv?studentId=...`
- Returns: CSV file with prediction history

### Export Alerts to CSV
- **GET** `/reports/export/alerts/csv`
- Returns: CSV file with all alerts

### Export Interventions to CSV
- **GET** `/reports/export/interventions/csv`
- Returns: CSV file with intervention data

### Generate Weekly Report
- **POST** `/reports/generate/weekly`
- **Body**: `{ cohortId }`
- Returns: Weekly summary with predictions, alerts, interventions

---

## **💡 INSIGHTS & PREDICTIONS** (NEW)

### Early Warning
- **GET** `/insights/early-warning` (Mentor/Admin only)
- Returns: Students at risk of burnout in next 1-2 weeks

### Peer Comparison
- **GET** `/insights/peer-comparison/:studentId`
- Returns: Student's rank, percentile, vs cohort metrics

### Burnout Patterns
- **GET** `/insights/patterns` (Mentor/Admin only)
- Returns: Common alert patterns, affected students

### Engagement Analysis
- **GET** `/insights/engagement/:studentId`
- Returns: Activity frequency, consistency, engagement score (0-100)

### Recovery Trajectory
- **GET** `/insights/recovery-trajectory/:studentId`
- Returns: 14-day risk projection with intervention effects

### Cohort Trends
- **GET** `/insights/cohort-trends/:cohortId?days=30` (Mentor/Admin only)
- Returns: 30-day trend analysis, overall direction

---

## **⚠️ ALERTS**

### Get Active Alerts
- **GET** `/alerts?studentId=...&status=active`

### Create Alert
- **POST** `/alerts`
- **Body**: `{ studentId, severity, message }`
- **Severity**: `low|medium|critical`

### Acknowledge Alert
- **PATCH** `/alerts/:id`
- **Body**: `{ status: 'acknowledged'|'closed' }`

---

## **💬 RECOMMENDATIONS**

### Get Recommendations
- **GET** `/recommendations?studentId=...`

### Create Recommendation
- **POST** `/recommendations`
- **Body**: `{ studentId, message, type, priority }`

### Update Recommendation
- **PATCH** `/recommendations/:id`
- **Body**: `{ status: 'accepted'|'completed'|'rejected' }`

---

## **🔮 PREDICTIONS**

### Get Latest Prediction
- **GET** `/predictions/latest/:studentId`

### Create Prediction
- **POST** `/predictions`
- **Body**: `{ studentId, riskScore, riskLevel, confidence }`

### Get Prediction History
- **GET** `/predictions?studentId=...&limit=20`

---

## **📚 COURSES**

### List Courses
- **GET** `/courses?cohortId=...`

### Create Course
- **POST** `/courses`
- **Body**: `{ name, code, cohortId, instructor }`

---

## **📋 SESSIONS**

### List Sessions
- **GET** `/sessions?studentId=...`

### Create Session
- **POST** `/sessions`
- **Body**: `{ studentId, startAt, courseId, context }`

### End Session
- **PATCH** `/sessions/:id`
- **Body**: `{ endAt }`

---

## **🎯 ACTIVITY LOGS**

### Log Activity
- **POST** `/activity`
- **Body**: `{ studentId, type, data }`
- **Types**: `login|submission|quiz|assignment|attendance`

### Get Activity
- **GET** `/activity?studentId=...&days=7`

---

## **📌 COHORTS**

### Get Cohort Aggregate
- **GET** `/cohorts/:cohortId/aggregate`
- Returns: Period aggregates

### Update Cohort Aggregate
- **POST** `/cohorts/:cohortId/aggregate` (Admin only)
- **Body**: `{ period, avgRisk, highRiskCount, avgLoad }`

---

## **🤖 ML FEATURES**

### Generate Prediction
- **POST** `/features/:studentId/predict`
- Triggers ML model inference

---

## **🏥 SELF-REPORTS**

### Get Self-Reports
- **GET** `/self-reports?studentId=...`

### Create Self-Report
- **POST** `/self-reports`
- **Body**: `{ studentId, stressLevel, sleepHours, workload, mood, notes }`

---

## **Implementation Timeline**

✅ **Completed**:
- Analytics (cohort/student/comparative)
- Admin Dashboard (all students, critical, alerts)
- Interventions (CRUD, effectiveness tracking)
- Reports & Export (CSV, weekly reports)
- Insights (early warning, patterns, peer comparison, recovery trajectory)
- Route Registration

**Next Steps**:
1. Frontend dashboard to display this data
2. WebSocket for real-time alerts
3. Batch operations & scheduled reports
4. Advanced ML model fine-tuning

---

## **Error Handling**

All endpoints return standard error format:
```json
{
  "error": "Description of error"
}
```

Common status codes:
- 200: Success
- 201: Created (POST)
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

---

## **Authentication**

All endpoints (except `/auth/register` and `/auth/login`) require:
- **Header**: `Authorization: Bearer {token}`

Some endpoints require admin/mentor role:
- Mark endpoints with **(Mentor/Admin only)** or **(Admin only)**

---

## **Rate Limits**

- No hard limits yet
- Recommend: 1000 requests/hour per user

---

## **Testing Credentials**

```
Student:
- Email: john@example.com
- Password: SecurePass@2024!

Admin:
- Email: admin@example.com
- Password: admin12345
```

---

## **Database Models**

✅ Created:
- User, Student, Course, Instructor, Enrollment
- Session, ActivityLog, SelfReport
- RiskPrediction, Alert, Recommendation
- CohortAggregate
- **NEW**: Intervention, AuditLog, SystemMetrics

---

## **Next Backend Features**

- [ ] WebSocket support for real-time alerts
- [ ] Scheduled reports (automated weekly emails)
- [ ] Batch data import (CSV upload)
- [ ] Advanced filtering & search
- [ ] Data retention policies
- [ ] System audit logs
- [ ] Performance monitoring APIs
- [ ] Configuration endpoints
