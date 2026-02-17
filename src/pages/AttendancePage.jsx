import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([])
  const [rate, setRate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  
  // Enhanced filters and stats
  const [courseFilter, setCourseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('30')

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const studentId = user?.studentId || user?.id
      if (!studentId) {
        setAttendance([])
        setRate(null)
        return
      }
      const [attendanceRes, rateRes] = await Promise.all([
        api.attendance.list({ studentId }),
        api.attendance.getRate(studentId)
      ])
      setAttendance(attendanceRes.records || [])
      setRate(rateRes.attendanceRate ?? null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'bg-green-500/20 text-green-500 border-green-500/50'
      case 'absent': return 'bg-red-500/20 text-red-500 border-red-500/50'
      case 'late': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50'
    }
  }

  // Computed stats and filters
  const uniqueCourses = [...new Set(attendance.map(a => a.courseId?.title || a.courseId?.code).filter(Boolean))]
  
  const filteredAttendance = attendance
    .filter(a => courseFilter === 'all' || (a.courseId?.title === courseFilter || a.courseId?.code === courseFilter))
    .filter(a => statusFilter === 'all' || a.status?.toLowerCase() === statusFilter.toLowerCase())
  
  const statusCounts = {
    present: filteredAttendance.filter(a => a.status?.toLowerCase() === 'present').length,
    absent: filteredAttendance.filter(a => a.status?.toLowerCase() === 'absent').length,
    late: filteredAttendance.filter(a => a.status?.toLowerCase() === 'late').length
  }
  
  // Calculate streak (consecutive present days)
  const sortedAttendance = [...attendance].sort((a, b) => new Date(b.date) - new Date(a.date))
  let currentStreak = 0
  for (const record of sortedAttendance) {
    if (record.status?.toLowerCase() === 'present') {
      currentStreak++
    } else {
      break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading attendance...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Attendance</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Overall Rate</p>
              <p className="text-2xl font-bold text-[#F6B26B]">{rate?.toFixed(1) || 0}%</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Present</p>
              <p className="text-2xl font-bold text-green-500">{statusCounts.present}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Absent</p>
              <p className="text-2xl font-bold text-red-500">{statusCounts.absent}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Late</p>
              <p className="text-2xl font-bold text-yellow-500">{statusCounts.late}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Streak</p>
              <p className="text-2xl font-bold text-[#F6B26B]">🔥 {currentStreak}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#9CA3AF] text-sm mb-2">Filter by Course</label>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map((course, idx) => (
                    <option key={idx} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#9CA3AF] text-sm mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                >
                  <option value="all">All Statuses</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
              <div>
                <label className="block text-[#9CA3AF] text-sm mb-2">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Attendance Rate Card */}
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Attendance Rate</h2>
            {rate !== null ? (
              <div className="flex items-center gap-4">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-[#F6B26B]">
                    {rate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex-1 h-4 bg-[#0E0F13] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F6B26B] to-[#E69138]"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-[#9CA3AF]">No attendance data available</p>
            )}
          </div>

          {/* Attendance Records */}
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-[#2A2C31]">
              <h2 className="text-xl font-semibold text-[#FAF8F4]">Attendance History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0E0F13]">
                  <tr>
                    <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Date</th>
                    <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Course</th>
                    <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Status</th>
                    <th className="px-6 py-3 text-left text-[#9CA3AF] font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2C31]">
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record, idx) => (
                      <tr key={idx} className="hover:bg-[#16181D] transition-colors">
                        <td className="px-6 py-4 text-[#FAF8F4]">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-[#FAF8F4]">
                          {record.courseId?.title || record.courseId?.code || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(record.status)}`}>
                            {record.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#9CA3AF] max-w-xs truncate">
                          {record.notes || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-[#9CA3AF]">
                        {courseFilter !== 'all' || statusFilter !== 'all'
                          ? 'No attendance records match your filters'
                          : 'No attendance records available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
