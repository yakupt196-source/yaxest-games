/* Yaxest Diyarı — çok oyunculu dünya (Cloudflare Workers + Durable Object, ücretsiz plan).
   WebSocket Hibernation API kullanır: boştayken süre ücreti yok, gelen mesajlar 20:1 sayılır.
   Giriş: Firebase ID token imzası (Google JWKS) sunucuda doğrulanır; takma ad hesaba bağlıdır. */
const PROJECT = 'yaxest-games';
const JWKS = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const MAXP = 60, WORLD_PX = 200 * 48, MAX_SPEED = 900;
const BAD = ['amk','aq','orospu','piç','sik','yarrak','ibne','göt','oç','mal','salak','gerizekal','fuck','shit','bitch','nigg'];
let keys = null, keysAt = 0;
const b64 = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), c => c.charCodeAt(0));
const jd = s => JSON.parse(new TextDecoder().decode(b64(s)));
async function verify(tok) {
  try {
    if (typeof tok !== 'string' || tok.length > 4000) return null;
    const [h, p, sg] = tok.split('.'); if (!sg) return null;
    const hd = jd(h), pl = jd(p), now = Date.now() / 1000;
    if (hd.alg !== 'RS256' || pl.aud !== PROJECT || pl.iss !== 'https://securetoken.google.com/' + PROJECT || !pl.sub || pl.exp < now || pl.iat > now + 300) return null;
    if (!keys || Date.now() - keysAt > 3600e3) { keys = (await (await fetch(JWKS)).json()).keys; keysAt = Date.now(); }
    const jwk = keys.find(k => k.kid === hd.kid); if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64(sg), new TextEncoder().encode(h + '.' + p));
    return ok ? pl.sub : null;
  } catch (e) { return null; }
}
const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n);
const bad = t => { const l = t.toLocaleLowerCase('tr'); return BAD.some(w => l.includes(w)); };
const num = (v, lo, hi) => { v = +v; return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : lo; };
const pub = a => ({ id: a.id, n: a.nick, ap: a.ap, lv: a.lv, x: a.x, y: a.y });

export class World {
  constructor(state, env) { this.state = state; this.env = env; }
  async fetch(req) {
    if (req.headers.get('Upgrade') !== 'websocket') return new Response('Yaxest world', { status: 426 });
    if (this.state.getWebSockets().length >= MAXP) return new Response('full', { status: 503 });
    const [c, s] = Object.values(new WebSocketPair());
    this.state.acceptWebSocket(s); s.serializeAttachment({});
    return new Response(null, { status: 101, webSocket: c });
  }
  bc(o, except) { const t = JSON.stringify(o); for (const w of this.state.getWebSockets()) { if (w === except) continue; const a = w.deserializeAttachment(); if (a && a.id) try { w.send(t); } catch (e) {} } }
  async webSocketMessage(ws, msg) {
    if (typeof msg !== 'string' || msg.length > 700) return;
    let m; try { m = JSON.parse(msg); } catch (e) { return; }
    let a = ws.deserializeAttachment() || {}, now = Date.now();
    if (m.t === 'hi') {
      if (a.id) return;
      const uid = await verify(m.tok);
      if (!uid) { ws.send(JSON.stringify({ t: 'err', m: 'auth' })); ws.close(1008, 'auth'); return; }
      for (const o of this.state.getWebSockets()) { const oa = o.deserializeAttachment(); if (o !== ws && oa && oa.uid === uid) try { o.close(1000, 'dup'); } catch (e) {} }
      let ap = ''; try { ap = JSON.stringify(m.ap); } catch (e) {} if (ap.length > 500) ap = '';
      a = { id: crypto.randomUUID().slice(0, 8), uid, nick: clean(m.nick, 16) || 'Oyuncu', ap: ap ? JSON.parse(ap) : null, lv: num(m.lv, 1, 99), x: num(m.x, 0, WORLD_PX), y: num(m.y, 0, WORLD_PX), pt: now, ct: 0 };
      ws.serializeAttachment(a);
      const roster = this.state.getWebSockets().map(w => w.deserializeAttachment()).filter(x => x && x.id && x.id !== a.id).map(pub);
      ws.send(JSON.stringify({ t: 'hi', id: a.id, roster }));
      this.bc({ t: 'join', p: pub(a) }, ws);
      return;
    }
    if (!a.id) return;
    if (m.t === 'p') {
      const dt = now - a.pt; if (dt < 100) return;
      const x = num(m.x, 0, WORLD_PX), y = num(m.y, 0, WORLD_PX), d = Math.hypot(x - a.x, y - a.y);
      if (d / (dt / 1000) > MAX_SPEED && d > 120) { ws.send(JSON.stringify({ t: 'snap', x: a.x, y: a.y })); return; }
      a.x = x; a.y = y; a.pt = now; if (m.ap) { try { const s = JSON.stringify(m.ap); if (s.length <= 500) a.ap = JSON.parse(s); } catch (e) {} } a.lv = num(m.lv, 1, 99) || a.lv;
      ws.serializeAttachment(a);
      this.bc({ t: 'p', id: a.id, x: Math.round(x), y: Math.round(y), f: m.f ? 1 : 0, lv: a.lv }, ws);
    } else if (m.t === 'c') {
      if (now - a.ct < 1500) { ws.send(JSON.stringify({ t: 'sys', m: 'Çok hızlı yazıyorsun.' })); return; }
      let txt = clean(m.m, 120); if (!txt) return; if (bad(txt)) { ws.send(JSON.stringify({ t: 'sys', m: 'Mesajın uygunsuz bulundu.' })); return; }
      a.ct = now; ws.serializeAttachment(a);
      const near = m.ch === 'l';
      for (const w of this.state.getWebSockets()) { const b = w.deserializeAttachment(); if (!b || !b.id) continue; if (near && Math.hypot(b.x - a.x, b.y - a.y) > 960) continue; try { w.send(JSON.stringify({ t: 'c', id: a.id, n: a.nick, m: txt, ch: near ? 'l' : 'w' })); } catch (e) {} }
    }
  }
  webSocketClose(ws) { const a = ws.deserializeAttachment(); if (a && a.id) this.bc({ t: 'leave', id: a.id }, ws); }
  webSocketError(ws) { this.webSocketClose(ws); }
}
export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (u.pathname === '/ws') return env.WORLD.get(env.WORLD.idFromName('dunya-1')).fetch(req);
    return new Response('Yaxest Diyarı sunucusu çalışıyor.', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
};
