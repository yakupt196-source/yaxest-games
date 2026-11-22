/* Yaxest Diyarı: KASABA KUŞATMASI. Her saat başı :20'de surların dışından saldırı dalgaları gelir; kapıları koru,
   kule okçuları yardım eder, son dalgada Kristal Bekçi saldırır. Dalga takvimi saate bağlıdır: herkes aynı anda savunur. window.YKU */
(function(){
'use strict';
var D,Y,P,G,TS=48,S0={id:-1,wv:0,gate:100,kills:0,max:0,over:0,res:'',fin:0},WAVES=6,GAP=85e3,START=20*60e3,TIMEOUT=30*60e3,arrows=[],emb=[],towerT=0,hud=null,lastChip='',flash=0,evT=0;
var GATES=[[0,-1,'Kuzey'],[1,0,'Doğu'],[0,1,'Güney'],[-1,0,'Batı']];
function now(){return Date.now()}
function sid(n){return Math.floor((n||now())/3600e3)}
function rel(n){return(n||now())-sid(n)*3600e3}
/* 0 = beklemede, 1 = hazırlık (son 6 dk), 2 = kuşatma */
function phase(n){var r=rel(n);if(r>=START&&r<TIMEOUT)return 2;if(r>=START-6*60e3&&r<START)return 1;return 0}
function cen(){return{x:Y.CX*TS,y:Y.CY*TS}}
function wallR(){return(window.YW&&YW.R)||17.4*TS}
function gatePt(i){var c=cen(),g=GATES[i],r=wallR()+TS*1.6;return{x:c.x+g[0]*r,y:c.y+g[1]*r}}
function inWorld(){return G&&G.mode==='world'&&G.dead<=0}
function near(){var c=cen();return G&&Math.hypot(G.px-c.x,G.py-c.y)<TS*44}
function mine(){return G.mons.filter(function(m){return m.sg&&!m.dead})}
function reset(id){S0={id:id,wv:0,gate:100,kills:0,max:0,over:0,res:'',fin:0,hit:0};G.mons=G.mons.filter(function(m){return!m.sg});arrows.length=0}
function horn(){try{if(window.YSes&&YSes.sfx){YSes.sfx('hurt',90);setTimeout(function(){YSes.sfx('loot',60)},220)}}catch(e){}}
function say(t){D.say(t,'sys')}
/* ---- dalga ---- */
function water(x,y){return Y.zoneAt(Math.floor(x/TS),Math.floor(y/TS))===3}
function pathClear(x,y,gx,gy){return !water(x,y)}
function clearSpawn(gi,gp,g){var x=0,y=0;for(var t=0;t<14;t++){var d=t<10?420+Math.random()*220:160+Math.random()*120,pr=(Math.random()-.5)*(t<10?170:60);x=gp.x+g[0]*d-g[1]*pr;y=gp.y+g[1]*d+g[0]*pr;if(pathClear(x,y,gp.x,gp.y))return{x:x,y:y}}return{x:gp.x+g[0]*(420+Math.random()*200),y:gp.y+g[1]*(420+Math.random()*200)}}
function spawnWave(k){var lv=Math.max(3,P.lv),cnt=k>=WAVES?10:4+k*3,ng=Math.min(4,Math.max(1,Math.ceil(k*.75))),idx=[0,1,2,3].sort(function(){return Math.random()-.5}).slice(0,ng),pool=lv<8?['wolf','boar','fox']:lv<18?['wolf','boar','skel','fox']:['skel','boar','golem','wolf'],made=0;
  for(var i=0;i<cnt;i++){var gi=idx[i%ng],g=GATES[gi],gp=gatePt(gi),sp0=clearSpawn(gi,gp,g),x=sp0.x,y=sp0.y,tp=pool[Math.floor(Math.random()*pool.length)];
    if(k===4&&i===0)tp='alpha';var m=window.__yd.mkMon(tp,lv+(k>=4?1:0),x,y,null);m.sg=1;m.gx=gp.x;m.gy=gp.y;m.gi=gi;m.hp=m.max=Math.round(m.max*.8);m.dmg=m.dmg*.7;G.mons.push(m);made++}
  if(k>=WAVES){var bi=idx[0],bp=gatePt(bi),bg=GATES[bi],b=window.__yd.mkMon('guardian',lv+2,bp.x+bg[0]*520,bp.y+bg[1]*520,null);b.sg=1;b.gx=bp.x;b.gy=bp.y;b.gi=bi;b.n='Kuşatma Titanı';G.mons.push(b);made++}
  S0.max+=made;S0.wv=k;flash=1;horn();try{if(window.YF)YF.shake(k>=WAVES?10:4,.5)}catch(e){}
  var gn=idx.map(function(i){return GATES[i][2]}).join(' · ');
  D.banner(k>=WAVES?'⚔ SON DALGA: KUŞATMA TİTANI!':'⚔ Dalga '+k+'/'+WAVES,gn+' kapı'+(ng>1?'ları':'sı')+' saldırı altında');say(k>=WAVES?'🐉 Kuşatma Titanı kapıya yürüyor! Kasabayı koru!':'⚔ Dalga '+k+': '+gn+' kapısından düşman geliyor.')}
function gateHit(m){var d=m.boss?1.8:.4;S0.hit=1;S0.gate=Math.max(0,S0.gate-d);try{D.addFx({k:'ring',x:m.gx,y:m.gy,r:34,c:'#ff6a4a',l:.3})}catch(e){}
  if(S0.gate<=0&&!S0.over)finish(false)}
function finish(win){if(S0.over)return;S0.over=1;S0.res=win?'w':'l';var left=mine();
  if(!win){left.forEach(function(m){m.dead=1;var i=G.mons.indexOf(m);if(i>=0)G.mons.splice(i,1)});D.banner('🏚 Kapı düştü!','Saldırganlar surların içine sızmadan çekildi. Bir dahaki saate hazırlan.');say('🏚 Kuşatma kaybedildi: kapılar yıkıldı. Ödül yok.');horn();return}
  var K=P.ku=P.ku||{id:-1,n:0,d:'',best:0},part=S0.kills>=6;
  if(!part){D.banner('Kasaba kurtuldu!','Ödül için en az 6 düşman devirmelisin.');say('🛡 Kuşatma bitti. Ödül için en az 6 düşman devirmen gerekir (devirdiğin: '+S0.kills+').');return}
  if(K.id===S0.id)return;K.id=S0.id;K.n=(K.n|0)+1;var pct=Math.round(S0.gate),gold=Math.round(P.lv*22*(.4+.6*pct/100)*(1+Math.min(1,S0.kills/40)*.5)),xp=Math.round(P.lv*30);
  P.gold+=gold;try{D.giveXp(xp)}catch(e){}var ex=[];
  var dk=new Date().toISOString().slice(0,10);if(K.d!==dk){K.d=dk;ex.push('🎁 günün ilk zaferi: Nadir sandık');try{YX3.giveBox(2,'kuşatma')}catch(e){}}
  if(K.n%3===0){ex.push('🎁 her 3 zafer: Ender sandık');try{YX3.giveBox(1,'kuşatma')}catch(e){}}
  K.best=Math.max(K.best|0,pct);D.saveNow();D.floatTxt(G.px,G.py-60,'+🪙'+gold,'#ffd23f');try{if(window.YSes&&YSes.sfx)YSes.sfx('level',100)}catch(e){}
  D.banner('🏰 KASABA KURTULDU!','Kapı %'+pct+' · +🪙'+gold+' · +'+xp+' XP');say('🏰 Kuşatma kazanıldı! Kapı sağlamlığı %'+pct+', devirdiğin '+S0.kills+', +🪙'+gold+', +'+xp+' XP'+(ex.length?' · '+ex.join(' · '):'')+' · Toplam zafer: '+K.n);
  for(var i=0;i<14;i++)setTimeout(function(){try{if(window.YSN)YSN.launch(1)}catch(e){}},i*260)}
/* ---- dışa açık ---- */
function ai(m,dt){G=D.G;
  if(S0.over&&!m.dead){m.sx=m.x;m.sy=m.y;return 0}
  var dp=Math.hypot(G.px-m.x,G.py-m.y),chase=!D.inTownF()&&G.dead<=0&&(dp<230||m.hit>0||m.taunt>0);
  if(chase){m.sx=m.x;m.sy=m.y;return 0}
  var dd=Math.hypot(m.gx-m.x,m.gy-m.y),sp=m.sp*(m.slow>0?.5:1)*.95;
  if(dd>78){var ox=m.x,oy=m.y,vx=(m.gx-m.x)/dd*sp*dt,vy=(m.gy-m.y)/dd*sp*dt;m.x+=vx;m.y+=vy;m.sx=m.x;m.sy=m.y;m.stk=(m.stk||0)+(Math.hypot(m.x-ox,m.y-oy)<sp*dt*.35?dt:-m.stk*.5);if(m.stk>2.5){var g2=GATES[m.gi];m.x=m.gx+g2[0]*130;m.y=m.gy+g2[1]*130;m.stk=0}}
  else{m.atkT-=dt;if(m.atkT<=0){m.atkT=1.4;gateHit(m)}}
  return 1}
function kill(m){G=D.G;if(!m.sg)return;S0.kills++;var left=mine().filter(function(x){return x!==m}).length;if(S0.wv>=WAVES&&left===0&&!S0.over)setTimeout(function(){if(!S0.over&&mine().length===0)finish(true)},900)}
function tick(dt){G=D.G;P=D.P;if(!G||!P)return;var n=now(),ph=phase(n),id=sid(n);
  if(S0.id!==id)reset(id);
  if(ph===2&&inWorld()&&near()&&!S0.over){var r=rel(n),want=Math.min(WAVES,Math.floor((r-START)/GAP)+1);
    if(want>S0.wv&&S0.wv<WAVES){if(S0.wv===0&&!P.ku_seen){P.ku_seen=1}spawnWave(S0.wv+1)}
    /* kule okçuları */
    towerT-=dt;if(towerT<=0){towerT=1.25;var c=cen(),R=wallR(),st=D.S(),ms=mine();
      if(ms.length)for(var gi=0;gi<4;gi++)for(var sd=-1;sd<=1;sd+=2){var g=GATES[gi],a=Math.atan2(g[1],g[0])+sd*.12,tx=c.x+Math.cos(a)*R,ty=c.y+Math.sin(a)*R-70,best=null,bd=470;
        for(var i=0;i<ms.length;i++){var d=Math.hypot(ms[i].x-tx,ms[i].y-ty);if(d<bd){bd=d;best=ms[i]}}
        if(best){arrows.push({x0:tx,y0:ty,m:best,t:0});(function(b){setTimeout(function(){if(b&&!b.dead)D.dmgMon(b,Math.max(1,st.dmg*.22))},260)})(best)}}}
    if(S0.wv>=WAVES&&mine().length===0&&!S0.over)finish(true);
    if(r>TIMEOUT-3e3&&!S0.over)finish(S0.gate>0&&mine().length===0)}
  if(ph!==2&&!S0.over&&S0.wv>0){S0.over=1;G.mons=G.mons.filter(function(m){return!m.sg})}
  for(var q=arrows.length-1;q>=0;q--){arrows[q].t+=dt*4.2;if(arrows[q].t>=1)arrows.splice(q,1)}
  if(flash>0)flash=Math.max(0,flash-dt*1.4);
  hudUpd(ph,n)}
function hudUpd(ph,n){if(!hud){hud=document.createElement('div');hud.id='kuh';hud.style.cssText='position:absolute;top:84px;left:50%;transform:translateX(-50%);padding:6px 14px;border-radius:14px;font:800 .8rem "Chakra Petch",sans-serif;background:rgba(40,8,12,.78);border:1.5px solid #ff6a4a;color:#ffd9d0;pointer-events:none;white-space:nowrap;z-index:3;text-align:center;display:none';var h=document.getElementById('hud');if(h)h.appendChild(hud);else document.body.appendChild(hud)}
  var s='';
  if(ph===1&&near()&&G.mode==='world'){var left=Math.max(0,START-rel(n));s='⚔ Kuşatma yaklaşıyor · '+Math.floor(left/60000)+':'+('0'+Math.floor(left/1000%60)).slice(-2)+' · Kapılara hazırlan!'}
  else if(ph===2&&!S0.over&&S0.wv>0&&G.mode==='world'){var n2=mine().length,w=Math.max(0,Math.round(S0.gate));s='⚔ Dalga '+S0.wv+'/'+WAVES+' · düşman '+n2+' · kapı <b style="color:'+(w>60?'#7dff9b':w>30?'#ffd23f':'#ff6b6b')+'">%'+w+'</b>'+'<div style="height:5px;border-radius:3px;background:rgba(255,255,255,.18);margin-top:3px"><i style="display:block;height:100%;width:'+w+'%;border-radius:3px;background:'+(w>60?'#5be39a':w>30?'#ffd23f':'#ff6b6b')+'"></i></div>'}
  if(s!==lastChip){lastChip=s;hud.innerHTML=s;hud.style.display=s?'':'none'}}
function collect(ents,ctx,Yv,t,plate){G=D.G;if(!G||G.mode!=='world')return;var ph=phase();if(!ph)return;var c=cen();if(Math.hypot(G.px-c.x,G.py-c.y)>TS*40)return;
  for(var i=0;i<4;i++){(function(i){var p=gatePt(i);if(Math.abs(p.x-G.px)>760||Math.abs(p.y-G.py)>520)return;ents.push({y:p.y+10,f:function(){var g=GATES[i],px=p.x-g[1]*80,py=p.y+g[0]*80;[1,-1].forEach(function(s){var x=p.x-g[1]*90*s,y=p.y+g[0]*90*s,fl=.8+Math.sin(t*9+s+i)*.2;ctx.fillStyle='#4a3524';ctx.fillRect(x-2,y-40,4,52);ctx.fillStyle='#c0392b';ctx.beginPath();ctx.moveTo(x+2,y-40);ctx.lineTo(x+30+Math.sin(t*3+i)*3,y-32);ctx.lineTo(x+2,y-22);ctx.fill();
          var gg=ctx.createRadialGradient(x,y-44,2,x,y-44,46*fl);gg.addColorStop(0,'rgba(255,170,60,.6)');gg.addColorStop(1,'rgba(255,90,30,0)');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(x,y-44,46*fl,0,6.3);ctx.fill()});
        if(plate&&S0.wv>0&&!S0.over){var act=mine().some(function(m){return m.gi===i});if(act)plate(ctx,p.x,p.y-90,'⚠ '+GATES[i][2]+' Kapısı','#ff8a7a')}}})})(i)}
  if(phase()===2){mine().forEach(function(m){if(Math.abs(m.x-G.px)>700||Math.abs(m.y-G.py)>500)return;ents.push({y:m.y-2,f:function(){ctx.fillStyle='rgba(255,60,40,'+(.22+.1*Math.sin(t*6))+')';ctx.beginPath();ctx.ellipse(m.x,m.y+m.sz*.35,m.sz*1.1,m.sz*.5,0,0,6.3);ctx.fill()}})})}
  /* oklar */
  if(arrows.length)ents.push({y:G.py+9999,f:function(){ctx.strokeStyle='#fff3c2';ctx.lineWidth=2;arrows.forEach(function(a){if(a.m.dead&&a.t>.9)return;var x=a.x0+(a.m.x-a.x0)*a.t,y=a.y0+(a.m.y-a.m.sz*.5-a.y0)*a.t-Math.sin(a.t*3.14)*40,x2=a.x0+(a.m.x-a.x0)*Math.max(0,a.t-.12),y2=a.y0+(a.m.y-a.m.sz*.5-a.y0)*Math.max(0,a.t-.12)-Math.sin(Math.max(0,a.t-.12)*3.14)*40;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x,y);ctx.stroke()})}})}
function draw(ctx,camX,camY,t,dg,VW,VH){G=D.G;if(dg||!G||G.mode!=='world')return;var ph=phase();if(ph!==2||S0.over&&!flash)return;var c=cen();if(Math.hypot(G.px-c.x,G.py-c.y)>TS*44)return;
  var a=.07+.03*Math.sin(t*2)+flash*.18+(S0.gate<30?.08*Math.abs(Math.sin(t*5)):0),g=ctx.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*.35,VW/2,VH/2,Math.max(VW,VH)*.75);g.addColorStop(0,'rgba(255,60,30,0)');g.addColorStop(1,'rgba(160,20,10,'+Math.min(.34,a*2.2)+')');ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);
  if(flash>0){ctx.fillStyle='rgba(255,120,60,'+flash*.14+')';ctx.fillRect(0,0,VW,VH)}
  while(emb.length<36)emb.push({x:Math.random()*VW,y:Math.random()*VH,v:20+Math.random()*40,r:1+Math.random()*2,p:Math.random()*6});
  ctx.fillStyle='rgba(255,170,70,.75)';emb.forEach(function(e){e.y-=e.v*.016;e.x+=Math.sin(t*2+e.p)*.4;if(e.y<-4){e.y=VH+4;e.x=Math.random()*VW}ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,6.3);ctx.fill()})}
window.YKU={init:function(api){D=api;Y=D.Y;P=D.P;G=D.G;TS=Y.TS;clearInterval(evT);var last=now();evT=setInterval(function(){var n=now(),dt=Math.min(.5,(n-last)/1000);last=n;try{tick(dt)}catch(e){console.error(e)}},250)},
 ai:ai,kill:kill,collect:collect,draw:draw,phase:phase,dbg:function(){return{S0:S0,rel:rel(),START:START,WAVES:WAVES,spawnWave:spawnWave,finish:finish,reset:reset,setStart:function(v){START=v},arrows:arrows}}};
})();
