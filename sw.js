// KROFT: работа без интернета. Сначала сеть (чтобы обновления приходили сразу), без сети — сохранённая копия.
const C = "kroft-v1";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "index.html", "manifest.json", "icon-180.png", "icon-192.png"]))); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok && (new URL(e.request.url).origin === location.origin || /fonts\.(googleapis|gstatic)|cdnjs/.test(e.request.url))) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match("index.html"))));
});
