/* ===================== YÜZ MÜHÜR: çizim ve döngü ===================== */
function lerp(a,b,t){return a+(b-a)*t}
function mix3(a,b,t){return[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]}
function U(p,n){return gl.getUniformLocation(p,n)}
var camSmooth=0,OV=$('ov'),oc=OV.getContext('2d'),oapCache={};
function setCamera(fw){if(window.__kdc){cam.x=__kdc[0];cam.y=__kdc[1];cam.z=__kdc[2];return}var gy=H(pl.x,pl.z),tx=pl.x,ty=gy+1.55+(pl.roll>0?-.5:0),tz=pl.z;
 if(pl.fp){cam.x=tx;cam.z=tz;cam.y=gy+1.65}
 else{var dist=4.8-Math.max(0,-cam.pit)*1.2;if(window.__ent)dist=3.3;else if(WORLD==='town'&&inHouse(pl.x,pl.z))dist=2.1;var px=tx-fw[0]*dist,py=ty-fw[1]*dist+.4,pz=tz-fw[2]*dist;if(window.__ent&&window.__entOff){var eo=window.__entOff*dist;px-=Math.cos(cam.yaw)*eo;pz-=Math.sin(cam.yaw)*eo}if(WORLD==='town'&&!window.__ent){var pin=inHouse(pl.x,pl.z),ox=px,oz=pz;for(var st=1;st<=12;st++){var f=st/12,qx=tx+(ox-tx)*f,qz=tz+(oz-tz)*f,bad=false;if(pin){for(var ci=0;ci<colliders.length;ci++){var cc=colliders[ci];if(cc[3]===undefined&&cc[2]<=1.1&&cc[2]>=.45&&Math.hypot(cc[0]-qx,cc[1]-qz)<cc[2]+.15&&Math.hypot(cc[0]-tx,cc[1]-tz)>cc[2]+.6){bad=true;break}}}else if(inHouse(qx,qz))bad=true;if(bad){var f2=Math.max(.12,(st-1.5)/12);px=tx+(ox-tx)*f2;pz=tz+(oz-tz)*f2;py=ty+(py-ty)*f2;break}}}
if(!window.__ent){var ox2=px,oy2=py,oz2=pz;for(var st2=1;st2<=10;st2++){var f3=st2/10,qx2=tx+(ox2-tx)*f3,qy2=ty+(oy2-ty)*f3,qz2=tz+(oz2-tz)*f3;if(qy2<H(qx2,qz2)+.35){var f4=Math.max(.2,(st2-1.4)/10);px=tx+(ox2-tx)*f4;pz=tz+(oz2-tz)*f4;py=ty+(oy2-ty)*f4;break}}}
var g=H(px,pz)+.45;if(py<g)py=g;cam.x=px;cam.z=pz;cam.y=py}
 if(shake>0){cam.x+=(Math.random()-.5)*shake*.4;cam.y+=(Math.random()-.5)*shake*.4;cam.z+=(Math.random()-.5)*shake*.4}}
function apFor(o){var key=o.id+'|'+o.k+'|'+o.arm+'|'+o.oath+'|'+(o.ap?1:0);var c=oapCache[o.id];if(c&&c.key===key)return c.ap;
 var base=o.ap?Object.assign({},PRES.basic.ap,o.ap):LOOKS[(o.k|0)%LOOKS.length];var ap=dress(base,o.arm|0,o.oath);oapCache[o.id]={key:key,ap:ap};return ap}
function drawEntities(){gl.bindVertexArray(evao);gl.uniform1f(uUl,1);var pulse=.75+.25*Math.sin(T*3);
 if(!pl.fp){var ys=H(pl.x,pl.z);flashT=pl.hurt>0?.5:0;
  if(!skPlayer(DT))drawHuman(AP,pl.x,ys,pl.z,pl.yaw,pl.ph*(pl.roll>0?2:1),pl.roll>0?1.6:pl.mv,pl.atk>0?(pl.skill?Math.min(1,pl.atk*1.2):pl.atk):0,pl.tier,pl.dead>0?.001+Math.max(0,1-pl.dead):(pl.roll>0?.85:1),false);flashT=0}
 /* NPC'ler */
 NPCL.forEach(function(n){var y=H(n.x,n.z),d=Math.hypot(pl.x-n.x,pl.z-n.z);var yaw=n.yaw;if(d<9)yaw=Math.atan2(pl.x-n.x,-(pl.z-n.z));if(!skNpc(n,n.x,y,n.z,yaw,DT))drawHuman(n.ap,n.x,y,n.z,yaw,0,0,0,n.id==='guard'?6:-1,1,false)});
 /* diğer oyuncular */
 var os=NET.near?NET.others():{},arr=[];for(var k in os)arr.push(os[k]);arr.sort(function(a,b){return Math.hypot(a.x-pl.x,a.z-pl.z)-Math.hypot(b.x-pl.x,b.z-pl.z)});
 arr.slice(0,26).forEach(function(o){if(o.dead)return;if(!skOther(o,DT))drawHuman(apFor(o),o.x,H(o.x,o.z),o.z,o.yaw,o.ph,o.mv,o.atk||0,o.tier,1,false)});
 mobs.forEach(function(m){if(Math.hypot(m.x-cam.x,m.z-cam.z)<95){if(!skMob(m,DT))drawMob(m);if(m.dead<=0&&m.elite&&!m.boss){var y=H(m.x,m.z)+2.5*m.s+.6;part('coneG',ch(tr(m.x,y+Math.sin(T*3)*.1,m.z),rX(3.14),sca(.25,.5,.25)),[1,.82,.2])}}});
 /* mermiler / efektler */
 projs.forEach(function(p){part('ballG',ch(tr(p.x,H(p.x,p.z)+1.1,p.z),sca(.32,.32,.32)),[p.c[0]*1.3+.2,p.c[1]*1.3+.2,p.c[2]*1.3+.2])});
 fx.forEach(function(e){if(e.t<0)return;var u=e.t/e.l,y=H(e.x,e.z)+.12;if(e.k==='sp'){var z=.12*(1-u)+.02;part('ballG',ch(tr(e.x,e.y,e.z),sca(z,z,z)),e.c);return}if(e.k==='nova')part('ballG',ch(tr(e.x,y,e.z),sca(9*u+.5,.07,9*u+.5)),[.8*(1-u)+.2,.55*(1-u)+.1,1]);else if(e.k==='spin')part('ballG',ch(tr(e.x,y,e.z),sca(4.8*u+.4,.06,4.8*u+.4)),[1,.95,.7]);else if(e.k==='boom')part('ballG',ch(tr(e.x,y,e.z),sca(e.r*(.6+.4*u),.09,e.r*(.6+.4*u))),[1,.45*(1-u)+.1,.1])});
 /* kapılar / ateş */
 if(WORLD==='town'){var gy=H(0,-49);part('boxG',ch(tr(0,gy+3,-48.9),sca(5.4,6,.25)),[.55*pulse+.1,.45*pulse+.1,1])}
 else{
  if(!FL.open)for(var bx=-6;bx<=6.1;bx+=2){var by=H(bx,-30.6);part('boxG',ch(tr(bx,by+3.2,-30.6),sca(.45,6.4,.45)),[.7*pulse,.25,1]);}
  if(!FL.open){var by2=H(0,-30.6);part('boxG',ch(tr(0,by2+2.2,-30.6),sca(13,.25,.25)),[.7*pulse,.25,1]);part('boxG',ch(tr(0,by2+4.6,-30.6),sca(13,.25,.25)),[.7*pulse,.25,1])}
  if(FL.bossDead){var py=H(0,-60);part('boxG',ch(tr(0,py+3.1,-60.1),sca(5.6,6.2,.25)),[.3*pulse,.9*pulse,1])}
  var ty=H(0,56);part('boxG',ch(tr(0,ty+2.7,56.1),sca(5.2,5.2,.25)),[.3,.7*pulse,.9]);
  var fy=H(SPAWNP[0],SPAWNP[1]);part('coneG',ch(tr(SPAWNP[0],fy+.2,SPAWNP[1]),sca(.75+.1*Math.sin(T*9),1.5+.35*Math.sin(T*7),.75)),[1,.5+.2*Math.sin(T*8),.12])}
 setIdent();gl.bindVertexArray(vao)}
function proj(vp,x,y,z){var cx=vp[0]*x+vp[4]*y+vp[8]*z+vp[12],cy=vp[1]*x+vp[5]*y+vp[9]*z+vp[13],cw=vp[3]*x+vp[7]*y+vp[11]*z+vp[15];if(cw<.1)return null;return[(cx/cw*.5+.5)*OV.width,(1-(cy/cw*.5+.5))*OV.height,cw]}
function tag(vp,x,y,z,txt,col,k,sub){var p=proj(vp,x,y,z);if(!p)return;oc.font='700 '+(12*k)+'px system-ui';oc.fillStyle=col||'#fff';oc.strokeStyle='rgba(0,0,0,.85)';oc.lineWidth=3*k;oc.strokeText(txt,p[0],p[1]);oc.fillText(txt,p[0],p[1]);if(sub){oc.font='600 '+(10*k)+'px system-ui';oc.fillStyle='#ffd98a';oc.strokeText(sub,p[0],p[1]-13*k);oc.fillText(sub,p[0],p[1]-13*k)}}
function drawOverlay(vp){if(window.__ent){oc.clearRect(0,0,OV.width,OV.height);return}if(OV.width!==cv.width||OV.height!==cv.height){OV.width=cv.width;OV.height=cv.height}oc.clearRect(0,0,OV.width,OV.height);var k=OV.height/620;oc.textAlign='center';oc.lineJoin='round';
 /* boss telegrafları */
 tels.forEach(function(t){if(t.t<=0)return;var u=Math.min(1,t.t/t.dur),y=H(t.x,t.z)+.15;
  if(t.k==='c'){var pts=[];for(var i=0;i<30;i++){var a=i/30*6.2832,p=proj(vp,t.x+Math.cos(a)*t.r,y,t.z+Math.sin(a)*t.r);if(!p)return;pts.push(p)}
   oc.beginPath();pts.forEach(function(p,i){i?oc.lineTo(p[0],p[1]):oc.moveTo(p[0],p[1])});oc.closePath();oc.fillStyle='rgba(255,60,40,'+(.12+.1*u)+')';oc.fill();oc.strokeStyle='rgba(255,90,60,.95)';oc.lineWidth=2.5*k;oc.stroke();
   var pts2=[];for(var i=0;i<30;i++){var a=i/30*6.2832,p=proj(vp,t.x+Math.cos(a)*t.r*u,y,t.z+Math.sin(a)*t.r*u);if(!p)return;pts2.push(p)}oc.beginPath();pts2.forEach(function(p,i){i?oc.lineTo(p[0],p[1]):oc.moveTo(p[0],p[1])});oc.closePath();oc.fillStyle='rgba(255,70,40,'+(.25+.3*u)+')';oc.fill()}
  else{var ax=t.x2-t.x,az=t.z2-t.z,L=Math.hypot(ax,az)||1,nx=-az/L*t.w,nz=ax/L*t.w,c4=[proj(vp,t.x+nx,y,t.z+nz),proj(vp,t.x2+nx,y,t.z2+nz),proj(vp,t.x2-nx,y,t.z2-nz),proj(vp,t.x-nx,y,t.z-nz)];if(c4.some(function(p){return !p}))return;
   oc.beginPath();c4.forEach(function(p,i){i?oc.lineTo(p[0],p[1]):oc.moveTo(p[0],p[1])});oc.closePath();oc.fillStyle='rgba(255,60,40,'+(.14+.3*u)+')';oc.fill();oc.strokeStyle='rgba(255,90,60,.95)';oc.lineWidth=2.5*k;oc.stroke()}});
 /* canavar barları */
 mobs.forEach(function(m){if(m.dead>0||m.boss||(m.hp>=m.mhp&&m.st===0&&Math.hypot(m.x-pl.x,m.z-pl.z)>14))return;var dd=Math.hypot(m.x-cam.x,m.z-cam.z);if(dd>30)return;var p=proj(vp,m.x,H(m.x,m.z)+2.2*m.s*.8+.5,m.z);if(!p)return;
  var w=(m.elite?74:54)*k,h=6*k;oc.fillStyle='rgba(0,0,0,.6)';oc.fillRect(p[0]-w/2-1,p[1]-1,w+2,h+2);oc.fillStyle=m.elite?'#ffb02e':'#e24a4a';oc.fillRect(p[0]-w/2,p[1],w*Math.max(0,m.hp/m.mhp),h);
  oc.font='700 '+(10.5*k)+'px system-ui';oc.fillStyle=m.elite?'#ffd98a':'#fff';oc.strokeStyle='rgba(0,0,0,.8)';oc.lineWidth=3*k;oc.strokeText(m.d.n,p[0],p[1]-4*k);oc.fillText(m.d.n,p[0],p[1]-4*k)});
 NPCL.forEach(function(n){var d=Math.hypot(n.x-cam.x,n.z-cam.z);if(d>26)return;tag(vp,n.x,H(n.x,n.z)+2.3,n.z,n.n,'#fff',k,n.role)});
 var os=NET.others(),arr=[];for(var q in os)arr.push(os[q]);arr.forEach(function(o){var d=Math.hypot(o.x-cam.x,o.z-cam.z);if(d>28||o.dead)return;tag(vp,o.x,H(o.x,o.z)+2.25,o.z,(o.oath?'☠ ':'')+(o.c?'['+o.c+'] ':'')+o.n+' · Sv'+o.lv,'#9ad0ff',k)});
 if(!pl.fp)tag(vp,pl.x,H(pl.x,pl.z)+2.25,pl.z,(S.oath?'☠ ':'')+(S.clan?'['+S.clan+'] ':'')+S.nick,'#ffe9a8',k);
 floats.forEach(function(f){var p=proj(vp,f.x,f.y,f.z);if(!p)return;oc.globalAlpha=Math.min(1,f.l*1.6);oc.font='800 '+(16*f.s*k)+'px system-ui';oc.fillStyle=f.c;oc.strokeStyle='rgba(0,0,0,.85)';oc.lineWidth=3.5*k;oc.strokeText(f.t,p[0],p[1]);oc.fillText(f.t,p[0],p[1]);oc.globalAlpha=1})}
/* ---- ana döngü ---- */
var last=performance.now(),fT=0,fN=0,saveT=0;
var DT=0;SKN.boot();
function frame(now){requestAnimationFrame(frame);var dt=Math.min(.05,(now-last)/1000);last=now;if(document.hidden)return;
 fT+=dt;fN++;if(fT>1){fpsEl.textContent=Math.round(fN/fT)+' fps · '+((NV/3)|0).toLocaleString('tr')+' üçgen';fT=0;fN=0}
 var gdt=(started&&!paused&&!DBG.manual)?dt:0;T+=dt;if(started){stepPlayer(gdt);NET.tick(dt);hud(dt);saveT+=dt;if(saveT>12){saveT=0;save()}}
 else if(window.__ent){pl.yaw+=((window.__entYaw!=null?window.__entYaw:pl.yaw)-pl.yaw)*Math.min(1,dt*6);cam.yaw=pl.yaw+Math.PI;cam.pit=-.04}else{cam.yaw+=dt*.05}
 /* gün/gece ve hava */
 var tod,ov,storm=false,R=FL.realm;
 if(WORLD==='floor'&&R){tod=R.tod;ov=R.rain;storm=!!R.storm}else{tod=(9+T/45)%24;ov=.22;if(tod>=22||tod<5)tod=5+((tod+3)%3)}
 var el=Math.sin((tod-6)/12*Math.PI),day=Math.max(0,Math.min(1,el*2.2+.2)),night=1-Math.max(0,Math.min(1,el*3+.5)),dusk=Math.max(0,1-Math.abs(el)*3.4)*(1-night*.2);
 var flash0=0;if(storm){loop.nextFl-=dt;if(loop.nextFl<0){loop.flash=1;loop.nextFl=3+Math.random()*7}}loop.flash=Math.max(0,loop.flash-dt*3.2);var fl=storm?(loop.flash>.5?loop.flash:(loop.flash>.25&&loop.flash<.4?.8:loop.flash*.4)):0;
 var sunD=(function(){var a=(tod-6)/12*Math.PI,v=[Math.cos(a)*.7,Math.max(Math.sin(a),-.2),.45],l=Math.hypot(v[0],v[1],v[2]);if(el<.02)v=[-.4,.5,.4],l=Math.hypot(v[0],v[1],v[2]);return v.map(function(k){return k/l})})();
 var clear=1-ov*.88;
 var sunC=mix3(mix3([1.25,.55,.25],[1.1,1.0,.88],Math.min(1,el*2.5)),[.05,.07,.14],night);sunC=sunC.map(function(k){return k*day*(.25+clear*.9)});if(el<0.02){sunC=[.16*night,.2*night,.34*night]}
 var skyC=mix3(mix3([.55,.55,.62],[.4,.56,.82],clear),[.12,.18,.38],night);skyC=mix3(skyC,[.9,.55,.4],dusk*.5*clear);
 var skyG=mix3(mix3([.2,.2,.2],[.28,.26,.22],clear),[.03,.04,.07],night);
 var fogC=mix3(mix3([.5,.54,.6],[.68,.78,.9],clear),[.03,.05,.1],night);fogC=mix3(fogC,[.92,.6,.42],dusk*.6*clear);fogC=mix3(fogC,[.3,.34,.4],ov*.5*(1-night));
 var fogD=lerp(WORLD==='floor'?.011:.0065,.034,ov)*(1+night*.15),lc=[1,.72,.38];
 if(WORLD==='floor'&&R){fogC=mix3(fogC,R.fog,.85);skyC=mix3(skyC,R.sky,.85);skyG=mix3(skyG,[R.ga[0]*.4,R.ga[1]*.4,R.ga[2]*.4],.5);fogD=R.fd*(1+ov*.7);lc=R.lc;sunC=sunC.map(function(k,i){return k*(.55+R.fog[i]*.6)})}
 var lampI=Math.max(0,night*1.1+ov*.6*day+.15);if(WORLD==='town'&&el>.4&&ov<.3)lampI=0;if(WORLD==='floor'&&R.lc&&(R.n==='Kristal Mağara'||R.n==='Magma Kalesi'))lampI=Math.max(lampI,1.2);
 /* kamera */
 var cp=Math.cos(cam.pit),fw=[Math.sin(cam.yaw)*cp,Math.sin(cam.pit),-Math.cos(cam.yaw)*cp];setCamera(fw);var eye=cam.y;
 var v=look([cam.x,eye,cam.z],fw,[0,1,0]),asp=cv.width/cv.height,fov=1.15,pj=persp(fov,asp,.1,300),vp=mul(pj,v.m);
 gl.viewport(0,0,cv.width,cv.height);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.clearColor(fogC[0],fogC[1],fogC[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.useProgram(pS);gl.disable(gl.DEPTH_TEST);gl.bindVertexArray(vaoE);
 gl.uniform3fv(U(pS,'uCr'),v.r);gl.uniform3fv(U(pS,'uCu'),v.u);gl.uniform3fv(U(pS,'uCf'),fw);gl.uniform2f(U(pS,'uTan'),Math.tan(fov/2)*asp,Math.tan(fov/2));
 gl.uniform3fv(U(pS,'uFog'),fogC);gl.uniform3fv(U(pS,'uSky'),skyC);gl.uniform3fv(U(pS,'uSunD'),sunD);gl.uniform3fv(U(pS,'uSunC'),sunC);gl.uniform1f(U(pS,'uT'),T);gl.uniform1f(U(pS,'uCloud'),.35+ov*.65);gl.uniform1f(U(pS,'uFlash'),fl);gl.uniform1f(U(pS,'uNight'),night);
 gl.drawArrays(gl.TRIANGLES,0,3);gl.enable(gl.DEPTH_TEST);
 function setCommon(p){gl.uniformMatrix4fv(U(p,'uVP'),false,vp);gl.uniform3f(U(p,'uCam'),cam.x,eye,cam.z);gl.uniform1f(U(p,'uT'),T);
  gl.uniform3fv(U(p,'uSunD'),sunD);gl.uniform3fv(U(p,'uSunC'),sunC);gl.uniform3fv(U(p,'uSky'),skyC);gl.uniform3fv(U(p,'uGnd'),skyG);gl.uniform3fv(U(p,'uFog'),fogC);gl.uniform1f(U(p,'uFogD'),fogD);gl.uniform1f(U(p,'uWet'),ov);gl.uniform1f(U(p,'uNight'),night);gl.uniform1f(U(p,'uFlash'),fl);gl.uniform1f(U(p,'uLampI'),lampI);gl.uniform3fv(U(p,'uLC'),lc);
  var near=lamps.map(function(l){return[l,Math.hypot(l[0]-cam.x,l[2]-cam.z)]}).sort(function(a,b){return a[1]-b[1]}).slice(0,6),f=new Float32Array(18);for(var i=0;i<6;i++){var q=near[i]?near[i][0]:[0,-999,0];f[i*3]=q[0];f[i*3+1]=q[1];f[i*3+2]=q[2]}
  var loc=gl.getUniformLocation(p,'uLamp[0]');if(loc)gl.uniform3fv(loc,f)}
 gl.useProgram(pW);setCommon(pW);setIdent();gl.bindVertexArray(vao);gl.drawArrays(gl.TRIANGLES,0,NV);
 DT=dt;drawEntities();SKN.flush(setCommon);gl.useProgram(pW);gl.bindVertexArray(vao);
 if(WP.gm>0){gl.useProgram(pG);setCommon(pG);gl.uniform1f(U(pG,'uRain'),ov);(function(){var a=new Float32Array(24);if(WORLD==='town')for(var i=0;i<HSL.length&&i<8;i++){a[i*3]=HSL[i][0];a[i*3+1]=HSL[i][1];a[i*3+2]=Math.hypot(HSL[i][2],HSL[i][3])+.6}gl.uniform3fv(U(pG,'uHs[0]'),a)})();gl.uniform4f(U(pG,'uHP'),WP.amp,WP.r0,WP.r1,WP.bowl);gl.uniform1f(U(pG,'uBS'),WP.bs);gl.uniform1f(U(pG,'uGM'),WP.gm);gl.uniform3fv(U(pG,'uGA'),WP.ga);gl.uniform3fv(U(pG,'uGB'),WP.gb);gl.bindVertexArray(vaoE);gl.disable(gl.CULL_FACE);gl.drawArraysInstanced(gl.TRIANGLES,0,3,GR)}
 if(ov>.02){gl.useProgram(pR);gl.uniformMatrix4fv(U(pR,'uVP'),false,vp);gl.uniform3f(U(pR,'uCam'),cam.x,eye,cam.z);gl.uniform1f(U(pR,'uT'),T);gl.uniform1f(U(pR,'uRain'),Math.min(1,.4+ov*.8));gl.uniform3f(U(pR,'uWind'),.35+(storm?.5:0),0,.2);gl.uniform1f(U(pR,'uCount'),Math.floor(9000*ov));gl.uniform3fv(U(pR,'uFog'),fogC);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.drawArrays(gl.LINES,0,18000);gl.depthMask(true);gl.disable(gl.BLEND)}
 drawOverlay(vp);
 var hurt=Math.min(1,pl.hurt*3),low=pl.hp/pl.mhp<.3?(.2+.1*Math.sin(T*6)):0;
 $('vg').style.background='radial-gradient(ellipse at center,transparent '+(night>.5?40:55)+'%,rgba(0,0,0,'+(.45+night*.3)+') 100%),radial-gradient(ellipse at center,transparent 45%,rgba(200,0,0,'+Math.max(hurt*.5,low)+') 100%)'}
var loop={nextFl:5,flash:0};
var GR=24000;
/* ---- başlangıç ---- */
load();recalc();if(S.qual){qi=S.qual;scale=[1,.75,.5][qi];resize()}else if(matchMedia('(pointer:coarse)').matches){qi=1;scale=.75;resize()}
pl.hp=pl.mhp;pl.st=pl.mst;ensureQ();startTown(false);cam.x=0;cam.z=9;
$('go').style.display='flex';
$('gob').onclick=function(){started=true;if(!S.cls&&!S.clsPick)setTimeout(function(){openPanel('inn','cls')},500);$('go').style.display='none';snd('pick');if(S.net)NET.start();
 try{var d=document.documentElement;if(d.requestFullscreen)d.requestFullscreen().then(function(){try{screen.orientation.lock('landscape').catch(function(){})}catch(e){}}).catch(function(){})}catch(e){}
 if(!S.tut){S.tut=1;setTimeout(function(){banner('Yüz Mühür','Kule Kapısı kuzeyde. Önce Tüccar ve Demirci’ye uğra.',5000);say('Kule Kapısı kuzeyde. Bekçiye yaklaş ve F tuşuna / düğmeye bas.','sys')},400)}save()};
window.addEventListener('beforeunload',save);document.addEventListener('visibilitychange',function(){if(document.hidden)save()});
window.__ym={DBG:DBG,S:S,pl:pl,FL:FL,get mobs(){return mobs},get tels(){return tels},get world(){return WORLD},enterFloor:enterFloor,startTown:startTown,doAttack:doAttack,doRoll:doRoll,usePotion:usePotion,NET:NET,cam:cam,recalc:recalc,openPanel:openPanel,act:act,killReward:killReward,dmgMob:dmgMob,doInteract:doInteract,step:function(n,dt){for(var i=0;i<n;i++){T+=dt;stepPlayer(dt)}},get started(){return started},setStarted:function(v){started=v}};
requestAnimationFrame(frame);
