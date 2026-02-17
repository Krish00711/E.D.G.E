import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function AnalyticsPage() {
  const { user } = useAuth()

  if (user?.role === 'admin') {
    return <AdminAnalyticsView />
  } else if (user?.role === 'mentor') {
    return <MentorAnalyticsView />
  } else {
    return <StudentAnalyticsView />
  }
}

// STUDENT - Personal analytics
function StudentAnalyticsView() {
  const [data, setData] = useState({
    gpa: 3.45,
    attendanceRate: 92,
    assignmentCompletion: 88,
    courseAverage: 87,
    trends: [
      { week: 'Week 1', performance: 85 },
      { week: 'Week 2', performance: 87 },
      { week: 'Week 3', performance: 86 },
      { week: 'Week 4', performance: 89 },
    ]
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">My Analytics</h1>

          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'GPA', value: data.gpa, unit: '/4.0' },
              { label: 'Attendance', value: data.attendanceRate, unit: '%' },
              { label: 'Assignments', value: data.assignmentCompletion, unit: '%' },
              { label: 'Avg Grade', value: data.courseAverage, unit: '%' },
            ].map((metric, idx) => (
              <motion.div key={idx} whileHover={{ y: -4 }} className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
                <p className="text-[#9CA3AF] text-sm mb-2">{metric.label}</p>
                <p className="text-3xl font-bold text-[#FAF8F4]">{metric.value}{metric.unit}</p>
              </motion.div>
            ))}
          </div>

          {/* Performance trends */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-bold text-[#FAF8F4] mb-4">Weekly Performance Trend</h2>
            <div className="space-y-3">
              {data.trends.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-[#9CA3AF] w-16">{item.week}</span>
                  <div className="flex-1 h-8 bg-slate-900 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#F6B26B] to-orange-400"
                      style={{ width: `${item.performance}%` }}
                    />
                  </div>
                  <span className="text-[#FAF8F4] font-semibold w-12 text-right">{item.performance}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// MENTOR - Class analytics
function MentorAnalyticsView() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courses] = useState([
    { _id: '1', title: 'CS101', students: 32, avgGrade: 82, passingRate: 94, atRisk: 3 },
    { _id: '2', title: 'CS201', students: 28, avgGrade: 85, passingRate: 96, atRisk: 2 },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Class Analytics</h1>

          {/* Overall metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Students', value: courses.reduce((s, c) => s + c.students, 0) },
              { label: 'Avg Class Grade', value: '83%' },
              { label: 'Pass Rate', value: '95%' },
              { label: 'At Risk', value: courses.reduce((s, c) => s + c.atRisk, 0) },
            ].map((metric, idx) => (
              <motion.div key={idx} whileHover={{ y: -4 }} className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
                <p className="text-[#9CA3AF] text-sm mb-2">{metric.label}</p>
                <p className="text-3xl font-bold text-[#FAF8F4]">{metric.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Per-course analytics */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-6 rounded-lg border border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-bold text-[#FAF8F4] mb-4">Course Performance</h2>
            <div className="space-y-4">
              {courses.map((course, idx) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedCourse(course)}
                  className="p-4 rounded-lg border border-slate-600 bg-slate-900/50 hover:border-[#F6B26B] cursor-pointer transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-[#FAF8F4]">{course.title}</h3>
                      <p className="text-[#9CA3AF] text-sm">{course.students} students</p>
                    </div>
                    <span className="px-3 py-1 rounded text-sm bg-red-500/20 text-red-300">{course.atRisk} at risk</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-[#9CA3AF] mb-1">Avg Grade</p>
                      <p className="text-lg font-bold text-[#FAF8F4]">{course.avgGrade}%</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] mb-1">Pass Rate</p>
                      <p className="text-lg font-bold text-green-400">{course.passingRate}%</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] mb-1">Status</p>
                      <p className="text-lg font-bold text-[#FAF8F4]">{course.passingRate > 90 ? '✓ Good' : '⚠ Check'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Selected course details */}
          {selectedCourse && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-[#FAF8F4]">{selectedCourse.title} - Detailed Analytics</h2>
                <button onClick={() => setSelectedCourse(null)} className="text-[#9CA3AF] hover:text-[#FAF8F4]">✕</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                  <p className="text-[#9CA3AF] text-sm mb-1">Students</p>
                  <p className="text-2xl font-bold text-[#FAF8F4]">{selectedCourse.students}</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                  <p className="text-[#9CA3AF] text-sm mb-1">Avg Grade</p>
                  <p className="text-2xl font-bold text-[#FAF8F4]">{selectedCourse.avgGrade}%</p>
                </div>
                <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                  <p className="text-[#9CA3AF] text-sm mb-1">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-400">{selectedCourse.passingRate}%</p>
                </div>
                <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
                  <p className="text-[#9CA3AF] text-sm mb-1">At Risk</p>
                  <p className="text-2xl font-bold text-red-400">{selectedCourse.atRisk}</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// ADMIN - Institution-wide analytics
function AdminAnalyticsView() {
  const [metrics] = useState({
    totalStudents: 1250,
    totalCourses: 125,
    avgGPA: 3.42,
    passRate: 94,
    atRiskStudents: 87,
    courseCompletion: 96,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">System Analytics</h1>

          {/* Key system metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Total Students', value: metrics.totalStudents, color: 'bg-blue-500/20 text-blue-400' },
              { label: 'Total Courses', value: metrics.totalCourses, color: 'bg-green-500/20 text-green-400' },
              { label: 'Avg GPA', value: metrics.avgGPA, color: 'bg-purple-500/20 text-purple-400' },
              { label: 'Pass Rate', value: `${metrics.passRate}%`, color: 'bg-emerald-500/20 text-emerald-400' },
              { label: 'At Risk', value: metrics.atRiskStudents, color: 'bg-red-500/20 text-red-400' },
              { label: 'Course Completion', value: `${metrics.courseCompletion}%`, color: 'bg-orange-500/20 text-orange-400' },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className={`p-4 rounded-lg border border-slate-700 ${metric.color} backdrop-blur-sm`}
              >
                <p className="text-[#9CA3AF] text-xs mb-1 font-medium">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Department breakdown */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-6 rounded-lg border border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-bold text-[#FAF8F4] mb-6">Department Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { dept: 'Engineering', students: 320, courses: 35, avgGPA: 3.58, atRisk: 12 },
                { dept: 'Business', students: 280, courses: 28, avgGPA: 3.42, atRisk: 18 },
                { dept: 'Arts & Sciences', students: 380, courses: 45, avgGPA: 3.28, atRisk: 35 },
                { dept: 'Health Sciences', students: 270, courses: 17, avgGPA: 3.68, atRisk: 8 },
              ].map((dept, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-lg border border-slate-600 bg-slate-900/50"
                >
                  <h3 className="font-bold text-[#FAF8F4] mb-3">{dept.dept}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-[#9CA3AF]">Students</p><p className="text-lg font-bold text-[#FAF8F4]">{dept.students}</p></div>
                    <div><p className="text-[#9CA3AF]">Courses</p><p className="text-lg font-bold text-[#FAF8F4]">{dept.courses}</p></div>
                    <div><p className="text-[#9CA3AF]">Avg GPA</p><p className="text-lg font-bold text-blue-400">{dept.avgGPA}</p></div>
                    <div><p className="text-[#9CA3AF]">At Risk</p><p className="text-lg font-bold text-red-400">{dept.atRisk}</p></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* System health */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-bold text-[#FAF8F4] mb-4">System Health</h2>
            <div className="space-y-4">
              {[
                { metric: 'User Engagement', value: 87 },
                { metric: 'Course Quality', value: 91 },
                { metric: 'Student Satisfaction', value: 84 },
                { metric: 'System Uptime', value: 99.8 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-[#9CA3AF] w-40">{item.metric}</span>
                  <div className="flex-1 h-6 bg-slate-900 rounded-lg overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        item.value >= 90 ? 'from-green-500 to-emerald-400' :
                        item.value >= 80 ? 'from-blue-500 to-cyan-400' :
                        'from-yellow-500 to-orange-400'
                      }`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-[#FAF8F4] font-semibold w-12 text-right">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
