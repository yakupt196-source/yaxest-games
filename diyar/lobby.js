/* Yaxest Diyarı · Mobil lobi (YLB)
   Karakteri olan oyuncu girişte bu ekranı görür: sahnede piksel kahramanı, büyük OYNA düğmesi, dünya seçimi,
   alt sekmeler (Görünüm, Sınıf, Haberler, Mağaza, Ayarlar). Önce telefon (yatay ve dikey), masaüstünde de çalışır. */
(function(){
var L=null,raf=0,sheet=null;
function $(s){return L.querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function api(){return window.__lb}
function wname(n){var W=(window.YNet&&YNet.WNAMES)||[];return n>0?(W[n-1]||'Dünya '+n):'Çevrimdışı'}
function curW(){var w=1;try{var v=localStorage.getItem('yx-world');if(v!==null)w=+v}catch(e){}return w}
var CSS='#lobby{position:fixed;inset:0;z-index:45;display:none;color:#f3e2bd;font-family:"Chakra Petch",sans-serif;overflow:hidden;user-select:none;-webkit-user-select:none}'+
'#lobby.on{display:flex;flex-direction:column}'+
'#lobby .lbg{position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse at 50% 120%,rgba(255,140,40,.35),transparent 55%),radial-gradient(ellipse at 50% -10%,#2b1c55 0,#120b2a 45%,#07040f 100%)}'+
'#lobby .lbg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:38%;background:linear-gradient(transparent,rgba(5,3,10,.6)),repeating-linear-gradient(90deg,#1a1030 0 18px,#160d2a 18px 36px);clip-path:polygon(0 60%,6% 52%,12% 58%,20% 40%,26% 46%,34% 30%,40% 38%,46% 22%,50% 14%,54% 22%,60% 36%,66% 28%,74% 44%,82% 36%,90% 50%,100% 42%,100% 100%,0 100%);image-rendering:pixelated}'+
'#lobby .ltop{flex:none;display:flex;align-items:center;gap:10px;padding:calc(8px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) 6px calc(12px + env(safe-area-inset-left))}'+
'#lobby .chip{display:flex;align-items:center;gap:6px;padding:5px 11px;border-radius:12px;border:1.5px solid transparent;background:linear-gradient(180deg,rgba(44,30,20,.92),rgba(22,15,10,.92)) padding-box,linear-gradient(135deg,#fbe39a,#c58b2e 28%,#7a4e17 50%,#e9bb57 72%,#8a5a1c) border-box;font-weight:700;font-size:.86rem;white-space:nowrap}'+
'#lobby .me{flex:1;min-width:0}#lobby .me b{font-family:Cinzel,Georgia,serif;font-size:1.05rem;color:#ffe7a8;display:block;overflow:hidden;text-overflow:ellipsis}#lobby .me small{color:#cdb994}'+
'#lobby .ib{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;font-size:1.25rem;cursor:pointer;border:1.5px solid transparent;background:linear-gradient(180deg,rgba(44,30,20,.92),rgba(22,15,10,.92)) padding-box,linear-gradient(135deg,#fbe39a,#c58b2e 28%,#7a4e17 50%,#e9bb57 72%,#8a5a1c) border-box;color:#fff}'+
'#lobby .mid{flex:1 1 auto;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:10px;padding:0 calc(14px + env(safe-area-inset-right)) 0 calc(14px + env(safe-area-inset-left));min-height:0}'+
'#lobby .stage{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;min-height:0}'+
'#lobby .stage canvas{height:min(44vh,230px);width:auto;max-width:100%;image-rendering:pixelated;filter:drop-shadow(0 6px 10px rgba(0,0,0,.5))}'+
'#lobby .ped{width:min(40vh,210px);height:22px;margin-top:-14px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(255,210,110,.55),rgba(255,170,60,.12) 55%,transparent 70%)}'+
'#lobby .cls{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;justify-content:center}'+
'#lobby .cls button{width:42px;height:42px;border-radius:12px;font-size:1.2rem;cursor:pointer;border:1.5px solid rgba(217,164,65,.35);background:linear-gradient(180deg,#3a2818,#1f150d);color:#fff;transition:transform .15s}'+
'#lobby .cls button[aria-pressed=true]{border-color:#f7dc8a;background:linear-gradient(180deg,#9a6a2a,#4a3014);box-shadow:0 0 14px rgba(255,190,80,.55);transform:translateY(-3px)}'+
'#lobby .go{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}'+
'#lobby h1{margin:0;font-family:Cinzel,Georgia,serif;font-weight:900;font-size:clamp(1.6rem,6vh,2.6rem);line-height:1;background:linear-gradient(180deg,#fff3c4,#f2c35e 45%,#b07a22);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 #3a2410) drop-shadow(0 0 18px rgba(255,190,80,.35))}'+
'#lobby .tag{color:#cdb994;font-size:.82rem;margin-top:-4px}'+
'#lobby .play{position:relative;width:min(80%,300px);padding:16px 10px;border-radius:18px;border:2px solid #6b4314;cursor:pointer;font-family:Cinzel,Georgia,serif;font-weight:900;font-size:1.5rem;letter-spacing:.08em;color:#2a1608;background:linear-gradient(180deg,#ffe08a,#d39a32 55%,#a8701e);box-shadow:0 5px 0 #5a3a12,0 10px 26px rgba(0,0,0,.5),0 0 30px rgba(255,190,80,.35),inset 0 1px 0 rgba(255,255,255,.6);animation:lbp 2.2s ease-in-out infinite}'+
'#lobby .play:active{transform:translateY(3px);box-shadow:0 2px 0 #5a3a12,0 6px 14px rgba(0,0,0,.5)}'+
'#lobby .wsel{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:12px;cursor:pointer;border:1.5px solid rgba(217,164,65,.4);background:rgba(20,13,8,.7);color:#f3e2bd;font:700 .86rem "Chakra Petch",sans-serif}'+
'#lobby .wsel i{width:8px;height:8px;border-radius:50%;background:#5be39a;box-shadow:0 0 8px #5be39a;display:inline-block}'+
'#lobby nav{flex:none;align-items:flex-end;display:flex;justify-content:center;gap:6px;padding:6px calc(10px + env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) calc(10px + env(safe-area-inset-left))}'+
'#lobby nav button{flex:1;max-width:120px;display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px 4px;border-radius:14px;cursor:pointer;border:1.5px solid transparent;background:linear-gradient(180deg,rgba(44,30,20,.92),rgba(22,15,10,.92)) padding-box,linear-gradient(135deg,#fbe39a,#c58b2e 28%,#7a4e17 50%,#e9bb57 72%,#8a5a1c) border-box;color:#f3e2bd;font:700 .7rem "Chakra Petch",sans-serif}'+
'#lobby nav button span{font-size:1.25rem}#lobby nav .dot{position:relative}#lobby nav .dot::after{content:"";position:absolute;top:4px;right:16px;width:8px;height:8px;border-radius:50%;background:#ff5b6e}'+
'#lobby .sheet{position:absolute;inset:0;z-index:3;display:flex;align-items:flex-end;justify-content:center;background:rgba(5,3,10,.55);opacity:0;pointer-events:none;transition:opacity .2s}'+
'#lobby .sheet.on{opacity:1;pointer-events:auto}'+
'#lobby .sh{width:min(96vw,560px);max-height:86vh;overflow:auto;padding:14px 14px calc(14px + env(safe-area-inset-bottom));border-radius:20px 20px 0 0;border:2px solid transparent;border-bottom:0;background:linear-gradient(180deg,rgba(44,30,20,.98),rgba(22,15,10,.98)) padding-box,linear-gradient(135deg,#fbe39a,#c58b2e 28%,#7a4e17 50%,#e9bb57 72%,#8a5a1c) border-box;transform:translateY(30px);transition:transform .25s cubic-bezier(.2,.9,.3,1.2)}'+
'#lobby .sheet.on .sh{transform:none}#lobby .sh h2{margin:0 0 8px;font-family:Cinzel,Georgia,serif;color:#ffe2a0;font-size:1.15rem;display:flex;justify-content:space-between;align-items:center}'+
'#lobby .sh h2 button{background:none;border:0;color:#cdb994;font-size:1.3rem;cursor:pointer}'+
'#lobby .row{display:flex;align-items:center;gap:10px;padding:10px 12px;margin:6px 0;border-radius:12px;border:1px solid rgba(217,164,65,.2);background:rgba(255,236,190,.04);cursor:pointer;width:100%;color:#f3e2bd;font:600 .9rem "Chakra Petch",sans-serif;text-align:left}'+
'#lobby .row b{flex:1}#lobby .row small{color:#bfa987}#lobby .row.sel{border-color:#f7dc8a;box-shadow:0 0 12px rgba(255,190,80,.35)}'+
'#lobby .bar{width:70px;height:6px;border-radius:4px;background:rgba(0,0,0,.4);overflow:hidden}#lobby .bar i{display:block;height:100%}'+
'#lobby .tg{margin-left:auto;padding:4px 10px;border-radius:9px;background:#3a2818;border:1px solid #8a5a1c;font-size:.78rem}'+
'#lobby .tg.on{background:linear-gradient(180deg,#ffe08a,#c98a26);color:#2a1608;border-color:#6b4314}'+
'#lobby .danger{color:#ff8f8f}'+
'@keyframes lbp{50%{box-shadow:0 5px 0 #5a3a12,0 10px 26px rgba(0,0,0,.5),0 0 44px rgba(255,200,90,.65),inset 0 1px 0 rgba(255,255,255,.6)}}'+
'@media (orientation:portrait){#lobby .mid{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto;padding-bottom:10px}#lobby .stage canvas{height:min(34vh,260px)}#lobby .play{width:min(86vw,320px)}#lobby .ltop{flex-wrap:wrap}#lobby .me{flex-basis:40%}#lobby .chip{font-size:.78rem;padding:4px 8px}}'+
'@media (max-height:420px){#lobby .stage canvas{height:min(46vh,200px)}#lobby .cls button{width:36px;height:36px;font-size:1rem}#lobby h1{font-size:1.7rem}#lobby .play{padding:12px 10px;font-size:1.3rem}#lobby nav button{padding:4px}#lobby nav button span{font-size:1.1rem}}'+
'body.lowfx #lobby .play{animation:none}';
function build(){if(L)return L;var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  L=document.createElement('div');L.id='lobby';L.innerHTML='<div class="lbg"></div>'+
   '<div class="ltop"><canvas id="lbpt" width="44" height="44" style="width:44px;height:44px;border-radius:50%;border:2px solid #d9a441;background:#1b120a"></canvas><div class="me"><b id="lbn"></b><small id="lbc"></small></div><div class="chip" id="lbg"></div><div class="chip" id="lbj" title="Jeton"></div><button class="ib" id="lbset" aria-label="Ayarlar">⚙</button></div>'+
   '<div class="mid"><div class="stage"><canvas id="lbhero" width="120" height="132"></canvas><div class="ped"></div><div class="cls" id="lbcls"></div></div>'+
   '<div class="go"><h1>Yaxest Diyarı</h1><div class="tag" id="lbtag">Açık dünya · zindanlar · arkadaşlarınla birlikte</div><button class="play" id="lbplay">⚔ OYNA</button><button class="wsel" id="lbw"><i></i><span id="lbwn"></span> ▸</button></div></div>'+
   '<nav><button id="lbn1"><span>🧍</span>Görünüm</button><button id="lbn2"><span>🛡</span>Sınıf</button><button id="lbn3"><span>📰</span>Haberler</button><button id="lbn4"><span>🛒</span>Mağaza</button><button id="lbn5"><span>⚙</span>Ayarlar</button></nav>'+
   '<div class="sheet" id="lbsheet"><div class="sh" id="lbsh"></div></div>';
  document.body.appendChild(L);
  $('#lbplay').onclick=play;$('#lbw').onclick=worlds;$('#lbset').onclick=settings;$('#lbn5').onclick=settings;
  $('#lbn1').onclick=function(){close();api().wardrobe()};$('#lbn2').onclick=classes;$('#lbn3').onclick=news;$('#lbn4').onclick=function(){if(window.YSH)YSH.open('hot')};
  $('#lbsheet').onclick=function(e){if(e.target.id==='lbsheet')hide()};return L}
function open(){var a=api();if(!a||!a.P())return;build();var P=a.P(),Y=a.Y,c=Y.CLASSES[P.cls];
  $('#lbn').textContent=P.nick||'Kahraman';$('#lbc').textContent=(c?c.ic+' '+c.n:'')+' · Sv '+P.lv;$('#lbg').textContent='🪙 '+fmt(P.gold||0);
  var j=0;try{j=YX.coins()}catch(e){}$('#lbj').textContent='💎 '+fmt(P.gem|0);$('#lbj').title='Elmas';$('#lbj').onclick=function(){if(window.YSH)YSH.open('gem')};$('#lbg').onclick=function(){if(window.YSH)YSH.open('hot')};$('#lbwn').textContent='Dünya: '+wname(curW());
  $('#lbcls').innerHTML=Object.keys(Y.CLASSES).map(function(k){var q=Y.CLASSES[k];return'<button type="button" data-k="'+k+'" aria-pressed="'+(k===P.cls)+'" title="'+esc(q.n)+'">'+q.ic+'</button>'}).join('');
  L.querySelectorAll('#lbcls button').forEach(function(b){b.onclick=function(){a.switchCls(b.dataset.k);a.save();open()}});
  try{var pc=$('#lbpt').getContext('2d');pc.clearRect(0,0,44,44);pc.save();pc.beginPath();pc.arc(22,22,21,0,6.3);pc.clip();YL.hero(pc,22,66,P.ap,0,false,.78);pc.restore()}catch(e){}
  var nb=$('#lbn3');try{nb.classList.toggle('dot',!!(window.YGZ&&YGZ.unread&&YGZ.unread()))}catch(e){}
  L.classList.add('on');cancelAnimationFrame(raf);var t0=performance.now();(function loop(){raf=requestAnimationFrame(loop);draw((performance.now()-t0)/1000)})()}
function fmt(n){n=Math.round(n);return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e4?Math.round(n/1e3)+'B':String(n)}
function draw(t){var cv=$('#lbhero');if(!cv)return;var c=cv.getContext('2d'),P=api().P();if(!P)return;c.clearRect(0,0,cv.width,cv.height);c.imageSmoothingEnabled=false;
  /* yavaşça dönen kahraman: önce bize bakar, sonra iki yana döner, ara ara yürür */var ph=(t%8)/8,fx=ph<.5?0:ph<.75?1:-1,mv=(ph>.5&&ph<.62)||(ph>.75&&ph<.87);
  try{if(window.YPX&&YPX.want()){c.save();c.scale(1.6,1.6);YPX.hero(c,37.5,78,{cls:P.cls,ap:P.ap,fx:fx,fy:fx?0:1,mv:mv,t:t});c.restore()}else{YL.hero(c,60,120,P.ap,t,mv,1.15)}}catch(e){}}
function close(){if(L){L.classList.remove('on');hide()}cancelAnimationFrame(raf)}
function show(html){$('#lbsh').innerHTML=html;$('#lbsheet').classList.add('on');var x=$('#lbsh h2 button');if(x)x.onclick=hide}
function hide(){if(L)$('#lbsheet').classList.remove('on')}
function play(){var w=curW();window.YD_WAUTO=w;close();api().enter()}
function worlds(){var cur=curW();function render(list){var h='<h2>🌍 Dünya seç <button aria-label="Kapat">✕</button></h2><p style="margin:0 0 6px;font-size:.8rem;color:#bfa987">Karakterin, klanın ve arkadaşların her dünyada aynı. Dünya sadece kiminle aynı yerde olduğunu belirler.</p>';
    list.forEach(function(w){var p=w.max?Math.round(w.n/w.max*100):0,col=p>80?'#ff6b6b':p>50?'#ffd23f':'#5be39a';h+='<button class="row'+(w.w===cur?' sel':'')+'" data-w="'+w.w+'"'+(w.n>=w.max?' disabled':'')+'><span style="font-size:1.3rem">🏰</span><b>'+esc(wname(w.w))+'<br><small>Dünya '+w.w+(w.known?' · '+w.n+' oyuncu':'')+'</small></b><span class="bar"><i style="width:'+Math.max(4,p)+'%;background:'+col+'"></i></span></button>'});
    h+='<button class="row'+(cur===0?' sel':'')+'" data-w="0"><span style="font-size:1.3rem">🌙</span><b>Tek başıma oyna<br><small>Çevrimdışı · diğer oyuncular görünmez</small></b></button>';show(h);
    L.querySelectorAll('#lbsh [data-w]').forEach(function(b){b.onclick=function(){try{localStorage.setItem('yx-world',b.dataset.w)}catch(e){}$('#lbwn').textContent='Dünya: '+wname(+b.dataset.w);hide()}})}
  render([1,2,3,4,5].map(function(i){return{w:i,n:0,max:150,known:0}}));
  try{var u=YNet.wUrl();if(u)fetch(u).then(function(r){return r.json()}).then(function(l){if(Array.isArray(l)&&l.length&&$('#lbsheet').classList.contains('on'))render(l.map(function(x){x.known=1;return x}))}).catch(function(){})}catch(e){}}
function classes(){var a=api(),P=a.P(),Y=a.Y,h='<h2>🛡 Sınıfını seç <button aria-label="Kapat">✕</button></h2><p style="margin:0 0 6px;font-size:.8rem;color:#bfa987">Her sınıfın seviyesi, silahı ve rünleri ayrı; altın ve malzemeler ortak.</p>';
  Object.keys(Y.CLASSES).forEach(function(k){var c=Y.CLASSES[k],lv=k===P.cls?P.lv:(P.cl&&P.cl[k]?P.cl[k].lv:0);h+='<button class="row'+(k===P.cls?' sel':'')+'" data-k="'+k+'"><span style="font-size:1.5rem">'+c.ic+'</span><b>'+esc(c.n)+'<br><small>'+esc(c.d||'')+'</small></b><small>'+(lv?'Sv '+lv:'Yeni')+'</small></button>'});show(h);
  L.querySelectorAll('#lbsh [data-k]').forEach(function(b){b.onclick=function(){a.switchCls(b.dataset.k);a.save();hide();open()}})}
function news(){var h='<h2>📰 Diyar Gazetesi <button aria-label="Kapat">✕</button></h2>';try{h+='<div style="font-size:.86rem">'+YGZ.html()+'</div>';YGZ.seen&&YGZ.seen()}catch(e){h+='<p>Haber yok.</p>'}show(h);try{$('#lbn3').classList.remove('dot')}catch(e){}}
function lsGet(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}
function settings(){var a=api(),pix=!(window.YPX)||YPX.want(),pk=window.YPX?YPX.pk():'own',low=lsGet('yd-lowfx','0')==='1',vib=lsGet('yd-vib','1')!=='0',snd=+lsGet('yd-ses','2');
  function tg(on,a2,b2){return'<span class="tg'+(on?' on':'')+'">'+(on?a2:b2)+'</span>'}
  var h='<h2>⚙ Ayarlar <button aria-label="Kapat">✕</button></h2>'+
   '<button class="row" id="s1"><span>🎨</span><b>Görünüm<br><small>Piksel sanat ya da klasik çizim</small></b>'+tg(pix,'Piksel','Klasik')+'</button>'+
   '<button class="row" id="s2"><span>🧍</span><b>Piksel karakter<br><small>Kendi tasarımın ya da macera kahramanı</small></b>'+tg(pk!=='pack','Kendi tasarımım','Kahraman')+'</button>'+
   '<button class="row" id="s3"><span>✨</span><b>Efektleri azalt<br><small>Zayıf telefonlarda daha akıcı</small></b>'+tg(low,'Açık','Kapalı')+'</button>'+
   '<button class="row" id="s4"><span>📳</span><b>Titreşim<br><small>Hasar ve seviye atlamada</small></b>'+tg(vib,'Açık','Kapalı')+'</button>'+
   '<button class="row" id="s6"><span>🔊</span><b>Ses<br><small>Müzik ve efektler</small></b>'+'<span class="tg'+(snd?' on':'')+'">'+['Kapalı','Efektler','Müzik + efekt'][snd]+'</span></button>'+
   '<button class="row" id="s7"><span>👤</span><b>Hesap<br><small>'+esc(a.email())+'</small></b><span class="tg">Çıkış yap</span></button>'+
   '<button class="row danger" id="s8"><span>🗑</span><b>Karakteri sil<br><small>Geri alınamaz</small></b></button>';show(h);
  $('#s1').onclick=function(){if(window.YPX){YPX.set(!YPX.want());YPX.clear();if(window.YG)YG.clear()}settings()};
  $('#s2').onclick=function(){if(window.YPX)YPX.pk(YPX.pk()==='pack'?'own':'pack');settings()};
  $('#s3').onclick=function(){try{localStorage.setItem('yd-lowfx',low?'0':'1')}catch(e){}var on=!low;window.YD_LOWFX=on;document.body.classList.toggle('lowfx',on);settings()};
  $('#s4').onclick=function(){try{localStorage.setItem('yd-vib',vib?'0':'1')}catch(e){}settings()};
  $('#s6').onclick=function(){try{localStorage.setItem('yd-ses',(snd+1)%3)}catch(e){}settings()};
  $('#s7').onclick=function(){a.signOut()};
  var armed=0;$('#s8').onclick=function(){if(!armed){armed=1;$('#s8').querySelector('small').textContent='Emin misin? Silmek için tekrar bas';setTimeout(function(){armed=0},4000);return}a.del()}}
window.YLB={open:open,close:close};
/* oyun bu dosyadan önce karakter ekranını açtıysa lobiyi şimdi aç */
function late(){try{var sc=document.getElementById('s-char'),co=document.getElementById('cold'),a=api();if(sc&&sc.classList.contains('on')&&co&&co.style.display!=='none'&&a&&a.P()&&!a.P().nickBad)open()}catch(e){}}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',late);else setTimeout(late,0);
})();
