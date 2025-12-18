'use client'

import { Logo } from './Logo'
import { CodeDisplay } from './CodeDisplay'
import { CodeInput } from './CodeInput'
import { Button } from './Button'

interface EntryPageProps {
  myCode: string
  peerCode: string
  onPeerCodeChange: (code: string) => void
  onConnect: () => void
  isConnecting: boolean
  isReady: boolean
  error: string | null
}

export function EntryPage({
  myCode,
  peerCode,
  onPeerCodeChange,
  onConnect,
  isConnecting,
  isReady,
  error,
}: EntryPageProps) {
  const canConnect = peerCode.length === 6 && !isConnecting && isReady

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-vanish-green-dark/10 to-transparent opacity-50" />
      
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-10">
        {/* Logo */}
        <div className="animate-fade-in">
          <Logo />
        </div>
        
        {/* Your code */}
        <div className="w-full animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <CodeDisplay code={myCode || '------'} isLoading={!myCode} />
        </div>
        
        {/* Divider */}
        <div className="w-full flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="flex-1 h-px bg-vanish-green-dark" />
          <span className="text-xs text-vanish-green-dark uppercase tracking-widest">Connect</span>
          <div className="flex-1 h-px bg-vanish-green-dark" />
        </div>
        
        {/* Peer code input */}
        <div className="w-full animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <CodeInput
            value={peerCode}
            onChange={onPeerCodeChange}
            onSubmit={onConnect}
            disabled={isConnecting || !isReady}
          />
        </div>
        
        {/* Connect button */}
        <div className="w-full max-w-xs animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <Button
            onClick={onConnect}
            disabled={!canConnect}
            loading={isConnecting}
            size="lg"
            className="w-full"
          >
            {!isReady ? 'Initializing...' : isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="w-full text-center animate-fade-in">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        {/* Instructions */}
        <div className="text-center text-xs text-vanish-green-dark opacity-60 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <p>Share your code with your peer.</p>
          <p>Enter their code to connect.</p>
          <p className="mt-2 text-vanish-green-dark/50">Both parties must connect to each other.</p>
        </div>
      </div>
    </div>
  )
}
