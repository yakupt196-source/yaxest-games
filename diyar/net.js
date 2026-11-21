/* Yaxest Diyarı: çok oyunculu istemci (varlık, konum, sohbet). Adres net-config.js'te; boşsa devre dışı. */
(function(){
'use strict';
var D,G,P,Y,TS=48,ws=null,others={},me=null,msgs={w:[],l:[],k:[],p:[]},camX0=0,camY0=0,myPk='',lastSend=0,lastX=0,lastY=0,retry=0,live=0,timer=0,beat=0;
function url(){return window.YD_NET||''}
function on(){return !!(ws&&ws.readyState===1&&me)}
function init(api){D=api;G=D.G;P=D.P;Y=D.Y;TS=Y.TS;live=1;retry=0;if(window.YSoc)try{YSoc.init({D:D,Net:window.YNet})}catch(e){console.error(e)}if(!url()||!window.YXAcct||!YXAcct.token){D.say('🌐 Çevrimiçi kapalı: hesap modülü yok.','sys');return}connect()}
function connect(){if(!live||ws||!G)return;
  YXAcct.token().then(function(s){if(!live||ws)return;var w;try{w=new WebSocket(url())}catch(e){return}ws=w;
    D.say('🌐 Sunucuya ulaşılıyor…','sys');w.onopen=function(){D.say('🌐 Bağlantı açıldı, giriş doğrulanıyor…','sys');send({t:'hi',tok:s.idToken,nick:P.nick,ap:P.ap,lv:P.lv,x:Math.round(G.px),y:Math.round(G.py)})};
    w.onmessage=function(e){var m;try{m=JSON.parse(e.data)}catch(x){return}hand(m)};
    w.onclose=function(ev){if(!me&&retry<2)D.say('🌐 Bağlantı kapandı (kod '+(ev&&ev.code)+').','sys');ws=null;me=null;others={};if(live){clearTimeout(timer);timer=setTimeout(connect,Math.min(30000,2000*Math.pow(2,retry++)))}};
    w.onerror=function(){try{w.close()}catch(e){}}}).catch(function(e){if(retry<1)D.say('🌐 Çevrimiçi için hesabına giriş yapmalısın (Hesap menüsü). '+((e&&e.code)||''),'sys');if(live){clearTimeout(timer);timer=setTimeout(connect,Math.min(30000,3000*Math.pow(2,retry++)))}})}
function send(o){if(ws&&ws.readyState===1)ws.send(JSON.stringify(o))}
function hand(m){
  if(m.t==='hi'){me=m.id;myPk=m.k||'';retry=0;others={};(m.roster||[]).forEach(add);D.say('🌐 Çevrimiçi dünyaya bağlandın ('+(1+Object.keys(others).length)+' oyuncu). Sohbet: Dünya/Yerel sekmesi.','sys');if(window.YSoc)YSoc.onHi(m)}
  else if(m.t==='join'){add(m.p);D.say('🌐 '+m.p.n+' diyara katıldı.','x')}
  else if(m.t==='leave'){delete others[m.id]}
  else if(m.t==='p'){var o=others[m.id];if(o){o.x=m.x;o.y=m.y;o.f=m.f;if(m.lv)o.lv=m.lv}}
  else if(m.t==='snap'){G.px=m.x;G.py=m.y}
  else if(m.t==='c'){if(window.YSoc&&YSoc.blocked(m.k))return;var k=m.ch==='l'?'l':m.ch==='k'?'k':m.ch==='p'?'p':'w';bub(m.id,m.m);msgs[k].push({n:m.n,m:m.m,me:m.id===me});if(msgs[k].length>50)msgs[k].shift();D.say((k==='k'?'🛡️ ':k==='p'?'🎉 ':'💬 ')+m.n+': '+m.m,'x');refresh()}
  else if(m.t==='dup'){live=0;clearTimeout(timer);D.say('🌐 Hesabınla başka bir yerden girildi, bu bağlantı kapatıldı.','sys')}
  else if(m.t==='ct'){if(others[m.id])others[m.id].cg=m.cg;if(window.YSoc)YSoc.hand(m)}
  else if(m.t==='sys'){D.say('⚠️ '+m.m,'sys')}
  else if(m.t==='err'){D.say('Çevrimiçi giriş yapılamadı (hesabına yeniden giriş yap).','sys')}
  else if(window.YSoc){YSoc.hand(m)}}
function add(p){if(!p||!p.id||p.id===me)return;others[p.id]={id:p.id,k:p.k,n:p.n,ap:p.ap,lv:p.lv||1,x:p.x,y:p.y,dx:p.x,dy:p.y,f:0,cg:p.cg||'',w:p.w||0,l:p.l||0}}
function tick(dt){if(!G)return;if(window.YSoc)try{YSoc.tick(dt)}catch(e){}beat+=dt;if(!on())return;lastSend+=dt;
  var mv=Math.abs(G.px-lastX)+Math.abs(G.py-lastY)>2;
  if((mv&&lastSend>.15)||beat>3){send({t:'p',x:Math.round(G.px),y:Math.round(G.py),f:mv?1:0,lv:P.lv,ap:beat>3?P.ap:undefined});lastSend=0;lastX=G.px;lastY=G.py;if(beat>3)beat=0}
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
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var curTab=1;
function list(k){return msgs[k].map(function(x){return'<div><b style="color:'+(x.me?'#ffd23f':'#8fd6ff')+'">'+esc(x.n)+':</b> '+esc(x.m)+'</div>'}).join('')||'<div style="color:var(--mute)">Henüz mesaj yok.</div>'}
function chatTab(i){if(i<1||i>4)return'';curTab=i;if(!url())return'';if(!on())return'<div style="color:var(--mute)">Çevrimiçi dünyaya bağlanılıyor… (hesabına giriş yapmış olmalısın)</div>';
  if(i===3&&!(window.YSoc&&YSoc.inClan()))return'<div style="color:var(--mute)">Bir klanda değilsin. 👥 menüsünden klan kur ya da katıl.</div>';if(i===4&&!(window.YSoc&&YSoc.inParty()))return'<div style="color:var(--mute)">Bir partide değilsin. Bir oyuncuya dokunup partiye çağır.</div>';
  var k=i===2?'l':i===3?'k':i===4?'p':'w';return'<div id="ncl" data-k="'+k+'">'+list(k)+'</div><form id="ncf" style="display:flex;gap:6px;margin-top:8px"><input id="nci" maxlength="120" autocomplete="off" placeholder="'+(k==='l'?'Yakındakilere yaz':k==='k'?'Klana yaz':k==='p'?'Partiye yaz':'Herkese yaz')+'" style="flex:1;min-width:0;padding:9px 12px;border-radius:12px;border:1.5px solid #ffffff33;background:#ffffff12;color:inherit;font:inherit"><button class="btn" type="submit">Gönder</button></form>'}
function chatBind(el){var f=el&&el.querySelector('#ncf');if(!f)return;var c=el.querySelector('#ncl');c.scrollTop=c.scrollHeight;
  f.onsubmit=function(e){e.preventDefault();var i=f.querySelector('#nci'),v=i.value.trim();if(!v)return;send({t:'c',m:v,ch:c.dataset.k});i.value=''}}
function refresh(){var c=document.getElementById('ncl');if(c){c.innerHTML=list(c.dataset.k);c.scrollTop=c.scrollHeight}}
function leave(){if(window.YSoc)try{YSoc.leave()}catch(e){}live=0;clearTimeout(timer);if(ws){try{ws.close()}catch(e){}}ws=null;me=null;others={}}
function pick(cx,cy){var wx=cx+Math.round(camX0),wy=cy+Math.round(camY0),b=null,bd=52;for(var id in others){var o=others[id],d=Math.hypot(o.dx-wx,o.dy-wy+8);if(d<bd){bd=d;b=o}}return b}
function seed(k,list){if(msgs[k]&&!msgs[k].length)msgs[k]=list.map(function(x){return{n:x.n,m:x.m,me:false}})}
window.YNet={send:send,others:function(){return others},myId:function(){return me},myPk:function(){return myPk},bub:bub,pick:pick,seed:seed,refresh:refresh,init:init,tick:tick,draw:draw,on:on,chatTab:chatTab,chatBind:chatBind,leave:leave,count:function(){return Object.keys(others).length+(on()?1:0)}};
})();
