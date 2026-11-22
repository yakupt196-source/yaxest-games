/* Yaxest Diyarı: Kasaba Gazetesi (window.YGZ)
   Kasaba meydanında haber panosu. Güncellemeleri kısa gazete manşetleri olarak duyurur.
   Yeni haber eklemek: HABER dizisinin EN BAŞINA bir satır ekle ve SAYI'yı 1 artır. */
(function(){
'use strict';
var SAYI=4;
var HABER=[
 {d:'22 Kasım',k:'Manşet',h:'Evler malikâneye döndü!',s:'Evinin yanında bahçe var: ek, sula, hasat et. Mutfakta yemek pişir, köylülerin siparişlerini teslim et. Yendiğin bosslar evine kupa olarak asılıyor.'},
 {d:'22 Kasım',k:'Av',h:'Canavarlar seviye seviye dizildi',s:'Surdan çıkınca her halka bir seviye. Üstteki çip bulunduğun bölgeyi, haritadaki yeşil halka sana uygun yeri gösteriyor.'},
 {d:'22 Kasım',k:'Kitap',h:'Avcı Defteri yayımlandı',s:'Her canavarı 10, 50 ve 200 kez yen, yıldız topla. Yıldızlar kalıcı güç veriyor.'},
 {d:'22 Kasım',k:'Kısa kısa',h:'Geceler artık gerçekten karanlık',s:'Fenerini unutma. Efekt sevmeyenler Menü\'den azaltabilir.'},
 {d:'22 Kasım',k:'Manşet',h:'Kasaba büyüdü: surların içinde 12 yeni arsa!',s:'Sur genişletildi. Satılık arsalarda tabela yazıyor; alan kişinin adı tabelaya işleniyor. Evine gir, jetonla dekore et, arkadaşını davet et.'},
 {d:'22 Kasım',k:'Kasaba',h:'Yatağı paylaşmak mümkün',s:'Evin iki kişilik yatağında arkadaşınla uyuyabilirsiniz. Birlikte uyuyanlar ekstra dinlenme kazanıyor.'},
 {d:'22 Kasım',k:'Savunma',h:'KUŞATMA UYARISI: Her saat :20\'de surlara saldırı!',s:'Dört kapıdan dalgalar geliyor, son dalgada Kuşatma Titanı var. Kule okçuları yardım ediyor; kapıyı koruyanlar ödül alıyor.'},
 {d:'21 Kasım',k:'Manşet',h:'Kış Şenliği başladı: Diyar kar altında!',s:'Meydana dev bir şenlik ağacı dikildi, fenerler yandı. Şenlik Ustası kahramanları bekliyor.'}
];
var KEY='yd-gz-seen',OX=-120,OY=6;
function seenN(){try{return +localStorage.getItem(KEY)||0}catch(e){return 0}}
function unread(){return seenN()<SAYI}
function pos(Y){var TS=Y.TS||64;return{x:Y.CX*TS+OX,y:Y.CY*TS+OY}}
function near(G,Y){if(!G||G.mode!=='world')return null;var p=pos(Y);return Math.hypot(p.x-G.px,p.y-G.py)<78?{t:'gz'}:null}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function drawBoard(c,x,y,t,plate){var ol='#1b1530';c.save();c.lineJoin='round';
  c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(x,y+2,40,9,0,0,6.3);c.fill();
  /* direkler */
  c.fillStyle='#6b4423';c.strokeStyle=ol;c.lineWidth=2;[-30,26].forEach(function(dx){c.fillRect(x+dx,y-62,5,64);c.strokeRect(x+dx,y-62,5,64)});
  /* çatı */
  c.fillStyle='#8a3b2a';c.beginPath();c.moveTo(x-42,y-62);c.lineTo(x,y-80);c.lineTo(x+42,y-62);c.closePath();c.fill();c.stroke();
  /* pano */
  c.fillStyle='#a8743f';rr(c,x-36,y-62,72,46,4);c.fill();c.stroke();c.fillStyle='#c48a4c';rr(c,x-32,y-58,64,38,3);c.fill();
  /* gazete kâğıdı */
  var sw=Math.sin(t*1.6)*.03;c.save();c.translate(x-2,y-40);c.rotate(sw-.04);
  c.fillStyle='#f4ecd6';c.fillRect(-20,-15,36,30);c.strokeStyle='#5a4a34';c.lineWidth=1.2;c.strokeRect(-20,-15,36,30);
  c.fillStyle='#2b2318';c.fillRect(-17,-12,30,4);c.fillStyle='#8a7a60';[-5,-1,3,7].forEach(function(yy){c.fillRect(-17,yy,13,1.4);c.fillRect(-1,yy,14,1.4)});
  c.fillStyle='#b8a27a';c.fillRect(-17,-5,13,3.6);c.restore();
  /* küçük not + raptiyeler */
  c.fillStyle='#fff4a8';c.save();c.translate(x+22,y-46);c.rotate(.12);c.fillRect(-7,-7,13,13);c.restore();
  c.fillStyle='#e04a4a';[[x-20,y-55],[x+22,y-52]].forEach(function(p){c.beginPath();c.arc(p[0],p[1],2,0,6.3);c.fill()});
  /* yeni haber işareti */
  if(unread()){var b=Math.sin(t*4)*3;c.fillStyle='#ffd23f';c.strokeStyle=ol;c.lineWidth=2;c.beginPath();c.arc(x+40,y-74+b,10,0,6.3);c.fill();c.stroke();
    c.fillStyle=ol;c.font='900 14px "Chakra Petch",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('!',x+40,y-73+b)}
  c.restore();if(plate)plate(c,x,y-86,'Diyar Gazetesi','#e8c070')}
function collect(ents,ctx,Y,t,plate){var p=pos(Y);ents.push({y:p.y,f:function(){drawBoard(ctx,p.x,p.y,t,plate)}})}
function esc(s){return String(s).replace(/[&<>"]/g,function(ch){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]})}
var CSS='<style>.ygz,.ygz *{font-family:Georgia,"Times New Roman",serif!important;color:#2b2318!important;text-shadow:none!important}'+'.ygz{background:#f4ecd6!important;border-radius:6px;padding:14px 14px 10px;box-shadow:inset 0 0 0 1px #cbb88f,inset 0 0 40px rgba(120,90,40,.18)}'+'.ygz .gk{color:#8a3b2a!important}.ygz div{background:transparent!important;border-color:#8a7a60}</style>';
function html(){var top=HABER[0],rest=HABER.slice(1),F='';
  var h=CSS+'<div class="ygz" style="background:#f4ecd6;color:#2b2318;border-radius:6px;padding:14px 14px 10px;box-shadow:inset 0 0 0 1px #cbb88f,inset 0 0 40px rgba(120,90,40,.18)">'+
  '<div style="text-align:center;border-bottom:3px double #2b2318;padding-bottom:6px"><div style="font-size:.72rem;letter-spacing:.18em;opacity:.75">SAYI '+SAYI+' · '+esc(top.d)+' · KASABA MEYDANI</div>'+
  '<div style="font-size:1.9rem;font-weight:900;letter-spacing:.04em;line-height:1.1">DİYAR GAZETESİ</div><div style="font-size:.72rem;font-style:italic;opacity:.75">Kahramanların bir numaralı haber kaynağı</div></div>'+
  '<div style="padding:10px 0 8px;border-bottom:1px solid #8a7a60"><div style="font-size:.7rem;font-weight:700;letter-spacing:.14em;color:#8a3b2a" class="gk">'+esc(top.k).toUpperCase()+'</div>'+
  '<div style="font-size:1.35rem;font-weight:900;line-height:1.15;margin:2px 0 4px">'+esc(top.h)+'</div><div style="font-size:.9rem;line-height:1.4">'+esc(top.s)+'</div></div>'+
  '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 14px">';
  rest.forEach(function(n){h+='<div style="padding:8px 0;border-bottom:1px solid rgba(43,35,24,.25)"><div style="font-size:.64rem;font-weight:700;letter-spacing:.12em;color:#8a3b2a" class="gk">'+esc(n.k==='Manşet'?'Geçen sayıdan':n.k).toUpperCase()+'</div><div style="font-size:.95rem;font-weight:800;line-height:1.2;margin:1px 0 2px">'+esc(n.h)+'</div><div style="font-size:.78rem;line-height:1.35;opacity:.85">'+esc(n.s)+'</div></div>'});
  return h+'</div><div style="text-align:center;font-size:.7rem;font-style:italic;opacity:.7;margin-top:8px">Haber panosu her güncellemede yenilenir.</div></div>'}
function seen(){try{localStorage.setItem(KEY,String(SAYI))}catch(e){}}
window.YGZ={near:near,collect:collect,html:html,seen:seen,unread:unread,title:function(){return'📜 Diyar Gazetesi'}};
})();
