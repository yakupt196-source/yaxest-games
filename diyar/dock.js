/* Yaxest Diyarı: derli toplu mobil HUD, tek menü düğmesi, ışınlanma. */
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
function init(){var b=$('dkb'),p=$('dkp');if(!b||!p)return;
  b.onclick=function(e){e.stopPropagation();p.classList.toggle('on')};
  document.addEventListener('click',function(e){if(!p.classList.contains('on'))return;if(e.target.closest&&e.target.closest('#dkb'))return;if(e.target.closest&&e.target.closest('#dkp .ib')){setTimeout(function(){p.classList.remove('on')},60);return}p.classList.remove('on')},true);
  $('chin').onclick=$('log').onclick=function(){var c=$('ichat');if(c)c.click()};
  $('ihome').onclick=function(){tp('home')};$('itown').onclick=function(){tp('town')};
  setInterval(function(){var s=$('sbd'),c=$('cbd'),on=(s&&s.style.display!=='none')||(c&&c.style.display!=='none'),dn=$('dkn');if(dn)dn.style.display=on?'block':'none';
    var n=$('chn');if(n){var u=c&&c.style.display!=='none'?c.textContent:'';n.style.display=u?'grid':'none';n.textContent=u}},700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.YDock={tp:tp};
})();
