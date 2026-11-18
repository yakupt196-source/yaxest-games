// Yaxest Mermi|<b>Parmağını sürükle</b>, kurşun yağmurundan kaç.<br>Ne kadar uzun dayanırsan o kadar puan. Dokunursan biter!
const x=G.x;let me,tx,ty,bul,t,spawn,pat,patT,hasT;
function add(a,b,vx,vy,r,col){bul.push({x:a,y:b,vx,vy,r:r||6,col:col||'#ff5c8a'})}
function edge(){const s=G.ri(0,3);return s===0?[G.rnd(0,G.W),-10]:s===1?[G.W+10,G.rnd(0,G.H)]:s===2?[G.rnd(0,G.W),G.H+10]:[-10,G.rnd(0,G.H)]}
const pats=[
 ()=>{const [a,b]=edge(),n=8+Math.floor(t/12);for(let i=0;i<n;i++){const an=i/n*6.28,sp=G.rnd(110,160);add(G.rnd(G.W*.2,G.W*.8),G.rnd(G.H*.15,G.H*.4),Math.cos(an)*sp,Math.sin(an)*sp,5,'#ff9f43')}},
 ()=>{const [a,b]=edge(),dx=me.x-a,dy=me.y-b,l=Math.hypot(dx,dy),sp=170+t*1.5;for(let i=0;i<3+Math.floor(t/20);i++)setTimeout(()=>{if(G.state==='play')add(a,b,dx/l*sp,dy/l*sp,6,'#ff5c8a')},i*140)},
 ()=>{const gap=G.rnd(.15,.85)*G.W,gw=Math.max(80,150-t);for(let c=0;c<G.W;c+=26){if(Math.abs(c-gap)<gw/2)continue;add(c,-10,0,130+t,6,'#b388ff')}},
 ()=>{const cx=G.rnd(G.W*.25,G.W*.75),cy=G.rnd(G.H*.2,G.H*.45);for(let i=0;i<14;i++)setTimeout(()=>{if(G.state==='play'){const an=i*.55+G.t;add(cx,cy,Math.cos(an)*150,Math.sin(an)*150,5,'#3df0ff')}},i*90)}];
G.run({key:'mermi',init(){me={x:G.W/2,y:G.H*.75};tx=me.x;ty=me.y;bul=[];t=0;spawn=1.2;hasT=false},
 down(a,b){tx=a;ty=b-40;hasT=true},move(a,b){tx=a;ty=b-40},
 key_(e,d){const s=14;if(!d)return;if(e.key==='ArrowLeft'){tx-=s*4;return true}if(e.key==='ArrowRight'){tx+=s*4;return true}if(e.key==='ArrowUp'){ty-=s*4;return true}if(e.key==='ArrowDown'){ty+=s*4;return true}},
 update(dt){t+=dt;G.setScore(Math.floor(t));
  me.x+=(G.clamp(tx,10,G.W-10)-me.x)*Math.min(1,dt*14);me.y+=(G.clamp(ty,G.H*.1,G.H-10)-me.y)*Math.min(1,dt*14);
  spawn-=dt;if(spawn<=0){spawn=Math.max(.7,2.1-t*.025);const n=t>20?2:1;for(let i=0;i<n;i++)G.pick(pats)();}
  if(Math.floor(t)%10===0&&Math.floor(t)>0&&Math.floor(t-dt)%10!==0)G.sfx('good');
  for(const b of bul){b.x+=b.vx*dt;b.y+=b.vy*dt;if(Math.hypot(b.x-me.x,b.y-me.y)<b.r+5){G.over();return}}
  bul=bul.filter(b=>b.x>-30&&b.x<G.W+30&&b.y>-30&&b.y<G.H+30)},
 draw(){G.bg('#0d0820','#1c0f3a');
  for(const b of bul)G.circle(b.x,b.y,b.r,b.col,10);
  if(me){G.circle(me.x,me.y,5,'#fff',16);x.strokeStyle='rgba(255,255,255,.3)';x.beginPath();x.arc(me.x,me.y,11,0,7);x.stroke()}
  if(G.state==='play'&&!hasT&&t<3)G.text('Parmağınla sürükle',G.W/2,G.H*.55,18,'rgba(255,255,255,.6)')}
});
