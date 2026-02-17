import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function ActivityLogsPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [formData, setFormData] = useState({ type: 'study', value: '', score: '', sessionId: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const studentId = user?.studentId || user?.id

  const loadData = async () => {
    if (!studentId) return
    try {
      setLoading(true)
      const res = await api.activity.list({ studentId })
      setLogs(res || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.activity.create({
        type: formData.type,
        value: formData.value ? Number(formData.value) : undefined,
        score: formData.score ? Number(formData.score) : undefined,
        sessionId: formData.sessionId || undefined
      })
      setFormData({ type: 'study', value: '', score: '', sessionId: '' })
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading activity logs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Activity Logs</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Log Activity</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#FAF8F4] text-sm mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                >
                  <option value="study">Study</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="pageview">Page View</option>
                  <option value="login">Login</option>
                </select>
              </div>
              <div>
                <label className="block text-[#FAF8F4] text-sm mb-2">Value (minutes)</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                />
              </div>
              <div>
                <label className="block text-[#FAF8F4] text-sm mb-2">Score</label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                />
              </div>
              <div>
                <label className="block text-[#FAF8F4] text-sm mb-2">Session ID (optional)</label>
                <input
                  type="text"
                  value={formData.sessionId}
                  onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold py-2 rounded-lg"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Recent Activity</h2>
            {logs.length > 0 ? (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log._id} className="bg-[#0E0F13] p-4 rounded-lg border border-[#2A2C31]">
                    <div className="flex justify-between">
                      <p className="text-[#FAF8F4]">{log.type}</p>
                      <p className="text-[#9CA3AF] text-sm">
                        {new Date(log.timestamp || log.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[#9CA3AF] text-sm">Value: {log.value ?? 'N/A'} | Score: {log.score ?? 'N/A'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#9CA3AF]">No activity logs yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
