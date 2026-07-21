const CACHE_PREFIX = 'zu1k-static';
const CACHE_VERSION = 'v5';
const PAGE_CACHE = `${CACHE_PREFIX}-pages-${CACHE_VERSION}`;
const ASSET_CACHE = `${CACHE_PREFIX}-assets-${CACHE_VERSION}`;
const CURRENT_CACHES = new Set([PAGE_CACHE, ASSET_CACHE]);
const LEGACY_CACHES = new Set(['zu1k-astro-v4']);

const OFFLINE_PAGES = ['/', '/404.html'];
const APP_ASSETS = new Set([
  '/site.webmanifest',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/images/logo.jpg',
]);

const isCacheable = (response) => {
  const cacheControl = response.headers.get('cache-control') ?? '';
  return response.ok
    && response.type === 'basic'
    && !response.redirected
    && !/\bno-store\b/i.test(cacheControl);
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(PAGE_CACHE).then((cache) => cache.addAll(OFFLINE_PAGES)),
      caches.open(ASSET_CACHE).then((cache) => cache.addAll([...APP_ASSETS])),
    ]).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  const enableNavigationPreload = self.registration.navigationPreload
    ? self.registration.navigationPreload.enable()
    : Promise.resolve();

  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => Promise.all(
        keys
          .filter((key) => (
            (key.startsWith(CACHE_PREFIX) && !CURRENT_CACHES.has(key))
            || LEGACY_CACHES.has(key)
          ))
          .map((key) => caches.delete(key)),
      )),
      enableNavigationPreload,
    ]).then(() => self.clients.claim()),
  );
});

const networkFirstPage = async (event, request, url) => {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const response = await event.preloadResponse || await fetch(request);
    const contentType = response.headers.get('content-type') ?? '';

    if (isCacheable(response) && contentType.includes('text/html')) {
      await cache.put(url.pathname, response.clone());
    }

    return response;
  } catch {
    const cachedPage = await cache.match(url.pathname);
    if (cachedPage) return cachedPage;

    const fallback = await cache.match('/404.html');
    if (fallback) {
      const headers = new Headers(fallback.headers);
      headers.set('cache-control', 'no-store');
      return new Response(await fallback.blob(), {
        status: 503,
        statusText: 'Service Unavailable',
        headers,
      });
    }

    return new Response('当前网络不可用，请稍后重试。', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
};

const cacheFirstAsset = async (request) => {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (isCacheable(response)) await cache.put(request, response.clone());
  return response;
};

const networkFirstAsset = async (request) => {
  const cache = await caches.open(ASSET_CACHE);

  try {
    const response = await fetch(request);
    if (isCacheable(response)) await cache.put(request, response.clone());
    return response;
  } catch {
    return await cache.match(request) || Response.error();
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPage(event, request, url));
    return;
  }

  if (url.pathname.startsWith('/_astro/')) {
    event.respondWith(cacheFirstAsset(request));
    return;
  }

  if (APP_ASSETS.has(url.pathname)) {
    event.respondWith(networkFirstAsset(request));
  }
});
