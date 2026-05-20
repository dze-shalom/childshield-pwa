import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, MapPin, Phone, User, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

const CAMEROON_AREAS = [
  'Buea Town, Buea', 'Molyko, Buea', 'Sandpit, Buea', 'Bonduma, Buea',
  'Mile 4, Limbe', 'Down Beach, Limbe', 'Bota, Limbe', 'Mile 2, Limbe',
  'Bonaberi, Douala', 'Akwa, Douala', 'Bonanjo, Douala', 'Makepe, Douala',
  'Biyem-Assi, Yaoundé', 'Mvan, Yaoundé', 'Mendong, Yaoundé',
  'Other (type below)',
]

export default function NewAlert() {
  const navigate = useNavigate()
  const { addAlert } = useApp()
  const [step, setStep] = useState(1) // 1: child info, 2: location, 3: contact
  const [submitted, setSubmitted] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    name: '', age: '', gender: '', description: '',
    lastSeen: '', customLocation: '', contact: '', createdBy: '',
    lat: 4.1597, lng: 9.2306, photo: null,
  })

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result)
      update('photo', ev.target.result) // store data URL, not File object
    }
    reader.readAsDataURL(file)
  }

  const clearPhoto = () => {
    setPhotoPreview(null)
    update('photo', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    const alertData = {
      ...form,
      age: parseInt(form.age),
      lastSeen: form.lastSeen === 'Other (type below)' ? form.customLocation : form.lastSeen,
      lastSeenTime: new Date().toISOString(),
    }
    const newAlert = await addAlert(alertData)
    setSubmitted(true)
    setTimeout(() => navigate(`/alert/${newAlert.id}`), 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={40} className="text-emerald-400" />
        </div>
        <h2 className="font-syne font-bold text-white text-2xl mb-2">Alert Sent!</h2>
        <p className="text-white/50 text-sm">Community notified. WhatsApp share link ready. Redirecting to alert page...</p>
      </div>
    )
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <div>
          <h1 className="font-syne font-bold text-white text-lg">Missing Child Alert</h1>
          <p className="text-white/40 text-xs">Step {step} of 3</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-red-500' : 'bg-white/10'}`} />
        ))}
      </div>

      {/* Step 1 — Child Info */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-up">
          <div className="card p-4 flex flex-col items-center gap-3 border-dashed border-white/10">
            {/* sr-only input with label — works on iOS Safari unlike display:none + .click() */}
            <input
              ref={fileInputRef}
              id="child-photo-input"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoSelect}
            />
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Child photo" className="w-24 h-24 rounded-2xl object-cover" />
                <button
                  onClick={clearPhoto}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ) : (
              <label htmlFor="child-photo-input" className="w-20 h-20 bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer">
                <Camera size={24} className="text-white/30" />
                <span className="text-white/30 text-xs">Photo</span>
              </label>
            )}
            <p className="text-white/40 text-xs text-center">Upload child's photo (optional but recommended)</p>
            <label htmlFor="child-photo-input" className="btn-secondary text-sm py-2 px-4 cursor-pointer">
              {photoPreview ? 'Change Photo' : 'Upload Photo'}
            </label>
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Child's Full Name *</label>
            <input className="input-field" placeholder="e.g. Amara Tchinda" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Age *</label>
              <input type="number" className="input-field" placeholder="e.g. 8" min="1" max="17" value={form.age} onChange={(e) => update('age', e.target.value)} />
            </div>
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Gender *</label>
              <select className="input-field" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Description *</label>
            <textarea
              className="input-field resize-none" rows={3}
              placeholder="Clothing, hair, any distinguishing features (scars, birthmarks, etc)"
              value={form.description} onChange={(e) => update('description', e.target.value)}
            />
          </div>

          <button
            className="btn-primary w-full"
            disabled={!form.name || !form.age || !form.gender || !form.description}
            onClick={() => setStep(2)}
          >
            Next: Last Known Location →
          </button>
        </div>
      )}

      {/* Step 2 — Location */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-up">
          <div className="card p-4 border-amber-500/20">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-white/70 text-sm">Select the area where the child was last seen. The more specific, the faster the community can help.</p>
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Last Seen Area *</label>
            <select className="input-field" value={form.lastSeen} onChange={(e) => update('lastSeen', e.target.value)}>
              <option value="">Select area...</option>
              {CAMEROON_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {form.lastSeen === 'Other (type below)' && (
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Custom Location</label>
              <input className="input-field" placeholder="e.g. Near GS Tiko, behind the market" value={form.customLocation} onChange={(e) => update('customLocation', e.target.value)} />
            </div>
          )}

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Any Additional Location Details</label>
            <textarea
              className="input-field resize-none" rows={2}
              placeholder="Near the roundabout, behind the church, in front of the school..."
              value={form.locationDetails} onChange={(e) => update('locationDetails', e.target.value)}
            />
          </div>

          <div className="card p-4 bg-red-500/5 border-red-500/20">
            <p className="text-white/50 text-xs leading-relaxed">
              <span className="text-red-400 font-semibold">WhatsApp Alert:</span> After submission, a pre-formatted WhatsApp message will be ready to share instantly to your contacts and status.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setStep(1)}>← Back</button>
            <button
              className="btn-primary flex-1"
              disabled={!form.lastSeen}
              onClick={() => setStep(3)}
            >
              Next: Contact Info →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Contact */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-up">
          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Your Name / Relationship *</label>
            <input className="input-field" placeholder="e.g. Parent - Mama Tchinda / Teacher at GS Molyko" value={form.createdBy} onChange={(e) => update('createdBy', e.target.value)} />
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium mb-1.5 block uppercase tracking-wide">Contact Number *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input className="input-field pl-9" placeholder="+237 6XX XXX XXX" type="tel" value={form.contact} onChange={(e) => update('contact', e.target.value)} />
            </div>
          </div>

          {/* Summary */}
          <div className="card p-4 space-y-2">
            <h3 className="font-syne font-bold text-white text-sm mb-3">Alert Summary</h3>
            {photoPreview && (
              <div className="flex items-center gap-3 pb-2 mb-1 border-b border-white/5">
                <img src={photoPreview} alt="Child photo" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <span className="text-white/50 text-xs">Photo attached</span>
              </div>
            )}
            {[
              { label: 'Name', value: form.name },
              { label: 'Age', value: `${form.age} years, ${form.gender}` },
              { label: 'Last Seen', value: form.lastSeen === 'Other (type below)' ? form.customLocation : form.lastSeen },
              { label: 'Description', value: form.description },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-2 text-sm">
                <span className="text-white/40 w-20 flex-shrink-0">{label}:</span>
                <span className="text-white/80">{value || '—'}</span>
              </div>
            ))}
          </div>

          <div className="card p-3 flex items-start gap-2 bg-red-500/5 border-red-500/20">
            <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/50 text-xs">This alert will be sent to all verified ChildShield users in your area. False alerts may be subject to review.</p>
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setStep(2)}>← Back</button>
            <button
              className="btn-primary flex-1"
              disabled={!form.createdBy || !form.contact}
              onClick={handleSubmit}
            >
              🚨 Send Alert Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
