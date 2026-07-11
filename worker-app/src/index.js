// Broken Meridian game proxy: GitHub Pages origin, no-store HTML
const ORIGIN = 'https://dasboab.github.io/dusk';
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path === '/' || path === '/index.html') path = '/index.html';
    const isHtml = path.endsWith('.html');
    const upstream = await fetch(ORIGIN + path + url.search, {
      method: request.method === 'HEAD' ? 'GET' : request.method,
      headers: { 'user-agent': request.headers.get('user-agent') || 'bm-proxy' },
      redirect: 'follow',
      cf: isHtml ? { cacheTtl: 0, cacheEverything: false }
                 : { cacheTtl: 30, cacheEverything: true }
    });
    const h = new Headers(upstream.headers);
    h.set('access-control-allow-origin', '*');
    h.delete('content-security-policy');
    h.set('x-bm-proxy', 'github-pages');
    h.set('strict-transport-security', 'max-age=31536000; includeSubDomains');
    h.set('x-content-type-options', 'nosniff');
    h.set('referrer-policy', 'strict-origin-when-cross-origin');
    h.set('content-security-policy', "frame-ancestors 'none'");
    if (isHtml) {
      h.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
      h.set('pragma', 'no-cache');
    } else {
      h.set('cache-control', 'public, max-age=60, must-revalidate');
    }
    return new Response(request.method === 'HEAD' ? null : upstream.body,
      { status: upstream.status, statusText: upstream.statusText, headers: h });
  }
};
