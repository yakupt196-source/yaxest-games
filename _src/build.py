import re,sys
base=open('base.html',encoding='utf-8').read().split('\n')
def L(a,b): return '\n'.join(base[a-1:b])   # 1-indexed inclusive
head=open('head.html',encoding='utf-8').read()
parts=[head,"(function(){'use strict';",L(74,79),L(86,112),open('world.js',encoding='utf-8').read()]
sh=L(173,235)
# lamp color + uniform
sh=sh.replace("uniform float uLampI;\\n'","uniform float uLampI;uniform vec3 uLC;\\n'",1)
assert 'uLC' in sh
sh=sh.replace("lp+=vec3(1.,.72,.38)*att","lp+=uLC*att",1); assert 'uLC*att' in sh
old="if(rr<11.5||(abs(w.y)<2.9&&abs(w.x)<62.)||(abs(w.x)<2.9&&abs(w.y)<62.)){"
new="if(uGM<.5||(uGM<1.5&&(rr<11.5||(abs(w.y)<2.9&&abs(w.x)<62.)||(abs(w.x)<2.9&&abs(w.y)<62.)))||(uGM>1.5&&(dot(w-vec2(0.,44.),w-vec2(0.,44.))<81.||dot(w-vec2(0.,-47.),w-vec2(0.,-47.))<289.))){"
new=new.replace('if(uGM<.5||','if(uGM<.5||hh(w)||',1)
assert old in sh; sh=sh.replace(old,new,1)
old="mix(vec3(.12,.28,.08),vec3(.34,.55,.18),h(fi*5.))"; assert old in sh; sh=sh.replace(old,"mix(uGA,uGB,h(fi*5.))",1)
parts.append(sh)
parts.append(L(236,242))
parts.append(L(266,296))
parts.append(L(303,391))
for f in ['game.js','net.js','ui.js','skin.js','skgame.js','loop.js','ent.js','mob.js']:
    parts.append(open(f,encoding='utf-8').read())
parts.append("})();\n</script>\n</body></html>\n")
out='\n'.join(parts)
open(sys.argv[1] if len(sys.argv)>1 else 'out.html','w',encoding='utf-8').write(out)
print(len(out))
