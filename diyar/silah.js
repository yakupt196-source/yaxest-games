/* Yaxest Diyarı — silah ve kalkan çizimleri (YW). Emoji yok: sınıfa ve kademeye göre vektör çizim.
   Kademe yükseldikçe: ham demirden → bronz → gümüş → altın → mitril → lav → evren; kılıcın biçimi uzar, kabzası süslenir,
   ışıma, parıltı, alev, şimşek, yıldız halkası ve gökkuşağı rengi eklenir. YW.svg(sınıf, kademe, boyut) */
(function(){
'use strict';
var n=0;
var COL=[['#c9ced9','#6d7482'],['#aab3c2','#5a6270'],['#f0b27a','#8a4f22'],['#dfe7f1','#5d6b7e'],['#f6f9ff','#8ea0bf'],['#ffe680','#b87a10'],['#a6f3ff','#2f86b8'],['#ff9a9a','#a01230'],['#ff7a45','#7a0f10'],['#eadcff','#7a5ad0'],['#a99cff','#1d1238'],['#ffeaa8','#d9742a'],['#84ffd4','#128a6a'],['#86c8ff','#1b4fd8'],['#ffa6ec','#a21f8a'],['#c0f6ff','#3a5cff'],['#ffd6a8','#d03a18'],['#fff3b0','#e09b00'],['#ccffec','#1fb38a'],['#e8d0ff','#6a2bd1'],['#ffffff','#ff4fa8']];
var GLOW=['','','#e0a066','#9fb4d0','#cfe0ff','#ffd23f','#5ce1ff','#ff5b6e','#ff7a2e','#b58cff','#8a6bff','#ffc861','#40e8b0','#5aa8ff','#ff72dc','#8fe8ff','#ff9040','#ffe060','#60ffc8','#c590ff','#ffffff'];
function f1(v){return(+v).toFixed(1)}
function star(cx,cy,R,r,k){var p=[],i,a;for(i=0;i<k*2;i++){a=Math.PI*i/k-Math.PI/2;var q=i%2?r:R;p.push(f1(cx+Math.cos(a)*q)+' '+f1(cy+Math.sin(a)*q))}return'M'+p.join('L')+'Z'}
function mk(cls,t){
 t=Math.max(0,Math.min(20,t|0));var id='yw'+(++n),c=COL[t],g=GLOW[t],s=Math.min(5,Math.floor(t/4)),d='',o='',fx='';
 d+='<linearGradient id="'+id+'b" x1="0" x2="1"><stop offset="0" stop-color="'+c[1]+'"/><stop offset=".42" stop-color="'+c[0]+'"/><stop offset=".58" stop-color="#fff" stop-opacity=".92"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient>'+
  '<linearGradient id="'+id+'h" x1="0" x2="1"><stop offset="0" stop-color="#3b2416"/><stop offset=".5" stop-color="#7a4a26"/><stop offset="1" stop-color="#2c1a0f"/></linearGradient>'+
  '<linearGradient id="'+id+'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+(t>=5?'#ffe680':'#d8dde8')+'"/><stop offset="1" stop-color="'+(t>=5?'#a8700c':'#6d7482')+'"/></linearGradient>'+
  '<radialGradient id="'+id+'a"><stop offset="0" stop-color="'+(g||'#fff')+'" stop-opacity=".55"/><stop offset="1" stop-color="'+(g||'#fff')+'" stop-opacity="0"/></radialGradient>'+
  '<radialGradient id="'+id+'j" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="'+(g||c[0])+'"/><stop offset="1" stop-color="'+c[1]+'"/></radialGradient>';
 var B='url(#'+id+'b)',H='url(#'+id+'h)',G='url(#'+id+'g)',J='url(#'+id+'j)',st=c[1];
 /* arka ışıma */
 if(t>=2)o+='<ellipse cx="32" cy="34" rx="'+f1(15+t*.9)+'" ry="'+f1(26+t*.5)+'" fill="url(#'+id+'a)" opacity="'+f1(Math.min(1,.35+t*.04))+'"><animate attributeName="opacity" values="'+f1(.45+t*.025)+';'+f1(Math.min(1,.8+t*.01))+';'+f1(.45+t*.025)+'" dur="'+f1(3.2-t*.07)+'s" repeatCount="indefinite"/></ellipse>';
 /* gökyüzü halkası (yüksek kademe) */
 if(t>=18)o+='<ellipse cx="32" cy="32" rx="25" ry="9" fill="none" stroke="'+g+'" stroke-width=".9" stroke-dasharray="3 4" opacity=".85" transform="rotate(-20 32 32)"><animateTransform attributeName="transform" type="rotate" from="-20 32 32" to="340 32 32" dur="7s" repeatCount="indefinite"/></ellipse>';
 if(t>=20){var ry='';for(var i=0;i<8;i++){var a=i*Math.PI/4;ry+='M'+f1(32+Math.cos(a)*18)+' '+f1(32+Math.sin(a)*18)+'L'+f1(32+Math.cos(a)*29)+' '+f1(32+Math.sin(a)*29)}o+='<path d="'+ry+'" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".7"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="12s" repeatCount="indefinite"/></path>'}
 var body='';
 if(cls==='tank'){
  var w=15+s*1.4;
  if(s>=3)body+='<path d="M'+f1(32-w-1)+' 14C'+f1(32-w-9)+' 12 '+f1(32-w-11)+' 22 '+f1(32-w-5)+' 30L'+f1(32-w+1)+' 26Z M'+f1(32+w+1)+' 14C'+f1(32+w+9)+' 12 '+f1(32+w+11)+' 22 '+f1(32+w+5)+' 30L'+f1(32+w-1)+' 26Z" fill="'+G+'" stroke="'+st+'" stroke-width=".8"/>';
  body+='<path d="M'+f1(32-w)+' 12H'+f1(32+w)+'V32C'+f1(32+w)+' 45 32 56 32 58C32 56 '+f1(32-w)+' 45 '+f1(32-w)+' 32Z" fill="'+G+'" stroke="'+st+'" stroke-width="1.2"/>'+
   '<path d="M'+f1(32-w+3)+' 15H'+f1(32+w-3)+'V32C'+f1(32+w-3)+' 42 32 51 32 53C32 51 '+f1(32-w+3)+' 42 '+f1(32-w+3)+' 32Z" fill="'+B+'"/>'+
   '<path d="M32 15V53" stroke="'+st+'" stroke-width=".8" opacity=".5"/><path d="M'+f1(32-w+3)+' 30H'+f1(32+w-3)+'" stroke="'+st+'" stroke-width=".8" opacity=".5"/>';
  if(s>=1)body+='<path d="M'+f1(32-w+3)+' 15H'+f1(32+w-3)+'V32" fill="none" stroke="#fff" stroke-width=".8" opacity=".55"/>';
  if(s>=2)for(var q=0;q<5;q++)body+='<circle cx="'+f1(32-w+2+q*(2*w-4)/4)+'" cy="13.6" r="1" fill="#fff" opacity=".8"/>';
  body+='<circle cx="32" cy="31" r="'+f1(5+s*.7)+'" fill="'+G+'" stroke="'+st+'"/><circle cx="32" cy="31" r="'+f1(3+s*.5)+'" fill="'+J+'"/>';
  if(s>=4)body+='<path d="M32 6L35 13H29Z M24 9L27 14H22Z M40 9L42 14H37Z" fill="'+G+'" stroke="'+st+'" stroke-width=".6"/>';
 }else if(cls==='buyucu'||cls==='sifaci'){
  var heal=cls==='sifaci',ob=4.5+s*1.1;
  body+='<path d="M30.2 24L29 60H35L33.8 24Z" fill="'+H+'" stroke="#1c0f08" stroke-width=".6"/><path d="M28.5 40H35.5M28.8 48H35.2" stroke="'+(t>=5?'#ffd23f':'#9aa3b0')+'" stroke-width="1.3"/>';
  if(heal){
   body+='<circle cx="32" cy="16" r="'+f1(9+s*.6)+'" fill="none" stroke="'+G+'" stroke-width="'+f1(2.2+s*.25)+'"/><circle cx="32" cy="16" r="'+f1(9+s*.6)+'" fill="none" stroke="#fff" stroke-width=".7" opacity=".6"/><path d="M32 8V24M24 16H40" stroke="'+G+'" stroke-width="2.2" stroke-linecap="round"/><circle cx="32" cy="16" r="'+f1(ob*.55)+'" fill="'+J+'"/>';
   if(s>=3)body+='<path d="M22 18C12 14 8 22 12 30C14 24 18 22 22 22Z M42 18C52 14 56 22 52 30C50 24 46 22 42 22Z" fill="#fff" opacity=".85" stroke="'+st+'" stroke-width=".6"/>';
  }else{
   body+='<path d="M24 24C21 14 25 8 29 12M40 24C43 14 39 8 35 12M32 25C31 22 33 22 32 25" fill="none" stroke="'+G+'" stroke-width="2.6" stroke-linecap="round"/><circle cx="32" cy="15" r="'+f1(ob)+'" fill="'+J+'"/><circle cx="'+f1(30.2)+'" cy="13" r="'+f1(ob*.25)+'" fill="#fff" opacity=".9"/>';
   if(s>=2)body+='<ellipse cx="32" cy="15" rx="'+f1(ob+5)+'" ry="'+f1(ob*.8)+'" fill="none" stroke="'+(g||'#fff')+'" stroke-width=".9" opacity=".8" transform="rotate(-25 32 15)"><animateTransform attributeName="transform" type="rotate" from="-25 32 15" to="335 32 15" dur="5s" repeatCount="indefinite"/></ellipse>';
   if(s>=4)body+='<path d="M32 3L33.5 8H30.5Z M20 9L24 11L22 14Z M44 9L40 11L42 14Z" fill="'+G+'"/>';
  }
 }else{
  var dg=cls==='suikastci',w2=dg?2.6+s*.5:3.4+s*.95,y0=dg?16-s*1.2:5-s*.7,gw=dg?9+s*1.2:11+s*2.6,len=dg?38:39;
  /* kabza + kabza gövdesi */
  body+='<rect x="29.6" y="'+(dg?40:42)+'" width="4.8" height="'+(dg?13:12)+'" rx="2" fill="'+H+'" stroke="#1c0f08" stroke-width=".6"/><path d="M29.6 '+(dg?44:46)+'H34.4M29.6 '+(dg?48:50)+'H34.4" stroke="#0004" stroke-width=".8"/>';
  body+='<circle cx="32" cy="'+(dg?55:55)+'" r="'+f1(2.8+s*.3)+'" fill="'+(s>=1?J:G)+'" stroke="'+st+'" stroke-width=".6"/>';
  /* kanat / kavisli siper */
  if(s>=3&&!dg)body+='<path d="M'+f1(32-gw/2)+' 40C'+f1(32-gw/2-9)+' 38 '+f1(32-gw/2-12)+' 30 '+f1(32-gw/2-6)+' 24C'+f1(32-gw/2-5)+' 31 '+f1(32-gw/2-2)+' 35 '+f1(32-gw/2+3)+' 37Z M'+f1(32+gw/2)+' 40C'+f1(32+gw/2+9)+' 38 '+f1(32+gw/2+12)+' 30 '+f1(32+gw/2+6)+' 24C'+f1(32+gw/2+5)+' 31 '+f1(32+gw/2+2)+' 35 '+f1(32+gw/2-3)+' 37Z" fill="'+G+'" stroke="'+st+'" stroke-width=".7"/>';
  /* bıçak */
  var yb=dg?40:42,ww=w2;
  if(dg&&s>=3){ /* dalgalı kris */
   body+='<path d="M32 '+f1(y0)+'C'+f1(32+ww+1)+' '+f1(y0+9)+' '+f1(32-ww-1)+' '+f1(y0+15)+' '+f1(32+ww)+' '+f1(y0+22)+'C'+f1(32-ww)+' '+f1(y0+28)+' '+f1(32+ww)+' 34 '+f1(32+ww*.9)+' '+yb+'H'+f1(32-ww*.9)+'C'+f1(32-ww-1)+' 34 '+f1(32-ww-2)+' '+f1(y0+22)+' '+f1(32-ww)+' '+f1(y0+12)+'Z" fill="'+B+'" stroke="'+st+'" stroke-width=".9"/>';
  }else{
   body+='<path d="M32 '+f1(y0)+'L'+f1(32+ww)+' '+f1(y0+(dg?9:10))+'L'+f1(32+ww*.92)+' '+yb+'H'+f1(32-ww*.92)+'L'+f1(32-ww)+' '+f1(y0+(dg?9:10))+'Z" fill="'+B+'" stroke="'+st+'" stroke-width=".9" stroke-linejoin="round"/>'+
    '<path d="M32 '+f1(y0+2)+'V'+(yb-2)+'" stroke="'+st+'" stroke-width=".9" opacity=".55"/>';
   if(s>=2&&!dg)body+='<path d="M'+f1(32-ww)+' '+f1(y0+10)+'L'+f1(32-ww*.92)+' '+yb+'M'+f1(32+ww)+' '+f1(y0+10)+'L'+f1(32+ww*.92)+' '+yb+'" stroke="'+(g||'#fff')+'" stroke-width=".8" opacity=".9"/>';
  }
  body+='<path d="M'+f1(32-ww*.35)+' '+f1(y0+8)+'L'+f1(32-ww*.35)+' '+(yb-4)+'" stroke="#fff" stroke-width="1" opacity=".5" stroke-linecap="round"/>';
  /* siper */
  body+='<path d="M'+f1(32-gw/2)+' '+(yb+1)+'Q32 '+(yb-4)+' '+f1(32+gw/2)+' '+(yb+1)+'L'+f1(32+gw/2-1)+' '+(yb+4.5)+'H'+f1(32-gw/2+1)+'Z" fill="'+G+'" stroke="'+st+'" stroke-width=".7"/>';
  if(s>=1)body+='<circle cx="32" cy="'+(yb+1.4)+'" r="'+f1(1.8+s*.35)+'" fill="'+J+'"/>';
  if(dg&&s>=4)body+='<path d="M'+f1(32-gw/2)+' '+(yb+2)+'l-3 4 M'+f1(32+gw/2)+' '+(yb+2)+'l3 4" stroke="'+G+'" stroke-width="1.6" stroke-linecap="round"/>';
 }
 /* alev (11-14), şimşek (15-17), yıldız (18+) */
 var top=cls==='tank'?10:cls==='buyucu'||cls==='sifaci'?8:8-Math.min(4,s);
 if(t>=7&&t<=14){var fl=g;for(var k=0;k<3;k++){var fx0=22+k*10;fx+='<path d="M'+fx0+' 36C'+(fx0-4)+' 28 '+(fx0+2)+' 24 '+fx0+' 14C'+(fx0+6)+' 22 '+(fx0+7)+' 30 '+(fx0+3)+' 36Z" fill="'+fl+'" opacity=".5"><animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="'+f1(.9+k*.25)+'s" repeatCount="indefinite"/><animate attributeName="opacity" values=".25;.6;.25" dur="'+f1(.9+k*.25)+'s" repeatCount="indefinite"/></path>'}}
 if(t>=15&&t<=17)fx+='<path d="M20 12L26 24L21 26L28 40 M44 8L38 22L43 24L36 38" fill="none" stroke="'+g+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><animate attributeName="opacity" values="0;1;.2;1;0" dur="1.6s" repeatCount="indefinite"/></path>';
 if(t>=18)fx+='<path d="'+star(32,top,4,1.6,4)+'" fill="#fff"><animate attributeName="opacity" values=".4;1;.4" dur="1.4s" repeatCount="indefinite"/></path>';
 /* parıltılar */
 var sp=Math.min(8,Math.floor(t/2));
 for(var j=0;j<sp;j++){var px=10+((j*37+t*11)%44),py=8+((j*23+t*7)%44),rr=1.2+(j%3)*.6;fx+='<path d="'+star(px,py,rr+1,rr*.35,4)+'" fill="#fff"><animate attributeName="opacity" values="0;1;0" dur="'+f1(1.4+(j%4)*.4)+'s" begin="'+f1(j*.35)+'s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="scale" additive="sum" values="1;1.3;1" dur="1.6s" repeatCount="indefinite"/></path>'}
 return'<defs>'+d+'</defs>'+o+'<g>'+body+'</g>'+fx}
function svg(cls,t,px){px=px||64;return'<svg class="yw'+(t>=19?' yh':'')+'" viewBox="0 0 64 64" width="'+px+'" height="'+px+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+mk(cls,t)+'</svg>'}
if(!document.getElementById('yw-css')){var s=document.createElement('style');s.id='yw-css';s.textContent='.yw{display:block;overflow:visible;filter:drop-shadow(0 4px 6px rgba(0,0,0,.65))}.yw.yh{animation:ywh 5s linear infinite}@keyframes ywh{to{filter:drop-shadow(0 4px 6px rgba(0,0,0,.65)) hue-rotate(360deg)}}@media (prefers-reduced-motion:reduce){.yw.yh{animation:none}}';document.head.appendChild(s)}
window.YW={svg:svg};
})();
