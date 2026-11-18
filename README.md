# Yaxest Games
Oyunlar (18): yorunge, ritim, hedef, sayi, yol, isik, zipla, renk, balon, karo, kule, kosu, hole, blok, yilan, hafiza, birlestir, kostebek.
Yeni oyun eklemek: klasör aç (örn. `yeni/index.html`), sayfanın sonuna
`<script src="../games.js"></script><script src="../menu.js"></script>` ekle ve `games.js` listesine bir satır yaz.
Ana sayfa ve oyun içi menü listeyi `games.js` içinden okur.
Netlify GitHub'a bağlı: `main` dalına yazılan her değişiklik kendiliğinden yayınlanır.
Geri bildirim formu: Netlify Forms (ücretsiz kota).

## Diller
Site 8 dilde: Türkçe, English, Deutsch, Español, Français, Português, Русский, Italiano. Tarayıcı diline göre açılır, ziyaretçi seçince hatırlanır.
Metinler `i18n-dict.js` içindeki sözlükten otomatik çevrilir (`i18n.js`). Yeni oyun/metin eklerken Türkçe cümleyi sözlüğe ekle; eksik çeviri Türkçe kalır. Dil eklemek için `i18n.js` içindeki `LANGS`/`NAMES` ve sözlükteki her dizi güncellenir.

## Yaxest Ritim
Geometry Dash tarzı, yandan görünümlü ritim koşusu: dikenler, bloklar (üstüne konulur), sıçrama pedleri, geniş çukurlar, tavandan sarkan engeller. Dünya saniye tabanlıdır; her seviye daha uzun ve hızlıdır. Müzik tamamen kodla (WebAudio) üretilir ve yumuşaktır (yankı, düşük geçiş filtresi). Müzik seçimi: Lo-fi, Synthwave, House, Piyano. **Kendi müziğin**: cihazdan bir ses dosyası seç; tempo ve vuruşlar tarayıcıda analiz edilir, engeller şarkıya göre dizilir (dosya hiçbir yere yüklenmez).

## Ses (tüm oyunlar)
`sfx.js`: dosyasız, tamamen kodla üretilen ortak ses motoru. Tüm sesler aynı pentatonik gamdadır (puan, hata, bitiş, kazanma, dokunma). Oyunlara otomatik bağlanır (skor, can, bitiş mesajı gözlemlenir). Ses, duraklatma menüsündeki "Ses" düğmesiyle kapatılır (`yx-mute`). Ritim kendi ses motorunu kullanır.
