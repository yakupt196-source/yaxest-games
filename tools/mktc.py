#!/usr/bin/env python3
"""Tycoon oyunlarını üretir: python3 tools/mktc.py"""
import os,sys,json,html
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from mkroom import ROOT,CSS
C0=[15,120,1100,12e3,130e3,1.4e6,20e6,330e6,5.1e9,75e9]
R0=[.5,4,32,260,2100,16e3,130e3,1e6,8e6,65e6]
G={
'kafe':dict(title='Yaxest Kafe',cur='₺',gold='☕',tap='Kafeye dokun',desc='Küçük bir çay ocağından dünya zincirine: kafeni büyüt, şubeler aç, yeniden doğ.',color='#ff9f43',
 u=[('Çay Ocağı','🍵'),('Simit Tezgâhı','🥯'),('Espresso Makinesi','☕'),('Pasta Vitrini','🍰'),('Teras','🪑'),('Kavurma Atölyesi','🫘'),('İkinci Şube','🏪'),('Franchise','🏬'),('Kahve Plantasyonu','🌴'),('Dünya Zinciri','🌍')],
 walk=dict(e=['🧑‍💼','👩','🧔','👵','🧑‍🎓','🐕'],y=.9,j=10,dir=1),
 bg='''function(x,W,H,t,e){var g=x.createLinearGradient(0,0,0,H);var d=e.day;g.addColorStop(0,'hsl(28,'+(55+d*20)+'%,'+(18+d*34)+'%)');g.addColorStop(1,'hsl(22,40%,'+(10+d*14)+'%)');x.fillStyle=g;x.fillRect(0,0,W,H);
 x.fillStyle='rgba(60,30,12,.55)';x.fillRect(0,H*.88,W,H*.12);x.fillStyle='rgba(255,255,255,.07)';for(var i=0;i<6;i++)x.fillRect(i*W/5.5+10,H*.1,W*.1,H*.16);x.font='20px serif';x.textAlign='center';x.fillText('🪴',W*.05,H*.86);x.fillText('🪴',W*.95,H*.86)}'''),
'maden':dict(title='Yaxest Maden',cur='💎',gold='💠',tap='Kazmaya dokun',desc='Kürekle başla, yeraltı şehri ve çekirdek reaktörüne kadar kaz. Elmaslar seni bekliyor.',color='#8d6e63',
 u=[('Kürek','⛏️'),('Matkap','🔩'),('Vagon','🚃'),('Kazıcı Robot','🤖'),('Dinamit Ekibi','🧨'),('Asansör Kuyusu','🛗'),('Eritme Fırını','🔥'),('Lazer Kazıcı','🔦'),('Yeraltı Şehri','🏙️'),('Çekirdek Reaktörü','⚛️')],
 walk=dict(e=['👷','🚃','🪨','⛏️'],y=.9,j=8,dir=-1),
 bg='''function(x,W,H,t,e){var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3b2a22');g.addColorStop(1,'#140d0a');x.fillStyle=g;x.fillRect(0,0,W,H);
 for(var i=0;i<40;i++){var a=(i*97)%W,b=(i*53)%H;x.fillStyle=i%7?'rgba(255,255,255,.05)':'rgba(120,220,255,'+(.3+.3*Math.sin(t*2+i))+')';x.fillRect(a,b,i%7?3:4,i%7?3:4)}
 x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,H*.9,W,H*.1)}'''),
'studyo':dict(title='Yaxest Stüdyo',cur='$',gold='🎮',tap='Kod yaz',desc='Garajda bir oyun yap, e-spor turnuvalarına ve metaverse’e uzan. Kendi oyun imparatorluğunu kur.',color='#6aa8ff',
 u=[('Garaj Ekibi','🛠️'),('Program Yazılımcı','👨‍💻'),('Grafik Sanatçı','🎨'),('Ses Tasarımcı','🎧'),('Test Takımı','🐞'),('Pazarlama','📣'),('Mobil Oyun','📱'),('Konsol Oyunu','🎮'),('E-Spor Turnuvası','🏆'),('Metaverse','🥽')],
 walk=dict(e=['👾','🕹️','💾','⌨️'],y=.9,j=8,dir=1),
 bg='''function(x,W,H,t,e){var g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#1b1050');g.addColorStop(1,'#07203a');x.fillStyle=g;x.fillRect(0,0,W,H);
 x.strokeStyle='rgba(106,168,255,.13)';x.lineWidth=1;for(var i=0;i<W;i+=24){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}for(var j=0;j<H;j+=24){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke()}
 x.fillStyle='rgba(61,240,255,'+(.15+.1*Math.sin(t*3))+')';x.fillRect(0,H*.9,W,3)}'''),
'koloni':dict(title='Yaxest Koloni',cur='⚡',gold='🌟',tap='Enerji topla',desc='Mars’ta ilk güneş panelinden yıldız gemisi filosuna: uzay kolonini kur ve gezegeni terraform et.',color='#ff7043',
 u=[('Güneş Paneli','☀️'),('Su Çıkarıcı','💧'),('Sera Kubbesi','🌱'),('Madenci Dron','🛸'),('Fabrika','🏭'),('Enerji Santrali','🔋'),('Yörünge İstasyonu','🛰️'),('Işınlanma Kapısı','🌀'),('Terraform Motoru','🪐'),('Yıldız Gemisi Filosu','🚀')],
 walk=dict(e=['👨‍🚀','🤖','🚙','🛸'],y=.9,j=8,dir=1),
 bg='''function(x,W,H,t,e){var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0420');g.addColorStop(.7,'#4a1d2e');g.addColorStop(1,'#a8472b');x.fillStyle=g;x.fillRect(0,0,W,H);
 for(var i=0;i<50;i++){x.fillStyle='rgba(255,255,255,'+(.3+.5*Math.abs(Math.sin(t+i)))+')';x.fillRect((i*131)%W,(i*47)%(H*.6),2,2)}
 x.fillStyle='#c4572f';x.beginPath();x.moveTo(0,H);x.lineTo(0,H*.88);x.quadraticCurveTo(W*.3,H*.82,W*.6,H*.9);x.quadraticCurveTo(W*.85,H*.95,W,H*.86);x.lineTo(W,H);x.fill()}'''),
'sehir':dict(title='Yaxest Şehir',cur='₺',gold='🏗️',tap='Şehri geliştir',desc='Küçük bir dükkândan uzay limanlı metropole: şehrini kur, büyüt, yeniden doğ.',color='#3ddbb0',
 u=[('Küçük Dükkân','🏠'),('Apartman','🏢'),('Market','🛒'),('Otel','🏨'),('Alışveriş Merkezi','🏬'),('Gökdelen','🌆'),('Stadyum','🏟️'),('Havalimanı','✈️'),('Teknoloji Parkı','🏭'),('Uzay Limanı','🚀')],
 walk=dict(e=['🚗','🚕','🚌','🚶','🚲'],y=.9,j=6,dir=1),
 bg='''function(x,W,H,t,e){var d=e.day;var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'hsl(215,60%,'+(10+d*45)+'%)');g.addColorStop(1,'hsl(200,50%,'+(18+d*40)+'%)');x.fillStyle=g;x.fillRect(0,0,W,H);
 for(var i=0;i<14;i++){var h=H*(.22+.3*((i*37)%10)/10);x.fillStyle='rgba(20,16,50,.55)';x.fillRect(i*W/13,H*.85-h,W/16,h);if(d<.5){x.fillStyle='rgba(255,220,100,.6)';for(var k=0;k<h/14;k++)if((k*i)%3)x.fillRect(i*W/13+3,H*.85-h+k*14+3,3,4)}}
 x.fillStyle='#2a2540';x.fillRect(0,H*.85,W,H*.15)}'''),
}
P0={k:1e7 for k in G}
def make(id):
    g=G[id];units=[dict(n=n,i=i,c=C0[k],r=R0[k]) for k,(n,i) in enumerate(g['u'])]
    cfg='window.YXTycoon.start({id:%s,title:%s,cur:%s,gold:%s,tapName:%s,P0:%s,units:%s,walk:%s,bg:%s});'%(json.dumps(id),json.dumps(g['title'],ensure_ascii=False),json.dumps(g['cur'],ensure_ascii=False),json.dumps(g['gold'],ensure_ascii=False),json.dumps(g['tap'],ensure_ascii=False),P0[id],json.dumps(units,ensure_ascii=False),json.dumps(g['walk'],ensure_ascii=False),g['bg'])
    os.makedirs(f'{ROOT}/{id}',exist_ok=True)
    open(f'{ROOT}/{id}/cfg.js','w',encoding='utf-8').write(cfg)
    page=f'''<!DOCTYPE html>
<html lang="tr"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(g['title'])} | Yaxest Games</title>
<meta name="description" content="{html.escape(g['desc'])}">
<meta name="theme-color" content="#0b0820">
<link rel="icon" href="../icon.svg" type="image/svg+xml">
<link rel="manifest" href="../manifest.webmanifest">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;700;800&display=swap" rel="stylesheet">
<style>
{CSS}
</style></head><body class="yx-room">
<div id="tc"></div>
<script src="../games.js"></script><script src="../i18n-dict.js"></script><script src="../i18n.js"></script><script src="../sfx.js"></script><script src="../menu.js"></script><script src="../economy.js"></script><script src="../tycoon.js"></script>
<script src="cfg.js"></script>
</body></html>
'''
    open(f'{ROOT}/{id}/index.html','w',encoding='utf-8').write(page)
for i in G:make(i)
print('tamam',list(G))
