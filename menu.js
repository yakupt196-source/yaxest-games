// Her oyun sayfasında: sol altta menü düğmesi, tüm oyunları listeleyen panel.
// Panel açıkken oyun durur (animasyon çerçeveleri ve YMENU bayrağı ile).
(function(){
  /* Tüm oyunlar için ortak ses kontrolü: her AudioContext'in çıkışı tek bir ana ses düğümünden geçer */
  var ymAudio=[],ymMuted=false;try{ymMuted=localStorage.getItem('yx-mute')==='1'}catch(e){}
  try{var OC=AudioNode.prototype.connect;AudioNode.prototype.connect=function(d){
    if(typeof AudioDestinationNode!=='undefined'&&d instanceof AudioDestinationNode&&this.context&&this.context.createGain){var c=this.context;
      if(!c.__ym){var g=c.createGain();g.gain.value=ymMuted?0:1;OC.call(g,d);c.__ym=g;ymAudio.push(g)}
      var a=Array.prototype.slice.call(arguments);a[0]=c.__ym;return OC.apply(this,a)}
    return OC.apply(this,arguments)}}catch(e){}
  var G=window.YAXEST_GAMES||[];
  var parts=location.pathname.split('/').filter(Boolean);
  if(parts.length&&/\.html?$/.test(parts[parts.length-1]))parts.pop();
  var cur=parts.pop()||'';
  var css=document.createElement('style');
  css.textContent='@media (min-width:600px){#wrap{background:#0f0b2b;box-shadow:0 0 0 2px rgba(61,240,255,.45),0 0 60px rgba(61,240,255,.16);border-radius:8px;overflow:hidden;margin-bottom:16px}}'+
   '#ymb{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));width:44px;height:44px;border-radius:50%;border:2px solid rgba(255,255,255,.3);background:rgba(31,26,66,.82);color:#fff;font:700 20px/1 system-ui,sans-serif;display:grid;place-items:center;cursor:pointer;z-index:99998;padding:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent}'+
   '#ymb,#ymx{padding:0;min-height:0;min-width:0;line-height:1;box-sizing:border-box;font-family:system-ui,sans-serif}'+
   '#ymp .ylw{max-width:560px;width:100%;margin:14px auto 0;display:flex;justify-content:center}'+
   '.ylang{min-height:44px;padding:0 14px;border-radius:12px;border:1px solid #4b4390;background:#241d52;color:#fff;font:600 1rem system-ui,sans-serif;max-width:100%}'+
   '#ymq{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));width:48px;height:48px;border-radius:50%;border:2px solid rgba(255,210,63,.7);background:rgba(31,26,66,.9);color:#fff;font:700 18px/1 system-ui,sans-serif;display:grid;place-items:center;cursor:pointer;z-index:99998;padding:0;min-height:0;min-width:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent}'+
   '#ymz{position:fixed;inset:0;background:rgba(14,11,34,.94);z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:20px;font-family:"Bricolage Grotesque",system-ui,sans-serif;color:#f6f3ff;-webkit-user-select:none;user-select:none}'+
   '#ymc{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(14,11,34,.55);color:#ffd23f;font:800 28vmin "Bricolage Grotesque",system-ui,sans-serif;pointer-events:all}#ymc.on{display:flex}'+
   '#ymz.on{display:flex}#ymz h2{font-size:2rem;font-weight:800;margin:0 0 6px}'+
   '#ymz button,#ymz a{min-width:240px;min-height:48px;border-radius:999px;border:0;background:#2b2559;color:#fff;font:800 1rem "Bricolage Grotesque",system-ui,sans-serif;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;padding:0 24px}'+
   '#ymz .pr{background:#ffd23f;color:#14102b;font-size:1.1rem}'+
   '#ymq:focus-visible,#ymz button:focus-visible,#ymz a:focus-visible{outline:3px solid #ffd23f}'+
   '#ymb:focus-visible,#ymp a:focus-visible,#ymx:focus-visible{outline:3px solid #ffd23f}'+
   '#ymp{position:fixed;inset:0;background:rgba(14,11,34,.97);z-index:99999;display:none;flex-direction:column;overflow-y:auto;padding:calc(env(safe-area-inset-top,0px) + 16px) 16px calc(env(safe-area-inset-bottom,0px) + 24px);font-family:"Bricolage Grotesque",system-ui,sans-serif;color:#f6f3ff;touch-action:pan-y;-webkit-user-select:none;user-select:none}'+
   '#ymp.on{display:flex}'+
   '#ymp header{display:flex;justify-content:space-between;align-items:center;max-width:560px;width:100%;margin:0 auto 14px;font-weight:800;font-size:1.3rem}'+
   '#ymx{width:44px;height:44px;border-radius:50%;border:0;background:#2b2559;color:#fff;font-size:20px;cursor:pointer}'+
   '#ymg{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:560px;width:100%;margin:0 auto}'+
   '#ymp a{display:flex;align-items:center;gap:10px;background:#1f1a42;border:2px solid transparent;border-radius:16px;padding:10px 12px;min-height:56px;color:inherit;text-decoration:none;font-weight:700;font-size:.95rem}'+
   '#ymp a.cur{border-color:#ffd23f}'+
   '#ymp a small{display:block;color:#a9a3cf;font-weight:400;font-size:.75rem}'+
   '#ymp .ico{font-size:1.5rem;width:38px;height:38px;border-radius:10px;display:grid;place-items:center;flex:none}'+
   '#ymp .home{display:block;max-width:560px;width:100%;margin:14px auto 0;text-align:center;background:#ffd23f;color:#14102b;border-radius:999px;padding:14px;font-weight:800;text-decoration:none}';
  document.head.appendChild(css);

  var btn=document.createElement('button');
  btn.id='ymb';btn.type='button';btn.setAttribute('aria-label','Menü');btn.textContent='☰';

  var panel=document.createElement('div');
  panel.id='ymp';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Oyun menüsü');
  var html='<header><span>Yaxest Games</span><button id="ymx" type="button" aria-label="Menüyü kapat">✕</button></header><div id="ymg">';
  G.forEach(function(g){
    html+='<a href="../'+g.id+'/"'+(g.id===cur?' class="cur" aria-current="page"':'')+'><span class="ico" style="background:'+g.c+'">'+g.i+'</span><span>'+g.n.replace('Yaxest ','')+(g.id===cur?'<small>Şu an oynuyorsun</small>':'')+'</span></a>';
  });
  html+='</div><div class="ylw"></div><a class="home" href="../">← Ana sayfa</a>';
  panel.innerHTML=html;
  if(window.YI18N){panel.querySelector('.ylw').appendChild(YI18N.select())}

  var pz=document.createElement('div');
  pz.id='ymz';pz.setAttribute('role','dialog');pz.setAttribute('aria-label','Duraklatıldı');
  pz.innerHTML='<h2>Duraklatıldı</h2><button class="pr" id="ymr" type="button">Devam et</button><button id="ymrs" type="button">Baştan başla</button><button id="yms" type="button"></button><button id="ymm" type="button"></button><button id="yml" type="button">Tüm oyunlar</button><a href="../">← Ana sayfa</a>';
  var pbtn=document.createElement('button');pbtn.id='ymq';pbtn.type='button';pbtn.setAttribute('aria-label','Duraklat');pbtn.textContent='⏸';
  var origRAF=window.requestAnimationFrame.bind(window),queue=[],open=false;
  function pause(){window.YMENU=true;window.requestAnimationFrame=function(cb){queue.push(cb);return 0}}
  function resume(){window.YMENU=false;window.requestAnimationFrame=origRAF;var q=queue;queue=[];q.forEach(function(cb){origRAF(cb)})}
  function show(){if(open)return;open=true;pause();panel.classList.add('on');document.getElementById('ymx').focus()}
  function hide(){if(!open)return;open=false;panel.classList.remove('on');resume();btn.focus()}
  var zopen=false;
  var cd=document.createElement('div');cd.id='ymc';var cdt=0;
  var sb=pz.querySelector('#yms');
  var mb=pz.querySelector('#ymm');
  function mus(){mb.style.display=window.YMUSIC?'':'none';var t=window.YMUSIC&&YMUSIC.isOn()?'🎵 Müzik: açık':'🎵 Müzik: kapalı';mb.textContent=window.YT?window.YT(t):t}
  mb.addEventListener('click',function(){if(window.YMUSIC){YMUSIC.toggle();mus()}});
  function snd(){mus();sb.style.display=ymAudio.length?'':'none';var t=ymMuted?'🔇 Ses: kapalı':'🔊 Ses: açık';sb.textContent=window.YT?window.YT(t):t}
  function zshow(){if(zopen||open||cdt)return;zopen=true;pause();snd();pz.classList.add('on');document.getElementById('ymr').focus()}
  function zhide(){if(!zopen||cdt)return;pz.classList.remove('on');var n=3;cd.textContent=n;cd.classList.add('on');
    cdt=setInterval(function(){n--;if(n>0){cd.textContent=n;return}clearInterval(cdt);cdt=0;cd.classList.remove('on');zopen=false;resume()},550)}
  function stop(e){e.stopPropagation()}
  ['pointerdown','pointerup','touchstart','touchend','mousedown','click'].forEach(function(t){btn.addEventListener(t,stop);panel.addEventListener(t,stop)});
  ['pointerdown','pointerup','touchstart','touchend','mousedown','click'].forEach(function(t){pbtn.addEventListener(t,stop);pz.addEventListener(t,stop)});
  btn.addEventListener('click',show);
  pbtn.addEventListener('click',zshow);
  pz.querySelector('#ymr').addEventListener('click',zhide);
  sb.addEventListener('click',function(){ymMuted=!ymMuted;try{localStorage.setItem('yx-mute',ymMuted?'1':'0')}catch(e){}ymAudio.forEach(function(g){g.gain.value=ymMuted?0:1});snd()});
  pz.querySelector('#ymrs').addEventListener('click',function(){location.reload()});
  pz.querySelector('#yml').addEventListener('click',function(){zopen=false;pz.classList.remove('on');open=true;panel.classList.add('on');document.getElementById('ymx').focus()});
  panel.querySelector('#ymx').addEventListener('click',hide);
  addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase();if(k==='escape'&&open){hide()}else if(k==='escape'&&zopen){zhide()}else if((k==='p'||k==='escape')&&!open&&!zopen&&cur!=='ritim'){zshow()}},true);
  document.body.appendChild(btn);document.body.appendChild(panel);document.body.appendChild(pz);document.body.appendChild(cd);
  document.addEventListener('visibilitychange',function(){if(document.hidden&&cur!=='ritim')zshow()});
  if(cur!=='ritim')document.body.appendChild(pbtn);
})();

;(function(){try{var d=new Date(),k=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(),a=JSON.parse(localStorage.getItem('yx-days')||'[]');if(a.indexOf(k)<0){a.push(k);localStorage.setItem('yx-days',JSON.stringify(a.slice(-90)))}}catch(e){}})();
