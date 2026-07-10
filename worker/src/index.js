/* ============================================================
   Dusk multiplayer worker  (dusk-mp)
   - Lobby: create room, join by code, optional public listing (KV)
   - Realtime: WebSocket relay via a Durable Object (GameRoom)
   - Model: host-authoritative. First player in a room is the host and
     runs the authoritative sim; the room relays orders up to the host
     and snapshots/events down to the other players.
   This worker is standalone and does NOT touch the existing `dusk`
   worker (auth / leaderboard / cloud saves / Stripe). It can be merged
   into that worker later if desired.
   ============================================================ */

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I,L,O,0,1
function makeCode(n = 4) {
  let s = '';
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  for (let i = 0; i < n; i++) s += CODE_ALPHABET[a[i] % CODE_ALPHABET.length];
  return s;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (path === '/' || path === '/health') {
      return json({ ok: true, service: 'dusk-mp', ts: Date.now() });
    }

    // Create a room: returns a fresh join code. The Durable Object is
    // created lazily on the first WebSocket connect.
    if (path === '/room' && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const code = makeCode(4);
      const seed = (body.seed >>> 0) || (crypto.getRandomValues(new Uint32Array(1))[0] >>> 0);
      const max = Math.max(2, Math.min(4, body.max | 0 || 2));
      return json({ code, seed, max, ws: `/ws?room=${code}` });
    }

    // Public lobby listing (best-effort; requires the optional LOBBY KV binding).
    if (path === '/rooms' && request.method === 'GET') {
      if (!env.LOBBY) return json({ rooms: [] });
      try {
        const list = await env.LOBBY.list({ prefix: 'room:' });
        const rooms = [];
        for (const k of list.keys) {
          const v = await env.LOBBY.get(k.name);
          if (!v) continue;
          const r = JSON.parse(v);
          if (!r.started && (r.players || 0) < (r.max || 2)) rooms.push(r);
        }
        rooms.sort((a, b) => (b.ts || 0) - (a.ts || 0));
        return json({ rooms: rooms.slice(0, 40) });
      } catch (e) {
        return json({ rooms: [] });
      }
    }

    // WebSocket upgrade -> forward to the room's Durable Object.
    if (path === '/ws') {
      const code = (url.searchParams.get('room') || '').toUpperCase();
      if (!/^[A-Z0-9]{3,6}$/.test(code)) return json({ error: 'bad room code' }, 400);
      if (request.headers.get('Upgrade') !== 'websocket')
        return json({ error: 'expected websocket' }, 426);
      const id = env.ROOMS.idFromName(code);
      const stub = env.ROOMS.get(id);
      return stub.fetch(request);
    }

    return json({ error: 'not found' }, 404);
  },
};

/* ============================================================
   GameRoom  Durable Object
   One instance per room code. Holds the live WebSocket sessions,
   the shared map seed, slot/host assignment, and relays messages.
   ============================================================ */
export class GameRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = new Map(); // id -> {ws,name,slot,faction,ready,host}
    this.seed = null;
    this.code = null;
    this.max = 2;
    this.started = false;
    this.hostId = null;
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname.endsWith('/info')) {
      return json({ code: this.code, started: this.started, seed: this.seed, players: this.lobby() });
    }
    if (request.headers.get('Upgrade') !== 'websocket')
      return new Response('expected websocket', { status: 426 });

    if (this.code == null) this.code = (url.searchParams.get('room') || '').toUpperCase();
    const qMax = url.searchParams.get('max') | 0;
    if (qMax >= 2 && qMax <= 4) this.max = qMax;
    if (this.seed == null) {
      const qs = url.searchParams.get('seed');
      this.seed = qs != null ? (qs >>> 0) : (crypto.getRandomValues(new Uint32Array(1))[0] >>> 0);
    }
    const name = (url.searchParams.get('name') || 'Player').slice(0, 16);

    const pair = new WebSocketPair();
    const client = pair[0], server = pair[1];
    server.accept();
    this.onOpen(server, name);
    return new Response(null, { status: 101, webSocket: client });
  }

  freeSlot() {
    const used = new Set([...this.sessions.values()].map(s => s.slot));
    for (let i = 0; i < this.max; i++) if (!used.has(i)) return i;
    return -1;
  }

  onOpen(ws, name) {
    if (this.started || this.sessions.size >= this.max) {
      try { ws.send(JSON.stringify({ type: 'error', reason: this.started ? 'in_progress' : 'full' })); ws.close(1000, 'unavailable'); } catch (e) {}
      return;
    }
    const slot = this.freeSlot();
    const id = crypto.randomUUID();
    const isHost = this.sessions.size === 0;
    const sess = { ws, name, slot, faction: slot, ready: false, host: isHost, id };
    this.sessions.set(id, sess);
    if (isHost) this.hostId = id;

    ws.send(JSON.stringify({
      type: 'welcome', you: slot, host: this.hostSlot(), seed: this.seed,
      code: this.code, max: this.max, players: this.lobby(),
    }));
    this.broadcast({ type: 'lobby', players: this.lobby(), host: this.hostSlot() }, id);
    this.touchLobby();

    ws.addEventListener('message', ev => this.onMessage(id, ev.data));
    ws.addEventListener('close', () => this.onClose(id));
    ws.addEventListener('error', () => this.onClose(id));
  }

  onMessage(id, raw) {
    const s = this.sessions.get(id);
    if (!s) return;
    let m; try { m = JSON.parse(raw); } catch (e) { return; }
    switch (m.type) {
      case 'ready':
        s.ready = !!m.ready;
        if (typeof m.faction === 'number') s.faction = m.faction;
        if (typeof m.name === 'string') s.name = m.name.slice(0, 16);
        this.broadcast({ type: 'lobby', players: this.lobby(), host: this.hostSlot() });
        break;
      case 'start':
        if (!s.host || this.started) break;
        this.started = true;
        this.broadcast({ type: 'start', seed: this.seed, host: this.hostSlot(), players: this.lobby() });
        this.touchLobby();
        break;
      case 'order': // client -> host
        if (s.host) break; // host applies its own orders locally
        { const h = this.sessions.get(this.hostId);
          if (h) try { h.ws.send(JSON.stringify({ type: 'order', from: s.slot, order: m.order })); } catch (e) {} }
        break;
      case 'snap': // host -> everyone else
        if (!s.host) break;
        this.broadcast({ type: 'snap', t: m.t, ents: m.ents, meta: m.meta }, id);
        break;
      case 'ev': // host -> everyone else (spawn/die/fx/credits)
        if (!s.host) break;
        this.broadcast({ type: 'ev', ev: m.ev }, id);
        break;
      case 'chat':
        this.broadcast({ type: 'chat', from: s.slot, name: s.name, text: String(m.text || '').slice(0, 200) });
        break;
      case 'ping':
        try { s.ws.send(JSON.stringify({ type: 'pong', t: m.t })); } catch (e) {}
        break;
    }
  }

  onClose(id) {
    const s = this.sessions.get(id);
    if (!s) return;
    this.sessions.delete(id);
    if (s.host) {
      if (this.started) {
        this.broadcast({ type: 'host_left' });
      } else {
        // promote next player to host in the lobby
        const next = this.sessions.values().next().value;
        if (next) { next.host = true; this.hostId = next.id; }
        this.broadcast({ type: 'lobby', players: this.lobby(), host: this.hostSlot() });
      }
    } else {
      this.broadcast({ type: 'leave', slot: s.slot });
      this.broadcast({ type: 'lobby', players: this.lobby(), host: this.hostSlot() });
    }
    this.touchLobby();
  }

  hostSlot() {
    const h = this.sessions.get(this.hostId);
    return h ? h.slot : -1;
  }
  lobby() {
    return [...this.sessions.values()].map(s => ({ slot: s.slot, name: s.name, faction: s.faction, ready: s.ready, host: s.host }));
  }
  broadcast(obj, exceptId) {
    const str = JSON.stringify(obj);
    for (const [id, s] of this.sessions) {
      if (id === exceptId) continue;
      try { s.ws.send(str); } catch (e) {}
    }
  }
  async touchLobby() {
    if (!this.env.LOBBY || !this.code) return;
    try {
      if (this.sessions.size === 0) {
        await this.env.LOBBY.delete('room:' + this.code);
      } else {
        await this.env.LOBBY.put('room:' + this.code, JSON.stringify({
          code: this.code, players: this.sessions.size, max: this.max,
          started: this.started, ts: Date.now(),
        }), { expirationTtl: 3600 });
      }
    } catch (e) {}
  }
}
