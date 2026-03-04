'use client'
import { useState } from 'react'
import { Award, Flame, TrendingUp, Code } from 'lucide-react'

export default function AchievementsPage() {
  // We no longer need sidebarCollapsed state here because the Layout handles the margin!

  const achievements = [
    { icon: Flame, title: '7 Day Streak', description: 'Learned for 7 days straight', unlocked: true },
    { icon: Code, title: 'First Code', description: 'Ran your first program', unlocked: true },
    { icon: TrendingUp, title: '50 Problems', description: 'Solved 50 coding problems', unlocked: true },
    { icon: Award, title: '100 Problems', description: 'Solved 100 coding problems', unlocked: false },
  ]

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-dark, #f1f5f9)' }}>
          Achievements
        </h1>
        <p className="mt-2 text-slate-400">
          Your milestones and progress on the path to mastery.
        </p>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, idx) => (
          <div
            key={idx}
            className="transition-all duration-300 hover:translate-y-[-2px]"
            style={{
              opacity: achievement.unlocked ? 1 : 0.5,
              background: '#0f172a', // Matches your Dashboard bg1
              borderRadius: '16px',
              border: '1px solid #1e293b',
              padding: '24px',
              boxShadow: achievement.unlocked ? '0 10px 30px -10px rgba(99,102,241,0.2)' : 'none'
            }}
          >
            <div className="flex items-center gap-5">
              {/* Icon Circle */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: achievement.unlocked 
                    ? 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' 
                    : '#1e293b' 
                }}
              >
                <achievement.icon className="w-7 h-7 text-white" />
              </div>

              {/* Text */}
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#f1f5f9' }}>
                  {achievement.title}
                </h3>
                <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
                  {achievement.description}
                </p>
                
                {achievement.unlocked ? (
                  <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Locked
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}