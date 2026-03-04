"use client";

import { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Cpu, 
  Database, 
  Globe, 
  Bell, 
  ShieldCheck, 
  ChevronRight,
  Save,
  Trash2
} from "lucide-react";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync with your existing theme logic
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
            <p className="text-slate-500 dark:text-slate-400">Configure your DevSathi experience and AWS resources.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar Tabs (UI Only for now) */}
          <div className="space-y-2">
            {[
              { id: 'gen', label: 'General', icon: <User size={18}/> },
              { id: 'ai', label: 'AI & Bedrock', icon: <Cpu size={18}/> },
              { id: 'storage', label: 'Storage (S3)', icon: <Database size={18}/> },
              { id: 'sec', label: 'Security', icon: <Lock size={18}/> },
              { id: 'lang', label: 'Language', icon: <Globe size={18}/> },
            ].map((tab) => (
              <button 
                key={tab.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  tab.id === 'ai' 
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                  : 'hover:bg-white dark:hover:bg-[#0f172a] text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content Area */}
          <div className="md:col-span-2 space-y-6">
            
            {/* AI Settings Section (The AWS Flex) */}
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Cpu size={20} className="text-indigo-500" /> AI Engine Configuration
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black tracking-widest text-slate-400 block mb-3 uppercase">Primary Model (Amazon Bedrock)</label>
                  <select className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500">
                    <option>Amazon Nova Pro (Optimized)</option>
                    <option>Anthropic Claude 3.5 Sonnet</option>
                    <option>Meta Llama 3 (Open Source)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-black tracking-widest text-slate-400 uppercase">Response Creativity (Temperature)</label>
                    <span className="text-xs font-bold text-indigo-500">0.7</span>
                  </div>
                  <input type="range" className="w-full accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20">
                  <div className="flex gap-3">
                    <Zap size={20} className="text-indigo-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">DynamoDB Semantic Caching</p>
                      <p className="text-xs text-slate-500">Skip LLM calls for identical queries to save costs.</p>
                    </div>
                  </div>
                  <div className="w-10 h-6 bg-indigo-500 rounded-full relative shadow-inner cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Section */}
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Database size={20} className="text-blue-500" /> S3 Vault Management
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold">Object Versioning</p>
                    <p className="text-xs text-slate-500">Keep history of code file changes.</p>
                  </div>
                  <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  <Trash2 size={16} /> Purge DynamoDB Cache
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button className="px-8 py-3 rounded-xl bg-indigo-500 text-white text-sm font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
                <Save size={18} /> Save Configuration
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}