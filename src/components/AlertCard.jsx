import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Eye, Share2, Wifi, MessageSquare, Navigation } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslatedAlert } from '../hooks/useTranslatedAlert'
import { distanceFromCoords } from '../lib/distance'

const statusConfig = {
  active: { label: 'MISSING', className: 'badge-active', dot: true },
  resolved: { label: 'FOUND', className: 'badge-resolved', dot: false },
  false_alarm: { label: 'FALSE ALARM', className: 'badge-review', dot: false },
}

const SourceTag = ({ source }) => source === 'bot'
  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(18,140,126,0.15)', border: '1px solid rgba(18,140,126,0.3)', borderRadius: 99, padding: '1px 7px', fontSize: 9, fontWeight: 700, color: '#128C7E' }}><MessageSquare size={7} /> WhatsApp Bot</span>
  : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 99, padding: '1px 7px', fontSize: 9, fontWeight: 700, color: '#3B82F6' }}><Wifi size={7} /> App</span>

export default function AlertCard({ alert }) {
  const { t } = useLanguage()
  const a = useTranslatedAlert(alert)
  const status = statusConfig[a.status] || statusConfig.active
  const timeAgo = formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })
  const initials = a.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  const distance = distanceFromCoords(alert.lat, alert.lng)
  const [photoCopied, setPhotoCopied] = useState(false)

  const handleWhatsAppShare = async (e) => {
    e.preventDefault()
    const url = `${window.location.origin}/alert/${a.id}`
    const message = `🚨 *${t('share','missingTitle')}*\n\n*${t('share','platform')}*\n\n👤 *${t('share','name')}:* ${a.name}\n🎂 *${t('share','age')}:* ${a.age} ${t('share','yearsOld')} (${a.gender})\n📍 *${t('share','lastSeen')}:* ${a.lastSeen}\n👗 *${t('share','description')}:* ${a.description}\n\n📞 *${t('share','contact')}:* ${a.contact || 'See link below'}\n\n🔗 ${t('share','reportLink')}:\n${url}\n\n_${t('share','appeal')}_\n_${t('share','footer')}_`

    // Try Web Share API with photo (works on mobile/PWA)
    if (a.photo && a.photoConsent && navigator.share) {
      try {
        const res = await fetch(a.photo)
        const blob = await res.blob()
        const file = new File([blob], `missing-${a.name.replace(/\s+/g, '-')}.jpg`, { type: blob.type })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: `Missing Child: ${a.name}`, text: message, files: [file] })
          return
        }
      } catch (_) {}
    }

    // Web Share API without photo
    if (navigator.share) {
      try { await navigator.share({ title: `Missing Child: ${a.name}`, text: message }); return } catch (_) {}
    }

    // Fallback: copy photo to clipboard, then open WhatsApp text link
    if (a.photo && a.photoConsent) {
      try {
        const res = await fetch(a.photo)
        const blob = await res.blob()
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
        setPhotoCopied(true)
        setTimeout(() => setPhotoCopied(false), 5000)
      } catch (_) {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 56, height: 56, background: 'rgba(239,68,68,0.15)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          {a.photo
            ? <img src={a.photo} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{initials}</span>
          }
          {status.dot && <span style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, background: '#EF4444', borderRadius: '50%', border: '2px solid var(--bg-card)' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>{a.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end', flexShrink: 0 }}>
              <span className={status.className}>{status.label}</span>
              {a.source && <SourceTag source={a.source} />}
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 6px', lineHeight: 1.4 }}>{a.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
              <MapPin size={10} />{a.lastSeen}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
              <Clock size={10} />{timeAgo}
            </span>
            {distance && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#60A5FA' }}>
                <Navigation size={10} />{distance}
              </span>
            )}
            {a.sightings?.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#F59E0B' }}>
                <Eye size={10} />{a.sightings.length} sighting{a.sightings.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--divider)', margin: '12px 0' }} />

      {photoCopied && (
        <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '6px 10px', marginBottom: 8, fontSize: 11, color: '#10B981', textAlign: 'center' }}>
          {t('alert', 'photoCopied')}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <Link to={`/alert/${a.id}`} style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--overlay-hover)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
          {t('card','viewDetails')}
        </Link>
        {a.status === 'active' && (
          <button onClick={handleWhatsAppShare} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', background: 'rgba(16,185,129,0.12)', border: 'none', borderRadius: 10, color: '#10B981', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Share2 size={13} />{t('card','share')}
          </button>
        )}
      </div>
    </div>
  )
}
