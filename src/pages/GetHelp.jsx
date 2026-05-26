import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, X, Shield, Phone, Lock, Building2, Users, ShieldAlert, MessageSquare, AlertOctagon, Heart } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

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

const ICONS = [AlertOctagon, Heart, Shield]
const COLORS = ['#EF4444', '#EC4899', '#8B5CF6']
const BGS   = ['rgba(239,68,68,0.06)', 'rgba(236,72,153,0.06)', 'rgba(139,92,246,0.06)']
const BORDERS = ['rgba(239,68,68,0.2)', 'rgba(236,72,153,0.2)', 'rgba(139,92,246,0.2)']

export default function GetHelp() {
  const navigate = useNavigate()
  const { t, tArr } = useLanguage()
  const WHAT_TO_DO = tArr('help', 'whatToDo')

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '8px 10px' }}><ArrowLeft size={18} /></button>
          <h1 style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', margin: 0 }}>{t('help','title')}</h1>
        </div>
        <button onClick={() => { window.location.href = 'https://www.google.com' }}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--overlay-hover)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>
          <X size={11} />{t('help','quickExit')}
        </button>
      </div>

      <div className="card" style={{ display: 'flex', gap: 10, marginBottom: 20, padding: 12, background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <Shield size={15} color="#3B82F6" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{t('help','privacy')}</p>
      </div>

      {/* Emergency Numbers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <Phone size={13} color="var(--text-muted)" />
        <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, margin: 0 }}>{t('help','emergency')}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
        {EMERGENCY.map((c, i) => (
          <a key={i} href={`tel:${c.number}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px' }}>
              <div style={{ width: 38, height: 38, background: c.color + '18', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <c.icon size={17} color={c.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', margin: 0 }}>{c.name}</p>
                {c.sub && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{c.sub}</p>}
              </div>
              <span style={{ fontWeight: 900, fontSize: 16, color: c.color, flexShrink: 0 }}>{c.number}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Sexual abuse section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <Lock size={13} color="#8B5CF6" />
        <p style={{ fontSize: 10, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, margin: 0 }}>{t('help','sexAbuse')}</p>
      </div>
      <Link to="/abuse-report" style={{ textDecoration: 'none', display: 'block', marginBottom: 10 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'rgba(139,92,246,0.07)', borderColor: 'rgba(139,92,246,0.25)' }}>
          <div style={{ width: 38, height: 38, background: 'rgba(139,92,246,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={17} color="#8B5CF6" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', margin: 0 }}>{t('help','reportAbuse')}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '2px 0 0' }}>{t('help','reportAbuseSub')}</p>
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
                <p style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)', margin: 0 }}>{r.name}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '2px 0 0' }}>{r.hours}</p>
              </div>
              <span style={{ fontWeight: 700, fontSize: 12, color: '#3B82F6', flexShrink: 0 }}>{r.number}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Step-by-step guidance */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, margin: 0 }}>{t('help','stepByStep')}</p>
      </div>
      {WHAT_TO_DO.map((r, i) => {
        const Icon = ICONS[i]
        return (
          <div key={i} className="card" style={{ marginBottom: 12, padding: 14, background: BGS[i], borderColor: BORDERS[i] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, background: COLORS[i] + '22', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color={COLORS[i]} />
              </div>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', margin: 0 }}>{r.title}</p>
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {r.steps.map((step, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <span style={{ width: 20, height: 20, background: 'var(--overlay-hover)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0, marginTop: 1 }}>{j + 1}</span>
                  <p style={{ fontSize: 12, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )
      })}

      {/* ChildVoice */}
      <Link to="/childvoice" style={{ textDecoration: 'none', display: 'block', marginTop: 4 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'rgba(18,140,126,0.06)', borderColor: 'rgba(18,140,126,0.22)' }}>
          <div style={{ width: 38, height: 38, background: '#128C7E', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MessageSquare size={17} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', margin: 0 }}>{t('help','childVoice')}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{t('help','childVoiceSub')}</p>
          </div>
        </div>
      </Link>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-placeholder)', marginTop: 16 }}>
        {t('help','footer')}
      </p>
    </div>
  )
}
