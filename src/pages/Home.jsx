import { Link } from 'react-router-dom'
import { Bell, Shield, AlertCircle, CheckCircle2, Users, Clock, MessageSquare, AlertTriangle, LifeBuoy, Lock } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import AlertCard from '../components/AlertCard'
import NotificationBanner from '../components/NotificationBanner'
import InstallApp from '../components/InstallApp'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { Globe, Search } from 'lucide-react'
import { dashboardStats } from '../data/mockData'
import { useLanguage } from '../contexts/LanguageContext'

export default function Home() {
  const { alerts, notifications } = useApp()
  const { t } = useLanguage()
  const activeAlerts = alerts.filter((a) => a.status === 'active')

  // Show resolved alerts only for 24 hours — then they fade to the Dashboard history
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  const resolvedAlerts = alerts.filter((a) => {
    if (a.status !== 'resolved') return false
    const stamp = a.resolvedAt || a.createdAt
    return stamp ? new Date(stamp).getTime() > cutoff : false
  })

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, background: 'rgba(239,68,68,0.15)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="#EF4444" />
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 20, color: '#F1F5F9', margin: 0 }}>ChildShield</h1>
            <p style={{ fontSize: 10, color: 'rgba(241,245,249,0.4)', margin: 0 }}>Cameroon</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <button style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={17} color="rgba(241,245,249,0.5)" />
            </button>
            {notifications > 0 && (
              <span style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, background: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>
                {notifications}
              </span>
            )}
          </div>
        </div>
      </div>

      <InstallApp />
      <NotificationBanner />

      {/* Language selector — clearly labelled, always visible */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 14px' }}>
        <Globe size={14} color="rgba(241,245,249,0.45)" />
        <span style={{ fontSize: 12, color: 'rgba(241,245,249,0.45)', fontWeight: 600, flex: 1 }}>Language</span>
        <LanguageSwitcher />
      </div>

      {/* Report Missing Child CTA */}
      <Link to="/alert/new" style={{ display: 'block', marginBottom: 16, textDecoration: 'none' }}>
        <div style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', borderRadius: 20, padding: '18px 20px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(239,68,68,0.28)' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 4px' }}>Emergency</p>
          <h2 style={{ fontWeight: 900, fontSize: 22, color: '#fff', margin: '0 0 4px', letterSpacing: -0.5 }}>{t('home', 'reportBtn')}</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{t('home', 'reportBtnSub')}</p>
          <div style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={28} color="#fff" />
          </div>
        </div>
      </Link>

      {/* Found a Child — second major action */}
      <Link to="/found-child" style={{ display: 'block', marginBottom: 16, textDecoration: 'none' }}>
        <div style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)', borderRadius: 20, padding: '16px 20px', position: 'relative', overflow: 'hidden', boxShadow: '0 6px 20px rgba(245,158,11,0.25)' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 4px' }}>{t('found','foundSomeone')}</p>
          <h2 style={{ fontWeight: 900, fontSize: 20, color: '#fff', margin: '0 0 3px', letterSpacing: -0.5 }}>{t('found','title')}</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: 0 }}>{t('found','cardSub')}</p>
          <div style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={24} color="#fff" />
          </div>
        </div>
      </Link>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        {[
          { label: t('home', 'active'),    value: activeAlerts.length,                                   icon: AlertCircle,   color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
          { label: t('home', 'resolved'),  value: dashboardStats.resolvedThisMonth,                       icon: CheckCircle2,  color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
          { label: t('home', 'guardians'), value: `${(dashboardStats.verifiedUsers / 1000).toFixed(1)}k`, icon: Users,         color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card" style={{ flex: 1, textAlign: 'center', padding: 12 }}>
            <div style={{ width: 30, height: 30, background: bg, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
              <Icon size={15} color={color} />
            </div>
            <p style={{ fontWeight: 800, fontSize: 18, color, margin: 0 }}>{value}</p>
            <p style={{ fontSize: 10, color: 'rgba(241,245,249,0.35)', margin: '2px 0 0' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Response time */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '12px 14px' }}>
        <div style={{ width: 34, height: 34, background: 'rgba(245,158,11,0.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={16} color="#F59E0B" />
        </div>
        <div>
          <p style={{ fontSize: 12, color: 'rgba(241,245,249,0.6)', margin: 0 }}>{t('home', 'avgResponse')}</p>
          <p style={{ fontWeight: 800, fontSize: 15, color: '#F59E0B', margin: 0 }}>{dashboardStats.avgResponseTime}</p>
        </div>
      </div>

      {/* WhatsApp Bot */}
      <Link to="/childvoice" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(18,140,126,0.07)', borderColor: 'rgba(18,140,126,0.22)' }}>
          <div style={{ width: 38, height: 38, background: '#128C7E', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={17} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#F1F5F9', margin: 0 }}>ChildVoice WhatsApp Bot</p>
            <p style={{ fontSize: 11, color: 'rgba(241,245,249,0.4)', margin: '2px 0 0' }}>2 reports received today · {t('home', 'botOnline')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 7, height: 7, background: '#10B981', borderRadius: '50%' }} />
            <span style={{ fontSize: 10, color: '#10B981', fontWeight: 600 }}>Live</span>
          </div>
        </div>
      </Link>

      {/* Active alerts */}
      {activeAlerts.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <AlertCircle size={14} color="#EF4444" />
              <h2 style={{ fontWeight: 800, fontSize: 13, color: '#F1F5F9', margin: 0 }}>{t('home', 'activeAlerts')}</h2>
            </div>
            <span className="badge-active">{activeAlerts.length} {t('home', 'active')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
          </div>
        </section>
      )}

      {/* Resolved alerts */}
      {resolvedAlerts.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <CheckCircle2 size={13} color="rgba(241,245,249,0.4)" />
            <h2 style={{ fontWeight: 700, fontSize: 11, color: 'rgba(241,245,249,0.4)', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>{t('home', 'recentlyFound')}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {resolvedAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <h2 style={{ fontWeight: 700, fontSize: 11, color: 'rgba(241,245,249,0.4)', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>{t('home', 'quickActions')}</h2>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { to: '/report',       icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  label: t('home', 'reportIncident'), sub: t('home', 'suspiciousActivity'), cardBg: undefined },
          { to: '/abuse-report', icon: Lock,          color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)',  label: t('home', 'safeReporting'),  sub: t('home', 'sexualAbuse'),        cardBg: 'rgba(139,92,246,0.06)' },
          { to: '/help',         icon: LifeBuoy,      color: '#10B981', bg: 'rgba(16,185,129,0.12)',  label: t('nav', 'getHelp'),         sub: t('home', 'findSupport'),        cardBg: undefined },
        ].map(({ to, icon: Icon, color, bg, label, sub, cardBg }) => (
          <Link key={to} to={to} style={{ flex: 1, textDecoration: 'none' }}>
            <div className="card" style={{ padding: 12, background: cardBg }}>
              <div style={{ width: 30, height: 30, background: bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 7 }}>
                <Icon size={14} color={color} />
              </div>
              <p style={{ fontWeight: 700, fontSize: 12, color: '#F1F5F9', margin: '0 0 2px' }}>{label}</p>
              <p style={{ fontSize: 10, color: 'rgba(241,245,249,0.4)', margin: 0 }}>{sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
