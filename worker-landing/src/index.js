// Broken Meridian landing page v2
const IMG = 'https://app.broken-meridian.com/assets/site';
const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BROKEN MERIDIAN : free browser RTS with online multiplayer</title>
<meta name="description" content="Broken Meridian is a free real-time strategy game that runs in your browser. Command armour, drones and a navy across land, sea and air. Single player campaign and 1v1 online multiplayer. Nothing to install.">
<link rel="canonical" href="https://main.broken-meridian.com/">
<meta property="og:title" content="BROKEN MERIDIAN">
<meta property="og:description" content="Browser RTS. Armour, drones and a navy. Campaign plus 1v1 online multiplayer. Play free, nothing to install.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://main.broken-meridian.com/">
<meta property="og:image" content="${IMG}/shot_combat.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${IMG}/shot_combat.jpg">
<meta name="theme-color" content="#0d0a16">
<link rel="icon" type="image/svg+xml" href='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13.5" fill="%23161022" stroke="%23f0a24a" stroke-width="2"/><path d="M4.5 16h23" stroke="%238a6a3a" stroke-width="1.3"/><path d="M7 9.5c5-2.6 13-2.6 18 0M7 22.5c5 2.6 13 2.6 18 0" stroke="%238a6a3a" stroke-width="1.1" fill="none"/><path d="M16 2.5C11.5 6.5 11.5 12 13.5 15" stroke="%23ffd08a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M18.5 17C20.5 20.5 20.5 25.5 16 29.5" stroke="%23ffd08a" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>'>
<style>
:root{--amber:#f0a24a;--amber-hi:#ffd08a;--ink:#e8dff2;--muted:#9a8ab0;--brass:#6d4f2a;--card1:rgba(41,30,60,.9);--card2:rgba(22,14,36,.9);}
*{box-sizing:border-box;margin:0;}
html{scroll-behavior:smooth;}
body{background:radial-gradient(120% 90% at 50% 0%,#241736 0%,#120b1e 55%,#0a0613 100%);
 color:var(--ink);font:15px/1.65 system-ui,-apple-system,'Segoe UI',sans-serif;min-height:100vh;}
.wrap{max-width:980px;margin:0 auto;padding:0 20px;}
.hero{display:flex;flex-direction:column;align-items:center;text-align:center;padding:7vh 20px 34px;}
.mark{width:88px;height:88px;margin-bottom:20px;filter:drop-shadow(0 0 22px rgba(240,162,74,.35));}
h1{font-size:clamp(24px,6vw,44px);font-weight:800;letter-spacing:.3em;color:var(--amber);
 text-shadow:0 0 24px rgba(255,160,60,.4);white-space:nowrap;}
.tag{color:var(--muted);letter-spacing:.14em;text-transform:uppercase;font-size:12px;margin:10px 0 26px;}
a.play{display:inline-block;padding:14px 46px;font-size:17px;font-weight:800;letter-spacing:.18em;
 color:#1a1026;text-decoration:none;border-radius:3px;border:1px solid #0a0712;
 background:linear-gradient(180deg,var(--amber-hi),var(--amber) 55%,#b06f28);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.5),inset 0 -2px 3px rgba(0,0,0,.35),0 4px 16px rgba(240,162,74,.3);}
a.play:hover{filter:brightness(1.08);}
.sub{font-size:12px;color:var(--muted);margin-top:12px;letter-spacing:.06em;}
.heroshot{width:100%;max-width:900px;margin:38px auto 0;border:1px solid var(--brass);border-radius:4px;
 box-shadow:0 10px 44px rgba(0,0,0,.55),inset 0 0 0 1px rgba(211,160,94,.15);display:block;}
h2{color:var(--amber-hi);letter-spacing:.16em;text-transform:uppercase;font-size:15px;
 margin:64px 0 18px;text-align:center;}
h2:after{content:"";display:block;width:64px;height:1px;background:var(--brass);margin:12px auto 0;}
p.lede{max-width:700px;margin:0 auto;text-align:center;color:var(--muted);}
.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:22px;}
.shots figure{border:1px solid var(--brass);border-radius:4px;overflow:hidden;background:var(--card2);}
.shots img{width:100%;display:block;aspect-ratio:16/9;object-fit:cover;}
.shots figcaption{padding:9px 12px;font-size:12px;color:var(--muted);letter-spacing:.06em;}
.feat{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;margin-top:22px;}
.feat div{padding:16px 18px;border:1px solid var(--brass);border-radius:3px;
 background:linear-gradient(180deg,var(--card1),var(--card2));
 box-shadow:inset 0 1px 0 rgba(211,160,94,.25),inset 0 -1px 0 rgba(0,0,0,.6);}
.feat b{display:block;color:var(--amber-hi);letter-spacing:.08em;margin-bottom:6px;font-size:13px;text-transform:uppercase;}
.feat p{font-size:13px;color:var(--muted);}
ol.how{max-width:640px;margin:22px auto 0;counter-reset:s;list-style:none;}
ol.how li{position:relative;padding:0 0 20px 56px;counter-increment:s;}
ol.how li:before{content:counter(s,decimal-leading-zero);position:absolute;left:0;top:0;
 font-weight:800;font-size:20px;color:var(--amber);letter-spacing:.05em;}
ol.how b{color:var(--ink);display:block;margin-bottom:2px;letter-spacing:.04em;}
ol.how span{color:var(--muted);font-size:13px;}
.mpbox{max-width:640px;margin:22px auto 0;padding:20px 24px;border:1px solid var(--amber);border-radius:4px;
 background:linear-gradient(180deg,rgba(60,40,24,.35),rgba(30,18,12,.35));text-align:center;}
.mpbox b{color:var(--amber-hi);letter-spacing:.1em;text-transform:uppercase;font-size:13px;}
.mpbox p{color:var(--muted);font-size:13px;margin-top:8px;}
.cosm{max-width:640px;margin:22px auto 0;text-align:center;color:var(--muted);font-size:13px;}
.cosm em{color:var(--amber-hi);font-style:normal;}
dl.faq{max-width:640px;margin:22px auto 0;}
dl.faq dt{color:var(--ink);font-weight:700;letter-spacing:.03em;margin-top:18px;}
dl.faq dd{color:var(--muted);font-size:13px;margin:4px 0 0;}
.cta2{text-align:center;margin:64px 0 0;}
footer{text-align:center;padding:56px 20px 40px;font-size:11px;color:#6a5c80;letter-spacing:.08em;}
</style>
</head>
<body>
<div class="hero">
  <svg class="mark" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13.5" fill="#161022" stroke="#f0a24a" stroke-width="2"/><path d="M4.5 16h23" stroke="#8a6a3a" stroke-width="1.3"/><path d="M7 9.5c5-2.6 13-2.6 18 0M7 22.5c5 2.6 13 2.6 18 0" stroke="#8a6a3a" stroke-width="1.1" fill="none"/><path d="M16 2.5C11.5 6.5 11.5 12 13.5 15" stroke="#ffd08a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M18.5 17C20.5 20.5 20.5 25.5 16 29.5" stroke="#ffd08a" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>
  <h1>BROKEN MERIDIAN</h1>
  <div class="tag">Real-time strategy &middot; in your browser</div>
  <a class="play" href="https://app.broken-meridian.com">PLAY NOW</a>
  <div class="sub">Free &middot; no install &middot; no sign-up &middot; phone, tablet or desktop</div>
  <img class="heroshot" src="${IMG}/shot_combat.jpg" width="1280" height="720" alt="A convoy of Meridian armour and infantry fighting off an ambush at dawn" fetchpriority="high">
</div>
<div class="wrap">

<h2>What is it</h2>
<p class="lede">A classic base-building RTS in the spirit of the late-90s greats, rebuilt for the modern web.
Deploy your mobile HQ, mine auren crystal, raise a war economy and take the island back from three rival
factions across land, sea and air. One HTML file, zero installs; it runs on the phone in your pocket.</p>

<div class="shots">
  <figure><img loading="lazy" src="${IMG}/shot_harvest.jpg" width="1280" height="720" alt="Harvesters working an auren crystal field under tank escort"><figcaption>Harvesters work the auren fields; escorts keep them breathing</figcaption></figure>
  <figure><img loading="lazy" src="${IMG}/shot_naval.jpg" width="1280" height="720" alt="Gunboats and a missile corvette patrolling the eastern coast"><figcaption>The eastern sea: gunboats, corvettes and beach landings</figcaption></figure>
  <figure><img loading="lazy" src="${IMG}/shot_combat.jpg" width="1280" height="720" alt="Infantry and vehicles exchanging fire near the mobile HQ"><figcaption>Combined arms firefights with tracers, wrecks and craters</figcaption></figure>
</div>

<h2>Features</h2>
<div class="feat">
  <div><b>Combined arms</b><p>Infantry, armour, MLRS artillery, attack drones, recon UAVs and warships. Every tool has a counter.</p></div>
  <div><b>1v1 online multiplayer</b><p>Create a room, share a four-letter code, fight a symmetric duel. Deterministic lockstep keeps both sides honest.</p></div>
  <div><b>Land, sea and air</b><p>A sinuous eastern coastline, islands to contest, naval yards, beach landings and drone strikes inland.</p></div>
  <div><b>A living economy</b><p>Harvesters mine auren crystal and haul it home. Direct them to safer fields; assign escorts with the protect command.</p></div>
  <div><b>Fog of war</b><p>A billowing shroud hides the island. Scout it back with UAVs or lose armies to what you did not see.</p></div>
  <div><b>Built for touch</b><p>Drag-select, tap orders, squad cohorts and a full command bar designed for phones as much as desktops.</p></div>
</div>

<h2>How to play</h2>
<ol class="how">
  <li><b>Deploy</b><span>Your convoy lands with a mobile HQ. Drive it somewhere defensible and deploy it into a construction yard.</span></li>
  <li><b>Mine</b><span>Build a power plant and a refinery. Harvesters seek auren crystal on their own; tap a distant field to redirect them.</span></li>
  <li><b>Build</b><span>Barracks, war factory, naval yard, drone bay. Queue units, set rally points, form squads.</span></li>
  <li><b>Strike</b><span>Scout with UAVs, protect your harvesters, then break the enemy with combined arms. Take all three factions down.</span></li>
</ol>

<h2>Multiplayer</h2>
<div class="mpbox">
  <b>1v1 skirmish, live now</b>
  <p>Tap MULTIPLAYER on the title screen. Create a match to get a four-letter room code, or join a public
  game from the list. Both commanders start with identical forces on opposite corners of the island.
  First to break the other wins.</p>
</div>

<h2>Fair by design</h2>
<p class="cosm">Broken Meridian is free. A cosmetics workshop is coming: camouflage patterns, faction reskins
and a season pass. <em>Cosmetics only, never stats.</em> No pay-to-win, no energy bars, no adverts mid-battle.</p>

<h2>FAQ</h2>
<dl class="faq">
  <dt>Is it really free?</dt>
  <dd>Yes. The campaign and multiplayer are free. Future purchases are visual only.</dd>
  <dt>What do I need to run it?</dt>
  <dd>Any modern browser. It is one self-contained page; a mid-range phone runs it comfortably.</dd>
  <dt>Does it save my progress?</dt>
  <dd>Yes, locally in your browser, with cloud save slots for signed-in commanders.</dd>
  <dt>How does multiplayer matchmaking work?</dt>
  <dd>Room codes. Make a match, send the code to a friend, or browse the public list. No account needed.</dd>
  <dt>Phone or desktop?</dt>
  <dd>Both. Touch controls are first-class: drag to select, tap to order, long-press for the map.</dd>
</dl>

<div class="cta2"><a class="play" href="https://app.broken-meridian.com">DEPLOY NOW</a></div>
</div>
<footer>BROKEN MERIDIAN &middot; an independent browser wargame &middot; &copy; 2026</footer>
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
