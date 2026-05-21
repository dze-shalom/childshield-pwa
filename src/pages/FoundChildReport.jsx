import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Phone, CheckCircle2, X, Search, AlertCircle, User } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useLanguage } from '../contexts/LanguageContext'

const AREAS = [
  'Buea Town, Buea', 'Molyko, Buea', 'Sandpit, Buea', 'Bonduma, Buea',
  'Mile 4, Limbe', 'Down Beach, Limbe', 'Bota, Limbe', 'Mile 2, Limbe',
  'Bonaberi, Douala', 'Akwa, Douala', 'Bonanjo, Douala', 'Makepe, Douala',
  'Biyem-Assi, Yaoundé', 'Mvan, Yaoundé', 'Mendong, Yaoundé',
  'Other',
]

const CONFIDENCE_CONFIG = {
  high:   { label: 'High Match',   color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)' },
  medium: { label: 'Possible Match', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  low:    { label: 'Weak Match',   color: '#6B7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)' },
}

export default function FoundChildReport() {
  const navigate = useNavigate()
  const { addFoundChild } = useApp()
  const { t } = useLanguage()

  const [step, setStep] = useState(1) // 1: describe, 2: location+contact, 3: results
  const [matching, setMatching] = useState(false)
  const [matches, setMatches] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    description: '', ageEstimate: '', gender: '', location: '', contact: '', photo: null,
  })
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setPhotoPreview(ev.target.result); update('photo', ev.target.result) }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    setStep(3)
    setMatching(true)

    // Save to Supabase via AppContext
    await addFoundChild({
      description: form.description,
      ageEstimate: form.ageEstimate,
      gender: form.gender,
      location: form.location,
      contact: form.contact,
      photo: form.photo,
    })

    // Run AI matching via Vercel function
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ found: form }),
      })
      const data = await res.json()
      setMatches(data.matches || [])
    } catch {
      setMatches([])
    } finally {
      setMatching(false)
    }
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step === 1 ? navigate(-1) : setStep(s => s - 1)}
          className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <div>
          <h1 className="font-syne font-bold text-white text-lg">I Found a Child</h1>
          {step < 3 && <p className="text-white/40 text-xs">Step {step} of 2</p>}
        </div>
      </div>

      {/* Progress */}
      {step < 3 && (
        <div className="flex gap-2 mb-6">
          {[1, 2].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-amber-500' : 'bg-white/10'}`} />
          ))}
        </div>
      )}

      {/* ── Step 1: Describe the child ── */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="card p-4 bg-amber-500/5 border-amber-500/20 flex gap-3">
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/60 text-sm leading-relaxed">
              Describe the child as accurately as possible. Our system will automatically search for matching missing child alerts.
            </p>
          </div>

          {/* Photo */}
          <div className="card p-4 flex flex-col items-center gap-3 border-dashed border-white/10">
            <input ref={fileInputRef} id="found-photo" type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
            {photoPreview
              ? <div className="relative">
                  <img src={photoPreview} alt="Found child" className="w-24 h-24 rounded-2xl object-cover" />
                  <button onClick={() => { setPhotoPreview(null); update('photo', null) }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              : <label htmlFor="found-photo" className="w-20 h-20 bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer">
                  <Camera size={22} className="text-white/30" />
                  <span className="text-white/30 text-xs">Photo</span>
                </label>
            }
            <p className="text-white/40 text-xs text-center">Photo of the child helps greatly (optional)</p>
            <label htmlFor="found-photo" className="btn-secondary text-sm py-2 px-4 cursor-pointer">
              {photoPreview ? 'Change Photo' : 'Add Photo'}
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Describe the child *</label>
            <textarea className="input-field resize-none" rows={4}
              placeholder="What are they wearing? Physical features, hair, any marks or accessories. The more detail, the better the match."
              value={form.description} onChange={e => update('description', e.target.value)} />
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Approx. Age</label>
              <select className="input-field" value={form.ageEstimate} onChange={e => update('ageEstimate', e.target.value)}>
                <option value="">Unknown</option>
                <option value="under 5">Under 5 years</option>
                <option value="5-8">5–8 years</option>
                <option value="9-12">9–12 years</option>
                <option value="13-17">13–17 years</option>
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Gender</label>
              <select className="input-field" value={form.gender} onChange={e => update('gender', e.target.value)}>
                <option value="">Unknown</option>
                <option value="Female">Girl</option>
                <option value="Male">Boy</option>
              </select>
            </div>
          </div>

          <button className="btn-primary w-full" disabled={!form.description} onClick={() => setStep(2)}
            style={{ background: '#F59E0B', opacity: form.description ? 1 : 0.5 }}>
            Next: Location & Contact →
          </button>
        </div>
      )}

      {/* ── Step 2: Location + Contact ── */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Where did you find the child? *</label>
            <select className="input-field" value={form.location} onChange={e => update('location', e.target.value)}>
              <option value="">Select area...</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Where is the child right now?</label>
            <textarea className="input-field resize-none" rows={2}
              placeholder="e.g. I have the child with me, child is at Molyko Police Station, child is at Buea Hospital..."
              value={form.currentLocation} onChange={e => update('currentLocation', e.target.value)} />
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Your Contact Number *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input className="input-field pl-9" placeholder="+237 6XX XXX XXX" type="tel"
                value={form.contact} onChange={e => update('contact', e.target.value)} />
            </div>
            <p className="text-white/30 text-xs mt-1.5">Parents of missing children will be able to reach you directly.</p>
          </div>

          <div className="card p-4 bg-amber-500/5 border-amber-500/20">
            <p className="text-white/50 text-xs leading-relaxed">
              After you submit, our AI will search through active missing child alerts for a match. If found, you will see the parent's contact details immediately.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setStep(1)}>← Back</button>
            <button
              disabled={!form.location || !form.contact}
              onClick={handleSubmit}
              style={{ flex: 2, background: (form.location && form.contact) ? '#F59E0B' : 'rgba(245,158,11,0.2)', border: 'none', borderRadius: 12, padding: '12px', color: (form.location && form.contact) ? '#fff' : 'rgba(245,158,11,0.4)', fontWeight: 700, fontSize: 14, cursor: (form.location && form.contact) ? 'pointer' : 'default' }}>
              🔍 Search for Matches
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Results ── */}
      {step === 3 && (
        <div>
          {matching ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={24} className="text-amber-400" />
              </div>
              <p className="font-syne font-bold text-white text-lg">Searching alerts...</p>
              <p className="text-white/40 text-sm text-center max-w-xs">
                Our AI is comparing your description against all active missing child alerts in Cameroon.
              </p>
            </div>
          ) : matches !== null && (
            <div>
              {/* Report confirmed */}
              <div className="card p-4 bg-emerald-500/8 border-emerald-500/20 flex gap-3 mb-6">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-syne font-bold text-white text-sm">Report submitted</p>
                  <p className="text-white/50 text-xs mt-0.5">Your contact number has been saved. If a new alert matches, you'll be notified.</p>
                </div>
              </div>

              {matches.length === 0 ? (
                <div className="card p-8 text-center">
                  <User size={32} className="text-white/20 mx-auto mb-3" />
                  <p className="font-syne font-bold text-white text-base mb-2">No matches found yet</p>
                  <p className="text-white/40 text-sm leading-relaxed">
                    No active alert matches this description right now. Your report is saved — if a matching alert is posted later, moderators will be notified.
                  </p>
                  <p className="text-white/50 text-sm mt-4 font-semibold">In the meantime, please also call:</p>
                  <a href="tel:17" className="btn-primary mt-3 flex items-center justify-center gap-2 text-sm" style={{ textDecoration: 'none' }}>
                    <Phone size={14} /> Police — 17
                  </a>
                </div>
              ) : (
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">
                    {matches.length} potential match{matches.length > 1 ? 'es' : ''} found
                  </p>
                  <div className="space-y-4">
                    {matches.map((m, i) => {
                      const cfg = CONFIDENCE_CONFIG[m.level] || CONFIDENCE_CONFIG.low
                      return (
                        <div key={i} className="card p-4" style={{ background: cfg.bg, borderColor: cfg.border }}>
                          {/* Confidence badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.color + '20', borderRadius: 99, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: 1 }}>
                              {cfg.label} — {m.confidence}%
                            </span>
                          </div>

                          {/* Child info */}
                          <p className="font-syne font-bold text-white text-base mb-0.5">{m.alert.name}</p>
                          <p className="text-white/50 text-xs mb-2">{m.alert.age} years old · {m.alert.gender} · Last seen: {m.alert.lastSeen}</p>
                          <p className="text-white/60 text-xs leading-relaxed mb-3">{m.alert.description}</p>

                          {/* AI reason */}
                          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px', marginBottom: 12 }}>
                            <p className="text-white/40 text-xs">AI reasoning: <span className="text-white/60">{m.reason}</span></p>
                          </div>

                          {/* Contact */}
                          <p className="text-white/40 text-xs mb-2">Reported by: {m.alert.createdBy}</p>
                          <a href={`tel:${m.alert.contact}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: cfg.color, border: 'none', borderRadius: 10, padding: '10px', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                            <Phone size={14} /> Call {m.alert.contact}
                          </a>
                          <a href={`https://wa.me/${m.alert.contact?.replace(/\s+/g, '').replace('+', '')}`}
                            target="_blank" rel="noreferrer"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#128C7E', border: 'none', borderRadius: 10, padding: '10px', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', marginTop: 8 }}>
                            WhatsApp the parent
                          </a>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-white/30 text-xs text-center mt-4 leading-relaxed">
                    These are AI suggestions — always confirm visually before making contact. Call 17 if the situation is urgent.
                  </p>
                </div>
              )}

              <button className="btn-secondary w-full mt-6" onClick={() => navigate('/')}>Back to Home</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
