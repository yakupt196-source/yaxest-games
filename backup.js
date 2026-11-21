/* Yaxest yedek: ilerlemeyi (jeton, karakter, tycoon, rekorlar) kısa bir kod/dosya olarak dışa aktarır ve geri yükler. Sunucu yok. */
(function(){
'use strict';
function b64(u){var s='',i;for(i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64(t){t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';var s=atob(t),u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
function hash(s){var h=0x811c9dc5;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}return('00000000'+h.toString(16)).slice(-8)}
function snap(){var o={};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k==='yx-bkt'||k==='yx-msg'||k==='yx-acct'||k==='yx-sync'||k==='yx-bkr')continue;o[k]=localStorage.getItem(k)}}catch(e){}return o}
async function pack(str){var u8=new TextEncoder().encode(str);
  if(window.CompressionStream){var cs=new CompressionStream('deflate-raw'),w=cs.writable.getWriter();w.write(u8);w.close();return'Z'+b64(new Uint8Array(await new Response(cs.readable).arrayBuffer()))}
  return'P'+b64(u8)}
async function unpack(p){var t=p[0],u=unb64(p.slice(1));
  if(t==='P')return new TextDecoder().decode(u);
  if(t==='Z'){if(!window.DecompressionStream)throw new Error('nodec');var ds=new DecompressionStream('deflate-raw'),w=ds.writable.getWriter();w.write(u);w.close();return new TextDecoder().decode(await new Response(ds.readable).arrayBuffer())}
  throw new Error('bad')}
async function make(){var p=await pack(JSON.stringify({v:1,t:Date.now(),d:snap()}));try{localStorage.setItem('yx-bkt',String(Date.now()))}catch(e){}return'YX1-'+p+'-'+hash(p)}
function num(x){return parseFloat(x)||0}
function mergeKey(k,cur,inc){
  if(cur==null)return inc;
  try{
    if(k==='yx-eco'){var a=JSON.parse(cur),b=JSON.parse(inc);return num(b.t)>=num(a.t)?inc:cur}
    if(/^yd1-/.test(k)){var a3=JSON.parse(cur),b3=JSON.parse(inc);if(!a3||!b3)return inc;
      var sa=num(a3.sv),sb=num(b3.sv);if(sa&&sb)return sb>sa?inc:cur;
      var ra=num(a3.lv)*1e9+num(a3.xp),rb=num(b3.lv)*1e9+num(b3.xp);return rb>ra?inc:cur}
    if(/^yx-tc-/.test(k)){var a2=JSON.parse(cur),b2=JSON.parse(inc);return num(b2.all)>=num(a2.all)?inc:cur}
  }catch(e){}
  if(/best$/.test(k)||/^yx-days$/.test(k)&&false){return num(inc)>=num(cur)?inc:cur}
  return inc}
async function parse(code){code=String(code||'').replace(/\s+/g,'');var m=/^YX1-([ZP][A-Za-z0-9_-]+)-([0-9a-f]{8})$/.exec(code);
  if(!m)throw new Error('format');if(hash(m[1])!==m[2])throw new Error('hash');var o=JSON.parse(await unpack(m[1]));if(!o||o.v!==1||!o.d)throw new Error('bad');return o}
var BLOCK={'yx-bkt':1,'yx-msg':1,'yx-acct':1,'yx-sync':1,'yx-bkr':1,'__proto__':1,'constructor':1};
async function restore(code){var o=await parse(code),n=0;for(var k in o.d){if(BLOCK[k]||k.length>80||!Object.prototype.hasOwnProperty.call(o.d,k)||typeof o.d[k]!=='string'||o.d[k].length>2000000)continue;try{var v=mergeKey(k,localStorage.getItem(k),o.d[k]);if(v!==localStorage.getItem(k)){localStorage.setItem(k,v);n++}}catch(e){}}return{keys:n,t:o.t}}
window.YXBackup={make:make,restore:restore,parse:parse,snap:snap,hash:hash};
})();
