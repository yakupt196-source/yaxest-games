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
setInterval(tick,110);
})();
