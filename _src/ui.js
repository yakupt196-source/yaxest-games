/* ===================== YÜZ MÜHÜR: arayüz ve girdi ===================== */
window.say=say;
var cv=document.getElementById('c');
function $on(id,ev,fn){var e=$(id);if(e)e.addEventListener(ev,fn)}
function btn(id,fn){var b=$(id);b.addEventListener('touchstart',function(e){fn();e.preventDefault();e.stopPropagation()},{passive:false});b.addEventListener('click',fn)}
btn('ba',function(){doAttack(0)});btn('br',doRoll);btn('s1',function(){doAttack(1)});btn('s2',function(){doAttack(2)});btn('s3',function(){doAttack(3)});btn('bp',usePotion);
$('ctx').addEventListener('touchstart',function(e){doInteract();e.preventDefault();e.stopPropagation()},{passive:false});$('ctx').addEventListener('click',doInteract);
var chatOpen=false;
function openChat(pre){chatOpen=true;$('cin').style.display='block';$('cinp').value=pre||'';$('cinp').focus()}
function closeChat(){chatOpen=false;$('cin').style.display='none';$('cinp').blur()}
$('cinp').addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Enter'){var v=$('cinp').value.trim();closeChat();if(v){var ch='s';if(/^\/p\s/i.test(v)){ch='p';v=v.slice(3)}else if(/^\/l\s/i.test(v)){ch='l';v=v.slice(3)}else if(/^\/d\s/i.test(v)){ch='d';v=v.slice(3)}NET.chat(v,ch)}}else if(e.key==='Escape')closeChat()});
$('bch').onclick=function(){chatOpen?closeChat():openChat('')};
$('bm').onclick=function(){openPanel('menu')};
addEventListener('keydown',function(e){if(chatOpen||!started)return;keys[e.code]=1;
 if(PN.open){if(e.code==='Escape')closePanel();return}
 if(e.code==='Space'){doAttack(0);e.preventDefault()}else if(e.code==='ShiftLeft'||e.code==='ShiftRight'){doRoll()}
 else if(e.code==='KeyQ')doAttack(1);else if(e.code==='KeyE')doAttack(2);else if(e.code==='KeyR')doAttack(3);else if(e.code==='Digit1')usePotion();else if(e.code==='KeyF')doInteract();
 else if(e.code==='KeyV')pl.fp=!pl.fp;else if(e.code==='Enter'){openChat('');e.preventDefault()}else if(e.code==='KeyM'||e.code==='Escape'){openPanel('menu')}});
addEventListener('keyup',function(e){keys[e.code]=0});
cv.addEventListener('click',function(){if(cv.requestPointerLock&&!('ontouchstart' in window)&&started&&!PN.open)cv.requestPointerLock()});
document.addEventListener('mousemove',function(e){if(document.pointerLockElement===cv){cam.yaw+=e.movementX*.0024;cam.pit=Math.max(-1.3,Math.min(1.3,cam.pit-e.movementY*.0024))}});
cv.addEventListener('mousedown',function(e){if(document.pointerLockElement===cv&&e.button===0)doAttack(0);if(document.pointerLockElement===cv&&e.button===2)doAttack(1)});
cv.addEventListener('contextmenu',function(e){e.preventDefault()});
var st=$('stick'),kn=$('knob');
function tstart(e){if(PN.open)return;st.style.display='block';for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];
 if(t.clientX<innerWidth*.45&&stickId==null){stickId=t.identifier;stickC=[t.clientX,t.clientY];st.style.left=(t.clientX-55)+'px';st.style.top=(t.clientY-55)+'px';st.style.bottom='auto'}
 else if(lookId==null){lookId=t.identifier;lastL=[t.clientX,t.clientY]}}e.preventDefault()}
function tmove(e){for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];
 if(t.identifier===stickId){var dx=t.clientX-stickC[0],dy=t.clientY-stickC[1],l=Math.hypot(dx,dy),k=Math.min(1,l/45);sx=l?dx/l*k:0;sz=l?dy/l*k:0;kn.style.left=(35+sx*35)+'px';kn.style.top=(35+sz*35)+'px'}
 else if(t.identifier===lookId){cam.yaw+=(t.clientX-lastL[0])*.005;cam.pit=Math.max(-1.3,Math.min(1.3,cam.pit-(t.clientY-lastL[1])*.005));lastL=[t.clientX,t.clientY]}}e.preventDefault()}
function tend(e){for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];if(t.identifier===stickId){stickId=null;sx=sz=0;kn.style.left='35px';kn.style.top='35px'}if(t.identifier===lookId)lookId=null}}
cv.addEventListener('touchstart',tstart,{passive:false});cv.addEventListener('touchmove',tmove,{passive:false});cv.addEventListener('touchend',tend);cv.addEventListener('touchcancel',tend);
function resize(){var dpr=Math.min(devicePixelRatio||1,2)*scale;cv.width=Math.max(2,Math.floor(innerWidth*dpr));cv.height=Math.max(2,Math.floor(innerHeight*dpr))}
addEventListener('resize',resize);resize();
/* ---- HUD ---- */
var hc={};function setT(id,v){if(hc[id]!==v){hc[id]=v;$(id).textContent=v}}function setW(id,v){var w=Math.max(0,Math.min(100,v)).toFixed(1)+'%';if(hc[id]!==w){hc[id]=w;$(id).style.width=w}}
var hudT=0;
function hud(dt){hudT-=dt;if(hudT>0)return;hudT=.08;
 setT('pname',(S.oath?'☠ ':'')+S.nick+(S.title?' · '+S.title:''));setT('plv','Sv '+S.lv+(S.prof?' · '+PROF[S.prof].n:''));setW('hpi',pl.hp/pl.mhp*100);setT('hpt',Math.ceil(pl.hp)+' / '+pl.mhp);setW('sti',pl.st/pl.mst*100);$('sti').style.background=pl.stFlash>0?'#ff5050':'';setW('mpi',pl.mp);setW('xpi',S.xp/mxp(S.lv)*100);
 setT('gd',S.gold);setT('po',S.pot);
 if(WORLD==='floor'){setW('seali',FL.seal/FL.need*100);var sub='Önerilen Sv '+Math.round(RLf(FL.n))+' · Mühür '+FL.seal+'/'+FL.need+(FL.open?' (açık)':'');setT('fsub',sub)}else setT('fsub','Güvenli bölge · '+(roomOn()?'🔑 Oda '+S.room.n+' · '+Math.max(1,Math.ceil((S.room.exp-Date.now())/60000))+' dk':NET.status()));
 var b=FL.boss,bb=$('bossb');if(WORLD==='floor'&&b&&b.eng&&b.dead<=0){bb.style.display='block';setT('bn',b.d.n);setW('bi',b.hp/b.mhp*100);setT('bt',Math.ceil(b.hp)+' / '+b.mhp)}else bb.style.display='none';
 var cd=[pl.sk[0],pl.sk[1],pl.sk[2]],ids=['s1','s2','s3'];for(var i=0;i<3;i++){var el=$(ids[i]).querySelector('.cd'),v=i===2?(pl.mp<100?Math.floor(pl.mp)+'%':(cd[i]>0?Math.ceil(cd[i]):'')):(cd[i]>0?Math.ceil(cd[i]):(i===1&&S.lv<4?'🔒':''));
  var lock=(i===1&&S.lv<4)||(i===2&&S.lv<8);el.style.display=(v!==''||lock)?'flex':'none';el.textContent=lock?'🔒':v}
 var a=nearIA(),c=$('ctx');if(a&&!PN.open&&pl.dead<=0){c.style.display='block';var t=(a.lb||'')+' ('+(('ontouchstart' in window)?'dokun':'F')+')';if(c.textContent!==t)c.textContent=t}else c.style.display='none';
 $('bp').textContent='🧪';$('bp').style.opacity=S.pot>0?1:.4}
/* ---- paneller ---- */
var PN={open:null,tab:null},PROF={savasci:{n:'Savaşçı',d:'+%12 hasar, +%5 can'},tuccar:{n:'Tüccar',d:'Alışverişte %15 indirim, satışta %25 fazla, +3 iksir kapasitesi'},demirci:{n:'Demirci',d:'Demirci ücretleri %20 ucuz'},sifaci:{n:'Şifacı',d:'İksirler %35 fazla iyileştirir'}};
function openPanel(k,tab){PN.open=k;PN.tab=tab||null;paused=true;$('pnw').style.display='flex';if(document.pointerLockElement)document.exitPointerLock();renderPanel()}
function closePanel(){PN.open=null;paused=false;$('pnw').style.display='none';save()}
window.refreshPanel=function(){if(PN.open)renderPanel()};
$('pnx').onclick=closePanel;$('pnw').addEventListener('mousedown',function(e){if(e.target===$('pnw'))closePanel()});
function B(a,v,l,cls,dis){return '<button type="button" data-a="'+a+'" data-v="'+esc(v==null?'':v)+'"'+(cls?' class="'+cls+'"':'')+(dis?' disabled':'')+'>'+l+'</button>'}
function R(ic,t,sub,right){return '<div class="row"><span class="ic">'+ic+'</span><div class="t"><b>'+t+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</div>'+(right||'')+'</div>'}
var TABS={shop:[['buy','Satın Al'],['sell','Sat']],guild:[['party','Parti'],['clan','Lonca'],['trade','Takas']],menu:[['char','Karakter'],['skills','Hamleler'],['set','Ayarlar']],inn:[['rest','Han'],['rooms','Odalar'],['cls','Sınıf'],['prof','Meslek'],['look','Görünüm'],['oath','Yemin']]};
var TITLES={shop:'🛒 Tüccar Hasan',smith:'⚒ Demirci Ayten',guild:'🏰 Lonca Memuru',inn:'🛏 Han Sahibi Nuri',quest:'📜 Haberci Elif',gate:'🗼 Kule Kapısı',menu:'☰ Menü'};
function renderPanel(){var k=PN.open;if(!k)return;$('pnti').textContent=TITLES[k]||'';var tabs=TABS[k]||[];if(tabs.length&&!PN.tab)PN.tab=tabs[0][0];
 $('pnt').innerHTML=tabs.map(function(t){return '<button type="button" data-a="tab" data-v="'+t[0]+'"'+(PN.tab===t[0]?' class="on"':'')+'>'+t[1]+'</button>'}).join('');
 var h='';try{h=PV[k]()}catch(e){h='<p>Hata: '+esc(e.message)+'</p>'}$('pnc').innerHTML=h}
var PV={};
PV.shop=function(){var h='';if(PN.tab==='buy'){var pp=potPrice();h+='<h4>İksirler</h4>'+R('🧪','Şifa İksiri','Canın %'+Math.round(45*profMul('heal'))+'’ini doldurur · Elinde '+S.pot+'/'+potMax(),'<span class="gold">'+pp+' 🪙</span>');
  h+='<div class="row">'+B('buy',1,'1 adet','',S.gold<pp||S.pot>=potMax())+B('buy',5,'5 adet','',S.gold<pp*5||S.pot+5>potMax())+B('buy','max','Doldur','',S.gold<pp||S.pot>=potMax())+'</div><p><small>Altının: <b class="gold">'+S.gold+'</b> 🪙 · Fiyatlar bulunduğun en yüksek kata göre artar.</small></p>'}
 else{var v=Math.round(S.lootV*profMul('sell'));h+='<h4>Yağma</h4>'+R('🎒','Canavar parçaları','Elinde '+S.loot+' parça · değer '+v+' 🪙','')+'<div class="row">'+B('sell','all','Hepsini sat ('+v+' 🪙)','',S.loot<=0)+'</div><p><small>Elit ve muhafızlar daha değerli parça düşürür.</small></p>'}
 return h};
PV.smith=function(){var h='<p><small>Altının: <b class="gold">'+S.gold+'</b> 🪙 · En yüksek kat: '+S.maxF+'</small></p>';var t=S.tier,a=S.arm;
 h+='<h4>Silah</h4>'+R('⚔️',wpName(t),'Hasar '+Math.round(PDM())+' · Seviye '+t,'');
 if(t<20){var c=wpCost(t+1),rq=wpReq(t+1),ok=S.maxF>=rq;h+=R('⬆️',wpName(t+1),'Gereken kat: '+rq+(ok?'':' <span class="red">(kilitli)</span>')+' · +'+Math.round(4+.3*S.lv)+' hasar','<div>'+B('wp','','<span class="gold">'+c+' 🪙</span>','',!ok||S.gold<c)+'</div>')}else h+='<p>Silah en üst seviyede.</p>';
 h+='<h4>Ustalık (altın kullanımı)</h4>'+R('🪨','Bileme '+(S.hone|0)+'/20','Silah hasarı +%2 her seviye','<div>'+B('hone','','<span class="gold">'+honeCost(S.hone|0)+' 🪙</span>','',(S.hone|0)>=20||S.gold<honeCost(S.hone|0))+'</div>')+R('🛡','Takviye '+(S.rein|0)+'/20','Maksimum can +%2 her seviye','<div>'+B('rein','','<span class="gold">'+honeCost(S.rein|0)+' 🪙</span>','',(S.rein|0)>=20||S.gold<honeCost(S.rein|0))+'</div>')+'<h4>Zırh</h4>'+R('🛡',AN[Math.min(10,a)],'Hasar azaltma %'+Math.round(armorRed()*100)+' · +'+a*8+' can','');
 if(a<10){var c2=arCost(a+1),rq2=arReq(a+1),ok2=S.maxF>=rq2;h+=R('⬆️',AN[a+1],'Gereken kat: '+rq2+(ok2?'':' <span class="red">(kilitli)</span>'),'<div>'+B('ar','','<span class="gold">'+c2+' 🪙</span>','',!ok2||S.gold<c2)+'</div>')}else h+='<p>Zırh en üst seviyede.</p>';return h};
PV.gate=function(){var h='<p><small>Her katta bir muhafız var, onu yenince üst kat açılır. En yüksek kat: <b>'+S.maxF+'</b> · Mühür: <b>'+S.seals+'/100</b></small></p>';h+='<div class="row">'+B('floor',S.maxF,'⬆ En yüksek kata git ('+S.maxF+')','ok')+'</div>';var lastR=-1;
 for(var f=1;f<=Math.max(S.maxF,1);f++){var ri=Math.floor((f-1)/10);if(ri!==lastR){lastR=ri;if(f>1)h+='</div>';h+='<h4>'+REALMS[ri%10].n+(ri>=10?' (Sonsuz)':'')+'</h4><div class="grid">'}h+=B('floor',f,f+(S.clr[f]?' ✓':''),S.clr[f]?'ok':'')}
 return h+'</div>'};
PV.quest=function(){ensureQ();var h='<p><small>Her gün yenilenir. Haberci Elif ödülünü verir.</small></p>';QDEF.forEach(function(q,i){var v=Math.min(q.goal,S.q[q.key]),done=v>=q.goal,cl=S.q.cl[i];
  h+=R(done?'✅':'📜',q.n,v+'/'+q.goal+' · Ödül '+q.g+' 🪙 + '+q.p+' 🧪','<div>'+B('qc',i,cl?'Alındı':'Al','',!done||cl)+'</div>')});
 h+='<h4>Kule Hakkında</h4><p><small>Kadim Kule denizden yükseldiğinde yüz mühürle kapatıldı. Her mühürün bir muhafızı var. Yüzüncü mührün ardında Ezeli Muhafız bekliyor. Kuleden çıkış yok: yalnızca yukarı. Ama şehir her zaman güvenli.</small></p>';return h};
PV.inn=function(){var h='';
 if(PN.tab==='rest'){h+=R('🛏','Dinlen','Canını ve dayanıklılığını doldur, iksirini 3’e tamamla.','<div>'+B('rest','','Dinlen')+'</div>')+R('🗼','Işınlanma','Kayıtlı kata hızlı dönüş yok: Kule Kapısı’ndan gir.','')}
 else if(PN.tab==='rooms'){var on=roomOn(),left=on?Math.ceil((S.room.exp-Date.now())/60000):0;
  h+='<p><small>🏨 Han artık bir otel: 5 özel oda, yatak, sandık ve kapı. Kiraladığın odada dinlenirsen canın dolar, kira boyunca tecrübe kazancın %10 artar. Süre dolunca odadan çıkarılırsın.</small></p>';
  h+=R('🍖','Han Ziyafeti','+%12 hasar, 20 dk'+(feastOn()?' · aktif: '+Math.ceil((S.feast-Date.now())/60000)+' dk':''),B('feast','',Math.round(120+S.lv*25)+' 🪙','',S.gold<Math.round(120+S.lv*25)));
  if(on)h+=R('🔑','Oda '+S.room.n+' senin','Kalan süre: '+left+' dk. Han’ın içinde, koridorun arkasındaki kapı artık açık.','');
  [[60,80],[360,300],[1440,700]].forEach(function(o){h+=R('🛏',(o[0]<120?o[0]+' dakika':o[0]/60+' saat')+(on?' (uzat)':''),'Özel oda, yatak ve sandık',B('rent',o[0]+':'+o[1],o[1]+' 🪙','',S.gold<o[1]))});}
 else if(PN.tab==='cls'){h+='<p><small>Sınıfın hamlelerini, silahını ve oyun tarzını belirler. İlk seçim ücretsiz, değiştirmek 300 🪙.</small></p>';Object.keys(CL).forEach(function(k){var c=CL[k],on=(S.cls||'warrior')===k;h+=R(on?'✅':c.i,c.n,c.d+'<br>Q: '+c.q[2]+' · E: '+c.e[2]+' · R: '+c.r[2],'<div>'+(on?'':B('cls',k,S.clsPick?'300 🪙':'Seç'))+'</div>')})}
 else if(PN.tab==='prof'){h+='<p><small>Mesleğin oyun tarzını belirler. İlk seçim ücretsiz, değiştirmek 500 🪙.</small></p>';Object.keys(PROF).forEach(function(k){h+=R(S.prof===k?'✅':'🔸',PROF[k].n,PROF[k].d,'<div>'+B('prof',k,S.prof===k?'Seçili':(S.prof?'500 🪙':'Seç'),'',S.prof===k||(S.prof&&S.gold<500))+'</div>')})}
 else if(PN.tab==='look'){h+='<p><small>Görünümünü seç. Giriş yaptıysan Diyar karakterini de kullanabilirsin.</small></p><div class="grid">';LOOKS.forEach(function(l,i){h+=B('look',i,'Görünüm '+(i+1),S.look===i&&S.lookMode!=='diyar'?'ok':'')});h+='</div>';if(S.dap)h+='<div class="row">'+B('look','diyar','Diyar karakterim','',0)+'</div>'}
 else{h+='<p><small>☠ <b>Yemin Modu</b>: Ölürsen altının tamamını kaybedersin ve ilerlemen (açık katların) yarıya iner. Karşılığında altın ve tecrübe %50 fazla, adının yanında kafatası simgesi olur.</small></p>'+R(S.oath?'☠':'🕊','Yemin Modu: '+(S.oath?'AÇIK':'kapalı'),'','<div>'+B('oath','',S.oath?'Yemini bozmak için 2 kez bas':'Yemin et','')+'</div>')}
 return h};
PV.guild=function(){var h='';
 if(PN.tab==='party'){var pc=NET.party(),m=NET.members();h+='<p><small>Ağ: '+NET.status()+' · Parti üyeleri aynı katta birbirinin vuruşlarını paylaşır: canavar canı ortak azalır, ödüller herkese gider, +%10 tecrübe.</small></p>';
  if(pc){h+=R('🛡','Partin: <b>'+pc+'</b>','Kodu arkadaşına ver. Üyeler: '+Object.keys(m).map(function(k){return esc(m[k].n)+' Sv'+m[k].l+(m[k].f?' (Kat '+m[k].f+')':' (Şehir)')}).join(', '),'<div>'+B('pleave','','Ayrıl')+'</div>')}
  else h+='<div class="row">'+B('pnew','','Parti kur')+'<input id="pj" maxlength="5" placeholder="Parti kodu" style="flex:1">'+B('pjoin','','Katıl')+'</div>';
  var of=NET.offers();Object.keys(of).forEach(function(k){var o=of[k];if(o.kind==='inv')h+=R('✉️',esc(o.n)+' seni partiye çağırıyor','Kod '+o.code,'<div>'+B('iacc',k,'Katıl')+B('idec',k,'Reddet')+'</div>')});
  h+='<h4>Yakındaki oyuncular</h4>';var nr=NET.near().slice(0,10);if(!nr.length)h+='<p><small>Şu an yakında kimse yok'+(NET.up()?'':' (çevrimdışısın: Ayarlar’dan aç)')+'.</small></p>';nr.forEach(function(o){h+=R('🧍',esc(o.n)+' <span class="tag">Sv '+o.lv+'</span>'+(o.c?'<span class="tag">'+esc(o.c)+'</span>':''),'','<div>'+B('inv',o.id,'Davet')+B('blk',o.id,'Engelle')+'</div>')})}
 else if(PN.tab==='clan'){var cl=NET.clan();h+='<p><small>Lonca etiketi 3-5 harf. Aynı etikete girenler lonca sohbetini (<b>/l mesaj</b>) paylaşır. Kurmak 300 🪙.</small></p>';
  if(cl)h+=R('🏰','Loncan: ['+esc(cl)+']','Sohbet: /l mesaj','<div>'+B('cleave','','Ayrıl')+'</div>');else h+='<div class="row"><input id="ct" maxlength="5" placeholder="Etiket (ör. KARA)" style="flex:1">'+B('cnew','','Kur / Katıl')+'</div>'}
 else{h+='<p><small>Yakındaki bir oyuncuyla iksir veya yağma takası yap. Karşı taraf kabul edince altın el değiştirir.</small></p>';var nr=NET.near().slice(0,8);
  if(!nr.length)h+='<p><small>Yakında oyuncu yok.</small></p>';else{h+='<div class="row"><select id="tp">'+nr.map(function(o){return '<option value="'+esc(o.id)+'">'+esc(o.n)+'</option>'}).join('')+'</select><select id="ti"><option value="pot">İksir ('+S.pot+')</option><option value="loot">Yağma ('+S.loot+')</option></select></div><div class="row"><input id="tq" type="number" min="1" max="20" value="1" placeholder="Adet"><input id="tg" type="number" min="0" value="50" placeholder="Fiyat 🪙">'+B('tsend','','Teklif et')+'</div>'}
  var of=NET.offers();Object.keys(of).forEach(function(k){var o=of[k];if(o.kind==='tr')h+=R('🤝',esc(o.n)+' → '+o.q+' '+(o.it==='pot'?'iksir':'yağma parçası'),'Fiyat '+o.p+' 🪙','<div>'+B('tacc',k,'Kabul')+B('tdec',k,'Reddet')+'</div>')})}
 return h};
PV.menu=function(){var h='';
 if(PN.tab==='char'){var t=S.tier,a=S.arm;h+=R('🧙',esc(S.nick)+(S.title?' <span class="tag">'+esc(S.title)+'</span>':''),'Sv '+S.lv+' · XP '+S.xp+'/'+mxp(S.lv)+(' · '+CLS().n)+(S.prof?' · '+PROF[S.prof].n:'')+(S.oath?' · ☠ Yemin':''),'')+
  R('⚔️',wpName(t),'Hasar '+Math.round(PDM())+' · Can '+pl.mhp+' · Dayanıklılık '+pl.mst+' · Zırh %'+Math.round(armorRed()*100),'')+
  R('🏯','En yüksek kat '+S.maxF,'Kırılan mühür '+S.seals+'/100 · Öldürülen canavar '+S.kills+' · Yağma '+S.loot,'')+
  R('🧪','İksir '+S.pot+'/'+potMax(),'1 tuşu / 🧪 düğmesi','<div>'+B('pot','','Kullan')+'</div>')+
  '<div class="row">'+B('home','','🏙 Şehre dön (5 sn)','',WORLD==='town')+B('close','','Devam')+'</div>'}
 else if(PN.tab==='skills'){var c=CLS();h+=R(c.i,c.n+' · Temel Saldırı',(c.rg?'Menzilli saldırı ('+c.rg[0]+' m)':'3’lü kombo: 3. vuruş en güçlü.')+' Her vuruş Mühür gücünü doldurur.','')+R('✦',c.q[2]+' (Q)',c.q[1]+'× hasar, '+c.q[0]+' m menzil · 5 sn bekleme','')+R('⟳',c.e[2]+' (E)'+(S.lv<4?' 🔒 Sv4':''),c.e[1]+'× hasar, '+c.e[0]+' m alan'+(c.h2?' · %'+Math.round(c.h2*100)+' can yeniler':'')+' · 9 sn bekleme','')+R('☄',c.r[2]+' (R)'+(S.lv<8?' 🔒 Sv8':''),'Mühür gücü %100 olunca: '+c.r[1]+'× alan hasarı + sersemletme'+(c.h3?' · %'+Math.round(c.h3*100)+' can yeniler':''),'')+R('🌀','Yuvarlan (Shift)','Kısa süre dokunulmaz. Muhafız saldırılarının kırmızı alanlarından böyle kaç.','')}
 else{h+=R('🌐','Çevrimiçi','Adın ve konumun diğer oyunculara görünür · '+NET.status(),'<div>'+B('net','',S.net?'Kapat':'Aç')+'</div>')+R('🔊','Ses','','<div>'+B('snd','',S.snd?'Kapat':'Aç')+'</div>')+R('🖥','Kalite','Düşük kalite telefonda akıcılık sağlar','<div>'+B('qual','',['Yüksek','Orta','Düşük'][qi])+'</div>')+R('⛶','Tam ekran','','<div>'+B('fs','','Aç')+'</div>')+R('📋','Hata raporu','Panoya kopyalar, bana gönder','<div>'+B('rep','','Kopyala')+'</div>')+R('📡','Kanal','Aynı kanaldaki oyuncular birbirini görür','<div>'+[1,2,3,4,5].map(function(c){return B('chn',c,c,S.ch===c?'on':'')}).join('')+'</div>')+R('🔙','Diyara dön','','<div><a href="../" style="color:#9ad0ff">Yaxest Diyarı</a></div>')}
 return h};
function act(a,v){var ch=true;
 if(a==='tab'){PN.tab=v}
 else if(a==='buy'){var pp=potPrice(),n=v==='max'?potMax()-S.pot:+v;n=Math.max(0,Math.min(n,potMax()-S.pot,Math.floor(S.gold/pp)));if(n>0){S.gold-=pp*n;S.pot+=n;snd('pick')}}
 else if(a==='sell'){var g=Math.round(S.lootV*profMul('sell'));S.gold+=g;S.loot=0;S.lootV=0;toast('+'+g+' 🪙','#ffd23f');snd('pick')}
 else if(a==='wp'){var c=wpCost(S.tier+1);if(S.gold>=c&&S.maxF>=wpReq(S.tier+1)){S.gold-=c;S.tier++;recalc();toast('⚔ '+wpName(S.tier)+'!','#7affc0');snd('lvl')}}
 else if(a==='ar'){var c2=arCost(S.arm+1);if(S.gold>=c2&&S.maxF>=arReq(S.arm+1)){S.gold-=c2;S.arm++;recalc();toast('🛡 '+AN[S.arm]+'!','#7affc0');snd('lvl')}}
 else if(a==='hone'){var hc=honeCost(S.hone|0);if(S.gold>=hc&&(S.hone|0)<20){S.gold-=hc;S.hone=(S.hone|0)+1;recalc();snd('pick')}}
 else if(a==='rein'){var rc=honeCost(S.rein|0);if(S.gold>=rc&&(S.rein|0)<20){S.gold-=rc;S.rein=(S.rein|0)+1;recalc();pl.hp=Math.min(pl.mhp,pl.hp+20);snd('pick')}}
 else if(a==='floor'){var f=+v;closePanel();enterFloor(f);ch=false}
 else if(a==='qc'){var q=QDEF[+v];if(S.q[q.key]>=q.goal&&!S.q.cl[+v]){S.q.cl[+v]=1;S.gold+=q.g;S.pot=Math.min(potMax(),S.pot+q.p);toast('+'+q.g+' 🪙','#ffd23f')}}
 else if(a==='rest'){pl.hp=pl.mhp;pl.st=pl.mst;S.pot=Math.max(S.pot,3);toast('Dinlendin','#7affc0')}
 else if(a==='prof'){if(S.prof&&S.gold<500)return;if(S.prof)S.gold-=500;S.prof=v;recalc();toast('Meslek: '+PROF[v].n,'#7affc0')}
 else if(a==='cls'){var cost=S.clsPick?300:0;if(S.gold<cost){toast('Yetersiz altın','#ff9a9a')}else{S.gold-=cost;S.cls=v;S.clsPick=1;recalc();save();toast(CL[v].n+' oldun','#ffd98a')}}else if(a==='race'){S.race=v;save()}else if(a==='look'){if(v==='diyar'){S.lookMode='diyar'}else{S.lookMode='';S.look=+v}recalc()}
 else if(a==='feast'){var fp=Math.round(120+S.lv*25);if(S.gold<fp){toast('Yeterli altının yok','#ff9a9a');ch=false}else{S.gold-=fp;S.feast=Math.max(Date.now(),S.feast||0)+20*60000;snd('pick');toast('🍖 Ziyafet: +%12 hasar 20 dk','#ffd98a');save()}}
 else if(a==='rent'){var p=String(v).split(':'),mn=+p[0],pr=+p[1];if(S.gold<pr){toast('Yeterli altının yok','#ff9a9a');ch=false}else{S.gold-=pr;var base=roomOn()?S.room.exp:Date.now();S.room={n:roomOn()?S.room.n:1+Math.floor(Math.random()*5),exp:base+mn*60000};S.roomX=0;snd('pick');toast('🔑 Oda '+S.room.n+' kiralandı','#ffd98a');if(WORLD==='town')buildTown();save()}}
 else if(a==='oath'){if(!act._o){act._o=1;setTimeout(function(){act._o=0},3500);toast(S.oath?'Yemini bozmak için tekrar bas':'Yemin etmek için tekrar bas','#ffd98a');ch=false}else{act._o=0;S.oath=S.oath?0:1;recalc();toast(S.oath?'☠ Yemin edildi':'Yemin bozuldu','#ffd98a')}}
 else if(a==='pnew'){NET.create();if(!NET.up())toast('Çevrimiçi değilsin: Ayarlar’dan aç','#ff9a9a')}
 else if(a==='pjoin'){var c=($('pj')&&$('pj').value)||'';if(!NET.join(c))toast('Kod 5 karakter olmalı','#ff9a9a')}
 else if(a==='pleave'){NET.leave()}
 else if(a==='inv'){NET.invite(v)}
 else if(a==='blk'){NET.block(v);toast('Engellendi','#ffd98a')}
 else if(a==='iacc'){var o=NET.offers()[v];if(o){NET.join(o.code);NET.declineOffer(v)}}
 else if(a==='idec'||a==='tdec'){NET.declineOffer(v)}
 else if(a==='cnew'){var tg=($('ct')&&$('ct').value)||'',was=S.clan;if(tg.length<3){toast('3-5 harf yaz','#ff9a9a')}else{if(S.gold<300&&!was){toast('Lonca için 300 🪙 gerekir','#ff9a9a')}else{if(NET.joinClan(tg)&&!was)S.gold-=300}}}
 else if(a==='cleave'){NET.leaveClan()}
 else if(a==='tsend'){var id=$('tp').value,it=$('ti').value,q=Math.max(1,Math.min(20,+$('tq').value|0)),p=Math.max(0,+$('tg').value|0);if((it==='pot'?S.pot:S.loot)<q)toast('Yeterli eşyan yok','#ff9a9a');else NET.sendOffer(id,it,q,p)}
 else if(a==='tacc'){NET.acceptOffer(v)}
 else if(a==='pot'){usePotion()}
 else if(a==='home'){closePanel();startChannel();ch=false}
 else if(a==='close'){closePanel();ch=false}
 else if(a==='net'){if(S.net){NET.stop()}else NET.start()}
 else if(a==='snd'){S.snd=S.snd?0:1}
 else if(a==='qual'){qi=(qi+1)%3;scale=[1,.75,.5][qi];S.qual=qi;resize()}
 else if(a==='chn'){S.ch=+v;NET.setLoc()}
 else if(a==='fs'){try{var d=document.documentElement;if(d.requestFullscreen)d.requestFullscreen().then(function(){try{screen.orientation.lock('landscape').catch(function(){})}catch(e){}}).catch(function(){})}catch(e){}}
 else if(a==='rep'){var t='Yüz Mühür raporu\n'+$('fps2').textContent+'\nEkran: '+innerWidth+'x'+innerHeight+' @'+(devicePixelRatio||1)+'\nKat: '+FL.n+' Sv '+S.lv+' maxF '+S.maxF+'\nAğ: '+NET.status()+'\nCihaz: '+navigator.userAgent;try{navigator.clipboard.writeText(t).then(function(){toast('Rapor kopyalandı','#7affc0')},function(){toast('Kopyalanamadı','#ff9a9a')})}catch(e){toast('Kopyalanamadı','#ff9a9a')}}
 save();if(ch)renderPanel()}
function onClick(e){var b=e.target.closest&&e.target.closest('button[data-a]');if(!b||b.disabled)return;act(b.dataset.a,b.dataset.v)}
$('pnc').addEventListener('click',onClick);$('pnt').addEventListener('click',onClick);
var fpsEl=document.createElement('span');fpsEl.id='fps2';fpsEl.style.display='none';document.body.appendChild(fpsEl);
