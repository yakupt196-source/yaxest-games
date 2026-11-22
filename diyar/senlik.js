/* Yaxest Diyarı · Kış Şenliği (window.YSN)
   Sınırlı süreli etkinlik: kar yağışı, kutup ışıkları, süslü kasaba meydanı, Şenlik Ustası, günlük şenlik görevleri,
   Şenlik Yıldızı ile alınan ödüller (kostüm, yoldaş yumurtası, sandık, fişek) ve saat başı ışık gösterisi.
   Bitiş tarihinden sonra süs, kar ve görevler kapanır; kazanılan eşyalar kalır. Durum: P.sn */
(function(){
'use strict';
var START=new Date(2026,10,21).getTime(),END=new Date(2027,0,7).getTime();
var D=null,Y=null,SH=[],flk=[],fw=[],fwN=0,lastHour=-1,showT=0,bannerDay='';
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function rnd(n){var x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function on(){var n=Date.now();return n>=START&&n<END}
function dayKey(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function daysLeft(){return Math.max(0,Math.ceil((END-Date.now())/864e5))}
function S(){var P=D&&D.P;if(!P)return null;var s=P.sn;if(!s||typeof s!=='object')s=P.sn={};
  s.st=Math.max(0,Math.floor(+s.st||0));s.tot=Math.max(0,Math.floor(+s.tot||0));
  if(s.d!==dayKey()){s.d=dayKey();s.q={kill:0,gather:0,dg:0};s.c={};s.b={};s.dr=0}
  s.q=s.q||{kill:0,gather:0,dg:0};s.c=s.c||{};s.b=s.b||{};s.fw=Math.max(0,Math.floor(+s.fw||0));return s}
/* ---------- görevler ve mağaza ---------- */
var QS=[
 {id:'kill',t:'Kış Avı',d:'Dünyada canavar avla',n:40,r:4,ic:'sword'},
 {id:'gather',t:'Kış Hazırlığı',d:'Odun, taş ya da cevher topla',n:25,r:4,ic:'pickaxe'},
 {id:'dg',t:'Buz Sınavı',d:'Bir zindanı tamamla',n:1,r:6,ic:'door'}];
var SHOP=[
 {id:'santa',t:'Şenlik Külahı',d:'Kırmızı kürklü şenlik şapkası (kostüm).',c:40,lim:1,k:'hat'},
 {id:'snowcrown',t:'Kar Tacı',d:'Buz kristallerinden taç, geceleri parlar (kostüm).',c:120,lim:1,k:'hat'},
 {id:'egg',t:'Buz Kurdu Yumurtası',d:'Kar fırtınalarının yoldaşı.',c:70,lim:2,k:'egg'},
 {id:'box1',t:'Ender Sandık',d:'Çantana düşer. Oranlar sandıkta yazar.',c:18,lim:3,k:'box',ti:1},
 {id:'box2',t:'Nadir Sandık',d:'Çantana düşer. Oranlar sandıkta yazar.',c:55,lim:1,k:'box',ti:2},
 {id:'xp',t:'Şenlik Çorbası',d:'10 dakika %50 fazla XP.',c:10,lim:2,k:'xp'},
 {id:'fw',t:'Fişek Paketi ×5',d:'Meydanda ışık gösterisi başlatır.',c:8,lim:4,k:'fw'}];
function gain(n,why){var s=S();if(!s||n<=0)return;s.st+=n;s.tot+=n;D.saveNow();if(why)D.say('❄ +'+n+' Şenlik Yıldızı: '+why,'sys')}
function prog(t,n){if(!on()||!D||!D.P)return;var s=S();if(!s||!(t in s.q))return;s.q[t]+=n}
function kill(m){if(!on()||!D||!D.G||D.G.mode!=='world'||!m)return;var s=S();if(!s)return;var big=m.boss||m.type==='alpha'||m.type==='guardian'||m.type==='lich';
  if(s.dr>=24)return;if(Math.random()<(big?.45:.035)){s.dr+=1;s.st++;s.tot++;D.floatTxt(m.x,m.y-m.sz-48,'+1 ⭐','#9fe3ff');D.say('❄ Şenlik Yıldızı buldun!','sys');D.saveNow()}}
function claim(id){var s=S();if(!s||s.c[id])return;var q=QS.filter(function(x){return x.id===id})[0];
  if(id==='all'){if(!QS.every(function(x){return s.c[x.id]}))return;s.c.all=1;gain(4,'tüm görevler');if(window.YX3)try{YX3.giveBox(1,'senlik')}catch(e){}D.say('🎁 Günün şenlik sandığı çantanda!','sys');return}
  if(!q||s.q[id]<q.n)return;s.c[id]=1;gain(q.r,q.t)}
function buy(id){var s=S(),it=SHOP.filter(function(x){return x.id===id})[0];if(!s||!it)return;var P=D.P;
  var lim=it.lim,have=s.b[id]||0;
  if(it.k==='hat'){if(P.cs&&P.cs['hat:'+it.id]){return}}else if(have>=lim)return;
  if(s.st<it.c)return;
  if(it.k==='hat'){P.cs=P.cs||{};P.cs['hat:'+it.id]=1}
  else if(it.k==='egg'){if(!window.YK)return;YK.put(P,'e:icewolf',1)}
  else if(it.k==='box'){if(!window.YX3)return;YX3.giveBox(it.ti,'senlik')}
  else if(it.k==='xp'){try{var X=window.YX2&&YX2.dbg&&YX2.dbg.X();if(!X)return;X.xb=Math.max(X.xb||0,Date.now())+6e5}catch(e){return}}
  else if(it.k==='fw'){s.fw+=5}
  s.st-=it.c;s.b[id]=have+1;D.saveNow();D.say('❄ '+it.t+' alındı.','sys')}
/* ---------- panel ---------- */
var CSS='<style>.ysn .sq{display:grid;gap:6px;margin:6px 0}.ysn .bar{height:7px;border-radius:5px;background:rgba(255,255,255,.12);overflow:hidden}.ysn .bar i{display:block;height:100%;background:linear-gradient(90deg,#7fd0ff,#c8f0ff)}'+
 '.ysn h4{margin:12px 0 4px;color:#9fe3ff}.ysn .hd{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.ysn .stc{background:rgba(120,200,255,.14);border:1px solid rgba(160,220,255,.4);border-radius:999px;padding:3px 12px;font-weight:800}</style>';
function html(){var s=S();if(!s)return'';var h=CSS+'<div class="ysn"><div class="hd"><b style="font-size:1.05rem">❄ Kış Şenliği</b><span class="stc">⭐ '+s.st+'</span><small>'+(on()?daysLeft()+' gün kaldı':'Etkinlik sona erdi')+'</small></div>'+
 '<p class="sub">Kasabanın şenlik ruhu seninle! Günlük görevleri tamamla, yıldız topla ve Şenlik Ustası\'ndan özel ödüller al. Canavarlardan da ara sıra yıldız düşer.</p>';
  if(!on())return h+'<p class="sub">Şenlik bitti, ama kazandıkların seninle kalır. Bir sonraki kışta görüşmek üzere!</p></div>';
  h+='<h4>Günlük görevler</h4><div class="sq">';
  QS.forEach(function(q){var v=Math.min(q.n,s.q[q.id]||0),done=v>=q.n,cl=!!s.c[q.id];
    h+='<div class="it"><span>'+(window.YA?YA.ico(q.ic,26):'')+'</span><div class="t"><b>'+esc(q.t)+'</b> <small>+'+q.r+' ⭐</small><br><small>'+esc(q.d)+' · '+v+'/'+q.n+'</small><div class="bar"><i style="width:'+Math.round(v/q.n*100)+'%"></i></div></div>'+
    (cl?'<button class="btn alt" disabled type="button">Alındı</button>':'<button class="btn" data-qc="'+q.id+'" '+(done?'':'disabled')+' type="button">Al</button>')+'</div>'});
  var all=QS.every(function(x){return s.c[x.id]});
  h+='<div class="it"><span>'+(window.YA?YA.ico('gift',26):'')+'</span><div class="t"><b>Günün Hediyesi</b> <small>+4 ⭐ ve Ender Sandık</small><br><small>Üç görevi de al</small></div>'+(s.c.all?'<button class="btn alt" disabled type="button">Alındı</button>':'<button class="btn" data-qc="all" '+(all?'':'disabled')+' type="button">Al</button>')+'</div></div>';
  h+='<h4>Şenlik Mağazası</h4>';
  SHOP.forEach(function(it){var P=D.P,own=it.k==='hat'&&P.cs&&P.cs['hat:'+it.id],left=it.lim-(s.b[it.id]||0),dis=own||left<=0||s.st<it.c;
    h+='<div class="it"><div class="t"><b>'+esc(it.t)+'</b> <small style="color:#9fe3ff">⭐ '+it.c+'</small><br><small>'+esc(it.d)+(it.k==='hat'?'':' · bugün '+Math.max(0,left)+' hak')+'</small></div><button class="btn" data-sb="'+it.id+'" '+(dis?'disabled':'')+' type="button">'+(own?'Sahipsin':left<=0?'Bitti':'Al')+'</button></div>'});
  h+='<h4>Işık gösterisi</h4><div class="it"><div class="t"><b>Fişek at</b><br><small>Elinde '+s.fw+' fişek. Her saat başı meydanda ücretsiz gösteri de var!</small></div><button class="btn" data-fw="1" '+(s.fw>0?'':'disabled')+' type="button">Fırlat</button></div>';
  return h+'</div>'}
function bind(el,redraw){
  el.querySelectorAll('[data-qc]').forEach(function(b){b.onclick=function(){claim(b.dataset.qc);redraw()}});
  el.querySelectorAll('[data-sb]').forEach(function(b){b.onclick=function(){buy(b.dataset.sb);redraw()}});
  el.querySelectorAll('[data-fw]').forEach(function(b){b.onclick=function(){var s=S();if(!s||s.fw<1)return;s.fw--;D.saveNow();launch(5);redraw()}})}
/* ---------- fişekler ---------- */
var COLS=['#ff6b6b','#ffd23f','#6bd6ff','#9bff8a','#d98bff','#ffffff','#ff9f43'];
function launch(n,cx,cy){var G=D&&D.G;if(!G)return;var bx=cx==null?G.px:cx,by=cy==null?G.py:cy;
  for(var i=0;i<n;i++){fw.push({x:bx+(Math.random()-.5)*340,y:by+60,vy:-(260+Math.random()*120),tgt:by-(150+Math.random()*170),c:COLS[(fwN++)%COLS.length],t:-i*.28,st:0,p:[]})}}
function fwDraw(ctx,camX,camY,dt){if(!fw.length)return;ctx.save();ctx.globalCompositeOperation='lighter';
  for(var i=fw.length-1;i>=0;i--){var f=fw[i];f.t+=dt;if(f.t<0)continue;
    if(f.st===0){f.y+=f.vy*dt;ctx.fillStyle='rgba(255,230,160,.9)';ctx.beginPath();ctx.arc(f.x-camX,f.y-camY,2.2,0,6.3);ctx.fill();ctx.fillStyle='rgba(255,200,120,.25)';ctx.fillRect(f.x-camX-1,f.y-camY,2,26);
      if(f.y<=f.tgt){f.st=1;f.t=0;var n=46;for(var k=0;k<n;k++){var a=k/n*6.2832+Math.random()*.15,v=70+Math.random()*95;f.p.push({x:f.x,y:f.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v})}
        if(window.YSes&&YSes.sfx)try{YSes.sfx('loot',140)}catch(e){}}}
    else{var a2=Math.max(0,1-f.t/1.7);if(a2<=0){fw.splice(i,1);continue}
      f.p.forEach(function(p){p.vy+=70*dt;p.vx*=.985;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.fillStyle=f.c;ctx.globalAlpha=a2;ctx.beginPath();ctx.arc(p.x-camX,p.y-camY,2.1,0,6.3);ctx.fill()});ctx.globalAlpha=1;
      var g=ctx.createRadialGradient(f.x-camX,f.y-camY,0,f.x-camX,f.y-camY,120);g.addColorStop(0,'rgba(255,255,255,'+(.18*a2)+')');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(f.x-camX-120,f.y-camY-120,240,240)}}
  ctx.restore()}
/* ---------- kar, kutup ışığı, kırağı ---------- */
function night(){try{var h=YX2.dbg.hourP();return h<8?1:h<10?1-(h-8)/2:h>=22?(h-22)/2:0}catch(e){return 0}}
var lt=0;
function overlay(ctx,camX,camY,t,W,H){
  var dt=Math.min(.1,Math.max(0,t-lt));lt=t;
  var dkn=night();
  /* kutup ışığı */
  var lowfx=!!window.YD_LOWFX;
  if(dkn>.15&&!lowfx){ctx.save();ctx.globalCompositeOperation='lighter';
    [[.0,'80,255,170',46,0],[.5,'90,200,255',34,2.1],[1,'190,120,255',28,4.3]].forEach(function(r,ri){var g=ctx.createLinearGradient(0,0,0,H*.26);g.addColorStop(0,'rgba('+r[1]+','+(.07*dkn)+')');g.addColorStop(.45,'rgba('+r[1]+','+(.06*dkn)+')');g.addColorStop(1,'rgba('+r[1]+',0)');
      ctx.fillStyle=g;ctx.beginPath();var base=H*(.05+ri*.04),amp=r[2]*.6,ph=r[3];ctx.moveTo(0,0);for(var x=0;x<=W+20;x+=20){ctx.lineTo(x,base+Math.sin(x*.008+t*.35+ph)*amp+Math.sin(x*.021+t*.6+ph)*amp*.4)}ctx.lineTo(W,0);ctx.closePath();ctx.fill()});ctx.restore()}
  /* kırağı kenar */
  var vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.45,W/2,H/2,Math.max(W,H)*.78);vg.addColorStop(0,'rgba(190,225,255,0)');vg.addColorStop(1,'rgba(190,225,255,'+(.13+.08*(1-dkn))+')');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  /* kar taneleri */
  var N=lowfx?(W<700?18:30):(W<700?55:110);if(flk.length!==N){flk=[];for(var i=0;i<N;i++)flk.push({x:Math.random()*W,y:Math.random()*H,z:Math.random(),p:Math.random()*6})}
  ctx.fillStyle='rgba(255,255,255,.88)';ctx.beginPath();
  for(var j=0;j<N;j++){var f=flk[j],sp=22+f.z*52;f.y+=sp*dt;f.x+=(Math.sin(t*.8+f.p)*14+8)*dt*(.4+f.z);if(f.y>H+4){f.y=-4;f.x=Math.random()*W}if(f.x>W+4)f.x=-4;var r=.9+f.z*1.9;ctx.moveTo(f.x+r,f.y);ctx.arc(f.x,f.y,r,0,6.3)}
  ctx.fill();
  /* saat başı ışık gösterisi */
  var G=D&&D.G;if(G&&G.mode==='world'){var d=new Date(),hr=d.getHours();
    if(d.getMinutes()===0&&d.getSeconds()<2&&lastHour!==hr){lastHour=hr;showT=55;if(D.banner)D.banner('🎆 Saat başı ışık gösterisi!','Kasaba meydanına bak')}
    if(showT>0){showT-=dt;if(Math.random()<dt*.9&&D.inTownF&&D.inTownF())launch(1,Y.CX*Y.TS+(Math.random()-.5)*300,Y.CY*Y.TS-40)}}
  fwDraw(ctx,camX,camY,dt)}
function draw(ctx,camX,camY,t,dg,W,H){if(!on()||dg)return;if(!D||!D.G||D.G.mode!=='world'){return}try{overlay(ctx,camX,camY,t,W,H)}catch(e){}}
/* ---------- kasaba süsleri ---------- */
function glow(c,x,y,r,col,a){var g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+col+','+a+')');g.addColorStop(1,'rgba('+col+',0)');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)}
function lantern(c,x,y,t,i){var ol='#1b1530',f=.8+Math.sin(t*5+i*2.3)*.12+Math.sin(t*9.1+i)*.06,dk=night();
  c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x,y+1,9,3,0,0,6.3);c.fill();
  c.fillStyle='#4a3a2e';c.strokeStyle=ol;c.lineWidth=1.6;c.fillRect(x-1.8,y-46,3.6,46);c.strokeRect(x-1.8,y-46,3.6,46);
  c.fillStyle='#2e2438';c.fillRect(x-8,y-50,16,3);c.fillRect(x-6,y-26,12,2.4);
  c.fillStyle='rgba(255,196,94,'+(.65+.3*f)+')';c.beginPath();c.moveTo(x-5.5,y-47);c.lineTo(x+5.5,y-47);c.lineTo(x+4,y-29);c.lineTo(x-4,y-29);c.closePath();c.fill();c.stroke();
  c.fillStyle='rgba(255,255,230,.85)';c.beginPath();c.arc(x,y-38,2.6,0,6.3);c.fill();
  c.fillStyle='#e8f6ff';c.beginPath();c.ellipse(x,y-51,9,2.6,0,0,6.3);c.fill();
  c.save();c.globalCompositeOperation='lighter';glow(c,x,y-38,60+dk*50,'255,170,70',(.18+.34*dk)*f);c.restore()}
function tree(c,x,y,t){var ol='#1b1530',dk=night();
  c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(x,y+2,52,12,0,0,6.3);c.fill();
  c.fillStyle='#5b3a22';c.strokeStyle=ol;c.lineWidth=2;c.fillRect(x-8,y-22,16,24);c.strokeRect(x-8,y-22,16,24);
  [[54,92,26],[44,70,50],[34,50,74],[22,30,96]].forEach(function(s,i){var w=s[0],yy=y-s[2]+10;c.fillStyle=['#1f6b3f','#238048','#2a9355','#33a860'][i];c.beginPath();c.moveTo(x-w,y-s[2]+30);c.lineTo(x,y-s[1]-s[2]+20-i*0);c.lineTo(x+w,y-s[2]+30);c.closePath();c.fill();c.stroke();
    c.fillStyle='#eaf6ff';c.beginPath();c.moveTo(x-w+4,y-s[2]+27);c.quadraticCurveTo(x-w*.5,y-s[2]+20,x,y-s[2]+27);c.quadraticCurveTo(x+w*.5,y-s[2]+20,x+w-4,y-s[2]+27);c.lineTo(x+w-2,y-s[2]+31);c.lineTo(x-w+2,y-s[2]+31);c.closePath();c.fill()});
  var cols=['#ff5b6e','#ffd23f','#6bd6ff','#9bff8a','#d98bff'];
  for(var k=0;k<22;k++){var a=k*2.4,r=.18+rnd(k)*.8,by=y-24-rnd(k+9)*112,bw=Math.max(6,50-(by-(y-130))*.34),bx=x+Math.sin(a)*bw*r;var on2=(Math.sin(t*3+k*1.7)>-.2);
    c.fillStyle=on2?cols[k%5]:'rgba(60,60,80,.9)';c.beginPath();c.arc(bx,by,2.6,0,6.3);c.fill();if(on2){c.save();c.globalCompositeOperation='lighter';glow(c,bx,by,13,'255,255,255',.2+.25*dk);c.restore()}}
  /* yıldız */
  var sy=y-152,pu=1+Math.sin(t*3)*.08;c.save();c.translate(x,sy);c.scale(pu,pu);c.fillStyle='#ffd23f';c.strokeStyle=ol;c.lineWidth=1.8;c.beginPath();for(var q=0;q<10;q++){var rr=q%2?5:12,an=q*Math.PI/5-Math.PI/2;c.lineTo(Math.cos(an)*rr,Math.sin(an)*rr)}c.closePath();c.fill();c.stroke();c.restore();
  c.save();c.globalCompositeOperation='lighter';glow(c,x,sy,70+dk*40,'255,210,90',.25+.3*dk);glow(c,x,y-70,110,'120,255,160',.05+.1*dk);c.restore();
  /* hediyeler */
  [[-30,6,'#e04a4a','#fff'],[34,8,'#4a7be0','#ffd23f'],[8,12,'#3aa85a','#fff']].forEach(function(g){c.fillStyle=g[2];c.strokeStyle=ol;c.lineWidth=1.6;c.fillRect(x+g[0]-9,y+g[1]-14,18,14);c.strokeRect(x+g[0]-9,y+g[1]-14,18,14);c.fillStyle=g[3];c.fillRect(x+g[0]-1.5,y+g[1]-14,3,14);c.fillRect(x+g[0]-9,y+g[1]-8,18,3)})}
function snowman(c,x,y,t,i){var ol='#1b1530';c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x,y+1,18,5,0,0,6.3);c.fill();
  c.fillStyle='#f4fbff';c.strokeStyle=ol;c.lineWidth=1.8;[[0,-10,15],[0,-30,11.5],[0,-47,8.5]].forEach(function(b){c.beginPath();c.arc(x+b[0],y+b[1],b[2],0,6.3);c.fill();c.stroke()});
  c.fillStyle='#1b1530';c.beginPath();c.arc(x-3,y-49,1.2,0,6.3);c.arc(x+3,y-49,1.2,0,6.3);c.fill();c.fillStyle='#ff8a2b';c.beginPath();c.moveTo(x,y-47);c.lineTo(x+9,y-45);c.lineTo(x,y-44);c.closePath();c.fill();
  c.fillStyle='#c0392b';c.fillRect(x-9,y-40,18,3.6);c.fillRect(x+4,y-40,4,10);
  c.fillStyle='#2b2b3a';c.fillRect(x-7,y-62,14,10);c.fillRect(x-10,y-54,20,3);
  c.strokeStyle='#5b3a22';c.lineWidth=2;c.beginPath();c.moveTo(x-11,y-32);c.lineTo(x-22,y-40+Math.sin(t*2+i)*2);c.moveTo(x+11,y-32);c.lineTo(x+22,y-38);c.stroke();
  c.fillStyle='#1b1530';[-30,-22,-14].forEach(function(yy){c.beginPath();c.arc(x,y+yy+2,1.3,0,6.3);c.fill()})}
function fire(c,x,y,t){var dk=night(),f=.85+Math.sin(t*11)*.1+Math.sin(t*17.3)*.06;c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x,y+2,22,6,0,0,6.3);c.fill();
  c.fillStyle='#4a4a56';c.strokeStyle='#1b1530';c.lineWidth=1.6;for(var i=0;i<7;i++){var a=i/7*6.28;c.beginPath();c.ellipse(x+Math.cos(a)*15,y+Math.sin(a)*5,5,3.6,0,0,6.3);c.fill();c.stroke()}
  c.fillStyle='#6b4423';c.fillRect(x-12,y-6,24,5);c.save();c.translate(x,y-4);
  [[16,'#ff8a2b'],[11,'#ffc94a'],[6,'#fff3b0']].forEach(function(l,k){c.fillStyle=l[1];c.beginPath();c.moveTo(-l[0]*.6,0);c.quadraticCurveTo(-l[0]*.5,-l[0]*1.2*f,Math.sin(t*8+k)*2,-l[0]*2.1*f);c.quadraticCurveTo(l[0]*.5,-l[0]*1.2*f,l[0]*.6,0);c.closePath();c.fill()});c.restore();
  c.save();c.globalCompositeOperation='lighter';glow(c,x,y-14,95+dk*50,'255,150,60',(.22+.3*dk)*f);c.restore();
  c.fillStyle='rgba(255,200,120,.8)';for(var s=0;s<4;s++){var ph=(t*.9+s*.25)%1;c.fillRect(x+Math.sin(s*5+t)*8,y-14-ph*46,1.6,1.6)}}
function master(c,x,y,t,plate){var look={skin:'#f0c08a',cloth:'#c0392b',cloth2:'#8a1f1a',belt:'#2b2b2b',beard:'#f8f8f8',brow:'#e8e8e8',hat:'cap',capc:'#c0392b',prop:'sack',ph:1.3};
  if(window.YA&&YA.person)YA.person(c,x,y,look,t,false);
  c.fillStyle='#f6fbff';c.strokeStyle='#1b1530';c.lineWidth=1.4;c.beginPath();c.ellipse(x,y-58,11,3,0,0,6.3);c.fill();c.stroke();c.beginPath();c.arc(x+9,y-62+Math.sin(t*3)*1,3,0,6.3);c.fill();c.stroke();
  var s=S();if(s&&on()){var q=QS.some(function(z){return (s.q[z.id]||0)>=z.n&&!s.c[z.id]});if(q){var b=Math.sin(t*4)*3;c.fillStyle='#ffd23f';c.strokeStyle='#1b1530';c.lineWidth=2;c.beginPath();c.arc(x+16,y-80+b,9,0,6.3);c.fill();c.stroke();c.fillStyle='#1b1530';c.font='900 13px "Chakra Petch",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('!',x+16,y-79+b)}}
  if(plate)plate(c,x,y-70,'Şenlik Ustası','#ff8a7a')}
function garland(c,x1,y1,x2,y2,t,k){var n=7,sag=16;c.strokeStyle='#2e3a2e';c.lineWidth=1.6;c.beginPath();c.moveTo(x1,y1);c.quadraticCurveTo((x1+x2)/2,(y1+y2)/2+sag*2,x2,y2);c.stroke();
  var cols=['#ff5b6e','#ffd23f','#6bd6ff','#9bff8a'];for(var i=1;i<n;i++){var u=i/n,bx=(1-u)*(1-u)*x1+2*u*(1-u)*((x1+x2)/2)+u*u*x2,by=(1-u)*(1-u)*y1+2*u*(1-u)*((y1+y2)/2+sag*2)+u*u*y2,on2=Math.sin(t*4+i*1.3+k)>-.3;c.fillStyle=on2?cols[(i+k)%4]:'rgba(70,70,90,.9)';c.beginPath();c.arc(bx,by+2,2.3,0,6.3);c.fill();if(on2){c.save();c.globalCompositeOperation='lighter';glow(c,bx,by+2,9,'255,255,255',.18+.25*night());c.restore()}}}
var POSTS=[[-85,-70],[85,-70],[-110,40],[110,50],[-60,115],[60,125],[0,-120],[0,170]];
function collect(ents,ctx,Yv,t,plate){if(!on()||!D||!D.G||D.G.mode!=='world')return;var cx=Yv.CX*Yv.TS,cy=Yv.CY*Yv.TS,G=D.G;if(Math.hypot(G.px-cx,G.py-cy)>1500)return;
  POSTS.forEach(function(p,i){ents.push({y:cy+p[1],f:function(){lantern(ctx,cx+p[0],cy+p[1],t,i)}})});
  for(var i=0;i<POSTS.length;i++){var a=POSTS[i],b=POSTS[(i+1)%POSTS.length];if(Math.hypot(a[0]-b[0],a[1]-b[1])>230)continue;(function(a,b,i){ents.push({y:Math.max(cy+a[1],cy+b[1])-30,f:function(){garland(ctx,cx+a[0],cy+a[1]-46,cx+b[0],cy+b[1]-46,t,i)}})})(a,b,i)}
  var tx=cx+170,ty=cy+30;ents.push({y:ty,f:function(){tree(ctx,tx,ty,t)}});
  [[-40,150],[205,125],[-215,-150]].forEach(function(s,i){ents.push({y:cy+s[1],f:function(){snowman(ctx,cx+s[0],cy+s[1],t,i)}})});
  ents.push({y:cy+8,f:function(){fire(ctx,cx+235,cy+8,t)}});
  var mx=pos(Yv);ents.push({y:mx.y,f:function(){master(ctx,mx.x,mx.y,t,plate)}})}
function pos(Yv){return{x:Yv.CX*Yv.TS+130,y:Yv.CY*Yv.TS+90}}
function near(G,Yv){if(!on()||!G||G.mode!=='world')return null;var p=pos(Yv);return Math.hypot(p.x-G.px,p.y-G.py)<84?{t:'sn'}:null}
function init(api){D=api;Y=api.Y;SH=[];if(on()){var s=S();var dk=dayKey();if(s&&bannerDay!==dk){bannerDay=dk;setTimeout(function(){try{if(D&&D.banner)D.banner('❄ Kış Şenliği başladı!','Kasaba meydanında Şenlik Ustası\'nı bul');D.say('❄ Kış Şenliği: günlük görevler, özel kostümler ve ışık gösterisi için kasaba meydanındaki Şenlik Ustası\'na uğra.','sys')}catch(e){}},2500)}}}
window.YSN={init:init,on:on,near:near,collect:collect,draw:draw,html:html,bind:bind,prog:prog,kill:kill,gain:gain,title:function(){return'❄ Kış Şenliği'},launch:launch,dbg:{S:S,QS:QS,SHOP:SHOP}};
})();
