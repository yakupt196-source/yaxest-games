#!/usr/bin/env python3
"""Arama motoru (SEO) etiketleri, sitemap.xml ve robots.txt üretir. Yeni oyun ekleyince: python3 tools/seo.py"""
import re, json, os, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.environ.get('YX_BASE', 'https://yaxestgames.com/')
src = open(f'{ROOT}/games.js', encoding='utf-8').read()
games = []
for m in re.finditer(r"\{id:'([a-z]+)',n:'([^']+)',i:'([^']*)',c:'[^']*',k:'([^']+)',d:(?:'((?:[^'\\]|\\.)*)'|\"([^\"]*)\")", src):
    games.append(dict(id=m[1], n=m[2], k=m[4], d=(m[5] or m[6]).replace("\\'", "'")))
assert len(games) >= 17, len(games)
E = lambda s: html.escape(s, quote=True)
START, END = '<!--seo-->', '<!--/seo-->'
OG = BASE + 'og.png'

def strip(s):
    s = re.sub(re.escape(START) + r'.*?' + re.escape(END) + r'\n?', '', s, flags=re.S)
    s = re.sub(r'<meta name="description"[^>]*>\n?', '', s)
    s = re.sub(r'<meta property="og:[a-z:]+"[^>]*>\n?', '', s)
    s = re.sub(r'<meta name="twitter:[a-z:]+"[^>]*>\n?', '', s)
    s = re.sub(r'<link rel="canonical"[^>]*>\n?', '', s)
    return s

def block(title, desc, url, ld):
    return (f'{START}\n<meta name="description" content="{E(desc)}">\n<link rel="canonical" href="{url}">\n'
            f'<meta property="og:type" content="website">\n<meta property="og:site_name" content="Yaxest Games">\n'
            f'<meta property="og:title" content="{E(title)}">\n<meta property="og:description" content="{E(desc)}">\n'
            f'<meta property="og:url" content="{url}">\n<meta property="og:image" content="{OG}">\n<meta property="og:locale" content="tr_TR">\n'
            f'<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="{E(title)}">\n'
            f'<meta name="twitter:description" content="{E(desc)}">\n<meta name="twitter:image" content="{OG}">\n'
            f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n{END}\n')

def put(path, title, desc, url, ld):
    s = strip(open(path, encoding='utf-8').read())
    s = re.sub(r'<title>.*?</title>', f'<title>{E(title)}</title>', s, count=1, flags=re.S)
    s = s.replace('</title>', '</title>\n' + block(title, desc, url, ld).rstrip('\n'), 1)
    open(path, 'w', encoding='utf-8').write(s)

# --- oyun sayfaları
for g in games:
    p = f'{ROOT}/{g["id"]}/index.html'
    if not os.path.exists(p): continue
    url = f'{BASE}{g["id"]}/'
    title = f'{g["n"]}: ücretsiz online oyun | Yaxest Games'
    desc = f'{g["n"]}: {g["d"]} İndirmeden, kayıt olmadan tarayıcıda ücretsiz oyna. Telefonda da çalışır.'
    ld = {"@context": "https://schema.org", "@type": "VideoGame", "name": g['n'], "url": url, "description": g['d'],
          "genre": g['k'], "applicationCategory": "Game", "gamePlatform": "Web browser", "playMode": "SinglePlayer",
          "inLanguage": ["tr", "en", "de", "es", "fr", "pt", "ru", "it"], "isAccessibleForFree": True,
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "TRY"},
          "publisher": {"@type": "Organization", "name": "Yaxest Games", "url": BASE}}
    put(p, title, desc, url, ld)

# --- ana sayfa
names = ', '.join(g['n'].replace('Yaxest ', '') for g in games[:8])
idx_title = 'Yaxest Games | Ücretsiz tarayıcı oyunları, indirmeden oyna'
idx_desc = f'Yaxest Games: {len(games)} ücretsiz mini oyun. İndirmeden, kayıt olmadan tarayıcıda oyna. {names} ve daha fazlası. Telefonda da çalışır.'
ld = [{"@context": "https://schema.org", "@type": "WebSite", "name": "Yaxest Games", "alternateName": ["Yaxest", "Yaxest Studio"], "url": BASE,
       "inLanguage": "tr", "description": idx_desc},
      {"@context": "https://schema.org", "@type": "Organization", "name": "Yaxest Games", "url": BASE, "logo": BASE + "icon.svg",
       "sameAs": ["https://www.instagram.com/yaxeststudio/"]},
      {"@context": "https://schema.org", "@type": "ItemList", "name": "Yaxest Games oyunları",
       "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": f'{BASE}{g["id"]}/', "name": g['n']} for i, g in enumerate(games)]}]
p = f'{ROOT}/index.html'
put(p, idx_title, idx_desc, BASE, ld)
s = open(p, encoding='utf-8').read()
# taranabilir statik oyun bağlantıları (oyun kartları JavaScript ile çiziliyor)
s = re.sub(r'<div class="seo-links".*?</div>\n?', '', s, flags=re.S)
links = ' · '.join(f'<a href="{g["id"]}/">{E(g["n"])}</a>' for g in games)
s = s.replace('<footer>', f'<div class="seo-links" role="navigation" aria-label="Tüm oyunlar" style="display:block;max-width:1040px;margin:24px auto 0;padding:0 20px;color:#a9a3cf;font-size:.85rem;line-height:1.9">{links}</div>\n<footer>', 1)
s = s.replace("Örn: Zıpla'da çift zıplama olsun", "Örn: Yeni bir oyun ya da özellik önerisi")
open(p, 'w', encoding='utf-8').write(s)

# --- sitemap + robots
urls = [BASE] + [f'{BASE}{g["id"]}/' for g in games if os.path.exists(f'{ROOT}/{g["id"]}/index.html')] + [BASE + 'magaza/', BASE + 'hesap/', BASE + 'gizlilik.html']
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
    f'<url><loc>{u}</loc><changefreq>weekly</changefreq><priority>{"1.0" if u == BASE else "0.8"}</priority></url>\n' for u in urls) + '</urlset>\n'
open(f'{ROOT}/sitemap.xml', 'w', encoding='utf-8').write(sm)
open(f'{ROOT}/robots.txt', 'w', encoding='utf-8').write(f'User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n')
print('ok', len(games), 'oyun,', len(urls), 'adres')
