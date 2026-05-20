import { useState, useEffect } from 'react'
import { Download, Share, X } from 'lucide-react'

export default function InstallApp() {
  const [prompt, setPrompt] = useState(null)       // Chrome/Android/Edge install event
  const [isIOS, setIsIOS] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [showIOSSteps, setShowIOSSteps] = useState(false)

  useEffect(() => {
    // Already running as installed PWA — hide banner
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    // iOS detection (Safari on iPhone/iPad)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !('MSStream' in window)
    setIsIOS(ios)

    // Chrome / Edge / Android — catch the install prompt
    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setPrompt(null)
  }

  if (installed || dismissed) return null

  // iOS — show manual instructions
  if (isIOS) return (
    <div style={{
      background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.25)',
      borderRadius: 14, padding: '12px 14px', marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, background: 'rgba(59,130,246,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share size={14} color="#3B82F6" />
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9', margin: 0 }}>Install on iPhone</p>
        </div>
        <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,245,249,0.3)', padding: 4 }}>
          <X size={14} />
        </button>
      </div>
      {!showIOSSteps ? (
        <button
          onClick={() => setShowIOSSteps(true)}
          style={{ width: '100%', background: '#3B82F6', border: 'none', borderRadius: 9, padding: '8px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          Show me how
        </button>
      ) : (
        <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            'Tap the Share button at the bottom of Safari (box with arrow)',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" in the top right corner',
          ].map((step, i) => (
            <li key={i} style={{ fontSize: 12, color: 'rgba(241,245,249,0.6)', lineHeight: 1.5 }}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  )

  // Chrome / Edge / Android — show install button when prompt is ready
  if (prompt) return (
    <div style={{
      background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)',
      borderRadius: 14, padding: '12px 14px', marginBottom: 14,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ width: 34, height: 34, background: 'rgba(16,185,129,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Download size={16} color="#10B981" />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9', margin: '0 0 2px' }}>Install ChildShield</p>
        <p style={{ fontSize: 11, color: 'rgba(241,245,249,0.5)', margin: 0 }}>Add to home screen for instant access</p>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={handleInstall}
          style={{ background: '#10B981', border: 'none', borderRadius: 8, padding: '7px 12px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          Install
        </button>
        <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,245,249,0.3)', padding: 4 }}>
          <X size={14} />
        </button>
      </div>
    </div>
  )

  return null
}
