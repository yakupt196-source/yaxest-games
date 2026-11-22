/* Yaxest Diyarı: Konut Mahallesi. Kasaba surunun içinde 12 arsa, SATILIK / ev sahibi tabelaları,
   ev içi (jetonla dekor, yatak, davet, yatak paylaşımı). Ortak kayıt sunucuda (evx). window.YKN */
(function(){
'use strict';
var D,Y,P,G,R={},lastQ=0,inv0=null,room=null,TICK=0,WALLS=['#d9b98a','#9fc4a0','#9db4d8','#d8a3a3','#b8a0d6','#3f4a66'],WN=['Krem','Nane','Gökyüzü','Gül','Lavanta','Gece'];
var DEC={rug:{n:'Halı',ic:'🟥',p:4,f:1},plant:{n:'Saksı',ic:'🪴',p:3,f:1},lamp:{n:'Lamba',ic:'💡',p:3,f:1},fire:{n:'Şömine',ic:'🔥',p:12,f:1},piano:{n:'Piyano',ic:'🎹',p:25,f:1},aqua:{n:'Akvaryum',ic:'🐠',p:15,f:1},cat:{n:'Kedi',ic:'🐱',p:6,f:1},tree:{n:'Çam',ic:'🎄',p:6,f:1},cup:{n:'Kupa',ic:'🏆',p:10,f:1},chest:{n:'Sandık',ic:'🧰',p:5,f:1},globe:{n:'Küre',ic:'🌍',p:8,f:1},desk:{n:'Masa',ic:'🪑',p:9,f:1},
 paint:{n:'Tablo',ic:'🖼',p:5,f:0},shelf:{n:'Kitaplık',ic:'📚',p:8,f:0},clock:{n:'Saat',ic:'🕰',p:4,f:0},flag:{n:'Flama',ic:'🚩',p:3,f:0},sword:{n:'Kılıçlar',ic:'⚔️',p:7,f:0}};
var BEDS=[{n:'Sade yatak',p:0,c:'#c0584a',c2:'#e8e0d0'},{n:'Kraliyet yatağı',p:12,c:'#6b4bd6',c2:'#ffe9a8'},{n:'Yıldızlı yatak',p:30,c:'#2a8fd8',c2:'#fff7c2'}];
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function hm(){return P&&P.hm}
function PL(){return window.YH?YH.PL:[]}
function plot(id){var l=PL();for(var i=0;i<l.length;i++)if(l[i].id===id)return l[i]}
function online(){return !!(window.YNet&&YNet.on&&YNet.on())}
function myPk(){return window.YNet&&YNet.myPk?YNet.myPk():''}
function send(o){if(online()){YNet.send(o);return true}return false}
function lvc(lv){var L=window.YH&&YH.LVC&&YH.LVC();return(L&&L[lv])||{n:'Kulübe',col:'#9a7b55',w:70}}
function coins(){try{return YX.coins()}catch(e){return 0}}
function lay(){var h=hm();if(!h)return[];h.lay=h.lay||[];return h.lay}
function theme(d){var t={wp:0,bd:0},it=[];(d||[]).forEach(function(o){if(o.i==='t'){t.wp=Math.max(0,Math.min(5,o.x|0));t.bd=Math.max(0,Math.min(2,o.y|0))}else it.push(o)});t.it=it;return t}
function myD(){var h=hm();if(!h)return[];var d=lay().map(function(o){return{i:o.i,x:o.x,y:o.y}});d.push({i:'t',x:h.wp|0,y:h.bd|0});return d}
/* ---- kayıt: sunucudan gelen + yerel ---- */
function mine(){var h=hm();return h?{pid:h.pl,u:myPk()||'me',n:P.nick,lv:h.lv||1,d:myD(),os:0,g:[]}:null}
function entry(id){var h=hm();if(h&&h.pl===id){var m=mine(),s=R[id];if(s&&s.u===myPk()){m.os=s.os;m.g=s.g;m.oi=s.oi}return m}var s2=R[id];if(s2&&s2.u&&s2.u!==myPk())return s2;return null}
function apS(){try{var a=Object.assign({},P.ap||{});a.cl=P.cls;return JSON.stringify(a)}catch(e){return'{}'}}
function apP(s){try{return JSON.parse(s)}catch(e){return{}}}
function mergeR(m){if(m&&m.P){R=m.P;lastQ=Date.now()}}
function query(){if(Date.now()-lastQ<4000)return;lastQ=Date.now();send({t:'evq'})}
function syncMine(extra){var h=hm();if(!h||!online())return;var o={t:'evy',lv:h.lv||1,ap:apS(),d:myD()};if(extra)for(var k in extra)o[k]=extra[k];send(o)}
function ensureClaim(){var h=hm();if(!h||!online())return;var s=R[h.pl];if(!s||s.u!==myPk())send({t:'evc',id:h.pl,lv:h.lv||1,ap:apS()})}
var cbs={};
function claim(id,lv,cb){if(!online()){cb(true);return}cbs.claim=cb;send({t:'evc',id:id,lv:lv||1,ap:apS()})}
function release(){if(online())send({t:'evr'})}
function hand(m){
  if(m.P)mergeR(m);
  if(m.a==='claim'&&cbs.claim){var f=cbs.claim;cbs.claim=null;f(!!m.ok,m.e)}
  else if(m.ok===0&&m.e&&m.a!=='q'){if(D)D.say('🏠 '+m.e,'sys')}
  if(m.a==='join'&&cbs.join){var f2=cbs.join;cbs.join=null;f2(!!m.ok,m.e,m)}
  if(m.a==='invite'&&m.ok&&m.inv&&hm()){var h=hm();h.iv=h.iv||[];if(!h.iv.some(function(x){return x.k===m.inv})){h.iv.push({k:m.inv,n:cbs.invn||'Arkadaş'});D.saveNow()}if(D)D.say('💌 Davet gönderildi.','sys')}
  /* yeni davet bildirimi */
  var cur={};for(var id in R)if(R[id].iv&&R[id].u!==myPk())cur[id]=1;
  if(inv0){for(var k in cur)if(!inv0[k]&&D){D.say('💌 '+R[k].n+' seni evine davet etti! Tabelasının yanına git ve E/✋ ile gir.','sys');try{D.banner('💌 Ev daveti','<b>'+esc(R[k].n)+'</b> seni evine çağırıyor')}catch(e){}}}
  inv0=cur;
  if(room)roomRefresh()}
/* ---- dünyada: tabelalar, evler ---- */
function near(G0,Yv){if(!G0||G0.mode!=='world')return null;var l=PL(),best=null,bd=99999;for(var i=0;i<l.length;i++){var p=YH.plotPos(l[i]),d=Math.hypot(p.x-G0.px,p.y+40-G0.py);if(d<92&&d<bd){bd=d;best=l[i].id}}return best?{t:'kn',id:best}:null}
function sign(ctx,x,y,txt,sub,red,t){var w=Math.max(70,ctx.measureText(txt).width+18);
  ctx.fillStyle='#5a3a22';ctx.fillRect(x-w/2+6,y,4,18);ctx.fillRect(x+w/2-10,y,4,18);
  ctx.fillStyle=red?'#c0392b':'#8a5a30';ctx.strokeStyle='#2a1810';ctx.lineWidth=1.6;ctx.beginPath();ctx.roundRect?ctx.roundRect(x-w/2,y-14,w,sub?30:22,5):ctx.rect(x-w/2,y-14,w,sub?30:22);ctx.fill();ctx.stroke();
  ctx.fillStyle=red?'#fff':'#ffe9a8';ctx.font='800 11px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText(txt,x,y+1);
  if(sub){ctx.font='700 9.5px "Chakra Petch",sans-serif';ctx.fillStyle=red?'#ffd9d0':'#ffd2a0';ctx.fillText(sub,x,y+12)}}
function lot(ctx,x,y,t,pr){ctx.strokeStyle='rgba(120,80,40,.8)';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.strokeRect(x-44,y-18,88,56);ctx.setLineDash([]);
  ctx.fillStyle='rgba(120,200,110,.18)';ctx.fillRect(x-44,y-18,88,56);
  ctx.fillStyle='#c9a15e';ctx.beginPath();ctx.arc(x-26,y+16,3,0,6.3);ctx.arc(x+22,y+6,2.5,0,6.3);ctx.fill();
  ctx.fillStyle='#5a3a22';ctx.fillRect(x-1.5,y-40+Math.sin(t*2+x)*.6,3,34);ctx.fillStyle='#e0453a';ctx.beginPath();ctx.moveTo(x+1.5,y-40);ctx.lineTo(x+22,y-33);ctx.lineTo(x+1.5,y-26);ctx.closePath();ctx.fill()}
function drawPlot(ctx,pl,t,plate){var p=YH.plotPos(pl),e=entry(pl.id),x=p.x,y=p.y;
  if(!e){lot(ctx,x,y,t);ctx.save();sign(ctx,x,y+52,'SATILIK','🪙 '+YH.price(PL().indexOf(pl)),1,t);ctx.restore();return}
  var L=lvc(e.lv);YA.house(ctx,{x:x,y:y,c:L.col,w:L.w},t);
  /* çit */
  ctx.strokeStyle='#8a5a30';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x-L.w/2-14,y+40);ctx.lineTo(x-L.w/2-14,y+52);ctx.lineTo(x-14,y+52);ctx.moveTo(x+14,y+52);ctx.lineTo(x+L.w/2+14,y+52);ctx.lineTo(x+L.w/2+14,y+40);ctx.stroke();
  var me=e.u===myPk()||(hm()&&hm().pl===pl.id);ctx.save();sign(ctx,x,y+62,(me?'★ ':'')+e.n,(e.oi?'evde':'')+(e.os?' · uyuyor 💤':'')||L.n,0,t);ctx.restore();
  if(e.g&&e.g.length&&plate)plate(ctx,x,y-62,'👥 '+(e.g.length+(e.oi?1:0))+' kişi içeride','#ffd23f');
  if(e.iv&&plate)plate(ctx,x,y-78,'💌 Davetlisin','#7dff9b')}
function collect(ents,ctx,Yv,t,plate){if(!D||!D.G||D.G.mode!=='world'||!window.YH)return;var cx=Yv.CX*Yv.TS,cy=Yv.CY*Yv.TS,g=D.G;if(Math.hypot(g.px-cx,g.py-cy)>1700)return;
  PL().forEach(function(pl){var p=YH.plotPos(pl);if(Math.abs(p.x-g.px)>700||Math.abs(p.y-g.py)>520)return;ents.push({y:p.y+30,f:function(){drawPlot(ctx,pl,t,plate)}})});
  /* mahalle süsü: lambalar ve çalılar (sabit, deterministik) */
  var R0=14.4*Yv.TS;for(var i=0;i<24;i++){var a=(i*15+7.5)*Math.PI/180,x=cx+Math.cos(a)*(R0+6),y=cy+Math.sin(a)*(R0+6)*.96;if(Math.abs(x-g.px)>640||Math.abs(y-g.py)>440)continue;(function(x,y,k){ents.push({y:y+20,f:function(){if(k%3===0){ctx.fillStyle='#4a3524';ctx.fillRect(x-2,y-30,4,50);ctx.fillStyle='#ffd980';ctx.beginPath();ctx.arc(x,y-34,6,0,6.3);ctx.fill();ctx.fillStyle='rgba(255,220,130,.22)';ctx.beginPath();ctx.arc(x,y-34,24,0,6.3);ctx.fill()}else{ctx.fillStyle='#3f8f4a';ctx.beginPath();ctx.ellipse(x,y+8,13,9,0,0,6.3);ctx.fill();ctx.fillStyle='#57b160';ctx.beginPath();ctx.ellipse(x-3,y+4,8,6,0,0,6.3);ctx.fill();if(k%2){ctx.fillStyle='#ff6f91';ctx.beginPath();ctx.arc(x+5,y+3,2.2,0,6.3);ctx.fill()}}}})})(x,y,i)}}
/* ---- tabela paneli ---- */
function openSign(id){var pl=plot(id);if(!pl)return;query();D.openPan('p-npc');$('npt').innerHTML='🏘 '+esc(pl.n);var rd=function(){$('npc').innerHTML=signHtml(pl);bindSign(pl,rd)};rd()}
function signHtml(pl){var e=entry(pl.id),h=hm(),i=PL().indexOf(pl),pr=YH.price(i),s='';
  if(!e){s+='<p class="sub">Bu arsa <b>satılık</b>. Kasaba sınırları içinde, surların koruması altında. Satın alırsan evin burada kurulur ve tabelada adın yazar.</p>';
    s+='<div class="it"><div class="t"><b>Fiyat 🪙'+pr+'</b><br><small>Altının: 🪙'+P.gold+(h?' · taşınırsan eski evin satış değerinin %60\'ı düşülür':'')+'</small></div><button class="btn" data-k="buy" type="button" '+(P.gold<(h?Math.max(0,pr-Math.round((h.paid||0)*.6)):pr)?'disabled':'')+'>'+(h?'Taşın':'Satın al')+'</button></div>'}
  else if(h&&h.pl===pl.id){s+='<p class="sub">Evin: <b>'+lvc(h.lv).n+'</b>. İçeri girip dekore edebilir, uyuyabilir, arkadaşlarını çağırabilirsin.</p>';
    s+='<div class="row"><button class="btn" data-k="in" type="button">🚪 İçeri gir</button><button class="btn alt" data-k="depo" type="button">📦 Depo · Mağaza · Altar</button></div>'}
  else{s+='<div class="it"><div class="t"><b>'+esc(e.n)+'</b> ailesinin evi<br><small>'+lvc(e.lv).n+(e.oi?' · evde':'')+(e.g&&e.g.length?' · içeride '+e.g.length+' misafir':'')+'</small></div></div>';
    s+=e.iv?'<p class="sub" style="color:#7dff9b">💌 Davetlisin! İçeri girebilirsin.</p><button class="btn" data-k="visit" type="button">🚪 Ziyaret et</button>':'<p class="sub">Bu eve girmek için ev sahibinin seni davet etmesi gerekir. Arkadaşından bir davet iste!</p>'}
  s+='<p class="sub" id="knmsg"></p>';return s}
function bindSign(pl,rd){var el=$('npc'),m=function(t){var q=$('knmsg');if(q)q.textContent=t};
  el.querySelectorAll('[data-k]').forEach(function(b){b.onclick=function(){var k=b.dataset.k;
    if(k==='buy'){var h=hm(),i=PL().indexOf(pl),pr=YH.price(i);if(h&&(Object.keys(h.dp||{}).some(function(z){return h.dp[z]>0})||(h.sh&&h.sh.length)||h.till)){m('Taşınmadan önce depoyu, rafları ve kasayı boşalt (Evim → Depo).');return}
      YH.act('buy|'+pl.id);setTimeout(rd,700)}
    else if(k==='in'){closePan();enter(pl.id,false)}
    else if(k==='visit'){m('Giriliyor…');cbs.join=function(ok,e){if(ok){closePan();enter(pl.id,true)}else m(e||'Girilemedi.')};send({t:'evj',id:pl.id,ap:apS()})}
    else if(k==='depo'){YH.open('home')}}})}
function closePan(){try{D.openPan&&document.querySelector('.pan.on')&&document.querySelector('.pan.on').classList.remove('on')}catch(e){}}
/* ---- ev içi ---- */
var TW=40,COLS=14,ROWS=10,CW=560,CH=400,BED={x:40,y:88,w:160,h:72};
var FP={rug:[2,1,0],plant:[1,1,1],lamp:[1,1,1],fire:[2,1,1],piano:[2,1,1],aqua:[1,1,1],cat:[1,1,0],tree:[1,1,1],cup:[1,1,1],chest:[1,1,1],globe:[1,1,1],desk:[2,1,1],paint:[1,1,0],shelf:[2,1,0],clock:[1,1,0],flag:[1,1,0],sword:[1,1,0]};
function norm(o){var x=o.x,y=o.y,d=DEC[o.i]||{f:1};if(x>13||y>9){x=Math.round(x/100*COLS);y=Math.round(y/100*ROWS)}x=Math.max(0,Math.min(COLS-(FP[o.i]?FP[o.i][0]:1),x));y=d.f?Math.max(2,Math.min(8,y)):Math.max(0,Math.min(1,y));return{i:o.i,x:x,y:y}}
function rects(items){return items.filter(function(o){return DEC[o.i]&&DEC[o.i].f&&FP[o.i]&&FP[o.i][2]}).map(function(o){var f=FP[o.i];return{x:o.x*TW+4,y:o.y*TW+8,w:f[0]*TW-8,h:f[1]*TW-8}})}
function hitR(rs,x,y,r){for(var i=0;i<rs.length;i++){var q=rs[i];if(x+r>q.x&&x-r<q.x+q.w&&y>q.y&&y-10<q.y+q.h)return true}return false}
function doorX(x){return x>=6*TW&&x<=8*TW}
function enter(id,guest){if(room)return;var e=entry(id);if(!e&&!guest){D.say('Bu evde kimse yok.','sys');return}
  G=D.G;G.paused=true;room={id:id,guest:guest,sel:null,tab:0,sl:0,slT:0,ev:0,gcd:0,msg:'',t0:Date.now(),hbT:0,qT:0,px:7*TW,py:CH-30,tx:null,ty:null,keys:{},mv:0,fl:1,ov:{},tt:0};
  var d=document.createElement('div');d.id='knroom';d.style.cssText='position:fixed;inset:0;z-index:4;background:rgba(6,4,18,.94);display:flex;flex-direction:column;align-items:center;overflow:auto;padding:8px;color:#fff;font-family:inherit';
  d.innerHTML='<div style="width:min(98vw,760px)"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><b id="knh" style="flex:1;font-size:1.02rem"></b><button class="btn alt" id="knx" type="button" style="min-height:34px">🚪 Çık</button></div><canvas id="knc" width="'+CW+'" height="'+CH+'" style="width:100%;border-radius:14px;border:2px solid #3b2a5a;background:#1a1230;touch-action:none;image-rendering:auto"></canvas><div style="font-size:.72rem;opacity:.7;margin:3px 2px">WASD / ok tuşları ya da dokunarak yürü · E ya da eşyaya dokun: kullan · Alt kapıdan çık</div><div id="knb" style="margin-top:4px"></div></div>';
  document.body.appendChild(d);room.el=d;room.cv=$('knc');room.cx=room.cv.getContext('2d');
  $('knx').onclick=leave;room.cv.addEventListener('pointerdown',cvTap);
  room.kd=function(ev){if(!room)return;var k=ev.key.toLowerCase(),m={arrowup:'u',w:'u',arrowdown:'d',s:'d',arrowleft:'l',a:'l',arrowright:'r','d':'r'}[k];if(m){room.keys[m]=1;room.tx=null;if(ev.key.indexOf('Arrow')===0)ev.preventDefault()}else if(k==='e'||k===' '){ev.preventDefault();useNear()}};
  room.ku=function(ev){if(!room)return;var k=ev.key.toLowerCase(),m={arrowup:'u',w:'u',arrowdown:'d',s:'d',arrowleft:'l',a:'l',arrowright:'r','d':'r'}[k];if(m)delete room.keys[m]};
  window.addEventListener('keydown',room.kd);window.addEventListener('keyup',room.ku);
  if(guest)send({t:'evj',id:id,ap:apS(),x:room.px,y:room.py});else syncMine({in:1,hb:1,x:room.px,y:room.py});
  send({t:'evq'});room.raf=requestAnimationFrame(loop);room.iv=setInterval(beat,3000);roomRefresh()}
function leave(){if(!room)return;var id=room.id;if(room.sl)sleep(false,true);if(room.guest)send({t:'evl',id:id});else syncMine({in:0,sl:0});cancelAnimationFrame(room.raf);clearInterval(room.iv);window.removeEventListener('keydown',room.kd);window.removeEventListener('keyup',room.ku);try{room.el.remove()}catch(e){}room=null;if(G)G.paused=false;if(D)D.saveNow()}
function beat(){if(!room)return;if(room.guest)send({t:'evj',id:room.id,ap:apS(),x:Math.round(room.px),y:Math.round(room.py)});else syncMine({hb:1,in:1,x:Math.round(room.px),y:Math.round(room.py)});send({t:'evq'})}
function sleep(on,quiet){if(!room)return;var now=Date.now();
  if(on){if(room.guest&&now<room.gcd){room.msg='Biraz önce uyudun, '+Math.ceil((room.gcd-now)/1000)+' sn sonra tekrar uyuyabilirsin.';roomRefresh();return}
    if(!room.guest){var h=hm();if(h&&now<(h.rc||0)){room.msg='Dinlenme beklemede ('+Math.ceil((h.rc-now)/1000)+' sn). Yine de yatabilirsin ama ödül vermez.'}}
    room.sl=1;room.slT=now;if(room.guest)send({t:'evs',id:room.id,on:1});else syncMine({sl:1,in:1})}
  else{if(!room.sl)return;var dur=(now-room.slT)/1000;room.sl=0;var e=entry(room.id),partner=false;
    if(e){partner=room.guest?!!e.os:(e.g||[]).some(function(g){return g.s})}
    if(room.guest)send({t:'evs',id:room.id,on:0});else syncMine({sl:0,in:1});
    if(dur>=8&&!quiet){reward(partner)}else if(!quiet){room.msg='Uyanmak için en az 8 sn uyumalısın.'}roomRefresh()}}
function reward(partner){var s=D.S(),g=D.G,now=Date.now();
  if(room.guest){if(now<room.gcd)return;room.gcd=now+3e5;g.hp=s.maxhp;try{var X=YX2.dbg.X();X.xb=Math.max(X.xb||0,now)+(partner?9e5:3e5)}catch(e){}D.say('💤 Misafir dinlenmesi: canın doldu, '+(partner?'15':'5')+' dk +XP'+(partner?' (yatağı paylaştınız!)':''),'sys')}
  else{var h=hm();if(!h)return;if(now>=(h.rc||0)){YH.act('rest');if(partner){h.rb=(h.rb||now)+6e5;D.say('🛌 Yatağı paylaştınız: dinlenme +10 dk uzadı, birlikte uyumak güzel!','sys')}}else{D.say('🛌 Dinlenme beklemede; ödül yok.','sys')}}
  D.saveNow()}
function roomRefresh(){if(!room)return;var e=entry(room.id)||{n:'?',lv:1,d:[],g:[]},h=hm(),own=!room.guest;
  $('knh').innerHTML=(own?'🏠 Evim':'🏠 '+esc(e.n)+' · misafir')+' <small style="opacity:.7">· '+lvc(e.lv).n+'</small>';
  var s='';var tabs=own?['🛏 Yatak','🛋 Dekor','👥 Misafirler']:['🛏 Yatak'];
  s+='<div class="row" style="flex-wrap:wrap;gap:5px;margin:0 0 6px">'+tabs.map(function(t,i){return'<button class="btn'+(i===room.tab?'':' alt')+'" data-rt="'+i+'" style="min-height:34px;padding:0 10px;font-size:.82rem" type="button">'+t+'</button>'}).join('')+(own?'<button class="btn alt" data-rt="d" style="min-height:34px;padding:0 10px;font-size:.82rem" type="button">📦 Depo/Mağaza</button>':'')+'</div>';
  if(room.tab===0){var os=!!e.os,gs=(e.g||[]).filter(function(g){return g.s}).length,full=(os?1:0)+gs+(room.sl&&!(own?os:0)?0:0);
    s+='<div class="it"><div class="t"><b>'+(room.sl?'💤 Uyuyorsun…':'🛏 Yatak')+'</b><br><small>İki kişilik. Yatağı bir arkadaşınla paylaşırsan ekstra dinlenme kazanırsınız. En az 8 sn uyu, sonra kalk.'+(room.sl?' <b>'+Math.max(0,8-Math.floor((Date.now()-room.slT)/1000))+' sn</b>':'')+'</small></div><button class="btn" data-rt="s" type="button">'+(room.sl?'☀ Kalk':'🛌 Uyu')+'</button></div>';
    s+='<div class="it"><div class="t"><small>İçeride: '+(e.oi||own?'<b>'+esc(own?P.nick:e.n)+'</b>':'')+(e.g&&e.g.length?' · '+e.g.map(function(g){return esc(g.n)+(g.s?' 💤':'')}).join(' · '):'')+'</small></div></div>'}
  else if(room.tab===1&&own){s+='<p class="sub">Jetonların: <b>🪙 '+coins()+'</b> (Yaxest Games\'teki oyunlardan kazanılır). Eşyayı seç, odada bir yere dokun. Yerleştirdiğine dokunarak kaldır.</p>';
    s+='<div style="display:flex;flex-wrap:wrap;gap:6px">'+Object.keys(DEC).map(function(k){var d=DEC[k],o=(h.dc||{})[k]|0,pl=lay().filter(function(x){return x.i===k}).length,have=o-pl;return'<button type="button" class="btn'+(room.sel===k?'':' alt')+'" data-rd="'+k+'" style="min-height:44px;padding:4px 8px;font-size:.76rem;line-height:1.15">'+d.ic+' '+d.n+'<br><small>'+(have>0?'elde '+have+' · yerleştir':'🪙 '+d.p+' satın al')+'</small></button>'}).join('')+'</div>';
    s+='<div class="it" style="margin-top:8px"><div class="t"><b>Duvar kâğıdı</b><br>'+WALLS.map(function(c,i){var own2=i===0||(h.dc||{})['wp'+i];return'<button type="button" class="btn'+((h.wp|0)===i?'':' alt')+'" data-rw="'+i+'" style="min-height:30px;padding:0 8px;margin:2px;font-size:.74rem;border-left:12px solid '+c+'">'+WN[i]+(own2?'':' 🪙'+(2+i))+'</button>'}).join('')+'</div></div>';
    s+='<div class="it"><div class="t"><b>Yatak</b><br>'+BEDS.map(function(b,i){var own3=i===0||(h.dc||{})['bd'+i];return'<button type="button" class="btn'+((h.bd|0)===i?'':' alt')+'" data-rb="'+i+'" style="min-height:30px;padding:0 8px;margin:2px;font-size:.74rem">'+b.n+(own3?'':' 🪙'+b.p)+'</button>'}).join('')+'</div></div>'}
  else if(room.tab===2&&own){var hh=hm();s+='<p class="sub">Arkadaşını davet et; davetli oyuncu senin tabelana gelip içeri girebilir (evde en fazla 3 misafir). Yatağı paylaşabilirsiniz.</p>';
    s+='<div class="row"><input id="kni" placeholder="Arkadaşının oyun adı" maxlength="16" style="flex:1;min-width:0;padding:8px;border-radius:10px;border:1.5px solid #4b3a7a;background:#120d26;color:#fff;font:inherit"><button class="btn" data-rt="i" type="button" '+(online()?'':'disabled')+'>💌 Davet et</button></div>';
    var oth=window.YNet&&YNet.others?Object.keys(YNet.others()).map(function(k){return YNet.others()[k]}).filter(function(o){return o.k}).slice(0,8):[];
    if(oth.length)s+='<div class="sub">Şu an çevrimiçi (bu dünyada):</div><div style="display:flex;flex-wrap:wrap;gap:5px">'+oth.map(function(o){return'<button class="btn alt" data-ro="'+o.k+'|'+esc(o.n)+'" type="button" style="min-height:32px;padding:0 9px;font-size:.78rem">💌 '+esc(o.n)+'</button>'}).join('')+'</div>';
    if(!online())s+='<p class="sub">Çevrimiçi değilsin: davet için sunucuya bağlanmalısın.</p>';
    if((hh.iv||[]).length)s+='<div class="sub" style="margin-top:6px">Davetlilerin:</div>'+hh.iv.map(function(v,i){return'<div class="it"><div class="t">'+esc(v.n)+'</div><button class="btn alt" data-ru="'+i+'" type="button" style="min-height:30px;padding:0 9px">Kaldır</button></div>'}).join('')}
  if(room.msg)s+='<div class="err" style="color:#ffd23f;margin-top:4px">'+esc(room.msg)+'</div>';
  var b=$('knb');b.innerHTML=s;bindRoom(b)}
function spendC(n){if(n<=0)return true;try{return YX.spend(n)}catch(e){return false}}
function bindRoom(b){var h=hm(),own=!room.guest;
  b.querySelectorAll('[data-rt]').forEach(function(x){x.onclick=function(){var k=x.dataset.rt;room.msg='';
    if(k==='s')sleep(!room.sl);else if(k==='d'){YH.open('home')}
    else if(k==='i'){var v=($('kni')||{}).value||'';v=v.trim();if(v.length<3){room.msg='Oyun adını yaz.';roomRefresh();return}cbs.invn=v;send({t:'evi',n:v});room.msg='Davet gönderiliyor…';roomRefresh()}
    else{room.tab=+k;room.sel=null}roomRefresh()}});
  b.querySelectorAll('[data-ro]').forEach(function(x){x.onclick=function(){var a=x.dataset.ro.split('|');cbs.invn=a[1];send({t:'evi',pk:a[0]});room.msg=a[1]+' davet ediliyor…';roomRefresh()}});
  b.querySelectorAll('[data-ru]').forEach(function(x){x.onclick=function(){var v=h.iv.splice(+x.dataset.ru,1)[0];if(v)send({t:'evu',pk:v.k});D.saveNow();roomRefresh()}});
  b.querySelectorAll('[data-rd]').forEach(function(x){x.onclick=function(){var k=x.dataset.rd,d=DEC[k];h.dc=h.dc||{};var pl=lay().filter(function(o){return o.i===k}).length;
    if((h.dc[k]|0)-pl>0){room.sel=room.sel===k?null:k;room.msg=room.sel?d.n+' seçildi: odada bir yere dokun.':''}
    else if(lay().length>=26){room.msg='Odaya en fazla 26 eşya sığar.'}
    else if(spendC(d.p)){h.dc[k]=(h.dc[k]|0)+1;room.sel=k;room.msg=d.n+' alındı. Odada bir yere dokun.';D.saveNow()}else room.msg='Jetonun yetmiyor (🪙 '+d.p+'). Jetonlar Yaxest Games oyunlarından kazanılır.';roomRefresh()}});
  b.querySelectorAll('[data-rw]').forEach(function(x){x.onclick=function(){var i=+x.dataset.rw;h.dc=h.dc||{};if(i&&!h.dc['wp'+i]){if(!spendC(2+i)){room.msg='Jetonun yetmiyor.';roomRefresh();return}h.dc['wp'+i]=1}h.wp=i;D.saveNow();syncMine();roomRefresh()}});
  b.querySelectorAll('[data-rb]').forEach(function(x){x.onclick=function(){var i=+x.dataset.rb;h.dc=h.dc||{};if(i&&!h.dc['bd'+i]){if(!spendC(BEDS[i].p)){room.msg='Jetonun yetmiyor.';roomRefresh();return}h.dc['bd'+i]=1}h.bd=i;D.saveNow();syncMine();roomRefresh()}})}
function allItems(){var e=entry(room.id)||{d:[]};return theme(e.d).it.map(norm)}
function useAt(kind,x,y){var a=room;
  if(kind==='bed'){if(Math.hypot(a.px-(BED.x+BED.w/2),a.py-(BED.y+BED.h+16))>150){a.msg='Yatağa biraz yaklaş.';roomRefresh();return}sleep(!a.sl);return}
  if(kind==='piano'){var n=[262,294,330,349,392,440,494,523][Math.floor(Math.random()*8)];a.ov.note=1.2;try{if(window.YSes&&YSes.sfx)YSes.sfx('click',n/4)}catch(e){}return}
  if(kind==='chest'){if(!a.guest)YH.open('home');else{a.msg='Bu sandık ev sahibinin.';roomRefresh()}return}
  if(kind==='cat'){a.ov.cat=1.6;return}
  if(kind==='aqua'){a.ov.fish=1.6;return}
  if(kind==='fire'){a.ov.warm=1.6;return}
  if(kind==='tree'){a.ov.star=1.6;return}}
function nearThing(x,y,r){var its=allItems(),best=null,bd=r;
  if(Math.hypot(x-(BED.x+BED.w/2),y-(BED.y+BED.h+10))<Math.max(r,90)){best={k:'bed'};bd=0}
  its.forEach(function(o){if(!DEC[o.i]||!FP[o.i])return;var f=FP[o.i],cx=(o.x+f[0]/2)*TW,cy=(o.y+f[1])*TW;if(!DEC[o.i].f)return;var d=Math.hypot(x-cx,y-cy);if(d<bd&&['piano','chest','cat','aqua','fire','tree'].indexOf(o.i)>=0){bd=d;best={k:o.i}}});return best}
function useNear(){if(!room||room.tab===1)return;var t=nearThing(room.px,room.py,80);if(t)useAt(t.k)}
function cvTap(ev){if(!room)return;var r=room.cv.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*CW,y=(ev.clientY-r.top)/r.height*CH,h=hm();
  if(room.tab===1&&!room.guest){/* düzenleme modu */
    var tx=Math.floor(x/TW),ty=Math.floor(y/TW);
    if(room.sel){var d=DEC[room.sel],f=FP[room.sel];if(tx+f[0]>COLS)tx=COLS-f[0];if(d.f){ty=Math.max(2,Math.min(8,ty))}else ty=Math.max(0,Math.min(1,ty));
      var all=allItems(),ok=true;all.forEach(function(o){var g=FP[o.i];if(!g||(DEC[o.i].f!==d.f))return;if(FP[room.sel][2]!==g[2]&&d.f)return;if(tx<o.x+g[0]&&tx+f[0]>o.x&&ty<o.y+g[1]&&ty+f[1]>o.y)ok=false});
      if(d.f&&f[2]&&tx*TW<BED.x+BED.w&&(tx+f[0])*TW>BED.x&&ty*TW<BED.y+BED.h&&(ty+1)*TW>BED.y)ok=false;
      if(d.f&&ty>=8&&tx<=8&&tx+f[0]>=6)ok=false;
      if(!ok){room.msg='Buraya konmaz (başka eşya ya da yatak/kapı var).';roomRefresh();return}
      h.lay=h.lay||[];h.lay.push({i:room.sel,x:tx,y:ty});var pl=h.lay.filter(function(o){return o.i===room.sel}).length;if((h.dc[room.sel]|0)-pl<=0)room.sel=null;room.msg='';D.saveNow();syncMine();roomRefresh();return}
    var L=lay(),bi=-1;for(var i=L.length-1;i>=0;i--){var o=norm(L[i]),g=FP[o.i]||[1,1];if(tx>=o.x&&tx<o.x+g[0]&&ty>=o.y&&ty<o.y+g[1]){bi=i;break}}
    if(bi>=0){L.splice(bi,1);D.saveNow();syncMine();room.msg='Eşya kaldırıldı (envanterinde duruyor).';roomRefresh()}return}
  /* yürüme modu: eşyaya dokun = kullan, değilse oraya yürü */
  var t=nearThing(x,y,34);if(t){var cx=t.k==='bed'?BED.x+BED.w/2:x,cy=t.k==='bed'?BED.y+BED.h+16:y;room.pend=t.k;room.tx=cx;room.ty=Math.min(CH-14,cy+18);return}
  room.pend=null;room.tx=Math.max(14,Math.min(CW-14,x));room.ty=Math.max(BED.y+4,Math.min(CH-6,y))}
/* ---- çizim ---- */
function ico(c,k,x,y,t){if(window.YRA2){YRA2.item(c,k,x,y,t);return}}
function drawSleeper(c,ap,x,y,sc,t){c.save();c.translate(x,y);c.rotate(-Math.PI/2);try{YL.hero(c,0,0,ap,t,false,sc)}catch(e){}c.restore()}
function drawStand(c,ap,x,y,t,name){try{YL.hero(c,x,y,ap,t,false,1.05)}catch(e){}if(name){c.font='700 11px "Chakra Petch",sans-serif';c.textAlign='center';c.fillStyle='rgba(14,10,32,.75)';var w=c.measureText(name).width+12;c.fillRect(x-w/2,y+4,w,15);c.fillStyle='#fff';c.fillText(name,x,y+15)}}
function drawItemsSorted(c,items,t,extra){var list=items.filter(function(o){return DEC[o.i]&&DEC[o.i].f}).map(function(o){var f=FP[o.i];return{y:(o.y+f[1])*TW,o:o,f:f}}),i;
  list.concat(extra).sort(function(a,b){return a.y-b.y}).forEach(function(q){if(q.fn)q.fn();else{var f=q.f;ico(c,q.o.i,(q.o.x+f[0]/2)*TW,(q.o.y+f[1])*TW-3,t)}})}
function charFn(c,ap,x,y,t,mv,name,fl){return{y:y,fn:function(){c.save();if(fl<0){c.translate(x,0);c.scale(-1,1);c.translate(-x,0)}try{YL.hero(c,x,y,ap,t,mv,1.0)}catch(e){}c.restore();if(name){c.font='700 10px "Chakra Petch",sans-serif';c.textAlign='center';var w=c.measureText(name).width+10;c.fillStyle='rgba(14,10,32,.75)';c.fillRect(x-w/2,y-62,w,14);c.fillStyle='#fff';c.fillText(name,x,y-52)}}}}
function step(dt){var a=room,sp=118*dt,dx=0,dy=0;if(a.sl)return;
  if(a.keys.u)dy-=1;if(a.keys.d)dy+=1;if(a.keys.l)dx-=1;if(a.keys.r)dx+=1;
  if(!dx&&!dy&&a.tx!=null){var ux=a.tx-a.px,uy=a.ty-a.py,d=Math.hypot(ux,uy);if(d<6){a.tx=null;if(a.pend){var k=a.pend;a.pend=null;useAt(k)}}else{dx=ux/d;dy=uy/d}}
  var m=Math.hypot(dx,dy);a.mv=m?1:0;if(!m)return;dx/=m;dy/=m;if(dx)a.fl=dx<0?-1:1;
  var rs=rects(allItems()),nx=a.px+dx*sp,ny=a.py+dy*sp;
  var bedR={x:BED.x,y:BED.y,w:BED.w,h:BED.h-6};
  var blockedF=function(x,y){return hitR(rs,x,y,10)||hitR([bedR],x,y,10)};
  if(!blockedF(nx,a.py))a.px=Math.max(14,Math.min(CW-14,nx));if(!blockedF(a.px,ny))a.py=Math.max(BED.y+TW*2+6,Math.min(CH+8,ny));
  if(a.py>=CH+4&&doorX(a.px)){leave()}}
function loop(){if(!room)return;var c=room.cx,now=Date.now(),t=(now-room.t0)/1000,dt=Math.min(.05,Math.max(0,t-room.tt));room.tt=t;step(dt);if(!room)return;
  var e=entry(room.id)||{d:[],g:[],lv:1},th=theme(e.d),own=!room.guest;
  var hr=3;try{hr=YX2.dbg.hourP()}catch(er){}var night=(typeof hr==='number'&&(hr>=19||hr<6));
  c.clearRect(0,0,CW,CH);
  /* duvar, parke, pencere (el çizimi, önbellekli) */
  c.drawImage(YRA2.wall(th.wp||0,CW,84),0,0);c.drawImage(YRA2.floor(CW,CH-80,80),0,80);
  YRA2.win(c,238,10,night,t,!!(window.YSN&&YSN.on&&YSN.on()));
  YRA2.sun(c,244,92,night,t);
  var items=allItems();
  /* halılar (en altta) ve duvar eşyaları */
  items.forEach(function(o){if(o.i==='rug'){var f=FP.rug;ico(c,'rug',(o.x+f[0]/2)*TW,(o.y+f[1])*TW+2,t)}});
  items.forEach(function(o){if(DEC[o.i]&&!DEC[o.i].f){var f=FP[o.i];ico(c,o.i,(o.x+f[0]/2)*TW,(o.y+1)*TW-2,t)}});
  /* yatak (üstten) */
  var bd=BEDS[th.bd]||BEDS[0],bst=th.bd||0;
  YRA2.bedBase(c,BED.x,BED.y,BED.w,BED.h,bst,t);
  /* uyuyanlar */
  var ownerSleeping=own?room.sl:!!e.os,myAp=apP(apS()),ownerAp=own?myAp:apP(e.ap||'{}'),sl=[];
  if(ownerSleeping)sl.push({ap:ownerAp});(e.g||[]).forEach(function(g){if(g.s&&!(room.guest&&g.u===myPk()))sl.push({ap:apP(g.ap)})});if(room.guest&&room.sl)sl.push({ap:myAp});
  sl.slice(0,2).forEach(function(q,i){var oy=BED.y+24+i*32;drawSleeper(c,q.ap,BED.x+104,oy+10,1.0,t);YRA2.bedQuilt(c,BED.x,oy-14,BED.w,34,bst,t)});
  if(!sl.length)YRA2.bedQuilt(c,BED.x,BED.y,BED.w,BED.h,bst,t);
  if(sl.length){c.font='800 '+(14+Math.sin(t*2)*2)+'px "Chakra Petch",sans-serif';c.fillStyle='#bfe3ff';c.textAlign='left';c.fillText('Z',BED.x+60,BED.y-8-((t*14)%16));c.fillText('z',BED.x+78,BED.y-22-((t*10)%12));if(sl.length>1){c.fillStyle='#ffb3d9';c.fillText('♥',BED.x+120,BED.y-12-Math.sin(t*3)*3)}}
  /* ayakta duranlar + eşyalar (derinlik sıralı) */
  var ex=[];
  var ownerPos=own?null:{x:e.ox||7*TW,y:e.oy||CH-40};
  if(own){if(!room.sl)ex.push(charFn(c,myAp,room.px,room.py,t,room.mv,P.nick,room.fl))}
  else{if(e.oi&&!e.os)ex.push(charFn(c,ownerAp,ownerPos.x,ownerPos.y,t,0,e.n,1));if(!room.sl)ex.push(charFn(c,myAp,room.px,room.py,t,room.mv,P.nick,room.fl))}
  (e.g||[]).forEach(function(g){if(g.s||(room.guest&&g.u===myPk()))return;var o=room.ov['g'+g.u]=room.ov['g'+g.u]||{x:g.x||7*TW,y:g.y||CH-40};o.x+=((g.x||o.x)-o.x)*.12;o.y+=((g.y||o.y)-o.y)*.12;ex.push(charFn(c,apP(g.ap),o.x,o.y,t,0,g.n,1))});
  drawItemsSorted(c,items,t,ex);
  /* kapı */
  YRA2.door(c,6*TW,CH,3*TW,t);YRA2.flush(c);YRA2.vig(c,CW,CH);
  /* etkileşim ipuçları */
  if(room.ov.note>0){room.ov.note-=.016;c.fillStyle='#ffd23f';c.font='800 18px sans-serif';c.fillText('♪ ♫',room.px+20,room.py-70-(1.2-room.ov.note)*20)}
  if(room.ov.cat>0){room.ov.cat-=.016;c.fillStyle='#fff';c.font='700 12px "Chakra Petch",sans-serif';c.fillText('Miyav! 🐾',room.px,room.py-72)}
  if(room.ov.fish>0){room.ov.fish-=.016;c.fillStyle='#fff';c.font='700 12px "Chakra Petch",sans-serif';c.fillText('Balıklar mutlu 🐠',room.px,room.py-72)}
  if(room.ov.warm>0){room.ov.warm-=.016;c.fillStyle='#ffb27a';c.font='700 12px "Chakra Petch",sans-serif';c.fillText('Ne kadar sıcak 🔥',room.px,room.py-72)}
  if(room.ov.star>0){room.ov.star-=.016;c.fillStyle='#ffd23f';c.font='700 12px "Chakra Petch",sans-serif';c.fillText('✨ Süsler parlıyor',room.px,room.py-72)}
  if(!room.sl&&room.tab!==1&&nearThing(room.px,room.py,80)){c.fillStyle='rgba(255,255,255,.9)';c.font='800 11px "Chakra Petch",sans-serif';c.textAlign='center';c.fillText('E: kullan',room.px,room.py+16)}
  /* düzenleme modu: ızgara */
  if(room.tab===1&&!room.guest){c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1;for(var gx=0;gx<=COLS;gx++){c.beginPath();c.moveTo(gx*TW,0);c.lineTo(gx*TW,CH);c.stroke()}c.fillStyle='rgba(255,255,255,.85)';c.font='800 12px "Chakra Petch",sans-serif';c.textAlign='center';c.fillText(room.sel?'Yerleştirmek için kareye dokun: '+DEC[room.sel].n:'Kaldırmak için eşyaya dokun',CW/2,CH-8)}
  if(room.sl&&Date.now()-room.slT>=8000){c.fillStyle='#7dff9b';c.font='800 13px "Chakra Petch",sans-serif';c.textAlign='center';c.fillText('Dinlendin! Kalkabilirsin.',CW/2,72)}
  room.raf=requestAnimationFrame(loop)}
window.YKN={init:function(api){D=api;Y=D.Y;P=D.P;G=D.G;clearInterval(TICK);var go=function(){if(!online())return;ensureClaim();send({t:'evq'});if(hm())syncMine()};setTimeout(go,9000);TICK=setInterval(function(){if(!room)go()},45000)},
 near:near,collect:collect,open:openSign,hand:hand,claim:claim,release:release,owner:function(id){var e=entry(id);return e&&e.u!==myPk()&&!(hm()&&hm().pl===id)?e:null},online:online,syncMine:syncMine,dbg:function(){return{R:R,room:room}}};
})();
