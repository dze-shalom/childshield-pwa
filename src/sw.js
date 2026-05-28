import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { clientsClaim } from 'workbox-core'

// Take control of all pages immediately on activation
clientsClaim()

// Required by vite-plugin-pwa's autoUpdate: when the client posts SKIP_WAITING,
// the new SW skips the waiting phase and activates, then the page reloads once.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

// Injected by vite-plugin-pwa at build time
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Cache OpenStreetMap tiles for offline map
registerRoute(
  ({ url }) => url.origin === 'https://tile.openstreetmap.org',
  new CacheFirst({
    cacheName: 'map-tiles',
    plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 7 * 24 * 60 * 60 })],
  })
)

// Cache Supabase REST API responses — show last known data when offline
registerRoute(
  ({ url }) => url.hostname.includes('supabase.co') && url.pathname.startsWith('/rest/'),
  new NetworkFirst({
    cacheName: 'supabase-api',
    networkTimeoutSeconds: 5,
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 })],
  })
)

// Cache Google Fonts and other static CDN assets
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({ cacheName: 'google-fonts' })
)

// ── Push notification handler ─────────────────────────────────────────────
// Fired when a push message arrives from the server (even when app is closed)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title || '🚨 ChildShield Alert', {
      body: data.body || 'New alert in your area',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: data.tag || 'childshield',
      requireInteraction: true,
      data: { url: data.url || '/' },
    })
  )
})

// ── Notification click handler ────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((all) => {
      const existing = all.find((c) => 'focus' in c)
      if (existing) { existing.navigate(target); return existing.focus() }
      return clients.openWindow(target)
    })
  )
})

// ── Background sync — process offline submission queue ────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'childshield-offline-queue') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((all) => {
        all.forEach((client) => client.postMessage({ type: 'PROCESS_OFFLINE_QUEUE' }))
      })
    )
  }
})
