/* CORE-MIND SERVICE WORKER v1.0
   Fungsi: Memastikan aplikasi berjalan 100% Offline (Sovereignty).
*/

const CACHE_NAME = 'core-mind-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// Tahap 1: INSTALLATION - Menyimpan fail ke dalam Cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[CORE-OS] Caching System Assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Tahap 2: ACTIVATION - Membersihkan cache lama jika ada update
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[CORE-OS] Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Tahap 3: FETCH - Mengambil fail dari Cache jika Offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika ada dalam cache, guna cache. Jika tak, guna network.
                return response || fetch(event.request);
            })
    );
});
