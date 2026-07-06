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

For now, `index.html` loads the original game file inside an iframe and injects `v02_patch.js`.

This gives us three advantages:

1. We avoid repeatedly replacing a huge HTML file.
2. We can add units/buildings/systems incrementally.
3. The original demo remains available as a fallback.

## Recommended short-term structure

```text
/index.html
/dusk_index_fixed.html      Original playable monolith
/v02_patch.js               Incremental gameplay patch
/docs/ROADMAP.md
/docs/ARCHITECTURE.md
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
