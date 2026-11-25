/* Yaxest Diyarı · Gece ışıkları (YLT)
   Gece karanlığının üstüne "screen" karışımlı yarı çözünürlüklü bir katman çizer: kasaba meydanı, esnaf fenerleri,
   zindan kapılarının mor ışığı, iskele feneri ve diğer oyuncuların el fenerleri. Gündüz hiçbir şey çizmez. */
(function(){
var cv=null,cx=null,S=.5;
function el(){if(cv&&cv.isConnected)return cv;var base=document.getElementById('fxo')||document.getElementById('cv');if(!base)return null;cv=document.createElement('canvas');cv.id='ltc';cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;';base.insertAdjacentElement('afterend',cv);cx=cv.getContext('2d');return cv}
function glow(x,y,r,c,a){var g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+c+','+a.toFixed(3)+')');g.addColorStop(.35,'rgba('+c+','+(a*.45).toFixed(3)+')');g.addColorStop(1,'rgba('+c+',0)');cx.fillStyle=g;cx.beginPath();cx.arc(x,y,r,0,6.2832);cx.fill()}
function draw(G,camX,camY,VW,VH,dg){var c=el();if(!c)return;var n=0;if(!dg&&window.YF&&YF.tone){var tn=YF.tone();if(tn.c.indexOf('64')>=0||tn.c.indexOf('84')>=0)n=Math.min(1,tn.a/.5)}
  if(window.YD_LOWFX)n=0;var w=Math.ceil(innerWidth*S),h=Math.ceil(innerHeight*S);if(c.width!==w||c.height!==h){c.width=w;c.height=h}
  if(n<=.02){if(c._on){cx.clearRect(0,0,w,h);c._on=0}return}c._on=1;cx.clearRect(0,0,w,h);
  var sx=innerWidth/VW*S,sy=innerHeight/VH*S,t=performance.now()/1000,Y=window.YD,TS=Y?Y.TS:48,LS=[];
  /* 1) karanlık örtü, 2) ışık kaynaklarında delik, 3) sıcak renk parıltısı */
  function L(wx,wy,r,col,a){var x=(wx-camX)*sx,y=(wy-camY)*sy;if(x<-r*sx||y<-r*sy||x>w+r*sx||y>h+r*sy)return;LS.push([x,y,r*sx,col,a])}
  L(G.px,G.py-20,250,'255,214,140',.35);
  if(Y){L(Y.CX*TS,Y.CY*TS,330,'255,170,80',.13);
    if(Y.POND)L((Y.CX+3)*TS+TS-8,(Y.CY+22)*TS-28,120,'255,200,110',.55+Math.sin(t*6)*.05)}
  (G.houses||[]).forEach(function(o,i){if(o.hid)return;L(o.x,o.y+4,115,'255,196,105',.4+Math.sin(t*4.3+i*2.3)*.05)});
  (G.npcs||[]).forEach(function(p,i){L(p.x,p.y-30,120,'255,180,90',.42+Math.sin(t*5+i*1.7)*.04)});
  (G.portals||[]).forEach(function(p,i){if(p.p)L(p.p.x,p.p.y-40,160,'170,110,255',.45+Math.sin(t*2+i)*.08)});
  try{var o=window.YNet&&YNet.others();if(o)for(var k in o){var q=o[k];if(q&&q.x!=null)L(q.x,q.y-20,95,'255,210,150',.3)}}catch(e){}
  /* ateş böcekleri gölet çevresinde */
  if(Y&&Y.POND){for(var i=0;i<10;i++){var ax=(Y.POND.x+Math.sin(t*.4+i*2.1)*6)*TS,ay=(Y.POND.y+Math.cos(t*.33+i*1.3)*4.2)*TS,bl=.5+.5*Math.sin(t*3+i*5);L(ax,ay,14,'190,255,140',.8*bl)}}
  cx.globalCompositeOperation='source-over';cx.fillStyle='rgba(8,12,46,'+(.66*n).toFixed(3)+')';cx.fillRect(0,0,w,h);
  cx.globalCompositeOperation='destination-out';LS.forEach(function(l){var g=cx.createRadialGradient(l[0],l[1],0,l[0],l[1],l[2]);g.addColorStop(0,'rgba(0,0,0,'+Math.min(1,l[4]*2.2).toFixed(3)+')');g.addColorStop(.55,'rgba(0,0,0,'+Math.min(1,l[4]*1.1).toFixed(3)+')');g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.beginPath();cx.arc(l[0],l[1],l[2],0,6.2832);cx.fill()});
  cx.globalCompositeOperation='lighter';LS.forEach(function(l){glow(l[0],l[1],l[2]*.7,l[3],l[4]*.24*n)});cx.globalCompositeOperation='source-over'}
window.YLT={draw:draw};
})();
