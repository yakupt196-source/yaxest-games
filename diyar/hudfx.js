/* Yaxest Diyarı · HUD efektleri (hud3.css ile birlikte)
   Can düşünce kart sarsılır, şifada yeşil parlar, altın değişince "+N" süzülür, seviye atlayınca halka patlar,
   bölge değişince çip düşer, alet seçince yuva zıplar, beceri atınca düğme vurur. Oyunun kendisine dokunmaz, sadece izler. */
(function(){
var last={hp:null,gold:null,lv:null,zn:'',sel:null},cd={};
function q(s){return document.querySelector(s)}
function re(el,c){if(!el)return;el.classList.remove(c);void el.offsetWidth;el.classList.add(c);clearTimeout(el['_'+c]);el['_'+c]=setTimeout(function(){el.classList.remove(c)},1100)}
function pop(txt,el,bad){if(!el||document.body.classList.contains('lowfx'))return;var r=el.getBoundingClientRect();if(!r.width)return;var p=document.createElement('div');p.className='yh3pop'+(bad?' bad':'');p.textContent=txt;var tp=q('#hud .top'),R=tp?tp.getBoundingClientRect():r,n=document.querySelectorAll('.yh3pop').length;p.style.left=Math.round(R.right+8)+'px';p.style.top=Math.round(R.top+8+n*22)+'px';document.body.appendChild(p);setTimeout(function(){p.remove()},1150)}
function fmt(n){n=Math.round(n);return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e4?(n/1e3).toFixed(1)+'B':String(n)}
function sheen(){var t=q('#hud .top');if(t&&!t.querySelector('.sheen')){var s=document.createElement('i');s.className='sheen';t.appendChild(s)}}
function tick(){var y=window.__yd;if(!y||!y.G||!y.P)return;var G=y.G,P=y.P,top=q('#hud .top');sheen();
  var mx=1;try{mx=y.S().maxhp||1}catch(e){}
  if(last.hp!=null&&G.mode===last.mode){var d=G.hp-last.hp;if(d<-mx*.02)re(top,'hit');else if(d>mx*.08)re(top,'heal')}last.hp=G.hp;last.mode=G.mode;
  if(last.gold!=null&&P.gold!==last.gold){var dg=P.gold-last.gold;if(Math.abs(dg)>=1)pop((dg>0?'+':'−')+fmt(Math.abs(dg))+' 🪙',q('#hl')||top,dg<0)}last.gold=P.gold;
  if(last.lv!=null&&P.lv>last.lv){re(q('#hud .rg'),'lvup');pop('Seviye '+P.lv+'!',q('#hn')||top)}last.lv=P.lv;
  var zn=q('#zn');if(zn){var tx=zn.textContent;if(tx&&tx!==last.zn&&last.zn)re(zn,'chg');last.zn=tx}
  var on=q('#yhb .s.on');if(on&&on!==last.sel){if(last.sel)re(on,'pick');last.sel=on}
  var abs=document.querySelectorAll('#acts .ab');for(var i=0;i<abs.length;i++){var a=abs[i],c=a.classList.contains('cdn');if(c&&!cd[a.id])re(a,'cast');cd[a.id]=c}}
/* ---------- boss can barı: yakındaki boss/elit için ekranın üstünde ---------- */
var bb=null,bbM=null,bbTr=1;
function bossEl(){if(bb)return bb;bb=document.createElement('div');bb.id='bossbar';bb.innerHTML='<div class="bn"><span class="bi">☠</span><b></b><small></small></div><div class="bt"><i class="tr"></i><i class="hp"></i><i class="ph" style="left:75%"></i><i class="ph" style="left:50%"></i><i class="ph" style="left:25%"></i></div>';document.body.appendChild(bb);return bb}
function boss(){var y=window.__yd;if(!y||!y.G)return;var G=y.G,L=G.mode==='dungeon'&&G.dg?G.dg.mons:G.mons,best=null,bd=760;
  if(L&&G.mode!=='house')for(var i=0;i<L.length;i++){var m=L[i];if(m.dead||!(m.boss||m.elite)||m.hp<=0)continue;var d=Math.hypot(m.x-G.px,m.y-G.py);if(d<bd&&(m.hit>0||d<520||m===bbM)){bd=d;best=m}}
  var e=bossEl();if(!best){e.classList.remove('on');bbM=null;return}
  if(best!==bbM){bbM=best;bbTr=best.hp/best.max;e.querySelector('b').textContent=best.n||'Boss';e.querySelector('small').textContent='Sv '+best.lv+(best.elite&&!best.boss?' · Elit':'');e.classList.toggle('el',!best.boss);re(e,'in')}
  var f=Math.max(0,Math.min(1,best.hp/best.max));if(f<bbTr)bbTr=Math.max(f,bbTr-.012);else bbTr=f;e.querySelector('.hp').style.width=(f*100).toFixed(1)+'%';e.querySelector('.tr').style.width=(bbTr*100).toFixed(1)+'%';e.classList.toggle('low',f<.25);e.classList.add('on')}
/* ---------- ölüm ekranı: dünya solar, dirilişte altın ışık ---------- */
var wasDead=false;function death(){var y=window.__yd;if(!y||!y.G)return;var d=y.G.dead>0;document.body.classList.toggle('yh3dead',d);if(wasDead&&!d){document.body.classList.remove('yh3rise');void document.body.offsetWidth;document.body.classList.add('yh3rise');setTimeout(function(){document.body.classList.remove('yh3rise')},1200)}wasDead=d}
setInterval(function(){try{boss()}catch(e){}try{death()}catch(e){}},90);
/* ---------- panel satırları: nadirlik etiketi ve dokunmatik olmayan cihazda bilgi kutusu ---------- */
var RAR=['Sıradan','Seçkin','Nadir','Destansı','Efsanevi','Mitik','Ezeli'],RC=['#c9ced9','#7be07b','#5cb0ff','#c07cff','#ffb02e','#ff5b6e','#7df9ff'];
function tagRows(root){var rows=root.querySelectorAll('.it:not([data-rt])');for(var i=0;i<rows.length;i++){var r=rows[i],t=r.textContent;r.setAttribute('data-rt','1');for(var k=RAR.length-1;k>=0;k--){if(t.indexOf('('+RAR[k]+')')>=0||t.indexOf(RAR[k]+' ·')===0){r.setAttribute('data-r',k+1);r.style.setProperty('--rc',RC[k]);break}}if(/gerekir|Seviye \d+ gerek/.test(t))r.classList.add('dim')}}
var mo=new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var t=ms[i].target;if(t.closest&&t.closest('.pan'))tagRows(t.closest('.pan'))}});
function watchPans(){document.querySelectorAll('.pan').forEach(function(p){if(p._yh3)return;p._yh3=1;mo.observe(p,{childList:true,subtree:true});tagRows(p)})}
setInterval(watchPans,1500);watchPans();
var tip=null;if(matchMedia('(pointer:fine)').matches){document.addEventListener('mouseover',function(e){var r=e.target.closest&&e.target.closest('.pan .it[data-r]');if(!tip){tip=document.createElement('div');tip.id='yh3tip';document.body.appendChild(tip)}if(!r){tip.classList.remove('on');return}var k=+r.getAttribute('data-r')-1,b=r.querySelector('b'),sm=r.querySelector('small');tip.innerHTML='<b style="color:'+RC[k]+'">'+(b?b.textContent:'')+'</b>'+RAR[k]+(sm?'<br>'+sm.textContent:'');var R=r.getBoundingClientRect();tip.style.left=Math.min(innerWidth-270,R.right+10)+'px';tip.style.top=Math.max(8,R.top)+'px';tip.classList.add('on')})}
/* giriş ekranlarında yükselen kıvılcımlar */
setInterval(function(){if(document.body.classList.contains('lowfx')||matchMedia('(prefers-reduced-motion:reduce)').matches)return;if(!document.querySelector('.scr.on')||document.querySelectorAll('.yh3ember').length>26)return;var e=document.createElement('i');e.className='yh3ember';var d=6+Math.random()*6;e.style.left=(Math.random()*100)+'vw';e.style.setProperty('--dx',((Math.random()-.5)*160)+'px');e.style.animationDuration=d+'s';var sz=2+Math.random()*3;e.style.width=e.style.height=sz+'px';document.body.appendChild(e);setTimeout(function(){e.remove()},d*1000)},260);
setInterval(tick,110);
})();
