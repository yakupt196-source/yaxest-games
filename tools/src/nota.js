// Yaxest Nota|Melodiyi <b>dinle</b>, sonra aynısını <b>çal</b>.<br>Her turda bir nota uzar. Ne kadar uzun hatırlarsın?
const x=G.x;let seq,pos,phase,lit,timer,round,step,pads;
const COLS=['#ff5c8a','#ffd23f','#3ddbb0','#6aa8ff'],NOTES=[60,64,67,72];
function layout(){const s=Math.min(G.W*.42,G.H*.26);pads=[];const cx=G.W/2,cy=G.H*.5;for(let i=0;i<4;i++)pads.push({x:cx+(i%2?1:-1)*(s*.54),y:cy+(i<2?-1:1)*(s*.54),s:s})}
function play(i,d){lit=i;timer=d||.35;try{YS.note(NOTES[i],.6,.18)}catch(e){}}
function next(){seq.push(G.ri(0,3));phase='show';step=0;timer=.7;lit=-1;round=seq.length}
G.run({key:'nota',resize(){layout()},
 init(){layout();seq=[];next();pos=0;G.setScore(0)},
 down(a,b){if(phase!=='in')return;for(let i=0;i<4;i++){const p=pads[i];if(Math.abs(a-p.x)<p.s/2&&Math.abs(b-p.y)<p.s/2){press(i);return}}},
 key_(e,d){if(!d||phase!=='in')return;const i='1234'.indexOf(e.key);if(i>=0){press(i);return true}const m={ArrowUp:0,ArrowRight:1,ArrowLeft:2,ArrowDown:3}[e.key];if(m!=null){press(m);return true}},
 update(dt){timer-=dt;
  if(phase==='show'){if(timer<=0){if(lit>=0){lit=-1;timer=Math.max(.12,.22-round*.004)}else if(step<seq.length){play(seq[step],Math.max(.2,.4-round*.012));step++;timer=Math.max(.2,.4-round*.012)}else{phase='in';pos=0;lit=-1}}}
  else if(phase==='in'){if(lit>=0&&timer<=0)lit=-1}
  else if(phase==='ok'&&timer<=0){next()}},
 draw(){G.bg('#0a1330','#20104a');
  const d=['↑','→','←','↓'];
  for(let i=0;i<4;i++){const p=pads[i],on=lit===i;x.save();if(on){x.shadowColor=COLS[i];x.shadowBlur=36}G.rrect(p.x-p.s/2+3,p.y-p.s/2+3,p.s-6,p.s-6,p.s*.16,on?COLS[i]:COLS[i]+'55');x.restore()}
  G.text(phase==='show'?'Dinle…':phase==='in'?'Sıra sende':'',G.W/2,G.H*.22,22,'#c9c4ee');G.text('Tur '+round,G.W/2,G.H*.86,18,'rgba(255,255,255,.5)')}
});
function press(i){play(i,.25);if(seq[pos]!==i){G.sfx('bad');phase='dead';setTimeout(()=>G.over('Yanlış nota'),350);return}pos++;if(pos>=seq.length){G.setScore(seq.length);G.bump();phase='ok';timer=.7;G.sfx('good')}}
