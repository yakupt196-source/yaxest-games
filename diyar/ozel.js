/* Yaxest Diyarı: özel karakterlerin imza yetenekleri (YO). Veri burada, çalıştırma game.js castSp'te. */
(function(){
'use strict';
var FOUNDER='yakupt196@gmail.com';
var FX={name:'Kurucunun Gazabı',ic:'bolt',kind:'bolt',cd:7,r:1100,n:80,m:1e13,col:'#bfe9ff',d:'Gökten yıldırım yağdırır: görüş alanındaki HER düşmanı tek vuruşta yok eder (boss dahil). Yalnızca Kurucu kullanabilir.'};
var T={
 fire:{name:'Alev Patlaması',ic:'flame',kind:'aoe',r:190,m:4.2,col:'#ff8a2b',slow:0,d:'Etrafında alev patlaması: yakındaki düşmanlara yüksek hasar.'},
 frost:{name:'Buz Çağı',ic:'nova',kind:'aoe',r:220,m:3.2,col:'#7ad7ff',slow:5,d:'Çevreyi dondurur: hasar verir ve düşmanları 5 sn yavaşlatır.'},
 heal:{name:'Hayat Işığı',ic:'heal',kind:'heal',r:0,amt:.5,col:'#5be39a',d:'Canının yarısını yeniler ve 8 sn boyunca iyileştirir.'},
 dash:{name:'Gölge Atılışı',ic:'shadow',kind:'dash',d2:340,m:4,col:'#b57bff',d:'İleri atılarak yolundaki düşmanları keser.'},
 guard:{name:'Demir İrade',ic:'shield',kind:'guard',dur:6,red:.75,col:'#5cb4ff',d:'6 sn boyunca aldığın hasarı %75 azaltır.'},
 time:{name:'Zamanı Durdur',ic:'hourglass',kind:'aoe',r:300,m:2.4,col:'#ffd23f',slow:7,d:'Geniş alandaki düşmanları 7 sn neredeyse durdurur.'},
 star:{name:'Yıldız Yağmuru',ic:'star',kind:'bolt',r:420,n:6,m:3.6,col:'#ffe28a',d:'Gökten yıldızlar düşürür: 6 hedefe hasar.'},
 burst:{name:'Kahraman Gücü',ic:'core',kind:'aoe',r:150,m:2.8,col:'#ffd23f',slow:0,d:'Çevrene enerji dalgası yayar.'}};
var MAP={cadi:'fire',kaan:'fire',zehra:'fire',samuray:'dash',ninja:'dash',tarik:'dash',kerem:'dash',ceren:'dash',
 beyazkalp:'heal', buz:'frost',nox:'frost',ayse:'heal',nehir:'heal',selen:'heal',arya:'heal',aras:'guard',kaya:'guard',burak:'guard',atacan:'guard',
 atlas:'time',prenses:'star',sultan:'star',suayb:'burst',zilan:'burst',zilanng:'burst',defne:'heal',elif:'burst',murat:'burst',can:'dash',selin:'burst',emre:'burst'};
/* nadirlik derecesine göre güç ve bekleme */
function get(P,email,rar){
  var em=String(email||'').toLowerCase();
  if(em===FOUNDER){var o=Object.assign({},FX);o.id='founder';return o}
  var ap=P&&P.ap;if(!ap||ap.body!=='svg'||!ap.sv)return null;
  var k=MAP[ap.sv];if(!k)return null;var b=T[k],r=Math.max(2,Math.min(6,rar||2)),o={};for(var x in b)o[x]=b[x];
  o.id=ap.sv;o.cd=Math.max(10,24-r*2);var s=1+(r-2)*.18;if(o.m)o.m*=s;if(o.amt)o.amt=Math.min(.9,o.amt+(r-2)*.06);return o}
window.YO={get:get,FOUNDER:FOUNDER,T:T};
})();
