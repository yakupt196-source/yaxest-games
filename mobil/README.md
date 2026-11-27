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
