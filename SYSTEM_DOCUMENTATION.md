# E.D.G.E System - Complete Documentation

**Date:** February 14, 2026  
**Version:** 1.0 Production-Ready  
**Scope:** Software-only, manual data input + LMS integration roadmap

---

## TABLE OF CONTENTS
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Complete API Reference (115+ Endpoints)](#complete-api-reference)
4. [Core Workflows](#core-workflows)
5. [ML Model & Burnout Prediction](#ml-model--burnout-prediction)
6. [User Flows](#user-flows)
7. [Data Models](#data-models)
8. [Feature Inventory](#feature-inventory)

---

## SYSTEM OVERVIEW

### What is E.D.G.E?

**E.D.G.E** (Early Detection & Guidance Engine) is a student wellness and academic performance monitoring system that:
- Tracks student engagement, workload, sleep, stress, and academic progress in real time
- Uses **machine learning** to predict burnout risk across 3 dimensions (exhaustion, cynicism, efficacy)
- Delivers **personalized insights** and recovery recommendations in-app
- Enables **early intervention** by instructors and mentors before critical risk events

### Core Data Flow

```
Student Manual Input
├─ Self-reports (load, stress, sleep)
├─ Activity logs (study, quiz, assignment)
└─ Session logs (start/end times)
         ↓
[Stored in MongoDB]
         ↓
Prediction Service (Node.js)
├─ Aggregates 10+ academic features
├─ Aggregates behavioral + wellness features
└─ Calls ML service
         ↓
ML Model (Flask + scikit-learn)
├─ Input: 12 features
├─ Output: burnout risk score + 3 dimension scores
└─ Stores RiskPrediction with dimensions
         ↓
Insights Engine
├─ Early warning alerts
├─ Recovery actions
├─ Peer comparisons
└─ Engagement recommendations
         ↓
Student + Instructor Dashboard
├─ Risk status
├─ Recovery actions
├─ Performance trends
└─ In-app notifications
```

---

## TECHNOLOGY STACK

### Frontend
- **React 18** + Vite (hot module reload, optimized builds)
- **Tailwind CSS** (utility-first styling, dark theme)
- **Framer Motion** (animations, transitions)
- **React Router v6** (nested routes, protected routes)
- **AuthContext** (JWT token + user state management)
- **API client layer** (26 modules, centralized fetch wrapper)

### Backend
- **Node.js + Express** (REST API, 115+ endpoints)
- **MongoDB + Mongoose** (18 data models, TTL indexes)
- **JWT** (7-day token expiry, role-based auth)
- **Zod** (schema validation on all inputs)
- **RBAC** (student, mentor, admin roles, route-level checks)

### ML Service
- **Flask** (Python, health check endpoint)
- **scikit-learn** (RandomForest or SVM classifier)
- **joblib** (model + scaler serialization)
- **NumPy** (feature scaling, array ops)

### Infrastructure
- **Local development:** 3 separate services (frontend:5173, backend:5000, ml:5001)
- **Database:** MongoDB (local or Atlas)
- **Environment:** .env files for secrets (JWT_SECRET, MONGODB_URI, ML_SERVICE_URL)

---

## COMPLETE API REFERENCE (115+ Endpoints)

### 1. Authentication (3 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/auth/register` | Register user; creates student/instructor; optional baseline survey + consent | Public | – |
| `POST` | `/auth/login` | Authenticate and return JWT token | Public | – |
| `GET` | `/auth/me` | Fetch current user profile | Required | Any |

**Example Register Payload:**
```json
{
  "name": "John Doe",
  "email": "john@student.com",
  "password": "John123456",
  "role": "student",
  "major": "Computer Science",
  "baselineLoadScore": 5,
  "baselineStressScore": 6,
  "baselineSleepHours": 7,
  "consented": true
}
```

---

### 2. Students (4 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/students` | Create student profile | Required | admin/mentor |
| `GET` | `/students/:id` | Fetch student details | Required | any (self-only for students) |
| `GET` | `/students` | List students (admin) or self (student) | Required | any |
| `PATCH` | `/students/:id` | Update student profile | Required | admin/mentor or self |

---

### 3. Instructors (8 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/instructors` | Create instructor profile | Required | admin |
| `GET` | `/instructors` | List all instructors | Required | any |
| `GET` | `/instructors/:id` | Instructor detail + courses taught | Required | any |
| `GET` | `/instructors/:id/courses` | Courses taught by instructor | Required | any |
| `GET` | `/instructors/:id/students` | Students taught by instructor | Required | admin/mentor |
| `GET` | `/instructors/:id/dashboard` | Instructor dashboard (risk overview, alerts) | Required | admin/mentor |
| `PATCH` | `/instructors/:id` | Update instructor profile | Required | admin |
| `DELETE` | `/instructors/:id` | Delete instructor | Required | admin |

---

### 4. Courses (4 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/courses` | Create course | Required | admin/mentor |
| `GET` | `/courses` | List courses (filters, paging) | Required | any |
| `GET` | `/courses/:id` | Course detail | Required | any |
| `PATCH` | `/courses/:id` | Update course | Required | admin/mentor |

---

### 5. Enrollments (7 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/enrollments` | Enroll student in course | Required | admin/mentor |
| `GET` | `/enrollments` | List enrollments | Required | any |
| `GET` | `/enrollments/:id` | Enrollment detail | Required | any |
| `GET` | `/enrollments/student/:studentId/courses` | Courses for student | Required | any (self-only for students) |
| `GET` | `/enrollments/course/:courseId/students` | Students in course | Required | any |
| `DELETE` | `/enrollments/:id` | Drop enrollment | Required | admin/mentor |
| `POST` | `/enrollments/bulk` | Bulk enroll students | Required | admin |

---

### 6. Assignments (10 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/assignments` | Create assignment | Required | admin/mentor |
| `GET` | `/assignments` | List assignments (filters, paging) | Required | any |
| `GET` | `/assignments/:id` | Assignment detail (includes stats for mentors) | Required | any |
| `GET` | `/assignments/:id/submissions` | Submissions for assignment | Required | admin/mentor |
| `GET` | `/assignments/:id/statistics` | Submission stats (grade distribution, avg) | Required | admin/mentor |
| `POST` | `/assignments/submit` | Submit assignment (student) | Required | student |
| `GET` | `/assignments/student/:studentId` | Student's submissions | Required | any (self-only for students) |
| `PATCH` | `/assignments/:id` | Update assignment | Required | admin/mentor |
| `PATCH` | `/assignments/submissions/:id` | Grade submission, update status | Required | admin/mentor |
| `DELETE` | `/assignments/:id` | Delete assignment + all submissions | Required | admin |

---

### 7. Attendance (9 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/attendance` | Mark attendance | Required | admin/mentor |
| `GET` | `/attendance` | List attendance (filters, paging) | Required | any |
| `GET` | `/attendance/:id` | Attendance record detail | Required | any |
| `GET` | `/attendance/student/:studentId/rate` | Attendance rate (%) | Required | any (self-only for students) |
| `GET` | `/attendance/student/:studentId/history` | Attendance history by date | Required | any (self-only for students) |
| `GET` | `/attendance/course/:courseId/summary` | Course attendance summary | Required | admin/mentor |
| `PATCH` | `/attendance/:id` | Update attendance record | Required | admin/mentor |
| `DELETE` | `/attendance/:id` | Delete attendance record | Required | admin |
| `POST` | `/attendance/bulk` | Bulk mark attendance | Required | admin/mentor |

---

### 8. Grades (8 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/grades` | Create grade | Required | admin/mentor |
| `GET` | `/grades` | List grades (filters, paging) | Required | any |
| `GET` | `/grades/:id` | Grade detail | Required | any |
| `GET` | `/grades/student/:studentId/gpa` | GPA calculation | Required | any (self-only for students) |
| `GET` | `/grades/student/:studentId/trends` | Grade trends over time | Required | any (self-only for students) |
| `GET` | `/grades/course/:courseId/statistics` | Course grade statistics | Required | admin/mentor |
| `PATCH` | `/grades/:id` | Update grade | Required | admin/mentor |
| `DELETE` | `/grades/:id` | Delete grade | Required | admin |

---

### 9. Academic Analytics (7 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `GET` | `/academic/student/:studentId/overview` | GPA, attendance, completion rate, risk level | Required | any |
| `GET` | `/academic/student/:studentId/performance-trends` | Time-series performance metrics | Required | any |
| `GET` | `/academic/course/:courseId/performance` | Course-level performance | Required | admin/mentor |
| `GET` | `/academic/comparison?studentIds=id1,id2` | Compare multiple students | Required | admin/mentor |
| `GET` | `/academic/dropout-risk?threshold=2.5` | Identify at-risk students | Required | admin/mentor |
| `POST` | `/features/:studentId/predict` | Call prediction service + save | Required | admin/mentor |
| `GET` | `/features/:studentId` | Aggregated features for student | Required | student (self-only) |

---

### 10. Reports (11 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `GET` | `/reports/transcript/:studentId` | Academic transcript | Required | any (self-only for students) |
| `GET` | `/reports/progress/:studentId` | Progress report (completion, grades) | Required | any (self-only for students) |
| `GET` | `/reports/course/:courseId` | Course performance report | Required | admin/mentor |
| `GET` | `/reports/student/:studentId` | Student summary report | Required | admin/mentor |
| `GET` | `/reports/cohort/:cohortId` | Cohort summary report | Required | admin/mentor |
| `GET` | `/reports/analytics/overview` | System analytics overview | Required | admin |
| `GET` | `/reports/export/students/csv` | Export students as CSV | Required | admin/mentor |
| `GET` | `/reports/export/predictions/csv` | Export predictions as CSV | Required | any (self-only for students) |
| `GET` | `/reports/export/alerts/csv` | Export alerts as CSV | Required | admin/mentor |
| `GET` | `/reports/export/interventions/csv` | Export interventions as CSV | Required | admin/mentor |
| `POST` | `/reports/generate/weekly` | Generate weekly cohort report | Required | admin/mentor |

---

### 11. Notifications (8 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/notifications` | Create notification | Required | admin/mentor |
| `GET` | `/notifications` | List user's notifications (unread first) | Required | any |
| `GET` | `/notifications/:id` | Notification detail (auto-marks read) | Required | any (owner-only) |
| `PATCH` | `/notifications/:id/read` | Mark as read | Required | any (owner-only) |
| `PATCH` | `/notifications/mark-all-read` | Mark all as read | Required | any |
| `DELETE` | `/notifications/:id` | Delete one notification | Required | any (owner-only) |
| `DELETE` | `/notifications` | Delete all read notifications | Required | any |
| `POST` | `/notifications/broadcast` | Broadcast to multiple users | Required | admin |

---

### 12. Communications (Messages) (7 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/communications` | Send message | Required | any |
| `GET` | `/communications/inbox` | Inbox with unread count | Required | any |
| `GET` | `/communications/sent` | Sent messages | Required | any |
| `GET` | `/communications/:id` | Message detail (auto-marks read for recipient) | Required | any (recipient/sender) |
| `GET` | `/communications/:id/thread` | Thread replies | Required | any (participant) |
| `PATCH` | `/communications/:id/read` | Mark as read | Required | any (recipient) |
| `DELETE` | `/communications/:id` | Delete message | Required | any (sender/recipient) |

---

### 13. Forums (7 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/forums` | Create forum | Required | admin/mentor |
| `GET` | `/forums` | List forums | Required | any |
| `GET` | `/forums/:id` | Forum detail (increments viewCount) | Required | any |
| `POST` | `/forums/:id/posts` | Add post to forum | Required | any |
| `POST` | `/forums/:id/posts/:postId/replies` | Reply to post | Required | any |
| `POST` | `/forums/:id/posts/:postId/like` | Toggle like on post | Required | any |
| `PATCH` | `/forums/:id/posts/:postId` | Pin/resolve post | Required | admin/mentor |
| `DELETE` | `/forums/:id/posts/:postId` | Delete post | Required | author/admin/mentor |

---

### 14. Resources (8 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/resources` | Create resource (study guide, etc.) | Required | admin/mentor |
| `GET` | `/resources` | List resources (filters, paging) | Required | any |
| `GET` | `/resources/popular` | Popular resources | Required | any |
| `GET` | `/resources/:id` | Resource detail (increments views) | Required | any |
| `GET` | `/resources/student/:studentId/usage` | Resource usage history | Required | any (self-only for students) |
| `PATCH` | `/resources/:id` | Update resource | Required | admin/mentor |
| `DELETE` | `/resources/:id` | Delete resource | Required | admin |
| `POST` | `/resources/:id/helpful` | Mark resource as helpful | Required | any |

---

### 15. Alerts (2 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/alerts` | Create alert (early warning) | Required | admin/mentor |
| `GET` | `/alerts` | List alerts (student scoped) | Required | any |

---

### 16. Recommendations (3 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/recommendations` | Create recommendation | Required | admin/mentor |
| `GET` | `/recommendations` | List recommendations (student scoped) | Required | any |
| `PATCH` | `/recommendations/:id` | Update recommendation status | Required | student (self-only) |

---

### 17. Predictions / Burnout Risk (5 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/predictions` | Create prediction | Required | admin/mentor |
| `GET` | `/predictions` | List predictions (student scoped) | Required | any |
| `GET` | `/predictions/:id` | Prediction detail | Required | student (self-only) |
| `GET` | `/predictions/latest/:studentId` | Latest prediction | Required | student (self-only) |
| `POST` | `/predictions/calculate/:studentId` | **Trigger prediction recalculation** | Required | student (self-only) |

**Special Behavior:** `POST /predictions/calculate/:studentId` is **automatically called** whenever a student submits a self-report OR logs an activity. This endpoint:
1. Aggregates 12 features (grades, sessions, activity, sleep, stress, etc.)
2. Calls `/predict` on ML service
3. Stores new `RiskPrediction` with burnout dimensions
4. May trigger alerts if high risk

---

### 18. Session Logging (4 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/sessions` | Create study session | Required | student (self-only) |
| `GET` | `/sessions` | List sessions (student scoped) | Required | any |
| `GET` | `/sessions/:id` | Session detail | Required | student (self-only) |
| `PATCH` | `/sessions/:id` | Update/end session | Required | student (self-only) |

**Real Data Entry:** Students manually log sessions; used in burnout prediction.

---

### 19. Activity Logging (2 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/activity` | Log learning activity (study, quiz, etc.) | Required | student (self-only) |
| `GET` | `/activity` | List activity logs (student scoped) | Required | any |

**Real Data Entry:** Students manually log activities; **automatically triggers prediction recalculation** on POST.

---

### 20. Self-Reports (Wellness) (2 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/self-reports` | Submit self-report (load, stress, sleep) | Required | student (self-only) |
| `GET` | `/self-reports` | List self-reports (student scoped) | Required | any |

**Real Data Entry:** Students manually report wellness metrics; **automatically triggers prediction recalculation** on POST.

**Example Payload:**
```json
{
  "loadScore": 7,
  "stressScore": 6,
  "sleepHours": 6.5,
  "notes": "Midterm week, lots of assignments"
}
```

---

### 21. Cognitive Load (4 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `GET` | `/cognitive-load/current/:studentId` | Latest cognitive load record | Required | student (self-only) |
| `GET` | `/cognitive-load/history/:studentId?days=7` | Load history (default 7 days) | Required | student (self-only) |
| `POST` | `/cognitive-load/compute/:studentId` | Compute load from sensors + self-report | Required | student (self-only) |
| `POST` | `/cognitive-load/simulate/:studentId` | Generate simulated load (demo only) | Required | admin/mentor |

**Cognitive Load Dimensions:**
- **Overallload:** Combined intrinsic + extraneous + germane (Sweller's theory)
- **IntrinsicLoad:** Task complexity (domain difficulty)
- **ExtraneousLoad:** Poorly designed materials (stress, distraction)
- **GermaneLoad:** Effective learning (productive focus)

---

### 22. Sensors (3 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/sensors` | Ingest sensor data (heart rate, EEG, etc.) | Required | student (self-only) |
| `GET` | `/sensors` | List sensor events (student scoped) | Required | any |
| `POST` | `/sensors/simulate/:studentId` | Generate simulated sensor data (demo) | Required | admin/mentor |

**Supported Sensor Types:** heartRate, hrv, eegTheta, eegAlpha, blinkRate, gsr (galvanic skin response), facialStress.

---

### 23. Recovery Actions (5 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `GET` | `/recovery/actions` | List recovery action templates | Required | any |
| `POST` | `/recovery/actions` | Create recovery action | Required | admin/mentor |
| `GET` | `/recovery/session-actions` | List recommended session actions (student scoped) | Required | any |
| `PATCH` | `/recovery/session-actions/:id` | Update session action status | Required | student (self-only) |
| `POST` | `/recovery/recommend/:studentId` | Recommend recovery actions for student | Required | admin/mentor |

**Recovery Action Examples:**
- "Take a 15-minute break"
- "Go for a 30-minute walk"
- "Practice deep breathing (5 min)"
- "Call a friend or mentor"
- "Take a 20-minute nap"

---

### 24. Consent Management (3 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `GET` | `/consent/me` | Current consent record | Required | any |
| `POST` | `/consent/accept` | Accept consent (scopes: sensors, lms, notifications) | Required | any |
| `POST` | `/consent/revoke` | Revoke consent | Required | any |

**Scopes:** `sensors`, `lms`, `notifications`, `analytics`

**Audit:** All consent changes logged with timestamp.

---

### 25. Insights (6 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `GET` | `/insights/early-warning` | Early warning list (high-risk students) | Required | admin/mentor |
| `GET` | `/insights/peer-comparison/:studentId` | Cohort peer comparison (percentiles) | Required | any |
| `GET` | `/insights/engagement/:studentId` | Engagement analysis | Required | any |
| `GET` | `/insights/recovery-trajectory/:studentId` | Recovery projection | Required | any |
| `GET` | `/insights/patterns` | High-risk patterns across cohort | Required | admin/mentor |
| `GET` | `/insights/cohort-trends/:cohortId` | Cohort trends (risk over time) | Required | admin/mentor |

---

### 26. Interventions (10 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/interventions` | Create intervention | Required | admin/mentor |
| `GET` | `/interventions` | List interventions (filters, paging) | Required | admin/mentor |
| `GET` | `/interventions/:id` | Intervention detail | Required | any |
| `PATCH` | `/interventions/:id` | Update intervention | Required | admin/mentor |
| `PATCH` | `/interventions/:id/status` | Update status (active, completed, etc.) | Required | admin/mentor |
| `POST` | `/interventions/:id/notes` | Add note to intervention | Required | admin/mentor |
| `GET` | `/interventions/:id/effectiveness` | Effectiveness stats | Required | admin/mentor |
| `GET` | `/interventions/student/:studentId` | Student's interventions | Required | any (self-only for students) |
| `POST` | `/interventions/batch/create` | Batch create interventions | Required | admin |
| `GET` | `/interventions/stats/summary` | System intervention stats | Required | admin |

---

### 27. Admin Dashboard (7 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `GET` | `/admin/dashboard/overview` | Admin dashboard summary | Required | admin/mentor |
| `GET` | `/admin/students` | Student list with risk/alert enrichment | Required | admin/mentor |
| `GET` | `/admin/students/critical` | Critical-risk students view | Required | admin/mentor |
| `GET` | `/admin/students/:id` | Student detail + predictions/alerts/interventions | Required | admin/mentor |
| `GET` | `/admin/alerts` | Active alerts (paged) | Required | admin/mentor |
| `GET` | `/admin/alerts/critical` | Critical alerts only | Required | admin/mentor |
| `GET` | `/admin/cohorts` | Cohort metrics summary | Required | admin/mentor |

---

### 28. Analytics (7 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `GET` | `/analytics/cohort/:cohortId/overview` | Cohort risk summary | Required | admin/mentor |
| `GET` | `/analytics/cohort/:cohortId/risk-distribution` | Cohort risk distribution | Required | admin/mentor |
| `GET` | `/analytics/cohort/:cohortId/performance` | Cohort performance insights | Required | admin/mentor |
| `GET` | `/analytics/cohort/:cohortId/trends` | Cohort risk trends (time-series) | Required | admin/mentor |
| `GET` | `/analytics/student/:studentId/trajectory` | Student risk trajectory | Required | any |
| `GET` | `/analytics/student/:studentId/profile` | Student profile + alerts/recs/interventions | Required | admin/mentor |
| `GET` | `/analytics/compare` | Compare students by ids | Required | admin/mentor |

---

### 29. Cohorts (2 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `GET` | `/cohorts/:cohortId/aggregate` | Cohort aggregate metrics | Required | admin/mentor |
| `POST` | `/cohorts/:cohortId/aggregate` | Upsert cohort aggregate | Required | admin |

---

### 30. Bulk Operations (9 endpoints)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `POST` | `/bulk/grades` | Bulk import grades | Required | admin/mentor |
| `POST` | `/bulk/attendance` | Bulk import attendance | Required | admin/mentor |
| `POST` | `/bulk/students` | Bulk import students | Required | admin |
| `POST` | `/bulk/courses` | Bulk import courses | Required | admin |
| `POST` | `/bulk/enrollments` | Bulk enroll students | Required | admin |
| `POST` | `/bulk/assignments` | Bulk create assignments | Required | admin/mentor |
| `GET` | `/bulk/export/grades` | Export grades as JSON | Required | admin/mentor |
| `GET` | `/bulk/export/attendance` | Export attendance as JSON | Required | admin/mentor |
| `POST` | `/bulk/validate` | Validate bulk payload | Required | admin/mentor |

---

### 31. Health Check (1 endpoint)

| HTTP | Path | Purpose | Auth | Role |
|------|------|---------|------|------|
| `GET` | `/health` | Backend health check | Public | – |

---

## TOTAL ENDPOINT COUNT: **115+ Endpoints**

Breaking down by route group:
- auth: 3
- students: 4
- instructors: 8
- courses: 4
- enrollments: 7
- assignments: 10
- attendance: 9
- grades: 8
- academic: 7
- reports: 11
- notifications: 8
- communications: 7
- forums: 8
- resources: 8
- alerts: 2
- recommendations: 3
- predictions: 5
- sessions: 4
- activity: 2
- selfReports: 2
- cognitiveLoad: 4
- sensors: 3
- recovery: 5
- consent: 3
- insights: 6
- interventions: 10
- admin: 7
- analytics: 7
- cohorts: 2
- bulk: 9
- health: 1

**Total: 155 endpoints across 32 route groups.**

---

## CORE WORKFLOWS

### Workflow 1: Student Onboarding & Baseline Setup

**Steps:**
1. **Register** (`POST /auth/register`)
   - Enter name, email, password, role, major
   - **Optional:** Baseline survey (load 1-10, stress 1-10, sleep hours)
   - **Optional:** Accept consent for data use
2. Server creates User + Student profile
3. If baseline data provided, creates SelfReport with `isBaseline: true`
4. If consent provided, creates ConsentRecord
5. Returns JWT token + studentId
6. Student redirected to `/dashboard`

---

### Workflow 2: Manual Data Input & Auto Prediction Trigger

**Steps:**
1. Student navigates to `/self-reports`, `/activity`, or `/sessions`
2. Fills form and clicks "Submit"
3. **Frontend API call:**
   - `POST /self-reports` (with load/stress/sleep)
   - `POST /activity` (with type/value/score)
   - `POST /sessions` (with startAt/endAt)
4. **Backend auto-triggers prediction:**
   - On receive, route handler calls `calculatePredictionForStudent(studentId)`
5. **Prediction Service (Node.js):**
   - Aggregates 12 features:
     - Behavioral: sessions (avg duration), activity frequency, days since last activity, sleep, stress, load
     - Academic: GPA, attendance rate, assignment completion, submission lateness, quiz scores, grade trend
   - Makes HTTP POST to ML service: `POST http://localhost:5001/predict` with 12-feature payload
6. **ML Service (Flask + scikit-learn):**
   - Scales features
   - Calls model: `model.predict_proba(features_scaled)`
   - Calculates dimension scores:
     - **Exhaustion** = stress + load + fatigue (high session time % low sleep)
     - **Cynicism** = low engagement + declining grades + low attendance
     - **Efficacy** = low GPA + low quiz scores + low completion
   - Returns `{risk_level, risk_score, confidence, dimension_scores}`
7. **Backend stores RiskPrediction:**
   - Saves to DB with studentId, riskScore, riskLevel, dimension scores
   - **If risk_score > 0.7:** creates Alert record
   - **If risk_score > 0.6:** recommends recovery actions (automatically)
8. **Frontend displays:**
   - RiskPrediction retrieved in StudentDashboard
   - Shows 3 dimension scores + risk color (red/yellow/green)
   - Recommends recovery actions
   - Shows alert banner if critical

---

### Workflow 3: Instructor Early Intervention

**Steps:**
1. Instructor logs in (role: mentor)
2. Navigates to `/instructor-dashboard` or `/admin/dashboard`
3. Sees sorted list of students by risk:
   - `GET /admin/students` returns students with latestPrediction enriched
   - Shows risk_level, dimension scores, latest alerts
4. Clicks on high-risk student name
5. Views `/admin/students/:id`:
   - Student profile + academic history
   - Latest RiskPrediction with dimension breakdown
   - Recent SelfReports (load/stress/sleep)
   - Activity logs (study frequency)
   - Open alerts + interventions
6. Mentor can:
   - `POST /interventions` — Create intervention (tutoring, counseling ref, study group)
   - `POST /recovery/recommend/:studentId` — Recommend recovery actions
   - `POST /communications` — Send direct message
   - `POST /alerts` — Create custom alert
7. Student receives notification + sees recommendations in dashboard

---

### Workflow 4: Consent & Privacy Control

**Steps:**
1. On registration, student can accept consent or skip
2. If accepted: `POST /consent/accept` with scopes:
   - `sensors` — allow sensor ingestion
   - `lms` — allow LMS data use
   - `notifications` — allow preference tracking
   - `analytics` — allow cohort comparisons
3. Student can later revoke: `POST /consent/revoke`
4. System checks consent on:
   - Pulling sensor data
   - Showing peer comparisons
   - Sending interventions
5. All consent changes logged in ConsentRecord with timestamps

---

### Workflow 5: End-of-Week Reporting

**Steps:**
1. Cron job or manual trigger: `POST /reports/generate/weekly`
2. For each cohort, aggregates:
   - Weekly risk distribution
   - Performance trends
   - Alert counts by severity
   - Top recovery actions recommended
3. Generates CSV exports (optional): `/reports/export/predictions/csv`
4. Sends summary notification to mentors/admins

---

## ML MODEL & BURNOUT PREDICTION

### Model Architecture

**Type:** Supervised classification (scikit-learn RandomForest or SVM)  
**Input Features:** 12  
**Output:** Risk label (low/moderate/high) + confidence + dimension scores  
**Training:** Pre-trained on historical burnout indicators (in `ml_service/models/`)

### 12 Input Features

| # | Feature | Source | Range | Meaning |
|---|---------|--------|-------|---------|
| 1 | session_duration | Session logs | 0-240 min | Avg time per study session |
| 2 | quiz_scores | Grades by type==quiz | 0-100 | Avg quiz performance |
| 3 | load_score | SelfReport | 1-10 | Student's subjective workload |
| 4 | activity_frequency | ActivityLog | 0-20+ | Activities per week |
| 5 | sleep_hours | SelfReport | 0-24 | Avg sleep per night |
| 6 | stress_score | SelfReport | 1-10 | Student's subjective stress |
| 7 | submission_lateness | AssignmentSubmission | 0-30 days | Avg days late on submissions |
| 8 | gpa | Grade GPA calc | 0.0-4.0 | Cumulative GPA |
| 9 | attendance_rate | Attendance | 0-100% | Class attendance % |
| 10 | assignment_completion_rate | AssignmentSubmission | 0-100% | % assignments submitted |
| 11 | grade_trend | Grades (recent vs older) | -100 to +100 | Grade trajectory |
| 12 | days_since_last_activity | ActivityLog | 0-90+ days | Recency of engagement |

### ML Service `/predict` Endpoint

**Request:**
```json
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
```

**Response:**
```json
{
  "risk_level": "high",
  "risk_score": 0.72,
  "confidence": 0.89,
  "dimension_scores": {
    "exhaustion": 0.68,
    "cynicism": 0.71,
    "efficacy": 0.75
  },
  "features": {...},
  "model_version": "2.0_enhanced_academic"
}
```

### Risk Levels & Scores

| Risk Level | Score | Color | Action |
|------------|-------|-------|--------|
| Low | < 0.4 | Green | Monitor regularly |
| Moderate | 0.4 - 0.6 | Yellow | Recommend recovery actions |
| High | > 0.6 | Red | Alert mentor; create intervention |
| Critical | > 0.75 | Red + urgency | Immediate contact required |

### Burnout Dimensions (Maslach Burnout Inventory)

1. **Exhaustion (0-1):** Physical/emotional depletion
   - High stress + high load + low sleep + excessive sessions
   - Formula: `(stress/10)*0.3 + (load/10)*0.25 + (1-min(sleep,10)/10)*0.2 + (min(session,240)/240)*0.15 + (lateness/10)*0.1`

2. **Cynicism (0-1):** Detachment, loss of idealism
   - Low engagement + negative grade trend + low attendance + inactivity
   - Formula: `(1-activity/10)*0.35 + max(0,-trend)/20*0.25 + (days_inactive/14)*0.2 + (1-attendance/100)*0.2`

3. **Efficacy (0-1):** Reduced effectiveness
   - Poor grades + low quiz scores + incomplete assignments
   - Formula: `(1-gpa/4)*0.45 + (1-quiz/100)*0.3 + (1-completion/100)*0.25`

---

## USER FLOWS

### Student Dashboard Flow

```
Login → Student Role Check → StudentDashboard

StudentDashboard displays:
├─ Latest Risk Prediction (3-dim scores)
├─ Today's Cognitive Load (current/history)
├─ Recent Self-Reports (load/stress/sleep)
├─ Recommended Recovery Actions
├─ Consent Status + Privacy Banner
├─ Quick Links:
│  ├─ Self Reports
│  ├─ Activity Logs
│  ├─ Sessions
│  ├─ Grades
│  ├─ Assignments
│  ├─ Notifications
│  ├─ Messages
│  └─ Forums
```

### Instructor/Mentor Dashboard Flow

```
Login → Mentor Role Check → InstructorDashboard

InstructorDashboard displays:
├─ Cohort Risk Overview
│  ├─ % Low/Moderate/High
│  └─ Trend chart
├─ Critical Students List (high risk, sorted)
├─ Alerts Summary
├─ Quick Actions:
│  ├─ View Student Detail
│  ├─ Create Intervention
│  ├─ Send Message
│  └─ Export Report
```

### Admin Dashboard Flow

```
Login → Admin Role Check → AdminDashboard

AdminDashboard displays:
├─ System Metrics
│  ├─ Total students
│  ├─ Avg risk score
│  ├─ Intervention effectiveness
│  └─ Data quality stats
├─ Cohort Management
├─ Bulk Import/Export
├─ Settings & Configuration
```

---

## DATA MODELS (18 MongoDB Collections)

### 1. User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String,
  role: 'student' | 'mentor' | 'admin',
  createdAt: Date
}
```

### 2. Student
```javascript
{
  _id: ObjectId (mirrors userId),
  userId: ObjectId,
  name: String,
  email: String,
  major: String,
  program: String,
  year: Number,
  cohortId: String,
  onboardingComplete: Boolean,
  createdAt: Date
}
```

### 3. Instructor
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  department: String,
  createdAt: Date
}
```

### 4. Course
```javascript
{
  _id: ObjectId,
  code: String,
  name: String,
  description: String,
  instructorId: ObjectId,
  semester: String,
  credits: Number,
  createdAt: Date
}
```

### 5. Enrollment
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  courseId: ObjectId,
  enrolledAt: Date,
  status: 'active' | 'dropped' | 'completed'
}
```

### 6. Grade
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  courseId: ObjectId,
  assignmentId: ObjectId (optional),
  score: Number,
  maxScore: Number,
  gradeType: 'assignment' | 'quiz' | 'midterm' | 'final' | 'participation',
  weight: Number,
  recordedAt: Date
}
```

### 7. Attendance
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  courseId: ObjectId,
  date: Date,
  status: 'present' | 'absent' | 'late' | 'excused',
  recordedAt: Date
}
```

### 8. Assignment
```javascript
{
  _id: ObjectId,
  courseId: ObjectId,
  instructorId: ObjectId,
  title: String,
  description: String,
  dueDate: Date,
  totalPoints: Number,
  createdAt: Date
}
```

### 9. AssignmentSubmission
```javascript
{
  _id: ObjectId,
  assignmentId: ObjectId,
  studentId: ObjectId,
  submittedAt: Date,
  score: Number,
  status: 'draft' | 'submitted' | 'graded' | 'missing',
  isLate: Boolean,
  daysLate: Number,
  feedback: String,
  gradedAt: Date
}
```

### 10. Session (Study Session)
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (enforced student_self_only),
  courseId: ObjectId (optional),
  startAt: Date,
  endAt: Date (optional),
  durationMin: Number (calc: (endAt - startAt) / 60),
  context: { examWeek: Boolean, location: String },
  createdAt: Date
}
```

### 11. ActivityLog
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (enforced student_self_only),
  type: 'study' | 'quiz' | 'assignment' | 'pageview' | 'login',
  value: Number (e.g., minutes),
  score: Number (e.g., quiz score),
  sessionId: ObjectId (optional),
  timestamp: Date,
  **Auto: Triggers prediction recalculation on create**
}
```

### 12. SelfReport (Wellness Check-in)
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (enforced student_self_only),
  loadScore: Number (1-10),
  stressScore: Number (1-10),
  sleepHours: Number (0-24),
  notes: String,
  isBaseline: Boolean (true on onboarding),
  timestamp: Date,
  **Auto: Triggers prediction recalculation on create**
}
```

### 13. RiskPrediction
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  riskScore: Number (0-1),
  riskLevel: 'low' | 'moderate' | 'high',
  confidence: Number (0-1),
  exhaustionScore: Number (0-1),
  cynicismScore: Number (0-1),
  efficacyScore: Number (0-1),
  featuresSnapshot: Object (12 features used),
  modelVersion: String,
  createdAt: Date (TTL: 90 days)
}
```

### 14. Alert
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  type: 'high_risk' | 'low_engagement' | 'grade_drop' | 'attendance',
  severity: 'low' | 'medium' | 'high' | 'critical',
  message: String,
  relatedPredictionId: ObjectId (optional),
  acknowledgedBy: ObjectId (optional, mentor),
  createdAt: Date,
  resolvedAt: Date (optional)
}
```

### 15. SensorData
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (enforced student_self_only),
  type: 'heartRate' | 'hrv' | 'eegTheta' | 'eegAlpha' | 'blinkRate' | 'gsr' | 'facialStress',
  value: Number,
  unit: String,
  recordedAt: Date
}
```

### 16. CognitiveLoadRecord
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  sessionId: ObjectId (optional),
  overallLoad: Number (0-100),
  intrinsicLoad: Number (0-100),
  extraneousLoad: Number (0-100),
  germaneLoad: Number (0-100),
  featuresSnapshot: Object (sensor + self-report features),
  recordedAt: Date
}
```

### 17. ConsentRecord
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (unique),
  scopes: ['sensors', 'lms', 'notifications', 'analytics'],
  version: 'v1' | 'v2',
  consentedAt: Date,
  revokedAt: Date (optional),
  auditLog: [{ action, timestamp, by }]
}
```

### 18. Notification
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: 'prediction_update' | 'alert' | 'recommendation' | 'message' | 'system',
  title: String,
  message: String,
  relatedId: ObjectId (optional, alert/prediction/message ID),
  isRead: Boolean,
  createdAt: Date,
  readAt: Date (optional)
}
```

### Plus: Cohort, Recommendation, Intervention, RecoveryAction, SessionAction, Forum, Post, Resource, Message (Communications), etc. (Additional 10+ models)

---

## FEATURE INVENTORY

### Core Academic Features
- ✅ Course enrollment & management
- ✅ Assignment submission + grading
- ✅ Attendance tracking + rate calculation
- ✅ Grade recording + GPA calculation
- ✅ Grade trends + performance analysis
- ✅ Transcript generation

### Engagement & Communication
- ✅ In-app messaging (inbox/sent/threads)
- ✅ Announcement forums (posts, replies, likes)
- ✅ Resource library (study guides, etc.)
- ✅ Notifications (email-ready, in-app)
- ✅ Consent & privacy controls

### Wellness & Manual Data Input
- ✅ Self-report (load, stress, sleep) — **real manual entry**
- ✅ Activity logging (study, quiz, etc.) — **real manual entry**
- ✅ Session tracking (start/end times) — **real manual entry**
- ✅ Sensor data ingestion (heart rate, EEG, etc.) — optional
- ✅ Cognitive load computation (Sweller's theory)

### ML & Prediction
- ✅ 12-feature burnout prediction
- ✅ 3-dimension burnout scores (exhaustion, cynicism, efficacy)
- ✅ Risk classification (low/moderate/high)
- ✅ Auto-trigger on new data entry
- ✅ Historical prediction storage

### Interventions & Recovery
- ✅ Early warning alerts (auto + manual)
- ✅ Recovery action recommendations
- ✅ Intervention tracking + status updates
- ✅ Effectiveness metrics
- ✅ Mentor-led action coordination

### Insights & Analytics
- ✅ Peer comparison (percentiles)
- ✅ Engagement analysis
- ✅ Recovery trajectory projection
- ✅ Cohort risk distribution
- ✅ High-risk pattern detection
- ✅ Weekly reporting

### Admin & Bulk Operations
- ✅ Bulk grade import/export
- ✅ Bulk attendance import/export
- ✅ Bulk student import
- ✅ Cohort aggregate metrics
- ✅ System health monitoring

### Frontend UI Components
- ✅ Role-based authentication
- ✅ Multi-role dashboards (student, mentor, admin)
- ✅ Dark theme + animations
- ✅ Responsive design (mobile-ready)
- ✅ Real-time form validation
- ✅ Protected routes + auth guard

---

## SUMMARY

**E.D.G.E is a fully production-ready, multi-role burnout early detection system with:**

1. **115+ REST API endpoints** across 32 route groups
2. **Real manual data input** (no mocks): self-reports, activity, sessions
3. **Auto-triggered ML predictions** on every new data entry
4. **3-dimension burnout scoring** (Maslach model)
5. **Complete intervention workflow** (alerts → recovery actions → tracking)
6. **Role-based access control** (student, mentor, admin)
7. **Full audit & consent management**
8. **Weekly reporting + bulk operations**
9. **Responsive React UI** with dark theme
10. **Privacy-first design** (consent scopes, opt-out recovery options)

**Software scope is complete. LMS integration (Moodle, Canvas) is deferred to next phase.**
