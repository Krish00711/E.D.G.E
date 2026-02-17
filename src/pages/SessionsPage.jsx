import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function SessionsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [formData, setFormData] = useState({ courseId: '', startAt: '', endAt: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const studentId = user?.studentId || user?.id

  const loadData = async () => {
    if (!studentId) return
    try {
      setLoading(true)
      const res = await api.sessions.list({ studentId })
      setSessions(res || [])
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
      await api.sessions.create({
        courseId: formData.courseId || undefined,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: formData.endAt ? new Date(formData.endAt).toISOString() : undefined,
        context: { examWeek: false }
      })
      setFormData({ courseId: '', startAt: '', endAt: '' })
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading sessions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Study Sessions</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Log Session</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#FAF8F4] text-sm mb-2">Course ID (optional)</label>
                <input
                  type="text"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                />
              </div>
              <div>
                <label className="block text-[#FAF8F4] text-sm mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#FAF8F4] text-sm mb-2">End Time (optional)</label>
                <input
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold py-2 rounded-lg"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Recent Sessions</h2>
            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session._id} className="bg-[#0E0F13] p-4 rounded-lg border border-[#2A2C31]">
                    <div className="flex justify-between">
                      <p className="text-[#FAF8F4]">Session {session._id.slice(-6)}</p>
                      <p className="text-[#9CA3AF] text-sm">
                        {new Date(session.startAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[#9CA3AF] text-sm">Duration: {session.durationMin ?? 'N/A'} mins</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#9CA3AF]">No sessions yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
