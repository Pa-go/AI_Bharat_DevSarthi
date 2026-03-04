"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  FileText, MessageSquare, Code2, ChevronLeft, Send, Zap, Sparkles, Play, Video,
  Files, Search, GitBranch, X, ChevronDown, ChevronRight, 
  Loader2, FilePlus, FolderPlus, RotateCw, Trash2, Edit3, History, CheckCircle2
} from "lucide-react";

export default function WorkspacePage() {
  const { locale } = useParams();
  const router = useRouter();
  
  // UI States
  const [showExplorer, setShowExplorer] = useState(true);
  const [activeTab, setActiveTab] = useState("files"); 
  const [menu, setMenu] = useState(null); 
  const [openFolders, setOpenFolders] = useState(new Set()); 
  
  // Data States
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [activeFileName, setActiveFileName] = useState("untitled.js");
  const [code, setCode] = useState(`// DevSathi Pro IDE Ready\n// S3 Cloud Sync Active.\n\nfunction welcomeSathi() {\n  console.log("Welcome to your AI workspace");\n}`);

  // Sidebar Toggle Logic
  const handleTabClick = (tab) => {
    if (activeTab === tab && showExplorer) {
      setShowExplorer(false); 
    } else {
      setActiveTab(tab);
      setShowExplorer(true); 
    }
  };

  // --- S3 LOGIC (LOCKED) ---
  const buildFileTree = (s3Files) => {
    const root = [];
    s3Files.forEach(file => {
      const fullPath = file.key || file.name; 
      if (!fullPath) return;
      const isActuallyAFolder = fullPath.endsWith('/');
      const parts = fullPath.split('/').filter(Boolean);
      let currentLevel = root;
      parts.forEach((part, index) => {
        const isLastPart = index === parts.length - 1;
        const nodeType = (!isLastPart || isActuallyAFolder) ? 'folder' : (part.toLowerCase().endsWith('.pdf') ? 'pdf' : 'code');
        const nodeId = parts.slice(0, index + 1).join('/') + (nodeType === 'folder' ? '/' : '');
        let existing = currentLevel.find(v => v.name === part && v.type === nodeType);
        if (!existing) {
          existing = { id: nodeId, name: part, key: nodeId, type: nodeType, children: [] };
          currentLevel.push(existing);
        }
        currentLevel = existing.children;
      });
    });
    return root;
  };

  const syncWithS3 = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/s3/files');
      const data = await res.json();
      if (data.files) setFiles(buildFileTree(data.files));
    } catch (err) {
      console.error("S3 Sync Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (isFolder) => {
    const parentPath = menu?.target?.type === 'folder' ? menu.target.key : "";
    const name = prompt(`Enter ${isFolder ? 'folder' : 'file'} name:`);
    if (!name) return;
    const newKey = parentPath + (isFolder ? (name.endsWith('/') ? name : `${name}/`) : name);
    setIsLoading(true);
    try {
      await fetch('/api/s3/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: newKey })
      });
      setTimeout(() => syncWithS3(), 1200); 
    } catch (err) {
      alert("Creation Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async () => {
    if (!menu?.target) return;
    const targetKey = menu.target.key;
    if (!confirm(`Delete ${menu.target.name}?`)) return;
    const removeNode = (nodes) => nodes.filter(node => node.key !== targetKey).map(node => ({ ...node, children: removeNode(node.children) }));
    setFiles(prev => removeNode(prev));
    setIsLoading(true);
    try {
      await fetch('/api/s3/files', { method: 'DELETE', body: JSON.stringify({ key: targetKey }) });
    } catch (err) { syncWithS3(); } finally { setIsLoading(false); }
  };

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return [];
    const searchTree = (nodes) => {
      let results = [];
      nodes.forEach(node => {
        if (node.name.toLowerCase().includes(searchQuery.toLowerCase()) && node.type !== 'folder') results.push(node);
        if (node.children) results = [...results, ...searchTree(node.children)];
      });
      return results;
    };
    return searchTree(files);
  }, [searchQuery, files]);

  useEffect(() => {
    syncWithS3();
    const closeMenu = () => setMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const toggleFolder = (id) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderSidebarContent = () => {
    switch (activeTab) {
      case "files":
        return (
          <>
            <div className="h-9 px-4 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest bg-black/10">
              Explorer
              {/* 🟢 REFRESH BUTTON MOVED HERE ALONGSIDE CREATE ICONS */}
              <div className="flex gap-2.5">
                <FilePlus size={14} className="hover:text-white cursor-pointer transition-colors" onClick={() => handleCreate(false)}/>
                <FolderPlus size={14} className="hover:text-white cursor-pointer transition-colors" onClick={() => handleCreate(true)}/>
                <RotateCw 
                  size={14} 
                  className={`hover:text-white cursor-pointer transition-colors ${isLoading ? 'animate-spin text-indigo-400' : ''}`} 
                  onClick={syncWithS3}
                />
              </div>
            </div>
            <div className="mt-2 flex-1 overflow-y-auto no-scrollbar">
              {files.map(node => renderTreeNode(node))}
            </div>
          </>
        );
      case "search":
        return (
          <div className="p-4">
            <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Global Search</div>
            <div className="relative group flex items-center">
              <div className="absolute left-3 z-10 pointer-events-none">
                <Search className="text-slate-500 group-focus-within:text-indigo-500" size={14} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..." 
                style={{ paddingLeft: '40px' }}
                className="w-full bg-black/40 border border-slate-800 rounded-md py-2.5 pr-4 text-[11px] outline-none focus:border-indigo-500 text-slate-200 placeholder:text-slate-600 shadow-inner" 
              />
            </div>
            <div className="mt-4 space-y-1">
              {filteredFiles.map(file => (
                <div key={file.id} onClick={() => {setActiveFileName(file.name); handleTabClick('files');}} className="p-2 hover:bg-white/5 cursor-pointer rounded flex items-center gap-2 text-[11px] text-slate-400">
                  <FileText size={12}/> <span className="truncate">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "git":
        return (
          <div className="p-4">
            <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Source Control</div>
            <div className="bg-white/5 border border-slate-800 rounded-lg p-4 text-[10px] text-slate-500">
                <CheckCircle2 size={14} className="text-emerald-400 mb-2"/>
                S3 Versioning Active. Changes are auto-versioned.
            </div>
          </div>
        );
      case "ai":
        return (
          <div className="p-4">
            <div className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">AI Command Center</div>
            <button onClick={() => setIsLoading(true)} className="w-full bg-indigo-600/10 border border-indigo-500/30 rounded-lg p-4 text-left hover:bg-indigo-600/20 transition-all group">
              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-300 group-hover:text-white"><Sparkles size={14} className="animate-pulse" /> Refactor Code</div>
            </button>
          </div>
        );
      default: return null;
    }
  };

  const renderTreeNode = (node) => (
    <div key={node.id}>
      <div 
        onContextMenu={(e) => handleContextMenu(e, node)}
        onClick={() => node.type === 'folder' ? toggleFolder(node.id) : setActiveFileName(node.name)}
        className={`px-4 py-1.5 flex items-center gap-2 text-[11px] cursor-pointer transition-all ${activeFileName === node.name && node.type !== 'folder' ? 'bg-indigo-600/30 text-white border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5'}`}
      >
        {node.type === 'folder' ? (openFolders.has(node.id) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>) : null}
        {node.type === 'pdf' ? <FileText size={12} className="text-red-400"/> : 
         node.type === 'folder' ? <FolderPlus size={12} className="text-indigo-400"/> : <Code2 size={12} className="text-blue-400"/>}
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === 'folder' && openFolders.has(node.id) && (
        <div className="ml-4 border-l border-slate-800/40">{node.children.map(child => renderTreeNode(child))}</div>
      )}
    </div>
  );

  const handleContextMenu = (e, item = null) => {
    e.preventDefault(); e.stopPropagation();
    setMenu({ x: e.pageX, y: e.pageY, target: item });
  };

  return (
    <div className="h-screen bg-[#020617] text-slate-200 flex flex-col overflow-hidden font-sans select-none" style={{ backgroundColor: '#020617' }}>
      
      {/* CONTEXT MENU */}
      {menu && (
        <div className="fixed z-[1000] bg-[#1e1e1e] border border-slate-700 shadow-2xl rounded-md py-1 w-48" style={{ top: menu.y, left: menu.x }}>
          <button onClick={() => handleCreate(false)} className="w-full text-left px-3 py-2 text-[11px] hover:bg-indigo-600 flex items-center gap-2"><FilePlus size={14}/> New File</button>
          <button onClick={() => handleCreate(true)} className="w-full text-left px-3 py-2 text-[11px] hover:bg-indigo-600 flex items-center gap-2"><FolderPlus size={14}/> New Folder</button>
          {menu.target && (
            <button onClick={deleteItem} className="w-full text-left px-3 py-2 text-[11px] hover:bg-red-600 flex items-center gap-2 text-red-400 mt-1 border-t border-slate-800"><Trash2 size={14}/> Delete</button>
          )}
        </div>
      )}

      {/* TOP HEADER (REFRESH REMOVED FROM HERE) */}
      <header className="h-12 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a] shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1 hover:bg-slate-800 rounded text-slate-400 transition-colors"><ChevronLeft size={18} /></button>
          <div className="flex items-center gap-2 font-black text-[10px] tracking-widest uppercase opacity-80"><Zap size={14} className="text-indigo-500" fill="currentColor"/> Sathi IDE</div>
        </div>
        <div className="flex items-center gap-4">
           {isLoading && <Loader2 size={14} className="animate-spin text-indigo-400"/>}
           <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" />
        </div>
      </header>

      <main className="flex-1 flex gap-0.5 p-0.5 bg-black overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="w-[35%] bg-[#0f172a] flex items-center justify-center opacity-10 font-black text-[10px] uppercase tracking-widest">Source_Reader</div>
        <div className="w-[25%] bg-[#111827] flex items-center justify-center opacity-10 font-black text-[10px] uppercase tracking-widest">Companion_AI</div>

        <div className="flex-1 min-w-0 bg-[#1e1e1e] flex flex-row overflow-hidden relative" style={{ backgroundColor: '#1e1e1e' }}>
          
          <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-6 text-slate-500 border-r border-black/20 shrink-0">
             <Files size={20} className={activeTab === 'files' && showExplorer ? 'text-white' : 'hover:text-slate-300'} onClick={() => handleTabClick('files')}/>
             <Search size={20} className={activeTab === 'search' && showExplorer ? 'text-white' : 'hover:text-slate-300'} onClick={() => handleTabClick('search')}/>
             <GitBranch size={20} className={activeTab === 'git' && showExplorer ? 'text-white' : 'hover:text-slate-300'} onClick={() => handleTabClick('git')}/>
             <Zap size={20} className={activeTab === 'ai' && showExplorer ? 'text-indigo-400' : 'hover:text-indigo-300'} fill={(activeTab === 'ai' && showExplorer) ? "currentColor" : "none"} onClick={() => handleTabClick('ai')}/>
          </div>

          {showExplorer && (
            <div className="w-60 bg-[#252526] border-r border-black/40 flex flex-col shrink-0" style={{ backgroundColor: '#252526' }}>
               {renderSidebarContent()}
            </div>
          )}

          <div className="flex-1 flex flex-col min-w-0 relative" style={{ backgroundColor: '#1e1e1e' }}>
             <div className="h-9 border-b border-black/20 px-4 flex items-center text-[10px] text-slate-400 font-mono italic" style={{ backgroundColor: '#252526' }}>
               {activeFileName}
             </div>
             
             <div className="flex-1 flex overflow-hidden" style={{ backgroundColor: '#1e1e1e' }}>
                <div className="w-10 border-r border-slate-800 flex flex-col items-end pt-5 pr-3 select-none pointer-events-none" style={{ backgroundColor: '#1e1e1e' }}>
                  {code.split('\n').map((_, i) => (
                    <span key={i} className="text-[11px] font-mono text-slate-600 leading-relaxed">{i + 1}</span>
                  ))}
                </div>
                
                <textarea 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  spellCheck="false" 
                  style={{ 
                    backgroundColor: '#1e1e1e', 
                    color: '#9cdcfe', 
                    flex: 1, 
                    padding: '20px', 
                    fontSize: '12px', 
                    fontFamily: 'monospace', 
                    outline: 'none', 
                    resize: 'none', 
                    lineHeight: '1.625',
                    border: 'none'
                  }} 
                  className="no-scrollbar selection:bg-indigo-500/30"
                />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}