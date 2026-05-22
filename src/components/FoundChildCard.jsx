import { Phone, MapPin, Clock, Share2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '../contexts/LanguageContext'

export default function FoundChildCard({ found }) {
  const { t } = useLanguage()
  const timeAgo = found.foundAt
    ? formatDistanceToNow(new Date(found.foundAt), { addSuffix: true })
    : ''

  const handleShare = (e) => {
    e.preventDefault()
    const url = window.location.origin
    const gender = found.gender
      ? (found.gender === 'Female' ? t('found', 'girl') : t('found', 'boy'))
      : t('found', 'unknown')
    const msg =
      `🟡 *${t('share', 'platform')}*\n\n` +
      `*FOUND CHILD — HELP IDENTIFY*\n\n` +
      `👶 *${t('share', 'description')}:* ${found.description}\n` +
      `📍 *${t('share', 'lastSeen')}:* ${found.location}\n` +
      (found.ageEstimate ? `🎂 *${t('share', 'age')}:* ${found.ageEstimate}\n` : '') +
      (found.gender ? `👤 *${gender}*\n` : '') +
      `\n📞 *${t('share', 'contact')}:* ${found.contact}\n\n` +
      `_${t('share', 'footer')}_\n${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div style={{
      background: 'rgba(245,158,11,0.06)',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 16,
      padding: 14,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Photo or placeholder */}
        <div style={{
          width: 56, height: 56,
          background: 'rgba(245,158,11,0.12)',
          borderRadius: 13,
          flexShrink: 0,
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {found.photo
            ? <img src={found.photo} alt="Found child" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 24 }}>🧒</span>
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#F59E0B',
              background: 'rgba(245,158,11,0.15)', borderRadius: 99,
              padding: '2px 9px', textTransform: 'uppercase', letterSpacing: 1,
            }}>
              Found — Help Identify
            </span>
          </div>

          {found.ageEstimate || found.gender ? (
            <p style={{ fontSize: 12, fontWeight: 600, color: '#F1F5F9', margin: '0 0 3px' }}>
              {[found.ageEstimate, found.gender && (found.gender === 'Female' ? t('found', 'girl') : t('found', 'boy'))].filter(Boolean).join(' · ')}
            </p>
          ) : null}

          <p style={{ fontSize: 12, color: 'rgba(241,245,249,0.55)', margin: '0 0 6px', lineHeight: 1.4 }}>
            {found.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(241,245,249,0.35)' }}>
              <MapPin size={10} />{found.location}
            </span>
            {timeAgo && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(241,245,249,0.35)' }}>
                <Clock size={10} />{timeAgo}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(245,158,11,0.12)', margin: '12px 0' }} />

      <div style={{ display: 'flex', gap: 8 }}>
        <a
          href={`tel:${found.contact}`}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 5, padding: '8px',
            background: 'rgba(245,158,11,0.12)', borderRadius: 10,
            color: '#F59E0B', fontSize: 12, fontWeight: 600, textDecoration: 'none',
          }}
        >
          <Phone size={13} />{found.contact}
        </a>
        <button
          onClick={handleShare}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 12px',
            background: 'rgba(16,185,129,0.12)', border: 'none', borderRadius: 10,
            color: '#10B981', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Share2 size={13} />{t('card', 'share')}
        </button>
      </div>
    </div>
  )
}
