/* Yaxest Tavla: tam kurallı (zarların tamamı oynanmak zorunda), oda mantığı + arayüz */
(function(){
'use strict';
var T=function(s){return window.YT?YT(s):s},no=0,OFF=99;
function start(){var p=new Array(24).fill(0);p[23]=2;p[12]=5;p[7]=3;p[5]=5;p[0]=-2;p[11]=-5;p[16]=-3;p[18]=-5;return p}
function cl(s){return{pts:s.pts.slice(),bar:s.bar.slice(),off:s.off.slice(),dice:s.dice.slice()}}
function sg(p){return p?-1:1}
function dist(p,i){return p?24-i:i+1}
function allHome(s,p){if(s.bar[p])return false;for(var i=0;i<24;i++)if(s.pts[i]*sg(p)>0&&dist(p,i)>6)return false;return true}
function gen(s,p,d){var m=[],sn=sg(p),dir=p?1:-1;
  if(s.bar[p]){var t=p?d-1:24-d;if(s.pts[t]*sn>=-1)m.push({f:-1,t:t,d:d});return m}
  var home=allHome(s,p),far=0;
  for(var i=0;i<24;i++)if(s.pts[i]*sn>0)far=Math.max(far,dist(p,i));
  for(var i=0;i<24;i++){if(s.pts[i]*sn<=0)continue;var t=i+dir*d;
    if(t>=0&&t<24){if(s.pts[t]*sn>=-1)m.push({f:i,t:t,d:d})}
    else if(home){var ds=dist(p,i);if(ds===d||(d>ds&&far<=ds))m.push({f:i,t:OFF,d:d})}}
  return m}
function doMove(s,p,m){var sn=sg(p);if(m.f<0)s.bar[p]--;else s.pts[m.f]-=sn;
  var hit=false;if(m.t===OFF)s.off[p]++;else{if(s.pts[m.t]*sn===-1){s.pts[m.t]=0;s.bar[1-p]++;hit=true}s.pts[m.t]+=sn}
  var k=s.dice.indexOf(m.d);if(k>=0)s.dice.splice(k,1);return hit}
function uniq(a){return a.filter(function(x,i){return a.indexOf(x)===i})}
function depth(s,p){if(!s.dice.length)return 0;var best=0;
  uniq(s.dice).forEach(function(d){gen(s,p,d).forEach(function(m){var c=cl(s);doMove(c,p,m);best=Math.max(best,1+depth(c,p))})});return best}
function legal(s,p){var all=[];uniq(s.dice).forEach(function(d){gen(s,p,d).forEach(function(m){all.push(m)})});
  if(!all.length)return[];var best=depth(s,p),out=all.filter(function(m){var c=cl(s);doMove(c,p,m);return 1+depth(c,p)===best});
  if(best===1&&s.dice.length===2&&s.dice[0]!==s.dice[1]){var hi=Math.max(s.dice[0],s.dice[1]);var h=out.filter(function(m){return m.d===hi});if(h.length)out=h}
  return out}
function pass(s){s.turn=1-s.turn;s.dice=[];s.rolled=false}
var logic={n:2,hot:true,
 init:function(){return{pts:start(),bar:[0,0],off:[0,0],turn:no%2,dice:[],roll:[],rolled:false,over:null,last:null,id:++no,skip:false}},
 turn:function(s){return s.over?null:s.turn},over:function(s){return s.over},
 legal:function(s,p){return legal(s,p)},
 apply:function(s,seat,a){if(s.over)return{error:'Oyun bitti'};if(seat!==s.turn)return{error:'Sıra sende değil'};
   if(a.roll){if(s.rolled)return{error:'Geçersiz hamle'};var x=1+Math.floor(Math.random()*6),y=1+Math.floor(Math.random()*6);s.roll=[x,y];s.dice=x===y?[x,x,x,x]:[x,y];s.rolled=true;s.skip=false;s.last=null;
     if(!legal(s,seat).length){s.skip=true;pass(s)}return{}}
   if(a.mv){if(!s.rolled)return{error:'Geçersiz hamle'};var L=legal(s,seat),m=null;for(var i=0;i<L.length;i++)if(L[i].f===a.mv[0]&&L[i].t===a.mv[1]){m=L[i];break}
     if(!m)return{error:'Geçersiz hamle'};var hit=doMove(s,seat,m);s.last={f:m.f,t:m.t,hit:hit};
     if(s.off[seat]>=15){s.over={winner:seat,t:'Tüm taşlar çıktı'};return{}}
     if(!s.dice.length||!legal(s,seat).length)pass(s);return{}}
   return{error:'Geçersiz hamle'}},
 view:function(s,seat){var me=seat;return{pts:s.pts,bar:s.bar,off:s.off,turn:s.turn,dice:s.dice,roll:s.roll,rolled:s.rolled,last:s.last,id:s.id,skip:s.skip,me:me,legal:(!s.over&&s.turn===seat&&s.rolled)?legal(s,seat).map(function(m){return[m.f,m.t]}):[]}},
 bot:function(s,seat,level){if(!s.rolled)return{roll:1};var L=legal(s,seat);if(!L.length)return{roll:1};
   if(level<=1)return{mv:pick(L)};var best=null,bs=-1e9;
   L.forEach(function(m){var c=cl(s),sn=sg(seat),hit=doMove(c,seat,m),sc=Math.random()*.5;
     if(m.t===OFF)sc+=10;if(hit)sc+=8;if(m.f<0)sc+=4;
     if(m.t!==OFF){var q=c.pts[m.t]*sn;if(q===1)sc-=(level>2?5:2);if(q>=2)sc+=3;
       // rakip erişimi: kaba tehlike
       }
     if(m.f>=0&&c.pts[m.f]*sn===1)sc-=(level>2?3:1);
     sc+=(m.d)*.15;if(m.t!==OFF&&dist(seat,m.t)<=6)sc+=1;
     if(sc>bs){bs=sc;best=m}});return{mv:[best.f,best.t]}}};
function pick(L){var m=L[Math.floor(Math.random()*L.length)];return[m.f,m.t]}
window.YXTavlaLogic=logic;window.YXTavlaInternals={gen:gen,legal:legal,cl:cl,doMove:doMove};

/* ---------- arayüz ---------- */
var C,V=null,sel=null,lastId=-1,lastSig='';
var CSS='.tvw{max-width:560px;margin:0 auto;display:grid;gap:8px}.tvb{display:grid;grid-template-columns:repeat(6,1fr) 26px repeat(6,1fr);grid-template-rows:1fr 1fr;height:min(88vw,380px);background:#3a2418;border:6px solid #6b4328;border-radius:14px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.45)}'+
'.tp{position:relative;display:flex;align-items:center;cursor:pointer;min-width:0;overflow:hidden}.tp.t{flex-direction:column;justify-content:flex-start}.tp.u{flex-direction:column-reverse;justify-content:flex-start}'+
'.tp::before{content:"";position:absolute;inset:0;z-index:0;background:var(--c);clip-path:polygon(8% 0,92% 0,50% 92%)}.tp.u::before{clip-path:polygon(8% 100%,92% 100%,50% 8%)}'+
'.tp.dk{--c:#c9955b}.tp.lt{--c:#e8cf9f}.tp.ok::after{content:"";position:absolute;inset:3px;border:3px solid #7fd1ff;border-radius:8px;z-index:3;pointer-events:none;animation:tvp 1s infinite}@keyframes tvp{50%{opacity:.4}}'+
'.tp.sel{background:rgba(127,209,255,.35)}.tp.lm{background:rgba(255,210,63,.3)}'+
'.ck{position:relative;z-index:1;width:84%;max-width:30px;aspect-ratio:1;border-radius:50%;margin:1px 0;flex:none;box-shadow:0 2px 3px rgba(0,0,0,.5),inset 0 -3px 0 rgba(0,0,0,.18);display:grid;place-items:center;font:800 11px system-ui}.ck.a{background:#fff3d8;color:#3a2418;border:2px solid #cdb98f}.ck.b{background:#ff5c8a;color:#fff;border:2px solid #b52f58}'+
'.tbar{grid-column:7;grid-row:1/3;background:#2a170e;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:2px;cursor:pointer}.tbar.ok{outline:3px solid #7fd1ff;outline-offset:-3px}'+
'.tdc{display:flex;justify-content:center;align-items:center;gap:12px;min-height:56px}.dd{width:48px;height:48px;border-radius:11px;background:#fff;color:#1b1535;display:grid;place-items:center;font-size:2.3rem;line-height:1;box-shadow:0 4px 10px rgba(0,0,0,.4)}.dd.used{opacity:.3}'+
'.tof{display:flex;gap:8px;align-items:stretch}.tof>div{flex:1;background:var(--card,#1a1440);border-radius:14px;padding:8px 10px;display:flex;align-items:center;gap:8px;font-weight:800;font-size:.9rem;border:2px solid transparent}.tof .tgo{cursor:pointer;border-color:#7fd1ff}.tst{text-align:center;font-weight:800;color:var(--mute,#a9a3cf);min-height:1.4em}.tst.me{color:var(--yellow,#ffd23f)}';
function $(i){return document.getElementById(i)}
var DIE=['','⚀','⚁','⚂','⚃','⚄','⚅'];
var ui={mount:function(r,ctx){C=ctx;sel=null;lastId=-1;lastSig='';
  if(!$('tv-css')){var s=document.createElement('style');s.id='tv-css';s.textContent=CSS;document.head.appendChild(s)}
  r.innerHTML='<div class="tvw"><div class="tst" id="tst"></div><div class="tvb" id="tvb"></div><div class="tdc" id="tdc"></div><div class="tof" id="tof"></div></div>';
  r.addEventListener('click',function(e){if(!V)return;var el=e.target.closest('[data-i]');if(el)tap(+el.dataset.i);else if(e.target.closest('#toff'))tap(OFF);else if(e.target.closest('#troll'))C.send({roll:1})})},
 view:function(v,meta){V=v;if(v.id!==lastId){lastId=v.id;sel=null}var sig=JSON.stringify([v.pts,v.bar,v.turn,v.dice,v.rolled]);if(sig!==lastSig){if(lastSig)C.sfx(v.last&&v.last.hit?'good':'tap');lastSig=sig;sel=null}draw(meta)}};
function mine(){return V.turn===V.me&&V.rolled}
function tap(i){if(!mine())return;
  if(sel!==null){var ok=V.legal.some(function(m){return m[0]===sel&&m[1]===i});if(ok){C.send({mv:[sel,i]});sel=null;return}}
  if(V.legal.some(function(m){return m[0]===i})){sel=i;draw()}else{sel=null;draw()}}
function idxOf(row,c){var up=(V.me===0)===(row==='t');return up?12+c:11-c}
function draw(meta){var over=meta&&meta.over,me=V.me,tg={};
  if(sel!==null&&mine())V.legal.forEach(function(m){if(m[0]===sel)tg[m[1]]=1});
  var h='';
  function cell(row,c){var i=idxOf(row,c),n=V.pts[i],cnt=Math.abs(n),who=n>0?0:1,cls='tp '+(row==='t'?'t':'u')+' '+((i%2)?'lt':'dk')+(tg[i]?' ok':'')+(sel===i?' sel':'')+(V.last&&(V.last.f===i||V.last.t===i)?' lm':'');
    var ck='',show=Math.min(cnt,5);for(var k=0;k<show;k++)ck+='<span class="ck '+(who===0?'a':'b')+'">'+(k===show-1&&cnt>5?cnt:'')+'</span>';
    return'<div class="'+cls+'" data-i="'+i+'" role="button" aria-label="'+(i+1)+'">'+ck+'</div>'}
  for(var r=0;r<2;r++){var row=r?'b':'t';for(var c=0;c<12;c++){if(c===6&&r===0){var bk='';for(var p=0;p<2;p++)for(var k=0;k<V.bar[p];k++)bk+='<span class="ck '+(p?'b':'a')+'"></span>';h+='<div class="tbar'+(tg[-1]!==undefined||(mine()&&V.legal.some(function(m){return m[0]===-1}))?' ok':'')+'" data-i="-1">'+bk+'</div>'}h+=cell(row,c)}}
  // not: ızgara yerleşimi için satır başına 13 hücre gerekir; bar ilk satırda yer kaplar (2 satır)
  $('tvb').innerHTML=h;
  var dv='';if(V.rolled){var left=V.dice.slice();V.roll.forEach(function(d,k){var u=false;if(V.roll[0]===V.roll[1]){u=k>=left.length}else{var j=left.indexOf(d);if(j<0)u=true}dv+='<div class="dd'+(u?' used':'')+'">'+DIE[d]+'</div>'})}
  else if(!over&&V.turn===V.me)dv='<button class="rbtn" id="troll" type="button">🎲 '+T('Zar at')+'</button>';
  $('tdc').innerHTML=dv;
  var st=$('tst'),m=V.turn===V.me;st.className='tst'+(m?' me':'');
  st.textContent=over?'':(C.hot?T(V.turn===0?'Beyaz oynuyor':'Pembe oynuyor'):(V.skip?T('Hamle yok, sıra geçti')+' · ':'')+(m?(V.rolled?T('Hamleni yap'):T('Zar at')):T('Rakibin sırası')));
  var canOff=sel!==null&&tg[OFF];
  $('tof').innerHTML='<div>'+'<span class="ck a" style="width:20px"></span> '+T('Çıkan')+': '+V.off[0]+'/15</div>'+(canOff?'<div class="tgo" id="toff">⬆ '+T('Taşı çıkar')+'</div>':'')+'<div><span class="ck b" style="width:20px"></span> '+T('Çıkan')+': '+V.off[1]+'/15</div>'}
if(window.YXRoom)YXRoom.start({id:'tavla',title:'Tavla',logic:logic,ui:ui,intro:T('Arkadaşınla oda kur, kodu paylaş. Zar at, taşlarını eve topla ve önce hepsini çıkar. Bot ile de oynayabilirsin.')});
})();
