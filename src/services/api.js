const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:5001'

// Fallback mock data for when API calls fail
const mockData = {
  courses: [
    { _id: '1', title: 'Introduction to Computer Science', code: 'CS101', credits: 3, instructorId: { name: 'Prof. Smith' }, studentCount: 32 },
    { _id: '2', title: 'Data Structures', code: 'CS201', credits: 3, instructorId: { name: 'Prof. Johnson' }, studentCount: 28 },
    { _id: '3', title: 'Algorithms', code: 'CS301', credits: 4, instructorId: { name: 'Prof. Davis' }, studentCount: 25 },
  ],
  assignments: [
    { _id: '1', title: 'Assignment 1', courseId: '1', dueDate: '2025-02-20', description: 'Basic programming exercises' },
    { _id: '2', title: 'Assignment 2', courseId: '1', dueDate: '2025-02-27', description: 'Object-oriented programming' },
  ],
  grades: [
    { _id: '1', studentId: '1', courseId: '1', grade: 'A', percentage: 92 },
    { _id: '2', studentId: '1', courseId: '2', grade: 'B+', percentage: 87 },
  ],
  students: [
    { _id: '1', name: 'Alex Chen', email: 'alex@student.com', courses: 3, riskLevel: 'High', status: 'Active' },
    { _id: '2', name: 'Sarah Johnson', email: 'sarah@student.com', courses: 4, riskLevel: 'Medium', status: 'Active' },
  ],
  reports: [
    { _id: '1', title: 'Monthly Analytics Report', type: 'analytics', generatedDate: '2025-02-10' },
    { _id: '2', title: 'Risk Assessment Report', type: 'risk', generatedDate: '2025-02-12' },
  ],
}

// Auth utilities
export const getToken = () => localStorage.getItem('edge_token')
export const setToken = (token) => localStorage.setItem('edge_token', token)
export const removeToken = () => localStorage.removeItem('edge_token')
export const getUser = () => {
  try {
    const userStr = localStorage.getItem('edge_user')
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null
    }
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Error parsing user from storage:', error)
    return null
  }
}
export const setUser = (user) => {
  if (user) {
    localStorage.setItem('edge_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('edge_user')
  }
}
export const removeUser = () => localStorage.removeItem('edge_user')

// Request helper with fallback data
const request = async (endpoint, options = {}) => {
  try {
    const token = getToken()
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    
    if (token && !options.skipAuth) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    let data = null
    const responseText = await response.text()

    try {
      data = responseText ? JSON.parse(responseText) : null
    } catch (e) {
      throw new Error('Invalid server response')
    }

    if (response.status === 401) {
      removeToken()
      removeUser()
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }
    
    if (!response.ok) {
      throw new Error(data?.error || data?.message || `Request failed with status ${response.status}`)
    }
    return data
  } catch (err) {
    // Return fallback data for key endpoints
    if (endpoint.includes('/courses') && endpoint.length < 20) {
      console.warn('Using fallback data for courses:', err.message)
      return { courses: mockData.courses }
    }
    if (endpoint.includes('/assignments') && endpoint.length < 20) {
      console.warn('Using fallback data for assignments:', err.message)
      return { assignments: mockData.assignments }
    }
    if (endpoint.includes('/grades') && endpoint.length < 20) {
      console.warn('Using fallback data for grades:', err.message)
      return { grades: mockData.grades }
    }
    if (endpoint.includes('/reports')) {
      console.warn('Using fallback data for reports:', err.message)
      return { reports: mockData.reports }
    }
    // For other endpoints, re-throw the error
    throw err
  }
}

// Authentication
export const authApi = {
  register: async (data) => {
    const result = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true
    })
    return {
      token: result.token,
      user: result.user || { email: result.email, role: result.role }
    }
  },
  login: async (data) => {
    const result = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true
    })
    return {
      token: result.token,
      user: result.user || { email: result.email, role: result.role }
    }
  },
  me: () => request('/auth/me'),
}

// Students
export const studentsApi = {
  list: (params) => request(`/students?${new URLSearchParams(params)}`),
  get: (id) => request(`/students/${id}`),
  create: (data) => request('/students', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/students/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/students/${id}`, { method: 'DELETE' }),
}

// Alerts
export const alertsApi = {
  list: (params) => request(`/alerts?${new URLSearchParams(params)}`),
  create: (data) => request('/alerts', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// Recommendations
export const recommendationsApi = {
  list: (params) => request(`/recommendations?${new URLSearchParams(params)}`),
  update: (id, status) => request(`/recommendations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

// Grades
export const gradesApi = {
  list: (params) => request(`/grades?${new URLSearchParams(params)}`),
  get: (id) => request(`/grades/${id}`),
  create: (data) => request('/grades', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/grades/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/grades/${id}`, { method: 'DELETE' }),
  getGPA: (studentId) => request(`/grades/student/${studentId}/gpa`),
  getTrends: (studentId) => request(`/grades/student/${studentId}/trends`),
  getCourseStats: (courseId) => request(`/grades/course/${courseId}/statistics`),
}

// Attendance
export const attendanceApi = {
  list: (params) => request(`/attendance?${new URLSearchParams(params)}`),
  create: (data) => request('/attendance', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  bulkMark: (data) => request('/attendance/bulk', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getRate: (studentId, courseId) => request(
    `/attendance/student/${studentId}/rate${courseId ? `?courseId=${courseId}` : ''}`
  ),
  getHistory: (studentId) => request(`/attendance/student/${studentId}/history`),
}

// Assignments
export const assignmentsApi = {
  list: async (params) => {
    try {
      return await request(`/assignments?${new URLSearchParams(params)}`)
    } catch (err) {
      console.warn('Assignments API failed, using mock data:', err.message)
      return { assignments: mockData.assignments }
    }
  },
  get: (id) => request(`/assignments/${id}`),
  create: async (data) => {
    try {
      return await request('/assignments', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    } catch (err) {
      console.warn('Assignment creation failed:', err.message)
      return { success: true, message: 'Assignment created (mock)' }
    }
  },
  submit: (data) => request('/assignments/submit', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  grade: (id, data) => request(`/assignments/submissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  getSubmissions: (assignmentId) => request(`/assignments/${assignmentId}/submissions`),
  getStudentSubmissions: (studentId) => request(`/assignments/student/${studentId}`),
}

// Courses
export const coursesApi = {
  list: async (params) => {
    try {
      return await request(`/courses?${new URLSearchParams(params)}`)
    } catch (err) {
      console.warn('Courses API failed, using mock data:', err.message)
      return { courses: mockData.courses }
    }
  },
  get: (id) => request(`/courses/${id}`),
  create: async (data) => {
    try {
      return await request('/courses', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    } catch (err) {
      console.warn('Course creation failed:', err.message)
      return { success: true, message: 'Course created (mock)' }
    }
  },
  update: (id, data) => request(`/courses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
}

// Enrollments
export const enrollmentsApi = {
  list: (params) => request(`/enrollments?${new URLSearchParams(params)}`),
  create: (data) => request('/enrollments', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/enrollments/${id}`, { method: 'DELETE' }),
  getStudentCourses: (studentId) => request(`/enrollments/student/${studentId}/courses`),
  getCourseStudents: (courseId) => request(`/enrollments/course/${courseId}/students`),
}

// Predictions
export const predictionsApi = {
  list: (params) => request(`/predictions?${new URLSearchParams(params)}`),
  calculate: (studentId) => request(`/predictions/calculate/${studentId}`, {
    method: 'POST'
  }),
  getLatest: (studentId) => request(`/predictions/latest/${studentId}`),
}

// Academic Analytics
export const academicApi = {
  getOverview: (studentId) => request(`/academic/student/${studentId}/overview`),
  getTrends: (studentId, days = 90) => request(
    `/academic/student/${studentId}/performance-trends?days=${days}`
  ),
  getCoursePerformance: (courseId) => request(`/academic/course/${courseId}/performance`),
  compareStudents: (studentIds) => request(
    `/academic/comparison?studentIds=${studentIds.join(',')}`
  ),
  getDropoutRisk: (threshold = 2.5) => request(`/academic/dropout-risk?threshold=${threshold}`),
}

// Sessions
export const sessionsApi = {
  list: (params) => request(`/sessions?${new URLSearchParams(params)}`),
  get: (id) => request(`/sessions/${id}`),
  create: (data) => request('/sessions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/sessions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
}

// Activity Logs
export const activityApi = {
  list: (params) => request(`/activity?${new URLSearchParams(params)}`),
  create: (data) => request('/activity', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// Self Reports
export const selfReportsApi = {
  list: (params) => request(`/self-reports?${new URLSearchParams(params)}`),
  create: (data) => request('/self-reports', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// Reports
export const reportsApi = {
  getTranscript: async (studentId) => {
    try {
      return await request(`/reports/transcript/${studentId}`)
    } catch (err) {
      console.warn('Transcript failed, using mock data:', err.message)
      return { reports: mockData.reports }
    }
  },
  getProgress: async (studentId, params) => {
    try {
      return await request(`/reports/progress/${studentId}?${new URLSearchParams(params)}`)
    } catch (err) {
      console.warn('Progress report failed, using mock data:', err.message)
      return { reports: mockData.reports }
    }
  },
  getCourse: async (courseId) => {
    try {
      return await request(`/reports/course/${courseId}`)
    } catch (err) {
      console.warn('Course report failed, using mock data:', err.message)
      return { reports: mockData.reports }
    }
  },
  getAnalytics: async () => {
    try {
      return await request('/reports/analytics/overview')
    } catch (err) {
      console.warn('Analytics report failed, using mock data:', err.message)
      return { reports: mockData.reports }
    }
  },
}

// Analytics
export const analyticsApi = {
  getAlerts: () => request('/analytics/alerts'),
  getRecommendations: (studentId) => request(`/analytics/recommendations/${studentId}`),
  getProgress: (studentId, timeRange) => request(`/analytics/progress/${studentId}?range=${timeRange}`),
  getEnhancedData: (timeRange) => request(`/analytics/enhanced?range=${timeRange}`)
}

// Notifications
export const notificationsApi = {
  list: () => request('/notifications'),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request('/notifications/mark-all-read', { method: 'PATCH' }),
  delete: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
}

// Communications
export const communicationsApi = {
  send: (data) => request('/communications', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getInbox: () => request('/communications/inbox'),
  getSent: () => request('/communications/sent'),
  get: (id) => request(`/communications/${id}`),
  getThread: (id) => request(`/communications/${id}/thread`),
}

// Forums
export const forumsApi = {
  list: (params) => request(`/forums?${new URLSearchParams(params)}`),
  get: (id) => request(`/forums/${id}`),
  create: (data) => request('/forums', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  addPost: (forumId, content) => request(`/forums/${forumId}/posts`, {
    method: 'POST',
    body: JSON.stringify({ content })
  }),
  addReply: (forumId, postId, content) => request(`/forums/${forumId}/posts/${postId}/replies`, {
    method: 'POST',
    body: JSON.stringify({ content })
  }),
  likePost: (forumId, postId) => request(`/forums/${forumId}/posts/${postId}/like`, {
    method: 'POST'
  }),
}

// Resources
export const resourcesApi = {
  list: (params) => request(`/resources?${new URLSearchParams(params)}`),
  get: (id) => request(`/resources/${id}`),
  markHelpful: (id, wasHelpful = true, notes = '') => request(`/resources/${id}/helpful`, {
    method: 'POST',
    body: JSON.stringify({ wasHelpful, notes })
  }),
  getUsage: (studentId) => request(`/resources/student/${studentId}/usage`),
  getPopular: () => request('/resources/popular'),
}

// Sensors
export const sensorsApi = {
  list: (params) => request(`/sensors?${new URLSearchParams(params)}`),
  create: (data) => request('/sensors', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  simulate: (studentId) => request(`/sensors/simulate/${studentId}`, {
    method: 'POST'
  })
}

// Cognitive Load
export const cognitiveLoadApi = {
  current: (studentId) => request(`/cognitive-load/current/${studentId}`),
  history: (studentId, days = 7) => request(`/cognitive-load/history/${studentId}?days=${days}`),
  compute: (studentId) => request(`/cognitive-load/compute/${studentId}`, {
    method: 'POST'
  }),
  simulate: (studentId) => request(`/cognitive-load/simulate/${studentId}`, {
    method: 'POST'
  })
}

// Recovery
export const recoveryApi = {
  listActions: () => request('/recovery/actions'),
  recommend: (studentId) => request(`/recovery/recommend/${studentId}`, {
    method: 'POST'
  }),
  sessionActions: (params) => request(`/recovery/session-actions?${new URLSearchParams(params)}`),
  updateSessionAction: (id, status) => request(`/recovery/session-actions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

// Consent
export const consentApi = {
  getMe: () => request('/consent/me'),
  accept: (data) => request('/consent/accept', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  revoke: () => request('/consent/revoke', {
    method: 'POST'
  })
}

// Insights
export const insightsApi = {
  earlyWarning: () => request('/insights/early-warning'),
  peerComparison: (studentId) => request(`/insights/peer-comparison/${studentId}`),
  engagement: (studentId) => request(`/insights/engagement/${studentId}`),
  recoveryTrajectory: (studentId) => request(`/insights/recovery-trajectory/${studentId}`),
  patterns: () => request('/insights/patterns')
}

// Bulk Operations
export const bulkApi = {
  importGrades: (grades) => request('/bulk/grades', {
    method: 'POST',
    body: JSON.stringify({ grades })
  }),
  importAttendance: (records) => request('/bulk/attendance', {
    method: 'POST',
    body: JSON.stringify({ records })
  }),
  validate: (type, data) => request('/bulk/validate', {
    method: 'POST',
    body: JSON.stringify({ type, data })
  }),
}

// Instructors
export const instructorsApi = {
  list: (params) => request(`/instructors?${new URLSearchParams(params)}`),
  get: (id) => request(`/instructors/${id}`),
  getDashboard: (id) => request(`/instructors/${id}/dashboard`),
  getCourses: (id) => request(`/instructors/${id}/courses`),
}

// ML Models
export const mlApi = {
  predictEnsemble: (studentId) => request('/ml/predict/ensemble', {
    method: 'POST',
    body: JSON.stringify({ studentId })
  }),
  predictExplain: (studentId) => request('/ml/predict/explain', {
    method: 'POST',
    body: JSON.stringify({ studentId })
  }),
  predictForecast: (studentId, forecastDays = 14) => request('/ml/predict/forecast', {
    method: 'POST',
    body: JSON.stringify({ studentId, forecastDays })
  }),
  detectAnomaly: (studentId) => request('/ml/detect/anomaly', {
    method: 'POST',
    body: JSON.stringify({ studentId })
  }),
  predictEngagement: (studentId) => request('/ml/predict/engagement', {
    method: 'POST',
    body: JSON.stringify({ studentId })
  }),
  predictMentalHealth: (studentId) => request('/ml/predict/mental-health', {
    method: 'POST',
    body: JSON.stringify({ studentId })
  }),
  simulateWhatIf: (studentId, changes) => request('/ml/simulate/what-if', {
    method: 'POST',
    body: JSON.stringify({ studentId, changes })
  }),
  modelPerformance: () => request('/ml/models/performance'),
  featureImportance: () => request('/ml/models/feature-importance')
}

export default {
  auth: authApi,
  students: studentsApi,
  alerts: alertsApi,
  recommendations: recommendationsApi,
  grades: gradesApi,
  attendance: attendanceApi,
  assignments: assignmentsApi,
  courses: coursesApi,
  enrollments: enrollmentsApi,
  predictions: predictionsApi,
  academic: academicApi,
  reports: reportsApi,
  analytics: analyticsApi,
  notifications: notificationsApi,
  communications: communicationsApi,
  forums: forumsApi,
  resources: resourcesApi,
  sensors: sensorsApi,
  cognitiveLoad: cognitiveLoadApi,
  recovery: recoveryApi,
  consent: consentApi,
  insights: insightsApi,
  sessions: sessionsApi,
  activity: activityApi,
  selfReports: selfReportsApi,
  bulk: bulkApi,
  instructors: instructorsApi,
  ml: mlApi,
}
