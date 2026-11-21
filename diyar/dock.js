/* Yaxest Diyarı: derli toplu mobil HUD, tek menü düğmesi, ışınlanma, sohbet çubuğu. */
(function(){
'use strict';
function $(i){return document.getElementById(i)}
var cd=0;
function D(){return window.__yd}
function tp(kind){var d=D(),G=d&&d.G,P=d&&d.P,Y=d&&d.Y;if(!G||!P||G.mode!=='world'||G.paused||G.dead>0)return;
  var now=Date.now();if(now<cd)return d.say('⏳ Işınlanma '+Math.ceil((cd-now)/1000)+' sn sonra hazır.','sys');
  if(G.t-G.lastHurt<6)return d.say('Savaşırken ışınlanamazsın.','sys');
  var x,y;if(kind==='home'){var h=G.houses.filter(function(o){return o.mine})[0];if(!h)return d.say('🏠 Evin yok. Emlakçı kasabanın güneyinde, arsa alıp ev kurabilirsin.','sys');x=h.x;y=h.y+78}else{x=Y.CX*Y.TS;y=Y.CY*Y.TS+70}
  d.floatTxt(G.px,G.py-50,'✨','#ffd23f');G.px=x;G.py=y;G.gather=null;cd=now+45000;d.floatTxt(G.px,G.py-50,kind==='home'?'🏠 Eve vardın':'🏘 Kasabadasın','#7dff9b')}
function openHist(){var m=window.YNet&&YNet.curCh?{w:1,l:2,k:3,p:4}[YNet.curCh()]:1;if(D())D().openChat(m||1)}
function init(){var b=$('dkb'),p=$('dkp');if(!b||!p)return;
  b.onclick=function(e){e.stopPropagation();p.classList.toggle('on')};
  document.addEventListener('click',function(e){if(!p.classList.contains('on'))return;if(e.target.closest&&e.target.closest('#dkb'))return;if(e.target.closest&&e.target.closest('#dkp .ib')){setTimeout(function(){p.classList.remove('on')},60);return}p.classList.remove('on')},true);
  var dk=$('dock');try{if(localStorage.getItem('yx-chbig')==='1')dk.classList.add('big')}catch(e){}
  function tgl(e){if(e)e.stopPropagation();dk.classList.toggle('big');var b=dk.classList.contains('big');$('chtg').textContent=b?'⤡':'⤢';try{localStorage.setItem('yx-chbig',b?'1':'0')}catch(x){}}
  $('log').onclick=tgl;$('chtg').onclick=tgl;$('chh').onclick=openHist;$('iatl').onclick=function(){if(D())D().openAtlas()};
  $('chch').onclick=function(){if(window.YNet)YNet.cycleCh()};
  var i=$('chi');['keydown','keyup','keypress'].forEach(function(t){i.addEventListener(t,function(e){e.stopPropagation()})});
  i.addEventListener('keydown',function(e){if(e.key==='Enter'){var v=i.value.trim();i.value='';if(v&&window.YNet)YNet.sendChat(v);i.blur()}});
  $('ihome').onclick=function(){tp('home')};$('itown').onclick=function(){tp('town')};
  $('itr').onclick=function(){if(window.YTr)YTr.open()};$('itut').onclick=function(){if(window.YT)YT.show()};
  var last=Date.now(),wake=function(){last=Date.now();dk.classList.remove('idle')};
  try{new MutationObserver(wake).observe($('log'),{childList:true,subtree:true,characterData:true})}catch(e){}
  ['click','touchstart','focusin'].forEach(function(t){dk.addEventListener(t,wake,true)});
  setInterval(function(){var foc=document.activeElement===$('chi');if(foc)last=Date.now();if(!dk.classList.contains('big')&&Date.now()-last>8000&&!foc)dk.classList.add('idle')},1000);
  setInterval(function(){var s=$('sbd'),c=$('cbd'),on=(s&&s.style.display!=='none')||(c&&c.style.display!=='none'),dn=$('dkn');if(dn)dn.style.display=on?'block':'none';
    var n=$('chn');if(n){var u=c&&c.style.display!=='none'?c.textContent:'';n.style.display=u?'grid':'none';n.textContent=u}},700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.YDock={tp:tp};
})();
