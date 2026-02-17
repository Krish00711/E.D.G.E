import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

function RiskAlertsPanel() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, high, medium, low

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await api.analytics.getAlerts()
      setAlerts(response.data.alerts || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      // Generate mock alerts for demonstration
      setAlerts([
        {
          id: 1,
          studentId: '507f1f77bcf86cd799439011',
          studentName: 'John Doe',
          riskLevel: 'high',
          riskScore: 0.85,
          factors: ['Low attendance (65%)', 'Declining grades', 'High stress'],
          timestamp: new Date().toISOString(),
          status: 'new'
        },
        {
          id: 2,
          studentId: '507f1f77bcf86cd799439012',
          studentName: 'Jane Smith',
          riskLevel: 'medium',
          riskScore: 0.62,
          factors: ['Inconsistent submission', 'Low engagement'],
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'acknowledged'
        },
        {
          id: 3,
          studentId: '507f1f77bcf86cd799439013',
          studentName: 'Mike Johnson',
          riskLevel: 'low',
          riskScore: 0.35,
          factors: ['Good progress overall'],
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'resolved'
        }
      ])
      setLoading(false)
    }
  }

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.riskLevel === filter
  )

  const getRiskColor = (level) => {
    switch(level) {
      case 'high': return '#E74C3C'
      case 'medium': return '#F39C12'
      case 'low': return '#2ECC71'
      default: return '#95A5A6'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'new': return '🔴'
      case 'acknowledged': return '🟡'
      case 'resolved': return '🟢'
      default: return '⚪'
    }
  }

  if (loading) {
    return (
      <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
        <div className="animate-pulse flex justify-center items-center h-64">
          <div className="text-[#9CA3AF]">Loading alerts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#FAF8F4]">
          Real-Time Risk Alerts
        </h2>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === f 
                  ? 'bg-[#F6B26B] text-[#0E0F13]' 
                  : 'bg-[#2A2C31] text-[#9CA3AF] hover:bg-[#3A3C41]'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-[#9CA3AF]"
          >
            No alerts found
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#16181D] border border-[#2A2C31] rounded-lg p-4 hover:border-[#F6B26B] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getStatusIcon(alert.status)}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[#FAF8F4] font-semibold">
                        {alert.studentName}
                      </h3>
                      <div 
                        className="px-3 py-1 rounded text-xs font-semibold"
                        style={{ 
                          backgroundColor: getRiskColor(alert.riskLevel) + '20',
                          color: getRiskColor(alert.riskLevel)
                        }}
                      >
                        {alert.riskLevel.toUpperCase()} RISK
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-sm text-[#9CA3AF]">
                        Risk Score: <span className="text-[#FAF8F4] font-semibold">
                          {(alert.riskScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-sm text-[#9CA3AF]">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {alert.factors.map((factor, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-[#2A2C31] text-[#9CA3AF] px-2 py-1 rounded"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RiskAlertsPanel
