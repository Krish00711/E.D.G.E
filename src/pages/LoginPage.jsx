import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('LoginPage: Attempting login with', email, 'as', role)
      const result = await login(email, password, role)
      console.log('LoginPage: Login successful, user:', result)
      // Small delay to ensure state is updated before navigation
      await new Promise(resolve => setTimeout(resolve, 100))
      console.log('LoginPage: Navigating to dashboard')
      navigate('/dashboard')
    } catch (err) {
      console.error('LoginPage: Login failed:', err)
      const errorMsg = err.message || 'Login failed. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-8">
          <h1 className="text-3xl font-bold text-[#FAF8F4] mb-2">Welcome Back</h1>
          <p className="text-[#9CA3AF] mb-8">Sign in to continue to E.D.G.E</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#FAF8F4] text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-[#FAF8F4] text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-[#FAF8F4] text-sm font-medium mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'student', label: '👨‍🎓 Student' },
                  { value: 'mentor', label: '🏫 Mentor' },
                  { value: 'admin', label: '⚙️ Admin' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`py-3 px-2 rounded-lg font-medium text-sm transition ${
                      role === option.value
                        ? 'bg-[#F6B26B] text-[#0E0F13] border-2 border-[#F6B26B]'
                        : 'bg-[#0E0F13] text-[#FAF8F4] border-2 border-[#2A2C31] hover:border-[#F6B26B]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F6B26B] hover:bg-[#E69138] disabled:opacity-50 text-[#0E0F13] font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-[#9CA3AF] text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#F6B26B] hover:underline">
              Register
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-[#2A2C31]">
            <p className="text-[#9CA3AF] text-xs font-medium mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs">
              <p className="text-[#9CA3AF]">Student: john@student.com / John123456</p>
              <p className="text-[#9CA3AF]">Mentor: prof.johnson@edge.com / Prof123456</p>
              <p className="text-[#9CA3AF]">Admin: admin@edge.com / Admin123456</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
