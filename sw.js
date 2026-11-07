/* AVORY 업무 — offline cache. App files: network first (so updates arrive), cache when offline or slow.
   Libraries from CDNs: cache first, saved after the first download. */
const V = 'avory-2026.11.07-1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
const LIBS = ["https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js", "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js", "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"];
const CDN = /(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com)$/;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })));
    await Promise.all(LIBS.map(u => fetch(u, { mode: 'cors' }).then(r => { if (r.ok) return c.put(u, r); }).catch(() => { })));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const old = await caches.keys();
    const cur = await caches.open(V);
    for (const k of old) {
      if (k === V || !k.startsWith('avory-')) continue;
      const prev = await caches.open(k);
      for (const req of await prev.keys()) { if (CDN.test(new URL(req.url).hostname) && !(await cur.match(req))) { const r = await prev.match(req); if (r) await cur.put(req, r); } }
      await caches.delete(k);
    }
    await self.clients.claim();
  })());
});
const timeout = (p, ms) => new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('timeout')), ms); p.then(v => { clearTimeout(t); res(v); }, e => { clearTimeout(t); rej(e); }); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin && url.pathname.endsWith('/version.json')) return;
  if (url.origin === self.location.origin) {
    const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
    const key = isPage ? './index.html' : req;
    e.respondWith((async () => {
      const c = await caches.open(V);
      const net = (isPage ? fetch(url.origin + url.pathname + '?__v=' + Date.now(), { cache: 'no-store' }) : fetch(req)).then(r => { if (r.ok) c.put(key, r.clone()); return r; });
      try { return await timeout(net, isPage ? 4000 : 8000); }
      catch (err) { const hit = await c.match(key, { ignoreSearch: true }); if (hit) { e.waitUntil(net.catch(() => { })); return hit; } return net; }
    })());
    return;
  }
  if (CDN.test(url.hostname)) {
    e.respondWith((async () => {
      const c = await caches.open(V);
      const hit = await c.match(req.url); if (hit) return hit;
      const r = await fetch(req); if (r.ok) c.put(req.url, r.clone()); return r;
    })());
  }
});
