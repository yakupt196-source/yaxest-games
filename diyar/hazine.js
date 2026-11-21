/* Yaxest Diyarı: günlük Hazine Avı. Herkes için aynı gizli nokta; sıcak/soğuk pusulasıyla bul, kaz. window.YTr */
(function(){
'use strict';
var D,Y,P,G,tk=0,pos=null,posDay=-1;
function $(i){return document.getElementById(i)}
function day(){return Math.floor(Date.now()/864e5)}
function ht(){P.ht=P.ht||{d:0,f:0,n:0,last:-9,st:0};if(P.ht.d!==day()){P.ht.d=day();P.ht.f=0}return P.ht}
function spot(){var d=day();if(pos&&posDay===d)return pos;var TS=Y.TS,a=Y.hash(d,1,911)*6.2832,r=22+Y.hash(d,2,911)*26,tx=Math.round(Y.CX+Math.cos(a)*r),ty=Math.round(Y.CY+Math.sin(a)*r),best=null;
  for(var q=0;q<10&&!best;q++)for(var dy=-q;dy<=q&&!best;dy++)for(var dx=-q;dx<=q;dx++){var x=tx+dx,y=ty+dy,z=Y.zoneAt(x,y);if(z!==3&&z!==4&&!Y.nodeAt(x,y)){best={x:(x+.5)*TS,y:(y+.5)*TS};break}}
  posDay=d;return pos=best||{x:(tx+.5)*TS,y:(ty+.5)*TS}}
function dTiles(){var s=spot();return Math.hypot(G.px-s.x,G.py-s.y)/Y.TS}
function warm(d){return d<1.6?['🔥 Tam üstündesin!','#ff6b3a']:d<8?['🔥 Yanıyor','#ff6b3a']:d<18?['♨️ Sıcak','#ff9a3a']:d<32?['🌤 Ilık','#ffd23f']:d<55?['🌬 Serin','#8fd6ff']:['❄️ Soğuk','#7ab0ff']}
function dirTxt(){var s=spot(),dx=s.x-Y.CX*Y.TS,dy=s.y-Y.CY*Y.TS,a=Math.atan2(dy,dx)*180/Math.PI,n=['doğusunda','güneydoğusunda','güneyinde','güneybatısında','batısında','kuzeybatısında','kuzeyinde','kuzeydoğusunda'];return'Kasabanın '+n[((Math.round(a/45)%8)+8)%8]}
function say(t){D.say(t,'sys')}
function dig(){var h=ht();if(h.f||dTiles()>=1.6||G.mode!=='world'||G.dead>0)return;h.f=1;h.n++;h.st=h.last===day()-1?h.st+1:1;h.last=day();
  var lv=P.lv,bonus=1+.1*Math.min(h.st-1,10),gold=Math.round((120+lv*30)*bonus),xp=lv*40,got=['🪙'+gold];P.gold+=gold;D.giveXp(xp);
  [['crystal',1+Math.floor(Math.random()*2)],['wood',10+Math.floor(Math.random()*10)],['stone',8+Math.floor(Math.random()*10)]].forEach(function(m){if(Y.MATS[m[0]]){P[m[0]]=(P[m[0]]||0)+m[1];got.push(Y.MATS[m[0]].ic+m[1])}});
  if(window.YR&&Math.random()<.5){var pool=Object.keys(YR.R).filter(function(k){return YR.R[k].r<=(lv>=10?2:1)}),id=pool[Math.floor(Math.random()*pool.length)];P.rn[id]=(P.rn[id]||0)+1;got.push('🔮 '+YR.R[id].n+' rünü!')}
  D.floatTxt(G.px,G.py-70,'⛏ HAZİNE!','#ffd23f');say('🏆 Günün hazinesini buldun! '+got.join(' · ')+(h.st>1?' · seri '+h.st+' gün (+%'+Math.min(100,(h.st-1)*10)+')':''));D.saveNow();ui();if(window.YT)try{YT.ev('tr')}catch(e){}
  if(window.YNet&&YNet.on&&YNet.on()&&YNet.sendChat){}}
function ui(){var c=$('htr');if(!c||!G||!P)return;if(G.mode!=='world'){c.style.display='none';return}var h=ht();c.style.display='block';var mm=$('mm');if(mm)c.style.top=Math.round(mm.getBoundingClientRect().bottom+6)+'px';
  if(h.f){c.textContent='✅ Hazine bulundu · seri '+h.st;c.style.borderColor='#5be39a';c.classList.remove('hot');return}
  var d=dTiles(),w=warm(d);c.textContent='🧭 '+(d<1.6?'⛏ KAZ!':w[0]);c.style.borderColor=w[1];c.classList.toggle('hot',d<8)}
function open(){if(!G||G.mode!=='world')return;D.openPan('p-npc');$('npt').innerHTML='🧭 Günün Hazinesi';draw();if(window.YT)try{YT.ev('trOpen')}catch(e){}}
function draw(){var h=ht(),d=dTiles(),w=warm(d),s='<p class="sub">Her gün dünyada gizli bir hazine saklanır, <b>herkes için aynı yerde</b>. Pusula sıcak/soğuk söyler: yaklaştıkça ısınırsın. Çok yakınken ⛏ <b>Kaz</b> düğmesi çıkar. Her gece yenilenir.</p>';
  s+='<div class="it"><div class="t"><b>İpucu</b><br><small>Bugünün hazinesi <b>'+dirTxt()+'</b>, yaklaşık 20–50 kare ötede.</small></div></div>';
  s+='<div class="it"><div class="t"><b>Durum</b><br><small>'+(h.f?'✅ Bugünkü hazineyi buldun!':'<span style="color:'+w[1]+'">'+w[0]+'</span>')+'</small></div>'+(h.f?'':'<button class="btn" id="trdg" type="button" style="min-height:34px" '+(d<1.6?'':'disabled')+'>⛏ Kaz</button>')+'</div>';
  s+='<div class="it"><div class="t"><small>Toplam bulunan: <b>'+h.n+'</b> · Üst üste gün serisi: <b>'+h.st+'</b> (her seri günü +%10 ödül, en çok +%100)</small></div></div>';
  s+='<p class="sub" style="font-size:.76rem">Ödül: altın, kristal, malzeme ve %50 şansla 🔮 rün. Arkadaşlarınla “Ilık mı Sıcak mı?” diye konuşabilirsiniz!</p>';
  $('npc').innerHTML=s;var b=$('trdg');if(b)b.onclick=function(){dig();draw()}}
function drawW(ctx,Gx,t,Px){if(!Gx||!Px||Gx.mode!=='world'||!Y)return;if(!P||!G)return;var h=ht();if(h.f)return;var s=spot(),d=dTiles();if(d>14)return;
  var a=Math.max(.15,1-d/14);ctx.save();ctx.globalAlpha=a;for(var i=0;i<5;i++){var an=t*1.4+i*1.26,rr=14+Math.sin(t*2+i)*8,x=s.x+Math.cos(an)*rr,y=s.y+Math.sin(an)*rr*.6-6,z=2+Math.abs(Math.sin(t*3+i))*3;ctx.fillStyle='#ffe58a';ctx.beginPath();ctx.moveTo(x,y-z*2);ctx.lineTo(x+z,y);ctx.lineTo(x,y+z*2);ctx.lineTo(x-z,y);ctx.closePath();ctx.fill()}
  if(d<1.6){var gr=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,48);gr.addColorStop(0,'rgba(255,210,63,.75)');gr.addColorStop(1,'rgba(255,210,63,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(s.x,s.y,48,0,6.2832);ctx.fill();ctx.font='28px system-ui';ctx.textAlign='center';ctx.fillText('💰',s.x,s.y+8)}ctx.restore()}
function init(api){D=api;Y=D.Y;P=D.P;G=D.G;clearInterval(tk);ht();var c=$('htr');if(c)c.onclick=function(){if(!ht().f&&dTiles()<1.6){dig()}else open()};tk=setInterval(function(){if(D.G){G=D.G;ui()}},600)}
window.YTr={init:init,open:open,draw:drawW,dig:dig,dbg:function(){return{spot:spot(),d:dTiles()}}};
})();
