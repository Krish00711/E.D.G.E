import { createContext, useContext, useState, useEffect } from 'react'
import { authApi, getToken, setToken, removeToken, getUser, setUser, removeUser } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    try {
      return getUser()
    } catch (error) {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = getToken()
      
      if (token) {
        try {
          const userData = await authApi.me()
          setUserState(userData)
          setUser(userData)
        } catch (error) {
          logout()
        }
      } else {
        // No token, check if we have user in localStorage anyway
        const storedUser = getUser()
        if (storedUser) {
          setUserState(storedUser)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, role = 'student') => {
    try {
      const data = await authApi.login({ email, password })
      
      if (!data || !data.token) {
        throw new Error('No token received from server')
      }
      
      setToken(data.token)
      const userData = data.user || { email, role }
      // Ensure role is set from the user's selection
      if (!userData.role) {
        userData.role = role
      }
      setUserState(userData)
      setUser(userData)
      return userData
    } catch (err) {
      throw err
    }
  }

  const register = async (userData) => {
    try {
      const data = await authApi.register(userData)
      
      if (!data) {
        throw new Error('Empty response from server')
      }
      
      // Token is required for auth
      if (!data.token) {
        throw new Error('No token received from server. Server response: ' + JSON.stringify(data))
      }
      
      setToken(data.token)
      const user = data.user || { email: userData.email, role: userData.role }
      setUserState(user)
      setUser(user)
      return user
    } catch (err) {
      throw err
    }
  }

  const logout = () => {
    removeToken()
    removeUser()
    setUserState(null)
    window.location.href = '/'
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isMentor: user?.role === 'mentor',
    isStudent: user?.role === 'student',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
