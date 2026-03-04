"use client";

import { X, ShieldCheck, GraduationCap, Cloud, Github, Database, Cpu } from "lucide-react";

export default function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  // Initials from whatever name exists
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  // Safe Math for progress bars
  const s3Used = user.s3Used || 0;
  const s3Total = user.s3Total || 5;
  const tokensUsed = user.tokensUsed || 0;
  const tokensTotal = user.tokensTotal || 100;

  const s3Percent = (s3Used / s3Total) * 100;
  const bedrockPercent = (tokensUsed / tokensTotal) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors z-10">
          <X size={20} />
        </button>

        <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-10 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-3xl border-4 border-white dark:border-[#0f172a] shadow-xl">
                {getInitials(user.name)}
              </div>
              <div className="pb-1">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {user.name} <ShieldCheck size={18} className="text-emerald-500" />
                </h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-xs font-bold rounded-full border border-indigo-500/20 mb-2">
              {user.tier || "Free Tier"}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <GraduationCap size={14} /> ACADEMIC CONTEXT
              </h3>
              <div className="bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">University</div>
                  <div className="text-sm font-medium">{user.university}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Course</div>
                  <div className="text-sm font-medium">{user.course || "Not set"}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <Cloud size={14} /> CLOUD RESOURCES (AWS)
              </h3>
              <div className="bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1.5">
                    <span className="flex items-center gap-1.5"><Database size={14} className="text-blue-500"/> S3 Vault</span>
                    <span className="text-slate-500">{s3Used} GB / {s3Total} GB</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${s3Percent}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1.5">
                    <span className="flex items-center gap-1.5"><Cpu size={14} className="text-purple-500"/> AI Tokens</span>
                    <span className="text-slate-500">{tokensUsed}k / {tokensTotal}k</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-500 h-full" style={{ width: `${bedrockPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ DYNAMIC GITHUB SECTION */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
              <div className="flex items-center gap-3">
                <Github size={18} />
                <div>
                  <div className="text-sm font-bold">GitHub Connection</div>
                  <div className="text-xs text-slate-500">
                    {user.githubLinked ? user.githubRepo : "Account Not Linked"}
                  </div>
                </div>
              </div>
              <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${user.githubLinked ? 'bg-slate-100 text-slate-600' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}>
                {user.githubLinked ? "Manage" : "Connect"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}