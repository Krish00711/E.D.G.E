import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function InsightsPage() {
  const { user } = useAuth()
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true)
        
        // Get the student ID - handle different user object structures
        const studentId = user?._id || user?.id || user?.studentId
        
        if (user?.role === 'student' && studentId) {
          try {
            const [peer, engagement, trajectory] = await Promise.all([
              api.insights.peerComparison(studentId).catch(() => ({ error: 'Unable to load peer comparison' })),
              api.insights.engagement(studentId).catch(() => ({ error: 'Unable to load engagement data' })),
              api.insights.recoveryTrajectory(studentId).catch(() => ({ error: 'Unable to load trajectory' }))
            ])
            setInsights({ peer, engagement, trajectory })
          } catch (err) {
            console.error('Student insights error:', err)
            setError('Unable to load student insights. Some features may be limited.')
          }
        } else if (user?.role === 'admin' || user?.role === 'mentor') {
          try {
            const [early, patterns] = await Promise.all([
              api.insights.earlyWarning().catch(() => ({ earlyWarning: [], total: 0 })),
              api.insights.patterns().catch(() => ({ highRiskStudents: 0 }))
            ])
            setInsights({ early, patterns })
          } catch (err) {
            console.error('Admin insights error:', err)
            setError('Unable to load insights. Please try again later.')
          }
        } else {
          setError('Unable to determine user role. Please log in again.')
        }
      } catch (err) {
        console.error('Insights loading error:', err)
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadInsights()
    } else {
      setLoading(false)
      setError('Please log in to view insights.')
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading insights...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Insights</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {user?.role === 'student' ? (
            <div className="space-y-6">
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#FAF8F4] mb-3">Peer Comparison</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[#9CA3AF] text-sm">Your Risk Score</p>
                    <p className="text-3xl font-bold text-[#F6B26B]">
                      {insights?.peer?.student?.riskScore !== undefined
                        ? insights.peer.student.riskScore.toFixed(2)
                        : 'N/A'}
                    </p>
                    <p className="text-xs text-[#9CA3AF] uppercase">
                      {insights?.peer?.student?.riskLevel || 'unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-sm">Cohort Average</p>
                    <p className="text-2xl font-bold text-[#F6B26B]">
                      {insights?.peer?.cohort?.avgRisk !== undefined
                        ? (typeof insights.peer.cohort.avgRisk === 'string' 
                            ? parseFloat(insights.peer.cohort.avgRisk).toFixed(2)
                            : insights.peer.cohort.avgRisk.toFixed(2))
                        : 'N/A'}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      Median: {insights?.peer?.cohort?.medianRisk 
                        ? (typeof insights.peer.cohort.medianRisk === 'string'
                            ? parseFloat(insights.peer.cohort.medianRisk).toFixed(2)
                            : insights.peer.cohort.medianRisk.toFixed(2))
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-sm">Percentile</p>
                    <p className="text-2xl font-bold text-[#F6B26B]">
                      {insights?.peer?.percentile !== undefined
                        ? `${typeof insights.peer.percentile === 'string' 
                            ? parseFloat(insights.peer.percentile).toFixed(0)
                            : insights.peer.percentile.toFixed(0)}%`
                        : 'N/A'}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">Rank: {insights?.peer?.student?.rank || 'N/A'}</p>
                  </div>
                </div>
                <p className="text-[#9CA3AF] mt-3">Interpretation: {insights?.peer?.interpretation || 'N/A'}</p>
              </div>

              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#FAF8F4] mb-3">Engagement</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[#9CA3AF] text-xs">Engagement Score</p>
                    <p className="text-2xl font-bold text-[#F6B26B]">
                      {insights?.engagement?.metrics?.engagementScore ?? 'N/A'}
                    </p>
                    <p className="text-xs text-[#9CA3AF] uppercase">
                      {insights?.engagement?.metrics?.engagement || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-xs">Total Activities</p>
                    <p className="text-2xl font-bold text-[#F6B26B]">
                      {insights?.engagement?.metrics?.totalActivities ?? 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-xs">Active Days</p>
                    <p className="text-2xl font-bold text-[#F6B26B]">
                      {insights?.engagement?.metrics?.activeDays ?? 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-xs">Avg Per Day</p>
                    <p className="text-2xl font-bold text-[#F6B26B]">
                      {insights?.engagement?.metrics?.avgPerDay ?? 'N/A'}
                    </p>
                  </div>
                </div>
                <p className="text-[#9CA3AF] mt-3">Trend: {insights?.engagement?.trend || 'N/A'}</p>
              </div>

              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#FAF8F4] mb-3">Recovery Trajectory</h2>
                {insights?.trajectory?.current ? (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-[#9CA3AF] text-xs">Current Risk</p>
                        <p className="text-2xl font-bold text-[#F6B26B]">
                          {insights.trajectory.current.score?.toFixed(2)}
                        </p>
                        <p className="text-xs text-[#9CA3AF] uppercase">
                          {insights.trajectory.current.level}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#9CA3AF] text-xs">Trend</p>
                        <p className="text-2xl font-bold text-[#F6B26B]">
                          {insights.trajectory.current.trend}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">Daily change: {insights.trajectory.dailyChangeRate}</p>
                      </div>
                      <div>
                        <p className="text-[#9CA3AF] text-xs">Recovery ETA</p>
                        <p className="text-2xl font-bold text-[#F6B26B]">
                          {insights.trajectory.estimatedRecoveryDay ? `${insights.trajectory.estimatedRecoveryDay} days` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#9CA3AF]">
                      Intervention Recommended: {insights?.trajectory?.interventionRecommended ? 'Yes' : 'No'}
                    </p>
                  </div>
                ) : (
                  <p className="text-[#9CA3AF]">{insights?.trajectory?.message || 'Not enough data'}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#FAF8F4] mb-3">Early Warning</h2>
                <p className="text-[#9CA3AF] mb-3">At-risk students: {insights?.early?.earlyWarning?.length || 0}</p>
                {insights?.early?.earlyWarning?.length > 0 && (
                  <div className="space-y-3">
                    {insights.early.earlyWarning.slice(0, 5).map((student) => (
                      <div key={student.studentId} className="bg-[#0E0F13] border border-[#2A2C31] rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-[#FAF8F4] font-semibold">{student.name}</p>
                            <p className="text-[#9CA3AF] text-sm">{student.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[#F6B26B] font-semibold">{student.currentRisk.toFixed(2)}</p>
                            <p className="text-xs text-[#9CA3AF] uppercase">{student.trend}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {student.warningPoints.map((point) => (
                            <span key={point} className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                              {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#FAF8F4] mb-3">Common Patterns</h2>
                <p className="text-[#9CA3AF] mb-3">High-risk students: {insights?.patterns?.highRiskStudents || 0}</p>
                <p className="text-[#9CA3AF] mb-3">Affected cohort: {insights?.patterns?.affectedStudents || 0}%</p>
                {insights?.patterns?.topAlertPatterns?.length > 0 ? (
                  <div className="space-y-2">
                    {insights.patterns.topAlertPatterns.map((pattern) => (
                      <div key={pattern.pattern} className="flex justify-between text-sm">
                        <span className="text-[#FAF8F4]">{pattern.pattern}</span>
                        <span className="text-[#F6B26B] font-semibold">{pattern.occurrences}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#9CA3AF]">No pattern data available</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
