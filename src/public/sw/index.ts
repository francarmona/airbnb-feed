const STATIC_CACHE_NAME = 'airbnb-feed-static-v1';
const CONTENT_IMAGES_CACHE = 'airbnb-feed-content-images';
const API_CACHE = 'airbnb-feed-api';
const ALL_CACHES = [
  STATIC_CACHE_NAME,
  CONTENT_IMAGES_CACHE,
  API_CACHE
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        'js/main.js',
        'js/materialize.js',
        'css/materialize/materialize.css',
        'css/main.css',
        'imgs/logo.png'
      ]);
    })
  );
});

self.addEventListener('activate', (event: any) => {
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

self.addEventListener('fetch', (event: any) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.startsWith('/im/pictures/')) {
    event.respondWith(serve(event.request, CONTENT_IMAGES_CACHE));
    return;
  }

  if (requestUrl.pathname.includes('/api/v1/')) {
    event.respondWith(serve(event.request, API_CACHE));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

function serve(request, cacheName) {
  return caches.open(cacheName).then((cache) => {
    return cache.match(request.url).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((networkResponse) => {
        cache.put(request.url, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}