import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function MLDashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [modelPerformance, setModelPerformance] = useState(null)
  const [featureImportance, setFeatureImportance] = useState(null)
  const [whatIfSimulation, setWhatIfSimulation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // What-if simulator state
  const [baselineStudent, setBaselineStudent] = useState(null)
  const [simulationChanges, setSimulationChanges] = useState({})
  
  useEffect(() => {
    loadMLData()
  }, [])
  
  const loadMLData = async () => {
    try {
      setLoading(true)
      setError('')
      const [performance, importance] = await Promise.all([
        api.ml.modelPerformance().catch(() => ({ 
          ensemble_models: { random_forest: {}, gradient_boosting: {}, neural_network: {} },
          prediction_count: 0 
        })),
        api.ml.featureImportance().catch(() => ({ feature_importance: {} }))
      ])
      setModelPerformance(performance)
      setFeatureImportance(importance)
    } catch (err) {
      console.error('ML Data loading error:', err)
      setError('ML service is initializing. Data will appear once models are trained.')
    } finally {
      setLoading(false)
    }
  }
  
  const runWhatIfSimulation = async () => {
    try {
      if (!baselineStudent) {
        alert('Please select a student first')
        return
      }
      
      const result = await api.ml.simulateWhatIf(baselineStudent, simulationChanges)
      setWhatIfSimulation(result)
    } catch (err) {
      console.error('Simulation error:', err)
      alert('Simulation failed: ' + err.message)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading ML Dashboard...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">🤖 ML Intelligence Dashboard</h1>
          <p className="text-[#9CA3AF] mb-8">Advanced machine learning models and predictions</p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}
          
          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {['overview', 'performance', 'features', 'simulator', 'heatmap'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#F6B26B] text-[#0E0F13]'
                    : 'bg-[#1A1C21] text-[#9CA3AF] hover:text-[#FAF8F4] border border-[#2A2C31]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                  <h3 className="text-[#F6B26B] font-semibold mb-2">🎯 Ensemble Models</h3>
                  <p className="text-3xl font-bold text-[#FAF8F4] mb-1">3</p>
                  <p className="text-[#9CA3AF] text-sm">Random Forest, GBoost, Neural Net</p>
                </div>
                
                <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                  <h3 className="text-[#F6B26B] font-semibold mb-2">📊 Total Predictions</h3>
                  <p className="text-3xl font-bold text-[#FAF8F4] mb-1">
                    {modelPerformance?.prediction_count || 0}
                  </p>
                  <p className="text-[#9CA3AF] text-sm">Across all models</p>
                </div>
                
                <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                  <h3 className="text-[#F6B26B] font-semibold mb-2">🔬 Features Tracked</h3>
                  <p className="text-3xl font-bold text-[#FAF8F4] mb-1">11</p>
                  <p className="text-[#9CA3AF] text-sm">Academic & behavioral metrics</p>
                </div>
              </div>
              
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Available ML Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: '🎯', name: 'Ensemble Prediction', desc: 'Multi-model consensus predictions' },
                    { icon: '📈', name: 'Time-Series Forecasting', desc: 'Predict future risk trends' },
                    { icon: '⚠️', name: 'Anomaly Detection', desc: 'Identify unusual behavior patterns' },
                    { icon: '💪', name: 'Engagement Prediction', desc: 'Forecast student engagement levels' },
                    { icon: '🧠', name: 'Mental Health Scoring', desc: 'Assess wellbeing risk factors' },
                    { icon: '🔬', name: 'Explainable AI', desc: 'Understand prediction reasoning' },
                    { icon: '🎮', name: 'What-If Simulator', desc: 'Test intervention scenarios' },
                    { icon: '📊', name: 'Feature Importance', desc: 'See what drives predictions' }
                  ].map((feature) => (
                    <div key={feature.name} className="bg-[#0E0F13] rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <h3 className="text-[#FAF8F4] font-semibold">{feature.name}</h3>
                          <p className="text-[#9CA3AF] text-sm">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Performance Tab */}
          {activeTab === 'performance' && modelPerformance && (
            <div className="space-y-6">
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Ensemble Model Weights</h2>
                <div className="space-y-4">
                  {Object.entries(modelPerformance.ensemble_models || {}).map(([modelName, data]) => (
                    <div key={modelName}>
                      <div className="flex justify-between mb-2">
                        <span className="text-[#FAF8F4] capitalize">{modelName.replace('_', ' ')}</span>
                        <span className="text-[#F6B26B] font-semibold">{(data.weight * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-[#0E0F13] rounded-full h-3">
                        <div
                          className="bg-[#F6B26B] h-3 rounded-full transition-all"
                          style={{ width: `${data.weight * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Model Metadata</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#9CA3AF] text-sm">Model Version</p>
                    <p className="text-[#FAF8F4] font-semibold">{modelPerformance.model_version}</p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-sm">Total Predictions</p>
                    <p className="text-[#FAF8F4] font-semibold">{modelPerformance.prediction_count}</p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-sm">Last Updated</p>
                    <p className="text-[#FAF8F4] font-semibold">
                      {new Date(modelPerformance.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-sm">Status</p>
                    <p className="text-green-500 font-semibold">● Active</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Feature Importance Tab */}
          {activeTab === 'features' && featureImportance && (
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Feature Importance Rankings</h2>
              <p className="text-[#9CA3AF] mb-6">
                Which factors have the strongest impact on risk predictions?
              </p>
              <div className="space-y-4">
                {Object.entries(featureImportance.feature_importance || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([feature, importance], index) => (
                    <div key={feature}>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[#F6B26B] font-bold">#{index + 1}</span>
                          <span className="text-[#FAF8F4] capitalize">
                            {feature.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="text-[#F6B26B] font-semibold">
                          {(importance * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#0E0F13] rounded-full h-4">
                        <div
                          className={`h-4 rounded-full transition-all ${
                            importance > 0.15 ? 'bg-red-500' :
                            importance > 0.10 ? 'bg-[#F6B26B]' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${importance * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="mt-6 p-4 bg-[#0E0F13] rounded-lg">
                <p className="text-[#9CA3AF] text-sm">
                  <strong className="text-[#FAF8F4]">Interpretation:</strong> Features with higher importance scores have a stronger influence on risk predictions. Focus interventions on improving these metrics for maximum impact.
                </p>
              </div>
            </div>
          )}
          
          {/* What-If Simulator Tab */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">🎮 What-If Scenario Simulator</h2>
                <p className="text-[#9CA3AF] mb-6">
                  Test how changes to student metrics would impact their risk score
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#FAF8F4] mb-2">Student ID</label>
                    <input
                      type="text"
                      placeholder="Enter student ID"
                      value={baselineStudent || ''}
                      onChange={(e) => setBaselineStudent(e.target.value)}
                      className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#FAF8F4] mb-2">Metric to Change</label>
                    <select
                      onChange={(e) => {
                        const key = e.target.value
                        if (key) setSimulationChanges({ ...simulationChanges, [key]: 0 })
                      }}
                      className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                    >
                      <option value="">Select metric...</option>
                      <option value="attendance_rate">Attendance Rate</option>
                      <option value="avg_grade">Average Grade</option>
                      <option value="assignment_completion_rate">Assignment Completion</option>
                      <option value="stress_level">Stress Level</option>
                      <option value="sleep_hours_avg">Sleep Hours</option>
                      <option value="cognitive_load_avg">Cognitive Load</option>
                    </select>
                  </div>
                </div>
                
                {Object.keys(simulationChanges).length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-[#FAF8F4] font-semibold">Adjust Values:</h3>
                    {Object.entries(simulationChanges).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-[#9CA3AF] text-sm mb-2 capitalize">
                          {key.replace(/_/g, ' ')}
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={value}
                            onChange={(e) => setSimulationChanges({
                              ...simulationChanges,
                              [key]: parseFloat(e.target.value)
                            })}
                            className="flex-1"
                          />
                          <span className="text-[#FAF8F4] font-semibold w-16">{value.toFixed(1)}</span>
                          <button
                            onClick={() => {
                              const newChanges = { ...simulationChanges }
                              delete newChanges[key]
                              setSimulationChanges(newChanges)
                            }}
                            className="text-red-500 hover:text-red-400"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={runWhatIfSimulation}
                  disabled={!baselineStudent || Object.keys(simulationChanges).length === 0}
                  className="mt-6 w-full bg-[#F6B26B] hover:bg-[#E69138] disabled:opacity-50 disabled:cursor-not-allowed text-[#0E0F13] font-semibold py-3 rounded-lg transition-colors"
                >
                  Run Simulation
                </button>
              </div>
              
              {whatIfSimulation && (
                <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">Simulation Results</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[#9CA3AF] text-sm mb-1">Baseline Risk</p>
                      <p className="text-3xl font-bold text-[#FAF8F4]">
                        {(whatIfSimulation.baseline.ensemble_prediction.risk_score * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-[#9CA3AF] uppercase">{whatIfSimulation.baseline.ensemble_prediction.risk_level}</p>
                    </div>
                    
                    <div>
                      <p className="text-[#9CA3AF] text-sm mb-1">Modified Risk</p>
                      <p className="text-3xl font-bold text-[#F6B26B]">
                        {(whatIfSimulation.modified.ensemble_prediction.risk_score * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-[#9CA3AF] uppercase">{whatIfSimulation.modified.ensemble_prediction.risk_level}</p>
                    </div>
                    
                    <div>
                      <p className="text-[#9CA3AF] text-sm mb-1">Impact</p>
                      <p className={`text-3xl font-bold ${
                        whatIfSimulation.impact.direction === 'decreased' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {whatIfSimulation.impact.direction === 'decreased' ? '↓' : '↑'}
                        {(Math.abs(whatIfSimulation.impact.risk_change) * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-[#9CA3AF]">{whatIfSimulation.impact.direction}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-[#0E0F13] rounded-lg">
                    <p className="text-[#FAF8F4] font-semibold mb-2">Recommendation:</p>
                    <p className="text-[#9CA3AF]">
                      {whatIfSimulation.impact.direction === 'decreased'
                        ? `✅ These changes would significantly reduce risk. Consider implementing these interventions.`
                        : `⚠️ These changes would increase risk. Avoid or carefully monitor these factors.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Heatmap Tab */}
          {activeTab === 'heatmap' && (
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#FAF8F4] mb-4">📊 Risk Distribution Heatmap</h2>
              <p className="text-[#9CA3AF] mb-6">
                Coming soon: Interactive heatmap showing risk distribution across cohorts and time periods
              </p>
              
              <div className="aspect-video bg-[#0E0F13] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">📊</span>
                  <p className="text-[#9CA3AF]">Heatmap visualization in development</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
