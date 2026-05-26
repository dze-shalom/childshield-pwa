import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { mockSafeZones, mockAlerts, heatmapPoints } from '../data/mockData'
import { Phone, Shield, Heart, Building2, MapPin } from 'lucide-react'

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const createIcon = (color, emoji) =>
  L.divIcon({
    className: '',
    html: `<div style="width:36px;height:36px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.3);box-shadow:0 4px 12px rgba(0,0,0,0.4)"><span style="transform:rotate(45deg);font-size:14px">${emoji}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })

const icons = {
  police: createIcon('#3B82F6', '🚔'),
  hospital: createIcon('#EF4444', '🏥'),
  ngo: createIcon('#10B981', '🤝'),
  institution: createIcon('#8B5CF6', '🎓'),
  alert: createIcon('#EF4444', '🚨'),
}

const typeConfig = {
  police: { label: 'Police', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Shield },
  hospital: { label: 'Hospital', color: 'text-red-400', bg: 'bg-red-500/10', icon: Heart },
  ngo: { label: 'NGO', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: Building2 },
  institution: { label: 'Institution', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Building2 },
}

const FILTERS = ['All', 'Police', 'Hospital', 'NGO']

export default function SafeZones() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('map') // map | list

  const filtered = mockSafeZones.filter((z) => {
    if (filter === 'All') return true
    return z.type === filter.toLowerCase()
  })

  const activeAlerts = mockAlerts.filter((a) => a.status === 'active')

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-[#080E1A] z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-syne font-bold text-white text-lg">Safe Zones & Alerts</h1>
          <div className="flex bg-white/5 rounded-xl p-0.5">
            {['map', 'list'].map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${view === v ? 'bg-white/10 text-white' : 'text-white/40'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${filter === f ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-white/50 border border-transparent'}`}>
              {f}
            </button>
          ))}
          {activeAlerts.length > 0 && (
            <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 flex-shrink-0">
              🚨 {activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Map */}
      {view === 'map' && (
        <div className="flex-1 relative">
          <MapContainer
            center={[4.1597, 9.2306]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* Heatmap circles */}
            {heatmapPoints.map((p, i) => (
              <Circle
                key={i}
                center={[p.lat, p.lng]}
                radius={300}
                pathOptions={{ color: 'transparent', fillColor: `rgba(239,68,68,${p.intensity * 0.4})`, fillOpacity: 1 }}
              />
            ))}

            {/* Safe zones */}
            {filtered.map((zone) => (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={icons[zone.type] || icons.institution} eventHandlers={{ click: () => setSelected(zone) }}>
                <Popup>
                  <div style={{ minWidth: '180px' }}>
                    <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{zone.name}</p>
                    <p style={{ fontSize: '12px', opacity: 0.6, marginBottom: '6px' }}>{zone.address}</p>
                    <a href={`tel:${zone.phone}`} style={{ color: '#60A5FA', fontSize: '12px', display: 'block', marginBottom: '4px' }}>{zone.phone}</a>
                    <p style={{ fontSize: '11px', opacity: 0.5 }}>⏰ {zone.hours}</p>
                    {zone.hasGenderDesk && <p style={{ fontSize: '11px', color: '#34D399', marginTop: '4px' }}>✓ Has gender desk</p>}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Active alert pins */}
            {activeAlerts.map((a) => (
              <Marker key={a.id} position={[a.lat, a.lng]} icon={icons.alert}>
                <Popup>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px', color: '#EF4444' }}>🚨 MISSING: {a.name}</p>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>{a.age} yo · {a.gender}</p>
                    <p style={{ fontSize: '12px', opacity: 0.6 }}>{a.description}</p>
                    <a href={`tel:${a.contact}`} style={{ color: '#60A5FA', fontSize: '12px', display: 'block', marginTop: '6px' }}>{a.contact}</a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-[#0D1526]/90 backdrop-blur-sm rounded-xl p-3 z-[1000] border border-white/10">
            <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-2">Legend</p>
            {[
              { emoji: '🚔', label: 'Police', color: 'text-blue-400' },
              { emoji: '🏥', label: 'Hospital', color: 'text-red-400' },
              { emoji: '🤝', label: 'NGO/Support', color: 'text-emerald-400' },
              { emoji: '🚨', label: 'Active Alert', color: 'text-red-400' },
            ].map(({ emoji, label, color }) => (
              <div key={label} className="flex items-center gap-2 mb-1">
                <span className="text-xs">{emoji}</span>
                <span className={`text-xs ${color}`}>{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-1 pt-1 border-t border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/40 flex-shrink-0" />
              <span className="text-xs text-red-400/70">Risk zone</span>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {view === 'list' && (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {filtered.map((zone) => {
            const config = typeConfig[zone.type] || typeConfig.institution
            const Icon = config.icon
            return (
              <div key={zone.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-syne font-bold text-white text-sm">{zone.name}</h3>
                    <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5"><MapPin size={10} /> {zone.address}</p>
                    <p className="text-white/40 text-xs mt-0.5">⏰ {zone.hours}</p>
                    {zone.hasGenderDesk && <p className="text-emerald-400 text-xs mt-1">✓ Has gender desk</p>}
                    <a href={`tel:${zone.phone}`} className="flex items-center gap-1 text-blue-400 text-sm font-medium mt-2">
                      <Phone size={12} /> {zone.phone}
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
