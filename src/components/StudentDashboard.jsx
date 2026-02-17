import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import RiskAlertsPanel from './RiskAlertsPanel'
import InterventionRecommendations from './InterventionRecommendations'
import ProgressTracker from './ProgressTracker'

export default function StudentDashboard({ studentId }) {
  const { user } = useAuth()
  const effectiveStudentId = studentId || user?.studentId || user?.id

  const [prediction, setPrediction] = useState(null)
  const [loadRecord, setLoadRecord] = useState(null)
  const [consent, setConsent] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [selfReports, setSelfReports] = useState([])
  const [activities, setActivities] = useState([])
  const [sessions, setSessions] = useState([])
  const [grades, setGrades] = useState([])
  const [attendanceRate, setAttendanceRate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!effectiveStudentId) return
      try {
        setLoading(true)
        const [
          predRes,
          alertsRes,
          recRes,
          loadRes,
          consentRes,
          selfReportsRes,
          activitiesRes,
          sessionsRes,
          gradesRes,
          attendanceRes
        ] = await Promise.all([
          api.predictions.getLatest(effectiveStudentId).catch(() => null),
          api.alerts.list({ studentId: effectiveStudentId }),
          api.recommendations.list({ studentId: effectiveStudentId }),
          api.cognitiveLoad.current(effectiveStudentId),
          api.consent.getMe(),
          api.selfReports.list({ studentId: effectiveStudentId }),
          api.activity.list({ studentId: effectiveStudentId }),
          api.sessions.list({ studentId: effectiveStudentId }),
          api.grades.list({ studentId: effectiveStudentId }),
          api.attendance.getRate(effectiveStudentId)
        ])
        setPrediction(predRes)
        setAlerts(alertsRes || [])
        setRecommendations(recRes || [])
        setLoadRecord(loadRes)
        setConsent(consentRes)
        setSelfReports(selfReportsRes || [])
        setActivities(activitiesRes || [])
        setSessions(sessionsRes || [])
        setGrades(gradesRes?.grades || gradesRes || [])
        setAttendanceRate(attendanceRes?.attendanceRate ?? null)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [effectiveStudentId])

  const markRecommendation = async (id) => {
    await api.recommendations.update(id, 'accepted')
    setRecommendations((prev) => prev.map((rec) => (
      rec._id === id ? { ...rec, status: 'accepted' } : rec
    )))
  }

  if (loading) {
    return <div className="p-6 text-center text-[#FAF8F4]">Loading dashboard...</div>
  }

  const riskColor = {
    low: 'bg-green-100 text-green-900 border-green-300',
    moderate: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    high: 'bg-red-100 text-red-900 border-red-300'
  }

  const sortByDateDesc = (list, fields = ['timestamp', 'createdAt', 'startAt']) => (
    [...list].sort((a, b) => {
      const aDate = fields.map((f) => a?.[f]).find(Boolean)
      const bDate = fields.map((f) => b?.[f]).find(Boolean)
      return new Date(bDate || 0) - new Date(aDate || 0)
    })
  )

  const sortedReports = sortByDateDesc(selfReports, ['timestamp', 'createdAt'])
  const sortedActivities = sortByDateDesc(activities, ['timestamp', 'createdAt'])
  const sortedSessions = sortByDateDesc(sessions, ['startAt', 'createdAt'])
  const lastReport = sortedReports[0]
  const lastActivity = sortedActivities[0]
  const lastSession = sortedSessions[0]

  const last7Days = 7 * 24 * 60 * 60 * 1000
  const activityThisWeek = activities.filter((item) => {
    const date = item.timestamp || item.createdAt
    return date && (Date.now() - new Date(date).getTime()) <= last7Days
  }).length

  const avgSleep = sortedReports.length > 0
    ? (sortedReports.slice(0, 5).reduce((sum, r) => sum + (r.sleepHours || 0), 0) / Math.min(5, sortedReports.length))
    : null

  const avgSessionMinutes = sortedSessions.length > 0
    ? (sortedSessions.slice(0, 5).reduce((sum, s) => sum + (s.durationMin || 0), 0) / Math.min(5, sortedSessions.length))
    : null

  const avgGrade = grades.length > 0
    ? (grades.reduce((sum, g) => sum + (g.percentage || 0), 0) / grades.length)
    : null

  const featuresSnapshot = prediction?.featuresSnapshot || null

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border-2 ${riskColor[prediction?.riskLevel || 'low']}`}
      >
        <h2 className="text-2xl font-bold mb-2">Current Burnout Risk</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">
            {prediction?.riskScore ? `${(prediction.riskScore * 100).toFixed(0)}%` : 'N/A'}
          </span>
          <span className="text-lg font-semibold uppercase">
            {prediction?.riskLevel || 'unknown'}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm mt-3">
          <span className="font-semibold">
            Confidence: {prediction?.confidence ? `${Math.round(prediction.confidence * 100)}%` : 'N/A'}
          </span>
          <span>Model: {prediction?.modelVersion || 'N/A'}</span>
          {prediction?.createdAt && (
            <span>Updated: {new Date(prediction.createdAt).toLocaleString()}</span>
          )}
        </div>
        {prediction?.timestamp && (
          <p className="text-sm mt-2 opacity-75">
            Updated: {new Date(prediction.timestamp).toLocaleString()}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
          <p className="text-[#9CA3AF] text-xs">Activity (7 days)</p>
          <p className="text-2xl font-bold text-[#F6B26B]">{activityThisWeek}</p>
          <p className="text-[#9CA3AF] text-xs">Last: {lastActivity ? new Date(lastActivity.timestamp || lastActivity.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
          <p className="text-[#9CA3AF] text-xs">Avg Session (min)</p>
          <p className="text-2xl font-bold text-[#F6B26B]">{avgSessionMinutes ? Math.round(avgSessionMinutes) : 'N/A'}</p>
          <p className="text-[#9CA3AF] text-xs">Last: {lastSession?.startAt ? new Date(lastSession.startAt).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
          <p className="text-[#9CA3AF] text-xs">Avg Sleep (hrs)</p>
          <p className="text-2xl font-bold text-[#F6B26B]">{avgSleep ? avgSleep.toFixed(1) : 'N/A'}</p>
          <p className="text-[#9CA3AF] text-xs">Last: {lastReport?.sleepHours ?? 'N/A'}</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
          <p className="text-[#9CA3AF] text-xs">Attendance</p>
          <p className="text-2xl font-bold text-[#F6B26B]">{attendanceRate !== null ? `${attendanceRate.toFixed(1)}%` : 'N/A'}</p>
          <p className="text-[#9CA3AF] text-xs">Rolling rate</p>
        </div>
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
          <p className="text-[#9CA3AF] text-xs">Avg Grade</p>
          <p className="text-2xl font-bold text-[#F6B26B]">{avgGrade ? `${avgGrade.toFixed(1)}%` : 'N/A'}</p>
          <p className="text-[#9CA3AF] text-xs">All courses</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-[#FAF8F4] mb-4">Cognitive Load</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <p className="text-[#9CA3AF] text-sm">Overall</p>
            <p className="text-3xl font-bold text-[#F6B26B]">{loadRecord?.overallLoad ?? 0}</p>
          </div>
          <div>
            <p className="text-[#9CA3AF] text-sm">Intrinsic</p>
            <p className="text-2xl font-bold text-[#F6B26B]">{loadRecord?.intrinsicLoad ?? 0}</p>
          </div>
          <div>
            <p className="text-[#9CA3AF] text-sm">Extraneous</p>
            <p className="text-2xl font-bold text-[#F6B26B]">{loadRecord?.extraneousLoad ?? 0}</p>
          </div>
          <div>
            <p className="text-[#9CA3AF] text-sm">Germane</p>
            <p className="text-2xl font-bold text-[#F6B26B]">{loadRecord?.germaneLoad ?? 0}</p>
          </div>
        </div>
        {loadRecord?.featuresSnapshot && (
          <div className="mt-4 text-xs text-[#9CA3AF] grid md:grid-cols-3 gap-3">
            <div>Heart Rate: {loadRecord.featuresSnapshot.heartRate ?? 'N/A'}</div>
            <div>HRV: {loadRecord.featuresSnapshot.hrv ?? 'N/A'}</div>
            <div>Stress: {loadRecord.featuresSnapshot.stress ?? 'N/A'}</div>
            <div>Self Load: {loadRecord.featuresSnapshot.selfLoad ?? 'N/A'}</div>
            <div>Self Stress: {loadRecord.featuresSnapshot.selfStress ?? 'N/A'}</div>
            <div>GSR: {loadRecord.featuresSnapshot.gsr ?? 'N/A'}</div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-[#FAF8F4] mb-4">Burnout Dimensions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-[#9CA3AF] text-sm">Exhaustion</p>
            <p className="text-3xl font-bold text-[#F6B26B]">
              {prediction?.exhaustionScore !== undefined
                ? `${Math.round(prediction.exhaustionScore * 100)}%`
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[#9CA3AF] text-sm">Cynicism</p>
            <p className="text-3xl font-bold text-[#F6B26B]">
              {prediction?.cynicismScore !== undefined
                ? `${Math.round(prediction.cynicismScore * 100)}%`
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[#9CA3AF] text-sm">Low Efficacy</p>
            <p className="text-3xl font-bold text-[#F6B26B]">
              {prediction?.efficacyScore !== undefined
                ? `${Math.round(prediction.efficacyScore * 100)}%`
                : 'N/A'}
            </p>
          </div>
        </div>
        {featuresSnapshot && (
          <div className="mt-6 bg-[#0E0F13] border border-[#2A2C31] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#FAF8F4] mb-3">Prediction Inputs</h3>
            <div className="grid md:grid-cols-3 gap-2 text-xs text-[#9CA3AF]">
              <div>Session Duration: {featuresSnapshot.session_duration ?? 'N/A'} min</div>
              <div>Quiz Scores: {featuresSnapshot.quiz_scores ?? 'N/A'}%</div>
              <div>Load Score: {featuresSnapshot.load_score ?? 'N/A'}</div>
              <div>Activity Frequency: {featuresSnapshot.activity_frequency ?? 'N/A'}</div>
              <div>Sleep Hours: {featuresSnapshot.sleep_hours ?? 'N/A'}</div>
              <div>Stress Score: {featuresSnapshot.stress_score ?? 'N/A'}</div>
              <div>Submission Lateness: {featuresSnapshot.submission_lateness ?? 'N/A'} days</div>
              <div>GPA: {featuresSnapshot.gpa ?? 'N/A'}</div>
              <div>Attendance Rate: {featuresSnapshot.attendance_rate ?? 'N/A'}%</div>
              <div>Completion Rate: {featuresSnapshot.assignment_completion_rate ?? 'N/A'}%</div>
              <div>Grade Trend: {featuresSnapshot.grade_trend ?? 'N/A'}</div>
              <div>Days Since Activity: {featuresSnapshot.days_since_last_activity ?? 'N/A'}</div>
            </div>
          </div>
        )}
      </motion.div>

      {!consent?.consentedAt && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-900">
            Consent is required to collect sensor and learning analytics data. Please visit the Consent page.
          </p>
        </div>
      )}

      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold">Active Alerts</h3>
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-amber-50 border-amber-500'
              }`}
            >
              <p className="font-semibold">{alert.message}</p>
              <p className="text-sm opacity-75">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </motion.div>
      )}

      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold">Recovery Recommendations</h3>
          {recommendations.map((rec) => (
            <div
              key={rec._id}
              className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{rec.message}</p>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  {rec.type}
                </span>
              </div>
              <div className="flex gap-2">
                {rec.status !== 'accepted' && (
                  <button
                    onClick={() => markRecommendation(rec._id)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Mark Done
                  </button>
                )}
                {rec.status === 'accepted' && (
                  <span className="text-sm text-green-700 font-semibold">✓ Completed</span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {prediction?.riskLevel === 'low' && alerts.length === 0 && (
        <div className="p-8 text-center bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-bold text-green-900 mb-2">
            You're doing great!
          </h3>
          <p className="text-green-800">
            Your burnout risk is low. Keep maintaining your healthy habits.
          </p>
        </div>
      )}

      {/* Enhanced Features */}
      <div className="grid grid-cols-1 gap-6 mt-8">
        <RiskAlertsPanel />
        <ProgressTracker studentId={effectiveStudentId} />
        <InterventionRecommendations studentId={effectiveStudentId} />
      </div>
    </div>
  )
}
