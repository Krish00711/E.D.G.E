import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

function MentorDashboard({ mentorId }) {
  const [stats, setStats] = useState({
    myStudents: 0,
    activeCourses: 0,
    pendingInterventions: 0,
    successRate: 0,
  })
  const [myClasses, setMyClasses] = useState([])
  const [studentAlerts, setStudentAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load mentor dashboard data
    setLoading(true)
    try {
      // Mock data for demonstration
      setStats({
        myStudents: 45,
        activeCourses: 3,
        pendingInterventions: 7,
        successRate: 82,
      })

      setMyClasses([
        { id: 1, name: 'Introduction to Computer Science', code: 'CS101', students: 32, time: 'MWF 10:00-11:30' },
        { id: 2, name: 'Data Structures', code: 'CS201', students: 28, time: 'TuTh 14:00-15:30' },
        { id: 3, name: 'Algorithms', code: 'CS301', students: 15, time: 'W 16:00-18:00' },
      ])

      setStudentAlerts([
        { id: 1, student: 'Sarah Johnson', course: 'CS101', risk: 'High', issue: 'High workload stress', timestamp: '30 mins ago' },
        { id: 2, student: 'Michael Chen', course: 'CS201', risk: 'Medium', issue: 'Falling behind on assignments', timestamp: '1 hour ago' },
        { id: 3, student: 'Emma Davis', course: 'CS101', risk: 'High', issue: 'Sleep deprivation detected', timestamp: '2 hours ago' },
        { id: 4, student: 'James Wilson', course: 'CS301', risk: 'Medium', issue: 'Needs academic support', timestamp: '3 hours ago' },
      ])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [mentorId])

  const StatCard = ({ label, value, unit, color }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-lg p-6 border ${color} backdrop-blur-sm`}
    >
      <p className="text-[#9CA3AF] text-sm font-medium mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#FAF8F4]">
        {value}{unit && <span className="text-lg ml-1">{unit}</span>}
      </p>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F6B26B]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Key Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-[#FAF8F4] mb-6">My Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="My Students"
            value={stats.myStudents}
            color="border-blue-500/30 bg-blue-500/5"
          />
          <StatCard
            label="Active Courses"
            value={stats.activeCourses}
            color="border-green-500/30 bg-green-500/5"
          />
          <StatCard
            label="Pending Interventions"
            value={stats.pendingInterventions}
            color="border-orange-500/30 bg-orange-500/5"
          />
          <StatCard
            label="Success Rate"
            value={stats.successRate}
            unit="%"
            color="border-emerald-500/30 bg-emerald-500/5"
          />
        </div>
      </motion.div>

      {/* My Classes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-[#FAF8F4] mb-6">My Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myClasses.map((course) => (
            <motion.a
              key={course.id}
              href={`/courses/${course.id}`}
              whileHover={{ y: -4 }}
              className="p-6 rounded-lg border border-slate-700 hover:border-[#F6B26B] bg-slate-800/50 hover:bg-slate-800/80 transition cursor-pointer"
            >
              <h3 className="text-[#FAF8F4] font-semibold mb-2">{course.name}</h3>
              <p className="text-[#9CA3AF] text-sm mb-3">{course.code}</p>
              <div className="space-y-2 mb-3">
                <p className="text-[#9CA3AF] text-xs">👥 {course.students} students</p>
                <p className="text-[#9CA3AF] text-xs">⏰ {course.time}</p>
              </div>
              <button className="mt-4 w-full px-3 py-2 rounded bg-[#F6B26B] hover:bg-orange-400 text-[#0E0F13] font-medium text-sm transition">
                View Class
              </button>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Student Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-[#FAF8F4] mb-6">Student Alerts</h2>
        <div className="space-y-3">
          {studentAlerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-4 rounded-lg border ${
                alert.risk === 'High'
                  ? 'border-red-500/30 bg-red-500/5'
                  : 'border-yellow-500/30 bg-yellow-500/5'
              } hover:border-[#F6B26B] transition`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-[#FAF8F4] font-semibold">{alert.student}</p>
                  <p className="text-[#9CA3AF] text-sm">{alert.course}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    alert.risk === 'High'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}
                >
                  {alert.risk} Risk
                </span>
              </div>
              <p className="text-[#9CA3AF] text-sm mb-3">{alert.issue}</p>
              <div className="flex justify-between items-center">
                <span className="text-[#9CA3AF] text-xs">{alert.timestamp}</span>
                <button className="px-3 py-1 rounded bg-[#F6B26B] hover:bg-orange-400 text-[#0E0F13] font-medium text-xs transition">
                  Take Action
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Intervention Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-[#FAF8F4] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Schedule Intervention', icon: '📅', href: '/interventions/new' },
            { title: 'View Analytics', icon: '📊', href: '/student-analytics' },
            { title: 'Manage Courses', icon: '📚', href: '/my-courses' },
          ].map((action, idx) => (
            <a
              key={idx}
              href={action.href}
              className="p-6 rounded-lg border border-slate-700 hover:border-[#F6B26B] bg-slate-800/50 hover:bg-slate-800/80 transition group cursor-pointer text-center"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition">{action.icon}</div>
              <p className="text-[#FAF8F4] font-semibold group-hover:text-[#F6B26B] transition">{action.title}</p>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default MentorDashboard
