// Yaxest Damla|<b>Sürükle</b> ve bırak: aynı boydaki damlalar birleşip büyür.<br>Kap taşmasın! En büyük damlayı yapmaya çalış.
const x=G.x;let bl,cur,cx0,cw,floorY,topY,k,cool,warn,mx,R;
const COLS=['#ff5c8a','#ff9f43','#ffd23f','#3ddbb0','#3df0ff','#6aa8ff','#b388ff','#ff7ad9','#a3e635','#f6f3ff'];
const RAD=[13,17,22,28,35,43,52,62,73,85];
function layout(){cw=Math.min(G.W-24,380);cx0=(G.W-cw)/2;floorY=G.H-22;topY=G.H*.2;k=cw/360;R=i=>RAD[i]*k}
function mkNext(){cur={lv:G.pick([0,0,0,1,1,2,3]),x:mx}}
G.run({key:'damla',resize(){layout()},
 init(){layout();bl=[];mx=G.W/2;cool=0;warn=0;mkNext()},
 down(a){mx=a},move(a){mx=a},
 up(a){if(G.state!=='play'||cool>0||!cur)return;mx=a;const r=R(cur.lv);bl.push({x:G.clamp(mx,cx0+r,cx0+cw-r),y:topY-r,vx:0,vy:0,lv:cur.lv,r,age:0});cur=null;cool=.45;G.sfx('tap')},
 key_(e,d){if(!d)return;if(e.key==='ArrowLeft'){mx-=30;return true}if(e.key==='ArrowRight'){mx+=30;return true}if(e.key===' '||e.key==='ArrowDown'){this.up(mx);return true}},
 update(dt){cool-=dt;if(cool<=0&&!cur)mkNext();if(cur){const r=R(cur.lv);cur.x=G.clamp(mx,cx0+r,cx0+cw-r)}
  const N=3;for(let s=0;s<N;s++){const h=dt/N;
   for(const b of bl){b.vy+=1500*h;b.x+=b.vx*h;b.y+=b.vy*h;b.vx*=.998;b.age+=h;
    if(b.x<cx0+b.r){b.x=cx0+b.r;b.vx=Math.abs(b.vx)*.3}if(b.x>cx0+cw-b.r){b.x=cx0+cw-b.r;b.vx=-Math.abs(b.vx)*.3}
    if(b.y>floorY-b.r){b.y=floorY-b.r;b.vy=-Math.abs(b.vy)*.15;b.vx*=.97}}
   for(let it=0;it<2;it++)for(let i=0;i<bl.length;i++)for(let j=i+1;j<bl.length;j++){const a=bl[i],b=bl[j];if(a.dead||b.dead)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r;
    if(d<m&&d>.001){
     if(a.lv===b.lv&&a.lv<9){a.dead=b.dead=true;const nl=a.lv+1,r=R(nl);bl.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,vx:0,vy:-60,lv:nl,r,age:0});G.setScore(G.score+(nl+1)*(nl+1)/2|0);G.sfx('pop');try{window.YS&&YS.note(60+nl*2,.5,.08)}catch(e){}continue}
     const nx=dx/d,ny=dy/d,o=(m-d)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o;const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){const j2=-rv*.55;a.vx-=nx*j2;a.vy-=ny*j2;b.vx+=nx*j2;b.vy+=ny*j2}}}
   bl=bl.filter(b=>!b.dead)}
  let over=false;for(const b of bl)if(b.age>1&&b.y-b.r<topY&&Math.abs(b.vy)<60)over=true;
  warn=over?warn+dt:Math.max(0,warn-dt*2);if(warn>2)G.over()},
 draw(){G.bg('#150b30','#2b1450');
  G.rrect(cx0-6,topY-10,6,floorY-topY+16,3,'#6b6a9a');G.rrect(cx0+cw,topY-10,6,floorY-topY+16,3,'#6b6a9a');G.rrect(cx0-6,floorY,cw+12,8,3,'#6b6a9a');
  x.strokeStyle=warn>0?'rgba(255,92,138,'+(.4+Math.sin(G.t*14)*.3)+')':'rgba(255,255,255,.15)';x.setLineDash([8,8]);x.beginPath();x.moveTo(cx0,topY);x.lineTo(cx0+cw,topY);x.stroke();x.setLineDash([]);
  for(const b of bl){G.circle(b.x,b.y,b.r,COLS[b.lv],8);x.fillStyle='rgba(255,255,255,.28)';x.beginPath();x.arc(b.x-b.r*.3,b.y-b.r*.3,b.r*.3,0,7);x.fill();G.text(b.lv+1,b.x,b.y+1,b.r*.7,'rgba(20,16,43,.6)')}
  if(cur&&G.state==='play'){const r=R(cur.lv);x.strokeStyle='rgba(255,255,255,.2)';x.beginPath();x.moveTo(cur.x,topY);x.lineTo(cur.x,floorY);x.stroke();G.circle(cur.x,topY-r-6,r,COLS[cur.lv],10)}}
});
