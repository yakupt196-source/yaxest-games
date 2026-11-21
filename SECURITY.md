# Güvenlik / Security
Güvenlik açığı veya telif ihlali bildirmek için: yakupt196@gmail.com (konu: Yaxest güvenlik).
Report vulnerabilities or copyright violations to the address above.

## Mimari özeti
- Hesap: Firebase Auth. Oyuncu kaydı cihazda (localStorage) tutulur, hesaba bağlı bulut yedeği Firestore'dadır.
- Çok oyunculu sunucu (`server/worker.js`): Firebase ID token'ı (RS256, imza + aud + iss + exp) doğrulanır; token'sız soket hiçbir şey yapamaz.
- Sunucu tarafı korumalar: hız sınırı, konum hız denetimi (ışınlanma bayrağı 6 sn'de bir), doğrulanmamış soket zaman aşımı (10 sn), IP başına bağlantı sınırı, giriş denemesi sınırı, dünya başına 150 oyuncu.
- İstemci: tüm kullanıcı metni `esc()` ile kaçışlanır (`& < > " '`), sayfalar iframe içine alınamaz (frame-buster).

## Bilinen sınırlar
- Altın/envanter istemcide tutulur (tarayıcı oyunu). Takasta sunucu şunları zorlar: iki taraf da en az 5. seviye, kendinle takas yok, teklif tavanları (200.000 altın, 6 kalem), hesap başına günlük 40 takas ve 1.000.000 altın hacmi. Tam çözüm envanteri sunucuya taşımaktır (büyük yeniden yazım).
- MQTT kütüphanesi önce kendi sunucundan (`/lib/mqtt.min.js`) yüklenir; Actions → "MQTT kütüphanesini depoya al" bir kez çalıştırılınca CDN'e ihtiyaç kalmaz (CDN yalnızca yedek).
- Repo herkese açıktır: `server/` kaynağı görünür, ancak içinde gizli anahtar yoktur.

## Firestore kuralları
`firestore.rules` dosyası taslaktır. Firebase Console → Firestore → Rules → **Rules Playground**'da test edip yayınla. Ayrıca Google Cloud Console → API anahtarını HTTP referrer (yaxestgames.com) ile kısıtla.
