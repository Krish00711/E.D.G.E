import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    activeAlerts: 0,
    systemHealth: 95,
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load admin dashboard data
    setLoading(true)
    try {
      // Mock data for demonstration
      setStats({
        totalStudents: 1250,
        totalInstructors: 45,
        totalCourses: 125,
        activeAlerts: 23,
        systemHealth: 98.5,
      })

      setRecentActivities([
        { id: 1, action: 'Student enrolled', detail: 'Alex Chen in CS101', timestamp: '2 mins ago', type: 'enrollment' },
        { id: 2, action: 'Alert triggered', detail: 'High burnout risk - 5 students', timestamp: '15 mins ago', type: 'alert' },
        { id: 3, action: 'Course updated', detail: 'Mathematics 201 syllabus changed', timestamp: '45 mins ago', type: 'update' },
        { id: 4, action: 'New intervention', detail: 'Peer mentoring session scheduled', timestamp: '1 hour ago', type: 'intervention' },
        { id: 5, action: 'System backup', detail: 'Database backup completed successfully', timestamp: '2 hours ago', type: 'system' },
      ])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const StatCard = ({ label, value, color }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-lg p-6 border ${color} backdrop-blur-sm`}
    >
      <p className="text-[#9CA3AF] text-sm font-medium mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#FAF8F4]">{value}</p>
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
        <h2 className="text-2xl font-bold text-[#FAF8F4] mb-6">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Students"
            value={stats.totalStudents}
            color="border-blue-500/30 bg-blue-500/5"
          />
          <StatCard
            label="Instructors"
            value={stats.totalInstructors}
            color="border-green-500/30 bg-green-500/5"
          />
          <StatCard
            label="Courses"
            value={stats.totalCourses}
            color="border-purple-500/30 bg-purple-500/5"
          />
          <StatCard
            label="Active Alerts"
            value={stats.activeAlerts}
            color="border-red-500/30 bg-red-500/5"
          />
          <StatCard
            label="System Health"
            value={`${stats.systemHealth}%`}
            color="border-emerald-500/30 bg-emerald-500/5"
          />
        </div>
      </motion.div>

      {/* Management Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-[#FAF8F4] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Manage Students', icon: '👥', href: '/students' },
            { title: 'Manage Courses', icon: '📚', href: '/courses' },
            { title: 'Manage Instructors', icon: '🏫', href: '/instructors' },
            { title: 'System Settings', icon: '⚙️', href: '/settings' },
          ].map((action, idx) => (
            <a
              key={idx}
              href={action.href}
              className="p-6 rounded-lg border border-slate-700 hover:border-[#F6B26B] bg-slate-800/50 hover:bg-slate-800/80 transition group cursor-pointer"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition">{action.icon}</div>
              <p className="text-[#FAF8F4] font-semibold group-hover:text-[#F6B26B] transition">{action.title}</p>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-[#FAF8F4] mb-6">Recent Activities</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 transition flex justify-between items-start"
            >
              <div>
                <p className="text-[#FAF8F4] font-medium">{activity.action}</p>
                <p className="text-[#9CA3AF] text-sm mt-1">{activity.detail}</p>
              </div>
              <p className="text-[#9CA3AF] text-xs whitespace-nowrap ml-4">{activity.timestamp}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 rounded-lg border border-slate-700 bg-slate-800/50"
      >
        <h3 className="text-lg font-semibold text-[#FAF8F4] mb-4">System Status</h3>
        <div className="space-y-3">
          {[
            { service: 'Frontend API', status: 'Online', latency: '45ms' },
            { service: 'Backend Server', status: 'Online', latency: '12ms' },
            { service: 'Database', status: 'Online', latency: '5ms' },
            { service: 'ML Service', status: 'Online', latency: '234ms' },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-[#9CA3AF]">{item.service}</span>
              <div className="flex items-center gap-4">
                <span className="text-[#10B981] text-sm font-medium">{item.status}</span>
                <span className="text-[#9CA3AF] text-sm">{item.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
