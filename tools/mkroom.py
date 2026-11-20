#!/usr/bin/env python3
"""Oda destekli masa oyunu sayfası üretici. Kullanım: python3 tools/mkroom.py <id> "<Başlık>" "<açıklama>" script1.js script2.js ..."""
import os,sys,html
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS=''':root{--bg:#0b0820;--bg2:#120d2e;--card:#1a1440;--ink:#f6f3ff;--mute:#a9a3cf;--line:rgba(255,255,255,.1);--pink:#ff5c8a;--yellow:#ffd23f;--mint:#3ddbb0;--blue:#6aa8ff;--cyan:#3df0ff}
*{box-sizing:border-box;margin:0}[hidden]{display:none!important}
body{background:var(--bg);color:var(--ink);font-family:"Bricolage Grotesque",system-ui,sans-serif;line-height:1.45;min-height:100vh;-webkit-tap-highlight-color:transparent;background-image:radial-gradient(rgba(255,255,255,.055) 1px,transparent 1.2px);background-size:26px 26px;-webkit-user-select:none;user-select:none}
button{touch-action:manipulation}'''
def make(id,title,desc,scripts):
    s=''.join(f'<script src="{x}"></script>' for x in scripts)
    page=f'''<!DOCTYPE html>
<html lang="tr"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)} | Yaxest Games</title>
<meta name="theme-color" content="#0b0820">
<link rel="icon" href="../icon.svg" type="image/svg+xml">
<link rel="manifest" href="../manifest.webmanifest">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;700;800&display=swap" rel="stylesheet">
<style>
{CSS}
</style></head><body>
<div id="rm"></div>
<script src="../games.js"></script><script src="../i18n-dict.js"></script><script src="../i18n.js"></script><script src="../sfx.js"></script><script src="../menu.js"></script><script src="../economy.js"></script><script src="../room.js"></script>
{s}
</body></html>
'''
    os.makedirs(f'{ROOT}/{id}',exist_ok=True)
    open(f'{ROOT}/{id}/index.html','w',encoding='utf-8').write(page)
if __name__=='__main__':
    id,title,desc=sys.argv[1:4];make(id,title,desc,sys.argv[4:]);print('yazıldı',id)
