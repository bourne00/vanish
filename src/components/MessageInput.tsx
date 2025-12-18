'use client'

import { useState, useCallback, KeyboardEvent, useRef, useEffect } from 'react'
import { hapticFeedback } from '@/lib/utils'

interface MessageInputProps {
  onSend: (content: string) => boolean
  disabled?: boolean
  maxLength?: number
}

export function MessageInput({ onSend, disabled = false, maxLength = 100 }: MessageInputProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const remaining = maxLength - content.length
  const isOverLimit = remaining < 0
  const isNearLimit = remaining <= 20 && remaining >= 0

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [content])

  const handleSend = useCallback(() => {
    if (!content.trim() || isOverLimit || disabled) return
    
    hapticFeedback('medium')
    const success = onSend(content.trim())
    if (success) {
      setContent('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }, [content, isOverLimit, disabled, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Send on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }, [])

  return (
    <div className="w-full p-4 border-t border-vanish-green-dark safe-bottom">
      {/* Character count */}
      <div className="flex justify-end mb-2">
        <span
          className={`text-xs transition-colors ${
            isOverLimit
              ? 'text-red-500'
              : isNearLimit
              ? 'text-yellow-500'
              : 'text-vanish-green-dim'
          }`}
        >
          {remaining}
        </span>
      </div>
      
      {/* Input area */}
      <div className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none px-4 py-3 border border-vanish-green bg-vanish-black placeholder:text-vanish-green-dark focus:glow-border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] max-h-[120px]"
        />
        
        <button
          onClick={handleSend}
          disabled={disabled || !content.trim() || isOverLimit}
          className="flex-shrink-0 px-6 py-3 border border-vanish-green bg-vanish-green text-vanish-black font-bold uppercase tracking-wider transition-all duration-200 hover:bg-vanish-black hover:text-vanish-green hover:glow-border active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-vanish-green disabled:hover:text-vanish-black disabled:hover:shadow-none"
        >
          Send
        </button>
      </div>
      
      {/* Over limit warning */}
      {isOverLimit && (
        <p className="text-red-500 text-xs mt-2 animate-fade-in">
          Message exceeds {maxLength} character limit
        </p>
      )}
    </div>
  )
}

