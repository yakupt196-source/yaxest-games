# Yaxest Diyarı · Mobil uygulama hazırlığı

Oyun zaten PWA olarak hazır: manifest, simgeler, servis çalışanı, yatay tam ekran ve dokunmatik kontroller var. Mağazalara çıkmak için oyunu yeniden yazmak gerekmiyor; mevcut web oyunu bir uygulama kabuğuna sarılıyor.

## Yol haritası

| Adım | Ne | Araç | Maliyet |
|---|---|---|---|
| 1 | Android (Google Play) | **TWA**: Bubblewrap CLI ya da PWABuilder.com, `yaxestgames.com/diyar/` adresini uygulamaya sarar | Play geliştirici hesabı, tek seferlik 25 $ |
| 2 | Alan adı doğrulama | `/.well-known/assetlinks.json`: imza anahtarının SHA-256 parmak izi (Bubblewrap üretir) | — |
| 3 | iOS (App Store) | **Capacitor** (WebView kabuğu); Mac + Xcode gerekir | Apple geliştirici hesabı, yıllık 99 $ |
| 4 | Mağaza sayfası | Açıklama, ekran görüntüleri, öne çıkan görsel, yaş derecelendirmesi (IARC), Veri Güvenliği formu | — |

## Bu klasörde / repoda hazır olanlar
- `mobil/feature-graphic-1024x500.png`: Play Store öne çıkan görseli.
- `diyar/shots/*.jpg`: 1920×1080 oyun içi ekran görüntüleri (kasaba, zindan boss'u, iskele, vahşi bölge). Mağaza sayfasında ve manifestin `screenshots` alanında kullanılıyor; Chrome'un zengin yükleme penceresi bunları gösterir.
- `diyar/manifest.webmanifest`: `screenshots`, `shortcuts`, `prefer_related_applications:false` eklendi.
- **Zayıf cihaz algılama:** İlk açılışta cihazda 2 GB veya daha az bellek ya da 2 veya daha az çekirdek varsa düşük efekt modu kendiliğinden açılır.

## Senin yapman gerekenler
1. Google Play Console hesabı aç (25 $).
2. Gizlilik politikası sayfası hazır olmalı (hesap ve e-posta verisi işleniyor). Mağaza bunu zorunlu tutar.
3. Hesap açılınca Claude'a haber ver. Bubblewrap ile `.aab` paketi ve `assetlinks.json` birlikte hazırlanır. İmzalama anahtarını sen saklarsın.

## Dikkat
- **Jeton mağazası:** Jetonlar gerçek parayla satılmadığı sürece Google/Apple uygulama içi satın alma kurallarına takılmaz. İleride gerçek para eklenirse, uygulama içinde mağazaların kendi ödeme sistemi kullanılmalı.
- **Telif:** Kullanılan tüm görsel ve sesler ya kendimizin ya da ticari kullanıma açık lisanslı olmalı.

## Gelir modeli (27 Kasım 2026)
Oyun ücretsiz; para, güç satmadan **zaman kazandıran ve gösterişli** şeylerden gelir. Oyuncuyu kaçırmayan bu dengeyi korumak, uzun vadede daha çok kazandırır.

| Kaynak | Ne satılır | Nerede |
|---|---|---|
| 💎 Elmas paketleri | 80 / 450 (+%12) / 1000 (+%25) / 2600 (+%40) elmas | Mağaza → Elmas (Google Play Faturalandırma) |
| 🚀 Başlangıç Paketi | Bir kerelik: 300 💎 + Efsanevi Sandık + 10.000 🪙 (₺49,99) | Mağaza → Öne Çıkan |
| 🎟 Sezon Kartı | 30 seviyelik ödül yolu, özel kostüm, elmas iadesi (₺99,99 / sezon) | Mağaza → Öne Çıkan (yakında) |
| 🎁 Sandıklar | Bronz (altın), Gümüş/Altın/Efsanevi (elmas): rün, altın, iksir, elmas iadesi | Mağaza → Sandıklar |
| 🧍 Karakterler | Özel karakterler (jeton ya da elmas) | Mağaza → Karakterler |
| ⚔ Silahlar | Seviyesi gelen silahı malzemesiz anında alma (seviye şartı korunur) | Mağaza → Silahlar |
| 🔮 Rünler | Sıradan/Seçkin altınla, Nadir+ elmasla | Mağaza → Rünler |
| ⏳ Günün fırsatları | Her gün değişen 3 indirim (FOMO, geri dönüş sebebi) | Mağaza → Öne Çıkan |

**Ücretsiz elmas (oyuncuyu tutar):** günlük 5 💎, her seviye atlayışta 2 💎. İleride: ödüllü reklam (izle → +10 💎) için web sürümünde AdSense H5 Games Ads, uygulamada Play'in izin verdiği reklam SDK'sı.

**Teknik durum:**
- `diyar/shop.js`: oyun içi mağaza (lobiden ve oyun menüsünden açılır, siteye atmaz).
- `diyar/pay.js` (YPAY): Google Play Digital Goods API + Payment Request istemci tarafı hazır; TWA'da otomatik devreye girer.
- **Yapılacak (Play hesabı açılınca):** Play Console'da ürünler (gem_80, gem_450, gem_1000, gem_2600, starter_pack, season_pass); sunucuda satın alma doğrulaması (Google Play Developer API, `server/worker.js` içinde `t:'iap'`) ve elmasın sunucuda tutulması (hile önlemi).
