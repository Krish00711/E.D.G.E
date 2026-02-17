import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    major: '',
    baselineLoadScore: '',
    baselineStressScore: '',
    baselineSleepHours: '',
    consented: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const toNumber = (value) => (value === '' ? undefined : Number(value))
      const payload = {
        ...formData,
        baselineLoadScore: toNumber(formData.baselineLoadScore),
        baselineStressScore: toNumber(formData.baselineStressScore),
        baselineSleepHours: toNumber(formData.baselineSleepHours),
      }

      console.log('RegisterPage: Attempting registration with', formData.email)
      const result = await register(payload)
      console.log('RegisterPage: Registration successful, user:', result)
      // Small delay to ensure state is updated before navigation
      await new Promise(resolve => setTimeout(resolve, 100))
      console.log('RegisterPage: Navigating to dashboard')
      navigate('/dashboard')
    } catch (err) {
      console.error('RegisterPage: Registration failed:', err)
      const errorMsg = err.message || 'Registration failed. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-8">
          <h1 className="text-3xl font-bold text-[#FAF8F4] mb-2">Create Account</h1>
          <p className="text-[#9CA3AF] mb-8">Join E.D.G.E today</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#FAF8F4] text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                required
              />
            </div>

            <div>
              <label className="block text-[#FAF8F4] text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                required
              />
            </div>

            <div>
              <label className="block text-[#FAF8F4] text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-[#FAF8F4] text-sm font-medium mb-3">
                I want to register as:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'student', label: '👨‍🎓', title: 'Student' },
                  { value: 'mentor', label: '🏫', title: 'Mentor' },
                  { value: 'admin', label: '⚙️', title: 'Admin' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: option.value })}
                    className={`py-4 px-2 rounded-lg font-medium text-sm transition border-2 ${
                      formData.role === option.value
                        ? 'bg-[#F6B26B] text-[#0E0F13] border-[#F6B26B]'
                        : 'bg-[#0E0F13] text-[#FAF8F4] border-[#2A2C31] hover:border-[#F6B26B]'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.label}</div>
                    <div>{option.title}</div>
                  </button>
                ))}
              </div>
              {formData.role === 'student' && (
                <p className="text-[#9CA3AF] text-xs mt-2">📊 Track your burnout & get personalized insights</p>
              )}
              {formData.role === 'mentor' && (
                <p className="text-[#9CA3AF] text-xs mt-2">👥 Monitor your students & provide interventions</p>
              )}
              {formData.role === 'admin' && (
                <p className="text-[#9CA3AF] text-xs mt-2">⚙️ Manage the entire system & users</p>
              )}
            </div>

            {formData.role === 'student' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[#FAF8F4] text-sm font-medium mb-2">
                    Major
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="bg-[#0E0F13] border border-[#2A2C31] rounded-lg p-4">
                  <p className="text-[#FAF8F4] text-sm font-medium mb-3">Baseline Survey</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#9CA3AF] text-xs mb-2">Load (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        name="baselineLoadScore"
                        value={formData.baselineLoadScore}
                        onChange={handleChange}
                        className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-3 py-2 text-[#FAF8F4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] text-xs mb-2">Stress (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        name="baselineStressScore"
                        value={formData.baselineStressScore}
                        onChange={handleChange}
                        className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-3 py-2 text-[#FAF8F4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] text-xs mb-2">Sleep Hours</label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        name="baselineSleepHours"
                        value={formData.baselineSleepHours}
                        onChange={handleChange}
                        className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-3 py-2 text-[#FAF8F4]"
                      />
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm text-[#9CA3AF]">
                  <input
                    type="checkbox"
                    name="consented"
                    checked={formData.consented}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    I consent to use of study activity and wellness inputs to personalize insights.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F6B26B] hover:bg-[#E69138] disabled:opacity-50 text-[#0E0F13] font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-[#9CA3AF] text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#F6B26B] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
