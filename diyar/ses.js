/* Yaxest Diyarı — ses: efektler + sakin müzik (WebAudio, dosya yok) */
(function(){
var AC=null,MG=null,SFX=null,MUS=null,mode=2,started=false,lastT={};
try{var sv=localStorage.getItem('yd-ses');if(sv!==null)mode=+sv}catch(e){}
function $(i){return document.getElementById(i)}
function init(){
  if(AC){if(AC.state==='suspended')AC.resume();return true}
  var A=window.AudioContext||window.webkitAudioContext;if(!A)return false;
  try{AC=new A()}catch(e){return false}
  var cp=AC.createDynamicsCompressor();cp.connect(AC.destination);
  MG=AC.createGain();MG.gain.value=.9;MG.connect(cp);
  SFX=AC.createGain();SFX.gain.value=.55;SFX.connect(MG);
  MUS=AC.createGain();MUS.gain.value=.22;MUS.connect(MG);
  return true}
function tone(f,t,d,g,o,dest){o=o||{};var os=AC.createOscillator(),e=AC.createGain();os.type=o.type||'sine';os.frequency.setValueAtTime(f,t);
  if(o.slide)os.frequency.exponentialRampToValueAtTime(Math.max(20,o.slide),t+d);
  e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(g,t+(o.a||.005));e.gain.exponentialRampToValueAtTime(.0001,t+d);
  var n=os;if(o.lp){var l=AC.createBiquadFilter();l.type='lowpass';l.frequency.value=o.lp;os.connect(l);n=l}
  n.connect(e);e.connect(dest||SFX);os.start(t);os.stop(t+d+.05)}
function noise(t,d,g,f,type){var s=AC.createBufferSource(),b=AC.createBuffer(1,Math.max(1,AC.sampleRate*d|0),AC.sampleRate),dd=b.getChannelData(0);
  for(var i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;s.buffer=b;var fl=AC.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.value=f||1200;
  var e=AC.createGain();e.gain.setValueAtTime(g,t);e.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(e);e.connect(SFX);s.start(t)}
function mtof(m){return 440*Math.pow(2,(m-69)/12)}
var FX={
  click:function(t){tone(520,t,.05,.05,{slide:360,type:'triangle'})},
  swing:function(t){noise(t,.12,.10,1800,'bandpass');tone(260,t,.1,.04,{slide:110,type:'sawtooth',lp:900})},
  hit:function(t){noise(t,.07,.14,700,'lowpass');tone(170,t,.1,.12,{slide:70,type:'square',lp:700})},
  crit:function(t){FX.hit(t);tone(880,t,.18,.07,{slide:1320,type:'triangle'})},
  kill:function(t){tone(330,t,.16,.09,{slide:660,type:'triangle'});tone(495,t+.07,.18,.08,{slide:880,type:'triangle'})},
  skill:function(t){noise(t,.25,.09,900,'bandpass');tone(220,t,.28,.08,{slide:880,type:'sawtooth',lp:1500})},
  hurt:function(t){tone(190,t,.22,.16,{slide:80,type:'sawtooth',lp:600});noise(t,.1,.08,500,'lowpass')},
  coin:function(t){tone(1318,t,.09,.06,{type:'square',lp:3000});tone(1760,t+.07,.16,.06,{type:'square',lp:3000})},
  loot:function(t){[72,76,79].forEach(function(m,i){tone(mtof(m),t+i*.07,.3,.07,{type:'triangle'})})},
  level:function(t){[60,64,67,72,76,79].forEach(function(m,i){tone(mtof(m),t+i*.09,.55,.09,{type:'triangle'});tone(mtof(m)*2,t+i*.09,.3,.03)})},
  die:function(t){[64,62,59,55].forEach(function(m,i){tone(mtof(m),t+i*.22,.7,.11,{type:'sawtooth',lp:700})})},
  splash:function(t){noise(t,.3,.12,900,'lowpass');tone(500,t,.15,.05,{slide:200})},
  bite:function(t){tone(900,t,.08,.1,{type:'square',lp:2500});tone(900,t+.12,.12,.1,{type:'square',lp:2500})},
  catch:function(t){[67,71,74,79].forEach(function(m,i){tone(mtof(m),t+i*.08,.35,.08,{type:'triangle'})})},
  boss:function(t){tone(70,t,.8,.2,{slide:40,type:'sawtooth',lp:300});noise(t,.6,.08,200,'lowpass')}
};
function sfx(n,gap){if(mode<1||!AC||document.hidden||!FX[n])return;var now=performance.now();if(now-(lastT[n]||0)<(gap||60))return;lastT[n]=now;try{FX[n](AC.currentTime+.005)}catch(e){}}
/* ---- müzik ---- */
var SCALE={w:[0,2,4,7,9],d:[0,3,5,7,10]},mT=0,step=0,root=50,cur='w';
function musTick(){
  if(!AC||mode<2||document.hidden||AC.state!=='running')return;
  var t=AC.currentTime;if(mT<t)mT=t+.05;
  while(mT<t+.6){var sc=SCALE[cur];
    if(step%8===0){var r=root+(cur==='d'?-2:0);tone(mtof(r-12),mT,3.4,.07,{type:'sine',a:.6,lp:500},MUS);tone(mtof(r),mT,3.4,.03,{type:'triangle',a:.8,lp:900},MUS);tone(mtof(r+sc[2]),mT,3.4,.025,{type:'sine',a:.9},MUS)}
    if(Math.random()<.55){var n=root+12+sc[(Math.random()*5)|0]+(Math.random()<.25?12:0);tone(mtof(n),mT,1.4,.045,{type:'triangle',a:.02,lp:2200},MUS)}
    mT+=.42;step++}}
function area(){var G=window.__yd&&window.__yd.G;var c=G&&G.mode==='dungeon'?'d':'w';if(c!==cur){cur=c;root=c==='d'?45:50}}
/* ---- oyun durumunu izle ---- */
var pv={};
function watch(){
  if(!AC||mode<1)return;var Y=window.__yd;if(!Y)return;var G,P;try{G=Y.G;P=Y.P}catch(e){return}if(!G||!P)return;
  area();
  if(G.swT>0&&!(pv.sw>0))sfx('swing',120);pv.sw=G.swT;
  if(G.cd)for(var i=0;i<4;i++){if(G.cd[i]>0&&!(pv['c'+i]>0))sfx('skill',80);pv['c'+i]=G.cd[i]}
  if(pv.hp!=null&&G.hp<pv.hp-0.5&&!(G.dead>0))sfx('hurt',250);pv.hp=G.hp;
  if(G.dead>0&&!(pv.dead>0))sfx('die',500);pv.dead=G.dead;
  if(pv.lv!=null&&P.lv>pv.lv)sfx('level',800);pv.lv=P.lv;
  if(pv.gold!=null&&P.gold>pv.gold)sfx('coin',150);pv.gold=P.gold;
  var ms=(G.mode==='dungeon'&&G.dg?G.dg.mons:G.mons)||[];
  for(var j=0;j<ms.length;j++){var m=ms[j];if(!m)continue;
    if(m.dead&&!m._sd){m._sd=1;if(Math.abs(m.x-G.px)<700&&Math.abs(m.y-G.py)<700)sfx(m.boss?'boss':'kill',90)}
    else if(m.hit>=4.5&&!m._sh){m._sh=1;if(Math.abs(m.x-G.px)<500&&Math.abs(m.y-G.py)<500)sfx('hit',70)}
    else if(m.hit<3)m._sh=0}}
/* ---- olaylar ---- */
function unlock(){if(started)return;if(init()){started=true;mT=0}}
['pointerdown','keydown','touchstart'].forEach(function(e){addEventListener(e,function(){unlock();if(AC&&AC.state==='suspended')AC.resume()},{passive:true})});
document.addEventListener('click',function(e){var t=e.target&&e.target.closest&&e.target.closest('button,.ib,.tab,.btn,.nb');if(t&&!t.closest('#dkses'))sfx('click',40)},true);
function logWatch(){var l=$('log');if(!l)return setTimeout(logWatch,1500);
  new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){var s=(n.textContent||'');if(/düştü|buldun|kazandın|aldın|Efsane|bulundu|çıktı/i.test(s))sfx('loot',200)})})}).observe(l,{childList:true})}
/* ---- ses düğmesi ---- */
var ICON=['🔇','🔉','🔊'],TITLE=['Ses kapalı','Yalnız efekt','Efekt + müzik'];
function btn(){var bar=$('dkbar');if(!bar){return setTimeout(btn,800)}if($('dkses'))return;
  var b=document.createElement('button');b.id='dkses';b.type='button';b.className='dkb';
  b.style.cssText='min-width:34px;height:34px;border-radius:10px;border:1px solid rgba(255,255,255,.25);background:rgba(20,20,30,.72);color:#fff;font-size:17px;cursor:pointer;margin-left:4px';
  function show(){b.textContent=ICON[mode];b.title=TITLE[mode];b.setAttribute('aria-label',TITLE[mode])}show();
  b.onclick=function(e){e.stopPropagation();mode=(mode+1)%3;try{localStorage.setItem('yd-ses',mode)}catch(x){}show();unlock();if(AC){if(AC.state==='suspended')AC.resume();SFX.gain.value=mode?.55:0;MUS.gain.value=mode>1?.22:0;mT=0}if(mode)sfx('click',0);var G=window.__yd&&window.__yd.say;if(G)G(TITLE[mode],'x')};
  bar.appendChild(b)}
setInterval(function(){try{watch()}catch(e){}},50);setInterval(musTick,250);
document.addEventListener('visibilitychange',function(){if(AC){if(document.hidden)AC.suspend();else AC.resume();mT=0}});
btn();logWatch();
window.YSes={sfx:sfx,mode:function(){return mode}};
})();
