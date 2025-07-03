const CACHE_NAME = 'EcoSocial-v1';
const urlsToCache = [
  '/',
  '/assets/css/style.css',
  '/assets/css/ecobot.css',
  '/assets/css/feed.css',
  '/assets/css/index.css',
  '/assets/css/ranking.css',

  '/assets/js/chatbot.js',
  '/assets/js/feed.js',
  '/assets/js/main.js',
  '/assets/js/ranking.js',
  '/assets/js/script.js',

  '/manifest.json',
  
  'assets/Images/icons/icon-72x72.png',
  'assets/Images/icons/icon-96x96.png',
  'assets/Images/icons/icon-128x128.png',
  'assets/Images/icons/icon-144x144.png',
  'assets/Images/icons/icon-152x152.png',
  'assets/Images/icons/icon-192x192.png',
  'assets/Images/icons/icon-384x384.png',
  'assets/Images/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});