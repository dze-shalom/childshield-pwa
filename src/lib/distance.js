// Distance utilities for showing "X km from you" on alert and found-child cards.

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371, toRad = (d) => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function userCoords() {
  try {
    const raw = localStorage.getItem('childshield_location')
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

function format(km) {
  if (km < 1) return '< 1 km away'
  if (km < 10) return `${km.toFixed(1)} km away`
  return `${Math.round(km)} km away`
}

// For alerts — exact coordinates available.
export function distanceFromCoords(lat, lng) {
  if (lat == null || lng == null) return null
  const user = userCoords()
  if (!user) return null
  return format(haversineKm(user.lat, user.lng, lat, lng))
}

// Approximate city centres for the predefined AREAS in FoundChildReport.
const CITY_CENTRES = {
  'Buea':    { lat: 4.1527,  lng: 9.2403  },
  'Limbe':   { lat: 4.0220,  lng: 9.2047  },
  'Douala':  { lat: 4.0511,  lng: 9.7679  },
  'Yaoundé': { lat: 3.8480,  lng: 11.5021 },
}

// For found children — infer city from the location text and use its centre.
export function distanceFromLocationText(locationText) {
  if (!locationText) return null
  const user = userCoords()
  if (!user) return null
  for (const [city, coords] of Object.entries(CITY_CENTRES)) {
    if (locationText.includes(city)) {
      return format(haversineKm(user.lat, user.lng, coords.lat, coords.lng))
    }
  }
  return null
}
