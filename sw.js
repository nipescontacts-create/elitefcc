// ELITE FC — Service Worker v4
// No cachea nada — siempre red primero
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

// Network only — nunca cache, evita versiones antiguas colgadas
self.addEventListener('fetch', (e) => {
  // No interceptar peticiones a Firebase — dejarlas pasar siempre
  if (e.request.url.includes('firebaseio.com')) return;
  e.respondWith(
    fetch(e.request).catch(() => {
      return new Response('Sin conexion', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    })
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
