/* Yaxest Diyarı: çok oyunculu istemci (varlık, konum, sohbet). Adres net-config.js'te; boşsa devre dışı. */
(function(){
'use strict';
var D,G,P,Y,TS=48,ws=null,others={},me=null,msgs={w:[],l:[],k:[],p:[]},camX0=0,camY0=0,myPk='',lastSend=0,lastX=0,lastY=0,retry=0,live=0,timer=0,beat=0;
var wn=0,WNAMES=['Gün Doğumu','Kızıl Vadi','Kurt Geçidi','Zirve','Yıldız Ovası'];
function url(){var b=window.YD_NET||'';return b&&wn?b+(b.indexOf('?')<0?'?':'&')+'w='+wn:b}
function wUrl(){return(window.YD_NET||'').replace(/^wss:/,'https:').replace(/^ws:/,'http:').replace(/\/ws.*$/,'/worlds')}
/* dünya seçici: girmeden önce bir dünya seç */
function pickWorld(first){if(!G)return;var old=0;try{old=+localStorage.getItem('yx-world')||0}catch(e){}
  var el=document.getElementById('wpick');if(!el){el=document.createElement('div');el.id='wpick';el.style.cssText='position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;background:rgba(5,3,15,.88)';document.body.appendChild(el)}
  G.paused=true;el.style.display='flex';
  function draw(list){var h='<div style="width:min(94vw,560px);max-height:92vh;overflow:auto;background:#161232;border:1.5px solid #ffc450;border-radius:16px;padding:12px;color:#fff"><h2 style="margin:0 0 4px;color:#ffd98a">🌍 Dünya Seç</h2><p style="margin:0 0 10px;font-size:.82rem;color:#b9b4d8">Karakterin, klanın ve arkadaşların her dünyada aynıdır. Dünya sadece kiminle aynı yerde oynayacağını belirler: arkadaşlarınla aynı dünyaya gir.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:6px">';
    list.forEach(function(w){var full=w.n>=w.max,p=w.max?Math.round(w.n/w.max*100):0,col=p>80?'#ff6b6b':p>50?'#ffd23f':'#5be39a';
      h+='<button type="button" data-w="'+w.w+'" '+(full?'disabled':'')+' style="display:block;width:100%;margin:0;padding:7px 10px;border-radius:12px;border:1.5px solid '+(w.w===old?'#ffd23f':'rgba(255,255,255,.2)')+';background:#201a48;color:#fff;font:inherit;text-align:left;cursor:pointer;opacity:'+(full?.5:1)+'"><b>'+(WNAMES[w.w-1]||'Dünya '+w.w)+'</b> <small style="color:#b9b4d8">· Dünya '+w.w+(w.w===old?' · son girdiğin':'')+'</small><div style="height:6px;border-radius:3px;background:#0d0a24;margin:4px 0 2px"><i style="display:block;height:100%;width:'+p+'%;border-radius:3px;background:'+col+'"></i></div><small style="color:#b9b4d8">'+(w.n>=0&&w.known!==0?w.n+' / '+w.max+' oyuncu'+(full?' · DOLU':''):'Doluluk bilinmiyor')+'</small></button>'});
    h+='</div><button type="button" id="woff" style="margin-top:8px;width:100%;padding:9px;border-radius:12px;border:1.5px solid rgba(255,255,255,.2);background:transparent;color:#b9b4d8;font:inherit;cursor:pointer">Tek başıma oyna (çevrimdışı)</button></div>';el.innerHTML=h;
    el.querySelectorAll('[data-w]').forEach(function(b){b.onclick=function(){choose(+b.dataset.w)}});el.querySelector('#woff').onclick=function(){wn=0;live=0;el.style.display='none';G.paused=false;D.say('🌐 Çevrimdışı oynuyorsun. /dunya yazarak istediğin an dünya seçebilirsin.','sys')}}
  function choose(n){wn=n;try{localStorage.setItem('yx-world',n)}catch(e){}el.style.display='none';G.paused=false;live=1;retry=0;connect()}
  var fb=[1,2,3,4,5].map(function(i){return{w:i,n:0,max:150,known:0}});draw(fb);
  try{fetch(wUrl()).then(function(r){return r.json()}).then(function(l){if(Array.isArray(l)&&l.length&&el.style.display!=='none')draw(l)}).catch(function(){})}catch(e){}}
function on(){return !!(ws&&ws.readyState===1&&me)}
function init(api){D=api;G=D.G;P=D.P;Y=D.Y;TS=Y.TS;loadH();chUi();live=1;retry=0;if(window.YSoc)try{YSoc.init({D:D,Net:window.YNet})}catch(e){console.error(e)}if(!(window.YD_NET)||!window.YXAcct||!YXAcct.token){D.say('🌐 Çevrimiçi kapalı: hesap modülü yok.','sys');return}pickWorld(true)}
function connect(){if(!live||ws||!G)return;
  YXAcct.token().then(function(s){if(!live||ws)return;var w;try{w=new WebSocket(url())}catch(e){return}ws=w;
    D.say('🌐 Sunucuya ulaşılıyor…','sys');w.onopen=function(){D.say('🌐 Bağlantı açıldı, giriş doğrulanıyor…','sys');send({t:'hi',tok:s.idToken,nick:P.nick,ap:P.ap,lv:P.lv,x:Math.round(G.px),y:Math.round(G.py)})};
    w.onmessage=function(e){var m;try{m=JSON.parse(e.data)}catch(x){return}hand(m)};
    w.onclose=function(ev){if(!me&&retry<2)D.say('🌐 Bağlantı kapandı (kod '+(ev&&ev.code)+').','sys');ws=null;me=null;others={};if(live){clearTimeout(timer);timer=setTimeout(connect,Math.min(30000,2000*Math.pow(2,retry++)))}};
    w.onerror=function(){try{w.close()}catch(e){}}}).catch(function(e){if(retry<1)D.say('🌐 Çevrimiçi için hesabına giriş yapmalısın (Hesap menüsü). '+((e&&e.code)||''),'sys');if(live){clearTimeout(timer);timer=setTimeout(connect,Math.min(30000,3000*Math.pow(2,retry++)))}})}
function send(o){if(ws&&ws.readyState===1)ws.send(JSON.stringify(o))}
function hand(m){
  if(m.t==='hi'){me=m.id;myPk=m.k||'';retry=0;others={};(m.roster||[]).forEach(add);D.say('🌐 '+(WNAMES[wn-1]||'Dünya '+wn)+' dünyasına bağlandın ('+(1+Object.keys(others).length)+' oyuncu). Sohbet: Dünya/Yerel sekmesi.','sys');if(window.YSoc)YSoc.onHi(m)}
  else if(m.t==='join'){add(m.p);D.say('🌐 '+m.p.n+' diyara katıldı.','x')}
  else if(m.t==='leave'){delete others[m.id]}
  else if(m.t==='p'){var o=others[m.id];if(o){if(Math.abs(m.x-o.x)+Math.abs(m.y-o.y)>500){o.dx=m.x;o.dy=m.y}o.x=m.x;o.y=m.y;o.f=m.f;if(m.lv)o.lv=m.lv}}
  else if(m.t==='snap'){if(G.mode==='world'&&isFinite(m.x)&&isFinite(m.y)&&!G.dead){G.px=m.x;G.py=m.y;lastX=m.x;lastY=m.y}}
  else if(m.t==='c'){if(window.YSoc&&YSoc.blocked(m.k))return;var k=m.ch==='l'?'l':m.ch==='k'?'k':m.ch==='p'?'p':'w',cg=m.cg||(others[m.id]&&others[m.id].cg)||(m.id===me&&window.YSoc?YSoc.myClan():'')||'';bub(m.id,m.m);var mn=m.id!==me&&mentioned(m.m);msgs[k].push({n:m.n,m:m.m,me:m.id===me,cg:cg,t:Date.now(),mn:mn});if(msgs[k].length>50)msgs[k].shift();if(mn){D.say('🔔 '+m.n+' senden bahsetti: '+m.m,'sys');try{D.floatTxt(G.px,G.py-100,'🔔 '+m.n,'#ffd23f')}catch(e){}}saveH();
    D.say('('+CH[k][0]+') '+m.n+(cg&&k!=='k'?' ['+cg+']':'')+': '+m.m,'x');
    var pc=document.getElementById('p-chat'),nc=document.getElementById('ncl'),vis=pc&&pc.classList.contains('on')&&nc&&nc.dataset.k===k;if(!vis&&m.id!==me){unread[k]++;ub()}refresh()}
  else if(m.t==='dup'){live=0;clearTimeout(timer);D.say('🌐 Hesabınla başka bir yerden girildi, bu bağlantı kapatıldı.','sys')}
  else if(m.t==='ct'){if(others[m.id])others[m.id].cg=m.cg;if(window.YSoc)YSoc.hand(m)}
  else if(m.t==='adm'){applyAdm(m.q)}
  else if(m.t==='ban'){live=0;clearTimeout(timer);var bu=m.until?' ('+new Date(m.until).toLocaleString('tr-TR')+' tarihine kadar)':' (süresiz)';D.say('⛔ Hesabın yasaklandı'+bu+(m.m?': '+m.m:'')+'. İtiraz için: yakupt196@gmail.com','sys');try{alert('⛔ Hesabın yasaklandı'+bu+(m.m?'\nSebep: '+m.m:''))}catch(e){}}
  else if(m.t==='sys'){D.say('⚠️ '+m.m,'sys')}
  else if(m.t==='err'){D.say(m.m==='hub'?'Merkez sunucuya ulaşılamadı, biraz sonra /dunya ile tekrar dene.':'Çevrimiçi giriş yapılamadı (hesabına yeniden giriş yap).','sys')}
  else if(window.YSoc){YSoc.hand(m)}}
/* yönetici eşyası/ayarı: sunucudan gelir, kayda bir kez uygulanır (P.adm kimlik listesi çift teslimi önler) */
function applyAdm(q){if(!q||!q.id||!P)return;send({t:'aa',id:q.id});P.adm=P.adm||[];if(P.adm.indexOf(q.id)>=0)return;P.adm.push(q.id);if(P.adm.length>60)P.adm.shift();
  var tx=[],sg=q.k==='take'?-1:1,cl=function(v){return Math.max(0,Math.min(1e9,Math.floor(+v||0)))};
  if(q.k==='lv'){var v=Math.max(1,Math.min(150,Math.floor(+q.v)||1));P.lv=v;P.xp=0;tx.push('⭐ Seviye '+v)}
  else if(q.k==='give'||q.k==='take'){
    if(q.g){var g=cl(q.g);P.gold=Math.max(0,(P.gold||0)+sg*g);tx.push('🪙 '+(sg>0?'+':'−')+g)}
    Object.keys(q.it||{}).forEach(function(k){var n=Math.max(0,Math.min(1e6,Math.floor(+q.it[k]||0)));if(!n)return;var a=k.split(':'),nm=k;
      try{if(k==='jeton'){if(sg>0&&window.YX&&YX.earn){YX.earn(n,'gift',true);tx.push('🎟️ '+n+' jeton')}else if(window.YX&&YX.spend){YX.spend(n);tx.push('🎟️ −'+n+' jeton')}}
      else if(k.indexOf('cos.')===0){var c=k.split('.');P.cs=P.cs||{};if(window.YL&&YL.CAT[c[1]]){if(sg>0)P.cs[c[1]+':'+c[2]]=1;else delete P.cs[c[1]+':'+c[2]];tx.push('👗 '+(sg>0?'+':'−')+'kostüm')}}
      else if(a[0]==='m'&&Y.MATS[a[1]]){P[a[1]]=Math.max(0,(P[a[1]]||0)+sg*n);tx.push((sg>0?'+':'−')+n+' '+Y.MATS[a[1]].n)}
      else if(a[0]==='r'&&window.YR&&YR.R[a[1]]){P.rn=P.rn||{};P.rn[a[1]]=Math.max(0,(P.rn[a[1]]||0)+sg*n);tx.push((sg>0?'+':'−')+n+' '+YR.R[a[1]].n)}
      else if(window.YK&&YK.valid(k)){if(sg>0)YK.put(P,k,n);else YK.take(P,k,n);tx.push((sg>0?'+':'−')+YK.name(k))}}catch(e){}})}
  if(!tx.length)return;D.saveNow();D.say((sg>0||q.k==='lv'?'🎁 ':'⚠️ ')+(q.msg||'Yönetici değişikliği')+': '+tx.join(' · '),'sys')}
var snT=99;
function sendSn(){if(!P||!Y)return;var mats={};Object.keys(Y.MATS).forEach(function(k){if(P[k]>0)mats[k]=P[k]});send({t:'sn',d:{cls:P.cls,lv:P.lv,xp:P.xp,gold:P.gold,wt:P.wt,at:P.at,mats:mats,rn:P.rn||{},ow:P.ow||{},oz:P.oz||{},pe:P.pe||{}}})}
function add(p){if(!p||!p.id||p.id===me)return;others[p.id]={id:p.id,k:p.k,n:p.n,ap:p.ap,lv:p.lv||1,x:p.x,y:p.y,dx:p.x,dy:p.y,f:0,cg:p.cg||'',w:p.w||0,l:p.l||0}}
function tick(dt){if(!G)return;if(window.YSoc)try{YSoc.tick(dt)}catch(e){}beat+=dt;if(!on())return;snT+=dt;if(snT>(me?105:999)){snT=0;try{sendSn()}catch(e){}}lastSend+=dt;
  var wx=G.px,wy=G.py;if(G.mode!=='world'){if(!G.saveW)return;wx=G.saveW.x;wy=G.saveW.y}/* zindanda arena koordinatı sunucuya gitmez */
  if(!isFinite(wx)||!isFinite(wy))return;
  var mv=Math.abs(wx-lastX)+Math.abs(wy-lastY)>2;
  if((mv&&lastSend>.15)||beat>3){var jmp=Math.hypot(wx-lastX,wy-lastY)>260&&lastX!==0;send({t:'p',x:Math.round(wx),y:Math.round(wy),f:mv?1:0,lv:P.lv,j:jmp?1:undefined,ap:beat>3?P.ap:undefined});lastSend=0;lastX=wx;lastY=wy;if(beat>3)beat=0}
  var k=Math.min(1,dt*9);for(var id in others){var o=others[id];o.dx+=(o.x-o.dx)*k;o.dy+=(o.y-o.dy)*k}}
var bubs={};
function bub(id,txt){bubs[id]={m:String(txt).slice(0,120),t:performance.now()}}
function wrap(ctx,txt){var w=txt.split(/\s+/),L=[],c='';w.forEach(function(x){while(ctx.measureText(x).width>170&&x.length>3){var i=x.length;while(i>1&&ctx.measureText(x.slice(0,i)).width>170)i--;if(c){L.push(c);c=''}L.push(x.slice(0,i));x=x.slice(i)}var n=c?c+' '+x:x;if(ctx.measureText(n).width>170&&c){L.push(c);c=x}else c=n});if(c)L.push(c);if(L.length>4){L=L.slice(0,4);L[3]=L[3].slice(0,-1)+'…'}return L}
function bubble(ctx,id,x,y){var b=bubs[id];if(!b)return;var age=(performance.now()-b.t)/1000,life=3+Math.min(5,b.m.length/18);if(age>life){delete bubs[id];return}
  ctx.save();ctx.globalAlpha=age>life-.6?Math.max(0,(life-age)/.6):Math.min(1,age/.12+.3);ctx.font='700 13px system-ui,sans-serif';var L=wrap(ctx,b.m),w=0;L.forEach(function(l){w=Math.max(w,ctx.measureText(l).width)});w+=18;var h=L.length*16+12,bx=x-w/2,by=y-h-10;
  ctx.fillStyle='rgba(255,255,255,.96)';ctx.strokeStyle='#1b1640';ctx.lineWidth=2.5;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(bx,by,w,h,10);else ctx.rect(bx,by,w,h);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-7,by+h-1);ctx.lineTo(x,by+h+9);ctx.lineTo(x+7,by+h-1);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='rgba(255,255,255,.96)';ctx.fillRect(x-6,by+h-3,12,4);
  ctx.fillStyle='#1b1640';ctx.textAlign='center';ctx.textBaseline='middle';L.forEach(function(l,i){ctx.fillText(l,x,by+10+i*16)});ctx.restore()}
function draw(ctx,camX,camY,t,W,H){if(!on()||G.mode!=='world')return;camX0=camX;camY0=camY;
  try{bubble(ctx,me,G.px,G.py+15+YL.topY(P.ap||YL.def())-50)}catch(e){}
  for(var id in others){var o=others[id],sx=o.dx,sy=o.dy,cx=o.dx-camX,cy=o.dy-camY;if(cx<-80||cy<-90||cx>W+80||cy>H+80)continue;
    var mv=Math.abs(o.x-o.dx)+Math.abs(o.y-o.dy)>3;
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sx,sy+22,20,8,0,0,6.28);ctx.fill();
    try{YL.hero(ctx,sx,sy+21,o.ap||YL.def(),t,mv,1)}catch(e){}
    try{var pl=window.YSoc?YSoc.plate(o):null;YA.plate(ctx,sx,sy+15+YL.topY(o.ap||YL.def()),pl?pl.t:o.n+' · Sv'+o.lv,pl?pl.c:'#8fd6ff')}catch(e){}
    if(window.YSoc)try{YSoc.drawOther(ctx,o,sx,sy+15+YL.topY(o.ap||YL.def()))}catch(e){}
    try{bubble(ctx,id,sx,sy+15+YL.topY(o.ap||YL.def())-24)}catch(e){}}
  if(window.YSoc)try{YSoc.draw(ctx,camX,camY,t,W,H)}catch(e){}}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var curTab=1;
var CH={w:['Dünya','#ffb02e','Tüm oyuncular görür'],l:['Yerel','#d0d6e6','Yakındaki oyuncular görür (yaklaşık 20 kare)'],k:['Klan','#c07cff','Sadece klan üyeleri görür'],p:['Parti','#7dff9b','Sadece parti üyeleri görür']},unread={w:0,l:0,k:0,p:0};
function hm(t){var d=new Date(t||Date.now());return('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
function list(k){return msgs[k].map(function(x){return'<div style="margin:2px 0'+(x.mn?';background:#ffd23f22;border-left:3px solid #ffd23f;padding-left:5px':'')+'"><small style="color:var(--mute)">'+hm(x.t)+'</small> <b style="color:'+CH[k][1]+'">('+CH[k][0]+')</b> <b style="color:'+(x.me?'#ffd23f':'#8fd6ff')+'">'+esc(x.n)+(x.cg&&k!=='k'?' <span style="color:#c07cff;font-weight:600">['+esc(x.cg)+']</span>':'')+':</b> '+esc(x.m)+'</div>'}).join('')||'<div style="color:var(--mute)">Henüz mesaj yok.</div>'}
function ub(){var n=unread.w+unread.l+unread.k+unread.p,b=document.getElementById('cbd'),ic=document.getElementById('ichat');if(ic&&!b){b=document.createElement('i');b.id='cbd';b.className='sbd';b.style.display='none';ic.style.position='relative';ic.appendChild(b)}if(b){b.style.display=n?'block':'none';b.textContent=n>9?'9+':n}}

/* ---- sohbet: kanal, komutlar, bahsetme, geçmiş ---- */
var ch='w',hT=0;
function escRe(s){return String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function mentioned(t){if(!P||!P.nick)return false;try{return new RegExp('(^|[^a-z0-9çğıöşü])@?'+escRe(P.nick)+'($|[^a-z0-9çğıöşü])','i').test(t)}catch(e){return false}}
function hk(){return'yx-ch-'+(P&&P.nick)}
function saveH(){clearTimeout(hT);hT=setTimeout(function(){try{localStorage.setItem(hk(),JSON.stringify({w:msgs.w.slice(-30),l:msgs.l.slice(-30)}))}catch(e){}},1500)}
function loadH(){try{var h=JSON.parse(localStorage.getItem(hk())||'null');if(!h)return;['w','l'].forEach(function(k){if(h[k]&&!msgs[k].length)msgs[k]=h[k].map(function(x){return{n:x.n,m:x.m,me:!!x.me,cg:x.cg,t:x.t,mn:x.mn}})})}catch(e){}}
function canCh(k){return k==='w'||k==='l'||(k==='k'&&window.YSoc&&YSoc.inClan())||(k==='p'&&window.YSoc&&YSoc.inParty())}
function chUi(){var c=document.getElementById('chch'),i=document.getElementById('chi');if(c){c.textContent=CH[ch][0];c.style.color=CH[ch][1];c.style.borderColor=CH[ch][1]}if(i)i.placeholder='Mesaj yaz…  /yardim'}
function setCh(k){if(!canCh(k)){D.say(k==='k'?'Bir klanda değilsin.':'Bir partide değilsin.','sys');return false}ch=k;chUi();return true}
function cycleCh(){var o=['w','l','k','p'],i=o.indexOf(ch);for(var q=1;q<=4;q++){var k=o[(i+q)%4];if(canCh(k)){ch=k;break}}chUi()}
function sendChat(v,fc){v=String(v||'').trim();if(!v)return;var k=fc||ch;if(!canCh(k)){k='w'}
  if(v.charAt(0)==='/')return cmd(v,k);
  if(window.YT)try{YT.ev('chat')}catch(e){}
  if(!on()){D.say('🌐 Çevrimiçi değilsin; bağlanılıyor…','sys');return}
  send({t:'c',m:v,ch:k})}
function cmd(v,k){var sp=v.indexOf(' '),c=(sp<0?v:v.slice(0,sp)).toLowerCase(),r=sp<0?'':v.slice(sp+1).trim(),S=window.YSoc,one={'/d':'w','/y':'l','/k':'k','/p':'p'};
  if(one[c]){if(!r){setCh(one[c]);return}if(!canCh(one[c])){D.say(one[c]==='k'?'Bir klanda değilsin.':'Bir partide değilsin.','sys');return}return sendChat(r,one[c])}
  if(c==='/w'||c==='/f'||c==='/fisilda'){if(S)S.whisper(r)}
  else if(c==='/r'){if(S)S.reply(r)}
  else if(c==='/me'){if(r)send({t:'c',m:'* '+P.nick+' '+r,ch:k})}
  else if(c==='/zar'){var z=Math.floor(Math.random()*100)+1;send({t:'c',m:'🎲 '+P.nick+' zar attı: '+z+'/100'+(z===100?' 🎉 KRİTİK!':z===1?' 💀':''),ch:k})}
  else if(c==='/arkadas'){if(r)send({t:'iv',k:'fr',n:r.split(' ')[0]});else D.say('Kullanım: /arkadas takmaad','sys')}
  else if(c==='/parti'){if(r)send({t:'iv',k:'pt',n:r.split(' ')[0]});else D.say('Kullanım: /parti takmaad','sys')}
  else if(c==='/dunya'){leave();live=0;pickWorld()}
  else if(c==='/ev'){if(window.YDock)YDock.tp('home')}
  else if(c==='/kasaba'){if(window.YDock)YDock.tp('town')}
  else if(c==='/saat'){D.say('🕒 '+new Date().toLocaleTimeString('tr-TR'),'sys')}
  else if(c==='/hazine'){if(window.YTr)YTr.open()}
  else if(c==='/rehber'){if(window.YT)YT.show()}
  else if(c==='/temizle'){msgs.w=[];msgs.l=[];refresh();saveH()}
  else if(c==='/yardim'||c==='/?'){['📜 Sohbet komutları:','/w ad mesaj → arkadaşa fısılda · /r mesaj → son fısıltıya cevap','/d /y /k /p mesaj → Dünya/Yerel/Klan/Parti kanalına (mesajsız: kanalı seç)','/dunya → dünya değiştir · /me eylem · /zar · /saat · /temizle','/arkadas ad · /parti ad → istek gönder','/ev · /kasaba → ışınlan · /hazine · /rehber','@takmaad yazarsan o oyuncunun ekranında 🔔 çıkar.'].forEach(function(l){D.say(l,'sys')})}
  else D.say('Bilinmeyen komut. /yardim yaz.','sys')}
function seen(k){unread[k]=0;ub()}
function chatTab(i){if(i<1||i>4)return'';curTab=i;if(!url())return'';if(!on())return'<div style="color:var(--mute)">Çevrimiçi dünyaya bağlanılıyor… (hesabına giriş yapmış olmalısın)</div>';
  if(i===3&&!(window.YSoc&&YSoc.inClan()))return'<div style="color:var(--mute)">Bir klanda değilsin. 👥 menüsünden klan kur ya da katıl.</div>';if(i===4&&!(window.YSoc&&YSoc.inParty()))return'<div style="color:var(--mute)">Bir partide değilsin. Bir oyuncuya dokunup partiye çağır.</div>';
  var k=i===2?'l':i===3?'k':i===4?'p':'w';seen(k);return'<div id="ncl" data-k="'+k+'">'+list(k)+'</div><div style="font-size:.76rem;margin-top:6px;color:'+CH[k][1]+'">Yazdığın kanal: <b>('+CH[k][0]+')</b> · <span style="color:var(--mute)">'+CH[k][2]+'</span></div><form id="ncf" style="display:flex;gap:6px;margin-top:8px"><input id="nci" maxlength="120" autocomplete="off" placeholder="'+(k==='l'?'Yakındakilere yaz':k==='k'?'Klana yaz':k==='p'?'Partiye yaz':'Herkese yaz')+'" style="flex:1;min-width:0;padding:9px 12px;border-radius:12px;border:1.5px solid #ffffff33;background:#ffffff12;color:inherit;font:inherit"><button class="btn" type="submit">Gönder</button></form>'}
function chatBind(el){var f=el&&el.querySelector('#ncf');if(!f)return;var c=el.querySelector('#ncl');c.scrollTop=c.scrollHeight;
  f.onsubmit=function(e){e.preventDefault();var i=f.querySelector('#nci'),v=i.value.trim();if(!v)return;sendChat(v,c.dataset.k);i.value=''}}
function refresh(){var c=document.getElementById('ncl');if(c){c.innerHTML=list(c.dataset.k);c.scrollTop=c.scrollHeight}}
function leave(){if(window.YSoc)try{YSoc.leave()}catch(e){}live=0;clearTimeout(timer);if(ws){try{ws.close()}catch(e){}}ws=null;me=null;others={}}
function unreadOf(k){return unread[k]||0}
function pick(cx,cy){var wx=cx+Math.round(camX0),wy=cy+Math.round(camY0),b=null,bd=52;for(var id in others){var o=others[id],d=Math.hypot(o.dx-wx,o.dy-wy+8);if(d<bd){bd=d;b=o}}return b}
function seed(k,list){if(msgs[k]&&!msgs[k].length)msgs[k]=list.map(function(x){return{n:x.n,m:x.m,me:false}})}
window.YNet={applyAdm:applyAdm,pickWorld:pickWorld,world:function(){return wn},sendChat:sendChat,curCh:function(){return ch},cycleCh:cycleCh,setCh:setCh,chUi:chUi,unread:unreadOf,send:send,others:function(){return others},myId:function(){return me},myPk:function(){return myPk},bub:bub,pick:pick,seed:seed,refresh:refresh,init:init,tick:tick,draw:draw,on:on,chatTab:chatTab,chatBind:chatBind,leave:leave,count:function(){return Object.keys(others).length+(on()?1:0)}};
})();
