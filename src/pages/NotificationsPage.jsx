import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [readFilter, setReadFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const res = await api.notifications.list()
      setNotifications(res.notifications || res)
      setUnreadCount(res.unreadCount ?? 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await api.notifications.markRead(id)
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ))
    } catch (err) {
      alert('Failed to mark as read: ' + err.message)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead()
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      alert('Failed to mark all as read: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.notifications.delete(id)
      setNotifications(notifications.filter(n => n._id !== id))
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'success': return 'bg-green-500/20 text-green-500'
      case 'warning': return 'bg-yellow-500/20 text-yellow-500'
      case 'alert': return 'bg-red-500/20 text-red-500'
      case 'error': return 'bg-red-500/20 text-red-500'
      case 'info': return 'bg-blue-500/20 text-blue-500'
      case 'grade': return 'bg-purple-500/20 text-purple-500'
      case 'assignment': return 'bg-indigo-500/20 text-indigo-500'
      case 'attendance': return 'bg-emerald-500/20 text-emerald-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const typeOk = typeFilter === 'all' || notification.type === typeFilter
    const priorityOk = priorityFilter === 'all' || notification.priority === priorityFilter
    const readOk = readFilter === 'all'
      || (readFilter === 'read' && notification.isRead)
      || (readFilter === 'unread' && !notification.isRead)
    return typeOk && priorityOk && readOk
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-[#FAF8F4] text-xl">Loading notifications...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#FAF8F4]">Notifications</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#9CA3AF]">Unread: {unreadCount}</span>
              {notifications.some(n => !n.isRead) && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] font-semibold rounded-lg transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg px-3 py-2 text-sm text-[#FAF8F4]"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg px-3 py-2 text-sm text-[#FAF8F4]"
            >
              <option value="all">All Types</option>
              {Array.from(new Set(notifications.map(n => n.type).filter(Boolean))).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg px-3 py-2 text-sm text-[#FAF8F4]"
            >
              <option value="all">All Priorities</option>
              {Array.from(new Set(notifications.map(n => n.priority).filter(Boolean))).map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`bg-[#1A1C21] border rounded-lg p-4 ${
                    notification.isRead ? 'border-[#2A2C31]' : 'border-[#F6B26B] bg-[#F6B26B]/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      {notification.type === 'success' && '✓'}
                      {notification.type === 'warning' && '⚠'}
                      {notification.type === 'alert' && '✕'}
                      {notification.type === 'error' && '✕'}
                      {notification.type === 'info' && 'ℹ'}
                      {notification.type === 'grade' && '★'}
                      {notification.type === 'assignment' && '📝'}
                      {notification.type === 'attendance' && '📌'}
                      {!notification.type && '📬'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#FAF8F4] mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-[#9CA3AF] mb-2">{notification.message}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {notification.priority && (
                          <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        )}
                        {notification.type && (
                          <span className="text-xs bg-[#0E0F13] text-[#9CA3AF] px-2 py-1 rounded border border-[#2A2C31]">
                            {notification.type}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-[#9CA3AF]">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      {notification.actionUrl && (
                        <div className="mt-2">
                          <a
                            href={notification.actionUrl}
                            className="text-sm text-[#F6B26B] hover:underline"
                          >
                            Open related item
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkRead(notification._id)}
                          className="p-2 text-[#9CA3AF] hover:text-[#F6B26B] transition-colors"
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="p-2 text-[#9CA3AF] hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-12 text-center">
                <p className="text-[#9CA3AF]">No notifications</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
