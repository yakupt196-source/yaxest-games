#!/usr/bin/env python3
"""Her oyun için taranabilir rehber sayfası (/rehber/<id>/) ve rehber merkezi (/rehber/) üretir.
Kullanım: python3 tools/rehber.py  (sonra python3 tools/seo.py ile sitemap yenilenir)"""
import re, os, json, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.environ.get('YX_BASE', 'https://yaxestgames.com/')
E = lambda s: html.escape(s, quote=True)
src = open(f'{ROOT}/games.js', encoding='utf-8').read()
G = []
for m in re.finditer(r"\{id:'([a-z]+)',n:'([^']+)',i:'([^']*)',c:'[^']*',k:'([^']+)',d:(?:'((?:[^'\\]|\\.)*)'|\"([^\"]*)\")", src):
    G.append(dict(id=m[1], n=m[2], i=m[3], k=m[4], d=(m[5] or m[6]).replace("\\'", "'")))
CSP = re.search(r'<meta http-equiv="Content-Security-Policy"[^>]*>', open(f'{ROOT}/index.html', encoding='utf-8').read())[0]
PLAY = 'Yaxest Games\'te tüm oyunlar ücretsizdir, indirme ve kayıt gerekmez; isteğe bağlı hesap açarsan ilerlemen her cihazda seninle olur.'

# ---- elle yazılmış, anahtar kelimesi güçlü oyunlar
RICH = {
 'okey': dict(h='Okey Oyna: Ücretsiz Online Okey (4 Kişilik)', t='Ücretsiz online okey oyna | Yaxest Okey',
  intro='Yaxest Okey, 4 kişilik klasik Okey\'in tarayıcıda, ücretsiz oynanan sürümüdür. 106 taş, gösterge, okey ve sahte okey kurallarıyla oynanır. Oda kurup arkadaşlarını kodla davet edebilir, boş kalan koltukları bota doldurtabilirsin.',
  steps=['Oda kur ya da arkadaşının verdiği 5 harfli kodla odaya katıl. Eksik koltukları bot doldurur.', 'Her oyuncuya 14 taş dağıtılır, başlayan oyuncuya 15. Gösterge taşının bir fazlası okey olur, sahte okey okeyin yerine geçer.', 'Sırası gelen, yerden ya da solundaki oyuncunun attığı taşı alır ve elinden bir taş atar.', 'Taşlarını aynı sayının farklı renkleri (per) ya da aynı rengin ardışık sayıları (seri) olarak diz. Eli bitiren kazanır; bitirme uygunluğu otomatik kontrol edilir.'],
  tips=['Okey taşını mümkünse son anda açığa çıkarma, joker olarak elinde tutmak esneklik sağlar.', 'Rakibin attığı taşlara bak: neyi topladığını anlamak elini savunmana yardım eder.', 'Çifte gitmeden önce elindeki per ve seri sayısını say.'],
  faq=[('Okey ücretsiz mi?', 'Evet, Yaxest Okey tamamen ücretsizdir. İndirme ve kayıt gerekmez.'), ('Kaç kişiyle oynanır?', '4 kişilikle oynanır. Gerçek oyuncu sayısı azsa kalan koltukları bot doldurur.'), ('Odaya jeton yatırabilir miyim?', 'Evet, oda kurucusu lobide sanal Yaxest jetonuyla bahis seçebilir. Jetonlar oyun içi puandır, gerçek para değildir.')]),
 'tavla': dict(h='Tavla Oyna: Ücretsiz Online Tavla', t='Ücretsiz online tavla oyna | Yaxest Tavla',
  intro='Yaxest Tavla, tam kurallı tavlayı tarayıcında ücretsiz oynatır. Arkadaşınla oda kurabilir ya da Kolay, Orta ve Zor seviyedeki botla oynayabilirsin.',
  steps=['Oda kur, kodu arkadaşına gönder ya da botla oyna seçeneğiyle hemen başla.', 'Sırası gelen zar atar. Zarların her biri ayrı bir hamledir; mümkünse ikisinin de oynanması gerekir.', 'Taşlarını kendi iç sahana toplayıp ardından tahtadan çıkar.', '15 taşın tamamını ilk çıkaran oyunu kazanır.'],
  tips=['Önde giden taşlarını tek bırakma, rakip vurabilir.', 'İç sahana erken kapı kur: kapalı noktalar rakibin ilerlemesini engeller.', 'Zarın tamamını oynama kuralını unutma, bazen küçük zar tek seçenek olur.'],
  faq=[('Tavla ücretsiz mi?', 'Evet, indirmeden ve kayıt olmadan oynanır.'), ('Botla oynanır mı?', 'Evet, üç zorluk seviyesi vardır.'), ('Telefonda çalışır mı?', 'Evet, mobil tarayıcıda dokunmatik olarak oynanır.')]),
 'pisti': dict(h='Pişti Oyna: Ücretsiz Online Pişti', t='Ücretsiz online pişti oyna | Yaxest Pişti',
  intro='Yaxest Pişti, 2 kişilik klasik Türk kart oyununu tarayıcıda ücretsiz oynatır. Arkadaşınla ya da botla oynayabilirsin.',
  steps=['Oda kur ya da botla oyna ile başla.', 'Her oyuncu 4 kart alır, masaya 4 kart açılır.', 'Elindeki bir kartı masaya at. Üstteki kartla aynı değerdeyse ya da vale ise masadaki kartları toplarsın.', 'Masada tek kart varken onu yakalarsan pişti yapar, ekstra puan alırsın. Destede kart bitince puanlar sayılır.'],
  tips=['Valeni boşuna harcama: masa kalabalıkken topla.', 'Masada tek kart kalmasından kaçın, rakip piştiye gidebilir.', 'Rakibin hangi kartları topladığını aklında tut.'],
  faq=[('Pişti ücretsiz mi?', 'Evet, tamamen ücretsizdir.'), ('Kaç kişiyle oynanır?', '2 kişilik oynanır; arkadaşınla ya da botla.'), ('Kayıt gerekir mi?', 'Hayır, hesap isteğe bağlıdır.')]),
 'satranc': dict(h='Satranç Oyna: Ücretsiz Online Satranç', t='Ücretsiz online satranç oyna | Yaxest Satranç',
  intro='Yaxest Satranç, tam kurallı (rok, geçerken alma ve piyon terfisi dahil) ücretsiz online satrançtır. Arkadaşınla oda kurabilir ya da botla oynayabilirsin.',
  steps=['Oda kur, kodu paylaş ya da botla oyna ile başla.', 'Beyaz başlar. Taşlarını sırayla oynarsın; yasal olmayan hamleler engellenir.', 'Rakibin şahını kaçacak yeri kalmadan tehdit edersen şah mat yaparsın.', 'Pat, üç kez tekrar ve yetersiz materyal gibi beraberlik durumları da tanınır.'],
  tips=['Açılışta merkezi kontrol et ve taşlarını geliştir.', 'Şahını rok ile güvene al.', 'Her hamlede rakibin tehdidini kontrol et.'],
  faq=[('Satranç ücretsiz mi?', 'Evet, indirme ve kayıt gerekmez.'), ('Botla oynanır mı?', 'Evet, seviye seçerek botla oynayabilirsin.'), ('Mobilde çalışır mı?', 'Evet, dokunmatik ekranda oynanır.')]),
 'kafe': dict(h='Kafe Tycoon: Ücretsiz Kafe İmparatorluğu Oyunu', t='Kafe tycoon oyunu, ücretsiz oyna | Yaxest Kafe',
  intro='Yaxest Kafe, küçük bir çay ocağından dünya zincirine uzanan ücretsiz bir tycoon (idle) oyunudur. Çevrimdışıyken bile kazanır, yeniden doğarak daha hızlı büyürsün.',
  steps=['Ekrana dokunarak ilk kazancını topla.', 'Kazandığınla yeni binalar al ve mevcutları yükselt.', 'Görevleri tamamla, başarımları aç, altın fırsatları kaçırma.', 'Belli bir noktada Yeniden Doğuş yap ve kalıcı bonusla daha hızlı büyü.'],
  tips=['Ucuz binaları yükseltmek çoğu zaman en iyi getiridir.', 'Çıkmadan önce oyunu kapat: çevrimdışı kazanç birikir.', 'Altın fırsatlar kısa sürede ekstra kazanç sağlar.'],
  faq=[('Tycoon oyunu nedir?', 'Kazancını yatırıma çevirip işini büyüttüğün oyun türüdür.'), ('Kapalıyken kazanır mı?', 'Evet, çevrimdışı kazanç hesaplanır.'), ('Ücretsiz mi?', 'Evet, reklamsız ve ücretsizdir.')]),
 'maden': dict(h='Maden Tycoon: Ücretsiz Madencilik Oyunu', t='Maden tycoon oyunu, ücretsiz oyna | Yaxest Maden',
  intro='Yaxest Maden, kürekle başlayıp yeraltı şehrine kadar kazdığın ücretsiz bir madencilik tycoon oyunudur.',
  steps=['Dokunarak kaz ve ilk kazancını topla.', 'Yeni makineler al, mevcutları yükselt.', 'Görevleri ve başarımları tamamla.', 'Yeniden Doğuş ile kalıcı bonus kazan.'],
  tips=['Derin katmanlar daha değerli, ama daha pahalıdır.', 'Çevrimdışı kazancı kaçırmamak için düzenli giriş yap.', 'Altın fırsatları değerlendir.'],
  faq=[('Ücretsiz mi?', 'Evet, indirme gerekmez.'), ('Kapalıyken kazanır mı?', 'Evet, çevrimdışı kazanç vardır.'), ('Telefonda çalışır mı?', 'Evet.')]),
 'studyo': dict(h='Stüdyo Tycoon: Ücretsiz Oyun Stüdyosu Kurma Oyunu', t='Oyun stüdyosu tycoon, ücretsiz oyna | Yaxest Stüdyo',
  intro='Yaxest Stüdyo, garajda oyun yapıp e-spor ve metaverse\'e uzandığın ücretsiz bir tycoon oyunudur.',
  steps=['Dokunarak ilk geliri topla.', 'Ekip ve ofis al, yükselt.', 'Görevleri tamamla.', 'Yeniden Doğuş yap ve daha hızlı büyü.'],
  tips=['Önce ucuz yükseltmeleri tamamla.', 'Çevrimdışı kazancı kullan.', 'Altın fırsatları kaçırma.'],
  faq=[('Ücretsiz mi?', 'Evet.'), ('Kayıt gerekir mi?', 'Hayır.'), ('Mobilde oynanır mı?', 'Evet.')]),
 'koloni': dict(h='Koloni Tycoon: Ücretsiz Mars Kolonisi Oyunu', t='Mars kolonisi tycoon, ücretsiz oyna | Yaxest Koloni',
  intro='Yaxest Koloni, Mars\'ta güneş panelinden yıldız gemisine uzanan ücretsiz bir uzay kolonisi tycoon oyunudur.',
  steps=['Dokunarak enerji topla.', 'Yeni tesisler kur ve yükselt.', 'Görevleri tamamla.', 'Yeniden Doğuş ile terraform bonusu kazan.'],
  tips=['Enerji üretimini dengede tut.', 'Çevrimdışı kazancı kullan.', 'Altın fırsatları değerlendir.'],
  faq=[('Ücretsiz mi?', 'Evet.'), ('İndirme gerekir mi?', 'Hayır.'), ('Mobilde çalışır mı?', 'Evet.')]),
 'sehir': dict(h='Şehir Tycoon: Ücretsiz Şehir Kurma Oyunu', t='Şehir kurma tycoon, ücretsiz oyna | Yaxest Şehir',
  intro='Yaxest Şehir, küçük bir dükkândan uzay limanlı metropole uzanan ücretsiz bir şehir kurma tycoon oyunudur.',
  steps=['Dokunarak ilk geliri topla.', 'Yeni binalar kur ve yükselt.', 'Görevleri tamamla.', 'Yeniden Doğuş yap ve şehrini büyüt.'],
  tips=['Gelir artıran binalara öncelik ver.', 'Çevrimdışı kazancı kullan.', 'Altın fırsatları kaçırma.'],
  faq=[('Ücretsiz mi?', 'Evet.'), ('Kayıt gerekir mi?', 'Hayır.'), ('Telefonda oynanır mı?', 'Evet.')]),
}
CAT = {
 'Refleks': ('Refleks oyunu: hızlı karar ver, tek dokunuşla oyna.', ['Ekrana dokunarak oyna; zamanlama her şeydir.', 'Her turda hız ya da zorluk artar.', 'Rekorunu kır, kaydedilir.'], ['Ritmi yakala, panik yapma.', 'Küçük hataları büyütme, devam et.', 'Kısa molalarla rekorun artar.']),
 'Bulmaca': ('Bulmaca oyunu: düşün, planla, çöz.', ['Hedefi oku ve hamleni planla.', 'Az hamleyle bitirmek daha çok puan getirir.', 'Takılırsan baştan başlayabilirsin.'], ['Önce köşeleri ve kısıtları düşün.', 'Acele etme, hamle sayın sınırlı olabilir.', 'Aynı bölümü tekrar denemek öğretir.']),
 'Arcade': ('Arcade oyunu: kısa, hızlı ve bağımlılık yapıcı.', ['Dokun ya da kaydır, karakterini yönlendir.', 'Engellerden kaç, ödülleri topla.', 'Puanını geçerek rekorunu artır.'], ['Önce hayatta kal, puan sonra gelir.', 'Hız arttıkça sakin kal.', 'Bonusları kaçırma.']),
}
SHELL = '''<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
{csp}
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Yaxest Games"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:url" content="{url}"><meta property="og:image" content="{base}og.png"><meta property="og:locale" content="tr_TR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../icon.svg" type="image/svg+xml">
<script type="application/ld+json">{ld}</script>
<style>
:root{{color-scheme:dark}}*{{box-sizing:border-box}}body{{margin:0;background:#0b0820;color:#f4f1ff;font:16px/1.65 system-ui,-apple-system,"Segoe UI",sans-serif}}
a{{color:#7aa2ff}}.w{{max-width:780px;margin:0 auto;padding:20px 18px 60px}}
.top{{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #241d52}}.top a{{color:#fff;font-weight:800;text-decoration:none}}
h1{{font-size:clamp(1.6rem,5vw,2.3rem);line-height:1.2;margin:.6em 0 .4em}}h2{{font-size:1.25rem;margin:1.8em 0 .5em;color:#ffd23f}}
.cta{{display:inline-block;background:#ffd23f;color:#1a1530;font-weight:800;padding:13px 26px;border-radius:999px;text-decoration:none;margin:14px 0}}
ol,ul{{padding-left:1.3em}}li{{margin:.4em 0}}.bc{{font-size:.85rem;color:#a9a3cf}}.bc a{{color:#a9a3cf}}
.rel{{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;padding:0;list-style:none}}.rel a{{display:block;background:#171235;border:1px solid #2b2461;border-radius:12px;padding:12px;text-decoration:none;color:#fff;font-weight:700}}
details{{background:#171235;border:1px solid #2b2461;border-radius:12px;padding:10px 14px;margin:8px 0}}summary{{cursor:pointer;font-weight:700}}
footer{{color:#8e88b8;font-size:.85rem;margin-top:40px}}
</style>
</head>
<body>
<div class="top"><a href="../../">Yaxest<span style="color:#ffd23f">.</span>Games</a><a href="../" style="font-weight:600;color:#a9a3cf">Rehber</a></div>
<main class="w">
{body}
<footer>{play} <a href="../../gizlilik.html">Gizlilik</a> · © 2026 Yaxest Games</footer>
</main>
</body></html>
'''

def page(g):
    r = RICH.get(g['id'])
    cat = CAT.get(g['k'])
    if r:
        h, title, intro, steps, tips, faq = r['h'], r['t'], r['intro'], r['steps'], r['tips'], r['faq']
    else:
        c = cat or CAT['Arcade']
        h = f'{g["n"]} nasıl oynanır? Ücretsiz online {g["k"].lower()} oyunu'
        title = f'{g["n"]}: ücretsiz oyna, nasıl oynanır | Yaxest Games'
        intro = f'{g["n"]}: {g["d"]} Tarayıcıda, indirmeden ve kayıt olmadan ücretsiz oynanır; telefonda da çalışır. {c[0]}'
        steps = c[1]; tips = c[2]
        faq = [(f'{g["n"]} ücretsiz mi?', 'Evet, ücretsizdir. İndirme ve kayıt gerekmez.'),
               (f'{g["n"]} telefonda oynanır mı?', 'Evet, mobil tarayıcıda dokunmatik olarak oynanır.'),
               ('Rekorum kaydedilir mi?', 'Evet, rekorun cihazında saklanır. Hesap açarsan başka cihazlarda da seninle olur.')]
    url = f'{BASE}rehber/{g["id"]}/'
    desc = (intro[:150].rsplit(' ', 1)[0] + '...') if len(intro) > 155 else intro
    rel = [x for x in G if x['k'] == g['k'] and x['id'] != g['id']][:5] or G[:5]
    if len(rel) < 5:
        rel += [x for x in G if x not in rel and x['id'] != g['id']][:5 - len(rel)]
    ld = [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Yaxest Games", "item": BASE},
              {"@type": "ListItem", "position": 2, "name": "Rehber", "item": BASE + 'rehber/'},
              {"@type": "ListItem", "position": 3, "name": g['n'], "item": url}]},
          {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
              {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}]
    body = (f'<nav class="bc"><a href="../../">Yaxest Games</a> › <a href="../">Rehber</a> › {E(g["n"])}</nav>\n'
            f'<h1>{E(h)}</h1>\n<p>{E(intro)}</p>\n<a class="cta" href="../../{g["id"]}/">▶ Şimdi oyna: {E(g["n"])}</a>\n'
            f'<h2>Nasıl oynanır?</h2>\n<ol>{"".join(f"<li>{E(s)}</li>" for s in steps)}</ol>\n'
            f'<h2>İpuçları</h2>\n<ul>{"".join(f"<li>{E(s)}</li>" for s in tips)}</ul>\n'
            f'<h2>Sık sorulan sorular</h2>\n{"".join(f"<details><summary>{E(q)}</summary><p>{E(a)}</p></details>" for q, a in faq)}\n'
            '<h2>Benzer oyunlar</h2>\n<ul class="rel">' + ''.join('<li><a href="../%s/">%s</a></li>' % (x['id'], E(x['n'])) for x in rel) + '</ul>\n')
    return SHELL.format(csp=CSP, title=E(title), desc=E(desc), url=url, base=BASE, ld=json.dumps(ld, ensure_ascii=False), body=body, play=E(PLAY))

os.makedirs(f'{ROOT}/rehber', exist_ok=True)
for g in G:
    d = f'{ROOT}/rehber/{g["id"]}'
    os.makedirs(d, exist_ok=True)
    open(f'{d}/index.html', 'w', encoding='utf-8').write(page(g))

# merkez sayfa
groups = {}
for g in G: groups.setdefault(g['k'], []).append(g)
order = ['Masa', 'Tycoon', 'Arcade', 'Refleks', 'Bulmaca']
sec = ''.join(f'<h2>{E(k)} oyunları</h2>\n<ul class="rel">' + ''.join(f'<li><a href="{x["id"]}/">{E(x["n"])}</a></li>' for x in groups[k]) + '</ul>\n' for k in order if k in groups)
url = BASE + 'rehber/'
hub = SHELL.format(csp=CSP, title='Ücretsiz online oyun rehberi: nasıl oynanır, ipuçları | Yaxest Games',
    desc='Yaxest Games oyun rehberi: okey, tavla, pişti, satranç, tycoon ve 30\'dan fazla mini oyunun kuralları, ipuçları ve sık sorulan soruları.',
    url=url, base=BASE, ld=json.dumps({"@context": "https://schema.org", "@type": "CollectionPage", "name": "Yaxest Games oyun rehberi", "url": url}, ensure_ascii=False),
    body=f'<nav class="bc"><a href="../">Yaxest Games</a> › Rehber</nav>\n<h1>Oyun rehberi</h1>\n<p>Yaxest Games\'teki {len(G)} oyunun kuralları, ipuçları ve sık sorulan soruları. Hepsi ücretsiz, indirmeden ve kayıt olmadan oynanır.</p>\n{sec}', play=E(PLAY))
hub = hub.replace('../../', '../').replace('<a href="../" style="font-weight:600;color:#a9a3cf">Rehber</a>', '<a href="./" style="font-weight:600;color:#a9a3cf">Rehber</a>')
open(f'{ROOT}/rehber/index.html', 'w', encoding='utf-8').write(hub)
print('ok', len(G), 'rehber sayfası + merkez')
