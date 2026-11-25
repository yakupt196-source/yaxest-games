/* Yaxest Moda: kıyafetler (üst, alt, elbise, ayakkabı). */
(function(){
'use strict';
var YM=window.YM,U=YM.u,P=U.P,sym=U.sym,mix=U.mix,OL=YM.OL,paint=YM.paint,line=YM.line,circ=YM.circ,CAT=YM.CAT;
function sleeves(c,X,col,pat,u0,u1,w0,w1){['L','R'].forEach(function(k){YM.limb(c,X.arms[k],u0,u1,w0,w1,col,pat,3)})}
function cuffs(c,X,col,u,w){['L','R'].forEach(function(k){YM.limb(c,X.arms[k],u,u+.05,w,w,mix(col,-.12),null,3)})}
function straps(c,col,pat){[[274,262,268,308],[326,262,332,308]].forEach(function(s){c.lineCap='round';c.beginPath();c.moveTo(s[0],s[1]);c.lineTo(s[2],s[3]);c.lineWidth=12;c.strokeStyle=OL;c.stroke();c.lineWidth=7;c.strokeStyle=col;c.stroke()})}
function scallops(x0,x1,y,n,depth){var s='';for(var i=0;i<n;i++){var a=x0+(x1-x0)*i/n,b=x0+(x1-x0)*(i+1)/n;s+=' Q'+((a+b)/2).toFixed(1)+','+(y+depth)+' '+b.toFixed(1)+','+y}return s}
function tutu(c,col,pat,yb,spread,layers){for(var l=0;l<layers;l++){var wid=spread+(layers-1-l)*18,y2=yb+(layers-1-l)*8,cc=l===layers-1?col:mix(col,l%2?-.12:.16);
 var d='M300,392 L258,394 C246,420 '+(300-wid)+','+(y2-80)+' '+(300-wid)+','+(y2-14)+' L'+(300-wid)+','+y2+scallops(300-wid,300,y2,6,12);paint(c,sym(d),cc,l===layers-1?pat:null,{lw:2.6,v:[400,y2+12]})}}
function belt(c,y,col,w){var d='M258,'+y+' L342,'+y+' L344,'+(y+w)+' L256,'+(y+w)+' Z';paint(c,P(d),col,null,{lw:2.6});circ(c,300,y+w/2,w*.5,'#ffd23f',2)}
function bow(c,x,y,s,col){c.save();c.translate(x,y);[-1,1].forEach(function(k){var d='M0,0 C'+(k*14*s)+','+(-14*s)+' '+(k*30*s)+','+(-10*s)+' '+(k*28*s)+',0 C'+(k*30*s)+','+(10*s)+' '+(k*14*s)+','+(14*s)+' 0,0 Z';paint(c,P(d),col,null,{lw:2.4})});circ(c,0,0,5*s,mix(col,-.18),2.2);c.restore()}
YM.bow=bow;
function add(slot,list){CAT[slot]=list}
/* ---------------- ÜSTLER ---------------- */
add('top',[
 {id:'tisort',n:'Tişört',tags:['günlük','okul','spor','yaz','sevimli'],price:0,view:[210,250,180,190],draw:function(c,col,pat,X){sleeves(c,X,col,pat,.02,.36,32,28);paint(c,P(YM.torsoD(424,'crew')),col,pat,{v:[260,430]});YM.heart(c,300,350,10,'#fff',0);c.globalAlpha=.9;YM.heart(c,300,350,10,'#fff',0);c.globalAlpha=1;line(c,'M262,418 L338,418',2,mix(col,-.25))}},
 {id:'crop',n:'Crop Top',tags:['günlük','spor','yaz','parti','retro'],price:0,view:[210,250,180,150],draw:function(c,col,pat,X){sleeves(c,X,col,pat,.02,.3,29,26);paint(c,P(YM.torsoD(358,'crew')),col,pat,{v:[260,360]});line(c,'M258,356 L342,356',2,mix(col,-.25));YM.star(c,300,322,8,3.4,'#fff',0)}},
 {id:'askili',n:'Askılı Üst',tags:['yaz','plaj','günlük','sevimli'],price:0,view:[210,250,180,190],draw:function(c,col,pat,X){paint(c,P(YM.torsoD(412,'tank')),col,pat,{v:[300,420]});straps(c,col);line(c,'M262,408 L338,408',2,mix(col,-.25));circ(c,300,318,4,mix(col,.5),0)}},
 {id:'bluz',n:'Fırfırlı Bluz',tags:['zarif','okul','şık','günlük','prenses'],price:0,view:[160,250,280,200],draw:function(c,col,pat,X){sleeves(c,X,col,pat,.02,.78,38,26);cuffs(c,X,col,.74,28);paint(c,P(YM.torsoD(438,'v')),col,pat,{v:[260,440]});
   c.lineWidth=2.4;c.strokeStyle=mix(col,-.25);c.beginPath();c.moveTo(266,258);c.lineTo(300,306);c.lineTo(334,258);c.stroke();
   [330,356,382,408].forEach(function(y){circ(c,300,y,2.6,mix(col,.6),0)})}},
 {id:'kazak',n:'Yumuşak Kazak',tags:['kış','sıcak','günlük','okul','sevimli'],price:0,view:[160,230,280,230],draw:function(c,col,pat,X){sleeves(c,X,col,pat,.02,.9,36,29);cuffs(c,X,col,.86,30);paint(c,P(YM.torsoD(446,'crew')),col,pat,{v:[260,450]});
   paint(c,P('M274,246 L274,268 Q300,284 326,268 L326,246 Q300,256 274,246 Z'),mix(col,-.08),null,{lw:2.6});
   for(var i=0;i<8;i++)line(c,'M'+(278+i*6)+',250 L'+(278+i*6)+',272',1.2,mix(col,-.25));
   paint(c,P('M258,436 L342,436 L344,452 L256,452 Z'),mix(col,-.1),null,{lw:2.4});for(i=0;i<14;i++)line(c,'M'+(262+i*6)+',438 L'+(262+i*6)+',450',1.2,mix(col,-.28))}},
 {id:'omuz',n:'Omuz Açık Bluz',tags:['yaz','şık','parti','zarif','retro'],price:12,view:[180,260,240,160],draw:function(c,col,pat,X){sleeves(c,X,col,pat,.12,.66,31,22);paint(c,P(YM.torsoD(398,'off')),col,pat,{v:[300,400]});
   var d='M236,298'+scallops(236,364,298,8,10)+' L362,300 Q300,284 238,300 Z';paint(c,P(d),mix(col,.18),null,{lw:2.4});line(c,'M262,396 L338,396',2,mix(col,-.25))}},
 {id:'hirka',n:'Uzun Hırka',tags:['günlük','kış','okul','sıcak','şık'],price:0,view:[160,250,280,230],draw:function(c,col,pat,X){var inner='#fffaf2';paint(c,P(YM.torsoD(410,'tank')),inner,null,{v:[300,420]});straps(c,inner);sleeves(c,X,col,pat,.02,.9,34,28);cuffs(c,X,col,.86,30);
   var half='M284,258 L266,258 L240,270 C240,312 248,350 258,392 C250,430 242,460 238,478 L284,478';paint(c,sym(half),col,pat,{v:[260,480]});
   [340,372,404].forEach(function(y){circ(c,282,y,3.2,mix(col,.6),1.6);});line(c,'M284,258 L284,478',2.4,OL)}},
 {id:'ceket',n:'Şık Ceket',tags:['şık','zarif','okul','gece','glam'],price:18,view:[160,240,280,240],draw:function(c,col,pat,X){sleeves(c,X,col,pat,.02,.92,35,29);cuffs(c,X,col,.88,30);
   paint(c,P(YM.torsoD(452,'sq')),'#fffaf2',null,{ol:false});
   var half='M300,300 L286,258 L266,258 L240,270 C240,312 248,350 258,392 C250,430 242,460 240,480 L292,480 L292,372 L282,336 Z';paint(c,sym(half),col,pat,{v:[260,480]});
   paint(c,P('M268,258 L300,334 L274,340 L256,300 Z'),mix(col,.16),null,{lw:2.4});paint(c,P('M332,258 L300,334 L326,340 L344,300 Z'),mix(col,.16),null,{lw:2.4});
   circ(c,290,398,3.6,'#ffd23f',1.6);circ(c,310,398,3.6,'#ffd23f',1.6);YM.sparkle(c,272,330,6,'#fff',.8)}}
]);
/* ---------------- ALTLAR ---------------- */
add('bottom',[
 {id:'etek',n:'Mini Etek',tags:['günlük','okul','sevimli','parti','retro'],price:0,view:[190,380,220,170],draw:function(c,col,pat){paint(c,sym('M300,388 L258,388 C246,436 226,486 210,526 C240,538 272,540 300,540'),col,pat,{v:[390,540]});paint(c,P('M258,388 L342,388 L343,404 L257,404 Z'),mix(col,-.1),null,{lw:2.4})}},
 {id:'maxi',n:'Uzun Akan Etek',tags:['zarif','doğa','yaz','peri','plaj','prenses'],price:14,view:[130,380,340,430],draw:function(c,col,pat,X){var w=Math.sin(X.t*1.4)*3;paint(c,sym('M300,388 L258,388 C250,450 232,560 198,700 C182,750 172,782 '+(160+w)+',796 C210,812 262,806 300,812'),col,pat,{v:[390,810]});
   [[268,430,236,790],[286,436,274,806],[314,436,326,806],[332,430,364,790]].forEach(function(l){c.globalAlpha=.22;line(c,'M'+l[0]+','+l[1]+' Q'+((l[0]+l[2])/2+4)+',600 '+l[2]+','+l[3],2,'#2a0030');c.globalAlpha=1});paint(c,P('M258,388 L342,388 L343,404 L257,404 Z'),mix(col,-.12),null,{lw:2.4})}},
 {id:'pileli',n:'Pileli Etek',tags:['okul','şık','sevimli','günlük','retro'],price:0,view:[170,380,260,240],draw:function(c,col,pat){paint(c,sym('M300,388 L258,388 C244,440 220,530 202,604 C240,616 270,612 300,612'),col,pat,{v:[390,610]});for(var i=0;i<10;i++){var x0=262+i*8.4,x1=214+i*17.2;c.globalAlpha=.25;line(c,'M'+x0+',400 L'+x1+',608',1.8,'#2a0030');c.globalAlpha=1}paint(c,P('M258,388 L342,388 L343,404 L257,404 Z'),mix(col,-.1),null,{lw:2.4})}},
 {id:'sort',n:'Şort',tags:['yaz','spor','plaj','günlük','okul'],price:0,view:[200,380,200,190],draw:function(c,col,pat){paint(c,sym('M300,388 L258,388 C248,430 240,486 236,546 C256,558 282,558 298,550 L300,468'),col,pat,{v:[390,560]});paint(c,P('M258,388 L342,388 L343,402 L257,402 Z'),mix(col,-.1),null,{lw:2.4});line(c,'M300,470 L298,550',2.4,OL);circ(c,300,408,2.6,'#fff',0)}},
 {id:'pantolon',n:'Geniş Pantolon',tags:['şık','günlük','retro','okul','kış'],price:0,view:[190,380,220,440],draw:function(c,col,pat){paint(c,sym('M300,388 L258,388 C250,450 244,560 234,700 C230,750 228,780 222,802 L292,802 C294,740 298,600 300,520'),col,pat,{v:[390,800]});paint(c,P('M258,388 L342,388 L343,404 L257,404 Z'),mix(col,-.12),null,{lw:2.4});line(c,'M300,404 L300,520',2.4,OL);[[266,806],[334,806]].forEach(function(p){});}},
 {id:'kot',n:'Kot Pantolon',tags:['günlük','spor','okul','retro','sevimli'],price:0,view:[200,380,200,440],draw:function(c,col,pat){paint(c,sym('M300,388 L258,388 C250,440 252,560 258,700 C260,750 264,780 266,800 L292,800 C296,740 298,600 300,500'),col,pat,{v:[390,800]});paint(c,P('M258,388 L342,388 L343,406 L257,406 Z'),mix(col,-.12),null,{lw:2.4});
   c.setLineDash([4,3]);c.globalAlpha=.7;line(c,'M262,408 L338,408',1.6,mix(col,.55));line(c,'M268,420 Q272,440 284,444',1.6,mix(col,.55));line(c,'M332,420 Q328,440 316,444',1.6,mix(col,.55));c.setLineDash([]);c.globalAlpha=1;line(c,'M300,408 L300,500',2.4,OL);circ(c,300,396,3,'#ffd23f',1.4)}},
 {id:'tutu',n:'Tütü',tags:['prenses','sevimli','parti','peri','fantezi'],price:16,view:[150,380,300,190],draw:function(c,col,pat){tutu(c,col,pat,532,70,3);paint(c,P('M258,388 L342,388 L343,404 L257,404 Z'),mix(col,-.1),null,{lw:2.4})}}
]);
/* ---------------- ELBİSELER ---------------- */
add('dress',[
 {id:'balo',n:'Balo Elbisesi',tags:['prenses','zarif','gece','glam','fantezi'],price:35,view:[90,250,420,580],draw:function(c,col,pat,X){var w=Math.sin(X.t*1.2)*3;
   paint(c,sym('M300,404 L258,404 C230,480 160,640 '+(96+w)+',796 C150,822 230,832 300,834'),col,pat,{v:[400,830]});
   for(var i=0;i<4;i++){var y=520+i*74,dx=40+i*42;c.globalAlpha=.3;line(c,'M'+(300-dx)+','+y+' Q300,'+(y+24)+' '+(300+dx)+','+y,2.4,'#2a0030');c.globalAlpha=1}
   paint(c,P(YM.torsoD(420,'sweet')),mix(col,.1),pat,{v:[300,420]});line(c,'M258,404 L342,404',2.4,mix(col,-.3));
   YM.sparkle(c,200,700,9,'#fff',.8);YM.sparkle(c,400,620,7,'#fff',.8);YM.sparkle(c,260,560,6,'#fff',.7);bow(c,300,408,.7,mix(col,-.15));
   [[300,356]].forEach(function(p){YM.heart(c,p[0],p[1],7,'#ffd23f',1.6)})}},
 {id:'yazlik',n:'Yazlık Elbise',tags:['yaz','plaj','günlük','sevimli','doğa'],price:0,view:[140,250,320,380],draw:function(c,col,pat,X){var w=Math.sin(X.t*1.5)*2;
   paint(c,sym('M300,388 L258,388 C246,450 200,540 '+(166+w)+',606 C220,622 262,620 300,622'),col,pat,{v:[300,620]});paint(c,P(YM.torsoD(396,'scoop')),col,pat,{v:[260,400]});straps(c,col);
   paint(c,P('M258,386 L342,386 L343,402 L257,402 Z'),mix(col,.4),null,{lw:2.4});c.globalAlpha=.7;YM.heart(c,300,400,6,mix(col,.7),0);c.globalAlpha=1}},
 {id:'kokteyl',n:'Kokteyl Elbisesi',tags:['şık','gece','glam','parti','zarif'],price:22,view:[170,250,260,370],draw:function(c,col,pat,X){sleeves(c,X,col,pat,.02,.28,28,25);
   paint(c,sym('M300,390 L258,390 C250,440 236,500 236,564 C256,612 282,616 300,616'),col,pat,{v:[300,620]});paint(c,P(YM.torsoD(396,'sq')),col,pat,{v:[260,400]});
   for(var i=0;i<4;i++){c.globalAlpha=.22;line(c,'M'+(262+i*3)+','+(404+i*26)+' Q300,'+(412+i*26)+' '+(338-i*3)+','+(404+i*26),2,'#2a0030');c.globalAlpha=1}YM.sparkle(c,276,470,6,'#fff',.8);YM.sparkle(c,326,540,5,'#fff',.7)}},
 {id:'deniz',n:'Denizkızı Elbisesi',tags:['fantezi','glam','gece','plaj','peri'],price:30,view:[150,250,300,590],draw:function(c,col,pat,X){var w=Math.sin(X.t*1.8)*4;
   paint(c,sym('M300,390 L258,390 C248,450 244,540 248,640 C252,710 236,770 '+(196+w)+',820 C226,842 270,812 300,830'),col,pat,{v:[300,830]});
   c.save();c.clip(sym('M300,390 L258,390 C248,450 244,540 248,640 C252,710 236,770 '+(196+w)+',820 C226,842 270,812 300,830'));c.globalAlpha=.3;c.strokeStyle='#fff';c.lineWidth=1.6;for(var r=0;r<9;r++)for(var q=0;q<5;q++){c.beginPath();c.arc(236+q*16+(r%2)*8,520+r*34,9,0,Math.PI);c.stroke()}c.restore();c.globalAlpha=1;
   paint(c,P(YM.torsoD(420,'sweet')),mix(col,.12),pat,{v:[300,420]});YM.sparkle(c,270,560,7,'#fff',.8);YM.sparkle(c,336,700,6,'#fff',.7)}},
 {id:'bale',n:'Bale Elbisesi',tags:['prenses','sevimli','zarif','fantezi','peri','parti'],price:20,view:[130,250,340,340],draw:function(c,col,pat,X){tutu(c,col,pat,572,84,3);paint(c,P(YM.torsoD(408,'sweet')),col,pat,{v:[300,420]});straps(c,col);
   paint(c,P('M258,398 L342,398 L343,414 L257,414 Z'),mix(col,-.12),null,{lw:2.4});bow(c,300,408,.5,mix(col,.3));YM.sparkle(c,230,500,6,'#fff',.8)}},
 {id:'tulum',n:'Şık Tulum',tags:['şık','günlük','retro','okul','glam'],price:16,view:[170,250,260,570],draw:function(c,col,pat,X){sleeves(c,X,col,pat,.02,.32,30,26);
   paint(c,sym('M300,388 L258,388 C250,450 244,560 234,700 C230,750 228,780 222,802 L292,802 C294,740 298,600 300,520'),col,pat,{v:[300,800]});paint(c,P(YM.torsoD(402,'v')),col,pat,{v:[260,400]});
   c.lineWidth=2.4;c.strokeStyle=mix(col,-.25);c.beginPath();c.moveTo(266,258);c.lineTo(300,306);c.lineTo(334,258);c.stroke();belt(c,392,'#ffd23f',14);line(c,'M300,406 L300,520',2.4,OL)}},
 {id:'palto',n:'Kış Paltosu',tags:['kış','sıcak','şık','zarif'],price:24,view:[130,230,340,460],draw:function(c,col,pat,X){sleeves(c,X,col,pat,.02,.92,38,32);cuffs(c,X,mix(col,.2),.86,34);
   var half='M300,296 L284,252 L262,256 L238,268 C242,320 248,362 254,396 C244,470 228,560 212,660 C246,672 274,668 300,670';paint(c,sym(half),col,pat,{v:[260,670]});
   paint(c,P('M262,256 L300,318 L338,256 L352,282 L300,350 L248,282 Z'),mix(col,.22),null,{lw:2.6});[372,420,468].forEach(function(y){circ(c,288,y,4,'#ffd23f',1.8);circ(c,312,y,4,'#ffd23f',1.8)});
   belt(c,396,mix(col,-.3),14);line(c,'M300,350 L300,670',2.2,OL);YM.sparkle(c,262,330,5,'#fff',.6)}}
]);
/* ---------------- AYAKKABILAR ---------------- */
function shoe(c,col,pat,d,sole){c.save();c.translate(300,806);c.scale(1.22,1.1);c.translate(-300,-806);paint(c,sym(d),col,pat,{lw:2.4});if(sole)paint(c,sym(sole),'#fffaf2',null,{lw:2.2});c.restore()}
add('shoes',[
 {id:'spor',n:'Spor Ayakkabı',tags:['spor','günlük','okul','sevimli'],price:0,view:[230,750,140,100],draw:function(c,col,pat){shoe(c,col,pat,'M270,776 L298,776 C300,788 306,800 304,812 C294,822 262,822 256,812 C254,800 262,788 270,776 Z','M254,812 C262,826 298,826 306,812 L306,820 C298,834 262,834 254,820 Z');
   [[284,786],[282,794]].forEach(function(p){line(c,'M'+(p[0]-6)+','+p[1]+' L'+(p[0]+6)+','+p[1],1.8,OL);line(c,'M'+(630-p[0]-6)+','+p[1]+' L'+(630-p[0]+6)+','+p[1],1.8,OL)});}},
 {id:'topuklu',n:'Topuklu',tags:['şık','zarif','gece','glam','prenses','parti'],price:14,view:[230,750,140,100],draw:function(c,col,pat){shoe(c,col,pat,'M270,776 L298,776 C300,790 302,804 292,816 C282,826 258,824 254,816 C262,802 268,790 270,776 Z');
   paint(c,sym('M286,818 L296,816 L294,836 L289,836 Z'),mix(col,-.2),null,{lw:2.2});YM.sparkle(c,272,800,4,'#fff',.8)}},
 {id:'bot',n:'Bilekli Bot',tags:['kış','sıcak','günlük','retro','okul'],price:0,view:[230,720,140,130],draw:function(c,col,pat){shoe(c,col,pat,'M266,738 L300,738 C300,776 306,800 306,812 C296,824 256,824 252,812 C254,798 264,788 266,738 Z','M252,812 C260,828 298,828 306,812 L306,820 C298,836 258,836 252,820 Z');paint(c,sym('M266,738 L300,738 L300,750 L266,750 Z'),mix(col,.25),null,{lw:2.2});circ(c,280,774,3,'#ffd23f',1.2);circ(c,320,774,3,'#ffd23f',1.2)}},
 {id:'babet',n:'Fiyonklu Babet',tags:['zarif','sevimli','okul','günlük','prenses'],price:0,view:[230,750,140,90],draw:function(c,col,pat){shoe(c,col,pat,'M268,790 C260,800 256,810 262,818 C276,826 296,826 304,818 C306,806 300,796 296,790 Z');[[282,801],[318,801]].forEach(function(p){YM.bow(c,p[0],p[1],.32,mix(col,.3))})}},
 {id:'sandalet',n:'Sandalet',tags:['yaz','plaj','günlük','sevimli'],price:0,view:[230,750,140,100],draw:function(c,col,pat,X){var sk=U.hx(U.rgb(YM.lists.skin[X.st.skin][0]));paint(c,sym('M270,780 L298,780 C300,792 304,804 302,814 C292,824 264,824 256,814 C256,802 264,792 270,780 Z'),sk,null,{lw:2.8});
   [[0,-6],[1,0]].forEach(function(){});paint(c,sym('M258,814 C266,826 296,826 304,814 L304,820 C296,832 266,832 258,820 Z'),col,pat,{lw:2.4});[[262,806,300,798],[262,798,300,790]].forEach(function(s){line(c,'M'+s[0]+','+s[1]+' L'+s[2]+','+s[3],5,col);line(c,'M'+(630-s[0])+','+s[1]+' L'+(630-s[2])+','+s[3],5,col)});circ(c,284,800,3,'#ffd23f',1.2);circ(c,316,800,3,'#ffd23f',1.2)}},
 {id:'cizme',n:'Uzun Çizme',tags:['kış','şık','sıcak','retro','glam'],price:18,view:[220,620,160,230],draw:function(c,col,pat){shoe(c,col,pat,'M262,640 L304,640 C302,700 300,760 306,812 C296,824 254,824 250,812 C256,790 262,740 262,640 Z','M250,812 C258,828 298,828 306,812 L306,820 C298,836 256,836 250,820 Z');paint(c,sym('M260,640 L304,640 L303,660 L260,660 Z'),'#fffaf2',null,{lw:2.4})}},
 {id:'paten',n:'Paten',tags:['sevimli','spor','retro','parti','fantezi'],price:20,view:[230,740,140,120],draw:function(c,col,pat){shoe(c,col,pat,'M266,752 L300,752 C300,780 306,800 306,812 C296,822 256,822 252,812 C254,798 264,788 266,752 Z');paint(c,sym('M252,812 L306,812 L306,820 L252,820 Z'),'#fffaf2',null,{lw:2.2});[262,278,294].forEach(function(x){circ(c,x,830,5,'#ff5c8a',2);circ(c,630-x,830,5,'#ff5c8a',2)});YM.heart(c,284,790,4,'#fff',0);YM.heart(c,316,790,4,'#fff',0)}}
]);
})();
