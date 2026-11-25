/* Yaxest Moda: arayüz, oyun mantığı, Moda Şovu. */
(function(){
'use strict';
var YM=window.YM,U=YM.u,CAT=YM.CAT,$=function(i){return document.getElementById(i)};
function ls(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}}
function lsw(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function sfx(n){try{window.YS&&YS.play(n)}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var COLS=[['#ff5c8a','Pembe'],['#ff8fb8','Açık pembe'],['#e63946','Kırmızı'],['#ff8a3d','Turuncu'],['#ffd23f','Sarı'],['#7ddc7a','Yeşil'],['#2fbf9b','Nane'],['#4cc9f0','Turkuaz'],['#4f7cff','Mavi'],['#8a5cf6','Mor'],['#c9a7ff','Lila'],['#ffffff','Beyaz'],['#2d2a3e','Siyah'],['#a0522d','Kahve'],['#f4d9b0','Krem'],['#9aa3b5','Gri']];
var DEFC={taci:'#ffd23f',inci:'#fffaf2',hasir:'#ff5c8a',kedi:'#2d2a3e',yuvarlak:'#ff5c8a',gunes:'#2d2a3e',kalp:'#ff8fb8',yildizg:'#ffd23f',halka:'#ffd23f',incik:'#fffaf2',yildizk:'#ffd23f',kalpkup:'#ff5c8a',damla:'#4cc9f0',peri:'#c9a7ff',melek:'#ffffff',kelebek:'#ff8fb8',pelerin:'#e63946',degnek:'#ffd23f',gul:'#e63946',balon:'#ff5c8a',dondurma:'#ff8fb8',canta:'#e63946',kalpc:'#ff8fb8',sepet:'#ffd23f',poset:'#ff8fb8',spor:'#ffffff',topuklu:'#e63946',bot:'#a0522d',babet:'#ff8fb8',sandalet:'#ffd23f',cizme:'#a0522d',paten:'#ffffff',kot:'#4f7cff',bere:'#ff5c8a',fiyonk:'#ff5c8a',cicek:'#ff5c8a',yildiz:'#ffd23f',kalpk:'#ff5c8a',gerdan:'#2d2a3e',fular:'#e63946'};
var DEFS={top:'#ff8fb8',bottom:'#4f7cff',dress:'#ff5c8a',shoes:'#ffffff',hat:'#ffd23f',glasses:'#2d2a3e',neck:'#ffffff',ear:'#ffd23f',bag:'#e63946',back:'#c9a7ff',hand:'#ffd23f'};
var SLOTN={top:'Üst',bottom:'Alt',dress:'Elbise',shoes:'Ayakkabı',hat:'Şapka',glasses:'Gözlük',neck:'Kolye',ear:'Küpe',bag:'Çanta',back:'Sırt',hand:'El'};
var ACC=['hat','glasses','neck','ear','bag','back','hand'];
var TABS=[['guzel','💄','Güzellik'],['sac','💇‍♀️','Saç'],['top','👚','Üst'],['bottom','👖','Alt'],['dress','👗','Elbise'],['shoes','👠','Ayakkabı'],['acc','💍','Aksesuar'],['sahne','🌆','Sahne']];
var st=ls('ym-cur',null);var def=YM.defState();if(!st||!st.items||typeof st.hair!=='number')st=def;
['skin','eyeT','brow','lipT','lash','fr','mole','stk','hair','pose','bg'].forEach(function(k){if(typeof st[k]!=='number')st[k]=def[k]});if(!st.eyeC)st.eyeC=def.eyeC;if(!st.lipC)st.lipC=def.lipC;if(!st.hairC)st.hairC=def.hairC;if(!st.tieC)st.tieC=def.tieC;if(!st.items)st.items={};
var own=ls('ym-own',{}),tab='guzel',accSlot='hat',curShow=null,parts=[],paused=false,flash=0,walk=null;
function saveCur(){lsw('ym-cur',st)}
/* ---- tuval ---- */
var cv=$('cv'),cx=cv.getContext('2d'),R=1.2;cv.width=600*R;cv.height=900*R;
function burst(x,y,n){for(var i=0;i<(n||14);i++){var a=Math.random()*6.28,s=40+Math.random()*120;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-40,l:1,c:['#fff','#ffd23f','#ff8fb8','#c9a7ff','#7cc6ff'][i%5],r:4+Math.random()*7})}}
var POS={hat:[300,60],glasses:[300,152],neck:[300,270],ear:[240,180],top:[300,330],bottom:[300,500],dress:[300,480],shoes:[300,800],bag:[210,470],back:[300,300],hand:[390,440],hair:[300,120],guzel:[300,190],sahne:[300,450]};
var last=0;
function frame(ts){requestAnimationFrame(frame);if(document.hidden||window.YMENU)return;if(ts-last<30)return;var dt=Math.min(.1,(ts-last)/1000);last=ts;var t=ts/1000;
 cx.setTransform(R,0,0,R,0,0);cx.clearRect(0,0,600,900);
 var s=1,oy=0;
 if(walk){var p=Math.min(1,(ts-walk.t0)/walk.d);var e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;s=.72+.28*e;oy=(1-e)*120;cx.save();cx.translate(300,820);cx.scale(s,s);cx.translate(-300,-820+oy);
  if(Math.floor(p*14)%2===0&&p<.9&&Math.sin(p*80)>.8)flash=.5;if(p>=1&&!walk.done){walk.done=1;setTimeout(walk.cb,200)}}
 YM.render(cx,st,t);if(walk)cx.restore();
 for(var i=parts.length-1;i>=0;i--){var q=parts[i];q.l-=dt*1.4;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=120*dt;if(q.l<=0){parts.splice(i,1);continue}YM.sparkle(cx,q.x,q.y,q.r*q.l+1,q.c,Math.min(1,q.l*1.6))}
 if(flash>0){cx.fillStyle='rgba(255,255,255,'+flash+')';cx.fillRect(0,0,600,900);flash-=dt*3}}
requestAnimationFrame(frame);
/* ---- küçük resimler ---- */
function stubState(){var s=JSON.parse(JSON.stringify(st));s.items={};return s}
function thumb(kind,slot,it,col,pat,sz){var cvs=document.createElement('canvas');sz=sz||76;cvs.width=cvs.height=sz*2;var c=cvs.getContext('2d');c.scale(2,2);
 try{
  if(kind==='bg'){c.save();c.beginPath();c.rect(0,0,sz,sz);c.clip();var s=sz/600;c.scale(s,s);c.translate(0,-120);it.draw(c,1.3);c.restore()}
  else if(kind==='hair'){var v=[170,10,260,300],s=Math.min(sz/v[2],sz/v[3]);c.translate((sz-v[2]*s)/2,(sz-v[3]*s)/2);c.scale(s,s);c.translate(-v[0],-v[1]);var tmp=JSON.parse(JSON.stringify(st));tmp.hair=it;tmp.items={};
   YM.HAIR[it].back&&YM.HAIR[it].back(c,tmp,0);c.beginPath();c.ellipse(300,150,62,76,0,0,6.3);c.fillStyle=U.hx(U.rgb(YM.lists.skin[st.skin][0]));c.fill();c.lineWidth=3;c.strokeStyle=YM.OL;c.stroke();YM.HAIR[it].front&&YM.HAIR[it].front(c,tmp,0)}
  else{var v2=it.view||[150,250,300,300],s2=Math.min(sz/v2[2],sz/v2[3])*.92;c.translate((sz-v2[2]*s2)/2,(sz-v2[3]*s2)/2);c.scale(s2,s2);c.translate(-v2[0],-v2[1]);var X={t:0,arms:{L:YM.poses[0].L,R:YM.poses[0].R},st:st};
   if(slot==='shoes'||slot==='bottom'||slot==='dress'||slot==='top'){}
   it.draw(c,col,pat,X)}
 }catch(e){}
 return cvs}
/* ---- giyim ---- */
function ownedOk(slot,it){return !it.price||own[slot+':'+it.id]}
function equip(slot,id,c,p){
 if(!id){delete st.items[slot];if(slot==='top'||slot==='bottom'){}}
 else{var prev=st.items[slot],col=c||(prev&&prev.id!==id&&prev.c)||DEFC[id]||DEFS[slot],pat=p||(prev&&prev.p)||'plain';st.items[slot]={id:id,c:col,p:pat};
  if(slot==='dress'){delete st.items.top;delete st.items.bottom}if((slot==='top'||slot==='bottom')&&st.items.dress)delete st.items.dress}
 if(id){burst(POS[slot][0],POS[slot][1],12);sfx('pop')}else sfx('tap');saveCur();render()}
function wornList(){var out=[];['dress','top','bottom','shoes'].concat(ACC).forEach(function(s){var w=st.items[s];if(w){var it=YM.item(s,w.id);if(it)out.push({slot:s,it:it,c:w.c,p:w.p})}});return out}
function lockedWorn(){return wornList().filter(function(w){return !ownedOk(w.slot,w.it)})}
function needUnlock(cb){var L=lockedWorn();if(!L.length)return cb();var tot=L.reduce(function(a,w){return a+w.it.price},0);
 modal('<h3>🔒 Kilitli parçalar</h3><p>Şunları denedin ama henüz senin değil:</p><ul class="ml">'+L.map(function(w){return'<li>'+esc(w.it.n)+' <b>'+w.it.price+' 🪙</b></li>'}).join('')+'</ul><div class="btns"><button class="b p" id="mb1">Hepsini al ('+tot+' 🪙)</button><button class="b" id="mb2">Kilitlileri çıkar</button></div>',function(){
  $('mb1').onclick=function(){if(spend(tot)){L.forEach(function(w){own[w.slot+':'+w.it.id]=1});lsw('ym-own',own);closeModal();sfx('good');buildPanel();cb()}else toast('Jetonun yetmiyor. Oynayarak jeton kazanabilirsin.')};
  $('mb2').onclick=function(){L.forEach(function(w){delete st.items[w.slot]});saveCur();closeModal();render();buildPanel();cb()}})}
function coins(){try{return window.YX?YX.coins():0}catch(e){return 0}}
function spend(n){try{return window.YX&&YX.spend(n)}catch(e){return false}}
function buyItem(slot,it){if(coins()<it.price){toast('Jetonun yetmiyor ('+it.price+' 🪙 gerekli).');return}
 modal('<h3>'+esc(it.n)+'</h3><p>Bu parçayı <b>'+it.price+' 🪙</b> karşılığında kalıcı olarak alırsın.</p><div class="btns"><button class="b p" id="mb1">Satın al</button><button class="b" id="mb2">Vazgeç</button></div>',function(){
  $('mb1').onclick=function(){if(spend(it.price)){own[slot+':'+it.id]=1;lsw('ym-own',own);closeModal();sfx('gem');burst(300,400,22);buildPanel();updCoins()}else toast('Jetonun yetmiyor.')};$('mb2').onclick=closeModal})}
/* ---- panel ---- */
var pn=$('pn');
function sw(list,cur,fn,opt){opt=opt||{};var d=document.createElement('div');d.className='sw';list.forEach(function(c){var col=Array.isArray(c)?c[0]:c,nm=Array.isArray(c)?c[1]:'',b=document.createElement('button');b.className='dot'+(col===cur?' on':'');b.style.background=col||'repeating-linear-gradient(45deg,#fff,#fff 4px,#f3c 4px,#f3c 6px)';b.title=nm;b.setAttribute('aria-label',nm||'renk');if(col&&U.lum(col)>235)b.style.boxShadow='inset 0 0 0 2px #e2cfe8';b.onclick=function(){fn(col);sfx('tap')};d.appendChild(b)});return d}
function chips(list,cur,fn){var d=document.createElement('div');d.className='chips';list.forEach(function(n,i){var b=document.createElement('button');b.className='chip'+(i===cur?' on':'');b.textContent=n;b.onclick=function(){fn(i);sfx('tap')};d.appendChild(b)});return d}
function sec(title,node){var s=document.createElement('div');s.className='sec';var h=document.createElement('h4');h.textContent=title;s.appendChild(h);if(node)s.appendChild(node);pn.appendChild(s);return s}
function cardGrid(items,cur,mk,none){var g=document.createElement('div');g.className='grid';if(none){var n=document.createElement('button');n.className='card'+(!cur?' on':'');n.innerHTML='<div class="th no">✖</div><span>Çıkar</span>';n.onclick=none;g.appendChild(n)}
 items.forEach(function(it,i){var b=mk(it,i);g.appendChild(b)});return g}
function clothesPanel(slot){var list=CAT[slot],cur=st.items[slot];
 var g=cardGrid(list,cur,function(it){var w=st.items[slot],col=(w&&w.id===it.id?w.c:null)||(w&&w.c)||DEFC[it.id]||DEFS[slot],pat=(w&&w.p)||'plain',b=document.createElement('button');b.className='card'+(w&&w.id===it.id?' on':'');var lk=!ownedOk(slot,it);
  var th=document.createElement('div');th.className='th';th.appendChild(thumb('item',slot,it,col,pat));b.appendChild(th);var sp=document.createElement('span');sp.textContent=it.n;b.appendChild(sp);
  if(lk){var l=document.createElement('i');l.className='lk';l.textContent='🔒 '+it.price;b.appendChild(l)}
  b.onclick=function(){equip(slot,it.id);buildPanel()};if(lk){var bb=document.createElement('u');bb.className='buy';bb.textContent='Al';bb.onclick=function(e){e.stopPropagation();buyItem(slot,it)};b.appendChild(bb)}return b},function(){equip(slot,null);buildPanel()});
 sec(slot==='dress'?'Elbise (üst ve alt yerine geçer)':SLOTN[slot],g);
 if(cur){sec('Renk',sw(COLS,cur.c,function(c){st.items[slot].c=c;saveCur();render();refreshThumbs(slot)}));
  sec('Desen',(function(){var d=document.createElement('div');d.className='chips';YM.pats.forEach(function(p){var b=document.createElement('button');b.className='chip'+(cur.p===p[0]?' on':'');b.textContent=p[1];b.onclick=function(){st.items[slot].p=p[0];saveCur();render();refreshThumbs(slot);sfx('tap')};d.appendChild(b)});return d})())}
 var hint=document.createElement('p');hint.className='hint';hint.textContent='🔒 Kilitli parçaları önce dene, beğenirsen jetonla al.';if(list.some(function(i){return i.price}))pn.appendChild(hint)}
function refreshThumbs(slot){var cards=pn.querySelectorAll('.card');var list=CAT[slot],w=st.items[slot];if(!list)return;var k=0;cards.forEach(function(cd){var th=cd.querySelector('.th:not(.no)');if(!th)return;var it=list[k++];if(!it)return;th.innerHTML='';th.appendChild(thumb('item',slot,it,(w&&w.c)||DEFC[it.id]||DEFS[slot],(w&&w.p)||'plain'))})}
function buildPanel(){pn.innerHTML='';
 if(tab==='guzel'){
  sec('Cilt tonu',sw(YM.lists.skin,YM.lists.skin[st.skin][0],function(c){st.skin=YM.lists.skin.findIndex(function(s){return s[0]===c});saveCur();render();buildPanel()}));
  sec('Göz rengi',sw(YM.lists.eyeC,st.eyeC,function(c){st.eyeC=c;saveCur();render();buildPanel()}));
  sec('Göz şekli',chips(YM.lists.eyeT,st.eyeT,function(i){st.eyeT=i;saveCur();render();buildPanel()}));
  sec('Kirpik',chips(['Yok','Doğal','Uzun'],st.lash,function(i){st.lash=i;saveCur();render();buildPanel()}));
  sec('Kaş',chips(YM.lists.brow,st.brow,function(i){st.brow=i;saveCur();render();buildPanel()}));
  sec('Ruj rengi',sw(YM.lists.lipC,st.lipC,function(c){st.lipC=c;saveCur();render();burst(300,200,8);buildPanel()}));
  sec('Gülüş',chips(YM.lists.lipT,st.lipT,function(i){st.lipT=i;saveCur();render();buildPanel()}));
  sec('Far',sw([[null,'Yok']].concat(YM.lists.shadow),st.shadow,function(c){st.shadow=c;saveCur();render();burst(300,150,8);buildPanel()}));
  sec('Allık',sw([[null,'Yok']].concat(YM.lists.blush),st.blush,function(c){st.blush=c;saveCur();render();burst(300,180,8);buildPanel()}));
  sec('Süsler',(function(){var d=document.createElement('div');d.className='chips';[['Çil','fr'],['Ben','mole']].forEach(function(a){var b=document.createElement('button');b.className='chip'+(st[a[1]]?' on':'');b.textContent=a[0];b.onclick=function(){st[a[1]]=st[a[1]]?0:1;saveCur();render();buildPanel()};d.appendChild(b)});['Çıkartma yok','💗 Kalp','⭐ Yıldız','✨ Parıltı'].forEach(function(n,i){var b=document.createElement('button');b.className='chip'+(st.stk===i?' on':'');b.textContent=n;b.onclick=function(){st.stk=i;saveCur();render();buildPanel()};d.appendChild(b)});return d})())}
 else if(tab==='sac'){
  var g=document.createElement('div');g.className='grid';YM.HAIR.forEach(function(h,i){var b=document.createElement('button');b.className='card'+(st.hair===i?' on':'');var th=document.createElement('div');th.className='th';th.appendChild(thumb('hair',null,i));b.appendChild(th);var sp=document.createElement('span');sp.textContent=h.n;b.appendChild(sp);b.onclick=function(){st.hair=i;burst(300,100,12);sfx('pop');saveCur();render();buildPanel()};g.appendChild(b)});sec('Saç modeli',g);
  sec('Saç rengi',sw(YM.lists.hairC,st.hairC,function(c){st.hairC=c;saveCur();render();buildPanel()}));
  sec('Uç rengi (ombre)',sw(YM.lists.tipC,st.tipC,function(c){st.tipC=c;saveCur();render();buildPanel()}));
  sec('Toka / fiyonk rengi',sw(COLS,st.tieC,function(c){st.tieC=c;saveCur();render();buildPanel()}))}
 else if(tab==='acc'){
  var row=document.createElement('div');row.className='chips sub';ACC.forEach(function(s){var b=document.createElement('button');b.className='chip'+(accSlot===s?' on':'');b.textContent=SLOTN[s]+(st.items[s]?' ✓':'');b.onclick=function(){accSlot=s;buildPanel()};row.appendChild(b)});pn.appendChild(row);clothesPanel(accSlot)}
 else if(tab==='sahne'){
  var g2=document.createElement('div');g2.className='grid';YM.BG.forEach(function(b0,i){var b=document.createElement('button');b.className='card'+(st.bg===i?' on':'');var th=document.createElement('div');th.className='th';th.appendChild(thumb('bg',null,b0));b.appendChild(th);var sp=document.createElement('span');sp.textContent=b0.n;b.appendChild(sp);b.onclick=function(){st.bg=i;sfx('pop');saveCur();render();buildPanel()};g2.appendChild(b)});sec('Arka plan',g2);
  sec('Poz',chips(YM.poses.map(function(p){return p.n}),st.pose,function(i){st.pose=i;saveCur();render();buildPanel()}))}
 else clothesPanel(tab);
 var tb=$('tabs');tb.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.dataset.t===tab)})}
function render(){}
(function(){var tb=$('tabs');TABS.forEach(function(t){var b=document.createElement('button');b.dataset.t=t[0];b.innerHTML='<span>'+t[1]+'</span><small>'+t[2]+'</small>';b.onclick=function(){tab=t[0];sfx('tap');buildPanel();pn.scrollTop=0;burst(POS[t[0]]?POS[t[0]][0]:300,POS[t[0]]?POS[t[0]][1]:300,6)};tb.appendChild(b)})})();
/* ---- ortak arayüz ---- */
function toast(m){var t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove('on')},2400)}
function modal(html,after){var m=$('modal');m.innerHTML='<div class="mbox">'+html+'</div>';m.classList.add('on');if(after)after()}
function closeModal(){$('modal').classList.remove('on')}
$('modal').addEventListener('click',function(e){if(e.target===this)closeModal()});
function updCoins(){$('coins').textContent=coins()}setInterval(updCoins,1200);updCoins();
/* ---- şans ---- */
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function randomLook(){var items={};var dress=Math.random()<.3;
 function put(s,p){var l=CAT[s].filter(function(i){return ownedOk(s,i)});if(!l.length)return;var it=pick(l);items[s]={id:it.id,c:pick(COLS)[0],p:Math.random()<.3?pick(YM.pats)[0]:'plain'}}
 if(dress)put('dress');else{put('top');put('bottom')}put('shoes');ACC.forEach(function(s){if(Math.random()<.45)put(s)});
 st.items=items;st.hair=Math.floor(Math.random()*YM.HAIR.length);st.hairC=pick(YM.lists.hairC)[0];st.tipC=Math.random()<.3?pick(YM.lists.tipC)[0]:null;st.lipC=pick(YM.lists.lipC)[0];st.shadow=Math.random()<.6?pick(YM.lists.shadow)[0]:null;st.blush=Math.random()<.6?pick(YM.lists.blush)[0]:null;st.eyeC=pick(YM.lists.eyeC)[0];st.eyeT=Math.floor(Math.random()*4);st.lipT=Math.floor(Math.random()*4);st.bg=Math.floor(Math.random()*YM.BG.length);st.pose=Math.floor(Math.random()*YM.poses.length);
 saveCur();buildPanel();burst(300,400,26);sfx('gem')}
$('bRand').onclick=randomLook;
$('bReset').onclick=function(){modal('<h3>Sıfırla?</h3><p>Şu anki görünümün silinir (kayıtlı gardırobuna dokunulmaz).</p><div class="btns"><button class="b p" id="mb1">Sıfırla</button><button class="b" id="mb2">Vazgeç</button></div>',function(){$('mb1').onclick=function(){st=YM.defState();saveCur();closeModal();buildPanel();sfx('tap')};$('mb2').onclick=closeModal})};
/* ---- gardırop ---- */
function snap(w,h,noBg){var o=document.createElement('canvas');o.width=w;o.height=h;var c=o.getContext('2d');c.scale(w/600,h/900);if(noBg){c.fillStyle='#ffe3f0';c.fillRect(0,0,600,900)}YM.render(c,st,1.3);return o}
$('bWard').onclick=function(){openWard()};
function openWard(){var W=ls('ym-wd',[null,null,null,null,null,null]);var h='<h3>💾 Gardırobum</h3><div class="wd">';
 for(var i=0;i<6;i++){var s=W[i];h+='<div class="ws">'+(s?'<img src="'+s.img+'" alt="Kayıtlı görünüm '+(i+1)+'"><div class="wb"><button class="b p" data-l="'+i+'">Giy</button><button class="b" data-s="'+i+'">Üzerine kaydet</button><button class="b x" data-d="'+i+'">Sil</button></div>':'<div class="we">Boş</div><div class="wb"><button class="b p" data-s="'+i+'">Buraya kaydet</button></div>')+'</div>'}
 h+='</div><div class="btns"><button class="b" id="mb2">Kapat</button></div>';modal(h,function(){$('mb2').onclick=closeModal;$('modal').querySelectorAll('[data-s]').forEach(function(b){b.onclick=function(){var i=+b.dataset.s,W2=ls('ym-wd',[null,null,null,null,null,null]);W2[i]={st:JSON.parse(JSON.stringify(st)),img:snap(120,180,1).toDataURL('image/jpeg',.8)};lsw('ym-wd',W2);sfx('good');toast('Kaydedildi!');openWard()}});
  $('modal').querySelectorAll('[data-l]').forEach(function(b){b.onclick=function(){var s=ls('ym-wd',[])[+b.dataset.l];if(s){st=s.st;saveCur();closeModal();buildPanel();burst(300,400,24);sfx('win')}}});
  $('modal').querySelectorAll('[data-d]').forEach(function(b){b.onclick=function(){var W2=ls('ym-wd',[]);W2[+b.dataset.d]=null;lsw('ym-wd',W2);openWard()}})})}
/* ---- fotoğraf ---- */
$('bPhoto').onclick=function(){needUnlock(photo)};
function photo(extra){var o=document.createElement('canvas');o.width=900;o.height=1350;var c=o.getContext('2d');c.scale(1.5,1.5);YM.render(c,st,1.3);c.setTransform(1,0,0,1,0,0);
 c.fillStyle='rgba(255,255,255,.85)';c.fillRect(0,1280,900,70);c.fillStyle='#4a2340';c.font='800 30px system-ui,sans-serif';c.textAlign='left';c.fillText('👗 Yaxest Moda',30,1325);c.textAlign='right';c.font='600 24px system-ui,sans-serif';c.fillText(extra||'yaxestgames.com',870,1324);
 o.toBlob(function(b){if(!b){toast('Fotoğraf oluşturulamadı');return}var url=URL.createObjectURL(b);sfx('win');flash=.8;
  modal('<h3>📸 Fotoğraf hazır!</h3><img class="ph" src="'+url+'" alt="Moda fotoğrafın"><div class="btns"><button class="b p" id="mb1">Kaydet</button><button class="b" id="mb3">Paylaş</button><button class="b" id="mb2">Kapat</button></div>',function(){$('mb2').onclick=closeModal;
   $('mb1').onclick=function(){var a=document.createElement('a');a.href=url;a.download='yaxest-moda.png';document.body.appendChild(a);a.click();a.remove()};
   $('mb3').onclick=function(){try{var f=new File([b],'yaxest-moda.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'Yaxest Moda',text:'Benim stilim! yaxestgames.com/moda/'});else if(navigator.share)navigator.share({title:'Yaxest Moda',text:'Benim stilim! yaxestgames.com/moda/',url:'https://yaxestgames.com/moda/'});else toast('Paylaşma bu cihazda yok, "Kaydet" ile indirebilirsin.')}catch(e){}}})},'image/png')}
/* ---- MODA ŞOVU ---- */
var pastel=function(h){return U.lum(h)>165},warm=function(h){var x=hue(h);return x!=null&&(x<55||x>325)},cool=function(h){var x=hue(h);return x!=null&&x>150&&x<290},bright=function(h){return sat(h)>.55},dark=function(h){return U.lum(h)<95},any=function(){return true};
function hue(h){var a=U.rgb(h),r=a[0]/255,g=a[1]/255,b=a[2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;if(d<.12)return null;var x=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;x*=60;return x<0?x+360:x}
function sat(h){var a=U.rgb(h),mx=Math.max.apply(null,a),mn=Math.min.apply(null,a);return mx?(mx-mn)/mx:0}
var THEMES=[
 {id:'prenses',n:'Prenses Balosu',e:'👑',hint:'Taç, balo elbisesi ve zarif aksesuarlar',tags:['prenses','zarif'],need:5,colf:any},
 {id:'plaj',n:'Plaj Günü',e:'🏖️',hint:'Yazlık parçalar, canlı renkler, güneş gözlüğü',tags:['plaj','yaz'],need:5,colf:bright},
 {id:'okul',n:'Okul Modası',e:'🎒',hint:'Rahat ve düzgün: gömlek, etek, babet',tags:['okul','günlük'],need:5,colf:any},
 {id:'kis',n:'Kış Masalı',e:'❄️',hint:'Sıcacık: kazak, bere, bot, fular',tags:['kış','sıcak'],need:5,colf:any},
 {id:'peri',n:'Peri Masalı',e:'🧚',hint:'Kanatlar, çiçekler, değnek ve pastel renkler',tags:['peri','fantezi','doğa'],need:5,colf:pastel},
 {id:'spor',n:'Spor Günü',e:'⚽',hint:'Spor ayakkabı, şort, at kuyruğu',tags:['spor'],need:4,colf:bright},
 {id:'hali',n:'Kırmızı Halı',e:'✨',hint:'Gece zarafeti: parlak, şık ve cesur',tags:['glam','gece','zarif'],need:5,colf:any},
 {id:'kafe',n:'Kafe Buluşması',e:'☕',hint:'Şık ve rahat bir arada',tags:['günlük','şık'],need:5,colf:any},
 {id:'pastel',n:'Pastel Rüyası',e:'🍭',hint:'Yalnızca açık, tatlı renkler!',tags:['sevimli'],need:4,colf:pastel},
 {id:'parti',n:'Gece Partisi',e:'🎉',hint:'Parıltı, yıldızlar ve eğlence',tags:['parti','glam','gece'],need:5,colf:any},
 {id:'bahce',n:'Bahçe Partisi',e:'🌸',hint:'Çiçekler, sepet, yazlık elbise',tags:['doğa','yaz','sevimli'],need:5,colf:any},
 {id:'uzay',n:'Uzay Kaşifi',e:'🚀',hint:'Yıldızlar, pelerin ve gece gökyüzü',tags:['kozmik','fantezi','gece'],need:5,colf:any}];
function today(){return Math.floor((Date.now()+3*3600e3)/864e5)}
function dailyTheme(){return THEMES[today()%THEMES.length]}
var SHOW=ls('ym-show',{best:{},n:0,day:0,tot:0});
function inter(a,b){return a.some(function(x){return b.indexOf(x)>=0})}
function scoreLook(theme){var W=wornList(),sum=0,wts={dress:2,top:1,bottom:1,shoes:1};W.forEach(function(w){if(inter(w.it.tags||[],theme.tags))sum+=wts[w.slot]||.6});var bg=YM.BG[st.bg];if(bg&&inter(bg.tags||[],theme.tags))sum+=1.2;
 var tag=Math.min(1,sum/theme.need);
 var main=W.filter(function(w){return wts[w.slot]||w.slot==='hat'}),cm=main.length?main.filter(function(w){return theme.colf(w.c)}).length/main.length:0;
 var chroma=main.map(function(w){return hue(w.c)}).filter(function(h){return h!=null}),harm=1;
 if(chroma.length>1){var mxd=0;chroma.forEach(function(a){chroma.forEach(function(b){var d=Math.abs(a-b);d=Math.min(d,360-d);if(d>mxd)mxd=d})});harm=mxd<=70?1:(mxd>=150&&chroma.length<=3)?.9:chroma.length>3?.5:.72}
 var acc=W.filter(function(w){return ACC.indexOf(w.slot)>=0}).length,hasSh=!!st.items.shoes,comp=(hasSh?.25:0)+((st.shadow||st.blush)?.2:0)+(acc>=3?.35:acc===2?.25:acc===1?.1:0)+((st.items.dress||(st.items.top&&st.items.bottom))?.2:0);comp=Math.min(1,comp/.95);
 var pats={};W.forEach(function(w){if(w.p&&w.p!=='plain')pats[w.p]=1});var cre=Math.min(1,(Object.keys(pats).length?.3:0)+((st.items.back||st.items.hand)?.3:0)+(st.tipC?.15:0)+((st.stk||st.fr)?.1:0)+(acc>=4?.25:0));
 var j=[.55*harm+.25*cm+.2*tag,.55*tag+.3*comp+.15*harm,.35*cre+.35*tag+.3*comp];
 return{tag:tag,col:cm,harm:harm,comp:comp,cre:cre,j:j,stars:j.map(function(s){return Math.max(1,Math.min(5,Math.round(1+4*s)))}),W:W}}
var JUDGES=[['🎨','Aylin','Renk ve uyum'],['👠','Defne','Stil ve bütünlük'],['🌟','Mira','Yaratıcılık']];
var CM={0:['Renkler birbirine pek yakışmamış.','Renk seçimini yeniden düşün.'],1:['Renkler olmuş ama biraz karışık.'],2:['Güzel bir renk uyumu!'],3:['Renkler ahenkle konuşuyor.'],4:['Harika bir palet, çok uyumlu!']};
function comments(r,theme,i){var s=r.stars[i],a=[];
 var T=[['Renkler bir araya gelmemiş, daha az renk dene.','Renk dünyan karışmış, 2-3 renkle başla.','Renkler fena değil ama temaya tam oturmadı.','Renk uyumu çok güzel, gözümü aldı!','Muhteşem bir palet, tam bir moda ikonu!'],
  ['Temadan çok uzak, bir daha dene.','Temaya biraz uzak kaldı.','Temaya yaklaşmışsın, birkaç parça daha uyabilirdi.','Tema çok iyi yansımış, bütün görünüm tutarlı!','Kusursuz bir tema uyumu, podyum senin!'],
  ['Biraz daha cesur ol, aksesuar ekle!','Sade olmuş, bir iki sürpriz parça iyi olurdu.','Hoş bir fikir, biraz daha detay harika olur.','Yaratıcı ve eğlenceli, çok sevdim!','Bu kadar özgün bir stil görmedim, bravo!']][i][s-1];
 a.push(T);
 if(r.tag<.7&&i!==0){var miss=[];['dress','top','bottom','shoes','hat','glasses','neck','ear','bag','back','hand'].forEach(function(sl){(CAT[sl]||[]).forEach(function(it){if(inter(it.tags||[],theme.tags)&&!(st.items[sl]&&st.items[sl].id===it.id))miss.push(it.n)})});if(miss.length){var m1=miss[Math.floor(Math.random()*miss.length)];a.push('İpucu: '+m1+' temaya çok yakışırdı.')}}
 if(i===0&&r.col<.5&&theme.colf!==any)a.push('Bu tema için "'+theme.hint.toLowerCase()+'" renklerini seç.');
 return a.join(' ')}
$('bShow').onclick=openShow;
function openShow(){var d=dailyTheme(),h='<h3>🏆 Moda Şovu</h3><p class="sub">Bir tema seç, temaya uygun giyin, jüriyi etkile! Her gün yeni "Günün teması" ile <b>%50 bonus</b> kazan.</p><div class="th-g">';
 THEMES.forEach(function(t){var b=SHOW.best[t.id]||0,isd=t.id===d.id;h+='<button class="tc'+(isd?' daily':'')+'" data-t="'+t.id+'"><span class="te">'+t.e+'</span><b>'+esc(t.n)+'</b><small>'+esc(t.hint)+'</small><em>'+(b?'★'.repeat(Math.round(b/3)||1)+' '+b+'/15':'Henüz denenmedi')+'</em>'+(isd?'<i>Günün teması</i>':'')+'</button>'});
 h+='</div><div class="btns"><button class="b" id="mb2">Kapat</button></div>';modal(h,function(){$('mb2').onclick=closeModal;$('modal').querySelectorAll('[data-t]').forEach(function(b){b.onclick=function(){curShow=THEMES.filter(function(t){return t.id===b.dataset.t})[0];closeModal();showBanner();sfx('good')}})})}
function showBanner(){var b=$('banner');if(!curShow){b.classList.remove('on');return}b.innerHTML='<span>'+curShow.e+'</span><div><b>'+esc(curShow.n)+'</b><small>'+esc(curShow.hint)+'</small></div><button class="b p" id="bGo">Podyuma çık! 🎬</button><button class="x" id="bX" aria-label="Temayı bırak">✕</button>';b.classList.add('on');$('bX').onclick=function(){curShow=null;showBanner()};$('bGo').onclick=function(){needUnlock(go)}}
function go(){if(!curShow)return;var th=curShow;walk={t0:performance.now(),d:2600,cb:function(){walk=null;judge(th)}};sfx('good');$('banner').classList.remove('on')}
function stars(n,max){return'★'.repeat(n)+'<span class="off">'+'★'.repeat(max-n)+'</span>'}
function judge(th){var r=scoreLook(th),tot=r.stars.reduce(function(a,b){return a+b},0),dtheme=dailyTheme().id===th.id,first=dtheme&&SHOW.day!==today();
 var coinsN=4+tot*2;if(first)coinsN=Math.floor(coinsN*1.5);var got=0;try{got=window.YX?YX.earn(coinsN,'moda'):0}catch(e){}
 var prevBest=SHOW.best[th.id]||0,rec=tot>prevBest;if(rec)SHOW.best[th.id]=tot;SHOW.n++;SHOW.tot+=tot;if(first)SHOW.day=today();lsw('ym-show',SHOW);
 var bestPct=Math.round(tot/15*100);var allBest=Math.max(ls('ym-best',0),bestPct);lsw('ym-best',allBest);
 var title=tot>=14?'Moda Efsanesi 👑':tot>=12?'Podyum Yıldızı ⭐':tot>=9?'Stilist 💅':tot>=6?'Çırak Stilist 🌱':'Yeni Başlayan 🎀';
 var h='<h3>'+th.e+' '+esc(th.n)+'</h3><div class="jg">';
 JUDGES.forEach(function(j,i){h+='<div class="jd" style="animation-delay:'+(i*.9)+'s"><div class="ja">'+j[0]+'</div><div class="jt"><b>'+j[1]+'</b><small>'+j[2]+'</small><div class="st">'+stars(r.stars[i],5)+'</div><p>'+esc(comments(r,th,i))+'</p></div></div>'});
 h+='</div><div class="fin" style="animation-delay:2.9s"><div class="big">'+tot+'<small>/15</small></div><b>'+title+'</b>'+(rec?'<div class="rec">🏅 Yeni rekor!</div>':'')+'<div class="rw">+'+(got||coinsN)+' 🪙'+(first?' <span>(Günün teması bonusu!)</span>':'')+'</div></div><div class="btns" style="animation-delay:3.2s"><button class="b p" id="mb1">Tekrar dene</button><button class="b" id="mb3">📸 Fotoğraf</button><button class="b" id="mb2">Yeni tema</button></div>';
 modal(h,function(){sfx('win');burst(300,300,30);flash=.6;$('mb1').onclick=function(){closeModal();showBanner()};$('mb2').onclick=function(){closeModal();curShow=null;showBanner();openShow()};$('mb3').onclick=function(){closeModal();photo(th.n+' '+tot+'/15')}});updCoins()}
/* ---- başlat ---- */
buildPanel();showBanner();
window.YMDBG={st:function(){return st},set:function(f){f(st);saveCur();buildPanel()},score:scoreLook,THEMES:THEMES,judge:judge,openShow:openShow,own:own};
})();
