/* Yaxest Diyarı · Gerçek para ile alım (YPAY) — Google Play Faturalandırma
   Oyun Google Play'e TWA (Bubblewrap) ile çıktığında Chrome'un Digital Goods API'si ve Payment Request ile çalışır.
   Tarayıcıda (site) bu API yoktur: ready() false döner, mağaza paketleri "yakında" gösterir.
   Play Console'da aynı kimliklerle "uygulama içi ürün" (tüketilebilir) açılmalı: gem_80, gem_450, gem_1000, gem_2600, starter_pack.
   ÖNEMLİ: Kalıcı ve hilesiz olması için satın alma jetonu sunucuda (Google Play Developer API) doğrulanıp elmas sunucuda verilmeli;
   bu dosya istemci tarafını hazırlar, sunucu doğrulaması `server/worker.js` içine eklenecek (bkz. mobil/README.md). */
(function(){
var PLAY='https://play.google.com/billing',svc=null,ok=false;
try{if('getDigitalGoodsService' in window){window.getDigitalGoodsService(PLAY).then(function(s){svc=s;ok=!!s}).catch(function(){})}}catch(e){}
function buy(sku){if(!ok||!window.PaymentRequest)return Promise.reject(new Error('play-billing-yok'));
  var req=new PaymentRequest([{supportedMethods:PLAY,data:{sku:sku}}],{total:{label:'Toplam',amount:{currency:'TRY',value:'0'}}});
  return req.show().then(function(res){var tok=res.details&&res.details.purchaseToken;return res.complete('success').then(function(){
      /* tüketilebilir ürün: tekrar alınabilsin diye tüket */return (svc&&svc.consume&&tok?svc.consume(tok):Promise.resolve()).then(function(){try{if(window.YNet&&YNet.send)YNet.send({t:'iap',sku:sku,tok:tok})}catch(e){}return true})})})}
window.YPAY={ready:function(){return ok},buy:buy};
})();
