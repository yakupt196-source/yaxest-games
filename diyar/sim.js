/* Yaxest Diyarı: paylaşılan kural ve veri katmanı (DOM yok). İstemci de, ileride sunucu (Cloudflare Durable Object) da bunu kullanır.
   Böylece hesaplar iki tarafta aynı olur; sunucu "yetkili", istemci yalnızca gösterir ve girdi yollar. */
(function(root){
'use strict';
var TS=48,MW=200,MH=200,CX=MW/2,CY=MH/2;
function hash(x,y,s){var h=(x*374761393+y*668265263+(s||0)*2147483647)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}
function vn(x,y,s){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=hash(xi,yi,s),b=hash(xi+1,yi,s),c=hash(xi,yi+1,s),d=hash(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
/* kutu türleri: 0 çimen, 1 orman, 2 kayalık, 3 su, 4 kasaba, 6 duvar */
function zoneAt(tx,ty){
  if(tx<0||ty<0||tx>=MW||ty>=MH)return 3;
  var dx=tx-CX,dy=ty-CY,dd0=Math.sqrt(dx*dx+dy*dy);if(dd0<16.9)return 4;var d=dd0+(vn(tx/6,ty/6,3)-.5)*11;
  var edge=Math.min(tx,ty,MW-1-tx,MH-1-ty);
  if(edge<3||(vn(tx/9,ty/9,11)>.74&&d>16&&d<120))return 3;
  if(d<34)return 0;
  if(d<56)return 1;
  return vn(tx/11,ty/11,21)>.6?1:2}
/* isimli lokasyonlar: seviyeye göre kademeli, cevher kümeleri ve keşif ödülü. */
var POIS=[
 {id:'cinar',n:'Çınar Çayırı',ic:'🌳',a:200,d:20,lv:1,hi:3,node:'tree',desc:'Yaşlı çınarların gölgesinde odun toplamak için ideal. Acemilerin ilk durağı.'},
 {id:'bakir',n:'Bakır Ocağı',ic:'🟤',a:300,d:27,lv:2,hi:5,node:'copper',desc:'Terk edilmiş küçük bir ocak. Bakır damarları kümelenmiş.'},
 {id:'koy',n:'Balıkçı Koyu',ic:'🎣',a:95,d:31,lv:1,hi:4,node:'rock',desc:'Sakin bir kıyı. Taş ve huzur.'},
 {id:'koru',n:'Fısıltı Koruluğu',ic:'🍃',a:40,d:42,lv:4,hi:8,node:'oldtree',desc:'Kadim ağaçlar burada fısıldar. Kadim odun düşer.'},
 {id:'kule',n:'Terk Edilmiş Kule',ic:'🏚️',a:130,d:47,lv:5,hi:9,node:'rock',desc:'Çökmüş bir gözetleme kulesi. Etrafı taş ve gizemle dolu.'},
 {id:'demir',n:'Demir Kuyusu',ic:'⛓️',a:165,d:58,lv:5,hi:9,node:'iron',desc:'Derin demir damarları. Madencilik 4 gerekir.'},
 {id:'altin',n:'Altın Vadisi',ic:'🟡',a:255,d:52,lv:6,hi:10,node:'goldore',desc:'Nehir yatağında parlayan altın damarları.'},
 {id:'gumus',n:'Gümüş Mağarası',ic:'⚪',a:335,d:68,lv:7,hi:12,node:'silver',desc:'Soğuk bir mağara; duvarlar gümüş kaplı.'},
 {id:'yakut',n:'Yakut Yarığı',ic:'🔴',a:75,d:76,lv:9,hi:14,node:'ruby',desc:'Kayalıkta kızıl parıltılı bir yarık. Yakut damarları!'},
 {id:'mitril',n:'Mitril Zirvesi',ic:'🔷',a:125,d:88,lv:10,hi:15,node:'mithril',desc:'Bulutların üstünde, mavi mitril kayaları.'},
 {id:'zumrut',n:'Zümrüt Çağlayanı',ic:'🟢',a:15,d:84,lv:11,hi:16,node:'emerald',desc:'Şelalenin ardında yeşil kristaller.'},
 {id:'safir',n:'Safir Kıyısı',ic:'🔵',a:215,d:86,lv:12,hi:17,node:'sapphire',desc:'Gölün kenarında mavi safir kayaları.'},
 {id:'titan',n:'Titan Ocağı',ic:'🔹',a:285,d:93,lv:13,hi:18,node:'titan',desc:'Dünyanın kıyısında, titanyum cevherinin yuvası.'},
 {id:'krater',n:'Yıldız Krateri',ic:'🌠',a:55,d:94,lv:15,hi:20,node:'aster',desc:'Göktaşı düşmüş krater. Yıldız cevheri burada!'}];
var poiCache=null;
function poiPos(){if(poiCache)return poiCache;poiCache=POIS.map(function(p){var r=p.a*Math.PI/180,tx=Math.round(CX+Math.cos(r)*p.d),ty=Math.round(CY+Math.sin(r)*p.d);tx=Math.max(9,Math.min(MW-10,tx));ty=Math.max(9,Math.min(MH-10,ty));var best=null;
  for(var q=0;q<14&&!best;q++)for(var dy=-q;dy<=q&&!best;dy++)for(var dx=-q;dx<=q;dx++){var x=tx+dx,y=ty+dy,z=zoneAt(x,y),ok=z!==3&&z!==4;if(ok){for(var ax=-2;ax<=2&&ok;ax+=2)for(var ay=-2;ay<=2;ay+=2)if(zoneAt(x+ax,y+ay)===3)ok=false}if(ok){best={tx:x,ty:y};break}}
  best=best||{tx:tx,ty:ty};return{id:p.id,tx:best.tx,ty:best.ty}});return poiCache}
function poiNodeAt(tx,ty){var P=poiPos();for(var i=0;i<P.length;i++){var dx=tx-P[i].tx,dy=ty-P[i].ty;if(dx>5||dx<-5||dy>5||dy<-5)continue;var d2=dx*dx+dy*dy;if(d2<2||d2>20)continue;var n=POIS[i].node;if(hash(tx,ty,31+i)<(POIS[i].id==='kule'?.18:.42))return n}return null}
function poiOf(tx,ty,r){var P=poiPos();for(var i=0;i<P.length;i++){var dx=tx-P[i].tx,dy=ty-P[i].ty;if(dx*dx+dy*dy<=(r||7)*(r||7))return i}return -1}
function nodeAt(tx,ty){
  var z=zoneAt(tx,ty);if(z===3||z===4)return null;
  var dx=tx-CX,dy=ty-CY,dd=Math.sqrt(dx*dx+dy*dy);if(dd<18)return null;
  var pn=poiNodeAt(tx,ty);if(pn)return pn;
  var r=hash(tx,ty,7);
  if(z===0){if(r<.05)return 'tree';if(r<.065)return 'rock';return null}
  if(z===1){if(r<.14)return 'tree';if(r<.165)return 'rock';if(r<.18&&dd<80)return 'copper';if(r>=.18&&r<.192&&dd>40)return 'goldore';if(dd>36&&r>.97)return 'oldtree';return null}
  /* kayalık: bakır yaygın; diğer cevherler damar (küme) olarak ve uzakta, çok nadir */
  var q=vn(tx/6,ty/6,41),rr=hash(tx,ty,9);
  if(dd>=120&&q>.8&&r<.2)return 'aster';
  if(dd>=108&&q>.78&&r<.2)return 'titan';
  if(dd>=90&&q>.81&&r<.15)return 'mithril';
  if(dd>=72&&q>.77&&r<.18)return 'silver';
  if(dd>=60&&q>.72&&r<.18)return 'iron';
  if(dd>=40&&q>.66&&r<.22)return 'goldore';
  if(r<.05)return 'copper';
  if(r<.1)return 'rock';
  return null}
var NODE={tree:{n:'Ağaç',mat:'wood',t:1.4,prof:'wood',req:1,col:'#6b4a2b',sp:'#2f9e57'},rock:{n:'Kaya',mat:'stone',t:1.6,prof:'mine',req:1,col:'#8b93a8',sp:'#a8afc4'},
 copper:{n:'Bakır Damarı',mat:'copper',t:1.8,prof:'mine',req:2,col:'#6b5a50',sp:'#e08a4a'},iron:{n:'Demir Damarı',mat:'iron',t:2.2,prof:'mine',req:4,col:'#4f4a52',sp:'#b9a08a'},
 silver:{n:'Gümüş Damarı',mat:'silver',t:2.6,prof:'mine',req:6,col:'#5b6075',sp:'#e6ecff'},goldore:{n:'Altın Damarı',mat:'goldore',t:3,prof:'mine',req:8,col:'#6b6050',sp:'#ffd23f'},mithril:{n:'Mitril Damarı',mat:'mithril',t:3.6,prof:'mine',req:10,col:'#3b4a6b',sp:'#7ad7ff'},
 titan:{n:'Titanyum Damarı',mat:'titan',t:4.2,prof:'mine',req:12,col:'#33444a',sp:'#6ef0d0'},aster:{n:'Yıldız Damarı',mat:'aster',t:5,prof:'mine',req:15,col:'#2a2440',sp:'#ff7af0'},oldtree:{n:'Kadim Ağaç',mat:'hwood',t:3.2,prof:'wood',req:5,col:'#4a3320',sp:'#2f9e57'}};
NODE.ruby={n:'Yakut Damarı',mat:'ruby',t:4,prof:'mine',req:9,col:'#4a2a36',sp:'#ff4f6e'};NODE.emerald={n:'Zümrüt Damarı',mat:'emerald',t:4.4,prof:'mine',req:11,col:'#1f3a30',sp:'#4fff9a'};NODE.sapphire={n:'Safir Damarı',mat:'sapphire',t:4.8,prof:'mine',req:12,col:'#1f2a4a',sp:'#5fa8ff'};
var NODE_TK={ruby:4,emerald:5,sapphire:5,tree:0,rock:0,copper:0,iron:1,silver:2,goldore:3,mithril:4,titan:5,aster:6,oldtree:2};Object.keys(NODE_TK).forEach(function(k){NODE[k].tk=NODE_TK[k]});
var MATS={ruby:{n:'Yakut',ic:'🔴',v:70},emerald:{n:'Zümrüt',ic:'🟢',v:95},sapphire:{n:'Safir',ic:'🔵',v:120},wood:{n:'Odun',ic:'🪵',v:2},stone:{n:'Taş',ic:'🪨',v:2},copper:{n:'Bakır Cevheri',ic:'🟤',v:4},iron:{n:'Demir Cevheri',ic:'⛓️',v:7},silver:{n:'Gümüş Cevheri',ic:'⚪',v:12},goldore:{n:'Altın Cevheri',ic:'🟡',v:20},mithril:{n:'Mitril Cevheri',ic:'🔷',v:36},
 i_copper:{n:'Bakır Külçe',ic:'🟧',v:12,ing:1},i_iron:{n:'Demir Külçe',ic:'⬛',v:22,ing:1},i_silver:{n:'Gümüş Külçe',ic:'⬜',v:40,ing:1},i_gold:{n:'Altın Külçe',ic:'🟨',v:66,ing:1},i_mithril:{n:'Mitril Külçe',ic:'🟦',v:120,ing:1},
 titan:{n:'Titanyum Cevheri',ic:'🔹',v:34},aster:{n:'Yıldız Cevheri',ic:'🌠',v:60},hwood:{n:'Kadim Odun',ic:'🌳',v:26},i_titan:{n:'Titanyum Külçe',ic:'🟩',v:190,ing:1},i_aster:{n:'Yıldız Külçesi',ic:'🟪',v:340,ing:1},
 fang:{n:'Kurt Dişi',ic:'🦷',v:15},core:{n:'Efsane Çekirdeği',ic:'🔶',v:260},crystal:{n:'Kristal',ic:'💎',v:30}};
/* eritme: 2 cevher + 1 odun -> 1 külçe */
var SMELT={copper:'i_copper',iron:'i_iron',silver:'i_silver',goldore:'i_gold',mithril:'i_mithril',titan:'i_titan',aster:'i_aster'};
var TOOLS={pk:{n:'Kazma',t:['Taş Kazma','Bakır Kazma','Demir Kazma','Gümüş Kazma','Altın Kazma','Mitril Kazma','Titanyum Kazma'],c:[null,{wood:6,i_copper:3,gold:80},{wood:8,i_iron:4,gold:260},{wood:10,i_silver:5,gold:640},{wood:12,i_gold:5,gold:1500},{wood:14,i_mithril:5,gold:3400},{wood:16,i_titan:6,gold:7500}],lv:[1,2,4,6,8,10,13]},
 ax:{n:'Balta',t:['Taş Balta','Bakır Balta','Demir Balta','Gümüş Balta','Altın Balta'],c:[null,{wood:4,i_copper:3,gold:70},{i_iron:4,gold:240},{i_silver:5,gold:600},{i_gold:5,gold:1450}],lv:[1,2,4,7,10]}};
var PVP=[{id:'vadi',n:'Kızıl Vadi',tx:156,ty:84,r:9},{id:'gecit',n:'Kurt Geçidi',tx:38,ty:62,r:9},{id:'zirve',n:'Zirve Arenası',tx:104,ty:28,r:9}];
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
CLASSES.savasci.sk.forEach(function(k){k.lv=1});CLASSES.tank.sk.forEach(function(k){k.lv=1});CLASSES.buyucu.sk.forEach(function(k){k.lv=1});CLASSES.sifaci.sk.forEach(function(k){k.lv=1});CLASSES.suikastci.sk.forEach(function(k){k.lv=1});
var NEWSK={
 savasci:[{id:'quake',n:'Yer Yarıcı',ic:'💥',cd:14,kind:'aoe',r:140,m:2.6,lv:6},{id:'rage',n:'Kan Hiddeti',ic:'🔥',cd:22,kind:'buff',dur:9,dmgm:1.8,lv:10},{id:'tempest',n:'Kılıç Fırtınası',ic:'🌟',cd:36,kind:'aoe',r:175,m:4.6,lv:18}],
 tank:[{id:'bash',n:'Kalkan Darbesi',ic:'👊',cd:9,kind:'aoe',r:85,m:1.9,slow:2.5,lv:6},{id:'bulwark',n:'Çelik Beden',ic:'🛡',cd:26,kind:'guard',dur:7,red:.82,lv:10},{id:'avalanche',n:'Çığ',ic:'🌟',cd:34,kind:'aoe',r:160,m:3.2,slow:3,lv:18}],
 buyucu:[{id:'meteor',n:'Göktaşı',ic:'☄',cd:16,kind:'aoeT',r:115,m:4.2,lv:6},{id:'chain',n:'Zincir Şimşek',ic:'🔗',cd:11,kind:'chain',hits:5,m:1.7,lv:10},{id:'blizzard',n:'Kar Fırtınası',ic:'🌟',cd:34,kind:'aoe',r:200,m:3.8,slow:4,lv:18}],
 sifaci:[{id:'bless',n:'Kutsama',ic:'🌟',cd:24,kind:'buff',dur:10,dmgm:1.6,lv:6},{id:'sanct',n:'Kutsal Alan',ic:'🌿',cd:22,kind:'hot',dur:10,amt:.08,lv:10},{id:'revive',n:'Işığın Dönüşü',ic:'💚',cd:55,kind:'heal',r:200,amt:1,lv:18}],
 suikastci:[{id:'fan',n:'Bıçak Yağmuru',ic:'🗡',cd:12,kind:'aoe',r:135,m:2.3,lv:6},{id:'exec',n:'İnfaz',ic:'💀',cd:24,kind:'strike',rng:310,m:6.5,lv:10},{id:'dance',n:'Ölüm Dansı',ic:'🌟',cd:38,kind:'aoe',r:160,m:4.8,lv:18}]};
Object.keys(NEWSK).forEach(function(k){CLASSES[k].sk=CLASSES[k].sk.concat(NEWSK[k])});
/* silahlar: her sınıfta 9 kademe. m = hasar çarpanı, c = yapım malzemesi */
var WT=[{lv:1,m:1,rar:0,c:null},{lv:5,m:1.25,rar:0,c:{wood:10,stone:10,gold:60}},{lv:8,m:1.55,rar:1,c:{i_copper:4,gold:160}},{lv:12,m:1.95,rar:1,c:{i_iron:5,gold:380}},{lv:16,m:2.45,rar:2,c:{i_silver:6,gold:800}},{lv:20,m:3,rar:2,c:{i_gold:6,gold:1600}},{lv:26,m:3.8,rar:3,c:{i_mithril:6,gold:3200}},{lv:32,m:4.8,rar:4,c:{i_mithril:10,core:3,gold:8000}},{lv:40,m:6.2,rar:5,c:{i_mithril:20,core:8,gold:20000}}];
var WN={savasci:['Çırak Kılıcı','Demirbaş Kılıç','Bakır Pala','Demir Kılıç','Gümüş Kılıç','Altın Pala','Mitril Kılıç','Kan Kesen','Dünya Yarıcı'],tank:['Eski Kalkan','Meşe Kalkan','Bakır Kalkan','Demir Kalkan','Gümüş Kalkan','Altın Kalkan','Mitril Kalkan','Ejder Siperi','Dünya Kalesi'],buyucu:['Çırak Asası','Meşe Asa','Bakır Asa','Demir Asa','Gümüş Asa','Altın Asa','Mitril Asa','Yıldız Asası','Kıyamet Küresi'],sifaci:['Şifa Çubuğu','Meşe Asası','Bakır Hale','Demir Hale','Gümüş Hale','Altın Hale','Mitril Hale','Kutsal Asa','Işığın Tahtı'],suikastci:['Paslı Hançer','Demirbaş Hançer','Bakır Hançer','Demir Hançer','Gümüş Hançer','Altın Hançer','Mitril Hançer','Gölge Dişi','Sessiz Son']};
var WLV=[1,5,8,12,16,20,26,32,40,48,56,64,72,80,88,96,104,112,120,128,136,144,150];
var PFX=['Çırak','Meşe','Bakır','Demir','Gümüş','Altın','Mitril','Ejder','Kadim','Titanyum','Obsidyen','Yıldız','Gölge','Kızıl Ay','Buzul','Volkan','Fırtına','Göksel','Kıyamet','Ölümsüz','Efsane','Yaxest','Ezeli'];
var WNOUN={savasci:'Kılıç',tank:'Kalkan',buyucu:'Büyü Asası',sifaci:'Şifa Asası',suikastci:'Hançer'};
var ZNOUN={savasci:'Zırh',tank:'Plaka Zırh',buyucu:'Cüppe',sifaci:'Cübbe',suikastci:'Pelerin'};
for(var wi=9;wi<WLV.length;wi++){var gm=['ruby','emerald','sapphire'][wi%3],cc={};cc[wi<13?'i_titan':'i_aster']=wi+1;cc.core=wi-3;cc[gm]=wi-2;cc.gold=Math.round(20000*Math.pow(1.36,wi-8)/100)*100;WT.push({lv:WLV[wi],m:Math.round(6.2*Math.pow(1.085,wi-8)*100)/100,rar:wi<15?4:wi<20?5:6,c:cc})}
Object.keys(WN).forEach(function(k){for(var i=9;i<WLV.length;i++)WN[k].push(PFX[i]+' '+WNOUN[k])});
var WEAPONS={};Object.keys(WN).forEach(function(k){WEAPONS[k]=WN[k].map(function(n,i){return{n:n,lv:WT[i].lv,m:WT[i].m,rar:WT[i].rar,c:WT[i].c,t:i}})});
/* zırh kademeleri: her sınıfın kendi zırhı var, seviyeye göre kuşanılır */
var ZT=WLV.map(function(lv,i){var w=WT[i],c=null;if(w.c){c={};for(var k in w.c)c[k]=Math.max(1,Math.ceil(w.c[k]*.8))}return{lv:lv,h:i<=8?1+.16*i:2.28+.22*(i-8),r:Math.min(.15,i*.007),rar:w.rar,c:c}});
var ARMOR={};Object.keys(ZNOUN).forEach(function(k){ARMOR[k]=ZT.map(function(z,i){return{n:PFX[i]+' '+ZNOUN[k],lv:z.lv,h:z.h,r:z.r,rar:z.rar,c:z.c,t:i}})});
var RARITY=[{n:'Sıradan',c:'#c9ced9'},{n:'Seçkin',c:'#7be07b'},{n:'Nadir',c:'#5cb0ff'},{n:'Destansı',c:'#c07cff'},{n:'Efsanevi',c:'#ffb02e'},{n:'Mitik',c:'#ff5b6e'},{n:'Ezeli',c:'#7df9ff'}];
var RANKS=[{n:'Acemi',mp:0,c:'#c9ced9'},{n:'Bronz',mp:80,c:'#d98a4a'},{n:'Gümüş',mp:260,c:'#dfe6f5'},{n:'Altın',mp:650,c:'#ffd23f'},{n:'Platin',mp:1400,c:'#7ad7ff'},{n:'Elmas',mp:2800,c:'#9b8cff'},{n:'Efsane',mp:5500,c:'#ff5b6e'}];
function rankOf(mp){var r=0;for(var i=0;i<RANKS.length;i++)if(mp>=RANKS[i].mp)r=i;return r}
/* PvP kuralı: saldıran, kendinden en fazla 1 seviye üstteki oyuncuya saldırabilir/öldürebilir. 5 altı yeni oyuncular korunur. */
function pvpOk(attLv,defLv){return defLv<=attLv+1}
/* beceri puanı: seviye başına 1 puan; her beceri rütbe 1..5 */
function skillPts(p){var sp=Math.max(0,(p.lv||1)-1),sr=p.sr||{};for(var k in sr)sp-=Math.max(0,sr[k]-1);return sp}
function skRank(p,id){return(p.sr&&p.sr[id])||1}
/* günlük görevler (sunucu da aynı tohumla üretir) */
function genQuests(day,lv){function r(i){return hash(day,i,77)}var L=[],K=lv<5?['slime','boar']:lv<12?['wolf','boar','slime']:['golem','wolf','boar'],G=lv<6?['wood','stone']:lv<10?['wood','stone','copper']:lv<16?['copper','iron','wood']:['iron','silver','goldore'];
 var kk=K[Math.floor(r(1)*K.length)],gg=G[Math.floor(r(2)*G.length)],n1=8+Math.floor(r(3)*8),n2=8+Math.floor(r(4)*8);
 L.push({id:'k'+day,t:'kill',k:kk,n:n1,mp:10+n1,gold:30+lv*8+n1*3,xp:40+lv*18});
 L.push({id:'a'+day,t:'kill',k:'any',n:25,mp:34,gold:70+lv*12,xp:90+lv*24});
 L.push({id:'g'+day,t:'gather',k:gg,n:n2,mp:10+n2,gold:25+lv*6+n2*3,xp:30+lv*14});
 L.push({id:'s'+day,t:'smelt',k:'any',n:4+Math.floor(r(5)*4),mp:18,gold:60+lv*10,xp:50+lv*16});
 L.push({id:'d'+day,t:'dg',k:lv>=10?'kristal':'kurt',n:1,mp:lv>=10?40:22,gold:80+lv*14,xp:120+lv*30});
 return L}
function genWeekly(wk,lv){return[{id:'wk'+wk,t:'kill',k:'any',n:120,mp:90,gold:300+lv*50,xp:300+lv*60,w:1,tt:'Büyük Av'},{id:'wg'+wk,t:'gather',k:'any',n:120,mp:90,gold:260+lv*45,xp:260+lv*50,w:1,tt:'Büyük Hasat'},{id:'wd'+wk,t:'dg',k:'any',n:2,mp:140,gold:500+lv*70,xp:600+lv*80,w:1,tt:'Zindan Sözleşmesi'}]}
/* Zindanlar: aşama aşama (oda oda). k: mob | elite | trap | chest | boss. Her boss kendine özgü mekaniklere sahip. */
function mob(n,t,c,x){return{k:'mob',n:n,t:t,c:c,extra:x||null}}
function elite(n,t,x){return{k:'elite',n:n,t:t,c:1,extra:x||null}}
function trap(n,t,c){return{k:'trap',n:n,t:t,c:c}}
function chest(n){return{k:'chest',n:n,t:'',c:0}}
function bossS(n,t,mech,add){return{k:'boss',n:n,t:t,c:1,mech:mech,add:add}}
function dgRw(lv,mul){mul=mul||1;var r=lv/4;return{gold:Math.round(60*Math.pow(r,1.45)*mul),xp:Math.round(140*Math.pow(r,1.9)*mul),crystal:Math.max(2,Math.round(lv/12)),core:Math.max(1,Math.round(lv/22)),mp:Math.round(15+lv*1.1)}}
var DUNGEONS={
 kurt:{n:'Kurt İni',ic:'🐺',lv:4,party:1,rk:0,th:'cave',desc:'5 aşama: sürü yuvası, kemik mağarası, hazine odası, Kurt Şefi ve Alfa Kurt. Tek başına girilebilir.',stages:[mob('Sürü Yuvası','wolf',4),mob('Kemik Mağarası','wolf',6),chest('Gizli Hazine Odası'),elite('Kurt Şefi','wolf',{t:'wolf',c:2}),bossS('Alfa Kurdun İni','alpha',['summon','enrage'],{t:'wolf',c:2})],reward:{gold:60,xp:140,fang:2,mp:15}},
 kristal:{n:'Kristal Mağara',ic:'💎',lv:10,party:2,rk:1,th:'crystal',desc:'6 aşama: kristal tüneller, tuzak odası, hazine ve Kristal Bekçi. En az 2 kişilik parti.',stages:[mob('Kristal Tüneller','golem',4),trap('Titreşim Odası','golem',5),chest('Kristal Hazinesi'),mob('Yankı Salonu','bat',8,{t:'golem',c:2}),elite('Taş Muhafız','golem',{t:'golem',c:2}),bossS('Bekçinin Kalbi','guardian',['slam','heal'],{t:'golem',c:2})],reward:{gold:200,xp:520,crystal:3,mp:40}},
 kale:{n:'Taş Kale',ic:'🏰',lv:16,party:3,rk:2,th:'castle',desc:'7 aşama: kale kapısı, surlar, zindan hücreleri, hazine, şövalye ve Kale Muhafızı. 3 kişi, Gümüş rütbe.',stages:[mob('Kale Kapısı','boar',6),mob('Surlar','golem',6,{t:'wolf',c:4}),trap('Zindan Hücreleri','golem',6),chest('Silah Odası'),mob('Büyük Salon','golem',8,{t:'boar',c:4}),elite('Kale Şövalyesi','golem',{t:'boar',c:3}),bossS('Taht Salonu','warden',['charge','summon'],{t:'boar',c:3})],reward:{gold:600,xp:1500,crystal:6,core:1,mp:90}},
 golge:{n:'Gölge Mezarlığı',ic:'💀',lv:22,party:3,rk:3,th:'crypt',desc:'7 aşama: mezar kapısı, lahitler, ruh salonu, hazine, Gölge Şövalyesi ve Mezar Lordu. Altın rütbe.',stages:[mob('Mezar Kapısı','skel',6),mob('Lahitler','skel',8,{t:'wolf',c:4}),trap('Ruh Salonu','skel',8),chest('Gömü Odası'),mob('Kemik Koridoru','skel',10),elite('Gölge Şövalyesi','skel',{t:'skel',c:4}),bossS('Lord\'un Odası','lich',['nova','summon','heal'],{t:'skel',c:4})],reward:{gold:1400,xp:3600,crystal:10,core:2,mp:160}},
 buz:{n:'Buz Sarayı',ic:'❄️',lv:34,party:3,rk:3,th:'ice',desc:'7 aşama: donmuş koridorlar, kar fırtınası, hazine ve Buz Kralı. Dondurucu şok dalgaları!',stages:[mob('Donmuş Koridor','icewolf',7),mob('Kar Salonu','yeti',6,{t:'icewolf',c:4}),trap('Buz Pisti','icewolf',8),chest('Buzul Hazinesi'),mob('Kırağı Köprüsü','frostwraith',8),elite('Buz Muhafızı','yeti',{t:'icewolf',c:4}),bossS('Buz Kralının Tahtı','frostking',['nova','slam'],{t:'icewolf',c:3})],reward:dgRw(34)},
 col:{n:'Kum Mezarı',ic:'🏺',lv:46,party:3,rk:3,th:'desert',desc:'7 aşama: kum tünelleri, mumya odaları, hazine ve Firavun. Kutsal lanet ve mumya orduları.',stages:[mob('Kum Tüneli','sandworm',7),mob('Mumya Odası','mummy',7,{t:'cobra',c:4}),trap('Diken Koridoru','cobra',8),chest('Firavun Hazinesi'),mob('Sütunlu Salon','mummy',8,{t:'sandworm',c:4}),elite('Sfenks Bekçi','sandelem',{t:'cobra',c:4}),bossS('Firavunun Mezarı','pharaoh',['summon','slam','enrage'],{t:'mummy',c:3})],reward:dgRw(46)},
 batak:{n:'Çürük Yuva',ic:'🐸',lv:60,party:4,rk:4,th:'swamp',desc:'8 aşama: zehirli göletler, cadı kulübesi, hazine ve Hidra. Kendini yenileyen canavar!',stages:[mob('Zehirli Gölet','bogtoad',8),mob('Sülük Çukuru','leech',8,{t:'bogtoad',c:4}),trap('Çürük Köprü','croc',8),chest('Cadının Sandığı'),mob('Cadı Kulübesi','hag',6,{t:'leech',c:4}),mob('Çürük Salon','fenbeast',6,{t:'croc',c:4}),elite('Bataklık Bekçisi','fenbeast',{t:'hag',c:3}),bossS('Hidranın Havuzu','hydra',['heal','slam','summon'],{t:'leech',c:4})],reward:dgRw(60)},
 volkan:{n:'Magma Çekirdeği',ic:'🌋',lv:76,party:4,rk:4,th:'lava',desc:'8 aşama: lav nehirleri, ifrit odası, hazine ve Magma Lordu. Ateşli saldırılar ve öfke!',stages:[mob('Lav Nehri','magmaslime',8),mob('İfrit Odası','imp',8,{t:'magmaslime',c:4}),trap('Kızgın Zemin','hellhound',8),chest('Magma Sandığı'),mob('Cehennem Köprüsü','hellhound',7,{t:'imp',c:4}),mob('Semender Yuvası','salamander',6),elite('Lav Şövalyesi','lavagolem',{t:'hellhound',c:3}),bossS('Magma Çekirdeği','magmalord',['nova','charge','enrage'],{t:'imp',c:4})],reward:dgRw(76)},
 gok:{n:'Gök Kulesi',ic:'⛈️',lv:92,party:4,rk:5,th:'sky',desc:'8 aşama: bulut basamakları, fırtına odaları, hazine ve Fırtına Titanı. Şimşek ve ani hamleler!',stages:[mob('Bulut Basamakları','frostwraith',8),mob('Fırtına Odası','djinn',6,{t:'sandelem',c:4}),trap('Şimşek Koridoru','djinn',8),chest('Gök Hazinesi'),mob('Rüzgar Terası','mammoth',5,{t:'frostwraith',c:4}),mob('Titan Salonu','sphinx',6,{t:'djinn',c:3}),elite('Bulut Muhafızı','mammoth',{t:'djinn',c:3}),bossS('Fırtınanın Gözü','stormtitan',['charge','nova','slam'],{t:'djinn',c:3})],reward:dgRw(92)},
 tapinak:{n:'Kadim Tapınak',ic:'🛕',lv:110,party:5,rk:5,th:'temple',desc:'9 aşama: unutulmuş salonlar, rün odaları, hazine ve Kadim Bekçi. Her mekaniği bilir.',stages:[mob('Unutulmuş Salon','sphinx',7),mob('Rün Odası','mummy',8,{t:'fenbeast',c:4}),trap('Kader Koridoru','sphinx',8),chest('Tapınak Hazinesi'),mob('Yankı Tapınağı','fenbeast',7,{t:'sphinx',c:4}),mob('Yıldız Salonu','mammoth',6),mob('Kadim Bekçiler','sphinx',6,{t:'mammoth',c:3}),elite('Kutsal Muhafız','sphinx',{t:'fenbeast',c:3}),bossS('Kadim Odası','elder',['summon','nova','heal','enrage'],{t:'sphinx',c:3})],reward:dgRw(110,1.1)},
 bosluk:{n:'Boşluk Kapısı',ic:'🕳️',lv:130,party:5,rk:6,th:'void',desc:'9 aşama: boşluk koridorları, ejder yuvaları, hazine ve Boşluk Lordu. Efsane rütbe.',stages:[mob('Boşluk Koridoru','frostdrake',6),mob('Ejder Yuvası','swampdrake',6,{t:'lavadrake',c:3}),trap('Gerçeklik Çatlağı','lavadrake',7),chest('Boşluk Sandığı'),mob('Kayıp Salon','frostdrake',7,{t:'swampdrake',c:4}),mob('Ejder Mezarlığı','lavadrake',7,{t:'frostdrake',c:4}),mob('Karanlık Geçit','swampdrake',8),elite('Boşluk Şövalyesi','lavadrake',{t:'frostdrake',c:3}),bossS('Boşluğun Kalbi','voidlord',['slam','nova','charge','enrage'],{t:'lavadrake',c:3})],reward:dgRw(130,1.2)},
 ezeli:{n:'Ezeli Taht',ic:'👑',lv:150,party:5,rk:6,th:'void',desc:'10 aşama: Yaxest\'in son sınavı. Tüm ejderhalar, hazine ve Ezeli Muhafız Yaxest. Seviye 150 gerekir.',stages:[mob('Taht Yolu','lavadrake',8),mob('Buz Salonu','frostdrake',8),mob('Bataklık Salonu','swampdrake',8),trap('Ezeli Koridor','lavadrake',9),chest('Ezeli Hazine'),mob('Gök Salonu','mammoth',8,{t:'djinn',c:4}),mob('Ejder Kralları','frostdrake',8,{t:'lavadrake',c:4}),elite('Ezeli Şövalye','lavadrake',{t:'swampdrake',c:4}),elite('Taht Bekçisi','frostdrake',{t:'frostdrake',c:4}),bossS('Yaxest\'in Tahtı','yaxest',['summon','slam','nova','charge','enrage','heal'],{t:'lavadrake',c:3})],reward:dgRw(150,1.4)}
};
/* zindan çeşitliliği: her uzun zindana 'Hayatta Kal' ve boss öncesi 'Dinlenme' odası eklenir */
Object.keys(DUNGEONS).forEach(function(k){var d=DUNGEONS[k],st=d.stages;if(!st||st.length<5||st.some(function(x){return x.k==='rest'}))return;
  var mb=st.filter(function(x){return x.k==='mob'&&x.t})[0];
  st.splice(st.length-1,0,{k:'rest',n:'Dinlenme Odası',t:'',c:0});
  if(mb)st.splice(Math.min(2,st.length-2),0,{k:'surv',n:'Hayatta Kal',t:mb.t,c:0,sec:20+Math.min(20,Math.floor(d.lv/4))});
  d.desc=d.desc.replace(/^\d+ aşama/,st.length+' aşama')});

Object.keys(DUNGEONS).forEach(function(k){var d=DUNGEONS[k];d.waves=d.stages})
var MON={
 slime:{n:'Balçık',c:'#6fe08a',hm:1,dm:.8,sp:70,sz:16,xp:1,g:1},
 wolf:{n:'Kurt',c:'#aab2c4',hm:1.3,dm:1.1,sp:115,sz:18,xp:1.2,g:1.2},
 boar:{n:'Yaban Domuzu',c:'#c28a5c',hm:1.8,dm:1,sp:95,sz:20,xp:1.5,g:1.3},
 golem:{n:'Taş Golem',c:'#8f9bb7',hm:2.6,dm:1.3,sp:70,sz:24,xp:2.2,g:1.8},
 alpha:{n:'Alfa Kurt',c:'#e86a5a',hm:9,dm:1.7,sp:120,sz:30,xp:8,g:8,boss:1},
 metin:{n:'Fetih Kristali',c:'#b57bff',hm:10,dm:0,sp:0,sz:30,xp:5,g:6,boss:1},
 skel:{n:'İskelet Savaşçı',c:'#e8e4d4',hm:2.2,dm:1.5,sp:90,sz:20,xp:2.6,g:2.2},
 lich:{n:'Mezar Lordu',c:'#7a4fd0',hm:18,dm:2.3,sp:70,sz:30,xp:14,g:20,boss:1},
 guardian:{n:'Kristal Bekçi',c:'#7ad7ff',hm:14,dm:2,sp:80,sz:34,xp:10,g:14,boss:1},
 rabbit:{n:'Çılgın Tavşan',c:'#e8e0d0',hm:.7,dm:.7,sp:140,sz:14,xp:1,g:1},
 bee:{n:'Öfkeli Arı',c:'#ffd23f',hm:.6,dm:1.3,sp:135,sz:12,xp:1.2,g:1.2},
 fox:{n:'Kızıl Tilki',c:'#ff8a3d',hm:1.2,dm:1.2,sp:125,sz:16,xp:1.4,g:1.4},
 spider:{n:'Dev Örümcek',c:'#4a3a5a',hm:1.6,dm:1.5,sp:105,sz:18,xp:1.9,g:1.7},
 treant:{n:'Ağaç Ent',c:'#5a8a3a',hm:3.4,dm:1.3,sp:60,sz:28,xp:2.7,g:2.1},
 bat:{n:'Mağara Yarasası',c:'#6a4a8a',hm:.9,dm:1.3,sp:150,sz:14,xp:1.7,g:1.5},
 scorpion:{n:'Çöl Akrebi',c:'#d4a04a',hm:1.9,dm:1.7,sp:100,sz:18,xp:2.3,g:2.1},
 bear:{n:'Kaya Ayısı',c:'#7a5a3a',hm:3.1,dm:1.6,sp:90,sz:26,xp:2.9,g:2.5},
 wraith:{n:'Sis Hayaleti',c:'#9ad0ff',hm:2.1,dm:2,sp:110,sz:20,xp:3.3,g:2.9},
 drake:{n:'Dağ Ejderi',c:'#e0463d',hm:8,dm:2.4,sp:100,sz:30,xp:7,g:7,boss:1},
 goldslime:{n:'Altın Balçık',c:'#ffd23f',hm:3,dm:.15,sp:150,sz:16,xp:6,g:40},
 queen:{n:'Kızıl Ay Kraliçesi',c:'#ff3b6e',hm:14,dm:2.3,sp:95,sz:34,xp:14,g:16,boss:1},
 leviathan:{n:'Göl Canavarı',c:'#2a8fbf',hm:16,dm:2.4,sp:80,sz:36,xp:16,g:20,boss:1}
};
/* yeni canavarlar: [id,ad,renk,can,hasar,hız,boyut,xp,altın,min seviye] */
[['mushroom','Mantar Cücesi','#d9544d',.8,.9,65,14,1,1,1],['frog','Zıplayan Kurbağa','#5fb35a',.9,.8,110,14,1,1,1],['snail','Dev Salyangoz','#b98a5a',1.4,.6,40,16,1,1,2],
 ['goblin','Goblin Hırsızı','#6aa84f',1.4,1.3,120,17,1.6,2,5],['snake','Orman Yılanı','#8bc34a',1.1,1.5,115,16,1.5,1.4,5],['beetle','Boynuzlu Böcek','#5a4a2a',2,1.1,80,18,1.6,1.5,6],['wisp','Orman Ruhu','#9be6c8',1,1.7,125,14,1.9,1.8,7],
 ['harpy','Harpi','#c9a0dc',1.7,1.7,135,18,2.4,2.2,14],['gargoyle','Gargoyl','#7a7f8f',3.2,1.6,75,24,2.8,2.5,16],
 ['icewolf','Buz Kurdu','#bfe8ff',2.2,1.5,125,20,3,2.6,20],['yeti','Yeti','#e8f2ff',4,1.8,80,28,3.6,3.2,32],['frostwraith','Kırağı Hayaleti','#8fd0ff',2.8,2.3,115,20,4,3.6,48],['iceelem','Buz Elementali','#5cc8ff',5,2.2,70,28,4.6,4,68],['mammoth','Mamut','#9a8f86',7,2.4,70,34,5.4,5,95],['frostdrake','Buz Ejderi','#7ad7ff',6.5,2.8,105,30,6,6,125],
 ['sandworm','Kum Solucanı','#d9b36a',2.4,1.6,95,22,3,2.6,20],['cobra','Kobra','#9acd32',2,2,130,18,3.4,3,32],['mummy','Mumya','#d8c9a0',4,1.9,70,24,3.8,3.4,48],['sandelem','Kum Elementali','#e0b45a',5,2.1,85,28,4.5,4,68],['sphinx','Sfenks Muhafızı','#c9a24a',7,2.4,75,34,5.4,5,95],['djinn','Çöl Cini','#5cd6e0',6,3,115,26,6,6,125],
 ['bogtoad','Bataklık Kurbağası','#4f8a4a',2.6,1.5,100,22,3,2.6,20],['leech','Dev Sülük','#6a3a4a',2.2,1.9,90,20,3.4,3,32],['croc','Timsah','#4a7a3a',4.4,2,85,30,3.8,3.4,48],['hag','Bataklık Cadısı','#7a5a8a',3.6,2.4,95,22,4.6,4,68],['fenbeast','Çürük Canavarı','#5a6a3a',7.5,2.2,70,34,5.4,5,95],['swampdrake','Bataklık Ejderi','#6aa04a',6.5,2.8,100,30,6,6,125],
 ['magmaslime','Magma Balçığı','#ff6a2a',2.6,1.6,80,22,3,2.6,20],['imp','İfrit Cücesi','#ff4a3a',2,2.1,130,18,3.4,3,32],['lavagolem','Lav Golemi','#c8501e',5,2,65,30,3.8,3.4,48],['hellhound','Cehennem Köpeği','#8a1e1e',3.8,2.5,135,24,4.6,4,68],['salamander','Semender','#ff8a2a',7,2.3,90,30,5.4,5,95],['lavadrake','Magma Ejderi','#e0261d',6.5,3,105,32,6,6,125]
].forEach(function(r){MON[r[0]]={n:r[1],c:r[2],hm:r[3],dm:r[4],sp:r[5],sz:r[6],xp:r[7],g:r[8],ml:r[9]}});
/* boss canavarlar (zindan bosları): [id,ad,renk,can,hasar,hız,boyut,min seviye,mekanikler] */
[['warden','Kale Muhafızı','#ff7a5c',15,2.1,85,36,16],['frostking','Buz Kralı','#9ae0ff',17,2.4,80,38,34],['pharaoh','Firavun','#e8c050',18,2.4,85,36,46],['hydra','Hidra','#4a9a4a',20,2.5,80,40,60],['magmalord','Magma Lordu','#ff5a1e',22,2.7,85,40,76],['stormtitan','Fırtına Titanı','#7a8cff',24,2.8,95,42,92],['elder','Kadim Bekçi','#b0ffd0',26,3,85,42,110],['voidlord','Boşluk Lordu','#6a2aaa',28,3.2,95,44,130],['yaxest','Yaxest, Ezeli Muhafız','#ffd23f',32,3.5,100,48,150]
].forEach(function(r){MON[r[0]]={n:r[1],c:r[2],hm:r[3],dm:r[4],sp:r[5],sz:r[6],xp:r[3]*.8,g:r[3],boss:1,ml:r[7]}});
(function(m){for(var k in m)MON[k].ml=m[k]})({slime:1,rabbit:1,bee:2,boar:3,wolf:5,fox:5,spider:7,treant:9,golem:11,bat:12,scorpion:13,bear:15,wraith:20,skel:22,goldslime:5,alpha:4,guardian:10,lich:22,drake:40,queen:30,leviathan:35,metin:9});
var SECT=[['icewolf','yeti','frostwraith','iceelem','mammoth','frostdrake'],['sandworm','cobra','mummy','sandelem','sphinx','djinn'],['bogtoad','leech','croc','hag','fenbeast','swampdrake'],['magmaslime','imp','lavagolem','hellhound','salamander','lavadrake']];
var SECN=['Buzul Diyarı','Kum Denizi','Çürük Bataklık','Magma Ovası'];
function quad(dx,dy){return dx>=0&&dy<0?0:dx>=0?1:dy>=0?2:3}
/* evcil hayvanlar: her canavarın kendi yavru yoldaşı vardır. Yumurta olarak çok nadir düşer. */
var PETB=['xp','gold','regen'],PETD={},PETN=0;
Object.keys(MON).forEach(function(k){if(k==='metin')return;var m=MON[k],r=m.boss?(m.ml<30?3:4):(m.ml<12?0:m.ml<30?1:m.ml<60?2:3);PETD[k]={id:'p_'+k,t:k,n:m.boss?m.n.split(',')[0]+' Yavrusu':'Yavru '+m.n,r:r,col:m.c,b:PETB[(PETN++)%3],ml:m.ml||1,boss:!!m.boss,ic:m.boss?'👑':'🥚'}});
var EGGMIN=[3,8,15,30,60];
function eggChance(type,lv,pl,elite,inDg){var p=PETD[type];if(!p)return 0;var c=p.boss?(p.r>=4?(inDg?.0025:.0012):(inDg?.008:.004)):[.004,.0022,.0009,.00025,.00006][p.r]*(elite?3:1);if(pl-(lv||1)>10)c*=.3;return c}
function eggPrice(type){var p=PETD[type];if(!p)return 0;return Math.round((800+60*p.ml)*[1,3,9,30,100][p.r]*lvF(p.ml)/10)*10}
function monPick(z,d,h,h2,q){
  if(h2!=null&&h2<.012&&(z===0||z===1))return 'goldslime';
  if(z===0)return h<.28?'slime':h<.42?'boar':h<.56?'rabbit':h<.7?'bee':h<.82?'mushroom':h<.92?'frog':'snail';
  if(z===1&&d<56)return h<.17?'wolf':h<.28?'boar':h<.4?'fox':h<.52?'spider':h<.64?'goblin':h<.74?'snake':h<.83?'beetle':h<.91?'wisp':'treant';
  if(d<70)return h<.2?'golem':h<.34?'bat':h<.48?'scorpion':h<.6?'bear':h<.74?'harpy':h<.88?'gargoyle':'wraith';
  if(d>=100&&h>.975)return 'drake';
  var lv=zoneLv(0,d),bi=lv<32?0:lv<48?1:lv<68?2:lv<95?3:lv<125?4:5;bi+=h<.16?-1:h>.9?1:0;bi=Math.max(0,Math.min(5,bi));return SECT[q||0][bi]}
function regionAt(dx,dy,d){return d<34?'Çimenlik Ovalar':d<56?'Gölge Ormanı':d<70?'Kayalık Yaylalar':SECN[quad(dx,dy)]}
/* seviye farkı: kendinden yüksek canavara hasar azalır, aldığın hasar artar; düşüğe tersine */
function lvMod(pl,ml){var d=ml-pl;return d>0?Math.max(.08,1-.24*d):Math.min(1.4,1+.03*(-d))}
function lvIn(pl,ml){var d=ml-pl;return d>0?Math.min(4,1+.3*d):Math.max(.45,1+.06*d)}
function monFor(zone){return zone===0?(Math.random()<.75?'slime':'boar'):zone===1?(Math.random()<.6?'wolf':'boar'):'golem'}
var ZLV=[[0,3],[21,3],[34,5],[46,8],[56,12],[70,20],[85,32],[100,60],[115,100],[128,140],[142,162]];
function zoneLv(zone,d){for(var i=1;i<ZLV.length;i++){if(d<=ZLV[i][0]){var a=ZLV[i-1],b=ZLV[i];return Math.max(1,Math.floor(a[1]+(b[1]-a[1])*(d-a[0])/(b[0]-a[0])))}}return 162}
function xpNeed(l){return Math.round(70*l*l+40*l)}
function lvF(lv){var e=Math.max(0,lv-40);return 1+e*e/1400}
function mstat(type,lv){var m=MON[type],f=lvF(lv);return{hp:Math.round((30+lv*24+lv*lv*1.1)*m.hm*(1+Math.max(0,lv-40)/60)),dmg:Math.round((4+lv*2.3)*m.dm*(1+Math.max(0,lv-40)/50)),xp:Math.round((10+lv*8)*m.xp*f),gold:Math.max(1,Math.round((2+lv*2)*m.g*f*.55))}}
/* seviyeye göre kuşanılabilen en yüksek kademe */
function effT(arr,t,lv){t=Math.min(arr.length-1,t||0);while(t>0&&arr[t].lv>lv)t--;return t}
function pstat(p){var c=CLASSES[p.cls],l=p.lv,wl=p.wl||0,al=p.al||0,W=WEAPONS[p.cls][effT(WEAPONS[p.cls],p.wt,l)],Z=ARMOR[p.cls][effT(ARMOR[p.cls],p.at,l)];
  return{maxhp:Math.round((c.hp+l*13)*(1+.12*al)*Z.h),dmg:Math.round((c.dmg*(1+.13*(l-1)))*(1+.18*wl)*W.m),red:Math.min(.6,al*.035+Z.r),spd:c.spd,rng:c.rng,aspd:c.aspd}}
POIS.forEach(function(p){if(p.d>=46){var l=zoneLv(0,p.d);p.lv=Math.max(1,l-3);p.hi=l+4}});
var UPI=[0,0,0,0,['i_copper',2],['i_copper',3],['i_iron',2],['i_iron',3],['i_silver',2],['i_silver',3],['i_gold',2],['i_mithril',2],['i_mithril',3]];
function upCost(kind,n){var c=kind==='w'?{wood:4+3*n,stone:2+2*n,gold:10+15*n}:{wood:3+2*n,stone:3+3*n,gold:8+12*n},u=UPI[n];c.iron=0;if(u){c.ik=u[0];c.ic=u[1]+(kind==='w'?1:0)}return c}
var PROF={wood:'Odunculuk',mine:'Madencilik'};
function profNeed(l){return 8+l*8+l*l}
root.YD={genWeekly:genWeekly,POIS:POIS,poiPos:poiPos,poiOf:poiOf,TS:TS,MW:MW,MH:MH,CX:CX,CY:CY,hash:hash,vn:vn,zoneAt:zoneAt,nodeAt:nodeAt,NODE:NODE,TOOLS:TOOLS,MATS:MATS,CLASSES:CLASSES,DUNGEONS:DUNGEONS,MON:MON,monFor:monFor,monPick:monPick,lvMod:lvMod,lvIn:lvIn,zoneLv:zoneLv,quad:quad,regionAt:regionAt,SECT:SECT,SECN:SECN,xpNeed:xpNeed,mstat:mstat,pstat:pstat,upCost:upCost,PROF:PROF,PETD:PETD,EGGMIN:EGGMIN,eggChance:eggChance,eggPrice:eggPrice,WEAPONS:WEAPONS,RARITY:RARITY,RANKS:RANKS,rankOf:rankOf,pvpOk:pvpOk,skillPts:skillPts,skRank:skRank,genQuests:genQuests,SMELT:SMELT,PVP:PVP,profNeed:profNeed,MAXLV:150,lvF:lvF,effT:effT,ARMOR:ARMOR,ZT:ZT,WT:WT,WLV:WLV};
if(typeof module!=='undefined')module.exports=root.YD;
})(typeof window!=='undefined'?window:globalThis);
