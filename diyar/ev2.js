/* Yaxest Diyarı: Ev 2.0 "Malikâne" (window.YEV) + Avcı Defteri (canavar ansiklopedisi)
   - Bahçe: evin yanında 6 tarla. Tohum ek, gerçek zamanlı büyür, sula (+hız), hasat et. Ürün evin seviyesine göre açılır.
   - Mutfak: ürünlerden yemek pişir, Kiler'e koy, ye: 30 dk güçlendirme (tek aktif).
   - Kupa Salonu: yendiğin her boss türü kalıcı kupa (+hasar, +can).
   - Konfor: ev seviyesi + dekor + bahçe + kupa + mutfak → Konfor kademesi (dinlenme XP'si ve günlük tohum hediyesi).
   - Avcı Defteri: her canavar türü için öldürme kaydı, 10/50/200'de yıldız; her 10 yıldız +%1 hasar ve +%1 XP (en çok %15).
   Kayıt: P.ev2 = {g:[6 tarla], cr:{ürün:adet}, kl:{yemek:adet}, bf:{id,u}, tr:{boss:adet}, sd:gün, bs:{canavar:adet}}
   game.js kancaları: S() içinde YEV.mods, killMon içinde YEV.kill, render'da YEV.collect, findNear/interact'te 'ev2' */
(function(){
'use strict';
var D=null,MIN=60000;
var CROPS={
 bugday:{n:'Buğday',ic:'🌾',lv:1,sd:20,dur:3*MIN,y:[3,5],sell:7,col:'#e8c35a'},
 havuc:{n:'Havuç',ic:'🥕',lv:1,sd:35,dur:6*MIN,y:[2,4],sell:16,col:'#ff8c3a'},
 domates:{n:'Domates',ic:'🍅',lv:2,sd:70,dur:10*MIN,y:[2,4],sell:32,col:'#ff4d4d'},
 cilek:{n:'Çilek',ic:'🍓',lv:2,sd:110,dur:15*MIN,y:[3,5],sell:36,col:'#ff3d6e'},
 kabak:{n:'Balkabağı',ic:'🎃',lv:3,sd:220,dur:25*MIN,y:[1,2],sell:200,col:'#ff9a1f'},
 aycicek:{n:'Ay Çiçeği',ic:'🌻',lv:3,sd:180,dur:20*MIN,y:[2,3],sell:100,col:'#ffd23f',night:1},
 misir:{n:'Altın Mısır',ic:'🌽',lv:4,sd:450,dur:40*MIN,y:[2,3],sell:240,col:'#ffe14a'},
 biber:{n:'Ejder Biberi',ic:'🌶',lv:4,sd:800,dur:60*MIN,y:[1,2],sell:680,col:'#e8282f'}
};
var CORDER=['bugday','havuc','domates','cilek','kabak','aycicek','misir','biber'];
var MEALS={
 ekmek:{n:'Köy Ekmeği',ic:'🍞',need:{bugday:3},k:'regen',b:.012,t:'Can yenileme saniyede +%1.2'},
 corba:{n:'Havuç Çorbası',ic:'🥣',need:{havuc:2,bugday:1},k:'xpx',b:.15,t:'XP +%15'},
 guvec:{n:'Domates Güveci',ic:'🍲',need:{domates:3,havuc:1},k:'atk',b:.10,t:'Hasar +%10'},
 turta:{n:'Çilekli Turta',ic:'🥧',need:{cilek:3,bugday:2},k:'spd',b:.08,t:'Hız +%8'},
 tatli:{n:'Balkabağı Tatlısı',ic:'🍮',need:{kabak:1,cilek:2},k:'hp',b:.15,t:'Azami can +%15'},
 cay:{n:'Ay Çiçeği Çayı',ic:'🍵',need:{aycicek:2},k:'gath',b:.25,t:'Toplarken +1 şansı +%25'},
 patlak:{n:'Altın Mısır Patlağı',ic:'🍿',need:{misir:2,bugday:2},k:'goldx',b:.30,t:'Canavar altını +%30'},
 kebap:{n:'Ejder Kebabı',ic:'🍢',need:{biber:1,domates:2,havuc:2},k:'atk',b:.18,k2:'crit',b2:.06,t:'Hasar +%18, kritik +%6'}
};
var MORDER=['ekmek','corba','guvec','turta','tatli','cay','patlak','kebap'];
var BUFDUR=30*MIN;
var TIERS=[[0,'Mütevazı','#c9ced9'],[40,'Rahat','#7be07b'],[90,'Şık','#5cb0ff'],[160,'Görkemli','#c07cff'],[260,'Efsanevi','#ffb02e']];
var NOBEST={metin:1,goldslime:1};
function P(){return D&&D.P}
function st(){var p=P();if(!p)return null;var e=p.ev2;if(!e||typeof e!=='object')e=p.ev2={};if(!Array.isArray(e.g)||e.g.length!==6)e.g=[null,null,null,null,null,null];e.cr=e.cr||{};e.kl=e.kl||{};e.tr=e.tr||{};e.bs=e.bs||{};return e}
function hlv(){var p=P();return p&&p.hm&&p.hm.pl?Math.max(1,p.hm.lv||1):0}
function now(){return Date.now()}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmtT(ms){ms=Math.max(0,ms);var m=Math.ceil(ms/MIN);return m>=60?Math.floor(m/60)+' sa '+(m%60)+' dk':m+' dk'}
function night(){try{var h=(YX2.dbg.hourP()+21)%24;return h>=20||h<6}catch(e){return false}}
/* ---------- bahçe ---------- */
function plotState(i){var e=st(),g=e&&e.g[i];if(!g)return{s:'bos'};var c=CROPS[g.c];if(!c){e.g[i]=null;return{s:'bos'}}var left=g.t0+g.d-now();return left<=0?{s:'hazir',g:g,c:c}:{s:'buyu',g:g,c:c,left:left,p:1-left/g.d}}
function plant(i,id){var e=st(),p=P(),c=CROPS[id];if(!e||!c||e.g[i])return;if(hlv()<c.lv){D.say(c.n+' için ev seviyesi '+c.lv+' gerekir','sys');return}if(p.gold<c.sd){D.say('Altın yetmiyor ('+c.sd+')','sys');return}
  p.gold-=c.sd;var d=c.dur;if(c.night&&night())d=Math.round(d*.6);e.g[i]={c:id,t0:now(),d:d,w:0};D.saveNow();D.say(c.ic+' '+c.n+' ekildi. '+fmtT(d)+' sonra hasat.','sys')}
function water(i){var e=st(),g=e&&e.g[i];if(!g||g.w)return;var left=g.t0+g.d-now();if(left<=0)return;g.w=1;g.d-=Math.round(left*.25);D.saveNow();D.say('Sulandı: büyüme %25 hızlandı','sys')}
function harvest(i){var e=st(),ps=plotState(i);if(ps.s!=='hazir')return 0;var c=ps.c,n=c.y[0]+Math.floor(Math.random()*(c.y[1]-c.y[0]+1));if(ps.g.w)n+=Math.random()<.5?1:0;
  e.cr[ps.g.c]=(e.cr[ps.g.c]||0)+n;var gold=Math.random()<.06;if(gold){e.cr[ps.g.c]+=n;D.say('✨ Altın hasat! '+c.n+' iki katı çıktı','sys')}e.g[i]=null;D.saveNow();return n*(gold?2:1)}
function harvestAll(){var t=0;for(var i=0;i<6;i++)t+=harvest(i);if(t)D.say('Hasat: '+t+' ürün Kiler\'e girdi','sys');return t}
function sellCrop(id,all){var e=st(),c=CROPS[id],n=e.cr[id]||0;if(!n)return;var k=all?n:1;e.cr[id]=n-k;P().gold+=k*c.sell;D.saveNow()}
/* ---------- köy siparişleri: 3 sipariş, 2 saatte yenilenir; ürünü teslim et, piyasanın ~2 katı altın + şansla rün ---------- */
var BUYERS=['Han Sahibi Hasan','Aşçı Zeynep','Kervancı Rıza','Fırıncı Elif','Şenlik Ustası','Değirmenci Ali','Gezgin Tüccar','Kale Kilercisi'];
function orders(){var e=st();if(!e||!hlv())return[];var slot=Math.floor(now()/(2*3600e3));if(!e.or||e.or.s!==slot){var pool=CORDER.filter(function(k){return CROPS[k].lv<=hlv()}),L=[];
  for(var i=0;i<3;i++){var k=pool[Math.floor(Math.random()*pool.length)],c=CROPS[k],q=Math.max(1,Math.round((c.sell<60?6:c.sell<300?3:2)*(.7+Math.random()*.8))),mul=1.5+Math.random()*.4;L.push({k:k,q:q,g:Math.round(q*c.sell*mul),b:BUYERS[Math.floor(Math.random()*BUYERS.length)],d:0,r:Math.random()<.25})}e.or={s:slot,L:L}}return e.or.L}
function deliver(i){var e=st(),o=orders()[i];if(!o||o.d)return;if((e.cr[o.k]||0)<o.q){D.say('Yeterli '+CROPS[o.k].n+' yok','sys');return}e.cr[o.k]-=o.q;o.d=1;P().gold+=o.g;var extra='';
  if(o.r&&window.YR&&YR.R){var ks=Object.keys(YR.R).filter(function(k){return YR.R[k].r<=2}),rk=ks[Math.floor(Math.random()*ks.length)];P().rn=P().rn||{};P().rn[rk]=(P().rn[rk]||0)+1;extra=' + '+YR.R[rk].n}
  D.saveNow();D.say('📦 '+o.b+' siparişi teslim: +'+o.g+' altın'+extra,'sys')}
function ordersHtml(){var e=st(),L=orders(),h='<h4 style="margin:14px 0 4px">Köy siparişleri <small>(2 saatte bir yenilenir)</small></h4>';
  L.forEach(function(o,i){var c=CROPS[o.k],hv=e.cr[o.k]||0;h+='<div class="row2" style="'+(o.d?'opacity:.45':'')+'"><span style="font-size:1.2rem">'+c.ic+'</span><div class="t"><b>'+esc(o.b)+'</b><br><small>'+o.q+' × '+c.n+' ('+hv+' sende) → <b style="color:#ffd23f">'+o.g+' altın</b>'+(o.r?' + rün':'')+'</small></div>'+(o.d?'<small>Teslim edildi</small>':'<button class="bt" type="button" data-ord="'+i+'" '+(hv>=o.q?'':'disabled')+'>Teslim et</button>')+'</div>'});return h}
/* ---------- mutfak ---------- */
function canCook(id){var m=MEALS[id],e=st();if(!m||!e)return false;for(var k in m.need)if((e.cr[k]||0)<m.need[k])return false;return true}
function cook(id){if(!canCook(id))return;var m=MEALS[id],e=st();for(var k in m.need)e.cr[k]-=m.need[k];e.kl[id]=(e.kl[id]||0)+1;D.saveNow();D.say(m.ic+' '+m.n+' pişti, Kiler\'de','sys')}
function eat(id){var e=st(),m=MEALS[id];if(!m||!(e.kl[id]>0))return;e.kl[id]--;e.bf={id:id,u:now()+BUFDUR};D.saveNow();D.say(m.ic+' '+m.n+' yendi: '+m.t+' (30 dk)','sys');if(D.floatTxt&&D.G)D.floatTxt(D.G.px,D.G.py-70,m.ic+' '+m.t,'#ffd23f')}
function buff(){var e=st();if(!e||!e.bf)return null;if(e.bf.u<=now()){var m=MEALS[e.bf.id];e.bf=null;if(m&&D)D.say(m.ic+' '+m.n+' etkisi bitti','sys');return null}return e.bf}
/* ---------- kupalar, defter ---------- */
function kill(m){var e=st();if(!e||!m||!m.type)return;if(!NOBEST[m.type]){var had=e.bs[m.type]||0;e.bs[m.type]=had+1;var n=had+1;if(n===10||n===50||n===200){var M=D.Y.MON[m.type];D.say('📜 Avcı Defteri: '+(M?M.n:m.type)+' '+stars(n)+'★ oldu!','sys')}}
  var M2=D.Y.MON[m.type];if(M2&&M2.boss&&!NOBEST[m.type]){var first=!e.tr[m.type];e.tr[m.type]=(e.tr[m.type]||0)+1;if(first)D.say('👑 Yeni kupa: '+M2.n+'. Evinin Kupa Salonu\'na asıldı (+%1 hasar, +%1 can)','sys')}}
function stars(n){return n>=200?3:n>=50?2:n>=10?1:0}
function bookStars(){var e=st(),s=0;if(!e)return 0;for(var k in e.bs)s+=stars(e.bs[k]);return s}
function trophyN(){var e=st();return e?Object.keys(e.tr).length:0}
/* ---------- konfor ---------- */
function comfort(){var p=P(),e=st();if(!p||!e||!hlv())return 0;var h=p.hm||{},dec=(h.lay&&h.lay.length)||0,grow=e.g.filter(function(x){return x}).length,ml=Object.keys(e.kl).filter(function(k){return e.kl[k]>0}).length;
  return Math.round(hlv()*25+Math.min(30,dec)*4+grow*5+trophyN()*6+ml*4+Math.min(40,bookStars()))}
function tier(c){var t=0;for(var i=0;i<TIERS.length;i++)if(c>=TIERS[i][0])t=i;return t}
function dailySeeds(){var e=st();if(!e||!hlv())return;var d=new Date().toDateString();if(e.sd===d)return;e.sd=d;var t=tier(comfort()),pool=CORDER.filter(function(k){return CROPS[k].lv<=hlv()}),gave=[];
  for(var i=0;i<1+t;i++){var k=pool[Math.floor(Math.random()*pool.length)];e.cr[k]=(e.cr[k]||0)+2;gave.push(CROPS[k].ic)}D.saveNow();D.say('🏡 Konfor hediyesi: Kiler\'e taze ürün geldi '+gave.join(' '),'sys')}
/* ---------- S() kancası ---------- */
function mods(p){var o={atk:0,hp:0,regen:0,spd:0,goldx:0,xpx:0,gath:0,crit:0};if(!P())return o;var b=buff();if(b){var m=MEALS[b.id];if(m){o[m.k]+=m.b;if(m.k2)o[m.k2]+=m.b2}}
  var tn=trophyN();o.atk+=Math.min(.2,tn*.01);o.hp+=Math.min(.2,tn*.01);var bs=Math.min(.15,Math.floor(bookStars()/10)*.01);o.atk+=bs;o.xpx+=bs+(hlv()?tier(comfort())*.01:0);return o}
/* ---------- dünyada bahçe ---------- */
var gpos=null,gplot=null;
function gardenPos(){var p=P();if(!p||!p.hm||!p.hm.pl||!window.YH)return null;if(gpos&&gplot===p.hm.pl)return gpos;var Y=D.Y,TS=Y.TS,pl=YH.PL.filter(function(x){return x.id===p.hm.pl})[0];if(!pl)return null;
  var pp=YH.plotPos(pl),cx=Y.CX*TS,cy=Y.CY*TS,ax=pp.x-cx,ay=pp.y-cy,L=Math.hypot(ax,ay)||1,ux=ax/L,uy=ay/L,tx=-uy,ty=ux,cands=[[tx*-130,ty*-130],[tx*130,ty*130],[-ux*120,-uy*120]],best=null;
  var others=YH.PL.filter(function(x){return x.id!==pl.id}).map(function(x){return YH.plotPos(x)});
  for(var i=0;i<cands.length&&!best;i++){var gx=pp.x+cands[i][0],gy=pp.y+cands[i][1]+10,ok=true;for(var j=0;j<6;j++){var c=cell(gx,gy,j);if(window.YW&&YW.solid&&YW.solid(c.x,c.y))ok=false}others.forEach(function(o){if(Math.hypot(o.x-gx,o.y-gy)<120)ok=false});if(ok)best={x:gx,y:gy}}
  gpos=best||{x:pp.x+cands[2][0],y:pp.y+cands[2][1]};gplot=p.hm.pl;return gpos}
function cell(gx,gy,j){return{x:gx+((j%3)-1)*30,y:gy+(Math.floor(j/3)-.5)*30}}
function drawGarden(c,t){var g=gardenPos();if(!g)return;var ol='#1b1530';c.save();
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(g.x,g.y+20,58,14,0,0,6.3);c.fill();
  c.strokeStyle='#8a5a2b';c.lineWidth=3;c.strokeRect(g.x-50,g.y-34,100,66);c.fillStyle='#a8743f';[[-50,-34],[50,-34],[-50,32],[50,32]].forEach(function(q){c.fillRect(g.x+q[0]-3,g.y+q[1]-6,6,10)});
  for(var j=0;j<6;j++){var q=cell(g.x,g.y,j),ps=plotState(j);c.fillStyle=ps.s==='bos'?'#6b4a2e':'#5a3c22';c.strokeStyle=ol;c.lineWidth=1.2;c.beginPath();c.rect(q.x-13,q.y-13,26,26);c.fill();c.stroke();
    c.strokeStyle='rgba(0,0,0,.18)';c.beginPath();c.moveTo(q.x-11,q.y-4);c.lineTo(q.x+11,q.y-4);c.moveTo(q.x-11,q.y+5);c.lineTo(q.x+11,q.y+5);c.stroke();
    if(ps.s!=='bos'){var pr=ps.s==='hazir'?1:ps.p,col=ps.c.col,sw=Math.sin(t*2+j)*1.2;if(ps.g.w&&ps.s!=='hazir'){c.fillStyle='rgba(90,160,255,.25)';c.fillRect(q.x-12,q.y-12,24,24)}
      c.strokeStyle='#3f9a3a';c.lineWidth=2;var h=4+pr*12;[-6,0,6].forEach(function(dx){c.beginPath();c.moveTo(q.x+dx,q.y+8);c.quadraticCurveTo(q.x+dx+sw,q.y+8-h*.6,q.x+dx+sw,q.y+8-h);c.stroke()});
      if(pr>.55){c.fillStyle=col;var r=1.5+(pr-.55)*7;[-6,0,6].forEach(function(dx){c.beginPath();c.arc(q.x+dx+sw,q.y+8-h,r,0,6.3);c.fill()})}
      if(ps.s==='hazir'){var a=.5+.5*Math.sin(t*5+j);c.fillStyle='rgba(255,236,120,'+a+')';c.beginPath();c.arc(q.x+9,q.y-10,2.6,0,6.3);c.fill()}}}
  var rd=0;for(var k=0;k<6;k++)if(plotState(k).s==='hazir')rd++;c.restore();if(D._plate)D._plate(c,g.x,g.y-48,rd?'Bahçe · '+rd+' hasat hazır':'Bahçe','#7be07b')}
function collect(ents,ctx,t,plate){if(!hlv())return;var g=gardenPos();if(!g)return;D._plate=plate;ents.push({y:g.y+30,f:function(){drawGarden(ctx,t)}})}
function near(G){if(!G||G.mode!=='world'||!hlv())return null;var g=gardenPos();if(!g)return null;return Math.hypot(g.x-G.px,g.y-G.py)<80?{t:'ev2'}:null}
/* ---------- arayüz ---------- */
var tab='bahce';
var CSS='<style>.yev .tb{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px}.yev .tb button{flex:1 1 auto;min-width:70px;padding:8px 6px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font:700 .8rem "Chakra Petch",sans-serif}.yev .tb button.on{background:#ffd23f;color:#1a1408}'+
 '.yev .cf{display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;background:rgba(255,255,255,.05);margin-bottom:10px}.yev .gr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.yev .pl{border-radius:12px;padding:8px;background:#3a2a1c;border:1px solid #6b4a2e;text-align:center;font-size:.78rem;min-height:92px}'+
 '.yev .bar{height:6px;border-radius:3px;background:rgba(0,0,0,.4);overflow:hidden;margin:5px 0}.yev .bar i{display:block;height:100%;background:#7be07b}.yev .sb{display:inline-block;margin:2px;padding:5px 7px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:#fff;font-size:.72rem}.yev .sb[disabled]{opacity:.35}'+
 '.yev .row2{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.08)}.yev .row2 .t{flex:1;min-width:0}.yev small{opacity:.75}.yev .bt{padding:6px 10px;border-radius:9px;border:0;background:#ffd23f;color:#1a1408;font-weight:800;font-size:.75rem}.yev .bt[disabled]{opacity:.35}.yev .bt.alt{background:rgba(255,255,255,.12);color:#fff}'+
 '.yev .bk{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.yev .bc{border-radius:10px;padding:6px 4px;background:rgba(255,255,255,.05);text-align:center;font-size:.66rem;line-height:1.2}.yev .bc canvas{width:46px;height:46px;display:block;margin:0 auto}</style>';
function header(){var c=comfort(),t=tier(c),nx=TIERS[t+1],b=buff(),m=b&&MEALS[b.id];
  return '<div class="cf"><div style="font-size:1.6rem">🏡</div><div style="flex:1"><b style="color:'+TIERS[t][2]+'">Konfor '+c+' · '+TIERS[t][1]+'</b><br><small>'+(nx?'Sonraki kademe '+nx[1]+': '+nx[0]+' · ':'')+'Her kademe +%1 XP ve günlük ürün hediyesi</small>'+(m?'<br><small style="color:#ffd23f">'+m.ic+' '+m.n+': '+m.t+' · '+fmtT(b.u-now())+'</small>':'')+'</div></div>'}
function tabs(){return '<div class="tb">'+[['bahce','🌱 Bahçe'],['mutfak','🍲 Mutfak'],['simya','⚗️ Simya'],['kupa','👑 Kupalar'],['defter','📜 Avcı Defteri']].map(function(x){return '<button type="button" data-tab="'+x[0]+'" class="'+(tab===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div>'}
function bahceHtml(){var e=st(),h='';if(!hlv())return '<p>Bahçe için önce Emlak Ofisi\'nden bir arsa alıp ev kur.</p>';
  var rd=0;h+='<div class="gr">';for(var i=0;i<6;i++){var ps=plotState(i);h+='<div class="pl">';
    if(ps.s==='bos'){h+='<b>Boş tarla</b><br>'+CORDER.map(function(k){var c=CROPS[k],lk=hlv()<c.lv;return '<button class="sb" type="button" data-plant="'+i+':'+k+'" '+(lk||P().gold<c.sd?'disabled':'')+' title="'+c.n+'">'+c.ic+(lk?'🔒':'')+'<br>'+c.sd+'</button>'}).join('')}
    else if(ps.s==='buyu'){h+='<div style="font-size:1.4rem">'+ps.c.ic+'</div><b>'+ps.c.n+'</b><div class="bar"><i style="width:'+Math.round(ps.p*100)+'%"></i></div><small>'+fmtT(ps.left)+'</small><br>'+(ps.g.w?'<small>💧 sulandı</small>':'<button class="sb" type="button" data-water="'+i+'">💧 Sula</button>')}
    else{rd++;h+='<div style="font-size:1.4rem">'+ps.c.ic+'</div><b>'+ps.c.n+'</b><br><small style="color:#7be07b">Hasat hazır!</small><br><button class="bt" type="button" data-harv="'+i+'">Hasat</button>'}
    h+='</div>'}h+='</div>';if(rd>1)h+='<div style="margin-top:8px"><button class="bt" type="button" data-harvall="1">Hepsini hasat et ('+rd+')</button></div>';
  h+=ordersHtml();
  h+='<h4 style="margin:14px 0 4px">Kiler</h4>';var any=0;CORDER.forEach(function(k){var n=e.cr[k]||0;if(!n)return;any=1;var c=CROPS[k];h+='<div class="row2"><span style="font-size:1.2rem">'+c.ic+'</span><div class="t"><b>'+c.n+'</b> ×'+n+'<br><small>Pazarda '+c.sell+' altın</small></div><button class="bt alt" type="button" data-sell="'+k+'">Sat 1</button><button class="bt alt" type="button" data-sellall="'+k+'">Hepsi</button></div>'});
  if(!any)h+='<small>Kiler boş. Tarlaya tohum ek, hasat edince burada görünür.</small>';
  h+='<p><small>Tohumlar ev seviyesine göre açılır (Kulübe: Buğday, Havuç · Ev: Domates, Çilek · Konak: Balkabağı, Ay Çiçeği · Saray: Altın Mısır, Ejder Biberi). Ay Çiçeği gece ekilirse daha hızlı büyür. Sulamak kalan süreyi %25 kısaltır, hasatta %50 şansla +1 ürün verir. %6 şansla altın hasat (iki kat).</small></p>';return h}
function mutfakHtml(){var e=st(),h='';MORDER.forEach(function(k){var m=MEALS[k],need=Object.keys(m.need).map(function(c){var hv=e.cr[c]||0;return '<span style="color:'+(hv>=m.need[c]?'#7be07b':'#ff8a8a')+'">'+CROPS[c].ic+' '+hv+'/'+m.need[c]+'</span>'}).join(' '),kn=e.kl[k]||0;
  h+='<div class="row2"><span style="font-size:1.4rem">'+m.ic+'</span><div class="t"><b>'+m.n+'</b>'+(kn?' <small>(Kiler: '+kn+')</small>':'')+'<br><small>'+m.t+' · 30 dk</small><br><small>'+need+'</small></div><button class="bt" type="button" data-cook="'+k+'" '+(canCook(k)?'':'disabled')+'>Pişir</button><button class="bt alt" type="button" data-eat="'+k+'" '+(kn?'':'disabled')+'>Ye</button></div>'});
  return h+'<p><small>Aynı anda tek yemek etkisi olur; yeni yemek eskisinin yerine geçer.</small></p>'}
function simyaHtml(){if(!window.YHB)return '';var e=st(),h='<p><small>Bahçe ürünlerinden iksir damıt: her tarif 2 iksir verir. İksirler alttaki çubukta (5-7) durur, takas ve pazarda satılır.</small></p>';
  YHB.PORD.forEach(function(k){var o=YHB.POT[k],r=YHB.BREW[k];if(!r)return;var need=Object.keys(r).map(function(c){var hv=e.cr[c]||0;return '<span style="color:'+(hv>=r[c]?'#7be07b':'#ff8a8a')+'">'+CROPS[c].ic+' '+hv+'/'+r[c]+'</span>'}).join(' ');
    h+='<div class="row2">'+YHB.potSvg(o.c,true)+'<div class="t"><b>'+o.n+'</b> <small>(sende '+(P()[k]||0)+')</small><br><small>'+o.d+'</small><br><small>'+need+'</small></div><button class="bt" type="button" data-brew="'+k+'" '+(YHB.canBrew(k)?'':'disabled')+'>Damıt ×2</button></div>'});return h}
function monCv(type,sz){return '<canvas width="92" height="92" data-mon="'+type+'"></canvas>'}
function paintMons(root){if(!window.YA||!YA.monster)return;root.querySelectorAll('canvas[data-mon]').forEach(function(cv){var k=cv.getAttribute('data-mon'),M=D.Y.MON[k];if(!M)return;var c=cv.getContext('2d'),seen=cv.hasAttribute('data-seen');c.clearRect(0,0,92,92);c.save();var sc=Math.min(1.6,40/(M.sz||20));c.translate(46,64);c.scale(sc,sc);
  try{YA.monster(c,{type:k,sz:M.sz,col:M.c,c:M.c,n:M.n,hit:0,bob:0,x:0,y:0,lv:1,hp:1,max:1,boss:M.boss},0,0,0)}catch(e){}c.restore();if(!seen){c.globalCompositeOperation='source-atop';c.fillStyle='#1a1530';c.fillRect(0,0,92,92);c.globalCompositeOperation='source-over'}})}
function kupaHtml(){var e=st(),Y=D.Y,bosses=Object.keys(Y.MON).filter(function(k){return Y.MON[k].boss&&!NOBEST[k]}),n=trophyN();
  var h='<p><small>Yendiğin her boss türü evine kalıcı bir kupa olarak asılır. Her kupa +%1 hasar ve +%1 azami can (en çok %20). Şu an: <b style="color:#ffd23f">'+n+'/'+bosses.length+'</b> kupa → +%'+Math.min(20,n)+'</small></p><div class="bk">';
  bosses.forEach(function(k){var c=e.tr[k]||0;h+='<div class="bc" style="'+(c?'box-shadow:inset 0 0 0 1px #ffd23f':'')+'">'+'<canvas width="92" height="92" data-mon="'+k+'"'+(c?' data-seen':'')+'></canvas>'+(c?'<b>'+esc(Y.MON[k].n)+'</b><br>×'+c:'<span style="opacity:.6">???</span>')+'</div>'});return h+'</div>'}
function defterHtml(){var e=st(),Y=D.Y,ks=Object.keys(Y.MON).filter(function(k){return !NOBEST[k]}),s=bookStars(),seen=ks.filter(function(k){return e.bs[k]}).length,bon=Math.min(15,Math.floor(s/10));
  var h='<p><small>Her canavar türünü 10 / 50 / 200 kez yen: her eşik 1 yıldız. Her 10 yıldız kalıcı <b>+%1 hasar ve +%1 XP</b> (en çok %15). Seviye halkalarında ilerledikçe yeni türler bulursun.</small></p><div class="cf"><div style="font-size:1.5rem">📜</div><div><b>'+seen+'/'+ks.length+' tür · '+s+'★</b><br><small>Bonus: +%'+bon+' hasar, +%'+bon+' XP'+(bon<15?' · sonraki bonus için '+(10-s%10)+'★':'')+'</small></div></div><div class="bk">';
  ks.sort(function(a,b){return (e.bs[b]?1:0)-(e.bs[a]?1:0)});ks.forEach(function(k){var c=e.bs[k]||0,sr=stars(c);h+='<div class="bc">'+'<canvas width="92" height="92" data-mon="'+k+'"'+(c?' data-seen':'')+'></canvas>'+(c?'<b>'+esc(Y.MON[k].n)+'</b><br><span style="color:#ffd23f">'+'★'.repeat(sr)+'<span style="opacity:.3">'+'★'.repeat(3-sr)+'</span></span><br><small>'+c+'</small>':'<span style="opacity:.6">???</span>')+'</div>'});return h+'</div>'}
function render(){var el=document.getElementById('npc');if(!el)return;var body=tab==='bahce'?bahceHtml():tab==='mutfak'?mutfakHtml():tab==='simya'?simyaHtml():tab==='kupa'?kupaHtml():defterHtml();
  var tt=document.getElementById('npt');if(tt)tt.innerHTML=tab==='defter'?'📜 Avcı Defteri':'🏡 Malikâne';el.innerHTML=CSS+'<div class="yev">'+(tab==='defter'?'':header())+tabs()+body+'</div>';paintMons(el);bind(el)}
function bind(el){function on(sel,fn){el.querySelectorAll(sel).forEach(function(b){b.onclick=function(){fn(b);render()}})}
  on('[data-tab]',function(b){tab=b.getAttribute('data-tab')});on('[data-plant]',function(b){var q=b.getAttribute('data-plant').split(':');plant(+q[0],q[1])});on('[data-water]',function(b){water(+b.getAttribute('data-water'))});
  on('[data-harv]',function(b){var n=harvest(+b.getAttribute('data-harv'));if(n)D.say('Hasat: '+n+' ürün','sys')});on('[data-harvall]',function(){harvestAll()});
  on('[data-sell]',function(b){sellCrop(b.getAttribute('data-sell'),false)});on('[data-sellall]',function(b){sellCrop(b.getAttribute('data-sellall'),true)});
  on('[data-ord]',function(b){deliver(+b.getAttribute('data-ord'))});on('[data-brew]',function(b){YHB.brew(b.getAttribute('data-brew'))});on('[data-cook]',function(b){cook(b.getAttribute('data-cook'))});on('[data-eat]',function(b){eat(b.getAttribute('data-eat'))})}
var ival=0;
function open(t){if(!D||!P())return;if(t)tab=t;dailySeeds();D.openPan('p-npc');var tt=document.getElementById('npt');if(tt)tt.innerHTML=tab==='defter'?'📜 Avcı Defteri':'🏡 Malikâne';render();clearInterval(ival);ival=setInterval(function(){var p=document.getElementById('p-npc');if(!p||!p.classList.contains('on')||!document.querySelector('#npc .yev')){clearInterval(ival);return}if(tab==='bahce'){var sc=document.querySelector('#npc');var y=sc?sc.scrollTop:0;render();if(sc)sc.scrollTop=y}},5000)}
var lastNote=0;
function tick(){if(!D||!P()||!hlv())return;var n=now();if(n-lastNote<60000)return;var rd=0;for(var i=0;i<6;i++)if(plotState(i).s==='hazir')rd++;var e=st();if(rd&&e._rd!==rd){e._rd=rd;lastNote=n;D.say('🌾 Bahçende '+rd+' tarla hasada hazır','sys')}}
function init(d){D=d;setInterval(function(){try{tick();buff()}catch(e){}},15000)}
window.YEV={init:init,mods:mods,kill:kill,collect:collect,near:near,open:open,comfort:comfort,tier:tier,buff:buff,CROPS:CROPS,MEALS:MEALS,dbg:function(){return{st:st(),gp:gardenPos()}},_plant:plant,_harvest:harvest,_cook:cook,_eat:eat};
})();
