import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const location = useLocation()
  const { scrollYProgress } = useScroll()
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const isHomePage = location.pathname === '/'

  const navBackgroundScroll = useTransform(
    scrollYProgress,
    [0, 0.1, 0.5, 0.8],
    [
      'rgba(14, 15, 19, 0)',
      'rgba(14, 15, 19, 0.8)',
      'rgba(62, 65, 72, 0.9)',
      'rgba(244, 241, 236, 0.95)'
    ]
  )

  const textColorScroll = useTransform(
    scrollYProgress,
    [0, 0.7, 0.8],
    ['#F4F1EC', '#F4F1EC', '#16181D']
  )

  const borderColorScroll = useTransform(
    scrollYProgress,
    [0, 0.1, 0.8],
    ['rgba(244, 241, 236, 0)', 'rgba(244, 241, 236, 0.1)', 'rgba(22, 24, 29, 0.1)']
  )

  const navBackground = isHomePage ? navBackgroundScroll : 'rgba(14, 15, 19, 0.95)'
  const textColor = isHomePage ? textColorScroll : '#F4F1EC'
  const borderColor = isHomePage ? borderColorScroll : 'rgba(244, 241, 236, 0.1)'

  const publicItems = [
    { label: 'Home', href: '/' },
    { label: 'Architecture', href: '/architecture' },
    { label: 'Intelligence', href: '/intelligence' },
    { label: 'Team', href: '/team' }
  ]

  const navMenus = user ? (
    user.role === 'admin' ? [
      { label: 'Admin Dashboard', href: '/dashboard' },
      {
        label: 'Management',
        dropdown: [
          { label: 'Students', href: '/students' },
          { label: 'Courses', href: '/courses' },
          { label: 'Instructors', href: '/instructor-dashboard' },
          { label: 'Users', href: '/users' }
        ]
      },
      {
        label: 'Analytics & Reports',
        dropdown: [
          { label: 'System Analytics', href: '/advanced-analytics' },
          { label: 'Risk Dashboard', href: '/ml-dashboard' },
          { label: 'ML Insights', href: '/insights' },
          { label: 'Reports', href: '/reports' }
        ]
      },
      {
        label: 'Admin Tools',
        dropdown: [
          { label: 'Bulk Import', href: '/bulk-import' },
          { label: 'Data Management', href: '/activity' },
          { label: 'Notifications', href: '/notifications' },
          { label: 'Settings', href: '/settings' }
        ]
      }
    ] : user.role === 'mentor' ? [
      { label: 'Instructor Dashboard', href: '/instructor-dashboard' },
      {
        label: 'My Classes',
        dropdown: [
          { label: 'Courses', href: '/courses' },
          { label: 'Assignments', href: '/assignments' },
          { label: 'Grades', href: '/grades' },
          { label: 'Attendance', href: '/attendance' }
        ]
      },
      {
        label: 'Student Analytics',
        dropdown: [
          { label: 'Class Analytics', href: '/analytics' },
          { label: 'Risk Assessment', href: '/ml-dashboard' },
          { label: 'Student Insights', href: '/insights' },
          { label: 'Reports', href: '/reports' }
        ]
      },
      {
        label: 'Interventions',
        dropdown: [
          { label: 'At-Risk Students', href: '/recovery' },
          { label: 'Recommendations', href: '/cognitive-load' },
          { label: 'Communications', href: '/messages' },
          { label: 'Resources', href: '/resources' }
        ]
      },
      {
        label: 'More',
        dropdown: [
          { label: 'Forums', href: '/forums' },
          { label: 'Self Reports', href: '/self-reports' },
          { label: 'Notifications', href: '/notifications' },
          { label: 'Bulk Import', href: '/bulk-import' }
        ]
      }
    ] : [
      // Student navigation
      { label: 'Dashboard', href: '/dashboard' },
      {
        label: 'Analytics',
        dropdown: [
          { label: 'ML Models', href: '/ml-dashboard' },
          { label: 'Reports', href: '/reports' },
          { label: 'Analytics', href: '/analytics' },
          { label: 'Personal Insights', href: '/insights' }
        ]
      },
      {
        label: 'Academic',
        dropdown: [
          { label: 'Courses', href: '/courses' },
          { label: 'Assignments', href: '/assignments' },
          { label: 'Grades', href: '/grades' },
          { label: 'Attendance', href: '/attendance' }
        ]
      },
      {
        label: 'Wellbeing',
        dropdown: [
          { label: 'Cognitive Load', href: '/cognitive-load' },
          { label: 'Recovery', href: '/recovery' },
          { label: 'Self Reports', href: '/self-reports' }
        ]
      },
      {
        label: 'Community',
        dropdown: [
          { label: 'Forums', href: '/forums' },
          { label: 'Resources', href: '/resources' },
          { label: 'Messages', href: '/messages' }
        ]
      }
    ]
  ) : publicItems

  return (
    <motion.nav
      style={{ 
        backgroundColor: navBackground,
        borderBottomColor: borderColor
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              style={{ color: textColor }}
              className="font-display text-xl tracking-wider hover:opacity-80 transition-opacity cursor-pointer"
            >
              EDGE
            </motion.div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {navMenus.map((item, index) => (
                <motion.li 
                  key={index}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setOpenDropdown(index)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.dropdown ? (
                    <>
                      <motion.div
                        style={{ color: textColor }}
                        className="font-body text-sm hover:opacity-70 transition-opacity cursor-pointer flex items-center gap-1"
                      >
                        {item.label}
                        <span className="text-xs">▾</span>
                      </motion.div>
                      {openDropdown === index && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 mt-2 bg-[#1A1C21] border border-[#2A2C31] rounded-lg shadow-xl min-w-[200px] py-2 z-50"
                        >
                          {item.dropdown.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.href}
                              className="block px-4 py-2 text-[#FAF8F4] text-sm hover:bg-[#F6B26B] hover:text-[#0E0F13] transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <Link to={item.href}>
                      <motion.div
                        style={{ color: textColor }}
                        className={`font-body text-sm hover:opacity-70 transition-opacity ${
                          location.pathname === item.href ? 'opacity-100 font-medium' : ''
                        }`}
                      >
                        {item.label}
                      </motion.div>
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>

            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <motion.div
                  style={{ color: textColor }}
                  className="text-sm"
                >
                  {user.name}
                </motion.div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] text-sm font-semibold rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login">
                  <motion.button
                    style={{ color: textColor }}
                    className="px-4 py-2 text-sm font-medium hover:opacity-70 transition-opacity"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 bg-[#F6B26B] hover:bg-[#E69138] text-[#0E0F13] text-sm font-semibold rounded transition-colors">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          <motion.button
            style={{ color: textColor }}
            className="lg:hidden p-2"
            aria-label="Menu"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {showMenu ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="lg:hidden mt-4"
          >
            <ul className="flex flex-col gap-3">
              {navMenus.map((item, index) => (
                <li key={index}>
                  {item.dropdown ? (
                    <>
                      <div className="text-[#FAF8F4] text-sm font-semibold mb-2">{item.label}</div>
                      <ul className="pl-4 space-y-2">
                        {item.dropdown.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.href}
                              onClick={() => setShowMenu(false)}
                              className="block text-[#9CA3AF] text-sm hover:text-[#FAF8F4] transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setShowMenu(false)}
                      className="block text-[#FAF8F4] text-sm hover:text-[#F6B26B] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              {!user && (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setShowMenu(false)}
                      className="block text-[#FAF8F4] text-sm hover:text-[#F6B26B] transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      onClick={() => setShowMenu(false)}
                      className="block text-[#FAF8F4] text-sm hover:text-[#F6B26B] transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <li>
                  <button
                    onClick={() => {
                      logout()
                      setShowMenu(false)
                    }}
                    className="text-[#FAF8F4] text-sm hover:text-[#F6B26B] transition-colors"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
