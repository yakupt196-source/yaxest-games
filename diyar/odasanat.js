/* Yaxest Diyarı: ev içi el yapımı çizimler. Hepsi kodla boyanır (resim dosyası yok): ahşap parke, duvar kâğıtları, işlemeli halı,
   gölgeli ve animasyonlu eşyalar, pencere ışığı, lamba/şömine parıltısı. window.YRA2 */
(function(){
'use strict';
var OL='#2b1a2e',TWL=40;
function rng(seed){var s=seed>>>0||1;return function(){s=(s+0x6D2B79F5)>>>0;var t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function hex(h){h=h.replace('#','');if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]}
function sh(h,a){var c=hex(h);return'rgb('+c.map(function(v){return Math.max(0,Math.min(255,Math.round(a>0?v+(255-v)*a:v*(1+a))))}).join(',')+')'}
function rr(c,x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h)}
function fs(c,fill,stroke,lw){c.fillStyle=fill;c.fill();if(stroke!==false){c.strokeStyle=stroke||OL;c.lineWidth=lw||1.6;c.stroke()}}
function shadow(c,x,y,w,h,a){c.fillStyle='rgba(28,12,36,'+(a||.3)+')';c.beginPath();c.ellipse(x,y,w,h,0,0,6.283);c.fill()}
function grad(c,x0,y0,x1,y1,stops){var g=c.createLinearGradient(x0,y0,x1,y1);stops.forEach(function(s){g.addColorStop(s[0],s[1])});return g}
function glow(c,x,y,r,col,a){c.save();c.globalCompositeOperation='lighter';var g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'rgba('+col+','+a+')');g.addColorStop(1,'rgba('+col+',0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,6.283);c.fill();c.restore()}
/* ---------- duvar kâğıdı ve zemin (önbellekli) ---------- */
var WP=[ /* ton, desen */
 {a:'#e2c79b',b:'#d3b384',p:'stripe'},{a:'#a9cfa6',b:'#8fbb8f',p:'leaf'},{a:'#a7bfe0',b:'#8ea8d0',p:'cloud'},
 {a:'#e1aeb0',b:'#cf9296',p:'rose'},{a:'#c3aee0',b:'#ac95d0',p:'lattice'},{a:'#3f4a6e',b:'#333d5c',p:'night'}];
var wallC={},floorC=null;
function wallImg(i,W,H){var k=i+':'+W;if(wallC[k])return wallC[k];var cv=document.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d'),T=WP[i]||WP[0],r=rng(100+i);
  c.fillStyle=T.a;c.fillRect(0,0,W,H);
  if(T.p==='stripe'){for(var x=0;x<W;x+=32){c.fillStyle=T.b;c.fillRect(x,0,16,H);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(x+16,0,2,H);for(var y=10;y<56;y+=18){c.fillStyle='rgba(255,255,255,.22)';c.beginPath();c.moveTo(x+8,y-4);c.lineTo(x+12,y);c.lineTo(x+8,y+4);c.lineTo(x+4,y);c.fill()}}}
  else if(T.p==='leaf'){for(var y2=0;y2<56;y2+=18)for(var x2=(y2/18%2)*14;x2<W;x2+=28){c.fillStyle=T.b;c.beginPath();c.ellipse(x2+8,y2+8,8,4,-.6,0,6.3);c.fill();c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=1;c.beginPath();c.moveTo(x2+3,y2+11);c.lineTo(x2+13,y2+5);c.stroke()}}
  else if(T.p==='cloud'){for(var x3=0;x3<W;x3+=46){var yy=10+r()*34;c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(x3,yy,14,5,0,0,6.3);c.ellipse(x3+9,yy-3,9,5,0,0,6.3);c.ellipse(x3-9,yy-2,8,4,0,0,6.3);c.fill()}c.fillStyle=T.b;c.fillRect(0,0,W,4)}
  else if(T.p==='rose'){for(var y4=6;y4<56;y4+=22)for(var x4=(y4%44?16:0);x4<W;x4+=32){c.fillStyle='#c77a85';c.beginPath();c.arc(x4+8,y4+6,6,0,6.3);c.fill();c.fillStyle='#e49aa4';c.beginPath();c.arc(x4+8,y4+6,3.6,0,6.3);c.fill();c.fillStyle='#8fbf8a';c.beginPath();c.ellipse(x4+17,y4+9,5,2.4,.5,0,6.3);c.ellipse(x4-1,y4+9,5,2.4,-.5,0,6.3);c.fill()}}
  else if(T.p==='lattice'){c.strokeStyle=T.b;c.lineWidth=2;for(var k=-60;k<W+60;k+=24){c.beginPath();c.moveTo(k,0);c.lineTo(k+60,60);c.moveTo(k+60,0);c.lineTo(k,60);c.stroke()}c.fillStyle='rgba(255,255,255,.35)';for(var kk=0;kk<W;kk+=24)for(var yk=0;yk<60;yk+=24){c.beginPath();c.arc(kk+12,yk+12,1.6,0,6.3);c.fill()}}
  else{for(var s=0;s<70;s++){c.fillStyle='rgba(255,240,180,'+(.25+r()*.6)+')';var sz=r()<.2?2:1;c.fillRect(r()*W,r()*58,sz,sz)}c.fillStyle='rgba(255,240,180,.8)';[[60,24],[210,40],[400,18],[500,44]].forEach(function(q){c.beginPath();c.moveTo(q[0],q[1]-4);c.lineTo(q[0]+1.3,q[1]-1.3);c.lineTo(q[0]+4,q[1]);c.lineTo(q[0]+1.3,q[1]+1.3);c.lineTo(q[0],q[1]+4);c.lineTo(q[0]-1.3,q[1]+1.3);c.lineTo(q[0]-4,q[1]);c.lineTo(q[0]-1.3,q[1]-1.3);c.fill()})}
  /* lambri: alt panel */
  c.fillStyle=grad(c,0,52,0,H,[[0,'#7a5232'],[1,'#5d3d24']]);c.fillRect(0,52,W,H-52);
  c.fillStyle='rgba(255,255,255,.12)';c.fillRect(0,52,W,2);
  for(var px=0;px<W;px+=56){c.strokeStyle='rgba(30,16,8,.45)';c.lineWidth=1.4;c.strokeRect(px+6,59,44,H-62);c.strokeStyle='rgba(255,220,170,.15)';c.strokeRect(px+8,61,40,H-66)}
  c.fillStyle='#8a5e38';c.fillRect(0,50,W,5);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(0,55,W,2);
  /* taç kornişi + alt gölge */
  c.fillStyle='#f4ead6';c.fillRect(0,0,W,6);c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,6,W,3);c.fillStyle='rgba(255,255,255,.7)';c.fillRect(0,0,W,1.5);
  var g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(0,0,0,.14)');g.addColorStop(.25,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  return wallC[k]=cv}
function floorImg(W,H,y0){if(floorC&&floorC.W===W)return floorC.cv;var cv=document.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d'),r=rng(7),PH=20,tones=['#c49a62','#b98f58','#cba36c','#b38853','#c09660'];
  c.fillStyle='#9a7040';c.fillRect(0,0,W,H);
  for(var y=0;y<H;y+=PH){var off=r()*90,x=-off;while(x<W){var pw=70+r()*80,t=tones[Math.floor(r()*tones.length)];
      c.fillStyle=t;c.fillRect(x,y,pw,PH);c.fillStyle='rgba(255,235,190,.16)';c.fillRect(x,y,pw,2);c.fillStyle='rgba(60,32,12,.28)';c.fillRect(x,y+PH-2,pw,2);c.fillRect(x+pw-2,y,2,PH);
      c.strokeStyle='rgba(90,55,24,.22)';c.lineWidth=1;for(var g2=0;g2<3;g2++){var gy=y+4+r()*(PH-8);c.beginPath();c.moveTo(x+4,gy);c.bezierCurveTo(x+pw*.3,gy+r()*3-1.5,x+pw*.7,gy+r()*3-1.5,x+pw-4,gy+r()*2-1);c.stroke()}
      if(r()<.18){var kx=x+10+r()*(pw-20);c.fillStyle='rgba(90,52,22,.4)';c.beginPath();c.ellipse(kx,y+PH/2,3.2,2,0,0,6.3);c.fill();c.strokeStyle='rgba(90,52,22,.35)';c.beginPath();c.ellipse(kx,y+PH/2,5,3,0,0,6.3);c.stroke()}
      x+=pw}}
  /* süpürgelik gölgesi */
  var g=c.createLinearGradient(0,0,0,26);g.addColorStop(0,'rgba(30,14,6,.45)');g.addColorStop(1,'rgba(30,14,6,0)');c.fillStyle=g;c.fillRect(0,0,W,26);
  floorC={W:W,cv:cv};return cv}
/* ---------- eşyalar ---------- */
var A={};
A.rug=function(c,x,y,t){var w=82,h=30,cy=y-18;c.save();
  c.fillStyle='rgba(20,8,24,.25)';c.beginPath();c.ellipse(x,cy+4,w/2+2,h/2+1,0,0,6.3);c.fill();
  /* saçaklar */
  c.strokeStyle='#f1e3c4';c.lineWidth=1.4;for(var i=-w/2+4;i<=w/2-4;i+=4){c.beginPath();c.moveTo(x+i,cy-h/2);c.lineTo(x+i,cy-h/2-4);c.moveTo(x+i,cy+h/2);c.lineTo(x+i,cy+h/2+4);c.stroke()}
  rr(c,x-w/2,cy-h/2,w,h,8);fs(c,'#a8343c');
  rr(c,x-w/2+4,cy-h/2+3,w-8,h-6,6);c.fillStyle='#e9c46a';c.fill();rr(c,x-w/2+6,cy-h/2+5,w-12,h-10,5);c.fillStyle='#7d2a4a';c.fill();
  c.fillStyle='#e9c46a';c.beginPath();c.moveTo(x,cy-8);c.lineTo(x+16,cy);c.lineTo(x,cy+8);c.lineTo(x-16,cy);c.closePath();c.fill();
  c.fillStyle='#a8343c';c.beginPath();c.moveTo(x,cy-5);c.lineTo(x+10,cy);c.lineTo(x,cy+5);c.lineTo(x-10,cy);c.closePath();c.fill();
  c.fillStyle='#f4e8c8';[-26,26].forEach(function(o){c.beginPath();c.arc(x+o,cy,3,0,6.3);c.fill();c.fillStyle='#4a9a8a';c.beginPath();c.arc(x+o,cy,1.4,0,6.3);c.fill();c.fillStyle='#f4e8c8'});
  c.restore()};
A.plant=function(c,x,y,t){shadow(c,x,y-5,13,4,.28);var sw=Math.sin(t*1.6)*1.5;
  var leaves=[[-16,-30,-.9],[-8,-38,-.4],[0,-44,0],[8,-38,.4],[16,-30,.9],[-11,-22,-1.2],[11,-22,1.2]];
  leaves.forEach(function(l,i){c.save();c.translate(x,y-14);c.rotate(l[2]+sw*.02*(i%2?1:-1));c.fillStyle=i%2?'#3f9a4a':'#56b45c';c.beginPath();c.ellipse(0,-14,5.4,15,0,0,6.3);c.fill();c.strokeStyle=OL;c.lineWidth=1.2;c.stroke();c.strokeStyle='rgba(255,255,255,.35)';c.beginPath();c.moveTo(0,-2);c.lineTo(0,-26);c.stroke();c.restore()});
  c.beginPath();c.moveTo(x-11,y-17);c.lineTo(x+11,y-17);c.lineTo(x+8,y-3);c.lineTo(x-8,y-3);c.closePath();fs(c,grad(c,x-11,0,x+11,0,[[0,'#d6824f'],[.6,'#b9613a'],[1,'#8f4727']]));
  rr(c,x-13,y-21,26,6,2);fs(c,'#e0925c');c.fillStyle='#3a2416';c.fillRect(x-9,y-20,18,2)};
A.lamp=function(c,x,y,t){shadow(c,x,y-4,12,4,.28);
  c.fillStyle='#5b3b24';c.beginPath();c.ellipse(x,y-5,9,3.4,0,0,6.3);fs(c,'#6a4528');
  c.fillStyle='#8b6a3a';c.fillRect(x-1.8,y-48,3.6,44);c.strokeStyle=OL;c.lineWidth=1.1;c.strokeRect(x-1.8,y-48,3.6,44);
  var fl=.92+Math.sin(t*7+x)*.04;
  c.beginPath();c.moveTo(x-15,y-36);c.lineTo(x+15,y-36);c.lineTo(x+9,y-56);c.lineTo(x-9,y-56);c.closePath();fs(c,grad(c,x-15,0,x+15,0,[[0,'#ffe2a0'],[.5,'#fff3cc'],[1,'#f0c878']]));
  c.strokeStyle='rgba(180,120,40,.5)';c.lineWidth=1;for(var i=-8;i<=8;i+=6){c.beginPath();c.moveTo(x+i*.6,y-56);c.lineTo(x+i,y-36);c.stroke()}
  c.fillStyle='#ffd24a';c.beginPath();c.arc(x,y-37,3.4*fl,0,6.3);c.fill()};
A.fire=function(c,x,y,t){var w=76;shadow(c,x,y-3,w/2,5,.3);
  /* taş gövde */
  rr(c,x-w/2,y-60,w,60,3);fs(c,grad(c,0,y-60,0,y,[[0,'#9a95a8'],[1,'#706b80']]));
  var r=rng(3);for(var by=0;by<5;by++)for(var bx=0;bx<5;bx++){var ox=(by%2)*7-4,xx=x-w/2+bx*15+ox,yy=y-58+by*11;if(xx<x-w/2||xx+14>x+w/2)continue;c.fillStyle='rgba(255,255,255,'+(.05+r()*.12)+')';c.fillRect(xx+1,yy+1,12,9);c.strokeStyle='rgba(30,25,45,.35)';c.lineWidth=1;c.strokeRect(xx,yy,14,11)}
  /* korniş */
  rr(c,x-w/2-5,y-66,w+10,9,2);fs(c,grad(c,0,y-66,0,y-57,[[0,'#a87a4a'],[1,'#7a5230']]));
  /* ağız */
  c.beginPath();c.moveTo(x-22,y);c.lineTo(x-22,y-28);c.quadraticCurveTo(x,y-46,x+22,y-28);c.lineTo(x+22,y);c.closePath();c.fillStyle='#1c1424';c.fill();c.strokeStyle=OL;c.lineWidth=1.6;c.stroke();
  /* odunlar */
  c.fillStyle='#6a4426';c.save();c.translate(x,y-5);c.rotate(.12);c.fillRect(-17,-3,34,7);c.rotate(-.24);c.fillRect(-17,-3,34,7);c.restore();
  /* alev */
  [[0,30,1],[-8,22,.8],[8,24,.85]].forEach(function(f,i){var fh=f[1]+Math.sin(t*9+i*2)*4;c.fillStyle=i===0?'#ff8a2b':'#ffb02e';c.beginPath();c.moveTo(x+f[0]-10*f[2],y-6);c.quadraticCurveTo(x+f[0]-9*f[2]+Math.sin(t*8+i)*3,y-6-fh*.6,x+f[0]+Math.sin(t*10+i)*2,y-8-fh);c.quadraticCurveTo(x+f[0]+9*f[2],y-6-fh*.6,x+f[0]+10*f[2],y-6);c.closePath();c.fill()});
  c.fillStyle='#ffe58a';c.beginPath();c.moveTo(x-5,y-6);c.quadraticCurveTo(x+Math.sin(t*11)*2,y-26-Math.sin(t*9)*3,x+5,y-6);c.fill();
  /* kıvılcımlar */
  for(var s=0;s<4;s++){var p=((t*.7+s*.27)%1),sx=x+Math.sin(s*3+t)*14,sy=y-14-p*40;c.fillStyle='rgba(255,200,90,'+(1-p)+')';c.fillRect(sx,sy,1.8,1.8)}
  /* mantodaki şeyler */
  c.fillStyle='#f0e4c8';c.fillRect(x-24,y-76,5,10);c.fillStyle='#ffd24a';c.beginPath();c.arc(x-21.5,y-78,1.8,0,6.3);c.fill();
  c.fillStyle='#4a7ab0';c.beginPath();c.moveTo(x+16,y-66);c.lineTo(x+22,y-80);c.lineTo(x+28,y-66);c.fill();c.strokeStyle=OL;c.lineWidth=1.1;c.stroke();
  c._glow=(c._glow||[]);c._glow.push([x,y-14,92,'255,150,60',.34+Math.sin(t*9)*.05])};
A.piano=function(c,x,y,t){var w=76;shadow(c,x+2,y-3,w/2+4,5,.3);
  /* tabure */
  rr(c,x-12,y-8,24,8,3);fs(c,'#7a1f2e');c.fillStyle='#4a3524';c.fillRect(x-10,y-1,3,3);c.fillRect(x+7,y-1,3,3);
  /* gövde */
  rr(c,x-w/2,y-62,w,48,4);fs(c,grad(c,0,y-62,0,y-14,[[0,'#4a3040'],[.5,'#34202e'],[1,'#241520']]));
  c.fillStyle='rgba(255,255,255,.12)';c.fillRect(x-w/2+3,y-60,w-6,3);
  rr(c,x-w/2+6,y-58,w-12,16,2);c.fillStyle='#1c1018';c.fill();c.fillStyle='#fff7e0';c.fillRect(x-w/2+10,y-56,w-20,12);c.fillStyle='#7a6a60';for(var l=0;l<3;l++)c.fillRect(x-w/2+13,y-53+l*3.5,w-26,1);
  c.fillStyle='#e9c46a';c.beginPath();c.arc(x-w/2+14,y-50,1.6,0,6.3);c.fill();
  /* tuşlar */
  rr(c,x-w/2+2,y-34,w-4,17,2);fs(c,'#f7f1e1',OL,1.4);
  for(var k=0;k<11;k++){c.strokeStyle='rgba(90,70,60,.5)';c.lineWidth=.8;c.beginPath();c.moveTo(x-w/2+5+k*6.2,y-34);c.lineTo(x-w/2+5+k*6.2,y-17);c.stroke()}
  c.fillStyle='#1c1018';[0,1,3,4,5,7,8].forEach(function(k){c.fillRect(x-w/2+8+k*6.2,y-34,4,10)});
  /* basılan tuş */
  var pk=Math.floor((t*2)%11);if(c._pn>0){c.fillStyle='rgba(255,215,90,.6)';c.fillRect(x-w/2+5+pk*6.2,y-34,6,16)}
  c.fillStyle='#e9c46a';c.fillRect(x-4,y-15,8,3)};
A.aqua=function(c,x,y,t){shadow(c,x,y-3,17,4,.3);
  rr(c,x-17,y-20,34,20,3);fs(c,grad(c,x-17,0,x+17,0,[[0,'#8a5a30'],[.5,'#a8703a'],[1,'#7a4c28']]));c.fillStyle='#e9c46a';c.fillRect(x-3,y-12,6,2.5);
  rr(c,x-17,y-52,34,30,3);fs(c,grad(c,0,y-52,0,y-22,[[0,'#bfeaff'],[1,'#4aa0d8']]),OL,1.6);
  c.fillStyle='#f2dfa8';c.fillRect(x-16,y-27,32,5);
  /* bitki */
  c.strokeStyle='#3f9a4a';c.lineWidth=2;[-9,-4,10].forEach(function(o,i){c.beginPath();c.moveTo(x+o,y-27);c.quadraticCurveTo(x+o+Math.sin(t*2+i)*3,y-36,x+o+Math.sin(t*2+i+1)*2,y-42);c.stroke()});
  /* balıklar */
  [[0,'#ff8a2b',.9,-36],[1,'#ffd23f',1.3,-32]].forEach(function(f){var fx=x+Math.sin(t*f[2]+f[0]*3)*10,fy=y+f[3]+Math.sin(t*1.7+f[0])*2,d=Math.cos(t*f[2]+f[0]*3)>0?1:-1;c.save();c.translate(fx,fy);c.scale(d,1);c.fillStyle=f[1];c.beginPath();c.ellipse(0,0,5,3,0,0,6.3);c.fill();c.beginPath();c.moveTo(-4,0);c.lineTo(-9,-3+Math.sin(t*12)*1.5);c.lineTo(-9,3+Math.sin(t*12)*1.5);c.fill();c.fillStyle='#2b1a2e';c.fillRect(2,-1.2,1.4,1.4);c.restore()});
  for(var b=0;b<3;b++){var p=((t*.5+b*.34)%1);c.strokeStyle='rgba(255,255,255,'+(.8-p*.7)+')';c.lineWidth=.9;c.beginPath();c.arc(x-12+b*3+Math.sin(p*6+b)*1.5,y-28-p*20,1.2+b*.3,0,6.3);c.stroke()}
  c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x-14,y-50,3,24);
  rr(c,x-17,y-55,34,5,2);fs(c,'#3a3550');c.fillStyle='#fff3b0';c.fillRect(x-12,y-54,24,2)};
A.cat=function(c,x,y,t){shadow(c,x,y-4,17,5,.28);
  /* minder */
  c.fillStyle='#a8343c';c.beginPath();c.ellipse(x,y-7,18,8,0,0,6.3);fs(c,'#b83e46');c.fillStyle='#d4565e';c.beginPath();c.ellipse(x,y-9,13,5,0,0,6.3);c.fill();
  var br=Math.sin(t*2)*.8,tail=Math.sin(t*3)*5;
  c.beginPath();c.ellipse(x,y-17-br*.5,12,10+br*.4,0,0,6.3);fs(c,'#e8923f');
  c.strokeStyle='#b8651f';c.lineWidth=1.8;[-6,0,6].forEach(function(o){c.beginPath();c.moveTo(x+o,y-26);c.lineTo(x+o+(o?o/4:0),y-19);c.stroke()});
  /* kuyruk */
  c.strokeStyle=OL;c.lineWidth=5.4;c.lineCap='round';c.beginPath();c.moveTo(x+10,y-11);c.quadraticCurveTo(x+22,y-9,x+20+tail,y-19);c.stroke();c.strokeStyle='#e8923f';c.lineWidth=3.4;c.stroke();c.lineCap='butt';
  /* baş */
  c.beginPath();c.arc(x-5,y-27,8.4,0,6.3);fs(c,'#f0a050');
  c.beginPath();c.moveTo(x-12,y-30);c.lineTo(x-11,y-39);c.lineTo(x-5.5,y-33);c.closePath();fs(c,'#f0a050');c.beginPath();c.moveTo(x+2,y-30);c.lineTo(x+1,y-39);c.lineTo(x-4.5,y-33);c.closePath();fs(c,'#f0a050');
  c.fillStyle='#f6b8b8';c.beginPath();c.moveTo(x-10.5,y-31);c.lineTo(x-10.5,y-36);c.lineTo(x-7,y-32.5);c.fill();
  c.strokeStyle=OL;c.lineWidth=1.5;c.beginPath();c.arc(x-9,y-27,2,.15,3);c.stroke();c.beginPath();c.arc(x-1,y-27,2,.15,3);c.stroke();
  c.fillStyle='#e0507a';c.beginPath();c.moveTo(x-6.4,y-24.6);c.lineTo(x-3.6,y-24.6);c.lineTo(x-5,y-23);c.fill();
  c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.8;[[-10,-1],[-10,2]].forEach(function(w){c.beginPath();c.moveTo(x-8+w[0]*.1,y-24);c.lineTo(x-14,y-24+w[1]*2);c.stroke()});
  var z=((t*.4)%1);c.fillStyle='rgba(190,225,255,'+(1-z)+')';c.font='800 9px sans-serif';c.textAlign='left';c.fillText('z',x+4+z*6,y-34-z*12)};
A.tree=function(c,x,y,t){shadow(c,x,y-3,20,5,.3);
  rr(c,x-8,y-11,16,11,2);fs(c,'#b9613a');c.fillStyle='#e0925c';c.fillRect(x-9,y-12,18,3);
  c.fillStyle='#5a3a22';c.fillRect(x-2.5,y-16,5,6);
  var cols=['#2a7a3f','#348f4a','#40a557'];for(var q=0;q<3;q++){var w=22-q*5,yy=y-16-q*16;c.beginPath();c.moveTo(x-w,yy);c.lineTo(x,yy-24);c.lineTo(x+w,yy);c.closePath();fs(c,cols[q]);c.fillStyle='rgba(255,255,255,.14)';c.beginPath();c.moveTo(x-w,yy);c.lineTo(x,yy-24);c.lineTo(x-4,yy);c.fill()}
  /* kar ve ışıklar */
  var lc=['#ff4d6d','#ffd23f','#4dd0ff','#7dff9b'];for(var i=0;i<9;i++){var a=i/9,lx=x+Math.sin(a*6.5)*(16-a*9),ly=y-18-a*44;var on=Math.sin(t*3+i*1.7)>-.2;c.fillStyle=on?lc[i%4]:'rgba(60,60,60,.5)';c.beginPath();c.arc(lx,ly,2.3,0,6.3);c.fill();if(on)c._glow=(c._glow||[]),c._glow.push([lx,ly,16,i%2?'255,210,90':'255,90,120',.35])}
  var sp=1+Math.sin(t*4)*.12;c.fillStyle='#ffd23f';c.beginPath();for(var k=0;k<10;k++){var rad=k%2?3.4:7.4*sp,an=k*Math.PI/5-Math.PI/2;c.lineTo(x+Math.cos(an)*rad,y-66+Math.sin(an)*rad)}c.closePath();fs(c,'#ffd23f',OL,1.1);
  /* hediyeler */
  rr(c,x+10,y-9,11,9,1.5);fs(c,'#4a8ad8');c.fillStyle='#ffd23f';c.fillRect(x+14.5,y-9,2,9);rr(c,x-21,y-8,10,8,1.5);fs(c,'#d84a6a');c.fillStyle='#fff3c0';c.fillRect(x-17,y-8,2,8)};
A.cup=function(c,x,y,t){shadow(c,x,y-3,15,4,.28);
  rr(c,x-14,y-14,28,14,2);fs(c,grad(c,x-14,0,x+14,0,[[0,'#d9d4e2'],[.5,'#f3f0f8'],[1,'#b0aac0']]));rr(c,x-11,y-8,22,4,1);c.fillStyle='#e9c46a';c.fill();
  c.strokeStyle='#e9c46a';c.lineWidth=3;c.beginPath();c.arc(x-12,y-30,6,1.2,4.8);c.stroke();c.beginPath();c.arc(x+12,y-30,6,-1.7,1.9);c.stroke();
  c.beginPath();c.moveTo(x-12,y-44);c.lineTo(x+12,y-44);c.quadraticCurveTo(x+13,y-26,x+5,y-22);c.lineTo(x+4,y-16);c.lineTo(x+8,y-14);c.lineTo(x-8,y-14);c.lineTo(x-4,y-16);c.lineTo(x-5,y-22);c.quadraticCurveTo(x-13,y-26,x-12,y-44);c.closePath();fs(c,grad(c,x-12,0,x+12,0,[[0,'#d9a92a'],[.35,'#ffe58a'],[1,'#c08a18']]));
  c.fillStyle='rgba(255,255,255,.55)';c.fillRect(x-8,y-42,2.4,16);
  var s=((t*.6)%1);c.fillStyle='rgba(255,255,255,'+(.9-s*.9)+')';c.beginPath();var sx=x+6,sy=y-38;c.moveTo(sx,sy-5*s-1);c.lineTo(sx+1.2,sy-1.2);c.lineTo(sx+5*s+1,sy);c.lineTo(sx+1.2,sy+1.2);c.lineTo(sx,sy+5*s+1);c.lineTo(sx-1.2,sy+1.2);c.lineTo(sx-5*s-1,sy);c.lineTo(sx-1.2,sy-1.2);c.fill()};
A.chest=function(c,x,y,t){shadow(c,x,y-3,19,5,.3);
  rr(c,x-18,y-20,36,20,2);fs(c,grad(c,0,y-20,0,y,[[0,'#a8703a'],[1,'#7a4c28']]));
  c.strokeStyle='rgba(60,30,12,.45)';c.lineWidth=1;for(var i=0;i<3;i++){c.beginPath();c.moveTo(x-17,y-15+i*5);c.lineTo(x+17,y-15+i*5);c.stroke()}
  c.beginPath();c.moveTo(x-18,y-20);c.quadraticCurveTo(x,y-38,x+18,y-20);c.closePath();fs(c,grad(c,0,y-34,0,y-20,[[0,'#c18246'],[1,'#a06a36']]));
  c.fillStyle='#6a6578';c.fillRect(x-18,y-22,5,22);c.fillRect(x+13,y-22,5,22);c.strokeStyle=OL;c.lineWidth=1.2;c.strokeRect(x-18,y-22,5,22);c.strokeRect(x+13,y-22,5,22);
  rr(c,x-4,y-21,8,9,2);fs(c,'#ffd24a');c.fillStyle='#2b1a2e';c.fillRect(x-1,y-18,2,4);
  var s=((t*.5)%1);c.fillStyle='rgba(255,240,170,'+(.8*Math.max(0,1-Math.abs(s-.5)*5))+')';c.fillRect(x+6+s*4,y-30,1.6,1.6)};
A.globe=function(c,x,y,t){shadow(c,x,y-3,11,3.6,.28);
  rr(c,x-9,y-6,18,6,2);fs(c,'#7a5230');c.fillStyle='#8b6a3a';c.fillRect(x-1.6,y-16,3.2,10);
  c.strokeStyle='#d9a92a';c.lineWidth=2;c.beginPath();c.arc(x,y-27,16.5,2.3,5.2);c.stroke();
  c.save();c.beginPath();c.arc(x,y-27,13,0,6.3);c.clip();c.fillStyle='#3f86d6';c.fillRect(x-14,y-41,28,28);var o=(t*10)%40;c.fillStyle='#58b86a';for(var k=-1;k<2;k++){var gx=x-o+k*40;c.beginPath();c.ellipse(gx,y-31,7,4,.4,0,6.3);c.ellipse(gx+14,y-24,5,6,0,0,6.3);c.ellipse(gx+24,y-32,4,3,0,0,6.3);c.fill()}
  c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(x-5,y-33,4,7,.5,0,6.3);c.fill();var g=c.createRadialGradient(x+5,y-22,2,x,y-27,15);g.addColorStop(0,'rgba(0,0,40,0)');g.addColorStop(1,'rgba(0,0,40,.4)');c.fillStyle=g;c.fillRect(x-14,y-41,28,28);c.restore();
  c.beginPath();c.arc(x,y-27,13,0,6.3);c.strokeStyle=OL;c.lineWidth=1.4;c.stroke();c.strokeStyle='#d9a92a';c.lineWidth=2;c.beginPath();c.arc(x,y-27,16.5,5.3,8.5);c.stroke()};
A.desk=function(c,x,y,t){var w=76;shadow(c,x,y-3,w/2,5,.3);
  c.fillStyle='#6a4426';c.fillRect(x-w/2+3,y-22,5,22);c.fillRect(x+w/2-8,y-22,5,22);
  rr(c,x-w/2,y-30,w,10,2);fs(c,grad(c,0,y-30,0,y-20,[[0,'#c18246'],[1,'#a06a36']]));
  rr(c,x+4,y-20,30,16,2);fs(c,'#8a5a30');c.fillStyle='#e9c46a';[[x+14,y-12],[x+24,y-12]].forEach(function(q){c.beginPath();c.arc(q[0],q[1],1.5,0,6.3);c.fill()});
  /* üstündekiler */
  c.fillStyle='#fffaf0';c.save();c.translate(x-18,y-32);c.rotate(-.1);c.fillRect(-9,-3,18,5);c.strokeStyle=OL;c.lineWidth=1;c.strokeRect(-9,-3,18,5);c.restore();
  rr(c,x-4,y-40,11,9,1);fs(c,'#3a5a9a');c.fillStyle='#f4e8c8';c.fillRect(x-3,y-39,9,2);
  rr(c,x+16,y-38,7,8,2);fs(c,'#2a2a4a');c.strokeStyle='#f4efe0';c.lineWidth=1.6;c.beginPath();c.moveTo(x+19,y-38);c.quadraticCurveTo(x+22,y-50,x+28,y-54);c.stroke();
  c.fillStyle='#fff3b0';c.beginPath();c.moveTo(x+30,y-31);c.lineTo(x+30,y-40);c.stroke();rr(c,x+27,y-38,6,8,1);fs(c,'#f4efe0');c.fillStyle='#ffb02e';c.beginPath();c.ellipse(x+30,y-41+Math.sin(t*8)*.4,1.6,2.6,0,0,6.3);c.fill();c._glow=(c._glow||[]);c._glow.push([x+30,y-42,26,'255,190,90',.22])};
/* duvar eşyaları: x merkez, y = alt */
A.paint=function(c,x,y,t){var w=30,h=26,top=y-h-4;c.fillStyle='rgba(0,0,0,.2)';c.fillRect(x-w/2+2,top+3,w,h);
  rr(c,x-w/2,top,w,h,2);fs(c,grad(c,x-w/2,top,x+w/2,top+h,[[0,'#e9c46a'],[1,'#a8802a']]));
  c.save();rr(c,x-w/2+3,top+3,w-6,h-6,1);c.clip();c.fillStyle=grad(c,0,top,0,top+h,[[0,'#8fd0ff'],[1,'#d8efff']]);c.fillRect(x-w/2,top,w,h);
  c.fillStyle='#ffe58a';c.beginPath();c.arc(x+7,top+9,3.2,0,6.3);c.fill();c.fillStyle='#7a8ea8';c.beginPath();c.moveTo(x-w/2,top+17);c.lineTo(x-6,top+8);c.lineTo(x+1,top+15);c.lineTo(x+8,top+10);c.lineTo(x+w/2,top+18);c.lineTo(x+w/2,top+h);c.lineTo(x-w/2,top+h);c.fill();
  c.fillStyle='#4fb35a';c.fillRect(x-w/2,top+19,w,8);c.fillStyle='#3a9fd0';c.beginPath();c.ellipse(x+2,top+22,8,2.4,0,0,6.3);c.fill();c.restore();
  c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.moveTo(x-w/2+3,top+3);c.lineTo(x-w/2+12,top+3);c.lineTo(x-w/2+3,top+14);c.fill()};
A.shelf=function(c,x,y,t){var w=72,top=y-36;
  c.fillStyle='rgba(0,0,0,.2)';c.fillRect(x-w/2+2,y-12,w,5);
  var cs=['#c0392b','#2a6fb8','#e9b82a','#3f9a4a','#8a4ab8','#d8702a','#2a9a9a'],r=rng(11),bx=x-w/2+4;
  for(var i=0;i<9;i++){var bw=4+Math.floor(r()*3),bh=14+Math.floor(r()*8);c.fillStyle=cs[i%7];c.fillRect(bx,y-12-bh,bw,bh);c.strokeStyle=OL;c.lineWidth=.9;c.strokeRect(bx,y-12-bh,bw,bh);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(bx+1,y-12-bh+2,1,bh-4);if(i%3===1){c.fillStyle='#ffe58a';c.fillRect(bx,y-12-bh+4,bw,1.4)}bx+=bw+1;if(bx>x+w/2-26&&i<6){i=9}}
  /* vazo + bitki */
  rr(c,x+w/2-22,y-24,8,12,2);fs(c,'#4a8ad8');c.strokeStyle='#3f9a4a';c.lineWidth=1.6;c.beginPath();c.moveTo(x+w/2-18,y-24);c.lineTo(x+w/2-22,y-32);c.moveTo(x+w/2-18,y-24);c.lineTo(x+w/2-15,y-33);c.stroke();c.fillStyle='#ff6f91';c.beginPath();c.arc(x+w/2-15,y-34,2.2,0,6.3);c.fill();
  c.fillStyle='#8f6a40';c.beginPath();c.arc(x+w/2-8,y-17,4.5,0,6.3);c.fill();c.strokeStyle=OL;c.lineWidth=1;c.stroke();
  rr(c,x-w/2,y-12,w,5,1.5);fs(c,grad(c,0,y-12,0,y-7,[[0,'#b88650'],[1,'#7a5230']]));
  c.fillStyle='#6a4426';c.fillRect(x-w/2+6,y-7,4,6);c.fillRect(x+w/2-10,y-7,4,6)};
A.clock=function(c,x,y,t){var cy=y-22,sw=Math.sin(t*3.14)*.5;
  /* sarkaç */
  c.strokeStyle='#8a6a3a';c.lineWidth=1.4;c.beginPath();c.moveTo(x,cy+12);c.lineTo(x+Math.sin(sw)*6,cy+26);c.stroke();c.fillStyle='#e9c46a';c.beginPath();c.arc(x+Math.sin(sw)*6,cy+27,3,0,6.3);c.fill();c.strokeStyle=OL;c.lineWidth=1;c.stroke();
  c.beginPath();c.arc(x,cy,14,0,6.3);fs(c,grad(c,x-14,cy-14,x+14,cy+14,[[0,'#b88650'],[1,'#7a5230']]));c.beginPath();c.arc(x,cy,11,0,6.3);fs(c,'#fff7e0',OL,1);
  c.fillStyle='#4a3524';for(var i=0;i<12;i++){var a=i/12*6.283;c.fillRect(x+Math.sin(a)*8.6-.7,cy-Math.cos(a)*8.6-.7,i%3?1.4:2.2,i%3?1.4:2.2)}
  var d=new Date(),m=d.getMinutes()+d.getSeconds()/60,h=d.getHours()%12+m/60;c.strokeStyle='#2b1a2e';c.lineCap='round';c.lineWidth=1.8;c.beginPath();c.moveTo(x,cy);c.lineTo(x+Math.sin(h/12*6.283)*5.5,cy-Math.cos(h/12*6.283)*5.5);c.stroke();c.lineWidth=1.2;c.beginPath();c.moveTo(x,cy);c.lineTo(x+Math.sin(m/60*6.283)*8,cy-Math.cos(m/60*6.283)*8);c.stroke();c.strokeStyle='#c0392b';c.lineWidth=.8;c.beginPath();c.moveTo(x,cy);c.lineTo(x+Math.sin(d.getSeconds()/60*6.283)*8.5,cy-Math.cos(d.getSeconds()/60*6.283)*8.5);c.stroke();c.lineCap='butt'};
A.flag=function(c,x,y,t){var top=y-38,sw=Math.sin(t*1.8)*1.6;
  c.fillStyle='#8a6a3a';c.fillRect(x-14,top,28,3.5);c.strokeStyle=OL;c.lineWidth=1;c.strokeRect(x-14,top,28,3.5);c.fillStyle='#e9c46a';c.beginPath();c.arc(x-14,top+1.7,2.4,0,6.3);c.arc(x+14,top+1.7,2.4,0,6.3);c.fill();
  c.beginPath();c.moveTo(x-11,top+3.5);c.lineTo(x+11,top+3.5);c.lineTo(x+11+sw,y-8);c.lineTo(x+sw*1.2,y-2);c.lineTo(x-11+sw,y-8);c.closePath();fs(c,grad(c,x-11,0,x+11,0,[[0,'#a8242c'],[.5,'#d8404a'],[1,'#9a1f2a']]));
  c.fillStyle='#ffd24a';c.beginPath();for(var k=0;k<10;k++){var rad=k%2?3:6.4,an=k*Math.PI/5-Math.PI/2;c.lineTo(x+sw*.4+Math.cos(an)*rad,top+17+Math.sin(an)*rad)}c.closePath();c.fill();
  c.fillStyle='#ffd24a';c.fillRect(x+sw*1.2-1,y-2,2,4)};
A.sword=function(c,x,y,t){var cy=y-22;
  c.beginPath();c.moveTo(x,cy-16);c.lineTo(x+13,cy-10);c.lineTo(x+13,cy+4);c.quadraticCurveTo(x+13,cy+14,x,cy+18);c.quadraticCurveTo(x-13,cy+14,x-13,cy+4);c.lineTo(x-13,cy-10);c.closePath();fs(c,grad(c,x-13,0,x+13,0,[[0,'#3a5a9a'],[1,'#2a4378']]));
  c.save();c.translate(x,cy);[-1,1].forEach(function(s){c.save();c.rotate(s*.78);c.fillStyle=grad(c,-2,0,2,0,[[0,'#aab4c8'],[.5,'#f4f7ff'],[1,'#9aa6bc']]);c.beginPath();c.moveTo(-2.4,-26);c.lineTo(0,-30);c.lineTo(2.4,-26);c.lineTo(2.4,10);c.lineTo(-2.4,10);c.closePath();c.fill();c.strokeStyle=OL;c.lineWidth=1;c.stroke();c.fillStyle='#e9c46a';c.fillRect(-7,10,14,3);c.strokeRect(-7,10,14,3);c.fillStyle='#7a4426';c.fillRect(-1.8,13,3.6,7);c.restore()});c.restore();
  c.fillStyle='#e9c46a';c.beginPath();c.arc(x,cy,3,0,6.3);fs(c,'#e9c46a',OL,1)};
/* ---------- yatak ---------- */
var BS=[ /* örtü, desen rengi, çerçeve */
 {q:'#c0584a',q2:'#e3827a',tr:'#fff3d6',fr:'#7a5230'},{q:'#5d3fc0',q2:'#8d72ec',tr:'#ffd24a',fr:'#4a2f6a'},{q:'#2a6fc0',q2:'#5a9aec',tr:'#fff3a0',fr:'#26407a'}];
function bedBase(c,x,y,w,h,st,t){var B=BS[st]||BS[0];
  shadow(c,x+w/2+4,y+h+2,w/2+10,8,.3);
  rr(c,x-8,y-8,w+16,h+16,6);fs(c,grad(c,0,y-8,0,y+h+8,[[0,sh(B.fr,.15)],[1,sh(B.fr,-.2)]]));
  /* yastık başlığı */
  rr(c,x-8,y-12,16,h+24,4);fs(c,sh(B.fr,.05));c.fillStyle=sh(B.fr,.3);c.fillRect(x-5,y-8,3,h+16);
  if(st===1){c.fillStyle='#ffd24a';[y-12,y+h+10].forEach(function(py){c.beginPath();c.arc(x,py,4,0,6.3);fs(c,'#ffd24a',OL,1)})}
  rr(c,x,y,w,h,5);fs(c,'#f4efe6',OL,1.4);
  /* çarşaf kıvrımı */
  c.strokeStyle='rgba(120,100,80,.25)';c.lineWidth=1;for(var i=1;i<4;i++){c.beginPath();c.moveTo(x+4,y+i*h/4);c.quadraticCurveTo(x+w/2,y+i*h/4+2,x+w-4,y+i*h/4);c.stroke()}
  /* yastıklar */
  [h*.3,h*.72].forEach(function(py,i){c.save();c.translate(x+28,y+py);c.rotate(i?.06:-.05);rr(c,-20,-12,40,24,10);fs(c,grad(c,-20,-12,20,12,[[0,'#ffffff'],[1,'#dcd6e8']]),OL,1.4);c.strokeStyle='rgba(120,100,150,.35)';c.lineWidth=1;c.beginPath();c.moveTo(-14,-3);c.quadraticCurveTo(0,0,14,-3);c.moveTo(-14,4);c.quadraticCurveTo(0,7,14,4);c.stroke();c.restore()})}
function bedQuilt(c,x,y,w,h,st,t,part){var B=BS[st]||BS[0],qx=x+66,qw=w-70;
  rr(c,qx,y+2,qw,h-4,7);c.fillStyle=B.q;c.fill();
  c.save();rr(c,qx,y+2,qw,h-4,7);c.clip();
  if(st===0){for(var i=0;i<6;i++)for(var j=0;j<3;j++){if((i+j)%2){c.fillStyle=B.q2;c.fillRect(qx+i*16,y+2+j*(h/3),16,h/3)}}c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=1;c.setLineDash([3,3]);c.strokeRect(qx+4,y+6,qw-8,h-12);c.setLineDash([])}
  else if(st===1){c.fillStyle=B.q2;for(var k=0;k<5;k++){c.beginPath();c.moveTo(qx+10+k*18,y+h/2-9);c.lineTo(qx+19+k*18,y+h/2);c.lineTo(qx+10+k*18,y+h/2+9);c.lineTo(qx+1+k*18,y+h/2);c.fill()}c.fillStyle='#ffd24a';c.fillRect(qx,y+2,3,h-4);c.fillRect(qx,y+2,qw,2.4);c.fillRect(qx,y+h-4.4,qw,2.4)}
  else{c.fillStyle=B.q2;for(var s=0;s<10;s++){var sx=qx+8+(s*29)%(qw-14),sy=y+8+(s*17)%(h-18),tw=.6+.4*Math.sin(t*3+s);c.globalAlpha=tw;c.beginPath();c.moveTo(sx,sy-3.4);c.lineTo(sx+1,sy-1);c.lineTo(sx+3.4,sy);c.lineTo(sx+1,sy+1);c.lineTo(sx,sy+3.4);c.lineTo(sx-1,sy+1);c.lineTo(sx-3.4,sy);c.lineTo(sx-1,sy-1);c.fillStyle='#fff7b0';c.fill()}c.globalAlpha=1}
  c.restore();
  rr(c,qx,y+2,qw,h-4,7);c.strokeStyle=OL;c.lineWidth=1.5;c.stroke();
  /* örtü kıvrımı ve kenar */
  c.fillStyle='rgba(255,255,255,.22)';c.beginPath();c.moveTo(qx+2,y+4);c.quadraticCurveTo(qx+qw/2,y+10,qx+qw-2,y+4);c.lineTo(qx+qw-2,y+2);c.lineTo(qx+2,y+2);c.fill();
  c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=1.2;for(var f=1;f<4;f++){c.beginPath();c.moveTo(qx+f*qw/4,y+4);c.quadraticCurveTo(qx+f*qw/4+3,y+h/2,qx+f*qw/4,y+h-4);c.stroke()}}
/* ---------- pencere ve ışık ---------- */
function windowDraw(c,x,y,night,t,winter){var w=84,h=58;
  c.fillStyle='#fff';rr(c,x-3,y-3,w+6,h+6,3);fs(c,'#f4ead6',OL,1.5);
  var sky=night?grad(c,0,y,0,y+h,[[0,'#0e1638'],[1,'#2b3a78']]):grad(c,0,y,0,y+h,[[0,'#7cc4f4'],[1,'#d8f0ff']]);c.fillStyle=sky;c.fillRect(x,y,w,h);
  if(night){c.fillStyle='#fff';for(var s=0;s<9;s++){c.globalAlpha=.4+.6*Math.abs(Math.sin(t*1.3+s));c.fillRect(x+4+(s*29)%76,y+4+(s*17)%38,1.6,1.6)}c.globalAlpha=1;c.fillStyle='#fff7c8';c.beginPath();c.arc(x+60,y+17,8,0,6.3);c.fill();c.fillStyle=sky;c.beginPath();c.arc(x+64,y+15,7,0,6.3);c.fill();glow(c,x+58,y+17,24,'200,220,255',.28)}
  else{c.fillStyle='#ffe58a';c.beginPath();c.arc(x+62,y+16,8,0,6.3);c.fill();glow(c,x+62,y+16,30,'255,230,150',.4);c.fillStyle='rgba(255,255,255,.9)';var cx=(t*3)%110-20;c.beginPath();c.ellipse(x+cx,y+24,13,5,0,0,6.3);c.ellipse(x+cx+9,y+21,8,5,0,0,6.3);c.fill()}
  /* tepeler */
  c.fillStyle=night?'#1a2a50':'#5aa05f';c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+44);c.quadraticCurveTo(x+22,y+34,x+44,y+46);c.quadraticCurveTo(x+66,y+38,x+w,y+44);c.lineTo(x+w,y+h);c.fill();
  if(winter){c.fillStyle='rgba(255,255,255,.95)';for(var q=0;q<14;q++){var fx=x+((q*37+t*14*(1+q%3*.3))%w),fy=y+((q*23+t*26*(1+q%2*.4))%h);c.beginPath();c.arc(fx,fy,1.1+(q%3)*.4,0,6.3);c.fill()}c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+47);c.quadraticCurveTo(x+22,y+38,x+44,y+49);c.quadraticCurveTo(x+66,y+41,x+w,y+47);c.lineTo(x+w,y+h);c.fill()}
  /* çerçeve + kayıtlar */
  c.fillStyle='#f4ead6';c.fillRect(x+w/2-2,y,4,h);c.fillRect(x,y+h/2-2,w,4);c.strokeStyle=OL;c.lineWidth=1.2;c.strokeRect(x+w/2-2,y,4,h);c.strokeRect(x,y+h/2-2,w,4);
  rr(c,x-6,y+h+1,w+12,5,2);fs(c,'#f4ead6');
  /* perdeler */
  var sw=Math.sin(t*.9)*1.4;
  [[x-4,-1],[x+w+4,1]].forEach(function(p){c.beginPath();c.moveTo(p[0],y-6);c.lineTo(p[0]+p[1]*22,y-6);c.quadraticCurveTo(p[0]+p[1]*(20+sw),y+h*.55,p[0]+p[1]*12,y+h-2);c.quadraticCurveTo(p[0]+p[1]*2,y+h*.7,p[0],y+h+2);c.closePath();fs(c,grad(c,p[0],0,p[0]+p[1]*22,0,[[0,sh('#b83a4a',-.05)],[.5,'#d85a68'],[1,sh('#b83a4a',-.12)]]));c.strokeStyle='rgba(60,10,20,.35)';c.lineWidth=1;for(var k=1;k<3;k++){c.beginPath();c.moveTo(p[0]+p[1]*k*7,y-4);c.quadraticCurveTo(p[0]+p[1]*(k*7+sw),y+h*.5,p[0]+p[1]*(k*4+2),y+h);c.stroke()}
    c.fillStyle='#e9c46a';c.beginPath();c.arc(p[0]+p[1]*10,y+h*.52,2.6,0,6.3);c.fill()});
  rr(c,x-14,y-10,w+28,5,2.5);fs(c,'#8a6a3a');[x-12,x+w+12].forEach(function(px){c.beginPath();c.arc(px,y-7.5,3.4,0,6.3);fs(c,'#e9c46a',OL,1)})}
function sunPatch(c,x,y,night,t){c.save();var a=night?.12:.2;var g=grad(c,x,y,x+60,y+120,[[0,night?'rgba(150,180,255,'+a+')':'rgba(255,236,170,'+a+')'],[1,'rgba(255,255,255,0)']]);c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.lineTo(x+84,y);c.lineTo(x+150,y+150);c.lineTo(x+58,y+150);c.closePath();c.fill();
  c.fillStyle=night?'rgba(200,220,255,.5)':'rgba(255,250,210,.7)';for(var i=0;i<7;i++){var p=((t*.05+i*.17)%1);var dx=x+10+(i*29)%70+p*40,dy=y+p*140;c.globalAlpha=Math.sin(p*3.14)*.7;c.fillRect(dx,dy,1.5,1.5)}c.globalAlpha=1;c.restore()}
/* ---------- genel ---------- */
function item(c,k,x,yb,t){c._glow=c._glow||[];var f=A[k];if(f)f(c,x,yb,t)}
function flushGlow(c){var g=c._glow;if(!g||!g.length)return;g.forEach(function(q){glow(c,q[0],q[1],q[2],q[3],q[4])});c._glow=[]}
function vignette(c,W,H){var g=c.createRadialGradient(W/2,H*.55,H*.35,W/2,H*.55,H*.95);g.addColorStop(0,'rgba(20,8,30,0)');g.addColorStop(1,'rgba(20,8,30,.42)');c.fillStyle=g;c.fillRect(0,0,W,H)}
function door(c,x,y,w,t,winter){/* alt kapı */
  c.fillStyle='rgba(15,8,24,.85)';c.fillRect(x,y-2,w,10);c.fillStyle=grad(c,0,y-30,0,y,[[0,'rgba(255,240,200,0)'],[1,'rgba(255,240,200,.25)']]);c.fillRect(x,y-30,w,30);
  rr(c,x+6,y-24,w-12,14,4);fs(c,'#8a5a30',OL,1.4);c.strokeStyle='#e9c46a';c.lineWidth=1;for(var i=0;i<5;i++){c.beginPath();c.moveTo(x+14+i*22,y-22);c.lineTo(x+14+i*22,y-12);c.stroke()}
  c.fillStyle='#f4ead6';c.font='800 7.5px "Chakra Petch",sans-serif';c.textAlign='center';c.fillText('HOŞ GELDİN',x+w/2,y-14.5);
  if(winter){c.fillStyle='#2a7a3f';c.beginPath();c.arc(x+w/2,y-38,0,0,6.3);c.fill()}}
window.YRA2={wall:wallImg,floor:floorImg,item:item,flush:flushGlow,glow:glow,bedBase:bedBase,bedQuilt:bedQuilt,win:windowDraw,sun:sunPatch,vig:vignette,door:door,shadow:shadow,WP:WP,BS:BS,sh:sh};
})();
