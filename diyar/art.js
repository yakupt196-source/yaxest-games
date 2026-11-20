/* Yaxest Diyarı: özgün çizim kitaplığı. Emoji yok: tüm simgeler, karakterler, yapılar ve yaratıklar kodla çizilir. */
(function(){'use strict';
var YA={};
/* ================= SVG SİMGELER (32x32) ================= */
function P(d,f,s,w){return'<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||1.4)+'" stroke-linejoin="round" stroke-linecap="round"':'')+'/>'}
function C(x,y,r,f,s,w){return'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||1.4)+'"':'')+'/>'}
function R(x,y,w,h,r,f,s){return'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r||0)+'" fill="'+f+'"'+(s?' stroke="'+s+'" stroke-width="1.3"':'')+'/>'}
function G(t,i){return'<g transform="'+t+'">'+i+'</g>'}
var K='#1b1530';
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
 copper:nug('#7a5a48','#e8924e'),iron:nug('#5a5660','#d6cfc8'),silver:nug('#6b7083','#eef3ff'),goldore:nug('#6d6150','#ffd23f'),mithril:nug('#3d4d72','#7ad7ff'),
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
 star:P('M16 3 19.5 12 29 12.6 21.6 18.6 24 28 16 22.8 8 28 10.4 18.6 3 12.6 12.5 12Z','#ffd23f',K)
};
YA.ICON=ICON;
YA.ico=function(k,sz){var b=ICON[k];if(!b)return'';return'<svg class="yi" viewBox="0 0 32 32"'+(sz?' width="'+sz+'" height="'+sz+'"':'')+' aria-hidden="true">'+b+'</svg>'};
/* emoji -> simge anahtarı (yalnız eski metinler için; oyun yeni metinlerde doğrudan anahtar kullanır) */
var EM={'⚔':'sword','🛡':'shield','🔮':'orb','💚':'heal','✚':'cross','🗡':'dagger','🌀':'spin','💨':'charge','📣':'roar','📢':'taunt','💥':'slam','❄':'nova','⚡':'bolt','✨':'blink','🌿':'hot','🔥':'flame','🌑':'shadow','☠':'poison','🌫':'smoke','👊':'fist','🪙':'coin','🪵':'wood','🪨':'stone','🟤':'copper','⛓':'iron','⚪':'silver','🟡':'goldore','🔷':'mithril','🟧':'i_copper','⬛':'i_iron','⬜':'i_silver','🟨':'i_gold','🟦':'i_mithril','🦷':'fang','💎':'crystal','🎒':'bag','💬':'chat','☰':'menu','🗺':'map','🔨':'hammer','⛏':'pickaxe','🧺':'sack','✋':'hand','⏳':'hourglass','🚪':'door','🏘':'house','🕳':'cave','🐺':'wolf','🏰':'castle','📱':'phone','🔴':'dotred','🟣':'dotpur','🌲':'r_orman'};
var EMRE=new RegExp('('+Object.keys(EM).join('|')+')\\uFE0F?','g');
YA.em=function(s){return String(s).replace(EMRE,function(m,a){return YA.ico(EM[a])})};
YA.plain=function(s){return String(s).replace(EMRE,function(m,a){return({'🪨':' Taş','🪵':' Odun','🟤':' Bakır','⛓':' Demir','⚪':' Gümüş','🟡':' Altın','🔷':' Mitril','🦷':' Diş','💎':' Kristal','🪙':' altın'})[a]||''})};
YA.dom=function(root){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),a=[],n;while(n=w.nextNode())if(EMRE.test(n.nodeValue)){a.push(n)}EMRE.lastIndex=0;a.forEach(function(n){EMRE.lastIndex=0;var sp=document.createElement('span');sp.innerHTML=YA.em(n.nodeValue.replace(/&/g,'&amp;').replace(/</g,'&lt;'));n.parentNode.replaceChild(sp,n)})};
var IMG={};
YA.img=function(k){if(IMG[k])return IMG[k];var im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64">'+(ICON[k]||'')+'</svg>');return IMG[k]=im};
YA.draw=function(ctx,k,x,y,s){var im=YA.img(k);if(im.complete&&im.naturalWidth)ctx.drawImage(im,x-s/2,y-s/2,s,s)};

/* ================= TUVAL ÇİZİMLERİ ================= */
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function el(ctx,x,y,rx,ry,f){ctx.fillStyle=f;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,6.2832);ctx.fill()}
function ol(ctx){ctx.strokeStyle='#1b1530';ctx.lineWidth=1.6;ctx.stroke()}
function shade(hex,d){var n=parseInt(hex.slice(1),16),r=(n>>16)+d,g=(n>>8&255)+d,b=(n&255)+d;r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));return'rgb('+r+','+g+','+b+')'}
YA.shade=shade;
YA.plate=function(ctx,x,y,txt,col){ctx.font='700 11px "Chakra Petch",sans-serif';var w=ctx.measureText(txt).width+14;ctx.fillStyle='rgba(14,10,32,.72)';rr(ctx,x-w/2,y-9,w,17,8);ctx.fill();if(col){ctx.strokeStyle=col;ctx.lineWidth=1.2;ctx.stroke()}ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(txt,x,y+3.5)};

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
YA.station=function(ctx,kind,x,y,t){
  if(kind==='smith'){el(ctx,x,y+4,46,12,'rgba(0,0,0,.28)');
    ctx.fillStyle='#5a5f72';rr(ctx,x+14,y-34,36,38,5);ctx.fill();ol(ctx);ctx.fillStyle='#1c1230';rr(ctx,x+20,y-24,24,22,6);ctx.fill();
    ctx.fillStyle='rgba(255,140,40,.35)';ctx.beginPath();ctx.arc(x+32,y-12,20,0,6.3);ctx.fill();YA.flame(ctx,x+32,y-4,1.1,t);
    ctx.fillStyle='#8a91a8';ctx.fillRect(x+30,y-44,8,14);ctx.strokeRect(x+30,y-44,8,14);
    ctx.fillStyle='#2b2a38';ctx.beginPath();ctx.moveTo(x-46,y-12);ctx.lineTo(x-20,y-12);ctx.lineTo(x-24,y-6);ctx.lineTo(x-30,y-6);ctx.lineTo(x-28,y);ctx.lineTo(x-40,y);ctx.lineTo(x-42,y-6);ctx.lineTo(x-50,y-8);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(x-46,y-12,26,2.4)}
  else if(kind==='trader'){el(ctx,x,y+4,48,12,'rgba(0,0,0,.28)');
    ctx.fillStyle='#6b4a2b';ctx.fillRect(x-40,y-40,5,44);ctx.fillRect(x+35,y-40,5,44);
    for(var i=0;i<8;i++){ctx.fillStyle=i%2?'#f1ece0':'#d94f4f';ctx.beginPath();ctx.moveTo(x-44+i*11,y-42);ctx.lineTo(x-33+i*11,y-42);ctx.lineTo(x-35+i*11,y-30);ctx.lineTo(x-46+i*11,y-30);ctx.closePath();ctx.fill()}
    ctx.strokeStyle='#1b1530';ctx.lineWidth=1.4;ctx.strokeRect(x-44,y-42,88,12);
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
YA.house=function(ctx,o,t){var x=o.x,y=o.y,w=o.w,wc=o.wall||'#e3c394',rc=o.c,h=46;
  el(ctx,x+4,y+32,w*.62,10,'rgba(0,0,0,.3)');
  ctx.fillStyle=wc;rr(ctx,x-w/2,y-12,w,44,2);ctx.fill();ol(ctx);
  ctx.fillStyle=shade(wc.length===7?wc:'#e3c394',-26);ctx.fillRect(x-w/2,y+22,w,10);
  ctx.strokeStyle='rgba(0,0,0,.15)';ctx.lineWidth=1;for(var i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x-w/2,y-4+i*8);ctx.lineTo(x+w/2,y-4+i*8);ctx.stroke()}
  ctx.fillStyle=rc;ctx.beginPath();ctx.moveTo(x-w/2-10,y-8);ctx.lineTo(x,y-h-4);ctx.lineTo(x+w/2+10,y-8);ctx.closePath();ctx.fill();ol(ctx);
  ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1.2;for(var r=0;r<4;r++){var yy=y-14-r*9,hw=(w/2+8)*(1-(r+1)/5.5);ctx.beginPath();ctx.moveTo(x-hw-2,yy);ctx.lineTo(x+hw+2,yy);ctx.stroke()}
  ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.moveTo(x-w/2-10,y-8);ctx.lineTo(x,y-h-4);ctx.lineTo(x-4,y-h+2);ctx.lineTo(x-w/2+2,y-8);ctx.fill();
  ctx.fillStyle='#6b4a2b';ctx.fillRect(x+w/2-18,y-h+8,9,18);ol(ctx);ctx.fillRect(x+w/2-18,y-h+8,9,18);
  var ph=(t*.35+o.x*.01)%1;ctx.fillStyle='rgba(215,220,235,'+(.45*(1-ph))+')';ctx.beginPath();ctx.arc(x+w/2-13+Math.sin(ph*5)*4,y-h+4-ph*26,4+ph*7,0,6.3);ctx.fill();
  ctx.fillStyle='#3a2518';rr(ctx,x-7,y+6,14,26,7);ctx.fill();ol(ctx);ctx.fillStyle='#d9a232';ctx.beginPath();ctx.arc(x+3,y+20,1.3,0,6.3);ctx.fill();
  var wy=y-2,wx=[x-w/2+9,x+w/2-23];if(w<80)wx=[x-w/2+6];
  wx.forEach(function(q){ctx.fillStyle='#ffd980';rr(ctx,q,wy,14,14,2);ctx.fill();ol(ctx);ctx.fillStyle='rgba(255,230,150,.28)';ctx.beginPath();ctx.arc(q+7,wy+7,17,0,6.3);ctx.fill();ctx.strokeStyle='#6b4a2b';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(q+7,wy);ctx.lineTo(q+7,wy+14);ctx.moveTo(q,wy+7);ctx.lineTo(q+14,wy+7);ctx.stroke();ctx.fillStyle='#8a5a32';ctx.fillRect(q-1,wy+14,16,4);ctx.fillStyle=['#ff7a9a','#ffd23f','#9be37a'][(q|0)%3];ctx.fillRect(q+1,wy+12,3,3);ctx.fillRect(q+6,wy+11,3,4);ctx.fillRect(q+11,wy+12,3,3)})};
YA.mine=function(ctx,x,y,t){el(ctx,x,y+30,72,15,'rgba(0,0,0,.3)');
  ctx.fillStyle='#6c7288';ctx.beginPath();ctx.moveTo(x-72,y+30);ctx.lineTo(x-52,y-34);ctx.lineTo(x-14,y-62);ctx.lineTo(x+30,y-52);ctx.lineTo(x+66,y-16);ctx.lineTo(x+72,y+30);ctx.closePath();ctx.fill();ol(ctx);
  ctx.fillStyle='rgba(255,255,255,.16)';ctx.beginPath();ctx.moveTo(x-52,y-34);ctx.lineTo(x-14,y-62);ctx.lineTo(x+4,y-40);ctx.lineTo(x-34,y-20);ctx.closePath();ctx.fill();
  ctx.fillStyle='#14101f';ctx.beginPath();ctx.moveTo(x-28,y+30);ctx.lineTo(x-28,y-8);ctx.quadraticCurveTo(x,y-26,x+28,y-8);ctx.lineTo(x+28,y+30);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,170,60,'+(.2+Math.sin(t*4)*.05)+')';ctx.beginPath();ctx.arc(x,y+12,24,0,6.3);ctx.fill();
  ctx.fillStyle='#7a4f2b';ctx.fillRect(x-34,y-12,8,44);ctx.fillRect(x+26,y-12,8,44);ctx.fillRect(x-38,y-18,76,8);ctx.strokeStyle=K;ctx.lineWidth=1.4;ctx.strokeRect(x-34,y-12,8,44);ctx.strokeRect(x+26,y-12,8,44);ctx.strokeRect(x-38,y-18,76,8);
  ctx.fillStyle='#ffe28a';ctx.beginPath();ctx.arc(x,y-24,3.4,0,6.3);ctx.fill();ctx.fillStyle='rgba(255,226,138,.25)';ctx.beginPath();ctx.arc(x,y-24,14,0,6.3);ctx.fill();
  ctx.fillStyle='#8a5a32';rr(ctx,x+36,y+10,28,16,3);ctx.fill();ol(ctx);ctx.fillStyle='#d6cfc8';ctx.beginPath();ctx.arc(x+44,y+8,4,0,6.3);ctx.arc(x+52,y+7,4.4,0,6.3);ctx.arc(x+59,y+9,3.4,0,6.3);ctx.fill();ctx.fillStyle='#222';ctx.beginPath();ctx.arc(x+42,y+27,4,0,6.3);ctx.arc(x+58,y+27,4,0,6.3);ctx.fill();
  YA.plate(ctx,x,y-74,'Maden Ocağı','#8a91a8')};
YA.portal=function(ctx,x,y,t,col,lab,key){var pu=1+Math.sin(t*3)*.07;ctx.save();ctx.translate(x,y);
  el(ctx,0,40,40,10,'rgba(0,0,0,.3)');
  ctx.fillStyle='#5c6178';rr(ctx,-36,-54,12,92,4);ctx.fill();ol(ctx);rr(ctx,24,-54,12,92,4);ctx.fill();ol(ctx);rr(ctx,-40,-66,80,16,6);ctx.fill();ol(ctx);
  ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(-34,-52,3,88);
  var g=ctx.createRadialGradient(0,-8,4,0,-8,40);g.addColorStop(0,'#f2e4ff');g.addColorStop(.5,col||'#9b5cff');g.addColorStop(1,'rgba(60,20,140,.1)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,-8,24*pu,46*pu,0,0,6.3);ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2;for(var i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,-8,(8+i*7)*pu,(18+i*10)*pu,t*(i%2?1:-1)*.5,0,4.2);ctx.stroke()}
  ctx.restore();YA.draw(ctx,key,x,y-80,26);YA.plate(ctx,x,y-100,lab,col)};
YA.node=function(ctx,kind,x,y,NODE){
  if(kind==='tree'){el(ctx,x,y+13,20,7,'rgba(0,0,0,.28)');ctx.fillStyle='#6b4a2b';ctx.fillRect(x-4.5,y-4,9,18);ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(x+1,y-4,3.5,18);
    [[0,-14,19,'#2a8f4f'],[-9,-8,13,'#2f9e57'],[9,-8,13,'#2f9e57'],[-3,-21,12,'#3fbf6c']].forEach(function(c){ctx.fillStyle=c[3];ctx.beginPath();ctx.arc(x+c[0],y+c[1],c[2],0,6.3);ctx.fill()});
    ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.arc(x-6,y-24,6,0,6.3);ctx.fill();return}
  var d=NODE[kind];el(ctx,x+2,y+13,20,6,'rgba(0,0,0,.28)');
  ctx.fillStyle=d.col;ctx.beginPath();ctx.moveTo(x-17,y+11);ctx.lineTo(x-11,y-10);ctx.lineTo(x+6,y-15);ctx.lineTo(x+18,y+2);ctx.lineTo(x+13,y+12);ctx.closePath();ctx.fill();ol(ctx);
  ctx.fillStyle='rgba(255,255,255,.2)';ctx.beginPath();ctx.moveTo(x-11,y-10);ctx.lineTo(x+6,y-15);ctx.lineTo(x+2,y-4);ctx.lineTo(x-8,y-2);ctx.closePath();ctx.fill();
  if(kind==='rock')return;
  if(kind==='silver'||kind==='goldore'||kind==='mithril'){var gg=ctx.createRadialGradient(x,y-2,4,x,y-2,26);gg.addColorStop(0,d.sp);gg.addColorStop(1,'rgba(255,255,255,0)');ctx.globalAlpha=.3+Math.sin(performance.now()/400+x)*.1;ctx.fillStyle=gg;ctx.beginPath();ctx.arc(x,y-2,26,0,6.3);ctx.fill();ctx.globalAlpha=1}
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
YA.weapon=function(ctx,cls,x,y,ang,sw,t){ctx.save();ctx.translate(x,y);ctx.rotate(ang+sw);
  if(cls==='savasci'){ctx.translate(26,0);ctx.rotate(Math.PI/2);ctx.fillStyle='#dfe6f5';ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(4.6,-24);ctx.lineTo(4.6,0);ctx.lineTo(-4.6,0);ctx.lineTo(-4.6,-24);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#9aa8c8';ctx.fillRect(-.7,-26,1.4,24);ctx.fillStyle='#d9a232';ctx.fillRect(-10,0,20,4);ctx.strokeRect(-10,0,20,4);ctx.fillStyle='#7a4f2b';ctx.fillRect(-2.2,4,4.4,9);ctx.strokeRect(-2.2,4,4.4,9)}
  else if(cls==='tank'){ctx.translate(24,0);ctx.rotate(Math.PI/2);ctx.fillStyle='#4a8fe0';ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(14,-12);ctx.lineTo(14,2);ctx.quadraticCurveTo(14,14,0,20);ctx.quadraticCurveTo(-14,14,-14,2);ctx.lineTo(-14,-12);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#7cb6f7';ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(11,-10);ctx.lineTo(11,2);ctx.quadraticCurveTo(11,11,0,16);ctx.closePath();ctx.fill();ctx.fillStyle='#d9a232';ctx.beginPath();ctx.arc(0,0,5,0,6.3);ctx.fill();ol(ctx)}
  else if(cls==='buyucu'){ctx.translate(14,0);ctx.rotate(Math.PI/2);ctx.fillStyle='#7a4f2b';ctx.fillRect(-1.8,-26,3.6,40);ctx.strokeRect(-1.8,-26,3.6,40);var f=Math.sin(t*3)*1.5;ctx.fillStyle='rgba(181,123,255,.35)';ctx.beginPath();ctx.arc(0,-32+f,12,0,6.3);ctx.fill();ctx.fillStyle='#b57bff';ctx.beginPath();ctx.arc(0,-32+f,6.4,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle='#fff9';ctx.beginPath();ctx.arc(-2,-34+f,2,0,6.3);ctx.fill()}
  else if(cls==='sifaci'){ctx.translate(14,0);ctx.rotate(Math.PI/2);ctx.fillStyle='#e9d8a6';ctx.fillRect(-1.8,-24,3.6,38);ctx.strokeRect(-1.8,-24,3.6,38);ctx.strokeStyle='#d9a232';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,-29,7,0,6.3);ctx.stroke();ctx.fillStyle='#46d68a';ctx.beginPath();ctx.arc(0,-29,3.6,0,6.3);ctx.fill();ol(ctx);ctx.fillStyle='rgba(70,214,138,.25)';ctx.beginPath();ctx.arc(0,-29,13+Math.sin(t*3)*1.5,0,6.3);ctx.fill()}
  else{for(var i=-1;i<=1;i+=2){ctx.save();ctx.translate(20,i*11);ctx.rotate(Math.PI/2);ctx.fillStyle='#e8d9ff';ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(3.4,-12);ctx.lineTo(3.4,0);ctx.lineTo(-3.4,0);ctx.lineTo(-3.4,-12);ctx.closePath();ctx.fill();ol(ctx);ctx.fillStyle='#ffd23f';ctx.fillRect(-6,0,12,3);ctx.fillStyle='#4d3a6b';ctx.fillRect(-1.8,3,3.6,6);ctx.restore()}}
  ctx.restore()};
try{var d0=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(Element.prototype,'innerHTML',{get:d0.get,set:function(v){d0.set.call(this,typeof v==='string'?YA.em(v):v)},configurable:true})}catch(e){}
window.YA=YA;
})();
