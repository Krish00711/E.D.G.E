import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function SelfReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [formData, setFormData] = useState({ loadScore: 5, stressScore: 5, sleepHours: 7, notes: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const studentId = user?.studentId || user?.id

  const loadData = async () => {
    if (!studentId) return
    try {
      setLoading(true)
      const res = await api.selfReports.list({ studentId })
      setReports(res || [])
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
      await api.selfReports.create({
        loadScore: Number(formData.loadScore),
        stressScore: Number(formData.stressScore),
        sleepHours: Number(formData.sleepHours),
        notes: formData.notes
      })
      setFormData({ loadScore: 5, stressScore: 5, sleepHours: 7, notes: '' })
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading self reports...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Self Reports</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">New Report</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#FAF8F4] text-sm mb-2">Load Score (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.loadScore}
                  onChange={(e) => setFormData({ ...formData, loadScore: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                />
              </div>
              <div>
                <label className="block text-[#FAF8F4] text-sm mb-2">Stress Score (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stressScore}
                  onChange={(e) => setFormData({ ...formData, stressScore: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                />
              </div>
              <div>
                <label className="block text-[#FAF8F4] text-sm mb-2">Sleep Hours</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={formData.sleepHours}
                  onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#FAF8F4] text-sm mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4]"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold py-2 rounded-lg"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">History</h2>
            {reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report._id} className="bg-[#0E0F13] p-4 rounded-lg border border-[#2A2C31]">
                    <div className="flex justify-between">
                      <p className="text-[#FAF8F4]">Load {report.loadScore} / Stress {report.stressScore}</p>
                      <p className="text-[#9CA3AF] text-sm">
                        {new Date(report.timestamp || report.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[#9CA3AF] text-sm">Sleep: {report.sleepHours} hrs</p>
                    {report.notes && <p className="text-[#9CA3AF] text-sm">{report.notes}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#9CA3AF]">No reports yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
