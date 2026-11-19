// Yaxest Pota|Topu <b>geri çek ve fırlat</b>, potaya sok.<br>3 hakkın var. Üst üste sayı yaparsan bonus!
const x=G.x;let ball,hoop,lives,streak,drag,t0,rimL,rimR,sc,mov,msg,msgT,inAbove;
let GR=1400,SPM=1050;function phys(){GR=G.H*2.2;SPM=G.H*1.65}
function reset(){ball={x:G.W/2,y:G.H*.82,vx:0,vy:0,fly:false,r:15,rot:0};inAbove=false}
function pos(){hoop.y=G.H*.3;hoop.w=Math.max(68,96-sc*2)}
G.run({key:'pota',resize(){phys();if(hoop){pos();if(!ball.fly)reset()}},
 init(){phys();sc=0;lives=3;streak=0;hoop={x:G.W/2,y:0,w:96,dir:1};mov=false;pos();reset();drag=null;msgT=0},
 down(a,b){if(ball.fly)return;drag={x:a,y:b}},move(a,b){if(drag){drag.cx=a;drag.cy=b}},
 up(a,b){if(!drag||ball.fly)return;const dx=drag.x-a,dy=b-drag.y;drag=null;const l=Math.hypot(dx,dy);if(l<25||dy<10)return;const sp=Math.min(SPM,l*SPM/170);ball.vx=dx/l*sp;ball.vy=-dy/l*sp;ball.fly=true;G.sfx('jump')},
 update(dt){msgT-=dt;if(sc>=5){mov=true;hoop.x+=hoop.dir*(60+Math.min(120,sc*6))*dt;if(hoop.x>G.W-hoop.w/2-14)hoop.dir=-1;if(hoop.x<hoop.w/2+14)hoop.dir=1}
  if(!ball.fly)return;
  const st=4;for(let i=0;i<st;i++){const h=dt/st;const py=ball.y;ball.vy+=GR*h;ball.x+=ball.vx*h;ball.y+=ball.vy*h;ball.rot+=ball.vx*h*.02;
   const L=hoop.x-hoop.w/2,Rr=hoop.x+hoop.w/2,Y=hoop.y;
   if(ball.vy>0&&py<Y&&ball.y>=Y&&ball.x>L+4&&ball.x<Rr-4)inAbove=true;
   if(ball.vy>0&&inAbove&&ball.y>Y+30&&ball.x>L&&ball.x<Rr){score();return}
   for(const ex of[L,Rr]){const dx=ball.x-ex,dy=ball.y-Y,d=Math.hypot(dx,dy);if(d<ball.r+4&&d>0){const nx=dx/d,ny=dy/d;ball.x=ex+nx*(ball.r+4);ball.y=Y+ny*(ball.r+4);const vn=ball.vx*nx+ball.vy*ny;if(vn<0){ball.vx-=1.6*vn*nx;ball.vy-=1.6*vn*ny;ball.vx*=.8;ball.vy*=.8;G.sfx('tap')}}}
   if(ball.y<G.H*.08&&Math.abs(ball.x-hoop.x)<hoop.w){}
   if(ball.x<ball.r){ball.x=ball.r;ball.vx=Math.abs(ball.vx)*.7}if(ball.x>G.W-ball.r){ball.x=G.W-ball.r;ball.vx=-Math.abs(ball.vx)*.7}
   if(ball.y>G.H+40){miss();return}}},
 draw(){G.bg('#2a0f08','#4a1d0e');
  x.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<6;i++)x.fillRect(0,G.H*.18+i*G.H*.14,G.W,2);
  const L=hoop.x-hoop.w/2,Rr=hoop.x+hoop.w/2,Y=hoop.y;
  G.rrect(hoop.x-hoop.w*.75,Y-hoop.w*.85,hoop.w*1.5,hoop.w*.85,8,'rgba(255,255,255,.9)');G.rrect(hoop.x-hoop.w*.28,Y-hoop.w*.5,hoop.w*.56,hoop.w*.38,4,'rgba(255,92,60,.3)');
  x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=2;for(let i=0;i<=4;i++){x.beginPath();x.moveTo(L+i*hoop.w/4,Y);x.lineTo(hoop.x-hoop.w*.28+i*hoop.w*.56/4,Y+46);x.stroke()}
  x.strokeStyle='#ff6a3d';x.lineWidth=6;x.lineCap='round';x.beginPath();x.moveTo(L,Y);x.lineTo(Rr,Y);x.stroke();
  if(drag&&drag.cx!=null){const dx=drag.x-drag.cx,dy=drag.cy-drag.y,l=Math.hypot(dx,dy);if(l>25&&dy>10){const sp=Math.min(SPM,l*SPM/170);let vx=dx/l*sp,vy=-dy/l*sp,X=ball.x,Yb=ball.y;for(let i=0;i<22;i++){for(let j=0;j<3;j++){vy+=GR*.012;X+=vx*.012;Yb+=vy*.012}G.circle(X,Yb,3.5,'rgba(255,255,255,'+(1-i/26)+')')}}}
  G.circle(ball.x,ball.y,ball.r,'#ff9f43',6);x.save();x.translate(ball.x,ball.y);x.rotate(ball.rot);x.strokeStyle='rgba(60,20,0,.7)';x.lineWidth=2;x.beginPath();x.moveTo(-ball.r,0);x.lineTo(ball.r,0);x.moveTo(0,-ball.r);x.lineTo(0,ball.r);x.stroke();x.restore();
  G.text('❤️'.repeat(Math.max(0,lives)),G.W/2,G.H-24,20);if(streak>1)G.text('🔥 x'+streak,G.W-50,G.H*.2,18,'#ffd23f');
  if(msgT>0)G.text(msg,G.W/2,G.H*.55,34,'rgba(255,210,63,'+Math.min(1,msgT*2)+')');
  if(G.state==='play'&&sc===0&&!ball.fly)G.text('Geri çek ↓ ve bırak',G.W/2,G.H*.68,18,'rgba(255,255,255,.6)')}
});
function score(){sc++;streak++;const bonus=streak>1?streak:1;G.setScore(G.score+2+bonus);G.sfx('good');try{YS.note(72,.4,.1);YS.note(79,.5,.08)}catch(e){}msg=streak>2?'Seri x'+streak+'!':'Sayı!';msgT=.9;reset();hoop.x=G.W/2+(sc>2?G.rnd(-G.W*.3,G.W*.3):0)}
function miss(){streak=0;lives--;G.sfx('bad');if(lives<=0)return G.over();reset()}
