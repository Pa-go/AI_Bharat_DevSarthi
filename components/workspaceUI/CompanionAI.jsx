"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Send, User, ChevronRight, BookOpen, 
  Globe, Terminal, Loader2, Trash2, Copy, Check 
} from "lucide-react";
import ReactMarkdown from "react-markdown"; 

export default function CompanionAI({ mode = "dual", context = "", lang = "en" }) {
  const [input, setInput] = useState("");
  const [chatType, setChatType] = useState("resource"); 
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);

  const initialMessage = { 
    role: "assistant", 
    content: lang === 'hi' ? "Namaste! Main Sathi hoon. Kya hum aaj Syllabus cover karein?" : 
             lang === 'mr' ? "Namaskar! Me Sathi aahe. Aaj kay abhyas karaycha?" :
             "Hello! I'm Sathi. I've indexed your syllabus. How can I help you today?" 
  };

  const [messages, setMessages] = useState([initialMessage]);

  const clearChat = () => {
    if(window.confirm("Clear conversation?")) {
      setMessages([initialMessage]);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSuggestions = () => {
    if (!context && chatType === "resource") return ["Waiting for PDF upload..."];
    return chatType === "resource" 
      ? ["Explain Normalization from PDF", "Summarize ACID properties", "Key highlights of this unit"]
      : ["Career trends in 2026", "Suggest a MERN project", "How to ace technical interviews?"];
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const sendMessage = async (e, customInput) => {
    e?.preventDefault();
    const finalInput = customInput || input;
    if (!finalInput.trim() || isLoading) return;
    
    if (chatType === "resource" && !context) {
        alert("Please upload a PDF first to use Syllabus Mode!");
        return;
    }

    const userMessage = { role: "user", content: finalInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage], 
          context: chatType === "resource" ? context : "", 
          mode,
          lang 
        }),
      });
      const data = await response.json();
      if (data.text) setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (error) { 
      console.error("Chat Error:", error); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] relative">
      {/* HEADER */}
      <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-[#0f172a]/50 backdrop-blur-md">
        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          {mode === 'code' ? <Terminal className="w-3 h-3 text-emerald-500" /> : <Sparkles className="w-3 h-3" />}
          {mode === 'read' ? 'THEORY ASSIST' : mode === 'code' ? 'DEBUG LAB' : 'SATHI AI'}
        </h3>
        
        <div className="flex items-center gap-3">
            <button onClick={clearChat} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors" title="Clear Chat">
                <Trash2 size={14} />
            </button>
            <div className="w-[1px] h-3 bg-white/10" />
            <div className={`w-1.5 h-1.5 rounded-full ${chatType === 'resource' ? (context ? 'bg-emerald-500' : 'bg-slate-600') : 'bg-amber-500'}`} />
        </div>
      </div>

      {/* CHAT TOGGLE */}
      <div className="px-4 pt-4">
        <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
          <button onClick={() => setChatType("resource")} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-2 ${chatType === "resource" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500"}`}>
            <BookOpen size={12}/> SYLLABUS
          </button>
          <button onClick={() => setChatType("global")} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-2 ${chatType === "global" ? "bg-slate-800 text-white shadow-lg" : "text-slate-500"}`}>
            <Globe size={12}/> GLOBAL
          </button>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${msg.role === 'assistant' ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-700/50 border-white/10 text-slate-300'}`}>
              {msg.role === 'assistant' ? <Sparkles size={14} /> : <User size={14} />}
            </div>
            
            {/* 🎯 Updated: Relative and Group container */}
            <div className={`group relative max-w-[88%] p-4 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'assistant' ? 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5 shadow-sm' : 'bg-indigo-600 text-white rounded-tr-none shadow-md'}`}>
              
              {/* 🎯 FIX: Adjusted copy button visibility and positioning */}
              {msg.role === 'assistant' && (
                  <button 
                    onClick={() => copyToClipboard(msg.content, i)}
                    className="absolute -right-10 top-0 p-2 text-slate-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Copy response"
                  >
                    {copiedId === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
              )}

              <ReactMarkdown 
                components={{
                  p: ({children}) => <div className="mb-2 last:mb-0">{children}</div>,
                  code({ children }) {
                    const codeVal = String(children).replace(/\n$/, '');
                    return (
                      <div className="relative group/code my-3">
                        <code className="bg-[#020617] text-emerald-400 px-4 py-3 rounded-xl font-mono text-[12px] border border-white/10 block whitespace-pre-wrap overflow-x-auto pr-20">
                          {children}
                        </code>
                        <button type="button" onClick={(e) => { e.preventDefault(); window.__SATHI_INSERT_CODE__ = codeVal; window.dispatchEvent(new CustomEvent("insert-code-trigger")); }} className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black opacity-0 group-hover/code:opacity-100 transition-all z-50 shadow-xl">
                          INSERT <ChevronRight size={12} />
                        </button>
                      </div>
                    );
                  }
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* THINKING STATE */}
        {isLoading && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
              <Loader2 size={14} className="text-indigo-400 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                </div>
                <p className="text-[9px] text-indigo-400/60 font-black mt-2 uppercase tracking-widest">Sathi is thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-[#0f172a]/80 backdrop-blur-md border-t border-white/5">
        {!isLoading && messages.length < 5 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar px-1">
                {getSuggestions().map((text, idx) => (
                    <button 
                        key={idx}
                        disabled={chatType === 'resource' && !context}
                        onClick={(e) => sendMessage(e, text)}
                        className={`whitespace-nowrap px-4 py-2 backdrop-blur-sm border rounded-2xl text-[10px] font-bold transition-all duration-300 shadow-sm ${
                            (chatType === 'resource' && !context) 
                            ? 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed' 
                            : 'bg-indigo-500/5 border-white/5 text-slate-400 hover:bg-indigo-500/10 hover:text-white hover:border-indigo-500/20'
                        }`}
                    >
                        {text}
                    </button>
                ))}
            </div>
        )}

        <form onSubmit={sendMessage} className="relative flex items-center gap-2">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={chatType === 'resource' ? (context ? "Analyze syllabus..." : "Upload PDF to begin...") : "Ask global Sathi..."} 
            disabled={chatType === 'resource' && !context}
            className={`flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-[13px] text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner ${chatType === 'resource' && !context ? 'opacity-50 cursor-not-allowed' : ''}`} 
          />
          <button 
            type="submit" 
            disabled={isLoading || (chatType === 'resource' && !context)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-white active:scale-95 transition-all shadow-lg ${isLoading || (chatType === 'resource' && !context) ? 'bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-500'}`}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}