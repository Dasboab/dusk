# DUSK Architecture Notes

## Current state

The current game is a large single-file HTML prototype. It contains:

- DOM user interface
- Three.js rendering
- world generation
- unit definitions
- building definitions
- production logic
- AI logic
- input handling
- fog of war
- combat resolution

This is good for proving the concept, but hard to extend safely.

## Current deployment strategy

As of v0.5, `index.html` IS the game: one self contained file with the DOM UI, Three.js scene and
all game logic in a single inline script. There is no iframe and no runtime patch injection.

The earlier iframe plus `v0x_patch.js` approach was dropped. It was fragile (patches monkey patched
core functions by name and one call, `formation()`, referenced a function that never existed, which
threw on every move order) and it made caching and debugging harder. The old patches are kept in
`/archive` for reference only and are not loaded.

`index.html` is produced from the previous monolith by an offline assembler (`build_v05.py`, kept
outside the repo) that splices a single integration block in before the START/END section. The
output is plain HTML; nothing about the assembler is needed at runtime.

## Current structure

```text
/index.html                 The game (self contained)
/dusk_index_fixed.html      Previous stable monolith, fallback
/archive/                   Retired runtime patches (reference only)
/docs/ROADMAP.md
/docs/ARCHITECTURE.md
/docs/BACKEND.md
```

## Recommended medium-term structure

```text
/src
  /engine
    loop.js
    renderer.js
    input.js
    fog.js
    combat.js
    movement.js
  /game
    state.js
    economy.js
    production.js
    ai.js
    tech-tree.js
  /data
    buildings.js
    units.js
    weapons.js
    maps.js
  /ui
    command-bar.js
    sidebar.js
    minimap.js
    overlays.js
  /net
    client.js
    protocol.js
```

## Data-driven unit schema

Eventually every unit should be declared as data rather than hard-coded behavior.

Example:

```js
export const units = {
  fpvDrone: {
    name: 'FPV Strike Drone',
    role: 'single_use_precision_strike',
    domain: 'air',
    producedBy: 'droneBay',
    cost: { credits: 220, electronics: 1 },
    movement: { speed: 22, altitude: 12 },
    sensors: { visual: 22 },
    weapon: 'fpvWarhead',
    traits: ['singleUse', 'requiresControlLink']
  }
};
```

## Multiplayer direction

The persistent version should be server-authoritative.

Client responsibilities:
- rendering
- input capture
- prediction for local responsiveness
- UI state

Server responsibilities:
- authoritative game state
- combat resolution
- economy ticks
- persistence
- matchmaking/spawn placement
- anti-cheat

## Cloudflare fit

Cloudflare Pages is appropriate for the static client.

Cloudflare Workers can later support:
- lightweight API endpoints
- account bootstrap
- save data
- matchmaking queue
- Durable Objects for regional world cells

For iPad-only development, Cloudflare Pages via GitHub integration is preferable because it requires no local terminal or Wrangler commands.
