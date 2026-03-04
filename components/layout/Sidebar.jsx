// components/layout/Sidebar.jsx
'use client'
import { Home, MessageSquare, BookOpen, Code, FolderKanban, Award, Settings, ChevronLeft, Plus, Maximize2, MessageCircle, GraduationCap, LayoutGrid } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Sidebar({ onToggle, layoutMode, onLayoutChange, panels, onPanelToggle }) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const getCurrentLocale = () => {
    const match = pathname.match(/^\/([a-z]{2})/)
    return match ? match[1] : 'en'
  }
  const locale = getCurrentLocale()

  const handleToggle = () => {
    const newState = !collapsed
    setCollapsed(newState)
    if (onToggle) onToggle(newState)
  }

  useEffect(() => {
    if (onToggle) onToggle(collapsed)
  }, [])

  const menuItems = [
    { icon: Home, label: 'Home', path: `/${locale}` },
    { icon: FolderKanban, label: 'My Projects', path: `/${locale}/workspace`, isSpecial: true },
    { icon: Award, label: 'Achievements', path: `/${locale}/achievements` },
    { icon: Settings, label: 'Settings', path: `/${locale}/settings` },
  ]

  const layoutModes = [
    { id: 'focus', icon: Maximize2, label: 'Focus Mode', desc: 'Code only' },
    { id: 'chat', icon: MessageCircle, label: 'Chat Mode', desc: 'AI + Notes' },
    { id: 'learn', icon: GraduationCap, label: 'Learn Mode', desc: 'Resources + AI' },
    { id: 'balanced', icon: LayoutGrid, label: 'Balanced', desc: 'All panels' }
  ]

  return (
    <aside 
      className="sidebar h-screen fixed left-0 top-16 transition-all duration-300 z-40 flex flex-col"
      style={{
        width: collapsed ? '80px' : '256px',
        background: '#0F172A', 
        borderRight: '1px solid rgba(255,255,255,0.1)',
        overflow: 'visible' 
      }}
    >
      <button 
        onClick={handleToggle}
        className="absolute -right-3 top-8 w-7 h-7 rounded-full flex items-center justify-center transition shadow-2xl z-[100]"
        style={{ 
          background: '#3B82F6', 
          color: 'white',
          border: '2px solid #0F172A',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' 
        }}
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* ✅ REMOVED flex-1 TO STOP AUTO-SPACING */}
      <div className="h-full overflow-y-auto overflow-x-hidden pt-6 pb-20 custom-scrollbar">
        
        {/* New Chat Button */}
        <div className="px-3 mb-8">
          <button 
            onClick={() => router.push(`/${locale}/workspace`)}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 px-4 py-3 rounded-xl transition-all font-bold shadow-lg`}
            style={{ 
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-xs tracking-wider">NEW CHAT</span>}
          </button>
        </div>

        {/* Layout Section */}
        {onLayoutChange && (
          <div className="px-3 mb-8">
            {!collapsed && <div className="text-[10px] font-black uppercase tracking-[2px] mb-4 px-3 text-slate-500">Workspace Layout</div>}
            <div className="space-y-2">
              {layoutModes.map(mode => {
                const isActive = layoutMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => onLayoutChange[mode.id]()}
                    className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive ? 'bg-blue-500/10 text-white' : 'text-slate-500'
                    }`}
                  >
                    <mode.icon className="w-5 h-5 flex-shrink-0" style={{ filter: isActive ? 'drop-shadow(0 0 5px rgba(96, 165, 250, 0.8))' : 'none' }} />
                    {!collapsed && (
                      <div className="flex-1 text-left">
                        <div className="text-sm font-bold">{mode.label}</div>
                        <div className="text-[10px] opacity-50 uppercase">{mode.desc}</div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Menu Section */}
        <div className="px-3 space-y-2">
          {!collapsed && <div className="text-[10px] font-black uppercase tracking-[2px] mb-4 px-3 text-slate-500">Navigation</div>}
          <nav>
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <div key={index} className="relative mb-2">
                  {isActive && (
                    <div 
                      className="absolute -left-3 top-1/2 -translate-y-1/2 w-[4px] h-10 rounded-r-full z-20"
                      style={{ background: '#60A5FA', boxShadow: '0 0 15px #3B82F6' }}
                    ></div>
                  )}
                  <button
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-4 px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'text-white font-bold bg-white/5' : 'text-slate-500'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm font-bold">{item.label}</span>}
                  </button>
                </div>
              )
            })}
          </nav>
        </div>

        {/* ✅ STREAK CARD: Fixed margin-top for a tighter look */}
        {!collapsed && (
          <div className="px-3 mt-6">
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-white/10 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-orange-500/20 ring-1 ring-orange-500/50">🔥</div>
                <div>
                  <div className="text-[11px] font-black text-white tracking-widest uppercase">7 Day Streak</div>
                  <div className="text-[10px] text-orange-400 font-bold uppercase tracking-tighter">Consistent Learner</div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}