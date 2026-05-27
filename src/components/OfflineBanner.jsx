import { WifiOff, RefreshCw } from 'lucide-react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: '#B45309',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <WifiOff size={15} color="#fff" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>
          You are offline
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
          Showing last saved data. Reports will be sent when you reconnect.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#fff', fontSize: 12, fontWeight: 600 }}
      >
        <RefreshCw size={12} /> Retry
      </button>
    </div>
  )
}
