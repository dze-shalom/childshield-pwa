import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translateAlert } from '../lib/translate'

// Returns the alert with description, lastSeen, and gender translated
// into the active UI language. Shows the original immediately while
// the async translation resolves, then swaps in the translated version.
export function useTranslatedAlert(alert) {
  const { lang } = useLanguage()
  const [translated, setTranslated] = useState(alert)

  useEffect(() => {
    if (!alert) return
    let cancelled = false

    // Reset to original immediately so stale translations don't linger
    setTranslated(alert)

    translateAlert(alert, lang).then((result) => {
      if (!cancelled) setTranslated(result)
    })

    return () => { cancelled = true }
  }, [alert?.id, lang])

  return translated
}
