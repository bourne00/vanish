'use client'

import { ConnectionStatus } from '@/hooks/usePeer'

interface StatusIndicatorProps {
  status: ConnectionStatus
}

const statusConfig: Record<ConnectionStatus, { label: string; color: string; pulse: boolean }> = {
  idle: { label: 'Ready', color: 'text-vanish-green-dim', pulse: false },
  waiting: { label: 'Waiting...', color: 'text-yellow-500', pulse: true },
  connecting: { label: 'Connecting...', color: 'text-yellow-500', pulse: true },
  connected: { label: 'Connected', color: 'text-vanish-green', pulse: false },
  disconnected: { label: 'Disconnected', color: 'text-red-500', pulse: false },
  error: { label: 'Error', color: 'text-red-500', pulse: false },
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <span
        className={`w-2 h-2 rounded-full ${
          config.color.replace('text-', 'bg-')
        } ${config.pulse ? 'animate-pulse' : ''}`}
      />
      <span className={`text-sm uppercase tracking-wider ${config.color}`}>
        {config.label}
      </span>
    </div>
  )
}

