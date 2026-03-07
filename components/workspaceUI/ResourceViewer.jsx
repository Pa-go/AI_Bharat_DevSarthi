"use client";

import { useState, useRef } from "react";
import { FileText, Upload, CheckCircle2, Loader2, FileUp, X } from "lucide-react";

export default function ResourceViewer({ onTextExtract }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [viewUrl, setViewUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFileName(file.name);
        setViewUrl(data.viewUrl); // 🎯 Set the S3 link for the iframe
        setIsLoaded(true);
        
        // 🧠 Send text to Workspace -> CompanionAI
        if (onTextExtract) {
          onTextExtract(data.extractedText);
        }
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Check console for Upload Error.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a]">
      {/* HEADER */}
      <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-[#0f172a]/50">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-3 h-3 text-indigo-400" /> SOURCE READER
        </h3>
        {isLoaded && (
          <button 
            onClick={() => setIsLoaded(false)} 
            className="text-[9px] font-bold text-red-400 hover:text-red-300 uppercase flex items-center gap-1"
          >
            <X size={12} /> Remove
          </button>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative">
        {!isLoaded ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".pdf,.txt" 
              className="hidden" 
            />
            
            <div 
              onClick={() => fileInputRef.current.click()}
              className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10 hover:border-indigo-500/50 cursor-pointer transition-all group"
            >
              {isUploading ? (
                <Loader2 className="text-indigo-500 animate-spin" size={32} />
              ) : (
                <Upload className="text-slate-500 group-hover:text-indigo-400" size={32} />
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-200">
              {isUploading ? "Sathi is indexing..." : "Upload MU Syllabus"}
            </h4>
            <p className="text-[11px] text-slate-500 mt-2 mb-6 max-w-[200px]">
              PDF text will be sent to AI for tutoring context.
            </p>

            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[11px] font-black flex items-center gap-2 transition-all"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />}
              {isUploading ? "PROCESSING..." : "SELECT FILE"}
            </button>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col">
            {/* 🎯 THE PDF EMBED */}
            <iframe 
              src={`${viewUrl}#toolbar=0`} 
              className="w-full h-full bg-white border-none"
              title="PDF Viewer"
            />
            
            {/* FLOATING STATUS */}
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-indigo-600/90 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3 shadow-2xl">
               <CheckCircle2 size={16} className="text-white" />
               <div className="flex-1">
                  <p className="text-[10px] font-black text-white uppercase truncate">{fileName}</p>
                  <p className="text-[8px] text-indigo-100 font-bold uppercase tracking-tighter">AI Analysis Active</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}