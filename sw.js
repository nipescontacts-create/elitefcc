// ELITE FC — Service Worker v4
const CACHE_NAME = 'elitefc-v4';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// No interceptar Firebase ni Google Fonts — dejarlos pasar siempre
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('firebaseio.com') ||
      e.request.url.includes('googleapis.com') ||
      e.request.url.includes('fonts.gstatic.com')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() =>
      new Response('Sin conexion', { status: 503, headers: { 'Content-Type': 'text/plain' } })
    )
  );
});

self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : { title: 'ELITE FC', body: 'Recordatorio diario' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icon-192.png'
    })
  );
});
