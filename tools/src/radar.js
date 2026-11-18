// Yaxest Radar|Çizgi dönerken <b>hedef yayın</b> üstüne gelince <b>dokun</b>.<br>Iskalarsan can gider. Kırmızı sahte hedeflere dokunma!
const x=G.x;let ang,spd,tgt,fakes,lives,hits,flash,dir;
function newT(){const a=G.rnd(0,6.28);const w=Math.max(.32,.75-hits*.018);tgt={a,w};fakes=[];if(hits>=5){const n=Math.min(3,1+Math.floor((hits-5)/6));for(let i=0;i<n;i++)fakes.push({a:a+G.rnd(1.2,5),w:.4})}}
function diff(a,b){let d=(a-b)%6.2832;if(d>3.1416)d-=6.2832;if(d<-3.1416)d+=6.2832;return d}
function tap(){if(G.state!=='play')return;
 for(const f of fakes)if(Math.abs(diff(ang,f.a))<f.w/2){bad();return}
 if(Math.abs(diff(ang,tgt.a))<tgt.w/2){hits++;G.setScore(hits);spd=Math.min(5.2,2.2+hits*.09);if(hits%7===0&&dir>0)dir=1;if(hits>12&&hits%4===0)dir*=-1;flash=.25;G.sfx('good');try{YS.note(60+hits%7*2,.25,.1)}catch(e){}newT()}else bad()}
function bad(){lives--;flash=-.3;G.sfx('bad');if(lives<=0)G.over()}
G.run({key:'radar',init(){ang=0;spd=2.2;hits=0;lives=3;flash=0;dir=1;newT()},
 down(){tap()},key_(e,d){if(d&&(e.key===' '||e.key==='Enter')){tap();return true}},
 update(dt){ang+=spd*dt*dir;flash+=flash>0?-dt:flash<0?dt:0},
 draw(){G.bg('#031a14','#06302a');const cx=G.W/2,cy=G.H*.46,R=Math.min(G.W*.44,G.H*.34);
  x.strokeStyle='rgba(61,219,176,.25)';x.lineWidth=1.5;for(let i=1;i<=4;i++){x.beginPath();x.arc(cx,cy,R*i/4,0,7);x.stroke()}x.beginPath();x.moveTo(cx-R,cy);x.lineTo(cx+R,cy);x.moveTo(cx,cy-R);x.lineTo(cx,cy+R);x.stroke();
  if(!tgt)return;
  const arc=(a,w,col,lw)=>{x.strokeStyle=col;x.lineWidth=lw;x.lineCap='round';x.beginPath();x.arc(cx,cy,R,a-w/2,a+w/2);x.stroke()};
  for(const f of fakes)arc(f.a,f.w,'#ff5c8a',16);arc(tgt.a,tgt.w,flash>0?'#fff':'#3ddbb0',16);
  for(let i=0;i<24;i++){const a=ang-i*.035*dir;x.strokeStyle='rgba(61,240,255,'+(.5-i*.02)+')';x.lineWidth=3;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);x.stroke()}
  x.strokeStyle='#3df0ff';x.lineWidth=4;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(ang)*R,cy+Math.sin(ang)*R);x.stroke();
  G.circle(cx,cy,6,'#3df0ff',10);
  G.text('❤️'.repeat(Math.max(0,lives)),cx,cy+R+44,22);if(flash<0){x.fillStyle='rgba(255,92,138,'+(-flash)+')';x.fillRect(0,0,G.W,G.H)}}
});
