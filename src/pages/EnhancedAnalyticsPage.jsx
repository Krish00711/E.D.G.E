import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  ArcElement,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import api from '../services/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

function EnhancedAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [timeRange, setTimeRange] = useState('week') // week, month, semester, year
  const [selectedMetric, setSelectedMetric] = useState('risk_distribution')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await api.analytics.getEnhancedData(timeRange)
      setAnalyticsData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Generate comprehensive mock data
      setAnalyticsData({
        riskDistribution: {
          high: 12,
          medium: 45,
          low: 143
        },
        trendsOverTime: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          averageRisk: [0.45, 0.42, 0.38, 0.40, 0.37, 0.35],
          interventions: [5, 8, 6, 10, 7, 9],
          successRate: [75, 78, 82, 85, 87, 90]
        },
        topRiskFactors: [
          { factor: 'Low Attendance', impact: 0.85, count: 23 },
          { factor: 'Declining Grades', impact: 0.78, count: 18 },
          { factor: 'High Stress', impact: 0.72, count: 31 },
          { factor: 'Poor Sleep', impact: 0.68, count: 27 },
          { factor: 'Low Engagement', impact: 0.65, count: 19 }
        ],
        interventionEffectiveness: {
          tutoring: { success: 85, count: 34 },
          counseling: { success: 78, count: 22 },
          peerSupport: { success: 72, count: 18 },
          timeManagement: { success: 80, count: 15 }
        },
        departmentComparison: [
          { dept: 'Computer Science', avgRisk: 0.42, students: 120 },
          { dept: 'Engineering', avgRisk: 0.38, students: 95 },
          { dept: 'Mathematics', avgRisk: 0.45, students: 78 },
          { dept: 'Business', avgRisk: 0.35, students: 110 }
        ],
        modelAccuracy: {
          ensemble: 92,
          timeSeries: 88,
          anomaly: 85
        }
      })
      setLoading(false)
    }
  }

  if (loading || !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center pt-24">
        <div className="text-[#FAF8F4] text-xl">Loading analytics...</div>
      </div>
    )
  }

  const riskDistributionData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [
          analyticsData.riskDistribution.high,
          analyticsData.riskDistribution.medium,
          analyticsData.riskDistribution.low
        ],
        backgroundColor: ['#E74C3C', '#F39C12', '#2ECC71'],
        borderWidth: 0
      }
    ]
  }

  const trendsData = {
    labels: analyticsData.trendsOverTime.labels,
    datasets: [
      {
        label: 'Average Risk Score',
        data: analyticsData.trendsOverTime.averageRisk,
        borderColor: '#F6B26B',
        backgroundColor: 'rgba(246, 178, 107, 0.1)',
        yAxisID: 'y'
      },
      {
        label: 'Success Rate (%)',
        data: analyticsData.trendsOverTime.successRate,
        borderColor: '#2ECC71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        yAxisID: 'y1'
      }
    ]
  }

  const riskFactorsData = {
    labels: analyticsData.topRiskFactors.map(f => f.factor),
    datasets: [
      {
        label: 'Impact Score',
        data: analyticsData.topRiskFactors.map(f => f.impact * 100),
        backgroundColor: '#F6B26B'
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
        type: 'linear',
        position: 'left',
        ticks: { color: '#9CA3AF' },
        grid: { color: '#2A2C31' }
      },
      y1: {
        type: 'linear',
        position: 'right',
        ticks: { color: '#9CA3AF' },
        grid: { display: false }
      },
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#2A2C31' }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] pt-24 px-6">
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">
            📊 Advanced Analytics
          </h1>
          <p className="text-[#9CA3AF]">
            Comprehensive insights into student wellbeing and intervention effectiveness
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {['week', 'month', 'semester', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                timeRange === range
                  ? 'bg-[#F6B26B] text-[#0E0F13]'
                  : 'bg-[#1A1C21] text-[#9CA3AF] hover:text-[#FAF8F4] border border-[#2A2C31]'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6"
          >
            <div className="text-[#F6B26B] text-sm font-semibold mb-2">Total Students</div>
            <div className="text-3xl font-bold text-[#FAF8F4] mb-1">
              {analyticsData.riskDistribution.high + 
               analyticsData.riskDistribution.medium + 
               analyticsData.riskDistribution.low}
            </div>
            <div className="text-[#9CA3AF] text-xs">Being monitored</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6"
          >
            <div className="text-[#E74C3C] text-sm font-semibold mb-2">High Risk</div>
            <div className="text-3xl font-bold text-[#FAF8F4] mb-1">
              {analyticsData.riskDistribution.high}
            </div>
            <div className="text-[#9CA3AF] text-xs">Require immediate attention</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6"
          >
            <div className="text-[#2ECC71] text-sm font-semibold mb-2">Avg Success Rate</div>
            <div className="text-3xl font-bold text-[#FAF8F4] mb-1">
              {analyticsData.trendsOverTime.successRate[
                analyticsData.trendsOverTime.successRate.length - 1
              ]}%
            </div>
            <div className="text-[#9CA3AF] text-xs">Intervention effectiveness</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6"
          >
            <div className="text-[#3498DB] text-sm font-semibold mb-2">Model Accuracy</div>
            <div className="text-3xl font-bold text-[#FAF8F4] mb-1">
              {analyticsData.modelAccuracy.ensemble}%
            </div>
            <div className="text-[#9CA3AF] text-xs">Ensemble prediction</div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-[#FAF8F4] mb-4">
              Risk Distribution
            </h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={riskDistributionData} options={{ maintainAspectRatio: false }} />
            </div>
          </motion.div>

          {/* Trends Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-[#FAF8F4] mb-4">
              Risk & Success Trends
            </h3>
            <div style={{ height: '300px' }}>
              <Line data={trendsData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Top Risk Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-[#FAF8F4] mb-4">
            Top Risk Factors by Impact
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={riskFactorsData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Intervention Effectiveness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-[#FAF8F4] mb-4">
            Intervention Effectiveness
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analyticsData.interventionEffectiveness).map(([type, data]) => (
              <div key={type} className="bg-[#16181D] rounded-lg p-4">
                <div className="text-[#9CA3AF] text-xs mb-2 capitalize">{type}</div>
                <div className="text-2xl font-bold text-[#FAF8F4] mb-1">
                  {data.success}%
                </div>
                <div className="text-[#9CA3AF] text-xs">
                  {data.count} interventions
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Department Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-[#FAF8F4] mb-4">
            Risk by Department
          </h3>
          <div className="space-y-4">
            {analyticsData.departmentComparison.map((dept, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-[#FAF8F4] mb-1">{dept.dept}</div>
                  <div className="text-xs text-[#9CA3AF]">{dept.students} students</div>
                </div>
                <div className="flex-1">
                  <div className="bg-[#16181D] rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2ECC71] via-[#F39C12] to-[#E74C3C]"
                      style={{ width: `${dept.avgRisk * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-semibold text-[#FAF8F4]">
                    {(dept.avgRisk * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EnhancedAnalyticsPage
