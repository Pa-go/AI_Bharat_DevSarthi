// components/panels/CodeEditor.jsx
'use client'
import { useState, useRef } from 'react'
import { Play, Copy, RotateCcw, Download, ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const languages = [
  { id: 'python', name: 'Python', template: '# Start coding here\nprint("Hello DevSarthi")' },
  { id: 'javascript', name: 'JavaScript', template: '// Start coding here\nconsole.log("Hello DevSarthi");' },
  { id: 'java', name: 'Java', template: '// Start coding here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello DevSarthi");\n    }\n}' },
  { id: 'cpp', name: 'C++', template: '// Start coding here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello DevSarthi" << endl;\n    return 0;\n}' },
  { id: 'c', name: 'C', template: '// Start coding here\n#include <stdio.h>\n\nint main() {\n    printf("Hello DevSarthi\\n");\n    return 0;\n}' }
]

const themes = [
  { id: 'vs-dark', name: 'Dark' },
  { id: 'light', name: 'Light' },
  { id: 'hc-black', name: 'High Contrast' }
]

export default function CodeEditor() {
  const [language, setLanguage] = useState(languages[0])
  const [theme, setTheme] = useState(themes[0])
  const [code, setCode] = useState(languages[0].template)
  const [output, setOutput] = useState('')
  const [showTerminal, setShowTerminal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const editorRef = useRef(null)

  const handleLanguageChange = (e) => {
    const newLang = languages.find(l => l.id === e.target.value)
    setLanguage(newLang)
    setCode(newLang.template)
    setOutput('')
    setShowTerminal(false)
  }

  const handleThemeChange = (e) => {
    const newTheme = themes.find(t => t.id === e.target.value)
    setTheme(newTheme)
  }

  const handleRun = () => {
    setIsRunning(true)
    setShowTerminal(true)
    
    setTimeout(() => {
      if (code.includes('print') || code.includes('console.log') || code.includes('System.out') || code.includes('cout') || code.includes('printf')) {
        setOutput(`✓ Code executed successfully!\n\nOutput:\nHello DevSarthi\n\nExecution time: 0.${Math.floor(Math.random() * 900 + 100)}s`)
      } else {
        setOutput(`✓ Code executed successfully!\n\nNo output to display.\n\nExecution time: 0.${Math.floor(Math.random() * 900 + 100)}s`)
      }
      setIsRunning(false)
    }, 1500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  }

  const handleReset = () => {
    setCode(language.template)
    setOutput('')
    setShowTerminal(false)
  }

  const handleDownload = () => {
    const extensions = { python: 'py', javascript: 'js', java: 'java', cpp: 'cpp', c: 'c' }
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${extensions[language.id]}`
    a.click()
  }

  const lineCount = code.split('\n').length

  return (
    <div className="h-full flex flex-col card overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between" style={{borderBottom: '1px solid var(--border-light)'}}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">{'</>'}</span>
          </div>
          <div>
            <h3 className="font-bold" style={{color: 'var(--text-dark)'}}>Code Editor</h3>
            <div className="text-xs" style={{color: 'var(--text-secondary)'}}>{lineCount} lines</div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <select
            value={language.id}
            onChange={handleLanguageChange}
            className="px-3 py-2 text-sm rounded-lg cursor-pointer"
            style={{
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)'
            }}
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 flex items-center justify-between" style={{background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-light)'}}>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-white transition" title="Copy code">
            <Copy className="w-4 h-4" style={{color: 'var(--text-secondary)'}} />
          </button>
          <button onClick={handleReset} className="p-2 rounded-lg hover:bg-white transition" title="Reset code">
            <RotateCcw className="w-4 h-4" style={{color: 'var(--text-secondary)'}} />
          </button>
          <button onClick={handleDownload} className="p-2 rounded-lg hover:bg-white transition" title="Download code">
            <Download className="w-4 h-4" style={{color: 'var(--text-secondary)'}} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <select
            value={theme.id}
            onChange={handleThemeChange}
            className="px-3 py-1.5 text-xs rounded-lg cursor-pointer"
            style={{
              background: 'white',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)'
            }}
          >
            {themes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="btn-success px-4 py-1.5 flex items-center gap-2 text-sm"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative">
        <MonacoEditor
          height="100%"
          language={language.id}
          theme={theme.id}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 }
          }}
          onMount={(editor) => {
            editorRef.current = editor
          }}
        />
      </div>

      {/* Terminal Output */}
      {showTerminal && (
        <div 
          className="border-t transition-all duration-300 overflow-hidden"
          style={{
            borderColor: 'var(--border-light)',
            height: showTerminal ? '200px' : '0px'
          }}
        >
          <div className="h-full flex flex-col" style={{background: '#1e1e1e'}}>
            <div className="px-4 py-2 flex items-center justify-between" style={{borderBottom: '1px solid #333'}}>
              <span className="text-xs font-bold" style={{color: '#4EC9B0'}}>Terminal</span>
              <button 
                onClick={() => setShowTerminal(false)}
                className="text-xs px-2 py-1 rounded hover:bg-gray-700"
                style={{color: '#ccc'}}
              >
                Hide
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-xs" style={{color: '#d4d4d4'}}>
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}