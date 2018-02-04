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
        'js/main.js',
        'js/materialize.js',
        'css/materialize/materialize.css',
        'css/main.css',
        'imgs/logo.png',
        'api/v1/houses'
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

  if (requestUrl.pathname.startsWith('/im/pictures/')) {
    event.respondWith(serveImage(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

function serveImage(request) {
  return caches.open(CONTENT_IMAGES_CACHE).then(function(cache) {
    return cache.match(request.url).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(request).then(function(networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}