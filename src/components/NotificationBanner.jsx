import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function NotificationBanner() {
  const { t } = useLanguage()
  const [status, setStatus] = useState(null) // null | 'prompt' | 'granted' | 'denied'
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!('Notification' in window)) return
    setStatus(Notification.permission)
  }, [])

  const requestPermission = async () => {
    const result = await Notification.requestPermission()
    setStatus(result)
    if (result === 'granted') {
      new Notification('ChildShield alerts enabled ✓', {
        body: 'You will be notified instantly when a child is reported missing near you.',
        icon: '/icons/icon-192.png',
      })
    }
  }

  // Only show when permission hasn't been decided yet and user hasn't dismissed
  if (dismissed || status !== 'default') return null

  return (
    <div style={{
      background: 'rgba(239,68,68,0.07)',
      border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: 14,
      padding: '12px 14px',
      marginBottom: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{ width: 34, height: 34, background: 'rgba(239,68,68,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Bell size={16} color="#EF4444" />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{t('notification','title')}</p>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{t('notification','body')}</p>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={requestPermission}
          style={{ background: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 10px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
        >
          {t('notification','enable')}
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'transparent', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
