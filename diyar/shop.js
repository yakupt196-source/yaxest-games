/* Yaxest Diyarı · Oyun içi Mağaza (YSH)
   Lobiden ve oyunun içinden açılır, siteye atmaz. Para birimleri:
     🪙 Altın   : oyunda kazanılır (canavar, görev, satış)
     💎 Elmas   : premium para. Ücretsiz: günlük 5 elmas + seviye atlayınca 2 elmas. Gerçek parayla: Google Play Faturalandırma
                  bağlanınca (YPAY) elmas paketleri; o zamana kadar paketler "Yakında" görünür.
     🎫 Jeton   : Yaxest Games sitesindeki oyunlardan kazanılır, karakter alınır.
   Sekmeler: Öne Çıkan (günün fırsatları, başlangıç paketi), Sandıklar, Rünler, Silahlar, Karakterler, Elmas. */
(function(){
var E=null,tab='hot';
function A(){return window.__lb}
function P(){return A()&&A().P()}
function Y(){return window.YD}
function save(){try{A().save()}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function fmt(n){n=Math.round(n||0);return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e4?Math.round(n/1e3)+'B':String(n)}
function gem(){var p=P();return p?(p.gem|0):0}
function jet(){try{return YX.coins()}catch(e){return 0}}
function today(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function seed(n){var d=new Date(),x=Math.sin((d.getFullYear()*372+d.getMonth()*31+d.getDate())*97+n*131)*10000;return x-Math.floor(x)}
function toast(t){var a=A();try{if(window.__yd&&__yd.say&&__yd.G)__yd.say(t,'sys')}catch(e){}var d=document.createElement('div');d.className='ysh-toast';d.textContent=t;(E||document.body).appendChild(d);setTimeout(function(){d.remove()},2400)}
/* ---------- ödül üretimi ---------- */
var RAR=['Sıradan','Seçkin','Nadir','Destansı','Efsanevi'],RCOL=['#c9ced9','#7be07b','#5cb0ff','#c07cff','#ffb02e'];
function rune(r){var R=window.YR&&YR.R;if(!R)return null;var pool=Object.keys(R).filter(function(k){return R[k].r===r});if(!pool.length)return null;var id=pool[Math.floor(Math.random()*pool.length)],p=P();p.rn=p.rn||{};p.rn[id]=(p.rn[id]||0)+1;var nm=R[id].n;return{ic:'🔮',n:/rün/i.test(nm)?nm:nm+' rünü',r:r}}
function gold(n){var p=P();p.gold=(p.gold||0)+n;return{ic:'🪙',n:fmt(n)+' altın',r:n>=20000?3:n>=5000?2:n>=1500?1:0}}
function pot(k,n){var p=P(),m=Y()&&Y().MATS[k];if(!m)return null;p[k]=(p[k]||0)+n;return{ic:m.ic||'⚗️',n:n+' × '+m.n,r:1}}
function gems(n){var p=P();p.gem=(p.gem|0)+n;return{ic:'💎',n:n+' elmas',r:n>=100?4:n>=30?3:2}}
function pick(w){var s=0,i;for(i=0;i<w.length;i++)s+=w[i];var x=Math.random()*s;for(i=0;i<w.length;i++){x-=w[i];if(x<=0)return i}return w.length-1}
var CHESTS={
 bronz:{n:'Bronz Sandık',ic:'📦',col:'#c88a4a',cur:'gold',p:2500,d:'Altın, iksir ve Sıradan/Seçkin rün',roll:function(){return[gold(800+Math.floor(Math.random()*1700)),pot('pt_m',2+Math.floor(Math.random()*3)),rune(pick([70,30]))]}},
 gumus:{n:'Gümüş Sandık',ic:'🎁',col:'#c9d6e8',cur:'gem',p:60,d:'Seçkin–Destansı rün, bol altın, iksir',roll:function(){return[gold(3000+Math.floor(Math.random()*5000)),rune(1+pick([55,35,10])),pot('pt_b',2),Math.random()<.25?rune(1):null]}},
 altin:{n:'Altın Sandık',ic:'💠',col:'#ffd23f',cur:'gem',p:180,d:'2 rün (Nadir–Efsanevi), büyük altın, elmas iadesi şansı',roll:function(){return[gold(10000+Math.floor(Math.random()*15000)),rune(2+pick([60,30,10])),rune(2+pick([75,25])),pot('pt_x',1),Math.random()<.2?gems(40):null]}},
 efsane:{n:'Efsanevi Sandık',ic:'👑',col:'#ff9d3d',cur:'gem',p:450,d:'Kesin Destansı + %35 Efsanevi rün, dev altın, elmas iadesi',roll:function(){return[gold(30000+Math.floor(Math.random()*40000)),rune(3),rune(Math.random()<.35?4:3),rune(2+pick([50,50])),Math.random()<.3?gems(120):pot('pt_x',3)]}}};
var RUNEP=[{cur:'gold',p:800},{cur:'gold',p:3000},{cur:'gem',p:40},{cur:'gem',p:120},{cur:'gem',p:350}];
function wPrice(t){return Math.round(15+t*t*6)}
/* gerçek para: Google Play Faturalandırma (Digital Goods API) TWA içinde bağlanınca çalışır */
var PACKS=[{id:'gem_80',g:80,b:0,tl:'29,99'},{id:'gem_450',g:450,b:12,tl:'149,99',tag:'Popüler'},{id:'gem_1000',g:1000,b:25,tl:'299,99'},{id:'gem_2600',g:2600,b:40,tl:'699,99',tag:'En iyi değer'}];
function payReady(){return !!(window.YPAY&&YPAY.ready&&YPAY.ready())}
function realBuy(sku,done){if(!payReady()){toast('💳 Gerçek parayla alım, uygulama Google Play\'e çıkınca açılacak.');return}YPAY.buy(sku).then(function(ok){if(ok){done();save();draw()}}).catch(function(){})}
/* ---------- ödeme ---------- */
function canPay(cur,p){var pl=P();return cur==='gold'?(pl.gold||0)>=p:cur==='gem'?gem()>=p:jet()>=p}
function pay(cur,p){var pl=P();if(!canPay(cur,p)){toast(cur==='gem'?'💎 Yeterli elmas yok. Elmas sekmesine bak.':cur==='gold'?'🪙 Yeterli altın yok.':'🎫 Yeterli jeton yok.');if(cur==='gem'){tab='gem';draw()}return false}
  if(cur==='gold')pl.gold-=p;else if(cur==='gem')pl.gem-=p;else{try{if(!YX.spend(p))return false}catch(e){return false}}return true}
function curIc(c){return c==='gold'?'🪙':c==='gem'?'💎':'🎫'}
/* ---------- sandık açma gösterisi ---------- */
function openChest(k){var c=CHESTS[k],d=deal(k);var price=d?d.p:c.p;if(!pay(c.cur,price))return;var got=c.roll().filter(Boolean);save();
  var o=document.createElement('div');o.className='ysh-open';o.innerHTML='<div class="box" style="--c:'+c.col+'">'+c.ic+'</div><div class="rays"></div><div class="rw"></div><button class="ysh-btn" style="opacity:0">Harika!</button>';E.appendChild(o);
  setTimeout(function(){o.classList.add('pop');var rw=o.querySelector('.rw');got.forEach(function(g,i){var e=document.createElement('div');e.className='card';e.style.setProperty('--rc',RCOL[Math.min(4,g.r||0)]);e.style.animationDelay=(i*.18)+'s';e.innerHTML='<span>'+g.ic+'</span><b>'+esc(g.n)+'</b><small>'+RAR[Math.min(4,g.r||0)]+'</small>';rw.appendChild(e)});var b=o.querySelector('button');b.style.opacity=1;b.onclick=function(){o.remove();draw()};try{navigator.vibrate&&navigator.vibrate([20,30,60])}catch(e){}},900)}
/* ---------- günün fırsatları (her gün değişir, herkes için aynı) ---------- */
function deals(){var ks=['gumus','altin','efsane'],k=ks[Math.floor(seed(1)*3)],off=[20,30,40][Math.floor(seed(2)*3)],rr=2+Math.floor(seed(3)*2);
  return[{k:'chest',id:k,off:off,p:Math.round(CHESTS[k].p*(100-off)/100)},{k:'rune',r:rr,off:35,p:Math.round(RUNEP[rr].p*.65)},{k:'gold',g:25000+Math.floor(seed(4)*4)*5000,p:45}]}
function deal(k){var d=deals()[0];return d.id===k?d:null}
/* ---------- çizim ---------- */
var CSS='#yshop{position:fixed;inset:0;z-index:55;display:none;flex-direction:column;color:#f3e2bd;font-family:"Chakra Petch",sans-serif;background:radial-gradient(ellipse at 50% -20%,#3a2560,#120b24 55%,#07040f)}#yshop.on{display:flex}'+
'#yshop .hd{flex:none;display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) 6px calc(12px + env(safe-area-inset-left))}'+
'#yshop .hd h2{margin:0;flex:1;font-family:Cinzel,Georgia,serif;font-weight:900;font-size:1.25rem;background:linear-gradient(180deg,#fff3c4,#f2c35e 50%,#b07a22);-webkit-background-clip:text;background-clip:text;color:transparent}'+
'#yshop .bal{display:flex;gap:6px}#yshop .bal span{padding:5px 10px;border-radius:11px;border:1.5px solid rgba(217,164,65,.5);background:rgba(20,13,8,.75);font-weight:800;font-size:.84rem;white-space:nowrap}'+
'#yshop .x{width:40px;height:40px;border-radius:12px;border:1.5px solid rgba(217,164,65,.5);background:rgba(20,13,8,.75);color:#fff;font-size:1.1rem;cursor:pointer}'+
'#yshop .tabs{flex:none;display:flex;gap:6px;overflow-x:auto;padding:4px calc(12px + env(safe-area-inset-right)) 8px calc(12px + env(safe-area-inset-left));scrollbar-width:none}#yshop .tabs::-webkit-scrollbar{display:none}'+
'#yshop .tabs button{flex:none;padding:8px 13px;border-radius:12px;border:1.5px solid rgba(217,164,65,.35);background:linear-gradient(180deg,#3a2818,#1f150d);color:#e8d3aa;font:800 .84rem "Chakra Petch",sans-serif;cursor:pointer}'+
'#yshop .tabs button.on{background:linear-gradient(180deg,#ffe08a,#c98a26);color:#2a1608;border-color:#6b4314}'+
'#yshop .bd{flex:1;overflow:auto;padding:0 calc(12px + env(safe-area-inset-right)) calc(14px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left))}'+
'#yshop .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:10px}'+
'#yshop .it{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 10px 10px;border-radius:16px;text-align:center;border:1.5px solid transparent;background:linear-gradient(180deg,rgba(58,40,26,.95),rgba(26,17,10,.95)) padding-box,linear-gradient(135deg,var(--c,#d9a441),#5a3a12 60%,var(--c,#d9a441)) border-box;box-shadow:0 6px 16px rgba(0,0,0,.4)}'+
'#yshop .it .ic{font-size:2.3rem;line-height:1.1;filter:drop-shadow(0 4px 6px rgba(0,0,0,.6))}#yshop .it b{font-size:.92rem;color:#fff3d6}#yshop .it small{font-size:.72rem;color:#bfa987;min-height:2.2em}'+
'#yshop .it .wic{display:flex;justify-content:center;width:100%;padding:6px 0 2px;border-radius:12px;background:radial-gradient(ellipse at 50% 60%,color-mix(in srgb,var(--c) 28%,transparent),transparent 70%)}'+
'#yshop .it canvas{width:80px;height:100px;image-rendering:pixelated}'+
'#yshop .ysh-btn{margin-top:4px;width:100%;padding:9px 8px;border-radius:12px;border:1.5px solid #6b4314;background:linear-gradient(180deg,#ffe08a,#d39a32 55%,#a8701e);color:#2a1608;font:900 .9rem "Chakra Petch",sans-serif;cursor:pointer;box-shadow:0 3px 0 #5a3a12}'+
'#yshop .ysh-btn:active{transform:translateY(2px);box-shadow:0 1px 0 #5a3a12}#yshop .ysh-btn[disabled]{filter:grayscale(.7) brightness(.7);cursor:default}'+
'#yshop .ysh-btn.alt{background:linear-gradient(180deg,#4a3422,#2a1c12);color:#f3e2bd;border-color:#8a5a1c}'+
'#yshop .rib{position:absolute;top:8px;right:-4px;padding:2px 8px;border-radius:6px 0 0 6px;background:#ff5b6e;color:#fff;font:900 .7rem "Chakra Petch",sans-serif;box-shadow:0 2px 6px rgba(0,0,0,.4)}'+
'#yshop .old{text-decoration:line-through;opacity:.6;margin-right:4px;font-weight:600}'+
'#yshop .sec{margin:12px 2px 8px;font:900 .9rem Cinzel,Georgia,serif;color:#ffe2a0;letter-spacing:.04em}'+
'#yshop .ban{display:flex;align-items:center;gap:12px;padding:14px;border-radius:18px;margin-bottom:10px;border:2px solid transparent;background:linear-gradient(110deg,rgba(120,60,20,.95),rgba(50,20,60,.95)) padding-box,linear-gradient(135deg,#fbe39a,#c58b2e 30%,#7a4e17 50%,#e9bb57 75%,#8a5a1c) border-box}'+
'#yshop .ban .ic{font-size:2.6rem}#yshop .ban div{flex:1}#yshop .ban b{display:block;font-family:Cinzel,Georgia,serif;font-size:1.05rem;color:#ffe7a8}#yshop .ban small{color:#e8d3aa}'+
'.ysh-toast{position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:70;padding:9px 14px;border-radius:12px;background:rgba(20,13,8,.95);border:1.5px solid #d9a441;font:700 .86rem "Chakra Petch",sans-serif;color:#ffe7a8;max-width:90vw;text-align:center}'+
'.ysh-open{position:fixed;inset:0;z-index:65;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle,rgba(40,20,60,.9),rgba(5,3,10,.96))}'+
'.ysh-open .box{font-size:5rem;filter:drop-shadow(0 0 24px var(--c));animation:yshk .12s linear infinite}.ysh-open.pop .box{animation:yshb .5s ease-out forwards}'+
'.ysh-open .rays{position:absolute;width:520px;height:520px;max-width:120vw;max-height:120vw;background:conic-gradient(from 0deg,transparent,rgba(255,220,130,.25),transparent 12%,rgba(255,220,130,.2),transparent 25%,rgba(255,220,130,.25),transparent 38%,rgba(255,220,130,.2),transparent 50%);border-radius:50%;opacity:0;animation:yshr 6s linear infinite;pointer-events:none}.ysh-open.pop .rays{opacity:1;transition:opacity .4s}'+
'.ysh-open .rw{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:92vw;z-index:1}'+
'.ysh-open .card{width:120px;padding:12px 8px;border-radius:14px;text-align:center;border:2px solid var(--rc);background:rgba(20,13,8,.92);box-shadow:0 0 18px var(--rc);animation:yshc .5s cubic-bezier(.2,.9,.3,1.4) both;color:#fff3d6}'+
'.ysh-open .card span{font-size:2rem;display:block}.ysh-open .card b{display:block;font-size:.8rem;margin:4px 0 2px}.ysh-open .card small{color:var(--rc);font-weight:800;font-size:.72rem}'+
'.ysh-open .ysh-btn{width:auto!important;padding:10px 30px;z-index:1;border-radius:12px;border:1.5px solid #6b4314;background:linear-gradient(180deg,#ffe08a,#d39a32 55%,#a8701e);color:#2a1608;font:900 1rem "Chakra Petch",sans-serif;transition:opacity .3s}'+
'@keyframes yshk{0%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}100%{transform:rotate(-6deg)}}@keyframes yshb{0%{transform:scale(1)}40%{transform:scale(1.5)}100%{transform:scale(0);opacity:0;height:0}}@keyframes yshr{to{transform:rotate(360deg)}}@keyframes yshc{0%{transform:translateY(30px) scale(.6);opacity:0}100%{transform:none;opacity:1}}'+
'@media (max-height:440px){#yshop .grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}#yshop .it .ic{font-size:1.9rem}#yshop .it small{min-height:0}}';
function build(){if(E)return E;var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);E=document.createElement('div');E.id='yshop';document.body.appendChild(E);return E}
var TABS=[['hot','🔥 Öne Çıkan'],['chest','🎁 Sandıklar'],['rune','🔮 Rünler'],['weap','⚔ Silahlar'],['char','🧍 Karakterler'],['gem','💎 Elmas']];
function btn(cur,p,id,old){return'<button class="ysh-btn" data-b="'+id+'"'+(canPay(cur,p)?'':' style="filter:saturate(.6)"')+'>'+(old?'<span class="old">'+fmt(old)+'</span>':'')+curIc(cur)+' '+fmt(p)+'</button>'}
function draw(){build();var p=P();if(!p){close();return}if(p.gem==null)p.gem=0;var h='<div class="hd"><h2>🛒 Mağaza</h2><div class="bal"><span>🪙 '+fmt(p.gold)+'</span><span>💎 '+fmt(gem())+'</span><span>🎫 '+fmt(jet())+'</span></div><button class="x" id="yshx" aria-label="Kapat">✕</button></div><div class="tabs">'+TABS.map(function(t){return'<button data-t="'+t[0]+'" class="'+(t[0]===tab?'on':'')+'">'+t[1]+'</button>'}).join('')+'</div><div class="bd">';
  if(tab==='hot'){var free=p.gemD!==today(),ds=deals(),c0=CHESTS[ds[0].id];
    h+='<div class="ban"><span class="ic">🎁</span><div><b>Günlük ücretsiz elmas</b><small>Her gün gel, 5 elmas senin. Seviye atladıkça da 2 elmas kazanırsın.</small></div><button class="ysh-btn" style="width:auto;padding:9px 16px" data-b="free"'+(free?'':' disabled')+'>'+(free?'💎 5 Al':'Yarın gel')+'</button></div>';
    if(!p.spk)h+='<div class="ban" style="--c:#ffb02e"><span class="ic">🚀</span><div><b>Başlangıç Paketi · bir kerelik</b><small>300 💎 + Efsanevi Sandık + 10.000 🪙. Mağazadaki en avantajlı paket.</small></div><button class="ysh-btn" style="width:auto;padding:9px 14px" data-b="starter">₺49,99</button></div>';
    h+='<div class="sec">⏳ Günün fırsatları · gece yarısı yenilenir</div><div class="grid">'+
     '<div class="it" style="--c:'+c0.col+'"><span class="rib">-%'+ds[0].off+'</span><span class="ic">'+c0.ic+'</span><b>'+c0.n+'</b><small>'+c0.d+'</small>'+btn('gem',ds[0].p,'chest:'+ds[0].id,c0.p)+'</div>'+
     '<div class="it" style="--c:'+RCOL[ds[1].r]+'"><span class="rib">-%35</span><span class="ic">🔮</span><b>'+RAR[ds[1].r]+' Rün</b><small>Rastgele '+RAR[ds[1].r]+' rün</small>'+btn('gem',ds[1].p,'drune',RUNEP[ds[1].r].p)+'</div>'+
     '<div class="it" style="--c:#ffd23f"><span class="ic">💰</span><b>Altın Kesesi</b><small>'+fmt(ds[2].g)+' altın, anında</small>'+btn('gem',ds[2].p,'dgold')+'</div></div>';
    h+='<div class="sec">🏆 Sezon Kartı</div><div class="ban" style="opacity:.85"><span class="ic">🎟</span><div><b>Kış Sezonu Kartı</b><small>30 seviyelik ödül yolu: özel kostüm, Efsanevi sandıklar, 1200 💎 geri. Uygulama Google Play\'e çıkınca açılacak.</small></div><button class="ysh-btn alt" style="width:auto;padding:9px 12px" data-b="pass">Yakında</button></div>'}
  else if(tab==='chest'){h+='<div class="grid">'+Object.keys(CHESTS).map(function(k){var c=CHESTS[k],d=deal(k);return'<div class="it" style="--c:'+c.col+'">'+(d?'<span class="rib">-%'+d.off+'</span>':'')+'<span class="ic">'+c.ic+'</span><b>'+c.n+'</b><small>'+c.d+'</small>'+btn(c.cur,d?d.p:c.p,'chest:'+k,d?c.p:0)+'</div>'}).join('')+'</div>'}
  else if(tab==='rune'){h+='<div class="grid">'+RUNEP.map(function(x,r){return'<div class="it" style="--c:'+RCOL[r]+'"><span class="ic">🔮</span><b style="color:'+RCOL[r]+'">'+RAR[r]+' Rün</b><small>Rastgele bir '+RAR[r].toLowerCase()+' rün. Rün Ustası\'nda tak.</small>'+btn(x.cur,x.p,'rune:'+r)+'</div>'}).join('')+'</div>'}
  else if(tab==='weap'){var W=Y().WEAPONS[p.cls]||[],ow=p.ow||{};h+='<p style="margin:0 0 8px;font-size:.8rem;color:#bfa987">Silahı demircide malzemeyle dövebilir ya da buradan anında alabilirsin. Seviye şartı her iki yolda da aynı.</p><div class="grid">'+W.map(function(w,t){var own=t===0||ow[p.cls+':'+t],cur=p.wt===t,lock=p.lv<w.lv,col=['#c9ced9','#7be07b','#5cb0ff','#c07cff','#ffb02e','#ff5b6e','#7df9ff'][w.rar||0];
     return'<div class="it" style="--c:'+col+'"><span class="ic wic">'+(window.YWP?YWP.svg(p.cls,t,84):'⚔️')+'</span><b style="color:'+col+'">'+esc(w.n)+'</b><small>Sv '+w.lv+' · güç ×'+w.m.toFixed(2)+'</small>'+(cur?'<button class="ysh-btn alt" disabled>Kuşanılı</button>':own?'<button class="ysh-btn alt" data-b="wear:'+t+'">Kuşan</button>':lock?'<button class="ysh-btn alt" disabled>🔒 Sv '+w.lv+' gerekir</button>':btn('gem',wPrice(t),'weap:'+t))+'</div>'}).join('')+'</div>'}
  else if(tab==='char'){var pr=YL.PRESETS,ks=Object.keys(pr).filter(function(k){return pr[k].shop&&!pr[k].founder});h+='<div class="grid">'+ks.map(function(k){var q=pr[k],id='sp:'+q.shop,it=YX.cat.ITEMS[id],jp=it?YX.price(it.price):0,own=false,lk=false;try{own=YX.owns(id);lk=YX.locked&&YX.locked(id)}catch(e){}var gp=Math.max(30,Math.ceil(jp/8));
     return'<div class="it"'+(jp>=20000?' style="--c:#ffb02e"':'')+'><canvas data-pv="'+k+'" width="96" height="120"></canvas><b>'+esc(q.n)+'</b>'+(own?'<button class="ysh-btn alt" disabled>Sahipsin</button>':lk?'<button class="ysh-btn alt" disabled>🔒 Kurucu izniyle</button>':'<div style="display:flex;gap:6px;width:100%">'+btn('jet',jp,'cj:'+k).replace('ysh-btn"','ysh-btn" style="flex:1;padding:8px 2px;font-size:.8rem"')+btn('gem',gp,'cg:'+k).replace('ysh-btn"','ysh-btn" style="flex:1;padding:8px 2px;font-size:.8rem"')+'</div>')+'</div>'}).join('')+'</div>'}
  else if(tab==='gem'){h+='<p style="margin:0 0 8px;font-size:.8rem;color:#bfa987">Elmasla sandık, rün, silah ve karakter alınır. Ücretsiz elmas: günlük 5 💎 ve her seviye atlayışta 2 💎.</p><div class="grid">'+PACKS.map(function(k){var tot=Math.round(k.g*(1+k.b/100));return'<div class="it" style="--c:#7df9ff">'+(k.tag?'<span class="rib" style="background:#3fbf6a">'+k.tag+'</span>':'')+'<span class="ic">💎</span><b>'+fmt(tot)+' Elmas</b><small>'+(k.b?'+%'+k.b+' bonus dahil':'Başlangıç')+'</small><button class="ysh-btn" data-b="pack:'+k.id+'">₺'+k.tl+'</button></div>'}).join('')+'</div>'+(payReady()?'':'<p style="font-size:.76rem;color:#bfa987;margin-top:10px">💳 Gerçek parayla alım, oyun Google Play\'e çıktığında Google Play üzerinden güvenle yapılacak. Şimdilik ücretsiz elmaslarla her şeyi deneyebilirsin.</p>')}
  h+='</div>';E.innerHTML=h;E.classList.add('on');
  E.querySelector('#yshx').onclick=close;E.querySelectorAll('[data-t]').forEach(function(b){b.onclick=function(){tab=b.dataset.t;draw()}});
  pv();setTimeout(pv,500);setTimeout(pv,1500);
  E.querySelectorAll('[data-b]').forEach(function(b){b.onclick=function(){act(b.dataset.b)}})}
function pv(){if(!E)return;var p=P();E.querySelectorAll('canvas[data-pv]').forEach(function(cv){var c=cv.getContext('2d'),ap=YL.PRESETS[cv.dataset.pv].ap;c.clearRect(0,0,cv.width,cv.height);try{if(window.YPX&&YPX.want()){c.save();c.imageSmoothingEnabled=false;c.scale(.8,.8);YPX.hero(c,60,140,{ap:ap,cls:p.cls,mv:false,t:0,fy:1});c.restore()}else YL.hero(c,48,114,ap,0,false,.95)}catch(e){}})}
addEventListener('yl-img',function(){if(E&&E.classList.contains('on')&&tab==='char')pv()});
function act(a){var p=P(),k=a.split(':');
  if(a==='free'){if(p.gemD===today())return;p.gemD=today();gems(5);save();toast('💎 5 elmas eklendi!');draw();return}
  if(a==='starter'){realBuy('starter_pack',function(){p.spk=1;gems(300);gold(10000);toast('🚀 Başlangıç Paketi açıldı!')});return}
  if(a==='pass'){toast('🎟 Sezon Kartı Google Play sürümüyle geliyor.');return}
  if(k[0]==='pack'){var pk=PACKS.filter(function(x){return x.id===k[1]})[0];realBuy(pk.id,function(){gems(Math.round(pk.g*(1+pk.b/100)));toast('💎 Elmaslar eklendi, teşekkürler!')});return}
  if(k[0]==='chest'){openChest(k[1]);return}
  if(a==='drune'){var d=deals()[1];if(!pay('gem',d.p))return;var g=rune(d.r);save();toast('🔮 '+(g?g.n:'Rün')+' kazandın!');draw();return}
  if(a==='dgold'){var d2=deals()[2];if(!pay('gem',d2.p))return;gold(d2.g);save();toast('💰 '+fmt(d2.g)+' altın eklendi!');draw();return}
  if(k[0]==='rune'){var r=+k[1],x=RUNEP[r];if(!pay(x.cur,x.p))return;var g2=rune(r);save();toast('🔮 '+(g2?g2.n:'Rün')+' kazandın!');draw();return}
  if(k[0]==='wear'){p.wt=+k[1];save();toast('⚔ Kuşanıldı');draw();return}
  if(k[0]==='weap'){var t=+k[1],w=Y().WEAPONS[p.cls][t];if(p.lv<w.lv)return;if(!pay('gem',wPrice(t)))return;p.ow=p.ow||{};p.ow[p.cls+':'+t]=true;p.wt=t;save();toast('⚔ '+w.n+' senin, kuşanıldı!');draw();return}
  if(k[0]==='cj'||k[0]==='cg'){var q=YL.PRESETS[k[1]],id='sp:'+q.shop;if(k[0]==='cj'){var r2=YX.buy(id);if(!r2.ok){toast(r2.r==='lock'?'🔒 Bu karakter yalnızca kurucunun izniyle alınır.':'🎫 Yeterli jeton yok. Jeton, Yaxest Games\'teki oyunlardan kazanılır.');return}}
    else{var it=YX.cat.ITEMS[id],gp=Math.max(30,Math.ceil(YX.price(it.price)/8));if(YX.locked&&YX.locked(id))return;if(!pay('gem',gp))return;YX.grant(id)}
    save();toast('🧍 '+q.n+' artık senin! Görünüm\'den giyebilirsin.');draw();return}}
function open(t){if(!P())return;if(t)tab=t;var g=window.__yd&&__yd.G;if(g&&g.mode)g.paused=true;draw()}
function close(){if(E)E.classList.remove('on');var g=window.__yd&&__yd.G;if(g&&g.mode&&!document.querySelector('.pan.on'))g.paused=false;try{if(window.YLB&&document.querySelector('#lobby.on'))YLB.open()}catch(e){}}
/* seviye atlayınca 2 elmas */
var lastLv=null,lastC=null;setInterval(function(){var p=P();if(!p||!window.__yd||!__yd.G)return;if(lastC===p.cls&&lastLv!=null&&p.lv>lastLv&&p.lv-lastLv<5){p.gem=(p.gem|0)+2*(p.lv-lastLv);toast('💎 Seviye ödülü: +'+2*(p.lv-lastLv)+' elmas')}lastLv=p.lv;lastC=p.cls},1500);
window.YSH={open:open,close:close};
})();
