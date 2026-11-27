/* Yaxest Diyarı: özgün çizim kitaplığı. Emoji yok: tüm simgeler, karakterler, yapılar ve yaratıklar kodla çizilir. */
(function(){'use strict';
var YA={};
/* ================= SVG SİMGELER (32x32) ================= */
function GF(f){return f&&/^#[0-9a-f]{6}$/i.test(f)?'url(#yg-'+f.slice(1).toLowerCase()+')':(f||'none')}
function mixc(h,t,a){var n=parseInt(h,16),r=n>>16,g=n>>8&255,b=n&255,tr=t>>16,tg=t>>8&255,tb=t&255;return'#'+((1<<24)+(Math.round(r+(tr-r)*a)<<16)+(Math.round(g+(tg-g)*a)<<8)+Math.round(b+(tb-b)*a)).toString(16).slice(1)}
function gdefs(b){var ids={},m,re=/yg-([0-9a-f]{6})/g,o='';while(m=re.exec(b))ids[m[1]]=1;Object.keys(ids).forEach(function(c){o+='<linearGradient id="yg-'+c+'" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="'+mixc(c,0xffffff,.34)+'"/><stop offset=".55" stop-color="#'+c+'"/><stop offset="1" stop-color="'+mixc(c,0,.2)+'"/></linearGradient>'});return o?'<defs>'+o+'</defs>':''}
function P(d,f,s,w){return'<path d="'+d+'" fill="'+GF(f)+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||1.15)+'" stroke-linejoin="round" stroke-linecap="round"':'')+'/>'}
function C(x,y,r,f,s,w){return'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+GF(f)+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||1.4)+'"':'')+'/>'}
function R(x,y,w,h,r,f,s){return'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r||0)+'" fill="'+GF(f)+'"'+(s?' stroke="'+s+'" stroke-width="1.3"':'')+'/>'}
function G(t,i){return'<g transform="'+t+'">'+i+'</g>'}
var K='rgba(22,12,48,.55)';
function sword(c){c=c||'#dfe6f5';return G('rotate(45 16 16)',P('M16 2.5 19.5 7V20H12.5V7Z',c,K)+'<path d="M16 4V20" stroke="#9aa8c8" stroke-width="1.2"/>'+R(8.5,20,15,3.4,1.5,'#d9a232',K)+R(14.2,23.4,3.6,5,1,'#7a4f2b',K)+C(16,29.6,2.1,'#d9a232',K,1))}
function nug(r,n){return P('M4.5 24 7.5 12.5 15 7 24 9 28.5 18 25 26Z',r,K)+P('M7.5 12.5 15 7 24 9 17 13Z','#ffffff44')+C(12,18.5,3.2,n,K,1)+C(19.5,16,2.7,n,K,1)+C(21,22.2,2.3,n,K,1)+C(14.2,23.4,1.9,n,K,1)+C(11,17.2,1,'#fff9')+C(18.8,15.1,.9,'#fff9')}
function bar(x,y,w,c,h){return P('M'+x+' '+(y+7)+'L'+(x+3)+' '+y+'H'+(x+w-3)+'L'+(x+w)+' '+(y+7)+'Z',c,K,1.2)+P('M'+(x+3)+' '+y+'H'+(x+w-3)+'L'+(x+w-5)+' '+(y+2.6)+'H'+(x+5)+'Z',h)}
function ing(c,h){return bar(1,20,16,c,h)+bar(15,20,16,c,h)+bar(8,11,16,c,h)}
function rune(g,col){return P('M9 4H23L27 9V26L23 29H9L5 26V9Z','#59607a',K)+P('M9 4H23L27 9H5Z','#ffffff2e')+P('M7 11H25V25L22 27H10L7 25Z','#3b4160')+g.replace(/COL/g,col)}
var ICON={
 sword:sword(),
 shield:P('M16 2.5 27 6.5V15C27 22 22.5 27 16 30 9.5 27 5 22 5 15V6.5Z','#4a8fe0',K)+P('M16 5.6 24 8.7V15C24 20.5 20.5 24.5 16 27Z','#7cb6f7')+C(16,15,4.2,'#d9a232',K,1.2)+C(16,15,1.6,'#fff8')+P('M16 2.5 27 6.5V15C27 22 22.5 27 16 30 9.5 27 5 22 5 15V6.5Z','none',K),
 orb:G('rotate(40 16 16)',R(14.7,11,2.6,19,1.2,'#7a4f2b',K)+P('M10.5 9.5Q10 5 13 3.5M21.5 9.5Q22 5 19 3.5','none','#d9a232',1.6)+C(16,8,6,'#b57bff',K)+C(14,6,2.2,'#ffffffaa')+C(18.5,10,1.4,'#6a35c9')),
 cross:R(11,3,10,26,3.5,'#46d68a',K)+R(3,11,26,10,3.5,'#46d68a',K)+R(12.5,4.5,7,23,2,'#7af0b4')+R(4.5,12.5,23,7,2,'#7af0b4')+C(16,16,3,'#e9fff3'),
 dagger:G('rotate(-38 16 16)',P('M16 3 18.6 7.5V19H13.4V7.5Z','#e8d9ff',K)+R(10.5,19,11,3,1.4,'#ffd23f',K)+R(14.4,22,3.2,6,1,'#4d3a6b',K))+G('rotate(38 16 16)',P('M16 3 18.6 7.5V19H13.4V7.5Z','#cdbdf3',K)+R(10.5,19,11,3,1.4,'#e0a8ff',K)+R(14.4,22,3.2,6,1,'#4d3a6b',K)),
 spin:P('M26 13A10.5 10.5 0 0 0 8 9','none','#ff7a5c',3)+P('M8.8 4 7.6 10.2 13.8 11.2Z','#ff7a5c',K,1)+P('M6 19A10.5 10.5 0 0 0 24 23','none','#ffb08f',3)+P('M23.2 28 24.4 21.8 18.2 20.8Z','#ffb08f',K,1)+C(16,16,2.6,'#ffe3d6',K,1),
 charge:P('M4 9H14M2 16H12M4 23H14','none','#9bd0ff',2.4)+P('M14 5 28 16 14 27 17 16Z','#ff7a5c',K)+P('M14 5 28 16 17 16Z','#ffb08f'),
 roar:P('M4 12V20H9L19 26V6L9 12Z','#ffb347',K)+R(2,12,4,8,1.5,'#c97a1e',K)+P('M22 11Q26 16 22 21M25 8Q31 16 25 24','none','#ffe08a',2.2),
 taunt:P('M16 1.5 19.5 9 27.5 6.5 23.5 14 30.5 18 22.5 20 24 28 16 23.5 8 28 9.5 20 1.5 18 8.5 14 4.5 6.5 12.5 9Z','#ff6b6b',K)+R(14.2,9,3.6,9.5,1.6,'#fff')+C(16,22.2,2,'#fff'),
 slam:P('M16 4 18 13 27 9 21 17 30 21 20 22 22 30 16 24 10 30 12 22 2 21 11 17 5 9 14 13Z','#ffd36b',K)+C(16,19,5,'#ff8a4a',K),
 nova:G('translate(16 16)',[0,60,120].map(function(a){return'<g transform="rotate('+a+')"><path d="M0 -13V13M-3.5 -9 0 -12 3.5 -9M-3.5 9 0 12 3.5 9" stroke="#8fe0ff" stroke-width="2.4" stroke-linecap="round" fill="none"/></g>'}).join('')+C(0,0,3,'#e8fbff','#5cc0e8',1.2)),
 bolt:P('M19 2 7 18H14L11 30 25 12H17.5Z','#ffe14a',K,1.4)+P('M19 2 11.5 13H16Z','#fff6a8'),
 blink:P('M12 3 14.6 11.4 23 14 14.6 16.6 12 25 9.4 16.6 1 14 9.4 11.4Z','#d6b3ff',K)+P('M24 15 25.6 19.4 30 21 25.6 22.6 24 27 22.4 22.6 18 21 22.4 19.4Z','#9a63ff',K),
 heal:C(16,16,13,'#46d68a22')+R(12,6,8,20,3,'#46d68a',K)+R(6,12,20,8,3,'#46d68a',K)+R(13.2,7.2,5.6,17.6,2,'#8af5c0')+R(7.2,13.2,17.6,5.6,2,'#8af5c0'),
 hot:P('M16 29V13','none','#3c8f58',2.4)+P('M16 20C8 20 5 14 6 8 13 8 17 12 16 20Z','#58d98a',K)+P('M16 15C22 15 26 11 26 5 20 5 16 9 16 15Z','#8af5b0',K),
 flame:P('M16 2C17 8 24 11 24 19A8 8 0 0 1 8 19C8 14 11 12 12 8 13.5 10 14.5 10 15 8 15.4 6 15.5 4 16 2Z','#ff8a2b',K)+P('M16 13C17 17 20.5 18 20.5 22A4.5 4.5 0 0 1 11.5 22C11.5 19 14 18 14.5 15 15.4 16 15.8 15 16 13Z','#ffd23f'),
 shadow:C(16,16,13,'#3b2f66',K,1.4)+P('M21 5.5A11 11 0 1 0 21 26.5 8.6 8.6 0 1 1 21 5.5Z','#cdb8ff')+P('M3 29 12 20','none','#fff',2)+C(22,13,1.4,'#fff'),
 poison:P('M16 2.5C16 2.5 7 13 7 19.5A9 9 0 0 0 25 19.5C25 13 16 2.5 16 2.5Z','#7ae05a',K)+P('M16 7C13 11 10.5 15 10.5 19','none','#d9ffb8',2)+C(22,8,2.8,'#aaf08a',K,1)+C(26,14,1.8,'#aaf08a',K,1),
 smoke:C(10,19,6.5,'#b9bfd2',K,1.2)+C(19,15,8,'#d2d7e6',K,1.2)+C(24,21,5.5,'#b9bfd2',K,1.2)+R(8,21,17,6,3,'#d2d7e6')+P('M3 11H8M24 8H29','none','#fff',2),
 fist:P('M7 15V9a2 2 0 0 1 4 0V13V6a2 2 0 0 1 4 0V13V7a2 2 0 0 1 4 0V14V10a2 2 0 0 1 4 0V19C24 25 20 29 15 29S7 24 7 15Z','#ffcf9a',K),
 coin:C(16,16,13,'#e3a91c',K)+C(16,16,9.5,'#ffd23f','#b97c10',1.4)+P('M11.5 10.5 16 17 20.5 10.5M16 17V23','none','#9a6408',2.2),
 wood:R(3,15,25,11,3.4,'#9a6a3c',K)+R(5,6,23,10,3.4,'#b57a45',K)+P('M7 21H21M9 11H22','none','#7a4f2b',1.3)+'<ellipse cx="26.4" cy="20.5" rx="3.6" ry="5.5" fill="#e2b574" stroke="'+K+'" stroke-width="1.3"/><ellipse cx="26.4" cy="20.5" rx="1.7" ry="3" fill="none" stroke="#b57a45"/>',
 stone:P('M3.5 24 7 13 14 7.5 23 9 28.5 17 26 26Z','#8f97ad',K)+P('M7 13 14 7.5 23 9 16 14Z','#c4cadb')+P('M16 14 26 26 3.5 24Z','#6d748c'),
 copper:nug('#7a5a48','#e8924e'),iron:nug('#5a5660','#d6cfc8'),silver:nug('#6b7083','#eef3ff'),goldore:nug('#6d6150','#ffd23f'),mithril:nug('#3d4d72','#7ad7ff'),titan:nug('#2f4a50','#6ef0d0'),aster:nug('#3a2a58','#ff7af0'),ruby:nug('#4a2a36','#ff4f6e'),emerald:nug('#1f3a30','#4fff9a'),sapphire:nug('#1f2a4a','#5fa8ff'),hwood:R(3,15,25,11,3.4,'#5a3a1e',K)+R(5,6,23,10,3.4,'#7a4f2b',K)+P('M7 21H21M9 11H22','none','#3d2812',1.3),i_titan:ing('#2fb39a','#9ff7e3'),i_aster:ing('#9a4fd0','#ffa8f5'),
 i_copper:ing('#c8743a','#f0a870'),i_iron:ing('#8a909e','#c9cfdb'),i_silver:ing('#c8d2e8','#f4f8ff'),i_gold:ing('#e3a91c','#ffe27a'),i_mithril:ing('#3f9bdc','#9be0ff'),
 fang:P('M7 5C19 4 25 9 24 17 23 23 19 27 15 29 16.5 21.5 14 16 7 12Z','#f6f1de',K)+P('M10 7C17 7 21 10 21 15','none','#fff',1.6)+P('M15 29C16.5 21.5 14 16 7 12','none','#bfb89a',1.4),
 crystal:P('M16 2.5 25 11 23 25.5 16 30 9 25.5 7 11Z','#58c7f0',K)+P('M16 2.5 7 11 16 14Z','#b8f0ff')+P('M16 2.5 25 11 16 14Z','#7ddcff')+P('M7 11 16 14 9 25.5Z','#3a9fcc')+P('M16 14 25 11 23 25.5 16 30Z','#2d86b8'),
 bag:P('M9 10C9 5 23 5 23 10','none','#7a4f2b',2.4)+P('M6.5 12Q6 9 10 9H22Q26 9 25.5 12L27 26Q27 29.5 23.5 29.5H8.5Q5 29.5 5 26Z','#b4553a',K)+P('M7 18H25','none','#7a2f1c',1.6)+R(12,17,8,6,2,'#ffd23f',K)+R(11,6,10,4,1.6,'#d86b4a',K),
 chat:P('M5 6H27Q29 6 29 8V20Q29 22 27 22H15L9 28V22H5Q3 22 3 20V8Q3 6 5 6Z','#f1f0ff',K)+C(10,14,1.8,'#4a3f7a')+C(16,14,1.8,'#4a3f7a')+C(22,14,1.8,'#4a3f7a'),
 menu:R(5,7,22,3.6,1.8,'#f1f0ff')+R(5,14.2,22,3.6,1.8,'#f1f0ff')+R(5,21.4,22,3.6,1.8,'#f1f0ff'),
 map:P('M3 8 11 5 21 8 29 5V24L21 27 11 24 3 27Z','#e9d8a6',K)+P('M11 5V24M21 8V27','none','#b59a56',1.3)+P('M20 12 22 15 24.5 12.5','none','#d8453a',1.8)+C(22.5,11,3.2,'#e0453a',K,1)+C(22.5,11,1.2,'#fff'),
 hammer:G('rotate(40 16 16)',R(14.4,12,3.2,18,1.4,'#7a4f2b',K)+R(6.5,3.5,19,9.5,2.5,'#a9b2c8',K)+R(6.5,3.5,19,3.6,2,'#dfe6f5')),
 pickaxe:G('rotate(-40 16 16)',R(14.4,6,3.2,24,1.4,'#7a4f2b',K)+P('M3 11Q16 -1 29 11Q16 5 3 11Z','#bfc8de',K)),
 sack:P('M11 6 8 3 13 4.5 16 2.5 19 4.5 24 3 21 6Q27 11 27 19C27 26 22 30 16 30S5 26 5 19Q5 11 11 6Z','#c9a54a',K)+P('M10 7Q16 10 22 7','none','#6b4a1a',2)+C(16,20,5.2,'#ffd23f','#9a6408',1.2)+P('M13.5 17.5 16 21 18.5 17.5M16 21V24','none','#9a6408',1.6),
 hand:P('M8 17V10a2 2 0 0 1 4 0V15V5a2 2 0 0 1 4 0V15V6a2 2 0 0 1 4 0V16V9a2 2 0 0 1 4 0V21C24 27 20 30 15 30S8 26 8 21L4.5 15Q3.5 13 5.5 12.5 7 13 8 17Z','#ffd9a8',K),
 hourglass:R(6,3,20,3.5,1.5,'#d9a232',K)+R(6,25.5,20,3.5,1.5,'#d9a232',K)+P('M8.5 6.5H23.5C23.5 13 18 14 16 16 18 18 23.5 19 23.5 25.5H8.5C8.5 19 14 18 16 16 14 14 8.5 13 8.5 6.5Z','#e8f3ff',K)+P('M11 24H21C20 20 17 19 16 18 15 19 12 20 11 24Z','#ffd23f'),
 door:P('M6 29V12Q6 3 16 3T26 12V29Z','#7a4f2b',K)+P('M9.5 29V12.5Q9.5 6.5 16 6.5T22.5 12.5V29Z','#2a1a40')+P('M9.5 29V12.5Q9.5 6.5 16 6.5V29Z','#5b3df0')+C(20,19,1.4,'#ffd23f'),
 house:P('M3 15 16 4 29 15Z','#b4553a',K)+R(7,15,18,13,1,'#e3c394',K)+R(13,19,6,9,1.5,'#6b4a2b',K)+R(8.5,17.5,3.4,3.4,.6,'#ffe28a',K)+R(20,17.5,3.4,3.4,.6,'#ffe28a',K),
 cave:P('M2 28Q2 6 16 6T30 28Z','#6d748c',K)+P('M8 28Q8 13 16 13T24 28Z','#1c1230')+P('M5 28H27','none',K,1.4),
 wolf:P('M4 5 11 10C14 9 18 9 21 10L28 5 28 17Q28 26 16 29 4 26 4 17Z','#aab2c6',K)+P('M4 5 11 10 8 14Z','#7d8499')+P('M28 5 21 10 24 14Z','#7d8499')+P('M11 21 16 24 21 21 16 17Z','#e9edf6',K,1)+C(11,16,1.8,'#ffd23f',K,1)+C(21,16,1.8,'#ffd23f',K,1)+C(16,21,1.4,'#222'),
 castle:R(4,13,24,15,1,'#8a91a8',K)+R(4,7,6,8,1,'#a1a8bd',K)+R(13,5,6,10,1,'#a1a8bd',K)+R(22,7,6,8,1,'#a1a8bd',K)+P('M4 7V5H6V7M8 7V5H10V7M13 5V3H15V5M17 5V3H19V5M22 7V5H24V7M26 7V5H28V7','none',K,1.2)+P('M13 28V21Q16 17 19 21V28Z','#2a1a40')+R(7,18,3,4,.6,'#ffe28a')+R(22,18,3,4,.6,'#ffe28a'),
 pvp:G('translate(-1 0) scale(.9)',G('rotate(-45 16 16)',P('M16 2 19 6.5V21H13V6.5Z','#e1e8f6',K)+R(8.5,21,15,3,1.4,'#d9a232',K)+R(14.2,24,3.6,5,1,'#7a4f2b',K)))+G('translate(4 0) scale(.9)',G('rotate(45 16 16)',P('M16 2 19 6.5V21H13V6.5Z','#cfd8ee',K)+R(8.5,21,15,3,1.4,'#e0453a',K)+R(14.2,24,3.6,5,1,'#7a4f2b',K))),
 phone:R(9,3,14,26,3,'#f1f0ff',K)+R(11,7,10,15,1,'#5b3df0')+C(16,25.4,1.4,'#4a3f7a')+P('M3 14A13 13 0 0 1 8 6M29 18A13 13 0 0 1 24 26','none','#ffd23f',2),
 dotred:C(16,16,10,'#ff5b6e','#fff',2),dotyel:C(16,16,10,'#ffd23f','#fff',2),dotpur:C(16,16,10,'#b57bff','#fff',2),
 r_kurt:rune('<path d="M16 9V23M11 13 16 17 21 13M11 18 16 22 21 18" stroke="COL" stroke-width="2.2" fill="none" stroke-linecap="round"/>','#ff7a6e'),
 r_kristal:rune('<path d="M16 8 22 16 16 24 10 16Z" fill="COL" stroke="#fff" stroke-width="1"/>','#7ad7ff'),
 r_orman:rune('<path d="M16 24V12M16 17C11 17 10 13 10 10 14 10 16 13 16 17M16 15C20 15 22 12 22 9 18 9 16 11 16 15" stroke="COL" stroke-width="2" fill="none" stroke-linecap="round"/>','#6ef0a0'),
 r_demir:rune('<path d="M11 9H21M16 9V24M11 24H21M11 16H21" stroke="COL" stroke-width="2.2" fill="none" stroke-linecap="round"/>','#c7cbd8'),
 r_alev:rune('<path d="M16 8C19 12 22 14 21 19 20 23 17 24 16 24 13 24 11 22 11 19 11 16 14 15 14 12 14 10 15 9 16 8Z" fill="COL"/>','#ff9a3c'),
 r_golge:rune('<path d="M20 9A8 8 0 1 0 20 23 6.5 6.5 0 0 1 20 9Z" fill="COL"/>','#b88cff'),
 r_buz:rune('<path d="M16 8V24M9.5 12 22.5 20M9.5 20 22.5 12" stroke="COL" stroke-width="2" fill="none" stroke-linecap="round"/>','#9fe8ff'),
 r_ruzgar:rune('<path d="M9 13H19A3 3 0 1 0 16 10M9 18H23A3 3 0 1 1 20 21M9 23H15" stroke="COL" stroke-width="2" fill="none" stroke-linecap="round"/>','#8ff0d0'),
 r_altin:rune('<circle cx="16" cy="16" r="6.5" fill="COL"/><path d="M16 12.5V19.5M13.7 14.6H17.3A1.4 1.4 0 0 1 17.3 17.4H14.7" stroke="#7a5a00" stroke-width="1.3" fill="none"/>','#ffd23f'),
 r_bilge:rune('<path d="M9 12C12 9 14 10 16 12 18 10 20 9 23 12V22C20 20 18 21 16 23 14 21 12 20 9 22Z" fill="COL"/><path d="M16 12V23" stroke="#1d2340" stroke-width="1.2"/>','#7ad7ff'),
 r_maden:rune('<path d="M10 22 20 12M9 13C13 8 19 8 23 12" stroke="COL" stroke-width="2.2" fill="none" stroke-linecap="round"/>','#f0904a'),
 r_sans:rune('<circle cx="13" cy="13" r="3.4" fill="COL"/><circle cx="19" cy="13" r="3.4" fill="COL"/><circle cx="13" cy="19" r="3.4" fill="COL"/><circle cx="19" cy="19" r="3.4" fill="COL"/><path d="M16 21.5V26" stroke="COL" stroke-width="1.6"/>','#6ef0a0'),
 r_avci:rune('<ellipse cx="16" cy="20" rx="5" ry="4.2" fill="COL"/><circle cx="10.5" cy="14.5" r="2.2" fill="COL"/><circle cx="14" cy="11" r="2.2" fill="COL"/><circle cx="18" cy="11" r="2.2" fill="COL"/><circle cx="21.5" cy="14.5" r="2.2" fill="COL"/>','#ffb07a'),
 r_yildirim:rune('<path d="M18 6 L11 17 H16 L14 26 L21 14 H16 Z" fill="COL"/>','#ffe14a'),
 r_ejder:rune('<path d="M11 9 Q15 16 11.5 24 M16 8 Q20 15 16.5 24 M21 9 Q25 16 21.5 24" stroke="COL" stroke-width="2.2" fill="none" stroke-linecap="round"/>','#ff6a3a'),
 r_vampir:rune('<path d="M10 11 H22" stroke="COL" stroke-width="2" stroke-linecap="round"/><path d="M12 11 L14 20 L16 11 Z M16 11 L18 20 L20 11 Z" fill="COL"/>','#ff4d6d'),
 r_tas:rune('<path d="M16 8 L23 12 V20 L16 24 L9 20 V12 Z" fill="COL"/><path d="M16 8 V24 M9 12 L23 20" stroke="rgba(0,0,0,.25)" stroke-width="1.2"/>','#b8b2a6'),
 r_yaprak:rune('<path d="M9 23 Q9 10 23 9 Q23 22 9 23 Z" fill="COL"/><path d="M10 22 L20 12" stroke="rgba(0,0,0,.3)" stroke-width="1.3"/>','#8ff07a'),
 r_kalp:rune('<path d="M16 24 C8.5 18.5 7.5 14 9.8 11.3 C12 9 15 9.8 16 12.5 C17 9.8 20 9 22.2 11.3 C24.5 14 23.5 18.5 16 24 Z" fill="COL"/>','#ff6b8a'),
 r_anka:rune('<circle cx="16" cy="16" r="4.6" fill="COL"/><path d="M16 6.5V9.5M16 22.5V25.5M6.5 16H9.5M22.5 16H25.5M9.3 9.3L11.4 11.4M20.6 20.6L22.7 22.7M22.7 9.3L20.6 11.4M11.4 20.6L9.3 22.7" stroke="COL" stroke-width="2" stroke-linecap="round"/>','#ffb02e'),
 r_yildiz:rune('<path d="M16 7 L18.6 13.2 L25 13.6 L20 17.8 L21.6 24.3 L16 20.8 L10.4 24.3 L12 17.8 L7 13.6 L13.4 13.2 Z" fill="COL"/>','#fff08a'),
 r_hazine:rune('<path d="M8.5 21.5 L9.5 12 L13.5 16 L16 9.5 L18.5 16 L22.5 12 L23.5 21.5 Z" fill="COL"/><rect x="8.5" y="22.5" width="15" height="2.4" rx="1" fill="COL"/>','#ffd23f'),
 r_kadim:rune('<rect x="10" y="8.5" width="12" height="15" rx="2" fill="COL"/><path d="M12.5 12.5H19.5M12.5 15.5H19.5M12.5 18.5H17" stroke="rgba(0,0,0,.35)" stroke-width="1.3" stroke-linecap="round"/>','#e8c070'),
 r_kader:rune('<rect x="9" y="9" width="14" height="14" rx="3" fill="none" stroke="COL" stroke-width="2"/><circle cx="12.8" cy="12.8" r="1.6" fill="COL"/><circle cx="16" cy="16" r="1.6" fill="COL"/><circle cx="19.2" cy="19.2" r="1.6" fill="COL"/>','#7bffcf'),
 meteor:P('M23 3C27 7 25 15 19 20L12 27 5 20 12 13C16 7 19 3 23 3Z','#ff8a2b',K)+P('M23 3C25 8 21 14 17 18','none','#ffd23f',2)+C(11,22,3,'#ffb02e')+P('M3 26 9 20M6 29 11 24','none','#ffb02e',2),
 chain:P('M18 2 8 17H15L12 30 25 12H18Z','#9bd0ff',K)+P('M26 6 29 10M5 22 2 26M28 20 30 24','none','#e8fbff',2),
 skull:P('M16 3C9 3 5 8 5 14C5 18 7 20 9 22V27H23V22C25 20 27 18 27 14 27 8 23 3 16 3Z','#e8e4d4',K)+C(11.5,15,3,'#2b2147')+C(20.5,15,3,'#2b2147')+P('M16 18 14.5 22H17.5Z','#2b2147')+P('M12.5 25V27M16 25V27M19.5 25V27','none',K,1.3),
 book:P('M4 6Q10 4 16 7 22 4 28 6V26Q22 24 16 27 10 24 4 26Z','#7a4f9a',K)+P('M16 7V27','none',K,1.4)+P('M7 10Q10 9 13 10.5M7 14Q10 13 13 14.5M19 10.5Q22 9 25 10M19 14.5Q22 13 25 14','none','#e8d9ff',1.3),
 core:C(16,16,12,'#ff8a2b33')+C(16,16,9,'#ffb02e',K)+C(16,16,5.4,'#ffe27a')+C(13.6,13.4,2,'#fff')+P('M16 2V6M16 26V30M2 16H6M26 16H30','none','#ffb02e',2),
 guild:R(3,12,26,17,1,'#b88a54',K)+P('M1 13 16 3 31 13Z','#b4553a',K)+R(12.5,18,7,11,3,'#3a2518',K)+P('M7 16 12 21M12 16 7 21','none','#ffd23f',2)+P('M20 16 25 21M25 16 20 21','none','#ffd23f',2),
 scale:P('M16 4V26M7 26H25','none',K,2.6)+P('M6 9H26','none','#d9a232',2.4)+P('M4 17 8 9 12 17Z','#ffd23f',K,1.2)+P('M20 17 24 9 28 17Z','#ffd23f',K,1.2),
 star:P('M16 3 19.5 12 29 12.6 21.6 18.6 24 28 16 22.8 8 28 10.4 18.6 3 12.6 12.5 12Z','#ffd23f',K)
};
YA.ICON=ICON;
ICON.armor=P('M9 4 4 8 6 15 9 14V28H23V14L26 15 28 8 23 4C22 7 19 8.5 16 8.5S10 7 9 4Z','#7a8bb8',K)+P('M9 14V28H23V14','none','#4a5a88',1.4)+R(14.2,10,3.6,16,1.4,'#c9d4ee')+C(16,18,2.4,'#ffd23f');

/* --- yeni arayüz simgeleri (emoji yerine) --- */
ICON.gift=R(4,13,24,15,2.4,'#e8453c',K)+R(3,9,26,6,2.4,'#ff6a5a',K)+R(14,9,4,19,0,'#ffd23f')+P('M16 9C12 2 6 4 8 8 10 11 16 9 16 9ZM16 9C20 2 26 4 24 8 22 11 16 9 16 9Z','#ffd23f',K);
ICON.lock=P('M10 14V10A6 6 0 0 1 22 10V14','none','#cfd8ee',3)+R(5,14,22,15,3.4,'#f0b429',K)+C(16,21,2.6,'#5a3a08')+R(15,22,2,4.4,1,'#5a3a08');
ICON.unlock=P('M10 14V10A6 6 0 0 1 21.5 7','none','#cfd8ee',3)+R(5,14,22,15,3.4,'#7a8bb8',K)+C(16,21,2.6,'#2b3558')+R(15,22,2,4.4,1,'#2b3558');
ICON.check=C(16,16,13.5,'#33c27a',K)+P('M9.5 16.5 14 21 22.5 11.5','none','#fff',3.4);
ICON.xmark=C(16,16,13.5,'#e5484d',K)+P('M11 11 21 21M21 11 11 21','none','#fff',3.4);
ICON.warn=P('M16 3 30 27H2Z','#ffc233',K)+R(14.6,11,2.8,9,1.4,'#5a3a08')+C(16,23.4,1.8,'#5a3a08');
ICON.compass=C(16,16,13.5,'#2e3a66',K)+C(16,16,10.6,'#e9eefc')+P('M22 10 18 18 10 22 14 14Z','#e5484d')+P('M10 22 14 14 18 18Z','#ffffff')+C(16,16,1.7,'#2e3a66');
ICON.egg=P('M16 2.5C10 2.5 5.5 12.5 5.5 19A10.5 10.5 0 0 0 26.5 19C26.5 12.5 22 2.5 16 2.5Z','#fff1d6',K)+C(12,18,2.2,'#f0a050')+C(19.5,13.5,1.9,'#7ac0a0')+C(20.5,21,2.4,'#e87a8a')+C(14,11.5,1.4,'#7aa0e0');
ICON.trophy=P('M9 4H23V13A7 7 0 0 1 9 13Z','#ffd23f',K)+P('M9 6H4C4 12 7 14 9.4 14','none','#e0a02c',2.4)+P('M23 6H28C28 12 25 14 22.6 14','none','#e0a02c',2.4)+R(14,19,4,5,1,'#e0a02c')+R(9.5,24,13,4.4,1.8,'#c98a1c',K)+P('M12.5 6V12','none','#fff9',2);
ICON.globe=C(16,16,13.5,'#3f8fe0',K)+P('M8 9C12 6 15 9 13 12 11 14 7 13 8 9ZM18 17C22 14 26 18 23 22 20 25 16 21 18 17Z','#52c27a')+P('M3 16H29M16 3C10 9 10 23 16 29 22 23 22 9 16 3','none','#ffffff66',1.2);
ICON.users=C(11,10.5,4.6,'#ffd9a8',K)+P('M2.5 27C2.5 20 6.5 17 11 17S19.5 20 19.5 27Z','#4f8fe0',K)+C(22,11.5,4.2,'#f2c28e',K)+P('M16 27C16 21 19 18 22 18S29.5 21 29.5 27Z','#e8718d',K);
ICON.refresh=P('M26 14A10 10 0 0 0 8 10','none','#7ad7ff',3.2)+P('M4.5 4.5 7 13.5 15.5 11Z','#7ad7ff')+P('M6 18A10 10 0 0 0 24 22','none','#7ad7ff',3.2)+P('M27.5 27.5 25 18.5 16.5 21Z','#7ad7ff');
ICON.box=P('M3 11 16 5 29 11V24L16 30 3 24Z','#c9965a',K)+P('M3 11 16 17 29 11 16 5Z','#e6b878')+P('M16 17V30','none','#8a5f2a',1.4)+P('M10 8 22 14','none','#8a5f2a',1.6);
ICON.fish=P('M3 16C8 7 20 7 25 16 20 25 8 25 3 16Z','#4fb4f0',K)+P('M24.5 16 30 9.5V22.5Z','#2f8fd0',K)+P('M12 8.5 15 4 18 9','#2f8fd0')+C(9.5,14,1.7,'#fff')+C(9.5,14,.8,'#123')+P('M14 12 14 20','none','#2f8fd0',1.2);
ICON.rod=P('M4 29 24 4','none','#8a5a2a',2.8)+P('M24 4Q29 13 26.5 21.5','none','#e8edf8',1.2)+C(26.4,23.2,2.2,'#e5484d')+C(25.6,22.4,.8,'#fff');
ICON.up=P('M16 3 28 17H20V29H12V17H4Z','#33c27a',K)+P('M16 3 28 17H16Z','#ffffff33');
ICON.pin=P('M16 30C16 30 5 18.5 5 12A11 11 0 0 1 27 12C27 18.5 16 30 16 30Z','#e5484d',K)+C(16,12,4.2,'#fff');
ICON.shirt=P('M11 3.5 2.5 8 6 15.5 10 13.5V28.5H22V13.5L26 15.5 29.5 8 21 3.5C20 7 18 8.5 16 8.5S12 7 11 3.5Z','#4f8fe0',K)+P('M13 3.5C14 6 18 6 19 3.5','none','#fff6',1.4);
ICON.cart=P('M2.5 5H7L10.5 21H25L28.5 10H8.2','none','#dfe6f5',2.4)+P('M9 10H28L25 20H11Z','#ffb02e',K)+C(12.5,26,2.7,'#e8edf8',K)+C(23,26,2.7,'#e8edf8',K);
ICON.handshake=P('M1.5 10H9L17 13 12 21 5 18 1.5 10Z','#f2c28e',K)+P('M30.5 10H23L15 13 20 21 27 18 30.5 10Z','#d9a46e',K)+C(16,15.5,4.2,'#ffd9a8',K)+P('M12 24 16 27 20 24','none','#d9a46e',1.6);
ICON.sun=C(16,16,7,'#ffc233',K)+P('M16 2.5V6.5M16 25.5V29.5M2.5 16H6.5M25.5 16H29.5M6.5 6.5 9.3 9.3M22.7 22.7 25.5 25.5M25.5 6.5 22.7 9.3M9.3 22.7 6.5 25.5','none','#ffc233',2.6);
ICON.sunrise=P('M4 24A12 12 0 0 1 28 24Z','#ffb02e',K)+P('M1.5 24H30.5','none','#dfe6f5',2.4)+P('M16 5V9M5.5 10.5 8.3 13.3M26.5 10.5 23.7 13.3','none','#ffc233',2.4)+P('M8 28H24','none','#9fb4e0',2);
ICON.moon=P('M21 3.5A12.5 12.5 0 1 0 28.5 22 10.4 10.4 0 0 1 21 3.5Z','#ffe28a',K)+C(12,19,1.8,'#e0c060')+C(16.5,24,1.3,'#e0c060');
ICON.cloud=P('M9 24C3.5 24 2 17.5 6.5 15.5 6.5 9 14.5 6.5 18 11 22 8.5 28.5 11.5 27 17.5 31 18 31 24 26 24Z','#dfe6f5',K);
ICON.rain=P('M9 18C3.5 18 2 11.5 6.5 9.5 6.5 3 14.5 1 18 5 22 2.5 28.5 5.5 27 11.5 31 12 31 18 26 18Z','#aab6d4',K)+P('M9 22 7 28M16 22 14 29M23 22 21 28','none','#5fb4f0',2.6);
ICON.storm=P('M9 17C3.5 17 2 10.5 6.5 8.5 6.5 2 14.5 0 18 4 22 1.5 28.5 4.5 27 10.5 31 11 31 17 26 17Z','#6f7a9a',K)+P('M17.5 15 12 24H16.5L14.5 31 23 20H18.5L21 15Z','#ffd23f',K);
ICON.flask=P('M12 3H20V12L27 25C28.5 28 26.5 30 23.5 30H8.5C5.5 30 3.5 28 5 25L12 12Z','#e8f3ff',K)+P('M7.6 21.5Q16 18 24.4 21.5L27 25C28.5 28 26.5 30 23.5 30H8.5C5.5 30 3.5 28 5 25Z','#9a58ff')+C(13,25,1.6,'#e9d8ff')+C(19.5,26.5,1.2,'#e9d8ff');
ICON.clover=C(12,11,5,'#33c27a')+C(20,11,5,'#33c27a')+C(12,19,5,'#2fb06c')+C(20,19,5,'#2fb06c')+C(16,15,2,'#a8f0c4')+P('M16 20Q15 26 19 29','none','#2a8a52',2);
ICON.paw=C(16,21,6.6,'#b07a4a',K)+C(6.6,14.2,2.9,'#b07a4a',K)+C(11.8,8.4,3.1,'#b07a4a',K)+C(20.2,8.4,3.1,'#b07a4a',K)+C(25.4,14.2,2.9,'#b07a4a',K);
ICON.camera=R(2.5,9,27,18,3.4,'#3a4468',K)+R(20.5,5.5,7,4.5,1.6,'#ccd5ee')+C(16,18,6.6,'#9fb4e0',K)+C(16,18,3.8,'#2e3a66')+C(14.8,16.8,1.2,'#fff');
ICON.question=C(16,16,13.5,'#7a58e0',K)+P('M11.5 12.5A4.5 4.5 0 1 1 16 17.2V19','none','#fff',3.2)+C(16,23.6,1.9,'#fff');
ICON.chick=C(16,17,10.5,'#ffd23f',K)+P('M16 16.5 21.5 19 16 21.5Z','#ff8a2b')+C(11.6,14.2,1.7,'#2b2147')+C(20.4,14.2,1.7,'#2b2147')+P('M13 6.5Q16 2 19 6.5','none','#ffd23f',2.4)+P('M6.5 20Q4 24 8.5 25','#ffc233');
ICON.tag=P('M2.5 15.5 15.5 2.5H29.5V16.5L16.5 29.5Z','#4fb4f0',K)+C(23,9,2.8,'#fff');
ICON.heart=P('M16 28.5C3.5 20.5 2.5 11 7.5 7 12 3.5 16 7 16 10 16 7 20 3.5 24.5 7 29.5 11 28.5 20.5 16 28.5Z','#ff5b7a',K)+P('M8 9C9.5 7.5 12 8 12.5 10','none','#fff8',1.6);
ICON.store=P('M2.5 12 6 4H26L29.5 12Z','#e5484d',K)+R(4.5,12,23,16,1.2,'#f1e3c4',K)+P('M2.5 12Q6 16 9.5 12 13 16 16 12 19 16 22.5 12 26 16 29.5 12','#ffffff')+R(12.5,18,7,10,1.4,'#7a4f2b',K)+R(6.5,17.5,4,5,.8,'#9fd0f0')+R(21.5,17.5,4,5,.8,'#9fd0f0');
ICON.medal=P('M9.5 2.5 16 14 22.5 2.5Z','#e5484d',K)+C(16,21,8.6,'#e0a02c',K)+C(16,21,6.2,'#ffd23f')+P('M16 16.8 17.4 19.6 20.5 20 18.2 22.1 18.8 25 16 23.6 13.2 25 13.8 22.1 11.5 20 14.6 19.6Z','#fff3b0');
ICON.bed=R(2.5,15.5,27,8,2.2,'#4f8fe0',K)+R(2.5,9,4.5,19,1.4,'#8a5a2a',K)+R(8.5,11.5,9,5,2.5,'#ffffff',K)+R(25.5,19,4,9,1.2,'#8a5a2a',K);
ICON.bell=P('M16 3C11 3 8 7 8 13V19L5 23.5H27L24 19V13C24 7 21 3 16 3Z','#ffc233',K)+C(16,27,3.2,'#e0a02c',K)+P('M12 8Q14 6 16 6','none','#fff8',1.6);
ICON.squid=P('M16 2.5C9 2.5 7 10 9 16.5H23C25 10 23 2.5 16 2.5Z','#e8718d',K)+P('M10 16 8 27M14 16 13 29M18 16 19 29M22 16 24 27','none','#e8718d',2.6)+C(12.8,11.5,2.2,'#fff')+C(19.2,11.5,2.2,'#fff')+C(13,11.8,1,'#2b2147')+C(19,11.8,1,'#2b2147');
ICON.ghost=P('M5.5 29V14C5.5 7 10 3 16 3S26.5 7 26.5 14V29L22.3 25 19 29 16 25 13 29 9.7 25Z','#eef0fb',K)+C(12.4,14,2.2,'#2b2147')+C(19.6,14,2.2,'#2b2147')+P('M13.5 19.5Q16 21.5 18.5 19.5','none','#2b2147',1.6);
ICON.party=P('M3 29 10 9 23 22Z','#ffb02e',K)+P('M10 9 16 25','none','#e0801c',1.4)+C(20,6.5,1.8,'#ff5b7a')+C(26,12,1.8,'#4fb4f0')+C(26.5,5,1.4,'#33c27a')+P('M17 9 20 12M23 3 25 6M27 17 30 18','none','#ffd23f',2);
ICON.crown=P('M2.5 24.5 4.5 9.5 11.5 16 16 5.5 20.5 16 27.5 9.5 29.5 24.5Z','#ffd23f',K)+R(2.5,24.5,27,4.5,1.8,'#e0a02c',K)+C(16,19,2,'#e5484d')+C(8.5,20,1.4,'#4fb4f0')+C(23.5,20,1.4,'#4fb4f0');
ICON.scroll=R(5,4,20,23,3.4,'#f1e3c4',K)+P('M5 24C5 28 9 28 9 24H25','none','#b59a56',1.4)+P('M10 10H21M10 14H21M10 18H17','none','#8a6f3a',1.6);
ICON.fire2=ICON.flame;
ICON.dice=R(4,4,24,24,5,'#f1f0ff',K)+C(11,11,2.4,'#2b2147')+C(21,11,2.4,'#2b2147')+C(16,16,2.4,'#2b2147')+C(11,21,2.4,'#2b2147')+C(21,21,2.4,'#2b2147');
ICON.dotblue=C(16,16,11,'#3f8fe0',K)+P('M10 12A8 8 0 0 1 18 8','none','#ffffff88',2);
ICON.dotgreen=C(16,16,11,'#33c27a',K)+P('M10 12A8 8 0 0 1 18 8','none','#ffffff88',2);
ICON.frog=P('M5 22C5 14 10 11 16 11S27 14 27 22C27 27 22 29 16 29S5 27 5 22Z','#52c27a',K)+C(10,10,4.2,'#6fd88f',K)+C(22,10,4.2,'#6fd88f',K)+C(10,10,1.9,'#14301e')+C(22,10,1.9,'#14301e')+P('M10 21Q16 25 22 21','none','#14301e',1.6);
ICON.leaf=P('M5 27C4 12 14 4 28 4 28 18 20 27 5 27Z','#52c27a',K)+P('M6 26C12 18 18 12 25 7','none','#2a8a52',1.6);
ICON.vase=P('M11 3H21L20 8C26 11 27 18 24 24 22 28 20 29 16 29S10 28 8 24C5 18 6 11 12 8Z','#c9825a',K)+P('M8.6 17H23.4','none','#7a4528',2)+P('M12 3 11.6 5H20.4L20 3Z','#e0a070');
ICON.ruin=P('M3 28V14L9 10V28ZM12 28V8L18 4V28ZM21 28V16L29 12V28Z','#a8a4b8',K)+P('M3 28H29','none','#6f6a85',2);
YA.ico=function(k,sz){var b=ICON[k];if(!b)return'';return'<svg class="yi" viewBox="0 0 32 32"'+(sz?' width="'+sz+'" height="'+sz+'"':'')+' aria-hidden="true">'+gdefs(b)+b+'</svg>'};
/* emoji -> simge anahtarı (yalnız eski metinler için; oyun yeni metinlerde doğrudan anahtar kullanır) */
var EM={'⚔':'sword','🛡':'shield','🔮':'orb','💚':'heal','✚':'cross','🗡':'dagger','🌀':'spin','💨':'charge','📣':'roar','📢':'taunt','💥':'slam','❄':'nova','⚡':'bolt','✨':'blink','🌿':'hot','🔥':'flame','🌑':'shadow','☠':'poison','🌫':'smoke','👊':'fist','🪙':'coin','🪵':'wood','🪨':'stone','🟤':'copper','⛓':'iron','⚪':'silver','🟡':'goldore','🔷':'mithril','🟧':'i_copper','⬛':'i_iron','⬜':'i_silver','🟨':'i_gold','🟦':'i_mithril','🔹':'titan','🌠':'aster','🌳':'hwood','🟩':'i_titan','🟪':'i_aster','🦷':'fang','💎':'crystal','🎒':'bag','💬':'chat','☰':'menu','🗺':'map','🔨':'hammer','⛏':'pickaxe','🧺':'sack','✋':'hand','⏳':'hourglass','🚪':'door','🏘':'house','🕳':'cave','🐺':'wolf','🏰':'castle','📱':'phone','🔴':'dotred','🟣':'dotpur','🌲':'r_orman','☄':'meteor','🔗':'chain','💀':'skull','📖':'book','🔶':'core','🌟':'star','🏛':'guild','⚖':'scale','🎁':'gift','🔒':'lock','🔓':'unlock','✓':'check','✔':'check','✅':'check','✕':'xmark','✖':'xmark','❌':'xmark','⚠':'warn','🧭':'compass','🥚':'egg','🏆':'trophy','🌐':'globe','🌍':'globe','👥':'users','🔄':'refresh','📦':'box','🐟':'fish','🎣':'rod','⬆':'up','📍':'pin','👗':'shirt','🛒':'cart','🤝':'handshake','☀':'sun','🌅':'sunrise','🌙':'moon','⛈':'storm','🌧':'rain','☁':'cloud','⚗':'flask','🍀':'clover','🐾':'paw','📸':'camera','❔':'question','❓':'question','🐣':'chick','🏷':'tag','❤':'heart','♥':'heart','💖':'heart','🏪':'store','🎖':'medal','🛏':'bed','🔔':'bell','🦑':'squid','👻':'ghost','🎉':'party','👑':'crown','📜':'scroll','🎲':'dice','⭐':'star','★':'star','👋':'hand','💰':'sack','🧳':'bag','♨':'flame','📘':'book','🌳':'hwood','🔶':'core','🌋':'slam','🍃':'leaf','🏚':'ruin','🏺':'vase','🐸':'frog','🔵':'dotblue','🟢':'dotgreen','🛕':'castle'};
var EMRE=new RegExp('('+Object.keys(EM).join('|')+')\\uFE0F?','g');
YA.em=function(s){return String(s).replace(EMRE,function(m,a){return YA.ico(EM[a])})};
YA.plain=function(s){return String(s).replace(EMRE,function(m,a){return({'🪨':' Taş','🪵':' Odun','🟤':' Bakır','⛓':' Demir','⚪':' Gümüş','🟡':' Altın','🔷':' Mitril','🦷':' Diş','💎':' Kristal','🪙':' altın'})[a]||''})};
YA.dom=function(root){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),a=[],n;while(n=w.nextNode())if(EMRE.test(n.nodeValue)){a.push(n)}EMRE.lastIndex=0;a.forEach(function(n){EMRE.lastIndex=0;var sp=document.createElement('span');sp.innerHTML=YA.em(n.nodeValue.replace(/&/g,'&amp;').replace(/</g,'&lt;'));n.parentNode.replaceChild(sp,n)})};
var IMG={};
YA.img=function(k){if(IMG[k])return IMG[k];var im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64">'+gdefs(ICON[k]||'')+(ICON[k]||'')+'</svg>');return IMG[k]=im};
YA.draw=function(ctx,k,x,y,s){var im=YA.img(k);if(im.complete&&im.naturalWidth)ctx.drawImage(im,x-s/2,y-s/2,s,s)};

/* ================= TUVAL ÇİZİMLERİ ================= */
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function el(ctx,x,y,rx,ry,f){ctx.fillStyle=f;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,6.2832);ctx.fill()}
/* renkli çizgi: kontur, dolgunun koyu tonundan (düz lacivert yerine) — daha yumuşak, resimli kitap görünümü */
function ol(ctx){var f=ctx.fillStyle;ctx.strokeStyle=(typeof f==='string'&&f.charAt(0)==='#'&&f.length===7)?olMix(f):'#1b1530';ctx.lineWidth=1.6;ctx.stroke()}
var OLC={};function olMix(a){var r=OLC[a];if(r)return r;var x=parseInt(a.slice(1),16),y=0x1b1530,k=.7;function ch(s){return Math.round(((x>>s)&255)*(1-k)+((y>>s)&255)*k)}return OLC[a]='rgb('+ch(16)+','+ch(8)+','+ch(0)+')'}
function shade(hex,d){var n=parseInt(hex.slice(1),16),r=(n>>16)+d,g=(n>>8&255)+d,b=(n&255)+d;r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));return'rgb('+r+','+g+','+b+')'}
YA.shade=shade;
/* HUD altında kalan dünya etiketleri soluklaşır (pusula, mini harita, joystick, savaş düğmeleri) */
var HR=[],HRt=0;function hudRects(){var n=Date.now();if(n-HRt<700)return HR;HRt=n;HR=[];['.top','#mm','#trdg','#joy','#acts','#ibag','#chbox','#dkrow','#yhb'].forEach(function(s){var e=document.querySelector(s);if(e&&e.offsetParent!==null){var r=e.getBoundingClientRect();if(r.width>0)HR.push(r)}});return HR}
function underHud(ctx,x,y){try{var m=ctx.getTransform(),cv=ctx.canvas,d=(cv&&cv.clientWidth)?cv.width/cv.clientWidth:(window.devicePixelRatio||1),sx=(m.a*x+m.c*y+m.e)/d,sy=(m.b*x+m.d*y+m.f)/d,R=hudRects();for(var i=0;i<R.length;i++){var r=R[i];if(sx>r.left-30&&sx<r.right+30&&sy>r.top-10&&sy<r.bottom+10)return true}}catch(e){}return false}
YA.plate=function(ctx,x,y,txt,col){var _ua=underHud(ctx,x,y);if(_ua){ctx.save();ctx.globalAlpha*=.22}ctx.font='700 11px "Chakra Petch",sans-serif';var w=ctx.measureText(txt).width+14;ctx.fillStyle='rgba(14,10,32,.72)';rr(ctx,x-w/2,y-9,w,17,8);ctx.fill();if(col){ctx.strokeStyle=col;ctx.lineWidth=1.2;ctx.stroke()}ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(txt,x,y+3.5);if(_ua)ctx.restore()};

/* ---- insan karakter ---- */
YA.person=function(ctx,x,y,o,t,mv){
  var s=o.s||1,bob=Math.sin(t*(mv?9:2.2)+(o.ph||0))*(mv?1.5:.9),sw=mv?Math.sin(t*9)*3:0;
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  el(ctx,0,1,15,5,'rgba(0,0,0,.32)');
  var skin=o.skin||'#f0c08a',cl=o.cloth||'#5a6fd0',c2=o.cloth2||shade(cl.indexOf('#')===0?cl:'#555555',-40);
  ctx.fillStyle=o.leg||'#2c2438';rr(ctx,-8,-14+sw*.3,6.5,14-sw*.3,2.5);ctx.fill();rr(ctx,1.5,-14-sw*.3,6.5,14+sw*.3,2.5);ctx.fill();
  ctx.fillStyle='#17102a';rr(ctx,-9,-3+sw*.3,8.5,4,2);ctx.fill();rr(ctx,.8,-3-sw*.3,8.5,4,2);ctx.fill();
  if(o.cape){ctx.fillStyle=o.cape;ctx.beginPath();ctx.moveTo(-12,-37+bob);ctx.lineTo(12,-37+bob);ctx.lineTo(15,-8);ctx.lineTo(-15,-8);ctx.closePath();ctx.fill();ol(ctx)}
  ctx.fillStyle=cl;rr(ctx,-11.5,-37+bob,23,25,8);ctx.fill();ol(ctx);
  ctx.fillStyle='rgba(255,255,255,.16)';rr(ctx,-9.5,-35+bob,9,8,4);ctx.fill();
  if(o.apron){ctx.fillStyle=o.apron;rr(ctx,-7.5,-30+bob,15,18,4);ctx.fill();ol(ctx)}
  if(o.belt){ctx.fillStyle=o.belt;ctx.fillRect(-11.5,-21+bob,23,3.4);ctx.fillStyle='#e2b24a';ctx.fillRect(-2,-21.4+bob,4,4.2)}
  if(o.star){ctx.fillStyle='rgba(255,224,120,.9)';for(var i=0;i<4;i++){var qx=-6+i%2*10,qy=-30+Math.floor(i/2)*9+bob;ctx.fillRect(qx,qy,2.2,2.2)}}
  ctx.fillStyle=skin;ctx.beginPath();ctx.arc(-13.2,-24+bob+sw*.5,4.4,0,6.3);ctx.fill();ol(ctx);ctx.beginPath();ctx.arc(13.2,-24+bob-sw*.5,4.4,0,6.3);ctx.fill();ol(ctx);
  var hy=-46+bob;
  if(o.hair&&o.hairBack){ctx.fillStyle=o.hair;ctx.beginPath();ctx.arc(0,hy+1,12.8,0,6.3);ctx.fill();ol(ctx)}
  ctx.fillStyle=skin;ctx.beginPath();ctx.arc(0,hy,11,0,6.3);ctx.fill();ol(ctx);
  ctx.fillStyle='rgba(255,120,120,.28)';ctx.beginPath();ctx.arc(-6.5,hy+3,2.4,0,6.3);ctx.arc(6.5,hy+3,2.4,0,6.3);ctx.fill();
  ctx.fillStyle='#21182f';ctx.beginPath();ctx.ellipse(-4,hy-.5,1.7,2.3,0,0,6.3);ctx.ellipse(4,hy-.5,1.7,2.3,0,0,6.3);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(-4.6,hy-1.6,.9,.9);ctx.fillRect(3.4,hy-1.6,.9,.9);
  if(o.brow){ctx.strokeStyle=o.brow;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-6.5,hy-5);ctx.lineTo(-2,hy-4);ctx.moveTo(6.5,hy-5);ctx.lineTo(2,hy-4);ctx.stroke()}
  ctx.strokeStyle='#7a3b2a';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(0,hy+4,2.6,.15*Math.PI,.85*Math.PI);ctx.stroke();
  if(o.beard){ctx.fillStyle=o.beard;ctx.beginPath();ctx.moveTo(-9.5,hy+2);ctx.quadraticCurveTo(-9,hy+17,0,hy+17);ctx.quadraticCurveTo(9,hy+17,9.5,hy+2);ctx.quadraticCurveTo(0,hy+8,-9.5,hy+2);ctx.fill();ol(ctx)}
  var hr=o.hair;
  if(hr&&!o.hairBack){ctx.fillStyle=hr;ctx.beginPath();ctx.arc(0,hy-1,11.6,3.4,6.0);ctx.lineTo(8,hy-3);ctx.quadraticCurveTo(0,hy-7,-8,hy-3);ctx.closePath();ctx.fill();ol(ctx)}
  if(o.bun){ctx.fillStyle=hr||'#ddd';ctx.beginPath();ctx.arc(0,hy-13,5,0,6.3);ctx.fill();ol(ctx)}
  var h=o.hat;
  if(h==='helmet'){ctx.fillStyle='#8c97b3';ctx.beginPath();ctx.arc(0,hy-2,12.2,Math.PI,0);ctx.lineTo(12.2,hy-1);ctx.lineTo(-12.2,hy-1);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#d9a232';ctx.fillRect(-1.6,hy-14,3.2,12);ctx.fillStyle='#c0c8dc';ctx.fillRect(-12.5,hy-2,25,3)}
  else if(h==='hard'){ctx.fillStyle='#f2c230';ctx.beginPath();ctx.arc(0,hy-2,12.4,Math.PI,0);ctx.lineTo(12.4,hy);ctx.lineTo(-12.4,hy);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#ffe27a';ctx.fillRect(-12.4,hy-1.5,24.8,2.6);ctx.fillStyle='#fff7c0';ctx.beginPath();ctx.arc(0,hy-9,3.2,0,6.3);ctx.fill();ctx.fillStyle='rgba(255,230,120,.25)';ctx.beginPath();ctx.arc(0,hy-9,8,0,6.3);ctx.fill()}
  else if(h==='straw'){ctx.fillStyle='#e0bb62';ctx.beginPath();ctx.ellipse(0,hy-3,17,5,0,0,6.3);ctx.fill();ol(ctx);ctx.beginPath();ctx.arc(0,hy-4,9,Math.PI,0);ctx.fill();ol(ctx);ctx.fillStyle='#c0392b';ctx.fillRect(-9,hy-6,18,2.4)}
  else if(h==='hood'){ctx.fillStyle=o.hoodc||'#3f7a4a';ctx.beginPath();ctx.arc(0,hy-1,13.4,Math.PI*.95,Math.PI*2.05);ctx.lineTo(10,hy+5);ctx.quadraticCurveTo(0,hy-7,-10,hy+5);ctx.closePath();ctx.fill();ol(ctx)}
  else if(h==='wide'){ctx.fillStyle='#6b4a2b';ctx.beginPath();ctx.ellipse(0,hy-4,18,5.4,0,0,6.3);ctx.fill();ol(ctx);ctx.beginPath();ctx.arc(0,hy-5,9.5,Math.PI,0);ctx.fill();ol(ctx);ctx.fillStyle='#c9922e';ctx.fillRect(-9.4,hy-7,18.8,2.4)}
  else if(h==='cap'){ctx.fillStyle=o.capc||'#c9a23a';ctx.beginPath();ctx.arc(0,hy-2,12,Math.PI,0);ctx.closePath();ctx.fill();ol(ctx);ctx.fillRect(-1,hy-3,16,3.4);ctx.strokeRect(-1,hy-3,16,3.4)}
  else if(h==='wizard'){ctx.fillStyle='#4a2f94';ctx.beginPath();ctx.moveTo(-14,hy-3);ctx.lineTo(14,hy-3);ctx.lineTo(4,hy-14);ctx.lineTo(10,hy-28);ctx.lineTo(-6,hy-14);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#ffd23f';ctx.fillRect(-13,hy-5,26,2.4)}
  else if(h==='band'){ctx.fillStyle='#b4553a';ctx.fillRect(-11,hy-8,22,3.4);ctx.strokeRect(-11,hy-8,22,3.4)}
  /* elde tutulan */
  var p=o.prop;ctx.save();ctx.translate(14,-26+bob);
  if(p==='hammer'){ctx.rotate(-.5+Math.sin(t*3)*.12);ctx.fillStyle='#7a4f2b';ctx.fillRect(-1.6,-16,3.2,22);ctx.fillStyle='#aeb7cf';rr(ctx,-8,-22,16,9,2);ctx.fill();ol(ctx)}
  else if(p==='sack'){ctx.fillStyle='#c9a54a';ctx.beginPath();ctx.arc(2,-2,8,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.arc(2,-2,3.4,0,6.3);ctx.fill()}
  else if(p==='orb'){var f=Math.sin(t*2.4)*3;ctx.fillStyle='rgba(181,123,255,.3)';ctx.beginPath();ctx.arc(4,-12+f,12,0,6.3);ctx.fill();ctx.fillStyle='#b57bff';ctx.beginPath();ctx.arc(4,-12+f,6,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle='#fff9';ctx.beginPath();ctx.arc(2,-14+f,2,0,6.3);ctx.fill()}
  else if(p==='spear'){ctx.fillStyle='#7a4f2b';ctx.fillRect(-1.4,-40,2.8,56);ctx.fillStyle='#dfe6f5';ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(4.4,-38);ctx.lineTo(-4.4,-38);ctx.closePath();ctx.fill();ol(ctx)}
  else if(p==='pick'){ctx.rotate(-.35);ctx.fillStyle='#7a4f2b';ctx.fillRect(-1.5,-18,3,30);ctx.fillStyle='#bfc8de';ctx.beginPath();ctx.moveTo(-12,-16);ctx.quadraticCurveTo(0,-26,12,-16);ctx.quadraticCurveTo(0,-20,-12,-16);ctx.fill();ol(ctx)}
  else if(p==='bow'){ctx.strokeStyle='#8a5a32';ctx.lineWidth=3;ctx.beginPath();ctx.arc(-2,-8,15,-1.1,1.1);ctx.stroke();ctx.strokeStyle='#eee';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(5,-21);ctx.lineTo(5,5);ctx.stroke()}
  else if(p==='scroll'){ctx.fillStyle='#f2e4b5';rr(ctx,-6,-8,12,16,3);ctx.fill();ol(ctx);ctx.strokeStyle='#b59a56';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-3,-3);ctx.lineTo(3,-3);ctx.moveTo(-3,1);ctx.lineTo(3,1);ctx.stroke()}
  else if(p==='herbs'){ctx.fillStyle='#8a5a32';rr(ctx,-7,-4,15,10,3);ctx.fill();ol(ctx);ctx.fillStyle='#58d98a';ctx.beginPath();ctx.arc(-3,-7,4,0,6.3);ctx.arc(3,-8,4.4,0,6.3);ctx.fill()}
  else if(p==='rod'){ctx.rotate(-.7);ctx.strokeStyle='#7a4f2b';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(0,10);ctx.lineTo(0,-34);ctx.stroke();ctx.strokeStyle='#cfd8e8';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-34);ctx.quadraticCurveTo(14,-24,10,-6);ctx.stroke()}
  else if(p==='lantern'){ctx.fillStyle='rgba(255,210,120,.28)';ctx.beginPath();ctx.arc(2,-4,13,0,6.3);ctx.fill();ctx.fillStyle='#ffd27a';rr(ctx,-4,-8,8,11,2);ctx.fill();ol(ctx)}
  ctx.restore();ctx.restore()};

/* ---- istasyonlar / yapılar ---- */
YA.flame=function(ctx,x,y,s,t){for(var i=0;i<3;i++){var f=Math.sin(t*9+i*2)*.15+1,w=(10-i*3)*s*f,h=(22-i*5)*s*f;ctx.fillStyle=['#ff7a1a','#ffb02e','#fff0a0'][i];ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w*.9,y-h*.6,x+Math.sin(t*7+i)*2*s,y-h);ctx.quadraticCurveTo(x+w*.9,y-h*.6,x+w,y);ctx.closePath();ctx.fill()}};
YA.station=function(ctx,kind,x,y,t){if(kind==='guild')return YA.guild(ctx,x,y,t);if(kind==='office'){YA.house(ctx,{x:x,y:y,w:118,c:'#2f6f8a',wall:'#efe3c8'},t);ctx.fillStyle='#2f6f8a';rr(ctx,x-40,y-27,80,16,4);ctx.fill();ol(ctx);ctx.fillStyle='#fff3d6';ctx.font='800 10px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText('🏠 EMLAK OFİSİ',x,y-15.5);return}if(kind==='cart')return YA.station_cart(ctx,x,y,t);
  if(kind==='smith'){el(ctx,x,y+4,46,12,'rgba(0,0,0,.28)');
    ctx.fillStyle='#5a5f72';rr(ctx,x+14,y-34,36,38,5);ctx.fill();ol(ctx);ctx.fillStyle='#1c1230';rr(ctx,x+20,y-24,24,22,6);ctx.fill();
    ctx.fillStyle='rgba(255,140,40,.35)';ctx.beginPath();ctx.arc(x+32,y-12,20,0,6.3);ctx.fill();YA.flame(ctx,x+32,y-4,1.1,t);
    ctx.fillStyle='#8a91a8';ctx.fillRect(x+30,y-44,8,14);ctx.strokeRect(x+30,y-44,8,14);
    ctx.fillStyle='#2b2a38';ctx.beginPath();ctx.moveTo(x-46,y-12);ctx.lineTo(x-20,y-12);ctx.lineTo(x-24,y-6);ctx.lineTo(x-30,y-6);ctx.lineTo(x-28,y);ctx.lineTo(x-40,y);ctx.lineTo(x-42,y-6);ctx.lineTo(x-50,y-8);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(x-46,y-12,26,2.4)}
  else if(kind==='trader'){el(ctx,x,y+4,48,12,'rgba(0,0,0,.28)');
    ctx.fillStyle='#6b4a2b';ctx.fillRect(x-40,y-40,5,44);ctx.fillRect(x+35,y-40,5,44);
    for(var i=0;i<8;i++){ctx.fillStyle=i%2?'#f1ece0':'#d94f4f';ctx.beginPath();ctx.moveTo(x-44+i*11,y-42);ctx.lineTo(x-33+i*11,y-42);ctx.lineTo(x-35+i*11,y-30);ctx.lineTo(x-46+i*11,y-30);ctx.closePath();ctx.fill()}
    ctx.strokeStyle='#1b1530';ctx.lineWidth=1.4;ctx.strokeRect(x-44,y-42,88,12);ctx.fillStyle='#5a3a22';rr(ctx,x-40,y-62,80,17,4);ctx.fill();ol(ctx);ctx.fillStyle='#ffe9a8';ctx.font='700 11px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText('TİCARETHANE',x,y-50);ctx.fillStyle='#6b4a2b';ctx.fillRect(x-22,y-45,2,4);ctx.fillRect(x+20,y-45,2,4);
    ctx.fillStyle='#9a6a3c';rr(ctx,x-34,y-8,68,16,3);ctx.fill();ol(ctx);ctx.fillStyle='#b57a45';ctx.fillRect(x-34,y-8,68,4);
    [['#d94f4f',-24],['#58c7f0',-10],['#ffd23f',4],['#8af5b0',18]].forEach(function(c){ctx.fillStyle=c[0];ctx.beginPath();ctx.arc(x+c[1],y-11,4.6,0,6.3);ctx.fill();ol(ctx)})}
  else if(kind==='rune'){var r=44;ctx.save();ctx.translate(x,y+6);ctx.scale(1,.42);ctx.strokeStyle='rgba(180,130,255,.85)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,6.3);ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.68,0,6.3);ctx.stroke();ctx.fillStyle='rgba(150,100,255,.18)';ctx.beginPath();ctx.arc(0,0,r,0,6.3);ctx.fill();
    for(var k=0;k<8;k++){var a=k/8*6.283+t*.6;ctx.fillStyle='#d9c2ff';ctx.fillRect(Math.cos(a)*r*.84-2,Math.sin(a)*r*.84-4,4,8)}ctx.restore();
    for(var j=0;j<3;j++){var aa=t*.9+j*2.09,cx=x+Math.cos(aa)*46,cy=y-26+Math.sin(aa*1.3)*6-Math.abs(Math.sin(aa))*8;ctx.fillStyle='#8fe0ff';ctx.beginPath();ctx.moveTo(cx,cy-8);ctx.lineTo(cx+5,cy);ctx.lineTo(cx,cy+8);ctx.lineTo(cx-5,cy);ctx.closePath();ctx.fill();ol(ctx)}}
  else if(kind==='furnace'){el(ctx,x,y+6,56,13,'rgba(0,0,0,.3)');
    ctx.fillStyle='#707690';ctx.beginPath();ctx.moveTo(x-44,y+4);ctx.quadraticCurveTo(x-48,y-48,x,y-52);ctx.quadraticCurveTo(x+48,y-48,x+44,y+4);ctx.closePath();ctx.fill();ol(ctx);
    ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.moveTo(x-44,y+4);ctx.quadraticCurveTo(x-48,y-48,x,y-52);ctx.quadraticCurveTo(x-20,y-30,x-26,y+4);ctx.fill();
    ctx.fillStyle='#1c1230';ctx.beginPath();ctx.moveTo(x-20,y+4);ctx.quadraticCurveTo(x-22,y-30,x,y-30);ctx.quadraticCurveTo(x+22,y-30,x+20,y+4);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,140,40,.4)';ctx.beginPath();ctx.arc(x,y-10,26,0,6.3);ctx.fill();YA.flame(ctx,x,y+2,1.5,t);
    ctx.fillStyle='#565b70';ctx.fillRect(x+22,y-66,14,24);ctx.strokeRect(x+22,y-66,14,24);
    for(var q=0;q<4;q++){var ph=(t*.5+q*.25)%1;ctx.fillStyle='rgba(210,214,230,'+(.5*(1-ph))+')';ctx.beginPath();ctx.arc(x+29+Math.sin(ph*6+q)*5,y-68-ph*40,5+ph*8,0,6.3);ctx.fill()}
    ctx.fillStyle='#8a91a8';ctx.fillRect(x-30,y-4,60,8);}
};
/* ---------- binalar: 3/4 bakış, taş temel, ahşap iskeletli sıva duvar, derinlikli yan yüz, pul kiremitli çatı ---------- */
function bTiles(ctx,x0,y0,x1,y1,rows,col,mode){/* kiremit sıraları: yarım daire pul desen */var h=(y1-y0)/rows;for(var r=0;r<rows;r++){var yy=y0+r*h,shd=shade(col,-18-r*4);ctx.fillStyle=shd;for(var xx=x0+((r%2)?6:0);xx<x1;xx+=12){ctx.beginPath();ctx.arc(xx+6,yy+h*.55,6.4,0,Math.PI);ctx.fill()}ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0,yy+h);ctx.lineTo(x1,yy+h);ctx.stroke()}}
function stoneRow(ctx,x0,x1,y,h){var g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#9a96a3');g.addColorStop(1,'#6c6878');ctx.fillStyle=g;ctx.fillRect(x0,y,x1-x0,h);ctx.strokeStyle='rgba(30,24,40,.45)';ctx.lineWidth=1;var k=0;for(var xx=x0;xx<x1-2;k++){var w=10+((k*7+Math.floor(x0))%3)*4;ctx.strokeRect(xx+.5,y+.5,Math.min(w,x1-xx)-1,h/2-1);xx+=w}k=0;for(var x2=x0-6;x2<x1-2;k++){var w2=11+((k*5)%3)*3;var a=Math.max(x0,x2);ctx.strokeRect(a+.5,y+h/2+.5,Math.min(w2,x1-a)-1,h/2-1);x2+=w2}ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(x0,y,x1-x0,1.5)}
function winA(ctx,q,wy,t,ww,wh){ww=ww||14;wh=wh||15;/* panjurlu pencere: çerçeve, iç ışık, haç kayıt, denizlik, saksı */ctx.fillStyle='#5a3a22';ctx.fillRect(q-5,wy-1,4.5,wh+2);ctx.fillRect(q+ww+.5,wy-1,4.5,wh+2);ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=.8;for(var j=0;j<3;j++){ctx.beginPath();ctx.moveTo(q-5,wy+2+j*5);ctx.lineTo(q-.5,wy+2+j*5);ctx.moveTo(q+ww+.5,wy+2+j*5);ctx.lineTo(q+ww+5,wy+2+j*5);ctx.stroke()}
  var g=ctx.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,'#fff1b8');g.addColorStop(1,'#f0a944');ctx.fillStyle=g;ctx.fillRect(q,wy,ww,wh);ctx.strokeStyle='#4a2e1a';ctx.lineWidth=2;ctx.strokeRect(q,wy,ww,wh);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(q+ww/2,wy);ctx.lineTo(q+ww/2,wy+wh);ctx.moveTo(q,wy+wh/2);ctx.lineTo(q+ww,wy+wh/2);ctx.stroke();
  ctx.fillStyle='rgba(255,230,150,'+(.2+.08*Math.sin(t*4.3+q*.7)+.05*Math.sin(t*11+q)).toFixed(3)+')';ctx.beginPath();ctx.arc(q+ww/2,wy+wh/2,18,0,6.3);ctx.fill();
  ctx.fillStyle='#8a5a32';ctx.fillRect(q-2,wy+wh,ww+4,4);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(q-2,wy+wh+4,ww+4,1.5);ctx.fillStyle='#3f8f3a';ctx.beginPath();ctx.arc(q+3,wy+wh-1,2.6,0,6.3);ctx.arc(q+ww/2,wy+wh-2,2.8,0,6.3);ctx.arc(q+ww-3,wy+wh-1,2.6,0,6.3);ctx.fill();ctx.fillStyle=['#ff7a9a','#ffd23f','#fff'][(q|0)%3];ctx.beginPath();ctx.arc(q+3,wy+wh-2.5,1.4,0,6.3);ctx.arc(q+ww-3,wy+wh-2.8,1.4,0,6.3);ctx.fill()}
function doorA(ctx,x,y0,w,h){/* kemerli tahta kapı, menteşe, taş eşik */ctx.fillStyle='#8a8494';ctx.fillRect(x-w/2-3,y0+h,w+6,4);ctx.fillStyle='#4a2e1a';ctx.beginPath();ctx.moveTo(x-w/2-2,y0+h);ctx.lineTo(x-w/2-2,y0+w/2);ctx.arc(x,y0+w/2,w/2+2,Math.PI,0);ctx.lineTo(x+w/2+2,y0+h);ctx.closePath();ctx.fill();
  var g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,'#6b4022');g.addColorStop(1,'#4e2d16');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-w/2,y0+h);ctx.lineTo(x-w/2,y0+w/2);ctx.arc(x,y0+w/2,w/2,Math.PI,0);ctx.lineTo(x+w/2,y0+h);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;for(var i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x-w/2+i*w/4,y0+2);ctx.lineTo(x-w/2+i*w/4,y0+h);ctx.stroke()}
  ctx.fillStyle='#2b2230';ctx.fillRect(x-w/2,y0+h*.35,w*.55,2.4);ctx.fillRect(x-w/2,y0+h*.75,w*.55,2.4);ctx.fillStyle='#d9a232';ctx.beginPath();ctx.arc(x+w/2-4,y0+h*.58,1.6,0,6.3);ctx.fill()}
function lantern(ctx,x,y,t){ctx.strokeStyle='#2b2230';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,y-10);ctx.lineTo(x+6,y-10);ctx.stroke();ctx.fillStyle='#2b2230';ctx.fillRect(x+3,y-9,6,2);var f=.75+.1*Math.sin(t*7+x);ctx.fillStyle='rgba(255,200,90,'+(.28*f).toFixed(3)+')';ctx.beginPath();ctx.arc(x+6,y-1,14,0,6.3);ctx.fill();ctx.fillStyle='#ffd27a';ctx.fillRect(x+3,y-7,6,8);ctx.strokeStyle='#2b2230';ctx.lineWidth=1.2;ctx.strokeRect(x+3,y-7,6,8)}
YA.house=function(ctx,o,t){var x=o.x,y=o.y,w=o.w,wc=o.wall||'#e3c394',rc=o.c,h=46,dp=Math.min(16,w*.16),L=x-w/2,R=x+w/2,top=y-12,bot=y+32,wc7=wc.length===7?wc:'#e3c394',rc7=(rc&&rc.length===7)?rc:'#a04a3a';
  el(ctx,x+dp*.6,bot+2,w*.66+dp,11,'rgba(0,0,0,.32)');
  /* yan yüz (derinlik) */ctx.fillStyle=shade(wc7,-34);ctx.beginPath();ctx.moveTo(R,top);ctx.lineTo(R+dp,top-dp*.55);ctx.lineTo(R+dp,bot-dp*.55);ctx.lineTo(R,bot);ctx.closePath();ctx.fill();ol(ctx);
  ctx.fillStyle='#4a2e1a';ctx.fillRect(R+dp-3,top-dp*.55,3,bot-top);stoneRow(ctx,R,R+dp,bot-9,9);
  /* ön duvar: sıva + yukarıdan ışık */var g=ctx.createLinearGradient(0,top,0,bot);g.addColorStop(0,shade(wc7,10));g.addColorStop(1,shade(wc7,-14));ctx.fillStyle=g;ctx.fillRect(L,top,w,bot-top);ctx.strokeStyle='#2b1d14';ctx.lineWidth=1.6;ctx.strokeRect(L,top,w,bot-top);
  /* sıva dokusu */ctx.fillStyle='rgba(120,80,40,.10)';for(var k=0;k<14;k++){var px=L+4+((k*37+o.x)%Math.max(8,w-8)),py=top+4+((k*23)%30);ctx.beginPath();ctx.ellipse(px,py,3+k%3,1.6,0,0,6.3);ctx.fill()}
  /* ahşap iskelet */ctx.fillStyle='#5a3a22';ctx.fillRect(L,top,4,bot-top);ctx.fillRect(R-4,top,4,bot-top);ctx.fillRect(L,top,w,4);ctx.fillRect(L,y+10,w,3.2);
  ctx.strokeStyle='#5a3a22';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(L+4,y+10);ctx.lineTo(L+16,top+4);ctx.moveTo(R-4,y+10);ctx.lineTo(R-16,top+4);ctx.stroke();
  stoneRow(ctx,L,R,bot-9,9);
  /* saçak gölgesi */var sg=ctx.createLinearGradient(0,top,0,top+9);sg.addColorStop(0,'rgba(20,10,30,.45)');sg.addColorStop(1,'rgba(20,10,30,0)');ctx.fillStyle=sg;ctx.fillRect(L,top,w+dp,9);
  /* çatı: yan eğim (derinlik) */ctx.fillStyle=shade(rc7,-22);ctx.beginPath();ctx.moveTo(x,y-h-4);ctx.lineTo(x+dp,y-h-4-dp*.55);ctx.lineTo(R+10+dp,y-8-dp*.55);ctx.lineTo(R+10,y-8);ctx.closePath();ctx.fill();ol(ctx);
  ctx.save();ctx.beginPath();ctx.moveTo(x,y-h-4);ctx.lineTo(x+dp,y-h-4-dp*.55);ctx.lineTo(R+10+dp,y-8-dp*.55);ctx.lineTo(R+10,y-8);ctx.closePath();ctx.clip();bTiles(ctx,x-4,y-h-4-dp,R+12+dp,y-6,5,rc7);ctx.restore();
  /* ön üçgen alın */ctx.fillStyle=shade(wc7,-6);ctx.beginPath();ctx.moveTo(L+2,y-10);ctx.lineTo(x,y-h+6);ctx.lineTo(R-2,y-10);ctx.closePath();ctx.fill();ctx.fillStyle='#5a3a22';ctx.fillRect(x-1.6,y-h+8,3.2,h-18);
  /* çatı kenar pervazları */ctx.fillStyle=rc7;ctx.beginPath();ctx.moveTo(L-10,y-8);ctx.lineTo(x,y-h-4);ctx.lineTo(x+4,y-h+1);ctx.lineTo(L-3,y-5);ctx.closePath();ctx.fill();ol(ctx);ctx.beginPath();ctx.moveTo(R+10,y-8);ctx.lineTo(x,y-h-4);ctx.lineTo(x-4,y-h+1);ctx.lineTo(R+3,y-5);ctx.closePath();ctx.fill();ol(ctx);
  ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.moveTo(L-10,y-8);ctx.lineTo(x,y-h-4);ctx.lineTo(x+1.5,y-h-1.5);ctx.lineTo(L-7,y-7);ctx.fill();
  /* yuvarlak çatı penceresi */ctx.fillStyle='#ffe3a0';ctx.beginPath();ctx.arc(x,y-h+20,4.6,0,6.3);ctx.fill();ctx.strokeStyle='#4a2e1a';ctx.lineWidth=1.6;ctx.stroke();ctx.beginPath();ctx.moveTo(x-4.6,y-h+20);ctx.lineTo(x+4.6,y-h+20);ctx.moveTo(x,y-h+15.4);ctx.lineTo(x,y-h+24.6);ctx.lineWidth=1;ctx.stroke();
  /* tuğla baca */var cx0=x+w/2-18+dp*.4,cy0=y-h+4-dp*.3;ctx.fillStyle='#8a3f2c';ctx.fillRect(cx0,cy0,10,20);ctx.strokeStyle='rgba(30,10,10,.45)';ctx.lineWidth=.8;for(var b=0;b<5;b++){ctx.beginPath();ctx.moveTo(cx0,cy0+4*b);ctx.lineTo(cx0+10,cy0+4*b);ctx.stroke();ctx.beginPath();ctx.moveTo(cx0+(b%2?3:7),cy0+4*b);ctx.lineTo(cx0+(b%2?3:7),cy0+4*b+4);ctx.stroke()}ctx.fillStyle='#5a2a1e';ctx.fillRect(cx0-1.5,cy0-3,13,4);ctx.strokeStyle='#2b1d14';ctx.lineWidth=1.3;ctx.strokeRect(cx0,cy0,10,20);
  for(var sm=0;sm<3;sm++){var ph=(t*.28+o.x*.01+sm/3)%1;ctx.fillStyle='rgba(215,220,235,'+(.42*(1-ph)*(ph<.08?ph/.08:1)).toFixed(3)+')';ctx.beginPath();ctx.arc(cx0+5+Math.sin(ph*5+sm)*4+ph*14,cy0-4-ph*34,4+ph*9,0,6.3);ctx.fill()}
  doorA(ctx,x,y+5,14,27);lantern(ctx,x+9,y+8,t);
  var wy=y-2,wx=[L+10,R-24];if(w<80)wx=[L+9];wx.forEach(function(q){winA(ctx,q,wy,t)})};
YA.mine=function(ctx,x,y,t){el(ctx,x,y+30,72,15,'rgba(0,0,0,.3)');
  ctx.fillStyle='#6c7288';ctx.beginPath();ctx.moveTo(x-72,y+30);ctx.lineTo(x-52,y-34);ctx.lineTo(x-14,y-62);ctx.lineTo(x+30,y-52);ctx.lineTo(x+66,y-16);ctx.lineTo(x+72,y+30);ctx.closePath();ctx.fill();ol(ctx);
  ctx.fillStyle='rgba(255,255,255,.16)';ctx.beginPath();ctx.moveTo(x-52,y-34);ctx.lineTo(x-14,y-62);ctx.lineTo(x+4,y-40);ctx.lineTo(x-34,y-20);ctx.closePath();ctx.fill();
  ctx.fillStyle='#14101f';ctx.beginPath();ctx.moveTo(x-28,y+30);ctx.lineTo(x-28,y-8);ctx.quadraticCurveTo(x,y-26,x+28,y-8);ctx.lineTo(x+28,y+30);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,170,60,'+(.2+Math.sin(t*4)*.05)+')';ctx.beginPath();ctx.arc(x,y+12,24,0,6.3);ctx.fill();
  ctx.fillStyle='#7a4f2b';ctx.fillRect(x-34,y-12,8,44);ctx.fillRect(x+26,y-12,8,44);ctx.fillRect(x-38,y-18,76,8);ctx.strokeStyle=K;ctx.lineWidth=1.4;ctx.strokeRect(x-34,y-12,8,44);ctx.strokeRect(x+26,y-12,8,44);ctx.strokeRect(x-38,y-18,76,8);
  ctx.fillStyle='#ffe28a';ctx.beginPath();ctx.arc(x,y-24,3.4,0,6.3);ctx.fill();ctx.fillStyle='rgba(255,226,138,.25)';ctx.beginPath();ctx.arc(x,y-24,14,0,6.3);ctx.fill();
  ctx.fillStyle='#8a5a32';rr(ctx,x+36,y+10,28,16,3);ctx.fill();ol(ctx);ctx.fillStyle='#d6cfc8';ctx.beginPath();ctx.arc(x+44,y+8,4,0,6.3);ctx.arc(x+52,y+7,4.4,0,6.3);ctx.arc(x+59,y+9,3.4,0,6.3);ctx.fill();ctx.fillStyle='#222';ctx.beginPath();ctx.arc(x+42,y+27,4,0,6.3);ctx.arc(x+58,y+27,4,0,6.3);ctx.fill();
  YA.plate(ctx,x,y-74,'Maden Ocağı','#8a91a8')};
YA.guild=function(ctx,x,y,t){var L=x-96,R=x+96,top=y-26,bot=y+40,dp=20;el(ctx,x+12,y+42,126,17,'rgba(0,0,0,.32)');
  /* yan yüz */ctx.fillStyle='#8a6440';ctx.beginPath();ctx.moveTo(R,top);ctx.lineTo(R+dp,top-11);ctx.lineTo(R+dp,bot-11);ctx.lineTo(R,bot);ctx.closePath();ctx.fill();ol(ctx);stoneRow(ctx,R,R+dp,bot-14,14);
  /* ön duvar: taş alt kat + ahşap iskeletli üst kat */var g=ctx.createLinearGradient(0,top,0,bot);g.addColorStop(0,'#e8d2a6');g.addColorStop(1,'#c9ab78');ctx.fillStyle=g;ctx.fillRect(L,top,192,bot-top);ctx.strokeStyle='#2b1d14';ctx.lineWidth=1.8;ctx.strokeRect(L,top,192,bot-top);
  stoneRow(ctx,L,R,y+12,28);ctx.fillStyle='#5a3a22';ctx.fillRect(L,y+9,192,4);ctx.fillRect(L,top,192,4);for(var i=0;i<=6;i++)ctx.fillRect(L+i*32-(i===6?4:0),top,4,y+9-top);
  ctx.strokeStyle='#5a3a22';ctx.lineWidth=2.6;ctx.beginPath();for(var j=0;j<6;j++){if(j===2||j===3)continue;var a=L+j*32+4;ctx.moveTo(a,y+9);ctx.lineTo(a+28,top+4)}ctx.stroke();
  var sg=ctx.createLinearGradient(0,top,0,top+12);sg.addColorStop(0,'rgba(20,10,30,.5)');sg.addColorStop(1,'rgba(20,10,30,0)');ctx.fillStyle=sg;ctx.fillRect(L,top,192+dp,12);
  /* çatı: kalça çatı, yan derinlik ve pul kiremit */ctx.fillStyle='#5e2b22';ctx.beginPath();ctx.moveTo(x+30,y-86);ctx.lineTo(x+30+dp,y-97);ctx.lineTo(R+14+dp,y-33);ctx.lineTo(R+14,y-22);ctx.closePath();ctx.fill();ol(ctx);
  ctx.fillStyle='#7a3b30';ctx.beginPath();ctx.moveTo(L-14,y-22);ctx.lineTo(x-30,y-86);ctx.lineTo(x+30,y-86);ctx.lineTo(R+14,y-22);ctx.closePath();ctx.fill();ol(ctx);
  ctx.save();ctx.beginPath();ctx.moveTo(L-14,y-22);ctx.lineTo(x-30,y-86);ctx.lineTo(x+30,y-86);ctx.lineTo(R+14,y-22);ctx.closePath();ctx.clip();bTiles(ctx,L-16,y-88,R+16,y-20,6,'#8a4536');ctx.restore();
  ctx.fillStyle='rgba(255,255,255,.16)';ctx.beginPath();ctx.moveTo(L-14,y-22);ctx.lineTo(x-30,y-86);ctx.lineTo(x-24,y-86);ctx.lineTo(L-4,y-22);ctx.fill();
  ctx.fillStyle='#4a2318';ctx.fillRect(x-32,y-90,64+dp*.5,5);ctx.strokeStyle='#2b1d14';ctx.lineWidth=1.4;ctx.strokeRect(x-32,y-90,64+dp*.5,5);
  /* çatı penceresi */ctx.fillStyle='#7a3b30';ctx.beginPath();ctx.moveTo(x-16,y-44);ctx.lineTo(x,y-62);ctx.lineTo(x+16,y-44);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#e8d2a6';ctx.fillRect(x-11,y-46,22,4);
  /* kapı ve pencereler */doorA(ctx,x,y+2,32,38);[-64,64].forEach(function(dx){winA(ctx,x+dx-11,y-8,t,22,19)});[-30,30].forEach(function(dx){winA(ctx,x+dx-7,y-20,t,14,11)});
  [-1,1].forEach(function(sd){var fx=x+sd*80,w=Math.sin(t*2.4+sd)*3;ctx.fillStyle='#4a2a7a';ctx.fillRect(fx-1.5,y-64,3,40);ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.arc(fx,y-65,2.6,0,6.3);ctx.fill();ctx.fillStyle='#c0392b';ctx.beginPath();ctx.moveTo(fx,y-62);ctx.lineTo(fx+sd*26+w,y-56);ctx.lineTo(fx+sd*20+w,y-48);ctx.lineTo(fx+sd*26+w,y-40);ctx.lineTo(fx,y-44);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.moveTo(fx,y-53);ctx.lineTo(fx+sd*22+w,y-48);ctx.lineTo(fx+sd*26+w,y-40);ctx.lineTo(fx,y-44);ctx.fill()});
  [-1,1].forEach(function(sd){var tx=x+sd*40,fl=Math.sin(t*9+sd*2)*1.6;ctx.fillStyle='#2b2230';ctx.fillRect(tx-3,y+18,6,4);ctx.fillStyle='#3a2518';ctx.fillRect(tx-2,y+6,4,14);var gr=ctx.createRadialGradient(tx,y+2,1,tx,y+2,24);gr.addColorStop(0,'rgba(255,190,80,.55)');gr.addColorStop(1,'rgba(255,150,40,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(tx,y+2,24,0,6.3);ctx.fill();ctx.fillStyle='#ffb02e';ctx.beginPath();ctx.moveTo(tx,y-8+fl);ctx.quadraticCurveTo(tx+6,y+2,tx,y+8);ctx.quadraticCurveTo(tx-6,y+2,tx,y-8+fl);ctx.fill();ctx.fillStyle='#fff2b0';ctx.beginPath();ctx.arc(tx,y+3,2.2,0,6.3);ctx.fill()});
  ctx.fillStyle='#ffd23f';rr(ctx,x-70,y-56,140,5,2);ctx.fill();ctx.fillStyle='#3a2518';rr(ctx,x-68,y-52,136,28,6);ctx.fill();ol(ctx);ctx.strokeStyle='#ffd23f';ctx.lineWidth=1.4;rr(ctx,x-64,y-49,128,22,4);ctx.stroke();ctx.fillStyle='#ffe9a8';ctx.font='700 12px "Chakra Petch",sans-serif';ctx.textAlign='center';ctx.fillText('MACERACI LONCASI',x,y-33);YA.draw(ctx,'pvp',x,y-70,24)};
YA.station_cart=function(ctx,x,y,t){el(ctx,x,y+6,54,12,'rgba(0,0,0,.28)');ctx.fillStyle='#8a5a32';rr(ctx,x-44,y-22,88,26,4);ctx.fill();ol(ctx);ctx.fillStyle='#a8723e';ctx.fillRect(x-44,y-22,88,6);
  ctx.fillStyle='#c9a54a';ctx.beginPath();ctx.arc(x-24,y-26,10,0,6.3);ctx.arc(x-6,y-28,9,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle='#58c7f0';ctx.fillRect(x+10,y-38,14,14);ctx.strokeRect(x+10,y-38,14,14);ctx.fillStyle='#d94f4f';ctx.fillRect(x+26,y-34,12,12);ctx.strokeRect(x+26,y-34,12,12);
  [-28,28].forEach(function(dx){ctx.fillStyle='#5a3a22';ctx.beginPath();ctx.arc(x+dx,y+6,11,0,6.3);ctx.fill();ol(ctx);ctx.strokeStyle='#d9a232';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+dx-9,y+6);ctx.lineTo(x+dx+9,y+6);ctx.moveTo(x+dx,y-3);ctx.lineTo(x+dx,y+15);ctx.stroke()});
  ctx.fillStyle='#6b4a2b';ctx.fillRect(x+44,y-12,22,4);YA.draw(ctx,'scale',x,y-58,22)};
YA.portal=function(ctx,x,y,t,col,lab,key){var pu=1+Math.sin(t*3)*.07;ctx.save();ctx.translate(x,y);
  el(ctx,0,40,40,10,'rgba(0,0,0,.3)');
  ctx.fillStyle='#5c6178';rr(ctx,-36,-54,12,92,4);ctx.fill();ol(ctx);rr(ctx,24,-54,12,92,4);ctx.fill();ol(ctx);rr(ctx,-40,-66,80,16,6);ctx.fill();ol(ctx);
  ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(-34,-52,3,88);
  var g=ctx.createRadialGradient(0,-8,4,0,-8,40);g.addColorStop(0,'#f2e4ff');g.addColorStop(.5,col||'#9b5cff');g.addColorStop(1,'rgba(60,20,140,.1)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,-8,24*pu,46*pu,0,0,6.3);ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2;for(var i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,-8,(8+i*7)*pu,(18+i*10)*pu,t*(i%2?1:-1)*.5,0,4.2);ctx.stroke()}
  ctx.restore();YA.draw(ctx,key,x,y-80,26);YA.plate(ctx,x,y-100,lab,col)};
var TPAL=[['#2f9e57','#2a8f4f','#3fbf6c'],['#23806a','#1d6e5c','#35a487'],['#5aa63e','#4d9435','#7cc24f'],['#c8782a','#b0611f','#e39a3c']];
YA.treeVar=function(x,y){var th=((Math.floor(x)*73856093)^(Math.floor(y)*19349663))>>>0;return th%11<6?0:th%11<8?1:th%11<10?2:3};
YA.node=function(ctx,kind,x,y,NODE,PV){
  if(kind==='tree'||kind==='oldtree'){var OT=kind==='oldtree';if(OT){var gg0=ctx.createRadialGradient(x,y-14,6,x,y-14,40);gg0.addColorStop(0,'rgba(255,214,120,.45)');gg0.addColorStop(1,'rgba(255,214,120,0)');ctx.fillStyle=gg0;ctx.beginPath();ctx.arc(x,y-14,40,0,6.3);ctx.fill();ctx.save();ctx.translate(x,y+14);ctx.scale(1.35,1.35);ctx.translate(-x,-(y+14))}el(ctx,x,y+13,20,7,'rgba(0,0,0,.28)');ctx.fillStyle='#6b4a2b';ctx.fillRect(x-4.5,y-4,9,18);ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(x+1,y-4,3.5,18);
    /* ağaç çeşitliliği (konuma göre sabit renk ailesi) + rüzgârda tepe salınımı */
    var th=((Math.floor(x)*73856093)^(Math.floor(y)*19349663))>>>0,TP=TPAL[OT?0:PV!=null?PV:(th%11<6?0:th%11<8?1:th%11<10?2:3)],sw=(window.YD_LOWFX||PV!=null)?0:Math.sin(performance.now()/1000*1.3+x*.021+y*.013)*1.9;
    [[0,-14,19,1],[-9,-8,13,0],[9,-8,13,0],[-3,-21,12,2]].forEach(function(c){var k=-c[1]/21;ctx.fillStyle=TP[c[3]];ctx.beginPath();ctx.arc(x+c[0]+sw*k,y+c[1],c[2],0,6.3);ctx.fill()});
    ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.arc(x-6+sw,y-24,6,0,6.3);ctx.fill();if(OT)ctx.restore();return}
  var d=NODE[kind];el(ctx,x+2,y+13,20,6,'rgba(0,0,0,.28)');
  ctx.fillStyle=d.col;ctx.beginPath();ctx.moveTo(x-17,y+11);ctx.lineTo(x-11,y-10);ctx.lineTo(x+6,y-15);ctx.lineTo(x+18,y+2);ctx.lineTo(x+13,y+12);ctx.closePath();ctx.fill();ol(ctx);
  ctx.fillStyle='rgba(255,255,255,.2)';ctx.beginPath();ctx.moveTo(x-11,y-10);ctx.lineTo(x+6,y-15);ctx.lineTo(x+2,y-4);ctx.lineTo(x-8,y-2);ctx.closePath();ctx.fill();
  if(kind==='rock')return;
  if(kind==='silver'||kind==='goldore'||kind==='mithril'||kind==='titan'||kind==='aster'||kind==='ruby'||kind==='emerald'||kind==='sapphire'){var gg=ctx.createRadialGradient(x,y-2,4,x,y-2,26);gg.addColorStop(0,d.sp);gg.addColorStop(1,'rgba(255,255,255,0)');ctx.globalAlpha=.3+Math.sin(performance.now()/400+x)*.1;ctx.fillStyle=gg;ctx.beginPath();ctx.arc(x,y-2,26,0,6.3);ctx.fill();ctx.globalAlpha=1}
  [[-6,-2,3],[4,-7,2.6],[8,4,2.8],[-2,6,2.2]].forEach(function(p){ctx.fillStyle=d.sp;ctx.beginPath();ctx.arc(x+p[0],y+p[1],p[2],0,6.3);ctx.fill();ctx.fillStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.arc(x+p[0]-.8,y+p[1]-.8,.9,0,6.3);ctx.fill()})};

/* ---- yaratıklar ---- */
YA.monster=function(ctx,m,t,tx,ty){var u=m.sz/20,x=m.x,y=m.y,dir=tx>=x?1:-1,ty2=m.type,bob=Math.sin(t*5+m.bob);
  ctx.save();ctx.translate(x,y);
  if(ty2==='metin'){var w=m.sz;el(ctx,0,w*.9,w*1.1,w*.34,'rgba(0,0,0,.35)');var g=ctx.createRadialGradient(0,0,2,0,0,w*2.2);g.addColorStop(0,'rgba(190,130,255,.55)');g.addColorStop(1,'rgba(190,130,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,w*2.2,0,6.3);ctx.fill();
    ctx.save();ctx.scale(1,.35);ctx.translate(0,w*2.2);ctx.strokeStyle='rgba(215,180,255,.8)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,w*1.15,0,6.3);ctx.stroke();for(var i=0;i<6;i++){var a=i/6*6.283+t*.9;ctx.fillStyle='#e6d0ff';ctx.fillRect(Math.cos(a)*w*1.15-2,Math.sin(a)*w*1.15-5,4,10)}ctx.restore();
    var fl=Math.sin(t*2)*3;ctx.fillStyle=m.hit>0?'#e8d2ff':'#8a55e0';ctx.beginPath();ctx.moveTo(0,-w*1.6+fl);ctx.lineTo(w*.85,-w*.35+fl);ctx.lineTo(w*.6,w*.9+fl);ctx.lineTo(-w*.6,w*.9+fl);ctx.lineTo(-w*.85,-w*.35+fl);ctx.closePath();ctx.fill();ol(ctx);
    ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.moveTo(0,-w*1.6+fl);ctx.lineTo(-w*.85,-w*.35+fl);ctx.lineTo(-w*.1,-w*.2+fl);ctx.closePath();ctx.fill();ctx.fillStyle='#4a2a96';ctx.beginPath();ctx.moveTo(0,-w*1.6+fl);ctx.lineTo(w*.85,-w*.35+fl);ctx.lineTo(w*.1,-w*.2+fl);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#f2e4ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-6,-w*.5+fl);ctx.lineTo(0,-w*.1+fl);ctx.lineTo(7,-w*.6+fl);ctx.moveTo(0,-w*.1+fl);ctx.lineTo(0,w*.5+fl);ctx.stroke()}
  else if(ty2==='slime'){var sq=1+bob*.07;el(ctx,0,u*13,u*18,u*6,'rgba(0,0,0,.3)');ctx.fillStyle=m.hit>0?'#c8ffd8':'#5fd980';ctx.beginPath();ctx.moveTo(-u*19,u*12);ctx.bezierCurveTo(-u*20,-u*14*sq,u*20,-u*14*sq,u*19,u*12);ctx.quadraticCurveTo(0,u*17,-u*19,u*12);ctx.fill();ol(ctx);
    ctx.fillStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.ellipse(-u*8,-u*5*sq,u*5,u*3,-.5,0,6.3);ctx.fill();ctx.fillStyle='#2c8d4a';ctx.beginPath();ctx.ellipse(0,u*10,u*15,u*3,0,0,6.3);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-u*6,0,u*4.2,0,6.3);ctx.arc(u*6,0,u*4.2,0,6.3);ctx.fill();ctx.fillStyle='#1d3d2a';ctx.beginPath();ctx.arc(-u*5+dir*1.2,u*.6,u*2,0,6.3);ctx.arc(u*7+dir*1.2,u*.6,u*2,0,6.3);ctx.fill();ctx.strokeStyle='#1d3d2a';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,u*6,u*3,.2,2.9);ctx.stroke()}
  else if(ty2==='wolf'||ty2==='alpha'){var al=ty2==='alpha',body=al?'#9c4a42':'#a9b1c4',dk=al?'#5e2622':'#767e94',lg=Math.sin(t*10+m.bob)*2.4*u;ctx.scale(dir,1);el(ctx,0,u*15,u*26,u*6,'rgba(0,0,0,.3)');
    ctx.fillStyle=dk;[[-14,0],[-8,1],[8,0],[14,1]].forEach(function(l,i){ctx.fillRect(u*l[0]-u*2.5,u*5,u*5,u*11+(i%2?lg:-lg))});
    ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-u*24,-u*4);ctx.quadraticCurveTo(-u*34,-u*14+bob,-u*30,-u*22);ctx.quadraticCurveTo(-u*22,-u*10,-u*14,-u*10);ctx.fill();ol(ctx);
    ctx.fillStyle=body;ctx.beginPath();ctx.ellipse(0,0,u*21,u*12,0,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle=dk;ctx.beginPath();ctx.ellipse(0,-u*6,u*20,u*5,0,Math.PI,0);ctx.fill();
    if(al){ctx.fillStyle='#ff6a3a';for(var s=-3;s<=3;s++){ctx.beginPath();ctx.moveTo(u*s*5-3,-u*11);ctx.lineTo(u*s*5,-u*19-Math.abs(s)*-1);ctx.lineTo(u*s*5+3,-u*11);ctx.fill()}}
    ctx.fillStyle=body;ctx.beginPath();ctx.ellipse(u*19,-u*5,u*11,u*9,0,0,6.3);ctx.fill();ol(ctx);ctx.beginPath();ctx.moveTo(u*24,-u*3);ctx.lineTo(u*36,u*0);ctx.lineTo(u*25,u*5);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#17102a';ctx.beginPath();ctx.arc(u*35,u*0,u*1.8,0,6.3);ctx.fill();
    ctx.fillStyle=dk;ctx.beginPath();ctx.moveTo(u*13,-u*12);ctx.lineTo(u*15,-u*21);ctx.lineTo(u*20,-u*13);ctx.closePath();ctx.fill();ol(ctx);ctx.beginPath();ctx.moveTo(u*21,-u*12);ctx.lineTo(u*25,-u*21);ctx.lineTo(u*27,-u*11);ctx.closePath();ctx.fill();ol(ctx);
    ctx.fillStyle=m.hit>0?'#ff3b3b':(al?'#ffd23f':'#fff2a8');ctx.beginPath();ctx.ellipse(u*21,-u*7,u*2.4,u*1.8,.3,0,6.3);ctx.fill();ctx.fillStyle='#17102a';ctx.fillRect(u*21,-u*8.5,u*1.3,u*3);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(u*28,u*2.4);ctx.lineTo(u*29.6,u*6);ctx.lineTo(u*31,u*2.4);ctx.fill();
    if(al){ctx.strokeStyle='#ffd0a0';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(u*17,-u*10);ctx.lineTo(u*21,-u*3)}}
  else if(ty2==='boar'){var lg2=Math.sin(t*9+m.bob)*2*u;ctx.scale(dir,1);el(ctx,0,u*15,u*24,u*6,'rgba(0,0,0,.3)');ctx.fillStyle='#5a3a24';[[-12],[-5],[7],[14]].forEach(function(l,i){ctx.fillRect(u*l[0]-u*2.5,u*6,u*5,u*10+(i%2?lg2:-lg2))});
    ctx.fillStyle='#b8804f';ctx.beginPath();ctx.ellipse(0,0,u*22,u*14,0,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle='#7a5030';ctx.beginPath();ctx.ellipse(0,-u*9,u*20,u*6,0,Math.PI,0);ctx.fill();for(var b=-3;b<=3;b++){ctx.fillStyle='#4a2f1c';ctx.beginPath();ctx.moveTo(u*b*5-2,-u*13);ctx.lineTo(u*b*5,-u*19);ctx.lineTo(u*b*5+2,-u*13);ctx.fill()}
    ctx.fillStyle='#c48a58';ctx.beginPath();ctx.ellipse(u*19,u*1,u*11,u*9.5,0,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle='#e8a6a0';ctx.beginPath();ctx.ellipse(u*28,u*3,u*5,u*4.2,0,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle='#4a2f1c';ctx.beginPath();ctx.arc(u*27,u*2.5,u*1,0,6.3);ctx.arc(u*30,u*3.5,u*1,0,6.3);ctx.fill();
    ctx.fillStyle='#fff3d6';ctx.beginPath();ctx.moveTo(u*24,u*7);ctx.quadraticCurveTo(u*30,u*8,u*31,u*2);ctx.quadraticCurveTo(u*27,u*6,u*23,u*5);ctx.fill();ol(ctx);
    ctx.fillStyle='#7a5030';ctx.beginPath();ctx.moveTo(u*14,-u*8);ctx.lineTo(u*17,-u*15);ctx.lineTo(u*21,-u*8);ctx.fill();ol(ctx);ctx.fillStyle=m.hit>0?'#ff3b3b':'#17102a';ctx.beginPath();ctx.arc(u*21,-u*3,u*1.7,0,6.3);ctx.fill()}
  else if(ty2==='skel'||ty2==='lich'){var li=ty2==='lich';ctx.restore();ctx.save();YA.person(ctx,x,y+16,li?{s:1.35,skin:'#d8e0d0',cloth:'#4a2a7a',cloth2:'#2a1a50',hat:'wizard',prop:'orb',hair:'#fff',brow:'#7aff9a',cape:'#2a1a50',star:1}:{skin:'#e8e4d4',cloth:'#b8b4a0',leg:'#d8d4c0',prop:'spear',brow:'#222'},t,true);if(li){ctx.fillStyle='rgba(122,255,154,.3)';ctx.beginPath();ctx.arc(x,y-30,34+Math.sin(t*3)*3,0,6.3);ctx.fill()}}
  else if(ty2==='golem'||ty2==='guardian'){var gu=ty2==='guardian',c1=gu?'#5fc4ee':'#8794b2',c2=gu?'#3b8fc0':'#5f6b8c',cr=gu?'#fff08a':'#7ad7ff',st=Math.sin(t*3+m.bob)*u*1.6;
    el(ctx,0,u*17,u*24,u*7,'rgba(0,0,0,.32)');ctx.fillStyle=c2;ctx.fillRect(-u*12,u*4,u*9,u*13);ctx.fillRect(u*3,u*4,u*9,u*13);
    var sc=gu?function(a,b,c,d){ctx.beginPath();ctx.moveTo(a,b-c);ctx.lineTo(a+d,b);ctx.lineTo(a,b+c);ctx.lineTo(a-d,b);ctx.closePath()}:null;
    ctx.fillStyle=c1;rr(ctx,-u*16,-u*10+st,u*32,u*20,u*5);ctx.fill();ol(ctx);ctx.fillStyle='rgba(255,255,255,.2)';rr(ctx,-u*14,-u*8+st,u*14,u*6,u*3);ctx.fill();
    ctx.fillStyle=c2;ctx.beginPath();ctx.arc(-u*19,-u*5+st,u*8,0,6.3);ctx.fill();ol(ctx);ctx.beginPath();ctx.arc(u*19,-u*5+st,u*8,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle=c1;ctx.beginPath();ctx.arc(-u*21,u*7+st,u*6,0,6.3);ctx.fill();ol(ctx);ctx.beginPath();ctx.arc(u*21,u*7+st,u*6,0,6.3);ctx.fill();ol(ctx);
    ctx.fillStyle=c1;rr(ctx,-u*7,-u*21+st,u*14,u*12,u*3);ctx.fill();ol(ctx);ctx.fillStyle=m.hit>0?'#ff6b6b':cr;ctx.fillRect(-u*5,-u*17+st,u*3.4,u*2.6);ctx.fillRect(u*1.6,-u*17+st,u*3.4,u*2.6);
    var pl=.55+Math.sin(t*4)*.25;ctx.fillStyle=cr;ctx.globalAlpha=pl;ctx.beginPath();ctx.arc(0,st,u*7,0,6.3);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle=cr;ctx.beginPath();ctx.moveTo(0,-u*5+st);ctx.lineTo(u*3.6,st);ctx.lineTo(0,u*5+st);ctx.lineTo(-u*3.6,st);ctx.closePath();ctx.fill();ol(ctx);
    ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-u*12,-u*8+st);ctx.lineTo(-u*8,-u*2+st);ctx.lineTo(-u*11,u*3+st);ctx.stroke();
    if(gu){for(var k=0;k<3;k++){var ak=t*1.4+k*2.1,sx=Math.cos(ak)*u*30,sy=-u*10+Math.sin(ak)*u*8-Math.abs(Math.sin(ak*.7))*u*8;ctx.fillStyle='#bff0ff';sc(sx,sy,u*7,u*3.6);ctx.fill();ol(ctx)}}}
  ctx.restore()};

/* ---- kahraman silahı ---- */
var METAL=['#c9ced9','#b9bfce','#e0904e','#a9b2c4','#e6ecff','#ffd23f','#7ad7ff','#ff9a3a','#ff5b8a'],RC=['#c9ced9','#7be07b','#5cb0ff','#c07cff','#ffb02e','#ff5b6e'],WR=[0,0,1,1,2,2,3,4,5];
/* el aletleri (alet çubuğu): balta, kazma, olta. Çerçevede +x ucu gösterir, el başlangıçta */
var TOOLC=['#8d8d8d','#c87533','#aab4c2','#e3e8f2','#ffd23f','#7be0ff','#cfd8ea'];
YA.toolArt=function(c,k,tier,t){var mt=TOOLC[tier]||TOOLC[0],ol2='#1b1530';c.lineJoin='round';c.lineCap='round';
 if(k==='rod'){c.strokeStyle='#7a4f2a';c.lineWidth=3;c.beginPath();c.moveTo(-6,0);c.lineTo(40,0);c.stroke();c.strokeStyle='#3d2816';c.lineWidth=1;c.stroke();c.fillStyle='#ccc';c.beginPath();c.arc(4,2.5,2.6,0,6.3);c.fill();c.strokeStyle=ol2;c.lineWidth=1;c.stroke();
  c.strokeStyle='rgba(240,240,255,.8)';c.lineWidth=.8;c.beginPath();c.moveTo(40,0);c.quadraticCurveTo(46,8+Math.sin(t*3)*2,44,16);c.stroke();c.fillStyle='#ff5b6e';c.beginPath();c.arc(44,16,2,0,6.3);c.fill();return}
 c.fillStyle='#8a5a2b';c.strokeStyle=ol2;c.lineWidth=1.3;c.beginPath();c.rect(-7,-1.8,33,3.6);c.fill();c.stroke();c.fillStyle='#6b4423';c.fillRect(-7,-1.8,6,3.6);
 c.fillStyle=mt;c.beginPath();if(k==='ax'){c.moveTo(19,-1.5);c.lineTo(27,-1.5);c.quadraticCurveTo(33,-8,29,-15);c.quadraticCurveTo(22,-13,17,-7);c.closePath()}else{c.moveTo(22,-2);c.quadraticCurveTo(26,-12,18,-19);c.quadraticCurveTo(29,-12,27,-1);c.lineTo(27,1);c.quadraticCurveTo(29,12,18,19);c.quadraticCurveTo(26,12,22,2);c.closePath()}
 c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.35)';if(k==='ax'){c.beginPath();c.moveTo(27,-3);c.quadraticCurveTo(31,-8,28.5,-13);c.lineTo(27.5,-12);c.quadraticCurveTo(29.5,-8,26,-3);c.fill()}else{c.fillRect(22.5,-1,3,2)}};
YA.weapon=function(ctx,cls,x,y,ang0,sw,t,tier,sk,slv,mv,ap,tool){tier=tier||0;if(tool){cls='savasci';tier=0}var mt=METAL[tier]||('hsl('+((tier*41)%360)+',85%,68%)'),rc=RC[WR[tier]==null?5:WR[tier]];sk=sk||'#f0c39a';var idle=Math.sin(t*2.2)*.07+(mv?Math.sin(t*9)*.1:0),side=Math.cos(ang0)>=0?1:-1,bob=mv?Math.abs(Math.sin(t*9))*-1.4:0,ang,hx,hy;var hold=false;/* karakterin kendi yumruğu: silah/alet her zaman bu elde tutulur, ek kol çizilmez (üçüncü kol olmasın) */var bd=ap&&ap.body,hb=Math.sin(t*(mv?9:2.2))*(mv?1.5:.9),fx,fy;if(bd==='svg'){fx=16;fy=-6+hb}else if(bd==='hamster'){fx=13;fy=0+hb}else{var hS=[.93,1,1.07][(ap&&ap.ht)|0],bS=[.9,1,1.13][(ap&&ap.bd)|0]*(ap&&ap.g==='f'?.94:1);fx=13.2*bS*hS;fy=23+(-24+hb+(mv?Math.sin(t*9)*1.5*side:0))*hS}var fhx=x+side*fx,fhy=y+fy;if(cls!=='tank'&&Math.abs(sw)<1e-4){hold=true;ang=-Math.PI/2+side*(.42+idle*.8);hx=fhx;hy=fhy}else if(cls!=='tank'){/* vuruş: yumruktan, yukarıdaki duruştan bakılan yöne savurma */hold=true;var r0=-Math.PI/2+side*.42,dl=ang0-r0;while(dl>Math.PI)dl-=6.2832;while(dl<-Math.PI)dl+=6.2832;var ph=Math.max(0,Math.min(1,(.95-sw)/1.9)),e=1-Math.pow(1-ph,3);ang=r0+dl*e*1.25;hx=fhx+Math.cos(ang)*3*e;hy=fhy+Math.sin(ang)*3*e}else if(Math.abs(sw)<1e-4){/* kalkan: yanda, göğüs hizasında */ang=(side>0?0:Math.PI)+idle*.5;hx=x+side*13;hy=y+5+bob}else{ang=ang0+sw*1.3+idle;hx=x+Math.cos(ang)*15;hy=y+8+Math.sin(ang)*9+bob}
  /* kol: omuzdan ele */
  if(!hold){ctx.save();ctx.lineCap='round';ctx.strokeStyle='#1b1530';ctx.lineWidth=7.2;ctx.beginPath();ctx.moveTo(x+side*9,y-4);ctx.lineTo(hx,hy);ctx.stroke();ctx.strokeStyle=slv||'#4a90d9';ctx.lineWidth=4.8;ctx.beginPath();ctx.moveTo(x+side*9,y-4);ctx.lineTo(hx,hy);ctx.stroke();ctx.restore()}
  /* tutuş: silahın sapı tam karakterin eline gelsin, el sapın üstünden kavrasın */var go=hold?(tool?0:cls==='savasci'?7:(cls==='buyucu'||cls==='sifaci')?11:cls==='okcu'?7:4):0;
  ctx.save();ctx.translate(hx-Math.cos(ang)*go,hy-Math.sin(ang)*go);ctx.rotate(ang);if(tier>=4){ctx.globalAlpha=.22+.08*Math.sin(t*4);ctx.fillStyle=rc;ctx.beginPath();ctx.arc(22,0,16+tier,0,6.3);ctx.fill();ctx.globalAlpha=1}
  if(tool){YA.toolArt(ctx,tool.k,tool.t,t)}
  else if(cls==='savasci'){ctx.translate(6,0);ctx.rotate(Math.PI/2);ctx.fillStyle=mt;ctx.beginPath();ctx.moveTo(0,-30-tier);ctx.lineTo(4.6+tier*.3,-24);ctx.lineTo(4.6,0);ctx.lineTo(-4.6,0);ctx.lineTo(-4.6,-24);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#9aa8c8';ctx.fillRect(-.7,-26,1.4,24);ctx.fillStyle='#d9a232';ctx.fillRect(-10,0,20,4);ctx.strokeRect(-10,0,20,4);ctx.fillStyle='#7a4f2b';ctx.fillRect(-2.2,4,4.4,9);ctx.strokeRect(-2.2,4,4.4,9)}
  else if(cls==='tank'){ctx.translate(12,0);ctx.rotate(Math.PI/2);ctx.fillStyle=mt==='#c9ced9'?'#4a8fe0':mt;ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(14,-12);ctx.lineTo(14,2);ctx.quadraticCurveTo(14,14,0,20);ctx.quadraticCurveTo(-14,14,-14,2);ctx.lineTo(-14,-12);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#7cb6f7';ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(11,-10);ctx.lineTo(11,2);ctx.quadraticCurveTo(11,11,0,16);ctx.closePath();ctx.fill();ctx.fillStyle='#d9a232';ctx.beginPath();ctx.arc(0,0,5,0,6.3);ctx.fill();ol(ctx)}
  else if(cls==='buyucu'){ctx.translate(10,0);ctx.rotate(Math.PI/2);ctx.fillStyle='#7a4f2b';ctx.fillRect(-1.8,-26,3.6,40);ctx.strokeRect(-1.8,-26,3.6,40);var f=Math.sin(t*3)*1.5;ctx.fillStyle='rgba(181,123,255,.35)';ctx.beginPath();ctx.arc(0,-32+f,12,0,6.3);ctx.fill();ctx.fillStyle=tier?rc:'#b57bff';ctx.beginPath();ctx.arc(0,-32+f,6.4+tier*.3,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle='#fff9';ctx.beginPath();ctx.arc(-2,-34+f,2,0,6.3);ctx.fill()}
  else if(cls==='sifaci'){ctx.translate(10,0);ctx.rotate(Math.PI/2);ctx.fillStyle='#e9d8a6';ctx.fillRect(-1.8,-24,3.6,38);ctx.strokeRect(-1.8,-24,3.6,38);ctx.strokeStyle='#d9a232';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,-29,7,0,6.3);ctx.stroke();ctx.fillStyle=tier?rc:'#46d68a';ctx.beginPath();ctx.arc(0,-29,3.6+tier*.3,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle='rgba(70,214,138,.25)';ctx.beginPath();ctx.arc(0,-29,13+Math.sin(t*3)*1.5,0,6.3);ctx.fill()}
  else{for(var i=-1;i<=1;i+=2){ctx.save();ctx.translate(8,i*7);ctx.rotate(Math.PI/2);ctx.fillStyle=tier?mt:'#e8d9ff';ctx.beginPath();ctx.moveTo(0,-18-tier*.6);ctx.lineTo(3.4,-12);ctx.lineTo(3.4,0);ctx.lineTo(-3.4,0);ctx.lineTo(-3.4,-12);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#ffd23f';ctx.fillRect(-6,0,12,3);ctx.fillStyle='#4d3a6b';ctx.fillRect(-1.8,3,3.6,6);ctx.restore()}}
  ctx.restore();if(hold){if(cls!=='okcu'||tool){ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);ctx.fillStyle=sk;ctx.strokeStyle='#1b1530';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(0,0,3.6,3.2,0,0,6.3);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(27,21,48,.55)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-1.2,-2.6);ctx.lineTo(-1.2,2.6);ctx.moveTo(1.2,-2.6);ctx.lineTo(1.2,2.6);ctx.stroke();ctx.restore()}return}ctx.fillStyle=sk;ctx.strokeStyle='#1b1530';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(hx,hy,4.2,0,6.3);ctx.fill();ctx.stroke();if(cls==='suikastci'||cls==='assassin'){ctx.beginPath();ctx.arc(hx-side*1,hy+(Math.sin(ang)>0?-6:6),3.4,0,6.3);ctx.fill();ctx.stroke()}};
try{var d0=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(Element.prototype,'innerHTML',{get:d0.get,set:function(v){d0.set.call(this,typeof v==='string'?YA.em(v):v)},configurable:true})}catch(e){}
window.YA=YA;
})();
