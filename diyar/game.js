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
var CKEYS=['lv','xp','wl','al','sw','sa'];
function fix(p){p.done=p.done||{};p.pf=p.pf||{};['wood','mine'].forEach(function(k){p.pf[k]=p.pf[k]||{l:1,x:0}});Object.keys(Y.MATS).concat(['gold','wl','al','xp']).forEach(function(k){p[k]=p[k]||0});p.lv=p.lv||1;p.cl=p.cl||{};p.rn=p.rn||{};if(p.x==null){p.x=Y.CX*TS;p.y=Y.CY*TS}return p}
function switchCls(k){if(k===P.cls)return;var o={};CKEYS.forEach(function(q){o[q]=P[q]});P.cl[P.cls]=o;var n=P.cl[k]||{lv:1,xp:0,wl:0,al:0,sw:null,sa:null};CKEYS.forEach(function(q){P[q]=n[q]==null?(q==='lv'?1:(q==='sw'||q==='sa'?null:0)):n[q]});P.cls=k;P.x=Y.CX*TS;P.y=Y.CY*TS+70;saveNow()}
/* ---------- giriş / karakter ekranları ---------- */
function gate(up){var e=$('em').value.trim(),p=$('pw').value;$('gerr').textContent='';
  if(!e||!p){$('gerr').textContent='E-posta ve şifre gerekli';return}
  if(!window.YXAcct||!YXAcct.conf()){$('gerr').textContent='Hesap sistemi şu an hazır değil';return}
  $('gin').disabled=$('gup').disabled=true;
  (up?YXAcct.signUp(e,p):YXAcct.signIn(e,p)).then(function(){toChar()}).catch(function(er){$('gerr').textContent=(er&&er.msg)||'Bir sorun oluştu'}).then(function(){$('gin').disabled=$('gup').disabled=false})}
var selCls='savasci';
function detHtml(k){var c=Y.CLASSES[k];return'<b>'+c.ic+' '+esc(c.n)+'</b> · '+esc(c.role)+'<div class="sk"><span>👊</span><div>Temel saldırı: '+(c.melee?'yakın':'uzak')+' menzil</div></div>'+c.sk.map(function(s){return'<div class="sk"><span>'+s.ic+'</span><div><b>'+esc(s.n)+'</b> · '+s.cd+' sn</div></div>'}).join('')}
function clsDet(){$('det').innerHTML=detHtml(selCls)}
function buildCls(){$('cls').innerHTML=Object.keys(Y.CLASSES).map(function(k){var c=Y.CLASSES[k];return'<button type="button" data-k="'+k+'" aria-pressed="'+(k===selCls)+'"><span class="ic">'+c.ic+'</span><b>'+esc(c.n)+'</b><small>'+esc(c.role)+'</small></button>'}).join('');
  $('cls').querySelectorAll('button').forEach(function(b){b.onclick=function(){selCls=b.dataset.k;buildCls();clsDet()}});clsDet()}
function clsCards(){return Object.keys(Y.CLASSES).map(function(k){var c=Y.CLASSES[k],lv=k===P.cls?P.lv:(P.cl[k]?P.cl[k].lv:0);return'<button type="button" data-k="'+k+'" aria-pressed="'+(k===P.cls)+'"><span class="ic">'+c.ic+'</span><b>'+esc(c.n)+'</b><small>'+(lv?'Seviye '+lv:'Yeni · henüz denenmedi')+'</small></button>'}).join('')}
function drawCold(){var c=Y.CLASSES[P.cls];
  $('cold').innerHTML='<div class="it"><span style="font-size:2rem">'+c.ic+'</span><div class="t"><b>'+esc(P.nick)+'</b><br><small>'+esc(c.n)+' · Seviye '+P.lv+' · 🪙 '+P.gold+'</small></div></div><div style="margin:10px 0 2px;font-size:.84rem;color:var(--mute)">Sınıfını seç. Her sınıfın seviyesi, silah/zırhı ve rünü ayrı saklanır; altın ve malzemeler ortaktır.</div><div class="cls" id="cls2">'+clsCards()+'</div><div class="det" id="det2">'+detHtml(P.cls)+'</div><div class="row"><button class="btn" id="cgo" type="button">Oyuna gir</button><button class="btn alt" id="cdel" type="button">Karakteri sil</button><button class="btn alt" id="cout2" type="button">Çıkış yap</button></div><div class="err" id="cerr2"></div>';
  $('cls2').querySelectorAll('button').forEach(function(b){b.onclick=function(){switchCls(b.dataset.k);drawCold()}});
  $('cgo').onclick=enter;$('cout2').onclick=function(){YXAcct.signOut();show('s-gate')};
  var armed=0;$('cdel').onclick=function(){if(!armed){armed=1;$('cdel').textContent='Emin misin? Tekrar bas';setTimeout(function(){armed=0;if($('cdel'))$('cdel').textContent='Karakteri sil'},3500);return}try{localStorage.removeItem(KEY+acct().uid)}catch(e){}P=null;toChar()}}
function toChar(){var a=acct();if(!a){show('s-gate');return}$('who').textContent=a.email;P=loadSave();show('s-char');
  if(P){fix(P);$('cnew').style.display='none';$('cold').style.display='';drawCold()}
  else{$('cnew').style.display='';$('cold').style.display='none';buildCls()}}
function mkChar(){var n=$('nick').value.trim();$('cerr').textContent='';
  if(!/^[A-Za-z0-9_ğüşöçıİĞÜŞÖÇ]{3,16}$/.test(n)){$('cerr').textContent='Takma ad 3–16 harf/rakam olmalı (boşluk yok)';return}
  P=fix({nick:n,cls:selCls,lv:1,xp:0,gold:20});saveNow();toChar()}

/* ---------- oyun başlangıcı ---------- */
function toSvgImg(){try{var s=window.YX&&YX.av?YX.av(YX.S().eq,'n'):'';if(!s)return;if(s.indexOf('xmlns')<0)s=s.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');
  if(!/<svg[^>]*\swidth=/.test(s))s=s.replace('<svg','<svg width="96" height="96"');var im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);sprite=im}catch(e){}}
function findFree(tx,ty){for(var r=0;r<14;r++)for(var dy=-r;dy<=r;dy++)for(var dx=-r;dx<=r;dx++){var x=tx+dx,y=ty+dy,z=Y.zoneAt(x,y);if(z!==3&&!Y.nodeAt(x,y))return{x:(x+.5)*TS,y:(y+.5)*TS}}return{x:(tx+.5)*TS,y:(ty+.5)*TS}}
function ang(d,deg){var a=deg*Math.PI/180;return findFree(Math.round(Y.CX+Math.cos(a)*d),Math.round(Y.CY+Math.sin(a)*d))}
function enter(){var st=Y.pstat(P);toSvgImg();
  var cx=Y.CX*TS,cy=Y.CY*TS;
  G={t:0,mode:'world',px:P.x,py:P.y,fx:1,fy:0,hp:st.maxhp,cd:[0,0,0],atkCd:0,buff:0,guard:0,guardRed:0,evade:0,hot:0,hotT:0,dead:0,lastHurt:-99,mons:[],spawns:[],efx:[],txt:[],dep:{},gather:null,near:null,dg:null,keys:{},jx:0,jy:0,hold:false,log:[],sys:[],paused:false,
    npcs:[{id:'smith',n:'Demirci',ic:'🔨',x:cx-130,y:cy-100},{id:'trader',n:'Tüccar',ic:'🧺',x:cx+130,y:cy-100},{id:'rune',n:'Rün Ustası',ic:'🔮',x:cx,y:cy-190},{id:'smelt',n:'Eritme Ocağı',ic:'🔥',x:cx+210,y:cy+300}],
    pit:{x:cx+330,y:cy+230},vill:VILL(cx,cy),houses:HOUSES(cx,cy),
    portals:[{id:'kurt',p:ang(30,15)},{id:'kristal',p:ang(50,150)},{id:'kale',p:ang(52,255)}]};
  var dx=G.px-cx,dy=G.py-cy;if(Y.zoneAt(Math.floor(G.px/TS),Math.floor(G.py/TS))===3){G.px=cx;G.py=cy+60}
  initSpawns();addMetins();buildMini();setupHud();show('hud');resize();
  try{var el=document.documentElement;if(el.requestFullscreen&&!document.fullscreenElement)el.requestFullscreen().catch(function(){})}catch(e){}
  try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(function(){})}catch(e){}
  say('Yaxest Diyarı\'na hoş geldin, '+P.nick+'! Yürü, saldır (⚔️), topla (✋). Harita: M veya mini haritaya dokun.','sys');
  say('Bu bir tek kişilik Eğitim Diyarı. Çok oyunculu diyar sunucu kurulunca açılacak.','sys');
  cancelAnimationFrame(raf);lastT=performance.now();raf=requestAnimationFrame(loop)}
function leaveGame(){cancelAnimationFrame(raf);raf=0;saveNow();G=null;toChar();try{document.fullscreenElement&&document.exitFullscreen()}catch(e){}}
function initSpawns(){G.spawns=[];
  for(var ty=4;ty<Y.MH-4;ty+=6)for(var tx=4;tx<Y.MW-4;tx+=6){var jx=tx+Math.floor(Y.hash(tx,ty,21)*4),jy=ty+Math.floor(Y.hash(tx,ty,22)*4),z=Y.zoneAt(jx,jy);if(z===3||z===4)continue;
    var dx=jx-Y.CX,dy=jy-Y.CY,d=Math.sqrt(dx*dx+dy*dy);if(d<21||Y.hash(tx,ty,23)>.55)continue;
    G.spawns.push({x:(jx+.5)*TS,y:(jy+.5)*TS,z:z,lv:Math.max(1,Y.zoneLv(z,d)),m:null,rt:0,type:z===0?(Y.hash(tx,ty,24)<.75?'slime':'boar'):z===1?(Y.hash(tx,ty,24)<.6?'wolf':'boar'):'golem'})}}
function addMetins(){Y.PVP.forEach(function(z){[[-3,-1],[3,2]].forEach(function(o){var f=findFree(z.tx+o[0],z.ty+o[1]);G.spawns.push({x:f.x,y:f.y,z:2,lv:9,m:null,rt:0,type:'metin'})})})}
function mkMon(type,lv,x,y,sp){var b=Y.MON[type],s=Y.mstat(type,lv);return{type:type,lv:lv,hp:s.hp,max:s.hp,dmg:s.dmg,xp:s.xp,gold:s.gold,x:x,y:y,sx:x,sy:y,sp:b.sp,sz:b.sz,boss:b.boss,col:b.c,n:b.n,hit:0,atkT:.6,slow:0,taunt:0,dotT:0,dotD:0,dotAcc:0,wx:0,wy:0,wt:0,sp8:sp,bob:Math.random()*6}}

var DKEY={kurt:'wolf',kristal:'crystal',kale:'castle'},DCOL={kurt:'#9b5cff',kristal:'#4fc3ff',kale:'#ff7a5c'};
var NPCV={smith:{st:'smith',look:{skin:'#e0a878',cloth:'#8a4a2a',apron:'#3a3a44',hair:'#3a2418',beard:'#5a3a22',prop:'hammer',hat:'band',brow:'#3a2418'},px:-4,py:16},trader:{st:'trader',px:64,py:18,look:{cloth:'#2f8f8a',hat:'cap',prop:'sack',hair:'#6b3a1a',belt:'#6b4a2b'}},rune:{st:'rune',px:0,py:14,look:{skin:'#e9d9c8',cloth:'#5a3f9a',star:1,hat:'wizard',prop:'orb',hair:'#ddd',brow:'#ccc'}},smelt:{st:'furnace',sy:20}};
var LOOK={'Bekçi':{cloth:'#3b5ba8',hat:'helmet',prop:'spear',belt:'#6b4a2b',brow:'#2a1a10'},'Madenci Dede':{cloth:'#8a8f9c',hat:'hard',beard:'#f0f0f0',prop:'pick',apron:'#6b4a2b',brow:'#ddd'},'Çocuk':{s:.72,cloth:'#d94f4f',hair:'#5a3a22'},'Avcı':{cloth:'#3f7a4a',hat:'hood',prop:'bow',cape:'#2d5a38',belt:'#6b4a2b'},'Rünci Çırak':{s:.88,cloth:'#6a4fb0',hat:'wizard',prop:'scroll',hair:'#e0a0c0'},'Şifacı Nine':{cloth:'#8a5ab0',hair:'#f4f4f4',bun:1,prop:'herbs',apron:'#e8e0f0'},'Gezgin':{cloth:'#a08060',hat:'wide',prop:'lantern',cape:'#6b4a2b'},'Balıkçı':{cloth:'#4d7ea8',hat:'straw',prop:'rod',skin:'#d9a070'}};
function VILL(cx,cy){var L=[['Bekçi','💂',-60,120,['Kasaba güvenli bölge: burada kimse sana zarar veremez. Kızıl Vadi ve Kurt Geçidi\'nde ise PvP açık!']],['Madenci Dede','⛏️',250,170,['Madencilik seviyen yükseldikçe gümüş, altın ve mitril damarlarını kırabilirsin. Cevheri ocakta erit!','Bakır 2, Demir 4, Gümüş 6, Altın 8, Mitril 10. seviyede açılır.']],['Çocuk','🧒',-200,-40,['Kurt İni\'nde Alfa Kurt varmış, ama sürüsüyle gelir!']],['Avcı','🏹',-300,60,['Kurtlar ormanda, golemler kayalıkta. Seviyene bak!']],['Rünci Çırak','🔮',90,-150,['Rünler silaha ve zırha takılır. Metin taşlarından nadir malzeme düşer.']],['Şifacı Nine','🌿',170,40,['Kasabada canın hızla dolar, acele etme.']],['Gezgin','🧭',-120,-210,['Haritayı M tuşuyla ya da mini haritaya dokunarak aç.']],['Balıkçı','🎣',320,-60,['Balık tutmak yakında geliyor. Göller boşuna durmuyor!']]];return L.map(function(l){return{n:l[0],ic:l[1],look:LOOK[l[0]],ph:l[2],x:cx+l[2],y:cy+l[3],hx:cx+l[2],hy:cy+l[3],l:l[4],wt:Math.random()*2,wx:0,wy:0}})}
function HOUSES(cx,cy){var h=[],cols=['#a8553a','#4d7ea8','#8a6bb0','#b8913a','#5d9a6a'];for(var i=0;i<12;i++){var a=i/12*6.283+.3,r=i%2?410:460;var hx=cx+Math.cos(a)*r,hy=cy+Math.sin(a)*r*.9;if(Math.hypot(hx-(cx+330),hy-(cy+230))<190)continue;h.push({x:hx,y:hy,c:cols[i%5],w:i%3===0?96:76})}return h}
var RUNES={kurt:{n:'Kurt Rünü',ic:'🐺',slot:'w',d:'Kritik şansı +%15',c:{fang:3,gold:30}},kristal:{n:'Kristal Rünü',ic:'💎',slot:'w',d:'Beceri bekleme süresi -%20',c:{crystal:2,gold:50}},orman:{n:'Orman Rünü',ic:'🌲',slot:'a',d:'Can yenilenmesi: saniyede %1.5',c:{wood:8,stone:2,gold:20}},demir:{n:'Demir Rünü',ic:'⛓️',slot:'a',d:'Hasar azaltma +%8',c:{i_iron:1,stone:3,gold:25}}};
/* ---------- yardımcılar ---------- */
function S(){var s=Y.pstat(P);s.crit=0;s.cdm=1;s.regen=0;if(P.sw==='kurt')s.crit=.15;if(P.sw==='kristal')s.cdm=.8;if(P.sa==='orman')s.regen=.015;if(P.sa==='demir')s.red=Math.min(.6,s.red+.08);return s}function C(){return Y.CLASSES[P.cls]}
function say(t,k){G.log.push(t);if(G.log.length>5)G.log.shift();if(k!=='x'){G.sys.push(t);if(G.sys.length>60)G.sys.shift()}renderLog()}
function renderLog(){$('log').innerHTML=G.log.map(function(l){return'<div>'+esc(l)+'</div>'}).join('')}
function floatTxt(x,y,s,c){G.txt.push({x:x,y:y,s:YA.plain(s),c:c||'#fff',t:0})}
function addFx(o){o.t=0;G.efx.push(o)}
function blocked(x,y){var tx=Math.floor(x/TS),ty=Math.floor(y/TS);if(G.mode==='dungeon')return tx<1||ty<1||tx>=AW-1||ty>=AH-1;return Y.zoneAt(tx,ty)===3}
function moveH(dx,dy){if(!blocked(G.px+dx,G.py))G.px+=dx;if(!blocked(G.px,G.py+dy))G.py+=dy}
function moveE(e,dx,dy){if(!blocked(e.x+dx,e.y))e.x+=dx;if(!blocked(e.x,e.y+dy))e.y+=dy}
function curMons(){return G.mode==='dungeon'?G.dg.mons:G.mons}
function nearest(range,from){var best=null,bd=1e9,list=curMons();for(var i=0;i<list.length;i++){var m=list[i];if(m.dead)continue;var d=hyp(m.x-(from?from.x:G.px),m.y-(from?from.y:G.py))-m.sz;if(d<range&&d<bd){bd=d;best=m}}return best}
function giveXp(n){P.xp+=n;var lv=false;while(P.lv<Y.MAXLV&&P.xp>=Y.xpNeed(P.lv)){P.xp-=Y.xpNeed(P.lv);P.lv++;lv=true}
  if(lv){G.hp=S().maxhp;floatTxt(G.px,G.py-50,'SEVİYE '+P.lv+'!','#ffd23f');say('Seviye atladın: '+P.lv,'sys');addFx({k:'ring',x:G.px,y:G.py,r:110,c:'#ffd23f',l:.7})}}
function giveProf(k,n){var p=P.pf[k];p.x+=n;while(p.x>=Y.profNeed(p.l)){p.x-=Y.profNeed(p.l);p.l++;say(Y.PROF[k]+' seviyen '+p.l+' oldu!','sys')}}

/* ---------- savaş ---------- */
function inTownF(){return !!G&&G.mode==='world'&&hyp(G.px-Y.CX*TS,G.py-Y.CY*TS)<TS*10}
function pvpAt(x,y){for(var i=0;i<Y.PVP.length;i++){var z=Y.PVP[i];if(hyp(x/TS-(z.tx+.5),y/TS-(z.ty+.5))<z.r)return z}return null}
function hurt(d,from){if(inTownF())return;if(G.dead>0)return;if(G.evade>0)return;
  var v=d*(1-S().red)*(G.guard>0?(1-G.guardRed):1);v=Math.max(1,Math.round(v));G.hp-=v;G.lastHurt=G.t;floatTxt(G.px,G.py-34,'-'+v,'#ff6b7a');
  if(G.hp<=0){G.hp=0;die()}}
function die(){G.dead=3;G.gather=null;say('Yenildin! Kasabada yeniden doğacaksın.','sys');var lost=Math.floor(P.gold*.08);P.gold-=lost;if(lost)say('🪙 '+lost+' altın kaybettin.','sys')}
function respawn(){G.dead=0;if(G.mode==='dungeon'){G.mode='world';G.dg=null}G.px=Y.CX*TS;G.py=Y.CY*TS+70;G.hp=S().maxhp;G.buff=G.guard=G.evade=G.hot=0}
function dmgMon(m,d,dot,crit){if(m.dead)return;d=Math.max(1,Math.round(d));m.hp-=d;m.hit=5;floatTxt(m.x,m.y-m.sz-14,(crit?'✦':'')+d,dot?'#9be37a':crit?'#ffd23f':'#fff');if(m.hp<=0)killMon(m);else if(m.type==='metin')metinPh(m)}
function metinPh(m){var ph=Math.floor((1-m.hp/m.max)*4);m.ph=m.ph||0;while(m.ph<ph){m.ph++;say('Metin Taşı canavarları çağırıyor!','sys');for(var i=0;i<2;i++){var a=Math.random()*6.28,x=m.x+Math.cos(a)*70,y=m.y+Math.sin(a)*70;if(blocked(x,y)){x=m.x;y=m.y+60}var w=mkMon(m.ph%2?'wolf':'golem',Math.max(1,m.lv-1),x,y,null);w.sx=x;w.sy=y;w.hit=9;G.mons.push(w)}}}
function killMon(m){m.dead=1;if(m.type==='metin'){P.crystal+=1+(Math.random()<.5?1:0);P.silver+=2;P.fang+=2;say('Metin Taşı yıkıldı! Kristal, gümüş ve kurt dişi düştü.','sys')}giveXp(m.xp);P.gold+=m.gold;floatTxt(m.x,m.y-m.sz-30,'+'+m.xp+' XP','#7ab8ff');
  if(G.mode==='world'){if(m.sp8){m.sp8.m=null;m.sp8.rt=m.type==='metin'?150:20+Math.random()*12}
    var r=Math.random();if(r<.28){P.wood++;say('+1 Odun','x')}else if(r<.5){P.stone++;say('+1 Taş','x')}
    var i=G.mons.indexOf(m);if(i>=0)G.mons.splice(i,1)}
  else dgCheck()}
function attack(){if(G.atkCd>0||G.dead>0)return;var st=S(),c=C(),t=nearest(st.rng+(c.melee?16:0));G.atkCd=st.aspd;G.swT=.18;
  if(!t){addFx({k:'swing',x:G.px,y:G.py,fx:G.fx,fy:G.fy,c:c.col,l:.12});G.atkCd=Math.min(.3,st.aspd);return}
  var dx=t.x-G.px,dy=t.y-G.py,h=hyp(dx,dy)||1;G.fx=dx/h;G.fy=dy/h;
  var crit=Math.random()<(P.cls==='suikastci'?.22:.1)+S().crit,d=st.dmg*(G.buff>0?1.5:1)*(.9+Math.random()*.2)*(crit?1.7:1);
  if(c.melee)addFx({k:'swing',x:G.px,y:G.py,fx:G.fx,fy:G.fy,c:c.col,l:.15});else addFx({k:'line',x1:G.px,y1:G.py,x2:t.x,y2:t.y,c:c.col,l:.14,w:3});
  dmgMon(t,d,0,crit)}
function cast(i){if(G.dead>0)return;var c=C(),s=c.sk[i];if(!s||G.cd[i]>0)return;var st=S(),base=st.dmg*(G.buff>0?1.5:1),list=curMons(),used=false,k=s.kind;
  if(k==='aoe'){used=true;addFx({k:'ring',x:G.px,y:G.py,r:s.r,c:c.col,l:.4});list.slice().forEach(function(m){if(!m.dead&&hyp(m.x-G.px,m.y-G.py)<s.r+m.sz){dmgMon(m,base*s.m);if(s.slow)m.slow=s.slow}})}
  else if(k==='dash'){used=true;var n=12,sx=G.px,sy=G.py;for(var j=0;j<n;j++){var nx=G.px+G.fx*s.d/n,ny=G.py+G.fy*s.d/n;if(blocked(nx,ny))break;G.px=nx;G.py=ny}
    addFx({k:'line',x1:sx,y1:sy,x2:G.px,y2:G.py,c:c.col,l:.25,w:10});if(s.r)list.slice().forEach(function(m){if(!m.dead&&hyp(m.x-G.px,m.y-G.py)<s.r+m.sz)dmgMon(m,base*s.m)})}
  else if(k==='buff'){used=true;G.buff=s.dur;addFx({k:'ring',x:G.px,y:G.py,r:60,c:c.col,l:.5});floatTxt(G.px,G.py-50,'Hasar +%50','#ffb27a')}
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
  var n=nodeNear();return n?{t:'node',o:n}:null}
function interact(){var n=findNear();if(!n)return;
  if(n.t==='npc')openNpc(n.o.id);
  else if(n.t==='portal')enterDg(n.o.id);
  else if(n.t==='exit')exitDg();
  else if(n.t==='vill'){say(n.o.n+': '+n.o.l[Math.floor(Math.random()*n.o.l.length)],'sys')}
  else if(n.t==='pit'){if(G.gather&&G.gather.o.key==='pit'){G.gather=null;return}G.gather={o:{key:'pit',kind:'pit'},t:0,need:2.6}}
  else if(n.t==='node'){if(G.gather&&G.gather.o.key===n.o.key){G.gather=null;return}var d=Y.NODE[n.o.kind];if(P.pf[d.prof].l<(d.req||1)){say(d.n+': '+Y.PROF[d.prof]+' seviye '+d.req+' gerekir.','sys');return}G.gather={o:n.o,t:0,need:d.t}}}
function gatherDone(){var o=G.gather.o;if(o.kind==='pit'){var pf0=P.pf.mine,a=1+Math.floor(pf0.l/2)+(Math.random()<.5?1:0),ex='';P.stone+=a;if(pf0.l>=2&&Math.random()<.5){P.copper++;ex+=' +1🟤'}if(pf0.l>=4&&Math.random()<.3){P.iron++;ex+=' +1⛓️'}if(pf0.l>=6&&Math.random()<.15){P.silver++;ex+=' +1⚪'}giveProf('mine',2);giveXp(3);floatTxt(G.px,G.py-40,'+'+a+'🪨'+ex,'#fff');say('Ocaktan +'+a+' Taş'+ex,'x');G.gather={o:o,t:0,need:2.6};return}
  var d=Y.NODE[o.kind],pf=P.pf[d.prof],y=1+(pf.l>=3?1:0)+(pf.l>=6?1:0)+(Math.random()<.2?1:0);
  P[d.mat]+=y;G.dep[o.key]=G.t+45;giveProf(d.prof,1);giveXp(2);floatTxt(G.px,G.py-40,'+'+y+' '+Y.MATS[d.mat].ic,'#fff');say('+'+y+' '+Y.MATS[d.mat].n,'x');G.gather=null}

/* ---------- zindan ---------- */
function enterDg(id){var d=Y.DUNGEONS[id];
  if(P.lv<d.lv){say(d.n+': en az seviye '+d.lv+' gerekir.','sys');return}
  if(d.party>1){say(d.n+': en az '+d.party+' kişilik parti gerekir. Parti sistemi çok oyunculu diyarda açılacak.','sys');return}
  if(!d.waves.length){say(d.n+' henüz hazır değil.','sys');return}
  G.saveW={x:G.px,y:G.py};G.mode='dungeon';G.gather=null;G.dg={id:id,wave:-1,mons:[],done:false,wait:1.4,lv:d.lv+Math.max(0,Math.floor((P.lv-d.lv)/2)),ex:AW*TS/2,ey:AH*TS/2};
  G.px=AW*TS/2;G.py=(AH-2.5)*TS;G.fx=0;G.fy=-1;G.hp=S().maxhp;say(d.n+' başladı!','sys')}
function dgWave(){var dg=G.dg,d=Y.DUNGEONS[dg.id],w=d.waves[dg.wave];if(!w)return;var add=function(t,c){for(var i=0;i<c;i++){var m=mkMon(t,dg.lv,(3+Math.random()*(AW-6))*TS,(2+Math.random()*4)*TS);m.sx=m.x;m.sy=m.y;m.hit=9;dg.mons.push(m)}};
  add(w.t,w.c);if(w.extra)add(w.extra.t,w.extra.c);say('Dalga '+(dg.wave+1)+'/'+d.waves.length+(w.t==='alpha'||w.t==='guardian'?' — BOSS!':''),'sys')}
function dgCheck(){var dg=G.dg;if(!dg||dg.done)return;if(dg.mons.every(function(m){return m.dead}))dg.wait=1.6}
function dgDone(){var dg=G.dg,d=Y.DUNGEONS[dg.id],r=d.reward;dg.done=true;P.done[dg.id]=(P.done[dg.id]||0)+1;P.gold+=r.gold;giveXp(r.xp);if(r.fang)P.fang+=r.fang;if(r.crystal)P.crystal+=r.crystal;
  say(d.n+' fethedildi! +🪙'+r.gold+' +'+r.xp+' XP'+(r.fang?' +'+r.fang+' 🦷':'')+(r.crystal?' +'+r.crystal+' 💎':''),'sys');saveNow()}
function exitDg(){G.mode='world';G.px=G.saveW.x;G.py=G.saveW.y;G.dg=null;G.hp=Math.min(S().maxhp,G.hp+Math.round(S().maxhp*.3))}

/* ---------- panel içerikleri ---------- */
function openPan(id){['p-bag','p-npc','p-chat','p-menu','p-map'].forEach(function(x){$(x).classList.toggle('on',x===id)});if(G)G.paused=!!id}
function closePan(){openPan(null)}
function bar(v,mx,c){return'<div class="bar" style="margin-top:2px"><i style="width:'+Math.min(100,Math.round(v/mx*100))+'%;background:'+c+'"></i></div>'}
function drawBag(){var c=C(),st=S(),h='<div class="it"><span style="font-size:1.8rem">'+c.ic+'</span><div class="t"><b>'+esc(P.nick)+'</b> · '+esc(c.n)+' · Seviye '+P.lv+'<br><small>Can '+st.maxhp+' · Hasar '+st.dmg+' · Zırh %'+Math.round(st.red*100)+'</small></div></div>';
  h+='<div class="it"><div class="t">⚔️ Silah <b>+'+P.wl+'</b> · 🛡️ Zırh <b>+'+P.al+'</b><br><small>Demirci kasabadadır.</small></div><div>🪙 '+P.gold+'</div></div>';
  h+=Object.keys(Y.MATS).filter(function(k){return P[k]>0||k==='wood'||k==='stone'}).map(function(k){var m=Y.MATS[k];return'<div class="it"><span style="font-size:1.3rem">'+m.ic+'</span><div class="t">'+m.n+'</div><b>'+P[k]+'</b></div>'}).join('');
  h+=Object.keys(Y.PROF).map(function(k){var p=P.pf[k];return'<div class="it"><div class="t">'+Y.PROF[k]+' <b>'+p.l+'</b>'+bar(p.x,Y.profNeed(p.l),'#5be39a')+'</div></div>'}).join('');
  h+='<div class="it"><div class="t"><small>Beceriler: '+c.sk.map(function(s){return s.ic+' '+s.n}).join(' · ')+'</small></div></div>';$('bagc').innerHTML=h}
function costTxt(c){var t=(c.wood?'🪵'+c.wood+' ':'')+(c.stone?'🪨'+c.stone+' ':'');if(c.ik)t+=Y.MATS[c.ik].ic+c.ic+' ';return t+'🪙'+c.gold}
function can(c){return P.wood>=c.wood&&P.stone>=c.stone&&P.gold>=c.gold&&(!c.ik||P[c.ik]>=c.ic)}
function openNpc(id){openPan('p-npc');if(id==='smelt'){$('npt').innerHTML='🔥 Eritme Ocağı';drawSmelt();return}if(id==='rune'){$('npt').innerHTML='🔮 Rün Ustası';drawRune();return}if(id==='smith'){$('npt').innerHTML='🔨 Demirci';drawSmith()}else{$('npt').innerHTML='🧺 Tüccar';drawTrader()}}
function drawSmith(){var h='';[['w','⚔️ Silah',P.wl],['a','🛡️ Zırh',P.al]].forEach(function(r){var c=Y.upCost(r[0],r[2]+1),ok=can(c)&&r[2]<12;
  h+='<div class="it"><div class="t"><b>'+r[1]+' +'+r[2]+'</b> → +'+(r[2]+1)+'<br><small>'+(r[2]>=12?'En üst seviye':costTxt(c))+'</small></div><button class="btn" data-up="'+r[0]+'" '+(ok?'':'disabled')+' type="button">Geliştir</button></div>'});
  h+='<p class="sub">Silah hasarı, zırh can ve hasar azaltma verir. Malzemeyi ormandan, kayalıktan ve canavarlardan topla.</p>';$('npc').innerHTML=h;
  $('npc').querySelectorAll('[data-up]').forEach(function(b){b.onclick=function(){var k=b.dataset.up,n=(k==='w'?P.wl:P.al)+1,c=Y.upCost(k,n);if(!can(c))return;P.wood-=c.wood;P.stone-=c.stone;if(c.ik)P[c.ik]-=c.ic;P.gold-=c.gold;if(k==='w')P.wl++;else{P.al++;G.hp=Math.min(S().maxhp,G.hp+10)}say((k==='w'?'Silahın':'Zırhın')+' +'+n+' oldu!','sys');saveNow();drawSmith()}})}
function drawSmelt(){var h='<p class="sub">2 cevher + 1 odun = 1 külçe. Üst seviye silah ve zırh geliştirmeleri külçe ister. Değerli damarlar için yüksek Madencilik seviyesi gerekir.</p>';
  Object.keys(Y.SMELT).forEach(function(o){var i=Y.SMELT[o],m=Y.MATS[o],t=Y.MATS[i],mx=Math.min(Math.floor(P[o]/2),P.wood);
    h+='<div class="it"><span style="font-size:1.3rem">'+m.ic+'→'+t.ic+'</span><div class="t"><b>'+t.n+'</b> · elinde '+P[i]+'<br><small>'+m.n+' '+P[o]+' · Odun '+P.wood+'</small></div><div style="display:grid;gap:4px"><button class="btn" data-m="'+o+'" data-n="1" '+(mx>0?'':'disabled')+' type="button">Erit</button><button class="btn alt" data-m="'+o+'" data-n="'+mx+'" '+(mx>1?'':'disabled')+' type="button">Hepsi ('+mx+')</button></div></div>'});
  $('npc').innerHTML=h;$('npc').querySelectorAll('[data-m]').forEach(function(b){b.onclick=function(){var o=b.dataset.m,n=+b.dataset.n;if(n<1||P[o]<2*n||P.wood<n)return;P[o]-=2*n;P.wood-=n;P[Y.SMELT[o]]+=n;giveProf('mine',n);say(n+' '+Y.MATS[Y.SMELT[o]].n+' eritildi.','sys');saveNow();drawSmelt()}})}
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
function drawChat(){var tabs=['Sistem','Dünya','Yerel','Klan','Parti'];$('ctabs').innerHTML=tabs.map(function(t,i){return'<button type="button" data-i="'+i+'" aria-pressed="'+(i===chatTab)+'">'+t+'</button>'}).join('');
  $('ctabs').querySelectorAll('button').forEach(function(b){b.onclick=function(){chatTab=+b.dataset.i;drawChat()}});
  $('cmsgs').innerHTML=chatTab===0?G.sys.map(function(l){return'<div>'+esc(l)+'</div>'}).join(''):'<div style="color:var(--mute)">Bu kanal çok oyunculu diyar açılınca çalışacak.</div>';
  $('cnote').textContent=chatTab===0?'':'Sohbet kuralları: hazır cümleler + filtreli yazı, şikâyet ve engelleme. Sesli sohbet ileride.'}

/* ---------- girdi ---------- */
var keyMap={w:'u',arrowup:'u',s:'d',arrowdown:'d',a:'l',arrowleft:'l',d:'r',arrowright:'r'};
addEventListener('keydown',function(e){if(G&&e.key.toLowerCase()==='m'){if($('p-map').classList.contains('on'))closePan();else if(G.mode==='world'&&!G.paused){drawMap();openPan('p-map')}return}if(!G||G.paused&&e.key!=='Escape')return;var k=e.key.toLowerCase();
  if(keyMap[k]){G.keys[keyMap[k]]=1;e.preventDefault()}else if(k===' '){G.hold=true;e.preventDefault()}else if(k==='1')cast(0);else if(k==='2')cast(1);else if(k==='3')cast(2);else if(k==='e'||k==='f')interact();
  else if(k==='i'){drawBag();openPan('p-bag')}else if(k==='enter'){drawChat();openPan('p-chat')}else if(k==='escape'){G.paused?closePan():openPan('p-menu')}});
addEventListener('keyup',function(e){if(!G)return;var k=e.key.toLowerCase();if(keyMap[k])G.keys[keyMap[k]]=0;if(k===' ')G.hold=false});
function setupHud(){var c=C();if(!$('zn')){var zn=document.createElement('div');zn.id='zn';zn.style.cssText='position:absolute;top:10px;left:50%;transform:translateX(-50%);padding:5px 14px;border-radius:999px;font-weight:800;font-size:.8rem;background:rgba(0,0,0,.55);border:1.5px solid;pointer-events:none;display:none;white-space:nowrap';$('hud').appendChild(zn)}$('b0').innerHTML=c.ic;
  [1,2,3].forEach(function(n){var s=c.sk[n-1],b=$('b'+n);b.innerHTML=s.ic+'<small>'+n+'</small><i class="cd"></i>'});
  $('hav').innerHTML=window.YX&&YX.av?YX.av(YX.S().eq,'n'):'';$('hn').textContent=P.nick;
  var jy=$('joy'),jk=$('jk'),pid=null;
  function jm(e){var r=jy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,d=hyp(dx,dy),m=52;if(d>m){dx=dx/d*m;dy=dy/d*m}jk.style.transform='translate('+dx+'px,'+dy+'px)';var n=hyp(dx,dy)/m;G.jx=n>.15?dx/m:0;G.jy=n>.15?dy/m:0}
  jy.onpointerdown=function(e){pid=e.pointerId;try{jy.setPointerCapture(pid)}catch(x){}jm(e);e.preventDefault()};jy.onpointermove=function(e){if(e.pointerId===pid)jm(e)};
  var jend=function(e){if(e.pointerId!==pid)return;pid=null;jk.style.transform='';if(G){G.jx=0;G.jy=0}};jy.onpointerup=jend;jy.onpointercancel=jend;
  var b0=$('b0');b0.onpointerdown=function(e){G.hold=true;attack();e.preventDefault()};b0.onpointerup=b0.onpointercancel=b0.onpointerleave=function(){if(G)G.hold=false};
  [1,2,3].forEach(function(n){$('b'+n).onpointerdown=function(e){cast(n-1);e.preventDefault()}});$('bi').onpointerdown=function(e){interact();e.preventDefault()}}
$('mm').onclick=function(){if(G&&G.mode==='world'&&!G.paused){drawMap();openPan('p-map')}};$('ibag').onclick=function(){if(!G)return;drawBag();openPan('p-bag')};$('ichat').onclick=function(){if(!G)return;drawChat();openPan('p-chat')};$('imenu').onclick=function(){if(G)openPan('p-menu')};
document.querySelectorAll('[data-close]').forEach(function(b){b.onclick=closePan});
$('mfs').onclick=function(){try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen()}catch(e){}};
$('mchar').onclick=function(){closePan();leaveGame()};
$('gin').onclick=function(){gate(0)};$('gup').onclick=function(){gate(1)};$('cmk').onclick=mkChar;$('cout').onclick=function(){YXAcct.signOut();show('s-gate')};

/* ---------- güncelleme ---------- */
function update(dt){G.t+=dt;if(G.swT>0)G.swT-=dt;var st=S(),c=C();
  if(G.dead>0){G.dead-=dt;if(G.dead<=0)respawn();return}
  for(var i=0;i<3;i++)if(G.cd[i]>0)G.cd[i]-=dt;if(G.atkCd>0)G.atkCd-=dt;if(G.buff>0)G.buff-=dt;if(G.guard>0)G.guard-=dt;if(G.evade>0)G.evade-=dt;
  if(G.hot>0){G.hot-=dt;G.hotT+=dt;if(G.hotT>=1){G.hotT=0;G.hp=Math.min(st.maxhp,G.hp+st.maxhp*G.hotAmt)}}
  if(st.regen&&G.hp<st.maxhp)G.hp=Math.min(st.maxhp,G.hp+st.maxhp*st.regen*dt);
  var inTown=inTownF();
  if(G.hp<st.maxhp&&(inTown||G.t-G.lastHurt>6))G.hp=Math.min(st.maxhp,G.hp+st.maxhp*(inTown?.04:.01)*dt);
  var mx=(G.keys.r?1:0)-(G.keys.l?1:0)+G.jx,my=(G.keys.d?1:0)-(G.keys.u?1:0)+G.jy,ml=hyp(mx,my);
  if(ml>1){mx/=ml;my/=ml}
  if(ml>.1){G.fx=mx/(ml>1?1:ml)*(ml>1?1:1);var fl=hyp(mx,my)||1;G.fx=mx/fl;G.fy=my/fl;G.gather=null;var sp=st.spd*(G.evade>0?1.5:1)*(G.gather?0:1);moveH(mx*sp*dt,my*sp*dt)}
  if(G.hold)attack();
  if(G.gather){G.gather.t+=dt;if(G.gather.t>=G.gather.need)gatherDone()}
  if(G.mode==='world'){worldMons(dt);G.vill.forEach(function(v){v.wt-=dt;if(v.wt<=0){v.wt=1+Math.random()*3;var a=Math.random()*6.28;v.wx=Math.random()<.4?0:Math.cos(a);v.wy=v.wx?Math.sin(a):0}var nx=v.x+v.wx*28*dt,ny=v.y+v.wy*28*dt;if(hyp(nx-v.hx,ny-v.hy)<130){v.x=nx;v.y=ny}})}else dgUpdate(dt);
  var list=curMons();for(var k=0;k<list.length;k++)monAi(list[k],dt);
  if(G.mode==='world'){var pz=pvpAt(G.px,G.py);if(pz!==G.pz){G.pz=pz;say(pz?'⚔️ '+pz.n+': PvP bölgesi! Çok oyunculu diyarda diğer oyuncular sana saldırabilir. Metin Taşlarını kır!':'PvP bölgesinden çıktın.','sys')}}
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
  if(chase){if(dist>m.sz+18){moveE(m,dx/dist*sp*dt,dy/dist*sp*dt)}else{m.atkT-=dt;if(m.atkT<=0){m.atkT=1.15;if(m.dmg>0)hurt(m.dmg)}}}
  else{m.wt-=dt;if(m.wt<=0){m.wt=1.5+Math.random()*2;var a=Math.random()*6.28;m.wx=Math.cos(a);m.wy=Math.sin(a);if(hyp(m.x-m.sx,m.y-m.sy)>120){var hx=m.sx-m.x,hy=m.sy-m.y,hh=hyp(hx,hy)||1;m.wx=hx/hh;m.wy=hy/hh}}
    moveE(m,m.wx*sp*.35*dt,m.wy*sp*.35*dt)}}

/* ---------- çizim ---------- */
function resize(){dpr=Math.min(window.devicePixelRatio||1,2);VW=innerWidth;VH=innerHeight;cv.width=Math.round(VW*dpr);cv.height=Math.round(VH*dpr);
  var port=VH>VW&&('ontouchstart' in window);if(!port)window.__rotSeen=0;var showR=port&&G&&!window.__rotSeen&&!window.__portOk;$('rot').style.display=showR?'flex':'none';if(showR){clearTimeout(window.__rotT);window.__rotT=setTimeout(function(){$('rot').style.display='none';window.__rotSeen=1},9000);try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}}}
var rb=document.getElementById('rotgo');if(rb)rb.onclick=function(){window.__rotSeen=1;$('rot').style.display='none'};
addEventListener('resize',resize);addEventListener('orientationchange',resize);
var ZC=['#3f7d48','#2f6a3c','#6b7083','#2b66a8','#b9a47d'];
function tileCol(tx,ty,z){var h=Y.hash(tx,ty,5);if(G.mode==='dungeon'){return(tx<1||ty<1||tx>=AW-1||ty>=AH-1)?'#15112a':((tx+ty)%2?'#3a3052':'#352c4b')}
  var c=ZC[z];if(z===3){return h<.5?'#2b66a8':'#2f6fb2'}var k=Math.floor(h*3);var d=k===0?-6:k===1?0:6;return shade(c,d)}
function shade(hex,d){var n=parseInt(hex.slice(1),16),r=(n>>16)+d,g=(n>>8&255)+d,b=(n&255)+d;r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));return'rgb('+r+','+g+','+b+')'}
function drawNode(kind,x,y){YA.node(ctx,kind,x,y,Y.NODE)}
function drawMon(m,t){YA.monster(ctx,m,t,G.px,G.py);var top=m.type==='metin'?m.y-m.sz*1.7-8:m.y-m.sz-14,w=m.type==='metin'?76:Math.max(36,m.sz*2.2);ctx.fillStyle='rgba(10,6,24,.7)';ctx.fillRect(m.x-w/2-1,top-1,w+2,7);ctx.fillStyle=m.type==='metin'?'#b57bff':m.boss?'#ff9d3d':'#ff5b6e';ctx.fillRect(m.x-w/2,top,w*Math.max(0,m.hp/m.max),5);YA.plate(ctx,m.x,top-10,m.n+' '+m.lv,m.boss?'#ff9d3d':null)}
function drawHero(t){var x=G.px,y=G.py,c=C(),mv=!!(G.jx||G.jy||G.keys.u||G.keys.d||G.keys.l||G.keys.r),ang=Math.atan2(G.fy,G.fx),sw=G.swT>0?(G.swT/.18-.5)*1.9:0;
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,y+22,20,8,0,0,6.28);ctx.fill();
  var gl=ctx.createRadialGradient(x,y+20,2,x,y+20,34);gl.addColorStop(0,c.col);gl.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=.55;ctx.fillStyle=gl;ctx.beginPath();ctx.ellipse(x,y+20,34,13,0,0,6.28);ctx.fill();ctx.globalAlpha=G.evade>0?.4:1;
  if(G.fy<-.3)YA.weapon(ctx,P.cls,x,y-2,ang,sw,t);
  if(sprite&&sprite.complete&&sprite.naturalWidth)ctx.drawImage(sprite,x-24,y-28+Math.sin(t*(mv?10:2.4))*(mv?2.5:1),48,48);else{ctx.fillStyle=c.col;ctx.beginPath();ctx.arc(x,y,18,0,6.28);ctx.fill()}
  if(G.fy>=-.3)YA.weapon(ctx,P.cls,x,y-2,ang,sw,t);
  ctx.globalAlpha=1;
  if(G.guard>0){ctx.strokeStyle='#5cb4ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,34,0,6.28);ctx.stroke()}if(G.buff>0){ctx.strokeStyle='#ffb27a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,38,0,6.28);ctx.stroke()}
  YA.plate(ctx,x,y-40,P.nick,c.col);
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
    G.npcs.forEach(function(o){var nv=NPCV[o.id];ents.push({y:o.y+(o.id==='smelt'?30:0),f:function(){YA.station(ctx,nv.st,o.x,o.y+(nv.sy||14),t);if(nv.look){YA.person(ctx,o.x+(nv.px||0),o.y+(nv.py||14),nv.look,t,false);YA.plate(ctx,o.x+(nv.px||0),o.y+(nv.py||14)-(nv.look.hat==='wizard'?86:70),o.n,'#ffd23f')}else YA.plate(ctx,o.x,o.y-80,o.n,'#ffd23f')}})});
    G.portals.forEach(function(p){var d=Y.DUNGEONS[p.id];ents.push({y:p.p.y+40,f:function(){YA.portal(ctx,p.p.x,p.p.y,t,DCOL[p.id],d.n+' · Sv '+d.lv+(d.party>1?' · '+d.party+' kişi':''),DKEY[p.id])}})});
  }
  else if(G.dg.done){ents.push({y:G.dg.ey,f:function(){ctx.fillStyle='rgba(91,227,154,.35)';ctx.beginPath();ctx.ellipse(G.dg.ex,G.dg.ey,36,42,0,0,6.28);ctx.fill();ctx.strokeStyle='#5be39a';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#fff';ctx.font='700 12px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText('ÇIKIŞ',G.dg.ex,G.dg.ey-50)}})}
  curMons().forEach(function(m){if(!m.dead)ents.push({y:m.y,f:function(){drawMon(m,t)}})});ents.push({y:G.py,f:function(){drawHero(t)}});
  ents.sort(function(a,b){return a.y-b.y});ents.forEach(function(e){e.f()});
  G.efx.forEach(function(f){var a=1-f.t/f.l;ctx.globalAlpha=Math.max(0,a);ctx.strokeStyle=f.c;
    if(f.k==='ring'){ctx.lineWidth=5;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(.4+.6*(1-a)),0,6.28);ctx.stroke()}
    else if(f.k==='line'){ctx.lineWidth=f.w||4;ctx.beginPath();ctx.moveTo(f.x1,f.y1);ctx.lineTo(f.x2,f.y2);ctx.stroke()}
    else if(f.k==='swing'){var an=Math.atan2(f.fy,f.fx);ctx.lineWidth=6;ctx.beginPath();ctx.arc(f.x,f.y,44,an-.9,an+.9);ctx.stroke()}ctx.globalAlpha=1});
  G.txt.forEach(function(f){ctx.globalAlpha=Math.max(0,1-f.t);ctx.fillStyle=f.c;ctx.font='800 14px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=3;ctx.strokeText(f.s,f.x,f.y);ctx.fillText(f.s,f.x,f.y);ctx.globalAlpha=1});
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
function hud(){var st=S();$('hpb').style.width=Math.max(0,G.hp/st.maxhp*100)+'%';$('xpb').style.width=(P.lv>=Y.MAXLV?100:P.xp/Y.xpNeed(P.lv)*100)+'%';var hlt='Sv '+P.lv+' · 🪙 '+P.gold;if($('hl')._h!==hlt){$('hl')._h=hlt;$('hl').innerHTML=hlt}
  var c=C();[1,2,3].forEach(function(n){var s=c.sk[n-1],cd=$('b'+n).querySelector('.cd');cd.style.height=(G.cd[n-1]>0?Math.min(100,G.cd[n-1]/s.cd*100):0)+'%'});
  var bi=$('bi'),n=G.near;if(n){bi.style.display='grid';var bk=(n.t==='npc'||n.t==='vill')?'chat':(n.t==='portal'||n.t==='exit')?'door':(G.gather?'hourglass':'hand');if(bi.dataset.k!==bk){bi.dataset.k=bk;bi.innerHTML=YA.ico(bk)}}else bi.style.display='none';var zn2=$('zn'),pz2=G.mode==='world'?G.pz:null,tx='',col='';if(G.mode==='dungeon'){tx='🕳️ '+Y.DUNGEONS[G.dg.id].n;col='#b57bff'}else if(pz2){tx='⚔️ '+pz2.n+' · PvP';col='#ff5b6e'}else if(inTownF()){tx='Kasaba · Güvenli bölge';col='#5be39a'}if(zn2){zn2.style.display=tx?'block':'none';if(zn2._h!==tx){zn2._h=tx;zn2.innerHTML=tx}zn2.style.borderColor=col;zn2.style.color=col}
  drawMini()}
function loop(now){raf=requestAnimationFrame(loop);if(!G)return;var dt=Math.min(.05,(now-lastT)/1000);lastT=now;if(!G.paused)update(dt);render(G.t);hud()}
document.addEventListener('visibilitychange',function(){if(document.hidden)saveNow()});addEventListener('pagehide',saveNow);

/* ---------- açılış ---------- */
function boot(){try{YA.dom(document.body)}catch(e){}if(!window.YXAcct||!YXAcct.conf()){show('s-gate');$('gerr').textContent='Hesap sistemi şu an hazır değil.';return}
  if(acct())toChar();else show('s-gate')}
window.addEventListener('yx-acct',function(){if(!G&&!acct())show('s-gate')});
window.__yd={get G(){return G},get P(){return P},enter:enter,cast:cast,attack:attack,interact:interact};
setTimeout(boot,60);
})();
