import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Share2, Eye, Plus, Phone, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { useApp } from '../contexts/AppContext'

export default function AlertDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { alerts, addSighting, resolveAlert, user } = useApp()
  const alert = alerts.find((a) => a.id === id)
  const [showSightingForm, setShowSightingForm] = useState(false)
  const [sighting, setSighting] = useState({ location: '', description: '', reportedBy: 'Anonymous' })
  const [submitted, setSubmitted] = useState(false)

  if (!alert) return (
    <div className="page flex items-center justify-center">
      <p className="text-white/40">Alert not found</p>
    </div>
  )

  const timeAgo = formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })
  const lastSeenDisplay = alert.lastSeenTime
    ? format(new Date(alert.lastSeenTime), 'EEEE, dd MMM yyyy · HH:mm')
    : 'Time not recorded'

  const shareMessage = () => {
    const url = `${window.location.origin}/alert/${alert.id}`
    const time = alert.lastSeenTime ? format(new Date(alert.lastSeenTime), 'dd MMM yyyy, HH:mm') : 'Unknown time'
    return `🚨 *MISSING CHILD ALERT*\n\n*ChildShield Cameroon*\n\n👤 *Name:* ${alert.name}\n🎂 *Age:* ${alert.age} years old (${alert.gender})\n📍 *Last seen:* ${alert.lastSeen}\n🕐 *Time:* ${time}\n👗 *Description:* ${alert.description}\n\n📞 *Contact:* ${alert.contact}\n\n🔗 Report sightings:\n${url}\n\n_Please share widely. Every second counts._\n_ChildShield — Community Child Safety_`
  }

  const handleShare = async () => {
    const message = shareMessage()
    // Try Web Share API with photo first (works on mobile browsers)
    if (alert.photo && navigator.share) {
      try {
        const res = await fetch(alert.photo)
        const blob = await res.blob()
        const file = new File([blob], `missing-${alert.name.replace(/\s+/g, '-')}.jpg`, { type: blob.type })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: `Missing Child: ${alert.name}`, text: message, files: [file] })
          return
        }
      } catch (_) { /* fall through */ }
    }
    // Web Share API without photo
    if (navigator.share) {
      try { await navigator.share({ title: `Missing Child: ${alert.name}`, text: message }); return } catch (_) { /* fall through */ }
    }
    // Fallback: WhatsApp link
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleSightingSubmit = () => {
    if (!sighting.location || !sighting.description) return
    addSighting(alert.id, sighting)
    setSighting({ location: '', description: '', reportedBy: 'Anonymous' })
    setShowSightingForm(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const statusBg = alert.status === 'active' ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'
  const statusText = alert.status === 'active' ? 'text-red-400' : 'text-emerald-400'
  const statusLabel = alert.status === 'active' ? '🚨 MISSING — HELP FIND THIS CHILD' : '✅ CHILD FOUND — RESOLVED'

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <h1 className="font-syne font-bold text-white text-lg flex-1">Alert Details</h1>
        {alert.status === 'active' && (
          <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 rounded-xl text-emerald-400 text-sm font-medium">
            <Share2 size={14} />
            Share
          </button>
        )}
      </div>

      {/* Status Banner */}
      <div className={`card p-3 mb-4 border ${statusBg} text-center`}>
        <p className={`font-syne font-bold text-sm ${statusText}`}>{statusLabel}</p>
      </div>

      {/* Child Profile Card */}
      <div className="card mb-4 overflow-hidden">
        {/* Full-width photo when available */}
        {alert.photo ? (
          <div style={{ position: 'relative' }}>
            <img
              src={alert.photo}
              alt={alert.name}
              style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 16px 14px', background: 'linear-gradient(to top, rgba(8,14,26,0.95), transparent)' }}>
              <h2 className="font-syne font-bold text-white text-xl" style={{ margin: 0 }}>{alert.name}</h2>
              <p className="text-white/70 text-sm" style={{ margin: '2px 0 0' }}>{alert.age} years old · {alert.gender}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 p-5">
            <div className="w-16 h-16 bg-red-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="font-syne font-extrabold text-xl text-white/70">
                {alert.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-syne font-bold text-white text-xl">{alert.name}</h2>
              <p className="text-white/50 text-sm">{alert.age} years old · {alert.gender}</p>
              <p className="text-white/40 text-xs mt-1">Reported {timeAgo}</p>
            </div>
          </div>
        )}
        {alert.photo && <p className="text-white/30 text-xs px-5 pt-2 pb-1" style={{ margin: 0 }}>Reported {timeAgo}</p>}

        <div className="mt-4 space-y-3 pt-4 border-t border-white/5 px-5 pb-5">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-red-400" />
            </div>
            <div>
              <p className="text-white/40 text-xs">Last Seen</p>
              <p className="text-white text-sm font-medium">{alert.lastSeen}</p>
              <p className="text-white/40 text-xs">{lastSeenDisplay}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye size={14} className="text-amber-400" />
            </div>
            <div>
              <p className="text-white/40 text-xs">Description</p>
              <p className="text-white text-sm leading-relaxed">{alert.description}</p>
            </div>
          </div>

          {alert.contact && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs">Contact</p>
                <a href={`tel:${alert.contact}`} className="text-blue-400 text-sm font-medium">{alert.contact}</a>
                <p className="text-white/40 text-xs">{alert.createdBy}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Share CTA */}
      {alert.status === 'active' && (
        <button onClick={handleShare} className="w-full card p-4 mb-4 flex items-center gap-4 hover:border-emerald-500/30 transition-all bg-emerald-500/5 border-emerald-500/20">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Share2 size={20} className="text-emerald-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-syne font-bold text-white text-sm">Share on WhatsApp Status</p>
            <p className="text-white/40 text-xs">Alert your contacts and increase visibility instantly</p>
          </div>
        </button>
      )}

      {/* Sightings */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-syne font-bold text-white">
            Community Sightings
            {alert.sightings.length > 0 && (
              <span className="ml-2 badge-review">{alert.sightings.length}</span>
            )}
          </h3>
          {alert.status === 'active' && (
            <button onClick={() => setShowSightingForm(!showSightingForm)} className="flex items-center gap-1 text-amber-400 text-sm font-medium">
              <Plus size={14} />
              I saw this child
            </button>
          )}
        </div>

        {submitted && (
          <div className="card p-3 mb-3 bg-emerald-500/10 border-emerald-500/30 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <p className="text-emerald-400 text-sm">Sighting submitted! Thank you for helping.</p>
          </div>
        )}

        {showSightingForm && (
          <div className="card p-4 mb-3 border-amber-500/20 animate-fade-up">
            <h4 className="font-syne font-bold text-white text-sm mb-3">Report a Sighting</h4>
            <div className="space-y-3">
              <input className="input-field" placeholder="Location (e.g. near GS Buea Town)" value={sighting.location} onChange={(e) => setSighting((s) => ({ ...s, location: e.target.value }))} />
              <textarea className="input-field resize-none" rows={2} placeholder="What did you see? When? Any other details..." value={sighting.description} onChange={(e) => setSighting((s) => ({ ...s, description: e.target.value }))} />
              <div className="flex gap-2">
                <button className="btn-secondary flex-1 py-2 text-sm" onClick={() => setShowSightingForm(false)}>Cancel</button>
                <button className="btn-primary flex-1 py-2 text-sm" onClick={handleSightingSubmit}>Submit Sighting</button>
              </div>
            </div>
          </div>
        )}

        {alert.sightings.length === 0 ? (
          <div className="card p-6 text-center">
            <Eye size={28} className="text-white/20 mx-auto mb-2" />
            <p className="text-white/40 text-sm">No sightings reported yet</p>
            {alert.status === 'active' && <p className="text-white/30 text-xs mt-1">Be the first to help — report if you see this child</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {alert.sightings.map((s) => (
              <div key={s.id} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <Eye size={12} className="text-amber-400" />
                    </div>
                    <span className="text-white/60 text-xs">{s.reportedBy}</span>
                  </div>
                  {s.verified && (
                    <span className="badge-resolved text-[10px]">Verified</span>
                  )}
                </div>
                <p className="text-white/80 text-sm mb-1">📍 {s.location}</p>
                <p className="text-white/50 text-xs leading-relaxed">{s.description}</p>
                <p className="text-white/30 text-xs mt-2">{formatDistanceToNow(new Date(s.time), { addSuffix: true })}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Moderator: Resolve */}
      {alert.status === 'active' && (user?.role === 'moderator' || user?.role === 'admin') && (
        <button onClick={() => resolveAlert(alert.id)} className="w-full py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-emerald-400 font-semibold text-sm transition-all">
          ✅ Mark as Resolved — Child Found
        </button>
      )}
    </div>
  )
}
