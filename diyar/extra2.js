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

/* ====================== balık tutma (tam ekran sahne) ====================== */
var FISH=[
 {id:'hamsi',n:'Hamsi',ic:'🐟',v:4,w:30,lv:1,z:.40},{id:'sazan',n:'Sazan',ic:'🐟',v:7,w:28,lv:1,z:.36},{id:'alabalik',n:'Alabalık',ic:'🐠',v:14,w:18,lv:2,z:.30},
 {id:'levrek',n:'Levrek',ic:'🐟',v:22,w:12,lv:3,z:.26},{id:'cipura',n:'Çipura',ic:'🐠',v:32,w:9,lv:4,z:.22},{id:'yayin',n:'Yayın Balığı',ic:'🐋',v:80,w:4,lv:6,z:.16},
 {id:'mersin',n:'Mersin Balığı',ic:'🐡',v:170,w:2,lv:8,z:.12},{id:'altin',n:'Altın Balık',ic:'✨',v:320,w:1.1,lv:5,z:.10},{id:'ahtapot',n:'Kristal Ahtapot',ic:'🐙',v:560,w:.6,lv:10,z:.09},
 {id:'hayalet',n:'Hayalet Balık',ic:'👻',v:420,w:3,lv:4,z:.12,night:1},{id:'yilan',n:'Fırtına Yılanbalığı',ic:'⚡',v:480,w:4,lv:4,z:.12,storm:1},
 {id:'yaxest',n:'Yaxest Balığı',ic:'🐟',v:2500,w:.25,lv:12,z:.08,special:'Üstünde küçük bir "Y" yazıyor. Ya şans, ya kader.'},
 {id:'cizme',n:'Eski Çizme',ic:'🥾',v:1,w:7,lv:1,z:.50,junk:1},{id:'sise',n:'Mesaj Şişesi',ic:'🍾',v:30,w:2.5,lv:1,z:.34,bottle:1}];
var LEV={id:'leviathan',n:'Göl Canavarı',ic:'🦑',v:8000,z:.10,lv:10,stages:3};
var F={ph:'idle',t:0,fish:null,st:0,need:1,zone:[.4,.6],speed:3,msg:'',mt:0,pos:.5,res:null,resT:0,flash:0,open:0,raf:0,last:0,sheet:'',shake:0,hit:0};
function fishById(k){return k==='leviathan'?LEV:FISH.filter(function(x){return x.id===k})[0]}
function fishLv(){return X.fl.l}
function fishNeed(l){return 30+l*25}
function rarOf(f){return f.junk?['Çöp','#9aa3b5']:f.v<15?['Yaygın','#c9ced9']:f.v<100?['Seyrek','#7be07b']:f.v<500?['Nadir','#5cb0ff']:f.v<3000?['Destansı','#c07cff']:['Efsanevi','#ffb02e']}
function nearWater(){if(!G||G.mode!=='world'||D.inTownF())return false;for(var i=0;i<8;i++){var a=i*Math.PI/4,x=G.px+Math.cos(a)*(TS*1.15),y=G.py+Math.sin(a)*(TS*1.15);if(Y.zoneAt(Math.floor(x/TS),Math.floor(y/TS))===3)return true}return false}
function pickFish(){var night=A.hourP()<8,w=A.weatherNow(),lv=fishLv(),rain=w==='rain'||w==='storm';
  if(night&&w!=='clear'&&lv>=10&&Math.random()<.012)return LEV;
  var l=FISH.filter(function(f){return f.lv<=lv&&(!f.night||night)&&(!f.storm||w==='storm')}),tot=0,ws=l.map(function(f){var x=f.w*(rain&&f.w<10?1.5:1)*(f.junk&&lv>6?.5:1);tot+=x;return x}),r=Math.random()*tot;
  for(var i=0;i<l.length;i++){r-=ws[i];if(r<=0)return l[i]}return l[0]}
function zoneFor(f){var w=Math.min(.6,f.z+fishLv()*.012),c=.12+Math.random()*(.76-w);return[c,c+w]}
function status(){return{idle:F.msg||'Oltayı at: ekrana dokun veya düğmeye bas.',wait:F.msg||'Şamandırayı izle… balık vurunca hemen çek!',bite:'‼ BALIK VURDU! ÇEK!',reel:F.msg||'Çizgi yeşil alandayken dokun!'}[F.ph]}
function btnTxt(){return{idle:'🎣 AT',wait:'ÇEK',bite:'ÇEK!!',reel:'TUT!'}[F.ph]}
function fishAct(){
  if(F.ph==='idle'){F.ph='wait';var w=A.weatherNow();F.t=(w==='rain'||w==='storm'?1.5:2.2)+Math.random()*3.8;F.msg='';F.res=null;F.hit=0}
  else if(F.ph==='wait'){F.ph='idle';F.msg='😬 Çok erken çektin, balık ürktü.'}
  else if(F.ph==='bite'){F.fish=pickFish();F.need=F.fish.stages||1;F.st=1;F.zone=zoneFor(F.fish);F.speed=2.2+(1-Math.min(.5,F.fish.z))*3.4;F.mt=Math.random()*6;F.ph='reel';F.msg=F.fish.stages?'🦑 DEV BİR ŞEY! (1/'+F.need+')':'';F.shake=.4}
  else if(F.ph==='reel'){
    if(F.pos>=F.zone[0]&&F.pos<=F.zone[1]){F.hit=.25;if(F.st>=F.need)catchFish();else{F.st++;F.zone=zoneFor(F.fish);F.speed+=.5;F.msg='💪 İyi gidiyor! ('+F.st+'/'+F.need+')'}}
    else{F.ph='idle';F.msg='😞 '+F.fish.n+' kaçtı!';F.fish=null}}
  hud()}
function catchFish(){var f=F.fish,xp=Math.max(2,Math.round(f.v/6));X.fh[f.id]=(X.fh[f.id]||0)+1;X.fd=X.fd||{};var nw=!X.fd[f.id];X.fd[f.id]=1;inc('fb');X.fl.x+=xp;var up=false;
  while(X.fl.l<20&&X.fl.x>=fishNeed(X.fl.l)){X.fl.x-=fishNeed(X.fl.l);X.fl.l++;up=true}
  var extra='';if(f.bottle){giveMap(1);extra='İçinden bir define haritası çıktı! 🗺️'}
  if(f.id==='leviathan'){inc('lv');P.gold+=2000;A.giveEgg(2);extra='+2000 altın ve Efsanevi Yumurta!';D.say('🦑 GÖL CANAVARINI YAKALADIN!','sys')}
  if(f.id==='yaxest')D.say('🐟 Yaxest Balığı yakaladın! Kurucu seninle gurur duyuyor.','sys');
  F.ph='idle';F.msg='';F.res={f:f,xp:xp,up:up,nw:nw,extra:extra};F.resT=3.2;F.fish=null;D.saveNow()}
/* ---- arayüz ---- */
var FCSS='.fo{position:fixed;inset:0;z-index:70;display:flex;flex-direction:row;background:#07102a;color:#fff;font-family:inherit;user-select:none;-webkit-user-select:none;touch-action:manipulation}.fo *{box-sizing:border-box}.fo-sc{position:relative;flex:1;min-width:0}.fo canvas{position:absolute;inset:0;width:100%;height:100%;display:block}'
+'.fo-top{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:10px;padding:max(8px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) 8px max(12px,env(safe-area-inset-left));background:linear-gradient(#000a,#0000);z-index:3}'
+'.fo-lv{flex:1;min-width:0}.fo-lv b{font-size:.95rem}.fo-bar{height:7px;border-radius:5px;background:#ffffff26;margin-top:4px;overflow:hidden}.fo-bar i{display:block;height:100%;background:linear-gradient(90deg,#5be39a,#3df0ff)}'
+'.fo-chip{font-size:.8rem;padding:5px 10px;border-radius:14px;background:#ffffff1c;white-space:nowrap}.fo-x{width:42px;height:42px;border-radius:50%;border:0;background:#ffffff26;color:#fff;font-size:1.2rem;cursor:pointer}'
+'.fo-st{position:absolute;left:12px;right:12px;top:calc(64px + env(safe-area-inset-top));text-align:center;font-size:1.05rem;font-weight:700;text-shadow:0 2px 8px #000;z-index:2;pointer-events:none}'
+'.fo-side{width:clamp(160px,24vw,230px);display:flex;flex-direction:column;gap:10px;justify-content:flex-end;padding:12px max(14px,env(safe-area-inset-right)) max(14px,env(safe-area-inset-bottom)) 10px;background:linear-gradient(90deg,#0000,#0b1a45 40%);z-index:3}'
+'.fo-go{height:clamp(70px,24vh,120px);border-radius:26px;border:0;background:linear-gradient(#ffd23f,#ff9d2e);color:#3a2300;font-size:1.7rem;font-weight:900;box-shadow:0 6px 0 #b86a00,0 10px 24px #0008;cursor:pointer;transition:transform .08s}.fo-go:active{transform:translateY(5px);box-shadow:0 1px 0 #b86a00}.fo-go.bite{background:linear-gradient(#ff7a7a,#ff3b3b);color:#fff;box-shadow:0 6px 0 #a01818,0 0 28px #ff3b3b;animation:fopulse .35s infinite alternate}@keyframes fopulse{to{transform:scale(1.06)}}'
+'.fo-mini{display:flex;gap:8px}.fo-mini button{flex:1;padding:11px 6px;border-radius:14px;border:0;background:#ffffff1f;color:#fff;font-size:.88rem;font-weight:700;cursor:pointer}'
+'.fo-res{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);z-index:4;min-width:220px;max-width:86%;text-align:center;padding:16px 22px;border-radius:22px;background:#0b1a45ee;border:2px solid var(--rc,#fff);box-shadow:0 10px 40px #000a;animation:fopop .4s}@keyframes fopop{0%{transform:translate(-50%,-50%) scale(.5);opacity:0}70%{transform:translate(-50%,-50%) scale(1.08)}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}.fo-res .e{font-size:3.4rem;line-height:1}.fo-res b{display:block;font-size:1.2rem;margin-top:4px}.fo-res small{display:block;opacity:.85;margin-top:3px}'
+'.fo-sheet{position:absolute;inset:0;z-index:6;background:#050c22f2;display:flex;flex-direction:column;padding:max(10px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left))}.fo-sheet h3{margin:0;font-size:1.1rem}.fo-sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.fo-list{flex:1;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;align-content:start;-webkit-overflow-scrolling:touch}'
+'.fo-it{padding:10px;border-radius:14px;background:#ffffff14;border:1.5px solid var(--rc,#ffffff30);text-align:center;font-size:.85rem}.fo-it .e{font-size:1.8rem}.fo-sell{margin-top:8px;padding:13px;border-radius:16px;border:0;background:linear-gradient(#5be39a,#2bbf74);color:#06301a;font-size:1rem;font-weight:800;cursor:pointer}'
+'@media (max-width:640px) and (orientation:portrait){.fo{flex-direction:column}.fo-side{width:auto;flex-direction:row;align-items:stretch;background:#0b1a45;padding-top:10px}.fo-go{flex:1.4;height:auto;min-height:70px}.fo-mini{flex:1;flex-direction:column}.fo-st{top:calc(64px + env(safe-area-inset-top))}}';
function fo(id){return document.getElementById(id)}
function openFish(){if(F.open||!G)return;F.open=1;F.ph='idle';F.msg='';F.res=null;F.sheet='';G.paused=true;
  if(!fo('fostyle')){var st=document.createElement('style');st.id='fostyle';st.textContent=FCSS;document.head.appendChild(st)}
  var el=document.createElement('div');el.className='fo';el.id='fo';
  el.innerHTML='<div class="fo-sc" id="fosc"><canvas id="focv"></canvas><div class="fo-top"><div class="fo-lv"><b id="folv"></b><div class="fo-bar"><i id="fobar"></i></div></div><span class="fo-chip" id="fowx"></span><span class="fo-chip" id="fogd"></span><button class="fo-x" id="fox" type="button" aria-label="Kapat">✕</button></div><div class="fo-st" id="fost"></div></div>'
  +'<div class="fo-side"><div class="fo-mini"><button id="fobk" type="button">🧺 Sepet</button><button id="fodx" type="button">📖 Rehber</button></div><button class="fo-go" id="fogo" type="button"></button></div>';
  document.body.appendChild(el);
  fo('fox').onclick=closeFish;fo('fogo').onclick=fishAct;fo('fobk').onclick=function(){sheet('bag')};fo('fodx').onclick=function(){sheet('dex')};
  fo('focv').addEventListener('pointerdown',function(e){if(F.sheet)return;e.preventDefault();if(F.res&&F.resT>0.6){F.res=null}else fishAct()});
  document.addEventListener('keydown',fkey);F.last=performance.now();hud();loop()}
function fkey(e){if(!F.open)return;if(e.key==='Escape')closeFish();else if(e.key===' '||e.key==='Enter'){e.preventDefault();fishAct()}}
function closeFish(){F.open=0;cancelAnimationFrame(F.raf);document.removeEventListener('keydown',fkey);var el=fo('fo');if(el)el.remove();if(G)G.paused=false;F.ph='idle';D.saveNow()}
function hud(){if(!F.open)return;var l=fishLv();fo('folv').textContent='🎣 Balıkçılık Sv '+l+(l>=20?' (Maks)':'  ·  '+X.fl.x+'/'+fishNeed(l));fo('fobar').style.width=(l>=20?100:Math.min(100,X.fl.x/fishNeed(l)*100))+'%';
  var w=A.weatherNow(),night=A.hourP()<8;fo('fowx').textContent=(night?'🌙 ':'')+({clear:'☀️ Açık',rain:'🌧 Yağmur',fog:'🌫 Sis',storm:'⛈ Fırtına'})[w];fo('fogd').textContent='🪙 '+P.gold;
  fo('fost').textContent=status();var b=fo('fogo');b.textContent=btnTxt();b.className='fo-go'+(F.ph==='bite'?' bite':'')}
function sheet(kind){F.sheet=kind;var sc=fo('fosc');var old=fo('fosheet');if(old)old.remove();if(!kind)return;
  var d=document.createElement('div');d.className='fo-sheet';d.id='fosheet';var h='<div class="fo-sh"><h3>'+(kind==='bag'?'🧺 Sepet':'📖 Balık Rehberi')+'</h3><button class="fo-x" id="fosx" type="button">✕</button></div><div class="fo-list">';var tot=0;
  if(kind==='bag'){var ks=Object.keys(X.fh).filter(function(k){return X.fh[k]>0});if(!ks.length)h+='<p style="opacity:.7;grid-column:1/-1">Sepetin boş. Oltayı at!</p>';ks.forEach(function(k){var f=fishById(k);if(!f)return;tot+=f.v*X.fh[k];h+='<div class="fo-it" style="--rc:'+rarOf(f)[1]+'"><div class="e">'+f.ic+'</div><b>'+f.n+'</b> ×'+X.fh[k]+'<br><small>🪙 '+f.v+' / adet</small></div>'})}
  else{X.fd=X.fd||{};FISH.concat([LEV]).forEach(function(f){var s=!!X.fd[f.id];h+='<div class="fo-it" style="--rc:'+(s?rarOf(f)[1]:'#ffffff30')+'"><div class="e">'+(s?f.ic:'❔')+'</div><b>'+(s?f.n:'???')+'</b><br><small>'+(s?rarOf(f)[0]+' · 🪙 '+f.v+(f.special?'<br>'+esc(f.special):''):(f.night?'Gece çıkar':f.storm?'Fırtınada çıkar':f.id==='leviathan'?'Gece, kötü havada…':'Henüz yakalanmadı'))+'</small></div>'});}
  h+='</div>'+(kind==='bag'&&tot?'<button class="fo-sell" id="fosell" type="button">Hepsini sat · 🪙 '+tot+'</button>':'');d.innerHTML=h;sc.parentNode.appendChild(d);d.style.position='absolute';
  fo('fosx').onclick=function(){sheet('')};var sl=fo('fosell');if(sl)sl.onclick=function(){X.fh={};P.gold+=tot;F.msg='🪙 '+tot+' altına sattın.';D.saveNow();sheet('');hud()}}
function loop(){if(!F.open)return;var now=performance.now(),dt=Math.min(.05,(now-F.last)/1000);F.last=now;
  if(F.ph==='wait'){F.t-=dt;if(F.t<=0){F.ph='bite';F.t=1.25;hud()}}
  else if(F.ph==='bite'){F.t-=dt;if(F.t<=0){F.ph='idle';F.msg='😞 Çok yavaştın, balık kaçtı.';hud()}}
  else if(F.ph==='reel'){F.mt+=dt*F.speed;F.pos=.5+.5*Math.sin(F.mt)}
  if(F.res){F.resT-=dt;if(F.resT<=0){F.res=null;hud()}}if(F.shake>0)F.shake-=dt;if(F.hit>0)F.hit-=dt;
  scene(now/1000);F.raf=requestAnimationFrame(loop)}
var _rs=null;
function resUI(){var r=F.res;if(!r){var o=fo('fores');if(o)o.remove();_rs=null;return}if(_rs===r)return;_rs=r;var o2=fo('fores');if(o2)o2.remove();var f=r.f,q=rarOf(f),d=document.createElement('div');d.className='fo-res';d.id='fores';d.style.setProperty('--rc',q[1]);
  d.innerHTML='<div class="e">'+f.ic+'</div><b style="color:'+q[1]+'">'+f.n+'</b><small>'+q[0]+' · 🪙 '+f.v+' · +'+r.xp+' XP'+(r.nw?' · <b style="display:inline;color:#ffd23f">YENİ!</b>':'')+'</small>'+(r.up?'<small style="color:#5be39a;font-weight:800">⬆ Balıkçılık seviye atladı!</small>':'')+(f.special?'<small>'+esc(f.special)+'</small>':'')+(r.extra?'<small style="color:#ffd23f">'+esc(r.extra)+'</small>':'');fo('fosc').appendChild(d);hud()}
function scene(t){var cv=fo('focv');if(!cv)return;var W=cv.clientWidth,H=cv.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
  var c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);var h=A.hourP(),night=h<8,w=A.weatherNow(),hz=H*.4;resUI();
  var sk=night?['#050a24','#1b2a5a']:h<10?['#ff9a6a','#ffd9a0']:h>=22?['#ff7a5a','#7a4a8a']:['#4aa8ff','#bfe9ff'];if(w==='storm')sk=night?['#05060f','#1a1f33']:['#2a3144','#5a647a'];else if(w==='rain'||w==='fog')sk=night?['#070b1f','#1b2548']:['#6b7b92','#aab6c6'];
  var g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,sk[0]);g.addColorStop(1,sk[1]);c.fillStyle=g;c.fillRect(0,0,W,hz+2);
  if(night&&w==='clear'){c.fillStyle='#fff';for(var i=0;i<46;i++){var sx=(i*97.3)%W,sy=(i*53.7)%(hz*.8);c.globalAlpha=.4+.5*Math.abs(Math.sin(t*1.3+i));c.fillRect(sx,sy,1.6,1.6)}c.globalAlpha=1;c.fillStyle='#fff7d6';c.beginPath();c.arc(W*.82,hz*.3,16,0,6.3);c.fill();c.fillStyle=sk[0];c.beginPath();c.arc(W*.82+7,hz*.3-4,14,0,6.3);c.fill()}
  else if(!night&&w==='clear'){c.fillStyle='#fff6b0';c.beginPath();c.arc(W*.8,hz*.35,22,0,6.3);c.fill();c.fillStyle='rgba(255,246,176,.25)';c.beginPath();c.arc(W*.8,hz*.35,36,0,6.3);c.fill()}
  c.fillStyle=night?'#0d1a3a':'#3b6f4a';c.beginPath();c.moveTo(0,hz);for(var x=0;x<=W;x+=20)c.lineTo(x,hz-14-12*Math.sin(x*.012+1.3)-8*Math.sin(x*.03));c.lineTo(W,hz);c.fill();
  var wg=c.createLinearGradient(0,hz,0,H);wg.addColorStop(0,night?'#0f2a5e':'#2f8fd6');wg.addColorStop(1,night?'#050f2a':'#0b3a78');c.fillStyle=wg;c.fillRect(0,hz,W,H-hz);
  c.strokeStyle=night?'rgba(160,190,255,.16)':'rgba(255,255,255,.22)';c.lineWidth=1.6;for(var r=0;r<9;r++){var y=hz+8+r*(H-hz)/9.5;c.beginPath();for(var x2=0;x2<=W;x2+=12){var yy=y+Math.sin(x2*.02+t*1.2+r)*(2+r*.5);x2?c.lineTo(x2,yy):c.moveTo(x2,yy)}c.stroke()}
  var bx=W*.56,by=hz+(H-hz)*.42,bob=Math.sin(t*2.2)*2,dip=0;if(F.ph==='bite')dip=7+Math.sin(t*40)*4;if(F.ph==='reel')dip=3;by+=bob+dip;
  /* oyuncu ve olta */ var px=W*.13,py=H*.9;try{YL.hero(c,px,py,P.ap,t,false,Math.max(1.4,Math.min(2.6,H/260)))}catch(e){}
  var rx=px+34,ry=py-H*.34;c.strokeStyle='#6b4a2b';c.lineWidth=3.5;c.lineCap='round';c.beginPath();c.moveTo(px+14,py-26);c.lineTo(rx,ry);c.stroke();c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=1.3;c.beginPath();c.moveTo(rx,ry);
  if(F.ph==='idle'&&!F.res)c.lineTo(rx+6,ry+22);else c.quadraticCurveTo((rx+bx)/2,Math.min(ry,by)-30,bx,by-6);c.stroke();c.lineCap='butt';
  if(F.ph!=='idle'){c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=1.4;for(var k=0;k<3;k++){var rr=(t*14+k*9)%27;c.globalAlpha=1-rr/27;c.beginPath();c.ellipse(bx,by+4,rr+6,(rr+6)*.32,0,0,6.3);c.stroke()}c.globalAlpha=1;
   c.fillStyle='#fff';c.beginPath();c.arc(bx,by,7,Math.PI,6.3);c.fill();c.fillStyle='#e0262b';c.beginPath();c.arc(bx,by,7,0,Math.PI);c.fill();c.strokeStyle='#17102a';c.lineWidth=1.4;c.beginPath();c.arc(bx,by,7,0,6.3);c.stroke()}
  if(F.ph==='wait'||F.ph==='bite'){var fx=bx+Math.cos(t*1.4)*60*(F.ph==='wait'?1:.25),fy=by+22+Math.sin(t*1.4)*10;c.fillStyle='rgba(8,20,50,.42)';c.beginPath();c.ellipse(fx,fy,17,6,Math.cos(t*1.4+1.6)*.3,0,6.3);c.fill();c.beginPath();c.moveTo(fx-15,fy);c.lineTo(fx-27,fy-6);c.lineTo(fx-27,fy+6);c.fill()}
  if(F.ph==='bite'){c.fillStyle='rgba(255,50,50,'+(.1+.1*Math.sin(t*30))+')';c.fillRect(0,0,W,H);c.fillStyle='#fff';c.strokeStyle='#e01818';c.lineWidth=5;c.font='900 '+Math.round(Math.min(64,H*.16))+'px system-ui';c.textAlign='center';c.strokeText('!',bx,by-52);c.fillText('!',bx,by-52)}
  if(F.ph==='reel'){var f=F.fish||{},ox=Math.sin(t*14)*5*(F.shake>0?1:.4),fy2=by+18+Math.sin(t*9)*6;c.save();c.translate(bx+ox,fy2);c.font=Math.round(Math.min(46,H*.11))+'px system-ui';c.textAlign='center';c.globalAlpha=.9;c.fillText(f.ic||'🐟',0,0);c.restore();c.globalAlpha=1;
   var bw=Math.min(W*.82,560),bh=Math.max(34,Math.min(48,H*.1)),bxx=(W-bw)/2-(W>700?0:0),byy=H-bh-Math.max(16,H*.05)-(W<640&&H>W?72:70);byy=Math.min(byy,H-bh-86);
   c.fillStyle='rgba(5,12,34,.82)';rrect(c,bxx-8,byy-8,bw+16,bh+16,16);c.fill();c.fillStyle='rgba(255,255,255,.14)';rrect(c,bxx,byy,bw,bh,bh/2);c.fill();c.fillStyle='rgba(91,227,154,.75)';rrect(c,bxx+F.zone[0]*bw,byy,(F.zone[1]-F.zone[0])*bw,bh,bh/2);c.fill();
   var mx=bxx+F.pos*bw,inz=F.pos>=F.zone[0]&&F.pos<=F.zone[1];c.fillStyle=inz?'#fff':'#ffd23f';c.shadowColor=inz?'#5be39a':'#000';c.shadowBlur=inz?14:4;rrect(c,mx-5,byy-6,10,bh+12,5);c.fill();c.shadowBlur=0;
   for(var s=0;s<F.need;s++){c.fillStyle=s<F.st-1?'#5be39a':'#ffffff44';c.beginPath();c.arc(W/2+(s-(F.need-1)/2)*18,byy-22,6,0,6.3);c.fill()}}
  if(w==='rain'||w==='storm'){c.strokeStyle='rgba(190,215,255,.5)';c.lineWidth=1.3;c.beginPath();for(var q=0;q<90;q++){var rx2=((q*73.1+t*(w==='storm'?500:300))%(W+60))-30,ry2=((q*131.7+t*(w==='storm'?900:620))%H);c.moveTo(rx2,ry2);c.lineTo(rx2-5,ry2+14)}c.stroke();if(w==='storm'&&Math.sin(t*2.1)>.985){c.fillStyle='rgba(255,255,255,.55)';c.fillRect(0,0,W,H)}}
  if(w==='fog'){c.fillStyle='rgba(220,230,240,.28)';c.fillRect(0,0,W,H)}
  if(F.hit>0){c.fillStyle='rgba(91,227,154,'+F.hit*.9+')';c.fillRect(0,0,W,H)}}
function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}

/* ====================== kancalar ====================== */
function init(api){A=api;D=A.D();X=A.X();P=D.P;G=D.G;Y=D.Y;TS=Y.TS;X.fl=X.fl||{l:1,x:0};X.fh=X.fh||{};X.c.fb=X.c.fb||0;X.c.ch=X.c.ch||0;X.c.dg=X.c.dg||0;X.c.lv=X.c.lv||0;F.ph='idle';F.msg='';F.open=0;
  hookArt();
  [{id:'oltaci',n:'Oltacı',d:'25 balık tut.',t:'Oltacı',f:function(c){return c.fb>=25}},{id:'balikuzm',n:'Usta Balıkçı',d:'Balıkçılık seviye 10.',t:'Usta Balıkçı',f:function(c,x){return x.fl.l>=10}},
   {id:'lev',n:'Göl Yıkıcısı',d:'Göl Canavarı\'nı yakala.',t:'Göl Yıkıcısı',f:function(c){return c.lv>=1}},{id:'define',n:'Define Avcısı',d:'3 define bul.',t:'Define Avcısı',f:function(c){return c.dg>=3}},
   {id:'sandik',n:'Sandık Avcısı',d:'10 sandık aç.',t:'Sandık Avcısı',f:function(c){return c.ch>=10}}].forEach(function(a){if(!A.ACH.some(function(x){return x.id===a.id}))A.ACH.push(a)})}
function near(){if(!X||!G||G.mode!=='world')return null;
  if(X.tm&&hyp(X.tm.x-G.px,X.tm.y-G.py)<75)return{t:'x',o:{k:'dig'}};
  if(nearWater())return{t:'x',o:{k:'fish'}};return null}
function interact(o){if(o.k==='dig')dig();else if(o.k==='fish')openFish()}
function chip(){if(!X||!X.tm||!G)return'';var d=hyp(X.tm.x-G.px,X.tm.y-G.py)/TS;return '🗺️ '+(d<4?'🔥 Burada kaz!':d<12?'♨️ Çok yakın':d<30?'🧭 Yakın':'❄️ Uzak')+' ('+Math.round(d)+')'}
function draw(ctx,camX,camY,t,W,H){if(!X||!X.tm||!G||G.mode!=='world')return;var tm=X.tm,sx=tm.x-camX,sy=tm.y-camY,gx=G.px-camX,gy=G.py-camY;
  if(sx>-80&&sx<W+80&&sy>-80&&sy<H+80){var pu=.5+.5*Math.sin(t*4);ctx.fillStyle='rgba(255,60,60,'+(.12+.12*pu)+')';ctx.beginPath();ctx.arc(sx,sy,26+6*pu,0,6.28);ctx.fill();ctx.strokeStyle='#d62d2d';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(sx-12,sy-12);ctx.lineTo(sx+12,sy+12);ctx.moveTo(sx+12,sy-12);ctx.lineTo(sx-12,sy+12);ctx.stroke();ctx.lineCap='butt'}
  else{var a=Math.atan2(tm.y-G.py,tm.x-G.px),ax=gx+Math.cos(a)*90,ay=gy+Math.sin(a)*90;ctx.save();ctx.translate(ax,ay);ctx.rotate(a);ctx.fillStyle='rgba(255,210,63,.9)';ctx.strokeStyle='#7a5a00';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-8,-9);ctx.lineTo(-4,0);ctx.lineTo(-8,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}}
window.YX3={init:init,near:near,interact:interact,chip:chip,draw:draw,shopChests:shopChests,grantChest:grantChest,
 tabs:{fish:function(){return'<p class="sub">Balık tutmak için göl kenarında ✋ düğmesine bas.</p>'}},bind:function(){},TIERS:TIERS,dbg:{roll:roll,F:F,FISH:FISH,giveMap:giveMap,dig:dig}};
})();
