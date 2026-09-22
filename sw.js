/* ============================================================
   Service worker del sitio publico "Canta".
   Mismo patrón que goyogramadors/cancionero:app/sw.js: stale-while-
   revalidate para el caparazón, red-primero para canta-media/ (así
   una canción reprocesada no queda pegada en caché), con caché de
   respaldo para offline. Vive en su propio repo/origen de scope, pero
   el shell incluye rutas absolutas hacia goyogramadors/cancionero
   (mismo origen goyogramadors.github.io: sin CORS, sin duplicar nada).
   ============================================================ */
const CACHE = 'canta-v7';
const SHELL = [
  'index.html',
  'manifest.webmanifest',
  'theme.css',
  'logo.jpg',
  '/cancionero/app/css/base.css',
  '/cancionero/app/core/music.js',
  '/cancionero/app/core/registry.js',
  '/cancionero/app/core/ui.js',
  '/cancionero/app/core/store.js',
  '/cancionero/app/tools/canta/canta-dsp.js',
  '/cancionero/app/tools/canta/canta-pitch.js',
  '/cancionero/app/tools/canta/canta-pitch-worklet.js',
  '/cancionero/app/tools/canta/canta-motor.js',
  '/cancionero/app/tools/canta/canta-engine.js',
  '/cancionero/app/tools/canta/canta.js'
];

self.addEventListener('install', (e) => {
  // cache:'reload' = pedir al servidor, NO a la caché HTTP del navegador:
  // GitHub Pages manda max-age=600, y sin esto un SW nuevo se llenaba con
  // los archivos VIEJOS que el navegador tenía guardados por 10 minutos.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // deja pasar lo externo
  // Los paquetes de Canta (índice + canta.json + audios) cambian cuando se
  // reprocesa un ejercicio: red primero, para que no quede uno viejo pegado
  // (el caché queda solo como respaldo offline).
  if (url.pathname.includes('canta-media/')) {
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' }).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const network = fetch(e.request, { cache: 'no-cache' }).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);
      return hit || network; // caché primero si existe; si no, red
    })
  );
});
