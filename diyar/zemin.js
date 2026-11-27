/* Yaxest Diyarı — zemin çizici (YG): yumuşak bölge geçişleri, organik kıyı, kaldırım, çimen/çiçek dokusu.
   Parçalara (8x8 karo) bölünüp bir kez çizilir ve önbelleğe alınır; sonra her karede tek drawImage. */
(function(){
'use strict';
var CH=8,TS=48,PS=CH*TS,HC=PS/2,cache=new Map(),Y=null,budget=0,T0=null,hadAll=false,view=null,idleOn=false,lastC=null;
function now(){try{return new Event('t').timeStamp}catch(e){return Date.now()}}
/* eksik parça yerine bölgenin ortalama rengi (yeşil kare yerine) */
function fillFor(c,r){try{var z=Y.zoneAt(c*CH+4,r*CH+4),l=LO[z],h=HI[z];return 'rgb('+((l[0]+h[0])>>1)+','+((l[1]+h[1])>>1)+','+((l[2]+h[2])>>1)+')'}catch(e){return '#4a9a55'}}
/* boşta önden çizim: görünen alanın bir halka dışı + hareket yönünde iki halka */
function schedule(){if(idleOn||!view)return;idleOn=true;var ric=window.requestIdleCallback||function(f){return setTimeout(function(){f({timeRemaining:function(){return 8}})},40)};
  ric(function(dl){idleOn=false;if(!view||!Y)return;var v=view,dc=lastC?Math.sign(v.c0-lastC.c0):0,dr=lastC?Math.sign(v.r0-lastC.r0):0;lastC=v;
    var cand=[];for(var r=v.r0-1-(dr<0?1:0);r<=v.r1+1+(dr>0?1:0);r++)for(var c=v.c0-1-(dc<0?1:0);c<=v.c1+1+(dc>0?1:0);c++){if(c<0||r<0||c*PS>=Y.MW*TS||r*PS>=Y.MH*TS)continue;if(!cache.has(c+','+r))cand.push([c,r])}
    var cx=(v.c0+v.c1)/2+dc*2,cy=(v.r0+v.r1)/2+dr*2;cand.sort(function(a,b){return Math.hypot(a[0]-cx,a[1]-cy)-Math.hypot(b[0]-cx,b[1]-cy)});
    for(var i=0;i<cand.length;i++){if(dl.timeRemaining()<6&&i>0)break;try{cache.set(cand[i][0]+','+cand[i][1],{c:build(cand[i][0],cand[i][1]),u:v.t})}catch(e){break}}
    if(cand.length>1)schedule()},{timeout:400})}
/* z: 0 çayır, 1 orman, 2 kaya, 3 su, 4 kasaba */
var LO=[[74,160,84],[38,118,66],[122,128,150],[40,110,176],[214,190,138]],HI=[[98,184,98],[52,142,82],[150,156,176],[72,160,222],[232,212,160]];
/* değer gürültüsü (dikişsiz tablo) */
var N=new Float32Array(128*128),s=1234567;function rnd(){s=(s*1664525+1013904223)>>>0;return s/4294967296}for(var i=0;i<N.length;i++)N[i]=rnd();
function ns(x,y){var xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);var a=xi&127,b=(xi+1)&127,c=yi&127,d=(yi+1)&127;
  var v00=N[c*128+a],v10=N[c*128+b],v01=N[d*128+a],v11=N[d*128+b];return v00+(v10-v00)*fx+(v01-v00)*fy+(v00-v10-v01+v11)*fx*fy}
function zat(tx,ty){tx=tx<0?0:tx>=Y.MW?Y.MW-1:tx;ty=ty<0?0:ty>=Y.MH?Y.MH-1:ty;return Y.zoneAt(tx,ty)}
function hs(x,y,k){return Y.hash(x,y,k)}
function build(cx,cy){
  var c=document.createElement('canvas');c.width=c.height=PS;var g=c.getContext('2d'),tx0=cx*CH,ty0=cy*CH,wx0=tx0*TS,wy0=ty0*TS,W=CH+2,Z=new Uint8Array(W*W),water=false;
  for(var j=0;j<W;j++)for(var i=0;i<W;i++){var z=zat(tx0-1+i,ty0-1+j);Z[j*W+i]=z;if(z===3)water=true}
  var tc=document.createElement('canvas');tc.width=tc.height=HC;var tg=tc.getContext('2d'),im=tg.createImageData(HC,HC),D=im.data,o=0;
  for(var oy=0;oy<HC;oy++){var wy=wy0+oy*2+1,fy=wy/TS-.5,iy=Math.floor(fy),ay=fy-iy,jy=iy-ty0+1;
    for(var ox=0;ox<HC;ox++,o+=4){var wx=wx0+ox*2+1,fx=wx/TS-.5,ix=Math.floor(fx),ax=fx-ix,jx=ix-tx0+1;
      var n=ns(wx/70,wy/70)*.55+ns(wx/22,wy/22)*.3+ns(wx/9,wy/9)*.15,big=ns(wx/260+9,wy/260+4)-.5;
      var w00=(1-ax)*(1-ay),w10=ax*(1-ay),w01=(1-ax)*ay,w11=ax*ay,zs=[Z[jy*W+jx],Z[jy*W+jx+1],Z[(jy+1)*W+jx],Z[(jy+1)*W+jx+1]],ws=[w00,w10,w01,w11],r=0,gg=0,b=0,lw=0;
      for(var q=0;q<4;q++){var zz=zs[q];if(zz===3)continue;var wq=ws[q],l=LO[zz],h=HI[zz];r+=wq*(l[0]+(h[0]-l[0])*n);gg+=wq*(l[1]+(h[1]-l[1])*n);b+=wq*(l[2]+(h[2]-l[2])*n);lw+=wq}
      var R,G,B;
      if(lw>0){R=r/lw;G=gg/lw;B=b/lw;var sh=1+big*.16;R*=sh;G*=sh;B*=sh}else{R=G=B=0}
      if(water&&lw<1){var wn=(1-lw)+(ns(wx/38+7,wy/38)-.5)*.34+(ns(wx/14,wy/14)-.5)*.05;
        if(wn>=.5){var d=Math.min(1,(wn-.5)/.45),cw=.55+ns(wx/50+3,wy/18)*.25,l3=LO[3],h3=HI[3];
          R=h3[0]+(l3[0]-h3[0])*d*cw;G=h3[1]+(l3[1]-h3[1])*d*cw;B=h3[2]+(l3[2]-h3[2])*d*cw;
          if(wn<.58){var f=(.58-wn)/.08;f=f*f*.75;R+=(255-R)*f;G+=(255-G)*f;B+=(255-B)*f}}
        else if(wn>.2){var k=(wn-.2)/.3;k=k*k*(3-2*k)*.85;R+=(214-R)*k;G+=(196-G)*k;B+=(146-B)*k;if(wn>.43){var m=(wn-.43)/.07*.18;R*=1-m;G*=1-m;B*=1-m}}}
      D[o]=R;D[o+1]=G;D[o+2]=B;D[o+3]=255}}
  tg.putImageData(im,0,0);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(tc,0,0,PS,PS);
  g.translate(-wx0,-wy0);
  for(var ty=ty0;ty<ty0+CH;ty++)for(var tx=tx0;tx<tx0+CH;tx++){if(tx<0||ty<0||tx>=Y.MW||ty>=Y.MH)continue;var z=Y.zoneAt(tx,ty);if(z===3)continue;
    var near=false;for(var dy=-1;dy<=1&&!near;dy++)for(var dx=-1;dx<=1;dx++)if(zat(tx+dx,ty+dy)===3){near=true;break}if(near)continue;
    detail(g,tx,ty,z)}
  /* piksel dünya: parça 1/3 çözünürlüğe indirilir, çizerken keskin büyütülür */if(window.YPX&&YPX.want()){var sc=document.createElement('canvas');sc.width=sc.height=PS/3;var sg=sc.getContext('2d');sg.imageSmoothingEnabled=true;sg.drawImage(c,0,0,PS/3,PS/3);sc.px=1;return sc}
  return c}
function blade(g,x,y,h,lean,col){g.strokeStyle=col;g.lineWidth=1.7;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+lean*.4,y-h*.6,x+lean,y-h);g.stroke()}
function detail(g,tx,ty,z){var X=tx*TS,Yp=ty*TS,h=hs(tx,ty,31),h2=hs(tx,ty,32),h3=hs(tx,ty,33),h4=hs(tx,ty,34);
  if(z===0||z===1){
    if(h<.4){var bx=X+6+h2*34,by=Yp+14+h3*28,dk=z?'rgba(12,60,30,.5)':'rgba(30,100,45,.5)',lt=z?'rgba(110,200,120,.35)':'rgba(190,240,150,.5)';
      blade(g,bx-3,by,8+h4*3,-4,dk);blade(g,bx,by,11+h2*3,1,dk);blade(g,bx+3,by,7,5,dk);blade(g,bx+1,by,9,-1,lt)}
    if(h2>.62&&h3<.5){var px=X+8+h4*30,py=Yp+10+h*30;g.fillStyle=z?'rgba(10,50,28,.16)':'rgba(255,255,255,.08)';g.beginPath();g.ellipse(px,py,10+h3*8,5+h*3,0,0,6.3);g.fill()}
    if(z===0&&h3>.93){var fx=X+8+h*30,fy=Yp+10+h2*28,cs=h4<.34?'#ffe14a':h4<.67?'#ff8fb0':'#ffffff';for(var q=0;q<3;q++){var a=fx+(q-1)*6+h4*4,b=fy+(q%2)*5;g.fillStyle='#2f7a3a';g.fillRect(a-.5,b,1.2,5);g.fillStyle=cs;g.beginPath();g.arc(a,b,2.6,0,6.3);g.fill();g.fillStyle='rgba(255,230,120,.95)';g.beginPath();g.arc(a,b,1,0,6.3);g.fill()}}
    if(z===1){if(h4>.965){var mx=X+10+h*28,my=Yp+16+h2*24;g.fillStyle='#e8dcc0';g.fillRect(mx-1.5,my,3,5);g.fillStyle='#d6453d';g.beginPath();g.ellipse(mx,my,5.5,3.8,0,Math.PI,0);g.fill();g.fillStyle='#fff';g.fillRect(mx-2,my-2.4,1.6,1.6);g.fillRect(mx+1.2,my-1.6,1.4,1.4)}
      else if(h3>.7&&h<.5){g.fillStyle=h2<.5?'rgba(150,100,40,.5)':'rgba(190,140,50,.45)';g.beginPath();g.ellipse(X+8+h4*32,Yp+10+h2*30,3.4,1.8,h*3,0,6.3);g.fill()}}
  }else if(z===2){
    if(h<.42){for(var q=0;q<1+(h2*3|0);q++){var px=X+6+hs(tx,ty,40+q)*36,py=Yp+8+hs(tx,ty,50+q)*32,r=2.5+hs(tx,ty,60+q)*4;g.fillStyle='rgba(40,44,66,.32)';g.beginPath();g.ellipse(px+1.5,py+2,r+1,r*.6,0,0,6.3);g.fill();g.fillStyle='rgba(160,166,190,.95)';g.beginPath();g.ellipse(px,py,r,r*.72,0,0,6.3);g.fill();g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.ellipse(px-r*.3,py-r*.25,r*.45,r*.28,0,0,6.3);g.fill()}}
    if(h3>.9){g.strokeStyle='rgba(40,44,66,.35)';g.lineWidth=1.3;g.beginPath();var cx=X+10+h*26,cy=Yp+10+h2*26;g.moveTo(cx,cy);g.lineTo(cx+7,cy+4+h4*4);g.lineTo(cx+10,cy+13);g.stroke()}
    if(h4>.85){g.fillStyle='rgba(90,140,90,.25)';g.beginPath();g.ellipse(X+10+h*28,Yp+12+h2*24,6,3,0,0,6.3);g.fill()}
  }else if(z===4){
    for(var gy=0;gy<3;gy++)for(var gx=0;gx<3;gx++){var j1=hs(tx*3+gx,ty*3+gy,70),j2=hs(tx*3+gx,ty*3+gy,71),j3=hs(tx*3+gx,ty*3+gy,72),cx=X+gx*16+8+(j1-.5)*3,cy=Yp+gy*16+8+(j2-.5)*3,rx=6.2+j3*1.6,ry=5.6+j1*1.4,v=Math.floor((j3-.5)*26);
      g.fillStyle='rgb('+(204+v)+','+(178+v)+','+(124+v)+')';g.strokeStyle='rgba(110,80,40,.38)';g.lineWidth=1.3;g.beginPath();if(g.roundRect)g.roundRect(cx-rx,cy-ry,rx*2,ry*2,3.4);else g.rect(cx-rx,cy-ry,rx*2,ry*2);g.fill();g.stroke();
      g.fillStyle='rgba(255,246,214,.28)';g.fillRect(cx-rx+1.5,cy-ry+1.2,rx*1.2,1.5)}
    if(h4>.95){g.fillStyle='rgba(70,140,60,.45)';g.beginPath();g.arc(X+8+h*30,Yp+8+h2*30,3,0,6.3);g.fill()}
  }}
function draw(ctx,camX,camY,VW,VH,t,Yo){
  if(!Yo)return false;Y=Yo;TS=Y.TS;if(PS!==CH*TS){return false}
  var c0=Math.max(0,Math.floor(camX/PS)),r0=Math.max(0,Math.floor(camY/PS)),c1=Math.min(Math.ceil(Y.MW*TS/PS)-1,Math.floor((camX+VW)/PS)),r1=Math.min(Math.ceil(Y.MH*TS/PS)-1,Math.floor((camY+VH)/PS));
  ctx.fillStyle='#1d5a9a';ctx.fillRect(camX-2,camY-2,VW+4,VH+4);var miss=0,tb=now(),lim=hadAll?6:24;
  /* takılma önlemi: karede zaman bütçesi (ilk açılışta 24 ms, sonra 6 ms); kalan parçalar boşta önceden çizilir */
  for(var r=r0;r<=r1;r++)for(var c=c0;c<=c1;c++){var k=c+','+r,e=cache.get(k);
    if(!e){if(now()-tb<lim){try{e={c:build(c,r),u:0}}catch(er){return false}cache.set(k,e)}else{miss++;ctx.fillStyle=fillFor(c,r);ctx.fillRect(c*PS,r*PS,PS,PS);continue}}
    e.u=t;if(e.c.px){var ism=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=false;ctx.drawImage(e.c,c*PS,r*PS,PS,PS);ctx.imageSmoothingEnabled=ism}else ctx.drawImage(e.c,c*PS,r*PS)}
  hadAll=miss===0;view={c0:c0,r0:r0,c1:c1,r1:r1,t:t};schedule();
  if(cache.size>160){var arr=[...cache.entries()].sort(function(a,b){return a[1].u-b[1].u});for(var i=0;i<arr.length-70;i++)cache.delete(arr[i][0])}
  /* hareketli su: dalga çizgileri */
  var x0=Math.max(0,Math.floor(camX/TS)-1),y0=Math.max(0,Math.floor(camY/TS)-1),x1=Math.min(Y.MW,Math.ceil((camX+VW)/TS)+1),y1=Math.min(Y.MH,Math.ceil((camY+VH)/TS)+1);
  ctx.lineWidth=2;ctx.lineCap='round';
  for(var ty=y0;ty<y1;ty++)for(var tx=x0;tx<x1;tx++){if(Y.zoneAt(tx,ty)!==3)continue;var h=hs(tx,ty,81),h2=hs(tx,ty,82);if(h>.6)continue;
    var ph=t*.9+h*20,bx=tx*TS+4+h2*14,by=ty*TS+10+h*60%30,a=.1+.16*(.5+.5*Math.sin(ph));ctx.strokeStyle='rgba(255,255,255,'+a.toFixed(3)+')';ctx.beginPath();ctx.moveTo(bx,by);for(var q=1;q<=6;q++)ctx.lineTo(bx+q*5,by+Math.sin(ph+q*.9)*2.2);ctx.stroke();
    if(h<.05){var sp=.5+.5*Math.sin(t*3+h*90);ctx.fillStyle='rgba(255,255,255,'+(sp*.7).toFixed(2)+')';ctx.fillRect(tx*TS+10+h2*20,ty*TS+8+h*300%28,2.4,2.4)}}
  return true}
window.YG={draw:draw,clear:function(){cache.clear();hadAll=false}};
})();
