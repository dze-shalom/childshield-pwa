import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle2, RefreshCw } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'

const ROLES = [
  { value: 'guardian', label: 'Parent / Guardian' },
  { value: 'community', label: 'Community Member' },
  { value: 'officer', label: 'Police / Law Enforcement' },
  { value: 'ngo', label: 'NGO / Aid Worker' },
]

export default function Register() {
  const { register } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: 'guardian',
    password: '', confirmPassword: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendStatus, setResendStatus] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    if (!emailSent) return
    setResendCooldown(60)
    timerRef.current = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) { clearInterval(timerRef.current); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [emailSent])

  const handleResend = async () => {
    setResendStatus(''); setLoading(true)
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: form.email })
      if (error) throw error
      setResendStatus('sent')
      setResendCooldown(60)
      timerRef.current = setInterval(() => {
        setResendCooldown((s) => {
          if (s <= 1) { clearInterval(timerRef.current); return 0 }
          return s - 1
        })
      }, 1000)
    } catch { setResendStatus('error') }
    finally { setLoading(false) }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleRegister = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      await register({ email: form.email, password: form.password, name: form.name, phone: form.phone, role: form.role })
      setEmailSent(true)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-syne font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Check your email
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            We sent a confirmation link to{' '}
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{form.email}</span>.{' '}
            Click it to activate your account. Check your spam folder if you don't see it.
          </p>

          {resendStatus === 'sent' && (
            <p className="text-emerald-500 text-sm mb-3">Confirmation email resent successfully.</p>
          )}
          {resendStatus === 'error' && (
            <p className="text-red-500 text-sm mb-3">Could not resend. Try again shortly.</p>
          )}

          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || loading}
            className="flex items-center gap-2 mx-auto mb-6 text-sm font-medium transition-colors"
            style={{
              color: resendCooldown > 0 ? 'var(--text-muted)' : '#EF4444',
              cursor: resendCooldown > 0 ? 'default' : 'pointer',
              background: 'none', border: 'none', padding: 0,
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : 'Resend confirmation email'}
          </button>

          <Link to="/login" className="btn-primary inline-block">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <Shield size={24} className="text-red-400" />
          </div>
          <div>
            <p className="font-syne font-bold text-white text-xl leading-none">ChildShield</p>
            <p className="text-white/40 text-sm">Cameroon</p>
          </div>
        </div>

        <h1 className="text-2xl font-syne font-bold text-white mb-1 text-center">Create account</h1>
        <p className="text-white/40 text-sm text-center mb-6">Join the ChildShield guardian network</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-1.5 block">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" className="input-field pl-10" placeholder="Jean-Paul Mbah"
                value={form.name} onChange={set('name')} required />
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1.5 block">Email address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" className="input-field pl-10" placeholder="you@example.com"
                value={form.email} onChange={set('email')} required />
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1.5 block">
              Phone <span className="text-white/25">(optional — for WhatsApp alerts)</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="tel" className="input-field pl-10" placeholder="+237 6XX XXX XXX"
                value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1.5 block">I am a</label>
            <select className="input-field" value={form.role} onChange={set('role')}>
              {ROLES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={showPw ? 'text' : 'password'} className="input-field pl-10 pr-10"
                placeholder="At least 6 characters" value={form.password} onChange={set('password')} required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1.5 block">Confirm password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={showPw ? 'text' : 'password'} className="input-field pl-10"
                placeholder="Repeat your password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-white/40 text-sm text-center mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-red-400 hover:text-red-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
