/* ============================================================
   Broken Meridian multiplayer worker (dusk-mp) v2
   Deterministic lockstep relay.
   - Rooms are Durable Objects placed near their creator (locationHint).
   - The room does no game logic: it stamps player commands into
     numbered net ticks and broadcasts them at 15Hz. Every client
     runs the identical sim from a shared seed.
   - Lobby: public room list held in a singleton registry DO.
   - Desync detection via periodic state hashes.
   ============================================================ */

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function makeCode(n = 4) {
  let s = ''; const a = new Uint8Array(n);
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
const json = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json', ...CORS } });

const HINTS = { NA: 'enam', SA: 'sam', EU: 'weur', AS: 'apac', OC: 'oc', AF: 'afr' };
const REGION_LABEL = { enam: 'NA', sam: 'SA', weur: 'EU', apac: 'ASIA', oc: 'OCE', afr: 'AFR' };

function regionOf(request) {
  const c = request.cf && request.cf.continent;
  return HINTS[c] || 'weur';
}
const LOBBY = 'lobby-v1';
function lobbyStub(env) { return env.ROOMS.get(env.ROOMS.idFromName(LOBBY)); }
function roomStub(env, code, hint) {
  return env.ROOMS.get(env.ROOMS.idFromName('room-' + code), hint ? { locationHint: hint } : undefined);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (path === '/' || path === '/health')
      return json({ ok: true, service: 'bm-mp', v: 2, region: regionOf(request), ts: Date.now() });

    if (path === '/room' && request.method === 'POST') {
      let body = {}; try { body = await request.json(); } catch (e) {}
      const code = makeCode(4);
      const hint = regionOf(request);
      const seed = (body.seed >>> 0) || (crypto.getRandomValues(new Uint32Array(1))[0] >>> 0);
      const max = Math.max(2, Math.min(4, (body.max | 0) || 2));
      const name = String(body.name || 'Skirmish').slice(0, 24);
      const pub = !!body.public;
      const stub = roomStub(env, code, hint);
      await stub.fetch('https://do/init', {
        method: 'POST',
        body: JSON.stringify({ code, seed, max, name, pub, region: REGION_LABEL[hint] || hint }),
      });
      return json({ code, seed, max, region: REGION_LABEL[hint] || hint, ws: '/ws?room=' + code });
    }

    if (path === '/rooms' && request.method === 'GET') {
      const r = await lobbyStub(env).fetch('https://do/list');
      return new Response(await r.text(), { headers: { 'Content-Type': 'application/json', ...CORS } });
    }

    if (path === '/ws') {
      const code = (url.searchParams.get('room') || '').toUpperCase();
      if (!/^[A-Z2-9]{4}$/.test(code)) return json({ error: 'bad room code' }, 400);
      return roomStub(env, code).fetch(request);
    }
    return json({ error: 'not found' }, 404);
  },
};

const NET_HZ = 15;            // net ticks per second; each = 2 sim steps of 1/30
const NET_MS = 1000 / NET_HZ;

export class GameRoom {
  constructor(state, env) {
    this.state = state; this.env = env;
    this.mode = null;                    // 'room' | 'lobby'
    // lobby registry
    this.listings = new Map();           // code -> {name,region,players,max,ts}
    // room
    this.cfg = null;                     // {code,seed,max,name,pub,region}
    this.players = [];                   // [{ws,name,slot,ready,alive}]
    this.running = false;
    this.tick = 0;
    this.pending = {};                   // slot -> cmds queued for next tick
    this.hashes = {};                    // tick -> {slot:hash}
    this.timer = null;
  }

  async fetch(request) {
    const url = new URL(request.url);

    /* ---- lobby registry mode ---- */
    if (url.pathname === '/list') {
      this.mode = 'lobby';
      const now = Date.now(), out = [];
      for (const [code, r] of this.listings) {
        if (now - r.ts > 90000) { this.listings.delete(code); continue; }
        out.push({ code, ...r });
      }
      return json({ rooms: out });
    }
    if (url.pathname === '/publish') {
      this.mode = 'lobby';
      const b = await request.json();
      if (b.remove) this.listings.delete(b.code);
      else this.listings.set(b.code, { name: b.name, region: b.region, players: b.players, max: b.max, ts: Date.now() });
      return json({ ok: true });
    }

    /* ---- room mode ---- */
    if (url.pathname === '/init') {
      this.mode = 'room';
      this.cfg = await request.json();
      await this.state.storage.put('cfg', this.cfg);
      return json({ ok: true });
    }
    if (!this.cfg) this.cfg = (await this.state.storage.get('cfg')) || null;
    if (url.searchParams.get('probe')) return json({ cfg: !!this.cfg, running: this.running, players: this.roster().length });
    if (request.headers.get('Upgrade') === 'websocket') {
      if (!this.cfg) return json({ error: 'no such room' }, 404);
      if (this.running) return json({ error: 'game already started' }, 409);
      if (this.players.filter(p => p.alive).length >= this.cfg.max) return json({ error: 'room full' }, 409);
      const pair = new WebSocketPair();
      this.accept(pair[1]);
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    return json({ error: 'bad request' }, 400);
  }

  accept(ws) {
    ws.accept();
    const slot = this.players.length;
    const p = { ws, name: 'Cmdr', slot, ready: false, alive: true };
    this.players.push(p);
    ws.addEventListener('message', ev => { try { this.onMsg(p, JSON.parse(ev.data)); } catch (e) {} });
    const bye = () => this.onLeave(p);
    ws.addEventListener('close', bye); ws.addEventListener('error', bye);
    ws.send(JSON.stringify({
      t: 'joined', slot, seed: this.cfg.seed, max: this.cfg.max,
      region: this.cfg.region, code: this.cfg.code, players: this.roster(),
    }));
    this.roomcast({ t: 'players', players: this.roster() }, p);
    this.publish();
  }

  roster() { return this.players.filter(p => p.alive).map(p => ({ slot: p.slot, name: p.name, ready: p.ready })); }
  roomcast(obj, skip) {
    const s = JSON.stringify(obj);
    for (const p of this.players) if (p.alive && p !== skip) { try { p.ws.send(s); } catch (e) {} }
  }
  async publish(remove) {
    if (!this.cfg || !this.cfg.pub) return;
    try {
      await lobbyStub(this.env).fetch('https://do/publish', {
        method: 'POST',
        body: JSON.stringify(remove ? { code: this.cfg.code, remove: true } : {
          code: this.cfg.code, name: this.cfg.name, region: this.cfg.region,
          players: this.roster().length, max: this.cfg.max,
        }),
      });
    } catch (e) {}
  }

  onMsg(p, m) {
    switch (m.t) {
      case 'hello':
        p.name = String(m.name || 'Cmdr').slice(0, 16);
        this.roomcast({ t: 'players', players: this.roster() });
        this.publish(); break;
      case 'ready':
        p.ready = !!m.v;
        this.roomcast({ t: 'players', players: this.roster() });
        this.maybeStart(); break;
      case 'cmd':
        if (this.running && Array.isArray(m.c))
          (this.pending[p.slot] = this.pending[p.slot] || []).push(...m.c.slice(0, 32));
        break;
      case 'hash': {
        const h = (this.hashes[m.tick] = this.hashes[m.tick] || {});
        h[p.slot] = m.h;
        const vals = Object.values(h);
        if (vals.length === this.players.filter(q => q.alive).length && new Set(vals).size > 1)
          this.roomcast({ t: 'desync', tick: m.tick });
        for (const k of Object.keys(this.hashes)) if (+k < m.tick - 40) delete this.hashes[k];
        break;
      }
      case 'ping': try { p.ws.send(JSON.stringify({ t: 'pong', ts: m.ts })); } catch (e) {} break;
      case 'chat': this.roomcast({ t: 'chat', slot: p.slot, m: String(m.m || '').slice(0, 140) }); break;
    }
  }

  maybeStart() {
    const live = this.players.filter(p => p.alive);
    if (this.running || live.length < 2 || !live.every(p => p.ready)) return;
    this.running = true; this.tick = 0; this.pending = {};
    this.publish(true);
    this.roomcast({ t: 'begin', seed: this.cfg.seed, players: this.roster() });
    this.timer = setInterval(() => this.step(), NET_MS);
  }

  step() {
    const cmds = this.pending; this.pending = {};
    this.roomcast({ t: 'tick', n: this.tick, cmds });
    this.tick++;
  }

  onLeave(p) {
    if (!p.alive) return;
    p.alive = false;
    this.roomcast({ t: 'left', slot: p.slot });
    const live = this.players.filter(q => q.alive).length;
    if (live === 0) {
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
      this.running = false; this.players = []; this.publish(true);
    } else if (!this.running) this.publish();
  }
}
