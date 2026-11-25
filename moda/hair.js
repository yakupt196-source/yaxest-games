/* Yaxest Moda: saç modelleri. */
(function(){
'use strict';
var YM=window.YM,U=YM.u,P=U.P,sym=U.sym,mix=U.mix,OL=YM.OL,line=YM.line,circ=YM.circ;
function hp(c,st,path,o){o=o||{};var g=c.createLinearGradient(0,50,0,520);g.addColorStop(0,st.hairC);g.addColorStop(.5,st.hairC);g.addColorStop(1,st.tipC||st.hairC);
 c.fillStyle=g;c.fill(path);c.save();c.clip(path);var s=c.createLinearGradient(150,0,450,0);s.addColorStop(0,'rgba(255,255,255,.2)');s.addColorStop(.4,'rgba(255,255,255,0)');s.addColorStop(1,'rgba(30,0,40,.26)');c.fillStyle=s;c.fillRect(0,0,600,900);c.restore();
 if(o.ol!==false){c.lineWidth=o.lw||3;c.lineJoin='round';c.strokeStyle=OL;c.stroke(path)}}
function hl(c,st,d,w){c.globalAlpha=.5;line(c,d,w||4,mix(st.hairC,.5));c.globalAlpha=1}
var CAP='M234,152 C226,86 262,46 300,46 C338,46 374,86 366,152 C358,120 340,96 300,92 C260,96 242,120 234,152 Z';
var SWOOP='M236,154 C244,104 286,84 326,88 C350,92 362,118 364,154 C352,126 334,116 312,118 C284,120 256,134 236,154 Z';
var BLUNT='M238,142 C238,88 266,50 300,50 C334,50 362,88 362,142 L356,126 Q340,132 326,124 Q312,134 300,124 Q288,134 274,124 Q260,132 244,126 Z';
var PART='M300,60 C266,64 236,104 236,154 L244,168 C272,130 294,100 300,100';
var CAPSW='M234,152 C226,86 262,46 300,46 C338,46 374,86 366,152 C352,126 334,116 312,118 C284,120 256,132 234,152 Z';
function capSwoop(c,st){hp(c,st,P(CAPSW));hl(c,st,'M262,86 Q300,66 342,90');hl(c,st,'M270,108 Q300,98 332,104',3)}
function capBlunt(c,st){hp(c,st,P(BLUNT));hl(c,st,'M262,82 Q300,62 342,84')}
function capPart(c,st){hp(c,st,P(CAP));hp(c,st,sym(PART));hl(c,st,'M262,90 Q282,76 298,72');hl(c,st,'M338,90 Q318,76 302,72')}
function circles(c,st,pts,r){c.lineJoin='round';c.fillStyle=OL;pts.forEach(function(p){c.beginPath();c.arc(p[0],p[1],(p[2]||r)+3,0,6.3);c.fill()});
 pts.forEach(function(p){c.beginPath();c.arc(p[0],p[1],p[2]||r,0,6.3);var g=c.createLinearGradient(0,p[1]-r,0,p[1]+r);g.addColorStop(0,mix(st.hairC,.12));g.addColorStop(1,mix(st.hairC,-.1));c.fillStyle=g;c.fill()});
 pts.forEach(function(p){c.globalAlpha=.22;c.beginPath();c.arc(p[0]-r*.28,p[1]-r*.32,r*.3,0,6.3);c.fillStyle=mix(st.hairC,.6);c.fill();c.globalAlpha=1})}
var H=YM.HAIR;
H[0]={n:'Uzun Düz',tags:['zarif'],
 back:function(c,st){hp(c,st,P('M300,66 C236,66 214,150 218,260 C220,350 228,420 236,454 C268,464 332,464 364,454 C372,420 380,350 382,260 C386,150 364,66 300,66 Z'))},
 front:function(c,st){capSwoop(c,st);hp(c,st,sym('M236,150 C224,230 230,330 244,398 C252,404 262,398 264,388 C256,320 246,230 242,170 Z'));hl(c,st,'M240,200 Q236,280 248,360');hl(c,st,'M360,200 Q364,280 352,360')}};
H[1]={n:'Dalgalı',tags:['peri'],
 back:function(c,st){hp(c,st,P('M300,66 C236,66 210,150 214,250 C216,310 198,350 212,400 C220,430 214,456 232,472 C262,482 270,464 300,472 C330,464 338,482 368,472 C386,456 380,430 388,400 C402,350 384,310 386,250 C390,150 364,66 300,66 Z'))},
 front:function(c,st){capSwoop(c,st);hp(c,st,sym('M236,150 C220,210 246,250 232,300 C220,350 246,390 238,432 C252,442 266,432 268,420 C260,382 262,340 256,300 C250,250 248,200 242,170 Z'));hl(c,st,'M232,220 Q242,260 234,310');hl(c,st,'M368,220 Q358,260 366,310')}};
H[2]={n:'Topuz',tags:['sevimli'],
 back:function(c,st){hp(c,st,P('M262,150 C262,190 268,214 280,226 L320,226 C332,214 338,190 338,150 Z'))},
 front:function(c,st){circles(c,st,[[300,40,32]],32);capPart(c,st);c.save();c.beginPath();c.ellipse(300,70,26,9,0,0,6.3);c.fillStyle=st.tieC;c.fill();c.lineWidth=2.6;c.strokeStyle=OL;c.stroke();c.restore();hp(c,st,sym('M236,152 C232,184 238,204 246,214 L254,204 C250,190 250,176 254,162 Z'))}};
H[3]={n:'İki Kuyruk',tags:['sevimli','okul'],
 back:function(c,st){hp(c,st,sym('M240,96 C190,104 166,172 182,254 C190,304 212,336 230,326 C242,304 222,262 224,222 C226,182 238,152 248,124 Z'))},
 front:function(c,st){capBlunt(c,st);[[240,104],[360,104]].forEach(function(p){YM.bow(c,p[0],p[1],.55,st.tieC)})}};
H[4]={n:'At Kuyruğu',tags:['spor','okul'],
 back:function(c,st){hp(c,st,P('M296,60 C352,34 424,80 424,182 C424,272 394,342 366,412 C352,362 368,292 354,232 C342,182 318,122 296,96 Z'));hl(c,st,'M370,110 Q404,180 392,300')},
 front:function(c,st){capSwoop(c,st);c.beginPath();c.ellipse(312,78,12,8,.5,0,6.3);c.fillStyle=st.tieC;c.fill();c.lineWidth=2.6;c.strokeStyle=OL;c.stroke();hp(c,st,sym('M236,152 C232,186 238,206 246,216 L254,206 C250,190 250,176 254,162 Z'))}};
H[5]={n:'Küt Bob',tags:['şık'],
 back:function(c,st){hp(c,st,P('M300,66 C236,66 212,140 214,204 C214,246 226,258 244,258 C276,264 324,264 356,258 C374,258 386,246 386,204 C388,140 364,66 300,66 Z'))},
 front:function(c,st){capBlunt(c,st);hp(c,st,sym('M238,144 C226,188 232,240 250,252 L268,242 C258,214 258,184 262,164 Z'));hl(c,st,'M236,190 Q234,226 246,244')}};
H[6]={n:'Kıvırcık',tags:['retro','sevimli'],
 back:function(c,st){var p=[];for(var i=0;i<16;i++){var a=i/16*6.2832;p.push([300+Math.cos(a)*96,140+Math.sin(a)*104])}for(i=0;i<6;i++)p.push([300+Math.cos(i*1.05)*58,150+Math.sin(i*1.05)*72]);circles(c,st,p,34)},
 front:function(c,st){var p=[];for(var i=0;i<9;i++){var a=Math.PI+.25+i/8*(Math.PI-.5);p.push([300+Math.cos(a)*62,134+Math.sin(a)*54,20])}p.push([240,150,17],[360,150,17]);circles(c,st,p,20)}};
H[7]={n:'Örgü',tags:['okul','doğa'],
 back:function(c,st){hp(c,st,P('M300,66 C236,66 214,150 220,250 C224,320 244,352 262,364 L338,364 C356,352 376,320 380,250 C386,150 364,66 300,66 Z'))},
 front:function(c,st){capPart(c,st);for(var i=0;i<10;i++){var t=i/9,x=344+Math.sin(t*3.2)*10+t*8,y=232+t*300;c.save();c.translate(x,y);c.rotate(i%2?.5:-.5);c.beginPath();c.ellipse(0,0,19,14,0,0,6.3);hp(c,st,new Path2D(),{});c.restore();
   c.save();c.translate(x,y);c.rotate(i%2?.5:-.5);var pp=new Path2D();pp.ellipse(0,0,19,14,0,0,6.3);hp(c,st,pp);c.restore()}
  c.beginPath();c.arc(356,540,10,0,6.3);c.fillStyle=st.tieC;c.fill();c.lineWidth=2.6;c.strokeStyle=OL;c.stroke();YM.bow(c,356,552,.5,st.tieC);hp(c,st,sym('M236,152 C232,184 238,204 246,214 L254,204 C250,190 250,176 254,162 Z'))}};
YM.lists.hairC=[['#3b2a22','Kestane'],['#1d1620','Siyah'],['#7a4a2a','Kahve'],['#c98a3c','Bal'],['#f1d27a','Sarı'],['#e8e0d0','Platin'],['#c0392b','Kızıl'],['#ff5c8a','Pembe'],['#8a5cf6','Mor'],['#4f7cff','Mavi'],['#2fbf9b','Nane'],['#9aa3b5','Gümüş']];
YM.lists.tipC=[[null,'Aynı'],['#ff5c8a','Pembe'],['#8a5cf6','Mor'],['#4cc9f0','Turkuaz'],['#ffd23f','Sarı'],['#ff8a3d','Turuncu'],['#ffffff','Beyaz']];
})();
