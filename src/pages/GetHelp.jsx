import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, X, Shield, Phone, Lock, Building2, Users, ShieldAlert, MessageSquare, AlertOctagon, Heart } from 'lucide-react'

const EMERGENCY = [
  { name: 'Police Emergency', number: '17', icon: ShieldAlert, color: '#3B82F6' },
  { name: 'Gendarmerie', number: '16', icon: Shield, color: '#3B82F6' },
  { name: 'Fire & Rescue', number: '18', icon: AlertOctagon, color: '#F97316' },
  { name: 'Child Protection Hotline', number: '+237 222 22 40 40', icon: Phone, color: '#10B981', sub: 'MINAS · Mon–Fri 8AM–5PM' },
]

const SEXUAL_ABUSE_RESOURCES = [
  { name: 'Buea Hospital — Gender Desk', number: '+237 233 32 23 45', icon: Building2, color: '#EF4444', hours: '24/7' },
  { name: 'Limbe Hospital — Gender Desk', number: '+237 233 33 23 56', icon: Building2, color: '#EF4444', hours: '24/7' },
  { name: 'RENATA Child Protection Center', number: '+237 677 888 999', icon: Users, color: '#8B5CF6', hours: '8AM–6PM Mon–Sat' },
]

const WHAT_TO_DO = [
  {
    title: 'I need to report abuse right now',
    icon: AlertOctagon, color: '#EF4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)',
    steps: ['Call 17 (Police) immediately', 'Go to the nearest police station with a gender desk', 'You will not be judged — police are trained to help'],
  },
  {
    title: 'A child told me something happened',
    icon: Heart, color: '#EC4899', bg: 'rgba(236,72,153,0.06)', border: 'rgba(236,72,153,0.2)',
    steps: ['Believe them — children rarely lie about abuse', 'Stay calm, do not question them intensively', 'Call Child Protection Hotline: +237 222 22 40 40', 'Take them to the nearest hospital for a check-up'],
  },
  {
    title: 'I am a child and I need help',
    icon: Shield, color: '#8B5CF6', bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.2)',
    steps: ['You are not alone and this is not your fault', 'Go to the nearest school, church, or police station', 'Tell any adult you trust what happened', 'Call 17 — they will help even if you have no credit'],
  },
]

export default function GetHelp() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '8px 10px' }}><ArrowLeft size={18} /></button>
          <h1 style={{ fontWeight: 800, fontSize: 18, color: '#F1F5F9', margin: 0 }}>Get Help Now</h1>
        </div>
        <button onClick={() => { window.location.href = 'https://www.google.com' }}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'rgba(241,245,249,0.4)', fontSize: 11, fontWeight: 600 }}>
          <X size={11} />Quick Exit
        </button>
      </div>

      <div className="card" style={{ display: 'flex', gap: 10, marginBottom: 20, padding: 12, background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <Shield size={15} color="#3B82F6" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: 'rgba(241,245,249,0.6)', margin: 0 }}>This page does not store your visit. Use Quick Exit to leave immediately.</p>
      </div>

      {/* Emergency Numbers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <Phone size={13} color="rgba(241,245,249,0.4)" />
        <p style={{ fontSize: 10, color: 'rgba(241,245,249,0.4)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, margin: 0 }}>Emergency Numbers</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
        {EMERGENCY.map((c, i) => (
          <a key={i} href={`tel:${c.number}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px' }}>
              <div style={{ width: 38, height: 38, background: c.color + '18', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <c.icon size={17} color={c.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#F1F5F9', margin: 0 }}>{c.name}</p>
                {c.sub && <p style={{ fontSize: 11, color: 'rgba(241,245,249,0.4)', margin: '2px 0 0' }}>{c.sub}</p>}
              </div>
              <span style={{ fontWeight: 900, fontSize: 16, color: c.color, flexShrink: 0 }}>{c.number}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Sexual abuse dedicated section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <Lock size={13} color="#8B5CF6" />
        <p style={{ fontSize: 10, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, margin: 0 }}>Sexual Harassment & Abuse</p>
      </div>
      <Link to="/abuse-report" style={{ textDecoration: 'none', display: 'block', marginBottom: 10 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'rgba(139,92,246,0.07)', borderColor: 'rgba(139,92,246,0.25)' }}>
          <div style={{ width: 38, height: 38, background: 'rgba(139,92,246,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={17} color="#8B5CF6" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#F1F5F9', margin: 0 }}>Report Sexual Abuse — Safe & Private</p>
            <p style={{ fontSize: 11, color: 'rgba(241,245,249,0.45)', margin: '2px 0 0' }}>Confidential flow · Trained specialists only · Quick Exit available</p>
          </div>
          <ArrowLeft size={14} color="#8B5CF6" style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
        </div>
      </Link>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
        {SEXUAL_ABUSE_RESOURCES.map((r, i) => (
          <a key={i} href={`tel:${r.number}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
              <div style={{ width: 36, height: 36, background: r.color + '18', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <r.icon size={16} color={r.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 12, color: '#F1F5F9', margin: 0 }}>{r.name}</p>
                <p style={{ fontSize: 10, color: 'rgba(241,245,249,0.35)', margin: '2px 0 0' }}>{r.hours}</p>
              </div>
              <span style={{ fontWeight: 700, fontSize: 12, color: '#3B82F6', flexShrink: 0 }}>{r.number}</span>
            </div>
          </a>
        ))}
      </div>

      {/* What to do guides */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <p style={{ fontSize: 10, color: 'rgba(241,245,249,0.4)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, margin: 0 }}>Step-by-Step Guidance</p>
      </div>
      {WHAT_TO_DO.map((r, i) => (
        <div key={i} className="card" style={{ marginBottom: 12, padding: 14, background: r.bg, borderColor: r.border }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, background: r.color + '22', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <r.icon size={14} color={r.color} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#F1F5F9', margin: 0 }}>{r.title}</p>
          </div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {r.steps.map((step, j) => (
              <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <span style={{ width: 20, height: 20, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'rgba(241,245,249,0.5)', flexShrink: 0, marginTop: 1 }}>{j + 1}</span>
                <p style={{ fontSize: 12, color: 'rgba(241,245,249,0.7)', margin: 0, lineHeight: 1.5 }}>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}

      {/* ChildVoice */}
      <Link to="/childvoice" style={{ textDecoration: 'none', display: 'block', marginTop: 4 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'rgba(18,140,126,0.06)', borderColor: 'rgba(18,140,126,0.22)' }}>
          <div style={{ width: 38, height: 38, background: '#128C7E', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MessageSquare size={17} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#F1F5F9', margin: 0 }}>Chat with ChildVoice</p>
            <p style={{ fontSize: 11, color: 'rgba(241,245,249,0.4)', margin: '2px 0 0' }}>Anonymous WhatsApp support · Available 24/7</p>
          </div>
        </div>
      </Link>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(241,245,249,0.2)', marginTop: 16 }}>
        In a life-threatening emergency, always call 17 first
      </p>
    </div>
  )
}
