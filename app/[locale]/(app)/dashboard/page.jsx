"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import ProfileModal from "@/app/[locale]/(app)/profile/ProfileModal"; 
import { 
  LayoutDashboard, FolderGit2, LogOut, Zap, Flame, 
  Database, Bot, Menu, Loader2, Plus, 
  Sparkles, ChevronRight, BrainCircuit, Target,
  FileText, MonitorPlay, ArrowUpRight, Code2, BookOpen, Search, Layers, 
  Activity, Clock, Moon, Sun, X, Globe, User, GraduationCap
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { locale } = useParams();
  const pathname = usePathname();

  // STATES
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. SYNC THEME & LANGUAGE ON LOAD
  useEffect(() => {
    // Sync Theme
    const savedTheme = localStorage.getItem("devSathiTheme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load User
    const savedUser = localStorage.getItem("devSathiUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const initials = (parsed.name || "U").split(" ").map(n => n[0]).join("").toUpperCase();
        setUser({ ...parsed, initials, streak: 7, s3Used: 1.24 }); // Hardcoded for Demo Impact
      } catch (e) { console.error("Session error"); }
    } else {
      router.push(`/${locale}/signup`);
    }
    setLoading(false);
  }, [locale, router]);

  // 2. CONSISTENT THEME TOGGLE
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("devSathiTheme", newMode ? "dark" : "light");
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // 3. CONSISTENT LANGUAGE CHANGE
  const handleLangChange = (e) => {
    const newLocale = e.target.value;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleLogout = () => {
    localStorage.removeItem("devSathiUser");
    router.push(`/${locale}`);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 size={40} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'} transition-all duration-300 font-sans`}>
      
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} border-r ${isDarkMode ? 'border-slate-800 bg-[#0f172a]' : 'border-slate-200 bg-white'} flex flex-col justify-between transition-all duration-300 shrink-0 z-50`}>
        <div>
          <div className="h-20 flex items-center px-6 justify-between border-b border-slate-800/50">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                  <Code2 size={18} className="text-white" />
                </div>
                {isSidebarOpen && <span className="text-xl font-bold tracking-tight">DevSathi</span>}
             </div>
             {/* 🎯 FIXED: Toggle now lives in sidebar header */}
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-slate-800 rounded-md text-slate-500 transition-colors">
                <Menu size={18} />
             </button>
          </div>

          <nav className="p-4 space-y-1.5">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/10">
              <LayoutDashboard size={18} /> 
              {isSidebarOpen && "Command Center"}
            </button>
            <button onClick={() => router.push(`/${locale}/vault`)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/5 text-slate-500 hover:text-indigo-400 transition-all">
              <FolderGit2 size={18} /> 
              {isSidebarOpen && "The Vault (S3)"}
            </button>
            <button onClick={() => router.push(`/${locale}/syllabus`)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/5 text-slate-500 hover:text-indigo-400 transition-all">
              <GraduationCap size={18} /> 
              {isSidebarOpen && "MU Syllabus"}
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/5 text-slate-500 hover:text-indigo-400 transition-all">
              <Layers size={18} /> 
              {isSidebarOpen && "Achievements"}
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-slate-500 font-bold hover:text-red-500 transition-all rounded-xl hover:bg-red-500/5">
            <LogOut size={18} /> 
            {isSidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* --- HEADER --- */}
        <header className={`h-16 px-8 flex items-center justify-between border-b ${isDarkMode ? 'border-slate-800 bg-[#0f172a]/50' : 'border-slate-200 bg-white/80'} backdrop-blur-md sticky top-0 z-40`}>
          <div className="flex items-center gap-6">
            <div className="relative group">
              {/* 🎯 FIXED: Search bar icon and padding fixed */}
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search The Vault (MU PDFs)..." 
                className={`border rounded-xl py-2 pl-10 pr-4 text-xs outline-none transition-all w-64 lg:w-96 ${isDarkMode ? 'bg-[#1e293b] border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-100 border-slate-200 focus:border-indigo-500'}`} 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 🎯 FIXED: Language Dropdown added for sync */}
            <div className="relative flex items-center mr-2">
               <Globe size={14} className="absolute left-2.5 text-indigo-500" />
               <select 
                 value={locale} 
                 onChange={handleLangChange}
                 className={`text-[11px] font-bold pl-8 pr-2 py-1.5 rounded-lg border appearance-none outline-none cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
               >
                 <option value="en">EN</option>
                 <option value="hi">हि</option>
                 <option value="mr">मरा</option>
               </select>
            </div>

            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'}`}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs uppercase border-2 border-white/10 text-white shadow-lg hover:scale-105 transition-transform"
              >
                {user.initials}
              </button>
              
              {isAccountOpen && (
                <div className={`absolute right-0 mt-3 w-52 border rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 ${isDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="px-4 py-2 border-b border-slate-700/50 mb-1">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Student Pilot</p>
                     <p className="text-sm font-bold truncate">{user.email}</p>
                  </div>
                  <button onClick={() => { setIsProfileModalOpen(true); setIsAccountOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                    <User size={14} /> My Profile
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- BODY --- */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-10" onClick={() => setIsAccountOpen(false)}>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded uppercase tracking-widest">MU Active Pilot</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight">Vithal, {user.name} 👋</h1>
              <p className="text-slate-500 mt-1 font-medium">Your localized learning logic is ready.</p>
            </div>
            <button onClick={() => router.push(`/${locale}/workspace`)} className="ds-btn px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
               <Plus size={18}/> New Session
            </button>
          </div>
          
          {/* STAT BOXES (HARDCODED FOR DEMO IMPACT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: "Day Streak", val: "7", sub: "Days", icon: <Flame size={18}/>, color: "text-orange-500", bg: "bg-orange-500/10" },
               { label: "MU Syllabus", val: "62", sub: "% Covered", icon: <Target size={18}/>, color: "text-emerald-500", bg: "bg-emerald-500/10" },
               { label: "AI Tutoring", val: "14.5", sub: "Hours", icon: <Activity size={18}/>, color: "text-blue-500", bg: "bg-blue-500/10" },
               { label: "Vault Size", val: "1.24", sub: "GB", icon: <Database size={18}/>, color: "text-purple-500", bg: "bg-purple-500/10" }
             ].map((stat, i) => (
                <div key={i} className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                   <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                      {stat.icon}
                   </div>
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
                   <div className="text-3xl font-black">{stat.val} <span className="text-xs text-slate-500 font-bold">{stat.sub}</span></div>
                </div>
             ))}
          </div>

          {/* WORKSPACE SELECTION (3-PANEL STORY) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Adaptive 3-Panel Workspaces</h3>
               <span className="text-[10px] text-indigo-500 font-bold">22+ LANGUAGES ENABLED</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: "Code Lab", sub: "Optimized for Mumbai University Lab Manuals.", icon: <Code2 className="text-indigo-400"/>, label: "CONTEXT + LOGIC", color: "hover:border-indigo-500/50" },
                 { title: "Research Hub", sub: "Break down complex MU Syllabus PDFs.", icon: <BookOpen className="text-purple-400"/>, label: "ANALYSIS MODE", color: "hover:border-purple-500/50" },
                 { title: "Note Generator", sub: "Instant regional language study notes.", icon: <Layers className="text-emerald-400"/>, label: "REVISION MODE", color: "hover:border-emerald-500/50" }
               ].map((mode, i) => (
                 <div key={i} onClick={() => router.push(`/${locale}/workspace`)} className={`p-8 rounded-[2.5rem] border transition-all group cursor-pointer relative overflow-hidden ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'} ${mode.color}`}>
                    <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                       {mode.icon}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{mode.label}</span>
                    <h4 className="text-2xl font-black mt-1">{mode.title}</h4>
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed">{mode.sub}</p>
                    <div className="mt-8 flex items-center gap-2 text-indigo-500 font-black text-xs group-hover:gap-4 transition-all">
                       OPEN WORKSPACE <ArrowUpRight size={16} />
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* RECENT VAULT ACTIVITY (MU SYLLABUS FILES) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-10">
             <div className="lg:col-span-3 space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">The Vault: Recent MU PDFs</h3>
                <div className={`rounded-[2rem] border overflow-hidden ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                   {[
                     { name: "Computer_Networks_Sem6.pdf", size: "2.4 MB", date: "2 hours ago" },
                     { name: "Soft_Computing_Manual.pdf", size: "1.1 MB", date: "Yesterday" }
                   ].map((file, i) => (
                      <div key={i} className="p-5 border-b border-slate-800/50 flex items-center justify-between hover:bg-indigo-500/5 transition-colors cursor-pointer group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center">
                               <FileText size={20}/>
                            </div>
                            <div>
                               <p className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{file.name}</p>
                               <p className="text-[10px] text-slate-500 font-bold uppercase">{file.size} • {file.date}</p>
                            </div>
                         </div>
                         <ArrowUpRight size={18} className="text-slate-600 group-hover:text-indigo-500" />
                      </div>
                   ))}
                   <button className="w-full p-4 text-xs font-black text-slate-500 hover:text-indigo-500 transition-colors uppercase">View All Files</button>
                </div>
             </div>
             
             <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Quick Drop (S3)</h3>
                <div className={`border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center group transition-all cursor-pointer ${isDarkMode ? 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/40 hover:bg-indigo-500/5' : 'border-slate-200 bg-slate-50 hover:border-indigo-500/40'}`}>
                   <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 text-indigo-500 group-hover:scale-110 transition-transform shadow-xl shadow-indigo-500/10">
                      <Plus size={32} />
                   </div>
                   <p className="text-base font-black tracking-tight">Add to Vault</p>
                   <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">Supports PDFs & MU Syllabus</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={user} />
    </div>
  );
}