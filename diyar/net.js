/* Yaxest Diyarı: çok oyunculu istemci (varlık, konum, sohbet). Adres net-config.js'te; boşsa devre dışı. */
(function(){
'use strict';
var D,G,P,Y,TS=48,ws=null,others={},me=null,msgs={w:[],l:[]},lastSend=0,lastX=0,lastY=0,retry=0,live=0,timer=0,beat=0;
function url(){return window.YD_NET||''}
function on(){return !!(ws&&ws.readyState===1&&me)}
function init(api){D=api;G=D.G;P=D.P;Y=D.Y;TS=Y.TS;live=1;retry=0;if(!url()||!window.YXAcct||!YXAcct.token)return;connect()}
function connect(){if(!live||ws||!G)return;
  YXAcct.token().then(function(s){if(!live||ws)return;var w;try{w=new WebSocket(url())}catch(e){return}ws=w;
    w.onopen=function(){send({t:'hi',tok:s.idToken,nick:P.nick,ap:P.ap,lv:P.lv,x:Math.round(G.px),y:Math.round(G.py)})};
    w.onmessage=function(e){var m;try{m=JSON.parse(e.data)}catch(x){return}hand(m)};
    w.onclose=function(){ws=null;me=null;others={};if(live){clearTimeout(timer);timer=setTimeout(connect,Math.min(30000,2000*Math.pow(2,retry++)))}};
    w.onerror=function(){try{w.close()}catch(e){}}}).catch(function(){if(live){clearTimeout(timer);timer=setTimeout(connect,Math.min(30000,3000*Math.pow(2,retry++)))}})}
function send(o){if(ws&&ws.readyState===1)ws.send(JSON.stringify(o))}
function hand(m){
  if(m.t==='hi'){me=m.id;retry=0;others={};(m.roster||[]).forEach(add);D.say('🌐 Çevrimiçi dünyaya bağlandın ('+(1+Object.keys(others).length)+' oyuncu). Sohbet: Dünya/Yerel sekmesi.','sys')}
  else if(m.t==='join'){add(m.p);D.say('🌐 '+m.p.n+' diyara katıldı.','x')}
  else if(m.t==='leave'){delete others[m.id]}
  else if(m.t==='p'){var o=others[m.id];if(o){o.x=m.x;o.y=m.y;o.f=m.f;if(m.lv)o.lv=m.lv}}
  else if(m.t==='snap'){G.px=m.x;G.py=m.y}
  else if(m.t==='c'){var k=m.ch==='l'?'l':'w';msgs[k].push({n:m.n,m:m.m,me:m.id===me});if(msgs[k].length>50)msgs[k].shift();D.say('💬 '+m.n+': '+m.m,'x');refresh()}
  else if(m.t==='sys'){D.say('⚠️ '+m.m,'sys')}
  else if(m.t==='err'){D.say('Çevrimiçi giriş yapılamadı (hesabına yeniden giriş yap).','sys')}}
function add(p){if(!p||!p.id||p.id===me)return;others[p.id]={id:p.id,n:p.n,ap:p.ap,lv:p.lv||1,x:p.x,y:p.y,dx:p.x,dy:p.y,f:0}}
function tick(dt){if(!G)return;beat+=dt;if(!on())return;lastSend+=dt;
  var mv=Math.abs(G.px-lastX)+Math.abs(G.py-lastY)>2;
  if((mv&&lastSend>.15)||beat>3){send({t:'p',x:Math.round(G.px),y:Math.round(G.py),f:mv?1:0,lv:P.lv,ap:beat>3?P.ap:undefined});lastSend=0;lastX=G.px;lastY=G.py;if(beat>3)beat=0}
  var k=Math.min(1,dt*9);for(var id in others){var o=others[id];o.dx+=(o.x-o.dx)*k;o.dy+=(o.y-o.dy)*k}}
function draw(ctx,camX,camY,t,W,H){if(!on()||G.mode!=='world')return;
  for(var id in others){var o=others[id],sx=o.dx,sy=o.dy,cx=o.dx-camX,cy=o.dy-camY;if(cx<-80||cy<-90||cx>W+80||cy>H+80)continue;
    var mv=Math.abs(o.x-o.dx)+Math.abs(o.y-o.dy)>3;
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sx,sy+22,20,8,0,0,6.28);ctx.fill();
    try{YL.hero(ctx,sx,sy+21,o.ap||YL.def(),t,mv,1)}catch(e){}
    try{YA.plate(ctx,sx,sy+15+YL.topY(o.ap||YL.def()),o.n+' · Sv'+o.lv,'#8fd6ff')}catch(e){}}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var curTab=1;
function list(k){return msgs[k].map(function(x){return'<div><b style="color:'+(x.me?'#ffd23f':'#8fd6ff')+'">'+esc(x.n)+':</b> '+esc(x.m)+'</div>'}).join('')||'<div style="color:var(--mute)">Henüz mesaj yok.</div>'}
function chatTab(i){if(i!==1&&i!==2)return'';curTab=i;if(!url())return'';if(!on())return'<div style="color:var(--mute)">Çevrimiçi dünyaya bağlanılıyor… (hesabına giriş yapmış olmalısın)</div>';
  var k=i===2?'l':'w';return'<div id="ncl" data-k="'+k+'">'+list(k)+'</div><form id="ncf" style="display:flex;gap:6px;margin-top:8px"><input id="nci" maxlength="120" autocomplete="off" placeholder="'+(k==='l'?'Yakındakilere yaz':'Herkese yaz')+'" style="flex:1;min-width:0;padding:9px 12px;border-radius:12px;border:1.5px solid #ffffff33;background:#ffffff12;color:inherit;font:inherit"><button class="btn" type="submit">Gönder</button></form>'}
function chatBind(el){var f=el&&el.querySelector('#ncf');if(!f)return;var c=el.querySelector('#ncl');c.scrollTop=c.scrollHeight;
  f.onsubmit=function(e){e.preventDefault();var i=f.querySelector('#nci'),v=i.value.trim();if(!v)return;send({t:'c',m:v,ch:c.dataset.k});i.value=''}}
function refresh(){var c=document.getElementById('ncl');if(c){c.innerHTML=list(c.dataset.k);c.scrollTop=c.scrollHeight}}
function leave(){live=0;clearTimeout(timer);if(ws){try{ws.close()}catch(e){}}ws=null;me=null;others={}}
window.YNet={init:init,tick:tick,draw:draw,on:on,chatTab:chatTab,chatBind:chatBind,leave:leave,count:function(){return Object.keys(others).length+(on()?1:0)}};
})();
