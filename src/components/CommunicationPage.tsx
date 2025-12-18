'use client'

import { StatusIndicator } from './StatusIndicator'
import { MessageDisplay } from './MessageDisplay'
import { MessageInput } from './MessageInput'
import { ConnectionStatus, Message } from '@/hooks/usePeer'

interface CommunicationPageProps {
  status: ConnectionStatus
  message: Message | null
  onSendMessage: (content: string) => boolean
  onDisconnect: () => void
  myCode: string
  peerCode: string
}

export function CommunicationPage({
  status,
  message,
  onSendMessage,
  onDisconnect,
  myCode,
  peerCode,
}: CommunicationPageProps) {
  const isConnected = status === 'connected'

  return (
    <div className="min-h-screen flex flex-col bg-vanish-black">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-vanish-green-dark safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Codes display */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-vanish-green-dim">
              <span className="opacity-50">You:</span> {myCode}
            </span>
            <span className="text-vanish-green-dark">↔</span>
            <span className="text-vanish-green">
              <span className="opacity-50">Peer:</span> {peerCode}
            </span>
          </div>
          
          {/* Disconnect button */}
          <button
            onClick={onDisconnect}
            className="text-xs text-red-500 uppercase tracking-wider hover:text-red-400 transition-colors active:scale-95"
          >
            End
          </button>
        </div>
        
        {/* Status */}
        <StatusIndicator status={status} />
      </header>
      
      {/* Message area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <MessageDisplay message={message} />
      </main>
      
      {/* Input area */}
      <footer className="flex-shrink-0">
        <MessageInput
          onSend={onSendMessage}
          disabled={!isConnected}
        />
      </footer>
      
      {/* Disconnected overlay */}
      {status === 'disconnected' && (
        <div className="absolute inset-0 bg-vanish-black/90 flex flex-col items-center justify-center gap-6 animate-fade-in z-50">
          <div className="text-center">
            <p className="text-2xl text-red-500 font-bold mb-2">DISCONNECTED</p>
            <p className="text-sm text-vanish-green-dim">The connection has ended.</p>
            <p className="text-xs text-vanish-green-dark mt-1">All messages have vanished.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 border border-vanish-green text-vanish-green uppercase tracking-wider hover:bg-vanish-green hover:text-vanish-black transition-all active:scale-95"
          >
            Start New Session
          </button>
        </div>
      )}
    </div>
  )
}

