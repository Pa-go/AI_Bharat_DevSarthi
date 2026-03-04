// components/panels/ResourceViewer.jsx
'use client'
import { useState } from 'react'
import { FileText, Video, Link as LinkIcon } from 'lucide-react'

export default function ResourceViewer({ onPDFProcessed }) {
  const [uploadedFile, setUploadedFile] = useState(null)

  return (
    <div className="h-full flex flex-col card overflow-hidden">
      <div className="p-4 flex-shrink-0" style={{borderBottom: '1px solid var(--border-light)'}}>
        <h3 className="font-bold flex items-center gap-2" style={{color: 'var(--text-dark)'}}>
          <FileText className="w-5 h-5" style={{color: 'var(--brand-blue)'}} />
          Resource Viewer
        </h3>
      </div>

      {!uploadedFile && (
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{
            background: 'linear-gradient(135deg, rgba(26, 115, 232, 0.1) 0%, rgba(106, 27, 154, 0.1) 100%)',
            border: '2px dashed var(--border-medium)'
          }}>
            <Video className="w-10 h-10" style={{color: 'var(--brand-blue)'}} />
          </div>
          
          <h4 className="text-lg font-bold mb-2" style={{color: 'var(--text-dark)'}}>
            No Resource Loaded
          </h4>
          <p className="text-sm mb-6 max-w-xs" style={{color: 'var(--text-secondary)'}}>
            Add a tutorial video, document, or link to start learning
          </p>
          
          {/* Resource Options */}
          <div className="w-full max-w-sm space-y-3">
            <button className="w-full flex items-center gap-3 p-4 rounded-lg hover:shadow-md transition" style={{
              background: 'white',
              border: '1px solid var(--border-light)'
            }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: 'rgba(26, 115, 232, 0.1)'}}>
                <Video className="w-5 h-5" style={{color: 'var(--brand-blue)'}} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm" style={{color: 'var(--text-dark)'}}>YouTube Video</div>
                <div className="text-xs" style={{color: 'var(--text-secondary)'}}>Paste video URL</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-4 rounded-lg hover:shadow-md transition" style={{
              background: 'white',
              border: '1px solid var(--border-light)'
            }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: 'rgba(26, 115, 232, 0.1)'}}>
                <FileText className="w-5 h-5" style={{color: 'var(--brand-blue)'}} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm" style={{color: 'var(--text-dark)'}}>Upload Document</div>
                <div className="text-xs" style={{color: 'var(--text-secondary)'}}>PDF, DOCX, MD files</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-4 rounded-lg hover:shadow-md transition" style={{
              background: 'white',
              border: '1px solid var(--border-light)'
            }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: 'rgba(26, 115, 232, 0.1)'}}>
                <LinkIcon className="w-5 h-5" style={{color: 'var(--brand-blue)'}} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm" style={{color: 'var(--text-dark)'}}>Add Link</div>
                <div className="text-xs" style={{color: 'var(--text-secondary)'}}>Article, blog, tutorial</div>
              </div>
            </button>
          </div>

          {/* Pro Tip */}
          <div className="mt-6 p-4 rounded-lg max-w-sm" style={{
            background: 'rgba(26, 115, 232, 0.05)',
            border: '1px solid var(--border-light)'
          }}>
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">💡</span>
              <div className="text-xs text-left" style={{color: 'var(--text-secondary)'}}>
                <span className="font-bold" style={{color: 'var(--brand-blue)'}}>Pro Tip:</span> Upload a tutorial and the AI will understand the context when you ask questions!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}