/* ===================== YÜZ MÜHÜR: dünya, temalar, katlar ===================== */
var WP={amp:2.2,r0:26,r1:46,bowl:70,bs:.09,gm:1,ga:[.12,.28,.08],gb:[.34,.55,.18],lim:78};
function H(x,z){var r=Math.sqrt(x*x+z*z),f=sstep(WP.r0,WP.r1,r),k=WP.amp/2.2;
 var h=Math.sin(x*.07+1.3)*Math.cos(z*.06)*WP.amp+(Math.sin(x*.19+z*.13)*.55+Math.sin(z*.23-x*.11)*.35)*k;
 return h*f+Math.max(0,r-WP.bowl)*WP.bs}
var HG='uniform vec4 uHP;uniform float uBS;uniform float uGM;uniform vec3 uGA;uniform vec3 uGB;uniform vec3 uHs[8];bool hh(vec2 w){for(int i=0;i<8;i++){if(uHs[i].z>0.&&length(w-uHs[i].xy)<uHs[i].z)return true;}return false;}\nfloat H(vec2 p){float r=length(p);float f=smoothstep(uHP.y,uHP.z,r);float k=uHP.x/2.2;float h=sin(p.x*.07+1.3)*cos(p.y*.06)*uHP.x+(sin(p.x*.19+p.y*.13)*.55+sin(p.y*.23-p.x*.11)*.35)*k;return h*f+max(0.,r-uHP.w)*uBS;}';
function rng(seed){var s=(seed>>>0)||1;return function(){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}}
var colliders=[],lamps=[],vb=gl.createBuffer(),NV=0,barrier=[],IA=[],NPCL=[];
/* ---- yeni geometri yardımcıları ---- */
function limb(a,b,r0,r1,seg,col,mat){var dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],l=Math.hypot(dx,dy,dz)||1;dx/=l;dy/=l;dz/=l;
 var ux,uy=0,uz;if(Math.abs(dy)<.9){ux=-dz;uz=dx}else{ux=1;uz=0}var ul=Math.hypot(ux,uy,uz)||1;ux/=ul;uz/=ul;
 var vx=dy*uz-dz*uy,vy=dz*ux-dx*uz,vz=dx*uy-dy*ux;
 function p(i,r,B){var an=i/seg*6.2832,c=Math.cos(an)*r,s=Math.sin(an)*r;return[B[0]+ux*c+vx*s,B[1]+uy*c+vy*s,B[2]+uz*c+vz*s]}
 for(var i=0;i<seg;i++){quad(p(i+1,r0,a),p(i,r0,a),p(i,r1,b),p(i+1,r1,b),col,mat)}}
function disc(x,y,z,r,col,mat,seg){seg=seg||14;for(var i=0;i<seg;i++){var a0=i/seg*6.2832,a1=(i+1)/seg*6.2832;tri([x,y,z],[x+Math.cos(a1)*r,y,z+Math.sin(a1)*r],[x+Math.cos(a0)*r,y,z+Math.sin(a0)*r],col,mat)}}
function rock(x,z,s,col){var y=H(x,z);ball(x,y+.2*s,z,1.1*s,col,1,.62);colliders.push([x,z,.9*s])}
function bush(x,z,s){var y=H(x,z);ball(x,y+.35*s,z,.8*s,[.16+hash(x,z)*.06,.36,.14],8,.7)}
function deadtree(x,z,s,col){var y=H(x,z)-.1;col=col||[.22,.15,.1];var t=[x,y+3.2*s,z];limb([x,y,z],t,.32*s,.12*s,6,col,5);
 for(var i=0;i<4;i++){var a=i*1.9+hash(x,z)*6,hh=1.4+i*.55;limb([x,y+hh*s,z],[x+Math.cos(a)*1.5*s,y+(hh+1.1)*s,z+Math.sin(a)*1.5*s],.1*s,.03*s,4,col,5)}colliders.push([x,z,.45*s])}
function shroom(x,z,s){var y=H(x,z)-.05,c=hash(x,z)<.5?[.75,.2,.35]:[.35,.6,.9];cone(x,y,z,.22*s,1.8*s,6,[.9,.88,.8],5,.18*s);ball(x,y+1.9*s,z,1.2*s,c,8,.5);ball(x+.4*s,y+2.2*s,z,.18*s,[1,1,1],0,.7);ball(x-.3*s,y+2.15*s,z+.4*s,.15*s,[1,1,1],0,.7);colliders.push([x,z,.4*s])}
function cactus(x,z,s){var y=H(x,z)-.05,c=[.18,.42,.2];cone(x,y,z,.3*s,2.8*s,7,c,8,.24*s);limb([x,y+1.1*s,z],[x+.9*s,y+1.2*s,z],.17*s,.17*s,5,c,8);limb([x+.9*s,y+1.2*s,z],[x+.9*s,y+2.1*s,z],.17*s,.14*s,5,c,8);
 limb([x,y+1.6*s,z],[x-.8*s,y+1.7*s,z],.15*s,.15*s,5,c,8);limb([x-.8*s,y+1.7*s,z],[x-.8*s,y+2.4*s,z],.15*s,.12*s,5,c,8);colliders.push([x,z,.5*s])}
function ruinpillar(x,z,s,col){var y=H(x,z)-.2,h=(2+hash(x,z)*3)*s;col=col||[.52,.5,.46];cone(x,y,z,.7*s,h,8,col,1,.62*s);box(x,y+h,z,1.5*s,.35*s,1.5*s,col,1);if(hash(z,x)<.5)box(x+.4*s,y+h+.35*s,z-.2*s,.8*s,.5*s,.7*s,col,1,.4);colliders.push([x,z,.9*s])}
function ruinwall(x,z,s,ry){var y=H(x,z)-.2;box(x,y,z,5*s,(1.6+hash(x,z)*1.4)*s,.8*s,[.5,.48,.44],1,ry);var r=2.6*s;colliders.push([x,z,1.2*s]);var c=Math.cos(ry),sn=Math.sin(ry);colliders.push([x+c*1.7*s,z+sn*1.7*s,1.1*s]);colliders.push([x-c*1.7*s,z-sn*1.7*s,1.1*s])}
function icespike(x,z,s){var y=H(x,z)-.1,c=[.7,.88,1];for(var i=0;i<3;i++){var a=i*2.2+x;limb([x+Math.cos(a)*.5*s,y,z+Math.sin(a)*.5*s],[x+Math.cos(a)*.2*s,y+(2.4+i)*s*(i?.8:1.3),z+Math.sin(a)*.2*s],.5*s,.03*s,5,c,0)}colliders.push([x,z,.9*s])}
function snowpine(x,z,s){var y=H(x,z)-.1;cone(x,y,z,.28*s,1.6*s,6,[.27,.17,.1],5,.2*s);for(var i=0;i<4;i++){cone(x,y+(1.1+i*1.05)*s,z,(2-i*.38)*s,(2.1-i*.2)*s,7,[.12,.3,.2],8);cone(x,y+(2.0+i*1.05)*s,z,(1.0-i*.2)*s,.3*s,7,[.95,.97,1],0,.2*s)}colliders.push([x,z,.5*s])}
function obsidian(x,z,s){var y=H(x,z)-.1,c=[.1,.08,.12];for(var i=0;i<3;i++){var a=i*2.3+z;limb([x+Math.cos(a)*.6*s,y,z+Math.sin(a)*.6*s],[x+Math.cos(a)*.3*s,y+(2.5+i*1.2)*s,z+Math.sin(a)*.3*s],.55*s,.04*s,5,c,0)}
 limb([x,y,z],[x,y+1.2*s,z],.2*s,.12*s,5,[1,.4,.1],10);colliders.push([x,z,.9*s])}
function lavapool(x,z,r){var y=H(x,z)+.04;disc(x,y,z,r,[1,.42,.1],10,16);colliders.push([x,z,r*.85]);lamps.push([x,y+1,z])}
function crystalc(x,z,s,col){var y=H(x,z)-.05;for(var i=0;i<4;i++){var a=i*1.7+x*.7,ox=Math.cos(a)*.55*s,oz=Math.sin(a)*.55*s;limb([x+ox,y,z+oz],[x+ox*.5,y+(1.5+i*.6)*s*(i?1:1.7),z+oz*.5],.38*s,.03*s,5,[col[0]*.6,col[1]*.6,col[2]*.6],10)}colliders.push([x,z,.9*s]);lamps.push([x,y+1.5*s,z])}
function stalag(x,z,s){var y=H(x,z)-.1;limb([x,y,z],[x,y+3*s,z],.8*s,.05*s,6,[.2,.2,.3],1);colliders.push([x,z,.7*s])}
function cloudp(x,z,s){var y=H(x,z);ball(x,y+.2,z,1.8*s,[.97,.98,1],0,.55);ball(x+1.5*s,y+.1,z+.3*s,1.3*s,[.95,.96,1],0,.5);ball(x-1.3*s,y,z-.4*s,1.5*s,[.96,.97,1],0,.5)}
function marble(x,z,s){var y=H(x,z)-.2,h=(2.6+hash(x,z)*2)*s;cone(x,y,z,.6*s,h,10,[.9,.9,.92],1,.5*s);box(x,y+h,z,1.3*s,.3*s,1.3*s,[1,.85,.4],0);box(x,y-.05,z,1.4*s,.3*s,1.4*s,[.85,.85,.88],1);colliders.push([x,z,.8*s])}
function goldpillar(x,z,s){var y=H(x,z)-.2,h=(4+hash(x,z)*2)*s;cone(x,y,z,.8*s,h,10,[.78,.62,.25],1,.65*s);box(x,y+h,z,1.8*s,.4*s,1.8*s,[1,.82,.35],0);box(x,y,z,1.8*s,.4*s,1.8*s,[.3,.26,.2],1);colliders.push([x,z,1.0*s]);lamps.push([x,y+h+.6,z]);box(x,y+h+.4*s,z,.5*s,.5*s,.5*s,[1,.7,.25],7)}
function brazier(x,z,s){var y=H(x,z)-.05;cone(x,y,z,.12*s,1.1*s,6,[.15,.12,.1],5,.1*s);cone(x,y+1.1*s,z,.5*s,.35*s,8,[.2,.17,.14],0,.4*s);cone(x,y+1.4*s,z,.3*s,.8*s,6,[1,.55,.15],10,.02);lamps.push([x,y+1.9*s,z]);colliders.push([x,z,.5*s])}
function grave(x,z,s){var y=H(x,z)-.1;box(x,y,z,.7*s,1.1*s,.2*s,[.5,.5,.52],1,hash(x,z)*.8-.4);ball(x,y+1.1*s,z,.36*s,[.5,.5,.52],1,.6)}
function banner(x,z,s){var y=H(x,z)-.1;cone(x,y,z,.1*s,4.5*s,6,[.2,.15,.1],5,.08*s);box(x+.45*s,y+2.2*s,z,.9*s,1.8*s,.06*s,[.6,.1,.12],6,0);limb([x+.45*s,y+2.2*s,z],[x+.45*s,y+.7*s,z],.45*s,.01,4,[.6,.1,.12],6);colliders.push([x,z,.35*s])}
function shard(x,z,s){var y=H(x,z)+1.8*s+hash(x,z)*1.2;limb([x,y-1.2*s,z],[x,y+1.2*s,z],.5*s,.05*s,4,[.5,.2,.9],10);limb([x,y-1.2*s,z],[x,y-2.4*s,z],.5*s,.03*s,4,[.4,.15,.8],10)}
function arch(x,z,ry,w,h,col,glow){var y=H(x,z)-.2;function loc(lx){var r=rot(lx,0,ry);return[x+r[0],z+r[1]]}
 var a=loc(-w/2),b=loc(w/2);cone(a[0],y,a[1],.9,h,8,col,1,.75);cone(b[0],y,b[1],.9,h,8,col,1,.75);box(x,y+h,z,w+2.2,1.1,1.5,col,1,ry);colliders.push([a[0],a[1],1.0]);colliders.push([b[0],b[1],1.0]);
 if(glow){lamps.push([x,y+h*.6,z])}}
function bonfire(x,z){var y=H(x,z)-.05;for(var i=0;i<8;i++){var a=i/8*6.28;ball(x+Math.cos(a)*1.1,y+.15,z+Math.sin(a)*1.1,.36,[.45,.45,.47],1,.7)}limb([x-.5,y,z],[x+.5,y+.9,z],.12,.1,5,[.3,.2,.12],5);limb([x+.5,y,z],[x-.5,y+.9,z],.12,.1,5,[.3,.2,.12],5);lamps.push([x,y+1.3,z]);colliders.push([x,z,1.4])}
/* ---- Kule modeli (şehirde dev kule) ---- */
function tower(x,z){var y=H(x,z)-.6,k;for(k=0;k<13;k++){var r=15.5-k*.75,h=14,c=.5+k*.012;cone(x,y+k*h,z,r,h,22,[c,c*.97,c*.92],1,r-.75);cone(x,y+k*h+h-1.2,z,r+.55,1.3,22,[.78,.62,.25],0,r+.55);
  if(k<9)for(var j=0;j<7;j++){var a=j/7*6.28+k*.45,wr=r-.3,wx=x+Math.cos(a)*wr,wz=z+Math.sin(a)*wr;box(wx,y+k*h+4.2,wz,1.3,2.8,.3,[1,.78,.4],7,a-1.5708)}}
 cone(x,y+13*14,z,6.2,34,18,[.45,.42,.4],1,.2);ball(x,y+13*14+36,z,1.7,[1,.85,.5],10);colliders.push([x,z,15.8]);lamps.push([x,y+10,z+14])}
/* ---- şehir ---- */
function house(x,z,w,d,hgt,ry,wall,roof){var y=H(x,z)-.2;
 box(x,y,z,w,hgt,d,wall,1,ry,5);gable(x,y+hgt,z,w,d,hgt*.55,.5,roof,2,ry);
 function loc(lx,lz){var r=rot(lx,lz,ry);return[x+r[0],z+r[1]]}
 var f=loc(0,d/2+.02);box(f[0],y,f[1],1.2,2.1,.12,[.35,.2,.1],5,ry);
 [-1,1].forEach(function(s){var q=loc(s*w*.3,d/2+.03);box(q[0],y+hgt*.45,q[1],1.0,1.0,.1,[1,.8,.4],7,ry)});
 var sd=loc(w/2+.03,0);box(sd[0],y+hgt*.45,sd[1],.1,1.0,1.0,[1,.8,.4],7,ry);
 var ch=loc(w*.25,-d*.2);box(ch[0],y+hgt+hgt*.35,ch[1],.8,hgt*.5,.8,[.4,.36,.34],1,ry);
 colliders.push([x,z,Math.max(w,d)*.72])}
function pine(x,z,s){var y=H(x,z)-.1;cone(x,y,z,.28*s,1.6*s,6,[.27,.17,.1],5,.2*s);
 for(var i=0;i<4;i++)cone(x,y+(1.1+i*1.05)*s,z,(2-i*.38)*s,(2.1-i*.2)*s,7,[.08+hash(x,i)*.04,.26+hash(z,i)*.08,.14],8);colliders.push([x,z,.5*s])}
function oak(x,z,s){var y=H(x,z)-.1;cone(x,y,z,.35*s,2.6*s,6,[.3,.19,.1],5,.25*s);
 ball(x,y+3.3*s,z,2.1*s,[.2,.42,.14],8,.85);ball(x+1.1*s,y+2.7*s,z+.5*s,1.4*s,[.24,.46,.15],8,.8);ball(x-1*s,y+2.8*s,z-.6*s,1.5*s,[.18,.38,.13],8,.8);colliders.push([x,z,.5*s])}
function lamp(x,z){var y=H(x,z)-.1;cone(x,y,z,.09,3.6,6,[.12,.1,.1],5,.07);box(x,y+3.6,z,.45,.5,.45,[1,.85,.5],7);box(x,y+4.1,z,.6,.1,.6,[.12,.1,.1],5);lamps.push([x,y+3.7,z])}
function tent(x,z,s,ry){var y=H(x,z)-.1,seg=12;
 for(var i=0;i<seg;i++){var a0=i/seg*6.2832,a1=(i+1)/seg*6.2832,c=(i%2)?[.15,.28,.75]:[.88,.9,.95];
  var p0=[x+Math.cos(a0)*2.6*s,y,z+Math.sin(a0)*2.6*s],p1=[x+Math.cos(a1)*2.6*s,y,z+Math.sin(a1)*2.6*s];
  var q0=[x+Math.cos(a0)*1.7*s,y+1.9*s,z+Math.sin(a0)*1.7*s],q1=[x+Math.cos(a1)*1.7*s,y+1.9*s,z+Math.sin(a1)*1.7*s],top=[x,y+2.6*s,z];
  quad(p1,p0,q0,q1,c,6);tri(q1,q0,top,c,6)}
 cone(x,y,z,.07,3.6*s,5,[.4,.3,.2],5,.05);colliders.push([x,z,2.5*s])}
function well(x,z){var y=H(x,z)-.1;cone(x,y,z,1.2,1.1,10,[.5,.5,.52],1,1.2);cone(x,y+1.1,z,1.0,.12,10,[.12,.2,.35],9,1.0);
 box(x-1,y+1.1,z,.14,1.9,.14,[.4,.27,.16],5);box(x+1,y+1.1,z,.14,1.9,.14,[.4,.27,.16],5);gable(x,y+3,z,2.4,1.2,.9,.3,[.45,.2,.15],2,0);colliders.push([x,z,1.3])}
function stall(x,z,ry,c1){var y=H(x,z)-.1;box(x,y,z,3.2,.9,1.4,[.45,.3,.18],5,ry);function loc(lx,lz){var r=rot(lx,lz,ry);return[x+r[0],z+r[1]]}
 [-1,1].forEach(function(s){var p=loc(s*1.5,-.5);cone(p[0],y,p[1],.08,2.6,5,[.35,.25,.15],5,.07)});var t=loc(0,-.1);box(t[0],y+2.5,t[1],3.6,.12,2.0,c1,6,ry);colliders.push([x,z,1.9])}
/* ---- tema tablosu ---- */
var REALMS=[
{n:'Yeşil Vadi',tod:12,rain:0,fog:[.7,.8,.92],sky:[.4,.56,.82],fd:.0085,ga:[.24,.42,.16],gb:[.3,.5,.2],gm:4,gr:[[.12,.28,.08],[.34,.55,.18]],amp:2,lc:[1,.72,.38],props:{pine:3,oak:3,rock:2,bush:3},mobs:['slime','rabbit','wolf','boar','fox','bee','mushroom','frog','goblin','snake'],bp:['alpha','guardian','warden','queen'],rb:'drake',col:'#7bd36a'},
{n:'Sisli Bataklık',tod:17.4,rain:.3,fog:[.42,.52,.45],sky:[.3,.4,.4],fd:.02,ga:[.17,.25,.12],gb:[.22,.3,.14],gm:4,gr:[[.1,.2,.08],[.22,.34,.12]],amp:1.2,lc:[.7,1,.55],props:{deadtree:4,shroom:3,rock:1,bush:2},mobs:['bogtoad','leech','croc','hag','snail','spider','wisp','beetle'],bp:['leviathan','queen','guardian','alpha'],rb:'hydra',col:'#5fae7a'},
{n:'Kızıl Çöl',tod:13,rain:0,fog:[.88,.74,.54],sky:[.45,.6,.85],fd:.009,ga:[.6,.4,.2],gb:[.68,.48,.26],gm:4,gr:null,amp:2.6,lc:[1,.7,.35],props:{cactus:4,rock:3,ruinpillar:3},mobs:['sandworm','cobra','mummy','scorpion','sandelem','bat'],bp:['warden','guardian','alpha','queen'],rb:'pharaoh',col:'#f0b060'},
{n:'Buzul Zirveleri',tod:10,rain:.4,fog:[.8,.88,.96],sky:[.55,.7,.9],fd:.012,ga:[.88,.92,.98],gb:[.76,.84,.94],gm:4,gr:[[.7,.78,.86],[.92,.96,1]],amp:2.4,lc:[.7,.9,1],props:{snowpine:4,icespike:4,rock:2},mobs:['icewolf','yeti','frostwraith','iceelem','mammoth','bear','harpy'],bp:['guardian','warden','queen','alpha'],rb:'frostking',col:'#9ad8ff'},
{n:'Magma Kalesi',tod:20.2,rain:0,fog:[.42,.18,.1],sky:[.5,.22,.14],fd:.014,ga:[.2,.12,.1],gb:[.3,.15,.1],gm:3,gr:null,amp:1.6,lc:[1,.45,.15],props:{obsidian:4,lavapool:3,rock:2,brazier:2},mobs:['magmaslime','imp','lavagolem','hellhound','salamander','skel'],bp:['warden','queen','alpha','guardian'],rb:'magmalord',col:'#ff7a3a'},
{n:'Bulut Sarayı',tod:11,rain:0,fog:[.9,.93,.98],sky:[.55,.72,.95],fd:.007,ga:[.6,.62,.7],gb:[.54,.57,.66],gm:3,gr:null,amp:.6,lc:[1,.9,.6],props:{marble:4,cloudp:5,goldpillar:2},mobs:['harpy','gargoyle','wisp','wraith','golem','bat'],bp:['guardian','queen','warden','elder'],rb:'stormtitan',col:'#cfe3ff'},
{n:'Kadim Harabe',tod:16.2,rain:.6,storm:1,fog:[.36,.4,.42],sky:[.3,.34,.4],fd:.017,ga:[.22,.3,.2],gb:[.28,.34,.22],gm:4,gr:[[.1,.2,.08],[.2,.3,.1]],amp:1.8,lc:[.8,.95,.7],props:{ruinpillar:4,ruinwall:3,deadtree:2,rock:2,grave:3},mobs:['skel','wraith','gargoyle','golem','spider','treant'],bp:['warden','guardian','queen','alpha'],rb:'lich',col:'#8fae9a'},
{n:'Kristal Mağara',tod:0,rain:0,fog:[.05,.08,.17],sky:[.04,.06,.14],fd:.016,ga:[.16,.18,.3],gb:[.2,.22,.36],gm:3,gr:null,amp:1.4,lc:[.4,.85,1],props:{crystalc:7,rock:3,stalag:3},mobs:['bat','golem','gargoyle','spider','iceelem','sandelem'],bp:['guardian','elder','warden','queen'],rb:'elder',col:'#5cc8ff'},
{n:'Gölge Diyarı',tod:2,rain:.3,storm:1,fog:[.09,.04,.15],sky:[.07,.04,.14],fd:.02,ga:[.1,.06,.16],gb:[.15,.08,.22],gm:4,gr:[[.12,.05,.2],[.3,.12,.4]],amp:1.6,lc:[.7,.35,1],props:{deadtree:4,obsidian:2,shard:5,rock:2},mobs:['wraith','frostwraith','hellhound','imp','skel','gargoyle'],bp:['queen','warden','guardian','alpha'],rb:'voidlord',col:'#b07aff'},
{n:'Mühür Sarayı',tod:19.2,rain:0,fog:[.3,.2,.1],sky:[.35,.22,.1],fd:.013,ga:[.2,.17,.1],gb:[.3,.25,.12],gm:3,gr:null,amp:.8,lc:[1,.8,.35],props:{goldpillar:4,banner:4,brazier:3},mobs:['gargoyle','lavagolem','hellhound','mummy','wraith','sphinx'],bp:['warden','elder','queen','stormtitan','magmalord','voidlord'],rb:'yaxest',col:'#ffd23f'}];
function realmOf(f){return REALMS[(Math.floor((Math.max(1,f)-1)/10))%10]}
var SPAWNP=[0,44],ARENA=[0,-47];
function inPlaza(x,z){return x*x+(z-SPAWNP[1])*(z-SPAWNP[1])<81}
function inArena(x,z){return x*x+(z-ARENA[1])*(z-ARENA[1])<17*17}
/* ---- GPU'ya yükle ---- */
function uploadWorld(){var n=P.length/3,b=new Float32Array(n*10);
 for(var i=0;i<n;i++){b[i*10]=P[i*3];b[i*10+1]=P[i*3+1];b[i*10+2]=P[i*3+2];b[i*10+3]=N[i*3];b[i*10+4]=N[i*3+1];b[i*10+5]=N[i*3+2];b[i*10+6]=C[i*3];b[i*10+7]=C[i*3+1];b[i*10+8]=C[i*3+2];b[i*10+9]=M[i]}
 gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,b,gl.STATIC_DRAW);NV=n;P=[];N=[];C=[];M=[]}
function resetWorld(){P=[];N=[];C=[];M=[];colliders=[];lamps=[];barrier=[];IA=[];NPCL=[]}
function terrain(R,colf){for(var gx=-R;gx<R;gx++)for(var gz=-R;gz<R;gz++){var cx=gx+.5,cz=gz+.5;if(cx*cx+cz*cz>R*R)continue;
  var x0=gx,x1=gx+1,z0=gz,z1=gz+1,a=[x0,H(x0,z0),z0],b=[x1,H(x1,z0),z0],c=[x1,H(x1,z1),z1],d=[x0,H(x0,z1),z1],cc=colf(cx,cz,(a[1]+c[1])/2);quad(a,d,c,b,cc[0],cc[1])}}

/* ---- Kenney kasaba parçaları ---- */
var KB=null;try{fetch('assets/kenney.json').then(function(r){return r.json()}).then(function(j){KB=j;window.__kbReady=1;if(window.__onKB)window.__onKB()}).catch(function(e){console.warn('kenney',e)})}catch(e){}
function kadd(n,x,y,z,ry,s,tint,sy){var m=KB&&KB[n];if(!m)return false;s=s||1;sy=sy||s;var c=Math.cos(ry),sn=Math.sin(ry),k=m.p.length/3;tint=tint||[1,1,1];
 for(var i=0;i<k;i++){var px=m.p[i*3]*s,py=m.p[i*3+1]*sy,pz=m.p[i*3+2]*s;P.push(x+px*c+pz*sn,y+py,z-px*sn+pz*c);var nx=m.n[i*3],ny=m.n[i*3+1],nz=m.n[i*3+2];N.push(nx*c+nz*sn,ny,-nx*sn+nz*c);
  C.push(Math.pow(m.c[i*3]/255,1.5)*tint[0],Math.pow(m.c[i*3+1]/255,1.5)*tint[1],Math.pow(m.c[i*3+2]/255,1.5)*tint[2]);M.push(0)}return true}
function lw(lx,lz,yaw){var c=Math.cos(yaw),s=Math.sin(yaw);return[lx*c+lz*s,-lx*s+lz*c]}
var MV=null;try{fetch('assets/mvk.json').then(function(r){return r.json()}).then(function(j){MV=j;if(window.__onKB)window.__onKB()}).catch(function(e){console.warn('mvk',e)})}catch(e){}
function mvadd(n,x,y,z,ry,sx,sy,sz,tint){var m=MV&&MV[n];if(!m)return false;var c=Math.cos(ry),sn=Math.sin(ry),k=m.p.length/3;tint=tint||[1,1,1];
 for(var i=0;i<k;i++){var px=m.p[i*3]*sx,py=m.p[i*3+1]*sy,pz=m.p[i*3+2]*sz;P.push(x+px*c+pz*sn,y+py,z-px*sn+pz*c);var nx=m.n[i*3],ny=m.n[i*3+1],nz=m.n[i*3+2];N.push(nx*c+nz*sn,ny,-nx*sn+nz*c);
  C.push(Math.pow(m.c[i*3]/255,1.5)*tint[0],Math.pow(m.c[i*3+1]/255,1.5)*tint[1],Math.pow(m.c[i*3+2]/255,1.5)*tint[2]);M.push(0)}return true}
function mvhouse(cx,cz,W,D,F,yaw,o,y0,doorI){var s=3,sx=s/2,sy=.96,sz=1.15,tn=o.wood?[1.8,1.45,1.1]:[2.1,1.9,1.55];
 function side(n,cnt,len,ang,ox,oz,fl,isFront){for(var i=0;i<cnt;i++){var u=(i-(cnt-1)/2)*s,p=lw(ox?ox:u,oz?oz:u,yaw),lx=ox?ox:u,lz=oz?oz:u;p=lw(lx,lz,yaw);
   var y=y0+fl*s,br=fl===0&&!o.wood,nm;
   if(isFront&&fl===0&&i===doorI)nm=br?'Wall_UnevenBrick_Door_Round':'Wall_Plaster_Door_Round';
   else{var k=(i+fl+(ang>0?1:0))%3;nm=br?(k===0?'Wall_UnevenBrick_Window_Wide_Round':k===1?'Wall_UnevenBrick_Straight':'Wall_UnevenBrick_Window_Thin_Round'):o.wood?(k===1?'Wall_Plaster_WoodGrid':'Wall_Plaster_Window_Wide_Round'):(k===0?'Wall_Plaster_Window_Wide_Round':k===1?'Wall_Plaster_Straight':'Wall_Plaster_Window_Thin_Round')}
   mvadd(nm,cx+p[0],y,cz+p[1],yaw+ang,sx,sy,sz,tn)}}
 for(var f=0;f<F;f++){var hw=W*s/2-.08,hd=D*s/2-.08;
  side(0,W,0,0,0,hd,f,true);side(0,W,0,Math.PI,0,-hd,f,false);side(0,D,0,Math.PI/2,hw,0,f,false);side(0,D,0,-Math.PI/2,-hw,0,f,false);
  [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(function(c){var p=lw(c[0]*W*s/2,c[1]*D*s/2,yaw);mvadd('Corner_Exterior_Wood',cx+p[0],y0+f*s,cz+p[1],yaw,1.1,sy,1.1,[.85,.7,.55])})}
 var yr=y0+F*s,rc=o.roofc||[.5,.2,.15],al=W>=D,Wf=W*s+1.2,Df=D*s+1.2,L=al?Wf:Df,Sp=al?Df:Wf;
 mvadd('Roof_RoundTiles_6x6',cx,yr+.78*.62,cz,al?yaw:yaw+Math.PI/2,L/8.24,.62,Sp/8.03,[rc[0]*2.2,rc[1]*2.2,rc[2]*2.2]);
 if(o.chimney){var p=lw(W*s*.22,-D*s*.18,yaw);mvadd('Prop_Chimney',cx+p[0],yr+.2,cz+p[1],yaw,1,1.15,1,[.9,.85,.8])}}
function khouse(cx,cz,W,D,F,yaw,o){o=o||{};var s=3,y0=H(cx,cz)-.15,doorI=o.door==null?Math.floor(W/2):o.door,wood=o.wood?'wall-wood':'wall',tn=o.wood?[1.25,1.05,.85]:[1.35,1.18,.95];
 if(MV){mvhouse(cx,cz,W,D,F,yaw,o,y0,doorI)}else{
 for(var f=0;f<F;f++){var y=y0+f*s;
  for(var i=0;i<W;i++){var lx=(i-(W-1)/2)*s,dz=(D-1)/2*s,p;
   var fr=(f===0&&i===doorI)?(o.wood?'wall-wood-door':'wall-door'):((i+f)%2?(o.wood?'wall-wood-window-shutters':'wall-window-shutters'):(o.wood?'wall-wood':'wall-window-glass'));
   p=lw(lx,dz,yaw);kadd(fr,cx+p[0],y,cz+p[1],yaw-Math.PI/2,s,tn);
   p=lw(lx,-dz,yaw);kadd(((i+f)%2?'wall-window-small':wood),cx+p[0],y,cz+p[1],yaw+Math.PI/2,s,tn)}
  for(var j=0;j<D;j++){var lz=(j-(D-1)/2)*s,dx=(W-1)/2*s,p;
   p=lw(dx,lz,yaw);kadd((j+f)%2?wood:'wall-window-small',cx+p[0],y,cz+p[1],yaw,s,tn);p=lw(-dx,lz,yaw);kadd((j+f)%2?'wall-window-small':wood,cx+p[0],y,cz+p[1],yaw+Math.PI,s,tn)}}
 var yr=y0+F*s;gable(cx,yr,cz,W*s+.5,D*s+.5,1.9+D*.35,.45,o.roofc||[.5,.2,.15],2,yaw);
 if(o.chimney){var p=lw(W*s*.22,-D*s*.18,yaw);kadd('chimney',cx+p[0]-.0,yr+.2,cz+p[1],yaw,s*.9,[.8,.75,.72],s*1.5)}}
 HSL.push([cx,cz,W*s/2,D*s/2,yaw]);
 for(var i=0;i<W;i++){if(i===doorI)continue;var lx=(i-(W-1)/2)*s;[-.75,.75].forEach(function(d){var p=lw(lx+d,(D*s)/2-.15,yaw);colliders.push([cx+p[0],cz+p[1],.7])});}
 for(var i=0;i<W;i++){var lx=(i-(W-1)/2)*s;[-.75,.75].forEach(function(d){var p=lw(lx+d,-(D*s)/2+.15,yaw);colliders.push([cx+p[0],cz+p[1],.7])})}
 for(var j=0;j<D;j++){var lz=(j-(D-1)/2)*s;[-.75,.75].forEach(function(d){[1,-1].forEach(function(sd){var p=lw(sd*(W*s)/2-sd*.15,lz+d,yaw);colliders.push([cx+p[0],cz+p[1],.7])})})}
 box(cx,y0-.25,cz,W*s-.2,.45,D*s-.2,[.42,.3,.2],5,yaw);lamps.push([cx,y0+2.3,cz])}
var HSL=[];
function inHouse(x,z){for(var i=0;i<HSL.length;i++){var h=HSL[i],c=Math.cos(h[4]),s=Math.sin(h[4]),dx=x-h[0],dz=z-h[1],lx=dx*c-dz*s,lz=dx*s+dz*c;if(Math.abs(lx)<h[2]&&Math.abs(lz)<h[3])return true}return false}
function hin(h,lx,lz){var p=lw(lx,lz,h[5]);return[h[0]+p[0],h[1]+p[1]]}
function furnish(h,kind){var yaw=h[5],cx=h[0],cz=h[1];
 function put(n,lx,lz,s,dy,col,ry){var p=hin(h,lx,lz);dadd(n,p[0],p[1],yaw+(ry||0),s,null,dy||0,col)}
 put('torch_mounted',-1.4,-D2(h)+.1,1,1.9);put('torch_mounted',1.4,-D2(h)+.1,1,1.9);
 var T=!!PK;
 if(kind==='inn'){put(T?'Bed_Twin1':'bed_floor',-1.7,-1.1,T?1:.85,0,1.2);put(T?'Table_Large':'table_medium',1.4,.9,T?.8:.8,0,1.1);put(T?'Bench':'stool',1.4,1.9,T?.7:1,0);put('Mug',1.1,.9,1,.64);put('Chalice',1.7,.7,.5,.64);put('ChickenLeg',1.6,1.2,.6,.64,0,.8);put('Barrel',2.2,-2.1,1,0,.5);put('Cabinet',.4,-2.55,.9,0,.7)}
 if(kind==='shop'){put('Table_Large',0,-.3,1,0,1.3);put('Potion1_Filled',.6,-.5,.35,.82);put('Potion2_Filled',-.1,.2,.3,.82);put('Gold_Ingots',.9,.1,.5,.82,0,.5);put('Crystal3',-.9,.3,.5,.82);put('Chest_Closed',3.0,.5,1,0,0,-.7);put('Pouch',-.3,-.9,.8,.82);put('Armor_Leather',-2.4,-2.6,.6,.0,0,.2);put('Coin_Pile',-.6,-.3,1,.8);put('Bag',.9,-.4,1,.8);put('Bookcase_2',-3.2,-2.5,1,0,.7);put('Crate_Wooden',3.4,-2.1,1,0,.5);put('Barrel',3.5,1.6,1,0,.5);put('Chest_Wood',-3.2,1.4,1,0,.7);put('Shelf_Arch',3.2,-1.5,1,0,.5)}
 if(kind==='smith'){put('Anvil',1.4,.6,1,0,.6);put('Workbench',-1.9,-2.1,1,0,.9);put('WeaponStand',2.0,-2.0,1,0,.7);put('Dummy',-2.1,1.6,1,0,.5);put('Whetstone',.2,1.7,.8,0);put('Barrel',-2.3,.5,1,0,.5);put('Armor_Metal',-1.9,-2.1,.7,.92,0,.3);put('Sword_big',-1.2,-2.4,.55,.9,0,.4);put('Axe_small',-2.5,-2.3,.6,.9,0,1);put('Armor_Golden',2.0,-2.0,.5,.95,0,-.4);put('Hammer_Double',1.0,-2.5,.5,0,0,.2);put('Crystal1',.3,1.8,.6,.2,0,0)}
 if(kind==='guild'){put('Banner_1',-1.9,-D2(h)+.1,1,.3);put('Banner_2',1.9,-D2(h)+.1,1,.3);put('Table_Large',0,.9,.9,0,1.2);put('Bench',0,1.9,.7);put('Chest_Wood',2.0,-2.0,1,0,.7);put('Shield_Wooden',-.2,-D2(h)+.2,1,1.4);put('Crown',.2,.8,.5,.7);put('Skull',-.6,1.0,.6,.7);put('Hammer_Double',-2.4,-2.2,.55,0,0,.3);put('Chest_Closed',2.8,-.6,.9,0,0,-.5)}
 if(kind==='quest'){put('Bookcase_2',-2.9,-2.5,1,0,.7);put('Table_Large',.4,.9,.85,0,1.2);put('Chair_1',-1.3,.9,1,0,.4);put('BookGroup_Medium_1',.5,.9,1,.65);put('Scroll_1',1.2,.9,1,.65);put('Candle_1',-.4,.9,1,.65);put('Book3_Open',.0,1.2,.5,.65);put('Key1',.9,.6,.6,.65);put('Mineral',-2.6,1.2,.6,0);put('Chest_Wood',3.0,-1.8,.9,0,.7)}}
function D2(h){return 2.7}
function npcIn(h,lx,lz){var p=hin(h,lx,lz);return[p[0],p[1],Math.PI-h[5]]}
function kdecor(){
 if(PK){padd('Stall_Cart_Empty',-9,-14,.3,1.1);padd('Stall_Empty',22,-6,-1.3,1.2);padd('Dummy',5,-15,.4,1,.5);padd('Dummy',8,-16,-.3,1,.5);padd('Barrel',-5,-14,0,1,.5);padd('Crate_Wooden',-4,-15.3,.5,1,.6);padd('Barrel',20,-9,0,1,.5);padd('Crate_Wooden',21.3,-8.5,.4,1,.6);padd('Bench',-4,7,1.57,1,.0);padd('Bench',5,-3,0,1,0);padd('Barrel',12,4,0,1,.5);padd('Prop_Wagon',-17,-14,1.1,1,1.2);for(var q=0;q<5;q++){padd('Prop_MetalFence_Simple',-8+q*2,26,0,1);padd('Prop_MetalFence_Simple',2+q*2,26,0,1)}}
 if(!PK){kadd('stall-red',-9,H(-9,-14)-.1,-14,.3,2.4);kadd('stall-green',22,H(22,-6)-.1,-6,-1.3,2.4)}kadd('cart',4,H(4,-8)-.1,-8,.8,2.6);kadd('cart-high',-16,H(-16,-4)-.1,-4,2.2,2.4);
 kadd('banner-red',-3.4,H(-3.4,-44)+1.5,-44,Math.PI,3);kadd('banner-green',3.4,H(3.4,-44)+1.5,-44,Math.PI,3);
 for(var i=0;i<6;i++){var x=-24+i*3;kadd('fence',x,H(x,12)-.05,12,0,3);}
 for(var i=0;i<6;i++){var z=-14+i*3;kadd('fence',-23,H(-23,z)-.05,z,0,3)}
 [[-30,12],[31,8],[-34,-16],[33,-18],[-22,26],[24,28]].forEach(function(p,i){kadd(i%2?'rock-wide':'rock-large',p[0],H(p[0],p[1])-.1,p[1],i*1.3,2.2,[1.15,1,.8]);colliders.push([p[0],p[1],2])});
 kadd('windmill',-42,H(-42,34)+4.7,34,.6,3);colliders.push([-42,34,3.5]);
 [[-6,24],[6,24],[-4,-22],[4,-22]].forEach(function(p){kadd('hedge-large',p[0],H(p[0],p[1])-.05,p[1],0,3)});
 kadd('fountain-round',0,H(0,0)-.1,0,0,2.2);if(IT){padd('Chest_Closed',6,-6,.6,1.3,.8);padd('Crystal5',-6,6,.5,1.6);padd('Crystal1',-6.8,6.4,1,1.2);padd('Crystal3',-5.6,6.8,2,1.4);padd('Sword_big',3.2,-1.5,0,.9);padd('Armor_Golden',-3.2,-1.4,.4,1.0)}colliders.push([0,0,2.4]);
}
var PK=null;try{fetch('assets/props2.json').then(function(r){return r.json()}).then(function(j){PK=j;if(window.__onKB)window.__onKB()}).catch(function(e){console.warn('props2',e)})}catch(e){}
var IT=null;try{fetch('assets/items.json').then(function(r){return r.json()}).then(function(j){IT=j;if(window.__onKB)window.__onKB()}).catch(function(e){console.warn('items',e)})}catch(e){}
var DK=null;try{fetch('assets/dungeon.json').then(function(r){return r.json()}).then(function(j){DK=j;if(window.__onKB)window.__onKB()}).catch(function(e){console.warn('dungeon',e)})}catch(e){}
function dadd(n,x,z,ry,s,tint,dy,col){var m=(PK&&PK[n])||(DK&&DK[n])||(IT&&IT[n]);if(!m)return false;s=s||1;var y=H(x,z)+(dy||0),c=Math.cos(ry),sn=Math.sin(ry),k=m.p.length/3;tint=tint||[1,1,1];
 for(var i=0;i<k;i++){var px=m.p[i*3]*s,py=m.p[i*3+1]*s,pz=m.p[i*3+2]*s;P.push(x+px*c+pz*sn,y+py,z-px*sn+pz*c);var nx=m.n[i*3],ny=m.n[i*3+1],nz=m.n[i*3+2];N.push(nx*c+nz*sn,ny,-nx*sn+nz*c);
  C.push(Math.pow(m.c[i*3]/255,1.5)*tint[0],Math.pow(m.c[i*3+1]/255,1.5)*tint[1],Math.pow(m.c[i*3+2]/255,1.5)*tint[2]);M.push(0)}if(col)colliders.push([x,z,col]);return true}
function padd(n,x,z,ry,s,col){return dadd(n,x,z,ry,s,null,0,col)}
function ddecor(cx,cz,sd){var r=rng(sd),L=['crates_stacked','barrel_large','box_small','keg','chest_gold','coin_stack_large','rubble_large'],n=2+Math.floor(r()*3);
 for(var i=0;i<n;i++){var a=r()*6.28,d=2.5+r()*3.5,k=L[Math.floor(r()*L.length)],s=k==='rubble_large'?.45:.55+r()*.2;dadd(k,cx+Math.cos(a)*d,cz+Math.sin(a)*d,r()*6.28,s,null,0,k==='rubble_large'?1.6:.9)}}
function dplaza(){var sx=SPAWNP[0],sz=SPAWNP[1];
 dadd('table_medium',sx+6,sz+2,.3,1.1,null,0,1.4);dadd('candle_triple',sx+6.2,sz+2,0,1,null,1.1);dadd('stool',sx+7.8,sz+2.4,0,1,null,0,.5);dadd('stool',sx+4.3,sz+1.6,0,1,null,0,.5);
 dadd('crates_stacked',sx-6,sz+3,.5,.7,null,0,1.2);dadd('barrel_large',sx-7.5,sz+1,0,.6,null,0,.9);dadd('barrel_large',sx-5.8,sz+5,0,.6,null,0,.9);dadd('chest_gold',sx-4,sz-5,2.6,.7,null,0,1);dadd('bed_floor',sx+5,sz-6,1.57,.9,null,0,1.4);
 dadd('banner_patternA_red',-5.5,53.6,Math.PI,1.1);dadd('banner_patternB_green',5.5,53.6,Math.PI,1.1);
 dadd('pillar',-7,55,0,1.5,null,-.2,1.2);dadd('pillar',7,55,0,1.5,null,-.2,1.2)}
/* ---- şehir kur ---- */
function buildTown(){resetWorld();WP.amp=2.2;WP.r0=26;WP.r1=46;WP.bowl=70;WP.bs=.09;WP.gm=1;WP.ga=[.12,.28,.08];WP.gb=[.34,.55,.18];WP.lim=76;
 function isPath(x,z){var r=Math.hypot(x,z);if(r<11)return true;var ax=Math.abs(x),az=Math.abs(z);
  if(az<2.2+Math.sin(x*.15)*.8&&ax<60)return true;if(ax<2.2+Math.cos(z*.17)*.8&&az<48)return true;return false}
 terrain(86,function(x,z,y){var g=hash(Math.floor(x*.5),Math.floor(z*.5)),path=isPath(x,z);if(path)return[[.5,.5,.52],3];
  var c=[.22+g*.07,.40+g*.1,.15+g*.04];if(y>3.2){var k=Math.min(1,(y-3.2)*.5);c=[c[0]+.1*k,c[1]-.04*k,c[2]+.05*k]}return[c,4]});
 var HS=[[-14,-9,2,2,1,.25,0,'inn'],[14,-13,3,2,1,-.3,1,'shop'],[-19,8,2,2,1,-.2,1,'smith'],[17,12,2,2,1,.6,0,'guild'],[-26,-2,2,2,2,-1.5,0],[27,-3,2,2,2,1.8,1],[-8,20,3,2,1,3.3,0,'quest']],RC=[[.55,.22,.16],[.28,.3,.42],[.5,.3,.18],[.5,.18,.15],[.3,.28,.32],[.55,.25,.17],[.28,.34,.2]],HP={};HSL=[];
 HS.forEach(function(h,i){if(KB){khouse(h[0],h[1],h[2],h[3],h[4],h[5],{wood:h[6],roofc:RC[i],door:h[2]>2?1:1,chimney:i%2==0});h[7]=h[7]||0;if(h[7]){h[8]=2.7;HP[h[7]]=h}}else house(h[0],h[1],h[2]*3+1,h[3]*3,h[4]*3.4,h[5],[.68,.66,.6],RC[i])});
 if(KB&&DK)HS.forEach(function(h){if(h[7])furnish(h,h[7])});
 if(KB){kdecor()}
 if(!KB)well(0,0);tent(8,6,1.1);tent(-7,7,.95);stall(-13,-16,0,[.8,.2,.2]);stall(18,-1,1.57,[.2,.5,.3]);
 [[5,-6],[-5,-6],[10,2],[-11,1],[4,9],[-3,-12],[6,-30],[-6,-30],[7,-40],[-7,-40]].forEach(function(p){lamp(p[0],p[1])});
 for(var i=0;i<80;i++){var a=hash(i,1)*6.283,rr=34+hash(i,2)*36,x=Math.cos(a)*rr,z=Math.sin(a)*rr;if(Math.abs(x)<5&&z<0)continue;(hash(i,3)<.55?pine:oak)(x,z,.9+hash(i,4)*.9)}
 for(var i=0;i<22;i++){var a=hash(i,9)*6.283,rr=22+hash(i,8)*12,x=Math.cos(a)*rr,z=Math.sin(a)*rr;if(Math.abs(x)<5||Math.abs(z)<5)continue;oak(x,z,.7+hash(i,7)*.5)}
 for(var i=0;i<7;i++){var a=hash(i,21)*6.28,r=3+hash(i,22)*6,x=Math.cos(a)*r,z=Math.sin(a)*r+3;if(Math.hypot(x,z)<3.6)continue;var y=H(x,z)-.1;box(x,y,z,.9,.7,.7,[.5,.34,.18],5,hash(i,5)*3)}
 tower(0,-65);arch(0,-48.5,0,6.6,6.2,[.55,.52,.5],true);
 var NP=[
  {id:'merchant',n:'Tüccar Hasan',role:'🛒 Dükkân',x:9.2,z:2.6,yaw:2.2,ap:{h:'short',hc:'#3a2410',t:'vest',tc:'#8a5a2a',b:'trousers',bc:'#3a3328',sh:'boots',shc:'#2a1a10',hat:'tophat',htc:'#5a3a1a',mk:'goatee',fd:1}},
  {id:'smith',n:'Demirci Ayten',role:'⚒ Demirci',x:-6.2,z:4.2,yaw:-2.2,ap:{h:'ponytail',hc:'#7a2a14',t:'leather',tc:'#4a3a30',b:'trousers',bc:'#2a2a30',sh:'boots',shc:'#2a1a10',hat:'none',g:'f'}},
  {id:'guild',n:'Lonca Memuru Orhan',role:'🏰 Lonca & Parti',x:11,z:-6.5,yaw:3.6,ap:{h:'short',hc:'#aaaaaa',t:'coat',tc:'#24407a',b:'trousers',bc:'#1b1b24',sh:'boots',shc:'#1b1b24',hat:'cap',htc:'#24407a',mk:'goatee'}},
  {id:'inn',n:'Han Sahibi Nuri',role:'🛏 Han',x:-11,z:-4,yaw:.6,ap:{h:'bald',hc:'#222',t:'tee',tc:'#d8c8a0',b:'trousers',bc:'#5a4a30',sh:'sneaker',shc:'#3a2a1a',hat:'none',mk:'goatee',fd:1}},
  {id:'quest',n:'Haberci Elif',role:'📜 Görevler',x:3.4,z:-9.2,yaw:3.1,ap:{h:'twin',hc:'#c9923e',t:'blouse',tc:'#e8718d',b:'skirt',bc:'#3f6fd0',sh:'boots',shc:'#4a3020',hat:'none',g:'f'}},
  {id:'guard',n:'Kule Bekçisi',role:'🗼 Kule Kapısı',x:0,z:-44.6,yaw:0,ap:{h:'short',hc:'#222',t:'armor',tc:'#8e9aaf',b:'trousers',bc:'#3a3f55',sh:'boots',shc:'#2a2a30',hat:'helmet',htc:'#aab3c2',bk:'cape',bkc:'#c0392b'}}];
 NP.forEach(function(n){n.ap=Object.assign({},PRES.basic.ap,n.ap);if(KB){var _h={merchant:HP.shop,smith:HP.smith,guild:HP.guild,inn:HP.inn,quest:HP.quest}[n.id],_o={merchant:[0,-1.7],smith:[-.9,-1.6],guild:[0,-1.6],inn:[.4,-1.8],quest:[.4,-1.6]}[n.id];if(_h){var q=npcIn(_h,_o[0],_o[1]);n.x=q[0];n.z=q[1];n.yaw=q[2]}}NPCL.push(n);colliders.push([n.x,n.z,.55]);IA.push({k:'npc',id:n.id,x:n.x,z:n.z,r:3.4,lb:n.role})});
 NPCL[5].big=1;uploadWorld()}
/* ---- kat kur ---- */
function bossDef(f){var R=realmOf(f),rr=rng(f*104729+7),id=(f%10===0)?R.rb:R.bp[Math.floor(rr()*R.bp.length)];if(f>=100&&f%100===0)id='yaxest';return id}
var ADJ=['Kızıl','Kadim','Gölge','Demir','Kor','Fısıltılı','Çelik','Zehirli','Fırtına','Ay','Güneş','Sessiz','Yıkık','Altın','Mor','Buz','Kemik','Alev','Hortlak','Ulu','Kanlı','Pas','Sonsuz','Susuz','Karanlık'];
function hsl2rgb(h,s,l){h=((h%360)+360)%360/360;function f(p,q,t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p}var q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;return[f(p,q,h+1/3),f(p,q,h),f(p,q,h-1/3)]}
function h2s(c){function t(v){v=Math.round(Math.max(0,Math.min(1,v))*255);return(v<16?'0':'')+v.toString(16)}return'#'+t(c[0])+t(c[1])+t(c[2])}
function rgb2h(c){var r=c[0],g=c[1],b=c[2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,h=0,s=0,d=mx-mn;if(d>1e-4){s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s,l]}
function recolor(hex,f){var c=hx(hex),q=rgb2h(c);return h2s(hsl2rgb(q[0]+f*37,Math.min(1,q[1]*1.05),Math.max(.32,Math.min(.62,q[2]))))}
var FL={n:0,realm:null,seal:0,need:12,open:0,boss:null,bossDead:0,cleared:0,started:0};
function buildFloor(f){resetWorld();var R=realmOf(f),rn=rng(f*7919+13);FL.n=f;FL.realm=R;FL.seal=0;FL.need=10+Math.ceil(f/5);FL.open=0;FL.boss=null;FL.bossDead=0;FL.started=0;
 WP.amp=R.amp;WP.r0=34;WP.r1=62;WP.bowl=62;WP.bs=.5;WP.lim=72;WP.gm=R.gr?2:0;if(R.gr){WP.ga=R.gr[0];WP.gb=R.gr[1]}
 terrain(88,function(x,z,y){if(inPlaza(x,z)||inArena(x,z))return[[R.ga[0]*.62+.12,R.ga[1]*.62+.12,R.ga[2]*.62+.12].map(function(v){return Math.min(1,v)}),3];
  var g=hash(Math.floor(x*.5),Math.floor(z*.5)),t=g,c=[R.ga[0]+(R.gb[0]-R.ga[0])*t,R.ga[1]+(R.gb[1]-R.ga[1])*t,R.ga[2]+(R.gb[2]-R.ga[2])*t],v=.92+hash(Math.floor(x),Math.floor(z))*.14;return[[c[0]*v,c[1]*v,c[2]*v],R.gm]});
 /* kule iç sütunları (kenar) */
 for(var i=0;i<22;i++){var a=i/22*6.2832,x=Math.cos(a)*70,z=Math.sin(a)*70,y=H(x,z)-.5,h=16+hash(i,3)*4;cone(x,y,z,2.2,h,10,[.42,.4,.38],1,1.9);box(x,y+h,z,5,1,5,[.35,.33,.32],1)}
 /* prop saçılımı */
 var keys=[],wsum=0;Object.keys(R.props).forEach(function(k){keys.push(k);wsum+=R.props[k]});
 var PF={pine:function(x,z,s){pine(x,z,s)},oak:function(x,z,s){oak(x,z,s)},rock:function(x,z,s){rock(x,z,s*1.2,[.5-.1*rn(),.5,.5])},bush:bush,deadtree:function(x,z,s){deadtree(x,z,s)},shroom:shroom,cactus:cactus,ruinpillar:function(x,z,s){ruinpillar(x,z,s)},ruinwall:function(x,z,s){ruinwall(x,z,s,rn()*3.14)},
  icespike:icespike,snowpine:snowpine,obsidian:obsidian,lavapool:function(x,z,s){lavapool(x,z,2+s*2)},crystalc:function(x,z,s){crystalc(x,z,s,hash(x,z)<.5?[.4,.8,1]:[.7,.4,1])},stalag:stalag,cloudp:cloudp,marble:marble,goldpillar:goldpillar,brazier:brazier,grave:grave,banner:banner,shard:shard};
 var placed=0,tries=0;while(placed<95&&tries<600){tries++;var a=rn()*6.2832,r=10+rn()*56,x=Math.cos(a)*r,z=Math.sin(a)*r;if(inPlaza(x,z)||x*x+(z-ARENA[1])*(z-ARENA[1])<22*22||Math.hypot(x-SPAWNP[0],z-SPAWNP[1])<13||(Math.abs(x)<5&&z>-36&&z<52))continue;
  var pick=rn()*wsum,k=keys[0];for(var j=0;j<keys.length;j++){pick-=R.props[keys[j]];if(pick<=0){k=keys[j];break}}PF[k](x,z,.8+rn()*.9);placed++}
 /* patika taşları (spawn'dan arenaya) */
 for(var zz=40;zz>-26;zz-=4){var xx=Math.sin(zz*.13)*3;if(rn()<.8)box(xx+ (rn()-.5)*2,H(xx,zz)-.1,zz,1.2+rn(),.12,1+rn()*.6,[R.ga[0]*.5+.1,R.ga[1]*.5+.1,R.ga[2]*.5+.1],3,rn()*3)}
 /* spawn plaza: ateş + çıkış kapısı */
 bonfire(SPAWNP[0],SPAWNP[1]);arch(0,56,0,6,5.4,[.5,.48,.46],true);lamp(-6,48);lamp(6,48);
 IA.push({k:'fire',x:SPAWNP[0],z:SPAWNP[1],r:3.2,lb:'🔥 Sönmeyen Ateş: dinlen'});IA.push({k:'town',x:0,z:54.2,r:3.6,lb:'🏙 Şehre dön'});
 /* boss arenası */
 for(var i=0;i<16;i++){var a=i/16*6.2832,sx=Math.sin(a);if(sx>.93)continue;var x=ARENA[0]+Math.cos(a)*17,z=ARENA[1]+sx*17,y=H(x,z)-.4,h=9+hash(i,5)*2.5;cone(x,y,z,1.5,h,10,[.38,.36,.4],1,1.25);box(x,y+h,z,3.2,.8,3.2,[.3,.28,.32],1);colliders.push([x,z,1.7])}
 for(var bx=-6;bx<=6.1;bx+=3)barrier.push([bx,-30.6,1.7]);barrier.forEach(function(b){colliders.push(b)});
 arch(0,-60,0,7,6.5,[.5,.48,.5],true);IA.push({k:'next',x:0,z:-57.5,r:3.6,lb:'⬆ Üst kata çık',lock:1});
 /* canavar kampları */
 var camps=[],ct=0;while(camps.length<8&&ct<400){ct++;var a=rn()*6.2832,r=14+rn()*46,x=Math.cos(a)*r,z=Math.sin(a)*r;if(inPlaza(x,z)||Math.hypot(x,z-SPAWNP[1])<17||x*x+(z-ARENA[1])*(z-ARENA[1])<24*24)continue;var ok=1;camps.forEach(function(c){if(Math.hypot(c[0]-x,c[1]-z)<15)ok=0});if(ok)camps.push([x,z])}
 FL.camps=camps;FL.rnSeed=f*31+5;if(DK){dplaza();camps.forEach(function(c,i){ddecor(c[0],c[1],f*13+i)})}uploadWorld()}
