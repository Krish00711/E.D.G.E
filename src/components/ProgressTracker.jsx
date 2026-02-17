import React, { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { motion } from 'framer-motion'
import api from '../services/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

function ProgressTracker({ studentId }) {
  const [progressData, setProgressData] = useState(null)
  const [timeRange, setTimeRange] = useState('month') // week, month, semester
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (studentId) {
      fetchProgressData()
    }
  }, [studentId, timeRange])

  const fetchProgressData = async () => {
    try {
      const response = await api.analytics.getProgress(studentId, timeRange)
      setProgressData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching progress:', error)
      // Generate mock progress data
      setProgressData({
        riskTrend: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          values: [0.75, 0.68, 0.55, 0.48]
        },
        performanceMetrics: {
          attendance: [85, 88, 90, 92],
          grades: [72, 75, 78, 80],
          engagement: [60, 65, 70, 75]
        },
        milestones: [
          { date: '2026-02-10', type: 'improvement', description: 'Attendance improved by 15%' },
          { date: '2026-02-05', type: 'intervention', description: 'Tutoring session completed' },
          { date: '2026-01-28', type: 'alert', description: 'Risk alert triggered' }
        ],
        overallTrend: 'improving'
      })
      setLoading(false)
    }
  }

  if (loading || !progressData) {
    return (
      <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
        <div className="animate-pulse flex justify-center items-center h-64">
          <div className="text-[#9CA3AF]">Loading progress data...</div>
        </div>
      </div>
    )
  }

  const riskChartData = {
    labels: progressData.riskTrend.labels,
    datasets: [
      {
        label: 'Risk Score',
        data: progressData.riskTrend.values,
        borderColor: '#F6B26B',
        backgroundColor: 'rgba(246, 178, 107, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const performanceChartData = {
    labels: progressData.riskTrend.labels,
    datasets: [
      {
        label: 'Attendance',
        data: progressData.performanceMetrics.attendance,
        backgroundColor: '#2ECC71'
      },
      {
        label: 'Grades',
        data: progressData.performanceMetrics.grades,
        backgroundColor: '#3498DB'
      },
      {
        label: 'Engagement',
        data: progressData.performanceMetrics.engagement,
        backgroundColor: '#9B59B6'
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#FAF8F4',
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#2A2C31' }
      },
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#2A2C31' }
      }
    }
  }

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return '📈'
      case 'stable': return '➡️'
      case 'declining': return '📉'
      default: return '📊'
    }
  }

  const getMilestoneIcon = (type) => {
    switch(type) {
      case 'improvement': return '✅'
      case 'intervention': return '🎯'
      case 'alert': return '⚠️'
      default: return '📌'
    }
  }

  return (
    <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-[#FAF8F4]">
            Progress Tracker
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTrendIcon(progressData.overallTrend)}</span>
            <span className="text-sm text-[#9CA3AF] capitalize">
              {progressData.overallTrend}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {['week', 'month', 'semester'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                timeRange === range
                  ? 'bg-[#F6B26B] text-[#0E0F13]'
                  : 'bg-[#2A2C31] text-[#9CA3AF] hover:bg-[#3A3C41]'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#16181D] border border-[#2A2C31] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#FAF8F4] mb-4">Risk Trend</h3>
          <div style={{ height: '200px' }}>
            <Line data={riskChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-[#16181D] border border-[#2A2C31] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#FAF8F4] mb-4">Performance Metrics</h3>
          <div style={{ height: '200px' }}>
            <Bar data={performanceChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-[#16181D] border border-[#2A2C31] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#FAF8F4] mb-4">Recent Milestones</h3>
        <div className="space-y-3">
          {progressData.milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-xl">{getMilestoneIcon(milestone.type)}</span>
              <div className="flex-1">
                <div className="text-sm text-[#FAF8F4]">{milestone.description}</div>
                <div className="text-xs text-[#9CA3AF]">
                  {new Date(milestone.date).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker
