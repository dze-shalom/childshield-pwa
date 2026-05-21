import { Link } from 'react-router-dom'
import { MapPin, Clock, Eye, Share2, Wifi, MessageSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '../contexts/LanguageContext'

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
  const status = statusConfig[alert.status] || statusConfig.active
  const timeAgo = formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })
  const initials = alert.name.split(' ').map((n) => n[0]).join('').slice(0, 2)

  const handleWhatsAppShare = (e) => {
    e.preventDefault()
    const url = `${window.location.origin}/alert/${alert.id}`
    const message = `🚨 *MISSING CHILD ALERT*\n\n*ChildShield Cameroon*\n\n👤 *Name:* ${alert.name}\n🎂 *Age:* ${alert.age} years old (${alert.gender})\n📍 *Last seen:* ${alert.lastSeen}\n👗 *Description:* ${alert.description}\n\n📞 *Contact:* ${alert.contact || 'See link below'}\n\n🔗 Report a sighting:\n${url}\n\n_Please share widely. Every second counts._\n_ChildShield — Community Child Safety_`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 56, height: 56, background: 'rgba(239,68,68,0.15)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          {alert.photo
            ? <img src={alert.photo} alt={alert.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontWeight: 800, fontSize: 16, color: '#F1F5F9' }}>{initials}</span>
          }
          {status.dot && <span style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, background: '#EF4444', borderRadius: '50%', border: '2px solid #111827' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, color: '#F1F5F9', margin: 0 }}>{alert.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end', flexShrink: 0 }}>
              <span className={status.className}>{status.label}</span>
              {alert.source && <SourceTag source={alert.source} />}
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(241,245,249,0.5)', margin: '0 0 6px', lineHeight: 1.4 }}>{alert.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(241,245,249,0.35)' }}>
              <MapPin size={10} />{alert.lastSeen}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(241,245,249,0.35)' }}>
              <Clock size={10} />{timeAgo}
            </span>
            {alert.sightings?.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#F59E0B' }}>
                <Eye size={10} />{alert.sightings.length} sighting{alert.sightings.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />

      <div style={{ display: 'flex', gap: 8 }}>
        <Link to={`/alert/${alert.id}`} style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, color: 'rgba(241,245,249,0.7)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
          {t('card','viewDetails')}
        </Link>
        {alert.status === 'active' && (
          <button onClick={handleWhatsAppShare} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', background: 'rgba(16,185,129,0.12)', border: 'none', borderRadius: 10, color: '#10B981', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Share2 size={13} />{t('card','share')}
          </button>
        )}
      </div>
    </div>
  )
}
