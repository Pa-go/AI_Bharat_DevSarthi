"use client";

import { X, ShieldCheck, GraduationCap, Cloud, Database, Sparkles, Zap } from "lucide-react";

export default function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  // Convert "Tokens" into "AI Spark Credits" for the UI
  // If tokensUsed is 0, they have 100% credits left.
  const creditsUsed = user.tokensUsed || 0;
  const totalCredits = 100; // Let's say 100 credits per day
  const creditPercent = ((totalCredits - creditsUsed) / totalCredits) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 z-10"><X size={20} /></button>

        <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-10 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-3xl border-4 border-white dark:border-[#0f172a] shadow-xl">
                {getInitials(user.name)}
              </div>
              <div className="pb-1">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  {user.name} <ShieldCheck size={18} className="text-emerald-500" />
                </h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-xs font-bold rounded-full border border-indigo-500/20 mb-2 uppercase tracking-tighter">
              {user.tier || "Standard Member"}
            </span>
          </div>

          <div className="space-y-6">
            {/* 🎓 ACADEMIC INFO */}
            <div>
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 mb-3 flex items-center gap-2 uppercase">
                <GraduationCap size={14} /> Academic Profile
              </h3>
              <div className="bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
                <div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Institution</div>
                   <div className="text-sm font-medium">{user.university || "Not Provided"}</div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Course</div>
                   <div className="text-sm font-medium">{user.course || "General"}</div>
                </div>
              </div>
            </div>

            {/* ☁️ STORAGE & AI LIMITS */}
            <div>
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 mb-3 flex items-center gap-2 uppercase">
                <Cloud size={14} /> My Sathi Resources
              </h3>
              <div className="bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                
                {/* S3 Storage Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1.5">
                    <span className="flex items-center gap-1.5"><Database size={14} className="text-blue-500"/> Study Material Vault (S3)</span>
                    <span className="text-slate-500">{(user.s3Used || 0).toFixed(2)} GB / 5 GB</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${(user.s3Used / 5) * 100 || 0}%` }}></div>
                  </div>
                </div>

                {/* AI Credits Bar (Simplified Bedrock) */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1.5">
                    <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-purple-500"/> Daily AI Spark Credits</span>
                    <span className="text-slate-500">{totalCredits - creditsUsed} Left</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all duration-700" style={{ width: `${creditPercent}%` }}></div>
                  </div>
                </div>

              </div>
            </div>

            {/* 🚀 QUICK ACTION / STATUS */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-indigo-500/20 bg-white dark:bg-[#020617]">
                  <Zap size={18} className="text-indigo-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Active Session</div>
                  <div className="text-xs text-slate-500">Your AI workspace is ready for use.</div>
                </div>
              </div>
              <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-md uppercase">Connected</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}