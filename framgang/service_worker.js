const CACHE_NAME  = 'todo_list-v1';
const CONTENT_TO_CACHE = [
  '/',
  '/todo_list.html',
  '../taptapir/taptapir.js',
  '../taptapir/sunsnake_compiler.js',
]

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME );
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(CONTENT_TO_CACHE);
  })());
});
