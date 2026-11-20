/* Yaxest Pişti: 2 kişilik klasik Türk kart oyunu (oda mantığı + arayüz) */
(function(){
'use strict';
var T=function(s){return window.YT?YT(s):s};
var SU=['♣','♦','♥','♠'],RK=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
function mk(){var d=[];for(var s=0;s<4;s++)for(var r=1;r<=13;r++)d.push({r:r,s:s});for(var i=d.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=d[i];d[i]=d[j];d[j]=t}return d}
function pts(c){if(c.r===2&&c.s===0)return 2;if(c.r===10&&c.s===1)return 3;return(c.r===1||c.r===11)?1:0}
function score(s,p){var n=0;s.cap[p].forEach(function(c){n+=pts(c)});if(s.cap[p].length>s.cap[1-p].length)n+=3;return n+s.pis[p]}
function deal(s){for(var k=0;k<4;k++){s.hands[0].push(s.deck.pop());s.hands[1].push(s.deck.pop())}}
var no=0;
var logic={n:2,hot:false,
 init:function(){var s={deck:mk(),table:[],hands:[[],[]],cap:[[],[]],pis:[0,0],pc:[0,0],turn:no%2,last:-1,over:null,id:++no,ev:null};
   for(var i=0;i<4;i++)s.table.push(s.deck.pop());deal(s);return s},
 turn:function(s){return s.over?null:s.turn},over:function(s){return s.over},
 apply:function(s,seat,a){if(s.over)return{error:'Oyun bitti'};if(seat!==s.turn)return{error:'Sıra sende değil'};
   var h=s.hands[seat];if(typeof a.c!=='number'||a.c<0||a.c>=h.length)return{error:'Geçersiz hamle'};
   var c=h.splice(a.c,1)[0],top=s.table[s.table.length-1],ev=null;
   if(top&&(c.r===top.r||c.r===11)){var pis=s.table.length===1&&c.r===top.r;if(pis){var v=c.r===11?20:10;s.pis[seat]+=v;s.pc[seat]++;ev={t:'pisti',seat:seat,v:v}}
     s.cap[seat]=s.cap[seat].concat(s.table,[c]);s.table=[];s.last=seat;ev=ev||{t:'cap',seat:seat}}
   else{s.table.push(c);ev={t:'put',seat:seat}}
   ev.card=c;s.ev=ev;s.turn=1-seat;
   if(!s.hands[0].length&&!s.hands[1].length){if(s.deck.length)deal(s);else{if(s.table.length&&s.last>=0){s.cap[s.last]=s.cap[s.last].concat(s.table);s.table=[]}
     var a0=score(s,0),a1=score(s,1);s.over={winner:a0===a1?-1:(a0>a1?0:1),t:a0===a1?'Berabere':'Oyun bitti',sc:[a0,a1]}}}
   return{}},
 view:function(s,seat){return{hand:s.hands[seat],oh:s.hands[1-seat].length,top:s.table.length?s.table[s.table.length-1]:null,tn:s.table.length,deck:s.deck.length,cap:[s.cap[seat].length,s.cap[1-seat].length],pis:[s.pc[seat],s.pc[1-seat]],sc:s.over?[s.over.sc[seat],s.over.sc[1-seat]]:null,turn:s.turn,me:seat,ev:s.ev,id:s.id,n:s.cap[0].length+s.cap[1].length+s.table.length+s.deck.length*0+s.hands[0].length*17+s.hands[1].length*31}},
 bot:function(s,seat,level){var h=s.hands[seat],top=s.table[s.table.length-1],best=0,bs=-1e9;
   h.forEach(function(c,i){var sc=Math.random();
     if(level>1){var cap=top&&(c.r===top.r||c.r===11);
       if(cap){sc+=20;if(s.table.length===1&&c.r===top.r)sc+=15;sc+=s.table.length*2;if(c.r===11&&!(s.table.length>=3||s.table.length===1&&top.r!==11))sc-=(level>2?25:8);else if(c.r===11)sc-=3}
       else{sc-=pts(c)*2;if(c.r===11)sc-=6;if(top&&s.table.length===1&&level>2)sc+=0;if(s.table.length===1)sc-=2;
         // rakibe tek kart bırakma: kart az puanlıysa ve sayısı çok bilinenlerden
         }}
     if(sc>bs){bs=sc;best=i}});return{c:best}}};
window.YXPistiLogic=logic;
var C,V=null,lastN=-1,lastId=-1;
var CSS='.pw{max-width:520px;margin:0 auto;display:grid;gap:12px}.pcard{width:58px;height:84px;border-radius:9px;background:#fff;color:#1b1535;display:grid;place-items:center;font:800 1.25rem/1 system-ui;box-shadow:0 3px 10px rgba(0,0,0,.45);position:relative;flex:none;user-select:none}.pcard.r{color:#e0244f}.pcard small{position:absolute;left:5px;top:3px;font-size:.78rem}.pcard i{font-style:normal;font-size:1.7rem}'+
'.pcard.bk{background:repeating-linear-gradient(45deg,#6b3fd4,#6b3fd4 6px,#4a2aa0 6px,#4a2aa0 12px);border:3px solid #fff}.prow{display:flex;gap:8px;justify-content:center;min-height:90px;align-items:center}.pmy .pcard{cursor:pointer;transition:transform .12s}.pmy.on .pcard:active{transform:translateY(-8px)}.pmy:not(.on) .pcard{opacity:.6;cursor:default}'+
'.ptb{display:flex;justify-content:center;align-items:center;gap:14px;background:radial-gradient(#1f7a4d,#0f4d30);border-radius:50% / 40%;padding:22px 16px;border:5px solid #6b4328;min-height:130px;position:relative}.ptb .pcard{width:70px;height:100px;font-size:1.5rem}.pn{position:absolute;right:14px;bottom:8px;background:rgba(0,0,0,.5);border-radius:999px;padding:2px 10px;font-weight:800;font-size:.85rem}'+
'.pin{display:flex;justify-content:space-between;gap:8px;font-weight:800;font-size:.88rem;color:var(--mute,#a9a3cf)}.pin b{color:var(--yellow,#ffd23f)}.pst{text-align:center;font-weight:800;min-height:1.4em;color:var(--mute,#a9a3cf)}.pst.me{color:var(--yellow,#ffd23f)}.pfx{position:absolute;left:50%;top:6px;transform:translateX(-50%);font-weight:800;color:#ffd23f;text-shadow:0 2px 6px #000;animation:pf 1.2s forwards;pointer-events:none}@keyframes pf{to{opacity:0;top:-14px}}';
function $(i){return document.getElementById(i)}
function card(c,cls){return'<div class="pcard '+(c.s===1||c.s===2?'r ':'')+(cls||'')+'"><small>'+RK[c.r]+'</small><i>'+SU[c.s]+'</i></div>'}
var ui={mount:function(r,ctx){C=ctx;lastN=-1;lastId=-1;
  if(!$('pi-css')){var s=document.createElement('style');s.id='pi-css';s.textContent=CSS;document.head.appendChild(s)}
  r.innerHTML='<div class="pw"><div class="pin"><span id="pi1"></span><span id="pi2"></span></div><div class="prow" id="poh"></div><div class="ptb" id="ptb"></div><div class="pst" id="pst"></div><div class="prow pmy" id="pmy"></div></div>';
  r.addEventListener('click',function(e){var c=e.target.closest('[data-c]');if(c&&V&&V.turn===V.me&&!V.sc)C.send({c:+c.dataset.c})})},
 view:function(v,meta){V=v;if(v.id!==lastId){lastId=v.id;lastN=-1}if(v.n!==lastN){if(lastN>=0&&v.ev){C.sfx(v.ev.t==='pisti'?'win':v.ev.t==='cap'?'good':'tap')}lastN=v.n}draw(meta)}};
function draw(meta){var over=meta&&meta.over,m=V.turn===V.me&&!over;
  var oh='';for(var i=0;i<V.oh;i++)oh+='<div class="pcard bk"></div>';$('poh').innerHTML=oh;
  var fx='';if(V.ev&&V.ev.t==='pisti')fx='<div class="pfx">'+(V.ev.seat===V.me?'':'')+'PİŞTİ! +'+V.ev.v+'</div>';
  $('ptb').innerHTML=(V.top?card(V.top):'<span style="opacity:.6;font-weight:800">'+T('Masa boş')+'</span>')+(V.tn>1?'<div class="pn">'+V.tn+' '+T('kart')+'</div>':'')+fx;
  $('pmy').className='prow pmy'+(m?' on':'');$('pmy').innerHTML=V.hand.map(function(c,i){return'<div data-c="'+i+'" role="button">'+card(c)+'</div>'}).join('');
  $('pi1').innerHTML=T('Sen')+': <b>'+V.cap[0]+'</b> '+T('kart')+' · '+T('Pişti')+' <b>'+V.pis[0]+'</b>'+(V.sc?' · <b>'+V.sc[0]+'</b> '+T('puan'):'');
  $('pi2').innerHTML=T('Rakip')+': <b>'+V.cap[1]+'</b> '+T('kart')+' · '+T('Pişti')+' <b>'+V.pis[1]+'</b>'+(V.sc?' · <b>'+V.sc[1]+'</b> '+T('puan'):'');
  var st=$('pst');st.className='pst'+(m?' me':'');st.textContent=over?'':(m?T('Sıra sende'):T('Rakibin sırası'))+' · '+T('Deste')+': '+V.deck}
if(window.YXRoom)YXRoom.start({id:'pisti',title:'Pişti',logic:logic,ui:ui,intro:T('Masadaki üstteki kartla aynı sayıyı ya da Vale (J) at, tüm kartları topla. Tek kartı kapatırsan Pişti! Arkadaşınla oda kur ya da bota karşı oyna.')});
})();
