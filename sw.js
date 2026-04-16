// ELITE FC — Service Worker FIX
const CACHE_NAME = 'elitefc-v5';

const urlsToCache = [
  '/',
  '/index.html',
];

// INSTALAR
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVAR
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// FETCH
self.addEventListener('fetch', (e) => {

  // 🔥 NO TOCAR FIREBASE NI CDN
  if (
    e.request.url.includes('firebaseio.com') ||
    e.request.url.includes('googleapis.com') ||
    e.request.url.includes('gstatic.com')
  ) {
    return;
  }

  // 🔥 ESTRATEGIA: CACHE → NETWORK
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});

// PUSH (lo dejamos igual)
self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : { title: 'ELITE FC', body: 'Recordatorio diario' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icon-192.png'
    })
  );
});
