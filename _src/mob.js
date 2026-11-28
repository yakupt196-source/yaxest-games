/* mobil: tam ekran + yatay kilit + dikeyde döndür uyarısı (Diyar mantığı) */
(function(){
var touch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches;if(!touch)return;
var std=function(){return matchMedia('(display-mode: standalone),(display-mode: fullscreen)').matches||navigator.standalone===true};
var el=document.createElement('div');el.id='rotov';
el.innerHTML='<div class="ph">📱</div><b>Telefonunu yatay çevir</b><span>Yüz Mühür yatay oynanır. Ekran döndürme kilidi kapalı olmalı.</span>';
var bar=document.createElement('div');bar.id='fsbar';bar.innerHTML='<span>Tam ekran oyna</span><button id="fsgo2" type="button">Tam ekran</button><button id="fsx2" type="button">×</button>';
var st=document.createElement('style');st.textContent='#rotov{position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:#0b0f18;color:#f1e7c8;font:600 18px system-ui,sans-serif;text-align:center;padding:24px}#rotov span{font:400 13px system-ui;opacity:.75;max-width:280px}#rotov .ph{font-size:56px;animation:rtt 2s ease-in-out infinite}@keyframes rtt{0%,30%{transform:rotate(0)}60%,100%{transform:rotate(-90deg)}}body.port #rotov{display:flex}#fsbar{position:fixed;right:calc(8px + env(safe-area-inset-right));top:calc(6px + env(safe-area-inset-top));z-index:99998;display:none;align-items:center;gap:8px;padding:6px 10px;border-radius:14px;background:rgba(14,18,30,.95);border:1px solid #d4a62a;color:#f1e7c8;font:600 13px system-ui}#fsbar button{border:0;border-radius:9px;padding:7px 12px;font:700 13px system-ui;background:#d4a62a;color:#1a1408}#fsbar #fsx2{background:#2a2f40;color:#ccc;padding:7px 10px}';
document.head.appendChild(st);document.body.appendChild(el);document.body.appendChild(bar);
var fsOk=!!document.documentElement.requestFullscreen,hide=0;
function go(){try{if(fsOk&&!document.fullscreenElement)document.documentElement.requestFullscreen({navigationUI:'hide'}).catch(function(){}).then(function(){try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(function(){})}catch(e){}})}catch(e){}}
function chk(){var port=innerHeight>innerWidth;document.body.classList.toggle('port',port);
 bar.style.display=(!port&&!hide&&fsOk&&!document.fullscreenElement&&!std())?'flex':'none'}
addEventListener('resize',function(){setTimeout(chk,150)});addEventListener('orientationchange',function(){setTimeout(chk,300)});
document.addEventListener('fullscreenchange',function(){setTimeout(chk,200)});
document.getElementById('fsgo2').onclick=function(){go();bar.style.display='none'};
document.getElementById('fsx2').onclick=function(){hide=1;chk()};
document.addEventListener('pointerup',function(){if(fsOk&&!document.fullscreenElement&&!hide&&innerWidth>innerHeight)go()},{passive:true});
try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(function(){})}catch(e){}
chk();
})();
