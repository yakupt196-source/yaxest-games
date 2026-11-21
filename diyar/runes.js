/* Yaxest Diyarı: Rün Atölyesi v2 (window.YR)
   12 rün, 3 yuva (silah / zırh / tılsım), seviye 1–5, otomatik takma, set bonusu,
   canavar düşürmesi ve karakter çevresinde dönen rün ışıkları. */
(function(){
'use strict';
var RC=['#c9ced9','#7be07b','#5cb0ff','#c07cff'],RN=['Sıradan','Ender','Nadir','Mistik'];
var SL={w:'Silah',a:'Zırh',t:'Tılsım'},SK={w:'sw',a:'sa',t:'st'},TALI_LV=8,MAXL=5;
/* k: etki anahtarı, b: 1. seviye değeri. Seviye çarpanı: 1 + .25*(sv-1) */
var R={
  kurt:{n:'Kurt Rünü',ic:'🐺',slot:'w',r:0,k:'crit',b:.15,col:'#ff7a6e',c:{fang:3,gold:30}},
  kristal:{n:'Kristal Rünü',ic:'💎',slot:'w',r:1,k:'cd',b:.20,col:'#7ad7ff',c:{crystal:2,gold:50}},
  alev:{n:'Alev Rünü',ic:'🔥',slot:'w',r:2,k:'atk',b:.12,col:'#ff9a3c',c:{i_silver:2,crystal:1,gold:220}},
  golge:{n:'Gölge Rünü',ic:'🌑',slot:'w',r:3,k:'ls',b:.05,col:'#b88cff',c:{i_mithril:2,core:1,gold:900}},
  orman:{n:'Orman Rünü',ic:'🌲',slot:'a',r:0,k:'regen',b:.015,col:'#6ef0a0',c:{wood:8,stone:2,gold:20}},
  demir:{n:'Demir Rünü',ic:'⛓️',slot:'a',r:1,k:'red',b:.08,col:'#c7cbd8',c:{i_iron:1,stone:3,gold:25}},
  buz:{n:'Buz Rünü',ic:'❄️',slot:'a',r:2,k:'hp',b:.12,col:'#9fe8ff',c:{i_silver:2,crystal:1,gold:240}},
  ruzgar:{n:'Rüzgâr Rünü',ic:'🌪️',slot:'a',r:2,k:'spd',b:.08,col:'#8ff0d0',c:{i_gold:2,fang:4,gold:300}},
  altin:{n:'Altın Rünü',ic:'🪙',slot:'t',r:1,k:'goldx',b:.25,col:'#ffd23f',c:{i_copper:3,goldore:2,gold:120}},
  bilge:{n:'Bilgelik Rünü',ic:'📖',slot:'t',r:2,k:'xpx',b:.10,col:'#7ad7ff',c:{crystal:3,i_silver:1,gold:260}},
  maden:{n:'Madenci Rünü',ic:'⛏️',slot:'t',r:1,k:'gath',b:.15,col:'#f0904a',c:{wood:10,i_iron:2,gold:150}},
  sans:{n:'Şans Rünü',ic:'🍀',slot:'t',r:3,k:'luck',b:.5,col:'#6ef0a0',c:{core:1,i_gold:3,crystal:3,gold:800}}
};
var ORDER={w:['kurt','kristal','alev','golge'],a:['orman','demir','buz','ruzgar'],t:['altin','maden','bilge','sans']};
var ZERO=function(){return{crit:0,cd:0,atk:0,ls:0,regen:0,red:0,hp:0,spd:0,goldx:0,xpx:0,gath:0,luck:0}};
function pct(v,d){return Math.round(v*100*(d||1))/(d||1)}
var TXT={
  crit:function(v){return'Kritik şansı +%'+pct(v)},cd:function(v){return'Beceri bekleme süresi -%'+pct(v)},atk:function(v){return'Hasar +%'+pct(v)},
  ls:function(v){return'Can çalma: vuruş hasarının %'+pct(v,10)+'’i kadar iyileştirir'},regen:function(v){return'Can yenilenmesi: saniyede %'+pct(v,10)},
  red:function(v){return'Hasar azaltma +%'+pct(v)},hp:function(v){return'Azami can +%'+pct(v)},spd:function(v){return'Hareket hızı +%'+pct(v)},
  goldx:function(v){return'Canavar altını +%'+pct(v)},xpx:function(v){return'Kazanılan XP +%'+pct(v)},gath:function(v){return'Toplarken +1 bonus şansı %'+pct(v)},
  luck:function(v){return'Rün düşme şansı +%'+pct(v)}
};
function ensure(P){P.rn=P.rn||{};P.rl=P.rl||{};if(P.sw==null)P.sw='';if(P.sa==null)P.sa='';if(P.st==null)P.st=''}
function lvl(P,id){return Math.max(1,Math.min(MAXL,(P.rl&&P.rl[id])||1))}
function mul(l){return 1+.25*(l-1)}
function val(P,id){return R[id].b*mul(lvl(P,id))}
function unlocked(P,slot){return slot!=='t'||P.lv>=TALI_LV}
function equipped(P){var o=[];['w','a','t'].forEach(function(s){var id=P[SK[s]];if(id&&R[id]&&R[id].slot===s&&unlocked(P,s))o.push(id)});return o}
function setInfo(P){var e=equipped(P),full=e.length===3;return{full:full,master:full&&e.every(function(id){return lvl(P,id)>=MAXL})}}
function mods(P){var m=ZERO();if(!P)return m;ensure(P);var e=equipped(P);var hmul=window.YH?YH.runeMul(P):1;e.forEach(function(id){m[R[id].k]+=val(P,id)*hmul});var si=setInfo(P);if(si.full)m.xpx+=.05;if(si.master)m.atk+=.05;return m}
function effTxt(P,id,l){var v=R[id].b*mul(l||lvl(P,id));return TXT[R[id].k](v)}
function stars(l){var s='';for(var i=1;i<=MAXL;i++)s+=i<=l?'★':'☆';return s}
function chips(P){ensure(P);var e=equipped(P);if(!e.length)return'Rünün yok · Rün Ustası’ndan dövebilirsin';return e.map(function(id){return R[id].ic+' Sv'+lvl(P,id)}).join(' · ')}

/* ---------- ganimet: canavar rün düşürür ---------- */
function drop(m,api){var P=api.P;if(!m||!P)return;ensure(P);
  var boss=m.boss||m.type==='guardian'||m.type==='lich'||m.type==='alpha',meta=m.type==='metin';
  var ch=boss?.6:meta?.6:(m.lv>=P.lv-6?.045:.015);ch*=1+mods(P).luck;
  if(Math.random()>=ch)return;
  var w=boss||meta?[0,40,45,15]:[60,28,11,1],x=Math.random()*100,r=0,s=0;for(var i=0;i<4;i++){s+=w[i];if(x<s){r=i;break}}
  var pool=Object.keys(R).filter(function(k){return R[k].r===r});if(!pool.length)pool=Object.keys(R);
  var id=pool[Math.floor(Math.random()*pool.length)];P.rn[id]=(P.rn[id]||0)+1;
  api.say('🔮 '+RN[R[id].r]+' '+R[id].n+' düştü! (Rün Ustası’ndan tak ya da güçlendir)','sys');
  if(api.ft&&api.G)api.ft(api.G.px,api.G.py-64,R[id].ic+' '+R[id].n,RC[R[id].r])}

/* ---------- karakter çevresinde dönen rün ışıkları (dünya koordinatlarında) ---------- */
function aura(ctx,G,t,P){if(!G||!P||G.mode!=='world')return;var e=equipped(P);if(!e.length)return;
  ctx.save();for(var i=0;i<e.length;i++){var id=e[i],l=lvl(P,id),a=t*1.5+i*6.2832/e.length,rx=36,ry=13,x=G.px+Math.cos(a)*rx,y=G.py-6+Math.sin(a)*ry,front=Math.sin(a)>0,sz=5+l*.9;
    ctx.globalAlpha=front?.95:.55;var gr=ctx.createRadialGradient(x,y,0,x,y,sz*2.4);gr.addColorStop(0,R[id].col);gr.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,sz*2.4,0,6.2832);ctx.fill();
    ctx.globalAlpha=front?1:.7;ctx.fillStyle=R[id].col;ctx.strokeStyle='#ffffffcc';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,y-sz);ctx.lineTo(x+sz*.8,y);ctx.lineTo(x,y+sz);ctx.lineTo(x-sz*.8,y);ctx.closePath();ctx.fill();ctx.stroke();
    if(l>=MAXL){ctx.globalAlpha=.8;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+Math.cos(t*5+i)*sz*1.6,y+Math.sin(t*5+i)*sz*1.2,1.5,0,6.2832);ctx.fill()}}
  ctx.restore()}

/* ---------- Rün Atölyesi arayüzü ---------- */
var CSS='.ry-g{background:#ffffff0d;border:1px solid #ffffff22;border-radius:12px;padding:8px 12px;margin-bottom:10px;font-size:.84rem;line-height:1.55}.ry-g summary{cursor:pointer;font-weight:700;color:var(--yel)}.ry-g b{color:#fff}'
+'.ry-s{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0}.ry-sl{border:2px solid #ffffff22;border-radius:14px;padding:8px 6px;text-align:center;background:#ffffff08;font-size:.78rem;min-height:128px;display:flex;flex-direction:column;align-items:center;gap:3px}.ry-sl .yi{width:38px;height:38px}.ry-sl small{color:var(--mute)}.ry-sl .st{color:#ffd23f;letter-spacing:1px}.ry-sl button{margin-top:auto;min-height:28px;padding:0 10px;font-size:.74rem}'
+'.ry-h{margin:14px 0 4px;font-size:.92rem;color:var(--yel)}.ry-c{border-left-width:4px!important;flex-wrap:wrap}.ry-c .chip{display:inline-block;font-size:.68rem;padding:1px 7px;border-radius:9px;margin-left:4px;border:1px solid currentColor;vertical-align:1px}.ry-c .bt{display:grid;gap:4px;min-width:104px}.ry-c .bt button{min-height:32px;padding:0 8px;font-size:.78rem}.ry-miss{flex:1 1 100%;font-size:.74rem;color:#ff9d8a}.ry-sum{background:#ffffff0d;border-radius:12px;padding:8px 12px;font-size:.82rem;line-height:1.6;margin:6px 0}';
function injectCss(){if(document.getElementById('ry-css'))return;var s=document.createElement('style');s.id='ry-css';s.textContent=CSS;document.head.appendChild(s)}
function costTxt(P,Y,c){var ok=true,tx=[],miss=[];Object.keys(c).forEach(function(m){var ic=m==='gold'?'🪙':Y.MATS[m].ic,have=P[m]||0,good=have>=c[m];if(!good){ok=false;miss.push((c[m]-have)+' '+ic)}tx.push('<span style="color:'+(good?'#bfe9c6':'#ff9d8a')+'">'+c[m]+ic+'</span>')});return{ok:ok,tx:tx.join(' '),miss:miss.join(' ')}}
function upCost(P,id){var l=lvl(P,id);return l*80*(R[id].r+1)}
function draw(el,env){var P=env.P,Y=env.Y;ensure(P);injectCss();
  var first=!P.rtut;if(first){P.rtut=1;env.saveNow()}
  var h='<details class="ry-g"'+(first?' open':'')+'><summary>❓ Rünler nasıl çalışır?</summary><div style="margin-top:6px">'
   +'<b>① Döv:</b> Malzemeyle rün üret.<br><b>② Tak:</b> Yuvaya yerleştir. Etkisi <b>hemen başlar ve sen çıkarana kadar sürekli çalışır</b>; savaşta harcanmaz, “kullanmak” diye ayrı bir adım yok. Yuva boşsa dövdüğün rün otomatik takılır.<br>'
   +'<b>③ Güçlendir:</b> Aynı ründen yedek bir kopya + altınla Seviye 2–5 yap, etkisi her seviyede %25 artar.<br>'
   +'<b>Yuvalar:</b> Silah, Zırh ve Sv '+TALI_LV+'’de açılan Tılsım. <b>Set:</b> 3 yuva dolu +%5 XP, üçü de Sv 5 ise ayrıca +%5 hasar.<br><b>Nereden gelir?</b> Dövebilir, canavarlardan toplayabilir (seviyene yakın canavar %4.5, boss ve Fetih Kristali %60) ya da sandıklardan alabilirsin (Ender ve üstü sandıkta rün garanti).</div></details>';
  h+='<div class="ry-s">';
  ['w','a','t'].forEach(function(s){var id=P[SK[s]],lock=!unlocked(P,s);
    if(lock)h+='<div class="ry-sl"><small>'+SL[s].toUpperCase()+' YUVASI</small><div style="font-size:1.6rem">🔒</div><small>Sv '+TALI_LV+'’de açılır</small></div>';
    else if(id&&R[id]&&R[id].slot===s){var l=lvl(P,id);h+='<div class="ry-sl" style="border-color:'+RC[R[id].r]+'"><small>'+SL[s].toUpperCase()+' YUVASI</small>'+YA.ico('r_'+id)+'<b>'+R[id].n+'</b><span class="st">'+stars(l)+'</span><small>'+effTxt(P,id)+'</small><button class="btn alt" data-u="'+s+'" type="button">Çıkar</button></div>'}
    else h+='<div class="ry-sl"><small>'+SL[s].toUpperCase()+' YUVASI</small><div style="font-size:1.6rem;opacity:.4">◌</div><small>Boş yuva<br>aşağıdan bir rün tak</small></div>'});
  h+='</div>';
  var si=setInfo(P);h+='<div class="ry-sum"><b>🔮 Uyum:</b> '+(si.master?'<span style="color:#ffd23f">Kadim Uyum ✔ (+%5 XP, +%5 hasar)</span>':si.full?'<span style="color:#7dff9b">Üçlü Uyum ✔ (+%5 XP)</span> · üçünü de Sv 5 yaparsan Kadim Uyum':'3 yuvayı da doldur: +%5 XP')+'</div>';
  ['w','a','t'].forEach(function(s){h+='<h3 class="ry-h">'+SL[s]+' rünleri'+(unlocked(P,s)?'':' <small style="color:var(--mute)">(Sv '+TALI_LV+')</small>')+'</h3>';
    ORDER[s].forEach(function(id){var r=R[id],have=P.rn[id]||0,eq=P[SK[s]]===id,l=lvl(P,id),ct=costTxt(P,Y,r.c),canTak=have>0&&unlocked(P,s)&&!eq,spare=eq?have>=1:have>=2,ucost=upCost(P,id),canUp=l<MAXL&&spare&&(P.gold||0)>=ucost;
      var upHint=l>=MAXL?'En üst seviye':!spare?'Yedek kopya lazım':'Seviye '+(l+1)+' · 🪙'+ucost;
      h+='<div class="it ry-c" style="border-color:'+RC[r.r]+'"><span style="font-size:1.6rem">'+YA.ico('r_'+id)+'</span><div class="t"><b>'+r.n+'</b><span class="chip" style="color:'+RC[r.r]+'">'+RN[r.r]+'</span>'+(eq?'<span class="chip" style="color:#7dff9b">Takılı</span>':have?'<span class="chip" style="color:#9fdcff">Elinde ×'+have+'</span>':'')
       +'<br><small><b>Sv '+l+':</b> '+effTxt(P,id,l)+(l<MAXL?'<br>Sv '+(l+1)+': '+effTxt(P,id,l+1):'')+'<br>Dövme: '+ct.tx+'</small></div>'
       +'<div class="bt"><button class="btn" data-f="'+id+'" '+(ct.ok?'':'disabled')+' type="button">Döv</button><button class="btn alt" data-e="'+id+'" '+(canTak?'':'disabled')+' type="button">'+(eq?'Takılı':P[SK[s]]?'Değiştir':'Tak')+'</button><button class="btn alt" data-g="'+id+'" '+(canUp?'':'disabled')+' type="button">⬆ '+upHint+'</button></div>'
       +(!ct.ok?'<div class="ry-miss">Dövmek için eksik: '+ct.miss+'</div>':'')+'</div>'})});
  el.innerHTML=h;
  function done(msg){env.say(msg,'sys');env.saveNow();env.refresh()}
  function put(id){var s=R[id].slot,old=P[SK[s]];if(old&&old!==id)P.rn[old]=(P.rn[old]||0)+1;P.rn[id]--;P[SK[s]]=id}
  el.querySelectorAll('[data-f]').forEach(function(b){b.onclick=function(){var id=b.dataset.f,r=R[id];if(!costTxt(P,Y,r.c).ok)return;for(var m in r.c)P[m]-=r.c[m];P.rn[id]=(P.rn[id]||0)+1;
    if(!P[SK[r.slot]]&&unlocked(P,r.slot)){put(id);done('🔮 '+r.n+' dövüldü ve takıldı! Etkisi şu an aktif: '+effTxt(P,id))}else done('🔮 '+r.n+' dövüldü ve envanterine eklendi. “Tak” ile yuvaya yerleştir.')}});
  el.querySelectorAll('[data-e]').forEach(function(b){b.onclick=function(){var id=b.dataset.e;if(!(P.rn[id]>0))return;put(id);done('🔮 '+R[id].n+' takıldı. Etkisi şu an aktif: '+effTxt(P,id))}});
  el.querySelectorAll('[data-u]').forEach(function(b){b.onclick=function(){var s=b.dataset.u,id=P[SK[s]];if(!id)return;P[SK[s]]='';P.rn[id]=(P.rn[id]||0)+1;done('🔮 '+R[id].n+' çıkarıldı (envanterde).')}});
  el.querySelectorAll('[data-g]').forEach(function(b){b.onclick=function(){var id=b.dataset.g,l=lvl(P,id),eq=P[SK[R[id].slot]]===id,c=upCost(P,id);if(l>=MAXL||(eq?(P.rn[id]||0)<1:(P.rn[id]||0)<2)||(P.gold||0)<c)return;P.gold-=c;P.rn[id]--;P.rl[id]=l+1;done('✨ '+R[id].n+' Seviye '+(l+1)+' oldu! '+effTxt(P,id,l+1))}})}
window.YR={R:R,mods:mods,draw:draw,drop:drop,aura:aura,chips:chips,ensure:ensure,effTxt:effTxt,lvl:lvl,equipped:equipped};
})();
