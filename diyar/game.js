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
function fix(p){p.done=p.done||{};p.pf=p.pf||{};['wood','mine'].forEach(function(k){p.pf[k]=p.pf[k]||{l:1,x:0}});['wood','stone','iron','fang','crystal','gold','wl','al','xp'].forEach(function(k){p[k]=p[k]||0});p.lv=p.lv||1;if(p.x==null){p.x=Y.CX*TS;p.y=Y.CY*TS}return p}

/* ---------- giriş / karakter ekranları ---------- */
function gate(up){var e=$('em').value.trim(),p=$('pw').value;$('gerr').textContent='';
  if(!e||!p){$('gerr').textContent='E-posta ve şifre gerekli';return}
  if(!window.YXAcct||!YXAcct.conf()){$('gerr').textContent='Hesap sistemi şu an hazır değil';return}
  $('gin').disabled=$('gup').disabled=true;
  (up?YXAcct.signUp(e,p):YXAcct.signIn(e,p)).then(function(){toChar()}).catch(function(er){$('gerr').textContent=(er&&er.msg)||'Bir sorun oluştu'}).then(function(){$('gin').disabled=$('gup').disabled=false})}
var selCls='savasci';
function clsDet(){var c=Y.CLASSES[selCls];$('det').innerHTML='<b>'+c.ic+' '+esc(c.n)+'</b> · '+esc(c.role)+'<div class="sk"><span>👊</span><div>Temel saldırı: '+(c.melee?'yakın':'uzak')+' menzil</div></div>'+c.sk.map(function(s){return'<div class="sk"><span>'+s.ic+'</span><div><b>'+esc(s.n)+'</b> · '+s.cd+' sn</div></div>'}).join('')}
function buildCls(){$('cls').innerHTML=Object.keys(Y.CLASSES).map(function(k){var c=Y.CLASSES[k];return'<button type="button" data-k="'+k+'" aria-pressed="'+(k===selCls)+'"><span class="ic">'+c.ic+'</span><b>'+esc(c.n)+'</b><small>'+esc(c.role)+'</small></button>'}).join('');
  $('cls').querySelectorAll('button').forEach(function(b){b.onclick=function(){selCls=b.dataset.k;buildCls();clsDet()}});clsDet()}
function toChar(){var a=acct();if(!a){show('s-gate');return}$('who').textContent=a.email;P=loadSave();show('s-char');
  if(P){fix(P);$('cnew').style.display='none';$('cold').style.display='';var c=Y.CLASSES[P.cls];
    $('cold').innerHTML='<div class="it"><span style="font-size:2rem">'+c.ic+'</span><div class="t"><b>'+esc(P.nick)+'</b><br><small>'+esc(c.n)+' · Seviye '+P.lv+' · 🪙 '+P.gold+'</small></div></div><div class="row"><button class="btn" id="cgo" type="button">Oyuna gir</button><button class="btn alt" id="cdel" type="button">Karakteri sil</button><button class="btn alt" id="cout2" type="button">Çıkış yap</button></div><div class="err" id="cerr2"></div>';
    $('cgo').onclick=enter;$('cout2').onclick=function(){YXAcct.signOut();show('s-gate')};
    var armed=0;$('cdel').onclick=function(){if(!armed){armed=1;$('cdel').textContent='Emin misin? Tekrar bas';setTimeout(function(){armed=0;if($('cdel'))$('cdel').textContent='Karakteri sil'},3500);return}try{localStorage.removeItem(KEY+acct().uid)}catch(e){}P=null;toChar()}}
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
    npcs:[{id:'smith',n:'Demirci',ic:'🔨',x:cx-130,y:cy-100},{id:'trader',n:'Tüccar',ic:'🧺',x:cx+130,y:cy-100}],
    portals:[{id:'kurt',p:ang(30,15)},{id:'kristal',p:ang(50,150)},{id:'kale',p:ang(52,255)}]};
  var dx=G.px-cx,dy=G.py-cy;if(Y.zoneAt(Math.floor(G.px/TS),Math.floor(G.py/TS))===3){G.px=cx;G.py=cy+60}
  initSpawns();buildMini();setupHud();show('hud');resize();
  try{var el=document.documentElement;if(el.requestFullscreen&&!document.fullscreenElement)el.requestFullscreen().catch(function(){})}catch(e){}
  try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(function(){})}catch(e){}
  say('Yaxest Diyarı\'na hoş geldin, '+P.nick+'! Yürü, saldır (⚔️), topla (✋).','sys');
  say('Bu bir tek kişilik Eğitim Diyarı. Çok oyunculu diyar sunucu kurulunca açılacak.','sys');
  cancelAnimationFrame(raf);lastT=performance.now();raf=requestAnimationFrame(loop)}
function leaveGame(){cancelAnimationFrame(raf);raf=0;saveNow();G=null;toChar();try{document.fullscreenElement&&document.exitFullscreen()}catch(e){}}
function initSpawns(){G.spawns=[];
  for(var ty=4;ty<Y.MH-4;ty+=6)for(var tx=4;tx<Y.MW-4;tx+=6){var jx=tx+Math.floor(Y.hash(tx,ty,21)*4),jy=ty+Math.floor(Y.hash(tx,ty,22)*4),z=Y.zoneAt(jx,jy);if(z===3||z===4)continue;
    var dx=jx-Y.CX,dy=jy-Y.CY,d=Math.sqrt(dx*dx+dy*dy);if(d<11||Y.hash(tx,ty,23)>.55)continue;
    G.spawns.push({x:(jx+.5)*TS,y:(jy+.5)*TS,z:z,lv:Math.max(1,Y.zoneLv(z,d)),m:null,rt:0,type:z===0?(Y.hash(tx,ty,24)<.75?'slime':'boar'):z===1?(Y.hash(tx,ty,24)<.6?'wolf':'boar'):'golem'})}}
function mkMon(type,lv,x,y,sp){var b=Y.MON[type],s=Y.mstat(type,lv);return{type:type,lv:lv,hp:s.hp,max:s.hp,dmg:s.dmg,xp:s.xp,gold:s.gold,x:x,y:y,sx:x,sy:y,sp:b.sp,sz:b.sz,boss:b.boss,col:b.c,n:b.n,hit:0,atkT:.6,slow:0,taunt:0,dotT:0,dotD:0,dotAcc:0,wx:0,wy:0,wt:0,sp8:sp,bob:Math.random()*6}}

/* ---------- yardımcılar ---------- */
function S(){return Y.pstat(P)}function C(){return Y.CLASSES[P.cls]}
function say(t,k){G.log.push(t);if(G.log.length>5)G.log.shift();if(k!=='x'){G.sys.push(t);if(G.sys.length>60)G.sys.shift()}renderLog()}
function renderLog(){$('log').innerHTML=G.log.map(function(l){return'<div>'+esc(l)+'</div>'}).join('')}
function floatTxt(x,y,s,c){G.txt.push({x:x,y:y,s:s,c:c||'#fff',t:0})}
function addFx(o){o.t=0;G.efx.push(o)}
function blocked(x,y){var tx=Math.floor(x/TS),ty=Math.floor(y/TS);if(G.mode==='dungeon')return tx<1||ty<1||tx>=AW-1||ty>=AH-1;return Y.zoneAt(tx,ty)===3}
function moveE(e,dx,dy){if(!blocked(e.x+dx,e.y))e.x+=dx;if(!blocked(e.x,e.y+dy))e.y+=dy}
function curMons(){return G.mode==='dungeon'?G.dg.mons:G.mons}
function nearest(range,from){var best=null,bd=1e9,list=curMons();for(var i=0;i<list.length;i++){var m=list[i];if(m.dead)continue;var d=hyp(m.x-(from?from.x:G.px),m.y-(from?from.y:G.py))-m.sz;if(d<range&&d<bd){bd=d;best=m}}return best}
function giveXp(n){P.xp+=n;var lv=false;while(P.lv<Y.MAXLV&&P.xp>=Y.xpNeed(P.lv)){P.xp-=Y.xpNeed(P.lv);P.lv++;lv=true}
  if(lv){G.hp=S().maxhp;floatTxt(G.px,G.py-50,'SEVİYE '+P.lv+'!','#ffd23f');say('Seviye atladın: '+P.lv,'sys');addFx({k:'ring',x:G.px,y:G.py,r:110,c:'#ffd23f',l:.7})}}
function giveProf(k,n){var p=P.pf[k];p.x+=n;while(p.x>=Y.profNeed(p.l)){p.x-=Y.profNeed(p.l);p.l++;say(Y.PROF[k]+' seviyen '+p.l+' oldu!','sys')}}

/* ---------- savaş ---------- */
function hurt(d,from){if(G.dead>0)return;if(G.evade>0)return;
  var v=d*(1-S().red)*(G.guard>0?(1-G.guardRed):1);v=Math.max(1,Math.round(v));G.hp-=v;G.lastHurt=G.t;floatTxt(G.px,G.py-34,'-'+v,'#ff6b7a');
  if(G.hp<=0){G.hp=0;die()}}
function die(){G.dead=3;G.gather=null;say('Yenildin! Kasabada yeniden doğacaksın.','sys');var lost=Math.floor(P.gold*.08);P.gold-=lost;if(lost)say('🪙 '+lost+' altın kaybettin.','sys')}
function respawn(){G.dead=0;if(G.mode==='dungeon'){G.mode='world';G.dg=null}G.px=Y.CX*TS;G.py=Y.CY*TS+70;G.hp=S().maxhp;G.buff=G.guard=G.evade=G.hot=0}
function dmgMon(m,d,dot,crit){if(m.dead)return;d=Math.max(1,Math.round(d));m.hp-=d;m.hit=5;floatTxt(m.x,m.y-m.sz-14,(crit?'✦':'')+d,dot?'#9be37a':crit?'#ffd23f':'#fff');if(m.hp<=0)killMon(m)}
function killMon(m){m.dead=1;giveXp(m.xp);P.gold+=m.gold;floatTxt(m.x,m.y-m.sz-30,'+'+m.xp+' XP','#7ab8ff');
  if(G.mode==='world'){if(m.sp8){m.sp8.m=null;m.sp8.rt=20+Math.random()*12}
    var r=Math.random();if(r<.28){P.wood++;say('+1 Odun','x')}else if(r<.5){P.stone++;say('+1 Taş','x')}
    var i=G.mons.indexOf(m);if(i>=0)G.mons.splice(i,1)}
  else dgCheck()}
function attack(){if(G.atkCd>0||G.dead>0)return;var st=S(),c=C(),t=nearest(st.rng+(c.melee?16:0));G.atkCd=st.aspd;
  if(!t){addFx({k:'swing',x:G.px,y:G.py,fx:G.fx,fy:G.fy,c:c.col,l:.12});G.atkCd=Math.min(.3,st.aspd);return}
  var dx=t.x-G.px,dy=t.y-G.py,h=hyp(dx,dy)||1;G.fx=dx/h;G.fy=dy/h;
  var crit=Math.random()<(P.cls==='suikastci'?.22:.1),d=st.dmg*(G.buff>0?1.5:1)*(.9+Math.random()*.2)*(crit?1.7:1);
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
  if(used)G.cd[i]=s.cd;else floatTxt(G.px,G.py-40,'Hedef yok','#aaa')}

/* ---------- etkileşim: NPC, portal, kaynak ---------- */
function nodeNear(){if(G.mode!=='world')return null;var tx0=Math.floor(G.px/TS),ty0=Math.floor(G.py/TS),best=null,bd=70;
  for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var tx=tx0+dx,ty=ty0+dy,n=Y.nodeAt(tx,ty);if(!n)continue;var key=tx+','+ty;if(G.dep[key]>G.t)continue;
    var d=hyp((tx+.5)*TS-G.px,(ty+.5)*TS-G.py);if(d<bd){bd=d;best={kind:n,tx:tx,ty:ty,key:key}}}return best}
function findNear(){if(G.dead>0)return null;if(G.mode==='dungeon'){var dg=G.dg;if(dg.done&&hyp(dg.ex-G.px,dg.ey-G.py)<80)return{t:'exit'};return null}
  for(var i=0;i<G.npcs.length;i++)if(hyp(G.npcs[i].x-G.px,G.npcs[i].y-G.py)<80)return{t:'npc',o:G.npcs[i]};
  for(var j=0;j<G.portals.length;j++){var p=G.portals[j];if(hyp(p.p.x-G.px,p.p.y-G.py)<80)return{t:'portal',o:p}}
  var n=nodeNear();return n?{t:'node',o:n}:null}
function interact(){var n=findNear();if(!n)return;
  if(n.t==='npc')openNpc(n.o.id);
  else if(n.t==='portal')enterDg(n.o.id);
  else if(n.t==='exit')exitDg();
  else if(n.t==='node'){if(G.gather&&G.gather.o.key===n.o.key){G.gather=null;return}var d=Y.NODE[n.o.kind];G.gather={o:n.o,t:0,need:d.t}}}
function gatherDone(){var o=G.gather.o,d=Y.NODE[o.kind],pf=P.pf[d.prof],y=1+(pf.l>=3?1:0)+(pf.l>=6?1:0)+(Math.random()<.2?1:0);
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
function openPan(id){['p-bag','p-npc','p-chat','p-menu'].forEach(function(x){$(x).classList.toggle('on',x===id)});if(G)G.paused=!!id}
function closePan(){openPan(null)}
function bar(v,mx,c){return'<div class="bar" style="margin-top:2px"><i style="width:'+Math.min(100,Math.round(v/mx*100))+'%;background:'+c+'"></i></div>'}
function drawBag(){var c=C(),st=S(),h='<div class="it"><span style="font-size:1.8rem">'+c.ic+'</span><div class="t"><b>'+esc(P.nick)+'</b> · '+esc(c.n)+' · Seviye '+P.lv+'<br><small>Can '+st.maxhp+' · Hasar '+st.dmg+' · Zırh %'+Math.round(st.red*100)+'</small></div></div>';
  h+='<div class="it"><div class="t">⚔️ Silah <b>+'+P.wl+'</b> · 🛡️ Zırh <b>+'+P.al+'</b><br><small>Demirci kasabadadır.</small></div><div>🪙 '+P.gold+'</div></div>';
  h+=['wood','stone','iron','fang','crystal'].map(function(k){var m=Y.MATS[k];return'<div class="it"><span style="font-size:1.3rem">'+m.ic+'</span><div class="t">'+m.n+'</div><b>'+P[k]+'</b></div>'}).join('');
  h+=Object.keys(Y.PROF).map(function(k){var p=P.pf[k];return'<div class="it"><div class="t">'+Y.PROF[k]+' <b>'+p.l+'</b>'+bar(p.x,Y.profNeed(p.l),'#5be39a')+'</div></div>'}).join('');
  h+='<div class="it"><div class="t"><small>Beceriler: '+c.sk.map(function(s){return s.ic+' '+s.n}).join(' · ')+'</small></div></div>';$('bagc').innerHTML=h}
function costTxt(c){return(c.wood?'🪵'+c.wood+' ':'')+(c.stone?'🪨'+c.stone+' ':'')+(c.iron?'⛓️'+c.iron+' ':'')+'🪙'+c.gold}
function can(c){return P.wood>=c.wood&&P.stone>=c.stone&&P.iron>=c.iron&&P.gold>=c.gold}
function openNpc(id){openPan('p-npc');if(id==='smith'){$('npt').textContent='🔨 Demirci';drawSmith()}else{$('npt').textContent='🧺 Tüccar';drawTrader()}}
function drawSmith(){var h='';[['w','⚔️ Silah',P.wl],['a','🛡️ Zırh',P.al]].forEach(function(r){var c=Y.upCost(r[0],r[2]+1),ok=can(c)&&r[2]<12;
  h+='<div class="it"><div class="t"><b>'+r[1]+' +'+r[2]+'</b> → +'+(r[2]+1)+'<br><small>'+(r[2]>=12?'En üst seviye':costTxt(c))+'</small></div><button class="btn" data-up="'+r[0]+'" '+(ok?'':'disabled')+' type="button">Geliştir</button></div>'});
  h+='<p class="sub">Silah hasarı, zırh can ve hasar azaltma verir. Malzemeyi ormandan, kayalıktan ve canavarlardan topla.</p>';$('npc').innerHTML=h;
  $('npc').querySelectorAll('[data-up]').forEach(function(b){b.onclick=function(){var k=b.dataset.up,n=(k==='w'?P.wl:P.al)+1,c=Y.upCost(k,n);if(!can(c))return;P.wood-=c.wood;P.stone-=c.stone;P.iron-=c.iron;P.gold-=c.gold;if(k==='w')P.wl++;else{P.al++;G.hp=Math.min(S().maxhp,G.hp+10)}say((k==='w'?'Silahın':'Zırhın')+' +'+n+' oldu!','sys');saveNow();drawSmith()}})}
function drawTrader(){var h='',tot=0;['wood','stone','iron','fang','crystal'].forEach(function(k){var m=Y.MATS[k],n=P[k];tot+=n*m.v;h+='<div class="it"><span style="font-size:1.3rem">'+m.ic+'</span><div class="t">'+m.n+' × '+n+'<br><small>Tanesi 🪙'+m.v+'</small></div><button class="btn alt" data-s="'+k+'" '+(n?'':'disabled')+' type="button">Sat</button></div>'});
  h+='<div class="row"><button class="btn" id="sall" '+(tot?'':'disabled')+' type="button">Hepsini sat (🪙'+tot+')</button></div><p class="sub">Silah/zırh için malzeme sakla, fazlasını sat.</p>';$('npc').innerHTML=h;
  $('npc').querySelectorAll('[data-s]').forEach(function(b){b.onclick=function(){var k=b.dataset.s;P.gold+=P[k]*Y.MATS[k].v;P[k]=0;saveNow();drawTrader()}});
  if($('sall'))$('sall').onclick=function(){['wood','stone','iron','fang','crystal'].forEach(function(k){P.gold+=P[k]*Y.MATS[k].v;P[k]=0});saveNow();drawTrader()}}
var chatTab=0;
function drawChat(){var tabs=['Sistem','Dünya','Yerel','Klan','Parti'];$('ctabs').innerHTML=tabs.map(function(t,i){return'<button type="button" data-i="'+i+'" aria-pressed="'+(i===chatTab)+'">'+t+'</button>'}).join('');
  $('ctabs').querySelectorAll('button').forEach(function(b){b.onclick=function(){chatTab=+b.dataset.i;drawChat()}});
  $('cmsgs').innerHTML=chatTab===0?G.sys.map(function(l){return'<div>'+esc(l)+'</div>'}).join(''):'<div style="color:var(--mute)">Bu kanal çok oyunculu diyar açılınca çalışacak.</div>';
  $('cnote').textContent=chatTab===0?'':'Sohbet kuralları: hazır cümleler + filtreli yazı, şikâyet ve engelleme. Sesli sohbet ileride.'}

/* ---------- girdi ---------- */
var keyMap={w:'u',arrowup:'u',s:'d',arrowdown:'d',a:'l',arrowleft:'l',d:'r',arrowright:'r'};
addEventListener('keydown',function(e){if(!G||G.paused&&e.key!=='Escape')return;var k=e.key.toLowerCase();
  if(keyMap[k]){G.keys[keyMap[k]]=1;e.preventDefault()}else if(k===' '){G.hold=true;e.preventDefault()}else if(k==='1')cast(0);else if(k==='2')cast(1);else if(k==='3')cast(2);else if(k==='e'||k==='f')interact();
  else if(k==='i'){drawBag();openPan('p-bag')}else if(k==='enter'){drawChat();openPan('p-chat')}else if(k==='escape'){G.paused?closePan():openPan('p-menu')}});
addEventListener('keyup',function(e){if(!G)return;var k=e.key.toLowerCase();if(keyMap[k])G.keys[keyMap[k]]=0;if(k===' ')G.hold=false});
function setupHud(){var c=C();$('b0').firstChild.nodeValue=c.ic;
  [1,2,3].forEach(function(n){var s=c.sk[n-1],b=$('b'+n);b.innerHTML=s.ic+'<small>'+n+'</small><i class="cd"></i>'});
  $('hav').innerHTML=window.YX&&YX.av?YX.av(YX.S().eq,'n'):'';$('hn').textContent=P.nick;
  var jy=$('joy'),jk=$('jk'),pid=null;
  function jm(e){var r=jy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,d=hyp(dx,dy),m=52;if(d>m){dx=dx/d*m;dy=dy/d*m}jk.style.transform='translate('+dx+'px,'+dy+'px)';var n=hyp(dx,dy)/m;G.jx=n>.15?dx/m:0;G.jy=n>.15?dy/m:0}
  jy.onpointerdown=function(e){pid=e.pointerId;try{jy.setPointerCapture(pid)}catch(x){}jm(e);e.preventDefault()};jy.onpointermove=function(e){if(e.pointerId===pid)jm(e)};
  var jend=function(e){if(e.pointerId!==pid)return;pid=null;jk.style.transform='';if(G){G.jx=0;G.jy=0}};jy.onpointerup=jend;jy.onpointercancel=jend;
  var b0=$('b0');b0.onpointerdown=function(e){G.hold=true;attack();e.preventDefault()};b0.onpointerup=b0.onpointercancel=b0.onpointerleave=function(){if(G)G.hold=false};
  [1,2,3].forEach(function(n){$('b'+n).onpointerdown=function(e){cast(n-1);e.preventDefault()}});$('bi').onpointerdown=function(e){interact();e.preventDefault()}}
$('ibag').onclick=function(){if(!G)return;drawBag();openPan('p-bag')};$('ichat').onclick=function(){if(!G)return;drawChat();openPan('p-chat')};$('imenu').onclick=function(){if(G)openPan('p-menu')};
document.querySelectorAll('[data-close]').forEach(function(b){b.onclick=closePan});
$('mfs').onclick=function(){try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen()}catch(e){}};
$('mchar').onclick=function(){closePan();leaveGame()};
$('gin').onclick=function(){gate(0)};$('gup').onclick=function(){gate(1)};$('cmk').onclick=mkChar;$('cout').onclick=function(){YXAcct.signOut();show('s-gate')};

/* ---------- güncelleme ---------- */
function update(dt){G.t+=dt;var st=S(),c=C();
  if(G.dead>0){G.dead-=dt;if(G.dead<=0)respawn();return}
  for(var i=0;i<3;i++)if(G.cd[i]>0)G.cd[i]-=dt;if(G.atkCd>0)G.atkCd-=dt;if(G.buff>0)G.buff-=dt;if(G.guard>0)G.guard-=dt;if(G.evade>0)G.evade-=dt;
  if(G.hot>0){G.hot-=dt;G.hotT+=dt;if(G.hotT>=1){G.hotT=0;G.hp=Math.min(st.maxhp,G.hp+st.maxhp*G.hotAmt)}}
  var inTown=G.mode==='world'&&hyp(G.px-Y.CX*TS,G.py-Y.CY*TS)<Y.TS*7;
  if(G.hp<st.maxhp&&(inTown||G.t-G.lastHurt>6))G.hp=Math.min(st.maxhp,G.hp+st.maxhp*(inTown?.04:.01)*dt);
  var mx=(G.keys.r?1:0)-(G.keys.l?1:0)+G.jx,my=(G.keys.d?1:0)-(G.keys.u?1:0)+G.jy,ml=hyp(mx,my);
  if(ml>1){mx/=ml;my/=ml}
  if(ml>.1){G.fx=mx/(ml>1?1:ml)*(ml>1?1:1);var fl=hyp(mx,my)||1;G.fx=mx/fl;G.fy=my/fl;G.gather=null;var sp=st.spd*(G.evade>0?1.5:1)*(G.gather?0:1);moveE(G,mx*sp*dt,my*sp*dt)}
  if(G.hold)attack();
  if(G.gather){G.gather.t+=dt;if(G.gather.t>=G.gather.need)gatherDone()}
  if(G.mode==='world')worldMons(dt);else dgUpdate(dt);
  var list=curMons();for(var k=0;k<list.length;k++)monAi(list[k],dt);
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
  var chase=(dist<ar||m.hit>0)&&G.evade<=0&&G.dead<=0;
  if(!inDg&&hyp(m.x-m.sx,m.y-m.sy)>560){m.hit=0;chase=false}
  if(chase){if(dist>m.sz+18){moveE(m,dx/dist*sp*dt,dy/dist*sp*dt)}else{m.atkT-=dt;if(m.atkT<=0){m.atkT=1.15;hurt(m.dmg)}}}
  else{m.wt-=dt;if(m.wt<=0){m.wt=1.5+Math.random()*2;var a=Math.random()*6.28;m.wx=Math.cos(a);m.wy=Math.sin(a);if(hyp(m.x-m.sx,m.y-m.sy)>120){var hx=m.sx-m.x,hy=m.sy-m.y,hh=hyp(hx,hy)||1;m.wx=hx/hh;m.wy=hy/hh}}
    moveE(m,m.wx*sp*.35*dt,m.wy*sp*.35*dt)}}

/* ---------- çizim ---------- */
function resize(){dpr=Math.min(window.devicePixelRatio||1,2);VW=innerWidth;VH=innerHeight;cv.width=Math.round(VW*dpr);cv.height=Math.round(VH*dpr);
  var port=VH>VW&&('ontouchstart' in window);$('rot').style.display=port&&G?'flex':'none';if(G)G.paused=port||G.paused&&!!document.querySelector('.pan.on')}
addEventListener('resize',resize);addEventListener('orientationchange',resize);
var ZC=['#3f7d48','#2f6a3c','#6b7083','#2b66a8','#b9a47d'];
function tileCol(tx,ty,z){var h=Y.hash(tx,ty,5);if(G.mode==='dungeon'){return(tx<1||ty<1||tx>=AW-1||ty>=AH-1)?'#15112a':((tx+ty)%2?'#3a3052':'#352c4b')}
  var c=ZC[z];if(z===3){return h<.5?'#2b66a8':'#2f6fb2'}var k=Math.floor(h*3);var d=k===0?-6:k===1?0:6;return shade(c,d)}
function shade(hex,d){var n=parseInt(hex.slice(1),16),r=(n>>16)+d,g=(n>>8&255)+d,b=(n&255)+d;r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));return'rgb('+r+','+g+','+b+')'}
function drawNode(kind,x,y){if(kind==='tree'){ctx.fillStyle='#6b4a2b';ctx.fillRect(x-4,y-2,8,16);ctx.fillStyle='#2f9e57';ctx.beginPath();ctx.arc(x,y-12,18,0,6.28);ctx.fill();ctx.fillStyle='#3fbf6c';ctx.beginPath();ctx.arc(x-5,y-17,9,0,6.28);ctx.fill()}
  else{ctx.fillStyle=kind==='iron'?'#5c4a45':'#8b93a8';ctx.beginPath();ctx.moveTo(x-16,y+10);ctx.lineTo(x-10,y-10);ctx.lineTo(x+6,y-14);ctx.lineTo(x+17,y+2);ctx.lineTo(x+12,y+12);ctx.closePath();ctx.fill();
    if(kind==='iron'){ctx.fillStyle='#e08a4a';[[-6,-2],[4,-6],[8,4],[-2,6]].forEach(function(p){ctx.beginPath();ctx.arc(x+p[0],y+p[1],3,0,6.28);ctx.fill()})}else{ctx.fillStyle='#a8afc4';ctx.beginPath();ctx.arc(x-3,y-5,5,0,6.28);ctx.fill()}}}
function drawMon(m,t){var b=Math.sin(t*5+m.bob)*2,x=m.x,y=m.y+b;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,m.y+m.sz*.6,m.sz,m.sz*.4,0,0,6.28);ctx.fill();
  ctx.fillStyle=m.col;ctx.beginPath();if(m.type==='golem'||m.type==='guardian'){ctx.roundRect?ctx.roundRect(x-m.sz,y-m.sz,m.sz*2,m.sz*2,8):ctx.rect(x-m.sz,y-m.sz,m.sz*2,m.sz*2)}else ctx.ellipse(x,y,m.sz,m.sz*.85,0,0,6.28);ctx.fill();
  if(m.slow>0){ctx.strokeStyle='#7ad7ff';ctx.lineWidth=3;ctx.stroke()}if(m.dotT>0){ctx.strokeStyle='#9be37a';ctx.lineWidth=3;ctx.stroke()}
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x-m.sz*.35,y-m.sz*.2,m.sz*.2,0,6.28);ctx.arc(x+m.sz*.35,y-m.sz*.2,m.sz*.2,0,6.28);ctx.fill();ctx.fillStyle=m.hit>0?'#e22':'#222';ctx.beginPath();ctx.arc(x-m.sz*.35,y-m.sz*.2,m.sz*.09,0,6.28);ctx.arc(x+m.sz*.35,y-m.sz*.2,m.sz*.09,0,6.28);ctx.fill();
  if(m.type==='wolf'||m.type==='alpha'){ctx.fillStyle=m.col;ctx.beginPath();ctx.moveTo(x-m.sz*.7,y-m.sz*.5);ctx.lineTo(x-m.sz*.45,y-m.sz*1.15);ctx.lineTo(x-m.sz*.15,y-m.sz*.6);ctx.moveTo(x+m.sz*.7,y-m.sz*.5);ctx.lineTo(x+m.sz*.45,y-m.sz*1.15);ctx.lineTo(x+m.sz*.15,y-m.sz*.6);ctx.fill()}
  var w=m.sz*2;ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(x-w/2,y-m.sz-12,w,5);ctx.fillStyle=m.boss?'#ff9d3d':'#ff5b6e';ctx.fillRect(x-w/2,y-m.sz-12,w*Math.max(0,m.hp/m.max),5);
  ctx.fillStyle='#fff';ctx.font='700 10px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText(m.n+' '+m.lv,x,y-m.sz-16)}
function drawHero(t){var x=G.px,y=G.py,c=C();ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,y+22,20,8,0,0,6.28);ctx.fill();
  ctx.strokeStyle=c.col;ctx.lineWidth=3;ctx.globalAlpha=G.evade>0?.4:1;ctx.beginPath();ctx.arc(x,y,24,0,6.28);ctx.stroke();
  if(sprite&&sprite.complete&&sprite.naturalWidth)ctx.drawImage(sprite,x-24,y-26+Math.sin(t*6)*(G.jx||G.jy||G.keys.u||G.keys.d||G.keys.l||G.keys.r?2:0),48,48);else{ctx.fillStyle=c.col;ctx.beginPath();ctx.arc(x,y,18,0,6.28);ctx.fill()}
  ctx.globalAlpha=1;ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText(c.ic,x+G.fx*30,y+G.fy*30+6);
  if(G.guard>0){ctx.strokeStyle='#5cb4ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,32,0,6.28);ctx.stroke()}if(G.buff>0){ctx.strokeStyle='#ffb27a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,36,0,6.28);ctx.stroke()}
  ctx.fillStyle='#fff';ctx.font='700 11px "Chakra Petch",sans-serif';ctx.fillText(P.nick,x,y-34);
  if(G.gather){var p=G.gather.t/G.gather.need;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(x-24,y+30,48,6);ctx.fillStyle='#5be39a';ctx.fillRect(x-24,y+30,48*p,6)}}
function render(t){var camX=G.px-VW/2,camY=G.py-VH/2;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#0b0820';ctx.fillRect(0,0,VW,VH);ctx.translate(-Math.round(camX),-Math.round(camY));
  var x0=Math.max(0,Math.floor(camX/TS)-1),y0=Math.max(0,Math.floor(camY/TS)-1),x1=Math.ceil((camX+VW)/TS)+1,y1=Math.ceil((camY+VH)/TS)+1,dg=G.mode==='dungeon';
  if(dg){x1=Math.min(x1,AW);y1=Math.min(y1,AH)}else{x1=Math.min(x1,Y.MW);y1=Math.min(y1,Y.MH)}
  for(var ty=y0;ty<y1;ty++)for(var tx=x0;tx<x1;tx++){var z=dg?0:Y.zoneAt(tx,ty);ctx.fillStyle=tileCol(tx,ty,z);ctx.fillRect(tx*TS,ty*TS,TS+1,TS+1);
    if(z===3&&!dg&&((tx+ty+Math.floor(t*1.5))%4===0)){ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(tx*TS+8,ty*TS+14,TS-16,4)}}
  if(!dg){ctx.fillStyle='rgba(255,230,160,.12)';ctx.beginPath();ctx.arc(Y.CX*TS,Y.CY*TS,Y.TS*6.4,0,6.28);ctx.fill();ctx.strokeStyle='rgba(255,230,160,.4)';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='700 14px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText('KASABA',Y.CX*TS,Y.CY*TS-Y.TS*5.5)}
  var ents=[];
  if(!dg){for(var ny=y0;ny<y1;ny++)for(var nx=x0;nx<x1;nx++){var n=Y.nodeAt(nx,ny);if(n&&!(G.dep[nx+','+ny]>G.t))ents.push({y:(ny+.5)*TS,f:function(k,a,b){return function(){drawNode(k,a,b)}}(n,(nx+.5)*TS,(ny+.5)*TS+8)})}
    G.npcs.forEach(function(o){ents.push({y:o.y,f:function(){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(o.x,o.y+20,24,9,0,0,6.28);ctx.fill();ctx.fillStyle='#6b4a8a';ctx.fillRect(o.x-26,o.y-8,52,30);ctx.font='28px sans-serif';ctx.textAlign='center';ctx.fillText(o.ic,o.x,o.y+2);ctx.fillStyle='#fff';ctx.font='700 11px "Chakra Petch",sans-serif';ctx.fillText(o.n,o.x,o.y-20)}})});
    G.portals.forEach(function(p){var d=Y.DUNGEONS[p.id];ents.push({y:p.p.y,f:function(){var pu=1+Math.sin(t*3)*.08;ctx.fillStyle='rgba(122,92,255,.35)';ctx.beginPath();ctx.ellipse(p.p.x,p.p.y,34*pu,40*pu,0,0,6.28);ctx.fill();ctx.strokeStyle='#b57bff';ctx.lineWidth=4;ctx.stroke();ctx.font='26px sans-serif';ctx.textAlign='center';ctx.fillText(d.ic,p.p.x,p.p.y+9);ctx.fillStyle='#fff';ctx.font='700 11px "Chakra Petch",sans-serif';ctx.fillText(d.n+' · Sv '+d.lv+(d.party>1?' · '+d.party+' kişi':''),p.p.x,p.p.y-48)}})})}
  else if(G.dg.done){ents.push({y:G.dg.ey,f:function(){ctx.fillStyle='rgba(91,227,154,.35)';ctx.beginPath();ctx.ellipse(G.dg.ex,G.dg.ey,36,42,0,0,6.28);ctx.fill();ctx.strokeStyle='#5be39a';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#fff';ctx.font='700 12px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText('ÇIKIŞ',G.dg.ex,G.dg.ey-50)}})}
  curMons().forEach(function(m){if(!m.dead)ents.push({y:m.y,f:function(){drawMon(m,t)}})});ents.push({y:G.py,f:function(){drawHero(t)}});
  ents.sort(function(a,b){return a.y-b.y});ents.forEach(function(e){e.f()});
  G.efx.forEach(function(f){var a=1-f.t/f.l;ctx.globalAlpha=Math.max(0,a);ctx.strokeStyle=f.c;
    if(f.k==='ring'){ctx.lineWidth=5;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(.4+.6*(1-a)),0,6.28);ctx.stroke()}
    else if(f.k==='line'){ctx.lineWidth=f.w||4;ctx.beginPath();ctx.moveTo(f.x1,f.y1);ctx.lineTo(f.x2,f.y2);ctx.stroke()}
    else if(f.k==='swing'){var an=Math.atan2(f.fy,f.fx);ctx.lineWidth=6;ctx.beginPath();ctx.arc(f.x,f.y,44,an-.9,an+.9);ctx.stroke()}ctx.globalAlpha=1});
  G.txt.forEach(function(f){ctx.globalAlpha=Math.max(0,1-f.t);ctx.fillStyle=f.c;ctx.font='800 14px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=3;ctx.strokeText(f.s,f.x,f.y);ctx.fillText(f.s,f.x,f.y);ctx.globalAlpha=1});
  if(G.dead>0){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='rgba(120,0,20,.45)';ctx.fillRect(0,0,VW,VH);ctx.fillStyle='#fff';ctx.font='800 28px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText('YENİLDİN',VW/2,VH/2)}}
function buildMini(){mmc=document.createElement('canvas');mmc.width=Y.MW;mmc.height=Y.MH;var m=mmc.getContext('2d');for(var y=0;y<Y.MH;y++)for(var x=0;x<Y.MW;x++){m.fillStyle=ZC[Y.zoneAt(x,y)];m.fillRect(x,y,1,1)}}
function drawMini(){var m=$('mm').getContext('2d');m.clearRect(0,0,96,96);if(G.mode==='dungeon'){m.fillStyle='#2a2142';m.fillRect(0,0,96,96);m.fillStyle='#ffd23f';m.fillRect(G.px/(AW*TS)*96-2,G.py/(AH*TS)*96-2,4,4);return}
  m.drawImage(mmc,0,0,96,96);var k=96/Y.MW/TS;G.portals.forEach(function(p){m.fillStyle='#b57bff';m.fillRect(p.p.x*k-2,p.p.y*k-2,4,4)});m.fillStyle='#fff';m.fillRect(G.px*k-2,G.py*k-2,4,4);m.strokeStyle='#ffd23f';m.strokeRect(G.px*k-3,G.py*k-3,6,6)}
function hud(){var st=S();$('hpb').style.width=Math.max(0,G.hp/st.maxhp*100)+'%';$('xpb').style.width=(P.lv>=Y.MAXLV?100:P.xp/Y.xpNeed(P.lv)*100)+'%';$('hl').textContent='Sv '+P.lv+' · 🪙 '+P.gold;
  var c=C();[1,2,3].forEach(function(n){var s=c.sk[n-1],cd=$('b'+n).querySelector('.cd');cd.style.height=(G.cd[n-1]>0?Math.min(100,G.cd[n-1]/s.cd*100):0)+'%'});
  var bi=$('bi'),n=G.near;if(n){bi.style.display='grid';bi.firstChild.nodeValue=n.t==='npc'?'💬':n.t==='portal'?'🚪':n.t==='exit'?'🚪':(G.gather?'⏳':'✋')}else bi.style.display='none';drawMini()}
function loop(now){raf=requestAnimationFrame(loop);if(!G)return;var dt=Math.min(.05,(now-lastT)/1000);lastT=now;if(!G.paused)update(dt);render(G.t);hud()}
document.addEventListener('visibilitychange',function(){if(document.hidden)saveNow()});addEventListener('pagehide',saveNow);

/* ---------- açılış ---------- */
function boot(){if(!window.YXAcct||!YXAcct.conf()){show('s-gate');$('gerr').textContent='Hesap sistemi şu an hazır değil.';return}
  if(acct())toChar();else show('s-gate')}
window.addEventListener('yx-acct',function(){if(!G&&!acct())show('s-gate')});
window.__yd={get G(){return G},get P(){return P},enter:enter,cast:cast,attack:attack,interact:interact};
setTimeout(boot,60);
})();
