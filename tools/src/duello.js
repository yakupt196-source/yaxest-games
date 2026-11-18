// Yaxest Düello|<b>2 kişilik!</b> Telefonu ortaya koyun, herkes kendi yarısına dokunsun.<br>Yeşil yanınca ilk dokunan kazanır, erken basan kaybeder. 3 puana ilk ulaşan galip!
const x=G.x;let sc,phase,t,wait,winner,mode,tapA,tapB,msg;
function startRound(){phase='ready';t=0;wait=G.rnd(1.4,4);msg=''; mode=G.pick(['react','react','race']);tapA=0;tapB=0}
function award(p,why){if(phase==='res')return;phase='res';t=0;winner=p;sc[p]++;msg=why;G.sfx(p?'ok':'good');if(sc[p]>=3){setTimeout(()=>G.over('Oyuncu '+(p+1)+' kazandı!'),900)}}
function press(p){if(G.state!=='play')return;
 if(phase==='ready'||phase==='wait'){if(mode==='react'){award(1-p,'Erken bastı!');return}}
 if(phase==='go'&&mode==='react'){award(p,'Hızlı!');return}
 if(phase==='go'&&mode==='race'){if(p===0)tapA++;else tapB++;G.sfx('tap');if(tapA>=15)award(0,'Yarışı aldı');else if(tapB>=15)award(1,'Yarışı aldı')}}
G.run({key:'duello',init(){sc=[0,0];startRound()},
 down(a,b){press(b<G.H/2?1:0)},
 key_(e,d){if(!d)return;if(e.key==='a'||e.key==='A'){press(1);return true}if(e.key==='l'||e.key==='L'||e.key===' '){press(0);return true}},
 update(dt){t+=dt;if(phase==='ready'&&t>wait*.35){phase='wait'}if(phase==='wait'&&t>wait){phase='go';t=0;G.sfx('good')}
  if(phase==='res'&&t>1.3&&sc[0]<3&&sc[1]<3)startRound()},
 draw(){const h=G.H/2;
  for(const p of[0,1]){x.save();if(p===1){x.translate(G.W,h);x.rotate(Math.PI)}else x.translate(0,h);
   const col=p?'#ff5c8a':'#3df0ff',go=phase==='go'&&mode==='react';
   x.fillStyle=phase==='res'?(winner===p?'#1f7a4f':'#7a1f3a'):go?'#1fbf6f':'#1a1236';x.fillRect(0,0,G.W,h);
   x.fillStyle=col+'33';x.fillRect(0,0,G.W,6);
   G.text('Oyuncu '+(p+1),G.W/2,h*.2,18,col);G.text(sc[p],G.W/2,h*.45,64,'#fff');
   let m=phase==='res'?(winner===p?'KAZANDIN! '+msg:'Kaybettin'):mode==='react'?(go?'ŞİMDİ!':phase==='go'?'':'Yeşili bekle…'):(phase==='go'?'DOKUN DOKUN! '+(p?tapB:tapA)+'/15':'Hızlı dokunma yarışı…');
   G.text(m,G.W/2,h*.75,22,'#fff');x.restore()}
  x.fillStyle='#fff';x.fillRect(0,h-2,G.W,4)}
});
