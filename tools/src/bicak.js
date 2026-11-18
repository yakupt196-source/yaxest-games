// Yaxest Bıçak|<b>Dokun</b> ve bıçağı dönen tahtaya fırlat.<br>Başka bir bıçağa çarparsan biter! Her bölümde daha fazla bıçak.
const x=G.x;let rot,spd,stuck,left,lvl,flying,cx,cy,R,t,flash,dirT;
function load(){const n=Math.min(5+lvl,14);left=n;stuck=[];flying=null;rot=0;t=0;dirT=0;
 const pre=Math.min(lvl,6);for(let i=0;i<pre;i++)stuck.push(i/pre*6.28+G.rnd(-.15,.15))}
function speed(){const base=1.5+lvl*.18;const m=lvl%3;return m===0?base:m===1?base*(1+Math.sin(t*1.6)*.7):(Math.floor(t/2)%2?-1:1)*base}
G.run({key:'bicak',init(){lvl=0;cx=G.W/2;cy=G.H*.36;R=Math.min(G.W*.24,G.H*.16);load();flash=0},
 resize(){cx=G.W/2;cy=G.H*.36;R=Math.min(G.W*.24,G.H*.16)},
 down(){throw_()},key_(e,d){if(d&&e.key===' '){throw_();return true}},
 update(dt){t+=dt;flash=Math.max(0,flash-dt*4);rot+=speed()*dt;
  if(flying){flying.y-=1900*dt;if(flying.y<=cy+R+8){const a=((Math.PI/2-rot)%6.2832+6.2832)%6.2832;
    for(const s of stuck){let d=Math.abs(s-a)%6.2832;if(d>3.1416)d=6.2832-d;if(d<.17){flash=1;G.sfx('bad');flying=null;return G.over()}}
    stuck.push(a);flying=null;G.setScore(G.score+1);G.sfx('tap');try{YS.note(60+stuck.length%8*2,.2,.1)}catch(e){}
    if(left<=0){lvl++;G.bump();G.pause('Tahta parçalandı!','Bölüm <b>'+(lvl+1)+'</b> geliyor','Devam',()=>load())}}}},
 draw(){G.bg('#2a1408','#4a2410');
  const knife=(px,py,a,col)=>{x.save();x.translate(px,py);x.rotate(a);G.rrect(-3,0,6,R*.5,2,'#9aa5b8');x.fillStyle=col||'#e8edf5';x.beginPath();x.moveTo(-8,0);x.lineTo(8,0);x.lineTo(0,-R*.55);x.closePath();x.fill();x.restore()};
  x.save();x.translate(cx,cy);x.rotate(rot);G.circle(0,0,R,'#b8794a',flash?30:0);x.strokeStyle='#8a5530';x.lineWidth=3;for(let i=1;i<4;i++){x.beginPath();x.arc(0,0,R*i/4,0,7);x.stroke()}
  for(const a of stuck){x.save();x.rotate(a-Math.PI/2);x.translate(0,R-4);x.rotate(Math.PI);G.rrect(-3,-R*.42,6,R*.42,2,'#9aa5b8');x.fillStyle='#e8edf5';x.beginPath();x.moveTo(-8,-R*.42);x.lineTo(8,-R*.42);x.lineTo(0,-R*.95);x.closePath();x.fill();x.restore()}
  x.restore();
  const ky=flying?flying.y:G.H*.86;if(left>0||flying)knife(cx,ky,0);
  for(let i=0;i<left-(flying?0:1);i++){G.rrect(78+i*14,G.H-40,6,18,2,'#e8edf5')}
  G.text('Bölüm '+(lvl+1),G.W/2,G.H*.12,16,'rgba(255,255,255,.5)')}
});
function throw_(){if(flying||G.state!=='play'||left<=0)return;flying={y:G.H*.86};left--;G.sfx('jump')}
