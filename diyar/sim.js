/* Yaxest Diyarı: paylaşılan kural ve veri katmanı (DOM yok). İstemci de, ileride sunucu (Cloudflare Durable Object) da bunu kullanır.
   Böylece hesaplar iki tarafta aynı olur; sunucu "yetkili", istemci yalnızca gösterir ve girdi yollar. */
(function(root){
'use strict';
var TS=48,MW=120,MH=120,CX=MW/2,CY=MH/2;
function hash(x,y,s){var h=(x*374761393+y*668265263+(s||0)*2147483647)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}
function vn(x,y,s){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=hash(xi,yi,s),b=hash(xi+1,yi,s),c=hash(xi,yi+1,s),d=hash(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
/* kutu türleri: 0 çimen, 1 orman, 2 kayalık, 3 su, 4 kasaba, 6 duvar */
function zoneAt(tx,ty){
  if(tx<0||ty<0||tx>=MW||ty>=MH)return 3;
  var dx=tx-CX,dy=ty-CY,d=Math.sqrt(dx*dx+dy*dy)+(vn(tx/6,ty/6,3)-.5)*11;
  var edge=Math.min(tx,ty,MW-1-tx,MH-1-ty);
  if(edge<3||(vn(tx/9,ty/9,11)>.78&&d>16&&d<54))return 3;
  if(d<11)return 4;
  if(d<27)return 0;
  if(d<46)return 1;
  return 2}
function nodeAt(tx,ty){
  var z=zoneAt(tx,ty);if(z===3||z===4)return null;
  var dx=tx-CX,dy=ty-CY;if(dx*dx+dy*dy<169)return null;
  var r=hash(tx,ty,7);
  if(z===0){if(r<.05)return 'tree';if(r<.065)return 'rock'}
  else if(z===1){if(r<.14)return 'tree';if(r<.165)return 'rock';if(r<.18)return 'copper'}
  else{if(r<.06){var dd=Math.sqrt(dx*dx+dy*dy),rr=hash(tx,ty,9);return dd<54?(rr<.55?'copper':'iron'):dd<64?(rr<.5?'iron':'silver'):dd<72?(rr<.5?'silver':'goldore'):(rr<.55?'goldore':'mithril')}if(r<.1)return 'rock'}
  return null}
var NODE={tree:{n:'Ağaç',mat:'wood',t:1.4,prof:'wood',req:1,col:'#6b4a2b',sp:'#2f9e57'},rock:{n:'Kaya',mat:'stone',t:1.6,prof:'mine',req:1,col:'#8b93a8',sp:'#a8afc4'},
 copper:{n:'Bakır Damarı',mat:'copper',t:1.8,prof:'mine',req:2,col:'#6b5a50',sp:'#e08a4a'},iron:{n:'Demir Damarı',mat:'iron',t:2.2,prof:'mine',req:4,col:'#4f4a52',sp:'#b9a08a'},
 silver:{n:'Gümüş Damarı',mat:'silver',t:2.6,prof:'mine',req:6,col:'#5b6075',sp:'#e6ecff'},goldore:{n:'Altın Damarı',mat:'goldore',t:3,prof:'mine',req:8,col:'#6b6050',sp:'#ffd23f'},mithril:{n:'Mitril Damarı',mat:'mithril',t:3.6,prof:'mine',req:10,col:'#3b4a6b',sp:'#7ad7ff'}};
var MATS={wood:{n:'Odun',ic:'🪵',v:2},stone:{n:'Taş',ic:'🪨',v:2},copper:{n:'Bakır Cevheri',ic:'🟤',v:4},iron:{n:'Demir Cevheri',ic:'⛓️',v:7},silver:{n:'Gümüş Cevheri',ic:'⚪',v:12},goldore:{n:'Altın Cevheri',ic:'🟡',v:20},mithril:{n:'Mitril Cevheri',ic:'🔷',v:36},
 i_copper:{n:'Bakır Külçe',ic:'🟧',v:12,ing:1},i_iron:{n:'Demir Külçe',ic:'⬛',v:22,ing:1},i_silver:{n:'Gümüş Külçe',ic:'⬜',v:40,ing:1},i_gold:{n:'Altın Külçe',ic:'🟨',v:66,ing:1},i_mithril:{n:'Mitril Külçe',ic:'🟦',v:120,ing:1},
 fang:{n:'Kurt Dişi',ic:'🦷',v:15},crystal:{n:'Kristal',ic:'💎',v:30}};
/* eritme: 2 cevher + 1 odun -> 1 külçe */
var SMELT={copper:'i_copper',iron:'i_iron',silver:'i_silver',goldore:'i_gold',mithril:'i_mithril'};
var PVP=[{id:'vadi',n:'Kızıl Vadi',tx:96,ty:77,r:9},{id:'gecit',n:'Kurt Geçidi',tx:22,ty:42,r:9}];
var CLASSES={
 savasci:{n:'Savaşçı',ic:'⚔️',col:'#ff7a5c',hp:150,spd:150,rng:62,aspd:.55,dmg:16,melee:1,role:'Yakın dövüş, dengeli hasar',
  sk:[{id:'spin',n:'Girdap',ic:'🌀',cd:5,kind:'aoe',r:88,m:1.7},{id:'charge',n:'Atılış',ic:'💨',cd:8,kind:'dash',d:180,m:2,r:70},{id:'roar',n:'Savaş Narası',ic:'📣',cd:14,kind:'buff',dur:6,dmgm:1.5}]},
 tank:{n:'Muhafız',ic:'🛡️',col:'#5cb4ff',hp:240,spd:140,rng:58,aspd:.7,dmg:10,melee:1,role:'Hasar emer, düşmanı üstüne çeker',
  sk:[{id:'taunt',n:'Meydan Okuma',ic:'📢',cd:9,kind:'taunt',r:210,dur:5},{id:'guard',n:'Kalkan Duvarı',ic:'🛡️',cd:12,kind:'guard',dur:5,red:.65},{id:'slam',n:'Yer Sarsıntısı',ic:'💥',cd:7,kind:'aoe',r:105,m:1.4}]},
 buyucu:{n:'Büyücü',ic:'🔮',col:'#b57bff',hp:90,spd:150,rng:280,aspd:.6,dmg:17,melee:0,role:'Uzaktan yüksek hasar',
  sk:[{id:'nova',n:'Buz Halkası',ic:'❄️',cd:6,kind:'aoe',r:125,m:1.5,slow:3},{id:'bolt',n:'Şimşek',ic:'⚡',cd:9,kind:'line',len:330,m:3},{id:'blink',n:'Işınlan',ic:'✨',cd:10,kind:'dash',d:210,m:0,r:0}]},
 sifaci:{n:'Şifacı',ic:'💚',col:'#5be39a',hp:110,spd:150,rng:240,aspd:.7,dmg:10,melee:0,role:'Takımı iyileştirir, destek verir',
  sk:[{id:'heal',n:'Şifa Işığı',ic:'✚',cd:5,kind:'heal',r:170,amt:.38},{id:'hot',n:'Yenilenme',ic:'🌿',cd:10,kind:'hot',dur:8,amt:.05},{id:'flame',n:'Kutsal Alev',ic:'🔥',cd:7,kind:'aoe',r:95,m:1.6}]},
 suikastci:{n:'Suikastçı',ic:'🗡️',col:'#ffd23f',hp:100,spd:175,rng:55,aspd:.32,dmg:13,melee:1,role:'Hızlı, tek hedefe ölümcül',
  sk:[{id:'shadow',n:'Gölge Adımı',ic:'🌑',cd:7,kind:'strike',rng:270,m:2.8},{id:'poison',n:'Zehir',ic:'☠️',cd:9,kind:'dot',rng:220,m:.55,ticks:6},{id:'smoke',n:'Duman',ic:'🌫',cd:12,kind:'evade',dur:2}]}
};
var DUNGEONS={
 kurt:{n:'Kurt İni',ic:'🐺',lv:4,party:1,desc:'Alfa Kurt ve sürüsü. Tek başına girilebilir.',waves:[{t:'wolf',c:4},{t:'wolf',c:6},{t:'alpha',c:1,extra:{t:'wolf',c:2}}],reward:{gold:60,xp:140,fang:2}},
 kristal:{n:'Kristal Mağara',ic:'💎',lv:10,party:2,desc:'Golemler ve kristal bekçisi. En az 2 kişilik parti gerekir.',waves:[{t:'golem',c:4},{t:'golem',c:6},{t:'guardian',c:1,extra:{t:'golem',c:2}}],reward:{gold:200,xp:520,crystal:3}},
 kale:{n:'Taş Kale',ic:'🏰',lv:16,party:3,desc:'Büyük zindan: en az 3 kişilik parti zorunlu.',waves:[],reward:{}}
};
var MON={
 slime:{n:'Balçık',c:'#6fe08a',hm:1,dm:.8,sp:70,sz:16,xp:1,g:1},
 wolf:{n:'Kurt',c:'#aab2c4',hm:1.3,dm:1.1,sp:115,sz:18,xp:1.2,g:1.2},
 boar:{n:'Yaban Domuzu',c:'#c28a5c',hm:1.8,dm:1,sp:95,sz:20,xp:1.5,g:1.3},
 golem:{n:'Taş Golem',c:'#8f9bb7',hm:2.6,dm:1.3,sp:70,sz:24,xp:2.2,g:1.8},
 alpha:{n:'Alfa Kurt',c:'#e86a5a',hm:9,dm:1.7,sp:120,sz:30,xp:8,g:8,boss:1},
 metin:{n:'Metin Taşı',c:'#b57bff',hm:10,dm:0,sp:0,sz:30,xp:5,g:6,boss:1},
 guardian:{n:'Kristal Bekçi',c:'#7ad7ff',hm:14,dm:2,sp:80,sz:34,xp:10,g:14,boss:1}
};
function monFor(zone){return zone===0?(Math.random()<.75?'slime':'boar'):zone===1?(Math.random()<.6?'wolf':'boar'):'golem'}
function zoneLv(zone,d){return zone===0?1+Math.floor(Math.max(0,d-8)/6):zone===1?5+Math.floor((d-27)/5):10+Math.floor((d-46)/3.5)}
function xpNeed(l){return Math.round(55*Math.pow(l,1.55))}
function mstat(type,lv){var m=MON[type];return{hp:Math.round((30+lv*20)*m.hm),dmg:Math.round((4+lv*2.3)*m.dm),xp:Math.round((10+lv*8)*m.xp),gold:Math.round((2+lv*2)*m.g)}}
function pstat(p){var c=CLASSES[p.cls],l=p.lv,wl=p.wl||0,al=p.al||0;
  return{maxhp:Math.round((c.hp+l*13)*(1+.12*al)),dmg:Math.round((c.dmg*(1+.13*(l-1)))*(1+.18*wl)),red:Math.min(.5,al*.035),spd:c.spd,rng:c.rng,aspd:c.aspd}}
var UPI=[0,0,0,0,['i_copper',2],['i_copper',3],['i_iron',2],['i_iron',3],['i_silver',2],['i_silver',3],['i_gold',2],['i_mithril',2],['i_mithril',3]];
function upCost(kind,n){var c=kind==='w'?{wood:4+3*n,stone:2+2*n,gold:10+15*n}:{wood:3+2*n,stone:3+3*n,gold:8+12*n},u=UPI[n];c.iron=0;if(u){c.ik=u[0];c.ic=u[1]+(kind==='w'?1:0)}return c}
var PROF={wood:'Odunculuk',mine:'Madencilik'};
function profNeed(l){return 8+l*7}
root.YD={TS:TS,MW:MW,MH:MH,CX:CX,CY:CY,hash:hash,vn:vn,zoneAt:zoneAt,nodeAt:nodeAt,NODE:NODE,MATS:MATS,CLASSES:CLASSES,DUNGEONS:DUNGEONS,MON:MON,monFor:monFor,zoneLv:zoneLv,xpNeed:xpNeed,mstat:mstat,pstat:pstat,upCost:upCost,PROF:PROF,SMELT:SMELT,PVP:PVP,profNeed:profNeed,MAXLV:50};
if(typeof module!=='undefined')module.exports=root.YD;
})(typeof window!=='undefined'?window:globalThis);
