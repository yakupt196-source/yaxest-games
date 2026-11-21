/* Yaxest Tycoon motoru: 5 oyun bu dosyayı kullanır. Oyuna özel veriler <id>/cfg.js içinde. */
(function(){
'use strict';
var T=function(s){try{return window.YT?YT(s):s}catch(e){return s}};
var $=function(i){return document.getElementById(i)};
var SUF=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','Ud','Dd','Td','Qad','Qid'];
function fmt(n){if(!isFinite(n))return'∞';if(n<1000)return n<10?(Math.round(n*100)/100)+'':n<100?(Math.round(n*10)/10)+'':Math.floor(n)+'';
  var e=Math.min(SUF.length-1,Math.floor(Math.log10(n)/3)),v=n/Math.pow(1000,e);return(v<10?v.toFixed(2):v<100?v.toFixed(1):v.toFixed(0))+SUF[e]}
function fmtT(s){s=Math.max(0,Math.floor(s));var h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?h+' '+T('sa')+' '+m+' '+T('dk'):m?m+' '+T('dk')+' '+(s%60)+' '+T('sn'):s+' '+T('sn')}
var G=1.15,MS=[10,25,50,100,150,200,300,400,500,600,700,800,900,1000];
var UPG=[ /* küresel yükseltmeler: [ad, maliyet(×ilk bina maliyeti), tür, değer] */
 ['Reklam Kampanyası',400,'all',1.25],['Verimlilik Eğitimi',6000,'all',1.5],['Dokun Gücü I',1500,'tap',3],['Yönetim Yazılımı',9e4,'all',1.75],
 ['Çevrimdışı Depo',3e5,'off',4],['Ortaklık Anlaşması',2e6,'all',2],['Dokun Gücü II',4e6,'tap',5],['Altın Fırsat Çekici',1.5e7,'ev',2],
 ['Yapay Zekâ Asistanı',2e8,'all',2.5],['Dokun Gücü III',6e8,'tap',8],['Kuantum Optimizasyonu',1e10,'all',3],['Çevrimdışı Depo II',2e10,'off',8],['Evrensel Marka',6e11,'all',5],['Zaman Bükücü',1e13,'all',8]];
var ACH=[ /* başarımlar: [kimlik, açıklama kalıbı, değer, ölçü, jeton] */
 ['e3','Toplam kazanç: {0}',1e3,'tot',2],['e6','Toplam kazanç: {0}',1e6,'tot',4],['e9','Toplam kazanç: {0}',1e9,'tot',8],['e12','Toplam kazanç: {0}',1e12,'tot',12],['e15','Toplam kazanç: {0}',1e15,'tot',20],['e18','Toplam kazanç: {0}',1e18,'tot',30],
 ['t100','Dokunma: {0}',100,'taps',2],['t1k','Dokunma: {0}',1000,'taps',5],['t10k','Dokunma: {0}',10000,'taps',12],
 ['b50','Toplam bina: {0}',50,'bld',3],['b250','Toplam bina: {0}',250,'bld',8],['b1k','Toplam bina: {0}',1000,'bld',15],
 ['p1','Yeniden doğuş: {0}',1,'pr',10],['p5','Yeniden doğuş: {0}',5,'pr',25],
 ['v1','Altın fırsat: {0}',1,'ev',2],['v25','Altın fırsat: {0}',25,'ev',10]];

/* ---- saf hesaplar (test edilebilir) ---- */
function costOf(c,owned,k){return c*Math.pow(G,owned)*(Math.pow(G,k)-1)/(G-1)}
function maxBuy(c,owned,money){var k=0,tot=0;while(k<1000){var nx=c*Math.pow(G,owned+k);if(tot+nx>money)break;tot+=nx;k++}return{k:k,cost:tot}}
function msMult(n){var m=1;for(var i=0;i<MS.length;i++)if(n>=MS[i])m*=2;return m}
function nextMs(n){for(var i=0;i<MS.length;i++)if(n<MS[i])return MS[i];return 0}
window.YXTM={costOf:costOf,maxBuy:maxBuy,msMult:msMult,fmt:fmt,UPG:UPG,G:G};

function start(C){
  var N=C.units.length,KEY='yx-tc-'+C.id;
  var S=load();
  function def(){var q=[];return{v:1,m:0,tot:0,all:0,n:new Array(N).fill(0),u:{},ach:{},pp:0,taps:0,ev:0,pr:0,q:[],qd:0,last:Date.now(),boost:0,jb:0}}
  function load(){var d=def();try{var s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object'){for(var k in s)if(k in d)d[k]=s[k];if(!Array.isArray(d.n)||d.n.length!==N)d.n=(d.n||[]).concat(new Array(N).fill(0)).slice(0,N)}}catch(e){}return d}
  function save(){S.last=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
  var mode=1,tab='b',cur=C.cur;

  /* ---- hesaplar ---- */
  function achCount(){var n=0;for(var k in S.ach)n++;return n}
  function upMult(){var m=1;UPG.forEach(function(u,i){if(S.u[i]&&u[2]==='all')m*=u[3]});return m}
  function tapUp(){var m=1;UPG.forEach(function(u,i){if(S.u[i]&&u[2]==='tap')m*=u[3]});return m}
  function offCap(){var m=1;UPG.forEach(function(u,i){if(S.u[i]&&u[2]==='off')m*=u[3]});return 2*3600*m}
  function evMul(){var m=1;UPG.forEach(function(u,i){if(S.u[i]&&u[2]==='ev')m*=u[3]});return m}
  function glob(){var b=Date.now()<S.boost?2:1;var jb=Date.now()<S.jb?2:1;return(1+.02*achCount())*(1+.07*S.pp)*upMult()*b*jb}
  function ips(){var s=0;for(var i=0;i<N;i++)s+=S.n[i]*C.units[i].r*msMult(S.n[i]);return s*glob()}
  function tapVal(){return(1+ips()*.08)*tapUp()}
  function bldCount(){var s=0;for(var i=0;i<N;i++)s+=S.n[i];return s}
  function ppGain(){return Math.max(0,Math.floor(Math.sqrt(S.tot/C.P0)))}
  function earn(a){S.m+=a;S.tot+=a;S.all+=a;questProg('earn',a)}
  function toast(m){var t=$('ttoast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(toast.to);toast.to=setTimeout(function(){t.classList.remove('on')},2600)}
  function sfx(n){try{window.YS&&YS.play(n)}catch(e){}}
  function jeton(n,why){try{if(window.YX)return YX.earn(n,why||'tc',1)}catch(e){}return 0}

  /* ---- görevler ---- */
  function genQuest(){var tier=1+Math.floor(S.qd/4)+S.pr*2,r=Math.random(),ip=Math.max(1,ips());
    if(r<.34)return{t:'tap',g:Math.round(40*tier*(1+Math.random())),p:0,j:3+Math.min(6,tier),m:ip*240+60};
    if(r<.67)return{t:'buy',g:Math.round(4+tier*3*(1+Math.random())),p:0,j:3+Math.min(6,tier),m:ip*240+60};
    return{t:'earn',g:Math.round(ip*(500+400*Math.random())+500),p:0,j:4+Math.min(8,tier),m:ip*300+80}}
  function ensureQ(){while(S.q.length<3)S.q.push(genQuest())}
  function questProg(t,a){for(var i=0;i<S.q.length;i++){var q=S.q[i];if(q.t===t&&q.p<q.g){q.p=Math.min(q.g,q.p+a)}}}
  function qText(q){return q.t==='tap'?T('Dokun')+': '+fmt(q.g):q.t==='buy'?T('Bina satın al')+': '+fmt(q.g):T('Kazan')+': '+fmt(q.g)+' '+cur}

  /* ---- eylemler ---- */
  function buy(i){var u=C.units[i],owned=S.n[i],k,cost;
    if(mode==='max'){var r=maxBuy(u.c,owned,S.m);k=r.k;cost=r.cost;if(!k)return false}else{k=mode;cost=costOf(u.c,owned,k);if(S.m<cost)return false}
    S.m-=cost;S.n[i]+=k;questProg('buy',k);sfx('pop');pulse[i]=1;return true}
  function buyUp(i){var u=UPG[i],cost=u[1]*C.units[0].c;if(S.u[i]||S.m<cost)return;S.m-=cost;S.u[i]=1;sfx('good');toast('✨ '+T(u[0]))}
  function tap(px,py){var v=tapVal();earn(v);S.taps++;questProg('tap',1);sfx('tap');pop(px,py,'+'+fmt(v));shake=1}
  function claimQ(i){var q=S.q[i];if(!q||q.p<q.g)return;var j=jeton(q.j,'quest');S.m+=q.m;S.tot+=0;S.q[i]=genQuest();S.qd++;sfx('win');toast('🎁 +'+fmt(q.m)+' '+cur+(j?' · +'+j+' 🪙':''))}
  function doPrestige(){var g=ppGain();if(g<1)return;S.pp+=g;S.pr++;var keep={pp:S.pp,ach:S.ach,taps:S.taps,ev:S.ev,pr:S.pr,all:S.all,q:S.q,qd:S.qd};var d=def();for(var k in keep)d[k]=keep[k];S=d;var j=jeton(5+g,'prestige');save();sfx('win');toast('✨ +'+g+(j?' · +'+j+' 🪙':''));render(true)}
  function checkAch(){ACH.forEach(function(a){if(S.ach[a[0]])return;var v=a[3]==='tot'?S.all:a[3]==='taps'?S.taps:a[3]==='bld'?bldCount():a[3]==='pr'?S.pr:S.ev;
    if(v>=a[2]){S.ach[a[0]]=1;var j=jeton(a[4],'ach');sfx('gem');toast('🏆 '+T(a[1].replace('{0}',fmt(a[2])))+(j?' · +'+j+' 🪙':''))}})}

  /* ---- sahne ---- */
  var cv,x,W=360,H=210,dpr=1,t=0,pops=[],walkers=[],gold=null,goldT=40+Math.random()*40,wT=0,shake=0,pulse={},avImg=null,lastSig='';
  function pop(px,py,tx){pops.push({x:px,y:py,t:0,s:tx})}
  function sizeCv(){dpr=Math.min(devicePixelRatio||1,2);var r=cv.getBoundingClientRect();W=r.width||360;H=r.height||210;cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
  function slot(i){var row=i<5?0:1,col=i%5,w=W;return[(.12+col*.19+(row?.095:0))*w,(row?.77:.52)*H]}
  function drawAv(){try{if(!window.YX)return;var sig=JSON.stringify(YX.S().eq);if(sig===lastSig)return;lastSig=sig;var svg=YX.av(YX.S().eq,'h').replace('<svg ','<svg width="120" height="120" ');var im=new Image();im.onload=function(){avImg=im};im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}catch(e){}}
  function frame(ts){requestAnimationFrame(frame);var dt=Math.min(.1,(ts-(frame.l||ts))/1000);frame.l=ts;t+=dt;
    earn(ips()*dt);
    // altın fırsat
    goldT-=dt;if(!gold&&goldT<=0){gold={x:-20,y:H*(.2+Math.random()*.3),vx:35+Math.random()*25,t:0};goldT=(50+Math.random()*70)/evMul()}
    if(gold){gold.x+=gold.vx*dt;gold.t+=dt;gold.yy=gold.y+Math.sin(gold.t*3)*14;if(gold.x>W+30)gold=null}
    // yürüyenler
    var rate=Math.min(2.2,.25+Math.log10(1+ips())*.4);wT-=dt;if(wT<=0&&C.walk){wT=1/rate;walkers.push({x:C.walk.dir>0?-16:W+16,s:(28+Math.random()*30)*C.walk.dir,e:C.walk.e[Math.floor(Math.random()*C.walk.e.length)],y:C.walk.y*H+(Math.random()-.5)*C.walk.j,ph:Math.random()*6})}
    walkers=walkers.filter(function(w){w.x+=w.s*dt;return w.x>-30&&w.x<W+30});
    pops=pops.filter(function(p){p.t+=dt;return p.t<1.1});
    shake=Math.max(0,shake-dt*6);for(var k in pulse)pulse[k]=Math.max(0,pulse[k]-dt*4);
    drawScene();hud()}
  function drawScene(){
    x.save();x.clearRect(0,0,W,H);var env={day:.5+.5*Math.sin(t/25),tot:Math.min(1,Math.log10(1+S.tot)/14)};
    C.bg(x,W,H,t,env,S);
    for(var i=0;i<N;i++){var p=slot(i),n=S.n[i],u=C.units[i],sz=Math.min(44,26+Math.log2(n+1)*3.2)*(1+pulse[i]*.25||1);
      if(n>0){x.font=sz+'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif';x.textAlign='center';x.textBaseline='middle';
        var cnt=Math.min(3,Math.ceil(Math.log10(n+1)+.5));for(var c=cnt-1;c>=0;c--){x.globalAlpha=c?.55:1;x.fillText(u.i,p[0]+c*7,p[1]+Math.sin(t*2+i+c)*2-c*5)}x.globalAlpha=1;
        x.font='800 11px system-ui';x.fillStyle='rgba(0,0,0,.55)';var tw=x.measureText(n).width+10;rr(p[0]-tw/2,p[1]+sz*.5+1,tw,15,7);x.fillStyle='#fff';x.fillText(n,p[0],p[1]+sz*.5+9)}
      else if(i===0||S.n[i-1]>0){x.globalAlpha=.22;x.font='30px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(u.i,p[0],p[1]);x.globalAlpha=1}}
    walkers.forEach(function(w){x.font='22px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(w.e,w.x,w.y+Math.abs(Math.sin(t*8+w.ph))*-3)});
    if(avImg){var by=Math.sin(t*2)*2;x.drawImage(avImg,W-64,H-72+by-shake*4,54,54)}
    if(gold){var gy=gold.yy,gl=.6+.4*Math.sin(t*8);x.save();x.shadowColor='#ffd23f';x.shadowBlur=18*gl;x.font='34px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(C.gold||'⭐',gold.x,gy);x.restore()}
    pops.forEach(function(p){x.globalAlpha=Math.max(0,1-p.t/1.1);x.font='800 15px system-ui';x.textAlign='center';x.lineWidth=3;x.strokeStyle='rgba(0,0,0,.6)';x.strokeText(p.s,p.x,p.y-p.t*40);x.fillStyle='#ffd23f';x.fillText(p.s,p.x,p.y-p.t*40)});x.globalAlpha=1;
    x.restore()}
  function rr(a,b,w,h,r){x.beginPath();if(x.roundRect)x.roundRect(a,b,w,h,r);else x.rect(a,b,w,h);x.fill()}
  var hudS='';
  function hud(){var m=fmt(S.m)+' '+cur,i=fmt(ips())+' '+cur+'/'+T('sn'),b='';
    var bs=Math.max(0,(S.boost-Date.now())/1000),jb=Math.max(0,(S.jb-Date.now())/1000);if(bs>0||jb>0)b='⚡ ×'+((bs>0?2:1)*(jb>0?2:1))+' · '+fmtT(Math.max(bs,jb));
    var s=m+'|'+i+'|'+b;if(s===hudS)return;hudS=s;$('tmon').textContent=m;$('tips').textContent=i;var bd=$('tbad');bd.hidden=!b;bd.textContent=b;updateRows()}

  /* ---- liste ---- */
  var rows=[];
  function render(force){var L=$('tl');
    if(tab==='b'){L.innerHTML='<div class="tseg" role="group">'+['1','10','100','max'].map(function(k){return'<button data-m="'+k+'" aria-pressed="'+(String(mode)===k)+'">'+(k==='max'?T('Maks'):'×'+k)+'</button>'}).join('')+'</div><div id="trows"></div>';
      rows=[];var R=$('trows');C.units.forEach(function(u,i){var d=document.createElement('div');d.className='trow';d.dataset.i=i;
        d.innerHTML='<div class="tic">'+u.i+'</div><div class="tmid"><b></b><small></small></div><button class="tbuy" type="button"></button>';R.appendChild(d);rows.push(d)});updateRows()}
    else if(tab==='u'){var h='';UPG.forEach(function(u,i){if(S.u[i])return;var cost=u[1]*C.units[0].c;h+='<div class="trow up'+(S.m>=cost?'':' lk')+'" data-u="'+i+'"><div class="tic">'+(u[2]==='tap'?'👆':u[2]==='off'?'🌙':u[2]==='ev'?'⭐':'📈')+'</div><div class="tmid"><b>'+esc(T(u[0]))+'</b><small>'+upDesc(u)+'</small></div><button class="tbuy" type="button"'+(S.m>=cost?'':' disabled')+'>'+fmt(cost)+' '+cur+'</button></div>'});
      var bought=Object.keys(S.u).length;
      h+='<div class="trow up"><div class="tic">⚡</div><div class="tmid"><b>'+esc(T('Jetonla hızlandır'))+'</b><small>'+esc(T('5 dakika boyunca gelir ×2'))+'</small></div><button class="tbuy" type="button" data-jb="1">🪙 12</button></div>';
      L.innerHTML=h||'<p class="tnote">'+esc(T('Hepsi alındı!'))+'</p>'}
    else if(tab==='q'){ensureQ();var h2='';S.q.forEach(function(q,i){var ok=q.p>=q.g;h2+='<div class="trow q'+(ok?' ok':'')+'"><div class="tic">'+(q.t==='tap'?'👆':q.t==='buy'?'🛒':'💰')+'</div><div class="tmid"><b>'+esc(qText(q))+'</b><div class="tbar"><i style="width:'+Math.min(100,q.p/q.g*100)+'%"></i></div><small>'+fmt(Math.min(q.p,q.g))+' / '+fmt(q.g)+' · '+esc(T('Ödül'))+': 🪙 '+q.j+' + '+fmt(q.m)+' '+cur+'</small></div><button class="tbuy" type="button" data-q="'+i+'"'+(ok?'':' disabled')+'>'+esc(T('Al'))+'</button></div>'});L.innerHTML=h2}
    else{var g=ppGain();var h3='<div class="tpr"><div class="tic" style="font-size:2.4rem">✨</div><b>'+esc(T('Yeniden Doğuş'))+'</b><p>'+esc(T('Her şeyi sıfırla, kalıcı ✨ kazan. Her ✨ geliri %7 artırır.'))+'</p><p class="tbig">✨ '+S.pp+' · '+esc(T('Mevcut bonus'))+': +%'+Math.round(S.pp*7)+'</p><button class="tbuy wide" id="tpr" type="button"'+(g<1?' disabled':'')+'>'+(g>=1?esc(T('Yeniden doğ'))+' (+'+g+' ✨)':esc(T('Henüz yeterli değil'))+' · '+fmt(C.P0)+' '+cur)+'</button></div><h3 class="tah">'+esc(T('Başarımlar'))+' '+achCount()+'/'+ACH.length+'</h3><div class="tach">';
      ACH.forEach(function(a){h3+='<div class="ta'+(S.ach[a[0]]?' on':'')+'">'+(S.ach[a[0]]?'🏆':'🔒')+' '+esc(T(a[1].replace('{0}',fmt(a[2]))))+'</div>'});L.innerHTML=h3+'</div>'}
    document.querySelectorAll('.ttabs button').forEach(function(b){b.setAttribute('aria-selected',b.dataset.t===tab)})}
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function upDesc(u){return u[2]==='all'?T('Tüm gelir')+' ×'+u[3]:u[2]==='tap'?T('Dokunma geliri')+' ×'+u[3]:u[2]==='off'?T('Çevrimdışı depo')+' ×'+u[3]:T('Altın fırsatlar daha sık')}
  function updateRows(){if(tab!=='b')return;var firstLock=-1;
    for(var i=0;i<N;i++){var d=rows[i];if(!d)continue;var u=C.units[i],owned=S.n[i],visible=i===0||S.n[i-1]>0||owned>0||i<=firstLock+0;
      var k=mode==='max'?Math.max(1,maxBuy(u.c,owned,S.m).k):mode,cost=costOf(u.c,owned,k),ok=S.m>=cost&&(mode!=='max'||maxBuy(u.c,owned,S.m).k>0);
      var show=i===0||S.n[i-1]>0||owned>0||S.m>=costOf(C.units[i-1].c,S.n[i-1],1)*.5;
      if(!show&&firstLock<0)firstLock=i;
      d.hidden=!show&&i>firstLock;d.classList.toggle('lk',!show);
      var nm=d.querySelector('b'),sm=d.querySelector('small'),bt=d.querySelector('button');
      var inc=C.units[i].r*msMult(owned)*glob(),nx=nextMs(owned);
      if(!show){nm.textContent='???';sm.textContent=T('Önceki binayı geliştir');bt.textContent='🔒';bt.disabled=true;continue}
      nm.textContent=T(u.n)+(owned?' · '+owned:'');
      sm.textContent=fmt(inc)+' '+cur+'/'+T('sn')+(owned?' '+T('her biri')+'':'')+(nx?' · '+T('Sonraki ×2')+': '+nx:'');
      var txt=(mode==='max'?'×'+k+' ':'')+fmt(cost)+' '+cur;if(bt.textContent!==txt)bt.textContent=txt;bt.disabled=!ok;d.classList.toggle('can',ok)}}

  /* ---- sayfa ---- */
  var CSS='#tc{max-width:520px;margin:0 auto;padding:0 12px 90px;color:var(--ink,#f6f3ff);font-family:"Bricolage Grotesque",system-ui,sans-serif}#tc *{box-sizing:border-box}#tc button{font:inherit;cursor:pointer}'+
  '.thd{display:flex;align-items:center;gap:10px;padding:8px 0;font-weight:800}.thd a{color:var(--mute,#a9a3cf);text-decoration:none;min-height:44px;display:flex;align-items:center}.thd b{flex:1;text-align:center}'+
  '.tsc{position:sticky;top:0;z-index:10;border-radius:20px;overflow:hidden;border:2px solid rgba(255,255,255,.14);box-shadow:0 12px 40px rgba(0,0,0,.45);background:#000}#tcv{display:block;width:100%;height:clamp(180px,34vh,250px);touch-action:manipulation;cursor:pointer}'+
  '.thud{position:absolute;left:0;right:0;top:8px;text-align:center;pointer-events:none;text-shadow:0 2px 6px rgba(0,0,0,.7)}.thud b{display:block;font-size:1.7rem;font-weight:800;line-height:1.1;color:#fff}.thud small{color:#ffe9a0;font-weight:800}'+
  '#tbad{position:absolute;left:8px;top:8px;background:rgba(255,210,63,.95);color:#14102b;font-weight:800;font-size:.78rem;border-radius:999px;padding:3px 9px}'+
  '.ttabs{display:flex;gap:6px;margin:12px 0 8px;background:rgba(255,255,255,.07);padding:4px;border-radius:999px;position:sticky;top:0;z-index:5}.ttabs button{flex:1;background:none;border:0;border-radius:999px;color:var(--mute,#a9a3cf);font-weight:800;min-height:40px;font-size:.88rem}.ttabs button[aria-selected=true]{background:var(--yellow,#ffd23f);color:var(--bg,#0b0820)}'+
  '.tseg{display:flex;gap:6px;margin-bottom:8px}.tseg button{flex:1;background:rgba(255,255,255,.07);border:0;border-radius:12px;color:var(--mute,#a9a3cf);font-weight:800;min-height:38px}.tseg button[aria-pressed=true]{background:rgba(255,210,63,.2);color:var(--yellow,#ffd23f);outline:2px solid var(--yellow,#ffd23f)}'+
  '.trow{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:10px;align-items:center;background:var(--card,#1a1440);border:1.5px solid var(--line,rgba(255,255,255,.1));border-radius:16px;padding:10px;margin-bottom:8px}.trow.can{border-color:rgba(255,210,63,.55)}.trow.lk{opacity:.55}.trow[hidden]{display:none}'+
  '.tic{font-size:1.9rem;text-align:center}.tmid b{display:block;font-size:.98rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tmid small{color:var(--mute,#a9a3cf);font-size:.76rem;display:block;line-height:1.25}'+
  '.tbuy{background:var(--yellow,#ffd23f);color:var(--bg,#0b0820);font-weight:800;border:0;border-radius:12px;padding:9px 12px;min-width:92px;min-height:44px;font-size:.88rem;white-space:nowrap}.tbuy[disabled]{background:rgba(255,255,255,.1);color:var(--mute,#a9a3cf);cursor:default}.tbuy.wide{width:100%;margin-top:8px;font-size:1rem}'+
  '.tbar{height:6px;border-radius:9px;background:rgba(255,255,255,.12);margin:4px 0;overflow:hidden}.tbar i{display:block;height:100%;background:linear-gradient(90deg,var(--yellow,#ffd23f),var(--pink,#ff5c8a))}.trow.q.ok{border-color:var(--mint,#3ddbb0)}'+
  '.tpr{background:linear-gradient(160deg,rgba(255,210,63,.14),rgba(255,92,138,.1));border:1.5px solid rgba(255,210,63,.4);border-radius:20px;padding:16px;text-align:center}.tpr p{color:var(--mute,#a9a3cf);font-size:.9rem}.tpr .tbig{color:var(--yellow,#ffd23f);font-weight:800;margin-top:6px}'+
  '.tah{margin:16px 0 8px;font-size:1rem}.tach{display:grid;grid-template-columns:1fr 1fr;gap:6px}.ta{background:rgba(255,255,255,.05);border-radius:12px;padding:8px 10px;font-size:.8rem;color:var(--mute,#a9a3cf)}.ta.on{color:var(--ink,#f6f3ff);background:rgba(255,210,63,.14)}.tnote{text-align:center;color:var(--mute,#a9a3cf);padding:20px}'+
  '#ttoast{position:fixed;left:50%;bottom:calc(76px + env(safe-area-inset-bottom));transform:translateX(-50%);background:#1f1a42;color:#fff;border:1.5px solid #ffd23f;border-radius:999px;padding:9px 18px;font-weight:800;z-index:100000;opacity:0;transition:opacity .25s;pointer-events:none;max-width:92vw;text-align:center;font-size:.9rem}#ttoast.on{opacity:1}'+
  '#twb{position:fixed;inset:0;z-index:100001;background:rgba(8,6,22,.88);display:grid;place-items:center;padding:24px}#twb .bx{background:var(--card,#1a1440);border:2px solid var(--yellow,#ffd23f);border-radius:24px;padding:22px;text-align:center;max-width:340px;display:grid;gap:10px}#twb b{font-size:1.6rem;color:var(--yellow,#ffd23f)}';
  function mount(){
    var root=$('tc');var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
    root.innerHTML='<div class="thd"><a href="../">← Yaxest</a><b>'+esc(T(C.title))+'</b><span class="yx-chip">🪙 <b data-yx="coins">0</b></span></div>'+
     '<div class="tsc" style="position:sticky"><canvas id="tcv" aria-label="'+esc(T(C.tapName))+'"></canvas><div class="thud"><b id="tmon">0</b><small id="tips"></small></div><div id="tbad" hidden></div></div>'+
     '<div class="ttabs" role="tablist"><button data-t="b">'+esc(T('Binalar'))+'</button><button data-t="u">'+esc(T('Geliştir'))+'</button><button data-t="q">'+esc(T('Görevler'))+'</button><button data-t="p">'+esc(T('Doğuş'))+'</button></div><div id="tl"></div><div id="ttoast" role="status"></div>';
    cv=$('tcv');x=cv.getContext('2d');sizeCv();addEventListener('resize',sizeCv);
    cv.addEventListener('pointerdown',function(e){var r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
      if(gold&&Math.hypot(px-gold.x,py-gold.yy)<34){var big=ips()*900+tapVal()*20;earn(big);S.ev++;pop(gold.x,gold.yy,'+'+fmt(big));sfx('gem');S.boost=Math.max(S.boost,Date.now()+60000);gold=null;toast('⭐ '+T('Altın fırsat!')+' ×2 '+T('1 dk'));return}
      tap(px,py)});
    root.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
      if(b.closest('.ttabs')){tab=b.dataset.t;render();return}
      if(b.dataset.m){mode=b.dataset.m==='max'?'max':+b.dataset.m;render();return}
      if(b.classList.contains('tbuy')){var row=b.closest('.trow');
        if(row&&row.dataset.i!=null){buy(+row.dataset.i);updateRows();return}
        if(row&&row.dataset.u!=null){buyUp(+row.dataset.u);render();return}
        if(b.dataset.jb){try{if(window.YX&&YX.spend(12)){S.jb=Math.max(S.jb,Date.now())+300000;sfx('good');toast('⚡ ×2 · 5 '+T('dk'))}else toast(T('Yetersiz jeton: 🪙 {0} gerekli').replace('{0}',12))}catch(e){}return}
        if(b.dataset.q!=null){claimQ(+b.dataset.q);render();return}
        if(b.id==='tpr'){if(confirm(T('Her şey sıfırlanacak, ✨ kalacak. Devam?')))doPrestige();return}}});
    render();drawAv();setInterval(function(){checkAch();ensureQ();save();drawAv();if(tab==='q'||tab==='u'||tab==='p')render()},1500);
    document.addEventListener('visibilitychange',function(){if(document.hidden)save()});addEventListener('pagehide',save);
    // çevrimdışı kazanç
    var away=(Date.now()-S.last)/1000;if(away>60&&ips()>0){var cap=offCap(),dt=Math.min(away,cap),g=ips()*dt*.5;earn(g);var w=document.createElement('div');w.id='twb';
      w.innerHTML='<div class="bx"><div style="font-size:2.4rem">🌙</div><b>'+esc(T('Tekrar hoş geldin!'))+'</b><div>'+esc(T('Sen yokken kazandığın'))+' ('+fmtT(dt)+')</div><b>+'+fmt(g)+' '+cur+'</b><button class="tbuy wide" id="twk" type="button">'+esc(T('Topla'))+'</button></div>';document.body.appendChild(w);$('twk').onclick=function(){w.remove()}}
    requestAnimationFrame(frame)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
  window.YXTycoonState=function(){return S};
}
window.YXTycoon={start:start,fmt:fmt};
})();
