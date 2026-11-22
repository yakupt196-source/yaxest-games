/* Yaxest Diyarı: Alet Çubuğu ve İksirler (window.YHB)
   Minecraft tarzı alt çubuk: 1 Silah · 2 Balta · 3 Kazma · 4 Olta · 5-7 iksir yuvaları.
   - Ağaç için balta, maden için kazma, balık için olta elde olmalı. "Akıllı el" açıkken (varsayılan) doğru alet kendiliğinden seçilir.
   - Alet eldeyken saldırı zayıftır (%40); Akıllı el saldırıda silaha geçer. Aletle toplama %15 hızlı.
   - 8 iksir (Y.MATS içinde pt_*): can, yenilenme, dayanıklılık, güç, taş deri, hız, dönüş. Canavarlardan düşer, Şifacı Nine satar,
     m:pt_* anahtarıyla takas/Oyuncu Pazarı/Tüccar'da çalışır (MATS olduğu için ek sunucu değişikliği yok).
   - Malikâne'de Simya: bahçe ürünlerinden iksir yap.
   Kayıt: P.hb={s:seçili 0-3, p:[3 iksir yuvası], a:akıllı el 0/1}, aktif etkiler G.pfx (oturumluk). */
(function(){
'use strict';
var D=null;
var POT={
 pt_s:{n:'Küçük Can İksiri',c:'#ff5b6e',heal:.30,v:18,cd:3,d:'Canın %30\'unu doldurur'},
 pt_m:{n:'Can İksiri',c:'#ff2e4d',heal:.55,v:55,cd:3,d:'Canın %55\'ini doldurur'},
 pt_b:{n:'Büyük Can İksiri',c:'#c8102e',heal:1,v:160,cd:3,d:'Canı tamamen doldurur'},
 pt_r:{n:'Yenilenme İksiri',c:'#ff8ac8',fx:'regen',dur:15,v:70,cd:1,d:'15 sn boyunca saniyede %5 can'},
 pt_st:{n:'Dayanıklılık İksiri',c:'#ffd23f',fx:'sta',dur:25,v:45,cd:1,d:'Dayanıklılık dolar, 25 sn tükenmez'},
 pt_g:{n:'Güç İksiri',c:'#ff8c1a',fx:'atk',dur:60,v:120,cd:1,d:'60 sn hasar +%18'},
 pt_d:{n:'Taş Deri İksiri',c:'#9aa8c8',fx:'red',dur:45,v:120,cd:1,d:'45 sn alınan hasar -%20'},
 pt_h:{n:'Rüzgâr İksiri',c:'#5be3c8',fx:'spd',dur:40,v:90,cd:1,d:'40 sn hız +%25'},
 pt_x:{n:'Dönüş Parşömeni',c:'#b57bff',back:1,v:100,cd:5,d:'Kasabaya ışınlar (3 sn hazırlık)'}
};
var PORD=['pt_s','pt_m','pt_b','pt_r','pt_st','pt_g','pt_d','pt_h','pt_x'];
var TOOLC=['#8d8d8d','#c87533','#aab4c2','#e3e8f2','#ffd23f','#7be0ff','#cfd8ea'];
var SLOTS=[{k:'w',n:'Silah'},{k:'ax',n:'Balta'},{k:'pk',n:'Kazma'},{k:'rod',n:'Olta'}];
function P(){return D&&D.P}function G(){return D&&D.G}
function st(){var p=P();if(!p)return null;var h=p.hb;if(!h||typeof h!=='object')h=p.hb={};if(!(h.s>=0&&h.s<=3))h.s=0;if(!Array.isArray(h.p)||h.p.length!==3)h.p=['pt_s','pt_m','pt_r'];if(h.a==null)h.a=1;return h}
function sel(){var h=st();return h?h.s:0}
function held(){var s=sel(),p=P();if(!s||!p)return null;var k=SLOTS[s].k;return{k:k,t:k==='rod'?((p.fl&&p.fl.l)||1)>=10?4:((p.fl&&p.fl.l)||1)>=5?2:0:((p.tl&&p.tl[k])||0)}}
function setSel(i,quiet){var h=st();if(!h||i===h.s)return;h.s=i;draw();if(!quiet&&D.floatTxt&&G())D.floatTxt(G().px,G().py-60,SLOTS[i].n,'#ffd23f')}
/* ---------- iksirler ---------- */
var cdT={};
function drink(k){var p=P(),g=G(),o=POT[k];if(!p||!g||!o)return;if(g.dead>0)return;if(!(p[k]>0)){D.say(o.n+' yok. Şifacı Nine satıyor; canavarlardan da düşer.','sys');return}
  var grp=o.heal?'heal':k,nw=g.t||0;if(cdT[grp]&&cdT[grp]>nw){return}
  var st2=D.S();if(o.heal&&g.hp>=st2.maxhp-1){D.say('Canın zaten dolu','sys');return}
  p[k]--;cdT[grp]=nw+o.cd;
  if(o.heal){var add=Math.round(st2.maxhp*o.heal);g.hp=Math.min(st2.maxhp,g.hp+add);D.floatTxt(g.px,g.py-50,'+'+add,'#5be39a');if(window.YF)try{YF.burst(g.px,g.py-20,o.c,14)}catch(e){}}
  else if(o.back){g.pfx=g.pfx||{};g.pfx.back=nw+3;D.say('Dönüş parşömeni okunuyor… 3 sn kıpırdama','sys')}
  else{g.pfx=g.pfx||{};g.pfx[o.fx]=nw+o.dur;if(o.fx==='sta'){g.sta=100;g.exh=0}D.floatTxt(g.px,g.py-50,o.n,o.c)}
  if(window.YSnd)try{YSnd.play('drink')}catch(e){}D.saveNow();draw()}
function fxOn(k){var g=G();return g&&g.pfx&&g.pfx[k]&&g.pfx[k]>(g.t||0)}
function tick(dt){var g=G(),p=P();if(!g||!p)return;var t=g.t||0;
  if(fxOn('regen')){var s=D.S();g.hp=Math.min(s.maxhp,g.hp+s.maxhp*.05*dt)}
  if(fxOn('sta')){g.sta=100;g.exh=0}
  if(g.pfx&&g.pfx.back){if(g.jx||g.jy||g.keys&&(g.keys.u||g.keys.d||g.keys.l||g.keys.r)){g.pfx.back=0;D.say('Dönüş bozuldu (hareket ettin)','sys')}else if(t>=g.pfx.back){g.pfx.back=0;if(g.mode==='world'){var Y=D.Y;g.px=Y.CX*Y.TS;g.py=(Y.CY+1.5)*Y.TS;(g.comp||[]).forEach(function(c){c.x=g.px;c.y=g.py});D.say('Kasabaya döndün','sys')}}}
  /* düşük can uyarısı: iksir yuvası nabız atar */
  var s2=D.S(),low=g.hp<s2.maxhp*.3;if(EL&&EL._low!==low){EL._low=low;EL.classList.toggle('low',low)}
  if(t-(tick._d||0)>.5){tick._d=t;fxDraw();draw()}}
function mods(){var o={atk:0,red:0,spd:0,tool:1};var h=held();if(h)o.tool=.4;if(fxOn('atk'))o.atk+=.18;if(fxOn('red'))o.red+=.2;if(fxOn('spd'))o.spd+=.25;return o}
/* düşürme: seviyeye göre iksir boyu; boss/elit daha çok */
function drop(m){var p=P();if(!p||!m)return;var boss=m.boss||m.elite||m.el,ch=boss?.55:.07;if(Math.random()>ch)return;var lv=m.lv||1,r=Math.random(),k;
  if(boss)k=r<.35?'pt_b':r<.6?'pt_m':PORD[3+Math.floor(Math.random()*5)];else k=lv<12?(r<.75?'pt_s':r<.9?'pt_st':'pt_r'):lv<40?(r<.55?'pt_m':r<.7?'pt_s':PORD[3+Math.floor(Math.random()*5)]):(r<.45?'pt_m':r<.65?'pt_b':PORD[3+Math.floor(Math.random()*6)]);
  p[k]=(p[k]||0)+1;if(D.floatTxt)D.floatTxt(m.x,m.y-(m.sz||20)-46,'⚗ '+POT[k].n,POT[k].c);draw()}
/* ---------- alet kuralları ---------- */
function need(kind){var h=st();if(!h)return true;var want=kind==='ax'?1:kind==='pk'?2:3;if(h.s===want)return true;
  if(h.a){setSel(want);return true}D.say(SLOTS[want].n+' seç ('+(want+1)+' tuşu ya da alttaki çubuk)','sys');pulse(want);return false}
function atk(){var h=st();if(!h||h.s===0)return true;if(h.a){setSel(0,true);return true}return true}
function canCast(){var h=st();if(!h||h.s===0)return true;if(h.a){setSel(0,true);return true}D.say('Yetenekler için silahını seç (1)','sys');pulse(0);return false}
function swing(sw){var g=G(),h=held();if(g&&g.gather&&h&&h.k!=='rod'){var ph=((g.t||0)*2.2)%1;return .95-1.9*Math.min(1,ph*1.6)}return sw}
/* ---------- arayüz ---------- */
var EL=null,FX=null;
function potSvg(c,big){var s=big?34:26;return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24"><path d="M9.5 3h5v2.5l-.8.8v2.4c2.9 1 4.8 3.6 4.8 6.6 0 3.9-3.1 6.7-6.5 6.7S5.5 19.2 5.5 15.3c0-3 1.9-5.6 4.8-6.6V6.3l-.8-.8z" fill="#1b1530" fill-opacity=".55" stroke="#e9e4ff" stroke-width="1.2"/><path d="M7 14.6c1.6-.9 3.3.6 5 0s3.4-1.3 5 0c.2 3-2 5.6-5 5.6s-5.2-2.6-5-5.6z" fill="'+c+'"/><circle cx="10" cy="16" r="1" fill="#fff" fill-opacity=".7"/><rect x="9" y="2" width="6" height="2" rx=".8" fill="#a8743f"/></svg>'}
function toolSvg(k,c){if(k==='w')return '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="2" stroke-linecap="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6M16 16l4 4M19 21l2-2"/></svg>';
  if(k==='ax')return '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 21L17 7" stroke="#a8743f" stroke-width="2.6" stroke-linecap="round"/><path d="M13 4.5l6 6c1.5-1.8 1.8-4.6.2-6.3S14.8 3 13 4.5z" fill="'+c+'" stroke="#1b1530" stroke-width="1"/></svg>';
  if(k==='pk')return '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M6 20L17 8" stroke="#a8743f" stroke-width="2.6" stroke-linecap="round"/><path d="M8 5c4-2 9-1 12 3-3-1.6-6-2.2-9-1.4z" fill="'+c+'" stroke="#1b1530" stroke-width="1"/><path d="M8 5c-1.3 3.3-.6 6.2 1.5 8.4" stroke="'+c+'" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
  return '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M4 21L19 4" stroke="#a8743f" stroke-width="2.2" stroke-linecap="round"/><path d="M19 4v12" stroke="#e9e4ff" stroke-width="1"/><circle cx="19" cy="17.5" r="1.8" fill="#ff5b6e"/><circle cx="8" cy="17" r="2.2" stroke="'+c+'" stroke-width="1.6"/></svg>'}
function css(){if(document.getElementById('yhb-css'))return;var s=document.createElement('style');s.id='yhb-css';s.textContent=
 '#yhb{position:fixed;left:50%;bottom:max(6px,env(safe-area-inset-bottom));transform:translateX(-50%);display:none;gap:4px;padding:4px;border-radius:14px;background:rgba(14,10,32,.78);border:1px solid rgba(255,255,255,.14);box-shadow:0 6px 18px rgba(0,0,0,.45);z-index:4;pointer-events:auto}'+
 '#yhb.on{display:flex}#yhb .s{position:relative;width:48px;height:48px;border-radius:10px;border:2px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);display:grid;place-items:center;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}'+
 '#yhb .s.on{border-color:#ffd23f;background:rgba(255,210,63,.16);box-shadow:0 0 0 2px rgba(255,210,63,.25)}#yhb .s.sep{margin-left:8px}#yhb .s .n{position:absolute;right:3px;bottom:1px;font:800 .72rem "Chakra Petch",sans-serif;color:#fff;text-shadow:0 1px 2px #000}'+
 '#yhb .s .kc{position:absolute;left:3px;top:1px;font:700 .6rem "Chakra Petch",sans-serif;color:rgba(255,255,255,.55)}#yhb .s.zero{opacity:.38}#yhb .s.pl{animation:yhbp .5s ease-out 2}@keyframes yhbp{50%{transform:scale(1.15);border-color:#ffd23f}}'+
 '#yhb.low .s.pot:not(.zero){animation:yhbl 1s ease-in-out infinite}@keyframes yhbl{50%{box-shadow:0 0 0 3px rgba(255,70,90,.7);border-color:#ff5b6e}}#yhb .s .cdv{position:absolute;inset:0;border-radius:8px;background:rgba(8,6,22,.65);display:none}'+
 '#yhbfx{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(max(6px,env(safe-area-inset-bottom)) + 62px);display:flex;gap:4px;z-index:4;pointer-events:none}#yhbfx span{padding:2px 7px;border-radius:9px;background:rgba(14,10,32,.8);font:700 .68rem "Chakra Petch",sans-serif;color:#fff;border:1px solid currentColor}'+
 '@media (max-height:430px){#yhb .s{width:40px;height:40px}#yhb .s svg{transform:scale(.85)}#yhbfx{bottom:52px}}'+
 '@media (pointer:coarse){#yhb .s .kc{display:none}}';document.head.appendChild(s)}
function mk(){if(EL&&EL.isConnected)return EL;css();EL=document.createElement('div');var host=document.getElementById('hud')||document.body;EL.id='yhb';host.appendChild(EL);FX=document.createElement('div');FX.id='yhbfx';host.appendChild(FX);return EL}
var hold={i:-1,t:0};
function draw(){var p=P(),h=st();if(!p||!h||!G()){if(EL)EL.classList.remove('on');return}mk();EL.classList.toggle('on',G().mode==='world'||G().mode==='dungeon');
  var html='';SLOTS.forEach(function(s,i){var c=i===0?(D.Y.CLASSES[p.cls]&&D.Y.CLASSES[p.cls].col||'#ffd23f'):i===3?'#7be0ff':TOOLC[(p.tl&&p.tl[s.k])||0];
    html+='<button type="button" class="s'+(h.s===i?' on':'')+'" data-i="'+i+'" aria-label="'+s.n+'" title="'+s.n+'"><span class="kc">'+(i+1)+'</span>'+toolSvg(s.k,c)+'</button>'});
  h.p.forEach(function(k,j){var o=POT[k],n=p[k]||0;html+='<button type="button" class="s pot'+(j===0?' sep':'')+(n?'':' zero')+'" data-p="'+j+'" aria-label="'+o.n+'" title="'+o.n+' (basılı tut: değiştir)"><span class="kc">'+(j+5)+'</span>'+potSvg(o.c)+'<span class="n">'+n+'</span></button>'});
  if(EL._h!==html){EL._h=html;EL.innerHTML=html;EL.querySelectorAll('[data-i]').forEach(function(b){b.onclick=function(e){e.stopPropagation();setSel(+b.getAttribute('data-i'))}});
    EL.querySelectorAll('[data-p]').forEach(function(b){var j=+b.getAttribute('data-p'),tm=0,lp=false;
      b.onpointerdown=function(){lp=false;tm=setTimeout(function(){lp=true;cycle(j)},450)};b.onpointerup=b.onpointerleave=function(){clearTimeout(tm)};
      b.onclick=function(e){e.stopPropagation();if(lp)return;drink(st().p[j])};b.oncontextmenu=function(e){e.preventDefault();cycle(j)}})}}
function cycle(j){var p=P(),h=st(),cur=PORD.indexOf(h.p[j]);for(var n=1;n<=PORD.length;n++){var k=PORD[(cur+n)%PORD.length];if(h.p.indexOf(k)<0&&(p[k]>0||n===PORD.length)){h.p[j]=k;break}}EL&&(EL._h='');draw();D.say('Yuva '+(j+5)+': '+POT[h.p[j]].n,'sys')}
function pulse(i){if(!EL)return;var b=EL.querySelector('[data-i="'+i+'"]');if(b){b.classList.remove('pl');void b.offsetWidth;b.classList.add('pl')}}
function fxDraw(){if(!FX)return;var g=G(),t=g&&g.t||0,h='';if(g&&g.pfx)Object.keys(g.pfx).forEach(function(k){var u=g.pfx[k];if(u>t){var nm={regen:['Yenilenme','#ff8ac8'],sta:['Dayanıklılık','#ffd23f'],atk:['Güç','#ff8c1a'],red:['Taş Deri','#9aa8c8'],spd:['Rüzgâr','#5be3c8'],back:['Dönüş','#b57bff']}[k];if(nm)h+='<span style="color:'+nm[1]+'">'+nm[0]+' '+Math.ceil(u-t)+'</span>'}});if(FX._h!==h){FX._h=h;FX.innerHTML=h}}
function key(n){if(n>=1&&n<=4){setSel(n-1);return true}if(n>=5&&n<=7){drink(st().p[n-5]);return true}return false}
function wheel(d){var h=st();if(!h)return;setSel((h.s+(d>0?1:3))%4)}
/* ---------- Şifacı Nine iksir tezgâhı ---------- */
function shop(){var p=P();if(!p)return;D.openPan('p-npc');var tt=document.getElementById('npt');if(tt)tt.innerHTML='🌿 Şifacı Nine · İksirler';render()}
function price(k){return Math.round(POT[k].v*2.2)}
function render(){var p=P(),el=document.getElementById('npc');if(!el)return;var h='<p style="margin:0 0 8px"><small>"Evladım, yola iksirsiz çıkma." İksirler alttaki çubukta 5-7. yuvalarda durur; yuvaya basılı tutarak hangi iksirin duracağını seçersin. Takasta ve Oyuncu Pazarı\'nda da satılır.</small></p>';
  PORD.forEach(function(k){var o=POT[k],n=p[k]||0,pr=price(k);h+='<div class="it" style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.08)">'+potSvg(o.c,true)+'<div class="t" style="flex:1;min-width:0"><b>'+o.n+'</b> <small>(sende '+n+')</small><br><small>'+o.d+'</small></div>'+
    '<button class="btn" type="button" data-buy="'+k+'" '+(p.gold<pr?'disabled':'')+' style="padding:6px 10px">🪙 '+pr+'</button><button class="btn alt" type="button" data-buy5="'+k+'" '+(p.gold<pr*5?'disabled':'')+' style="padding:6px 10px">×5</button></div>'});
  h+='<p><small>Can iksirleri canavarlardan da düşer (boss ve elitlerden daha sık). Malikâne\'nin Simya sekmesinde bahçe ürünlerinden kendin yapabilirsin.</small></p><div class="row"><button class="btn alt" data-close type="button">Kapat</button></div>';
  el.innerHTML=h;el.querySelectorAll('[data-buy],[data-buy5]').forEach(function(b){b.onclick=function(){var k=b.getAttribute('data-buy')||b.getAttribute('data-buy5'),q=b.hasAttribute('data-buy5')?5:1,pr=price(k)*q;if(p.gold<pr)return;p.gold-=pr;p[k]=(p[k]||0)+q;D.saveNow();D.say(q+'× '+POT[k].n+' alındı','sys');draw();render()}});
  el.querySelectorAll('[data-close]').forEach(function(b){b.onclick=D.closePan})}
/* ---------- Simya (Malikâne) tarifleri ---------- */
var BREW={pt_s:{bugday:2,cilek:1},pt_m:{cilek:2,domates:2},pt_b:{kabak:1,cilek:3},pt_r:{cilek:2,aycicek:1},pt_st:{havuc:3,bugday:2},pt_g:{biber:1,domates:1},pt_d:{misir:1,havuc:2},pt_h:{aycicek:2,havuc:1},pt_x:{misir:1,aycicek:1}};
function canBrew(k){var e=P()&&P().ev2,r=BREW[k];if(!e||!r)return false;for(var c in r)if(((e.cr||{})[c]||0)<r[c])return false;return true}
function brew(k){if(!canBrew(k))return;var e=P().ev2,r=BREW[k];for(var c in r)e.cr[c]-=r[c];P()[k]=(P()[k]||0)+2;D.saveNow();D.say('⚗ Simya: 2× '+POT[k].n,'sys');draw()}
function init(d){D=d;st();draw();if(!init._w){init._w=1;addEventListener('wheel',function(e){var g=G();if(!g||g.paused)return;if(e.target&&e.target.closest&&e.target.closest('.pan,.card,#log,#npc'))return;wheel(e.deltaY)},{passive:true})}}
function smart(v){var h=st();if(!h)return 1;if(v!=null){h.a=v?1:0;D.saveNow()}return h.a}
window.YHB={smart:smart,init:init,draw:draw,tick:tick,mods:mods,held:held,sel:sel,setSel:setSel,need:need,atk:atk,canCast:canCast,swing:swing,drop:drop,drink:drink,key:key,shop:shop,POT:POT,PORD:PORD,BREW:BREW,canBrew:canBrew,brew:brew,potSvg:potSvg,toolArt:null};
})();
