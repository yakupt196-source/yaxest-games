/* Yaxest Diyarı · Yeni sistemler: sınıf ekipmanı, ikinci el pazarı, canavar yumurtaları, zindan görselleri ve boss mekanikleri */
(function(){
var Y=window.YD,D=null,showAll=false,mTab=0,tEgg=0;
var CIC={savasci:'sword',tank:'shield',buyucu:'orb',sifaci:'cross',suikastci:'dagger'};
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function PL(){return D&&D.P}
function cn(c){return Y.CLASSES[c]?Y.CLASSES[c].n:c}
function costVal(c){var v=0;if(!c)return 0;for(var x in c)v+=x==='gold'?c[x]:(Y.MATS[x]?Y.MATS[x].v:0)*c[x];return v}
function costTxt(c){var t='';if(!c)return'';Object.keys(c).forEach(function(k){t+=(k==='gold'?'🪙':Y.MATS[k].ic)+c[k]+' '});return t}
function hasC(P,c){for(var k in c)if((k==='gold'?P.gold:(P[k]||0))<c[k])return false;return true}
function payC(P,c){for(var k in c){if(k==='gold')P.gold-=c[k];else P[k]-=c[k]}}

/* ---------- eşya anahtarları: w:sınıf:kademe (silah), z:sınıf:kademe (zırh), e:canavar (yumurta) ---------- */
var YK={};
YK.valid=function(k){var a=String(k).split(':');if(a[0]==='w')return !!(Y.WEAPONS[a[1]]&&Y.WEAPONS[a[1]][+a[2]]);if(a[0]==='z')return !!(Y.ARMOR[a[1]]&&Y.ARMOR[a[1]][+a[2]]);if(a[0]==='e')return !!Y.PETD[a[1]];return false};
YK.def=function(k){var a=k.split(':');return a[0]==='w'?Y.WEAPONS[a[1]][+a[2]]:a[0]==='z'?Y.ARMOR[a[1]][+a[2]]:Y.PETD[a[1]]};
YK.name=function(k){var a=k.split(':'),d=YK.def(k);return a[0]==='e'?d.n+' Yumurtası':d.n};
YK.ic=function(k,sz){var a=k.split(':');if(a[0]==='w')return YA.ico(CIC[a[1]],sz||26);if(a[0]==='z')return YA.ico('armor',sz||26);return'<span style="font-size:'+((sz||26)*.8)+'px">'+(Y.PETD[a[1]].boss?'👑':'🥚')+'</span>'};
YK.req=function(k){var a=k.split(':'),d=YK.def(k);return a[0]==='e'?{lv:d.ml,cls:null}:{lv:d.lv,cls:a[1]}};
YK.val=function(k){var a=k.split(':'),d=YK.def(k);if(a[0]==='e')return Math.round(Y.eggPrice(a[1])*.5);return Math.round(costVal(d.c)*.8)};
YK.store=function(P,t){if(t==='w'){P.ow=P.ow||{};return P.ow}if(t==='z'){P.oz=P.oz||{};return P.oz}P.pe=P.pe||{};return P.pe};
YK.have=function(P,k){var a=k.split(':'),s=YK.store(P,a[0]);return a[0]==='e'?(s[a[1]]||0):(s[a[1]+':'+a[2]]?1:0)};
YK.put=function(P,k,q){var a=k.split(':'),s=YK.store(P,a[0]);if(a[0]==='e')s[a[1]]=(s[a[1]]||0)+q;else s[a[1]+':'+a[2]]=1};
YK.take=function(P,k,q){var a=k.split(':'),s=YK.store(P,a[0]);if(a[0]==='e')s[a[1]]=Math.max(0,(s[a[1]]||0)-q);else delete s[a[1]+':'+a[2]]};
/* satılabilir/takas edilebilir (kuşanılmamış) ekipman ve yumurtalar */
YK.items=function(P){var l=[],k;YK.store(P,'w');YK.store(P,'z');YK.store(P,'e');
  Object.keys(P.ow).forEach(function(x){var a=x.split(':');if(!P.ow[x]||+a[1]===0||(a[0]===P.cls&&+a[1]===(P.wt||0)))return;k='w:'+x;if(YK.valid(k))l.push({k:k,q:1})});
  Object.keys(P.oz).forEach(function(x){var a=x.split(':');if(!P.oz[x]||+a[1]===0||(a[0]===P.cls&&+a[1]===(P.at||0)))return;k='z:'+x;if(YK.valid(k))l.push({k:k,q:1})});
  Object.keys(P.pe).forEach(function(x){if(P.pe[x]>0&&Y.PETD[x])l.push({k:'e:'+x,q:P.pe[x]})});return l};
YK.fix=function(P){P.ow=P.ow||{};P.oz=P.oz||{};P.pe=P.pe||{};P.sh=P.sh||[];P.at=P.at||0;P.wt=P.wt||0;
  P.wt=Y.effT(Y.WEAPONS[P.cls]||[{lv:1}],P.wt,P.lv);P.at=Y.effT(Y.ARMOR[P.cls]||[{lv:1}],P.at,P.lv)};
YK.canUse=function(P,k){var r=YK.req(k);return P.lv>=r.lv&&(!r.cls||r.cls===P.cls)};
window.YK=YK;

/* ---------- Demirci: sınıfa özel silah ve zırh kademeleri ---------- */
function rarCol(r){return Y.RARITY[Math.min(r,Y.RARITY.length-1)].c}
function tierRows(P,kind){var arr=kind==='w'?Y.WEAPONS[P.cls]:Y.ARMOR[P.cls],eq=kind==='w'?(P.wt||0):(P.at||0),st=kind==='w'?P.ow:P.oz,best=Y.effT(arr,99,P.lv),h='';
  arr.forEach(function(w,t){var own=t===0||st[P.cls+':'+t],cur=eq===t;if(!showAll&&!own&&!cur&&!(t>=best-1&&t<=best+2))return;
    var ok=own?P.lv>=w.lv:(w.c&&P.lv>=w.lv&&hasC(P,w.c)),lock=P.lv<w.lv,st2=kind==='w'?'Hasar ×'+w.m:'Can ×'+w.h.toFixed(2)+' · Hasar azaltma +%'+Math.round(w.r*100);
    h+='<div class="it" style="'+(lock&&!own?'opacity:.6':'')+'"><span>'+(kind==='w'?YA.ico(CIC[P.cls],24):YA.ico('armor',24))+'</span><div class="t"><span style="color:'+rarCol(w.rar)+'"><b>'+esc(w.n)+'</b></span> <small>('+Y.RARITY[Math.min(w.rar,Y.RARITY.length-1)].n+')</small><br><small>'+st2+' · <b style="color:'+(lock?'#ff6b6b':'#7dff9b')+'">Seviye '+w.lv+(lock?' gerekir':'')+'</b>'+(own?'':' · '+costTxt(w.c))+'</small></div><button class="btn'+(cur?' alt':'')+'" data-g'+kind+'="'+t+'" '+((cur||!ok)?'disabled':'')+' type="button">'+(cur?'Kuşanıldı':own?(lock?'Sv '+w.lv:'Kuşan'):(lock?'Sv '+w.lv:'Yap'))+'</button></div>'});return h}
YK.gearHtml=function(){var P=PL(),h='';
  h+='<div class="it"><div class="t"><b>'+YA.ico(CIC[P.cls],20)+' Silah ve Zırh · '+esc(cn(P.cls))+'</b><br><small>Sınıfına özel '+Y.WEAPONS[P.cls].length+' kademe silah ve zırh var. Seviyen yetmeyen ekipman kuşanılamaz. Eski ekipmanını İkinci El Pazarı\'nda satabilirsin.</small></div><button class="btn alt" data-gall type="button">'+(showAll?'Daralt':'Tümü')+'</button></div>';
  h+='<div class="it"><div class="t"><b>⚔️ '+(P.cls==='buyucu'||P.cls==='sifaci'?'Asalar':P.cls==='suikastci'?'Hançerler':P.cls==='tank'?'Kalkanlar':'Kılıçlar')+'</b></div></div>'+tierRows(P,'w');
  h+='<div class="it"><div class="t"><b>🛡️ Zırhlar</b></div></div>'+tierRows(P,'z');return h};
YK.gearBind=function(el,redraw){var P=PL();
  var a=el.querySelector('[data-gall]');if(a)a.onclick=function(){showAll=!showAll;redraw()};
  ['w','z'].forEach(function(kind){el.querySelectorAll('[data-g'+kind+']').forEach(function(b){b.onclick=function(){var t=+b.dataset['g'+kind],arr=kind==='w'?Y.WEAPONS[P.cls]:Y.ARMOR[P.cls],w=arr[t],st=kind==='w'?P.ow:P.oz,key=P.cls+':'+t;
    if(P.lv<w.lv){D.say(w.n+' için seviye '+w.lv+' gerekir.','sys');return}
    if(!(t===0||st[key])){if(!w.c||!hasC(P,w.c))return;payC(P,w.c);st[key]=1;D.say(w.n+' yapıldı!','sys')}
    if(kind==='w')P.wt=t;else P.at=t;D.say(w.n+' kuşanıldı.','sys');D.saveNow();redraw()}})})};

/* ---------- İkinci El Pazarı ---------- */
function slot(){return Math.floor(Date.now()/9e5)}
function stock(P){var s=slot(),r=function(i){return Y.hash(s,i,731+(P.lv>>3))},l=[],i,tries=0;
  var tiers=[];['w','z'].forEach(function(t){var arr=t==='w'?Y.WEAPONS[P.cls]:Y.ARMOR[P.cls];arr.forEach(function(w,ti){if(ti>0&&w.lv>=P.lv-28&&w.lv<=P.lv+14)tiers.push(t+':'+P.cls+':'+ti)})});
  for(i=0;i<5&&tiers.length;i++){var k=tiers[Math.floor(r(i)*tiers.length)];if(!l.some(function(x){return x.k===k}))l.push({k:k,pr:Math.round(YK.val(k)*1.5)})}
  var cl=Object.keys(Y.CLASSES);for(i=0;i<2;i++){var c2=cl[Math.floor(r(20+i)*cl.length)],arr2=Y.WEAPONS[c2],t2=1+Math.floor(r(30+i)*Math.min(arr2.length-1,Math.max(2,Math.floor(P.lv/8)+2))),k2=(r(40+i)<.5?'w':'z')+':'+c2+':'+t2;if(!l.some(function(x){return x.k===k2}))l.push({k:k2,pr:Math.round(YK.val(k2)*1.5)})}
  var pk=Object.keys(Y.PETD).filter(function(x){var p=Y.PETD[x];return !p.boss&&p.r<=2&&p.ml<=P.lv+8});
  for(i=0;i<2&&pk.length;i++){var e='e:'+pk[Math.floor(r(50+i)*pk.length)];if(!l.some(function(x){return x.k===e}))l.push({k:e,pr:Math.round(Y.eggPrice(e.split(':')[1])*.9)})}
  return l}
function sold(P,i){return P.sb&&P.sb.s===slot()&&P.sb.n.indexOf(i)>=0}
YK.market=function(){var P=PL();YK.fix(P);var h='',tabs=['💰 Sat','🛒 Satın Al','↩ Geri Al'];
  h+='<div class="row" style="margin:0 0 8px">'+tabs.map(function(t,i){return'<button class="btn'+(i===mTab?'':' alt')+'" data-mt="'+i+'" style="min-height:36px;padding:0 12px" type="button">'+t+'</button>'}).join('')+'</div>';
  h+='<p class="sub">🏷️ İkinci El Pazarı: eski silah, zırh ve yumurtalarını bırak, yeni ihtiyacını uygun fiyata bul. Her ekipman seviyene ve sınıfına göre kilitlidir.</p><div class="it"><div class="t">🪙 <b>'+P.gold+'</b></div></div>';
  if(mTab===0){var it=YK.items(P);if(!it.length)h+='<p class="sub">Satılacak kuşanılmamış ekipman ya da yumurta yok.</p>';
    it.forEach(function(x){var pr=Math.max(1,Math.round(YK.val(x.k)*.45));h+='<div class="it"><span>'+YK.ic(x.k)+'</span><div class="t">'+esc(YK.name(x.k))+(x.q>1?' ×'+x.q:'')+'<br><small>Sv '+YK.req(x.k).lv+(YK.req(x.k).cls?' · '+esc(cn(YK.req(x.k).cls)):'')+' · Teklif 🪙'+pr+'</small></div><button class="btn" data-ms="'+x.k+'|'+pr+'" type="button">Sat</button></div>'})}
  else if(mTab===1){var st=stock(P),left=Math.max(0,Math.ceil((9e5-(Date.now()%9e5))/60000));h+='<p class="sub">Vitrin '+left+' dk sonra yenilenir.</p>';
    st.forEach(function(x,i){var r=YK.req(x.k),gone=sold(P,i),lock=P.lv<r.lv||(r.cls&&r.cls!==P.cls),why=P.lv<r.lv?'Sv '+r.lv+' gerekir':(r.cls&&r.cls!==P.cls)?cn(r.cls)+' sınıfı':'';
      h+='<div class="it" style="'+((lock||gone)?'opacity:.6':'')+'"><span>'+YK.ic(x.k)+'</span><div class="t">'+esc(YK.name(x.k))+'<br><small>Sv '+r.lv+(r.cls?' · '+esc(cn(r.cls)):'')+' · 🪙'+x.pr+(why?' · <b style="color:#ff6b6b">'+why+'</b>':'')+'</small></div><button class="btn" data-mb="'+i+'" '+((lock||gone||P.gold<x.pr)?'disabled':'')+' type="button">'+(gone?'Satıldı':'Al')+'</button></div>'})}
  else{if(!P.sh.length)h+='<p class="sub">Geri alınacak eşya yok. Sattığın son 12 eşya burada kalır.</p>';
    P.sh.forEach(function(x,i){var lock=P.lv<YK.req(x.k).lv;h+='<div class="it"><span>'+YK.ic(x.k)+'</span><div class="t">'+esc(YK.name(x.k))+'<br><small>Geri alma 🪙'+x.pr+'</small></div><button class="btn alt" data-mr="'+i+'" '+(P.gold<x.pr?'disabled':'')+' type="button">Geri al</button></div>'})}
  return h};
YK.marketBind=function(el,redraw){var P=PL();
  el.querySelectorAll('[data-mt]').forEach(function(b){b.onclick=function(){mTab=+b.dataset.mt;redraw()}});
  el.querySelectorAll('[data-ms]').forEach(function(b){b.onclick=function(){var a=b.dataset.ms.split('|'),k=a[0],pr=+a[1];if(!YK.have(P,k))return;YK.take(P,k,1);P.gold+=pr;P.sh.unshift({k:k,pr:Math.round(pr*1.25)});if(P.sh.length>12)P.sh.pop();D.say(YK.name(k)+' satıldı: +🪙'+pr,'sys');D.saveNow();redraw()}});
  el.querySelectorAll('[data-mb]').forEach(function(b){b.onclick=function(){var i=+b.dataset.mb,x=stock(P)[i];if(!x||sold(P,i)||P.gold<x.pr||!YK.canUse(P,x.k))return;P.gold-=x.pr;YK.put(P,x.k,1);if(!P.sb||P.sb.s!==slot())P.sb={s:slot(),n:[]};P.sb.n.push(i);D.say(YK.name(x.k)+' satın alındı.','sys');D.saveNow();redraw()}});
  el.querySelectorAll('[data-mr]').forEach(function(b){b.onclick=function(){var i=+b.dataset.mr,x=P.sh[i];if(!x||P.gold<x.pr)return;P.gold-=x.pr;YK.put(P,x.k,1);P.sh.splice(i,1);D.say(YK.name(x.k)+' geri alındı.','sys');D.saveNow();redraw()}})};

/* ---------- Ticarethane: yumurta pazarı ---------- */
function eggStock(P){var s=Math.floor(Date.now()/6e5),l=[],pk=Object.keys(Y.PETD).filter(function(x){var p=Y.PETD[x];return !p.boss&&p.r<=3&&p.ml<=P.lv+12&&p.ml>=P.lv-40});
  for(var i=0;i<6&&pk.length;i++){var k=pk[Math.floor(Y.hash(s,i,913+(P.lv>>2))*pk.length)];if(l.indexOf(k)<0)l.push(k)}return l}
YK.eggShop=function(){var P=PL(),h='<p class="sub">🥚 Canavar yumurtaları çok nadir ve pahalıdır. Seviyen yeterli olmayan yumurtayı çatlatamazsın. Stok 10 dakikada bir değişir.</p>';
  var st=eggStock(P);if(!st.length)h+='<p class="sub">Şu an satışta yumurta yok.</p>';
  st.forEach(function(k){var p=Y.PETD[k],pr=Y.eggPrice(k),lock=P.lv<p.ml;h+='<div class="it" style="'+(lock?'opacity:.6':'')+'"><span style="font-size:1.4rem">🥚</span><div class="t"><b style="color:'+['#9aa5c0','#5ab0ff','#c07bff','#ffb43a','#ff5ccf'][p.r]+'">'+esc(p.n)+'</b> <small>('+['Sıradan','Nadir','Epik','Efsane','Gizli'][p.r]+')</small><br><small>Sv '+p.ml+' · 🪙'+pr+(lock?' · <b style="color:#ff6b6b">Seviye '+p.ml+' gerekir</b>':'')+'</small></div><button class="btn" data-eb="'+k+'" '+((lock||P.gold<pr)?'disabled':'')+' type="button">Al</button></div>'});
  return h};
YK.eggShopBind=function(el,redraw){var P=PL();el.querySelectorAll('[data-eb]').forEach(function(b){b.onclick=function(){var k=b.dataset.eb,p=Y.PETD[k],pr=Y.eggPrice(k);if(!p||P.lv<p.ml||P.gold<pr)return;P.gold-=pr;YK.put(P,'e:'+k,1);D.say('🥚 '+p.n+' yumurtası alındı.','sys');D.saveNow();redraw()}})};

/* ---------- Yoldaş paneli: yumurta envanteri, kuluçka ---------- */
YK.eggHtml=function(){var P=PL(),X=P.x2,h='',ks=Object.keys(P.pe||{}).filter(function(k){return P.pe[k]>0&&Y.PETD[k]});
  if(!ks.length)return'<p class="sub">🥚 Canavar yumurtası yok. Canavarlar çok nadir yumurta düşürür; bosslar daha sık. Ticarethane\'den de alabilirsin.</p>';
  h+='<h3 style="margin:6px 0">🥚 Canavar Yumurtaları</h3>';
  ks.forEach(function(k){var p=Y.PETD[k],lock=P.lv<p.ml,busy=X.eg.filter(function(e){return e.sp}).length>=4;h+='<div class="it"><span style="font-size:1.5rem">'+(p.boss?'👑':'🥚')+'</span><div class="t"><b>'+esc(p.n)+' Yumurtası</b> ×'+P.pe[k]+'<br><small>Sv '+p.ml+' · Kuluçka '+Y.EGGMIN[p.r]+' dk'+(lock?' · <b style="color:#ff6b6b">Seviye '+p.ml+' gerekir</b>':'')+'</small></div><button class="btn" data-inc="'+k+'" '+((lock||busy)?'disabled':'')+' type="button">Kuluçkaya yatır</button></div>'});return h};
YK.eggBind=function(el,rerender){var P=PL(),X=P.x2;el.querySelectorAll('[data-inc]').forEach(function(b){b.onclick=function(){var k=b.dataset.inc,p=Y.PETD[k];if(!p||!P.pe[k]||P.lv<p.ml)return;P.pe[k]--;X.eg.push({at:Date.now()+Y.EGGMIN[p.r]*60000,lk:0,sp:k});D.say('🥚 '+p.n+' yumurtası kuluçkaya yatırıldı ('+Y.EGGMIN[p.r]+' dk).','sys');D.saveNow();rerender()}})};

/* yumurta düşürme: canavar öldüğünde */
YK.kill=function(m){var P=PL(),G=D&&D.G;if(!P||!m||!Y.PETD[m.type]||m.type==='metin')return;var X=P.x2||{},lk=X.lk&&X.lk>Date.now()?1.5:1,ch=Y.eggChance(m.type,m.lv,P.lv,!!m.xm,G&&G.mode==='dungeon')*lk;
  if(Math.random()<ch){YK.put(P,'e:'+m.type,1);var p=Y.PETD[m.type];D.say('🥚 '+p.n+' yumurtası düştü! (Yoldaş panelinden kuluçkaya yatır)','sys');D.floatTxt(m.x,m.y-40,'🥚 Yumurta!','#ffb43a');if(D.banner)D.banner('🥚 '+p.n+' Yumurtası','Çok nadir bir ganimet!');D.saveNow()}};

/* ---------- genel canavar/pet çizimi ---------- */
var SHAPE={mushroom:['blob','cap'],frog:['quad',''],snail:['blob','shell'],goblin:['biped','ears'],snake:['snake',''],beetle:['bug','horn'],wisp:['ghost','glow'],harpy:['bird',''],gargoyle:['biped','wing'],
 icewolf:['quad','ice'],yeti:['biped','fur'],frostwraith:['ghost','ice'],iceelem:['golem','ice'],mammoth:['quad','tusk'],frostdrake:['drake','ice'],
 sandworm:['snake','mouth'],cobra:['snake','hood'],mummy:['biped','wrap'],sandelem:['golem','dots'],sphinx:['quad','crown'],djinn:['ghost','turban'],
 bogtoad:['quad','dots'],leech:['snake','mouth'],croc:['quad','jaw'],hag:['biped','hat'],fenbeast:['golem','dots'],swampdrake:['drake','dots'],
 magmaslime:['blob','fire'],imp:['biped','horn'],lavagolem:['golem','fire'],hellhound:['quad','fire'],salamander:['quad','fire'],lavadrake:['drake','fire'],
 warden:['biped','armor'],frostking:['biped','crown'],pharaoh:['biped','crown'],hydra:['drake','heads'],magmalord:['golem','crown'],stormtitan:['golem','bolt'],elder:['golem','runes'],voidlord:['ghost','crown'],yaxest:['drake','crown']};
function shade(h,f){var n=parseInt(String(h).replace('#',''),16);if(isNaN(n))return h;var r=Math.min(255,Math.round((n>>16&255)*f)),g=Math.min(255,Math.round((n>>8&255)*f)),b=Math.min(255,Math.round((n&255)*f));return'rgb('+r+','+g+','+b+')'}
function E(c,x,y,rx,ry,col,o){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,6.3);c.fill();if(o!==0){c.lineWidth=2;c.strokeStyle='#17102a';c.stroke()}}
function eye(c,x,y,r,hit){c.fillStyle=hit?'#ff6b6b':'#fff';c.beginPath();c.arc(x,y,r,0,6.3);c.fill();c.fillStyle='#17102a';c.beginPath();c.arc(x+r*.25,y,r*.55,0,6.3);c.fill()}
function tri(c,x1,y1,x2,y2,x3,y3,col){c.fillStyle=col;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.lineTo(x3,y3);c.closePath();c.fill();c.lineWidth=1.5;c.strokeStyle='#17102a';c.stroke()}
function accessory(c,acc,u,t,col,top,hx,hy){
  if(acc==='fire'){for(var i=-2;i<=2;i++){var fl=Math.sin(t*9+i)*u*2;tri(c,u*i*4-u*2,top+u*2,u*i*4,top-u*(8+Math.abs(2-Math.abs(i)))+fl,u*i*4+u*2,top+u*2,i%2?'#ffb02e':'#ff5a1e')}}
  else if(acc==='ice'){for(var j=-2;j<=2;j++)tri(c,u*j*4-u*2,top+u*3,u*j*4,top-u*(7+(j%2?2:5)),u*j*4+u*2,top+u*3,'#d8f4ff')}
  else if(acc==='crown'){c.fillStyle='#ffd23f';c.beginPath();c.moveTo(hx-u*8,hy-u*7);c.lineTo(hx-u*8,hy-u*15);c.lineTo(hx-u*4,hy-u*10);c.lineTo(hx,hy-u*17);c.lineTo(hx+u*4,hy-u*10);c.lineTo(hx+u*8,hy-u*15);c.lineTo(hx+u*8,hy-u*7);c.closePath();c.fill();c.lineWidth=1.5;c.strokeStyle='#17102a';c.stroke()}
  else if(acc==='horn'||acc==='horns'){tri(c,hx-u*6,hy-u*5,hx-u*8,hy-u*14,hx-u*2,hy-u*7,'#f2e6c8');tri(c,hx+u*6,hy-u*5,hx+u*8,hy-u*14,hx+u*2,hy-u*7,'#f2e6c8')}
  else if(acc==='hat'){tri(c,hx-u*10,hy-u*6,hx,hy-u*22,hx+u*10,hy-u*6,'#4a2a6a');c.fillStyle='#2a1a3a';c.fillRect(hx-u*12,hy-u*7,u*24,u*3)}
  else if(acc==='bolt'){c.strokeStyle='#fff6a8';c.lineWidth=2;c.beginPath();c.moveTo(hx-u*6,hy-u*14);c.lineTo(hx,hy-u*8);c.lineTo(hx-u*3,hy-u*8);c.lineTo(hx+u*5,hy-u*2);c.stroke()}
  else if(acc==='runes'||acc==='glow'){c.globalAlpha=.5+.3*Math.sin(t*4);E(c,hx,hy,u*14,u*14,'#b0ffd0',0);c.globalAlpha=1}
  else if(acc==='dots'){c.fillStyle='rgba(0,0,0,.25)';for(var k=0;k<5;k++){c.beginPath();c.arc(u*(k*5-10),u*((k*7)%9-3),u*1.6,0,6.3);c.fill()}}
  else if(acc==='wrap'){c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1.6;for(var w=0;w<4;w++){c.beginPath();c.moveTo(-u*9,u*(w*4-4));c.lineTo(u*9,u*(w*4-2));c.stroke()}}
  else if(acc==='tusk'){tri(c,hx+u*2,hy+u*3,hx+u*14,hy+u*6,hx+u*5,hy+u*8,'#f4ecd8')}
  else if(acc==='cap'){E(c,0,-u*10,u*15,u*8,'#d9544d');c.fillStyle='#fff';[[-8,-11],[0,-14],[8,-10]].forEach(function(p){c.beginPath();c.arc(u*p[0],u*p[1],u*2,0,6.3);c.fill()})}
  else if(acc==='shell'){E(c,-u*4,-u*8,u*11,u*10,'#8a5a3a');c.strokeStyle='#5a3a24';c.lineWidth=1.6;c.beginPath();c.arc(-u*4,-u*8,u*5,0,6.3);c.stroke()}
}
function drawArch(c,m,t,u,dir,bob){var col=m.col||m.c||'#999',dk=shade(col,.68),lt=shade(col,1.25),hit=m.hit>0,sp=SHAPE[m.type]||['quad',''],a=sp[0],acc=sp[1],sw=Math.sin(t*9+(m.bob||0))*u*2.2;
  c.scale(dir,1);E(c,0,u*15,u*20,u*5.5,'rgba(0,0,0,.3)',0);
  if(a==='blob'){var sq=1+bob*.07;c.fillStyle=hit?'#fff':col;c.beginPath();c.moveTo(-u*19,u*12);c.bezierCurveTo(-u*20,-u*14*sq,u*20,-u*14*sq,u*19,u*12);c.closePath();c.fill();c.lineWidth=2;c.strokeStyle='#17102a';c.stroke();E(c,-u*7,-u*4*sq,u*5,u*3,'rgba(255,255,255,.4)',0);eye(c,-u*6,0,u*3.6,hit);eye(c,u*6,0,u*3.6,hit);accessory(c,acc,u,t,col,-u*14,0,-u*4)}
  else if(a==='quad'){[[-12,0],[-6,1],[8,0],[14,1]].forEach(function(l,i){c.fillStyle=dk;c.fillRect(u*l[0]-u*2.5,u*5,u*5,u*10+(i%2?sw:-sw))});E(c,0,0,u*19,u*11,hit?'#fff':col);E(c,0,-u*6,u*17,u*4,dk,0);
    c.strokeStyle=dk;c.lineWidth=u*3;c.beginPath();c.moveTo(-u*18,-u*2);c.quadraticCurveTo(-u*26,-u*10+bob,-u*24,-u*16);c.stroke();E(c,u*17,-u*4,u*9,u*8,hit?'#fff':lt);tri(c,u*13,-u*10,u*15,-u*18,u*19,-u*11,dk);eye(c,u*19,-u*6,u*2.2,hit);c.fillStyle='#17102a';c.fillRect(u*23,-u*2,u*4,u*2);accessory(c,acc,u,t,col,-u*12,u*17,-u*4)}
  else if(a==='biped'){c.fillStyle=dk;c.fillRect(-u*7,u*5,u*5,u*10+sw);c.fillRect(u*2,u*5,u*5,u*10-sw);E(c,0,-u*3,u*10,u*12,hit?'#fff':col);E(c,-u*12,-u*3,u*3.5,u*8,dk);E(c,u*12,-u*3,u*3.5,u*8,dk);E(c,0,-u*17,u*8,u*8,hit?'#fff':lt);eye(c,-u*3,-u*17,u*2.2,hit);eye(c,u*3,-u*17,u*2.2,hit);
    if(acc==='ears'){tri(c,-u*8,-u*18,-u*15,-u*21,-u*7,-u*13,col);tri(c,u*8,-u*18,u*15,-u*21,u*7,-u*13,col)}else if(acc==='wing'){tri(c,-u*8,-u*8,-u*24,-u*20+bob*2,-u*8,u*2,dk);tri(c,u*8,-u*8,u*24,-u*20+bob*2,u*8,u*2,dk)}else if(acc==='fur'){c.fillStyle='rgba(255,255,255,.55)';for(var f=0;f<5;f++){c.beginPath();c.arc(u*(f*4-8),-u*2+(f%2)*u*4,u*2.4,0,6.3);c.fill()}}else if(acc==='armor'){c.fillStyle='rgba(180,190,210,.7)';c.fillRect(-u*8,-u*12,u*16,u*12);c.strokeStyle='#17102a';c.strokeRect(-u*8,-u*12,u*16,u*12)}
    accessory(c,acc,u,t,col,-u*25,0,-u*17)}
  else if(a==='snake'){for(var s=6;s>=0;s--){var px=-u*s*6+u*6,py=Math.sin(t*5+s*.8)*u*4,r=u*(8-s*.7);E(c,px,py+u*6,r,r*.9,s%2?col:lt)}E(c,u*10,u*4+Math.sin(t*5)*u*3,u*8,u*7,hit?'#fff':lt);eye(c,u*12,u*1,u*2,hit);if(acc==='hood'){E(c,u*6,u*3,u*11,u*10,dk,1)}if(acc==='mouth'){c.fillStyle='#ff8a8a';c.beginPath();c.arc(u*15,u*5,u*3,0,6.3);c.fill()}else{c.strokeStyle='#ff4a4a';c.lineWidth=1.4;c.beginPath();c.moveTo(u*17,u*5);c.lineTo(u*22,u*3);c.moveTo(u*17,u*5);c.lineTo(u*22,u*7);c.stroke()}}
  else if(a==='bug'){c.strokeStyle=dk;c.lineWidth=2;for(var l=-1;l<=1;l++){c.beginPath();c.moveTo(u*l*6,u*4);c.lineTo(u*l*10,u*14+sw*(l%2?1:-1));c.stroke()}E(c,0,0,u*15,u*11,hit?'#fff':col);c.strokeStyle='rgba(0,0,0,.35)';c.beginPath();c.moveTo(0,-u*10);c.lineTo(0,u*10);c.stroke();E(c,u*15,-u*3,u*6,u*6,dk);eye(c,u*17,-u*5,u*1.8,hit);accessory(c,acc,u,t,col,-u*10,u*15,-u*3)}
  else if(a==='ghost'){var fl=Math.sin(t*3+(m.bob||0))*u*3;c.globalAlpha=.88;c.fillStyle=hit?'#fff':col;c.beginPath();c.moveTo(-u*13,u*14+fl);c.lineTo(-u*13,-u*2+fl);c.quadraticCurveTo(0,-u*26+fl,u*13,-u*2+fl);c.lineTo(u*13,u*14+fl);c.lineTo(u*7,u*10+fl);c.lineTo(0,u*14+fl);c.lineTo(-u*7,u*10+fl);c.closePath();c.fill();c.lineWidth=2;c.strokeStyle='#17102a';c.stroke();c.globalAlpha=1;c.fillStyle=hit?'#ff6b6b':'#fff';c.beginPath();c.ellipse(-u*5,-u*3+fl,u*2.4,u*3,0,0,6.3);c.ellipse(u*5,-u*3+fl,u*2.4,u*3,0,0,6.3);c.fill();accessory(c,acc,u,t,col,-u*16+fl,0,-u*6+fl)}
  else if(a==='bird'){var fw=Math.sin(t*12+(m.bob||0))*u*10;tri(c,-u*4,-u*2,-u*22,-u*10-fw,-u*4,u*6,dk);tri(c,u*4,-u*2,u*22,-u*10-fw,u*4,u*6,dk);E(c,0,0,u*10,u*11,hit?'#fff':col);E(c,u*2,-u*13,u*7,u*7,hit?'#fff':lt);tri(c,u*8,-u*13,u*16,-u*11,u*8,-u*9,'#ffb02e');eye(c,u*4,-u*14,u*1.8,hit)}
  else if(a==='golem'){var st=Math.sin(t*3+(m.bob||0))*u*1.5;c.fillStyle=dk;c.fillRect(-u*12,u*4,u*9,u*11);c.fillRect(u*3,u*4,u*9,u*11);c.fillStyle=hit?'#fff':col;c.beginPath();c.roundRect?c.roundRect(-u*16,-u*10+st,u*32,u*20,u*5):c.rect(-u*16,-u*10+st,u*32,u*20);c.fill();c.lineWidth=2;c.strokeStyle='#17102a';c.stroke();E(c,-u*19,-u*3+st,u*7,u*7,dk);E(c,u*19,-u*3+st,u*7,u*7,dk);E(c,0,-u*17+st,u*8,u*7,lt);c.fillStyle=hit?'#ff6b6b':'#fff6a8';c.fillRect(-u*4,-u*18+st,u*2.6,u*2.2);c.fillRect(u*1.6,-u*18+st,u*2.6,u*2.2);c.globalAlpha=.6+.3*Math.sin(t*4);E(c,0,st,u*5,u*5,'#fff6a8',0);c.globalAlpha=1;accessory(c,acc,u,t,col,-u*24+st,0,-u*17+st)}
  else if(a==='drake'){var fw2=Math.sin(t*5+(m.bob||0))*u*8;tri(c,-u*6,-u*4,-u*24,-u*20-fw2,-u*2,u*4,dk);tri(c,u*4,-u*4,u*22,-u*20-fw2,u*8,u*4,dk);c.strokeStyle=col;c.lineWidth=u*5;c.beginPath();c.moveTo(-u*14,u*2);c.quadraticCurveTo(-u*28,u*8,-u*30,-u*4+bob);c.stroke();E(c,0,0,u*16,u*11,hit?'#fff':col);E(c,0,u*4,u*10,u*6,lt,0);c.strokeStyle=col;c.lineWidth=u*6;c.beginPath();c.moveTo(u*10,-u*4);c.lineTo(u*16,-u*14);c.stroke();E(c,u*18,-u*16,u*8,u*6,hit?'#fff':lt);tri(c,u*14,-u*20,u*12,-u*28,u*18,-u*21,'#f2e6c8');tri(c,u*21,-u*20,u*24,-u*27,u*24,-u*19,'#f2e6c8');eye(c,u*20,-u*17,u*2,hit);
    if(acc==='heads'){E(c,u*8,-u*20,u*6,u*5,lt);eye(c,u*10,-u*21,u*1.6,hit);E(c,u*26,-u*10,u*6,u*5,lt);eye(c,u*28,-u*11,u*1.6,hit)}accessory(c,acc,u,t,col,-u*10,u*18,-u*16)}
}
var _mon=null;
function hookMonster(){if(!window.YA||!YA.monster||YA.monster._yn)return;var orig=YA.monster;_mon=orig;YA.monster=function(ctx,m,t,tx,ty){if(!SHAPE[m.type])return orig(ctx,m,t,tx,ty);var u=m.sz/20,dir=tx>=m.x?1:-1,bob=Math.sin(t*5+(m.bob||0));ctx.save();ctx.translate(m.x,m.y);try{drawArch(ctx,m,t,u,dir,bob)}catch(e){}ctx.restore();
  if(m.xm){ctx.save();ctx.globalAlpha=.35+.2*Math.sin(t*5);ctx.strokeStyle='#ffd23f';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(m.x,m.y+m.sz*.6,m.sz*1.3,m.sz*.5,0,0,6.3);ctx.stroke();ctx.restore()}};YA.monster._yn=1}
/* yoldaş çizimi: canavarın minik hali */
YK.petArt=function(c,id,p,t,sleep){var ty=p.t||id.replace('p_','');var sp=SHAPE[ty];var m={type:ty,col:p.col,hit:0,bob:0};c.save();c.translate(0,2);
  if(sp){try{drawArch(c,m,t,.62,1,Math.sin(t*5))}catch(e){}}
  else{var u=.62;var ot=Y.MON[ty];m.col=p.col;
    /* eski canavarlar için basit yavru gövdesi */
    E(c,0,u*15,u*20,u*5.5,'rgba(0,0,0,.3)',0);E(c,0,0,u*18,u*15,p.col);E(c,0,u*6,u*11,u*7,shade(p.col,1.3),0);eye(c,-u*6,-u*4,u*3.4);eye(c,u*6,-u*4,u*3.4);tri(c,-u*14,-u*10,-u*16,-u*22,-u*6,-u*13,p.col);tri(c,u*14,-u*10,u*16,-u*22,u*6,-u*13,p.col);if(p.boss){tri(c,-u*8,-u*14,0,-u*26,u*8,-u*14,'#ffd23f')}}
  c.restore();return true};

/* ---------- zindan: tema, dekor, tuzak, boss mekanikleri ---------- */
var TH={cave:{a:'#33291f',b:'#2e251c',w:'#120d09',acc:'#e0b06a',dec:'bones'},crystal:{a:'#243049',b:'#202b42',w:'#0d1424',acc:'#6fd6ff',dec:'crystals'},castle:{a:'#3b3a45',b:'#35343f',w:'#15141c',acc:'#ff9a6a',dec:'banners'},crypt:{a:'#2d2b3a',b:'#292736',w:'#100f18',acc:'#8aff9a',dec:'coffins'},ice:{a:'#3a5570',b:'#35506b',w:'#16283a',acc:'#bfeaff',dec:'ice'},desert:{a:'#5a4a30',b:'#54452d',w:'#2a2012',acc:'#ffd25a',dec:'sand'},swamp:{a:'#2c3a2a',b:'#283626',w:'#101a10',acc:'#9aff6a',dec:'swamp'},lava:{a:'#3a2220',b:'#351f1d',w:'#180c0b',acc:'#ff6a2a',dec:'lava'},sky:{a:'#40507a',b:'#3b4a72',w:'#1a2240',acc:'#d8e6ff',dec:'clouds'},temple:{a:'#4a4030',b:'#453c2d',w:'#201a10',acc:'#ffe08a',dec:'rune'},void:{a:'#24123c',b:'#201037',w:'#0a0414',acc:'#c07cff',dec:'void'}};
function th(dg){return TH[(Y.DUNGEONS[dg.id]||{}).th]||TH.cave}
YK.dgTile=function(tx,ty,dg,AW,AH){var T=th(dg);return(tx<1||ty<1||tx>=AW-1||ty>=AH-1)?T.w:((tx+ty)%2?T.a:T.b)};
YK.dgDecor=function(c,G,t,AW,AH,TS){var dg=G.dg,T=th(dg),st=dg.stage||0,i,x,y;
  /* duvar meşaleleri */
  for(i=3;i<AW-2;i+=5){x=(i+.5)*TS;y=TS*.9;var fl=Math.sin(t*9+i)*2;c.fillStyle='rgba(0,0,0,.5)';c.fillRect(x-4,y-4,8,18);var g=c.createRadialGradient(x,y,2,x,y,TS*2.6);g.addColorStop(0,'rgba(255,200,110,.35)');g.addColorStop(1,'rgba(255,200,110,0)');c.fillStyle=g;c.fillRect(x-TS*3,y-TS*3,TS*6,TS*6);c.fillStyle=T.acc;c.beginPath();c.moveTo(x-5,y);c.lineTo(x,y-14-fl);c.lineTo(x+5,y);c.closePath();c.fill()}
  /* sütunlar */
  [[3,4],[AW-4,4],[3,AH-5],[AW-4,AH-5],[Math.floor(AW/2)-5,AH-4],[Math.floor(AW/2)+5,AH-4]].forEach(function(p){x=(p[0]+.5)*TS;y=(p[1]+.5)*TS;c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(x,y+TS*.38,TS*.5,TS*.18,0,0,6.3);c.fill();c.fillStyle=T.w;c.fillRect(x-TS*.28,y-TS*.7,TS*.56,TS*1.05);c.fillStyle=T.acc;c.globalAlpha=.55;c.fillRect(x-TS*.34,y-TS*.78,TS*.68,TS*.1);c.fillRect(x-TS*.34,y+TS*.28,TS*.68,TS*.1);c.globalAlpha=1;c.lineWidth=1.5;c.strokeStyle='rgba(0,0,0,.6)';c.strokeRect(x-TS*.28,y-TS*.7,TS*.56,TS*1.05)});
  /* merkezde rün çemberi */
  x=AW*TS/2;y=AH*TS/2;c.save();c.translate(x,y);c.scale(1,.55);c.strokeStyle=T.acc;c.globalAlpha=.35+.1*Math.sin(t*2);c.lineWidth=3;c.beginPath();c.arc(0,0,TS*3.4,0,6.3);c.stroke();c.setLineDash([10,14]);c.rotate(t*.2);c.beginPath();c.arc(0,0,TS*2.6,0,6.3);c.stroke();c.setLineDash([]);for(i=0;i<6;i++){var a=i/6*6.28+t*.2;c.fillStyle=T.acc;c.fillRect(Math.cos(a)*TS*2.6-4,Math.sin(a)*TS*2.6-4,8,8)}c.restore();c.globalAlpha=1;
  /* temaya göre eşyalar */
  for(var ty=2;ty<AH-1;ty++)for(var tx=2;tx<AW-2;tx++){var h=Y.hash(tx,ty,900+st);if(h>.075)continue;x=(tx+.5)*TS+(h*997%1-.5)*14;y=(ty+.5)*TS+(h*313%1-.5)*14;var k=T.dec;
    if(k==='bones'){c.strokeStyle='#e8e0cc';c.lineWidth=3;c.beginPath();c.moveTo(x-8,y-3);c.lineTo(x+8,y+3);c.moveTo(x-8,y+3);c.lineTo(x+8,y-3);c.stroke();c.fillStyle='#e8e0cc';c.beginPath();c.arc(x,y-6,5,0,6.3);c.fill()}
    else if(k==='crystals'){c.fillStyle=T.acc;c.globalAlpha=.8;c.beginPath();c.moveTo(x,y-18);c.lineTo(x+7,y);c.lineTo(x,y+6);c.lineTo(x-7,y);c.closePath();c.fill();c.globalAlpha=1;c.strokeStyle='#fff';c.lineWidth=1;c.stroke()}
    else if(k==='banners'){c.fillStyle='#8a2a2a';c.fillRect(x-6,y-14,12,22);c.fillStyle='#ffd23f';c.fillRect(x-2,y-8,4,10)}
    else if(k==='coffins'){c.fillStyle='#3a2a2a';c.beginPath();c.moveTo(x-7,y-12);c.lineTo(x+7,y-12);c.lineTo(x+9,y+12);c.lineTo(x-9,y+12);c.closePath();c.fill();c.strokeStyle=T.acc;c.lineWidth=1.4;c.stroke()}
    else if(k==='ice'){tri(c,x-7,y+4,x,y-16,x+7,y+4,'#cfeeff')}
    else if(k==='sand'){c.fillStyle='#c9a24a';c.beginPath();c.moveTo(x-12,y+6);c.lineTo(x,y-10);c.lineTo(x+12,y+6);c.closePath();c.fill()}
    else if(k==='swamp'){c.strokeStyle='#6a9a3a';c.lineWidth=2;for(var r=-1;r<=1;r++){c.beginPath();c.moveTo(x+r*4,y+6);c.lineTo(x+r*5,y-10)}c.stroke();c.fillStyle='rgba(150,255,100,.35)';c.beginPath();c.arc(x+8,y-4-(t*10+tx)%12,2.5,0,6.3);c.fill()}
    else if(k==='lava'){c.strokeStyle=T.acc;c.globalAlpha=.7+.3*Math.sin(t*3+tx);c.lineWidth=3;c.beginPath();c.moveTo(x-10,y);c.lineTo(x-2,y+4);c.lineTo(x+4,y-3);c.lineTo(x+11,y+2);c.stroke();c.globalAlpha=1}
    else if(k==='clouds'){c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(x,y,14,6,0,0,6.3);c.ellipse(x+8,y-3,8,5,0,0,6.3);c.fill()}
    else if(k==='rune'){c.strokeStyle=T.acc;c.globalAlpha=.6;c.lineWidth=2;c.beginPath();c.arc(x,y,7,0,6.3);c.moveTo(x-4,y-3);c.lineTo(x+4,y+3);c.stroke();c.globalAlpha=1}
    else if(k==='void'){c.fillStyle=T.acc;c.globalAlpha=.5+.3*Math.sin(t*2+tx);c.beginPath();c.arc(x,y-4+Math.sin(t*2+ty)*4,5,0,6.3);c.fill();c.globalAlpha=1}}
  /* karanlık kenarlar */
  var vg=c.createRadialGradient(x=AW*TS/2,y=AH*TS/2,TS*6,x,y,TS*17);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,10,.5)');c.fillStyle=vg;c.fillRect(0,0,AW*TS,AH*TS)};
YK.dgFx=function(c,G,t,TS){var dg=G.dg;if(!dg)return;
  if(dg.trap){var ph=dg.trapT%4,on=ph>=2.4&&ph<3.3,warn=ph>=1.2&&ph<2.4;dg.trap.forEach(function(p){var x=p.x*TS,y=p.y*TS;c.fillStyle=on?'rgba(255,70,70,.55)':warn?'rgba(255,200,60,'+(.2+.2*Math.sin(t*14))+')':'rgba(0,0,0,.25)';c.fillRect(x+4,y+4,TS-8,TS-8);if(on){c.fillStyle='#e8e8f0';for(var i=0;i<4;i++){c.beginPath();c.moveTo(x+8+i*9,y+TS-8);c.lineTo(x+12+i*9,y+8);c.lineTo(x+16+i*9,y+TS-8);c.closePath();c.fill()}}})}
  (dg.tel||[]).forEach(function(o){var k=o.t/o.dur;c.fillStyle='rgba(255,60,60,'+(.12+.2*k)+')';c.beginPath();c.arc(o.x,o.y,o.r,0,6.3);c.fill();c.strokeStyle='rgba(255,90,90,.9)';c.lineWidth=3;c.beginPath();c.arc(o.x,o.y,o.r*Math.min(1,.2+k),0,6.3);c.stroke();c.beginPath();c.arc(o.x,o.y,o.r,0,6.3);c.stroke()});
  if(dg.chest&&!dg.chest.open){var ch=dg.chest,b=Math.sin(t*3)*3;c.fillStyle='rgba(255,210,63,.25)';c.beginPath();c.arc(ch.x,ch.y,34+b,0,6.3);c.fill();c.fillStyle='#8a5a2a';c.fillRect(ch.x-20,ch.y-12,40,26);c.fillStyle='#b8782e';c.fillRect(ch.x-20,ch.y-20,40,10);c.fillStyle='#ffd23f';c.fillRect(ch.x-4,ch.y-8,8,10);c.strokeStyle='#17102a';c.lineWidth=2;c.strokeRect(ch.x-20,ch.y-20,40,34);c.fillStyle='#fff';c.font='700 12px "Chakra Petch",sans-serif';c.textAlign='center';c.fillText('Hazine',ch.x,ch.y-30+b)}};
/* boss mekanikleri */
YK.bossTick=function(m,dt){if(!m||m.dead||!m.mech)return;var G=D.G,P=D.P,dg=G.dg;if(!dg)return;m.tm=m.tm||{};var T=m.tm,hp=m.hp/m.max,i;
  var mch=m.mech,has=function(k){return mch.indexOf(k)>=0},tick=function(k,every){T[k]=(T[k]==null?every*.6:T[k])-dt;if(T[k]<=0){T[k]=every;return true}return false};
  var base=m.dmg*Y.lvIn(P.lv,m.lv);
  if(has('summon')&&m.add&&tick('summon',15-(hp<.5?4:0))){var alive=dg.mons.filter(function(x){return !x.dead&&x!==m}).length;if(alive<8){for(i=0;i<(m.add.c||2);i++){var mm=D.mkMon(m.add.t,dg.lv,m.x+(Math.random()-.5)*160,m.y+60+Math.random()*60);mm.sx=mm.x;mm.sy=mm.y;mm.hit=9;mm.hp=mm.max=Math.round(mm.max*(1+.5*(dg.pn-1)));dg.mons.push(mm)}D.floatTxt(m.x,m.y-m.sz-30,'Çağrı!','#ff9d3d');D.addFx({k:'ring',x:m.x,y:m.y,r:120,c:'#ff9d3d',l:.6})}}
  if(has('slam')&&tick('slam',hp<.5?5.5:7.5)){dg.tel.push({x:G.px,y:G.py,r:105,t:0,dur:1.15,dmg:base*1.9,k:'slam'});D.floatTxt(m.x,m.y-m.sz-30,'Ezici Darbe!','#ff5b6e')}
  if(has('nova')&&tick('nova',hp<.5?7:9.5)){dg.tel.push({x:m.x,y:m.y,r:200,t:0,dur:1.4,dmg:base*1.7,k:'nova'});D.floatTxt(m.x,m.y-m.sz-30,'Şok Dalgası!','#ff5b6e')}
  if(has('charge')){if(m.ch){m.ch.t-=dt;var sp=m.ch.s*dt;m.x+=m.ch.dx*sp;m.y+=m.ch.dy*sp;m.x=Math.max(70,Math.min(dg.aw*dg.ts-70,m.x));m.y=Math.max(70,Math.min(dg.ah*dg.ts-70,m.y));if(Math.hypot(m.x-G.px,m.y-G.py)<m.sz+26&&!m.ch.hit){m.ch.hit=1;D.hurt(base*1.6)}if(m.ch.t<=0)m.ch=null}
    else if(tick('charge',8)){var dx=G.px-m.x,dy=G.py-m.y,d=Math.hypot(dx,dy)||1;m.ch={dx:dx/d,dy:dy/d,t:.55,s:620};D.floatTxt(m.x,m.y-m.sz-30,'Atılış!','#ff5b6e')}}
  if(has('heal')&&tick('heal',10)&&m.hp<m.max){var hv=Math.round(m.max*.04);m.hp=Math.min(m.max,m.hp+hv);D.floatTxt(m.x,m.y-m.sz-20,'+'+hv,'#5be39a');D.addFx({k:'ring',x:m.x,y:m.y,r:70,c:'#5be39a',l:.5})}
  if(has('enrage')&&hp<.35&&!m.enr){m.enr=1;m.dmg=Math.round(m.dmg*1.45);m.sp=Math.round(m.sp*1.25);D.floatTxt(m.x,m.y-m.sz-34,'ÖFKE!','#ff3b3b');if(D.banner)D.banner('🔥 '+m.n+' öfkelendi!','Hasarı ve hızı arttı')}};
YK.dgTickFx=function(dt){var G=D.G,dg=G.dg;if(!dg)return;dg.tel=dg.tel||[];
  for(var i=dg.tel.length-1;i>=0;i--){var o=dg.tel[i];o.t+=dt;if(o.t>=o.dur){if(Math.hypot(G.px-o.x,G.py-o.y)<o.r)D.hurt(o.dmg);D.addFx({k:'ring',x:o.x,y:o.y,r:o.r,c:'#ff5b6e',l:.4});dg.tel.splice(i,1)}}
  if(dg.trap){var pr=dg.trapT%4;dg.trapT+=dt;var ph=dg.trapT%4;if(ph>=2.4&&ph<3.3&&!dg.trapHit){var ts=dg.ts;for(var j=0;j<dg.trap.length;j++){var p=dg.trap[j];if(G.px>p.x*ts&&G.px<(p.x+1)*ts&&G.py>p.y*ts&&G.py<(p.y+1)*ts){dg.trapHit=1;D.hurt(dg.trapDmg);D.floatTxt(G.px,G.py-40,'Diken!','#ff5b6e');break}}}if(ph<2)dg.trapHit=0}};
YK.mkTrap=function(dg,AW,AH,ts){var l=[],i=0,n=0;while(n<16&&i<200){i++;var x=2+Math.floor(Math.random()*(AW-4)),y=2+Math.floor(Math.random()*(AH-7));if(!l.some(function(p){return p.x===x&&p.y===y})){l.push({x:x,y:y});n++}}return l};

YK.init=function(api){D=api;hookMonster();
  /* yoldaş tablosuna her canavarın yavrusunu ekle */
  if(window.YX2&&YX2.PETS){var PETS=YX2.PETS,q=['Seninleyim!','Büyüyünce çok güçlü olacağım.','Bana yumurtamı hatırlat.','Hadi avlanalım!','Karnım acıktı.'];Object.keys(Y.PETD).forEach(function(k){var p=Y.PETD[k];PETS[p.id]={n:p.n,r:p.r,col:p.col,b:p.b,q:q,ml:p.ml,mx:10+5*p.r,t:k,gen:1}})}};
YK.hook=hookMonster;
window.YN=YK;
})();
