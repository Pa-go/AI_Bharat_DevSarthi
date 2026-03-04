'use client'

import { useState } from 'react'
import { Award, AlertCircle, Trash2, Bell } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, category: 'achievement', message: '🔥 7 day streak achieved!', time: '2 hours ago', read: false },
    { id: 2, category: 'system', message: 'Code executed successfully!', time: '5 min ago', read: false },
    { id: 3, category: 'system', message: 'New resource uploaded', time: '1 hour ago', read: false },
    { id: 4, category: 'achievement', message: 'New milestone: 50 problems solved!', time: '3 hours ago', read: true },
  ])

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearAll = () => setNotifications([])

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* ── Page Header ── */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#f1f5f9' }}>
            Notifications
          </h1>
          <p className="mt-2 text-slate-400">
            Stay updated with your latest achievements and system alerts.
          </p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={clearAll}
            className="text-xs font-semibold text-slate-500 hover:text-red-400 transition-colors flex items-center gap-2 pb-1"
          >
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {/* ── Notifications List ── */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              className="group flex items-start gap-4 p-4 transition-all"
              style={{
                background: '#0f172a',
                borderRadius: '16px',
                border: '1px solid #1e293b',
                boxShadow: notif.read ? 'none' : 'inset 0 0 20px rgba(99,102,241,0.03)'
              }}
            >
              {/* Icon Status */}
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: notif.category === 'achievement' 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : 'rgba(99, 102, 241, 0.1)',
                  border: `1px solid ${notif.category === 'achievement' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`
                }}
              >
                {notif.category === 'achievement' ? 
                  <Award className="w-5 h-5 text-green-400" /> :
                  <AlertCircle className="w-5 h-5 text-indigo-400" />
                }
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>
                    {notif.message}
                  </p>
                  {!notif.read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  )}
                </div>
                <p className="text-xs mt-1 text-slate-500">
                  {notif.time}
                </p>
              </div>

              {/* Actions */}
              <button
                onClick={() => deleteNotification(notif.id)}
                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-500" />
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
              <Bell className="text-slate-700" size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">All caught up!</p>
            <p className="text-slate-600 text-xs">No new notifications to show.</p>
          </div>
        )}
      </div>
    </div>
  )
}