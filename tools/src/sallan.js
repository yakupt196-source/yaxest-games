// Yaxest Sallan|<b>Basılı tut</b> ve en yakın kancaya tutun, <b>bırak</b> ve fırla.<br>Kancadan kancaya sallanarak olabildiğince uzağa git. Düşme!
const x=G.x;let ball,anch,cam,att,maxX,nextAx,hold;
function genAnchor(){const gap=G.rnd(120,170)+Math.min(100,maxX/40);nextAx+=gap;anch.push({x:nextAx,y:G.rnd(G.H*.12,G.H*.34)})}
function nearest(){let b=null,bd=1e9;for(const a of anch){if(a.x<ball.x-30)continue;const d=Math.hypot(a.x-ball.x,a.y-ball.y);if(d<300&&d<bd){bd=d;b=a}}return b}
G.run({key:'sallan',
 init(){anch=[{x:G.W*.32,y:G.H*.2}];nextAx=anch[0].x;maxX=0;for(let i=0;i<8;i++)genAnchor();
  const L=150;ball={x:anch[0].x-L*.7,y:anch[0].y+L*.7,vx:0,vy:0};att=anch[0];att.L=L;cam=0;hold=false},
 down(){hold=true;if(att)return;const a=nearest();if(a){att=a;att.L=Math.hypot(a.x-ball.x,a.y-ball.y);G.sfx('tap')}},
 up(){hold=false;if(att){att=null;G.sfx('jump')}},
 key_(e,d){if(e.key===' '||e.key==='ArrowUp'){if(d&&!hold)this.down();else if(!d)this.up();return true}},
 update(dt){const g=1100;
  for(let i=0;i<4;i++){const h=dt/4;ball.vy+=g*h;ball.x+=ball.vx*h;ball.y+=ball.vy*h;
   if(att){const dx=ball.x-att.x,dy=ball.y-att.y,l=Math.hypot(dx,dy);if(l>att.L){const nx=dx/l,ny=dy/l;ball.x=att.x+nx*att.L;ball.y=att.y+ny*att.L;const vn=ball.vx*nx+ball.vy*ny;if(vn>0){ball.vx-=nx*vn;ball.vy-=ny*vn}}}
   if(ball.y<14){ball.y=14;if(ball.vy<0)ball.vy*=-.5}}
  if(att&&!hold){att=null}
  cam+=((ball.x-G.W*.3)-cam)*Math.min(1,dt*5);
  while(nextAx<cam+G.W*2.2)genAnchor();
  const d=Math.max(0,Math.floor((ball.x-G.W*.3)/10));if(d>maxX/10|0){if(d%25===0&&d>0)G.sfx('good')}if(d*10>maxX){maxX=d*10;G.setScore(d)}
  if(ball.y>G.H+40)G.over()},
 draw(){G.bg('#0b0a2a','#2a1556');
  for(let i=0;i<30;i++){const px=((i*97-cam*.2*(1+i%3*.3))%G.W+G.W)%G.W,py=(i*53)%G.H;x.fillStyle='rgba(255,255,255,.25)';x.fillRect(px,py,2,2)}
  x.save();x.translate(-cam,0);
  const near=!att&&G.state==='play'?nearest():null;
  for(const a of anch){if(a.x<cam-40||a.x>cam+G.W+40)continue;const act=a===att,nr=a===near;
   G.circle(a.x,a.y,act?9:7,act?'#ffd23f':nr?'#3df0ff':'#6b6a9a',act||nr?16:0);
   if(nr){x.strokeStyle='rgba(61,240,255,.4)';x.setLineDash([4,6]);x.beginPath();x.moveTo(a.x,a.y);x.lineTo(ball.x,ball.y);x.stroke();x.setLineDash([])}}
  if(att){x.strokeStyle='#ffd23f';x.lineWidth=3;x.beginPath();x.moveTo(att.x,att.y);x.lineTo(ball.x,ball.y);x.stroke()}
  if(ball)G.circle(ball.x,ball.y,13,'#ff5c8a',16);
  x.restore();
  if(G.state==='play'&&!att&&G.t<4)G.text('Basılı tut',G.W/2,G.H*.62,20,'rgba(255,255,255,.6)')}
});
