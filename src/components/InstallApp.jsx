import { useState, useEffect } from 'react'
import { Download, Share, X, Smartphone } from 'lucide-react'

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !('MSStream' in window)
const isAndroid = () => /android/i.test(navigator.userAgent)
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

export default function InstallApp() {
  const [prompt, setPrompt] = useState(window.__pwaInstallPrompt || null)
  const [platform, setPlatform] = useState(null)
  const [showSteps, setShowSteps] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (isStandalone()) { setDismissed(true); return }

    if (isIOS())      setPlatform('ios')
    else if (isAndroid()) setPlatform('android')
    else              setPlatform('desktop')

    // Also catch the event if it fires after mount
    const handler = (e) => {
      e.preventDefault()
      window.__pwaInstallPrompt = e
      setPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setDismissed(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') { setDismissed(true); window.__pwaInstallPrompt = null }
    setPrompt(null)
  }

  if (dismissed || !platform) return null

  // ── iOS ───────────────────────────────────────────────────────────────────
  if (platform === 'ios') return (
    <div style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 14, padding: '12px 14px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showSteps ? 10 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, background: 'rgba(59,130,246,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share size={14} color="#3B82F6" />
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9', margin: 0 }}>Install on iPhone</p>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {!showSteps && (
            <button onClick={() => setShowSteps(true)} style={{ background: '#3B82F6', border: 'none', borderRadius: 7, padding: '5px 10px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              How?
            </button>
          )}
          <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,245,249,0.3)', padding: 2 }}>
            <X size={14} />
          </button>
        </div>
      </div>
      {showSteps && (
        <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            'Open this page in Safari (not Chrome)',
            'Tap the Share icon at the bottom of the screen',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" — done!',
          ].map((s, i) => <li key={i} style={{ fontSize: 12, color: 'rgba(241,245,249,0.65)', lineHeight: 1.5 }}>{s}</li>)}
        </ol>
      )}
    </div>
  )

  // ── Android / Desktop with native prompt ─────────────────────────────────
  if (prompt) return (
    <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, padding: '12px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 34, height: 34, background: 'rgba(16,185,129,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Download size={16} color="#10B981" />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9', margin: '0 0 2px' }}>Install ChildShield</p>
        <p style={{ fontSize: 11, color: 'rgba(241,245,249,0.5)', margin: 0 }}>Add to home screen for instant access</p>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={handleInstall} style={{ background: '#10B981', border: 'none', borderRadius: 8, padding: '7px 12px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          Install
        </button>
        <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,245,249,0.3)', padding: 4 }}>
          <X size={14} />
        </button>
      </div>
    </div>
  )

  // ── Android fallback — always show Chrome menu instructions ───────────────
  if (platform === 'android') return (
    <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, padding: '12px 14px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showSteps ? 10 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, background: 'rgba(16,185,129,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Smartphone size={14} color="#10B981" />
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9', margin: 0 }}>Install on Android</p>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {!showSteps && (
            <button onClick={() => setShowSteps(true)} style={{ background: '#10B981', border: 'none', borderRadius: 7, padding: '5px 10px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              How?
            </button>
          )}
          <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,245,249,0.3)', padding: 2 }}>
            <X size={14} />
          </button>
        </div>
      </div>
      {showSteps && (
        <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            'Tap the three-dot menu in the top-right corner of Chrome',
            'Tap "Add to Home screen" or "Install app"',
            'Tap "Add" to confirm',
          ].map((s, i) => <li key={i} style={{ fontSize: 12, color: 'rgba(241,245,249,0.65)', lineHeight: 1.5 }}>{s}</li>)}
        </ol>
      )}
    </div>
  )

  return null
}
