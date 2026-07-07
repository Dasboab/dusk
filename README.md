# DUSK: Dawn Convoy (v0.5)

A browser real time strategy game built as a single HTML file with Three.js (r128). Modern combined
arms: armour, drones, counter drone teams, air power and a navy, on a dusk lit coastal map.

## Play

Open `index.html`. That file is the whole game, no build step and no runtime patching. Press START,
escort the Mobile HQ to open ground, press **DEP** to deploy it into a Construction Yard, then build
up and level the enemy Construction Yard.

`dusk_index_fixed.html` is kept as a known good fallback of the previous stable build.

## Hosting

The live site runs on Cloudflare Pages, connected to this GitHub repository. Every push to `main`
triggers an automatic deployment of the repo root, so `index.html` is served as the entry point.
GitHub Pages is also configured (`.github/workflows/pages.yml`) as a mirror.

If a deploy looks stale on an iPhone or iPad:

1. Confirm the Cloudflare Pages dashboard shows the latest commit as the live deployment.
2. Hard reload in Safari, or delete and re add the Home Screen icon (old builds get cached as a PWA).

## What v0.5 adds

- Mobile HQ start: the base arrives as a convoy from the west and deploys into a Construction Yard.
- Drone Bay, Robotics Lab, EW Centre and Air Base tech buildings.
- Recon UAV, FPV strike drone, Strike UAV, Drone Dog, Drone UGV and Counter UAS team.
- Landing Craft and Coastal Frigate for amphibious play; troops beach onto the nearest land.
- Air movement (units cross water and hover), kamikaze drone logic, seaward naval production.
- Terrain dressing: conforming roads, ridge rocks and wrecks. Subtle screen vignette.

## Repository layout

```text
/index.html                 The game (self contained)
/dusk_index_fixed.html      Previous stable monolith, fallback
/archive/                   Old runtime patch files (v02..v04), kept for reference only
/docs/ROADMAP.md
/docs/ARCHITECTURE.md
/.github/workflows/pages.yml
```

## History

Earlier iterations layered gameplay through `v0x_patch.js` files injected at runtime. One of those
(`v04_patch.js`) called a `formation()` function that never existed, which threw on every move order
and made the game look frozen. v0.5 folds the good ideas from those patches natively into
`index.html` and retires the patch loader. The old patches now live in `/archive`.

## Assets
Procedural meshes plus CC0 surface textures from ambientCG (Metal049A, Ground054), vendored under `assets/textures/` and re-scaled to 512px. Unit portrait thumbnails are baked to `assets/units/`. All bundled in-repo; nothing loads from a remote host at runtime. See `assets/textures/CREDITS.txt`.
