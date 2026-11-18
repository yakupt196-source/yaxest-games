// Yaxest Zincir|Toplar uçuşuyor. <b>Tek bir dokunuş</b> ile zincirleme patlama başlat.<br>Hedef sayıya ulaşırsan bölüm geçilir. Tek hakkın var!
const x=G.x;let balls,booms,lvl,need,used,popped,done,wait;
const CL=['#ff5c8a','#ffd23f','#3ddbb0','#6aa8ff','#b388ff','#ff9f43'];
function load(){const n=Math.min(10+lvl*4,50);need=Math.min(n-1,Math.ceil(n*(.3+Math.min(.35,lvl*.03))));balls=[];booms=[];used=false;popped=0;done=false;wait=0;
 for(let i=0;i<n;i++){const a=G.rnd(0,6.28),s=G.rnd(40,90);balls.push({x:G.rnd(20,G.W-20),y:G.rnd(G.H*.18,G.H*.88),vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:9,c:G.pick(CL)})}}
function boom(px,py,c){booms.push({x:px,y:py,r:5,max:Math.min(70,48+lvl*1.5),ph:0,c,t:0})}
G.run({key:'zincir',init(){lvl=0;load()},
 down(a,b){if(used||G.state!=='play')return;used=true;boom(a,b,'#fff');G.sfx('pop')},
 key_(e,d){if(d&&e.key===' '&&!used){used=true;boom(G.W/2,G.H/2,'#fff');return true}},
 update(dt){for(const b of balls){b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<b.r||b.x>G.W-b.r)b.vx*=-1;if(b.y<G.H*.15||b.y>G.H-b.r)b.vy*=-1;b.x=G.clamp(b.x,b.r,G.W-b.r);b.y=G.clamp(b.y,G.H*.15,G.H-b.r)}
  for(const e of booms){e.t+=dt;if(e.ph===0){e.r+=(e.max-e.r)*Math.min(1,dt*9);if(e.r>e.max-1.5){e.ph=1;e.hold=.9}}else if(e.ph===1){e.hold-=dt;if(e.hold<=0)e.ph=2}else{e.r-=e.max*dt*2.2;if(e.r<=0)e.dead=true}
   if(e.ph<2)for(const b of balls){if(!b.dead&&Math.hypot(b.x-e.x,b.y-e.y)<e.r+b.r){b.dead=true;popped++;boom(b.x,b.y,b.c);G.sfx('pop');try{YS.note(60+Math.min(24,popped*2),.3,.08)}catch(er){}}}}
  balls=balls.filter(b=>!b.dead);booms=booms.filter(e=>!e.dead);
  if(used&&!done&&!booms.length){done=true;if(popped>=need){lvl++;G.setScore(lvl);G.bump();G.pause('Bölüm tamam!','<b>'+popped+'</b> top patlattın','Sonraki',()=>load())}else{G.sfx('bad');G.over('Yetmedi')}}},
 draw(){G.bg('#14062e','#2a0f4d');
  for(const e of booms){x.globalAlpha=Math.min(1,e.r/e.max+.2)*.55;G.circle(e.x,e.y,e.r,e.c,20);x.globalAlpha=1}
  for(const b of balls)G.circle(b.x,b.y,b.r,b.c,8);
  G.text('Patlat: '+popped+' / '+need,G.W/2,G.H*.115,20,popped>=need?'#3ddbb0':'#c9c4ee');
  if(!used&&G.state==='play')G.text('Bir kez dokun!',G.W/2,G.H*.95,16,'rgba(255,255,255,.5)')}
});
