const STATIC_CACHE_NAME = 'airbnb-feed-static-v1';
const CONTENT_IMAGES_CACHE = 'airbnb-feed-content-images';
const ALL_CACHES = [
  STATIC_CACHE_NAME,
  CONTENT_IMAGES_CACHE
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        'js/main.js'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('airbnb-feed-') &&
            !ALL_CACHES.includes(cacheName);
        }).map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('index.html'));
      return;
    }
  }

  /*if (requestUrl.pathname.startsWith('/photos/')) {
    event.respondWith(servePhoto(event.request));
    return;
  }*/

  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});