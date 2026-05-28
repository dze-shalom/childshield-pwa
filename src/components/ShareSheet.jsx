import { useState } from 'react'
import { X, Copy, Link, Image } from 'lucide-react'

const dataUrlToBlob = (dataUrl) => {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

// WhatsApp SVG (official green)
const WhatsAppIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// Facebook SVG
const FacebookIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

export default function ShareSheet({ open, onClose, message, url, photo, title }) {
  const [copied, setCopied] = useState(null) // 'link' | 'message' | 'photo'

  if (!open) return null

  const flash = (type) => {
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleWhatsApp = async () => {
    onClose()

    // iOS Safari passes text to native share sheet but WhatsApp drops it when
    // a file is also included — only the photo arrives. Skip file sharing on iOS
    // and use wa.me which reliably pre-fills the full message on all platforms.
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    if (!isIOS && photo && navigator.canShare) {
      try {
        const blob = dataUrlToBlob(photo)
        const file = new File([blob], 'alert-photo.jpg', { type: blob.type })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title: title || 'ChildShield Alert', text: message, files: [file] })
          return
        }
      } catch (_) {}
    }

    // wa.me opens WhatsApp with the full message pre-filled (works on iOS + Android)
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleFacebook = () => {
    onClose()
    if (!url) return
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  const handleCopyMessage = async () => {
    try { await navigator.clipboard.writeText(message) } catch (_) {}
    flash('message')
    setTimeout(() => onClose(), 1800)
  }

  const handleCopyPhoto = async () => {
    if (!photo) return
    if (!navigator.clipboard?.write) {
      // iOS Safari doesn't support clipboard image writing
      setCopied('photo-unsupported')
      setTimeout(() => setCopied(null), 3000)
      return
    }
    try {
      // Clipboard API only accepts image/png — convert from jpeg via canvas
      const img = new Image()
      img.src = photo
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej })
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.getContext('2d').drawImage(img, 0, 0)
      const pngBlob = await new Promise((res) => canvas.toBlob(res, 'image/png'))
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })])
      flash('photo')
    } catch {
      setCopied('photo-unsupported')
      setTimeout(() => setCopied(null), 3000)
    }
  }

  const handleCopyLink = async () => {
    if (!url) return
    try { await navigator.clipboard.writeText(url) } catch (_) {}
    flash('link')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200 }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg-card)',
        borderRadius: '20px 20px 0 0',
        padding: '12px 16px 36px',
        zIndex: 201,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.45)',
        maxWidth: 480, margin: '0 auto',
      }}>
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 99, margin: '0 auto 18px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 16, margin: 0 }}>Share Alert</p>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>

        {/* App icons row */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 22 }}>
          {/* WhatsApp */}
          <button onClick={handleWhatsApp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <div style={{ width: 56, height: 56, background: '#25D366', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}>
              <WhatsAppIcon />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>WhatsApp</span>
          </button>

          {/* Facebook */}
          {url && (
            <button onClick={handleFacebook} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
              <div style={{ width: 56, height: 56, background: '#1877F2', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(24,119,242,0.3)' }}>
                <FacebookIcon />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Facebook</span>
            </button>
          )}

          {/* Spacer to balance layout when only one app icon */}
          {!url && <div style={{ flex: 1 }} />}
          <div style={{ flex: 1 }} />
          <div style={{ flex: 1 }} />
        </div>

        <div style={{ height: 1, background: 'var(--divider)', marginBottom: 8 }} />

        {/* Copy actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={handleCopyMessage} style={rowStyle}>
            <div style={iconBox}><Copy size={16} color="var(--text-secondary)" /></div>
            <div style={{ textAlign: 'left' }}>
              <p style={rowTitle}>{copied === 'message' ? '✓ Copied!' : 'Copy Message'}</p>
              <p style={rowSub}>Full alert text ready to paste anywhere</p>
            </div>
          </button>

          {photo && (
            <button onClick={handleCopyPhoto} style={rowStyle}>
              <div style={iconBox}><Image size={16} color="var(--text-secondary)" /></div>
              <div style={{ textAlign: 'left' }}>
                <p style={rowTitle}>
                  {copied === 'photo' ? '✓ Photo copied!' : copied === 'photo-unsupported' ? 'Not supported on this device' : 'Copy Photo'}
                </p>
                <p style={rowSub}>Copy photo to paste in any chat</p>
              </div>
            </button>
          )}

          {url && (
            <button onClick={handleCopyLink} style={rowStyle}>
              <div style={iconBox}><Link size={16} color="var(--text-secondary)" /></div>
              <div style={{ textAlign: 'left' }}>
                <p style={rowTitle}>{copied === 'link' ? '✓ Copied!' : 'Copy Link'}</p>
                <p style={rowSub}>Direct link to this alert</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  )
}

const rowStyle = {
  display: 'flex', alignItems: 'center', gap: 12,
  background: 'none', border: 'none', cursor: 'pointer',
  padding: '10px 4px', borderRadius: 10, width: '100%',
}
const iconBox = {
  width: 36, height: 36,
  background: 'rgba(255,255,255,0.06)',
  borderRadius: 10,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
}
const rowTitle = { color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, margin: 0 }
const rowSub   = { color: 'var(--text-muted)',    fontSize: 11, margin: '1px 0 0' }
