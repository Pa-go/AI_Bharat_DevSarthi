"use client";

import { useEffect, useState, useRef } from "react";
import Editor, { loader } from "@monaco-editor/react"; 
import { 
  Play, Copy, Check, Terminal as TerminalIcon, 
  Loader2, Plus, X, FileCode, Cpu 
} from "lucide-react";

export default function CodeLab({ 
  initialFiles = [{ name: "main.py", content: "# Welcome to Sathi\nprint('Hello World')\n\n# Advanced Python Test\nx = 10\ny = 20\nimport math\narea = math.pi * (x ** 2)\nprint(f'Circle Area: {area:.2f}')" }],
  activeFileName: externalActiveFileName 
}) {
  const [files, setFiles] = useState(initialFiles);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("Sathi Systems Initializing...\n");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const editorRef = useRef(null);

  const activeFile = files[activeFileIndex] || files[0];

  function handleEditorDidMount(editor) { editorRef.current = editor; }

  // 🚀 ANTI-CONFLICT PYODIDE ENGINE (Final Production Version)
  useEffect(() => {
    let isMounted = true;

    async function initPyodide() {
      // 1. Configure Monaco Loader to stay in its own lane
      loader.config({
        paths: {
          'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs'
        }
      });

      // 2. Wait for Monaco to finish its own internal loading
      await loader.init();

      if (window.sathiPyInstance) {
        setPyodide(window.sathiPyInstance);
        setIsPyodideLoading(false);
        return;
      }

      if (!document.getElementById("pyodide-core")) {
        // 🎯 THE LOCK: Temporarily disable AMD loader while Pyodide initializes
        // This stops Pyodide from looking for modules in the wrong local paths.
        const oldDefine = window.define;
        const oldRequire = window.require;
        window.define = undefined;
        window.require = undefined;

        const script = document.createElement("script");
        script.id = "pyodide-core";
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        
        script.onload = async () => {
          try {
            // Give the browser a moment to register the global loadPyodide
            setTimeout(async () => {
                try {
                    const py = await window.loadPyodide({
                        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
                    });

                    // 🎯 Restore Monaco's environment immediately
                    window.define = oldDefine;
                    window.require = oldRequire;

                    if (isMounted) {
                        window.sathiPyInstance = py;
                        setPyodide(py);
                        setIsPyodideLoading(false);
                        setTerminalOutput(prev => prev + "✓ Python 3.11 WASM Engine Ready.\n");
                    }
                } catch (loadErr) {
                    console.error("Pyodide LoadAsync Error:", loadErr);
                    window.define = oldDefine;
                    window.require = oldRequire;
                }
            }, 100);

          } catch (err) {
            console.error("Pyodide Script Load Error:", err);
            window.define = oldDefine;
            window.require = oldRequire;
            if (isMounted) setIsPyodideLoading(false);
          }
        };
        document.body.appendChild(script);
      }
    }

    initPyodide();
    return () => { isMounted = false; };
  }, []);

  // 🚀 SATHI INSERT CODE LOGIC
  useEffect(() => {
    const handleInsert = () => {
      const codeToInsert = window.__SATHI_INSERT_CODE__;
      if (!codeToInsert) return;
      const currentContent = editorRef.current?.getValue() || activeFile.content;
      const updatedCode = currentContent + "\n\n# AI Suggested Logic:\n" + codeToInsert;
      updateCurrentFileContent(updatedCode);
      if (editorRef.current) {
        editorRef.current.setValue(updatedCode);
        editorRef.current.focus();
      }
      window.__SATHI_INSERT_CODE__ = null; 
    };
    window.addEventListener("insert-code-trigger", handleInsert);
    return () => window.removeEventListener("insert-code-trigger", handleInsert);
  }, [activeFileIndex, files, activeFile.content]);

  const updateCurrentFileContent = (newContent) => {
    const newFiles = [...files];
    newFiles[activeFileIndex].content = newContent;
    setFiles(newFiles);
  };

  const addNewFile = () => {
    const name = prompt("Enter file name (e.g. main.py, logic.cpp):");
    if (name && !files.find(f => f.name === name)) {
      const newFiles = [...files, { name, content: "" }];
      setFiles(newFiles);
      setActiveFileIndex(newFiles.length - 1);
    }
  };

  const deleteFile = (index) => {
    if (files.length <= 1) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setActiveFileIndex(0);
  };

  const getLanguage = (fileName) => {
    if (fileName.endsWith('.cpp')) return 'cpp';
    if (fileName.endsWith('.sql')) return 'sql';
    if (fileName.endsWith('.java')) return 'java';
    return 'python';
  };

  // 🚀 REAL EXECUTION LOGIC USING PYODIDE
  const handleRun = async () => {
    const latestCode = editorRef.current?.getValue() || activeFile.content;
    const lang = getLanguage(activeFile.name);
    setIsRunning(true);
    
    if (lang !== 'python') {
        setTerminalOutput(prev => prev + `➜ Detected ${lang.toUpperCase()} file...\n`);
        setTimeout(() => {
            setTerminalOutput(prev => prev + 
                `⚠️ NOTE: Browser terminal supports Python 3.11 ONLY.\n` +
                `➜ For ${lang.toUpperCase()}, use an external compiler.\n`
            );
            setIsRunning(false);
        }, 600);
        return;
    }

    if (!pyodide) {
      setTerminalOutput(prev => prev + "❌ Engine not ready. Wait for initialization...\n");
      setIsRunning(false);
      return;
    }

    setTerminalOutput(prev => prev + `➜ Executing ${activeFile.name} [WASM]...\n`);

    try {
      // Setup StringIO to capture Python's print statements
      await pyodide.runPythonAsync(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);

      await pyodide.runPythonAsync(latestCode);
      const stdout = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      setTerminalOutput(prev => prev + (stdout || "> Process finished.") + "\n✓ Done.\n");
    } catch (err) {
      setTerminalOutput(prev => prev + `❌ Python Error:\n${err.message}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorRef.current?.getValue() || activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-[#1e1e1e] rounded-t-[2.5rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-500">
      
      {/* File Tabs */}
      <div className="h-10 bg-[#1e1e1e] flex items-center px-4 gap-1 border-b border-white/5 overflow-x-auto no-scrollbar">
        {files.map((file, i) => (
          <div key={i} onClick={() => setActiveFileIndex(i)} className={`flex items-center gap-2 px-3 h-8 rounded-t-lg cursor-pointer text-[10px] font-black uppercase tracking-tight transition-all shrink-0 ${activeFileIndex === i ? 'bg-[#252526] text-white border-t border-indigo-500 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            <FileCode size={12} className={activeFileIndex === i ? 'text-indigo-400' : ''} /> {file.name}
            {files.length > 1 && <X size={10} className="ml-2 hover:text-red-400" onClick={(e) => { e.stopPropagation(); deleteFile(i); }} />}
          </div>
        ))}
        <button onClick={addNewFile} className="p-1.5 text-slate-400 hover:text-white transition-colors ml-2"><Plus size={14} /></button>
      </div>

      {/* Toolbar */}
      <div className="h-11 px-6 flex items-center justify-between bg-[#252526] border-b border-black/30">
        <div className="flex items-center gap-4">
           <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" /><div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" /></div>
           <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-widest flex items-center gap-2">
             <span className="text-indigo-400">{getLanguage(activeFile.name).toUpperCase()}</span> LAB
             {getLanguage(activeFile.name) === 'python' && (
                <span className={`text-[8px] border px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${isPyodideLoading ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                  {isPyodideLoading ? <Loader2 size={8} className="animate-spin" /> : <Cpu size={8} />}
                  {isPyodideLoading ? 'INIT ENGINE' : 'WASM 3.11 READY'}
                </span>
             )}
           </span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white transition-colors">{copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}</button>
          <button 
            onClick={handleRun} 
            disabled={isRunning || (getLanguage(activeFile.name) === 'python' && isPyodideLoading)} 
            className="flex items-center gap-2 px-5 py-1.5 rounded-xl text-[10px] font-black bg-emerald-600 text-white hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed active:scale-95 transition-all shadow-lg"
          >
            {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="white" />} RUN
          </button>
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 relative bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={getLanguage(activeFile.name)}
          theme="vs-dark"
          value={activeFile.content}
          onMount={handleEditorDidMount}
          onChange={(val) => updateCurrentFileContent(val || "")}
          options={{ 
            fontSize: 14, 
            fontFamily: "'Fira Code', monospace", 
            minimap: { enabled: false }, 
            automaticLayout: true, 
            scrollBeyondLastLine: false,
            padding: { top: 20 }
          }}
        />
      </div>

      {/* Terminal Output */}
      <div className="h-40 bg-[#0f172a] border-t border-white/10 flex flex-col font-mono text-[12px]">
        <div className="h-8 px-4 flex items-center justify-between bg-black/40 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <TerminalIcon size={12} className="text-slate-500" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Sathi Console Output</span>
          </div>
          <button onClick={() => setTerminalOutput("Console Cleared...\n")} className="text-[9px] text-slate-600 hover:text-white uppercase font-bold transition-colors">Clear</button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto text-emerald-400/90 whitespace-pre-wrap custom-scrollbar">
          {terminalOutput}
        </div>
      </div>
    </div>
  );
}