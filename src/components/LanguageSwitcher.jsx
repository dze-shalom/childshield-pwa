import { useLanguage } from '../contexts/LanguageContext'

const LANGS = [
  { id: 'en', label: 'EN' },
  { id: 'fr', label: 'FR' },
  { id: 'pe', label: 'PE' },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 3, gap: 2 }}>
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
            color: lang === id ? '#fff' : 'rgba(241,245,249,0.45)',
            transition: 'all 0.15s',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
