"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileModal from "@/app/[locale]/(app)/profile/ProfileModal"; 
import { 
  LayoutDashboard, FolderGit2, LogOut, Zap, Flame, 
  Database, Bot, Menu, Loader2, Plus, 
  Sparkles, ChevronRight, BrainCircuit, Target,
  FileText, MonitorPlay, ArrowUpRight, Code2, BookOpen, Search, Layers, 
  Activity, Clock, Moon, Sun, X
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { locale } = useParams();

  // STATES
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. LOAD USER DATA
  useEffect(() => {
    const savedUser = localStorage.getItem("devSathiUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const initials = (parsed.name || "U").split(" ").map(n => n[0]).join("").toUpperCase();
        setUser({ ...parsed, initials });
      } catch (e) { console.error("Session error"); }
    } else {
      router.push(`/${locale}/signup`);
    }
    setLoading(false);
  }, [locale, router]);

  // 2. FORCE DARK MODE TOGGLE
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 3. LOGOUT TO HOME PAGE
  const handleLogout = () => {
    localStorage.removeItem("devSathiUser");
    router.push(`/${locale}`); // This takes you to the landing page
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 size={40} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-white text-slate-900'} transition-all duration-300 font-sans`}>
      
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} border-r border-slate-800 bg-[#0f172a] flex flex-col justify-between transition-all duration-300 shrink-0 z-50`}>
        <div>
          <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800">
             <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
                <Code2 size={18} className="text-white" />
             </div>
            {isSidebarOpen && <span className="text-xl font-bold tracking-tight text-white">DevSathi</span>}
          </div>
          <nav className="p-4 space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 shadow-sm">
              <LayoutDashboard size={18} /> 
              {isSidebarOpen && "Command Center"}
            </button>
            <button onClick={() => router.push(`/${locale}/vault`)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
              <FolderGit2 size={18} /> 
              {isSidebarOpen && "The Vault (S3)"}
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
              <Layers size={18} /> 
              {isSidebarOpen && "Achievements"}
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-slate-500 font-bold hover:text-red-500 transition-all rounded-xl">
            <LogOut size={18} /> 
            {isSidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* --- HEADER --- */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search..." className="bg-[#1e293b] border border-slate-700 rounded-lg py-1.5 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 text-white w-64 lg:w-96" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* THEME TOGGLE BUTTON */}
            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-indigo-400 transition-all">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} className="text-slate-600" />}
            </button>
            
            {/* ACCOUNT DROP DOWN */}
            <div className="relative">
              <button 
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs uppercase border border-slate-700 text-white hover:scale-105 transition-transform"
              >
                {user.initials}
              </button>
              
              {isAccountOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <button onClick={() => { setIsProfileModalOpen(true); setIsAccountOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                    <User size={14} /> My Profile
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- BODY --- */}
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8" onClick={() => setIsAccountOpen(false)}>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name} 👋</h1>
            <p className="text-slate-400 mt-1">Pick a mode and continue where you left off.</p>
          </div>
          
          {/* STAT BOXES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Flame size={14}/> Day Streak</div>
                <div className="text-2xl font-bold">{user.streak || 0} <span className="text-xs text-slate-500 font-medium">Days</span></div>
             </div>
             <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Activity size={14}/> Sessions</div>
                <div className="text-2xl font-bold">0 <span className="text-xs text-slate-500 font-medium">Total</span></div>
             </div>
             <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Clock size={14}/> Learning Focus</div>
                <div className="flex gap-1 mt-2">
                   {/* DYNAMIC FOCUS BARS */}
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className={`h-6 w-2 rounded-sm ${i <= 4 ? 'bg-indigo-500/60' : 'bg-slate-800'}`}></div>
                   ))}
                </div>
             </div>
             <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Database size={14}/> S3 Vault Used</div>
                <div className="text-2xl font-bold">{(user.s3Used || 0).toFixed(2)} <span className="text-xs text-slate-500 font-medium">GB</span></div>
             </div>
          </div>

          {/* WORKSPACE SELECTION CARDS */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Workspace Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { title: "Code & Build", sub: "3-Panel IDE with AI Editor.", icon: <Code2 className="text-indigo-400"/>, label: "3-PANEL MODE", color: "hover:border-indigo-500/50" },
                 { title: "Learn & Retain", sub: "4-Panel layout for tutorials.", icon: <BookOpen className="text-purple-400"/>, label: "4-PANEL MODE", color: "hover:border-purple-500/50" },
                 { title: "Insight & Research", sub: "5-Panel deep dive with PDFs.", icon: <Layers className="text-emerald-400"/>, label: "5-PANEL MODE", color: "hover:border-emerald-500/50" }
               ].map((mode, i) => (
                 <div key={i} className={`bg-[#0f172a] p-8 rounded-[24px] border border-slate-800 transition-all group cursor-pointer ${mode.color}`}>
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                       {mode.icon}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{mode.label}</span>
                    <h4 className="text-xl font-bold mt-1 text-white">{mode.title}</h4>
                    <p className="text-sm text-slate-500 mt-2">{mode.sub}</p>
                    <div className="mt-6 flex items-center gap-2 text-indigo-500 font-bold text-sm">
                       Launch Mode <ChevronRight size={16} />
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* RECENT PROJECTS & S3 DROP ZONE */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-10">
             <div className="lg:col-span-3 space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Recent Projects</h3>
                <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-10 text-center text-slate-500 text-sm">
                   No recent projects. Start by launching a workspace.
                </div>
             </div>
             
             <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Quick Drop (S3 Vault)</h3>
                <div className="bg-[#0f172a] border-2 border-dashed border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center group hover:border-indigo-500/50 transition-all cursor-pointer">
                   <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 text-indigo-500 group-hover:scale-110 transition-transform">
                      <Plus size={24} />
                   </div>
                   <p className="text-sm font-medium text-slate-300">Drag & drop PDFs or code files</p>
                   <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Amazon S3 Storage</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* MODAL IS HERE */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={user} />
    </div>
  );
}