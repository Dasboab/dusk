const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Broken Meridian — free browser RTS. No install, no sign-up.</title>
<meta name="description" content="A real-time strategy game that runs entirely in your browser. Build a base, mine auren, field armour, drones and a navy, and crush three rival factions. Free, instant, multiplayer.">
<link rel="canonical" href="https://main.broken-meridian.com/">
<meta property="og:title" content="Broken Meridian — browser RTS">
<meta property="og:description" content="Command armour, drones and a navy in a dusk-lit warzone. Free, no install, lockstep multiplayer.">
<meta property="og:url" content="https://main.broken-meridian.com/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%230d0a16'/><path d='M16 4v24M8 10h16M6 22h20' stroke='%23f0a24a' stroke-width='2.4'/></svg>">
<style>
:root{
  --bg:#0d0a16;--bg2:#160e24;--panel-a:#291e3c;--panel-b:#160e24;
  --amber:#f0a24a;--amber-hi:#ffd08a;--amber-dim:rgba(240,162,74,.35);
  --ink:#e8dff2;--muted:#9a8ab0;--brass:#6d4f2a;--teal:#37e0cf;
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--ink);
  font:16px/1.65 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(1100px 500px at 78% -10%,rgba(240,162,74,.10),transparent 60%),
             radial-gradient(900px 600px at 8% 108%,rgba(55,224,207,.05),transparent 55%);}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}
.wrap{max-width:1060px;margin:0 auto;padding:0 22px;position:relative;z-index:1;}
a{color:var(--amber-hi);}
h1,h2,h3{line-height:1.15;letter-spacing:.02em;}
.panel{background:linear-gradient(180deg,rgba(41,30,60,.94),rgba(22,14,36,.94));
  border:1px solid var(--brass);border-radius:4px;
  box-shadow:inset 0 1px 0 rgba(211,160,94,.28),inset 0 -1px 0 rgba(0,0,0,.65),0 4px 14px rgba(0,0,0,.5);}
.kicker{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);}
.btn{display:inline-block;padding:13px 28px;border-radius:3px;font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;font-size:13px;text-decoration:none;border:1px solid var(--brass);}
.btn.primary{background:linear-gradient(180deg,var(--amber-hi),var(--amber) 55%,#c77e2f);color:#1a0f05;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 3px 10px rgba(240,162,74,.3);}
.btn.primary:hover{filter:brightness(1.08);}
.btn.ghost{color:var(--ink);background:rgba(30,22,44,.7);}
.btn.ghost:hover{border-color:var(--amber);color:var(--amber-hi);}

/* nav */
nav{position:sticky;top:0;z-index:20;background:linear-gradient(180deg,rgba(20,13,32,.97),rgba(13,10,22,.92));
  border-bottom:1px solid var(--brass);backdrop-filter:blur(6px);}
nav .wrap{display:flex;align-items:center;gap:22px;height:58px;}
.mark{width:26px;height:26px;flex:0 0 26px;}
.brand{font-weight:800;letter-spacing:.22em;font-size:13px;color:var(--ink);text-decoration:none;white-space:nowrap;}
nav .links{display:flex;gap:20px;margin-left:auto;}
nav .links a{color:var(--muted);text-decoration:none;font-size:12px;letter-spacing:.16em;text-transform:uppercase;}
nav .links a:hover{color:var(--amber);}
nav .playmini{margin-left:6px;padding:8px 18px;font-size:11px;}
@media(max-width:720px){nav .links{display:none;}}

/* hero */
.hero{padding:74px 0 60px;}
.hero .wrap{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center;}
@media(max-width:860px){.hero .wrap{grid-template-columns:1fr;gap:36px;}}
.hero h1{font-size:clamp(34px,5.4vw,54px);font-weight:800;margin:14px 0 18px;}
.hero h1 em{font-style:normal;color:var(--amber);text-shadow:0 0 22px rgba(240,162,74,.35);}
.hero p.lede{color:var(--muted);font-size:17px;max-width:44ch;}
.ctas{display:flex;gap:14px;margin:28px 0 22px;flex-wrap:wrap;}
.chips{display:flex;gap:8px;flex-wrap:wrap;}
.chip{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);
  border:1px solid rgba(109,79,42,.7);border-radius:2px;padding:5px 10px;background:rgba(22,14,36,.6);}
.chip b{color:var(--amber);font-weight:700;}

/* tactical console */
.console{padding:10px;}
.console svg{display:block;width:100%;height:auto;}
.console .bar{display:flex;justify-content:space-between;align-items:center;padding:6px 10px 8px;
  font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:var(--muted);}
.console .bar b{color:var(--amber);}
.dotlive{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--teal);
  box-shadow:0 0 8px var(--teal);animation:blink 1.6s infinite;vertical-align:1px;margin-right:6px;}
@keyframes blink{50%{opacity:.25;}}
@keyframes sweep{to{transform:rotate(360deg);}}
.sweep{transform-origin:300px 170px;animation:sweep 7s linear infinite;}
@media(prefers-reduced-motion:reduce){.sweep,.dotlive{animation:none;}}

/* ticker */
.ticker{border-top:1px solid var(--brass);border-bottom:1px solid var(--brass);
  background:rgba(22,14,36,.8);overflow:hidden;}
.ticker .wrap{display:flex;gap:34px;justify-content:center;flex-wrap:wrap;padding:11px 22px;}
.ticker span{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--muted);white-space:nowrap;}
.ticker span::before{content:"◆";color:var(--amber);margin-right:12px;font-size:8px;}

section{padding:66px 0;}
section h2{font-size:clamp(24px,3.4vw,34px);margin:10px 0 14px;}
.lede2{color:var(--muted);max-width:62ch;font-size:17px;}

/* features */
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:34px;}
@media(max-width:860px){.grid3{grid-template-columns:1fr 1fr;}}
@media(max-width:560px){.grid3{grid-template-columns:1fr;}}
.card{padding:20px 20px 18px;}
.card svg{width:26px;height:26px;color:var(--amber);margin-bottom:12px;}
.card h3{font-size:15px;letter-spacing:.06em;margin-bottom:7px;}
.card p{font-size:13.5px;color:var(--muted);line-height:1.6;}

/* steps */
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:34px;}
@media(max-width:860px){.steps{grid-template-columns:1fr 1fr;}}
@media(max-width:560px){.steps{grid-template-columns:1fr;}}
.step{padding:20px;position:relative;}
.step .n{font-size:30px;font-weight:800;color:var(--amber);opacity:.9;font-variant-numeric:tabular-nums;}
.step h3{font-size:14px;letter-spacing:.14em;text-transform:uppercase;margin:8px 0 6px;}
.step p{font-size:13px;color:var(--muted);}

/* multiplayer */
.mp{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center;}
@media(max-width:860px){.mp{grid-template-columns:1fr;}}
.roomcard{padding:26px;text-align:center;}
.roomcard .lbl{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);}
.code{display:flex;gap:10px;justify-content:center;margin:16px 0 12px;}
.code b{width:52px;height:62px;display:grid;place-items:center;font-size:30px;font-weight:800;color:var(--amber);
  background:rgba(13,10,22,.85);border:1px solid var(--brass);border-radius:3px;
  box-shadow:inset 0 2px 6px rgba(0,0,0,.7),inset 0 -1px 0 rgba(211,160,94,.2);}
.roomcard small{color:var(--muted);font-size:12px;}

ul.clean{list-style:none;margin-top:18px;}
ul.clean li{padding:9px 0 9px 26px;position:relative;color:var(--muted);font-size:14.5px;}
ul.clean li::before{content:"";position:absolute;left:0;top:15px;width:12px;height:2px;background:var(--amber);}
ul.clean b{color:var(--ink);}

/* faq */
details{border:1px solid rgba(109,79,42,.7);border-radius:3px;background:rgba(22,14,36,.7);
  margin-bottom:10px;padding:0 18px;}
summary{cursor:pointer;padding:15px 0;font-weight:600;font-size:14.5px;letter-spacing:.03em;list-style:none;position:relative;padding-right:26px;}
summary::-webkit-details-marker{display:none;}
summary::after{content:"+";position:absolute;right:2px;top:12px;color:var(--amber);font-size:18px;}
details[open] summary::after{content:"–";}
details p{color:var(--muted);font-size:14px;padding:0 0 16px;}

/* final cta + footer */
.final{text-align:center;padding:84px 0 90px;}
.final h2{font-size:clamp(28px,4.2vw,42px);}
.final p{color:var(--muted);margin:12px 0 30px;}
footer{border-top:1px solid var(--brass);padding:26px 0 34px;}
footer .wrap{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);}
footer a{color:var(--muted);text-decoration:none;}
footer a:hover{color:var(--amber);}
</style>
</head>
<body>

<nav><div class="wrap">
  <svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" fill="none"/><path d="M16 3v26M7 10h18M5 22h22" stroke="#f0a24a" stroke-width="2.4" stroke-linecap="round"/></svg>
  <a class="brand" href="/">BROKEN MERIDIAN</a>
  <div class="links">
    <a href="#features">Features</a><a href="#how">How to play</a><a href="#mp">Multiplayer</a><a href="#faq">FAQ</a>
  </div>
  <a class="btn primary playmini" href="https://app.broken-meridian.com">Play</a>
</div></nav>

<header class="hero"><div class="wrap">
  <div>
    <div class="kicker">Free browser RTS &middot; v0.5</div>
    <h1>Command the dusk.<br><em>Hold the meridian.</em></h1>
    <p class="lede">A real-time strategy game that runs entirely in your browser. Deploy your HQ, mine auren, and field armour, drones and a navy against three rival factions on a coast where the sun never fully rises.</p>
    <div class="ctas">
      <a class="btn primary" href="https://app.broken-meridian.com">Play now</a>
      <a class="btn ghost" href="#how">How it works</a>
    </div>
    <div class="chips">
      <span class="chip"><b>Free</b> forever</span>
      <span class="chip"><b>No</b> install</span>
      <span class="chip"><b>No</b> sign-up</span>
      <span class="chip"><b>Phone</b> &amp; desktop</span>
    </div>
  </div>
  <div class="console panel" aria-hidden="true">
    <div class="bar"><span><span class="dotlive"></span>Tactical uplink</span><b>SECTOR 07 · DAWN CONVOY</b></div>
    <svg viewBox="0 0 600 340" class="mono">
      <rect width="600" height="340" fill="#0b0814"/>
      <g stroke="rgba(240,162,74,.09)" stroke-width="1">
        <path d="M0 68h600M0 136h600M0 204h600M0 272h600"/>
        <path d="M100 0v340M200 0v340M300 0v340M400 0v340M500 0v340"/>
      </g>
      <path d="M418 0q-36 70-10 130t-6 118q-24 52 14 92" fill="none" stroke="rgba(55,224,207,.5)" stroke-width="2"/>
      <path d="M418 0q-36 70-10 130t-6 118q-24 52 14 92L600 340V0Z" fill="rgba(55,224,207,.05)"/>
      <g fill="none" stroke="rgba(240,162,74,.22)" stroke-width="1">
        <ellipse cx="150" cy="120" rx="95" ry="55"/><ellipse cx="150" cy="120" rx="62" ry="34"/><ellipse cx="150" cy="120" rx="30" ry="15"/>
        <ellipse cx="220" cy="260" rx="80" ry="42"/><ellipse cx="220" cy="260" rx="46" ry="23"/>
      </g>
      <g fill="rgba(55,224,207,.14)" stroke="rgba(55,224,207,.45)">
        <ellipse cx="505" cy="90" rx="30" ry="17"/><ellipse cx="540" cy="205" rx="22" ry="13"/><ellipse cx="495" cy="295" rx="26" ry="14"/>
      </g>
      <path d="M300 0v340" stroke="rgba(255,208,138,.4)" stroke-width="1.4" stroke-dasharray="7 6"/>
      <text x="308" y="18" fill="rgba(255,208,138,.6)" font-size="9" letter-spacing="2">MERIDIAN 0°</text>
      <g class="sweep"><path d="M300 170L560 60A290 290 0 0 0 300 -120Z" fill="rgba(55,224,207,.06)"/><path d="M300 170L560 60" stroke="rgba(55,224,207,.5)" stroke-width="1.4"/></g>
      <g fill="#f0a24a">
        <path d="M120 118l7 7-7 7-7-7Z"/><path d="M156 132l7 7-7 7-7-7Z"/><path d="M188 108l7 7-7 7-7-7Z"/>
        <path d="M236 252l7 7-7 7-7-7Z"/><path d="M262 274l7 7-7 7-7-7Z"/>
      </g>
      <g fill="none" stroke="#ff5f6b" stroke-width="1.6">
        <path d="M448 78l12 12m0-12l-12 12"/><path d="M470 232l12 12m0-12l-12 12"/><path d="M430 300l12 12m0-12l-12 12"/>
      </g>
      <rect x="106" y="96" width="100" height="60" fill="none" stroke="rgba(255,208,138,.65)" stroke-width="1.2" stroke-dasharray="5 4"/>
      <text x="106" y="90" fill="rgba(255,208,138,.7)" font-size="9" letter-spacing="2">STRIKE GROUP A</text>
      <g fill="#9a8ab0" font-size="8" letter-spacing="2">
        <text x="12" y="332">GRID 44-N</text><text x="522" y="332">AUREN RICH</text>
      </g>
    </svg>
  </div>
</div></header>

<div class="ticker"><div class="wrap">
  <span>Lockstep multiplayer</span><span>Combined arms</span><span>Land, air &amp; sea</span><span>Runs on your phone</span><span>One file, ~2 MB</span>
</div></div>

<section id="about"><div class="wrap">
  <div class="kicker">The game</div>
  <h2>Classic RTS. Zero friction.</h2>
  <p class="lede2">Broken Meridian is built in the spirit of the golden-age base builders: harvest, construct, tech up, attack-move. There is no launcher, no account and no download. Open the link, press Deploy, and you are playing in under ten seconds, on a phone or a desktop.</p>
</div></section>

<section id="features" style="padding-top:0;"><div class="wrap">
  <div class="kicker">Arsenal</div>
  <h2>Everything a war needs</h2>
  <div class="grid3">
    <div class="card panel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16M6 20V9l6-4.5L18 9v11"/><path d="M10 20v-5h4v5"/></svg>
      <h3>Base building</h3><p>Power plants, refineries, factories, drone bays and coastal yards. Placement matters; power matters more.</p></div>
    <div class="card panel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18l3-9 3 5 3-8 3 12"/><path d="M3 21h18"/></svg>
      <h3>Auren economy</h3><p>Harvesters work glowing ore fields while you defend the lines. Redirect them mid-run; they remember their field.</p></div>
    <div class="card panel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="7" rx="1.5"/><circle cx="8.5" cy="18" r="1.6"/><circle cx="15.5" cy="18" r="1.6"/><path d="M8 11V8h8v3"/></svg>
      <h3>Combined arms</h3><p>Riflemen, rockets, APCs, tanks, heavy armour and MLRS. Every unit counters something; nothing counters everything.</p></div>
    <div class="card panel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v6M12 10l7 4M12 10l-7 4"/><circle cx="12" cy="4" r="1.6"/><circle cx="19" cy="14" r="1.6"/><circle cx="5" cy="14" r="1.6"/><path d="M8 20h8"/></svg>
      <h3>Drone warfare</h3><p>Recon UAVs, FPV strike drones and ground bots, plus EW centres to jam the enemy's swarm before it reaches you.</p></div>
    <div class="card panel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0"/><path d="M6 14l1.5-6h7L19 14"/><path d="M11 8V5h2"/></svg>
      <h3>Naval theatre</h3><p>Gunboats, corvettes and landing craft. Rich auren islands sit offshore; whoever rules the water rules the bank.</p></div>
    <div class="card panel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.8-7 10-4-2.2-7-5.5-7-10V6z"/><circle cx="12" cy="11" r="2.2"/></svg>
      <h3>Real orders</h3><p>Attack-move, patrol, guard, escort, scout, boarding and rally points, from one dockside command bar.</p></div>
  </div>
</div></section>

<section id="how"><div class="wrap">
  <div class="kicker">Field manual</div>
  <h2>From convoy to conquest</h2>
  <div class="steps">
    <div class="step panel"><div class="n">01</div><h3>Deploy</h3><p>Escort the Mobile HQ to open ground and unfold it into your Construction Yard.</p></div>
    <div class="step panel"><div class="n">02</div><h3>Mine</h3><p>Raise power and a refinery. Harvesters stream auren back from the glowing fields.</p></div>
    <div class="step panel"><div class="n">03</div><h3>Build</h3><p>Barracks, factory, drone bay, naval yard. Tech towards the tools your enemy fears.</p></div>
    <div class="step panel"><div class="n">04</div><h3>Strike</h3><p>Three factions hold the ridges. Level every enemy Construction Yard to win.</p></div>
  </div>
</div></section>

<section id="mp"><div class="wrap mp">
  <div>
    <div class="kicker">Multiplayer</div>
    <h2>Four letters between you and a fight</h2>
    <p class="lede2">Host a skirmish, send the room code, and you are both in the same deterministic battle. Lockstep networking keeps every unit identical on every screen, even on mobile data.</p>
    <ul class="clean">
      <li><b>Instant rooms.</b> No lobbies to browse, no matchmaking queue.</li>
      <li><b>Cross-device.</b> Phone versus desktop is a fair fight.</li>
      <li><b>Deterministic.</b> One shared seed, one shared outcome.</li>
    </ul>
  </div>
  <div class="roomcard panel">
    <div class="lbl">Room code</div>
    <div class="code mono"><b>K</b><b>I</b><b>L</b><b>O</b></div>
    <small>Share it. That is the whole setup.</small>
  </div>
</div></section>

<section id="fair" style="padding-top:0;"><div class="wrap">
  <div class="kicker">Principles</div>
  <h2>Fair by design</h2>
  <p class="lede2">The full game is free and always will be. If a shop ever arrives it will sell cosmetics only: patterns, palettes, flair. Nothing bought will ever change a unit's stats, and every battle stays winnable on skill alone.</p>
</div></section>

<section id="faq"><div class="wrap">
  <div class="kicker">Questions</div>
  <h2>FAQ</h2>
  <div style="max-width:720px;margin-top:26px;">
    <details><summary>What do I need to play?</summary><p>A reasonably recent browser. It runs on iPhone, Android, and any desktop. The whole game is a single small page; there is nothing to install.</p></details>
    <details><summary>Does it cost anything?</summary><p>No. The game is free, with no account, no adverts and no paywall. Any future shop will be cosmetics only.</p></details>
    <details><summary>How does multiplayer work?</summary><p>One player hosts and gets a four-letter room code. The other enters it. Both simulations run in lockstep from a shared seed, so the battle is identical on both screens.</p></details>
    <details><summary>Can I play on a phone?</summary><p>Yes, it is designed for touch: drag to pan, pinch to zoom, tap to select and order, with a dockside toolbar for build and command.</p></details>
    <details><summary>Will my progress be saved?</summary><p>Skirmishes are self-contained today. Cloud saves and leaderboards are on the roadmap and the backend for them is already live.</p></details>
  </div>
</div></section>

<div class="final"><div class="wrap">
  <h2>The ridges will not take themselves.</h2>
  <p>Free. Instant. In your browser right now.</p>
  <a class="btn primary" href="https://app.broken-meridian.com">Deploy now</a>
</div></div>

<footer><div class="wrap">
  <span>Broken Meridian &copy; 2026</span>
  <span><a href="https://app.broken-meridian.com">Play</a> &nbsp;&middot;&nbsp; <a href="#faq">FAQ</a></span>
</div></footer>

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
