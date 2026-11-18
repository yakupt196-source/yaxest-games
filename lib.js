// Yaxest oyun çatısı: tuval, döngü, skor/rekor, başlangıç/bitiş ekranı, dokunma. Yeni oyunlar bunu kullanır.
(function(){
  var $=function(i){return document.getElementById(i)};
  var G=window.G={state:'menu',score:0,best:0,t:0,W:360,H:600,dpr:1,key:'',game:null,overAt:0,onGo:null};
  var c=G.c=$('c'),x=G.x=c.getContext('2d'),last=0;
  G.$=$;
  G.rnd=function(a,b){return a+Math.random()*(b-a)};
  G.ri=function(a,b){return Math.floor(a+Math.random()*(b-a+1))};
  G.pick=function(a){return a[Math.floor(Math.random()*a.length)]};
  G.clamp=function(v,a,b){return v<a?a:v>b?b:v};
  G.sfx=function(n){try{window.YS&&YS.play(n)}catch(e){}};
  G.rs=function(){var d=Math.min(devicePixelRatio||1,2),r=c.getBoundingClientRect();G.dpr=d;G.W=r.width||360;G.H=r.height||600;c.width=G.W*d;c.height=G.H*d;x.setTransform(d,0,0,d,0,0);if(G.game&&G.game.resize)G.game.resize()};
  G.setScore=function(n){G.score=n;var b=$('big');if(b)b.textContent=n};
  G.show=function(title,html,btn){$('ot').textContent=title;$('op').innerHTML=html;$('go').textContent=btn||'Başla';$('ov').classList.remove('hid')};
  G.hide=function(){$('ov').classList.add('hid')};
  G.start=function(){G.t=0;G.state='play';G.hide();G.setScore(0);if(G.game&&G.game.init)G.game.init()};
  G.bump=function(){if(G.score>G.best){G.best=G.score;try{localStorage.setItem('yx-'+G.key+'-best',G.best)}catch(e){}}$('bs').textContent=G.best};
  // Oyun bitti: skor/rekor kaydı ve ekran
  G.over=function(title){
    if(G.state!=='play')return;G.state='over';G.overAt=performance.now()+600;
    if(G.score>G.best){G.best=G.score;try{localStorage.setItem('yx-'+G.key+'-best',G.best)}catch(e){}}
    $('bs').textContent=G.best;try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}
    G.show(title||'Oyun bitti','Skor <b>'+G.score+'</b><br>Rekor <b>'+G.best+'</b>','Tekrar oyna')};
  // Seviye tamam ekranı (bulmaca oyunları): onGo bir sonraki adıma geçer
  G.pause=function(title,html,btn,fn){G.state='wait';G.overAt=performance.now()+400;G.onGo=fn;G.show(title,html,btn)};
  G.run=function(game){
    G.game=game;G.key=game.key;try{G.best=+localStorage.getItem('yx-'+G.key+'-best')||0}catch(e){}$('bs').textContent=G.best;
    G.rs();addEventListener('resize',G.rs);
    var P=function(e){var r=c.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
    c.addEventListener('pointerdown',function(e){if(G.state!=='play'||!game.down)return;var p=P(e);try{c.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();game.down(p[0],p[1],e)});
    c.addEventListener('pointermove',function(e){if(G.state!=='play'||!game.move)return;var p=P(e);game.move(p[0],p[1],e)});
    var up=function(e){if(!game.up)return;var p=P(e);game.up(p[0],p[1],e)};
    c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
    addEventListener('keydown',function(e){
      var k=e.key;
      if(G.state!=='play'){if((k===' '||k==='Enter')&&!$('ov').classList.contains('hid')){e.preventDefault();$('go').click()}return}
      if(game.key_&&game.key_(e,true))e.preventDefault()});
    addEventListener('keyup',function(e){if(G.state==='play'&&game.key_&&game.key_(e,false))e.preventDefault()});
    $('go').onclick=function(){if(performance.now()<G.overAt)return;
      if(G.state==='wait'&&G.onGo){var f=G.onGo;G.onGo=null;G.hide();G.state='play';f();return}
      G.start()};
    function loop(ts){requestAnimationFrame(loop);var dt=Math.min(.05,(ts-last)/1000||0);last=ts;
      if(G.state==='play'){G.t+=dt;game.update&&game.update(dt)}
      else if(game.idle)game.idle(dt);
      x.clearRect(0,0,G.W,G.H);game.draw&&game.draw()}
    try{if(game.init)game.init()}catch(_){}
    requestAnimationFrame(loop);
  };
  // yardımcı çizimler
  var tc={};G.text=function(s,px,py,size,col,al){s=String(s);if(window.YI18N){var k=YI18N.lang+'|'+s,v=tc[k];if(v==null){v=tc[k]=YI18N.t(s)}s=v}x.fillStyle=col||'#fff';x.font='800 '+Math.round(size)+'px "Bricolage Grotesque",system-ui,sans-serif';x.textAlign=al||'center';x.textBaseline='middle';x.fillText(s,px,py)};
  G.bg=function(c1,c2){var g=x.createLinearGradient(0,0,0,G.H);g.addColorStop(0,c1||'#0f0b2b');g.addColorStop(1,c2||'#241458');x.fillStyle=g;x.fillRect(0,0,G.W,G.H)};
  G.circle=function(px,py,r,col,glow){x.save();if(glow){x.shadowColor=col;x.shadowBlur=glow}x.fillStyle=col;x.beginPath();x.arc(px,py,Math.max(0,r),0,7);x.fill();x.restore()};
  G.rrect=function(px,py,w,h,r,col){x.fillStyle=col;x.beginPath();if(x.roundRect)x.roundRect(px,py,w,h,r);else x.rect(px,py,w,h);x.fill()};
  G.COLS=['#3df0ff','#ff5c8a','#ffd23f','#b388ff','#3ddbb0','#ff9f43'];
})();
