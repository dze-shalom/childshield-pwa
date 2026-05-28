import { useState } from 'react'
import { Phone, MapPin, Clock, Share2, Navigation } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslatedFoundChild } from '../hooks/useTranslatedFoundChild'
import { distanceFromLocationText } from '../lib/distance'
import ShareSheet from './ShareSheet'

export default function FoundChildCard({ found }) {
  const { t } = useLanguage()
  const f = useTranslatedFoundChild(found)
  const distance = distanceFromLocationText(found.location)
  const timeAgo = f.foundAt
    ? formatDistanceToNow(new Date(f.foundAt), { addSuffix: true })
    : ''
  const [showShare, setShowShare] = useState(false)

  const gender = f.gender
    ? (found.gender === 'Female' ? t('found', 'girl') : t('found', 'boy'))
    : t('found', 'unknown')
  const shareMsg =
    `🟡 *${t('share', 'platform')}*\n\n` +
    `*FOUND CHILD — HELP IDENTIFY*\n\n` +
    (f.name ? `🏷️ *Child's name:* ${f.name}\n` : '') +
    `👶 *${t('share', 'description')}:* ${f.description}\n` +
    `📍 *${t('share', 'lastSeen')}:* ${f.location}\n` +
    (f.ageEstimate ? `🎂 *${t('share', 'age')}:* ${f.ageEstimate}\n` : '') +
    (f.gender ? `👤 *${gender}*\n` : '') +
    `\n📞 *${t('share', 'contact')}:* ${f.contact}\n\n` +
    `_${t('share', 'footer')}_\n${window.location.origin}`

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
          {f.photo
            ? <img src={f.photo} alt="Found child" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

          {f.ageEstimate || f.gender ? (
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px' }}>
              {[f.ageEstimate, f.gender && (found.gender === 'Female' ? t('found', 'girl') : t('found', 'boy'))].filter(Boolean).join(' · ')}
            </p>
          ) : null}

          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 6px', lineHeight: 1.4 }}>
            {f.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
              <MapPin size={10} />{f.location}
            </span>
            {timeAgo && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                <Clock size={10} />{timeAgo}
              </span>
            )}
            {distance && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#60A5FA' }}>
                <Navigation size={10} />{distance}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(245,158,11,0.15)', margin: '12px 0' }} />

      <div style={{ display: 'flex', gap: 8 }}>
        <a
          href={`tel:${f.contact}`}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 5, padding: '8px',
            background: 'rgba(245,158,11,0.12)', borderRadius: 10,
            color: '#F59E0B', fontSize: 12, fontWeight: 600, textDecoration: 'none',
          }}
        >
          <Phone size={13} />{f.contact}
        </a>
        <button
          onClick={() => setShowShare(true)}
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

      <ShareSheet
        open={showShare}
        onClose={() => setShowShare(false)}
        message={shareMsg}
        photo={f.photo}
        title="Found Child — Help Identify"
      />
    </div>
  )
}
