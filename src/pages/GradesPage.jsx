import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// Student Grades View
function StudentGradesView() {
  const [courseFilter, setCourseFilter] = useState('all')

  const studentGrades = {
    gpa: 3.45,
    avgGrade: 84.5,
    totalGrades: 18,
    distribution: { A: 8, B: 7, C: 3, D: 0 },
    grades: [
      { id: 1, course: 'CS101', assignment: 'Midterm Exam', percentage: 92, date: '2024-11-10', feedback: 'Excellent performance' },
      { id: 2, course: 'CS101', assignment: 'Project 1', percentage: 88, date: '2024-11-08', feedback: 'Good work' },
      { id: 3, course: 'MATH201', assignment: 'Quiz 3', percentage: 85, date: '2024-11-05', feedback: 'Needs improvement on proofs' },
      { id: 4, course: 'MATH201', assignment: 'Homework 5', percentage: 90, date: '2024-11-01', feedback: 'Excellent' },
      { id: 5, course: 'PHY150', assignment: 'Lab Report', percentage: 78, date: '2024-10-28', feedback: 'Please revise methodology' }
    ]
  }

  const courses = [...new Set(studentGrades.grades.map(g => g.course))]
  const filteredGrades = courseFilter === 'all' 
    ? studentGrades.grades 
    : studentGrades.grades.filter(g => g.course === courseFilter)

  const getGradeColor = (pct) => {
    if (pct >= 90) return 'text-green-500'
    if (pct >= 80) return 'text-blue-500'
    if (pct >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">My Grades</h1>
        <p className="text-[#9CA3AF]">View your academic performance and grades</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Cumulative GPA</p>
          <p className="text-3xl font-bold text-[#F6B26B]">{studentGrades.gpa}</p>
          <p className="text-[#9CA3AF] text-xs mt-1">/ 4.0</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Average Grade</p>
          <p className="text-3xl font-bold text-[#F6B26B]">{studentGrades.avgGrade}%</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Total Grades</p>
          <p className="text-3xl font-bold text-[#F6B26B]">{studentGrades.totalGrades}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">A Grades</p>
          <p className="text-3xl font-bold text-green-500">{studentGrades.distribution.A}</p>
        </div>
      </motion.div>

      {/* Grade Distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
        <h3 className="text-lg font-bold text-[#FAF8F4] mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(studentGrades.distribution).map(([grade, count]) => (
            <div key={grade} className="text-center">
              <div className="text-3xl font-bold text-[#F6B26B] mb-2">{count}</div>
              <div className="text-[#9CA3AF]">{grade} ({count > 0 ? ((count / studentGrades.totalGrades) * 100).toFixed(0) : 0}%)</div>
              <div className="mt-2 h-2 bg-[#0E0F13] rounded-full overflow-hidden">
                <div
                  className={`h-full ${grade === 'A' ? 'bg-green-500' : grade === 'B' ? 'bg-blue-500' : grade === 'C' ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${count > 0 ? (count / studentGrades.totalGrades) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
        <label className="block text-[#9CA3AF] text-sm mb-2">Filter by Course</label>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
        >
          <option value="all">All Courses</option>
          {courses.map((course) => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </motion.div>

      {/* Grades Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#2A2C31]">
          <h3 className="text-lg font-bold text-[#FAF8F4]">Recent Grades</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0E0F13]">
              <tr>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Course</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Assignment</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Grade</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Date</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2C31]">
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-[#16181D]">
                  <td className="px-6 py-4 text-[#FAF8F4]">{grade.course}</td>
                  <td className="px-6 py-4 text-[#FAF8F4]">{grade.assignment}</td>
                  <td className={`px-6 py-4 font-semibold ${getGradeColor(grade.percentage)}`}>{grade.percentage}%</td>
                  <td className="px-6 py-4 text-[#9CA3AF]">{new Date(grade.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-[#9CA3AF]">{grade.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

// Mentor Grades View
function MentorGradesView() {
  const [selectedCourse, setSelectedCourse] = useState('CS101')
  const [gradeEntry, setGradeEntry] = useState({ studentId: '', assignmentId: '', grade: '' })

  const courses = [
    { code: 'CS101', name: 'Intro to Programming', students: 45, gradedCount: 180, totalGrades: 225 },
    { code: 'CS201', name: 'Data Structures', students: 32, gradedCount: 150, totalGrades: 160 },
    { code: 'CS301', name: 'Algorithms', students: 28, gradedCount: 196, totalGrades: 196 }
  ]

  const selectedCourseData = courses.find(c => c.code === selectedCourse)
  const gradingProgress = selectedCourseData ? (selectedCourseData.gradedCount / selectedCourseData.totalGrades * 100).toFixed(1) : 0

  const studentGrades = [
    { id: 'S001', name: 'John Smith', avgGrade: 92, count: 8, latestDate: '2024-11-10' },
    { id: 'S002', name: 'Alice Johnson', avgGrade: 85, count: 7, latestDate: '2024-11-09' },
    { id: 'S003', name: 'Bob Williams', avgGrade: 78, count: 6, latestDate: '2024-11-08' },
    { id: 'S004', name: 'Carol Davis', avgGrade: 88, count: 8, latestDate: '2024-11-10' },
    { id: 'S005', name: 'David Miller', avgGrade: 82, count: 7, latestDate: '2024-11-07' }
  ]

  const handleGradeSubmit = () => {
    alert(`Grade submitted: ${gradeEntry.grade}% for assignment ${gradeEntry.assignmentId}`)
    setGradeEntry({ studentId: '', assignmentId: '', grade: '' })
  }

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-500'
    if (grade >= 80) return 'text-blue-500'
    if (grade >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">Grading Management</h1>
        <p className="text-[#9CA3AF]">Enter and manage student grades</p>
      </motion.div>

      {/* Grade Entry Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
        <h3 className="text-lg font-bold text-[#FAF8F4] mb-4">Enter Grade</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <select className="bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]" placeholder="Select Student">
            <option>Select Student</option>
            {studentGrades.map(s => <option key={s.id}>{s.name}</option>)}
          </select>
          <input type="text" placeholder="Assignment ID" value={gradeEntry.assignmentId} onChange={(e) => setGradeEntry({...gradeEntry, assignmentId: e.target.value})} className="bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]" />
          <input type="number" min="0" max="100" placeholder="Grade (0-100)" value={gradeEntry.grade} onChange={(e) => setGradeEntry({...gradeEntry, grade: e.target.value})} className="bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]" />
          <button onClick={handleGradeSubmit} className="bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg px-4 py-2 transition-colors">
            Submit Grade
          </button>
        </div>
      </motion.div>

      {/* Course Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.code}
            onClick={() => setSelectedCourse(course.code)}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
              selectedCourse === course.code
                ? 'bg-[#1A1C21] border-[#F6B26B]'
                : 'bg-[#1A1C21] border-[#2A2C31] hover:border-[#F6B26B]/50'
            }`}
          >
            <h3 className="font-bold text-[#FAF8F4]">{course.code}</h3>
            <p className="text-[#9CA3AF] text-sm">{course.name}</p>
            <p className="text-[#F6B26B] font-semibold mt-2">{course.students} students</p>
          </div>
        ))}
      </motion.div>

      {/* Grading Progress */}
      {selectedCourseData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#FAF8F4] mb-4">Grading Progress for {selectedCourse}</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-[#9CA3AF]">Graded</span>
                <span className="text-[#F6B26B] font-semibold">{gradingProgress}%</span>
              </div>
              <div className="w-full bg-[#0E0F13] rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#F6B26B] to-[#E69138]" style={{ width: `${gradingProgress}%` }} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#FAF8F4] font-bold">{selectedCourseData.gradedCount}/{selectedCourseData.totalGrades}</p>
              <p className="text-[#9CA3AF] text-sm">grades submitted</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Student Grades */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#2A2C31]">
          <h3 className="text-lg font-bold text-[#FAF8F4]">Student Grades</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0E0F13]">
              <tr>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Student</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Avg Grade</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Grades Entered</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Last Updated</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2C31]">
              {studentGrades.map((student) => (
                <tr key={student.id} className="hover:bg-[#16181D]">
                  <td className="px-6 py-4 text-[#FAF8F4]">{student.name}</td>
                  <td className={`px-6 py-4 font-semibold ${getGradeColor(student.avgGrade)}`}>{student.avgGrade}%</td>
                  <td className="px-6 py-4 text-[#9CA3AF]">{student.count}</td>
                  <td className="px-6 py-4 text-[#9CA3AF]">{new Date(student.latestDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button className="text-[#F6B26B] hover:text-[#E69138] text-sm font-semibold">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

// Admin Grades View
function AdminGradesView() {
  const [selectedDept, setSelectedDept] = useState('all')

  const departments = {
    all: { name: 'All Departments', avgGrade: 83.2, median: 84, stdDev: 8.5, passRate: 91.2 },
    engineering: { name: 'Engineering', avgGrade: 84.1, median: 85, stdDev: 7.8, passRate: 93.5 },
    business: { name: 'Business', avgGrade: 81.9, median: 83, stdDev: 9.2, passRate: 89.4 },
    arts: { name: 'Arts & Sciences', avgGrade: 83.5, median: 84, stdDev: 8.1, passRate: 91.8 },
    health: { name: 'Health Sciences', avgGrade: 82.3, median: 83, stdDev: 8.9, passRate: 90.1 }
  }

  const selectedDeptData = departments[selectedDept]

  const courseStats = [
    { code: 'CS101', title: 'Intro to Programming', instructor: 'Dr. Smith', students: 45, avg: 84.5, passRate: 95, failing: 2 },
    { code: 'MATH201', title: 'Calculus II', instructor: 'Prof. Johnson', students: 38, avg: 79.2, passRate: 87, failing: 5 },
    { code: 'PHY150', title: 'Physics I', instructor: 'Dr. Williams', students: 32, avg: 81.8, passRate: 90, failing: 3 },
    { code: 'ENG120', title: 'English Composition', instructor: 'Prof. Davis', students: 35, avg: 85.3, passRate: 96, failing: 1 },
    { code: 'HIST101', title: 'World History', instructor: 'Dr. Miller', students: 40, avg: 82.1, passRate: 92, failing: 3 }
  ]

  const gradeDistribution = { A: 340, B: 520, C: 280, D: 65, F: 95 }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">Grade Analytics</h1>
        <p className="text-[#9CA3AF]">System-wide grading statistics and analytics</p>
      </motion.div>

      {/* Department Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3 overflow-x-auto">
        {Object.entries(departments).map(([key, dept]) => (
          <button
            key={key}
            onClick={() => setSelectedDept(key)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
              selectedDept === key
                ? 'bg-[#F6B26B] text-[#0E0F13]'
                : 'bg-[#1A1C21] border border-[#2A2C31] text-[#FAF8F4] hover:border-[#F6B26B]'
            }`}
          >
            {dept.name}
          </button>
        ))}
      </motion.div>

      {/* Statistics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Avg Grade</p>
          <p className="text-3xl font-bold text-[#F6B26B]">{selectedDeptData.avgGrade}%</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Median Grade</p>
          <p className="text-3xl font-bold text-blue-500">{selectedDeptData.median}%</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Std Deviation</p>
          <p className="text-3xl font-bold text-purple-500">{selectedDeptData.stdDev}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
          <p className="text-[#9CA3AF] text-sm mb-2">Pass Rate</p>
          <p className="text-3xl font-bold text-green-500">{selectedDeptData.passRate}%</p>
        </div>
      </motion.div>

      {/* Grade Distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
        <h3 className="text-lg font-bold text-[#FAF8F4] mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(gradeDistribution).map(([grade, count]) => {
            const total = Object.values(gradeDistribution).reduce((a, b) => a + b)
            return (
              <div key={grade} className="text-center">
                <div className="text-2xl font-bold text-[#F6B26B] mb-2">{count}</div>
                <div className="text-[#9CA3AF]">{grade}</div>
                <div className="mt-2 h-2 bg-[#0E0F13] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F6B26B] to-[#E69138]" style={{ width: `${(count / total) * 100}%` }} />
                </div>
                <p className="text-[#9CA3AF] text-xs mt-1">{((count / total) * 100).toFixed(0)}%</p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Course Statistics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#2A2C31]">
          <h3 className="text-lg font-bold text-[#FAF8F4]">Course Grade Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0E0F13]">
              <tr>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Course</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Instructor</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Students</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Avg Grade</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Pass Rate</th>
                <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Failing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2C31]">
              {courseStats.map((course) => (
                <tr key={course.code} className="hover:bg-[#16181D]">
                  <td className="px-6 py-4 text-[#FAF8F4]">
                    <div className="font-semibold">{course.code}</div>
                    <div className="text-[#9CA3AF] text-sm">{course.title}</div>
                  </td>
                  <td className="px-6 py-4 text-[#9CA3AF]">{course.instructor}</td>
                  <td className="px-6 py-4 text-[#FAF8F4]">{course.students}</td>
                  <td className="px-6 py-4 font-semibold text-[#F6B26B]">{course.avg}%</td>
                  <td className="px-6 py-4 text-green-500 font-semibold">{course.passRate}%</td>
                  <td className="px-6 py-4 text-red-500 font-semibold">{course.failing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

// Main Component
export default function GradesPage() {
  const { user } = useAuth()

  if (user?.role === 'admin') return <AdminGradesView />
  if (user?.role === 'mentor') return <MentorGradesView />
  return <StudentGradesView />
}
