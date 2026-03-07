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
  const { locale: urlLocale } = useParams();
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLang, setCurrentLang] = useState(urlLocale);

  useEffect(() => {
    setIsMounted(true);
    
    // 🔍 PERSISTENCE SYNC
    const savedLang = localStorage.getItem("sathi_lang");
    if (savedLang && savedLang !== urlLocale) {
      setCurrentLang(savedLang);
      router.push(pathname.replace(`/${urlLocale}`, `/${savedLang}`));
    }

    const savedTheme = localStorage.getItem("devSathiTheme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const savedUser = localStorage.getItem("devSathiUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({ ...parsed, initials: "P", streak: 7, s3Used: 1.24 });
    } else {
      router.push(`/${urlLocale}/signup`);
    }
    setLoading(false);
  }, [urlLocale, pathname, router]);

  const handleLangChange = (e) => {
    const newLocale = e.target.value;
    localStorage.setItem("sathi_lang", newLocale);
    router.push(pathname.replace(`/${urlLocale}`, `/${newLocale}`));
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("devSathiTheme", newMode ? "dark" : "light");
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  if (!isMounted || loading || !user) return <div className="min-h-screen flex items-center justify-center bg-[#020617]"><Loader2 size={40} className="animate-spin text-indigo-500" /></div>;

  return (
    <div translate="no" className={`min-h-screen flex ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'} transition-all duration-300 font-sans`}>
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} border-r ${isDarkMode ? 'border-slate-800 bg-[#0f172a]' : 'border-slate-200 bg-white'} flex flex-col justify-between transition-all duration-300 shrink-0 z-50`}>
        <div>
          <div className="h-16 flex items-center px-6 justify-center border-b border-slate-800/50">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-indigo-500/10 rounded-lg text-slate-400 transition-colors"><Menu size={20} /></button>
          </div>
          <nav className="p-4 space-y-1.5">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/10"><LayoutDashboard size={18} /> {isSidebarOpen && "Command Center"}</button>
            <button onClick={() => router.push(`/${urlLocale}/vault`)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/5 text-slate-500 transition-all"><FolderGit2 size={18} /> {isSidebarOpen && "The Vault (S3)"}</button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800/50">
          <button onClick={() => { localStorage.removeItem("devSathiUser"); router.push(`/${urlLocale}`); }} className="w-full flex items-center gap-3 p-3 text-slate-500 font-bold hover:text-red-500 transition-all rounded-xl hover:bg-red-500/5"><LogOut size={18} /> {isSidebarOpen && "Sign Out"}</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className={`h-16 px-8 flex items-center justify-between border-b ${isDarkMode ? 'border-slate-800 bg-[#0f172a]/50' : 'border-slate-200 bg-white/80'} backdrop-blur-md sticky top-0 z-40`}>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20"><Code2 size={18} className="text-white" /></div><span className="text-xl font-black tracking-tight hidden md:block">DevSathi</span></div>
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search The Vault (MU PDFs)..." style={{ paddingLeft: '48px' }} className={`border rounded-2xl py-2.5 pr-4 text-sm outline-none transition-all w-64 lg:w-[400px] ${isDarkMode ? 'bg-[#1e293b] border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-100 border-slate-200 focus:border-indigo-500'}`} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center shrink-0">
               <Globe size={16} className="absolute left-4 text-indigo-500 pointer-events-none z-10" />
               <select value={currentLang} onChange={handleLangChange} style={{ paddingLeft: '44px' }} className={`text-xs font-bold pr-10 py-2.5 rounded-xl border appearance-none outline-none cursor-pointer min-w-[140px] ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option></select>
               <ChevronRight size={14} className="absolute right-3 rotate-90 text-slate-500 pointer-events-none" />
            </div>
            <button onClick={toggleTheme} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'}`}><Zap size={20} fill={isDarkMode ? "currentColor" : "none"} /></button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xs uppercase border-2 border-white/10 text-white shadow-lg">{user.initials}</div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto w-full space-y-10">
          <div className="flex items-end justify-between">
            <div><div className="flex items-center gap-2 mb-1"><span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded uppercase tracking-widest">MU Active Pilot</span></div><h1 className="text-4xl font-black tracking-tight">Namaste, {user.name} 👋</h1><p className="text-slate-500 mt-1 font-medium">Your localized learning logic is ready.</p></div>
            <button onClick={() => router.push(`/${currentLang}/workspace`)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"><Plus size={18}/> New Session</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {[ { label: "Day Streak", val: "7", sub: "Days", icon: <Flame size={18}/>, color: "text-orange-500", bg: "bg-orange-500/10" }, { label: "MU Syllabus", val: "62", sub: "% Covered", icon: <Target size={18}/>, color: "text-emerald-500", bg: "bg-emerald-500/10" }, { label: "AI Tutoring", val: "14.5", sub: "Hours", icon: <Activity size={18}/>, color: "text-blue-500", bg: "bg-blue-500/10" }, { label: "Vault Size", val: "1.24", sub: "GB", icon: <Database size={18}/>, color: "text-purple-500", bg: "bg-purple-500/10" } ].map((stat, i) => (
                <div key={i} className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}><div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>{stat.icon}</div><div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div><div className="text-3xl font-black">{stat.val} <span className="text-xs text-slate-500 font-bold">{stat.sub}</span></div></div>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
}