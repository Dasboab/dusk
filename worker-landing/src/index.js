// Broken Meridian landing page
const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BROKEN MERIDIAN : browser RTS</title>
<meta name="description" content="Broken Meridian is a real-time strategy game that runs in your browser. Combined arms across land, sea and air against three rival factions. Nothing to install.">
<link rel="canonical" href="https://main.broken-meridian.com/">
<meta property="og:title" content="BROKEN MERIDIAN">
<meta property="og:description" content="Browser RTS. Armour, drones and a navy against three rival factions. Play free, nothing to install.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://main.broken-meridian.com/">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#0d0a16">
<link rel="icon" type="image/svg+xml" href='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13.5" fill="%23161022" stroke="%23f0a24a" stroke-width="2"/><path d="M4.5 16h23" stroke="%238a6a3a" stroke-width="1.3"/><path d="M7 9.5c5-2.6 13-2.6 18 0M7 22.5c5 2.6 13 2.6 18 0" stroke="%238a6a3a" stroke-width="1.1" fill="none"/><path d="M16 2.5C11.5 6.5 11.5 12 13.5 15" stroke="%23ffd08a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M18.5 17C20.5 20.5 20.5 25.5 16 29.5" stroke="%23ffd08a" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>'>
<style>
:root{--amber:#f0a24a;--amber-hi:#ffd08a;--ink:#e8dff2;--muted:#9a8ab0;--brass:#6d4f2a;}
*{box-sizing:border-box;margin:0;}
body{background:radial-gradient(120% 90% at 50% 0%,#241736 0%,#120b1e 55%,#0a0613 100%);
 color:var(--ink);font:15px/1.6 system-ui,-apple-system,'Segoe UI',sans-serif;min-height:100vh;
 display:flex;flex-direction:column;align-items:center;padding:8vh 20px 40px;}
.mark{width:96px;height:96px;margin-bottom:22px;filter:drop-shadow(0 0 22px rgba(240,162,74,.35));}
h1{font-size:clamp(24px,6vw,44px);font-weight:800;letter-spacing:.3em;color:var(--amber);
 text-shadow:0 0 24px rgba(255,160,60,.4);white-space:nowrap;}
.tag{color:var(--muted);letter-spacing:.14em;text-transform:uppercase;font-size:12px;margin:10px 0 30px;}
a.play{display:inline-block;padding:14px 46px;font-size:17px;font-weight:800;letter-spacing:.18em;
 color:#1a1026;text-decoration:none;border-radius:3px;border:1px solid #0a0712;
 background:linear-gradient(180deg,var(--amber-hi),var(--amber) 55%,#b06f28);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.5),inset 0 -2px 3px rgba(0,0,0,.35),0 4px 16px rgba(240,162,74,.3);}
a.play:hover{filter:brightness(1.08);}
.feat{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;max-width:860px;margin-top:52px;}
.feat div{flex:1 1 240px;max-width:270px;padding:16px 18px;border:1px solid var(--brass);border-radius:3px;
 background:linear-gradient(180deg,rgba(41,30,60,.9),rgba(22,14,36,.9));
 box-shadow:inset 0 1px 0 rgba(211,160,94,.25),inset 0 -1px 0 rgba(0,0,0,.6);}
.feat b{display:block;color:var(--amber-hi);letter-spacing:.08em;margin-bottom:6px;font-size:13px;text-transform:uppercase;}
.feat p{font-size:13px;color:var(--muted);}
footer{margin-top:auto;padding-top:48px;font-size:11px;color:#6a5c80;letter-spacing:.08em;}
</style>
</head>
<body>
<svg class="mark" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13.5" fill="#161022" stroke="#f0a24a" stroke-width="2"/><path d="M4.5 16h23" stroke="#8a6a3a" stroke-width="1.3"/><path d="M7 9.5c5-2.6 13-2.6 18 0M7 22.5c5 2.6 13 2.6 18 0" stroke="#8a6a3a" stroke-width="1.1" fill="none"/><path d="M16 2.5C11.5 6.5 11.5 12 13.5 15" stroke="#ffd08a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M18.5 17C20.5 20.5 20.5 25.5 16 29.5" stroke="#ffd08a" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>
<h1>BROKEN MERIDIAN</h1>
<div class="tag">Real-time strategy &middot; in your browser &middot; nothing to install</div>
<a class="play" href="https://app.broken-meridian.com">DEPLOY</a>
<div class="feat">
 <div><b>Combined arms</b><p>Armour, infantry, drones, counter-drone teams and a navy across land, sea and air.</p></div>
 <div><b>Three rival factions</b><p>Hold your ground against three AI warbands that fight you, and each other.</p></div>
 <div><b>Islands worth taking</b><p>Rich auren deposits offshore. Bring a Landing Craft, hold the beach.</p></div>
</div>
<footer>&copy; 2026 Broken Meridian. Runs on phones, tablets and desktops.</footer>
</body>
</html>`;
const SEC = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'content-security-policy': "frame-ancestors 'none'"
};
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/robots.txt')
      return new Response('User-agent: *\nAllow: /\nSitemap: https://main.broken-meridian.com/sitemap.xml\n',
        { headers: { 'content-type': 'text/plain', ...SEC } });
    if (url.pathname === '/sitemap.xml')
      return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://main.broken-meridian.com/</loc></url></urlset>',
        { headers: { 'content-type': 'application/xml', ...SEC } });
    if (url.hostname !== 'main.broken-meridian.com') {
      url.hostname = 'main.broken-meridian.com';
      return Response.redirect(url.toString(), 301);
    }
    return new Response(PAGE, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300',
        ...SEC
      }
    });
  }
};
