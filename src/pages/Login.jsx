import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield, Mail, Lock, Eye, EyeOff, Phone, MessageSquare, RefreshCw } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'

const EMAIL_NOT_CONFIRMED = (msg) =>
  msg?.toLowerCase().includes('email not confirmed') ||
  msg?.toLowerCase().includes('email address not confirmed')

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.from?.pathname || '/'

  const [mode, setMode] = useState('phone') // 'phone' | 'email'
  const [step, setStep] = useState(1)        // 1 = credentials, 2 = OTP
  const [form, setForm] = useState({ email: '', password: '', phone: '', otp: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResend, setShowResend] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendStatus, setResendStatus] = useState('') // 'sent' | 'error'
  const timerRef = useRef(null)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const switchMode = (next) => { setMode(next); setStep(1); setError(''); setShowResend(false) }

  const startCooldown = () => {
    setResendCooldown(60)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) { clearInterval(timerRef.current); return 0 }
        return s - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    setResendStatus(''); setLoading(true)
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: form.email })
      if (error) throw error
      setResendStatus('sent')
      startCooldown()
    } catch { setResendStatus('error') }
    finally { setLoading(false) }
  }

  // ── Email login ────────────────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setShowResend(false)
    try {
      await login(form.email, form.password)
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(err.message)
      if (EMAIL_NOT_CONFIRMED(err.message)) {
        setShowResend(true)
        startCooldown()
      }
    }
    finally { setLoading(false) }
  }

  // ── Phone: send OTP ────────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: form.phone })
      if (error) throw error
      setStep(2)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  // ── Phone: verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { error } = await supabase.auth.verifyOtp({ phone: form.phone, token: form.otp, type: 'sms' })
      if (error) throw error
      navigate(returnTo, { replace: true })
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
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

        <h1 className="text-2xl font-syne font-bold text-white mb-1 text-center">Welcome back</h1>
        <p className="text-white/40 text-sm text-center mb-6">Sign in to your guardian account</p>

        {/* Mode toggle — hide on OTP step */}
        {step === 1 && (
          <div className="flex rounded-xl bg-white/5 p-1 mb-6">
            {[['phone', 'Phone number'], ['email', 'Email']].map(([val, label]) => (
              <button key={val} type="button" onClick={() => switchMode(val)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === val ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                }`}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-3">
            {error}
          </div>
        )}

        {/* Resend confirmation — shown when email not confirmed */}
        {showResend && (
          <div className="rounded-xl border px-4 py-3 mb-4 text-sm"
               style={{ background: 'var(--overlay-hover)', borderColor: 'var(--border)' }}>
            {resendStatus === 'sent' && (
              <p className="text-emerald-500 mb-2">Confirmation email sent — check your inbox.</p>
            )}
            {resendStatus === 'error' && (
              <p className="text-red-400 mb-2">Could not resend. Try again shortly.</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Didn't get the confirmation email?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="flex items-center gap-1.5 text-sm font-medium ml-3 transition-colors"
                style={{
                  color: resendCooldown > 0 ? 'var(--text-muted)' : '#EF4444',
                  background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'default' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email'}
              </button>
            </div>
          </div>
        )}

        {/* ── Email form ── */}
        {mode === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" className="input-field pl-10" placeholder="you@example.com"
                  value={form.email} onChange={set('email')} required />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={showPw ? 'text' : 'password'} className="input-field pl-10 pr-10"
                  placeholder="••••••••" value={form.password} onChange={set('password')} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        )}

        {/* ── Phone step 1: enter number ── */}
        {mode === 'phone' && step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Phone number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="tel" className="input-field pl-10" placeholder="+237 6XX XXX XXX"
                  value={form.phone} onChange={set('phone')} required />
              </div>
              <p className="text-white/25 text-xs mt-1.5">Include country code — e.g. +237 for Cameroon</p>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sending code…' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* ── Phone step 2: enter OTP ── */}
        {mode === 'phone' && step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <MessageSquare size={14} className="text-red-400 flex-shrink-0" />
              <span className="text-white/50">Code sent to</span>
              <span className="text-white font-medium">{form.phone}</span>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Enter the 6-digit code</label>
              <input
                type="text" inputMode="numeric" maxLength={6}
                className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="------"
                value={form.otp} onChange={set('otp')} required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify & Sign In'}
            </button>
            <button type="button" onClick={() => { setStep(1); setError('') }}
              className="w-full text-white/40 hover:text-white/60 text-sm transition-colors py-1">
              ← Change number
            </button>
          </form>
        )}

        <p className="text-white/40 text-sm text-center mt-8">
          No account yet?{' '}
          <Link to="/register" className="text-red-400 hover:text-red-300 transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  )
}
