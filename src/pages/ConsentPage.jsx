import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

export default function ConsentPage() {
  const [consent, setConsent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadConsent = async () => {
    try {
      setLoading(true)
      const res = await api.consent.getMe()
      setConsent(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConsent()
  }, [])

  const handleAccept = async () => {
    try {
      await api.consent.accept({
        scopes: ['sensors', 'lms', 'notifications'],
        version: 'v1'
      })
      await loadConsent()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRevoke = async () => {
    try {
      await api.consent.revoke()
      await loadConsent()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading consent...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Data Consent</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 mb-6">
            <p className="text-[#9CA3AF] mb-4">
              We collect sensor and learning analytics data to compute cognitive load and burnout risk.
              Your data is used only for academic well-being insights.
            </p>
            <div className="text-sm text-[#9CA3AF] space-y-1">
              <div>Scopes: {consent?.scopes?.join(', ') || 'None'}</div>
              <div>Status: {consent?.revokedAt ? 'Revoked' : consent ? 'Active' : 'Not provided'}</div>
              <div>Version: {consent?.version || 'v1'}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg"
            >
              Accept Consent
            </button>
            <button
              onClick={handleRevoke}
              className="px-6 py-2 bg-[#0E0F13] hover:bg-[#16181D] text-[#FAF8F4] font-semibold rounded-lg"
            >
              Revoke Consent
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
