/* Yaxest Diyarı — özgün yetenek simgeleri (YI). Emoji yok: hepsi 48x48 vektör, tek bir stil (gradyan dolgu, ince parlak vurgu).
   Düğme: koyu cam disk + sınıf renginde halka + simge + bekleme dilimi + tuş etiketi. */
(function(){
'use strict';
var U={W:'url(#yiW)',G:'url(#yiG)',R:'url(#yiR)',B:'url(#yiB)',P:'url(#yiP)',N:'url(#yiN)',S:'url(#yiS)',D:'url(#yiD)',O:'url(#yiO)'};
function path(d,f,x){return'<path d="'+d+'" fill="'+(f||U.W)+'"'+(x||'')+'/>'}
var SOL={'url(#yiB)':'#8fd8ff','url(#yiG)':'#ffd35a','url(#yiR)':'#ff6f5a','url(#yiP)':'#b58cff','url(#yiN)':'#46d68a','url(#yiO)':'#ff9a4a'};
function ln(d,c,w,x){c=SOL[c]||c;return'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+(w||3)+'" stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>'}
function ci(x,y,r,f,o){return'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'"'+(o||'')+'/>'}
function rc(x,y,w,h,r,f){return'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+f+'"/>'}
function g(t,i){return'<g transform="'+t+'">'+i+'</g>'}
function star(cx,cy,R,r,n,rot){var p=[],i,a;for(i=0;i<n*2;i++){a=Math.PI*i/n+(rot||0)-Math.PI/2;var q=i%2?r:R;p.push((cx+Math.cos(a)*q).toFixed(1)+' '+(cy+Math.sin(a)*q).toFixed(1))}return'M'+p.join('L')+'Z'}
var HI='#ffffff';
function dagger(f1,f2){return path('M24 3 28 11V30H20V11Z',f1)+path('M24 3V30H20V11Z','#ffffff55')+rc(14,30,20,4,2,f2||U.G)+rc(21.5,34,5,9,2.2,'#6b4a8a')+ci(24,45,2.4,f2||U.G)}
var IC={
 /* ---- temel saldırılar ---- */
 atk_savasci:g('rotate(45 24 24)',path('M24 1 29 8V30H19V8Z',U.W)+path('M24 1V30H19V8Z','#ffffff66')+ln('M24 7V28','#8ea0c8',1.2)+rc(12,30,24,4.4,2.2,U.G)+rc(21.2,34.4,5.6,9,2.4,'#7a4f2b')+ci(24,46,2.8,U.G)),
 atk_tank:g('rotate(40 24 24)',rc(21,18,6,28,2.6,'#8a5a2a')+path('M24 2 34 8 38 18 30 22H18L10 18 14 8Z',U.S)+path('M24 2 34 8 24 12 14 8Z','#ffffff66')+ci(24,13,3.2,U.G)+path('M10 18 5 17 8 23ZM38 18 43 17 40 23Z',U.S)),
 atk_buyucu:g('rotate(35 24 24)',rc(22,14,4.4,32,2.2,'#7a4f2b')+ln('M16 12Q15 4 20 2M32 12Q33 4 28 2','#e0a82a',2.4)+ci(24,10,7.4,U.P)+ci(21.6,7.6,2.6,'#ffffffbb')+ci(26,12,1.6,'#6a35c9')),
 atk_sifaci:g('rotate(35 24 24)',rc(22,16,4.4,30,2.2,'#7a4f2b')+path('M24 2 31 10 24 20 17 10Z',U.N)+path('M24 2 31 10 24 11Z','#ffffff77')+ci(24,10,1.8,'#eafff4')),
 atk_suikastci:g('rotate(-40 24 24)',dagger(U.W,U.G))+g('rotate(40 24 24)',dagger('#c9bdf3',U.P)),
 /* ---- savaşçı ---- */
 spin:ln('M40 21A16 16 0 0 0 10 15','url(#yiR)',4.4)+path('M10 15 8 6 17 10Z',U.R)+ln('M8 27A16 16 0 0 0 38 33','url(#yiO)',4.4)+path('M38 33 40 42 31 38Z',U.O)+g('rotate(45 24 24)',path('M24 12 27 17V30H21V17Z',U.W)+rc(17,29,14,3,1.5,U.G)+rc(22.4,32,3.2,6,1.5,'#7a4f2b')),
 charge:ln('M3 14H17M1 24H14M3 34H17','url(#yiB)',3.2)+path('M17 6 45 24 17 42 23 24Z',U.R)+path('M17 6 45 24 23 24Z','#ffffff55'),
 roar:path('M5 17H14L31 7V41L14 31H5Z',U.G)+path('M5 17H14L31 7V24H5Z','#ffffff44')+rc(7,31,6,9,2,'#b9791e')+ln('M35 16Q41 24 35 32','#fff4c4',3)+ln('M39 10Q49 24 39 38','#ffd978',3),
 taunt:path(star(24,24,22,13,10,0),U.R)+path(star(24,24,22,13,10,0),'#ffffff22')+rc(21.6,10,4.8,16,2.4,'#fff')+ci(24,33.5,3.2,'#fff'),
 guard:path('M24 3 41 9V23C41 33 33 40 24 45 15 40 7 33 7 23V9Z',U.B)+path('M24 7.5 37 12V23C37 31 31 36.5 24 40.5Z','#ffffff3a')+path('M24 3 41 9V23C41 33 33 40 24 45Z','#00000018')+rc(21.4,13,5.2,20,2,U.G)+rc(14,19.4,20,5.2,2,U.G),
 slam:g('rotate(-28 24 24)',rc(21.6,16,5,26,2.4,'#8a5a2a')+rc(10,5,28,13,4,U.S)+rc(10,5,28,5,3,'#ffffff66'))+ln('M3 43H45','#ffb347',3)+ln('M24 43 19 47M24 43 30 47M24 43V47','#ffb347',2.2)+path('M7 38l4-3 1 4ZM40 37l-3-4 4-1Z',U.O),
 bash:path('M5 10 22 14V26C22 34 16 39 5 43Z',U.B)+path('M5 10 22 14V26H5Z','#ffffff44')+path(star(34,22,13,6,9,.2),U.O)+path(star(34,22,8,4,9,.2),U.G)+ln('M26 38 21 44M36 40V46M43 36 47 40','#ffb347',2.4),
 bulwark:path('M14 5 5 10 7 24 14 21V43H34V21L41 24 43 10 34 5C32 9 28 11 24 11S16 9 14 5Z',U.S)+path('M14 5 5 10 7 24 14 21Z','#ffffff44')+ln('M24 11V42','#5b6a95',2)+ci(24,22,4.4,U.G)+ci(24,22,1.8,'#fff8'),
 rage:path('M24 2 28 14 38 8 34 20 46 22 35 28 42 40 29 36 24 46 19 36 6 40 13 28 2 22 14 20 10 8 20 14Z',U.R)+path('M24 11 27 20 35 21 28 26 31 34 24 30 17 34 20 26 13 21 21 20Z',U.G),
 /* ---- koruyucu ---- */
 taunt2:'',
 /* ---- büyücü ---- */
 nova:ci(24,24,20,'none',' stroke="url(#yiB)" stroke-width="2" opacity=".55"')+g('translate(24 24)',[0,60,120].map(function(a){return'<g transform="rotate('+a+')">'+ln('M0 -18V18','url(#yiB)',3.2)+ln('M-5 -12 0 -17 5 -12M-5 12 0 17 5 12','url(#yiB)',2.6)+'</g>'}).join(''))+ci(24,24,3.6,'#fff'),
 bolt:path('M29 2 9 27H22L18 46 39 19H26Z',U.G)+path('M29 2 15 21H24Z','#ffffff88'),
 blink:path(star(21,26,17,3.4,4,0),U.P)+path(star(21,26,17,3.4,4,0),'#ffffff2a')+path(star(38,10,8,2,4,0),'#e9d8ff')+ln('M3 44 10 38M1 36 6 32','url(#yiP)',2.6),
 chain:ln('M8 38 20 28 15 25 27 16 23 13 37 7','url(#yiG)',3.6)+ci(8,38,5,U.B)+ci(25,22,4.2,U.B)+ci(38,8,5,U.B)+ci(8,38,1.8,'#fff')+ci(38,8,1.8,'#fff'),
 meteor:path('M29 26 4 44 8 31 3 25 17 21 20 9Z',U.O,' opacity=".9"')+ci(31,18,12.5,U.R)+ci(27,14,4,'#ffffff55')+ci(35,22,3,'#7a1e12',' opacity=".5"')+ci(30,25,2,'#7a1e12',' opacity=".5"'),
 blizzard:path('M12 26C6 26 4 19 9 16 9 9 19 7 23 12 27 8 36 10 36 17 42 17 44 25 38 26Z',U.S)+path('M12 26C6 26 4 19 9 16 9 9 19 7 23 12Z','#ffffff55')+ln('M12 32 8 42M22 32 18 44M32 32 28 42M42 32 38 40','url(#yiB)',2.8)+ci(14,45,1.6,'#e6fbff')+ci(36,45,1.6,'#e6fbff'),
 avalanche:path('M2 44 17 14 25 28 31 20 46 44Z',U.S)+path('M17 14 22 24 17 21 12 25Z','#fff')+path('M31 20 35 27 31 25 27 28Z','#fff')+ci(10,8,3.2,'#cfd8ee')+ci(20,5,2.4,'#cfd8ee')+ci(38,10,3.2,'#cfd8ee')+ln('M10 11 12 17M38 13 36 18','#cfd8ee',2),
 /* ---- şifacı ---- */
 heal:ci(24,24,20,'none',' stroke="url(#yiN)" stroke-width="2" opacity=".5"')+rc(18.5,8,11,32,3.4,U.N)+rc(8,18.5,32,11,3.4,U.N)+rc(20,9.5,3.6,29,1.8,'#ffffff55')+ci(24,24,3,'#f2fff8'),
 hot:ln('M24 44V24','url(#yiN)',3.2)+path('M24 31C13 31 8 23 9 13 20 13 26 20 24 31Z',U.N)+path('M24 24C33 24 39 18 39 8 30 8 24 14 24 24Z',U.N)+path('M24 31C13 31 8 23 9 13Z','#ffffff44')+ci(10,40,2.2,'#bdf5d6')+ci(38,38,2.2,'#bdf5d6')+ci(33,44,1.6,'#bdf5d6'),
 flame:path('M24 2C28 11 37 15 37 28 37 38 31 46 24 46 17 46 11 38 11 28 11 22 15 18 17 12 20 16 22 13 24 2Z',U.R)+path('M24 22C27 27 31 30 31 35 31 40 28 43 24 43 20 43 17 40 17 35 17 30 21 28 24 22Z',U.G)+path('M24 31C26 34 27 36 27 38 27 40 25.6 41 24 41 22.4 41 21 40 21 38 21 36 22.6 34 24 31Z','#fff7d6'),
 bless:g('translate(24 24)',[0,45,90,135].map(function(a){return'<g transform="rotate('+a+')">'+rc(-1.8,-22,3.6,44,1.8,U.G)+'</g>'}).join(''))+ci(24,24,11,U.W)+ci(24,24,7,U.G)+ci(24,24,3,'#fffbe8'),
 revive:path('M24 41C9 31 7 20 13 14 18 10 24 14 24 18 24 14 30 10 35 14 41 20 39 31 24 41Z',U.R)+path('M24 18C24 14 18 10 13 14L24 41Z','#ffffff22')+ln('M6 22Q-1 13 7 6','url(#yiG)',3)+ln('M42 22Q49 13 41 6','url(#yiG)',3)+rc(22,19,4,12,1.6,'#fff')+rc(18,23,12,4,1.6,'#fff'),
 sanct:ci(24,24,20,'none',' stroke="url(#yiG)" stroke-width="2.6"')+ci(24,24,14,'none',' stroke="url(#yiG)" stroke-width="1.6" opacity=".7"')+path(star(24,24,12,4.6,4,Math.PI/4),U.G)+ci(24,24,3,'#fffbe8')+ln('M24 1V6M24 42V47M1 24H6M42 24H47','url(#yiG)',2.4),
 /* ---- suikastçı ---- */
 shadow:path('M30 4A19 19 0 1 0 43 34 15 15 0 1 1 30 4Z',U.P)+path('M30 4A19 19 0 0 0 11 12 14 14 0 0 1 30 4Z','#ffffff44')+ln('M3 40H15M6 32H16','url(#yiP)',2.8)+path(star(36,16,5,2,4,0),'#f2e8ff'),
 smoke:ci(15,30,10,'#8a94b4',' opacity=".85"')+ci(30,28,12,'#a2abc8',' opacity=".9"')+ci(24,17,10,'#c2c9de')+ci(34,38,7,'#8a94b4',' opacity=".8"')+ci(12,40,5,'#a2abc8',' opacity=".8"')+ln('M8 16Q14 9 22 11','#ffffff77',2.4),
 poison:path('M19 3H29V14L39 36C40.5 40 37.5 45 33 45H15C10.5 45 7.5 40 9 36L19 14Z','#ffffff22')+path('M12 32 19 16V14H29V16L36 32Q24 28 12 32Z',U.N,' opacity="0"')+path('M11.5 33Q24 28 36.5 33L39 37C40.5 41 37.5 45 33 45H15C10.5 45 7.5 41 9 37Z',U.N)+ln('M19 3H29M19 14V3M29 14V3','#cfd8ee',3.2)+ln('M19 14 9 36C7.5 40 10.5 45 15 45H33C37.5 45 40.5 40 39 36L29 14','#cfd8ee',2.4)+ci(20,36,2.6,'#d9fbe9')+ci(28,39,1.8,'#d9fbe9')+ci(25,31,1.6,'#d9fbe9'),
 fan:g('rotate(-30 24 44)',dagger(U.W,U.G))+g('rotate(0 24 44)',dagger('#e8ecff',U.G))+g('rotate(30 24 44)',dagger(U.W,U.G)),
 dance:g('rotate(-42 24 24)',dagger(U.W,U.G))+g('rotate(42 24 24)',dagger('#c9bdf3',U.P))+ln('M6 36A19 19 0 0 1 8 12','url(#yiR)',3)+ln('M42 12A19 19 0 0 1 40 36','url(#yiR)',3),
 exec:path('M24 4C14 4 8 11 8 20 8 26 11 30 15 32V38H33V32C37 30 40 26 40 20 40 11 34 4 24 4Z',U.W)+path('M24 4C14 4 8 11 8 20 8 26 11 30 15 32V38H24Z','#00000014')+path('M12 20C12 16 15 14 18 14S24 17 24 22 21 26 17 26 12 24 12 20ZM36 20C36 16 33 14 30 14S24 17 24 22 27 26 31 26 36 24 36 20Z','#1b1634')+path('M24 28 21.4 34H26.6Z','#1b1634')+ln('M19 38V44M24 38V44M29 38V44','#cfd8ee',2.6)+ln('M5 44 43 6','url(#yiR)',3.4),
 tempest:g('translate(24 24)',[0,120,240].map(function(a){return'<g transform="rotate('+a+')"><g transform="translate(0 -13) rotate(35)">'+path('M0 -11 4 -6V8H-4V-6Z',U.W)+rc(-7,7,14,3,1.5,U.G)+'</g></g>'}).join(''))+ln('M24 2A22 22 0 0 1 46 24','url(#yiB)',2.6,' opacity=".8"')+ln('M24 46A22 22 0 0 1 2 24','url(#yiB)',2.6,' opacity=".8"')+ci(24,24,4,'#fff'),
 hand:rc(13,22,22,18,6,U.W)+rc(11,12,5.6,18,2.8,U.W)+rc(18,7,5.6,22,2.8,U.W)+rc(25,6,5.6,22,2.8,U.W)+rc(32,11,5.6,18,2.8,U.W)+path('M13 30 6 25 5 28 13 38Z',U.W)
};
IC.taunt2=undefined;delete IC.taunt2;
var DEF='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+
 [['W','#ffffff','#aebbdc'],['G','#fff0b0','#e0a02c'],['R','#ffc09a','#ff4a52'],['B','#f0fdff','#3fa9ee'],['P','#f6e9ff','#9a58ff'],['N','#e4fff0','#2fbf7a'],['S','#f4f7ff','#7787ae'],['D','#4a4270','#1b1634'],['O','#ffd699','#ff7a2e']].map(function(c){return'<linearGradient id="yi'+c[0]+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c[1]+'"/><stop offset="1" stop-color="'+c[2]+'"/></linearGradient>'}).join('')+
 '<radialGradient id="yiBG" cx=".5" cy=".38" r=".75"><stop offset="0" stop-color="#34295f"/><stop offset="1" stop-color="#0f0b22"/></radialGradient></defs></svg>';
function ensure(){if(document.getElementById('yidefs')||!document.body)return;var d=document.createElement('div');d.id='yidefs';d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';d.innerHTML=DEF;document.body.appendChild(d)}
function ico(k,cls){var b=IC[k];if(!b)return'';ensure();return'<svg class="'+(cls||'yg')+'" viewBox="0 0 48 48" aria-hidden="true">'+b+'</svg>'}
/* düğme: disk + halka + simge */
function btn(k,opt){opt=opt||{};ensure();var b=IC[k];if(!b)return'';
 return'<svg class="yb" viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="34" fill="url(#yiBG)"/><circle cx="36" cy="36" r="33" fill="none" stroke="var(--c,#ffd23f)" stroke-width="3"/>'+
 '<circle cx="36" cy="36" r="29.5" fill="none" stroke="#ffffff" stroke-opacity=".10" stroke-width="1.4"/><path d="M10 28A27 27 0 0 1 62 28" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2" stroke-linecap="round"/>'+
 '<g transform="translate(16.5 16.5) scale(.8125)">'+b+'</g></svg>'}
window.YI={ico:ico,btn:btn,has:function(k){return!!IC[k]},keys:function(){return Object.keys(IC)}};
})();
