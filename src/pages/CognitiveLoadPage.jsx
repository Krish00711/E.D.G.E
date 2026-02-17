import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function CognitiveLoadPage() {
  const { user } = useAuth()
  const [current, setCurrent] = useState(null)
  const [history, setHistory] = useState([])
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const studentId = user?.studentId || user?.id
      if (!studentId) return
      try {
        setLoading(true)
        const [currentRes, historyRes] = await Promise.all([
          api.cognitiveLoad.current(studentId),
          api.cognitiveLoad.history(studentId, days)
        ])
        setCurrent(currentRes)
        setHistory(historyRes.records || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const handleCompute = async () => {
    const studentId = user?.studentId || user?.id
    if (!studentId) return
    try {
      setLoading(true)
      const record = await api.cognitiveLoad.compute(studentId)
      setCurrent(record)
      const historyRes = await api.cognitiveLoad.history(studentId, days)
      setHistory(historyRes.records || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading cognitive load...</div>
      </div>
    )
  }

  const overallLoad = current?.overallLoad ?? 0
  const loadLevel = overallLoad >= 75 ? 'High' : overallLoad >= 50 ? 'Moderate' : 'Low'
  const lastRecord = history[0]
  const prevRecord = history[1]
  const delta = lastRecord && prevRecord ? lastRecord.overallLoad - prevRecord.overallLoad : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#FAF8F4]">Cognitive Load</h1>
            <div className="flex gap-3">
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-3 py-2 text-sm text-[#FAF8F4]"
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
              </select>
              <button
                onClick={handleCompute}
                className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors"
              >
                Refresh Load
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
              <p className="text-[#9CA3AF] text-sm mb-2">Overall Load</p>
              <p className="text-4xl font-bold text-[#F6B26B]">{current?.overallLoad ?? 0}</p>
              <p className="text-xs text-[#9CA3AF] mt-2">Level: {loadLevel}</p>
              {delta !== null && (
                <p className="text-xs text-[#9CA3AF]">Change: {delta > 0 ? '+' : ''}{delta.toFixed(1)}</p>
              )}
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
              <p className="text-[#9CA3AF] text-sm mb-2">Intrinsic</p>
              <p className="text-3xl font-bold text-[#F6B26B]">{current?.intrinsicLoad ?? 0}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
              <p className="text-[#9CA3AF] text-sm mb-2">Extraneous</p>
              <p className="text-3xl font-bold text-[#F6B26B]">{current?.extraneousLoad ?? 0}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
              <p className="text-[#9CA3AF] text-sm mb-2">Germane</p>
              <p className="text-3xl font-bold text-[#F6B26B]">{current?.germaneLoad ?? 0}</p>
            </div>
          </div>

          {current?.featuresSnapshot && (
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Load Drivers</h2>
              <div className="grid md:grid-cols-3 gap-3 text-sm text-[#9CA3AF]">
                <div>Heart Rate: {current.featuresSnapshot.heartRate ?? 'N/A'}</div>
                <div>HRV: {current.featuresSnapshot.hrv ?? 'N/A'}</div>
                <div>EEG Theta: {current.featuresSnapshot.theta ?? 'N/A'}</div>
                <div>EEG Alpha: {current.featuresSnapshot.alpha ?? 'N/A'}</div>
                <div>Blink Rate: {current.featuresSnapshot.blink ?? 'N/A'}</div>
                <div>GSR: {current.featuresSnapshot.gsr ?? 'N/A'}</div>
                <div>Facial Stress: {current.featuresSnapshot.stress ?? 'N/A'}</div>
                <div>Self Load: {current.featuresSnapshot.selfLoad ?? 'N/A'}</div>
                <div>Self Stress: {current.featuresSnapshot.selfStress ?? 'N/A'}</div>
              </div>
            </div>
          )}

          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">History ({days} days)</h2>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((record) => (
                  <div key={record._id} className="bg-[#0E0F13] p-4 rounded-lg border border-[#2A2C31] flex justify-between">
                    <div>
                      <p className="text-[#FAF8F4] font-semibold">Load: {record.overallLoad}</p>
                      <p className="text-[#9CA3AF] text-sm">
                        {new Date(record.recordedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right text-[#9CA3AF] text-sm">
                      <div>Intr: {record.intrinsicLoad}</div>
                      <div>Extr: {record.extraneousLoad}</div>
                      <div>Germ: {record.germaneLoad}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#9CA3AF]">No load records yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
