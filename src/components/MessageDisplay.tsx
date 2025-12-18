'use client'

import { useEffect, useState, useRef } from 'react'
import { Message } from '@/hooks/usePeer'

interface MessageDisplayProps {
  message: Message | null
}

export function MessageDisplay({ message }: MessageDisplayProps) {
  const [displayMessage, setDisplayMessage] = useState<Message | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevMessageRef = useRef<string | null>(null)

  useEffect(() => {
    if (message && message.id !== prevMessageRef.current) {
      // New message arrived
      setIsAnimating(true)
      
      // Small delay for exit animation if there was a previous message
      const delay = prevMessageRef.current ? 150 : 0
      
      setTimeout(() => {
        setDisplayMessage(message)
        prevMessageRef.current = message.id
        
        setTimeout(() => {
          setIsAnimating(false)
        }, 300)
      }, delay)
    } else if (!message && displayMessage) {
      // Message cleared
      setIsAnimating(true)
      setTimeout(() => {
        setDisplayMessage(null)
        prevMessageRef.current = null
        setIsAnimating(false)
      }, 300)
    }
  }, [message, displayMessage])

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[200px]">
      {displayMessage ? (
        <div
          className={`w-full max-w-md p-6 border border-vanish-green-dark transition-all duration-300 ${
            isAnimating ? 'message-enter' : ''
          }`}
        >
          {/* Sender indicator */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs uppercase tracking-wider ${
                displayMessage.sender === 'self' ? 'text-vanish-green' : 'text-vanish-green-dim'
              }`}
            >
              {displayMessage.sender === 'self' ? '> You' : '> Peer'}
            </span>
            <span className="text-xs text-vanish-green-dark">
              {new Date(displayMessage.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          
          {/* Message content */}
          <p className="text-lg sm:text-xl leading-relaxed break-words glow-text-subtle selectable">
            {displayMessage.content}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-vanish-green-dark text-sm uppercase tracking-wider">
            No messages yet
          </p>
          <p className="text-vanish-green-dark text-xs mt-2 opacity-50">
            Messages vanish after being replaced
          </p>
        </div>
      )}
    </div>
  )
}

