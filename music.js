// Yaxest Games arka plan müziği: dosyasız, kodla üretilen yumuşak döngüler (lo-fi, chill, synth, groove, arcade, piyano).
// İlk dokunuşta başlar; duraklatınca / sekme gizlenince durur. Menüden "Müzik" düğmesiyle kapatılır (yx-music).
(function(){
  var p=location.pathname.split('/').filter(Boolean);if(p.length&&/\.html?$/.test(p[p.length-1]))p.pop();var cur=p.pop()||'';
  var MAP={
    sallan:'synth',kaydir:'chill',damla:'lofi',kir:'groove',radar:'synth',labirent:'chill',pota:'groove',mermi:'synth',nota:'piyano',zincir:'arcade',tirman:'arcade',lazer:'chill',bicak:'groove',duello:'arcade',tup:'lofi',
    hedef:'arcade',sayi:'lofi',yol:'synth',isik:'chill',renk:'arcade',balon:'arcade',kule:'lofi',kosu:'synth',hole:'chill',blok:'chill',yilan:'arcade',hafiza:'lofi',birlestir:'piyano',kostebek:'arcade',yorunge:'chill',moda:'lofi'
  };
  var style=MAP[cur];if(!style)return;
  var on=true;try{on=localStorage.getItem('yx-music')!=='0'}catch(e){}
  var AC=null,out,rv,t0=0,step=0,timer=0,paused=false,started=false;
  var ST={
    lofi:{bpm:78,root:57,prog:[[0,'m7'],[-4,'M7'],[3,'M7'],[-2,'dom']]},
    chill:{bpm:66,root:55,prog:[[0,'M7'],[-3,'m7'],[-7,'M7'],[-5,'dom']]},
    synth:{bpm:98,root:57,prog:[[0,'m7'],[-4,'M7'],[3,'M7'],[-2,'dom']]},
    groove:{bpm:112,root:59,prog:[[0,'m7'],[5,'m7'],[-4,'M7'],[-2,'dom']]},
    arcade:{bpm:118,root:60,prog:[[0,'M7'],[7,'dom'],[9,'m7'],[5,'M7']]},
    piyano:{bpm:86,root:60,prog:[[0,'M7'],[-3,'m7'],[5,'M7'],[7,'dom']]}
  }[style];
  var Q={m7:[0,3,7,10],M7:[0,4,7,11],dom:[0,4,7,10]},PENT=[0,2,4,7,9];
  var mtof=function(m){return 440*Math.pow(2,(m-69)/12)};
  function init(){
    if(AC){if(AC.state==='suspended'&&!paused&&on){try{AC.resume()}catch(e){}}return}
    var A=window.AudioContext||window.webkitAudioContext;if(!A)return;
    try{AC=new A()}catch(e){AC=null;return}
    var master=AC.createGain();master.gain.value=.5;
    var lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5200;
    var cp=AC.createDynamicsCompressor();cp.threshold.value=-20;cp.ratio.value=3;
    master.connect(lp);lp.connect(cp);cp.connect(AC.destination);out=master;
    var len=AC.sampleRate*1.6|0,b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);
    rv=AC.createConvolver();rv.buffer=b;var rg=AC.createGain();rg.gain.value=.35;rv.connect(rg);rg.connect(master);
    t0=AC.currentTime+.15;step=0;started=true;timer=setInterval(sched,50);
  }
  function osc(type,f,t,d,g,o){o=o||{};var os=AC.createOscillator(),e=AC.createGain();os.type=type;os.frequency.setValueAtTime(f,t);if(o.slide)os.frequency.exponentialRampToValueAtTime(o.slide,t+d);
    var n=os;if(o.lp){var l=AC.createBiquadFilter();l.type='lowpass';l.frequency.value=o.lp;os.connect(l);n=l}
    e.gain.setValueAtTime(.0001,t);e.gain.linearRampToValueAtTime(g,t+(o.a||.01));e.gain.exponentialRampToValueAtTime(.0001,t+d);n.connect(e);e.connect(out);if(o.send)e.connect(rv);os.start(t);os.stop(t+d+.05)}
  function noise(t,d,g,f,type){var s=AC.createBufferSource(),b=AC.createBuffer(1,AC.sampleRate*.3|0,AC.sampleRate),dd=b.getChannelData(0);for(var i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;s.buffer=b;
    var fl=AC.createBiquadFilter();fl.type=type||'highpass';fl.frequency.value=f;var e=AC.createGain();e.gain.setValueAtTime(g,t);e.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(e);e.connect(out);s.start(t);s.stop(t+d+.02)}
  var kick=function(t,g){osc('sine',130,t,.22,g,{slide:44,a:.004})};
  var snare=function(t,g){noise(t,.12,g,1800,'bandpass');osc('triangle',190,t,.08,g*.4,{slide:120,a:.003})};
  var hat=function(t,g){noise(t,.03,g,8500)};
  var key=function(m,t,d,g){var f=mtof(m);osc('sine',f,t,d,g,{send:1,a:.006});osc('sine',f*2,t,d*.5,g*.22,{send:1});osc('triangle',f,t,d*.7,g*.25,{lp:2200})};
  var pad=function(ns,t,d,g){for(var i=0;i<ns.length;i++){osc('triangle',mtof(ns[i]),t,d,g,{a:.45,lp:1000,send:1})}};
  var bass=function(m,t,d,g){osc('sine',mtof(m),t,d,g,{a:.012});osc('triangle',mtof(m),t,d*.8,g*.25,{lp:280})};
  function play(i,t){
    var s=i%16,bar=Math.floor(i/16),ch=ST.prog[bar%4],cr=ST.root+ch[0],ct=Q[ch[1]].map(function(v){return cr+v}),spb=60/ST.bpm,sd=spb/4,h=(bar*31+s*17)%13,pn=function(k){return ST.root+12+PENT[k%5]+(k>4?12:0)};
    var q=bar%8>=2; // ilk 2 ölçü sade giriş
    if(s===0)pad(ct.slice(0,3),t,spb*4*.98,style==='synth'?.032:.026);
    if(style==='lofi'){if(s===0||s===10)kick(t,.34);if(q&&(s===4||s===12))snare(t,.06);if(s%2===0)hat(t,s%4===2?.02:.012);if(s===0||s===10)bass(cr-24+12,t,spb*1.3,.22);
      if(s===0)ct.forEach(function(m){key(m+12,t,spb*1.8,.032)});if(q&&s%4===3&&h%3)key(pn(h%5),t,spb*.9,.04)}
    else if(style==='chill'){if(s===0)bass(cr-12,t,spb*4,.2);if(s===0)ct.forEach(function(m,k){key(m+12,t+k*.07,spb*3,.03)});if(s%4===2&&h%3===0)key(pn(h)+12,t,spb*1.6,.032)}
    else if(style==='synth'){if(s%4===0)kick(t,.38);if(q&&(s===4||s===12))snare(t,.07);if(s%4===2)hat(t,.02);if(s%2===0)bass(cr-12,t,spb*.22,.2);
      if(q&&s%2===0)osc('triangle',mtof(ct[[0,2,1,3,2,3,1,2][(s/2|0)%8]%4]+12),t,spb*.3,.04,{lp:2400,send:1})}
    else if(style==='groove'){if(s%4===0)kick(t,.4);if(q&&(s===4||s===12))snare(t,.06);if(s%4===2)hat(t,.03);if(s===2||s===6||s===10||s===14)bass(cr-12,t,spb*.3,.22);
      if(q&&(s===3||s===6||s===10))ct.slice(0,3).forEach(function(m){osc('triangle',mtof(m+12),t,spb*.3,.022,{lp:1500,send:1})});if(q&&s%8===5)key(pn(h)+12,t,spb*.7,.035)}
    else if(style==='arcade'){if(s%8===0)kick(t,.25);if(s%4===2)hat(t,.015);if(s%2===0)bass(cr-12,t,spb*.3,.16);
      if(q&&(s%2===0)){var seq=[0,2,4,2,5,4,2,0][((bar%2)*4+(s/4|0))%8];osc('triangle',mtof(pn(seq)+12),t,spb*.34,.045,{lp:2800,send:1})}}
    else{if(s%2===0)key(ct[[0,1,2,3,2,1,2,1][s/2|0]%4]+12,t,spb*1.1,.05);if(s===0)bass(cr-12,t,spb*3,.2);if(s===8)kick(t,.16);if(q&&s===12&&h%2)key(pn(h)+12,t,spb*1.2,.04)}
  }
  function sched(){if(!AC||paused||!on)return;var sd=60/ST.bpm/4;while(t0+step*sd<AC.currentTime+.2){play(step,t0+step*sd);step++}}
  window.YMUSIC={isOn:function(){return on},toggle:function(){on=!on;try{localStorage.setItem('yx-music',on?'1':'0')}catch(e){}if(on)init();return on}};
  ['pointerdown','keydown','touchstart'].forEach(function(t){addEventListener(t,function(){if(on)init()},{passive:true,capture:true})});
  setInterval(function(){if(!AC)return;var stop=window.YMENU||document.hidden||!on;
    if(stop&&AC.state==='running'){paused=true;try{AC.suspend()}catch(e){}}else if(!stop&&paused){paused=false;if(AC.currentTime>t0+step*60/ST.bpm/4+1){t0=AC.currentTime+.1;step=0}try{AC.resume()}catch(e){}}},150);
})();
