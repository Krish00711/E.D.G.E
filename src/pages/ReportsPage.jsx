import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// Student Reports View
function StudentReportsView() {
  const [activeTab, setActiveTab] = useState('progress')

  const studentReports = {
    metrics: {
      avgGrade: 3.45,
      previousAvgGrade: 3.2,
      attendance: 92,
      onTimeSubmissions: 88,
      totalSubmissions: 24,
      gpa: 3.45
    },
    transcript: [
      { course: 'CS101', grade: 'A', credits: 3, gpaPoints: 4.0 },
      { course: 'MATH201', grade: 'A-', credits: 4, gpaPoints: 3.7 },
      { course: 'PHY150', grade: 'B+', credits: 3, gpaPoints: 3.3 },
      { course: 'ENG120', grade: 'A', credits: 3, gpaPoints: 4.0 },
      { course: 'HIST101', grade: 'B', credits: 3, gpaPoints: 3.0 }
    ],
    performanceTrend: [
      { week: 'Week 1', grade: 78 },
      { week: 'Week 2', grade: 82 },
      { week: 'Week 3', grade: 85 },
      { week: 'Week 4', grade: 88 },
      { week: 'Week 5', grade: 87 },
      { week: 'Week 6', grade: 90 }
    ],
    riskLevel: 'Low',
    recentGrades: [
      { course: 'CS101 - Midterm', date: '2024-11-15', percentage: 92, score: '92/100' },
      { course: 'MATH201 - Quiz 3', date: '2024-11-12', percentage: 88, score: '88/100' },
      { course: 'PHY150 - Lab Report', date: '2024-11-10', percentage: 85, score: '85/100' }
    ]
  }

  const gradeTrend = studentReports.metrics.avgGrade - studentReports.metrics.previousAvgGrade

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">My Reports</h1>
            <p className="text-[#9CA3AF]">Track your academic progress and performance</p>
          </div>
          <button className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors">
            📥 Export Report
          </button>
        </div>
      </motion.div>

      {/* Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Average Grade</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-[#F6B26B]">{studentReports.metrics.avgGrade.toFixed(2)}</p>
              <span className={`text-sm font-semibold mb-1 ${gradeTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {gradeTrend > 0 ? '+' : ''}{gradeTrend.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Attendance Rate</p>
            <p className="text-3xl font-bold text-[#F6B26B]">{studentReports.metrics.attendance}%</p>
          </div>
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">On-Time Submissions</p>
            <p className="text-3xl font-bold text-[#F6B26B]">{studentReports.metrics.onTimeSubmissions}%</p>
          </div>
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Cumulative GPA</p>
            <p className="text-3xl font-bold text-[#F6B26B]">{studentReports.metrics.gpa}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <div className="flex gap-4 border-b border-[#2A2C31]">
          {['progress', 'transcript', 'trend'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-[#F6B26B] border-b-2 border-[#F6B26B]'
                  : 'text-[#9CA3AF] hover:text-[#FAF8F4]'
              }`}
            >
              {tab === 'progress' && 'Recent Grades'}
              {tab === 'transcript' && 'Transcript'}
              {tab === 'trend' && 'Performance Trend'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {activeTab === 'progress' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {studentReports.recentGrades.map((grade, idx) => (
            <div key={idx} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4 flex justify-between">
              <div>
                <p className="text-[#FAF8F4] font-semibold">{grade.course}</p>
                <p className="text-[#9CA3AF] text-sm">{new Date(grade.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[#F6B26B] font-semibold">{grade.percentage}%</p>
                <p className="text-[#9CA3AF] text-sm">{grade.score}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'transcript' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0E0F13]">
                <tr>
                  <th className="px-4 py-2 text-left text-[#9CA3AF]">Course</th>
                  <th className="px-4 py-2 text-left text-[#9CA3AF]">Grade</th>
                  <th className="px-4 py-2 text-left text-[#9CA3AF]">Credits</th>
                  <th className="px-4 py-2 text-left text-[#9CA3AF]">GPA Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2C31]">
                {studentReports.transcript.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#16181D]">
                    <td className="px-4 py-3 text-[#FAF8F4]">{row.course}</td>
                    <td className="px-4 py-3 text-[#F6B26B] font-semibold">{row.grade}</td>
                    <td className="px-4 py-3 text-[#FAF8F4]">{row.credits}</td>
                    <td className="px-4 py-3 text-[#FAF8F4]">{row.gpaPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'trend' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#FAF8F4] mb-4">Weekly Performance</h3>
          <div className="space-y-3">
            {studentReports.performanceTrend.map((point, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-20 text-[#9CA3AF] text-sm">{point.week}</div>
                <div className="flex-1 bg-[#0E0F13] rounded-full h-2">
                  <div className="h-full bg-gradient-to-r from-[#F6B26B] to-[#E69138]" style={{ width: `${point.grade}%` }} />
                </div>
                <div className="w-10 text-right text-[#F6B26B] font-semibold">{point.grade}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Mentor Reports View
function MentorReportsView() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCourse, setSelectedCourse] = useState('CS101')

  const mentorReports = {
    classSummary: {
      totalStudents: 45,
      avgGrade: 82.5,
      passRate: 95,
      atRisk: 2,
      courseCount: 3
    },
    courses: [
      { code: 'CS101', name: 'Intro to Programming', students: 45, avgGrade: 82.5, passRate: 95, atRisk: 2 },
      { code: 'CS201', name: 'Data Structures', students: 32, avgGrade: 79.8, passRate: 90, atRisk: 3 },
      { code: 'CS301', name: 'Algorithms', students: 28, avgGrade: 84.2, passRate: 96, atRisk: 1 }
    ],
    atRiskStudents: [
      { id: 'S001', name: 'John Smith', course: 'CS101', grade: 62, attendance: 75, reason: 'Low attendance and grades' },
      { id: 'S002', name: 'Sarah Johnson', course: 'CS201', grade: 68, attendance: 82, reason: 'Missed last 3 assignments' }
    ],
    gradingStats: {
      submitted: 180,
      graded: 165,
      pending: 15,
      avgGradingTime: '48 hours'
    }
  }

  const selectedCourseData = mentorReports.courses.find(c => c.code === selectedCourse)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">Class Reports</h1>
            <p className="text-[#9CA3AF]">Manage class analytics and student performance</p>
          </div>
          <button className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors">
            📥 Export Reports
          </button>
        </div>
      </motion.div>

      {/* Overall Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Total Students</p>
            <p className="text-3xl font-bold text-[#F6B26B]">{mentorReports.classSummary.totalStudents}</p>
          </div>
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Courses Teaching</p>
            <p className="text-3xl font-bold text-[#F6B26B]">{mentorReports.classSummary.courseCount}</p>
          </div>
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Avg Class Grade</p>
            <p className="text-3xl font-bold text-[#F6B26B]">{mentorReports.classSummary.avgGrade}%</p>
          </div>
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Pass Rate</p>
            <p className="text-3xl font-bold text-green-500">{mentorReports.classSummary.passRate}%</p>
          </div>
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">At Risk</p>
            <p className="text-3xl font-bold text-red-500">{mentorReports.classSummary.atRisk}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <div className="flex gap-4 border-b border-[#2A2C31]">
          {['overview', 'atRisk', 'grading'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-[#F6B26B] border-b-2 border-[#F6B26B]'
                  : 'text-[#9CA3AF] hover:text-[#FAF8F4]'
              }`}
            >
              {tab === 'overview' && 'Course Overview'}
              {tab === 'atRisk' && 'At Risk Students'}
              {tab === 'grading' && 'Grading Status'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {mentorReports.courses.map((course) => (
            <div key={course.code} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 cursor-pointer hover:border-[#F6B26B] transition-colors" onClick={() => setSelectedCourse(course.code)}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#FAF8F4] mb-1">{course.code}: {course.name}</h3>
                  <p className="text-[#9CA3AF]">{course.students} students enrolled</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-[#9CA3AF] text-sm">Avg Grade</p>
                  <p className="text-2xl font-bold text-[#F6B26B]">{course.avgGrade}%</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-500">{course.passRate}%</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">At Risk</p>
                  <p className="text-2xl font-bold text-red-500">{course.atRisk}</p>
                </div>
                <div>
                  <button className="px-3 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'atRisk' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {mentorReports.atRiskStudents.length > 0 ? (
            mentorReports.atRiskStudents.map((student) => (
              <div key={student.id} className="bg-[#1A1C21] border border-red-500/30 rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#FAF8F4]">{student.name}</h3>
                    <p className="text-[#9CA3AF]">{student.course}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded-full text-sm">At Risk</span>
                </div>
                <p className="text-[#9CA3AF] mb-3">{student.reason}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[#9CA3AF]">Current Grade</p>
                    <p className="text-xl font-bold text-red-500">{student.grade}%</p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF]">Attendance</p>
                    <p className="text-xl font-bold text-orange-500">{student.attendance}%</p>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded text-sm w-full">
                      Contact Student
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 text-center">
              <p className="text-[#9CA3AF]">No at-risk students at this time</p>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'grading' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0E0F13] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-2">Submitted</p>
              <p className="text-3xl font-bold text-[#FAF8F4]">{mentorReports.gradingStats.submitted}</p>
            </div>
            <div className="bg-[#0E0F13] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-2">Graded</p>
              <p className="text-3xl font-bold text-green-500">{mentorReports.gradingStats.graded}</p>
            </div>
            <div className="bg-[#0E0F13] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-orange-500">{mentorReports.gradingStats.pending}</p>
            </div>
            <div className="bg-[#0E0F13] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-2">Avg Time</p>
              <p className="text-lg font-bold text-[#F6B26B]">{mentorReports.gradingStats.avgGradingTime}</p>
            </div>
          </div>
          <div>
            <p className="text-[#9CA3AF] text-sm mb-2">Grading Progress</p>
            <div className="w-full bg-[#0E0F13] rounded-full h-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#F6B26B] to-[#E69138]" style={{ width: `${(mentorReports.gradingStats.graded / mentorReports.gradingStats.submitted) * 100}%` }} />
            </div>
            <p className="text-[#9CA3AF] text-sm mt-2">{Math.round((mentorReports.gradingStats.graded / mentorReports.gradingStats.submitted) * 100)}% complete</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Admin Reports View
function AdminReportsView() {
  const [activeTab, setActiveTab] = useState('system')

  const adminReports = {
    systemMetrics: {
      totalStudents: 1240,
      totalCourses: 156,
      activeFaculty: 87,
      avgGPA: 3.18,
      passRate: 91.5,
      enrollmentRate: 94.2
    },
    departmentStats: [
      { name: 'Engineering', students: 420, courses: 52, avgGPA: 3.25, atRisk: 12 },
      { name: 'Business', students: 380, courses: 38, avgGPA: 3.10, atRisk: 18 },
      { name: 'Arts & Sciences', students: 280, courses: 45, avgGPA: 3.22, atRisk: 8 },
      { name: 'Health Sciences', students: 160, courses: 21, avgGPA: 3.05, atRisk: 6 }
    ],
    institutionalTrends: [
      { month: 'Aug', enrollment: 1180, completion: 89, satisfaction: 4.2 },
      { month: 'Sep', enrollment: 1200, completion: 90, satisfaction: 4.3 },
      { month: 'Oct', enrollment: 1220, completion: 91, satisfaction: 4.4 },
      { month: 'Nov', enrollment: 1240, completion: 91.5, satisfaction: 4.45 }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">Institution Reports</h1>
            <p className="text-[#9CA3AF]">System-wide analytics and institutional metrics</p>
          </div>
          <button className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors">
            📥 Export All
          </button>
        </div>
      </motion.div>

      {/* System Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/50 rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Total Students</p>
            <p className="text-3xl font-bold text-blue-400">{adminReports.systemMetrics.totalStudents}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/50 rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Total Courses</p>
            <p className="text-3xl font-bold text-purple-400">{adminReports.systemMetrics.totalCourses}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/20 border border-pink-500/50 rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Active Faculty</p>
            <p className="text-3xl font-bold text-pink-400">{adminReports.systemMetrics.activeFaculty}</p>
          </div>
          <div className="bg-gradient-to-br from-[#F6B26B] to-[#E69138]/50 border border-[#F6B26B]/50 rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Avg GPA</p>
            <p className="text-3xl font-bold text-[#F6B26B]">{adminReports.systemMetrics.avgGPA}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-500/50 rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Pass Rate</p>
            <p className="text-3xl font-bold text-green-400">{adminReports.systemMetrics.passRate}%</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-900/20 border border-cyan-500/50 rounded-lg p-6">
            <p className="text-[#9CA3AF] text-sm mb-2">Enrollment</p>
            <p className="text-3xl font-bold text-cyan-400">{adminReports.systemMetrics.enrollmentRate}%</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <div className="flex gap-4 border-b border-[#2A2C31]">
          {['system', 'departments', 'trends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-[#F6B26B] border-b-2 border-[#F6B26B]'
                  : 'text-[#9CA3AF] hover:text-[#FAF8F4]'
              }`}
            >
              {tab === 'system' && 'System Overview'}
              {tab === 'departments' && 'Department Stats'}
              {tab === 'trends' && 'Institutional Trends'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {activeTab === 'system' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#FAF8F4] mb-4">System Health Dashboard</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-[#9CA3AF] text-sm mb-2">Student Engagement</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#0E0F13] rounded-full h-3">
                  <div className="h-full bg-gradient-to-r from-[#F6B26B] to-[#E69138]" style={{ width: '87%' }} />
                </div>
                <span className="text-[#F6B26B] font-bold">87%</span>
              </div>
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm mb-2">Course Quality</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#0E0F13] rounded-full h-3">
                  <div className="h-full bg-gradient-to-r from-green-600 to-green-500" style={{ width: '92%' }} />
                </div>
                <span className="text-green-400 font-bold">92%</span>
              </div>
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm mb-2">Student Satisfaction</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#0E0F13] rounded-full h-3">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: '94%' }} />
                </div>
                <span className="text-blue-400 font-bold">94%</span>
              </div>
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm mb-2">System Uptime</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#0E0F13] rounded-full h-3">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400" style={{ width: '99.9%' }} />
                </div>
                <span className="text-purple-400 font-bold">99.9%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'departments' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4">
          {adminReports.departmentStats.map((dept, idx) => (
            <div key={idx} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#FAF8F4] mb-4">{dept.name}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-[#9CA3AF]">Students</p>
                  <p className="text-[#F6B26B] font-semibold">{dept.students}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#9CA3AF]">Courses</p>
                  <p className="text-[#F6B26B] font-semibold">{dept.courses}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#9CA3AF]">Avg GPA</p>
                  <p className="text-[#F6B26B] font-semibold">{dept.avgGPA}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#9CA3AF]">At Risk</p>
                  <p className="text-red-500 font-semibold">{dept.atRisk}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'trends' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0E0F13]">
                <tr>
                  <th className="px-4 py-2 text-left text-[#9CA3AF]">Month</th>
                  <th className="px-4 py-2 text-left text-[#9CA3AF]">Enrollment</th>
                  <th className="px-4 py-2 text-left text-[#9CA3AF]">Completion</th>
                  <th className="px-4 py-2 text-left text-[#9CA3AF]">Satisfaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2C31]">
                {adminReports.institutionalTrends.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#16181D]">
                    <td className="px-4 py-3 text-[#FAF8F4]">{row.month}</td>
                    <td className="px-4 py-3 text-[#F6B26B]">{row.enrollment}</td>
                    <td className="px-4 py-3 text-green-500">{row.completion}%</td>
                    <td className="px-4 py-3 text-blue-400">⭐ {row.satisfaction}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Main Component
export default function ReportsPage() {
  const { user } = useAuth()

  if (user?.role === 'admin') return <AdminReportsView />
  if (user?.role === 'mentor') return <MentorReportsView />
  return <StudentReportsView />
}
