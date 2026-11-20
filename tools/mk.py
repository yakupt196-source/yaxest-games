#!/usr/bin/env python3
"""Yeni oyun sayfası üretici: ortak başlık/stil + oyunun kendi JS'i (games/<id>.js)."""
import os,sys,re
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS='''*{box-sizing:border-box;margin:0}
html,body{height:100%}
body{background:#14102b;color:#f6f3ff;font-family:"Bricolage Grotesque",system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;overflow:hidden;touch-action:none;overscroll-behavior:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}
header{width:100%;max-width:480px;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 14px;font-weight:700;font-size:.95rem}
header a{color:#a9a3cf;text-decoration:none;min-height:44px;display:flex;align-items:center}
.st{color:#ffd23f}
#wrap{flex:1;min-height:0;width:100%;max-width:480px;position:relative}
canvas{width:100%;height:100%;display:block;touch-action:none}
#big{position:absolute;top:3%;left:0;right:0;text-align:center;font-size:3.2rem;font-weight:800;pointer-events:none;text-shadow:0 4px 0 rgba(0,0,0,.25);z-index:2}
#ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:24px;background:rgba(20,16,43,.86);z-index:5}
#ov h2{font-size:2.3rem;font-weight:800;line-height:1}
#ov p{color:#c9c4ee;line-height:1.5;max-width:30ch}
#ov b{color:#ffd23f}
button{font:inherit;font-weight:800;background:#ffd23f;color:#14102b;border:0;border-radius:999px;padding:14px 34px;min-height:48px;cursor:pointer;font-size:1.1rem}
button:focus-visible{outline:3px solid #fff}
.hid{display:none!important}'''
def make(id,name,intro,js):
    html=f'''<!DOCTYPE html>
<html lang="tr"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>{name} | Yaxest Games</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,800&display=swap" rel="stylesheet">
<style>
{CSS}
</style></head><body>
<header><a href="../">← Yaxest Games</a><span class="st"> Rekor <span id="bs">0</span></span></header>
<div id="wrap"><canvas id="c"></canvas><div id="big">0</div>
<div id="ov"><h2 id="ot">{name}</h2><p id="op">{intro}</p><button id="go">Başla</button></div></div>
<script src="../lib.js"></script>
<script>
{js}
</script>
<script src="../games.js"></script><script src="../i18n-dict.js"></script><script src="../i18n.js"></script><script src="../sfx.js"></script><script src="../music.js"></script><script src="../menu.js"></script><script src="../economy.js"></script></body></html>
'''
    os.makedirs(f'{ROOT}/{id}',exist_ok=True)
    open(f'{ROOT}/{id}/index.html','w',encoding='utf-8').write(html)
if __name__=='__main__':
    # games/<id>.js dosyalarından: ilk satır "// NAME|intro html"
    ids=sys.argv[1:] or [f[:-3] for f in sorted(os.listdir(f'{ROOT}/tools/src'))]
    for id in ids:
        src=open(f'{ROOT}/tools/src/{id}.js',encoding='utf-8').read()
        m=re.match(r'// (.+?)\|(.+)\n',src)
        make(id,m[1],m[2],src[m.end():])
        print('yazıldı',id)
