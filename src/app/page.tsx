'use client'

import { usePeer } from '@/hooks/usePeer'
import { EntryPage } from '@/components/EntryPage'
import { CommunicationPage } from '@/components/CommunicationPage'

export default function Home() {
  const {
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
  } = usePeer()

  // Show communication page when connected or disconnected (to show the disconnected state)
  const showCommunication = status === 'connected' || status === 'disconnected'

  if (showCommunication) {
    return (
      <CommunicationPage
        status={status}
        message={message}
        onSendMessage={sendMessage}
        onDisconnect={disconnect}
        myCode={myCode}
        peerCode={peerCode}
      />
    )
  }

  return (
    <EntryPage
      myCode={myCode}
      peerCode={peerCode}
      onPeerCodeChange={setPeerCode}
      onConnect={connect}
      isConnecting={status === 'connecting' || status === 'waiting'}
      isReady={isReady}
      error={error}
    />
  )
}
