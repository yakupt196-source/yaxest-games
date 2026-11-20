# Yaxest Games
Oyunlar (32): sallan, kaydir, damla, kir, radar, labirent, pota, mermi, nota, zincir, tirman, lazer, bicak, duello, tup, yorunge, ritim, hedef, sayi, yol, isik, renk, balon, karo, kule, kosu, hole, blok, yilan, hafiza, birlestir, kostebek.
Yeni oyun eklemek: klasör aç (örn. `yeni/index.html`), sayfanın sonuna
`<script src="../games.js"></script><script src="../menu.js"></script>` ekle ve `games.js` listesine bir satır yaz.
Ana sayfa ve oyun içi menü listeyi `games.js` içinden okur.
Yayın GitHub Pages ile: `main` dalına yazılan her değişiklik kendiliğinden yayınlanır (`.github/workflows/pages.yml`).
Geri bildirim: ana sayfadaki Instagram ve LinkedIn bağlantıları (GitHub Pages'te form sunucusu yok).

## Diller
Site 8 dilde: Türkçe, English, Deutsch, Español, Français, Português, Русский, Italiano. Tarayıcı diline göre açılır, ziyaretçi seçince hatırlanır.
Metinler `i18n-dict.js` içindeki sözlükten otomatik çevrilir (`i18n.js`). Yeni oyun/metin eklerken Türkçe cümleyi sözlüğe ekle; eksik çeviri Türkçe kalır. Dil eklemek için `i18n.js` içindeki `LANGS`/`NAMES` ve sözlükteki her dizi güncellenir.

## Yaxest Ritim
Geometry Dash tarzı, yandan görünümlü ritim koşusu: dikenler, bloklar (üstüne konulur), sıçrama pedleri, geniş çukurlar, tavandan sarkan engeller. Dünya saniye tabanlıdır; her seviye daha uzun ve hızlıdır. Müzik tamamen kodla (WebAudio) üretilir ve yumuşaktır (yankı, düşük geçiş filtresi). Müzik seçimi: Lo-fi, Synthwave, House, Piyano. **Kendi müziğin**: cihazdan bir ses dosyası seç; tempo ve vuruşlar tarayıcıda analiz edilir, engeller şarkıya göre dizilir (dosya hiçbir yere yüklenmez).

## Ses (tüm oyunlar)
`sfx.js`: dosyasız, tamamen kodla üretilen ortak ses motoru. Tüm sesler aynı pentatonik gamdadır (puan, hata, bitiş, kazanma, dokunma). Oyunlara otomatik bağlanır (skor, can, bitiş mesajı gözlemlenir). Ses, duraklatma menüsündeki "Ses" düğmesiyle kapatılır (`yx-mute`). Ritim kendi ses motorunu kullanır.

## Arama motoru (SEO)
`python3 tools/seo.py` her sayfaya başlık, açıklama, canonical, Open Graph/Twitter ve JSON-LD (VideoGame, WebSite, ItemList) ekler; `sitemap.xml` ve `robots.txt` üretir. Yeni oyun ekledikten sonra çalıştır. Ana adres: `YX_BASE` ortam değişkeniyle değişir (özel alan adı alınırsa).

## Yeni mini oyunlar (15)
`lib.js`: yeni oyunlar için ortak çatı (`G.run`, `G.over`, `G.pause`, çizim yardımcıları). Her oyunun kaynağı `tools/src/<id>.js`; `python3 tools/mk.py` ile `<id>/index.html` üretilir (ilk satır: `// Ad|giriş metni`).
`music.js`: kodla üretilen arka plan müziği (lofi, chill, synth, groove, arcade, piyano). Oyuna göre stil seçer, menüdeki "Müzik" düğmesiyle kapanır (`yx-music`).
Duello iki kişiliktir (ekran ikiye bölünür).

## Jeton, mağaza ve karakter
- `economy.js`: tüm sayfalarda yüklenir. Jeton (oynadıkça, oyun/seviye bitirince, rekor, günlük hediye, yeni oyun keşfi), karakter çizimi (SVG, 6 tür + aksesuar), temalar, mağaza API'si (`window.YX`). Veri yalnızca cihazda (`localStorage['yx-eco']`).
- `magaza/`: mağaza sayfası (karakter, özellik, tema, eşya, sürpriz kutu).
- Tüp oyununda tüp ekleme ve ipucu jetonla.
