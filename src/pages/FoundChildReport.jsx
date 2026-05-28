import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Phone, CheckCircle2, X, User, AlertCircle } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useLanguage } from '../contexts/LanguageContext'

const AREAS = [
  'Buea Town, Buea', 'Molyko, Buea', 'Sandpit, Buea', 'Bonduma, Buea',
  'Mile 4, Limbe', 'Down Beach, Limbe', 'Bota, Limbe', 'Mile 2, Limbe',
  'Bonaberi, Douala', 'Akwa, Douala', 'Bonanjo, Douala', 'Makepe, Douala',
  'Biyem-Assi, Yaoundé', 'Mvan, Yaoundé', 'Mendong, Yaoundé', 'Other',
]

const CONFIDENCE_CONFIG = {
  high:   { label: 'Strong Match',    color: '#10B981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.3)' },
  medium: { label: 'Possible Match',  color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)' },
  low:    { label: 'Weak Match',      color: '#6B7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)' },
}

export default function FoundChildReport() {
  const navigate = useNavigate()
  const { addFoundChild } = useApp()
  const { t } = useLanguage()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState(null)
  const [notified, setNotified] = useState([])
  const [photoPreview, setPhotoPreview] = useState(null)

  const [form, setForm] = useState({
    name: '', description: '', ageEstimate: '', gender: '',
    location: '', currentLocation: '', contact: '', photo: null,
  })
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setPhotoPreview(ev.target.result); update('photo', ev.target.result) }
    reader.readAsDataURL(file)
  }

  // Submit → save → auto-match → auto-notify parents
  const handleSubmit = async () => {
    setStep(3)
    setLoading(true)

    await addFoundChild({
      name: form.name || null,
      description: form.description,
      ageEstimate: form.ageEstimate,
      gender: form.gender,
      location: form.location,
      contact: form.contact,
      photo: form.photo,
    })

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ found: { ...form, name: form.name || null } }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      setMatches(data.matches || [])
      setNotified(data.notified || [])
    } catch {
      setMatches([]) // API unavailable — treat as no matches
    } finally {
      setLoading(false)
    }
  }

  const canStep2 = !!form.description
  const canSubmit = !!form.location && !!form.contact

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => step === 1 ? navigate(-1) : step === 2 ? setStep(1) : null}
          className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center"
          style={{ opacity: step === 3 ? 0.3 : 1, pointerEvents: step === 3 ? 'none' : 'auto' }}
        >
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <div>
          <h1 className="font-syne font-bold text-white text-lg">{t('found','title')}</h1>
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
              {t('found','step1hint')}
            </p>
          </div>

          {/* Photo */}
          <div className="card p-4 flex flex-col items-center gap-3 border-dashed border-white/10">
            <input id="found-photo" type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
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
            <p className="text-white/40 text-xs text-center">Photo helps greatly (optional)</p>
            <label htmlFor="found-photo" className="btn-secondary text-sm py-2 px-4 cursor-pointer">
              {photoPreview ? 'Change Photo' : 'Add Photo'}
            </label>
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">{t('found','descLabel')}</label>
            <textarea className="input-field resize-none" rows={4}
              placeholder={t('found','descPH')}
              value={form.description} onChange={e => update('description', e.target.value)} />
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">
              Child's Name <span className="text-white/25 normal-case tracking-normal">(if child told you — optional)</span>
            </label>
            <input className="input-field" placeholder="e.g. Emmanuel, Amina…"
              value={form.name} onChange={e => update('name', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">{t('found','approxAge')}</label>
              <select className="input-field" value={form.ageEstimate} onChange={e => update('ageEstimate', e.target.value)}>
                <option value="">{t('found','unknown')}</option>
                <option value="under 5">Under 5</option>
                <option value="5-8">5–8 years</option>
                <option value="9-12">9–12 years</option>
                <option value="13-17">13–17 years</option>
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">{t('found','gender')}</label>
              <select className="input-field" value={form.gender} onChange={e => update('gender', e.target.value)}>
                <option value="">{t('found','unknown')}</option>
                <option value="Female">{t('found','girl')}</option>
                <option value="Male">{t('found','boy')}</option>
              </select>
            </div>
          </div>

          <button className="btn-primary w-full" disabled={!canStep2}
            style={{ background: '#F59E0B', opacity: canStep2 ? 1 : 0.4 }}
            onClick={() => setStep(2)}>
            {t('found','nextStep')}
          </button>
        </div>
      )}

      {/* ── Step 2: Location + Contact ── */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">{t('found','whereFound')}</label>
            <select className="input-field" value={form.location} onChange={e => update('location', e.target.value)}>
              <option value="">Select area...</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">{t('found','whereNow')}</label>
            <textarea className="input-field resize-none" rows={2}
              placeholder={t('found','whereNowPH')}
              value={form.currentLocation} onChange={e => update('currentLocation', e.target.value)} />
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">{t('found','yourContact')}</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input className="input-field pl-9" placeholder="+237 6XX XXX XXX" type="tel"
                value={form.contact} onChange={e => update('contact', e.target.value)} />
            </div>
            <p className="text-white/30 text-xs mt-1.5">
              If we find a match, the child's family will receive a WhatsApp with your number — and you'll see their contact here too.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setStep(1)}>← Back</button>
            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              style={{
                flex: 2, background: canSubmit ? '#F59E0B' : 'rgba(245,158,11,0.2)',
                border: 'none', borderRadius: 12, padding: '12px',
                color: canSubmit ? '#fff' : 'rgba(245,158,11,0.4)',
                fontWeight: 700, fontSize: 14,
                cursor: canSubmit ? 'pointer' : 'default',
              }}>
              {t('found','submitBtn')}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Auto-results ── */}
      {step === 3 && (
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-5">
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(245,158,11,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 28 }}>🔍</span>
              </div>
              <div className="text-center">
                <p className="font-syne font-bold text-white text-lg mb-2">{t('found','searching')}</p>
                <p className="text-white/40 text-sm max-w-xs leading-relaxed">{t('found','searchSub')}</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Report confirmed */}
              <div className="card p-4 bg-emerald-500/5 border-emerald-500/20 flex gap-3 mb-5">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-syne font-bold text-white text-sm">{t('found','submitted')}</p>
                  <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
                    {notified.length > 0
                      ? `${t('found','notified')} ${notified.join(', ')}.`
                      : 'Your report has been saved. We searched active alerts for a possible match.'}
                  </p>
                </div>
              </div>

              {/* Safety guard: matches must be a resolved array before rendering */}
              {(matches ?? []).length === 0 ? (
                <div className="card p-8 text-center">
                  <User size={32} className="text-white/20 mx-auto mb-3" />
                  <p className="font-syne font-bold text-white text-base mb-2">{t('found','noMatch')}</p>
                  <p className="text-white/40 text-sm leading-relaxed mb-4">{t('found','noMatchSub')}</p>
                  <p className="text-amber-400 text-sm font-semibold mb-3">{t('help','footer')}</p>
                  <a href="tel:17" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#3B82F6', borderRadius: 10, padding: '10px', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                    <Phone size={14} /> {t('found','callPolice')}
                  </a>
                </div>
              ) : (
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">
                    {matches.length} possible match{matches.length > 1 ? 'es' : ''} found
                  </p>
                  <div className="space-y-4">
                    {(matches || []).map((m, i) => {
                      const cfg = CONFIDENCE_CONFIG[m.level] || CONFIDENCE_CONFIG.low
                      const wasNotified = notified.includes(m.alert.name)
                      return (
                        <div key={i} className="card p-4" style={{ background: cfg.bg, borderColor: cfg.border }}>
                          <div className="flex items-center justify-between mb-3">
                            <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.color + '25', borderRadius: 99, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: 1 }}>
                              {cfg.label} — {m.confidence}%
                            </span>
                            {wasNotified && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', background: 'rgba(16,185,129,0.15)', borderRadius: 99, padding: '3px 10px' }}>
                                ✓ {t('found','familyNotified')}
                              </span>
                            )}
                          </div>

                          <p className="font-syne font-bold text-white text-base mb-0.5">{m.alert.name}</p>
                          <p className="text-white/50 text-xs mb-2">
                            {m.alert.age} years old · {m.alert.gender} · Last seen: {m.alert.lastSeen}
                          </p>
                          <p className="text-white/60 text-xs leading-relaxed mb-3">{m.alert.description}</p>

                          <div style={{ background: 'var(--overlay-hover)', borderRadius: 8, padding: '8px 10px', marginBottom: 12 }}>
                            <p className="text-white/40 text-xs">AI: <span className="text-white/60">{m.reason}</span></p>
                          </div>

                          <p className="text-white/40 text-xs mb-2">Reported by: {m.alert.createdBy}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <a href={`tel:${m.alert.contact}`}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: cfg.color, borderRadius: 10, padding: '10px', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                              <Phone size={14} /> Call {m.alert.contact}
                            </a>
                            <a href={`https://wa.me/${m.alert.contact?.replace(/[\s+]/g, '')}`}
                              target="_blank" rel="noreferrer"
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#128C7E', borderRadius: 10, padding: '10px', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                              {t('found','whatsappFam')}
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-white/25 text-xs text-center mt-4 leading-relaxed">
                    {t('found','aiNote')}
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
