/* Yaxest Okey: 4 kişilik, 106 taş, gösterge/okey/sahte okey (oda mantığı + arayüz) */
(function(){
'use strict';
var T=function(s){return window.YT?YT(s):s};
var no=0;
function tile(id){if(id>=104)return{id:id,fake:true};var k=id%52;return{id:id,c:Math.floor(k/13),n:k%13+1}}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
/* taşı değerine çevir: sahte okey = okey taşının değeri; gerçek okey taşı = joker */
function val(id,ok){var t=tile(id);if(t.fake)return{c:ok.c,n:ok.n,w:false};return{c:t.c,n:t.n,w:t.c===ok.c&&t.n===ok.n}}
function solved(ids,ok){var cnt=[[],[],[],[]],w=0,tot=0;for(var c=0;c<4;c++)for(var n=0;n<=14;n++)cnt[c][n]=0;
  ids.forEach(function(id){var v=val(id,ok);tot++;if(v.w)w++;else cnt[v.c][v.n]++});
  if(tot%1!==0)return false;
  function rec(w){var c=-1,n=-1;for(var cc=0;cc<4&&c<0;cc++)for(var nn=1;nn<=13;nn++)if(cnt[cc][nn]>0){c=cc;n=nn;break}
    if(c<0)return w===0;
    // seri: aynı renk ardışık, n en küçük gerçek taş
    for(var s=1;s<=12;s++){for(var e=s+2;e<=14;e++){
      if(!((s<=n&&n<=e)||(n===1&&e===14)))continue;
      var need=0,used={},ok2=true;
      for(var p=s;p<=e;p++){var pn=p===14?1:p;var u=used[pn]||0;if(cnt[c][pn]-u>0)used[pn]=u+1;else need++}
      if(need>w)continue;
      var taken=[];for(var q in used){for(var z=0;z<used[q];z++){cnt[c][q]--;taken.push(+q)}}
      var r=rec(w-need);for(var t=0;t<taken.length;t++)cnt[c][taken[t]]++;if(r)return true}}
    // grup: aynı sayı farklı renk
    var others=[];for(var cc2=c+1;cc2<4;cc2++)if(cnt[cc2][n]>0)others.push(cc2);
    for(var mask=0;mask<(1<<others.length);mask++){var pick=[];for(var b=0;b<others.length;b++)if(mask&(1<<b))pick.push(others[b]);
      var k=1+pick.length;if(k>4)continue;for(var sz=3;sz<=4;sz++){var need2=sz-k;if(need2<0||need2>w)continue;
        cnt[c][n]--;pick.forEach(function(q){cnt[q][n]--});var r2=rec(w-need2);cnt[c][n]++;pick.forEach(function(q){cnt[q][n]++});if(r2)return true}}
    return false}
  return rec(w)}
/* bir taşın işe yararlığı (bot için) */
function useful(ids,id,ok){var v=val(id,ok);if(v.w)return 99;var s=0;ids.forEach(function(o){if(o===id)return;var x=val(o,ok);if(x.w){s+=1;return}
  if(x.c===v.c){var d=Math.abs(x.n-v.n);if(d===1)s+=2;else if(d===2)s+=1;if((x.n===13&&v.n===1)||(x.n===1&&v.n===13))s+=1}
  else if(x.n===v.n)s+=1.5;if(x.c===v.c&&x.n===v.n)s+=1});return s}
var logic={n:4,hot:false,
 init:function(){var ids=[];for(var i=0;i<106;i++)ids.push(i);shuffle(ids);
   var ind=ids.pop();while(ind>=104){ids.unshift(ind);ind=ids.pop()}var it=tile(ind);var ok={c:it.c,n:it.n===13?1:it.n+1};
   var st=no%4;no++;var hands=[[],[],[],[]];for(var s=0;s<4;s++){var k=s===st?15:14;for(var j=0;j<k;j++)hands[s].push(ids.pop())}
   return{deck:ids,hands:hands,ind:ind,ok:ok,disc:[[],[],[],[]],turn:st,phase:'discard',over:null,id:no,last:-1}},
 turn:function(s){return s.over?null:s.turn},over:function(s){return s.over},
 fin:function(s,seat){var h=s.hands[seat],out=[];if(h.length!==15)return out;h.forEach(function(id){var r=h.filter(function(x){return x!==id});if(solved(r,s.ok))out.push(id)});return out},
 apply:function(s,seat,a){if(s.over)return{error:'Oyun bitti'};if(seat!==s.turn)return{error:'Sıra sende değil'};var h=s.hands[seat];
   if(a.draw){if(s.phase!=='draw')return{error:'Geçersiz hamle'};
     if(a.draw==='side'){var pp=(seat+3)%4,pile=s.disc[pp];if(!pile.length)return{error:'Geçersiz hamle'};h.push(pile.pop())}
     else{if(!s.deck.length){s.over={winner:-1,t:'Taşlar bitti, berabere'};return{}}h.push(s.deck.pop())}
     s.phase='discard';return{}}
   if(a.disc!=null){if(s.phase!=='discard')return{error:'Geçersiz hamle'};var i=h.indexOf(a.disc);if(i<0)return{error:'Geçersiz hamle'};h.splice(i,1);
     if(solved(h,s.ok)){s.disc[seat].push(a.disc);s.over={winner:seat,t:'Okey! Bitirdi'};return{}}
     s.disc[seat].push(a.disc);s.last=seat;s.turn=(seat+1)%4;s.phase='draw';return{}}
   return{error:'Geçersiz hamle'}},
 view:function(s,seat){var pp=(seat+3)%4;return{hand:s.hands[seat],ind:s.ind,ok:s.ok,deck:s.deck.length,disc:s.disc.map(function(d){return{n:d.length,top:d.length?d[d.length-1]:null}}),side:s.disc[pp].length?s.disc[pp][s.disc[pp].length-1]:null,turn:s.turn,phase:s.phase,me:seat,fin:(s.turn===seat&&s.phase==='discard'&&!s.over)?logic.fin(s,seat):[],cnt:s.hands.map(function(h){return h.length}),id:s.id,win:s.over?s.hands[s.over.winner]&&s.hands[s.over.winner].slice():null,last:s.last}},
 bot:function(s,seat,level){var h=s.hands[seat];
   if(s.phase==='draw'){var pp=(seat+3)%4,pile=s.disc[pp];
     if(pile.length&&level>1){var t=pile[pile.length-1],test=h.concat([t]);
       var w=test.some(function(id){var r=test.filter(function(x){return x!==id});return solved(r,s.ok)});
       if(w)return{draw:'side'};
       if(level>2&&useful(h,t,s.ok)>=3)return{draw:'side'}}
     return{draw:'deck'}}
   var f=logic.fin(s,seat);if(f.length)return{disc:f[0]};
   var best=h[0],bs=1e9;h.forEach(function(id){var u=useful(h,id,s.ok)+(level>1?0:Math.random()*6);if(u<bs){bs=u;best=id}});return{disc:best}}};
window.YXOkeyLogic=logic;window.YXOkeyInternals={solved:solved,tile:tile,val:val};
/* ---------- arayüz ---------- */
var C,V=null,sel=null,lastId=-1,sortBy='c',lastSig='';
var COL=['#e0244f','#1b1535','#2a6fdb','#d89a00'];
var CSS='.ow{max-width:560px;margin:0 auto;display:grid;gap:10px}.ot{position:relative;width:40px;height:56px;border-radius:8px;background:#f6ecd0;border:2px solid #cdb98f;display:grid;place-items:center;font:800 1.25rem/1 system-ui;box-shadow:0 3px 6px rgba(0,0,0,.4);flex:none;user-select:none;cursor:pointer;transition:transform .12s}.ot::after{content:"";position:absolute;bottom:5px;width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.5}'+
'.ot.sm{width:30px;height:42px;font-size:.95rem;cursor:default;border-radius:6px}.ot.sm::after{bottom:3px;width:4px;height:4px}.ot.jk{border-color:#ffd23f;box-shadow:0 0 0 2px #ffd23f,0 3px 6px rgba(0,0,0,.4)}.ot.fk::before{content:"★";position:absolute;top:1px;right:3px;font-size:.6rem;color:#8a6d00}.ot.sel{transform:translateY(-12px)}.ot.fn{box-shadow:0 0 0 3px #3ddbb0,0 3px 6px rgba(0,0,0,.4)}'+
'.orack{display:flex;flex-wrap:wrap;gap:6px 5px;justify-content:center;padding:14px 8px 6px;background:linear-gradient(#6b4328,#4a2d1b);border-radius:14px;min-height:140px}.omid{display:flex;gap:10px;justify-content:center;align-items:stretch;flex-wrap:wrap}.obx{background:var(--card,#1a1440);border:2px solid transparent;border-radius:14px;padding:8px 10px;display:grid;gap:4px;justify-items:center;font-size:.75rem;font-weight:800;color:var(--mute,#a9a3cf);min-width:70px}.obx.act{border-color:#7fd1ff;cursor:pointer}.obx.pt{border-color:var(--yellow,#ffd23f)}'+
'.ost{text-align:center;font-weight:800;min-height:1.4em;color:var(--mute,#a9a3cf)}.ost.me{color:var(--yellow,#ffd23f)}.oac{display:flex;gap:8px;justify-content:center}.oac .rbtn{flex:1;max-width:200px}';
function $(i){return document.getElementById(i)}
function th(id,cls){var v=val(id,V.ok),t=tile(id);var txt,col,c2=cls||'';if(t.fake){txt='★';col='#8a6d00';c2+=' fk'}else{txt=t.n;col=COL[t.c]}
  if(!t.fake&&v.w)c2+=' jk';return'<div class="ot '+c2+'" data-t="'+id+'" style="color:'+col+'">'+txt+'</div>'}
function sortH(h){var a=h.slice();a.sort(function(x,y){var p=val(x,V.ok),q=val(y,V.ok),tx=tile(x),ty=tile(y);var kx=tx.fake?99:(sortBy==='c'?tx.c*20+tx.n:tx.n*5+tx.c),ky=ty.fake?99:(sortBy==='c'?ty.c*20+ty.n:ty.n*5+ty.c);return kx-ky||x-y});return a}
var ui={mount:function(r,ctx){C=ctx;sel=null;lastId=-1;lastSig='';
  if(!$('ok-css')){var s=document.createElement('style');s.id='ok-css';s.textContent=CSS;document.head.appendChild(s)}
  r.innerHTML='<div class="ow"><div class="omid" id="omid"></div><div class="ost" id="ost"></div><div class="orack" id="orack"></div><div class="oac"><button class="rbtn alt" id="osort" type="button"></button><button class="rbtn" id="odis" type="button" hidden></button></div></div>';
  $('osort').onclick=function(){sortBy=sortBy==='c'?'n':'c';draw()};
  $('odis').onclick=function(){if(sel!=null){C.send({disc:sel});sel=null}};
  r.addEventListener('click',function(e){if(!V)return;var t=e.target.closest('#orack .ot');if(t){var id=+t.dataset.t;if(V.turn===V.me&&V.phase==='discard'){if(sel===id)C.send({disc:id}),sel=null;else{sel=id;C.sfx('tap');draw()}}return}
    if(e.target.closest('#odeck')&&V.turn===V.me&&V.phase==='draw'&&V.deck>0)C.send({draw:'deck'});
    if(e.target.closest('#oside')&&V.turn===V.me&&V.phase==='draw'&&V.side!=null)C.send({draw:'side'})})},
 view:function(v,meta){V=v;if(v.id!==lastId){lastId=v.id;sel=null}var sig=v.hand.join()+v.turn+v.phase;if(sig!==lastSig){if(lastSig)C.sfx('tap');lastSig=sig;if(v.hand.indexOf(sel)<0)sel=null}draw(meta)}};
function draw(meta){var over=meta&&meta.over,m=V.turn===V.me&&!over,P=C.players;
  var ind='<div class="obx"><span>'+T('Gösterge')+'</span>'+th(V.ind,'sm')+'</div>';
  var okb='<div class="obx"><span>'+T('Okey')+'</span>'+th(V.ok.c*13+V.ok.n-1,'sm')+'</div>';
  var deck='<div class="obx'+(m&&V.phase==='draw'&&V.deck>0?' act':'')+'" id="odeck"><span>'+T('Deste')+'</span><div class="ot sm" style="background:#6b3fd4;border-color:#fff;color:#fff">'+V.deck+'</div></div>';
  var side='<div class="obx'+(m&&V.phase==='draw'&&V.side!=null?' act':'')+'" id="oside"><span>'+T('Soldan al')+'</span>'+(V.side!=null?th(V.side,'sm'):'<div class="ot sm" style="opacity:.3"></div>')+'</div>';
  var ds='';for(var k=1;k<4;k++){var s=(V.me+k)%4,d=V.disc[s],nm=P[s]?P[s].name:'?';ds+='<div class="obx'+(V.turn===s&&!over?' pt':'')+'"><span>'+String(nm).slice(0,8)+' · '+V.cnt[s]+'</span>'+(d.top!=null?th(d.top,'sm'):'<div class="ot sm" style="opacity:.25"></div>')+'</div>'}
  $('omid').innerHTML=ind+okb+deck+side;
  var oth='';$('omid').insertAdjacentHTML('beforeend',ds);
  var rack=sortH(V.hand),h='';rack.forEach(function(id){h+=th(id,(sel===id?'sel ':'')+(V.fin.indexOf(id)>=0?'fn':''))});$('orack').innerHTML=h;
  var st=$('ost');st.className='ost'+(m?' me':'');st.textContent=over?'':(m?(V.phase==='draw'?T('Desteden ya da soldan taş çek'):(V.fin.length?T('Yeşil taşı atarak bitirebilirsin!'):T('Atılacak taşı seç'))):(P[V.turn]?P[V.turn].name+' · ':'')+T('Rakibin sırası'));
  $('osort').textContent=sortBy==='c'?T('Sayıya diz'):T('Renge diz');var b=$('odis');b.hidden=!(m&&V.phase==='discard'&&sel!=null);b.textContent=T('At')}
if(window.YXRoom)YXRoom.start({id:'okey',title:'Okey',logic:logic,ui:ui,intro:T('4 kişilik Okey. Serileri (aynı renk ardışık) ve grupları (aynı sayı farklı renk) tamamla, 14 taşın hepsini diz. Boş yerleri bot doldurur.')});
})();
