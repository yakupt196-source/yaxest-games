/* Yaxest Diyarı: Diyar+ 2. paket
   Yeni canavar çizimleri, sandıklar (Kahraman Mağazası), balık tutma, define haritası, Kızıl Ay Kraliçesi ödülü. */
(function(){
'use strict';
var A=null,D=null,X=null,P=null,G=null,Y=null,TS=48;
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function hyp(a,b){return Math.sqrt(a*a+b*b)}
function pick(l){return l[Math.floor(Math.random()*l.length)]}
function inc(k,n){X.c[k]=(X.c[k]||0)+(n||1)}

/* ====================== yeni canavar çizimleri ====================== */
var NEWART={};
function sh(c,u,w){c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(0,u*15,u*(w||18),u*5.5,0,0,6.3);c.fill()}
function ol(c){c.lineWidth=2;c.strokeStyle='#17102a';c.stroke()}
function E(c,x,y,rx,ry,col,o){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,6.3);c.fill();if(o!==0)ol(c)}
function eye(c,x,y,r,col){c.fillStyle='#fff';c.beginPath();c.arc(x,y,r,0,6.3);c.fill();c.fillStyle=col||'#17102a';c.beginPath();c.arc(x+r*.2,y,r*.55,0,6.3);c.fill()}
NEWART.rabbit=function(c,m,t,u,dir,bob){var hop=Math.abs(Math.sin(t*6+m.bob))*u*6;c.translate(0,-hop);sh(c,u,13);E(c,0,u*4,u*12,u*10,m.hit>0?'#fff':'#f1ece0');E(c,-u*3,-u*13,u*3.4,u*10,'#f1ece0');E(c,u*5,-u*13,u*3.4,u*10,'#f1ece0');E(c,-u*3,-u*13,u*1.6,u*7,'#f4a3b0',0);E(c,u*5,-u*13,u*1.6,u*7,'#f4a3b0',0);E(c,u*dir*0,-u*1,u*10,u*9,'#f6f2e8');eye(c,u*2*dir-u*3,-u*2,u*2.2,'#c0392b');eye(c,u*2*dir+u*4,-u*2,u*2.2,'#c0392b');E(c,u*dir*4,u*3,u*2,u*1.4,'#f4a3b0',0);E(c,-u*dir*10,u*8,u*4,u*4,'#fff')};
NEWART.bee=function(c,m,t,u,dir,bob){c.translate(0,Math.sin(t*9+m.bob)*u*3-u*6);sh(c,u,9);var w=Math.sin(t*50)*u*3;c.fillStyle='rgba(200,230,255,.7)';c.beginPath();c.ellipse(-u*3,-u*9,u*7,u*3+w*.4,-.5,0,6.3);c.ellipse(u*5,-u*9,u*7,u*3-w*.4,.5,0,6.3);c.fill();E(c,0,0,u*11,u*8,m.hit>0?'#fff':'#ffd23f');c.fillStyle='#2a2036';c.fillRect(-u*3,-u*7,u*3,u*14);c.fillRect(u*3,-u*6,u*3,u*12);eye(c,u*dir*7,-u*2,u*2.2,'#17102a');c.fillStyle='#2a2036';c.beginPath();c.moveTo(-u*dir*11,0);c.lineTo(-u*dir*17,u*2);c.lineTo(-u*dir*11,u*3);c.fill()};
NEWART.fox=function(c,m,t,u,dir,bob){c.scale(dir,1);sh(c,u,22);var lg=Math.sin(t*10+m.bob)*u*2;c.fillStyle='#8a3a1a';[-12,-6,8,14].forEach(function(x,i){c.fillRect(u*x-u*2,u*5,u*4,u*10+(i%2?lg:-lg))});
  c.fillStyle='#ff8a3d';c.beginPath();c.moveTo(-u*18,-u*2);c.quadraticCurveTo(-u*36,-u*18+bob*u,-u*30,u*6);c.quadraticCurveTo(-u*24,u*4,-u*16,u*4);c.fill();ol(c);c.fillStyle='#fff';c.beginPath();c.arc(-u*30,u*1,u*5,0,6.3);c.fill();
  E(c,0,0,u*19,u*11,m.hit>0?'#fff':'#ff8a3d');E(c,u*17,-u*4,u*9,u*8,'#ff8a3d');c.fillStyle='#fff';c.beginPath();c.moveTo(u*19,u*2);c.lineTo(u*30,u*2);c.lineTo(u*20,u*8);c.fill();ol(c);c.fillStyle='#17102a';c.beginPath();c.arc(u*29,u*1,u*1.8,0,6.3);c.fill();
  c.fillStyle='#ff8a3d';c.beginPath();c.moveTo(u*12,-u*10);c.lineTo(u*14,-u*20);c.lineTo(u*19,-u*11);c.moveTo(u*19,-u*11);c.lineTo(u*23,-u*20);c.lineTo(u*25,-u*9);c.fill();ol(c);eye(c,u*20,-u*6,u*2,'#7a3a00')};
NEWART.spider=function(c,m,t,u,dir,bob){sh(c,u,18);c.strokeStyle='#2a2036';c.lineWidth=u*2;for(var i=0;i<4;i++){var a=Math.sin(t*9+i+m.bob)*u*3;[-1,1].forEach(function(s){c.beginPath();c.moveTo(s*u*5,0);c.quadraticCurveTo(s*u*(16+i*2),-u*12+i*u*5+a,s*u*(20+i*2),u*8+i*u*2);c.stroke()})}
  E(c,-u*dir*6,u*1,u*12,u*10,m.hit>0?'#fff':'#5a4670');c.fillStyle='#c0392b';c.beginPath();c.arc(-u*dir*6,-u*1,u*3,0,6.3);c.fill();E(c,u*dir*8,-u*1,u*7,u*6,'#3a2a50');eye(c,u*dir*8,-u*3,u*1.6,'#ff3b3b');eye(c,u*dir*12,-u*3,u*1.6,'#ff3b3b')};
NEWART.treant=function(c,m,t,u,dir,bob){sh(c,u,22);var sw=Math.sin(t*2+m.bob)*u*2;c.fillStyle='#6b4a2b';c.fillRect(-u*8,-u*6,u*16,u*22);ol(c);c.strokeStyle='#6b4a2b';c.lineWidth=u*4;c.beginPath();c.moveTo(-u*8,u*2);c.lineTo(-u*20,-u*6+sw);c.moveTo(u*8,u*2);c.lineTo(u*20,-u*6-sw);c.stroke();
  E(c,0,-u*14+sw*.3,u*20,u*15,m.hit>0?'#dfffdc':'#3f9a4a');E(c,-u*8,-u*18+sw*.3,u*10,u*8,'#5cc060',0);eye(c,-u*5,-u*4,u*2.6,'#ffcf3a');eye(c,u*5,-u*4,u*2.6,'#ffcf3a');c.strokeStyle='#2a1a0a';c.lineWidth=2;c.beginPath();c.arc(0,u*4,u*3,.2,2.9);c.stroke()};
NEWART.bat=function(c,m,t,u,dir,bob){c.translate(0,Math.sin(t*5+m.bob)*u*4-u*8);sh(c,u,12);var f=Math.sin(t*16+m.bob)*u*7;c.fillStyle='#4a3366';c.beginPath();c.moveTo(0,0);c.lineTo(-u*22,-u*8-f);c.lineTo(-u*16,u*4);c.lineTo(-u*10,u*1);c.lineTo(-u*5,u*6);c.closePath();c.fill();ol(c);c.beginPath();c.moveTo(0,0);c.lineTo(u*22,-u*8-f);c.lineTo(u*16,u*4);c.lineTo(u*10,u*1);c.lineTo(u*5,u*6);c.closePath();c.fill();ol(c);
  E(c,0,0,u*7,u*8,m.hit>0?'#fff':'#6a4a8a');c.fillStyle='#6a4a8a';c.beginPath();c.moveTo(-u*5,-u*6);c.lineTo(-u*4,-u*13);c.lineTo(-u*1,-u*7);c.moveTo(u*5,-u*6);c.lineTo(u*4,-u*13);c.lineTo(u*1,-u*7);c.fill();ol(c);eye(c,-u*3,-u*1,u*1.8,'#ff3b3b');eye(c,u*3,-u*1,u*1.8,'#ff3b3b');c.fillStyle='#fff';c.fillRect(-u*2,u*3,u*1.4,u*2.4);c.fillRect(u*1,u*3,u*1.4,u*2.4)};
NEWART.scorpion=function(c,m,t,u,dir,bob){c.scale(dir,1);sh(c,u,20);var s=Math.sin(t*8+m.bob)*u;c.strokeStyle='#8a5a1a';c.lineWidth=u*2;for(var i=0;i<3;i++){c.beginPath();c.moveTo(-u*3+i*u*5,u*3);c.lineTo(-u*5+i*u*5-s,u*13);c.moveTo(-u*3+i*u*5,u*3);c.lineTo(-u*1+i*u*5+s,u*13);c.stroke()}
  E(c,0,0,u*14,u*9,m.hit>0?'#fff':'#d4a04a');c.fillStyle='#b8842e';[-6,0,6].forEach(function(x){c.fillRect(u*x-u*1,-u*8,u*2,u*16)});E(c,u*15,-u*2,u*6,u*6,'#c8923a');eye(c,u*18,-u*4,u*1.6,'#17102a');
  c.strokeStyle='#d4a04a';c.lineWidth=u*4;c.lineCap='round';c.beginPath();c.moveTo(-u*12,-u*2);c.quadraticCurveTo(-u*26,-u*10,-u*22,-u*24);c.quadraticCurveTo(-u*16,-u*30,-u*8,-u*24);c.stroke();c.lineCap='butt';c.fillStyle='#ff3b3b';c.beginPath();c.moveTo(-u*10,-u*27);c.lineTo(-u*4,-u*22);c.lineTo(-u*9,-u*22);c.fill();
  c.fillStyle='#d4a04a';c.beginPath();c.arc(u*16,u*6,u*5,0,6.3);c.arc(u*8,u*9,u*4,0,6.3);c.fill();ol(c)};
NEWART.bear=function(c,m,t,u,dir,bob){c.scale(dir,1);sh(c,u,24);var lg=Math.sin(t*6+m.bob)*u*1.6;c.fillStyle='#4a321c';[-12,-4,8,15].forEach(function(x,i){c.fillRect(u*x-u*3,u*5,u*6,u*11+(i%2?lg:-lg))});E(c,0,-u*1,u*23,u*15,m.hit>0?'#fff':'#7a5a3a');E(c,u*19,-u*6,u*12,u*11,'#7a5a3a');E(c,u*14,-u*15,u*4,u*4,'#6a4a2a');E(c,u*25,-u*15,u*4,u*4,'#6a4a2a');E(c,u*26,-u*1,u*6,u*5,'#c8a070');c.fillStyle='#17102a';c.beginPath();c.arc(u*30,-u*2,u*1.6,0,6.3);c.fill();eye(c,u*21,-u*8,u*2,'#17102a');
  c.fillStyle='#fff';c.beginPath();c.moveTo(u*26,u*3);c.lineTo(u*27,u*7);c.lineTo(u*29,u*3);c.fill()};
NEWART.wraith=function(c,m,t,u,dir,bob){c.translate(0,Math.sin(t*3+m.bob)*u*3-u*4);c.fillStyle='rgba(120,190,255,.18)';c.beginPath();c.arc(0,0,u*26,0,6.3);c.fill();c.globalAlpha=m.hit>0?1:.82;c.fillStyle=m.hit>0?'#fff':'#9ad0ff';c.beginPath();c.moveTo(-u*14,u*16);c.lineTo(-u*14,-u*2);c.quadraticCurveTo(0,-u*28,u*14,-u*2);c.lineTo(u*14,u*16);
  for(var i=0;i<5;i++)c.lineTo(u*(14-i*7),u*(i%2?10:18)+Math.sin(t*6+i)*u*2);c.closePath();c.fill();ol(c);c.globalAlpha=1;c.fillStyle='#10213a';c.beginPath();c.ellipse(-u*5,-u*5,u*3,u*4,0,0,6.3);c.ellipse(u*5,-u*5,u*3,u*4,0,0,6.3);c.fill();c.fillStyle='#8ff3ff';c.beginPath();c.arc(-u*5,-u*5,u*1.4,0,6.3);c.arc(u*5,-u*5,u*1.4,0,6.3);c.fill();c.strokeStyle='#8ff3ff';c.lineWidth=2;c.beginPath();c.moveTo(-u*14,u*2);c.lineTo(-u*24,u*8);c.moveTo(u*14,u*2);c.lineTo(u*24,u*8);c.stroke()};
NEWART.drake=function(c,m,t,u,dir,bob){c.scale(dir,1);sh(c,u,26);var f=Math.sin(t*5+m.bob)*u*5;c.fillStyle='#a8302a';c.beginPath();c.moveTo(-u*4,-u*6);c.lineTo(-u*22,-u*26-f);c.lineTo(-u*10,-u*8);c.lineTo(-u*16,-u*12);c.lineTo(u*2,-u*2);c.closePath();c.fill();ol(c);
  c.fillStyle='#e0463d';c.beginPath();c.moveTo(-u*20,u*4);c.quadraticCurveTo(-u*38,u*6,-u*34,-u*8);c.quadraticCurveTo(-u*26,u*2,-u*14,-u*2);c.fill();ol(c);E(c,0,0,u*20,u*12,m.hit>0?'#fff':'#e0463d');E(c,0,u*4,u*14,u*7,'#ffd08a',0);E(c,u*20,-u*7,u*9,u*7,'#e0463d');c.fillStyle='#ffd23f';c.beginPath();c.moveTo(u*15,-u*12);c.lineTo(u*17,-u*21);c.lineTo(u*20,-u*12);c.moveTo(u*22,-u*12);c.lineTo(u*25,-u*20);c.lineTo(u*26,-u*10);c.fill();ol(c);eye(c,u*23,-u*8,u*2,'#ff0');
  c.fillStyle='rgba(255,140,40,.5)';c.beginPath();c.moveTo(u*28,-u*4);c.lineTo(u*40+Math.sin(t*20)*3,-u*8);c.lineTo(u*40,u*2);c.fill()};
NEWART.goldslime=function(c,m,t,u,dir,bob){var sq=1+bob*.09;sh(c,u,18);c.fillStyle=m.hit>0?'#fff':'#ffd23f';c.beginPath();c.moveTo(-u*19,u*12);c.bezierCurveTo(-u*20,-u*14*sq,u*20,-u*14*sq,u*19,u*12);c.quadraticCurveTo(0,u*17,-u*19,u*12);c.fill();ol(c);c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-u*8,-u*5*sq,u*5,u*3,-.5,0,6.3);c.fill();eye(c,-u*6,0,u*3.6);eye(c,u*6,0,u*3.6);c.strokeStyle='#8a5a00';c.lineWidth=1.6;c.beginPath();c.arc(0,u*6,u*3,.2,2.9);c.stroke();
  c.fillStyle='#fff';for(var i=0;i<4;i++){var a=t*2+i*1.6,x=Math.cos(a)*u*22,y=Math.sin(a*1.3)*u*14-u*4,z=u*(2+Math.abs(Math.sin(t*4+i)));c.beginPath();c.moveTo(x,y-z);c.lineTo(x+z*.35,y);c.lineTo(x,y+z);c.lineTo(x-z*.35,y);c.fill()}};
NEWART.queen=function(c,m,t,u,dir,bob){var f=Math.sin(t*2+m.bob)*u*2;c.translate(0,-u*4+f);c.fillStyle='rgba(255,40,90,.22)';c.beginPath();c.arc(0,0,u*34,0,6.3);c.fill();sh(c,u,22);c.fillStyle='#3a0d1f';c.beginPath();c.moveTo(-u*18,u*18);c.lineTo(-u*14,-u*8);c.quadraticCurveTo(0,-u*24,u*14,-u*8);c.lineTo(u*18,u*18);c.closePath();c.fill();ol(c);c.fillStyle=m.hit>0?'#fff':'#ff3b6e';c.beginPath();c.moveTo(-u*14,-u*6);c.quadraticCurveTo(0,-u*28,u*14,-u*6);c.quadraticCurveTo(0,-u*14,-u*14,-u*6);c.fill();
  E(c,0,-u*3,u*8,u*9,'#e8c8d8');eye(c,-u*3,-u*4,u*2,'#ff1e50');eye(c,u*3,-u*4,u*2,'#ff1e50');c.fillStyle='#ffd23f';c.beginPath();c.moveTo(-u*9,-u*10);c.lineTo(-u*7,-u*20);c.lineTo(-u*3,-u*12);c.lineTo(0,-u*22);c.lineTo(u*3,-u*12);c.lineTo(u*7,-u*20);c.lineTo(u*9,-u*10);c.closePath();c.fill();ol(c);
  c.strokeStyle='#ffd0e0';c.lineWidth=u*2;c.beginPath();c.arc(u*22,-u*14,u*7,.9,5.4);c.stroke()};
function hookArt(){if(!window.YA||!YA.monster||YA.monster._x)return;var orig=YA.monster;
  YA.monster=function(ctx,m,t,tx,ty){var f=NEWART[m.type];if(!f)return orig(ctx,m,t,tx,ty);var u=m.sz/20,dir=tx>=m.x?1:-1,bob=Math.sin(t*5+m.bob);ctx.save();ctx.translate(m.x,m.y);try{f(ctx,m,t,u,dir,bob)}catch(e){}ctx.restore()};YA.monster._x=1}
hookArt();

/* ====================== sandıklar ====================== */
var TIERS=[
 {n:'Normal Sandık',p:200,ic:'📦',col:'#c9ced9',mat:['wood','stone','copper','copper','iron']},
 {n:'Ender Sandık',p:900,ic:'🎁',col:'#7be07b',mat:['copper','iron','iron','silver','i_copper']},
 {n:'Nadir Sandık',p:4000,ic:'💠',col:'#5cb0ff',mat:['iron','silver','goldore','i_iron','i_silver']},
 {n:'Destansı Sandık',p:15000,ic:'🔮',col:'#c07cff',mat:['silver','goldore','mithril','i_gold','i_mithril']},
 {n:'Efsanevi Sandık',p:60000,ic:'👑',col:'#ffb02e',mat:['mithril','titan','i_mithril','i_titan','hwood']},
 {n:'Mitik Sandık',p:250000,ic:'🌌',col:'#ff5b6e',mat:['titan','aster','i_titan','i_aster','core']}];
var RC=['#c9ced9','#7be07b','#5cb0ff','#c07cff','#ffb02e','#ff5b6e'];
function matName(k){var m=Y.MATS[k];return m?m.ic+' '+m.n:k}
function roll(ti){var T=TIERS[ti],out=[],n=2+ti;
  var g=Math.round(T.p*(.2+Math.random()*.5)*(Math.random()<.04?3:1));out.push({ic:'🪙',t:g+' altın',r:Math.min(5,Math.max(0,Math.floor(ti*.6))),f:function(){P.gold+=g}});
  for(var i=1;i<n;i++){var r=Math.random();
    if(r<.55){var k=pick(T.mat),q=Y.MATS[k]&&Y.MATS[k].ing?1+Math.floor(Math.random()*(1+ti)):2+Math.floor(Math.random()*(3+ti*2));out.push({ic:Y.MATS[k].ic,t:q+' '+Y.MATS[k].n,r:Math.min(5,ti),f:(function(k,q){return function(){P[k]=(P[k]||0)+q}})(k,q)})}
    else if(r<.7){out.push({ic:'⚗️',t:'XP İksiri (10 dk +%50 XP)',r:2,f:function(){X.xb=Math.max(Date.now(),X.xb||0)+600000}})}
    else if(r<.85){var cs=cosmetic(ti);if(cs)out.push({ic:'👗',t:'Kostüm: '+cs.n,r:Math.min(5,2+Math.floor(ti*.6)),f:function(){P.cs[cs.slot+':'+cs.id]=1}});else{var g2=Math.round(T.p*.2);out.push({ic:'🪙',t:g2+' altın',r:ti>1?1:0,f:function(){P.gold+=g2}})}}
    else{var g3=Math.round(T.p*(.1+Math.random()*.3));out.push({ic:'🪙',t:g3+' altın',r:ti>1?1:0,f:function(){P.gold+=g3}})}}
  if(Math.random()<.1+.06*ti){var lk=ti>=3?2:ti>=2?1:0;out.push({ic:'🥚',t:'Gizemli Yumurta'+(lk>=2?' ✨':''),r:Math.min(5,2+ti%4),f:function(){A.giveEgg(lk)}})}
  if(ti>=2&&Math.random()<.12+.05*ti){out.push({ic:'🗺️',t:'Define Haritası',r:3,f:function(){giveMap(ti)}})}
  return out}
function cosmetic(ti){var slots=['hair','top','bottom','shoes','hat','face','neck','back'],c=[],hi=[120,400,1200,4000,12000,60000][ti];
  slots.forEach(function(s){((window.YL&&YL.CAT[s])||[]).forEach(function(x){if(x.p>0&&x.p<=hi&&!P.cs[s+':'+x.id])c.push({slot:s,id:x.id,n:x.n,p:x.p})})});
  if(!c.length)return null;c.sort(function(a,b){return b.p-a.p});return c[Math.floor(Math.random()*Math.min(c.length,6))]}
function chestHtml(){var h='<h3 style="margin:4px 0 6px">🎁 Sandıklar <small style="font-weight:400;opacity:.8">(altınla · sandık büyüdükçe ödül büyür)</small></h3>';
  TIERS.forEach(function(T,i){h+='<div class="it"><span style="font-size:1.6rem">'+T.ic+'</span><div class="t"><b style="color:'+T.col+'">'+T.n+'</b><br><small>'+(2+i)+' ödül'+(i>=2?' · define haritası şansı':'')+(i>=3?' · yoldaş yumurtası şansı yüksek':'')+'</small></div><button class="btn" data-chest="'+i+'" type="button">🪙 '+T.p.toLocaleString('tr-TR')+'</button></div>'});
  return h+'<div id="xchres"></div><hr style="border:0;border-top:1px solid rgba(255,255,255,.12);margin:10px 0">'}
function openChest(i,el){var T=TIERS[i],box=el.querySelector('#xchres');if(P.gold<T.p){box.innerHTML='<p class="sub" style="color:#ff8a8a">Altının yetmiyor (🪙 '+P.gold+' / '+T.p+').</p>';return}
  P.gold-=T.p;inc('ch');var items=roll(i);items.forEach(function(it){it.f()});D.saveNow();
  box.innerHTML='<p class="sub"><b style="color:'+T.col+'">'+T.n+'</b> açılıyor…</p><div id="xchl"></div>';var l=box.querySelector('#xchl'),k=0;
  (function nx(){if(k>=items.length){var s=document.createElement('p');s.className='sub';s.textContent='Kalan altının: 🪙 '+P.gold;l.appendChild(s);return}
    var it=items[k++],d=document.createElement('div');d.className='it';d.style.cssText='border-color:'+RC[it.r]+';animation:xpop .35s';d.innerHTML='<span style="font-size:1.3rem">'+it.ic+'</span><div class="t"><b style="color:'+RC[it.r]+'">'+esc(it.t)+'</b></div>';l.appendChild(d);setTimeout(nx,i>=3?420:260)})()}
function shopChests(el){if(!el)return;if(!$('xstyle')){var st=document.createElement('style');st.id='xstyle';st.textContent='@keyframes xpop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}';document.head.appendChild(st)}
  var w=document.createElement('div');w.innerHTML=chestHtml();el.insertBefore(w,el.firstChild);w.querySelectorAll('[data-chest]').forEach(function(b){b.onclick=function(){openChest(+b.dataset.chest,el)}})}
function grantChest(ti){var items=roll(ti);items.forEach(function(it){it.f()});D.saveNow();D.say('🎁 '+TIERS[ti].n+' ödülü: '+items.map(function(i){return i.t}).join(', '),'sys')}

/* ====================== define haritası ====================== */
function giveMap(ti){if(X.tm){var g=300*(ti+1);P.gold+=g;D.say('🗺️ Zaten bir define haritan var; yerine '+g+' altın aldın.','sys');return}
  for(var k=0;k<200;k++){var a=Math.random()*6.28,d=26+Math.random()*(46+ti*4),tx=Math.floor(Y.CX+Math.cos(a)*d),ty=Math.floor(Y.CY+Math.sin(a)*d);
    if(tx<6||ty<6||tx>=Y.MW-6||ty>=Y.MH-6)continue;var z=Y.zoneAt(tx,ty);if(z===3||z===4||Y.nodeAt(tx,ty))continue;X.tm={x:(tx+.5)*TS,y:(ty+.5)*TS,tier:Math.min(5,ti)};D.say('🗺️ Define haritası! Üstteki çipte sıcak/soğuk ipucu çıkar. Yerini bulunca ✋ ile kaz.','sys');return}
  P.gold+=500}
function dig(){var tm=X.tm;if(!tm)return;X.tm=null;inc('dg');var ti=tm.tier,T=TIERS[Math.min(5,ti+1)],items=roll(Math.min(5,ti+1));items.forEach(function(it){it.f()});var g=Math.round(T.p*.6);P.gold+=g;
  D.say('💰 Define bulundu! '+items.map(function(i){return i.t}).join(', ')+' + '+g+' altın','sys');D.floatTxt(G.px,G.py-90,'💰 DEFİNE!','#ffd23f');D.saveNow()}

/* ====================== balık tutma ====================== */
var FISH=[
 {id:'hamsi',n:'Hamsi',ic:'🐟',v:4,w:30,lv:1,z:.40},{id:'sazan',n:'Sazan',ic:'🐟',v:7,w:28,lv:1,z:.36},{id:'alabalik',n:'Alabalık',ic:'🐠',v:14,w:18,lv:2,z:.30},
 {id:'levrek',n:'Levrek',ic:'🐟',v:22,w:12,lv:3,z:.26},{id:'cipura',n:'Çipura',ic:'🐠',v:32,w:9,lv:4,z:.22},{id:'yayin',n:'Yayın Balığı',ic:'🐋',v:80,w:4,lv:6,z:.16},
 {id:'mersin',n:'Mersin Balığı',ic:'🐡',v:170,w:2,lv:8,z:.12},{id:'altin',n:'Altın Balık',ic:'✨',v:320,w:1.1,lv:5,z:.10},{id:'ahtapot',n:'Kristal Ahtapot',ic:'🐙',v:560,w:.6,lv:10,z:.09},
 {id:'hayalet',n:'Hayalet Balık',ic:'👻',v:420,w:3,lv:4,z:.12,night:1},{id:'yilan',n:'Fırtına Yılanbalığı',ic:'⚡',v:480,w:4,lv:4,z:.12,storm:1},
 {id:'yaxest',n:'Yaxest Balığı',ic:'🐟',v:2500,w:.25,lv:12,z:.08,special:'Üstünde küçük bir "Y" yazıyor. Ya şans, ya kader.'},
 {id:'cizme',n:'Eski Çizme',ic:'🥾',v:1,w:7,lv:1,z:.50,junk:1},{id:'sise',n:'Mesaj Şişesi',ic:'🍾',v:30,w:2.5,lv:1,z:.34,bottle:1}];
var LEV={id:'leviathan',n:'Göl Canavarı',ic:'🦑',v:8000,z:.10,lv:10,stages:3};
var F={ph:'idle',t:0,fish:null,st:0,need:1,zone:[.4,.6],speed:3,msg:'',tm:null,mt:0};
function fishLv(){return X.fl.l}
function fishNeed(l){return 30+l*25}
function nearWater(){if(!G||G.mode!=='world'||D.inTownF())return false;for(var i=0;i<8;i++){var a=i*Math.PI/4,x=G.px+Math.cos(a)*(TS*1.15),y=G.py+Math.sin(a)*(TS*1.15);if(Y.zoneAt(Math.floor(x/TS),Math.floor(y/TS))===3)return true}return false}
function pickFish(){var night=A.hourP()<8,w=A.weatherNow(),lv=fishLv(),rain=w==='rain'||w==='storm';
  if(night&&w!=='clear'&&lv>=10&&Math.random()<.012)return LEV;
  var l=FISH.filter(function(f){return f.lv<=lv&&(!f.night||night)&&(!f.storm||w==='storm')}),tot=0,ws=l.map(function(f){var x=f.w*(rain&&f.w<10?1.5:1)*(f.junk&&lv>6?.5:1);tot+=x;return x}),r=Math.random()*tot;
  for(var i=0;i<l.length;i++){r-=ws[i];if(r<=0)return l[i]}return l[0]}
function zoneFor(f){var w=Math.min(.6,f.z+fishLv()*.012),c=.12+Math.random()*(.76-w);return[c,c+w]}
function fishHtml(){var l=fishLv(),inv=Object.keys(X.fh).filter(function(k){return X.fh[k]>0}),tot=0;
  var h='<p class="sub">🎣 Balıkçılık Sv <b>'+l+'</b> ('+X.fl.x+'/'+fishNeed(l)+') · Göl kenarına git; yağmurda daha çok, gece ve fırtınada özel balıklar çıkar.</p>';
  h+='<div id="xfs" class="sub" style="min-height:46px;font-size:1.05rem;text-align:center"></div>';
  h+='<div id="xfb" style="position:relative;height:28px;border-radius:14px;background:rgba(255,255,255,.1);overflow:hidden;margin:6px 0;display:none"><div id="xfz" style="position:absolute;top:0;bottom:0;background:rgba(91,227,154,.6)"></div><div id="xfm" style="position:absolute;top:0;bottom:0;width:7px;background:#fff;border-radius:4px"></div></div>';
  h+='<div class="row"><button class="btn" id="xfa" type="button">🎣 Oltayı at</button></div>';
  h+='<h3 style="margin:10px 0 4px">🧺 Sepet</h3>';
  if(!inv.length)h+='<p class="sub">Sepetin boş.</p>';
  inv.forEach(function(k){var f=k==='leviathan'?LEV:FISH.filter(function(x){return x.id===k})[0];if(!f)return;var v=f.v*X.fh[k];tot+=v;h+='<div class="it"><span style="font-size:1.3rem">'+f.ic+'</span><div class="t"><b>'+f.n+'</b> ×'+X.fh[k]+'<br><small>🪙 '+f.v+'/adet'+(f.special?' · '+esc(f.special):'')+'</small></div></div>'});
  if(inv.length)h+='<div class="row"><button class="btn" id="xfsell" type="button">Hepsini sat (🪙 '+tot+')</button></div>';
  return h}
function fishUI(){var s=$('xfs'),a=$('xfa'),b=$('xfb');if(!s)return;
  var T={idle:['🎣 Oltayı at',F.msg||'Hazırsın. Suya yakın dur ve oltayı at.'],wait:['Çek (erken!)',F.msg||'🫧 Şamandıra bekleniyor…'],bite:['ÇEK!','‼ BALIK VURDU! HEMEN ÇEK!'],reel:['Tut!',F.msg||'Beyaz çizgi yeşil alandayken bas!']}[F.ph];
  a.textContent=T[0];s.innerHTML=T[1];b.style.display=F.ph==='reel'?'block':'none';a.style.background=F.ph==='bite'?'#ff5b6e':'';
  if(F.ph==='reel'){var z=$('xfz');z.style.left=(F.zone[0]*100)+'%';z.style.width=((F.zone[1]-F.zone[0])*100)+'%'}}
function fishStep(){var pan=$('p-x');if(!pan||!pan.classList.contains('on')||!$('xfs')){clearInterval(F.tm);F.tm=0;F.ph='idle';F.msg='';return}
  if(F.ph==='wait'){F.t-=.04;if(F.t<=0){F.ph='bite';F.t=1.25;fishUI()}}
  else if(F.ph==='bite'){F.t-=.04;if(F.t<=0){F.ph='idle';F.msg='😞 Çok yavaştın, balık kaçtı.';fishUI()}}
  else if(F.ph==='reel'){F.mt+=.04*F.speed;var p=.5+.5*Math.sin(F.mt),m=$('xfm');if(m)m.style.left='calc('+(p*100)+'% - '+(p*7)+'px)';F.pos=p}}
function fishAct(){
  if(F.ph==='idle'){if(!nearWater()){F.msg='💧 Göl kenarına yaklaş (suya bitişik dur).';fishUI();return}F.ph='wait';var w=A.weatherNow();F.t=(w==='rain'||w==='storm'?1.5:2.2)+Math.random()*3.8;F.msg='';fishUI()}
  else if(F.ph==='wait'){F.ph='idle';F.msg='😬 Çok erken çektin, balık ürktü.';fishUI()}
  else if(F.ph==='bite'){F.fish=pickFish();F.need=F.fish.stages||1;F.st=1;F.zone=zoneFor(F.fish);F.speed=2.2+(1-Math.min(.5,F.fish.z))*3.4;F.mt=Math.random()*6;F.ph='reel';F.msg=F.fish.stages?'🦑 DEV BİR ŞEY! ('+F.st+'/'+F.need+')':'Balık oltada…';fishUI()}
  else if(F.ph==='reel'){var p=F.pos==null?.5:F.pos;
    if(p>=F.zone[0]&&p<=F.zone[1]){if(F.st>=F.need)catchFish();else{F.st++;F.zone=zoneFor(F.fish);F.speed+=.5;F.msg='💪 İyi gidiyor! ('+F.st+'/'+F.need+')';fishUI()}}
    else{F.ph='idle';F.msg='😞 '+F.fish.n+' kaçtı!';fishUI()}}}
function catchFish(){var f=F.fish,xp=Math.max(2,Math.round(f.v/6));X.fh[f.id]=(X.fh[f.id]||0)+1;inc('fb');X.fl.x+=xp;var up=false;
  while(X.fl.l<20&&X.fl.x>=fishNeed(X.fl.l)){X.fl.x-=fishNeed(X.fl.l);X.fl.l++;up=true}
  var extra='';if(f.bottle){giveMap(1);extra=' İçinden bir define haritası çıktı! 🗺️'}
  if(f.id==='leviathan'){inc('lv');P.gold+=2000;A.giveEgg(2);extra=' +2000 altın ve Efsanevi Yumurta!';D.say('🦑 GÖL CANAVARINI YAKALADIN!','sys')}
  if(f.id==='yaxest')D.say('🐟 Yaxest Balığı yakaladın! Kurucu seninle gurur duyuyor.','sys');
  F.ph='idle';F.msg=(up?'⬆️ Balıkçılık seviye atladı! ':'')+f.ic+' <b>'+f.n+'</b> yakaladın! (🪙 '+f.v+')'+(f.special?'<br><small>'+esc(f.special)+'</small>':'')+extra;D.saveNow();A.render()}
function fishBind(el){var a=el.querySelector('#xfa');if(!a)return;a.onclick=fishAct;var sl=el.querySelector('#xfsell');if(sl)sl.onclick=function(){var tot=0;Object.keys(X.fh).forEach(function(k){var f=k==='leviathan'?LEV:FISH.filter(function(x){return x.id===k})[0];if(f)tot+=f.v*X.fh[k]});X.fh={};P.gold+=tot;F.msg='🪙 '+tot+' altına sattın.';D.saveNow();A.render()};
  fishUI();clearInterval(F.tm);F.tm=setInterval(fishStep,40)}

/* ====================== kancalar ====================== */
function init(api){A=api;D=A.D();X=A.X();P=D.P;G=D.G;Y=D.Y;TS=Y.TS;X.fl=X.fl||{l:1,x:0};X.fh=X.fh||{};X.c.fb=X.c.fb||0;X.c.ch=X.c.ch||0;X.c.dg=X.c.dg||0;X.c.lv=X.c.lv||0;F.ph='idle';F.msg='';
  hookArt();
  [{id:'oltaci',n:'Oltacı',d:'25 balık tut.',t:'Oltacı',f:function(c){return c.fb>=25}},{id:'balikuzm',n:'Usta Balıkçı',d:'Balıkçılık seviye 10.',t:'Usta Balıkçı',f:function(c,x){return x.fl.l>=10}},
   {id:'lev',n:'Göl Yıkıcısı',d:'Göl Canavarı\'nı yakala.',t:'Göl Yıkıcısı',f:function(c){return c.lv>=1}},{id:'define',n:'Define Avcısı',d:'3 define bul.',t:'Define Avcısı',f:function(c){return c.dg>=3}},
   {id:'sandik',n:'Sandık Avcısı',d:'10 sandık aç.',t:'Sandık Avcısı',f:function(c){return c.ch>=10}}].forEach(function(a){if(!A.ACH.some(function(x){return x.id===a.id}))A.ACH.push(a)})}
function near(){if(!X||!G||G.mode!=='world')return null;
  if(X.tm&&hyp(X.tm.x-G.px,X.tm.y-G.py)<75)return{t:'x',o:{k:'dig'}};
  if(nearWater())return{t:'x',o:{k:'fish'}};return null}
function interact(o){if(o.k==='dig')dig();else if(o.k==='fish')A.openPanel('fish')}
function chip(){if(!X||!X.tm||!G)return'';var d=hyp(X.tm.x-G.px,X.tm.y-G.py)/TS;return '🗺️ '+(d<4?'🔥 Burada kaz!':d<12?'♨️ Çok yakın':d<30?'🧭 Yakın':'❄️ Uzak')+' ('+Math.round(d)+')'}
function draw(ctx,camX,camY,t,W,H){if(!X||!X.tm||!G||G.mode!=='world')return;var tm=X.tm,sx=tm.x-camX,sy=tm.y-camY,gx=G.px-camX,gy=G.py-camY;
  if(sx>-80&&sx<W+80&&sy>-80&&sy<H+80){var pu=.5+.5*Math.sin(t*4);ctx.fillStyle='rgba(255,60,60,'+(.12+.12*pu)+')';ctx.beginPath();ctx.arc(sx,sy,26+6*pu,0,6.28);ctx.fill();ctx.strokeStyle='#d62d2d';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(sx-12,sy-12);ctx.lineTo(sx+12,sy+12);ctx.moveTo(sx+12,sy-12);ctx.lineTo(sx-12,sy+12);ctx.stroke();ctx.lineCap='butt'}
  else{var a=Math.atan2(tm.y-G.py,tm.x-G.px),ax=gx+Math.cos(a)*90,ay=gy+Math.sin(a)*90;ctx.save();ctx.translate(ax,ay);ctx.rotate(a);ctx.fillStyle='rgba(255,210,63,.9)';ctx.strokeStyle='#7a5a00';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-8,-9);ctx.lineTo(-4,0);ctx.lineTo(-8,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}}
window.YX3={init:init,near:near,interact:interact,chip:chip,draw:draw,shopChests:shopChests,grantChest:grantChest,
 tabs:{fish:fishHtml},bind:function(el,tab){if(tab==='fish')fishBind(el)},TIERS:TIERS,dbg:{roll:roll,F:F,FISH:FISH,giveMap:giveMap,dig:dig}};
})();
