'use client'

import { useState, useCallback } from 'react'
import { copyToClipboard, hapticFeedback } from '@/lib/utils'

interface CodeDisplayProps {
  code: string
  label?: string
  isLoading?: boolean
}

export function CodeDisplay({ code, label = 'YOUR CODE', isLoading = false }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (isLoading) return
    hapticFeedback('medium')
    const success = await copyToClipboard(code)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [code, isLoading])

  return (
    <div className="flex flex-col items-center w-full">
      <span className="text-xs text-vanish-green-dim mb-2 tracking-widest uppercase">
        {label}
      </span>
      <button
        onClick={handleCopy}
        disabled={isLoading}
        className="relative group w-full max-w-xs disabled:cursor-wait"
        aria-label="Copy code to clipboard"
      >
        <div className={`flex items-center justify-center gap-3 px-6 py-4 border border-vanish-green bg-vanish-black transition-all duration-200 hover:glow-border active:scale-95 ${isLoading ? 'opacity-50' : ''}`}>
          <span className={`text-2xl sm:text-3xl font-bold tracking-[0.3em] glow-text-subtle ${isLoading ? 'animate-pulse' : ''}`}>
            {code}
          </span>
          {!isLoading && (
            <span className="text-xs text-vanish-green-dim opacity-0 group-hover:opacity-100 transition-opacity">
              {copied ? '✓' : '⎘'}
            </span>
          )}
        </div>
        
        {/* Copy feedback */}
        <span
          className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs transition-all duration-200 ${
            copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
        >
          Copied!
        </span>
      </button>
    </div>
  )
}
