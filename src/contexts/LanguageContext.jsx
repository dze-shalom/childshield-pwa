import { createContext, useContext, useState } from 'react'
import { translations, arrTranslations } from '../lib/i18n'

const LanguageContext = createContext(null)
const LANG_KEY = 'childshield_lang'

function stored() {
  try { return localStorage.getItem(LANG_KEY) || 'en' } catch { return 'en' }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(stored)

  function setLang(next) {
    try { localStorage.setItem(LANG_KEY, next) } catch {}
    setLangState(next)
  }

  function t(section, key) {
    return translations[section]?.[key]?.[lang]
      ?? translations[section]?.[key]?.en
      ?? key
  }

  function tArr(section, key) {
    return arrTranslations[section]?.[key]?.[lang]
      ?? arrTranslations[section]?.[key]?.en
      ?? []
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tArr }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
