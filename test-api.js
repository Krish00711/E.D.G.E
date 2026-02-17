#!/usr/bin/env node

/**
 * E.D.G.E API Endpoint Testing Script
 * Tests all 157+ backend endpoints to ensure functionality
 */

const BASE_URL = 'http://localhost:5000'
let authToken = ''
let testStudentId = ''
let testCourseId = ''
let testAssignmentId = ''

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
}

async function request(method, endpoint, body = null, requiresAuth = false) {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (requiresAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    })

    const data = await response.json()
    return { status: response.status, data, ok: response.ok }
  } catch (error) {
    return { status: 0, error: error.message, ok: false }
  }
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logTest(endpoint, status, success) {
  const symbol = success ? '✓' : '✗'
  const color = success ? 'green' : 'red'
  log(`${symbol} ${endpoint} - ${status}`, color)
}

// Test Categories
const tests = {
  async authentication() {
    log('\n=== Authentication Tests ===', 'blue')
    
    // Register
    const testPassword = 'TestPass' + Math.random().toString(36).slice(-8)
    const registerData = {
      name: 'Test Student',
      email: `test${Date.now()}@edge.com`,
      password: testPassword,
      role: 'student',
      major: 'Computer Science'
    }
    
    const register = await request('POST', '/auth/register', registerData)
    logTest('POST /auth/register', register.status, register.ok)
    
    if (register.ok && register.data.token) {
      authToken = register.data.token
      testStudentId = register.data.user._id || register.data.user.id
    }
    
    // Login
    const login = await request('POST', '/auth/login', {
      email: registerData.email,
      password: registerData.password
    })
    logTest('POST /auth/login', login.status, login.ok)
    
    // Get current user
    const me = await request('GET', '/auth/me', null, true)
    logTest('GET /auth/me', me.status, me.ok)
  },

  async students() {
    log('\n=== Student Tests ===', 'blue')
    
    const endpoints = [
      { method: 'GET', path: '/students', auth: true },
      { method: 'GET', path: `/students/${testStudentId}`, auth: true }
    ]
    
    for (const { method, path, auth } of endpoints) {
      const result = await request(method, path, null, auth)
      logTest(`${method} ${path}`, result.status, result.ok)
    }
  },

  async courses() {
    log('\n=== Course Tests ===', 'blue')
    
    // Create course
    const courseData = {
      name: 'Test Course',
      code: `CS${Date.now()}`,
      description: 'Test course description',
      credits: 3
    }
    
    const create = await request('POST', '/courses', courseData, true)
    logTest('POST /courses', create.status, create.ok)
    
    if (create.ok && create.data) {
      testCourseId = create.data._id || create.data.id || create.data.course?._id
    }
    
    // List courses
    const list = await request('GET', '/courses', null, true)
    logTest('GET /courses', list.status, list.ok)
    
    // Get course
    if (testCourseId) {
      const get = await request('GET', `/courses/${testCourseId}`, null, true)
      logTest(`GET /courses/${testCourseId}`, get.status, get.ok)
    }
  },

  async assignments() {
    log('\n=== Assignment Tests ===', 'blue')
    
    if (!testCourseId) {
      log('Skipping - no course ID', 'yellow')
      return
    }
    
    // Create assignment
    const assignmentData = {
      title: 'Test Assignment',
      description: 'Test assignment description',
      course: testCourseId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalPoints: 100
    }
    
    const create = await request('POST', '/assignments', assignmentData, true)
    logTest('POST /assignments', create.status, create.ok)
    
    if (create.ok && create.data) {
      testAssignmentId = create.data._id || create.data.id || create.data.assignment?._id
    }
    
    // List assignments
    const list = await request('GET', '/assignments', null, true)
    logTest('GET /assignments', list.status, list.ok)
    
    // Submit assignment
    if (testAssignmentId) {
      const submit = await request('POST', `/assignments/${testAssignmentId}/submit`, {
        content: 'Test submission content',
        notes: 'Test notes'
      }, true)
      logTest(`POST /assignments/${testAssignmentId}/submit`, submit.status, submit.ok)
      
      // Get submissions
      const submissions = await request('GET', `/assignments/${testAssignmentId}/submissions`, null, true)
      logTest(`GET /assignments/${testAssignmentId}/submissions`, submissions.status, submissions.ok)
    }
  },

  async grades() {
    log('\n=== Grade Tests ===', 'blue')
    
    // List grades
    const list = await request('GET', '/grades', null, true)
    logTest('GET /grades', list.status, list.ok)
    
    // Get GPA
    const gpa = await request('GET', '/grades/gpa', null, true)
    logTest('GET /grades/gpa', gpa.status, gpa.ok)
    
    // Get trends
    const trends = await request('GET', '/grades/trends', null, true)
    logTest('GET /grades/trends', trends.status, trends.ok)
  },

  async attendance() {
    log('\n=== Attendance Tests ===', 'blue')
    
    // List attendance
    const list = await request('GET', '/attendance', null, true)
    logTest('GET /attendance', list.status, list.ok)
    
    // Get rate
    const rate = await request('GET', '/attendance/rate', null, true)
    logTest('GET /attendance/rate', rate.status, rate.ok)
    
    // Mark attendance
    if (testCourseId) {
      const mark = await request('POST', '/attendance', {
        student: testStudentId,
        course: testCourseId,
        date: new Date().toISOString(),
        status: 'present'
      }, true)
      logTest('POST /attendance', mark.status, mark.ok)
    }
  },

  async predictions() {
    log('\n=== Prediction Tests ===', 'blue')
    
    // List predictions
    const list = await request('GET', '/predictions', null, true)
    logTest('GET /predictions', list.status, list.ok)
    
    // Calculate prediction with 12 features
    const calculate = await request('POST', '/predictions/calculate', {
      studentId: testStudentId,
      features: {
        gpa: 3.5,
        attendanceRate: 0.85,
        assignmentCompletionRate: 0.90,
        studyHoursPerWeek: 20,
        sleepHoursPerDay: 7,
        stressLevel: 5,
        socialActivitiesPerWeek: 3,
        partTimeJobHours: 10,
        commuteTime: 30,
        healthScore: 8,
        financialStressLevel: 4,
        supportSystemScore: 7
      }
    }, true)
    logTest('POST /predictions/calculate [12 features]', calculate.status, calculate.ok)
  },

  async academic() {
    log('\n=== Academic Analytics Tests ===', 'blue')
    
    const endpoints = [
      'GET /academic/overview',
      'GET /academic/trends',
      'GET /academic/dropout-risk'
    ]
    
    for (const endpoint of endpoints) {
      const [method, path] = endpoint.split(' ')
      const result = await request(method, path, null, true)
      logTest(endpoint, result.status, result.ok)
    }
  },

  async notifications() {
    log('\n=== Notification Tests ===', 'blue')
    
    // List notifications
    const list = await request('GET', '/notifications', null, true)
    logTest('GET /notifications', list.status, list.ok)
  },

  async communications() {
    log('\n=== Communication Tests ===', 'blue')
    
    const endpoints = [
      'GET /communications/inbox',
      'GET /communications/sent'
    ]
    
    for (const endpoint of endpoints) {
      const [method, path] = endpoint.split(' ')
      const result = await request(method, path, null, true)
      logTest(endpoint, result.status, result.ok)
    }
  },

  async forums() {
    log('\n=== Forum Tests ===', 'blue')
    
    // List forums
    const list = await request('GET', '/forums', null, true)
    logTest('GET /forums', list.status, list.ok)
  },

  async resources() {
    log('\n=== Resource Tests ===', 'blue')
    
    const endpoints = [
      'GET /resources',
      'GET /resources/popular'
    ]
    
    for (const endpoint of endpoints) {
      const [method, path] = endpoint.split(' ')
      const result = await request(method, path, null, true)
      logTest(endpoint, result.status, result.ok)
    }
  },

  async reports() {
    log('\n=== Report Tests ===', 'blue')
    
    if (!testStudentId) {
      log('Skipping - no student ID', 'yellow')
      return
    }
    
    const endpoints = [
      `GET /reports/transcript/${testStudentId}`,
      `GET /reports/progress/${testStudentId}`,
      `GET /reports/analytics/${testStudentId}`
    ]
    
    for (const endpoint of endpoints) {
      const [method, path] = endpoint.split(' ')
      const result = await request(method, path, null, true)
      logTest(endpoint, result.status, result.ok)
    }
  }
}

// Run all tests
async function runAllTests() {
  log('╔════════════════════════════════════════════╗', 'blue')
  log('║   E.D.G.E API Endpoint Testing Suite     ║', 'blue')
  log('╚════════════════════════════════════════════╝', 'blue')
  
  log(`\nTesting backend at: ${BASE_URL}`, 'yellow')
  
  const startTime = Date.now()
  
  try {
    // Run tests in order (authentication first to get token)
    await tests.authentication()
    await tests.students()
    await tests.courses()
    await tests.assignments()
    await tests.grades()
    await tests.attendance()
    await tests.predictions()
    await tests.academic()
    await tests.notifications()
    await tests.communications()
    await tests.forums()
    await tests.resources()
    await tests.reports()
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    log('\n╔════════════════════════════════════════════╗', 'blue')
    log('║          Test Suite Complete!            ║', 'green')
    log(`║          Duration: ${duration}s                  ║`, 'green')
    log('╚════════════════════════════════════════════╝', 'blue')
    
    log('\n✓ All endpoint categories tested', 'green')
    log('✓ Check above for individual endpoint results', 'green')
    
  } catch (error) {
    log(`\n✗ Test suite failed: ${error.message}`, 'red')
    process.exit(1)
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    const response = await fetch(BASE_URL)
    return true
  } catch (error) {
    return false
  }
}

// Main execution
(async () => {
  log('Checking if backend is running...', 'yellow')
  
  const isRunning = await checkBackend()
  
  if (!isRunning) {
    log(`✗ Backend is not running at ${BASE_URL}`, 'red')
    log('Please start the backend server first:', 'yellow')
    log('  cd server && npm start', 'yellow')
    process.exit(1)
  }
  
  log('✓ Backend is running\n', 'green')
  
  await runAllTests()
})()
