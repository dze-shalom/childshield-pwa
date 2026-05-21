import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, X, Shield, CheckCircle2, Lock, AlertTriangle, User, Car, MapPin } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { t } from '../lib/i18n'

const INCIDENT_TYPES = [
  { value: 'suspicious_person', label: 'Suspicious Person', desc: 'Someone acting suspiciously around children', icon: User },
  { value: 'attempted_abduction', label: 'Attempted Abduction', desc: 'Someone tried to take or lure a child', icon: AlertTriangle },
  { value: 'unsafe_area', label: 'Unsafe Area', desc: 'Area that poses regular danger to children', icon: MapPin },
  { value: 'harassment', label: 'Child Harassment', desc: 'Children being harassed or threatened', icon: AlertTriangle },
  { value: 'suspicious_vehicle', label: 'Suspicious Vehicle', desc: 'Vehicle acting suspiciously near children', icon: Car },
]

const AREAS = [
  'Buea Town, Buea', 'Molyko, Buea', 'Sandpit, Buea', 'Bonduma, Buea',
  'Mile 4, Limbe', 'Down Beach, Limbe', 'Bota, Limbe',
  'Bonaberi, Douala', 'Akwa, Douala', 'Makepe, Douala',
  'Biyem-Assi, Yaoundé', 'Mvan, Yaoundé', 'Other',
]

export default function AnonymousReport() {
  const navigate = useNavigate()
  const { addIncident } = useApp()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ type: '', description: '', location: '', severity: 'medium' })
  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    const typeEntry = INCIDENT_TYPES.find((t) => t.value === form.type)
    addIncident({
      type: form.type,
      typeLabel: typeEntry?.label || form.type,
      description: form.description,
      location: form.location,
      severity: form.severity,
    })
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, background: 'rgba(16,185,129,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <CheckCircle2 size={36} color="#10B981" />
      </div>
      <h2 style={{ color: '#F1F5F9', marginBottom: 8 }}>{t('report','received')}</h2>
      <p style={{ color: 'rgba(241,245,249,0.5)', maxWidth: 240, marginBottom: 24, fontSize: 14 }}>
        {t('report','receivedSub')}
      </p>
      <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 32px', width: 'auto' }}>{t('report','backHome')}</button>
    </div>
  )

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '8px 10px' }}><ArrowLeft size={18} /></button>
          <h1 style={{ fontWeight: 800, fontSize: 18, color: '#F1F5F9', margin: 0 }}>{t('report','title')}</h1>
        </div>
        <button onClick={() => { window.location.href = 'https://www.google.com' }} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'rgba(241,245,249,0.4)', fontSize: 11, fontWeight: 600 }}>
          <X size={11} />{t('report','exit')}
        </button>
      </div>

      {/* Sexual abuse — dedicated route */}
      <Link to="/abuse-report" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
        <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, background: 'rgba(139,92,246,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={20} color="#8B5CF6" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#F1F5F9', margin: '0 0 2px' }}>{t('report','sexual')}</p>
            <p style={{ fontSize: 11, color: 'rgba(241,245,249,0.45)', margin: 0 }}>{t('report','sexualSub')}</p>
          </div>
          <ArrowLeft size={14} color="#8B5CF6" style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
        </div>
      </Link>

      <div className="card" style={{ display: 'flex', gap: 10, marginBottom: 16, padding: 12, background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <Shield size={15} color="#3B82F6" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: 'rgba(241,245,249,0.6)', margin: 0 }}>{t('report','anonymous')}</p>
      </div>

      <p style={{ fontSize: 10, color: 'rgba(241,245,249,0.5)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>{t('report','type')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {INCIDENT_TYPES.map((t) => (
          <button key={t.value} onClick={() => update('type', t.value)}
            style={{ background: form.type === t.value ? 'rgba(239,68,68,0.07)' : '#111827', border: `1px solid ${form.type === t.value ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, padding: '11px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 30, height: 30, background: form.type === t.value ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <t.icon size={14} color={form.type === t.value ? '#EF4444' : 'rgba(241,245,249,0.4)'} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: form.type === t.value ? 700 : 400, fontSize: 13, color: form.type === t.value ? '#F1F5F9' : 'rgba(241,245,249,0.7)', margin: 0 }}>{t.label}</p>
              <p style={{ fontSize: 11, color: 'rgba(241,245,249,0.35)', margin: '1px 0 0' }}>{t.desc}</p>
            </div>
            {form.type === t.value && <div style={{ width: 10, height: 10, background: '#EF4444', borderRadius: '50%', flexShrink: 0 }} />}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 10, color: 'rgba(241,245,249,0.5)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>{t('report','location')}</p>
      <select className="input-field" style={{ marginBottom: 14 }} value={form.location} onChange={(e) => update('location', e.target.value)}>
        <option value="">{t('report','selectLoc')}</option>
        {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>

      <p style={{ fontSize: 10, color: 'rgba(241,245,249,0.5)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>{t('report','what')}</p>
      <textarea className="input-field" style={{ resize: 'none', marginBottom: 20 }} rows={4}
        placeholder={t('report','whatPH')}
        value={form.description} onChange={(e) => update('description', e.target.value)} />

      <button className="btn-primary" style={{ opacity: (!form.type || !form.description || !form.location) ? 0.5 : 1 }}
        onClick={() => { if (form.type && form.description && form.location) handleSubmit() }}>
        {t('report','submit')}
      </button>
      <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(241,245,249,0.25)', marginTop: 10 }}>
        {t('report','note')}
      </p>
    </div>
  )
}
