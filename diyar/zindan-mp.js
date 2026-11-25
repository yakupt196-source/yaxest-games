/* Yaxest Diyarı · Ortak Zindan (YDG)
   Zindana giren parti üyesi "lider" (host) olur: canavarlar, aşamalar, kapı ve boss onun istemcisinde döner.
   Diğer parti üyeleri davetle katılır, lideri görür, aynı canavarlara vurur; vuruşlar lidere, canavar hasarı üyelere aktarılır.
   Sunucu yalnızca aynı partideki oyunculara 'dgr' mesajını iletir. */
(function(){
var rp={},hq={},ro={},inv=null,snT=0,poT=0,hits=[],drSent=0,uidN=1,last=null,curS=null;
function D(){return window.__yd}
function me(){return window.YNet&&YNet.myId?YNet.myId():null}
function on(){return !!(window.YNet&&YNet.myId&&YNet.myId())}
function send(k,d,to){if(!on())return;try{YNet.send({t:'dgr',k:k,d:d,to:to||undefined})}catch(e){}}
function mates(){try{var S0=window.YSoc&&YSoc.dbg.S(),mem=S0&&S0.pt&&S0.pt.mem||[];return mem.filter(function(m){return m&&m.id!==me()})}catch(e){return[]}}
function myAp(){var P=D().P;return P.ap||null}
function uid(m){if(!m._u)m._u=uidN++;return m._u}
function G(){return D().G}

/* ---------- lider ---------- */
function hostStart(){var g=G();if(!g||!g.dg||g.dg.cl)return;rp={};hq={};ro={};var ms=mates();if(!ms.length||!on())return;
  var d=D().Y.DUNGEONS[g.dg.id];send('inv',{id:g.dg.id,n:d.n,lv:g.dg.lv});inv={t:0}}
function tgt(m){var g=G();if(!g||!g.dg||g.dg.cl)return null;var best=null,bd=(g.dead>0||g.evade>0)?1e9:Math.hypot(g.px-m.x,g.py-m.y);
  for(var id in rp){var r=rp[id];if(r.dead)continue;var dd=Math.hypot(r.x-m.x,r.y-m.y);if(dd<bd){bd=dd;best=r}}return best}
function hurtR(id,d,lv){(hq[id]=hq[id]||[]).push([Math.round(d),lv]);if(hq[id].length>12)hq[id].shift()}
function snap(){var g=G(),dg=g.dg,P=D().P;
  var ms=dg.mons.map(function(m){return[uid(m),m.type,Math.round(m.x),Math.round(m.y),Math.max(0,Math.round(m.hp)),Math.round(m.max),m.lv,m.boss?1:0,m.dead?1:0,m.elite?1:0]});
  var pl=[[me(),Math.round(g.px),Math.round(g.py),+(Math.atan2(g.fy||0,g.fx||0)).toFixed(2),g.mv?1:0,g.dead>0?1:0,+(g.hp/D().S().maxhp).toFixed(2)]];
  for(var id in rp){var r=rp[id];pl.push([id,Math.round(r.x),Math.round(r.y),r.fa||0,r.mv?1:0,r.dead?1:0,r.hp||1])}
  var o={s:dg.stage,w:dg.wv||1,wn:dg.wvn||1,m:ms,pl:pl,dr:dg.door?(dg.door.open?1:0):-1,ch:dg.chest?(dg.chest.open?1:0):-1,sv:dg.surv?Math.ceil(dg.surv.left):-1,dn:dg.done?1:0,tr:dg.trans?1:0,h:hq,pn:dg.pn};hq={};return o}
function revive(){var g=G(),y=D();if(!(g.dead>0))return;g.dead=0;g.hp=Math.round(y.S().maxhp*.5);var e=document.getElementById('p-dead');if(e)e.classList.remove('on');y.floatTxt(g.px,g.py-60,'Ekip seni diriltti!','#7be07b');y.say('🤝 Ekip odayı geçti, dirildin!','sys')}
function deadNote(){var e=document.getElementById('dmsg');if(e&&!/Ekip/.test(e.innerHTML))e.innerHTML+='<br><small style="color:#7be07b">🤝 Ekip sonraki odaya geçince dirileceksin. Bekleyebilirsin.</small>'}
function alive(){var g=G(),dg=g&&g.dg;if(!dg)return false;var sh=!!dg.cl||Object.keys(rp).length>0;if(!sh)return false;if(g.dead>0)deadNote();if(dg.cl)return true;for(var id in rp)if(!rp[id].dead)return true;return false}
var hStage=null;function hTick(dt){var g=G(),dg=g.dg;if(!dg||dg.cl||!on())return;if(hStage!==dg.stage){if(hStage!==null&&Object.keys(rp).length)revive();hStage=dg.stage}if(inv){inv.t+=dt;if(inv.t>12&&!dg.done&&curS!==dg.stage){curS=dg.stage;inv.t=0;if(mates().some(function(m){return!rp[m.id]}))send('inv',{id:dg.id,n:D().Y.DUNGEONS[dg.id].n,lv:dg.lv})}}
  var n=0;for(var id in rp){n++;if(performance.now()-rp[id].t>9000){delete rp[id];D().say('🤝 '+(ro[id]&&ro[id].n||'Arkadaşın')+' zindandan koptu.','sys')}}
  if(!n)return;snT+=dt;if(snT<.12)return;snT=0;send('sn',snap())}

/* ---------- üye ---------- */
function popup(f,d){var e=document.getElementById('dginv');if(!e){e=document.createElement('div');e.id='dginv';e.style.cssText='position:absolute;left:50%;top:84px;transform:translateX(-50%);z-index:30;background:rgba(14,10,36,.94);border:2px solid #7be07b;border-radius:14px;padding:10px 14px;color:#fff;font:700 .9rem "Chakra Petch",sans-serif;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.5);max-width:92vw';(document.getElementById('hud')||document.body).appendChild(e)}
  var nm=(ro[f]&&ro[f].n)||nameOf(f);e.innerHTML='🤝 <b style="color:#7be07b">'+esc(nm)+'</b> seni <b style="color:#ffd98a">'+esc(d.n)+'</b> zindanına çağırıyor!<br><small style="color:#b9b4d8">Aynı canavarlar, aynı boss · Sv '+d.lv+'</small><div style="margin-top:8px;display:flex;gap:8px;justify-content:center"><button id="dgy" style="background:#3fbf6a;color:#fff;border:0;border-radius:10px;padding:7px 16px;font:800 .9rem inherit">⚔ Katıl</button><button id="dgn" style="background:#3a3458;color:#fff;border:0;border-radius:10px;padding:7px 14px;font:700 .85rem inherit">Sonra</button></div>';
  e.style.display='';clearTimeout(e._t);e._t=setTimeout(function(){e.style.display='none'},20000);
  document.getElementById('dgy').onclick=function(){e.style.display='none';var P=D().P;send('join',{n:P.nick||P.name||'Oyuncu',ap:myAp(),lv:P.lv,cls:P.cls},f);D().say('Katılma isteği gönderildi…','sys')};
  document.getElementById('dgn').onclick=function(){e.style.display='none'}}
function esc(s){return String(s||'').replace(/[<>&"]/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function nameOf(id){try{var o=YNet.others()[id];if(o)return o.n}catch(e){}var m=mates().filter(function(x){return x.id===id})[0];return m?m.n:'Arkadaşın'}
function join(f,d){var g=G();if(!g||g.mode!=='world'||g.dead>0)return;var y=D();last=null;curS=null;
  y.enterDg(d.id,{cl:f,lv:d.lv,pn:d.pn});if(!g.dg)return;g.dg.cl=f;g.px+=56;if(d.ro)ro=d.ro;
  y.say('🤝 '+nameOf(f)+' ile ortak zindandasın! Canavarlar ve boss ortak.','sys');y.banner('Ortak Zindan',nameOf(f)+' ile birlikte')}
function apply(o){var g=G(),dg=g.dg,y=D(),Y=y.Y,d=Y.DUNGEONS[dg.id];
  if(o.s!==dg.stage&&o.s>=0&&o.s<d.stages.length){revive();dg.stage=o.s;dg.wave=o.s;y.dgStage();g.px+=56;g.dgFade=1;drSent=0;dg.mons=[]}
  if(o.pn)dg.pn=o.pn;dg.wv=o.w;dg.wvn=o.wn;
  var byU={};dg.mons.forEach(function(m){byU[m._u]=m});var nm=[];
  o.m.forEach(function(a){var m=byU[a[0]];if(!m){m=y.mkMon(a[1],a[6],a[2],a[3]);m._u=a[0];m.sx=a[2];m.sy=a[3];m.hit=9;if(a[7])m.boss=1;if(a[9])m.elite=1;m.tx=a[2];m.ty=a[3];if(a[8])m.dead=1}
    m.tx=a[2];m.ty=a[3];m.max=a[5];if(!m._pd||a[4]<m.hp||Math.abs(a[4]-m.hp)>m.max*.15)m.hp=Math.max(a[4],0);m._pd=0;
    if(a[8]&&!m.dead){m.hp=0;y.killMon(m)}nm.push(m)});dg.mons=nm;
  if(dg.door&&o.dr>=0){var wo=dg.door.open;dg.door.open=!!o.dr;if(!wo&&o.dr){y.banner('Kapı açıldı','Kapıdan geç: ekip seninle gelir')}}
  if(dg.chest&&o.ch===1&&!dg.chest.open){dg.chest.open=true;try{y.dgReward(.16,'Hazine sandığı!')}catch(e){}}
  if(dg.surv&&o.sv>=0)dg.surv.left=o.sv;
  var mine=o.h&&o.h[me()];if(mine)mine.forEach(function(h){y.hurt(h[0]*Y.lvIn(y.P.lv,h[1]))});
  var pl={};o.pl.forEach(function(a){if(a[0]===me())return;var r=rp[a[0]]||{x:a[1],y:a[2]};r.id=a[0];r.tx=a[1];r.ty=a[2];r.fa=a[3];r.mv=a[4];r.dead=a[5];r.hp=a[6];pl[a[0]]=r});rp=pl;
  if(o.dn&&!dg.done){dg.stage=d.stages.length;y.dgDone()}}
function cTick(dt){var g=G(),dg=g.dg,y=D();if(g.dgFade>0)g.dgFade=Math.max(0,g.dgFade-dt*2);
  dg.mons.forEach(function(m){if(m.tx==null)return;var k=Math.min(1,dt*10);m.x+=(m.tx-m.x)*k;m.y+=(m.ty-m.y)*k;if(m.hit>0)m.hit-=dt});
  if(dg.fountain&&!dg.fountain.used&&Math.hypot(dg.fountain.x-g.px,dg.fountain.y-g.py)<70){dg.fountain.used=true;g.hp=y.S().maxhp;g.sta=100;y.floatTxt(g.px,g.py-60,'Tam şifa','#5be39a')}
  if(dg.door&&dg.door.open&&!drSent&&Math.hypot(dg.door.x-g.px,dg.door.y-g.py)<70){drSent=1;send('dr',1,dg.cl)}
  poT+=dt;if(poT>=.1){poT=0;send('pos',{x:Math.round(g.px),y:Math.round(g.py),fa:+(Math.atan2(g.fy||0,g.fx||0)).toFixed(2),mv:g.mv?1:0,dd:g.dead>0?1:0,hp:+(g.hp/y.S().maxhp).toFixed(2),h:hits.splice(0,24)},dg.cl)}}
function hit(m,d){if(m._u)hits.push([m._u,Math.round(d)]);m._pd=1}

/* ---------- ortak ---------- */
function hand(m){var g=G();if(!g||!m||!m.f)return;var d=m.d,dg=g.dg;
  switch(m.k){
  case 'inv':if(g.mode==='world'&&!g.dg&&d&&d.id)popup(m.f,d);break;
  case 'join':if(dg&&!dg.cl&&!dg.done&&d){if(Object.keys(rp).length>=4)return;ro[m.f]={n:String(d.n||'Oyuncu').slice(0,24),ap:d.ap,cls:d.cls,lv:d.lv};
    var nm=ro[m.f].n,pn0=nameOf(m.f),rm=0;g.comp=(g.comp||[]).filter(function(c){var x=c.mate&&!rm&&(c.nm===nm||c.nm===pn0);if(x)rm=1;return !x});
    rp[m.f]={id:m.f,x:g.px,y:g.py,tx:g.px,ty:g.py,t:performance.now(),hp:1};ro[me()]={n:D().P.nick||D().P.name,ap:myAp(),cls:D().P.cls,lv:D().P.lv};
    send('acc',{id:dg.id,lv:dg.lv,pn:dg.pn,ro:ro},m.f);send('ro',ro);D().say('🤝 '+nm+' zindana katıldı!','sys');D().floatTxt(g.px,g.py-70,nm+' katıldı','#7be07b')}break;
  case 'acc':if(d&&d.id)join(m.f,d);break;
  case 'ro':if(dg&&dg.cl===m.f&&d)ro=d;break;
  case 'sn':if(dg&&dg.cl===m.f&&d&&d.m)try{apply(d)}catch(e){}break;
  case 'pos':if(dg&&!dg.cl&&rp[m.f]&&d){var r=rp[m.f];r.tx=d.x;r.ty=d.y;r.fa=d.fa;r.mv=d.mv;r.dead=d.dd;r.hp=d.hp;r.t=performance.now();
    (d.h||[]).forEach(function(h){var mo=dg.mons.filter(function(x){return x._u===h[0]&&!x.dead})[0];if(!mo)return;var v=Math.max(1,Math.min(1e7,+h[1]||0));mo.hp-=v;mo.hit=5;D().floatTxt(mo.x,mo.y-mo.sz-14,v,'#bfe9ff');if(mo.hp<=0)D().killMon(mo)})}break;
  case 'dr':if(dg&&!dg.cl&&dg.door&&dg.door.open&&!dg.trans){dg.trans={t:0,ph:0};g.px=dg.door.x}break;
  case 'lv':if(dg&&!dg.cl&&rp[m.f]){delete rp[m.f];D().say('🤝 '+(ro[m.f]&&ro[m.f].n||'Arkadaşın')+' zindandan ayrıldı.','sys')}break;
  case 'end':if(dg&&dg.cl===m.f){if(!dg.done){D().say('Lider zindandan ayrıldı, ortak zindan bitti.','sys');D().exitDg()}else dg.cl=null}break}}
function left(){var g=G(),dg=g&&g.dg;if(!dg)return;if(dg.cl)send('lv',1,dg.cl);else if(Object.keys(rp).length)send('end',1);rp={};hq={};inv=null}
function ents(list,ctx,t){var g=G();if(!g||!g.dg)return;var dt=1/60;
  for(var id in rp){(function(r){var k=.18;r.x+=(r.tx-r.x)*k;r.y+=(r.ty-r.y)*k;var R=ro[r.id]||{},ap=R.ap||(window.YL&&YL.def());
    list.push({y:r.y,f:function(){var x=r.x,y=r.y;ctx.save();if(r.dead)ctx.globalAlpha=.4;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,y+22,20,8,0,0,6.28);ctx.fill();
      try{YL.hero(ctx,x,y+21,ap,t,!!r.mv,1)}catch(e){}try{if(ap&&ap.body!=='svg')YA.weapon(ctx,R.cls||ap.cl||'savasci',x,y-2,r.fa||0,0,t,0,ap.sk,ap.tc,!!r.mv,ap)}catch(e){}
      var ty=y+15+(window.YL?YL.topY(ap):-70);try{YA.plate(ctx,x,ty,'🤝 '+(R.n||'Arkadaş')+(R.lv?' · Sv'+R.lv:''),'#7be07b')}catch(e){}
      ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(x-22,ty+6,44,5);ctx.fillStyle=r.dead?'#777':'#5be39a';ctx.fillRect(x-22,ty+6,44*Math.max(0,Math.min(1,r.hp||0)),5);ctx.restore()}})})(rp[id])}}
window.YDG={alive:alive,hand:hand,hostStart:hostStart,hTick:hTick,cTick:cTick,tgt:tgt,hurtR:hurtR,hit:hit,left:left,ents:ents,dbg:{rp:function(){return rp},snap:snap,apply:apply,ro:function(){return ro}}};
})();
