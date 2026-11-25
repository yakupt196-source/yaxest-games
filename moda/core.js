/* Yaxest Moda: çizim çekirdeği. Tüm görseller kodla çizilir (resim dosyası yok). window.YM */
(function(){
'use strict';
var OL='#4a2340',YM=window.YM={OL:OL,W:600,H:900,CAT:{},BG:[],HAIR:[],lists:{}};
function rgb(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function hx(a){return'#'+a.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return(v<16?'0':'')+v.toString(16)}).join('')}
function mix(h,k){var a=rgb(h);return hx(k>=0?a.map(function(v){return v+(255-v)*k}):a.map(function(v){return v*(1+k)}))}
function lum(h){var a=rgb(h);return .299*a[0]+.587*a[1]+.114*a[2]}
function mir(d){return d.replace(/([MLCQ])([^MLCQZ]*)/g,function(_,k,a){var n=a.trim().split(/[\s,]+/).map(Number),o=[];for(var i=0;i<n.length;i+=2)o.push((600-n[i])+','+n[i+1]);return k+o.join(' ')})}
var PCACHE={};
function P(d){return PCACHE[d]||(PCACHE[d]=new Path2D(d))}
function sym(d){var k='s'+d;return PCACHE[k]||(PCACHE[k]=new Path2D(d+' '+mir(d)))}
YM.u={rgb:rgb,hx:hx,mix:mix,lum:lum,P:P,sym:sym,mir:mir};
/* ---- desenler ---- */
var PAT={};
function patOf(c,type,col){var k=type+col;if(PAT[k])return PAT[k];var cv=document.createElement('canvas');cv.width=cv.height=32;var x=cv.getContext('2d'),ink=lum(col)>140?mix(col,-.34):mix(col,.72);x.fillStyle=ink;x.strokeStyle=ink;
 function star(cx,cy,r,r2){x.beginPath();for(var i=0;i<10;i++){var a=i*Math.PI/5-Math.PI/2,rr=i%2?r2:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}x.closePath();x.fill()}
 if(type==='dot'){[[8,8],[24,24]].forEach(function(p){x.beginPath();x.arc(p[0],p[1],3.6,0,6.3);x.fill()})}
 else if(type==='stripe'){x.fillRect(0,0,6,32);x.fillRect(16,0,6,32)}
 else if(type==='check'){x.globalAlpha=.8;x.fillRect(0,0,16,16);x.fillRect(16,16,16,16)}
 else if(type==='heart'){[[9,10],[25,26]].forEach(function(p){x.beginPath();x.moveTo(p[0],p[1]+5);x.bezierCurveTo(p[0]-9,p[1]-2,p[0]-4,p[1]-9,p[0],p[1]-3);x.bezierCurveTo(p[0]+4,p[1]-9,p[0]+9,p[1]-2,p[0],p[1]+5);x.fill()})}
 else if(type==='star'){star(9,9,6,2.6);star(25,25,6,2.6)}
 else if(type==='flower'){[[9,9],[25,25]].forEach(function(p){for(var i=0;i<5;i++){var a=i*1.2566;x.beginPath();x.arc(p[0]+Math.cos(a)*4,p[1]+Math.sin(a)*4,3,0,6.3);x.fill()}x.fillStyle=lum(col)>140?mix(col,-.6):'#ffe27a';x.beginPath();x.arc(p[0],p[1],2.2,0,6.3);x.fill();x.fillStyle=ink})}
 else if(type==='glitter'){x.fillStyle='#fff';x.globalAlpha=.85;[[6,6,2.4],[22,10,1.6],[12,22,2],[27,27,2.6],[4,28,1.2],[18,2,1.2]].forEach(function(p){x.beginPath();x.moveTo(p[0],p[1]-p[2]*1.8);x.lineTo(p[0]+p[2]*.5,p[1]-p[2]*.5);x.lineTo(p[0]+p[2]*1.8,p[1]);x.lineTo(p[0]+p[2]*.5,p[1]+p[2]*.5);x.lineTo(p[0],p[1]+p[2]*1.8);x.lineTo(p[0]-p[2]*.5,p[1]+p[2]*.5);x.lineTo(p[0]-p[2]*1.8,p[1]);x.lineTo(p[0]-p[2]*.5,p[1]-p[2]*.5);x.fill()})}
 return PAT[k]=c.createPattern(cv,'repeat')}
YM.pats=[['plain','Düz'],['dot','Puantiyeli'],['stripe','Çizgili'],['check','Kareli'],['heart','Kalpli'],['star','Yıldızlı'],['flower','Çiçekli'],['glitter','Simli']];
function paint(c,path,col,pat,o){o=o||{};c.fillStyle=col;c.fill(path);if(pat&&pat!=='plain'){c.fillStyle=patOf(c,pat,col);c.fill(path)}
 c.save();c.clip(path);if(!o.flat){var g=c.createLinearGradient(150,0,450,0);g.addColorStop(0,'rgba(255,255,255,.17)');g.addColorStop(.42,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(50,0,70,.22)');c.fillStyle=g;c.fillRect(0,0,600,900)}
 if(o.v){var g2=c.createLinearGradient(0,o.v[0],0,o.v[1]);g2.addColorStop(0,'rgba(255,255,255,.14)');g2.addColorStop(1,'rgba(40,0,60,.2)');c.fillStyle=g2;c.fillRect(0,0,600,900)}
 c.restore();if(o.ol!==false){c.lineWidth=o.lw||3;c.lineJoin='round';c.lineCap='round';c.strokeStyle=o.olc||OL;c.stroke(path)}}
YM.paint=paint;
function line(c,d,w,col,cap){c.beginPath();c.lineWidth=w;c.strokeStyle=col||OL;c.lineCap=cap||'round';c.lineJoin='round';c.stroke(P(d))}
YM.line=line;
function circ(c,x,y,r,col,ol){c.beginPath();c.arc(x,y,r,0,6.2832);c.fillStyle=col;c.fill();if(ol){c.lineWidth=ol;c.strokeStyle=OL;c.stroke()}}
YM.circ=circ;
function star(c,x,y,r,r2,col,ol,rot){c.beginPath();for(var i=0;i<10;i++){var a=i*Math.PI/5-Math.PI/2+(rot||0),rr=i%2?r2:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}c.closePath();c.fillStyle=col;c.fill();if(ol){c.lineWidth=ol;c.lineJoin='round';c.strokeStyle=OL;c.stroke()}}
YM.star=star;
function heart(c,x,y,s,col,ol){c.beginPath();c.moveTo(x,y+s*.9);c.bezierCurveTo(x-s*1.6,y-s*.2,x-s*.7,y-s*1.4,x,y-s*.55);c.bezierCurveTo(x+s*.7,y-s*1.4,x+s*1.6,y-s*.2,x,y+s*.9);c.fillStyle=col;c.fill();if(ol){c.lineWidth=ol;c.lineJoin='round';c.strokeStyle=OL;c.stroke()}}
YM.heart=heart;
function sparkle(c,x,y,r,col,a){c.save();c.globalAlpha=a==null?1:a;c.fillStyle=col||'#fff';c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x+r*.18,y-r*.18,x+r,y);c.quadraticCurveTo(x+r*.18,y+r*.18,x,y+r);c.quadraticCurveTo(x-r*.18,y+r*.18,x-r,y);c.quadraticCurveTo(x-r*.18,y-r*.18,x,y-r);c.fill();c.restore()}
YM.sparkle=sparkle;
/* ---- gövde ---- */
var SK=[['#ffe3d2','Porselen'],['#fbd3b6','Açık'],['#f0b994','Buğday'],['#d99a6f','Bal'],['#b97a52','Karamel'],['#8f5a3b','Kahve'],['#6a402b','Çikolata'],['#47291c','Abanoz']];
YM.lists.skin=SK;
var HW=[[262,62],[290,57],[330,50],[392,42],[430,51],[470,64],[520,72]];
function hw(y){for(var i=1;i<HW.length;i++)if(y<=HW[i][0]){var a=HW[i-1],b=HW[i];return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0])}return HW[HW.length-1][1]}
YM.hw=hw;
function torsoD(y1,nk){var ys=(nk==='off'||nk==='tank'||nk==='sweet')?302:270,Ls=[],Rs=[],y;
 for(y=ys;y<y1;y+=8){Ls.push((300-hw(y)).toFixed(1)+','+y);Rs.push((300+hw(y)).toFixed(1)+','+y)}
 Ls.push((300-hw(y1)).toFixed(1)+','+y1);Rs.push((300+hw(y1)).toFixed(1)+','+y1);
 var d='M'+Ls.join(' L')+' L'+Rs.slice().reverse().join(' L');
 if(nk==='crew')d+=' L360,270 L334,258 Q300,288 266,258 L240,270';
 else if(nk==='v')d+=' L360,270 L334,258 L300,306 L266,258 L240,270';
 else if(nk==='scoop')d+=' L360,270 L334,258 Q300,340 266,258 L240,270';
 else if(nk==='sq')d+=' L360,270 L334,258 L332,298 L268,298 L266,258 L240,270';
 else if(nk==='off')d+=' Q300,284 '+(300-hw(ys)).toFixed(1)+','+ys;
 else d+=' L'+(300+hw(ys)).toFixed(1)+',308 Q325,288 300,308 Q275,288 '+(300-hw(ys)).toFixed(1)+',308';
 return d+' Z'}
YM.torsoD=torsoD;
var POSES=[
 {n:'Dik',L:[[240,278],[200,366],[212,456]],R:[[360,278],[400,366],[388,456]]},
 {n:'Elleri belde',L:[[240,278],[176,374],[250,458]],R:[[360,278],[424,374],[350,458]]},
 {n:'Selam',L:[[240,278],[180,376],[248,458]],R:[[360,278],[444,330],[446,210]]},
 {n:'Poz',L:[[240,278],[170,380],[252,462]],R:[[360,278],[408,370],[396,462]]}];
YM.poses=POSES;
function armPt(a,u){var v=1-u,S=a[0],C=a[1],W=a[2];return[v*v*S[0]+2*u*v*C[0]+u*u*W[0],v*v*S[1]+2*u*v*C[1]+u*u*W[1]]}
YM.armPt=armPt;
function limb(c,a,u0,u1,w0,w1,col,pat,ol){var n=16,pts=[],i,ww=function(i){return w0+(w1-w0)*i/n};for(i=0;i<=n;i++)pts.push(armPt(a,u0+(u1-u0)*i/n));
 c.lineCap='round';c.lineJoin='round';
 if(ol){for(i=0;i<n;i++){c.beginPath();c.moveTo(pts[i][0],pts[i][1]);c.lineTo(pts[i+1][0],pts[i+1][1]);c.lineWidth=ww(i)+ol*2;c.strokeStyle=OL;c.stroke()}}
 for(i=0;i<n;i++){c.beginPath();c.moveTo(pts[i][0],pts[i][1]);c.lineTo(pts[i+1][0],pts[i+1][1]);c.lineWidth=ww(i);c.strokeStyle=col;c.stroke()}
 if(pat&&pat!=='plain'){var pt=patOf(c,pat,col);for(i=0;i<n;i++){c.beginPath();c.moveTo(pts[i][0],pts[i][1]);c.lineTo(pts[i+1][0],pts[i+1][1]);c.lineWidth=ww(i);c.strokeStyle=pt;c.stroke()}}
 /* ince gölge çizgisi (tek parça) */
 var sm=0;for(i=0;i<=n;i++)sm+=ww(i);c.globalAlpha=.16;c.lineCap='butt';c.lineJoin='round';c.beginPath();for(i=0;i<=n;i++){if(i)c.lineTo(pts[i][0]+ww(i)*.26,pts[i][1]);else c.moveTo(pts[i][0]+ww(i)*.26,pts[i][1])}c.lineWidth=sm/(n+1)*.42;c.strokeStyle='#2a0030';c.stroke();c.globalAlpha=1;c.lineCap='round'}
YM.limb=limb;
function drawBody(c,st,X){var sk=SK[st.skin][0],sd=mix(sk,-.13);
 /* bacaklar */
 var leg='M259,462 C254,520 260,590 264,640 C262,670 258,700 264,730 C268,760 271,775 272,794 L298,794 C298,775 299,760 300,730 C301,700 301,670 301,640 C302,590 303,520 300,462 Z';
 paint(c,sym(leg),sk,null,{v:[460,800]});
 c.save();c.clip(sym(leg));c.globalAlpha=.25;c.fillStyle=sd;c.beginPath();c.ellipse(300,640,3,170,0,0,6.3);c.fill();c.restore();
 /* diz */
 [[283,652],[317,652]].forEach(function(p){c.globalAlpha=.18;c.fillStyle=sd;c.beginPath();c.ellipse(p[0],p[1],9,6,0,0,6.3);c.fill();c.globalAlpha=1});
 /* gövde */
 var tor='M300,250 L284,250 L262,258 L238,268 C240,312 248,350 258,392 C250,426 240,448 238,476 C255,490 280,494 300,494';
 paint(c,sym(tor),sk,null,{v:[250,500],ol:false});
 line(c,'M238,268 C240,312 248,350 258,392 C250,426 240,448 238,476',3);line(c,'M362,268 C360,312 352,350 342,392 C350,426 360,448 362,476',3);
 /* temel iç kıyafet (yalnızca üzerinde başka bir şey yoksa görünür) */
 /* boyun */
 var nk='M283,200 L283,258 C290,270 310,270 317,258 L317,200 Z';paint(c,P(nk),sk,null,{ol:false});
 c.save();c.clip(P(nk));c.fillStyle=sd;c.globalAlpha=.4;c.beginPath();c.ellipse(300,206,28,16,0,0,6.3);c.fill();c.restore();
 line(c,'M283,204 L283,258 C288,266 294,270 300,271',3);line(c,'M317,204 L317,258 C312,266 306,270 300,271',3);
 /* köprücük */
 c.globalAlpha=.3;line(c,'M262,268 Q282,278 296,274',1.6,sd);line(c,'M338,268 Q318,278 304,274',1.6,sd);c.globalAlpha=1;
 /* kollar */
 ['L','R'].forEach(function(k){limb(c,X.arms[k],0,1,27,17,sk,null,3)});
 return sk}
function hand(c,a,sk){var W=a[2],pr=armPt(a,.9),ang=Math.atan2(W[1]-pr[1],W[0]-pr[0]);c.save();c.translate(W[0],W[1]);c.rotate(ang-Math.PI/2);
 c.beginPath();c.ellipse(0,9,12,15,0,0,6.3);c.fillStyle=sk;c.fill();c.lineWidth=3;c.strokeStyle=OL;c.stroke();
 c.beginPath();c.ellipse(-10,5,4.5,8,.5,0,6.3);c.fillStyle=sk;c.fill();c.stroke();
 c.globalAlpha=.5;c.strokeStyle=OL;c.lineWidth=1.6;[-3,3].forEach(function(x){c.beginPath();c.moveTo(x,16);c.lineTo(x,24)});c.stroke();c.globalAlpha=1;c.restore()}
/* ---- yüz ---- */
var EYEC=[['#5b3a29','Kahve'],['#2f2a3a','Siyah'],['#3d7ae0','Mavi'],['#2fa37a','Yeşil'],['#8a5cf6','Mor'],['#d94f8a','Pembe'],['#e0902a','Ela'],['#7fc4d8','Buz']];
YM.lists.eyeC=EYEC;
YM.lists.eyeT=['Büyük','Kedi','Uykulu','Parlak'];
YM.lists.brow=['Yumuşak','Kavisli','Düz','Kalın'];
YM.lists.lipT=['Dolgun','Minik','Gülen','Öpücük'];
YM.lists.lipC=[['#e0527a','Gül'],['#ff7aa8','Şeker'],['#d92d4f','Kırmızı'],['#ff8a6b','Mercan'],['#b83280','Böğürtlen'],['#8f2d56','Şarap'],['#ff9fb2','Bebek'],['#c9786a','Nude'],['#9b5de5','Mor'],['#ff5c8a','Fuşya']];
YM.lists.shadow=[['#ff9fc7','Pembe'],['#c9a7ff','Lila'],['#7cc6ff','Mavi'],['#7de0c0','Nane'],['#ffd27a','Altın'],['#ff9a6b','Şeftali'],['#a0e86a','Limon'],['#e68cff','Orkide']];
YM.lists.blush=[['#ff8fa8','Pembe'],['#ff9a6b','Şeftali'],['#ff6f91','Gül'],['#e0707a','Mercan'],['#d994ff','Lila'],['#ffb3c1','Bebek']];
function eye(c,st,x,side,t,blink){var T=st.eyeT,H=[18,14,17,20][T],Wd=[17,18,17,18][T],tilt=[0,-.16,.05,0][T]*side,y=152,ic=st.eyeC,b=blink;
 c.save();c.translate(x,y);c.rotate(tilt);
 var hh=H*(1-b*.92);
 /* far */
 if(st.shadow){var g=c.createRadialGradient(0,-H*.6,2,0,-H*.6,Wd+12);g.addColorStop(0,st.shadow);g.addColorStop(1,st.shadow+'00');c.globalAlpha=.85;c.fillStyle=g;c.beginPath();c.ellipse(0,-H*.55,Wd+9,H*.85,0,0,6.3);c.fill();c.globalAlpha=1}
 if(b>.85){c.lineWidth=3.4;c.strokeStyle=OL;c.lineCap='round';c.beginPath();c.moveTo(-Wd,0);c.quadraticCurveTo(0,6,Wd,0);c.stroke()}
 else{
  c.beginPath();c.ellipse(0,0,Wd,hh,0,0,6.3);c.fillStyle='#fff';c.fill();
  c.save();c.beginPath();c.ellipse(0,0,Wd,hh,0,0,6.3);c.clip();
  var ir=Math.min(Wd*.78,hh*1.02);c.beginPath();c.arc(0,1,ir,0,6.3);var gi=c.createLinearGradient(0,-ir,0,ir);gi.addColorStop(0,mix(ic,-.35));gi.addColorStop(.55,ic);gi.addColorStop(1,mix(ic,.35));c.fillStyle=gi;c.fill();
  c.beginPath();c.arc(0,1,ir*.5,0,6.3);c.fillStyle='#1c0f22';c.fill();
  if(T===3){star(c,0,1,ir*.55,ir*.24,'#1c0f22',0)}
  c.beginPath();c.arc(-ir*.35,-ir*.38,ir*.3,0,6.3);c.fillStyle='#fff';c.fill();c.beginPath();c.arc(ir*.38,ir*.4,ir*.14,0,6.3);c.fill();
  if(T===2){c.fillStyle=SKtone(st);c.fillRect(-Wd-2,-hh-2,Wd*2+4,hh*.85);}
  c.restore();
  /* üst kirpik çizgisi */
  c.lineCap='round';c.lineWidth=T===1?4.2:3.6;c.strokeStyle=OL;c.beginPath();c.moveTo(-Wd-1,1);c.quadraticCurveTo(0,-hh*1.55-(T===2?-3:0),Wd+1,1);c.stroke();
  if(st.lash>0||T===1){c.lineWidth=2.4;var n=st.lash===2?4:2;for(var i=0;i<n;i++){var u=(i+.5)/n,lx=-Wd+u*Wd*2,ly=-hh*1.1*(1-Math.pow(2*u-1,2))*1.0;c.beginPath();c.moveTo(lx,ly);c.lineTo(lx+side*3+ (u-.5)*6,ly-6-(st.lash===2?3:0));c.stroke()}}
  if(T===1){c.lineWidth=3.4;c.beginPath();c.moveTo(Wd,0);c.lineTo(Wd+7*side*-1*-1,-5);c.stroke()}
  }
 c.restore()}
function SKtone(st){return SK[st.skin][0]}
function brow(c,st,x,side){var col=mix(st.hairC,-.28),T=st.brow,d;
 var dx=side;c.save();c.translate(x,0);c.scale(side,1);
 var p=[['M-14,128 Q0,121 15,129',3.4],['M-14,131 Q-2,118 16,126',3.4],['M-14,127 L15,126',3.8],['M-14,129 Q0,122 15,128',6]][T];
 c.beginPath();c.lineWidth=p[1];c.strokeStyle=col;c.lineCap='round';c.stroke(P(p[0]));c.restore()}
function mouth(c,st){var lc=st.lipC,T=st.lipT,y=199;
 if(T===0){var d='M281,196 Q291,190 300,194 Q309,190 319,196 Q310,212 300,212 Q290,212 281,196 Z';paint(c,P(d),lc,null,{lw:2.6});c.globalAlpha=.3;line(c,'M284,197 Q300,203 316,197',2,'#4a0a2a');c.globalAlpha=1;c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(300,205,7,2.2,0,0,6.3);c.fill()}
 else if(T===1){var d1='M288,197 Q294,193 300,195 Q306,193 312,197 Q306,206 300,206 Q294,206 288,197 Z';paint(c,P(d1),lc,null,{lw:2.4});c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(300,202,4,1.6,0,0,6.3);c.fill()}
 else if(T===2){var d2='M282,194 Q300,200 318,194 Q314,216 300,216 Q286,216 282,194 Z';c.fillStyle='#7a1f3d';c.fill(P(d2));c.save();c.clip(P(d2));c.fillStyle='#fff';c.fillRect(282,193,36,9);c.fillStyle='#ff8fa8';c.beginPath();c.ellipse(300,216,11,7,0,0,6.3);c.fill();c.restore();c.lineWidth=3.2;c.lineJoin='round';c.strokeStyle=lc;c.stroke(P(d2));c.lineWidth=1.3;c.strokeStyle=OL;c.stroke(P(d2))}
 else{c.beginPath();c.ellipse(300,200,8,6.5,0,0,6.3);c.fillStyle=lc;c.fill();c.lineWidth=2.4;c.strokeStyle=OL;c.stroke();c.beginPath();c.ellipse(300,200,3.6,2.8,0,0,6.3);c.fillStyle=mix(lc,-.5);c.fill();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.ellipse(296,197,2.2,1.4,0,0,6.3);c.fill()}}
var FACE='M240,138 C240,92 266,70 300,70 C334,70 360,92 360,138 C360,186 334,226 300,230 C266,226 240,186 240,138 Z';
function drawHead(c,st,t,blink,X){var sk=SK[st.skin][0],sd=mix(sk,-.14);
 /* kulaklar */
 [[239,156],[361,156]].forEach(function(p){c.beginPath();c.ellipse(p[0],p[1],9,13,0,0,6.3);c.fillStyle=sk;c.fill();c.lineWidth=3;c.strokeStyle=OL;c.stroke();c.globalAlpha=.3;c.beginPath();c.ellipse(p[0]+(p[0]<300?1:-1),p[1],3.5,6,0,0,6.3);c.fillStyle=sd;c.fill();c.globalAlpha=1});
 var fp=P(FACE);paint(c,fp,sk,null,{lw:3.2,flat:1});
 /* çene gölgesi ve yanak aydınlığı */
 c.save();c.clip(fp);c.globalAlpha=.1;c.fillStyle=sd;c.beginPath();c.ellipse(300,248,56,26,0,0,6.3);c.fill();c.globalAlpha=1;c.restore();
 /* allık */
 if(st.blush){[[266,181],[334,181]].forEach(function(p){var g=c.createRadialGradient(p[0],p[1],1,p[0],p[1],20);g.addColorStop(0,st.blush+'cc');g.addColorStop(1,st.blush+'00');c.fillStyle=g;c.beginPath();c.ellipse(p[0],p[1],21,14,0,0,6.3);c.fill()})}
 else{[[266,181],[334,181]].forEach(function(p){var g=c.createRadialGradient(p[0],p[1],1,p[0],p[1],18);g.addColorStop(0,'rgba(255,120,150,.28)');g.addColorStop(1,'rgba(255,120,150,0)');c.fillStyle=g;c.beginPath();c.ellipse(p[0],p[1],19,12,0,0,6.3);c.fill()})}
 /* çiller, ben, çıkartma */
 if(st.fr){c.fillStyle=mix(sk,-.35);c.globalAlpha=.75;[[262,170],[270,174],[258,176],[266,180],[338,170],[330,174],[342,176],[334,180],[300,168],[294,171],[306,171]].forEach(function(p){c.beginPath();c.arc(p[0],p[1],1.5,0,6.3);c.fill()});c.globalAlpha=1}
 if(st.mole){circ(c,322,198,2.2,'#3a1f1a')}
 if(st.stk===1)heart(c,347,166,6,'#ff5c8a',1.6);else if(st.stk===2)star(c,348,166,7,3,'#ffd23f',1.6);else if(st.stk===3){sparkle(c,350,164,8,'#7cc6ff',1);sparkle(c,342,176,4,'#fff',1)}
 /* gözler, kaşlar */
 eye(c,st,272,-1,t,blink);eye(c,st,328,1,t,blink);
 brow(c,st,273,-1);brow(c,st,327,1);
 /* burun */
 c.lineCap='round';c.lineWidth=2.4;c.strokeStyle=mix(sk,-.38);c.beginPath();c.moveTo(297,176);c.quadraticCurveTo(300,183,304,178);c.stroke();
 mouth(c,st)}
/* ---- ana çizim ---- */
function drawTop(c,st,X,list){list.forEach(function(k){var it=st.items[k];if(!it)return;var d=YM.item(k,it.id);if(d&&d.draw)d.draw(c,it.c,it.p,X)})}
YM.render=function(c,st,t,opt){opt=opt||{};var pose=POSES[st.pose]||POSES[0];var X={t:t,arms:{L:pose.L,R:pose.R},st:st,bag:null};
 var br=Math.sin(t*1.7)*1.4,blink=0,bt=t%4.2;if(bt<.16)blink=Math.sin(bt/.16*Math.PI);
 c.save();c.lineCap='round';c.lineJoin='round';
 if(!opt.noBg&&YM.BG[st.bg])YM.BG[st.bg].draw(c,t);
 else if(opt.noBg){}
 /* zemin gölgesi */
 c.fillStyle='rgba(40,10,60,.24)';c.beginPath();c.ellipse(300,836,128,15,0,0,6.3);c.fill();
 c.translate(300,836);c.scale(.94,.94);c.translate(-300,-836);
 drawTop(c,st,X,['back']);
 /* saç arka */
 var sw=Math.sin(t*1.1)*2.2;
 c.save();c.translate(300,236);c.scale(1.2,1.2);c.translate(-300,-236);c.save();c.translate(300,60);c.rotate(sw*.004);c.translate(-300,-60);var H=YM.HAIR[st.hair];if(H&&H.back)H.back(c,st,t);c.restore();c.restore();
 c.save();c.translate(0,br*.4);
 var sk=drawBody(c,st,X);
 drawTop(c,st,X,['shoes']);
 /* temel iç kıyafet */
 var hasTop=st.items.top||st.items.dress,hasBot=st.items.bottom||st.items.dress;
 if(!hasTop){paint(c,P(torsoD(360,'sweet')),'#ffd1e3',null,{lw:2.6});line(c,'M270,308 Q300,326 330,308',2,mix('#ffd1e3',-.2))}
 if(!hasBot){paint(c,sym('M300,438 L260,438 C254,452 250,466 252,478 C270,488 288,490 300,490'),'#ffd1e3',null,{lw:2.6})}
 drawTop(c,st,X,['bottom','dress','top']);
 ['L','R'].forEach(function(k){if(!st._sl||!st._sl[k])hand(c,X.arms[k],sk)});
 drawTop(c,st,X,['neck','hand','bag']);
 c.restore();
 c.save();c.translate(0,br*.8);c.translate(300,236);c.scale(1.2,1.2);c.translate(-300,-236);
 drawHead(c,st,t,blink,X);
 drawTop(c,st,X,['ear']);
 c.restore();
 c.save();c.translate(0,br*.8);c.translate(300,236);c.scale(1.2,1.2);c.translate(-300,-236);
 c.save();c.translate(300,60);c.rotate(sw*.004);c.translate(-300,-60);if(H&&H.front)H.front(c,st,t);c.restore();
 drawTop(c,st,X,['glasses','hat']);
 c.restore();
 c.restore()};
YM.item=function(slot,id){var l=YM.CAT[slot];if(!l)return null;for(var i=0;i<l.length;i++)if(l[i].id===id)return l[i];return null};
YM.defState=function(){return{skin:1,eyeC:'#5b3a29',eyeT:0,brow:0,lipC:'#e0527a',lipT:0,shadow:null,blush:null,lash:1,fr:0,mole:0,stk:0,hair:0,hairC:'#3b2a22',tipC:null,tieC:'#ff5c8a',pose:0,bg:0,items:{top:{id:'tisort',c:'#ff8fb8',p:'plain'},bottom:{id:'etek',c:'#4f7cff',p:'plain'},shoes:{id:'spor',c:'#ffffff',p:'plain'}}}};
})();
