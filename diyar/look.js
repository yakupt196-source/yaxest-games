/* Yaxest Diyarı: karakter görünümü (kostüm sistemi). Veri (katalog, fiyat, hazır karakterler) ve çizim burada.
   Kural katmanı değildir; sunucuya taşınırken yalnızca CAT/valid kısmı paylaşılır. */
(function(root){
'use strict';
var TAU=6.2832;
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function el(c,x,y,rx,ry,f){c.fillStyle=f;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill()}
function ci(c,x,y,r,f){c.fillStyle=f;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}
function ol(c){var f=c.fillStyle;c.strokeStyle=(typeof f==='string'&&f.charAt(0)==='#'&&f.length===7)?mix(f,'#1b1530',.68):'#1b1530';c.lineWidth=1.25;c.stroke()}
var MXC={};function mix(a,b,k){var kk=a+b+k;if(MXC[kk])return MXC[kk];var x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16);function ch(s){return Math.round(((x>>s)&255)*(1-k)+((y>>s)&255)*k)}return MXC[kk]='rgb('+ch(16)+','+ch(8)+','+ch(0)+')'}
function sh(hex,d){if(!/^#[0-9a-f]{6}$/i.test(hex))return hex;var n=parseInt(hex.slice(1),16),r=(n>>16)+d,g=(n>>8&255)+d,b=(n&255)+d;r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));return'rgb('+r+','+g+','+b+')'}
function poly(c,pts,f){c.fillStyle=f;c.beginPath();c.moveTo(pts[0],pts[1]);for(var i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);c.closePath();c.fill();ol(c)}

/* ---------- katalog ---------- */
var PAL={
 skin:['#ffe0c2','#f6cba0','#e9b17f','#d29a6a','#b87a4f','#9a6039','#7a4a2c','#5a3320'],
 hair:['#1d1520','#2b1a10','#5a3a22','#8a5a2a','#c9923e','#e8cf7a','#c0392b','#e8718d','#9b5cff','#4fc3ff','#3ddbb0','#d8dce8','#f2f2f2','#ff9d3d'],
 eyes:[['#3b2616','Kahve'],['#a8742c','Ela'],['#3f7fd0','Mavi'],['#3a9a5a','Yeşil'],['#7a8494','Gri'],['#9b5cff','Mor'],['#d03a4a','Kızıl'],['#e0b030','Altın']],
 cloth:['#2b2b33','#f2f2f2','#8e9aaf','#c0392b','#e8718d','#ff9d3d','#ffd23f','#5be39a','#3ddbb0','#4fc3ff','#3f6fd0','#9b5cff','#6b3fa0','#8a5a2a','#5a6b3a','#1f2a44'],
 lip:['#d9627a','#c0392b','#a8324a','#e8718d','#8a2a3a','#e89a8a'],
 fur:['#f0b872','#e6e0d6','#c9925a','#8a7a6a','#f4d9b0','#e8718d']};
function L(a){return a.map(function(x){return{id:x[0],n:x[1],p:x[2]||0}})}
var CAT={
 hair:L([['short','Kısa'],['curly','Kıvırcık'],['long','Uzun'],['wavy','Dalgalı Uzun'],['ponytail','At Kuyruğu'],['bob','Küt'],['bun','Topuz'],['buzz','Kazıma'],['bald','Kel'],['pixie','Pixie'],['sidebang','Yandan Taralı'],['lowtail','Alçak Kuyruk'],['messy','Dağınık'],['twin','İkili Kuyruk',60],['braid','Örgü',100],['mohawk','Mohikan',80],['spiky','Dikenli',80],['afro','Afro',120]]),
 top:L([['tee','Tişört'],['blouse','Bluz'],['sweater','Kazak'],['hoodie','Sweatshirt'],['shirt','Gömlek'],['leather','Deri Ceket'],['jacket','Ceket',80],['vest','Yelek',90],['jersey','Forma',70],['overalls','Salopet',100],['tunic','Tunik',60],['robe','Cüppe',150],['armor','Zırh Giysi',250],['kimono','Kimono',200],['tux','Smokin',300],['coat','Palto']]),
 bottom:L([['sweat','Eşofman'],['jeans','Kot'],['dress','Elbise'],['shorts','Şort'],['skirt','Etek'],['leggings','Tayt',40],['cargo','Kargo',60],['trousers','Kumaş Pantolon',80]]),
 shoes:L([['sneaker','Spor Ayakkabı'],['flats','Babet'],['sandals','Sandalet'],['bare','Çıplak Ayak'],['boots','Bot',60]]),
 hat:L([['none','Yok'],['beanie','Bere'],['cap','Kep'],['bandana','Bandana',30],['straw','Hasır Şapka',40],['headphones','Kulaklık',50],['hood','Kukuleta',60],['flowers','Çiçek Tacı',80],['catears','Kedi Kulağı',100],['bunny','Tavşan Kulağı',100],['helmet','Miğfer',120],['cowboy','Kovboy Şapkası',120],['witch','Cadı Şapkası',150],['horns','Boynuz',150],['tophat','Silindir',180],['pirate','Korsan Şapkası',200],['halo','Hale',300],['crown','Taç',500],['santa','Şenlik Külahı',999999],['snowcrown','Kar Tacı',999999]]),
 face:L([['none','Yok'],['glasses','Gözlük'],['shades','Güneş Gözlüğü',70],['eyepatch','Göz Bandı',90],['mask','Maske',40]]),
 neck:L([['none','Yok'],['scarf','Atkı',50],['choker','Gerdanlık',60],['necklace','Kolye',80],['bowtie','Papyon',70],['tie','Kravat',70],['medal','Madalya',150]]),
 mark:L([['none','Yok'],['lipstick','Ruj'],['freckles','Çil'],['blush','Allık'],['stubble','Sakal Gölgesi'],['bandaid','Yara Bandı',20],['mustache','Bıyık',40],['goatee','Bıyık + Keçi Sakal',40],['beard','Sakal',60],['star','Yıldız Boyası',40]]),
 back:L([['none','Yok'],['backpack','Sırt Çantası',60],['quiver','Ok Kılıfı',70],['cape','Pelerin',120],['guitar','Gitar',130],['tail','Tilki Kuyruğu',150],['wings','Melek Kanadı',400],['demon','Şeytan Kanadı',400]])};
var SLOTCOL={top:'tc',bottom:'bc',shoes:'shc',hat:'htc',neck:'nkc',back:'bkc',hair:'hc'};
var SLOTKEY={hair:'h',top:'t',bottom:'b',shoes:'sh',hat:'hat',face:'fc',neck:'nk',mark:'mk',back:'bk'};

/* özel kahramanlar */
var PRESETS={
 basic:{n:'Standart',d:'Sade, herkesin başlangıç görünümü.',ap:{g:'m',bd:1,ht:1,es:0,br:0,mo:0,fd:0,body:'human',sk:'#f0c39a',h:'short',hc:'#5b3a1e',ey:'#4a3020',t:'tee',tc:'#4a90d9',b:'jeans',bc:'#262636',sh:'sneaker',shc:'#f2f2f2',hat:'none',htc:'#3d4a63',fc:'none',nk:'none',nkc:'#ffd23f',mk:'none',bk:'none',bkc:'#c0392b'}},
 zilan:{shop:'zilan',n:'Zilan-chan (Gözlüklü)',d:'Turuncu kısa saçlı, elf kulaklı gözlüklü peri.',ap:{body:'svg',sv:'zilan'}},
 zilan2:{shop:'zilan',n:'Zilan-chan (Gözlüksüz)',d:'Aynı peri, gözlüğü çıkarmış hali.',ap:{body:'svg',sv:'zilanng'}},
 beyazkalp:{shop:'beyazkalp',n:'🤍 Beyaz Kalp',d:'Eşsiz: ela-esmer tenli, düz kumral saçlı, kahverengi gözlü zarif kız. Yalnızca kurucunun izniyle.',ap:{body:'svg',sv:'beyazkalp'}},
 atacan:{shop:'atacan',n:'Atacan',d:'Esmer, uzun boylu, kaslı ve yakışıklı.',ap:{body:'svg',sv:'atacan'}},
 suayb:{shop:'suayb',n:'Şuayb',d:'Tombul, sarı dalgalı saçlı, renkli gözlü yakışıklı.',ap:{body:'svg',sv:'suayb'}},
 ninja:{shop:'ninja',n:'Siber Ninja',d:'Neon vizörlü gölge savaşçı.',ap:{body:'svg',sv:'ninja'}},
 cadi:{shop:'cadi',n:'Ateş Cadısı',d:'Alev saçlı büyücü.',ap:{body:'svg',sv:'cadi'}},
 samuray:{shop:'samuray',n:'Neon Samuray',d:'Parlayan kılıçlı gelecek savaşçısı.',ap:{body:'svg',sv:'samuray'}},
 prenses:{shop:'prenses',n:'Kozmik Prenses',d:'Yıldız tacıyla galaksi prensesi.',ap:{body:'svg',sv:'prenses'}},
 buz:{shop:'buz',n:'Buz Kraliçesi',d:'Kristal tacı ve buz saçlı kraliçe.',ap:{body:'svg',sv:'buz'}},
 defne:{shop:'defne',n:'Farmer Daisy',d:'Hasat zamanı hep onda; hasır şapkalı çiftçi kız.',ap:{body:'svg',sv:'defne'}},
 elif:{shop:'elif',n:'Student Yuna',d:'Okul çıkışı maceraya atılan, kırmızı gözlüklü kız.',ap:{body:'svg',sv:'elif'}},
 murat:{shop:'murat',n:'Fisher Marco',d:'Gölün kıyısından hiç ayrılmayan sakallı balıkçı.',ap:{body:'svg',sv:'murat'}},
 can:{shop:'can',n:'Sporty Jake',d:'Enerjisi bitmeyen kafa bantlı sporcu.',ap:{body:'svg',sv:'can'}},
 selin:{shop:'selin',n:'Explorer Nora',d:'Gözlüklü kaşif; haritasız yola çıkmaz.',ap:{body:'svg',sv:'selin'}},
 ayse:{shop:'ayse',n:'Healer Lilia',d:'Yeşil saçlı şifacı; dokunduğu yaralar kapanır.',ap:{body:'svg',sv:'ayse'}},
 kerem:{shop:'kerem',n:'Archer Robin',d:'Kapüşonlu okçu; oku hiç şaşmaz.',ap:{body:'svg',sv:'kerem'}},
 burak:{shop:'burak',n:'Smith Bruno',d:'Demir döver, sakalını hiç kesmez.',ap:{body:'svg',sv:'burak'}},
 selen:{shop:'selen',n:'Moon Priestess Luna',d:'Ayın ışığıyla konuşan gümüş saçlı rahibe.',ap:{body:'svg',sv:'selen'}},
 ceren:{shop:'ceren',n:'Pirate Scarlett',d:'Tek gözlü korsan; haritaların efendisi.',ap:{body:'svg',sv:'ceren'}},
 tarik:{shop:'tarik',n:'Shadow Hunter Kage',d:'Gölgelerden çıkıp gölgelere karışan avcı.',ap:{body:'svg',sv:'tarik'}},
 emre:{shop:'emre',n:'Engineer Axel',d:'Mekanik koluyla her şeyi tamir eden mühendis.',ap:{body:'svg',sv:'emre'}},
 nehir:{shop:'nehir',n:'Forest Fairy Sylva',d:'Çiçek taçlı, kelebek kanatlı orman perisi.',ap:{body:'svg',sv:'nehir'}},
 nox:{shop:'nox',n:'Night Queen Nyx',d:'Gece Kraliçesi; boynuzlu, yarasa kanatlı.',ap:{body:'svg',sv:'nox'}},
 aras:{shop:'aras',n:'Wind Knight Aeron',d:'Rüzgârın izinden giden zırhlı şövalye.',ap:{body:'svg',sv:'aras'}},
 kaan:{shop:'kaan',n:'Flame Master Ignis',d:'Saçları alev alev yanan ateş ustası.',ap:{body:'svg',sv:'kaan'}},
 arya:{shop:'arya',n:'Sun Goddess Solara',d:'Güneşin kızı; haleli ve altın kanatlı tanrıça.',ap:{body:'svg',sv:'arya'}},
 zehra:{shop:'zehra',n:'Dragon Queen Drakena',d:'Ejder boynuzlu, alev kanatlı kraliçe.',ap:{body:'svg',sv:'zehra'}},
 atlas:{shop:'atlas',n:'Time Mage Chronos',d:'Zamanı büyüyle bükebilen beyaz sakallı bilge.',ap:{body:'svg',sv:'atlas'}},
 kaya:{shop:'kaya',n:'Titan King Goliath',d:'Titanların kralı; taçlı, pelerinli, yenilmez.',ap:{body:'svg',sv:'kaya'}},
 sultan:{shop:'sultan',n:'Altın Sultan',d:'Altın ve mücevherlerle süslü hükümdar.',ap:{body:'svg',sv:'sultan'}},
 yaxest:{founder:1,n:'Yaxest (Kurucu)',d:'Yalnızca Kurucuya özel. Yıldırım auralı.',ap:{fd:1,body:'human',sk:'#e9b17f',h:'curly',hc:'#2b1a10',ey:'#a8742c',t:'hoodie',tc:'#8e9aaf',b:'sweat',bc:'#6f778c',sh:'sneaker',shc:'#f2f2f2',hat:'beanie',htc:'#3d4a63',fc:'none',nk:'none',nkc:'#ffd23f',mk:'none',bk:'none',bkc:'#c0392b'}},
 cemile:{shop:'cemile',n:'Cemile',d:'Tombul yanaklı sevimli hamster.',ap:{body:'hamster',sk:'#f0b872',h:'short',hc:'#8a5a2a',ey:'#3b2616',t:'tee',tc:'#e8718d',b:'sweat',bc:'#6f778c',sh:'sneaker',shc:'#f2f2f2',hat:'none',htc:'#e8718d',fc:'none',nk:'bowtie',nkc:'#e8718d',mk:'none',bk:'none',bkc:'#c0392b'}},
 yaxest2:{founder:1,n:'Yaxest (Kurucu Palto)',d:'Yalnızca Kurucuya özel. Siyah palto, yıldırım auralı.',ap:{fd:1,body:'human',sk:'#e6b48c',h:'curly',hc:'#241711',ey:'#a8742c',t:'coat',tc:'#1b1b24',b:'trousers',bc:'#262636',sh:'boots',shc:'#1b1b24',hat:'none',htc:'#3d4a63',fc:'none',nk:'none',nkc:'#ffd23f',mk:'goatee',bk:'none',bkc:'#c0392b'}},
 almin:{shop:'almin',n:'Almin',d:'Mor saçlı, havalı, deri ceketli.',ap:{body:'human',sk:'#f6cba0',h:'wavy',hc:'#9b5cff',ey:'#9b5cff',t:'leather',tc:'#1b1b24',b:'jeans',bc:'#262636',sh:'boots',shc:'#1b1b24',hat:'headphones',htc:'#2b2b33',fc:'none',nk:'choker',nkc:'#1b1b24',mk:'none',bk:'none',bkc:'#c0392b'}}};
function def(){var o={};var p=PRESETS.basic.ap;for(var k in p)o[k]=p[k];return o}
function isFree(slot,id){var l=CAT[slot];for(var i=0;i<l.length;i++)if(l[i].id===id)return l[i].p===0;return false}
function price(slot,id){var l=CAT[slot];for(var i=0;i<l.length;i++)if(l[i].id===id)return l[i].p;return 0}
function valid(ap){var d=def(),o={};for(var k in d)o[k]=ap&&ap[k]!=null?ap[k]:d[k];
  Object.keys(SLOTKEY).forEach(function(s){var f=SLOTKEY[s],ok=CAT[s].some(function(x){return x.id===o[f]});if(!ok)o[f]=d[f]});o.g=o.g==='f'?'f':'m';o.fd=o.fd?1:0;[['bd',2],['ht',2],['es',2],['br',3],['mo',3]].forEach(function(q){var v=parseInt(o[q[0]],10);o[q[0]]=isNaN(v)?d[q[0]]:Math.max(0,Math.min(q[1],v))});if(ap&&ap.body==='svg'&&typeof ap.sv==='string'&&/^[a-z]+$/.test(ap.sv)){o.body='svg';o.sv=ap.sv}else if(o.body!=='hamster')o.body='human';return o}

/* ---------- çizim ---------- */
function hairBack(c,ap,hy){var h=ap.h,hc=ap.hc,d=sh(hc,-30);
  if(h==='curly'){[[-10,-6,4.6],[10,-6,4.6],[-8,-11,5],[8,-11,5],[0,-13,5.4],[-11,-.5,3.4],[11,-.5,3.4]].forEach(function(q){ci(c,q[0],hy+q[1],q[2],hc);c.beginPath();c.arc(q[0],hy+q[1],q[2],0,TAU);ol(c)})}
  else if(h==='long'||h==='wavy'){c.fillStyle=hc;rr(c,-13,hy-6,26,h==='wavy'?34:30,9);c.fill();ol(c);if(h==='wavy'){ci(c,-9,hy+30,5,hc);ci(c,0,hy+31,5,hc);ci(c,9,hy+30,5,hc)}}
  else if(h==='lowtail'){c.save();c.translate(0,hy+9);c.fillStyle=hc;c.beginPath();c.moveTo(-4,0);c.quadraticCurveTo(-8,14,-3,26);c.quadraticCurveTo(0,30,3,26);c.quadraticCurveTo(8,14,4,0);c.closePath();c.fill();ol(c);c.fillStyle=sh(hc,-34);c.fillRect(-4.6,.4,9.2,2.6);c.restore();el(c,0,hy+1,12.6,12,hc)}
  else if(h==='sidebang'){c.fillStyle=hc;rr(c,-13,hy-6,26,27,10);c.fill();ol(c)}
  else if(h==='bob'){el(c,0,hy+2,13.4,14,hc);c.beginPath();c.ellipse(0,hy+2,13.4,14,0,0,TAU);ol(c)}
  else if(h==='afro'){ci(c,0,hy-3,17,hc);c.beginPath();c.arc(0,hy-3,17,0,TAU);ol(c)}
  else if(h==='ponytail'){c.save();c.translate(13,hy+4);c.rotate(-.35);el(c,0,8,4.2,11,hc);c.beginPath();c.ellipse(0,8,4.2,11,0,0,TAU);ol(c);c.restore()}
  else if(h==='twin'){[-1,1].forEach(function(s){c.save();c.translate(s*14,hy+5);c.rotate(s*.3);el(c,0,8,4,10,hc);c.beginPath();c.ellipse(0,8,4,10,0,0,TAU);ol(c);c.restore();ci(c,s*13,hy+1,2.2,'#e8718d')})}
  else if(h==='braid'){[0,1,2,3].forEach(function(i){ci(c,12.5+i*.6,hy+5+i*5,3.6,hc);c.beginPath();c.arc(12.5+i*.6,hy+5+i*5,3.6,0,TAU);ol(c)})}}
function hairFront(c,ap,hy,hasHat){var h=ap.h,hc=ap.hc;
  function cap(r,k){c.fillStyle=hc;c.beginPath();c.arc(0,hy-1,r,3.4,6.0);c.lineTo(8,hy-3);c.quadraticCurveTo(0,hy-(k||7),-8,hy-3);c.closePath();c.fill();ol(c)}
  if(h==='bald')return;
  if(h==='short'||h==='ponytail'||h==='twin'||h==='braid'||h==='bun'||h==='long'||h==='bob')cap(11.8);
  if(h==='sidebang'){cap(11.8,8);c.fillStyle=hc;c.beginPath();c.moveTo(-12,hy-5);c.quadraticCurveTo(-1,hy-17,11,hy-5);c.quadraticCurveTo(0,hy-8,-8,hy-2);c.lineTo(-12,hy+4);c.closePath();c.fill();ol(c)}
  if(h==='lowtail'){cap(11.8,6)}
  if(h==='pixie'){cap(11.6,10);c.fillStyle=hc;c.beginPath();c.moveTo(-12,hy-2);c.lineTo(-13.4,hy+6);c.lineTo(-9,hy+1);c.closePath();c.fill();ol(c);c.beginPath();c.moveTo(12,hy-2);c.lineTo(13.4,hy+6);c.lineTo(9,hy+1);c.closePath();c.fill();ol(c);c.beginPath();c.moveTo(-2,hy-11);c.lineTo(5,hy-16);c.lineTo(8,hy-8);c.closePath();c.fill();ol(c)}
  if(h==='messy'){cap(12,7);c.fillStyle=hc;[[-10,-6,-14,-11],[-4,-10,-5,-17],[3,-11,6,-17],[9,-8,14,-12],[11,-2,15,0]].forEach(function(q){c.beginPath();c.moveTo(q[0]-2.6,hy+q[1]+3);c.lineTo(q[2],hy+q[3]);c.lineTo(q[0]+2.6,hy+q[1]+3);c.closePath();c.fill();ol(c)})}
  if(h==='buzz'){c.fillStyle=sh(hc,-10);c.globalAlpha=.8;c.beginPath();c.arc(0,hy-1,11.4,3.5,5.9);c.lineTo(7,hy-4);c.quadraticCurveTo(0,hy-6,-7,hy-4);c.closePath();c.fill();c.globalAlpha=1}
  if(h==='bun'){ci(c,0,hy-14,5.2,hc);c.beginPath();c.arc(0,hy-14,5.2,0,TAU);ol(c)}
  if(h==='curly'&&!hasHat){[[-6.5,-8.5,3.8],[0,-10.5,4],[6.5,-8.5,3.8],[-10,-4,3.4],[10,-4,3.4]].forEach(function(q){ci(c,q[0],hy+q[1],q[2],hc);c.beginPath();c.arc(q[0],hy+q[1],q[2],0,TAU);ol(c)})}
  if(h==='wavy'){c.fillStyle=hc;c.beginPath();c.moveTo(-12,hy-1);c.quadraticCurveTo(-12,hy-13,0,hy-13);c.quadraticCurveTo(12,hy-13,12,hy-1);c.lineTo(12,hy+7);c.quadraticCurveTo(9,hy-2,1,hy-5);c.quadraticCurveTo(-5,hy-1,-8,hy+4);c.lineTo(-12,hy+9);c.closePath();c.fill();ol(c)}
  if(h==='mohawk'){c.fillStyle=hc;c.beginPath();c.moveTo(-4,hy-8);c.lineTo(-4,hy-17);c.lineTo(-1.5,hy-12);c.lineTo(0,hy-20);c.lineTo(1.5,hy-12);c.lineTo(4,hy-17);c.lineTo(4,hy-8);c.closePath();c.fill();ol(c)}
  if(h==='spiky'){cap(11.8,6);c.fillStyle=hc;[[-9,-6],[-4.5,-9],[0,-10],[4.5,-9],[9,-6]].forEach(function(q){c.beginPath();c.moveTo(q[0]-3,hy+q[1]+4);c.lineTo(q[0],hy+q[1]-6);c.lineTo(q[0]+3,hy+q[1]+4);c.closePath();c.fill();ol(c)})}
  if(h==='afro')cap(11.8,8)}
function legs(c,ap,sw,skin){var b=ap.b,col=ap.bc,w=6.5,top=-14;
  var lc=(b==='shorts'||b==='skirt')?skin:col;
  if(b==='sweat'){w=7.6}if(b==='leggings')w=5.6;if(b==='cargo')w=7.4;
  c.fillStyle=lc;[[-8.2+(6.5-w)/2,top+sw*.3,14-sw*.3],[1.7-(6.5-w)/2,top-sw*.3,14+sw*.3]].forEach(function(q){var x0=q[0],y1=q[1],hh=q[2];c.beginPath();c.moveTo(x0,y1+1);c.lineTo(x0+w,y1+1);c.lineTo(x0+w-.7,y1+hh);c.lineTo(x0+.7,y1+hh);c.closePath();c.fill();ol(c);c.fillStyle='rgba(20,10,40,.16)';c.fillRect(x0+w-2.2,y1+1.5,1.6,hh-2);c.fillStyle=lc});
  if(b==='shorts'||b==='skirt'){c.fillStyle=col;rr(c,-8.6,top,7.4,7,2.4);c.fill();rr(c,1.2,top,7.4,7,2.4);c.fill()}
  if(b==='sweat'){c.fillStyle=sh(col,-26);c.fillRect(-8.2,-2+sw*.3,7.6,2.4);c.fillRect(1.2,-2-sw*.3,7.6,2.4);c.fillStyle='rgba(255,255,255,.14)';c.fillRect(-6,-13,3,9)}
  if(b==='jeans'||b==='trousers'){c.strokeStyle=sh(col,-34);c.lineWidth=.8;c.beginPath();c.moveTo(-5,-13);c.lineTo(-5,-3);c.moveTo(4.8,-13);c.lineTo(4.8,-3);c.stroke()}
  if(b==='cargo'){c.fillStyle=sh(col,-22);c.fillRect(-9,-10,3.4,4.5);c.fillRect(5.6,-10,3.4,4.5)}
  if(b==='dress'){c.fillStyle=col;c.beginPath();c.moveTo(-11,-18);c.lineTo(11,-18);c.lineTo(15,-5);c.lineTo(-15,-5);c.closePath();c.fill();ol(c);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(-11,-18,22,2.2);c.fillStyle=sh(col,-24);c.fillRect(-13.6,-7,27.2,2)}
  if(b==='skirt'){c.fillStyle=col;c.beginPath();c.moveTo(-11,-17);c.lineTo(11,-17);c.lineTo(14,-6);c.lineTo(-14,-6);c.closePath();c.fill();ol(c)}}
function shoes(c,ap,sw){var s=ap.sh,col=ap.shc,sk=ap.sk;
  function pair(f){f(-9,-3+sw*.3);f(.8,-3-sw*.3)}
  if(s==='bare'){c.fillStyle=sk;pair(function(x,y){rr(c,x,y,8.5,4,2);c.fill()});return}
  if(s==='sandals'){c.fillStyle=sk;pair(function(x,y){rr(c,x,y+1,8.5,3,1.5);c.fill();c.fillStyle=col;c.fillRect(x,y+3.4,8.5,1.2);c.fillRect(x+2,y,1.6,3);c.fillStyle=sk});return}
  if(s==='flats'){c.fillStyle=col;pair(function(x,y){rr(c,x+.6,y+1.4,7.4,3.2,1.6);c.fill();c.fillStyle=sk;c.fillRect(x+2,y+.4,4,1.8);c.fillStyle=col});return}
  if(s==='boots'){c.fillStyle=col;pair(function(x,y){rr(c,x,y-5,8.5,9,2.2);c.fill();c.fillStyle=sh(col,-30);c.fillRect(x,y+3,8.5,1.8);c.fillStyle=col});return}
  c.fillStyle=col;pair(function(x,y){rr(c,x,y,8.5,4.4,2.2);c.fill();c.fillStyle=sh(col,-36);c.fillRect(x,y+3.3,8.5,1.3);c.fillStyle='rgba(255,255,255,.5)';c.fillRect(x+5,y+.8,2.6,1.2);c.fillStyle=col})}
function torso(c,ap,bob,sw,skin){var t=ap.t,col=ap.tc,y0=-37+bob,long=t!=='tee'&&t!=='jersey'&&t!=='overalls'&&t!=='vest'&&t!=='kimono',dk=sh(col,-34);
  var armC=col;
  if(t==='tee'||t==='jersey'||t==='overalls'||t==='vest'){armC=(t==='overalls'||t==='vest')?'#f2f2f2':col}
  /* kollar */
  function arm(s,len,c0){var ax=s*11.6,ay=-35+bob,an=s*(.16)-sw*.045*s,hx=ax+Math.sin(an)*12.5,hy2=ay+Math.cos(an)*12.5;
    c.save();c.translate(ax,ay);c.rotate(-an);c.fillStyle=c0;c.beginPath();c.moveTo(-2.8,-.5);c.quadraticCurveTo(-3.2,len*.5,-2.3,len);c.lineTo(2.3,len);c.quadraticCurveTo(3.2,len*.5,2.8,-.5);c.quadraticCurveTo(0,-2.4,-2.8,-.5);c.closePath();c.fill();ol(c);if(len<10){c.fillStyle=skin;c.beginPath();c.moveTo(-2.3,len);c.lineTo(-2,12);c.lineTo(2,12);c.lineTo(2.3,len);c.closePath();c.fill()}c.restore();
    c.fillStyle=skin;c.beginPath();c.ellipse(hx,hy2+.6,3,3.3,0,0,TAU);c.fill();ol(c);c.fillStyle=sh(skin,-18);c.beginPath();c.ellipse(hx-s*1.7,hy2-.4,1,1.5,s*.5,0,TAU);c.fill()}
  if(t==='robe'||t==='tunic'){c.fillStyle=col;c.beginPath();c.moveTo(-11.5,y0+4);c.lineTo(11.5,y0+4);c.lineTo(t==='robe'?15:13,t==='robe'?-3:-9);c.lineTo(t==='robe'?-15:-13,t==='robe'?-3:-9);c.closePath();c.fill();ol(c)}
  if(t==='coat'){c.fillStyle=col;c.beginPath();c.moveTo(-11.5,y0+4);c.lineTo(11.5,y0+4);c.lineTo(14,-9);c.lineTo(-14,-9);c.closePath();c.fill();ol(c)}
  /* gövde: geniş omuz, daralan bel, hafif kalça */c.fillStyle=col;c.beginPath();c.moveTo(-12,y0+5);c.quadraticCurveTo(-12.4,y0-.4,-6,y0-.6);c.lineTo(6,y0-.6);c.quadraticCurveTo(12.4,y0-.4,12,y0+5);c.quadraticCurveTo(10.2,y0+13,10.6,y0+20);c.quadraticCurveTo(11.4,y0+25,7,y0+25.2);c.lineTo(-7,y0+25.2);c.quadraticCurveTo(-11.4,y0+25,-10.6,y0+20);c.quadraticCurveTo(-10.2,y0+13,-12,y0+5);c.closePath();c.fill();ol(c);
  c.fillStyle='rgba(255,255,255,.16)';c.beginPath();c.ellipse(-5,y0+6,4.2,5.4,-.3,0,TAU);c.fill();c.fillStyle='rgba(20,10,40,.14)';c.beginPath();c.moveTo(4,y0+3);c.quadraticCurveTo(11,y0+4,9.6,y0+20);c.quadraticCurveTo(9,y0+24,5,y0+24.6);c.quadraticCurveTo(8,y0+14,4,y0+3);c.fill();
  var longArm=long;arm(-1,longArm?14:7,longArm?armC:armC);arm(1,longArm?14:7,longArm?armC:armC);
  /* kol detayları */
  if(t==='hoodie'){el(c,0,y0-1,9,4.4,dk);c.fillStyle=dk;rr(c,-8,y0+13,16,9,3);c.fill();c.strokeStyle='#f2f2f2';c.lineWidth=.9;c.beginPath();c.moveTo(-2.5,y0+1);c.lineTo(-3,y0+9);c.moveTo(2.5,y0+1);c.lineTo(3,y0+9);c.stroke();c.fillStyle=dk;c.fillRect(-15,y0+12,4.6,2);c.fillRect(11,y0+12,4.6,2)}
  else if(t==='blouse'){c.fillStyle=sh(col,34);rr(c,-6,y0-1,12,4,2);c.fill();poly(c,[-5,y0,0,y0+8,5,y0],sh(col,56));c.strokeStyle=sh(col,-30);c.lineWidth=.8;c.beginPath();c.moveTo(-11.5,y0+19);c.quadraticCurveTo(0,y0+23,11.5,y0+19);c.stroke();ci(c,0,y0+9,.9,sh(col,-40))}
  else if(t==='sweater'){c.fillStyle=sh(col,-14);rr(c,-8,y0-2,16,5,3);c.fill();ol(c);c.fillStyle=sh(col,-26);c.fillRect(-11.5,y0+21,23,3.6);c.strokeStyle='rgba(0,0,0,.14)';c.lineWidth=.8;for(var q=-8;q<=8;q+=4){c.beginPath();c.moveTo(q,y0+4);c.lineTo(q,y0+20);c.stroke()}}
  else if(t==='shirt'){poly(c,[-5,y0,0,y0+7,0,y0+1],'#f2f2f2');poly(c,[5,y0,0,y0+7,0,y0+1],'#e0e0ea');c.fillStyle=dk;for(var i=0;i<3;i++)c.fillRect(-.5,y0+9+i*4,1.2,1.2)}
  else if(t==='jacket'){c.fillStyle='#f2f2f2';rr(c,-4,y0,8,25,2);c.fill();c.strokeStyle=dk;c.lineWidth=1;c.beginPath();c.moveTo(-4,y0);c.lineTo(-4,y0+25);c.moveTo(4,y0);c.lineTo(4,y0+25);c.stroke();poly(c,[-8,y0,-4,y0+8,-4,y0],dk);poly(c,[8,y0,4,y0+8,4,y0],dk)}
  else if(t==='leather'){c.strokeStyle='#cfd2e0';c.lineWidth=1;c.beginPath();c.moveTo(0,y0+2);c.lineTo(0,y0+25);c.stroke();poly(c,[-9,y0-1,-3,y0+7,-3,y0-1],sh(col,24));poly(c,[9,y0-1,3,y0+7,3,y0-1],sh(col,24));c.fillStyle='#9b5cff';[[-8,y0+12],[8,y0+12],[-8,y0+17],[8,y0+17]].forEach(function(q){c.fillRect(q[0]-1,q[1],2,2)});c.fillStyle='#9b5cff';c.fillRect(-15,y0+13,4.6,1.6);c.fillRect(11,y0+13,4.6,1.6)}
  else if(t==='vest'){c.fillStyle='#f2f2f2';rr(c,-6,y0,12,25,3);c.fill();c.fillStyle=col;rr(c,-11.5,y0,7,25,5);c.fill();rr(c,4.5,y0,7,25,5);c.fill();ol(c)}
  else if(t==='jersey'){c.fillStyle='rgba(255,255,255,.85)';c.fillRect(-11.5,y0+9,23,3);c.fillStyle=dk;c.font='700 9px sans-serif';c.textAlign='center';c.fillText('7',0,y0+21)}
  else if(t==='overalls'){c.fillStyle=col;rr(c,-7,y0+9,14,16,3);c.fill();ol(c);c.fillRect(-7,y0,2.6,10);c.fillRect(4.4,y0,2.6,10);c.fillStyle='#ffd23f';c.fillRect(-6.8,y0+9,1.6,1.6);c.fillRect(5.2,y0+9,1.6,1.6)}
  else if(t==='tunic'){c.fillStyle='#d9a232';c.fillRect(-11.5,y0+16,23,3.2);c.fillStyle='#fff3b0';c.fillRect(-2,y0+15.6,4,4)}
  else if(t==='robe'){c.fillStyle='#d9a232';c.fillRect(-11.5,y0+16,23,2.4);c.fillStyle=dk;c.fillRect(-15,y0+10,4.6,5);c.fillRect(11,y0+10,4.6,5);poly(c,[-4,y0,0,y0+9,4,y0],'#f2f2f2')}
  else if(t==='kimono'){poly(c,[-8,y0,0,y0+12,-2,y0],sh(col,40));poly(c,[8,y0,0,y0+12,2,y0],sh(col,20));c.fillStyle='#ffd23f';c.fillRect(-11.5,y0+15,23,5);c.fillStyle=dk;c.fillRect(-15,y0+11,4.6,5);c.fillRect(11,y0+11,4.6,5)}
  else if(t==='tux'){poly(c,[-4.5,y0,0,y0+12,4.5,y0],'#f6f6fb');c.fillStyle='#14101e';c.fillRect(-.6,y0+13,1.2,1.2);c.fillRect(-.6,y0+17,1.2,1.2)}
  else if(t==='armor'){c.fillStyle=sh(col,30);c.beginPath();c.arc(-11.5,y0+3,5,0,TAU);c.arc(11.5,y0+3,5,0,TAU);c.fill();ol(c);c.strokeStyle=dk;c.lineWidth=1;c.beginPath();c.moveTo(0,y0+1);c.lineTo(0,y0+24);c.moveTo(-9,y0+11);c.lineTo(9,y0+11);c.stroke();c.fillStyle='#d9a232';c.fillRect(-11.5,y0+19,23,2.6)}
  else if(t==='coat'){c.fillStyle='#f2efe6';rr(c,-4.6,y0+2,9.2,22,2);c.fill();c.strokeStyle='rgba(0,0,0,.12)';c.lineWidth=.7;c.beginPath();c.moveTo(-1.4,y0+4);c.lineTo(-1.4,y0+24);c.moveTo(1.4,y0+4);c.lineTo(1.4,y0+24);c.stroke();rr(c,-5.4,y0-2.4,10.8,5.4,2.4);c.fillStyle='#f2efe6';c.fill();ol(c);poly(c,[-10,y0,-4.6,y0+3,-4.6,y0+16,-8,y0+15],sh(col,22));poly(c,[10,y0,4.6,y0+3,4.6,y0+16,8,y0+15],sh(col,22));c.fillStyle='#14101e';ci(c,3,y0+18,1.1,'#14101e');ci(c,3,y0+23,1.1,'#14101e')}
  else if(t==='tee'){c.fillStyle='rgba(0,0,0,.08)';c.fillRect(-11.5,y0+19,23,1)}}
function headFeatures(c,ap,hy,ex,sk){
  /* yanak */
  c.fillStyle=ap.mk==='blush'?'rgba(255,90,120,.5)':'rgba(255,120,120,.26)';c.beginPath();c.arc(-ex*1.6,hy+3.2,2.5,0,TAU);c.arc(ex*1.6,hy+3.2,2.5,0,TAU);c.fill();
  /* göz */
  var es=ap.es|0,fem=ap.g==='f';
  [-ex,ex].forEach(function(x,i){var sd=i?1:-1;
    if(es===1){c.save();c.translate(x,hy-.3);c.rotate(sd*.14);el(c,0,0,2.7,2.1,'#fff');ci(c,0,.1,1.7,ap.ey);ci(c,0,.2,.9,'#16101e');ci(c,-.6,-.6,.55,'#fff');c.restore()}
    else if(es===2){el(c,x,hy-.2,2.3,2.4,'#fff');ci(c,x,hy,1.8,ap.ey);ci(c,x,hy+.1,.95,'#16101e');ci(c,x-.6,hy-.7,.55,'#fff');c.fillStyle=sh(sk,-18);c.beginPath();c.ellipse(x,hy-1.3,2.7,1.5,0,Math.PI,0);c.fill();c.strokeStyle='#2b1a24';c.lineWidth=.9;c.beginPath();c.moveTo(x-2.6,hy-.9);c.lineTo(x+2.6,hy-.9);c.stroke()}
    else if(BLINK){c.strokeStyle='#1b1530';c.lineWidth=1.3;c.lineCap='round';c.beginPath();c.moveTo(x-2.6,hy-.2);c.quadraticCurveTo(x,hy+1.4,x+2.6,hy-.2);c.stroke();c.lineCap='butt'}
    else{/* büyük, parlak gözler: degrade iris, iki ışık noktası, kalın üst kirpik çizgisi */el(c,x,hy-.3,2.75,3.25,'#fff');var ig=c.createRadialGradient(x,hy-.9,.2,x,hy,2.4);ig.addColorStop(0,sh(ap.ey,60));ig.addColorStop(.55,ap.ey);ig.addColorStop(1,sh(ap.ey,-55));c.fillStyle=ig;c.beginPath();c.ellipse(x+sd*.15,hy+.1,2.15,2.55,0,0,TAU);c.fill();
      ci(c,x+sd*.15,hy+.25,1.15,'#120c1a');ci(c,x-.75,hy-1.05,.85,'#fff');ci(c,x+.8,hy+1.15,.42,'rgba(255,255,255,.85)');
      c.strokeStyle='#1b1530';c.lineWidth=1.25;c.lineCap='round';c.beginPath();c.ellipse(x,hy-.3,2.85,3.3,0,Math.PI*1.08,Math.PI*1.92);c.stroke();c.lineWidth=.9;c.beginPath();c.moveTo(x+sd*2.6,hy-1.9);c.lineTo(x+sd*3.4,hy-2.6);c.stroke();c.lineCap='butt'}
    if(fem){c.strokeStyle='#1b1530';c.lineWidth=.95;c.beginPath();c.moveTo(x+sd*2.1,hy-1.9);c.lineTo(x+sd*3.5,hy-3.1);c.moveTo(x+sd*2.5,hy-.8);c.lineTo(x+sd*4,hy-1.2);c.stroke()}});
  var bc=sh(ap.hc&&ap.hc!=='#f2f2f2'?ap.hc:'#555555',-20),br=ap.br|0;c.strokeStyle=bc;c.lineCap='round';
  if(br===1){c.lineWidth=2.2;c.beginPath();c.moveTo(-ex-2.6,hy-4.4);c.lineTo(-ex+2.4,hy-4.8);c.moveTo(ex+2.6,hy-4.4);c.lineTo(ex-2.4,hy-4.8);c.stroke()}
  else if(br===2){c.lineWidth=1.6;c.beginPath();c.moveTo(-ex-2.6,hy-5.4);c.lineTo(-ex+2.4,hy-3.8);c.moveTo(ex+2.6,hy-5.4);c.lineTo(ex-2.4,hy-3.8);c.stroke()}
  else if(br===3){c.lineWidth=1.2;c.beginPath();c.moveTo(-ex-2.6,hy-3.8);c.quadraticCurveTo(-ex,hy-6.6,-ex+2.6,hy-4);c.moveTo(ex+2.6,hy-3.8);c.quadraticCurveTo(ex,hy-6.6,ex-2.6,hy-4);c.stroke()}
  else{c.lineWidth=1.3;c.beginPath();c.moveTo(-ex-2.4,hy-4.2);c.lineTo(-ex+2,hy-4.6);c.moveTo(ex+2.4,hy-4.2);c.lineTo(ex-2,hy-4.6);c.stroke()}
  c.lineCap='butt';
  var mo=ap.mo|0,lp=ap.mk==='lipstick';
  c.strokeStyle=lp?'#c0405a':'#8a3b2a';c.lineWidth=lp?1.8:1.2;
  if(mo===1){c.beginPath();c.moveTo(-2,hy+5);c.lineTo(2,hy+5);c.stroke()}
  else if(mo===2){c.fillStyle='#7a2a38';c.beginPath();c.arc(0,hy+3.6,3,.08*Math.PI,.92*Math.PI);c.closePath();c.fill();c.fillStyle='#fff';c.fillRect(-2.2,hy+3.7,4.4,1.1)}
  else if(mo===3){c.beginPath();c.moveTo(-2.4,hy+5);c.quadraticCurveTo(0,hy+5.4,2.4,hy+3.6);c.stroke()}
  else{c.beginPath();c.arc(0,hy+4.2,2.4,.15*Math.PI,.85*Math.PI);c.stroke()}
  /* işaretler */
  var m=ap.mk;
  if(m==='freckles'){c.fillStyle='rgba(150,80,40,.75)';[[-6.5,2],[-4.8,3.6],[-7.4,4],[6.5,2],[4.8,3.6],[7.4,4]].forEach(function(q){c.fillRect(q[0],hy+q[1],1,1)})}
  if(m==='bandaid'){c.save();c.translate(5.5,hy+4);c.rotate(-.6);c.fillStyle='#f4c9a0';c.fillRect(-3.4,-1.3,6.8,2.6);ol(c);c.restore()}
  if(m==='stubble'){c.fillStyle='rgba(40,30,30,.4)';for(var i=0;i<14;i++)c.fillRect(-7+i%7*2.3+((i>6)?1:0),hy+5.5+(i>6?2.4:0)+(i%3)*.4,.9,.9)}
  if(m==='mustache'){c.fillStyle=ap.hc;c.beginPath();c.moveTo(0,hy+3.2);c.quadraticCurveTo(-5,hy+1.5,-6.5,hy+4.6);c.quadraticCurveTo(-2,hy+4.4,0,hy+5);c.quadraticCurveTo(2,hy+4.4,6.5,hy+4.6);c.quadraticCurveTo(5,hy+1.5,0,hy+3.2);c.fill();ol(c)}
  if(m==='goatee'){c.fillStyle=ap.hc;c.beginPath();c.moveTo(0,hy+3.2);c.quadraticCurveTo(-4,hy+2.4,-5,hy+4);c.quadraticCurveTo(-2,hy+3.8,0,hy+4);c.quadraticCurveTo(2,hy+3.8,5,hy+4);c.quadraticCurveTo(4,hy+2.4,0,hy+3.2);c.fill();ol(c);c.beginPath();c.moveTo(-3.4,hy+8.4);c.quadraticCurveTo(0,hy+14,3.4,hy+8.4);c.quadraticCurveTo(0,hy+9.6,-3.4,hy+8.4);c.fill();c.fillStyle='rgba(40,25,20,.35)';for(var q=0;q<9;q++)c.fillRect(-7+q*1.7,hy+7.5+(q%3)*.8,.9,.9)}
  if(m==='beard'){c.fillStyle=ap.hc;c.beginPath();c.moveTo(-10,hy+1);c.quadraticCurveTo(-9.5,hy+16,0,hy+16);c.quadraticCurveTo(9.5,hy+16,10,hy+1);c.quadraticCurveTo(0,hy+8,-10,hy+1);c.fill();ol(c)}
  if(m==='star'){c.fillStyle='#ffd23f';var sx=-ex*1.5,sy=hy+4;c.beginPath();for(var j=0;j<10;j++){var a=-1.57+j*.6283,r=j%2?1:2.6;c.lineTo(sx+Math.cos(a)*r,sy+Math.sin(a)*r)}c.closePath();c.fill()}}
function faceAcc(c,ap,hy,ex){var f=ap.fc;
  if(f==='glasses'){c.strokeStyle='#14101e';c.lineWidth=1.2;c.beginPath();c.arc(-ex,hy-.3,3.6,0,TAU);c.moveTo(ex+3.6,hy-.3);c.arc(ex,hy-.3,3.6,0,TAU);c.moveTo(-ex+3.6,hy-.5);c.lineTo(ex-3.6,hy-.5);c.stroke();c.fillStyle='rgba(180,220,255,.22)';c.beginPath();c.arc(-ex,hy-.3,3.4,0,TAU);c.arc(ex,hy-.3,3.4,0,TAU);c.fill()}
  else if(f==='shades'){c.fillStyle='#14101e';rr(c,-ex-4,hy-3,8,5.6,2);c.fill();rr(c,ex-4,hy-3,8,5.6,2);c.fill();c.fillRect(-ex+3.6,hy-2.2,2*ex-7.2,1.2);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-ex-2.6,hy-2.2,2.6,1);c.fillRect(ex-2.6,hy-2.2,2.6,1)}
  else if(f==='eyepatch'){c.strokeStyle='#14101e';c.lineWidth=1.1;c.beginPath();c.moveTo(-11,hy-6);c.lineTo(8,hy-1);c.stroke();c.fillStyle='#14101e';c.beginPath();c.ellipse(-ex,hy-.4,3.8,3.4,0,0,TAU);c.fill()}
  else if(f==='mask'){c.fillStyle='#e8f1ff';rr(c,-8,hy+.5,16,8.6,3.4);c.fill();ol(c);c.strokeStyle='#bcd0ea';c.lineWidth=.8;c.beginPath();c.moveTo(-7,hy+3);c.lineTo(7,hy+3);c.moveTo(-7,hy+5.6);c.lineTo(7,hy+5.6);c.stroke()}}
function neckAcc(c,ap,ny,bob){var n=ap.nk,col=ap.nkc;
  if(n==='scarf'){c.fillStyle=col;rr(c,-10,ny-1,20,5.4,2.6);c.fill();ol(c);c.fillStyle=sh(col,-24);rr(c,3,ny+2,5,12,2);c.fill();ol(c)}
  else if(n==='choker'){c.strokeStyle=col;c.lineWidth=2;c.beginPath();c.arc(0,ny-4,7.6,.2*Math.PI,.8*Math.PI);c.stroke();ci(c,0,ny+3.6,1.3,'#ffd23f')}
  else if(n==='necklace'){c.strokeStyle='#e3c34a';c.lineWidth=1;c.beginPath();c.moveTo(-5,ny);c.quadraticCurveTo(0,ny+10,5,ny);c.stroke();ci(c,0,ny+6.6,2.2,col);c.beginPath();c.arc(0,ny+6.6,2.2,0,TAU);ol(c)}
  else if(n==='bowtie'){poly(c,[0,ny+1.4,-6,ny-2,-6,ny+5],col);poly(c,[0,ny+1.4,6,ny-2,6,ny+5],col);ci(c,0,ny+1.4,1.6,sh(col,-30))}
  else if(n==='tie'){poly(c,[-1.6,ny,1.6,ny,3,ny+14,0,ny+17,-3,ny+14],col);poly(c,[-2.6,ny-1,2.6,ny-1,1.4,ny+2,-1.4,ny+2],sh(col,-30))}
  else if(n==='medal'){c.fillStyle=col;c.beginPath();c.moveTo(-4,ny-1);c.lineTo(0,ny+8);c.lineTo(4,ny-1);c.closePath();c.fill();ci(c,0,ny+10,3.4,'#ffd23f');c.beginPath();c.arc(0,ny+10,3.4,0,TAU);ol(c)}}
function hatDraw(c,ap,hy,t){var h=ap.hat,col=ap.htc;
  function dome(r,y,f){c.fillStyle=f||col;c.beginPath();c.arc(0,y,r,Math.PI,0);c.lineTo(r,y+1);c.lineTo(-r,y+1);c.closePath();c.fill();ol(c)}
  if(h==='beanie'){dome(12.6,hy-2.5);c.fillStyle=sh(col,-26);rr(c,-12.9,hy-6.8,25.8,6.4,3);c.fill();ol(c);c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=.8;for(var i=-9;i<=9;i+=4.5){c.beginPath();c.moveTo(i,hy-6.4);c.lineTo(i,hy-1.2);c.stroke()}ci(c,0,hy-15.6,3.4,sh(col,30));c.beginPath();c.arc(0,hy-15.6,3.4,0,TAU);ol(c)}
  else if(h==='santa'){c.fillStyle='#c0392b';c.beginPath();c.moveTo(-12.4,hy-1);c.quadraticCurveTo(-11,hy-16,3,hy-21);c.quadraticCurveTo(14,hy-19,15,hy-9);c.quadraticCurveTo(13,hy-9,12.4,hy-1);c.closePath();c.fill();ol(c);c.fillStyle='#f6fbff';rr(c,-13.4,hy-5,26.8,6,3);c.fill();ol(c);ci(c,15,hy-9,3.6,'#f6fbff');c.beginPath();c.arc(15,hy-9,3.6,0,TAU);ol(c)}
  else if(h==='snowcrown'){var gl=.7+Math.sin((t||0)*3)*.15;c.fillStyle='#bfe8ff';[-10,-5,0,5,10].forEach(function(x,i){var hh=i%2?8:13;poly(c,[x-3,hy-3,x,hy-3-hh,x+3,hy-3],'#bfe8ff');poly(c,[x-1.2,hy-3,x,hy-3-hh*.7,x+1.2,hy-3],'#f2fbff')});c.fillStyle='#8fd0ff';rr(c,-12,hy-4,24,3.4,1.7);c.fill();ol(c);c.save();c.globalAlpha=gl*.35;ci(c,0,hy-12,12,'#aee6ff');c.restore();ci(c,0,hy-15,1.4,'#fff')}
  else if(h==='cap'){dome(12,hy-2);c.fillStyle=sh(col,-20);c.beginPath();c.ellipse(5,hy-1.4,10,2.6,0,0,TAU);c.fill();ol(c);ci(c,0,hy-14,1.3,sh(col,40))}
  else if(h==='bandana'){c.fillStyle=col;rr(c,-11.8,hy-8.4,23.6,6,2.6);c.fill();ol(c);poly(c,[11,hy-7,16,hy-3,12,hy-3],col);ci(c,-6,hy-5.4,.9,'#fff');ci(c,0,hy-5.4,.9,'#fff');ci(c,6,hy-5.4,.9,'#fff')}
  else if(h==='straw'){el(c,0,hy-4,17,5,'#e0bb62');c.beginPath();c.ellipse(0,hy-4,17,5,0,0,TAU);ol(c);dome(9,hy-4.4,'#e0bb62');c.fillStyle=col;c.fillRect(-9,hy-6.6,18,2.4)}
  else if(h==='cowboy'){el(c,0,hy-4,18,5.2,col);c.beginPath();c.ellipse(0,hy-4,18,5.2,0,0,TAU);ol(c);dome(9.6,hy-4.6);c.fillStyle='#d9a232';c.fillRect(-9.6,hy-7,19.2,2.2)}
  else if(h==='headphones'){c.strokeStyle=col;c.lineWidth=2.6;c.beginPath();c.arc(0,hy-1,12.6,Math.PI*1.04,Math.PI*1.96);c.stroke();[-1,1].forEach(function(s){rr(c,s*12.6-3,hy-5,6,9.4,3);c.fillStyle=col;c.fill();ol(c);c.fillStyle='#9b5cff';c.fillRect(s*12.6-1.4,hy-2.4,2.8,4.2)})}
  else if(h==='hood'){c.fillStyle=col;c.beginPath();c.arc(0,hy-1,13.8,Math.PI*.92,Math.PI*2.08);c.lineTo(10.6,hy+6);c.quadraticCurveTo(0,hy-7,-10.6,hy+6);c.closePath();c.fill();ol(c)}
  else if(h==='flowers'){for(var k=0;k<7;k++){var a=Math.PI*1.08+k*.14*Math.PI,fx=Math.cos(a)*11.4,fy=hy-1+Math.sin(a)*11.4;ci(c,fx,fy,2.7,['#ff7aa8','#ffd23f','#fff','#b57bff'][k%4]);ci(c,fx,fy,.9,'#d9822b')}}
  else if(h==='catears'||h==='bunny'){[-1,1].forEach(function(s){c.save();c.translate(s*7.4,hy-9);c.rotate(s*(h==='bunny'?.14:.35));var L2=h==='bunny'?18:8;c.fillStyle=h==='bunny'?'#f2f2f2':ap.hc;c.beginPath();c.moveTo(-4,2);c.quadraticCurveTo(-3.6,-L2,0,-L2-1);c.quadraticCurveTo(3.6,-L2,4,2);c.closePath();c.fill();ol(c);c.fillStyle=col;c.beginPath();c.moveTo(-2,1);c.quadraticCurveTo(-1.8,-L2*.7,0,-L2*.8);c.quadraticCurveTo(1.8,-L2*.7,2,1);c.closePath();c.fill();c.restore()})}
  else if(h==='helmet'){dome(12.8,hy-2,'#8c97b3');c.fillStyle='#d9a232';c.fillRect(-1.6,hy-15,3.2,13);c.fillStyle=col;c.fillRect(-12.8,hy-3.6,25.6,2.2)}
  else if(h==='witch'){el(c,0,hy-4,17,4.6,col);c.beginPath();c.ellipse(0,hy-4,17,4.6,0,0,TAU);ol(c);poly(c,[-9,hy-4.6,9,hy-4.6,4,hy-18,9,hy-30,-4,hy-17],col);c.fillStyle='#ffd23f';c.fillRect(-9,hy-7.4,18,2.4)}
  else if(h==='horns'){[-1,1].forEach(function(s){c.fillStyle='#f2ead2';c.beginPath();c.moveTo(s*6,hy-7);c.quadraticCurveTo(s*13,hy-9,s*11,hy-19);c.quadraticCurveTo(s*9,hy-12,s*3.6,hy-7);c.closePath();c.fill();ol(c)})}
  else if(h==='tophat'){el(c,0,hy-4,14,3.6,col);c.beginPath();c.ellipse(0,hy-4,14,3.6,0,0,TAU);ol(c);c.fillStyle=col;rr(c,-8.6,hy-21,17.2,17.4,2);c.fill();ol(c);c.fillStyle='#c0392b';c.fillRect(-8.6,hy-8,17.2,3)}
  else if(h==='pirate'){poly(c,[-15,hy-3,15,hy-3,9,hy-12,0,hy-17,-9,hy-12],col);c.fillStyle='#f2f2f2';c.beginPath();c.arc(0,hy-9.4,2.2,0,TAU);c.fill();c.fillRect(-3.4,hy-6.4,6.8,.9)}
  else if(h==='halo'){c.strokeStyle='#ffe27a';c.lineWidth=2.4;c.beginPath();c.ellipse(0,hy-17+Math.sin(t*2.4)*1,9,3,0,0,TAU);c.stroke()}
  else if(h==='crown'){poly(c,[-10,hy-4,-10,hy-14,-5,hy-9,0,hy-17,5,hy-9,10,hy-14,10,hy-4],'#ffd23f');ci(c,0,hy-7.6,1.6,'#e8403a');ci(c,-5.6,hy-6.6,1,'#4fc3ff');ci(c,5.6,hy-6.6,1,'#4fc3ff')}}
function backDraw(c,ap,bob,t,mv){var b=ap.bk,col=ap.bkc;
  if(b==='cape'){c.fillStyle=col;c.beginPath();c.moveTo(-12,-37+bob);c.lineTo(12,-37+bob);c.lineTo(17+Math.sin(t*3)*1.2,-5);c.lineTo(-17-Math.sin(t*3)*1.2,-5);c.closePath();c.fill();ol(c)}
  else if(b==='backpack'){c.fillStyle=col;rr(c,-10,-38+bob,20,22,5);c.fill();ol(c);c.fillStyle=sh(col,-28);rr(c,-7,-30+bob,14,9,3);c.fill()}
  else if(b==='quiver'){c.save();c.translate(8,-26+bob);c.rotate(.5);c.fillStyle=col;rr(c,-4,-14,8,26,3);c.fill();ol(c);c.fillStyle='#e8e8f0';[-2,0,2].forEach(function(x){c.fillRect(x-.4,-19,.8,6)});c.restore()}
  else if(b==='guitar'){c.save();c.translate(-9,-28+bob);c.rotate(-.5);c.fillStyle='#7a4f2b';c.fillRect(-1.6,-26,3.2,16);el(c,0,-4,7,9,col);c.beginPath();c.ellipse(0,-4,7,9,0,0,TAU);ol(c);ci(c,0,-4,2,'#2b1a10');c.restore()}
  else if(b==='tail'){c.save();c.translate(8,-12);c.rotate(.5+Math.sin(t*3)*.12);c.fillStyle=col;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(18,-4,16,-22);c.quadraticCurveTo(7,-12,0,-6);c.closePath();c.fill();ol(c);c.fillStyle='#fff';c.beginPath();c.arc(15.4,-20,3.2,0,TAU);c.fill();c.restore()}
  else if(b==='wings'||b==='demon'){var fl=Math.sin(t*(mv?9:2.6))*.12,wc=b==='wings'?'#f6f8ff':'#8a2438';[-1,1].forEach(function(s){c.save();c.translate(s*7,-30+bob);c.rotate(s*(.2+fl));c.fillStyle=wc;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(s*22,-8,s*26,-26);c.quadraticCurveTo(s*18,-14,s*14,-18);c.quadraticCurveTo(s*12,-6,s*7,-8);c.quadraticCurveTo(s*6,2,0,6);c.closePath();c.fill();ol(c);c.restore()})}}

function hamster(c,ap,bob,t,mv,sw){var fur=ap.sk,belly='#fff7ea',pk='#f4a3b0';
  /* kuyruk, ayaklar */
  el(c,0,-2,5.4,3,pk);el(c,-6,-1.5+sw*.3,5.4,3,pk);el(c,6,-1.5-sw*.3,5.4,3,pk);
  el(c,0,-14+bob*.6,15.4,15.4,fur);c.beginPath();c.ellipse(0,-14+bob*.6,15.4,15.4,0,0,TAU);ol(c);
  el(c,0,-12+bob*.6,9.6,10.6,belly);
  /* üst giysi: önlük gibi */
  if(ap.t){c.fillStyle=ap.tc;c.beginPath();c.ellipse(0,-11+bob*.6,11,8.6,0,0,TAU);c.fill();ol(c);if(ap.t==='hoodie'){c.fillStyle=sh(ap.tc,-30);rr(c,-6,-10+bob*.6,12,6,2.4);c.fill()}else if(ap.t==='jersey'){c.fillStyle='rgba(255,255,255,.8)';c.fillRect(-11,-12+bob*.6,22,2.6)}}
  [-1,1].forEach(function(s){el(c,s*15,-15+bob*.6+s*sw*.4,3.6,5.4,fur);c.beginPath();c.ellipse(s*15,-15+bob*.6+s*sw*.4,3.6,5.4,0,0,TAU);ol(c)});
  var hy=-35+bob;
  [-1,1].forEach(function(s){ci(c,s*11,hy-11,5.6,fur);c.beginPath();c.arc(s*11,hy-11,5.6,0,TAU);ol(c);ci(c,s*11,hy-11,3,pk)});
  el(c,0,hy,17.4,14.6,fur);c.beginPath();c.ellipse(0,hy,17.4,14.6,0,0,TAU);ol(c);
  el(c,-10.5,hy+3.6,7.6,6.4,sh(fur,14));el(c,10.5,hy+3.6,7.6,6.4,sh(fur,14));
  el(c,0,hy-6,3.4,5.4,belly);
  [-1,1].forEach(function(s){ci(c,s*6.4,hy-1.6,2.7,'#1a1220');ci(c,s*6.4-.8,hy-2.6,.9,'#fff');if(ap.ey&&ap.ey!=='#3b2616')ci(c,s*6.4+.4,hy-.6,.9,ap.ey)});
  el(c,0,hy+2.6,2.1,1.5,pk);c.strokeStyle='#8a4a3a';c.lineWidth=1;c.beginPath();c.moveTo(0,hy+4);c.lineTo(0,hy+5.6);c.moveTo(-3,hy+7);c.quadraticCurveTo(0,hy+5.4,3,hy+7);c.stroke();
  c.fillStyle='#fff';c.fillRect(-1.5,hy+5.5,1.4,2.4);c.fillRect(.1,hy+5.5,1.4,2.4);
  c.strokeStyle='rgba(60,40,30,.5)';c.lineWidth=.7;c.beginPath();c.moveTo(-9,hy+3);c.lineTo(-16,hy+1);c.moveTo(-9,hy+5);c.lineTo(-16,hy+6);c.moveTo(9,hy+3);c.lineTo(16,hy+1);c.moveTo(9,hy+5);c.lineTo(16,hy+6);c.stroke();
  if(ap.mk==='blush'||ap.mk==='freckles'){c.fillStyle='rgba(255,90,120,.45)';c.beginPath();c.arc(-11,hy+2,2.6,0,TAU);c.arc(11,hy+2,2.6,0,TAU);c.fill()}
  return hy}

function founderAura(c,t){var p=.6+Math.sin(t*3)*.15;var g=c.createRadialGradient(0,-26,4,0,-26,42);g.addColorStop(0,'rgba(190,230,255,'+(.35*p)+')');g.addColorStop(.6,'rgba(120,180,255,'+(.16*p)+')');g.addColorStop(1,'rgba(120,180,255,0)');c.fillStyle=g;c.beginPath();c.arc(0,-26,42,0,TAU);c.fill();
  c.strokeStyle='rgba(255,226,138,'+(.5+.3*Math.sin(t*5))+')';c.lineWidth=1.6;c.beginPath();c.ellipse(0,2,22,7,0,0,TAU);c.stroke();
  var k=Math.floor(t*7)%5;c.strokeStyle='rgba(220,240,255,.9)';c.lineWidth=1.3;c.beginPath();var a=k*1.26+t*.4,x0=Math.cos(a)*24,y0=-26+Math.sin(a)*26;c.moveTo(x0,y0);for(var i=1;i<=3;i++){c.lineTo(x0*(1-i*.22)+(((k+i)*7)%5-2)*3,y0*(1-i*.1)-i*2+(((k*3+i)*5)%4-1.5)*3)}c.stroke()}
/* feet at (x,y); sc=ölçek */
var SVI={};
function svgImg(id){var m=SVI[id];if(m)return m;m=SVI[id]={im:new Image(),ok:false};try{var s=root.YX.av({sp:id,col:'#ffd23f'},'n').replace('<svg ','<svg width="200" height="200" ');m.im.onload=function(){m.ok=true;try{root.dispatchEvent(new Event('yl-img'))}catch(e){}};m.im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)}catch(e){}return m}
function svgHero(c,ap,bob){var m=svgImg(ap.sv);if(m.ok)c.drawImage(m.im,-38,-70+bob,76,76)}
var BLINK=false,NOSH=false;
/* ---------- çizim hattı (tasarım katmanı): karakter önce ayrı tuvale çizilir, sonra
   koyu renkli dış kontur, sol-üstten ışıklı yumuşak gölgelendirme ve ince kenar ışığı eklenir.
   Kareler (yürüme 12, durma 10, göz kırpma) önbelleğe alınır; her karede yalnızca bir drawImage. */
var PC=new Map(),PCN=0,BX=-52,BY=-112,BW=104,BH=132;
function mkc(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return c}
var T1=null,T2=null;
function post(src,R){var w=src.width,h=src.height,o=mkc(w,h),g=o.getContext('2d'),k=Math.max(1,Math.round(.85*R));
  if(!T1||T1.width!==w||T1.height!==h){T1=mkc(w,h);T2=mkc(w,h)}var a=T1.getContext('2d'),b=T2.getContext('2d');
  /* dış kontur */a.clearRect(0,0,w,h);a.globalCompositeOperation='source-over';for(var i=0;i<8;i++){var an=i*Math.PI/4;a.drawImage(src,Math.round(Math.cos(an)*k),Math.round(Math.sin(an)*k))}a.globalCompositeOperation='source-in';a.fillStyle='#160f26';a.fillRect(0,0,w,h);a.globalCompositeOperation='source-over';
  g.drawImage(T1,0,0);g.drawImage(src,0,0);
  /* gölgelendirme: sağ-alt koyulaşır */g.globalCompositeOperation='source-atop';var gr=g.createLinearGradient(w*.15,h*.1,w*.95,h*.95);gr.addColorStop(0,'rgba(255,240,210,.10)');gr.addColorStop(.45,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(24,10,60,.30)');g.fillStyle=gr;g.fillRect(0,0,w,h);
  /* kenar ışığı: sol-üst kenarda ince sıcak çizgi */b.clearRect(0,0,w,h);b.globalCompositeOperation='source-over';b.drawImage(src,0,0);b.globalCompositeOperation='source-in';b.fillStyle='rgba(255,236,196,1)';b.fillRect(0,0,w,h);b.globalCompositeOperation='destination-out';b.drawImage(src,Math.round(1.3*R),Math.round(1.3*R));b.globalCompositeOperation='source-over';
  g.globalAlpha=.55;g.drawImage(T2,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';return o}
function hero(c,x,y,ap0,t,mv,sc){
  if(root.YD_LOWFX||!root.document||ap0&&ap0.body==='svg'){return heroRaw(c,x,y,ap0,t,mv,sc)}
  var key;try{key=JSON.stringify(ap0)}catch(e){return heroRaw(c,x,y,ap0,t,mv,sc)}
  var hsh=0;for(var i=0;i<key.length;i+=7)hsh=(hsh*31+key.charCodeAt(i))|0;
  var per=mv?6.2832/9:6.2832/2.2,nf=mv?12:10,fr=Math.floor(((t%per+per)%per)/per*nf),bl=!mv&&((t+(hsh&1023)/300)%4.3)<.13;
  var tq=(fr+.5)/nf*per,R=Math.min(4,Math.max(1.5,2*(sc||1)*(root.devicePixelRatio>1.5?1.2:1)));R=Math.round(R*4)/4;
  var ck=key+'|'+(mv?1:0)+'|'+fr+'|'+(bl?1:0)+'|'+R,e=PC.get(ck);
  if(!e){var cv=mkc(Math.ceil(BW*R),Math.ceil(BH*R)),g=cv.getContext('2d');g.scale(R,R);BLINK=bl;NOSH=true;try{heroRaw(g,-BX,-BY,ap0,tq,mv,1)}catch(er){BLINK=NOSH=false;return heroRaw(c,x,y,ap0,t,mv,sc)}BLINK=NOSH=false;e={c:post(cv,R),n:0};PC.set(ck,e);if(PC.size>260){var it=PC.keys();for(var j=0;j<40;j++)PC.delete(it.next().value)}}
  else{PC.delete(ck);PC.set(ck,e)}
  var S0=sc||1,hm0=ap0&&ap0.body==='hamster';c.save();c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(x,y+S0,(hm0?17:15)*S0,5*S0,0,0,TAU);c.fill();c.restore();
  var s=(sc||1)/R;c.drawImage(e.c,x+BX*(sc||1),y+BY*(sc||1),e.c.width*s,e.c.height*s)}
function heroRaw(c,x,y,ap0,t,mv,sc){var ap=valid(ap0),bob=Math.sin(t*(mv?9:2.2))*(mv?1.5:.9),sw=mv?Math.sin(t*9)*3:0,hm=ap.body==='hamster';
  c.save();c.translate(x,y);var hS=hm||ap.body==='svg'?1:[.93,1,1.07][ap.ht|0];c.scale((sc||1)*hS,(sc||1)*hS);
  if(ap.body==='svg'){svgHero(c,ap,bob);c.restore();return}
  if(!NOSH)el(c,0,1,hm?17:15,5,'rgba(0,0,0,.32)');
  if(ap.fd)founderAura(c,t);
  backDraw(c,ap,bob,t,mv);
  var hy,ex=4;
  if(hm){hy=hamster(c,ap,bob,t,mv,sw);ex=6.4;
    neckAcc(c,ap,hy+13,bob);
    c.save();c.translate(0,hy);c.scale(1.22,1.22);c.translate(0,-hy);hatDraw(c,ap,hy-3,t);c.restore();
    faceAcc(c,ap,hy-.4,ex)}
  else{
    hy=-46+bob;c.save();c.translate(0,hy+10);c.scale(1.13,1.13);c.translate(0,-(hy+10));hairBack(c,ap,hy);c.restore();
    var bS=[.9,1,1.13][ap.bd|0]*(ap.g==='f'?.94:1);c.save();c.scale(bS,1);legs(c,ap,sw,ap.sk);shoes(c,ap,sw);
    torso(c,ap,bob,sw,ap.sk);c.restore();
    var hasHat=ap.hat!=='none'&&ap.hat!=='halo'&&ap.hat!=='flowers'&&ap.hat!=='headphones'&&ap.hat!=='horns'&&ap.hat!=='catears'&&ap.hat!=='bunny';
    /* chibi oranı: baş boyun noktasından %13 büyük */c.save();c.translate(0,hy+10);c.scale(1.13,1.13);c.translate(0,-(hy+10));
    ci(c,0,hy,11,ap.sk);c.beginPath();c.arc(0,hy,11,0,TAU);ol(c);
    [-1,1].forEach(function(s){ci(c,s*10.8,hy+1.5,2.3,ap.sk);c.beginPath();c.arc(s*10.8,hy+1.5,2.3,0,TAU);ol(c)});
    headFeatures(c,ap,hy,ex,ap.sk);
    hairFront(c,ap,hy,hasHat);
    faceAcc(c,ap,hy,ex);
    neckAcc(c,ap,-36+bob,bob);
    hatDraw(c,ap,hy,t);
    if(ap.h==='curly'&&hasHat&&ap.hat!=='hood'){[-1,1].forEach(function(s){ci(c,s*11.4,hy-.4,3.6,ap.hc);c.beginPath();c.arc(s*11.4,hy-.4,3.6,0,TAU);ol(c)})}c.restore()}
  c.restore()}
function topY(ap){var v=valid(ap),b=v.body;return b==='hamster'?-58:b==='svg'?-76:Math.round(-75*[.93,1,1.07][v.ht|0])}
/* küçük portre (HUD / kart) */
function portrait(ap,size,bg){var cv=document.createElement('canvas');cv.width=cv.height=size;var c=cv.getContext('2d');var va=valid(ap);if(va.body==='svg'){if(bg){c.fillStyle=bg;c.fillRect(0,0,size,size)}var mm=svgImg(va.sv);if(mm.ok)c.drawImage(mm.im,size*.02,size*.02,size*.96,size*.96);return cv.toDataURL()}var hm=valid(ap).body==='hamster',sc=size/(hm?44:34),hyv=hm?-35:-46;
  if(bg){c.fillStyle=bg;c.fillRect(0,0,size,size)}
  hero(c,size/2,size*.5-hyv*sc+(hm?0:2),ap,0,false,sc);return cv.toDataURL()}
root.YL={PAL:PAL,CAT:CAT,PRESETS:PRESETS,SLOTCOL:SLOTCOL,SLOTKEY:SLOTKEY,def:def,valid:valid,price:price,isFree:isFree,hero:hero,topY:topY,portrait:portrait};
})(window);
