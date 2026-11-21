/* Yaxest Diyarı: Diyar+ güncellemesi
   Gece/gündüz, hava durumu, Kızıl Ay, Gezgin Tüccar, Altın Yağmuru, yoldaşlar (pet), başarımlar ve unvanlar,
   Yaxest'in kayıp günlük sayfaları, fotoğraf modu, ifadeler. game.js içine küçük kancalarla bağlanır. */
(function(){
'use strict';
var D=null,G=null,P=null,Y=null,TS=64,X=null;
function $(i){return document.getElementById(i)}
function rnd(n){var x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function hyp(a,b){return Math.sqrt(a*a+b*b)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

/* ---------- zaman: 12 dk = 1 gün (herkeste aynı) ---------- */
var DAY=720000,SH=DAY*3/24;
function hourP(){return(((Date.now()+SH)%DAY)/DAY)*24}   /* 0 = saat 21:00 */
function dayIdx(){return Math.floor((Date.now()+SH)/DAY)}
function realHour(){return(hourP()+21)%24}
function darkness(h){if(h<8)return 1;if(h<10)return 1-(h-8)/2;if(h>=22)return(h-22)/2;return 0}
function clockTxt(){var r=realHour(),hh=Math.floor(r),mm=Math.floor((r-hh)*60);return(hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm}
function weatherNow(){var b=Math.floor(Date.now()/480000),r=rnd(b*1.7+3);return r<.5?'clear':r<.75?'rain':r<.87?'fog':'storm'}
var WI={clear:'☀️',rain:'🌧️',fog:'🌫️',storm:'⛈️'},WN={clear:'Açık',rain:'Yağmur',fog:'Sis',storm:'Fırtına'};
function redMoonOn(){return hourP()<8&&rnd(dayIdx()*3.7)<.45}
function traderOn(){var b=Math.floor(Date.now()/600000);return(Date.now()%600000)<360000&&rnd(b*5.3)<.6}
function goldRainOn(){var b=Math.floor(Date.now()/900000);return(Date.now()%900000)<100000&&rnd(b*9.1)<.4}

/* ---------- yoldaşlar ---------- */
var RAR=['Sıradan','Nadir','Epik','Efsane','Gizli'],RCOL=['#9aa5c0','#5ab0ff','#c07bff','#ffb43a','#ff5ccf'];
var PETS={
 pitik:{n:'Pıtık',r:0,col:'#ffd23f',b:'xp',q:['Zıp zıp!','Bugün de seninleyim.','Slime olmak güzel.','Beni yeme tamam mı?']},
 miyav:{n:'Miyav',r:0,col:'#ff9f43',b:'gold',q:['Miyav. (Altın nerede?)','Ben seni seçtim, sen beni değil.','Kutu varsa içine giririm.']},
 baykus:{n:'Bilge Baykuş',r:1,col:'#a98467',b:'xp',q:['Gece benim zamanım.','Hu hu. Seviye atlıyorsun.','Bilgi güçtür; XP daha güçlü.']},
 robo:{n:'Mini Robo',r:1,col:'#8fa3bf',b:'gold',q:['BİP. Altın tespit edildi.','Pil: %99, moral: %100.','Hesapladım: yine kazanıyoruz.']},
 cemile:{n:'Cemile',r:2,col:'#f0b872',b:'regen',q:['Yanaklarımda fındık var.','Beni sevebilirsin, serbest.','Çark nerede çark?']},
 peri:{n:'Ateş Perisi',r:2,col:'#ff6b3d',b:'xp',q:['Parıl parıl!','Yakmıyorum, söz.','Kıvılcım ister misin?']},
 hayalet:{n:'Hayalet Boo',r:2,col:'#dfe6ff',b:'gold',q:['Bööö! Korktun mu?','Duvarlardan geçerim, borçlardan değil.','Gece dolaşmak için en iyisi.']},
 ejder:{n:'Mini Ejder',r:3,col:'#ff4d6d',b:'xp',q:['Rawr! (Minik ama ciddi.)','Hazine kokusu alıyorum.','Büyüyünce seni sırtımda taşırım.']},
 altin:{n:'Altın Kaplumbağa',r:4,col:'#ffd23f',b:'gold',q:['Yavaş ama zengin.','Kabuğumun içi altın dolu.','Acele işe şeytan karışır.']}
};
var PKEYS=Object.keys(PETS);
function pickPet(luck){var lk=luck||0,u=Math.random(),gz=.001*(1+lk),ef=.012*(1+lk*1.3),ep=.07*(1+lk*.8),na=.28,rar=u<gz?4:u<gz+ef?3:u<gz+ef+ep?2:u<gz+ef+ep+na?1:0;
  var l=PKEYS.filter(function(k){return PETS[k].r===rar});if(!l.length)l=PKEYS.filter(function(k){return PETS[k].r===0});return l[Math.floor(Math.random()*l.length)]}
function petMax(id){return(PETS[id]&&PETS[id].mx)||10}
function petLv(id){return(X.pt[id]&&X.pt[id].lv)||1}
function petBonus(kind){var id=X.act;if(!id||!PETS[id]||!X.pt[id])return 0;var p=PETS[id];if(p.ml&&P.lv<p.ml)return 0;if(p.b!==kind)return 0;
  var v=kind==='regen'?.004*(1+p.r)+petLv(id)*.0006:(4+3*p.r+petLv(id)*.8)/100;return v}

/* ---------- başarımlar ---------- */
var ACH=[
 {id:'ilk',n:'İlk Kan',d:'İlk canavarını yen.',t:'Çaylak',f:function(c){return c.k>=1}},
 {id:'avci',n:'Avcı',d:'100 canavar yen.',t:'Avcı',f:function(c){return c.k>=100}},
 {id:'kasap',n:'Efsane Avcı',d:'1000 canavar yen.',t:'Canavar Kıyıcı',f:function(c){return c.k>=1000}},
 {id:'madenci',n:'Madenci',d:'50 kez maden/odun topla.',t:'Madenci',f:function(c){return c.g>=50}},
 {id:'mkral',n:'Maden Kralı',d:'500 kez maden/odun topla.',t:'Maden Kralı',f:function(c){return c.g>=500}},
 {id:'gezgin',n:'Gezgin',d:'3000 kare yürü.',t:'Gezgin',f:function(c){return c.w>=3000}},
 {id:'olu',n:'Dirilmiş',d:'10 kez yen.',t:'Nefes Almayan',f:function(c){return c.d>=10}},
 {id:'gece',n:'Gece Kuşu',d:'3 geceyi oyunda geçir.',t:'Gece Kuşu',f:function(c){return c.n>=3}},
 {id:'kirmizi',n:'Kızıl Ay Avcısı',d:'Bir Kızıl Ay olayını tamamla.',t:'Kızıl Avcı',f:function(c){return c.r>=1}},
 {id:'yumurta',n:'Hayvan Dostu',d:'3 yoldaş çatlat.',t:'Hayvan Dostu',f:function(c){return c.h>=3}},
 {id:'zoo',n:'Hayvanat Bahçesi',d:'5 farklı yoldaşa sahip ol.',t:'Hayvanat Bekçisi',f:function(c,x){return Object.keys(x.pt).length>=5}},
 {id:'zengin',n:'Altın Dişli',d:'10.000 altına ulaş.',t:'Altın Dişli',f:function(c){return P.gold>=10000}},
 {id:'sayfa',n:'Günlük Bekçisi',d:'Yaxest\'in 9 günlük sayfasını bul.',t:'Günlük Bekçisi',f:function(c,x){return x.pg.length>=9}},
 {id:'foto',n:'Gezgin Fotoğrafçı',d:'3 fotoğraf çek.',t:'Fotoğrafçı',f:function(c){return c.ph>=3}},
 {id:'pazar',n:'Pazarlıkçı',d:'Gezgin Tüccar\'dan 3 kez alışveriş yap.',t:'Pazarlıkçı',f:function(c){return c.tr>=3}},
 {id:'yagmur',n:'Altın Avcısı',d:'Altın Yağmuru\'nda 40 sikke topla.',t:'Altın Avcısı',f:function(c){return c.co>=40}},
 {id:'hayalet',n:'Kurucunun Dostu',d:'Gece yarısı kasabada beliren Yaxest\'in hayaletiyle konuş.',t:'Kurucunun Dostu',f:function(c,x){return !!x.gf}},
 {id:'kidem',n:'Kıdemli',d:'Seviye 20\'ye ulaş.',t:'Kıdemli',f:function(){return P.lv>=20}},
 {id:'efsane',n:'Efsane',d:'Seviye 50\'ye ulaş.',t:'Efsane',f:function(){return P.lv>=50}}
];

/* ---------- Yaxest'in günlük sayfaları ---------- */
var LORE=[
 'Gün 1. Diyar\'a geldiğimde elimde bir kazma, bir umut ve çok fazla slime vardı. Harita yoktu; haritayı sonra kendim çizdim. — Y.',
 'Gün 4. Demirci Dede ilk kılıcımı dövdü. "Kırılırsa benim suçum değil" dedi. Üç gün sonra kırıldı. Yine de çok sevdim.',
 'Gün 9. Kasabanın ortasındaki ışığın gece boyunca yanmasının sebebi var: karanlıkta bir şey kasabaya yaklaşmaya çalışıyor. Henüz ne olduğunu bilmiyorum.',
 'Gün 13. Kızıl Ay doğduğunda canavarlar çıldırıyor, ama bir de şey fark ettim: hep aynı yönden geliyorlar. Sanki bir şeyden kaçıyorlar.',
 'Gün 18. Yumurtaları ilk kez gördüm. Bazıları sadece sıradan bir hayvan çıkarıyor. Ama duydum ki bir tanesi altından bir kabuğa sahipmiş. Yavaşmış ama çok değerliymiş.',
 'Gün 22. Gezgin Tüccar bana şunu söyledi: "Bütün yollar kasabaya çıkar ama kasaba bir yola çıkmaz." Anlamadım. Yazıp bıraktım.',
 'Gün 27. Fırtınada çakan yıldırımların düştüğü yerde parlayan kristaller buldum. Gök bize hediye bırakıyor, sadece eğilip almak lazım.',
 'Gün 31. Bu sayfaları dağıtıyorum çünkü bir gün biri hepsini bulur. O kişi bir hazineyi hak edecek. Haritadaki en güzel hazine de her zaman bir hikaye değil mi?',
 'Gün 33. Son sayfa. Eğer hepsini topladıysan: sen artık gerçek bir Diyar kaşifisin. Altın Kaplumbağa seni bekliyor; yavaş ama seni hiç yarı yolda bırakmaz. İyi yolculuklar. — Yaxest'
];
var PAGES=[];
function buildPages(){PAGES=[];
  for(var i=0;i<9;i++){var best=null;
    for(var k=0;k<200&&!best;k++){var tx=Math.floor(10+rnd(i*31.7+k*1.13)*(Y.MW-20)),ty=Math.floor(10+rnd(i*57.3+k*2.71+9)*(Y.MH-20)),z=Y.zoneAt(tx,ty);
      if(z===3||Y.nodeAt(tx,ty))continue;var d=hyp(tx-Y.CX,ty-Y.CY);if(d<24||d>75)continue;
      var ok=true;for(var j=0;j<PAGES.length;j++)if(hyp(PAGES[j].x/TS-tx,PAGES[j].y/TS-ty)<14)ok=false;
      if(ok)best={x:(tx+.5)*TS,y:(ty+.5)*TS,i:i}}
    if(!best)best={x:(Y.CX+30+i*4)*TS,y:(Y.CY+(i%2?-1:1)*(12+i))*TS,i:i};PAGES.push(best)}}

/* ---------- durum ---------- */
var coin=[],flies=[],nextPick=0,rm={sp:0,act:false,k:0,done:false},petPos={x:0,y:0},petQ=null,emo=null,flash=0,flashT=0,star=null,starT=3,lastTr=false,lastRM=false,lastGR=false,lastNight=null,idle=0,lastPx=0,lastPy=0,acc=0,tab='pet',dk=null,dc=null,stockKey='';
var DAY_CHIP=null,compass=true,lastGhost=false;
var QUOTES=['Oyun yapmak, kum saatini ters çevirip içine harita çizmek gibi.','İlk oyunumda 3 kişi oynadı. İkisi benim kardeşimdi.','Hata yoktur, sürpriz özellik vardır.','Slime\'lara fazla yüklenme; onların da bir hikâyesi var.','Gece yarısı kasabanın ışığı hâlâ yanıyor mu? İyi.','Her güncelleme bir şeyi bozar, bir şeyi güzelleştirir. Hangisi baskın? Sen söyle.','Bu diyarda her şey ücretsiz; sadece zaman değerli.','Bir gün sunucu kurulunca burası kalabalık olacak. Şimdilik sen ve ben varız.'];
function ghostOn(){var r=realHour();return r<1.5}
function ghostPos(){return{x:Y.CX*TS-70,y:Y.CY*TS-40}}

function init(api){D=api;G=D.G;P=D.P;Y=D.Y;TS=Y.TS;
  P.x2=P.x2||{};X=P.x2;X.c=X.c||{k:0,b:0,g:0,d:0,w:0,n:0,r:0,h:0,p:0,ph:0,tr:0,co:0};X.pt=X.pt||{};X.eg=X.eg||[];X.pg=X.pg||[];X.ac=X.ac||{};X.tt=X.tt||'';X.act=X.act||'';X.xb=X.xb||0;X.lk=X.lk||0;X.fin=X.fin||0;
  if(X.act&&!X.pt[X.act])X.act='';
  if(window.YX3)try{YX3.init({D:function(){return D},X:function(){return X},giveEgg:giveEgg,hourP:hourP,weatherNow:weatherNow,ACH:ACH,render:render,openPanel:openPanel})}catch(e){console.error(e)}
  coin=[];flies=[];rm={sp:0,act:false,k:0,done:false};lastTr=traderOn();lastRM=false;lastGR=false;lastNight=null;idle=0;lastPx=G.px;lastPy=G.py;
  petPos={x:G.px-40,y:G.py+10};buildPages();ensureChip();
  var b=$('ix');if(b)b.onclick=function(){if(G&&G.mode==='world'&&!G.paused)openPanel('pet')};
  if(!X.intro){X.intro=1;D.say('✨ Diyar+ geldi: gece-gündüz, hava, yoldaşlar, başarımlar ve gizli sayfalar! Sağ üstteki ✨ düğmesine bak.','sys')}}

function ensureChip(){DAY_CHIP=$('xc');if(DAY_CHIP)return;var d=document.createElement('div');d.id='xc';
  d.style.cssText='position:absolute;left:50%;top:40px;transform:translateX(-50%);z-index:6;pointer-events:none;background:rgba(10,6,24,.6);border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:3px 11px;font:700 12px "Chakra Petch",sans-serif;color:#fff;white-space:nowrap;display:none';
  var h=$('hud')||document.body;h.appendChild(d);DAY_CHIP=d}

/* ---------- kancalar ---------- */
function tick(dt){if(!G||G.mode!=='world'){if(DAY_CHIP)DAY_CHIP.style.display='none';return}
  var now=Date.now(),h=hourP(),night=h<8;
  /* mesafe ve boşta kalma */
  var moved=hyp(G.px-lastPx,G.py-lastPy);if(moved>.5){X.c.w+=moved/TS;idle=0}else idle+=dt;lastPx=G.px;lastPy=G.py;
  /* gece sayacı */
  if(lastNight===null)lastNight=night;else if(lastNight&&!night){X.c.n++;D.say('🌅 Gün doğdu. Geceyi atlattın.','sys')}lastNight=night;
  /* Gezgin Tüccar duyurusu */
  var tr=traderOn();if(tr!==lastTr){lastTr=tr;D.say(tr?'🧳 Gezgin Tüccar kasabaya geldi! (Kasabada, güney doğuda)':'🧳 Gezgin Tüccar yoluna devam etti.','sys')}
  var gh=ghostOn();if(gh!==lastGhost){lastGhost=gh;if(gh)D.say('👻 Gece yarısı… Kasabanın ortasında altın renkli bir ışık belirdi.','sys')}
  /* Kızıl Ay */
  var rmo=redMoonOn();if(rmo!==lastRM){lastRM=rmo;if(rmo){var id=dayIdx();if(X.rm!==id)X.rm=id,rm={k:0,done:false};D.say('🌑 KIZIL AY doğuyor! Canavarlar çıldırdı: herhangi 25 canavarı yen (elitler çift sayılır), ödül kazan!','sys');D.floatTxt(G.px,G.py-80,'🌑 KIZIL AY','#ff5b6e')}else{killRed();D.say('🌅 Kızıl Ay battı.','sys')}}
  if(rmo)redMoonTick(dt);
  /* Altın Yağmuru */
  var gr=goldRainOn();if(gr!==lastGR){lastGR=gr;if(gr)D.say('💰 ALTIN YAĞMURU! Etrafta düşen altınları topla (1,5 dk)!','sys')}
  if(gr){nextPick-=dt;if(nextPick<=0){nextPick=3.4;if(coin.length<8){var a=Math.random()*6.28,r=120+Math.random()*340;coin.push({x:G.px+Math.cos(a)*r,y:G.py+Math.sin(a)*r,k:'coin',t:0})}}}
  /* fırtınada yıldırım kristali */
  if(weatherNow()==='storm'&&!inTown()){starT-=dt;if(flashT<=0&&Math.random()<dt*.18){flash=1;flashT=.4;if(Math.random()<.5&&coin.length<18){var a2=Math.random()*6.28,r2=140+Math.random()*260;coin.push({x:G.px+Math.cos(a2)*r2,y:G.py+Math.sin(a2)*r2,k:'crystal',t:0})}}}
  if(flashT>0)flashT-=dt;flash=Math.max(0,flash-dt*2.6);
  /* toplananlar */
  for(var i=coin.length-1;i>=0;i--){var c=coin[i];c.t+=dt;if(c.t>45){coin.splice(i,1);continue}
    if(hyp(c.x-G.px,c.y-G.py)<34){coin.splice(i,1);if(c.k==='coin'){var v=Math.max(2,Math.round(P.lv*.5)+Math.floor(Math.random()*4));P.gold+=v;X.c.co++;D.floatTxt(c.x,c.y-20,'+'+v+' 🪙','#ffd23f')}else{var v2=Math.max(15,P.lv*6);P.gold+=v2;D.floatTxt(c.x,c.y-20,'⚡ +'+v2+' 🪙','#8fe3ff');D.say('Yıldırım Kristali buldun! +'+v2+' altın','sys');if(Math.random()<.08)giveEgg(1)}}}
  /* yoldaş */
  petTick(dt);
  /* rejenerasyon */
  var rg=petBonus('regen');if(rg>0&&G.hp>0){var mx=D.S().maxhp;G.hp=Math.min(mx,G.hp+mx*rg*dt)}
  /* saat çipi */
  acc+=dt;if(acc>.4){acc=0;chipUpdate(h)}
  achCheck()}
function inTown(){return D.inTownF()}
function chipUpdate(h){if(!DAY_CHIP)return;var w=weatherNow(),cp=window.matchMedia&&matchMedia('(max-height:520px),(max-width:620px)').matches,t=(h<8?'🌙':h<10?'🌅':h>=22?'🌆':'☀️')+' '+clockTxt()+' '+WI[w]+(cp?'':' '+WN[w]);
  if(redMoonOn())t+=' · 🌑 Kızıl Ay '+(X.rm===dayIdx()?Math.min(25,rm.k||0):0)+'/25';else if(goldRainOn())t+=' · 💰 Altın Yağmuru';
  if(traderOn())t+=' · 🧳';if(window.YX3&&!cp){var c3=YX3.chip();if(c3)t+=' · '+c3}
  if(X.xb>Date.now())t+=' · ⚗️';if(X.lk>Date.now())t+=' · 🍀';
  var n=nearestPage();if(!cp&&compass&&n&&X.pg.length<9){var d=n.d/TS;t+=' · '+(d<6?'🔥 Çok sıcak':d<16?'♨️ Sıcak':d<40?'🧭 Ilık':'❄️ Soğuk')}
  if(DAY_CHIP._t!==t){DAY_CHIP._t=t;DAY_CHIP.textContent=t}DAY_CHIP.style.display='block'}
function nearestPage(){var best=null;PAGES.forEach(function(p){if(X.pg.indexOf(p.i)>=0)return;var d=hyp(p.x-G.px,p.y-G.py);if(!best||d<best.d)best={p:p,d:d}});return best}
function redMoonTick(dt){if(X.rm!==dayIdx())X.rm=dayIdx(),rm={k:0,done:false};
  if(inTown()||rm.done)return;rm.sp-=dt;
  var alive=0;G.mons.forEach(function(m){if(m.xm&&!m.dead)alive++;if(m.xm&&!m.dead){m.sx=G.px;m.sy=G.py}});
  if(rm.sp<=0&&alive<10){rm.sp=3.5;var a=Math.random()*6.28,r=380+Math.random()*140,x=G.px+Math.cos(a)*r,y=G.py+Math.sin(a)*r,tx=Math.floor(x/TS),ty=Math.floor(y/TS);
    if(tx<2||ty<2||tx>=Y.MW-2||ty>=Y.MH-2)return;var z=Y.zoneAt(tx,ty);if(z===3||z===4)return;
    var d=Math.max(1,hyp(tx-Y.CX,ty-Y.CY)),lv=Math.max(2,Y.zoneLv(z,d)+1),ty2=z===0?(Math.random()<.5?'slime':'boar'):z===1?(Math.random()<.5?'wolf':'boar'):'golem';
    var m=D.mkMon(ty2,lv,x,y,null);m.hp=m.max=Math.round(m.hp*1.6);m.dmg=Math.round(m.dmg*1.2);m.xp=Math.round(m.xp*2.5);m.gold=Math.round(m.gold*2.5);m.col='#ff3b4d';m.xm=1;G.mons.push(m)}
  for(var i=G.mons.length-1;i>=0;i--){var q=G.mons[i];if(q.xm&&hyp(q.x-G.px,q.y-G.py)>1100)G.mons.splice(i,1)}}
function killRed(){for(var i=G.mons.length-1;i>=0;i--)if(G.mons[i].xm)G.mons.splice(i,1)}
function kill(m){if(!G||!m)return;if(m.xq&&window.YX3){YX3.grantChest(2);if(Math.random()<.2)giveEgg(1)}if(m.type==='goldslime'){var gg=100+P.lv*20;P.gold+=gg;D.say('✨ Altın Balçık '+gg+' altın bıraktı!','sys')}X.c.k++;if(m.boss)X.c.b++;
  if(G.mode==='world'){var xb=petBonus('xp')+(X.xb>Date.now()?.5:0)+(hourP()<8?.25:0),gb=petBonus('gold')+(X.lk>Date.now()?.5:0);
    if(xb>0){var e=Math.round(m.xp*xb);if(e>0)D.giveXp(e)}if(gb>0){var g=Math.round(m.gold*gb);if(g>0)P.gold+=g}}
  if(X.act&&X.pt[X.act]){var p=X.pt[X.act];if(p.lv<petMax(X.act)){p.xp=(p.xp||0)+1;if(p.xp>=30*p.lv){p.xp=0;p.lv++;D.say('🐾 '+PETS[X.act].n+' seviye atladı! (Sv '+p.lv+')','sys')}}}
  var ch=m.xm?.02:m.boss?.05:m.type==='metin'?.1:.002;if(X.eg.length<8&&Math.random()<ch)giveEgg(m.xm||m.boss?1:0);
  if(!rm.done&&X.rm===dayIdx()&&redMoonOn()&&G.mode==='world'){rm.k+=m.xm?2:1;if(m.xm||rm.k<25)D.floatTxt(G.px,G.py-70,'🌑 '+Math.min(25,rm.k)+'/25','#ff7a8a');if(rm.k>=25){rm.k=25;rm.done=true;X.c.r++;var g2=300+P.lv*60;P.gold+=g2;var eg2=Math.random()<.25;if(eg2)giveEgg(1);spawnQueen();D.say('🌑 KIZIL AY TAMAM! +'+g2+' altın'+(eg2?' ve bir yumurta':'')+' kazandın!','sys');D.floatTxt(G.px,G.py-90,'🏆 Kızıl Ay Tamam!','#ffd23f')}}}
function spawnQueen(){var a=Math.random()*6.28,x=G.px+Math.cos(a)*TS*5,y=G.py+Math.sin(a)*TS*5,q=D.mkMon('queen',Math.min(60,P.lv+6),x,y,null);if(q){q.xq=1;q.boss=1;G.mons.push(q);D.say('👑 Kızıl Ay Kraliçesi belirdi! Yen ve Nadir sandığı kap.','sys')}}
function giveEgg(lk){X.eg.push({at:Date.now()+240000,lk:lk||0});D.say('🥚 Gizemli bir yumurta buldun! Yoldaş panelinden çatlatabilirsin (4 dk).','sys')}
function gather(){if(X)X.c.g++}
function died(){if(X)X.c.d++}

/* ---------- yoldaş çizimi ve davranışı ---------- */
var pcd=1,pab=10,PRATE=[.07,.1,.14,.19,.24],PABN={regen:'Şifa Dalgası',xp:'Kıvılcım Patlaması',gold:'Altın Tuzağı'};
function petAtk(id){var p=PETS[id],lv=petLv(id);return PRATE[Math.min(4,p.r)]*(1+.04*(lv-1))}
function petInfo(id){var p=PETS[id];return' · saldırı %'+Math.round(petAtk(id)*100)+(p.r>=2?' · yetenek: '+(PABN[p.b]||'Destek'):'')}
function petFight(dt){var id=X.act,p=PETS[id];if(!p||!X.pt[id]||!G||G.dead>0)return;if(p.ml&&P.lv<p.ml)return;if(D.inTownF&&D.inTownF())return;
  pcd-=dt;pab-=dt;var dg=G.mode==='dungeon'&&G.dg,list=dg?G.dg.mons:G.mons;if(!list)return;
  var best=null,bd=1e9;for(var i=0;i<list.length;i++){var m=list[i];if(m.dead)continue;var d=hyp(m.x-petPos.x,m.y-petPos.y);if(d<bd&&d<240){bd=d;best=m}}
  var st=D.S(),k=dg?.6:1;
  if(best&&pcd<=0){pcd=1.8-.12*p.r;D.addFx({k:'line',x1:petPos.x,y1:petPos.y-10,x2:best.x,y2:best.y,c:p.col,l:.14,w:3});D.dmgMon(best,st.dmg*petAtk(X.act)*k*(best.boss?.6:1))}
  if(p.r>=2&&pab<=0){var cd=Math.max(9,24-3*p.r);
    if(p.b==='regen'){if(G.hp<st.maxhp*.75){pab=cd;G.hp=Math.min(st.maxhp,G.hp+st.maxhp*(.1+.03*p.r));D.addFx({k:'ring',x:G.px,y:G.py,r:100,c:'#5be39a',l:.6});D.floatTxt(petPos.x,petPos.y-34,PABN.regen,'#5be39a')}}
    else if(best){pab=cd;var rr=p.b==='xp'?140:230;D.addFx({k:'ring',x:petPos.x,y:petPos.y,r:rr,c:p.col,l:.5});D.floatTxt(petPos.x,petPos.y-34,PABN[p.b]||'Destek',p.col);
      list.forEach(function(m){if(m.dead||hyp(m.x-petPos.x,m.y-petPos.y)>rr+m.sz)return;if(p.b==='gold')m.slow=3;D.dmgMon(m,st.dmg*(.6+.25*p.r)*k*(p.b==='gold'?.5:1)*(m.boss?.6:1))})}}}
function petTick(dt){if(!X.act||!PETS[X.act]){return}try{petFight(dt)}catch(e){if(!window.__pfe){window.__pfe=1;console.error("petFight",e)}}
  var tx=G.px-(G.fx||1)*46+(G.fy||0)*14,ty=G.py-(G.fy||0)*46+10,k=Math.min(1,dt*3.2);petPos.x+=(tx-petPos.x)*k;petPos.y+=(ty-petPos.y)*k;
  if(hyp(petPos.x-G.px,petPos.y-G.py)>400){petPos.x=G.px-40;petPos.y=G.py+10}
  if(petQ){petQ.t-=dt;if(petQ.t<=0)petQ=null}else if(Math.random()<dt*.035){var q=PETS[X.act].q;petQ={s:idle>20?'Zzz...':q[Math.floor(Math.random()*q.length)],t:3.4}}}
function drawPet(c,id,x,y,t,sleep){var p=PETS[id],b=Math.sin(t*5+x*.01)*(sleep?.6:2),col=p.col;
  c.save();c.translate(x,y+b);c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(0,18-b,13,5,0,0,6.28);c.fill();c.lineWidth=2;c.strokeStyle='#1b1530';
  function body(r,cc){c.fillStyle=cc||col;c.beginPath();c.ellipse(0,4,r,r*.9,0,0,6.28);c.fill();c.stroke()}
  function eyes(dx,y0,r){c.fillStyle='#1a1220';c.beginPath();c.arc(-dx,y0,r,0,6.28);c.arc(dx,y0,r,0,6.28);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(-dx-1,y0-1,r*.35,0,6.28);c.arc(dx-1,y0-1,r*.35,0,6.28);c.fill()}
  if(sleep){c.globalAlpha=.9}
  if(id==='pitik'){body(15);eyes(5,2,2.4);c.strokeStyle='#8a4a3a';c.lineWidth=1.6;c.beginPath();c.arc(0,8,3,.2,2.9);c.stroke()}
  else if(id==='miyav'){c.fillStyle=col;c.beginPath();c.moveTo(-12,-6);c.lineTo(-8,-18);c.lineTo(-2,-8);c.moveTo(12,-6);c.lineTo(8,-18);c.lineTo(2,-8);c.fill();c.stroke();body(13);eyes(5,1,2.2);c.strokeStyle='#fff';c.lineWidth=1;c.beginPath();c.moveTo(-8,6);c.lineTo(-18,4);c.moveTo(8,6);c.lineTo(18,4);c.stroke();c.strokeStyle='#1b1530';c.lineWidth=3;c.beginPath();c.arc(16,12,9,-1.5,1);c.stroke()}
  else if(id==='baykus'){body(14);c.fillStyle='#e8d8c0';c.beginPath();c.ellipse(0,7,9,8,0,0,6.28);c.fill();eyes(5,0,3.8);c.fillStyle='#ffb43a';c.beginPath();c.moveTo(-2,4);c.lineTo(2,4);c.lineTo(0,8);c.fill();c.fillStyle=col;c.beginPath();c.moveTo(-12,-8);c.lineTo(-6,-14);c.lineTo(-3,-8);c.moveTo(12,-8);c.lineTo(6,-14);c.lineTo(3,-8);c.fill()}
  else if(id==='robo'){c.fillStyle=col;c.fillRect(-11,-6,22,20);c.strokeRect(-11,-6,22,20);c.fillStyle='#38e8ff';c.fillRect(-7,-2,5,5);c.fillRect(2,-2,5,5);c.fillStyle='#1b1530';c.fillRect(-5,8,10,2.5);c.beginPath();c.moveTo(0,-6);c.lineTo(0,-13);c.stroke();c.fillStyle='#ff4d6d';c.beginPath();c.arc(0,-14,2.6,0,6.28);c.fill()}
  else if(id==='cemile'){c.fillStyle=col;c.beginPath();c.arc(-9,-6,5,0,6.28);c.arc(9,-6,5,0,6.28);c.fill();c.stroke();body(14);c.fillStyle='#fff7ea';c.beginPath();c.ellipse(0,9,8,6,0,0,6.28);c.fill();eyes(5,1,2.2);c.fillStyle='#f4a3b0';c.beginPath();c.arc(0,5,1.8,0,6.28);c.fill();c.fillStyle='#e8718d';c.beginPath();c.moveTo(-8,14);c.lineTo(0,16);c.lineTo(-8,19);c.moveTo(8,14);c.lineTo(0,16);c.lineTo(8,19);c.fill()}
  else if(id==='peri'){c.fillStyle='rgba(255,200,120,.8)';c.beginPath();c.ellipse(-12,0,9,5,-.5,0,6.28);c.ellipse(12,0,9,5,.5,0,6.28);c.fill();body(10,'#ffc3a0');eyes(3.4,2,1.8);c.fillStyle=col;c.beginPath();c.moveTo(-8,-2);c.lineTo(0,-16-Math.sin(t*9)*2);c.lineTo(8,-2);c.fill();c.stroke()}
  else if(id==='hayalet'){c.fillStyle=col;c.globalAlpha=.85;c.beginPath();c.moveTo(-12,16);c.lineTo(-12,0);c.quadraticCurveTo(0,-20,12,0);c.lineTo(12,16);c.lineTo(6,12);c.lineTo(0,16);c.lineTo(-6,12);c.closePath();c.fill();c.stroke();c.globalAlpha=1;eyes(4,0,2.4);c.fillStyle='#1a1220';c.beginPath();c.ellipse(0,7,2.4,3,0,0,6.28);c.fill()}
  else if(id==='ejder'){c.fillStyle='#ff8fa3';c.beginPath();c.moveTo(-10,0);c.lineTo(-24,-8);c.lineTo(-12,8);c.moveTo(10,0);c.lineTo(24,-8);c.lineTo(12,8);c.fill();c.stroke();body(14);c.fillStyle='#ffd0d8';c.beginPath();c.ellipse(0,9,8,6,0,0,6.28);c.fill();eyes(5,1,2.4);c.fillStyle=col;c.beginPath();c.moveTo(-8,-8);c.lineTo(-5,-16);c.lineTo(-2,-9);c.moveTo(8,-8);c.lineTo(5,-16);c.lineTo(2,-9);c.fill();c.stroke()}
  else if(id==='altin'){c.fillStyle='#8aa86a';c.beginPath();c.ellipse(15,8,5,4,0,0,6.28);c.ellipse(-14,12,4,3,0,0,6.28);c.ellipse(-14,0,4,3,0,0,6.28);c.fill();c.stroke();c.fillStyle='#ffd23f';c.beginPath();c.ellipse(0,2,16,12,0,0,6.28);c.fill();c.stroke();c.strokeStyle='#b8860b';c.lineWidth=1.4;c.beginPath();c.moveTo(-8,-4);c.lineTo(-3,6);c.moveTo(0,-8);c.lineTo(0,12);c.moveTo(8,-4);c.lineTo(3,6);c.stroke();c.fillStyle='#8aa86a';c.beginPath();c.arc(17,3,5,0,6.28);c.fill();c.strokeStyle='#1b1530';c.lineWidth=2;c.stroke();eyes(0,2,1.2);}
  else if(window.YN)YN.petArt(c,id,p,t,sleep);
  c.restore()}

/* ---------- çizim (dünya + ekran) ---------- */
function draw(ctx,camX,camY,t,dg){if(!G||!P)return;if(dg){return}if(window.YR)try{YR.aura(ctx,G,t,P)}catch(e){}if(window.YTr)try{YTr.draw(ctx,G,t,P)}catch(e){}if(window.YT)try{YT.draw(ctx,G,t,P)}catch(e){}if(window.YX3)YX3.draw(ctx,camX,camY,t,D.VW,D.VH);
  var W=D.VW,H=D.VH,dpr=D.dpr,h=hourP(),dkn=darkness(h),w=weatherNow(),red=redMoonOn();
  /* sayfalar */
  PAGES.forEach(function(p){if(X.pg.indexOf(p.i)>=0)return;var sx=p.x-camX,sy=p.y-camY;if(sx<-60||sy<-60||sx>W+60||sy>H+60)return;
    var pu=.5+.5*Math.sin(t*3+p.i);ctx.fillStyle='rgba(255,230,120,'+(.14+.12*pu)+')';ctx.beginPath();ctx.arc(p.x,p.y,26+5*pu,0,6.28);ctx.fill();
    ctx.save();ctx.translate(p.x,p.y-8+Math.sin(t*2+p.i)*4);ctx.rotate(Math.sin(t+p.i)*.18);ctx.fillStyle='#fff7d6';ctx.strokeStyle='#9a7a2a';ctx.lineWidth=1.5;ctx.fillRect(-8,-10,16,20);ctx.strokeRect(-8,-10,16,20);ctx.strokeStyle='#b09040';ctx.beginPath();ctx.moveTo(-5,-5);ctx.lineTo(5,-5);ctx.moveTo(-5,0);ctx.lineTo(5,0);ctx.moveTo(-5,5);ctx.lineTo(2,5);ctx.stroke();ctx.restore()});
  /* düşen sikkeler / kristaller */
  coin.forEach(function(c){var b=Math.sin(t*5+c.x)*3;if(c.k==='coin'){ctx.fillStyle='rgba(255,210,63,.25)';ctx.beginPath();ctx.arc(c.x,c.y+b,15,0,6.28);ctx.fill();ctx.fillStyle='#ffd23f';ctx.strokeStyle='#b8860b';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(c.x,c.y+b,8,Math.abs(Math.cos(t*4+c.x))*8+1.5,0,0,6.28);ctx.fill();ctx.stroke()}
    else{ctx.fillStyle='rgba(120,220,255,.3)';ctx.beginPath();ctx.arc(c.x,c.y+b,18,0,6.28);ctx.fill();ctx.fillStyle='#8fe3ff';ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(c.x,c.y+b-12);ctx.lineTo(c.x+8,c.y+b);ctx.lineTo(c.x,c.y+b+12);ctx.lineTo(c.x-8,c.y+b);ctx.closePath();ctx.fill();ctx.stroke()}});
  /* gezgin tüccar */
  if(traderOn()){var tp=traderPos();if(YAok()&&tp.x-camX>-80&&tp.x-camX<W+80&&tp.y-camY>-100&&tp.y-camY<H+80){
      ctx.fillStyle='rgba(255,210,63,.12)';ctx.beginPath();ctx.ellipse(tp.x,tp.y+14,46,16,0,0,6.28);ctx.fill();
      window.YA.person(ctx,tp.x,tp.y+14,{skin:'#d9a070',cloth:'#7a3fd0',cloth2:'#4a2488',hat:'wizard',prop:'sack',hair:'#222',belt:'#ffd23f'},t,false);window.YA.plate(ctx,tp.x,tp.y+14-86,'Gezgin Tüccar','#ffd23f')}}
  if(ghostOn()&&window.YL&&YAok()){var gp=ghostPos();if(gp.x-camX>-100&&gp.x-camX<W+100&&gp.y-camY>-140&&gp.y-camY<H+100){ctx.fillStyle='rgba(255,210,63,.18)';ctx.beginPath();ctx.ellipse(gp.x,gp.y+18,60,20,0,0,6.28);ctx.fill();ctx.save();ctx.globalAlpha=.62+.12*Math.sin(t*2);try{YL.hero(ctx,gp.x,gp.y+14+Math.sin(t*1.6)*5,YL.PRESETS.yaxest.ap,t,false,1.1)}catch(er){}ctx.restore();window.YA.plate(ctx,gp.x,gp.y-62,X.gh===dayIdx()?'Yaxest (Kurucu)':'👻 Yaxest (Kurucu) · konuş','#ffd23f')}}
  /* yoldaş */
  if(X.act&&PETS[X.act]){drawPet(ctx,X.act,petPos.x,petPos.y,t,idle>20);
    if(petQ){var tw=Math.min(180,petQ.s.length*6.4+16),bx=petPos.x-tw/2,by=petPos.y-48;ctx.fillStyle='rgba(255,255,255,.95)';ctx.strokeStyle='#1b1530';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect?ctx.roundRect(bx,by-22,tw,22,8):ctx.rect(bx,by-22,tw,22);ctx.fill();ctx.stroke();ctx.fillStyle='#1b1530';ctx.font='700 11px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText(petQ.s,petPos.x,by-7)}}
  /* ifade balonu */
  if(emo){emo.t-=1/60;if(emo.t<=0)emo=null;else{var ey=G.py-100-(emo.t<.5?(.5-emo.t)*30:0);ctx.globalAlpha=Math.min(1,emo.t*2);ctx.font='34px sans-serif';ctx.textAlign='center';ctx.fillText(emo.e,G.px,ey);ctx.globalAlpha=1}}
  /* ---- ekran uzayı: karanlık, hava ---- */
  ctx.setTransform(dpr,0,0,dpr,0,0);
  var k=.5,dw=Math.round(W*k),dh=Math.round(H*k);
  if(dkn>0||red||w==='rain'||w==='storm'||w==='fog'){
    if(!dk||dk.width!==dw||dk.height!==dh){dk=document.createElement('canvas');dk.width=dw;dk.height=dh;dc=dk.getContext('2d')}
    dc.globalCompositeOperation='source-over';dc.clearRect(0,0,dw,dh);
    var a=dkn*.78+(w==='rain'?.12:w==='storm'?.2:0)*(1-dkn),r=red?'60,0,14':'8,10,46';
    dc.fillStyle='rgba('+r+','+Math.min(.88,a+(red?.1:0))+')';dc.fillRect(0,0,dw,dh);
    if(dkn>.02&&dkn<.98){dc.fillStyle='rgba(255,120,40,'+(Math.sin(dkn*Math.PI)*.16)+')';dc.fillRect(0,0,dw,dh)}
    dc.globalCompositeOperation='destination-out';
    var ls=(dkn>0?1:.5);
    var g1=dc.createRadialGradient(dw/2,dh/2,6,dw/2,dh/2,270*k);g1.addColorStop(0,'rgba(0,0,0,'+Math.min(1,.95*ls)+')');g1.addColorStop(.6,'rgba(0,0,0,'+(.55*ls)+')');g1.addColorStop(1,'rgba(0,0,0,0)');dc.fillStyle=g1;dc.fillRect(0,0,dw,dh);
    var tx=(Y.CX*TS-(G.px-W/2))*k,ty=(Y.CY*TS-(G.py-H/2))*k,tr=TS*10.5*k;
    if(tx>-tr&&tx<dw+tr&&ty>-tr&&ty<dh+tr){var g2=dc.createRadialGradient(tx,ty,4,tx,ty,tr);g2.addColorStop(0,'rgba(0,0,0,.95)');g2.addColorStop(.7,'rgba(0,0,0,.6)');g2.addColorStop(1,'rgba(0,0,0,0)');dc.fillStyle=g2;dc.fillRect(0,0,dw,dh)}
    ctx.drawImage(dk,0,0,W,H)}
  /* ateşböcekleri */
  if(dkn>.3&&w!=='rain'&&w!=='storm'){for(var i=0;i<18;i++){var fx=((rnd(i*3.1)*W*1.4+Math.sin(t*.4+i*2)*60+t*(6+i%5)*(i%2?1:-1))%(W*1.4)+W*1.4)%(W*1.4)-W*.2,fy=(rnd(i*7.7+2)*H+Math.cos(t*.5+i)*40);
      var fl=.4+.6*Math.abs(Math.sin(t*2+i*1.7));ctx.fillStyle='rgba(220,255,120,'+(.22*fl)+')';ctx.beginPath();ctx.arc(fx,fy,9,0,6.28);ctx.fill();ctx.fillStyle='rgba(240,255,170,'+fl+')';ctx.beginPath();ctx.arc(fx,fy,2,0,6.28);ctx.fill()}}
  /* yıldız kayması */
  if(dkn>.6&&w==='clear'){starT-=1/60;if(starT<=0&&!star){star={x:Math.random()*W*.7,y:Math.random()*H*.35,t:0};starT=5+Math.random()*8}
    if(star){star.t+=1/60;var sp=star.t/.8;if(sp>=1)star=null;else{var sx2=star.x+sp*220,sy2=star.y+sp*110;ctx.strokeStyle='rgba(255,255,255,'+(1-sp)+')';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx2,sy2);ctx.lineTo(sx2-60*(1-sp*.5),sy2-30*(1-sp*.5));ctx.stroke()}}}
  /* yağmur */
  if(w==='rain'||w==='storm'){var n=w==='storm'?240:130;ctx.strokeStyle='rgba(110,150,235,.75)';ctx.lineWidth=1.7;ctx.beginPath();for(var q=0;q<n;q++){var r1=rnd(q*1.37),r2=rnd(q*2.91+5),r3=rnd(q*4.13+1),x=((r1*W-t*90*(w==='storm'?1.6:1))%W+W)%W,y=((r2*H+t*(650+r3*350))%H);ctx.moveTo(x,y);ctx.lineTo(x-5,y+15)}ctx.stroke()}
  if(w==='fog'){var fg=ctx.createLinearGradient(0,0,0,H);fg.addColorStop(0,'rgba(215,222,235,.22)');fg.addColorStop(.5,'rgba(215,222,235,.32)');fg.addColorStop(1,'rgba(215,222,235,.2)');ctx.fillStyle=fg;ctx.fillRect(0,0,W,H);
    for(var b=0;b<5;b++){ctx.fillStyle='rgba(235,240,250,.1)';ctx.beginPath();ctx.ellipse(((t*14+b*W/3)%(W*1.4))-W*.2,H*(.2+b*.16),W*.35,50,0,0,6.28);ctx.fill()}}
  if(flash>0){ctx.fillStyle='rgba(235,240,255,'+(flash*.7)+')';ctx.fillRect(0,0,W,H)}
  ctx.setTransform(dpr,0,0,dpr,0,0)}
function YAok(){return window.YA&&YA.person&&YA.plate}
function traderPos(){var b=Math.floor(Date.now()/600000),a=rnd(b*2.9)*6.28;return{x:Y.CX*TS+Math.cos(a)*380,y:Y.CY*TS+Math.sin(a)*380}}

/* ---------- etkileşim ---------- */
function near(){if(!G||G.mode!=='world')return null;
  var best=null;PAGES.forEach(function(p){if(X.pg.indexOf(p.i)>=0)return;var d=hyp(p.x-G.px,p.y-G.py);if(d<70&&(!best||d<best.d))best={d:d,o:{k:'page',i:p.i}}});
  if(best)return{t:'x',o:best.o};
  if(traderOn()){var tp=traderPos();if(hyp(tp.x-G.px,tp.y-G.py)<90)return{t:'x',o:{k:'trader'}}}
  if(ghostOn()){var gq=ghostPos();if(hyp(gq.x-G.px,gq.y-G.py)<100)return{t:'x',o:{k:'ghost'}}}
  var n3=window.YX3&&YX3.near();if(n3)return n3;
  return null}
function interact(o){if(o.k==='dig'||o.k==='fish')YX3.interact(o);else if(o.k==='page')takePage(o.i);else if(o.k==='trader')openPanel('trader');else if(o.k==='ghost')talkGhost()}
function talkGhost(){var q=QUOTES[Math.floor(Math.random()*QUOTES.length)];
  if(X.gh===dayIdx()){D.say('👻 Yaxest: "'+q+'"','sys');return}
  X.gh=dayIdx();var first=!X.gf;
  if(first){X.gf=1;giveEgg(2);D.say('👻 Yaxest: "Sonunda biri geldi. Bu diyar senin gibi oyuncular için." özel bir yumurta ve unvan kazandın!','sys')}
  else{var g=150+P.lv*10;P.gold+=g;D.say('👻 Yaxest: "'+q+'" (+'+g+' altın)','sys')}
  D.floatTxt(G.px,G.py-90,'👻 Yaxest','#ffd23f');D.saveNow()}
function takePage(i){if(X.pg.indexOf(i)>=0)return;X.pg.push(i);X.c.p++;D.saveNow();
  D.say('📜 Yaxest\'in günlüğü ('+X.pg.length+'/9): '+LORE[i],'sys');D.floatTxt(G.px,G.py-70,'📜 Sayfa '+X.pg.length+'/9','#ffe9a0');
  openPanel('pages')}

/* ---------- panel ---------- */
var TABS=[['pet','🐾 Yoldaş'],['ach','🏆 Başarım'],['pages','📜 Günlük'],['world','🌍 Dünya'],['fun','📸 Eğlence'],['salon','🎮 Salon'],['trader','🧳 Tüccar']];
function openPanel(tb){tab=tb||tab;render();D.openPan('p-x')}
function render(){var el=$('xb');if(!el)return;
  var h='<div class="row" style="flex-wrap:wrap;gap:6px;margin-bottom:8px">'+TABS.filter(function(t){return t[0]!=='trader'||traderOn()||tab==='trader'}).map(function(t){return'<button type="button" class="btn '+(t[0]===tab?'':'alt')+'" data-xt="'+t[0]+'" style="padding:6px 10px;font-size:.8rem">'+t[1]+'</button>'}).join('')+'</div>';
  h+=body();el.innerHTML=h;
  el.querySelectorAll('[data-xt]').forEach(function(b){b.onclick=function(){tab=b.dataset.xt;render()}});bind(el);if(window.YX3)YX3.bind(el,tab)}
function body(){if(tab==='fish'&&window.YX3)return YX3.tabs.fish();if(tab==='pet')return petHtml();if(tab==='ach')return achHtml();if(tab==='pages')return pagesHtml();if(tab==='world')return worldHtml();if(tab==='fun')return funHtml();if(tab==='salon')return salonHtml();return traderHtml()}
function petHtml(){var h='<p class="sub">Yoldaşlar seninle gezer, bonus verir ve konuşur. Yumurtalar canavarlardan, bosslardan ve olaylardan düşer; her canavarın kendi yavrusu vardır.</p>';h+=window.YN?YN.eggHtml():'';
  if(X.eg.length){h+='<h3 style="margin:6px 0">🥚 Yumurtalar</h3>';X.eg.forEach(function(e,i){var left=Math.max(0,Math.ceil((e.at-Date.now())/1000));h+='<div class="it"><span style="font-size:1.6rem">🥚</span><div class="t"><b>'+(e.sp&&Y.PETD[e.sp]?Y.PETD[e.sp].n+' Yumurtası':'Gizemli yumurta'+(e.lk>=2?' ✨':''))+'</b><br><small>'+(left?'Çatlamasına '+Math.floor(left/60)+':'+('0'+left%60).slice(-2):'Hazır!')+'</small></div><button class="btn" data-hatch="'+i+'" '+(left?'disabled':'')+' type="button">Çatlat</button></div>'})}
  h+='<h3 style="margin:8px 0 4px">🐾 Yoldaşların</h3>';var ids=Object.keys(X.pt);
  if(!ids.length)h+='<p class="sub">Henüz yoldaşın yok. İlk yumurtanı bulmak için canavar avla!</p>';
  ids.forEach(function(id){var p=PETS[id],pt=X.pt[id],on=X.act===id,bn=p.b==='xp'?'+%'+(petBonus2(id,'xp'))+' XP':p.b==='gold'?'+%'+(petBonus2(id,'gold'))+' altın':'Can yenileme';
    h+='<div class="it"><canvas width="52" height="52" data-pc="'+id+'" style="background:rgba(255,255,255,.05);border-radius:10px"></canvas><div class="t"><b>'+p.n+'</b> <small style="color:'+RCOL[p.r]+'">'+RAR[p.r]+'</small><br><small>Sv '+pt.lv+(pt.lv<petMax(id)?' · '+(pt.xp||0)+'/'+(30*pt.lv)+' · ':' (maks) · ')+bn+petInfo(id)+'</small></div>'+
      '<button class="btn '+(on?'alt':'')+'" data-act="'+id+'" type="button">'+(on?'Aktif ✓':'Çağır')+'</button></div>'});
  if(X.act)h+='<div class="row"><button class="btn alt" data-pet type="button">❤ Yoldaşı sev</button><button class="btn alt" data-dis type="button">Yoldaşı gönder</button></div>';
  return h}
function petBonus2(id,kind){var p=PETS[id];return Math.round(4+3*p.r+X.pt[id].lv*.8)}
function achHtml(){var un=0,h='';ACH.forEach(function(a){if(X.ac[a.id])un++});
  h+='<p class="sub">Unvanlar: '+un+'/'+ACH.length+' · Seçili unvan karakterinin isminin üstünde görünür.</p>';
  if(X.tt)h+='<div class="row"><button class="btn alt" data-tt="" type="button">Unvanı kaldır ('+esc(X.tt)+')</button></div>';
  ACH.forEach(function(a){var ok=X.ac[a.id];h+='<div class="it" style="'+(ok?'':'opacity:.55')+'"><span style="font-size:1.4rem">'+(ok?'🏆':'🔒')+'</span><div class="t"><b>'+a.n+'</b><br><small>'+a.d+(ok?' · Unvan: '+a.t:'')+'</small></div>'+(ok?'<button class="btn '+(X.tt===a.t?'alt':'')+'" data-tt="'+esc(a.t)+'" type="button">'+(X.tt===a.t?'Seçili':'Seç')+'</button>':'')+'</div>'});
  return h}
function pagesHtml(){var n=X.pg.length,h='<p class="sub">Yaxest, Diyar\'ın dört bir yanına 9 günlük sayfası saklamış. Parlayan kâğıtlara yaklaşıp ✋ ile topla. Üstteki çipte sıcak/soğuk ipucu görünür. <b>'+n+'/9</b></p>';
  h+='<div class="row"><button class="btn alt" data-comp type="button">Pusula: '+(compass?'Açık':'Kapalı')+'</button></div>';
  for(var i=0;i<9;i++)if(X.pg.indexOf(i)>=0)h+='<div class="it"><span style="font-size:1.3rem">📜</span><div class="t"><small>'+esc(LORE[i])+'</small></div></div>';else h+='<div class="it" style="opacity:.5"><span style="font-size:1.3rem">❔</span><div class="t"><small>Sayfa '+(i+1)+': henüz bulunmadı</small></div></div>';
  if(n>=9)h+=X.fin?'<p class="sub">🐢 Altın Kaplumbağa sende. Teşekkürler kaşif!</p>':'<div class="row"><button class="btn" data-fin type="button">🎁 Gizli Hazineyi Al</button></div>';
  return h}
function worldHtml(){var w=weatherNow(),h=hourP(),m=Date.now(),nx=function(ms){var s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+('0'+s%60).slice(-2)};
  var next=hourP()<8?'Gün doğumuna '+nx((8-h)*30000):'Gece '+(h<22?nx((22-h)*30000)+' sonra':'başlıyor');
  var t='<p class="sub">Diyar saati: <b>'+clockTxt()+'</b> · Hava: <b>'+WI[w]+' '+WN[w]+'</b> · '+next+'</p>';
  t+='<div class="it"><span style="font-size:1.4rem">🌑</span><div class="t"><b>Kızıl Ay</b><br><small>Bazı geceler doğar. 25 canavar yen (her tür sayılır, kırmızı elitler çift sayılır): altın + %25 yumurta, ardından Kızıl Ay Kraliçesi (Nadir Sandık, %20 yumurta). '+(redMoonOn()?'<b style="color:#ff7a8a">ŞU AN AKTİF ('+Math.min(25,X.rm===dayIdx()?rm.k:0)+'/25)</b>':'Şu an yok.')+'</small></div></div>';
  t+='<div class="it"><span style="font-size:1.4rem">🧳</span><div class="t"><b>Gezgin Tüccar</b><br><small>Kasabaya uğrar; yumurta, iksir ve kostüm satar. '+(traderOn()?'<b style="color:#5be39a">ŞU AN KASABADA</b>':'Şu an yok.')+'</small></div></div>';
  t+='<div class="it"><span style="font-size:1.4rem">💰</span><div class="t"><b>Altın Yağmuru</b><br><small>Aralıklı olarak gökten sikke yağar. '+(goldRainOn()?'<b style="color:#ffd23f">ŞU AN YAĞIYOR</b>':'Şu an yok.')+'</small></div></div>';
  t+='<div class="it"><span style="font-size:1.4rem">⛈️</span><div class="t"><b>Fırtına</b><br><small>Yıldırımlar düştüğü yere Yıldırım Kristali bırakır.</small></div></div>';
  t+='<div class="it"><span style="font-size:1.4rem">🌙</span><div class="t"><b>Gece</b><br><small>Geceleri %25 fazla XP kazanırsın. Işığın çevreni aydınlatır, kasaba parlar.</small></div></div>';
  var c=X.c;t+='<p class="sub">İstatistik: '+c.k+' canavar · '+c.g+' toplama · '+Math.round(c.w)+' kare yürüyüş · '+c.d+' yenilgi · '+c.n+' gece</p>';return t}
var EMOS=['😀','💃','⚔️','👋','💤','❤️','😎','🔥','🤔','🥳'];
function funHtml(){var h='<p class="sub">Fotoğraf modu oyunu bir kare olarak kaydeder (PNG indirir). İfadeler karakterinin üstünde balon çıkarır.</p><div class="row"><button class="btn" data-photo type="button">📸 Fotoğraf çek</button></div><h3 style="margin:10px 0 4px">İfadeler</h3><div class="row" style="flex-wrap:wrap">';
  EMOS.forEach(function(e){h+='<button class="btn alt" data-emo="'+e+'" type="button" style="font-size:1.4rem;padding:6px 12px">'+e+'</button>'});return h+'</div>'}
function salonHtml(){var L=window.YAXEST_GAMES||[],h='<p class="sub">Yaxest Games\'in diğer oyunlarını oyna, <b>jeton</b> kazan; jetonları kasabadaki Kahraman Mağazası\'nda özel kahramanlara harca. Oyunlar yeni sekmede açılır, ilerlemen kaybolmaz.</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px">';
  L.forEach(function(g){h+='<a class="btn alt" target="_blank" rel="noopener" href="../'+g.id+'/" style="text-decoration:none;display:flex;gap:8px;align-items:center;padding:8px 10px;font-size:.78rem"><span style="font-size:1.3rem">'+g.i+'</span><span>'+esc(g.n.replace('Yaxest ',''))+'</span></a>'});
  return h+'</div>'+(L.length?'':'<p class="sub">Oyun listesi yüklenemedi.</p>')}
/* tüccar */
function stock(){var b=Math.floor(Date.now()/600000),l=[];
  l.push({k:'egg',n:'Gizemli Yumurta',ic:'🥚',p:500,d:'Çatlayınca rastgele bir yoldaş çıkar (4 dk).'});
  l.push({k:'xp',n:'XP İksiri',ic:'⚗️',p:350,d:'10 dk boyunca +%50 XP.'});
  l.push({k:'lk',n:'Şans Tılsımı',ic:'🍀',p:350,d:'10 dk boyunca +%50 altın.'});
  var slots=['hair','top','bottom','shoes','hat','face','neck','back'],s=slots[Math.floor(rnd(b*3.3)*slots.length)],cat=(window.YL&&YL.CAT[s])||[],cand=cat.filter(function(x){return x.p>0&&!P.cs[s+':'+x.id]});
  if(cand.length){var it=cand[Math.floor(rnd(b*6.1)*cand.length)];l.push({k:'cos',slot:s,id:it.id,n:'Kostüm: '+it.n,ic:'👗',p:Math.round(it.p*.8),d:'Özel indirimli. Terzi\'de giyebilirsin.'})}
  return l}
function traderHtml(){if(!traderOn()&&!(G&&G.mode==='world'))return'<p class="sub">Gezgin Tüccar şu an yok.</p>';
  var h='<p class="sub">🧳 Gezgin Tüccar: "Burada sadece birkaç dakikalığına…" Altının: <b>🪙 '+P.gold+'</b></p><div id="xmsg" class="sub"></div>';
  stock().forEach(function(s,i){h+='<div class="it"><span style="font-size:1.5rem">'+s.ic+'</span><div class="t"><b>'+s.n+'</b><br><small>'+s.d+'</small></div><button class="btn" data-buy="'+i+'" type="button">🪙 '+s.p+'</button></div>'});
  return h}
function buy(i){var s=stock()[i],m=$('xmsg');if(!s)return;if(!traderOn()){if(m)m.textContent='Tüccar çoktan gitti.';return}
  if(P.gold<s.p){if(m)m.textContent='Altının yetmiyor.';return}P.gold-=s.p;X.c.tr++;
  if(s.k==='egg')giveEgg(0);else if(s.k==='xp')X.xb=Math.max(Date.now(),X.xb)+600000;else if(s.k==='lk')X.lk=Math.max(Date.now(),X.lk)+600000;else if(s.k==='cos')P.cs[s.slot+':'+s.id]=1;
  D.saveNow();render();var m2=$('xmsg');if(m2)m2.textContent='Satın alındı: '+s.n}
function bind(el){
  if(window.YN)YN.eggBind(el,render);
  el.querySelectorAll('[data-pc]').forEach(function(cv){var c=cv.getContext('2d');drawPet(c,cv.dataset.pc,26,28,0,false)});
  el.querySelectorAll('[data-hatch]').forEach(function(b){b.onclick=function(){var e=X.eg[+b.dataset.hatch];if(!e||e.at>Date.now())return;X.eg.splice(+b.dataset.hatch,1);var id=e.sp?'p_'+e.sp:pickPet(e.lk);
    if(X.pt[id]){if(X.pt[id].lv<petMax(id))X.pt[id].lv++;D.say('🐣 '+PETS[id].n+' yine çıktı! Yoldaşın seviye atladı.','sys')}else{X.pt[id]={lv:1,xp:0};if(!X.act)X.act=id;D.say('🐣 Yeni yoldaş: '+PETS[id].n+' ('+RAR[PETS[id].r]+')!','sys')}
    X.c.h++;D.saveNow();render();var m=document.createElement('p');m.className='sub';m.innerHTML='🐣 Çıkan: <b style="color:'+RCOL[PETS[id].r]+'">'+PETS[id].n+'</b> ('+RAR[PETS[id].r]+')';$('xb').insertBefore(m,$('xb').children[1])}});
  el.querySelectorAll('[data-act]').forEach(function(b){b.onclick=function(){X.act=b.dataset.act;petPos={x:G.px-40,y:G.py+10};D.saveNow();render()}});
  el.querySelectorAll('[data-dis]').forEach(function(b){b.onclick=function(){X.act='';D.saveNow();render()}});
  el.querySelectorAll('[data-pet]').forEach(function(b){b.onclick=function(){if(!X.act)return;petQ={s:'❤ ❤ ❤',t:2.5};D.floatTxt(petPos.x,petPos.y-30,'❤','#ff5c8a')}});
  el.querySelectorAll('[data-tt]').forEach(function(b){b.onclick=function(){X.tt=b.dataset.tt;D.saveNow();render()}});
  el.querySelectorAll('[data-comp]').forEach(function(b){b.onclick=function(){compass=!compass;render()}});
  el.querySelectorAll('[data-fin]').forEach(function(b){b.onclick=function(){if(X.fin||X.pg.length<9)return;X.fin=1;P.gold+=5000;if(!X.pt.altin)X.pt.altin={lv:1,xp:0};X.act='altin';D.say('🎁 Gizli hazine! +5000 altın ve Altın Kaplumbağa yoldaşın oldu!','sys');D.saveNow();render()}});
  el.querySelectorAll('[data-photo]').forEach(function(b){b.onclick=photo});
  el.querySelectorAll('[data-emo]').forEach(function(b){b.onclick=function(){emo={e:b.dataset.emo,t:2.8};D.closePan()}});
  el.querySelectorAll('[data-buy]').forEach(function(b){b.onclick=function(){buy(+b.dataset.buy)}})}
function photo(){D.closePan();setTimeout(function(){try{var cv=document.getElementById('cv'),o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;var c=o.getContext('2d');c.drawImage(cv,0,0);
    var s=o.width/900,bh=Math.round(46*Math.max(1,s));c.fillStyle='rgba(10,6,24,.72)';c.fillRect(0,o.height-bh,o.width,bh);c.fillStyle='#ffd23f';c.font='800 '+Math.round(bh*.42)+'px sans-serif';c.textAlign='left';c.fillText('Yaxest Diyarı',bh*.4,o.height-bh*.52);
    c.fillStyle='#fff';c.font='700 '+Math.round(bh*.3)+'px sans-serif';c.fillText((X.tt?'['+X.tt+'] ':'')+P.nick+' · Sv '+P.lv+' · '+clockTxt()+' · yaxestgames.com/diyar',bh*.4,o.height-bh*.16);
    o.toBlob(function(b){if(!b)return;var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='yaxest-diyari-'+Date.now()+'.png';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);X.c.ph++;D.saveNow();D.say('📸 Fotoğraf kaydedildi!','sys')})}catch(e){D.say('Fotoğraf alınamadı.','sys')}},260)}

/* ---------- başarım kontrolü ---------- */
var achT=0;
function achCheck(){achT++;if(achT%60)return;ACH.forEach(function(a){if(X.ac[a.id])return;var ok=false;try{ok=a.f(X.c,X)}catch(e){}
  if(ok){X.ac[a.id]=1;D.say('🏆 Başarım: '+a.n+' · Yeni unvan: '+a.t,'sys');D.floatTxt(G.px,G.py-90,'🏆 '+a.n,'#ffd23f');if(!X.tt)X.tt=a.t;D.saveNow()}})}
function plate(ctx,x,y){if(!X||!X.tt)return;try{window.YA.plate(ctx,x,y,'« '+X.tt+' »','#ffd23f')}catch(e){}}

window.YX2={init:init,tick:tick,draw:draw,kill:kill,gather:gather,died:died,near:near,interact:interact,plate:plate,PETS:PETS,dbg:{hourP:hourP,weatherNow:weatherNow,redMoonOn:redMoonOn,traderOn:traderOn,goldRainOn:goldRainOn,rm:function(){return rm},X:function(){return X},openPanel:openPanel,PAGES:function(){return PAGES}}};
})();
