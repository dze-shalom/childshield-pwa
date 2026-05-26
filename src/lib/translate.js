// Dynamic translation for user-generated alert content.
// Uses MyMemory API (free, no key needed) with a localStorage cache
// so the same text is never sent twice.
//
// Supported directions: en → fr  (Pidgin has no MT support — shown as-is)

const CACHE_KEY = 'childshield_tx'
const MYMEMORY = 'https://api.mymemory.translated.net/get'

// Static lookup for stored gender values — faster and more accurate than MT
const GENDER_MAP = {
  Male:   { fr: 'Masculin',  pe: 'Boy' },
  Female: { fr: 'Féminin',   pe: 'Girl' },
  Boy:    { fr: 'Masculin',  pe: 'Boy' },
  Girl:   { fr: 'Féminin',   pe: 'Girl' },
}

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
}

function saveCache(cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch {}
}

export async function translateText(text, targetLang) {
  if (!text || !text.trim()) return text
  if (targetLang === 'en' || targetLang === 'pe') return text

  const cacheKey = `${targetLang}:${text}`
  const cache = loadCache()
  if (cache[cacheKey]) return cache[cacheKey]

  try {
    const res = await fetch(`${MYMEMORY}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`)
    const data = await res.json()
    const result = data.responseData?.translatedText
    if (result && !result.startsWith('PLEASE SELECT')) {
      cache[cacheKey] = result
      saveCache(cache)
      return result
    }
  } catch { /* network error — fall through */ }

  return text // original as fallback
}

// Translate the human-readable fields of an alert object.
// Name, age, contact, createdBy — never translated (proper nouns / numbers).
export async function translateAlert(alert, targetLang) {
  if (!alert || targetLang === 'en') return alert

  // Gender: use static lookup first (avoids an API call for a single word)
  const gender = (targetLang !== 'pe' && GENDER_MAP[alert.gender]?.[targetLang])
    ? GENDER_MAP[alert.gender][targetLang]
    : alert.gender

  if (targetLang === 'pe') return { ...alert, gender }

  const [description, lastSeen] = await Promise.all([
    translateText(alert.description, targetLang),
    translateText(alert.lastSeen, targetLang),
  ])

  return { ...alert, description, lastSeen, gender }
}

// Translate the human-readable fields of a found-child report.
// contact, photo — never translated.
export async function translateFoundChild(found, targetLang) {
  if (!found || targetLang === 'en') return found

  const gender = (targetLang !== 'pe' && GENDER_MAP[found.gender]?.[targetLang])
    ? GENDER_MAP[found.gender][targetLang]
    : found.gender

  if (targetLang === 'pe') return { ...found, gender }

  const [description, location] = await Promise.all([
    translateText(found.description, targetLang),
    translateText(found.location, targetLang),
  ])

  return { ...found, description, location, gender }
}
