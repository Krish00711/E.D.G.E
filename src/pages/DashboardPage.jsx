import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import StudentDashboard from '../components/StudentDashboard'
import MentorDashboard from '../components/MentorDashboard'
import AdminDashboard from '../components/AdminDashboard'

function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <p className="text-[#FAF8F4] text-2xl mb-4">You must be logged in to view your dashboard</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-[#F6B26B] text-[#0E0F13] rounded-lg hover:bg-orange-400 font-semibold transition"
          >
            Go to Login
          </button>
        </div>
      </motion.div>
    )
  }

  const getDashboardTitle = () => {
    switch (user.role) {
      case 'admin':
        return 'Admin Dashboard'
      case 'mentor':
        return 'Instructor Dashboard'
      case 'student':
      default:
        return 'Student Dashboard'
    }
  }

  const getDashboardDescription = () => {
    switch (user.role) {
      case 'admin':
        return 'System administration and oversight.'
      case 'mentor':
        return 'Manage your classes and monitor student wellbeing.'
      case 'student':
      default:
        return 'Real-time burnout monitoring and recovery insights.'
    }
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />
      case 'mentor':
        return <MentorDashboard mentorId={user.id} />
      case 'student':
      default:
        return <StudentDashboard studentId={user.studentId || user.id} />
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] pt-24 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto py-16">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">
              {getDashboardTitle()}
            </h1>
            <p className="text-[#9CA3AF] mb-4">
              Welcome, {user.name || user.email}!
            </p>
            <p className="text-[#9CA3AF] mb-8">
              {getDashboardDescription()}
            </p>
            {user.role && (
              <p className="text-[#9CA3AF] text-sm">
                Role: <span className="text-[#F6B26B] font-semibold capitalize">{user.role}</span>
              </p>
            )}
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm whitespace-nowrap ml-4"
          >
            Logout
          </button>
        </div>

        {renderDashboard()}
      </div>
    </motion.div>
  )
}

export default DashboardPage
