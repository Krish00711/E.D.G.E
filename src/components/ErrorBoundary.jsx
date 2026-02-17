import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0E0F13] flex items-center justify-center">
          <div className="bg-[#1A1C21] p-8 rounded-lg max-w-md">
            <h1 className="text-xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/'
              }}
              className="px-4 py-2 bg-[#F6B26B] text-[#0E0F13] rounded hover:bg-orange-400 transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
