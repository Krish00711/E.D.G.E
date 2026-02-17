import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function RecoveryPage() {
  const { user } = useAuth()
  const [actions, setActions] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const studentId = user?.studentId || user?.id

  const loadData = async () => {
    if (!studentId) return
    try {
      setLoading(true)
      const [actionsRes, sessionActionsRes, recsRes] = await Promise.all([
        api.recovery.listActions(),
        api.recovery.sessionActions({ studentId }),
        api.recommendations.list({ studentId })
      ])
      setActions(actionsRes.actions || [])
      setRecommendations([
        ...(sessionActionsRes.actions || []).map((item) => ({
          id: item._id,
          title: item.actionId?.title,
          description: item.actionId?.description,
          status: item.status,
          source: 'session'
        })),
        ...(recsRes || []).map((rec) => ({
          id: rec._id,
          title: rec.type,
          description: rec.message,
          status: rec.status,
          source: 'recommendation'
        }))
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  const filteredRecommendations = recommendations.filter((rec) => {
    const statusOk = statusFilter === 'all' || rec.status === statusFilter
    const sourceOk = sourceFilter === 'all' || rec.source === sourceFilter
    return statusOk && sourceOk
  })

  const statusCounts = recommendations.reduce((acc, rec) => {
    acc[rec.status] = (acc[rec.status] || 0) + 1
    return acc
  }, {})

  const handleRecommend = async () => {
    if (!studentId) return
    try {
      setLoading(true)
      await api.recovery.recommend(studentId)
      await loadData()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.recovery.updateSessionAction(id, status)
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading recovery actions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#FAF8F4]">Recovery Actions</h1>
            <button
              onClick={handleRecommend}
              className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors"
            >
              Generate Recommendations
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-xs">Recommended</p>
              <p className="text-2xl font-bold text-[#F6B26B]">{statusCounts.recommended || 0}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-xs">Taken</p>
              <p className="text-2xl font-bold text-[#F6B26B]">{statusCounts.taken || 0}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-xs">Ignored</p>
              <p className="text-2xl font-bold text-[#F6B26B]">{statusCounts.ignored || 0}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {actions.map((action) => (
              <div key={action._id} className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-[#FAF8F4] mb-2">{action.title}</h3>
                <p className="text-[#9CA3AF] mb-3">{action.description}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs bg-[#F6B26B] text-[#0E0F13] px-2 py-1 rounded">
                    {action.type}
                  </span>
                  {action.durationMin && (
                    <span className="text-xs bg-[#0E0F13] text-[#FAF8F4] px-2 py-1 rounded border border-[#2A2C31]">
                      {action.durationMin} min
                    </span>
                  )}
                  {action.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-[#0E0F13] text-[#9CA3AF] px-2 py-1 rounded border border-[#2A2C31]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold text-[#FAF8F4]">Recommended Now</h2>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-3 py-2 text-sm text-[#FAF8F4]"
                >
                  <option value="all">All Status</option>
                  <option value="recommended">Recommended</option>
                  <option value="taken">Taken</option>
                  <option value="ignored">Ignored</option>
                </select>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-3 py-2 text-sm text-[#FAF8F4]"
                >
                  <option value="all">All Sources</option>
                  <option value="session">Session</option>
                  <option value="recommendation">Recommendation</option>
                </select>
              </div>
            </div>
            {filteredRecommendations.length > 0 ? (
              <div className="space-y-3">
                {filteredRecommendations.map((rec) => (
                  <div key={rec.id} className="bg-[#0E0F13] p-4 rounded-lg border border-[#2A2C31]">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#FAF8F4] font-semibold">{rec.title}</p>
                        <p className="text-[#9CA3AF] text-sm">{rec.description}</p>
                        <p className="text-[#9CA3AF] text-xs mt-1">Source: {rec.source}</p>
                      </div>
                      <span className="text-xs bg-[#F6B26B] text-[#0E0F13] px-2 py-1 rounded">
                        {rec.status}
                      </span>
                    </div>
                    {rec.source === 'session' && rec.status === 'recommended' && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(rec.id, 'taken')}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Mark Taken
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(rec.id, 'ignored')}
                          className="text-sm bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          Ignore
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#9CA3AF]">No recommendations yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
