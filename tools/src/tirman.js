// Yaxest Tırman|<b>Sürükle</b> (veya ← →): zıplayarak platformlardan yukarı tırman.<br>Yaylar seni uçurur, kırılganlara dikkat! Düşme.
const x=G.x;let p,plats,cam,topY,tx,maxH;
function add(y){const lv=Math.min(1,maxH/4000),t=Math.random();const type=t<.12*lv?'break':t<.28*lv?'move':'norm';plats.push({x:G.rnd(10,G.W-70),y,w:62,type,dx:G.rnd(40,80)*(Math.random()<.5?-1:1),spring:type==='norm'&&Math.random()<.08})}
G.run({key:'tirman',init(){p={x:G.W/2,y:G.H*.7,vy:-640,vx:0};cam=0;maxH=0;tx=p.x;plats=[{x:G.W/2-40,y:G.H*.8,w:80,type:'norm'}];topY=G.H*.8;while(topY>-G.H){topY-=G.rnd(55,95);add(topY)}},
 down(a){tx=a},move(a){tx=a},
 key_(e,d){if(!d)return;if(e.key==='ArrowLeft'){tx=p.x-120;return true}if(e.key==='ArrowRight'){tx=p.x+120;return true}},
 update(dt){const gap=Math.min(118,70+maxH/70);
  p.vy+=1550*dt;p.y+=p.vy*dt;p.x+=(tx-p.x)*Math.min(1,dt*9);if(p.x<-10)p.x=G.W+10;if(p.x>G.W+10)p.x=-10;
  for(const q of plats){if(q.type==='move'){q.x+=q.dx*dt;if(q.x<0||q.x>G.W-q.w)q.dx*=-1}
   if(!q.gone&&p.vy>0&&p.y+14>q.y&&p.y+14<q.y+16+p.vy*dt&&p.x>q.x-8&&p.x<q.x+q.w+8){if(q.type==='break'){q.gone=true;G.sfx('bad')}else{p.vy=q.spring?-1100:-640;G.sfx(q.spring?'good':'jump')}}}
  const h=Math.max(0,-(p.y-G.H*.7)+cam);if(p.y<G.H*.4){const d=G.H*.4-p.y;p.y+=d;cam+=d;for(const q of plats)q.y+=d;topY+=d}
  const sc=Math.floor(cam/10);if(sc>G.score)G.setScore(sc);maxH=cam;
  while(topY>-60){topY-=G.rnd(gap*.6,gap);add(topY)}plats=plats.filter(q=>q.y<G.H+40&&!q.gone);
  if(p.y>G.H+30)G.over()},
 draw(){G.bg('#0a2a4a','#1a5a8a');
  for(let i=0;i<14;i++){const cy=((i*131+cam*.25)%(G.H+60))-30;x.fillStyle='rgba(255,255,255,.07)';x.beginPath();x.ellipse((i*83)%G.W,cy,34,12,0,0,7);x.fill()}
  for(const q of plats){const col=q.type==='move'?'#6aa8ff':q.type==='break'?'#c98a5a':'#3ddbb0';G.rrect(q.x,q.y,q.w,12,6,col);if(q.spring){G.rrect(q.x+q.w/2-9,q.y-9,18,9,3,'#ffd23f')}}
  if(p){G.circle(p.x,p.y,13,'#ff5c8a',10);G.circle(p.x-4,p.y-3,3,'#fff');G.circle(p.x+4,p.y-3,3,'#fff')}}
});
