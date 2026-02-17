/**
 * API client for EDGE backend
 * Base URL: http://localhost:5000/api
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class APIClient {
  constructor() {
    this.token = localStorage.getItem('edge_token')
  }

  setToken(token) {
    this.token = token
    localStorage.setItem('edge_token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('edge_token')
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    // Check for token from localStorage and instance (ensures latest token is always used)
    const token = this.token || localStorage.getItem('edge_token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth
  register(name, email, password, role = 'student') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    })
  }

  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  logout() {
    this.clearToken()
    localStorage.removeItem('edge_user')
  }

  // Students
  getStudent(id) {
    return this.request(`/students/${id}`)
  }

  listStudents() {
    return this.request('/students')
  }

  // Sessions
  createSession(studentId, startAt, courseId = null, context = {}) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify({ studentId, startAt, courseId, context })
    })
  }

  listSessions(studentId = null) {
    const query = studentId ? `?studentId=${studentId}` : ''
    return this.request(`/sessions${query}`)
  }

  // Activity
  logActivity(studentId, sessionId, type, score = null, value = null) {
    return this.request('/activity', {
      method: 'POST',
      body: JSON.stringify({ studentId, sessionId, type, score, value })
    })
  }

  listActivity(studentId = null, sessionId = null) {
    const params = new URLSearchParams()
    if (studentId) params.append('studentId', studentId)
    if (sessionId) params.append('sessionId', sessionId)
    const query = params.toString() ? `?${params}` : ''
    return this.request(`/activity${query}`)
  }

  // Self-reports
  submitSelfReport(studentId, loadScore, stressScore, sleepHours, notes = '') {
    return this.request('/self-reports', {
      method: 'POST',
      body: JSON.stringify({ studentId, loadScore, stressScore, sleepHours, notes })
    })
  }

  listSelfReports(studentId = null) {
    const query = studentId ? `?studentId=${studentId}` : ''
    return this.request(`/self-reports${query}`)
  }

  // Predictions
  getPrediction(id) {
    return this.request(`/predictions/${id}`)
  }

  listPredictions(studentId = null) {
    const query = studentId ? `?studentId=${studentId}` : ''
    return this.request(`/predictions${query}`)
  }

  getLatestPrediction(studentId) {
    return this.request(`/predictions/latest/${studentId}`)
  }

  // Alerts
  listAlerts(studentId = null) {
    const query = studentId ? `?studentId=${studentId}` : ''
    return this.request(`/alerts${query}`)
  }

  // Recommendations
  listRecommendations(studentId = null) {
    const query = studentId ? `?studentId=${studentId}` : ''
    return this.request(`/recommendations${query}`)
  }

  updateRecommendation(id, status) {
    return this.request(`/recommendations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  }

  // Features & Predictions
  getFeatures(studentId) {
    return this.request(`/features/${studentId}`)
  }

  generatePrediction(studentId) {
    return this.request(`/features/${studentId}/predict`, {
      method: 'POST'
    })
  }

  // Courses
  listCourses() {
    return this.request('/courses')
  }

  // Health check
  health() {
    return this.request('/health')
  }
}

export default new APIClient()
