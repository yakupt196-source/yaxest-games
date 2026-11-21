/* Yaxest oda sistemi: sunucusuz çok oyunculu masa oyunları.
   Oda sahibi (host) oyunun hakemidir; arkadaşlar oda koduyla bağlanır (halka açık MQTT aracıları üzerinden).
   Eksik oyuncuların yerini bot doldurur. Oyun mantığı (logic) ve arayüzü (ui) oyun dosyasından gelir.
   logic: {n, init(n,opts), apply(st,seat,act), view(st,seat), turn(st), over(st), bot(st,seat,level), hot?}
   ui:    {mount(root,ctx), view(v,meta), unmount?()} */
(function(){
'use strict';
var T=function(s){try{return window.YT?YT(s):s}catch(e){return s}};
var $=function(i){return document.getElementById(i)};
var CH='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function mkcode(){var s='';for(var i=0;i<5;i++)s+=CH[Math.floor(Math.random()*CH.length)];return s}
function tok(){return Math.random().toString(36).slice(2,10)+Math.random().toString(36).slice(2,6)}
function clone(o){return JSON.parse(JSON.stringify(o))}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

/* ---------- taşıma katmanları ---------- */
/* Çevrimiçi taşıma: halka açık MQTT (WebSocket) aracıları üzerinden aktarma. NAT/telefon verisi/okul ağı fark etmez; kayıt veya anahtar gerekmez.
   Oda sahibi ve misafir aynı anda birkaç aracıya bağlanır, ilk cevap veren seçilir. Misafir ayrılırsa (Last Will) oda sahibi otomatik haberdar olur. */
var BROKERS=['wss://broker.emqx.io:8084/mqtt','wss://broker.hivemq.com:8884/mqtt','wss://test.mosquitto.org:8081'];
function loadMqtt(){return new Promise(function(res,rej){if(window.mqtt)return res(window.mqtt);
  var urls=['https://unpkg.com/mqtt@5.10.1/dist/mqtt.min.js','https://cdn.jsdelivr.net/npm/mqtt@5.10.1/dist/mqtt.min.js'],i=0;
  (function next(){if(i>=urls.length)return rej(new Error('mqtt'));var s=document.createElement('script');s.src=urls[i++];s.onload=function(){window.mqtt?res(window.mqtt):next()};s.onerror=next;document.head.appendChild(s)})()})}
function mbase(gid,code){return'yaxest7/'+gid+'/'+code+'/'}
function mconn(M,url,will,onUp){var done=false,c;
  try{c=M.connect(url,{clientId:'yx_'+tok(),clean:true,connectTimeout:7000,reconnectPeriod:2500,keepalive:25,resubscribe:true,will:will||undefined})}catch(e){return null}
  c.on('error',function(){});c.on('connect',function(){if(!done){done=true;onUp(c)}});return c}
var Online={
  host:function(gid,code,onconn){return loadMqtt().then(function(M){return new Promise(function(res,rej){
    var base=mbase(gid,code),links={},clients=[],ok=false,fails=0;
    function mk(c,id){return{send:function(o){try{c.publish(base+'g/'+id,JSON.stringify({t:'d',d:o}),{qos:1})}catch(e){}},close:function(){try{c.publish(base+'g/'+id,JSON.stringify({t:'bye'}))}catch(e){}},onmessage:null,onclose:null}}
    BROKERS.forEach(function(u){var c=mconn(M,u,{topic:base+'hs',payload:JSON.stringify({t:'hostbye'}),qos:1},function(c){
      c.subscribe(base+'h',{qos:1},function(err){if(err)return;if(!ok){ok=true;res({close:function(){clients.forEach(function(x){try{x.publish(base+'hs',JSON.stringify({t:'hostbye'}));setTimeout(function(){x.end(true)},200)}catch(e){}})}})}});
      c.on('message',function(t,buf){if(t!==base+'h')return;var m;try{m=JSON.parse(buf.toString())}catch(e){return}if(!m||!m.f)return;var l=links[m.f];
        if(m.t==='hi'){if(!l){l=links[m.f]=mk(c,m.f);onconn(l)}c.publish(base+'g/'+m.f,JSON.stringify({t:'ok'}),{qos:1});return}
        if(!l)return;if(m.t==='bye'){var q=l;delete links[m.f];q.onclose&&q.onclose()}else if(m.t==='d')l.onmessage&&l.onmessage(m.d)})});
      if(c)clients.push(c);else fails++});
    setTimeout(function(){if(!ok){clients.forEach(function(x){try{x.end(true)}catch(e){}});rej(new Error('mqtt'))}},9000)})})},
  join:function(gid,code){return loadMqtt().then(function(M){return new Promise(function(res,rej){
    var base=mbase(gid,code),g=tok(),clients=[],chosen=null,done=false,hiT=[];
    function finish(c){if(done)return;done=true;chosen=c;hiT.forEach(clearInterval);clients.forEach(function(x){if(x!==c)try{x.end(true)}catch(e){}});clearTimeout(to);
      var l={send:function(o){try{c.publish(base+'h',JSON.stringify({f:g,t:'d',d:o}),{qos:1})}catch(e){}},
        close:function(){try{c.publish(base+'h',JSON.stringify({f:g,t:'bye'}),{qos:1})}catch(e){}setTimeout(function(){try{c.end(true)}catch(e){}},250)},onmessage:null,onclose:null};
      c.on('message',function(t,buf){var m;try{m=JSON.parse(buf.toString())}catch(e){return}if(!m)return;
        if(t===base+'g/'+g&&m.t==='d')l.onmessage&&l.onmessage(m.d);else if((t===base+'g/'+g&&m.t==='bye')||(t===base+'hs'&&m.t==='hostbye'))l.onclose&&l.onclose()});
      res(l)}
    var to=setTimeout(function(){if(!done){done=true;hiT.forEach(clearInterval);clients.forEach(function(x){try{x.end(true)}catch(e){}});rej(new Error(clients.length?'timeout':'mqtt'))}},12000);
    BROKERS.forEach(function(u){var c=mconn(M,u,{topic:base+'h',payload:JSON.stringify({f:g,t:'bye'}),qos:1},function(c){
      c.subscribe([base+'g/'+g,base+'hs'],{qos:1},function(err){if(err||done)return;
        c.on('message',function(t,buf){if(done)return;var m;try{m=JSON.parse(buf.toString())}catch(e){return}if(t===base+'g/'+g&&m&&m.t==='ok')finish(c)});
        var send=function(){if(!done)try{c.publish(base+'h',JSON.stringify({f:g,t:'hi'}),{qos:1})}catch(e){}};send();hiT.push(setInterval(send,1500))})});
      if(c)clients.push(c)})})})}
};
/* Aynı tarayıcıdaki sekmeler arası (test ve yerel oyun için) */
var Local={
  host:function(gid,code,onconn){var bc=new BroadcastChannel('yx-'+gid+'-'+code),links={};
    function mk(id){return{send:function(o){bc.postMessage({to:id,t:'d',d:clone(o)})},close:function(){bc.postMessage({to:id,t:'bye'})},onmessage:null,onclose:null}}
    bc.onmessage=function(e){var m=e.data;if(!m||m.to!=='h')return;var l=links[m.from];
      if(m.t==='hi'){if(l)return;l=links[m.from]=mk(m.from);bc.postMessage({to:m.from,t:'ok'});onconn(l);return}
      if(!l)return;if(m.t==='bye'){l.onclose&&l.onclose();delete links[m.from];return}if(m.t==='d')l.onmessage&&l.onmessage(m.d)};
    return Promise.resolve({close:function(){bc.close()}})},
  join:function(gid,code){return new Promise(function(res,rej){var bc=new BroadcastChannel('yx-'+gid+'-'+code),me=tok(),ok=false,l;
    var to=setTimeout(function(){bc.close();rej(new Error('timeout'))},2500);
    l={send:function(o){bc.postMessage({to:'h',from:me,t:'d',d:clone(o)})},close:function(){bc.postMessage({to:'h',from:me,t:'bye'});bc.close()},onmessage:null,onclose:null};
    bc.onmessage=function(e){var m=e.data;if(!m||m.to!==me)return;if(m.t==='ok'&&!ok){ok=true;clearTimeout(to);res(l)}else if(m.t==='d')l.onmessage&&l.onmessage(m.d);else if(m.t==='bye')l.onclose&&l.onclose()};
    bc.postMessage({to:'h',from:me,t:'hi'})})}
};
function net(){return window.YX_NET==='local'?Local:Online}

/* ---------- görünüm ---------- */
var CSS='body.yx-room #ych{display:none!important}'+
'#rm{max-width:560px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;padding:0 14px calc(84px + env(safe-area-inset-bottom));color:var(--ink,#f6f3ff);font-family:"Bricolage Grotesque",system-ui,sans-serif}'+
'#rm *{box-sizing:border-box}#rm button{font:inherit;cursor:pointer}'+
'.rh{display:flex;align-items:center;gap:10px;padding:10px 0;font-weight:800}.rh a{color:var(--mute,#a9a3cf);text-decoration:none;min-height:44px;display:flex;align-items:center}.rh b{flex:1;text-align:center;font-size:1.05rem}'+
'.rcode{font:800 .95rem ui-monospace,Menlo,monospace;letter-spacing:.14em;color:var(--yellow,#ffd23f);background:rgba(255,210,63,.12);border:1.5px solid rgba(255,210,63,.35);border-radius:999px;padding:4px 12px}'+
'.rbtn{background:var(--yellow,#ffd23f);color:var(--bg,#0b0820);font-weight:800;border:0;border-radius:999px;padding:12px 22px;min-height:48px;font-size:1rem}.rbtn.alt{background:rgba(255,255,255,.1);color:var(--ink,#f6f3ff);border:1.5px solid rgba(255,255,255,.18)}.rbtn[disabled]{opacity:.45;cursor:default}.rbtn:focus-visible,.rbtn:focus-visible{outline:3px solid #fff}'+
'.rcard{background:var(--card,#1a1440);border:1px solid var(--line,rgba(255,255,255,.1));border-radius:22px;padding:18px;display:grid;grid-template-columns:minmax(0,1fr);gap:12px}.rcard>*{min-width:0}'+
'.rme{display:flex;align-items:center;gap:14px}.rme .av{width:74px;height:74px;flex:none}.rme .av svg{width:100%;height:100%}.rme input{flex:1;width:100%;min-width:0;background:rgba(255,255,255,.07);border:1.5px solid var(--line,rgba(255,255,255,.12));border-radius:12px;color:inherit;font:inherit;font-weight:800;padding:10px 12px;min-height:46px}.rme small{display:block;color:var(--mute,#a9a3cf)}.rme a{color:var(--yellow,#ffd23f);font-weight:700;font-size:.88rem}'+
'.rrow{display:flex;gap:8px;flex-wrap:wrap}.rrow>*{flex:1 1 140px}'+
'.rjoin{display:flex;gap:8px}.rjoin input{flex:1;min-width:0;text-transform:uppercase;letter-spacing:.2em;text-align:center;font:800 1.2rem ui-monospace,Menlo,monospace;background:rgba(255,255,255,.07);border:1.5px solid var(--line,rgba(255,255,255,.12));border-radius:14px;color:inherit;min-height:50px}'+
'.rseg{display:flex;background:rgba(255,255,255,.07);border-radius:999px;padding:4px;gap:4px}.rseg button{flex:1;background:none;border:0;color:var(--mute,#a9a3cf);font-weight:800;border-radius:999px;min-height:38px}.rseg button[aria-pressed=true]{background:var(--yellow,#ffd23f);color:var(--bg,#0b0820)}'+
'.rmsg{color:var(--pink,#ff5c8a);font-weight:700;min-height:1.3em;text-align:center}'+
'.rbig{font:800 2.4rem ui-monospace,Menlo,monospace;letter-spacing:.2em;text-align:center;color:var(--yellow,#ffd23f)}'+
'.rseats{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px}'+
'.pl{position:relative;background:rgba(255,255,255,.05);border:2px solid transparent;border-radius:16px;padding:8px 6px;text-align:center;min-width:0}.pl .av{width:56px;height:56px;margin:0 auto}.pl .av svg{width:100%;height:100%}.pl b{display:block;font-size:.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pl small{color:var(--mute,#a9a3cf);font-size:.72rem}'+
'.pl.turn{border-color:var(--yellow,#ffd23f);box-shadow:0 0 16px rgba(255,210,63,.35)}.pl.me b{color:var(--yellow,#ffd23f)}.pl.open{opacity:.55;border:2px dashed var(--line,rgba(255,255,255,.2))}.pl.off{opacity:.45}'+
'.pl .emo{position:absolute;left:50%;top:-8px;transform:translate(-50%,0) scale(.4);font-size:1.7rem;opacity:0;pointer-events:none}.pl .emo.on{animation:remo 2s ease-out}@keyframes remo{0%{opacity:0;transform:translate(-50%,6px) scale(.4)}15%{opacity:1;transform:translate(-50%,-8px) scale(1.2)}80%{opacity:1;transform:translate(-50%,-14px) scale(1)}100%{opacity:0;transform:translate(-50%,-22px) scale(1)}}'+
'#pb .pl .av{width:42px;height:42px}#pb .pl{padding:6px 4px}#pb{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:8px;margin-bottom:8px}'+
'#gm{flex:1;min-height:0;position:relative}'+
'.pl .emo.qc{font-size:.78rem;font-weight:800;white-space:nowrap;background:rgba(20,16,43,.96);border:1px solid rgba(255,255,255,.28);color:#ffd23f;padding:4px 9px;border-radius:12px;z-index:5}.rqp{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:8px}.rqp[hidden]{display:none}.rqp button{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);border-radius:999px;color:#fff;font:700 .82rem system-ui,sans-serif;min-height:40px;padding:0 12px}'+
'.remo{display:flex;gap:6px;justify-content:center;margin-top:8px}.remo button{background:rgba(255,255,255,.08);border:0;border-radius:12px;font-size:1.3rem;min-width:44px;min-height:44px}'+
'.rover{background:var(--card,#1a1440);border:2px solid var(--yellow,#ffd23f);border-radius:18px;padding:12px 14px;display:flex;align-items:center;gap:10px;margin:8px 0;flex-wrap:wrap}.rover b{flex:1;font-size:1.05rem}'+
'#rtoast{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom));transform:translateX(-50%);background:#1f1a42;color:#fff;border:1.5px solid #ffd23f;border-radius:999px;padding:9px 18px;font-weight:800;z-index:100000;opacity:0;transition:opacity .25s;pointer-events:none}#rtoast.on{opacity:1}'+
'@media (prefers-reduced-motion:reduce){.pl .emo.on{animation:none;opacity:1}}';
function injectCss(){var s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s)}
var toastTo=0;function toast(m){var t=$('rtoast');if(!t){t=document.createElement('div');t.id='rtoast';document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(toastTo);toastTo=setTimeout(function(){t.classList.remove('on')},2400)}

/* ---------- profil ---------- */
var BOTCH=['blob','cat','robo','ghost','alien','dragon','elf','hana','mika','yuki','ren','sora','taro'],BOTNAMES=['Pıtık','Miyav','Robo','Hayalet','Uzaylı','Ejder','Elf','Hana','Mika','Yuki','Ren','Sora','Taro'];
function myProfile(){var y=window.YX,s=y&&y.S?y.S():null;if(!s)return{name:T('Oyuncu'),ch:{sp:'blob',col:'#ffd23f'}};
  var sp=y.cat.SP.filter(function(a){return a[0]===s.eq.sp})[0];return{name:s.name||T(sp?sp[1]:'Oyuncu'),ch:clone(s.eq)}}
function botProfile(i){var k=(i*5+Math.floor(Math.random()*8))%BOTCH.length,cols=window.YX?YX.cat.COL.map(function(c){return c[0]}):['#ffd23f'];
  return{name:T(BOTNAMES[k])+' (bot)',ch:{sp:BOTCH[k],col:cols[Math.floor(Math.random()*cols.length)],hat:'',face:'',neck:'',aura:''}}}
function avatar(ch,mood){try{return window.YX?YX.av(ch,mood||'n'):''}catch(e){return''}}

/* ---------- ana başlatıcı ---------- */
function start(cfg){
  var logic=cfg.logic,ui=cfg.ui,gid=cfg.id,N=logic.n;
  document.body.classList.add('yx-room');injectCss();
  var root=$('rm')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'rm'}));
  var me=myProfile(),level=2;try{level=+localStorage.getItem('yx-lvl-'+gid)||2}catch(e){}
  var R={phase:'menu',isHost:false,hot:false,seat:0,code:'',players:[],state:null,meta:null,link:null,server:null,ver:0,rewarded:false,lastView:null,stake:0,pot:0,stakeNow:0,rd:0};

  function setPhase(p){R.phase=p;draw()}
  function pub(){return R.players.map(function(p){return{k:p.k,name:p.name,ch:p.ch,here:p.k==='human'||p.k==='host'}})}
  function mySeat(){return R.hot&&R.meta&&R.meta.turn!=null?R.meta.turn:R.seat}

  /* ----- host tarafı ----- */
  function newPlayers(){R.players=[];for(var i=0;i<N;i++)R.players.push({k:'open',name:'',ch:null,link:null,tok:null});R.players[0]={k:'host',name:me.name,ch:me.ch,link:null,tok:tok()}}
  function hostRoom(mode){
    R.isHost=true;R.hot=mode==='hot';R.seat=0;newPlayers();
    if(mode==='bots'||mode==='hot'){if(mode==='hot'){R.players[1]={k:'host',name:T('Oyuncu')+' 2',ch:botProfile(2).ch,link:null,tok:'x'}}else fillBots();return beginGame()}
    return tryHost(0)}
  function tryHost(n){R.code=mkcode();return net().host(gid,R.code,onconn).then(function(sv){R.server=sv;setPhase('lobby')},function(e){
    if(n<4&&e&&e.type==='unavailable-id')return tryHost(n+1);
    R.isHost=false;setPhase('menu');showErr(e&&e.message==='mqtt'?T('Bağlantı servisi yüklenemedi. İnternetini kontrol et.'):T('Oda kurulamadı. Tekrar dene.'))})}
  function fillBots(){for(var i=0;i<N;i++)if(R.players[i].k==='open'){var b=botProfile(i);R.players[i]={k:'bot',name:b.name,ch:b.ch,link:null,tok:null}}}
  function onconn(link){
    link.onmessage=function(m){hostMsg(link,m)};
    link.onclose=function(){for(var i=0;i<N;i++)if(R.players[i].link===link){dropSeat(i)}}}
  function dropSeat(i){var p=R.players[i];p.link=null;if(R.phase==='play'){p.k='bot';p.was=true;p.name=p.name.replace(/ \(bot\)$/,'')+' (bot)';toast(T('Bir oyuncu ayrıldı, yerine bot geçti'));pushViews();schedBot()}else{R.players[i]={k:'open',name:'',ch:null,link:null,tok:null};pushLobby()}}
  function hostMsg(link,m){if(!m||typeof m!=='object')return;
    var seat=-1;for(var i=0;i<N;i++)if(R.players[i].link===link)seat=i;
    if(m.t==='hello'){if(seat>=0)return;
      var s2=-1;for(var j=1;j<N;j++){var p=R.players[j];if(p.was&&p.tok&&p.tok===m.tok){s2=j;break}}
      if(s2<0)for(var k=1;k<N;k++)if(R.players[k].k==='open'&&R.phase==='lobby'){s2=k;break}
      if(s2<0){link.send({t:'deny',r:R.phase==='play'?'started':'full'});return}
      R.players[s2]={k:'human',name:String(m.name||T('Oyuncu')).slice(0,14),ch:m.ch||{sp:'blob',col:'#ffd23f'},link:link,tok:m.tok||tok(),bal:+m.bal||0};
      link.send({t:'welcome',seat:s2,code:R.code,phase:R.phase});
      if(R.phase==='play'){pushViews();schedBot()}else pushLobby();return}
    if(seat<0)return;
    if(m.t==='act'){onAct(seat,m.a)}
    else if(m.t==='emo'){bcast({t:'emo',seat:seat,e:String(m.e).slice(0,4)});showEmo(seat,String(m.e).slice(0,4))}
    else if(m.t==='qc'){var qi=m.i|0,qn=Date.now();if(qi>=0&&qi<QC.length&&qn-(qcLast[seat]||0)>1200){qcLast[seat]=qn;bcast({t:'qc',seat:seat,i:qi});showQc(seat,qi)}}
    else if(m.t==='bal'){R.players[seat].bal=+m.b||0}
    else if(m.t==='bye'){dropSeat(seat)}}
  function bcast(o){R.players.forEach(function(p){if(p.link)p.link.send(o)})}
  function pushLobby(){bcast({t:'lobby',code:R.code,players:pub(),phase:'lobby',stake:R.stake});if(R.phase==='lobby')draw()}
  function coins(){try{return window.YX?YX.coins():0}catch(e){return 0}}
  function beginGame(){
    R.stakeNow=0;R.pot=0;
    if(R.isHost&&!R.hot&&R.stake>0&&R.code){var hum=R.players.filter(function(p){return p.k==='human'||p.k==='host'});
      if(hum.length>=2){var poor=null;hum.forEach(function(p){var b=p.k==='host'?coins():p.bal;if(b<R.stake&&!poor)poor=p});
        if(poor){toast(esc(poor.name)+': '+T('Yeterli jetonu yok'));return}
        R.stakeNow=R.stake;R.pot=R.stake*hum.length;try{window.YX&&YX.spend(R.stake)}catch(e){}}}
    R.rd++;R.state=logic.init(N,{level:level});R.rewarded=false;R.ver++;R.phase='play';
    for(var i=0;i<N;i++)if(R.players[i].k==='open'){var b=botProfile(i);R.players[i]={k:'bot',name:b.name,ch:b.ch,link:null,tok:null}}
    draw();pushViews();schedBot()}
  function pushViews(){var meta={turn:logic.turn(R.state),over:logic.over(R.state),stake:R.stakeNow,pot:R.pot,rd:R.rd};R.meta=meta;
    R.players.forEach(function(p,i){if(p.link)p.link.send({t:'v',seat:i,v:logic.view(R.state,i),meta:meta,players:pub()})});
    var vs=R.hot&&meta.turn!=null?meta.turn:0;onView(logic.view(R.state,vs),meta,pub())}
  function onAct(seat,a){if(!R.state)return;
    if(a&&a._rematch){if(seat===0&&R.meta&&R.meta.over)beginGame();return}
    var r=logic.apply(R.state,seat,a);if(r&&r.error){var p=R.players[seat];if(p.link)p.link.send({t:'err',e:r.error});else toast(T(r.error));return}
    R.ver++;pushViews();schedBot()}
  var botTo=0;
  function schedBot(){clearTimeout(botTo);if(!R.isHost||!R.state||(R.meta&&R.meta.over))return;var t=logic.turn(R.state);if(t==null||R.players[t].k!=='bot')return;var v=R.ver;
    botTo=setTimeout(function(){if(v!==R.ver||!R.state)return;var a;try{a=logic.bot(R.state,t,level)}catch(e){a=null}if(a)onAct(t,a)},600+Math.random()*700)}

  /* ----- misafir tarafı ----- */
  function joinRoom(code){code=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length<4){showErr(T('Oda kodunu yaz'));return}
    R.code=code;showMsg(T('Bağlanıyor…'));
    var myTok;try{myTok=sessionStorage.getItem('yx-tok-'+gid+code)||tok();sessionStorage.setItem('yx-tok-'+gid+code,myTok)}catch(e){myTok=tok()}
    net().join(gid,code).then(function(link){R.link=link;R.isHost=false;
      link.onclose=function(){if(R.phase!=='menu'){R.link=null;R.phase='menu';R.state=null;draw();showErr(T('Bağlantı koptu'))}};
      link.onmessage=guestMsg;link.send({t:'hello',name:me.name,ch:me.ch,tok:myTok,bal:coins()})},function(e){
      showErr(e&&e.message==='mqtt'?T('Bağlantı servisi yüklenemedi. İnternetini kontrol et.'):T('Oda bulunamadı. Kodu kontrol et.'))})}
  function guestMsg(m){if(!m||typeof m!=='object')return;
    if(m.t==='welcome'){R.seat=m.seat;R.code=m.code;R.phase=m.phase==='play'?'play':'lobby';draw()}
    else if(m.t==='lobby'){if(window.YX_APP&&m.stake>0){toast(T('Bu oda jeton ortaya koyuyor, uygulamada kullanılamaz'));setTimeout(leave,1200);return}R.players=m.players;R.phase='lobby';R.stake=m.stake||0;try{R.link&&R.link.send({t:'bal',b:coins()})}catch(e){}draw()}
    else if(m.t==='v'){R.seat=m.seat;R.players=m.players;if(R.phase!=='play'){R.phase='play';R.rewarded=false;draw()}onView(m.v,m.meta,m.players)}
    else if(m.t==='emo')showEmo(m.seat,m.e);
    else if(m.t==='qc'){var qj=m.i|0;if(qj>=0&&qj<QC.length)showQc(m.seat,qj)}
    else if(m.t==='err')toast(T(m.e));
    else if(m.t==='deny'){var l=R.link;R.link=null;if(l)l.close();showErr(m.r==='full'?T('Oda dolu'):T('Oyun çoktan başladı'))}}

  /* ----- oyun arayüzü köprüsü ----- */
  var uiMounted=false;
  function ctx(){return{n:N,get seat(){return mySeat()},get players(){return R.players},get level(){return level},hot:R.hot,t:T,avatar:avatar,
    send:function(a){if(R.isHost)onAct(mySeat(),a);else if(R.link)R.link.send({t:'act',a:a})},
    sfx:function(n){try{window.YS&&YS.play(n)}catch(e){}}}}
  function paySt(meta){if(R.isHost||!meta||!(meta.stake>0))return;var k='yx-paid-'+gid+R.code,p=null;try{p=sessionStorage.getItem(k)}catch(e){}
    if(String(p)===String(meta.rd))return;try{sessionStorage.setItem(k,meta.rd)}catch(e){}try{window.YX&&YX.spend(meta.stake)}catch(e){}}
  function onView(v,meta,players){paySt(meta);R.lastView=v;R.meta=meta;if(players&&!R.isHost)R.players=players;
    if(R.phase!=='play')return;
    if(!uiMounted){drawGame()}
    try{ui.view(v,meta)}catch(e){if(window.console)console.error(e)}
    updateBar();
    if(meta&&meta.over&&!R.rewarded){R.rewarded=true;rewardMe(meta.over)}}
  function rewardMe(o){var win=o.winner===mySeat()||(o.winners&&o.winners.indexOf(mySeat())>=0);var hasHuman=R.players.some(function(p,i){return i!==mySeat()&&(p.k==='human'||p.k==='host'&&R.hot)});
    var n=win?(hasHuman?14:8):4;try{if(window.YX&&!R.hot){var a=YX.earn(n,'room',1);if(a)toast('+'+a+' 🪙 · '+T(win?'Kazandın! 🎉':'Güzel maç!'))}}catch(e){}
    var mt=R.meta||{};if(mt.stake>0&&!R.hot){var draw=(o.winner==null||o.winner<0)&&!(o.winners&&o.winners.length);
      try{if(win){var g=YX.earn(mt.pot,'pot',1);toast('+'+g+' 🪙 · '+T('Kazanılan pot'))}else if(draw){YX.earn(mt.stake,'refund',1);toast('+'+mt.stake+' 🪙 · '+T('Jeton iade'))}else toast('-'+mt.stake+' 🪙')}catch(e){}
      if(!R.isHost&&R.link)setTimeout(function(){try{R.link.send({t:'bal',b:coins()})}catch(e){}},300)}
    try{window.YS&&YS.play(win?'win':'over')}catch(e){}}
  var QC=["İyi oyun! 👋", "Güzel hamle!", "Hadi biraz hızlı! ⏳", "Bir saniye, düşünüyorum 🤔", "Şanssızlık! 😅", "Tebrikler! 🎉", "Bir tur daha?", "Teşekkürler 🙏", "Çok yakındı!", "Harika oyundu!", "Biraz sabır 🙂", "Hazırım ✅"],qcLast={};
  function showQc(seat,i){var el=document.querySelector('#pb .pl[data-s="'+seat+'"] .emo');if(!el)return;el.textContent=T(QC[i]);el.classList.add('qc');el.classList.remove('on');void el.offsetWidth;el.classList.add('on')}
  function showEmo(seat,e){var el=document.querySelector('#pb .pl[data-s="'+seat+'"] .emo');if(!el)return;el.textContent=e;el.classList.remove('on','qc');void el.offsetWidth;el.classList.add('on')}

  /* ----- çizim ----- */
  function showErr(m){var e=$('rerr');if(e)e.textContent=m;else toast(m)}
  function showMsg(m){var e=$('rerr');if(e){e.textContent=m;e.style.color='var(--mute,#a9a3cf)'}}
  function head(extra){return'<div class="rh"><a href="../">← Yaxest</a><b>'+esc(T(cfg.title))+'</b>'+(extra||'')+'</div>'}
  function seatsHtml(list,showTurn){return list.map(function(p,i){var cls='pl'+(p.k==='open'?' open':'')+(i===R.seat&&!R.hot?' me':'')+(showTurn&&R.meta&&R.meta.turn===i?' turn':'');
    return'<div class="'+cls+'" data-s="'+i+'"><span class="emo"></span><div class="av">'+(p.k==='open'?'<div style="font-size:2rem;line-height:56px">＋</div>':avatar(p.ch||{sp:'blob',col:'#ffd23f'},'n'))+'</div><b>'+esc(p.k==='open'?T('Boş'):p.name)+'</b><small>'+(p.k==='host'?T('Oda sahibi'):p.k==='bot'?T('Bot'):p.k==='human'?T('Oyuncu'):'')+'</small></div>'}).join('')}
  var barSig='';
  function updateBar(){var bar=$('pb');if(!bar)return;var list=pubList(),sig=JSON.stringify(list.map(function(p){return[p.k,p.name]}));
    if(sig!==barSig||!bar.firstChild){barSig=sig;bar.innerHTML=seatsHtml(list,false)}
    bar.querySelectorAll('.pl').forEach(function(el,i){el.classList.toggle('turn',!!(R.meta&&R.meta.turn===i&&!R.meta.over));el.classList.toggle('me',i===R.seat&&!R.hot)});
    var ov=$('rov'),o=R.meta&&R.meta.over;
    if(!ov)return;if(o){var w=o.winner!=null&&o.winner>=0?R.players[o.winner]:null;
      ov.hidden=false;ov.innerHTML='<b>'+esc(T(o.t||'Oyun bitti'))+(w?' · '+esc(T('Kazanan'))+': '+esc(w.name):'')+'</b>'+(R.isHost?'<button class="rbtn" id="rre">'+esc(T('Yeniden oyna'))+'</button>':'<small style="color:var(--mute,#a9a3cf)">'+esc(T('Oda sahibi yeniden başlatabilir'))+'</small>')+'<button class="rbtn alt" id="rlv">'+esc(T('Odadan çık'))+'</button>';
      var re=$('rre');if(re)re.onclick=function(){onAct(0,{_rematch:1})};$('rlv').onclick=leave}else{ov.hidden=true}}
  function pubList(){return R.isHost?pub():R.players}
  function leave(){clearTimeout(botTo);try{if(R.link){R.link.send({t:'bye'});R.link.close()}}catch(e){}try{R.players.forEach(function(p){if(p.link){p.link.close()}})}catch(e){}try{R.server&&R.server.close()}catch(e){}
    try{ui.unmount&&ui.unmount()}catch(e){}uiMounted=false;R.phase='menu';R.isHost=false;R.hot=false;R.state=null;R.meta=null;R.link=null;R.server=null;R.players=[];R.code='';
    try{history.replaceState(null,'',location.pathname)}catch(e){}draw()}
  function shareUrl(){return location.origin+location.pathname+'?oda='+R.code}
  function draw(){
    if(R.phase==='menu'){uiMounted=false;
      root.innerHTML=head()+'<div class="rcard"><div class="rme"><div class="av" id="rav"></div><div style="flex:1;min-width:0"><input id="rname" maxlength="14" aria-label="'+esc(T('Oyuncu adın'))+'" value="'+esc(me.name)+'"><small><a href="../magaza/">'+esc(T('Karakterini değiştir'))+'</a></small></div></div></div>'+
      '<div class="rcard" style="margin-top:12px"><button class="rbtn" id="rmk">'+esc(T('Oda kur, arkadaşını çağır'))+'</button>'+
      '<div class="rjoin"><input id="rcode" maxlength="5" placeholder="KOD" aria-label="'+esc(T('Oda kodu'))+'" autocomplete="off"><button class="rbtn alt" id="rjn">'+esc(T('Odaya katıl'))+'</button></div><div class="rmsg" id="rerr"></div>'+
      '<div class="rseg" role="group" aria-label="'+esc(T('Bot zorluğu'))+'"><button data-l="1">'+esc(T('Kolay'))+'</button><button data-l="2">'+esc(T('Orta'))+'</button><button data-l="3">'+esc(T('Zor'))+'</button></div>'+
      '<div class="rrow"><button class="rbtn alt" id="rbt">'+esc(T('Botla oyna'))+'</button>'+(logic.hot?'<button class="rbtn alt" id="rht">'+esc(T('Aynı cihazda iki kişi'))+'</button>':'')+'</div></div>'+
      (cfg.intro?'<p style="color:var(--mute,#a9a3cf);margin-top:14px;font-size:.92rem">'+cfg.intro+'</p>':'');
      $('rav').innerHTML=avatar(me.ch,'h');$('rname').oninput=function(){me.name=this.value.slice(0,14)||T('Oyuncu')};
      $('rmk').onclick=function(){hostRoom('online')};$('rjn').onclick=function(){joinRoom($('rcode').value)};
      $('rcode').onkeydown=function(e){if(e.key==='Enter')joinRoom(this.value)};$('rbt').onclick=function(){hostRoom('bots')};var rh=$('rht');if(rh)rh.onclick=function(){hostRoom('hot')};
      var segs=root.querySelectorAll('.rseg button');segs.forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.l===level);b.onclick=function(){level=+b.dataset.l;try{localStorage.setItem('yx-lvl-'+gid,level)}catch(e){}segs.forEach(function(x){x.setAttribute('aria-pressed',+x.dataset.l===level)})}})}
    else if(R.phase==='lobby'){uiMounted=false;var list=pubList();
      root.innerHTML=head('<span class="rcode">'+R.code+'</span>')+'<div class="rcard"><div style="text-align:center;color:var(--mute,#a9a3cf)">'+esc(T('Oda kodu'))+'</div><div class="rbig">'+R.code+'</div>'+
      (R.isHost?'<div class="rrow"><button class="rbtn" id="rsh">'+esc(T('Daveti paylaş'))+'</button><button class="rbtn alt" id="rcp">'+esc(T('Bağlantıyı kopyala'))+'</button></div>':'')+
      '<div class="rseats" id="rst">'+seatsHtml(list,false)+'</div>'+stakeHtml()+
      (R.isHost?'<button class="rbtn" id="rgo">'+esc(T('Başlat'))+'</button><small style="color:var(--mute,#a9a3cf);text-align:center">'+esc(T('Boş yerleri bot doldurur'))+'</small>':'<div class="rmsg" style="color:var(--mute,#a9a3cf)">'+esc(T('Oda sahibinin başlatması bekleniyor…'))+'</div>')+
      '<button class="rbtn alt" id="rlv2">'+esc(T('Odadan çık'))+'</button></div>';
      var go=$('rgo');if(go)go.onclick=beginGame;root.querySelectorAll('.rstk button').forEach(function(b){b.onclick=function(){R.stake=+b.dataset.s;pushLobby()}});$('rlv2').onclick=leave;
      var sh=$('rsh');if(sh)sh.onclick=function(){var u=shareUrl(),tx=T('Yaxest ile oyun oynayalım! Oda kodu')+': '+R.code;if(navigator.share)navigator.share({title:'Yaxest Games',text:tx,url:u}).catch(function(){});else copy(u)};
      var cp=$('rcp');if(cp)cp.onclick=function(){copy(shareUrl())}}
    else if(R.phase==='play'){drawGame()}}
  function stakeHtml(){var o=[0,10,25,50,100];if(!R.code||window.YX_APP)return'';
    if(!R.isHost)return'<div class="rmsg" style="color:var(--yellow,#ffd23f);font-weight:800">'+esc(T('Ortaya jeton'))+': '+(R.stake?'🪙 '+R.stake:esc(T('Jetonsuz')))+'</div>';
    return'<div style="text-align:center;color:var(--mute,#a9a3cf);font-size:.85rem">'+esc(T('Ortaya jeton'))+' ('+esc(T('kazanan tüm potu alır'))+')</div><div class="rseg rstk" role="group">'+o.map(function(v){return'<button data-s="'+v+'" aria-pressed="'+(R.stake===v)+'">'+(v?'🪙 '+v:esc(T('Jetonsuz')))+'</button>'}).join('')+'</div>'}
  function copy(t){try{navigator.clipboard.writeText(t).then(function(){toast(T('Bağlantı kopyalandı'))},function(){toast(t)})}catch(e){toast(t)}}
  function drawGame(){
    root.innerHTML=head(R.code?'<span class="rcode">'+R.code+'</span>':'')+'<div id="pb"></div><div id="rov" class="rover" hidden></div><div id="gm"></div><div class="remo" id="remo"></div>';
    var em=['👍','😂','😮','😢','🔥','🙌'];$('remo').innerHTML=em.map(function(e){return'<button type="button" aria-label="'+e+'">'+e+'</button>'}).join('')+'<button type="button" id="rqb" aria-label="'+esc(T('Hızlı sohbet'))+'">💬</button>';
    var qp=document.createElement('div');qp.id='rqp';qp.hidden=true;qp.className='rqp';qp.innerHTML=QC.map(function(q,i){return'<button type="button" data-q="'+i+'">'+esc(T(q))+'</button>'}).join('');$('remo').parentNode.insertBefore(qp,$('remo').nextSibling);
    if(R.hot)$('remo').hidden=true;
    $('rqb').onclick=function(){qp.hidden=!qp.hidden};qp.querySelectorAll('button').forEach(function(b){b.onclick=function(){var i=+b.dataset.q;qp.hidden=true;if(R.isHost){bcast({t:'qc',seat:R.seat,i:i});showQc(R.seat,i)}else if(R.link)R.link.send({t:'qc',i:i})}});
    root.querySelectorAll('#remo button:not(#rqb)').forEach(function(b){b.onclick=function(){var e=b.textContent;if(R.isHost){bcast({t:'emo',seat:R.seat,e:e});showEmo(R.seat,e)}else if(R.link)R.link.send({t:'emo',e:e})}});
    barSig='';$('pb').style.gridTemplateColumns='repeat('+Math.min(N,4)+',1fr)';
    ui.mount($('gm'),ctx());uiMounted=true;updateBar();if(R.lastView)try{ui.view(R.lastView,R.meta)}catch(e){}}
  addEventListener('ylang',function(){if(R.phase==='menu'||R.phase==='lobby')draw()});

  draw();
  var q=null;try{q=new URLSearchParams(location.search).get('oda')}catch(e){}
  if(q){var inp=$('rcode');if(inp)inp.value=q.toUpperCase();joinRoom(q)}
  return R}
window.YXRoom={start:start,_T:T};
})();
