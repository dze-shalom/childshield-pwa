import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translateFoundChild } from '../lib/translate'

export function useTranslatedFoundChild(found) {
  const { lang } = useLanguage()
  const [translated, setTranslated] = useState(found)

  useEffect(() => {
    if (!found) return
    let cancelled = false

    setTranslated(found)

    translateFoundChild(found, lang).then((result) => {
      if (!cancelled) setTranslated(result)
    })

    return () => { cancelled = true }
  }, [found?.id, lang])

  return translated
}
