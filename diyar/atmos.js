/* Yaxest Diyarı: bize özgü atmosfer. Bölgeye göre renk tonu, vinyet, süzülen yaprak/toz ve geceleri ateş böcekleri. window.YAtm */
(function(){
'use strict';
var cv,x,vg,gr,W=0,H=0,P=[],last=0,zone=-9,on=0,dpr=1;
var GR={4:'rgba(255,170,60,.16)',0:'rgba(255,225,110,.12)',1:'rgba(30,150,80,.18)',2:'rgba(80,110,200,.18)'};
function $(i){return document.getElementById(i)}
function night(){try{return YX2.dbg.hourP()<8}catch(e){return false}}
function size(){if(!cv)return;dpr=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
function mk(){return{x:Math.random()*W,y:Math.random()*H,v:6+Math.random()*14,ph:Math.random()*6.28,s:2+Math.random()*3,r:Math.random()*6.28,k:Math.random()}}
function frame(ts){if(!on)return;requestAnimationFrame(frame);var d=window.__yd,G=d&&d.G;if(!G||!d.P||G.mode!=='world'){x.clearRect(0,0,W,H);gr.style.background='transparent';return}
  var dt=Math.min(.05,(ts-last)/1000||.016);last=ts;var z=d.Y.zoneAt(Math.floor(G.px/d.Y.TS),Math.floor(G.py/d.Y.TS));if(z!==zone){zone=z;gr.style.background=GR[z]||GR[0]}
  var nt=night(),t=ts/1000;x.clearRect(0,0,W,H);
  for(var i=0;i<P.length;i++){var p=P[i];p.y+=(nt?-p.v*.35:p.v)*dt;p.x+=Math.sin(t*.7+p.ph)*18*dt+(nt?0:9*dt);
    if(p.y>H+10)p.y=-10;if(p.y<-10)p.y=H+10;if(p.x>W+10)p.x=-10;if(p.x<-10)p.x=W+10;
    if(nt){var a=.35+.65*Math.abs(Math.sin(t*1.6+p.ph)),g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.s*4);g.addColorStop(0,'rgba(255,240,130,'+a+')');g.addColorStop(1,'rgba(255,240,130,0)');x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,p.s*4,0,6.3);x.fill()}
    else{p.r+=dt*1.5;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.globalAlpha=.55;x.fillStyle=z===1?(p.k>.5?'#7bd36a':'#e0b04a'):z===2?'#cfd6e8':z===4?'#ffd98a':'#f4e08a';x.beginPath();x.ellipse(0,0,p.s*1.5,p.s*.6,0,0,6.3);x.fill();x.restore()}}}
function init(){cv=$('atm');vg=$('vig');gr=$('grade');if(!cv)return;x=cv.getContext('2d');size();addEventListener('resize',size);for(var i=0;i<26;i++)P.push(mk());
  cv.style.display=vg.style.display=gr.style.display='block';on=1;requestAnimationFrame(frame)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.YAtm={};
})();
