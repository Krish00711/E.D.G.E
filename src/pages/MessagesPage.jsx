import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function MessagesPage() {
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showCompose, setShowCompose] = useState(false)
  const [activeTab, setActiveTab] = useState('inbox')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  
  // Enhanced filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [senderFilter, setSenderFilter] = useState('all')
  const [unreadCount, setUnreadCount] = useState(0)
  const [threadView, setThreadView] = useState(null)
  const [replyContent, setReplyContent] = useState('')

  const [newMessage, setNewMessage] = useState({
    toUserId: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const [inboxRes, sentRes] = await Promise.all([
        api.communications.getInbox(),
        api.communications.getSent()
      ])
      setInbox(inboxRes.messages || inboxRes)
      setSent(sentRes.messages || sentRes)
      
      // Calculate unread count
      const messages = inboxRes.messages || inboxRes
      const unread = messages.filter(m => !m.read).length
      setUnreadCount(unread)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    try {
      await api.communications.send(newMessage)
      alert('Message sent successfully!')
      setShowCompose(false)
      setNewMessage({ toUserId: '', subject: '', message: '' })
      loadMessages()
    } catch (err) {
      alert('Failed to send: ' + err.message)
    }
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return
    try {
      await api.communications.send({
        toUserId: selectedMessage.fromUserId._id || selectedMessage.fromUserId,
        subject: `Re: ${selectedMessage.subject}`,
        message: replyContent
      })
      alert('Reply sent!')
      setReplyContent('')
      setSelectedMessage(null)
      loadMessages()
    } catch (err) {
      alert('Failed to reply: ' + err.message)
    }
  }

  const handleMarkAsRead = async (messageId) => {
    try {
      await api.communications.markRead(messageId)
      loadMessages()
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  // Filter and search logic
  const messages = activeTab === 'inbox' ? inbox : sent
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = !searchTerm || 
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.fromUserId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.toUserId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSender = senderFilter === 'all' || 
      (msg.fromUserId?.name || '').toLowerCase().includes(senderFilter.toLowerCase())
    
    return matchesSearch && matchesSender
  })

  // Get unique senders for filter dropdown
  const uniqueSenders = [...new Set(messages.map(m => m.fromUserId?.name).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading messages...</div>
      </div>
    )
  }

  const displayMessages = activeTab === 'inbox' ? inbox : sent

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#FAF8F4]">Messages</h1>
              {unreadCount > 0 && (
                <span className="inline-block mt-2 px-3 py-1 bg-[#F6B26B] text-[#0E0F13] text-sm font-semibold rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <button
              onClick={() => setShowCompose(true)}
              className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors"
            >
              + Compose
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#9CA3AF] text-sm mb-2">Search messages</label>
                <input
                  type="text"
                  placeholder="Search by subject, content, or sender..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                />
              </div>
              <div>
                <label className="block text-[#9CA3AF] text-sm mb-2">Filter by sender</label>
                <select
                  value={senderFilter}
                  onChange={(e) => setSenderFilter(e.target.value)}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-2 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                >
                  <option value="all">All senders</option>
                  {uniqueSenders.map((sender, idx) => (
                    <option key={idx} value={sender}>{sender}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-[#2A2C31]">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'inbox'
                  ? 'text-[#F6B26B] border-b-2 border-[#F6B26B]'
                  : 'text-[#9CA3AF] hover:text-[#FAF8F4]'
              }`}
            >
              Inbox ({inbox.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'text-[#F6B26B] border-b-2 border-[#F6B26B]'
                  : 'text-[#9CA3AF] hover:text-[#FAF8F4]'
              }`}
            >
              Sent ({sent.length})
            </button>
          </div>

          {/* Messages List */}
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg overflow-hidden">
            {filteredMessages.length > 0 ? (
              <div className="divide-y divide-[#2A2C31]">
                {displayMessages.map((message) => (
                  <div
                    key={message._id}
                    onClick={() => {
                      setSelectedMessage(message)
                      if (!message.read && activeTab === 'inbox') {
                        handleMarkAsRead(message._id)
                      }
                    }}
                    className={`p-4 hover:bg-[#16181D] transition-colors cursor-pointer ${
                      !message.read && activeTab === 'inbox' ? 'bg-[#16181D] border-l-2 border-[#F6B26B]' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F6B26B] rounded-full flex items-center justify-center text-[#0E0F13] font-bold">
                          {(message.fromUserId?.name || message.toUserId?.name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-[#FAF8F4] font-semibold">
                              {activeTab === 'inbox' ? message.fromUserId?.name : message.toUserId?.name}
                            </h3>
                            {!message.read && activeTab === 'inbox' && (
                              <span className="w-2 h-2 bg-[#F6B26B] rounded-full"></span>
                            )}
                          </div>
                          <p className="text-[#9CA3AF] text-sm">{message.subject}</p>
                        </div>
                      </div>
                      <span className="text-[#9CA3AF] text-sm">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#9CA3AF] text-sm line-clamp-2 ml-13">
                      {message.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-[#9CA3AF]">
                {searchTerm || senderFilter !== 'all' ? 'No messages match your filters' : `No messages in ${activeTab}`}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 max-w-2xl w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#FAF8F4]">New Message</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="text-[#9CA3AF] hover:text-[#FAF8F4]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-[#FAF8F4] text-sm font-medium mb-2">
                  Recipient ID
                </label>
                <input
                  type="text"
                  value={newMessage.toUserId}
                  onChange={(e) => setNewMessage({ ...newMessage, toUserId: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#FAF8F4] text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#FAF8F4] text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B] min-h-[150px]"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold py-3 rounded-lg transition-colors"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-6 bg-[#0E0F13] hover:bg-[#16181D] text-[#FAF8F4] font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#FAF8F4] mb-2">
                  {selectedMessage.subject}
                </h2>
                <p className="text-[#9CA3AF]">
                  From: {selectedMessage.fromUserId?.name || 'Unknown'}
                </p>
                <p className="text-[#9CA3AF]">
                  To: {selectedMessage.toUserId?.name || 'Unknown'}
                </p>
                <p className="text-[#9CA3AF] text-sm">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-[#9CA3AF] hover:text-[#FAF8F4]"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#0E0F13] rounded-lg p-4 mb-4">
              <p className="text-[#FAF8F4] whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            {/* Reply Section */}
            {activeTab === 'inbox' && (
              <div className="mb-4">
                <label className="block text-[#FAF8F4] text-sm font-medium mb-2">Quick Reply</label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full bg-[#0E0F13] border border-[#2A2C31] rounded-lg px-4 py-3 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B] min-h-[100px]"
                />
                <button
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className="mt-2 w-full bg-[#F6B26B] hover:bg-[#E69138] disabled:opacity-50 disabled:cursor-not-allowed text-[#0E0F13] font-semibold py-3 rounded-lg transition-colors"
                >
                  Send Reply
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedMessage(null)}
              className="w-full bg-[#0E0F13] hover:bg-[#16181D] text-[#FAF8F4] font-semibold py-3 rounded-lg transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
