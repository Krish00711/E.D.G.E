import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

function StudentsPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState([
    { id: 1, name: 'Alex Chen', email: 'alex@student.com', riskLevel: 'High', status: 'Active', enrolledCourses: 4 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@student.com', riskLevel: 'Medium', status: 'Active', enrolledCourses: 3 },
    { id: 3, name: 'Michael Davis', email: 'michael@student.com', riskLevel: 'Low', status: 'Active', enrolledCourses: 5 },
    { id: 4, name: 'Emma Wilson', email: 'emma@student.com', riskLevel: 'High', status: 'Inactive', enrolledCourses: 0 },
    { id: 5, name: 'James Brown', email: 'james@student.com', riskLevel: 'Low', status: 'Active', enrolledCourses: 4 },
  ])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'text-red-400'
      case 'Medium': return 'text-yellow-400'
      case 'Low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskBgColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-red-500/10 border-red-500/30'
      case 'Medium': return 'bg-yellow-500/10 border-yellow-500/30'
      case 'Low': return 'bg-green-500/10 border-green-500/30'
      default: return 'bg-gray-500/10 border-gray-500/30'
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] pt-28 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">Student Management</h1>
          <p className="text-[#9CA3AF]">Manage and monitor all students in the system</p>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-lg border border-slate-700 bg-slate-800/50"
        >
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F6B26B]"
            />
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-[#F6B26B] text-[#0E0F13] rounded-lg hover:bg-orange-400 font-medium transition">
                Add Student
              </button>
              <button className="px-4 py-2 border border-slate-600 text-[#FAF8F4] rounded-lg hover:bg-slate-700 transition">
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/30"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Name</th>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Email</th>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Risk Level</th>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Courses</th>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredStudents.map((student, idx) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-700/50 transition"
                  >
                    <td className="px-6 py-4 text-[#FAF8F4]">{student.name}</td>
                    <td className="px-6 py-4 text-[#9CA3AF] text-sm">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${getRiskColor(student.riskLevel)}`}>
                        {student.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === 'Active'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#9CA3AF]">{student.enrolledCourses}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-[#F6B26B] hover:text-orange-300 font-medium transition text-sm"
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Selected Student Details */}
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-lg border border-slate-700 bg-slate-800/50"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#FAF8F4] mb-2">{selectedStudent.name}</h2>
                <p className="text-[#9CA3AF]">{selectedStudent.email}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-[#9CA3AF] hover:text-[#FAF8F4] transition"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border ${getRiskBgColor(selectedStudent.riskLevel)}`}>
                <p className="text-[#9CA3AF] text-sm mb-1">Risk Level</p>
                <p className={`text-lg font-bold ${getRiskColor(selectedStudent.riskLevel)}`}>
                  {selectedStudent.riskLevel}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                <p className="text-[#9CA3AF] text-sm mb-1">Status</p>
                <p className="text-lg font-bold text-[#FAF8F4]">{selectedStudent.status}</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                <p className="text-[#9CA3AF] text-sm mb-1">Courses</p>
                <p className="text-lg font-bold text-[#FAF8F4]">{selectedStudent.enrolledCourses}</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                <p className="text-[#9CA3AF] text-sm mb-1">ID</p>
                <p className="text-lg font-bold text-[#FAF8F4]">#{selectedStudent.id}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default StudentsPage
