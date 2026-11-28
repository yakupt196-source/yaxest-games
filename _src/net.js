/* ===================== YÜZ MÜHÜR: çevrimiçi (MQTT) ===================== */
var NET=(function(){
 var BROKERS=['wss://broker.emqx.io:8084/mqtt','wss://broker.hivemq.com:8884/mqtt','wss://test.mosquitto.org:8081'],BASE='yaxest7/muhur2/';
 var cli=null,up=false,bi=0,others={},lastPub=0,lastFull=0,lastPty=0,party='',pmem={},clan='',lastLoc='',lastChat=0,blocked={},offers={},mytx={},txn=0,status='kapalı',tries=0,sub={};
 function clean(s,n){return String(s==null?'':s).replace(/[\u0000-\u001f<>]/g,'').slice(0,n||40)}
 function num(v,a,b){v=+v;if(!isFinite(v))return a;return Math.max(a,Math.min(b,v))}
 var BAD=/\b(am[ıi]na|orospu|siktir|yarra[kg]|pi[cç]|g[öo]t[üu]n|ibne|anan[ıi]|amk|aq)\b/gi;
 function filt(s){return s.replace(BAD,'***')}
 function loadMqtt(){return new Promise(function(res,rej){if(window.mqtt)return res(window.mqtt);var urls=['/lib/mqtt.min.js','https://unpkg.com/mqtt@5.10.1/dist/mqtt.min.js','https://cdn.jsdelivr.net/npm/mqtt@5.10.1/dist/mqtt.min.js'],i=0;
  (function next(){if(i>=urls.length)return rej(new Error('mqtt'));var s=document.createElement('script');s.src=urls[i++];s.onload=function(){window.mqtt?res(window.mqtt):next()};s.onerror=next;document.head.appendChild(s)})()})}
 function locKey(){return WORLD==='town'?'sehir':'k'+FL.n}
 function lt(){return BASE+'l/'+locKey()+'/'+(S.ch||1)+'/'}
 function pub(t,o,qos){if(!up||!cli)return;try{cli.publish(t,JSON.stringify(o),{qos:qos||0})}catch(e){}}
 function subscribe(t){if(!up||!cli||sub[t])return;sub[t]=1;try{cli.subscribe(t,{qos:0})}catch(e){}}
 function unsub(t){if(!sub[t])return;delete sub[t];try{cli&&cli.unsubscribe(t)}catch(e){}}
 function connect(){if(cli||!S.net)return;status='bağlanıyor…';loadMqtt().then(function(M){try{cli=M.connect(BROKERS[bi%BROKERS.length],{clientId:'ym_'+MYID+Math.random().toString(36).slice(2,6),clean:true,connectTimeout:7000,reconnectPeriod:4000,keepalive:30,resubscribe:false})}catch(e){status='hata';return}
   cli.on('error',function(){});cli.on('connect',function(){up=true;status='çevrimiçi';sub={};tries=0;resub();say('sys','🌐 Çevrimiçi: kule hanına bağlandın.')});
   cli.on('close',function(){up=false;status='koptu'});cli.on('offline',function(){up=false;status='bağlanıyor…';tries++;if(tries>3){tries=0;bi++;try{cli.end(true)}catch(e){}cli=null;setTimeout(connect,1500)}});
   cli.on('message',onMsg)}).catch(function(){status='kütüphane yüklenemedi'})}
 function resub(){lastLoc='';sub={};subscribe(BASE+'w');subscribe(BASE+'u/'+MYID);setLoc();if(party)joinParty(party,1);if(clan)joinClan(clan,1)}
 function setLoc(){if(!up)return;var nl=lt();if(lastLoc&&lastLoc!==nl)unsub(lastLoc+'#');others={};if(nl!==lastLoc){lastLoc=nl;subscribe(nl+'#')}lastFull=0}
 function ap(){return S.lookMode==='diyar'&&S.dap?S.dap:null}
 function myState(full){var o={i:MYID,n:S.nick,x:+pl.x.toFixed(1),z:+pl.z.toFixed(1),y:+pl.yaw.toFixed(2),l:S.lv,t:S.tier,a:S.arm,k:S.look,c:S.clan,h:Math.round(pl.hp/pl.mhp*100),m:pl.mv>.1?1:0,at:pl.atk>0?1:0,o:S.oath?1:0,d:pl.dead>0?1:0};if(full){var a=ap();if(a)o.ap=a}return o}
 function onMsg(topic,buf){var m;try{m=JSON.parse(buf.toString())}catch(e){return}if(!m||typeof m!=='object')return;
  if(topic===BASE+'u/'+MYID)return onPersonal(m);
  if(topic===BASE+'w'){if(m.t==='c')chatIn(m,'d');return}
  if(topic.indexOf(BASE+'pt/')===0){var tail=topic.slice(topic.lastIndexOf('/')+1);if(tail==='s')return pstate(m);if(tail==='c'){chatIn(m,'p');return}if(tail==='d')return pdmg(m);return}
  if(topic.indexOf(BASE+'cl/')===0){if(m.t==='c')chatIn(m,'l');return}
  var tl=topic.slice(topic.lastIndexOf('/')+1);if(tl==='s'){if(m.i===MYID)return;var id=clean(m.i,16);if(!id)return;var o=others[id]||(others[id]={x:num(m.x,-90,90),z:num(m.z,-90,90),px:0,pz:0,ph:0,mv:0,yaw:0});
   o.id=id;o.n=clean(m.n,16)||'Gezgin';o.tx=num(m.x,-90,90);o.tz=num(m.z,-90,90);o.ty=num(m.y,-7,7);o.lv=num(m.l,1,999)|0;o.tier=num(m.t,0,20)|0;o.arm=num(m.a,0,10)|0;o.k=num(m.k,0,9)|0;o.c=clean(m.c,5);o.h=num(m.h,0,100);o.mvv=m.m?1:0;o.at=m.at?1:0;o.oath=m.o?1:0;o.dead=m.d?1:0;o.seen=T;if(m.ap&&typeof m.ap==='object')o.ap=m.ap}
  else if(tl==='c'){chatIn(m,'s')}}
 function chatIn(m,k){var id=clean(m.i,16);if(id===MYID||blocked[id])return;var tx=filt(clean(m.m,90));if(!tx)return;var n=clean(m.n,16)||'?',cg=clean(m.c,5);
  var lab={s:'',d:'[Dünya] ',p:'[Parti] ',l:'[Lonca] '}[k];say(k==='p'?'pt':k==='l'?'cl':'',lab+(cg?'['+cg+'] ':'')+n+': '+tx)}
 function say(k,t){window.say&&window.say(t,k)}
 function chat(txt,ch){txt=clean(txt,90).trim();if(!txt)return;var now=Date.now();if(now-lastChat<1100){toast('Çok hızlı yazıyorsun','#ff9a9a');return}lastChat=now;
  var o={t:'c',i:MYID,n:S.nick,c:S.clan,m:txt};
  if(ch==='p'){if(!party){toast('Partin yok','#ff9a9a');return}pub(BASE+'pt/'+party+'/c',o);say('pt','[Parti] '+S.nick+': '+filt(txt));return}
  if(ch==='l'){if(!clan){toast('Loncan yok','#ff9a9a');return}pub(BASE+'cl/'+clan+'/c',o);say('cl','[Lonca] '+S.nick+': '+filt(txt));return}
  if(ch==='d'){pub(BASE+'w',o);say('','[Dünya] '+S.nick+': '+filt(txt));return}
  pub(lt()+'c',o);say('',(S.clan?'['+S.clan+'] ':'')+S.nick+': '+filt(txt))}
 /* parti */
 function pcode(){var c='ABCDEFGHJKMNPQRSTUVWXYZ23456789',s='';for(var i=0;i<5;i++)s+=c[Math.floor(Math.random()*c.length)];return s}
 function joinParty(code,quiet){code=String(code).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,5);if(code.length<5)return false;if(party&&party!==code)leaveParty(true);party=code;pmem={};subscribe(BASE+'pt/'+code+'/#');if(!quiet)say('sys','🛡 Partiye katıldın: '+code);pubParty();return true}
 function leaveParty(q){if(!party)return;unsub(BASE+'pt/'+party+'/#');party='';pmem={};if(!q)say('sys','Partiden ayrıldın.')}
 function pubParty(){if(!party)return;pub(BASE+'pt/'+party+'/s',{i:MYID,n:S.nick,l:S.lv,h:pl.hp/pl.mhp,f:WORLD==='floor'?FL.n:0,t:T|0})}
 function pstate(m){var id=clean(m.i,16);if(!id||id===MYID)return;var wasNew=!pmem[id];pmem[id]={n:clean(m.n,16),l:num(m.l,1,999)|0,h:num(m.h,0,1),f:num(m.f,0,9999)|0,seen:T};if(wasNew)say('sys','🛡 '+pmem[id].n+' partiye katıldı.')}
 function pdmg(m){if(m.i===MYID||WORLD!=='floor')return;if((m.f|0)!==FL.n)return;var k=m.k|0,mm=mobs[k];if(!mm||mm.id!==m.m||mm.dead>0)return;var d=num(m.d,1,1e7)|0;dmgMob(mm,d,false,false)}
 function mobHit(idx,dm){if(!party||!up)return;var mm=mobs[idx];if(!mm)return;pub(BASE+'pt/'+party+'/d',{i:MYID,f:FL.n,k:idx,m:mm.id,d:dm})}
 function partyN(){if(!party)return 1;var n=1;for(var k in pmem){if(T-pmem[k].seen<8&&pmem[k].f===(WORLD==='floor'?FL.n:0))n++}return n}
 window.__partyN=partyN;
 function invite(id){if(!party)joinParty(pcode());pub(BASE+'u/'+id,{t:'inv',c:party,n:S.nick,i:MYID});toast('Davet gönderildi','#7affc0')}
 /* lonca */
 function joinClan(tag,quiet){tag=clean(tag,5).toUpperCase().replace(/[^A-Z0-9ĞÜŞİÖÇ]/g,'');if(tag.length<3)return false;if(clan&&clan!==tag)unsub(BASE+'cl/'+clan+'/#');clan=tag;S.clan=tag;subscribe(BASE+'cl/'+tag+'/#');if(!quiet)say('sys','🏰 Lonca: ['+tag+']');save();return true}
 function leaveClan(){if(clan)unsub(BASE+'cl/'+clan+'/#');clan='';S.clan='';save()}
 /* takas */
 function sendOffer(id,it,q,p){var tx=MYID.slice(0,4)+(++txn);mytx[tx]={it:it,q:q,p:p,to:id,t:T};pub(BASE+'u/'+id,{t:'tr',x:tx,it:it,q:q,p:p,n:S.nick,i:MYID});toast('Takas teklifi gönderildi','#7affc0')}
 function acceptOffer(tx){var o=offers[tx];if(!o)return;if(S.gold<o.p){toast('Yetersiz altın','#ff9a9a');return}S.gold-=o.p;o.esc=1;o.ts=T;pub(BASE+'u/'+o.from,{t:'tra',x:tx,i:MYID});toast('Teklif kabul edildi, onay bekleniyor…','#ffd98a')}
 function onPersonal(m){var from=clean(m.i,16);if(blocked[from])return;
  if(m.t==='inv'){var code=clean(m.c,5);if(code.length!==5)return;offers['inv'+from]={kind:'inv',code:code,n:clean(m.n,16),from:from,ts:T};toast('🛡 '+clean(m.n,16)+' seni partiye çağırıyor (☰ Lonca/Parti)','#7affc0');if(window.refreshPanel)refreshPanel()}
  else if(m.t==='tr'){var it=m.it==='pot'?'pot':m.it==='loot'?'loot':'';var q=num(m.q,1,99)|0,p=num(m.p,0,1e7)|0;if(!it)return;offers[clean(m.x,12)]={kind:'tr',x:clean(m.x,12),it:it,q:q,p:p,n:clean(m.n,16),from:from,ts:T};toast('🤝 '+clean(m.n,16)+' sana takas teklif etti','#ffd98a');if(window.refreshPanel)refreshPanel()}
  else if(m.t==='tra'){var tx=clean(m.x,12),o=mytx[tx];if(!o||o.to!==from)return;var have=o.it==='pot'?S.pot:S.loot;if(have>=o.q){if(o.it==='pot')S.pot-=o.q;else{var per=S.loot?S.lootV/S.loot:0;S.loot-=o.q;S.lootV=Math.max(0,Math.round(S.lootV-per*o.q))}S.gold+=o.p;pub(BASE+'u/'+from,{t:'trd',x:tx,ok:1,it:o.it,q:o.q,i:MYID});toast('✔ Takas tamam: +'+o.p+' 🪙','#7affc0')}else pub(BASE+'u/'+from,{t:'trd',x:tx,ok:0,i:MYID});delete mytx[tx];save()}
  else if(m.t==='trd'){var tx=clean(m.x,12),o=offers[tx];if(!o||!o.esc||o.from!==from)return;if(m.ok){if(o.it==='pot')S.pot=Math.min(potMax()+20,S.pot+o.q);else{S.loot+=o.q;S.lootV+=Math.round(o.q*(3+RLf(Math.max(1,S.maxF))*1.5))}toast('✔ Takas tamam: alındı','#7affc0')}else{S.gold+=o.p;toast('Takas olmadı, altının iade edildi','#ffd98a')}delete offers[tx];save()}}
 function near(){var a=[];for(var k in others){var o=others[k];if(o.seen&&T-o.seen<6)a.push(o)}a.sort(function(p,q){return Math.hypot(p.x-pl.x,p.z-pl.z)-Math.hypot(q.x-pl.x,q.z-pl.z)});return a}
 function tick(dt){if(!up)return;var now=T;
  if(now-lastPub>(WORLD==='town'?.45:.33)){lastPub=now;var full=now-lastFull>8;if(full)lastFull=now;pub(lt()+'s',myState(full))}
  if(party&&now-lastPty>2){lastPty=now;pubParty()}
  for(var k in others){var o=others[k];if(T-o.seen>6){delete others[k];continue}var dx=o.tx-o.x,dz=o.tz-o.z,d=Math.hypot(dx,dz);if(d>25){o.x=o.tx;o.z=o.tz}else{var s=Math.min(1,dt*7);o.x+=dx*s;o.z+=dz*s}
   var da=Math.atan2(Math.sin(o.ty-o.yaw),Math.cos(o.ty-o.yaw));o.yaw+=da*Math.min(1,dt*10);o.mv+=((o.mvv||(d>.3?1:0))-o.mv)*Math.min(1,dt*8);o.ph+=dt*8*o.mv;o.atk=o.at?(o.atk>=1||!o.atk?.001:o.atk+dt*3):0;}
  for(var k in pmem)if(T-pmem[k].seen>10)delete pmem[k];
  for(var k in offers){if(T-offers[k].ts>(offers[k].esc?20:90)){var o=offers[k];if(o.esc){S.gold+=o.p;toast('Takas zaman aşımı: altın iade','#ffd98a')}delete offers[k]}}
  for(var k in mytx)if(T-mytx[k].t>60)delete mytx[k]}
 function start(){S.net=1;connect()}
 function stop(){S.net=0;try{cli&&cli.end(true)}catch(e){}cli=null;up=false;others={};sub={};status='kapalı'}
 return{start:start,stop:stop,tick:tick,setLoc:setLoc,chat:chat,say:function(k,t){if(up)pub(lt()+'c',{t:'c',i:MYID,n:'Kule',m:t})},near:near,others:function(){return others},status:function(){return status+(up?' · '+(Object.keys(others).length+1)+' oyuncu':'')},up:function(){return up},
  party:function(){return party},members:function(){return pmem},create:function(){joinParty(pcode())},join:joinParty,leave:leaveParty,invite:invite,mobHit:mobHit,clan:function(){return clan},joinClan:joinClan,leaveClan:leaveClan,offers:function(){return offers},sendOffer:sendOffer,acceptOffer:acceptOffer,
  declineOffer:function(k){delete offers[k]},block:function(id){blocked[id]=1},mute:function(){return 0}}})();
window.NET=NET;
