import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

export default function ForumsPage() {
  const [forums, setForums] = useState([])
  const [activeForum, setActiveForum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newPost, setNewPost] = useState({ content: '' })
  const [newReply, setNewReply] = useState('')
  
  // Enhanced filters and stats
  const [searchTerm, setSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')

  useEffect(() => {
    loadForums()
  }, [])

  const loadForums = async () => {
    try {
      setLoading(true)
      const res = await api.forums.list()
      setForums(res.forums || res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (forumId, e) => {
    e.preventDefault()
    try {
      await api.forums.addPost(forumId, newPost.content)
      alert('Post created successfully!')
      setNewPost({ content: '' })
      const updated = await api.forums.get(forumId)
      setActiveForum(updated)
    } catch (err) {
      alert('Failed to create post: ' + err.message)
    }
  }

  const handleAddReply = async (forumId, postId) => {
    try {
      await api.forums.addReply(forumId, postId, { content: newReply })
      alert('Reply added successfully!')
      setNewReply('')
      const updated = await api.forums.get(forumId)
      setActiveForum(updated)
    } catch (err) {
      alert('Failed to add reply: ' + err.message)
    }
  }

  const handleLike = async (forumId, postId) => {
    try {
      await api.forums.likePost(forumId, postId)
      const updated = await api.forums.get(forumId)
      setActiveForum(updated)
    } catch (err) {
      alert('Failed to like: ' + err.message)
    }
  }

  const toggleForum = async (forumId) => {
    if (activeForum?._id === forumId) {
      setActiveForum(null)
      return
    }
    try {
      const details = await api.forums.get(forumId)
      setActiveForum(details)
    } catch (err) {
      alert('Failed to load forum: ' + err.message)
    }
  }

  // Computed filters
  const uniqueCourses = [...new Set(forums.map(f => f.courseId?.title || f.courseId?.code || 'General').filter(Boolean))]
  
  const filteredForums = forums
    .filter(f => !searchTerm || 
      f.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(f => courseFilter === 'all' || 
      (f.courseId?.title === courseFilter || f.courseId?.code === courseFilter || 
       (!f.courseId && courseFilter === 'General'))
    )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading forums...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Discussion Forums</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Total Forums</p>
              <p className="text-2xl font-bold text-[#F6B26B]">{filteredForums.length}</p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Total Posts</p>
              <p className="text-2xl font-bold text-[#F6B26B]">
                {filteredForums.reduce((sum, f) => sum + (f.posts?.length || 0), 0)}
              </p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Active Discussions</p>
              <p className="text-2xl font-bold text-[#F6B26B]">
                {filteredForums.filter(f => f.posts?.length > 0).length}
              </p>
            </div>
            <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm mb-1">Course Forums</p>
              <p className="text-2xl font-bold text-[#F6B26B]">{uniqueCourses.length}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#9CA3AF] text-sm mb-2">Search forums</label>
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
          </div>

          {/* Forums List */}
          <div className="space-y-6">
            {filteredForums.length > 0 ? (
              filteredForums.map((forum) => {
                const postCount = forum.posts?.length || 0
                const replyCount = forum.posts?.reduce((sum, p) => sum + (p.replies?.length || 0), 0) || 0
                return (
                  <div
                    key={forum._id}
                    className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-[#FAF8F4]">
                            {forum.title}
                          </h2>
                          {postCount > 10 && (
                            <span className="px-2 py-1 bg-[#F6B26B] text-[#0E0F13] text-xs font-semibold rounded">
                              🔥 Active
                            </span>
                          )}
                        </div>
                        <p className="text-[#9CA3AF] mb-2">{forum.description}</p>
                        <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
                          <span>📚 {forum.courseId?.title || forum.courseId?.code || 'General'}</span>
                          <span>💬 {postCount} posts</span>
                          <span>💭 {replyCount} replies</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleForum(forum._id)}
                        className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors"
                      >
                        {activeForum?._id === forum._id ? 'Hide Posts' : 'View Posts'}
                      </button>
                    </div>

                    {activeForum?._id === forum._id && (
                      <div className="space-y-4 mt-6">
                      {/* Create Post Form */}
                      <form onSubmit={(e) => handleCreatePost(forum._id, e)} className="bg-[#0E0F13] rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-[#FAF8F4] mb-3">Create New Post</h3>
                        <textarea
                          placeholder="Post content..."
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          className="w-full bg-[#1A1C21] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B] mb-3"
                          rows="3"
                          required
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors"
                        >
                          Create Post
                        </button>
                      </form>

                      {/* Posts */}
                      <div className="space-y-4">
                        {activeForum.posts?.map((post, idx) => (
                          <div
                            key={idx}
                            className="bg-[#0E0F13] rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-[#FAF8F4] mb-1">
                                  {post.content?.slice(0, 60) || 'Post'}
                                </h4>
                                <p className="text-[#9CA3AF] text-sm mb-2">
                                  by {post.userId?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-[#FAF8F4] mb-3">{post.content}</p>
                              </div>
                              <button
                                onClick={() => handleLike(forum._id, post._id)}
                                className="flex items-center gap-2 px-3 py-1 bg-[#1A1C21] hover:bg-[#2A2C31] border border-[#2A2C31] rounded-lg transition-colors"
                              >
                                <span className="text-[#F6B26B]">👍</span>
                                <span className="text-[#FAF8F4]">{post.likes?.length || 0}</span>
                              </button>
                            </div>

                            {/* Replies */}
                            {post.replies?.length > 0 && (
                              <div className="ml-6 space-y-2 mb-3">
                                {post.replies.map((reply, ridx) => (
                                  <div
                                    key={ridx}
                                    className="bg-[#1A1C21] rounded-lg p-3"
                                  >
                                    <p className="text-[#9CA3AF] text-sm mb-1">
                                      {reply.userId?.name || 'Unknown'} • {new Date(reply.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-[#FAF8F4]">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply Form */}
                            <div className="ml-6 flex gap-2">
                              <input
                                type="text"
                                placeholder="Write a reply..."
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                className="flex-1 bg-[#1A1C21] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                              />
                              <button
                                onClick={() => handleAddReply(forum._id, post._id)}
                                className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                )
              })
            ) : (
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-12 text-center">
                <p className="text-[#9CA3AF]">No forums available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
