// Her oyun sayfasında: sol altta menü düğmesi, tüm oyunları listeleyen panel.
// Panel açıkken oyun durur (animasyon çerçeveleri ve YMENU bayrağı ile).
(function(){
  var G=window.YAXEST_GAMES||[];
  var parts=location.pathname.split('/').filter(Boolean);
  if(parts.length&&/\.html?$/.test(parts[parts.length-1]))parts.pop();
  var cur=parts.pop()||'';
  var css=document.createElement('style');
  css.textContent=
   '#ymb{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));width:44px;height:44px;border-radius:50%;border:2px solid rgba(255,255,255,.3);background:rgba(31,26,66,.82);color:#fff;font:700 20px/1 system-ui,sans-serif;display:grid;place-items:center;cursor:pointer;z-index:99998;padding:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent}'+
   '#ymb,#ymx{padding:0;min-height:0;min-width:0;line-height:1;box-sizing:border-box;font-family:system-ui,sans-serif}'+
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
  html+='</div><a class="home" href="../">← Ana sayfa</a>';
  panel.innerHTML=html;

  var origRAF=window.requestAnimationFrame.bind(window),queue=[],open=false;
  function pause(){window.YMENU=true;window.requestAnimationFrame=function(cb){queue.push(cb);return 0}}
  function resume(){window.YMENU=false;window.requestAnimationFrame=origRAF;var q=queue;queue=[];q.forEach(function(cb){origRAF(cb)})}
  function show(){if(open)return;open=true;pause();panel.classList.add('on');document.getElementById('ymx').focus()}
  function hide(){if(!open)return;open=false;panel.classList.remove('on');resume();btn.focus()}
  function stop(e){e.stopPropagation()}
  ['pointerdown','pointerup','touchstart','touchend','mousedown','click'].forEach(function(t){btn.addEventListener(t,stop);panel.addEventListener(t,stop)});
  btn.addEventListener('click',show);
  panel.querySelector('#ymx').addEventListener('click',hide);
  addEventListener('keydown',function(e){if(e.key==='Escape'&&open){hide()}},true);
  document.body.appendChild(btn);document.body.appendChild(panel);
})();
