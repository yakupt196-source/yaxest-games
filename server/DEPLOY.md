# Sunucuyu yayına alma (Cloudflare)

Siteyi (GitHub Pages) her `git push` kendisi günceller. Sadece **çok oyunculu sunucu** elle yüklenir.

## Yol A: Cloudflare paneli (en kolay, 2 dakika)
1. dash.cloudflare.com → **Workers & Pages** → `yaxest-games` Worker'ını aç.
2. **Edit code** (Kodu düzenle) de.
3. Soldaki `worker.js` içeriğini sil, bu repodaki `server/worker.js` dosyasının tamamını yapıştır.
4. **Deploy** de.
5. **Settings → Bindings** altında `WORLD` Durable Object bağlantısı zaten duruyor olmalı. Yeni sınıf yok, taşıma (migration) gerekmiyor.
6. Kontrol: tarayıcıda `https://dunya.yaxestgames.com/worlds` aç. 5 dünya ve doluluk sayısı JSON olarak görünmeli:
   `[{"w":1,"n":0,"max":150}, ...]`

## Yol B: GitHub'dan otomatik
Repo → Settings → Secrets and variables → Actions → şu ikisini ekle:
- `CLOUDFLARE_API_TOKEN` ("Edit Cloudflare Workers" şablonuyla oluşturulur)
- `CLOUDFLARE_ACCOUNT_ID`

Sonra Actions → **Sunucu** → Run workflow.

## Bu sürümle gelenler
- 5 dünya, her biri en fazla 150 oyuncu (`WORLDS`, `MAXP` sabitleri).
- Konum yalnızca yakındakilere (1800 px) yayınlanır.
- **Merkez yok:** klanlar, arkadaş listeleri, özel mesaj geçmişi, takma adlar ve sıralama tüm dünyalarda ortaktır. Her kayıt, adının özetine göre 5 dünyadan birinde tutulur (shard), yük eşit dağılır. Eski veri Dünya 1'de durduğu için okuma bulamazsa oraya da bakar, taşıma gerekmez.
- Canlı olanlar dünyaya özel kalır: çevrimiçi göstergesi, parti, takas, düello, sohbet, konum.
- Karakter kaydı hesaba bağlı bulut yedeğiyle (Firestore) cihazlar arası eşitlenir. Çakışmada daha yeni kayıt (`sv` zaman damgası) kazanır.

## Bilinen sınırlar
- Bir dünya erişilemezse yalnızca o dünyada tutulan kayıtlara dokunan işlemler o an çalışmaz. Konum ve sohbet çalışır.
- Altın ve envanter hâlâ istemci tarafında tutulur (sunucu doğrulaması yok).
- Dünya sayısını artırmak için `WORLDS` sabitini ve istemcide `net.js` içindeki `WNAMES` listesini büyüt.

## Yönetim (admin) API'si
- `POST https://dunya.yaxestgames.com/adm` — yalnızca Firebase ID token'ındaki e-posta `ADMINS` listesinde (`server/worker.js`) ise çalışır. Panel: `/admin/`.
- İşlemler: çevrimiçi liste (5 dünya), oyuncu bul (envanter görüntüsü), ban/ban kaldır, sustur, at, eşya/altın ver-al, seviye ayarla, özel mesaj, duyuru, ban listesi, işlem günlüğü.
- Eşya/ayar kuyruğu oyuncu çevrimdışıysa girişte teslim edilir; oyuncu tarafı çift teslimi engeller.
- Envanter görüntüsü oyuncu istemcisinden gelir (2 dakikada bir), sunucu doğrulaması değildir.
- Bu özellik için Worker'ın güncellenmesi şart (Cloudflare Git entegrasyonu otomatik yapar).
