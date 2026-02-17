# E.D.G.E Frontend Implementation Guide

## Overview
This guide helps frontend developers integrate the comprehensive E.D.G.E backend API with 157+ endpoints covering academic management, student support, and burnout prediction.

---

## Getting Started

### 1. Base URL
```javascript
const API_BASE_URL = 'http://localhost:5000/api'
const ML_SERVICE_URL = 'http://localhost:5001'
```

### 2. Authentication Setup

All authenticated requests require JWT token in Authorization header:

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await response.json()
  localStorage.setItem('token', data.token)
  return data
}

// Authenticated Request Helper
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  }
  
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })
}
```

---

## Core Feature Implementation

### 1. Student Dashboard

```javascript
// Get comprehensive student overview
const getStudentOverview = async (studentId) => {
  const response = await authenticatedFetch(`/academic/student/${studentId}/overview`)
  return response.json()
  /* Returns:
  {
    studentId,
    currentGPA: 3.45,
    attendanceRate: 87.5,
    assignmentCompletionRate: 92.3,
    enrolledCourses: 4,
    totalGrades: 23,
    academicStanding: "Good Standing",
    currentRiskLevel: "low",
    courses: [...]
  }
  */
}

// Get performance trends (last 90 days)
const getPerformanceTrends = async (studentId, days = 90) => {
  const response = await authenticatedFetch(
    `/academic/student/${studentId}/performance-trends?days=${days}`
  )
  return response.json()
  /* Returns:
  {
    trends: [
      {
        week: "2024-W10",
        averageGrade: 85.3,
        attendanceRate: 90,
        onTimeSubmissionRate: 95
      },
      ...
    ]
  }
  */
}
```

**UI Components Needed:**
- Dashboard card showing GPA, attendance, completion rate
- Line chart for performance trends
- Risk indicator badge
- Course list with enrollment status

---

### 2. Grade Management

```javascript
// Get student's GPA
const getStudentGPA = async (studentId) => {
  const response = await authenticatedFetch(`/grades/student/${studentId}/gpa`)
  return response.json()
  /* Returns:
  {
    gpa: 3.45,
    totalGrades: 23,
    totalCredits: 45,
    breakdown: { ... }
  }
  */
}

// Get grade trends
const getGradeTrends = async (studentId) => {
  const response = await authenticatedFetch(`/grades/student/${studentId}/trends`)
  return response.json()
  /* Returns:
  {
    trend: "improving",
    recentGrades: [...],
    percentageChange: 5.2
  }
  */
}

// Create grade (instructor/admin only)
const createGrade = async (gradeData) => {
  return authenticatedFetch('/grades', {
    method: 'POST',
    body: JSON.stringify({
      studentId: '...',
      courseId: '...',
      assignmentId: '...',  // optional
      gradeType: 'quiz',  // quiz, exam, assignment, project, participation, midterm, final
      score: 85,
      maxScore: 100,
      weight: 1.0,
      feedback: 'Good work!'
    })
  })
}
```

**UI Components:**
- GPA calculator display
- Grade list table (sortable by date, course, type)
- Grade trend chart
- Grade entry form (instructors)
- Letter grade badges (A+, A, B+, etc.)

---

### 3. Attendance Tracking

```javascript
// Mark attendance (instructor)
const markAttendance = async (data) => {
  return authenticatedFetch('/attendance', {
    method: 'POST',
    body: JSON.stringify({
      studentId: '...',
      courseId: '...',
      date: '2024-01-15',
      status: 'present',  // present, absent, late, excused
      notes: 'Optional notes'
    })
  })
}

// Bulk mark attendance for whole class
const bulkMarkAttendance = async (courseId, date, studentStatuses) => {
  return authenticatedFetch('/attendance/bulk', {
    method: 'POST',
    body: JSON.stringify({
      courseId,
      date,
      records: studentStatuses.map(s => ({
        studentId: s.id,
        status: s.status
      }))
    })
  })
}

// Get student attendance rate
const getAttendanceRate = async (studentId, courseId = null) => {
  const url = courseId 
    ? `/attendance/student/${studentId}/rate?courseId=${courseId}`
    : `/attendance/student/${studentId}/rate`
  const response = await authenticatedFetch(url)
  return response.json()
  /* Returns:
  {
    totalRecords: 45,
    present: 38,
    absent: 5,
    late: 2,
    excused: 0,
    attendanceRate: 88.9
  }
  */
}
```

**UI Components:**
- Attendance marking grid (instructor)
- Attendance calendar view
- Attendance rate progress bar
- Attendance history list
- Status badges (present/absent/late/excused)

---

### 4. Assignment Management

```javascript
// Create assignment (instructor)
const createAssignment = async (assignmentData) => {
  return authenticatedFetch('/assignments', {
    method: 'POST',
    body: JSON.stringify({
      courseId: '...',
      title: 'Homework 5',
      description: 'Complete exercises 1-10',
      dueDate: '2024-01-30T23:59:59Z',
      maxPoints: 100,
      submissionType: 'file',  // file, text, url
      allowLateSubmissions: true,
      latePenalty: 10  // percentage per day
    })
  })
}

// Submit assignment (student)
const submitAssignment = async (assignmentId, submissionData) => {
  return authenticatedFetch('/assignments/submit', {
    method: 'POST',
    body: JSON.stringify({
      assignmentId,
      submittedFiles: ['https://...'],  // file URLs
      submissionText: 'My solution...',
      timeSpent: 120  // minutes
    })
  })
}

// Get assignment statistics (instructor)
const getAssignmentStats = async (assignmentId) => {
  const response = await authenticatedFetch(`/assignments/${assignmentId}/statistics`)
  return response.json()
  /* Returns:
  {
    totalSubmissions: 28,
    onTime: 24,
    late: 4,
    missing: 2,
    averageScore: 85.3,
    averageTimeSpent: 95,
    averageDaysLate: 1.5
  }
  */
}
```

**UI Components:**
- Assignment list (upcoming, past, overdue)
- Assignment detail card with due date countdown
- File upload component
- Submission history
- Grading interface (instructor)
- Statistics dashboard (instructor)

---

### 5. Burnout Risk Prediction

```javascript
// Calculate burnout risk with 12 enhanced features
const calculateRiskPrediction = async (studentId) => {
  const response = await authenticatedFetch(
    `/predictions/calculate/${studentId}`,
    { method: 'POST' }
  )
  return response.json()
  /* Returns:
  {
    prediction: {
      riskScore: 0.72,
      riskLevel: "high",
      confidence: 0.89
    },
    features: {
      gpa: 2.4,
      attendance_rate: 65,
      assignment_completion_rate: 70,
      grade_trend: -8.5,
      stress_score: 8,
      sleep_hours: 5,
      ...
    }
  }
  */
}

// Get latest prediction
const getLatestPrediction = async (studentId) => {
  const response = await authenticatedFetch(`/predictions/latest/${studentId}`)
  return response.json()
}
```

**UI Components:**
- Risk level indicator (low/moderate/high) with color coding
- Confidence score display
- Contributing factors breakdown
- Trend chart of risk over time
- Alert banner for high risk
- Recommended interventions

---

### 6. Notifications

```javascript
// Get user notifications
const getNotifications = async () => {
  const response = await authenticatedFetch('/notifications')
  return response.json()
  /* Returns:
  {
    notifications: [...],
    unreadCount: 5
  }
  */
}

// Mark notification as read
const markNotificationRead = async (notificationId) => {
  return authenticatedFetch(`/notifications/${notificationId}/read`, {
    method: 'PATCH'
  })
}

// Mark all as read
const markAllRead = async () => {
  return authenticatedFetch('/notifications/mark-all-read', {
    method: 'PATCH'
  })
}
```

**UI Components:**
- Notification bell icon with badge counter
- Notification dropdown/panel
- Notification list with read/unread states
- Notification settings

---

### 7. Messaging System

```javascript
// Send message
const sendMessage = async (recipientId, subject, content, courseId = null) => {
  return authenticatedFetch('/communications', {
    method: 'POST',
    body: JSON.stringify({
      recipientId,
      subject,
      content,
      courseId,  // optional
      attachments: []  // optional file URLs
    })
  })
}

// Get inbox
const getInbox = async () => {
  const response = await authenticatedFetch('/communications/inbox')
  return response.json()
  /* Returns:
  {
    messages: [...],
    unreadCount: 3
  }
  */
}

// Get message thread
const getThread = async (messageId) => {
  const response = await authenticatedFetch(`/communications/${messageId}/thread`)
  return response.json()
}
```

**UI Components:**
- Inbox list view
- Message detail view with threading
- Compose message modal
- Message search/filter
- Unread count badge

---

### 8. Discussion Forums

```javascript
// Get course forums
const getCourseForums = async (courseId) => {
  const response = await authenticatedFetch(`/forums?courseId=${courseId}`)
  return response.json()
}

// Add post to forum
const addForumPost = async (forumId, content) => {
  return authenticatedFetch(`/forums/${forumId}/posts`, {
    method: 'POST',
    body: JSON.stringify({ content })
  })
}

// Reply to post
const replyToPost = async (forumId, postId, content) => {
  return authenticatedFetch(`/forums/${forumId}/posts/${postId}/replies`, {
    method: 'POST',
    body: JSON.stringify({ content })
  })
}

// Like post
const likePost = async (forumId, postId) => {
  return authenticatedFetch(`/forums/${forumId}/posts/${postId}/like`, {
    method: 'POST'
  })
}
```

**UI Components:**
- Forum list
- Post list with likes and reply counts
- Post detail with nested replies
- Reply form
- Like button
- Pin/resolve indicators (instructor)

---

### 9. Reports & Analytics

```javascript
// Get transcript
const getTranscript = async (studentId) => {
  const response = await authenticatedFetch(`/reports/transcript/${studentId}`)
  return response.json()
  /* Returns:
  {
    student: { ... },
    transcript: [
      {
        courseCode: "CS101",
        courseTitle: "Intro to CS",
        credits: 3,
        grade: "A",
        gradePoints: 4.0
      },
      ...
    ],
    summary: {
      totalCredits: 45,
      cumulativeGPA: 3.45
    }
  }
  */
}

// Get progress report
const getProgressReport = async (studentId, startDate = null, endDate = null) => {
  let url = `/reports/progress/${studentId}`
  if (startDate) url += `?startDate=${startDate}`
  if (endDate) url += `&endDate=${endDate}`
  
  const response = await authenticatedFetch(url)
  return response.json()
}

// Get course summary (instructor)
const getCourseSummary = async (courseId) => {
  const response = await authenticatedFetch(`/reports/course/${courseId}`)
  return response.json()
}
```

**UI Components:**
- Transcript display (printable)
- Progress report cards
- Chart visualizations
- PDF export button
- Date range picker for reports

---

### 10. Bulk Import

```javascript
// Validate bulk data before import
const validateBulkData = async (type, data) => {
  return authenticatedFetch('/bulk/validate', {
    method: 'POST',
    body: JSON.stringify({ type, data })
  })
  /* Returns:
  {
    totalRecords: 100,
    valid: 95,
    invalid: 5,
    validationErrors: [...],
    readyToImport: false
  }
  */
}

// Import grades
const bulkImportGrades = async (grades) => {
  return authenticatedFetch('/bulk/grades', {
    method: 'POST',
    body: JSON.stringify({ grades })
  })
  /* Returns:
  {
    success: 95,
    failed: 5,
    created: [...],
    errors: [...]
  }
  */
}
```

**UI Components:**
- CSV file uploader
- Data validation preview
- Import progress indicator
- Error display with line numbers
- Success/failure summary

---

## Advanced Features

### Instructor Dashboard

```javascript
const getInstructorDashboard = async (instructorId) => {
  const response = await authenticatedFetch(`/instructors/${instructorId}/dashboard`)
  return response.json()
  /* Returns:
  {
    courses: [...],
    totalStudents: 120,
    recentGrades: [...],
    averageCourseGrade: 82.5,
    attendanceRate: 87.3
  }
  */
}
```

### Dropout Risk Identification

```javascript
const getDropoutRiskStudents = async (gpaTreshold = 2.5) => {
  const response = await authenticatedFetch(
    `/academic/dropout-risk?threshold=${gpaTreshold}`
  )
  return response.json()
  /* Returns list of at-risk students with:
  - Low GPA
  - Poor attendance
  - Declining grades
  */
}
```

---

## Error Handling

```javascript
const handleApiError = async (response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API request failed')
  }
  return response
}

// Usage
try {
  const response = await authenticatedFetch('/grades')
  await handleApiError(response)
  const data = await response.json()
  // Use data...
} catch (error) {
  console.error('Error:', error.message)
  // Show user-friendly error message
}
```

---

## Testing Quick Start

### 1. Start Services
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd server
npm run dev

# Terminal 3: Start ML Service
cd ml_service
python train.py  # First time only
python app.py
```

### 2. Create Test Data
```javascript
// Register user
await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@test.com',
    password: 'SecurePass@2024!',
    role: 'admin',
    name: 'Test Admin'
  })
})

// Login
const loginRes = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@test.com',
    password: 'SecurePass@2024!'
  })
})
const { token } = await loginRes.json()

// Use token for authenticated requests
```

---

## Performance Tips

1. **Pagination**: Most list endpoints support `page` and `limit` query params
   ```javascript
   const getGrades = (page = 1, limit = 20) => {
     return authenticatedFetch(`/grades?page=${page}&limit=${limit}`)
   }
   ```

2. **Filtering**: Use query params to reduce data transfer
   ```javascript
   // Only get grades for specific course and student
   fetchGrades('?studentId=123&courseId=456')
   ```

3. **Caching**: Cache static data (courses, instructors) in frontend
   ```javascript
   const cache = new Map()
   const getCachedCourse = async (courseId) => {
     if (cache.has(courseId)) return cache.get(courseId)
     const course = await fetchCourse(courseId)
     cache.set(courseId, course)
     return course
   }
   ```

4. **Debouncing**: Debounce search inputs
   ```javascript
   const debouncedSearch = debounce(searchQuery => {
     authenticatedFetch(`/students?search=${searchQuery}`)
   }, 300)
   ```

---

## Security Best Practices

1. **Never expose tokens in URLs**
2. **Always use HTTPS in production**
3. **Implement token refresh logic**
4. **Validate user input before sending to API**
5. **Handle 401/403 errors by redirecting to login**
6. **Sanitize user-generated content before displaying**

---

## Next Steps

1. Build authentication flow (login, register, logout)
2. Create student dashboard with overview cards
3. Implement grade viewing and GPA calculator
4. Build attendance calendar view
5. Create assignment submission portal
6. Implement notification center
7. Build messaging inbox
8. Create discussion forum interface
9. Build instructor dashboard with course management
10. Implement bulk import with CSV upload

---

## Support

For issues or questions:
- Check backend logs: `server/logs/`
- Test endpoint with Postman/cURL
- Verify JWT token is valid
- Check CORS configuration
- Ensure ML service is running (port 5001)

**Ready to build an amazing student success platform! 🎓✨**
