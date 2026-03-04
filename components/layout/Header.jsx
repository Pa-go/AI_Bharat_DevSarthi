// components/layout/Header.jsx
'use client'
import { Code2, Bell, User, Search, Globe, Sun, Moon, Palette, Settings, LogOut, Flame, Award, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function Header() {
  const t = useTranslations('Header')
  const router = useRouter()
  const pathname = usePathname()
  
  // Extract current locale from pathname
  const getCurrentLocale = () => {
    const match = pathname.match(/^\/([a-z]{2})/)
    return match ? match[1] : 'en'
  }
  
  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale())
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickSettings, setShowQuickSettings] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  
  // ✅ THEME LOGIC - Working Dark Mode
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])
  
  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else if (newTheme === 'auto') {
      // Auto mode: check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }
  
  // ✅ REAL-TIME ACCOUNT DATA - Dynamic State
  const [userData, setUserData] = useState({
    name: 'Palak Goda',
    role: 'Learner',
    plan: 'Free Plan',
    streak: 7,
    projects: 12,
    problems: 48
  })
  
  // ✅ NOTIFICATIONS - Dynamic Data
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      category: 'achievement', 
      icon: Award,
      message: `🔥 ${userData.streak} day streak achieved!`, 
      time: '2 hours ago', 
      read: false 
    },
    { 
      id: 2, 
      category: 'system', 
      icon: AlertCircle,
      message: 'Code executed successfully!', 
      time: '5 min ago', 
      read: false 
    },
    { 
      id: 3, 
      category: 'system', 
      icon: AlertCircle,
      message: 'New resource uploaded', 
      time: '1 hour ago', 
      read: false 
    },
  ])

  const languages = [
    { code: 'en', nativeName: 'English' },
    { code: 'hi', nativeName: 'हिंदी' },
    { code: 'ta', nativeName: 'தமிழ்' },
    { code: 'te', nativeName: 'తెలుగు' },
    { code: 'bn', nativeName: 'বাংলা' },
    { code: 'mr', nativeName: 'मराठी' },
  ]

  // ✅ LANGUAGE PERSISTENCE - Correct Locale Switching
  const handleLanguageChange = (langCode) => {
    setCurrentLocale(langCode)
    // Remove old locale and add new one
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/workspace'
    router.push(`/${langCode}${pathWithoutLocale}`)
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const notificationsByCategory = {
    achievement: notifications.filter(n => n.category === 'achievement'),
    system: notifications.filter(n => n.category === 'system')
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false)
      setShowQuickSettings(false)
      setShowProfileDropdown(false)
    }

    if (showNotifications || showQuickSettings || showProfileDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showNotifications, showQuickSettings, showProfileDropdown])

  return (
    <header className="header h-16 flex items-center justify-between px-6 fixed top-0 w-full z-50 bg-white" style={{
      borderBottom: '1px solid var(--border-light)',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      {/* ✅ LEFT SECTION */}
      <div className="flex items-center" style={{ width: '240px', minWidth: '240px' }}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient flex items-center justify-center rounded-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-gradient">DevSathi</span>
            <div className="text-xs" style={{color: 'var(--text-secondary)'}}>
              {t('companion')}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CENTER SECTION - FORCED OVERLAP FIX */}
      <div className="flex-1 flex justify-center px-8">
        <div className="w-full" style={{ maxWidth: '600px' }}>
          <div className="relative flex items-center">
            {/* Forced Icon Position */}
            <Search 
              className="absolute left-3 w-4 h-4 pointer-events-none z-10" 
              style={{ color: '#94A3B8' }} 
            />
            {/* Forced Text Padding using paddingLeft: '40px' */}
            <input 
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full pr-4 py-2.5 text-sm rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
              style={{
                paddingLeft: '40px', 
                background: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                color: '#334155',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            />
          </div>
        </div>
      </div>

      {/* ✅ RIGHT SECTION */}
      <div className="flex items-center gap-2" style={{ width: '240px', minWidth: '240px', justifyContent: 'flex-end' }}>
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setShowNotifications(!showNotifications)
              setShowQuickSettings(false)
              setShowProfileDropdown(false)
            }}
            className="relative p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <Bell className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
            {unreadCount > 0 && (
              <span 
                className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-xs flex items-center justify-center font-bold text-white"
                style={{background: 'var(--action-error)', fontSize: '10px'}}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border overflow-hidden"
              style={{borderColor: 'var(--border-light)'}}
            >
              <div className="p-4 border-b flex items-center justify-between" style={{borderColor: 'var(--border-light)', background: 'var(--bg-canvas)'}}>
                <div>
                  <h3 className="font-bold text-base" style={{color: 'var(--text-dark)'}}>{t('notifications')}</h3>
                  <p className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>
                    {unreadCount} {t('unread')}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white transition"
                    style={{color: 'var(--brand-blue)'}}
                  >
                    {t('markAllRead')}
                  </button>
                )}
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                {Object.entries(notificationsByCategory).map(([category, items]) => (
                  items.length > 0 && (
                    <div key={category}>
                      <div className="px-4 py-2 sticky top-0 z-10" style={{background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-light)'}}>
                        <div className="flex items-center gap-2">
                          {category === 'achievement' ? 
                            <Award className="w-4 h-4" style={{color: 'var(--action-success)'}} /> :
                            <AlertCircle className="w-4 h-4" style={{color: 'var(--brand-blue)'}} />
                          }
                          <span className="text-xs font-bold uppercase tracking-wide" style={{color: 'var(--text-secondary)'}}>
                            {category}
                          </span>
                        </div>
                      </div>
                      {items.map(notif => (
                        <div 
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className="p-4 border-b hover:bg-gray-50 transition cursor-pointer"
                          style={{
                            borderColor: 'var(--border-light)',
                            background: notif.read ? 'white' : category === 'achievement' ? 'rgba(0, 200, 83, 0.02)' : 'rgba(26, 115, 232, 0.02)'
                          }}
                        >
                          <div className="flex gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.read ? 'opacity-0' : ''}`} 
                              style={{background: category === 'achievement' ? 'var(--action-success)' : 'var(--brand-blue)'}}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-1" style={{color: 'var(--text-primary)'}}>
                                {notif.message}
                              </p>
                              <p className="text-xs" style={{color: 'var(--text-tertiary)'}}>
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ))}
              </div>

              <div className="p-3 text-center border-t" style={{borderColor: 'var(--border-light)', background: 'var(--bg-canvas)'}}>
                <button 
                  onClick={() => {
                    router.push(`/${currentLocale}/notifications`)
                    setShowNotifications(false)
                  }}
                  className="text-sm font-medium hover:underline"
                  style={{color: 'var(--brand-blue)'}}
                >
                  {t('viewAll')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Settings */}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setShowQuickSettings(!showQuickSettings)
              setShowNotifications(false)
              setShowProfileDropdown(false)
            }}
            className="p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <Palette className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
          </button>

          {showQuickSettings && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border overflow-hidden"
              style={{borderColor: 'var(--border-light)'}}
            >
              <div className="p-4 border-b" style={{borderColor: 'var(--border-light)', background: 'var(--bg-canvas)'}}>
                <h3 className="font-bold text-base" style={{color: 'var(--text-dark)'}}>{t('quickSettings')}</h3>
                <p className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>
                  {t('themeAndLanguage')}
                </p>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <div className="text-xs font-bold mb-2" style={{color: 'var(--text-secondary)'}}>
                    {t('theme')}
                  </div>
                  <div className="flex gap-2">
                    {[
                      { id: 'light', icon: Sun, label: t('light') },
                      { id: 'dark', icon: Moon, label: t('dark') },
                      { id: 'auto', icon: Palette, label: t('auto') }
                    ].map(themeOption => (
                      <button
                        key={themeOption.id}
                        onClick={() => handleThemeChange(themeOption.id)}
                        className="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg transition-all"
                        style={{
                          background: theme === themeOption.id ? 'var(--brand-gradient)' : 'white',
                          color: theme === themeOption.id ? 'white' : 'var(--text-primary)',
                          border: theme === themeOption.id ? 'none' : '1px solid var(--border-light)'
                        }}
                      >
                        <themeOption.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{themeOption.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold mb-2" style={{color: 'var(--text-secondary)'}}>
                    {t('language')}
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg" style={{background: 'var(--bg-canvas)', border: '1px solid var(--border-light)'}}>
                    <Globe className="w-4 h-4 flex-shrink-0" style={{color: 'var(--brand-blue)'}} />
                    <select 
                      value={currentLocale}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="flex-1 bg-transparent text-sm focus:outline-none cursor-pointer font-medium"
                      style={{color: 'var(--text-primary)'}}
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.nativeName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3 border-t text-center" style={{borderColor: 'var(--border-light)', background: 'var(--bg-canvas)'}}>
                <button 
                  onClick={() => {
                    router.push(`/${currentLocale}/settings`)
                    setShowQuickSettings(false)
                  }}
                  className="text-sm font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                  style={{color: 'var(--brand-blue)'}}
                >
                  <Settings className="w-4 h-4" />
                  {t('openFullSettings')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setShowProfileDropdown(!showProfileDropdown)
              setShowNotifications(false)
              setShowQuickSettings(false)
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="w-8 h-8 bg-gradient rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>

          {showProfileDropdown && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border overflow-hidden"
              style={{borderColor: 'var(--border-light)'}}
            >
              <div className="p-5" style={{background: 'linear-gradient(135deg, rgba(26, 115, 232, 0.05) 0%, rgba(106, 27, 154, 0.05) 100%)'}}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg" style={{color: 'var(--text-dark)'}}>
                      {userData.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{
                        background: 'var(--brand-gradient)',
                        color: 'white'
                      }}>
                        {t('learner')}
                      </span>
                      <span className="text-xs" style={{color: 'var(--text-secondary)'}}>
                        {t('plan')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg" style={{background: 'white', border: '1px solid var(--border-light)'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold" style={{color: 'var(--text-dark)'}}>
                        {userData.streak} {t('dayStreak')}
                      </div>
                      <div className="text-xs" style={{color: 'var(--text-secondary)'}}>
                        {t('keepLearning')}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full overflow-hidden" style={{background: 'var(--bg-canvas)'}}>
                    <div className="h-full bg-gradient rounded-full" style={{width: `${(userData.streak / 10) * 100}%`}}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 border-b" style={{borderColor: 'var(--border-light)'}}>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{color: 'var(--brand-blue)'}}>{userData.projects}</div>
                  <div className="text-xs" style={{color: 'var(--text-secondary)'}}>{t('projects')}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{color: 'var(--brand-blue)'}}>{userData.problems}</div>
                  <div className="text-xs" style={{color: 'var(--text-secondary)'}}>{t('problems')}</div>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    router.push(`/${currentLocale}/settings`)
                    setShowProfileDropdown(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left"
                >
                  <Settings className="w-4 h-4" style={{color: 'var(--text-secondary)'}} />
                  <span className="text-sm font-medium" style={{color: 'var(--text-primary)'}}>
                    {t('accountSettings')}
                  </span>
                </button>
                <button
                  onClick={() => {
                    router.push(`/${currentLocale}/achievements`)
                    setShowProfileDropdown(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left"
                >
                  <Award className="w-4 h-4" style={{color: 'var(--text-secondary)'}} />
                  <span className="text-sm font-medium" style={{color: 'var(--text-primary)'}}>
                    {t('myAchievements')}
                  </span>
                </button>
              </div>

              <div className="p-3 border-t" style={{borderColor: 'var(--border-light)'}}>
                <button 
                  onClick={() => {
                    console.log('Sign out')
                  }}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 py-2 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  {t('signOut')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}