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
- **Dünya 1 merkezdir:** klanlar, arkadaş listeleri, özel mesaj geçmişi, takma adlar ve sıralama tüm dünyalarda ortaktır. Mevcut veri Dünya 1'de zaten durduğu için taşıma gerekmez.
- Canlı olanlar dünyaya özel kalır: çevrimiçi göstergesi, parti, takas, düello, sohbet, konum.
- Karakter kaydı hesaba bağlı bulut yedeğiyle (Firestore) cihazlar arası eşitlenir. Çakışmada daha yeni kayıt (`sv` zaman damgası) kazanır.

## Bilinen sınırlar
- Merkez (Dünya 1) erişilemezse klan/arkadaş işlemleri o an çalışmaz. Konum ve sohbet çalışır.
- Altın ve envanter hâlâ istemci tarafında tutulur (sunucu doğrulaması yok).
- Dünya sayısını artırmak için `WORLDS` sabitini ve istemcide `net.js` içindeki `WNAMES` listesini büyüt.
