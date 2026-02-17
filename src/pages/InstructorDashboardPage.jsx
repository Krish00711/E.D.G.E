import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function InstructorDashboardPage() {
  const [instructor, setInstructor] = useState(null)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    loadDashboard()
  }, [user])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const instructorId = user?.instructorId || user?.id
      if (user?.role === 'mentor' && instructorId) {
        const [dashRes, coursesRes] = await Promise.all([
          api.instructors.getDashboard(instructorId),
          api.instructors.getCourses(instructorId)
        ])
        setInstructor(dashRes)
        setCourses(coursesRes.courses || coursesRes)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadCourseStudents = async (courseId) => {
    try {
      const res = await api.enrollments.getCourseStudents(courseId)
      setStudents(res.students || res)
    } catch (err) {
      alert('Failed to load students: ' + err.message)
    }
  }

  // Computed filters and metrics
  const filteredStudents = students
    .filter(s => !searchTerm ||
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(s => riskFilter === 'all' ||
      (riskFilter === 'high' && (!s.riskLevel || s.riskLevel === 'high')) ||
      (riskFilter === 'medium' && s.riskLevel === 'medium') ||
      (riskFilter === 'low' && s.riskLevel === 'low')
    )
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
      if (sortBy === 'gpa') return (b.gpa || 0) - (a.gpa || 0)
      if (sortBy === 'risk') {
        const riskOrder = { high: 3, medium: 2, low: 1 }
        return (riskOrder[b.riskLevel] || 0) - (riskOrder[a.riskLevel] || 0)
      }
      return 0
    })
  
  const riskCounts = {
    high: students.filter(s => !s.riskLevel || s.riskLevel === 'high').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    low: students.filter(s => s.riskLevel === 'low').length
  }

  if (user?.role !== 'mentor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#FAF8F4] mb-4">Access Denied</h1>
          <p className="text-[#9CA3AF]">Only instructors/mentors can access this dashboard</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading instructor dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Instructor Dashboard</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Dashboard Stats */}
          {instructor && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <p className="text-[#9CA3AF] text-sm mb-2">Total Courses</p>
                <p className="text-3xl font-bold text-[#F6B26B]">{instructor.totalCourses || 0}</p>
              </div>
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <p className="text-[#9CA3AF] text-sm mb-2">Total Students</p>
                <p className="text-3xl font-bold text-[#F6B26B]">{instructor.totalStudents || 0}</p>
              </div>
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <p className="text-[#9CA3AF] text-sm mb-2">Avg Class Size</p>
                <p className="text-3xl font-bold text-[#F6B26B]">{instructor.avgClassSize || 0}</p>
              </div>
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <p className="text-[#9CA3AF] text-sm mb-2">Pending Grades</p>
                <p className="text-3xl font-bold text-[#F6B26B]">{instructor.pendingGrades || 0}</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Courses List */}
            <div className="lg:col-span-1">
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#2A2C31]">
                  <h2 className="text-lg font-bold text-[#FAF8F4]">Your Courses</h2>
                </div>
                <div className="divide-y divide-[#2A2C31]">
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <button
                        key={course._id}
                        onClick={() => {
                          setSelectedCourse(course)
                          loadCourseStudents(course._id)
                        }}
                        className={`w-full text-left p-4 hover:bg-[#16181D] transition-colors ${
                          selectedCourse?._id === course._id ? 'bg-[#16181D] border-l-2 border-[#F6B26B]' : ''
                        }`}
                      >
                        <h3 className="font-semibold text-[#FAF8F4]">{course.title}</h3>
                        <p className="text-[#9CA3AF] text-sm">{course.code}</p>
                        <p className="text-[#9CA3AF] text-xs mt-1">
                          {course.studentCount || 0} students
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-[#9CA3AF]">No courses</div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="lg:col-span-2">
              {selectedCourse ? (
                <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg">
                  <div className="p-6 border-b border-[#2A2C31]">
                    <h2 className="text-2xl font-bold text-[#FAF8F4] mb-2">{selectedCourse.title}</h2>
                    <p className="text-[#9CA3AF]">{selectedCourse.code}</p>
                  </div>

                  {/* Course Stats */}
                  <div className="grid md:grid-cols-2 gap-4 p-6 border-b border-[#2A2C31]">
                    <div>
                      <p className="text-[#9CA3AF] text-sm mb-1">Credits</p>
                      <p className="text-2xl font-bold text-[#F6B26B]">{selectedCourse.credits}</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] text-sm mb-1">Enrolled Students</p>
                      <p className="text-2xl font-bold text-[#F6B26B]">{students.length}</p>
                    </div>
                  </div>

                  {/* Students List */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#FAF8F4] mb-4">Students ({students.length})</h3>
                    {students.length > 0 ? (
                      <div className="space-y-3">
                        {students.map((student, idx) => (
                          <div
                            key={idx}
                            className="bg-[#0E0F13] p-4 rounded-lg border border-[#2A2C31] hover:border-[#F6B26B] transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-[#FAF8F4]">{student.name}</h4>
                              <span className="text-xs bg-[#F6B26B] text-[#0E0F13] px-2 py-1 rounded">
                                ID: {student._id}
                              </span>
                            </div>
                            <p className="text-[#9CA3AF] text-sm">{student.email}</p>
                            {student.gpa && (
                              <p className="text-[#9CA3AF] text-sm mt-1">GPA: {student.gpa}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#9CA3AF]">No students enrolled</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-12 text-center">
                  <p className="text-[#9CA3AF]">Select a course to view details</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
