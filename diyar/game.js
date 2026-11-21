/* Yaxest Diyarı: istemci (alfa, tek kişilik "Eğitim Diyarı"). Kurallar sim.js'te; çok oyunculu sunucu aynı kuralları kullanacak. */
(function(){'use strict';
var Y=window.YD,TS=Y.TS,AW=30,AH=18;
var $=function(i){return document.getElementById(i)};
var cv=$('cv'),ctx=cv.getContext('2d'),VW=0,VH=0,dpr=1;
var P=null,G=null,KEY='yd1-',raf=0,lastT=0,saveT=0,sprite=null,mmc=null;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function hyp(a,b){return Math.sqrt(a*a+b*b)}
function show(id){['s-load','s-gate','s-char'].forEach(function(x){$(x).classList.toggle('on',x===id)});$('hud').classList.toggle('on',id==='hud');cv.style.display=id==='hud'?'block':'none'}
function acct(){try{return window.YXAcct&&YXAcct.state()}catch(e){return null}}
function loadSave(){try{var a=acct();return a?JSON.parse(localStorage.getItem(KEY+a.uid)||'null'):null}catch(e){return null}}
function saveNow(){var a=acct();if(!P||!a)return;try{if(G&&G.mode==='world'){P.x=G.px;P.y=G.py}localStorage.setItem(KEY+a.uid,JSON.stringify(P))}catch(e){}}
var CKEYS=['lv','xp','wl','al','sw','sa','sr','sl','wt'];
function lookOk(ap){var a=YL.valid(ap);if(a.body==='hamster'&&!preOwn('cemile'))return YL.valid(YL.PRESETS.basic.ap);if(a.body==='svg'){var ok=Object.keys(YL.PRESETS).some(function(k){var q=YL.PRESETS[k];return q.ap&&q.ap.sv===a.sv&&preOwn(k)});if(!ok)return YL.valid(YL.PRESETS.basic.ap)}return a}
function fix(p){p.done=p.done||{};p.pf=p.pf||{};['wood','mine'].forEach(function(k){p.pf[k]=p.pf[k]||{l:1,x:0}});Object.keys(Y.MATS).concat(['gold','wl','al','xp']).forEach(function(k){p[k]=p[k]||0});p.lv=p.lv||1;p.cl=p.cl||{};p.rn=p.rn||{};p.sr=p.sr||{};p.wt=p.wt||0;p.ow=p.ow||{};p.mp=p.mp||0;p.ap=lookOk(p.ap);p.cs=p.cs||{};p.tl=p.tl||{pk:0,ax:0};p.party=p.party||[];if(p.mv!==2){p.mv=2;p.x=Y.CX*TS;p.y=Y.CY*TS}if(p.x==null){p.x=Y.CX*TS;p.y=Y.CY*TS}return p}
function switchCls(k){if(k===P.cls)return;var o={};CKEYS.forEach(function(q){o[q]=P[q]});P.cl[P.cls]=o;var n=P.cl[k]||{lv:1,xp:0,wl:0,al:0,sw:null,sa:null,sr:{},sl:null,wt:0};CKEYS.forEach(function(q){P[q]=n[q]==null?(q==='lv'?1:(q==='sw'||q==='sa'||q==='sl'?null:q==='sr'?{}:0)):n[q]});P.cls=k;P.x=Y.CX*TS;P.y=Y.CY*TS+70;saveNow()}
/* ---------- giriş / karakter ekranları ---------- */
var gUp=0;
function gMode(up){gUp=up;$('gt1').classList.toggle('on',!up);$('gt2').classList.toggle('on',!!up);$('g2').hidden=!up;$('gin').textContent=up?'Hesap oluştur':'Giriş yap';$('pw').autocomplete=up?'new-password':'current-password';$('gerr').textContent=''}
function gate(){var up=gUp,e=$('em').value.trim(),p=$('pw').value;$('gerr').textContent='';
  if(!e||!p){$('gerr').textContent='E-posta ve şifre gerekli';return}
  if(!/^\S+@\S+\.\S+$/.test(e)){$('gerr').textContent='Geçerli bir e-posta yaz';return}
  if(up&&p.length<6){$('gerr').textContent='Şifre en az 6 karakter olmalı';return}
  if(up&&$('pw2').value!==p){$('gerr').textContent='Şifreler aynı değil';return}
  if(!window.YXAcct||!YXAcct.conf()){$('gerr').textContent='Hesap sistemi şu an hazır değil';return}
  $('gin').disabled=true;
  (up?YXAcct.signUp(e,p):YXAcct.signIn(e,p)).then(function(){toChar()}).catch(function(er){$('gerr').textContent=(er&&er.msg)||'Bir sorun oluştu'}).then(function(){$('gin').disabled=false})}
var selCls='savasci';
function detHtml(k){var c=Y.CLASSES[k];return'<b>'+c.ic+' '+esc(c.n)+'</b> · '+esc(c.role)+'<div class="sk"><span>👊</span><div>Temel saldırı: '+(c.melee?'yakın':'uzak')+' menzil</div></div>'+c.sk.map(function(s){return'<div class="sk"><span>'+s.ic+'</span><div><b>'+esc(s.n)+'</b> · '+s.cd+' sn</div></div>'}).join('')}
function clsDet(){$('det').innerHTML=detHtml(selCls)}
function buildCls(){$('cls').innerHTML=Object.keys(Y.CLASSES).map(function(k){var c=Y.CLASSES[k];return'<button type="button" data-k="'+k+'" aria-pressed="'+(k===selCls)+'"><span class="ic">'+c.ic+'</span><b>'+esc(c.n)+'</b><small>'+esc(c.role)+'</small></button>'}).join('');
  $('cls').querySelectorAll('button').forEach(function(b){b.onclick=function(){selCls=b.dataset.k;buildCls();clsDet()}});clsDet()}
function clsCards(){return Object.keys(Y.CLASSES).map(function(k){var c=Y.CLASSES[k],lv=k===P.cls?P.lv:(P.cl[k]?P.cl[k].lv:0);return'<button type="button" data-k="'+k+'" aria-pressed="'+(k===P.cls)+'"><span class="ic">'+c.ic+'</span><b>'+esc(c.n)+'</b><small>'+(lv?'Seviye '+lv:'Yeni · henüz denenmedi')+'</small></button>'}).join('')}
function drawCold(){drawCold0();drawNickFix();var e=$('cold');if(e&&P&&!$('cpv2')){e.insertAdjacentHTML('afterbegin','<div class="cprev"><canvas id="cpv2" width="130" height="170"></canvas><div><b>Görünüm</b><br><small>Kostümünü, saçını, aksesuarlarını değiştir.</small><br><button class="btn alt" id="cwd2" type="button" style="margin-top:8px">Görünümü düzenle</button></div></div>');drawPrev('cpv2',P.ap,130,170,2.3);$('cwd2').onclick=function(){openWardrobe(true)}}}
function drawCold0(){var c=Y.CLASSES[P.cls];
  $('cold').innerHTML='<div class="it"><span style="font-size:2rem">'+c.ic+'</span><div class="t"><b>'+esc(P.nick)+'</b><br><small>'+esc(c.n)+' · Seviye '+P.lv+' · 🪙 '+P.gold+'</small></div></div><div style="margin:10px 0 2px;font-size:.84rem;color:var(--mute)">Sınıfını seç. Her sınıfın seviyesi, silah/zırhı ve rünü ayrı saklanır; altın ve malzemeler ortaktır.</div><div class="cls" id="cls2">'+clsCards()+'</div><div class="det" id="det2">'+detHtml(P.cls)+'</div><div class="row"><button class="btn" id="cgo" type="button">Oyuna gir</button><button class="btn alt" id="cdel" type="button">Karakteri sil</button><button class="btn alt" id="cout2" type="button">Çıkış yap</button></div><div class="err" id="cerr2"></div>';
  $('cls2').querySelectorAll('button').forEach(function(b){b.onclick=function(){switchCls(b.dataset.k);drawCold()}});
  $('cgo').onclick=function(){if(P&&P.nickBad){drawCold();return}enter()};$('cout2').onclick=function(){YXAcct.signOut();show('s-gate')};
  var armed=0;$('cdel').onclick=function(){if(!armed){armed=1;$('cdel').textContent='Emin misin? Tekrar bas';setTimeout(function(){armed=0;if($('cdel'))$('cdel').textContent='Karakteri sil'},3500);return}try{localStorage.removeItem(KEY+acct().uid)}catch(e){}if(P&&P.nick)YXAcct.releaseNick(P.nick);P=null;toChar()}}
function toChar(){var a=acct();if(!a){show('s-gate');return}$('who').textContent=a.email;P=loadSave();show('s-char');
  if(P){fix(P);$('cnew').style.display='none';$('cold').style.display='';drawCold();checkNick()}
  else{$('cnew').style.display='';$('cold').style.display='none';buildCls();bindNew()}}
/* ---------- kostüm / görünüm ---------- */
var selAp=null,selCs={},selGold=20;
function ensureSel(){if(!selAp)selAp=YL.def()}
function drawPrev(id,ap,w,h,sc){var cv=$(id);if(!cv)return;var c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);YL.hero(c,cv.width/2,cv.height-14,ap,0,false,sc)}
function setAv(){try{var im=new Image();im.src=YL.portrait(P.ap,96);im.style.cssText='width:100%;height:100%;border-radius:50%';$('hav').innerHTML='';$('hav').appendChild(im)}catch(e){}}
function preOwn(k){var p=YL.PRESETS[k];if(!p||!p.shop)return true;try{var st=window.YXAcct&&YXAcct.state&&YXAcct.state();var em=((st&&st.email)||'').toLowerCase();if(em==='yakupt196@gmail.com')return true}catch(e){}try{return !!(window.YX&&YX.owns('sp:'+p.shop))}catch(e){return false}}
function prePrice(k){try{var p=YL.PRESETS[k],a=YX.cat.SP.filter(function(x){return x[0]===p.shop})[0];return a?a[2]:0}catch(e){return 0}}
function preLock(b,k){var o=b.querySelector('small')||b.querySelector('b');var old=o.textContent;o.textContent='🔒 Mağaza\'dan '+prePrice(k)+' jetona al';setTimeout(function(){o.textContent=old},2200)}
function presetChips(cur){return Object.keys(YL.PRESETS).map(function(k){return'<button type="button" class="pch" data-pre="'+k+'"><b>'+(preOwn(k)?'':'🔒 ')+YL.PRESETS[k].n+'</b></button>'}).join('')}
function drawNewPrev(){ensureSel();drawPrev('cpv',selAp,150,200,2.7)}
function bindNew(){ensureSel();drawNewPrev();var pc=$('pchs');if(pc)pc.innerHTML=presetChips();$('cnew').querySelectorAll('[data-pre]').forEach(function(b){b.onclick=function(){if(!preOwn(b.dataset.pre)){preLock(b,b.dataset.pre);return}var p=YL.PRESETS[b.dataset.pre].ap;selAp=YL.valid(p);Object.keys(YL.SLOTKEY).forEach(function(sl){var id=selAp[YL.SLOTKEY[sl]];if(!YL.isFree(sl,id))selCs[sl+':'+id]=1});drawNewPrev()}});
  $('cwd').onclick=function(){openWardrobe(false)}}
/* ---- soyunma odası ---- */
var W=null,wdT=0;
var WTABS=[['pre','Hazır'],['body','Vücut'],['h','Saç'],['fc','Yüz'],['t','Üst'],['b','Alt'],['sh','Ayakkabı'],['hat','Şapka'],['nk','Boyun'],['bk','Sırt']];
var TSLOT={h:'hair',t:'top',b:'bottom',sh:'shoes',hat:'hat',fc:'face',nk:'neck',bk:'back',mk:'mark'};
function wOwn(sl,id){return YL.isFree(sl,id)||!!W.owned[sl+':'+id]}
function openWardrobe(ingame){ensureSel();var base=ingame?P.ap:selAp;W={ingame:ingame,ap:YL.valid(base),orig:YL.valid(base),gold:ingame?P.gold:selGold,owned:Object.assign({},ingame?P.cs:selCs),tab:'pre',spent:0};
  if(ingame&&G)G.paused=true;$('s-wd').classList.add('on');drawWd();clearInterval(wdT);var t0=performance.now();wdT=setInterval(function(){if(!W)return;var c=$('wdc').getContext('2d');c.clearRect(0,0,240,320);var t=(performance.now()-t0)/1000;YL.hero(c,120,300,W.ap,t,false,4.2)},70)}
function lockedList(){var l=[];Object.keys(YL.SLOTKEY).forEach(function(sl){var id=W.ap[YL.SLOTKEY[sl]];if(!wOwn(sl,id))l.push({sl:sl,id:id,p:YL.price(sl,id)})});return l}
function drawWd(){var ap=W.ap,hm=ap.body==='hamster',sv=ap.body==='svg',tabs=WTABS.filter(function(t){if(sv)return t[0]==='pre'||t[0]==='body';return!(hm&&(t[0]==='h'||t[0]==='b'||t[0]==='sh'))});if(!tabs.some(function(t){return t[0]===W.tab}))W.tab='pre';
  $('wdt').innerHTML=tabs.map(function(t){return'<button type="button" class="wt'+(t[0]===W.tab?' on':'')+'" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('');
  var g='',col='',tb=W.tab;
  function items(sl,mk){var f=YL.SLOTKEY[sl];return YL.CAT[sl].map(function(x){var own=wOwn(sl,x.id),on=ap[f]===x.id;return'<button type="button" class="wi'+(on?' on':'')+(own?'':' lock')+'" data-s="'+sl+'" data-i="'+x.id+'"><span>'+x.n+'</span><small>'+(own?(x.p?'✓':'Ücretsiz'):'🪙 '+x.p)+'</small></button>'}).join('')}
  function sw(key,pal,names){return pal.map(function(c,i){var cc=names?c[0]:c;return'<button type="button" class="sw'+(ap[key]===cc?' on':'')+'" data-c="'+key+'|'+cc+'" style="background:'+cc+'" title="'+(names?c[1]:'')+'"></button>'}).join('')}
  if(tb==='pre'){g=Object.keys(YL.PRESETS).filter(preOwn).map(function(k){var p=YL.PRESETS[k];return'<button type="button" class="wp" data-pre="'+k+'"><canvas width="90" height="120" data-pc="'+k+'"></canvas><b>'+p.n+'</b><small>'+p.d+'</small></button>'}).join('')}
  else if(tb==='body'){g='<button type="button" class="wi'+(hm?'':' on')+'" data-body="human"><span>İnsan</span></button><button type="button" class="wi'+(hm?' on':'')+(preOwn('cemile')?'':' lock')+'" data-body="hamster"><span>Hamster</span><small>'+(preOwn('cemile')?'✓':'🔒 Cemile')+'</small></button>';col='<p class="wl">'+(hm?'Tüy rengi':'Ten rengi')+'</p>'+sw('sk',hm?YL.PAL.fur:YL.PAL.skin)+'<p class="wl">Göz rengi</p>'+sw('ey',YL.PAL.eyes,1)}
  else if(tb==='fc'){g='<p class="wl" style="grid-column:1/-1">Yüz aksesuarı</p>'+items('face')+'<p class="wl" style="grid-column:1/-1">Yüz detayı</p>'+items('mark')}
  else{var sl=TSLOT[tb];g=items(sl);var ck=YL.SLOTCOL[sl];if(ck&&!(tb==='hat'&&ap.hat==='none')&&!(tb==='bk'&&ap.bk==='none')&&!(tb==='nk'&&ap.nk==='none'))col='<p class="wl">Renk</p>'+sw(ck,tb==='h'?YL.PAL.hair:YL.PAL.cloth)}
  $('wdg').innerHTML=g;$('wdcol').innerHTML=col;
  var lk=lockedList(),inf='';if(lk.length){var q=lk[0],can=W.gold>=q.p;inf='<b>'+YL.CAT[q.sl].filter(function(x){return x.id===q.id})[0].n+'</b> kilitli · 🪙 '+q.p+' <button type="button" class="btn" id="wbuy" '+(can?'':'disabled')+'>'+(can?'Satın al':'Altının yetmiyor')+'</button>'}else inf='<span style="color:#8df0b0">Tüm parçalar senin.</span>';
  $('wdinfo').innerHTML=inf;$('wdgold').innerHTML='🪙 '+W.gold;$('wdok').disabled=lk.length>0;
  $('wdt').querySelectorAll('[data-t]').forEach(function(b){b.onclick=function(){W.tab=b.dataset.t;drawWd()}});
  $('wdg').querySelectorAll('[data-s]').forEach(function(b){b.onclick=function(){ap[YL.SLOTKEY[b.dataset.s]]=b.dataset.i;drawWd()}});
  $('wdg').querySelectorAll('[data-body]').forEach(function(b){b.onclick=function(){if(b.dataset.body==='hamster'&&!preOwn('cemile')){preLock(b,'cemile');return}ap.body=b.dataset.body;if(ap.body==='hamster'&&YL.PAL.fur.indexOf(ap.sk)<0)ap.sk=YL.PAL.fur[0];if(ap.body==='human'&&YL.PAL.skin.indexOf(ap.sk)<0)ap.sk=YL.PAL.skin[2];drawWd()}});
  $('wdcol').querySelectorAll('[data-c]').forEach(function(b){b.onclick=function(){var a=b.dataset.c.split('|');ap[a[0]]=a[1];drawWd()}});
  $('wdg').querySelectorAll('[data-pre]').forEach(function(b){b.onclick=function(){if(!preOwn(b.dataset.pre)){preLock(b,b.dataset.pre);return}var p=YL.valid(YL.PRESETS[b.dataset.pre].ap);Object.keys(YL.SLOTKEY).forEach(function(s2){var id=p[YL.SLOTKEY[s2]];if(!YL.isFree(s2,id))W.owned[s2+':'+id]=1});W.ap=p;drawWd()}});
  $('wdg').querySelectorAll('[data-pc]').forEach(function(cv){var c=cv.getContext('2d');YL.hero(c,45,112,YL.PRESETS[cv.dataset.pc].ap,0,false,1.9)});
  if($('wbuy'))$('wbuy').onclick=function(){var q=lockedList()[0];if(!q||W.gold<q.p)return;W.gold-=q.p;W.owned[q.sl+':'+q.id]=1;drawWd()}}
function wdClose(save){clearInterval(wdT);$('s-wd').classList.remove('on');if(!W)return;var w=W;W=null;
  if(save){if(w.ingame){P.ap=w.ap;P.cs=w.owned;P.gold=w.gold;saveNow();setAv()}else{selAp=w.ap;selCs=w.owned;selGold=w.gold;drawNewPrev()}}
  if(w.ingame&&G)G.paused=false}
var NKW={taken:'Bu takma ad alınmış. Örn: ekine rakam ekle (Ad1).',reserved:'Bu ad ayrılmış (yönetim/marka). Başka bir ad seç.',net:'Takma ad doğrulanamadı: bağlantını kontrol edip tekrar dene.'};
function nickOk(n){return/^[A-Za-z0-9_ğüşöçıİĞÜŞÖÇ]{3,16}$/.test(n)}
function mkChar(){var n=$('nick').value.trim(),er=$('cerr');er.textContent='';
  if(!nickOk(n)){er.textContent='Takma ad 3–16 harf/rakam olmalı (boşluk yok)';return}
  var bt=$('cmk');bt.disabled=true;er.textContent='Takma ad kontrol ediliyor…';
  YXAcct.claimNick(n).then(function(r){bt.disabled=false;
    if(!r.ok){er.textContent=NKW[r.why]||NKW.net;return}
    er.textContent='';P=fix({nick:n,cls:selCls,lv:1,xp:0,gold:selGold,ap:selAp,cs:selCs});saveNow();toChar()})}
/* mevcut karakterlerin adı da kilitlenir; çakışırsa yeni ad istenir */
function checkNick(){if(!P||!window.YXAcct||P.nkOk===P.nick)return;var pn=P;
  YXAcct.claimNick(P.nick).then(function(r){if(P!==pn)return;
    if(r.ok){if(!r.soft)P.nkOk=P.nick;saveNow();return}
    if(r.why==='net')return;
    P.nickBad=r.why;drawCold()})}
function drawNickFix(){var e=$('cold');if(!P||!P.nickBad||!e)return;
  e.insertAdjacentHTML('afterbegin','<div class="it" style="border-color:#ff9d3d"><div class="t"><b>Takma adını değiştir</b><br><small>“'+esc(P.nick)+'” artık başka bir oyuncuya ait'+(P.nickBad==='reserved'?' / ayrılmış':'')+'. Yeni bir ad seç.</small><div class="row" style="margin-top:6px"><input id="nn" maxlength="16" placeholder="Yeni takma ad" style="flex:1;min-width:0"><button class="btn" id="nnb" type="button">Kaydet</button></div><div class="err" id="nne"></div></div></div>');
  $('nnb').onclick=function(){var n=$('nn').value.trim(),er=$('nne');if(!nickOk(n)){er.textContent='3–16 harf/rakam olmalı';return}er.textContent='Kontrol ediliyor…';
    YXAcct.claimNick(n).then(function(r){if(!r.ok){er.textContent=NKW[r.why]||NKW.net;return}var o=P.nick;P.nick=n;P.nkOk=n;delete P.nickBad;saveNow();YXAcct.releaseNick(o).catch(function(){});drawCold()})}}

/* ---------- oyun başlangıcı ---------- */
function toSvgImg(){try{var s=window.YX&&YX.av?YX.av(YX.S().eq,'n'):'';if(!s)return;if(s.indexOf('xmlns')<0)s=s.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');
  if(!/<svg[^>]*\swidth=/.test(s))s=s.replace('<svg','<svg width="96" height="96"');var im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);sprite=im}catch(e){}}
function findFree(tx,ty){for(var r=0;r<14;r++)for(var dy=-r;dy<=r;dy++)for(var dx=-r;dx<=r;dx++){var x=tx+dx,y=ty+dy,z=Y.zoneAt(x,y);if(z!==3&&!Y.nodeAt(x,y))return{x:(x+.5)*TS,y:(y+.5)*TS}}return{x:(tx+.5)*TS,y:(ty+.5)*TS}}
function ang(d,deg){var a=deg*Math.PI/180;return findFree(Math.round(Y.CX+Math.cos(a)*d),Math.round(Y.CY+Math.sin(a)*d))}
function enter(){var st=Y.pstat(P);toSvgImg();
  var cx=Y.CX*TS,cy=Y.CY*TS;
  G={sta:100,stT:0,exh:0,jr:0,t:0,mode:'world',px:P.x,py:P.y,fx:1,fy:0,hp:st.maxhp,cd:[0,0,0,0],atkCd:0,buff:0,guard:0,guardRed:0,evade:0,hot:0,hotT:0,dead:0,lastHurt:-99,mons:[],spawns:[],efx:[],txt:[],dep:{},gather:null,near:null,dg:null,keys:{},jx:0,jy:0,hold:false,log:[],sys:[],paused:false,
    npcs:[{id:'smith',n:'Demirci',ic:'🔨',x:cx-130,y:cy-100},{id:'trader',n:'Tüccar',ic:'🧺',x:cx+130,y:cy-100},{id:'rune',n:'Rün Ustası',ic:'🔮',x:cx,y:cy-190},{id:'smelt',n:'Eritme Ocağı',ic:'🔥',x:cx+210,y:cy+300},{id:'guild',n:'Maceracı Evi',ic:'🏛',x:cx-300,y:cy+215},{id:'trade',n:'Kervan Takasçısı',ic:'⚖',x:cx+40,y:cy+190},{id:'tailor',n:'Terzi',ic:'🧵',x:cx-215,y:cy+70},{id:'shop',n:'Kahraman Mağazası',ic:'🛍',x:cx+215,y:cy+70}],
    pit:{x:cx+330,y:cy+230},vill:VILL(cx,cy),houses:HOUSES(cx,cy),
    portals:[{id:'kurt',p:ang(30,15)},{id:'kristal',p:ang(50,150)},{id:'kale',p:ang(52,255)},{id:'golge',p:ang(58,330)}]};
  var dx=G.px-cx,dy=G.py-cy;if(Y.zoneAt(Math.floor(G.px/TS),Math.floor(G.py/TS))===3){G.px=cx;G.py=cy+60}
  giftTick();clearInterval(giftT);giftT=setInterval(giftTick,90000);mkComps();initSpawns();addMetins();ensureQ();buildMini();setupHud();if(window.YX2)try{YX2.init(window.__yd)}catch(e){}if(window.YNet)try{YNet.init(window.__yd)}catch(e){}show('hud');resize();
  try{var el=document.documentElement;if(el.requestFullscreen&&!document.fullscreenElement)el.requestFullscreen().catch(function(){})}catch(e){}
  try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(function(){})}catch(e){}
  say('Yaxest Diyarı\'na hoş geldin, '+P.nick+'! Yürü, saldır (⚔️), topla (✋). Harita: M veya mini haritaya dokun.','sys');
  say('Çevrimiçi dünya: giriş yaptıysan bağlanılıyor… Canavar, altın ve ilerleme şimdilik sana özel.','sys');
  cancelAnimationFrame(raf);lastT=performance.now();raf=requestAnimationFrame(loop);setTimeout(chkFs,1200)}
/* ---- hediye kutusu: yönetici hediyeleri oyuna girince ve 90 sn'de bir alınır ---- */
function giftTick(){if(!G||!P||!window.YXAcct||!YXAcct.myGifts)return;YXAcct.myGifts().then(function(l){if(!G||!P)return;P.gb=P.gb||[];var got=[];
  l.forEach(function(g){if(g.uid==='*'){if(P.gb.indexOf(g.id)>=0)return}else if(g.claimed)return;
    var it=g.items||{},tx=[];Object.keys(it).forEach(function(k){var n=Math.max(0,Math.min(1e6,Math.floor(+it[k]||0)));if(!n)return;
      if(k.indexOf('cos.')===0){var q=k.split('.');P.cs=P.cs||{};if(YL.CAT[q[1]]){P.cs[q[1]+':'+q[2]]=1;var nm=YL.CAT[q[1]].filter(function(x){return x.id===q[2]})[0];tx.push('👗 Kostüm: '+(nm?nm.n:q[2]))}}else if(k==='gold'){P.gold+=n;tx.push('🪙 '+n)}else if(k==='jeton'){if(window.YX&&YX.earn)YX.earn(n,'gift',true);tx.push('🪙 '+n+' site jetonu')}else if(Y.MATS[k]){P[k]=(P[k]||0)+n;tx.push(Y.MATS[k].ic+' '+n+' '+Y.MATS[k].n)}});
    if(!tx.length)return;if(g.uid==='*'){P.gb.push(g.id);if(P.gb.length>60)P.gb.shift()}else YXAcct.claimGift(g);got.push({m:g.msg,t:tx.join(' · ')})});
  if(got.length){saveNow();var h='<h3 style="margin:0 0 8px;color:#ffd23f">🎁 Hediye geldi!</h3>';got.forEach(function(x){h+='<div class="it"><div class="t"><b>'+esc(x.m||'Hediye')+'</b><br><small>'+esc(x.t)+'</small></div></div>';say('Hediye: '+x.t,'sys')});h+='<div class="row"><button class="btn" data-close type="button">Teşekkürler</button></div>';$('npc').innerHTML=h;$('npc').querySelectorAll('[data-close]').forEach(function(b){b.onclick=closePan});openPan('p-npc')}}).catch(function(){})}
var giftT=0;
function leaveGame(){if(window.YNet)try{YNet.leave()}catch(e){}clearInterval(giftT);cancelAnimationFrame(raf);raf=0;saveNow();G=null;toChar();try{document.fullscreenElement&&document.exitFullscreen()}catch(e){}}
function initSpawns(){G.spawns=[];
  for(var ty=4;ty<Y.MH-4;ty+=6)for(var tx=4;tx<Y.MW-4;tx+=6){var jx=tx+Math.floor(Y.hash(tx,ty,21)*4),jy=ty+Math.floor(Y.hash(tx,ty,22)*4),z=Y.zoneAt(jx,jy);if(z===3||z===4)continue;
    var dx=jx-Y.CX,dy=jy-Y.CY,d=Math.sqrt(dx*dx+dy*dy);if(d<21||Y.hash(tx,ty,23)>.55)continue;
    G.spawns.push({x:(jx+.5)*TS,y:(jy+.5)*TS,z:z,lv:Math.max(1,Y.zoneLv(z,d)),m:null,rt:0,type:Y.monPick(z,d,Y.hash(tx,ty,24),Y.hash(tx,ty,25))})}}
function addMetins(){Y.PVP.forEach(function(z){[[-3,-1],[3,2]].forEach(function(o){var f=findFree(z.tx+o[0],z.ty+o[1]);G.spawns.push({x:f.x,y:f.y,z:2,lv:9,m:null,rt:0,type:'metin'})})})}
function mkMon(type,lv,x,y,sp){var b=Y.MON[type],s=Y.mstat(type,lv);return{type:type,lv:lv,hp:s.hp,max:s.hp,dmg:s.dmg,xp:s.xp,gold:s.gold,x:x,y:y,sx:x,sy:y,sp:b.sp,sz:b.sz,boss:b.boss,col:b.c,n:b.n,hit:0,atkT:.6,slow:0,taunt:0,dotT:0,dotD:0,dotAcc:0,wx:0,wy:0,wt:0,sp8:sp,bob:Math.random()*6}}

var DKEY={kurt:'wolf',kristal:'crystal',kale:'castle',golge:'skull'},DCOL={kurt:'#9b5cff',kristal:'#4fc3ff',kale:'#ff7a5c',golge:'#7aff9a'};
var NPCV={shop:{look:{skin:'#f0c08a',cloth:'#b8860b',cloth2:'#7a5a08',hair:'#2b1a10',hat:'cap',capc:'#ffd23f',prop:'scroll',belt:'#ffd23f',brow:'#2b1a10'},px:0,py:14},tailor:{look:{skin:'#f0c08a',cloth:'#c0508a',cloth2:'#8a3a66',hair:'#3a2418',hat:'band',prop:'scroll',brow:'#3a2418'},px:0,py:14},smith:{st:'smith',look:{skin:'#e0a878',cloth:'#8a4a2a',apron:'#3a3a44',hair:'#3a2418',beard:'#5a3a22',prop:'hammer',hat:'band',brow:'#3a2418'},px:-4,py:16},trader:{st:'trader',px:64,py:18,look:{cloth:'#2f8f8a',hat:'cap',prop:'sack',hair:'#6b3a1a',belt:'#6b4a2b'}},rune:{st:'rune',px:0,py:14,look:{skin:'#e9d9c8',cloth:'#5a3f9a',star:1,hat:'wizard',prop:'orb',hair:'#ddd',brow:'#ccc'}},smelt:{st:'furnace',sy:20},guild:{st:'guild',sy:-36,px:0,py:44,look:{cloth:'#7a3b30',hat:'cap',capc:'#4a2a7a',prop:'scroll',beard:'#8a8a8a',brow:'#555',belt:'#d9a232'}},trade:{st:'cart',px:70,py:20,look:{cloth:'#c9722a',hat:'wide',prop:'sack',beard:'#3a2a1a',skin:'#d9a070'}}};
var LOOK={'Bekçi':{cloth:'#3b5ba8',hat:'helmet',prop:'spear',belt:'#6b4a2b',brow:'#2a1a10'},'Madenci Dede':{cloth:'#8a8f9c',hat:'hard',beard:'#f0f0f0',prop:'pick',apron:'#6b4a2b',brow:'#ddd'},'Çocuk':{s:.72,cloth:'#d94f4f',hair:'#5a3a22'},'Avcı':{cloth:'#3f7a4a',hat:'hood',prop:'bow',cape:'#2d5a38',belt:'#6b4a2b'},'Rünci Çırak':{s:.88,cloth:'#6a4fb0',hat:'wizard',prop:'scroll',hair:'#e0a0c0'},'Şifacı Nine':{cloth:'#8a5ab0',hair:'#f4f4f4',bun:1,prop:'herbs',apron:'#e8e0f0'},'Gezgin':{cloth:'#a08060',hat:'wide',prop:'lantern',cape:'#6b4a2b'},'Balıkçı':{cloth:'#4d7ea8',hat:'straw',prop:'rod',skin:'#d9a070'}};
function VILL(cx,cy){var L=[['Bekçi','💂',-60,120,['Kasaba güvenli bölge: burada kimse sana zarar veremez. Kızıl Vadi ve Kurt Geçidi\'nde ise PvP açık!']],['Madenci Dede','⛏️',250,170,['Madencilik seviyen yükseldikçe gümüş, altın ve mitril damarlarını kırabilirsin. Cevheri ocakta erit!','Bakır 2, Demir 4, Gümüş 6, Altın 8, Mitril 10. seviyede açılır.']],['Çocuk','🧒',-200,-40,['Kurt İni\'nde Alfa Kurt varmış, ama sürüsüyle gelir!']],['Avcı','🏹',-300,60,['Kurtlar ormanda, golemler kayalıkta. Seviyene bak!']],['Rünci Çırak','🔮',90,-150,['Rünler silaha ve zırha takılır. Metin taşlarından nadir malzeme düşer.']],['Şifacı Nine','🌿',170,40,['Kasabada canın hızla dolar, acele etme.']],['Gezgin','🧭',-120,-210,['Haritayı M tuşuyla ya da mini haritaya dokunarak aç.']],['Balıkçı','🎣',320,-60,['Balık tutmak yakında geliyor. Göller boşuna durmuyor!']]];return L.map(function(l){return{n:l[0],ic:l[1],look:LOOK[l[0]],ph:l[2],x:cx+l[2],y:cy+l[3],hx:cx+l[2],hy:cy+l[3],l:l[4],wt:Math.random()*2,wx:0,wy:0}})}
function HOUSES(cx,cy){var h=[],cols=['#a8553a','#4d7ea8','#8a6bb0','#b8913a','#5d9a6a'];for(var i=0;i<12;i++){var a=i/12*6.283+.3,r=i%2?410:460;var hx=cx+Math.cos(a)*r,hy=cy+Math.sin(a)*r*.9;if(Math.hypot(hx-(cx+330),hy-(cy+230))<190||Math.hypot(hx-(cx-300),hy-(cy+215))<230||Math.hypot(hx-(cx+40),hy-(cy+190))<110||Math.hypot(hx-(cx-215),hy-(cy+70))<80)continue;h.push({x:hx,y:hy,c:cols[i%5],w:i%3===0?96:76})}return h}
var RUNES={kurt:{n:'Kurt Rünü',ic:'🐺',slot:'w',d:'Kritik şansı +%15',c:{fang:3,gold:30}},kristal:{n:'Kristal Rünü',ic:'💎',slot:'w',d:'Beceri bekleme süresi -%20',c:{crystal:2,gold:50}},orman:{n:'Orman Rünü',ic:'🌲',slot:'a',d:'Can yenilenmesi: saniyede %1.5',c:{wood:8,stone:2,gold:20}},demir:{n:'Demir Rünü',ic:'⛓️',slot:'a',d:'Hasar azaltma +%8',c:{i_iron:1,stone:3,gold:25}}};
/* ---------- yardımcılar ---------- */
function S(){var s=Y.pstat(P);s.crit=0;s.cdm=1;s.regen=0;if(P.sw==='kurt')s.crit=.15;if(P.sw==='kristal')s.cdm=.8;if(P.sa==='orman')s.regen=.015;if(P.sa==='demir')s.red=Math.min(.6,s.red+.08);return s}function C(){return Y.CLASSES[P.cls]}
function say(t,k){G.log.push(t);if(G.log.length>5)G.log.shift();if(k!=='x'){G.sys.push(t);if(G.sys.length>60)G.sys.shift()}renderLog()}
var LGC={'Odun':'#d9a066','Taş':'#aab4cc','Bakır':'#f0904a','Demir':'#c9cfdb','Gümüş':'#eef3ff','Altın':'#ffd23f','Mitril':'#7ad7ff','Titanyum':'#6ef0d0','Yıldız':'#ff7af0','Kadim':'#e8b45a','Kristal':'#6ee0ff','Efsane':'#ffb02e','\\(Dünya\\)':'#ffb02e','\\(Yerel\\)':'#d0d6e6','\\(Klan\\)':'#c07cff','\\(Parti\\)':'#7dff9b'};
function logCol(l){if(/Seviye|seviye|beceri puan/.test(l))return'#ffd23f';if(/Yenildin|öldü|düştü|başarısız|yandı/.test(l))return'#ff8f8f';if(/gerekir|yetersiz|alınamaz|dolu/.test(l))return'#ffab5c';if(/Görev|ödül|Ödül|Rütbe|rütbe|Takas/.test(l))return'#ffd9a0';if(/^\+|toplandı|dövüldü|yapıldı|kuşanıldı|eritildi|Külçe/.test(l))return'#8df0b0';if(/PvP|Fetih|çağırıyor|Kasaba|bölge/.test(l))return'#c9a6ff';if(/hoş geldin|Harita|Yürü|Kristal Mağara|İni|Kale|Mezarlığı/.test(l))return'#9fdcff';return'#d8d3ff'}
function logHtml(l){var h=esc(l);Object.keys(LGC).forEach(function(k){h=h.replace(new RegExp(k+'(?= |\\)|$|,|\\.|!)','g'),function(m){return'<span style="color:'+LGC[k]+';font-weight:700">'+m+'</span>'})});return h}
function renderLog(){$('log').innerHTML=G.log.map(function(l){return'<div style="color:'+logCol(l)+'">'+logHtml(l)+'</div>'}).join('')}
function floatTxt(x,y,s,c){G.txt.push({x:x,y:y,s:YA.plain(s),c:c||'#fff',t:0})}
function addFx(o){o.t=0;G.efx.push(o)}
function blocked(x,y){var tx=Math.floor(x/TS),ty=Math.floor(y/TS);if(G.mode==='dungeon')return tx<1||ty<1||tx>=AW-1||ty>=AH-1;return Y.zoneAt(tx,ty)===3}
function moveH(dx,dy){if(!blocked(G.px+dx,G.py))G.px+=dx;if(!blocked(G.px,G.py+dy))G.py+=dy}
function moveE(e,dx,dy){if(!blocked(e.x+dx,e.y))e.x+=dx;if(!blocked(e.x,e.y+dy))e.y+=dy}
function curMons(){return G.mode==='dungeon'?G.dg.mons:G.mons}
function nearest(range,from){var best=null,bd=1e9,list=curMons();for(var i=0;i<list.length;i++){var m=list[i];if(m.dead)continue;var d=hyp(m.x-(from?from.x:G.px),m.y-(from?from.y:G.py))-m.sz;if(d<range&&d<bd){bd=d;best=m}}return best}
function giveXp(n){if(window.YSoc&&n>0){try{n=Math.max(1,Math.round(n*YSoc.xpMul()))}catch(e){}}P.xp+=n;if(n>=3)floatTxt(G.px+14,G.py-64,'+'+n+' XP','#6ec4ff');var lv=false;while(P.lv<Y.MAXLV&&P.xp>=Y.xpNeed(P.lv)){P.xp-=Y.xpNeed(P.lv);P.lv++;lv=true}
  if(lv){G.hp=S().maxhp;floatTxt(G.px,G.py-50,'SEVİYE '+P.lv+'!','#ffd23f');say('Seviye atladın: '+P.lv+(Y.skillPts(P)?' · '+Y.skillPts(P)+' beceri puanın var (K)':''),'sys');refreshBar();addFx({k:'ring',x:G.px,y:G.py,r:110,c:'#ffd23f',l:.7})}}
function giveProf(k,n){var p=P.pf[k];p.x+=n;while(p.x>=Y.profNeed(p.l)){p.x-=Y.profNeed(p.l);p.l++;say(Y.PROF[k]+' seviyen '+p.l+' oldu!','sys')}}

/* ---------- savaş ---------- */
function inTownF(){return !!G&&G.mode==='world'&&hyp(G.px-Y.CX*TS,G.py-Y.CY*TS)<TS*10}
function pvpAt(x,y){for(var i=0;i<Y.PVP.length;i++){var z=Y.PVP[i];if(hyp(x/TS-(z.tx+.5),y/TS-(z.ty+.5))<z.r)return z}return null}
function hurt(d,from){if(inTownF())return;if(G.dead>0)return;if(G.evade>0)return;
  var v=d*(1-S().red)*(G.guard>0?(1-G.guardRed):1);v=Math.max(1,Math.round(v));G.hp-=v;G.lastHurt=G.t;floatTxt(G.px,G.py-34,'-'+v,'#ff6b7a');
  if(G.hp<=0){G.hp=0;die()}}
function die(){if(window.YX2)try{YX2.died()}catch(e){}G.dead=1;G.gather=null;var lost=Math.floor(P.gold*.05);P.gold-=lost;say('Yenildin!'+(lost?' '+lost+' altın kaybettin.':''),'sys');
  var cost=G.mode==='world'?8*P.lv:0;$('dmsg').innerHTML='Nerede yeniden doğmak istersin?'+(lost?'<br><small>Kayıp: 🪙 '+lost+'</small>':'');$('dhere').style.display=G.mode==='world'?'':'none';$('dhere').innerHTML='Yerinde doğ (🪙 '+cost+')';$('dhere').disabled=P.gold<cost;$('dtown').disabled=true;if(G.mode==='world')$('dhere').disabled=true;
  $('p-dead').classList.add('on');setTimeout(function(){if(G&&G.dead>0){$('dtown').disabled=false;if(G.mode==='world')$('dhere').disabled=P.gold<8*P.lv}},1300)}
function respawn(mode){if(!G||G.dead<=0)return;$('p-dead').classList.remove('on');var here=mode==='here'&&G.mode==='world',cost=8*P.lv;
  if(here&&P.gold<cost)here=false;if(here){P.gold-=cost;G.hp=Math.round(S().maxhp*.5)}else{if(G.mode==='dungeon'){G.mode='world';G.dg=null}G.px=Y.CX*TS;G.py=Y.CY*TS+70;G.hp=S().maxhp}
  G.dead=0;G.buff=G.guard=G.evade=G.hot=0;G.comp&&G.comp.forEach(function(c){c.x=G.px;c.y=G.py});saveNow()}
function dmgMon(m,d,dot,crit){if(m.dead)return;if(m.type!=='metin')d*=Y.lvMod(P.lv,m.lv);d=Math.max(1,Math.round(d));m.hp-=d;m.hit=5;floatTxt(m.x,m.y-m.sz-14,(crit?'✦':'')+d,dot?'#9be37a':crit?'#ffd23f':'#fff');if(m.hp<=0)killMon(m);else if(m.type==='metin')metinPh(m)}
function metinPh(m){var ph=Math.floor((1-m.hp/m.max)*4);m.ph=m.ph||0;while(m.ph<ph){m.ph++;say('Fetih Kristali canavarları çağırıyor!','sys');for(var i=0;i<2;i++){var a=Math.random()*6.28,x=m.x+Math.cos(a)*70,y=m.y+Math.sin(a)*70;if(blocked(x,y)){x=m.x;y=m.y+60}var w=mkMon(m.ph%2?'wolf':'golem',Math.max(1,m.lv-1),x,y,null);w.sx=x;w.sy=y;w.hit=9;G.mons.push(w)}}}
function killMon(m){m.dead=1;if(window.YX2)try{YX2.kill(m)}catch(e){}qProg('kill',m.type,1);if(m.type==='guardian'||m.type==='lich')P.core++;else if(m.type==='metin'&&Math.random()<.25){P.core++;say('Efsane Çekirdeği düştü!','sys')}else if(m.type==='alpha'&&Math.random()<.15){P.core++;say('Efsane Çekirdeği düştü!','sys')};if(m.type==='metin'){P.crystal+=1+(Math.random()<.5?1:0);P.silver+=2;P.fang+=2;say('Fetih Kristali yıkıldı! Kristal, gümüş ve kurt dişi düştü.','sys')}giveXp(Math.max(1,Math.round(m.xp*Math.max(.1,1-.18*Math.max(0,P.lv-m.lv))*Math.min(2.2,1+.12*Math.max(0,m.lv-P.lv)))));P.gold+=m.gold;floatTxt(m.x,m.y-m.sz-30,'+'+m.xp+' XP','#7ab8ff');
  if(G.mode==='world'){if(m.sp8){m.sp8.m=null;m.sp8.rt=m.type==='metin'?150:20+Math.random()*12}
    var r=Math.random();if(r<.28){P.wood++;say('+1 Odun','x')}else if(r<.5){P.stone++;say('+1 Taş','x')}
    var i=G.mons.indexOf(m);if(i>=0)G.mons.splice(i,1)}
  else dgCheck()}
function attack(){if(G.atkCd>0||G.dead>0)return;if(window.YSoc&&YSoc.duelOn()){var c0=C();G.atkCd=Math.max(.45,S().aspd);G.swT=.18;addFx({k:'swing',x:G.px,y:G.py,fx:G.fx,fy:G.fy,c:c0.col,l:.15});YSoc.duelHit();return}var st=S(),c=C(),t=nearest(st.rng+(c.melee?16:0));G.atkCd=st.aspd;G.swT=.18;
  if(!t){addFx({k:'swing',x:G.px,y:G.py,fx:G.fx,fy:G.fy,c:c.col,l:.12});G.atkCd=Math.min(.3,st.aspd);return}
  var dx=t.x-G.px,dy=t.y-G.py,h=hyp(dx,dy)||1;G.fx=dx/h;G.fy=dy/h;
  var crit=Math.random()<(P.cls==='suikastci'?.22:.1)+S().crit,d=st.dmg*(G.buff>0?(G.bm||1.5):1)*(.9+Math.random()*.2)*(crit?1.7:1);
  if(c.melee)addFx({k:'swing',x:G.px,y:G.py,fx:G.fx,fy:G.fy,c:c.col,l:.15});else addFx({k:'line',x1:G.px,y1:G.py,x2:t.x,y2:t.y,c:c.col,l:.14,w:3});
  dmgMon(t,d,0,crit)}
function skAt(i){ensureSl();var id=P.sl[i];if(!id)return null;var l=C().sk;for(var j=0;j<l.length;j++)if(l[j].id===id)return l[j];return null}
function ensureSl(){var c=C(),ok=P.sl&&P.sl.length===4;if(ok){for(var i=0;i<4;i++){var id=P.sl[i];if(id){var s=c.sk.filter(function(x){return x.id===id})[0];if(!s||s.lv>P.lv)P.sl[i]=null}}}else{P.sl=[null,null,null,null]}
  var used={};P.sl.forEach(function(x){if(x)used[x]=1});for(var j=0;j<4;j++)if(!P.sl[j]){var f=c.sk.filter(function(x){return x.lv<=P.lv&&!used[x.id]})[0];if(f){P.sl[j]=f.id;used[f.id]=1}}}
function skScaled(s){var r=Y.skRank(P,s.id),o={},k;for(k in s)o[k]=s[k];var rm=1+.1*(r-1);if(o.m)o.m*=rm;if(o.amt)o.amt=Math.min(1,o.amt*rm);if(o.dur)o.dur*=1+.05*(r-1);o.cd=s.cd*(1-.03*(r-1));o.rank=r;return o}
function cast(i){if(G.dead>0)return;var c=C(),s0=skAt(i);if(!s0||G.cd[i]>0)return;var s=skScaled(s0),st=S(),base=st.dmg*(G.buff>0?(G.bm||1.5):1),list=curMons(),used=false,k=s.kind;
  if(k==='aoe'){used=true;addFx({k:'ring',x:G.px,y:G.py,r:s.r,c:c.col,l:.4});list.slice().forEach(function(m){if(!m.dead&&hyp(m.x-G.px,m.y-G.py)<s.r+m.sz){dmgMon(m,base*s.m);if(s.slow)m.slow=s.slow}})}
  else if(k==='dash'){used=true;var n=12,sx=G.px,sy=G.py;for(var j=0;j<n;j++){var nx=G.px+G.fx*s.d/n,ny=G.py+G.fy*s.d/n;if(blocked(nx,ny))break;G.px=nx;G.py=ny}
    addFx({k:'line',x1:sx,y1:sy,x2:G.px,y2:G.py,c:c.col,l:.25,w:10});if(s.r)list.slice().forEach(function(m){if(!m.dead&&hyp(m.x-G.px,m.y-G.py)<s.r+m.sz)dmgMon(m,base*s.m)})}
  else if(k==='aoeT'){var tg=nearest(340),cx2=tg?tg.x:G.px,cy2=tg?tg.y:G.py;used=true;addFx({k:'ring',x:cx2,y:cy2,r:s.r,c:c.col,l:.5});addFx({k:'line',x1:cx2,y1:cy2-260,x2:cx2,y2:cy2,c:'#ff9a3a',l:.22,w:14});list.slice().forEach(function(m){if(!m.dead&&hyp(m.x-cx2,m.y-cy2)<s.r+m.sz){dmgMon(m,base*s.m);if(s.slow)m.slow=s.slow}})}
  else if(k==='chain'){var cl=list.filter(function(m){return !m.dead&&hyp(m.x-G.px,m.y-G.py)<360}).sort(function(a,b){return hyp(a.x-G.px,a.y-G.py)-hyp(b.x-G.px,b.y-G.py)}).slice(0,s.hits||4);if(cl.length){used=true;var px0=G.px,py0=G.py;cl.forEach(function(m){addFx({k:'line',x1:px0,y1:py0,x2:m.x,y2:m.y,c:'#9bd0ff',l:.25,w:5});px0=m.x;py0=m.y;dmgMon(m,base*s.m)})}}
  else if(k==='buff'){used=true;G.buff=s.dur;G.bm=s.dmgm||1.5;addFx({k:'ring',x:G.px,y:G.py,r:60,c:c.col,l:.5});floatTxt(G.px,G.py-50,'Hasar +%50','#ffb27a')}
  else if(k==='taunt'){used=true;addFx({k:'ring',x:G.px,y:G.py,r:s.r,c:c.col,l:.5});list.forEach(function(m){if(!m.dead&&hyp(m.x-G.px,m.y-G.py)<s.r){m.taunt=s.dur;m.hit=s.dur}})}
  else if(k==='guard'){used=true;G.guard=s.dur;G.guardRed=s.red;addFx({k:'ring',x:G.px,y:G.py,r:50,c:c.col,l:.5})}
  else if(k==='line'){used=true;var ex=G.px+G.fx*s.len,ey=G.py+G.fy*s.len;addFx({k:'line',x1:G.px,y1:G.py,x2:ex,y2:ey,c:c.col,l:.3,w:12});
    list.slice().forEach(function(m){if(m.dead)return;var t=Math.max(0,Math.min(1,((m.x-G.px)*G.fx+(m.y-G.py)*G.fy)/s.len)),qx=G.px+G.fx*s.len*t,qy=G.py+G.fy*s.len*t;if(hyp(m.x-qx,m.y-qy)<m.sz+26)dmgMon(m,base*s.m)})}
  else if(k==='heal'){used=true;var h=Math.round(st.maxhp*s.amt);G.hp=Math.min(st.maxhp,G.hp+h);floatTxt(G.px,G.py-40,'+'+h,'#5be39a');addFx({k:'ring',x:G.px,y:G.py,r:s.r,c:c.col,l:.5})}
  else if(k==='hot'){used=true;G.hot=s.dur;G.hotAmt=s.amt;addFx({k:'ring',x:G.px,y:G.py,r:70,c:c.col,l:.5})}
  else if(k==='strike'){var t=nearest(s.rng);if(t){used=true;var h2=hyp(t.x-G.px,t.y-G.py)||1,ux=(t.x-G.px)/h2,uy=(t.y-G.py)/h2;addFx({k:'line',x1:G.px,y1:G.py,x2:t.x,y2:t.y,c:c.col,l:.22,w:8});G.px=t.x-ux*(t.sz+14);G.py=t.y-uy*(t.sz+14);if(blocked(G.px,G.py)){G.px=t.x;G.py=t.y}G.fx=ux;G.fy=uy;dmgMon(t,base*s.m,0,1)}}
  else if(k==='dot'){var t2=nearest(s.rng);if(t2){used=true;t2.dotT=s.ticks*.5;t2.dotD=base*s.m;t2.dotAcc=0;t2.hit=5;addFx({k:'line',x1:G.px,y1:G.py,x2:t2.x,y2:t2.y,c:'#9be37a',l:.2,w:4})}}
  else if(k==='evade'){used=true;G.evade=s.dur;floatTxt(G.px,G.py-46,'Görünmez','#d8d3ff')}
  if(used)G.cd[i]=s.cd*st.cdm;else floatTxt(G.px,G.py-40,'Hedef yok','#aaa')}

/* ---------- etkileşim: NPC, portal, kaynak ---------- */
function nodeNear(){if(G.mode!=='world')return null;var tx0=Math.floor(G.px/TS),ty0=Math.floor(G.py/TS),best=null,bd=70;
  for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var tx=tx0+dx,ty=ty0+dy,n=Y.nodeAt(tx,ty);if(!n)continue;var key=tx+','+ty;if(G.dep[key]>G.t)continue;
    var d=hyp((tx+.5)*TS-G.px,(ty+.5)*TS-G.py);if(d<bd){bd=d;best={kind:n,tx:tx,ty:ty,key:key}}}return best}
function findNear(){if(G.dead>0)return null;if(G.mode==='dungeon'){var dg=G.dg;if(dg.done&&hyp(dg.ex-G.px,dg.ey-G.py)<80)return{t:'exit'};return null}
  for(var i=0;i<G.npcs.length;i++)if(hyp(G.npcs[i].x-G.px,G.npcs[i].y-G.py)<80)return{t:'npc',o:G.npcs[i]};
  if(hyp(G.pit.x-G.px,G.pit.y-G.py)<90)return{t:'pit'};
  for(var vi=0;vi<G.vill.length;vi++)if(hyp(G.vill[vi].x-G.px,G.vill[vi].y-G.py)<70)return{t:'vill',o:G.vill[vi]};
  for(var j=0;j<G.portals.length;j++){var p=G.portals[j];if(hyp(p.p.x-G.px,p.p.y-G.py)<80)return{t:'portal',o:p}}
  var xo=window.YX2&&YX2.near();if(xo)return xo;
  var n=nodeNear();return n?{t:'node',o:n}:null}
function interact(){var n=findNear();if(!n)return;
  if(n.t==='npc')openNpc(n.o.id);
  else if(n.t==='portal')enterDg(n.o.id);
  else if(n.t==='exit')exitDg();
  else if(n.t==='x'){YX2.interact(n.o)}
  else if(n.t==='vill'){say(n.o.n+': '+n.o.l[Math.floor(Math.random()*n.o.l.length)],'sys')}
  else if(n.t==='pit'){if(G.gather&&G.gather.o.key==='pit'){G.gather=null;return}G.gather={o:{key:'pit',kind:'pit'},t:0,need:2.6}}
  else if(n.t==='node'){if(G.gather&&G.gather.o.key===n.o.key){G.gather=null;return}var d=Y.NODE[n.o.kind];if(P.pf[d.prof].l<(d.req||1)){say(d.n+': '+Y.PROF[d.prof]+' seviye '+d.req+' gerekir.','sys');return}var tk=d.prof==='mine'?'pk':'ax',tt=P.tl[tk];if(tt<(d.tk||0)){say(d.n+': '+Y.TOOLS[tk].t[d.tk]+' veya daha iyisi gerekir (Demirci).','sys');return}G.gather={o:n.o,t:0,need:d.t*(1-.08*tt)}}}
function gatherDone(){if(window.YX2)try{YX2.gather()}catch(e){}var o=G.gather.o;if(o.kind==='pit'){var pf0=P.pf.mine,a=1+Math.floor(pf0.l/2)+(Math.random()<.5?1:0),ex='';P.stone+=a;if(pf0.l>=2&&Math.random()<.5){P.copper++;ex+=' +1🟤'}if(pf0.l>=4&&Math.random()<.3){P.iron++;ex+=' +1⛓️'}if(pf0.l>=6&&Math.random()<.15){P.silver++;ex+=' +1⚪'}giveProf('mine',2);giveXp(3);floatTxt(G.px,G.py-40,'+'+a+'🪨'+ex,'#fff');say('Ocaktan +'+a+' Taş'+ex,'x');G.gather={o:o,t:0,need:2.6};return}
  var d=Y.NODE[o.kind],pf=P.pf[d.prof],tt=P.tl[d.prof==='mine'?'pk':'ax'],y=1+(pf.l>=3?1:0)+(pf.l>=6?1:0)+(Math.random()<.2+.06*tt?1:0)+(tt>=4&&Math.random()<.3?1:0);
  P[d.mat]+=y;qProg('gather',d.mat,y);G.dep[o.key]=G.t+45+(d.tk||0)*8;giveProf(d.prof,1+Math.floor((d.req||1)/3));giveXp(2+(d.tk||0)*3);floatTxt(G.px,G.py-40,'+'+y+' '+Y.MATS[d.mat].ic,'#fff');say('+'+y+' '+Y.MATS[d.mat].n,'x');G.gather=null}

/* ---------- zindan ---------- */
function addMP(n){if(!n)return;var r0=Y.rankOf(P.mp);P.mp+=n;var r1=Y.rankOf(P.mp);say('+'+n+' Maceracı Puanı','x');if(r1>r0){say('RÜTBE ATLADIN: '+Y.RANKS[r1].n+'! Yeni zindanların kapısı açıldı.','sys');floatTxt(G.px,G.py-60,Y.RANKS[r1].n+' RÜTBE','#ffd23f')}}
function ensureQ(){var day=Math.floor(Date.now()/864e5);if(!P.q||P.q.day!==day){P.q={day:day,list:Y.genQuests(day,P.lv).map(function(q){q.st=0;q.have=0;return q})}}}
function qProg(t,k,n){if(!P||!P.q||!n)return;P.q.list.forEach(function(q){if(q.st===1&&q.t===t&&(q.k===k||q.k==='any')){q.have=Math.min(q.n,q.have+n);if(q.have>=q.n&&!q.fl){q.fl=1;say('Görev tamam: Maceracı Evi\'ne dön!','sys')}}})}
function qTxt(q){var mn=function(k){return Y.MON[k]?Y.MON[k].n:k};return q.t==='kill'?q.n+' × '+mn(q.k)+' yen':q.t==='gather'?q.n+' × '+Y.MATS[q.k].n+' topla':q.t==='smelt'?q.n+' külçe erit / silah döv':Y.DUNGEONS[q.k].n+' zindanını fethet'}
var CLK={savasci:{cloth:'#c0503a',hat:'helmet',prop:'spear',belt:'#6b4a2b'},tank:{cloth:'#3b5ba8',hat:'helmet',prop:'hammer',belt:'#6b4a2b'},buyucu:{cloth:'#5a3f9a',hat:'wizard',prop:'orb',star:1,hair:'#ddd'},sifaci:{cloth:'#3f8a5a',hat:'hood',hoodc:'#46d68a',prop:'herbs'},suikastci:{cloth:'#2d2a3f',hat:'hood',hoodc:'#2a2540',prop:'bow',cape:'#1f1a2e'}};
function mkComps(){G.comp=P.party.map(function(c,i){return{cls:c.cls,x:G.px-30*(i+1),y:G.py+20,cd:0,hcd:3,mv:0,look:CLK[c.cls]}})}
function compStat(c){return Y.pstat({cls:c.cls,lv:P.lv,wl:Math.max(0,P.wl-1),al:Math.max(0,P.al-1),wt:Math.max(0,(P.wt||0)-1)})}
function compUpdate(dt){if(!G.comp)return;var n=G.comp.length;G.comp.forEach(function(c,i){var cs=Y.CLASSES[c.cls],st=compStat(c),ox=G.px-Math.cos(i*1.6+.8)*64,oy=G.py+Math.sin(i*1.6+.8)*50+14,tg=nearest(300,c),dx,dy,d,sp=165;
    if(hyp(c.x-G.px,c.y-G.py)>520){c.x=G.px;c.y=G.py}
    if(tg&&cs.melee&&G.mode!=='x'){dx=tg.x-c.x;dy=tg.y-c.y;d=hyp(dx,dy);if(d>tg.sz+34){c.x+=dx/d*sp*dt;c.y+=dy/d*sp*dt;c.mv=1}else c.mv=0}
    else{dx=ox-c.x;dy=oy-c.y;d=hyp(dx,dy);if(d>26){c.x+=dx/d*sp*dt;c.y+=dy/d*sp*dt;c.mv=1}else c.mv=0}
    c.cd-=dt;if(tg&&c.cd<=0){var rg=cs.melee?tg.sz+46:cs.rng;if(hyp(tg.x-c.x,tg.y-c.y)<rg){c.cd=st.aspd*1.45;var dm=st.dmg*.85;if(cs.melee)addFx({k:'swing',x:c.x,y:c.y,fx:(tg.x-c.x),fy:(tg.y-c.y),c:cs.col,l:.14});else addFx({k:'line',x1:c.x,y1:c.y,x2:tg.x,y2:tg.y,c:cs.col,l:.14,w:3});dmgMon(tg,dm)}}
    if(c.cls==='sifaci'){c.hcd-=dt;if(c.hcd<=0&&G.hp<S().maxhp*.75&&G.dead<=0){c.hcd=4;var hv=Math.round(S().maxhp*.12);G.hp=Math.min(S().maxhp,G.hp+hv);floatTxt(G.px,G.py-40,'+'+hv,'#5be39a');addFx({k:'ring',x:c.x,y:c.y,r:60,c:'#5be39a',l:.5})}}
    if(c.cls==='tank'){c.tcd=(c.tcd||0)-dt;if(c.tcd<=0){c.tcd=8;G.mons&&curMons().forEach(function(m){if(!m.dead&&hyp(m.x-c.x,m.y-c.y)<170){m.taunt=2.5;m.hit=2.5}})}}})}
function enterDgReq(id){var d=Y.DUNGEONS[id],pn=1+P.party.length;
  if(P.lv<d.lv){say(d.n+': en az seviye '+d.lv+' gerekir.','sys');return false}
  if(Y.rankOf(P.mp)<d.rk){say(d.n+': '+Y.RANKS[d.rk].n+' rütbesi gerekir. Maceracı Evi\'nde görev yapıp rütbe kazan.','sys');return false}
  if(pn<d.party){say(d.n+': en az '+d.party+' kişilik parti gerekir. Maceracı Evi\'nden parti kur ya da maceracı kirala.','sys');return false}return true}
function enterDg(id){var d=Y.DUNGEONS[id];var d=Y.DUNGEONS[id];
  if(!enterDgReq(id))return;
  if(!d.waves.length){say(d.n+' henüz hazır değil.','sys');return}
  G.saveW={x:G.px,y:G.py};G.mode='dungeon';G.gather=null;G.dg={id:id,pn:1+P.party.length,wave:-1,mons:[],done:false,wait:1.4,lv:d.lv+Math.max(0,Math.floor((P.lv-d.lv)/2)),ex:AW*TS/2,ey:AH*TS/2};
  G.px=AW*TS/2;G.py=(AH-2.5)*TS;G.fx=0;G.fy=-1;G.comp&&G.comp.forEach(function(c,i){c.x=G.px+(i-1)*40;c.y=G.py+20});G.hp=S().maxhp;say(d.n+' başladı!','sys')}
function dgWave(){var dg=G.dg,d=Y.DUNGEONS[dg.id],w=d.waves[dg.wave];if(!w)return;var add=function(t,c){for(var i=0;i<c;i++){var m=mkMon(t,dg.lv,(3+Math.random()*(AW-6))*TS,(2+Math.random()*4)*TS);m.sx=m.x;m.sy=m.y;m.hit=9;var sc=1+.5*(dg.pn-1);m.hp=m.max=Math.round(m.max*sc);m.dmg=Math.round(m.dmg*(1+.2*(dg.pn-1)));dg.mons.push(m)}};
  add(w.t,w.c);if(w.extra)add(w.extra.t,w.extra.c);say('Dalga '+(dg.wave+1)+'/'+d.waves.length+(w.t==='alpha'||w.t==='guardian'?' — BOSS!':''),'sys')}
function dgCheck(){var dg=G.dg;if(!dg||dg.done)return;if(dg.mons.every(function(m){return m.dead}))dg.wait=1.6}
function dgDone(){var dg=G.dg,d=Y.DUNGEONS[dg.id],r=d.reward;dg.done=true;qProg('dg',dg.id,1);addMP(r.mp||0);if(r.core)P.core+=r.core;P.done[dg.id]=(P.done[dg.id]||0)+1;P.gold+=r.gold;giveXp(Math.round(r.xp*(1+P.lv*.12)));if(r.fang)P.fang+=r.fang;if(r.crystal)P.crystal+=r.crystal;
  say(d.n+' fethedildi! +🪙'+r.gold+' +'+r.xp+' XP'+(r.fang?' +'+r.fang+' 🦷':'')+(r.crystal?' +'+r.crystal+' 💎':''),'sys');saveNow()}
function exitDg(){G.comp&&G.comp.forEach(function(c){c.x=G.saveW.x;c.y=G.saveW.y});G.mode='world';G.px=G.saveW.x;G.py=G.saveW.y;G.dg=null;G.hp=Math.min(S().maxhp,G.hp+Math.round(S().maxhp*.3))}

/* ---------- panel içerikleri ---------- */
function openPan(id){['p-bag','p-npc','p-chat','p-menu','p-map','p-x','p-soc'].forEach(function(x){var e=$(x);if(e)e.classList.toggle('on',x===id)});if(G)G.paused=!!id}
function closePan(){openPan(null)}
function bar(v,mx,c){return'<div class="bar" style="margin-top:2px"><i style="width:'+Math.min(100,Math.round(v/mx*100))+'%;background:'+c+'"></i></div>'}
function skDesc(s){var k=s.kind;return k==='aoe'?'Çevrene %'+Math.round(s.m*100)+' hasar'+(s.slow?', yavaşlatır':''):k==='aoeT'?'Hedefe %'+Math.round(s.m*100)+' alan hasarı':k==='chain'?s.hits+' hedefe zincir, %'+Math.round(s.m*100)+' hasar':k==='dash'?'Atıl'+(s.m?', %'+Math.round(s.m*100)+' hasar':''):k==='buff'?'Hasar +%'+Math.round(((s.dmgm||1.5)-1)*100)+' ('+Math.round(s.dur)+' sn)':k==='taunt'?'Düşmanları üstüne çeker':k==='guard'?'Hasar -%'+Math.round(s.red*100)+' ('+Math.round(s.dur)+' sn)':k==='line'?'Çizgi boyunca %'+Math.round(s.m*100)+' hasar':k==='heal'?'Canının %'+Math.round(s.amt*100)+'\'ini yeniler':k==='hot'?Math.round(s.dur)+' sn boyunca can yeniler':k==='strike'?'Hedefe ışınlanıp %'+Math.round(s.m*100)+' vurur':k==='dot'?'Zehir: sürekli hasar':k==='evade'?'Kısa süre görünmez':''}
function drawSkills(){ensureSl();$('npt').innerHTML='📖 Beceriler';var c=C(),pts=Y.skillPts(P),h='<p class="sub"><b>'+esc(c.n)+'</b> · Beceri puanı: <b>'+pts+'</b> (her seviye 1 puan). Çubukta 4 beceri taşırsın: 1-4 tuşları.</p>';
  c.sk.forEach(function(s0){var s=skScaled(s0),open=P.lv>=s0.lv,slot=P.sl.indexOf(s0.id);
    h+='<div class="it" style="opacity:'+(open?1:.5)+'"><span style="font-size:1.6rem">'+s0.ic+'</span><div class="t"><b>'+esc(s0.n)+'</b> · Rütbe '+s.rank+'/5'+(open?'':' · Seviye '+s0.lv+' gerekir')+'<br><small>'+skDesc(s)+' · '+s.cd.toFixed(1)+' sn'+(slot>=0?' · Slot '+(slot+1):'')+'</small></div>'+(open?'<div style="display:grid;gap:4px"><button class="btn" data-su="'+s0.id+'" '+(pts>0&&s.rank<5?'':'disabled')+' type="button">Yükselt</button><div style="display:flex;gap:3px">'+[1,2,3,4].map(function(n){return'<button class="btn alt" style="min-height:30px;padding:0 9px" data-ss="'+s0.id+':'+n+'" type="button">'+(slot===n-1?'<b>'+n+'</b>':n)+'</button>'}).join('')+'</div></div>':'')+'</div>'});
  $('npc').innerHTML=h;
  $('npc').querySelectorAll('[data-su]').forEach(function(b){b.onclick=function(){var id=b.dataset.su;if(Y.skillPts(P)<1)return;P.sr[id]=Math.min(5,Y.skRank(P,id)+1);saveNow();drawSkills();refreshBar()}});
  $('npc').querySelectorAll('[data-ss]').forEach(function(b){b.onclick=function(){var a=b.dataset.ss.split(':'),id=a[0],n=+a[1]-1,old=P.sl.indexOf(id);if(old>=0)P.sl[old]=P.sl[n];P.sl[n]=id;saveNow();drawSkills();refreshBar()}})}
function drawBag(){var c=C(),st=S(),h='<div class="it"><span style="font-size:1.8rem">'+c.ic+'</span><div class="t"><b>'+esc(P.nick)+'</b> · '+esc(c.n)+' · Seviye '+P.lv+'<br><small>Can '+st.maxhp+' · Hasar '+st.dmg+' · Zırh %'+Math.round(st.red*100)+'</small></div></div>';
  h+='<div class="it"><div class="t"><b>Aletler:</b> '+Y.TOOLS.pk.t[P.tl.pk]+' · '+Y.TOOLS.ax.t[P.tl.ax]+'</div></div>';
  h+='<div class="it"><div class="t">'+wLine(P.cls,P.wt||0)+' kuşanıldı · Beceri puanı: <b>'+Y.skillPts(P)+'</b></div><button class="btn" id="bsk" type="button">Beceriler (K)</button></div>';
  h+='<div class="it"><div class="t">⚔️ Silah <b>+'+P.wl+'</b> · 🛡️ Zırh <b>+'+P.al+'</b><br><small>Demirci kasabadadır.</small></div><div>🪙 '+P.gold+'</div></div>';
  h+=Object.keys(Y.MATS).filter(function(k){return P[k]>0||k==='wood'||k==='stone'}).map(function(k){var m=Y.MATS[k];return'<div class="it"><span style="font-size:1.3rem">'+m.ic+'</span><div class="t">'+m.n+'</div><b>'+P[k]+'</b></div>'}).join('');
  h+=Object.keys(Y.PROF).map(function(k){var p=P.pf[k];return'<div class="it"><div class="t">'+Y.PROF[k]+' <b>'+p.l+'</b>'+bar(p.x,Y.profNeed(p.l),'#5be39a')+'</div></div>'}).join('');
  h+='<div class="it"><div class="t"><small>Beceriler: '+c.sk.map(function(s){return s.ic+' '+s.n}).join(' · ')+'</small></div></div>';$('bagc').innerHTML=h;if($('bsk'))$('bsk').onclick=function(){drawSkills();openPan('p-npc')}}
function costTxt(c){var t=(c.wood?'🪵'+c.wood+' ':'')+(c.stone?'🪨'+c.stone+' ':'');if(c.ik)t+=Y.MATS[c.ik].ic+c.ic+' ';return t+'🪙'+c.gold}
function can(c){return P.wood>=c.wood&&P.stone>=c.stone&&P.gold>=c.gold&&(!c.ik||P[c.ik]>=c.ic)}
/* ---- TAKAS: bugün bot ortakla; çok oyunculu diyarda aynı pencere gerçek oyuncuyla çalışır ---- */
var TR={o:{},w:{},msg:''};
function trReset(){TR={o:{},w:{},msg:''}}
function itName(k){var a=k.split(':');if(a[0]==='m')return Y.MATS[a[1]].n;if(a[0]==='r')return RUNES[a[1]].n;return Y.WEAPONS[a[1]][+a[2]].n}
function itIc(k){var a=k.split(':');if(a[0]==='m')return Y.MATS[a[1]].ic;if(a[0]==='r')return YA.ico('r_'+a[1],26);return YA.ico(CIC[a[1]],26)}
var CIC={savasci:'sword',tank:'shield',buyucu:'orb',sifaci:'cross',suikastci:'dagger'};
function itVal(k){var a=k.split(':');if(a[0]==='m')return Y.MATS[a[1]].v;if(a[0]==='r')return 120;var w=Y.WEAPONS[a[1]][+a[2]],v=0;for(var x in w.c){v+=x==='gold'?w.c[x]:Y.MATS[x].v*w.c[x]}return Math.round(v*.8)}
function myInv(){var l=[];Object.keys(Y.MATS).forEach(function(k){if(k!=='wood'&&k!=='stone'&&P[k]>0||((k==='wood'||k==='stone')&&P[k]>0))l.push({k:'m:'+k,q:P[k]})});Object.keys(P.rn||{}).forEach(function(k){if(P.rn[k]>0)l.push({k:'r:'+k,q:P.rn[k]})});Object.keys(P.ow||{}).forEach(function(k){var a=k.split(':');if(P.ow[k]&&!(a[0]===P.cls&&+a[1]===(P.wt||0)))l.push({k:'w:'+a[0]+':'+a[1],q:1})});return l}
function botStock(){var slot=Math.floor(Date.now()/6e5),r=function(i){return Y.hash(slot,i,501)},l=[],ks=['copper','iron','silver','goldore','mithril','i_copper','i_iron','i_silver','i_gold','i_mithril','fang','crystal','core'];
  for(var i=0;i<7;i++){var k=ks[Math.floor(r(i)*ks.length)];if(!l.some(function(x){return x.k==='m:'+k}))l.push({k:'m:'+k,q:1+Math.floor(r(i+9)*(Y.MATS[k].v>50?2:8))})}
  var rk=Object.keys(RUNES);l.push({k:'r:'+rk[Math.floor(r(30)*rk.length)],q:1});
  var cl=Object.keys(Y.CLASSES),wc=cl[Math.floor(r(31)*cl.length)],wt=Math.min(8,Math.max(1,Math.floor(P.lv/6)+Math.floor(r(32)*3)));l.push({k:'w:'+wc+':'+wt,q:1});return l}
function trSum(m){var v=0;for(var k in m)v+=itVal(k)*m[k];return v}
function chipRow(k,have,sel,side){return'<div class="it"><span style="font-size:1.2rem">'+itIc(k)+'</span><div class="t">'+esc(itName(k))+' <small>×'+have+' · 🪙'+itVal(k)+'/adet</small></div><div style="display:flex;gap:4px;align-items:center"><button class="btn alt" style="min-height:30px;padding:0 11px" data-tm="'+side+'|'+k+'" type="button">−</button><b style="min-width:20px;text-align:center">'+sel+'</b><button class="btn alt" style="min-height:30px;padding:0 11px" data-tp="'+side+'|'+k+'|'+have+'" type="button">+</button></div></div>'}
function drawTrade(){var inv=myInv(),stock=botStock(),vo=trSum(TR.o),vw=trSum(TR.w),fair=vw===0?0:vo/vw,ok=vo>0&&vw>0&&vo>=vw*1.15;
  var h='<p class="sub">Altın takasa girmez; değerli madenler, külçeler, rünler ve silahlar takas edilir. Oyuncularla takas için bir oyuncuya dokun → Takas teklif et (altın da dahil). Burada Kervan Takasçısı ile pratik yapabilirsin.</p>';
  h+='<div class="it"><div class="t"><b>Senin teklifin</b> · değer 🪙'+vo+'</div></div>';
  if(inv.length)inv.forEach(function(x){h+=chipRow(x.k,x.q,TR.o[x.k]||0,'o')});else h+='<p class="sub">Takas edilecek eşyan yok.</p>';
  h+='<div class="it"><div class="t"><b>Kervan Takasçısı\'ndan istediğin</b> · değer 🪙'+vw+'</div></div>';
  stock.forEach(function(x){h+=chipRow(x.k,x.q,TR.w[x.k]||0,'w')});
  h+='<div class="bar" style="margin:8px 0 2px"><i style="width:'+Math.min(100,fair*100/1.15)+'%;background:'+(ok?'#5be39a':'#ff9d3d')+'"></i></div><small>'+(vw?'Adil oran: teklifin değeri, istediğinin en az %115\'i olmalı. Şu an %'+Math.round(fair*100):'Önce bir şey iste ve teklif et')+'</small>';
  if(TR.msg)h+='<div class="err" style="color:#ffd23f">'+TR.msg+'</div>';
  h+='<div class="row"><button class="btn" id="tgo" '+(ok?'':'disabled')+' type="button">Takası onayla</button><button class="btn alt" id="tclr" type="button">Temizle</button></div>';
  $('npc').innerHTML=h;
  $('npc').querySelectorAll('[data-tp]').forEach(function(b){b.onclick=function(){var a=b.dataset.tp.split('|'),m=a[0]==='o'?TR.o:TR.w,k=a[1],mx=+a[2];m[k]=Math.min(mx,(m[k]||0)+1);TR.msg='';drawTrade()}});
  $('npc').querySelectorAll('[data-tm]').forEach(function(b){b.onclick=function(){var a=b.dataset.tm.split('|'),m=a[0]==='o'?TR.o:TR.w,k=a[1];if(m[k]>0){m[k]--;if(!m[k])delete m[k]}TR.msg='';drawTrade()}});
  $('tclr').onclick=function(){trReset();drawTrade()};
  $('tgo').onclick=function(){var inv2=myInv(),ok2=true;for(var k in TR.o){var f=inv2.filter(function(x){return x.k===k})[0];if(!f||f.q<TR.o[k])ok2=false}
    if(!ok2||trSum(TR.o)<trSum(TR.w)*1.15){TR.msg='Teklif geçersiz.';drawTrade();return}
    for(var k1 in TR.o){var a=k1.split(':');if(a[0]==='m')P[a[1]]-=TR.o[k1];else if(a[0]==='r')P.rn[a[1]]-=TR.o[k1];else delete P.ow[a[1]+':'+a[2]]}
    for(var k2 in TR.w){var b=k2.split(':');if(b[0]==='m')P[b[1]]=(P[b[1]]||0)+TR.w[k2];else if(b[0]==='r')P.rn[b[1]]=(P.rn[b[1]]||0)+TR.w[k2];else P.ow[b[1]+':'+b[2]]=true}
    say('Takas tamamlandı.','sys');saveNow();TR={o:{},w:{},msg:'Takas tamamlandı! Kervan yola devam ediyor.'};drawTrade()}}
var gTab=0;
function drawGuild(){ensureQ();var rk=Y.rankOf(P.mp),R=Y.RANKS[rk],nx=Y.RANKS[rk+1],h='<div class="row" style="margin:0 0 8px">'+['Görevler','Rütbe','Parti'].map(function(t,i){return'<button class="btn'+(i===gTab?'':' alt')+'" data-gt="'+i+'" style="min-height:36px;padding:0 14px" type="button">'+t+'</button>'}).join('')+'</div>';
  h+='<div class="it"><div class="t"><b style="color:'+R.c+'">'+R.n+' Maceracı</b> · '+P.mp+' MP'+(nx?'<div class="bar" style="margin-top:3px"><i style="width:'+Math.min(100,(P.mp-R.mp)/(nx.mp-R.mp)*100)+'%;background:'+R.c+'"></i></div><small>Sonraki: '+nx.n+' ('+nx.mp+' MP)</small>':'<br><small>En üst rütbe</small>')+'</div></div>';
  if(gTab===0){h+='<p class="sub">Günlük görevler her gün yenilenir. En fazla 3 görev alabilirsin.</p>';var act=P.q.list.filter(function(q){return q.st===1}).length;
    P.q.list.forEach(function(q,i){var done=q.have>=q.n;h+='<div class="it"><div class="t"><b>'+qTxt(q)+'</b><br><small>🪙'+q.gold+' · '+q.xp+' XP · '+q.mp+' MP'+(q.st===1?' · '+q.have+'/'+q.n:'')+'</small></div>'+(q.st===0?'<button class="btn" data-qa="'+i+'" '+(act>=3?'disabled':'')+' type="button">Kabul</button>':q.st===1?'<button class="btn" data-qc="'+i+'" '+(done?'':'disabled')+' type="button">'+(done?'Teslim':'Sürüyor')+'</button>':'<small>Bitti</small>')+'</div>'})}
  else if(gTab===1){h+='<p class="sub">Zindanlar rütbe, seviye ve parti büyüklüğü ister.</p>';Object.keys(Y.DUNGEONS).forEach(function(id){var d=Y.DUNGEONS[id],ok=rk>=d.rk&&P.lv>=d.lv;h+='<div class="it" style="opacity:'+(ok?1:.6)+'"><span style="font-size:1.4rem">'+d.ic+'</span><div class="t"><b>'+d.n+'</b><br><small>'+Y.RANKS[d.rk].n+' rütbe · Seviye '+d.lv+' · '+d.party+' kişi<br>'+d.desc+'</small></div><small>'+(ok?'Açık':'Kilitli')+'</small></div>'})}
  else{h+='<p class="sub">Partin: sen + kiralık maceracılar. Gerçek oyuncularla parti için bir oyuncuya dokun ya da 👥 menüsünü aç (parti XP bonusu, sohbet, pusula). En fazla 4 kişi.</p><div class="it"><div class="t"><b>'+esc(P.nick)+'</b> · '+esc(C().n)+' · Sv '+P.lv+'</div><small>Lider</small></div>';
    P.party.forEach(function(c,i){h+='<div class="it"><div class="t"><b>Kiralık '+Y.CLASSES[c.cls].n+'</b> · Sv '+P.lv+'</div><button class="btn alt" data-pd="'+i+'" type="button">Gönder</button></div>'});
    var fee=40*P.lv;if(P.party.length<3){h+='<div class="it"><div class="t"><b>Maceracı kirala</b> · 🪙 '+fee+'<br><small>Seviyene göre savaşır; Şifacı seni iyileştirir, Muhafız düşmanı çeker.</small></div></div><div class="cls">'+Object.keys(Y.CLASSES).map(function(k){var c=Y.CLASSES[k];return'<button type="button" data-ph="'+k+'" '+(P.gold<fee?'disabled':'')+'><span class="ic">'+c.ic+'</span><b>'+c.n+'</b></button>'}).join('')+'</div>'}}
  $('npc').innerHTML=h;
  $('npc').querySelectorAll('[data-gt]').forEach(function(b){b.onclick=function(){gTab=+b.dataset.gt;drawGuild()}});
  $('npc').querySelectorAll('[data-qa]').forEach(function(b){b.onclick=function(){var q=P.q.list[+b.dataset.qa];q.st=1;q.have=0;saveNow();drawGuild()}});
  $('npc').querySelectorAll('[data-qc]').forEach(function(b){b.onclick=function(){var q=P.q.list[+b.dataset.qc];if(q.have<q.n)return;q.st=2;P.gold+=q.gold;giveXp(Math.round(q.xp*(1+P.lv*.2)));addMP(q.mp);say('Görev ödülü: 🪙'+q.gold+' · '+q.xp+' XP','sys');saveNow();drawGuild()}});
  $('npc').querySelectorAll('[data-ph]').forEach(function(b){b.onclick=function(){var fee=40*P.lv;if(P.gold<fee||P.party.length>=3)return;P.gold-=fee;P.party.push({cls:b.dataset.ph});mkComps();saveNow();drawGuild()}});
  $('npc').querySelectorAll('[data-pd]').forEach(function(b){b.onclick=function(){P.party.splice(+b.dataset.pd,1);mkComps();saveNow();drawGuild()}})}
function openNpc(id){if(id==='tailor'){openWardrobe(true);return}if(id==='shop'){openPan('p-npc');$('npt').innerHTML='🛍 Kahraman Mağazası';drawHeroShop();return}openPan('p-npc');if(id==='guild'){$('npt').innerHTML='🏛 Maceracı Evi';drawGuild();return}if(id==='trade'){$('npt').innerHTML='⚖ Kervan Takasçısı';trReset();drawTrade();return}if(id==='smelt'){$('npt').innerHTML='🔥 Eritme Ocağı';drawSmelt();return}if(id==='rune'){$('npt').innerHTML='🔮 Rün Ustası';drawRune();return}if(id==='smith'){$('npt').innerHTML='🔨 Demirci';drawSmith()}else{$('npt').innerHTML='🧺 Tüccar';drawTrader()}}
var UCH=[1,1,1,1,1,1,1,.85,.75,.65,.55,.45,.35];
function wLine(cls,t){var w=Y.WEAPONS[cls][t];return'<span style="color:'+Y.RARITY[w.rar].c+'"><b>'+esc(w.n)+'</b></span>'}
function drawSmith(){var h='<div class="it"><div class="t"><b>Geliştirme</b><br><small>+7 ve üzeri başarısız olabilir; +9 ve üzeri başarısızlıkta seviye düşer. 1 Kristal koruma verir.</small></div></div>';
  [['w','Silah',P.wl],['a','Zırh',P.al]].forEach(function(r){var n=r[2]+1,c=Y.upCost(r[0],n),ok=can(c)&&r[2]<12,ch=UCH[n]||0;
    h+='<div class="it"><div class="t"><b>'+(r[0]==='w'?'⚔️':'🛡️')+' '+r[1]+' +'+r[2]+'</b> → +'+n+(r[2]<12?' · %'+Math.round(ch*100):'')+'<br><small>'+(r[2]>=12?'En üst seviye':costTxt(c))+'</small></div><div style="display:grid;gap:4px"><button class="btn" data-up="'+r[0]+'" '+(ok?'':'disabled')+' type="button">Geliştir</button>'+(n>=9&&r[2]<12?'<button class="btn alt" data-up="'+r[0]+'" data-pr="1" '+(ok&&P.crystal>0?'':'disabled')+' type="button">Korumalı (1💎)</button>':'')+'</div></div>'});
  h+='<div class="it"><div class="t"><b>Silah Dövme · '+esc(C().n)+'</b><br><small>Her sınıfın 9 kademe silahı var. Üst kademeler külçe ve Efsane Çekirdeği ister.</small></div></div>';
  Y.WEAPONS[P.cls].forEach(function(w,t){var own=t===0||P.ow[P.cls+':'+t],eq=(P.wt||0)===t,cost=w.c,ok=own||(cost&&P.lv>=w.lv&&Object.keys(cost).every(function(k){return(k==='gold'?P.gold:P[k])>=cost[k]})),tx='';
    if(cost)Object.keys(cost).forEach(function(k){tx+=(k==='gold'?'🪙':Y.MATS[k].ic)+cost[k]+' '});
    h+='<div class="it"><div class="t">'+wLine(P.cls,t)+' <small>('+Y.RARITY[w.rar].n+')</small><br><small>Hasar ×'+w.m+' · Seviye '+w.lv+(own?'':' · '+tx)+'</small></div><button class="btn'+(eq?' alt':'')+'" data-wp="'+t+'" '+((eq||!ok)?'disabled':'')+' type="button">'+(eq?'Kuşanıldı':own?'Kuşan':'Yap')+'</button></div>'});
  h+='<div class="it"><div class="t"><b>Aletler</b><br><small>Kazma ve balta kademesi madeni ve ağacı açar, kazmayı hızlandırır. Her kademe üst düzey damarlar için gerekli.</small></div></div>';
  ['pk','ax'].forEach(function(k){var T=Y.TOOLS[k],cur=P.tl[k],nx=cur+1,c=T.c[nx],tx='',ok=false;
    if(c){Object.keys(c).forEach(function(m){tx+=(m==='gold'?'🪙':Y.MATS[m].ic)+c[m]+' '});ok=P[(k==='pk'?'mine':'wood')==='mine'?'pf':'pf'][k==='pk'?'mine':'wood'].l>=T.lv[nx]&&Object.keys(c).every(function(m){return(m==='gold'?P.gold:P[m])>=c[m]})}
    h+='<div class="it"><div class="t"><b style="color:#ffd23f">'+T.t[cur]+'</b>'+(c?' → '+T.t[nx]+'<br><small>'+Y.PROF[k==='pk'?'mine':'wood']+' Sv '+T.lv[nx]+' · '+tx+'</small>':'<br><small>En üst kademe</small>')+'</div>'+(c?'<button class="btn" data-tl="'+k+'" '+(ok?'':'disabled')+' type="button">Yap</button>':'')+'</div>'});
  $('npc').innerHTML=h;
  $('npc').querySelectorAll('[data-tl]').forEach(function(b){b.onclick=function(){var k=b.dataset.tl,T=Y.TOOLS[k],nx=P.tl[k]+1,c=T.c[nx];if(!c)return;for(var m in c)if((m==='gold'?P.gold:P[m])<c[m])return;if(P.pf[k==='pk'?'mine':'wood'].l<T.lv[nx])return;for(var m2 in c){if(m2==='gold')P.gold-=c[m2];else P[m2]-=c[m2]}P.tl[k]=nx;say(T.t[nx]+' yapıldı!','sys');addFx({k:'ring',x:G.px,y:G.py,r:90,c:'#ffd23f',l:.6});saveNow();drawSmith()}});
  $('npc').querySelectorAll('[data-up]').forEach(function(b){b.onclick=function(){var k=b.dataset.up,n=(k==='w'?P.wl:P.al)+1,c=Y.upCost(k,n),pr=!!b.dataset.pr;if(!can(c)||(pr&&P.crystal<1))return;P.wood-=c.wood;P.stone-=c.stone;if(c.ik)P[c.ik]-=c.ic;P.gold-=c.gold;if(pr)P.crystal--;
      if(Math.random()<(UCH[n]||1)){if(k==='w')P.wl++;else P.al++;say((k==='w'?'Silahın':'Zırhın')+' +'+n+' oldu!','sys');addFx({k:'ring',x:G.px,y:G.py,r:90,c:'#ffd23f',l:.6})}else{if(n>=9&&!pr){if(k==='w')P.wl--;else P.al--;say('Geliştirme başarısız! Seviye düştü.','sys')}else say('Geliştirme başarısız. Malzemeler yandı.','sys')}saveNow();drawSmith()}});
  $('npc').querySelectorAll('[data-wp]').forEach(function(b){b.onclick=function(){var t=+b.dataset.wp,w=Y.WEAPONS[P.cls][t];if(t===0||P.ow[P.cls+':'+t]){P.wt=t;say(w.n+' kuşanıldı.','sys')}else{var c=w.c;if(!c||P.lv<w.lv)return;for(var k in c)if((k==='gold'?P.gold:P[k])<c[k])return;for(var k2 in c){if(k2==='gold')P.gold-=c[k2];else P[k2]-=c[k2]}P.ow[P.cls+':'+t]=true;P.wt=t;say(w.n+' dövüldü ve kuşanıldı!','sys');qProg('smelt','any',0)}saveNow();drawSmith()}})}
function drawSmelt(){var h='<p class="sub">2 cevher + 1 odun = 1 külçe. Üst seviye silah ve zırh geliştirmeleri külçe ister. Değerli damarlar için yüksek Madencilik seviyesi gerekir.</p>';
  Object.keys(Y.SMELT).forEach(function(o){var i=Y.SMELT[o],m=Y.MATS[o],t=Y.MATS[i],mx=Math.min(Math.floor(P[o]/2),P.wood);
    h+='<div class="it"><span style="font-size:1.3rem">'+m.ic+'→'+t.ic+'</span><div class="t"><b>'+t.n+'</b> · elinde '+P[i]+'<br><small>'+m.n+' '+P[o]+' · Odun '+P.wood+'</small></div><div style="display:grid;gap:4px"><button class="btn" data-m="'+o+'" data-n="1" '+(mx>0?'':'disabled')+' type="button">Erit</button><button class="btn alt" data-m="'+o+'" data-n="'+mx+'" '+(mx>1?'':'disabled')+' type="button">Hepsi ('+mx+')</button></div></div>'});
  $('npc').innerHTML=h;$('npc').querySelectorAll('[data-m]').forEach(function(b){b.onclick=function(){var o=b.dataset.m,n=+b.dataset.n;if(n<1||P[o]<2*n||P.wood<n)return;P[o]-=2*n;P.wood-=n;P[Y.SMELT[o]]+=n;qProg('smelt','any',n);giveProf('mine',n);say(n+' '+Y.MATS[Y.SMELT[o]].n+' eritildi.','sys');saveNow();drawSmelt()}})}
function rI(k){try{var x=YX.rar('sp:'+YL.PRESETS[k].shop);return x}catch(e){return 0}}
function rname(k){var x=rI(k);if(x>=5)return /^yaxest/.test(YL.PRESETS[k].shop)?'Kurucu':'Efsanevi+';return YX.RN?YX.RN[x]:''}
function rcol(k){var x=rI(k);if(x>=5)return /^yaxest/.test(YL.PRESETS[k].shop)?'#ff5b6e':'#ffb02e';return YX.RCOL?YX.RCOL[x]:'#fff'}
function drawHeroShop(){var ks=Object.keys(YL.PRESETS).filter(function(k){return YL.PRESETS[k].shop}).sort(function(a,b){return prePrice(a)-prePrice(b)}),coins=0;try{coins=YX.coins()}catch(e){}
  var h='<p class="sub">Özel kahramanlar jetonla alınır. Satın aldığın kahraman Terzi\'de seçilebilir ve sana özel kalır. Jetonların: <b>🪙 '+coins+'</b></p>';
  ks.forEach(function(k){var p=YL.PRESETS[k],own=preOwn(k);h+='<div class="it"><canvas width="60" height="80" data-hc="'+k+'" style="background:rgba(255,255,255,.05);border-radius:10px"></canvas><div class="t"><b style="color:'+rcol(k)+'">'+p.n+'</b> <small style="opacity:.9;font-weight:800;color:'+rcol(k)+'">'+rname(k)+'</small><br><small>'+p.d+'</small></div>'+(own?'<button class="btn alt" disabled type="button">Sahipsin ✓</button>':'<button class="btn" data-bk="'+k+'" type="button">🪙 '+prePrice(k)+'</button>')+'</div>'});
  h+='<p class="sub" id="hsmsg"></p>';$('npc').innerHTML=h;if(window.YX3)try{YX3.shopChests($('npc'))}catch(e){}
  $('npc').querySelectorAll('[data-hc]').forEach(function(cv){var c=cv.getContext('2d');YL.hero(c,30,74,YL.PRESETS[cv.dataset.hc].ap,0,false,1.25)});
  $('npc').querySelectorAll('[data-bk]').forEach(function(b){b.onclick=function(){var k=b.dataset.bk,r;try{r=YX.buy('sp:'+YL.PRESETS[k].shop)}catch(e){r={ok:false,r:'x'}}
    if(r&&r.ok){drawHeroShop();var m=$('hsmsg');if(m)m.textContent=YL.PRESETS[k].n+' artık senin! Terzi\'den giyebilirsin.'}
    else{var m2=$('hsmsg');if(m2)m2.textContent=r&&r.r==='coin'?'Jetonun yetmiyor ('+r.need+' jeton eksik). Jetonlar Yaxest Games\'teki oyunlardan kazanılır.':'Satın alınamadı.'}}})}
function drawTrader(){var h='',tot=0;Object.keys(Y.MATS).forEach(function(k){var m=Y.MATS[k],n=P[k]||0;if(!m.ing)tot+=n*m.v;if(!n&&k!=='wood'&&k!=='stone')return;h+='<div class="it"><span style="font-size:1.3rem">'+m.ic+'</span><div class="t">'+m.n+' × '+n+'<br><small>Tanesi 🪙'+m.v+'</small></div><button class="btn alt" data-s="'+k+'" '+(n?'':'disabled')+' type="button">Sat</button></div>'});
  h+='<div class="row"><button class="btn" id="sall" '+(tot?'':'disabled')+' type="button">Cevher/ganimet hepsini sat (🪙'+tot+')</button></div><p class="sub">Külçeler "Hepsini sat"a dahil değil; geliştirme için sakla.</p>';$('npc').innerHTML=h;
  $('npc').querySelectorAll('[data-s]').forEach(function(b){b.onclick=function(){var k=b.dataset.s;P.gold+=P[k]*Y.MATS[k].v;P[k]=0;saveNow();drawTrader()}});
  if($('sall'))$('sall').onclick=function(){Object.keys(Y.MATS).forEach(function(k){if(Y.MATS[k].ing)return;P.gold+=P[k]*Y.MATS[k].v;P[k]=0});saveNow();drawTrader()}}
function drawRune(){P.rn=P.rn||{};var h='<p class="sub">Rün dövüp silahına veya zırhına tak. Silah ve zırh için birer yuva var; yeni rün eskisinin yerine geçer.</p>';
  Object.keys(RUNES).forEach(function(k){var r=RUNES[k],c=r.c,have=P.rn[k]||0,eq=(r.slot==='w'?P.sw:P.sa)===k,ok=true,tx=[];Object.keys(Y.MATS).concat(['gold']).forEach(function(m){if(c[m]){tx.push(c[m]+(m==='gold'?'🪙':Y.MATS[m].ic));if(P[m]<c[m])ok=false}});
    h+='<div class="it"><span style="font-size:1.6rem">'+YA.ico('r_'+k)+'</span><div class="t"><b>'+r.n+'</b> · '+(r.slot==='w'?'Silah':'Zırh')+'<br><small>'+r.d+'<br>'+tx.join(' ')+' · Elinde: '+have+'</small></div><div style="display:grid;gap:4px"><button class="btn" data-f="'+k+'" '+(ok?'':'disabled')+' type="button">Döv</button><button class="btn alt" data-e="'+k+'" '+(eq||!have?'disabled':'')+' type="button">'+(eq?'Takılı':'Tak')+'</button></div></div>'});
  $('npc').innerHTML=h;
  $('npc').querySelectorAll('[data-f]').forEach(function(b){b.onclick=function(){var k=b.dataset.f,c=RUNES[k].c;for(var m in c)P[m]-=c[m];P.rn[k]=(P.rn[k]||0)+1;say(RUNES[k].n+' dövüldü!','sys');saveNow();drawRune()}});
  $('npc').querySelectorAll('[data-e]').forEach(function(b){b.onclick=function(){var k=b.dataset.e,r=RUNES[k];P.rn[k]--;var old=r.slot==='w'?P.sw:P.sa;if(old)P.rn[old]=(P.rn[old]||0)+1;if(r.slot==='w')P.sw=k;else P.sa=k;say(r.n+' takıldı.','sys');saveNow();drawRune()}})}
var chatTab=0;
function drawChat(){var tabs=['Sistem','Dünya','Yerel','Klan','Parti'];$('ctabs').innerHTML=tabs.map(function(t,i){var u=window.YNet&&i>0&&i!==chatTab?YNet.unread(['','w','l','k','p'][i]):0;return'<button type="button" data-i="'+i+'" aria-pressed="'+(i===chatTab)+'">'+t+(u?'<i class="sbd">'+u+'</i>':'')+'</button>'}).join('');
  $('ctabs').querySelectorAll('button').forEach(function(b){b.onclick=function(){chatTab=+b.dataset.i;drawChat()}});
  $('cmsgs').innerHTML=chatTab===0?G.sys.map(function(l){return'<div>'+esc(l)+'</div>'}).join(''):(window.YNet&&YNet.chatTab(chatTab)||'<div style="color:var(--mute)">Bu kanal çok oyunculu diyar açılınca çalışacak.</div>');if(window.YNet)YNet.chatBind($('cmsgs'));
  $('cnote').textContent=chatTab===0?'':'Sohbet kuralları: hazır cümleler + filtreli yazı, şikâyet ve engelleme. Sesli sohbet ileride.'}

/* ---------- girdi ---------- */
var keyMap={w:'u',arrowup:'u',s:'d',arrowdown:'d',a:'l',arrowleft:'l',d:'r',arrowright:'r'};
addEventListener('keydown',function(e){if(G&&e.key.toLowerCase()==='m'){if($('p-map').classList.contains('on'))closePan();else if(G.mode==='world'&&!G.paused){drawMap();openPan('p-map')}return}if(!G||G.paused&&e.key!=='Escape')return;var k=e.key.toLowerCase();
  if(k==='shift'){G.keys.sh=1}else if(keyMap[k]){G.keys[keyMap[k]]=1;e.preventDefault()}else if(k===' '){G.hold=true;e.preventDefault()}else if(k==='1')cast(0);else if(k==='2')cast(1);else if(k==='3')cast(2);else if(k==='4')cast(3);else if(k==='k'){drawSkills();openPan('p-npc')}else if(k==='e'||k==='f')interact();
  else if(k==='i'){drawBag();openPan('p-bag')}else if(k==='enter'){drawChat();openPan('p-chat')}else if(k==='escape'){G.paused?closePan():openPan('p-menu')}});
addEventListener('keyup',function(e){if(!G)return;var k=e.key.toLowerCase();if(k==='shift')G.keys.sh=0;if(keyMap[k])G.keys[keyMap[k]]=0;if(k===' ')G.hold=false});
function refreshBar(){ensureSl();[1,2,3,4].forEach(function(n){var s=skAt(n-1),b=$('b'+n);b.innerHTML=(s?s.ic:'')+'<small>'+n+'</small><i class="cd"></i>';b.style.opacity=s?1:.35})}
function setupHud(){var c=C();if(!$('zn')){var zn=document.createElement('div');zn.id='zn';zn.style.cssText='position:absolute;top:10px;left:50%;transform:translateX(-50%);padding:5px 14px;border-radius:999px;font-weight:800;font-size:.8rem;background:rgba(0,0,0,.55);border:1.5px solid;pointer-events:none;display:none;white-space:nowrap';$('hud').appendChild(zn)}$('b0').innerHTML=c.ic;
  refreshBar();
  setAv();$('hn').textContent=P.nick;
  var jy=$('joy'),jk=$('jk'),pid=null;
  function jm(e){var r=jy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,d=hyp(dx,dy),m=52;if(d>m){dx=dx/d*m;dy=dy/d*m}jk.style.transform='translate('+dx+'px,'+dy+'px)';var n=hyp(dx,dy)/m;G.jx=n>.15?dx/m:0;G.jy=n>.15?dy/m:0;G.jr=n}
  jy.onpointerdown=function(e){pid=e.pointerId;try{jy.setPointerCapture(pid)}catch(x){}jm(e);e.preventDefault()};jy.onpointermove=function(e){if(e.pointerId===pid)jm(e)};
  var jend=function(e){if(e.pointerId!==pid)return;pid=null;jk.style.transform='';if(G){G.jx=0;G.jy=0}};jy.onpointerup=jend;jy.onpointercancel=jend;
  var b0=$('b0');b0.onpointerdown=function(e){G.hold=true;attack();e.preventDefault()};b0.onpointerup=b0.onpointercancel=b0.onpointerleave=function(){if(G)G.hold=false};
  [1,2,3,4].forEach(function(n){$('b'+n).onpointerdown=function(e){cast(n-1);e.preventDefault()}});$('bi').onpointerdown=function(e){interact();e.preventDefault()}}
$('mm').onclick=function(){if(G&&G.mode==='world'&&!G.paused){drawMap();openPan('p-map')}};$('ibag').onclick=function(){if(!G)return;drawBag();openPan('p-bag')};$('ichat').onclick=function(){if(!G)return;drawChat();openPan('p-chat')};$('imenu').onclick=function(){if(G)openPan('p-menu')};
document.querySelectorAll('[data-close]').forEach(function(b){b.onclick=closePan});
$('mfs').onclick=function(){if(!fsOk()){showIos(true);closePan();return}try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen()}catch(e){}};
$('mchar').onclick=function(){closePan();leaveGame()};
$('dtown').onclick=function(){respawn('town')};$('dhere').onclick=function(){respawn('here')};$('gf').onsubmit=function(ev){ev.preventDefault();gate()};$('gt1').onclick=function(){gMode(0)};$('gt2').onclick=function(){gMode(1)};$('cmk').onclick=mkChar;$('wdok').onclick=function(){wdClose(true)};$('wdx').onclick=function(){wdClose(false)};$('cout').onclick=function(){YXAcct.signOut();show('s-gate')};

/* ---------- güncelleme ---------- */
function update(dt){G.t+=dt;if(G.swT>0)G.swT-=dt;var st=S(),c=C();
  if(G.dead>0)return;if(window.YX2)try{YX2.tick(dt)}catch(e){}if(window.YNet)try{YNet.tick(dt)}catch(e){}
  for(var i=0;i<4;i++)if(G.cd[i]>0)G.cd[i]-=dt;if(G.atkCd>0)G.atkCd-=dt;if(G.buff>0)G.buff-=dt;if(G.guard>0)G.guard-=dt;if(G.evade>0)G.evade-=dt;
  if(G.hot>0){G.hot-=dt;G.hotT+=dt;if(G.hotT>=1){G.hotT=0;G.hp=Math.min(st.maxhp,G.hp+st.maxhp*G.hotAmt)}}
  if(st.regen&&G.hp<st.maxhp)G.hp=Math.min(st.maxhp,G.hp+st.maxhp*st.regen*dt);
  var inTown=inTownF();
  if(G.hp<st.maxhp&&(inTown||G.t-G.lastHurt>6))G.hp=Math.min(st.maxhp,G.hp+st.maxhp*(inTown?.04:.01)*dt);
  var mx=(G.keys.r?1:0)-(G.keys.l?1:0)+G.jx,my=(G.keys.d?1:0)-(G.keys.u?1:0)+G.jy,ml=hyp(mx,my);
  if(ml>1){mx/=ml;my/=ml}
  if(ml>.1){G.fx=mx/(ml>1?1:ml)*(ml>1?1:1);var fl=hyp(mx,my)||1;G.fx=mx/fl;G.fy=my/fl;G.gather=null;var wantS=(G.keys.sh||G.jr>.93)&&!G.exh&&G.sta>0,sp=st.spd*(G.evade>0?1.5:1)*(wantS?1.45:1);if(wantS){G.sta=Math.max(0,G.sta-22*dt);G.stT=.9;if(G.sta<=0)G.exh=1}moveH(mx*sp*dt,my*sp*dt)}
  if(G.stT>0)G.stT-=dt;else if(G.sta<100){G.sta=Math.min(100,G.sta+(ml>.1?14:26)*dt);if(G.exh&&G.sta>=30)G.exh=0}
  if(G.hold)attack();
  if(G.gather){G.gather.t+=dt;if(G.gather.t>=G.gather.need)gatherDone()}
  compUpdate(dt);
  if(G.mode==='world'){worldMons(dt);G.vill.forEach(function(v){v.wt-=dt;if(v.wt<=0){v.wt=1+Math.random()*3;var a=Math.random()*6.28;v.wx=Math.random()<.4?0:Math.cos(a);v.wy=v.wx?Math.sin(a):0}var nx=v.x+v.wx*28*dt,ny=v.y+v.wy*28*dt;if(hyp(nx-v.hx,ny-v.hy)<130){v.x=nx;v.y=ny}})}else dgUpdate(dt);
  var list=curMons();for(var k=0;k<list.length;k++)monAi(list[k],dt);
  if(G.mode==='world'){var pz=pvpAt(G.px,G.py);if(pz!==G.pz){G.pz=pz;say(pz?'⚔️ '+pz.n+': PvP bölgesi! Kural: yalnızca seviyen +1\'e kadar olan oyunculara saldırabilirsin (Sv 2 → en çok Sv 3). Fetih Kristallerini kır!':'PvP bölgesinden çıktın.','sys')}}
  G.near=findNear();
  for(var f=G.efx.length-1;f>=0;f--){var x=G.efx[f];x.t+=dt;if(x.t>=x.l)G.efx.splice(f,1)}
  for(var q=G.txt.length-1;q>=0;q--){var y=G.txt[q];y.t+=dt;y.y-=28*dt;if(y.t>1)G.txt.splice(q,1)}
  saveT+=dt;if(saveT>10){saveT=0;saveNow()}}
function worldMons(dt){for(var i=0;i<G.spawns.length;i++){var s=G.spawns[i],d=hyp(s.x-G.px,s.y-G.py);
  if(s.m){if(d>1500){var j=G.mons.indexOf(s.m);if(j>=0)G.mons.splice(j,1);s.m=null}}
  else{if(s.rt>0){s.rt-=dt;continue}if(d<760&&d>260){s.m=mkMon(s.type,s.lv,s.x,s.y,s);G.mons.push(s.m)}}}}
function dgUpdate(dt){var dg=G.dg,d=Y.DUNGEONS[dg.id];if(dg.done)return;
  if(dg.wait>0){dg.wait-=dt;if(dg.wait<=0){dg.wave++;if(dg.wave>=d.waves.length)dgDone();else dgWave()}}}
function monAi(m,dt){if(m.dead)return;
  if(m.dotT>0){m.dotT-=dt;m.dotAcc+=dt;if(m.dotAcc>=.5){m.dotAcc=0;dmgMon(m,m.dotD,1)}if(m.dead)return}
  if(m.slow>0)m.slow-=dt;if(m.taunt>0)m.taunt-=dt;if(m.hit>0)m.hit-=dt;
  var dx=G.px-m.x,dy=G.py-m.y,dist=hyp(dx,dy),ar=m.taunt>0?420:(m.boss?400:175),sp=m.sp*(m.slow>0?.5:1),inDg=G.mode==='dungeon';
  var chase=(dist<ar||m.hit>0)&&G.evade<=0&&G.dead<=0&&!inTownF()&&m.type!=='metin';
  if(!inDg&&hyp(m.x-m.sx,m.y-m.sy)>560){m.hit=0;chase=false}
  if(chase){if(dist>m.sz+18){moveE(m,dx/dist*sp*dt,dy/dist*sp*dt)}else{m.atkT-=dt;if(m.atkT<=0){m.atkT=1.15;if(m.dmg>0)hurt(m.dmg*Y.lvIn(P.lv,m.lv))}}}
  else{m.wt-=dt;if(m.wt<=0){m.wt=1.5+Math.random()*2;var a=Math.random()*6.28;m.wx=Math.cos(a);m.wy=Math.sin(a);if(hyp(m.x-m.sx,m.y-m.sy)>120){var hx=m.sx-m.x,hy=m.sy-m.y,hh=hyp(hx,hy)||1;m.wx=hx/hh;m.wy=hy/hh}}
    moveE(m,m.wx*sp*.35*dt,m.wy*sp*.35*dt)}}

/* ---------- çizim ---------- */
function resize(){dpr=Math.min(window.devicePixelRatio||1,2);VW=innerWidth;VH=innerHeight;cv.width=Math.round(VW*dpr);cv.height=Math.round(VH*dpr);
  var port=VH>VW&&('ontouchstart' in window);if(!port)window.__rotSeen=0;var showR=port&&G&&!window.__rotSeen&&!window.__portOk;$('rot').style.display=showR?'flex':'none';if(showR){clearTimeout(window.__rotT);window.__rotT=setTimeout(function(){$('rot').style.display='none';window.__rotSeen=1},9000);try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}}}
var rb=document.getElementById('rotgo');if(rb)rb.onclick=function(){window.__rotSeen=1;$('rot').style.display='none'};
addEventListener('resize',resize);addEventListener('orientationchange',resize);
/* tam ekran: tarayıcı çubukları ekranı yiyorsa bildirim + ilk dokunuşta otomatik dene */
function goFs(){try{var el=document.documentElement;if(el.requestFullscreen&&!document.fullscreenElement){el.requestFullscreen({navigationUI:'hide'}).catch(function(){}).then(function(){try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(function(){})}catch(e){}})}}catch(e){}}
function fsOk(){return !!document.documentElement.requestFullscreen}
function isStd(){return window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone||window.matchMedia&&matchMedia('(display-mode: fullscreen)').matches}
function showIos(force){var b=document.getElementById('fsb');if(!b){chkFs();b=document.getElementById('fsb')}if(isStd()&&!force)return;b.querySelector('.tx').innerHTML='<b>Tam ekran için uygulama gibi ekle</b><span>Bu tarayıcı tam ekrana izin vermiyor. Paylaş düğmesine bas → "Ana Ekrana Ekle" de. Sonra ana ekrandaki Diyar simgesinden aç: çubuksuz, tam ekran olur.</span>';document.getElementById('fsgo').style.display='none';b.style.display='flex';clearTimeout(window.__fsT);window.__fsT=setTimeout(function(){b.style.display='none'},16000)}
function chkFs(){var b=document.getElementById('fsb');if(!b){b=document.createElement('div');b.id='fsb';b.innerHTML='<div class="tx"><b>Ekranı genişlet</b><span>Tarayıcı çubukları yer kaplıyor. Tam ekrana geç; olmazsa tarayıcı menüsünden "Ana ekrana ekle" ile uygulama gibi aç.</span></div><button class="btn" type="button" id="fsgo">Tam ekran</button><button class="btn alt" type="button" id="fsx">×</button>';document.body.appendChild(b);document.getElementById('fsgo').onclick=function(){goFs();b.style.display='none'};document.getElementById('fsx').onclick=function(){b.style.display='none';window.__fsHide=1}}
  var standalone=isStd();
  if(!fsOk()&&!!G&&!window.__fsHide&&!window.__iosShown&&('ontouchstart' in window)&&!isStd()){window.__iosShown=1;showIos(false);return}
  var show=!!G&&!window.__fsHide&&('ontouchstart' in window)&&innerWidth>innerHeight&&fsOk()&&!document.fullscreenElement&&!standalone;b.style.display=show?'flex':'none';
  if(show){clearTimeout(window.__fsT);window.__fsT=setTimeout(function(){b.style.display='none'},12000)}}
document.addEventListener('fullscreenchange',function(){setTimeout(chkFs,300)});
addEventListener('resize',function(){setTimeout(chkFs,400)});
document.addEventListener('pointerup',function(){if(G&&('ontouchstart' in window)&&!document.fullscreenElement&&fsOk()&&!window.__fsHide)goFs()},{passive:true});

var ZC=['#3f7d48','#2f6a3c','#6b7083','#2b66a8','#b9a47d'];
function tileCol(tx,ty,z){var h=Y.hash(tx,ty,5);if(G.mode==='dungeon'){return(tx<1||ty<1||tx>=AW-1||ty>=AH-1)?'#15112a':((tx+ty)%2?'#3a3052':'#352c4b')}
  var c=ZC[z];if(z===3){return h<.5?'#2b66a8':'#2f6fb2'}var k=Math.floor(h*3);var d=k===0?-6:k===1?0:6;return shade(c,d)}
function shade(hex,d){var n=parseInt(hex.slice(1),16),r=(n>>16)+d,g=(n>>8&255)+d,b=(n&255)+d;r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));return'rgb('+r+','+g+','+b+')'}
function drawNode(kind,x,y){YA.node(ctx,kind,x,y,Y.NODE)}
function drawMon(m,t){YA.monster(ctx,m,t,G.px,G.py);var top=m.type==='metin'?m.y-m.sz*1.7-8:m.y-m.sz-14,w=m.type==='metin'?76:Math.max(36,m.sz*2.2);ctx.fillStyle='rgba(10,6,24,.7)';ctx.fillRect(m.x-w/2-1,top-1,w+2,7);ctx.fillStyle=m.type==='metin'?'#b57bff':m.boss?'#ff9d3d':'#ff5b6e';ctx.fillRect(m.x-w/2,top,w*Math.max(0,m.hp/m.max),5);YA.plate(ctx,m.x,top-10,m.n+' '+m.lv,m.boss?'#ff9d3d':null)}
function drawHero(t){var x=G.px,y=G.py,c=C(),mv=!!(G.jx||G.jy||G.keys.u||G.keys.d||G.keys.l||G.keys.r),ang=Math.atan2(G.fy,G.fx),sw=G.swT>0?(G.swT/.18-.5)*1.9:0;
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,y+22,20,8,0,0,6.28);ctx.fill();
  var gl=ctx.createRadialGradient(x,y+20,2,x,y+20,34);gl.addColorStop(0,c.col);gl.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=.55;ctx.fillStyle=gl;ctx.beginPath();ctx.ellipse(x,y+20,34,13,0,0,6.28);ctx.fill();ctx.globalAlpha=G.evade>0?.4:1;
  if(G.fy<-.3)YA.weapon(ctx,P.cls,x,y-2,ang,sw,t,P.wt||0);
  YL.hero(ctx,x,y+21,P.ap,t,mv,1)
  if(G.fy>=-.3)YA.weapon(ctx,P.cls,x,y-2,ang,sw,t,P.wt||0);
  ctx.globalAlpha=1;
  if(G.guard>0){ctx.strokeStyle='#5cb4ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,34,0,6.28);ctx.stroke()}if(G.buff>0){ctx.strokeStyle='#ffb27a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,38,0,6.28);ctx.stroke()}
  YA.plate(ctx,x,y+15+YL.topY(P.ap),P.nick,c.col);if(window.YX2)YX2.plate(ctx,x,y+15+YL.topY(P.ap)-17);
  if(G.gather){var p=G.gather.t/G.gather.need;ctx.fillStyle='rgba(10,6,24,.7)';ctx.fillRect(x-25,y+30,50,7);ctx.fillStyle='#5be39a';ctx.fillRect(x-24,y+31,48*p,5)}}
function render(t){var camX=G.px-VW/2,camY=G.py-VH/2;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#0b0820';ctx.fillRect(0,0,VW,VH);ctx.translate(-Math.round(camX),-Math.round(camY));
  var x0=Math.max(0,Math.floor(camX/TS)-1),y0=Math.max(0,Math.floor(camY/TS)-1),x1=Math.ceil((camX+VW)/TS)+1,y1=Math.ceil((camY+VH)/TS)+1,dg=G.mode==='dungeon';
  if(dg){x1=Math.min(x1,AW);y1=Math.min(y1,AH)}else{x1=Math.min(x1,Y.MW);y1=Math.min(y1,Y.MH)}
  for(var ty=y0;ty<y1;ty++)for(var tx=x0;tx<x1;tx++){var z=dg?0:Y.zoneAt(tx,ty);ctx.fillStyle=tileCol(tx,ty,z);ctx.fillRect(tx*TS,ty*TS,TS+1,TS+1);if(!dg){var hh=Y.hash(tx,ty,31);if(z<2){if(hh<.3){ctx.strokeStyle=z?'rgba(10,50,25,.4)':'rgba(30,90,40,.45)';ctx.lineWidth=1.6;var gx=tx*TS+hh*130%38+4,gy=ty*TS+hh*370%34+10;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx-2,gy-7);ctx.moveTo(gx+3,gy);ctx.lineTo(gx+3,gy-9);ctx.moveTo(gx+6,gy);ctx.lineTo(gx+8,gy-6);ctx.stroke()}if(z===0&&hh>.94){ctx.fillStyle=hh>.97?'#ffe14a':'#ff8fb0';ctx.beginPath();ctx.arc(tx*TS+hh*900%40+4,ty*TS+hh*500%36+6,2.6,0,6.3);ctx.fill()}}else if(z===4){ctx.strokeStyle='rgba(110,80,40,.22)';ctx.lineWidth=1.4;var o=(ty%2)*12;ctx.strokeRect(tx*TS+1+o%24,ty*TS+1,22,22);ctx.strokeRect(tx*TS+25,ty*TS+25,22,22)}else if(z===2&&hh<.18){ctx.fillStyle='rgba(30,30,50,.2)';ctx.beginPath();ctx.arc(tx*TS+hh*250%40+4,ty*TS+hh*600%38+5,3,0,6.3);ctx.fill()}}
    if(z===3&&!dg&&((tx+ty+Math.floor(t*1.5))%4===0)){ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(tx*TS+8,ty*TS+14,TS-16,4)}}
  if(!dg){ctx.fillStyle='rgba(255,230,160,.12)';ctx.beginPath();ctx.arc(Y.CX*TS,Y.CY*TS,Y.TS*9.6,0,6.28);ctx.fill();ctx.strokeStyle='rgba(255,230,160,.4)';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='700 14px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText('KASABA',Y.CX*TS,Y.CY*TS-Y.TS*9)}
  var ents=[];
  if(!dg){Y.PVP.forEach(function(z){var qx=(z.tx+.5)*TS,qy=(z.ty+.5)*TS;ctx.fillStyle='rgba(255,40,60,.12)';ctx.beginPath();ctx.arc(qx,qy,z.r*TS,0,6.28);ctx.fill();ctx.strokeStyle='rgba(255,80,90,.75)';ctx.lineWidth=4;ctx.setLineDash([16,12]);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#ff9a9a';ctx.font='700 14px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText(z.n+' (PvP)',qx,qy-z.r*TS+24)});
    G.vill.forEach(function(v){ents.push({y:v.y,f:function(){YA.person(ctx,v.x,v.y+14,v.look,t,!!(v.wx||v.wy));YA.plate(ctx,v.x,v.y+14-((v.look.s||1)*(v.look.hat==='wizard'?86:70)),v.n)}})});
    G.houses.forEach(function(o){ents.push({y:o.y+20,f:function(){YA.house(ctx,o,t)}})});
    var pt=G.pit;ents.push({y:pt.y,f:function(){YA.mine(ctx,pt.x,pt.y,t)}});
    for(var ny=y0;ny<y1;ny++)for(var nx=x0;nx<x1;nx++){var n=Y.nodeAt(nx,ny);if(n&&!(G.dep[nx+','+ny]>G.t))ents.push({y:(ny+.5)*TS,f:function(k,a,b){return function(){YA.node(ctx,k,a,b,Y.NODE)}}(n,(nx+.5)*TS,(ny+.5)*TS+8)})}
    G.npcs.forEach(function(o){var nv=NPCV[o.id];ents.push({y:o.y+(o.id==='smelt'?30:0),f:function(){if(nv.st)YA.station(ctx,nv.st,o.x,o.y+(nv.sy||14),t);if(nv.look){YA.person(ctx,o.x+(nv.px||0),o.y+(nv.py||14),nv.look,t,false);YA.plate(ctx,o.x+(nv.px||0),o.y+(nv.py||14)-(nv.look.hat==='wizard'?86:70),o.n,'#ffd23f')}else YA.plate(ctx,o.x,o.y-80,o.n,'#ffd23f')}})});
    G.portals.forEach(function(p){var d=Y.DUNGEONS[p.id];ents.push({y:p.p.y+40,f:function(){YA.portal(ctx,p.p.x,p.p.y,t,DCOL[p.id],d.n+' · Sv '+d.lv+(d.party>1?' · '+d.party+' kişi':'')+(d.rk?' · '+Y.RANKS[d.rk].n:''),DKEY[p.id])}})});
  }
  else if(G.dg.done){ents.push({y:G.dg.ey,f:function(){ctx.fillStyle='rgba(91,227,154,.35)';ctx.beginPath();ctx.ellipse(G.dg.ex,G.dg.ey,36,42,0,0,6.28);ctx.fill();ctx.strokeStyle='#5be39a';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#fff';ctx.font='700 12px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText('ÇIKIŞ',G.dg.ex,G.dg.ey-50)}})}
  (G.comp||[]).forEach(function(c){ents.push({y:c.y,f:function(){YA.person(ctx,c.x,c.y+16,c.look,t,!!c.mv);YA.plate(ctx,c.x,c.y+16-(c.look.hat==='wizard'?86:70),'Kiralık '+Y.CLASSES[c.cls].n,Y.CLASSES[c.cls].col)}})});
  curMons().forEach(function(m){if(!m.dead)ents.push({y:m.y,f:function(){drawMon(m,t)}})});ents.push({y:G.py,f:function(){drawHero(t)}});
  ents.sort(function(a,b){return a.y-b.y});ents.forEach(function(e){e.f()});
  G.efx.forEach(function(f){var a=1-f.t/f.l;ctx.globalAlpha=Math.max(0,a);ctx.strokeStyle=f.c;
    if(f.k==='ring'){ctx.lineWidth=5;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(.4+.6*(1-a)),0,6.28);ctx.stroke()}
    else if(f.k==='line'){ctx.lineWidth=f.w||4;ctx.beginPath();ctx.moveTo(f.x1,f.y1);ctx.lineTo(f.x2,f.y2);ctx.stroke()}
    else if(f.k==='swing'){var an=Math.atan2(f.fy,f.fx);ctx.lineWidth=6;ctx.beginPath();ctx.arc(f.x,f.y,44,an-.9,an+.9);ctx.stroke()}ctx.globalAlpha=1});
  G.txt.forEach(function(f){ctx.globalAlpha=Math.max(0,1-f.t);ctx.fillStyle=f.c;ctx.font='800 14px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=3;ctx.strokeText(f.s,f.x,f.y);ctx.fillText(f.s,f.x,f.y);ctx.globalAlpha=1});
  if(window.YNet&&!dg)try{YNet.draw(ctx,camX,camY,t,VW,VH)}catch(e){}if(window.YX2)try{YX2.draw(ctx,camX,camY,t,dg)}catch(e){}
  if(G.dead>0){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='rgba(120,0,20,.45)';ctx.fillRect(0,0,VW,VH);ctx.fillStyle='#fff';ctx.font='800 28px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText('YENİLDİN',VW/2,VH/2)}}
var MZC=['#4fae5a','#2a7a3f','#8d93aa','#2f7fd0','#e0c58a'],MS=128;
function buildMini(){mmc=document.createElement('canvas');mmc.width=Y.MW;mmc.height=Y.MH;var m=mmc.getContext('2d');for(var y=0;y<Y.MH;y++)for(var x=0;x<Y.MW;x++){m.fillStyle=MZC[Y.zoneAt(x,y)];m.fillRect(x,y,1,1)}}
function mapMarks(m,S,big){var u=S/Y.MW;Y.PVP.forEach(function(z){m.fillStyle='rgba(255,40,60,.35)';m.strokeStyle='#ff5b6e';m.lineWidth=big?2:1.5;m.beginPath();m.arc((z.tx+.5)*u,(z.ty+.5)*u,z.r*u,0,6.28);m.fill();m.stroke();if(big){m.font='700 13px sans-serif';m.textAlign='center';m.lineWidth=3;m.strokeStyle='#000';m.strokeText(z.n,(z.tx+.5)*u,(z.ty+.5)*u);m.fillStyle='#fff';m.fillText(z.n,(z.tx+.5)*u,(z.ty+.5)*u)}});
  m.strokeStyle='#ffd23f';m.lineWidth=big?3:2;m.beginPath();m.arc(Y.CX*u,Y.CY*u,10*u,0,6.28);m.stroke();
  G.portals.forEach(function(p){var px=p.p.x/TS*u,py=p.p.y/TS*u;if(big){YA.draw(m,DKEY[p.id],px,py,22);m.textAlign='center';m.fillStyle='#fff';m.font='700 11px sans-serif';m.lineWidth=3;m.strokeStyle='#000';m.strokeText(Y.DUNGEONS[p.id].n,px,py+20);m.fillText(Y.DUNGEONS[p.id].n,px,py+20)}else{m.fillStyle='#b57bff';m.strokeStyle='#fff';m.lineWidth=1.5;m.beginPath();m.arc(px,py,3.5,0,6.28);m.fill();m.stroke()}});
  if(big){m.font='700 14px sans-serif';m.textAlign='center';m.lineWidth=3;m.strokeStyle='#000';m.strokeText('Kasaba',Y.CX*u,Y.CY*u-10*u-6);m.fillStyle='#ffd23f';m.fillText('Kasaba',Y.CX*u,Y.CY*u-10*u-6);YA.draw(m,'pickaxe',G.pit.x/TS*u,G.pit.y/TS*u,22)}
  m.save();m.translate(G.px/TS*u,G.py/TS*u);m.rotate(Math.atan2(G.fy,G.fx));var q=big?9:6;m.fillStyle='#fff';m.strokeStyle='#111';m.lineWidth=2;m.beginPath();m.moveTo(q,0);m.lineTo(-q*.7,q*.7);m.lineTo(-q*.4,0);m.lineTo(-q*.7,-q*.7);m.closePath();m.fill();m.stroke();m.restore()}
function drawMini(){var m=$('mm').getContext('2d');m.imageSmoothingEnabled=false;m.clearRect(0,0,MS,MS);if(G.mode==='dungeon'){m.fillStyle='#2a2142';m.fillRect(0,0,MS,MS);m.fillStyle='#ffd23f';m.fillRect(G.px/(AW*TS)*MS-3,G.py/(AH*TS)*MS-3,6,6);return}
  m.drawImage(mmc,0,0,MS,MS);mapMarks(m,MS,false)}
function drawMap(){var c=$('mapc'),m=c.getContext('2d'),S=c.width;m.imageSmoothingEnabled=false;m.clearRect(0,0,S,S);m.drawImage(mmc,0,0,S,S);m.strokeStyle='rgba(255,255,255,.12)';m.lineWidth=1;for(var i=1;i<6;i++){m.beginPath();m.moveTo(i*S/6,0);m.lineTo(i*S/6,S);m.moveTo(0,i*S/6);m.lineTo(S,i*S/6);m.stroke()}mapMarks(m,S,true)}
function hud(){var st=S(),hp=Math.max(0,G.hp/st.maxhp),sta=(G.sta==null?100:G.sta)/100,mx=P.lv>=Y.MAXLV,need=Y.xpNeed(P.lv),xp=mx?1:P.xp/need;var d=function(id,v){var e=$(id);if(e)e.setAttribute('stroke-dasharray',(Math.max(0,Math.min(1,v))*100).toFixed(1)+' 100')};d('rh',hp);d('rs',sta);d('rx',xp);var t1=Math.ceil(G.hp)+' / '+st.maxhp;if($('th')._h!==t1){$('th')._h=t1;$('th').textContent=t1}var t2=Math.round(sta*100)+'%';if($('ts')._h!==t2){$('ts')._h=t2;$('ts').textContent=t2}var t3=mx?'MAKS':P.xp+' / '+need+' · %'+Math.floor(xp*100);if($('tx')._h!==t3){$('tx')._h=t3;$('tx').textContent=t3}if($('rlv')._h!==P.lv){$('rlv')._h=P.lv;$('rlv').textContent=P.lv}$('rs').style.opacity=G.exh?.45:1;var hlt='Sv '+P.lv+' · '+Y.RANKS[Y.rankOf(P.mp)].n+' · 🪙 '+P.gold;if($('hl')._h!==hlt){$('hl')._h=hlt;$('hl').innerHTML=hlt}
  [1,2,3,4].forEach(function(n){var s=skAt(n-1),cd=$('b'+n).querySelector('.cd');if(cd)cd.style.height=(s&&G.cd[n-1]>0?Math.min(100,G.cd[n-1]/(s.cd*S().cdm)*100):0)+'%'});
  var bi=$('bi'),n=G.near;if(n){bi.style.display='grid';var bk=(n.t==='npc'||n.t==='vill')?'chat':(n.t==='portal'||n.t==='exit')?'door':(G.gather?'hourglass':'hand');if(bi.dataset.k!==bk){bi.dataset.k=bk;bi.innerHTML=YA.ico(bk)}}else bi.style.display='none';var zn2=$('zn'),pz2=G.mode==='world'?G.pz:null,tx='',col='';if(G.mode==='dungeon'){tx='🕳️ '+Y.DUNGEONS[G.dg.id].n;col='#b57bff'}else if(pz2){tx='⚔️ '+pz2.n+' · PvP';col='#ff5b6e'}else if(inTownF()){tx='Kasaba · Güvenli bölge';col='#5be39a'}if(zn2){zn2.style.display=tx?'block':'none';if(zn2._h!==tx){zn2._h=tx;zn2.innerHTML=tx}zn2.style.borderColor=col;zn2.style.color=col}
  drawMini()}
function loop(now){raf=requestAnimationFrame(loop);if(!G)return;var dt=Math.min(.05,(now-lastT)/1000);lastT=now;if(!G.paused)update(dt);render(G.t);hud()}
document.addEventListener('visibilitychange',function(){if(document.hidden)saveNow()});addEventListener('pagehide',saveNow);

/* ---------- açılış ---------- */
function boot(){try{YA.dom(document.body)}catch(e){}if(!window.YXAcct||!YXAcct.conf()){show('s-gate');$('gerr').textContent='Hesap sistemi şu an hazır değil.';return}
  if(acct())toChar();else show('s-gate')}
window.addEventListener('yx-acct',function(){if(!G&&!acct())show('s-gate')});
window.__yd={get G(){return G},get P(){return P},get ctx(){return ctx},get VW(){return VW},get VH(){return VH},get dpr(){return dpr},say:say,floatTxt:floatTxt,saveNow:saveNow,openPan:openPan,closePan:closePan,giveXp:giveXp,mkMon:mkMon,inTownF:inTownF,S:S,enter:enter,cast:cast,attack:attack,interact:interact,openNpc:openNpc,enterDg:enterDg,die:die,respawn:respawn,drawSkills:drawSkills,Y:Y,myInv:myInv,itName:itName,itIc:itIc,itVal:itVal,closePan:closePan};
setTimeout(boot,60);
window.addEventListener('yl-img',function(){try{if(typeof drawNewPrev==='function'&&$('cnew')&&$('cnew').style.display!=='none')drawNewPrev();if(P)setAv();if($('s-wd').classList.contains('on'))drawWd();var pn=$('p-npc');if(pn&&pn.classList.contains('on')&&/Kahraman/.test($('npt').textContent))drawHeroShop()}catch(e){}});
})();
