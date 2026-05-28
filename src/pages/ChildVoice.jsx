import { ArrowLeft, MessageSquare, Send, Shield, Bell, Search, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const BOT_NUMBER = '+14155238886' // Twilio WhatsApp Sandbox

const HOW_IT_WORKS = [
  { icon: MessageSquare, color: '#128C7E', title: 'Send a WhatsApp message', body: 'Add the ChildVoice number to your contacts and send "Hello" to get started.' },
  { icon: Send,          color: '#3B82F6', title: 'Report in any language',  body: 'Type a report in English, French, or Pidgin. The bot will guide you step by step.' },
  { icon: Bell,          color: '#EF4444', title: 'Alert goes live instantly', body: 'The report is verified and published to the ChildShield app within seconds.' },
  { icon: Search,        color: '#F59E0B', title: 'Automatic matching',       body: 'If a matching found-child report exists, both families are notified immediately.' },
]

export default function ChildVoice() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const openWhatsApp = () => {
    const msg = encodeURIComponent('Hello ChildVoice, I want to report a missing child.')
    window.open(`https://wa.me/${BOT_NUMBER.replace(/\D/g, '')}?text=${msg}`, '_blank')
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <h1 className="font-syne font-bold text-lg flex-1" style={{ color: 'var(--text-primary)' }}>ChildVoice Bot</h1>
      </div>

      {/* Hero card */}
      <div className="card p-5 mb-6 flex items-center gap-4"
           style={{ background: 'rgba(18,140,126,0.07)', borderColor: 'rgba(18,140,126,0.25)' }}>
        <div style={{ width: 52, height: 52, background: '#128C7E', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MessageSquare size={24} color="#fff" />
        </div>
        <div>
          <p className="font-syne font-bold text-base mb-0.5" style={{ color: 'var(--text-primary)' }}>ChildVoice WhatsApp Bot</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Report missing or found children directly via WhatsApp — no internet app needed.
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={openWhatsApp}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white mb-6 text-base"
        style={{ background: '#128C7E', boxShadow: '0 6px 20px rgba(18,140,126,0.3)' }}
      >
        <MessageSquare size={20} />
        Open ChildVoice on WhatsApp
      </button>

      {/* How it works */}
      <p className="font-syne font-bold mb-4" style={{ color: 'var(--text-primary)', fontSize: 15 }}>How it works</p>
      <div className="space-y-3 mb-6">
        {HOW_IT_WORKS.map(({ icon: Icon, color, title, body }, i) => (
          <div key={i} className="card p-4 flex gap-4 items-start">
            <div style={{ width: 36, height: 36, background: color + '18', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={17} color={color} />
            </div>
            <div>
              <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* What you can report */}
      <p className="font-syne font-bold mb-3" style={{ color: 'var(--text-primary)', fontSize: 15 }}>What you can report</p>
      <div className="card p-4 mb-6">
        {[
          'Missing child alert with photo and description',
          'Found child needing identification',
          'Suspicious person or unsafe area',
          'Child in distress or danger',
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <CheckCircle2 size={14} color="#128C7E" className="flex-shrink-0" />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</p>
          </div>
        ))}
      </div>

      {/* Bot number */}
      <div className="card p-4 flex items-center justify-between">
        <div>
          <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>ChildVoice WhatsApp number</p>
          <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{BOT_NUMBER}</p>
        </div>
        <button
          onClick={openWhatsApp}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white"
          style={{ background: '#128C7E' }}
        >
          <MessageSquare size={15} />
          Chat
        </button>
      </div>

      <p className="text-xs text-center mt-5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        ChildVoice works on any phone with WhatsApp — no smartphone required for basic reporting.
      </p>
    </div>
  )
}
