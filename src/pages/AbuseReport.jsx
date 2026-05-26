import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, X, Lock, Shield, Heart, Phone, MapPin, AlertTriangle, CheckCircle2, User, Users, BookOpen, Eye, FileText, Lightbulb, AlertOctagon, Building2, ShieldAlert } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useLanguage } from '../contexts/LanguageContext'

const quickExit = () => { window.location.href = 'https://www.google.com' }

const WHO_OPTIONS = [
  { id: 'child', label: 'I am a child and this happened to me', icon: User, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  { id: 'parent', label: 'My child told me something happened', icon: Heart, color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
  { id: 'witness', label: 'I witnessed or suspect abuse of a child', icon: Eye, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  { id: 'teacher', label: 'I am a teacher or school staff', icon: BookOpen, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
]

const INCIDENT_TYPES = [
  { id: 'touch', label: 'Inappropriate touching or physical contact' },
  { id: 'verbal', label: 'Sexual comments, threats or verbal harassment' },
  { id: 'image', label: 'Forced to view or share sexual images' },
  { id: 'rape', label: 'Rape or attempted rape' },
  { id: 'online', label: 'Online sexual harassment or grooming' },
  { id: 'other', label: 'Something else happened' },
]

const PERPETRATORS = [
  'Family member or relative',
  'Teacher or school staff',
  'Religious leader',
  'Neighbour or community member',
  'Stranger',
  'I prefer not to say',
]

const LOCATIONS = [
  'Buea Town / Buea', 'Molyko, Buea', 'Mile 4, Limbe', 'Down Beach, Limbe',
  'Bonaberi, Douala', 'Akwa, Douala', 'Yaoundé', 'Other area',
]

const SUPPORT_RESOURCES = [
  { name: 'Child Protection Hotline (MINAS)', number: '+237 222 22 40 40', hours: 'Mon–Fri · 8AM–5PM', type: 'Government', icon: Phone, color: '#10B981' },
  { name: 'Buea Regional Hospital — Gender Desk', number: '+237 233 32 23 45', hours: '24/7', type: 'Medical', icon: Building2, color: '#EF4444' },
  { name: 'Limbe Regional Hospital — Gender Desk', number: '+237 233 33 23 56', hours: '24/7', type: 'Medical', icon: Building2, color: '#EF4444' },
  { name: 'Buea Central Police — Gender Desk', number: '+237 233 32 22 22', hours: '24/7', type: 'Police', icon: ShieldAlert, color: '#3B82F6' },
  { name: 'RENATA Child Protection Center', number: '+237 677 888 999', hours: '8AM–6PM Mon–Sat', type: 'NGO', icon: Users, color: '#8B5CF6' },
]

const UNDERSTAND_QA = [
  { q: 'What counts as sexual abuse?', a: 'Any sexual contact or behaviour involving a child is abuse — whether it involves touching or not. This includes unwanted touching, sexual comments, being forced to look at sexual images, or any sexual act.', color: '#8B5CF6' },
  { q: 'Is it my fault?', a: 'No. Absolutely not. It is never the child\'s fault. Adults who abuse children are fully responsible for their actions. Nothing a child does or says causes abuse.', color: '#10B981' },
  { q: 'What if the person is a family member?', a: 'It is still abuse. It is still wrong. Family members who abuse children are responsible for their actions. Reporting protects you and prevents it from happening to other children.', color: '#F59E0B' },
  { q: 'Will people believe me?', a: 'Trained child protection specialists are taught to believe children. ChildShield routes abuse reports only to trained specialists — not to general moderators or the public.', color: '#3B82F6' },
  { q: 'Do I have to go to the police immediately?', a: 'No. You can start by calling the Child Protection Hotline or visiting a hospital gender desk. They will explain your options and support you at your own pace.', color: '#EC4899' },
]

export default function AbuseReport() {
  const navigate = useNavigate()
  const { addIncident } = useApp()
  const { t } = useLanguage()
  const [step, setStep] = useState('landing')
  const [who, setWho] = useState('')
  const [incidents, setIncidents] = useState([])
  const [note, setNote] = useState('')
  const [perpetrator, setPerpetrator] = useState('')
  const [location, setLocation] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const toggleIncident = (id) => setIncidents(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])

  const handleSubmit = () => {
    const incidentLabels = incidents.map(id => INCIDENT_TYPES.find(t => t.id === id)?.label).filter(Boolean)
    const description = [
      `Reporter: ${WHO_OPTIONS.find(o => o.id === who)?.label || who}`,
      `Incident types: ${incidentLabels.join(', ')}`,
      note && `Details: ${note}`,
      perpetrator && `Perpetrator: ${perpetrator}`,
    ].filter(Boolean).join(' | ')
    addIncident({
      type: 'sexual_abuse',
      typeLabel: 'Sexual Abuse / Harassment',
      description,
      location,
      severity: 'critical',
    })
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, background: 'rgba(139,92,246,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Heart size={36} color="#8B5CF6" />
      </div>
      <h2 style={{ color: '#8B5CF6', marginBottom: 8 }}>{t('abuse','received')}</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 260, marginBottom: 24, fontSize: 14 }}>
        You did the right thing. A trained child protection specialist will review this within 2 hours.
      </p>

      <div style={{ width: '100%', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid rgba(139,92,246,0.2)', padding: 16, marginBottom: 14, textAlign: 'left' }}>
        <p style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>What Happens Next</p>
        {[
          { icon: Lock, text: 'Your identity remains fully protected — no name stored', color: '#8B5CF6' },
          { icon: Users, text: 'A trained child protection specialist reviews within 2 hours', color: '#10B981' },
          { icon: Building2, text: 'You will be guided to the nearest medical and legal support', color: '#3B82F6' },
          { icon: Phone, text: 'A moderator contacts you only if you provided a number', color: '#F59E0B' },
        ].map(({ icon: Icon, text, color }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, background: color + '20', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={14} color={color} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{text}</p>
          </div>
        ))}
      </div>

      <div style={{ width: '100%', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: 14, marginBottom: 14, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <AlertTriangle size={15} color="#EF4444" />
          <p style={{ fontWeight: 700, fontSize: 13, color: '#EF4444', margin: 0 }}>Need immediate help right now?</p>
        </div>
        {[
          { name: 'Police Emergency', number: '17', color: '#3B82F6' },
          { name: 'Child Protection Hotline', number: '+237 222 22 40 40', color: '#10B981' },
          { name: 'Limbe Hospital — Gender Desk', number: '+237 233 33 23 56', color: '#8B5CF6' },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{c.number}</span>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/')} className="btn-secondary" style={{ width: '100%', marginBottom: 8 }}>{t('abuse','backHome')}</button>
      <button onClick={quickExit} style={{ background: 'var(--overlay-hover)', border: 'none', borderRadius: 10, padding: '10px', cursor: 'pointer', color: 'var(--text-muted)', width: '100%', fontSize: 13 }}>
        {t('abuse','close')}
      </button>
    </div>
  )

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => step === 'landing' ? navigate('/report') : setStep('landing')} className="btn-secondary" style={{ padding: '8px 10px' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', margin: 0 }}>{t('abuse','title')}</h1>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>Sexual Harassment & Abuse</p>
          </div>
        </div>
        <button onClick={quickExit} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--overlay-hover)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '7px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>
          <X size={11} />{t('abuse','quickExit')}
        </button>
      </div>

      {/* Privacy banner — always visible */}
      <div style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.22)', borderRadius: 14, padding: 14, marginBottom: 16, display: 'flex', gap: 12 }}>
        <div style={{ width: 34, height: 34, background: 'rgba(139,92,246,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Lock size={16} color="#8B5CF6" />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 13, color: '#8B5CF6', margin: '0 0 3px' }}>{t('abuse','privacy')}</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>No name, no phone number, no identity stored. Reports go only to trained child protection specialists.</p>
        </div>
      </div>

      {/* LANDING */}
      {step === 'landing' && (
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{t('abuse','howHelp')}</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            This is a safe, private space. What happened to you or a child you know is not your fault.
          </p>

          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <AlertOctagon size={16} color="#EF4444" />
              <p style={{ fontWeight: 700, fontSize: 13, color: '#EF4444', margin: 0 }}>If you are in immediate danger</p>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>Call police immediately. Go to a public place where people can see you.</p>
            <a href="tel:17" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', padding: '10px' }}>
              <Phone size={15} /> Call Police — 17
            </a>
          </div>

          {[
            { id: 'who', label: 'Report sexual abuse or harassment', desc: 'Confidential report — takes 3 minutes', icon: FileText, color: '#8B5CF6', bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.22)' },
            { id: 'support', label: 'Find support and resources', desc: 'Hospitals, NGOs, legal help near me', icon: Heart, color: '#EC4899', bg: 'rgba(236,72,153,0.07)', border: 'rgba(236,72,153,0.22)' },
            { id: 'understand', label: 'Understand what happened', desc: 'What counts as abuse? What are my rights?', icon: Lightbulb, color: '#10B981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.22)' },
          ].map(opt => (
            <button key={opt.id} onClick={() => setStep(opt.id)}
              style={{ width: '100%', background: opt.bg, border: `1px solid ${opt.border}`, borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 42, height: 42, background: opt.color + '20', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <opt.icon size={20} color={opt.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', margin: '0 0 2px' }}>{opt.label}</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>{opt.desc}</p>
              </div>
              <ArrowLeft size={14} color={opt.color} style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}

      {/* WHO ARE YOU */}
      {step === 'who' && (
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Who is making this report?</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>Your answer helps us guide you to the right support. You remain completely anonymous.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {WHO_OPTIONS.map(opt => (
              <button key={opt.id} onClick={() => setWho(opt.id)}
                style={{ background: who === opt.id ? opt.bg : '#111827', border: `1px solid ${who === opt.id ? opt.color + '55' : 'var(--border)'}`, borderRadius: 14, padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, background: opt.bg, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <opt.icon size={17} color={opt.color} />
                </div>
                <span style={{ fontSize: 13, color: who === opt.id ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: who === opt.id ? 700 : 400, flex: 1, textAlign: 'left' }}>{opt.label}</span>
                {who === opt.id && <div style={{ width: 10, height: 10, background: opt.color, borderRadius: '50%', flexShrink: 0 }} />}
              </button>
            ))}
          </div>

          {who === 'child' && (
            <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><Heart size={15} color="#8B5CF6" /><p style={{ fontWeight: 700, fontSize: 13, color: '#8B5CF6', margin: 0 }}>You are brave for being here</p></div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>What happened to you is not your fault. You did nothing wrong. No one will know you sent this message.</p>
            </div>
          )}
          {who === 'parent' && (
            <div style={{ background: 'rgba(236,72,153,0.07)', border: '1px solid rgba(236,72,153,0.22)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><AlertTriangle size={15} color="#EC4899" /><p style={{ fontWeight: 700, fontSize: 13, color: '#EC4899', margin: 0 }}>Believe your child first</p></div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>Children rarely lie about abuse. Stay calm and listen without judgment. Do not confront the perpetrator yourself.</p>
            </div>
          )}
          {who === 'teacher' && (
            <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><Shield size={15} color="#10B981" /><p style={{ fontWeight: 700, fontSize: 13, color: '#10B981', margin: 0 }}>You have a duty to report</p></div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>As school staff you are a mandated reporter. Do not investigate alone — report and let trained authorities take over.</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStep('landing')} className="btn-secondary" style={{ flex: 1, fontSize: 12, padding: '10px' }}>Back</button>
            <button onClick={() => { if (who) setStep('what') }} style={{ flex: 2, background: who ? '#8B5CF6' : 'rgba(139,92,246,0.15)', border: 'none', borderRadius: 12, padding: '10px', color: who ? '#fff' : 'rgba(139,92,246,0.4)', fontWeight: 700, fontSize: 13, cursor: who ? 'pointer' : 'default' }}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* WHAT HAPPENED */}
      {step === 'what' && (
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>What happened?</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>Only share what you are comfortable with. Even a few words help. There are no wrong answers.</p>

          <p style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>Type of incident (select all that apply)</p>
          {INCIDENT_TYPES.map(opt => {
            const selected = incidents.includes(opt.id)
            return (
              <button key={opt.id} onClick={() => toggleIncident(opt.id)}
                style={{ width: '100%', background: selected ? 'rgba(139,92,246,0.08)' : '#111827', border: `1px solid ${selected ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`, borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 6, textAlign: 'left' }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${selected ? '#8B5CF6' : 'rgba(255,255,255,0.2)'}`, background: selected ? '#8B5CF6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {selected && <CheckCircle2 size={10} color="#fff" />}
                </div>
                <span style={{ fontSize: 12, color: selected ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: selected ? 600 : 400 }}>{opt.label}</span>
              </button>
            )
          })}

          <p style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, margin: '14px 0 6px' }}>In your own words (optional)</p>
          <textarea className="input-field" style={{ resize: 'none', marginBottom: 14 }} rows={3}
            placeholder="Share only what you feel comfortable. You can leave this blank."
            value={note} onChange={e => setNote(e.target.value)} />

          <p style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>Who did this? (optional)</p>
          {PERPETRATORS.map(opt => (
            <button key={opt} onClick={() => setPerpetrator(perpetrator === opt ? '' : opt)}
              style={{ width: '100%', background: perpetrator === opt ? 'rgba(139,92,246,0.08)' : '#111827', border: `1px solid ${perpetrator === opt ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`, borderRadius: 12, padding: '9px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: perpetrator === opt ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: perpetrator === opt ? 600 : 400 }}>{opt}</span>
              {perpetrator === opt && <div style={{ width: 9, height: 9, background: '#8B5CF6', borderRadius: '50%' }} />}
            </button>
          ))}

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={() => setStep('who')} className="btn-secondary" style={{ flex: 1, fontSize: 12, padding: '10px' }}>Back</button>
            <button onClick={() => { if (incidents.length > 0) setStep('where') }} style={{ flex: 2, background: incidents.length > 0 ? '#8B5CF6' : 'rgba(139,92,246,0.15)', border: 'none', borderRadius: 12, padding: '10px', color: incidents.length > 0 ? '#fff' : 'rgba(139,92,246,0.4)', fontWeight: 700, fontSize: 13, cursor: incidents.length > 0 ? 'pointer' : 'default' }}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* WHERE */}
      {step === 'where' && (
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Where did this happen?</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>This helps connect you to local support and prevents it from happening to other children.</p>

          {LOCATIONS.map(loc => (
            <button key={loc} onClick={() => setLocation(location === loc ? '' : loc)}
              style={{ width: '100%', background: location === loc ? 'rgba(139,92,246,0.08)' : '#111827', border: `1px solid ${location === loc ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`, borderRadius: 12, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 7 }}>
              <span style={{ fontSize: 13, color: location === loc ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: location === loc ? 600 : 400 }}>{loc}</span>
              {location === loc && <div style={{ width: 9, height: 9, background: '#8B5CF6', borderRadius: '50%' }} />}
            </button>
          ))}

          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 13, padding: 12, marginTop: 6, marginBottom: 16, display: 'flex', gap: 9 }}>
            <AlertTriangle size={15} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>Only submit when you are in a safe place and no one can see your screen. Use Quick Exit if needed.</p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStep('what')} className="btn-secondary" style={{ flex: 1, fontSize: 12, padding: '10px' }}>Back</button>
            <button onClick={() => { if (location) handleSubmit() }} style={{ flex: 2, background: location ? '#8B5CF6' : 'rgba(139,92,246,0.15)', border: 'none', borderRadius: 12, padding: '10px', color: location ? '#fff' : 'rgba(139,92,246,0.4)', fontWeight: 700, fontSize: 13, cursor: location ? 'pointer' : 'default' }}>
              {t('abuse','submit')}
            </button>
          </div>
        </div>
      )}

      {/* SUPPORT */}
      {step === 'support' && (
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Support Resources</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>These are trusted, trained organizations. Everything you share with them is confidential. They will not judge you.</p>
          {SUPPORT_RESOURCES.map((r, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 38, background: r.color + '20', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <r.icon size={17} color={r.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', margin: 0, flex: 1 }}>{r.name}</p>
                    <span style={{ fontSize: 10, fontWeight: 600, color: r.color, background: r.color + '15', borderRadius: 6, padding: '1px 7px', marginLeft: 6, flexShrink: 0 }}>{r.type}</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 6px' }}>{r.hours}</p>
                  <a href={`tel:${r.number}`} style={{ color: '#3B82F6', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
                    <Phone size={11} />{r.number}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UNDERSTAND */}
      {step === 'understand' && (
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Understanding Sexual Abuse</h2>
          {UNDERSTAND_QA.map(({ q, a, color }, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${color}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 6 }}>{q}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
