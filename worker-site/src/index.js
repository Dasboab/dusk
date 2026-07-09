/* dusk site worker: transparent proxy to the canonical GitHub Pages build,
   so https://dusk.<subdomain>.workers.dev always mirrors the live game
   (HTML + assets/models/*.glb + textures) and can never go stale. */
const ORIGIN = "https://dasboab.github.io/dusk";
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path === "/" || path === "/index.html") path = "/index.html";
    const target = ORIGIN + path + url.search;
    const upstream = await fetch(target, {
      method: request.method === "HEAD" ? "GET" : request.method,
      headers: { "user-agent": request.headers.get("user-agent") || "dusk-proxy" },
      redirect: "follow",
      cf: { cacheTtl: 60, cacheEverything: true }
    });
    const h = new Headers(upstream.headers);
    h.set("access-control-allow-origin", "*");
    h.delete("content-security-policy");
    h.set("x-dusk-proxy", "github-pages");
    return new Response(request.method === "HEAD" ? null : upstream.body,
      { status: upstream.status, statusText: upstream.statusText, headers: h });
  }
};
