try{if(/[?&]utm_source=app\b/.test(location.search)||/^android-app:/.test(document.referrer))localStorage.setItem('yx-app','1');window.YX_APP=localStorage.getItem('yx-app')==='1'}catch(e){}
/* Yaxest ekonomi: jeton, mağaza, karakter, temalar. Tüm sayfalarda yüklenir. Veri yalnızca bu cihazda (localStorage 'yx-eco'). */
(function(){
'use strict';
var KEY='yx-eco',T=function(s){try{return window.YT?YT(s):s}catch(e){return s}};
var parts=location.pathname.split('/').filter(Boolean);if(parts.length&&/\.html?$/.test(parts[parts.length-1]))parts.pop();
var cur=parts.pop()||'';
var GL=window.YAXEST_GAMES||[];var isGame=GL.some(function(g){return g.id===cur});

/* ---------- katalog ---------- */
var SP=[['blob','Pıtık',0],['cat','Miyav',60],['robo','Robo',90],['ghost','Hayalet',110],['alien','Uzaylı',140],['dragon','Ejder',200],['elf','Elf',160],['hana','Hana',150],['mika','Mika',150],['yuki','Yuki',180],['ren','Ren',150],['sora','Sora',150],['taro','Taro',180],['vael','Vael',170],['vaela','Vaela',170]];
var COL=[['#ffd23f',0],['#ff5c8a',0],['#3ddbb0',0],['#6aa8ff',12],['#b388ff',12],['#ff9f43',12],['#3df0ff',20],['#f1f1f1',20],['#c3cde0',25]];
var HAT=[['cap','Kep',20],['party','Parti Şapkası',30],['head','Kulaklık',40],['top','Silindir',50],['wiz','Büyücü Şapkası',70],['crown','Taç',120]];
var FACE=[['glasses','Gözlük',20],['mustache','Bıyık',25],['mask','Maske',35],['shades','Güneş Gözlüğü',45],['star','Yıldız Gözlük',60]];
var NECK=[['bow','Papyon',20],['scarf','Atkı',30],['medal','Madalya',60],['cape','Pelerin',80]];
var AURA=[['spark','Parıltı',50],['heart','Kalpler',70],['snow','Kar',80],['fire','Ateş',110]];
var PERK=[
 {id:'sans',n:'Şans',ic:'🍀',d:'Kazandığın her jeton %{0} artar',max:5,cost:[40,80,140,220,320],val:function(l){return l*10}},
 {id:'enerji',n:'Enerji',ic:'⚡',d:'Oynarken jeton daha sık gelir',max:4,cost:[50,100,180,280]},
 {id:'tuccar',n:'Tüccar',ic:'🧾',d:'Mağazada ve Tüp\'te %{0} indirim',max:4,cost:[60,120,200,300],val:function(l){return l*5}},
 {id:'seri',n:'Seri',ic:'🔥',d:'Günlük hediye büyür',max:3,cost:[40,90,160]}];
var CEP=[60,120,200];
var TH={
 neon:{n:'Neon Gece',p:0,e:'🌌',bg:'#0b0820',bg2:'#120d2e',card:'#1a1440',ink:'#f6f3ff',mute:'#a9a3cf',pink:'#ff5c8a',yellow:'#ffd23f',mint:'#3ddbb0',blue:'#6aa8ff',cyan:'#3df0ff'},
 sunset:{n:'Gün Batımı',p:60,e:'🌇',bg:'#1d0b1a',bg2:'#2a0f1f',card:'#3a1426',ink:'#fff1e6',mute:'#e3b7a4',pink:'#ff5e78',yellow:'#ffb347',mint:'#ffd98a',blue:'#ff8e5e',cyan:'#ffc1a1',tint:'rgba(255,94,60,.16)'},
 forest:{n:'Orman',p:60,e:'🌲',bg:'#07150f',bg2:'#0c2218',card:'#12301f',ink:'#eefbe9',mute:'#9cc5a6',pink:'#ff8f6b',yellow:'#c8f169',mint:'#4be0a0',blue:'#6fd3ff',cyan:'#8dffcf',tint:'rgba(40,200,110,.15)'},
 ocean:{n:'Okyanus',p:60,e:'🌊',bg:'#04122b',bg2:'#071b3f',card:'#0b2a5c',ink:'#eaf6ff',mute:'#9ec0e8',pink:'#ff7ab8',yellow:'#ffe066',mint:'#35e0d0',blue:'#59a8ff',cyan:'#7ff3ff',tint:'rgba(40,120,255,.16)'},
 candy:{n:'Şeker',p:100,e:'🍭',bg:'#1c0b2b',bg2:'#2a1140',card:'#3a1858',ink:'#fff0fb',mute:'#d7b3ea',pink:'#ff6ec7',yellow:'#ffe86b',mint:'#7dffd8',blue:'#8aa8ff',cyan:'#8ae9ff',tint:'rgba(255,110,200,.14)'},
 lava:{n:'Lav',p:120,e:'🌋',bg:'#120606',bg2:'#1e0a08',card:'#2c100c',ink:'#fff0e8',mute:'#d1a496',pink:'#ff4d3d',yellow:'#ff9d2e',mint:'#ffd24a',blue:'#ff7a45',cyan:'#ffb36b',tint:'rgba(255,60,20,.16)'},
 retro:{n:'Retro Arcade',p:140,e:'👾',bg:'#020a04',bg2:'#04140a',card:'#06200f',ink:'#b6ffb6',mute:'#5fbf6f',pink:'#7dff7d',yellow:'#39ff14',mint:'#00e676',blue:'#6bff9a',cyan:'#b6ffb6',tint:'rgba(0,255,70,.1)',mono:1,scan:1},
 gold:{n:'Altın',p:250,e:'👑',bg:'#0a0805',bg2:'#14100a',card:'#201a0e',ink:'#fff7e0',mute:'#c9b27a',pink:'#e8c26a',yellow:'#ffd24a',mint:'#f4e3a1',blue:'#d9a441',cyan:'#fff0b3',tint:'rgba(255,200,60,.12)'}
};
var ITEMS={};
function reg(slot,list,named){list.forEach(function(a){var v=a[0];ITEMS[slot+':'+v]={id:slot+':'+v,slot:slot,val:v,name:named?a[1]:'',price:named?a[2]:a[1]}})}
reg('sp',SP,1);reg('col',COL,0);reg('hat',HAT,1);reg('face',FACE,1);reg('neck',NECK,1);reg('aura',AURA,1);
Object.keys(TH).forEach(function(k){ITEMS['th:'+k]={id:'th:'+k,slot:'th',val:k,name:TH[k].n,price:TH[k].p}});

/* ---------- durum ---------- */
function def(){return{c:0,t:0,fr:0,own:{},eq:{sp:'blob',col:'#ffd23f',hat:'',face:'',neck:'',aura:'',th:'neon'},pk:{sans:0,enerji:0,tuccar:0,seri:0},name:'',boost:0,cep:0,daily:'',streak:0,seen:{}}}
function load(){var d=def();try{var s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object'){
  d.c=+s.c||0;d.t=+s.t||0;d.fr=+s.fr||0;d.own=s.own||{};Object.assign(d.eq,s.eq||{});Object.assign(d.pk,s.pk||{});d.name=String(s.name||'').slice(0,14);d.boost=+s.boost||0;d.cep=+s.cep||0;d.daily=s.daily||'';d.streak=+s.streak||0;d.seen=s.seen||{}}}catch(e){}return d}
var S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function emit(k,x){refresh();try{window.dispatchEvent(new CustomEvent('yx-eco',{detail:{k:k,x:x}}))}catch(e){}}
addEventListener('storage',function(e){if(e.key===KEY){S=load();applyTheme(S.eq.th);emit('sync')}});

function owns(id){var it=ITEMS[id];return !!it&&(it.price===0||!!S.own[id])}
function price(p){return p<=0?0:Math.max(1,Math.round(p*(1-S.pk.tuccar*.05)))}
function mult(){return(1+S.pk.sans*.1)*(S.boost>Date.now()?2:1)}
function level(){return 1+Math.floor(Math.sqrt(S.t/12))}
function lvInfo(){var l=level(),a=(l-1)*(l-1)*12,b=l*l*12;return{l:l,p:Math.min(1,(S.t-a)/(b-a)),next:b-S.t}}
function earn(n,why,raw){var v=raw?n:n*mult()+S.fr,a=Math.floor(v);S.fr=raw?S.fr:v-a;if(a<=0){save();return 0}S.c+=a;S.t+=a;save();emit('earn',{n:a,why:why});return a}
function spend(n){n=Math.round(n);if(n<=0)return true;if(S.c<n)return false;S.c-=n;save();emit('spend',{n:n});return true}
function buy(id){var it=ITEMS[id];if(!it)return{ok:false,r:'x'};if(owns(id))return{ok:true,r:'own'};var p=price(it.price);if(S.c<p)return{ok:false,r:'coin',need:p-S.c};
  S.c-=p;S.own[id]=1;save();emit('buy',{id:id});return{ok:true,r:'bought',p:p}}
function equip(slot,val){if(val&&!owns(slot+':'+val))return false;S.eq[slot]=val;save();if(slot==='th')applyTheme(val);emit('equip',{slot:slot,val:val});return true}
function perkBuy(id){var p=PERK.filter(function(k){return k.id===id})[0];if(!p)return{ok:false};var l=S.pk[id];if(l>=p.max)return{ok:false,r:'max'};var c=p.cost[l];if(S.c<c)return{ok:false,r:'coin',need:c-S.c};S.c-=c;S.pk[id]=l+1;save();emit('perk',{id:id});return{ok:true,p:c}}
function boostBuy(){var c=price(25);if(S.c<c)return{ok:false,r:'coin',need:c-S.c};S.c-=c;S.boost=Math.max(Date.now(),S.boost)+15*60000;save();emit('boost');return{ok:true,p:c}}
function cepBuy(){if(S.cep>=CEP.length)return{ok:false,r:'max'};var c=price(CEP[S.cep]);if(S.c<c)return{ok:false,r:'coin',need:c-S.c};S.c-=c;S.cep++;save();emit('cep');return{ok:true,p:c}}
function boxBuy(){var c=price(35);if(S.c<c)return{ok:false,r:'coin',need:c-S.c};
  var pool=Object.keys(ITEMS).filter(function(k){var i=ITEMS[k];return i.price>0&&!S.own[k]&&i.slot!=='th'});
  if(!pool.length)return{ok:false,r:'all'};var id=pool[Math.floor(Math.random()*pool.length)];S.c-=c;S.own[id]=1;save();emit('buy',{id:id});return{ok:true,id:id,p:c}}
function tubeCost(used){return used<S.cep?0:price(4+3*(used-S.cep))}
function hintCost(){return price(3)}

/* ---------- renk yardımcıları ---------- */
function rgb(h){h=h.replace('#','');return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]}
function shade(h,p){var c=rgb(h),t=p<0?0:255,q=Math.abs(p);return'#'+c.map(function(v){return('0'+Math.round(v+(t-v)*q).toString(16)).slice(-2)}).join('')}

/* ---------- karakter çizimi ---------- */
var POS={blob:{T:30,E:52,N:77,dx:12},cat:{T:30,E:52,N:77,dx:13},robo:{T:32,E:53,N:84,dx:10},ghost:{T:24,E:48,N:72,dx:11},alien:{T:18,E:46,N:72,dx:12},dragon:{T:30,E:52,N:77,dx:12},elf:{T:18,E:46,N:69,dx:11},hana:{T:16,E:46,N:69,dx:11},mika:{T:16,E:46,N:69,dx:11},yuki:{T:16,E:46,N:69,dx:11},ren:{T:12,E:46,N:69,dx:11},sora:{T:16,E:46,N:69,dx:11},taro:{T:14,E:46,N:69,dx:11},vael:{T:16,E:46,N:69,dx:11},vaela:{T:16,E:46,N:69,dx:11}};
function eyes(y,dx,r,m){var s='';[50-dx,50+dx].forEach(function(x){s+='<g class="yx-e"><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff"/><circle cx="'+(x+(m==='s'?0:1))+'" cy="'+(y+(m==='s'?1.6:.6))+'" r="'+(r*.55)+'" fill="#1b1535"/><circle cx="'+(x+1.6)+'" cy="'+(y-1.6)+'" r="'+(r*.2)+'" fill="#fff"/></g>'});
  if(m==='s')s+='<path d="M'+(50-dx-r)+' '+(y-r-1)+'L'+(50-dx+r)+' '+(y-r+2)+'M'+(50+dx-r)+' '+(y-r+2)+'L'+(50+dx+r)+' '+(y-r-1)+'" stroke="#1b1535" stroke-width="2.2" stroke-linecap="round"/>';return s}
function mouth(y,m){if(m==='h')return'<path d="M43 '+y+'Q50 '+(y+13)+' 57 '+y+'Z" fill="#7a1f3d"/><path d="M46 '+(y+7)+'Q50 '+(y+4)+' 54 '+(y+7)+'" fill="#ff7a9a"/>';
  if(m==='s')return'<path d="M44 '+(y+5)+'Q50 '+y+' 56 '+(y+5)+'" stroke="#1b1535" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
  return'<path d="M44 '+y+'Q50 '+(y+6)+' 56 '+y+'" stroke="#1b1535" stroke-width="2.4" fill="none" stroke-linecap="round"/>'}
function blush(y,dx){return'<circle cx="'+(50-dx-5)+'" cy="'+y+'" r="3.4" fill="#ff5c8a" opacity=".35"/><circle cx="'+(50+dx+5)+'" cy="'+y+'" r="3.4" fill="#ff5c8a" opacity=".35"/>'}
var BODY={
 blob:function(c,d,l,m){return'<ellipse cx="34" cy="88" rx="9" ry="4.5" fill="'+d+'"/><ellipse cx="66" cy="88" rx="9" ry="4.5" fill="'+d+'"/><path d="M18 80C10 52 26 30 50 30S90 52 82 80C70 91 30 91 18 80Z" fill="'+c+'"/><ellipse cx="50" cy="70" rx="19" ry="12" fill="#fff" opacity=".22"/><path d="M26 44Q32 34 44 33" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".4"/>'+eyes(52,12,6.5,m)+blush(60,12)+mouth(63,m)},
 cat:function(c,d,l,m){return'<path d="M80 82C98 78 98 56 88 52" stroke="'+d+'" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M22 44L26 16L44 31Z" fill="'+c+'"/><path d="M78 44L74 16L56 31Z" fill="'+c+'"/><path d="M27 37L29 23L38 31Z" fill="#ff9fb5"/><path d="M73 37L71 23L62 31Z" fill="#ff9fb5"/><ellipse cx="34" cy="88" rx="9" ry="4.5" fill="'+d+'"/><ellipse cx="66" cy="88" rx="9" ry="4.5" fill="'+d+'"/><path d="M17 80C9 52 26 31 50 31S91 52 83 80C70 91 30 91 17 80Z" fill="'+c+'"/><ellipse cx="50" cy="71" rx="18" ry="11" fill="#fff" opacity=".24"/><path d="M20 58L33 60M20 65L33 63M80 58L67 60M80 65L67 63" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>'+eyes(52,13,6.2,m)+'<path d="M47 59L53 59L50 63Z" fill="#ff7a9a"/>'+mouth(64,m)},
 robo:function(c,d,l,m){var e=m==='s'?'<path d="M34 52L46 56M66 52L54 56" stroke="#7dffe0" stroke-width="3" stroke-linecap="round"/>':'<g class="yx-e"><rect x="34" y="47" width="12" height="13" rx="4" fill="#7dffe0"/><rect x="54" y="47" width="12" height="13" rx="4" fill="#7dffe0"/></g>';
  var mo=m==='h'?'<path d="M42 64Q50 74 58 64Z" fill="#7dffe0"/>':m==='s'?'<path d="M43 69Q50 63 57 69" stroke="#7dffe0" stroke-width="2.6" fill="none" stroke-linecap="round"/>':'<rect x="43" y="65" width="14" height="3.4" rx="1.7" fill="#7dffe0"/>';
  return'<path d="M50 32V19" stroke="'+d+'" stroke-width="3"/><circle cx="50" cy="17" r="4.5" fill="#ff5c8a"/><rect x="34" y="82" width="12" height="9" rx="3" fill="'+d+'"/><rect x="54" y="82" width="12" height="9" rx="3" fill="'+d+'"/><rect x="15" y="50" width="8" height="16" rx="3" fill="'+d+'"/><rect x="77" y="50" width="8" height="16" rx="3" fill="'+d+'"/><rect x="22" y="32" width="56" height="52" rx="14" fill="'+c+'"/><rect x="29" y="39" width="42" height="34" rx="9" fill="#0d1330"/>'+e+mo+'<circle cx="27" cy="79" r="1.6" fill="'+d+'"/><circle cx="73" cy="79" r="1.6" fill="'+d+'"/>'},
 ghost:function(c,d,l,m){return'<path d="M22 88L22 48C22 30 36 22 50 22S78 30 78 48L78 88L69 81L59.5 89L50 81L40.5 89L31 81Z" fill="'+c+'"/><path d="M30 40Q35 29 46 27" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".4"/><ellipse cx="20" cy="62" rx="5" ry="8" fill="'+c+'" transform="rotate(18 20 62)"/><ellipse cx="80" cy="62" rx="5" ry="8" fill="'+c+'" transform="rotate(-18 80 62)"/>'+eyes(48,11,6.4,m)+blush(57,11)+mouth(60,m)},
 alien:function(c,d,l,m){var e='';[[38,-15],[62,15]].forEach(function(p){e+='<g class="yx-e"><ellipse cx="'+p[0]+'" cy="47" rx="8.5" ry="11.5" transform="rotate('+p[1]+' '+p[0]+' 47)" fill="#10102a"/><ellipse cx="'+(p[0]+2)+'" cy="43" rx="2.6" ry="3.4" fill="#fff"/></g>'});
  var mo=m==='h'?'<path d="M44 64Q50 73 56 64Z" fill="#10102a"/>':m==='s'?'<path d="M45 68Q50 63 55 68" stroke="#10102a" stroke-width="2.2" fill="none" stroke-linecap="round"/>':'<path d="M45 65Q50 69 55 65" stroke="#10102a" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
  return'<path d="M40 22Q36 9 28 9M60 22Q64 9 72 9" stroke="'+d+'" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="28" cy="9" r="4" fill="#ff5c8a"/><circle cx="72" cy="9" r="4" fill="#ff5c8a"/><ellipse cx="50" cy="83" rx="15" ry="10" fill="'+d+'"/><ellipse cx="50" cy="44" rx="31" ry="28" fill="'+c+'"/><path d="M28 30Q34 20 46 18" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".35"/>'+e+mo},
 dragon:function(c,d,l,m){return'<path d="M18 62L2 40L24 48Z" fill="'+d+'"/><path d="M82 62L98 40L76 48Z" fill="'+d+'"/><path d="M80 82C96 80 98 64 92 58L88 66" stroke="'+d+'" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M92 58L99 55L94 65Z" fill="#ff5c8a"/><path d="M38 31L42 21L47 31ZM47 31L50 18L53 31ZM53 31L58 21L62 31Z" fill="'+d+'"/><path d="M30 36L26 18L40 30Z" fill="#fff4d6"/><path d="M70 36L74 18L60 30Z" fill="#fff4d6"/><ellipse cx="34" cy="88" rx="9" ry="4.5" fill="'+d+'"/><ellipse cx="66" cy="88" rx="9" ry="4.5" fill="'+d+'"/><path d="M18 80C10 52 26 31 50 31S90 52 82 80C70 91 30 91 18 80Z" fill="'+c+'"/><path d="M34 90C34 74 66 74 66 90Z" fill="#fff4d6" opacity=".55"/><path d="M36 76H64M38 82H62" stroke="'+d+'" stroke-width="1.4" opacity=".5"/>'+eyes(52,12,6,m)+'<circle cx="46" cy="61" r="1.2" fill="'+d+'"/><circle cx="54" cy="61" r="1.2" fill="'+d+'"/>'+mouth(65,m)}
};

/* ---- insan çizgisi (anime tarzı, özgün tasarımlar). col = saç rengi ---- */
var SKIN='#ffe3cf';
function humanEyes(iris,m){var s='',L=[39,61];L.forEach(function(x){
  s+='<g class="yx-e"><ellipse cx="'+x+'" cy="46" rx="6.2" ry="7.8" fill="#fff"/><ellipse cx="'+x+'" cy="47.2" rx="4.8" ry="6.4" fill="'+iris+'"/><ellipse cx="'+x+'" cy="48" rx="2.4" ry="3.6" fill="#1b1535"/><circle cx="'+(x-1.8)+'" cy="43.6" r="1.9" fill="#fff"/><circle cx="'+(x+1.7)+'" cy="50.4" r="1" fill="#fff" opacity=".8"/></g>'+
  '<path d="M'+(x-7)+' 43Q'+x+' 36.5 '+(x+7)+' 43" stroke="#2a1b3d" stroke-width="2" fill="none" stroke-linecap="round"/>'});
  if(m==='s')s+='<path d="M32 38L44 40M68 38L56 40" stroke="#2a1b3d" stroke-width="2" stroke-linecap="round"/>';return s}
function humanMouth(m){if(m==='h')return'<path d="M45 56Q50 65 55 56Z" fill="#b5524a"/><path d="M47 60Q50 58 53 60" fill="#ff9aa8"/>';if(m==='s')return'<path d="M46 60Q50 56 54 60" stroke="#b5524a" stroke-width="2" fill="none" stroke-linecap="round"/>';return'<path d="M46.5 57Q50 60 53.5 57" stroke="#b5524a" stroke-width="2" fill="none" stroke-linecap="round"/>'}
function human(o){return function(c,d,l,m){
  var s=(o.back?o.back(c,d,l):'')+'<path d="M33 92Q33 71 50 69Q67 71 67 92Z" fill="'+o.out+'"/>'+(o.outx?o.outx(c,d,l):'')+
   '<ellipse cx="29" cy="82" rx="5" ry="9" fill="'+o.out+'"/><ellipse cx="71" cy="82" rx="5" ry="9" fill="'+o.out+'"/><circle cx="29" cy="91" r="3.6" fill="'+SKIN+'"/><circle cx="71" cy="91" r="3.6" fill="'+SKIN+'"/>'+
   '<rect x="44" y="62" width="12" height="9" rx="4" fill="'+SKIN+'"/>'+
   (o.ears||'')+'<ellipse cx="50" cy="43" rx="25" ry="24" fill="'+SKIN+'"/>'+
   '<ellipse cx="32" cy="54" rx="4.6" ry="2.8" fill="#ff8fa3" opacity=".45"/><ellipse cx="68" cy="54" rx="4.6" ry="2.8" fill="#ff8fa3" opacity=".45"/>'+
   humanEyes(o.iris,m)+humanMouth(m)+(o.front?o.front(c,d,l):'');return s}}
var BANG='M25 43Q23 17 50 15Q77 17 75 43Q70 30 62 30Q58 36 50 30Q42 36 38 30Q30 30 25 43Z';
BODY.hana=human({out:'#ff6b9a',iris:'#3aa0ff',
 back:function(c,d){return'<path d="M26 32Q8 42 13 74Q23 64 29 44Z" fill="'+c+'"/><path d="M74 32Q92 42 87 74Q77 64 71 44Z" fill="'+c+'"/><path d="M23 40Q21 14 50 13Q79 14 77 40L74 50L26 50Z" fill="'+d+'"/>'},
 front:function(c,d,l){return'<path d="'+BANG+'" fill="'+c+'"/><path d="M33 24Q42 17 52 18" stroke="'+l+'" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/><circle cx="26" cy="31" r="4.4" fill="#ff3d7f"/><circle cx="74" cy="31" r="4.4" fill="#ff3d7f"/>'}});
BODY.mika=human({out:'#6aa8ff',iris:'#8b5cf6',
 back:function(c,d){return'<path d="M21 46Q18 14 50 12Q82 14 79 46L78 64Q50 72 22 64Z" fill="'+d+'"/>'},
 front:function(c,d,l){return'<path d="M24 46Q20 16 50 14Q80 16 76 46Q72 30 60 30Q50 38 40 30Q28 30 24 46Z" fill="'+c+'"/><path d="M22 46Q21 58 26 62L30 48Z" fill="'+c+'"/><path d="M78 46Q79 58 74 62L70 48Z" fill="'+c+'"/><path d="M34 22Q44 15 56 17" stroke="'+l+'" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/><path d="M62 20L72 12L72 26Z M72 19L82 12L82 26Z" fill="#ff5c8a"/><circle cx="72" cy="19" r="3" fill="#d63d6c"/>'}});
BODY.yuki=human({out:'#b9a2ff',iris:'#2cc7b8',outx:function(){return'<path d="M42 70L50 78L58 70" fill="#fff"/>'},
 back:function(c,d){return'<path d="M23 44Q19 12 50 12Q81 12 77 44L82 90Q50 98 18 90Z" fill="'+d+'"/>'},
 front:function(c,d,l){return'<path d="M24 44Q22 15 50 14Q78 15 76 44Q72 28 64 26Q58 34 52 26Q40 34 24 44Z" fill="'+c+'"/><path d="M22 44Q20 66 24 80L30 52Z" fill="'+c+'"/><path d="M78 44Q80 66 76 80L70 52Z" fill="'+c+'"/><path d="M34 22Q44 15 56 17" stroke="'+l+'" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>'}});
BODY.ren=human({out:'#2e3a6e',iris:'#e0533d',outx:function(){return'<path d="M42 70L50 80L58 70L54 69L50 74L46 69Z" fill="#fff"/><rect x="48" y="76" width="4" height="12" fill="#e0533d"/>'},
 front:function(c,d,l){return'<path d="M25 41L21 21L33 28L35 10L46 23L52 6L58 23L69 10L68 28L79 21L75 41Q70 30 62 32L56 27L50 34L44 27L38 32Q30 30 25 41Z" fill="'+c+'"/><path d="M36 22L44 20" stroke="'+l+'" stroke-width="2.6" stroke-linecap="round" opacity=".6"/>'}});
BODY.sora=human({out:'#ff9f43',iris:'#2f7be5',
 front:function(c,d,l){return'<path d="M24 44Q20 15 52 13Q82 15 76 44Q72 27 56 26Q40 30 24 44Z" fill="'+c+'"/><path d="M25 44Q23 52 27 56L31 46Z" fill="'+c+'"/><path d="M75 44Q77 52 73 56L69 46Z" fill="'+c+'"/><path d="M25 29Q50 20 75 29" stroke="#e8453c" stroke-width="5" fill="none"/><path d="M32 20Q44 15 56 16" stroke="'+l+'" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>'}});
BODY.taro=human({out:'#3ddbb0',iris:'#35b36b',outx:function(){return'<path d="M36 72Q50 80 64 72L64 78Q50 86 36 78Z" fill="#ffd23f"/>'},
 front:function(c,d,l){return'<path d="M24 42Q16 28 27 22Q25 9 40 13Q50 3 61 13Q75 9 73 22Q84 28 76 42Q70 30 60 32L50 28L40 32Q30 30 24 42Z" fill="'+c+'"/><path d="M50 12Q45 2 55 1" stroke="'+c+'" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M34 20Q42 14 52 15" stroke="'+l+'" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".6"/>'}});
BODY.elf=human({out:'#3fae6a',iris:'#4fd18b',outx:function(){return'<rect x="34" y="82" width="32" height="4" fill="#8a5a2b"/><circle cx="50" cy="84" r="2.4" fill="#ffd23f"/><path d="M42 70L50 76L58 70" fill="#2f8f55"/>'},
 ears:'<path d="M26 42L5 34L27 54Z" fill="'+SKIN+'"/><path d="M74 42L95 34L73 54Z" fill="'+SKIN+'"/><path d="M24 43L11 38L25 50Z" fill="#ffb9a3" opacity=".6"/><path d="M76 43L89 38L75 50Z" fill="#ffb9a3" opacity=".6"/>',
 back:function(c,d){return'<path d="M22 44Q18 11 50 11Q82 11 78 44L84 92Q50 99 16 92Z" fill="'+d+'"/>'},
 front:function(c,d,l){return'<path d="M24 44Q21 15 50 14Q79 15 76 44Q72 27 62 26Q56 34 50 26Q38 32 24 44Z" fill="'+c+'"/><path d="M22 44Q19 66 22 84L30 52Z" fill="'+c+'"/><path d="M78 44Q81 66 78 84L70 52Z" fill="'+c+'"/><path d="M30 31Q50 23 70 31" stroke="#ffd23f" stroke-width="2" fill="none"/><circle cx="50" cy="26.6" r="3.4" fill="#3ddbb0" stroke="#ffd23f" stroke-width="1"/><path d="M34 21Q44 15 56 16" stroke="'+l+'" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>'}});
BODY.vael=human({out:'#1f6f78',iris:'#d4a017',outx:function(){return'<path d="M40 70L50 82L60 70L56 68L50 75L44 68Z" fill="#c9b36a"/><circle cx="50" cy="84" r="2.2" fill="#e9d98b"/>'},
 ears:'<path d="M26 44L8 30L27 55Z" fill="'+SKIN+'"/><path d="M74 44L92 30L73 55Z" fill="'+SKIN+'"/><path d="M24 44L13 34L25 51Z" fill="#ffb9a3" opacity=".55"/><path d="M76 44L87 34L75 51Z" fill="#ffb9a3" opacity=".55"/>',
 back:function(c,d){return'<path d="M24 44Q22 14 50 13Q78 14 76 42L72 54Q50 46 28 54Z" fill="'+d+'"/>'},
 front:function(c,d,l){return'<path d="M24 42Q21 12 52 11Q84 13 76 40Q72 24 56 22Q42 26 33 38L28 52Q24 48 24 42Z" fill="'+c+'"/><path d="M72 28Q86 40 82 66Q74 58 72 44Z" fill="'+c+'"/><path d="M34 20Q46 13 60 15" stroke="'+l+'" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>'}});
BODY.vaela=human({out:'#7a2f6e',iris:'#2cc7b8',outx:function(){return'<path d="M40 70L50 80L60 70" fill="#e9d98b"/><circle cx="50" cy="83" r="2.4" fill="#2cc7b8"/>'},
 ears:'<path d="M26 44L7 28L27 55Z" fill="'+SKIN+'"/><path d="M74 44L93 28L73 55Z" fill="'+SKIN+'"/><path d="M24 44L12 33L25 51Z" fill="#ffb9a3" opacity=".55"/><path d="M76 44L88 33L75 51Z" fill="#ffb9a3" opacity=".55"/>',
 back:function(c,d){return'<path d="M23 44Q20 12 50 12Q80 12 77 44Q84 70 76 94Q64 88 62 70L38 70Q36 88 24 94Q16 70 23 44Z" fill="'+d+'"/>'},
 front:function(c,d,l){return'<path d="M24 44Q21 14 50 13Q79 14 76 44Q71 30 56 24Q40 36 24 44Z" fill="'+c+'"/><path d="M22 46Q19 70 26 90L31 56Z" fill="'+c+'"/><path d="M78 46Q81 70 74 90L69 56Z" fill="'+c+'"/><path d="M30 33Q50 24 70 33" stroke="#e9d98b" stroke-width="2" fill="none"/><path d="M34 21Q44 15 56 16" stroke="'+l+'" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>'}});
function star(cx,cy,r){var p=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;p.push((cx+Math.cos(a)*rr).toFixed(1)+','+(cy+Math.sin(a)*rr).toFixed(1))}return p.join(' ')}
var HATS={
 cap:function(T){return'<path d="M29 '+(T+5)+'Q50 '+(T-17)+' 71 '+(T+5)+'Z" fill="#ff5c8a"/><path d="M60 '+(T+3)+'H84Q84 '+(T+9)+' 74 '+(T+9)+'H60Z" fill="#d63d6c"/><circle cx="50" cy="'+(T-9)+'" r="2.6" fill="#fff"/>'},
 party:function(T){return'<path d="M37 '+(T+6)+'L50 '+(T-24)+'L63 '+(T+6)+'Z" fill="#6aa8ff"/><path d="M41 '+(T-2)+'L59 '+(T-2)+'M45 '+(T-11)+'L55 '+(T-11)+'" stroke="#ffd23f" stroke-width="3"/><circle cx="50" cy="'+(T-25)+'" r="4.2" fill="#ffd23f"/>'},
 head:function(T,E){return'<path d="M27 '+(E-2)+'Q27 '+(T-9)+' 50 '+(T-9)+'Q73 '+(T-9)+' 73 '+(E-2)+'" stroke="#2c2c44" stroke-width="4.5" fill="none" stroke-linecap="round"/><rect x="21" y="'+(E-9)+'" width="10" height="18" rx="5" fill="#ff5c8a"/><rect x="69" y="'+(E-9)+'" width="10" height="18" rx="5" fill="#ff5c8a"/>'},
 top:function(T){return'<rect x="29" y="'+(T+1)+'" width="42" height="6" rx="3" fill="#15151f"/><rect x="36" y="'+(T-21)+'" width="28" height="24" rx="3" fill="#15151f"/><rect x="36" y="'+(T-5)+'" width="28" height="5" fill="#ff5c8a"/>'},
 wiz:function(T){return'<path d="M34 '+(T+6)+'L55 '+(T-32)+'L66 '+(T+6)+'Z" fill="#7a4cff"/><ellipse cx="50" cy="'+(T+6)+'" rx="25" ry="5.5" fill="#5b34d6"/><polygon points="'+star(52,T-10,5.5)+'" fill="#ffd23f"/>'},
 crown:function(T){return'<path d="M32 '+(T+5)+'L31 '+(T-12)+'L41 '+(T-3)+'L50 '+(T-17)+'L59 '+(T-3)+'L69 '+(T-12)+'L68 '+(T+5)+'Z" fill="#ffd23f"/><rect x="32" y="'+(T+1)+'" width="36" height="4" fill="#e0a800"/><circle cx="50" cy="'+(T-2)+'" r="2.6" fill="#ff5c8a"/><circle cx="39" cy="'+(T-1)+'" r="1.8" fill="#6aa8ff"/><circle cx="61" cy="'+(T-1)+'" r="1.8" fill="#3ddbb0"/>'}
};
var FACES={
 glasses:function(E,dx){return'<g stroke="#2c2c44" stroke-width="2.4" fill="rgba(255,255,255,.2)"><circle cx="'+(50-dx)+'" cy="'+E+'" r="8.4"/><circle cx="'+(50+dx)+'" cy="'+E+'" r="8.4"/><path d="M'+(50-dx+8.4)+' '+E+'H'+(50+dx-8.4)+'" fill="none"/></g>'},
 shades:function(E,dx){return'<g fill="#15151f"><rect x="'+(50-dx-9.5)+'" y="'+(E-6.5)+'" width="19" height="13" rx="5"/><rect x="'+(50+dx-9.5)+'" y="'+(E-6.5)+'" width="19" height="13" rx="5"/><rect x="'+(50-dx+9)+'" y="'+(E-2.5)+'" width="'+(2*dx-18)+'" height="3"/></g><path d="M'+(50-dx-6)+' '+(E-3)+'l4 -1.5M'+(50+dx-6)+' '+(E-3)+'l4 -1.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>'},
 mustache:function(E){return'<path d="M35 '+(E+13)+'Q43 '+(E+5)+' 50 '+(E+11)+'Q57 '+(E+5)+' 65 '+(E+13)+'Q57 '+(E+18)+' 50 '+(E+13)+'Q43 '+(E+18)+' 35 '+(E+13)+'Z" fill="#4a2a12"/>'},
 mask:function(E,dx){return'<path d="M'+(50-dx-12)+' '+(E-7)+'H'+(50+dx+12)+'V'+(E+6)+'Q50 '+(E+10)+' '+(50-dx-12)+' '+(E+6)+'Z" fill="#1b1b2e"/><circle cx="'+(50-dx)+'" cy="'+E+'" r="4.6" fill="#fff"/><circle cx="'+(50+dx)+'" cy="'+E+'" r="4.6" fill="#fff"/><circle cx="'+(51-dx)+'" cy="'+(E+.4)+'" r="2.4" fill="#1b1535"/><circle cx="'+(51+dx)+'" cy="'+(E+.4)+'" r="2.4" fill="#1b1535"/>'},
 star:function(E,dx){return'<polygon points="'+star(50-dx,E,10)+'" fill="#ffd23f" stroke="#e0a800" stroke-width="1.4"/><polygon points="'+star(50+dx,E,10)+'" fill="#ffd23f" stroke="#e0a800" stroke-width="1.4"/><circle cx="'+(50-dx)+'" cy="'+E+'" r="2.6" fill="#1b1535"/><circle cx="'+(50+dx)+'" cy="'+E+'" r="2.6" fill="#1b1535"/>'}
};
var NECKS={
 bow:function(N){return'<path d="M50 '+N+'L38 '+(N-6)+'V'+(N+6)+'ZM50 '+N+'L62 '+(N-6)+'V'+(N+6)+'Z" fill="#ff5c8a"/><circle cx="50" cy="'+N+'" r="3.6" fill="#d63d6c"/>'},
 scarf:function(N){return'<path d="M28 '+(N-2)+'Q50 '+(N+9)+' 72 '+(N-2)+'V'+(N+6)+'Q50 '+(N+16)+' 28 '+(N+6)+'Z" fill="#ff5c8a"/><path d="M62 '+(N+7)+'L70 '+(N+7)+'L72 '+(N+22)+'L62 '+(N+22)+'Z" fill="#d63d6c"/><path d="M33 '+(N+1)+'Q50 '+(N+12)+' 67 '+(N+1)+'" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>'},
 medal:function(N){return'<path d="M42 '+(N-6)+'L50 '+(N+8)+'L58 '+(N-6)+'" stroke="#6aa8ff" stroke-width="4" fill="none"/><circle cx="50" cy="'+(N+11)+'" r="6" fill="#ffd23f" stroke="#e0a800" stroke-width="1.6"/><polygon points="'+star(50,N+11,3.6)+'" fill="#e0a800"/>'},
 cape:function(){return''}
};
function aura(a){if(!a)return'';var s='';
 if(a==='spark'){[[14,28,0],[88,22,.5],[10,70,1],[92,64,1.5],[50,6,.8]].forEach(function(p){s+='<polygon class="yx-t" style="animation-delay:'+p[2]+'s" points="'+star(p[0],p[1],6)+'" fill="#ffe066"/>'})}
 if(a==='heart'){[[14,70,0],[86,66,.9],[50,8,1.7]].forEach(function(p){s+='<path class="yx-u" style="animation-delay:'+p[2]+'s" d="M'+p[0]+' '+p[1]+'c-6 -5 -9 -10 -4 -13c3 -2 4 1 4 2c0 -1 1 -4 4 -2c5 3 2 8 -4 13z" fill="#ff5c8a"/>'})}
 if(a==='snow'){[[12,10,0],[30,4,.6],[70,8,1.2],[88,14,.3],[20,40,1.5],[84,44,.9]].forEach(function(p){s+='<circle class="yx-d" style="animation-delay:'+p[2]+'s" cx="'+p[0]+'" cy="'+p[1]+'" r="2.4" fill="#dff6ff"/>'})}
 if(a==='fire'){[[8,70],[92,70]].forEach(function(p,i){s+='<path class="yx-f" style="animation-delay:'+(i*.4)+'s" d="M'+p[0]+' 90C'+(p[0]-12)+' 76 '+(p[0]-2)+' 68 '+p[0]+' 54C'+(p[0]+4)+' 66 '+(p[0]+14)+' 74 '+p[0]+' 90Z" fill="#ff7a2e"/><path class="yx-f" style="animation-delay:'+(i*.4+.2)+'s" d="M'+p[0]+' 90C'+(p[0]-5)+' 82 '+p[0]+' 78 '+p[0]+' 70C'+(p[0]+3)+' 78 '+(p[0]+7)+' 84 '+p[0]+' 90Z" fill="#ffd23f"/>'})}
 return s}
function av(c,mood){c=c||S.eq;var sp=BODY[c.sp]?c.sp:'blob',col=c.col||'#ffd23f',d=shade(col,-.3),l=shade(col,.35),P=POS[sp],m=mood||'n',o='';
 o+=aura(c.aura)+'<ellipse cx="50" cy="93" rx="27" ry="4" fill="rgba(0,0,0,.28)"/><g class="yx-b">';
 if(c.neck==='cape')o+='<path d="M27 '+(P.N-3)+'L73 '+(P.N-3)+'L86 94L14 94Z" fill="#7a4cff"/><path d="M27 '+(P.N-3)+'L73 '+(P.N-3)+'L78 '+(P.N+14)+'L22 '+(P.N+14)+'Z" fill="#5b34d6" opacity=".6"/>';
 o+=BODY[sp](col,d,l,m);
 if(c.neck&&NECKS[c.neck])o+=NECKS[c.neck](P.N);if(c.neck==='cape')o+='<circle cx="50" cy="'+(P.N-1)+'" r="3.2" fill="#ffd23f"/>';
 if(c.face&&FACES[c.face])o+=FACES[c.face](P.E,P.dx);
 if(c.hat&&HATS[c.hat])o+=HATS[c.hat](P.T,P.E);
 return'<svg class="yxa" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+o+'</g></svg>'}

/* ---------- tema ---------- */
function applyTheme(id){var t=TH[id]||TH.neon,old=document.getElementById('yx-theme');
 if(id==='neon'||!TH[id]){if(old)old.remove();setMeta(TH.neon.bg);window.YX&&(YX.tint=null);return}
 var r=rgb(t.bg).join(',');
 var css=':root{--bg:'+t.bg+';--bg2:'+t.bg2+';--card:'+t.card+';--ink:'+t.ink+';--mute:'+t.mute+';--pink:'+t.pink+';--yellow:'+t.yellow+';--mint:'+t.mint+';--blue:'+t.blue+';--cyan:'+t.cyan+'}'+
  'body{background-color:'+t.bg+'!important;color:'+t.ink+'}'+
  (isGame?'header a{color:'+t.mute+'!important}.st{color:'+t.yellow+'!important}#ov{background:rgba('+r+',.86)!important}#ov p{color:'+t.mute+'!important}#ov b{color:'+t.yellow+'!important}#go{background:'+t.yellow+'!important;color:'+t.bg+'!important}#big{color:'+t.ink+'}':'')+
  (t.mono?'body,button,input,textarea,select{font-family:"Courier New",ui-monospace,monospace!important}':'')+
  (t.scan?'body:after{content:"";position:fixed;inset:0;pointer-events:none;z-index:99998;background:repeating-linear-gradient(0deg,rgba(0,0,0,.2) 0 1px,transparent 1px 3px)}':'');
 if(!old){old=document.createElement('style');old.id='yx-theme';(document.head||document.documentElement).appendChild(old)}old.textContent=css;setMeta(t.bg);window.YX&&(YX.tint=t.tint||null)}
function setMeta(c){var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',c)}

/* ---------- arayüz parçaları ---------- */
var css=document.createElement('style');css.id='yx-ec';
css.textContent='.yxa{overflow:visible}.yx-b{transform-box:fill-box;transform-origin:center bottom;animation:yxbr 3s ease-in-out infinite}@keyframes yxbr{50%{transform:scale(1.03,.97)}}'+
 '.yx-e{transform-box:fill-box;transform-origin:center;animation:yxbl 4.6s infinite}@keyframes yxbl{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.08)}}'+
 '.yx-t{transform-box:fill-box;transform-origin:center;animation:yxtw 1.7s ease-in-out infinite}@keyframes yxtw{0%,100%{transform:scale(.4);opacity:.3}50%{transform:scale(1.1);opacity:1}}'+
 '.yx-u{animation:yxup 2.8s ease-in infinite}@keyframes yxup{0%{transform:translateY(8px);opacity:0}25%{opacity:1}100%{transform:translateY(-22px);opacity:0}}'+
 '.yx-d{animation:yxdn 2.6s linear infinite}@keyframes yxdn{0%{transform:translateY(-6px);opacity:0}20%{opacity:1}100%{transform:translateY(34px);opacity:0}}'+
 '.yx-f{transform-box:fill-box;transform-origin:center bottom;animation:yxfl .7s ease-in-out infinite alternate}@keyframes yxfl{from{transform:scale(1,.82) skewX(-5deg)}to{transform:scale(.9,1.08) skewX(5deg)}}'+
 '#ych{position:fixed;left:calc(max(12px,env(safe-area-inset-left)) + 52px);bottom:max(8px,env(safe-area-inset-bottom));width:56px;height:56px;z-index:50;pointer-events:none}'+
 '#ych .yxs{width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35));transform-origin:center bottom}#ych svg{width:100%;height:100%}'+
 '#ych.jump .yxs{animation:yxjp .9s ease-out}@keyframes yxjp{0%{transform:translateY(0)}30%{transform:translateY(-22px) rotate(-6deg)}60%{transform:translateY(0) rotate(5deg)}80%{transform:translateY(-8px)}100%{transform:none}}'+
 '#ych.sad .yxs{animation:yxsd 1.4s ease-out;filter:saturate(.7) drop-shadow(0 4px 6px rgba(0,0,0,.35))}@keyframes yxsd{0%,100%{transform:none}30%{transform:scale(1.04,.9) rotate(-4deg)}}'+
 '#ych .yxp{position:absolute;left:-8px;bottom:100%;transform:translate(0,0);white-space:nowrap;background:rgba(20,16,43,.92);color:#ffd23f;border:1.5px solid rgba(255,255,255,.25);border-radius:14px;padding:5px 10px;font:800 .85rem "Bricolage Grotesque",system-ui,sans-serif;opacity:0;transition:opacity .25s,transform .25s}'+
 '#ych .yxp.on{opacity:1;transform:translate(0,-6px)}'+
 '.yx-chip{display:inline-flex;align-items:center;gap:5px;font-weight:800;color:#ffd23f;background:rgba(255,210,63,.12);border:1.5px solid rgba(255,210,63,.35);border-radius:999px;padding:3px 11px;font-size:.9rem;text-decoration:none;font-variant-numeric:tabular-nums;white-space:nowrap}.yx-chip.bst{box-shadow:0 0 14px rgba(255,210,63,.55)}'+
 '#yx-toast{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 62px);transform:translate(-50%,-14px);background:#1f1a42;color:#fff;border:1.5px solid #ffd23f;border-radius:999px;padding:9px 18px;font:800 .92rem "Bricolage Grotesque",system-ui,sans-serif;z-index:100000;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;max-width:92vw;text-align:center}#yx-toast.on{opacity:1;transform:translate(-50%,0)}'+
 '@media (min-width:620px){#ych{left:calc(50% - 240px - 78px);bottom:96px;width:68px;height:68px}}'+
 '@media (prefers-reduced-motion:reduce){.yxa *,#ych .yxs{animation:none!important}}';
(document.head||document.documentElement).appendChild(css);

var tTo=0;function toast(msg){var t=document.getElementById('yx-toast');if(!t){t=document.createElement('div');t.id='yx-toast';t.setAttribute('role','status');document.body.appendChild(t)}
 t.textContent=msg;t.classList.add('on');clearTimeout(tTo);tTo=setTimeout(function(){t.classList.remove('on')},2600)}

var ch=null,mood='n',moodTo=0,bubTo=0;
function render(){if(!ch)return;ch.firstChild.innerHTML=av(S.eq,mood)}
function say(txt,kind,ms,wide){if(!ch)return;var b=ch.lastChild;b.textContent=txt;b.style.whiteSpace=wide?'normal':'';b.style.width=wide?'min(76vw,250px)':'';b.style.lineHeight=wide?'1.25':'';b.classList.add('on');clearTimeout(bubTo);bubTo=setTimeout(function(){b.classList.remove('on')},ms||2200);
 if(kind){mood=kind==='sad'?'s':'h';render();ch.classList.remove('jump','sad');void ch.offsetWidth;ch.classList.add(kind==='sad'?'sad':'jump');clearTimeout(moodTo);moodTo=setTimeout(function(){mood='n';render();ch.classList.remove('jump','sad')},1800)}}
function mountChar(){if(!isGame||ch)return;ch=document.createElement('div');ch.id='ych';ch.innerHTML='<div class="yxs"></div><div class="yxp"></div>';document.body.appendChild(ch);render()}
function chip(){var h=document.querySelector('header');if(!isGame||!h||h.querySelector('[data-yx=coins]'))return;var s=document.createElement('span');s.className='yx-chip';s.innerHTML='🪙 <b data-yx="coins">0</b>';var st=h.querySelector('.st');h.insertBefore(s,st||null);refresh()}
function menuLink(){var p=document.getElementById('ymp');if(!p||p.querySelector('.yx-shop'))return;var home=p.querySelector('.home');if(!home)return;var a=document.createElement('a');a.className='home yx-shop';a.href='../magaza/';a.style.cssText='background:#2b2559;color:#fff;margin-top:10px';a.innerHTML='🛍️ <span>Mağaza</span> · 🪙 <b data-yx="coins">0</b>';home.parentNode.insertBefore(a,home.nextSibling);var b=document.createElement('a');b.className='home yx-acc';b.href='../hesap/';b.style.cssText='background:#2b2559;color:#fff;margin-top:10px';b.innerHTML='👤 <span>Hesap</span>';a.parentNode.insertBefore(b,a.nextSibling);refresh()}
function refresh(){var els=document.querySelectorAll('[data-yx=coins]');for(var i=0;i<els.length;i++)els[i].textContent=S.c;
 var b=S.boost>Date.now(),cs=document.querySelectorAll('.yx-chip');for(var j=0;j<cs.length;j++)cs[j].classList.toggle('bst',b);
 var lv=document.querySelectorAll('[data-yx=level]');for(var k=0;k<lv.length;k++)lv[k].textContent=level();
 if(ch)render()}


/* ---------- karakter koçu: üst üste hatada oyuncunun dilinde tavsiye ---------- */
var COACH={Refleks:['Ekrana değil ritme bak: önce zamanlamayı yakala, sonra hızlan.','Üst üste hata mı? Bir nefes al, yavaşça tekrar dene.','Hız arttıkça panik yapma; tek hamleyi doğru yapmak yeter.'],
 Bulmaca:['Acele etme: hamleden önce hedefi bir kez daha oku.','Önce köşeleri ve kısıtlı yerleri çöz, kalanı kendiliğinden açılır.','Takıldıysan baştan başla, ikinci denemede çözüm genelde belli olur.'],
 Arcade:['Önce hayatta kal, puan sonra gelir.','Engellere erken tepki ver; gözünü hep biraz ilerde tut.','Bonusları ancak güvenliyse al, riske girme.']};
var COACHG={yilan:'Kenarda değil ortada kal; kendine hep kaçacak yer bırak.',kule:'Bloğu tam ortaya hizala; küçük kaymalar kuleyi daraltır.',blok:'Uzun blok için yer ayır; büyük şekilleri sona bırakma.',birlestir:'En büyük sayıyı hep aynı köşede tut.',hafiza:'Kartları köşelerden başlayarak aklında tut.',damla:'Küçükleri önce birleştir, kabın yarısını boş tut.',radar:'Sahte hedeflere kanma: çizgi hedefin tam üstündeyken dokun.',tup:'Boş tüpü son çareye sakla.'};
var coachSt={};try{coachSt=JSON.parse(localStorage.getItem('yx-coach')||'{}')}catch(e){}
function coachSave(){try{localStorage.setItem('yx-coach',JSON.stringify(coachSt))}catch(e){}}
function coachReset(){if(coachSt[cur]&&coachSt[cur].n){coachSt[cur].n=0;coachSave()}return ''}
function coachTip(){var c=coachSt[cur]||(coachSt[cur]={n:0,i:0,t:0});c.n++;coachSave();if(c.n<3||Date.now()-c.t<90000)return '';
 var k='',gs=window.YAXEST_GAMES||[];for(var i=0;i<gs.length;i++)if(gs[i].id===cur)k=gs[i].k;
 var list=(COACH[k]||COACH.Arcade).slice();if(COACHG[cur])list.unshift(COACHG[cur]);
 var tip=list[c.i%list.length];c.i++;c.n=0;c.t=Date.now();coachSave();return T(tip)}
/* ---------- kazanma mantığı ---------- */
var lastAct=Date.now(),acc=0,tStart=0,b0=0,ov=null;
['pointerdown','keydown','touchstart','pointermove'].forEach(function(e){addEventListener(e,function(){lastAct=Date.now()},{passive:true,capture:true})});
function ovHidden(){return !ov||ov.classList.contains('hid')}
function num(el){var m=el&&(el.textContent||'').match(/-?\d+/);return m?+m[0]:0}
var WIN=/tamam|kazan|Tebrik|Mükemmel!|bulundu|parçalandı|Sıralandı|vuruldu/i;
function onEnd(){if(!tStart)return;var dur=(Date.now()-tStart)/1000;tStart=0;if(dur<8)return;
 var g=window.G,score=g&&typeof g.score==='number'?g.score:num(document.getElementById('big')),title=(document.getElementById('ot')||{}).textContent||'',win=WIN.test(title);
 var rec=!!(g&&score>0&&score>b0&&score>=g.best);
 var n=2+Math.floor(Math.sqrt(Math.max(0,score))*1.3)+(win?3:0)+Math.min(6,Math.floor(dur/20))+(rec?6:0);n=Math.min(30,n);
 var a=earn(n,'game'),ph=T(win||rec?(rec?'Yeni rekor!':'Harika! 🎉'):'Olsun, bir daha! 💪');var tip=win||rec?coachReset():coachTip();if(tip){say((a>0?'+'+a+' 🪙 · ':'')+tip,'happy',6500,1)}else say((a>0?'+'+a+' 🪙 · ':'')+ph,win||rec?'happy':'sad',2600)}
function bindOv(){ov=document.getElementById('ov');if(!ov||!isGame)return;var was=ov.classList.contains('hid');
 if(was){tStart=Date.now();b0=window.G?G.best:0}
 new MutationObserver(function(){var h=ov.classList.contains('hid');if(was&&!h)onEnd();if(!was&&h){tStart=Date.now();b0=window.G?G.best:0}was=h}).observe(ov,{attributes:true,attributeFilter:['class']})}
function tick(){if(!isGame||document.hidden||window.YMENU)return;if(Date.now()-lastAct>6000)return;if(!ovHidden())return;
 var iv=20-2.5*S.pk.enerji;acc++;
 if(!S.seen[cur]){S.seen[cur]=1;save();var a=earn(8,'new',1);toast(T('Yeni oyun keşfi')+' +'+a+' 🪙');say('+'+a+' 🪙','happy',2400);return}
 if(acc>=iv){acc-=iv;var a2=earn(1,'time');if(a2>0)say('+'+a2+' 🪙','',1500)}}
function daily(){var d=new Date(),k=function(x){return x.getFullYear()+'-'+(x.getMonth()+1)+'-'+x.getDate()},today=k(d);if(S.daily===today)return;
 var y=new Date(d.getTime()-864e5);S.streak=S.daily===k(y)?S.streak+1:1;S.daily=today;
 var g=Math.round((5+Math.min(S.streak,7)*2)*(1+.4*S.pk.seri));earn(g,'daily',1);save();
 setTimeout(function(){toast('🎁 '+T('Günlük hediye')+' +'+g+' 🪙 · 🔥 '+S.streak+' '+T('gün seri'))},900)}

/* ---------- canvas arka planını temaya boya ---------- */
function wrapBg(){var g=window.G;if(!g||!g.bg||g.__yxbg)return;g.__yxbg=1;var o=g.bg;g.bg=function(a,b){o(a,b);if(window.YX&&YX.tint){g.x.fillStyle=YX.tint;g.x.fillRect(0,0,g.W,g.H)}}}

/* ---------- API ---------- */
window.YX={S:function(){return S},coins:function(){return S.c},earn:earn,spend:spend,price:price,buy:buy,equip:equip,owns:owns,perkBuy:perkBuy,boostBuy:boostBuy,cepBuy:cepBuy,boxBuy:boxBuy,tubeCost:tubeCost,hintCost:hintCost,
 av:av,level:level,lvInfo:lvInfo,mult:mult,toast:toast,say:say,applyTheme:applyTheme,
 cat:{SP:SP,COL:COL,HAT:HAT,FACE:FACE,NECK:NECK,AURA:AURA,PERK:PERK,CEP:CEP,TH:TH,ITEMS:ITEMS},tint:null,
 setName:function(n){S.name=String(n||'').slice(0,14);save();emit('name')},reset:function(){S=def();save();applyTheme('neon');emit('sync')}};

applyTheme(S.eq.th);
function boot(){try{wrapBg();mountChar();chip();menuLink();bindOv();refresh();daily();setInterval(tick,1000)}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.addEventListener('ylang',function(){render()});

/* kalıcı depolama izni + yedek hatırlatma */
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
setTimeout(function(){try{var t=+localStorage.getItem('yx-bkt')||0,rm=+localStorage.getItem('yx-bkr')||0,now=Date.now();
 if(S.t>=150&&!localStorage.getItem('yx-acct')&&now-t>7*864e5&&now-rm>2*864e5&&window.YX){localStorage.setItem('yx-bkr',String(now));YX.toast('👤 '+(window.YT?YT('İlerlemeni kaybetme: hesap aç'):'İlerlemeni kaybetme: hesap aç'))}}catch(e){}},9000);

/* hesap: giriş yapılmışsa bulut eşitleme betiğini yükle */
try{if(localStorage.getItem('yx-acct')&&!window.YXAcct){var es=document.querySelector('script[src$="economy.js"]');if(es){var base=es.getAttribute('src').replace('economy.js','');['account-config.js','backup.js','account.js'].reduce(function(p,f){return p.then(function(){return new Promise(function(r){var s=document.createElement('script');s.src=base+f;s.onload=s.onerror=r;document.head.appendChild(s)})})},Promise.resolve())}}}catch(e){}
})();
