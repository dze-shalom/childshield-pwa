import { useLanguage } from '../contexts/LanguageContext'

const LANGS = [
  { id: 'en', label: 'EN' },
  { id: 'fr', label: 'FR' },
  { id: 'pe', label: 'PE' },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div style={{ display: 'flex', background: 'var(--overlay-hover)', borderRadius: 10, padding: 3, gap: 2 }}>
      {LANGS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setLang(id)}
          style={{
            padding: '4px 9px',
            borderRadius: 7,
            fontSize: 11,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: lang === id ? '#EF4444' : 'transparent',
            color: lang === id ? '#fff' : 'var(--text-muted)',
            transition: 'all 0.15s',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
