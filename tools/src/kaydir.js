// Yaxest Kaydır|<b>Kaydır</b> (veya ok tuşları): taş buz üstünde bir şeye çarpana kadar kayar.<br>Yıldıza ulaş. Az hamleyle bitirirsen daha iyi!
const x=G.x;let cols,rows,cell,ox,oy,grid,px,py,goal,sx,sy,dir,moving,moves,minMoves,lvl,ax,ay,downP,flash;
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
function free(c,r){return c>=0&&r>=0&&c<cols&&r<rows&&!grid[r][c]}
function slide(c,r,d){while(free(c+d[0],r+d[1])){c+=d[0];r+=d[1];if(c===goal[0]&&r===goal[1])break}return [c,r]}
function solve(s){const q=[[s[0],s[1],0]],seen=new Set([s[0]+','+s[1]]);
 while(q.length){const [c,r,n]=q.shift();if(c===goal[0]&&r===goal[1])return n;for(const d of DIRS){const [a,b]=slide(c,r,d),k=a+','+b;if(!seen.has(k)){seen.add(k);q.push([a,b,n+1])}}}return -1}
function gen(){cols=5+Math.min(3,Math.floor(lvl/4));rows=cols+3;
 const lo=Math.min(3+Math.floor(lvl/2),12),hi=Math.min(lo+4,16);
 for(let t=0;t<400;t++){grid=[];for(let r=0;r<rows;r++){grid.push([]);for(let c=0;c<cols;c++)grid[r].push(Math.random()<.2+Math.min(.1,lvl*.01)?1:0)}
  const pick=()=>{for(let k=0;k<50;k++){const c=G.ri(0,cols-1),r=G.ri(0,rows-1);if(!grid[r][c])return [c,r]}return null};
  const s=pick(),g=pick();if(!s||!g||(s[0]===g[0]&&s[1]===g[1]))continue;goal=g;const m=solve(s);if(m>=lo&&m<=hi){sx=s[0];sy=s[1];minMoves=m;return}}
 grid=[];for(let r=0;r<rows;r++){grid.push(new Array(cols).fill(0))}sx=0;sy=0;goal=[cols-1,0];minMoves=1}
function layout(){cell=Math.min(G.W*.94/cols,G.H*.66/rows);ox=(G.W-cell*cols)/2;oy=G.H*.2}
function load(){gen();layout();px=sx;py=sy;ax=px;ay=py;moving=false;moves=0;flash=0}
function go(d){if(moving)return;const [c,r]=slide(px,py,d);if(c===px&&r===py)return;dir=d;px=c;py=r;moving=true;moves++;G.sfx('tap')}
G.run({key:'kaydir',resize(){if(grid)layout()},
 init(){lvl=0;load()},
 down(a,b){downP=[a,b]},
 up(a,b){if(!downP)return;const dx=a-downP[0],dy=b-downP[1];downP=null;if(Math.hypot(dx,dy)<24){if(b>G.H*.92){load()}return}go(Math.abs(dx)>Math.abs(dy)?(dx>0?DIRS[0]:DIRS[1]):(dy>0?DIRS[2]:DIRS[3]))},
 key_(e,d){if(!d)return;const m={ArrowRight:0,ArrowLeft:1,ArrowDown:2,ArrowUp:3,d:0,a:1,s:2,w:3}[e.key];if(m!=null){go(DIRS[m]);return true}if(e.key==='r'){load();return true}},
 update(dt){flash=Math.max(0,flash-dt*3);
  if(moving){const dxx=px-ax,dyy=py-ay,dd=Math.hypot(dxx,dyy),st=16*dt;if(dd<=st){ax=px;ay=py;moving=false;
    if(px===goal[0]&&py===goal[1]){lvl++;G.setScore(lvl);G.bump();const st=moves<=minMoves?'⭐⭐⭐':moves<=minMoves+2?'⭐⭐':'⭐';
     G.pause('Seviye tamam!',st+'<br>Hamle <b>'+moves+'</b> · En az <b>'+minMoves+'</b>','Sonraki seviye',()=>{load()})}else G.sfx('pop')}
   else{ax+=dxx/dd*st;ay+=dyy/dd*st}}},
 draw(){G.bg('#0a1330','#14305a');
  if(!grid)return;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const X=ox+c*cell,Y=oy+r*cell;
   if(grid[r][c]){G.rrect(X+2,Y+2,cell-4,cell-4,cell*.2,'#35507e');G.rrect(X+5,Y+5,cell-10,(cell-10)*.45,cell*.15,'rgba(255,255,255,.18)')}
   else G.rrect(X+1,Y+1,cell-2,cell-2,cell*.12,((r+c)&1)?'rgba(150,220,255,.1)':'rgba(150,220,255,.16)')}
  const gx=ox+goal[0]*cell+cell/2,gy=oy+goal[1]*cell+cell/2;x.save();x.translate(gx,gy);x.rotate(G.t*0.8);x.fillStyle='#ffd23f';x.shadowColor='#ffd23f';x.shadowBlur=14;x.beginPath();for(let i=0;i<10;i++){const rr=i%2?cell*.16:cell*.36,an=i*Math.PI/5;x.lineTo(Math.cos(an)*rr,Math.sin(an)*rr)}x.fill();x.restore();
  G.circle(ox+ax*cell+cell/2,oy+ay*cell+cell/2,cell*.32,'#ff5c8a',14);G.circle(ox+ax*cell+cell/2-cell*.09,oy+ay*cell+cell/2-cell*.08,cell*.07,'#fff');G.circle(ox+ax*cell+cell/2+cell*.1,oy+ay*cell+cell/2-cell*.08,cell*.07,'#fff');
  G.text('Hamle '+moves+' · En az '+minMoves,G.W/2,G.H*.895,17,'#c9c4ee');
  G.text('↺ yeniden (dokun)',G.W/2,G.H*.945,14,'rgba(255,255,255,.45)')}
});
