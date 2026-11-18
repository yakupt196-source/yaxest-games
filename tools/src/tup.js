// Yaxest Tüp|Renkleri <b>tüplere sırala</b>: bir tüpe dokun, sonra hedef tüpe.<br>Sadece aynı renk üstüne dökebilirsin. Hepsi tek renk olunca biter!
const x=G.x;let tubes,sel,lvl,hist,moves,cap,lay;
const CL=['#ff5c8a','#ffd23f','#3ddbb0','#6aa8ff','#b388ff','#ff9f43','#a3e635','#3df0ff','#ff7ad9'];
function load(){const nc=Math.min(3+Math.floor(lvl/1.5),9);cap=4;const all=[];for(let c=0;c<nc;c++)for(let i=0;i<cap;i++)all.push(c);
 for(let i=all.length-1;i>0;i--){const j=G.ri(0,i);[all[i],all[j]]=[all[j],all[i]]}
 tubes=[];for(let c=0;c<nc;c++)tubes.push(all.slice(c*cap,c*cap+cap));tubes.push([],[]);sel=-1;hist=[];moves=0;layout()}
function layout(){if(!tubes)return;const n=tubes.length,per=n>6?Math.ceil(n/2):n,rows=n>6?2:1;const w=Math.min(G.W*.9/(per*1.35),rows===2?44:64);lay=[];
 for(let i=0;i<n;i++){const row=n>6?(i<per?0:1):0,idx=n>6?(i<per?i:i-per):i,cnt=n>6?(row?n-per:per):n;lay.push({x:(G.W-cnt*w*1.35)/2+idx*w*1.35+w*.175,y:G.H*(rows===2?(row?.52:.28):.38),w:w,h:cap*w*.78+12})}}
function ok(a,b){if(a===b||!tubes[a].length||tubes[b].length>=cap)return false;const c=tubes[a][tubes[a].length-1];return !tubes[b].length||tubes[b][tubes[b].length-1]===c}
function pour(a,b){hist.push(JSON.stringify(tubes));const c=tubes[a][tubes[a].length-1];while(tubes[a].length&&tubes[a][tubes[a].length-1]===c&&tubes[b].length<cap)tubes[b].push(tubes[a].pop());moves++;G.sfx('pop')}
function solved(){return tubes.every(t=>!t.length||(t.length===cap&&t.every(v=>v===t[0])))}
G.run({key:'tup',resize(){layout()},
 init(){lvl=0;load()},
 down(a,b){if(b>G.H*.8&&b<G.H*.88){const k=a<G.W/3?'u':a<G.W*2/3?'r':'p';
   if(k==='u'&&hist.length){tubes=JSON.parse(hist.pop());sel=-1;moves=Math.max(0,moves-1);G.sfx('tap')}
   else if(k==='r'){load()}
   else if(k==='p'&&tubes.length<14){hist.push(JSON.stringify(tubes));tubes.push([]);layout();G.sfx('tap')}return}
  for(let i=0;i<lay.length;i++){const L=lay[i];if(a>L.x-8&&a<L.x+L.w+8&&b>L.y-8&&b<L.y+L.h+8){
    if(sel<0){if(tubes[i].length){sel=i;G.sfx('tap')}}else{if(sel===i)sel=-1;else if(ok(sel,i)){pour(sel,i);sel=-1;if(solved()){lvl++;G.setScore(lvl);G.bump();G.pause('Sıralandı!','Hamle <b>'+moves+'</b>','Sonraki seviye',()=>load())}}else{G.sfx('bad');sel=tubes[i].length?i:-1}}return}}sel=-1},
 draw(){G.bg('#08142e','#10285a');if(!tubes)return;
  for(let i=0;i<tubes.length;i++){const L=lay[i],lift=sel===i?-14:0,cw=L.w;
   x.strokeStyle=sel===i?'#ffd23f':'rgba(255,255,255,.5)';x.lineWidth=3;x.beginPath();x.moveTo(L.x,L.y+lift);x.lineTo(L.x,L.y+L.h+lift-cw/2);x.arc(L.x+cw/2,L.y+L.h+lift-cw/2,cw/2,Math.PI,0,true);x.lineTo(L.x+cw,L.y+lift);x.stroke();
   const sh=(L.h-12)/cap;tubes[i].forEach((c,k)=>{G.rrect(L.x+3,L.y+L.h+lift-8-(k+1)*sh+2,cw-6,sh-3,6,CL[c])})}
  G.text('Hamle '+moves,G.W/2,G.H*.2,17,'#c9c4ee');
  const names=['↶ Geri','↺ Yeniden','＋ Tüp'];names.forEach((n,i)=>{G.rrect(G.W*(i/3)+8,G.H*.8,G.W/3-16,G.H*.075,12,'rgba(255,255,255,.1)');G.text(n,G.W*((i+.5)/3),G.H*.838,15,'#e8e4ff')})}
});
