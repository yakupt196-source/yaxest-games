// Yaxest Labirent|Karanlık bir labirent! <b>Parmağını sürükle</b>, çıkışı bul.<br>Süre bitmeden yeşil kapıya ulaş.
const x=G.x;let N,cs,ox,oy,walls,seen,px,py,tx,ty,exit,time,lvl,joy,keys={},ex;
function carve(){walls=[];for(let r=0;r<N;r++){walls.push([]);for(let c=0;c<N;c++)walls[r].push({n:1,e:1,s:1,w:1,v:0})}
 const st=[[0,0]];walls[0][0].v=1;while(st.length){const [c,r]=st[st.length-1];const nb=[];
  if(r>0&&!walls[r-1][c].v)nb.push([c,r-1,'n','s']);if(c<N-1&&!walls[r][c+1].v)nb.push([c+1,r,'e','w']);if(r<N-1&&!walls[r+1][c].v)nb.push([c,r+1,'s','n']);if(c>0&&!walls[r][c-1].v)nb.push([c-1,r,'w','e']);
  if(!nb.length){st.pop();continue}const [nc,nr,a,b]=G.pick(nb);walls[r][c][a]=0;walls[nr][nc][b]=0;walls[nr][nc].v=1;st.push([nc,nr])}
 // biraz duvar kır
 for(let i=0;i<N*2;i++){const c=G.ri(0,N-2),r=G.ri(0,N-2);walls[r][c].e=0;walls[r][c+1].w=0}}
function load(){N=Math.min(5+lvl,16);carve();cs=Math.min(G.W*.94/N,G.H*.62/N);ox=(G.W-cs*N)/2;oy=G.H*.26;seen=[];for(let r=0;r<N;r++)seen.push(new Array(N).fill(0));
 px=cs*.5;py=cs*.5;exit=[N-1,N-1];time=N*5+8+Math.max(0,14-lvl*2);joy=null}
function wallHit(nx,ny){const r0=cs*.2,c=Math.floor(nx/cs),r=Math.floor(ny/cs);if(c<0||r<0||c>=N||r>=N)return true;const w=walls[r][c],lx=nx-c*cs,ly=ny-r*cs;
 if(w.w&&lx<r0)return true;if(w.e&&lx>cs-r0)return true;if(w.n&&ly<r0)return true;if(w.s&&ly>cs-r0)return true;return false}
G.run({key:'labirent',resize(){if(walls){cs=Math.min(G.W*.94/N,G.H*.62/N);ox=(G.W-cs*N)/2}},
 init(){lvl=0;load()},
 down(a,b){joy={x:a,y:b,dx:0,dy:0}},move(a,b){if(joy){joy.dx=a-joy.x;joy.dy=b-joy.y;const l=Math.hypot(joy.dx,joy.dy);if(l>60){joy.x=a-joy.dx/l*60;joy.y=b-joy.dy/l*60;joy.dx=a-joy.x;joy.dy=b-joy.y}}},up(){joy=null},
 key_(e,d){const m={ArrowLeft:'l',ArrowRight:'r',ArrowUp:'u',ArrowDown:'d',a:'l',d:'r',w:'u',s:'d'}[e.key];if(m){keys[m]=d;return true}},
 update(dt){time-=dt;if(time<=0)return G.over('Süre bitti');
  let vx=(keys.r?1:0)-(keys.l?1:0),vy=(keys.d?1:0)-(keys.u?1:0);if(joy){vx+=G.clamp(joy.dx/40,-1,1);vy+=G.clamp(joy.dy/40,-1,1)}
  const l=Math.hypot(vx,vy);if(l>1){vx/=l;vy/=l}const sp=cs*4.2*dt,sx=vx*sp,sy=vy*sp;
  if(!wallHit(px+sx,py))px+=sx;if(!wallHit(px,py+sy))py+=sy;
  const pc=Math.floor(px/cs),pr=Math.floor(py/cs);for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){const r=pr+dr,c=pc+dc;if(r>=0&&c>=0&&r<N&&c<N)seen[r][c]=1}
  if(pc===exit[0]&&pr===exit[1]){lvl++;G.setScore(lvl);G.bump();G.pause('Çıkış bulundu!','Seviye <b>'+(lvl+1)+'</b> daha büyük','Devam',()=>load())}},
 draw(){G.bg('#05070f','#0b1024');if(!walls)return;x.save();x.translate(ox,oy);
  const pc=px/cs,pr=py/cs;
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){const d=Math.hypot(c+.5-pc,r+.5-pr);const vis=Math.max(seen[r][c]?.28:0,Math.max(0,1-d/2.6));if(vis<=0)continue;
   x.globalAlpha=vis;x.fillStyle='#16203f';x.fillRect(c*cs,r*cs,cs,cs);
   x.strokeStyle='#6aa8ff';x.lineWidth=Math.max(2,cs*.08);x.lineCap='round';const w=walls[r][c],X=c*cs,Y=r*cs;x.beginPath();
   if(w.n){x.moveTo(X,Y);x.lineTo(X+cs,Y)}if(w.w){x.moveTo(X,Y);x.lineTo(X,Y+cs)}if(c===N-1&&w.e){x.moveTo(X+cs,Y);x.lineTo(X+cs,Y+cs)}if(r===N-1&&w.s){x.moveTo(X,Y+cs);x.lineTo(X+cs,Y+cs)}
   if(w.e&&c<N-1){x.moveTo(X+cs,Y);x.lineTo(X+cs,Y+cs)}if(w.s&&r<N-1){x.moveTo(X,Y+cs);x.lineTo(X+cs,Y+cs)}x.stroke()}
  x.globalAlpha=1;const dE=Math.hypot(exit[0]+.5-pc,exit[1]+.5-pr);if(dE<2.6||seen[exit[1]][exit[0]])G.circle((exit[0]+.5)*cs,(exit[1]+.5)*cs,cs*.28,'#3ddbb0',10+Math.sin(G.t*5)*6);
  G.circle(px,py,cs*.18,'#ffd23f',16);x.restore();
  G.text(Math.ceil(time)+' sn',G.W/2,G.H*.2,22,time<8?'#ff5c8a':'#c9c4ee')}
});
