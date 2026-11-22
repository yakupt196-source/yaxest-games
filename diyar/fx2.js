/* Yaxest Diyarı: ışık, gölge, vuruş efektleri, ekran sarsıntısı, rüzgârda sallanan çimen (YF) */
(function(){
'use strict';
var P=[],shk=0,shT=0,flash=0,flashC='255,60,80',hasT=0;
function rnd(a,b){return a+Math.random()*(b-a)}
/* vuruş kıvılcımları: x,y dünya koordinatı, c renk, n adet, big=kritik */
function hit(x,y,c,n,big){n=Math.min(n||8,big?22:12);if(P.length>260)return;
  for(var i=0;i<n;i++){var a=rnd(0,6.283),s=rnd(60,big?300:210);P.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-30,l:rnd(.22,.5),t:0,c:c||'#fff',r:rnd(1.6,big?4:3),k:Math.random()<.35?1:0})}
  if(big)P.push({x:x,y:y,vx:0,vy:0,l:.22,t:0,c:c||'#ffd23f',r:34,k:2});else P.push({x:x,y:y,vx:0,vy:0,l:.14,t:0,c:'#fff',r:16,k:2})}
function burst(x,y,c,n){hit(x,y,c,n||18,true)}
function flashW(){flash=.75;flashC='200,230,255'}
function shake(a,d){if(window.YD_LOWFX)return;if(a>shk){shk=a;shT=d||.25}}
function hurtFx(){shake(5,.22);flash=.34;flashC='255,60,80'}
function update(dt){for(var i=P.length-1;i>=0;i--){var p=P[i];p.t+=dt;if(p.t>=p.l){P.splice(i,1);continue}if(p.k!==2){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.9;p.vy=p.vy*.9+260*dt}}
  if(shT>0){shT-=dt;if(shT<=0)shk=0}if(flash>0)flash=Math.max(0,flash-dt*1.4)}
function offset(){if(shk<=0)return[0,0];var k=shk*Math.min(1,shT*5);return[rnd(-k,k),rnd(-k,k)]}
function drawParts(ctx){for(var i=0;i<P.length;i++){var p=P[i],a=1-p.t/p.l;ctx.globalAlpha=Math.max(0,a);
  if(p.k===2){ctx.strokeStyle=p.c;ctx.lineWidth=3*a+1;ctx.beginPath();ctx.arc(p.x,p.y,p.r*(1-a*.7+.3),0,6.283);ctx.stroke()}
  else if(p.k===1){ctx.strokeStyle=p.c;ctx.lineWidth=p.r*.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.05,p.y-p.vy*.05);ctx.stroke()}
  else{ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r*(.4+a*.6),0,6.283);ctx.fill()}}ctx.globalAlpha=1}
/* rüzgârda sallanan çimen demetleri (çayır/orman karoları) */
function hash(x,y,s){var h=Math.sin(x*127.1+y*311.7+s*74.7)*43758.5453;return h-Math.floor(h)}
function grass(ctx,x0,y0,x1,y1,t,Y,TS){var wind=t*1.6;ctx.lineCap='round';
  for(var ty=y0;ty<y1;ty++)for(var tx=x0;tx<x1;tx++){var z=Y.zoneAt(tx,ty);if(z>1)continue;var h=hash(tx,ty,7);if(h>.34)continue;
    var bx=tx*TS+hash(tx,ty,3)*TS,by=ty*TS+hash(tx,ty,5)*TS+10,sw=Math.sin(wind+tx*.55+ty*.3)*3.2+Math.sin(wind*2.3+tx)*.8,hh=7+hash(tx,ty,9)*6;
    ctx.strokeStyle=z?'rgba(26,80,44,.85)':'rgba(70,160,70,.9)';ctx.lineWidth=1.7;ctx.beginPath();
    ctx.moveTo(bx-3,by);ctx.quadraticCurveTo(bx-3+sw*.5,by-hh*.6,bx-3+sw,by-hh);
    ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx+sw*.6,by-hh*.7,bx+sw*1.2,by-hh-3);
    ctx.moveTo(bx+3,by);ctx.quadraticCurveTo(bx+3+sw*.5,by-hh*.55,bx+3+sw*.9,by-hh+1);ctx.stroke();
    if(h<.05){ctx.fillStyle=['#ffd23f','#ff9ac0','#fff'][(tx+ty)%3];ctx.beginPath();ctx.arc(bx+sw*1.2,by-hh-3,1.8,0,6.283);ctx.fill()}}}
/* yumuşak yer gölgesi (ışık sol-üstten) */
function shadow(ctx,x,y,rx,ry){ctx.save();ctx.fillStyle='rgba(8,6,24,.28)';ctx.beginPath();ctx.ellipse(x+rx*.28,y,rx,ry,0,0,6.283);ctx.fill();ctx.fillStyle='rgba(8,6,24,.16)';ctx.beginPath();ctx.ellipse(x+rx*.28,y,rx*1.35,ry*1.3,0,0,6.283);ctx.fill();ctx.restore()}
/* gün döngüsü: gerçek yerel saate göre ton + oyuncu etrafında ışık */
/* gece/gündüz OYUN saatine göre (HUD'daki saat); önceden gerçek saat kullanılıyordu, oyunda gece görünmüyordu */
function gameHour(){try{return (YX2.dbg.hourP()+21)%24}catch(e){var d=new Date();return d.getHours()+d.getMinutes()/60}}
function tone(){var h=gameHour();
  if(h>=7.5&&h<17)return{a:0,c:'255,240,200'};
  if(h>=17&&h<20)return{a:.05+(h-17)/3*.2,c:'255,140,60'};
  if(h>=21||h<4.5)return{a:.5,c:'10,16,64'};if(h>=20)return{a:.25+(h-20)*.25,c:'14,20,84'};if(h<5)return{a:.5-(h-4.5)*.5,c:'14,20,84'};
  if(h>=5&&h<7.5)return{a:.18-(h-5)/2.5*.14,c:'255,150,120'};return{a:0,c:'255,255,255'}}
var EL=null,lastCss='';
function el(){if(EL&&EL.isConnected)return EL;var cv=document.getElementById('cv');if(!cv)return null;EL=document.createElement('div');EL.id='fxo';EL.style.cssText='position:fixed;inset:0;pointer-events:none';cv.insertAdjacentElement('afterend',EL);return EL}
function overlay(ctx,VW,VH,px,py,camX,camY,dg){var e=el();if(!e)return;var tn=dg?{a:.12,c:'20,10,50'}:tone(),L=[];
  if(flash>0)L.push('radial-gradient(ellipse at center,rgba('+flashC+',0) 38%,rgba('+flashC+','+(flash*.9).toFixed(3)+') 100%)');
  if(tn.a>.12||dg){var sx=Math.round(px-camX),sy=Math.round(py-camY-20);L.push('radial-gradient(circle at '+sx+'px '+sy+'px,rgba(255,214,140,'+(dg?.18:(.12+tn.a*.3).toFixed(3))+') 0,rgba(255,214,140,'+(dg?.06:(.05+tn.a*.12).toFixed(3))+') 150px,rgba(255,214,140,0) 300px)')}
  L.push('radial-gradient(ellipse at center,rgba(6,4,20,0) 52%,rgba(6,4,20,.4) 100%)');
  if(tn.a>.12&&!dg){var sx2=Math.round(px-camX),sy2=Math.round(py-camY-20);L.push('radial-gradient(circle at '+sx2+'px '+sy2+'px,rgba('+tn.c+',0) 0,rgba('+tn.c+',0) 90px,rgba('+tn.c+','+(tn.a*.9).toFixed(3)+') 260px)')}
  var css=L.join(',');if(tn.a>0&&(tn.a<=.12||dg))e.style.backgroundColor='rgba('+tn.c+','+(tn.a*.9).toFixed(3)+')';else e.style.backgroundColor='transparent';
  if(css!==lastCss){lastCss=css;e.style.backgroundImage=css}
  if(e.style.display==='none')e.style.display=''}
function hideOv(){if(EL)EL.style.display='none'}
window.YF={hit:hit,burst:burst,shake:shake,hurt:hurtFx,flashW:flashW,update:update,offset:offset,parts:drawParts,grass:grass,shadow:shadow,overlay:overlay,hide:hideOv};
})();
