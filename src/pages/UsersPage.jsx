import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@edge.com', role: 'admin', status: 'Active', joinDate: '2025-01-15' },
    { id: 2, name: 'Prof. Johnson', email: 'prof.johnson@edge.com', role: 'mentor', status: 'Active', joinDate: '2025-02-01' },
    { id: 3, name: 'John Student', email: 'john@student.com', role: 'student', status: 'Active', joinDate: '2025-02-10' },
    { id: 4, name: 'Dr. Smith', email: 'smith@edge.com', role: 'mentor', status: 'Active', joinDate: '2025-01-20' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa@student.com', role: 'student', status: 'Inactive', joinDate: '2024-12-05' },
  ])
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const filteredUsers = users.filter(u =>
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterRole === 'all' || u.role === filterRole)
  )

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-300'
      case 'mentor': return 'bg-blue-500/20 text-blue-300'
      case 'student': return 'bg-green-500/20 text-green-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getUserCount = (role) => users.filter(u => u.role === role).length

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] pt-28 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">User Management</h1>
          <p className="text-[#9CA3AF]">Manage system users and their roles</p>
        </div>

        {/* User Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Users', value: users.length, color: 'bg-blue-500/10 border-blue-500/30' },
            { label: 'Admins', value: getUserCount('admin'), color: 'bg-purple-500/10 border-purple-500/30' },
            { label: 'Mentors', value: getUserCount('mentor'), color: 'bg-blue-500/10 border-blue-500/30' },
            { label: 'Students', value: getUserCount('student'), color: 'bg-green-500/10 border-green-500/30' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className={`p-6 rounded-lg border ${stat.color} backdrop-blur-sm`}
            >
              <p className="text-[#9CA3AF] text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-[#FAF8F4]">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-lg border border-slate-700 bg-slate-800/50"
        >
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F6B26B]"
            />
            <div className="flex gap-4 flex-wrap">
              {['all', 'admin', 'mentor', 'student'].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                    filterRole === role
                      ? 'bg-[#F6B26B] text-[#0E0F13]'
                      : 'border border-slate-600 text-[#FAF8F4] hover:bg-slate-700'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
              <button className="px-4 py-2 bg-[#F6B26B] text-[#0E0F13] rounded-lg hover:bg-orange-400 font-medium transition ml-auto">
                Add User
              </button>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/30"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Name</th>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Email</th>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Role</th>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Join Date</th>
                  <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.map((u, idx) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-700/50 transition"
                  >
                    <td className="px-6 py-4 text-[#FAF8F4]">{u.name}</td>
                    <td className="px-6 py-4 text-[#9CA3AF] text-sm">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}>
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.status === 'Active'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#9CA3AF] text-sm">{u.joinDate}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="text-[#F6B26B] hover:text-orange-300 font-medium transition text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Selected User Details */}
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-lg border border-slate-700 bg-slate-800/50"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#FAF8F4] mb-2">{selectedUser.name}</h2>
                <p className="text-[#9CA3AF]">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-[#9CA3AF] hover:text-[#FAF8F4] transition"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border ${getRoleColor(selectedUser.role)}`}>
                <p className="text-[#9CA3AF] text-sm mb-1">Role</p>
                <p className="text-lg font-bold">{selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                <p className="text-[#9CA3AF] text-sm mb-1">Status</p>
                <p className="text-lg font-bold text-[#FAF8F4]">{selectedUser.status}</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                <p className="text-[#9CA3AF] text-sm mb-1">Join Date</p>
                <p className="text-lg font-bold text-[#FAF8F4]">{selectedUser.joinDate}</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-700 bg-slate-700/30">
                <p className="text-[#9CA3AF] text-sm mb-1">ID</p>
                <p className="text-lg font-bold text-[#FAF8F4]">#{selectedUser.id}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-2 bg-[#F6B26B] text-[#0E0F13] rounded-lg hover:bg-orange-400 font-medium transition">
                Save Changes
              </button>
              <button className="px-6 py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 font-medium transition">
                Delete User
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default UsersPage
