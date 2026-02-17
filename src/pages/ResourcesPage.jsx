import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  const [popular, setPopular] = useState([])
  const [selectedResource, setSelectedResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  
  // Enhanced filters and stats
  const [searchTerm, setSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [resourcesRes, popularRes] = await Promise.all([
        api.resources.list(),
        api.resources.getPopular()
      ])
      setResources(resourcesRes.resources || resourcesRes)
      setPopular(popularRes.resources || popularRes)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkHelpful = async (id) => {
    try {
      await api.resources.markHelpful(id)
      loadData()
    } catch (err) {
      alert('Failed to mark as helpful: ' + err.message)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      document: 'bg-blue-500/20 text-blue-500 border-blue-500/50',
      video: 'bg-purple-500/20 text-purple-500 border-purple-500/50',
      link: 'bg-green-500/20 text-green-500 border-green-500/50',
      book: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      article: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      tutorial: 'bg-indigo-500/20 text-indigo-500 border-indigo-500/50',
      counseling: 'bg-rose-500/20 text-rose-500 border-rose-500/50',
      tutoring: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50'
    }
    return colors[category?.toLowerCase()] || 'bg-gray-500/20 text-gray-500 border-gray-500/50'
  }

  const filteredResources = filter === 'all'
    ? resources
    : resources.filter(r => r.type?.toLowerCase() === filter.toLowerCase())
  
  // Apply search and course filters
  const finalFilteredResources = filteredResources
    .filter(r => !searchTerm ||
      r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(r => courseFilter === 'all' ||
      r.courseId?.title === courseFilter ||
      r.courseId?.code === courseFilter ||
      (!r.courseId && courseFilter === 'General')
    )
  
  const uniqueCourses = [...new Set(resources.map(r => r.courseId?.title || r.courseId?.code || 'General').filter(Boolean))]
  
  const typeCounts = {
    document: resources.filter(r => r.type === 'document').length,
    video: resources.filter(r => r.type === 'video').length,
    article: resources.filter(r => r.type === 'article').length,
    tutorial: resources.filter(r => r.type === 'tutorial').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading resources...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Resource Library</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Total Resources</p>
              <p className="text-2xl font-bold text-[#F6B26B]">{resources.length}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Documents</p>
              <p className="text-2xl font-bold text-blue-500">{typeCounts.document}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Videos</p>
              <p className="text-2xl font-bold text-purple-500">{typeCounts.video}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Tutorials</p>
              <p className="text-2xl font-bold text-indigo-500">{typeCounts.tutorial}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Article</p>
              <p className="text-2xl font-bold text-yellow-500">{typeCounts.article}</p>
            </div>
          </div>

          {/* Popular Resources */}
          {popular.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#FAF8F4] mb-4">🌟 Popular Resources</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {popular.slice(0, 3).map((resource) => (
                  <div
                    key={resource._id}
                    className="bg-[#1A1C21] border border-[#F6B26B] rounded-lg p-4 cursor-pointer hover:bg-[#16181D] transition-colors"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <span className={`px-2 py-1 rounded text-xs border ${getCategoryColor(resource.type)}`}>
                      {resource.type}
                    </span>
                    <h3 className="text-lg font-semibold text-[#FAF8F4] mt-2 mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-[#9CA3AF] text-sm flex items-center gap-2">
                      👍 {resource.usefulCount || 0} helpful • 👁️ {resource.views || 0} views
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[#9CA3AF] text-sm mb-2">Search resources</label>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                />
              </div>
              <div>
                <label className="block text-[#9CA3AF] text-sm mb-2">Filter by Course</label>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map((course, idx) => (
                    <option key={idx} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'document', 'video', 'link', 'article', 'tutorial', 'counseling', 'tutoring'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === cat
                      ? 'bg-[#F6B26B] text-[#0E0F13]'
                      : 'bg-[#1A1C21] text-[#9CA3AF] hover:text-[#FAF8F4] border border-[#2A2C31]'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <motion.div
                  key={resource._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 hover:border-[#F6B26B] transition-colors cursor-pointer"
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-xs border ${getCategoryColor(resource.type)}`}>
                      {resource.type}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkHelpful(resource._id)
                      }}
                      className="text-[#9CA3AF] hover:text-[#F6B26B] transition-colors"
                    >
                      👍 {resource.usefulCount || 0}
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-[#FAF8F4] mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-[#9CA3AF] text-sm mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#9CA3AF] text-xs">
                      {resource.courseId?.title || resource.courseId?.code || 'General'}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-12 text-center">
                <p className="text-[#9CA3AF]">No resources found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`px-2 py-1 rounded text-xs border ${getCategoryColor(selectedResource.type)}`}>
                  {selectedResource.type}
                </span>
                <h2 className="text-2xl font-bold text-[#FAF8F4] mt-2 mb-1">
                  {selectedResource.title}
                </h2>
                <p className="text-[#9CA3AF]">
                  {selectedResource.courseId?.title || selectedResource.courseId?.code || 'General'}
                </p>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="text-[#9CA3AF] hover:text-[#FAF8F4]"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#FAF8F4] mb-2">Description</h3>
              <p className="text-[#9CA3AF]">{selectedResource.description}</p>
            </div>

            {selectedResource.url && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#FAF8F4] mb-2">Link</h3>
                <a
                  href={selectedResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F6B26B] hover:underline break-all"
                >
                  {selectedResource.url}
                </a>
              </div>
            )}

            <div className="flex gap-3">
              {selectedResource.url && (
                <a
                  href={selectedResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold py-3 rounded-lg transition-colors text-center"
                >
                  Open Resource
                </a>
              )}
              <button
                onClick={() => {
                  handleMarkHelpful(selectedResource._id)
                  setSelectedResource(null)
                }}
                className="px-6 bg-[#0E0F13] hover:bg-[#16181D] text-[#FAF8F4] font-semibold py-3 rounded-lg transition-colors"
              >
                Mark Helpful 👍
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
