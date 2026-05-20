import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'

export const WATCH_REGIONS = [
  { id: 'buea',    label: 'Buea',    match: 'buea' },
  { id: 'limbe',   label: 'Limbe',   match: 'limbe' },
  { id: 'douala',  label: 'Douala',  match: 'douala' },
  { id: 'yaounde', label: 'Yaoundé', match: 'yaound' },
]

const STORAGE_KEY = 'childshield_watch_areas'

export function getWatchedAreas() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

export function alertMatchesWatchedAreas(lastSeen = '') {
  const areas = getWatchedAreas()
  if (areas.length === 0) return true // watching everywhere
  const loc = lastSeen.toLowerCase()
  return areas.some((id) => {
    const region = WATCH_REGIONS.find((r) => r.id === id)
    return region && loc.includes(region.match)
  })
}

export default function AreaWatcher() {
  const [selected, setSelected] = useState([])

  useEffect(() => {
    setSelected(getWatchedAreas())
  }, [])

  const toggle = (id) => {
    const next = selected.includes(id)
      ? selected.filter((a) => a !== id)
      : [...selected, id]
    setSelected(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <MapPin size={13} color="rgba(241,245,249,0.4)" />
        <p style={{ fontSize: 10, color: 'rgba(241,245,249,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
          {selected.length === 0 ? 'Watching all areas' : `Watching: ${selected.map(id => WATCH_REGIONS.find(r => r.id === id)?.label).join(', ')}`}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {WATCH_REGIONS.map(({ id, label }) => {
          const active = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              style={{
                padding: '5px 13px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${active ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                background: active ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
                color: active ? '#EF4444' : 'rgba(241,245,249,0.5)',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
