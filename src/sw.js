import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

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
