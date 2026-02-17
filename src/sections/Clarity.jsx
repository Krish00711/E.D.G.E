import React, { useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

function Clarity({ scrollProgress }) {
  const opacity = useTransform(scrollProgress, [0.75, 0.9], [0, 1])
  const y = useTransform(scrollProgress, [0.75, 0.9], [50, 0])
  const [showLogin, setShowLogin] = useState(false)
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    setShowLogin(false)
    navigate('/dashboard')
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <motion.div
        style={{ opacity, y }}
        className="max-w-5xl w-full"
      >
        <h2 className="text-section font-display text-gray-900 mb-4">
          Clarity
        </h2>
        <p className="text-lg font-body text-gray-700 mb-12 max-w-2xl">
          From invisible exhaustion to measurable understanding.
        </p>

        {/* System architecture snapshot */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 border border-gray-300 shadow-sm mb-12">
          <h3 className="text-2xl font-display text-gray-900 mb-6">
            System Architecture
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Intelligence Layer */}
            <div>
              <h4 className="text-lg font-display text-gray-900 mb-3">
                Intelligence Layer
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-flame rounded-full mr-3"></span>
                  Temporal Bayesian Networks
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-flame rounded-full mr-3"></span>
                  Cognitive Load Modeling
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-flame rounded-full mr-3"></span>
                  Trajectory Prediction
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-flame rounded-full mr-3"></span>
                  Recovery Optimization
                </li>
              </ul>
            </div>

            {/* Integration Layer */}
            <div>
              <h4 className="text-lg font-display text-gray-900 mb-3">
                Integration Layer
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-flame rounded-full mr-3"></span>
                  Behavioral Data Streams
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-flame rounded-full mr-3"></span>
                  Real-time Signal Processing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-flame rounded-full mr-3"></span>
                  Adaptive Interventions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-flame rounded-full mr-3"></span>
                  Outcome Validation
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="px-8 py-3 bg-flame text-white rounded-lg font-body font-medium hover:bg-flame-dark transition-colors text-center"
            >
              {showLogin ? 'Close' : 'View Dashboard'}
            </button>
            <a
              href="/architecture"
              className="px-8 py-3 border-2 border-flame text-flame rounded-lg font-body font-medium hover:bg-flame hover:text-white transition-colors text-center"
            >
              Explore System
            </a>
          </div>

          {/* Login Form */}
          {showLogin && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-blue-50 border border-blue-300 rounded-lg"
            >
              <h4 className="font-display text-lg text-gray-900 mb-4">Student Login</h4>
              <LoginForm onSuccess={handleLoginSuccess} />
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="font-display text-2xl text-gray-900 mb-2">EDGE</div>
              <p className="text-sm text-gray-700">
                Early Detection of Gradual Exhaustion
              </p>
            </div>
            
            <nav className="flex gap-6 text-sm text-gray-700">
              <a href="/" className="hover:text-flame transition-colors">Home</a>
              <a href="/architecture" className="hover:text-flame transition-colors">Architecture</a>
              <a href="/intelligence" className="hover:text-flame transition-colors">Intelligence</a>
              <a href="/team" className="hover:text-flame transition-colors">Team</a>
            </nav>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-600">
            © 2026 EDGE Project. Built with intention.
          </div>
        </footer>
      </motion.div>
    </section>
  )
}

export default Clarity
