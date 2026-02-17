# E.D.G.E Quick Reference Guide

## 🚀 Quick Start Commands

### Start All Services
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend (port 5000)
cd server
npm run dev

# Terminal 3: ML Service (port 5001)
cd ml_service
python train.py  # First time only
python app.py

# Terminal 4: Frontend (port 5173)
npm run dev
```

### First Time Setup
```bash
# Install dependencies
npm install
cd server && npm install
cd ../ml_service && pip install -r requirements.txt

# Configure environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secret

# Train ML model
cd ml_service
python train.py
```

---

## 📊 System Overview

**Backend:** http://localhost:5000  
**ML Service:** http://localhost:5001  
**Frontend:** http://localhost:5173  

**Total Endpoints:** 157+  
**Database Collections:** 23  
**ML Features:** 12  
**Route Files:** 25  

---

## 🔑 Quick API Examples

### Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"SecurePass@2024!","role":"admin","name":"Admin"}'

# Login (save the token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"SecurePass@2024!"}'
```

### Student Overview (Comprehensive Dashboard)
```bash
curl http://localhost:5000/api/academic/student/{studentId}/overview \
  -H "Authorization: Bearer {token}"
# Returns: GPA, attendance rate, completion rate, risk level, courses
```

### Calculate Burnout Risk (12 Features)
```bash
curl -X POST http://localhost:5000/api/predictions/calculate/{studentId} \
  -H "Authorization: Bearer {token}"
# Auto-calculates all 12 features and returns risk prediction
```

### Get Transcript
```bash
curl http://localhost:5000/api/reports/transcript/{studentId} \
  -H "Authorization: Bearer {token}"
# Returns official transcript with GPA
```

### Bulk Import Grades
```bash
curl -X POST http://localhost:5000/api/bulk/grades \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"grades":[{"studentId":"...","courseId":"...","gradeType":"quiz","score":85,"maxScore":100}]}'
```

---

## 📁 Key Files & Locations

### Backend Routes (server/src/routes/)
- `grades.js` - Grade management (10 endpoints)
- `assignments.js` - Assignments & submissions (11 endpoints)
- `attendance.js` - Attendance tracking (11 endpoints)
- `enrollments.js` - Course enrollment (7 endpoints)
- `instructors.js` - Instructor management (7 endpoints)
- `notifications.js` - Notification system (8 endpoints)
- `communications.js` - Messaging (7 endpoints)
- `resources.js` - Resource library (8 endpoints)
- `forums.js` - Discussion forums (9 endpoints)
- `bulk.js` - Bulk import/export (10 endpoints)
- `academic.js` - Advanced analytics (5 endpoints)
- `predictions.js` - ML predictions (5 endpoints)
- `reports.js` - Reporting (13 endpoints)

### Database Models (server/src/models/)
- `Grade.js` - Auto letter grade calculation
- `Attendance.js` - Unique constraint per student/course/date
- `AssignmentSubmission.js` - Auto late detection
- `Notification.js` - TTL auto-expiry
- `Communication.js` - Threaded messaging
- `DiscussionForum.js` - Forums with posts/replies
- `Resource.js` - Resource library
- `Course.js` - Enhanced with prerequisites, schedules

### ML Service (ml_service/)
- `train.py` - Train model with 12 features
- `app.py` - Flask API for predictions
- `models/` - Saved models (burnout_model.pkl, scaler.pkl)

### Documentation
- `COMPREHENSIVE_FEATURES.md` - All 157 endpoints
- `FRONTEND_IMPLEMENTATION.md` - Integration guide
- `IMPLEMENTATION_SUMMARY.md` - Complete summary
- `CHECKLIST.md` - Implementation checklist
- `README.md` - Main documentation

---

## 🎯 Most Important Endpoints

### For Students
- `GET /api/academic/student/:id/overview` - Dashboard data
- `GET /api/grades/student/:id/gpa` - Current GPA
- `GET /api/attendance/student/:id/rate` - Attendance rate
- `POST /api/assignments/submit` - Submit assignment
- `GET /api/notifications` - Notifications
- `GET /api/communications/inbox` - Messages

### For Instructors
- `POST /api/grades` - Enter grade
- `POST /api/attendance` - Mark attendance
- `POST /api/attendance/bulk` - Bulk mark class
- `POST /api/assignments` - Create assignment
- `GET /api/instructors/:id/dashboard` - Dashboard
- `GET /api/courses/:id/statistics` - Course stats

### For Admins
- `POST /api/bulk/grades` - Bulk import grades
- `POST /api/bulk/attendance` - Bulk import attendance
- `GET /api/reports/analytics/overview` - System overview
- `GET /api/academic/dropout-risk` - At-risk students
- `POST /api/predictions/calculate/:id` - Calculate risk

---

## 🔧 Common Tasks

### Add New Student
```javascript
const response = await fetch('http://localhost:5000/api/students', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@test.com',
    major: 'Computer Science'
  })
})
```

### Enter Grade
```javascript
const response = await fetch('http://localhost:5000/api/grades', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    studentId: 'student-id',
    courseId: 'course-id',
    gradeType: 'quiz',
    score: 85,
    maxScore: 100
  })
})
// Letter grade auto-calculated (A, B+, etc.)
```

### Mark Attendance
```javascript
const response = await fetch('http://localhost:5000/api/attendance', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    studentId: 'student-id',
    courseId: 'course-id',
    date: '2024-01-15',
    status: 'present'  // present, absent, late, excused
  })
})
```

### Get Student Dashboard Data
```javascript
const response = await fetch(
  `http://localhost:5000/api/academic/student/${studentId}/overview`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)
const data = await response.json()
// Returns: GPA, attendance rate, completion rate, risk level, courses
```

---

## 🎨 Frontend Components Needed

### High Priority
1. **StudentDashboard** - Overview with GPA, attendance, risk
2. **GradeManager** - List and enter grades
3. **AttendanceTracker** - Calendar view and marking
4. **AssignmentPortal** - View and submit assignments
5. **NotificationCenter** - Real-time notifications

### Medium Priority
6. **InstructorDashboard** - Course management
7. **MessageInbox** - Threaded messaging
8. **ForumView** - Discussion forums
9. **ResourceLibrary** - Browse resources
10. **ReportGenerator** - Generate and export reports

---

## ⚠️ Important Notes

### Authentication
- All endpoints except `/auth/login` and `/auth/register` require JWT token
- Token in header: `Authorization: Bearer <token>`
- Default roles: student, mentor, admin

### Data Validation
- All inputs validated with Zod schemas
- Invalid data returns 400 with error details

### Auto-Calculations
- **Letter Grades**: Auto-calculated from score/maxScore
- **GPA**: Auto-updated when grades change
- **Late Submissions**: Auto-detected by comparing submission date to due date
- **Attendance Rate**: Auto-calculated from records

### Unique Constraints
- One attendance record per student/course/date
- One enrollment per student/course
- Email must be unique

---

## 📞 Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod`
- Verify `.env` file exists with MONGO_URI and JWT_SECRET
- Check port 5000 is not in use

### ML Service errors
- Run `python train.py` first to create models
- Check Python 3.9+ is installed
- Verify all packages: `pip install -r requirements.txt`

### Database errors
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database name is correct

### Authentication errors
- Check JWT_SECRET is set in `.env`
- Verify token is valid and not expired
- Check Authorization header format

---

## 🎯 Next Steps

1. **Train ML Model**: `cd ml_service && python train.py`
2. **Create Test Data**: Use Postman or curl to create sample students, courses, grades
3. **Frontend Integration**: Connect React components to API endpoints
4. **Testing**: Test all endpoints with various scenarios
5. **Deploy**: Set up production environment

---

## 📚 Full Documentation

- **All Features**: See `COMPREHENSIVE_FEATURES.md`
- **Integration Guide**: See `FRONTEND_IMPLEMENTATION.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Checklist**: See `CHECKLIST.md`
- **Main Docs**: See `README.md`

---

**Ready to build an amazing student success platform! 🎓✨**
