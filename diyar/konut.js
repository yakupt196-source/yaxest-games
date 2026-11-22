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
var CW=640,CH=400;
function enter(id,guest){if(room)return;var e=entry(id);if(!e&&!guest){D.say('Bu evde kimse yok.','sys');return}
  G=D.G;G.paused=true;room={id:id,guest:guest,sel:null,tab:0,sl:0,slT:0,ev:0,gcd:0,msg:'',t0:Date.now(),hbT:0,qT:0};
  var d=document.createElement('div');d.id='knroom';d.style.cssText='position:fixed;inset:0;z-index:4;background:rgba(6,4,18,.92);display:flex;flex-direction:column;align-items:center;overflow:auto;padding:8px;color:#fff;font-family:inherit';
  d.innerHTML='<div style="width:min(98vw,760px)"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><b id="knh" style="flex:1;font-size:1.02rem"></b><button class="btn alt" id="knx" type="button" style="min-height:34px">🚪 Çık</button></div><canvas id="knc" width="'+CW+'" height="'+CH+'" style="width:100%;border-radius:14px;border:2px solid #3b2a5a;background:#1a1230;touch-action:none"></canvas><div id="knb" style="margin-top:6px"></div></div>';
  document.body.appendChild(d);room.el=d;room.cv=$('knc');room.cx=room.cv.getContext('2d');
  $('knx').onclick=leave;room.cv.addEventListener('pointerdown',cvTap);
  if(guest)send({t:'evj',id:id,ap:apS()});else syncMine({in:1,hb:1});
  send({t:'evq'});room.raf=requestAnimationFrame(loop);room.iv=setInterval(beat,6000);roomRefresh()}
function leave(){if(!room)return;var id=room.id;if(room.sl)sleep(false,true);if(room.guest)send({t:'evl',id:id});else syncMine({in:0,sl:0});cancelAnimationFrame(room.raf);clearInterval(room.iv);try{room.el.remove()}catch(e){}room=null;if(G)G.paused=false;if(D)D.saveNow()}
function beat(){if(!room)return;if(room.guest)send({t:'evj',id:room.id,ap:apS()});else syncMine({hb:1,in:1});send({t:'evq'})}
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
function cvTap(ev){if(!room||room.guest||room.tab!==1)return;var r=room.cv.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*CW,y=(ev.clientY-r.top)/r.height*CH,h=hm();
  if(room.sel){var d=DEC[room.sel],ny=d.f?Math.max(190,Math.min(385,y)):Math.max(40,Math.min(150,y));h.lay=h.lay||[];h.lay.push({i:room.sel,x:Math.round(Math.max(20,Math.min(620,x))/CW*100),y:Math.round(ny/CH*100)});
    var pl=h.lay.filter(function(o){return o.i===room.sel}).length;if((h.dc[room.sel]|0)-pl<=0)room.sel=null;D.saveNow();syncMine();roomRefresh();return}
  var L=lay(),bi=-1,bd=44;for(var i=L.length-1;i>=0;i--){var d2=Math.hypot(L[i].x/100*CW-x,L[i].y/100*CH-y-18);if(d2<bd){bd=d2;bi=i}}
  if(bi>=0){L.splice(bi,1);D.saveNow();syncMine();room.msg='Eşya kaldırıldı (envanterinde duruyor).';roomRefresh()}}
/* ---- çizim ---- */
function ico(c,k,x,y,t){var d=DEC[k];
  if(k==='rug'){c.fillStyle='#b0453d';c.beginPath();c.ellipse(x,y+10,58,16,0,0,6.3);c.fill();c.strokeStyle='#ffd980';c.lineWidth=3;c.beginPath();c.ellipse(x,y+10,44,11,0,0,6.3);c.stroke();return}
  if(k==='plant'){c.fillStyle='#9a5a35';c.fillRect(x-10,y-4,20,20);c.fillStyle='#3f9a4a';for(var i=-2;i<=2;i++){c.beginPath();c.ellipse(x+i*8,y-14-Math.abs(i)*-3,6,14,i*.3,0,6.3);c.fill()}return}
  if(k==='lamp'){c.fillStyle='#5a3a22';c.fillRect(x-2,y-46,4,66);c.fillStyle='#ffd980';c.beginPath();c.moveTo(x-16,y-34);c.lineTo(x+16,y-34);c.lineTo(x+10,y-56);c.lineTo(x-10,y-56);c.fill();c.fillStyle='rgba(255,225,140,.2)';c.beginPath();c.arc(x,y-40,50+Math.sin(t*3)*3,0,6.3);c.fill();return}
  if(k==='fire'){c.fillStyle='#7a7388';c.fillRect(x-38,y-52,76,70);c.fillStyle='#2a2036';c.fillRect(x-26,y-34,52,52);c.fillStyle='#ff9d3d';c.beginPath();c.moveTo(x-16,y+16);c.quadraticCurveTo(x-8+Math.sin(t*9)*3,y-24,x,y-30);c.quadraticCurveTo(x+8,y-6,x+16,y+16);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.moveTo(x-7,y+16);c.quadraticCurveTo(x,y-10-Math.sin(t*11)*4,x+7,y+16);c.fill();c.fillStyle='rgba(255,150,50,.18)';c.beginPath();c.arc(x,y,70,0,6.3);c.fill();return}
  if(k==='piano'){c.fillStyle='#1d1a28';c.fillRect(x-48,y-30,96,48);c.fillStyle='#fff';c.fillRect(x-44,y-2,88,14);c.fillStyle='#1d1a28';for(var j=0;j<8;j++)c.fillRect(x-40+j*11,y-2,6,8);c.fillStyle='#3a3350';c.fillRect(x-44,y+18,6,12);c.fillRect(x+38,y+18,6,12);return}
  if(k==='aqua'){c.fillStyle='#35507a';c.fillRect(x-36,y-34,72,52);c.fillStyle='rgba(110,200,255,.55)';c.fillRect(x-32,y-30,64,44);c.fillStyle='#ff9d3d';c.beginPath();c.ellipse(x-10+Math.sin(t*1.4)*14,y-8,7,4,0,0,6.3);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.ellipse(x+12-Math.sin(t*1.1)*12,y+2,5,3,0,0,6.3);c.fill();return}
  if(k==='cat'){c.fillStyle='#8a5a30';c.beginPath();c.ellipse(x,y+10,26,9,0,0,6.3);c.fill();c.fillStyle='#e89a4a';c.beginPath();c.ellipse(x,y+2,18,12,0,0,6.3);c.fill();c.beginPath();c.moveTo(x-12,y-6);c.lineTo(x-8,y-16);c.lineTo(x-3,y-8);c.moveTo(x+12,y-6);c.lineTo(x+8,y-16);c.lineTo(x+3,y-8);c.fill();c.fillStyle='#2b2147';c.fillRect(x-7,y-2,3,2);c.fillRect(x+4,y-2,3,2);return}
  if(k==='tree'){c.fillStyle='#5a3a22';c.fillRect(x-4,y+6,8,14);c.fillStyle='#2d7a3f';for(var q=0;q<3;q++){c.beginPath();c.moveTo(x-26+q*5,y+8-q*22);c.lineTo(x,y-30-q*22);c.lineTo(x+26-q*5,y+8-q*22);c.fill()}for(var z=0;z<6;z++){c.fillStyle=['#ff4d6d','#ffd23f','#4dd0ff'][z%3];c.globalAlpha=.5+.5*Math.sin(t*3+z);c.beginPath();c.arc(x-14+z*5.5,y-6-(z%3)*20,2.4,0,6.3);c.fill()}c.globalAlpha=1;return}
  if(k==='cup'){c.fillStyle='#6a5a7a';c.fillRect(x-16,y+6,32,12);c.fillStyle='#ffd23f';c.beginPath();c.moveTo(x-14,y-26);c.lineTo(x+14,y-26);c.lineTo(x+8,y+6);c.lineTo(x-8,y+6);c.fill();c.fillRect(x-3,y+6,6,6);return}
  if(k==='chest'){c.fillStyle='#8a5a30';c.fillRect(x-24,y-10,48,28);c.fillStyle='#a8703a';c.fillRect(x-24,y-18,48,10);c.fillStyle='#ffd23f';c.fillRect(x-3,y-4,6,8);return}
  if(k==='globe'){c.fillStyle='#5a3a22';c.fillRect(x-12,y+10,24,8);c.fillRect(x-2,y-2,4,14);c.fillStyle='#3f86d6';c.beginPath();c.arc(x,y-14,17,0,6.3);c.fill();c.fillStyle='#4fb35a';c.beginPath();c.ellipse(x-4,y-16,7,5,.5,0,6.3);c.ellipse(x+7,y-8,4,6,0,0,6.3);c.fill();return}
  if(k==='desk'){c.fillStyle='#8a5a30';c.fillRect(x-40,y-8,80,10);c.fillRect(x-36,y+2,6,22);c.fillRect(x+30,y+2,6,22);c.fillStyle='#fff';c.fillRect(x-14,y-18,18,10);c.fillStyle='#ffd23f';c.fillRect(x+16,y-16,4,8);return}
  if(k==='paint'){c.fillStyle='#6b4a2b';c.fillRect(x-24,y-20,48,38);c.fillStyle='#8fc7ff';c.fillRect(x-20,y-16,40,30);c.fillStyle='#4fb35a';c.beginPath();c.moveTo(x-20,y+14);c.lineTo(x-4,y-2);c.lineTo(x+8,y+8);c.lineTo(x+20,y-4);c.lineTo(x+20,y+14);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.arc(x+10,y-8,4,0,6.3);c.fill();return}
  if(k==='shelf'){c.fillStyle='#6b4a2b';c.fillRect(x-36,y-10,72,5);c.fillRect(x-36,y+14,72,5);var cs=['#c0392b','#2a8fd8','#ffd23f','#4fb35a','#8a5ab8'];for(var b=0;b<9;b++){c.fillStyle=cs[b%5];c.fillRect(x-32+b*7.4,y-26+(b%3)*3,6,16-(b%3)*3);c.fillStyle=cs[(b+2)%5];c.fillRect(x-32+b*7.4,y-2+(b%2)*2,6,16-(b%2)*2)}return}
  if(k==='clock'){c.fillStyle='#6b4a2b';c.beginPath();c.arc(x,y,20,0,6.3);c.fill();c.fillStyle='#fff7e0';c.beginPath();c.arc(x,y,16,0,6.3);c.fill();c.strokeStyle='#2b2147';c.lineWidth=2;var tt=new Date();c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.sin(tt.getMinutes()/60*6.283)*13,y-Math.cos(tt.getMinutes()/60*6.283)*13);c.moveTo(x,y);c.lineTo(x+Math.sin((tt.getHours()%12)/12*6.283)*8,y-Math.cos((tt.getHours()%12)/12*6.283)*8);c.stroke();return}
  if(k==='flag'){c.fillStyle='#5a3a22';c.fillRect(x-22,y-30,44,4);c.fillStyle='#c0392b';c.beginPath();c.moveTo(x-18,y-26);c.lineTo(x+18,y-26);c.lineTo(x+18,y+26);c.lineTo(x,y+14);c.lineTo(x-18,y+26);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.arc(x,y-6,7,0,6.3);c.fill();return}
  if(k==='sword'){c.strokeStyle='#cfd6e6';c.lineWidth=5;c.beginPath();c.moveTo(x-26,y-22);c.lineTo(x+26,y+22);c.moveTo(x+26,y-22);c.lineTo(x-26,y+22);c.stroke();c.fillStyle='#ffd23f';c.fillRect(x-4,y-4,8,8);return}}
function drawSleeper(c,ap,x,y,sc,t){c.save();c.translate(x,y);c.rotate(-Math.PI/2);try{YL.hero(c,0,0,ap,t,false,sc)}catch(e){}c.restore()}
function drawStand(c,ap,x,y,t,name){try{YL.hero(c,x,y,ap,t,false,1.05)}catch(e){}if(name){c.font='700 11px "Chakra Petch",sans-serif';c.textAlign='center';c.fillStyle='rgba(14,10,32,.75)';var w=c.measureText(name).width+12;c.fillRect(x-w/2,y+4,w,15);c.fillStyle='#fff';c.fillText(name,x,y+15)}}
function loop(){if(!room)return;var c=room.cx,t=(Date.now()-room.t0)/1000,e=entry(room.id)||{d:[],g:[],lv:1},th=theme(e.d),own=!room.guest;
  var hr=3;try{hr=YX2.dbg.hourP()}catch(er){}var night=(typeof hr==='number'&&(hr>=19||hr<6))||false;
  c.clearRect(0,0,CW,CH);
  /* duvar & zemin */
  c.fillStyle=WALLS[th.wp]||WALLS[0];c.fillRect(0,0,CW,170);c.fillStyle='rgba(0,0,0,.06)';for(var i=0;i<CW;i+=32)c.fillRect(i,0,2,170);
  c.fillStyle='#6b4a2b';c.fillRect(0,164,CW,10);
  var fg=c.createLinearGradient(0,174,0,CH);fg.addColorStop(0,'#b88a55');fg.addColorStop(1,'#8f6638');c.fillStyle=fg;c.fillRect(0,174,CW,CH-174);c.strokeStyle='rgba(60,35,15,.25)';c.lineWidth=1.5;for(var j=0;j<9;j++){c.beginPath();c.moveTo(0,190+j*24);c.lineTo(CW,190+j*24);c.stroke()}
  /* pencere */
  c.fillStyle='#4a3524';c.fillRect(268,28,104,102);c.fillStyle=night?'#162044':'#8fd3ff';c.fillRect(274,34,92,90);
  if(night){c.fillStyle='#fff';for(var s=0;s<9;s++){c.globalAlpha=.4+.6*Math.abs(Math.sin(t+s));c.fillRect(280+(s*37)%80,40+(s*23)%70,2,2)}c.globalAlpha=1;c.fillStyle='#fff7c2';c.beginPath();c.arc(340,56,9,0,6.3);c.fill()}else{c.fillStyle='#ffd23f';c.beginPath();c.arc(344,54,10,0,6.3);c.fill();c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.ellipse(300+Math.sin(t*.3)*10,70,16,6,0,0,6.3);c.fill()}
  c.fillStyle='#4a3524';c.fillRect(318,34,4,90);c.fillRect(274,76,92,4);
  /* kapı */
  c.fillStyle='#5a3a22';c.fillRect(570,60,56,114);c.fillStyle='#ffd23f';c.beginPath();c.arc(582,120,3,0,6.3);c.fill();
  /* yatak */
  var bd=BEDS[th.bd]||BEDS[0],bx=40,by=208;
  c.fillStyle='#5a3a22';c.fillRect(bx-8,by-48,14,128);c.fillStyle=bd.c;c.fillRect(bx-4,by-40,6,16);
  c.fillStyle='#6b4a2b';c.fillRect(bx,by+56,230,10);c.fillRect(bx,by+10,6,56);c.fillRect(bx+224,by+30,6,36);
  c.fillStyle=bd.c2;c.fillRect(bx+6,by+18,218,44);
  /* nesneler + yatak sıralı çizim */
  var items=th.it.map(function(o){return{o:o,y:o.y/100*CH+(DEC[o.i]&&DEC[o.i].f?0:-999)}});
  items.sort(function(a,b){return a.y-b.y});
  items.forEach(function(q){if(!DEC[q.o.i])return;ico(c,q.o.i,q.o.x/100*CW,q.o.y/100*CH,t)});
  /* uyuyanlar */
  var sl=[];var ownerSleeping=own?room.sl:!!e.os;var myAp=apP(apS());
  var ownerAp=own?myAp:apP(e.ap||'{}');
  if(ownerSleeping)sl.push({ap:ownerAp});
  (e.g||[]).forEach(function(g){if(g.s&&!(room.guest&&g.u===myPk()))sl.push({ap:apP(g.ap)})});
  if(room.guest&&room.sl)sl.push({ap:myAp});
  sl.slice(0,2).forEach(function(q,i){var oy=by+26+i*18;c.fillStyle='#fff';c.beginPath();c.ellipse(bx+92,oy+8,24,11,0,0,6.3);c.fill();drawSleeper(c,q.ap,bx+198,oy+12,1.45,t);
    c.fillStyle=bd.c;c.globalAlpha=.95;c.beginPath();c.roundRect?c.roundRect(bx+146,oy-2,80,30,8):c.rect(bx+146,oy-2,80,30);c.fill();c.globalAlpha=1;c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=2;c.beginPath();c.moveTo(bx+152,oy+8);c.lineTo(bx+220,oy+8);c.stroke()});
  if(!sl.length){c.fillStyle='#fff';c.beginPath();c.ellipse(bx+40,by+38,20,10,0,0,6.3);c.ellipse(bx+40,by+56,20,10,0,0,6.3);c.fill();c.fillStyle=bd.c;c.fillRect(bx+70,by+26,154,38)}
  if(sl.length){c.font='800 '+(15+Math.sin(t*2)*2)+'px "Chakra Petch",sans-serif';c.fillStyle='#bfe3ff';c.textAlign='left';c.fillText('Z',bx+90,by-6-((t*14)%20));c.fillText('z',bx+110,by-22-((t*10)%16));if(sl.length>1){c.fillStyle='#ffb3d9';c.fillText('♥',bx+160,by-14-Math.sin(t*3)*3)}}
  /* ayakta duranlar */
  var stand=[];if(own){if(!room.sl)stand.push({ap:myAp,n:P.nick})}else{if(e.oi&&!e.os)stand.push({ap:ownerAp,n:e.n});if(!room.sl)stand.push({ap:myAp,n:P.nick+' (sen)'})}
  (e.g||[]).forEach(function(g){if(!g.s&&!(room.guest&&g.u===myPk()))stand.push({ap:apP(g.ap),n:g.n})});
  stand.slice(0,5).forEach(function(q,i){drawStand(c,q.ap,330+i*58,345+((i%2)*8),t,q.n)});
  /* seçili eşya ipucu */
  if(room.sel&&own){c.fillStyle='rgba(255,255,255,.12)';c.fillRect(0,DEC[room.sel].f?190:40,CW,DEC[room.sel].f?200:112);c.fillStyle='#fff';c.font='700 12px "Chakra Petch",sans-serif';c.textAlign='center';c.fillText('Yerleştirmek için dokun: '+DEC[room.sel].n,CW/2,DEC[room.sel].f?380:162)}
  if(room.sl&&Date.now()-room.slT>=8000){c.fillStyle='#7dff9b';c.font='800 13px "Chakra Petch",sans-serif';c.textAlign='center';c.fillText('Dinlendin! Kalkabilirsin.',CW/2,24)}
  room.raf=requestAnimationFrame(loop)}
window.YKN={init:function(api){D=api;Y=D.Y;P=D.P;G=D.G;clearInterval(TICK);var go=function(){if(!online())return;ensureClaim();send({t:'evq'});if(hm())syncMine()};setTimeout(go,9000);TICK=setInterval(function(){if(!room)go()},45000)},
 near:near,collect:collect,open:openSign,hand:hand,claim:claim,release:release,owner:function(id){var e=entry(id);return e&&e.u!==myPk()&&!(hm()&&hm().pl===id)?e:null},online:online,syncMine:syncMine,dbg:function(){return{R:R,room:room}}};
})();
