import { useState } from 'react'
import { getLang, setLang } from '../lib/i18n'

const LANGS = [
  { id: 'en', label: 'EN' },
  { id: 'fr', label: 'FR' },
  { id: 'pe', label: 'PE' },
]

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState(getLang())

  const choose = (id) => {
    setLang(id)
    setCurrent(id)
    // Reload so all components re-read the language from localStorage
    window.location.reload()
  }

  return (
    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 3, gap: 2 }}>
      {LANGS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => choose(id)}
          style={{
            padding: '4px 9px',
            borderRadius: 7,
            fontSize: 11,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: current === id ? '#EF4444' : 'transparent',
            color: current === id ? '#fff' : 'rgba(241,245,249,0.45)',
            transition: 'all 0.15s',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
