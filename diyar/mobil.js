/* Yaxest Diyarı · mobil uygulama katmanı
   - Servis çalışanı: oyun ana ekrandan açılınca da güncel gelir, internet kopunca son sürüm açılır.
   - "Uygulamayı yükle" düğmesi (Android/Chrome) ve iPhone için "Ana Ekrana Ekle" ipucu.
   - Titreşim: hasar alınca ve seviye atlayınca kısa titreşim (dokunmatik cihazlarda).
   - Uygulama olarak açıldıysa (standalone) gövdeye .app sınıfı eklenir. */
(function(){
try{if('serviceWorker' in navigator)navigator.serviceWorker.register('../sw.js',{scope:'/'}).catch(function(){})}catch(e){}
var touch=matchMedia('(pointer:coarse)').matches,app=matchMedia('(display-mode: standalone),(display-mode: fullscreen)').matches||navigator.standalone===true;
if(app)document.documentElement.classList.add('app');
var deferred=null;
function btn(){var m=document.getElementById('mlowfx');if(!m||document.getElementById('minst'))return document.getElementById('minst');var b=document.createElement('button');b.className='btn';b.id='minst';b.type='button';b.textContent='📲 Uygulamayı yükle';b.hidden=true;m.parentNode.insertBefore(b,m);b.onclick=install;return b}
function toast(html,ms){var t=document.createElement('div');t.id='yinst';t.innerHTML=html;t.style.cssText='position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:60;max-width:min(92vw,440px);padding:11px 14px;border-radius:14px;border:2px solid transparent;background:linear-gradient(180deg,rgba(44,30,20,.96),rgba(22,15,10,.96)) padding-box,linear-gradient(135deg,#fbe39a,#c58b2e 28%,#7a4e17 50%,#e9bb57 72%,#8a5a1c) border-box;color:#f3e2bd;font:600 .86rem "Chakra Petch",sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.6);display:flex;gap:10px;align-items:center';document.body.appendChild(t);setTimeout(function(){t.remove()},ms||9000);return t}
function install(){if(!deferred)return;deferred.prompt();deferred.userChoice.then(function(r){if(r&&r.outcome==='accepted'){var b=btn();if(b)b.hidden=true}deferred=null}).catch(function(){})}
addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;var b=btn();if(b)b.hidden=false;
  var seen=0;try{seen=+localStorage.getItem('yd-inst')||0}catch(er){}if(touch&&Date.now()-seen>3*864e5){try{localStorage.setItem('yd-inst',Date.now())}catch(er){}var t=toast('<span style="font-size:1.4rem">📲</span><span style="flex:1">Diyar\'ı uygulama olarak yükle: tam ekran, daha hızlı açılış.</span><button class="btn" style="padding:6px 12px">Yükle</button>',12000);t.querySelector('button').onclick=function(){t.remove();install()}}});
addEventListener('appinstalled',function(){var b=btn();if(b)b.hidden=true;deferred=null});
/* iPhone/iPad Safari: yükleme istemi yok, bir kez ipucu */
var ios=/iP(hone|ad|od)/.test(navigator.userAgent)&&!window.MSStream;if(ios&&!app){var s0=0;try{s0=+localStorage.getItem('yd-ios')||0}catch(e){}if(Date.now()-s0>5*864e5){setTimeout(function(){try{localStorage.setItem('yd-ios',Date.now())}catch(e){}toast('<span style="font-size:1.4rem">📲</span><span>Uygulama gibi oynamak için: <b>Paylaş</b> ⬆️ → <b>Ana Ekrana Ekle</b></span>',11000)},4000)}}
/* titreşim */
var lastV=0,lastHp=null,lastLv=null;function vib(p){if(!touch||!navigator.vibrate)return;var n=Date.now();if(n-lastV<180)return;lastV=n;try{navigator.vibrate(p)}catch(e){}}
setInterval(function(){var y=window.__yd;if(!y||!y.G||!y.P)return;var G=y.G,P=y.P;if(lastHp!=null&&G.hp<lastHp-1&&G.mode!=='house')vib(G.dead>0?[60,40,120]:22);lastHp=G.hp;if(lastLv!=null&&P.lv>lastLv)vib([30,40,30,40,80]);lastLv=P.lv},120);
setInterval(btn,2000);
})();
