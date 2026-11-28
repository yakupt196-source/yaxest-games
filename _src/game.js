/* ===================== YÜZ MÜHÜR: oyun mantığı ===================== */
var DBG={manual:false},T=0,cam={x:0,z:9,yaw:Math.PI,pit:-.08,y:2},keys={},scale=1,qi=0,sx=0,sz=0,stickId=null,stickC=null,lookId=null,lastL=null,paused=false,started=false;
var mobs=[],floats=[],projs=[],tels=[],fx=[],shake=0,AP=LOOKS[0];
function esc(s){return String(s==null?'':s).replace(/[<>&"']/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]})}
function today(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
/* ---- kayıt ---- */
var SK='yx-muhur-v1',S={v:1,nick:'',lv:1,xp:0,gold:60,pot:3,tier:0,arm:0,maxF:1,clr:{},kills:0,bk:0,loot:0,lootV:0,prof:'',oath:0,look:0,seals:0,clan:'',title:'',q:null,ch:1,qual:0,snd:1,net:1,tut:0,play:0,bestF:1};
function load(){try{var o=JSON.parse(localStorage.getItem(SK)||'null');if(o&&o.v===1)for(var k in o)S[k]=o[k]}catch(e){}
 var acc=null;try{acc=window.YXAcct&&YXAcct.state()}catch(e){}
 if(acc&&acc.uid){try{var dj=JSON.parse(localStorage.getItem('yd1-'+acc.uid)||'null');if(dj){if(!S.nick||/^Gezgin/.test(S.nick))S.nick=dj.nick||S.nick;if(dj.ap&&!S.dap){S.dap=dj.ap;S.dcls=dj.cls}}}catch(e){}}
 if(!S.nick)S.nick='Gezgin'+(100+Math.floor(Math.random()*900));S.gold=Math.max(0,S.gold|0)}
function save(){S.play=S.play||0;try{localStorage.setItem(SK,JSON.stringify(S))}catch(e){}}
function sid(){var k='yx-muhur-id';try{var v=localStorage.getItem(k);if(!v){v=Math.random().toString(36).slice(2,10);localStorage.setItem(k,v)}return v}catch(e){return Math.random().toString(36).slice(2,10)}}
var MYID=sid();
/* ---- formüller ---- */
function mxp(l){return 60+45*l}
function maxHP(l){return 100+14*l}
function RLf(f){return 1+(f-1)*.9}
function dm0f(l,t){return 10+3*l+t*(4+.3*l)}
function profMul(k){var p=S.prof;if(k==='dmg')return p==='savasci'?1.12:1;if(k==='heal')return p==='sifaci'?1.35:1;if(k==='buy')return p==='tuccar'?.85:1;if(k==='sell')return p==='tuccar'?1.25:1;if(k==='smith')return p==='demirci'?.8:1;if(k==='hp')return p==='savasci'?1.05:1;return 1}

/* sınıflar: hp, dm, spd, crit, dr(hasar azaltma), ls(can çalma), rg(menzilli: menzil,alan), q/e/r=[menzil|yarıçap,çarpan,ad,ikon], h2(E iyileştirme oranı), h3(R iyileştirme), wp(silah), sh(kalkan) */
var CL={
 warrior:{n:'Savaşçı',i:'⚔️',d:'Dengeli ön saf dövüşçüsü.',hp:1,dm:1,spd:1,crit:0,dr:0,ls:0,wp:'sword_1handed',sh:1,q:[5.2,2.6,'Güçlü Vuruş','✦'],e:[4.6,1.7,'Çevirme','⟳'],r:[9,3.8,'Mühür Patlaması','☄']},
 knight:{n:'Şövalye',i:'🛡️',d:'Dev can ve zırh: ekibin kalkanı. Hasarı azdır.',hp:1.35,dm:.85,spd:.96,crit:0,dr:.14,ls:0,wp:'sword_1handed',sh:1,q:[4.6,2.3,'Kalkan Darbesi','🛡️'],e:[5.2,1.5,'Meydan Okuma','📣'],r:[8,3.2,'Demir Duvar','🏰'],h3:.15},
 berserker:{n:'Berserker',i:'🪓',d:'İki elli balta, can çalar. Yüksek hasar, düşük can.',hp:.88,dm:1.22,spd:1.04,crit:.08,dr:0,ls:.07,wp:'axe_2handed',sh:0,q:[5.8,2.9,'Yarma','🪓'],e:[5.2,2.1,'Girdap','🌪️'],r:[9,4.2,'Kan Öfkesi','🩸']},
 rogue:{n:'Haydut',i:'🗡️',d:'Hızlı hançer, yüksek kritik. Kırılgan.',hp:.82,dm:1.02,spd:1.14,crit:.2,dr:0,ls:0,wp:'dagger',sh:0,q:[4,2.4,'Arkadan Bıçak','🗡️'],e:[4.2,1.9,'Bıçak Fırtınası','✨'],r:[8,3.9,'Gölge Adım','🌑']},
 archer:{n:'Okçu',i:'🏹',d:'Uzak menzil, tek hedef. Yakalanmamaya çalış.',hp:.84,dm:.98,spd:1.08,crit:.12,dr:0,ls:0,rg:[13,0],wp:'staff',sh:0,q:[16,2.6,'Delici Ok','➡️'],e:[6,1.6,'Ok Yağmuru','🌧️'],r:[10,3.8,'Av Mührü','🎯']},
 mage:{n:'Büyücü',i:'🔮',d:'Alan hasarı veren menzilli büyü. En kırılgan sınıf.',hp:.78,dm:1.06,spd:1,crit:.06,dr:0,ls:0,rg:[11,2.6],wp:'staff',sh:0,q:[12,2.6,'Ateş Topu','🔥'],e:[6.2,2.0,'Buz Halkası','❄️'],r:[11,4.4,'Meteor Mührü','☄']},
 cleric:{n:'Şifacı',i:'✨',d:'Kendini ve yakındaki parti arkadaşlarını iyileştirir.',hp:1.05,dm:.78,spd:1,crit:0,dr:.05,ls:0,rg:[8,0],wp:'wand',sh:0,q:[8,2,'Kutsal Mızrak','✝️'],e:[5,1.0,'Şifa Halesi','💚'],r:[9,2.8,'Işık Mührü','☀️'],h2:.16,h3:.3},
 paladin:{n:'Paladin',i:'⚜️',d:'Kutsal kılıç ve kalkan: vurur, iyileşir.',hp:1.2,dm:.96,spd:.98,crit:.03,dr:.08,ls:.03,wp:'sword_1handed',sh:1,q:[5,2.5,'Kutsal Darbe','⚜️'],e:[4.8,1.7,'Adalet Çemberi','⭕'],r:[9,3.6,'Işık Patlaması','🌟'],h3:.2},
 lancer:{n:'Cellat',i:'🗡️',d:'Dev kılıçla uzun menzilli yarma darbeleri.',hp:1.02,dm:1.1,spd:.97,crit:.05,dr:.02,ls:0,wp:'sword_2handed',sh:0,reach:1.3,q:[7,2.7,'Geniş Yarma','🌙'],e:[5.4,1.9,'Çelik Çember','⚙️'],r:[10,4,'Yıkım Mührü','💥']},
 necro:{n:'Gölge Büyücü',i:'💀',d:'Can emer, karanlık büyüyle tek hedefi eritir.',hp:.9,dm:1.0,spd:1,crit:.05,dr:0,ls:.1,rg:[10,1.6],wp:'wand',sh:0,q:[11,2.5,'Ruh Okunu','💀'],e:[6,1.8,'Ölüm Dalgası','🌫️'],r:[10,4,'Ruh Hasadı','👻']}
};
function CLS(){return CL[S.cls]||CL.warrior}
function RB(){var r=typeof RACES!=='undefined'&&RACES[(S.app&&S.app.race)||'human'];return(r&&r.b)||{}}
function PHP(){return Math.round((maxHP(S.lv)*profMul('hp')*CLS().hp*(1+(RB().hp||0))+S.arm*8)*(1+.02*(S.rein|0)))}
function PST(){return Math.round(100+S.lv*.6)}
function feastOn(){return !!(S.feast&&S.feast>Date.now())}
function PDM(){return dm0f(S.lv,S.tier)*profMul('dmg')*CLS().dm*(1+(RB().dm||0))*(1+.02*(S.hone|0))*(feastOn()?1.12:1)}
function honeCost(n){return Math.round(300*Math.pow(1.3,n)*profMul('smith'))}
function armorRed(){return Math.min(.6,S.arm*.045+CLS().dr+(RB().dr||0))}
function wpName(t){return['Demir Kılıç','Çelik Kılıç','Gümüş Kılıç','Mavi Kılıç','Zümrüt Kılıç','Altın Kılıç','Kızıl Kılıç','Gece Kılıcı','Alev Kılıcı','Fırtına Kılıcı','Kristal Kılıç','Yıldız Kılıcı','Ejder Kılıcı','Gölge Kılıcı','Güneş Kılıcı','Ay Kılıcı','Mühür Kılıcı','Kadim Kılıç','Efsane Kılıç','Yaxest Kılıcı','Ezeli Kılıç'][Math.min(20,t)]}
function wpCost(t){return Math.round(150*Math.pow(1.5,t)*profMul('smith'))}
function wpReq(t){return Math.max(1,t*4)}
function arCost(a){return Math.round(120*Math.pow(1.7,a)*profMul('smith'))}
function arReq(a){return 1+a*8}
function potPrice(){return Math.round((28+FL.n*3.2)*profMul('buy'))}
var AN=['Giysi','Deri Zırh','Pekiştirilmiş Deri','Zincir Zırh','Çelik Zırh','Gümüş Zırh','Kadim Zırh','Kristal Zırh','Ejder Pulu Zırhı','Mühür Zırhı','Efsane Zırh'];
/* ---- oyuncu ---- */
var pl={x:0,z:9,yaw:Math.PI,hp:114,mhp:114,st:100,mst:100,mp:0,atk:0,atkCd:0,skill:0,hit:0,comb:0,combT:0,roll:0,rdx:0,rdz:0,iframe:0,ph:0,mv:0,dead:0,hurt:0,fp:false,sk:[0,0,0],potCd:0,stT:0,stun:0,tier:0,chan:0,tp:0,slow:0};
function dress(base,a,oath){var ap=Object.assign({},base);if(a>=2&&!/armor/.test(ap.t)){ap.t=a>=4?'armor':'leather';ap.tc=a>=4?['#8e9aaf','#aab3c2','#d8c070','#6ad0ff','#ff9a4a','#c9a0ff','#ffd23f'][Math.min(6,a-4)]:'#6a4a2a'}
 if(a>=6){ap.hat='helmet';ap.htc='#cfd6e4'}if(a>=8){ap.bk='cape';ap.bkc='#8a1020'}if(oath)ap.hat=a>=6?'helmet':'halo';return ap}
function applyLook(){var base;if(S.lookMode==='diyar'&&S.dap)base=Object.assign({},PRES.basic.ap,S.dap);else base=LOOKS[S.look%LOOKS.length];AP=dress(base,S.arm,S.oath)}
function recalc(){var c_=CLS();['s1','s2','s3'].forEach(function(id,i){var b=document.getElementById(id);if(b&&b.firstChild&&b.firstChild.nodeType===3)b.firstChild.nodeValue=[c_.q,c_.e,c_.r][i][3]});pl.mhp=PHP();pl.mst=PST();pl.tier=S.tier;if(pl.hp>pl.mhp)pl.hp=pl.mhp;applyLook()}
function toast(t,c){var el=$('toast'),d=document.createElement('div');d.textContent=t;if(c)d.style.color=c;el.appendChild(d);setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d)},2800);while(el.children.length>4)el.removeChild(el.firstChild)}
function fl(x,y,z,t,c,s){floats.push({x:x,y:y,z:z,t:t,c:c||'#fff',l:.9,s:s||1})}
function say(t,k){var el=$('cht'),d=document.createElement('div');d.textContent=t;if(k)d.className=k;el.appendChild(d);while(el.children.length>9)el.removeChild(el.firstChild);setTimeout(function(){if(d.parentNode&&el.children.length>0&&Date.now()-d._t>20000)d.parentNode.removeChild(d)},21000);d._t=Date.now()}
function banner(t,sub,ms){var m=$('msg2');m.innerHTML=esc(t)+(sub?'<small>'+esc(sub)+'</small>':'');m.style.display='block';clearTimeout(banner._t);banner._t=setTimeout(function(){m.style.display='none'},ms||3200)}
/* ---- ses ---- */
var AC=null;function snd(k){if(!S.snd)return;try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
 var t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain(),F={hit:[220,90,.1,'square',.08],crit:[520,160,.16,'sawtooth',.1],swing:[300,120,.07,'triangle',.05],hurt:[140,50,.18,'sawtooth',.12],roll:[200,420,.12,'sine',.05],lvl:[440,880,.5,'triangle',.1],boss:[90,45,.8,'sawtooth',.15],pick:[600,900,.1,'sine',.06],open:[200,600,.6,'triangle',.12],skill:[160,420,.2,'sawtooth',.09],nova:[80,500,.5,'sawtooth',.14],pot:[500,700,.2,'sine',.08]}[k];if(!F)return;
 o.type=F[3];o.frequency.setValueAtTime(F[0],t);o.frequency.exponentialRampToValueAtTime(F[1],t+F[2]);g.gain.setValueAtTime(F[4],t);g.gain.exponentialRampToValueAtTime(.0001,t+F[2]+.05);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+F[2]+.08)}catch(e){}}
/* ---- canavar üretimi ---- */
var RANGED={wisp:1,hag:1,imp:1,harpy:1,djinn:1,wraith:1,frostwraith:1,lich:1};
function mkMob(id,x,z,o){var d0=MON[id];if(!d0)return null;o=o||{};var f=o.f||FL.n||1,rl=RLf(f),t=Math.min(20,Math.floor(rl/4.6)),dm0=dm0f(rl,t),hp,dm;
 var d=Object.assign({},d0);d.boss=o.boss?1:0;
 var ease=Math.min(1,.55+f*.12);if(o.boss){hp=Math.round(52*dm0*ease*(f%10===0?2.1:1)*(1+Math.floor(f/100)*.5));dm=maxHP(rl)*.14*ease*(1+Math.min(.5,f/200))}
 else{hp=Math.round(4.2*dm0*d0.hm*.8*(o.elite?3.2:1));dm=maxHP(rl)*.072*Math.max(.7,d0.dm)*(o.elite?1.3:1)*(f<3?.8:1)}
 if(o.elite){d.n='Elit '+d0.n}
 if(o.name)d.n=o.name;if(o.col)d.c=o.col;
 var s=Math.max(.55,d0.sz/20)*(o.boss?1.5+Math.min(.5,f/200):1)*(o.elite?1.3:1);
 return{id:id,d:d,hx:x,hz:z,x:x,z:z,yaw:hash(x,z)*6.28,s:s,hp:hp,mhp:hp,st:0,cd:0,ph:hash(z,x)*6,mv:0,atk:0,dead:0,hurt:0,wt:0,wx:x,wz:z,wind:0,spd:Math.max(2.2,Math.min(6.2,d0.sp/115*3.7)),dmg:Math.round(dm),elite:o.elite?1:0,boss:o.boss?1:0,camp:o.camp==null?-1:o.camp,rl:rl,xv:o.boss?10.2:d0.xp*(o.elite?3:1),gv:d0.g*(o.elite?3:1)*(o.boss?4:1),stun:0,ranged:RANGED[id]&&!o.boss?1:0,rcd:1+Math.random()*2,idx:mobs.length}}
function spawnFloor(){mobs=[];tels=[];projs=[];fx=[];var f=FL.n,R=FL.realm,rn=rng(FL.rnSeed);
 FL.camps.forEach(function(c,ci){var a=R.mobs[Math.floor(rn()*R.mobs.length)],b=R.mobs[Math.floor(rn()*R.mobs.length)],n=3+Math.min(3,Math.floor(f/25))+Math.floor(rn()*2),eliteAt=rn()<.55?Math.floor(rn()*n):-1;
  for(var i=0;i<n;i++){var an=rn()*6.28,r=1.5+rn()*4,m=mkMob(i%2?b:a,c[0]+Math.cos(an)*r,c[1]+Math.sin(an)*r,{f:f,camp:ci,elite:i===eliteAt});if(m)mobs.push(m)}});
 var bid=bossDef(f),B=MON[bid],rr=rng(f*911+3),nm=ADJ[Math.floor(rr()*ADJ.length)]+' '+B.n,rb=f%10===0;
 var bm=mkMob(bid,ARENA[0],ARENA[1]-6,{f:f,boss:1,name:(rb?'Büyük Mühür: ':'Kat '+f+' Muhafızı: ')+nm,col:recolor(B.c,f)});mobs.push(bm);FL.boss=bm;
 mobs.forEach(function(m,i){m.idx=i});FL.bossIdx=bm.idx}
function killReward(m,shared){var rl=m.rl,mul=(S.oath?1.5:1)*(roomOn()?1.1:1),pb=1+.1*Math.max(0,(window.__partyN?window.__partyN():1)-1);
 var K=Math.min(22,6+rl*1.1),xp=Math.max(1,Math.round(mxp(Math.round(rl))/K*(m.xv/1.7)*mul*pb)),g=Math.max(1,Math.round(m.gv*(3+rl*.8)*.7*(.7+Math.random()*.6)*mul));
 S.xp+=xp;S.gold+=g;S.kills++;S.q&&(S.q.k++);fl(m.x,H(m.x,m.z)+2.4,m.z,'+'+g+'🪙',  '#ffd23f',1);toast('+'+g+' 🪙  +'+xp+' XP','#ffd98a');
 var lc=m.boss?1:m.elite?.7:.14;if(Math.random()<lc){var n=m.boss?4:1;S.loot+=n;S.lootV+=Math.round(n*(3+rl*1.5)*(1+Math.random())*(m.boss?3:1))}
 if(Math.random()<(m.boss?1:m.elite?.4:.05)){var np=m.boss?3:1;S.pot=Math.min(potMax(),S.pot+np);toast('+'+np+' 🧪 iksir','#ff9a9a')}
 if(!m.boss){var w=m.elite?3:1;FL.seal=Math.min(FL.need,FL.seal+w);if(FL.seal>=FL.need&&!FL.open)openGate()}
 while(S.xp>=mxp(S.lv)){S.xp-=mxp(S.lv);S.lv++;recalc();pl.hp=pl.mhp;pl.st=pl.mst;snd('lvl');banner('⭐ Seviye '+S.lv,S.lv===4?'Yeni hamle: ⟳ Çevirme':S.lv===8?'Yeni hamle: ☄ Mühür Patlaması':'Gücün arttı',2600);if(window.NET)NET.say('sys','⭐ '+S.nick+' Seviye '+S.lv+' oldu!')}}
function potMax(){return 9+(S.prof==='tuccar'?3:0)}
function openGate(){FL.open=1;colliders=colliders.filter(function(c){return barrier.indexOf(c)<0});snd('open');banner('🔓 Mühür çatladı!','Boss kapısı açıldı: kuzeye, arenaya ilerle',3800);say('🔓 Boss kapısı açıldı. Arena kuzeyde.','sys')}
function bossWake(m){if(m.eng)return;m.eng=1;m.hp=m.mhp;m.bt=2.2;m.phase=0;snd('boss');banner(m.d.n,'Muhafız uyandı!',3600);FL.started=1;if(window.NET)NET.say('sys','⚔ '+S.nick+' '+FL.n+'. kat muhafızına girdi.')}
function bossReset(m){m.eng=0;m.hp=m.mhp;m.x=m.hx;m.z=m.hz-6;m.st=0;tels=tels.filter(function(t){return t.own!==m});mobs=mobs.filter(function(a){return !a.add});mobs.forEach(function(a,i){a.idx=i})}
/* ---- hasar ---- */
function dmgPlayer(amount,src,col){if(pl.dead>0||pl.iframe>0)return;if(inSafe(pl.x,pl.z))return;var a=Math.max(1,Math.round(amount*(1-armorRed()))),bl=pl.guard;
 pl.hp-=a;pl.hurt=.28;pl.stT=.7;shake=Math.max(shake,Math.min(.5,a/pl.mhp*3));fl(pl.x,H(pl.x,pl.z)+2.2,pl.z,'-'+a,'#ff6a6a',1.2);snd('hurt');if(pl.chan>0){pl.chan=0;toast('Işınlanma bozuldu','#ff9a9a')}
 if(pl.hp<=0){pl.hp=0;die()}}
function die(){if(pl.dead>0)return;pl.dead=.001;var lost=Math.floor(S.gold*(S.oath?1:.08));S.gold-=lost;var tx='-'+lost+' 🪙 kaybettin';
 if(S.oath){var nf=Math.max(1,Math.floor(S.maxF*.5));tx+=' · Yemin bozuldu: ilerleme '+S.maxF+' → '+nf+'. kat';S.maxF=nf}
 $('die2').textContent=tx;$('die').style.display='flex';save();if(window.NET)NET.say('sys','💀 '+S.nick+' '+(FL.n?FL.n+'. katta':'')+' yenildi.')}
function respawn(){pl.dead=0;pl.hp=pl.mhp;pl.st=pl.mst;pl.mp=0;$('die').style.display='none';mobs.forEach(function(m){if(m.dead<=0&&!m.add){m.st=0;if(m.boss)bossReset(m)}});tels=[];projs=[];
 if(FL.n>0&&WORLD==='floor'){pl.x=SPAWNP[0];pl.z=SPAWNP[1]-4;cam.yaw=0;pl.yaw=0}else{pl.x=0;pl.z=9}}
function sparks(x,y,z,n,c){for(var i=0;i<n;i++){var a=Math.random()*6.283,s=2+Math.random()*4;fx.push({k:'sp',x:x,y:y,z:z,vx:Math.cos(a)*s,vy:2+Math.random()*3,vz:Math.sin(a)*s,t:0,l:.45+Math.random()*.2,c:c})}}
function dmgMob(m,dm,crit,own){if(m.dead>0||m.hp<=0)return;if(crit)window.__hs=Math.max(window.__hs||0,.07);if(m.boss)window.__hs=Math.max(window.__hs||0,.03);if(m.boss&&!m.eng){bossWake(m)}
 m.hp-=dm;m.hurt=.16;sparks(m.x,H(m.x,m.z)+1.1*m.s,m.z,crit?14:7,crit?[1,.85,.25]:[1,.55,.3]);fl(m.x,H(m.x,m.z)+1.4*m.s+.5,m.z,''+dm,crit?'#ffd23f':'#fff',crit?1.5:1);var dx=m.x-pl.x,dz=m.z-pl.z,l=Math.hypot(dx,dz)||1;if(!m.boss){m.x+=dx/l*.3;m.z+=dz/l*.3}m.st=1;
 if(own&&window.NET)NET.mobHit(m.idx,dm);alertMates(m);
 if(m.hp<=0){sparks(m.x,H(m.x,m.z)+1,m.z,m.boss?60:22,[.8,.8,1]);if(m.boss)shake=.6;m.dead=.001;m.res=0;killReward(m,!own);if(m.boss)bossDown(m)}}
function alertMates(m){if(m.camp<0)return;mobs.forEach(function(a){if(a.camp===m.camp&&a.dead<=0&&a.st===0)a.st=1})}
function bossDown(m){FL.bossDead=1;tels=[];projs=[];mobs.forEach(function(a){if(a.add&&a.dead<=0)a.dead=.001});var f=FL.n,first=!S.clr[f];S.clr[f]=1;S.q&&(S.q.b++,S.q.c++);
 S.maxF=Math.max(S.maxF,f+1);var bg=Math.round(60*RLf(f)*(first?1.5:.5)*(S.oath?1.5:1));S.gold+=bg;
 if(first){S.seals++;banner('🏆 '+f+'. KAT FETHEDİLDİ','Mühür kırıldı ('+S.seals+'/100) · +'+bg+' 🪙',5200);if(window.NET)NET.say('sys','🏆 '+S.nick+' '+f+'. katın mührünü kırdı!');
  var rm=Math.floor(f/10);if(f%10===0){S.title=realmOf(f).n+' Fatihi';banner('👑 '+realmOf(f).n+' fethedildi','Unvan: '+S.title,6000)}}
 else banner('✔ Muhafız yenildi','+'+bg+' 🪙',3500);
 if(f===100)setTimeout(function(){banner('🌟 YÜZ MÜHÜR KIRILDI','Kule Fatihi oldun. Sonsuz Kule: üst katlar açık.',9000)},3800);
 snd('open');save()}
function inSafe(x,z){if(WORLD==='town')return x*x+z*z<24*24||(Math.abs(x)<14&&z<-34);return inPlaza(x,z)}
/* ---- oyuncu eylemleri ---- */
function useSt(c){if(pl.st<c){pl.stFlash=.4;return false}pl.st-=c;pl.stT=.6;return true}
function doAttack(skill){if(pl.dead>0||paused||pl.roll>0||pl.atk>0&&skill===0)return;if(pl.atkCd>0)return;
 if(skill===0){if(!useSt(8))return;pl.skill=0;pl.combT=1.1;pl.comb=(pl.comb%3)+1;pl.atkCd=.34;pl.atk=.001;pl.hit=0;snd('swing')}
 else{var id=skill-1;if(pl.sk[id]>0)return;if(skill===2&&S.lv<4){toast('Çevirme: 4. seviyede açılır','#ffd98a');return}if(skill===3&&S.lv<8){toast('Mühür Patlaması: 8. seviyede açılır','#ffd98a');return}
  if(skill===3&&pl.mp<100){toast('Mühür gücü dolmadı ('+Math.floor(pl.mp)+'%)','#b48cff');return}
  var cost=[20,28,0][id];if(!useSt(cost))return;pl.skill=skill;pl.sk[id]=[5,9,3][id];pl.atkCd=[.6,.7,.8][id];pl.atk=.001;pl.hit=0;snd(skill===3?'nova':'skill');if(skill===3)pl.mp=0}}
function applyHit(){var c=CLS(),dm0=PDM(),fx_=Math.sin(pl.yaw),fz=-Math.cos(pl.yaw),sk=pl.skill,hits=0,cc=.15+c.crit+(S.prof==='savasci'?.06:0),dealt=0,first=null;
 if(sk===0&&c.rg){var bd=c.rg[0]+1;mobs.forEach(function(m){if(m.dead>0)return;var dx=m.x-pl.x,dz=m.z-pl.z,l=Math.hypot(dx,dz);if(l<bd&&l>.1&&(dx*fx_+dz*fz)/l>.8){bd=l;first=m}})}
 mobs.forEach(function(m){if(m.dead>0)return;var dx=m.x-pl.x,dz=m.z-pl.z,l=Math.hypot(dx,dz)-m.s*.5,ok=false,mult=1,rc=c.reach||1;
  if(sk===0){if(c.rg){if(first&&(m===first||(c.rg[1]>0&&Math.hypot(m.x-first.x,m.z-first.z)<c.rg[1]))){ok=true;mult=pl.comb===3?1.6:1}}
   else{var rng_=(pl.comb===3?3.9:3.1)*rc;if(l<rng_&&(l<.8||(dx*fx_+dz*fz)/Math.hypot(dx,dz)>(pl.comb===3?-.1:.35))){ok=true;mult=pl.comb===3?1.7:pl.comb===2?1.1:1}}}
  else if(sk===1){if(l<c.q[0]&&(l<.8||(dx*fx_+dz*fz)/Math.hypot(dx,dz)>(c.rg?.7:.45))){ok=true;mult=c.q[1]}}
  else if(sk===2){if(l<c.e[0]){ok=true;mult=c.e[1]}}
  else if(sk===3){if(l<c.r[0]){ok=true;mult=c.r[1]}}
  if(!ok)return;var crit=Math.random()<cc,dm=Math.max(1,Math.round(dm0*mult*(.88+Math.random()*.24)*(crit?1.8:1)));hits++;dealt+=dm;
  if(sk===3){m.stun=1.8}if(c.rg&&sk===0)sparkLine(pl.x,pl.z,m.x,m.z,c.i);dmgMob(m,dm,crit,true);if(sk===0)pl.mp=Math.min(100,pl.mp+(crit?8:5))});
 if(sk===0&&c.rg&&first==null)sparkLine(pl.x,pl.z,pl.x+fx_*c.rg[0],pl.z+fz*c.rg[0],c.i);
 if(dealt&&c.ls)pl.hp=Math.min(pl.mhp,pl.hp+dealt*c.ls*(sk===3&&S.cls==='berserker'?2.5:1));
 if(sk===2&&c.h2){pl.hp=Math.min(pl.mhp,pl.hp+pl.mhp*c.h2*profMul('heal'));fl(pl.x,H(pl.x,pl.z)+2.6,pl.z,'+'+Math.round(pl.mhp*c.h2),'#7dffa0',1.2);if(window.NET&&NET.heal)NET.heal(c.h2)}
 if(sk===3&&c.h3){pl.hp=Math.min(pl.mhp,pl.hp+pl.mhp*c.h3);fl(pl.x,H(pl.x,pl.z)+2.6,pl.z,'+'+Math.round(pl.mhp*c.h3),'#7dffa0',1.2)}
 if(hits){snd(sk?'skill':'hit');shake=Math.max(shake,sk===3?.5:.12)}
 if(sk===3){fx.push({x:pl.x,z:pl.z,t:0,k:'nova',l:.7});}if(sk===2)fx.push({x:pl.x,z:pl.z,t:0,k:'spin',l:.4})}
function sparkLine(x0,z0,x1,z1,ic){var n=10,col=ic==='🔥'?[1,.5,.15]:ic==='❄️'?[.6,.85,1]:ic==='💀'||ic==='👻'?[.6,.3,.9]:ic==='✨'||ic==='✝️'?[.6,1,.7]:[.9,.9,.7];for(var i=0;i<n;i++){var t=i/n;fx.push({k:'sp',x:x0+(x1-x0)*t,y:H(x0,z0)+1.3,z:z0+(z1-z0)*t,vx:0,vy:.4,vz:0,t:-i*.012,l:.35,c:col})}}
function doRoll(){if(pl.dead>0||paused||pl.roll>0||pl.atk>0&&pl.atk<.45)return;if(!useSt(24))return;var mx=(keys.KeyD?1:0)-(keys.KeyA?1:0)+sx,mz=(keys.KeyS?1:0)-(keys.KeyW?1:0)+sz,l=Math.hypot(mx,mz),fx_=Math.sin(cam.yaw),fz=-Math.cos(cam.yaw),rx=Math.cos(cam.yaw),rz=Math.sin(cam.yaw);
 if(l<.15){pl.rdx=Math.sin(pl.yaw);pl.rdz=-Math.cos(pl.yaw)}else{mx/=l;mz/=l;pl.rdx=mx*rx-mz*fx_;pl.rdz=mx*rz-mz*fz}
 pl.yaw=Math.atan2(pl.rdx,-pl.rdz);pl.roll=.42;pl.iframe=.3;pl.atk=0;snd('roll')}
function usePotion(){if(pl.dead>0||pl.potCd>0)return;if(S.pot<=0){toast('İksirin kalmadı. Tüccardan al.','#ff9a9a');return}if(pl.hp>=pl.mhp-1){toast('Canın zaten dolu','#ffd98a');return}
 S.pot--;pl.potCd=2.5;var h=Math.round(pl.mhp*.45*profMul('heal'));pl.hp=Math.min(pl.mhp,pl.hp+h);fl(pl.x,H(pl.x,pl.z)+2.2,pl.z,'+'+h,'#7affc0',1.2);snd('pot')}
/* ---- etkileşim ---- */
function nearIA(){var best=null,bd=1e9;IA.forEach(function(a){if(a.lock&&!FL.bossDead)return;if((a.lvl|0)!==(window.__upY?1:0)&&(a.k==='up'||a.k==='down'||a.k==='bed'))return;var d=Math.hypot(a.x-pl.x,a.z-pl.z);if(d<a.r&&d<bd){bd=d;best=a}});return best}
function doInteract(){if(pl.dead>0||paused)return;var a=nearIA();if(!a)return;
 if(a.k==='npc'){var m={merchant:'shop',smith:'smith',guild:'guild',inn:'inn',quest:'quest',guard:'gate'}[a.id];if(a.id==='guard'&&WORLD==='town'){openPanel('gate');return}openPanel(m)}
 else if(a.k==='up'){window.__upY=3.15;var qq=hin(a.h,a.tx,a.tz);pl.x=qq[0];pl.z=qq[1];toast('⬆ Üst kat','#ffd98a')}
 else if(a.k==='down'){window.__upY=0;var q2=hin(a.h,a.tx,a.tz);pl.x=q2[0];pl.z=q2[1]}
 else if(a.k==='bed'){if(roomOn()&&S.room.n===a.n){pl.hp=pl.mhp;pl.st=pl.mst;S.pot=Math.max(S.pot,3);toast('🛏 İyi dinlendin. Can ve dayanıklılık doldu.','#ffd98a');snd('pick');save()}else toast('Bu oda senin değil. Han Sahibi’nden kirala.','#ff9a9a')}
 else if(a.k==='fire'){pl.hp=pl.mhp;pl.st=pl.mst;pl.mp=Math.max(pl.mp,0);S.pot=Math.max(S.pot,3);toast('🔥 Dinlendin. Can ve dayanıklılık doldu.','#ffd98a');save()}
 else if(a.k==='town'){startTown(true)}
 else if(a.k==='next'){enterFloor(FL.n+1)}}
function startChannel(){if(pl.chan>0)return;pl.chan=5;toast('Şehre ışınlanıyorsun (5 sn). Hasar alırsan bozulur.','#9ad0ff')}
/* ---- dünya geçişleri ---- */
var WORLD='town';
function placeCam(){cam.x=pl.x;cam.z=pl.z}
function startTown(fromTower){WORLD='town';window.__upY=0;FL.n=0;buildTown();pl.x=0;pl.z=fromTower?-42:9;pl.yaw=fromTower?Math.PI:0;cam.yaw=fromTower?Math.PI:0;cam.pit=-.1;mobs=[];tels=[];projs=[];fx=[];pl.hp=Math.max(pl.hp,pl.mhp*.5);
 $('fname').textContent='Başlangıç Şehri';$('fsub').textContent='Güvenli bölge · Kule Kapısı kuzeyde';$('seal').style.display='none';$('bossb').style.display='none';if(window.NET)NET.setLoc();save()}
function enterFloor(f){f=Math.max(1,Math.min(f,S.maxF));if(f>S.maxF)return;WORLD='floor';buildFloor(f);spawnFloor();pl.x=SPAWNP[0];pl.z=SPAWNP[1]-5;pl.yaw=0;cam.yaw=0;cam.pit=-.12;pl.chan=0;pl.hp=Math.max(pl.hp,pl.mhp*.6);
 var R=FL.realm;$('fname').textContent='Kat '+f+' · '+R.n;$('fsub').textContent=(f%10===0?'⚠ Büyük Mühür katı':'Her katta bir muhafız')+' · Önerilen Sv '+Math.round(RLf(f));$('seal').style.display='block';
 banner('KAT '+f,R.n+(f%10===0?' · BÜYÜK MÜHÜR':''),3000);if(window.NET)NET.setLoc();save()}
/* ---- görevler ---- */
function ensureQ(){var d=today();if(!S.q||S.q.d!==d){S.q={d:d,k:0,b:0,c:0,cl:[0,0,0]}}}
var QDEF=[{n:'30 canavar avla',key:'k',goal:30,g:150,p:2},{n:'1 muhafız yen',key:'b',goal:1,g:300,p:3},{n:'2 kat fethet',key:'c',goal:2,g:450,p:3}];
/* ---- güncelleme ---- */
function stepPlayer(dt){if(window.__hs>0){window.__hs-=dt;dt*=.12}
 if(S.q&&S.q.d!==today())ensureQ();
 var run=1,spd=4.4*CLS().spd*(1+(RB().sp||0)),mx=(keys.KeyD?1:0)-(keys.KeyA?1:0)+sx,mz=(keys.KeyS?1:0)-(keys.KeyW?1:0)+sz;
 if(pl.dead>0){pl.dead+=dt;mx=mz=0;if(pl.dead>3.2)respawn()}
 var l=Math.hypot(mx,mz);if(l>1){mx/=l;mz/=l}
 var fx_=Math.sin(cam.yaw),fz=-Math.cos(cam.yaw),rx=Math.cos(cam.yaw),rz=Math.sin(cam.yaw);
 var wx=(mx*rx-mz*fx_),wz=(mx*rz-mz*fz),mvv=Math.min(1,Math.hypot(mx,mz));
 if(pl.stun>0){pl.stun-=dt;mvv=0;wx=wz=0}
 if(pl.atk>0)mvv*=.3;if(pl.slow>0){pl.slow-=dt;mvv*=.6}
 if(pl.roll>0){pl.roll-=dt;pl.x+=pl.rdx*11*dt;pl.z+=pl.rdz*11*dt;mvv=1;pl.iframe=Math.max(pl.iframe-dt,0)}else{pl.x+=wx*spd*dt;pl.z+=wz*spd*dt;pl.iframe=Math.max(0,pl.iframe-dt)}
 if(mvv>.05&&pl.roll<=0){var ta=Math.atan2(wx,-wz),da=ta-pl.yaw;da=Math.atan2(Math.sin(da),Math.cos(da));pl.yaw+=da*Math.min(1,dt*12)}
 if(pl.atk>0&&pl.skill===0&&WORLD==='floor'){var best=null,bd=4;mobs.forEach(function(m){if(m.dead>0)return;var d=Math.hypot(m.x-pl.x,m.z-pl.z);if(d<bd){bd=d;best=m}});if(best&&pl.atk<.3){var ta2=Math.atan2(best.x-pl.x,-(best.z-pl.z)),d2=Math.atan2(Math.sin(ta2-pl.yaw),Math.cos(ta2-pl.yaw));pl.yaw+=d2*Math.min(1,dt*18)}}
 for(var i=0;i<colliders.length;i++){var q=colliders[i];if((q[3]|0)!==(window.__upY?1:0))continue;var dx=pl.x-q[0],dz=pl.z-q[1],ll=Math.hypot(dx,dz),r=q[2]+.4;if(ll<r&&ll>1e-4){pl.x=q[0]+dx/ll*r;pl.z=q[1]+dz/ll*r}}
 var lim=WP.lim,l2=Math.hypot(pl.x,pl.z);if(l2>lim){pl.x*=lim/l2;pl.z*=lim/l2}
 pl.mv+=(mvv-pl.mv)*Math.min(1,dt*10);pl.ph+=dt*8*pl.mv;
 pl.atkCd=Math.max(0,pl.atkCd-dt);pl.hurt=Math.max(0,pl.hurt-dt);pl.potCd=Math.max(0,pl.potCd-dt);pl.stT=Math.max(0,pl.stT-dt);pl.stFlash=Math.max(0,(pl.stFlash||0)-dt);for(var k=0;k<3;k++)pl.sk[k]=Math.max(0,pl.sk[k]-dt);
 if(pl.combT>0){pl.combT-=dt;if(pl.combT<=0)pl.comb=0}
 if(pl.atk>0){pl.atk+=dt/(pl.skill===0?.3:.5);if(!pl.hit&&pl.atk>.45){pl.hit=1;applyHit()}if(pl.atk>=1)pl.atk=0}
 if(pl.dead<=0)pl.st=Math.min(pl.mst,pl.st+(pl.stT<=0?28:9)*dt);
 if(pl.dead<=0){var rg=inSafe(pl.x,pl.z)?pl.mhp*.04:pl.mhp*.003;pl.hp=Math.min(pl.mhp,pl.hp+rg*dt)}
 if(pl.chan>0&&pl.dead<=0){pl.chan-=dt;if(pl.chan<=0){pl.chan=0;startTown(false)}}
 if(WORLD==='floor')stepMobs(dt);
 for(var i=floats.length-1;i>=0;i--){var f=floats[i];f.l-=dt;f.y+=dt*1.1;if(f.l<=0)floats.splice(i,1)}
 for(var i=fx.length-1;i>=0;i--){var q=fx[i];if(q.k==='sp'){q.x+=q.vx*dt;q.z+=q.vz*dt;q.y+=q.vy*dt;q.vy-=12*dt}fx[i].t+=dt;if(fx[i].t>fx[i].l)fx.splice(i,1)}shake=Math.max(0,shake-dt*1.6)}
function safeFor(){return inSafe(pl.x,pl.z)||pl.dead>0}
function stepMobs(dt){var safe=safeFor();
 mobs.forEach(function(m){
  if(m.dead>0){m.dead+=dt;if(m.add){return}if(m.boss)return;if(m.dead>26){m.dead=0;m.hp=m.mhp;m.x=m.hx;m.z=m.hz;m.st=0}return}
  m.hurt=Math.max(0,m.hurt-dt);m.cd=Math.max(0,m.cd-dt);m.stun=Math.max(0,m.stun-dt);var dx=pl.x-m.x,dz=pl.z-m.z,d=Math.hypot(dx,dz);if(d>110){m.mv=0;return}
  if(m.boss){bossAI(m,dt,dx,dz,d,safe);return}
  var aggro=11,tx=m.x,tz=m.z,sp=0;
  if(m.st===1&&(safe||d>28)){m.st=0}
  if(m.st===0&&!safe&&d<aggro&&m.d.dm>0){m.st=1;alertMates(m)}
  var reach=1.3+m.s*.55;
  if(m.stun>0){sp=0}
  else if(m.st===1){
   if(m.ranged){if(d>9){tx=pl.x;tz=pl.z;sp=m.spd}else if(d<5){tx=m.x-dx;tz=m.z-dz;sp=m.spd*.8}m.rcd-=dt;if(m.rcd<=0&&d<14&&!safe){m.rcd=2.3+Math.random()*1.2;var l=d||1;projs.push({x:m.x,z:m.z,vx:dx/l*9,vz:dz/l*9,t:2.2,dmg:m.dmg*.8,c:hx(m.d.c)})}}
   else if(d>reach){tx=pl.x;tz=pl.z;sp=m.spd}else if(m.cd<=0&&m.wind<=0){m.wind=.5}}
  else{m.wt-=dt;if(m.wt<=0){m.wt=2+Math.random()*4;var a=Math.random()*6.28,r=Math.random()*4;m.wx=m.hx+Math.cos(a)*r;m.wz=m.hz+Math.sin(a)*r}tx=m.wx;tz=m.wz;sp=Math.hypot(tx-m.x,tz-m.z)>.6?m.spd*.35:0}
  if(m.wind>0){m.wind-=dt;m.atk=Math.max(.01,1-m.wind/.5);if(m.wind<=0){m.atk=0;m.cd=1.3;if(d<reach+.7&&!safe)dmgPlayer(m.dmg,m)}sp=0}
  var ddx=tx-m.x,ddz=tz-m.z,dd=Math.hypot(ddx,ddz);
  if(sp>0&&dd>.05){var ang=Math.atan2(ddx,-ddz);m.yaw+=Math.atan2(Math.sin(ang-m.yaw),Math.cos(ang-m.yaw))*Math.min(1,dt*9);m.x+=ddx/dd*sp*dt;m.z+=ddz/dd*sp*dt;mobCollide(m)}
  else if(m.st===1&&d<=reach){var an2=Math.atan2(dx,-dz);m.yaw+=Math.atan2(Math.sin(an2-m.yaw),Math.cos(an2-m.yaw))*Math.min(1,dt*9)}
  m.mv+=((sp>0?1:0)-m.mv)*Math.min(1,dt*8);m.ph+=dt*(6+m.spd)*m.mv+dt*1.2});
 /* mermiler */
 for(var i=projs.length-1;i>=0;i--){var p=projs[i];p.t-=dt;p.x+=p.vx*dt;p.z+=p.vz*dt;if(!safe&&Math.hypot(p.x-pl.x,p.z-pl.z)<.9){dmgPlayer(p.dmg);projs.splice(i,1);continue}if(p.t<=0)projs.splice(i,1)}
 /* telegraflar */
 for(var i=tels.length-1;i>=0;i--){var t=tels[i];t.t+=dt;if(t.t>=t.dur){tickTel(t);tels.splice(i,1)}}
 /* arka plan: skor/ekran */
}
function mobCollide(m){for(var i=0;i<colliders.length;i++){var q=colliders[i];if(q[3])continue;var dx=m.x-q[0],dz=m.z-q[1],ll=Math.hypot(dx,dz),r=q[2]+.5*m.s;if(ll<r&&ll>1e-4){m.x=q[0]+dx/ll*r;m.z=q[1]+dz/ll*r}}}
/* ---- boss ---- */
function bossAbil(f){var a=['slam','charge'];if(f>=6)a.push('nova');if(f>=15)a.push('summon');if(f>=30)a.push('meteor');if(f%10===0){['nova','summon','meteor'].forEach(function(k){if(a.indexOf(k)<0)a.push(k)})}return a}
function bossAI(m,dt,dx,dz,d,safe){
 var inArenaP=Math.hypot(pl.x-ARENA[0],pl.z-ARENA[1])<20;
 if(!m.eng){if(FL.open&&inArenaP&&!safe&&pl.dead<=0)bossWake(m);else{m.mv=0;return}}
 if(pl.dead>0||Math.hypot(pl.x-ARENA[0],pl.z-ARENA[1])>34){m.rst=(m.rst||0)+dt;if(m.rst>4){bossReset(m);m.rst=0}return}m.rst=0;
 var hpp=m.hp/m.mhp,ph=hpp<.33?2:hpp<.66?1:0;if(ph>m.phase){m.phase=ph;banner(ph===2?'☠ Muhafız çılgına döndü!':'⚠ Muhafız güçleniyor',null,1800);shake=.4;m.bt=Math.min(m.bt,.8)}
 var sp0=m.spd*(1+ph*.12),reach=1.6+m.s*.7,en=m.hp<m.mhp*.3;
 m.bt-=dt;m.cd=Math.max(0,m.cd);
 if(m.stun>0){m.mv=0;return}
 if(m.act){m.act.t+=dt;var A=m.act;
  if(A.k==='charge'){var u=A.t-A.dur;if(u>0&&u<.4){var k=u/.4;m.x=A.x0+(A.x1-A.x0)*k;m.z=A.z0+(A.z1-A.z0)*k;m.mv=1;m.ph+=dt*14}if(u>=.4){A.done=1}}
  if(A.k==='slam'&&A.t>A.dur*.7){m.atk=Math.min(1,(A.t-A.dur*.7)/(A.dur*.4+.01))}
  if(A.t>(A.dur+(A.k==='charge'?.5:.45))){m.act=null;m.atk=0;m.bt=Math.max(.7,2.4-ph*.5-FL.n*.005)}
  return}
 var ang=Math.atan2(dx,-dz);m.yaw+=Math.atan2(Math.sin(ang-m.yaw),Math.cos(ang-m.yaw))*Math.min(1,dt*5);
 var sp=0;if(d>reach){sp=sp0;var ddx=dx/d,ddz=dz/d;m.x+=ddx*sp*dt;m.z+=ddz*sp*dt;mobCollide(m)}
 else if(m.cd<=0&&m.wind<=0){m.wind=.7}
 if(m.wind>0){m.wind-=dt;m.atk=Math.max(.01,1-m.wind/.7);sp=0;if(m.wind<=0){m.atk=0;m.cd=1.7-ph*.2;if(d<reach+.8&&!safe)dmgPlayer(m.dmg)}}
 m.mv+=((sp>0?1:0)-m.mv)*Math.min(1,dt*8);m.ph+=dt*(6+m.spd)*m.mv+dt*1.2;
 if(m.bt<=0&&m.wind<=0){var ab=bossAbil(FL.n),k=ab[Math.floor(Math.random()*ab.length)],sc=Math.max(.6,1-FL.n*.004-ph*.08),B=m.dmg;
  if(k==='slam'){tels.push({k:'c',x:m.x,z:m.z,r:5.5+m.s*1.2,t:0,dur:1.15*sc,dmg:B*1.6,own:m});m.act={k:'slam',t:0,dur:1.15*sc}}
  else if(k==='charge'){var l=d||1,tx=m.x+dx/l*Math.min(22,d+5),tz=m.z+dz/l*Math.min(22,d+5);tels.push({k:'l',x:m.x,z:m.z,x2:tx,z2:tz,w:2.2+m.s*.5,t:0,dur:1.0*sc,dmg:B*1.7,own:m});m.act={k:'charge',t:0,dur:1.0*sc,x0:m.x,z0:m.z,x1:tx,z1:tz}}
  else if(k==='nova'){var n=3+ph;for(var i=0;i<n;i++)tels.push({k:'c',x:pl.x+(i?(Math.random()-.5)*7:0),z:pl.z+(i?(Math.random()-.5)*7:0),r:4.2,t:-i*.55,dur:1.05*sc,dmg:B*1.1,own:m});m.act={k:'nova',t:0,dur:n*.55*sc+.4}}
  else if(k==='meteor'){var n=5+ph*2;for(var i=0;i<n;i++){var a=Math.random()*6.28,r=Math.random()*9;tels.push({k:'c',x:pl.x+Math.cos(a)*r,z:pl.z+Math.sin(a)*r,r:3.4,t:-i*.3,dur:1.4*sc,dmg:B*1.0,own:m})}m.act={k:'nova',t:0,dur:n*.3+1.2}}
  else if(k==='summon'){var live=mobs.filter(function(a){return a.add&&a.dead<=0}).length;if(live<4){var R=FL.realm;for(var i=0;i<3;i++){var a=i*2.1,mm=mkMob(R.mobs[Math.floor(Math.random()*R.mobs.length)],m.x+Math.cos(a)*5,m.z+Math.sin(a)*5,{f:FL.n});if(mm){mm.add=1;mm.camp=-1;mm.st=1;mm.idx=mobs.length;mobs.push(mm)}}banner('Muhafız yardım çağırdı!',null,1400)}m.act={k:'summon',t:0,dur:.6};m.bt=3}
  else m.bt=1}
}
function tickTel(t){var hit=false;if(t.k==='c'){hit=Math.hypot(pl.x-t.x,pl.z-t.z)<t.r}
 else{var ax=t.x2-t.x,az=t.z2-t.z,L=Math.hypot(ax,az)||1,u=((pl.x-t.x)*ax+(pl.z-t.z)*az)/(L*L);u=Math.max(0,Math.min(1,u));hit=Math.hypot(pl.x-(t.x+ax*u),pl.z-(t.z+az*u))<t.w}
 fx.push({x:t.x,z:t.z,t:0,k:t.k==='c'?'boom':'dash',l:.35,r:t.r||3});if(t.k==='c')shake=Math.max(shake,.2);
 if(hit&&!safeFor())dmgPlayer(t.dmg)}
setInterval(function(){try{if(S.room&&!roomOn()&&!S.roomX){S.roomX=1;if(typeof HP!=='undefined'&&0){}
 if(WORLD==='town'){var hh=window.__hotelH&&window.__hotelH();if(hh){var dx=pl.x-hh[0],dz=pl.z-hh[1],c=Math.cos(hh[5]),s=Math.sin(hh[5]),lx=dx*c-dz*s,lz=dx*s+dz*c;if(Math.abs(lx)<7.5&&lz<-1.5&&lz>-4.5){var q=hin(hh,0,3.6);pl.x=q[0];pl.z=q[1]}}buildTown()}
 toast('🔑 Oda kiran bitti.','#ffd98a');save()}}catch(e){}},1500);
