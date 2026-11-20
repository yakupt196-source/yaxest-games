/* Yaxest Satranç motoru: 0x88 tahta, tam kurallar (rok, en passant, terfi, pat, mat, 50 hamle, tekrar, yetersiz taş) ve basit yapay zekâ. */
(function(root){
'use strict';
var P=1,N=2,B=3,R=4,Q=5,K=6;
var EP=2,CASTLE=4;
var DN=[-33,-31,-18,-14,14,18,31,33],DB=[-17,-15,15,17],DR=[-16,-1,1,16],DK=DB.concat(DR);
var CH={1:'p',2:'n',3:'b',4:'r',5:'q',6:'k'};
var VAL={1:100,2:320,3:330,4:500,5:900,6:0};
function on(s){return(s&0x88)===0}
function sqName(s){return'abcdefgh'[s&7]+((s>>4)+1)}
function parseSq(n){return(n.charCodeAt(0)-97)+(n.charCodeAt(1)-49)*16}

function fromFen(fen){
  var f=fen.split(' '),b=new Array(128).fill(0),k={1:-1,'-1':-1},r=7,c=0;
  for(var i=0;i<f[0].length;i++){var ch=f[0][i];
    if(ch==='/'){r--;c=0}else if(ch>='1'&&ch<='8'){c+=+ch}
    else{var low=ch.toLowerCase(),t='pnbrqk'.indexOf(low)+1,col=ch===low?-1:1;b[r*16+c]=col*t;if(t===K)k[col]=r*16+c;c++}}
  var cs=f[2]||'-',cm=0;if(cs.indexOf('K')>=0)cm|=1;if(cs.indexOf('Q')>=0)cm|=2;if(cs.indexOf('k')>=0)cm|=4;if(cs.indexOf('q')>=0)cm|=8;
  var st={b:b,turn:f[1]==='b'?-1:1,castle:cm,ep:f[3]&&f[3]!=='-'?parseSq(f[3]):-1,half:+f[4]||0,full:+f[5]||1,k:k,rep:{}};
  st.rep[key(st)]=1;return st}
function toFen(st){var s='';for(var r=7;r>=0;r--){var e=0;for(var c=0;c<8;c++){var v=st.b[r*16+c];if(!v)e++;else{if(e){s+=e;e=0}var ch=CH[Math.abs(v)];s+=v>0?ch.toUpperCase():ch}}if(e)s+=e;if(r)s+='/'}
  var cs=(st.castle&1?'K':'')+(st.castle&2?'Q':'')+(st.castle&4?'k':'')+(st.castle&8?'q':'');
  return s+' '+(st.turn===1?'w':'b')+' '+(cs||'-')+' '+(st.ep>=0?sqName(st.ep):'-')+' '+st.half+' '+st.full}
function key(st){var s='';for(var i=0;i<128;i++)if(on(i))s+=st.b[i]+',';return s+st.turn+'|'+st.castle+'|'+(st.ep>=0&&epPossible(st)?st.ep:-1)}
function epPossible(st){var t=st.turn,e=st.ep;if(e<0)return false;var a=e-t*16-1,b2=e-t*16+1;return(on(a)&&st.b[a]===t*P)||(on(b2)&&st.b[b2]===t*P)}
function startPos(){return fromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')}

function attacked(b,sq,by){
  if(by===1){if(on(sq-15)&&b[sq-15]===P)return true;if(on(sq-17)&&b[sq-17]===P)return true}
  else{if(on(sq+15)&&b[sq+15]===-P)return true;if(on(sq+17)&&b[sq+17]===-P)return true}
  var i,d,s,v;
  for(i=0;i<8;i++){s=sq+DN[i];if(on(s)&&b[s]===by*N)return true}
  for(i=0;i<8;i++){s=sq+DK[i];if(on(s)&&b[s]===by*K)return true}
  for(i=0;i<4;i++){d=DB[i];s=sq+d;while(on(s)){v=b[s];if(v){if(v===by*B||v===by*Q)return true;break}s+=d}}
  for(i=0;i<4;i++){d=DR[i];s=sq+d;while(on(s)){v=b[s];if(v){if(v===by*R||v===by*Q)return true;break}s+=d}}
  return false}
function inCheck(st,side){return attacked(st.b,st.k[side],-side)}

function pseudo(st,caps){
  var b=st.b,side=st.turn,out=[],i,j,s,d,v;
  for(var f=0;f<128;f++){if(!on(f))continue;var pc=b[f];if(!pc||(pc>0?1:-1)!==side)continue;var a=Math.abs(pc);
    if(a===P){var fw=side*16,r=f>>4,start=side===1?1:6,last=side===1?6:1;
      s=f+fw;
      if(!caps&&on(s)&&!b[s]){if(r===last){for(j=Q;j>=N;j--)out.push({f:f,t:s,p:j,fl:0})}else{out.push({f:f,t:s,p:0,fl:0});if(r===start&&!b[s+fw])out.push({f:f,t:s+fw,p:0,fl:1})}}
      for(i=-1;i<=1;i+=2){s=f+fw+i;if(!on(s))continue;v=b[s];
        if(v&&(v>0?1:-1)===-side){if(r===last){for(j=Q;j>=N;j--)out.push({f:f,t:s,p:j,fl:0})}else out.push({f:f,t:s,p:0,fl:0})}
        else if(s===st.ep&&!v)out.push({f:f,t:s,p:0,fl:EP})}}
    else if(a===N||a===K){var D=a===N?DN:DK;for(i=0;i<8;i++){s=f+D[i];if(!on(s))continue;v=b[s];if(!v){if(!caps)out.push({f:f,t:s,p:0,fl:0})}else if((v>0?1:-1)===-side)out.push({f:f,t:s,p:0,fl:0})}}
    else{var D2=a===B?DB:a===R?DR:DK,n=D2.length;for(i=0;i<n;i++){d=D2[i];s=f+d;while(on(s)){v=b[s];if(!v){if(!caps)out.push({f:f,t:s,p:0,fl:0})}else{if((v>0?1:-1)===-side)out.push({f:f,t:s,p:0,fl:0});break}s+=d}}}}
  if(!caps){var kf=st.k[side],home=side===1?4:116;
    if(kf===home&&!attacked(b,kf,-side)){
      if((st.castle&(side===1?1:4))&&!b[kf+1]&&!b[kf+2]&&b[kf+3]===side*R&&!attacked(b,kf+1,-side)&&!attacked(b,kf+2,-side))out.push({f:kf,t:kf+2,p:0,fl:CASTLE});
      if((st.castle&(side===1?2:8))&&!b[kf-1]&&!b[kf-2]&&!b[kf-3]&&b[kf-4]===side*R&&!attacked(b,kf-1,-side)&&!attacked(b,kf-2,-side))out.push({f:kf,t:kf-2,p:0,fl:CASTLE})}}
  return out}

function make(st,m){var b=st.b,side=st.turn,pc=b[m.f],a=Math.abs(pc),
  u={cap:b[m.t],ep:st.ep,castle:st.castle,half:st.half,full:st.full,kw:st.k[1],kb:st.k[-1],m:m,pc:pc,key:null};
  b[m.f]=0;b[m.t]=m.p?side*m.p:pc;
  if(m.fl&EP){u.epsq=m.t-side*16;u.epcap=b[u.epsq];b[u.epsq]=0}
  if(m.fl&CASTLE){if(m.t>m.f){b[m.f+1]=b[m.f+3];b[m.f+3]=0}else{b[m.f-1]=b[m.f-4];b[m.f-4]=0}}
  if(a===K)st.k[side]=m.t;
  var c=st.castle;
  if(a===K)c&=side===1?~3:~12;
  if(m.f===0||m.t===0)c&=~2;if(m.f===7||m.t===7)c&=~1;if(m.f===112||m.t===112)c&=~8;if(m.f===119||m.t===119)c&=~4;
  st.castle=c;
  st.ep=(a===P&&(m.t-m.f===32||m.t-m.f===-32))?m.f+side*16:-1;
  st.half=(a===P||u.cap||(m.fl&EP))?0:st.half+1;
  if(side===-1)st.full++;
  st.turn=-side;return u}
function unmake(st,u){var m=u.m,b=st.b;st.turn=-st.turn;var side=st.turn;
  b[m.f]=u.pc;b[m.t]=u.cap;
  if(m.fl&EP){b[u.epsq]=u.epcap}
  if(m.fl&CASTLE){if(m.t>m.f){b[m.f+3]=b[m.f+1];b[m.f+1]=0}else{b[m.f-4]=b[m.f-1];b[m.f-1]=0}}
  st.ep=u.ep;st.castle=u.castle;st.half=u.half;st.full=u.full;st.k[1]=u.kw;st.k[-1]=u.kb}
function legal(st){var ms=pseudo(st,false),out=[],side=st.turn;
  for(var i=0;i<ms.length;i++){var u=make(st,ms[i]);var ok=!attacked(st.b,st.k[side],-side);unmake(st,u);if(ok)out.push(ms[i])}
  return out}
function perft(st,d){if(d===0)return 1;var ms=legal(st),n=0;if(d===1)return ms.length;for(var i=0;i<ms.length;i++){var u=make(st,ms[i]);n+=perft(st,d-1);unmake(st,u)}return n}

function insufficient(st){var minor=0,w=0,bl=0,wb=[],bb=[];
  for(var i=0;i<128;i++){if(!on(i))continue;var v=st.b[i];if(!v)continue;var a=Math.abs(v);if(a===K)continue;if(a===P||a===R||a===Q)return false;minor++;if(a===B){((i>>4)+(i&7))%2?bb.push(v):wb.push(v)}}
  if(minor<=1)return true;
  var all=0,nb=0;for(i=0;i<128;i++){if(on(i)&&st.b[i]&&Math.abs(st.b[i])===N)nb++}
  if(nb===0){var sq=null,mixed=false;for(i=0;i<128;i++){if(on(i)&&Math.abs(st.b[i])===B){var col=((i>>4)+(i&7))%2;if(sq===null)sq=col;else if(sq!==col)mixed=true}}return !mixed}
  return false}
/* Oyun durumu: null | {r:'mat'|'pat'|'50'|'tekrar'|'yetersiz', winner:1|-1|0} */
function status(st){var ms=legal(st);if(!ms.length){return inCheck(st,st.turn)?{r:'mat',winner:-st.turn}:{r:'pat',winner:0}}
  if(st.half>=100)return{r:'50',winner:0};if(st.rep[key(st)]>=3)return{r:'tekrar',winner:0};if(insufficient(st))return{r:'yetersiz',winner:0};return null}
function play(st,f,t,promo){var ms=legal(st);for(var i=0;i<ms.length;i++){var m=ms[i];if(m.f===f&&m.t===t&&(!m.p||m.p===(promo||Q))){var cap=st.b[t]||(m.fl&EP?-st.turn:0);make(st,m);var k=key(st);st.rep[k]=(st.rep[k]||0)+1;m.cap=cap;return m}}return null}

/* ---- yapay zekâ ---- */
var PST={1:[0,0,0,0,0,0,0,0,5,10,10,-20,-20,10,10,5,5,-5,-10,0,0,-10,-5,5,0,0,0,20,20,0,0,0,5,5,10,25,25,10,5,5,10,10,20,30,30,20,10,10,50,50,50,50,50,50,50,50,0,0,0,0,0,0,0,0],
 2:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,5,5,0,-20,-40,-30,5,10,15,15,10,5,-30,-30,0,15,20,20,15,0,-30,-30,5,15,20,20,15,5,-30,-30,0,10,15,15,10,0,-30,-40,-20,0,0,0,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
 3:[-20,-10,-10,-10,-10,-10,-10,-20,-10,5,0,0,0,0,5,-10,-10,10,10,10,10,10,10,-10,-10,0,10,10,10,10,0,-10,-10,5,5,10,10,5,5,-10,-10,0,5,10,10,5,0,-10,-10,0,0,0,0,0,0,-10,-20,-10,-10,-10,-10,-10,-10,-20],
 4:[0,0,0,5,5,0,0,0,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,5,10,10,10,10,10,10,5,0,0,0,0,0,0,0,0],
 5:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,5,0,0,0,0,-10,-10,5,5,5,5,5,0,-10,0,0,5,5,5,5,0,-5,-5,0,5,5,5,5,0,-5,-10,0,5,5,5,5,0,-10,-10,0,0,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
 6:[20,30,10,0,0,10,30,20,20,20,0,0,0,0,20,20,-10,-20,-20,-20,-20,-20,-20,-10,-20,-30,-30,-40,-40,-30,-30,-20,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30]};
function evalPos(st){var s=0;for(var i=0;i<128;i++){if(!on(i))continue;var v=st.b[i];if(!v)continue;var a=Math.abs(v),sd=v>0?1:-1,r=i>>4,c=i&7,idx=(sd===1?r:7-r)*8+c;s+=sd*(VAL[a]+PST[a][idx])}return s*st.turn}
var nodes=0,limit=0,aborted=false;
function order(st,ms){for(var i=0;i<ms.length;i++){var m=ms[i],v=st.b[m.t],sc=0;if(v)sc=10*VAL[Math.abs(v)]-VAL[Math.abs(st.b[m.f])]/10;if(m.p)sc+=VAL[m.p];m.s=sc}ms.sort(function(a,b){return b.s-a.s})}
function quiesce(st,al,be,q){nodes++;var st0=evalPos(st);if(q<=0)return st0;if(st0>=be)return be;if(st0>al)al=st0;
  var ms=pseudo(st,true),side=st.turn;order(st,ms);
  for(var i=0;i<ms.length;i++){var u=make(st,ms[i]);if(attacked(st.b,st.k[side],-side)){unmake(st,u);continue}var sc=-quiesce(st,-be,-al,q-1);unmake(st,u);if(sc>=be)return be;if(sc>al)al=sc}
  return al}
function search(st,d,al,be){if(nodes>limit){aborted=true;return 0}nodes++;
  var ms=legal(st);if(!ms.length)return inCheck(st,st.turn)?-100000-d:0;if(d<=0)return quiesce(st,al,be,4);
  order(st,ms);for(var i=0;i<ms.length;i++){var u=make(st,ms[i]);var sc=-search(st,d-1,-be,-al);unmake(st,u);if(aborted)return 0;if(sc>=be)return be;if(sc>al)al=sc}return al}
function bestMove(st,level){var ms=legal(st);if(!ms.length)return null;
  var depth=level>=3?3:level===2?2:1;limit=level>=3?60000:level===2?20000:3000;
  order(st,ms);var scored=[];
  for(var i=0;i<ms.length;i++){nodes=0;aborted=false;var u=make(st,ms[i]);var sc=-search(st,depth-1,-1e6,1e6);unmake(st,u);scored.push({m:ms[i],s:sc+(level===1?Math.random()*160:level===2?Math.random()*12:Math.random()*3)})}
  scored.sort(function(a,b){return b.s-a.s});return scored[0].m}

var E={fromFen:fromFen,toFen:toFen,startPos:startPos,legal:legal,make:make,unmake:unmake,play:play,status:status,perft:perft,inCheck:inCheck,bestMove:bestMove,sqName:sqName,key:key,on:on,CH:CH};
if(typeof module!=='undefined'&&module.exports)module.exports=E;else root.YXChess=E;
})(typeof window!=='undefined'?window:this);
