import React, { useState } from 'react'
import api from '../lib/api'

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('LoginForm: Attempting login with', email)
      const result = await api.login(email, password)
      console.log('LoginForm: Login successful, result=', result)
      api.setToken(result.token)
      
      // Store user info
      const userData = { id: result.sub, email, role: result.role }
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('LoginForm: Stored user=', userData)
      console.log('LoginForm: Token=', result.token)
      
      onSuccess && onSuccess()
    } catch (err) {
      console.error('LoginForm: Login failed, error=', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-sm">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flame"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flame"
          placeholder="password123"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-300 rounded text-sm text-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-flame text-white rounded-lg font-medium hover:bg-flame-dark disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-xs text-gray-600 text-center">
        Enter your login credentials<br />
        <em>Contact your administrator for account access</em>
      </p>
    </form>
  )
}
