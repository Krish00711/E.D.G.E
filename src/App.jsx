import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ArchitecturePage from './pages/ArchitecturePage'
import IntelligencePage from './pages/IntelligencePage'
import DashboardPage from './pages/DashboardPage'
import TeamPage from './pages/TeamPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GradesPage from './pages/GradesPage'
import AttendancePage from './pages/AttendancePage'
import AssignmentsPage from './pages/AssignmentsPage'
import NotificationsPage from './pages/NotificationsPage'
import MessagesPage from './pages/MessagesPage'
import ForumsPage from './pages/ForumsPage'
import ResourcesPage from './pages/ResourcesPage'
import CoursesPage from './pages/CoursesPage'
import ReportsPage from './pages/ReportsPage'
import BulkImportPage from './pages/BulkImportPage'
import InstructorDashboardPage from './pages/InstructorDashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import EnhancedAnalyticsPage from './pages/EnhancedAnalyticsPage'
import CognitiveLoadPage from './pages/CognitiveLoadPage'
import RecoveryPage from './pages/RecoveryPage'
import InsightsPage from './pages/InsightsPage'
import ConsentPage from './pages/ConsentPage'
import SelfReportsPage from './pages/SelfReportsPage'
import ActivityLogsPage from './pages/ActivityLogsPage'
import SessionsPage from './pages/SessionsPage'
import MLDashboardPage from './pages/MLDashboardPage'
import StudentsPage from './pages/StudentsPage'
import UsersPage from './pages/UsersPage'
import SettingsPage from './pages/SettingsPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading...</div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/intelligence" element={<IntelligencePage />} />
        <Route path="/ml-dashboard" element={<ProtectedRoute><MLDashboardPage /></ProtectedRoute>} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/grades" element={<ProtectedRoute><GradesPage /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute><AssignmentsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/forums" element={<ProtectedRoute><ForumsPage /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/cognitive-load" element={<ProtectedRoute><CognitiveLoadPage /></ProtectedRoute>} />
        <Route path="/recovery" element={<ProtectedRoute><RecoveryPage /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
        <Route path="/consent" element={<ProtectedRoute><ConsentPage /></ProtectedRoute>} />
        <Route path="/self-reports" element={<ProtectedRoute><SelfReportsPage /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><ActivityLogsPage /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />
        <Route path="/advanced-analytics" element={<ProtectedRoute><EnhancedAnalyticsPage /></ProtectedRoute>} />
        <Route path="/instructor-dashboard" element={<ProtectedRoute><InstructorDashboardPage /></ProtectedRoute>} />
        <Route path="/bulk-import" element={<ProtectedRoute><BulkImportPage /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-[#F6B26B] border-transparent border-t-[#F6B26B] rounded-full mx-auto mb-4"
          />
          <p className="text-[#FAF8F4] text-lg font-medium">Loading E.D.G.E...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-x-hidden noise-texture">
      <Navbar />
      <AnimatedRoutes />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
