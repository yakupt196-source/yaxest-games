// Yaxest Tüp|Renkleri <b>tüplere sırala</b>: bir tüpe dokun, sonra hedef tüpe.<br>Sadece aynı renk üstüne dökebilirsin. Hepsi tek renk olunca biter!
const x=G.x;let tubes,sel,lvl,hist,moves,cap,lay,used=0,msg='',msgT=0,hint=null,hintT=0;
const YX_=()=>window.YX;
const CL=['#ff5c8a','#ffd23f','#3ddbb0','#6aa8ff','#b388ff','#ff9f43','#a3e635','#3df0ff','#ff7ad9'];
function load(){const nc=Math.min(3+Math.floor(lvl/1.5),9);cap=4;const all=[];for(let c=0;c<nc;c++)for(let i=0;i<cap;i++)all.push(c);
 for(let i=all.length-1;i>0;i--){const j=G.ri(0,i);[all[i],all[j]]=[all[j],all[i]]}
 tubes=[];for(let c=0;c<nc;c++)tubes.push(all.slice(c*cap,c*cap+cap));tubes.push([],[]);sel=-1;hist=[];moves=0;used=0;hint=null;layout()}
function say(t){msg=t;msgT=2.2}
function cost(){const y=YX_();return y?y.tubeCost(used):0}
function pay(n){const y=YX_();if(!y||n<=0)return true;if(y.spend(n))return true;say('Yetersiz jeton: 🪙 '+n+' gerekli');G.sfx('bad');return false}
function findHint(){let best=null,bs=0;for(let a=0;a<tubes.length;a++){const A=tubes[a];if(!A.length)continue;const mono=A.every(v=>v===A[0]);for(let b=0;b<tubes.length;b++){if(!ok(a,b))continue;const B=tubes[b];let sc=0;if(B.length)sc=mono&&A.length===cap?0:2;else if(!mono)sc=1;if(!sc)continue;sc+=Math.random()*.5;if(sc>bs){bs=sc;best=[a,b]}}}return best}
function layout(){if(!tubes)return;const n=tubes.length,per=n>6?Math.ceil(n/2):n,rows=n>6?2:1;const w=Math.min(G.W*.9/(per*1.35),rows===2?44:64);lay=[];
 for(let i=0;i<n;i++){const row=n>6?(i<per?0:1):0,idx=n>6?(i<per?i:i-per):i,cnt=n>6?(row?n-per:per):n;lay.push({x:(G.W-cnt*w*1.35)/2+idx*w*1.35+w*.175,y:G.H*(rows===2?(row?.52:.28):.38),w:w,h:cap*w*.78+12})}}
function ok(a,b){if(a===b||!tubes[a].length||tubes[b].length>=cap)return false;const c=tubes[a][tubes[a].length-1];return !tubes[b].length||tubes[b][tubes[b].length-1]===c}
function pour(a,b){hist.push(JSON.stringify(tubes));const c=tubes[a][tubes[a].length-1];while(tubes[a].length&&tubes[a][tubes[a].length-1]===c&&tubes[b].length<cap)tubes[b].push(tubes[a].pop());moves++;G.sfx('pop')}
function solved(){return tubes.every(t=>!t.length||(t.length===cap&&t.every(v=>v===t[0])))}
G.run({key:'tup',resize(){layout()},
 init(){lvl=0;load()},
 update(dt){if(msgT>0)msgT-=dt;if(hintT>0){hintT-=dt;if(hintT<=0)hint=null}},
 down(a,b){if(b>G.H*.8&&b<G.H*.88){const k=a<G.W/4?'u':a<G.W/2?'r':a<G.W*3/4?'p':'h';
   if(k==='u'&&hist.length){tubes=JSON.parse(hist.pop());sel=-1;moves=Math.max(0,moves-1);G.sfx('tap')}
   else if(k==='r'){load()}
   else if(k==='p'){if(tubes.length>=14){say('En fazla 14 tüp');return}const c=cost();if(!pay(c))return;hist.push(JSON.stringify(tubes));tubes.push([]);used++;layout();G.sfx('tap');if(c>0)say('−'+c+' 🪙')}
   else if(k==='h'){const hp=findHint();if(!hp){say('Hamle kalmadı: geri al ya da tüp ekle');return}const hc=YX_()?YX_().hintCost():0;if(!pay(hc))return;hint=hp;hintT=3;G.sfx('good')}return}
  for(let i=0;i<lay.length;i++){const L=lay[i];if(a>L.x-8&&a<L.x+L.w+8&&b>L.y-8&&b<L.y+L.h+8){
    if(sel<0){if(tubes[i].length){sel=i;G.sfx('tap')}}else{if(sel===i)sel=-1;else if(ok(sel,i)){pour(sel,i);sel=-1;if(solved()){lvl++;G.setScore(lvl);G.bump();G.pause('Sıralandı!','Hamle <b>'+moves+'</b>','Sonraki seviye',()=>load())}}else{G.sfx('bad');sel=tubes[i].length?i:-1}}return}}sel=-1},
 draw(){G.bg('#08142e','#10285a');if(!tubes)return;
  for(let i=0;i<tubes.length;i++){const L=lay[i],lift=sel===i?-14:0,cw=L.w;
   const hl=hint&&hintT>0&&(hint[0]===i||hint[1]===i);x.strokeStyle=sel===i||hl?(hl&&hint[1]===i?'#3ddbb0':'#ffd23f'):'rgba(255,255,255,.5)';x.lineWidth=3;x.beginPath();x.moveTo(L.x,L.y+lift);x.lineTo(L.x,L.y+L.h+lift-cw/2);x.arc(L.x+cw/2,L.y+L.h+lift-cw/2,cw/2,Math.PI,0,true);x.lineTo(L.x+cw,L.y+lift);x.stroke();
   const sh=(L.h-12)/cap;tubes[i].forEach((c,k)=>{G.rrect(L.x+3,L.y+L.h+lift-8-(k+1)*sh+2,cw-6,sh-3,6,CL[c])})}
  G.text('Hamle '+moves,G.W/2,G.H*.2,17,'#c9c4ee');
  const nm=['↶ Geri','↺ Yeniden','＋ Tüp','💡 İpucu'],c=cost(),hc=YX_()?YX_().hintCost():0,sub=['','',c>0?'🪙 '+c:'Bedava','🪙 '+hc];
  nm.forEach((n,i)=>{const bx=G.W*(i/4)+5,bw=G.W/4-10;G.rrect(bx,G.H*.8,bw,G.H*.075,12,'rgba(255,255,255,.1)');G.text(n,G.W*((i+.5)/4),G.H*(sub[i]?.824:.838),13,'#e8e4ff');if(sub[i])G.text(sub[i],G.W*((i+.5)/4),G.H*.857,12,sub[i]==='Bedava'?'#3ddbb0':'#ffd23f')});
  if(msgT>0)G.text(msg,G.W/2,G.H*.74,15,'#ff9fb5')}
});
