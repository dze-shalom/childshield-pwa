import { createContext, useContext, useState, useEffect } from 'react'
import { mockAlerts, mockIncidents } from '../data/mockData'
import { supabase } from '../lib/supabase'
import { subscribeToPush, unsubscribeFromPush } from '../lib/pushSubscription'
// Haversine distance between two GPS coordinates (km)
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371, toRad = (d) => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function alertIsNearUser(alertLat, alertLng) {
  try {
    const raw = localStorage.getItem('childshield_location')
    if (!raw || !alertLat || !alertLng) return true // no location data → notify always
    const { lat, lng } = JSON.parse(raw)
    return distanceKm(lat, lng, alertLat, alertLng) <= 30
  } catch { return true }
}

const AppContext = createContext(null)

// True only when real Supabase credentials are provided
const CONFIGURED =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-project')

// ── Field mappers: Supabase snake_case → app camelCase ─────────────────────

const toFoundChild = (row) => ({
  id: row.id,
  description: row.description,
  ageEstimate: row.age_estimate,
  gender: row.gender,
  location: row.location,
  contact: row.contact,
  photo: row.photo_url,
  status: row.status,
  foundAt: row.found_at,
})

const toSighting = (row) => ({
  id: row.id,
  alertId: row.alert_id,
  reportedBy: row.reported_by,
  location: row.location,
  description: row.description,
  lat: row.lat,
  lng: row.lng,
  verified: row.verified,
  time: row.time,
})

const toAlert = (row) => ({
  id: row.id,
  name: row.name,
  age: row.age,
  gender: row.gender,
  description: row.description,
  lastSeen: row.last_seen,
  lastSeenTime: row.last_seen_time,
  status: row.status,
  photo: row.photo_url,
  photoConsent: row.photo_consent ?? false,
  photoHash: row.photo_hash || null,
  lat: row.lat,
  lng: row.lng,
  contact: row.contact,
  createdBy: row.created_by,
  userId: row.user_id || null, // auth user who submitted — used for ownership check
  createdAt: row.created_at,
  resolvedAt: row.resolved_at || null,
  sightings: (row.sightings || []).map(toSighting),
})

const toIncident = (row) => ({
  id: row.id,
  type: row.type,
  typeLabel: row.type_label || row.type,
  description: row.description,
  location: row.location,
  lat: row.lat,
  lng: row.lng,
  severity: row.severity,
  status: row.status,
  time: row.time,
})

// ── Moderator webhook (optional) ───────────────────────────────────────────

const notifyModerator = (type, payload) => {
  const url = import.meta.env.VITE_MODERATOR_WEBHOOK
  if (!url) return
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...payload, timestamp: new Date().toISOString() }),
  }).catch(() => {}) // fire-and-forget
}

// ── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [alerts, setAlerts] = useState([])
  const [incidents, setIncidents] = useState([])
  const [foundChildren, setFoundChildren] = useState([])
  const [user, setUser] = useState(null) // null = loading, {} = guest, {id,...} = authed
  const [notifications, setNotifications] = useState(0)
  const [loading, setLoading] = useState(CONFIGURED)

  // ── Auth session ─────────────────────────────────────────────────────────
  useEffect(() => {
    const toUserState = (supabaseUser) => supabaseUser
      ? {
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || supabaseUser.email,
          phone: supabaseUser.user_metadata?.phone || '',
          role: supabaseUser.user_metadata?.role || 'public',
        }
      : { role: 'public', name: 'Guest' }

    if (!CONFIGURED) {
      setUser({ role: 'public', name: 'Guest' })
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(toUserState(session?.user ?? null))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = toUserState(session?.user ?? null)
      setUser(nextUser)
      // Auto-subscribe to push when user signs in, remove when they sign out
      if (session?.user) subscribeToPush(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    if (!CONFIGURED) throw new Error('Supabase is not configured — add your credentials to .env')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await unsubscribeFromPush()
    if (CONFIGURED) await supabase.auth.signOut()
    setUser({ role: 'public', name: 'Guest' })
  }

  const register = async ({ email, password, name, phone, role }) => {
    if (!CONFIGURED) throw new Error('Supabase is not configured — add your credentials to .env')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone, role } },
    })
    if (error) throw error
    return data
  }

  // Silently update user's GPS location on app open
  useEffect(() => {
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => localStorage.setItem('childshield_location',
        JSON.stringify({ lat: coords.latitude, lng: coords.longitude })),
      () => {} // permission denied or unavailable — fail silently
    )
  }, [])

  // ── Offline cache helpers ─────────────────────────────────────────────────
  const saveCache = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)) } catch {} }
  const loadCache = (key) => { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null } catch { return null } }

  // ── Offline submission queue ──────────────────────────────────────────────
  const enqueueOffline = (type, payload) => {
    const queue = loadCache('childshield_offline_queue') || []
    queue.push({ type, payload, queuedAt: new Date().toISOString() })
    saveCache('childshield_offline_queue', queue)
    // Register background sync if supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(reg => reg.sync.register('childshield-offline-queue').catch(() => {}))
    }
  }

  const processOfflineQueue = async () => {
    const queue = loadCache('childshield_offline_queue') || []
    if (!queue.length || !navigator.onLine) return
    saveCache('childshield_offline_queue', []) // clear queue optimistically
    for (const item of queue) {
      try {
        if (item.type === 'alert')     await supabase.from('alerts').insert([item.payload])
        if (item.type === 'incident')  await supabase.from('incidents').insert([item.payload])
        if (item.type === 'sighting')  await supabase.from('sightings').insert([item.payload])
        if (item.type === 'found')     await supabase.from('found_children').insert([item.payload])
      } catch { enqueueOffline(item.type, item.payload) } // re-queue on failure
    }
  }

  // Listen for service worker telling us to process the queue (after background sync)
  useEffect(() => {
    const handler = (e) => { if (e.data?.type === 'PROCESS_OFFLINE_QUEUE') processOfflineQueue() }
    navigator.serviceWorker?.addEventListener('message', handler)
    window.addEventListener('online', processOfflineQueue)
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handler)
      window.removeEventListener('online', processOfflineQueue)
    }
  }, [])

  useEffect(() => {
    if (!CONFIGURED) {
      // Local dev — use mock data so the app works without Supabase credentials
      setAlerts(mockAlerts)
      setIncidents(mockIncidents)
      return
    }

    // ── Load from localStorage cache first for instant display ────────────
    const cachedAlerts = loadCache('childshield_alerts_cache')
    const cachedFound  = loadCache('childshield_found_cache')
    if (cachedAlerts) setAlerts(cachedAlerts)
    if (cachedFound)  setFoundChildren(cachedFound)

    // ── Initial data fetch ────────────────────────────────────────────────
    Promise.all([
      supabase.from('alerts').select('*, sightings(*)').order('created_at', { ascending: false }),
      supabase.from('incidents').select('*').order('time', { ascending: false }),
      supabase.from('found_children').select('*').eq('status', 'searching').order('found_at', { ascending: false }),
    ]).then(([{ data: alertRows, error: ae }, { data: incRows, error: ie }, { data: foundRows, error: fe }]) => {
      if (!ae && alertRows) { const a = alertRows.map(toAlert); setAlerts(a); saveCache('childshield_alerts_cache', a) }
      if (!ie && incRows)   setIncidents(incRows.map(toIncident))
      if (!fe && foundRows) { const f = foundRows.map(toFoundChild); setFoundChildren(f); saveCache('childshield_found_cache', f) }
      setLoading(false)
    }).catch(() => {
      // Network error — keep showing cached data, clear loading
      setLoading(false)
    })

    // ── Real-time subscriptions ───────────────────────────────────────────
    const channel = supabase
      .channel('childshield-realtime')

      // New missing-child alert (from web app or WhatsApp bot)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, ({ new: row }) => {
        const alert = { ...toAlert(row), sightings: [] }
        // Skip if already in state (added optimistically by addAlert for the submitting user).
        // Comparison uses String() to guard against integer vs string ID mismatch between
        // the REST insert response and the realtime WebSocket payload.
        setAlerts((prev) => {
          if (prev.some((a) => String(a.id) === String(alert.id))) return prev
          return [alert, ...prev]
        })

        // Only notify if alert is within 30km of user's location (or location unknown)
        if (alertIsNearUser(alert.lat, alert.lng)) {
          setNotifications((n) => n + 1)
          if (Notification.permission === 'granted') {
            new Notification('🚨 Missing Child Alert', {
              body: `${alert.name} · ${alert.age} yrs · Last seen: ${alert.lastSeen}`,
              icon: '/icons/icon-192.png',
              tag: alert.id,
              requireInteraction: true,
            })
          }
        }
      })

      // Alert status changed (e.g. resolved)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'alerts' }, ({ new: row }) => {
        setAlerts((prev) => prev.map((a) =>
          a.id === row.id ? { ...a, status: row.status, resolvedAt: row.resolved_at || a.resolvedAt } : a
        ))
      })

      // New sighting added
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sightings' }, ({ new: row }) => {
        const s = toSighting(row)
        setAlerts((prev) => prev.map((a) =>
          a.id === s.alertId ? { ...a, sightings: [...a.sightings.filter((x) => x.id !== s.id), s] } : a
        ))
      })

      // New found child report
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'found_children' }, ({ new: row }) => {
        const fc = toFoundChild(row)
        setFoundChildren((prev) => [fc, ...prev.filter((f) => f.id !== fc.id)])
        if (Notification.permission === 'granted') {
          new Notification('🟡 Found Child Report', {
            body: `Found near ${fc.location} — help identify this child`,
            icon: '/icons/icon-192.png',
            tag: fc.id,
          })
        }
      })

      // New incident report (from web app or WhatsApp bot)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incidents' }, ({ new: row }) => {
        const inc = toIncident(row)
        setIncidents((prev) => [inc, ...prev.filter((i) => i.id !== inc.id)])
        if (Notification.permission === 'granted') {
          new Notification('📋 New Incident Report', {
            body: `${inc.typeLabel} · ${inc.location || 'Location not specified'}`,
            icon: '/icons/icon-192.png',
            tag: inc.id,
          })
        }
      })

      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // ── Mutations ─────────────────────────────────────────────────────────────

  const addAlert = async (alert) => {
    if (!CONFIGURED) {
      const newAlert = {
        ...alert, id: `a${Date.now()}`, status: 'active',
        sightings: [], createdAt: new Date().toISOString(),
        userId: user?.id || null,
      }
      setAlerts((prev) => [newAlert, ...prev])
      return newAlert
    }

    const payload = {
      name: alert.name, age: alert.age, gender: alert.gender,
      description: alert.description, last_seen: alert.lastSeen,
      last_seen_time: alert.lastSeenTime, photo_url: alert.photo,
      photo_consent: alert.photoConsent ?? false,
      photo_hash: alert.photoHash || null,
      lat: alert.lat, lng: alert.lng, contact: alert.contact,
      created_by: alert.createdBy, user_id: user?.id || null,
      status: 'active', source: 'web',
    }

    // Offline — queue for later and add to local state immediately
    if (!navigator.onLine) {
      const optimistic = { ...alert, id: `offline_${Date.now()}`, status: 'active', sightings: [], createdAt: new Date().toISOString(), userId: user?.id || null }
      setAlerts((prev) => [optimistic, ...prev])
      enqueueOffline('alert', payload)
      return optimistic
    }

    const { data, error } = await supabase.from('alerts').insert([payload]).select().single()
    if (error) throw error
    const newAlert = { ...toAlert(data), sightings: [] }
    setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)])
    return newAlert
  }

  const addSighting = async (alertId, sighting) => {
    if (!CONFIGURED) {
      setAlerts((prev) => prev.map((a) =>
        a.id === alertId
          ? { ...a, sightings: [...a.sightings, { ...sighting, id: `s${Date.now()}`, time: new Date().toISOString(), verified: false }] }
          : a
      ))
      return
    }

    const { data, error } = await supabase.from('sightings').insert([{
      alert_id: alertId,
      reported_by: sighting.reportedBy || 'Anonymous',
      location: sighting.location,
      description: sighting.description,
      verified: false,
    }]).select().single()

    if (error) throw error
    const s = toSighting(data)
    setAlerts((prev) => prev.map((a) =>
      a.id === alertId ? { ...a, sightings: [...a.sightings.filter((x) => x.id !== s.id), s] } : a
    ))
  }

  const addIncident = async (incident) => {
    notifyModerator('incident', {
      type: incident.typeLabel || incident.type,
      location: incident.location,
      severity: incident.severity,
    })

    if (!CONFIGURED) {
      const newIncident = { ...incident, id: `i${Date.now()}`, status: 'under_review', time: new Date().toISOString() }
      setIncidents((prev) => [newIncident, ...prev])
      return
    }

    const payload = {
      type: incident.type, type_label: incident.typeLabel,
      description: incident.description, location: incident.location,
      lat: incident.lat, lng: incident.lng,
      severity: incident.severity || 'medium', status: 'under_review', source: 'web',
    }

    if (!navigator.onLine) {
      const optimistic = { ...incident, id: `offline_${Date.now()}`, status: 'under_review', time: new Date().toISOString() }
      setIncidents((prev) => [optimistic, ...prev])
      enqueueOffline('incident', payload)
      return
    }

    const { data, error } = await supabase.from('incidents').insert([payload]).select().single()
    if (error) throw error
    const newIncident = toIncident(data)
    setIncidents((prev) => [newIncident, ...prev.filter((i) => i.id !== newIncident.id)])
  }

  const resolveAlert = async (alertId) => {
    const resolvedAt = new Date().toISOString()
    if (!CONFIGURED) {
      setAlerts((prev) => prev.map((a) => a.id === alertId ? { ...a, status: 'resolved', resolvedAt } : a))
      return
    }
    const { error } = await supabase.from('alerts').update({ status: 'resolved', resolved_at: resolvedAt }).eq('id', alertId)
    if (error) throw error
    setAlerts((prev) => prev.map((a) => a.id === alertId ? { ...a, status: 'resolved', resolvedAt } : a))
  }

  const addFoundChild = async (found) => {
    if (!CONFIGURED) {
      // Local dev — add to state directly
      const fc = { ...found, id: `fc${Date.now()}`, status: 'searching', foundAt: new Date().toISOString() }
      setFoundChildren((prev) => [fc, ...prev])
      return
    }
    const { data, error } = await supabase.from('found_children').insert([{
      description: found.description,
      age_estimate: found.ageEstimate,
      gender: found.gender,
      location: found.location,
      contact: found.contact,
      photo_url: found.photo,
      status: 'searching',
    }]).select().single()
    if (error) { console.error('Found child save error:', error); return }
    const fc = toFoundChild(data)
    setFoundChildren((prev) => [fc, ...prev.filter((f) => f.id !== fc.id)])
  }

  return (
    <AppContext.Provider value={{ alerts, incidents, foundChildren, user, setUser, notifications, loading, addAlert, addSighting, addIncident, resolveAlert, addFoundChild, login, logout, register }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
