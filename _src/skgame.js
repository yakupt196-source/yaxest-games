/* ---------- iskeletli modelleri oyuna bağlama ---------- */
var SKI={},SKR=['elf_male','elf_female','orc_male','orc_female'],SKT=window.__SKT={swr:[1.5708,0,0],swp:[0,0,0],swt:[0,0,0],shr:[0,1.5708,0],shp:[.12,0,0],sm:1,shs:.42};
function skInst(key,model){var i=SKI[key];if(i&&i.m.name===model)return i;var m=SKN.models[model];if(!m)return null;i=new SKN.Inst(m);SKI[key]=i;i.play('Idle_Shield_Loop',{fade:0});return i}
function skHash(s){var h=0;s=''+s;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
function skMat(x,y,z,yaw,sc,fall,rs){var M=ch(tr(x,y,z),rY(Math.PI-yaw));if(fall)M=ch(M,rX(-fall*1.45),tr(0,-fall*.12,0));rs=rs||[1,1,1];return ch(M,sca(sc*rs[0],sc*rs[1],sc*rs[2]))}
function rotM(a,b,c){return ch(rX(a),rY(b),rZ(c))}
var WPS={Sword:{w:1,sc:.36},Sword_Golden:{w:1,sc:.36},Sword_big:{w:1,sc:.3},Sword_big_Golden:{w:1,sc:.3},Dagger:{w:1,sc:.4},Dagger_Golden:{w:1,sc:.4},Axe_small:{w:1,sc:.42},Axe_small_Golden:{w:1,sc:.42},Axe_Double:{w:1,sc:.36},Axe_Double_Golden:{w:1,sc:.36},Hammer_Double:{w:1,sc:.34},Hammer_Double_Golden:{w:1,sc:.34},Bow_Wooden:{w:1,sc:.5,left:1},Bow_Golden:{w:1,sc:.5,left:1},staff:{sc:.8},wand:{sc:.9},sword_1handed:{sc:.7},sword_2handed:{sc:.7},axe_1handed:{sc:.7},axe_2handed:{sc:.7},dagger:{sc:.7}};
var CWP={warrior:'Sword',knight:'Sword',berserker:'Axe_Double',rogue:'Dagger',archer:'Bow_Wooden',mage:'staff',cleric:'wand',paladin:'Hammer_Double',lancer:'Sword_big',necro:'wand'};
function skProps(tier,shield,cls){var P=[],T=SKT,c=cls||'warrior',nm=CWP[c]||'Sword';if(tier>=10&&WPS[nm+'_Golden'])nm+='_Golden';var d=WPS[nm]||{sc:.7},sc=d.sc;
 P.push({bone:d.left?'hand_l':'hand_r',mesh:nm,w:d.w,lm:ch(rotM(T.swr[0],T.swr[1],T.swr[2]),sca(sc,sc,sc)),tint:null});
 if(shield)P.push({bone:'lowerarm_l',mesh:'shield_round',lm:ch(tr(T.shp[0],T.shp[1],T.shp[2]),rotM(T.shr[0],T.shr[1],T.shr[2]),sca(T.shs,T.shs,T.shs))});return P}

var TONES=[{s:0,t:[1,1,1]},{s:0,t:[.96,.86,.78]},{s:0,t:[.86,.7,.56]},{s:1,t:[1.25,1.1,1]},{s:1,t:[1,.88,.78]},{s:1,t:[.78,.66,.58]}];
var RACES={human:{n:'İnsan',sc:[1,1,1],tint:null,d:'Dengeli. Her ortama uyum sağlar.',b:{hp:.04,dm:.03},bt:'+%4 Can · +%3 Hasar'},elf:{n:'Elf',sc:[.94,1.07,.94],tint:null,d:'Uzun ve zarif. Hızlı ve keskin gözlü.',b:{sp:.06,dm:.04},bt:'+%6 Hız · +%4 Hasar'},orc:{n:'Ork',sc:[1.1,1.06,1.1],tint:[.62,.95,.5],d:'Yeşil tenli, iri ve dayanıklı.',b:{hp:.1},bt:'+%10 Can'},dwarf:{beard:1,n:'Cüce',sc:[1.12,.84,1.16],tint:null,d:'Bodur, sağlam ve inatçı.',b:{dr:.04,hp:.04},bt:'+%4 Savunma · +%4 Can'},imp:{n:'İmp',sc:[1.5,1.5,1.5],tint:null,mdl:'imp',skip:/Mace/,d:'Küçük, çevik ve kızgın bir cin. Zincirli, boynuzlu.',b:{dm:.08,sp:.05},bt:'+%8 Hasar · +%5 Hız'},puglin:{n:'Puglin',sc:[1.4,1.4,1.4],tint:null,mdl:'puglin',skip:/Stick/,d:'Azı dişli, iri bir domuz savaşçı. Dayanıklı.',b:{hp:.08,dr:.03},bt:'+%8 Can · +%3 Savunma'}};
var HAIRS=[['Hair_SimpleParted','Düz'],['Hair_Buzzed','Kısa'],['Hair_BuzzedFemale','Kısa (K)'],['Hair_Long','Uzun'],['Hair_Buns','Topuz']];
var HCOLS=['#3b2a1c','#1c1c1f','#8a5a2b','#c9923e','#d8d4c8','#a02a2a','#2f5fa8','#6b3fa0'];
var APP0={g:'m',race:'human',tone:0,hair:'Hair_SimpleParted',hc:'#3b2a1c',beard:0,outfit:'peasant',ov:0,hood:0};
function hexc(h){return[parseInt(h.substr(1,2),16)/255,parseInt(h.substr(3,2),16)/255,parseInt(h.substr(5,2),16)/255]}
function MODN(ap){var r=RACES[ap.race];if(r&&r.mdl)return r.mdl;return(ap.race==='elf'||ap.race==='orc')?ap.race+'_'+(ap.g==='m'?'male':'female'):'human_'+ap.g}
function appOf(){return Object.assign({},APP0,S.app||{})}
function mkLook(it,app,arm){var key=JSON.stringify(app)+'|'+(arm>=4?1:0)+(arm>=6?1:0)+(arm>=8?1:0);if(it._ak===key)return;it._ak=key;var C=SKN.CH();if(!C)return;var isH=it.m.name.startsWith('human');var g=app.g,m=it.m,P=[],tn=TONES[app.tone%TONES.length],R=RACES[app.race]||RACES.human,tt=tn.t.slice();if(R.tint)tt=[tt[0]*R.tint[0],tt[1]*R.tint[1],tt[2]*R.tint[2]];var hc=hexc(app.hc),hl=hc.map(function(c){return Math.pow(c,2.2)*1.6}),hnd=tn.s===0?[tt[0]*1.7,tt[1]*1.55,tt[2]*1.45]:tt.slice();
 (isH?C.body[g]:[]).forEach(function(me){var mat=me.mat;if(/Eyes/.test(mat))P.push(SKN.partObj(me,m,me.tex,null,0));else if(/Hair/.test(mat))P.push(SKN.partObj(me,m,me.tex,hl,1));else P.push(SKN.partObj(me,m,me.tex[tn.s],tt,0,'body_'+g+'_n.jpg'))});
 var hr=isH?C.hair[app.hair]:null;if(hr)hr.forEach(function(me){P.push(SKN.partObj(me,m,me.tex,hl,1))});if(isH&&(app.beard||R.beard)&&g==='m'&&C.hair.Hair_Beard)C.hair.Hair_Beard.forEach(function(me){P.push(SKN.partObj(me,m,me.tex,hl,1))});
 var g2=it.m.name.indexOf('female')>=0?'f':g,pre=g2==='m'?'Male_':'Female_',tp=app.top||app.outfit||'peasant',lg=app.legs||app.outfit||'peasant',ft=app.feet||app.outfit||'peasant';if(arm>=4){tp=lg=ft='ranger'}
 var ov=app.ov?1:0,oc=app.oc?hexc(app.oc):null,bel=app.belt==null?tp==='ranger':!!app.belt,brc=app.brac==null?tp==='ranger':!!app.brac,hood=!!app.hood||arm>=8,paul=!!app.paul||arm>=6;
 function addP(set,re){(C.outf[pre+set]||[]).forEach(function(me){if(!re.test(me.name))return;var tx=Array.isArray(me.tex)?me.tex[ov]:me.tex,isHand=!Array.isArray(me.tex),po=SKN.partObj(me,m,tx,isHand?hnd:(arm>=8?[1.25,1.1,.8]:oc),0);po.infl=isHand?0:(/Pauldron/.test(me.name)?.01:.009);P.push(po)})}
 function cap(x){return x==='ranger'?'Ranger':'Peasant'}
 var isO=isH||/^(elf|orc)_/.test(it.m.name);if(isO){addP(cap(tp),/_Body$|_Arms$/);addP(cap(lg),/_Legs$/);addP(cap(ft),/_Feet/)}
 if(isO&&bel)addP('Ranger',/Belt/);if(isO&&brc)addP('Ranger',/Bracer/);if(isO&&hood)addP('Ranger',/Hood/);if(isO&&paul)addP('Ranger',/Pauldron/);
 it.parts=P;it.rs=(isH||R.mdl)?R.sc:(isO?[1,1,1]:[1,1,1])}
var SKP={a:0,comb:0,roll:0,dead:0};
function skPlayer(dt){if(!SKN.ready())return false;var ap=appOf(),key='me',mod=MODN(ap),it=skInst(key,mod);if(!it)return false;mkLook(it,ap,S.arm|0);var st=it.st||(it.st={a:0,roll:0,dead:0,fall:0});
 var mv=pl.mv||0;
 if(pl.dead>0){if(!st.dead){st.dead=1;it.play('Hit_Knockback',{loop:0,speed:.9,fade:.08})}st.fall=Math.min(1,st.fall+dt*1.6)}
 else{if(st.dead){st.dead=0;st.fall=0;it.play('Idle_Shield_Loop',{force:1})}
  st.fall=Math.max(0,st.fall-dt*3);
  if(pl.roll>0){if(!st.roll){st.roll=1;it.play('Sword_Dash',{loop:0,speed:2.6,fade:.05,force:1})}}
  else{st.roll=0;
   if(pl.atk>0){if(!st.a){st.a=1;var sk=pl.skill;if(sk===0){var c=pl.comb||1;it.play(c===1?'Sword_Regular_A':c===2?'Sword_Regular_B':'Sword_Regular_C',{loop:0,speed:c===1?1.45:c===2?1.8:3.2,fade:.04,force:1})}else if(sk===1)it.play('Sword_Heavy_Combo',{loop:0,speed:4,fade:.05,force:1});else if(sk===2)it.play('Melee_Hook',{loop:0,speed:1.1,fade:.05,force:1});else it.play('Shield_OneShot',{loop:0,speed:1.3,fade:.05,force:1})}}
   else{st.a=0;if(!it.cur||it.cur!=='Idle_Shield_Loop'&&(it.done||it.t>it.ad*.0&&(it.loop||it.done)))it.play('Idle_Shield_Loop',{fade:.18})}}}
 it.update(dt,pl.dead>0?0:mv>.05?1:0,mv*1.4+.4);
 var tier=pl.tier||0;SKN.queue(it,skMat(pl.x,H(pl.x,pl.z),pl.z,pl.yaw+(window.__ent?(window.__entSpin||0):0),1,st.fall,it.rs),{skip:(RACES[ap.race]||{}).skip||null,tint:(ap.race==='elf'||ap.race==='orc')?TONES[ap.tone%TONES.length].t.map(function(v){return .55+v*.45}):[1,1,1],hit:pl.hurt>0?.35:0,rim:tier>=12?[.5,.4,.1]:tier>=6?[.12,.2,.35]:[0,0,0],props:skProps(tier,!!CLS().sh,S.cls)});return true}
function skOther(o,dt){var h=skHash(o.id),ap=Object.assign({},APP0,{g:h%2?'m':'f',race:['human','elf','orc','dwarf'][h%4],tone:h%6,hair:HAIRS[h%5][0],hc:HCOLS[h%8],outfit:h%3?'peasant':'ranger',ov:h%2}),it=skInst('o'+o.id,MODN(ap));if(!it)return false;mkLook(it,ap,o.arm|0);var mv=o.mv||0;
 if(o.atk>0)it.play('Sword_Regular_A',{loop:0,speed:1.5,fade:.05});else if(it.cur!=='Idle_Shield_Loop'&&(it.done||it.loop))it.play('Idle_Shield_Loop');
 it.update(dt,mv>.05?1:0,mv*1.4+.4);SKN.queue(it,skMat(o.x,H(o.x,o.z),o.z,o.yaw,1,0,it.rs),{tint:[1,1,1],props:skProps(o.tier||0,true)});return true}
var NPCA={hasan:3,ayten:5,orhan:6,nuri:1,elif:2,guard:7};var NPCM={hasan:'orc_male',ayten:'orc_female',orhan:'elf_male',nuri:'orc_male',elif:'elf_female',guard:'orc_male'};
var NPCAPP={hasan:{g:'m',race:'dwarf',tone:2,hair:'Hair_Buzzed',hc:'#8a5a2b',beard:1,outfit:'peasant',ov:1},ayten:{g:'f',race:'human',tone:4,hair:'Hair_Buns',hc:'#1c1c1f',outfit:'ranger',ov:0},orhan:{g:'m',race:'human',tone:1,hair:'Hair_SimpleParted',hc:'#d8d4c8',beard:1,outfit:'ranger',ov:1},nuri:{g:'m',race:'orc',tone:0,hair:'Hair_Buzzed',hc:'#1c1c1f',outfit:'peasant',ov:0},elif:{g:'f',race:'elf',tone:0,hair:'Hair_Long',hc:'#c9923e',outfit:'peasant',ov:1},guard:{g:'m',race:'human',tone:3,hair:'Hair_Buzzed',hc:'#1c1c1f',outfit:'ranger',ov:1,hood:1}};
function skNpc(n,x,y,z,yaw,dt){var ap=Object.assign({},APP0,NPCAPP[n.id]||{}),it=skInst('n'+n.id,MODN(ap));if(!it)return false;mkLook(it,ap,n.id==='guard'?8:NPCA[n.id]||2);it.update(dt,0,0);SKN.queue(it,skMat(x,y,z,yaw,n.big?1.12:1,0,it.rs),{tint:[1,1,1],props:n.id==='ayten'||n.id==='guard'?skProps(n.id==='guard'?14:6,n.id==='guard'):[]});return true}
function skMob(m,dt){if(!SKN.ready())return false;var fam=FAM[m.id]||'biped';if(fam!=='biped')return false;var mod=m.boss?(skHash(m.id)%2?'orc_male':'imp'):(skHash(m.id)%3===0?'puglin':'imp');var it=m._sk;if(!it||it.m.name!==mod){var mm=SKN.models[mod];if(!mm)return false;it=m._sk=new SKN.Inst(mm);it.play('Zombie_Idle_Loop',{fade:0})}var st=it.st||(it.st={a:0,dead:0});
 var k=m.s*(m.boss?.75:.95);
 if(m.dead>0){if(!st.dead){st.dead=1;it.play('Hit_Knockback',{loop:0,speed:.9,fade:.06})}}
 else{if(m.atk>0){if(!st.a){st.a=1;it.play(m.boss&&m.act&&m.act.k==='slam'?'Sword_Heavy_Combo':'Sword_Regular_B',{loop:0,speed:m.boss?2.4:1.6,fade:.05,force:1})}}
  else{st.a=0;if(m.hurt>.1&&it.cur!=='Hit_Knockback')it.play('Hit_Knockback',{loop:0,speed:2.6,fade:.04,force:1});else if(it.cur!=='Idle_Shield_Loop'&&it.cur!=='Zombie_Idle_Loop'&&(it.done||it.loop))it.play('Zombie_Idle_Loop',{fade:.2})}}
 it.update(dt,m.dead>0?0:m.mv>.05?1:0,m.mv*1.2+.4);var d=m.d,c=hx(d.c),tint=m.boss?[1.2,.8,.8]:[.55+c[0]*.9,.55+c[1]*.9,.55+c[2]*.9];
 if(m.dead>1.5)return true;var fall=m.dead>0?Math.min(1,m.dead*2.2):0,y=H(m.x,m.z)-(m.dead>.7?(m.dead-.7)*1.4:0);
 SKN.queue(it,skMat(m.x,y,m.z,m.yaw,k,fall),{tint:tint,hit:m.hurt>0?.4:0,rim:m.boss?[.6,.1,.05]:m.elite?[.5,.4,.1]:[0,0,0],props:null});return true}
