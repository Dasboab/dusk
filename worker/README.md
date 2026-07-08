# dusk-mp - Dusk multiplayer worker

Standalone Cloudflare Worker that provides real-time multiplayer rooms for
Dusk via a Durable Object. It does **not** touch the existing `dusk` worker
(auth / leaderboard / cloud saves / Stripe); it can be merged in later.

## Model
Host-authoritative relay. The first player to join a room is the **host** and
runs the authoritative simulation. The room relays player **orders** up to the
host and **snapshots / events** back down to everyone else. All players share a
single map **seed** so terrain is identical on every client.

## Endpoints
- `GET  /health`            -> service check
- `POST /room`              -> `{ code, seed, max, ws }` (create a room code)
- `GET  /rooms`             -> `{ rooms: [...] }` (public lobby; needs LOBBY KV)
- `GET  /ws?room=CODE&name=NAME[&seed=N&max=2..4]` -> WebSocket upgrade

## Message protocol (JSON over WS)
Server -> client: `welcome`, `lobby`, `start`, `order` (to host), `snap`,
`ev`, `chat`, `pong`, `leave`, `host_left`, `error`.
Client -> server: `ready`, `start` (host), `order`, `snap` (host), `ev`
(host), `chat`, `ping`.

## Deploy
```
cd worker
npm install
npx wrangler login            # once
npx wrangler deploy           # publishes dusk-mp + the GameRoom Durable Object
```
The deploy prints the worker URL, e.g. `https://dusk-mp.<subdomain>.workers.dev`.
Put that URL into the game client (see docs/BACKEND.md).

### Optional public lobby listing
```
npx wrangler kv namespace create LOBBY   # copy the id it prints
# uncomment the [[kv_namespaces]] block in wrangler.toml and paste the id
npx wrangler deploy
```

## Local test
```
npx wrangler dev --local --port 8787
# then connect two WebSocket clients to ws://127.0.0.1:8787/ws?room=GAME&name=A
```
