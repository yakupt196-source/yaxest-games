/* Yaxest Diyarı — çok oyunculu dünya (Cloudflare Workers + Durable Object, ücretsiz plan).
   WebSocket Hibernation API: boştayken süre ücreti yok, gelen mesajlar 20:1 sayılır.
   Giriş: Firebase ID token imzası (Google JWKS) sunucuda doğrulanır. Oyuncunun herkese açık kimliği uid değil, uid'den türeyen kısa "pk"dır.
   Sosyal katman: arkadaş, DM, parti, takas, düello, klan, emote, dünya çanı. Kalıcı veri DO depolamasında (SQLite). */
const PROJECT = 'yaxest-games';
const JWKS = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const MAXP = 150, WORLDS = 5, NEAR = 1800, WORLD_PX = 200 * 48, MAX_SPEED = 900;
const BAD = ['amk','aq','orospu','piç','sik','yarrak','ibne','göt','oç','mal','salak','gerizekal','fuck','shit','bitch','nigg'];
const TTL = { pt: 60e3, tr: 60e3, du: 60e3 }, WEEK = 7 * 864e5;
/* Ortak veri (profil, klan, takma ad, DM, sıralama) merkezsizdir: her anahtar, adının özetine göre 5 dünyadan birinde tutulur
   (shard). Herhangi bir dünya, sahibi olan dünyaya /kv ile sorar; tek hata noktası ve tek yük merkezi yoktur.
   Eski veri Dünya 1'de duruyorsa okuma bulamayınca oraya da bakar (taşıma gerekmez). Canlı olanlar dünyaya özel kalır. */
const SHARED = k => /^(u:|c:|nk:|d:|ban:|mt:|adm:|sn:)/.test(k) || k === 'cidx' || k === 'lb' || k === 'rp' || k === 'bell' || k === 'bidx' || k === 'alog' || k === 'mkx' || k === 'evx';
const shardOf = k => { let h = 2166136261; for (let i = 0; i < k.length; i++) { h ^= k.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return (h % WORLDS) + 1; };
const KINDS = ['fr', 'pt', 'tr', 'du', 'cl', 'gf'];
const WAGERS = [0, 100, 500, 1000, 5000];
let keys = null, keysAt = 0;
const b64 = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), c => c.charCodeAt(0));
const jd = s => JSON.parse(new TextDecoder().decode(b64(s)));
async function verifyPl(tok) {
  try {
    if (typeof tok !== 'string' || tok.length > 4000) return null;
    const [h, p, sg] = tok.split('.'); if (!sg) return null;
    const hd = jd(h), pl = jd(p), now = Date.now() / 1000;
    if (hd.alg !== 'RS256' || pl.aud !== PROJECT || pl.iss !== 'https://securetoken.google.com/' + PROJECT || !pl.sub || pl.exp < now || pl.iat > now + 300) return null;
    if (!keys || Date.now() - keysAt > 3600e3) { keys = (await (await fetch(JWKS)).json()).keys; keysAt = Date.now(); }
    const jwk = keys.find(k => k.kid === hd.kid); if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64(sg), new TextEncoder().encode(h + '.' + p));
    return ok ? pl : null;
  } catch (e) { return null; }
}
async function verify(tok) { const pl = await verifyPl(tok); return pl ? pl.sub : null; }
const ADMINS = ['yakupt196@gmail.com'];
const isAdminPl = pl => !!pl && ADMINS.includes(String(pl.email || '').toLowerCase()) && (pl.email_verified === true || (pl.firebase && pl.firebase.sign_in_provider === 'password'));
async function pkOf(uid) { const h = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('yx|' + uid))); let s = 'p'; for (let i = 0; i < 7; i++) s += h[i].toString(16).padStart(2, '0'); return s; }
const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n);
const bad = t => { const l = t.toLocaleLowerCase('tr'); return BAD.some(w => l.includes(w)); };
const num = (v, lo, hi) => { v = +v; return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : lo; };
const int = (v, lo, hi) => Math.floor(num(v, lo, hi));
const rid = n => crypto.randomUUID().replace(/-/g, '').slice(0, n);
const lvl = xp => Math.min(20, 1 + Math.floor(Math.sqrt(xp / 400)));
const need = l => l >= 20 ? 0 : (l * l) * 400;
const pub = a => ({ id: a.id, k: a.pk, n: a.nick, ap: a.ap, lv: a.lv, x: a.x, y: a.y, cg: a.cg || '', w: a.w || 0, l: a.l || 0 });
const cleanOffer = (g, it) => {
  const o = { g: int(g, 0, 200000), it: {} }; let n = 0;
  if (it && typeof it === 'object') for (const k of Object.keys(it)) { if (n >= 6) break; if (!/^[mrwze]:[\w:]{1,24}$/.test(k)) continue; const q = int(it[k], 0, 99999); if (q > 0) { o.it[k] = (k[0] === 'w' || k[0] === 'z') ? 1 : q; n++; } }
  return o;
};

export class World {
  constructor(state, env) { this.state = state; this.env = env; this.wn = 0; state.blockConcurrencyWhile(async () => { this.wn = (await state.storage.get('_wn')) || 0; }); }
  me() { return this.wn || 1; }
  async kv(w, body) {
    const r = await this.env.WORLD.get(this.env.WORLD.idFromName('dunya-' + w)).fetch('https://w/kv', { method: 'POST', body: JSON.stringify(body) });
    if (!r.ok) throw new Error('shard');
    return r;
  }
  async rd(w, k) { if (w === this.me()) { const v = await this.state.storage.get(k); return v === undefined ? null : v; } return (await (await this.kv(w, { op: 'g', k })).json()).v; }
  async fetch(req) {
    const pn = new URL(req.url).pathname;
    if (pn === '/kv') { const b = await req.json(); if (!SHARED(String(b.k))) return new Response('no', { status: 400 }); if (b.op === 'g') { const v = await this.state.storage.get(b.k); return new Response(JSON.stringify({ v: v === undefined ? null : v })); } if (b.op === 's') { await this.state.storage.put(b.k, b.v); return new Response('{}'); } if (b.op === 'd') { await this.state.storage.delete(b.k); return new Response('{}'); } if (b.op === 'mk' && b.k === 'mkx') return new Response(JSON.stringify(await this.mkApply(b))); if (b.op === 'ev' && b.k === 'evx') return new Response(JSON.stringify(await this.evApply(b))); return new Response('bad', { status: 400 }); }
    const wh = +req.headers.get('x-world') || 0; if (wh && wh !== this.wn) { this.wn = wh; await this.state.storage.put('_wn', wh); }
    if (pn === '/who') return new Response(JSON.stringify(this.all().map(w => this.A(w)).filter(a => a.id).map(a => ({ w: this.me(), id: a.id, pk: a.pk, n: a.nick, lv: a.lv, x: Math.round(a.x), y: Math.round(a.y), cg: a.cg || '', ip: a.ip || '', mu: a.mu || 0 }))));
    if (pn === '/live') { const b = await req.json(); let n = 0; for (const w of this.all()) { const a = this.A(w); if (!a.id || (!b.all && a.pk !== b.pk)) continue; n++; if (b.mu !== undefined) this.setA(w, x => { x.mu = b.mu; }); if (b.send) this.snd(w, b.send); if (b.kick) { try { w.close(1008, 'adm'); } catch (e) {} } } return new Response(String(n)); }
    if (pn === '/admop') return this.admop(await req.json());
    if (pn === '/count') return new Response(String(this.all().filter(w => this.A(w).id).length));
    if (req.headers.get('Upgrade') !== 'websocket') return new Response('Yaxest world', { status: 426 });
    /* Bağlantı seli koruması: kimliği doğrulanmamış soketler 10 sn içinde 'hi' göndermezse kapatılır;
       doğrulanmamış toplam sayısı ve aynı IP'den gelen sayı sınırlıdır. Kapasiteyi yalnızca giriş yapmış oyuncular doldurur. */
    const ip = (req.headers.get('cf-connecting-ip') || '').slice(0, 45), t0 = Date.now();
    let authed = 0, un = 0, ipAll = 0, ipUn = 0;
    for (const w of this.all()) {
      const a = this.A(w);
      if (a.id) { authed++; if (ip && a.ip === ip) ipAll++; continue; }
      if (t0 - (a.cn || 0) > 10e3) { try { w.close(1008, 'timeout'); } catch (e) {} continue; }
      un++; if (ip && a.ip === ip) { ipUn++; ipAll++; }
    }
    if (authed >= MAXP) return new Response('full', { status: 503 });
    if (un >= 40 || ipUn >= 4 || ipAll >= 30) return new Response('busy', { status: 429 });
    const [c, s] = Object.values(new WebSocketPair());
    this.state.acceptWebSocket(s); s.serializeAttachment({ cn: t0, ip });
    return new Response(null, { status: 101, webSocket: c });
  }
  /* ---- yardımcılar ---- */
  A(w) { try { return w.deserializeAttachment() || {}; } catch (e) { return {}; } }
  all() { return this.state.getWebSockets(); }
  byId(id) { if (!id) return null; for (const w of this.all()) if (this.A(w).id === id) return w; return null; }
  byPk(pk) { if (!pk) return null; for (const w of this.all()) { const a = this.A(w); if (a.id && a.pk === pk) return w; } return null; }
  snd(w, o) { try { w.send(JSON.stringify(o)); } catch (e) {} }
  err(w, m) { this.snd(w, { t: 'sys', m }); }
  /* yalnızca yakındakilere (NEAR piksel) gönder: konum yayını yükünü kırar */
  bcNear(o, a, except) { const t = JSON.stringify(o); for (const w of this.all()) { if (w === except) continue; const b = this.A(w); if (b.id && Math.abs(b.x - a.x) < NEAR && Math.abs(b.y - a.y) < NEAR) try { w.send(t); } catch (e) {} } }
  bc(o, except) { const t = JSON.stringify(o); for (const w of this.all()) { if (w === except) continue; if (this.A(w).id) try { w.send(t); } catch (e) {} } }
  async g(k, d) {
    if (!SHARED(k)) { const v = await this.state.storage.get(k); return v === undefined ? d : v; }
    const w = shardOf(k); let v = await this.rd(w, k);
    if ((v === null || v === undefined) && w !== 1) v = await this.rd(1, k);
    return v === null || v === undefined ? d : v;
  }
  async s(k, v) { if (!SHARED(k)) { await this.state.storage.put(k, v); return; } const w = shardOf(k); if (w === this.me()) await this.state.storage.put(k, v); else await this.kv(w, { op: 's', k, v }); }
  async del(k) {
    if (!SHARED(k)) { await this.state.storage.delete(k); return; }
    for (const w of new Set([shardOf(k), 1])) { if (w === this.me()) await this.state.storage.delete(k); else await this.kv(w, { op: 'd', k }); }
  }
  async prof(pk) { const p = await this.g('u:' + pk, null); return p || { n: '', fr: {}, in: [], un: {}, cl: null, w: 0, l: 0, bl: [], gs: 0, gd: 0 }; }
  saveP(pk, p) { return this.s('u:' + pk, p); }
  fresh(r, now) { return now - r.t < (TTL[r.k] || WEEK); }
  setA(w, f) { const a = this.A(w); f(a); try { w.serializeAttachment(a); } catch (e) {} return a; }

  /* ---- giriş ---- */
  async hi(ws, m, now) {
    const prev = this.A(ws); if (prev.id) return;
    if ((prev.hn || 0) >= 3) { try { ws.close(1008, 'many'); } catch (e) {} return; }
    try { ws.serializeAttachment({ ...prev, hn: (prev.hn || 0) + 1 }); } catch (e) {}
    const vpl = await verifyPl(m.tok), uid = vpl ? vpl.sub : null, isAdm = isAdminPl(vpl);
    if (!uid) { this.snd(ws, { t: 'err', m: 'auth' }); ws.close(1008, 'auth'); return; }
    const pk = await pkOf(uid);
    const bn = await this.g('ban:' + pk, null);
    if (bn && (!bn.until || bn.until > now)) { this.snd(ws, { t: 'ban', m: bn.reason || '', until: bn.until || 0 }); try { ws.close(1008, 'ban'); } catch (e) {} return; }
    const mtv = await this.g('mt:' + pk, 0);
    for (const o of this.all()) { if (o !== ws && this.A(o).pk === pk) { this.snd(o, { t: 'dup' }); this.bc({ t: 'leave', id: this.A(o).id }, o); try { o.serializeAttachment({}); o.close(1000, 'dup'); } catch (e) {} } }
    const nick = clean(m.nick, 16) || 'Oyuncu';
    let ap = ''; try { ap = JSON.stringify(m.ap) || ''; } catch (e) {} if (ap.length > 500) ap = '';
    const p = await this.prof(pk); p.n = nick; let cg = '';
    if (p.cl) { const C = await this.g('c:' + p.cl, null); if (C && C.mem[pk]) { cg = p.cl; C.mem[pk].n = nick; await this.s('c:' + p.cl, C); } else p.cl = null; }
    await this.saveP(pk, p); await this.s('nk:' + nick.toLocaleLowerCase('tr'), pk);
    const a = { ip: prev.ip || '', id: rid(8), pk, nick, ap: ap ? JSON.parse(ap) : null, lv: int(m.lv, 1, 150), adm: isAdm ? 1 : 0, x: num(m.x, 0, WORLD_PX), y: num(m.y, 0, WORLD_PX), pt: now, ct: 0, cg, w: p.w, l: p.l, mu: mtv > now ? mtv : 0 };
    ws.serializeAttachment(a);
    const roster = this.all().map(w => this.A(w)).filter(x => x.id && x.id !== a.id).map(pub);
    this.snd(ws, { t: 'hi', id: a.id, k: pk, roster });
    this.bc({ t: 'join', p: pub(a) }, ws);
    await this.fl(ws); await this.notifyFriends(pk);
    if (cg) await this.clanPush(cg);
    const aq = await this.g('adm:' + pk, []); for (const q of aq.slice(0, 20)) this.snd(ws, { t: 'adm', q });
  }
  async webSocketMessage(ws, msg) {
    if (typeof msg !== 'string' || msg.length > 5000) return;
    let m; try { m = JSON.parse(msg); } catch (e) { return; }
    if (!m || typeof m !== 'object') return;
    if (m.t !== 'hi' && msg.length > (m.t === 'sn' ? 4500 : m.t === 'dgr' ? 6000 : 900)) return;
    const now = Date.now();
    if (m.t === 'hi') { try { await this.hi(ws, m, now); } catch (e) { this.snd(ws, { t: 'err', m: 'hub' }); } return; }
    const a = this.A(ws); if (!a.id) return;
    if (m.t === 'dgr') { try { await this.dgr(ws, a, m, now); } catch (e) {} return; }
    if (m.t !== 'p' && now - (a.la || 0) < 90) return;
    if (m.t !== 'p') { a.la = now; ws.serializeAttachment(a); }
    try { await this.route(ws, this.A(ws), m, now); } catch (e) {}
  }
  async route(ws, a, m, now) {
    switch (m.t) {
      case 'p': return this.pos(ws, a, m, now);
      case 'c': return this.chat(ws, a, m, now);
      case 'sn': return this.snap(ws, a, m, now);
      case 'aa': return this.admAck(a, m);
      case 'em': { if (now - (a.et || 0) < 800) return; const e = int(m.e, 0, 11); this.setA(ws, x => { x.et = now; }); const o = { t: 'em', id: a.id, e }; this.snd(ws, o); this.bc(o, ws); return; }
      case 'iv': return this.iv(ws, a, m, now);
      case 'ra': return this.ra(ws, a, m, now);
      case 'fd': { const k = String(m.k || ''); const p = await this.prof(a.pk); if (!p.fr[k]) return; delete p.fr[k]; await this.saveP(a.pk, p); const o = await this.prof(k); delete o.fr[a.pk]; await this.saveP(k, o); await this.fl(ws); const ow = this.byPk(k); if (ow) await this.fl(ow); return; }
      case 'dm': return this.dm(ws, a, m, now);
      case 'dmh': { const k = String(m.k || ''), p = await this.prof(a.pk); if (!p.fr[k]) return; const list = await this.g('d:' + [a.pk, k].sort().join('|'), []); if (p.un[k]) { delete p.un[k]; await this.saveP(a.pk, p); } this.snd(ws, { t: 'dmh', k, list }); return; }
      case 'bk': { const k = String(m.k || ''); if (!/^p[0-9a-f]{14}$/.test(k)) return; const p = await this.prof(a.pk); p.bl = p.bl.filter(x => x !== k); if (m.on) p.bl.push(k); p.bl = p.bl.slice(-50); await this.saveP(a.pk, p); await this.fl(ws); return; }
      case 'rp': { const L = await this.g('rp', []); L.push({ f: a.pk, fn: a.nick, k: String(m.k || '').slice(0, 20), why: clean(m.why, 80), t: now }); await this.s('rp', L.slice(-200)); this.err(ws, 'Bildirimin alındı, teşekkürler.'); return; }
      case 'pl': return this.partyLeave(ws);
      case 'pk': { const P = a.pi && await this.g('pt:' + a.pi, null); if (!P || P.lead !== a.id) return; const w = this.byId(String(m.id || '')); if (w && w !== ws && this.A(w).pi === a.pi) await this.partyLeave(w); return; }
      case 'pp': { const P = a.pi && await this.g('pt:' + a.pi, null); if (!P || now - (a.ppt || 0) < 1500) return; this.setA(ws, x => { x.ppt = now; }); const o = { t: 'pp', id: a.id, n: a.nick, x: int(m.x, 0, WORLD_PX), y: int(m.y, 0, WORLD_PX) }; for (const id of P.mem) { const w = this.byId(id); if (w) this.snd(w, o); } return; }
      case 'dh': return this.dh(ws, a, now, m);
      case 'dq': { if (!a.du) return; const ow = this.byId(a.du.o); return this.endDuel(ow, ws); }
      case 'to': case 'tl': case 'tc': case 'tx': return this.tradeAct(ws, a, m);
      case 'mkq': case 'mkl': case 'mkb': case 'mkc': case 'mkp': case 'mkk': case 'mka': case 'mkv': return this.mkt(ws, a, m, now);
      case 'evq': case 'evc': case 'evr': case 'evy': case 'evi': case 'evu': case 'evj': case 'evl': case 'evs': return this.evt(ws, a, m, now);
      case 'cc': return this.clanCreate(ws, a, m, now);
      case 'cj': return this.clanJoin(ws, a, m, now);
      case 'cm': return this.clanManage(ws, a, m);
      case 'cx': return this.clanLeave(ws, a.pk);
      case 'cd': return this.clanDonate(ws, a, m);
      case 'cdp': case 'cdw': return this.clanDepot(ws, a, m);
      case 'cdt': return this.clanDepotToggle(ws, a, m);
      case 'ce': return this.clanEdit(ws, a, m);
      case 'cs': return this.clanSearch(ws, m);
      case 'lbq': return this.lb(ws);
      case 'bell': { const last = await this.g('bell', 0); if (now - last < 20e3) return this.err(ws, 'Dünya çanı soğuyor, biraz bekle.'); const txt = clean(m.m, 80); if (!txt || bad(txt)) return; await this.s('bell', now); const o = { t: 'bell', n: a.nick, m: txt }; this.snd(ws, { t: 'bellok' }); this.snd(ws, o); this.bc(o, ws); return; }
    }
  }
  /* ---- konum ---- */
  async pos(ws, a, m, now) {
    const dt = now - a.pt; if (dt < 100) return;
    const x = num(m.x, 0, WORLD_PX), y = num(m.y, 0, WORLD_PX), d = Math.hypot(x - a.x, y - a.y);
    /* ışınlanma/portal/ölüm dönüşü: istemci j:1 ile bildirir; en çok 6 sn'de bir kabul edilir. Aksi halde hız sınırı geçerli. */
    const jump = m.j && now - (a.jt || 0) > 6000;
    if (jump) a.jt = now;
    else if (d / (dt / 1000) > MAX_SPEED && d > 120) { this.snd(ws, { t: 'snap', x: a.x, y: a.y }); return; }
    a.x = x; a.y = y; a.pt = now; a.lv = num(m.lv, 1, 99) || a.lv;
    if (m.ap) { try { const s = JSON.stringify(m.ap); if (s.length <= 500) a.ap = JSON.parse(s); } catch (e) {} }
    ws.serializeAttachment(a);
    this.bcNear({ t: 'p', id: a.id, x: Math.round(x), y: Math.round(y), f: m.f ? 1 : 0, lv: a.lv }, a, ws);
    if (a.du && now - a.du.t0 > 180e3) { const ow = this.byId(a.du.o); await this.endDuel(null, null, ws, ow); }
  }
  /* ---- sohbet ---- */
  async chat(ws, a, m, now) {
    if (now - a.ct < 1500) return this.err(ws, 'Çok hızlı yazıyorsun.');
    if (a.mu && a.mu > now) return this.err(ws, 'Susturuldun. Süre bitince yazabilirsin (' + Math.ceil((a.mu - now) / 60000) + ' dk).');
    const txt = clean(m.m, 120); if (!txt) return;
    if (bad(txt)) return this.err(ws, 'Mesajın uygunsuz bulundu.');
    const ch = ['l', 'w', 'k', 'p'].includes(m.ch) ? m.ch : 'w';
    this.setA(ws, x => { x.ct = now; });
    const o = { t: 'c', id: a.id, k: a.pk, n: a.nick, m: txt, ch, cg: a.cg || '' };
    if (ch === 'k') {
      if (!a.cg) return this.err(ws, 'Bir klanda değilsin.');
      const C = await this.g('c:' + a.cg, null); if (C) { C.msgs.push({ n: a.nick, m: txt, t: now }); C.msgs = C.msgs.slice(-40); await this.s('c:' + a.cg, C); }
      for (const w of this.all()) if (this.A(w).cg === a.cg) this.snd(w, o);
    } else if (ch === 'p') {
      const P = a.pi && await this.g('pt:' + a.pi, null); if (!P) return this.err(ws, 'Bir partide değilsin.');
      for (const id of P.mem) { const w = this.byId(id); if (w) this.snd(w, o); }
    } else {
      for (const w of this.all()) { const b = this.A(w); if (!b.id) continue; if (ch === 'l' && Math.hypot(b.x - a.x, b.y - a.y) > 960) continue; this.snd(w, o); }
    }
  }
  /* ---- arkadaşlar / istekler ---- */
  async fl(w) {
    const a = this.A(w); if (!a.pk) return; const p = await this.prof(a.pk), now = Date.now();
    const fr = Object.keys(p.fr).map(k => { const o = this.byPk(k), oa = o ? this.A(o) : null; return { k, n: oa ? oa.nick : p.fr[k], on: !!oa, id: oa ? oa.id : null, lv: oa ? oa.lv : 0, un: p.un[k] || 0 }; });
    this.snd(w, { t: 'fl', fr, in: p.in.filter(r => this.fresh(r, now)), bl: p.bl });
  }
  async notifyFriends(pk) { const p = await this.prof(pk); for (const k of Object.keys(p.fr)) { const w = this.byPk(k); if (w) await this.fl(w); } }
  async iv(ws, a, m, now) {
    const k = String(m.k || ''); if (!KINDS.includes(k)) return;
    if (now - (a.ir || 0) < 1500) return this.err(ws, 'Biraz yavaş: istekler arasında bekle.');
    let tpk = null, tw = null;
    if (m.to) { tw = this.byId(String(m.to)); if (tw) tpk = this.A(tw).pk; }
    else if (m.pk) { tpk = String(m.pk); tw = this.byPk(tpk); }
    else if (m.n) { tpk = await this.g('nk:' + clean(m.n, 16).toLocaleLowerCase('tr'), null); if (tpk) tw = this.byPk(tpk); }
    if (!tpk || tpk === a.pk) return this.err(ws, 'Oyuncu bulunamadı.');
    this.setA(ws, x => { x.ir = now; });
    const tp = await this.prof(tpk); if (tp.bl.includes(a.pk)) return this.err(ws, 'İstek gönderildi.');
    const me = await this.prof(a.pk); let d = {};
    const ta = tw ? this.A(tw) : null;
    if (k === 'fr') { if (me.fr[tpk]) return this.err(ws, 'Zaten arkadaşsınız.'); if (Object.keys(me.fr).length >= 50 || Object.keys(tp.fr).length >= 50) return this.err(ws, 'Arkadaş listesi dolu.'); }
    else if (k === 'gf') {
      if (!me.fr[tpk]) return this.err(ws, 'Hediye sadece arkadaşlara.');
      const day = Math.floor(now / 864e5), gs = me.gd === day ? me.gs : 0, g = int(m.g, 1, 1000);
      if (gs >= 3) return this.err(ws, 'Günde en fazla 3 hediye gönderebilirsin.');
      me.gd = day; me.gs = gs + 1; await this.saveP(a.pk, me); d = { g }; this.snd(ws, { t: 'gok', g });
    }
    else if (k === 'cl') {
      if (!a.cg) return this.err(ws, 'Önce bir klanda olmalısın.');
      const C = await this.g('c:' + a.cg, null); if (!C || !['lead', 'off'].includes((C.mem[a.pk] || {}).r)) return this.err(ws, 'Davet için lider ya da subay olmalısın.');
      if (tp.cl) return this.err(ws, 'Oyuncu zaten bir klanda.'); if (Object.keys(C.mem).length >= 30) return this.err(ws, 'Klan dolu.');
      d = { tag: a.cg, name: C.name };
    } else {
      if (!tw) return this.err(ws, 'Oyuncu çevrimiçi değil.');
      if (k === 'pt') {
        if (a.pi) { const P = await this.g('pt:' + a.pi, null); if (P && P.lead !== a.id) return this.err(ws, 'Sadece parti lideri davet edebilir.'); if (P && P.mem.length >= 4) return this.err(ws, 'Parti dolu.'); }
        if (ta.pi && ta.pi === a.pi) return this.err(ws, 'Zaten aynı partidesiniz.');
      } else {
        if (a.du || a.tr || ta.du || ta.tr) return this.err(ws, 'Biri şu an düello ya da takasta.');
        if (k === 'du') { const g = int(m.g, 0, 5000); if (!WAGERS.includes(g)) return; d = { g }; }
      }
    }
    const rq = { rid: rid(8), k, f: a.pk, fn: a.nick, t: now, d };
    tp.in = tp.in.filter(x => !(x.k === k && x.f === a.pk) && this.fresh(x, now)); tp.in.push(rq); tp.in = tp.in.slice(-30);
    await this.saveP(tpk, tp);
    if (tw) { this.snd(tw, { t: 'rq', r: rq }); await this.fl(tw); }
    if (k !== 'gf') this.err(ws, 'İstek gönderildi.');
  }
  async ra(ws, a, m, now) {
    const mp = await this.prof(a.pk), i = mp.in.findIndex(x => x.rid === m.rid); if (i < 0) return;
    const r = mp.in.splice(i, 1)[0]; await this.saveP(a.pk, mp);
    if (!this.fresh(r, now)) { this.err(ws, 'İstek süresi dolmuş.'); return this.fl(ws); }
    const sw = this.byPk(r.f);
    if (!m.ok) { if (sw && TTL[r.k]) this.err(sw, a.nick + ' isteğini reddetti.'); return this.fl(ws); }
    if (r.k === 'fr') {
      const op = await this.prof(r.f), mp2 = await this.prof(a.pk); mp2.fr[r.f] = r.fn; op.fr[a.pk] = a.nick; await this.saveP(a.pk, mp2); await this.saveP(r.f, op);
      await this.fl(ws); if (sw) { this.err(sw, a.nick + ' artık arkadaşın! 🤝'); await this.fl(sw); } this.err(ws, r.fn + ' artık arkadaşın! 🤝'); return;
    }
    if (r.k === 'gf') { this.snd(ws, { t: 'gift', g: int(r.d.g, 1, 1000), fn: r.fn }); return this.fl(ws); }
    if (r.k === 'cj') {
      const C = await this.g('c:' + String(r.d.tag || ''), null); if (!C || !['lead', 'off'].includes((C.mem[a.pk] || {}).r)) return this.fl(ws);
      const ok = await this.joinClan(r.f, r.fn, C.tag); this.err(ws, ok ? r.fn + ' klana alındı.' : 'Katılma tamamlanamadı.'); if (ok && sw) this.err(sw, C.name + ' klanına kabul edildin!'); return this.fl(ws);
    }
    if (r.k === 'cl') { await this.joinClan(a.pk, a.nick, String(r.d.tag || '')) || this.err(ws, 'Klana katılınamadı.'); return this.fl(ws); }
    if (!sw) return this.err(ws, 'Gönderen çevrimdışı.');
    const sa = this.A(sw);
    if (r.k === 'pt') { await this.partyAdd(sw, ws); return; }
    if (a.du || a.tr || sa.du || sa.tr) return this.err(ws, 'Biri şu an düello ya da takasta.');
    if (r.k === 'tr') return this.startTrade(sw, ws);
    if (r.k === 'du') return this.startDuel(sw, ws, int(r.d.g, 0, 5000), now);
  }
  async dm(ws, a, m, now) {
    if (now - (a.dt || 0) < 900) return; const k = String(m.k || ''), txt = clean(m.m, 200); if (!txt) return;
    const p = await this.prof(a.pk), o = await this.prof(k); if (!p.fr[k] || !o.fr[a.pk]) return this.err(ws, 'DM sadece arkadaşlarla.');
    if (o.bl.includes(a.pk)) return;
    if (bad(txt)) return this.err(ws, 'Mesajın uygunsuz bulundu.');
    this.setA(ws, x => { x.dt = now; });
    const key = 'd:' + [a.pk, k].sort().join('|'), L = await this.g(key, []); const e = { f: a.pk, m: txt, t: now }; L.push(e); await this.s(key, L.slice(-40));
    const ow = this.byPk(k); const out = { t: 'dm', k: a.pk, e };
    this.snd(ws, { t: 'dm', k, e });
    if (ow) this.snd(ow, out); else { o.un[a.pk] = (o.un[a.pk] || 0) + 1; await this.saveP(k, o); }
  }
  /* ---- parti ---- */
  async partyAdd(lw, jw) {
    const la = this.A(lw); let pid = la.pi, P = pid ? await this.g('pt:' + pid, null) : null;
    if (!P) { pid = rid(6); P = { lead: la.id, mem: [la.id] }; this.setA(lw, x => { x.pi = pid; }); }
    if (P.mem.length >= 4) return this.err(jw, 'Parti dolu.');
    if (this.A(jw).pi) await this.partyLeave(jw);
    this.setA(jw, x => { x.pi = pid; }); P.mem.push(this.A(jw).id); await this.s('pt:' + pid, P); await this.partyPush(pid);
  }
  async partyPush(pid) {
    if (this.ptc) delete this.ptc[pid];
    const P = await this.g('pt:' + pid, null); if (!P) return; const ms = P.mem.map(id => this.byId(id)).filter(Boolean);
    const mem = ms.map(w => { const a = this.A(w); return { id: a.id, n: a.nick, lv: a.lv, k: a.pk }; });
    for (const w of ms) this.snd(w, { t: 'pt', lead: P.lead, mem });
  }
  async partyLeave(w) {
    const a = this.A(w), pid = a.pi; if (!pid) return;
    this.setA(w, x => { x.pi = null; }); this.snd(w, { t: 'pt', lead: null, mem: [] });
    const P = await this.g('pt:' + pid, null); if (!P) return;
    P.mem = P.mem.filter(id => id !== a.id && this.byId(id));
    if (P.mem.length < 2) { for (const id of P.mem) { const x = this.byId(id); if (x) { this.setA(x, y => { y.pi = null; }); this.snd(x, { t: 'pt', lead: null, mem: [] }); } } await this.state.storage.delete('pt:' + pid); return; }
    if (!P.mem.includes(P.lead)) P.lead = P.mem[0];
    await this.s('pt:' + pid, P); await this.partyPush(pid);
  }
  /* ---- düello ---- */
  startDuel(w1, w2, g, now) {
    const a1 = this.A(w1), a2 = this.A(w2);
    this.setA(w1, x => { x.du = { o: a2.id, hp: 300, g, ct: 0, t0: now }; }); this.setA(w2, x => { x.du = { o: a1.id, hp: 300, g, ct: 0, t0: now }; });
    const o = { t: 'ds', a: a1.id, b: a2.id, hp: 300, g, an: a1.nick, bn: a2.nick }; this.snd(w1, o); this.snd(w2, o);
  }
  /* ortak zindan aktarması: yalnızca aynı partideki (aynı dünyadaki) üyelere iletir. Oyun mantığı parti liderinin istemcisinde (host). */
  async dgr(ws, a, m, now) {
    if (!a.pi) return;
    this.dgl = this.dgl || new Map(); const last = this.dgl.get(ws) || 0; if (now - last < 40) return; this.dgl.set(ws, now);
    this.ptc = this.ptc || {}; let c = this.ptc[a.pi];
    if (!c || now - c.t > 3000) { const P = await this.g('pt:' + a.pi, null); if (!P) { delete this.ptc[a.pi]; return; } c = this.ptc[a.pi] = { mem: P.mem.slice(), t: now }; }
    if (c.mem.indexOf(a.id) < 0) return;
    const k = String(m.k || '').slice(0, 4), to = m.to ? String(m.to) : null, o = JSON.stringify({ t: 'dgr', f: a.id, k, d: m.d === undefined ? null : m.d });
    for (const id of c.mem) { if (id === a.id || (to && id !== to)) continue; const w = this.byId(id); if (w) try { w.send(o); } catch (e) {} }
  }
  async dh(ws, a, now, m) {
    const d = a.du; if (!d) return; const ow = this.byId(d.o); if (!ow) return this.endDuel(ws, null);
    const b = this.A(ow); if (!b.du || b.du.o !== a.id) return;
    /* Kurucunun Gazabı: yalnızca sunucuda doğrulanmış kurucu hesabı (ADMINS), 8 sn bekleme, 1100 px menzil, tek vuruş */
    const sp = !!(m && m.sp && a.adm);
    if (sp) { if (now - (d.spT || 0) < 8000) return; if (Math.hypot(a.x - b.x, a.y - b.y) > 1100) return this.err(ws, 'Rakip menzil dışında.'); }
    else { if (now - d.ct < 450) return; if (Math.hypot(a.x - b.x, a.y - b.y) > 240) return this.err(ws, 'Rakip menzil dışında.'); }
    const crit = !sp && Math.random() < .12, dmg = sp ? b.du.hp : Math.round((16 + Math.min(a.lv, 40) * .6) * (.85 + Math.random() * .3) * (crit ? 1.6 : 1));
    if (sp) d.spT = now;
    d.ct = now; this.setA(ws, x => { x.du = d; });
    b.du.hp = Math.max(0, b.du.hp - dmg); this.setA(ow, x => { x.du = b.du; });
    const o = { t: 'dh', f: a.id, to: b.id, d: dmg, c: crit ? 1 : 0, hp: b.du.hp, sp: sp ? 1 : 0 }; this.snd(ws, o); this.snd(ow, o);
    if (b.du.hp <= 0) await this.endDuel(ws, ow);
  }
  async endDuel(win, lose, d1, d2) {
    if (!win && !lose && !d1) return;
    if (d1 || d2) { // berabere (süre doldu)
      const g = d1 ? this.A(d1).du.g : 0;
      for (const w of [d1, d2]) if (w) { this.setA(w, x => { x.du = null; }); this.snd(w, { t: 'de', w: null, g }); }
      return;
    }
    const wa = win ? this.A(win) : null, la = lose ? this.A(lose) : null, g = (wa && wa.du ? wa.du.g : la && la.du ? la.du.g : 0);
    const wid = wa && wa.id, lid = la && la.id;
    if (win) this.setA(win, x => { x.du = null; }); if (lose) this.setA(lose, x => { x.du = null; });
    const o = { t: 'de', w: wid || null, l: lid || null, g };
    if (win) this.snd(win, o); if (lose) this.snd(lose, o);
    if (wa && wa.pk) { const p = await this.prof(wa.pk); p.w++; await this.saveP(wa.pk, p); this.setA(win, x => { x.w = p.w; }); await this.lbSet(wa.pk, wa.nick, p); }
    if (la && la.pk) { const p = await this.prof(la.pk); p.l++; await this.saveP(la.pk, p); if (lose) this.setA(lose, x => { x.l = p.l; }); }
  }
  async lbSet(pk, n, p) { const L = await this.g('lb', {}); L[pk] = { n, w: p.w, l: p.l }; const ks = Object.keys(L).sort((x, y) => L[y].w - L[x].w).slice(0, 30); const o = {}; ks.forEach(k => o[k] = L[k]); await this.s('lb', o); }
  async lb(ws) {
    const L = await this.g('lb', {}), ix = await this.g('cidx', {});
    const duel = Object.keys(L).map(k => ({ k, ...L[k] })).sort((a, b) => b.w - a.w).slice(0, 10);
    const clans = Object.keys(ix).map(t => ({ tag: t, ...ix[t], lv: lvl(ix[t].xp) })).sort((a, b) => b.xp - a.xp).slice(0, 10);
    this.snd(ws, { t: 'lb', duel, clans });
  }

  /* ---- yönetim: ban, susturma, eşya kuyruğu, oyuncu anlık görüntüsü ---- */
  async snap(ws, a, m, now) {
    if (now - (a.sn || 0) < 100e3) return; this.setA(ws, x => { x.sn = now; });
    const d = m.d; if (!d || typeof d !== 'object') return;
    const mp = (o, re, n) => { const r = {}; if (o && typeof o === 'object') for (const k of Object.keys(o).slice(0, n)) if (re.test(k)) { const v = int(o[k], 0, 1e9); if (v) r[k] = v; } return r; };
    const ls = (o, n) => (o && typeof o === 'object' ? Object.keys(o).filter(k => /^\w{1,16}:\d{1,2}$/.test(k) && o[k]).slice(0, n) : []);
    const o = { cls: clean(d.cls, 14), lv: int(d.lv, 1, 999), xp: int(d.xp, 0, 1e12), gold: int(d.gold, 0, 1e12), jt: int(d.jt, 0, 1e12), wt: int(d.wt, 0, 99), at: int(d.at, 0, 99), mats: mp(d.mats, /^\w{1,16}$/, 60), rn: mp(d.rn, /^\w{1,16}$/, 40), ow: ls(d.ow, 80), oz: ls(d.oz, 80), pe: mp(d.pe, /^\w{1,16}$/, 40) };
    await this.s('sn:' + a.pk, { t: now, w: this.me(), n: a.nick, d: o });
  }
  async admAck(a, m) {
    const id = clean(m.id, 12); if (!id) return;
    const q = await this.g('adm:' + a.pk, []), r = q.filter(x => x.id !== id);
    if (r.length !== q.length) { if (r.length) await this.s('adm:' + a.pk, r); else await this.del('adm:' + a.pk); await this.alog({ op: 'teslim', pk: a.pk, n: a.nick, d: id }); }
  }
  async alog(e) { const L = await this.g('alog', []); L.push({ t: Date.now(), ...e }); await this.s('alog', L.slice(-200)); }
  async resolvePk(q) {
    q = clean(q, 20); if (!q) return null; if (/^p[0-9a-f]{14}$/.test(q)) return q;
    return await this.g('nk:' + q.toLocaleLowerCase('tr'), null);
  }
  async admop(b) {
    const now = Date.now(), by = clean(b.by, 40), op = b.op;
    if (op === 'bans') return this.js({ bans: await this.g('bidx', {}) });
    if (op === 'log') return this.js({ log: (await this.g('alog', [])).slice(-100).reverse() });
    if (op === 'ann') { const m = clean(b.m, 140); if (!m) return this.js({ err: 'Boş duyuru' }); await this.alog({ by, op: 'duyuru', d: m }); return this.js({ live: { all: true, send: { t: 'sys', m: '📢 ' + m } } }); }
    const pk = await this.resolvePk(b.q); if (!pk) return this.js({ err: 'Oyuncu bulunamadı' });
    const prof = await this.g('u:' + pk, null), nick = (prof && prof.n) || clean(b.q, 16);
    if (op === 'find') return this.js({ pk, n: nick, cl: prof && prof.cl || null, w: prof && prof.w || 0, l: prof && prof.l || 0, sn: await this.g('sn:' + pk, null), ban: await this.g('ban:' + pk, null), mt: await this.g('mt:' + pk, 0), q: await this.g('adm:' + pk, []) });
    if (op === 'ban') { const mins = int(b.mins, 0, 525600), reason = clean(b.reason, 120), until = mins ? now + mins * 60000 : 0; await this.s('ban:' + pk, { until, reason, at: now, by });
      const ix = await this.g('bidx', {}); ix[pk] = { n: nick, until, reason, at: now }; await this.s('bidx', ix); await this.alog({ by, op: 'ban', pk, n: nick, d: (mins ? mins + ' dk' : 'kalıcı') + ' ' + reason });
      return this.js({ pk, live: { pk, kick: 1, send: { t: 'ban', m: reason, until } } }); }
    if (op === 'unban') { await this.del('ban:' + pk); const ix = await this.g('bidx', {}); delete ix[pk]; await this.s('bidx', ix); await this.alog({ by, op: 'ban kalktı', pk, n: nick }); return this.js({ pk }); }
    if (op === 'mute') { const mins = int(b.mins, 1, 43200), until = now + mins * 60000; await this.s('mt:' + pk, until); await this.alog({ by, op: 'susturma', pk, n: nick, d: mins + ' dk' }); return this.js({ pk, live: { pk, mu: until, send: { t: 'sys', m: 'Yönetici seni ' + mins + ' dakika susturdu.' } } }); }
    if (op === 'unmute') { await this.del('mt:' + pk); await this.alog({ by, op: 'susturma kalktı', pk, n: nick }); return this.js({ pk, live: { pk, mu: 0, send: { t: 'sys', m: 'Susturman kaldırıldı.' } } }); }
    if (op === 'kick') { await this.alog({ by, op: 'at', pk, n: nick }); return this.js({ pk, live: { pk, kick: 1, send: { t: 'sys', m: 'Yönetici seni sunucudan attı.' } } }); }
    if (op === 'msg') { const m = clean(b.m, 140); if (!m) return this.js({ err: 'Boş mesaj' }); await this.alog({ by, op: 'mesaj', pk, n: nick, d: m }); return this.js({ pk, live: { pk, send: { t: 'sys', m: '📩 Yönetici: ' + m } } }); }
    if (op === 'give' || op === 'take' || op === 'setlv') {
      const q = { id: rid(8), k: op === 'setlv' ? 'lv' : op, at: now };
      if (op === 'setlv') q.v = int(b.v, 1, 150); else { q.g = int(b.g, 0, 1e9); q.it = {}; let n = 0; if (b.it && typeof b.it === 'object') for (const k of Object.keys(b.it)) { if (n >= 20) break; if (!/^(m|r|w|z|e):[\w:]{1,24}$/.test(k) && !/^cos\.\w+\.\w+$/.test(k) && k !== 'jeton') continue; const v = int(b.it[k], 0, 1e6); if (v > 0) { q.it[k] = v; n++; } } if (!q.g && !n) return this.js({ err: 'Boş içerik' }); }
      q.msg = clean(b.msg, 100);
      const L = await this.g('adm:' + pk, []); L.push(q); await this.s('adm:' + pk, L.slice(-30)); await this.alog({ by, op, pk, n: nick, d: JSON.stringify(q.v ?? { g: q.g, it: q.it }).slice(0, 200) });
      return this.js({ pk, live: { pk, send: { t: 'adm', q } } });
    }
    return this.js({ err: 'Bilinmeyen işlem' });
  }
  js(o) { return new Response(JSON.stringify(o), { headers: { 'content-type': 'application/json' } }); }
  /* ---- takas ---- */
  async startTrade(w1, w2) {
    const a1 = this.A(w1), a2 = this.A(w2), tid = rid(6);
    if (a1.pk && a1.pk === a2.pk) return this.snd(w1, { t: 'tx', m: 'Kendinle takas yapamazsın.' });
    if ((a1.lv || 1) < 5 || (a2.lv || 1) < 5) { for (const w of [w1, w2]) this.snd(w, { t: 'tx', m: 'Takas için iki tarafın da en az 5. seviye olması gerekir.' }); return; }
    const T = { a: { id: a1.id, n: a1.nick, g: 0, it: {}, lk: 0, ok: 0 }, b: { id: a2.id, n: a2.nick, g: 0, it: {}, lk: 0, ok: 0 } };
    this.setA(w1, x => { x.tr = tid; }); this.setA(w2, x => { x.tr = tid; }); await this.s('tr:' + tid, T); this.tpush(T);
  }
  tpush(T) { for (const s of ['a', 'b']) { const w = this.byId(T[s].id); if (w) this.snd(w, { t: 'ts', me: s, a: T.a, b: T.b }); } }
  async tradeCancel(tid, why) {
    const T = await this.g('tr:' + tid, null); if (!T) return;
    for (const s of ['a', 'b']) { const w = this.byId(T[s].id); if (w) { this.setA(w, x => { x.tr = null; }); this.snd(w, { t: 'tx', m: why || 'Takas iptal edildi.' }); } }
    await this.state.storage.delete('tr:' + tid);
  }
  /* ---- Oyuncu pazarı (ikinci el): ilanlar, satış geliri kutusu ve fiyat geçmişi tek anahtarda (mkx) ve sahibi olan dünyada atomik işlenir.
     Fiyat bandı: adil değerin %30'u – %300'ü. Satışta %5 vergi (altın gideri). İlan 72 saat sürer, dolunca eşya satıcının kutusuna döner. ---- */
  async mkApply(b) {
    const now = Date.now(), EXP = 72 * 36e5, st = this.state.storage;
    const S = (await st.get('mkx')) || { L: [], Q: {}, H: {} }; S.B = S.B || {};
    const Qf = pk => S.Q[pk] || (S.Q[pk] = { g: 0, it: [] });
    S.L = S.L.filter(l => { if (now - l.t < EXP) return true; const q = Qf(l.s); if (q.it.length < 30) q.it.push(l.k + (l.n > 1 ? '#' + l.n : '')); return false; });
    const pk = String(b.pk || ''), out = { ok: 1, a: b.a, q: b.q };
    const band = f => [Math.max(1, Math.ceil(f * .3)), Math.floor(f * 3)];
    if (b.a === 'add') {
      const k = String(b.ik || ''), f = int(b.f, 1, 5e7), pr = int(b.pr, 1, 2e8), [lo, hi] = band(f);
      const n = k[0] === 'm' ? int(b.n, 1, 9999) : 1;
      if (!/^[mrwze]:[\w:]{1,24}$/.test(k)) out.ok = 0, out.e = 'Geçersiz eşya.';
      else if (pr < lo || pr > hi) out.ok = 0, out.e = 'Fiyat ' + lo + ' – ' + hi + ' arasında olmalı.';
      else if (S.L.filter(l => l.s === pk).length >= 8) out.ok = 0, out.e = 'En fazla 8 ilanın olabilir.';
      else if (S.L.length >= 300) out.ok = 0, out.e = 'Pazar şu an dolu, biraz sonra dene.';
      else S.L.push({ id: rid(6), s: pk, sn: clean(b.sn, 16), k, n, pr, f, t: now });
    } else if (b.a === 'buy') {
      const i = S.L.findIndex(l => l.id === String(b.id || ''));
      if (i < 0) out.ok = 0, out.e = 'İlan artık yok (satılmış ya da kaldırılmış).';
      else if (S.L[i].s === pk) out.ok = 0, out.e = 'Kendi ilanını satın alamazsın.';
      else if ((Qf(pk).it || []).length >= 30) out.ok = 0, out.e = 'Teslim kutun dolu, önce Oyuncu Pazarı sekmesini yenileyip topla.';
      else { const l = S.L[i]; S.L.splice(i, 1); const bq = Qf(pk); bq.it.push(l.k + (l.n > 1 ? '#' + l.n : '')); (S.B[pk] = S.B[pk] || []).push(l.id); if (S.B[pk].length > 12) S.B[pk].shift(); out.id = l.id; const q = Qf(l.s); q.g += Math.max(1, Math.floor(l.pr * .95)); q.sold = (q.sold || 0) + 1; (S.H[l.k] = S.H[l.k] || []).push(Math.max(1, Math.round(l.pr / (l.n || 1)))); if (S.H[l.k].length > 6) S.H[l.k].shift(); out.k = l.k; out.n = l.n || 1; out.pr = l.pr; }
    } else if (b.a === 'cancel') {
      const i = S.L.findIndex(l => l.id === String(b.id || '') && l.s === pk);
      if (i < 0) out.ok = 0, out.e = 'İlan bulunamadı.'; else { const l = S.L.splice(i, 1)[0], q = Qf(pk); if (q.it.length < 30) q.it.push(l.k + (l.n > 1 ? '#' + l.n : '')); }
    } else if (b.a === 'reprice') {
      const l = S.L.find(x => x.id === String(b.id || '') && x.s === pk), pr = int(b.pr, 1, 2e8);
      if (!l) out.ok = 0, out.e = 'İlan bulunamadı.'; else { const [lo, hi] = band(l.f); if (pr < lo || pr > hi) out.ok = 0, out.e = 'Fiyat ' + lo + ' – ' + hi + ' arasında olmalı.'; else l.pr = pr; }
    } else if (b.a === 'collect') {
      const q = S.Q[pk]; if (q && !q.d && (q.g > 0 || q.it.length)) { q.d = { c: rid(8), g: q.g, it: q.it, n: q.sold || 0 }; q.g = 0; q.it = []; q.sold = 0; }
      if (q && q.d) out.d = q.d;
    } else if (b.a === 'verify') {
      out.id = String(b.id || ''); out.bought = (S.B[pk] || []).indexOf(out.id) >= 0;
    } else if (b.a === 'ack') {
      const q = S.Q[pk]; if (q && q.d && q.d.c === String(b.c || '')) { delete q.d; if (!q.g && !q.it.length) delete S.Q[pk]; }
    }
    await st.put('mkx', S);
    out.L = S.L.map(l => ({ id: l.id, s: l.s, sn: l.sn, k: l.k, n: l.n || 1, pr: l.pr, f: l.f, t: l.t })); out.H = S.H;
    return out;
  }
  async mkt(ws, a, m, now) {
    if (!a.pk) return;
    if (now - (a.mkt || 0) < 350) return this.snd(ws, { t: 'mkr', ok: 0, a: m.t, q: int(m.q, 0, 1e9), e: 'Çok hızlı, bir saniye bekle.' }); this.setA(ws, x => { x.mkt = now; });
    const map = { mkq: 'q', mkl: 'add', mkb: 'buy', mkc: 'cancel', mkp: 'reprice', mkk: 'collect', mka: 'ack', mkv: 'verify' };
    const b = { a: map[m.t], pk: a.pk, sn: a.nick, ik: m.k, n: m.n, f: m.f, pr: m.pr, id: m.id, c: m.c, q: int(m.q, 0, 1e9), op: 'mk', k: 'mkx' };
    if (b.a === 'add' && bad(clean(a.nick, 16))) b.sn = 'Oyuncu';
    let r; try { const w = shardOf('mkx'); r = w === this.me() ? await this.mkApply(b) : await (await this.kv(w, b)).json(); } catch (e) { return this.snd(ws, { t: 'mkr', ok: 0, a: b.a, q: b.q, e: 'Pazara şu an ulaşılamıyor.' }); }
    r.t = 'mkr'; r.me = a.pk; this.snd(ws, r);
  }

  /* ---- Kasaba evleri: 12 arsanın sahipleri, ev içi dekor, davetliler ve yatak tek anahtarda (evx), sahibi olan dünyada atomik işlenir. ---- */
  async evApply(b) {
    const now = Date.now(), st = this.state.storage, S = (await st.get('evx')) || { P: {} };
    const pk = String(b.pk || ''), id = /^p([1-9]|1[0-2])$/.test(String(b.id || '')) ? String(b.id) : '', out = { ok: 1, a: b.a, id };
    for (const k in S.P) { const g = S.P[k].g || {}; for (const u in g) if (now - g[u].t > 75e3) delete g[u]; if (S.P[k].os && now - S.P[k].os > 75e3) S.P[k].os = 0; if (S.P[k].oi && now - S.P[k].oi > 75e3) S.P[k].oi = 0; }
    const mine = () => Object.keys(S.P).find(k => S.P[k].u === pk);
    const decor = d => (Array.isArray(d) ? d : []).slice(0, 30).filter(o => o && /^[a-z0-9]{1,10}$/.test(String(o.i)) ).map(o => ({ i: String(o.i), x: int(o.x, 0, 100), y: int(o.y, 0, 100) }));
    const ap = x => { try { const t = typeof x === 'string' ? x : JSON.stringify(x || {}); return t.length < 700 ? t : '{}'; } catch (e) { return '{}'; } };
    if (b.a === 'claim') {
      if (!id) out.ok = 0, out.e = 'Geçersiz arsa.';
      else if (S.P[id] && S.P[id].u !== pk) out.ok = 0, out.e = 'Bu arsa az önce başkasına satıldı.';
      else { const o = mine(), keep = o && o !== id ? S.P[o] : S.P[id]; if (o && o !== id) delete S.P[o]; S.P[id] = { u: pk, n: clean(b.sn, 16), lv: int(b.lv, 1, 5), t: S.P[id] ? S.P[id].t : now, ap: ap(b.ap), d: keep ? keep.d || [] : [], iv: keep ? keep.iv || [] : [], g: {}, os: 0 }; }
    } else if (b.a === 'release') {
      const o = mine(); if (o) delete S.P[o];
    } else if (b.a === 'sync') {
      const o = mine(); if (!o) out.ok = 0, out.e = 'Evin yok.'; else { const p = S.P[o]; p.n = clean(b.sn, 16) || p.n; p.lv = int(b.lv, 1, 5); p.ap = ap(b.ap); if (b.d) p.d = decor(b.d); if (b.sl !== undefined) p.os = b.sl ? now : 0; if (b.in !== undefined) p.oi = b.in ? now : 0; if (b.x !== undefined) { p.ox = int(b.x, 0, 600); p.oy = int(b.y, 0, 420); } if (b.hb) { if (p.os) p.os = now; if (p.oi) p.oi = now; } }
    } else if (b.a === 'invite' || b.a === 'uninvite') {
      const o = mine(), t = String(b.ipk || '');
      if (!o) out.ok = 0, out.e = 'Evin yok.'; else if (!/^p[0-9a-f]{14}$/.test(t) || t === pk) out.ok = 0, out.e = 'Oyuncu bulunamadı.'; else { const p = S.P[o]; p.iv = p.iv || []; if (b.a === 'invite') { if (!p.iv.includes(t)) { if (p.iv.length >= 12) p.iv.shift(); p.iv.push(t); } out.inv = t; } else { p.iv = p.iv.filter(x => x !== t); if (p.g) delete p.g[t]; } }
    } else if (b.a === 'join') {
      const p = S.P[id]; if (!p) out.ok = 0, out.e = 'Bu arsada ev yok.';
      else if (p.u !== pk && !(p.iv || []).includes(pk)) out.ok = 0, out.e = 'Bu eve davetli değilsin.';
      else if (p.u !== pk) { p.g = p.g || {}; if (!p.g[pk] && Object.keys(p.g).length >= 3) out.ok = 0, out.e = 'Evde yer yok (en fazla 3 misafir).'; else p.g[pk] = { n: clean(b.sn, 16), ap: ap(b.ap), t: now, s: p.g[pk] ? p.g[pk].s : 0, x: int(b.x, 0, 600), y: int(b.y, 0, 420) }; }
    } else if (b.a === 'leave') {
      const p = S.P[id]; if (p && p.g) delete p.g[pk];
    } else if (b.a === 'sleep') {
      const p = S.P[id], on = b.on ? 1 : 0;
      if (!p) out.ok = 0, out.e = 'Ev yok.';
      else { const cnt = (p.os ? 1 : 0) + Object.keys(p.g || {}).filter(u => p.g[u].s && u !== pk).length;
        if (on && cnt >= 2) out.ok = 0, out.e = 'Yatak dolu (iki kişilik).';
        else if (p.u === pk) p.os = on ? now : 0; else if (p.g && p.g[pk]) { p.g[pk].s = on; p.g[pk].t = now; } else out.ok = 0, out.e = 'Evde değilsin.'; }
    }
    await st.put('evx', S);
    const pub = {}; for (const k in S.P) { const p = S.P[k]; pub[k] = { u: p.u, n: p.n, lv: p.lv, d: p.d, ap: p.ap, os: p.os ? 1 : 0, oi: p.oi ? 1 : 0, ox: p.ox || 0, oy: p.oy || 0, g: Object.keys(p.g || {}).map(u => ({ u, n: p.g[u].n, ap: p.g[u].ap, s: p.g[u].s ? 1 : 0, x: p.g[u].x || 0, y: p.g[u].y || 0 })), iv: (p.iv || []).includes(pk) ? 1 : 0 }; }
    out.P = pub; return out;
  }
  async evt(ws, a, m, now) {
    if (!a.pk) return;
    if (now - (a.evt || 0) < 300) return this.snd(ws, { t: 'evr', ok: 0, a: m.t, e: 'Çok hızlı.' }); this.setA(ws, x => { x.evt = now; });
    const map = { evq: 'q', evc: 'claim', evr: 'release', evy: 'sync', evi: 'invite', evu: 'uninvite', evj: 'join', evl: 'leave', evs: 'sleep' };
    const b = { a: map[m.t], pk: a.pk, sn: bad(clean(a.nick, 16)) ? 'Oyuncu' : clean(a.nick, 16), id: m.id, lv: m.lv, ap: m.ap, d: m.d, sl: m.sl, hb: m.hb, in: m.in, x: m.x, y: m.y, on: m.on, op: 'ev', k: 'evx' };
    if (b.a === 'invite' || b.a === 'uninvite') { b.ipk = String(m.pk || ''); if (m.n) { const t = await this.g('nk:' + clean(m.n, 16).toLocaleLowerCase('tr'), null); if (t) b.ipk = t; } }
    let r; try { const w = shardOf('evx'); r = w === this.me() ? await this.evApply(b) : await (await this.kv(w, b)).json(); } catch (e) { return this.snd(ws, { t: 'evr', ok: 0, a: b.a, e: 'Emlak kaydına şu an ulaşılamıyor.' }); }
    r.t = 'evr'; r.me = a.pk; this.snd(ws, r);
  }
  async tradeAct(ws, a, m) {
    if (!a.tr) return; if (m.t === 'tx') return this.tradeCancel(a.tr, 'Takas iptal edildi.');
    const T = await this.g('tr:' + a.tr, null); if (!T) return; const s = T.a.id === a.id ? 'a' : 'b', o = s === 'a' ? 'b' : 'a';
    if (m.t === 'to') { const c = cleanOffer(m.g, m.it); T[s].g = c.g; T[s].it = c.it; T.a.lk = T.b.lk = T.a.ok = T.b.ok = 0; }
    else if (m.t === 'tl') { T[s].lk = T[s].lk ? 0 : 1; T.a.ok = T.b.ok = 0; }
    else if (m.t === 'tc') {
      if (!(T.a.lk && T.b.lk)) return; T[s].ok = 1;
      if (T.a.ok && T.b.ok) {
        const day = Math.floor(Date.now() / 864e5), vol = T.a.g + T.b.g, lim = [];
        for (const x of ['a', 'b']) { const w = this.byId(T[x].id), pk = w && this.A(w).pk; if (!pk) continue; const k = 'tv:' + pk, v = await this.g(k, null), cur = v && v.d === day ? v : { d: day, n: 0, g: 0 }; cur.n++; cur.g += vol; if (cur.n > 40 || cur.g > 1000000) lim.push(T[x].n); else await this.s(k, cur); }
        if (lim.length) return this.tradeCancel(a.tr, 'Günlük takas sınırı aşıldı (' + lim.join(', ') + '). Yarın tekrar dene.');
        for (const x of ['a', 'b']) { const w = this.byId(T[x].id), y = x === 'a' ? 'b' : 'a'; if (w) { this.setA(w, z => { z.tr = null; }); this.snd(w, { t: 'td', give: { g: T[x].g, it: T[x].it }, get: { g: T[y].g, it: T[y].it }, fn: T[y].n }); } }
        await this.state.storage.delete('tr:' + a.tr); return;
      }
    }
    await this.s('tr:' + a.tr, T); this.tpush(T);
  }
  /* ---- klan ---- */
  cstate(C) { const mem = Object.keys(C.mem).map(k => ({ k, n: C.mem[k].n, r: C.mem[k].r, c: C.mem[k].c, on: !!this.byPk(k) })); const l = lvl(C.xp); return { tag: C.tag, name: C.name, lv: l, xp: C.xp, nx: need(l), motto: C.motto, open: C.open ? 1 : 0, dep: C.dep || {}, dw: C.dw ? 1 : 0, cap: 300 + 200 * l, mem, msgs: C.msgs.slice(-30) }; }
  async clanPush(tag) { const C = await this.g('c:' + tag, null); if (!C) return; const st = { t: 'cl', c: this.cstate(C) }; for (const w of this.all()) if (this.A(w).cg === tag) this.snd(w, st); }
  async cidx(C) { const ix = await this.g('cidx', {}); if (C) ix[C.tag] = { n: C.name, xp: C.xp, m: Object.keys(C.mem).length, o: C.open ? 1 : 0 }; await this.s('cidx', ix); }
  setTag(pk, tag) { const w = this.byPk(pk); if (!w) return; const a = this.setA(w, x => { x.cg = tag || ''; }); this.bc({ t: 'ct', id: a.id, cg: tag || '' }); this.snd(w, { t: 'ct', id: a.id, cg: tag || '' }); if (!tag) this.snd(w, { t: 'cl', c: null }); }
  async clanCreate(ws, a, m, now) {
    const p = await this.prof(a.pk); if (p.cl) return this.err(ws, 'Zaten bir klandasın.');
    const tag = String(m.tag || '').toUpperCase().replace(/[^A-Z0-9]/g, ''), name = clean(m.name, 16), motto = clean(m.motto, 40);
    if (!/^[A-Z0-9]{2,4}$/.test(tag)) return this.err(ws, 'Etiket 2–4 harf/rakam olmalı.');
    if (name.length < 3) return this.err(ws, 'Klan adı en az 3 harf olmalı.');
    if (bad(tag) || bad(name) || bad(motto)) return this.err(ws, 'Uygunsuz isim.');
    if (await this.g('c:' + tag, null)) return this.err(ws, 'Bu etiket alınmış.');
    const C = { tag, name, lead: a.pk, mem: { [a.pk]: { n: a.nick, r: 'lead', c: 0 } }, xp: 0, motto, open: 1, msgs: [], made: now };
    await this.s('c:' + tag, C); p.cl = tag; await this.saveP(a.pk, p); await this.cidx(C);
    this.setTag(a.pk, tag); this.snd(ws, { t: 'cok', cost: 5000 }); await this.clanPush(tag);
  }
  async joinClan(pk, nick, tag) {
    const p = await this.prof(pk), C = await this.g('c:' + tag, null); if (!C || p.cl || Object.keys(C.mem).length >= 30) return false;
    C.mem[pk] = { n: nick, r: 'mem', c: 0 }; C.msgs.push({ n: '📢', m: nick + ' klana katıldı.', t: Date.now() }); await this.s('c:' + tag, C); p.cl = tag; await this.saveP(pk, p); await this.cidx(C);
    this.setTag(pk, tag); await this.clanPush(tag); return true;
  }
  async clanJoin(ws, a, m, now) {
    if (a.cg) return this.err(ws, 'Zaten bir klandasın.'); const tag = String(m.tag || '').toUpperCase(), C = await this.g('c:' + tag, null); if (!C) return this.err(ws, 'Klan bulunamadı.');
    if (C.open) { return (await this.joinClan(a.pk, a.nick, tag)) ? this.err(ws, C.name + ' klanına katıldın!') : this.err(ws, 'Klan dolu.'); }
    let sent = 0;
    for (const k of Object.keys(C.mem)) { if (!['lead', 'off'].includes(C.mem[k].r)) continue; const tp = await this.prof(k); tp.in = tp.in.filter(x => !(x.k === 'cj' && x.f === a.pk) && this.fresh(x, now)); const rq = { rid: rid(8), k: 'cj', f: a.pk, fn: a.nick, t: now, d: { tag } }; tp.in.push(rq); await this.saveP(k, tp); const w = this.byPk(k); if (w) { this.snd(w, { t: 'rq', r: rq }); await this.fl(w); } sent++; }
    this.err(ws, 'Katılma isteğin klan yöneticilerine gönderildi.');
  }
  async clanManage(ws, a, m) {
    if (!a.cg) return; const C = await this.g('c:' + a.cg, null); if (!C) return; const me = C.mem[a.pk], k = String(m.u || ''), t = C.mem[k]; if (!me || !t || k === a.pk) return;
    const act = m.a;
    if (act === 'kick') { if (!(me.r === 'lead' || (me.r === 'off' && t.r === 'mem'))) return; await this.clanLeave(null, k, C, true); return; }
    if (me.r !== 'lead') return;
    if (act === 'pro' && t.r === 'mem') t.r = 'off'; else if (act === 'dem' && t.r === 'off') t.r = 'mem';
    else if (act === 'lead') { t.r = 'lead'; me.r = 'off'; C.lead = k; } else return;
    await this.s('c:' + a.cg, C); await this.clanPush(a.cg);
  }
  async clanLeave(ws, pk, C0, kicked) {
    const p = await this.prof(pk); const tag = p.cl; if (!tag) return; const C = C0 || await this.g('c:' + tag, null);
    p.cl = null; await this.saveP(pk, p); this.setTag(pk, '');
    if (!C) return; const nick = (C.mem[pk] || {}).n || ''; delete C.mem[pk];
    const left = Object.keys(C.mem);
    if (!left.length) { await this.del('c:' + tag); const ix = await this.g('cidx', {}); delete ix[tag]; await this.s('cidx', ix); return; }
    if (C.lead === pk) { const nx = left.find(k => C.mem[k].r === 'off') || left[0]; C.mem[nx].r = 'lead'; C.lead = nx; }
    C.msgs.push({ n: '📢', m: nick + (kicked ? ' klandan çıkarıldı.' : ' klandan ayrıldı.'), t: Date.now() });
    await this.s('c:' + tag, C); await this.cidx(C); await this.clanPush(tag);
  }
  async clanDonate(ws, a, m) {
    if (!a.cg) return; const g = int(m.g, 1, 100000), C = await this.g('c:' + a.cg, null); if (!C || !C.mem[a.pk]) return;
    C.xp += g; C.mem[a.pk].c += g; C.msgs.push({ n: '📢', m: a.nick + ' kasaya ' + g + ' altın bağışladı.', t: Date.now() }); C.msgs = C.msgs.slice(-40);
    await this.s('c:' + a.cg, C); await this.cidx(C); this.snd(ws, { t: 'cdok', g }); await this.clanPush(a.cg);
  }
  async clanDepot(ws, a, m) {
    if (!a.cg) return; const k = String(m.k || ''); if (!/^(m:[a-z_0-9]{1,14}|r:[a-z]{2,12}|w:[a-z]{3,10}:\d{1,2})$/.test(k)) return;
    const q = (k[0] === 'w' || k[0] === 'z') ? 1 : int(m.q, 1, 999), C = await this.g('c:' + a.cg, null); if (!C || !C.mem[a.pk]) return; C.dep = C.dep || {};
    const cap = 300 + 200 * lvl(C.xp), tot = Object.values(C.dep).reduce((s, v) => s + v, 0), nm = clean(m.n, 24) || k, me = C.mem[a.pk];
    if (m.t === 'cdp') { if (tot + q > cap) return this.err(ws, 'Klan deposu dolu (' + cap + ').'); if (Object.keys(C.dep).length >= 60 && !C.dep[k]) return this.err(ws, 'Depoda çok fazla tür var.'); C.dep[k] = (C.dep[k] || 0) + q; C.msgs.push({ n: '📦', m: a.nick + ' depoya ' + q + '× ' + nm + ' koydu.', t: Date.now() }); }
    else { if (!(me.r === 'lead' || me.r === 'off' || C.dw)) return this.err(ws, 'Bu klanda depodan sadece lider ve subaylar alabilir.'); if ((C.dep[k] || 0) < q) return this.err(ws, 'Depoda yeterli yok.'); C.dep[k] -= q; if (!C.dep[k]) delete C.dep[k]; C.msgs.push({ n: '📦', m: a.nick + ' depodan ' + q + '× ' + nm + ' aldı.', t: Date.now() }); }
    C.msgs = C.msgs.slice(-40); await this.s('c:' + a.cg, C); this.snd(ws, { t: 'cdr', a: m.t === 'cdp' ? 'p' : 'w', k, q }); await this.clanPush(a.cg);
  }
  async clanDepotToggle(ws, a, m) {
    if (!a.cg) return; const C = await this.g('c:' + a.cg, null); if (!C || !C.mem[a.pk] || C.mem[a.pk].r !== 'lead') return;
    C.dw = m.on ? 1 : 0; C.msgs.push({ n: '📦', m: 'Lider depodan alma yetkisini ' + (C.dw ? 'tüm üyelere açtı.' : 'subaylara kısıtladı.'), t: Date.now() }); C.msgs = C.msgs.slice(-40); await this.s('c:' + a.cg, C); await this.clanPush(a.cg);
  }
  async clanEdit(ws, a, m) {
    if (!a.cg) return; const C = await this.g('c:' + a.cg, null); if (!C || C.mem[a.pk].r !== 'lead') return;
    if (m.motto !== undefined) { const t = clean(m.motto, 40); if (bad(t)) return; C.motto = t; } if (m.open !== undefined) C.open = m.open ? 1 : 0;
    await this.s('c:' + a.cg, C); await this.cidx(C); await this.clanPush(a.cg);
  }
  async clanSearch(ws, m) {
    const q = clean(m.q, 16).toLowerCase(), ix = await this.g('cidx', {});
    const list = Object.keys(ix).map(t => ({ tag: t, ...ix[t], lv: lvl(ix[t].xp) })).filter(c => !q || c.tag.toLowerCase().includes(q) || c.n.toLowerCase().includes(q)).sort((x, y) => y.xp - x.xp).slice(0, 10);
    this.snd(ws, { t: 'cs', list });
  }
  /* ---- kopmalar ---- */
  async webSocketClose(ws) {
    const a = this.A(ws); if (!a.id) return;
    try { ws.serializeAttachment({}); } catch (e) {}
    this.bc({ t: 'leave', id: a.id }, ws);
    try {
      if (a.du) { const ow = this.byId(a.du.o); if (ow) await this.endDuel(ow, null); }
      if (a.tr) await this.tradeCancel(a.tr, 'Karşı taraf ayrıldı, takas iptal.');
      if (a.pi) { this.setA(ws, x => { x.pi = a.pi; }); await this.partyLeave(ws); try { ws.serializeAttachment({}); } catch (e) {} }
      await this.notifyFriends(a.pk);
      if (a.cg) await this.clanPush(a.cg);
    } catch (e) {}
  }
  webSocketError(ws) { return this.webSocketClose(ws); }
}
export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    const CORS = { 'access-control-allow-origin': '*', 'content-type': 'application/json' };
    if (u.pathname === '/worlds') {
      const out = [];
      for (let i = 1; i <= WORLDS; i++) { let n = 0; try { n = +(await (await env.WORLD.get(env.WORLD.idFromName('dunya-' + i)).fetch('https://w/count')).text()) || 0; } catch (e) {} out.push({ w: i, n, max: MAXP }); }
      return new Response(JSON.stringify(out), { headers: CORS });
    }
    if (u.pathname === '/adm') {
      const org = req.headers.get('origin') || '', okO = /^https:\/\/(www\.)?yaxestgames\.com$/.test(org) || /^http:\/\/localhost(:\d+)?$/.test(org);
      const H = { 'access-control-allow-origin': okO ? org : 'https://yaxestgames.com', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'POST, OPTIONS', 'vary': 'origin', 'content-type': 'application/json' };
      if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: H });
      if (req.method !== 'POST') return new Response('{"err":"POST"}', { status: 405, headers: H });
      let b; try { b = await req.json(); } catch (e) { return new Response('{"err":"json"}', { status: 400, headers: H }); }
      const pl = await verifyPl(b && b.tok); if (!isAdminPl(pl)) return new Response('{"err":"yetki yok"}', { status: 403, headers: H });
      const D = i => env.WORLD.get(env.WORLD.idFromName('dunya-' + i));
      const live = async l => { let n = 0; for (let i = 1; i <= WORLDS; i++) { try { n += +(await (await D(i).fetch('https://w/live', { method: 'POST', body: JSON.stringify(l) })).text()) || 0; } catch (e) {} } return n; };
      const who = async () => { const out = []; for (let i = 1; i <= WORLDS; i++) { try { out.push(...await (await D(i).fetch('https://w/who')).json()); } catch (e) {} } return out; };
      if (b.op === 'online') return new Response(JSON.stringify({ list: await who() }), { headers: H });
      const r = await (await D(1).fetch('https://w/admop', { method: 'POST', body: JSON.stringify({ ...b, tok: undefined, by: pl.email }) })).json();
      if (r.live) { r.sent = await live(r.live); delete r.live; }
      if (b.op === 'find') { const on = (await who()).filter(x => x.pk === r.pk)[0]; r.on = on || null; }
      return new Response(JSON.stringify(r), { headers: H });
    }
    if (u.pathname === '/ws') { const w = Math.floor(+u.searchParams.get('w')) || 1; if (w < 1 || w > WORLDS) return new Response('bad world', { status: 400 }); const rq = new Request(req); rq.headers.set('x-world', String(w)); return env.WORLD.get(env.WORLD.idFromName('dunya-' + w)).fetch(rq); }
    return new Response('Yaxest Diyarı sunucusu çalışıyor.', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
};
