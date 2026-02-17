import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// Student Assignments View
function StudentAssignmentsView() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [submission, setSubmission] = useState({ content: '', notes: '' })

  const assignments = [
    { id: 1, title: 'Programming Project 1', course: 'CS101', description: 'Build a calculator app', dueDate: '2024-11-20', status: 'pending', maxScore: 100 },
    { id: 2, title: 'Midterm Exam', course: 'MATH201', description: 'Chapters 1-5', dueDate: '2024-11-15', status: 'submitted', score: 92, maxScore: 100 },
    { id: 3, title: 'Lab Report', course: 'PHY150', description: 'Experiment #3', dueDate: '2024-11-10', status: 'graded', score: 85, maxScore: 100 },
    { id: 4, title: 'Essay', course: 'ENG120', description: 'On climate change', dueDate: '2024-11-25', status: 'pending', maxScore: 50 }
  ]

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length
  }

  const courses = [...new Set(assignments.map(a => a.course))]
  const filtered = assignments.filter(a => 
    (statusFilter === 'all' || a.status === statusFilter) &&
    (courseFilter === 'all' || a.course === courseFilter)
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500/20 text-blue-500'
      case 'graded': return 'bg-green-500/20 text-green-500'
      case 'pending': return 'bg-yellow-500/20 text-yellow-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const getUrgency = (dueDate, status) => {
    if (status !== 'pending') return null
    const hours = (new Date(dueDate) - new Date()) / (1000 * 60 * 60)
    if (hours < 0) return 'overdue'
    if (hours < 24) return 'urgent'
    if (hours < 72) return 'soon'
    return null
  }

  const handleSubmit = () => {
    alert('Assignment submitted successfully!')
    setSelectedAssignment(null)
    setSubmission({ content: '', notes: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">My Assignments</h1>
        <p className="text-[#9CA3AF]">Submit and track your coursework</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
          <p className="text-[#9CA3AF] text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-[#F6B26B]">{stats.total}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
          <p className="text-[#9CA3AF] text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
          <p className="text-[#9CA3AF] text-sm mb-1">Submitted</p>
          <p className="text-2xl font-bold text-blue-500">{stats.submitted}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
          <p className="text-[#9CA3AF] text-sm mb-1">Graded</p>
          <p className="text-2xl font-bold text-green-500">{stats.graded}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#9CA3AF] text-sm mb-2">Filter by Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>
          <div>
            <label className="block text-[#9CA3AF] text-sm mb-2">Filter by Course</label>
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]">
              <option value="all">All Courses</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Assignments */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(assignment => {
          const urgency = getUrgency(assignment.dueDate, assignment.status)
          return (
            <div
              key={assignment.id}
              onClick={() => setSelectedAssignment(assignment)}
              className={`bg-[#1A1C21] border rounded-lg p-6 cursor-pointer hover:border-[#F6B26B] transition-all ${
                urgency === 'overdue' ? 'border-red-500' : urgency === 'urgent' ? 'border-yellow-500' : 'border-[#2A2C31]'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-[#FAF8F4]">{assignment.title}</h3>
                <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(assignment.status)}`}>
                  {assignment.status}
                </span>
              </div>
              {urgency && (
                <div className={`mb-3 px-2 py-1 rounded text-xs font-semibold inline-block ${
                  urgency === 'overdue' ? 'bg-red-500/20 text-red-500' :
                  urgency === 'urgent' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {urgency === 'overdue' ? '⚠️ Overdue' : urgency === 'urgent' ? '🔥 Due in < 24h' : '📅 Due soon'}
                </div>
              )}
              <p className="text-[#9CA3AF] text-sm mb-4">{assignment.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Course:</span>
                  <span className="text-[#FAF8F4]">{assignment.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Due:</span>
                  <span className="text-[#FAF8F4]">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                {assignment.score !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Grade:</span>
                    <span className="text-[#F6B26B] font-semibold">{assignment.score}/{assignment.maxScore}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#FAF8F4] mb-2">{selectedAssignment.title}</h2>
                <p className="text-[#9CA3AF]">{selectedAssignment.course}</p>
              </div>
              <button onClick={() => setSelectedAssignment(null)} className="text-[#9CA3AF] hover:text-[#FAF8F4] text-2xl">✕</button>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#FAF8F4] mb-2">Description</h3>
              <p className="text-[#9CA3AF]">{selectedAssignment.description}</p>
            </div>
            {selectedAssignment.status === 'pending' && (
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="space-y-4">
                <div>
                  <label className="block text-[#FAF8F4] text-sm font-medium mb-2">Submission Content</label>
                  <textarea value={submission.content} onChange={(e) => setSubmission({ ...submission, content: e.target.value })} className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] min-h-[120px]" placeholder="Enter your submission..." required />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold py-2 rounded-lg">Submit</button>
                  <button type="button" onClick={() => setSelectedAssignment(null)} className="px-6 bg-[#0E0F13] text-[#FAF8F4] font-semibold py-2 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Mentor Assignments View
function MentorAssignmentsView() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCourse, setSelectedCourse] = useState('CS101')

  const assignments = [
    { id: 1, title: 'Programming Project 1', course: 'CS101', dueDate: '2024-11-20', submissions: 42, graded: 38, avgScore: 82 },
    { id: 2, title: 'Midterm Exam', course: 'CS101', dueDate: '2024-11-15', submissions: 45, graded: 45, avgScore: 84 },
    { id: 3, title: 'Programming Project 2', course: 'CS201', dueDate: '2024-11-18', submissions: 28, graded: 15, avgScore: 79 }
  ]

  const submissionStats = {
    submitted: 115,
    pending: 18,
    graded: 98,
    avgGradingTime: '48 hours'
  }

  const courseStats = [
    { code: 'CS101', name: 'Intro to Programming', assignments: 2, avgSubmissionRate: 97, avgScore: 83 },
    { code: 'CS201', name: 'Data Structures', assignments: 1, avgSubmissionRate: 88, avgScore: 79 }
  ]

  const selectedCourseAssignments = assignments.filter(a => a.course === selectedCourse)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">Assignment Management</h1>
            <p className="text-[#9CA3AF]">Manage assignments and student submissions</p>
          </div>
          <button className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg">+ New Assignment</button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Submitted</p>
          <p className="text-3xl font-bold text-blue-500">{submissionStats.submitted}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-500">{submissionStats.pending}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Graded</p>
          <p className="text-3xl font-bold text-green-500">{submissionStats.graded}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Avg Grade Time</p>
          <p className="text-lg font-bold text-[#F6B26B]">{submissionStats.avgGradingTime}</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <div className="flex gap-4 border-b border-[#2A2C31]">
          {['overview', 'submissions', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-[#F6B26B] border-b-2 border-[#F6B26B]'
                  : 'text-[#9CA3AF] hover:text-[#FAF8F4]'
              }`}
            >
              {tab === 'overview' && 'Assignments'}
              {tab === 'submissions' && 'Submissions'}
              {tab === 'stats' && 'Statistics'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {assignments.map(assignment => (
            <div key={assignment.id} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#FAF8F4]">{assignment.title}</h3>
                  <p className="text-[#9CA3AF]">{assignment.course}</p>
                </div>
                <button className="px-3 py-1 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded text-sm">Edit</button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-[#9CA3AF] text-sm">Due Date</p>
                  <p className="text-[#FAF8F4] font-semibold">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">Submissions</p>
                  <p className="text-[#F6B26B] font-semibold">{assignment.submissions}</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">Graded</p>
                  <p className="text-green-500 font-semibold">{assignment.graded}</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">Avg Score</p>
                  <p className="text-[#F6B26B] font-semibold">{assignment.avgScore}%</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'submissions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
            <label className="block text-[#9CA3AF] text-sm mb-2">Select Course</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]">
              <option value="CS101">CS101</option>
              <option value="CS201">CS201</option>
            </select>
          </div>
          {selectedCourseAssignments.map(assignment => (
            <div key={assignment.id} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
              <div className="flex justify-between mb-3">
                <h3 className="text-lg font-bold text-[#FAF8F4]">{assignment.title}</h3>
                <span className="text-[#F6B26B] font-semibold">{((assignment.graded / assignment.submissions) * 100).toFixed(0)}% graded</span>
              </div>
              <div className="w-full bg-[#0E0F13] rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#F6B26B] to-[#E69138]" style={{ width: `${(assignment.graded / assignment.submissions) * 100}%` }} />
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4">
          {courseStats.map((course) => (
            <div key={course.code} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#FAF8F4] mb-4">{course.code}: {course.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[#9CA3AF] text-sm">Assignments</p>
                  <p className="text-2xl font-bold text-[#FAF8F4]">{course.assignments}</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm mb-1">Submission Rate</p>
                  <p className="text-[#F6B26B] font-semibold">{course.avgSubmissionRate}%</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">Avg Score</p>
                  <p className="text-[#F6B26B] font-semibold">{course.avgScore}%</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

// Admin Assignments View
function AdminAssignmentsView() {
  const [selectedDept, setSelectedDept] = useState('all')

  const systemStats = {
    totalAssignments: 156,
    pendingGrading: 2400,
    avgSubmissionRate: 94.2,
    avgScore: 82.5
  }

  const departmentStats = [
    { name: 'Engineering', assignments: 52, submissions: 1860, avgScore: 84.2, submissionRate: 95.5 },
    { name: 'Business', assignments: 38, submissions: 1140, avgScore: 81.8, submissionRate: 93.2 },
    { name: 'Arts & Sciences', assignments: 45, submissions: 1350, avgScore: 82.1, submissionRate: 94.5 },
    { name: 'Health Sciences', assignments: 21, submissions: 630, avgScore: 80.9, submissionRate: 92.8 }
  ]

  const visibleStats = selectedDept === 'all' 
    ? departmentStats 
    : departmentStats.filter(d => d.name === selectedDept)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">Assignment Analytics</h1>
        <p className="text-[#9CA3AF]">System-wide assignment and submission analytics</p>
      </motion.div>

      {/* System Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Total Assignments</p>
          <p className="text-3xl font-bold text-[#F6B26B]">{systemStats.totalAssignments}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Pending Grading</p>
          <p className="text-3xl font-bold text-yellow-500">{systemStats.pendingGrading}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Submission Rate</p>
          <p className="text-3xl font-bold text-blue-500">{systemStats.avgSubmissionRate}%</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Avg Score</p>
          <p className="text-3xl font-bold text-green-500">{systemStats.avgScore}%</p>
        </div>
      </motion.div>

      {/* Department Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-3 overflow-x-auto">
        <button
          onClick={() => setSelectedDept('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
            selectedDept === 'all'
              ? 'bg-[#F6B26B] text-[#0E0F13]'
              : 'bg-[#1A1C21] border border-[#2A2C31] text-[#FAF8F4] hover:border-[#F6B26B]'
          }`}
        >
          All
        </button>
        {departmentStats.map((dept) => (
          <button
            key={dept.name}
            onClick={() => setSelectedDept(dept.name)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
              selectedDept === dept.name
                ? 'bg-[#F6B26B] text-[#0E0F13]'
                : 'bg-[#1A1C21] border border-[#2A2C31] text-[#FAF8F4] hover:border-[#F6B26B]'
            }`}
          >
            {dept.name}
          </button>
        ))}
      </motion.div>

      {/* Department Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-2 gap-4">
        {visibleStats.map((dept) => (
          <div key={dept.name} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#FAF8F4] mb-4">{dept.name}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Assignments</span>
                <span className="text-[#FAF8F4] font-semibold">{dept.assignments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Submissions</span>
                <span className="text-[#FAF8F4] font-semibold">{dept.submissions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Submission Rate</span>
                <span className="text-[#F6B26B] font-semibold">{dept.submissionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Avg Score</span>
                <span className="text-green-500 font-semibold">{dept.avgScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// Main Component
export default function AssignmentsPage() {
  const { user } = useAuth()

  if (user?.role === 'admin') return <AdminAssignmentsView />
  if (user?.role === 'mentor') return <MentorAssignmentsView />
  return <StudentAssignmentsView />
}
