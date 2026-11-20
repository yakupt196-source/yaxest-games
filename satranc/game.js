/* Yaxest Satranç: oda mantığı ve arayüz (motor: engine.js) */
(function(){
'use strict';
var E=window.YXChess,T=function(s){return window.YT?YT(s):s};
var gameNo=0;
var GL={1:'♚',2:'♛',3:'♜',4:'♝',5:'♞',6:'♟'};
function glyph(v){var a=Math.abs(v);return['','♟','♞','♝','♜','♛','♚'][a]+'︎'}
var REASON={mat:'Şah mat',pat:'Pat (berabere)','50':'Berabere (50 hamle)',tekrar:'Berabere (tekrar)',yetersiz:'Berabere (yetersiz taş)'};

var logic={n:2,hot:true,
 init:function(n,o){var white=gameNo%2;gameNo++;return{st:E.startPos(),white:white,last:null,over:null,offer:-1,moves:0,id:gameNo}},
 col:function(s,seat){return seat===s.white?1:-1},
 turn:function(s){if(s.over)return null;return s.st.turn===1?s.white:1-s.white},
 over:function(s){return s.over},
 apply:function(s,seat,a){
   if(s.over)return{error:'Oyun bitti'};
   if(a.resign){s.over={winner:1-seat,t:'Teslim oldu'};return{}}
   if(a.draw==='offer'){s.offer=seat;return{}}
   if(a.draw==='decline'){s.offer=-1;return{}}
   if(a.draw==='accept'){if(s.offer>=0&&s.offer!==seat){s.over={winner:-1,t:'Berabere (anlaşma)'};return{}}return{error:'Geçersiz hamle'}}
   if(a.mv){if(logic.turn(s)!==seat)return{error:'Sıra sende değil'};
     var m=E.play(s.st,a.mv[0],a.mv[1],a.mv[2]);if(!m)return{error:'Geçersiz hamle'};
     s.last=[m.f,m.t];s.moves++;s.offer=-1;s.cap=!!m.cap;
     var r=E.status(s.st);if(r){s.over={winner:r.winner===0?-1:(r.winner===1?s.white:1-s.white),t:REASON[r.r]}}
     return{}}
   return{error:'Geçersiz hamle'}},
 view:function(s,seat){return{fen:E.toFen(s.st),me:logic.col(s,seat),last:s.last,offer:s.offer,n:s.moves,id:s.id,cap:s.cap,white:s.white,chk:E.inCheck(s.st,s.st.turn)}},
 bot:function(s,seat,level){var m=E.bestMove(s.st,level);return m?{mv:[m.f,m.t,m.p||0]}:null}};

/* ---------------- arayüz ---------------- */
var C=null,root,sel=-1,lastN=-1,lastId=-1,V=null,STATE=null,resArm=0;
var CSS='.cb{display:grid;gap:8px;max-width:560px;margin:0 auto;width:100%}'+
'.cbd{--s:min(calc(100vw - 28px),520px);width:var(--s);height:var(--s);margin:0 auto;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);border-radius:10px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.45),0 0 0 3px rgba(255,255,255,.12);touch-action:manipulation}'+
'.cs{position:relative;display:grid;place-items:center;font-size:calc(var(--s)/8*.78);line-height:1;cursor:pointer;background:#ecd9b0;font-family:"Segoe UI Symbol","Noto Sans Symbols 2","Apple Symbols",system-ui,sans-serif}'+
'.cs.d{background:#a47551}.cs.lm{background:#f2e07a}.cs.d.lm{background:#cfae3c}.cs.sel{background:#7fd1ff!important}'+
'.cs.chk{background:radial-gradient(circle,#ff3d5c 0,#ff3d5c 35%,transparent 75%),#ecd9b0}.cs.d.chk{background:radial-gradient(circle,#ff3d5c 0,#ff3d5c 35%,transparent 75%),#a47551}'+
'.cs .pc{display:block;transform:translateY(-1px);pointer-events:none}.cs .pc.w{color:#fff;-webkit-text-stroke:1.2px #1b1535;text-shadow:0 2px 3px rgba(0,0,0,.35)}.cs .pc.b{color:#231a4a;-webkit-text-stroke:1px #fff;text-shadow:0 2px 3px rgba(0,0,0,.35)}'+
'.cs .dot{position:absolute;width:30%;height:30%;border-radius:50%;background:rgba(27,21,53,.32);pointer-events:none}.cs .ring{position:absolute;inset:4%;border:4px solid rgba(27,21,53,.4);border-radius:50%;pointer-events:none}'+
'.cs .rk{position:absolute;left:3px;bottom:1px;font:800 10px system-ui;opacity:.55;color:#1b1535;pointer-events:none}.cs .fl{position:absolute;right:3px;top:1px;font:800 10px system-ui;opacity:.55;color:#1b1535;pointer-events:none}'+
'.cc{min-height:26px;display:flex;align-items:center;gap:6px;color:var(--mute,#a9a3cf);font-size:1.05rem;padding:0 4px}.cc .pc{font-size:1.15rem}.cc b{margin-left:auto;font-size:.85rem;color:var(--yellow,#ffd23f)}'+
'.ca{display:flex;gap:8px}.ca button{flex:1}.cof{background:var(--card,#1a1440);border:2px solid var(--yellow,#ffd23f);border-radius:16px;padding:10px 12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.cof span{flex:1;font-weight:800}'+
'.cpro{position:absolute;inset:0;background:rgba(11,8,32,.8);display:flex;align-items:center;justify-content:center;gap:10px;z-index:3}.cpro button{width:64px;height:64px;font-size:2.4rem;border:0;border-radius:14px;background:#ecd9b0;color:#1b1535;line-height:1}'+
'.cst{text-align:center;min-height:1.4em;font-weight:800;color:var(--mute,#a9a3cf)}.cst.me{color:var(--yellow,#ffd23f)}.cst.chk{color:var(--pink,#ff5c8a)}';
var INIT={1:8,2:2,3:2,4:2,5:1};
function counts(b){var c={1:{1:0,2:0,3:0,4:0,5:0},'-1':{1:0,2:0,3:0,4:0,5:0}};for(var i=0;i<128;i++){if(!E.on(i))continue;var v=b[i];if(!v)continue;var a=Math.abs(v);if(a<6)c[v>0?1:-1][a]++}return c}
var ui={
 mount:function(r,ctx){C=ctx;root=r;sel=-1;lastN=-1;lastId=-1;
   if(!document.getElementById('cb-css')){var st=document.createElement('style');st.id='cb-css';st.textContent=CSS;document.head.appendChild(st)}
   r.innerHTML='<div class="cb"><div class="cc" id="ccT"></div><div style="position:relative"><div class="cbd" id="cbd"></div><div class="cpro" id="cpro" hidden></div></div><div class="cc" id="ccB"></div><div class="cst" id="cst"></div><div class="cof" id="cof" hidden><span id="cofx"></span><button class="rbtn" id="cok">'+T('Kabul')+'</button><button class="rbtn alt" id="cno">'+T('Reddet')+'</button></div><div class="ca"><button class="rbtn alt" id="cdr">'+T('Beraberlik öner')+'</button><button class="rbtn alt" id="crs">'+T('Teslim ol')+'</button></div></div>';
   $('cdr').hidden=!!ctx.hot;
   $('cdr').onclick=function(){ctx.send({draw:'offer'});$('cdr').disabled=true};
   $('crs').onclick=function(){var b=$('crs');if(resArm){ctx.send({resign:1});resArm=0}else{resArm=1;b.textContent=T('Emin misin?');setTimeout(function(){resArm=0;b.textContent=T('Teslim ol')},2800)}};
   $('cok').onclick=function(){ctx.send({draw:'accept'})};$('cno').onclick=function(){ctx.send({draw:'decline'})};
   r.addEventListener('click',function(e){var t=e.target.closest('.cs');if(!t||!V)return;tap(+t.dataset.q)})},
 view:function(v,meta){V=v;STATE=E.fromFen(v.fen);
   if(v.id!==lastId){sel=-1;lastId=v.id;lastN=-1}
   if(v.n!==lastN){if(lastN>=0)C.sfx(v.cap?'good':'tap');lastN=v.n;sel=-1}
   draw(meta)}
};
function $(i){return document.getElementById(i)}
function flip(){return !C.hot&&V.me===-1}
function myTurn(){return STATE.turn===V.me}
function legalFrom(f){return E.legal(STATE).filter(function(m){return m.f===f})}
function tap(q){if(!STATE||STATE.turn!==V.me||(C.t&&false))return;
  var v=STATE.b[q];
  if(sel>=0){var ms=legalFrom(sel).filter(function(m){return m.t===q});
    if(ms.length){if(ms[0].p){promo(sel,q,ms.map(function(m){return m.p}));return}C.send({mv:[sel,q,0]});sel=-1;draw();return}}
  if(v&&(v>0?1:-1)===V.me&&sel!==q){sel=q;C.sfx('tap')}else sel=-1;draw()}
function promo(f,t,list){var p=$('cpro');p.hidden=false;p.innerHTML=list.map(function(x){return'<button data-p="'+x+'" aria-label="'+x+'"><span class="pc '+(V.me===1?'w':'b')+'" style="color:'+(V.me===1?'#fff':'#231a4a')+';-webkit-text-stroke:1px #1b1535">'+glyph(x)+'</span></button>'}).join('');
  p.onclick=function(e){var b=e.target.closest('button');if(!b)return;p.hidden=true;C.send({mv:[f,t,+b.dataset.p]});sel=-1;draw()}}
function draw(meta){
  var b=STATE.b,fl=flip(),moves=sel>=0?legalFrom(sel):[],tg={};moves.forEach(function(m){tg[m.t]=1});
  var kq=STATE.k[STATE.turn],html='';
  for(var rr=0;rr<8;rr++){for(var cc=0;cc<8;cc++){var r=fl?rr:7-rr,c=fl?7-cc:cc,q=r*16+c,v=b[q],dark=(r+c)%2===0;
    var cls='cs'+(dark?' d':'')+(V.last&&(V.last[0]===q||V.last[1]===q)?' lm':'')+(sel===q?' sel':'')+(V.chk&&kq===q?' chk':'');
    html+='<div class="'+cls+'" data-q="'+q+'" role="button" aria-label="'+E.sqName(q)+'">'+(cc===0?'<span class="rk">'+(r+1)+'</span>':'')+(rr===7?'<span class="fl">'+'abcdefgh'[c]+'</span>':'')+
     (v?'<span class="pc '+(v>0?'w':'b')+'">'+glyph(v)+'</span>':'')+(tg[q]?(v?'<span class="ring"></span>':'<span class="dot"></span>'):'')+'</div>'}}
  $('cbd').innerHTML=html;
  // yakalanan taşlar
  var cn=counts(b),own=V.me,opp=-V.me;
  function lost(side){var s='',sc=0;[5,4,3,2,1].forEach(function(a){var n=Math.max(0,INIT[a]-cn[side][a]);for(var i=0;i<n;i++)s+='<span class="pc">'+glyph(a)+'</span>';sc+=n*({1:1,2:3,3:3,4:5,5:9}[a])});return{h:s,s:sc}}
  var lo=lost(opp),lm=lost(own);// lo: rakibin kaybettikleri (benim yakaladıklarım)
  var adv=lo.s-lm.s;
  $('ccB').innerHTML=lo.h+(adv>0?'<b>+'+adv+'</b>':'');$('ccT').innerHTML=lm.h+(adv<0?'<b>+'+(-adv)+'</b>':'');
  // durum
  var st=$('cst'),over=meta&&meta.over;
  if(over)st.textContent='';else{var mine=STATE.turn===V.me&&!C.hot;st.className='cst'+(mine?' me':'')+(V.chk?' chk':'');
    st.textContent=(C.hot?'':T(V.me===1?'Beyazsın':'Siyahsın')+' · ')+(V.chk?T('Şah!')+' ':'')+(C.hot?T(STATE.turn===1?'Beyaz oynuyor':'Siyah oynuyor'):mine?T('Sıra sende'):T('Rakibin sırası'))}
  // beraberlik teklifi
  var of=$('cof');if(V.offer>=0&&!over){if(V.offer!==C.seat){of.hidden=false;$('cofx').textContent=T('Rakip beraberlik teklif ediyor');$('cok').hidden=false;$('cno').hidden=false}else{of.hidden=false;$('cofx').textContent=T('Teklif gönderildi');$('cok').hidden=true;$('cno').hidden=true}}else{of.hidden=true;$('cdr').disabled=false}
  $('crs').disabled=!!over;$('cdr').disabled=!!over||V.offer>=0;
  $('cpro').hidden=true}

if(window.YXRoom)YXRoom.start({id:'satranc',title:'Satranç',logic:logic,ui:ui,intro:T('Arkadaşınla oda kur, kodu paylaş. Tam kurallı satranç: rok, en passant, terfi. Bot ile de oynayabilirsin.')});
window.YXChessLogic=logic;
})();
