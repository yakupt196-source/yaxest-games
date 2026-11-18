// Yaxest Games ortak ses motoru: tamamen kodla üretilen, yumuşak ve birbiriyle uyumlu sesler.
// Tüm sesler aynı pentatonik gamda (Do majör) olduğu için birlikte hoş duyulur.
// Sesi kapatma düğmesi duraklatma menüsündedir (menu.js).
(function(){
  var cur=(function(){var p=location.pathname.split('/').filter(Boolean);if(p.length&&/\.html?$/.test(p[p.length-1]))p.pop();return p.pop()||''})();
  if(cur==='ritim'||!cur)return;
  var AC=null,out=null,rv=null,last={},PENT=[0,2,4,7,9],ROOT=72;
  function mtof(m){return 440*Math.pow(2,(m-69)/12)}
  function init(){
    if(AC){if(AC.state==='suspended'){try{AC.resume()}catch(e){}}return true}
    var A=window.AudioContext||window.webkitAudioContext;if(!A)return false;
    try{AC=new A()}catch(e){AC=null;return false}
    out=AC.createGain();out.gain.value=.8;
    var lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=6500;
    var cp=AC.createDynamicsCompressor();cp.threshold.value=-18;cp.ratio.value=3;
    out.connect(lp);lp.connect(cp);cp.connect(AC.destination);
    var len=AC.sampleRate*1.2|0,b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);
    for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);
    rv=AC.createConvolver();rv.buffer=b;var rg=AC.createGain();rg.gain.value=.25;rv.connect(rg);rg.connect(out);
    return true}
  function tone(f,t,d,g,o){o=o||{};var os=AC.createOscillator(),e=AC.createGain();os.type=o.type||'sine';os.frequency.setValueAtTime(f,t);
    if(o.slide)os.frequency.exponentialRampToValueAtTime(o.slide,t+d);
    var n=os;if(o.lp){var l=AC.createBiquadFilter();l.type='lowpass';l.frequency.value=o.lp;os.connect(l);n=l}
    e.gain.setValueAtTime(.0001,t);e.gain.linearRampToValueAtTime(g,t+(o.a||.005));e.gain.exponentialRampToValueAtTime(.0001,t+d);
    n.connect(e);e.connect(out);if(o.send!==0)e.connect(rv);os.start(t);os.stop(t+d+.05)}
  function note(m,t,g,d){var f=mtof(m);tone(f,t,d||.5,g,{a:.004});tone(f*3,t,.1,g*.16,{a:.002});tone(f,t,.18,g*.4,{type:'triangle',lp:1700})}
  var streak=0,streakT=0;
  var S={
    tap:function(t){tone(420,t,.07,.05,{slide:260,send:0})},
    pop:function(t){tone(380,t,.1,.08,{slide:760,send:0})},
    jump:function(t){tone(300,t,.14,.06,{slide:620,send:0})},
    ok:function(t){var now=performance.now();streak=now-streakT<1400?streak+1:0;streakT=now;var i=streak%10;note(ROOT+PENT[i%5]+(i>4?12:0),t,.08,.45)},
    gem:function(t){note(ROOT+12+PENT[4],t,.07,.4);note(ROOT+24,t+.07,.06,.5)},
    good:function(t){note(ROOT+PENT[2],t,.08,.5);note(ROOT+PENT[3],t+.09,.08,.6)},
    bad:function(t){tone(150,t,.26,.14,{slide:75,send:0})},
    over:function(t){[ROOT+PENT[3],ROOT+PENT[2],ROOT+PENT[0],ROOT-5].forEach(function(m,i){note(m,t+i*.16,.08,.7)})},
    win:function(t){[0,2,3,4,5].forEach(function(k,i){note(ROOT+PENT[k%5]+(k>4?12:0),t+i*.09,.09,.8)});note(ROOT+24,t+.5,.07,1)}
  };
  var cd={tap:.05,pop:.04,jump:.08,ok:.04,gem:.06,good:.1,bad:.2,over:.8,win:.8};
  function play(n){
    if(window.YMENU||document.hidden||!S[n])return;
    var now=performance.now();if(last[n]&&now-last[n]<(cd[n]||.05)*1000)return;last[n]=now;
    if(!init())return;try{S[n](AC.currentTime+.01)}catch(e){}}
  window.YS={play:play,init:init};
  // ilk dokunuşta ses motorunu hazırla (tarayıcılar kullanıcı hareketi ister)
  ['pointerdown','keydown','touchstart'].forEach(function(t){addEventListener(t,function(){init()},{once:false,passive:true,capture:true})});

  /* ---- Oyunlara otomatik bağlanma: skor, can, bitiş, mesaj ---- */
  function $(i){return document.getElementById(i)}
  function num(el){var m=el&&(el.textContent||'').match(/-?\d+/);return m?+m[0]:null}
  function watch(el,fn){if(!el)return;new MutationObserver(fn).observe(el,{childList:true,characterData:true,subtree:true,attributes:true})}
  var CFG={
    balon:{score:'big',lives:'hp',ov:1},hedef:{score:'big',lives:'hp',ov:1},karo:{score:'big',ov:1,tap:'#c'},renk:{score:'big',ov:1},sayi:{score:'big',ov:1},
    yol:{milestone:'big',ov:1,tap:'#c',tapName:'tap'},kule:{score:'big',ov:1,tap:'#c',tapName:'tap'},blok:{ov:1,tap:'#c',tapName:'tap',score:'sc'},kosu:{milestone:'sc',gem:'gm',ov:1,tap:'#c',tapName:'tap'},
    kostebek:{score:'s',scoreName:'pop',msg:'w'},yilan:{score:'s',msg:'',canvasOver:1},
    hafiza:{msg:'w',match:1,tap:'#g',tapName:'tap'},birlestir:{msg:'w',score:'s',tap:'#g',tapName:'tap'},isik:{msg:'msg',tap:'#grid',tapName:'tap'},
    yorunge:{score:'big',ov:1,tap:'#c',tapName:'jump'},
    hole:{bar:'bi',menuTitle:'mt'}
  }[cur]||{};
  function bind(){
    var c=CFG,prev={};
    if(c.score){var e=$(c.score);var p=num(e);watch(e,function(){var n=num(e);if(n!=null&&p!=null&&n>p)play(c.scoreName||'ok');p=n})}
    if(c.milestone){var me=$(c.milestone),pmn=num(me);watch(me,function(){var n=num(me);if(n!=null&&pmn!=null&&Math.floor(n/10)>Math.floor(pmn/10))play('good');pmn=n})}
    if(c.gem){var g=$(c.gem),pg=num(g);watch(g,function(){var n=num(g);if(n!=null&&pg!=null&&n>pg)play('gem');pg=n})}
    if(c.lives){var h=$(c.lives),pc=(h&&h.textContent.match(/❤/g)||[]).length;watch(h,function(){var n=(h.textContent.match(/❤/g)||[]).length;if(n<pc)play('bad');pc=n})}
    if(c.ov){var ov=$('ov'),was=ov&&ov.classList.contains('hid');watch(ov,function(){var hid=ov.classList.contains('hid');
      if(was&&!hid){var t=($('ot')&&$('ot').textContent||'');play(/tamam|kazan|Tebrik|Mükemmel!/i.test(t)?'win':'over')}was=hid})}
    if(c.msg){var m=$(c.msg),pt='';watch(m,function(){var t=m.textContent||'';if(t&&t!==pt){if(/kazand|🎉|tamam|Bitti|Tebrik/i.test(t))play('win');else if(/bitti|doldu|Oyun/i.test(t))play('over')}pt=t})}
    if(c.match){var gg=$('g'),pm=0;watch(gg,function(){var n=gg.querySelectorAll('.m').length;if(n>pm)play('good');pm=n})}
    if(c.bar){var b=$(c.bar),pw=parseFloat(b.style.width)||0;watch(b,function(){var w=parseFloat(b.style.width)||0;if(w>pw)play('ok');pw=w})}
    if(c.menuTitle){var mt=$(c.menuTitle),pm2='';watch(mt,function(){var t=mt.textContent;if(t!==pm2&&/tamam|yuttun/i.test(t))play('win');pm2=t})}
    if(c.tap){var el=document.querySelector(c.tap);if(el)el.addEventListener('pointerdown',function(){play(c.tapName||'tap')},true)}
    if(c.canvasOver){window.addEventListener('yx-over',function(){play('over')})}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
