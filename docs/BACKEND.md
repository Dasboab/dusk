# DUSK Backend

This document describes the server side of Dusk and how it maps onto the
ARCHITECTURE.md plan (server owns seed, spawn placement and matchmaking;
Durable Objects act as regional world cells).

There are two Cloudflare Workers. They are deliberately separate so that
shipping multiplayer cannot break accounts or payments.

## 1. `dusk` worker (live)

Account and persistence layer. Already deployed. Covers:

- registration and sessions (KV `dusk-sessions`)
- leaderboard and cloud saves (D1 `dusk-db`, R2 `dusk-saves`)
- Stripe Checkout for cosmetics (cosmetics never affect gameplay stats)

This worker is untouched by the multiplayer work below.

## 2. `dusk-mp` worker (new, in `/worker`)

Real-time rooms. One Durable Object instance per room code is the room's
authority: it owns the shared map **seed**, assigns **slots** and the
**host**, holds the live WebSocket sessions and relays messages. This is the
"regional world cell" from ARCHITECTURE.md, at room granularity for now.

### Model

Host-authoritative relay (v1). The first player to join a room is the host and
runs the authoritative simulation. The room relays player **orders** up to the
host and **snapshots / events** back down. Every player shares one map seed, so
the expansive terrain (water, beaches, grassland, steppe, forest, rock, peaks)
is identical on every client without shipping any heightmap data.

This is the pragmatic first step toward the end goal in ARCHITECTURE.md
(full server-authoritative simulation). The migration path is in section 5.

### Endpoints

- `GET  /health` service check
- `POST /room` -> `{ code, seed, max, ws }` create a room code
- `GET  /rooms` -> `{ rooms: [...] }` public lobby (needs the optional LOBBY KV)
- `GET  /ws?room=CODE&name=NAME[&seed=N&max=2..4]` WebSocket upgrade into the room DO

### Message protocol (JSON over WS)

Server to client: `welcome`, `lobby`, `start`, `order` (to host only), `snap`,
`ev`, `chat`, `pong`, `leave`, `host_left`, `error`.
Client to server: `ready`, `start` (host), `order`, `snap` (host), `ev`
(host), `chat`, `ping`.

Full field detail is in `worker/README.md`.

## 3. The map seed

The world is seed-driven. `dusk_index_fixed.html` reads the seed at load from
either `window.__DUSK_SEED` or the URL `?seed=N`, and offsets all terrain and
coastline noise by it. Bases and ore fields are fixed anchors (`FLATS`), so
every seed still spawns a fair, playable layout.

For a match, the flow is:

1. Host creates a room. The `dusk-mp` worker returns a `seed`.
2. On `start`, each client loads the game with `?seed=SEED&mp=CODE&slot=N`.
3. The head seed reader applies `SEED`, so all clients build identical terrain.

Because the seed fully determines the map, the server never needs to send
terrain geometry, only the single integer.

## 4. Deploy

The static client deploys automatically via GitHub Pages on push to `main`.
The `dusk-mp` worker is deployed once with Wrangler:

```
cd worker
npm install
npx wrangler login        # once, opens a browser
npx wrangler deploy       # publishes dusk-mp + the GameRoom Durable Object
```

Deploy prints the worker URL, for example
`https://dusk-mp.<subdomain>.workers.dev`. Put that URL into the client by
setting one global (see the client config in the multiplayer block), then push:

```
window.DUSK_MP_URL = 'https://dusk-mp.<subdomain>.workers.dev';
```

### Optional public lobby listing

```
cd worker
npx wrangler kv namespace create LOBBY   # copy the id it prints
# uncomment [[kv_namespaces]] in wrangler.toml and paste the id
npx wrangler deploy
```

Join-by-code works without this; the KV listing only powers a public `/rooms`
browse list.

### Optional match history

```
npx wrangler d1 execute dusk-db --file=worker/schema.sql
```

## 5. Path to full server authority (v2)

The v1 relay keeps the simulation on the host client. The architecture end goal
is server-authoritative. The migration, when we get there:

- Move the tick (movement, combat, economy) into the GameRoom Durable Object.
- Clients send only input/orders and render from server snapshots.
- The DO owns all state and persistence; the host client loses its special role.
- Regional cells: shard the world across multiple DOs keyed by territory, with
  hand-off at cell borders.

Nothing in the client protocol needs to change fundamentally for v2; the host
role simply moves from a player to the DO.
