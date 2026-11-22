/* Yaxest Diyarı: kasaba suru, kuleler, 4 kapı (YW) */
(function(){
'use strict';
var TS=48,R=17.4*TS,GW=1.9*TS,BAND=.44*TS,CX=100*TS,CY=100*TS,STEP=34;
var GATES=[['Kuzey Kapısı',0,-1],['Doğu Kapısı',1,0],['Güney Kapısı',0,1],['Batı Kapısı',-1,0]];
function inGate(dx,dy){return(Math.abs(dx)<GW&&Math.abs(dy)>Math.abs(dx))||(Math.abs(dy)<GW&&Math.abs(dx)>Math.abs(dy))}
function solid(x,y){var dx=x-CX,dy=y-CY,d=Math.sqrt(dx*dx+dy*dy);if(Math.abs(d-R)>BAND)return false;return!inGate(dx,dy)}
function fix(G){if(solid(G.px,G.py)){var dx=G.px-CX,dy=G.py-CY,d=Math.sqrt(dx*dx+dy*dy)||1,t=d>=R?R+BAND+6:R-BAND-6;G.px=CX+dx/d*t;G.py=CY+dy/d*t}}
function hash(a){var h=Math.sin(a*12.9898)*43758.5453;return h-Math.floor(h)}
/* bir duvar bloğu */
function block(ctx,x,y,i,H){var s=hash(i),f=s>.5?'#8f93a8':'#868aa0',top='#b5b9cc';
  var w=40;
  ctx.fillStyle='rgba(8,6,24,.28)';ctx.beginPath();ctx.ellipse(x+8,y+22,26,9,0,0,6.283);ctx.fill();
  var g=ctx.createLinearGradient(0,y+20-H,0,y+20);g.addColorStop(0,f);g.addColorStop(1,'#5d6178');ctx.fillStyle=g;ctx.fillRect(x-w/2,y+20-H,w,H);
  ctx.strokeStyle='rgba(20,16,40,.45)';ctx.lineWidth=1;ctx.beginPath();for(var k=1;k<4;k++){var yy=y+20-H+k*H/4;ctx.moveTo(x-w/2,yy);ctx.lineTo(x+w/2,yy)}for(var r=0;r<4;r++){var off=r%2?10:0;for(var c2=off+10;c2<w;c2+=20){var yy2=y+20-H+r*H/4;ctx.moveTo(x-w/2+c2,yy2);ctx.lineTo(x-w/2+c2,yy2+H/4)}}ctx.stroke();
  ctx.fillStyle=top;ctx.fillRect(x-w/2,y+20-H-14,w,14);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(x-w/2,y+20-H-14,w,3);
  ctx.strokeStyle='#1b1530';ctx.lineWidth=1.2;ctx.strokeRect(x-w/2,y+20-H-14,w,H+14);
  /* mazgallar */
  ctx.fillStyle=top;for(var m=0;m<2;m++){var mx=x-w/2+3+m*21;ctx.fillRect(mx,y+20-H-22,13,9);ctx.strokeRect(mx,y+20-H-22,13,9)}}
function tower(ctx,x,y,t,big){var W=big?30:26,H=big?96:78;
  ctx.fillStyle='rgba(8,6,24,.3)';ctx.beginPath();ctx.ellipse(x+10,y+22,W+8,11,0,0,6.283);ctx.fill();
  var g=ctx.createLinearGradient(x-W,0,x+W,0);g.addColorStop(0,'#a2a6bd');g.addColorStop(.55,'#8a8ea6');g.addColorStop(1,'#5d6178');ctx.fillStyle=g;ctx.fillRect(x-W,y+22-H,W*2,H);ctx.strokeStyle='#1b1530';ctx.lineWidth=1.4;ctx.strokeRect(x-W,y+22-H,W*2,H);
  ctx.strokeStyle='rgba(20,16,40,.4)';ctx.lineWidth=1;ctx.beginPath();for(var k=1;k<8;k++){var yy=y+22-H+k*H/8;ctx.moveTo(x-W,yy);ctx.lineTo(x+W,yy)}ctx.stroke();
  /* ok yarığı */
  ctx.fillStyle='#14101e';ctx.fillRect(x-3,y+22-H*.62,6,16);
  /* çatı */
  ctx.fillStyle='#b5463d';ctx.beginPath();ctx.moveTo(x-W-5,y+22-H);ctx.lineTo(x,y+22-H-(big?40:32));ctx.lineTo(x+W+5,y+22-H);ctx.closePath();ctx.fill();ctx.strokeStyle='#1b1530';ctx.lineWidth=1.4;ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.moveTo(x-W-5,y+22-H);ctx.lineTo(x,y+22-H-(big?40:32));ctx.lineTo(x-4,y+22-H);ctx.closePath();ctx.fill();
  /* flama */
  var fx=x+1,fy=y+22-H-(big?40:32);ctx.strokeStyle='#5a3a22';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx,fy-18);ctx.stroke();ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.moveTo(fx,fy-18);ctx.lineTo(fx+14+Math.sin(t*4)*2,fy-14);ctx.lineTo(fx,fy-9);ctx.closePath();ctx.fill();ctx.strokeStyle='#1b1530';ctx.lineWidth=1;ctx.stroke()}
function torch(ctx,x,y,t){var fl=.8+Math.sin(t*9+x)*.2;ctx.fillStyle='#5a3a22';ctx.fillRect(x-2,y-6,4,16);var g=ctx.createRadialGradient(x,y-10,2,x,y-10,46*fl);g.addColorStop(0,'rgba(255,190,90,.5)');g.addColorStop(1,'rgba(255,140,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y-10,46*fl,0,6.283);ctx.fill();ctx.fillStyle='#ffb02e';ctx.beginPath();ctx.ellipse(x,y-10,4*fl,7*fl,0,0,6.283);ctx.fill();ctx.fillStyle='#fff3b0';ctx.beginPath();ctx.ellipse(x,y-9,2,4*fl,0,0,6.283);ctx.fill()}
/* çizim girdileri: görünür duvar parçaları ents'e eklenir */
function collect(ents,ctx,camX,camY,VW,VH,t,plate){var out=[];var n=Math.ceil(2*Math.PI*R/STEP),pad=90;
  for(var i=0;i<n;i++){var a=i/n*6.283185,x=CX+Math.cos(a)*R,y=CY+Math.sin(a)*R;
    if(x<camX-pad||x>camX+VW+pad||y<camY-pad-120||y>camY+VH+pad+60)continue;
    var dx=x-CX,dy=y-CY;if(inGate(dx*1.12,dy*1.12))continue;
    (function(xx,yy,ii){ents.push({y:yy+20,f:function(){block(ctx,xx,yy,ii,34)}})})(x,y,i)}
  /* kuleler: kapı yanları ve çaprazlar */
  var T=[];GATES.forEach(function(g){var px=-g[2],py=g[1];[-1,1].forEach(function(s){var ox=CX+g[1]*R+px*s*(GW+34),oy=CY+g[2]*R+py*s*(GW+34);T.push([ox,oy,1])})});
  [45,135,225,315].forEach(function(dg){var a=dg*Math.PI/180;T.push([CX+Math.cos(a)*R,CY+Math.sin(a)*R,0])});
  T.forEach(function(q){if(q[0]<camX-80||q[0]>camX+VW+80||q[1]<camY-160||q[1]>camY+VH+80)return;ents.push({y:q[1]+22,f:function(){tower(ctx,q[0],q[1],t,q[2])}})});
  GATES.forEach(function(g){var gx=CX+g[1]*R,gy=CY+g[2]*R;if(gx<camX-140||gx>camX+VW+140||gy<camY-140||gy>camY+VH+140)return;
    ents.push({y:gy-40,f:function(){torch(ctx,gx+(g[2]?-GW+6:0),gy+(g[1]?-GW+6:0)-0,t);torch(ctx,gx+(g[2]?GW-6:0),gy+(g[1]?GW-6:0),t);if(plate)plate(ctx,gx,gy-62,g[0],'#ffd98a')}})})}
window.YW={solid:solid,fix:fix,collect:collect,R:R,GW:GW};
})();
