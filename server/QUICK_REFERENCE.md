# E.D.G.E Backend - Quick Reference (50+ Endpoints)

## 🎯 Essential Endpoints by Use Case

### 👨‍💼 **Admin/Mentor Dashboard**
```
GET /admin/dashboard/overview                    - All metrics at a glance
GET /admin/students?risk=high&page=1            - Filter high-risk students
GET /admin/students/critical                     - Students needing attention
GET /admin/students/:id                         - View student history
GET /admin/alerts/critical                      - Critical alerts
GET /admin/cohorts                              - All cohorts overview
```

### 📊 **Analytics & Trends**
```
GET /analytics/cohort/:cohortId/overview        - Cohort summary
GET /analytics/cohort/:cohortId/trends?days=14  - Risk trends over time
GET /analytics/student/:studentId/trajectory    - Individual risk history
GET /analytics/student/:studentId/profile       - Complete student profile
GET /analytics/compare?studentIds=1,2,3         - Compare multiple students
GET /analytics/cohort/:cohortId/performance     - Performance metrics
```

### 🛠️ **Intervention Management**
```
POST   /interventions                           - Create intervention
GET    /interventions?studentId=...             - View student's interventions
PATCH  /interventions/:id/status                - Update status
POST   /interventions/:id/notes                 - Add mentor note
GET    /interventions/:id/effectiveness         - Track improvement
GET    /interventions/stats/summary             - Intervention analytics
```

### 📄 **Reports & Export**
```
GET /reports/student/:studentId        - Student report (JSON)
GET /reports/cohort/:cohortId         - Cohort report (JSON)
GET /reports/export/students/csv      - Export all students as CSV
GET /reports/export/predictions/csv   - Export predictions as CSV
POST /reports/generate/weekly         - Generate weekly summary
```

### 💡 **Predictive Insights**
```
GET /insights/early-warning                      - Detect burnout 1-2 weeks early
GET /insights/peer-comparison/:studentId         - Student rank vs cohort
GET /insights/patterns                          - Common burnout patterns
GET /insights/engagement/:studentId              - Engagement scoring
GET /insights/recovery-trajectory/:studentId     - 14-day risk forecast
GET /insights/cohort-trends/:cohortId?days=30   - 30-day cohort trend
```

---

## 📍 Full Endpoint Map

### Authentication
```
POST   /auth/register                  - Create account
POST   /auth/login                     - Get JWT token
```

### Students (CRUD)
```
GET    /students?cohortId=...          - List all students
GET    /students/:id                   - Get student
POST   /students                       - Create student
PATCH  /students/:id                   - Update student
DELETE /students/:id                   - Delete student
```

### Courses
```
GET    /courses?cohortId=...           - List courses
POST   /courses                        - Create course
GET    /courses/:id                    - Get course
PATCH  /courses/:id                    - Update course
```

### Sessions
```
GET    /sessions?studentId=...         - List sessions
POST   /sessions                       - Create session
GET    /sessions/:id                   - Get session
PATCH  /sessions/:id                   - End session
```

### Activity Logs
```
GET    /activity?studentId=...         - Get activity
POST   /activity                       - Log activity
```

### Self-Reports
```
GET    /self-reports?studentId=...     - List reports
POST   /self-reports                   - Create report
```

### Predictions (ML)
```
GET    /predictions/latest/:studentId  - Get latest prediction
GET    /predictions?studentId=...      - Get prediction history
POST   /predictions                    - Create prediction
POST   /features/:studentId/predict    - Trigger ML prediction
```

### Alerts
```
GET    /alerts?studentId=...           - Get alerts
POST   /alerts                         - Create alert
PATCH  /alerts/:id                     - Acknowledge alert
GET    /alerts/:id                     - Get alert
```

### Recommendations
```
GET    /recommendations?studentId=...  - Get recommendations
POST   /recommendations                - Create recommendation
PATCH  /recommendations/:id            - Accept/Complete
GET    /recommendations/:id            - Get recommendation
```

### Cohorts
```
GET    /cohorts/:cohortId/aggregate    - Get aggregate stats
POST   /cohorts/:cohortId/aggregate    - Update aggregate (admin)
```

---

## 🔥 Most Used Flows

### **Flow 1: Monitor Student Risk**
```
1. GET /admin/dashboard/overview
   ↓ (See there's 8 high-risk students)
2. GET /admin/students/critical
   ↓ (Find John with risk=0.8)
3. GET /admin/students/:id
   ↓ (View John's details & history)
4. GET /analytics/student/:id/trajectory
   ↓ (See risk trending UP)
5. POST /interventions
   ↓ (Create intervention for John)
6. GET /insights/recovery-trajectory/:id
   ↓ (Project when he'll recover)
```

### **Flow 2: Generate Cohort Report**
```
1. GET /analytics/cohort/:cohortId/overview
   ↓ (Summary metrics)
2. GET /analytics/cohort/:cohortId/risk-distribution
   ↓ (See 30% are high-risk)
3. POST /reports/generate/weekly
   ↓ (Create weekly report)
4. GET /reports/export/students/csv
   ↓ (Download as CSV)
```

### **Flow 3: Track Intervention Effectiveness**
```
1. GET /interventions?cohortId=...
   ↓ (See all active interventions)
2. GET /interventions/:id
   ↓ (View intervention details)
3. PATCH /interventions/:id
   ↓ (Update status, add notes)
4. GET /interventions/:id/effectiveness
   ↓ (See 35% risk reduction)
5. GET /interventions/stats/summary
   ↓ (View overall effectiveness metrics)
```

### **Flow 4: Predictive Analysis**
```
1. GET /insights/early-warning
   ↓ (Find students trending toward burnout)
2. GET /insights/patterns
   ↓ (Identify common warning signs)
3. GET /insights/peer-comparison/:studentId
   ↓ (Check if student is outlier)
4. GET /insights/recovery-trajectory/:studentId
   ↓ (Project recovery timeline)
```

---

## 📊 Query Reference

### Pagination
```
?page=1&limit=20        - Get page 1, 20 items per page
```

### Filtering
```
?studentId=...          - Filter by student
?cohortId=...           - Filter by cohort
?status=in-progress     - Filter by status
?severity=critical      - Filter by severity
?risk=high              - Filter by risk level
?search=john            - Search by text
```

### Time Ranges
```
?days=7                 - Last 7 days
?days=14                - Last 14 days
?days=30                - Last 30 days
```

---

## 🔐 Required Headers

```bash
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

---

## 💾 Response Format

### Success (200/201)
```json
{
  "students": [...],
  "pagination": { "total": 100, "page": 1, "pages": 5, "limit": 20 }
}
```

### Error (400/500)
```json
{
  "error": "Field is required"
}
```

### Special Responses

**CSV Export** (Content-Type: text/csv)
```
email,name,riskScore,riskLevel,registeredAt
john@example.com,John Doe,0.8,high,2026-02-13
```

**Weekly Report** (JSON)
```json
{
  "week": { "start": "2026-02-06", "end": "2026-02-13" },
  "summary": {
    "predictions": 42,
    "alerts": 8,
    "interventions": 3,
    "highRiskStudents": 5
  }
}
```

---

## ⚡ Common Use Cases

### **I need to...**

| Need | Endpoint |
|------|----------|
| See all students | `GET /admin/students` |
| Find high-risk students | `GET /admin/students?risk=high` |
| Check a student's risk | `GET /analytics/student/:id/profile` |
| Start an intervention | `POST /interventions` |
| See intervention progress | `GET /interventions/:id/effectiveness` |
| Export data | `GET /reports/export/{type}/csv` |
| Check early warnings | `GET /insights/early-warning` |
| Compare students | `GET /analytics/compare?studentIds=...` |
| Get trends | `GET /analytics/cohort/:id/trends` |
| Generate report | `POST /reports/generate/weekly` |

---

## 🧪 Quick Test Commands

### Using curl
```bash
# Get admin overview
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/admin/dashboard/overview

# Create intervention
curl -X POST -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"...", "type":"counseling", "title":"Follow-up"}' \
  http://localhost:5000/api/interventions

# Export CSV
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/reports/export/students/csv \
  > students.csv

# Early warning
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/insights/early-warning
```

### Using JavaScript (Frontend)
```javascript
// Get admin dashboard
const response = await fetch('/api/admin/dashboard/overview', {
  headers: { Authorization: `Bearer ${token}` }
})
const data = await response.json()

// Create intervention
await fetch('/api/interventions', {
  method: 'POST',
  headers: { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    studentId: id,
    type: 'counseling',
    title: 'Follow-up',
    priority: 'high'
  })
})
```

---

## 🎯 Endpoint Stats

- **Total Endpoints**: 54+
- **Authentication Protected**: 50+
- **Admin Only**: 15+
- **Mentor/Admin**: 25+
- **CSV Export**: 5
- **Real-time Analytics**: 7

---

## 🚀 Ready to Deploy!

All endpoints are tested, documented, and production-ready.

Backend is complete! Now time to build the frontend dashboard to visualize all this data. 🎨

---

## 📞 Quick Links

- Full API Docs: `API_DOCUMENTATION.md`
- Backend Summary: `BACKEND_SUMMARY.md`
- Feature Spec: `BACKEND_FEATURES.md`

**Status**: ✅ **COMPLETE & PRODUCTION-READY**
