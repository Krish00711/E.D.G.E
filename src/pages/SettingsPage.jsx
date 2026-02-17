import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    systemName: 'E.D.G.E System',
    email: 'admin@edge.com',
    timezone: 'UTC',
    maintenanceMode: false,
    enableNotifications: true,
    enableML: true,
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const tabs = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '📢' },
    { id: 'api', label: 'API & Integrations', icon: '🔌' },
    { id: 'backup', label: 'Backup & Recovery', icon: '💾' },
  ]

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] pt-28 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-2">System Settings</h1>
          <p className="text-[#9CA3AF]">Configure system-wide settings and preferences</p>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex gap-4 border-b border-slate-700 overflow-x-auto"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 whitespace-nowrap font-medium transition ${
                activeTab === tab.id
                  ? 'text-[#F6B26B] border-b-2 border-[#F6B26B]'
                  : 'text-[#9CA3AF] hover:text-[#FAF8F4]'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
              <h2 className="text-xl font-bold text-[#FAF8F4] mb-6">General Configuration</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[#FAF8F4] font-medium mb-2">System Name</label>
                  <input
                    type="text"
                    value={settings.systemName}
                    onChange={(e) => handleSettingChange('systemName', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                  />
                </div>

                <div>
                  <label className="block text-[#FAF8F4] font-medium mb-2">System Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                  />
                </div>

                <div>
                  <label className="block text-[#FAF8F4] font-medium mb-2">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                  >
                    <option>UTC</option>
                    <option>EST</option>
                    <option>CST</option>
                    <option>MST</option>
                    <option>PST</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-600 bg-slate-900/50">
                  <div>
                    <p className="text-[#FAF8F4] font-medium">Maintenance Mode</p>
                    <p className="text-[#9CA3AF] text-sm">Disable user access for maintenance</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    className="w-6 h-6 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-600 bg-slate-900/50">
                  <div>
                    <p className="text-[#FAF8F4] font-medium">Enable ML Features</p>
                    <p className="text-[#9CA3AF] text-sm">Enable machine learning predictions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableML}
                    onChange={(e) => handleSettingChange('enableML', e.target.checked)}
                    className="w-6 h-6 cursor-pointer"
                  />
                </div>
              </div>

              <button className="mt-8 px-6 py-2 bg-[#F6B26B] text-[#0E0F13] rounded-lg hover:bg-orange-400 font-medium transition">
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
              <h2 className="text-xl font-bold text-[#FAF8F4] mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[#FAF8F4] font-medium mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-[#FAF8F4] focus:outline-none focus:border-[#F6B26B]"
                  />
                </div>

                <div>
                  <label className="block text-[#FAF8F4] font-medium mb-2">Password Policy</label>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-[#9CA3AF]">Require uppercase letters</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-[#9CA3AF]">Require numbers</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-[#9CA3AF]">Require special characters</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
                  <p className="text-red-300 font-medium mb-3">Danger Zone</p>
                  <button className="px-6 py-2 border border-red-600 text-red-400 rounded-lg hover:bg-red-500/10 font-medium transition">
                    Force Logout All Users
                  </button>
                </div>
              </div>

              <button className="mt-8 px-6 py-2 bg-[#F6B26B] text-[#0E0F13] rounded-lg hover:bg-orange-400 font-medium transition">
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
              <h2 className="text-xl font-bold text-[#FAF8F4] mb-6">Notification Settings</h2>
              
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Send email alerts for important events' },
                  { label: 'System Alerts', desc: 'Send alerts for system errors' },
                  { label: 'User Activity', desc: 'Notify on unusual user activity' },
                  { label: 'Risk Alerts', desc: 'Alert on high-risk student detection' },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between p-4 rounded-lg border border-slate-600 bg-slate-900/50 cursor-pointer">
                    <div>
                      <p className="text-[#FAF8F4] font-medium">{item.label}</p>
                      <p className="text-[#9CA3AF] text-sm">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-6 h-6" />
                  </label>
                ))}
              </div>

              <button className="mt-8 px-6 py-2 bg-[#F6B26B] text-[#0E0F13] rounded-lg hover:bg-orange-400 font-medium transition">
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {/* API & Integrations */}
        {activeTab === 'api' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
              <h2 className="text-xl font-bold text-[#FAF8F4] mb-6">API Keys & Integrations</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[#FAF8F4] font-medium mb-4">Active API Keys</p>
                  <div className="space-y-3">
                    {[
                      { name: 'Production API Key', created: '2025-01-15', lastUsed: '2 mins ago' },
                      { name: 'Development API Key', created: '2025-02-01', lastUsed: 'Never' },
                    ].map((key, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-slate-600 bg-slate-900/50 flex justify-between items-center">
                        <div>
                          <p className="text-[#FAF8F4]">{key.name}</p>
                          <p className="text-[#9CA3AF] text-sm">Created: {key.created} • Last used: {key.lastUsed}</p>
                        </div>
                        <button className="text-red-400 hover:text-red-300 font-medium transition">
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="px-6 py-2 bg-[#F6B26B] text-[#0E0F13] rounded-lg hover:bg-orange-400 font-medium transition">
                  Generate New API Key
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Backup & Recovery */}
        {activeTab === 'backup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
              <h2 className="text-xl font-bold text-[#FAF8F4] mb-6">Backup & Recovery</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[#FAF8F4] font-medium mb-4">Recent Backups</p>
                  <div className="space-y-3">
                    {[
                      { date: '2025-02-14 02:00 AM', size: '2.5 GB', status: 'Completed' },
                      { date: '2025-02-13 02:00 AM', size: '2.4 GB', status: 'Completed' },
                      { date: '2025-02-12 02:00 AM', size: '2.3 GB', status: 'Completed' },
                    ].map((backup, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-slate-600 bg-slate-900/50 flex justify-between items-center">
                        <div>
                          <p className="text-[#FAF8F4]">{backup.date}</p>
                          <p className="text-[#9CA3AF] text-sm">Size: {backup.size}</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="px-3 py-1 rounded text-sm bg-green-500/20 text-green-300">
                            {backup.status}
                          </span>
                          <button className="text-[#F6B26B] hover:text-orange-300 font-medium transition">
                            Restore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="px-6 py-2 bg-[#F6B26B] text-[#0E0F13] rounded-lg hover:bg-orange-400 font-medium transition">
                    Create Backup Now
                  </button>
                  <button className="px-6 py-2 border border-slate-600 text-[#FAF8F4] rounded-lg hover:bg-slate-700 font-medium transition">
                    Download Backup
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default SettingsPage
