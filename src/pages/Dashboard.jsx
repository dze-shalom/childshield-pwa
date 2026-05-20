import { useState } from 'react'
import { AlertCircle, CheckCircle2, Users, MapPin, TrendingUp, Clock, Shield, Eye } from 'lucide-react'
import { dashboardStats } from '../data/mockData'
import { useApp } from '../contexts/AppContext'
import { formatDistanceToNow } from 'date-fns'

const severityConfig = {
  critical: { label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  high: { label: 'High', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  medium: { label: 'Medium', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  low: { label: 'Low', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
}

const statusConfig = {
  under_review: 'badge-review',
  flagged: 'badge-active',
  resolved: 'badge-resolved',
  reported_to_police: 'badge-resolved',
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count))
  return (
    <div className="flex items-end gap-2 h-28 mt-2">
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-white/50 text-[10px]">{d.count}</span>
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-red-600 to-red-400 transition-all duration-500"
            style={{ height: `${(d.count / max) * 80}px`, minHeight: '4px' }}
          />
          <span className="text-white/40 text-[10px]">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

function DonutSegment({ pct, color, offset }) {
  const r = 40, c = 2 * Math.PI * r
  return (
    <circle
      cx="50" cy="50" r={r}
      fill="none" stroke={color} strokeWidth="14"
      strokeDasharray={`${pct * c} ${c}`}
      strokeDashoffset={-offset * c}
      strokeLinecap="butt"
      transform="rotate(-90 50 50)"
      style={{ transition: 'stroke-dasharray 1s ease' }}
    />
  )
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6']
  let offset = 0
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-24 h-24 flex-shrink-0">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
        {data.map((d, i) => {
          const pct = d.count / total
          const el = <DonutSegment key={i} pct={pct} color={colors[i]} offset={offset} />
          offset += pct
          return el
        })}
        <text x="50" y="54" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Syne">{total}</text>
      </svg>
      <div className="space-y-1.5 flex-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: colors[i] }} />
              <span className="text-white/60 text-xs">{d.type}</span>
            </div>
            <span className="text-white font-semibold text-xs">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TABS = ['Overview', 'Incidents', 'Resolutions']

export default function Dashboard() {
  const { alerts, incidents } = useApp()
  const [tab, setTab] = useState('Overview')
  const activeAlerts = alerts.filter((a) => a.status === 'active')

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-syne font-bold text-white text-xl">Dashboard</h1>
          <p className="text-white/40 text-xs mt-0.5">Admin · SW Region · Buea/Limbe</p>
        </div>
        <div className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center">
          <Shield size={18} className="text-red-400" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t ? 'bg-white/10 text-white' : 'text-white/40'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-4 animate-fade-up">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Active Alerts', value: activeAlerts.length, sub: 'Needs attention', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: 'Resolved (May)', value: dashboardStats.resolvedThisMonth, sub: 'This month', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Verified Users', value: dashboardStats.verifiedUsers.toLocaleString(), sub: 'Community guardians', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Avg Response', value: dashboardStats.avgResponseTime, sub: 'Community response', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map(({ label, value, sub, icon: Icon, color, bg }) => (
              <div key={label} className="card p-4">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-2`}>
                  <Icon size={18} className={color} />
                </div>
                <p className={`font-syne font-extrabold text-2xl ${color}`}>{value}</p>
                <p className="text-white font-medium text-sm mt-0.5">{label}</p>
                <p className="text-white/30 text-xs">{sub}</p>
              </div>
            ))}
          </div>

          {/* Monthly Alerts Chart */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-syne font-bold text-white text-sm">Monthly Alerts</h3>
              <TrendingUp size={16} className="text-red-400" />
            </div>
            <p className="text-white/30 text-xs mb-2">Alert volume trend — 2026</p>
            <BarChart data={dashboardStats.monthlyAlerts} />
          </div>

          {/* Incident Types */}
          <div className="card p-4">
            <h3 className="font-syne font-bold text-white text-sm mb-3">Incidents by Type</h3>
            <DonutChart data={dashboardStats.incidentsByType} />
          </div>

          {/* AI Risk Zones Summary */}
          <div className="card p-4 bg-red-500/5 border-red-500/15">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-red-400" />
              <h3 className="font-syne font-bold text-white text-sm">AI Risk Heatmap — Top Zones</h3>
            </div>
            {[
              { zone: 'Buea Town Corridor', risk: 'High', pct: 85 },
              { zone: 'Molyko Market Area', risk: 'High', pct: 72 },
              { zone: 'Mile 4 Limbe Junction', risk: 'Medium', pct: 58 },
              { zone: 'Bonaberi Market, Douala', risk: 'Medium', pct: 45 },
            ].map(({ zone, risk, pct }) => (
              <div key={zone} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/70 text-xs">{zone}</span>
                  <span className={`text-xs font-semibold ${pct > 70 ? 'text-red-400' : 'text-amber-400'}`}>{risk}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${pct > 70 ? 'bg-red-500' : 'bg-amber-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="text-white/30 text-xs mt-2">Based on {dashboardStats.totalReports} community reports · Updated hourly</p>
          </div>
        </div>
      )}

      {tab === 'Incidents' && (
        <div className="space-y-3 animate-fade-up">
          <p className="text-white/40 text-xs">{incidents.length} total reports</p>
          {incidents.map((inc) => {
            const sev = severityConfig[inc.severity] || severityConfig.low
            return (
              <div key={inc.id} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${sev.color}`}>{sev.label}</span>
                    <p className="font-syne font-bold text-white text-sm mt-1">{inc.typeLabel}</p>
                  </div>
                  <span className={statusConfig[inc.status] || 'badge-review'}>{inc.status.replace('_', ' ')}</span>
                </div>
                <p className="text-white/60 text-xs leading-relaxed mb-2">{inc.description}</p>
                <div className="flex items-center gap-3 text-white/30 text-xs">
                  <span className="flex items-center gap-1"><MapPin size={10} />{inc.location}</span>
                  <span>{formatDistanceToNow(new Date(inc.time), { addSuffix: true })}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'Resolutions' && (
        <div className="space-y-3 animate-fade-up">
          <div className="card p-4 bg-emerald-500/5 border-emerald-500/20 flex items-center gap-3 mb-2">
            <CheckCircle2 size={20} className="text-emerald-400" />
            <div>
              <p className="font-syne font-bold text-white text-sm">{dashboardStats.resolvedThisMonth} children found safely this month</p>
              <p className="text-white/40 text-xs">Through community coordination</p>
            </div>
          </div>
          {dashboardStats.recentResolutions.map((r, i) => (
            <div key={i} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-syne font-bold text-white text-sm">{r.name}</p>
                <p className="text-emerald-400/70 text-xs">{r.method}</p>
              </div>
              <span className="text-white/30 text-xs">{r.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
