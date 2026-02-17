import { useState, useEffect } from 'react'
import api from './api.js'

/**
 * Hook: Get current user from localStorage
 */
export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('edge_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  return { user, loading }
}

/**
 * Hook: Fetch latest prediction for a student
 */
export function useLatestPrediction(studentId) {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!studentId) return

    const fetch = async () => {
      try {
        const result = await api.getLatestPrediction(studentId)
        setPrediction(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        setPrediction(null)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [studentId])

  return { prediction, loading, error }
}

/**
 * Hook: Fetch alerts for a student
 */
export function useAlerts(studentId) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!studentId) return

    const fetch = async () => {
      try {
        const result = await api.listAlerts(studentId)
        setAlerts(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [studentId])

  return { alerts, loading, error }
}

/**
 * Hook: Fetch recommendations for a student
 */
export function useRecommendations(studentId) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!studentId) return

    const fetch = async () => {
      try {
        const result = await api.listRecommendations(studentId)
        setRecommendations(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        setRecommendations([])
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [studentId])

  return { recommendations, loading, error }
}

/**
 * Hook: Fetch recent sessions
 */
export function useSessions(studentId) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!studentId) return

    const fetch = async () => {
      try {
        const result = await api.listSessions(studentId)
        setSessions(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        setSessions([])
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [studentId])

  return { sessions, loading, error }
}

/**
 * Hook: Fetch recent self-reports
 */
export function useSelfReports(studentId) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!studentId) return

    const fetch = async () => {
      try {
        const result = await api.listSelfReports(studentId)
        setReports(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        setReports([])
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [studentId])

  return { reports, loading, error }
}
