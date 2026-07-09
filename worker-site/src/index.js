/* dusk site worker: transparent proxy to the canonical GitHub Pages build.
   HTML is served no-store so browsers never hold a stale game;
   assets get a short revalidated cache. Mirrors live Pages, cannot go stale. */
const ORIGIN = "https://dasboab.github.io/dusk";
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path === "/" || path === "/index.html") path = "/index.html";
    const isHtml = path.endsWith(".html");
    const target = ORIGIN + path + url.search;
    const upstream = await fetch(target, {
      method: request.method === "HEAD" ? "GET" : request.method,
      headers: { "user-agent": request.headers.get("user-agent") || "dusk-proxy" },
      redirect: "follow",
      cf: isHtml ? { cacheTtl: 0, cacheEverything: false }
                 : { cacheTtl: 30, cacheEverything: true }
    });
    const h = new Headers(upstream.headers);
    h.set("access-control-allow-origin", "*");
    h.delete("content-security-policy");
    h.set("x-dusk-proxy", "github-pages");
    if (isHtml) {
      h.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
      h.set("pragma", "no-cache");
    } else {
      h.set("cache-control", "public, max-age=60, must-revalidate");
    }
    return new Response(request.method === "HEAD" ? null : upstream.body,
      { status: upstream.status, statusText: upstream.statusText, headers: h });
  }
};
