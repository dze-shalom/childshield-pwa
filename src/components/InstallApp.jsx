import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !('MSStream' in window)
const isChromeiOS = () => isIOS() && /CriOS/i.test(navigator.userAgent)
const isAndroid = () => /android/i.test(navigator.userAgent)
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

// Opens the current URL in Safari by stripping the googlechrome:// scheme
const openInSafari = () => {
  window.location.href = window.location.href.replace(/^https?/, 'safari')
}

export default function InstallApp() {
  const { t, tArr } = useLanguage()
  const [prompt, setPrompt] = useState(window.__pwaInstallPrompt || null)
  const [platform, setPlatform] = useState(null)
  const [showSteps, setShowSteps] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (isStandalone()) { setDismissed(true); return }

    if (isChromeiOS())     setPlatform('chrome-ios')
    else if (isIOS())      setPlatform('ios')
    else if (isAndroid())  setPlatform('android')
    else                   setPlatform('desktop')

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

  // ── Chrome on iOS — must open in Safari first ─────────────────────────────
  if (platform === 'chrome-ios') return (
    <div style={{ background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.3)', borderRadius: 14, padding: '14px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
            Open in Safari to install
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
            Chrome on iPhone can't install apps to the home screen. You need to open this page in <strong>Safari</strong> first.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={openInSafari}
              style={{ background: '#EA580C', border: 'none', borderRadius: 8, padding: '7px 14px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              Open in Safari
            </button>
          </div>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '8px 0 0', lineHeight: 1.4 }}>
            Or copy the URL from the address bar, open Safari, and paste it there.
          </p>
        </div>
        <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, flexShrink: 0 }}>
          <X size={14} />
        </button>
      </div>
    </div>
  )

  // ── iOS Safari — show step-by-step ────────────────────────────────────────
  if (platform === 'ios') return (
    <div style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 14, padding: '12px 14px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showSteps ? 12 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, background: 'rgba(59,130,246,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Share icon — matches iOS Safari Share button */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {t('install', 'iphone')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {!showSteps && (
            <button onClick={() => setShowSteps(true)} style={{ background: '#3B82F6', border: 'none', borderRadius: 7, padding: '5px 10px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {t('install', 'how')}
            </button>
          )}
          <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
            <X size={14} />
          </button>
        </div>
      </div>
      {showSteps && (
        <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Make sure you are in <strong style={{ color: 'var(--text-primary)' }}>Safari</strong> (not Chrome or another browser)
          </li>
          <li style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Tap the <strong style={{ color: 'var(--text-primary)' }}>Share button</strong> — the box with an upward arrow (↑) at the bottom of the screen
          </li>
          <li style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Scroll down in the menu and tap <strong style={{ color: 'var(--text-primary)' }}>"Add to Home Screen"</strong>
          </li>
          <li style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Tap <strong style={{ color: 'var(--text-primary)' }}>"Add"</strong> in the top right — done! ✅
          </li>
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
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{t('install', 'installCs')}</p>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>{t('install', 'installSub')}</p>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={handleInstall} style={{ background: '#10B981', border: 'none', borderRadius: 8, padding: '7px 12px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          {t('install', 'install')}
        </button>
        <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
          <X size={14} />
        </button>
      </div>
    </div>
  )

  // ── Android fallback ──────────────────────────────────────────────────────
  if (platform === 'android') return (
    <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, padding: '12px 14px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showSteps ? 10 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, background: 'rgba(16,185,129,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Smartphone size={14} color="#10B981" />
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{t('install', 'android')}</p>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {!showSteps && (
            <button onClick={() => setShowSteps(true)} style={{ background: '#10B981', border: 'none', borderRadius: 7, padding: '5px 10px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              How?
            </button>
          )}
          <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
            <X size={14} />
          </button>
        </div>
      </div>
      {showSteps && (
        <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {tArr('install', 'androidSteps').map((s, i) => (
            <li key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</li>
          ))}
        </ol>
      )}
    </div>
  )

  return null
}
