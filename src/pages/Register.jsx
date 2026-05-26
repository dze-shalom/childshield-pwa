import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle2, MessageSquare } from 'lucide-react'
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

  const [mode, setMode] = useState('phone') // 'phone' | 'email'
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: 'guardian',
    password: '', confirmPassword: '', otp: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const switchMode = (next) => { setMode(next); setStep(1); setError('') }

  // ── Email signup ───────────────────────────────────────────────────────────
  const handleEmailRegister = async (e) => {
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

  // ── Phone step 1: collect details + send OTP ───────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Please enter your name'); return }
    setLoading(true); setError('')
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: form.phone })
      if (error) throw error
      setStep(2)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  // ── Phone step 2: verify OTP + save profile metadata ──────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        phone: form.phone, token: form.otp, type: 'sms',
      })
      if (verifyErr) throw verifyErr
      // Store name and role in user metadata
      await supabase.auth.updateUser({ data: { name: form.name, role: form.role, phone: form.phone } })
      navigate('/')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  // ── Email-sent success screen ──────────────────────────────────────────────
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-syne font-bold text-white mb-2">Check your email</h2>
          <p className="text-white/40 text-sm mb-6 leading-relaxed">
            We sent a confirmation link to{' '}
            <span className="text-white/70 font-medium">{form.email}</span>.{' '}
            Click it to activate your account.
          </p>
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
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        {/* ── Email form ── */}
        {mode === 'email' && (
          <form onSubmit={handleEmailRegister} className="space-y-4">
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
                Phone <span className="text-white/25">(optional)</span>
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
        )}

        {/* ── Phone step 1: name + number + role ── */}
        {mode === 'phone' && step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" className="input-field pl-10" placeholder="Jean-Paul Mbah"
                  value={form.name} onChange={set('name')} required />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Phone number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="tel" className="input-field pl-10" placeholder="+237 6XX XXX XXX"
                  value={form.phone} onChange={set('phone')} required />
              </div>
              <p className="text-white/25 text-xs mt-1.5">Include country code — e.g. +237 for Cameroon</p>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">I am a</label>
              <select className="input-field" value={form.role} onChange={set('role')}>
                {ROLES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sending code…' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* ── Phone step 2: OTP ── */}
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
              {loading ? 'Verifying…' : 'Verify & Create Account'}
            </button>
            <button type="button" onClick={() => { setStep(1); setError('') }}
              className="w-full text-white/40 hover:text-white/60 text-sm transition-colors py-1">
              ← Change number
            </button>
          </form>
        )}

        <p className="text-white/40 text-sm text-center mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-red-400 hover:text-red-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
