/* ---- giriş / kayıt / karakter oluşturma ---- */
(function(){
var P=$('entp'),EN=$('ent'),E={step:'login',err:'',busy:0,mail:'',pw:'',name:''};
var NAMES=['Kael','Aria','Torin','Selin','Bora','Lyra','Doruk','Elara','Mert','Nyx','Arda','Mira','Kaan','Zeyra','Taro','Defne','Orhun','Isra','Kuzey','Ayaz','Tuna','Vera','Alp','Sena'];
function ac(){try{return window.YXAcct&&YXAcct.state()}catch(e){return null}}
function conf(){try{return window.YXAcct&&YXAcct.conf()}catch(e){return false}}
function made(){return !!(S.made||S.lv>1||S.clsPick||S.maxF>1||(S.nick&&!/^Gezgin\d+$/.test(S.nick)))}
function ready(){return SKN.ready()}
function preview(on,off){window.__ent=on?1:0;var pw=P.offsetWidth||0;window.__entOff=on&&off&&pw?(pw/(2*innerWidth))*2*Math.tan(.575)*(innerWidth/innerHeight):0;document.body.classList.toggle('ent',true);EN.classList.toggle('pv',!!on);EN.classList.toggle('ctr',!on);
 if(on){pl.x=0;pl.z=40;started=false;window.__entYaw=0;S.arm=0}}
function steps(n){var s='<div class="st">';for(var i=0;i<5;i++)s+='<i'+(i<n?' class="on"':'')+'></i>';return s+'</div>'}
function nav(prev,next,nl){return '<div class="nv">'+(prev?'<button class="bt2" data-a="go" data-v="'+prev+'" type="button">← Geri</button>':'')+'<button class="bt" data-a="go" data-v="'+next+'" type="button">'+(nl||'İleri →')+'</button></div>'}
function sw(arr,cur,act,fn){var h='<div class="sw">';arr.forEach(function(c,i){h+='<button type="button" data-a="'+act+'" data-v="'+(fn?fn(c,i):i)+'" class="'+((fn?fn(c,i):i)==cur?'on':'')+'" style="background:'+c+'"></button>'});return h+'</div>'}
function toneCol(t){var b=t.s?[150,112,88]:[242,208,184];return 'rgb('+b.map(function(v,i){return Math.min(255,Math.round(v*t.t[i]))}).join(',')+')'}
var OCOLS=['','#c0392b','#2e6fd0','#2f8f4e','#8a4fd0','#2a2a2e','#d4a62a','#e8e8e8'];
function chips(list,cur,act){var h='<div class="sw">';list.forEach(function(o){h+='<button class="ch'+(String(cur)===String(o[0])?' on':'')+'" data-a="'+act+'" data-v="'+o[0]+'" type="button">'+o[1]+'</button>'});return h+'</div>'}
function render(){var a=appOf(),h='',pv=0;
 if(E.step==='login'){preview(0);
  var ac_=ac(),has=conf();
  h='<h1>YÜZ MÜHÜR</h1><div style="font:600 13px system-ui;color:#cdb994;letter-spacing:.2em">KADİM KULE</div><small style="max-width:420px">Denizden yükselen Kadim Kule\'nin yüz katı, yüz mühürle kapatılmış. Her katta bir muhafız bekliyor. Mührü kır, üst kata çık.</small>';
  if(ac_&&ac_.email){h+='<div class="cd on" style="width:min(360px,100%);text-align:center"><small>Giriş yapıldı</small><b>'+esc(ac_.email)+'</b></div><button class="bt" data-a="go" data-v="'+(made()?'welcome':'race')+'" type="button" style="width:min(360px,100%)">Devam →</button><button class="lk" data-a="out" type="button">Hesaptan çık</button>'}
  else{h+='<div style="width:min(360px,100%);display:flex;flex-direction:column;gap:8px">'+(has?'<input id="em" type="email" autocomplete="email" placeholder="E-posta" value="'+esc(E.mail)+'"><input id="pw" type="password" autocomplete="current-password" placeholder="Şifre (en az 6 karakter)"><div style="display:flex;gap:8px"><button class="bt" style="flex:1" data-a="in" type="button">Giriş yap</button><button class="bt2" style="flex:1" data-a="up" type="button">Kayıt ol</button></div><button class="lk" data-a="rs" type="button">Şifremi unuttum</button>':'<small>Hesap servisi şu an kullanılamıyor.</small>')+'<div class="err" id="er">'+esc(E.err)+'</div><button class="'+(has?'lk':'bt')+'" data-a="go" data-v="'+(made()?'welcome':'race')+'" type="button">'+(has?'Hesapsız (misafir) devam et':'Misafir olarak oyna')+'</button><small>Hesapla giriş yaparsan ilerlemen bulutta saklanır, Yaxest Diyarı ile aynı hesaptır.</small></div>'}
  h+='<div class="ld"><i id="ldb" style="width:'+(ready()?100:30)+'%"></i></div><small id="ldt">'+(ready()?'Hazır':'Modeller yükleniyor…')+'</small><small><a href="../" style="color:#9ad0ff">← Yaxest Diyarı</a> · Test sürümü (beta)</small>'}
 else if(E.step==='welcome'){preview(1,1);var c=CL[S.cls||'warrior'];
  h=steps(5)+'<h2>Tekrar hoş geldin</h2><div class="cd on"><b>'+esc(S.nick)+'</b><small>Seviye '+S.lv+' · '+c.i+' '+c.n+' · '+((RACES[a.race]||RACES.human).n)+' · Kat '+S.maxF+'</small></div><small>Karakteri sürükleyerek döndürebilirsin.</small><div class="nv"><button class="bt" data-a="start" type="button">Kuleye Gir ⚔️</button></div><button class="bt2" data-a="edit" type="button">🎨 Görünümü düzenle</button><button class="lk" data-a="go" data-v="login" type="button">Hesap / çıkış</button>'}
 else if(E.step==='race'){preview(1,1);var R0=RACES[a.race]||RACES.human;
  h=steps(1)+'<h2>Irk</h2><small>Irkın bedenini, boyunu ve küçük bonuslarını belirler.</small>';
  if(!R0.mdl)h+='<h3>Cinsiyet</h3><div class="g"><button class="cd'+(a.g==='m'?' on':'')+'" data-a="g" data-v="m" type="button"><b>♂ Erkek</b></button><button class="cd'+(a.g==='f'?' on':'')+'" data-a="g" data-v="f" type="button"><b>♀ Kadın</b></button></div>';
  h+='<h3>Irklar</h3><div class="g">';
  Object.keys(RACES).forEach(function(k){var r=RACES[k];h+='<button class="cd'+(a.race===k?' on':'')+'" data-a="race" data-v="'+k+'" type="button"><b>'+r.n+'</b><small>'+r.d+'</small><small style="color:#ffd98a;opacity:1">'+r.bt+'</small></button>'});
  h+='</div>'+nav('login','look')}
 else if(E.step==='look'){preview(1,1);var R1=RACES[a.race]||RACES.human,hum=!(R1.mdl||a.race==='elf'||a.race==='orc');
  h=steps(2)+'<h2>Yüz ve ten</h2><h3>Ten rengi</h3>'+sw(TONES.map(toneCol),a.tone,'tone');
  if(hum){h+='<h3>Saç</h3>'+chips(HAIRS.map(function(x){return[x[0],x[1]]}),a.hair,'hair')+'<h3>Saç rengi</h3>'+sw(HCOLS,a.hc,'hc',function(c){return c});
   if(a.g==='m'&&a.race!=='dwarf')h+='<h3>Sakal</h3>'+chips([['0','Yok'],['1','Sakallı']],String(a.beard?1:0),'beard');else if(a.race==='dwarf')h+='<small>Cüceler her zaman sakallıdır.</small>'}
  else h+='<small>Bu ırkın yüzü ve saçı kendi modelinden gelir; ten tonu rengi hafifçe değiştirir.</small>';
  h+=(E.edit?nav('race','outfit'):nav('race','outfit'))}
 else if(E.step==='outfit'){preview(1,1);var R2=RACES[a.race]||RACES.human,hum2=!R2.mdl,OP=[['peasant','Köylü'],['ranger','Korucu']];
  h=steps(3)+'<h2>Kıyafet</h2>';
  if(hum2){h+='<h3>Üst</h3>'+chips(OP,a.top||a.outfit||'peasant','top')+'<h3>Alt</h3>'+chips(OP,a.legs||a.outfit||'peasant','legs')+'<h3>Ayakkabı</h3>'+chips(OP,a.feet||a.outfit||'peasant','feet')+'<h3>Doku</h3>'+chips([['0','Açık'],['1','Koyu']],String(a.ov|0),'ov')+'<h3>Kıyafet rengi</h3>'+sw(OCOLS.map(function(c){return c||'#9a8a7a'}),a.oc||'','oc',function(c,i){return OCOLS[i]})+'<h3>Aksesuar</h3><div class="sw">'+[['hood','Kukuleta'],['paul','Omuzluk'],['belt','Kemer'],['brac','Bileklik']].map(function(o){var on=o[0]==='belt'||o[0]==='brac'?(a[o[0]]==null?(a.top||a.outfit)==='ranger':!!a[o[0]]):!!a[o[0]];return '<button class="ch'+(on?' on':'')+'" data-a="tog" data-v="'+o[0]+'" type="button">'+o[1]+'</button>'}).join('')+'</div>'}
  else h+='<small>'+R2.n+' ırkı çıplak derisiyle ve kendi doğal görünümüyle oynanır; kıyafet seçenekleri insan, elf, ork ve cücede vardır.</small>';
  h+=(E.edit?nav('look','welcome','Kaydet ✔'):nav('look','cls'))}
 else if(E.step==='cls'){preview(1,1);var cc=S.cls||'';
  h=steps(4)+'<h2>Sınıf</h2><small>Hamlelerini, silahını ve oyun tarzını belirler. Oyunda 300 🪙 karşılığı değiştirilebilir.</small><div class="g">';
  Object.keys(CL).forEach(function(k){var c=CL[k];h+='<button class="cd'+(cc===k?' on':'')+'" data-a="cls" data-v="'+k+'" type="button"><b>'+c.i+' '+c.n+'</b><small>'+c.d+'</small></button>'});
  h+='</div>';if(cc){var c=CL[cc];h+='<div class="cd on" style="width:100%"><b>'+c.i+' '+c.n+'</b><small>Q: '+c.q[2]+'<br>E: '+c.e[2]+'<br>R: '+c.r[2]+'</small></div>'}
  h+=nav('outfit','name',cc?'İleri →':'Bir sınıf seç')}
 else if(E.step==='name'){preview(1,1);var nm=E.name||(S.nick&&!/^Gezgin\d+$/.test(S.nick)?S.nick:'');
  h=steps(5)+'<h2>İsim</h2><small>3–16 karakter: harf, rakam, boşluk, alt çizgi. Çok oyunculu dünyada bu isimle görünürsün.</small><div style="display:flex;gap:8px"><input id="nm" type="text" maxlength="16" placeholder="Karakter adı" value="'+esc(nm)+'"><button class="bt2" data-a="dice" type="button" title="Rastgele">🎲</button></div><div class="err" id="er">'+esc(E.err)+'</div>'+(E.busy?'<small>Kontrol ediliyor…</small>':'')+nav('cls','fin','Maceraya Başla ⚔️')}
 P.innerHTML=h;
 if(E.step==='cls'&&!S.cls){var b=P.querySelector('.nv .bt');if(b){b.dataset.a='noop'}}
}
function say_(t){E.err=t;var e=$('er');if(e)e.textContent=t}
function mailv(){var e=$('em'),p=$('pw');if(e)E.mail=e.value.trim();E.pw=p?p.value:''}
function afterLogin(){load();recalc();E.err='';E.step=made()?'welcome':'race';if(E.step==='welcome'&&!S.cls)S.cls='warrior';render()}
function fin(){var el=$('nm'),n=((el&&el.value)||'').trim().replace(/\s+/g,' ');E.name=n;
 if(!/^[A-Za-zÇĞİÖŞÜçğıöşü0-9_ ]{3,16}$/.test(n)){say_('İsim 3–16 karakter olmalı (harf, rakam, boşluk, _).');return}
 var a=ac();
 function done(){S.nick=n;S.made=1;S.clsPick=1;if(!S.cls)S.cls='warrior';recalc();pl.hp=pl.mhp;pl.st=pl.mst;save();start()}
 if(a&&a.uid&&window.YXAcct&&YXAcct.claimNick){E.busy=1;render();YXAcct.claimNick(n).then(function(r){E.busy=0;if(r.ok){done()}else{E.err=r.why==='taken'?'Bu isim alınmış, başka bir isim dene.':r.why==='reserved'?'Bu isim ayrılmış.':'Bağlantı sorunu, tekrar dene.';render()}})}
 else done()}
function start(){window.__entSpin=0;pl.x=0;pl.z=9;window.__ent=0;window.__entYaw=null;document.body.classList.remove('ent');EN.classList.remove('on','pv');pl.yaw=0;cam.yaw=0;cam.pit=-.1;$('go').style.display='flex';$('gob').onclick()}
P.addEventListener('click',function(ev){var t=ev.target.closest('[data-a]');if(!t)return;var a=t.dataset.a,v=t.dataset.v;
 if(a==='go'){mailv();E.err='';if(v==='welcome'){E.edit=0;save()}if(v==='name'&&!S.cls)return;E.step=v;if(v==='fin'){E.step='name';fin();return}render();return}
 if(a==='start'){start();return}
 if(a==='edit'){E.edit=1;E.step='race';render();return}
 if(a==='noop')return;
 if(a==='in'||a==='up'){mailv();if(!/^\S+@\S+\.\S+$/.test(E.mail)){say_('Geçerli bir e-posta yaz.');return}if(E.pw.length<6){say_('Şifre en az 6 karakter olmalı.');return}
  say_('Bağlanıyor…');var f=a==='in'?YXAcct.signIn:YXAcct.signUp;f(E.mail,E.pw).then(function(){E.pw='';afterLogin()},function(e){say_(e&&e.msg||'Bir sorun oluştu.')});return}
 if(a==='rs'){mailv();if(!E.mail){say_('Önce e-postanı yaz.');return}YXAcct.reset(E.mail).then(function(){say_('Sıfırlama e-postası gönderildi.')},function(e){say_(e&&e.msg||'Gönderilemedi.')});return}
 if(a==='out'){try{YXAcct.signOut()}catch(e){}render();return}
 var ap=Object.assign({},S.app||{});
 if(a==='g'){ap.g=v;if(v==='f'&&ap.beard)ap.beard=0;if(v==='f'&&ap.hair==='Hair_Buzzed')ap.hair='Hair_BuzzedFemale';if(v==='m'&&ap.hair==='Hair_BuzzedFemale')ap.hair='Hair_Buzzed'}
 else if(a==='race'){ap.race=v;if(RACES[v]&&RACES[v].mdl)ap.g='m';if(v==='dwarf'&&ap.g==='m')ap.beard=1}
 else if(a==='tone')ap.tone=+v;else if(a==='hair')ap.hair=v;else if(a==='hc')ap.hc=v;else if(a==='beard')ap.beard=+v;
 else if(a==='top')ap.top=v;else if(a==='legs')ap.legs=v;else if(a==='feet')ap.feet=v;else if(a==='ov')ap.ov=+v;else if(a==='oc')ap.oc=v;
 else if(a==='tog'){var cu=ap[v];if(v==='belt'||v==='brac')cu=cu==null?(ap.top||ap.outfit)==='ranger':!!cu;ap[v]=cu?0:1}
 else if(a==='cls'){S.cls=v;recalc();render();snd('pick');return}
 else if(a==='dice'){var nn=NAMES[Math.floor(Math.random()*NAMES.length)]+NAMES[Math.floor(Math.random()*NAMES.length)].toLowerCase()+(Math.random()<.4?Math.floor(Math.random()*90+10):'');E.name=nn.slice(0,16);render();return}
 else return;
 S.app=Object.assign({},APP0,ap);recalc();render()});
P.addEventListener('keydown',function(ev){if(ev.key==='Enter'){var t=ev.target;if(t.id==='nm')fin();else if(t.id==='pw'||t.id==='em'){var b=P.querySelector('[data-a=in]');if(b)b.click()}}});
P.addEventListener('input',function(ev){if(ev.target.id==='nm')E.name=ev.target.value});
/* sürükleyerek döndür */
var dg=null;EN.addEventListener('pointerdown',function(ev){if(ev.target.closest('.pn'))return;dg=ev.clientX});window.addEventListener('pointerup',function(){dg=null});
window.addEventListener('pointermove',function(ev){if(dg==null||!window.__ent)return;window.__entSpin=(window.__entSpin||0)+(ev.clientX-dg)*.012;dg=ev.clientX});
/* başlat */
$('go').style.display='none';EN.classList.add('on');document.body.classList.add('ent');
if(ac()&&ac().email&&made()){E.step='welcome'}
render();
var rt=setInterval(function(){if(ready()){var b=$('ldb'),t=$('ldt');if(b)b.style.width='100%';if(t)t.textContent='Hazır';if(!EN.classList.contains('on'))clearInterval(rt)}},400);
addEventListener('resize',function(){if(EN.classList.contains('on'))render()});
window.__entApi={render:render,get step(){return E.step},set step(v){E.step=v;render()}};
})();
window.__onKB=function(){if(WORLD==='town')buildTown()};if(window.__kbReady)window.__onKB();

