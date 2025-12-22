'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Peer, { DataConnection } from 'peerjs'
import { generateCode, formatCode } from '@/lib/utils'

export type ConnectionStatus = 'idle' | 'waiting' | 'connecting' | 'connected' | 'disconnected' | 'error'

export interface Message {
  id: string
  content: string
  sender: 'self' | 'peer'
  timestamp: number
}

interface UsePeerReturn {
  myCode: string
  peerCode: string
  setPeerCode: (code: string) => void
  status: ConnectionStatus
  message: Message | null
  connect: () => void
  disconnect: () => void
  sendMessage: (content: string) => boolean
  error: string | null
  isReady: boolean
}

// Generate a unique peer ID with prefix to avoid collisions
function generatePeerId(code: string): string {
  return `vanish-${code}`
}

export function usePeer(): UsePeerReturn {
  // Initialize code as empty string - will be generated client-side
  const [myCode, setMyCode] = useState('')
  const [peerCode, setPeerCodeState] = useState('')
  const [status, setStatus] = useState<ConnectionStatus>('idle')
  const [message, setMessage] = useState<Message | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  
  const peerRef = useRef<Peer | null>(null)
  const connectionRef = useRef<DataConnection | null>(null)
  const isConnectedRef = useRef(false)
  const pendingConnectionRef = useRef<string | null>(null)
  const codeRef = useRef<string>('')
  const initializingRef = useRef(false)

  // Cleanup function
  const cleanup = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close()
      connectionRef.current = null
    }
    if (peerRef.current) {
      peerRef.current.destroy()
      peerRef.current = null
    }
    isConnectedRef.current = false
    pendingConnectionRef.current = null
    setMessage(null)
  }, [])

  // Handle incoming data
  const handleData = useCallback((data: unknown) => {
    if (typeof data === 'object' && data !== null && 'type' in data) {
      const msg = data as { type: string; content?: string; id?: string; timestamp?: number }
      
      if (msg.type === 'message' && msg.content) {
        // Replace the current message (only keep 1)
        setMessage({
          id: msg.id || crypto.randomUUID(),
          content: msg.content,
          sender: 'peer',
          timestamp: msg.timestamp || Date.now(),
        })
      } else if (msg.type === 'handshake') {
        // Handshake confirmation
        console.log('[Vanish] Handshake received')
      }
    }
  }, [])

  // Setup connection handlers
  const setupConnection = useCallback((conn: DataConnection, code: string) => {
    // Helper function to handle connection open
    const handleOpen = () => {
      console.log('[Vanish] Connection established')
      connectionRef.current = conn
      isConnectedRef.current = true
      setStatus('connected')
      setError(null)
      
      // Send handshake
      conn.send({ type: 'handshake', code })
    }

    // Check if connection is already open (important for receiver side)
    if (conn.open) {
      handleOpen()
    } else {
      conn.on('open', handleOpen)
    }

    conn.on('data', handleData)

    conn.on('close', () => {
      console.log('[Vanish] Connection closed')
      if (isConnectedRef.current) {
        setStatus('disconnected')
        isConnectedRef.current = false
        connectionRef.current = null
        setMessage(null)
      }
    })

    conn.on('error', (err) => {
      console.error('[Vanish] Connection error:', err)
      setError('Connection lost')
      setStatus('error')
    })
  }, [handleData])

  // Generate code and initialize peer (client-side only)
  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initializingRef.current) return
    initializingRef.current = true

    // Generate code on client side only
    const code = generateCode()
    codeRef.current = code
    setMyCode(code)

    const peer = new Peer(generatePeerId(code), {
      debug: 0, // Disable debug logs
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
      },
    })

    peer.on('open', (id) => {
      console.log('[Vanish] Peer initialized:', id)
      peerRef.current = peer
      setIsReady(true)
    })

    peer.on('connection', (conn) => {
      console.log('[Vanish] Incoming connection from:', conn.peer)
      
      // Exclusive connection: reject if already connected
      if (isConnectedRef.current || connectionRef.current) {
        console.log('[Vanish] Rejecting connection - already connected')
        conn.close()
        return
      }
      
      // Extract peer code from connection ID (format: vanish-XXXXXX)
      const incomingPeerCode = conn.peer.replace('vanish-', '')
      setPeerCodeState(incomingPeerCode)
      
      // Accept connection
      setupConnection(conn, codeRef.current)
    })

    peer.on('error', (err) => {
      console.error('[Vanish] Peer error:', err)
      if (err.type === 'unavailable-id') {
        // Generate a new code if current one is taken
        const newCode = generateCode()
        codeRef.current = newCode
        setMyCode(newCode)
        setError('Code conflict. Generated new code.')
        // Re-initialize would happen on next mount
      } else if (err.type === 'peer-unavailable') {
        setError('Peer not found. Check the code.')
        setStatus('idle')
      } else {
        setError('Connection failed. Try again.')
        setStatus('error')
      }
    })

    peer.on('disconnected', () => {
      console.log('[Vanish] Peer disconnected from server')
    })

    return () => {
      cleanup()
      initializingRef.current = false
    }
  }, [setupConnection, cleanup])

  // Connect to peer
  const connect = useCallback(() => {
    const targetCode = formatCode(peerCode)
    
    if (!targetCode || targetCode.length !== 6) {
      setError('Enter a valid 6-digit code')
      return
    }

    if (targetCode === myCode) {
      setError('Cannot connect to yourself')
      return
    }

    if (!peerRef.current) {
      setError('Not ready. Please wait...')
      return
    }

    if (isConnectedRef.current) {
      setError('Already connected')
      return
    }

    setError(null)
    setStatus('connecting')
    pendingConnectionRef.current = targetCode

    console.log('[Vanish] Connecting to:', generatePeerId(targetCode))
    
    const conn = peerRef.current.connect(generatePeerId(targetCode), {
      reliable: true,
    })

    if (conn) {
      setupConnection(conn, codeRef.current)
      
      // Timeout for connection
      setTimeout(() => {
        if (pendingConnectionRef.current === targetCode && !isConnectedRef.current) {
          setError('Connection timeout. Peer may not be ready.')
          setStatus('idle')
          pendingConnectionRef.current = null
        }
      }, 10000)
    }
  }, [peerCode, myCode, setupConnection])

  // Disconnect
  const disconnect = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close()
      connectionRef.current = null
    }
    isConnectedRef.current = false
    setStatus('disconnected')
    setMessage(null)
  }, [])

  // Send message
  const sendMessage = useCallback((content: string): boolean => {
    if (!connectionRef.current || !isConnectedRef.current) {
      setError('Not connected')
      return false
    }

    if (!content.trim()) {
      return false
    }

    if (content.length > 100) {
      setError('Message too long (max 100 characters)')
      return false
    }

    const msg: Message = {
      id: crypto.randomUUID(),
      content: content.trim(),
      sender: 'self',
      timestamp: Date.now(),
    }

    // Send to peer
    connectionRef.current.send({
      type: 'message',
      ...msg,
    })

    // Update local message (replace current)
    setMessage(msg)
    setError(null)
    
    return true
  }, [])

  // Set peer code with formatting
  const setPeerCode = useCallback((code: string) => {
    setPeerCodeState(formatCode(code))
  }, [])

  // Cleanup on page unload
  useEffect(() => {
    const handleUnload = () => {
      cleanup()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Optional: Start a timeout to disconnect after prolonged inactivity
        // For now, we keep the connection alive when switching tabs
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [cleanup])

  return {
    myCode,
    peerCode,
    setPeerCode,
    status,
    message,
    connect,
    disconnect,
    sendMessage,
    error,
    isReady,
  }
}
