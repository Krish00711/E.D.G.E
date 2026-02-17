import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function CoursesPage() {
  const { user } = useAuth()

  // Render role-specific views
  if (user?.role === 'admin') {
    return <AdminCoursesView />
  } else if (user?.role === 'mentor') {
    return <MentorCoursesView />
  } else {
    return <StudentCoursesView />
  }
}

// STUDENT VIEW - Enrolled courses
function StudentCoursesView() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const res = await api.courses.list()
      setCourses(res.courses || res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = Array.isArray(courses) ? courses.filter(c =>
    !searchTerm || c?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center pt-32"><div className="text-[#FAF8F4]">Loading courses...</div></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">My Enrolled Courses</h1>

          <div className="mb-8">
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F6B26B]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-[#F6B26B] transition"
              >
                <h3 className="text-lg font-bold text-[#FAF8F4] mb-2">{course.title}</h3>
                <p className="text-[#9CA3AF] text-sm mb-4">{course.code}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-[#9CA3AF] text-sm">👨‍🏫 {course.instructorId?.name || 'Instructor'}</p>
                  <p className="text-[#9CA3AF] text-sm">📚 {course.credits || 3} credits</p>
                </div>
                <button className="w-full px-4 py-2 bg-[#F6B26B] hover:bg-orange-400 text-[#0E0F13] rounded-lg font-medium transition">
                  View Course
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// MENTOR VIEW - Teaching courses
function MentorCoursesView() {
  const [courses, setCourses] = useState([
    { _id: '1', title: 'Introduction to Computer Science', code: 'CS101', credits: 3, students: 32, semester: 'Spring 2025' },
    { _id: '2', title: 'Data Structures', code: 'CS201', credits: 3, students: 28, semester: 'Spring 2025' },
  ])
  const [loading, setLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#FAF8F4]">My Teaching Courses</h1>
            <button className="px-6 py-2 bg-[#F6B26B] hover:bg-orange-400 text-[#0E0F13] rounded-lg font-medium transition">
              + Create Course
            </button>
          </div>

          {/* Course statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Courses', value: courses.length },
              { label: 'Total Students', value: courses.reduce((s, c) => s + c.students, 0) },
              { label: 'Avg Class Size', value: (courses.reduce((s, c) => s + c.students, 0) / courses.length).toFixed(1) },
              { label: 'At Risk Students', value: 7 },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-4 rounded-lg border border-slate-700 bg-slate-800/50"
              >
                <p className="text-[#9CA3AF] text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-[#FAF8F4]">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Courses table */}
          <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Course</th>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Code</th>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Students</th>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">At Risk</th>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Semester</th>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {courses.map((course, idx) => (
                    <motion.tr
                      key={course._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-700/50"
                    >
                      <td className="px-6 py-4 text-[#FAF8F4] font-medium">{course.title}</td>
                      <td className="px-6 py-4 text-[#9CA3AF]">{course.code}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300">
                          {course.students}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-300">
                          3
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF]">{course.semester}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="text-[#F6B26B] hover:text-orange-300 font-medium text-sm"
                        >
                          Manage
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Course details modal */}
          {selectedCourse && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 rounded-lg border border-slate-700 bg-slate-800/50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#FAF8F4]">{selectedCourse.title}</h2>
                  <p className="text-[#9CA3AF]">{selectedCourse.code}</p>
                </div>
                <button onClick={() => setSelectedCourse(null)} className="text-[#9CA3AF] hover:text-[#FAF8F4]">✕</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                  <p className="text-[#9CA3AF] text-sm mb-1">Students</p>
                  <p className="text-2xl font-bold text-[#FAF8F4]">{selectedCourse.students}</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                  <p className="text-[#9CA3AF] text-sm mb-1">Credits</p>
                  <p className="text-2xl font-bold text-[#FAF8F4]">{selectedCourse.credits}</p>
                </div>
                <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
                  <p className="text-[#9CA3AF] text-sm mb-1">At Risk</p>
                  <p className="text-2xl font-bold text-red-400">3</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                  <p className="text-[#9CA3AF] text-sm mb-1">Need Help</p>
                  <p className="text-2xl font-bold text-yellow-400">2</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button className="px-6 py-2 bg-[#F6B26B] hover:bg-orange-400 text-[#0E0F13] rounded-lg font-medium transition">
                  View Roster
                </button>
                <button className="px-6 py-2 border border-slate-600 text-[#FAF8F4] rounded-lg hover:bg-slate-700 font-medium transition">
                  View Grades
                </button>
                <button className="px-6 py-2 border border-slate-600 text-[#FAF8F4] rounded-lg hover:bg-slate-700 font-medium transition">
                  View Analytics
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// ADMIN VIEW - All courses management
function AdminCoursesView() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', code: '', description: '', credits: 3 })
  const [filterInstructor, setFilterInstructor] = useState('all')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const res = await api.courses.list()
      setCourses(res.courses || res)
    } catch (err) {
      console.error('Failed to load courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.courses.create(formData)
      alert('Course created successfully!')
      setFormData({ title: '', code: '', description: '', credits: 3 })
      setShowForm(false)
      loadCourses()
    } catch (err) {
      alert('Failed to create course: ' + err.message)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center pt-32"><div className="text-[#FAF8F4]">Loading...</div></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#FAF8F4]">Course Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors"
            >
              + Add Course
            </button>
          </div>

          {/* Create form */}
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-6 rounded-lg border border-slate-700 bg-slate-800/50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Course Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4]" required />
                <input type="text" placeholder="Course Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4]" required />
                <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4]" rows="4"></textarea>
                <input type="number" placeholder="Credits" value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4]" min="1" required />
                <button type="submit" className="w-full px-4 py-2 bg-[#F6B26B] hover:bg-orange-400 text-[#0E0F13] rounded-lg font-medium transition">Create Course</button>
              </form>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Courses', value: courses.length },
              { label: 'Active Instructors', value: new Set(courses.map(c => c.instructorId?.name)).size },
              { label: 'Total Students', value: courses.reduce((s, c) => s + (c.studentCount || 0), 0) },
              { label: 'Total Credits', value: courses.reduce((s, c) => s + (c.credits || 0), 0) },
            ].map((stat, idx) => (
              <motion.div key={idx} whileHover={{ y: -4 }} className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
                <p className="text-[#9CA3AF] text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-[#FAF8F4]">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Courses table */}
          <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Course</th>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Code</th>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Instructor</th>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Students</th>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Credits</th>
                    <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {courses.map((course, idx) => (
                    <motion.tr key={course._id || idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 text-[#FAF8F4]">{course.title}</td>
                      <td className="px-6 py-4 text-[#9CA3AF]">{course.code}</td>
                      <td className="px-6 py-4 text-[#9CA3AF]">{course.instructorId?.name || 'N/A'}</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 rounded text-sm bg-blue-500/20 text-blue-300">{course.studentCount || 0}</span></td>
                      <td className="px-6 py-4 text-[#FAF8F4]">{course.credits}</td>
                      <td className="px-6 py-4 text-sm space-x-3">
                        <button className="text-[#F6B26B] hover:text-orange-300">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
