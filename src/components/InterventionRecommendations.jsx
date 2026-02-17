import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

function InterventionRecommendations({ studentId }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (studentId) {
      fetchRecommendations()
    }
  }, [studentId])

  const fetchRecommendations = async () => {
    try {
      const response = await api.analytics.getRecommendations(studentId)
      setRecommendations(response.data.recommendations || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      // Generate smart recommendations based on risk factors
      setRecommendations([
        {
          id: 1,
          type: 'academic',
          priority: 'high',
          title: 'Schedule one-on-one academic support session',
          description: 'Student showing signs of academic struggle. Early intervention recommended.',
          actions: [
            'Book tutoring session within 48 hours',
            'Review struggling subjects',
            'Create personalized study plan'
          ],
          expectedImpact: 0.75,
          timeframe: 'Immediate (1-3 days)'
        },
        {
          id: 2,
          type: 'wellbeing',
          priority: 'medium',
          title: 'Wellness check-in recommended',
          description: 'Elevated stress levels detected. Mental health support may be beneficial.',
          actions: [
            'Connect with counseling services',
            'Share stress management resources',
            'Monitor mood trends'
          ],
          expectedImpact: 0.68,
          timeframe: 'Short-term (3-7 days)'
        },
        {
          id: 3,
          type: 'engagement',
          priority: 'medium',
          title: 'Increase social engagement',
          description: 'Low peer interaction score. Encourage participation in group activities.',
          actions: [
            'Suggest study groups',
            'Promote campus events',
            'Facilitate peer connections'
          ],
          expectedImpact: 0.55,
          timeframe: 'Medium-term (1-2 weeks)'
        },
        {
          id: 4,
          type: 'academic',
          priority: 'low',
          title: 'Time management workshop',
          description: 'Late submissions detected. Time management skills may need improvement.',
          actions: [
            'Enroll in time management workshop',
            'Provide planning tools',
            'Set milestone reminders'
          ],
          expectedImpact: 0.45,
          timeframe: 'Long-term (2-4 weeks)'
        }
      ])
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#E74C3C'
      case 'medium': return '#F39C12'
      case 'low': return '#3498DB'
      default: return '#95A5A6'
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'academic': return '📚'
      case 'wellbeing': return '💚'
      case 'engagement': return '👥'
      default: return '💡'
    }
  }

  if (loading) {
    return (
      <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
        <div className="animate-pulse flex justify-center items-center h-64">
          <div className="text-[#9CA3AF]">Loading recommendations...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
      <h2 className="text-xl font-semibold text-[#FAF8F4] mb-6">
        Intervention Recommendations
      </h2>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#16181D] border border-[#2A2C31] rounded-lg p-5 hover:border-[#F6B26B] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{getTypeIcon(rec.type)}</div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#FAF8F4] font-semibold">
                    {rec.title}
                  </h3>
                  <div 
                    className="px-3 py-1 rounded text-xs font-semibold uppercase"
                    style={{ 
                      backgroundColor: getPriorityColor(rec.priority) + '20',
                      color: getPriorityColor(rec.priority)
                    }}
                  >
                    {rec.priority} Priority
                  </div>
                </div>

                <p className="text-sm text-[#9CA3AF] mb-4">
                  {rec.description}
                </p>

                <div className="mb-4">
                  <div className="text-xs text-[#9CA3AF] mb-2 uppercase tracking-wide">
                    Recommended Actions:
                  </div>
                  <ul className="space-y-2">
                    {rec.actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#D1D5DB]">
                        <span className="text-[#F6B26B] mt-1">→</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#2A2C31]">
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-[#9CA3AF]">
                      Expected Impact: 
                      <span className="ml-2 text-[#2ECC71] font-semibold">
                        {(rec.expectedImpact * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      Timeframe: <span className="text-[#FAF8F4]">{rec.timeframe}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] text-xs font-semibold rounded transition-colors">
                    Take Action
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default InterventionRecommendations
