'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Paperclip, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Locale to language name mapping for API
const LOCALE_TO_LANGUAGE = {
  'en': 'English',
  'hi': 'Hindi',
  'ta': 'Tamil',
  'te': 'Telugu',
  'bn': 'Bengali',
  'mr': 'Marathi'
}

export default function AIChat({ 
  pdfContext, 
  onSmartSwitch, 
  activePanelCount,
  initialMessages = [], 
  sessionId = null,
  locale = 'en'
}) {
  const t = useTranslations('AIChat')
  const currentLanguage = LOCALE_TO_LANGUAGE[locale] || 'English'
  // 1. Initialize state directly from props to avoid the first "flash"
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* ═══════════════════════════════════════════════════════════════════════════
      ✅ FIXED: Prevents Infinite Loop (Maximum update depth exceeded)
     ═══════════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    // Only update if initialMessages actually has content and is different
    if (initialMessages.length > 0) {
      setMessages(initialMessages)
    } 
    // Only clear if there are currently messages and we are in a "New Chat" session
    else if (!sessionId && messages.length > 0) {
      setMessages([]) 
    }
  }, [initialMessages, sessionId]) // Removed 'messages' from dependencies to stop the loop

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessageText = input
    const userMessageUI = {
      type: 'user',
      content: userMessageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => [...prev, userMessageUI])
    setInput('')
    setIsTyping(true)

    try {
      const chatHistory = messages
        .filter(msg => msg.content && msg.content.trim() !== "")
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: [{ text: msg.content }]
        }))

      chatHistory.push({
        role: 'user',
        content: [{ text: userMessageText }]
      })

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: chatHistory,
          locale: locale,
          language: currentLanguage 
        }), 
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json()

      if (data && data.text) {
        setMessages(prev => [...prev, {
          type: 'ai',
          content: data.text,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }])
      }
    } catch (error) {
      console.error("Chat Error:", error)
      setMessages(prev => [...prev, {
        type: 'ai',
        content: `Error: ${error.message}. Please try again.`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{t('aiTutor')}</h3>
            <div className="text-[10px] text-slate-500 uppercase tracking-tight font-bold">
              {sessionId ? t('archive') : t('newSession')}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 && !isTyping && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm space-y-2">
            <div className="p-3 bg-slate-50 rounded-full">✨</div>
            <p className="italic">{t('placeholder')}</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${
              msg.type === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-400 p-3 rounded-2xl rounded-tl-none text-xs italic animate-pulse">
              {t('thinking')}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-all flex-shrink-0">
            <Paperclip className="w-5 h-5 text-slate-400" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('askQuestion')}
            className="flex-1 min-w-[50px] bg-slate-50 border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-lg flex items-center justify-center transition-all flex-shrink-0"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}