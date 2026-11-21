/* Yaxest Diyarı: sosyal katman (arkadaş, DM, parti, takas, düello, klan, emote, dünya çanı).
   Sunucu: server/worker.js. Bu dosya arayüzü ve oyun içi etkileri yönetir. window.YSoc */
(function(){
'use strict';
var D,Net,inited=0,root,hudB,S,confKey='',confT=0;
var EM=['👋','😂','❤️','🎉','👍','😮','😡','🙏','⚔️','🔥','💎','😴'];
var WG=[0,100,500,1000,5000],CLAN_COST=5000,BELL_COST=500;
function reset(){S={fr:[],inn:[],bl:[],pt:null,cl:null,duel:null,tr:null,lb:null,cs:null,dm:{},tab:'fr',view:null,pings:[],myId:'',myPk:'',wager:0,csq:'',gift:0}}
reset();
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function pl(){return D.P}
function send(o){if(Net)Net.send(o)}
function say(t,k){if(D)D.say(t,k||'sys')}
function addGold(n){var P=pl();P.gold=Math.max(0,(P.gold||0)+n);D.saveNow()}
function others(){return Net?Net.others():{}}
function me(){return Net?Net.myId():null}
function isFriend(k){return S.fr.some(function(f){return f.k===k})}
function inParty(id){return !!(S.pt&&S.pt.mem&&S.pt.mem.some(function(m){return m.id===id}))}
function myRole(){return S.cl?(S.cl.mem.filter(function(m){return m.k===S.myPk})[0]||{}).r:''}
function panelOn(){return root&&root.classList.contains('on')}

/* ---------- kurulum ---------- */
var CSS='#p-soc{z-index:6}#soc-b .tabs{flex-wrap:wrap}#soc-b .tabs button{flex:1 1 30%;min-height:34px;font-size:.78rem;padding:0 4px;position:relative}.sbd{position:absolute;top:-5px;right:-3px;min-width:18px;height:18px;border-radius:9px;background:#ff5a5a;color:#fff;font:700 .7rem/18px system-ui;text-align:center;padding:0 4px}#isoc,#iem,#ichat{position:relative}#ctabs button{position:relative}#isoc .sbd{top:-4px;right:-4px}'
+'#soc-b .it{flex-wrap:wrap}#soc-b input,#soc-b select{min-width:0;padding:8px 11px;border-radius:11px;border:1.5px solid #ffffff33;background:#ffffff12;color:inherit;font:inherit}.dot{width:9px;height:9px;border-radius:50%;background:#555;display:inline-block;margin-right:6px}.dot.on{background:#53e07a;box-shadow:0 0 6px #53e07a}'
+'#soc-t{position:fixed;left:50%;top:100px;transform:translateX(-50%);z-index:25;display:flex;flex-direction:column;gap:8px;width:min(92vw,420px);pointer-events:none}.stoast{pointer-events:auto;background:rgba(20,14,50,.97);border:1.5px solid var(--yel);border-radius:14px;padding:10px 12px;box-shadow:0 8px 28px rgba(0,0,0,.5);font-size:.88rem;animation:rin .3s ease}.stoast .r{display:flex;gap:8px;margin-top:8px}.stoast button{min-height:34px;padding:0 14px;font-size:.82rem}'
+'#duelbar{position:fixed;left:50%;top:98px;transform:translateX(-50%);z-index:21;display:none;width:min(92vw,520px);background:rgba(20,10,30,.92);border:2px solid #ff6b6b;border-radius:14px;padding:8px 12px;font-size:.82rem;text-align:center}#duelbar .bars{display:flex;gap:10px;align-items:center}#duelbar .hp{flex:1;height:12px;background:#ffffff1a;border-radius:6px;overflow:hidden}#duelbar .hp i{display:block;height:100%;background:linear-gradient(90deg,#ff5a5a,#ffb02e);transition:width .2s}'
+'#bellb{position:fixed;left:50%;top:44px;transform:translateX(-50%);z-index:26;display:none;max-width:min(94vw,560px);background:linear-gradient(135deg,#3a2a00,#6b4a00);border:2px solid #ffd23f;border-radius:16px;padding:10px 16px;font-weight:700;text-align:center;box-shadow:0 0 30px #ffd23f66}'
+'#emp{position:fixed;right:10px;top:150px;z-index:22;display:none;grid-template-columns:repeat(4,1fr);gap:6px;background:rgba(20,14,50,.96);border:1.5px solid var(--line);border-radius:14px;padding:8px}#emp button{width:44px;height:44px;border-radius:12px;border:1px solid var(--line);background:#2a2150;font-size:1.4rem;cursor:pointer}';
function build(){
  if(inited)return;inited=1;
  var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  root=document.createElement('div');root.className='pan';root.id='p-soc';
  root.innerHTML='<div class="card" style="width:min(94vw,600px)"><h2>👥 Sosyal</h2><div id="soc-b"></div><div class="row"><button class="btn alt" id="soc-x" type="button">Kapat</button></div></div>';
  document.body.appendChild(root);
  var t=document.createElement('div');t.id='soc-t';document.body.appendChild(t);
  var d=document.createElement('div');d.id='duelbar';document.body.appendChild(d);
  var bl=document.createElement('div');bl.id='bellb';document.body.appendChild(bl);
  var em=document.createElement('div');em.id='emp';em.innerHTML=EM.map(function(e,i){return'<button type="button" data-e="'+i+'">'+e+'</button>'}).join('');document.body.appendChild(em);
  $('soc-x').onclick=closeP;
  root.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(b){e.preventDefault();act(b.dataset.a)}});
  root.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.id==='dmi'){e.preventDefault();act('dms')}});
  root.addEventListener('change',function(e){if(e.target.id==='wg')S.wager=+e.target.value||0});
  em.addEventListener('click',function(e){var b=e.target.closest('[data-e]');if(!b)return;send({t:'em',e:+b.dataset.e});em.style.display='none'});
  document.addEventListener('click',function(e){if(em.style.display==='grid'&&!e.target.closest('#emp')&&!e.target.closest('#iem'))em.style.display='none'});
}
function hud(){
  var tr=$('imenu')&&$('imenu').parentNode;if(!tr)return;
  if(!$('isoc')){var b=document.createElement('button');b.className='ib';b.id='isoc';b.type='button';b.setAttribute('aria-label','Sosyal');b.innerHTML='👥<i class="sbd" id="sbd" style="display:none"></i>';tr.insertBefore(b,$('imenu'));b.onclick=function(){if(D.G&&D.G.mode==='world')openP(S.inn.length?'in':S.tab)};}
  if(!$('iem')){var e=document.createElement('button');e.className='ib';e.id='iem';e.type='button';e.setAttribute('aria-label','Duygu');e.textContent='😀';tr.insertBefore(e,$('imenu'));e.onclick=function(){var p=$('emp');p.style.display=p.style.display==='grid'?'none':'grid'}}
  var cv=$('cv');if(cv&&!cv._soc){cv._soc=1;cv.addEventListener('click',function(e){var G=D&&D.G;if(!G||G.paused||G.mode!=='world'||!Net)return;var o=Net.pick(e.clientX,e.clientY);if(o)openProf(o.id)})}
}
function init(api){D=api.D;Net=api.Net;build();hud();reset();badge();var d=$('duelbar');if(d)d.style.display='none'}
function leave(){reset();var d=$('duelbar');if(d)d.style.display='none';if(root)root.classList.remove('on')}
function onHi(m){S.myId=m.id;S.myPk=m.k||''}

/* ---------- panel ---------- */
function openP(tab){S.tab=tab||S.tab;S.view=null;if(S.tab==='lb')send({t:'lbq'});if(S.tab==='cl'&&!S.cl)send({t:'cs',q:S.csq});render();D.openPan('p-soc')}
function closeP(){S.view=null;D.closePan()}
function badge(){var b=$('sbd');if(!b)return;var n=S.inn.length+S.fr.reduce(function(a,f){return a+(f.un||0)},0);b.style.display=n?'block':'none';b.textContent=n>9?'9+':n}
function btn(l,a,c,x){return'<button class="btn'+(c?' '+c:'')+'" data-a="'+a+'" type="button" style="min-height:34px;padding:0 12px;font-size:.82rem"'+(x||'')+'>'+l+'</button>'}
function render(){
  if(!root)return;var el=$('soc-b'),keep={};['dmi','fnick','ctag','cname','cmotto','csq','pnick','bellm','cinvn'].forEach(function(i){var x=$(i);if(x)keep[i]=x.value});
  var h='';
  if(S.view&&S.view.t==='prof')h=profHtml();else if(S.view&&S.view.t==='dm')h=dmHtml();else if(S.view&&S.view.t==='trade')h=tradeHtml();else if(S.view&&S.view.t==='dep')h=depHtml();
  else{var T=[['fr','👥 Arkadaş'],['in','📨 İstek'],['pl','🌍 Oyuncu'],['cl','🛡️ Klan'],['pt','🎉 Parti'],['lb','🏆 Sıralama']];
    h='<div class="tabs">'+T.map(function(t){var n=t[0]==='in'?S.inn.length:t[0]==='fr'?S.fr.reduce(function(a,f){return a+(f.un||0)},0):0;return'<button type="button" data-a="tab|'+t[0]+'" aria-pressed="'+(S.tab===t[0])+'">'+t[1]+(n?'<i class="sbd">'+n+'</i>':'')+'</button>'}).join('')+'</div>';
    h+=({fr:frHtml,in:inHtml,pl:plHtml,cl:clHtml,pt:ptHtml,lb:lbHtml}[S.tab]||frHtml)()}
  el.innerHTML=h;Object.keys(keep).forEach(function(i){var x=$(i);if(x)x.value=keep[i]});
  var dm=$('dm-l');if(dm)dm.scrollTop=dm.scrollHeight;badge()}
function re(){if(panelOn())render();else badge()}
function nameRow(o){return esc(o.n)+(o.cg?' <small>['+esc(o.cg)+']</small>':'')}
function frHtml(){
  var h='<p class="sub">Arkadaşlar çevrimdışıyken de listende kalır; DM, hediye ve düello/takas için çevrimiçi olmaları yeterli.</p><div class="it"><input id="fnick" maxlength="16" placeholder="Takma adla arkadaş ekle" style="flex:1"> '+btn('Ekle','addfr')+'</div>';
  if(!S.fr.length)return h+'<p class="sub">Henüz arkadaşın yok. Bir oyuncuya dokun ya da takma adını yaz.</p>';
  S.fr.slice().sort(function(a,b){return(b.on?1:0)-(a.on?1:0)||a.n.localeCompare(b.n)}).forEach(function(f){
    h+='<div class="it"><span class="dot'+(f.on?' on':'')+'"></span><div class="t"><b>'+esc(f.n)+'</b>'+(f.on?' <small>Sv '+f.lv+'</small>':' <small>çevrimdışı</small>')+'</div>'
     +btn('💬'+(f.un?' <b style="color:#ff8f8f">'+f.un+'</b>':''),'dm|'+f.k,'alt')+(f.on?btn('👤','prof|'+f.id,'alt'):'')+btn('🎁','gf|'+f.k,'alt')+btn(confKey==='fd|'+f.k?'Emin misin?':'✖','fd|'+f.k,'alt')+'</div>'});
  return h}
function rtext(r){var n='<b>'+esc(r.fn)+'</b>';
  return({fr:'🤝 '+n+' arkadaşlık isteği gönderdi',pt:'🎉 '+n+' seni partiye çağırıyor',tr:'🔄 '+n+' seninle takas yapmak istiyor',du:'⚔️ '+n+' seni düelloya çağırıyor'+(r.d&&r.d.g?' <small>(bahis: 🪙'+r.d.g+')</small>':''),cl:'🛡️ '+n+' seni <b>['+esc(r.d&&r.d.tag)+']</b> klanına davet ediyor',cj:'🛡️ '+n+' klanına katılmak istiyor',gf:'🎁 '+n+' sana 🪙'+(r.d&&r.d.g)+' hediye gönderdi'})[r.k]||esc(r.k)}
function inHtml(){if(!S.inn.length)return'<p class="sub">Bekleyen isteğin yok.</p>';return S.inn.map(function(r){return'<div class="it"><div class="t">'+rtext(r)+'</div>'+btn(r.k==='gf'?'Al':'Kabul','ra|'+r.rid+'|1')+btn('Reddet','ra|'+r.rid+'|0','alt')+'</div>'}).join('')}
function plHtml(){var G=D.G,o=others(),ids=Object.keys(o).sort(function(a,b){return Math.hypot(o[a].x-G.px,o[a].y-G.py)-Math.hypot(o[b].x-G.px,o[b].y-G.py)});
  var h='<p class="sub">Dünyadaki oyuncular. Haritada bir oyuncuya dokunarak da profilini açabilirsin.</p>';
  if(!ids.length)h+='<p class="sub">Şu an başka oyuncu yok.</p>';
  ids.forEach(function(id){var x=o[id],dist=Math.round(Math.hypot(x.x-G.px,x.y-G.py)/48);h+='<div class="it"><span class="dot on"></span><div class="t"><b>'+nameRow(x)+'</b> <small>Sv '+x.lv+' · '+dist+' kare'+(isFriend(x.k)?' · ♥':'')+(inParty(id)?' · 🎉':'')+'</small></div>'+btn('Profil','prof|'+id,'alt')+'</div>'});
  h+='<div class="it" style="margin-top:6px"><input id="bellm" maxlength="80" placeholder="Dünya çanı mesajı…" style="flex:1">'+btn('📣 Çal (🪙'+BELL_COST+')','bell')+'</div><p class="sub" style="font-size:.76rem">Dünya çanı tüm oyunculara büyük duyuru olarak görünür. 20 sn’de bir kullanılabilir.</p>';
  return h}
function bar(a,b,c){return'<div style="height:10px;border-radius:5px;background:#ffffff1a;overflow:hidden;margin:4px 0"><i style="display:block;height:100%;width:'+Math.min(100,a/Math.max(1,b)*100)+'%;background:'+(c||'#ffd23f')+'"></i></div>'}
function clHtml(){
  var c=S.cl,P=pl();
  if(!c){
    var h='<p class="sub">Klan kur (🪙'+CLAN_COST+') ya da bir klana katıl. Klan kasasına bağışlanan altın klanı seviyelendirir; her seviye herkese +%1 XP verir.</p>'
     +'<div class="it"><input id="ctag" maxlength="4" placeholder="ETİKET" style="width:78px;text-transform:uppercase"><input id="cname" maxlength="16" placeholder="Klan adı" style="flex:1"><input id="cmotto" maxlength="40" placeholder="Slogan (isteğe bağlı)" style="flex:1 1 100%">'+btn('🛡️ Klan kur','ccreate')+'</div>'
     +'<div class="it"><input id="csq" maxlength="16" placeholder="Klan ara…" style="flex:1" value="'+esc(S.csq)+'">'+btn('Ara','csearch','alt')+'</div>';
    (S.cs||[]).forEach(function(k){h+='<div class="it"><div class="t"><b>['+esc(k.tag)+'] '+esc(k.n)+'</b> <small>Sv '+k.lv+' · '+k.m+'/30 üye · '+(k.o?'açık':'onaylı')+'</small></div>'+btn(k.o?'Katıl':'İstek gönder','cjoin|'+k.tag)+'</div>'});
    if(S.cs&&!S.cs.length)h+='<p class="sub">Klan bulunamadı.</p>';return h}
  var r=myRole(),mg=r==='lead'||r==='off',h2='<div class="it"><div class="t"><b style="font-size:1.1rem">['+esc(c.tag)+'] '+esc(c.name)+'</b> <small>· Seviye '+c.lv+' · +%'+(c.lv-1)+' XP</small>'+(c.motto?'<br><small>“'+esc(c.motto)+'”</small>':'')+bar(c.xp,c.nx||c.xp||1)+'<small>Kasa XP: '+c.xp+(c.nx?' / '+c.nx:' (maksimum)')+' · '+(c.open?'herkese açık':'onaylı katılım')+'</small></div></div>';
  h2+='<div class="it"><div class="t"><small>Kasaya bağış:</small></div>'+[100,1000,5000].map(function(g){return btn('🪙'+g,'cdon|'+g,'alt')}).join('')+'</div>';
  if(r==='lead')h2+='<div class="it"><input id="cmotto" maxlength="40" placeholder="Yeni slogan" style="flex:1">'+btn('Kaydet','cmotto','alt')+btn(c.open?'🔒 Onaylı yap':'🔓 Aç','copen|'+(c.open?0:1),'alt')+'</div>';
  if(mg)h2+='<div class="it"><input id="cinvn" maxlength="16" placeholder="Takma adla davet et" style="flex:1">'+btn('Davet','cinvn')+'</div>';
  c.mem.slice().sort(function(a,b){return({lead:0,off:1,mem:2}[a.r]-{lead:0,off:1,mem:2}[b.r])||b.c-a.c}).forEach(function(m){
    var self=m.k===S.myPk;h2+='<div class="it"><span class="dot'+(m.on?' on':'')+'"></span><div class="t">'+(m.r==='lead'?'👑 ':m.r==='off'?'⭐ ':'')+'<b>'+esc(m.n)+'</b>'+(self?' <small>(sen)</small>':'')+' <small>· bağış 🪙'+m.c+'</small></div>'
      +((r==='lead'&&!self)?(m.r==='mem'?btn('⬆','cm|'+m.k+'|pro','alt'):btn('⬇','cm|'+m.k+'|dem','alt'))+btn('👑','cm|'+m.k+'|lead','alt'):'')
      +((!self&&(r==='lead'||(r==='off'&&m.r==='mem')))?btn(confKey==='cm|'+m.k+'|kick'?'Emin misin?':'❌','cm|'+m.k+'|kick','alt'):'')+'</div>'});
  h2+='<div class="row" style="margin-top:10px">'+btn('📦 Klan Deposu','cdep','')+'</div><div class="row" style="margin-top:8px">'+btn(confKey==='cleave'?'Emin misin? Evet, ayrıl':'Klandan ayrıl','cleave','alt')+'</div>';return h2}
function ptHtml(){
  var p=S.pt,h='<p class="sub">Parti: en fazla 4 oyuncu. Parti sohbeti, “📍 Buraya gel” işareti, ekran dışındaki üyeleri gösteren pusula oku ve parti XP bonusu (üye başına +%5) verir.</p>';
  if(!p||!p.mem||p.mem.length<2)h+='<p class="sub">Bir partide değilsin. Bir oyuncuya dokunup “Partiye çağır” de ya da takma adını yaz.</p>';
  else{p.mem.forEach(function(m){h+='<div class="it"><div class="t">'+(m.id===p.lead?'👑 ':'')+'<b>'+esc(m.n)+'</b> <small>Sv '+m.lv+(m.id===S.myId?' · sen':'')+'</small></div>'+((p.lead===S.myId&&m.id!==S.myId)?btn('At','pkick|'+m.id,'alt'):'')+'</div>'});
    h+='<div class="row" style="margin:8px 0">'+btn('📍 Buraya gel','ping')+btn('Partiden ayrıl','pleave','alt')+'</div>'}
  if(!p||!p.mem||p.mem.length<4)h+='<div class="it"><input id="pnick" maxlength="16" placeholder="Takma adla davet" style="flex:1">'+btn('Davet et','pinvn')+'</div>';
  return h}
function lbHtml(){var L=S.lb;if(!L)return'<p class="sub">Yükleniyor…</p>';
  var h='<h3 style="margin:4px 0">⚔️ Düello şampiyonları</h3>';
  if(!L.duel.length)h+='<p class="sub">Henüz düello yapılmadı.</p>';L.duel.forEach(function(x,i){h+='<div class="it"><b style="width:26px">'+(i+1)+'.</b><div class="t">'+esc(x.n)+'</div><small>'+x.w+' G · '+x.l+' M</small></div>'});
  h+='<h3 style="margin:10px 0 4px">🛡️ En güçlü klanlar</h3>';if(!L.clans.length)h+='<p class="sub">Henüz klan yok.</p>';
  L.clans.forEach(function(x,i){h+='<div class="it"><b style="width:26px">'+(i+1)+'.</b><div class="t">['+esc(x.tag)+'] '+esc(x.n)+'</div><small>Sv '+x.lv+' · '+x.m+' üye</small></div>'});
  return h+'<div class="row" style="margin-top:8px">'+btn('Yenile','lbr','alt')+'</div>'}
/* ---- profil kartı ---- */
function openProf(id){S.view={t:'prof',id:id};render();D.openPan('p-soc')}
function profHtml(){var o=others()[S.view.id];
  if(!o)return'<p class="sub">Oyuncu ayrıldı.</p><div class="row">'+btn('Geri','back','alt')+'</div>';
  var fr=isFriend(o.k),pr=inParty(o.id),r=myRole(),bl=S.bl.indexOf(o.k)>=0;
  var h='<div style="text-align:center"><div style="font-size:2.4rem">🧑</div><h3 style="margin:2px 0">'+nameRow(o)+(fr?' ♥':'')+'</h3><small style="color:var(--mute)">Seviye '+o.lv+' · Düello '+o.w+' G / '+o.l+' M</small></div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0">'
    +btn('👋 Selam ver','hi','alt')
    +(fr?btn('💬 Fısılda','dm|'+o.k):btn('🤝 Arkadaş ekle','iv|fr|'+o.id))
    +(pr?'':btn('🎉 Partiye çağır','iv|pt|'+o.id))
    +btn('🔄 Takas teklif et','iv|tr|'+o.id)
    +(!o.cg&&(r==='lead'||r==='off')?btn('🛡️ Klana davet et','iv|cl|'+o.id):'')
    +(fr?btn('🎁 100 altın hediye','gf|'+o.k,'alt'):'')
    +'</div>';
  h+='<div class="it"><div class="t"><b>⚔️ Düello</b><br><small>Bahis (kazanan ikisini alır):</small></div><select id="wg">'+WG.map(function(g){return'<option value="'+g+'"'+(g===S.wager?' selected':'')+'>'+(g?'🪙'+g:'Bahissiz')+'</option>'}).join('')+'</select>'+btn('Meydan oku','iv|du|'+o.id)+'</div>';
  h+='<div class="row" style="margin-top:8px">'+btn('Geri','back','alt')+btn(bl?'Engeli kaldır':'🚫 Engelle','blk|'+o.k+'|'+(bl?0:1),'alt')+btn('⚠️ Bildir','rep|'+o.k,'alt')+'</div>';return h}
/* ---- DM ---- */
function dmHtml(){var k=S.view.k,f=S.fr.filter(function(x){return x.k===k})[0],L=S.dm[k]||[];
  var h='<h3 style="margin:0 0 6px">💬 '+esc(f?f.n:'Arkadaş')+' '+(f&&f.on?'<span class="dot on"></span>':'')+'</h3><div id="dm-l" style="max-height:38vh;overflow:auto;font-size:.9rem;line-height:1.5;margin-bottom:8px">';
  if(!L.length)h+='<div style="color:var(--mute)">Henüz mesaj yok. Merhaba de!</div>';
  L.forEach(function(e){var mine=e.f===S.myPk;h+='<div style="text-align:'+(mine?'right':'left')+'"><span style="display:inline-block;max-width:84%;padding:6px 11px;border-radius:12px;margin:2px 0;background:'+(mine?'#3b3380':'#ffffff18')+'">'+esc(e.m)+'</span></div>'});
  return h+'</div><div class="it"><input id="dmi" maxlength="200" autocomplete="off" placeholder="Mesaj yaz…" style="flex:1">'+btn('Gönder','dms')+'</div><div class="row">'+btn('Geri','back','alt')+'</div>'}
/* ---- takas ---- */
function offerList(o){var ks=Object.keys(o.it||{});if(!o.g&&!ks.length)return'<small style="color:var(--mute)">Boş</small>';return(o.g?'<div>🪙 '+o.g+' altın</div>':'')+ks.map(function(k){var n='?',ic='';try{n=D.itName(k);ic=D.itIc(k)}catch(e){}return'<div>'+ic+' '+esc(n)+' ×'+o.it[k]+'</div>'}).join('')}
function tradeHtml(){var T=S.tr;if(!T)return'<p class="sub">Takas bitti.</p><div class="row">'+btn('Kapat','close','alt')+'</div>';
  var m=T[T.me],o=T[T.me==='a'?'b':'a'],P=pl(),inv=D.myInv();
  var h='<h3 style="margin:0 0 6px">🔄 Takas · '+esc(o.n)+'</h3><div class="it" style="align-items:flex-start"><div class="t"><b>'+esc(o.n)+' veriyor</b>'+(o.lk?' <span style="color:#53e07a">🔒 kilitledi</span>':'')+(o.ok?' <span style="color:#53e07a">✅ onayladı</span>':'')+'<div style="margin-top:4px">'+offerList(o)+'</div></div></div>';
  h+='<div class="it" style="align-items:flex-start"><div class="t"><b>Sen veriyorsun</b>'+(m.lk?' <span style="color:#53e07a">🔒</span>':'')+(m.ok?' <span style="color:#53e07a">✅</span>':'')+'<div style="margin-top:4px">'+offerList(m)+'</div></div></div>';
  if(!m.lk){h+='<div class="it"><div class="t">🪙 Altın: <b>'+m.g+'</b> <small>(sende '+(P.gold||0)+')</small></div>'+[-1000,-100,100,1000].map(function(d){return btn((d>0?'+':'')+d,'tg|'+d,'alt')}).join('')+'</div>';
    inv.forEach(function(x){var q=m.it[x.k]||0,n='',ic='';try{n=D.itName(x.k);ic=D.itIc(x.k)}catch(e){return}h+='<div class="it"><span style="font-size:1.2rem">'+ic+'</span><div class="t">'+esc(n)+' <small>×'+x.q+'</small></div>'+btn('−','ti|'+x.k+'|-1','alt')+'<b style="min-width:20px;text-align:center">'+q+'</b>'+btn('+','ti|'+x.k+'|1','alt')+'</div>'})}
  var both=m.lk&&o.lk;
  h+='<p class="sub" style="margin:8px 0">'+(!m.lk?'Teklifini hazırla, sonra 🔒 Kilitle.':!o.lk?'Karşı tarafın kilitlemesi bekleniyor…':m.ok?'Karşı tarafın onayı bekleniyor…':'İkiniz de kilitlediniz: ✅ Onayla.')+' Teklif değişirse kilitler açılır.</p>';
  h+='<div class="row">'+btn(m.lk?'🔓 Kilidi aç':'🔒 Kilitle','tl')+btn(m.ok?'Bekleniyor…':'✅ Onayla','tc','',both&&!m.ok?'':' disabled')+btn('İptal','tx','alt')+'</div>';return h}

/* ---- klan deposu ---- */
function depOk(k){return window.YH&&YH.valid(k)}
function depHtml(){var c=S.cl,r=myRole();if(!c)return'<p class="sub">Klanın yok.</p><div class="row">'+btn('Geri','back','alt')+'</div>';
  var dep=c.dep||{},ks=Object.keys(dep).filter(function(k){return dep[k]>0&&depOk(k)}),u=0;for(var z in dep)u+=dep[z];var can=r==='lead'||r==='off'||c.dw;
  var h='<div class="row" style="margin-bottom:6px">'+btn('← Klan','back','alt')+'</div><div class="it"><div class="t"><b>📦 ['+esc(c.tag)+'] Klan Deposu</b> <small>'+u+' / '+(c.cap||300)+' eşya · her klan seviyesi +200</small>'+bar(u,c.cap||300,'#7ad7ff')+'<small>Alma yetkisi: '+(c.dw?'tüm üyeler':'lider ve subaylar')+(can?' (sende var)':' (sende yok)')+'. Herkes depoya koyabilir.</small></div>'+(r==='lead'?btn(c.dw?'🔒 Kısıtla':'🔓 Üyelere aç','cdw|'+(c.dw?0:1),'alt'):'')+'</div>';
  h+='<h3 style="margin:8px 0 4px">Depoda</h3>';if(!ks.length)h+='<p class="sub">Depo boş. Çantandan bir şey koy; klan arkadaşların ortak kullansın.</p>';
  ks.forEach(function(k){var q=dep[k];h+='<div class="it"><span style="width:30px">'+D.itIc(k)+'</span><div class="t"><b>'+esc(D.itName(k))+'</b> <small>×'+q+'</small></div>'+(can?btn('1','dtk|'+k+'|1','alt')+(q>1?btn('Tümü','dtk|'+k+'|'+q,'alt'):''):'')+'</div>'});
  var inv=D.myInv().filter(function(x){return depOk(x.k)});h+='<h3 style="margin:10px 0 4px">Çantandan koy</h3>';if(!inv.length)h+='<p class="sub">Çantan boş.</p>';
  inv.forEach(function(x){h+='<div class="it"><span style="width:30px">'+D.itIc(x.k)+'</span><div class="t"><b>'+esc(D.itName(x.k))+'</b> <small>×'+x.q+'</small></div>'+btn('1','dpt|'+x.k+'|1','alt')+(x.q>1?btn('10','dpt|'+x.k+'|10','alt')+btn('Tümü','dpt|'+x.k+'|'+x.q,'alt'):'')+'</div>'});
  return h}
function openDepot(){if(!S.cl){S.tab='cl';S.view=null;send({t:'cs',q:S.csq});say('Önce bir klana katıl.')}else S.view={t:'dep'};render();D.openPan('p-soc')}
/* ---------- eylemler ---------- */
function ask(k){if(confKey===k&&Date.now()-confT<4000){confKey='';return true}confKey=k;confT=Date.now();re();setTimeout(function(){if(confKey===k){confKey='';re()}},4100);return false}
function val(i){var x=$(i);return x?x.value.trim():''}
function act(a){var p=a.split('|'),k=p[0],P=pl();
  if(k==='tab'){S.tab=p[1];S.view=null;if(S.tab==='lb')send({t:'lbq'});if(S.tab==='cl'&&!S.cl)send({t:'cs',q:S.csq});render()}
  else if(k==='back'){S.view=null;render()}
  else if(k==='cdep'){S.view={t:'dep'};render()}
  else if(k==='cdw'){send({t:'cdt',on:+p[1]})}
  else if(k==='dpt'){if(!S.cl||!depOk(p[1]))return;var q=Math.min(+p[2]||1,YH.have(p[1]));if(q>0)send({t:'cdp',k:p[1],q:q,n:D.itName(p[1])})}
  else if(k==='dtk'){if(p[1][0]==='w'&&YH.have(p[1]))return say('Bu silaha zaten sahipsin.');if(S.cl&&depOk(p[1]))send({t:'cdw',k:p[1],q:+p[2]||1,n:D.itName(p[1])})}
  else if(k==='close'){closeP()}
  else if(k==='addfr'){var n=val('fnick');if(n)send({t:'iv',k:'fr',n:n});$('fnick').value=''}
  else if(k==='fd'){if(ask(a))send({t:'fd',k:p[1]})}
  else if(k==='dm'){S.view={t:'dm',k:p[1]};var f=S.fr.filter(function(x){return x.k===p[1]})[0];if(f)f.un=0;send({t:'dmh',k:p[1]});render();var i=$('dmi');if(i)i.focus()}
  else if(k==='dms'){var m=val('dmi');if(m&&S.view&&S.view.k){send({t:'dm',k:S.view.k,m:m});$('dmi').value=''}}
  else if(k==='gf'){if((P.gold||0)<100)return say('Hediye için en az 🪙100 gerek.');S.gift=100;send({t:'iv',k:'gf',pk:p[1],g:100})}
  else if(k==='prof'){S.view={t:'prof',id:p[1]};render()}
  else if(k==='hi'){send({t:'em',e:0});say('👋 Selam verdin.')}
  else if(k==='iv'){var kd=p[1],g=0;if(kd==='du'){g=S.wager;if((P.gold||0)<g)return say('Bahis için yeterli altının yok.')}send({t:'iv',k:kd,to:p[2],g:g})}
  else if(k==='ra'){var r=S.inn.filter(function(x){return x.rid===p[1]})[0];if(r&&p[2]==='1'&&r.k==='du'&&(P.gold||0)<(r.d.g||0)){say('Bahis için yeterli altının yok.');p[2]='0'}
    send({t:'ra',rid:p[1],ok:+p[2]});S.inn=S.inn.filter(function(x){return x.rid!==p[1]});rmToast(p[1]);re()}
  else if(k==='blk'){send({t:'bk',k:p[1],on:+p[2]})}
  else if(k==='rep'){send({t:'rp',k:p[1],why:'oyuncu bildirimi'})}
  else if(k==='bell'){var t=val('bellm');if(!t)return;if((P.gold||0)<BELL_COST)return say('Dünya çanı için 🪙'+BELL_COST+' gerek.');send({t:'bell',m:t});$('bellm').value=''}
  else if(k==='ccreate'){if((P.gold||0)<CLAN_COST)return say('Klan kurmak için 🪙'+CLAN_COST+' gerek.');send({t:'cc',tag:val('ctag'),name:val('cname'),motto:val('cmotto')})}
  else if(k==='csearch'){S.csq=val('csq');send({t:'cs',q:S.csq})}
  else if(k==='cjoin'){send({t:'cj',tag:p[1]})}
  else if(k==='cleave'){if(ask('cleave'))send({t:'cx'})}
  else if(k==='cdon'){var g2=+p[1];if((P.gold||0)<g2)return say('Yeterli altının yok.');send({t:'cd',g:g2})}
  else if(k==='cm'){if(p[2]==='kick'&&!ask(a))return;send({t:'cm',u:p[1],a:p[2]})}
  else if(k==='copen'){send({t:'ce',open:+p[1]})}
  else if(k==='cmotto'){var mt=val('cmotto');if(mt)send({t:'ce',motto:mt})}
  else if(k==='cinvn'){var n2=val('cinvn');if(n2)send({t:'iv',k:'cl',n:n2})}
  else if(k==='pinvn'){var n3=val('pnick');if(n3)send({t:'iv',k:'pt',n:n3})}
  else if(k==='ping'){var G=D.G;send({t:'pp',x:Math.round(G.px),y:Math.round(G.py)});say('📍 Parti arkadaşların konumunu gördü.')}
  else if(k==='pleave'){send({t:'pl'})}
  else if(k==='pkick'){send({t:'pk',id:p[1]})}
  else if(k==='lbr'){send({t:'lbq'})}
  else if(k==='tg'){var T=S.tr;if(!T)return;var m=T[T.me];send({t:'to',g:Math.max(0,Math.min(P.gold||0,m.g+(+p[1]))),it:m.it})}
  else if(k==='ti'){var T2=S.tr;if(!T2)return;var m2=T2[T2.me],it={},have=0;D.myInv().forEach(function(x){if(x.k===p[1])have=x.q});for(var q in m2.it)it[q]=m2.it[q];var nq=Math.max(0,Math.min(have,(it[p[1]]||0)+(+p[2])));if(p[1][0]==='w')nq=Math.min(1,nq);if(nq)it[p[1]]=nq;else delete it[p[1]];send({t:'to',g:m2.g,it:it})}
  else if(k==='tl'){send({t:'tl'})}else if(k==='tc'){send({t:'tc'})}else if(k==='tx'){send({t:'tx'});S.tr=null;S.view=null;closeP()}
}
/* ---------- bildirim ---------- */
function toast(html,rid){var c=$('soc-t');if(!c)return;var d=document.createElement('div');d.className='stoast';if(rid)d.dataset.rid=rid;d.innerHTML=html;c.appendChild(d);setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d)},rid?25000:5000);while(c.children.length>3)c.removeChild(c.firstChild);return d}
function rmToast(rid){var c=$('soc-t');if(!c)return;[].forEach.call(c.querySelectorAll('[data-rid="'+rid+'"]'),function(x){x.remove()})}
function reqToast(r){var d=toast(rtext(r)+'<div class="r"><button class="btn" type="button">'+(r.k==='gf'?'Al':'Kabul')+'</button><button class="btn alt" type="button">Reddet</button></div>',r.rid);if(!d)return;var b=d.querySelectorAll('button');b[0].onclick=function(){act('ra|'+r.rid+'|1')};b[1].onclick=function(){act('ra|'+r.rid+'|0')}}
function banner(t,ms){var b=$('bellb');if(!b)return;b.textContent=t;b.style.display='block';clearTimeout(banner._t);banner._t=setTimeout(function(){b.style.display='none'},ms||7000)}

/* ---------- düello ---------- */
function duelBar(){var d=$('duelbar'),D1=S.duel;if(!D1){d.style.display='none';return}
  d.style.display='block';d.innerHTML='<div style="font-weight:700">⚔️ Düello'+(D1.g?' · bahis 🪙'+D1.g+' (kazanan 🪙'+D1.g*2+' alır)':'')+'</div><div class="bars"><span>'+esc(D1.mn)+'</span><div class="hp"><i style="width:'+D1.me/3+'%"></i></div><b>VS</b><div class="hp"><i style="width:'+D1.op/3+'%"></i></div><span>'+esc(D1.on)+'</span></div><div style="margin-top:6px"><button class="btn alt" id="dq" type="button" style="min-height:30px;padding:0 14px;font-size:.78rem">🏳️ Teslim ol</button></div>';
  $('dq').onclick=function(){send({t:'dq'})}}
function duelStart(m){var mine=m.a===S.myId,P=pl();if(m.g)addGold(-m.g);
  S.duel={me:m.hp,op:m.hp,g:m.g,opp:mine?m.b:m.a,mn:P.nick,on:mine?m.bn:m.an};S.view=null;if(panelOn())closeP();duelBar();say('⚔️ Düello başladı! Rakibe yaklaş ve ⚔️ ile vur.');banner('⚔️ Düello: '+S.duel.mn+' VS '+S.duel.on,3500)}
function duelOn(){return !!S.duel}
function duelHit(){var o=others()[S.duel.opp];if(!o)return;var G=D.G;if(Math.hypot(o.dx-G.px,o.dy-G.py)>220){say('Rakip uzakta, yaklaş!');return}send({t:'dh'})}
function duelEnd(m){var D1=S.duel;if(!D1)return;S.duel=null;duelBar();var won=m.w&&m.w===S.myId;
  if(m.w===null||m.w===undefined){if(m.g)addGold(m.g);banner('🤝 Düello berabere bitti'+(m.g?' (bahis iade)':''))}
  else if(won){if(m.g)addGold(m.g*2);banner('🏆 Düelloyu kazandın!'+(m.g?' +🪙'+m.g*2:''),6000);say('🏆 Düelloyu kazandın!')}
  else{banner('💀 Düelloyu kaybettin'+(m.g?' (−🪙'+m.g+')':''),5000);say('Düelloyu kaybettin.')}}
function duelHitMsg(m){var D1=S.duel,G=D.G;if(!D1)return;var tome=m.to===S.myId;if(tome)D1.me=m.hp;else D1.op=m.hp;duelBar();
  var o=others()[D1.opp];if(tome)D.floatTxt(G.px,G.py-48,'-'+m.d+(m.c?'★':''),'#ff6b6b');else if(o)D.floatTxt(o.dx,o.dy-48,'-'+m.d+(m.c?'★':''),'#ffd23f')}

/* ---------- takas bitişi ---------- */
function validKey(k){var a=String(k).split(':'),Y=D.Y;if(a[0]==='m')return !!Y.MATS[a[1]];if(a[0]==='r'){try{D.itName(k);return true}catch(e){return false}}if(a[0]==='w')return !!(Y.WEAPONS[a[1]]&&Y.WEAPONS[a[1]][+a[2]]);return false}
function takeIt(k,q){var P=pl(),a=k.split(':');if(a[0]==='m')P[a[1]]=Math.max(0,(P[a[1]]||0)-q);else if(a[0]==='r'){P.rn=P.rn||{};P.rn[a[1]]=Math.max(0,(P.rn[a[1]]||0)-q)}else if(P.ow)delete P.ow[a[1]+':'+a[2]]}
function addIt(k,q){var P=pl(),a=k.split(':');if(!validKey(k))return;if(a[0]==='m')P[a[1]]=(P[a[1]]||0)+q;else if(a[0]==='r'){P.rn=P.rn||{};P.rn[a[1]]=(P.rn[a[1]]||0)+q}else{P.ow=P.ow||{};P.ow[a[1]+':'+a[2]]=true}}
function tradeDone(m){var P=pl(),sum=[];
  for(var k in m.give.it)takeIt(k,m.give.it[k]);P.gold=Math.max(0,(P.gold||0)-m.give.g);
  for(var k2 in m.get.it){addIt(k2,m.get.it[k2]);try{sum.push(D.itName(k2)+' ×'+m.get.it[k2])}catch(e){}}
  P.gold+=m.get.g;if(m.get.g)sum.push('🪙'+m.get.g);D.saveNow();S.tr=null;S.view=null;if(panelOn())closeP();
  say('🔄 Takas tamamlandı ('+m.fn+'): '+(sum.join(', ')||'karşılığında bir şey gelmedi')+'.');banner('🔄 Takas tamamlandı!',3500)}

/* ---------- sunucu mesajları ---------- */
function hand(m){
  switch(m.t){
    case 'fl':S.fr=m.fr||[];S.inn=m.in||[];S.bl=m.bl||[];re();return true;
    case 'rq':if(!S.inn.some(function(x){return x.rid===m.r.rid}))S.inn.push(m.r);reqToast(m.r);say('📨 '+m.r.fn+': '+rtext(m.r).replace(/<[^>]+>/g,''));re();return true;
    case 'pt':{var n0=S.pt&&S.pt.mem?S.pt.mem.length:0;S.pt=m.lead?m:null;var n1=m.mem?m.mem.length:0;if(n1>n0)say('🎉 Parti: '+n1+' kişi.');else if(n0>1&&n1<2)say('Parti dağıldı.');re();return true}
    case 'ct':if(m.id===S.myId&&!m.cg){S.cl=null;re()}return true;
    case 'cl':S.cl=m.c;if(m.c&&Net)Net.seed('k',m.c.msgs||[]);re();return true;
    case 'cok':addGold(-m.cost);say('🛡️ Klanını kurdun!');return true;
    case 'cdr':{if(!window.YH||!YH.valid(m.k))return true;if(m.a==='p'){YH.take(m.k,m.q);say('📦 Klan deposuna '+m.q+'× '+D.itName(m.k)+' koydun.')}else{if(m.k[0]==='w'&&YH.have(m.k)){say('Bu silahın zaten var; depoda kaldı.')}else{YH.put(m.k,m.q);say('📦 Depodan '+m.q+'× '+D.itName(m.k)+' aldın.')}}D.saveNow();re();return true}
    case 'cdok':addGold(-m.g);say('🪙'+m.g+' klan kasasına bağışlandı.');return true;
    case 'cs':S.cs=m.list;re();return true;
    case 'lb':S.lb=m;re();return true;
    case 'dm':{var k=m.k;S.dm[k]=(S.dm[k]||[]).concat([m.e]).slice(-40);var viewing=S.view&&S.view.t==='dm'&&S.view.k===k&&panelOn();
      if(m.e.f!==S.myPk){var f=S.fr.filter(function(x){return x.k===k})[0];if(!viewing){if(f)f.un=(f.un||0)+1;toast('💬 <b>'+esc(f?f.n:'Arkadaş')+'</b>: '+esc(m.e.m));say('💬 '+(f?f.n:'')+' (özel): '+m.e.m,'x')}else send({t:'dmh',k:k})}
      re();return true}
    case 'dmh':S.dm[m.k]=m.list;re();return true;
    case 'ds':duelStart(m);return true;
    case 'dh':duelHitMsg(m);return true;
    case 'de':duelEnd(m);return true;
    case 'ts':{var neu=!S.tr;S.tr=m;S.view={t:'trade'};if(neu||!panelOn()){D.openPan('p-soc')}render();return true}
    case 'td':tradeDone(m);return true;
    case 'tx':S.tr=null;S.view=null;if(m.m)say('🔄 '+m.m);if(panelOn())closeP();return true;
    case 'gok':addGold(-(m.g||S.gift));say('🎁 Hediye gönderildi (−🪙'+(m.g||S.gift)+').');return true;
    case 'gift':addGold(m.g);say('🎁 '+m.fn+' sana 🪙'+m.g+' hediye etti!');banner('🎁 '+m.fn+' sana 🪙'+m.g+' hediye etti!',5000);return true;
    case 'bellok':addGold(-BELL_COST);return true;
    case 'bell':banner('📣 '+m.n+': '+m.m,9000);say('📣 '+m.n+' (dünya çanı): '+m.m);return true;
    case 'pp':S.pings.push({x:m.x,y:m.y,n:m.n,t:0});say('📍 '+m.n+' seni çağırıyor!');return true;
    case 'em':if(Net)Net.bub(m.id,EM[m.e]||'👋');return true;
  }
  return false}
function tick(dt){if(Net&&(S.duel||S.tr)&&!Net.on()){if(S.duel){S.duel=null;duelBar();say('Bağlantı koptu, düello sona erdi.')}if(S.tr){S.tr=null;S.view=null;if(panelOn())closeP()}}for(var i=S.pings.length-1;i>=0;i--){S.pings[i].t+=dt;if(S.pings[i].t>9)S.pings.splice(i,1)}}
/* ---------- dünya çizimi ---------- */
function plate(o){var t=(o.cg?'['+o.cg+'] ':'')+o.n+' · Sv'+o.lv,c='#8fd6ff';
  if(S.duel&&S.duel.opp===o.id){c='#ff6b6b';t='⚔️ '+t}else if(inParty(o.id)){c='#7dff9b';t='🎉 '+t}else if(isFriend(o.k)){c='#ffb3d9';t='♥ '+t}
  return{t:t,c:c}}
function drawOther(ctx,o,x,y){if(S.duel&&S.duel.opp===o.id){var w=64;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(x-w/2-1,y-33,w+2,9);ctx.fillStyle='#ff5a5a';ctx.fillRect(x-w/2,y-32,w*S.duel.op/300,7)}}
function draw(ctx,camX,camY,t,W,H){
  var rx=Math.round(camX),ry=Math.round(camY);
  S.pings.forEach(function(p){var a=1-p.t/9,r=18+(p.t*60)%46;ctx.save();ctx.globalAlpha=Math.max(0,a);ctx.strokeStyle='#7dff9b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,r,0,6.28);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y,6,0,6.28);ctx.fillStyle='#7dff9b';ctx.fill();ctx.font='700 12px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('📍 '+p.n,p.x,p.y-26);ctx.restore()});
  if(S.pt&&S.pt.mem){var os=others();S.pt.mem.forEach(function(m){if(m.id===S.myId)return;var o=os[m.id];if(!o)return;var sx=o.dx-rx,sy=o.dy-ry;if(sx>24&&sx<W-24&&sy>24&&sy<H-24)return;
    var cx=Math.max(30,Math.min(W-30,sx)),cy=Math.max(96,Math.min(H-30,sy)),ang=Math.atan2(sy-H/2,sx-W/2);ctx.save();ctx.translate(cx+rx,cy+ry);ctx.rotate(ang);ctx.fillStyle='#7dff9b';ctx.strokeStyle='#0b2a14';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-8,-9);ctx.lineTo(-4,0);ctx.lineTo(-8,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.font='700 11px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.strokeStyle='#000';ctx.lineWidth=3;var tx=cx+rx-Math.cos(ang)*26,ty=cy+ry-Math.sin(ang)*26+4;ctx.strokeText(m.n,tx,ty);ctx.fillText(m.n,tx,ty);ctx.restore()})}
}
function xpMul(){var v=1;if(S.cl)v+=Math.max(0,(S.cl.lv||1)-1)*.01;if(S.pt&&S.pt.mem){var os=others(),n=S.pt.mem.filter(function(m){return m.id===S.myId||os[m.id]}).length;v+=.05*Math.max(0,n-1)}return v}
window.YSoc={openDepot:openDepot,init:init,leave:leave,onHi:onHi,hand:hand,tick:tick,draw:draw,plate:plate,drawOther:drawOther,xpMul:xpMul,duelOn:duelOn,duelHit:duelHit,blocked:function(k){return !!k&&S.bl.indexOf(k)>=0},inClan:function(){return !!S.cl},myClan:function(){return S.cl?S.cl.tag:''},inParty:function(){return !!(S.pt&&S.pt.mem&&S.pt.mem.length>1)},open:openP,wager:function(v){S.wager=+v||0},dbg:{S:function(){return S}}};
})();
