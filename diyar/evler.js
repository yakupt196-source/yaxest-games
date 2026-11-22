/* Yaxest Diyarı: Emlak Ofisi, Ev, Depo, Dinlenme, Özel Mağaza, Rün Altarı. window.YH */
(function(){
'use strict';
var D,Y,P,T='dp',tk=0;
var LV=[null,
 {n:'Kulübe',cap:150,sh:3,rune:0,rest:.05,col:'#9a7b55',w:70},
 {n:'Ev',cap:400,sh:5,rune:.05,rest:.10,col:'#5d9a6a',w:84,c:{wood:60,stone:40,gold:800}},
 {n:'Konak',cap:900,sh:8,rune:.10,rest:.15,col:'#4d7ea8',w:100,c:{i_iron:12,stone:80,gold:3500}},
 {n:'Saray',cap:2000,sh:12,rune:.15,rest:.20,col:'#ffd23f',w:118,c:{i_silver:10,crystal:6,gold:12000}}];
var PL=[{id:'p1',n:'Çınar Bahçesi',a:32,p:600},{id:'p2',n:'Değirmen Yanı',a:92,p:900},{id:'p3',n:'Gölge Yamacı',a:152,p:1300},{id:'p4',n:'Pınarbaşı',a:212,p:1800},{id:'p5',n:'Kervan Yolu',a:272,p:2600},{id:'p6',n:'Yıldız Tepesi',a:332,p:4000}];
var BUYERS=['Gezgin Hasan','Tüccar Ayşe','Madenci Veli','Avcı Zeynep','Kervancı Murat','Şifacı Elif','Demirci Bekir','Çırak Can'];
var pos={};
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function day(){return Math.floor(Date.now()/864e5)}
function hm(){return P&&P.hm}
function L(){var h=hm();return h?LV[h.lv]:null}
function plotPos(pl){if(pos[pl.id])return pos[pl.id];var TS=Y.TS,r=pl.a*Math.PI/180,tx=Math.round(Y.CX+Math.cos(r)*820/TS),ty=Math.round(Y.CY+Math.sin(r)*820/TS),best=null;
  for(var q=0;q<9&&!best;q++)for(var dy=-q;dy<=q&&!best;dy++)for(var dx=-q;dx<=q;dx++){var x=tx+dx,y=ty+dy;if(Y.zoneAt(x,y)!==3&&!Y.nodeAt(x,y)){best={x:(x+.5)*TS,y:(y+.5)*TS};break}}
  return pos[pl.id]=best||{x:(tx+.5)*TS,y:(ty+.5)*TS}}
function price(i,d){return Math.round(PL[i].p*(.85+.4*Y.hash(d==null?day():d,i+1,5)))}
function plotOf(id){for(var i=0;i<PL.length;i++)if(PL[i].id===id)return PL[i]}
function used(h){var n=0;for(var k in h.dp)n+=h.dp[k];return n}
function have(k){var a=k.split(':');if(a[0]==='m')return P[a[1]]||0;if(a[0]==='r')return P.rn[a[1]]||0;return window.YK?YK.have(P,k):0}
function put(k,q){var a=k.split(':');if(a[0]==='m')P[a[1]]=(P[a[1]]||0)+q;else if(a[0]==='r')P.rn[a[1]]=(P.rn[a[1]]||0)+q;else if(window.YK)YK.put(P,k,q)}
function take(k,q){var a=k.split(':');if(a[0]==='m')P[a[1]]=Math.max(0,(P[a[1]]||0)-q);else if(a[0]==='r')P.rn[a[1]]=Math.max(0,(P.rn[a[1]]||0)-q);else if(window.YK)YK.take(P,k,q)}
function valid(k){var a=String(k).split(':');if(a[0]==='m')return !!Y.MATS[a[1]];if(a[0]==='r')return !!(window.YR&&YR.R[a[1]]);if(a[0]==='w'||a[0]==='z'||a[0]==='e')return !!(window.YK&&YK.valid(k));return false}
function nm(k){try{return D.itName(k)}catch(e){return k}}
function ic(k){try{return D.itIc(k)}catch(e){return''}}
function val(k){try{return Math.max(1,D.itVal(k))}catch(e){return 10}}
function say(t){D.say(t,'sys')}
function save(){D.saveNow()}
function log(h,t){h.lg.unshift(t);h.lg.length=Math.min(h.lg.length,8)}
function ensure(){var h=hm();if(!h)return;h.dp=h.dp||{};h.vg=h.vg||0;h.sh=h.sh||[];h.till=h.till||0;h.lt=h.lt||Date.now();h.rb=h.rb||0;h.rc=h.rc||0;h.dg=h.dg||0;h.sold=h.sold||0;h.lg=h.lg||[];if(!LV[h.lv])h.lv=1}

/* ---------- dünyada ev ---------- */
function place(){var G=D.G;if(!G)return;G.npcs=G.npcs.filter(function(o){return o.id!=='home'});G.houses=G.houses.filter(function(o){return!o.mine});
  var h=hm();if(!h)return;var p=plotPos(plotOf(h.pl)),l=L();G.houses.push({x:p.x,y:p.y,c:l.col,w:l.w,mine:1});G.npcs.push({id:'home',n:'🏠 '+P.nick+' · '+l.n,ic:'🏠',x:p.x,y:p.y+54})}
function safe(G){var h=hm();if(!h||!G)return false;var p=plotPos(plotOf(h.pl));return Math.hypot(G.px-p.x,G.py-p.y)<170}
function init(api){D=api;Y=D.Y;P=D.P;clearInterval(tk);var G=D.G,cx=Y.CX*Y.TS,cy=Y.CY*Y.TS;
  if(!G.npcs.some(function(o){return o.id==='realty'}))G.npcs.push({id:'realty',n:'Emlakçı',ic:'🏘',x:cx-110,y:cy+290});
  ensure();place();simulate(true);tk=setInterval(function(){if(D.G&&hm())simulate(false)},30000)}

/* ---------- mağaza simülasyonu: gezgin müşteriler ---------- */
function simulate(quiet){var h=hm();if(!h)return;ensure();var now=Date.now(),l=L(),iv=(300-45*(h.lv-1))*1000,el=Math.min(now-h.lt,12*3600e3),n=Math.floor(el/iv);if(n<=0)return;h.lt+=n*iv;if(h.lt>now)h.lt=now;
  var gain=0,cnt=0;for(var i=0;i<n;i++){var live=h.sh.filter(function(s){return s.q>0});if(!live.length)break;var s=live[Math.floor(Math.random()*live.length)],r=s.p/val(s.k),ch=r<=1?1:r<=1.6?Math.max(.08,1-(r-1)*1.4):.05;
    if(Math.random()<ch){s.q--;h.till+=s.p;h.sold++;gain+=s.p;cnt++;log(h,'🛒 '+BUYERS[Math.floor(Math.random()*BUYERS.length)]+' '+nm(s.k)+' aldı +🪙'+s.p)}}
  h.sh=h.sh.filter(function(s){return s.q>0});
  if(cnt){save();if(!quiet||cnt)say('🏠 Mağazan: '+cnt+' satış, kasada +🪙'+gain+' (Evim → Mağaza → Topla)');if(T==='sh'&&$('p-npc')&&$('p-npc').classList.contains('on'))draw()}}
function xpx(p){var h=p&&p.hm;if(!h||!LV[h.lv])return 0;return Date.now()<(h.rb||0)?.10+LV[h.lv].rest:0}
function runeMul(p){var h=p&&p.hm;return h&&LV[h.lv]?1+LV[h.lv].rune:1}

/* ---------- arayüz ---------- */
function btn(l,a,c,x){return'<button class="btn'+(c?' '+c:'')+'" data-h="'+a+'" type="button" style="min-height:34px;padding:0 11px;font-size:.8rem"'+(x||'')+'>'+l+'</button>'}
function open(id){$('npt').innerHTML=id==='realty'?'🏘 Emlak Ofisi':'🏠 Evim';D.openPan('p-npc');if(id==='home'&&!hm()){id='realty'}T=id==='realty'?'re':(T==='re'?'dp':T);draw()}
function draw(){var h=hm();ensure();var el=$('npc'),s='';
  if(T==='re')s=reHtml();else{var tabs=[['dp','📦 Depo'],['rs','🛏 Dinlen'],['sh','🛒 Mağaza'],['ra','🔮 Altar'],['up','⬆ Geliştir']];
    s='<div class="row" style="flex-wrap:wrap;gap:5px;margin-bottom:8px">'+tabs.map(function(t){return btn(t[1],'t|'+t[0],T===t[0]?'':'alt')}).join('')+'</div>'+({dp:dpHtml,rs:rsHtml,sh:shHtml,ra:raHtml,up:upHtml}[T]||dpHtml)()}
  el.innerHTML=s;el.querySelectorAll('[data-h]').forEach(function(b){b.onclick=function(){act(b.dataset.h)}})}
function reHtml(){var h=hm(),d=day(),s='<p class="sub">Kasaba çevresindeki arsalar. Fiyatlar her gün <b>Mülk Borsası</b>’nda değişir. Arsa alınca üzerinde ilk evin (Kulübe) kurulur: depo, dinlenme, özel mağaza ve rün altarı seninle.</p>';
  s+='<div class="it"><div class="t"><small>Altının: 🪙'+P.gold+'</small></div></div>';
  PL.forEach(function(pl,i){var pr=price(i),pv=price(i,d-1),tr=pr>pv?'<span style="color:#ff8f8f">▲</span>':pr<pv?'<span style="color:#7dff9b">▼</span>':'▬',own=h&&h.pl===pl.id;
    var cost=h?Math.max(0,pr-Math.round((h.paid||0)*.6)):pr;
    s+='<div class="it"><div class="t"><b>'+pl.n+'</b>'+(own?' 🏠 <small>(evin burada)</small>':'')+'<br><small>🪙'+pr+' '+tr+' · dünün fiyatı 🪙'+pv+(h&&!own?' · taşınma farkı 🪙'+cost:'')+'</small></div>'+(own?'':btn(h?'Taşın':'Satın al','buy|'+pl.id,'',P.gold<cost?' disabled':''))+'</div>'});
  if(h){var back=Math.round((h.paid||0)*.6);s+='<div class="it"><div class="t"><small>Evini satarsan 🪙'+back+' alırsın (depo, raf ve kasa boş olmalı).</small></div>'+btn('Evi sat','sell','alt')+'</div>'}
  return s}
function dpHtml(){var h=hm(),l=L(),u=used(h),inv=D.myInv().filter(function(x){return valid(x.k)});
  var s='<div class="it"><div class="t"><b>'+l.n+' deposu</b> <small>'+u+' / '+l.cap+' eşya · 🔒 Kasa: 🪙'+h.vg+'</small><div style="height:8px;border-radius:4px;background:#ffffff1a;overflow:hidden;margin-top:4px"><i style="display:block;height:100%;width:'+Math.min(100,u/l.cap*100)+'%;background:#ffd23f"></i></div><small>Depodaki altın ölünce kaybolmaz (normalde %5 kaybedersin).</small></div></div>';
  s+='<div class="it"><div class="t"><small>Altın kasası</small></div>'+[100,1000].map(function(g){return btn('+'+g,'vg|'+g,'alt',P.gold<g?' disabled':'')}).join('')+btn('Hepsi','vg|all','alt')+btn('Çek','vw|all','alt',h.vg<1?' disabled':'')+'</div>';
  s+='<h3 style="margin:8px 0 4px">Çantandan depoya</h3>';if(!inv.length)s+='<p class="sub">Çantan boş.</p>';
  inv.forEach(function(x){s+='<div class="it"><span style="width:30px">'+ic(x.k)+'</span><div class="t"><b>'+esc(nm(x.k))+'</b> <small>×'+x.q+'</small></div>'+btn('1','pi|'+x.k+'|1','alt')+(x.q>1?btn('10','pi|'+x.k+'|10','alt')+btn('Tümü','pi|'+x.k+'|'+x.q,'alt'):'')+'</div>'});
  s+='<h3 style="margin:10px 0 4px">Depodakiler</h3>';var ks=Object.keys(h.dp).filter(function(k){return h.dp[k]>0&&valid(k)});if(!ks.length)s+='<p class="sub">Depo boş.</p>';
  ks.forEach(function(k){var q=h.dp[k];s+='<div class="it"><span style="width:30px">'+ic(k)+'</span><div class="t"><b>'+esc(nm(k))+'</b> <small>×'+q+'</small></div>'+btn('1','po|'+k+'|1','alt')+(q>1?btn('Tümü','po|'+k+'|'+q,'alt'):'')+'</div>'});
  if(window.YSoc)s+='<div class="row" style="margin-top:10px">'+btn('🛡 Klan Deposunu aç','cdep','alt')+'</div>';return s}
function rsHtml(){var h=hm(),l=L(),now=Date.now(),cdw=Math.max(0,(h.rc||0)-now),buff=Math.max(0,h.rb-now),chest=h.dg!==day();
  var s='<div class="it"><div class="t"><b>🛏 Dinlenme</b><br><small>Canını doldurur ve 20 dk <b>Dinlenmiş</b> verir: +%'+Math.round((.10+l.rest)*100)+' XP. Bekleme: 5 dk.</small>'+(buff?'<br><small style="color:#7dff9b">Dinlenmiş: '+Math.ceil(buff/60000)+' dk kaldı</small>':'')+'</div>'+btn(cdw?'⏳ '+Math.ceil(cdw/1000)+' sn':'Dinlen','rest','',cdw?' disabled':'')+'</div>';
  s+='<div class="it"><div class="t"><b>🎁 Günlük Ev Sandığı</b><br><small>Her gün bir kez: malzeme, altın ve şansa göre <b>rün</b>. Ev büyüdükçe daha çok.</small></div>'+btn(chest?'Aç':'Yarın','chest','',chest?'':' disabled')+'</div>';return s}
function shHtml(){var h=hm(),l=L(),s='<p class="sub">Depodaki eşyaları rafa koy, fiyatını sen belirle. Gezgin müşteriler uğrar (Ev seviyesi arttıkça sık gelir); piyasa fiyatına yakın olanı hemen alırlar, pahalıya nadiren. Sen yokken de satar (en çok 12 saat).</p>';
  s+='<div class="it"><div class="t"><b>Kasa: 🪙'+h.till+'</b> <small>· toplam satış '+h.sold+' · raf '+h.sh.length+'/'+l.sh+'</small></div>'+btn('Topla','till','',h.till?'':' disabled')+'</div>';
  h.sh.forEach(function(x,i){var r=x.p/val(x.k),tag=r<=1?'<span style="color:#7dff9b">hızlı satar</span>':r<=1.6?'<span style="color:#ffd23f">orta</span>':'<span style="color:#ff8f8f">çok pahalı</span>';
    s+='<div class="it"><span style="width:30px">'+ic(x.k)+'</span><div class="t"><b>'+esc(nm(x.k))+'</b> ×'+x.q+'<br><small>🪙'+x.p+' / adet · piyasa 🪙'+val(x.k)+' · '+tag+'</small></div>'+btn('−10%','pp|'+i+'|-1','alt')+btn('+10%','pp|'+i+'|1','alt')+btn('Geri','sb|'+i,'alt')+'</div>'});
  s+='<h3 style="margin:8px 0 4px">Rafa koy (depodan)</h3>';var ks=Object.keys(h.dp).filter(function(k){return h.dp[k]>0&&valid(k)&&!h.sh.some(function(x){return x.k===k})});
  if(!ks.length)s+='<p class="sub">Rafa koyacak eşya yok (depoda olmalı).</p>';ks.forEach(function(k){s+='<div class="it"><span style="width:30px">'+ic(k)+'</span><div class="t"><b>'+esc(nm(k))+'</b> <small>×'+h.dp[k]+' · önerilen 🪙'+Math.round(val(k)*1.2)+'</small></div>'+btn('Rafa koy','sa|'+k,'',h.sh.length>=l.sh?' disabled':'')+'</div>'});
  if(h.lg.length)s+='<h3 style="margin:10px 0 4px">Son satışlar</h3><div class="sub" style="line-height:1.6">'+h.lg.map(esc).join('<br>')+'</div>';return s}
function raHtml(){var h=hm(),l=L(),s='<div class="it"><div class="t"><b>🔮 Rün Altarı</b><br><small>Evinde dikilen altar, takılı rünlerinin etkisini güçlendirir: <b>+%'+Math.round(l.rune*100)+'</b> '+(h.lv<4?'(Ev→+%5, Konak→+%10, Saray→+%15)':'(en yüksek seviye)')+'.</small></div></div>';
  if(window.YR){var e=YR.equipped(P);if(!e.length)s+='<p class="sub">Takılı rünün yok. Rün Ustası’ndan döv ve tak.</p>';e.forEach(function(id){s+='<div class="it"><span style="width:30px">'+YA.ico('r_'+id,26)+'</span><div class="t"><b>'+YR.R[id].n+'</b> Sv'+YR.lvl(P,id)+'<br><small>'+YR.effTxt(P,id)+(l.rune?' → altar ile <b>×'+(1+l.rune).toFixed(2)+'</b>':'')+'</small></div></div>'})}
  s+='<div class="row" style="margin-top:8px">'+btn('🔮 Rün Ustası’na git','run','alt')+'</div>';return s}
function upHtml(){var h=hm(),l=L(),nx=LV[h.lv+1];if(!nx)return'<div class="it"><div class="t"><b>👑 '+l.n+'</b><br><small>Evin en yüksek seviyede. Depo '+l.cap+', raf '+l.sh+', altar +%'+Math.round(l.rune*100)+'.</small></div></div>';
  var c=nx.c,ok=true,s='<div class="it"><div class="t"><b>'+l.n+' → '+nx.n+'</b><br><small>Depo '+l.cap+'→'+nx.cap+' · Raf '+l.sh+'→'+nx.sh+' · Altar +%'+Math.round(l.rune*100)+'→+%'+Math.round(nx.rune*100)+' · Dinlenme XP +%'+Math.round((.10+l.rest)*100)+'→+%'+Math.round((.10+nx.rest)*100)+'</small></div></div>';
  Object.keys(c).forEach(function(k){var n=k==='gold'?P.gold:(P[k]||0),g=n>=c[k];if(!g)ok=false;s+='<div class="it"><div class="t">'+(k==='gold'?'🪙 Altın':Y.MATS[k].ic+' '+Y.MATS[k].n)+'</div><b style="color:'+(g?'#7dff9b':'#ff8f8f')+'">'+n+' / '+c[k]+'</b></div>'});
  return s+'<div class="row" style="margin-top:8px">'+btn('⬆ '+nx.n+'’a yükselt','up','',ok?'':' disabled')+'</div>'}

function act(a){var p=a.split('|'),k=p[0],h=hm(),l=L();
  if(k==='t'){T=p[1];draw();return}
  if(k==='buy'){var pl=plotOf(p[1]),i=PL.indexOf(pl),pr=price(i),cost=h?Math.max(0,pr-Math.round((h.paid||0)*.6)):pr;if(!pl||P.gold<cost)return;
    if(h&&(used(h)||h.sh.length||h.till)){say('Taşınmadan önce depoyu, rafları ve kasayı boşalt.');return}
    var keep=h;P.gold-=cost;P.hm={pl:pl.id,lv:keep?keep.lv:1,paid:pr,dp:{},vg:keep?keep.vg:0,sh:[],till:0,lt:Date.now(),rb:keep?keep.rb:0,rc:0,dg:keep?keep.dg:0,sold:keep?keep.sold:0,lg:[]};
    place();say('🏠 '+pl.n+' arsasına yerleştin! Kasabanın dışında evine git, kapıda E/✋ ile gir.');save();draw();return}
  if(k==='sell'){if(!h||used(h)||h.sh.length||h.till||h.vg){say('Önce depoyu, rafları, kasayı ve altın kasasını boşalt.');return}P.gold+=Math.round((h.paid||0)*.6);P.hm=null;place();save();say('Evini sattın.');draw();return}
  if(!h)return;
  if(k==='pi'){var key=p[1],q=Math.min(+p[2],have(key));if(!valid(key)||q<1||used(h)+q>l.cap){if(q>=1)say('Depo dolu. Evi geliştir!');return}take(key,q);h.dp[key]=(h.dp[key]||0)+q}
  else if(k==='po'){var key2=p[1],q2=Math.min(+p[2],h.dp[key2]||0);if(!valid(key2)||q2<1)return;h.dp[key2]-=q2;if(!h.dp[key2])delete h.dp[key2];put(key2,q2)}
  else if(k==='vg'){var g=p[1]==='all'?P.gold:Math.min(+p[1],P.gold);if(g<1)return;P.gold-=g;h.vg+=g}
  else if(k==='vw'){P.gold+=h.vg;h.vg=0}
  else if(k==='rest'){var now=Date.now();if(now<h.rc)return;h.rc=now+3e5;h.rb=now+12e5;if(D.G)D.G.hp=D.S().maxhp;say('🛏 Dinlendin: canın doldu, 20 dk +%'+Math.round((.10+l.rest)*100)+' XP.')}
  else if(k==='chest'){if(h.dg===day())return;h.dg=day();var lv=h.lv,got=[],g2=40*lv+Math.floor(Math.random()*60*lv);P.gold+=g2;got.push('🪙'+g2);
    [['wood',20],['stone',15],['i_copper',3],['crystal',1]].forEach(function(m,i){if(i<2+Math.min(lv,2)){var n=Math.max(1,Math.round(m[1]*lv/2*(.6+Math.random()*.8)));P[m[0]]=(P[m[0]]||0)+n;got.push(Y.MATS[m[0]].ic+n)}});
    if(window.YR&&Math.random()<.2+.07*lv){var pool=Object.keys(YR.R).filter(function(x){return YR.R[x].r<=(lv>=3?2:1)}),id=pool[Math.floor(Math.random()*pool.length)];P.rn[id]=(P.rn[id]||0)+1;got.push('🔮 '+YR.R[id].n+' rünü!')}
    say('🎁 Ev Sandığı: '+got.join(' · '))}
  else if(k==='till'){P.gold+=h.till;say('🛒 Mağaza kasasından 🪙'+h.till+' aldın.');h.till=0}
  else if(k==='sa'){var key3=p[1];if(h.sh.length>=l.sh||!h.dp[key3])return;h.sh.push({k:key3,q:h.dp[key3],p:Math.round(val(key3)*1.2)});delete h.dp[key3]}
  else if(k==='sb'){var s2=h.sh[+p[1]];if(!s2)return;h.dp[s2.k]=(h.dp[s2.k]||0)+s2.q;h.sh.splice(+p[1],1)}
  else if(k==='pp'){var s3=h.sh[+p[1]];if(!s3)return;var o3=s3.p,d3=+p[2];s3.p=Math.max(1,Math.round(o3*(d3>0?1.1:.9)));if(s3.p===o3)s3.p=Math.max(1,o3+d3)}
  else if(k==='up'){var nx=LV[h.lv+1];if(!nx)return;for(var m in nx.c){if((m==='gold'?P.gold:(P[m]||0))<nx.c[m])return}for(var m2 in nx.c){if(m2==='gold')P.gold-=nx.c[m2];else P[m2]-=nx.c[m2]}h.lv++;place();say('🏠 Evin '+LV[h.lv].n+' oldu! Depo, raf ve altar güçlendi.')}
  else if(k==='run'){D.openNpc('rune');return}
  else if(k==='cdep'){if(window.YSoc)YSoc.openDepot();return}
  save();draw()}
window.YH={init:init,open:open,safe:safe,xpx:xpx,runeMul:runeMul,put:put,take:take,have:have,valid:valid,LV:LV,PL:PL,price:price,simulate:simulate,dbg:function(){return{h:hm(),pos:pos}}};
})();
