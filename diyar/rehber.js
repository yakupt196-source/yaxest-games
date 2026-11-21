/* Yaxest Diyarı: ilk giriş Rehberi. Adım adım görev, yönlendirme oku, ödül. window.YT */
(function(){
'use strict';
var D,Y,P,G,tk=0,c={kills:0,chat:0,tr:0,trOpen:0},sx=0,sy=0,sn=0,pf0=0;
function $(i){return document.getElementById(i)}
function pfSum(){var s=0;for(var k in(P.pf||{}))s+=(P.pf[k].l||1)*1e4+(P.pf[k].x||0);return s}
function npcOpen(txt){var pn=$('p-npc'),t=$('npt');return pn&&pn.classList.contains('on')&&t&&t.textContent.indexOf(txt)>=0}
function panOn(id){var e=$(id);return !!(e&&e.classList.contains('on'))}
var ST=[
 {t:'Yürü',d:'Sol alttaki joystick ile (bilgisayarda W A S D) biraz yürü.',chk:function(){return Math.hypot(G.px-sx,G.py-sy)>170},rw:{gold:15}},
 {t:'Maceracı Evi',d:'Yeşil okun gösterdiği 🏛 Maceracı Evi\'ne git. Yaklaşınca çıkan ✋ düğmesine bas.',tg:'guild',chk:function(){return npcOpen('Maceracı')},rw:{gold:20}},
 {t:'Görev al',d:'Günlük görevlerden birinde “Görevi al” de. Görevler altın, XP ve Maceracı Puanı verir.',tg:'guild',chk:function(){return(P.q&&P.q.list||[]).some(function(q){return q.st>=1})},rw:{gold:30,xp:30}},
 {t:'İlk av',d:'Kasaba dışına çık ve bir canavara yaklaşıp ⚔️ ile saldır. (Kasabada savaş yok; güvenli bölge!)',tg:'mon',chk:function(){return c.kills>=1},rw:{gold:50,xp:60}},
 {t:'Topla',d:'Bir ağaca ya da taşa git; ✋ çıkınca bas ve bekle. Malzemeyle silah ve rün döversin.',tg:'node',chk:function(){return pfSum()>pf0},rw:{gold:40,xp:30}},
 {t:'Çanta',d:'Sağ üstteki 🎒 Çanta\'yı aç: eşyaların, becerilerin ve seviyen burada.',hl:'ibag',chk:function(){return panOn('p-bag')},rw:{gold:20}},
 {t:'Rün Ustası',d:'🔮 Rün Ustası\'na git. Rünler silah, zırh ve tılsıma takılıp sürekli bonus verir.',tg:'rune',chk:function(){return npcOpen('Rün')},rw:{gold:40,rune:'kurt'}},
 {t:'Sohbet',d:'Alttaki yazı kutusuna “merhaba” yaz ve gönder. Kanalı soldaki etiketle (Dünya/Yerel/Klan/Parti) değiştirebilirsin. /yardim komutları gösterir.',hl:'chbox',chk:function(){return c.chat>=1},rw:{gold:30}},
 {t:'Menü',d:'Sohbetin solundaki ☰ Menü\'ye bas: Sosyal (arkadaş, klan, parti), Evim, Kasaba ışınlanma ve daha fazlası burada.',hl:'dkb',chk:function(){var p=$('dkp');return !!(p&&p.classList.contains('on'))},rw:{gold:20}},
 {t:'Hazine Avı',d:'Menü → 🧭 Hazine\'ye bak. Her gün dünyada herkes için gizli bir hazine var; sıcak/soğuk pusulasıyla bul!',hl:'dkb',chk:function(){return c.trOpen>=1},rw:{gold:60,xp:60}}
];
function tut(){return P.tut}
function save(){D.saveNow()}
function give(rw){var t=[];if(rw.gold){P.gold+=rw.gold;t.push('🪙'+rw.gold)}if(rw.xp){D.giveXp(rw.xp);t.push(rw.xp+' XP')}if(rw.rune&&window.YR){P.rn[rw.rune]=(P.rn[rw.rune]||0)+1;t.push('🔮 '+YR.R[rw.rune].n+' rünü')}return t.join(' · ')}
function start(i){var t=tut();t.s=i;sx=G.px;sy=G.py;sn=i;pf0=pfSum();c.kills=0;c.chat=0;c.trOpen=0;save();render()}
function finish(){var t=tut();t.d=1;save();var rw={gold:300,xp:200,rune:'orman'},tx=give(rw);D.say('🎓 Rehber tamam! Çeyizin: '+tx,'sys');D.floatTxt(G.px,G.py-80,'🎓 Rehber Tamam!','#5be39a');
  D.say('💡 Sırada: 🏘 Emlakçı\'dan arsa al ve evini kur · 🛡 Klan kur/katıl · 👥 arkadaş ekle · 🔮 rünlerini güçlendir. /yardim sohbet komutlarını gösterir.','sys');render();clearHl()}
function clearHl(){['ibag','chbox','dkb'].forEach(function(i){var e=$(i);if(e)e.classList.remove('tuthl')})}
function render(){var el=$('tut'),t=P&&P.tut;if(!el||!t||t.d||t.h){if(el)el.style.display='none';clearHl();return}
  el.style.display='block';el.classList.toggle('big',t.s<0);
  if(t.s<0){el.innerHTML='<h4 style="font-size:1.05rem">🌟 Yaxest Diyarı\'na hoş geldin, '+P.nick.replace(/[<>&]/g,'')+'!</h4>Kısa bir Rehber turuyla oyunu öğren: yürümek, savaşmak, toplamak, rün dövmek, sohbet, klan… Her adımda ödül kazanırsın, sonda özel bir çeyiz seni bekliyor.<div class="tr2" style="justify-content:center"><button class="go" id="tgo">Rehberi başlat</button><button id="tsk">Atla</button></div>';
    $('tgo').onclick=function(){start(0)};$('tsk').onclick=function(){t.d=1;save();render()};return}
  var s=ST[t.s];if(!s){finish();return}
  el.innerHTML='<h4>📘 Rehber · '+(t.s+1)+'/'+ST.length+' · '+s.t+'</h4>'+s.d+'<div class="tb"><i style="width:'+(t.s/ST.length*100)+'%"></i></div><div class="tr2"><button id="tsk2">Adımı geç</button><button id="thd">Gizle</button></div>';
  $('tsk2').onclick=function(){next(true)};$('thd').onclick=function(){t.h=1;save();render()};
  clearHl();if(s.hl&&$(s.hl))$(s.hl).classList.add('tuthl')}
function next(skip){var t=tut(),s=ST[t.s];if(!skip){var tx=give(s.rw||{});D.say('✅ Rehber: '+s.t+' tamam! '+tx,'sys');D.floatTxt(G.px,G.py-70,'✅ '+s.t,'#5be39a')}if(t.s+1>=ST.length)finish();else start(t.s+1)}
function tick(){if(!G||!P)return;var t=tut();if(!t||t.d||t.s<0||t.h||G.mode!=='world')return;var s=ST[t.s];if(!s)return;try{if(s.chk())next(false)}catch(e){}}
function ev(k){if(k==='kill')c.kills++;else if(k==='chat')c.chat++;else if(k==='trOpen')c.trOpen++}
function show(){var t=tut();if(!t)return;if(t.d){D.say('📘 Rehber tamamlanmıştı. Baştan görmek için /rehber yaz.','sys');t.d=0;start(0);return}t.h=0;if(t.s<0)t.s=-1;render()}
function target(s){var tg=s&&s.tg;if(!tg||!G)return null;if(tg==='mon'){var b=null,bd=1e9;G.mons.forEach(function(m){if(m.dead)return;var d=Math.hypot(m.x-G.px,m.y-G.py);if(d<bd){bd=d;b=m}});return b?{x:b.x,y:b.y}:null}
  if(tg==='node'){var TS=Y.TS,tx0=Math.floor(G.px/TS),ty0=Math.floor(G.py/TS),best=null,bd2=1e9;for(var dy=-12;dy<=12;dy++)for(var dx=-12;dx<=12;dx++){var x=tx0+dx,y=ty0+dy;if(!Y.nodeAt(x,y)||G.dep[x+','+y]>G.t)continue;var d2=dx*dx+dy*dy;if(d2<bd2){bd2=d2;best={x:(x+.5)*TS,y:(y+.5)*TS}}}return best}
  for(var i=0;i<G.npcs.length;i++)if(G.npcs[i].id===tg)return{x:G.npcs[i].x,y:G.npcs[i].y+10};return null}
function draw(ctx,Gx,t,Px){if(!Gx||!Px||Gx.mode!=='world'||!Px.tut||Px.tut.d||Px.tut.s<0||Px.tut.h)return;var s=ST[Px.tut.s],tg=target(s);if(!tg)return;
  var dx=tg.x-Gx.px,dy=tg.y-Gx.py,d=Math.hypot(dx,dy);ctx.save();var pul=1+Math.sin(t*5)*.12;
  ctx.strokeStyle='#5be39a';ctx.lineWidth=3;ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(tg.x,tg.y,(26+Math.sin(t*4)*4),0,6.2832);ctx.stroke();
  if(d>70){var a=Math.atan2(dy,dx),r=64+Math.sin(t*5)*5,ax=Gx.px+Math.cos(a)*r,ay=Gx.py-8+Math.sin(a)*r*.7;ctx.translate(ax,ay);ctx.rotate(a);ctx.scale(pul,pul);ctx.fillStyle='#5be39a';ctx.strokeStyle='#06240f';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(15,0);ctx.lineTo(-7,-11);ctx.lineTo(-2,0);ctx.lineTo(-7,11);ctx.closePath();ctx.fill();ctx.stroke()}
  ctx.restore();ctx.save();ctx.font='700 12px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.strokeStyle='#000';ctx.lineWidth=3;var tx=tg.x,ty=tg.y-38;ctx.strokeText(Math.round(d/Y.TS)+' kare',tx,ty);ctx.fillText(Math.round(d/Y.TS)+' kare',tx,ty);ctx.restore()}
function init(api){D=api;Y=D.Y;P=D.P;G=D.G;clearInterval(tk);c={kills:0,chat:0,tr:0,trOpen:0};
  if(!P.tut){P.tut=(P.lv<=3&&(P.gold||0)<2000)?{s:-1,d:0}:{d:1,s:0}}
  if(window.YX2&&!YX2._tw){YX2._tw=1;var ok=YX2.kill;YX2.kill=function(m){try{ev('kill')}catch(e){}return ok.apply(this,arguments)}}
  sx=G.px;sy=G.py;pf0=pfSum();if(P.tut&&P.tut.s>=0&&!P.tut.d)start(P.tut.s);else render();tk=setInterval(function(){if(D.G){G=D.G;tick()}},500)}
window.YT={init:init,ev:ev,show:show,draw:draw};
})();
