/* Yaxest Diyarı — çok oyunculu dünya (Cloudflare Workers + Durable Object, ücretsiz plan).
   WebSocket Hibernation API: boştayken süre ücreti yok, gelen mesajlar 20:1 sayılır.
   Giriş: Firebase ID token imzası (Google JWKS) sunucuda doğrulanır. Oyuncunun herkese açık kimliği uid değil, uid'den türeyen kısa "pk"dır.
   Sosyal katman: arkadaş, DM, parti, takas, düello, klan, emote, dünya çanı. Kalıcı veri DO depolamasında (SQLite). */
const PROJECT = 'yaxest-games';
const JWKS = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const MAXP = 60, WORLD_PX = 200 * 48, MAX_SPEED = 900;
const BAD = ['amk','aq','orospu','piç','sik','yarrak','ibne','göt','oç','mal','salak','gerizekal','fuck','shit','bitch','nigg'];
const TTL = { pt: 60e3, tr: 60e3, du: 60e3 }, WEEK = 7 * 864e5;
const KINDS = ['fr', 'pt', 'tr', 'du', 'cl', 'gf'];
const WAGERS = [0, 100, 500, 1000, 5000];
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
  if (it && typeof it === 'object') for (const k of Object.keys(it)) { if (n >= 6) break; if (!/^[mrw]:[\w:]{1,24}$/.test(k)) continue; const q = int(it[k], 0, 99999); if (q > 0) { o.it[k] = k[0] === 'w' ? 1 : q; n++; } }
  return o;
};

export class World {
  constructor(state, env) { this.state = state; this.env = env; }
  async fetch(req) {
    if (req.headers.get('Upgrade') !== 'websocket') return new Response('Yaxest world', { status: 426 });
    if (this.state.getWebSockets().length >= MAXP) return new Response('full', { status: 503 });
    const [c, s] = Object.values(new WebSocketPair());
    this.state.acceptWebSocket(s); s.serializeAttachment({});
    return new Response(null, { status: 101, webSocket: c });
  }
  /* ---- yardımcılar ---- */
  A(w) { try { return w.deserializeAttachment() || {}; } catch (e) { return {}; } }
  all() { return this.state.getWebSockets(); }
  byId(id) { if (!id) return null; for (const w of this.all()) if (this.A(w).id === id) return w; return null; }
  byPk(pk) { if (!pk) return null; for (const w of this.all()) { const a = this.A(w); if (a.id && a.pk === pk) return w; } return null; }
  snd(w, o) { try { w.send(JSON.stringify(o)); } catch (e) {} }
  err(w, m) { this.snd(w, { t: 'sys', m }); }
  bc(o, except) { const t = JSON.stringify(o); for (const w of this.all()) { if (w === except) continue; if (this.A(w).id) try { w.send(t); } catch (e) {} } }
  async g(k, d) { const v = await this.state.storage.get(k); return v === undefined ? d : v; }
  async s(k, v) { await this.state.storage.put(k, v); }
  async prof(pk) { const p = await this.g('u:' + pk, null); return p || { n: '', fr: {}, in: [], un: {}, cl: null, w: 0, l: 0, bl: [], gs: 0, gd: 0 }; }
  saveP(pk, p) { return this.s('u:' + pk, p); }
  fresh(r, now) { return now - r.t < (TTL[r.k] || WEEK); }
  setA(w, f) { const a = this.A(w); f(a); try { w.serializeAttachment(a); } catch (e) {} return a; }

  /* ---- giriş ---- */
  async hi(ws, m, now) {
    if (this.A(ws).id) return;
    const uid = await verify(m.tok);
    if (!uid) { this.snd(ws, { t: 'err', m: 'auth' }); ws.close(1008, 'auth'); return; }
    const pk = await pkOf(uid);
    for (const o of this.all()) { if (o !== ws && this.A(o).pk === pk) { this.snd(o, { t: 'dup' }); this.bc({ t: 'leave', id: this.A(o).id }, o); try { o.serializeAttachment({}); o.close(1000, 'dup'); } catch (e) {} } }
    const nick = clean(m.nick, 16) || 'Oyuncu';
    let ap = ''; try { ap = JSON.stringify(m.ap) || ''; } catch (e) {} if (ap.length > 500) ap = '';
    const p = await this.prof(pk); p.n = nick; let cg = '';
    if (p.cl) { const C = await this.g('c:' + p.cl, null); if (C && C.mem[pk]) { cg = p.cl; C.mem[pk].n = nick; await this.s('c:' + p.cl, C); } else p.cl = null; }
    await this.saveP(pk, p); await this.s('nk:' + nick.toLocaleLowerCase('tr'), pk);
    const a = { id: rid(8), pk, nick, ap: ap ? JSON.parse(ap) : null, lv: int(m.lv, 1, 99), x: num(m.x, 0, WORLD_PX), y: num(m.y, 0, WORLD_PX), pt: now, ct: 0, cg, w: p.w, l: p.l };
    ws.serializeAttachment(a);
    const roster = this.all().map(w => this.A(w)).filter(x => x.id && x.id !== a.id).map(pub);
    this.snd(ws, { t: 'hi', id: a.id, k: pk, roster });
    this.bc({ t: 'join', p: pub(a) }, ws);
    await this.fl(ws); await this.notifyFriends(pk);
    if (cg) await this.clanPush(cg);
  }
  async webSocketMessage(ws, msg) {
    if (typeof msg !== 'string' || msg.length > 5000) return;
    let m; try { m = JSON.parse(msg); } catch (e) { return; }
    if (!m || typeof m !== 'object') return;
    if (m.t !== 'hi' && msg.length > 900) return;
    const now = Date.now();
    if (m.t === 'hi') return this.hi(ws, m, now);
    const a = this.A(ws); if (!a.id) return;
    if (m.t !== 'p' && now - (a.la || 0) < 90) return;
    if (m.t !== 'p') { a.la = now; ws.serializeAttachment(a); }
    try { await this.route(ws, this.A(ws), m, now); } catch (e) {}
  }
  async route(ws, a, m, now) {
    switch (m.t) {
      case 'p': return this.pos(ws, a, m, now);
      case 'c': return this.chat(ws, a, m, now);
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
      case 'dh': return this.dh(ws, a, now);
      case 'dq': { if (!a.du) return; const ow = this.byId(a.du.o); return this.endDuel(ow, ws); }
      case 'to': case 'tl': case 'tc': case 'tx': return this.tradeAct(ws, a, m);
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
    if (d / (dt / 1000) > MAX_SPEED && d > 120) { this.snd(ws, { t: 'snap', x: a.x, y: a.y }); return; }
    a.x = x; a.y = y; a.pt = now; a.lv = num(m.lv, 1, 99) || a.lv;
    if (m.ap) { try { const s = JSON.stringify(m.ap); if (s.length <= 500) a.ap = JSON.parse(s); } catch (e) {} }
    ws.serializeAttachment(a);
    this.bc({ t: 'p', id: a.id, x: Math.round(x), y: Math.round(y), f: m.f ? 1 : 0, lv: a.lv }, ws);
    if (a.du && now - a.du.t0 > 180e3) { const ow = this.byId(a.du.o); await this.endDuel(null, null, ws, ow); }
  }
  /* ---- sohbet ---- */
  async chat(ws, a, m, now) {
    if (now - a.ct < 1500) return this.err(ws, 'Çok hızlı yazıyorsun.');
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
  async dh(ws, a, now) {
    const d = a.du; if (!d) return; const ow = this.byId(d.o); if (!ow) return this.endDuel(ws, null);
    const b = this.A(ow); if (!b.du || b.du.o !== a.id) return;
    if (now - d.ct < 450) return;
    if (Math.hypot(a.x - b.x, a.y - b.y) > 240) return this.err(ws, 'Rakip menzil dışında.');
    const crit = Math.random() < .12, dmg = Math.round((16 + Math.min(a.lv, 40) * .6) * (.85 + Math.random() * .3) * (crit ? 1.6 : 1));
    d.ct = now; this.setA(ws, x => { x.du = d; });
    b.du.hp = Math.max(0, b.du.hp - dmg); this.setA(ow, x => { x.du = b.du; });
    const o = { t: 'dh', f: a.id, to: b.id, d: dmg, c: crit ? 1 : 0, hp: b.du.hp }; this.snd(ws, o); this.snd(ow, o);
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
  /* ---- takas ---- */
  async startTrade(w1, w2) {
    const a1 = this.A(w1), a2 = this.A(w2), tid = rid(6);
    const T = { a: { id: a1.id, n: a1.nick, g: 0, it: {}, lk: 0, ok: 0 }, b: { id: a2.id, n: a2.nick, g: 0, it: {}, lk: 0, ok: 0 } };
    this.setA(w1, x => { x.tr = tid; }); this.setA(w2, x => { x.tr = tid; }); await this.s('tr:' + tid, T); this.tpush(T);
  }
  tpush(T) { for (const s of ['a', 'b']) { const w = this.byId(T[s].id); if (w) this.snd(w, { t: 'ts', me: s, a: T.a, b: T.b }); } }
  async tradeCancel(tid, why) {
    const T = await this.g('tr:' + tid, null); if (!T) return;
    for (const s of ['a', 'b']) { const w = this.byId(T[s].id); if (w) { this.setA(w, x => { x.tr = null; }); this.snd(w, { t: 'tx', m: why || 'Takas iptal edildi.' }); } }
    await this.state.storage.delete('tr:' + tid);
  }
  async tradeAct(ws, a, m) {
    if (!a.tr) return; if (m.t === 'tx') return this.tradeCancel(a.tr, 'Takas iptal edildi.');
    const T = await this.g('tr:' + a.tr, null); if (!T) return; const s = T.a.id === a.id ? 'a' : 'b', o = s === 'a' ? 'b' : 'a';
    if (m.t === 'to') { const c = cleanOffer(m.g, m.it); T[s].g = c.g; T[s].it = c.it; T.a.lk = T.b.lk = T.a.ok = T.b.ok = 0; }
    else if (m.t === 'tl') { T[s].lk = T[s].lk ? 0 : 1; T.a.ok = T.b.ok = 0; }
    else if (m.t === 'tc') {
      if (!(T.a.lk && T.b.lk)) return; T[s].ok = 1;
      if (T.a.ok && T.b.ok) {
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
    if (!left.length) { await this.state.storage.delete('c:' + tag); const ix = await this.g('cidx', {}); delete ix[tag]; await this.s('cidx', ix); return; }
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
    const q = k[0] === 'w' ? 1 : int(m.q, 1, 999), C = await this.g('c:' + a.cg, null); if (!C || !C.mem[a.pk]) return; C.dep = C.dep || {};
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
    if (u.pathname === '/ws') return env.WORLD.get(env.WORLD.idFromName('dunya-1')).fetch(req);
    return new Response('Yaxest Diyarı sunucusu çalışıyor.', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
};
